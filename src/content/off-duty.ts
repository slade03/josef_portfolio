import type { FavoriteGroup } from "./schema";

/** The short cross-genre picks shown on the home page. */
export const featuredFavorites: string[] = [
  "Star Wars",
  "Spider-Verse",
  "The Office",
  "WALL-E",
  "Percy Jackson series",
];

/** The full lists, shown on /about behind a `<details>` disclosure. */
export const favoriteGroups: FavoriteGroup[] = [
  {
    id: "screen-scifi",
    genre: "Sci-Fi",
    medium: "screen",
    titles: [
      "Star Wars (Prequels & Original Trilogy)",
      "Interstellar",
      "Arrival",
      "The Martian",
      "Project Hail Mary",
    ],
  },
  {
    id: "screen-comedy",
    genre: "Comedy",
    medium: "screen",
    titles: ["The Hangover Trilogy", "Superbad", "21 & 22 Jump Street"],
  },
  {
    id: "screen-romance",
    genre: "Romance",
    medium: "screen",
    titles: ["The Before Trilogy", "Love & Other Drugs", "Past Lives"],
  },
  {
    id: "screen-inspirational",
    genre: "Inspirational",
    medium: "screen",
    titles: [
      "The Pursuit of Happyness",
      "Good Will Hunting",
      "Dead Poets Society",
    ],
  },
  {
    id: "screen-musical",
    genre: "Musical",
    medium: "screen",
    titles: ["Wicked", "The Greatest Showman", "Cabaret"],
  },
  {
    id: "screen-animated",
    genre: "Animated",
    medium: "screen",
    titles: [
      "Spider-Verse (Into & Across)",
      "Tangled",
      "A Silent Voice",
      "Shrek",
      "WALL-E",
    ],
  },
  {
    id: "screen-superhero",
    genre: "Superhero",
    medium: "screen",
    titles: [
      "The Batman (2022)",
      "Marvel's The Avengers",
      "Guardians of the Galaxy Vol. 3",
      "Superman (2025)",
      "Captain America",
      "Spider-Man: No Way Home",
    ],
  },
  {
    id: "screen-television",
    genre: "Television",
    medium: "screen",
    titles: [
      "Breaking Bad",
      "The Clone Wars",
      "The Mandalorian",
      "The Office",
      "Modern Family",
      "Brooklyn Nine-Nine",
    ],
  },
  {
    id: "page-adventure",
    genre: "Adventure",
    medium: "page",
    titles: [
      "Percy Jackson",
      "Magnus Chase",
      "The Heroes of Olympus",
      "The Kane Chronicles",
      "The Trials of Apollo",
    ],
  },
  {
    id: "page-ya",
    genre: "Young Adult",
    medium: "page",
    titles: [
      "The Hate U Give",
      "All American Boys",
      "All the Bright Places",
    ],
  },
  {
    id: "page-mystery",
    genre: "Mystery/Thriller",
    medium: "page",
    titles: ["A Good Girl's Guide to Murder (Trilogy)"],
  },
  {
    id: "page-scifi",
    genre: "Sci-Fi",
    medium: "page",
    titles: ["Project Hail Mary"],
  },
];
