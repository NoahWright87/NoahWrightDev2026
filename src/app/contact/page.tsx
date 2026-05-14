import type { Metadata } from "next";
import ContactPageClient from "@/components/pages/ContactPageClient";

export const metadata: Metadata = {
  title: "Contact",
  description: "[PLACEHOLDER: Contact page description for metadata and SEO.]",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
