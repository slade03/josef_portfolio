/**
 * Copy from the Claude Design artboard "Josef Nicolas Portfolio.dc.html",
 * transcribed verbatim.
 *
 * MIXED, BUT ONLY JUST. Read the list before trusting either way.
 *
 * REAL, and safe to publish: the three works and their case studies, the
 * testimonials in ./testimonials.ts, the hero copy, the contact details below
 * (email and both social profiles, taken from `src/content/profile.ts`), and
 * `playItems` — eight real pieces, sourced from `src/content/projects.ts` and
 * `src/content/experiments.ts` plus the designer's own lightsaber game.
 *
 * STILL PLACEHOLDER: ./skills.ts, and nothing else in this file. The artboard's
 * own source flagged it — "Placeholder copy", "Illustrative figures; swap in
 * measured numbers before publishing" — and it has not been swapped. It is also
 * not rendered, so it blocks nothing today.
 *
 * ONE THING IS MISSING RATHER THAN FAKE: `hero.cta` points at
 * `/josef-nicolas-resume.pdf`, which is not in the repo. See the note there.
 *
 * The full real content (shipped projects, experiments, contact details and
 * experience) is preserved untouched in `src/content/*` alongside this.
 */

import {
  agentCase,
  cinemaCase,
  matchaCase,
  weldingCase,
  type CaseStudy,
} from "./case-studies";

export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Works", href: "#works" },
  { label: "Playground", href: "#playground" },
  /* Skills and Outside of work are both hidden from the page for now, so their
     nav entries went with them: an anchor to a section that no longer renders
     scrolls nowhere. Restoring either section restores its link here. */
  { label: "Contact", href: "#contact" },
];

export const hero = {
  /**
   * One rendered line. Words are separate spans because the artboard animates
   * them individually; the headline's second line is the reel below.
   */
  headline: [["I’m", "Josef,"]],
  /**
   * The slot-machine reel, in order.
   *
   * ORDER IS LOAD-BEARING, TWICE OVER.
   *
   * The FIRST entry is the resting state: it is what the markup renders with no
   * script running, and therefore what someone who asked for reduced motion
   * sees. So it has to be the straight answer, never a joke.
   *
   * The LAST entry is the punchline, and it only lands because the four before
   * it are credible. Reordering these does not shuffle them, it removes the
   * setup.
   *
   * Each entry carries its own article: both "a" and "an" occur here, so a
   * shared article outside the reel would be wrong half the time.
   */
  roles: [
    "a designer",
    "an engineer",
    "a problem solver",
    "a team player",
    "a force wielder",
  ],
  year: "/ 2026 /",
  scroll: "Scroll down",
  cta: { label: "View my resume", href: "/josef-nicolas-resume.pdf" },
} as const;

export const heroMarquee = [
  "Product design",
  "Design systems",
  "Front-end build",
  "Motion",
  "Prototyping",
];

/**
 * The footer marquee band.
 *
 * It is back, but doing a different job from the one that was removed. The old
 * one sat directly above a headline saying "Open for work" and a button saying
 * "Hire me" — a third way of making the same offer. This one is a band of
 * movement closing the page, and the offer itself is made once, in ./ready.ts.
 *
 * Marquee keys items by their string, so these must stay distinct. The visual
 * repetition comes from the component duplicating the whole group, not from
 * repeating entries here.
 */
export const footerMarquee = ["Let’s connect", "Say hello", "Open for 2026"];

/**
 * Labels for the cursor trail cards that follow the pointer across the hero.
 *
 * Three of these used to name works that no longer exist (Kadence, Loop, Fern).
 * They are atmosphere rather than navigation, so they do not have to map onto the
 * works list, but they must not advertise a project the site cannot show.
 */
export const trailLabels = [
  "Design agent / tester lab",
  "Design agent / handoff spec",
  "Cinema / seat picker",
  "Café app / checkout",
  "Habit app / streaks",
  "WebGL grid study",
  "Type specimen",
  "Motion probe",
  "Settings panel",
  "Invoice tool",
];

export interface Work {
  index: string;
  title: string;
  meta: string;
  /** Panel width from the artboard; each differs deliberately. */
  width: string;
  /**
   * The case study this card opens. Absent means "Coming soon".
   *
   * There is deliberately no separate flag. An earlier `cta: "case" | "soon"`
   * could say "case" while no study existed, and the card would then open an
   * overlay with nothing in it — including no close button, since the rail
   * carries the only one. Pointing straight at the study makes that
   * unrepresentable rather than merely unlikely.
   */
  study?: CaseStudy;
  /**
   * Card artwork. Optional on purpose: a work without one falls back to the
   * striped placeholder, which reads honestly as "nothing here yet" rather than
   * dressing up an empty slot. Adding art to a later slot is content-only.
   */
  cover?: { src: string; alt: string; width: number; height: number };
}

export const works: Work[] = [
  {
    index: "(01)",
    /* Names the improvement, not the product. "Café ordering app" described what
       the thing was; a work card should say what the work did. */
    title: "Pickup or delivery, made obvious",
    meta: "UI/UX Engineer, 2026",
    width: "min(900px, 62vw)",
    study: matchaCase,
    cover: {
      src: "/work/matcha-app/cover.avif",
      alt: "Three phones showing the café ordering app: the menu, the home screen, and checkout.",
      width: 1280,
      height: 532,
    },
  },
  {
    index: "(02)",
    title: "From brief to dev-ready in days",
    meta: "UI/UX Engineer, 2026",
    width: "min(820px, 62vw)",
    study: agentCase,
    /* The same file the case header uses. Published once, referenced twice, so
       the card and the header cannot drift apart. */
    cover: {
      src: "/work/design-agent/cover.avif",
      alt: "A phone showing a project list, surrounded by floating glass folders of code files, glass documents and coral puzzle pieces.",
      width: 1930,
      height: 815,
    },
  },
  /* Named, unlike (01) and (02). This one is self-directed work on a public
     consumer app rather than a client engagement, so there is no client to
     protect and the brand stays in both the copy and the screenshots. */
  {
    index: "(03)",
    title: "Making the booking worth the anticipation",
    meta: "UI/UX Engineer, 2025",
    width: "min(700px, 62vw)",
    study: cinemaCase,
    cover: {
      src: "/work/sm-cinema/cover.avif",
      alt: "Three phones showing the redesigned cinema app: a movie list, the home screen, and an account screen with a points card.",
      width: 1280,
      height: 532,
    },
  },
  /* Anonymised, like (01) and (02) and unlike (03): this is client work, and the
     designer's instruction was to name neither the client nor the product. The
     drawing inside the screenshots belongs to the client's client, which is why
     that study's asset job redacts and then blurs it.

     760px is the widest this card can be. Four panels make the gather fan tilt
     the outer cards by 6 degrees rather than 4, and `.jn-works__viewport` sizes
     its padding for exactly 6 degrees at a 900px card. See the runway note in
     globals.css. */
  {
    index: "(04)",
    title: "Welds tracked from drawing to sign-off",
    meta: "UI/UX Engineer, 2025",
    width: "min(760px, 62vw)",
    study: weldingCase,
    /* The same file the case header uses, published once and referenced twice,
       as work (02) does. */
    cover: {
      src: "/work/welding-erp/cover.avif",
      alt: "The prototype open on a drawing: an angled browser window showing an engineering isometric with weld annotations on it.",
      width: 2560,
      height: 1064,
    },
  },
];

export interface PlayItem {
  /** The piece's own name. The category lives in `tag`, not here. */
  label: string;
  /** Unique. React keys both the card AND its ghost off this. */
  num: string;
  tag: string;
  /**
   * OPTIONAL, and only three of the nine carry one.
   *
   * The three shipped builds are explained because a working app has decisions
   * in it worth stating. The six concepts are not: they are single visual
   * pieces, the image IS the content, and a paragraph underneath would be
   * writing about a picture the reader is already looking at.
   */
  desc?: string;
  /**
   * Card face and viewer artwork.
   *
   * NOT OPTIONAL. The drum is nine pictures, so an item without one would be
   * the single blank rectangle in a ring of designs. Same shape as `Work.cover`
   * above, deliberately: one cover type for the whole site.
   */
  cover: { src: string; alt: string; width: number; height: number };
  /**
   * A DIFFERENT image for the viewer, where one exists. Falls back to `cover`.
   *
   * The card face and the viewer are not the same shape and do not want the
   * same picture. The plate is roughly square, so a card wants a squarish
   * composition; the viewer is 1200px of width, so it can carry a wide one. The
   * tennis app is the case that made this necessary: its square cover shows two
   * screens, and its wide image shows all four, the same two in light and dark
   * theme, which is illegible at card size and the better picture at full size.
   */
  still?: { src: string; alt: string; width: number; height: number };
  /**
   * A demo recording. Only the three shipped builds have one, and for those it
   * is the best evidence in the section: a concept can be judged from a still,
   * a working app cannot.
   */
  video?: { src: string; description: string };
  /**
   * Only where the thing is genuinely reachable. `note` is for anything a
   * visitor needs to know BEFORE clicking, not after.
   */
  link?: { href: string; label: string; note?: string };
}

/**
 * The eyebrow, the legend and the hint are all gone.
 *
 * The hint ("Drag to spin", "Click a card for details") was the third statement
 * of one affordance: the lede says it in a sentence, the cards are real
 * buttons, and the cursor puts "drag" and "view" under the pointer. It was also
 * aria-hidden, so it never carried anything for assistive tech either.
 *
 * ONE CAVEAT, recorded rather than solved: cursor labels are suppressed on
 * touch, so on a phone there is now no drag cue at all. Raised twice and
 * removed twice, so it is a decision rather than an oversight.
 */
export const playground = {
  /**
   * TWO ROWS, AND BOTH ARE THE TITLE. This is one phrase broken across two
   * lines of display type, which is what `ScrollCurtain` rows are for. It is
   * not a title plus a subtitle and must never be set as one.
   *
   * The break is deliberate and belongs where it is: "Just because designs" on
   * the first line, "& some apps" on the second. Do not re-flow it to balance
   * the line lengths.
   */
  headline: ["Just because designs", "& some apps"],
  /**
   * A BUTTON STANDS WHERE A PARAGRAPH USED TO.
   *
   * This slot held a lede describing the section's own contents, which the
   * contents already do. What earns the space instead is the one thing in the
   * drum a reader can go and use.
   */
  cta: {
    href: "https://lightsaber-training.vercel.app/",
    label: "Play the lightsaber game",
  },
} as const;

/**
 * THESE ARE ALL REAL, and that is new.
 *
 * This array used to hold eight inventions, every one of them signed off with
 * the words "Placeholder copy": a banking-card concept, a habit app, a WebGL
 * grid, an invoice tool, a scroll-physics probe. None of them existed. It was
 * the last placeholder section on the page.
 *
 * WHERE EACH PIECE COMES FROM. The builds and their art are the designer's own;
 * Slade Comics and The Broke Basket reuse the covers, demo recordings and
 * written premises already in `src/content/projects.ts`, and five of the
 * concepts reuse the covers and alt text already in
 * `src/content/experiments.ts`. The lightsaber game and the tennis app are
 * newer than both of those files and are converted by
 * `scripts/build-case-assets.mjs`. Nothing here duplicates an asset.
 *
 * TWO THINGS ARE DELIBERATELY ABSENT.
 *
 * "SM Cinema Redesign Concept" exists in experiments.ts with finished art and
 * is NOT here, because Selected Works (03) is the same subject. Putting it in
 * both places would sell one piece of work twice.
 *
 * The welding-company ERP screens in `erp-system/` are not here either. They
 * are client work, and this section is explicitly the work with nobody paying
 * for it; their four sources are also 1280x532, exactly the Selected Works
 * cover size, so they are shaped like a case study rather than a toy.
 *
 * COPY FOR THE CONCEPTS does not exist, and that is now the design rather than
 * a gap: six of the nine carry no description at all. experiments.ts has titles,
 * categories and alt text and nothing else, and a concept is a single picture
 * that the viewer shows at full size. Only the three shipped builds are
 * explained.
 *
 * WIDTHS ARE NO LONGER PER ITEM. Every card is the same size, set once in the
 * stylesheet. They used to differ deliberately, which read as accidental once
 * the cards held real artwork instead of striped placeholders. `playground.tsx`
 * derives the drum's spacing from `playItems.length`, so adding a tenth piece
 * is a content-only change. `num` must stay unique or React collides the card
 * and ghost keys.
 */
export const playItems: PlayItem[] = [
  {
    label: "Lightsaber Training Simulation",
    num: "01",
    tag: "Game",
    desc: "Two screens, one saber: the desktop is the visor and the phone is the hilt. Scan the code over the Council chamber, ignite, and the phone streams motion into the blade while the desktop counts the bolts you deflect. The phone holds no game state at all, which is what keeps the pairing simple. It is purely an input device.",
    cover: {
      src: "/play/lightsaber/cover.avif",
      alt: "A browser window showing a first-person view inside the Jedi Council chamber with a lit blue blade and a deflection counter, beside a phone showing the hilt controller and its blade-colour swatches.",
      width: 1920,
      height: 1920,
    },
    video: {
      src: "/play/lightsaber/demo.webm",
      description:
        "Screen recording of the training simulation: pairing the phone, igniting the blade, and deflecting blaster bolts in the Council chamber.",
    },
    link: {
      href: "https://lightsaber-training.vercel.app/",
      label: "Play it",
      /* Load-bearing, not decoration. Opened on a laptop alone this shows a QR
         code and waits, so someone who clicks without knowing that will think
         it is broken. */
      note: "Needs a phone as the hilt, paired by QR code from the desktop screen.",
    },
  },
  {
    label: "Slade Comics",
    num: "02",
    tag: "App",
    desc: "A Flutter reader for local .cbz and .cbr archives that treats a personal comic library as a reading product rather than a file browser. Gestures turn the pages, so the reading surface stays quiet, and progress persists, so resuming is the default rather than a setting.",
    cover: {
      src: "/personal_apps/slade_comics.avif",
      alt: "Slade Comics library and continue-reading interfaces shown on two phones.",
      width: 1080,
      height: 1080,
    },
    video: {
      src: "/personal_apps/slade_comics_demo.webm",
      description:
        "Screen recording of Slade Comics: opening the library, resuming a comic, and paging through with gestures.",
    },
  },
  {
    label: "The Broke Basket",
    num: "03",
    tag: "App",
    desc: "An offline-first grocery flow that replaces a paper list and a calculator with one running total. Spent and remaining sit above the item details, each line can be corrected in a couple of taps, and the whole thing works with no account and no connection.",
    cover: {
      src: "/personal_apps/the_broke_basket_1.avif",
      alt: "The Broke Basket launch screen and grocery list overview shown on two phones.",
      width: 1920,
      height: 1440,
    },
    video: {
      src: "/personal_apps/broke_basket_demo.webm",
      description:
        "Screen recording of The Broke Basket: setting a budget, adding basket items, and watching the remaining amount update offline.",
    },
  },
  {
    /* The only light-ground piece in the drum, which is why it is early in the
       ring rather than buried: it breaks a run of dark cards. */
    label: "Tennis Tournament App",
    num: "04",
    tag: "App concept",
    cover: {
      src: "/play/tennis/cover.avif",
      alt: "A tennis ladder app on two phones: a player profile leading on tier and ranking with win rate, points and earnings, and a tournament list where each entry shows its prize pool, entry fee, format and how full the draw is.",
      width: 1920,
      height: 1920,
    },
    still: {
      src: "/play/tennis/main.avif",
      alt: "The same two tennis app screens shown four times, as a light-theme pair beside a dark-theme pair: the ranked player profile with its incoming challenge, and the tournament list with prize pools, entry fees and draw capacity.",
      width: 1280,
      height: 532,
    },
  },
  {
    label: "Car Rental UI",
    num: "05",
    tag: "App concept",
    cover: {
      src: "/brain_rot_designs/car_rental_concept.avif",
      alt: "Car rental mobile application interface concept.",
      width: 2160,
      height: 2160,
    },
  },
  {
    label: "Coffee Shop App",
    num: "06",
    tag: "App concept",
    cover: {
      src: "/brain_rot_designs/coffee_shop_concept_app.avif",
      alt: "Coffee shop mobile application concept.",
      width: 1920,
      height: 1440,
    },
  },
  {
    label: "Darth Vader Landing",
    num: "07",
    tag: "Editorial",
    cover: {
      src: "/brain_rot_designs/darth_vader_hero_design.avif",
      alt: "Darth Vader editorial landing page concept.",
      width: 960,
      height: 720,
    },
  },
  {
    label: "Pokemon Landing",
    num: "08",
    tag: "Web design",
    cover: {
      src: "/brain_rot_designs/pokemon_landing_page.avif",
      alt: "Pokemon-themed landing page concept.",
      width: 960,
      height: 720,
    },
  },
  {
    /* No description, and for this one that is also the safe choice. The
       artwork renders a diss-track lyric as display type; describing the
       composition was fine, but there is nothing to say about it that the
       picture does not already say, and repeating the words would put the
       accusation in the portfolio's own voice. */
    label: "Kendrick Lamar Hero",
    num: "09",
    tag: "Editorial",
    cover: {
      src: "/brain_rot_designs/kendrick_lamar_hero_design.avif",
      alt: "Kendrick Lamar editorial hero concept in a dark blue composition.",
      width: 2048,
      height: 2048,
    },
  },
];

/* The Skills copy moved to ./skills.ts when the section became pinned tabs.
   It is placeholder content there, by instruction. */

/**
 * TESTIMONIALS LIVE IN ./testimonials.ts
 *
 * They moved there when the section became a card deck, and they are no longer
 * placeholder: the four quotes are real LinkedIn recommendations, attributed to
 * named people. The rules for editing them are in that file's header.
 */

export interface ContactFact {
  label: string;
  value: string;
  /** Renders the live-status dot before the value. */
  dot?: boolean;
  /** Renders the value as a mailto link. */
  mail?: boolean;
}

/* No headline and no actions: both moved to ./ready.ts so the offer is made
   once. What is left is what a footer is actually for. */
export const contact: {
  elsewhere: { label: string; href: string }[];
  location: { place: string; mode: string; code: string };
  facts: ContactFact[];
  copyright: string;
  backToTop: string;
} = {
  /* Two, and both are real. This used to be five rows of placeholder roots
     (`https://dribbble.com/`, `https://github.com/`) that went to the service's
     front page rather than to a profile: five links advertising four accounts
     that were not being shown. The two that remain are the designer's actual
     profiles, taken from `src/content/profile.ts` so there is one source for
     them rather than two that can disagree. */
  elsewhere: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/andreinclas/" },
    { label: "Instagram", href: "https://www.instagram.com/sitcho_pages/" },
    { label: "View my resume", href: "/josef-nicolas-resume.pdf" },
  ],
  facts: [
    { label: "(Status)", value: "Open for 2026", dot: true },
    { label: "(Based)", value: "Lipa, Batangas\nUTC+8, working globally" },
    { label: "(Direct)", value: "andreinicolas0816@gmail.com", mail: true },
  ],
  /* The bordered location block, as three cells. */
  location: {
    place: "Lipa, Batangas, Philippines",
    mode: "Working globally",
    code: "PHL",
  },
  copyright: "© 2026 Josef Nicolas",
  backToTop: "Back to top ↑",
};

/** Nothing imports this. Kept in step with the page anyway, so it does not become
    a quietly wrong description of a composition it no longer matches. */
export const sectionNames = [
  "Index",
  "Selected works",
  "Playground",
  "Testimonials",
  "Contact",
];
