import type { Metadata } from "next";
import ClientWrapper from "@/components/ClientWrapper";
import "@noahwright/design/styles.css";
import "./globals.css";

// Disable SSR for all page content — design system components rely on React
// context and hooks that must run in the browser only.

export const metadata: Metadata = {
  title: {
    default: "Noah Wright",
    template: "%s | Noah Wright",
  },
  description:
    "Engineering leader, software engineer, USAF veteran, father. Building great products and great teams.",
  metadataBase: new URL("https://noahwright.dev"),
  openGraph: {
    siteName: "Noah Wright",
    url: "https://noahwright.dev",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head />
      <body>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
