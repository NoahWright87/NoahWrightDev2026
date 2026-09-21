"use client";

import { Container, Heading, Text, Button, Link, Pill } from "@noahwright/design";
import SiteShell from "@/components/SiteShell";
import ResumeTimeline from "@/components/resume/ResumeTimeline";
import { SITE } from "@/lib/site";
import {
  RESUME_MARKERS,
  RESUME_SKILL_GROUPS,
  RESUME_SUMMARY,
  jobColorVar,
  markerEntry,
} from "@/lib/resume";
import "./resume-page.css";

export default function ResumePageClient() {
  return (
    <SiteShell>
      <Container padding="lg">
        <Container direction="vertical" itemSpacing="md" padding="none">
          <div className="resume__head">
            <Heading level={1}>Resume</Heading>
            <a
              className="resume__download"
              href={SITE.resumePdfUrl}
              download
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

      <Container padding="lg">
        <Container direction="vertical" itemSpacing="md" padding="none">
          <Heading level={2}>Education, Awards &amp; Certifications</Heading>
          <ul className="resume__markers">
            {RESUME_MARKERS.map((marker) => {
              const entry = markerEntry(marker);
              return (
                <li key={marker.id} className="resume__marker">
                  <span
                    className="resume__marker-dot"
                    style={{ background: entry ? jobColorVar(entry) : "var(--job-usaf)" }}
                    aria-hidden="true"
                  />
                  <div>
                    <div className="resume__marker-head">
                      <strong>{marker.label}</strong>
                      <span className="resume__marker-date">{marker.dateLabel}</span>
                    </div>
                    <Text tone="muted">{marker.detail}</Text>
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </Container>

      <Container padding="lg">
        <Container direction="vertical" itemSpacing="md" padding="none">
          <Heading level={2}>Skills</Heading>
          {RESUME_SKILL_GROUPS.map((group) => (
            <Container key={group.category} direction="vertical" itemSpacing="xs" padding="none">
              <Heading level={3}>{group.category}</Heading>
              <div className="resume__skills">
                {group.skills.map((skill) => (
                  <Pill key={skill} variant="secondary" size="small">
                    {skill}
                  </Pill>
                ))}
              </div>
            </Container>
          ))}
        </Container>
      </Container>

      <Container padding="lg">
        <Container direction="horizontal" itemSpacing="md" padding="none" wrap="always">
          <Link href={SITE.resumePdfUrl}>Download PDF</Link>
          <Link href="/contact">Get in touch</Link>
        </Container>
      </Container>
    </SiteShell>
  );
}
