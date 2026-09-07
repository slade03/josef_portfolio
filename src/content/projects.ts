import type { Project } from "./schema";

/**
 * Both projects currently carry `placeholder` metrics. The previous
 * implementation used a literal "[REPLACE WITH VERIFIED OUTCOME OR REMOVE]"
 * sentinel string; these are the typed equivalent. Replace a `placeholder`
 * with a `verified` entry (label + value + source) as real outcomes land.
 */
export const projects: Project[] = [
  {
    id: "slade-comics",
    title: "Slade Comics",
    year: "2025",
    premise:
      "A focused Flutter reader that treats a personal comic archive like a real reading product, not a file browser.",
    summary:
      "I built a focused Flutter reader for personal .cbz and .cbr libraries, combining high-fidelity interaction design with a direct Figma-to-code workflow.",
    problem:
      "I wanted a free comic reader that treated personal files with the polish of a dedicated reading product instead of a basic file browser.",
    audience:
      "Readers managing local comic archives who need quick library access, comfortable gesture controls, and a reliable place to resume.",
    role: "Personal project owner across product definition, interaction design, prototyping, and Flutter implementation.",
    roleShort: "Product design & Flutter development",
    constraints: [
      "Local .cbz and .cbr files need to remain easy to organize.",
      "The reader must stay out of the way once a comic opens.",
      "Reading progress must persist between sessions.",
    ],
    decisions: [
      "Used gestures for page navigation so the reading surface stays visually quiet.",
      "Kept library management and continue-reading status visible at the collection level.",
      "Made progress persistence part of the core flow instead of a secondary setting.",
    ],
    implementation: [
      "Built the application in Flutter.",
      "Connected Figma through MCP to tighten the design-to-code loop.",
      "Implemented the reader, library management, and persistent progress behavior as working product flows.",
    ],
    artifacts: [
      {
        type: "image",
        src: "/personal_apps/slade_comics.avif",
        alt: "Slade Comics library and continue-reading interfaces shown on two phones.",
        width: 1080,
        height: 1080,
      },
      {
        type: "video",
        src: "/personal_apps/slade_comics_demo.webm",
        poster: "/personal_apps/slade_comics.avif",
        description:
          "Screen recording of Slade Comics: opening the library, resuming a comic, and paging through with gestures.",
      },
    ],
    metrics: [
      { kind: "placeholder", label: "Reading sessions", needs: "Local usage log" },
      { kind: "placeholder", label: "Archive formats", needs: "Confirm .cbz/.cbr coverage" },
      { kind: "placeholder", label: "Resume accuracy", needs: "Manual test pass" },
    ],
    tags: ["Flutter", "Figma API", "MCP", "Vibe-Coding"],
    accent: "yellow",
  },
  {
    id: "broke-basket",
    title: "The Broke Basket",
    year: "2025",
    premise:
      "An offline-first grocery flow that replaces a paper list and a calculator with one readable running total.",
    summary:
      "I replaced a grocery notebook and manual calculator with an offline-first Android flow that keeps the budget, remaining amount, and basket items together.",
    problem:
      "Tracking groceries across a paper list and calculator made every price change harder to follow during a real shopping trip.",
    audience:
      "Budget-conscious shoppers who need fast totals in a store, including places where connectivity is weak or unavailable.",
    role: "Personal project owner across the shopping flow, information hierarchy, interface design, and mobile implementation.",
    roleShort: "Product design & mobile development",
    constraints: [
      "No account is required.",
      "The core shopping flow works without connectivity.",
      "Totals and remaining budget need to be readable at a glance while moving through a store.",
    ],
    decisions: [
      "Prioritized total spent and remaining budget above secondary list details.",
      "Kept basket editing close to each item so corrections take only a few taps.",
      "Stored the active shopping state locally to support dependable offline use.",
    ],
    implementation: [
      "Built the Android application with React Native and Expo.",
      "Used Tailwind utilities for repeatable interface styling.",
      "Used Antigravity in the implementation workflow while keeping the app functional without a network connection.",
    ],
    artifacts: [
      {
        type: "image",
        src: "/personal_apps/the_broke_basket_1.avif",
        alt: "The Broke Basket launch screen and grocery list overview shown on two phones.",
        width: 1920,
        height: 1440,
      },
      {
        type: "video",
        src: "/personal_apps/broke_basket_demo.webm",
        poster: "/personal_apps/the_broke_basket_1.avif",
        description:
          "Screen recording of The Broke Basket: setting a budget, adding basket items, and watching the remaining amount update offline.",
      },
      {
        type: "image",
        src: "/personal_apps/the_broke_basket_2.avif",
        alt: "The Broke Basket budget tracking and basket item interfaces.",
        width: 1920,
        height: 1440,
      },
    ],
    metrics: [
      { kind: "placeholder", label: "Trips tracked", needs: "Local usage log" },
      { kind: "placeholder", label: "Offline reliability", needs: "Airplane-mode test pass" },
      { kind: "placeholder", label: "Taps to add item", needs: "Measure against paper baseline" },
    ],
    tags: ["React Native", "Expo", "Tailwind", "Antigravity"],
    accent: "mint",
  },
];
