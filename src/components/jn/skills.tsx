"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { skills } from "@/content/design/skills";
import { skillGroups } from "@/content/experience";
import { FULL, ScrollTrigger, gsap } from "./motion/gsap";

/**
 * Skills - a sticky heading beside a scrolling list.
 *
 * Rebuilt to the benjamincreative.me "Design skill sets" pattern, measured at
 * 1440px: a left column that sticks while a right column of grouped, numbered
 * rows scrolls past it. Two columns, three groups, one row per skill.
 *
 * WHAT THIS REPLACED, AND WHY.
 *
 * The previous version was a 420vh pinned runway with four tabs, a JS-measured
 * sliding underline and crossfading panels. It hid three quarters of its content
 * behind scroll position, needed a short-viewport escape hatch so it did not trap
 * the page, and used four invented placeholder skills. The reference does more
 * with far less: everything is visible, nothing is pinned, and the only motion is
 * a small per-row entrance. Rebuilding to it also gave back about 420vh of page.
 *
 * The content is now Josef's REAL skills from src/content/experience.ts, which
 * already arrive as three groups with counts - precisely this layout's shape.
 *
 * Motion is copied from the reference rather than invented: each row enters at
 * `opacity 0 -> 1, y 8 -> 0` and then STAYS. No exit. Twenty-six rows scrolling
 * back out and in again would be restless, and a skills list is a thing you scan
 * and re-scan, not a thing that should perform every time it passes.
 */
export function Skills() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(FULL, () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-skill-row]");
        const heads = gsap.utils.toArray<HTMLElement>("[data-skill-head]");

        /**
         * The hidden state has to be set up front.
         *
         * `fromTo` only applies its "from" values at the moment the tween runs,
         * so without this every row renders at full opacity and the entrance
         * either never reads or flashes as it snaps back to 0 on entering.
         *
         * Deliberately in JS and inside the reduced-motion-free branch, not in
         * the stylesheet: if the script fails or motion is reduced, the rows are
         * simply visible, which is the correct failure. CSS would hide them for
         * good.
         */
        gsap.set(rows, { opacity: 0, y: 8 });
        gsap.set(heads, { opacity: 0, y: 12 });

        /* `batch` rather than a trigger per row: twenty-six individual
           ScrollTriggers all firing near the same scroll position is a lot of
           bookkeeping for one fade. This groups whatever enters together and
           staggers them, which also produces the cascade for free. */
        ScrollTrigger.batch("[data-skill-row]", {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.045,
              overwrite: true,
            }),
        });

        /* Group headings lead their rows in slightly. */
        ScrollTrigger.batch("[data-skill-head]", {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: "power2.out",
              stagger: 0.08,
            }),
        });
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="skills"
      className="jn-panel jn-panel--paper jn-panel--overlap jn-skills"
      aria-labelledby="skills-heading"
    >
      <div className="jn-skills__body">
        {/* Sticks while the list scrolls past. Offset clears the fixed nav. */}
        <div className="jn-skills__aside">
          <h2 id="skills-heading" className="jn-skills__title">
            {skills.title}
          </h2>
          <p className="jn-skills__lede">{skills.lede}</p>
        </div>

        {/* `data-panel-inner` is on the LIST, not on the body wrapper.
            PanelStack transforms whatever carries it, and a transform on an
            ancestor of a `position: sticky` element breaks the pin — measured
            earlier on the Outside stage. The body wraps the sticky aside, so
            putting it there would silently unstick the heading. */}
        <div className="jn-skills__groups" data-panel-inner="">
          {skillGroups.map((group) => {
            /* Five per group. The full lists live in content/experience.ts and
               are real data used elsewhere; 26 rows was simply too long to scan,
               and Tools alone ran to 13. The count is derived from what is
               SHOWN, so it can never claim more than the list displays. */
            const shown = group.skills.slice(0, 5);
            return (
            <section
              key={group.id}
              className="jn-skills__group"
              aria-labelledby={`skills-${group.id}`}
            >
              <h3
                id={`skills-${group.id}`}
                className="jn-skills__groupTitle"
                data-skill-head=""
              >
                {group.title}
              </h3>

              <div className="jn-skills__groupBody">
                {/* The count is a real fact about the list beside it, so it is
                    derived rather than typed in and cannot drift. */}
                <p className="jn-skills__count" aria-hidden="true">
                  ({String(shown.length).padStart(2, "0")})
                </p>

                <ol className="jn-skills__list">
                  {shown.map((skill, i) => (
                    <li
                      key={skill}
                      className="jn-skills__row"
                      data-skill-row=""
                    >
                      <span className="jn-skills__skill">{skill}</span>
                      {/* Position within the group, not a ranking. Hidden from
                          assistive tech: the ordered list already conveys it. */}
                      <span className="jn-skills__num" aria-hidden="true">
                        {i + 1}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
