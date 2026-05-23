import type { Metadata } from "next";
import HistoryPageClient from "@/components/pages/HistoryPageClient";

export const metadata: Metadata = {
  title: "History",
  description:
    "A brief timeline of Noah Wright's developer website iterations and how the current site evolved.",
};

export default function HistoryPage() {
  return <HistoryPageClient />;
}
