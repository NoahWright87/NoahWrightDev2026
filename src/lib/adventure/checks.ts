// Authoring checks: things that are legal JSON but probably a mistake. The
// editor lists these; nothing here stops a world from loading or playing.

import {
  DIRECTIONS,
  type Condition,
  type Effect,
  type Rule,
  type TileRef,
  type Trigger,
  type World,
} from "./types";
import { nounWords } from "./parser";
import { getEdge, getTile, neighbour, parseCoordKey, tileKey } from "./world";

export type IssueLevel = "error" | "warning";

export interface Issue {
  level: IssueLevel;
  text: string;
  /** The tile to jump to when the issue is clicked, if there is one. */
  at?: TileRef;
}

/** Every rule-like thing in the world, with where it lives. */
interface Site {
  at?: TileRef;
  where: string;
  conditions: Condition[];
  effects: Effect[];
}

export function checkWorld(world: World): Issue[] {
  const issues: Issue[] = [];
  const add = (level: IssueLevel, text: string, at?: TileRef) => issues.push({ level, text, at });

  if (!getTile(world, world.start)) add("error", "The start tile doesn't exist.");

  const sites: Site[] = [];
  const placedItems = new Set<string>();
  const placedCharacters = new Set<string>();
  const ruleIds = new Map<string, string>();

  const noteRule = (r: Trigger, where: string, at?: TileRef) => {
    sites.push({ at, where, conditions: r.conditions ?? [], effects: r.effects ?? [] });
    const seen = ruleIds.get(r.id);
    if (seen) add("error", `Rule id "${r.id}" is used twice (${seen} and ${where}); "once" rules will misfire.`, at);
    else ruleIds.set(r.id, where);
    if ("verbs" in r && !(r as Rule).verbs.length) add("warning", `A rule in ${where} has no verbs, so nothing can trigger it.`, at);
  };

  for (const [areaId, area] of Object.entries(world.areas)) {
    for (const [coord, tile] of Object.entries(area.tiles)) {
      const { x, y } = parseCoordKey(coord);
      const at = { area: areaId, x, y };
      const where = `"${tile.name}" (${area.name} ${x},${y})`;
      if (!tile.description.trim()) add("warning", `${where} has no description.`, at);
      for (const id of tile.items ?? []) {
        if (!world.items[id]) add("error", `${where} places an unknown item "${id}".`, at);
        else if (placedItems.has(id)) add("error", `Item "${id}" is placed in more than one tile.`, at);
        placedItems.add(id);
      }
      for (const id of tile.characters ?? []) {
        if (!world.characters[id]) add("error", `${where} places an unknown character "${id}".`, at);
        else if (placedCharacters.has(id)) add("error", `Character "${id}" is placed in more than one tile.`, at);
        placedCharacters.add(id);
      }
      for (const t of tile.teleporters ?? []) {
        if (!getTile(world, t.to)) add("error", `Teleporter "${t.label}" in ${where} leads to a missing tile.`, at);
        if (!t.commands.length) add("warning", `Teleporter "${t.label}" in ${where} has no commands.`, at);
        sites.push({ at, where, conditions: t.conditions ?? [], effects: [] });
      }
      for (const r of tile.rules ?? []) noteRule(r, where, at);
      for (const r of tile.onEnter ?? []) noteRule(r, where, at);
      for (const d of tile.details ?? []) sites.push({ at, where, conditions: d.conditions ?? [], effects: [] });
      for (const dir of ["east", "south"] as const) {
        const edge = getEdge(world, at, dir);
        if (edge?.kind === "locked") {
          sites.push({ at, where, conditions: edge.opensWhen, effects: [] });
          if (!edge.opensWhen.length) add("warning", `A lock ${dir} of ${where} has no conditions, so it's always open.`, at);
        }
      }
      // Duplicate names make "take key" ambiguous.
      const names = new Map<string, string>();
      for (const id of tile.items ?? []) {
        const item = world.items[id];
        if (!item) continue;
        for (const name of [item.name, ...(item.aliases ?? [])]) {
          const n = nounWords(name);
          const other = names.get(n);
          if (other && other !== id) add("warning", `"${n}" names both "${other}" and "${id}" in ${where}.`, at);
          names.set(n, id);
        }
      }
    }
  }

  for (const item of Object.values(world.items)) {
    for (const r of item.rules ?? []) noteRule(r, `item "${item.name}"`);
    if (!item.description.trim()) add("warning", `Item "${item.name}" has no description.`);
  }
  for (const character of Object.values(world.characters)) {
    for (const r of character.rules ?? []) noteRule(r, `character "${character.name}"`);
    for (const t of character.topics ?? []) {
      sites.push({ where: `character "${character.name}"`, conditions: t.conditions ?? [], effects: t.effects ?? [] });
    }
    if (!character.description.trim()) add("warning", `Character "${character.name}" has no description.`);
  }

  // References in conditions and effects.
  const setFlags = new Set<string>();
  const readFlags = new Set<string>();
  const givenItems = new Set<string>();
  for (const site of sites) {
    for (const c of site.conditions) {
      if (c.type === "flag") readFlags.add(c.flag);
      if ((c.type === "hasItem" || c.type === "itemHere") && !world.items[c.item]) {
        add("error", `A condition in ${site.where} refers to unknown item "${c.item}".`, site.at);
      }
      if (c.type === "characterHere" && !world.characters[c.character]) {
        add("error", `A condition in ${site.where} refers to unknown character "${c.character}".`, site.at);
      }
      if (c.type === "visited" && !getTile(world, c.tile)) {
        add("error", `A condition in ${site.where} refers to a missing tile.`, site.at);
      }
    }
    for (const e of site.effects) {
      if (e.type === "setFlag") setFlags.add(e.flag);
      if (e.type === "clearFlag") readFlags.add(e.flag);
      if (e.type === "giveItem" || e.type === "placeItem") givenItems.add(e.item);
      if ("item" in e && !world.items[e.item]) {
        add("error", `An effect in ${site.where} refers to unknown item "${e.item}".`, site.at);
      }
      if (e.type === "moveCharacter" && !world.characters[e.character]) {
        add("error", `An effect in ${site.where} refers to unknown character "${e.character}".`, site.at);
      }
      const target = e.type === "teleport" ? e.to : e.type === "placeItem" ? e.tile : e.type === "moveCharacter" ? e.tile : null;
      if (target && !getTile(world, target)) add("error", `An effect in ${site.where} points at a missing tile.`, site.at);
    }
  }
  for (const flag of readFlags) {
    if (!setFlags.has(flag)) add("warning", `Flag "${flag}" is checked but nothing ever sets it.`);
  }
  for (const flag of setFlags) {
    if (!readFlags.has(flag)) add("warning", `Flag "${flag}" is set but nothing ever checks it.`);
  }
  for (const id of Object.keys(world.items)) {
    if (!placedItems.has(id) && !givenItems.has(id)) {
      add("warning", `Item "${world.items[id].name}" is never placed or given, so it can't appear.`);
    }
  }

  // Reachability, optimistically: every lock and conditional teleporter counts as open.
  const reachable = reachableTiles(world);
  for (const [areaId, area] of Object.entries(world.areas)) {
    for (const [coord, tile] of Object.entries(area.tiles)) {
      if (!reachable.has(`${areaId}:${coord}`)) {
        const { x, y } = parseCoordKey(coord);
        add("warning", `"${tile.name}" (${area.name} ${x},${y}) can't be reached from the start.`, { area: areaId, x, y });
      }
    }
  }

  return issues.sort((a, b) => (a.level === b.level ? 0 : a.level === "error" ? -1 : 1));
}

/**
 * Tile keys reachable from the start, optimistically: every lock and
 * conditional teleporter counts as open, and a teleport in an item's or
 * character's rules counts as usable.
 */
export function reachableTiles(world: World): Set<string> {
  const seen = new Set<string>();
  const queue: TileRef[] = [];
  const visit = (ref: TileRef) => {
    const key = tileKey(ref);
    if (seen.has(key) || !getTile(world, ref)) return;
    seen.add(key);
    queue.push(ref);
  };
  const teleportsIn = (rules: Trigger[] | undefined): TileRef[] =>
    (rules ?? []).flatMap((r) => r.effects ?? []).flatMap((e) => (e.type === "teleport" ? [e.to] : []));

  visit(world.start);
  if (!seen.size) return seen;
  for (const thing of [...Object.values(world.items), ...Object.values(world.characters)]) {
    teleportsIn(thing.rules).forEach(visit);
  }

  while (queue.length) {
    const at = queue.shift()!;
    const tile = getTile(world, at)!;
    for (const dir of DIRECTIONS) {
      if (getEdge(world, at, dir)?.kind !== "wall") visit(neighbour(at, dir));
    }
    for (const t of tile.teleporters ?? []) visit(t.to);
    teleportsIn(tile.rules).forEach(visit);
    teleportsIn(tile.onEnter).forEach(visit);
  }
  return seen;
}
