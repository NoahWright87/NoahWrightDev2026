"use client";

import {
  Header,
  Footer,
  Layout,
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
            <Text>© {new Date().getFullYear()} {SITE.name}</Text>
          }
        />
      }
    >
      {children}
    </Layout>
  );
}
