/**
 * The closing call to action.
 *
 * ONE action, deliberately. This section exists because the footer was saying
 * "available for work" five different ways at once, which reads as anxious
 * rather than available. The statement and the single action live here; the
 * footer below is contact details only.
 *
 * The headline is split into segments so some words can be dimmed. That is the
 * only reason it is not a plain string: the two-tone emphasis in the reference
 * needs per-word control, and doing it with dangerouslySetInnerHTML to get a
 * span in there would be worse in every way.
 *
 * The address is still the artboard placeholder. Josef's real one is in
 * src/content/profile.ts and stays unwired while the page is placeholder.
 */

export interface HeadlineWord {
  text: string;
  /** Dimmed, for the two-tone emphasis. */
  dim?: boolean;
}

export const ready = {
  /** One line per array entry; words within a line can be dimmed. */
  headline: [
    [{ text: "Ready" }, { text: "for", dim: true }, { text: "work" }],
  ] as HeadlineWord[][],
  lede: "Available for UI/UX engineering roles.",
  action: {
    label: "View my resume",
    href: "/josef-nicolas-resume.pdf",
  },
  address: "andreinicolas0816@gmail.com",
} as const;
