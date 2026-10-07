# Project screenshots

One folder per project in `src/lib/projects.ts` (the folder name is the project `id`), holding `1.webp`–`3.webp` in carousel order. Alt text lives with the project entry, not here.

## How these were made

Each project was cloned from GitHub and run locally, then captured with Playwright (Chromium), because the live sites weren't reachable from the build environment. Captures are 16:9, scaled to 1280×720, and saved as WebP (quality 80). Each image is 6–36 KB.

| Folder | Source | Shots |
|---|---|---|
| `doors97` | `NoahWright87/toybox` (`vite`) | Start menu and windows · Bomb Finder · Goober Dress-Up |
| `nw-design` | `NoahWright87/design` (Storybook) | `sites-personal-portfolio--home` · `components-organisms-hero--rotating-tagline-and-media` · Card story with controls |
| `swarm` | `NoahWright87/swarm-game` (`vite`) | Early wave · Grown swarm (via the `window.addShip()` dev hook) · Level-up screen |
| `lee` | `NoahWright87/lee` (`game` workspace) | Team select · Battle · Merge into "Bru Lee" |
| `vr` | `NoahWright87/vr` (`vite build`, served statically) | Landing page · Pistols at Dawn · Punch Pop |
| `gears` | `NoahWright87/gears` (static HTML; Tailwind CDN swapped for the npm build) | Game · Designer (purple spokes) · Designer (orange hex hub) |
| `noahwrightdev2026` | This repo (`next start`) | Home (light) · Resume timeline · Home (dark) |

To replace a shot, keep the same filename and 16:9 framing so the carousel crops it the same way.
