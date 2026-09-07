import type { Pill } from "./schema";

/**
 * The hero constellation.
 *
 * Positions are percentages across the band, scattered rather than flowed —
 * the reference places each pill absolutely instead of running a strip. Labels
 * are mixed case at 18px mono, and each names something evidenced elsewhere on
 * the page, so the field reads as a summary rather than decoration.
 *
 * Rotation is deliberately omitted: the reference's measured transform is
 * ~0.085 degrees, which is no tilt at all.
 */
export const pills: Pill[] = [
  // Labelled pills, spread across the band and around the centred section label.
  { id: "design-systems", label: "Design systems", accent: "yellow", shape: "label", x: 20, y: 22 },
  { id: "usability-testing", label: "Usability testing", accent: "lavender", shape: "label", x: 74, y: 16 },
  { id: "figma-to-code", label: "Figma to code", accent: "sky", shape: "label", x: 12, y: 62 },
  { id: "flutter-builds", label: "Flutter builds", accent: "mint", shape: "label", x: 82, y: 58 },
  { id: "prototyping", label: "Prototyping", accent: "lime", shape: "label", x: 30, y: 82 },
  { id: "interaction-design", label: "Interaction design", accent: "pink", shape: "label", x: 68, y: 84 },
  { id: "ux-research", label: "UX research", accent: "neutral", shape: "label", x: 47, y: 12 },
  { id: "responsive-ui", label: "Responsive UI", accent: "orange", shape: "label", x: 52, y: 90 },

  // Unlabelled circles: the breathers that stop the field reading as a tag list.
  { id: "dot-1", accent: "orange", shape: "circle", x: 5, y: 34 },
  { id: "dot-2", accent: "yellow", shape: "circle", x: 94, y: 36 },
  { id: "dot-3", accent: "neutral", shape: "circle", x: 38, y: 48 },
  { id: "dot-4", accent: "sky", shape: "circle", x: 62, y: 44 },
];
