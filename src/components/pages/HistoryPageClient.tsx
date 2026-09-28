"use client";

import { Container, Heading, Text, Link, Pill, Button, Card, CardFooter } from "@noahwright/design";
import GitHubIcon from "@/components/icons/GitHubIcon";
import SiteShell from "@/components/SiteShell";
import { siteVersions } from "@/lib/siteHistory";

export default function HistoryPageClient() {
  return (
    <SiteShell>
      <Container padding="xl">
        <Container direction="vertical" itemSpacing="lg">
          <Heading level={1}>Site History</Heading>
          <Text>
            Every version of this site that made it into the world. The old blog is still
            online, if you want to see how things have changed.
          </Text>
        </Container>
      </Container>

      <Container padding="lg">
        <Container direction="vertical" itemSpacing="md">
          {siteVersions.map((version) => (
            <Card
              titleAs="h2"
              key={version.id}
              title={`${version.years} · ${version.name}`}
              subtitle={
                <Container direction="horizontal" itemSpacing="xs" padding="none" noGutters>
                  {version.stack.map((tech) => (
                    <Pill key={tech} size="small">{tech}</Pill>
                  ))}
                </Container>
              }
              footer={
                <CardFooter align="end">
                  <Container direction="horizontal" itemSpacing="sm" padding="none" noGutters>
                    <Link href={version.repoUrl} isExternal>
                      <Button variant="ghost" icon={<GitHubIcon size={18} />}>GitHub</Button>
                    </Link>
                    {version.liveUrl ? (
                      <Link href={version.liveUrl} isExternal>
                        <Button variant="solid">Visit</Button>
                      </Link>
                    ) : null}
                  </Container>
                </CardFooter>
              }
            >
              <Text>{version.summary}</Text>
            </Card>
          ))}
        </Container>
      </Container>
    </SiteShell>
  );
}
