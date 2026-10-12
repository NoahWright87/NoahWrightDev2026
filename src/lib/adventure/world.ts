// Small helpers for addressing things in a world: tile keys, edge keys,
// neighbours, and the stock messages.

import {
  DIRECTION_OFFSETS,
  FORMAT_VERSION,
  type Direction,
  type Edge,
  type MessageKey,
  type Tile,
  type TileRef,
  type World,
} from "./types";

/** "x,y", the key of a tile within its area. */
export function coordKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function parseCoordKey(key: string): { x: number; y: number } {
  const [x, y] = key.split(",").map(Number);
  return { x, y };
}

/** "area:x,y", a tile's key across the whole world. */
export function tileKey(ref: TileRef): string {
  return `${ref.area}:${ref.x},${ref.y}`;
}

export function parseTileKey(key: string): TileRef {
  const colon = key.lastIndexOf(":");
  const { x, y } = parseCoordKey(key.slice(colon + 1));
  return { area: key.slice(0, colon), x, y };
}

export function sameTile(a: TileRef, b: TileRef): boolean {
  return a.area === b.area && a.x === b.x && a.y === b.y;
}

export function getTile(world: World, ref: TileRef): Tile | undefined {
  return world.areas[ref.area]?.tiles[coordKey(ref.x, ref.y)];
}

export function neighbour(ref: TileRef, dir: Direction): TileRef {
  const { dx, dy } = DIRECTION_OFFSETS[dir];
  return { area: ref.area, x: ref.x + dx, y: ref.y + dy };
}

/**
 * Each edge is stored once, from the tile to its west or north: so the edge
 * east of (2,3) and the edge west of (3,3) are both "2,3:e".
 */
export function edgeKey(x: number, y: number, dir: Direction): string {
  switch (dir) {
    case "east":
      return `${x},${y}:e`;
    case "south":
      return `${x},${y}:s`;
    case "west":
      return `${x - 1},${y}:e`;
    case "north":
      return `${x},${y - 1}:s`;
  }
}

export function getEdge(world: World, ref: TileRef, dir: Direction): Edge | undefined {
  return world.areas[ref.area]?.edges[edgeKey(ref.x, ref.y, dir)];
}

/** A short label for a tile, for the editor and error messages. */
export function describeRef(world: World, ref: TileRef): string {
  const tile = getTile(world, ref);
  const area = world.areas[ref.area]?.name ?? ref.area;
  return `${area} (${ref.x}, ${ref.y})${tile ? ` · ${tile.name}` : ""}`;
}

/** Fresh ids for rules, triggers and teleporters, which `once` and the editor key on. */
export function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * The engine's stock replies. A world can override any of them in
 * `world.messages`. `{noun}`, `{verb}` and `{list}` are filled in.
 */
export const DEFAULT_MESSAGES: Record<MessageKey, string> = {
  unknownVerb: "I don't know how to \"{verb}\".",
  noNoun: "{verb} what?",
  notHere: "You don't see any \"{noun}\" here.",
  cantGo: "You can't go that way.",
  noExit: "There's no way to do that from here.",
  taken: "Taken: {noun}.",
  cantTake: "You can't take that.",
  alreadyHave: "You already have it.",
  dropped: "Dropped: {noun}.",
  dontHave: "You aren't carrying that.",
  inventoryEmpty: "You aren't carrying anything.",
  inventory: "You're carrying: {list}.",
  nothingHappens: "Nothing happens.",
  noReply: "No response.",
  noTopic: "No answer about that.",
  waited: "Time passes.",
  nothingToRepeat: "There's nothing to repeat yet.",
  gameOver: "The game is over. Type \"restart\" to play again.",
  exits: "Exits: {list}.",
  youSee: "You see: {list}.",
  peopleHere: "Here: {list}.",
  help:
    "Try commands like: look, north (or n), take lamp, examine lamp (or x lamp), " +
    "drop lamp, inventory (or i), talk to someone, ask someone about something, " +
    "use something, again (or g), restart.",
};

export function message(
  world: World,
  key: MessageKey,
  vars: Record<string, string> = {},
): string {
  const template = world.messages?.[key] ?? DEFAULT_MESSAGES[key];
  return template.replace(/\{(\w+)\}/g, (match, name: string) => vars[name] ?? match);
}

/** A world with one empty room, the starting point for something new. */
export function blankWorld(): World {
  return {
    format: FORMAT_VERSION,
    title: "Untitled adventure",
    start: { area: "main", x: 0, y: 0 },
    areas: {
      main: {
        name: "Main",
        tiles: { "0,0": { name: "A room", description: "" } },
        edges: {},
      },
    },
    items: {},
    characters: {},
    flags: {},
  };
}
