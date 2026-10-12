"use client";

import type { GameState, World } from "@/lib/adventure/types";
import { getEdge, getTile, parseTileKey } from "@/lib/adventure/world";

const CELL = 18;
const GAP = 8;
const PITCH = CELL + GAP;

/**
 * The player's map of the current area: only rooms they've visited, joined
 * where there's a passage. Rooms with a way up, down or in get a dot.
 */
export default function MiniMap({ world, state }: { world: World; state: GameState }) {
  const area = state.at.area;
  const cells = state.visited
    .map(parseTileKey)
    .filter((ref) => ref.area === area && getTile(world, ref));
  if (!cells.some((c) => c.x === state.at.x && c.y === state.at.y)) cells.push(state.at);

  const xs = cells.map((c) => c.x);
  const ys = cells.map((c) => c.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const width = (Math.max(...xs) - minX + 1) * PITCH - GAP;
  const height = (Math.max(...ys) - minY + 1) * PITCH - GAP;
  const visited = new Set(cells.map((c) => `${c.x},${c.y}`));
  const px = (x: number) => (x - minX) * PITCH;
  const py = (y: number) => (y - minY) * PITCH;

  const links: { x1: number; y1: number; x2: number; y2: number; locked: boolean }[] = [];
  for (const c of cells) {
    for (const dir of ["east", "south"] as const) {
      const nx = dir === "east" ? c.x + 1 : c.x;
      const ny = dir === "south" ? c.y + 1 : c.y;
      if (!visited.has(`${nx},${ny}`)) continue;
      const edge = getEdge(world, c, dir);
      if (edge?.kind === "wall") continue;
      links.push({
        x1: px(c.x) + CELL / 2,
        y1: py(c.y) + CELL / 2,
        x2: px(nx) + CELL / 2,
        y2: py(ny) + CELL / 2,
        locked: edge?.kind === "locked",
      });
    }
  }

  const areaName = world.areas[area]?.name ?? area;
  return (
    <figure className="adv-map">
      <svg
        viewBox={`-4 -4 ${width + 8} ${height + 8}`}
        width={Math.min(width + 8, 240)}
        role="img"
        aria-label={`Map of ${areaName}: ${cells.length} room${cells.length === 1 ? "" : "s"} explored`}
      >
        {links.map((l, i) => (
          <line key={i} {...l} className={l.locked ? "adv-map__link adv-map__link--locked" : "adv-map__link"} />
        ))}
        {cells.map((c) => {
          const here = c.x === state.at.x && c.y === state.at.y;
          const tile = getTile(world, c);
          const hasPortal = tile?.teleporters?.some((t) => !t.hidden);
          return (
            <g key={`${c.x},${c.y}`}>
              <rect
                x={px(c.x)}
                y={py(c.y)}
                width={CELL}
                height={CELL}
                rx={3}
                className={here ? "adv-map__cell adv-map__cell--here" : "adv-map__cell"}
              >
                <title>{tile?.name}</title>
              </rect>
              {hasPortal ? (
                <circle cx={px(c.x) + CELL - 4} cy={py(c.y) + 4} r={2.5} className="adv-map__portal" />
              ) : null}
            </g>
          );
        })}
      </svg>
      <figcaption>{areaName}</figcaption>
    </figure>
  );
}
