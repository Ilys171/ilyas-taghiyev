// axe-core accessibility check of every built page, light and dark.
// Usage: npm run build && npm run preview (in another terminal), then npm run qa:axe
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { readdirSync } from 'node:fs';

const base = process.env.BASE_URL ?? 'http://localhost:4321';
const paths = ['/', '/404', ...readdirSync('dist/projects').map((s) => `/projects/${s}`)];

const browser = await chromium.launch();
let total = 0;
for (const scheme of ['light', 'dark']) {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ colorScheme: scheme, viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    for (const path of paths) {
      const page = await context.newPage();
      await page.goto(base + path, { waitUntil: 'load' });
      // Reduced motion shows every final state, so contrast is checked on what people read.
      await page.waitForTimeout(300);
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
        .analyze();
      total += violations.length;
      for (const v of violations) {
        console.log(`[${scheme} ${width}] ${path}: ${v.id} (${v.impact}) — ${v.help}`);
        for (const n of v.nodes.slice(0, 3)) console.log('    ', n.target.join(' '), n.failureSummary?.split('\n')[1] ?? '');
      }
      await page.close();
    }
    await context.close();
  }
}
await browser.close();
console.log(total ? `${total} violation groups` : 'axe: 0 violations');
process.exit(total ? 1 : 0);
