// Where worlds come from and where they're kept in the browser.
//
// Built-in worlds are JSON files in public/adventure/worlds/, fetched only when
// picked, so the real game isn't bundled into the editor. Local saves live in
// localStorage, which can be missing or throw (private windows, blocked
// storage), so every access is wrapped.

import type { GameState, World } from "./types";
import { parseWorldJson, validateWorld } from "./validate";

export interface BuiltInWorld {
  id: string;
  label: string;
  note: string;
  url: string;
}

export const BUILT_IN_WORLDS: BuiltInWorld[] = [
  {
    id: "example",
    label: "Example",
    note: "A tiny world that shows off every mechanic.",
    url: "/adventure/worlds/example.json",
  },
  {
    id: "site",
    label: "The real one (spoilers!)",
    note: "The adventure the site actually runs.",
    url: "/adventure/worlds/site.json",
  },
  {
    id: "blank",
    label: "Blank",
    note: "One empty room. Start from scratch.",
    url: "/adventure/worlds/blank.json",
  },
];

export const DEFAULT_EDITOR_WORLD = "example";
export const SITE_WORLD = "site";

export async function fetchBuiltInWorld(id: string): Promise<World> {
  const entry = BUILT_IN_WORLDS.find((w) => w.id === id);
  if (!entry) throw new Error(`No built-in world called "${id}".`);
  const response = await fetch(entry.url);
  if (!response.ok) throw new Error(`Couldn't load ${entry.url} (${response.status}).`);
  const result = validateWorld(await response.json());
  if (!result.ok) throw new Error(result.errors.join("\n"));
  return result.world;
}

const SAVED_WORLD_KEY = "nw-adventure-world";
const DRAFT_KEY = "nw-adventure-draft";
const PROGRESS_PREFIX = "nw-adventure-progress:";

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null): boolean {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function readWorld(key: string): World | null {
  const text = read(key);
  if (!text) return null;
  const result = parseWorldJson(text);
  return result.ok ? result.world : null;
}

/** The world saved with "Save to local", which /adventure?world=local plays. */
export const loadSavedWorld = () => readWorld(SAVED_WORLD_KEY);
export const saveWorld = (world: World) => write(SAVED_WORLD_KEY, JSON.stringify(world));
export const clearSavedWorld = () => write(SAVED_WORLD_KEY, null);

/** The editor's autosaved work in progress, so a refresh doesn't lose edits. */
export interface Draft {
  world: World;
  /** Which built-in or "upload" or "local" it started from, for the toolbar. */
  source: string;
}

export function loadDraft(): Draft | null {
  const text = read(DRAFT_KEY);
  if (!text) return null;
  try {
    const data = JSON.parse(text) as { world: unknown; source?: unknown };
    const result = validateWorld(data.world);
    if (!result.ok) return null;
    return { world: result.world, source: typeof data.source === "string" ? data.source : "draft" };
  } catch {
    return null;
  }
}

export const saveDraft = (draft: Draft) => write(DRAFT_KEY, JSON.stringify(draft));
export const clearDraft = () => write(DRAFT_KEY, null);

/** Progress in a game, per world source, so a refresh resumes where you were. */
export function loadProgress(source: string): GameState | null {
  const text = read(PROGRESS_PREFIX + source);
  if (!text) return null;
  try {
    return JSON.parse(text) as GameState;
  } catch {
    return null;
  }
}

export const saveProgress = (source: string, state: GameState | null) =>
  write(PROGRESS_PREFIX + source, state ? JSON.stringify(state) : null);

/** Hands the browser a JSON file to save. */
export function downloadWorld(world: World) {
  const slug =
    world.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "adventure";
  const blob = new Blob([`${JSON.stringify(world, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
