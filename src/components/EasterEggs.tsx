"use client";

import { useEffect, useState } from "react";
import { portraits } from "@/lib/portraits";
import { SITE } from "@/lib/site";
import { theme } from "@/lib/theme";
import "./easter-eggs.css";

// Site-wide easter eggs, mounted once by SiteShell. Nothing here is visible
// until someone goes looking:
// - A hello in the browser console for anyone who opens DevTools.
// - The Konami code (↑↑↓↓←→←→BA) rains portraits down the screen.

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

const DROP_COUNT = 30;
const RAIN_MS = 6000;

type Drop = { key: number; file: string; left: number; delay: number; duration: number; spin: number; size: number };

let greeted = false;

function makeDrops(): Drop[] {
  return Array.from({ length: DROP_COUNT }, (_, i) => ({
    key: i,
    file: portraits[i % portraits.length].file,
    left: Math.random() * 95,
    delay: Math.random() * 1.5,
    duration: 2.5 + Math.random() * 2,
    spin: (Math.random() - 0.5) * 720,
    size: 56 + Math.random() * 56,
  }));
}

export default function EasterEggs() {
  const [drops, setDrops] = useState<Drop[] | null>(null);

  useEffect(() => {
    if (greeted) return;
    greeted = true;
    console.log(
      "%c👋 Hi, fellow nerd!",
      `font-size: 16px; font-weight: bold; color: ${theme.primary}`,
    );
    console.log(
      `Poking around? The source for this site is on GitHub: ${SITE.github}/NoahWrightDev2026\n` +
        "Psst: try the Konami code.",
    );
  }, []);

  useEffect(() => {
    let progress = 0;
    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      progress = key === KONAMI[progress] ? progress + 1 : key === KONAMI[0] ? 1 : 0;
      if (progress === KONAMI.length) {
        progress = 0;
        setDrops(makeDrops());
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!drops) return;
    const timer = window.setTimeout(() => setDrops(null), RAIN_MS);
    return () => window.clearTimeout(timer);
  }, [drops]);

  if (!drops) return null;

  return (
    <div className="portrait-rain" aria-hidden="true">
      <div className="portrait-rain__toast">🕹️ 30 extra lives granted</div>
      {drops.map((drop) => (
        // eslint-disable-next-line @next/next/no-img-element -- decorative, short-lived sprites
        <img
          key={drop.key}
          className="portrait-rain__drop"
          src={`/images/noah/web/${drop.file}.webp`}
          alt=""
          style={{
            left: `${drop.left}%`,
            width: drop.size,
            height: drop.size,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
            ["--spin" as string]: `${drop.spin}deg`,
          }}
        />
      ))}
    </div>
  );
}
