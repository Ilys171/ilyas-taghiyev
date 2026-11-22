# Ilyas Taghiyev: personal website

A static site built with Astro, TypeScript and Tailwind CSS. The design brief is in [DESIGN.md](DESIGN.md); open content questions are in [TODO.md](TODO.md).

## Run it locally

Requires Node.js 22.23.4 or newer (Node 24 works).

```bash
npm install
npm run dev        # http://localhost:4321, reloads on save
npm run build      # static site in dist/
npm run preview    # serve the built site from dist/
```

## Edit the content

All text lives in **`src/data/content.ts`**. You do not need to touch any layout file.

- **Projects**: the `projects` array. The order of the array is the order on the site, and each entry also creates its own page at `/projects/<slug>`.
  - `facts` are the small numbers on each row (`value` + `label`).
  - `detail.problem`, `detail.built`, `detail.myRole` and `detail.learned` fill the project page. Leave a field out and the page shows a visible “Placeholder: Ilyas to write” box.
  - `status` can be `active`, `completed`, `upcoming`, `concept` or `prototype`.
- **Research**: `research` (title, authors, abstract, key result, `pdf` link).
- **Recognition**: `honors` and `media`.
- **About**: `about.paragraphs`, `about.facts`, and `about.photo` (optional).
- **Name, tagline, email, LinkedIn**: `site`.

Typography rules: use curly quotes (“ ” ’), an en dash for ranges (2025–2026), and ` ` (a non-breaking space) between a number and its unit.

After changing the name or tagline, regenerate the social preview image:

```bash
npm run og         # writes public/og.png and the PNG favicons
```

## Quality checks

With `npm run preview` running in another terminal:

```bash
npx playwright install chromium   # once
npm run qa:shots                  # screenshots at 390 and 1440 px, light and dark → qa/screenshots/
npm run qa:axe                    # axe-core accessibility check of every page
npm run check                     # TypeScript and Astro diagnostics
```

## Deploy to Vercel

The site is live at **https://ilyas-taghiyev.vercel.app** (Vercel project `ilys171s-projects/ilyas-taghiyev`, already linked to this folder). `vercel.json` sets the Astro framework and the `dist` output folder.

1. After editing, publish the changes from this folder:
   ```bash
   npx vercel deploy --prod
   ```
   To check a change first, run `npx vercel deploy` (no `--prod`): it gives a private preview URL.
2. Optional: connect a GitHub repository in the Vercel project settings, and every push deploys automatically.
3. If you connect a custom domain: put it in `site` in `astro.config.mjs` and in the `Sitemap:` line of `public/robots.txt`, then deploy again. Canonical links, Open Graph tags and the sitemap use this address.
4. Run [PageSpeed Insights](https://pagespeed.web.dev/) on the live URL to confirm the Lighthouse scores.

## Project structure

```
src/
  data/content.ts        all content
  lib/dots.ts            synthetic data for the hero dot plot (seeded, illustrative)
  components/            Header, Hero, DotPlot, ProjectRow, Research, Recognition, About, Contact, Footer
  layouts/Base.astro     <head>, SEO tags, theme script
  pages/index.astro      home page
  pages/projects/[slug].astro   one page per project
  styles/global.css      fonts, color and spacing tokens, shared styles
public/                  fonts, favicon, og.png, robots.txt
scripts/                 OG image generator, screenshot and accessibility checks
```
