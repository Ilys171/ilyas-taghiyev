/**
 * Geometry for the hero Galton board (illustrative, not real data).
 * Computed at build time with a seeded PRNG, so every visitor sees the same
 * picture and the HTML already contains the final, resting state.
 *
 * Coordinates are SVG user units inside the viewBox below.
 */

export const VIEW = { x: 70, y: 0, w: 560, h: 460 };

const CX = 270; // board centre
const ROWS = 9;
const DX = 34; // horizontal peg spacing
const DY = 28; // vertical row spacing
const Y0 = 56; // first peg row
const PEG_R = 2.2;
export const BALL_R = 6;
const FLOOR = 440;
const WALL_TOP = 332;
const STEP = 12; // stacking step inside a bin

/** Balls per bin: the binomial(9, ½) shape for 60 balls, rounded. */
const BIN_COUNTS = [0, 1, 4, 10, 15, 15, 10, 4, 1, 0];

/** Where the child stands, outside the distribution. */
export const KID = { x: 566, ground: FLOOR, headY: FLOOR - 62, headR: 8 };

export interface Pt {
  x: number;
  y: number;
}

export interface Ball {
  /** Resting position. */
  end: Pt;
  /** Contact points on the way down, ending with `end`. */
  path: Pt[];
}

export interface Galton {
  view: typeof VIEW;
  pegs: Pt[];
  pegR: number;
  walls: { x: number; y1: number; y2: number; mean: boolean }[];
  floor: { x1: number; x2: number; y: number };
  funnel: string;
  curve: string;
  entry: Pt;
  balls: Ball[];
  deviant: Ball;
  /** For HTML labels: positions as % of the viewBox. */
  labels: { average: Pt; kid: Pt };
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;
const pegX = (row: number, idx: number) => CX + (idx - row / 2) * DX;
const contactY = (row: number) => Y0 + row * DY - (PEG_R + BALL_R + 0.5);

/** Contact points for a left/right sequence (true = right). */
function hops(moves: boolean[]): Pt[] {
  const pts: Pt[] = [];
  let idx = 0;
  for (let row = 0; row < ROWS; row++) {
    pts.push({ x: r1(pegX(row, idx)), y: r1(contactY(row)) });
    if (moves[row]) idx++;
  }
  return pts;
}

export function makeGalton(seed = 2027): Galton {
  const rand = mulberry32(seed);

  const pegs: Pt[] = [];
  for (let row = 0; row < ROWS; row++)
    for (let i = 0; i <= row; i++) pegs.push({ x: r1(pegX(row, i)), y: Y0 + row * DY });

  // Assign each ball a bin, in a shuffled drop order, so the pile grows evenly.
  const bins: number[] = [];
  BIN_COUNTS.forEach((n, k) => {
    for (let i = 0; i < n; i++) bins.push(k);
  });
  for (let i = bins.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [bins[i], bins[j]] = [bins[j], bins[i]];
  }

  const filled = BIN_COUNTS.map(() => 0);
  const balls: Ball[] = bins.map((k) => {
    // A random route with exactly k right turns ends in bin k.
    const moves = Array.from({ length: ROWS }, (_, i) => i < k);
    for (let i = moves.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [moves[i], moves[j]] = [moves[j], moves[i]];
    }
    const slot = filled[k]++;
    const binX = CX + (k - ROWS / 2) * DX;
    const end = {
      x: r1(binX + (slot % 2 === 0 ? -1 : 1) * (BALL_R + 0.6)),
      y: r1(FLOOR - BALL_R - Math.floor(slot / 2) * STEP),
    };
    return { end, path: [...hops(moves), end] };
  });

  // The one that does not follow the crowd: it keeps going right and,
  // at the last peg, bounces clear of the bins.
  const devMoves = [true, true, false, true, true, true, true, true, true];
  const devHops = hops(devMoves);
  const last = devHops[devHops.length - 1];
  const deviant: Ball = {
    end: { x: KID.x, y: KID.headY },
    path: [
      ...devHops,
      { x: r1(last.x + 70), y: r1(last.y + 8) },
      { x: KID.x, y: FLOOR - BALL_R },
      { x: KID.x, y: KID.headY },
    ],
  };

  const walls = BIN_COUNTS.slice(1).map((_, i) => {
    const x = r1(CX + (i + 1 - ROWS / 2 - 0.5) * DX);
    const mean = Math.abs(x - CX) < 0.5;
    return { x, y1: mean ? WALL_TOP - 34 : WALL_TOP, y2: FLOOR, mean };
  });

  // Normal curve over the pile: σ = DX·√(n·p·q), height matched to the centre bins.
  const sigma = DX * Math.sqrt(ROWS * 0.25);
  const peakBalls = 15 / Math.exp(-((DX / 2) ** 2) / (2 * sigma ** 2));
  const peak = (peakBalls / 2) * STEP + 8;
  const xs = Array.from({ length: 49 }, (_, i) => CX - 180 + i * 7.5);
  const curve = xs
    .map((x, i) => `${i ? 'L' : 'M'}${r1(x)} ${r1(FLOOR - peak * Math.exp(-((x - CX) ** 2) / (2 * sigma ** 2)))}`)
    .join(' ');

  const pct = (p: Pt): Pt => ({
    x: r1(((p.x - VIEW.x) / VIEW.w) * 100),
    y: r1(((p.y - VIEW.y) / VIEW.h) * 100),
  });

  return {
    view: VIEW,
    pegs,
    pegR: PEG_R,
    walls,
    floor: { x1: CX - 5 * DX - 12, x2: KID.x + 40, y: FLOOR },
    funnel: `M${CX - 44} 6 L${CX - 9} 34 M${CX + 44} 6 L${CX + 9} 34`,
    curve,
    entry: { x: CX, y: 14 },
    balls,
    deviant,
    labels: { average: pct({ x: CX, y: WALL_TOP - 40 }), kid: pct({ x: KID.x, y: KID.headY - 18 }) },
  };
}
