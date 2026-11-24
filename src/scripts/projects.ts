/**
 * Projects list: the chalk thread and the hover dots.
 *
 * layoutThread()  always: fits the thread from the first node to the last.
 * initProjects()  motion only: the thread draws with scroll and each node
 *                 lights up as the thread reaches it; on hover or keyboard
 *                 focus a few dots leave the node and settle back.
 * Transform and opacity only.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** The line the thread "writes" at: 65% down the viewport. */
const PEN = 'top 65%';

export function layoutThread() {
  const wrap = document.querySelector<HTMLElement>('[data-thread]')?.parentElement;
  const thread = document.querySelector<HTMLElement>('[data-thread]');
  const nodes = document.querySelectorAll<HTMLElement>('[data-node]');
  if (!wrap || !thread || nodes.length < 2) return;
  const fit = () => {
    const w = wrap.getBoundingClientRect();
    const a = nodes[0].getBoundingClientRect();
    const b = nodes[nodes.length - 1].getBoundingClientRect();
    const top = a.top + a.height / 2 - w.top;
    const bottom = b.top + b.height / 2 - w.top;
    thread.style.setProperty('--thread-top', `${top}px`);
    thread.style.setProperty('--thread-h', `${Math.max(0, bottom - top)}px`);
  };
  fit();
  new ResizeObserver(fit).observe(wrap);
}

export function initProjects(): () => void {
  const draw = document.querySelector<HTMLElement>('[data-thread-draw]');
  const nodes = gsap.utils.toArray<HTMLElement>('[data-node]');
  if (!draw || nodes.length < 2) return () => {};

  // 1. The thread draws from the first node to the last as you scroll.
  const thread = gsap.fromTo(
    draw,
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: nodes[0],
        start: PEN,
        endTrigger: nodes[nodes.length - 1],
        end: PEN,
        scrub: 0.5,
      },
    },
  );

  // 2. Each node lights up when the thread reaches it.
  const lights = nodes.map((node) =>
    gsap.fromTo(
      node,
      { scale: 0.45, opacity: 0.35 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'expo.out',
        scrollTrigger: { trigger: node, start: PEN, toggleActions: 'play none none reverse' },
      },
    ),
  );

  // 3. Hover / focus: a few dots leave the node and settle back (~0.6 s total).
  const cleanups: (() => void)[] = [];
  document.querySelectorAll<HTMLElement>('[data-project]').forEach((project) => {
    const sparks = project.querySelectorAll<HTMLElement>('[data-spark]');
    let tl: gsap.core.Timeline | null = null;
    const burst = () => {
      if (tl?.isActive()) return;
      tl = gsap.timeline();
      sparks.forEach((s, i) => {
        const angle = (i / sparks.length) * Math.PI * 2 + gsap.utils.random(-0.35, 0.35);
        const dist = gsap.utils.random(14, 26);
        tl!
          .fromTo(
            s,
            { x: 0, y: 0, opacity: 1, scale: 1 },
            { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, duration: 0.28, ease: 'expo.out' },
            i * 0.015,
          )
          .to(s, { x: 0, y: 0, opacity: 0, scale: 0.6, duration: 0.32, ease: 'power2.inOut' }, '>-0.02');
      });
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') burst();
    };
    project.addEventListener('pointerenter', onEnter);
    project.addEventListener('focusin', burst);
    cleanups.push(() => {
      project.removeEventListener('pointerenter', onEnter);
      project.removeEventListener('focusin', burst);
      tl?.kill();
    });
  });

  return () => {
    thread.scrollTrigger?.kill();
    thread.kill();
    lights.forEach((l) => {
      l.scrollTrigger?.kill();
      l.kill();
    });
    gsap.set([draw, ...nodes], { clearProps: 'transform,opacity' });
    cleanups.forEach((c) => c());
  };
}
