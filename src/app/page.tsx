"use client";
import {
  Header,
  Footer,
  Layout,
  Container,
  Heading,
  Text,
  Button,
  Link,
  Menu,
  MenuItem,
  HamburgerMenu,
} from "@noahwright/design";
import { SITE, NAV_ITEMS } from "@/lib/site";

export default function HomePage() {
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
      {/* Hero */}
      <Container padding="xl">
        <Container direction="vertical" itemSpacing="lg">
          <Heading level={1}>{SITE.name}</Heading>
          <Heading level={2}>[PLACEHOLDER: Engineering leader tagline]</Heading>
          <Text>
            [PLACEHOLDER: 2–3 sentence personal pitch for recruiters, hiring managers, and peers.]
          </Text>
          <Container direction="horizontal" itemSpacing="sm">
            <a href={SITE.resumeUrl} download>
              <Button variant="solid" color="primary">Download Resume</Button>
            </a>
            <a href={SITE.linkedIn} target="_blank" rel="noreferrer">
              <Button variant="outline">LinkedIn</Button>
            </a>
          </Container>
        </Container>
      </Container>

      {/* Quick nav to main sections */}
      <Container padding="lg">
        <Container direction="horizontal" itemSpacing="md">
          <Link href="/projects">View Projects →</Link>
          <Link href="/about">About Me →</Link>
          <Link href="/contact">Get in Touch →</Link>
        </Container>
      </Container>
    </Layout>
  );
}
