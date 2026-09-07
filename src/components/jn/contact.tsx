import { contact, footerMarquee } from "@/content/design";

import {
  ArrowUpRight,
  Globe,
  InstagramLogo,
  LinkedinLogo,
} from "./icon";
import { KineticGrid } from "./kinetic-grid";
import { Marquee } from "./marquee";

/**
 * Which mark goes with which profile.
 *
 * KEYED HERE RATHER THAN IN THE CONTENT. `contact.elsewhere` is plain data and
 * every other file under `src/content/` is too, so putting a component
 * reference in it would be the first one. The lookup is by the label the
 * content already carries.
 *
 * The fallback is deliberate and is not a placeholder: a profile this map does
 * not know is still an outbound link, so it gets the outbound arrow rather than
 * nothing at all or, worse, somebody else's logo.
 */
const SOCIAL_MARKS: Record<string, typeof LinkedinLogo | undefined> = {
  LinkedIn: LinkedinLogo,
  Instagram: InstagramLogo,
};

/**
 * The footer.
 *
 * An accent marquee band across the top, then the footer proper: a bordered
 * location block on the left with the copyright beneath it, and link columns
 * plus the direct email on the right. Nothing else.
 *
 * It once carried an "Open for work" headline, a "Hire me" button and a "View my
 * work" link on top of a status fact and a direct email - six elements making the
 * same offer, three of them pointing at the same address. The offer is made once
 * now, in the Ready section above, so this is free to be a footer: where to find
 * him, where he is, and who owns the page.
 *
 * No scroll motion here on purpose. Everything above has been moving for several
 * screens and the page should come to a stop somewhere.
 *
 * Contact details are still artboard placeholders except the location. The real
 * ones live in src/content/profile.ts and stay unwired while the page is
 * placeholder content.
 */
export function Contact() {
  return (
    <footer
      id="contact"
      className="jn-panel jn-panel--void jn-panel--overlap jn-contact"
      aria-labelledby="contact-heading"
    >
      {/* The landmark needs a name even though the design shows no heading here,
          or it announces as an unlabelled footer. */}
      <h2 id="contact-heading" className="jn-sr-only">
        Contact
      </h2>

      {/* The same lattice as Ready, and a second instance rather than one
          spanning both. It has to be: the footer is pulled up 110px over Ready
          and paints its own opaque ground, so a shared canvas would have that
          strip of itself covered. The seam costs nothing because `.jn-band`
          below is a solid accent bar across the full width, so the two
          lattices never actually meet. */}
      <KineticGrid />

      {/* Its own wrapper class, not the hero's. `.jn-strip` hard-codes a -34px
          bottom margin that cancels the HERO's padding, which here would pull the
          band up over the footer content. */}
      <Marquee items={footerMarquee} className="jn-band" />

      <div className="jn-contact__body" data-panel-inner="">
        <div className="jn-contact__main">
          <div className="jn-contact__place">
            {/* Three cells in one bordered block, as in the reference. */}
            <div className="jn-contact__box">
              <p className="jn-contact__boxTop">{contact.location.place}</p>
              <div className="jn-contact__boxRow">
                {/* WAS HAND-DRAWN, and the note explaining why is worth
                    keeping as the reason this changed. Every mono-safe
                    character was rejected: &#9788; is a SUN, the alternatives
                    were a crosshair or an emoji that renders in colour and
                    breaks the monochrome row, so two ellipses and a circle
                    were cheaper than the compromise. There is a drawn globe in
                    the icon set now, at the same weight as everything else on
                    the page, so the hand-rolled one has no job left. */}
                <span className="jn-contact__globe" aria-hidden="true">
                  <Globe />
                </span>
                <span className="jn-contact__mode">{contact.location.mode}</span>
                <span className="jn-contact__code">{contact.location.code}</span>
              </div>
            </div>
            <p className="jn-contact__copy">{contact.copyright}</p>
          </div>

          <div className="jn-contact__links">
            <ul className="jn-contact__cols">
              {contact.elsewhere.map((link) => {
                const Mark = SOCIAL_MARKS[link.label] ?? ArrowUpRight;
                return (
                  <li key={link.label}>
                    <a
                      className="jn-contact__social"
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="link"
                    >
                      <Mark />
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            <a
              className="jn-contact__mail"
              href={`mailto:${contact.facts.find((f) => f.mail)?.value ?? ""}`}
              data-cursor="link"
            >
              {contact.facts.find((f) => f.mail)?.value}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
