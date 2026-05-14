import type { Metadata } from "next";
import ProjectsPageClient from "@/components/pages/ProjectsPageClient";

export const metadata: Metadata = {
  title: "Projects",
  description: "[PLACEHOLDER: Projects page description for metadata and SEO.]",
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
