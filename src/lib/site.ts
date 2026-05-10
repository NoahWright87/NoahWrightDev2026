/**
 * Shared site content constants.
 * All placeholder values are tagged [PLACEHOLDER] so they can be
 * grepped and replaced during the content-authoring phase.
 */

export const SITE = {
  name: "Noah Wright",
  tagline: "[PLACEHOLDER: engineering leader tagline]",
  description:
    "[PLACEHOLDER: 1-2 sentence site description for SEO and home hero]",
  email: "noah@noahwright.dev",
  linkedIn: "https://www.linkedin.com/in/noah-wright-dev/",
  resumeUrl: "/noah-wright-resume-2026.pdf",
  /** URL of the previous site iteration — update when archive.noahwright.dev is live */
  previousSiteUrl: "https://noahwright.dev",
} as const;

export const NAV_ITEMS = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
