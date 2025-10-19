import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const publicDir = path.join(projectRoot, 'public');
const contentDir = path.join(projectRoot, 'src', 'content', 'works');
const localesDir = path.join(projectRoot, 'src', 'locales');
const stylesDir = path.join(projectRoot, 'styles');

const SUPPORTED_LOCALES = ['zh', 'en'];
const DEFAULT_LOCALE = 'zh';

function localeBasePath(locale) {
  return locale === DEFAULT_LOCALE ? '' : `${locale}/`;
}

function pagePath(locale, relativePath) {
  return `${localeBasePath(locale)}${relativePath}`;
}
const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

function escapeHtml(value = '') {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function relativeUrl(from, to) {
  const fromDir = path.posix.dirname(from);
  let relative = path.posix.relative(fromDir, to);
  if (!relative) {
    relative = path.posix.basename(to);
  }
  if (!relative.startsWith('.') && fromDir !== '.') {
    return relative;
  }
  if (!relative.startsWith('.')) {
    return relative;
  }
  return relative;
}

function filePathFromPage(pagePath) {
  return path.join(distDir, ...pagePath.split('/'));
}

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function copyPublic() {
  try {
    await cp(publicDir, distDir, { recursive: true });
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

async function loadLocales() {
  const messages = {};
  for (const locale of SUPPORTED_LOCALES) {
    const localePath = path.join(localesDir, `${locale}.json`);
    const raw = await readFile(localePath, 'utf8');
    messages[locale] = JSON.parse(raw);
  }
  return messages;
}

async function loadWorks() {
  const entries = await readdir(contentDir, { withFileTypes: true });
  const works = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const folder = entry.name;
    const metaPath = path.join(contentDir, folder, 'meta.json');
    const metaRaw = await readFile(metaPath, 'utf8');
    const meta = JSON.parse(metaRaw);
    const slug = meta.slug || folder;
    const content = {};

    for (const locale of SUPPORTED_LOCALES) {
      const markdownPath = path.join(contentDir, folder, `${locale}.md`);
      try {
        const markdown = await readFile(markdownPath, 'utf8');
        content[locale] = md.render(markdown);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
        content[locale] = '';
      }
    }

    works.push({ ...meta, slug, content });
  }

  works.sort((a, b) => {
    if (a.year === b.year) {
      return a.slug.localeCompare(b.slug);
    }
    return b.year - a.year;
  });

  return works;
}

function renderLayout({
  locale,
  title,
  description,
  body,
  currentPath,
  messages,
  activeNav,
  alternatePaths = {}
}) {
  const stylesheet = relativeUrl(currentPath, 'assets/main.css');
  const favicon = relativeUrl(currentPath, 'favicon.svg');

  const navItems = [
    { key: 'gallery', label: messages.navigation.gallery, target: pagePath(locale, 'index.html') },
    { key: 'about', label: messages.navigation.about, target: pagePath(locale, 'about.html') },
    { key: 'contact', label: messages.navigation.contact, target: pagePath(locale, 'contact.html') }
  ];

  const nav = navItems
    .map((item) => {
      const href = relativeUrl(currentPath, item.target);
      const activeClass = item.key === activeNav ? ' active' : '';
      return `        <a class="nav-link${activeClass}" href="${href}">${escapeHtml(item.label)}</a>`;
    })
    .join('\n');

  const languageSwitcher = SUPPORTED_LOCALES.map((loc) => {
    const altTarget = alternatePaths[loc] || pagePath(loc, 'index.html');
    const href = relativeUrl(currentPath, altTarget);
    const isActive = loc === locale ? ' active' : '';
    const label = loc === 'zh' ? '中文' : 'EN';
    return `        <a class="language-option${isActive}" href="${href}">${label}</a>`;
  }).join('\n');

  const alternateLinks = SUPPORTED_LOCALES.map((loc) => {
    const altTarget = alternatePaths[loc];
    if (!altTarget) return '';
    return `  <link rel="alternate" hreflang="${loc}" href="/${altTarget}">`;
  })
    .filter(Boolean)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  ${description ? `<meta name="description" content="${escapeHtml(description)}" />` : ''}
  <link rel="icon" type="image/svg+xml" href="${favicon}" />
  <link rel="stylesheet" href="${stylesheet}" />
${alternateLinks ? `${alternateLinks}\n` : ''}
</head>
<body>
  <div class="layout">
    <header class="navigation">
      <div class="brand">
        <a href="${relativeUrl(currentPath, pagePath(locale, 'index.html'))}">${escapeHtml(messages.brand.title)}</a>
      </div>
      <nav class="nav-links" aria-label="Primary">
${nav}
      </nav>
      <div class="language-switcher">
${languageSwitcher}
      </div>
    </header>
    <main class="content">
      ${body}
    </main>
    <footer class="footer">
      <p>${escapeHtml(messages.footer.copy)}</p>
    </footer>
  </div>
</body>
</html>\n`;
}

function renderGalleryPage({ locale, messages, works, years, selectedYear, currentPath }) {
  const filtered = selectedYear === 'all' ? works : works.filter((item) => item.year === selectedYear);
  const yearLinks = [`<a class="year${selectedYear === 'all' ? ' active' : ''}" href="${relativeUrl(currentPath, pagePath(locale, 'index.html'))}">${escapeHtml(messages.gallery.allYears)}</a>`]
    .concat(
      years.map((year) => {
        const target = pagePath(locale, `gallery/${year}.html`);
        const active = year === selectedYear ? ' active' : '';
        return `<a class="year${active}" href="${relativeUrl(currentPath, target)}">${year}</a>`;
      })
    )
    .join('\n');

  const cards = filtered
    .map((work) => {
      const detailTarget = pagePath(locale, `works/${work.slug}.html`);
      return `<article class="photo-card">
  <a class="photo-card-link" href="${relativeUrl(currentPath, detailTarget)}">
    <div class="image-wrapper orientation-${work.orientation || 'landscape'}">
      <img src="${work.previewImage}" alt="${escapeHtml(work.title[locale])}" loading="lazy" decoding="async" />
    </div>
    <div class="photo-meta">
      <span class="photo-title">${escapeHtml(work.title[locale])}</span>
      <span class="photo-location">${escapeHtml(work.location[locale])}</span>
    </div>
  </a>
</article>`;
    })
    .join('\n');

  const body = `<section class="gallery">
  <aside class="years">
    <span class="years-label">${escapeHtml(messages.gallery.years)}</span>
    ${yearLinks}
  </aside>
  <div class="grid">
    <header class="gallery-header">
      <div class="eyebrow">${escapeHtml(messages.gallery.years)}</div>
      <h1>${escapeHtml(messages.gallery.title)}</h1>
      <p>${escapeHtml(messages.gallery.subtitle)}</p>
    </header>
    <div class="masonry">
      ${cards}
    </div>
  </div>
</section>`;

  const title = `${messages.gallery.title} · ${messages.brand.title}`;
  const description = messages.gallery.subtitle;

  return renderLayout({
    locale,
    title,
    description,
    body,
    currentPath,
    messages,
    activeNav: 'gallery',
    alternatePaths: buildAlternatePaths(currentPath, locale, { type: 'gallery', year: selectedYear })
  });
}

function renderWorkDetail({ locale, messages, work, currentPath }) {
  const metaItems = [
    { label: messages.detail.date, value: work.shootingDate },
    { label: messages.detail.camera, value: work.exif.camera },
    { label: messages.detail.lens, value: work.exif.lens },
    work.exif.focalLength ? { label: messages.detail.focalLength, value: work.exif.focalLength } : null,
    { label: messages.detail.aperture, value: work.exif.aperture },
    { label: messages.detail.shutter, value: work.exif.shutter },
    { label: 'ISO', value: work.exif.iso }
  ].filter(Boolean);

  const meta = metaItems
    .map((item) => `<div class="meta-item"><span class="label">${escapeHtml(item.label)}</span><span>${escapeHtml(item.value)}</span></div>`)
    .join('\n');

  const body = `<section class="detail">
  <p class="back">
    <a href="${relativeUrl(currentPath, pagePath(locale, 'index.html'))}">← ${escapeHtml(messages.detail.back)}</a>
  </p>
  <div class="detail-layout">
    <div class="detail-image">
      <img src="${work.coverImage}" alt="${escapeHtml(work.title[locale])}" loading="lazy" decoding="async" />
    </div>
    <div class="detail-info">
      <header>
        <p class="work-year">${work.year}</p>
        <h1>${escapeHtml(work.title[locale])}</h1>
        <p class="work-location">${escapeHtml(work.location[locale])}</p>
        <p class="work-summary">${escapeHtml(work.summary[locale])}</p>
      </header>
      <div class="meta-grid">
        ${meta}
      </div>
      <div class="description">
        ${work.content[locale]}
      </div>
    </div>
  </div>
</section>`;

  const title = `${work.title[locale]} · ${messages.brand.title}`;
  const description = work.summary[locale];

  return renderLayout({
    locale,
    title,
    description,
    body,
    currentPath,
    messages,
    activeNav: 'gallery',
    alternatePaths: buildAlternatePaths(currentPath, locale, { type: 'work', slug: work.slug })
  });
}

function renderAboutPage({ locale, messages, currentPath }) {
  const body = `<section class="page about">
  <header class="page-header">
    <h1>${escapeHtml(messages.about.title)}</h1>
    <p>${escapeHtml(messages.about.subtitle)}</p>
  </header>
  <div class="about-grid">
    <article class="bio">
      <h2>${escapeHtml(messages.about.storyTitle)}</h2>
      <p>${escapeHtml(messages.about.story1)}</p>
      <p>${escapeHtml(messages.about.story2)}</p>
    </article>
    <aside class="highlights">
      <h2>${escapeHtml(messages.about.highlightTitle)}</h2>
      <ul>
        <li>${escapeHtml(messages.about.highlight1)}</li>
        <li>${escapeHtml(messages.about.highlight2)}</li>
        <li>${escapeHtml(messages.about.highlight3)}</li>
      </ul>
    </aside>
  </div>
</section>`;

  const title = `${messages.about.title} · ${messages.brand.title}`;
  const description = messages.about.subtitle;

  return renderLayout({
    locale,
    title,
    description,
    body,
    currentPath,
    messages,
    activeNav: 'about',
    alternatePaths: buildAlternatePaths(currentPath, locale, { type: 'about' })
  });
}

function renderContactPage({ locale, messages, currentPath }) {
  const body = `<section class="page contact">
  <header class="page-header">
    <h1>${escapeHtml(messages.contact.title)}</h1>
    <p>${escapeHtml(messages.contact.subtitle)}</p>
  </header>
  <div class="contact-grid">
    <article class="contact-info">
      <h2>${escapeHtml(messages.contact.infoTitle)}</h2>
      <p>${escapeHtml(messages.contact.infoDescription)}</p>
      <ul>
        <li><strong>${escapeHtml(messages.contact.emailLabel)}:</strong> hello@example.com</li>
        <li><strong>${escapeHtml(messages.contact.phoneLabel)}:</strong> +86 138 0000 0000</li>
        <li><strong>${escapeHtml(messages.contact.locationLabel)}:</strong> ${escapeHtml(messages.contact.locationValue)}</li>
      </ul>
    </article>
    <form class="contact-form" action="mailto:hello@example.com" method="post" enctype="text/plain">
      <label>
        ${escapeHtml(messages.contact.form.name)}
        <input type="text" name="name" required />
      </label>
      <label>
        ${escapeHtml(messages.contact.form.email)}
        <input type="email" name="email" required />
      </label>
      <label>
        ${escapeHtml(messages.contact.form.message)}
        <textarea name="message" rows="5" required></textarea>
      </label>
      <button type="submit">${escapeHtml(messages.contact.form.submit)}</button>
    </form>
  </div>
</section>`;

  const title = `${messages.contact.title} · ${messages.brand.title}`;
  const description = messages.contact.subtitle;

  return renderLayout({
    locale,
    title,
    description,
    body,
    currentPath,
    messages,
    activeNav: 'contact',
    alternatePaths: buildAlternatePaths(currentPath, locale, { type: 'contact' })
  });
}

function buildAlternatePaths(currentPath, locale, context) {
  const result = {};
  for (const loc of SUPPORTED_LOCALES) {
    if (loc === locale) {
      result[loc] = currentPath;
      continue;
    }
    switch (context.type) {
      case 'gallery': {
        if (context.year === 'all') {
          result[loc] = pagePath(loc, 'index.html');
        } else {
          result[loc] = pagePath(loc, `gallery/${context.year}.html`);
        }
        break;
      }
      case 'work': {
        result[loc] = pagePath(loc, `works/${context.slug}.html`);
        break;
      }
      case 'about': {
        result[loc] = pagePath(loc, 'about.html');
        break;
      }
      case 'contact': {
        result[loc] = pagePath(loc, 'contact.html');
        break;
      }
      default: {
        result[loc] = pagePath(loc, 'index.html');
      }
    }
  }
  return result;
}

async function writePage(pagePath, html) {
  const filePath = filePathFromPage(pagePath);
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, html, 'utf8');
}

async function copyStylesheet() {
  const source = path.join(stylesDir, 'main.css');
  const targetDir = path.join(distDir, 'assets');
  await ensureDir(targetDir);
  const content = await readFile(source, 'utf8');
  await writeFile(path.join(targetDir, 'main.css'), content, 'utf8');
}

async function build() {
  await rm(distDir, { recursive: true, force: true });
  await ensureDir(distDir);
  await copyPublic();
  await copyStylesheet();

  const messages = await loadLocales();
  const works = await loadWorks();
  const years = Array.from(new Set(works.map((work) => work.year))).sort((a, b) => b - a);

  for (const locale of SUPPORTED_LOCALES) {
    const localeMessages = messages[locale];
    const indexPath = pagePath(locale, 'index.html');
    const galleryHtml = renderGalleryPage({
      locale,
      messages: localeMessages,
      works,
      years,
      selectedYear: 'all',
      currentPath: indexPath
    });
    await writePage(indexPath, galleryHtml);

    for (const year of years) {
      const yearPath = pagePath(locale, `gallery/${year}.html`);
      const yearHtml = renderGalleryPage({
        locale,
        messages: localeMessages,
        works,
        years,
        selectedYear: year,
        currentPath: yearPath
      });
      await writePage(yearPath, yearHtml);
    }

    for (const work of works) {
      const workPath = pagePath(locale, `works/${work.slug}.html`);
      const workHtml = renderWorkDetail({
        locale,
        messages: localeMessages,
        work,
        currentPath: workPath
      });
      await writePage(workPath, workHtml);
    }

    const aboutPath = pagePath(locale, 'about.html');
    await writePage(aboutPath, renderAboutPage({
      locale,
      messages: localeMessages,
      currentPath: aboutPath
    }));

    const contactPath = pagePath(locale, 'contact.html');
    await writePage(contactPath, renderContactPage({
      locale,
      messages: localeMessages,
      currentPath: contactPath
    }));
  }
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
