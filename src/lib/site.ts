/**
 * Shared site content constants.
 * All placeholder values are tagged [PLACEHOLDER] so they can be
 * grepped and replaced during the content-authoring phase.
 */

export const SITE = {
  name: "Noah Wright",
  tagline: "Engineering leader building tools that help teams move faster",
  description:
    "I'm an engineering manager leading an Engineering Enablement team: we build the tools, guardrails, and AI-powered workflows that help engineers ship faster and safer. Before that, ten years in the U.S. Air Force. After hours, I build games and toys that are mostly an excuse to try new things.",
  email: "noah@noahwright.dev",
  linkedIn: "https://www.linkedin.com/in/noah-wright-dev/",
  github: "https://github.com/NoahWright87",
  resumeUrl: "/resume",
  /**
   * Downloadable resume. The file itself is not in the repo yet — drop it at
   * `public/noah-wright-resume-2026.pdf` (see `public/RESUME_PLACEHOLDER.md`).
   * `netlify.toml` already forces `Content-Disposition: attachment` for `/*.pdf`.
   */
  resumePdfUrl: "/noah-wright-resume-2026.pdf",
  /** URL of the previous site iteration — update when archive.noahwright.dev is live */
  previousSiteUrl: "https://noahwright.dev",
} as const;

export const NAV_ITEMS = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
] as const;
