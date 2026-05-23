import { getNonsense } from "@noahwright/design";

function getProjectImage(seed: string): string {
  const image = getNonsense("abstractImage", { seed });
  return Array.isArray(image) ? image[0] : image;
}

export interface Project {
  id: string;
  name: string;
  summary: string;
  tags: string[];
  status: "active" | "archived" | "wip";
  imageSrc: string;
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
      "A retro desktop-web experiment inspired by classic late-90s UX, rebuilt as a modern web app. It highlights playful interaction design, event-driven UI state, and the challenge of making nostalgia feel smooth in modern browsers.",
    tags: ["Web App", "Retro UI", "Interaction Design"],
    status: "active",
    imageSrc: getProjectImage("project-doors97"),
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
    imageSrc: getProjectImage("project-nw-design"),
    liveUrl: "https://design.noahwright.dev",
    repoUrl: "https://github.com/NoahWright87/design",
  },
  {
    id: "swarm",
    name: "Swarm - if Katamari Damacy was a shmup",
    summary:
      "A shmup where allies are your upgrades.  Built entirely with AI using real-time generated geometry, it showcases how AI can create games and art without feeling like theft.  It features lots of moving parts, endless gameplay, upgrades, and more.",
    tags: ["Game Dev", "Canvas", "Game Loop", "TypeScript"],
    status: "active",
    imageSrc: getProjectImage("project-swarm"),
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
    imageSrc: getProjectImage("project-lee"),
    liveUrl: "https://lee.noahwright.dev",
    repoUrl: "https://github.com/NoahWright87/lee",
  },
  {
    id: "noahwrightdev2026",
    name: "This Site - My virtual business card and portfolio",
    summary:
      "The latest, AI-fueled version of my software developer site.  This latest iteration is a fast Next.js App Router site focused on clear narrative, practical UX, and strong SEO foundations. It highlights SSR-first rendering and serves as a demo of my own design system.",
    tags: ["Next.js", "SSR", "Portfolio", "SEO"],
    status: "active",
    imageSrc: getProjectImage("project-nwd2026"),
    liveUrl: "https://noahwright.dev",
    repoUrl: "https://github.com/NoahWright87/NoahWrightDev2026",
  },
];
