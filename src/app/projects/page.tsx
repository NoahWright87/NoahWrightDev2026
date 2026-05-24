import type { Metadata } from "next";
import ProjectsPageClient from "@/components/pages/ProjectsPageClient";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore software, game, and design system projects by Noah Wright, including live demos and source code.",
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
