"use client";

import { Container, Heading, Text, Button, Link } from "@noahwright/design";
import SiteShell from "@/components/SiteShell";

export default function ResumePageClient() {
  return (
    <SiteShell>
      <Container padding="lg">
        <Container direction="vertical" itemSpacing="md">
          <Heading level={1}>Resume</Heading>
          <Text>
            This page is a placeholder for the upcoming web resume. The final resume content
            and downloadable PDF will be added in a follow-up update.
          </Text>
          <Container direction="horizontal" itemSpacing="md" padding="none">
            <Link href="/about">
              <Button variant="outline">Back to About</Button>
            </Link>
            <Link href="/contact">
              <Button variant="solid" color="primary">Get in Touch</Button>
            </Link>
          </Container>
        </Container>
      </Container>
    </SiteShell>
  );
}
