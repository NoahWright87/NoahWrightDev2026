import type { Metadata } from "next";
import { COPY } from "@/content/copy";
import AboutPageClient from "@/components/pages/AboutPageClient";

export const metadata: Metadata = {
  title: "About",
  description: COPY.about.metaDescription.text,
};

export default function AboutPage() {
  return <AboutPageClient />;
}
