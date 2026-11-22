/**
 * Synthetic, illustrative data for the hero dot plot.
 * Seeded so the build is deterministic: every visitor sees the same picture.
 * These numbers are made up and never presented as real results.
 */

export interface Dot {
  /** Horizontal position, 0–100 (% of plot width). */
  x: number;
  /** Vertical position, 0–100 (% of plot height, 0 = top). */
  y: number;
  /** One of the few points far below the average. */
  hidden: boolean;
  /** Drawn on small screens too (outliers always are). */
  core: boolean;
  /** Animation order, 0–1. */
  delay: number;
}

export interface DotPlotData {
  dots: Dot[];
  /** Vertical position of the mean line, 0–100. */
  meanY: number;
  /** Left edge of the outlier group, 0–100, for the annotation. */
  hiddenLeft: number;
  /** Vertical centre of the outlier group, 0–100, for the annotation. */
  hiddenMidY: number;
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

export function makeDotPlot(count = 96, outliers = 5, seed = 2027): DotPlotData {
  const rand = mulberry32(seed);
  const normal = () => {
    const u = 1 - rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  // Outliers sit together in one region of the strip so the eye finds them.
  const outlierSlots = new Set<number>();
  const start = Math.round(count * 0.62);
  const span = Math.round(count * 0.22);
  while (outlierSlots.size < outliers) outlierSlots.add(start + Math.floor(rand() * span));

  const values = Array.from({ length: count }, (_, i) =>
    outlierSlots.has(i)
      ? -3.05 - rand() * 0.75
      : Math.max(-1.45, Math.min(1.45, normal() * 0.5)),
  );
  const mean = values.reduce((a, b) => a + b, 0) / count;

  const top = 1.75;
  const bottom = -4.05;
  const toY = (v: number) => 6 + ((top - v) / (top - bottom)) * 88;

  // Dots use the left 88% of the strip; the rest holds the line's label.
  const step = 88 / count;
  const dots: Dot[] = values.map((v, i) => ({
    x: +(step * (i + 0.5) + (rand() - 0.5) * step * 0.6).toFixed(2),
    y: +toY(v).toFixed(2),
    hidden: outlierSlots.has(i),
    core: outlierSlots.has(i) || i % 2 === 0,
    delay: +rand().toFixed(3),
  }));

  const hiddenDots = dots.filter((d) => d.hidden);
  return {
    dots,
    meanY: +toY(mean).toFixed(2),
    hiddenLeft: Math.min(...hiddenDots.map((d) => d.x)),
    hiddenMidY: +(hiddenDots.reduce((a, d) => a + d.y, 0) / hiddenDots.length).toFixed(2),
  };
}
