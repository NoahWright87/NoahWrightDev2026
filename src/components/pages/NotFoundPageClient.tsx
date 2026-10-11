"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Heading, Text, Button, Link } from "@noahwright/design";
import SiteShell from "@/components/SiteShell";
import "./not-found-page.css";

// A nod to Doors 97 (see /projects): the 404 is a late-90s blue screen.
// "Press any key" really does go home. Tab, modifier keys, and any key pressed
// while a link or control has focus are left alone, so keyboard users can still
// reach and activate the links below.
const IGNORED_KEYS = new Set(["Tab", "Shift", "Control", "Alt", "Meta", "CapsLock", "Escape"]);

export default function NotFoundPageClient() {
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (IGNORED_KEYS.has(event.key) || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("a, button, input, textarea, select, [contenteditable]")) return;
      router.push("/");
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return (
    <SiteShell calmFooter>
      <Container padding="lg">
        <div className="bsod" role="alert">
          <span className="bsod__badge">Doors</span>
          <p>
            A fatal exception 404 has occurred at noahwright.dev. The page you requested
            could not be found. It may have moved, been deleted, or never existed at all.
          </p>
          <p>* Check the address for typos. It happens to the best of us.</p>
          <p>* Press CTRL+ALT+DEL to reboot. (Please don&rsquo;t, it won&rsquo;t help.)</p>
          <p className="bsod__prompt">
            Press any key to continue <span className="bsod__cursor" aria-hidden="true">_</span>
          </p>
        </div>

        <Container direction="vertical" itemSpacing="sm" padding="none">
          <Heading level={1}>Page not found</Heading>
          <Text>Nothing lives at this address. Try one of these instead:</Text>
          <Container direction="horizontal" itemSpacing="sm" padding="none">
            <Link href="/">
              <Button variant="solid" color="primary">Home</Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline">Projects</Button>
            </Link>
          </Container>
        </Container>
      </Container>
    </SiteShell>
  );
}
