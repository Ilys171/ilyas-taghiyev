/**
 * Replays the hero Galton board. The SVG already holds the final state, so
 * with reduced motion (or without JS) the finished picture is simply shown.
 * Only transform and opacity are animated.
 */
import { gsap } from 'gsap';

type P = [number, number];
interface Data {
  entry: { x: number; y: number };
  balls: P[][];
  deviant: P[];
}

const HOP = 0.075; // seconds per peg row
const STAGGER = 0.034; // between balls

function init(fig: HTMLElement) {
  (window as unknown as { __galton?: boolean }).__galton = true;
  // If the no-JS fallback already revealed the final state, don't hide it again.
  const autoplay = fig.hasAttribute('data-pending');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    fig.removeAttribute('data-pending');
    return;
  }

  const data: Data = JSON.parse(fig.querySelector('[data-galton-data]')!.textContent!);
  const q = <T extends Element>(s: string) => fig.querySelector<T>(s)!;
  const balls = gsap.utils.toArray<SVGCircleElement>('.ball', fig);
  const dev = q<SVGGElement>('.dev');
  const hot = q<SVGCircleElement>('.dev-hot');
  const kid = q<SVGGElement>('.kid');
  const trunk = q<SVGGElement>('.kid-trunk');
  const arms = q<SVGGElement>('.kid-arms');
  const late = fig.querySelectorAll('.late');
  const lateKid = fig.querySelectorAll('.late-kid');
  const { entry } = data;

  const reset = () => {
    gsap.set(balls, { x: entry.x, y: entry.y, opacity: 0 });
    gsap.set(dev, { x: entry.x, y: entry.y, scale: 0.75, opacity: 0, transformOrigin: '50% 50%' });
    gsap.set(hot, { opacity: 0 });
    gsap.set(kid, { opacity: 1 });
    gsap.set(trunk, { scaleY: 0, opacity: 0, transformOrigin: '50% 100%' });
    gsap.set(arms, { scale: 0, opacity: 0, transformOrigin: '50% 50%' });
    gsap.set([...late, ...lateKid], { opacity: 0 });
  };

  /** Peg-to-peg keyframes, then the drop into place. */
  const route = (path: P[]) => {
    const pegs = path.slice(0, -1);
    const [ex, ey] = path[path.length - 1];
    const [lx, ly] = pegs[pegs.length - 1];
    return [
      ...pegs.map(([x, y], i) => ({ x, y, duration: i === 0 ? 0.16 : HOP, ease: 'power1.in' })),
      { x: ex, y: ey, duration: 0.18 + Math.hypot(ex - lx, ey - ly) / 650, ease: 'power2.in' },
    ];
  };

  reset();
  const tl = gsap.timeline({ paused: true });

  balls.forEach((el, i) => {
    const t = i * STAGGER;
    tl.to(el, { opacity: 1, duration: 0.1 }, t);
    tl.to(el, { keyframes: route(data.balls[i]) }, t);
  });

  // The deviant: same board, different ending.
  const d = data.deviant;
  const hops = d.slice(0, -3);
  const [bounce, ground, head] = d.slice(-3);
  const t0 = balls.length * STAGGER + 0.15;
  const tLand = t0 + 0.16 + (hops.length - 1) * HOP + 0.14 + 0.34;
  tl.to(dev, { opacity: 1, duration: 0.1 }, t0)
    .to(
      dev,
      {
        keyframes: [
          ...hops.map(([x, y], i) => ({ x, y, duration: i === 0 ? 0.16 : HOP, ease: 'power1.in' })),
          { x: bounce[0], y: bounce[1], duration: 0.14, ease: 'power1.out' },
          { x: ground[0], y: ground[1], duration: 0.34, ease: 'power2.in' },
        ],
      },
      t0,
    )
    .to(late, { opacity: 1, duration: 0.5, ease: 'power1.out' }, tLand - 0.5)
    // It lands, turns to the accent colour and stands up as a child.
    .to(hot, { opacity: 1, duration: 0.45, ease: 'power1.out' }, tLand + 0.05)
    .to(dev, { x: head[0], y: head[1], scale: 1, duration: 0.65, ease: 'power2.inOut' }, tLand + 0.2)
    .to(trunk, { scaleY: 1, opacity: 1, duration: 0.65, ease: 'power2.inOut' }, tLand + 0.2)
    .to(arms, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.6)' }, tLand + 0.6)
    .to(lateKid, { opacity: 1, duration: 0.4 }, tLand + 0.85);

  fig.removeAttribute('data-pending');

  const play = () => {
    reset();
    tl.restart();
  };

  const btn = q<HTMLButtonElement>('[data-replay]');
  btn.hidden = false;
  btn.addEventListener('click', play);
  q<SVGSVGElement>('[data-galton-svg]').addEventListener('click', play);

  if (!autoplay) {
    tl.progress(1);
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      gsap.delayedCall(0.25, () => tl.play());
    },
    { threshold: 0.25 },
  );
  io.observe(fig);
}

const fig = document.querySelector<HTMLElement>('[data-galton]');
if (fig) init(fig);
