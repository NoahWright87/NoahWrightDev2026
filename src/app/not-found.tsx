import type { Metadata } from "next";
import NotFoundPageClient from "@/components/pages/NotFoundPageClient";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false },
};

export default function NotFound() {
  return <NotFoundPageClient />;
}
