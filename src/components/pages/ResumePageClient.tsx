"use client";

import { Container, Heading, Text, Button, Link } from "@noahwright/design";
import SiteShell from "@/components/SiteShell";
import ResumeTimeline from "@/components/resume/ResumeTimeline";
import { SITE } from "@/lib/site";
import { RESUME_SUMMARY } from "@/lib/resume";
import "./resume-page.css";

export default function ResumePageClient() {
  return (
    <SiteShell calmFooter>
      <Container padding="lg">
        <Container direction="vertical" itemSpacing="md" padding="none">
          <div className="resume__head">
            <Heading level={1}>Resume</Heading>
            <a
              className="resume__download"
              href={SITE.resumePdfUrl}
              download={SITE.resumePdfFilename}
              aria-label="Download resume as PDF"
            >
              <Button variant="solid" color="primary">
                Download PDF
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
              Download the one-page PDF
            </Button>
          </a>
          <Link href="/contact">Get in touch</Link>
        </div>
      </Container>
    </SiteShell>
  );
}
