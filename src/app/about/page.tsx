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

export default function AboutPage() {
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
          <Heading level={1}>About</Heading>
        </Container>
      </Container>

      <Container padding="lg">
        <Container direction="vertical" itemSpacing="lg">
          <Container direction="vertical" itemSpacing="sm">
            <Heading level={2}>[PLACEHOLDER: Section heading — e.g., &ldquo;Who I Am&rdquo;]</Heading>
            <Text>
              [PLACEHOLDER: Personal narrative paragraph. Include engineering leadership
              background, USAF service, and what drives you professionally.]
            </Text>
          </Container>

          <Container direction="vertical" itemSpacing="sm">
            <Heading level={2}>[PLACEHOLDER: Section heading — e.g., &ldquo;What I Build&rdquo;]</Heading>
            <Text>
              [PLACEHOLDER: Professional focus areas — teams, products, engineering culture.]
            </Text>
          </Container>

          <Container direction="vertical" itemSpacing="sm">
            <Heading level={2}>[PLACEHOLDER: Section heading — e.g., &ldquo;Outside Work&rdquo;]</Heading>
            <Text>
              [PLACEHOLDER: Personal interests, family, community involvement.]
            </Text>
          </Container>
        </Container>
      </Container>
    </Layout>
  );
}
