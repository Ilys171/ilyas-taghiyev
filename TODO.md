# TODO: for Ilyas to provide or confirm

Source of truth: `private/Ilyas_Taghiyev_UC_Activities.pdf`. Search for `TODO` in `src/` for the matching code comments. Nothing below is invented on the live site: missing text is hidden there and shown as a dashed “Ilyas to write” box in `npm run dev`.

## Needed

| # | What | Where |
|---|---|---|
| 1 | **“What I learned”**: 2–4 sentences, first person, for each of the 12 projects. This is the part of each project page that only you can write. | `src/data/content.ts` → each project → `detail.learned` |
| 2 | **“The problem”**: 1–3 sentences for every project except Stem van Thuis (which uses the CV’s own wording). | `detail.problem` |
| 3 | **Photos**: see `PHOTOS_NEEDED.md` (5 must-haves). | `src/assets/photos/` |
| 4 | **CLICK website**: click-alpha-give.vercel.app returned 404 on 2026-11-24, so the link is hidden. | `content.ts` → `click` → `links` |
| 5 | **kumihohunters.site** did not respond on 2026-11-24. The link is still shown; check that it is live. | `content.ts` → `kumiho-hunters` → `links` |
| 6 | **Confirm “kept but not in the CV”** items (About facts, languages, IELTS, school, music-charts line). See CHANGES.md §6. | `content.ts` → `about` |

## Optional

| # | What | Where |
|---|---|---|
| 7 | Medeniyyet TV link, if the segment is online | `content.ts` → `mathroutes` → `links`, and `media` |
| 8 | Regenerate the OG image with the Galton-board symbol (`npm run og` after updating `scripts/og-image.mjs`) | `scripts/og-image.mjs` |
