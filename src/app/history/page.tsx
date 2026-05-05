"use client";
import {
  Header,
  Footer,
  Layout,
  Container,
  Heading,
  Text,
  Link,
  Menu,
  MenuItem,
  HamburgerMenu,
} from "@noahwright/design";
import { SITE, NAV_ITEMS } from "@/lib/site";

export default function HistoryPage() {
  const navMenuItems = NAV_ITEMS.map((item) => (
    <MenuItem key={item.href} label={item.label} href={item.href} />
  ));

  return (
    <Layout
      header={
        <Header
          left={<Menu trigger={<HamburgerMenu />} items={navMenuItems} align="left" />}
          center={
            <Link href="/">
              <strong>{SITE.name}</strong>
            </Link>
          }
        />
      }
      footer={<Footer center={`© ${new Date().getFullYear()} ${SITE.name}`} />}
    >
      <Container padding="xl">
        <Container direction="vertical" itemSpacing="lg">
          <Heading level={1}>Site History</Heading>
          <Text>
            This site is one of several iterations of my personal developer site.
            Below is a brief record of where it has been.
          </Text>
        </Container>
      </Container>

      <Container padding="lg">
        <Container direction="vertical" itemSpacing="lg">
          <Container direction="vertical" itemSpacing="sm">
            <Heading level={2}>2026 — This Site</Heading>
            <Text>
              A complete reset. Built with Next.js, the{" "}
              <Link href="https://github.com/NoahWright87/design" isExternal>
                @noahwright/design
              </Link>{" "}
              system, and deployed on Netlify. Personal business-card focus.
            </Text>
          </Container>

          <Container direction="vertical" itemSpacing="sm">
            <Heading level={2}>Previous Iteration — NoahWright.dev</Heading>
            <Text>
              The prior site was a Jekyll-based blog and portfolio using the Minimal Mistakes theme,
              hosted on GitHub Pages. It featured 26 posts written between 2021 and 2022 covering
              career advice, engineering topics, and learning in public.
            </Text>
            <Text>
              <Link href={SITE.previousSiteUrl} isExternal>
                View previous site
              </Link>
              {" "}(will move to archive.noahwright.dev in the future)
            </Text>
          </Container>
        </Container>
      </Container>
    </Layout>
  );
}
