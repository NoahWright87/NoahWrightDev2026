"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Container, Heading, Text, Card, CardGrid, Image, Link } from "@noahwright/design";
import SiteShell from "@/components/SiteShell";
import { portraits, fullImageSrc, PORTRAIT_NOTE, type Portrait } from "@/lib/portraits";

const README_URL =
  "https://github.com/NoahWright87/NoahWrightDev2026/blob/main/public/images/noah/README.md";

function PortraitLightbox({ portrait, onClose }: { portrait: Portrait; onClose: () => void }) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="portrait-lightbox"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button type="button" className="portrait-lightbox__close" aria-label="Close" onClick={onClose}>
        <span aria-hidden="true">✕</span>
      </button>
      <Image
        src={fullImageSrc(portrait)}
        alt={portrait.alt}
        objectFit="contain"
        rounded="lg"
        style={{
          maxWidth: "90vw",
          maxHeight: "90vh",
          width: "auto",
          height: "auto",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.4)",
        }}
      />
    </div>,
    document.body
  );
}

export default function PortraitsPageClient() {
  const [activePortrait, setActivePortrait] = React.useState<Portrait | null>(null);

  return (
    <SiteShell>
      <Container padding="xl">
        <Container direction="vertical" itemSpacing="md">
          <Heading level={1}>The Many Faces of Noah</Heading>
          <Text>{PORTRAIT_NOTE}</Text>
          <Text tone="muted">
            Curious about the prompts?{" "}
            <Link href={README_URL} isExternal>
              Full notes on GitHub
            </Link>
            .
          </Text>
        </Container>
      </Container>

      <Container padding="lg">
        <CardGrid minCardWidth="260px">
          {portraits.map((portrait) => (
            <Card
              key={portrait.id}
              title={portrait.style}
              image={
                <button
                  type="button"
                  className="portrait-card__image-button"
                  onClick={() => setActivePortrait(portrait)}
                  aria-label={`View full-size image: ${portrait.style}`}
                >
                  <Image
                    src={`/images/noah/web/${portrait.file}.webp`}
                    alt={portrait.alt}
                    aspectRatio="1/1"
                  />
                </button>
              }
              elevated
            >
              <Text tone="muted">{portrait.description}</Text>
            </Card>
          ))}
        </CardGrid>
      </Container>

      {activePortrait ? (
        <PortraitLightbox portrait={activePortrait} onClose={() => setActivePortrait(null)} />
      ) : null}
    </SiteShell>
  );
}
