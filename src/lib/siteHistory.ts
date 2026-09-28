/**
 * Every version of noahwright.dev, newest first. Dates and stacks come from each
 * repo's own commit history. Private repos (two 2021 experiments) are left out.
 */
export interface SiteVersion {
  id: string;
  years: string;
  name: string;
  summary: string;
  stack: string[];
  /** Where it can still be seen, if anywhere. */
  liveUrl?: string;
  repoUrl: string;
  /** Launched publicly, or an attempt that never went live. */
  shipped: boolean;
}

export const siteVersions: SiteVersion[] = [
  {
    id: "2026",
    years: "2026",
    name: "This site",
    summary:
      "A complete reset: my online business card, portfolio, and side-project shelf, built with a lot of help from AI and dogfooding my own design system.",
    stack: ["Next.js", "@noahwright/design", "Netlify"],
    repoUrl: "https://github.com/NoahWright87/NoahWrightDev2026",
    shipped: true,
  },
  {
    id: "redux",
    years: "2026",
    name: "NoahWrightDevRedux",
    summary:
      "“A re-re-re-redo of my developer website. This time with robots to help!” It got as far as a README before becoming the site you’re on.",
    stack: ["Good intentions"],
    repoUrl: "https://github.com/NoahWright87/NoahWrightDevRedux",
    shipped: false,
  },
  {
    id: "next",
    years: "2025",
    name: "NoahWrightDev-Next",
    summary: "A little site for tooling around with Next.js.",
    stack: ["Next.js", "Tailwind", "Emotion"],
    repoUrl: "https://github.com/NoahWright87/NoahWrightDev-Next",
    shipped: false,
  },
  {
    id: "react",
    years: "2023–2024",
    name: "NoahWrightDev-React",
    summary:
      "My first attempt at replacing the template with something built from scratch, so I’d know the site inside and out.",
    stack: ["Create React App", "Material UI"],
    repoUrl: "https://github.com/NoahWright87/NoahWrightDev-React",
    shipped: false,
  },
  {
    id: "jekyll",
    years: "2021–2023",
    name: "The Jekyll blog",
    summary:
      "A blog and portfolio on the Minimal Mistakes theme, with 26 posts written in 2021 and 2022 about career advice, engineering, and learning in public.",
    stack: ["Jekyll", "Minimal Mistakes", "Netlify"],
    liveUrl: "https://2023.noahwright.dev/",
    repoUrl: "https://github.com/NoahWright87/NoahWrightDev",
    shipped: true,
  },
];
