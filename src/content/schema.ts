/**
 * The content contract for the portfolio.
 *
 * Nothing in `src/content/` imports React. These types describe data only, so
 * the same module can feed Server Components, `generateMetadata`, and the
 * OpenGraph image route without pulling a component tree along with it.
 */

// ---------------------------------------------------------------- shared

export type Accent =
  | "yellow"
  | "orange"
  | "lavender"
  | "sky"
  | "pink"
  | "mint"
  | "lime"
  | "neutral";

export interface ImageAsset {
  src: string;
  /** Required everywhere. There is no optional alt in this schema. */
  alt: string;
  width: number;
  height: number;
}

export interface VideoAsset {
  src: string;
  poster: string;
  /** Describes the demo for anyone who cannot watch it. */
  description: string;
}

export type Artifact =
  | ({ type: "image" } & ImageAsset)
  | ({ type: "video" } & VideoAsset);

// ---------------------------------------------------------------- metrics

/**
 * Project outcomes.
 *
 * The `placeholder` variant deliberately has no `value` field, so writing an
 * unsubstantiated number is a compile error rather than a judgement call. This
 * portfolio goes to hiring managers who may ask about any figure on it, so a
 * metric either carries its source or it renders as visibly pending.
 *
 * Use `verifiedMetrics()` from `./index` before passing metrics into metadata
 * or the OpenGraph image, so a pending metric can never leak into a preview.
 */
export type Metric =
  | {
      kind: "verified";
      /** e.g. "Usability test participants" */
      label: string;
      /** e.g. "5+" */
      value: string;
      /** What substantiates this. Required. */
      source: string;
    }
  | {
      kind: "placeholder";
      label: string;
      /** Note to self about what would substantiate it. */
      needs?: string;
    };

// ---------------------------------------------------------------- projects

export interface Project {
  /** Doubles as the URL slug if case-study routes are added later. */
  id: "slade-comics" | "broke-basket" | (string & {});
  title: string;
  year: string;
  /** One line. This is the card premise, not the full summary. */
  premise: string;
  summary: string;
  problem: string;
  audience: string;
  /** Full prose, for case studies and /about. */
  role: string;
  /**
   * Short label for the work row's detail line, which sets uppercase at
   * line-height 1.0 and needs one line, not a sentence.
   */
  roleShort: string;
  constraints: string[];
  decisions: string[];
  implementation: string[];
  artifacts: Artifact[];
  metrics: Metric[];
  tags: string[];
  /** Keeps stacked cards distinguishable from one another. */
  accent: Accent;
}

// ---------------------------------------------------------------- experiments

export interface Experiment {
  id: string;
  title: string;
  category: string;
  cover: ImageAsset;
  gallery?: ImageAsset[];
  layout: "wide" | "compact" | "half";
}

// ---------------------------------------------------------------- experience

export interface Highlight {
  id: string;
  /** The canonical CV bullet. Rendered in full only on /about. */
  text: string;
}

export interface ExperienceCluster {
  id: string;
  title: string;
  /** Home-page precis. A summary of the highlights, not a restatement. */
  summary: string;
  /** Which highlights roll up into this cluster. */
  highlightIds: string[];
}

export interface ExperienceRole {
  role: string;
  company: string;
  period: string;
  highlights: Highlight[];
  clusters: ExperienceCluster[];
  collaboration: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  skills: string[];
}

export interface Education {
  institution: string;
  degree: string;
  specialization: string;
  period: string;
}

// ---------------------------------------------------------------- off duty

export interface FavoriteGroup {
  id: string;
  genre: string;
  titles: string[];
  medium: "screen" | "page";
}

// ---------------------------------------------------------------- profile

export type ContactChannel =
  | { kind: "phone"; label: string; href: `tel:${string}` }
  | { kind: "email"; label: string; href: `mailto:${string}` }
  | { kind: "linkedin"; label: string; href: string }
  | { kind: "instagram"; label: string; href: string };

export interface Profile {
  /** Renders as "Josef." — the period is content, not a CSS pseudo-element. */
  wordmark: string;
  role: string;
  heroEyebrow: string;
  /** Each string is one rendered line of the hero headline. */
  heroHeadline: string[];
  heroLede: string;
  contactHeading: string;
  contactLede: string;
  contactMeta: string;
  contact: ContactChannel[];
  education: Education;
}

// ---------------------------------------------------------------- pills

/**
 * One pill in the hero constellation.
 *
 * The reference positions each pill absolutely with its own transform rather
 * than flowing them in a strip, so position is content here, not layout. The
 * measured rotation is ~0.085 degrees, i.e. effectively axis-aligned; `rot`
 * exists as a hook but defaults to none.
 */
export interface Pill {
  id: string;
  /** Circles carry no label. */
  label?: string;
  accent: Accent;
  shape: "circle" | "label";
  /** Percentage across the band. */
  x: number;
  /** Percentage down the band. */
  y: number;
  /** Degrees. Kept near zero to match the reference. */
  rot?: number;
}

// ---------------------------------------------------------------- nav

export interface NavSection {
  id: string;
  label: string;
  href: string;
}
