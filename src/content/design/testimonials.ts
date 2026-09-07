/**
 * Real testimonials. Four LinkedIn recommendations, quoted verbatim.
 *
 * These replaced four invented placeholders. Every quote below is someone's actual
 * words about someone they actually worked with, so the rules are different now:
 *
 *   - Quote text is VERBATIM. Do not tidy grammar, do not shorten to fit a grid, do
 *     not swap a name to match the site's branding. Two of these call him "Andrei"
 *     rather than "Josef" because that is what was written; he goes by both.
 *   - `relationship` is the only field that is paraphrased, because LinkedIn phrases
 *     its version around the profile owner ("managed Andrei directly"). Describing
 *     the working relationship is fair; editing the endorsement is not.
 *   - The Payuan quote is cut at a sentence boundary because the source was
 *     truncated. Nothing was invented to complete it.
 *
 * THE COUNT IS NO LONGER STRUCTURAL. This used to say four was hardcoded in three
 * places, naming `FROM` direction vectors, a `gridArea` template and a
 * `grid-template-areas` block. All three belonged to a 3x2 ring layout that has
 * been replaced twice since, and none of them exists any more.
 *
 * What the layout does now: four explicit columns above 62rem so the notes line
 * up in one row, `auto-fit` below that, and `data-tint={i % 4}` for colour and
 * tilt. So a fifth testimonial is a content-only change here, and it reuses
 * tint 0. Two caveats if you add one, both about the single row rather than the
 * count: five across a 1200px content width is about 216px each, and the notes
 * are already square at four, so a fifth makes them portrait again. And the
 * quotes are ordered longest-first, which no longer matters for row heights but
 * does decide which note clamps hardest.
 *
 * LENGTH IS THE REAL CONSTRAINT, not the count. The card clamps the quote to
 * four lines and the headline to one; these run 351 to 853 characters, so a
 * much longer quote costs nothing visually and a much shorter one leaves the
 * note looking underfilled. The full text is always in the modal.
 */

export interface Testimonial {
  id: string;
  name: string;
  /** Their LinkedIn headline, trimmed to the part that establishes standing. */
  headline: string;
  /** How they worked with him. Paraphrased from LinkedIn's relationship line. */
  relationship: string;
  quote: string;
}

export const testimonials = {
  /* Two rows of display type, centred. Longer and warmer than the old "What
     they / say", which was written for a narrow sticky rail beside the notes;
     the section is one centred column now and has the width for a full phrase. */
  heading: ["What people I’ve", "worked with say"],
  note: "LinkedIn recommendations, 2025 and 2026.",
} as const;

export const quotes: Testimonial[] = [
  {
    id: "dela-rosa",
    name: "Naroff Nathan John Dela Rosa",
    headline: "Head of Software Engineering at You Source",
    relationship: "Managed Josef directly",
    quote:
      "I worked with Josef Nicolas when I was assigned as Project Manager in Product Design, and honestly, he's one of the people who made that experience memorable for the right reasons. He's someone you want on your team when things get tough. What I appreciated most about Josef was how he handled pressure. The challenges weren't small, they kept coming and kept growing, but he never cracked. He stayed on top of things, kept his process organized, and moved fast without cutting corners. Clients always felt taken care of because he made sure they actually saw what they came for: their ideas brought to life through design and prototypes that hit the mark. He's reliable, resilient, and easy to work with even when the environment isn't. I'd work with Josef again without hesitation, and anyone who gets the chance to work with him is lucky to have him.",
  },
  {
    id: "ortile",
    name: "Lourenin Ortile",
    headline: "Associate Project Manager",
    relationship: "Worked on the same team",
    quote:
      "I had the opportunity to work with Josef before, and I can say that he not only listens to suggestions from his teammates but also takes the initiative to do his own research to further improve the design of an app or website. The designs he produces are clear and easy for clients to understand. He is easy to work with, as he shows respect and remains attentive during discussions. He is also proactive and a dependable team player who ensures that client requirements are met.",
  },
  {
    id: "payuan",
    name: "John Kim Adrian Payuan",
    headline: "UI/UX Designer",
    relationship: "Senior to Josef",
    quote:
      "I had the opportunity to work with Andrei, from his time as an intern in our division up to now as a full-time employee. It has been incredibly rewarding to witness his growth firsthand. His genuine willingness to learn, paired with how effortlessly he adapts to new environments, truly sets him apart. I also had the chance to work closely with him in both design and development, and I can confidently say that his skills are exceptional.",
  },
  {
    id: "urlanda",
    name: "Yvonne Urlanda",
    headline: "UI/UX Product Designer, ADPList Mentor",
    relationship: "Mentored Josef",
    quote:
      "Andrei has grown tremendously as a UX Engineer, quickly adapting to challenges and refining his skills. As a mentor, I've seen his dedication, curiosity, and strong problem-solving mindset drive his progress. His willingness to learn and collaborate makes him a designer to watch, and I have no doubt he will make a meaningful impact wherever he goes.",
  },
];
