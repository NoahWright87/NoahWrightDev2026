"use client";

import { useEffect, useState } from "react";
import { Container, Heading, Text, Button, Link } from "@noahwright/design";
import SiteShell from "@/components/SiteShell";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import ResumeIcon from "@/components/icons/ResumeIcon";
import { SITE } from "@/lib/site";

const HERO_TITLES = [
  "Software engineering leader",
  "Engineer.  Problem solver.  Lifelong learner.",
  "Custom-obsessed product builder",
  "AI-wielding magician",
  "Self-deprecating jokester",
] as const;

const TYPING_MS_PER_CHAR = 45;
const DELETING_MS_PER_CHAR = 25;
const DWELL_MS = 2200;

function shuffle<T>(items: readonly T[]): T[] {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

type TypewriterPhase = "typing" | "dwelling" | "deleting";

function useTypewriter(words: readonly string[], isPaused: boolean) {
  const [wordIndex, setWordIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [phase, setPhase] = useState<TypewriterPhase>("typing");
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (isPaused) return;
    const word = words[wordIndex];

    if (prefersReducedMotion) {
      setLength(word.length);
      const timeoutId = window.setTimeout(() => {
        setWordIndex((i) => (i + 1) % words.length);
      }, DWELL_MS);
      return () => window.clearTimeout(timeoutId);
    }

    if (phase === "typing") {
      if (length < word.length) {
        const timeoutId = window.setTimeout(() => setLength((l) => l + 1), TYPING_MS_PER_CHAR);
        return () => window.clearTimeout(timeoutId);
      }
      setPhase("dwelling");
      return;
    }

    if (phase === "dwelling") {
      const timeoutId = window.setTimeout(() => setPhase("deleting"), DWELL_MS);
      return () => window.clearTimeout(timeoutId);
    }

    // phase === "deleting"
    if (length > 0) {
      const timeoutId = window.setTimeout(() => setLength((l) => l - 1), DELETING_MS_PER_CHAR);
      return () => window.clearTimeout(timeoutId);
    }
    setWordIndex((i) => (i + 1) % words.length);
    setPhase("typing");
  }, [phase, length, wordIndex, isPaused, words, prefersReducedMotion]);

  const text = prefersReducedMotion ? words[wordIndex] : words[wordIndex].slice(0, length);
  const isCursorBlinking = prefersReducedMotion || isPaused || phase === "dwelling";

  return { text, isCursorBlinking };
}

export default function HomePageClient() {
  const [heroTitles] = useState(() => shuffle(HERO_TITLES));
  const [isPaused, setIsPaused] = useState(false);
  const { text, isCursorBlinking } = useTypewriter(heroTitles, isPaused);

  return (
    <SiteShell>
      <Container padding="xl">
        <Container direction="vertical" itemSpacing="lg">
          <Heading level={1}>👋 I&apos;m Noah</Heading>
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <Container direction="vertical" itemSpacing="sm" padding="none">
              <Heading level={2}>
                {text}
                <span
                  className={`home-hero__cursor${isCursorBlinking ? " home-hero__cursor--blink" : ""}`}
                  aria-hidden="true"
                />
              </Heading>
              <Text>{SITE.description}</Text>
            </Container>
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
