/**
 * Builds the case-study imagery from photographic and screenshot sources.
 *
 * Run with `node scripts/build-case-assets.mjs`. Re-runnable and idempotent.
 * `sharp` is already present as a Next.js dependency, so nothing extra installs.
 *
 * The handoff spec diagram is not here. A drawing's real source is the code that
 * makes it, so it lives in `scripts/build-agent-figures.mjs`. This script handles
 * binary sources only: photographs, screenshots and one screen recording.
 *
 * ANONYMISATION. Most case studies name their client by sector only, so every
 * source is audited for brand marks before it ships, and redaction happens in the
 * pixels. Never redact with a CSS overlay: the served file would still contain
 * the mark. Each job carries its own audit note below, because an audit covers
 * the files it actually examined and nothing else. Do not assume a new file
 * inherits a previous pass.
 *
 * "Most", not "every": work (03) is self-directed work on a public app and is
 * deliberately named. Its job note says so and says not to change it.
 *
 * TWO TOOLS, FOR TWO DIFFERENT PROBLEMS. `redact` fills a rect with the modal
 * colour sampled inside it, which is right for a line of text on an even ground
 * and leaves no trace. `blur` softens a whole region, which is the only
 * defensible way to clear a dense area whose every string cannot be enumerated,
 * and it is what work (04)'s engineering drawing needed. They are not
 * alternatives: blur does not defeat a logo, because a blurred wordmark is
 * still a recognisable shape, so marks get `redact` and dense text gets `blur`.
 * Layer both.
 */
import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  unlink,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

/* Matches the convention set by public/brain_rot_designs and public/hero_image.
   These are screenshots of flat UI, which AVIF handles well. */
const avif = { quality: 62, effort: 6 };

/**
 * BEFORE and AFTER labels, composited onto a comparison sheet.
 *
 * The six SM Cinema sheets distinguish their halves only by background colour,
 * split down the middle, which is not self-explanatory to someone seeing it for
 * the first time. Work (01)'s comparisons had labels composed into the artwork,
 * so this reproduces that convention rather than inventing a second one.
 *
 * Each label gets its own pill because the two halves have opposite luminance:
 * BEFORE sits on pale lavender and AFTER on deep blue, so one set of colours
 * cannot serve both. Dark-on-light left, light-on-dark right.
 *
 * The split is measured, not assumed: the midpoint of the actual width. Every
 * sheet in this set is 2560 wide and splits at 1280, but a re-export at another
 * size should still land the labels correctly.
 */
async function comparisonLabels(file) {
  const { width } = await sharp(file).metadata();
  const mid = Math.round(width / 2);
  const pad = 44;

  const pill = (x, text, dark) => {
    const w = 116;
    const h = 34;
    const bg = dark ? "rgba(12,12,20,0.72)" : "rgba(255,255,255,0.86)";
    const fg = dark ? "#ffffff" : "#14141c";
    return {
      input: Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
          `<rect width="${w}" height="${h}" fill="${bg}"/>` +
          `<text x="${w / 2}" y="${h / 2 + 5}" text-anchor="middle" ` +
          `font-family="Segoe UI, Helvetica Neue, Arial, sans-serif" ` +
          `font-size="14" font-weight="700" letter-spacing="2.4" fill="${fg}">` +
          `${text}</text></svg>`,
      ),
      left: x,
      top: pad,
    };
  };

  return [pill(pad, "BEFORE", false), pill(mid + pad, "AFTER", true)];
}

/**
 * One job per case study.
 *
 * `assets` are converted; `copies` are passed through byte for byte and are
 * resolved from the repo root rather than from `src`, so a job never has to
 * escape its own source folder with `../`.
 */
const JOBS = [
  {
    /**
     * The Playground's lightsaber training simulation.
     *
     * NOT A CASE STUDY, and the only Playground entry here: the other seven
     * Playground covers are already AVIF in public/brain_rot_designs and
     * public/personal_apps, published by an earlier pass and referenced by
     * src/content/experiments.ts. This one arrived as a raw PNG and a raw WEBM,
     * so it is the only one that needs converting.
     *
     * `src: "."` because both sources sit at the repo root rather than in a
     * capture folder. That matches work (01)'s recording, which is read from the
     * root the same way.
     *
     * AUDIT. Nothing to anonymise. This is the designer's own project on his own
     * deployment, and the artwork is a browser window over a rendered Star Wars
     * interior plus a phone showing the hilt controller. No client mark, no third
     * party, and the only legible URL in the frame is his own vercel.app
     * subdomain, which the Playground card links to anyway.
     */
    src: ".",
    out: path.join("public", "play", "lightsaber"),
    assets: [["lightsaber training.png", "cover.avif"]],
    /**
     * Copied through untouched: still no video encoder on this machine. At
     * 1.7 MB this one does not need re-encoding anyway, unlike work (01)'s
     * 20.6 MB flow and work (02)'s 4.5 MB handoff.
     */
    copies: [["Lightsaber Training Simulation.webm", "demo.webm"]],
  },
  {
    /**
     * The Playground's tennis tournament concept.
     *
     * Same situation as the lightsaber job above: the designer's own work,
     * arriving as a raw PNG at the repo root rather than as a published AVIF in
     * public/brain_rot_designs, so it is the one other Playground entry that
     * needs converting.
     *
     * TWO IMAGES, ONE PIECE, and they are not interchangeable. `cover.avif` is
     * the square one and goes on the card face, where the plate is roughly
     * square. `main.avif` is 1280x532 and goes in the viewer, which has the
     * width for it: it shows all four screens, the same two in light and dark
     * theme, which is the more interesting picture and unreadable at card size.
     *
     * AUDIT. Nothing to anonymise. A concept app with invented players and
     * invented tournaments; the only place name in it is a city.
     */
    src: ".",
    out: path.join("public", "play", "tennis"),
    assets: [
      ["tennis cover.png", "cover.avif"],
      ["tennis main image.png", "main.avif"],
    ],
    copies: [],
  },
  {
    /**
     * Work (04), the welding ERP prototype.
     *
     * ANONYMISED ON BOTH SIDES, which is why this job has more redactions than
     * any other. The designer's instruction of 2026-09-07 was to name neither
     * the client nor the product, so the sector-only treatment of works (01)
     * and (02) applies here too. Nothing in the case copy says "Headway",
     * "Headway ERP" or "Many Heads".
     *
     * AUDIT. Four composites at 2560x1064, audited at native resolution. Two
     * separate exposures, and they are not the same kind of thing:
     *
     *   1. THE ACCOUNT CHIP, in every window: "Admin" over
     *      "mtacio@headwayerp.com". The address is redacted in all seven
     *      windows it appears in. It is an email address, so it is PII, and it
     *      is also the only place the product name appears anywhere in the
     *      four images. One redaction covers both problems. "Admin", the MT
     *      avatar and "Send Invite" stay: a role label and two initials
     *      identify nobody.
     *
     *   2. A THIRD PARTY'S CONTROLLED DRAWING. The isometric loaded into the
     *      app is a real Santos LNG piping drawing: the title block carries the
     *      "Santos" wordmark and the LNG logo, and the sheet carries drawing
     *      number 411012-00495, line 50-1FD-19011-N0-N, drawing
     *      1U19-050-ISO-0141-1, a P&ID reference, an ISO file number, and
     *      in-drawing callouts holding a continuation number and SURVEY
     *      COORDINATES (Easting, Northing, elevation) that locate the plant.
     *      This is the client's client, not the client, and a portfolio is
     *      public. All of it goes.
     *
     *      The drawing appears at four different scales across the four
     *      composites, so each occurrence needed its own rects: the two
     *      windows in the annotation composite, the two project-list
     *      thumbnails, and the large angled window on the cover.
     *
     * WHY WHOLE CLUSTERS RATHER THAN ONE RECT PER STRING. The fill colour is
     * the modal colour sampled inside each rect, which is right for a line of
     * text on a flat ground. The LNG logo is a solid black box, so a rect drawn
     * tightly around it would sample black and paint a black square. A rect
     * covering the surrounding title-block cells is about 90% white paper, so
     * the mode is the paper and the whole cluster fills cleanly. Do not
     * "tighten" these rects onto the individual strings.
     *
     * WHAT STAYS, deliberately:
     *   - The sidebar logo glyph, an arrow driving into a weld bead. It is a
     *     mark with no wordmark and no text, and it identifies nobody who does
     *     not already know the company. Work (01) set the precedent of leaving
     *     an unreadable mark rather than blurring it.
     *   - The drawing FILENAME, "TP-09B_1U16-050_0328-1_016411-C_2_IFC.pdf",
     *     in the breadcrumbs and as both project-list card titles. It names no
     *     company, it is the same opaque string in every window, and redacting
     *     it would blank the breadcrumb and both card titles, which is most of
     *     what those screens are showing. RAISED for the designer rather than
     *     decided quietly.
     *   - The isometric geometry, the weld pins and the status legend. Those
     *     are what the screens are demonstrating.
     *   - The welder names in the allocation modal (Martin Torff, Miguel
     *     Alvarez, Ryan Carter and the rest) and "John Doe" in the profile.
     *     Placeholder data, not real people.
     *   - The address bars, which are empty in every window. No URL to leak.
     */
    src: "erp-system",
    out: path.join("public", "work", "welding-erp"),
    assets: [
      {
        from: "card-and-header.png",
        to: "cover.avif",
        redact: [
          /* The account chip, on the angled window. Only "mtacio" is in frame;
             the rest of the address runs off the right edge of the image. */
          { left: 2497, top: 274, width: 63, height: 27 },
          /* A continuation callout carrying a drawing number and the survey
             coordinates: Easting, Northing and elevation. */
          { left: 1313, top: 896, width: 160, height: 84 },
          /* A line number, reversed out of a solid black box. This rect samples
             black and fills black, which is the correct result here: it leaves
             the box and removes the text inside it. */
          { left: 1518, top: 914, width: 172, height: 44 },
        ],
        /* Four stepped rects rather than one, because the window is rotated
           about seven degrees and the drawing's top edge climbs to the right. A
           single rect tall enough to catch the top-right corner would also
           blur the toolbar, the search field and the "Drawing" tab, which are
           UI and stay sharp. The steps follow the slope and stop below it. */
        blur: [
          { left: 900, top: 620, width: 500, height: 444 },
          { left: 1400, top: 570, width: 400, height: 494 },
          { left: 1800, top: 500, width: 400, height: 564 },
          { left: 2200, top: 440, width: 360, height: 624 },
        ],
      },
      {
        from: "create project.png",
        to: "projects.avif",
        redact: [
          { left: 1294, top: 176, width: 138, height: 14 },
          { left: 2246, top: 150, width: 97, height: 11 },
          { left: 1996, top: 603, width: 121, height: 13 },
          /* Both drawing thumbnails. Small, but the wordmark and the logo are
             legible at native resolution, and native resolution is what the
             served file contains. The in-drawing callouts are not legible at
             this size and are left. */
          { left: 1248, top: 886, width: 96, height: 26 },
          { left: 1498, top: 886, width: 98, height: 26 },
        ],
        /* Both thumbnails, whole. Their text is 3px tall, so a lower sigma is
           already past legibility. */
        blur: [
          { left: 1140, top: 768, width: 208, height: 148, sigma: 4 },
          { left: 1388, top: 768, width: 210, height: 148, sigma: 4 },
        ],
      },
      {
        from: "drawing, weld, annotation.png",
        to: "annotate.avif",
        redact: [
          { left: 952, top: 273, width: 101, height: 12 },
          /* The title block in both windows. The left window is a scaled copy
             of the right, so the same cluster appears twice at two sizes. */
          { left: 612, top: 730, width: 316, height: 89 },
          { left: 1546, top: 733, width: 423, height: 112 },
          /* A boxed drawing number in the left half of the larger stamp,
             outside the cluster above. */
          { left: 1218, top: 811, width: 58, height: 18 },
        ],
        /* The drawing canvas in both windows, bounded so the app's own chrome
           stays sharp: the left rect stops short of the "Annotate" button at
           x 988, and the right stops short of the "Welds" tab at x 1985 and
           below the status legend, which ends at y 247.
           
           THE RIGHT WINDOW IS FOUR RECTS, NOT ONE, and the hole is deliberate.
           Annotate mode floats a toolbar over the canvas (eye, Weld, Note,
           zoom, Auto Fit) at x 1200-1270, y 434-728. One rect across the whole
           canvas blurred it too, which is a real loss: that toolbar is the
           annotation UI the figure exists to show. So the canvas is blurred
           around it, in a strip either side and a strip above and below. The
           toolbar itself is opaque, so the paper behind it needs nothing. */
        blur: [
          { left: 300, top: 350, width: 645, height: 492 },
          { left: 1160, top: 250, width: 40, height: 615 },
          { left: 1270, top: 250, width: 705, height: 615 },
          { left: 1200, top: 250, width: 70, height: 184 },
          { left: 1200, top: 728, width: 70, height: 137 },
        ],
      },
      {
        from: "bulk allocation.png",
        to: "allocate.avif",
        /* Tables only in this one: no drawing is on screen, so the account chip
           is the whole exposure. */
        redact: [
          { left: 1422, top: 188, width: 162, height: 18 },
          { left: 2293, top: 276, width: 101, height: 11 },
        ],
      },
    ],
    copies: [],
  },
  {
    /**
     * Work (01), the cafe ordering app.
     *
     * This used to slice and redact three original composite sheets. It no
     * longer does: the designer supplied purpose-made graphics, all 1280x532,
     * needing nothing but a format conversion.
     *
     * AUDIT. The originals needed two redactions: the store row on happy-path
     * screen 3, and a cup carrying the client's name in the same screen's
     * product grid. These four were audited at native resolution and are CLEAN:
     *   - cover-photo          uses the unbranded variant of the same cup photo
     *   - homepage comparison  the gift-bundle tin carries a mark, but it is
     *                          illegible even upscaled 4x, so it is left rather
     *                          than blurred
     *   - the-finding-image     generic copy only
     *   - checkout comparison  carries a store row in both phones reading "Store
     *                          Branch Gateway Mall 2 / Quezon City, Metro Manila,
     *                          PH", legible at native resolution. RAISED AND
     *                          CLEARED 2026-09-07: the designer's call is that the
     *                          mall is a landlord rather than the client, so a
     *                          branch location does not identify the cafe and the
     *                          row ships as it is. Do not "fix" this in a later
     *                          pass. Note it is a narrower rule than the one
     *                          applied to happy-path screen 3, where a store row
     *                          WAS redacted: that one carried the client's own
     *                          name, this one carries the mall's.
     */
    src: "food-bev-app",
    out: path.join("public", "work", "matcha-app"),
    assets: [
      ["cover-photo.png", "cover.avif"],
      ["the-finding-image.png", "finding.avif"],
      ["homepage comparison.png", "home-comparison.avif"],
      ["checkout comparison.png", "checkout-comparison.avif"],
    ],
    /**
     * Copied through untouched, because there is no video encoder on this
     * machine. It is 20.6 MB for 20.4s of 1920x1080 with no audio, roughly
     * 8 Mbps. Flat UI animation compresses far better than that, so this is
     * worth re-exporting: the same clip at 1280x720 and a sane bitrate should
     * land near 1-2 MB. Listed so the orphan sweep does not delete it.
     */
    copies: [["animation-flow-matcha.webm", "flow.webm"]],
  },
  {
    /**
     * Work (02), the design workflow.
     *
     * AUDIT. This case is company property and is anonymised harder than (01).
     * The lab's own chrome was checked and carries no agent, plugin or company
     * name, so the exposure is whatever sits INSIDE the prototype frame. These
     * four were audited at native resolution:
     *
     *   case-02-new-cover the render used for BOTH the work card and the case
     *                     header: a phone showing a generic project list, ringed by
     *                     glass folders of code files, glass documents and coral
     *                     puzzle pieces, matching the handover illustration. No
     *                     logos, no brand marks, no URL, no command string. The
     *                     small avatar in the mock UI is generated stock furniture,
     *                     not a real identifiable person.
     *                     UNUSED NOW: case-02-cover.png, a screenshot of a session
     *                     in a browser window, was the header until 2026-09-07, and
     *                     case-02-card-cover.png was the card before that. Both are
     *                     left in the captures folder, neither is published.
     *   tester-lab        the same session full-bleed. Carries only the lab's own
     *                     tester-facing copy. Kept as the reduced-motion still for
     *                     the demo below, and it is the cleaner of the two because
     *                     it has no screen-recorder toolbar in it.
     *   tester-lab-demo   56.2s screen recording of a whole session, replacing a
     *                     first take on 2026-09-07: starter question with the
     *                     prototype locked, a task with a mid-task question, the
     *                     ease rating, a what-got-in-your-way step with reasons
     *                     when the tester gives up, the closing rating, and a
     *                     captured session summary. No URL bar, no company or
     *                     plugin name, and the screen-recorder toolbar that was
     *                     visible throughout the first take is gone.
     *                     STILL OUTSTANDING: 56.2s is long for a silent autoplay
     *                     loop, and this file is 4.5 MB of the 7.7 MB of video the
     *                     case-study overlay pulls when it opens. A 15-20s cut
     *                     would carry the same argument. Raised, not actioned:
     *                     there is no video encoder on this machine.
     *   designer-lab      the authoring surface. Note the `/cut-version` string
     *                     in the lower right: it is a bare command carrying no
     *                     codename, so it is not a naming leak, but it is the one
     *                     internal string visible in any figure.
     *   handover-visual   a generated 3D illustration: a lone glass card reading
     *                     figma.com/file/... against a glass repo folder, DESIGN.md
     *                     and an opaque coral port-skill.md. No logos, no brand
     *                     marks, no real URL, no command string. Its near-black
     *                     ground is deliberate: it matches the #0d0d11 figure frame
     *                     so the render bleeds into it and the 1px border is the
     *                     only edge.
     *   case-02-motion    the port, one screen re-expressed in another stack. Only
     *                     public framework names appear, which is the point of the
     *                     figure. Track title and artist belong to the demo app.
     *
     * OPEN QUESTION FOR THE DESIGNER: the prototype is named "Cadence" and the
     * name is legible in all four. If that is a demo app, it ships as is. If it
     * is a real project name, it needs redacting in the pixels first.
     *
     * `handoff-still.jpg` is a frame lifted from the motion at 3.6s and exists
     * only as its reduced-motion fallback, so the two show the same thing. If the
     * motion is ever re-exported, re-cut this from it rather than leaving a still
     * of the old edit in place.
     */
    src: "design-agent-captures",
    out: path.join("public", "work", "design-agent"),
    assets: [
      /* One file, two uses: the work card and the case header both show this
         render. Published under a neutral name because it is no longer specific
         to either slot, and published once so the two cannot drift apart. */
      ["case-02-new-cover.png", "cover.avif"],
      ["designer-lab.png", "designer-lab.avif"],
      /* Cropped, not resized. The capture carries 403px of empty background to
         the right of the phone, a quarter of its width, which in the case study
         reads as a layout mistake rather than as breathing room. Measured: the
         last non-background column is 1127, so this keeps 48px past it. */
      [
        "tester-lab.png",
        "tester-lab.avif",
        { left: 0, top: 0, width: 1175, height: 725 },
      ],
      ["handoff-still.jpg", "handoff-still.avif"],
      ["handover-visual.png", "handover.avif"],
    ],
    /* Copied rather than converted: there is no video encoder here. 3.0 MB for
       7.5s at 1440x720, which is a reasonable rate for flat vector motion, so
       unlike work (01)'s clip this one does not need a re-export. */
    copies: [
      ["design-agent-captures/case-02-motion.webm", "handoff.webm"],
      ["design-agent-captures/tester-lab-demo.webm", "tester-lab.webm"],
    ],
    /**
     * The handoff spec template, offered as a download from the case study.
     *
     * The designer confirmed on 2026-09-07 that he has the right to publish it.
     * It is company property, so it is redacted here rather than copied
     * verbatim: the substitutions below are applied to the text, and then every
     * term in `forbid` is checked against the RESULT. The build fails rather
     * than shipping a leak, which is the whole reason a text file goes through
     * this script instead of being dropped into public/ by hand. If the template
     * is ever refreshed from the toolkit and reintroduces a name, this is what
     * catches it.
     *
     * Both redactions preserve the sentence's meaning. Neither removes a rule.
     */
    docs: [
      {
        from: "design-agent-captures/design-md-template.src.md",
        to: "design-md-template.md",
        redactions: [
          ["that session's TRACE.md", "your session log"],
          ["the growgu plugin", "the agent's own plugin"],
        ],
        forbid: ["growgu", "exd-toolkit", "superb", "yousource", "TRACE.md"],
      },
    ],
    /**
     * MUST STAY FALSE. This output directory has two owners: `spec.avif` is drawn
     * by `build-agent-figures.mjs` and everything else is converted here. A sweep
     * from either script would delete the other's files, and the two would erase
     * each other on alternate runs. Neither sweeps, so retiring a figure means
     * deleting it by hand, which is the price of the split.
     */
    sweep: false,
  },
  {
    /**
     * Work (03), the SM Cinema app redesign.
     *
     * NOT anonymised, and that is deliberate. The designer confirmed on
     * 2026-09-07 that this was self-directed work on a public consumer app, not
     * an engagement for SM, so the brand is named and its identity stays in the
     * screenshots. Do not "fix" this by scrubbing it to match works (01) and
     * (02): those are client work and this is not, and the difference is the
     * whole reason naming it is fair.
     *
     * AUDIT. Six comparison sheets at 2560x1064 plus a cover. Two pixel
     * operations are applied below and both are necessary:
     *
     *   1. REDACTION. Three occurrences of a real account name, captured from a
     *      signed-in session, in the BEFORE screens. It is the designer's own
     *      name rather than a third party's, so this is tidiness more than
     *      confidentiality, but the AFTER designs use a "John Doe" placeholder
     *      and a comparison that shows a real account on one side only reads as
     *      an oversight. Filled with the sampled local background, so the
     *      surrounding row survives and only the name goes.
     *
     *   2. BEFORE / AFTER LABELS. None of the six sheets carries them. The
     *      halves are distinguished only by background colour, split at x=1280,
     *      which is not self-explanatory to a first-time reader. Work (01)'s
     *      comparisons had labels composed in, so this matches that precedent
     *      rather than inventing a new convention.
     *
     * `header.png` IS published, as the case header, on the designer's
     * instruction of 2026-09-07. Recording the caveat rather than implying it was
     * cleared: its background photograph shows three identifiable people, and its
     * licensing is UNVERIFIED. The designer accepted that risk knowingly. If this
     * ever needs to come out, `cover-photo.png` does the same job with no faces
     * in it, and it is already published as the card cover.
     *
     * The one flaw left in place, on the designer's instruction: the AFTER
     * phones in the seat-selection sheet are clipped by the right edge of their
     * own canvas. It is the sheet carrying the headline finding, so a re-export
     * would be worth it if it ever becomes convenient.
     */
    src: "sm-cinema-app-redesign",
    out: path.join("public", "work", "sm-cinema"),
    assets: [
      /* The card cover. Reads at a glance, which is what a card needs. */
      { from: "cover-photo.png", to: "cover.avif" },
      /* The case header, once the case is open. Carries a composed
         "Redesigning SM Cinema" title over a photograph of a cinema audience. */
      { from: "header.png", to: "header.avif" },
      { from: "Signup Comparison.png", to: "signup.avif", labels: true },
      { from: "Homescreen comparison.png", to: "home.avif", labels: true },
      {
        from: "Movies & Movie Details Screen Comparison.png",
        to: "movies.avif",
        labels: true,
      },
      {
        from: "Seat Selection Comparison.png",
        to: "seats.avif",
        labels: true,
      },
      {
        from: "Snacks and Checkout.png",
        to: "checkout.avif",
        labels: true,
        /* "Your details" row on the BEFORE payment screen. */
        redact: [{ left: 690, top: 906, width: 220, height: 30 }],
      },
      {
        from: "other screens.png",
        to: "account.avif",
        labels: true,
        /* Under the avatar on both BEFORE account screens. The second sits
           beneath the dimmed More-menu overlay, so its background is darker
           than the first: each rect samples its own. */
        redact: [
          { left: 214, top: 396, width: 160, height: 32 },
          { left: 552, top: 396, width: 160, height: 32 },
        ],
      },
    ],
    copies: [],
  },
];

async function main() {
  /* A copy-pasted job that forgot to change `out` would make the sweep below
     delete the study it was cloned from, so the invariant is checked rather
     than trusted. Prefix pairs are rejected too: a nested output directory
     would be swept by its parent. */
  const outs = JOBS.map((job) => job.out);
  if (new Set(outs).size !== outs.length) {
    throw new Error("two jobs share an output directory");
  }
  for (const a of outs) {
    for (const b of outs) {
      if (a !== b && b.startsWith(a + path.sep)) {
        throw new Error(`output ${b} nests inside ${a}`);
      }
    }
  }

  for (const job of JOBS) {
    const { src, out, assets, copies } = job;
    await mkdir(out, { recursive: true });

    for (const entry of assets) {
      /* Two shapes, because works (01) and (02) predate the extra options and
         there is no reason to churn them: a [from, to, crop] tuple, or an object
         when a source needs redaction or composed labels. */
      const { from, to, crop, redact, labels, blur } = Array.isArray(entry)
        ? { from: entry[0], to: entry[1], crop: entry[2] }
        : entry;

      const img = sharp(path.join(src, from));
      if (crop) img.extract(crop);

      const overlays = [];

      /* Redaction, filled with the most frequent colour found INSIDE the rect.
         A rect drawn round a line of text is mostly background, so its modal
         colour is the background, and the fill matches whatever the text was
         sitting on with no offsets to get wrong.

         The first attempt sampled a patch just left of the rect instead. That is
         the obvious approach and it is wrong here: these names are centred under
         a centred avatar, so "just to the left" landed on the avatar graphic and
         painted a conspicuous blue block. Sampling inside is self-locating, and
         it handles the second account screen sitting under a dimmed overlay
         without needing to know that it is dimmed.

         A mean would not do: averaging dark text with light background yields a
         grey that matches neither. */
      for (const rect of redact ?? []) {
        const { data, info } = await sharp(path.join(src, from))
          .extract(rect)
          .raw()
          .toBuffer({ resolveWithObject: true });

        const tally = new Map();
        for (let i = 0; i < data.length; i += info.channels) {
          /* Quantised to 8 levels per channel, so antialiasing on the glyph
             edges collapses into its neighbours instead of splintering the
             count across hundreds of near-identical shades. */
          const key =
            ((data[i] >> 5) << 10) |
            ((data[i + 1] >> 5) << 5) |
            (data[i + 2] >> 5);
          tally.set(key, (tally.get(key) ?? 0) + 1);
        }
        let best = 0;
        let bestCount = -1;
        for (const [key, count] of tally) {
          if (count > bestCount) {
            bestCount = count;
            best = key;
          }
        }
        /* Average the real pixels in the winning bucket rather than
           reconstructing a colour from the bucket itself. Reconstruction turns
           pure white into 240 and leaves a faintly visible box on a white card;
           this returns the actual background value. */
        let sr = 0;
        let sg = 0;
        let sb = 0;
        let n = 0;
        for (let i = 0; i < data.length; i += info.channels) {
          const key =
            ((data[i] >> 5) << 10) |
            ((data[i + 1] >> 5) << 5) |
            (data[i + 2] >> 5);
          if (key !== best) continue;
          sr += data[i];
          sg += data[i + 1];
          sb += data[i + 2];
          n += 1;
        }
        const r = Math.round(sr / n);
        const g = Math.round(sg / n);
        const b = Math.round(sb / n);
        overlays.push({
          input: {
            create: {
              width: rect.width,
              height: rect.height,
              channels: 3,
              background: { r, g, b },
            },
          },
          left: rect.left,
          top: rect.top,
        });
      }

      if (labels)
        overlays.push(...(await comparisonLabels(path.join(src, from))));
      if (overlays.length) img.composite(overlays);

      /* ---- Blur, for the case a flat fill cannot handle -------------------
         `redact` paints a rect flat, which is right for a line of text on an
         even ground: it is unambiguous and it leaves no trace. It is the wrong
         tool for a dense region full of small text, because covering that means
         placing a rect around every string and then being unable to prove none
         was missed. Work (04)'s engineering drawing is exactly that: document
         references, pipe-spool numbers, legacy document numbers and survey
         coordinates scattered across the whole sheet at four different scales.
         One blur per drawing cannot miss a spot.

         USE BOTH, NOT ONE OR THE OTHER. Blur destroys small text but it does
         NOT reliably defeat a LOGO: a blurred wordmark is still a recognisable
         shape. So marks get a flat `redact` and dense text gets `blur`, and the
         two are layered.

         WHICH IS WHY THIS RUNS AFTER THE COMPOSITE, on the redacted result. The
         redaction sampler reads the ORIGINAL file; if blur did the same it
         would lift the unredacted pixels, blur them, and paste them back over
         the fills, quietly undoing every redaction underneath it. Blurring the
         composited buffer instead means a flat fill blurs to the same flat
         colour, which is a no-op, and nothing is resurrected. */
      if (blur?.length) {
        let buf = await img.toBuffer();
        for (const b of blur) {
          const rect = {
            left: b.left,
            top: b.top,
            width: b.width,
            height: b.height,
          };
          const patch = await sharp(buf)
            .extract(rect)
            .blur(b.sigma ?? 5)
            .toBuffer();
          buf = await sharp(buf)
            .composite([{ input: patch, left: rect.left, top: rect.top }])
            .toBuffer();
        }
        await sharp(buf).avif(avif).toFile(path.join(out, to));
      } else {
        await img.avif(avif).toFile(path.join(out, to));
      }
    }
    for (const [from, to] of copies) {
      await copyFile(from, path.join(out, to));
    }

    /* Text documents, redacted on the way through. Every redaction must actually
       match: a template that gets refreshed upstream could reword the line a
       substitution targets, which would leave the term in place and silently
       ship it. So a miss is a build failure, not a warning. */
    for (const doc of job.docs ?? []) {
      let text = await readFile(doc.from, "utf8");
      for (const [find, replace] of doc.redactions ?? []) {
        if (!text.includes(find)) {
          throw new Error(
            `${doc.to}: redaction target not found, so it cannot be applied: ${JSON.stringify(find)}`,
          );
        }
        text = text.split(find).join(replace);
      }
      /* The gate. Checked against the redacted result, case-insensitively,
         because this is the last thing standing between a private repo's file
         and a public download. */
      for (const term of doc.forbid ?? []) {
        if (text.toLowerCase().includes(term.toLowerCase())) {
          throw new Error(
            `${doc.to}: refusing to publish, still contains ${JSON.stringify(term)} after redaction`,
          );
        }
      }
      await writeFile(path.join(out, doc.to), text, "utf8");
      console.log(`  ${doc.to}  redacted and published`);
    }

    /* Sweep anything THIS job no longer produces, from ITS OWN directory, using
       a keep set built inside the loop. A set accumulated across jobs, or a
       shared output directory, would let one study delete another's files.
       Skipped entirely when a job produced nothing, so a mistyped `out` cannot
       empty an unrelated directory: work (02) currently produces nothing here,
       and its placeholders are owned by build-agent-figures.mjs. */
    const produced = assets.length + copies.length;
    if (produced === 0 || job.sweep === false) {
      console.log(
        `${out}: ${produced} file(s), sweep skipped (directory is co-owned)`,
      );
      continue;
    }

    /* Both entry shapes again. Getting this wrong is not a crash but a deletion:
       an object entry read as a tuple yields `undefined`, its real output name
       never enters `keep`, and the sweep below removes the file that was just
       written. */
    const outName = (e) => (Array.isArray(e) ? e[1] : e.to);
    const keep = new Set([...assets, ...copies].map(outName));
    for (const file of await readdir(out)) {
      if (!keep.has(file)) {
        await unlink(path.join(out, file));
        console.log(`  removed orphan ${file}`);
      }
    }
    console.log(`Wrote ${produced} files to ${out}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
