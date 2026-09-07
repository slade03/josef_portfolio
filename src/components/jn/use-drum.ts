"use client";

import { useEffect, useRef, type RefObject } from "react";

const DRIFT_SPEED = 1.1; // the artboard's default `driftSpeed` prop
const WRAP = 360;

/**
 * The playground drum's rotation, transcribed from the artboard.
 *
 *   frame:  if not dragging  x -= driftSpeed * 0.07 + v
 *           v *= 0.93                       (inertia decay)
 *           wrap x into (-360, 0]
 *           transform = translateZ(-760px) rotateY(x deg)
 *
 *   drag:   dx = (clientX - lastX) * 0.08
 *           x += dx ; v = -dx * 0.4
 *           moved = |clientX - startX| > 6  (suppresses the click that follows)
 *
 * `moved` is the detail that makes drag and click coexist: without it, every
 * spin ends by opening whichever card happened to be under the pointer.
 *
 * Returns `wasDragged` so the card's click handler can consult it.
 *
 * The loop is refused entirely under reduced motion — the drum then sits at 0°
 * and the cards remain reachable as ordinary buttons.
 */
export function useDrum(
  drumRef: RefObject<HTMLDivElement | null>,
  railRef: RefObject<HTMLDivElement | null>,
) {
  const state = useRef({
    x: 0,
    v: 0,
    dragging: false,
    moved: false,
    startX: 0,
    lastX: 0,
  });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const s = state.current;
    let loop = 0;

    const apply = () => {
      const drum = drumRef.current;
      if (drum) {
        drum.style.transform = `translateZ(-760px) rotateY(${s.x.toFixed(3)}deg)`;
      }
    };

    const wrap = () => {
      if (s.x <= -WRAP) s.x += WRAP;
      if (s.x > 0) s.x -= WRAP;
    };

    const tick = () => {
      if (!s.dragging) s.x -= DRIFT_SPEED * 0.07 + s.v;
      s.v *= 0.93;
      wrap();
      apply();
      loop = requestAnimationFrame(tick);
    };

    const onDown = (e: PointerEvent) => {
      s.dragging = true;
      s.moved = false;
      s.startX = e.clientX;
      s.lastX = e.clientX;
      if (railRef.current) railRef.current.style.userSelect = "none";
    };

    const onMove = (e: PointerEvent) => {
      if (!s.dragging) return;
      if (Math.abs(e.clientX - s.startX) > 6) s.moved = true;
      const dx = (e.clientX - s.lastX) * 0.08;
      s.lastX = e.clientX;
      s.x += dx;
      s.v = -dx * 0.4;
      wrap();
      apply();
    };

    const onUp = () => {
      s.dragging = false;
      if (railRef.current) railRef.current.style.userSelect = "";
    };

    const rail = railRef.current;
    rail?.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    loop = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(loop);
      rail?.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [drumRef, railRef]);

  return {
    /** True when the pointer travelled far enough to count as a drag. */
    wasDragged: () => state.current.moved,
  };
}
