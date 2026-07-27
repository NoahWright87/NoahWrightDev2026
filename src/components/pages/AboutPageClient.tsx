"use client";

import { Container, Heading, Text, Button, Link } from "@noahwright/design";
import SiteShell from "@/components/SiteShell";
import { SITE } from "@/lib/site";

export default function AboutPageClient() {
  return (
    <SiteShell>
      <Container padding="lg" gutterBorder="medium">
        <Container direction="vertical" itemSpacing="md">
          <Heading level={1}>About</Heading>

          <Container direction="vertical" itemSpacing="xs">
            <Heading level={2}>Who I Am</Heading>
            <Text>
              I got into programming through playful curiosity—amazed by how math could make video games, I wanted to learn code to build my own. That spark led me to discover something deeper: code can be a tool for both fun and for eliminating soul-crushing work from people&rsquo;s jobs. That&rsquo;s still what drives me today: getting useful tools into people&rsquo;s hands so they can be happier and more productive.

              My ten years in the United States Air Force taught me how to function in highly regulated environments. It was bureaucracy and red tape with a side of morning PT and the occasional shooting range trip. That structure was both constraining and freeing—you had to jump through hoops, but once you learned the system, everything became predictable. The military&rsquo;s emphasis on training, consistent enforcement, and bias toward action shaped how I think about organizations: a high-functioning team continually prunes what&rsquo;s no longer useful, just like managing technical debt.
            </Text>
          </Container>

          <Container direction="vertical" itemSpacing="xs">
            <Heading level={2}>What I Build</Heading>
            <Text>
              I love &ldquo;engineering for engineers.&rdquo; My current role is managing an Engineering Enablement team, and we build tools to help engineers be more productive. Empowerment is my north star: I want people to feel capable and fast, with guardrails in place to keep them safe from costly mistakes. Lately, we&rsquo;ve been focused on leveraging generative AI and modern coding tools to help teams keep pace with the accelerating rate of change. The world is moving faster than ever, and I want to help software teams keep up.
            </Text>
          </Container>

          <Container direction="vertical" itemSpacing="xs">
            <Heading level={2}>Outside Work</Heading>
            <Text>
              Family is everything to me. My wife and I care for our disabled adult child, which has taught me both patience and the deep importance of finding ways to make life easier for people who struggle with everyday tasks. That&rsquo;s part of why I&rsquo;m passionate about empowering tools—I see the real-world impact they have. When I&rsquo;m not building software, I&rsquo;m still a gamer and fun-loving goofball. I make silly side projects, toys, and games, mostly on my fake Doors 97 operating system. That playful spirit has never left me, and I don&rsquo;t think it ever should.
            </Text>
          </Container>

          <Container direction="horizontal" itemSpacing="md" padding="none">
            <Link href="/contact">
              <Button variant="solid" color="primary">Get in Touch</Button>
            </Link>
            <Link href={SITE.resumeUrl}>
              <Button variant="outline">View Resume</Button>
            </Link>
          </Container>
        </Container>
      </Container>
    </SiteShell>
  );
}
