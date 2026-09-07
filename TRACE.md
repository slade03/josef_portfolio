# Trace — josef_portfolio · layout + spacing correction · 2026-08-25

- **Goal:** Correct the portfolio's layout and spacing to xhulia.com's actual
  composition — centred 72px italic-serif hero, scattered pill field, top-right
  card CTAs on 64px gutters, folder-fan playground — and rewrite `DESIGN.md` from
  verbatim geometry so the spec stops misleading the next build.

- **What was decided:**
  - Content is out of scope this pass. Layout and spacing only.
  - **Bodoni Moda Italic** carries the 72px statement (open substitute for the paid
    PP Editorial New Ultralight Italic). Its variable range starts at 400, so the
    reference's w200 is unreachable; `opsz: 96` plus didone contrast carries the
    light impression.
  - Home page cut to the reference structure: hero → pill field → sticky stack →
    playground folder → footer. Experience content lives only on `/about`.
  - Card anatomy stripped to the reference's sparse form. Deeper per-project
    material is deferred to a future case-study route.
  - Card CTA renders as the reference's own **disabled** variant, since no
    case-study routes exist yet. Better than a link that goes nowhere.

- **Why:** The first renovation built from a *token summary* of the reference, so
  the palette landed and the composition did not. The correction was to audit on
  geometry (`getBoundingClientRect` / `getComputedStyle` against laid-out nodes)
  rather than on computed-style aggregates.

- **What was produced:**
  - `DESIGN.md` — rewritten from measured geometry; now opens with the
    measure-don't-summarise rule and the 234px phantom as its worked example.
  - `src/app/globals.css` — real spacing scale (4/6/8/10/12/16/20/24/30/32/48/64/80/96),
    centred full-height hero, 14px Geist eyebrow, 18px mono pill, `.p-constellation`
    replacing `.p-marquee*`, ladder removed, 64px gutter, `64px 64px 32px` card text,
    folder styles, reduced-motion rules.
  - `src/content/pills.ts` (replaces `marquee.ts`), `Pill` type with `x`/`y`/`shape`.
  - `src/components/site/constellation/constellation.tsx` — static, no JS.
  - `src/components/site/playground/folder.tsx` — fan + dialog.
  - Rewritten: `hero/kinetic-hero.tsx`, `projects/project-card.tsx`,
    `projects/project-stack.tsx`, `app/page.tsx`, `app/layout.tsx`, `content/nav.ts`.
  - **Deleted:** `hero/hero-width.tsx`, `marquee/`, `experiments/`,
    `projects/project-video.tsx`.

- **What surprised us:**
  - **The 234px hero wordmark never existed.** It was measured from a node with a
    `0×0` rect. The real display step is 72px. The first pass flagged it as
    unreliable and built on it anyway — the single most expensive error of the two
    sessions.
  - **The "marquee" is not a marquee.** Every pill is absolutely positioned with its
    own transform and `animation: none`. The rotation is ~0.085°, i.e. none. Replacing
    a CSS animation with static positioning *removed* code.
  - **The eyebrow token was on the wrong element.** 13px mono uppercase at 0.08em
    described nothing on the page; the real eyebrow is 14px Geist regular, and the
    mono treatment belongs to pill labels at 18px.
  - **The playground is one folder, not a grid.**
  - **10px is the most-used spacing value on the reference** (25 occurrences). The
    first pass treated it as an oddity and omitted 4/6/8/12/48/64/96 entirely.
  - **Stale CSS cost real debugging time twice.** A computed style showing
    `min-height: 828px` — a declaration already replaced by `height` — was the
    bundle, not the stylesheet. `rm -rf .next` + restart fixed it.
  - Deleting `hero-width.tsx` removed a client component *and* a layout-property
    animation. Higher fidelity meant less code, not more.

- **Stack used:** Next.js 16.1.6 (Turbopack), React 19.2.3, Tailwind v4, TypeScript.
  Fonts via `next/font/google`: Bodoni Moda, Geist, Geist Mono, Anybody.

- **Impeccable skills used:** `impeccable` (brand register) for the build posture;
  the audit followed `reference/rebuild-fidelity-audits.md`.

- **Self-eval score:** not run (`/exd-toolkit:critique` not invoked this session —
  verification was geometry-diff against the reference instead, which is the sharper
  signal for a fidelity task).

- **Independent KPI pass:** n/a — not filed against a KPI'd task.

- **Human corrections:** 4 — (1) DESIGN.md should hold the xhulia spec despite the
  PRODUCT.md conflict; (2) proceed without a git safety net; (3) the build missed the
  reference's layout entirely, focus on layout not content; (4) consider spacing
  properly and ignore repo content.

- **Time to first preview:** ~25 min from goal confirmation to a verified geometry
  diff (build gates at each phase).

- **Verification results:** `pnpm typecheck` and `pnpm build` clean; `pnpm lint` has
  0 errors in new code (all 32 are pre-existing, 10 of 11 files on the deferred
  teardown list). Geometry at 1425px: statement `72px Bodoni Moda italic / lh 79.2px
  / ls −2.16px / opsz 96`; hero `sticky, 900px, padding 96/16/16`, slack 78 above and
  below; eyebrow `14px Geist, mixed case`; pill `18px Geist Mono, lh 18px, absolute`;
  card `height 828 = pitch 828`, all `top: 0`, last `relative`; card text
  `64px 64px 32px`; gutter 64px; CTA top and right edges flush with the eyebrow row
  and gutter; folder `x:570, w:286` (reference 570/286); zero sticky-breaking
  ancestors; sticky pin verified by direct `scrollTop` assignment. Contrast measured
  for all 8 accents × 3 inks.

- **Promote to knowledge/?** **Blocked, not skipped.** The only growgu tree
  reachable from this machine is the installed plugin *cache*
  (`~/.claude/plugins/cache/superb/exd-toolkit/0.6.0`), which is not a git repo and
  sits beside a superseded `0.5.0`. Writing there is writable but not durable — the
  next plugin update discards it, while appearing to have promoted. Needs the path
  to the real growgu source repo.

  Captured durably in the meantime: the project-scoped version of learning #1 is now
  the opening section of this repo's `DESIGN.md` ("How to read and edit this file"),
  which is the file a future build actually loads.

  The two items to promote, generalised, once a durable target exists:
  1. **Audit geometry, not computed-style aggregates.** A per-element
     `getComputedStyle` sweep yields a token summary that is good enough to build
     from and useless for fidelity. Composition lives in
     `getBoundingClientRect` + flex/grid alignment + per-element padding. Always
     record the measured viewport.
  2. **Discard any measurement from a node whose rect is `0×0`.** It is not laid
     out, and its computed values describe nothing on screen. This produced a
     phantom 234px display size that survived into a shipped build because it was
     labelled "unreliable" instead of discarded.

  (Both are situational depth for porting/fidelity work, not every-session rules —
  so `reference/`, per the librarian rule, with the existing INDEX line already
  covering the file.)

- **DLP check:** confirmed **yes** — no secrets, keys, or `.env` content in this
  trace or the promotion. Nothing was pushed or deployed. The repo does contain the
  portfolio owner's public contact details in `src/content/profile.ts` (intentionally
  public, unchanged this session, tier: Internal); the promotion text above is fully
  abstracted and names no client, metric, or person.

- **Still outstanding, deliberately deferred:** the teardown — ~7,130 lines of dead
  code (`src/components/ui/`, `src/components/portfolio/`, orphaned components),
  legacy `scenario-1`/`scenario-2`/`info` routes, the final `globals.css` collapse,
  dependency pruning, and renaming the package off `endofday`. Also: the two demo
  `.webm` files are now unreferenced after the card was simplified, and nothing is
  committed — the working tree is still the only copy (a plain-file backup sits in
  the session scratchpad).
