import type { Education, ExperienceRole, SkillGroup } from "./schema";

/**
 * `highlights` holds the canonical CV bullets. `clusters` are a grouping over
 * them, keyed by id, so the home page can render four precis lines while
 * /about renders the full bullets grouped under the same headings. No sentence
 * is written twice, and editing a bullet keeps the cluster pointing at it.
 */
export const experience: ExperienceRole = {
  role: "UI/UX Engineer",
  company: "You-Source",
  period: "January 2024 to current",
  highlights: [
    {
      id: "production-apps",
      text: "Designed UI for 2 production mobile applications (digital health and food & beverage), contributing to MVP development and core user flows.",
    },
    {
      id: "design-systems",
      text: "Built reusable UI components and design systems and implemented production-ready UI pages using Flutter, translating Figma designs into responsive interfaces.",
    },
    {
      id: "agile-collaboration",
      text: "Collaborated with PMs, developers, and QA in an Agile workflow to iterate on UI features and improve product usability.",
    },
    {
      id: "usability-testing",
      text: "Conducted usability testing with 5+ participants for a food & beverage mobile app, identifying usability issues and delivering UX recommendations.",
    },
    {
      id: "erp-prototype",
      text: "Led prototype design for an ERP system for an Australia-based welding company, aligning interface solutions with business requirements.",
    },
    {
      id: "webflow-pages",
      text: "Designed and developed 5+ Webflow landing pages supporting marketing campaigns.",
    },
    {
      id: "marketing-visuals",
      text: "Produced marketing visuals and infographics to support product launches.",
    },
    {
      id: "health-screens",
      text: "Designed 50+ screens for an MVP digital health mobile app prototype.",
    },
    {
      id: "ai-prototypes",
      text: "Developed functional prototypes using AI-assisted development workflows (Stitch, MCP, and agent-based tools).",
    },
  ],
  clusters: [
    {
      id: "production-ui",
      title: "Production product UI and design systems",
      summary:
        "Designed UI for two production mobile applications, built reusable components and design systems, and implemented responsive Flutter interfaces from Figma.",
      highlightIds: ["production-apps", "design-systems", "agile-collaboration"],
    },
    {
      id: "research-usability",
      title: "Research and usability",
      summary:
        "Conducted usability testing with 5+ participants for a food and beverage app, identified workflow issues, and delivered specific UX recommendations.",
      highlightIds: ["usability-testing"],
    },
    {
      id: "prototyping-systems",
      title: "Prototyping and systems work",
      summary:
        "Led an ERP prototype for an Australia-based welding company and designed 50+ screens for a digital health MVP.",
      highlightIds: ["erp-prototype", "health-screens", "ai-prototypes"],
    },
    {
      id: "marketing-delivery",
      title: "Marketing delivery",
      summary:
        "Designed and developed 5+ Webflow landing pages, plus launch visuals and infographics that supported product communication.",
      highlightIds: ["webflow-pages", "marketing-visuals"],
    },
  ],
  collaboration:
    "I work with product managers, developers, and QA, and I build functional prototypes with Stitch, MCP, and agent-based tools when a working interaction can answer the question faster than a static screen.",
};

export const skillGroups: SkillGroup[] = [
  {
    id: "design-strategy",
    title: "Design and strategy",
    skills: [
      "UX research",
      "Usability testing",
      "Wireframing",
      "Journey mapping",
      "Prototyping",
      "Design systems",
      "UI design",
      "Interaction design",
    ],
  },
  {
    id: "technical-core",
    title: "Technical core",
    skills: [
      "HTML/CSS",
      "Flutter",
      "Tailwind CSS",
      "AI-assisted UI development",
      "Prompt engineering for design",
    ],
  },
  {
    id: "tools-platforms",
    title: "Tools and platforms",
    skills: [
      "Figma",
      "Stitch by Google",
      "Google AI Studio",
      "NotebookLM",
      "ChatGPT",
      "GitHub Copilot",
      "VS Code",
      "Webflow",
      "Framer",
      "Notion",
      "Adobe Firefly",
      "Canva",
      "Agent Skills",
    ],
  },
];

export const education: Education = {
  institution: "FEU Institute of Technology",
  degree: "Bachelor of Science in Computer Science",
  specialization: "Specialization in Software Engineering",
  period: "2019 to 2024",
};
