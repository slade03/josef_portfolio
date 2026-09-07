import { education } from "./experience";
import type { Profile } from "./schema";

export const profile: Profile = {
  wordmark: "Josef.",
  role: "UI/UX Engineer",
  heroEyebrow: "UI/UX Engineer",
  heroHeadline: ["UI/UX engineer for", "practical, expressive products."],
  heroLede:
    "I design product flows, production-ready interfaces, and functional prototypes that help teams make clear decisions and ship useful work.",
  contactHeading:
    "Have a product that needs clear thinking and working UI?",
  contactLede:
    "I am open to UI/UX Engineer opportunities and practical product problems worth prototyping.",
  contactMeta: "Josef, UI/UX Engineer",
  contact: [
    {
      kind: "email",
      label: "Email Josef",
      href: "mailto:andreinicolas0816@gmail.com",
    },
    {
      kind: "phone",
      label: "Call +63-977-738-9118",
      href: "tel:+639777389118",
    },
    {
      kind: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/andreinclas/",
    },
    {
      kind: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/sitcho_pages/",
    },
  ],
  education,
};

/** The primary mail action, reused by the nav button and the contact close. */
export const primaryEmail = profile.contact.find((c) => c.kind === "email")!;
