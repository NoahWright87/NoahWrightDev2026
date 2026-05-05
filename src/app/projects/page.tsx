"use client";
import {
  Header,
  Footer,
  Layout,
  Container,
  Heading,
  Text,
  Card,
  Link,
  Pill,
  Menu,
  MenuItem,
  HamburgerMenu,
} from "@noahwright/design";
import { SITE, NAV_ITEMS } from "@/lib/site";
import { projects } from "@/lib/projects";

export default function ProjectsPage() {
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
          <Heading level={1}>Projects</Heading>
          <Text>[PLACEHOLDER: brief intro describing the types of projects shown here]</Text>
        </Container>
      </Container>

      <Container padding="lg">
        <Container direction="vertical" itemSpacing="md">
          {projects.map((project) => (
            <Card
              key={project.id}
              title={project.name}
              subtitle={
                project.tags.length > 0
                  ? project.tags.join(" · ")
                  : undefined
              }
            >
              <Text>{project.summary}</Text>
              <div style={{ marginTop: "0.75rem" }}>
                <Container direction="horizontal" itemSpacing="sm" padding="none">
                  {project.tags.map((tag) => (
                    <Pill key={tag}>{tag}</Pill>
                  ))}
                </Container>
              </div>
              {project.href && (
                <div style={{ marginTop: "0.75rem" }}>
                  <Link href={project.href} isExternal>
                    {project.hrefLabel ?? project.href}
                  </Link>
                </div>
              )}
            </Card>
          ))}
        </Container>
      </Container>
    </Layout>
  );
}
