"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";

import { playItems, playground } from "@/content/design";

import { ArrowUpRight } from "./icon";
import { KineticGrid } from "./kinetic-grid";
import { ScrollCurtain } from "./motion/scroll-curtain";
import { ScrollReveal } from "./motion/scroll-reveal";
import { PlayDetail } from "./play-detail";
import { useDrum } from "./use-drum";

/**
 * Degrees between one card and the next, and it is DERIVED, not chosen.
 *
 * This was `360 / 8` with the ghost offset written out as `22.5` a few lines
 * down, so the count of items was encoded twice in two different notations. Add
 * a ninth item to the content file and nothing here complains: `i * 45` simply
 * walks past 360 and the ninth card lands exactly on top of the first, faces
 * z-fighting, with no error anywhere. Remove one and a 45-degree wedge of the
 * cylinder is just missing as the drum drifts past.
 *
 * Eight items today, so this still evaluates to 45 and the ghost offset to
 * 22.5. The numbers have not changed; the coupling has.
 */
const STEP = 360 / playItems.length;

/**
 * The playground drum.
 *
 * A 3D carousel: one card per item on a cylinder at
 * `rotateY(n × STEP) translateZ(760px)`, with dimmed backers between them at a
 * half-step offset and a shorter radius, so the ring reads as solid rather than
 * as a handful of floating planes. See STEP below for why that is derived.
 *
 * Each card is a plate of artwork above a caption band. The art fills the plate
 * and is therefore cropped, because these are eight found pieces at two
 * different aspect ratios and fitting them whole left up to a third of the card
 * empty. Hovering a card hands the uncropped image back. See the plate.
 *
 * The whole transform chain is fragile: `preserve-3d` is destroyed by
 * `overflow: hidden`, `filter`, or `opacity < 1` on ANY ancestor. The section
 * sets `overflow: hidden` in the artboard, so the rail deliberately sits
 * outside that clip — see the CSS.
 *
 * Cards are real `<button>`s, so the ring is fully keyboard-operable even
 * though the drag is pointer-only.
 *
 * The panel is BLACK: it carries `jn-panel--void`, the darker of the two dark
 * grounds, so it steps away from the slate Works panel riding up over it. It
 * used to be an accent drench, which is the only reason `--color-play-ink`,
 * `--color-play-muted` and `--color-play-edge` ever existed; all three are gone
 * and the section takes the ordinary dark ramp now.
 */
export function Playground() {
  const railRef = useRef<HTMLDivElement>(null);
  const drumRef = useRef<HTMLDivElement>(null);
  const [openIdx, setOpenIdx] = useState(-1);

  const { wasDragged } = useDrum(drumRef, railRef);

  return (
    <section
      id="playground"
      className="jn-panel jn-panel--void jn-panel--overlap jn-pg"
      aria-labelledby="playground-heading"
    >
      <KineticGrid />
      <div className="jn-pg__body" data-panel-inner="">
        <div className="jn-pg__head">
          <div>
            <ScrollCurtain
              id="playground-heading"
              className="jn-pg__title"
              rows={playground.headline}
            />
          </div>

          {/* A BUTTON, where a paragraph describing this section used to be.
              It reuses `.jn-ready__button`'s rule rather than a link styled to
              look like one: that is the site's existing dark-ground button, and
              the two selectors are grouped in the stylesheet so they cannot
              drift apart. */}
          <ScrollReveal kind="rise">
            <div className="jn-pg__cta">
              <a
                className="jn-pg__ctaButton"
                href={playground.cta.href}
                target="_blank"
                rel="noopener"
                data-cursor="link"
              >
                {playground.cta.label}
                <span className="jn-sr-only"> (opens in a new tab)</span>
                <span className="jn-pg__ctaIcon" aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </a>
            </div>
          </ScrollReveal>
        </div>

        <div ref={railRef} className="jn-pg__rail" data-cursor="drag">
          <div ref={drumRef} className="jn-pg__drum" data-drum="">
            {playItems.map((item, i) => (
              <span
                key={`ghost-${item.num}`}
                aria-hidden="true"
                className="jn-pg__ghost"
                style={{ "--rot": `${STEP / 2 + i * STEP}deg` } as CSSProperties}
              />
            ))}

            {playItems.map((item, i) => (
              <button
                key={item.num}
                type="button"
                className="jn-pg__card"
                data-cursor="view"
                /* Position only. Every card is the same size, set once in the
                   stylesheet: they used to carry their own width, which read as
                   accidental once the faces held real artwork. */
                style={{ "--rot": `${i * STEP}deg` } as CSSProperties}
                onClick={() => {
                  // A spin must not end by opening whatever was under the pointer.
                  if (wasDragged()) return;
                  setOpenIdx(i);
                }}
              >
                {/* TWO COPIES OF ONE IMAGE, and the second is the whole point.
                    The art is eight found pieces at 1:1 and 4:3 going into one
                    card shape, so something has to give: fitting them whole left
                    up to 35% of the card as dead mat, and filling the card crops
                    them. This fills, and then hands the whole image back on
                    hover.

                    Why two layers rather than animating the fit: `object-fit` is
                    not an animatable property, and the alternative - scaling a
                    contained image up by whatever factor makes it fill - needs
                    that factor per card, which depends on the plate's height,
                    which depends on how many lines the label wraps to. Two
                    stacked copies cross-fading on opacity need no arithmetic at
                    all, work at any card size, and cost one network fetch and
                    one decode because both layers are the same URL.

                    The second copy is `alt=""` and aria-hidden: it is the same
                    picture, and announcing it twice would be a bug.

                    `sizes` matters more than usual here. The sources run to
                    2160px square, the widest card is 500px, and all eight sit in
                    the DOM at once below the fold. */}
                <span className="jn-pg__cardPlate">
                  <Image
                    className="jn-pg__cardCover"
                    src={item.cover.src}
                    alt={item.cover.alt}
                    width={item.cover.width}
                    height={item.cover.height}
                    sizes="(max-width: 900px) 90vw, 500px"
                  />
                  <Image
                    className="jn-pg__cardWhole"
                    src={item.cover.src}
                    alt=""
                    aria-hidden="true"
                    width={item.cover.width}
                    height={item.cover.height}
                    sizes="(max-width: 900px) 90vw, 500px"
                  />
                </span>

                {/* The number is gone from the face. It numbered a card in a
                    ring that has no beginning, which is the same self-counting
                    the works rail was carrying. `num` stays on the data as the
                    React key for the card and its ghost. */}
                <span className="jn-pg__cardFoot">
                  <span className="jn-pg__cardLabel">{item.label}</span>
                  <span className="jn-pg__cardMeta">{item.tag}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

      <PlayDetail
        item={openIdx >= 0 ? playItems[openIdx] : null}
        onClose={() => setOpenIdx(-1)}
      />
    </section>
  );
}
