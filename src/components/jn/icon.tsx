import {
  ArrowDown as PhArrowDown,
  ArrowLeft as PhArrowLeft,
  ArrowUpRight as PhArrowUpRight,
  DownloadSimple as PhDownloadSimple,
  Globe as PhGlobe,
  InstagramLogo as PhInstagramLogo,
  LinkedinLogo as PhLinkedinLogo,
  X as PhX,
} from "@phosphor-icons/react/ssr";
import type { Icon as PhosphorIcon, IconProps } from "@phosphor-icons/react";

/**
 * Every icon on the site, in one place, at one weight.
 *
 * WHAT THIS REPLACED. Thirteen typed characters (↗ ↓ ← ✕) scattered across eight
 * components, plus one hand-drawn inline SVG globe whose own comment records
 * rejecting every available character because none of them was a drawn icon. The
 * arrows were the bigger problem: a glyph's weight, its optical size and its
 * baseline all come from whichever font happens to have that codepoint, so ↗ in
 * Source Sans and ↓ in a fallback were never the same drawing.
 *
 * IMPORTED FROM `/ssr`, NOT THE PACKAGE ROOT, and that is load-bearing. The root
 * barrel is a client module: it carries `IconContext`, so a Server Component
 * importing from it fails to build. `ready.tsx`, `contact.tsx` and `nav.tsx` are
 * all Server Components. The `/ssr` entry drops the context and works on both
 * sides of the boundary, so there is one import path here rather than a rule
 * about which file is which.
 *
 * THE WEIGHT IS BOUND ONCE, HERE. Phosphor's `light` is the thinnest weight that
 * still reads at 14px, and it is the one that matches this site: every border on
 * the page is a hairline, and `regular` next to a 1px rule looks like a mistake.
 * The usual way to set it globally is `IconContext`, which is a provider, and
 * this codebase has none at all — `layout.tsx` is a bare `<html><body>`. Binding
 * it at the import site instead keeps that true.
 *
 * `size="1em"` rather than a pixel value, so an icon scales with the type it sits
 * beside. Most of these live inside a 26 or 30px disc whose font-size is
 * `--fs-caption`, which puts the drawing at 14px inside it — the same optical
 * size the character it replaced had.
 *
 * `aria-hidden` BY DEFAULT. Every one of these is decoration sitting next to a
 * real text label, and an unlabelled icon in the accessibility tree is noise.
 * The one control that had no text at all, the playground close button, keeps
 * its `aria-label`; the icon inside it is hidden like the rest. A call site that
 * genuinely needs a named icon can pass `aria-hidden={false}` and a label, but
 * nothing does.
 */
function Mark({
  glyph: Glyph,
  className,
  ...rest
}: IconProps & { glyph: PhosphorIcon }) {
  return (
    <Glyph
      weight="light"
      size="1em"
      aria-hidden="true"
      /* Keeps the SVG out of the tab order in IE-era and Safari behaviours where
         an inline <svg> is focusable by default. Costs a word, removes a
         phantom tab stop. */
      focusable="false"
      {...rest}
      /* `.jn-ico` carries the two lines every icon needs and no call site should
         have to remember: a baseline nudge, because an inline <svg> sits its
         bottom edge on the baseline and therefore rides high next to text, and
         `flex: none`, because most of these live inside an `inline-flex` disc
         where a shrinkable child would get squeezed. Merged rather than
         replaced, so a call site can still add its own class without silently
         dropping this one. */
      className={className ? `jn-ico ${className}` : "jn-ico"}
    />
  );
}

/** Outbound. Every link that leaves the page or opens a new tab. */
export function ArrowUpRight(props: IconProps) {
  return <Mark glyph={PhArrowUpRight} {...props} />;
}

/** The hero's scroll cue. Must stay inside its span: `.jn-hero__scroll span` is
    what carries the bob animation, and an <svg> is not a span. */
export function ArrowDown(props: IconProps) {
  return <Mark glyph={PhArrowDown} {...props} />;
}

/** Back out of an overlay. Paired with the word "Close", never alone. */
export function ArrowLeft(props: IconProps) {
  return <Mark glyph={PhArrowLeft} {...props} />;
}

/** The case-study asset download. `DownloadSimple` rather than `Download`: the
    plain one is a tray with an arrow, which at 14px and light weight collapses
    into a smudge. */
export function DownloadSimple(props: IconProps) {
  return <Mark glyph={PhDownloadSimple} {...props} />;
}

/** Dismiss. The only icon-only control on the site, so its button keeps a real
    `aria-label`. */
export function X(props: IconProps) {
  return <Mark glyph={PhX} {...props} />;
}

/** The footer's location row. This is the one that replaces hand-drawn
    geometry rather than a character. */
export function Globe(props: IconProps) {
  return <Mark glyph={PhGlobe} {...props} />;
}

export function LinkedinLogo(props: IconProps) {
  return <Mark glyph={PhLinkedinLogo} {...props} />;
}

export function InstagramLogo(props: IconProps) {
  return <Mark glyph={PhInstagramLogo} {...props} />;
}
