# Design brief: ilyastaghiyev — personal site

> **Amendments 2026-11-24** (approved by Ilyas; these override the sections below where they differ):
> - **Hero figure:** the dot plot (§5.3) is replaced by an original **Galton board** (`src/components/GaltonBoard.astro`, geometry in `src/lib/galton.ts`, motion in `src/scripts/galton.ts`). 60 balls pile into a bell curve around a dashed “average” line; one ball bounces clear of the bins, turns accent and becomes a minimal line figure of a child (`n = 1`). This child figure is the **one deliberate exception** to “no illustrations” (§1, §7). The HTML holds the final state; reduced motion or no JS shows it still. Desktop: figure beside the name (cols 8–12); mobile: under the intro.
> - **Motion** (§6) now uses GSAP + ScrollTrigger (≈ 46 KB gzipped JS total): staggered reveals (14px rise + fade, 600ms), count-ups for key numbers ≥ 10, a scroll-scrubbed 77–95% bar in Research, a sliding accent dot in the header nav, and cross-document View Transitions (CSS `@view-transition`) with the project title morphing between list and page.
> - **Content:** the CV PDF is the only source. No status badges or years; projects show CV grades and hours. Project pages follow problem → built → measured → learned; empty parts are hidden in production.
> - **Photos:** `<Photo id>` slots on project pages and About (see PHOTOS_NEEDED.md); hidden until a file exists.

Status: **approved 2026-10-31**, with these changes from Ilyas:

- **One project list, no “main” vs “other” split.** All 13 projects appear in one numbered list, ordered from the project that best shows the core idea (*help for young people*) to the one that shows it least. Every project row has the same structure and every project gets its own detail page. Sections 5.4, 5.5 and 5.10 below are updated accordingly.
- Content answers: MathRoutes ages 5–9 · SoleShift 2,000+ confirmed · John Locke commendation 2026 · Sessiz Sifaris described as a concept, as stated in the McDonald’s Azerbaijan letter · email `ilyastagiyev1@gmail.com` confirmed.

---

## 1. Concept

**“The child the average hides.”**

The site reads like a carefully set research paper that happens to be about children. Two ideas drive every visual decision:

1. **The individual vs. the mean.** One thin horizontal rule (the average) and many small dots (individuals). That motif appears in the hero plot, in the favicon, as section dividers, and as the hover marker on project rows. One accent color is reserved for “the ones the average hides”, so that whenever the accent appears, it means *look here*.
2. **Editorial / academic rigor.** Narrow left margin column for labels and numbers (like the marginalia and section numbers of a paper), wide right column for content. Monospace for every number, date and data label. No cards, no gradients, no illustrations: type, rules, whitespace and data.

Tone: calm, precise, warm. A reader should feel “this person is careful with evidence” within ten seconds.

---

## 2. Typography

| Role | Face | Why |
|---|---|---|
| Display (h1–h3, paper title, “Let’s talk.”) | **Newsreader** (variable, optical size 6–72, with italic) | An editorial serif made for screen reading. At large optical sizes it is sharp and characterful, so the name and tagline feel like a journal masthead. Italic is used for one or two words of emphasis only. |
| Text (body, nav, descriptions) | **IBM Plex Sans** (400, 500, 600) | Highly readable, slightly technical in feel, and designed as one family with Plex Mono, so the sans and mono share proportions. |
| Data (years, chips, meta lines, captions, figures) | **IBM Plex Mono** (400, 500) | For numbers, dates, data labels and the plot caption. Always `tabular-nums`. |

Fonts are **self-hosted** via `@fontsource-variable` / `@fontsource` (Latin + Latin Extended subsets only, which cover Azerbaijani letters ə ğ ı ö ş ü ç), with the two above-the-fold files preloaded and `font-display: swap`. This is a deliberate deviation from loading Google Fonts at runtime: it removes a third-party connection (better Lighthouse performance, no cookies or tracking from a third-party host) while using the same open-source fonts.

**Scale:** modular, ratio **1.25** (major third), base 18px, fluid via `clamp()` between 360px and 1440px.

| Token | Mobile → Desktop | Use |
|---|---|---|
| `--step--2` | 12 → 13px | mono captions, chip labels |
| `--step--1` | 14.4 → 15px | meta lines, nav, small print |
| `--step-0` | 17 → 18px | body (line-height 1.6) |
| `--step-1` | 20 → 22.5px | project titles in list, lead text |
| `--step-2` | 24 → 28px | h3 |
| `--step-3` | 29 → 35px | section titles (h2) |
| `--step-4` | 35 → 44px | tagline |
| `--step-5` | 42 → 55px | paper title, “Let’s talk.” |
| `--step-6` | 52 → 96px | name (h1), tight tracking −0.02em, line-height 0.95 |

**Typographic rules:** curly quotes (“ ” ’), en dashes for ranges (2025–2026), `&nbsp;` between numbers and units (“200+&nbsp;children”, “3×&nbsp;a&nbsp;week”), `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs to avoid orphans, body measure capped at **68ch**, `font-variant-numeric: tabular-nums` on all mono, `hanging-punctuation` where supported.

---

## 3. Color

A warm “paper and ink” base with a single vermilion accent, the color of a red pen circling a data point.

### Light (default)

| Token | Hex | Use | Contrast vs `--bg` |
|---|---|---|---|
| `--bg` | `#F7F5F0` | page (warm paper) | n/a |
| `--surface` | `#EFEBE3` | abstract block, badges, code-like panels | n/a |
| `--text` | `#1A1916` | primary ink | ≈ 16.5 : 1 |
| `--muted` | `#5E5B54` | secondary text, meta | ≈ 6.2 : 1 |
| `--border` | `#DDD8CE` | hairline rules (decorative only) | n/a |
| `--dot` | `#8C877D` | ordinary data points (non-text graphic) | ≈ 3.3 : 1 (≥ 3:1 for graphics) |
| `--accent` | `#B4361C` | the hidden dots, key result, link hover, focus ring | ≈ 5.6 : 1 |
| `--accent-muted` | `#F3DED6` | faint highlight behind the key result, selection color | n/a |

### Dark

| Token | Hex | Contrast vs `--bg` |
|---|---|---|
| `--bg` | `#131312` | n/a |
| `--surface` | `#1C1C1A` | n/a |
| `--text` | `#ECE9E2` | ≈ 15.8 : 1 |
| `--muted` | `#A29E95` | ≈ 7.0 : 1 |
| `--border` | `#2E2D2A` | n/a |
| `--dot` | `#6E6A62` | ≈ 3.4 : 1 |
| `--accent` | `#FF7A59` | ≈ 7.2 : 1 |
| `--accent-muted` | `#3A1F17` | n/a |

Every ratio will be re-verified with axe-core and a contrast script after building. Rules for the accent: it never fills large areas, never appears as a button background, and appears in at most 2–3 places per screen.

**Theme switching:** `prefers-color-scheme` sets the default; a small text toggle in the header that names the theme it switches to (“Dark” / “Light”, with a matching `aria-label`) overrides it and is remembered in `localStorage` (wrapped in try/catch). A tiny inline script in `<head>` applies the stored theme before first paint, so there is no flash.

---

## 4. Grid, spacing, layout

- **Spacing scale (8px base):** `--space-1` 4 · `--space-2` 8 · `--space-3` 16 · `--space-4` 24 · `--space-5` 32 · `--space-6` 48 · `--space-7` 64 · `--space-8` 96 · `--space-9` 128 · `--space-10` 160. Section padding 96px (mobile) → 160px (desktop).
- **Grid:** 12 columns, 24px gutters, max content width 1280px, side margins 20px (mobile) → 48px (desktop).
- **Editorial asymmetry:** every section uses the same skeleton:
  - **Columns 1–3: margin column.** Section number and label in mono (`§ 02  Projects`), sticky on desktop while the section scrolls.
  - **Columns 4–12: content column.** Headings and body; body paragraphs further capped at 68ch.
  - On mobile the margin column collapses into a small mono label above the heading.
- **Breakpoints checked:** 360, 390, 768, 1024, 1440. No horizontal scroll at any width (`overflow-x: clip` on the root is a safety net, not a fix).
- **Rules, not boxes:** sections and list rows are separated by 1px hairlines in `--border`. Cards and shadows are not used.

---

## 5. Key components

### 5.1 Header
Sticky, 64px, `--bg` with a hairline bottom border that appears only after scrolling. Left: “Ilyas Taghiyev” in Plex Sans 500. Right: `Projects · Research · Recognition · About · Contact` in `--step--1`, then the theme toggle. The current section is marked with a small accent dot under the link (the dot motif again), driven by IntersectionObserver.
**Mobile:** “Menu” text button → full-screen overlay with the five links set large in Newsreader, numbered `01–05` in mono; focus is trapped while open; Esc closes it; body scroll is locked.

### 5.2 Hero
```
Baku, Azerbaijan · Statistics & Data Science · Class of 2027      (mono, muted)

Ilyas Taghiyev                                                     (h1, step-6)

Finding the child the average hides.                               (Newsreader, step-4)
I build learning projects for children and young people, and I use
statistics to find out what works for each of them.                (body, 52ch)

See projects →     Contact →                                       (underlined text links)

[ ───────────────── dot plot, full content width ───────────────── ]
Fig. 1  Illustrative data. On average, everything looked fine.     (mono caption)
```
Desktop: text sits in columns 1–8, the plot spans all 12 columns underneath, so the mean line runs across the whole page like a horizon.

### 5.3 Signature dot plot (“Fig. 1”)
- **96 dots**, generated at build time from a seeded PRNG (deterministic, so every visitor sees the same picture and the HTML ships with final positions). Synthetic “scores” cluster around the mean; **5 dots** sit far below it. Those 5 are drawn in `--accent`; everything else in `--dot`.
- x = individual (evenly spaced with slight jitter), y = synthetic score. One horizontal **mean line** in `--text`, labelled “mean” in mono at its right end. A small accent label points at the low cluster: “5 below the line” (no real-world claim).
- **Animation:** on load the dots are collapsed onto the mean line (everyone looks the same). When the plot enters the viewport, after ~400ms, the dots spread to their real positions (staggered, ease-out, ~900ms total), and the 5 outliers change color to accent last. A “Replay” text button below the plot reruns it. This is the one place where motion runs longer than 300ms, because the motion *is* the argument.
- **Implementation:** plain inline SVG rendered by an Astro component + ~40 lines of vanilla JS (CSS transforms, no chart library). No JS → final state shown. `prefers-reduced-motion: reduce` → final state, no animation, Replay hidden.
- **Accessibility:** `role="img"` with an `aria-label` describing it (“Illustrative dot plot of 96 synthetic data points. Most sit near the average line; five sit far below it.”). The caption repeats that the data is illustrative.

### 5.4 Project list (main section)
Editorial rows, full content width, hairline between rows. Whole row is one link to the detail page (external links inside are separate, real `<a>` elements placed outside the row link to keep valid HTML).
```
2026–present │ MathRoutes                                         │ Founder, Curriculum Designer   →
             │ Free hands-on math program for children with ADHD  │ & Mentor Lead
             │ [10 teen mentors] [200+ children] [1 h · 3×/week]  │ Website ↗  Medeniyyet TV
```
- Years: mono, muted, margin column.
- Title: Newsreader `--step-1`; one-line description in body.
- **Chips:** not pills. Mono numbers with a thin top rule, like table cells: the number in `--text`, the unit in `--muted`.
- **Hover/focus:** title gets an accent underline that draws in from left (200ms), arrow slides 4px right, a single accent dot appears at the row’s left edge. Reduced motion → instant color change only.
- **Upcoming** (CLICK): an outlined mono badge `UPCOMING · DEC 2026`; text in the future tense; no chips.
- Every row links to its detail page; rows are numbered `01–13` in mono, in the order chosen by how directly the project helps young people.

### 5.5 Other projects
Removed (see the status note at the top): all projects are in the single list in 5.4.

### 5.6 Research (“paper first page”)
Set on a `--surface` panel with generous padding, the only filled block on the page, so it reads as a different document.
- Mono kicker: `WORKING PAPER · OCTOBER 2026`
- Title in Newsreader `--step-5`, centered **within the panel only** (the paper convention, the one place center alignment is used).
- Authors line in small caps; Ilyas marked as lead author.
- “Abstract” label, then the summary in a 60ch column.
- **Key result** as a figure: `77–95%` in large mono, in accent, with the label “of squared forecast error comes from asset-volatility surprises (test period 2008–2026)”.
- `[PLACEHOLDER]` “Read the paper (PDF)”, rendered as disabled-looking text “PDF available soon”, not as a dead link.
- Below: “Field research (biology)”, three short entries with a mono year/grade in the margin.

### 5.7 Recognition
Two lists side by side on desktop (“Honors” | “Media & letters”), stacked on mobile. Each item is a single line plus a muted qualifier; links get ↗ and `rel="noopener noreferrer"`. Text names only, no logos, no dates in the media list.

### 5.8 About
Columns 4–9: the ~120-word first-person text. Columns 10–12: a facts list in mono (`School`, `Languages`, `Tools`, `Interests` as key/value pairs). The optional photo slot sits above the facts list only when a photo exists; without one the layout is unchanged (no empty frame).

### 5.9 Contact + footer
“Let’s talk.” in Newsreader `--step-5`. The email address as a large underlined link, LinkedIn ↗ below. Footer: hairline, `© 2026 Ilyas Taghiyev` left, `Built with Astro` right, both mono `--step--2`.

### 5.10 Project detail pages
Same grid. Margin column: status badge, years, role, links. Content column: title, then four sections (“The problem”, “What we built”, “My role”, “What we learned”). Key numbers as a row of large mono figures (`--step-5`) with small labels underneath. Missing text is rendered as a dashed-border block reading “Placeholder: Ilyas to write” (and logged in `TODO.md`). Footer nav: “← All projects” and “Next project: Kumiho Hunters →”. Pages exist for all 13 projects, generated from `content.ts`.

---

## 6. Motion

| Element | Motion | Duration / easing |
|---|---|---|
| Section content on scroll | fade + 12px rise, once | 300ms, `cubic-bezier(0.2, 0.7, 0.2, 1)` |
| Project row hover | underline draw, arrow shift | 200ms ease-out |
| Dot plot | collapse → spread, staggered | ~900ms total, ease-out |
| Theme change | none (instant) | n/a |

`prefers-reduced-motion: reduce` turns all of it off and shows final states. Scroll reveals use IntersectionObserver and are applied only when JS is running, so content is never hidden without JS.

---

## 7. Avoided on purpose

Gradients, glows, blobs, glassmorphism, emoji, stock or AI illustrations, “Hi, I’m … 👋”, pill-button CTAs, three-column card grids, logo walls, testimonial carousels, skill progress bars, and words like “passionate”, “innovative”, “cutting-edge”, “leveraging”.

---

## 8. Technical plan

- **Astro 5** (static output) + TypeScript (strict) + **Tailwind CSS v4** via `@tailwindcss/vite`, with the tokens above declared in `@theme` so classes and CSS variables share one source.
- `src/data/content.ts`: typed content (projects, other projects, research, honors, media, about, contact). Every `[TO CONFIRM]` / `[PLACEHOLDER]` is a `// TODO:` comment next to the value.
- `@astrojs/sitemap`, `public/robots.txt`, Open Graph + Twitter meta from one `<SEO>` component.
- **OG image** 1200×630: generated at build time from an SVG template (name, tagline and a small dot strip) to PNG with `sharp`.
- **Favicon:** SVG of a short horizontal line with one accent dot below it (the concept in 16px), plus a PNG fallback.
- **QA:** Playwright screenshots (390 / 1440 × light / dark) after each section, `@axe-core/playwright` for accessibility, Lighthouse CLI against `astro preview` using Playwright’s Chromium.

---

## 9. Content questions (answered 2026-10-31; kept for the record)

These go into `TODO.md`. Building can proceed with the safe defaults shown in brackets.

1. MathRoutes age range: 7–9 or 5–9? [“young children with ADHD”]
2. SoleShift Kids: is “2,000+ students in workshops” confirmed? [shown as a marked placeholder chip]
3. John Locke Institute commendation year? [no year shown]
4. Sessiz Sifaris: concept only, or actually deployed? [“concept”]
5. **Email spelling:** the address is `ilyastagiyev1@gmail.com` (no “h”) while the name is spelled “Taghiyev”. Please confirm that the address is correct exactly as written.
6. Portrait photo (optional), paper PDF (when public).
7. Detail-page text for “The problem / What we built / My role / What we learned” for the three main projects [placeholders where the brief has no facts].
