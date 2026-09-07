"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";

import { hobbies, outside } from "@/content/design/outside";
import { FULL, SCRUB, gsap } from "./motion/gsap";

/**
 * Outside of work.
 *
 * Two beats, in sequence, on a pinned stage:
 *
 *   1. the title alone on an empty stage, holding
 *   2. the title clears, then the cards fade up in turn
 *
 * THE DOOR IS GONE, and so is the WebGL shader that burned it open. It was three
 * fallback branches, a fragment shader, a lazily-created GL context and an
 * aperture animated as a clip-path, all in service of an effect that was asked to
 * be removed. What was wanted was a title, then some cards. This is that, and the
 * sequence is unchanged.
 *
 * Everything here is a plain opacity and offset scrub, so there is nothing left
 * to degrade: no context to lose, no shader to fail to compile, no aperture
 * fallback to keep in step. The only branch is reduced motion, which renders the
 * section at its resting state.
 */
export function Outside() {
  const scope = useRef<HTMLElement>(null);
  const runway = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(FULL, () => {
        /* One timeline across the runway, so the beats cannot overlap by
           accident. Their boundaries are positions on a shared clock rather than
           independent ranges kept in step by hand, which is exactly how the title
           and the door ended up sharing the stage before. */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: runway.current,
            start: "top top",
            end: "bottom bottom",
            scrub: SCRUB,
          },
        });

        tl
          /* Beat 1: the title arrives, holds, then leaves. */
          .fromTo(
            "[data-out-intro]",
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, ease: "power2.out", duration: 0.12 },
            0,
          )
          .to(
            "[data-out-intro]",
            { opacity: 0, y: -60, ease: "power2.in", duration: 0.1 },
            0.28,
          )
          /* Beat 2: nothing until 0.42, by which point the title is fully clear
             at 0.38. The empty stage between them is what makes the cards read as
             arriving rather than crossfading with the heading. */
          .fromTo(
            "[data-out-lede]",
            { opacity: 0 },
            { opacity: 1, ease: "none", duration: 0.16 },
            0.42,
          )
          .fromTo(
            "[data-out-card]",
            { opacity: 0, y: 44 },
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              duration: 0.3,
              stagger: 0.08,
            },
            0.44,
          );
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="outside"
      className="jn-panel jn-panel--void jn-panel--overlap jn-out"
      aria-labelledby="outside-heading"
    >
      <div className="jn-out__runway" ref={runway}>
        <div className="jn-out__stage" data-panel-inner="">
          <div className="jn-out__intro" data-out-intro="">
            <h2 id="outside-heading" className="jn-out__title">
              {outside.title}
            </h2>
            <p className="jn-out__hint">{outside.doorHint}</p>
          </div>

          {/* In the DOM from the first frame and never clipped, so the hobbies
              are selectable, searchable and reachable by screen reader whether or
              not the scroll animation ever runs. */}
          <div className="jn-out__reveal">
            <div className="jn-out__world">
              <p className="jn-out__lede" data-out-lede="">
                {outside.lede}
              </p>
              <ul className="jn-out__grid">
                {hobbies.map((hobby) => (
                  <li key={hobby.id} className="jn-out__card" data-out-card="">
                    <div className="jn-out__media">
                      {hobby.media.length > 0 ? (
                        <Image
                          src={hobby.media[0].src}
                          alt={hobby.media[0].alt}
                          width={hobby.media[0].width}
                          height={hobby.media[0].height}
                          /* GIFs must bypass the optimiser or Next serves a
                             single still frame and the animation vanishes. */
                          unoptimized={hobby.media[0].kind === "gif"}
                        />
                      ) : (
                        <span className="jn-out__slot">
                          {hobby.title} — photo / gif
                        </span>
                      )}
                    </div>
                    <div className="jn-out__cardText">
                      <span className="jn-out__cardTag">{hobby.tag}</span>
                      <h3 className="jn-out__cardTitle">{hobby.title}</h3>
                      <p className="jn-out__blurb">{hobby.blurb}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
