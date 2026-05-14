"use client";

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
} from "@noahwright/design";
import { NAV_ITEMS, SITE } from "@/lib/site";

export default function SiteShell({ children }: { children: React.ReactNode }) {
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
        />
      }
      footer={
        <Footer
          center={
            <Container direction="vertical" itemSpacing="xs" padding="none">
              <Text>© {new Date().getFullYear()} {SITE.name}</Text>
              <nav aria-label="Secondary">
                <Link href="/history">History</Link>
              </nav>
            </Container>
          }
        />
      }
    >
      {children}
    </Layout>
  );
}
