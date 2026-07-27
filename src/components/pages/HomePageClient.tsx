"use client";

import { useEffect, useState } from "react";
import { Container, Heading, Text, Button, Link } from "@noahwright/design";
import SiteShell from "@/components/SiteShell";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import ResumeIcon from "@/components/icons/ResumeIcon";
import { SITE } from "@/lib/site";

const HERO_ROTATION = [
  {
    tagline: "Software engineering leader",
    pitch:
      "I guide my team to build high-quality software .  I provide the structure and the direction, then I let them surprise me with their ingenuity.",
  },
  {
    tagline: "Engineer.  Problem solver.  Lifelong learner.",
    pitch:
      "Programming was my hobby before it was my job.  Solving puzzles is fun, and this field is FULL of challenging puzzles.",
  },
  {
    tagline: "Custom-obsessed product builder",
    pitch:
      "I was my first customer.  I build the products I wish existed to help make people's jobs easier and less frustrating.",
  },
  {
    tagline: "AI-wielding magician",
    pitch:
      "I used to type magic words and bring computers to life.  Now I summon agentic AI minions to build things for me.",
  },
  {
    tagline: "Self-deprecating jokester",
    pitch:
      "Happy people make better products.  Humility, empathy, and a little fun go a long way in building a productive engineering culture.",
  },
] as const;

const ROTATION_MS = 5000;
const FADE_MS = 350;

function shuffleHeroRotation() {
  const shuffled = [...HERO_ROTATION];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export default function HomePageClient() {
  const [heroRotation] = useState(() => shuffleHeroRotation());
  const [heroIndex, setHeroIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isPaused) return;

    const intervalId = window.setInterval(() => {
      setIsVisible(false);

      window.setTimeout(() => {
        setHeroIndex((prev) => (prev + 1) % heroRotation.length);
        setIsVisible(true);
      }, FADE_MS);
    }, ROTATION_MS);

    return () => window.clearInterval(intervalId);
  }, [heroRotation.length, isPaused]);

  const hero = heroRotation[heroIndex];
  const heroFadeStyle = {
    opacity: isVisible ? 1 : 0,
    transition: `opacity ${FADE_MS}ms ease` as const,
  };

  return (
    <SiteShell>
      <Container padding="xl" gutterBorder="medium">
        <Container direction="vertical" itemSpacing="lg">
          <Heading level={1}>{SITE.name}</Heading>
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div style={heroFadeStyle}>
              <Container direction="vertical" itemSpacing="sm" padding="none">
                <Heading level={2}>{hero.tagline}</Heading>
                <Text>{hero.pitch}</Text>
              </Container>
            </div>
          </div>
          <Container direction="horizontal" itemSpacing="sm">
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
          </Container>
        </Container>
      </Container>

      <Container padding="lg" gutterBorder="medium">
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
