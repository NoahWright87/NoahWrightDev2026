"use client";

import dynamic from "next/dynamic";

/**
 * Dynamically imports ClientContent with ssr: false so design system
 * components that use React context can run in the browser only.
 */
const ClientContent = dynamic(() => import("./ClientContent"), { ssr: false });

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientContent>{children}</ClientContent>;
}
