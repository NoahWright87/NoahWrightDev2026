// "Where is this used?" for the editor's item, character and flag lists.

import type { Condition, Effect, Rule, TileRef, Trigger, World } from "./types";
import { parseCoordKey } from "./world";

export interface Usage {
  text: string;
  at?: TileRef;
}

type Target = { kind: "item" | "character" | "flag"; id: string };

function conditionUses(c: Condition, t: Target): string | null {
  if (t.kind === "item" && (c.type === "hasItem" || c.type === "itemHere") && c.item === t.id) return "checked";
  if (t.kind === "character" && c.type === "characterHere" && c.character === t.id) return "checked";
  if (t.kind === "flag" && c.type === "flag" && c.flag === t.id) return "checked";
  return null;
}

function effectUses(e: Effect, t: Target): string | null {
  if (t.kind === "item" && "item" in e && e.item === t.id) return e.type === "giveItem" ? "given" : "moved";
  if (t.kind === "character" && e.type === "moveCharacter" && e.character === t.id) return "moved";
  if (t.kind === "flag" && e.type === "setFlag" && e.flag === t.id) return "set";
  if (t.kind === "flag" && e.type === "clearFlag" && e.flag === t.id) return "cleared";
  return null;
}

export function findUsages(world: World, target: Target): Usage[] {
  const usages: Usage[] = [];
  const scan = (where: string, at: TileRef | undefined, conditions?: Condition[], effects?: Effect[]) => {
    const verbs = new Set<string>();
    for (const c of conditions ?? []) {
      const v = conditionUses(c, target);
      if (v) verbs.add(v);
    }
    for (const e of effects ?? []) {
      const v = effectUses(e, target);
      if (v) verbs.add(v);
    }
    if (verbs.size) usages.push({ text: `${[...verbs].join(" & ")} in ${where}`, at });
  };
  const scanRules = (rules: (Rule | Trigger)[] | undefined, where: string, at?: TileRef) => {
    for (const r of rules ?? []) {
      const label = "verbs" in r ? `"${(r as Rule).verbs.join("/") || "?"}" rule` : "arrival trigger";
      scan(`${label}, ${where}`, at, r.conditions, r.effects);
    }
  };

  for (const [areaId, area] of Object.entries(world.areas)) {
    for (const [coord, tile] of Object.entries(area.tiles)) {
      const at = { area: areaId, ...parseCoordKey(coord) };
      const where = `${tile.name} (${area.name})`;
      if (target.kind === "item" && tile.items?.includes(target.id)) usages.push({ text: `starts in ${where}`, at });
      if (target.kind === "character" && tile.characters?.includes(target.id)) {
        usages.push({ text: `starts in ${where}`, at });
      }
      scanRules(tile.rules, where, at);
      scanRules(tile.onEnter, where, at);
      for (const d of tile.details ?? []) scan(`a description line, ${where}`, at, d.conditions);
      for (const t of tile.teleporters ?? []) scan(`teleporter "${t.label}", ${where}`, at, t.conditions);
    }
    for (const [key, edge] of Object.entries(area.edges)) {
      if (edge.kind !== "locked") continue;
      const at = { area: areaId, ...parseCoordKey(key.split(":")[0]) };
      scan(`a lock in ${area.name}`, at, edge.opensWhen);
    }
  }
  for (const item of Object.values(world.items)) scanRules(item.rules, `item "${item.name}"`);
  for (const character of Object.values(world.characters)) {
    scanRules(character.rules, `character "${character.name}"`);
    for (const topic of character.topics ?? []) {
      scan(`topic "${topic.keywords.join("/")}", ${character.name}`, undefined, topic.conditions, topic.effects);
    }
  }
  return usages;
}

/** Every flag name the world mentions, declared or not. */
export function allFlags(world: World): string[] {
  const names = new Set(Object.keys(world.flags));
  const json = JSON.stringify(world);
  for (const match of json.matchAll(/"flag":"([^"]*)"/g)) if (match[1]) names.add(match[1]);
  return [...names].sort();
}

/** A unique id from a display name: "Brass Key" → "brass_key", then "brass_key_2". */
export function slugId(name: string, taken: Record<string, unknown>): string {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "") || "thing";
  let id = base;
  for (let n = 2; id in taken; n++) id = `${base}_${n}`;
  return id;
}
