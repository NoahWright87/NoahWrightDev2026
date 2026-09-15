import type { Metadata } from "next";
import TimeScrubber from "@/components/pages/resume-variants/TimeScrubber";

export const metadata: Metadata = {
  title: "Resume prototype — Time Scrubber",
  description: "Temporary layout prototype for the timeline resume view.",
  robots: { index: false, follow: false },
};

export default function Resume3Page() {
  return <TimeScrubber />;
}
