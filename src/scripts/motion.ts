/**
 * Site-wide motion: scroll reveals, number count-ups and the scroll-linked
 * research figure. Transform and opacity only (count-ups change text in a
 * fixed-width mono box). With reduced motion, everything is shown as-is.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initKorczak } from './korczak';
import { initProjects, layoutThread } from './projects';

gsap.registerPlugin(ScrollTrigger);
(window as unknown as { __motion?: boolean }).__motion = true;

const root = document.documentElement;

// The thread's geometry is layout, not motion: needed in every mode.
layoutThread();
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: reduce)', () => {
  root.classList.add('no-motion');
  return () => root.classList.remove('no-motion');
});

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // 0. Intro, once on load: the name rises out of its masks, then the lines
  //    around it. Transform + opacity only; the HTML holds the final state.
  const words = gsap.utils.toArray<HTMLElement>('[data-intro-word]');
  if (words.length) {
    gsap
      .timeline({ defaults: { ease: 'expo.out' } })
      .fromTo(
        '[data-intro]',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, clearProps: 'transform' },
        0.1,
      )
      .fromTo(words, { yPercent: 105, y: 0 }, { yPercent: 0, duration: 1.1, stagger: 0.09 }, 0.15);
  }

  // The scroll cue fades out as soon as the reader starts scrolling.
  const cue = document.querySelector<HTMLElement>('[data-scroll-cue]');
  if (cue) {
    gsap.fromTo(
      cue,
      { autoAlpha: 1 },
      { autoAlpha: 0, ease: 'none', immediateRender: false, scrollTrigger: { start: 0, end: 160, scrub: true } },
    );
  }

  // 0b. Academics: main scores count up once when they enter the viewport.
  gsap.utils.toArray<HTMLElement>('[data-countup-view]').forEach((el, i) => {
    const final = el.textContent!.trim();
    const to = Number(el.dataset.countupView);
    const dp = Number(el.dataset.decimals ?? 0);
    const state = { v: 0 };
    el.textContent = (0).toFixed(dp);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () =>
        gsap.to(state, {
          v: to,
          duration: 1.4,
          delay: 0.15 + i * 0.09,
          ease: 'power3.out',
          onUpdate: () => (el.textContent = state.v.toFixed(dp)),
          onComplete: () => (el.textContent = final),
        }),
    });
  });

  // 0c. Korczak scene (pinned). Created here, before the reveals below,
  //     so ScrollTriggers are created in page order.
  const killKorczak = initKorczak();
  // 0d. Projects: the thread draws with scroll; hover dots.
  const killProjects = initProjects();

  // 1. Reveal: short rise + fade, staggered in the order things enter.
  const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  gsap.set(items, { opacity: 0, y: 14 });
  const show = (els: Element[]) =>
    gsap.to(els, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.07, overwrite: true });
  ScrollTrigger.batch(items, { start: 'top 92%', once: true, onEnter: show });
  // Never leave keyboard focus inside something invisible.
  const onFocus = (e: FocusEvent) => {
    const el = (e.target as Element).closest?.('[data-reveal]');
    if (el) gsap.set(el, { opacity: 1, y: 0 });
  };
  document.addEventListener('focusin', onFocus);

  // 2. Count-ups for key numbers (exact values from content.ts).
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const to = Number(el.dataset.count);
    const commas = el.textContent!.includes(',');
    const fmt = (n: number) => (commas ? n.toLocaleString('en-US') : String(n));
    const final = el.textContent!;
    const state = { v: 0 };
    el.textContent = '0';
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () =>
        gsap.to(state, {
          v: to,
          duration: 1.1,
          ease: 'power2.out',
          onUpdate: () => (el.textContent = fmt(Math.round(state.v))),
          onComplete: () => (el.textContent = final),
        }),
    });
  });

  // 3. Research: the 100 dots fill in order as you scroll (each = 1%).
  const grid = document.querySelector<HTMLElement>('[data-share-grid]');
  if (grid) {
    gsap.fromTo(
      grid.querySelectorAll('[data-dot]'),
      { scale: 0.35, opacity: 0.15 },
      {
        scale: 1,
        opacity: 1,
        ease: 'none',
        stagger: { each: 0.02 },
        scrollTrigger: { trigger: grid, start: 'top 80%', end: 'bottom 55%', scrub: 0.5 },
      },
    );
  }

  return () => {
    document.removeEventListener('focusin', onFocus);
    killKorczak();
    killProjects();
  };
});
