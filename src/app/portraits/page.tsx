import type { Metadata } from "next";
import PortraitsPageClient from "@/components/pages/PortraitsPageClient";

export const metadata: Metadata = {
  title: "Portraits",
  description:
    "The real photo and ten AI-generated style reimaginings behind the home page hero's rotating portrait.",
};

export default function PortraitsPage() {
  return <PortraitsPageClient />;
}
