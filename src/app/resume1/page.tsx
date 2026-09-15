import type { Metadata } from "next";
import BranchRail from "@/components/pages/resume-variants/BranchRail";

export const metadata: Metadata = {
  title: "Resume prototype — Branch Rail",
  description: "Temporary layout prototype for the timeline resume view.",
  robots: { index: false, follow: false },
};

export default function Resume1Page() {
  return <BranchRail />;
}
