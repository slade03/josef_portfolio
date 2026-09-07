/**
 * The case studies behind the work cards.
 *
 * These live here rather than in ./index.ts because they are the longest content
 * in the project by an order of magnitude, and because a `Work` now points at one
 * directly. `index.ts` imports the study values; nothing here imports `index.ts`,
 * so the dependency runs one way and there is no cycle.
 *
 * ANONYMISATION. Four studies, THREE different treatments, and the difference is
 * not an inconsistency to tidy up:
 *
 *   (01) (02) (04)  client or company work. The client is named by sector only,
 *                   and where a brand mark appears in a source image it is
 *                   removed from the PIXELS by scripts/build-case-assets.mjs.
 *   (03)            self-directed work on a public consumer app. There is no
 *                   client to protect, so the brand is named in the copy and
 *                   kept in the screenshots. Its job note and its study comment
 *                   both say "do not fix this to match the others".
 *
 * Never hide a mark under a CSS overlay: an overlay leaves it in the file that
 * actually gets served. And note that work (04) needed something stronger than
 * redaction, because the drawing inside it belongs to the client's client and a
 * dense engineering sheet cannot be scrubbed reliably rect by rect. Its canvas
 * is blurred as well as redacted. See that job's audit note.
 */

export interface CaseFact {
  label: string;
  value: string;
}

/**
 * One chapter.
 *
 * `figures` is absent on prose-only chapters. The component renders
 * `block.figures?.map(...)`, so adding or removing figures is content-only work.
 * The renderer prints `body` before the figures unconditionally, so a chapter that
 * carries figures still needs one: keep it to a sentence or two and put the real
 * explanation in each shot's `note`, under the image it belongs to.
 */
export interface CaseBlock {
  id: string;
  nav: string;
  heading: string;
  body: string;
  figures?: CaseShot[];
  /**
   * An artifact the reader can take away, rendered after the figures.
   *
   * Same-origin only, and it must be a file this site is entitled to hand out.
   * The one in use is a redacted copy produced by `scripts/build-case-assets.mjs`,
   * which fails the build if a withheld name survives the redaction. Do not point
   * this at a raw source file.
   */
  download?: { href: string; label: string; meta?: string };
}

export interface CaseStudy {
  title: string;
  chip: { client: string; role: string };
  statement: string;
  /**
   * A substring of `statement`, lifted to full weight. Rendering falls back to
   * plain text when it no longer matches, so a copy edit can soften the emphasis
   * but can never break the paragraph.
   */
  emphasis: string;
  facts: CaseFact[];
  hero: CaseShot;
  /** Must not be empty: `blocks[0].id` seeds the chapter scroll spy. */
  blocks: CaseBlock[];
}

/**
 * One figure in the case study. Dimensions are the real intrinsic size.
 *
 * There is deliberately no layout discriminator. An earlier version carried
 * `single | pair | wide`, because the before/after shots were separate phone crops
 * needing a two-up grid, and the happy path was a 5895px sheet needing its own
 * horizontal scroller. Both are gone: the comparisons are now single graphics with
 * BEFORE/AFTER composed into them, and the strip was dropped. One shape is enough.
 */
export interface CaseShot {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** A short muted line naming what the image shows. */
  caption?: string;
  /**
   * A full explanation belonging to this image specifically, set at body size and
   * measure. Use it where a chapter covers more than one change: a single block of
   * prose above two figures makes the reader hold both explanations in their head
   * and match them up by guesswork.
   */
  note?: string;
  /**
   * An animated version of this figure. When set, it plays instead of the still,
   * and `src` becomes the reduced-motion fallback rather than dead weight: the
   * two must therefore show the same thing, so nobody loses content by preferring
   * less motion.
   */
  video?: string;
}

/**
 * The case study behind work (01).
 *
 * The client is identified by sector only, deliberately — the trading name is not
 * used here and has been redacted out of the screenshots themselves by
 * `scripts/build-case-assets.mjs`.
 *
 * FACTUAL INTEGRITY. Every figure below comes from the usability report: three
 * participants, six tasks, the 1-5 severity scale and its wording, task 3's 2.33
 * average, and P3's score of 4. The redesign has NOT been re-tested, so there is no
 * before/after metric anywhere in this copy and none may be added without a second
 * study to support it. See PRODUCT.md, "Preserve factual integrity".
 */
export const matchaCase: CaseStudy = {
  title: "Pickup or delivery, made obvious",

  chip: { client: "Food & beverage", role: "UI/UX Engineer" },

  statement:
    "Usability research on a café ordering app, and a redesign built on its worst finding: the app never asked whether you wanted pickup, or delivery.",
  emphasis: "the app never asked",

  facts: [
    { label: "Role", value: "UI/UX Engineer" },
    { label: "Method", value: "Moderated think-aloud" },
    { label: "Scope", value: "3 participants, 6 tasks" },
    { label: "Year", value: "2026" },
  ],

  hero: {
    src: "/work/matcha-app/cover.avif",
    alt: "Three phones showing the café ordering app: the menu on the delivery tab, the home screen, and checkout.",
    width: 1280,
    height: 532,
    video: "/work/matcha-app/flow.webm",
  },

  blocks: [
    {
      id: "brief",
      nav: "The brief",
      heading: "A café app and six things to try",
      body: "A specialty matcha café chain wanted to know how first-time users handled its ordering app, from signing up to placing an order.",
    },
    {
      id: "method",
      nav: "How we tested",
      heading: "Say what you are thinking",
      body: "Narrating as you work is the difference between knowing a task went badly and knowing why. Tasks scored 1 to 5, where 1 is smooth and 5 is giving up. A 4 means real difficulty: hints needed, frustration shown.",
    },
    {
      id: "finding",
      nav: "The finding",
      heading: "One severity 4, and an average that hides it",
      body: "Ordering averaged 2.33. Two participants moved through cleanly. P3 scored a 4, the highest single score in the study. She went straight past the Pick Up tab on the way in, her eye landing on the products underneath it, and by checkout could no longer tell which mode she was on. Switching meant going back to the menu, which forced a workaround.",
      figures: [
        {
          src: "/work/matcha-app/finding.avif",
          alt: "Two screens side by side. On the menu, a Delivery and Pick Up tab row sits above a grid of large product photographs. On checkout, a small pale green pill reading Delivery sits beside the item count, with no control to change it.",
          width: 1280,
          height: 532,
          caption: "Menu and checkout, as tested",
          note: "The tabs are not the failure here. They are labelled, reasonably placed, and P3 did use them later to correct herself. But a row of small text sits directly above a grid of large product photography, and photography wins that contest. Attention goes where the visual weight is, and on a menu screen that is always going to be the food.",
        },
      ],
    },
    {
      id: "redesign",
      nav: "The redesign",
      heading: "Ask first, and let it be changed later",
      body: "The app decided fulfilment somewhere the user was not looking, then would not let it be corrected where it mattered.",
      figures: [
        {
          src: "/work/matcha-app/home-comparison.avif",
          alt: "Home before and after, side by side. Before, the loyalty tier runs straight into the Discover More carousel with no fulfilment choice on the screen. After, two illustrated cards reading Delivery and Pickup sit between them.",
          width: 1280,
          height: 532,
          caption: "Home, before and after",
          note: "Home now opens on the question, before a single product is browsed. People arrive already knowing: you decide whether you are collecting or having it sent long before you decide what to order. Asking first is not an extra step, it is the one they had already taken.",
        },
        {
          src: "/work/matcha-app/checkout-comparison.avif",
          alt: "Checkout before and after, side by side. Before, a small pale Delivery pill sits beside the item count. After, a full-width segmented control offers Delivery and Pick Up, with Delivery selected, above a tappable voucher field.",
          width: 1280,
          height: 532,
          caption: "Checkout, before and after",
          note: "The pill becomes a control. Both options stay visible with the active one marked, so the mode is legible at the point of commitment and changeable there, not something you back out of the flow to fix.",
        },
      ],
    },
    {
      id: "next",
      nav: "What's next",
      heading: "Not re-tested yet",
      body: "There is no before-and-after number here, and inventing one would be worse than going without. The next study re-runs the same task on the same scale, watching one behaviour: whether anyone still reaches for the menu tabs. If that stops, the fix worked.",
    },
  ],
};

/**
 * The case study behind work (02).
 *
 * ANONYMISATION. This is company property, so the agent, the plugin it ships in,
 * the company, and the client prototypes built with it are all withheld. It is
 * "a design agent" throughout, and no command string appears anywhere: the real
 * invocations carry the codename in their prefix. Note that source maps ship
 * code comments, so the same rule applies to this comment.
 *
 * THE SPEED CLAIM. "About a week, now two or three days" is the designer's own
 * estimate from working this way. There is no before-and-after study behind it,
 * which is why it is written as a sentence about his experience and not as a
 * statistic: no percentage, no multiplier, nothing in the `facts` table, and no
 * chart. A number in a stat slot reads as measured. Keep it in prose, or take it
 * out. See PRODUCT.md, "Preserve factual integrity".
 *
 * ROLE, AND A DISCLOSURE THAT WAS DELIBERATELY REMOVED. The `facts` table used
 * to read "Contributor, not sole author", and this comment used to require it.
 * On the designer's instruction it now reads "UI/UX Engineer", like the other
 * three studies, and the trade was named to him before he chose it.
 *
 * Recorded rather than quietly dropped, because the gap is easy to mistake for
 * an oversight. He was one of several contributors to the agent, and after the
 * change nothing on the page says so: "contributor", "sole", "alone" and "team"
 * appear nowhere in the copy below, and `facts` was the only place it was ever
 * stated.
 *
 * NOTHING IN THE COPY IS FALSE AS A RESULT, which is why no prose needed
 * changing with it. The statement describes what the workflow does to a build's
 * timeline and claims no authorship in either direction. So the position now is
 * that ownership is simply not addressed.
 *
 * WHICH MEANS: adding any ownership claim to this study would be making a new
 * claim, not restoring an old one. And re-adding the contributor line would be
 * reversing a decision rather than fixing a bug. Either way, ask first.
 *
 * An earlier draft of this ran to six chapters and 1124 words arguing a thesis
 * about AI output being plausible before it is correct. It was three times the
 * length of case (01) and buried the three things worth saying, which are the
 * three chapters below.
 */
export const agentCase: CaseStudy = {
  title: "From brief to dev-ready in days",

  chip: { client: "Internal design tooling", role: "UI/UX Engineer" },

  /* "Built around an AI agent" describes the workflow. It does NOT say he built
     the agent, and it must not be edited into saying so: the contributor
     disclosure was removed from `facts` on the designer's instruction, so an
     ownership claim here would be a new claim rather than a restored one. */
  statement:
    "An internal design workflow built around an AI agent: brief in, tested prototype and developer handoff out. What took about a week now lands in two or three days.",
  emphasis: "two or three days",

  facts: [
    { label: "Role", value: "UI/UX Engineer" },
    { label: "Method", value: "Claude plugin design agent" },
    { label: "Scope", value: "Prototype, test, hand off" },
    { label: "Year", value: "2026" },
  ],

  hero: {
    src: "/work/design-agent/cover.avif",
    alt: "A phone showing a project list, surrounded by floating glass folders of code files, glass documents and coral puzzle pieces.",
    width: 1930,
    height: 815,
  },

  blocks: [
    {
      id: "prototype",
      nav: "Prototype",
      heading: "Working screens, not a deck",
      body: "A design agent packaged as a Claude plugin does the building, and what comes back is an interactive prototype in real code rather than a flat mockup. A build that used to take about a week now lands in two or three days.",
      figures: [
        {
          src: "/work/design-agent/designer-lab.avif",
          alt: "The authoring workspace. A list of flows on the left, the prototype running in a phone frame in the middle, and a panel on the right holding the scenario and the four steps of the flow.",
          width: 1527,
          height: 722,
          caption:
            "The workspace: flows on the left, the live prototype in the middle",
          note: "Each flow in the sidebar is a job someone came to do. The panel on the right holds the scenario it belongs to and the steps it should take, so the prototype and the reason for it sit on one screen. Reviewing something that runs beats reviewing a picture of it, because half the problems only appear once you can tap them.",
        },
      ],
    },
    {
      id: "test",
      nav: "Testing",
      heading: "Early feedback from a link you send",
      body: "Share a link and people run the flow on their own time. What they answered and where they went lands in your own database, Claude reads the results back, and the next version starts from what it found.",
      figures: [
        {
          src: "/work/design-agent/tester-lab.avif",
          video: "/work/design-agent/tester-lab.webm",
          alt: "A whole test session. A starter question with the prototype locked behind it, then a task reading Play something for tonight while the prototype unlocks beside it, a question asking what made them choose it, an ease rating, a step asking what got in the way when they give up, and a closing summary listing each task with its time and whether it was finished or abandoned.",
          width: 1175,
          height: 725,
          caption: "A whole session: one task at a time, then what it recorded",
          note: "One task at a time, always starting at the home screen, so you find out whether they can reach the thing at all. Nothing is added to the prototype to collect it, so what gets tested is what was built. It closes on a summary of each task, finished or abandoned, and when someone gives up it asks what got in the way, so a failure arrives with its reason attached.",
        },
      ],
    },
    {
      id: "handoff",
      nav: "Handoff",
      heading: "The developer gets the repo, the spec and a port skill",
      body: "What changes hands is the prototype repository itself: the running code, a DESIGN.md of values and the rules they follow, and a port skill that rebuilds a screen from it inside the project's own codebase.",
      figures: [
        {
          src: "/work/design-agent/handover.avif",
          alt: "Two sides. On the left, alone, a single card reading figma.com/file/... On the right, three objects: a folder of code files labelled Prototype repo, a document labelled DESIGN.md, and a puzzle piece labelled port-skill.md.",
          width: 1930,
          height: 815,
          caption: "What used to change hands, and what does now",
          note: "A link left every value to be read off a canvas. DESIGN.md carries both halves: the values, and the rules they follow. Spacing runs off one base unit with named rhythm tiers, typography is ranked with a rule per role, and motion is tiered by the kind of change it describes. So a component that was never in the prototype can still be derived rather than invented.",
        },
        {
          src: "/work/design-agent/handoff-still.avif",
          video: "/work/design-agent/handoff.webm",
          alt: "The same Now Playing screen twice. On the left the web prototype, on the right the same screen rebuilt in Flutter, with the steps between them reading reading tokens, mapping states, resolving layout, building widgets.",
          width: 1440,
          height: 720,
          caption: "The same screen, rebuilt in the production stack",
          note: "Run inside the target project: /port [source] [scope]. It reads the prototype repo for the screen itself and DESIGN.md for the values and rules, then proposes a plan before writing anything. Once agreed it rebuilds that screen in the project's own idioms and checks off every value as passed, fixed, or an accepted deviation. The values cross, the code does not.",
        },
      ],
      download: {
        href: "/work/design-agent/design-md-template.md",
        label: "Download the DESIGN.md template",
        meta: "Markdown, 21 KB",
      },
    },
  ],
};

/**
 * The case study behind work (03).
 *
 * NAMED, NOT ANONYMISED, and deliberately so. The designer confirmed on
 * 2026-09-07 that this was self-directed work on a public consumer app rather
 * than an engagement for SM, so the brand is named and its identity stays in the
 * screenshots. Works (01) and (02) are client work and are anonymised; that
 * difference is the reason naming this one is fair, so do not "correct" it.
 *
 * SCOPE. The UI redesign only, walked screen by screen. The source document also
 * covers research method, market context, competitor benchmarking and business
 * framing; all of it is out of scope by instruction, along with its framing about
 * trust and payment security.
 *
 * NO NUMBERS, ANYWHERE. There is no rating here, no finding count, no severity
 * tally, and nothing quantified in `facts`. That is a deliberate second pass: an
 * earlier version carried a 2.8 Play Store rating and an audit count of 21
 * findings, and the instruction was to stop claiming things. The screens are the
 * argument. If a number is ever added back it needs a source that can be cited,
 * not a self-assessment.
 *
 * The one thing this case does assert is a design position, in the statement:
 * that how an interface looks is part of how it works. That is an opinion offered
 * as an opinion, which is different from a measured outcome.
 *
 * THE SOURCE CONTRADICTS ITS OWN SCREENSHOTS in five places. Everything below is
 * written from what the images actually show:
 *   - it claims 14 decisions; its own table lists 6
 *   - it says row labels A-J; the design shows A-M
 *   - it says the progress bar reads Payment; the design reads Checkout
 *   - it says "Google SSO first"; no Google button appears in the signup AFTER
 *   - it says "GCash and Maya first"; the checkout AFTER shows only a
 *     "Select Payment Method" row, with no e-wallet named
 * If a claim here is ever edited, check it against the figure before the prose.
 */
export const cinemaCase: CaseStudy = {
  title: "Making the booking worth the anticipation",

  chip: { client: "SM Cinema", role: "UI/UX Engineer" },

  statement:
    "A UI redesign of a cinema booking app, walked screen by screen: sign-in, home, showtimes, seats, snacks and checkout.",
  emphasis: "walked screen by screen",

  facts: [
    { label: "Role", value: "UI/UX Engineer, self-directed" },
    { label: "Platform", value: "Mobile app" },
    { label: "Scope", value: "Six screens" },
    { label: "Year", value: "2025" },
  ],

  hero: {
    src: "/work/sm-cinema/header.avif",
    alt: "A title reading Redesigning SM Cinema over a photograph of an audience in 3D glasses, with two phones showing the redesigned home and account screens.",
    width: 1280,
    height: 532,
  },

  blocks: [
    {
      id: "login",
      nav: "Login",
      heading: "A film, not a form",
      body: "The first screen leads with something worth looking at.",
      figures: [
        {
          src: "/work/sm-cinema/signup.avif",
          alt: "Sign in and sign up before and after. Before, a branded splash and bare underlined fields with a password rules checklist showing. After, a login sheet over a full-bleed poster, and a form with paired first and last name fields, a phone field with a country prefix, and two consent checkboxes.",
          width: 2560,
          height: 1064,
          caption: "Sign in and sign up, before and after",
          note: "The poster runs full-bleed behind the login sheet, and it is a carousel: what is showing cycles past before anyone has typed a thing. People open this app with a film already in mind, so a film is what greets them, and signing in happens over the top of it rather than instead of it.",
        },
      ],
    },
    {
      id: "home",
      nav: "Home",
      heading: "One film at a time, properly",
      body: "Home shows what is on, and what you are already waiting for.",
      figures: [
        {
          src: "/work/sm-cinema/home.avif",
          alt: "Home before and after. Before, a header bar above a clipped row of small posters, a rewards panel that says to upgrade to unlock it, and a bottom bar whose last item is a burger menu. After, a segmented Now Showing and Coming Soon control above a large poster carousel with a Buy Ticket button and a named location.",
          width: 2560,
          height: 1064,
          caption: "Home, before and after",
          note: "One poster takes the width, with title, runtime and genre under it and Buy Ticket on the card. Once you have booked, a card at the top names the film, the cinema and the time, and counts down the days until it shows. That waiting is most of the experience, and the old home had nowhere to put it.",
        },
      ],
    },
    {
      id: "movies",
      nav: "Movies",
      heading: "Showtimes come first",
      body: "Showtimes sit where the eye lands.",
      figures: [
        {
          src: "/work/sm-cinema/movies.avif",
          alt: "Movies and movie details before and after. Before, a small poster thumbnail beside stacked text fields for runtime, release date and an advisory, with showtimes far below. After, a full-width still as the poster hero with a play button, and showtimes grouped under a collapsible cinema heading as a grid of time chips with a legend for almost full and sold out.",
          width: 2560,
          height: 1064,
          caption: "Movies and details, before and after",
          note: "The poster becomes the header, and showtimes gather under the cinema they belong to with the format and price on that heading. A scrollable strip of dates sits above them on the list and the details screen both, so checking another day is a swipe rather than a trip back. Times that are nearly full say so.",
        },
      ],
    },
    {
      id: "seats",
      nav: "Seats",
      heading: "Know the seat before you take it",
      body: "You can tell which seat you are choosing, and change your mind without starting over.",
      figures: [
        {
          src: "/work/sm-cinema/seats.avif",
          alt: "Seat selection before and after. Before, a dense field of identical small dashes with no row letters, no seat numbers and no indication of where the screen is. After, a bar reading SCREEN across the top of the map, row letters down the left edge, numbered seats, a numbered three-step indicator, and a line stating the service fee per seat.",
          width: 2560,
          height: 1064,
          caption: "Seat selection, before and after",
          note: "Rows carry letters and seats carry numbers, where the old map was a field of identical dashes. The showtimes stay on this screen as a row of chips, so moving to a later screening is not a trip back, and the unavailable and nearly-full ones are marked. Zoom in and a minimap shows which part of the auditorium you are in.",
        },
      ],
    },
    {
      id: "checkout",
      nav: "Snacks & checkout",
      heading: "Priced as you go",
      body: "The price stays visible the whole way through.",
      figures: [
        {
          src: "/work/sm-cinema/checkout.avif",
          alt: "Snacks and checkout before and after. Before, a snacks screen with one large card and truncated copy, and a payment screen where a booking fee appears in the breakdown for the first time. After, a grid of snacks with photography and prices, then an itemised checkout listing seats, snacks and a row for adding a Senior Citizen or PWD ID.",
          width: 2560,
          height: 1064,
          caption: "Snacks and checkout, before and after",
          note: "Snacks are a grid with the price on each card and the running total on the button, so the number moves while you choose. Checkout itemises seats, snacks and the fee together, where the original showed the fee for the first time on the payment screen, and adds a row for the Senior Citizen and PWD discount.",
        },
      ],
    },
    {
      id: "other",
      nav: "Other screens",
      heading: "Everything stays in the app",
      body: "The account, the membership and the ticket all resolve in place.",
      figures: [
        {
          src: "/work/sm-cinema/account.avif",
          alt: "Account and membership before and after. Before, an account screen with empty orders and rewards, a More menu overlay dimming the page, and a membership signup that opens a web page inside the app. After, an account screen with a points card carrying its own QR code, a Basic versus Premium comparison table, and a ticket screen built around a large QR code.",
          width: 2560,
          height: 1064,
          caption: "Account, membership and ticket, before and after",
          note: "Membership stops being a web page inside the app. The perks used to be a paragraph with nothing to compare them against; now they are a table read against what Basic already gives you, with the renewal terms on the same screen. Points carry their own QR, and the ticket is mostly QR, sized for a dark foyer.",
        },
      ],
    },
  ],
};

/**
 * The case study behind work (04).
 *
 * ANONYMISED ON BOTH SIDES. The designer's instruction of 2026-09-07 was to
 * name neither the client nor the product, so this follows works (01) and (02)
 * rather than (03): `chip.client` is a sector. The product name appeared in
 * exactly one place, an account email in the screenshots, and
 * `scripts/build-case-assets.mjs` removes it from the pixels. Nothing here says
 * "Headway", "Headway ERP" or "Many Heads", and nothing should be added that
 * does.
 *
 * THE DRAWING IS A THIRD PARTY'S. The isometric loaded into the app is a real
 * Santos LNG piping drawing, i.e. the client's client. Its title block, its
 * document references and its survey coordinates are all removed in the asset
 * script, and the drawing canvas is blurred on top of that because a dense
 * engineering sheet cannot be scrubbed reliably by hand-placed rectangles. The
 * copy below therefore never quotes a drawing number, a line number or a
 * project name from the sheet, and must not start.
 *
 * IT IS A PROTOTYPE, and the copy has to keep saying so. There is no adoption,
 * no rollout and no saved time claimed anywhere, because none of that is known.
 * See PRODUCT.md, "Preserve factual integrity".
 *
 * WHERE THE WORD LIVES CHANGED. `chip.role` and `facts` used to carry it and no
 * longer do: both read "UI/UX Engineer" now, on the designer's instruction, to
 * match the other three studies. It survives in the STATEMENT, which the
 * overlay renders as this case's heading, and in two `alt` strings. That is a
 * more prominent home than the facts table, not a weaker one, but it is also a
 * single sentence: edit the statement's opening and this study stops disclosing
 * that the system never shipped.
 *
 * NO NUMBERS, same rule as (03). The screens are full of counts, progress bars
 * and weld tables, all of it mock data. The only digit in this case is the year.
 *
 * TWO PARTS OF THE BRIEF ARE DELIBERATELY ABSENT, because there are no screens
 * for them and describing an interface that cannot be shown is how a case study
 * starts inventing:
 *   - A TABLET APP for onsite use. The brief specifies it in detail, down to
 *     bigger buttons and input fields for people working with greasy hands in a
 *     rough environment. Not a word of it appears below.
 *   - NDT REQUESTS AND THE MANUFACTURER'S DATA REPORT, the last two steps of the
 *     brief's flow. The buttons for both exist in the drawing-list screen and
 *     are visible in the figure, but there are no screens behind them.
 * If screens for either ever arrive, they are a fourth and fifth chapter.
 *
 * `title` is inert: nothing renders it. The overlay's heading is `statement`.
 * It is kept in step with the work card's title so the two cannot drift.
 */
export const weldingCase: CaseStudy = {
  title: "Welds tracked from drawing to sign-off",

  chip: { client: "Industrial fabrication", role: "UI/UX Engineer" },

  /* "prototype" IS LOAD-BEARING HERE. Since the role change it is the only
     place on the page disclosing that this system never shipped: `chip.role`
     and the Role fact both read "UI/UX Engineer" now. Do not edit it out. */
  statement:
    "An ERP prototype for a welding contractor, built on one idea: annotate the drawing and the welds exist. Allocation and sign-off hang off records the drawing created.",
  emphasis: "annotate the drawing and the welds exist",

  facts: [
    { label: "Role", value: "UI/UX Engineer" },
    { label: "Platform", value: "Web-app" },
    { label: "Scope", value: "Project setup to weld sign-off" },
    { label: "Year", value: "2025" },
  ],

  hero: {
    src: "/work/welding-erp/cover.avif",
    alt: "The prototype open on a drawing: a browser window, angled, showing an engineering isometric with weld annotations on it and a bill of materials down one side.",
    width: 2560,
    height: 1064,
  },

  blocks: [
    {
      id: "projects",
      nav: "Projects",
      heading: "A project starts with a drawing",
      body: "Nothing exists in the system until a drawing is in it.",
      figures: [
        {
          src: "/work/welding-erp/projects.avif",
          alt: "Three windows of the prototype: an empty state reading nothing here yet with an upload button, a grid of project cards each showing dates, counts and a progress bar, and the drawings inside one project shown as cards with thumbnails.",
          width: 2560,
          height: 1064,
          caption: "Empty state, the project list, and the drawings inside a project",
          note: "Uploading a drawing is what creates the project, so there is no empty shell to name and fill in first. Inside a project the drawings are cards, each carrying its own weld count and a bar showing how far through it is, and the two reports the job eventually needs sit up here with them rather than in a reports section of their own.",
        },
      ],
    },
    {
      id: "drawing",
      nav: "Annotation",
      heading: "The drawing is the record",
      body: "Annotating here is not marking up a reference. It is data entry.",
      figures: [
        {
          src: "/work/welding-erp/annotate.avif",
          alt: "The drawing view beside annotate mode. A toolbar floats over the sheet offering weld and note tools with zoom controls, a status legend runs along the top reading planned, allocated, completed, approved and rework, a pin sits on the drawing, and a panel on the right collects the weld's number, joint type, description, material class, heat number and size.",
          width: 2560,
          height: 1064,
          caption: "Reading the drawing, then annotating it",
          note: "The sheet pans and zooms like a map, and dropping a pin opens a panel for what a weld actually needs recorded: its number, the joint type, a description, the material class, the heat number and the size. Saving that is what creates the weld. The five statuses along the top are the same states the list view sorts by, so the drawing and the table are two views of one set of records rather than two places to keep in step.",
        },
      ],
    },
    {
      id: "welds",
      nav: "Allocation",
      heading: "Allocation, then sign-off",
      body: "The work leaves the drawing as a list of jobs.",
      figures: [
        {
          src: "/work/welding-erp/allocate.avif",
          alt: "The weld list with rows selected and an allocation dialog open over it, showing a recommended shortlist of welders above the full roster and the selected welds grouped by joint type. Beside it, a second window shows the completed tab with buttons to mark welds approved or send them back for rework.",
          width: 2560,
          height: 1064,
          caption: "Allocating a batch of welds, and signing them off",
          note: "Welds are picked from the table and handed over in one pass, with a recommended shortlist above the full roster and the batch grouped by joint type, so what is being allocated is legible before it is confirmed rather than after. Completed welds move to their own tab to be approved or sent back for rework, and every row keeps its joint type, material class and heat number beside it, which is the point of capturing them at the pin.",
        },
      ],
    },
  ],
};
