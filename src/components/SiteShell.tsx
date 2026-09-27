"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Header,
  Footer,
  Layout,
  Container,
  Text,
  Link,
  MobileNav,
  ToggleIcon,
  toggleThemeMode,
  initThemeMode,
} from "@noahwright/design";
import EmailIcon from "@/components/icons/EmailIcon";
import GitHubIcon from "@/components/icons/GitHubIcon";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import { NAV_ITEMS, SITE } from "@/lib/site";

const CONTACT_LINKS = [
  { label: "Email", href: `mailto:${SITE.email}`, icon: <EmailIcon size={20} />, external: false },
  { label: "LinkedIn", href: SITE.linkedIn, icon: <LinkedInIcon size={20} />, external: true },
  { label: "GitHub", href: SITE.github, icon: <GitHubIcon size={20} />, external: true },
] as const;

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsDark(initThemeMode() === "dark");
  }, []);

  return (
    <Layout
      header={
        // Unslotted on purpose: Header's slots are `position: relative`, which
        // would anchor MobileNav's phone dropdown to the slot (hamburger-wide)
        // instead of the full header width.
        <Header>
          <Link href="/">
            <strong>{SITE.name}</strong>
          </Link>
          <div className="site-nav">
            {/* Inline links on desktop, a hamburger dropdown on phones. */}
            <MobileNav label="Site menu">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </a>
              ))}
            </MobileNav>
          </div>
          <ToggleIcon
            preset="moon-sun"
            isToggled={isDark}
            onChange={() => {
              const next = toggleThemeMode();
              setIsDark(next === "dark");
            }}
            label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          />
        </Header>
      }
      footer={
        <Footer
          center={
            <div className="site-footer__links">
              {CONTACT_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  title={link.label}
                  {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          }
          bottom={
            <Text tone="muted">© {new Date().getFullYear()} {SITE.name}</Text>
          }
        />
      }
    >
      <Container direction="vertical" alignItems="center" padding="none" noGutters>
        <Container direction="vertical" fullWidth={false} width="min(100%, 1000px)" padding="none" noGutters>
          {children}
        </Container>
      </Container>
    </Layout>
  );
}
