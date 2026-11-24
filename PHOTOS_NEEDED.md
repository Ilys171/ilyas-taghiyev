# Photos needed

> **Privacy rule — read first.** Many of these projects involve children, including children with ADHD and Roma children. For any project with children, send only photos of **materials, hands, setups, screens, or workshops taken from behind or at a distance**. **No close-up, identifiable children’s faces**, and no names, name tags or school logos that could identify a child. If you are unsure about a photo, leave it out. Adults (weavers, supervisors, team members) only with their permission.

## How it works

1. Save the photo as `src/assets/photos/<id>.jpg` using the exact id below (`.jpeg`, `.png` and `.webp` also work).
2. That's it. The site picks it up on the next `npm run dev` / build. Astro converts it to AVIF and WebP in several widths, sets the right `sizes`, and lazy-loads it.
3. Until a photo exists, the slot is **hidden on the live site** and shown as a dashed placeholder (with this description) in `npm run dev`.

Alt text lives in `src/data/photos.ts`. Edit it there if your photo shows something different from the draft.

**General specs for all slots:** JPG, sRGB, at least the recommended size, **max 3 MB** per file. Don't apply filters. Straighten horizons. Even, natural light beats flash.

## Slots

| # | File | Where it appears | What it should show | Orientation · ratio | Recommended size | Alt text (draft) | Priority |
|---|---|---|---|---|---|---|---|
| 1 | `src/assets/photos/mathroutes.jpg` | MathRoutes project page, under the title | Task cards on a table, children’s **hands** drawing, cutting or building. Top-down or over-the-shoulder. **Hands only, no faces.** | Landscape · 3:2 | 2400 × 1600 px | MathRoutes task cards on a table, with children’s hands cutting and drawing | **must-have** |
| 2 | `src/assets/photos/kumiho-hunters.jpg` | Kumiho Hunters project page | The team presenting at the South Korean Embassy, **or** a lesson photographed from the back of the classroom (children seen from behind). | Landscape · 3:2 | 2400 × 1600 px | Kumiho Hunters presentation at the South Korean Embassy in Baku | **must-have** |
| 3 | `src/assets/photos/soleshift-kids.jpg` | SoleShift Kids project page | The foot-pressure sensor and a pair of the free insoles, flat on a plain surface. No children. | Landscape · 3:2 | 2400 × 1600 px | The SoleShift Kids foot-pressure sensor next to a pair of insoles | **must-have** |
| 4 | `src/assets/photos/stem-van-thuis.jpg` | Stem van Thuis project page | All 12 picture cards laid out in a grid, from directly above, QR codes visible. | Landscape · 3:2 | 2400 × 1600 px | The 12 Stem van Thuis picture cards for food, sleep and pain, laid out in a grid | **must-have** |
| 5 | `src/assets/photos/rehand-loom.jpg` | ReHand Loom project page | The sensor glove on a weaver’s hand at the loom; close-up of hand and carpet (with the weaver’s permission). | Landscape · 3:2 | 2400 × 1600 px | A weaver’s hand wearing the ReHand Loom sensor glove at a carpet loom | **must-have** |
| 6 | `src/assets/photos/portrait.jpg` | About section, above the facts list | You, waist-up, natural light, plain background. Not a selfie. | Portrait · 4:5 | 1600 × 2000 px | Portrait of Ilyas Taghiyev | nice-to-have |
| 7 | `src/assets/photos/click.jpg` | CLICK project page | A **screenshot** of one of the 14 tutorials. No children’s names, faces or video tiles visible. | Landscape · 3:2 | 2400 × 1600 px | A page from one of the CLICK tutorials | nice-to-have |
| 8 | `src/assets/photos/youth-collective.jpg` | The Youth Collective project page | Workshop materials (observation sheets, charts the children made), or the room from behind. | Landscape · 3:2 | 2400 × 1600 px | Observation sheets and charts from a Youth Collective workshop | nice-to-have |
| 9 | `src/assets/photos/childrens-foundation.jpg` | Azerbaijan Children’s Foundation project page | The tech setup you managed at a children’s event, or a wide shot of the event from a distance. | Landscape · 3:2 | 2400 × 1600 px | Technology setup at an Azerbaijan Children’s Foundation event | nice-to-have |
| 10 | `src/assets/photos/loomlock.jpg` | LoomLock project page | A training session with an artisan family (wide, with permission), or a screen showing the role-based permissions. | Landscape · 3:2 | 2400 × 1600 px | LoomLock digital-security training with an artisan family | nice-to-have |
| 11 | `src/assets/photos/sessiz-sifaris.jpg` | Sessiz Sifaris project page | The QR ordering card at a pilot restaurant counter. Avoid other guests’ faces. | Landscape · 3:2 | 2400 × 1600 px | The Sessiz Sifaris QR ordering card at a restaurant counter | nice-to-have |
| 12 | `src/assets/photos/athena-band.jpg` | Athena Band project page | The band next to a screen showing your dashboard. | Landscape · 3:2 | 2400 × 1600 px | The Athena Band beside its data dashboard | nice-to-have |
| 13 | `src/assets/photos/wolbacaspian.jpg` | WolbaCaspian project page | One solar sensor station in the field. | Landscape · 3:2 | 2400 × 1600 px | A WolbaCaspian solar sensor station in the Caspian lowlands | nice-to-have |

Minimum size for every landscape slot is 1600 × 1067 px; smaller photos still work but look soft on large screens.

The home page project list has **no** photos on purpose (DESIGN.md: rows, not cards). Photos appear on project pages only.
