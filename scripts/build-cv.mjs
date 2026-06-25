// Generate public/cv.pdf from cv/cv.md, styled to match the site.
//
// Markdown is the single source of truth. This renders it to an HTML page that
// reuses the site's typefaces (Newsreader + Libre Franklin) and palette, then
// prints it to PDF with system Chrome. Kept out of the CI `build` on purpose so
// the GitHub Pages runner needs no browser — run `pnpm cv` locally and commit
// the regenerated public/cv.pdf.
//
// Usage: pnpm cv   (or: node scripts/build-cv.mjs)

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { marked } from "marked";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const mdPath = join(root, "cv", "cv.md");
const outPath = join(root, "public", "cv.pdf");

// Single newlines inside a block become <br> so each entry's place/date line and
// its detail line stay on separate lines.
marked.setOptions({ breaks: true });
let body = marked.parse(readFileSync(mdPath, "utf8"));

// Mute the "· dates · place / honors" segment that follows each bold entry title,
// matching the site's faint metadata colour. Runs from </strong> to the line
// break (detail follows) or the end of the paragraph (no detail).
body = body.replace(
  /<\/strong>([^<]*)(<br\s*\/?>|<\/p>)/g,
  '</strong><span class="meta">$1</span>$2',
);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;500;600&family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap" rel="stylesheet" />
<style>
  @page { size: A4; margin: 17mm 16mm 15mm; }
  * { box-sizing: border-box; }
  body {
    font-family: "Libre Franklin", system-ui, sans-serif;
    color: #1a1a1a;
    font-size: 10.25pt;
    line-height: 1.5;
    margin: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  h1 {
    font-family: "Newsreader", Georgia, "Times New Roman", serif;
    font-weight: 400;
    font-size: 27pt;
    letter-spacing: -0.01em;
    line-height: 1.05;
    margin: 0 0 5pt;
  }
  /* Contact line directly under the name */
  h1 + p { margin: 0; color: #595959; font-size: 9.5pt; line-height: 1.6; }
  h1 + p a { color: #595959; text-decoration: none; }
  h2 {
    font-size: 8pt;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #6d6d6d;
    font-weight: 500;
    margin: 17pt 0 9pt;
    padding-top: 9pt;
    border-top: 0.75pt solid rgba(0, 0, 0, 0.18);
  }
  h3 {
    font-size: 10.5pt;
    font-weight: 600;
    letter-spacing: 0.01em;
    margin: 11pt 0 4pt;
    break-after: avoid;
  }
  h3:first-of-type, h2 + h3 { margin-top: 4pt; }
  p { margin: 0 0 8pt; max-width: 62em; break-inside: avoid; }
  p strong { font-weight: 500; }
  .meta { color: #6d6d6d; font-weight: 400; }
  em { font-style: italic; }
  a { color: inherit; }
</style>
</head>
<body>
${body}</body>
</html>
`;

const tmpHtml = join(tmpdir(), "ruth-cv.html");
writeFileSync(tmpHtml, html, "utf8");

const candidates = [
  process.env.CHROME_BIN,
  "google-chrome",
  "google-chrome-stable",
  "chromium",
  "chromium-browser",
].filter(Boolean);

function resolveChrome() {
  for (const bin of candidates) {
    try {
      execFileSync(bin, ["--version"], { stdio: "ignore" });
      return bin;
    } catch {
      /* try next */
    }
  }
  throw new Error(
    `No Chrome/Chromium found. Tried: ${candidates.join(", ")}. ` +
      `Set CHROME_BIN to a browser binary.`,
  );
}

const chrome = resolveChrome();
execFileSync(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=5000",
    `--print-to-pdf=${outPath}`,
    pathToFileURL(tmpHtml).href,
  ],
  { stdio: "ignore" },
);

if (!existsSync(outPath)) throw new Error("cv.pdf was not produced");
console.log(`Wrote ${outPath} (via ${chrome})`);
