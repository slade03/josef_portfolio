# DESIGN.md

## How to read and edit this file

**Layout and spacing claims here must come from measured geometry — never from
a computed-style summary.**

That rule exists because the first version of this file broke it. It was a token
summary (colours, radii, font sizes) with no composition data, and a build made
from it got the palette right and the layout entirely wrong: a giant left-aligned
wordmark, a horizontal marquee, a 12-tile grid, and bottom-aligned card CTAs. None
of those are in the reference.

The worked example: this file used to specify a **234px hero wordmark**. The size
was real, but it belongs to the **footer**, not the hero — a fit-to-width wordmark
at `docY 5748`, 95% down the page, rect width 1297 inside a 1297 parent. The hero's
display step is **72px**. A measurement was taken correctly and then attached to the
wrong element, and a build inherited a 234px hero that exists nowhere on the
reference.

So a value alone is not a measurement. Record **where on the page it came from** —
which section, at what document offset — alongside the number and the viewport.
And discard anything read from a node whose rect is `0×0`: it is not laid out, and
its computed values describe nothing on screen.

## Provenance & scope

This describes the design system of an **external reference site**,
`https://www.xhulia.com/` (built in Framer), as measured at **1425px viewport**
(document height 6054px) and cross-checked at 667px. It is a teardown, not a
statement of Josef's own identity. Written copy is never documented here; examples
use placeholder text.

---

## 1. Direction

A light editorial page in three moves:

1. **A quiet, centred hero.** Small 16px greeting, a 72px ultralight italic serif
   statement, a 16px bold note. Centred on both axes in a full-viewport-height
   section. Nothing shouts.
2. **A scattered pill field.** Absolutely-positioned capability pills in mixed-case
   18px mono, in a band below the hero. Colour arrives here and nowhere else.
3. **A sticky card stack.** Project cards pin and fully replace one another, then a
   single centred folder holds the playground.

Colour strategy is **restrained**: tinted neutrals carry every surface; the eight
accents live almost entirely in the pill field.

---

## 2. Spacing

The backbone of the system, and the thing a token summary cannot capture.

Measured values, ordered by how often they appear on the page:

```
gaps       10(25×) · 8(10×) · 24(6×) · 4(5×) · 16(5×) · 12(5×) · 32(4×) · 6(4×) · 20(2×) · 26(1×)
structure  96 · 80 · 64 · 48 · 32
component  20 30 · 16 24 · 12 24 · 20 · 10 64
```

**10px is the most-used value on the page.** Not an oddity — the fine-grain
internal gap. The scale has 2px granularity at the small end (4/6/8/10/12) and 16px
steps at the structural end (32/48/64/80/96).

| Role | Values |
|---|---|
| Section vertical padding | 96 · 80 · 64 |
| Card text inset | `64px 64px 32px` (also `48px 48px 32px`) |
| Card outer | `0 0 80px` |
| Page gutter | 16px mobile → **64px** desktop |
| Component padding | `20px 30px` (pills) · `16px 24px` (nav) · `12px 24px` (buttons) · `24px` (folder) |
| Internal gaps | 4 · 6 · 8 · 10 · 12 · 16 · 20 |

Full padding patterns in use: `96px 16px 16px`, `16px 16px 64px`, `64px 16px 0`,
`64px 64px 32px`, `48px 48px 32px`, `48px 48px 0`, `0 0 80px`, `20px 30px`, `20px`,
`16px 24px`, `12px 24px`, `24px`, `10px 64px`.

Anything outside this set is off-system and should be treated as a bug.

---

## 3. Layout

### Hero

```
section    position: sticky · min-height ≈100vh · padding 96px 16px 16px
  └ inner  flex column · align-items:center · justify-content:center · gap 20px
      ├ greeting   "Hello" + name, side by side, 8px apart   h:36
      └ statement + note                                     h:306
```

Content measures **362px inside a 752px box**, so it sits centred with ~195px of
slack above and below. That is why the first line lands at y:291 rather than hard
against the 96px padding. The inner box must actually *fill* the section for this
to work: `min-height: 100%` does not resolve against a parent that only sets
`min-height`, so make the section a flex column and give the inner box `flex: 1`.

There are **no hero CTAs**.

### Page structure

xhulia.com: `hero (sticky) → pill field → sticky card stack → playground folder →
footer`. No work-intro section, no experience section on the home page.

**Currently built:** `hero → work rows → playground folder → footer`.

- The **sticky card stack was replaced** by the Work rows below (roshan-sahu.com).
- The **pill field is unmounted** — `constellation.tsx` and `content/pills.ts`
  remain on disk, unreferenced.
- The **footer wordmark** (234px, fit-to-width) is not built yet.

### Work rows

**Second provenance: `roshan-sahu.com`, measured at 1430px.** The sticky card stack
was replaced by this. Keep the two references distinguishable — the hero, pill field
and playground come from xhulia.com; the Work list comes from here.

**Rows are not fixed bands. 253px is the resting state**, and the expansion is the
whole effect.

| Property | Collapsed | Expanded |
|---|---|---|
| Row height | 253 | **649** |
| Media window | 691×**252** | 691×**648** |
| Inner frame offset | **−104** | **+94** |
| Info column x | 709 | 709 (never moves) |

| Property | Reference | Built |
|---|---|---|
| Pitch at rest | 253 — flush, zero gap | same |
| Media window | **full-bleed at x:0**, `overflow: hidden` | same |
| Gap to info column | 18px | 18px |
| Title | 56px / **300** / UPPERCASE / lh 1.15 | same, in Geist |
| Detail | **14px** / 300 / UPPERCASE / lh 16.1 | same |
| Bracket label | 12px, opacity 0.7, **inside the title row** | same, reads `[SOON]` |
| Ground | `#020108` near-black | light — not ported |

Because the list is full-bleed on the left, **it must not sit inside `.p-shell`**.

### The expansion

Continuously mapped to each row's scroll progress, and fully reversible: returning
to `scrollTop: 0` restores every row to collapsed. Measured progression —
`253/252/−104 → 300/299/−89 → 386/385/−48 → 540/539/+29 → 649/648/+94`.

**The reserved-height trick makes it safe.** The reference's section is 2592px at
all times while its rows sum to 2596px expanded: it reserves the expanded total up
front, and the collapsed rows leave trailing space that shrinks as they grow.
**Document height never changes**, so growing an in-flow row cannot jolt the scroll
position. Reproduced here via `--work-count` on `.p-work`.

Implementation notes worth keeping:

- **The view timeline must not live on the element being resized.** A ViewTimeline's
  progress depends on its subject's size, so animating that size feeds the subject
  back into its own driver. A fixed-height `.p-work__track` owns the timeline and
  renders nothing; the row declares `timeline-scope` so its siblings can reference
  it by name.
- **Only the media height is animated**; the row takes its height from it. Animating
  both risks the two drifting apart mid-travel.
- The parallax stays on `transform` because it can be. The height animation is a
  layout property, accepted here because it *is* the effect and the reserved
  container confines the reflow.

### Two mechanics that were the opposite of first impressions

- **The crop is parallax, not static.** An earlier pass recorded it as fixed at
  −104px; that reading had sampled only the collapsed rest state, where nothing
  moves. Across the row's travel the frame slides −104 → +94.
- **The cross-fade is hover-triggered, not autoplay.** Opacity held steady for 5.4s
  with no pointer input; the cycling first observed was caused by a synthetic
  `mouseenter` during testing.

Both errors came from measuring one state and generalising. Sample the whole
travel, not the resting frame.

Deliberate deviations:

- **The 0.5 dark scrim is not ported.** It exists in the reference to keep light
  text legible over imagery on a near-black page. Here the info sits in its own
  column, never over the image, so a scrim would only muddy the screenshots.
- **`[OPEN]` became `[SOON]`**, and stays a label rather than a control: there are
  no case-study routes, and a bracket that opens nothing is a lie.
- **The reference's Work section is not keyboard reachable** — zero links, buttons
  or `[tabindex]` inside it, and the image reveal is hover-only. Not replicated:
  every still is in the DOM with real alt text, so the cycle is an enhancement
  rather than the only way to see the work.
- **The role line needs a short label.** The reference's is `ROLE: WEB DESIGN &
  DEVELOPMENT`. Prose set uppercase at line-height 1.0 becomes a three-line wall,
  so `Project.roleShort` carries a one-line label while `role` keeps the full
  sentence for elsewhere.

Two values are parameterised because they are the ones most likely to need tuning:
`--work-row-h` and `--work-media-h`. The reference's 2.74:1 letterbox suits web
screenshots; these stills are 1080×1080 and 1920×1440 phone mockups, where the same
crop cuts the devices mid-body. That currently reads as a deliberate editorial band,
but the crop depth is one token if it stops working.

`--space-2-25: 18px` is off the main spacing scale and named deliberately: it is the
reference's measured gap (709 − 691), so it is recorded rather than rounded away.

### Nav

Three pills, centred as a cluster (427→998 in 1425, i.e. dead centre):

```
[56px square] 8px [442px links] 9px [56px yellow mail]
```

Radius 28px, padding `16px 24px`, `rgba(244,244,245,0.5)` + `blur(20px)`, no shadow.

### Playground

One centred folder, **286×238**, padding `24px`, on the card surface. Inside:
back/front panels at radius 16px, three images at radius 10px (102×102, 122×126,
160×121), interleaved with highlight layers, gap 26px. The images fan out. Section
padding `16px 16px 64px`, gap 12px.

Not a tile grid.

---

## 4. Typography

| Family | Role | Notes |
|---|---|---|
| Ultralight italic serif | Statement only | Reference uses PP Editorial New Ultralight Italic (paid). Bodoni Moda Italic is the open substitute; its variable range starts at 400, so w200 is unreachable — pin `opsz: 96` and let the didone contrast carry the light impression |
| `Geist` | Everything else | 400 and 700 |
| `Geist Mono` | Pill labels only | Not eyebrows |

### Scale

| Step | Size / weight | Line height | Tracking |
|---|---|---|---|
| Statement | **72px** / 200 (400 in Bodoni) italic | 79.2px (1.1) | −2.16px (−0.03em) |
| Section heading | 28px / 600 | 30.8px (1.1) | −1.12px (−0.04em) |
| Pill label | **18px** mono / 400, **mixed case** | **18px (1.0)** | normal |
| Body | 16px / 400 | 24px (1.5) | normal |
| Body bold | 16px / 700 | 24px (1.5) | normal |
| Body small | 15px / 400 | 22.5px (1.5) | normal |
| Eyebrow / label | **14px Geist / 400, mixed case** | 18.2px (1.3) | **normal** |

### Weights (measured)

Weight is where hierarchy actually lives here, and it is easy to get wrong in the
heavy direction.

| Element | Value |
|---|---|
| Hero note | **16px / 400**, muted `#52525B`, centred |
| Buttons | **16px / 400** |
| Nav links | **18px / 400** |
| Section label / eyebrow | 14px / 400, mixed case |
| Pill label | 18px mono / 400, mixed case |
| Section heading | 28px / 600 |
| Footer wordmark | 234px / 200, fit-to-width |

**The reference never bolds a whole block.** Where it emphasises, it bolds two or
three phrases *inside* muted body text, and those phrases stay muted (`#71717A`) —
emphasis by weight alone, never by weight plus a jump to full ink. A fully-bold note
at full ink is the failure mode this replaced.

Body copy sits at 400. Reserve 600 for section headings and 700 for the card title.
Nothing at caption scale should carry 500 or above.

### Other corrections to earlier versions of this file

- The eyebrow is **14px Geist regular**, not 13px mono uppercase at 0.08em. That
  mono treatment belongs to the pill labels, at 18px.
- `−0.04em` applies to Geist headings. At 72px it would be −2.88px and collide
  glyphs; the statement uses **−0.03em**.
- The hero statement holds **two authored lines, one line box each**, from 768px up.
  A character-capped measure (`22ch`) against 72px type breaks it into six lines.
  Below 768px it must be free to wrap.

---

## 5. Colour

Tailwind-Zinc-like neutrals on a warm-white ground, plus eight accents.

### Surfaces and ink

| Role | Hex | OKLCH |
|---|---|---|
| Ground (warm) | `#FFFEFD` | `oklch(0.9975 0.0017 67.8)` |
| Ground (flat) | `#FAFAFA` | `oklch(0.9851 0 0)` |
| Card | `#FFFFFF` | `oklch(1 0 0)` |
| Line / subtle fill | `#F4F4F5` | `oklch(0.9674 0.0013 286.4)` |
| Ink | `#09090B` | `oklch(0.1408 0.0044 285.8)` |
| Ink strong | `#18181B` | `oklch(0.2103 0.0059 285.9)` |
| Ink secondary | `#27272A` | `oklch(0.2739 0.0055 286.0)` |
| Ink muted | `#52525B` | `oklch(0.4419 0.0146 285.8)` |
| Ink muted (common) | `#71717A` | `oklch(0.5517 0.0138 285.9)` |
| Hairline (never text) | `#A1A1AA` | `oklch(0.7118 0.0129 286.1)` |

Every neutral sits at hue ~286 (cool blue-violet); the ground tips warm to ~68.
That split is what stops the page reading as flat greyscale.

### Accents

| Name | Hex | OKLCH |
|---|---|---|
| Yellow (identity) | `#FDCF00` | `oklch(0.8691 0.1779 92.5)` |
| Orange | `#FF894A` | `oklch(0.7496 0.1625 46.8)` |
| Lavender | `#D9C9FF` | `oklch(0.8667 0.0756 298.4)` |
| Sky | `#A3D9FF` | `oklch(0.8611 0.0769 239.5)` |
| Pink | `#FBCFE8` | `oklch(0.8994 0.0589 343.2)` |
| Mint | `#5ADBA5` | `oklch(0.8051 0.1388 162.8)` |
| Lime | `#D9F99D` | `oklch(0.9382 0.1157 121.8)` |
| Zinc (breather) | `#F4F4F5` | `oklch(0.9674 0.0013 286.4)` |

Yellow is the identity colour and the only accent in the nav. Zinc appears in the
pill field as a deliberate neutral breather.

**Measured contrast against the three darkest inks:**

| Accent | `#09090B` | `#18181B` | `#52525B` |
|---|---|---|---|
| yellow | 13.36 | 11.90 | 5.19 |
| orange | 8.46 | 7.53 | **3.29 fail** |
| lavender | 13.03 | 11.60 | 5.06 |
| sky | 13.19 | 11.75 | 5.13 |
| pink | 14.39 | 12.82 | 5.59 |
| mint | 11.47 | 10.22 | **4.46 fail** |
| lime | 17.04 | 15.18 | 6.62 |
| zinc | 18.10 | 16.12 | 7.03 |

So: **accent surfaces hard-set `--color-ink`.** Enforce it in CSS rather than
leaving it to per-component discipline, or a muted colour will eventually be
inherited onto orange or mint and fail.

---

## 6. Shape

| Token | Value | Applied to |
|---|---|---|
| Default | **24px** | most surfaces |
| Card top | `48px 48px 0 0` (32px mobile) | stacked project cards |
| Nav | 28px | nav pill and its 56px buttons (half of 56) |
| Button | 100px | CTAs |
| Pill | 999px (circles) · 116px (labelled) | pill field |
| Folder | 16px panels · 10px images | playground |
| Small | 8px · 10px | inline chips, media |

**One border treatment site-wide: `2px solid #F4F4F5`.** No second weight, no
second colour, no side-stripe accents.

That border is **1.06:1 on white and fails WCAG SC 1.4.11**, so it is a soft edge
only — never a state or boundary indicator. Focus rings and form-field affordances
must use ink.

---

## 7. Motion

The reference has **one** `@keyframes` rule and it is Framer's loading spinner, not
a design animation. Everything else is transform-driven.

- **Sticky stack.** Siblings at `position: sticky; top: 0`; the last child
  `relative` to release. No ancestor may set `overflow` (any axis), `contain:
  paint/content/strict`, or `content-visibility` — each silently makes sticky a
  no-op. Cards must be *direct* children; a wrapper makes each card sticky within
  its own wrapper instead. `display` must stay `block`.
- **Pill field.** Static. Each pill is absolutely positioned with its own
  transform; the measured rotation is ~0.085°, i.e. axis-aligned. No animation, no
  marquee, no JavaScript.
- **Folder fan.** Transform on hover *and* focus, so it is keyboard-reachable.
- Ease-out exponential curves only (quart / quint / expo). No bounce, no elastic.
  Never animate a layout property — `font-variation-settings` counts as one, since
  it re-shapes the glyph run every frame.

### Reduced motion (required)

- **Pill field** linearises to a static centred wrap: `position: static`, rotation
  zeroed, unlabelled circles hidden so decoration doesn't read as empty list items.
- **Stack** falls back to normal flow — `position: static; top: auto`. `relative`
  alone leaves `top` applying.
- **Folder** renders already fanned, transition removed. Nothing important may sit
  behind a hover state.

---

## 8. Implementation notes

Next.js + Tailwind v4, as configured here.

- **`next/font` variables are scoped to `<body>`'s className, not `:root`.** A
  `:root`-level `@theme` alias referencing one silently fails to resolve and the
  font falls back. Rebind the families on the page-scope class, inside body scope.
- **Lightning CSS prunes a declaration if you hand-write its `-webkit-` twin.**
  Write only the unprefixed property and let it add prefixes. This cost the nav
  `backdrop-filter` an entire pass.
- **`overflow-x: hidden` on `<body>` breaks the sticky stack** exactly as
  `overflow: clip` does. Contain horizontal overflow at its source, and keep that
  container a *sibling* of the stack.
- **The dev server serves stale CSS after rapid edits.** A computed style showing a
  declaration you already replaced means the bundle is stale, not that your CSS is
  wrong. Stop the server, `rm -rf .next`, restart.
- **`--radius-md` in the legacy `@theme inline` block resolves to −2px**
  (`calc(0rem - 2px)`), so `var(--radius-md, 16px)` never reaches its fallback. Use
  literals until that block is removed.
- The blurred nav is load-bearing, not decorative: it is the only separation device
  between the nav and the display type and pill colour passing beneath it. Give it a
  border for forced-colors mode and an `@supports` fallback to an opaque fill.
