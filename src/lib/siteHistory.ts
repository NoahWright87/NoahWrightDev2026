/**
 * Every launched version of noahwright.dev, newest first. Dates and stacks come
 * from each repo's own commit history. Rebuilds that never launched are left
 * out on purpose.
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
  },
];
