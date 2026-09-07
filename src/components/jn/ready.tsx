import { ready } from "@/content/design/ready";

import { ArrowUpRight } from "./icon";
import { KineticGrid } from "./kinetic-grid";
import { ScrollReveal } from "./motion/scroll-reveal";

/**
 * Ready for work - the closing statement.
 *
 * Centred, with the headline flanked by parentheses, one word dimmed, and a
 * single pill action beneath. Behind it a lattice of hairlines that warps toward
 * the pointer.
 *
 * THAT LATTICE REPLACED `<GlyphField />`, which held this same slot as a masked
 * field of mono characters. The component, its content and its `.jn-glyphs`
 * rules are all still in the tree and simply unused, the way Skills and Outside
 * are. Restoring it is this import and this element. What it is not is a second
 * layer underneath the grid: one texture per section.
 *
 * ONE action, still. This section exists because the footer used to make the
 * same offer five ways over; giving a reader five doors is the same as giving
 * them none. The email sits under the button as plain text rather than as a
 * second link.
 *
 * Not pinned and not scroll-jacked. Everything above has been moving under
 * scroll control for several screens and the page needs somewhere to land.
 */
export function Ready() {
  return (
    <section
      id="ready"
      className="jn-panel jn-panel--void jn-panel--overlap jn-ready"
      aria-labelledby="ready-heading"
    >
      <KineticGrid />

      <div className="jn-ready__body" data-panel-inner="">
        <ScrollReveal kind="reveal">
          <div className="jn-ready__headline">
            {/* Decorative brackets. Real characters rather than pseudo-elements
                so they scale with the type, but hidden from assistive tech,
                which would otherwise read "left paren" around the heading. */}
            <span className="jn-ready__bracket" aria-hidden="true">
              (
            </span>

            <h2 id="ready-heading" className="jn-ready__title">
              {ready.headline.map((line, li) => (
                <span key={li} className="jn-ready__line">
                  {line.map((word) => (
                    <span
                      key={word.text}
                      className={
                        word.dim ? "jn-ready__word jn-ready__word--dim" : "jn-ready__word"
                      }
                    >
                      {word.text}
                    </span>
                  ))}
                </span>
              ))}
            </h2>

            <span className="jn-ready__bracket" aria-hidden="true">
              )
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal kind="rise" delay={0.06}>
          <div className="jn-ready__foot">
            <p className="jn-ready__lede">{ready.lede}</p>
            <a
              className="jn-ready__button"
              href={ready.action.href}
              target="_blank"
              rel="noopener"
              data-cursor="link"
            >
              {ready.action.label}
              <span className="jn-sr-only"> (opens in a new tab)</span>
              <span className="jn-ready__buttonIcon" aria-hidden="true">
                <ArrowUpRight />
              </span>
            </a>
            {/* Plain text, not a second link. The button already goes here. */}
            <p className="jn-ready__address">{ready.address}</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
