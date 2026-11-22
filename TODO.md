# TODO: for Ilyas to provide or confirm

Everything below is marked in the code with a `TODO:` comment (search for `TODO` in `src/`). Until it is filled in, the site shows a neutral placeholder or leaves the item out. It never shows invented text.

## Needed before sharing the site widely

| # | What | Where | Currently shown |
|---|---|---|---|
| 1 | **CLICK website**: https://click-alpha-give.vercel.app returned **404 Not Found** on 2026-10-31 | `content.ts` → project `click` → `links` | Link hidden |
| 2 | **Project page texts**: “The problem” and “What we learned” for all 13 projects (2–4 sentences each, first person, facts only) | `content.ts` → each project → `detail.problem`, `detail.learned` | Dashed “Placeholder: Ilyas to write” box |
| 3 | **Final domain** (e.g. a custom domain connected in Vercel) | `astro.config.mjs` → `site`, and `public/robots.txt` | `https://ilyas-taghiyev.vercel.app` |

## Optional

| # | What | Where | Currently shown |
|---|---|---|---|
| 4 | **Portrait photo** (real photo only; at least 960×1200 px, JPG). Put it in `public/` and set `about.photo` | `content.ts` → `about.photo` | No photo; the layout is complete without it |
| 5 | **Research paper PDF**, once public | `content.ts` → `research.pdf` | “PDF available when the paper is public” |
| 6 | **Medeniyyet TV link**, if the segment is online | `content.ts` → project `mathroutes` → `links` | Named in Recognition, no link |
| 7 | **Years for Athena Band and Sessiz Sifaris** | `content.ts` → `years` | “Prototype” / “Concept” badge instead of years |

## Already confirmed (2026-10-31)

- MathRoutes age range: 5–9.
- SoleShift Kids: 2,000+ students in workshops.
- John Locke Institute commendation: 2026.
- Sessiz Sifaris: described as a concept, as stated in the McDonald’s Azerbaijan letter of reference.
- Email `ilyastagiyev1@gmail.com` is correct as written.
- Project order: one list, from the project that best shows help for young people to the one that shows it least (reorder the `projects` array to change it).
