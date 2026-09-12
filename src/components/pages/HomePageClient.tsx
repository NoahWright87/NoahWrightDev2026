"use client";

import { useState } from "react";
import { Hero, TextCarousel, Carousel, Container, Text, Button, Link } from "@noahwright/design";
import SiteShell from "@/components/SiteShell";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import ResumeIcon from "@/components/icons/ResumeIcon";
import PortraitIcon from "@/components/icons/PortraitIcon";
import { SITE } from "@/lib/site";

// TODO: swap for real photos — each slot becomes an <img> with its own alt text,
// and Carousel's `decorative` flag should come off once the images carry real content.
const PHOTO_PLACEHOLDERS = [1, 2, 3].map((n) => (
  <div className="home-hero-photo" key={n}>
    <PortraitIcon size={40} />
    <span>Photo {n}</span>
  </div>
));

const HERO_TITLES = [
  "Software engineering leader",
  "Engineer.  Problem solver.  Lifelong learner.",
  "Custom-obsessed product builder",
  "AI-wielding magician",
  "Self-deprecating jokester",
] as const;

function shuffle<T>(items: readonly T[]): T[] {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export default function HomePageClient() {
  const [heroTitles] = useState(() => shuffle(HERO_TITLES));

  return (
    <SiteShell>
      <Container padding="xl">
        <Hero
          title={<>👋 I&apos;m Noah</>}
          tagline={<TextCarousel items={[...heroTitles]} animation="typewriter" />}
          description={<Text>{SITE.description}</Text>}
          actions={
            <>
              <Link href={SITE.resumeUrl}>
                <Button variant="solid" color="primary" icon={<ResumeIcon size={18} />}>
                  View Resume
                </Button>
              </Link>
              <a href={SITE.linkedIn} target="_blank" rel="noreferrer">
                <Button variant="outline" icon={<LinkedInIcon size={18} />}>
                  LinkedIn
                </Button>
              </a>
            </>
          }
          media={
            <Carousel
              items={PHOTO_PLACEHOLDERS}
              aspectRatio="1 / 1"
              interval={4000}
              showControls={false}
              decorative
              className="home-hero-photo-carousel"
            />
          }
        />
      </Container>

      <Container padding="lg">
        <Container direction="horizontal" itemSpacing="md">
          <Link href="/projects">View Projects →</Link>
          <Link href="/about">About Me →</Link>
          <Link href="/resume">Resume →</Link>
          <Link href="/contact">Get in Touch →</Link>
        </Container>
      </Container>
    </SiteShell>
  );
}
