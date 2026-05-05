export interface Project {
  id: string;
  name: string;
  summary: string;
  tags: string[];
  status: "active" | "archived" | "wip";
  /** Primary action link — could be live URL, GitHub, etc. */
  href?: string;
  hrefLabel?: string;
}

/**
 * Manually curated project cards.
 * Add real entries here during the projects-page phase.
 * Keep entries in reverse-chronological order.
 */
export const projects: Project[] = [
  {
    id: "level-up-learning",
    name: "Level Up Learning",
    summary: "[PLACEHOLDER: short project summary]",
    tags: ["Education", "Web"],
    status: "active",
    href: "https://github.com/NoahWright87",
    hrefLabel: "View on GitHub",
  },
  {
    id: "lets-make-a-program",
    name: "Let's Make a Program",
    summary: "[PLACEHOLDER: short project summary]",
    tags: ["Education", "Content"],
    status: "archived",
  },
  {
    id: "games-done-wright",
    name: "Games Done Wright",
    summary: "[PLACEHOLDER: short project summary]",
    tags: ["Games", "Itch.io"],
    status: "archived",
    href: "https://noahwright87.itch.io",
    hrefLabel: "View on Itch.io",
  },
];
