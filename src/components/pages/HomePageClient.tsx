"use client";

import { useEffect, useState } from "react";
import {
  Hero,
  TextCarousel,
  Carousel,
  Card,
  CardGrid,
  Container,
  Heading,
  Image,
  Text,
  Button,
  Link,
} from "@noahwright/design";
import SiteShell from "@/components/SiteShell";
import { SITE } from "@/lib/site";
import { portraits } from "@/lib/portraits";
import { COPY, fill } from "@/content/copy";

const EXPLORE_CARDS = [
  { ...COPY.home.exploreCards.projects, href: "/projects" },
  { ...COPY.home.exploreCards.about, href: "/about" },
  { ...COPY.home.exploreCards.resume, href: "/resume" },
  { ...COPY.home.exploreCards.contact, href: "/contact" },
] as const;

// Real portrait + ten AI-generated style variations (full detail in @/lib/portraits
// and public/images/noah/README.md). The hero rotates through the resized WebP
// derivatives in public/images/noah/web/, sized for eager-loading all slides at once;
// regenerate those (see that folder's README) if the source images ever change.
const PORTRAIT_SLIDES = portraits.map(({ id, file, alt }) => (
  <Image key={id} src={`/images/noah/web/${file}.webp`} alt={alt} rounded="none" />
));

const HERO_TITLES: readonly string[] = COPY.home.heroTitles.map((entry) => entry.text);

function shuffle<T>(items: readonly T[]): T[] {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export default function HomePageClient() {
  // Start in declared order so server and client render identical markup on
  // first paint; shuffle only after mount to avoid a hydration mismatch.
  const [heroTitles, setHeroTitles] = useState<readonly string[]>(HERO_TITLES);

  useEffect(() => {
    setHeroTitles(shuffle(HERO_TITLES));
  }, []);

  return (
    <SiteShell>
      <Hero
        background="subtle"
        bottomBorder="gradient"
        title={<Heading level={1}>{COPY.home.greeting.text}</Heading>}
        tagline={
          <Heading level={2}>
            <TextCarousel items={[...heroTitles]} animation="typewriter" />
          </Heading>
        }
        description={<Text>{COPY.site.description.text}</Text>}
        actions={
          <>
            <Link href="/projects">
              <Button variant="solid" color="primary">
                {COPY.home.projectsButton.text}
              </Button>
            </Link>
            <Link href={SITE.resumeUrl}>
              <Button variant="outline">{COPY.home.resumeButton.text}</Button>
            </Link>
          </>
        }
        media={
          // A plain anchor (rather than the design system's `Link`, which doesn't
          // support `aria-label`) since the carousel inside is `decorative`
          // (aria-hidden) — without a label of its own, the link would have no
          // accessible name at all.
          <a href="/portraits" aria-label={COPY.home.photoLinkLabel.text} className="home-hero-photo-link">
            <Carousel
              items={PORTRAIT_SLIDES}
              aspectRatio="1 / 1"
              interval={4000}
              showControls={false}
              decorative
              className="home-hero-photo-carousel"
            />
            {/* Hover hint; decorative, since the link's aria-label already says where it goes. */}
            <span className="home-hero-photo-hint" aria-hidden="true">
              {fill(COPY.home.photoHint, { n: portraits.length - 1 })}
            </span>
          </a>
        }
      />

      <Container padding="lg">
        <Heading level={2}>{COPY.home.exploreHeading.text}</Heading>
        <CardGrid minCardWidth="220px">
          {EXPLORE_CARDS.map((card) => (
            <Card key={card.href} href={card.href} title={card.title.text} interactive>
              <Text tone="muted">{card.description.text}</Text>
            </Card>
          ))}
        </CardGrid>
      </Container>
    </SiteShell>
  );
}
