import type { Metadata } from "next";
import { COPY } from "@/content/copy";
import ContactPageClient from "@/components/pages/ContactPageClient";

export const metadata: Metadata = {
  title: "Contact",
  description: COPY.contact.metaDescription.text,
};

export default function ContactPage() {
  return <ContactPageClient />;
}
