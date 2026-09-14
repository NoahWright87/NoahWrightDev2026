/**
 * Portrait gallery content. Source images live in public/images/noah/ (full
 * resolution) and public/images/noah/web/ (resized WebP used for display);
 * see that folder's README.md for full provenance, generation details, and
 * the reusable prompt this content summarizes.
 */
export interface Portrait {
  id: string;
  /** Filename stem shared by the source image and its public/images/noah/web/ derivative. */
  file: string;
  style: string;
  alt: string;
  description: string;
  direction: string;
}

export const portraits: Portrait[] = [
  {
    id: "original",
    file: "noah-original",
    style: "Original photo",
    alt: "Photo of Noah",
    description: "The real, unedited source photograph every other portrait was generated from.",
    direction: "Uploaded by Noah and preserved without re-encoding — every style below reimagines this same photo, not each other.",
  },
  {
    id: "simpsons",
    file: "noah-simpsons",
    style: "Simpsons",
    alt: "Noah illustrated in a Simpsons cartoon style",
    description: "Yellow skin, exaggerated cartoon anatomy, simple cel shapes and a broad tooth-band smile.",
    direction: "The revised, more strongly redesigned attempt — an earlier, more filter-like pass was replaced after it looked too photographic for the style.",
  },
  {
    id: "archer",
    file: "noah-archer",
    style: "Archer",
    alt: "Noah illustrated in an Archer-style adult animation",
    description: "Angular anatomy, controlled outlines and sculpted cel shading, in the style of Archer's adult animation.",
    direction: "The earlier, more anatomically faithful sample — no stronger redesign pass was generated for this one.",
  },
  {
    id: "bobs-burgers",
    file: "noah-bobs-burgers",
    style: "Bob's Burgers",
    alt: "Noah illustrated in a Bob's Burgers cartoon style",
    description: "Rounded head, long simple nose, dot pupils, thin outlines and simplified sloping shoulders.",
    direction: "Part of the stronger character-redesign direction, alongside the revised Simpsons and Pixar samples.",
  },
  {
    id: "pixar",
    file: "noah-pixar",
    style: "Pixar",
    alt: "Noah illustrated in a Pixar-style 3D animated character",
    description: "Enlarged expressive features, sculpted 3D forms, warm lighting and tactile materials.",
    direction: "One of the samples that established the \"authentic character design over photo tracing\" direction for the rest of the set.",
  },
  {
    id: "8-bit",
    file: "noah-8-bit",
    style: "8-bit",
    alt: "Noah illustrated as a chunky 8-bit video game portrait",
    description: "Chunky, large pixel clusters and a small, flat color palette, evoking early console game portraits.",
    direction: "Prompted for large pixel clusters specifically — a style name describing the intended look, not verified NES hardware limits.",
  },
  {
    id: "16-bit",
    file: "noah-16-bit",
    style: "16-bit",
    alt: "Noah illustrated as a 16-bit RPG game portrait",
    description: "Richer color ramps, visible pixels and restrained dithering, in the style of a 16-bit RPG portrait.",
    direction: "Prompted as the next step up in fidelity from the 8-bit portrait, still hand-drawn pixel art rather than a filter.",
  },
  {
    id: "star-trek",
    file: "noah-star-trek",
    style: "Star Trek",
    alt: "Noah illustrated in a Star Trek Starfleet uniform",
    description: "A burgundy Starfleet command uniform, a communicator badge, and a teal-framed window onto space.",
    direction: "Intentionally live-action rather than animated or illustrated, unlike the rest of the set.",
  },
  {
    id: "rubber-hose",
    file: "noah-rubber-hose",
    style: "Rubber hose",
    alt: "Noah illustrated in a 1930s rubber-hose cartoon style",
    description: "Pie-cut eyes, an elastic grin, exaggerated shapes, and an aged cel/print texture from 1930s cartoons.",
    direction: "One of the more heavily stylized redesigns, prioritizing the era's animation conventions over facial likeness.",
  },
  {
    id: "comic-book",
    file: "noah-comic-book",
    style: "Comic book",
    alt: "Noah illustrated as a superhero comic book character",
    description: "Heroic facial construction, brush inks, graphic shadows and halftone printing, like a superhero comic panel.",
    direction: "Leans on comic-printing texture (halftone dots, ink shadows) rather than a flat digital-illustration look.",
  },
  {
    id: "starcraft",
    file: "noah-starcraft",
    style: "StarCraft",
    alt: "Noah illustrated as a StarCraft Terran unit portrait",
    description:
      "Burgundy powered armor, an industrial teal bulkhead, and a compact in-game HUD reading \"NOAH\", \"TERRAN ENGINEER\", \"HP 100/100\" and a mineral cost of 50.",
    direction: "The one style where in-image text was intentional — a compact name/stats overlay, not a full card with abilities or flavor text.",
  },
];

export const PORTRAIT_ART_DIRECTION =
  "Every portrait was generated directly from the same original photo (not chained through one another), aiming to keep Noah's high forehead, short brown buzz cut, black rectangular glasses, clean-shaven face and cheerful smile recognizable while letting each medium reshape proportions to fit that style authentically, rather than just tracing the photo. The teal door and window behind Noah in the original carries through as background continuity — reappearing as a starship viewport, an industrial bulkhead, or whatever else fits the setting.";

export const PORTRAIT_GENERATION_NOTE =
  "Generated in September 2026 using ChatGPT's built-in image generation/editing tool from the original photo, with GPT-6 Astra (in ChatGPT/Codex) preparing the prompts and creative direction. The tool didn't expose the exact underlying image model version.";
