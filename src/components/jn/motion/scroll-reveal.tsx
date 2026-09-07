"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type ReactNode } from "react";

import { FULL, SCRUB, gsap } from "./gsap";

export type RevealKind = "reveal" | "curtain" | "rise" | "stagger";

/**
 * Per-kind travel, tuned so a large heading does not move as far as a caption.
 */
const TRAVEL: Record<RevealKind, { in: number; out: number }> = {
  reveal: { in: 44, out: -34 },
  curtain: { in: 90, out: -70 },
  rise: { in: 26, out: -20 },
  stagger: { in: 20, out: -16 },
};

/**
 * Scroll-scrubbed enter and exit wrapper.
 *
 * Enter AND exit, which is the whole point: the timeline holds the element at
 * rest while it is on screen and takes it out again as it leaves, and because it
 * is scrubbed rather than triggered, scrolling back up plays it in reverse
 * instead of leaving content stranded.
 *
 * Ported from Framer Motion to GSAP so the page ships one animation library
 * rather than two. The previous implementation mapped a `useScroll` progress
 * value through four stops by hand; a GSAP timeline expresses the same three
 * beats (in, hold, out) as positions on one clock, which is both shorter and
 * impossible to get out of order.
 *
 * `delay` shifts this element's entrance later within its own travel, which is
 * how a group staggers without a hand-maintained chain.
 */
export function ScrollReveal({
  children,
  kind = "reveal",
  delay = 0,
  className,
}: {
  children: ReactNode;
  kind?: RevealKind;
  /** 0 to ~0.3. Shifts the entrance later within this element's travel. */
  delay?: number;
  className?: string;
}) {
  const el = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* Reduced motion registers nothing, so the element simply renders at its
         resting state. A zero-duration tween would still write inline styles. */
      mm.add(FULL, () => {
        const travel = TRAVEL[kind];

        gsap
          .timeline({
            scrollTrigger: {
              trigger: el.current,
              start: "top bottom",
              end: "bottom top",
              scrub: SCRUB,
            },
          })
          .fromTo(
            el.current,
            { opacity: 0, y: travel.in },
            { opacity: 1, y: 0, ease: "power2.out", duration: 0.28 },
            delay,
          )
          .to(
            el.current,
            { opacity: 0, y: travel.out, ease: "power2.in", duration: 0.28 },
            0.72,
          );
      });

      return () => mm.revert();
    },
    { dependencies: [kind, delay] },
  );

  /* Always a div. There used to be an `as` prop for li/section/header, and no
     call site ever passed one — while indexing a component by a tag union makes
     TypeScript intersect every tag's ref signature into something no single ref
     satisfies. Deleting the unused API was cheaper than casting around it. */
  return (
    <div ref={el} className={className}>
      {children}
    </div>
  );
}
