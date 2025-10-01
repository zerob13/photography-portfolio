# Photography Portfolio

Vue 3 + Vite powered photography portfolio with bilingual (中文 / English) support, lazy-loaded gallery grid and detail view designed for Cloudflare Pages deployment.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Content structure

Each photograph lives in `src/content/works/<slug>/` and consists of:

- `meta.json` — shared metadata, image paths, EXIF block, and bilingual title/location/summary fields.
- `zh.md` and `en.md` — locale-specific Markdown narratives rendered on the detail page.

To add a new piece, duplicate an existing folder, adjust `meta.json`, and write the Markdown files in both languages. The gallery and detail views load the new work automatically—no extra TypeScript edits are required as long as the slug in `meta.json` matches the folder name.

## Photographs & assets

The project currently points to remote placeholder imagery so the gallery works without bundling large files. When you're ready to publish your own photographs:

1. Add them to an object store or CDN and update the `coverImage`, `previewImage`, and `thumbnail` fields inside each `meta.json`.
2. (Optional) Re-enable Git LFS if you prefer to keep assets in this repository—track your desired extensions and run the usual `git lfs install` / `git lfs pull` workflow during development and deployment.

Keeping heavy assets outside of the repository avoids failed builds when LFS is unavailable and keeps the starter lightweight.
