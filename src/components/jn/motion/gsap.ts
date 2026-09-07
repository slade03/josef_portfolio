"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * One place where GSAP is configured, so plugin registration cannot happen
 * twice with different settings or be forgotten in a new file.
 *
 * `registerPlugin` is idempotent, and importing this module is what guarantees
 * ScrollTrigger exists before any component tries to build one.
 */
gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Scroll animations must never overshoot. An elastic or back ease driven by
 * scrub can travel past its end value and then be dragged back as you keep
 * scrolling, which reads as the page fighting you.
 */
export const EASE = "power3.out";

/** Shared scrub value. A small number, not `true`, so motion has a little weight. */
export const SCRUB = 0.6;

/**
 * True when the visitor has asked for less motion.
 *
 * Read through GSAP's own matchMedia rather than a bare `window.matchMedia` so
 * that every scroll animation is torn down and rebuilt automatically if the
 * setting changes mid-session, instead of leaving half-applied inline styles
 * behind — the exact failure mode that stranded content at 35% opacity earlier
 * in this project.
 */
export const REDUCED = "(prefers-reduced-motion: reduce)";
export const FULL = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, useGSAP };
