"use client";

import { Container, Heading, Text, Button } from "@noahwright/design";
import SiteShell from "@/components/SiteShell";
import EmailIcon from "@/components/icons/EmailIcon";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import GitHubIcon from "@/components/icons/GitHubIcon";
import { SITE } from "@/lib/site";
import { COPY } from "@/content/copy";

export default function ContactPageClient() {
  return (
    <SiteShell>
      <Container padding="xl">
        <Container direction="vertical" itemSpacing="lg">
          <Heading level={1}>{COPY.contact.heading.text}</Heading>
          <Text>{COPY.contact.intro.text}</Text>
          <Container direction="horizontal" itemSpacing="sm">
            <a href={`mailto:${SITE.email}`}>
              <Button variant="solid" color="primary" icon={<EmailIcon size={18} />}>
                {COPY.contact.emailButton.text}
              </Button>
            </a>
            <a href={SITE.linkedIn} target="_blank" rel="noreferrer">
              <Button variant="outline" icon={<LinkedInIcon size={18} />}>
                {COPY.contact.linkedInButton.text}
              </Button>
            </a>
            <a href={SITE.github} target="_blank" rel="noreferrer">
              <Button variant="outline" icon={<GitHubIcon size={18} />}>
                {COPY.contact.gitHubButton.text}
              </Button>
            </a>
          </Container>
        </Container>
      </Container>
    </SiteShell>
  );
}
