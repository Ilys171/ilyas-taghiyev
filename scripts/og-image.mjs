// Generates public/og.png (1200×630) and the PNG favicons.
// Renders an HTML template in headless Chromium so the real site fonts are used.
// Usage: npm run og
import { chromium } from 'playwright';
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const fonts = pathToFileURL(resolve('public/fonts')).href;

// Same seeded idea as the hero plot: a strip of dots around a line, a few far below.
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const dots = Array.from({ length: 56 }, (_, i) => {
  const hidden = [37, 40, 41, 44].includes(i);
  const y = hidden ? 92 + rand() * 18 : 40 + (rand() - 0.5) * 34;
  return `<circle cx="${20 + i * 18.5}" cy="${y.toFixed(1)}" r="4.5" fill="${hidden ? '#b4361c' : '#8c877d'}"/>`;
}).join('');

const html = `<!doctype html><html><head><style>
@font-face{font-family:N;src:url(${fonts}/newsreader-latin-wght-normal.woff2);font-weight:200 800}
@font-face{font-family:NI;src:url(${fonts}/newsreader-latin-wght-italic.woff2);font-weight:200 800}
@font-face{font-family:M;src:url(${fonts}/ibm-plex-mono-latin-400-normal.woff2)}
*{margin:0}body{width:1200px;height:630px;background:#f7f5f0;color:#1a1916;padding:72px 80px;box-sizing:border-box;position:relative}
.meta{font:22px M;color:#5e5b54}
h1{font:380 104px/1 N;letter-spacing:-.025em;margin-top:28px}
p{font:italic 400 46px/1.1 NI;margin-top:22px}
svg{position:absolute;left:80px;right:80px;bottom:60px}
</style></head><body>
<div class="meta">Baku, Azerbaijan · Statistics &amp; Data Science</div>
<h1>Ilyas Taghiyev</h1>
<p>Finding the child the average hides.</p>
<svg width="1040" height="130" viewBox="0 0 1040 130"><line x1="0" x2="1040" y1="44" y2="44" stroke="#1a1916" stroke-width="1.5"/>${dots}</svg>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
// Load from a file (not setContent) so Chromium allows the local font URLs.
mkdirSync('qa', { recursive: true });
writeFileSync('qa/og.html', html);
await page.goto(pathToFileURL(resolve('qa/og.html')).href, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og.png' });
await browser.close();

const svg = readFileSync('public/favicon.svg');
await sharp(svg, { density: 300 }).resize(32, 32).png().toFile('public/favicon-32.png');
await sharp(svg, { density: 600 }).resize(180, 180).flatten({ background: '#1a1916' }).png().toFile('public/apple-touch-icon.png');
console.log('og.png, favicon-32.png, apple-touch-icon.png written');
