/**
 * Builds the diagrams for case (02), the design workflow.
 *
 * Run: node scripts/build-agent-figures.mjs
 *
 * CURRENTLY DORMANT. It produces nothing: every figure in case (02) is now a
 * real capture, a screen recording, or a supplied illustration, all handled by
 * `build-case-assets.mjs`. The one drawing this file made, a DESIGN.md excerpt,
 * was retired when the handoff chapter took the handover illustration instead.
 *
 * It is kept rather than deleted because a drawing's real source is the code
 * that makes it, and that code is cheap to keep and reversible in one line. See
 * the RETIRED note in main(). Delete the file outright only if the case stops
 * wanting drawn figures at all.
 *
 * ANONYMISATION. Case (02) is company property. Nothing here may name the agent,
 * the plugin it ships in, the company, or any client prototype, and no real
 * command string may appear: the real invocations carry the codename in their
 * prefix. Step names are generic on purpose. Source maps ship comments, so this
 * applies to the comments too.
 *
 * KEEP THESE SIMPLE. An earlier version of this file drew a two-track diagram
 * with five numbered gates and a five-way decision fan, plus a ten-row audit
 * table. The case study was cut from six chapters to three because it was three
 * times the length of case (01), and the figures went with it. A diagram here
 * supports one sentence. If one starts needing a legend to decode, it has
 * outgrown its job.
 *
 * Fonts: rasterised by sharp through its SVG renderer, which resolves system
 * fonts only, so these use a system sans rather than the site's own faces. A
 * diagram is an illustration; the alternative was embedding a font per figure.
 */

import { mkdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const OUT = path.join("public", "work", "design-agent");

/* Pulled from `src/app/globals.css`. Square corners and hairline rules
   everywhere, because that is what the rest of the site does: there is exactly
   one box-shadow in the stylesheet and it belongs to a 3D carousel face. */
const C = {
  paper: "#f4f2ed",
  panel: "#faf8f4",
  ink: "#1c1a17",
  muted: "#7d766a",
  line: "#ddd7ca",
  coral: "#ff5b3a",
  indigo: "#6c6ef0",
};

const FONT = "Segoe UI, Helvetica Neue, Arial, sans-serif";
const MONO = "Consolas, Menlo, monospace";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const text = (x, y, s, o = {}) =>
  `<text x="${x}" y="${y}" font-family="${o.mono ? MONO : FONT}" font-size="${o.size ?? 15}" font-weight="${o.weight ?? 400}" fill="${o.fill ?? C.ink}" text-anchor="${o.anchor ?? "start"}" letter-spacing="${o.ls ?? 0}">${esc(s)}</text>`;

const rect = (x, y, w, h, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.fill ?? C.panel}" stroke="${o.stroke ?? C.line}" stroke-width="${o.sw ?? 1}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;

const line = (x1, y1, x2, y2, o = {}) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.stroke ?? C.line}" stroke-width="${o.sw ?? 1}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;

const frame = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
  `<rect width="${w}" height="${h}" fill="${C.paper}"/>${body}</svg>`;

/* ==========================================================================
   What the developer receives
   ========================================================================== */

function spec() {
  const W = 1280;
  const H = 470;
  const ROW = 28;
  let s = "";

  s += text(48, 46, "THE HANDOFF SPEC", { size: 13, weight: 700, ls: 1.5 });
  s += text(
    226,
    46,
    "every value resolved, and pointing at the code it mirrors",
    {
      size: 13,
      fill: C.muted,
    },
  );

  s += rect(48, 66, W - 96, 300, { fill: C.panel });

  /* Illustrative values, not lifted from any real project's spec. The shape is
     the subject: a resolved value, then a note naming where it came from. */
  const rows = [
    ["colors:", "", ""],
    ["  surface:", '"oklch(0.98 0.01 95)"', "# mirrors --background"],
    ["  accent:", '"oklch(0.72 0.16 55)"', "# mirrors --primary"],
    ["typography:", "", ""],
    ["  fontFamily:", '"Inter Tight"', "# loaded in app/layout.tsx"],
    ["  body:", "{ size: 15, weight: 400 }", "# mirrors --text-base"],
    ["  heading:", "{ size: 28, weight: 600 }", "# no dedicated variable,"],
    ["", "", "#   copied from page-title.tsx"],
    ["spacing:", "", ""],
    ["  baseUnit:", "4", "# every gap is a multiple"],
  ];

  let y = 98;
  for (const [key, value, comment] of rows) {
    /* Indentation has to be an x offset: an SVG renderer collapses whitespace
       inside <text>, which flattened the nesting and made every key look like a
       top-level one. */
    const depth = key.length - key.trimStart().length;
    if (key)
      s += text(72 + depth * 9, y, key.trim(), {
        size: 15,
        mono: true,
        fill: depth === 0 ? C.ink : "#3a352d",
      });
    if (value)
      s += text(258, y, value, { size: 15, mono: true, fill: C.indigo });
    if (comment)
      s += text(600, y, comment, { size: 14, mono: true, fill: C.muted });
    y += ROW;
  }

  /* The honest blank, marked. It is the rule people delete first. */
  s += rect(592, 98 + 6 * ROW - 19, 470, 50, {
    fill: "none",
    stroke: C.coral,
    dash: "4 3",
  });
  s += text(1062, 98 + 6 * ROW + 46, "no variable to point at, so it says so", {
    size: 13,
    anchor: "end",
    fill: C.coral,
  });

  /* The quarantine line: everything framework-specific lives below it. */
  s += line(48, 394, W - 48, 394, { stroke: C.ink, sw: 1.5 });
  s += text(48, 424, "## Stack Implementation", {
    size: 16,
    weight: 700,
    mono: true,
  });
  s += text(
    48,
    448,
    "The only section naming a framework. Everything above reads on any stack.",
    { size: 14, fill: C.muted },
  );

  return { name: "spec.avif", w: W, h: H, svg: frame(W, H, s) };
}

/* ========================================================================== */

async function main() {
  await mkdir(OUT, { recursive: true });
  /* RETIRED, not deleted. The handoff chapter dropped this excerpt when the
     designer supplied a 3D illustration of the handover: the illustration names
     all three deliverables, where the excerpt only detailed one of them, and
     carrying both put three figures in one chapter. The drawing code below is
     kept because it is cheap and reversible: move spec back into `figures` and
     re-add a CaseShot pointing at spec.avif to bring it back. */
  const RETIRED = [spec];
  void RETIRED;

  const figures = [];

  const names = new Set(figures.map((f) => f.name));
  if (names.size !== figures.length) throw new Error("duplicate figure name");

  for (const f of figures) {
    await sharp(Buffer.from(f.svg))
      .resize(f.w, f.h)
      .avif({ quality: 68, effort: 6 })
      .toFile(path.join(OUT, f.name));
    console.log(`  ${f.name}  ${f.w}x${f.h}`);
  }

  /* NO SWEEP, deliberately. This directory is co-owned with
     `build-case-assets.mjs`, which converts every other file in it, so a sweep
     keyed on this script's own outputs would delete all of them on each run.
     That matters more now that this list is empty: a sweep here would empty the
     whole directory. Retiring a figure means deleting its file by hand. */

  console.log(`Wrote ${figures.length} figure to ${OUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
