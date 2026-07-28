import type { Metadata } from "next";
import Script from "next/script";
import { theme, darkTheme } from "@/lib/theme";
import { buildThemeCss } from "@/lib/themeCss";
import "@noahwright/design/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Noah Wright",
    template: "%s | Noah Wright",
  },
  description:
    "Engineering leader, software engineer, USAF veteran, father. Building great products and great teams.",
  metadataBase: new URL("https://noahwright.dev"),
  openGraph: {
    title: "Noah Wright",
    description:
      "Engineering leader, software engineer, USAF veteran, father. Building great products and great teams.",
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
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const themeCss = buildThemeCss(theme, darkTheme);

  return (
    <html lang="en">
      <head>{themeCss ? <style id="nw-theme">{themeCss}</style> : null}</head>
      <body>
        {children}
        {clarityId && (
          <Script id="ms-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${clarityId}");`}
          </Script>
        )}
      </body>
    </html>
  );
}
