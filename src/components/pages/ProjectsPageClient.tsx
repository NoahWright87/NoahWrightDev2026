"use client";

import { Container, Heading, Text, Card, CardFooter, Link, Image, Button, Pill } from "@noahwright/design";
import GitHubIcon from "../icons/GitHubIcon";
import SiteShell from "@/components/SiteShell";
import { projects } from "@/lib/projects";

export default function ProjectsPageClient() {
  return (
    <SiteShell>
      <Container padding="xl" gutterBorder="medium">
        <Container direction="vertical" itemSpacing="lg">
          <Heading level={1}>Projects</Heading>
          <Text>
            A mix of tools, games, and platform experiments that reflect how I like to build:
            practical foundations, interesting technical constraints, and a little room for play.
          </Text>
        </Container>
      </Container>

      <Container padding="lg" gutterBorder="medium">
        <Container direction="vertical" itemSpacing="md">
          {projects.map((project, index) => (
            <Card
              key={project.id}
              title={project.name}
              subtitle={project.tags.length > 0 ? (
                <Container direction="horizontal" itemSpacing="xs" padding="none" noGutters>
                  {project.tags.map((tag) => (
                    <Pill key={`${project.id}-${tag}`} size="small">
                      {tag}
                    </Pill>
                  ))}
                </Container>
              ) : undefined}
              image={(
                <Image
                  src={project.imageSrc}
                  alt={`${project.name} placeholder preview image`}
                  aspectRatio="16/9"
                  rounded="md"
                />
              )}
              mediaPosition={index % 2 === 0 ? "left" : "right"}
              footer={
                <CardFooter align="end">
                  <Container direction="horizontal" itemSpacing="sm" padding="none" noGutters>
                    {project.id === "noahwrightdev2026" ? (
                      <Link href="/history">
                        <Button variant="outline">History</Button>
                      </Link>
                    ) : null}
                    <Link href={project.repoUrl} isExternal>
                      <Button variant="ghost" icon={<GitHubIcon size={18} />}>
                        GitHub
                      </Button>
                    </Link>
                    <Link href={project.liveUrl} isExternal>
                      <Button variant="solid">Live Site</Button>
                    </Link>
                  </Container>
                </CardFooter>
              }
            >
              <Text>{project.summary}</Text>
            </Card>
          ))}
        </Container>
      </Container>
    </SiteShell>
  );
}
