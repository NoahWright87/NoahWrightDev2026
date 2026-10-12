"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { newGame, step } from "@/lib/adventure/engine";
import { loadProgress, saveProgress } from "@/lib/adventure/storage";
import type { GameState, OutputLine, World } from "@/lib/adventure/types";
import { getTile } from "@/lib/adventure/world";

export interface LogLine extends OutputLine {
  id: number;
}

/** Long sessions shouldn't grow the DOM forever. */
const MAX_LOG = 400;

/**
 * Runs a game of `world`. With a `progressKey`, the game state is kept in
 * localStorage so a refresh resumes where the player was.
 */
export function useAdventure(world: World | null, progressKey?: string) {
  const [state, setState] = useState<GameState | null>(null);
  const [log, setLog] = useState<LogLine[]>([]);
  const nextId = useRef(0);
  const stateRef = useRef<GameState | null>(null);

  const append = useCallback((lines: OutputLine[], reset = false) => {
    const tagged = lines.map((line) => ({ ...line, id: nextId.current++ }));
    setLog((prev) => (reset ? tagged : [...prev, ...tagged]).slice(-MAX_LOG));
  }, []);

  const commit = useCallback(
    (next: GameState) => {
      stateRef.current = next;
      setState(next);
      if (progressKey) saveProgress(progressKey, next);
    },
    [progressKey],
  );

  const restart = useCallback(() => {
    if (!world) return;
    const fresh = newGame(world);
    commit(fresh.state);
    append(fresh.output, true);
  }, [world, commit, append]);

  // (Re)start whenever the world changes, resuming saved progress if it still fits the world.
  useEffect(() => {
    if (!world) return;
    const saved = progressKey ? loadProgress(progressKey) : null;
    if (saved && fitsWorld(world, saved)) {
      const look = step(world, saved, "look");
      commit(saved);
      append(
        [{ kind: "system", text: "(Picking up where you left off. Type \"restart\" to start over.)" }, ...look.output.slice(1)],
        true,
      );
    } else {
      restart();
    }
  }, [world, progressKey, restart, commit, append]);

  const submit = useCallback(
    (input: string) => {
      const current = stateRef.current;
      if (!world || !current || !input.trim()) return;
      const result = step(world, current, input);
      commit(result.state);
      append(result.output);
    },
    [world, commit, append],
  );

  return { state, log, submit, restart };
}

/** Saved progress from an older version of a world may point at rooms that are gone. */
function fitsWorld(world: World, state: GameState): boolean {
  if (!state?.at || !getTile(world, state.at)) return false;
  const sameKeys = (a: object, b: object) =>
    Object.keys(a).sort().join() === Object.keys(b).sort().join();
  return sameKeys(state.items ?? {}, world.items) && sameKeys(state.characters ?? {}, world.characters);
}
