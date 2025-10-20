# Photography Portfolio

Static, bilingual photography portfolio generator that outputs pure HTML and CSS pages. The site is created entirely at build time from the content and locale files in this repository—no client-side JavaScript is shipped.

## Getting started

```bash
npm install
npm run build
```

Running `npm run build` clears the `dist/` directory and regenerates a static site with the following structure:

- `index.html`, `about.html`, `contact.html`, `gallery/`, and `works/` – the default (Chinese) locale rendered at the site root.
- `en/` – English equivalents of every gallery, detail, and informational page.
- `assets/main.css` – shared stylesheet copied from `styles/main.css`.
- `fonts/` and `images/` – copied verbatim from `public/`.

Deploy the contents of `dist/` to any static file host.

## Content structure

Each photograph lives in `src/content/works/<slug>/` and consists of:

- `meta.json` — shared metadata, image paths, EXIF block, and bilingual title/location/summary fields.
- `zh.md` and `en.md` — locale-specific Markdown narratives rendered on the detail page.

To add a new piece, duplicate an existing folder, adjust `meta.json`, and write the Markdown files in both languages. The build script automatically discovers new works and generates the gallery and detail pages.

## Localisation

Translations live in `src/locales/<locale>.json`. Update these files to tweak navigation labels, static copy, and section headings. Every locale listed in `SUPPORTED_LOCALES` inside `scripts/generate-static.mjs` receives its own set of pages during the build.

## Assets

Static assets such as fonts and shared imagery reside in `public/`. They are copied directly into the output folder, so reference them using absolute paths like `/fonts/...` or relative paths starting from the site root in your metadata.

Large photography assets can continue to be stored outside of Git or tracked with Git LFS depending on your workflow. Update the URLs inside `meta.json` to point to either local `public/images/...` files or remote CDN locations.
