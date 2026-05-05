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

export default function ContactPage() {
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
          <Heading level={1}>Get in Touch</Heading>
          <Text>
            [PLACEHOLDER: 1-2 sentence welcome message for people reaching out — e.g.,
            whether for opportunities, collaborations, or just to connect.]
          </Text>
          <Container direction="vertical" itemSpacing="md">
            <a href={`mailto:${SITE.email}`}>
              <Button variant="solid" color="primary">Email Me</Button>
            </a>
            <a href={SITE.linkedIn} target="_blank" rel="noreferrer">
              <Button variant="outline">Connect on LinkedIn</Button>
            </a>
          </Container>
        </Container>
      </Container>
    </Layout>
  );
}
