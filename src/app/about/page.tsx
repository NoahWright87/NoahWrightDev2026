import type { Metadata } from "next";
import AboutPageClient from "@/components/pages/AboutPageClient";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Noah Wright, his engineering leadership background, and the values that shape his work.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
