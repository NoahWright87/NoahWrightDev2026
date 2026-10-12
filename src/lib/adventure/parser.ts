// The old-school parser: lower-case the input, drop filler words, map synonyms
// onto a small set of verbs, and split what's left into nouns. No guessing
// beyond that; a world's own rules and aliases do the rest.

import type { Direction } from "./types";

export interface Command {
  /** Canonical verb ("take", "go", "examine"…) or whatever the player typed first. */
  verb: string;
  /** What the verb is done to, filler removed ("brass key"). */
  noun?: string;
  /** The second object: "use key on DOOR", "ask cat about FISH". */
  noun2?: string;
  /** Set for movement: "n", "go north", "walk west". */
  direction?: Direction;
  /** The whole normalized input, for teleporter commands. */
  text: string;
}

const FILLER = new Set(["the", "a", "an", "some", "my", "this", "that", "please"]);

/** Multi-word phrases first, so "pick up" wins over "pick". */
const VERB_PHRASES: [string, string][] = [
  ["pick up", "take"],
  ["put down", "drop"],
  ["look at", "examine"],
  ["look in", "examine"],
  ["talk to", "talk"],
  ["speak to", "talk"],
  ["speak with", "talk"],
  ["talk with", "talk"],
  ["chat with", "talk"],
  ["switch on", "turn on"],
  ["switch off", "turn off"],
];

const VERB_SYNONYMS: Record<string, string> = {
  l: "look",
  x: "examine",
  inspect: "examine",
  check: "examine",
  read: "examine",
  i: "inventory",
  inv: "inventory",
  get: "take",
  grab: "take",
  g: "again",
  z: "wait",
  walk: "go",
  run: "go",
  move: "go",
  head: "go",
  greet: "talk",
  "?": "help",
};

const DIRECTION_WORDS: Record<string, Direction> = {
  n: "north",
  north: "north",
  e: "east",
  east: "east",
  s: "south",
  south: "south",
  w: "west",
  west: "west",
};

/** Words that split a command into its first and second object. */
const SPLITTERS = ["about", "with", "on", "to", "in", "into", "at", "from"];

export function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9?' -]/g, " ")
    .replace(/'/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Lower-cased, filler-free words; how nouns and aliases are compared. */
export function nounWords(text: string): string {
  return normalize(text)
    .split(" ")
    .filter((word) => word && !FILLER.has(word))
    .join(" ");
}

/** Maps a verb (as typed or as written in a rule) to its canonical form. */
export function canonicalVerb(verb: string): string {
  const v = normalize(verb);
  for (const [phrase, canonical] of VERB_PHRASES) {
    if (v === phrase) return canonical;
  }
  return VERB_SYNONYMS[v] ?? v;
}

export function parse(input: string): Command | null {
  const text = normalize(input);
  if (!text) return null;

  const direction = DIRECTION_WORDS[text];
  if (direction) return { verb: "go", direction, text };

  let verb: string | undefined;
  let rest = "";
  for (const [phrase, canonical] of VERB_PHRASES) {
    if (text === phrase || text.startsWith(`${phrase} `)) {
      verb = canonical;
      rest = text.slice(phrase.length);
      break;
    }
  }
  if (!verb) {
    const [first, ...others] = text.split(" ");
    verb = VERB_SYNONYMS[first] ?? first;
    rest = others.join(" ");
  }

  // "turn on lamp": keep the particle with the verb so rules can say "turn on".
  if (verb === "turn") {
    const particle = rest.trim().split(" ")[0];
    if (particle === "on" || particle === "off") {
      verb = `turn ${particle}`;
      rest = rest.trim().slice(particle.length);
    }
  }

  const words = rest.split(" ").filter((word) => word && !FILLER.has(word));

  if (verb === "go") {
    const dir = DIRECTION_WORDS[words.join(" ")];
    if (dir) return { verb, direction: dir, text };
  }

  const splitAt = words.findIndex((word, i) => i > 0 && SPLITTERS.includes(word));
  const first = splitAt === -1 ? words : words.slice(0, splitAt);
  const second = splitAt === -1 ? [] : words.slice(splitAt + 1);
  // "look at x" arrives as "examine" with nothing left, but "talk to cat"
  // can leave a dangling preposition at the front: drop it.
  while (first.length && SPLITTERS.includes(first[0])) first.shift();

  return {
    verb,
    noun: first.length ? first.join(" ") : undefined,
    noun2: second.length ? second.join(" ") : undefined,
    text,
  };
}

/** True when the player's words name the thing: an exact alias, or its last word. */
export function nounMatches(noun: string, names: string[]): boolean {
  const n = nounWords(noun);
  if (!n) return false;
  return names.some((name) => {
    const candidate = nounWords(name);
    if (!candidate) return false;
    if (candidate === n) return true;
    // "key" matches "brass key"; "brass key" doesn't match "rusty key".
    const words = candidate.split(" ");
    return words[words.length - 1] === n;
  });
}

export const PRONOUNS = new Set(["it", "them", "him", "her"]);
