/**
 * Outside of work.
 *
 * Josef's actual hobbies, not artboard placeholder content.
 *
 * Each entry has an optional `media` slot. Until a file is dropped in, the
 * component renders a labelled frame in the established striped treatment, so
 * the section is complete and readable with no assets at all.
 *
 * ADDING MEDIA: put the file in `public/outside/` and fill in `media`. Set
 * `kind: "gif"` for animated files — that flips `unoptimized` on `next/image`,
 * without which Next transcodes the GIF to a single still frame and the
 * animation silently disappears.
 */

export interface OutsideMedia {
  src: string;
  alt: string;
  kind: "image" | "gif";
  width: number;
  height: number;
}

export interface Hobby {
  id: string;
  title: string;
  /** Short mono label above the title. */
  tag: string;
  blurb: string;
  /** Empty until real files land; renders labelled frames meanwhile. */
  media: OutsideMedia[];
}

export const outside = {
  title: "Outside of work",
  doorHint: "Keep scrolling",
  lede: "The things that have nothing to do with shipping software.",
} as const;

export const hobbies: Hobby[] = [
  {
    id: "basketball",
    title: "Basketball",
    tag: "Court",
    blurb:
      "Weekend games and too many hours watching them. The half-court read is the closest thing to a design critique I do on my feet.",
    media: [],
  },
  {
    id: "reading",
    title: "Reading",
    tag: "Pages",
    blurb:
      "Mostly adventure and young adult, with the occasional thriller that ruins a whole evening. Percy Jackson started it and it never really stopped.",
    media: [],
  },
  {
    id: "movies",
    title: "Movies",
    tag: "Screen",
    blurb:
      "Sci-fi, animation and anything with a story worth arguing about afterwards. Structure is structure, whether it is a film or a checkout flow.",
    media: [],
  },
];
