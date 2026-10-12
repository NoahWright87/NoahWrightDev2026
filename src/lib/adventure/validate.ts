// Structural validation for worlds that come from outside the code: uploaded
// files, localStorage, fetched JSON. It answers "will the engine and editor
// choke on this?", not "is this a good game?" (that's checks.ts).

import { FORMAT_VERSION, type World } from "./types";

export type ParseResult = { ok: true; world: World } | { ok: false; errors: string[] };

const MAX_ERRORS = 20;

export function parseWorldJson(text: string): ParseResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (e) {
    return { ok: false, errors: [`That isn't valid JSON: ${(e as Error).message}`] };
  }
  return validateWorld(data);
}

export function validateWorld(data: unknown): ParseResult {
  const errors: string[] = [];
  const fail = (path: string, problem: string) => {
    if (errors.length < MAX_ERRORS) errors.push(`${path}: ${problem}`);
  };

  if (!isObject(data)) return { ok: false, errors: ["The file isn't a world (expected a JSON object)."] };
  const migrated = migrateWorld(data);
  if (typeof migrated === "string") return { ok: false, errors: [migrated] };
  const w = migrated;

  checkString(w, "title", "world", fail);
  checkRef(w.start, "world.start", fail);
  for (const key of ["areas", "items", "characters", "flags"] as const) {
    if (!isObject(w[key])) fail(`world.${key}`, "should be an object");
  }
  if (errors.length) return { ok: false, errors };

  for (const [areaId, area] of Object.entries(w.areas as Record<string, unknown>)) {
    const path = `areas.${areaId}`;
    if (!isObject(area)) {
      fail(path, "should be an object");
      continue;
    }
    checkString(area, "name", path, fail);
    if (!isObject(area.tiles)) fail(`${path}.tiles`, "should be an object");
    if (area.edges === undefined) area.edges = {};
    if (!isObject(area.edges)) fail(`${path}.edges`, "should be an object");
    if (!isObject(area.tiles)) continue;
    for (const [coord, tile] of Object.entries(area.tiles)) {
      const tilePath = `${path}.tiles["${coord}"]`;
      if (!/^-?\d+,-?\d+$/.test(coord)) fail(tilePath, "keys must look like \"x,y\"");
      if (!isObject(tile)) {
        fail(tilePath, "should be an object");
        continue;
      }
      checkString(tile, "name", tilePath, fail);
      if (typeof tile.description !== "string") tile.description = "";
      for (const list of ["details", "scenery", "items", "characters", "teleporters", "rules", "onEnter"]) {
        if (tile[list] !== undefined && !Array.isArray(tile[list])) fail(`${tilePath}.${list}`, "should be a list");
      }
      for (const [i, t] of ((tile.teleporters as unknown[]) ?? []).entries()) {
        if (!isObject(t)) {
          fail(`${tilePath}.teleporters[${i}]`, "should be an object");
          continue;
        }
        checkRef(t.to, `${tilePath}.teleporters[${i}].to`, fail);
        if (!Array.isArray(t.commands)) fail(`${tilePath}.teleporters[${i}].commands`, "should be a list");
      }
      checkRules(tile.rules, `${tilePath}.rules`, fail);
    }
  }

  for (const [id, item] of Object.entries(w.items as Record<string, unknown>)) {
    if (!isObject(item)) {
      fail(`items.${id}`, "should be an object");
      continue;
    }
    checkString(item, "name", `items.${id}`, fail);
    if (typeof item.description !== "string") item.description = "";
    checkRules(item.rules, `items.${id}.rules`, fail);
  }

  for (const [id, character] of Object.entries(w.characters as Record<string, unknown>)) {
    if (!isObject(character)) {
      fail(`characters.${id}`, "should be an object");
      continue;
    }
    checkString(character, "name", `characters.${id}`, fail);
    if (typeof character.description !== "string") character.description = "";
    if (character.topics !== undefined && !Array.isArray(character.topics)) {
      fail(`characters.${id}.topics`, "should be a list");
    }
    checkRules(character.rules, `characters.${id}.rules`, fail);
  }

  if (errors.length) return { ok: false, errors };
  return { ok: true, world: w as unknown as World };
}

/**
 * Upgrades older formats in place. Only version 1 exists so far; when the
 * format changes, convert here so old saves and exports keep loading.
 */
export function migrateWorld(data: Record<string, unknown>): Record<string, unknown> | string {
  const format = data.format;
  if (format === FORMAT_VERSION) return data;
  if (typeof format !== "number") return "The file has no \"format\" number, so it isn't a world file.";
  if (format > FORMAT_VERSION) {
    return `This world is format ${format}, newer than this editor understands (${FORMAT_VERSION}).`;
  }
  return `Unknown world format ${format}.`;
}

type Fail = (path: string, problem: string) => void;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function checkString(obj: Record<string, unknown>, key: string, path: string, fail: Fail) {
  if (typeof obj[key] !== "string") fail(`${path}.${key}`, "should be text");
}

function checkRef(ref: unknown, path: string, fail: Fail) {
  if (
    !isObject(ref) ||
    typeof ref.area !== "string" ||
    !Number.isInteger(ref.x) ||
    !Number.isInteger(ref.y)
  ) {
    fail(path, "should be { area, x, y }");
  }
}

function checkRules(rules: unknown, path: string, fail: Fail) {
  if (rules === undefined) return;
  if (!Array.isArray(rules)) return fail(path, "should be a list");
  rules.forEach((rule, i) => {
    if (!isObject(rule)) return fail(`${path}[${i}]`, "should be an object");
    if (typeof rule.id !== "string") fail(`${path}[${i}].id`, "should be text");
    if (!Array.isArray(rule.verbs)) fail(`${path}[${i}].verbs`, "should be a list");
  });
}
