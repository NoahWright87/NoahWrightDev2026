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
   * Downloadable one-page resume, exported from Noah's Google Doc. Undated on
   * purpose: replace the file in place when the resume changes, so links and
   * bookmarks keep working and a downloaded copy never looks stale by name.
   * Export it without the phone number: the file is public, and a number on a
   * public page gets scraped.
   */
  resumePdfUrl: "/noah-wright-resume.pdf",
  /** The name a recruiter's browser saves it under. */
  resumePdfFilename: "Noah-Wright-Resume.pdf",
} as const;

export const NAV_ITEMS = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
] as const;
