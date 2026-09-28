export interface ProjectImage {
  src: string;
  alt: string;
}

/**
 * Screenshots live in `public/images/projects/{id}/{n}.webp` (1280x720). They
 * were captured by running each project locally; see that folder's README.
 */
function projectImages(id: string, alts: string[]): ProjectImage[] {
  return alts.map((alt, i) => ({ src: `/images/projects/${id}/${i + 1}.webp`, alt }));
}

export interface Project {
  id: string;
  name: string;
  summary: string;
  tags: string[];
  status: "active" | "archived" | "wip";
  images: ProjectImage[];
  liveUrl: string;
  repoUrl: string;
}

/**
 * Manually curated project cards.
 * Add real entries here during the projects-page phase.
 * Keep entries in reverse-chronological order.
 */
export const projects: Project[] = [
  {
    id: "doors97",
    name: "Doors 97 - The OS that never was",
    summary:
      "A late-90s desktop OS that never existed, running in your browser. Boot it up, poke around the Start menu, and play a dozen-plus built-in games like Bomb Finder, Jazzball, and Goober Dress-Up. It's where most of my toys and experiments end up, and a playground for interaction design and event-driven UI state.",
    tags: ["Web App", "Retro UI", "Games"],
    status: "active",
    images: projectImages("doors97", [
      "Doors 97 desktop with the Start menu, My Doors, and a README window open",
      "Bomb Finder, a Minesweeper-style game, running in a Doors 97 window",
      "Goober Dress-Up, a cat dress-up game, running in a Doors 97 window",
    ]),
    liveUrl: "https://doors97.com",
    repoUrl: "https://github.com/NoahWright87/toybox",
  },
  {
    id: "nw-design",
    name: "NW Design - My custom React design system",
    summary:
      "My custom React design system, built as a playground for reusable UI primitives and composable page layouts. It demonstrates typed theme tokens, SSR-safe component patterns, and a practical " +
      "component library workflow.",
    tags: ["React", "Design System", "TypeScript", "SSR"],
    status: "active",
    images: projectImages("nw-design", [
      "A sample portfolio site assembled entirely from NW Design components",
      "The NW Design Hero component with a rotating typewriter tagline",
      "NW Design Storybook showing the Card component and its controls",
    ]),
    liveUrl: "https://design.noahwright.dev",
    repoUrl: "https://github.com/NoahWright87/design",
  },
  {
    id: "swarm",
    name: "Swarm - if Katamari Damacy was a shmup",
    summary:
      "A shmup where your allies are your upgrades: every level-up grows the swarm. Built entirely with AI, and every ship is geometry drawn in code at runtime, so there's no borrowed art anywhere. Endless waves, stacking upgrades, and a lot of moving parts.",
    tags: ["Game Dev", "Canvas", "Game Loop", "TypeScript"],
    status: "active",
    images: projectImages("swarm", [
      "Swarm gameplay: a small squadron of cyan fighters facing enemy ships",
      "Swarm gameplay: a large swarm of allied fighters under fire",
      "Swarm level-up screen offering three upgrade cards",
    ]),
    liveUrl: "https://swarm.noahwright.dev",
    repoUrl: "https://github.com/NoahWright87/swarm-game",
  },
  {
    id: "lee",
    name: "Lee - An auto-battler and word pun",
    summary:
      "An auto-battler roguelike TCG that imagines all adverbs are names of a character.  Draft your team of dastardly characters and watch them battle mercilessly against a wildly varied cast of opponents.  Features a Lee character creator and full game with shops, inventories, leveling characters, merging, and more.",
    tags: ["Game Dev", "Auto-Battler", "Shared Engine", "React"],
    status: "active",
    images: projectImages("lee", [
      "Lee team selection: character cards like Kind Lee and Swift Lee",
      "Lee auto-battle in progress on the grid, with units targeting each other",
      "Lee merge screen combining Stern Lee and Basic Lee into Bru Lee",
    ]),
    liveUrl: "https://lee.noahwright.dev",
    repoUrl: "https://github.com/NoahWright87/lee",
  },
  {
    id: "noahwrightdev2026",
    name: "This Site - My virtual business card and portfolio",
    summary:
      "The site you're on: my online business card, portfolio, and side-project shelf. Built with Next.js and AI helpers, it doubles as a real-world demo of my own design system. Check out the branching career timeline on the resume page.",
    tags: ["Next.js", "TypeScript", "Design System"],
    status: "active",
    images: projectImages("noahwrightdev2026", [
      "The home page of this site in light mode",
      "The branching career timeline on the resume page",
      "The home page of this site in dark mode",
    ]),
    liveUrl: "https://noahwright.dev",
    repoUrl: "https://github.com/NoahWright87/NoahWrightDev2026",
  },
];
