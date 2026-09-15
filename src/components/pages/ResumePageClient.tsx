"use client";

import { Container, Heading, Text, Button, Link, Card, CardGrid } from "@noahwright/design";
import SiteShell from "@/components/SiteShell";

/**
 * TEMPORARY — while the timeline resume is being designed, this page doubles as
 * the index for the `/resume1`–`/resume5` layout prototypes. All five render
 * the same placeholder career data so only the presentation differs. Once a
 * direction is chosen, this reverts to the real resume and the prototype routes
 * (plus `src/lib/resumeDemo.ts` and `src/components/pages/resume-variants/`) go away.
 */

const PROTOTYPES = [
  {
    slug: "resume1",
    name: "Branch Rail",
    summary:
      "The graph lives in a narrow rail on the left and the content stays in one column at every width. Lanes are measured off the real card positions, so the rail always lines up. A sticky minimap on wide screens doubles as jump navigation.",
    strength: "Keeps the branching shape intact on a phone.",
  },
  {
    slug: "resume2",
    name: "Parallel Tracks",
    summary:
      "Two genuine columns with a year spine between them — service on the left, civilian on the right. Roles that begin at the same moment share a row, so the 2016 split sits literally side by side. Folds to one chronological column on narrow screens.",
    strength: "The most literal picture of two careers at once.",
  },
  {
    slug: "resume3",
    name: "Time Scrubber",
    summary:
      "Time runs left to right. Each role is a segment whose width is its real duration, the overlap window is shaded, and picking a segment loads it into a detail panel below. Arrow keys step through; a full list underneath keeps it skimmable.",
    strength: "Duration and overlap are measurable, not implied.",
  },
  {
    slug: "resume4",
    name: "Metro Map",
    summary:
      "A transit diagram rather than a scrolling spine: evenly spaced stations, a 45-degree interchange where the careers split, and a terminus bar where service ends. The map holds still while the detail panel beside it swaps.",
    strength: "Reads as a single picture you take in at once.",
  },
  {
    slug: "resume5",
    name: "Quiet Spine",
    summary:
      "The restrained one. A small glance strip carries the dual-career shape up front, then it is a plain single column in three chapters with sticky headers and collapsed details.",
    strength: "Fastest to skim; closest to a conventional resume.",
  },
];

export default function ResumePageClient() {
  return (
    <SiteShell>
      <Container padding="lg">
        <Container direction="vertical" itemSpacing="md">
          <Heading level={1}>Resume</Heading>
          <Text>
            The full web resume is in progress. It&rsquo;s being built as a timeline that shows two
            overlapping careers &mdash; Air Force service and civilian engineering &mdash; rather
            than a flat list of jobs.
          </Text>
          <Text>
            Five layout prototypes are below. Each one renders the same placeholder content, so the
            only thing that differs is how the timeline is presented. Real content and a downloadable
            PDF follow once a direction is picked.
          </Text>
        </Container>
      </Container>

      <Container padding="lg">
        <Container direction="vertical" itemSpacing="md">
          <Heading level={2}>Layout prototypes</Heading>
          <CardGrid minCardWidth="300px">
            {PROTOTYPES.map((proto, index) => (
              <Card
                key={proto.slug}
                href={`/${proto.slug}`}
                interactive
                title={`${index + 1}. ${proto.name}`}
                subtitle={proto.strength}
                footer={<Text tone="muted">View prototype &rarr;</Text>}
              >
                <Text>{proto.summary}</Text>
              </Card>
            ))}
          </CardGrid>
        </Container>
      </Container>

      <Container padding="lg">
        <Container direction="horizontal" itemSpacing="md" padding="none" wrap="always">
          <Link href="/about">
            <Button variant="outline">Back to About</Button>
          </Link>
          <Link href="/contact">
            <Button variant="solid" color="primary">
              Get in Touch
            </Button>
          </Link>
        </Container>
      </Container>
    </SiteShell>
  );
}
