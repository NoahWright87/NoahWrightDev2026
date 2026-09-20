import type { Metadata } from "next";
import PinnedRailStage from "@/components/pages/resume-variants/PinnedRailStage";

export const metadata: Metadata = {
  title: "Resume prototype — Pinned Rail",
  description: "Temporary layout prototype for the timeline resume view.",
  robots: { index: false, follow: false },
};

export default function Resume6Page() {
  return <PinnedRailStage mode="single" />;
}
