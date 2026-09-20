"use client";

/**
 * TEMPORARY — shared chrome for the `/resume1`–`/resume5` layout prototypes.
 * Gives every variant the same header, legend, trailing resume sections, and
 * a switcher so they can be compared back to back. Delete along with the
 * prototype routes once a layout is chosen.
 */

import { Container, Heading, Text, Link, Pill } from "@noahwright/design";
import SiteShell from "@/components/SiteShell";
import {
  RESUME_LANES,
  RESUME_MARKERS,
  RESUME_SKILL_GROUPS,
  RESUME_SUMMARY,
  laneColorVar,
} from "@/lib/resumeDemo";
import "./variant-chrome.css";

export const VARIANTS = [
  { slug: "resume6", name: "Pinned Rail", blurb: "Pinned tree, one job at a time", round: 2 },
  { slug: "resume7", name: "Dual Focus", blurb: "Same, but splits through the overlap", round: 2 },
  { slug: "resume8", name: "Time Reel", blurb: "To-scale tree with a live date", round: 2 },
  { slug: "resume1", name: "Branch Rail", blurb: "Graph in a rail, content in one column", round: 1 },
  { slug: "resume2", name: "Parallel Tracks", blurb: "Two real columns through the overlap", round: 1 },
  { slug: "resume3", name: "Time Scrubber", blurb: "Horizontal time axis you explore", round: 1 },
  { slug: "resume4", name: "Metro Map", blurb: "Transit-map lines and stations", round: 1 },
  { slug: "resume5", name: "Quiet Spine", blurb: "Restrained, recruiter-first", round: 1 },
] as const;

export function VariantSwitcher({ current }: { current: string }) {
  return (
    <nav className="vchrome__switcher" aria-label="Resume layout prototypes">
      <span className="vchrome__switcher-label">Round 2:</span>
      <ul className="vchrome__switcher-list">
        {VARIANTS.filter((v) => v.round === 2).map((v) => (
          <li key={v.slug}>
            <a
              href={`/${v.slug}`}
              className={
                v.slug === current
                  ? "vchrome__switcher-link vchrome__switcher-link--current"
                  : "vchrome__switcher-link"
              }
              aria-current={v.slug === current ? "page" : undefined}
            >
              {v.name}
            </a>
          </li>
        ))}
      </ul>
      <span className="vchrome__switcher-label">Round 1:</span>
      <ul className="vchrome__switcher-list">
        {VARIANTS.filter((v) => v.round === 1).map((v) => (
          <li key={v.slug}>
            <a
              href={`/${v.slug}`}
              className={
                v.slug === current
                  ? "vchrome__switcher-link vchrome__switcher-link--current vchrome__switcher-link--past"
                  : "vchrome__switcher-link vchrome__switcher-link--past"
              }
              aria-current={v.slug === current ? "page" : undefined}
            >
              {v.name}
            </a>
          </li>
        ))}
      </ul>
      <a className="vchrome__switcher-link vchrome__switcher-link--exit" href="/resume">
        All options
      </a>
    </nav>
  );
}

export function VariantHeader({
  current,
  name,
  idea,
}: {
  current: string;
  name: string;
  idea: string;
}) {
  return (
    <Container padding="lg">
      <Container direction="vertical" itemSpacing="md" padding="none">
        <VariantSwitcher current={current} />
        <Container direction="vertical" itemSpacing="xs" padding="none">
          <Heading level={1}>Noah Wright</Heading>
          <Text>{RESUME_SUMMARY}</Text>
        </Container>
        <div className="vchrome__note">
          <strong>{name}</strong> — {idea} Placeholder content throughout.
        </div>
        <LaneLegend />
      </Container>
    </Container>
  );
}

export function LaneLegend() {
  return (
    <ul className="vchrome__legend">
      {RESUME_LANES.map((lane) => (
        <li key={lane.id} className="vchrome__legend-item">
          <span
            className="vchrome__legend-swatch"
            style={{ background: laneColorVar(lane.id) }}
            aria-hidden="true"
          />
          <span>{lane.label}</span>
        </li>
      ))}
      <li className="vchrome__legend-item">
        <span className="vchrome__legend-swatch vchrome__legend-swatch--overlap" aria-hidden="true" />
        <span>Both at once (2016&ndash;2019)</span>
      </li>
    </ul>
  );
}

/** Awards, certifications, education and the skill groups — identical in every variant. */
export function VariantFooterSections() {
  return (
    <>
      <Container padding="lg">
        <Container direction="vertical" itemSpacing="md" padding="none">
          <Heading level={2}>Education, Awards &amp; Certifications</Heading>
          <ul className="vchrome__markers">
            {RESUME_MARKERS.map((marker) => (
              <li key={marker.id} className="vchrome__marker">
                <span
                  className="vchrome__marker-dot"
                  style={{ background: laneColorVar(marker.lane) }}
                  aria-hidden="true"
                />
                <div>
                  <div className="vchrome__marker-head">
                    <strong>{marker.label}</strong>
                    <span className="vchrome__marker-date">{marker.dateLabel}</span>
                  </div>
                  <Text tone="muted">{marker.detail}</Text>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Container>

      <Container padding="lg">
        <Container direction="vertical" itemSpacing="md" padding="none">
          <Heading level={2}>Skills</Heading>
          {RESUME_SKILL_GROUPS.map((group) => (
            <Container key={group.category} direction="vertical" itemSpacing="xs" padding="none">
              <Heading level={3}>{group.category}</Heading>
              <div className="vchrome__skills">
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
          <Link href="/resume">Back to all prototypes</Link>
          <Link href="/contact">Get in touch</Link>
        </Container>
      </Container>
    </>
  );
}

export function VariantShell({
  current,
  name,
  idea,
  children,
}: {
  current: string;
  name: string;
  idea: string;
  children: React.ReactNode;
}) {
  return (
    <SiteShell>
      <VariantHeader current={current} name={name} idea={idea} />
      {children}
      <VariantFooterSections />
    </SiteShell>
  );
}
