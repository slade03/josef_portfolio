import { Contact } from "@/components/jn/contact";
import { Cursor } from "@/components/jn/cursor";
import { Hero } from "@/components/jn/hero";
import { Nav } from "@/components/jn/nav";
import { PanelStack } from "@/components/jn/motion/panel-stack";
import { SmoothScroll } from "@/components/jn/motion/smooth-scroll";
import { Playground } from "@/components/jn/playground";
import { Ready } from "@/components/jn/ready";
import { Testimonials } from "@/components/jn/testimonials";
import { Works } from "@/components/jn/works";

/**
 * Composition of the artboard's panel stack.
 *
 * Order: hero, Selected works, Playground, Testimonials, Ready for work,
 * Contact. Each panel after the first overlaps the one before it via
 * `.jn-panel--overlap` and a rising z-index.
 *
 * TWO SECTIONS ARE HIDDEN, NOT DELETED: Skills, and Outside of work (the
 * portal). For both, the component, its content and its CSS all remain, and
 * restoring one is this element plus its nav entry. Nothing else: the z-index
 * ladder is hardcoded per panel, so a hidden section leaves a harmless gap in
 * the sequence (3 for Skills, 5 for Outside) rather than needing a renumber.
 *
 * The ground ladder still alternates without Outside: paper, stone, void,
 * paper, void, void. Restoring it would put a void panel between Testimonials
 * and Ready, which is also fine.
 *
 * The nav sits outside every panel: it uses `mix-blend-mode: difference`, which
 * creates a stacking context, and anything that needs to paint above it (the
 * cursor, overlays) has to be its sibling rather than its descendant.
 */
export default function Home() {
  return (
    <>
      <SmoothScroll />
      <PanelStack />
      <Nav />
      {/* Sibling of Nav, never inside it: the nav’s mix-blend-mode makes a
          stacking context nothing nested can paint above. */}
      <Cursor />
      <main>
        <Hero />
        <Works />
        <Playground />
        <Testimonials />
        <Ready />
      </main>
      <Contact />
    </>
  );
}
