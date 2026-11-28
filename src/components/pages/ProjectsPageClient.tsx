"use client";

import { Container, Heading, Text, Card, CardFooter, Link, Image, Button, Pill, Carousel } from "@noahwright/design";
import GitHubIcon from "../icons/GitHubIcon";
import SiteShell from "@/components/SiteShell";
import { projects } from "@/lib/projects";
import { COPY } from "@/content/copy";

export default function ProjectsPageClient() {
  return (
    <SiteShell>
      <Container padding="xl">
        <Container direction="vertical" itemSpacing="lg">
          <Heading level={1}>{COPY.projects.heading.text}</Heading>
          <Text>{COPY.projects.intro.text}</Text>
        </Container>
      </Container>

      <Container padding="lg">
        <Container direction="vertical" itemSpacing="md">
          {projects.map((project, index) => (
            <Card
              titleAs="h2"
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
              image={project.images.length > 0 ? (
                <Carousel
                  items={project.images.map((image) => (
                    <Image
                      key={image.src}
                      src={image.src}
                      alt={image.alt}
                      aspectRatio="16/9"
                    />
                  ))}
                  aria-label={`${project.name} screenshots`}
                />
              ) : undefined}
              mediaPosition={index % 2 === 0 ? "left" : "right"}
              longDescription={<Text>{project.summary}</Text>}
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
                    {project.liveUrl ? (
                      <Link href={project.liveUrl} isExternal>
                        <Button variant="solid">Live Site</Button>
                      </Link>
                    ) : null}
                  </Container>
                </CardFooter>
              }
            />
          ))}
        </Container>
      </Container>
    </SiteShell>
  );
}
