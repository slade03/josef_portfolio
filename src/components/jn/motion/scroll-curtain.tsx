"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type RefObject } from "react";

import { FULL, SCRUB, gsap } from "./gsap";

type Stops = [number, number, number, number];

const DEFAULT_RANGE: Stops = [0, 0.3, 0.7, 1];

/**
 * A heading whose lines rise out of a clipped row and later sink back into it.
 *
 * The row clips (`overflow: hidden`, set in globals.css) and the span inside it
 * translates, so the text appears to be revealed by an edge rather than to fade
 * in. Percentages, not pixels: each line travels its own height, so the effect
 * holds at every clamped font size on the page.
 *
 * ---------------------------------------------------------------------------
 * IF THIS HEADING SITS INSIDE A `position: sticky` STAGE, PASS `track`.
 *
 * By default the curtain scrubs off the heading's OWN position, which is wrong
 * for anything inside a pinned stage: a pinned element's viewport rect stops
 * changing while it is pinned, so its progress freezes at whatever value the pin
 * corresponds to. The Works stage holds its heading near the top of the viewport,
 * which maps into the exit band — the line sat at -140% and the clip sheared its
 * top off for the whole section.
 *
 * `track` points the scroll at an ancestor that really does travel, so the
 * heading enters on arrival, holds flat through the pin, and exits on departure.
 * ---------------------------------------------------------------------------
 */
export function ScrollCurtain({
  rows,
  className,
  id,
  track,
  range,
}: {
  rows: readonly string[];
  className?: string;
  id?: string;
  /** Scrub against this ancestor instead of the heading. Required inside a pin. */
  track?: RefObject<HTMLElement | null>;
  /**
   * Enter-start / enter-end / exit-start / exit-end as fractions of the tracked
   * element's travel. A tall runway wants a tighter band than the default, or the
   * entrance alone eats more than a viewport of scrolling.
   */
  range?: Stops;
}) {
  const heading = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      let raf = 0;

      mm.add(FULL, () => {
        const stops = range ?? DEFAULT_RANGE;

        const build = () => {
          const lines = gsap.utils.toArray<HTMLElement>(
            "[data-row] > span",
            heading.current,
          );

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: track?.current ?? heading.current,
              start: "top bottom",
              end: "bottom top",
              scrub: SCRUB,
            },
          });

          lines.forEach((line, i) => {
            /* Later lines start slightly later so the heading unfurls top to
               bottom. Capped well short of the hold, or the last line of a tall
               heading would still be arriving as the whole thing began to leave. */
            const delay = Math.min(i * 0.05, 0.14) * (lines.length > 1 ? 1 : 0);

            /* 140%, not 105%: the clipping row carries 0.2em of padding so the
               tall display glyphs are not sheared, and that padding is visible
               area a shorter travel would still peek into. */
            tl.fromTo(
              line,
              { yPercent: 140 },
              {
                yPercent: 0,
                ease: "power3.out",
                duration: stops[1] - stops[0],
              },
              stops[0] + delay,
            ).to(
              line,
              {
                yPercent: -140,
                ease: "power3.in",
                duration: stops[3] - stops[2],
              },
              stops[2],
            );
          });

          return tl;
        };

        /* `track` can still be null on this first pass — its ref attaches in
           the same commit, but this effect can fire before that commit is
           flushed, and building against `heading.current` as a silent
           fallback then locks the curtain to the heading's own ~1-viewport
           bounding box for good: it scrubs its whole enter+exit inside the
           first sliver of the runway's scroll instead of the intended
           340vh span. Wait a frame for the real ancestor instead of guessing. */
        if (track && !track.current) {
          raf = requestAnimationFrame(function retry() {
            if (track.current) build();
            else raf = requestAnimationFrame(retry);
          });
          return () => cancelAnimationFrame(raf);
        }

        const tl = build();
        return () => tl.scrollTrigger?.kill();
      });

      return () => {
        cancelAnimationFrame(raf);
        mm.revert();
      };
    },
    { dependencies: [range, track] },
  );

  return (
    <h2 ref={heading} id={id} className={className} data-curtain="">
      {rows.map((row) => (
        <span key={row} data-row="">
          <span>{row}</span>
        </span>
      ))}
    </h2>
  );
}
