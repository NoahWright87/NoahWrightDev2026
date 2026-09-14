"use client";

import { Container, Heading, Text, Card, CardGrid, Image, Link } from "@noahwright/design";
import SiteShell from "@/components/SiteShell";
import { portraits, PORTRAIT_ART_DIRECTION, PORTRAIT_GENERATION_NOTE } from "@/lib/portraits";

const README_URL =
  "https://github.com/NoahWright87/NoahWrightDev2026/blob/main/public/images/noah/README.md";

export default function PortraitsPageClient() {
  return (
    <SiteShell>
      <Container padding="xl">
        <Container direction="vertical" itemSpacing="md">
          <Heading level={1}>The Many Faces of Noah</Heading>
          <Text>
            The photo rotating through the home page hero is one of eleven — a real portrait plus
            ten AI-generated reimaginings of it, each redesigned for a different visual world
            rather than just filtered.
          </Text>
          <Text tone="muted">{PORTRAIT_ART_DIRECTION}</Text>
          <Text tone="muted">
            {PORTRAIT_GENERATION_NOTE}{" "}
            <Link href={README_URL} isExternal>
              Full generation notes and prompts
            </Link>
            .
          </Text>
        </Container>
      </Container>

      <Container padding="lg">
        <CardGrid minCardWidth="260px">
          {portraits.map((portrait) => (
            <Card
              key={portrait.id}
              title={portrait.style}
              image={
                <Image
                  src={`/images/noah/web/${portrait.file}.webp`}
                  alt={portrait.alt}
                  aspectRatio="1/1"
                />
              }
              elevated
              longDescription={<Text>{portrait.direction}</Text>}
            >
              <Text tone="muted">{portrait.description}</Text>
            </Card>
          ))}
        </CardGrid>
      </Container>
    </SiteShell>
  );
}
