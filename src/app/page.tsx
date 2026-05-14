import type { Metadata } from "next";
import HomePageClient from "@/components/pages/HomePageClient";

export const metadata: Metadata = {
  title: "Home",
  description: "[PLACEHOLDER: Home page description for metadata and SEO.]",
};

export default function HomePage() {
  return <HomePageClient />;
}
