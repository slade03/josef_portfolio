"use client";

import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";

import { hero } from "@/content/design";

import { FULL, ScrollTrigger, gsap } from "./motion/gsap";

/**
 * The hero's slot-machine reel.
 *
 * The second line of the headline is a clipped cell holding a vertical column of
 * roles. The column steps up one role at a time, so what the cell shows changes
 * without anything on the page moving.
 *
 * WHAT MAKES IT READ AS A SLOT MACHINE. Not a bounce, and not an elastic ease:
 * those are banned here and they read as jelly rather than machinery. It is two
 * things instead.
 *
 *   1. SPEED CONTRAST. A 2.4s hold against a 0.52s travel. The reel is still
 *      long enough for the joke to land, then moves faster than reading speed.
 *   2. A HARD LANDING. When the travel finishes, the whole cell drops 2px and
 *      recovers in 160ms. That is the mechanical stop, and it is a separate
 *      tween on a DIFFERENT element so it cannot fight the travel.
 *
 * THREE THINGS THIS DELIBERATELY DOES NOT TOUCH.
 *
 * `.jn-hero__type` — `use-hero-recede.ts` writes `transform`, `opacity` and
 * `filter` straight onto it on every scroll frame. Anything this hook set there
 * would be overwritten within one frame, and vice versa. The reel is two levels
 * below it.
 *
 * The cell's WIDTH. The hero block is horizontally centred, so its position
 * follows the headline's width; a cell that resized per role would slide the
 * whole hero sideways five times a cycle. The width is pinned by a hidden sizer
 * in the markup, so nothing here animates a layout property.
 *
 * A MOTION BLUR. The recede already owns the page's one `filter`, and a second
 * one nested inside it would cost a separate layer for an effect nobody asked
 * for at this speed.
 *
 * REDUCED MOTION. One branch, under `FULL` only, exactly as `testimonials.tsx`
 * does it. There is no second code path and nothing to keep in step: with no
 * script running the column simply sits at its first child, which is why
 * `hero.roles[0]` has to be the straight answer rather than the punchline.
 */
export function useHeroReel(
  cellRef: RefObject<HTMLElement | null>,
  reelRef: RefObject<HTMLElement | null>,
) {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(FULL, () => {
      const cell = cellRef.current;
      const reel = reelRef.current;
      if (!cell || !reel) return;

      /* The column renders one more child than there are roles: the last is a
         copy of the first. That is what lets the loop always travel in one
         direction and then reset to zero without a visible jump back, because
         the frame it resets from and the frame it resets to show the same
         glyphs. So the step is a fraction of the column's height, not of the
         roles' count. */
      const steps = hero.roles.length + 1;

      const tl = gsap.timeline({ repeat: -1, paused: true });

      hero.roles.forEach((_, n) => {
        tl.to(
          reel,
          {
            yPercent: -(100 / steps) * (n + 1),
            duration: 0.52,
            ease: "power3.inOut",
            onComplete: () => {
              gsap.fromTo(
                cell,
                { y: 2 },
                { y: 0, duration: 0.16, ease: "power2.out" },
              );
            },
          },
          "+=2.4",
        );
      });

      /* The invisible wrap. `set`, not `to`: there is nothing to animate here
         because the duplicate child means the picture does not change. */
      tl.set(reel, { yPercent: 0 });

      /* A hero scrolled past should not be paying for a timeline nobody can
         see. The recede has already faded it to nothing by then. */
      const trigger = ScrollTrigger.create({
        trigger: "#top",
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          if (self.isActive) tl.play();
          else tl.pause();
        },
      });

      if (trigger.isActive) tl.play();

      return () => {
        trigger.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);
}
