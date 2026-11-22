// Full-page screenshots at 390px and 1440px, light and dark.
// Usage: npm run preview (in another terminal), then npm run qa:shots [path ...]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const base = process.env.BASE_URL ?? 'http://localhost:4321';
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ['/'];
const out = 'qa/screenshots';
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
for (const path of paths) {
  for (const width of [390, 1440]) {
    for (const scheme of ['light', 'dark']) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: scheme });
      await page.goto(base + path, { waitUntil: 'networkidle' });
      // Scroll through once so scroll-triggered reveals and the plot run.
      const h = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < h; y += 400) {
        await page.evaluate((yy) => scrollTo(0, yy), y);
        await page.waitForTimeout(60);
      }
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(1800);
      const name = `${path === '/' ? 'home' : path.replace(/\//g, '_').replace(/^_/, '')}-${width}-${scheme}.png`;
      await page.screenshot({ path: `${out}/${name}`, fullPage: true });
      // The root clips overflow-x as a safety net, so look for elements that stick out.
      const offenders = await page.evaluate(() =>
        [...document.querySelectorAll('body *')]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1) && !el.closest('dialog:not([open])');
          })
          .slice(0, 5)
          .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`),
      );
      console.log(name, offenders.length ? `OVERFLOW: ${offenders.join(', ')}` : 'ok');
      await page.close();
    }
  }
}
await browser.close();
