"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * The Works gallery's scroll choreography, transcribed from the artboard.
 *
 * The section is a tall runway (340vh) containing a stage pinned at `top: 0`.
 * Vertical progress through the runway becomes horizontal travel on the track:
 *
 *   wp    = clamp01(-sectionTop / (sectionHeight - vh))
 *   dist  = max(0, track.scrollWidth - innerWidth + 80)
 *   x     = -dist * wp
 *   skew  = skew*0.82 + clamp(Δx * 0.06, ±5) * 0.18      (velocity lean, damped)
 *
 * Then two exit moves, both clocked off the same `wp` so the deck is gathered
 * and gone before the pin releases and the next panel gets its first frame:
 *
 *   gather (wp .72 → .88): panels converge on the viewport centre and fan
 *     ge = 1 - (1 - gather)³ , dx = (mid - screenCentre) * ge
 *     rot = (i - (n-1)/2) * 4 * ge
 *   shrink (wp .86 → .98): the whole stage scales down and fades
 *     se = sh² , scale(1 - 0.4se) translateY(-48se) , opacity 1 - 1.25sh
 *
 * One subtlety worth preserving: panel centres are measured with `offsetLeft`,
 * which is transform-independent, and the track's untransformed left is
 * recovered by subtracting the `x` we just wrote. Nothing is ever read back
 * from an element this function transforms, so the measurements cannot drift.
 */
export function useWorksScroll(
  sectionRef: RefObject<HTMLElement | null>,
  stageRef: RefObject<HTMLDivElement | null>,
  trackRef: RefObject<HTMLDivElement | null>,
) {
  const frame = useRef(0);
  const lastX = useRef<number | null>(null);
  const skew = useRef(0);
  const base = useRef<{
    w: number;
    left: number;
    centers: number[];
  } | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const clamp = (v: number) => Math.max(0, Math.min(1, v));

    const update = () => {
      frame.current = 0;
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const vh = window.innerHeight;
      const rect = section.getBoundingClientRect();
      const span = rect.height - vh;
      if (span <= 0) return;

      const wp = clamp(-rect.top / span);
      const dist = Math.max(0, track.scrollWidth - window.innerWidth + 80);
      /* The horizontal reveal must finish before gather (0.72) starts, or the
         last panel is still sliding into place while the outro is already
         fanning/shrinking/fading the deck — which faded the title and cards
         to invisible before the last card had fully arrived. */
      const scrollP = clamp(wp / 0.72);
      const x = -dist * scrollP;

      const v = x - (lastX.current ?? x);
      lastX.current = x;
      skew.current =
        skew.current * 0.82 + Math.max(-5, Math.min(5, v * 0.06)) * 0.18;
      track.style.transform = `translate3d(${x.toFixed(1)}px,0,0) skewX(${skew.current.toFixed(2)}deg)`;

      const stage = stageRef.current;
      if (stage) {
        const sh = clamp((wp - 0.86) / 0.12);
        const se = sh * sh;
        stage.style.transform = `scale(${(1 - 0.4 * se).toFixed(4)}) translateY(${(-48 * se).toFixed(1)}px)`;
        stage.style.opacity = String(Math.max(0, 1 - sh * 1.25));
      }

      const panels = Array.from(
        section.querySelectorAll<HTMLElement>("[data-wpanel]"),
      );
      if (panels.length === 0) return;

      if (!base.current || base.current.w !== window.innerWidth) {
        base.current = {
          w: window.innerWidth,
          left: track.getBoundingClientRect().left - x,
          centers: panels.map((el) => el.offsetLeft + el.offsetWidth / 2),
        };
      }

      const gather = clamp((wp - 0.72) / 0.16);
      const ge = 1 - Math.pow(1 - gather, 3);
      const mid = window.innerWidth / 2;
      const n = panels.length;

      panels.forEach((el, i) => {
        if (ge < 0.001) {
          if (el.style.transform) {
            el.style.transform = "";
            el.style.zIndex = "";
            el.style.boxShadow = "";
          }
          return;
        }
        const screenCenter = base.current!.left + base.current!.centers[i] + x;
        const dx = (mid - screenCenter) * ge;
        const rot = (i - (n - 1) / 2) * 4 * ge;
        el.style.transform = `translate3d(${dx.toFixed(1)}px,0,0) rotate(${rot.toFixed(2)}deg)`;
        el.style.zIndex = String(10 + i);
        el.style.boxShadow = `0 30px 70px rgba(0,0,0,${(0.5 * ge).toFixed(3)})`;
      });
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(update);
    };

    const onResize = () => {
      base.current = null;
      onScroll();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [sectionRef, stageRef, trackRef]);
}
