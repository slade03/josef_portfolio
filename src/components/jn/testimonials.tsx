"use client";

import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";

import { quotes, testimonials } from "@/content/design/testimonials";
import { ArrowLeft } from "./icon";
import { FULL, ScrollTrigger, gsap } from "./motion/gsap";
import { Overlay } from "./motion/overlay";

/**
 * Testimonials - a centred title above a row of post-it notes.
 *
 * THIRD LAYOUT, and the reasons the first two went are worth keeping. It began
 * as a 3x2 "ring" with the heading in the middle cell and a card in each
 * corner; the heading sets its rows as grid children, so in a tall centre cell
 * those rows were pushed to the top and bottom and the two halves of the title
 * ended up separated by a void. It then became Skills' two-column mechanic, a
 * sticky left title beside a 2x2 wall.
 *
 * It is one centred column now, with the four notes lined up in a single row.
 * That fixed something the 2x2 could not: the quotes are sorted longest-first,
 * and a CSS grid row sizes to its own content, so two rows meant the top row was
 * always visibly taller than the bottom one. One row cannot be uneven with
 * itself.
 *
 * Nothing here is sticky any more, which is why `data-panel-inner` moved up to
 * the body - see the comment at that attribute.
 *
 * The count is not load-bearing. The old ring hardcoded four in three places:
 * direction vectors here, a `grid-area: qN` per card, and two
 * `grid-template-areas` in CSS. All three are gone. The row is four explicit
 * columns above 62rem and `auto-fit` below it, and `data-tint={i % 4}` cycles,
 * so a fifth testimonial is a content-only change that reuses tint 0.
 *
 * The quotes are real LinkedIn recommendations, so each note carries a full
 * attribution: who said it, what they do, and how they worked with him. The last
 * of those is doing real work - a manager's endorsement and a mentor's are not the
 * same claim, and a reader can only weigh them if the card says which is which.
 *
 * THE WHOLE NOTE IS CLICKABLE, and not by wrapping it in a button. The card is a
 * `<figure>` holding a `<figcaption>`, which cannot be a button, and it already
 * contains one; nesting them would be invalid interactive content. Instead the
 * existing "Read more" button gets a stretched invisible hit area in CSS. One
 * tab stop per card either way, so `:focus-within` still means what it says.
 */

/**
 * First and last initial. Several of these names carry three or four given names,
 * so taking every word would produce four letters in a 34px circle.
 */
function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

export function Testimonials() {
  const scope = useRef<HTMLElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const open = quotes.find((q) => q.id === openId);
  // Keep the paper and its content visible until the overlay finishes closing.
  const [shown, setShown] = useState(open);
  if (open && open !== shown) setShown(open);
  const tint = shown ? quotes.indexOf(shown) % 4 : 0;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* One branch, under FULL only: someone who asked for less motion simply gets
         the resting state, with no second code path to keep in step. */
      mm.add(FULL, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-quote-card]");

        /* Hidden from JS rather than CSS. If the opening state lived in the
           stylesheet and the script never ran, the notes would stay invisible. */
        gsap.set(cards, { opacity: 0, y: 14 });

        ScrollTrigger.batch(cards, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: "power2.out",
              stagger: 0.07,
              overwrite: true,
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
      id="testimonials"
      className="jn-panel jn-panel--paper jn-panel--overlap jn-dots jn-quotes"
      aria-labelledby="quotes-heading"
    >
      {/* `data-panel-inner` MOVED UP HERE from `__wall`, and the reason it could
          not live here before is gone. PanelStack transforms whatever carries
          this attribute, and a transform on an ancestor of a `position: sticky`
          element silently kills the pin - which is why it sat on the wall while
          the title was a sticky rail. Nothing in this section is sticky now, so
          it belongs on the body, and the title and the notes arrive together on
          the panel's transform instead of the title sitting still while the
          notes move. If anything here is ever made sticky again, move it back
          down to the scrolling element. */}
      <div className="jn-quotes__body" data-panel-inner="">
        <div className="jn-quotes__aside">
          <h2 id="quotes-heading" className="jn-quotes__heading">
            {testimonials.heading.map((row) => (
              <span key={row}>{row}</span>
            ))}
          </h2>
          <p className="jn-quotes__note">{testimonials.note}</p>
        </div>

        <div className="jn-quotes__wall">
          {quotes.map((q, i) => (
            <figure
              key={q.id}
              className="jn-quotes__card jn-note"
              data-quote-card=""
              /* Colour and tilt cycle by index, so they survive a change of
                 count. GSAP owns the transform on this element; the tilt lives on
                 the inner note. */
              data-tint={i % 4}
            >
              <div className="jn-quotes__note-inner">
                <div className="jn-quotes__excerpt">
                  <blockquote className="jn-quotes__text">{q.quote}</blockquote>
                  <button
                    type="button"
                    className="jn-quotes__more"
                    onClick={() => setOpenId(q.id)}
                    data-cursor="link"
                  >
                    Read more
                    <span className="jn-sr-only"> from {q.name}</span>
                  </button>
                </div>

                <figcaption className="jn-quotes__attr">
                  {/* Initials, not a photograph. The quotes are real, so the old
                      abstract shape has no job left - but we hold no portraits,
                      and lifting LinkedIn profile pictures is a permission
                      question of its own. */}
                  <span className="jn-quotes__avatar" aria-hidden="true">
                    {initials(q.name)}
                  </span>
                  <span className="jn-quotes__who">
                    <span className="jn-quotes__name">{q.name}</span>
                    <span className="jn-quotes__headline">{q.headline}</span>
                    <span className="jn-quotes__rel">{q.relationship}</span>
                  </span>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>

      {/* Full text lives here rather than on the note. The notes clamp to a fixed
          number of lines so they are all the same height: these recommendations run
          from 70 to 150 words, and unclamped the longest was two thirds taller than
          the shortest. Nothing is lost, only deferred. */}
      <Overlay
        open={open !== undefined}
        onClose={() => setOpenId(null)}
        labelledBy="quote-modal-name"
        className={`jn-quoteModal jn-note jn-note--${tint}`}
      >
        {shown ? (
          <div className="jn-quoteModal__inner">
            <figure className="jn-quoteModal__scroll">
              <button
                type="button"
                className="jn-quoteModal__close"
                onClick={() => setOpenId(null)}
                data-cursor="link"
              >
                <ArrowLeft /> Close
              </button>

              <blockquote className="jn-quoteModal__text">{shown.quote}</blockquote>

              <figcaption className="jn-quoteModal__attr">
                <span className="jn-quotes__avatar" aria-hidden="true">
                  {initials(shown.name)}
                </span>
                <span className="jn-quotes__who">
                  <span id="quote-modal-name" className="jn-quotes__name">
                    {shown.name}
                  </span>
                  <span className="jn-quotes__headline">{shown.headline}</span>
                  <span className="jn-quotes__rel">{shown.relationship}</span>
                </span>
              </figcaption>
            </figure>
          </div>
        ) : null}
      </Overlay>
    </section>
  );
}
