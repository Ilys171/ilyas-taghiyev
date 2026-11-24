/**
 * Site-wide motion: scroll reveals, number count-ups and the scroll-linked
 * research figure. Transform and opacity only (count-ups change text in a
 * fixed-width mono box). With reduced motion, everything is shown as-is.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initKorczak } from './korczak';

gsap.registerPlugin(ScrollTrigger);
(window as unknown as { __motion?: boolean }).__motion = true;

const root = document.documentElement;
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

  // 3. Research: the share of error from asset-risk surprises fills in as you scroll.
  const share = document.querySelector<HTMLElement>('[data-share]');
  if (share) {
    gsap
      .timeline({ scrollTrigger: { trigger: share, start: 'top 88%', end: 'top 45%', scrub: 0.6 } })
      .from(share.querySelector('.share-fill'), { scaleX: 0, transformOrigin: '0 50%', ease: 'none', duration: 1 })
      .from(share.querySelector('.share-band'), { scaleX: 0, opacity: 0, transformOrigin: '0 50%', duration: 0.5 })
      .from(share.querySelectorAll('.share-note'), { opacity: 0, y: 6, stagger: 0.15, duration: 0.4 }, '<');
  }

  return () => {
    document.removeEventListener('focusin', onFocus);
    killKorczak();
  };
});
