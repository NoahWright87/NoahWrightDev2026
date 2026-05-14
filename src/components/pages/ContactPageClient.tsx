"use client";

import { Container, Heading, Text, Button } from "@noahwright/design";
import SiteShell from "@/components/SiteShell";
import { SITE } from "@/lib/site";

export default function ContactPageClient() {
  return (
    <SiteShell>
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
    </SiteShell>
  );
}
