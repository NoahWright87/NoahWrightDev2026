import type { Metadata } from "next";
import { COPY } from "@/content/copy";
import ProjectsPageClient from "@/components/pages/ProjectsPageClient";

export const metadata: Metadata = {
  title: "Projects",
  description: COPY.projects.metaDescription.text,
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
