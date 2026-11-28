/**
 * Shared site content constants.
 * All placeholder values are tagged [PLACEHOLDER] so they can be
 * grepped and replaced during the content-authoring phase.
 */

/** The words on the site live in `@/content/copy`; this file holds names, links and paths. */
export const SITE = {
  name: "Noah Wright",
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
