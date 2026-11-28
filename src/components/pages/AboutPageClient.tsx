"use client";

import { Container, Heading, Text, Button, Link } from "@noahwright/design";
import SiteShell from "@/components/SiteShell";
import { SITE } from "@/lib/site";
import { COPY } from "@/content/copy";

export default function AboutPageClient() {
  return (
    <SiteShell>
      <Container padding="lg">
        {/* Cap the line length for comfortable reading; full width ran ~130 characters. */}
        <Container direction="vertical" itemSpacing="md" fullWidth={false} width="min(100%, 72ch)">
          <Heading level={1}>{COPY.about.heading.text}</Heading>

          <Container direction="vertical" itemSpacing="xs">
            <Heading level={2}>{COPY.about.whoIAmHeading.text}</Heading>
            {COPY.about.whoIAm.map((paragraph) => (
              <Text key={paragraph.text}>{paragraph.text}</Text>
            ))}
          </Container>

          <Container direction="vertical" itemSpacing="xs">
            <Heading level={2}>{COPY.about.whatIBuildHeading.text}</Heading>
            {COPY.about.whatIBuild.map((paragraph) => (
              <Text key={paragraph.text}>{paragraph.text}</Text>
            ))}
          </Container>

          <Container direction="vertical" itemSpacing="xs">
            <Heading level={2}>{COPY.about.outsideWorkHeading.text}</Heading>
            {COPY.about.outsideWork.map((paragraph) => (
              <Text key={paragraph.text}>{paragraph.text}</Text>
            ))}
          </Container>

          <Container direction="horizontal" itemSpacing="md" padding="none">
            <Link href="/contact">
              <Button variant="solid" color="primary">{COPY.about.contactButton.text}</Button>
            </Link>
            <Link href={SITE.resumeUrl}>
              <Button variant="outline">{COPY.about.resumeButton.text}</Button>
            </Link>
          </Container>
        </Container>
      </Container>
    </SiteShell>
  );
}
