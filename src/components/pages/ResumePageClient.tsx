"use client";

import { Container, Heading, Text, Button, Link } from "@noahwright/design";
import SiteShell from "@/components/SiteShell";
import ResumeTimeline from "@/components/resume/ResumeTimeline";
import { SITE } from "@/lib/site";
import { RESUME_SUMMARY } from "@/lib/resume";
import { COPY } from "@/content/copy";
import "./resume-page.css";

export default function ResumePageClient() {
  return (
    <SiteShell calmFooter>
      <Container padding="lg">
        <Container direction="vertical" itemSpacing="md" padding="none">
          <div className="resume__head">
            <Heading level={1}>{COPY.resume.heading.text}</Heading>
            <a
              className="resume__download"
              href={SITE.resumePdfUrl}
              download={SITE.resumePdfFilename}
              aria-label="Download resume as PDF"
            >
              <Button variant="solid" color="primary">
                {COPY.resume.downloadButton.text}
              </Button>
            </a>
          </div>
          <Text>{RESUME_SUMMARY}</Text>
        </Container>
      </Container>

      <Container padding="lg">
        <ResumeTimeline />
      </Container>

      {/* A second chance to grab the one-pager after scrolling the whole
          history. The full detail lives in the timeline above; the PDF is the
          summary. */}
      <Container padding="lg">
        <div className="resume__cta">
          <a
            className="resume__download"
            href={SITE.resumePdfUrl}
            download={SITE.resumePdfFilename}
            aria-label="Download resume as PDF"
          >
            <Button variant="solid" color="primary">
              {COPY.resume.downloadAgainButton.text}
            </Button>
          </a>
          <Link href="/contact">{COPY.resume.contactLink.text}</Link>
        </div>
      </Container>
    </SiteShell>
  );
}
