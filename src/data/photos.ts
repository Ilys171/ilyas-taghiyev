/**
 * Photo slots. To fill one, save the photo as
 *   src/assets/photos/<id>.jpg   (or .jpeg / .png / .webp)
 * and it appears on the site, optimized to AVIF/WebP at several widths.
 * Until then the slot is hidden on the live site and shown as a labelled
 * placeholder in `npm run dev`. Full brief: PHOTOS_NEEDED.md.
 *
 * Privacy: for projects with children, only materials, hands, setups, or
 * workshops from behind or at a distance. No identifiable children’s faces.
 */

export interface PhotoSlot {
  /** What the photo should show (shown in the dev placeholder). */
  shows: string;
  alt: string;
  /** width / height */
  ratio: number;
  priority: 'must-have' | 'nice-to-have';
  caption?: string;
}

export const photos: Record<string, PhotoSlot> = {
  portrait: {
    shows: 'You, waist-up, natural light, plain background. Not a selfie.',
    alt: 'Portrait of Ilyas Taghiyev',
    ratio: 4 / 5,
    priority: 'nice-to-have',
  },
  mathroutes: {
    shows: 'MathRoutes task cards on a table, with children’s hands drawing, cutting or building. Hands only, no faces.',
    alt: 'MathRoutes task cards on a table, with children’s hands cutting and drawing',
    ratio: 3 / 2,
    priority: 'must-have',
  },
  'kumiho-hunters': {
    shows: 'The team presenting at the South Korean Embassy, or a lesson photographed from the back of the classroom.',
    alt: 'Kumiho Hunters presentation at the South Korean Embassy in Baku',
    ratio: 3 / 2,
    priority: 'must-have',
  },
  'soleshift-kids': {
    shows: 'The foot-pressure sensor and a pair of the free insoles, flat on a plain surface.',
    alt: 'The SoleShift Kids foot-pressure sensor next to a pair of insoles',
    ratio: 3 / 2,
    priority: 'must-have',
  },
  'stem-van-thuis': {
    shows: 'All 12 picture cards laid out in a grid, seen from above, QR codes visible.',
    alt: 'The 12 Stem van Thuis picture cards for food, sleep and pain, laid out in a grid',
    ratio: 3 / 2,
    priority: 'must-have',
  },
  click: {
    shows: 'A screenshot of one of the 14 CLICK tutorials (no children’s names or faces visible).',
    alt: 'A page from one of the CLICK tutorials',
    ratio: 3 / 2,
    priority: 'nice-to-have',
  },
  'youth-collective': {
    shows: 'Workshop materials: observation sheets, charts children made. Or the room from behind.',
    alt: 'Observation sheets and charts from a Youth Collective workshop',
    ratio: 3 / 2,
    priority: 'nice-to-have',
  },
  'childrens-foundation': {
    shows: 'The tech setup you managed at a children’s event, or a wide shot of the event from a distance.',
    alt: 'Technology setup at an Azerbaijan Children’s Foundation event',
    ratio: 3 / 2,
    priority: 'nice-to-have',
  },
  loomlock: {
    shows: 'A training session with artisan families, wide shot, or a screen of the role-based permissions.',
    alt: 'LoomLock digital-security training with an artisan family',
    ratio: 3 / 2,
    priority: 'nice-to-have',
  },
  'rehand-loom': {
    shows: 'The sensor glove on a weaver’s hand at the loom. Close-up of hand and carpet.',
    alt: 'A weaver’s hand wearing the ReHand Loom sensor glove at a carpet loom',
    ratio: 3 / 2,
    priority: 'must-have',
  },
  'sessiz-sifaris': {
    shows: 'The QR ordering card at a pilot restaurant counter.',
    alt: 'The Sessiz Sifaris QR ordering card at a restaurant counter',
    ratio: 3 / 2,
    priority: 'nice-to-have',
  },
  'athena-band': {
    shows: 'The band next to a screen showing your dashboard.',
    alt: 'The Athena Band beside its data dashboard',
    ratio: 3 / 2,
    priority: 'nice-to-have',
  },
  wolbacaspian: {
    shows: 'One solar sensor station in the field.',
    alt: 'A WolbaCaspian solar sensor station in the Caspian lowlands',
    ratio: 3 / 2,
    priority: 'nice-to-have',
  },
};
