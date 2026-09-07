"use client";

import { useGSAP } from "@gsap/react";

import { FULL, SCRUB, gsap } from "./gsap";

/**
 * Makes the panel stack itself a scroll animation.
 *
 * THIS IS THE FIX FOR "the transitions between sections are static".
 *
 * Before this, the entire section-to-section system was one declaration —
 * `.jn-panel--overlap { margin-top: -110px }` — plus a fixed z-index ladder. An
 * incoming panel slid up at exactly scroll speed and covered the previous one.
 * Nothing scaled, dimmed or moved at any boundary. Every reveal on the page
 * animated content *inside* a section, which is why the joins between them read
 * as a plain scroll no matter how much motion went in elsewhere.
 *
 * Now every panel plays a two-beat timeline against its own travel:
 *
 *   ARRIVAL   rises and grows to full size as it climbs into view
 *   DEPARTURE shrinks, lifts and darkens under a scrim as it is covered, so it
 *             reads as dropping into shadow behind the next panel
 *
 * Doing it once here rather than as a bespoke exit per section means every join
 * behaves identically, and it replaces the three near-duplicate exit blocks that
 * had accumulated in the works stage, skills and outside.
 *
 * ---------------------------------------------------------------------------
 * TWO CONSTRAINTS SHAPE THIS FILE. BOTH WERE MEASURED, NOT ASSUMED.
 *
 * 1. `transform` on a panel BREAKS a `position: sticky` descendant. Measured on
 *    the Outside stage: pinned it holds `top: 0` across its runway; with a
 *    `transform` on the section it drifted 37 -> 11 -> -14. Non-transform
 *    properties left the pin intact. So the panel itself only ever receives the
 *    scrim custom property, and every transform
 *    goes on `[data-panel-inner]` — which for a pinned section is the sticky
 *    stage itself. An element may transform itself without breaking its own pin;
 *    it is only ancestors that do damage.
 *
 * 2. ONE trigger per panel, not one for arrival and another for departure.
 *    Two scrubbed triggers writing `scale` on the same element fight for it on
 *    every frame wherever their ranges overlap, which they do on any panel
 *    shorter than the viewport. A single timeline has exactly one tween per
 *    property, so the question cannot arise.
 * ---------------------------------------------------------------------------
 */
export function PanelStack() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    /* Reduced motion gets no branch at all. Registering nothing is safer than
       registering a zero-duration animation, which still writes inline styles
       and can strand a panel at 45% opacity. */
    mm.add(FULL, () => {
      const panels = gsap.utils.toArray<HTMLElement>(".jn-panel");

      panels.forEach((panel, i) => {
        const inner =
          panel.querySelector<HTMLElement>("[data-panel-inner]") ?? panel;
        const isLast = i === panels.length - 1;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top bottom",
            end: "bottom top",
            scrub: SCRUB,
            invalidateOnRefresh: true,
          },
        });

        /**
         * Both beats want roughly a viewport of scroll regardless of how tall
         * the panel is, so their share of the timeline is computed from the
         * real geometry rather than guessed as a fixed fraction. Without this a
         * 340vh pinned runway would spend its first 25% arriving, which is over
         * three screens of a heading slowly growing.
         */
        const share = () => {
          const total = panel.offsetHeight + window.innerHeight;
          return gsap.utils.clamp(0.08, 0.42, window.innerHeight / total);
        };
        const beat = share();

        /* No radius tween any more. The panels are square now, and this wrote
           `borderTopLeftRadius` as an INLINE style — which beats the stylesheet,
           so leaving it would have quietly kept 28px rounded corners on every
           panel no matter what `--panel-radius` said. */
        tl.fromTo(
          inner,
          { yPercent: 5, scale: 0.97 },
          { yPercent: 0, scale: 1, ease: "power2.out", duration: beat },
          0,
        );

        /* The last panel is the footer. Nothing covers it, so it never leaves. */
        if (isLast) return;

        /**
         * A SCRIM, not an opacity fade. This is the fix for the pale "white
         * opaque" wash over the Outside section.
         *
         * Fading the panel itself to `opacity: 0.4` let whatever sits beneath it
         * show through, and what sits beneath every panel is `.jn-hero`: it is
         * `position: sticky; top: 0` inside `<main>`, so it never unsticks and
         * acts as a full-screen near-white plate under the entire page.
         * 0.4 x ink over that plate composites to roughly rgb(148,147,143), the
         * pale grey. On Outside it covered the whole viewport, because a
         * 300vh runway puts the departure at 75% of the range while the sticky
         * stage is still filling the screen.
         *
         * Dimming by ADDING dark cannot reveal anything behind: the scrim is
         * opaque ink painted over the panel. `filter: blur` is gone for the same
         * reason, since it softens the edges of the element it is applied to and
         * lets the backdrop bleed in around them.
         */
        /**
         * How far it dims depends on WHAT is being dimmed.
         *
         * A flat 0.55 ink scrim over a dark panel reads as shadow, which is the
         * intent. Over a LIGHT panel the same scrim composites to a muddy grey
         * rectangle across the whole viewport, which reads as dirt on the page
         * rather than depth. Light panels therefore take a much lighter veil and
         * lean on the scale and lift for the sense of receding instead.
         *
         * THE TEST IS "IS THIS PANEL LIGHT", not "is this panel paper". It used
         * to check `jn-panel--paper` alone, because that was the only light
         * ground there was. Selected Works is `jn-panel--stone` now, also light,
         * and under the old check it took the 0.38 dark scrim: the exact muddy
         * rectangle this comment warns about. Any future light modifier has to
         * be added here too.
         */
        const light =
          panel.classList.contains("jn-panel--paper") ||
          panel.classList.contains("jn-panel--stone");

        tl.to(
          panel,
          {
            "--panel-scrim": light ? 0.16 : 0.38,
            ease: "none",
            duration: beat,
          },
          1 - beat,
        ).to(
          inner,
          { scale: 0.92, yPercent: -4, ease: "none", duration: beat },
          1 - beat,
        );
      });
    });

    return () => mm.revert();
  });

  return null;
}
