import { readFileSync } from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";
import { newGame, step } from "../../src/lib/adventure/engine";
import { parse } from "../../src/lib/adventure/parser";
import { checkWorld } from "../../src/lib/adventure/checks";
import { parseWorldJson, validateWorld } from "../../src/lib/adventure/validate";
import type { GameState, World } from "../../src/lib/adventure/types";

function loadWorld(name: string): World {
  const file = path.join(__dirname, "../../public/adventure/worlds", `${name}.json`);
  const result = parseWorldJson(readFileSync(file, "utf8"));
  if (!result.ok) throw new Error(result.errors.join("\n"));
  return result.world;
}

/** Plays commands in order and returns the final state plus all text said. */
function play(world: World, commands: string[]): { state: GameState; said: string } {
  const start = newGame(world);
  let state = start.state;
  const lines = start.output.map((l) => l.text);
  for (const command of commands) {
    const result = step(world, state, command);
    state = result.state;
    lines.push(...result.output.map((l) => l.text));
  }
  return { state, said: lines.join("\n") };
}

test.describe("parser", () => {
  test("directions and shortcuts", () => {
    expect(parse("n")).toMatchObject({ verb: "go", direction: "north" });
    expect(parse("Go WEST!")).toMatchObject({ verb: "go", direction: "west" });
    expect(parse("walk east")).toMatchObject({ verb: "go", direction: "east" });
  });

  test("synonyms, filler and two nouns", () => {
    expect(parse("pick up the brass key")).toMatchObject({ verb: "take", noun: "brass key" });
    expect(parse("x sign")).toMatchObject({ verb: "examine", noun: "sign" });
    expect(parse("look at the sign")).toMatchObject({ verb: "examine", noun: "sign" });
    expect(parse("talk to the cat")).toMatchObject({ verb: "talk", noun: "cat" });
    expect(parse("ask cat about the key")).toMatchObject({ verb: "ask", noun: "cat", noun2: "key" });
    expect(parse("use key on door")).toMatchObject({ verb: "use", noun: "key", noun2: "door" });
    expect(parse("switch on the light")).toMatchObject({ verb: "turn on", noun: "light" });
    expect(parse("turn off lamp")).toMatchObject({ verb: "turn off", noun: "lamp" });
    expect(parse("i")).toMatchObject({ verb: "inventory" });
  });
});

test.describe("engine", () => {
  const world = loadWorld("example");

  test("the example world can be won", () => {
    const { state, said } = play(world, [
      "e",
      "take key",
      "w",
      "s",
      "e",
      "enter shed",
      "unlock door with key",
      "enter shed",
      "e",
      "pull cord",
      "e",
      "climb ladder",
      "take trophy",
    ]);
    expect(said).toContain("The door is padlocked.");
    expect(said).toContain("It's too dark to find your way further in.");
    expect(said).toContain("only shows once");
    expect(state.ended).toBe(true);
    expect(state.items.trophy).toBe("inventory");
  });

  test("walls block", () => {
    expect(play(world, ["e", "s"]).said).toContain("You can't go that way.");
  });

  test("pronouns refer to the last thing mentioned", () => {
    const { said } = play(world, ["e", "x key", "take it", "i"]);
    expect(said).toContain("Taken: brass key.");
    expect(said).toContain("You're carrying: brass key.");
  });

  test("once triggers fire once, again repeats, messages override", () => {
    const { said } = play(world, ["e", "wait", "again", "pet cat", "ask cat about key"]);
    expect(said.match(/The cat doesn't\./g)).toHaveLength(2);
    expect(said).toContain("The cat allows it.");
    expect(said).toContain("The cat looks at the shed.");
  });

  test("step never mutates its input state", () => {
    const { state } = newGame(world);
    const before = JSON.stringify(state);
    step(world, state, "e");
    step(world, state, "take key");
    expect(JSON.stringify(state)).toBe(before);
  });

  test("restart and the game-over guard", () => {
    const won = play(world, ["e", "take key", "w", "s", "e", "unlock door", "in", "pull cord", "e", "up", "take trophy"]);
    expect(won.state.ended).toBe(true);
    const after = step(world, won.state, "look");
    expect(after.output.map((l) => l.text).join()).toContain("restart");
    const fresh = step(world, won.state, "restart");
    expect(fresh.state.ended).toBe(false);
    expect(fresh.state.at).toEqual(world.start);
  });
});

test.describe("worlds", () => {
  for (const name of ["example", "site", "blank"]) {
    test(`${name} validates and has no check errors`, () => {
      const world = loadWorld(name);
      const errors = checkWorld(world).filter((i) => i.level === "error");
      expect(errors).toEqual([]);
    });
  }

  test("the example has no warnings either", () => {
    expect(checkWorld(loadWorld("example"))).toEqual([]);
  });

  test("validation rejects junk with readable errors", () => {
    expect(parseWorldJson("not json").ok).toBe(false);
    const noFormat = validateWorld({ title: "x" });
    expect(noFormat.ok).toBe(false);
    const future = validateWorld({ format: 99 });
    expect(future.ok === false && future.errors[0]).toContain("newer");
  });
});
