import type { Metadata } from "next";
import AdventurePageClient from "@/components/adventure/AdventurePageClient";

export const metadata: Metadata = {
  title: "Adventure",
  description: "A small, hand-written text adventure hidden in Noah Wright's site.",
};

export default function AdventurePage() {
  return <AdventurePageClient />;
}
