import type { NavSection } from "./schema";

/**
 * Single source for section ids. The nav, the section headings, and the
 * IntersectionObserver leaf all read this array, so an anchor cannot drift out
 * of sync with the section it points at.
 */
/**
 * Anchors are root-relative (`/#work`, not `#work`) so the same nav works from
 * /about. On the home page the browser still treats them as same-document and
 * simply scrolls.
 */
export const navSections: NavSection[] = [
  { id: "work", label: "Work", href: "/#work" },
  { id: "experiments", label: "Playground", href: "/#experiments" },
  { id: "about", label: "About", href: "/about" },
];

/** Sections that participate in scroll tracking when present in the document. */
export const scrollSections = navSections.filter((s) => s.href.includes("#"));
