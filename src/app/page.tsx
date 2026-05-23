import type { Metadata } from "next";
import HomePageClient from "@/components/pages/HomePageClient";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Noah Wright is an engineering leader and software developer building practical products, strong teams, and thoughtful user experiences.",
};

export default function HomePage() {
  return <HomePageClient />;
}
