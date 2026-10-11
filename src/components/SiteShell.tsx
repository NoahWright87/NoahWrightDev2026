"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  Header,
  SceneFooter,
  Layout,
  Container,
  Link,
  MobileNav,
} from "@noahwright/design";
import EasterEggs from "@/components/EasterEggs";
import Logo from "@/components/Logo";
import EmailIcon from "@/components/icons/EmailIcon";
import GitHubIcon from "@/components/icons/GitHubIcon";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import SettingsMenu from "@/components/SettingsMenu";
import { NAV_ITEMS, SITE } from "@/lib/site";

const CONTACT_LINKS = [
  { label: "Email", href: `mailto:${SITE.email}`, icon: <EmailIcon size={20} />, external: false },
  { label: "LinkedIn", href: SITE.linkedIn, icon: <LinkedInIcon size={20} />, external: true },
  { label: "GitHub", href: SITE.github, icon: <GitHubIcon size={20} />, external: true },
] as const;

// The footer's horizon scene: the sun and moon sit toward the middle so their reflections
// stay clear of the © line (left) and the contact icons (right). Module-level so the
// reference is stable across renders. The scene itself ships in the design package and
// loads lazily; see SceneFooter's spec there.
const FOOTER_SCENE_OPTIONS = { sunX: 0.62, moonX: 0.38 };

export default function SiteShell({
  children,
  calmFooter = false,
}: {
  children: React.ReactNode;
  /**
   * Show only the footer's still, CSS-only look and never load its animation, unless the reader
   * picked a footer style in the ⚙️ menu (that explicit choice wins everywhere).
   * For pages that are already busy (the pinned resume timeline) or have a look of their own (404).
   */
  calmFooter?: boolean;
}) {
  const pathname = usePathname();

  return (
    <Layout
      header={
        <Header
          shadow={false}
          left={
            <Link href="/" className="site-home-link">
              {/* The logo always; the name too on wider screens. On phones the
                  name stays in the accessible text (see .site-name in globals.css). */}
              <Logo className="site-logo" />
              <strong className="site-name">{SITE.name}</strong>
            </Link>
          }
          right={
            <>
              {/* Inline links on desktop, a hamburger dropdown on phones. */}
              <MobileNav label="Site menu">
                {/* Client-side navigation; MobileNav closes its phone dropdown on
                    click (closeOnNavigate, design PR #25). */}
                {NAV_ITEMS.map((item) => (
                  <NextLink
                    key={item.href}
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    {item.label}
                  </NextLink>
                ))}
              </MobileNav>
              {/* Theme and footer style: the ⚙️ menu replaced the one-tap moon/sun toggle. */}
              <SettingsMenu />
            </>
          }
        />
      }
      footer={
        <SceneFooter
          scene="horizon"
          sceneOptions={FOOTER_SCENE_OPTIONS}
          animate={!calmFooter}
          left={<span>© {new Date().getFullYear()} {SITE.name}</span>}
          right={
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
        />
      }
    >
      <Container direction="vertical" alignItems="center" padding="none" noGutters>
        <Container direction="vertical" fullWidth={false} width="min(100%, 1000px)" padding="none" noGutters>
          {children}
        </Container>
      </Container>
      <EasterEggs />
    </Layout>
  );
}
