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

const EXPLORE_CARDS = [
  { title: "Projects", description: "See what I've built.", href: "/projects" },
  { title: "About Me", description: "The story behind the resume.", href: "/about" },
  { title: "Resume", description: "Experience, skills, and the PDF.", href: "/resume" },
  { title: "Get in Touch", description: "Say hello or start a conversation.", href: "/contact" },
] as const;

// Real portrait + ten AI-generated style variations (full detail in @/lib/portraits
// and public/images/noah/README.md). The hero rotates through the resized WebP
// derivatives in public/images/noah/web/, sized for eager-loading all slides at once;
// regenerate those (see that folder's README) if the source images ever change.
const PORTRAIT_SLIDES = portraits.map(({ id, file, alt }) => (
  <Image key={id} src={`/images/noah/web/${file}.webp`} alt={alt} rounded="none" />
));

const HERO_TITLES = [
  "👔 Software engineering manager",
  "🏗️ Builder of useful software",
  "😎 Building cool little side projects",
  "🤓 Nerding out over AI",
  "🧙 Wielding AI minions like a computer wizard",
  "💺 Chair Force veteran 🫡",
  "🇺🇸 Air Force veteran 🫡",
  "🧑‍🔬 Computer scientist experimenting with AI",
  "🤡 Lifelong self-deprecating jokester",
  "🎮 Been gaming since before I could read",
  "🧑‍💻 Always curious, lifelong learner",
  "🛠️ Tinkerer, over-engineerer, problem-solver",
  "🚧 Learning in public -- pardon the mess!",
  "🤖 Keeping robots busy on my side projects",
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
        title={<Heading level={1}>👋 I&apos;m Noah</Heading>}
        tagline={
          <Heading level={2}>
            <TextCarousel items={[...heroTitles]} animation="typewriter" />
          </Heading>
        }
        description={<Text>{SITE.description}</Text>}
        actions={
          <Link href="/projects">
            <Button variant="solid" color="primary">
              My Projects
            </Button>
          </Link>
        }
        media={
          // A plain anchor (rather than the design system's `Link`, which doesn't
          // support `aria-label`) since the carousel inside is `decorative`
          // (aria-hidden) — without a label of its own, the link would have no
          // accessible name at all.
          <a href="/portraits" aria-label="See Noah's other portrait styles" className="home-hero-photo-link">
            <Carousel
              items={PORTRAIT_SLIDES}
              aspectRatio="1 / 1"
              interval={4000}
              showControls={false}
              decorative
              className="home-hero-photo-carousel"
            />
          </a>
        }
      />

      <Container padding="lg">
        <Heading level={2}>Explore</Heading>
        <CardGrid minCardWidth="220px">
          {EXPLORE_CARDS.map((card) => (
            <Card key={card.href} href={card.href} title={card.title} interactive>
              <Text tone="muted">{card.description}</Text>
            </Card>
          ))}
        </CardGrid>
      </Container>
    </SiteShell>
  );
}
