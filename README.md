# Ruth del Pino Bleijerveld — personal site

A single static page for Ruth del Pino Bleijerveld, a junior professional in
international humanitarian and human-rights law. Design direction: **Variant A
— "Hairlines & light"** (whitespace, ultra-light type, hairline rules, sharp
corners). Built with Vite + TypeScript, deployed to GitHub Pages.

## Stack

- **Vite + TypeScript** — one static page, minimal dependency footprint.
- **Libre Franklin** via Google Fonts (weights 200, 300, 400, 500, 600).
- **GitHub Pages** via GitHub Actions (`.github/workflows/deploy.yml`).

## Develop

```bash
pnpm install
pnpm dev      # local dev server
pnpm build    # type-check + production build → dist/
pnpm preview  # serve the production build locally
```

## Assets the user provides

Both live in `public/` (copied verbatim to the site root at build time):

- **`public/portrait.jpg`** — the original, unedited portrait. Already in
  place. Displayed `aspect-ratio: 4/5; object-fit: cover; object-position:
  62% center` so the subject stays centered.
- **`public/cv.pdf`** — Ruth's CV. **Not yet added** — see
  `public/cv.pdf.README.txt`. Until it exists the CV links will 404.

## Deployment (GitHub Pages)

1. Push to `main`. The Actions workflow builds and deploys automatically.
2. In the repo: **Settings → Pages → Build and deployment → Source =
   GitHub Actions**.
3. The site uses a **relative base** (`base: "./"` in `vite.config.ts`), so it
   works both at a custom-domain root and at a project subpath
   (`user.github.io/ruth-website/`) with no extra config.

### Custom domain

When the domain is ready:

1. Rename `public/CNAME.example` to `public/CNAME` and put the bare domain in
   it (e.g. `ruthdelpino.com`), one line, no protocol.
2. Configure the domain in **Settings → Pages → Custom domain** and add the
   DNS records GitHub shows you.

## Editing content

All copy and structure live in `index.html`; all styling in `src/style.css`
(design tokens are final — see the design handoff). The "Talks · Podcasts ·
Writing" section is a placeholder: a list can drop in under its eyebrow later
without a redesign.
