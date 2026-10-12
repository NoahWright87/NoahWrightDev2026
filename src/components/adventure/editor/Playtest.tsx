"use client";

import type { TileRef, World } from "@/lib/adventure/types";
import { describeRef } from "@/lib/adventure/world";
import MiniMap from "../MiniMap";
import Terminal from "../Terminal";
import { useAdventure } from "../useAdventure";

/**
 * The real engine on a snapshot of the world being edited. It doesn't follow
 * edits live (that would restart the game on every keystroke); "Restart with
 * latest edits" takes a fresh snapshot.
 */
export default function Playtest({
  world,
  onRestartWithEdits,
  onClose,
  onGoTo,
}: {
  world: World;
  onRestartWithEdits: () => void;
  onClose: () => void;
  onGoTo: (ref: TileRef) => void;
}) {
  const { state, log, submit } = useAdventure(world);
  const carried = state ? Object.keys(state.items).filter((id) => state.items[id] === "inventory") : [];

  return (
    <section className="ed-playtest" aria-label="Playtest">
      <Terminal log={log} onSubmit={submit} autoFocus label="Playtest command" className="ed-playtest__term" />
      <aside className="ed-playtest__state">
        <div className="ed-row">
          <button type="button" className="ed-btn ed-btn--small" onClick={onRestartWithEdits}>
            ↻ Restart with latest edits
          </button>
          <button type="button" className="ed-btn ed-btn--small" onClick={onClose}>
            Close
          </button>
        </div>
        {state ? (
          <>
            <p>
              <strong>Room:</strong>{" "}
              <button type="button" className="ed-linkish" onClick={() => onGoTo(state.at)} title="Show this room in the editor">
                {describeRef(world, state.at)}
              </button>
            </p>
            <p>
              <strong>Carrying:</strong> {carried.length ? carried.map((id) => world.items[id]?.name ?? id).join(", ") : "nothing"}
            </p>
            <p>
              <strong>Flags on:</strong> {state.flags.length ? state.flags.map((f) => <code key={f}>{f} </code>) : "none"}
            </p>
            <p>
              <strong>Turns:</strong> {state.turns}
              {state.ended ? " · game over" : ""}
            </p>
            <MiniMap world={world} state={state} />
          </>
        ) : null}
      </aside>
    </section>
  );
}
