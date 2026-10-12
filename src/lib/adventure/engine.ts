// The game engine: pure functions from (world, state, input) to (state, output).
// No React and no DOM, so the game page and the editor's playtest run exactly
// the same code.
//
// Order of play for each command:
//   1. "again", "restart", "help" and other meta commands.
//   2. Teleporters on the current tile ("up", "enter shed"), by whole command.
//   3. Author rules (tile, then items in reach, then characters here). Rules
//      come before the built-ins so a world can override any of them.
//   4. Built-in verbs: look, go, take, drop, examine, inventory, talk, ask, wait.

import {
  canonicalVerb,
  nounMatches,
  nounWords,
  parse,
  PRONOUNS,
  type Command,
} from "./parser";
import {
  DIRECTIONS,
  type Condition,
  type Direction,
  type Effect,
  type GameState,
  type OutputLine,
  type Rule,
  type Teleporter,
  type TileRef,
  type Trigger,
  type World,
} from "./types";
import {
  getEdge,
  getTile,
  message,
  neighbour,
  parseTileKey,
  tileKey,
} from "./world";

export interface StepResult {
  state: GameState;
  output: OutputLine[];
}

/** A fresh playthrough: items and characters where the world places them. */
export function newGame(world: World): StepResult {
  const items: Record<string, string | null> = {};
  const characters: Record<string, string | null> = {};
  for (const id of Object.keys(world.items)) items[id] = null;
  for (const id of Object.keys(world.characters)) characters[id] = null;
  for (const [areaId, area] of Object.entries(world.areas)) {
    for (const [coord, tile] of Object.entries(area.tiles)) {
      const key = `${areaId}:${coord}`;
      for (const id of tile.items ?? []) if (id in items) items[id] = key;
      for (const id of tile.characters ?? []) if (id in characters) characters[id] = key;
    }
  }

  const state: GameState = {
    at: { ...world.start },
    items,
    characters,
    flags: [],
    visited: [],
    fired: [],
    turns: 0,
    ended: false,
  };
  const output: OutputLine[] = [{ kind: "title", text: world.title }];
  if (world.intro) output.push({ kind: "text", text: world.intro });
  arrive(world, state, output);
  return { state, output };
}

/** Plays one command. The input state is left untouched. */
export function step(world: World, prior: GameState, input: string): StepResult {
  const state: GameState = structuredClone(prior);
  const output: OutputLine[] = [{ kind: "echo", text: input.trim() }];
  const raw = input.trim().toLowerCase();

  if (raw === "restart" || raw === "restart game") {
    const fresh = newGame(world);
    return { state: fresh.state, output: [...output, ...fresh.output] };
  }
  if (state.ended) {
    output.push({ kind: "system", text: message(world, "gameOver") });
    return { state, output };
  }

  let command = parse(input);
  if (!command) return { state: prior, output: [] };

  if (command.verb === "again") {
    if (!state.lastCommand) {
      output.push({ kind: "error", text: message(world, "nothingToRepeat") });
      return { state, output };
    }
    command = parse(state.lastCommand)!;
  } else {
    state.lastCommand = input.trim();
  }

  state.turns += 1;
  run(world, state, command, output);
  return { state, output };
}

function run(world: World, state: GameState, command: Command, output: OutputLine[]) {
  if (command.verb === "help") {
    output.push({ kind: "system", text: message(world, "help") });
    return;
  }

  const teleporter = findTeleporter(world, state, command.text);
  if (teleporter) {
    useTeleporter(world, state, teleporter, output);
    return;
  }

  resolvePronouns(state, command);
  if (runRules(world, state, command, output)) return;
  builtIn(world, state, command, output);
}

// ---------------------------------------------------------------- arriving

/**
 * A teleporter loop (A's onEnter sends you to B, B's to A) would never end, so
 * arrivals are counted per turn. The output array is the turn's identity.
 */
const MAX_ARRIVALS_PER_TURN = 50;
const arrivals = new WeakMap<OutputLine[], number>();

function arrive(world: World, state: GameState, output: OutputLine[]) {
  const count = (arrivals.get(output) ?? 0) + 1;
  arrivals.set(output, count);
  if (count > MAX_ARRIVALS_PER_TURN) {
    output.push({ kind: "error", text: "(Stopped: too many moves in one turn. Check for a teleporter loop.)" });
    return;
  }
  const key = tileKey(state.at);
  const firstVisit = !state.visited.includes(key);
  if (firstVisit) state.visited.push(key);

  const tile = getTile(world, state.at);
  const at = { ...state.at };
  for (const trigger of tile?.onEnter ?? []) {
    fire(world, state, trigger, output);
    // A trigger that moves the player has already described the new room.
    if (state.ended || tileKey(state.at) !== tileKey(at)) return;
  }
  describeRoom(world, state, output);
}

export function describeRoom(world: World, state: GameState, output: OutputLine[]) {
  const tile = getTile(world, state.at);
  if (!tile) {
    output.push({ kind: "error", text: `(There is no room at ${tileKey(state.at)}.)` });
    return;
  }
  output.push({ kind: "title", text: tile.name });
  const lines = [tile.description];
  for (const detail of tile.details ?? []) {
    if (allHold(state, detail.conditions)) lines.push(detail.text);
  }
  const body = lines.filter(Boolean).join(" ");
  if (body) output.push({ kind: "text", text: body });

  const here = tileKey(state.at);
  const items = Object.entries(state.items)
    .filter(([, loc]) => loc === here)
    .map(([id]) => world.items[id]?.name)
    .filter(Boolean);
  if (items.length) {
    output.push({ kind: "text", text: message(world, "youSee", { list: items.join(", ") }) });
  }
  const people = Object.entries(state.characters)
    .filter(([, loc]) => loc === here)
    .map(([id]) => world.characters[id]?.name)
    .filter(Boolean);
  if (people.length) {
    output.push({ kind: "text", text: message(world, "peopleHere", { list: people.join(", ") }) });
  }

  const exits = listExits(world, state);
  if (exits.length) {
    output.push({ kind: "system", text: message(world, "exits", { list: exits.join(", ") }) });
  }
}

/** Compass exits (locked ones too: the player finds out when they try) and visible teleporters. */
export function listExits(world: World, state: GameState): string[] {
  const exits: string[] = DIRECTIONS.filter((dir) => {
    if (!getTile(world, neighbour(state.at, dir))) return false;
    return getEdge(world, state.at, dir)?.kind !== "wall";
  });
  for (const t of getTile(world, state.at)?.teleporters ?? []) {
    if (!t.hidden) exits.push(t.label);
  }
  return exits;
}

// ---------------------------------------------------------------- moving

function go(world: World, state: GameState, dir: Direction, output: OutputLine[]) {
  const target = neighbour(state.at, dir);
  const edge = getEdge(world, state.at, dir);
  if (!getTile(world, target) || edge?.kind === "wall") {
    output.push({ kind: "error", text: message(world, "cantGo") });
    return;
  }
  if (edge?.kind === "locked" && !allHold(state, edge.opensWhen)) {
    output.push({ kind: "text", text: edge.lockedText || message(world, "cantGo") });
    return;
  }
  moveTo(world, state, target, output);
}

function moveTo(world: World, state: GameState, to: TileRef, output: OutputLine[]) {
  state.at = { ...to };
  arrive(world, state, output);
}

function findTeleporter(world: World, state: GameState, text: string): Teleporter | undefined {
  const tile = getTile(world, state.at);
  if (!tile?.teleporters?.length) return undefined;
  const typed = nounWords(text);
  const withoutGo = typed.replace(/^go /, "");
  return tile.teleporters.find((t) =>
    t.commands.some((c) => {
      const wanted = nounWords(c);
      return wanted === typed || wanted === withoutGo;
    }),
  );
}

function useTeleporter(world: World, state: GameState, t: Teleporter, output: OutputLine[]) {
  if (!allHold(state, t.conditions)) {
    output.push({ kind: "text", text: t.blockedText || message(world, "cantGo") });
    return;
  }
  if (t.text) output.push({ kind: "text", text: t.text });
  moveTo(world, state, t.to, output);
}

// ---------------------------------------------------------------- rules

/** Whatever the player can refer to: carried items, items here, characters here. */
interface Scope {
  carried: string[];
  itemsHere: string[];
  charactersHere: string[];
}

function scope(state: GameState): Scope {
  const here = tileKey(state.at);
  return {
    carried: Object.keys(state.items).filter((id) => state.items[id] === "inventory"),
    itemsHere: Object.keys(state.items).filter((id) => state.items[id] === here),
    charactersHere: Object.keys(state.characters).filter((id) => state.characters[id] === here),
  };
}

function itemNames(world: World, id: string): string[] {
  const item = world.items[id];
  return item ? [item.name, ...(item.aliases ?? [])] : [];
}

function characterNames(world: World, id: string): string[] {
  const character = world.characters[id];
  return character ? [character.name, ...(character.aliases ?? [])] : [];
}

/** "it" → the last thing mentioned. */
function resolvePronouns(state: GameState, command: Command) {
  if (command.noun && PRONOUNS.has(command.noun) && state.lastNoun) {
    command.noun = `@${state.lastNoun.kind}:${state.lastNoun.id}`;
  }
}

function refersToItem(world: World, noun: string | undefined, id: string): boolean {
  if (!noun) return false;
  if (noun === `@item:${id}`) return true;
  return nounMatches(noun, itemNames(world, id));
}

function refersToCharacter(world: World, noun: string | undefined, id: string): boolean {
  if (!noun) return false;
  if (noun === `@character:${id}`) return true;
  return nounMatches(noun, characterNames(world, id));
}

function verbMatches(rule: Rule, verb: string): boolean {
  return rule.verbs.some((v) => canonicalVerb(v) === verb);
}

function runRules(world: World, state: GameState, command: Command, output: OutputLine[]): boolean {
  const tile = getTile(world, state.at);
  const { carried, itemsHere, charactersHere } = scope(state);

  // Tile rules: nouns are scenery words, or nothing for a bare verb.
  for (const rule of tile?.rules ?? []) {
    if (!verbMatches(rule, command.verb)) continue;
    const nouns = rule.nouns ?? [];
    const matches = nouns.length
      ? nounMatches(command.noun ?? "", nouns) || nounMatches(command.noun2 ?? "", nouns)
      : !command.noun;
    if (matches && fire(world, state, rule, output)) return true;
  }

  // Item and character rules: the thing is one noun; rule.nouns names the other.
  const things: { kind: "item" | "character"; id: string; rules: Rule[] }[] = [
    ...[...carried, ...itemsHere].map((id) => ({
      kind: "item" as const,
      id,
      rules: world.items[id]?.rules ?? [],
    })),
    ...charactersHere.map((id) => ({
      kind: "character" as const,
      id,
      rules: world.characters[id]?.rules ?? [],
    })),
  ];
  for (const thing of things) {
    const refers = thing.kind === "item" ? refersToItem : refersToCharacter;
    const isFirst = refers(world, command.noun, thing.id);
    const isSecond = refers(world, command.noun2, thing.id);
    if (!isFirst && !isSecond) continue;
    const other = isFirst ? command.noun2 : command.noun;
    for (const rule of thing.rules) {
      if (!verbMatches(rule, command.verb)) continue;
      const nouns = rule.nouns ?? [];
      if (nouns.length && !nounMatches(other ?? "", nouns)) continue;
      if (fire(world, state, rule, output)) {
        state.lastNoun = { kind: thing.kind, id: thing.id };
        return true;
      }
    }
  }
  return false;
}

/** Fires a rule or trigger if its conditions hold and it isn't used up. */
function fire(world: World, state: GameState, trigger: Trigger, output: OutputLine[]): boolean {
  if (trigger.once && state.fired.includes(trigger.id)) return false;
  if (!allHold(state, trigger.conditions)) return false;
  if (trigger.once) state.fired.push(trigger.id);
  if (trigger.text) output.push({ kind: "text", text: trigger.text });
  for (const effect of trigger.effects ?? []) {
    applyEffect(world, state, effect, output);
    if (state.ended) break;
  }
  return true;
}

export function holds(state: GameState, condition: Condition): boolean {
  const here = tileKey(state.at);
  let result: boolean;
  switch (condition.type) {
    case "hasItem":
      result = state.items[condition.item] === "inventory";
      break;
    case "itemHere":
      result = state.items[condition.item] === here;
      break;
    case "characterHere":
      result = state.characters[condition.character] === here;
      break;
    case "flag":
      result = state.flags.includes(condition.flag);
      break;
    case "visited":
      result = state.visited.includes(tileKey(condition.tile));
      break;
    default:
      result = false;
  }
  return condition.not ? !result : result;
}

export function allHold(state: GameState, conditions: Condition[] | undefined): boolean {
  return (conditions ?? []).every((c) => holds(state, c));
}

function applyEffect(world: World, state: GameState, effect: Effect, output: OutputLine[]) {
  switch (effect.type) {
    case "setFlag":
      if (!state.flags.includes(effect.flag)) state.flags.push(effect.flag);
      break;
    case "clearFlag":
      state.flags = state.flags.filter((f) => f !== effect.flag);
      break;
    case "giveItem":
      state.items[effect.item] = "inventory";
      break;
    case "removeItem":
      state.items[effect.item] = null;
      break;
    case "placeItem":
      state.items[effect.item] = tileKey(effect.tile);
      break;
    case "moveCharacter":
      state.characters[effect.character] = effect.tile ? tileKey(effect.tile) : null;
      break;
    case "teleport":
      moveTo(world, state, effect.to, output);
      break;
    case "endGame":
      state.ended = true;
      if (effect.text) output.push({ kind: "end", text: effect.text });
      break;
  }
}

// ---------------------------------------------------------------- built-in verbs

function builtIn(world: World, state: GameState, command: Command, output: OutputLine[]) {
  const say = (kind: OutputLine["kind"], text: string) => output.push({ kind, text });
  const { carried, itemsHere, charactersHere } = scope(state);
  const noun = command.noun;
  const typed = noun?.startsWith("@") ? "it" : noun ?? "";
  const verbWord = command.verb;

  switch (command.verb) {
    case "look":
      if (noun) return builtIn(world, state, { ...command, verb: "examine" }, output);
      describeRoom(world, state, output);
      return;

    case "go": {
      if (command.direction) return go(world, state, command.direction, output);
      if (!noun) return say("error", message(world, "noNoun", { verb: "Go" }));
      return say("error", message(world, "noExit"));
    }

    case "inventory": {
      if (!carried.length) return say("text", message(world, "inventoryEmpty"));
      const list = carried.map((id) => world.items[id]?.name ?? id).join(", ");
      return say("text", message(world, "inventory", { list }));
    }

    case "wait":
      return say("text", message(world, "waited"));

    case "take": {
      if (!noun) return say("error", message(world, "noNoun", { verb: "Take" }));
      const held = carried.find((id) => refersToItem(world, noun, id));
      if (held) return say("text", message(world, "alreadyHave"));
      const id = itemsHere.find((i) => refersToItem(world, noun, i));
      if (!id) {
        if (charactersHere.some((c) => refersToCharacter(world, noun, c))) {
          return say("text", message(world, "cantTake"));
        }
        if (findScenery(world, state, noun)) return say("text", message(world, "cantTake"));
        return say("error", message(world, "notHere", { noun: typed }));
      }
      state.lastNoun = { kind: "item", id };
      if (world.items[id].portable === false) return say("text", message(world, "cantTake"));
      state.items[id] = "inventory";
      return say("text", message(world, "taken", { noun: world.items[id].name }));
    }

    case "drop": {
      if (!noun) return say("error", message(world, "noNoun", { verb: "Drop" }));
      const id = carried.find((i) => refersToItem(world, noun, i));
      if (!id) return say("error", message(world, "dontHave"));
      state.items[id] = tileKey(state.at);
      state.lastNoun = { kind: "item", id };
      return say("text", message(world, "dropped", { noun: world.items[id].name }));
    }

    case "examine": {
      if (!noun) return describeRoom(world, state, output);
      const item = [...carried, ...itemsHere].find((i) => refersToItem(world, noun, i));
      if (item) {
        state.lastNoun = { kind: "item", id: item };
        return say("text", world.items[item].description || message(world, "nothingHappens"));
      }
      const character = charactersHere.find((c) => refersToCharacter(world, noun, c));
      if (character) {
        state.lastNoun = { kind: "character", id: character };
        return say("text", world.characters[character].description);
      }
      const scenery = findScenery(world, state, noun);
      if (scenery) return say("text", scenery.description);
      return say("error", message(world, "notHere", { noun: typed }));
    }

    case "talk": {
      if (!noun) return say("error", message(world, "noNoun", { verb: "Talk to" }));
      const id = charactersHere.find((c) => refersToCharacter(world, noun, c));
      if (!id) return say("error", message(world, "notHere", { noun: typed }));
      state.lastNoun = { kind: "character", id };
      return say("text", world.characters[id].greeting || message(world, "noReply"));
    }

    case "ask":
    case "tell": {
      if (!noun) return say("error", message(world, "noNoun", { verb: "Ask" }));
      const id = charactersHere.find((c) => refersToCharacter(world, noun, c));
      if (!id) return say("error", message(world, "notHere", { noun: typed }));
      state.lastNoun = { kind: "character", id };
      const about = command.noun2 ?? "";
      const topic = world.characters[id].topics?.find(
        (t) => nounMatchesAny(about, t.keywords) && allHold(state, t.conditions),
      );
      if (!topic) return say("text", message(world, "noTopic"));
      say("text", topic.text);
      for (const effect of topic.effects ?? []) {
        applyEffect(world, state, effect, output);
        if (state.ended) break;
      }
      return;
    }

    case "use":
    case "open":
    case "close":
    case "push":
    case "pull":
    case "turn on":
    case "turn off":
    case "unlock":
    case "lock":
    case "give":
    case "put":
    case "climb":
    case "eat":
    case "break": {
      if (!noun) return say("error", message(world, "noNoun", { verb: capitalize(verbWord) }));
      const known =
        [...carried, ...itemsHere].some((i) => refersToItem(world, noun, i)) ||
        charactersHere.some((c) => refersToCharacter(world, noun, c)) ||
        !!findScenery(world, state, noun);
      if (!known) return say("error", message(world, "notHere", { noun: typed }));
      return say("text", message(world, "nothingHappens"));
    }

    default:
      return say("error", message(world, "unknownVerb", { verb: verbWord }));
  }
}

/** A topic matches if any keyword appears in what was asked about. */
function nounMatchesAny(about: string, keywords: string[]): boolean {
  const words = nounWords(about).split(" ");
  return keywords.some((k) => {
    const keyword = nounWords(k);
    return keyword && (nounWords(about) === keyword || words.includes(keyword));
  });
}

function findScenery(world: World, state: GameState, noun: string) {
  return getTile(world, state.at)?.scenery?.find((s) => nounMatches(noun, s.names));
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Where an item or character is, for display ("inventory", a tile, or gone). */
export function locationOf(loc: string | null): "inventory" | TileRef | null {
  if (loc === null) return null;
  if (loc === "inventory") return "inventory";
  return parseTileKey(loc);
}
