# Design: ilyastaghiyev.site — “Chalk & Data”

Approved 2026-11-24. Replaces the earlier paper-and-ink design (light/dark) entirely.

## 1. Concept

**“Finding the child the average hides.”** The site is a chalkboard where data becomes people. Its symbol is Janusz Korczak (1878–1942), the Polish pediatrician and educator who treated children as equals, drawn as a halftone portrait of chalk dots. One dot, in orange, is the child the average hides.

- **Mode: Experience.** The work leads; the interface recedes.
- **Tone:** calm, warm, precise. Crafted, never flashy.
- **Honesty:** every fact, number, title and date comes from the CV (the PDF in private/) or the exam scores Ilyas supplied. Nothing from recommendation letters. Illustrative visuals are labelled as such.

## 2. Colors (one theme only)

No light/dark switching. The single theme is the chalkboard.

| Token | Hex | Role | Contrast on board |
|---|---|---|---|
| `--board` | `#17302B` | page background | n/a |
| `--board-raised` | `#1D3A34` | the one raised panel (research paper) | n/a |
| `--chalk` | `#F2EDE3` | text, portrait dots, lines | 12.05 : 1 |
| `--chalk-muted` | `#A9B8B2` | secondary text, meta | 6.82 : 1 |
| `--orange` | `#F08A3C` | **learning** category; the hidden-child dot; text selection | 5.63 : 1 |
| `--sky` | `#6CC3E6` | **health** category | 7.09 : 1 |
| `--yellow` | `#F4C84A` | **communities & accessibility** category; focus ring | 8.84 : 1 |

Hairlines are chalk at 16% alpha (`--border`), stronger rules at 42% (`--border-strong`). All text pairs pass WCAG AA; the accents also pass as text. Accents are crayons: they mark categories and the one hidden dot, never large fills.

**Chalk dust:** a 2.5 KB static tile (public/images/chalk.webp) repeated over the board at very low alpha. It never animates.

## 3. Typography

| Role | Face | Why |
|---|---|---|
| Display: name, headings, score numbers, quotes | **Fraunces** (variable weight + optical size, roman + italic) | A warm “old-style” serif with soft, slightly hand-made details. It matches the 1920s era of the portrait and gives the site a voice; optical sizing keeps it sharp at 96px and readable at 24px. |
| Body, navigation, buttons | **Atkinson Hyperlegible Next** | Designed by the Braille Institute for low-vision readers: distinct letterforms (I/l/1, O/0). A site about inclusion uses a typeface built for it. |
| Data: dates, grades, chip labels, captions | **Atkinson Hyperlegible Mono** | Same family; used only for data and measurement, always `tabular-nums`. |

Self-hosted woff2 in public/fonts (Latin + Latin Extended, so Azerbaijani letters ə ğ ı ö ş ü ç render). The two above-the-fold files are preloaded; `font-display: swap`.

Scale (fluid 360 → 1440px, tokens in src/styles/global.css): `--step--2` 12.5–13.5px … `--step-0` 17–18px body … `--step-6` 51–96px name. Display max 6rem; tracking no tighter than −0.03em. Body measure ≤ 68ch, line-height 1.6. Curly quotes, en dashes for ranges, non-breaking space between number and unit.

## 4. Layout

- 12-column grid, max content width 80rem, side gutter 16px (phone) → 48px.
- No section numbers or eyebrow labels above headings: headings carry their own weight.
- No cards as page structure. One raised panel (the research paper). Radius 10px for buttons and chips.
- Checked at 360, 390, 768, 1024, 1440. No horizontal scroll.

## 5. Page order and components

1. **Intro**: name; studying Statistics & Data Science; one sentence; three score chips (SAT, ACT, IELTS) with dates and sub-scores exactly as supplied; “Baku, Azerbaijan · Class of 2027”.
2. **My symbol: Janusz Korczak**: pinned scene; dots assemble into the halftone portrait; one orange dot on the chest; then quote, motto, subline. Static image for reduced motion / no JS. Alt: “Portrait of Janusz Korczak, 1927”.
3. **Projects** (exactly 7, in order: MathRoutes, Kumiho Hunters, The Youth Collective, SoleShift Kids, ReHand Loom, Sessiz Sifaris, Athena Band). Each: category colour, title, grades as in the CV, one sentence, 2–3 CV facts, link buttons (↗ icon, new tab). A chalk thread connects them. Each has a restyled detail page; URLs of removed projects redirect to /#projects.
4. **Research**: the paper, plus a 100-dot grid: 77 filled, 78–95 outlined orange (the range across portfolios and models), the rest = correlation surprises.
5. **Recognition**: honors and media coverage only.
6. **About** (CV facts only) and **Contact** (email + LinkedIn).
7. **Footer**: “© 2026 Ilyas Taghiyev” + email + LinkedIn. No tool or framework credits.

Navigation follows page order; Projects opens a compact index of the 7 (desktop dropdown, inside the menu on phones). The current section is marked while scrolling.

## 6. Motion

GSAP + ScrollTrigger + Lenis as one system (src/scripts/motion.ts).

- Animate transform and opacity only (the portrait dots are drawn on a canvas). Exponential ease-out, no bounce. Entrances 0.5–0.8s; hovers 150–250ms.
- One authored moment: the Korczak assembly. Everything else supports it: masked heading reveals, intro stagger, count-ups (once), the project thread, the research grid fill, light parallax on decoration, magnetic buttons.
- `prefers-reduced-motion: reduce`: no Lenis, no motion, final states and final numbers shown. Content is never hidden without JS.
- Target 60 fps on mid-range phones; Lighthouse mobile Performance ≥ 90, Accessibility ≥ 95.

## 7. Avoided on purpose

Theme toggles, gradients, glass, glows (except the one soft glow on the hidden-child dot), emoji or unicode glyphs as icons, card grids, logo walls, testimonial or letter quotes, skill bars, bouncy motion, and words like “passionate”, “innovative”, “cutting-edge”.
