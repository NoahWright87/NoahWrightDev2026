import type { Metadata } from "next";
import QuietSpine from "@/components/pages/resume-variants/QuietSpine";

export const metadata: Metadata = {
  title: "Resume prototype — Quiet Spine",
  description: "Temporary layout prototype for the timeline resume view.",
  robots: { index: false, follow: false },
};

export default function Resume5Page() {
  return <QuietSpine />;
}
