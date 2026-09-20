import type { Metadata } from "next";
import TimeReel from "@/components/pages/resume-variants/TimeReel";

export const metadata: Metadata = {
  title: "Resume prototype — Time Reel",
  description: "Temporary layout prototype for the timeline resume view.",
  robots: { index: false, follow: false },
};

export default function Resume8Page() {
  return <TimeReel />;
}
