import type { Metadata } from "next";
import { COPY } from "@/content/copy";
import HistoryPageClient from "@/components/pages/HistoryPageClient";

export const metadata: Metadata = {
  title: "History",
  description: COPY.history.metaDescription.text,
};

export default function HistoryPage() {
  return <HistoryPageClient />;
}
