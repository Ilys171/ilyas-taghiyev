/**
 * Site-wide motion: scroll reveals, number count-ups and the scroll-linked
 * research figure. Transform and opacity only (count-ups change text in a
 * fixed-width mono box). With reduced motion, everything is shown as-is.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
(window as unknown as { __motion?: boolean }).__motion = true;

const root = document.documentElement;
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: reduce)', () => {
  root.classList.add('no-motion');
  return () => root.classList.remove('no-motion');
});

mm.add('(prefers-reduced-motion: no-preference)', () => {
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

  return () => document.removeEventListener('focusin', onFocus);
});
