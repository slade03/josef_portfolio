"use client";

import { useRef } from "react";

import { hero, heroMarquee } from "@/content/design";

import { ArrowDown, ArrowUpRight } from "./icon";
import { Marquee } from "./marquee";
import { useHeroRecede } from "./use-hero-recede";
import { useHeroReel } from "./use-hero-reel";

/**
 * The hero.
 *
 * Sticky and on the light ground, so the dark Works panel rides up over it
 * rather than pushing it away. Client-side only because the recede and the reel
 * both need refs.
 *
 * The headline is two lines. The first is words, split individually because the
 * artboard animates them that way. The second is a slot-machine reel cycling
 * five self-descriptions; the motion lives in `use-hero-reel.ts` and the reasons
 * for its shape are documented there.
 */
export function Hero() {
  const typeRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const cellRef = useRef<HTMLSpanElement>(null);
  const reelRef = useRef<HTMLSpanElement>(null);

  useHeroRecede(typeRef, railRef);
  useHeroReel(cellRef, reelRef);

  return (
    <section id="top" className="jn-hero jn-dots" aria-labelledby="hero-heading">
      <div className="jn-hero__trail" aria-hidden="true" />

      <div ref={typeRef} className="jn-hero__type">
        <div className="jn-hero__typeInner">
          {/* THE NAME IS AUTHORED, not assembled from what is on screen, and it
              has to be. The reel renders eleven role spans (five, a duplicate,
              and five more in the hidden sizer); left to the default name
              computation the heading announced all of them, twice, in a single
              run-on string. `aria-hidden` on the cell is not enough on its own
              to keep them out of a name, so the name is stated here instead and
              built from the same content the reel uses, which is what stops the
              two drifting apart. */}
          <h1
            id="hero-heading"
            className="jn-hero__headline"
            aria-label={`${hero.headline[0].join(" ")} ${hero.roles
              .slice(0, -1)
              .join(", ")}, and ${hero.roles[hero.roles.length - 1]}`}
          >
            {hero.headline.map((line) => (
              <span key={line.join(" ")} className="jn-hero__line">
                {line.map((word) => (
                  <span key={word} className="jn-hero__word">
                    {word}
                  </span>
                ))}
              </span>
            ))}

            <span className="jn-hero__line">
              {/* Hidden, and the heading's aria-label above carries the roles as
                  a plain list instead. A heading that rewrites itself every
                  three seconds is not something to hand to a screen reader. */}
              <span ref={cellRef} className="jn-hero__reelCell" aria-hidden="true">
                {/* THE SIZER IS LOAD-BEARING, and it is why the hero does not
                    wobble. All five roles stack in one grid cell, so the cell
                    measures as wide as the longest of them and exactly one line
                    tall, permanently. Take it out and the cell resizes with each
                    role; because the hero block is centred, that slides the
                    whole composition sideways five times a cycle. */}
                <span className="jn-hero__reelSizer">
                  {hero.roles.map((role) => (
                    <span key={role} className="jn-hero__role">
                      {role}
                    </span>
                  ))}
                </span>

                {/* The travelling column. The first role appears twice: the
                    copy at the end is what lets the loop always move in one
                    direction and then reset invisibly. See use-hero-reel.ts. */}
                <span ref={reelRef} className="jn-hero__reel">
                  {[...hero.roles, hero.roles[0]].map((role, i) => (
                    <span key={`${role}-${i}`} className="jn-hero__role">
                      {role}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          </h1>
        </div>
      </div>

      <div ref={railRef} className="jn-hero__rail">
        <span className="jn-hero__meta">{hero.year}</span>
        <div>
          <span className="jn-hero__scroll">
            {hero.scroll}
            {/* The span stays. `.jn-hero__scroll span` is the selector carrying
                the bob animation, and an <svg> is not a span. */}
            <span aria-hidden="true">
              <ArrowDown />
            </span>
          </span>
        </div>
        {/* New tab, because this is a PDF now rather than a jump link: opening
            it in place would navigate the reader out of the portfolio they came
            to look at. The arrow says so visually; the hidden text is the same
            fact for anyone who cannot see the arrow. */}
        <a
          className="jn-pill"
          href={hero.cta.href}
          target="_blank"
          rel="noopener"
          data-cursor="link"
        >
          {hero.cta.label}
          <span className="jn-sr-only"> (opens in a new tab)</span>
          <span className="jn-pill__icon" aria-hidden="true">
            <ArrowUpRight />
          </span>
        </a>
      </div>

      <Marquee items={heroMarquee} />
    </section>
  );
}
