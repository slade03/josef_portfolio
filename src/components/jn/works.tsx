"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";

import { works } from "@/content/design";
import type { CaseStudy as Study } from "@/content/design/case-studies";

import { CaseStudy } from "./case-study";
import { ArrowUpRight } from "./icon";
import { ScrollCurtain } from "./motion/scroll-curtain";
import { useWorksScroll } from "./use-works-scroll";

/**
 * Selected works.
 *
 * A 340vh runway with a stage pinned inside it, so vertical scroll drives the
 * track horizontally. The runway must not be given `overflow` — the pin dies to
 * an `overflow` on any ancestor, which is the single most repeated failure in
 * this project. The clip lives on the stage, which is *inside* the sticky
 * element rather than above it.
 *
 * Panels are plain `<article>`s in source order, so the horizontal travel is
 * presentational: the reading order and tab order stay vertical and correct.
 */
export function Works() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [openCase, setOpenCase] = useState<Study | null>(null);

  useWorksScroll(sectionRef, stageRef, trackRef);

  return (
    <section
      id="works"
      ref={sectionRef}
      className="jn-panel jn-panel--stone jn-dots jn-works"
      aria-labelledby="works-heading"
    >
      <div className="jn-works__runway">
        <div ref={stageRef} className="jn-works__stage" data-panel-inner="">
          <div className="jn-works__head">
            {/* `track` is not optional here. This heading lives inside a
                stage pinned for 340vh, and a pinned element has a fixed viewport
                rect, so scrubbing off its own position freezes it mid-exit. */}
            <ScrollCurtain
              id="works-heading"
              className="jn-works__title"
              rows={["Selected works"]}
              track={sectionRef}
              /* The exit sits right at the end. At 0.82 the heading was
                 leaving while the pinned stage still had a screen and a half
                 of horizontal travel left to go, so the title vanished before
                 the gallery had finished scrolling. */
              range={[0, 0.08, 0.95, 1]}
            />
            {/* The (0n) tally that used to sit above this is gone. It counted
                the works, which the works themselves already do, and each card
                still carries its own index. What is left is the one thing the
                reader cannot work out unaided: that this rail moves sideways. */}
            <div className="jn-works__count">
              <div>Scroll to advance</div>
            </div>
          </div>

          <div className="jn-works__viewport">
            <div ref={trackRef} className="jn-works__track">
              {works.map((work) => {
                /* Hoisted to a const. TypeScript drops narrowing on a property
                   access inside a nested function, so `work.study` would still
                   be possibly-undefined inside onClick; a const binding keeps
                   it. */
                const study = work.study;
                return (
                  <article
                    key={work.title}
                    data-wpanel=""
                    className="jn-wpanel"
                    style={{ "--w": work.width } as CSSProperties}
                    /* On the article rather than the button, so the View cursor
                     covers the whole card — the cursor resolves by
                     `closest("[data-cursor]")`. Only for cards that open
                     something; the "coming soon" ones must not offer it. */
                    data-cursor={study ? "view" : undefined}
                    /* Drives the scrim. Only cards carrying photography need one;
                     the striped placeholder is already dark enough to read on. */
                    data-cover={work.cover ? "" : undefined}
                  >
                    <span className="jn-wpanel__index">{work.index}</span>

                    {work.cover ? (
                      <Image
                        className="jn-wpanel__cover"
                        src={work.cover.src}
                        alt={work.cover.alt}
                        width={work.cover.width}
                        height={work.cover.height}
                        sizes="(max-width: 900px) 92vw, 900px"
                      />
                    ) : (
                      <span className="jn-wpanel__shot">project imagery</span>
                    )}

                    <div className="jn-wpanel__foot">
                      <div>
                        <h3
                          className={`jn-wpanel__name${study ? "" : " is-muted"}`}
                        >
                          {work.title}
                        </h3>
                        <span className="jn-wpanel__meta">{work.meta}</span>
                      </div>
                      {study ? (
                        <button
                          type="button"
                          className="jn-wpanel__cta"
                          onClick={() => setOpenCase(study)}
                        >
                          Read case
                          <span
                            className="jn-wpanel__ctaIcon"
                            aria-hidden="true"
                          >
                            <ArrowUpRight />
                          </span>
                        </button>
                      ) : (
                        <span className="jn-wpanel__soon">Coming soon</span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <CaseStudy study={openCase} onClose={() => setOpenCase(null)} />
    </section>
  );
}
