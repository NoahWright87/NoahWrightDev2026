import type { Metadata } from "next";
import ParallelTracks from "@/components/pages/resume-variants/ParallelTracks";

export const metadata: Metadata = {
  title: "Resume prototype — Parallel Tracks",
  description: "Temporary layout prototype for the timeline resume view.",
  robots: { index: false, follow: false },
};

export default function Resume2Page() {
  return <ParallelTracks />;
}
