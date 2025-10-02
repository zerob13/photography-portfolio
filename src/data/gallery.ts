export type Locale = 'zh' | 'en';

export type LocaleText = Record<Locale, string>;

export interface ExifMetadata {
  camera: string;
  lens: string;
  aperture: string;
  shutter: string;
  iso: string;
  focalLength?: string;
}

export type Orientation = 'landscape' | 'portrait' | 'square';

export interface WorkMeta {
  slug: string;
  year: number;
  coverImage: string;
  previewImage: string;
  thumbnail: string;
  orientation: Orientation;
  title: LocaleText;
  location: LocaleText;
  summary: LocaleText;
  shootingDate: string;
  exif: ExifMetadata;
}

export interface Work extends WorkMeta {
  content: LocaleText;
}

const metaModules = import.meta.glob('../content/works/*/meta.json', {
  eager: true,
  import: 'default'
}) as Record<string, WorkMeta>;

const markdownModules = import.meta.glob('../content/works/*/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>;

const locales: Locale[] = ['zh', 'en'];
const CONTENT_PREFIX = '../content/works/';

function extractSlug(path: string) {
  const match = path.match(/\.\.(?:\/\.\.)?\/content\/works\/([^/]+)\//);
  return match ? match[1] : '';
}

export const works: Work[] = Object.entries(metaModules)
  .map(([path, meta]) => {
    const folderSlug = extractSlug(path);
    const slug = meta.slug || folderSlug;
    const content: LocaleText = locales.reduce((acc, locale) => {
      const candidates = [
        `${CONTENT_PREFIX}${slug}/${locale}.md`,
        `${CONTENT_PREFIX}${folderSlug}/${locale}.md`
      ];
      const key = candidates.find((candidate) => candidate in markdownModules);
      const fallbackKey = !key
        ? Object.keys(markdownModules).find((modulePath) =>
            candidates.some((candidate) =>
              modulePath.endsWith(candidate.substring(CONTENT_PREFIX.length))
            )
          )
        : key;
      const value = fallbackKey ? markdownModules[fallbackKey] : '';
      acc[locale] = value ?? '';
      return acc;
    }, {} as LocaleText);

    return {
      ...meta,
      slug,
      orientation: meta.orientation ?? 'landscape',
      content
    };
  })
  .sort((a, b) => {
    if (a.year === b.year) {
      return a.slug.localeCompare(b.slug);
    }
    return b.year - a.year;
  });

export const years = Array.from(new Set(works.map((work) => work.year))).sort((a, b) => b - a);
