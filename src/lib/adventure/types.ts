// The world format for the text adventure. A world is plain JSON so it can be
// exported from the editor, committed, uploaded and saved to localStorage.
//
// Shape in one breath: a world has areas; each area is a grid of tiles keyed
// "x,y" (y grows southward, like the screen). Neighbouring tiles connect with
// compass exits unless the edge between them is a wall or a lock. Teleporters
// jump from a tile to any tile in any area (doors into buildings, stairs,
// ladders). Items and characters are defined once and placed on tiles. Rules
// ("when the player types X here, if Y, do Z and say W") are where the game
// actually happens.

/** Bump when a change would break older worlds, and teach `migrateWorld` about it. */
export const FORMAT_VERSION = 1;

export type Direction = "north" | "east" | "south" | "west";

export const DIRECTIONS: readonly Direction[] = ["north", "east", "south", "west"];

export const DIRECTION_OFFSETS: Record<Direction, { dx: number; dy: number }> = {
  north: { dx: 0, dy: -1 },
  east: { dx: 1, dy: 0 },
  south: { dx: 0, dy: 1 },
  west: { dx: -1, dy: 0 },
};

/** A tile somewhere in the world. */
export interface TileRef {
  area: string;
  x: number;
  y: number;
}

export interface World {
  format: typeof FORMAT_VERSION;
  title: string;
  author?: string;
  /** Printed once, before the first room. */
  intro?: string;
  start: TileRef;
  areas: Record<string, Area>;
  items: Record<string, Item>;
  characters: Record<string, Character>;
  /** Declared flags. Purely for the editor: the engine accepts any flag name. */
  flags: Record<string, FlagDef>;
  /** Overrides for the engine's stock replies (see DEFAULT_MESSAGES). */
  messages?: Partial<Record<MessageKey, string>>;
}

export interface Area {
  name: string;
  /** Keyed "x,y". */
  tiles: Record<string, Tile>;
  /**
   * Edges that aren't plain open passages, keyed by `edgeKey()`. An edge
   * between two existing tiles with no entry here is open.
   */
  edges: Record<string, Edge>;
}

export type Edge =
  | { kind: "wall" }
  | {
      kind: "locked";
      /** The way is open once every condition holds. */
      opensWhen: Condition[];
      /** Said when the player tries it while it's still shut. */
      lockedText: string;
    };

export interface Tile {
  name: string;
  description: string;
  /** Extra lines appended to the description when their conditions hold. */
  details?: ConditionalText[];
  /** Things that can be examined but not taken (a sign, a painting). */
  scenery?: Scenery[];
  /** Where items and characters start. Live positions are in GameState. */
  items?: string[];
  characters?: string[];
  teleporters?: Teleporter[];
  rules?: Rule[];
  /** Run every time the player arrives, before the room is described. */
  onEnter?: Trigger[];
}

export interface ConditionalText {
  conditions?: Condition[];
  text: string;
}

export interface Scenery {
  /** Words the player can use for it; the first is its display name. */
  names: string[];
  description: string;
}

export interface Teleporter {
  id: string;
  /** How the exit is listed, e.g. "up the ladder" or "into the shed". */
  label: string;
  /** Whole commands that use it, e.g. "up", "climb ladder", "enter shed". */
  commands: string[];
  to: TileRef;
  conditions?: Condition[];
  /** Said when the conditions don't hold. */
  blockedText?: string;
  /** Said on the way through, before the new room. */
  text?: string;
  /** Leave it out of the exits list (secret passages). */
  hidden?: boolean;
}

/** Something that happens without a command (arriving in a room). */
export interface Trigger {
  id: string;
  conditions?: Condition[];
  effects?: Effect[];
  text?: string;
  /** Fire at most once per game. */
  once?: boolean;
}

/** Something that happens when the player types a matching command. */
export interface Rule extends Trigger {
  /** Verbs that match, e.g. ["pull", "yank"]. Synonyms of built-in verbs count. */
  verbs: string[];
  /**
   * Words for what it's done to. On a tile, these are scenery words ("lever");
   * empty means the verb alone. On an item or character, the thing itself is
   * the noun and these name the *other* thing ("use key on door" → ["door"]).
   */
  nouns?: string[];
}

export interface Item {
  name: string;
  aliases?: string[];
  description: string;
  /** Defaults to true. */
  portable?: boolean;
  rules?: Rule[];
}

export interface Character {
  name: string;
  aliases?: string[];
  description: string;
  /** Said on "talk to <character>". */
  greeting?: string;
  topics?: Topic[];
  rules?: Rule[];
}

export interface Topic {
  /** Words that pick this topic in "ask <character> about <words>". */
  keywords: string[];
  conditions?: Condition[];
  effects?: Effect[];
  text: string;
}

export interface FlagDef {
  note?: string;
}

export type Condition = (
  | { type: "hasItem"; item: string }
  | { type: "itemHere"; item: string }
  | { type: "characterHere"; character: string }
  | { type: "flag"; flag: string }
  | { type: "visited"; tile: TileRef }
) & {
  /** Flip it: "doesn't have", "flag not set". */
  not?: boolean;
};

export type Effect =
  | { type: "setFlag"; flag: string }
  | { type: "clearFlag"; flag: string }
  /** Into the player's inventory, from wherever it was. */
  | { type: "giveItem"; item: string }
  /** Gone from the game. */
  | { type: "removeItem"; item: string }
  | { type: "placeItem"; item: string; tile: TileRef }
  /** `tile: null` takes the character out of the game. */
  | { type: "moveCharacter"; character: string; tile: TileRef | null }
  | { type: "teleport"; to: TileRef }
  | { type: "endGame"; text?: string };

export type ConditionType = Condition["type"];
export type EffectType = Effect["type"];

/** Live state of one playthrough. Plain JSON so it can be saved. */
export interface GameState {
  at: TileRef;
  /** Item id → "inventory", a tile key, or null once removed. */
  items: Record<string, string | null>;
  /** Character id → a tile key, or null once gone. */
  characters: Record<string, string | null>;
  flags: string[];
  /** Tile keys the player has stood on. */
  visited: string[];
  /** Ids of `once` rules and triggers that have fired. */
  fired: string[];
  turns: number;
  ended: boolean;
  /** What "it" refers to: the last item or character mentioned. */
  lastNoun?: { kind: "item" | "character"; id: string };
  /** The last command, for "again". */
  lastCommand?: string;
}

export type LineKind = "title" | "text" | "echo" | "error" | "system" | "end";

export interface OutputLine {
  kind: LineKind;
  text: string;
}

export type MessageKey =
  | "unknownVerb"
  | "noNoun"
  | "notHere"
  | "cantGo"
  | "noExit"
  | "taken"
  | "cantTake"
  | "alreadyHave"
  | "dropped"
  | "dontHave"
  | "inventoryEmpty"
  | "inventory"
  | "nothingHappens"
  | "noReply"
  | "noTopic"
  | "waited"
  | "nothingToRepeat"
  | "gameOver"
  | "exits"
  | "youSee"
  | "peopleHere"
  | "help";
