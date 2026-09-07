"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { gsap } from "./gsap";
import { lockScroll } from "./smooth-scroll";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * The modal shell both overlays render through.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS NOT A NATIVE <dialog>.
 *
 * `showModal()` promotes its element into the browser's TOP LAYER, which paints
 * above every element in normal flow regardless of z-index. That is usually the
 * feature — but this page draws its own cursor (`.jn-cursor`, z-index 900), and
 * nothing in the z-index scale can reach the top layer, so the cursor was
 * painted over by the backdrop on every open. `body { cursor: none }` inherits
 * into the dialog as well, so the native pointer was suppressed too and the
 * modal had no visible pointer at all.
 *
 * Staying out of the top layer is what fixes that, and it costs us everything
 * <dialog> was giving away free — the focus trap, Esc, the inert background and
 * focus restoration are all hand-rolled below. Do not "simplify" this back to a
 * <dialog> without also solving the cursor.
 * ---------------------------------------------------------------------------
 *
 * It portals to <body> for a second, independent reason: `CaseStudy` is rendered
 * inside `.jn-works__stage`, which sets `transform` AND `overflow: hidden`. A
 * fixed-position child there is clipped by the overflow and re-anchored to the
 * transformed ancestor rather than the viewport. The top layer used to hide that;
 * without it the portal is load-bearing.
 *
 * Layering: nav 500 · overlay 800 · cursor 900.
 */
export function Overlay({
  open,
  onClose,
  labelledBy,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  /** id of the heading inside `children` that names this dialog. */
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  /* Kept mounted through the exit tween; `open` drives the animation, `render`
     drives the DOM. Opening adjusts state during render rather than in an
     effect, which is React's own pattern for deriving state from a prop — it
     also means the panel exists in the same commit, so the enter tween starts
     on the next frame instead of one render later. */
  const [render, setRender] = useState(false);
  if (open && !render) setRender(true);

  /* ---- Enter / exit ---------------------------------------------------- */
  useEffect(() => {
    if (!render) return;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop) return;

    /* Reduced motion runs the SAME timeline with every duration and offset at
       zero, rather than a separate branch. One code path, and the exit still
       unmounts through `onComplete` instead of a synchronous setState. */
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const d = (seconds: number) => (reduced ? 0 : seconds);
    const rise = reduced ? 0 : 28;

    if (open) {
      /* `expo.out` is GSAP's name for the same curve as --ease-out-expo
         (cubic-bezier(.16,1,.3,1)); the panel rises without overshoot, which is
         the site's motion rule. */
      const tl = gsap.timeline();
      tl.fromTo(
        backdrop,
        { opacity: 0 },
        { opacity: 1, duration: d(0.35), ease: "power2.out" },
      ).fromTo(
        panel,
        { opacity: 0, y: rise },
        { opacity: 1, y: 0, duration: d(0.6), ease: "expo.out" },
        d(0.05),
      );
      return () => {
        tl.kill();
      };
    }

    const tl = gsap.timeline({ onComplete: () => setRender(false) });
    tl.to(panel, {
      opacity: 0,
      y: reduced ? 0 : 16,
      duration: d(0.28),
      ease: "power2.in",
    }).to(backdrop, { opacity: 0, duration: d(0.24), ease: "power2.in" }, d(0.06));
    return () => {
      tl.kill();
    };
  }, [open, render]);

  /* ---- Scroll lock, inert background, focus restoration ----------------- */
  useEffect(() => {
    if (!render) return;

    /* Two halves, and both are needed.
       `lockScroll()` stops Lenis animating the page — but stopping Lenis only
       makes it ignore the wheel, and once it stops calling preventDefault the
       BROWSER's native scrolling takes over and the page moves anyway. So the
       guard below prevents any wheel or touch that did not start inside the
       panel; inside it, the scrollers carry `overscroll-behavior: contain`, so
       they cannot chain to the document when they hit their ends either. */
    const release = lockScroll();

    const blockScroll = (event: WheelEvent | TouchEvent) => {
      const panel = panelRef.current;
      if (!panel) return;
      if (!panel.contains(event.target as Node)) event.preventDefault();
    };
    window.addEventListener("wheel", blockScroll, { passive: false });
    window.addEventListener("touchmove", blockScroll, { passive: false });

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const inerted: HTMLElement[] = [];
    for (const child of Array.from(document.body.children)) {
      if (child === rootRef.current) continue;
      if (!(child instanceof HTMLElement) || child.inert) continue;
      child.inert = true;
      inerted.push(child);
    }

    panelRef.current?.focus({ preventScroll: true });

    return () => {
      release();
      window.removeEventListener("wheel", blockScroll);
      window.removeEventListener("touchmove", blockScroll);
      /* Un-inert before restoring focus: focus() on a node inside an inert
         subtree is silently dropped. */
      for (const el of inerted) el.inert = false;
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [render]);

  /* ---- Esc and the focus trap ------------------------------------------ */
  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const panel = panelRef.current;
      if (!panel) return;

      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const nodes = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

      if (nodes.length === 0) {
        event.preventDefault();
        panel.focus({ preventScroll: true });
        return;
      }

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (!panel.contains(active)) {
        event.preventDefault();
        first.focus();
        return;
      }
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!render || !open) return;
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [render, open, onKeyDown]);

  if (!render) return null;

  return createPortal(
    <div ref={rootRef} className="jn-overlay">
      <div
        ref={backdropRef}
        className="jn-overlay__backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className={className ? `jn-overlay__panel ${className}` : "jn-overlay__panel"}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        /* Lenis's own escape hatch, and it has to be here rather than on the
           inner scroller: a stopped Lenis calls preventDefault on every wheel
           it sees, which would freeze the overlay's own scrolling along with
           the page. Lenis checks the event's composed path for this attribute
           BEFORE it checks whether it is stopped, so marking the panel exempts
           everything inside it. */
        data-lenis-prevent=""
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
