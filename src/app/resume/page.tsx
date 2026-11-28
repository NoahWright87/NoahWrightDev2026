import type { Metadata } from "next";
import { COPY } from "@/content/copy";
import ResumePageClient from "@/components/pages/ResumePageClient";

export const metadata: Metadata = {
  title: "Resume",
  description: COPY.resume.metaDescription.text,
};

export default function ResumePage() {
  return <ResumePageClient />;
}
