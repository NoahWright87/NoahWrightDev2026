"use client";

import { Container, Heading, Text, Button } from "@noahwright/design";
import SiteShell from "@/components/SiteShell";
import EmailIcon from "@/components/icons/EmailIcon";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import { SITE } from "@/lib/site";

export default function ContactPageClient() {
  return (
    <SiteShell>
      <Container padding="xl">
        <Container direction="vertical" itemSpacing="lg">
          <Heading level={1}>Get in Touch</Heading>
          <Text>
            I&rsquo;m always interested in new opportunities, collaborations, and interesting conversations. Whether you have a project in mind, want to discuss engineering leadership, or just want to connect, feel free to reach out.
          </Text>
          <Container direction="horizontal" itemSpacing="sm">
            <a href={`mailto:${SITE.email}`}>
              <Button variant="solid" color="primary" icon={<EmailIcon size={18} />}>
                Email Me
              </Button>
            </a>
            <a href={SITE.linkedIn} target="_blank" rel="noreferrer">
              <Button variant="outline" icon={<LinkedInIcon size={18} />}>
                Connect on LinkedIn
              </Button>
            </a>
          </Container>
        </Container>
      </Container>
    </SiteShell>
  );
}
