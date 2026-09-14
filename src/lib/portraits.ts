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
}

/**
 * Full-resolution source path, used for the lightbox view. The original photo
 * is a JPEG; every generated style is a PNG (see public/images/noah/README.md).
 */
export function fullImageSrc(portrait: Portrait): string {
  const ext = portrait.id === "original" ? "jpg" : "png";
  return `/images/noah/${portrait.file}.${ext}`;
}

export const portraits: Portrait[] = [
  {
    id: "original",
    file: "noah-original",
    style: "Original photo",
    alt: "Photo of Noah",
    description: "The real, unedited source photograph every other portrait was generated from.",
  },
  {
    id: "simpsons",
    file: "noah-simpsons",
    style: "Simpsons",
    alt: "Noah illustrated in a Simpsons cartoon style",
    description: "Yellow skin, exaggerated cartoon anatomy, simple cel shapes and a broad tooth-band smile.",
  },
  {
    id: "archer",
    file: "noah-archer",
    style: "Archer",
    alt: "Noah illustrated in an Archer-style adult animation",
    description: "Angular anatomy, controlled outlines and sculpted cel shading, in the style of Archer's adult animation.",
  },
  {
    id: "bobs-burgers",
    file: "noah-bobs-burgers",
    style: "Bob's Burgers",
    alt: "Noah illustrated in a Bob's Burgers cartoon style",
    description: "Rounded head, long simple nose, dot pupils, thin outlines and simplified sloping shoulders.",
  },
  {
    id: "pixar",
    file: "noah-pixar",
    style: "Pixar",
    alt: "Noah illustrated in a Pixar-style 3D animated character",
    description: "Enlarged expressive features, sculpted 3D forms, warm lighting and tactile materials.",
  },
  {
    id: "8-bit",
    file: "noah-8-bit",
    style: "8-bit",
    alt: "Noah illustrated as a chunky 8-bit video game portrait",
    description: "Chunky, large pixel clusters and a small, flat color palette, evoking early console game portraits.",
  },
  {
    id: "16-bit",
    file: "noah-16-bit",
    style: "16-bit",
    alt: "Noah illustrated as a 16-bit RPG game portrait",
    description: "Richer color ramps, visible pixels and restrained dithering, in the style of a 16-bit RPG portrait.",
  },
  {
    id: "star-trek",
    file: "noah-star-trek",
    style: "Star Trek",
    alt: "Noah illustrated in a Star Trek Starfleet uniform",
    description: "A burgundy Starfleet command uniform, a communicator badge, and a teal-framed window onto space.",
  },
  {
    id: "rubber-hose",
    file: "noah-rubber-hose",
    style: "Rubber hose",
    alt: "Noah illustrated in a 1930s rubber-hose cartoon style",
    description: "Pie-cut eyes, an elastic grin, exaggerated shapes, and an aged cel/print texture from 1930s cartoons.",
  },
  {
    id: "comic-book",
    file: "noah-comic-book",
    style: "Comic book",
    alt: "Noah illustrated as a superhero comic book character",
    description: "Heroic facial construction, brush inks, graphic shadows and halftone printing, like a superhero comic panel.",
  },
  {
    id: "starcraft",
    file: "noah-starcraft",
    style: "StarCraft",
    alt: "Noah illustrated as a StarCraft Terran unit portrait",
    description:
      "Burgundy powered armor, an industrial teal bulkhead, and a compact in-game HUD reading \"NOAH\", \"TERRAN ENGINEER\", \"HP 100/100\" and a mineral cost of 50.",
  },
];

export const PORTRAIT_NOTE =
  "One real photo of me, reimagined ten different ways with ChatGPT's image tool. Messing with my own profile picture like this is one small way I like to poke at what AI can actually do.";
