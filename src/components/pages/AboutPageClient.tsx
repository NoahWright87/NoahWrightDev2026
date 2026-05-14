"use client";

import { Container, Heading, Text, Button, Link } from "@noahwright/design";
import SiteShell from "@/components/SiteShell";
import { SITE } from "@/lib/site";

export default function AboutPageClient() {
  return (
    <SiteShell>
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

          <Container direction="horizontal" itemSpacing="md" padding="none">
            <Link href="/contact">
              <Button variant="solid" color="primary">Get in Touch</Button>
            </Link>
            <a href={SITE.resumeUrl} download>
              <Button variant="outline">Download Resume</Button>
            </a>
          </Container>
        </Container>
      </Container>
    </SiteShell>
  );
}
