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

const EXPLORE_CARDS = [
  { title: "Projects", description: "See what I've built.", href: "/projects" },
  { title: "About Me", description: "The story behind the resume.", href: "/about" },
  { title: "Resume", description: "Experience, skills, and the PDF.", href: "/resume" },
  { title: "Get in Touch", description: "Say hello or start a conversation.", href: "/contact" },
] as const;

// Real portrait + ten AI-generated style variations. Source files (full-resolution
// PNG/JPG, ~17MB total) live in public/images/noah/ — see that folder's README for
// provenance and art direction. The hero rotates through public/images/noah/web/,
// resized (max 600px) WebP derivatives of the same set sized for eager-loading all
// slides at once; regenerate those if the source images ever change.
const PORTRAIT_STYLES = [
  { file: "noah-original.webp", alt: "Photo of Noah" },
  { file: "noah-simpsons.webp", alt: "Noah illustrated in a Simpsons cartoon style" },
  { file: "noah-archer.webp", alt: "Noah illustrated in an Archer-style adult animation" },
  { file: "noah-bobs-burgers.webp", alt: "Noah illustrated in a Bob's Burgers cartoon style" },
  { file: "noah-pixar.webp", alt: "Noah illustrated in a Pixar-style 3D animated character" },
  { file: "noah-8-bit.webp", alt: "Noah illustrated as a chunky 8-bit video game portrait" },
  { file: "noah-16-bit.webp", alt: "Noah illustrated as a 16-bit RPG game portrait" },
  { file: "noah-star-trek.webp", alt: "Noah illustrated in a Star Trek Starfleet uniform" },
  { file: "noah-rubber-hose.webp", alt: "Noah illustrated in a 1930s rubber-hose cartoon style" },
  { file: "noah-comic-book.webp", alt: "Noah illustrated as a superhero comic book character" },
  { file: "noah-starcraft.webp", alt: "Noah illustrated as a StarCraft Terran unit portrait" },
] as const;

const PORTRAIT_SLIDES = PORTRAIT_STYLES.map(({ file, alt }) => (
  <Image key={file} src={`/images/noah/web/${file}`} alt={alt} rounded="none" />
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
          <Carousel
            items={PORTRAIT_SLIDES}
            aspectRatio="1 / 1"
            interval={4000}
            showControls={false}
            decorative
            className="home-hero-photo-carousel"
          />
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
