# Josef Portfolio Redesign Master Prompt

Copy everything below this introduction into a fresh Codex task from the repository root. Treat it as the implementation contract for the portfolio redesign.

---

## Role and objective

You are redesigning Josef's existing portfolio as a production-ready, hiring-focused, single-page website.

The finished page must help hiring managers, design leaders, product leaders, and engineering leads evaluate Josef for UI/UX Engineer roles. It should demonstrate product thinking, visual craft, prototyping ability, technical implementation, and personality through real work.

The design personality is:

- Playful
- Precise
- Resourceful

The page should feel like a bright prototyping workspace with measured annotations: energetic enough to be memorable, organized enough to review quickly, and specific enough to earn trust.

Do not stop at a mockup or partial implementation. Implement the page, verify it at representative breakpoints, fix issues, and leave the repository in a working state.

## Source-of-truth order

Before editing code, read these sources in order:

1. `AGENTS.md`
2. `PRODUCT.md`
3. This directive
4. `package.json`, `src/app/layout.tsx`, `src/app/globals.css`, and `src/app/page.tsx`
5. Existing portfolio components and `src/app/about/page.tsx`
6. Existing assets under `public/`

Repository content is the authority for Josef's employers, dates, projects, tools, education, contact information, and outcomes. Never replace repository facts with assumptions from the reference site.

If a desired fact or metric is missing, use the literal marker `[REPLACE WITH VERIFIED OUTCOME OR REMOVE]` in the implementation data. Do not invent a number, employer, client, responsibility, testimonial, award, or result.

## Reference crawl required before coding

Crawl [https://michaeltsirakis.com/](https://michaeltsirakis.com/) before coding. Inspect:

1. The homepage.
2. The `/about` page.
3. One representative case study, preferably `/work/netflix-script-hub`. If that path is unavailable, open the first current case-study link from the homepage.

Inspect the rendered desktop experience and, when browser controls permit, at least one mobile viewport. Record the hierarchy, pacing, section transitions, navigation behavior, motion, typography relationships, project storytelling, and responsive changes. Do not copy code, text, media, or branded compositions.

Transfer these principles only:

- A vivid, personality-led hero.
- A compact floating navigation system.
- Large visual work stories with immediate context.
- A lighter experiments or lab section.
- About content that feels human and relevant to the work.
- A simple, confident contact close.
- Motion that supports hierarchy and feedback.

## No-clone boundary

The result must be recognizably Josef's portfolio, not a variation of the reference.

Do not copy:

- The blue palette or blue hero gradient.
- The centered basketball portrait, pose, or prop concept.
- The reference site's wording or employer claims.
- Its exact navigation geometry, card dimensions, grid proportions, or section compositions.
- Its specific case-study layouts, metrics treatment, or app carousel styling.

When a composition begins to resemble the reference literally, keep the underlying information hierarchy and redesign the visual treatment.

## Technology and architecture

Use the existing stack:

- Next.js 16 App Router.
- React 19 and TypeScript.
- Tailwind CSS 4.
- Existing shadcn/ui primitives where they are the right semantic base.
- Framer Motion for advanced motion.
- `next/image` for raster assets.
- `next/font` for typography.

Implementation rules:

- Keep `src/app/page.tsx` a Server Component that composes the page and owns static portfolio data.
- Create small Client Components only for behavior that requires event handlers, IntersectionObserver, media controls, dialogs, or animation state.
- Do not add `"use client"` to the root layout or the entire page tree.
- Do not edit shadcn component internals unless a verified limitation requires it. Wrap primitives instead.
- Keep dependencies minimal. Use the installed Framer Motion package instead of adding another animation library.
- Keep the current `/about`, `/scenario-1`, `/scenario-2`, and `/info` routes available, but do not redesign them as part of this task.
- Build the new primary experience on `/` as one long page.

Preferred component organization:

- `src/components/portfolio/portfolio-nav.tsx`
- `src/components/portfolio/kinetic-hero.tsx`
- `src/components/portfolio/featured-project.tsx`
- `src/components/portfolio/experiments-gallery.tsx`
- `src/components/portfolio/experience-section.tsx`
- `src/components/portfolio/about-section.tsx`
- `src/components/portfolio/contact-footer.tsx`
- `src/components/portfolio/media-dialog.tsx` only if the existing `MediaModal` cannot meet dialog accessibility requirements through a wrapper

Keep reusable data types explicit. Use types equivalent to:

```ts
type FeaturedProject = {
  id: string;
  title: string;
  summary: string;
  problem: string;
  audience: string;
  role: string;
  constraints: string[];
  decisions: string[];
  implementation: string[];
  artifacts: Array<{ type: "image" | "video"; src: string; alt: string }>;
  outcomes: string[];
  tags: string[];
};

type Experiment = {
  id: string;
  title: string;
  category: string;
  image: string;
  gallery?: string[];
};
```

## Art direction

Use an art-directed single theme instead of a global light/dark toggle.

The color strategy is committed: signal orange carries the hero and final contact moment, true off-white carries the reading sections, and one deep blue-black section creates contrast. Orange should feel like a signal color in a working studio, not a warm paper theme.

### Color tokens

Use OKLCH tokens and begin with these values:

```css
:root {
  --canvas: oklch(0.985 0 0);
  --ink: oklch(0.16 0.02 250);
  --muted-ink: oklch(0.43 0.025 250);
  --signal: oklch(0.72 0.19 45);
  --signal-ink: oklch(0.36 0.13 38);
  --signal-soft: oklch(0.95 0.03 45);
  --night: oklch(0.135 0.025 250);
  --night-ink: oklch(0.97 0.005 90);
  --line-light: oklch(0.16 0.02 250 / 14%);
  --line-dark: oklch(0.97 0.005 90 / 18%);
  --focus: oklch(0.52 0.18 38);
}
```

Token roles:

- Hero: `--signal` background with `--ink` text.
- Primary reading sections: `--canvas` with `--ink` and `--muted-ink`.
- Supporting tinted moments: `--signal-soft` with `--ink`.
- Experiments: `--night` with `--night-ink`.
- Contact close: return to `--signal` so the page ends with the same energy it opened with.
- Use `--signal-ink`, not bright orange, for small orange text on light surfaces.

Verify contrast in the rendered implementation. Body text and control labels need at least 4.5:1. Large text needs at least 3:1. Adjust lightness when necessary without changing the palette's role or turning the page beige.

### Typography

Replace Inter and Oswald on the redesigned homepage.

- Display: `Anybody` from `next/font/google`, variable weight, normal style, with the `wdth` axis enabled.
- Body: `Atkinson_Hyperlegible_Next` from `next/font/google`, variable weight.
- Do not add a third font or use monospace as a shortcut for technical credibility.

Use this scale:

```css
--type-hero: clamp(3.5rem, 8vw, 6rem);
--type-h2: clamp(2.5rem, 6vw, 4.5rem);
--type-h3: clamp(1.75rem, 3.5vw, 2.75rem);
--type-lede: clamp(1.25rem, 2vw, 1.625rem);
--type-body: clamp(1.0625rem, 1.3vw, 1.125rem);
--type-small: 0.875rem;
```

Typography rules:

- Hero maximum is 96px.
- Hero line-height: 0.92 to 0.98.
- Display letter-spacing: no tighter than `-0.04em`; target `-0.03em`.
- Body line-height: 1.55 to 1.7.
- Body measure: 65 to 75 characters.
- Use `text-wrap: balance` for headings and `text-wrap: pretty` for prose.
- Reserve uppercase for very short labels only. Do not write paragraphs in uppercase.
- Do not repeat tiny tracked eyebrows above every section.

### Layout and spacing

Use a 4px base spacing system with intentional jumps in rhythm.

```css
--page-gutter: clamp(1.25rem, 4vw, 4rem);
--section-space: clamp(6rem, 12vw, 11rem);
--content-max: 80rem;
```

- Main content width: `min(calc(100% - 2 * var(--page-gutter)), var(--content-max))`.
- Use 24, 32, 48, 64, and 96px as the dominant internal gaps.
- Alternate tight content groupings with generous section separation.
- Use asymmetric project layouts where they improve narrative emphasis.
- Cards and media panels may use 12 to 16px radii. Do not exceed 16px for content surfaces.
- Pills are reserved for navigation controls, tags, filters, and compact actions.
- Do not combine a decorative 1px border with a wide soft shadow. Pick one treatment.
- Use a semantic z-index scale for floating navigation, dialogs, and tooltips.

## Information architecture and content

The homepage must use this order.

### 1. Floating navigation

Include:

- Josef wordmark.
- Work.
- Experiments.
- About.
- Contact.

Behavior:

- Links scroll to semantic section IDs.
- The current section receives a clear active state determined with IntersectionObserver.
- Desktop navigation is a compact solid surface, not decorative glass.
- On mobile, retain the Josef mark and expose a compact menu button or a horizontally scrollable anchor strip. Do not squeeze all links into unreadable targets.
- Minimum target size is 44 by 44px.
- Include a skip link before the navigation.

### 2. Type-led hero

Use a full-viewport or near-full-viewport hero with no portrait.

Content direction:

- Primary name: `Josef.`
- Positioning: `UI/UX engineer for practical, expressive products.`
- Supporting copy: describe designing product flows, production-ready interfaces, and functional prototypes. Keep it specific and under 35 words.
- Primary CTA: `View selected work`.
- Secondary CTA: `Read experience`.

Visual behavior:

- Signal-orange surface with deep-ink typography.
- Turn the display type into the scene through scale, width-axis changes, line choreography, and carefully controlled overlap.
- Keep every word legible at rest.
- No portrait, fake 3D object, generic gradient orb, particle field, custom cursor, or hero metrics.
- The hero must remain complete and compelling before JavaScript runs.

### 3. Selected work

Use two substantial inline stories, not two identical cards. Alternate the relationship between narrative and media so each story has its own pacing.

#### Slade Comics

Use these verified facts:

- A personal Flutter project for reading `.cbz` and `.cbr` comic files.
- Created from a desire for a free, high-fidelity comic-reading experience.
- Integrated with the Figma API through MCP.
- Includes a gesture-based reader, library management, and persistent reading progress.
- Existing media:
  - `/personal_apps/slade_comics.avif`
  - `/personal_apps/slade_comics_demo.webm`
- Existing tags: Flutter, Figma API, MCP, Vibe-Coding.

Tell the story using:

- Problem and motivation.
- Reader context.
- Josef's personal-project role.
- Key interaction decisions.
- Design-to-code workflow.
- Current artifacts.
- Outcome marker: `[REPLACE WITH VERIFIED OUTCOME OR REMOVE]`.

#### The Broke Basket

Use these verified facts:

- An offline-first Android app created to replace a grocery notebook and manual calculator.
- Supports budget tracking during shopping trips.
- Requires no account or connectivity.
- Built with React Native, Expo, Tailwind, and Antigravity.
- Existing media:
  - `/personal_apps/the_broke_basket_1.avif`
  - `/personal_apps/the_broke_basket_2.avif`
  - `/personal_apps/broke_basket_demo.webm`

Tell the story using:

- Shopping context and the notebook/calculator problem.
- Offline and no-account constraints.
- Information hierarchy for totals, remaining budget, and basket items.
- Reliability and speed during a real shopping trip.
- Current artifacts.
- Outcome marker: `[REPLACE WITH VERIFIED OUTCOME OR REMOVE]`.

For both stories:

- Use real interface screenshots and videos as the primary evidence.
- Do not fabricate user research, adoption, store listings, metrics, or testimonials.
- Videos must have an accessible play/pause control, a poster frame, `playsInline`, and a reduced-motion fallback.
- If a media lightbox is used, implement it as an accessible dialog with focus trapping, Escape dismissal, labelled controls, and focus return.

### 4. Experiments

Create a compact, visually varied gallery on the deep-ink surface. It should communicate range without competing with the two featured projects.

Use the existing project names, categories, and assets:

- Biskie Brand Concept: branding.
- PAC Delivery App Concept: product design.
- SM Cinema Redesign Concept: interface design.
- Kendrick Lamar Hero: editorial design.
- Darth Vader Concept: editorial design.
- Drake Hero Design: editorial design.
- Indiana Pacers Hero: sports branding.
- Nike Hero Concept: product design.
- Car Rental UI: app concept.
- Coffee Shop App: app concept.
- Pokemon Landing: web design.
- Spotify Dashboard: interface design.

Read the exact asset paths from the current `workItems` data in `src/app/page.tsx` instead of retyping or guessing them.

Gallery behavior:

- Use a varied mosaic or alternating rows, not a uniform three-column card grid.
- Preserve image aspect ratios and avoid crops that hide the interface subject.
- On pointer hover, allow a restrained image scale or crop shift and reveal the project label.
- On touch devices, labels remain visible and tapping opens the gallery directly.
- Keyboard users can open every item and operate every gallery control.

### 5. Experience and approach

Use the verified role:

- UI/UX Engineer at You-Source.
- January 2024 to current.

Organize the existing responsibilities into four proof clusters rather than reproducing a nine-item resume list:

1. Production product UI and design systems: two mobile applications, Flutter interfaces, reusable components.
2. Research and usability: testing with 5+ participants and recommendations for a food and beverage app.
3. Prototyping and systems work: ERP prototype for an Australia-based welding company and 50+ screens for a digital health MVP.
4. Marketing delivery: 5+ Webflow landing pages plus launch visuals and infographics.

Also mention collaboration with product managers, developers, and QA, plus functional prototyping with Stitch, MCP, and agent-based tools.

Use concrete verbs and verified numbers. Avoid resume filler such as "passionate," "innovative," or "results-driven."

### 6. Skills and education

Use the existing categories from `src/app/about/page.tsx`:

- Design and strategy.
- Technical core.
- Tools and platforms.

Keep the skill list scannable. Use grouped inline text or compact tags, not a large grid of identical cards.

Education:

- FEU Institute of Technology.
- Bachelor of Science in Computer Science.
- Specialization in Software Engineering.
- 2019 to 2024.

### 7. About and off duty

Use a human, compact section rather than a separate biography page.

Include:

- Josef's interest in cinema, television, and reading.
- The existing detail that opening-weekend cinema is a recurring habit.
- A short selection from the current favorites, not the complete database.
- At least one science-fiction reference, one comedy or animated reference, and one book series from the existing lists.

Present these details as personality cues connected to storytelling and interface craft. Do not turn the section into a novelty modal or an oversized entertainment database.

### 8. Contact close

Use the verified contact details:

- Phone: `+63-977-738-9118`, linked with `tel:+639777389118`.
- Email: `andreinicolas0816@gmail.com`.
- LinkedIn: `https://linkedin.com/in/andreinclas`.
- Instagram: `https://instagram.com/sitcho_pages`.

Use a direct final heading and a prominent `Email Josef` action. External social links open safely with appropriate `rel` values. Do not add a resume button unless a real resume file exists in the repository and its link is verified.

## Motion and interaction system

The motion posture is motion-forward but accessibility-first.

### Timing

- Immediate control feedback: 150 to 220ms.
- Hover and media transitions: 220 to 300ms.
- Narrative section motion: 500 to 700ms.
- Use ease-out quart, quint, or expo for entrances.
- Use ease-in curves for exits.
- Do not use bounce, elastic, or spring overshoot.

### Orchestrated first load

Create one intentional hero sequence:

1. Josef wordmark/navigation resolves first.
2. Hero lines reveal with clipped movement and a small width-axis change.
3. Supporting copy and CTAs follow as one grouped beat.

The sequence must finish quickly enough that the primary content is readable within roughly one second. Do not apply the same entrance animation to every later section.

### Scroll and section behavior

- Active navigation follows the visible section.
- Featured-project media may use restrained parallax or crop interpolation if it remains smooth.
- Hero typography may respond to scroll through transforms or the `wdth` axis.
- Do not animate layout properties such as width, height, top, or left during scroll.
- Use transforms, opacity, clip-path, filter, and masks when they materially help the composition.
- Content must be visible by default. Animations enhance visible content and never gate rendering.

### Reduced motion

Under `prefers-reduced-motion: reduce`:

- Remove parallax, scroll-linked transforms, width-axis animation, blur animation, and staggered movement.
- Use instant state changes or a brief opacity crossfade no longer than 120ms.
- Show video poster images instead of autoplaying motion.
- Preserve all text, navigation, gallery, dialog, and media-control functionality.

## Responsive behavior

Design mobile first and verify at approximately 390, 768, 1280, and 1440px widths.

### Mobile

- Stack featured-project narrative and media.
- Keep labels visible without hover.
- Use 20px page gutters.
- Hero copy must fit without horizontal scrolling or clipped words.
- Avoid viewport-locked effects that interfere with browser chrome or natural scrolling.
- Navigation must remain reachable with 44px targets.
- Media dialogs use the viewport safely and expose a visible close control.

### Tablet

- Introduce asymmetric project layouts only when both narrative and media retain comfortable widths.
- Allow two-column experiment groupings where aspect ratios remain legible.
- Keep section spacing generous without producing empty folds.

### Desktop

- Use the 1280px maximum content container.
- Let hero type and featured media carry the wide composition.
- Do not stretch prose beyond 75 characters.
- Keep floating navigation clear of heading and media content at every scroll position.

Do not hide meaningful information on mobile. Change the composition, not the content hierarchy.

## Image and media manifest

Existing assets are the primary evidence. Inspect and reuse them before generating anything.

If a featured project needs supporting context beyond the existing screenshots and videos, ImageGen is authorized for temporary imagery. Generated images must never masquerade as real product screenshots or user-research evidence.

Use this manifest only when the corresponding composition needs the asset:

| Purpose | Filename | Ratio | ImageGen prompt | Art direction | Alt text |
|---|---|---:|---|---|---|
| Slade reading context | `public/generated/slade-reading-context.webp` | 16:10 | `Editorial product photograph of a tablet used for reading a digital comic at night, clean dark desk, one subtle signal-orange desk object, controlled soft light, screen area kept simple for later compositing, no logos, no readable text, realistic photography` | Deep ink, restrained orange, quiet focus | `Tablet set up for focused digital comic reading on a dark desk.` |
| Slade library context | `public/generated/slade-library-context.webp` | 4:3 | `Organized collection of digital comic files represented through physical archival cases and one modern tablet, precise studio composition, true off-white background, signal-orange indexing tabs, realistic product photography, no logos, no readable text` | Bright studio, archival organization | `Comic archive and tablet arranged as an organized personal library.` |
| Broke Basket shopping context | `public/generated/broke-basket-shopping-context.webp` | 16:10 | `Hand holding a phone beside a grocery basket during an ordinary supermarket trip, practical candid framing, produce and shelf context, screen area kept neutral for later compositing, signal-orange detail, realistic photography, no logos, no readable text` | Everyday utility, not lifestyle advertising | `Phone used beside a grocery basket during a shopping trip.` |
| Broke Basket offline context | `public/generated/broke-basket-offline-context.webp` | 4:3 | `Grocery list notebook, calculator, receipt, and phone arranged on a checkout counter, precise overhead composition, true off-white and deep blue-black surfaces with a small signal-orange accent, realistic photography, no logos, no readable text` | Clear comparison between old tools and one phone | `Notebook, calculator, receipt, and phone arranged for grocery budgeting.` |

Generation rules:

- Use the image-generation tool, not CSS illustrations, for these raster placeholders.
- Inspect each generated asset before using it.
- Keep real UI screenshots readable and unaltered when compositing them over generated context imagery.
- Export web-appropriate dimensions and compression.
- If the generated asset is weaker than the real project media, omit it.

## Copy rules

- Preserve verified facts.
- Write in first person where Josef is describing his work.
- Use plain, specific language.
- Keep paragraphs short enough to scan.
- Button labels use a verb and object, such as `View selected work` or `Email Josef`.
- Links must make sense out of context.
- Do not use em dashes.
- Do not use marketing buzzwords such as seamless, world-class, cutting-edge, supercharge, transform, or game-changing.
- Do not use slogans shaped like "not just X, but Y."
- Do not repeat the heading in the first sentence beneath it.

## Prohibited design patterns

Do not ship any of the following:

- Invented employers, clients, responsibilities, outcomes, testimonials, awards, or metrics.
- Gradient text.
- Decorative glassmorphism.
- Generic gradient orbs or particle backgrounds.
- Repeated identical cards.
- Nested cards.
- Decorative section numbering.
- Tiny tracked uppercase labels above every heading.
- All-uppercase paragraph copy.
- Side-stripe accent borders.
- Wide soft shadows paired with 1px borders.
- Content-card radii above 16px.
- Custom cursors that reduce usability.
- Generic fade-up motion repeated on every section.
- Content hidden until JavaScript triggers a reveal.
- A blue basketball hero or any other literal copy of the reference.

## Accessibility requirements

- Target WCAG 2.2 AA.
- Use one `h1`, followed by a logical heading hierarchy.
- Use semantic `header`, `nav`, `main`, `section`, `article`, and `footer` elements.
- Give every section an accessible name and stable anchor ID.
- Include a keyboard-visible skip link.
- Maintain visible focus styles with at least 3:1 focus-indicator contrast.
- Do not communicate project categories or active states through color alone.
- Provide meaningful alt text for informative images and empty alt text for purely decorative media.
- Name icon-only controls with `aria-label`.
- Manage focus correctly in dialogs and return focus when they close.
- Make all controls keyboard operable.
- Ensure a minimum 44 by 44px touch target where practical.
- Pause or disable autoplaying media for reduced-motion users.

## Performance and metadata

- Use `next/image` with correct `sizes` and dimensions.
- Prioritize only true above-the-fold media. The type-led hero should not require a large raster LCP image.
- Lazy-load below-the-fold images and videos.
- Use video poster frames and `preload="metadata"` or `preload="none"` as appropriate.
- Avoid layout shifts by reserving media aspect ratios.
- Load Anybody and Atkinson Hyperlegible Next through `next/font` and expose them as CSS variables.
- Update metadata for a UI/UX Engineer portfolio, including title, description, canonical URL when known, and social preview metadata only when a real preview asset exists.
- Preserve a useful no-JavaScript reading order.

## Implementation sequence

1. Crawl and document the reference patterns.
2. Inspect repository content and assets.
3. Define portfolio data and factual placeholders.
4. Implement fonts, tokens, page shell, and semantic sections.
5. Implement featured-project media and experiments gallery.
6. Add navigation and accessible dialog/media behavior.
7. Add motion from the motion specification.
8. Add reduced-motion behavior.
9. Verify responsive layouts and content overflow.
10. Run checks, fix root causes, and visually inspect the final page.

Keep changes incremental. Preserve unrelated user edits and existing routes.

## Required checks

Run the available project checks after implementation:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm dev
```

There is currently no `test` script in `package.json`; do not pretend one ran. If implementation introduces testable utilities or components and adds a test runner, run the new test command as well.

Visually verify:

- Approximately 390px mobile.
- Approximately 768px tablet.
- 1280px desktop.
- 1440px wide desktop.
- Keyboard-only navigation.
- Reduced-motion mode.
- Hover-capable and touch-only behavior.

## Acceptance checklist

The task is complete only when all items below are true.

### Strategy and content

- The homepage reads as one coherent hiring narrative.
- Slade Comics and The Broke Basket have distinct, evidence-led stories.
- Repository facts are preserved.
- Unknown outcomes are marked or omitted, never invented.
- Experiments demonstrate range without overpowering featured work.
- Experience, skills, education, personality, and contact details are easy to find.

### Visual quality

- The page uses the signal-orange, true off-white, and deep-ink art direction.
- Anybody and Atkinson Hyperlegible Next are applied consistently.
- The hero is type-led, legible, and distinct from the reference.
- Spacing varies intentionally and does not collapse into repetitive card sections.
- Imagery is real project evidence first, with generated context imagery used only when it helps.

### Interaction and motion

- Navigation active states are accurate.
- All hover interactions have touch and keyboard equivalents.
- Media controls and dialogs are accessible.
- Motion is purposeful, smooth, and does not animate layout properties.
- Reduced-motion mode preserves content and functionality.

### Responsive and accessible

- No horizontal overflow or clipped hero words at the verified widths.
- Body text remains within a readable measure.
- Color contrast meets WCAG 2.2 AA.
- Focus states are visible.
- Heading hierarchy and landmarks are correct.
- Touch targets and dialogs work on mobile.

### Technical quality

- Lint, typecheck, and production build pass.
- No broken local media paths or contact links remain.
- Images and videos reserve dimensions and load responsibly.
- Metadata accurately describes Josef and does not claim unavailable assets.
- Existing secondary routes still resolve.

When the implementation is complete, summarize the changed behavior, list generated placeholder assets separately from real project assets, report check results exactly, and identify every remaining `[REPLACE WITH VERIFIED OUTCOME OR REMOVE]` marker.

## Portfolio refinements, September 2026

- Target: Web, existing Next.js App Router homepage. Preserve the current content and typography.
- Use the supplied `portfolio-favicon.png`; regenerate the app icon and multi-size ICO with `node scripts/build-favicon.mjs`. Preserve alpha.
- Playground uses the same `KineticGrid` as Ready and Contact, replacing dots. Keep the canvas behind the body and outside the carousel transform chain; it must never intercept pointer events.
- Testimonial hover/focus lifts the inner paper 4px and softens its tilt over 240ms. Pressing settles it slightly; reduced motion keeps it still. GSAP retains ownership of the outer card transform.
- Full recommendations open as centered paper notes using shared tint/ink tokens, tape outside the internal scroller, and the existing overlay accessibility behavior. Retain the selected quote and tint throughout exit.
- The hero's final role is exactly `a force wielder`.
- Verify all four tints, full text, keyboard and backdrop dismissal, focus restoration, mobile scrolling, carousel dragging, and responsive layouts. Run lint, typecheck, and build; there is no test script. If pnpm tries to reinstall the existing dependency tree, run the identical package scripts with npm.
