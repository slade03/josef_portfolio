"use client";

import Image from "next/image";
import { useState } from "react";

import type { PlayItem } from "@/content/design";

import { ArrowUpRight, X } from "./icon";
import { Overlay } from "./motion/overlay";

/**
 * The playground card's detail overlay.
 *
 * Shares `Overlay` with the case study, so it inherits the same portal, focus
 * trap, Esc handling, scroll lock and transition — and, importantly, the same
 * fix for the custom cursor, which a native `<dialog>` used to paint over.
 *
 * The media frame used to be a striped panel with a caption in it: `PlayItem`
 * carried a `shot: string` that read "Card stack shot" or "Shader grid", back
 * when the eight items were inventions with no art. It shows the real thing
 * now — a demo recording for the three shipped builds, the cover for the five
 * concepts.
 */
export function PlayDetail({
  item,
  onClose,
}: {
  item: PlayItem | null;
  onClose: () => void;
}) {
  /* `item` goes null the moment the parent closes, but the overlay is still
     animating out for a few hundred milliseconds after that. Hold the last one
     so the panel does not blank mid-exit. */
  const [shown, setShown] = useState<PlayItem | null>(item);
  if (item && item !== shown) setShown(item);

  /* The viewer's picture, which is not always the card's. `still` exists for
     pieces whose best image is the wrong shape for a card face. */
  const viewed = shown ? (shown.still ?? shown.cover) : null;

  return (
    <Overlay
      open={item !== null}
      onClose={onClose}
      labelledBy="jn-play-title"
      className="jn-play"
    >
      {/* Both in the one condition, not just `shown`: TypeScript narrows what
          the guard actually tests, and `viewed` is computed above rather than
          derived inline, so guarding on `shown` alone leaves it nullable. */}
      {shown && viewed ? (
        <div className="jn-play__inner">
          <div className="jn-play__shot">
            {shown.video ? (
              /* No `autoPlay`. Three of these are on one page and a visitor who
                 opened a card did not ask for motion to start on its own.
                 `preload="none"` because the three recordings together are
                 several megabytes and most visitors will open one card, or
                 none. The description is the alt text equivalent: it is what
                 the recording shows, for anyone who cannot watch it. */
              <video
                className="jn-play__video"
                src={shown.video.src}
                poster={shown.cover.src}
                controls
                playsInline
                preload="none"
                aria-label={shown.video.description}
              />
            ) : (
              <Image
                className="jn-play__image"
                src={viewed.src}
                alt={viewed.alt}
                width={viewed.width}
                height={viewed.height}
                sizes="(max-width: 900px) 94vw, 1200px"
              />
            )}
          </div>

          <div className="jn-play__body">
            {/* The category alone. The "(06 / 08)" counter that sat beside it
                is gone: numbers came off the card faces, and with five of the
                eight carrying no description this counter was a third of the
                text in the panel. It also counted a position in a ring that has
                no first or last. */}
            <div className="jn-play__meta">
              <span>{shown.tag}</span>
            </div>
            <h3 id="jn-play-title" className="jn-play__title">
              {shown.label}
            </h3>
            {/* Five of the eight have none. A concept is a single picture and
                the reader is already looking at it; a paragraph restating what
                is on screen would be writing about the artwork rather than
                showing it. */}
            {shown.desc ? (
              <p className="jn-play__desc">{shown.desc}</p>
            ) : null}

            {shown.link ? (
              <p className="jn-play__link">
                <a
                  href={shown.link.href}
                  target="_blank"
                  rel="noopener"
                  data-cursor="link"
                >
                  {shown.link.label}
                  <span className="jn-sr-only"> (opens in a new tab)</span>
                  {/* The leading space is deliberate: this arrow follows inline
                      text inside an underlined link, not a flex row, so the gap
                      has to be a real character. */}
                  <span aria-hidden="true">
                    {" "}
                    <ArrowUpRight />
                  </span>
                </a>
                {/* BEFORE the click, not after. The lightsaber game opened on a
                    laptop alone shows a QR code and waits for a phone, so
                    someone who clicks without knowing that concludes it is
                    broken. A note that arrives after the navigation is no note
                    at all. */}
                {shown.link.note ? (
                  <span className="jn-play__linkNote">{shown.link.note}</span>
                ) : null}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            className="jn-play__close"
            onClick={onClose}
            aria-label="Close"
            data-cursor="link"
          >
            {/* The one icon-only control on the site, which is why the button
                keeps a real `aria-label` and the mark itself is hidden. As a
                bare ✕ character this was the only glyph on the page with no
                `aria-hidden` wrapper at all. */}
            <X />
          </button>
        </div>
      ) : null}
    </Overlay>
  );
}
