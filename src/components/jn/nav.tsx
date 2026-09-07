import { navLinks } from "@/content/design";

/**
 * Fixed nav.
 *
 * `mix-blend-mode: difference` (in CSS) is what keeps it legible as the light
 * hero gives way to the dark panels — it inverts against whatever is beneath.
 * The side effect is a stacking context, so the custom cursor and any overlay
 * must be siblings of this element and sit above it by z-index, never inside.
 */
export function Nav() {
  return (
    <nav className="jn-nav" aria-label="Primary">
      <a className="jn-nav__mark" href="#top">
        Josef<span>®</span>
      </a>
      <div className="jn-nav__links">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} data-cursor="link">
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
