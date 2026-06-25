# Ruth del Pino Bleijerveld — personal site

Single static page (Vite + TypeScript) for Ruth del Pino Bleijerveld, who works
on human rights and the rule of law in the OSCE region. Libre Franklin body with
a Newsreader serif headline; deployed to GitHub Pages via Actions.

## Develop

```bash
pnpm install
pnpm dev      # dev server
pnpm build    # type-check + build → dist/
pnpm preview  # serve the build
pnpm cv       # regenerate the CV PDF from cv/cv.md → public/cv.pdf
```

Page copy/structure: `index.html`. Styling + tokens: `src/style.css`. Files in
`public/` (portrait, favicon, generated `cv.pdf`) are copied to the site root.

## CV

The résumé is a downloadable PDF, not listed on the page. `cv/cv.md` is the
single source; `pnpm cv` renders it to `public/cv.pdf` with system Chrome
(`CHROME_BIN` to override), styled to match the site. It's kept out of
`pnpm build` so CI needs no browser — after editing `cv/cv.md`, run `pnpm cv`
and commit the regenerated `public/cv.pdf`.

## Deploy

Push to `main`; the Actions workflow (`.github/workflows/deploy.yml`) builds and
deploys. Set **Settings → Pages → Source = GitHub Actions**. The relative base
(`base: "./"`) works at a domain root or project subpath.

The custom domain is `ruthdelpinobleijerveld.org`, set via `public/CNAME` (copied
to the site root on build). DNS lives at Namecheap: four `A` records at the apex
(`@`) pointing to GitHub Pages (`185.199.108.153`–`185.199.111.153`) and a `CNAME`
on `www` → `nlebovits.github.io`. After DNS propagates, tick **Enforce HTTPS**
under **Settings → Pages**.
