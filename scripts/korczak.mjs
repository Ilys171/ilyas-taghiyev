/**
 * Builds the Korczak halftone portrait assets from the private source photo.
 *
 *   node scripts/korczak.mjs
 *
 * Input  (local only, never deployed): private/portrait-of-janusz-korczak.jpg
 * Output (committed):
 *   src/data/korczak-desktop.json, src/data/korczak-phone.json  dot positions
 *   public/images/korczak.webp (1120w), public/images/korczak-640.webp  static artwork
 *
 * Steps: crop to head and shoulders, upscale ×2, remove grain, sharpen,
 * local contrast + levels, hand-drawn silhouette mask with soft fades,
 * then an adaptive halftone: small dense dots over the eyes, glasses, nose,
 * mouth and beard, larger dots elsewhere, blended with a Bayer dither.
 * The raw photo is never published.
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const SRC = 'private/portrait-of-janusz-korczak.jpg';

// ---------- helpers on Float32 grayscale arrays (0..1) ----------
async function toRaw(img) {
  const { data, info } = await img.extractChannel(0).raw().toBuffer({ resolveWithObject: true });
  if (info.channels !== 1) throw new Error(`toRaw: expected 1 channel, got ${info.channels}`);
  return { a: Float32Array.from(data, (v) => v / 255), w: info.width, h: info.height };
}
async function gauss(a, w, h, sigma) {
  const buf = Buffer.from(a.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255)));
  // sharp would otherwise return 3 channels; force one.
  const out = await sharp(buf, { raw: { width: w, height: h, channels: 1 } })
    .blur(sigma)
    .toColourspace('b-w')
    .extractChannel(0)
    .raw()
    .toBuffer();
  if (out.length !== w * h) throw new Error(`gauss: expected ${w * h} bytes, got ${out.length}`);
  return Float32Array.from(out, (v) => v / 255);
}
const smoothstep = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
function percentile(a, p) {
  const s = Float32Array.from(a).sort();
  return s[Math.floor((p / 100) * (s.length - 1))];
}

// ---------- 1. clean the photo ----------
const base = sharp(SRC)
  .greyscale()
  .extract({ left: 40, top: 10, width: 560, height: 790 })
  .resize(1120, 1580, { kernel: 'lanczos3' })
  .median(5)
  .blur(1.2)
  .toColourspace('b-w');
let { a, w: W, h: H } = await toRaw(base);

// unsharp mask (radius 4, amount 1.6, threshold 2/255)
{
  const b = await gauss(a, W, H, 4);
  a = a.map((v, i) => {
    const d = v - b[i];
    return Math.abs(d) > 2 / 255 ? v + 1.6 * d : v;
  });
}
// local contrast, then levels (1.5th–99.2th percentile)
{
  const big = await gauss(a, W, H, 60);
  a = a.map((v, i) => Math.min(1, Math.max(0, v + 0.55 * (v - big[i]))));
  const lo = percentile(a, 1.5);
  const hi = percentile(a, 99.2);
  a = a.map((v) => Math.min(1, Math.max(0, (v - lo) / (hi - lo))));
}

// ---------- 2. silhouette mask with soft fades ----------
const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="100%" height="100%" fill="black"/>
  <g fill="white">
    <ellipse cx="555" cy="520" rx="390" ry="490"/>
    <ellipse cx="166" cy="650" rx="74" ry="180"/>
    <ellipse cx="951" cy="660" rx="71" ry="160"/>
    <polygon points="300,920 230,1060 0,1170 0,${H} ${W},${H} ${W},1190 900,1070 820,920"/>
  </g></svg>`;
let { a: mask } = await toRaw(sharp(Buffer.from(maskSvg)).greyscale().toColourspace('b-w'));
mask = await gauss(mask, W, H, 16);
for (let y = 0; y < H; y++) {
  const bottom = smoothstep(0, 1, (H - 140 - y) / 420);
  for (let x = 0; x < W; x++) {
    let side = Math.min(1, Math.max(0, 1 - (Math.abs(x - W / 2) - 300) / 300));
    side = y > 1000 ? side * side * (3 - 2 * side) : 1;
    mask[y * W + x] *= bottom * side;
  }
}

// ---------- 3. tone (chalk = light), darker suit; detail map ----------
const tone = new Float32Array(W * H);
const detail = new Float32Array(W * H);
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    const i = y * W + x;
    let t = Math.pow(a[i], 1.1) * mask[i];
    if (y > 1120 && Math.abs(x - 560) > 150) t *= 0.6;
    tone[i] = t;
    const f = Math.exp(-(((x - 570) / 330) ** 2 + ((y - 800) / 340) ** 2));
    detail[i] = mask[i] > 0.2 ? f : 0;
  }
const tb = await gauss(tone, W, H, 2);

// ---------- 4. adaptive halftone cells ----------
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((r) => r.map((v) => v / 16 + 1 / 32));

function meanDetail(x0, y0, s) {
  let sum = 0,
    n = 0;
  for (let y = y0; y < Math.min(y0 + s, H); y++)
    for (let x = x0; x < Math.min(x0 + s, W); x++) {
      sum += detail[y * W + x];
      n++;
    }
  return n ? sum / n : 0;
}

/** @returns {number[]} flat [x, y, r*10, ...] in source pixels (1120 × 1580 space) */
function halftone(BASE, minR) {
  const cells = [];
  for (let j = 0, y = 0; y < H; j++, y += BASE) {
    const off = j % 2 ? Math.floor(BASE / 2) : 0;
    for (let i = 0, x = -off; x < W; i++, x += BASE) {
      const p = smoothstep(0.25, 0.6, meanDetail(Math.max(x, 0), y, BASE));
      if (p > BAYER[j % 4][i % 4]) {
        const hs = BASE / 2;
        for (const dx of [0, hs]) for (const dy of [0, hs]) cells.push([x + dx + hs / 2, y + dy + hs / 2, hs]);
      } else cells.push([x + BASE / 2, y + BASE / 2, BASE]);
    }
  }
  const out = [];
  for (const [cx, cy, s] of cells) {
    const xi = Math.min(Math.max(Math.trunc(cx), 0), W - 1);
    const yi = Math.min(Math.trunc(cy), H - 1);
    const t = tb[yi * W + xi];
    if (t < 0.05) continue;
    const r = (s / 2) * 0.92 * Math.sqrt(t);
    if (r < minR) continue;
    out.push(Math.round(cx), Math.round(cy), Math.round(r * 10));
  }
  return out;
}

// the hidden child: one orange dot on the chest, heart side (viewer's right)
const HEART = [790, 1290, 146];

const raw = {
  desktop: halftone(18, 0.45),
  phone: halftone(26, 0.79),
};

// Crop to the dots themselves (plus a small margin), so the portrait fills its
// frame on the page instead of carrying the empty fade area around it.
let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
for (const dots of Object.values(raw))
  for (let i = 0; i < dots.length; i += 3) {
    const r = dots[i + 2] / 10;
    x0 = Math.min(x0, dots[i] - r);
    y0 = Math.min(y0, dots[i + 1] - r);
    x1 = Math.max(x1, dots[i] + r);
    y1 = Math.max(y1, dots[i + 1] + r);
  }
const PAD = 10;
x0 = Math.floor(x0 - PAD);
y0 = Math.floor(y0 - PAD);
const CW = Math.ceil(x1 + PAD) - x0;
const CH = Math.ceil(y1 + PAD) - y0;
const shift = (dots) => dots.map((v, i) => (i % 3 === 0 ? v - x0 : i % 3 === 1 ? v - y0 : v));
const sets = { desktop: shift(raw.desktop), phone: shift(raw.phone) };
const HEART_C = [HEART[0] - x0, HEART[1] - y0, HEART[2]];

for (const [name, dots] of Object.entries(sets)) {
  const json = { w: CW, h: CH, heart: HEART_C, dots };
  await writeFile(`src/data/korczak-${name}.json`, JSON.stringify(json));
  console.log(`src/data/korczak-${name}.json: ${dots.length / 3} dots, ${CW}×${CH}`);
}

// ---------- 5. static artwork (reduced motion, no JS, final frame) ----------
async function render(dots, outW, file) {
  const s = outW / CW;
  const outH = Math.round(CH * s);
  const [hx, hy, hr] = HEART_C.map((v, i) => (i === 2 ? (v / 10) * s : v * s));
  let circles = '';
  for (let i = 0; i < dots.length; i += 3)
    circles += `<circle cx="${(dots[i] * s).toFixed(1)}" cy="${(dots[i + 1] * s).toFixed(1)}" r="${((dots[i + 2] / 10) * s).toFixed(2)}"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${outW}" height="${outH}" viewBox="0 0 ${outW} ${outH}">
    <defs><radialGradient id="g"><stop offset="0" stop-color="#F08A3C" stop-opacity="0.55"/><stop offset="1" stop-color="#F08A3C" stop-opacity="0"/></radialGradient></defs>
    <g fill="#F2EDE3">${circles}</g>
    <circle cx="${hx}" cy="${hy}" r="${hr * 4}" fill="url(#g)"/>
    <circle cx="${hx}" cy="${hy}" r="${hr}" fill="#F08A3C"/>
  </svg>`;
  const info = await sharp(Buffer.from(svg)).webp({ quality: 74, alphaQuality: 85, effort: 6 }).toFile(file);
  console.log(`${file}: ${outW}×${outH}, ${(info.size / 1024).toFixed(1)} KB`);
}
await render(sets.desktop, CW, 'public/images/korczak.webp');
await render(sets.phone, 640, 'public/images/korczak-640.webp');
