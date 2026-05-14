"use client";

import { Container, Heading, Text, Card, Link, Pill } from "@noahwright/design";
import SiteShell from "@/components/SiteShell";
import { projects } from "@/lib/projects";

export default function ProjectsPageClient() {
  return (
    <SiteShell>
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
    </SiteShell>
  );
}
