import type { Metadata } from "next";
import ResumePageClient from "@/components/pages/ResumePageClient";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Placeholder resume page for Noah Wright. A full web resume and downloadable PDF will be added in a follow-up release.",
};

export default function ResumePage() {
  return <ResumePageClient />;
}
