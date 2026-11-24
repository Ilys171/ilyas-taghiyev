/**
 * Korczak scene: data points become a person.
 *
 * The stage pins for a short stretch of scroll. Scattered chalk dots fly in
 * (scrubbed by scroll) and assemble into the halftone portrait; the face
 * arrives first. Then one dot on the chest turns orange and glows: the child
 * the average hides. Below the stage, the quote, motto and subline reveal
 * line by line.
 *
 * Only called when motion is allowed (see motion.ts). Dots are drawn on a
 * canvas from pre-rendered sprites; the DOM is never animated per dot.
 * Dot data (src/data/korczak-*.json) loads lazily as the section approaches.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface DotData {
  w: number;
  h: number;
  heart: [number, number, number];
  /** flat [x, y, r*10, ...] in source pixels */
  dots: number[];
}

const CHALK = '#F2EDE3';
const ORANGE = '#F08A3C';
/** Share of the pinned scroll used for the assembly; the rest is the orange dot and a hold. */
const ASSEMBLE_END = 0.68;
const HEART_START = 0.72;
const HEART_END = 0.86;
/** Latest start (as a share of the assembly) of any single dot. */
const MAX_DELAY = 0.5;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (t: number) => 1 - (1 - t) * (1 - t) * (1 - t);

/** Small seeded PRNG so every visitor sees the same scatter. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sprite(size: number, paint: (ctx: CanvasRenderingContext2D, c: number) => void) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  paint(ctx, size / 2);
  return c;
}

export function initKorczak(): () => void {
  const section = document.getElementById('korczak');
  const stage = section?.querySelector<HTMLElement>('[data-korczak-stage]');
  const canvas = section?.querySelector<HTMLCanvasElement>('[data-korczak-canvas]');
  const frame = section?.querySelector<HTMLElement>('[data-korczak-frame]');
  if (!section || !stage || !canvas || !frame) return () => {};
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  let killed = false;
  let data: DotData | null = null;
  let progress = 0;
  let drawn = -1;

  // Per-dot arrays (filled once data has loaded)
  let n = 0;
  let tx: Float32Array, ty: Float32Array, tr: Float32Array; // targets, in source px
  let ux: Float32Array, uy: Float32Array; // start positions, 0..1 of the stage
  let delay: Float32Array;
  let heartDelay = MAX_DELAY;

  // Layout (canvas px)
  let dpr = 1;
  let cw = 0;
  let ch = 0;
  let ox = 0;
  let oy = 0;
  let scale = 1;

  // Chalk dot sprites at a few sizes, so each dot is drawn from a sprite close
  // to its on-screen size (cheaper and crisper than shrinking one big sprite).
  const SIZES = [4, 8, 16, 32, 64];
  const dotSprites = SIZES.map((size) =>
    sprite(size, (c, m) => {
      c.fillStyle = CHALK;
      c.beginPath();
      c.arc(m, m, m, 0, Math.PI * 2);
      c.fill();
    }),
  );
  const dotSprite = dotSprites[dotSprites.length - 1];
  const pick = (d: number) => dotSprites[d <= 4 ? 0 : d <= 8 ? 1 : d <= 16 ? 2 : d <= 32 ? 3 : 4];
  /** The assembled portrait, drawn once and reused while the orange dot appears. */
  let assembled: HTMLCanvasElement | null = null;
  const heartSprite = sprite(64, (c, m) => {
    c.fillStyle = ORANGE;
    c.beginPath();
    c.arc(m, m, m, 0, Math.PI * 2);
    c.fill();
  });
  const glowSprite = sprite(128, (c, m) => {
    const g = c.createRadialGradient(m, m, 0, m, m, m);
    g.addColorStop(0, 'rgba(240,138,60,0.55)');
    g.addColorStop(1, 'rgba(240,138,60,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, m * 2, m * 2);
  });

  /** Fit the portrait into the frame like `object-fit: contain`, in canvas px. */
  function layout() {
    if (!data) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const s = stage!.getBoundingClientRect();
    const f = frame!.getBoundingClientRect();
    cw = Math.round(s.width * dpr);
    ch = Math.round(s.height * dpr);
    canvas!.width = cw;
    canvas!.height = ch;
    scale = Math.min(f.width / data.w, f.height / data.h);
    const pw = data.w * scale;
    const ph = data.h * scale;
    ox = (f.left - s.left + (f.width - pw) / 2) * dpr;
    oy = (f.top - s.top + (f.height - ph) / 2) * dpr;
    scale *= dpr;
    assembled = null;
    drawn = -1;
    draw();
  }

  function prepare(d: DotData) {
    data = d;
    n = d.dots.length / 3;
    tx = new Float32Array(n);
    ty = new Float32Array(n);
    tr = new Float32Array(n);
    ux = new Float32Array(n);
    uy = new Float32Array(n);
    delay = new Float32Array(n);
    const rand = mulberry32(1927);
    // The face (around the eyes) arrives first, the edges last.
    const fx = 570;
    const fy = 760;
    const maxDist = Math.hypot(d.w, d.h) * 0.6;
    for (let i = 0; i < n; i++) {
      const x = d.dots[i * 3];
      const y = d.dots[i * 3 + 1];
      tx[i] = x;
      ty[i] = y;
      tr[i] = d.dots[i * 3 + 2] / 10;
      ux[i] = rand();
      uy[i] = rand();
      const dist = Math.min(1, Math.hypot(x - fx, y - fy) / maxDist);
      delay[i] = MAX_DELAY * (0.35 * rand() + 0.65 * dist);
    }
    heartDelay = MAX_DELAY;
  }

  function draw() {
    if (!data || progress === drawn) return;
    drawn = progress;
    ctx!.clearRect(0, 0, cw, ch);

    const a = clamp01(progress / ASSEMBLE_END);
    const span = 1 - MAX_DELAY;
    if (a >= 1) {
      // Fully assembled: reuse the cached portrait.
      if (!assembled) {
        assembled = document.createElement('canvas');
        assembled.width = cw;
        assembled.height = ch;
        const c = assembled.getContext('2d')!;
        for (let i = 0; i < n; i++) {
          const r = tr[i] * scale;
          c.drawImage(pick(r * 2), ox + tx[i] * scale - r, oy + ty[i] * scale - r, r * 2, r * 2);
        }
      }
      ctx!.drawImage(assembled, 0, 0);
    } else {
      for (let i = 0; i < n; i++) {
        const e = easeOut(clamp01((a - delay[i]) / span));
        const sx = ux[i] * cw;
        const sy = uy[i] * ch;
        const x = sx + (ox + tx[i] * scale - sx) * e;
        const y = sy + (oy + ty[i] * scale - sy) * e;
        const r = tr[i] * scale * (0.5 + 0.5 * e);
        ctx!.globalAlpha = 0.35 + 0.65 * e;
        ctx!.drawImage(pick(r * 2), x - r, y - r, r * 2, r * 2);
      }
      ctx!.globalAlpha = 1;
    }

    // The hidden child: flies in last, then turns orange and glows.
    const [hx0, hy0, hr0] = data.heart;
    const he = easeOut(clamp01((a - heartDelay) / span));
    const sx = 0.92 * cw;
    const sy = 0.08 * ch;
    const hx = sx + (ox + hx0 * scale - sx) * he;
    const hy = sy + (oy + hy0 * scale - sy) * he;
    const hr = (hr0 / 10) * scale * (0.5 + 0.5 * he);
    const h = easeOut(clamp01((progress - HEART_START) / (HEART_END - HEART_START)));
    if (h > 0) {
      const g = hr * 4 * h;
      ctx!.globalAlpha = h;
      ctx!.drawImage(glowSprite, hx - g, hy - g, g * 2, g * 2);
    }
    ctx!.globalAlpha = (0.35 + 0.65 * he) * (1 - h);
    if (h < 1) ctx!.drawImage(dotSprite, hx - hr * 0.7, hy - hr * 0.7, hr * 1.4, hr * 1.4);
    ctx!.globalAlpha = h;
    if (h > 0) ctx!.drawImage(heartSprite, hx - hr, hy - hr, hr * 2, hr * 2);
    ctx!.globalAlpha = 1;
  }

  // 1. Pin + scrub. Created right away (no data needed) so ScrollTriggers stay
  //    in page order; drawing starts as soon as the dots have loaded.
  const proxy = { p: 0 };
  const tween = gsap.to(proxy, {
    p: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: stage,
      start: 'top top',
      end: '+=140%',
      pin: true,
      anticipatePin: 1,
      scrub: 0.6,
      onRefresh: () => layout(),
    },
    onUpdate: () => {
      progress = proxy.p;
      draw();
    },
  });

  // 2. Load the dots when the section is about a screen and a half away.
  const io = new IntersectionObserver(
    async (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      const small = window.matchMedia('(max-width: 47.99rem)').matches;
      try {
        const mod = small ? await import('../data/korczak-phone.json') : await import('../data/korczak-desktop.json');
        if (killed) return;
        prepare(mod.default as unknown as DotData);
        document.documentElement.classList.add('korczak-live');
        progress = proxy.p;
        layout();
      } catch {
        // Keep the static portrait if the data cannot load.
      }
    },
    { rootMargin: '150% 0px' },
  );
  io.observe(section);

  // 3. Quote, motto, subline: each line rises out of its own mask, once.
  const splits = gsap.utils.toArray<HTMLElement>('#korczak [data-lines]').map((el) =>
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 105,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }),
    }),
  );

  return () => {
    killed = true;
    io.disconnect();
    tween.scrollTrigger?.kill();
    tween.kill();
    splits.forEach((s) => s.revert());
    document.documentElement.classList.remove('korczak-live');
  };
}
