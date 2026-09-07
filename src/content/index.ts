/**
 * Barrel and selectors for portfolio content.
 *
 * Components import from here, never from the individual data modules, and
 * never filter content themselves. Every derivation lives below so the rules
 * (which metrics are safe to publish, which favorites appear on the home page)
 * are stated once.
 */

import { education, experience, skillGroups } from "./experience";
import { experiments } from "./experiments";
import { pills } from "./pills";
import { navSections, scrollSections } from "./nav";
import { favoriteGroups, featuredFavorites } from "./off-duty";
import { primaryEmail, profile } from "./profile";
import { projects } from "./projects";
import type {
  ExperienceCluster,
  FavoriteGroup,
  Highlight,
  Metric,
  Project,
} from "./schema";

export * from "./schema";
export {
  education,
  experience,
  experiments,
  favoriteGroups,
  featuredFavorites,
  pills,
  navSections,
  primaryEmail,
  profile,
  projects,
  scrollSections,
  skillGroups,
};

// ---------------------------------------------------------------- projects

export function getProject(id: Project["id"]): Project | undefined {
  return projects.find((p) => p.id === id);
}

type VerifiedMetric = Extract<Metric, { kind: "verified" }>;

/**
 * The only metrics safe to publish outside the page body.
 *
 * Pass results of this through to `generateMetadata` and the OpenGraph image so
 * a pending metric can never surface in a social preview or a search result.
 */
export function verifiedMetrics(project: Project): VerifiedMetric[] {
  return project.metrics.filter(
    (m): m is VerifiedMetric => m.kind === "verified",
  );
}

export function placeholderMetrics(project: Project) {
  return project.metrics.filter((m) => m.kind === "placeholder");
}

/**
 * Outstanding unverified metrics across all projects. Logged at build time so
 * the debt stays visible instead of quietly shipping.
 */
export const UNVERIFIED_METRIC_COUNT = projects.reduce(
  (total, project) => total + placeholderMetrics(project).length,
  0,
);

// ---------------------------------------------------------------- experience

/** The canonical bullets that roll up into a given cluster. */
export function highlightsFor(cluster: ExperienceCluster): Highlight[] {
  return experience.highlights.filter((h) =>
    cluster.highlightIds.includes(h.id),
  );
}

// ---------------------------------------------------------------- off duty

export function favoritesByMedium(
  medium: FavoriteGroup["medium"],
): FavoriteGroup[] {
  return favoriteGroups.filter((g) => g.medium === medium);
}
