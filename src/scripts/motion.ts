/**
 * Site-wide motion, one connected system: Lenis smooth scroll driven by the
 * GSAP ticker, so ScrollTrigger and scrolling stay in sync.
 *
 * Created in page order (ScrollTrigger refreshes in creation order, and the
 * pinned Korczak stage changes everything below it):
 *   intro → Korczak (pin) → projects thread → headings, dividers, marks,
 *   underlines → reveals → count-ups → research grid.
 *
 * Transform and opacity only (count-ups change text inside a box whose width
 * is reserved). With reduced motion: no Lenis, no motion, final states.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { initKorczak } from './korczak';
import { initProjects, layoutThread } from './projects';

gsap.registerPlugin(ScrollTrigger, SplitText);
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
  const cleanups: (() => void)[] = [];

  // ---------------------------------------------------------------
  // Smooth scroll (Lenis), for mouse and trackpad only. Touch screens keep
  // native scrolling: Lenis would not smooth touch anyway, and its scroll
  // classes on <html> cost phones a full style recalculation per frame
  // (measured: 22 fps with it vs 59 fps without on a throttled phone).
  // In-page links glide and stop just below the header.
  // ---------------------------------------------------------------
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const lenis = finePointer ? new Lenis({ lerp: 0.1, smoothWheel: true }) : null;
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    cleanups.push(() => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    });
  }

  // In-page links: measured at click time (the pinned stage and split
  // headings change positions), so the target lands just below the header.
  const onAnchor = (e: MouseEvent) => {
    const a = (e.target as Element).closest?.<HTMLAnchorElement>('a[href*="#"]');
    if (!a || a.origin !== location.origin || a.pathname !== location.pathname || !a.hash) return;
    const target = a.hash === '#top' ? document.body : document.getElementById(decodeURIComponent(a.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    const headerH = document.querySelector<HTMLElement>('[data-header]')?.offsetHeight ?? 64;
    const y = a.hash === '#top' ? 0 : Math.max(0, window.scrollY + target.getBoundingClientRect().top - headerH - 16);
    if (lenis) lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
    history.replaceState(null, '', a.hash);
  };
  document.addEventListener('click', onAnchor);
  cleanups.push(() => document.removeEventListener('click', onAnchor));

  // ---------------------------------------------------------------
  // 1. Intro, once on load: the name rises out of its masks, then the lines
  //    around it; the underline under "Statistics & Data Science" draws last.
  // ---------------------------------------------------------------
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

  // ---------------------------------------------------------------
  // 2. Korczak scene (pinned), then the projects thread.
  // ---------------------------------------------------------------
  cleanups.push(initKorczak());
  cleanups.push(initProjects());

  // ---------------------------------------------------------------
  // 3. Section headings rise line by line out of a mask.
  // ---------------------------------------------------------------
  gsap.utils.toArray<HTMLElement>('[data-heading]').forEach((el) => {
    const split = SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 105,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }),
    });
    cleanups.push(() => split.revert());
  });

  // ---------------------------------------------------------------
  // 4. Chalk dividers draw across as each section enters. Sections keep
  //    their CSS border without motion; here a drawn rule replaces it.
  // ---------------------------------------------------------------
  document.querySelectorAll<HTMLElement>('main > section').forEach((section) => {
    if (parseFloat(getComputedStyle(section).borderTopWidth) === 0) return;
    const rule = document.createElement('span');
    rule.className = 'rule';
    rule.setAttribute('aria-hidden', 'true');
    section.prepend(rule);
    section.classList.add('has-rule');
    const t = gsap.fromTo(
      rule,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.2, ease: 'power3.inOut', scrollTrigger: { trigger: section, start: 'top 94%', once: true } },
    );
    cleanups.push(() => {
      t.scrollTrigger?.kill();
      t.kill();
      rule.remove();
      section.classList.remove('has-rule');
    });
  });

  // ---------------------------------------------------------------
  // 5. Chalk statistics marks: gentle parallax, slower than the content.
  // ---------------------------------------------------------------
  gsap.utils.toArray<HTMLElement>('[data-mark]').forEach((mark) => {
    gsap.fromTo(
      mark,
      { y: 28 },
      {
        y: -28,
        ease: 'none',
        scrollTrigger: { trigger: mark.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 },
      },
    );
  });

  // ---------------------------------------------------------------
  // 6. Chalk underlines draw themselves once, left to right. The clip slides
  //    in one direction and the stroke the other, so the line stays still.
  // ---------------------------------------------------------------
  gsap.utils.toArray<HTMLElement>('[data-underline]').forEach((ul) => {
    const clip = ul.querySelector('[data-ul-clip]');
    const inner = ul.querySelector('[data-ul-inner]');
    if (!clip || !inner) return;
    const inIntro = !!ul.closest('[data-intro]');
    gsap.set(clip, { xPercent: -101 });
    gsap.set(inner, { xPercent: 101 });
    gsap
      .timeline({
        delay: inIntro ? 1.1 : 0.45,
        scrollTrigger: inIntro ? undefined : { trigger: ul, start: 'top 85%', once: true },
      })
      .to([clip, inner], { xPercent: 0, duration: 0.9, ease: 'power3.inOut' });
  });

  // ---------------------------------------------------------------
  // 7. Reveal: short rise + fade, staggered in the order things enter.
  // ---------------------------------------------------------------
  const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  gsap.set(items, { opacity: 0, y: 14 });
  const show = (els: Element[]) =>
    gsap.to(els, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07, overwrite: true });
  ScrollTrigger.batch(items, { start: 'top 90%', once: true, onEnter: show });
  // Never leave keyboard focus inside something invisible.
  const onFocus = (e: FocusEvent) => {
    const el = (e.target as Element).closest?.('[data-reveal]');
    if (el) gsap.set(el, { opacity: 1, y: 0 });
  };
  document.addEventListener('focusin', onFocus);
  cleanups.push(() => document.removeEventListener('focusin', onFocus));

  // ---------------------------------------------------------------
  // 8. Count-ups (exact values from content.ts), once each.
  // ---------------------------------------------------------------
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
  // Academics: the main scores (with decimals where they have them).
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

  // ---------------------------------------------------------------
  // 9. Research: the 100 dots fill in order as you scroll (each = 1%).
  // ---------------------------------------------------------------
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

  // Positions depend on the fonts; measure again once they are in.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  return () => cleanups.forEach((c) => c());
});
