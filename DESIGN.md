# Design: ilyastaghiyev.site — “Chalk & Data”

Approved 2026-11-24. Replaces the earlier paper-and-ink design (light/dark) entirely.

## 1. Concept

**“Finding the child the average hides.”** The site is a chalkboard where data becomes people. Its symbol is Janusz Korczak (1878–1942), the Polish pediatrician and educator who treated children as equals, drawn as a halftone portrait of chalk dots. One dot, in orange, is the child the average hides.

- **Mode: Experience.** The work leads; the interface recedes.
- **Tone:** calm, warm, precise. Crafted, never flashy.
- **Honesty:** every fact, number, title and date comes from the CV (the PDF in private/) or the exam scores Ilyas supplied. Nothing from recommendation letters. Illustrative visuals are labelled as such.

## 2. Colors (one theme only)

No light/dark switching. The single theme is the chalkboard. **No Greek letters anywhere** (decorations, marks, favicon, share image): statistics marks are x̄, a bell curve, a scatter cluster, a small histogram, a regression line and tally marks.

| Token | Hex | Role | Contrast on board | on raised |
|---|---|---|---|---|
| `--board` | `#1F2238` | page background: **slate indigo**, a dark chalkboard with a violet undertone | n/a | n/a |
| `--board-raised` | `#272B45` | raised panels (research paper, menus) | n/a | n/a |
| `--chalk` | `#F2EDE3` | text, portrait dots, lines | 13.39 : 1 | 11.86 : 1 |
| `--chalk-muted` | `#AEB0C9` | secondary text, meta (lavender-grey, tuned to the indigo) | 7.33 : 1 | 6.49 : 1 |
| `--orange` | `#F08A3C` | **learning** category; the hidden-child dot; text selection | 6.25 : 1 | 5.54 : 1 |
| `--sky` | `#6CC3E6` | **health** category | 7.88 : 1 | 6.97 : 1 |
| `--yellow` | `#F4C84A` | **communities & accessibility** category; focus ring | 9.83 : 1 | 8.70 : 1 |

Hairlines are chalk at 16% alpha (`--border`), stronger rules at 42% (`--border-strong`). Every text and accent colour passes WCAG AA on both the board and raised panels (all ≥ 5.5 : 1). Accents are crayons: they mark categories and the one hidden dot, never large fills. The favicon, share image (public/og.png) and theme-color use the same board colour; the Korczak static images are transparent and sit on whatever board is behind them.

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

1. **Intro** (first screen, a calling card): name; who Ilyas is and what he does; “I want to study Statistics & Data Science …”; a small record (School · Based in · Graduating) instead of a dotted eyebrow; a 4:5 photo slot (src/assets/ilyas.jpg, soft board/chalk duotone, alt “Ilyas Taghiyev”; a chalk-outlined placeholder until it exists); quiet scroll cue.
2. **Janusz Korczak**: pinned scene; dots assemble into the halftone portrait (as large as the screen allows); one orange dot on the chest; then quote, motto, subline line by line. Static image for reduced motion / no JS. Alt: “Portrait of Janusz Korczak, 1927”. No Greek letters, no law or justice imagery.
3. **Projects** (exactly 7, strongest first, children first: MathRoutes, Kumiho Hunters, SoleShift Kids, The Youth Collective, ReHand Loom, Sessiz Sifaris, Athena Band). Category colour, title, grades as in the CV, one sentence, 2–3 CV facts, link buttons (↗, new tab). A chalk thread connects the nodes. Detail page per project; removed project URLs redirect to /#projects. Below: “More work with children” (CV projects without a website; name, grades, one sentence).
4. **Research**: the paper panel plus a 100-dot grid (1 dot = 1% of squared forecast error): 77 filled, 18 orange rings (the 77–95% range across portfolios and models), 5 empty (correlation surprises).
5. **Recognition**: not a timeline. Honors and selections as statements tagged with their project; media coverage as link cards. Nothing from recommendation letters.
6. **Academics**: SAT, ACT, IELTS (exactly as supplied) and academic honors from the CV.
7. **Contact**: “Every child counts. Write to me.”, email, LinkedIn.
8. **Footer**: “© 2026 Ilyas Taghiyev” + email + LinkedIn. No tool or framework credits, no monogram anywhere.

Navigation follows page order (Projects, Research, Recognition, Academics, Contact); Projects opens a compact index of the 7 (desktop dropdown, inside the menu on phones). Sections without a nav item clear the highlight.

## 6. Motion

GSAP + ScrollTrigger + Lenis as one system (src/scripts/motion.ts).

- Animate transform and opacity only (the portrait dots are drawn on a canvas). Exponential ease-out, no bounce. Entrances 0.5–0.8s; hovers 150–250ms.
- One authored moment: the Korczak assembly. Everything else supports it: masked heading reveals, intro stagger, count-ups (once), the project thread, the research grid fill, light parallax on decoration, magnetic buttons.
- `prefers-reduced-motion: reduce`: no Lenis, no motion, final states and final numbers shown. Content is never hidden without JS.
- Target 60 fps on mid-range phones; Lighthouse mobile Performance ≥ 90, Accessibility ≥ 95.

## 7. Avoided on purpose

Theme toggles, gradients, glass, glows (except the one soft glow on the hidden-child dot), emoji or unicode glyphs as icons, card grids, logo walls, testimonial or letter quotes, skill bars, bouncy motion, and words like “passionate”, “innovative”, “cutting-edge”.
