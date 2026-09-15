import type { Metadata } from "next";
import MetroMap from "@/components/pages/resume-variants/MetroMap";

export const metadata: Metadata = {
  title: "Resume prototype — Metro Map",
  description: "Temporary layout prototype for the timeline resume view.",
  robots: { index: false, follow: false },
};

export default function Resume4Page() {
  return <MetroMap />;
}
