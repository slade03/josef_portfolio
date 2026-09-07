---
name: [Product Name]
description: [One sentence — personality + visual approach. Force it with a scene sentence first: who uses this, where, in what light, in what mood — a specific enough scene that it forces a palette/mood decision, not a generic label that leaves the decision open.]

# ---------------------------------------------------------------------------
# Everything below this line is RESOLVED VALUES ONLY — real numbers, real hex/
# oklch, real font names. Never a Tailwind utility class (`gap-2`, `text-sm`),
# never a `components.json` style name. That stack-specific detail belongs
# only in the "Stack Implementation" block at the bottom of this frontmatter
# and the matching body section — nowhere else. This split is what lets this
# file be read by someone building on a completely different stack without
# needing to filter out framework noise from the actual design truth.
#
# Every value below must carry a comment naming what it mirrors. Most
# dimensions map onto a real CSS custom property — name it. A dimension that
# genuinely has no per-role variable in the source (this happens — check
# each dimension independently, don't assume one implies another, per
# rebuild-fidelity-audits.md's per-dimension token rule) gets an honest
# "no dedicated variable — copied verbatim from [file]" instead. Either is a
# real comment; a purely descriptive one ("what it's for") is not — that
# belongs in the body sections below, not here. This file documents the live
# code; it is not an invented palette written ahead of implementation.
# ---------------------------------------------------------------------------

colors:
  # [token-name]: "[hex or oklch]"   # mirrors --[css-variable-name] in [file]
  # Group logically as you go (brand/accent, surface, hairline/border, text,
  # semantic) — the body's Colors section below re-groups these for humans,
  # but the frontmatter itself is just a flat, complete list.

typography:
  fontFamily: "[font], [fallback stack]"   # mirrors --font-[name] in [file],
                                            # or "no dedicated variable"
  # [role-name]:                  # e.g. stat, subtitle, title, body, label, micro
  #   fontSize: "[value]"         # mirrors --[css-variable] in [file], or
  #                                 "no dedicated variable" (typography roles
  #                                 are often composed from several plain
  #                                 declarations rather than one token — say so
  #                                 if that's the case here, don't invent one)
  #   fontWeight: [value]
  #   lineHeight: [value or "per-component" if the code sets it per-instance
  #                rather than per-role — see the Typography section's note
  #                on only documenting what's actually implemented]
  #   letterSpacing: [value]
  #   use: "[one line: what this role is for, and roughly how often it
  #          should appear per screen if that's a real constraint]"

rounded:
  # [tier-name]: "[value]"   # mirrors --[css-variable] in [file], or "no
  #                             dedicated variable"; then what it's for

spacing:
  # [tier-name]: "[value]"   # mirrors --[css-variable] in [file], or "no
  #                             dedicated variable"; then what relationship
  #                             this tier represents (icon-to-label,
  #                             within-a-row, between-cards, ...)

icon:
  # [tier-name]: "[value]"   # mirrors --[css-variable] in [file], or "no
  #                             dedicated variable"

motion:
  # [tier-name]: "[duration] [easing]"   # mirrors --[css-variable]/a motion
  #                                        constant in [file], or "no
  #                                        dedicated variable"; e.g. "150ms
  #                                        ease-out" — then what kind of
  #                                        interaction this tier covers
  #                                        (hover/press feedback, panel
  #                                        open/close, ...) — see the Motion
  #                                        & Feedback section below for the
  #                                        full role table and directional
  #                                        rules.

components:
  # [component-name]:
  #   backgroundColor: "{colors.[token]}"
  #   textColor: "{colors.[token]}"
  #   typography: "{typography.[role]}"
  #   rounded: "{rounded.[tier]}"
  #   padding: "[value]"
  #   minHeight/height: "[value]"
  # Reference other frontmatter values with {token.path} — never restate a
  # raw number here that's already named above.

stack:
  # componentsJsonStyle: "[e.g. new-york]"
  # baseColor: "[shadcn base color preset, e.g. zinc]"
  # primitives: ["[shadcn components/ui/* in use]"]
  # blocks: ["[registry blocks pulled in, if any]"]
---

<!-- This file documents the live code — it does not precede it. The source of
     truth is always the actual CSS/token file named in the comments above; if
     this file and the code ever disagree, the code is right and this file is
     stale. Regenerate the disagreeing section, don't edit around it.

     THIS IS A LIVING DOCUMENT. It gets written once at project setup, but the
     real design decisions mostly happen later — across every layout/typeset/
     colorize/animate/onboard/polish/harden/adapt pass that follows. Whenever
     one of those passes changes anything documented here — a colour or token,
     typography, spacing, a radius, elevation, motion, a breakpoint, or a
     component and its empty/loading/error states — update the matching
     section in the same session, before moving on. Don't defer it to a
     separate cleanup pass — by the time one happens, nobody remembers which
     values were real decisions and which were typos.

     If a decision here gets reversed later, record the change and why in
     your session log ("What was decided" / "Why") — this file only
     ever reflects the current, live system, never its history. -->

# Design System: [Product Name]

## 1. Overview

**[Creative north star, one memorable phrase]**

[2-4 sentences: what carries the visual energy (photography? a single accent
color? typographic weight contrast? something else?), and what the system
deliberately does NOT lean on.]

[If the product brief named anti-references (generic patterns to avoid), restate
them here as a rejection list — this is often the fastest way to make the
positive direction legible.]

**Key Characteristics:**
- [3-6 bullets, each one concrete fact a reader can act on — not "looks clean,"
  but "the accent color appears only for primary action, confirmation, and
  positive status; nothing else."]

## 2. Colors

Group by role, not by hue — a reader should be able to find "what do I use for
a disabled state" without knowing the hex first.

### Brand & Accent
- **[Token]** (`{colors.[token]}` — `[hex]`): [where it's used, and — if it's
  the kind of accent that should stay rare — say so explicitly.]

### Surface
- **[Token]**: [page floor, card, elevated surface, etc.]

### Hairlines & Borders
- **[Token]**: [dividers, outlines]

### Text
- **[Token]**: [primary text, secondary/muted text, on-brand text]

### Semantic
- **[Token]**: [error, warning, success, info — and whether color alone ever
  carries the meaning, or whether it's always paired with text/icon]

### Named Rules
State any rule that generalizes past a single instance, and give it a name so
later sections (and later sessions) can reference it by name instead of
re-explaining it. Example shape: **"The [X] Has a Job Rule."** [Statement of
the rule.] Only write rules that are actually true of the system as built —
don't pre-invent constraints the code doesn't follow yet.

## 3. Typography

**Font Family:** [name], falling back to [stack].

[One short paragraph on the voice: is hierarchy carried mostly by size, mostly
by weight, or some specific combination? State it as a rule, not a vibe —
e.g. "weight carries most of the hierarchy; the same size legitimately
appears at three different weights in different places."]

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.[role]}` | | | | | |

Fill in **Line Height** and **Letter Spacing** only with what the code
actually sets. If the codebase never sets an explicit line-height (letting the
browser/framework default apply), write "browser default — not set per role"
rather than inventing a number; a number here that isn't real will get copied
into a native port as a literal `height:` value and create the exact
divergence this file exists to prevent.

### Principles
[The 2-3 rules that make the hierarchy predictable — e.g. a fixed weight pair
for display vs. body, a tracking rule for all-caps labels, a rule about which
sizes may repeat at different weights.]

### Note on Font Substitutes
[If the primary typeface requires a license/isn't guaranteed available on
every target: name the closest open-source substitute and any adjustment
needed (tracking, line-height) to preserve proportions. If the font is
already open/universal, write "N/A — [font] is freely available."]

## 4. Layout & One Base Unit

### One Base Unit
State the single primitive scale that spacing, radius, and icon size all
derive from (e.g. "every value is a multiple of Npx"). If they currently do
NOT share one scale, say so honestly and treat unifying them as a known
improvement rather than claiming a derivation that isn't real yet.

### Spacing System
| Tier | Value | Use |
|---|---|---|
| `{spacing.[tier]}` | | |

**Rhythm tiers** — name the relationship each tier represents, and state the
decision rule explicitly:

| Tier | Value | Use |
|---|---|---|
| Tight | | Icon-to-label pairs, a value and its unit |
| Grouped | | Related elements within one control or row |
| Sectioned | | Between distinct fields, cards, or list items |
| Separated | | Between major page sections |

**When building a new component or screen:** pick the rhythm tier that
matches the *relationship* between the elements, not a value that "looks
about right." Confirm the resulting number is on the base-unit grid before
shipping it.

### Grid & Container
[Max content width, column structure, how card grids reduce columns across
breakpoints.]

### Whitespace Philosophy
[One short paragraph — what carries visual weight so whitespace doesn't have
to: photography, density, something else?]

## 5. Elevation

| Level | Treatment | Use |
|---|---|---|
| | | |

### Named Rules
[e.g. "The Surface-First Rule": if a divider, tint, or spacing change can
clarify hierarchy, use that before reaching for a shadow.]

## 6. Shapes / Border Radius

| Token | Value | Use |
|---|---|---|
| `{rounded.[tier]}` | | |

### Named Rules
State the decision procedure for picking a radius tier on a new element —
model this on a real, working example: *"Full circular/pill radius is
reserved for: [exhaustive list]. Everything else uses a scale tier instead,
chosen by [the deciding factor — height? role?]. When in doubt: [the one
question that resolves it]."*

## 7. Components

For each component already built, state which Named Rule(s) govern it — this
is what makes the rules load-bearing instead of decorative.

**`[component-name]`** — [background, text, typography, radius, padding,
height/min-height — reference tokens, not raw numbers]. Governed by [Named
Rule], because [one clause].

<!-- Empty, loading, and error states are components too — document each one
     below, or state explicitly that a given surface has no empty/error case.
     These are the states that get silently skipped because they aren't the
     "main" screen; treat a missing one as a gap, not a fine-to-leave-implicit
     omission. Default shapes to document against, unless this product
     deliberately departs from them:
       - Empty: icon or simple illustration, a headline naming the actual
         condition (not "Nothing here"), one line of supporting copy, and a
         CTA only if there's a real next action.
       - Loading: whether it's a skeleton matching the real content's shape or
         a spinner, and which motion tier (§10) it uses.
       - Error: what recovers it, and whether colour alone ever carries the
         meaning or it's always paired with text.
     Delete this comment once the states below are filled in. -->

## 8. Building a New Component

This section answers "I need something that doesn't exist yet — what values
do I use?" It has to work for **any** new element, not just small interactive
controls — a layout panel and a form field go through the same questions;
they just don't all apply every time. Skip a step only when it genuinely
doesn't apply, and say so.

1. **Find the nearest existing analog first.** Check §7 — does an existing
   component already cover most of this need, a variant away? Reuse its
   tokens wholesale before deriving anything new.
2. **Typography role** (if it carries text) — which row of the Hierarchy
   table (§3) matches its content's weight/prominence?
3. **Color role** (if it has a background/text/border) — which group in §2
   governs its default state and any others (hover, disabled, error)? Never
   introduce a new color; pick from what's already named.
4. **Spacing rhythm** — apply the rhythm-tier decision rule (§4) to every
   internal gap and outer margin this element needs. This applies as much to
   a layout panel's internal padding as to a button's icon-label gap.
5. **Sizing** — a minimum tap target if it's interactive; a width/breakpoint
   behavior if it's a layout container instead.
6. **Radius** (only if it has visible corners) — apply the radius decision
   procedure (§6).
7. **Icon size** (only if it carries an icon) — pick by the icon's role
   (embedded in a badge, inline next to text, or its own tap target), not by
   habit.
8. **Elevation** (only if it needs to visually separate from siblings) —
   apply the Surface-First rule (§5) before reaching for a shadow.
9. **Motion** (only if it enters/exits or gives interaction feedback) — pick
   a duration/easing tier from §10's role table by what kind of change this
   is, not by feel. If it's a stack push/pop or modal present/dismiss, apply
   §10's directional-consistency rule too.
10. **Grid-compliance check** — confirm every numeric value landed on is a
    real step in the base-unit scale (§4). If nothing fits, that's a signal
    to reconsider the sizing, not a reason to invent an off-grid value.

## 9. Responsive Behavior

<!-- Required for every project. If this product is genuinely single-viewport
     (e.g. a fixed-viewport mobile app), don't delete this section — replace
     the table with one explicit line: "N/A — single [WxH] viewport, no
     breakpoints." A blank or missing section should never be mistaken for an
     oversight. Delete this comment once filled in. -->

| Name | Width | Key Changes |
|---|---|---|

### Touch Targets
[Minimum tap-target size, and which components meet/exceed it.]

### Collapsing Strategy
[How nav, grids, and multi-column layouts behave across the breakpoints
above — reduce columns vs. reflow, what collapses to a sheet/drawer, etc.]

## 10. Motion & Feedback

Covers two different things: **timing** (how long, what easing) and
**direction** (what motion communicates about where the user is). Both are
routinely skipped when documenting a design system — don't skip them here.
This is exactly the kind of thing that gets silently reinvented or dropped
during a cross-stack port if it's never written down.

### Duration & Easing

| Tier | Value | Use |
|---|---|---|
| `{motion.[tier]}` | | |

Name each tier by the *kind* of change it covers, not just fast/slow — e.g.
"hover/press feedback," "panel open/close," "page/route transition." A
reader should be able to pick a tier from what's happening, the same way the
spacing rhythm table (§4) is picked by relationship, not by a number that
"looks right."

### Interaction Feedback

[State what happens, concretely, for each of: press/tap response (scale?
opacity? a ripple?), a loading state (spinner? skeleton? which motion
tier?), a toast/snackbar's enter and exit, and any error/success
micro-animation. If a state doesn't exist yet in this product, say so — see
§8's "find the nearest analog" step for what a *new* one should reuse.]

### Navigational Orientation

State the rule(s) that let a user sense *where they are* — going deeper into
a flow vs. backing out of one — from motion alone, independent of any label
or breadcrumb. Model this on a real, working example: *"Forward navigation
(pushing into a flow) slides new content in from [direction] while the
previous screen [behavior]; back navigation exactly reverses it. Modals/
sheets always rise from [edge] and dismiss by reversing. Tab/peer
switches use [cross-fade / no transition] — never a directional slide, since
tabs aren't a stack and a slide would falsely imply one is deeper than the
other."* Give this a name (e.g. "The Directional Consistency Rule") so §8
can reference it instead of re-explaining it per component.

### Reduced Motion
[State whether/how the system respects `prefers-reduced-motion` — e.g. "falls
back to an instant cut or a cross-fade, never removes the state change
entirely." If this hasn't been decided yet, say so explicitly rather than
leaving it unaddressed.]

## 11. Do's and Don'ts

### Do
- [Concrete, checkable — "use `{spacing.section}` between major bands," not
  "use good spacing."]

### Don't
- [Concrete, checkable — ideally tied back to a Named Rule above.]

## 12. Stack Implementation

The one place framework-specific detail lives. Everything above this section
is meant to survive a move to a different stack unchanged; everything below
is specific to how this prototype happens to be built today.

- **`components.json` style:** `{stack.componentsJsonStyle}`
- **Base color:** `{stack.baseColor}`
- **Primitives in use:** `{stack.primitives}`
- **Registry blocks in use:** `{stack.blocks}`
- [Any other framework-specific note — e.g. which values are Tailwind utility
  classes vs. arbitrary values, if that distinction matters for this project.]

---

## Self-check

Two tiers, checked at two different moments. **Don't apply Tier 2 before the
build** — §7's component inventory and §10's interaction rules describe things
that don't exist yet at project setup, and the only ways to "pass" early are
to block the build or invent values, both of which are worse than an honest
blank.

### Tier 1 — foundation (at project setup, before building)

Everything here is answerable from the brief and the design-system setup
alone, so it's checkable the moment this file is first written.

- [ ] Every frontmatter value has a comment naming the real source it mirrors.
- [ ] No Tailwind class name or `components.json` term appears anywhere
      outside the "Stack Implementation" block.
- [ ] Typography's Hierarchy table has a filled-in **Use** column for every row.
- [ ] §4 names one base unit that spacing/radius/icon size all derive from
      (or honestly states they don't yet).
- [ ] §4 includes a rhythm-tier table with a stated decision rule.
- [ ] §6 includes a radius decision procedure, not just a value table.
- [ ] §9 (Responsive Behavior) is either a real breakpoint table or an
      explicit "N/A — single viewport" line — never blank. (The viewport and
      breakpoint strategy is a setup-time decision, not a build outcome.)
- [ ] **Nothing in this file points outside the project folder.** No path into
      the agent's own plugin, no "see the template," no reference only resolvable on
      the machine that generated this. A developer holding only this one file
      must be able to follow every statement in it.

### Tier 2 — completeness (before handing this to a developer)

These describe what actually got built, so they're only meaningful once it
exists. This is the bar at ready-for-dev, not at setup.

- [ ] §7 documents every component built, including its empty, loading, and
      error states — or explicitly states a given surface has none.
- [ ] §8 ("Building a New Component") covers more than buttons/interactive
      controls — it should read as usable for a layout element too.
- [ ] §10 (Motion & Feedback) names its duration/easing tiers by what kind of
      change they cover, not just fast/slow.
- [ ] §10 states a directional-consistency rule for navigation (or explicitly
      says one doesn't exist yet) — this should never be silently blank.
- [ ] Every instructional HTML comment from the template has been deleted —
      what's left is the design system itself, not guidance on writing one.
