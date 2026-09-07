"use client";

import Lenis from "lenis";
import { useEffect } from "react";

import { ScrollTrigger, gsap } from "./gsap";

/**
 * The live Lenis instance, or null when smooth scrolling is not running
 * (reduced motion, or before mount).
 *
 * Exposed because stopping the page behind a modal is not something CSS can do
 * here: Lenis owns the scroll position and is driven from the GSAP ticker, so
 * `overflow: hidden` on <body> does not stop it — the wheel keeps scrubbing the
 * pinned sections underneath the overlay. `lockScroll()` is the supported way to
 * ask for that, and it is a no-op when Lenis never started.
 */
let instance: Lenis | null = null;

/**
 * Stop scrolling and return the function that resumes it.
 *
 * Reference-counted, because two overlays can legitimately overlap for the
 * length of a cross-fade and the second one closing must not restart the page
 * while the first is still open.
 */
let locks = 0;

export function lockScroll() {
  locks += 1;
  if (locks === 1) instance?.stop();

  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks = Math.max(0, locks - 1);
    if (locks === 0) instance?.start();
  };
}

/**
 * Lenis smooth scrolling, bridged to ScrollTrigger.
 *
 * The bridge is the whole point and it is easy to get subtly wrong. Lenis takes
 * over the scroll position and animates it toward the target itself, so the
 * native `scroll` event no longer describes where the page actually is on this
 * frame. Three lines keep the two in step:
 *
 *   - `lenis.on("scroll", ScrollTrigger.update)` so triggers recompute against
 *     the smoothed position rather than the browser's
 *   - Lenis is driven from GSAP's ticker instead of its own rAF loop, so both
 *     run once per frame in a known order rather than racing
 *   - `lagSmoothing(0)` because GSAP's frame-skip compensation assumes
 *     time-based tweens; with scrubbed ones it makes the page jump after any
 *     stall (a tab switch, a long task)
 *
 * Lenis stays on `window` deliberately. The wrapper-element setup would need an
 * ancestor with `overflow: auto`, and `overflow` on an ancestor silently
 * disables `position: sticky` — which would kill all four pinned stages on this
 * page at once.
 */
export function SmoothScroll() {
  useEffect(() => {
    /* Honour the OS setting by simply never starting. Lenis animating the scroll
       position IS motion, and someone who asked for less of it should get the
       browser's own instant scrolling. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      /* Exponential ease-out. No overshoot: a scroll position that passes its
         target and comes back feels like the page is arguing with the wheel. */
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      /* Touch devices already have good native inertia, and smoothing it twice
         feels laggy rather than smooth. */
      smoothWheel: true,
      syncTouch: false,
    });

    instance = lenis;
    /* An overlay may already be open across a remount (fast refresh, a
       dependency change) — honour the outstanding locks rather than starting a
       page that is supposed to be held still. */
    if (locks > 0) lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    /* Anchors have to be handed to Lenis or they jump while everything else
       glides, and any ScrollTrigger they land inside gets a discontinuity. */
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.<HTMLAnchorElement>(
        'a[href^="#"], a[href^="/#"]',
      );
      if (!anchor) return;
      const hash = anchor.getAttribute("href")?.replace(/^\/?#/, "");
      if (!hash) return;
      const target = document.getElementById(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: 0 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
      if (instance === lenis) instance = null;
    };
  }, []);

  return null;
}
