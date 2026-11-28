import type { Metadata } from "next";
import { COPY } from "@/content/copy";
import PortraitsPageClient from "@/components/pages/PortraitsPageClient";

export const metadata: Metadata = {
  title: "Portraits",
  description: COPY.portraits.metaDescription.text,
};

export default function PortraitsPage() {
  return <PortraitsPageClient />;
}
