import type { Metadata } from "next";
import ContactPageClient from "@/components/pages/ContactPageClient";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Noah Wright. Interested in opportunities, collaborations, or just want to connect? Reach out via email or LinkedIn.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
