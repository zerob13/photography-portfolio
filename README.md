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

Large originals live outside the regular Git history to avoid bloat and missing-object errors. The repository ships with a ready-to-use Git LFS configuration (`.gitattributes`) that tracks JPEG/PNG/WebP/AVIF assets inside `public/images/` and any binary files placed next to the work metadata folders.

To start working with your own photographs:

1. Install and initialise Git LFS once on every machine:

   ```bash
   brew install git-lfs # or your package manager
   git lfs install
   ```

2. Drop your processed web assets into `public/images/<collection>/<file>.jpg` (or `png`, `webp`, `avif`). These paths are referenced by `coverImage`, `previewImage`, and `thumbnail` inside each `meta.json`. Because of the `.gitattributes` rules they will automatically be committed via LFS—no extra `git lfs track` command is required as long as the files use those extensions.

3. When collaborating or deploying (for example on Cloudflare Pages), make sure the build step pulls the binaries before running `npm run build`:

   ```bash
   git lfs fetch --all
   git lfs pull
   npm run build
   ```

   On Cloudflare Pages you can prepend the build command with `git lfs pull` in the project settings to guarantee that every deployment downloads the assets before Vite starts bundling.

4. If you prefer to host images on an external CDN instead, simply update the paths in `meta.json` to point to absolute URLs. LFS will ignore remote links so no additional configuration is needed.

The included `public/images/.gitkeep` placeholder keeps the directory under version control until real images are added. It is a normal text file (not LFS tracked), so feel free to delete it once your gallery is populated.
