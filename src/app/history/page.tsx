import type { Metadata } from "next";
import HistoryPageClient from "@/components/pages/HistoryPageClient";

export const metadata: Metadata = {
  title: "History",
  description: "[PLACEHOLDER: History page description for metadata and SEO.]",
};

export default function HistoryPage() {
  return <HistoryPageClient />;
}
