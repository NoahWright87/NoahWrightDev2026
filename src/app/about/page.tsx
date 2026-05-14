import type { Metadata } from "next";
import AboutPageClient from "@/components/pages/AboutPageClient";

export const metadata: Metadata = {
  title: "About",
  description: "[PLACEHOLDER: About page description for metadata and SEO.]",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
