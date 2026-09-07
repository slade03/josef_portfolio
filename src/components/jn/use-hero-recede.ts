"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * The hero's recede.
 *
 * As the Works panel rides up over the sticky hero, the type block scales down,
 * fades and blurs, and the bottom rail fades faster. The artboard's math,
 * transcribed exactly:
 *
 *   hp = clamp01((vh - worksTop) / (vh * 0.8))   e = hp²
 *   type:  scale(1 - 0.24e) · opacity(1 - 1.25hp) · blur(12e px)
 *   rail:  opacity(1 - 1.7hp)
 *
 * Progress is read from `#works`, not from the hero: the hero is sticky, so its
 * own rect stops moving the moment it pins and cannot describe the travel. The
 * effect no-ops cleanly while `#works` does not exist yet.
 *
 * `blur()` is a filter and cannot be composited away, so this is deliberately
 * gated: it never starts under reduced motion, and it is throttled to one
 * update per animation frame.
 */
export function useHeroRecede(
  typeRef: RefObject<HTMLDivElement | null>,
  railRef: RefObject<HTMLDivElement | null>,
) {
  const frame = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const update = () => {
      frame.current = 0;
      const type = typeRef.current;
      const works = document.getElementById("works");
      if (!type || !works) return;

      const vh = window.innerHeight;
      const hp = Math.max(
        0,
        Math.min(1, (vh - works.getBoundingClientRect().top) / (vh * 0.8)),
      );
      const e = hp * hp;

      type.style.transform = `scale(${1 - 0.24 * e})`;
      type.style.opacity = String(Math.max(0, 1 - hp * 1.25));
      type.style.filter = `blur(${(12 * e).toFixed(2)}px)`;

      const rail = railRef.current;
      if (rail) rail.style.opacity = String(Math.max(0, 1 - hp * 1.7));
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [typeRef, railRef]);
}
