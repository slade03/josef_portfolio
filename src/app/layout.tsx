import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

/**
 * Two families, down from three.
 *
 * Coolvetica carries the display tier; Source Sans 3 carries everything else.
 * Alumni Sans and IBM Plex Mono are both gone — the mono in particular was
 * setting 42 of the site's 57 family declarations at 10-11px, which is the
 * "tiny monospace labels" anti-reference PRODUCT.md names explicitly.
 *
 * Coolvetica ships ONE usable cut. Regular is the whole display tier; the
 * hierarchy is carried by size, leading and colour instead of by weight. Do not
 * add `font-weight: 600/700/800` to a display selector — there is no bolder cut
 * to resolve to, so the browser synthesises a smeared faux-bold.
 *
 * Licensing note: the Coolvetica bundle ships Typodermic's *desktop* EULA, which
 * does not normally cover serving the face as a webfont. Flagged and accepted by
 * the site owner; revisit before this is public.
 */
const display = localFont({
  src: "./fonts/coolvetica-rg.otf",
  variable: "--font-display",
  weight: "400",
  style: "normal",
  display: "swap",
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  /* 300 nav, 400 body, 600 labels. That is the whole set the stylesheet asks
     for — the previous build downloaded six Alumni Sans cuts, four Source Sans
     and two IBM Plex Mono, several of which no selector ever referenced.
     300 exists solely to counteract the nav's blend mode; see .jn-nav__links. */
  weight: ["300", "400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://josefnicolas.design"),
  title: {
    default: "Josef Nicolas | UI/UX Engineer",
    template: "%s | Josef Nicolas",
  },
  description:
    "UI/UX Engineer based in Lipa, PH. Product design, design systems, front-end build, motion and prototyping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
