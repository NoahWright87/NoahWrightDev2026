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
            I'm always interested in new opportunities, collaborations, and interesting conversations. Whether you have a project in mind, want to discuss engineering leadership, or just want to connect, feel free to reach out.
          </Text>
          <Container direction="horizontal" itemSpacing="sm">
            <a href={`mailto:${SITE.email}`}>
              <Button variant="solid" color="primary">
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <EmailIcon size={18} />
                  Email Me
                </span>
              </Button>
            </a>
            <a href={SITE.linkedIn} target="_blank" rel="noreferrer">
              <Button variant="outline">
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <LinkedInIcon size={18} />
                  Connect on LinkedIn
                </span>
              </Button>
            </a>
          </Container>
        </Container>
      </Container>
    </SiteShell>
  );
}
