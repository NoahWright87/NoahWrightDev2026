import type { Metadata } from "next";
import ResumePageClient from "@/components/pages/ResumePageClient";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Noah Wright's resume, presented as a branching timeline of a dual career in the U.S. Air Force and civilian software engineering.",
};

export default function ResumePage() {
  return <ResumePageClient />;
}
