"use client";

import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";

import { gsap } from "./motion/gsap";

/** The three states already scaffolded across the page as `data-cursor` values. */
type CursorState = "default" | "link" | "view" | "drag";

const LABEL: Record<CursorState, string> = {
  default: "",
  link: "",
  view: "View",
  drag: "Drag",
};

/**
 * The custom cursor.
 *
 * Eleven elements across the page already carry `data-cursor` with one of three
 * values — `link`, `view`, `drag` — and until now nothing consumed them. This
 * reads them by delegation from a single `pointerover` listener rather than by
 * attaching handlers to each element, so new call sites work by adding the
 * attribute and nothing else.
 *
 * Two rings, moving at different speeds: a dot that tracks the pointer exactly
 * and a ring that trails it. The lag is the whole effect — a ring pinned to the
 * pointer reads as a bigger mouse cursor, while one that arrives a moment later
 * reads as something with weight following you.
 *
 * ---------------------------------------------------------------------------
 * IT MUST BE A SIBLING OF <Nav />, NOT A DESCENDANT.
 *
 * The nav uses `mix-blend-mode: difference`, which creates a stacking context.
 * Anything inside it is trapped below it in paint order no matter how high its
 * z-index, so a cursor nested there could never draw over the nav. The nav sits
 * at z-index 500, which is the floor this has to clear.
 *
 * The ceiling matters too. Modal overlays sit at 800 so that they clear the nav
 * and still pass *under* this at 900 — that ordering is the only reason the
 * cursor survives over an open modal, and it is why those overlays cannot go
 * back to a native `<dialog>`: `showModal()` promotes into the top layer, which
 * outranks every z-index there is. See `motion/overlay.tsx`.
 * ---------------------------------------------------------------------------
 *
 * Not rendered at all when the device has no hover (a finger has no cursor to
 * replace) or when reduced motion is requested, and the native cursor is left
 * alone in both cases.
 */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>("default");

  useEffect(() => {
    const mq = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useGSAP(
    () => {
      if (!enabled) return;

      /* `quickTo` compiles a reusable tween instead of allocating a new one per
         mousemove, which is the difference between smooth and garbage-collecting
         at 60Hz. Different durations are what separate the two layers. */
      const dotX = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3" });
      const dotY = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3" });
      const ringX = gsap.quickTo(ring.current, "x", { duration: 0.42, ease: "power3" });
      const ringY = gsap.quickTo(ring.current, "y", { duration: 0.42, ease: "power3" });

      let shown = false;
      const onMove = (e: PointerEvent) => {
        if (!shown) {
          /* Held hidden until the pointer first moves, or it would sit parked in
             the top-left corner on load. */
          shown = true;
          gsap.to(root.current, { autoAlpha: 1, duration: 0.3 });
        }
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      };

      /* Delegated. Every `data-cursor` element on the page is handled by this
         one listener, including any added later. */
      const onOver = (e: PointerEvent) => {
        const hit = (e.target as HTMLElement)?.closest?.<HTMLElement>("[data-cursor]");
        const next = (hit?.dataset.cursor as CursorState) ?? "default";
        setState((cur) => (cur === next ? cur : next));
      };

      /* Leaving the window entirely should take the cursor with it. */
      const onLeave = () => gsap.to(root.current, { autoAlpha: 0, duration: 0.2 });
      const onEnter = () => gsap.to(root.current, { autoAlpha: 1, duration: 0.2 });

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerover", onOver, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      document.addEventListener("pointerenter", onEnter);

      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerover", onOver);
        document.removeEventListener("pointerleave", onLeave);
        document.removeEventListener("pointerenter", onEnter);
      };
    },
    { dependencies: [enabled] },
  );

  if (!enabled) return null;

  return (
    <div
      ref={root}
      className="jn-cursor"
      data-state={state}
      aria-hidden="true"
      /* Invisible until the first pointer move. */
      style={{ opacity: 0, visibility: "hidden" }}
    >
      <div ref={ring} className="jn-cursor__ring">
        <span className="jn-cursor__label">{LABEL[state]}</span>
      </div>
      <div ref={dot} className="jn-cursor__dot" />
    </div>
  );
}
