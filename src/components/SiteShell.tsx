"use client";

import { useEffect, useState } from "react";
import {
  Header,
  Footer,
  Layout,
  Container,
  Text,
  Link,
  Menu,
  MenuItem,
  HamburgerMenu,
  ToggleIcon,
  toggleThemeMode,
  initThemeMode,
} from "@noahwright/design";
import { NAV_ITEMS, SITE } from "@/lib/site";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(initThemeMode() === "dark");
  }, []);

  const navMenuItems = NAV_ITEMS.map((item) => (
    <MenuItem key={item.href} label={item.label} href={item.href} />
  ));

  return (
    <Layout
      header={
        <Header
          left={
            <nav aria-label="Primary">
              <Menu trigger={<HamburgerMenu />} items={navMenuItems} align="left" />
            </nav>
          }
          center={
            <Link href="/">
              <strong>{SITE.name}</strong>
            </Link>
          }
          right={
            <ToggleIcon
              preset="moon-sun"
              isToggled={isDark}
              onChange={() => {
                const next = toggleThemeMode();
                setIsDark(next === "dark");
              }}
              label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            />
          }
        />
      }
      footer={
        <Footer
          center={
            <Text>© {new Date().getFullYear()} {SITE.name}</Text>
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

