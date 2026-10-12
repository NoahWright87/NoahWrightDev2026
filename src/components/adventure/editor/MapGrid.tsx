"use client";

import type { Direction, Edge, World } from "@/lib/adventure/types";
import { coordKey, edgeKey, parseCoordKey, sameTile } from "@/lib/adventure/world";

interface MapGridProps {
  world: World;
  areaId: string;
  selected: { x: number; y: number } | null;
  onSelect: (x: number, y: number) => void;
  onCreate: (x: number, y: number) => void;
  onCycleEdge: (x: number, y: number, dir: Extract<Direction, "east" | "south">) => void;
}

/**
 * One area as a grid. Tiles are buttons; the empty ring around them is where
 * new tiles go; the gaps between neighbouring tiles are edge buttons that
 * cycle open → wall → locked.
 */
export default function MapGrid({ world, areaId, selected, onSelect, onCreate, onCycleEdge }: MapGridProps) {
  const area = world.areas[areaId];
  if (!area) return null;
  const coords = Object.keys(area.tiles).map(parseCoordKey);
  const xs = coords.length ? coords.map((c) => c.x) : [0];
  const ys = coords.length ? coords.map((c) => c.y) : [0];
  const minX = Math.min(...xs) - 1;
  const maxX = Math.max(...xs) + 1;
  const minY = Math.min(...ys) - 1;
  const maxY = Math.max(...ys) + 1;
  const cols = maxX - minX + 1;
  const rows = maxY - minY + 1;

  const cells: React.ReactNode[] = [];
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const col = (x - minX) * 2 + 1;
      const row = (y - minY) * 2 + 1;
      const tile = area.tiles[coordKey(x, y)];
      const isSelected = selected?.x === x && selected?.y === y;

      if (!tile) {
        // Only offer new tiles next to existing ones (or anywhere in an empty area).
        const touches =
          !coords.length ||
          [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ].some(([dx, dy]) => area.tiles[coordKey(x + dx, y + dy)]);
        cells.push(
          <button
            key={`c${x},${y}`}
            type="button"
            className={touches ? "ed-cell ed-cell--empty" : "ed-cell ed-cell--void"}
            style={{ gridColumn: col, gridRow: row }}
            onClick={() => onCreate(x, y)}
            aria-label={`Add a room at ${x}, ${y}`}
            title={`Add a room at ${x}, ${y}`}
          >
            <span aria-hidden="true">+</span>
          </button>,
        );
        continue;
      }

      const here = { area: areaId, x, y };
      const isStart = sameTile(world.start, here);
      const badges: { icon: string; label: string }[] = [];
      if (isStart) badges.push({ icon: "★", label: "start" });
      if (tile.items?.length) badges.push({ icon: `▣${tile.items.length}`, label: `${tile.items.length} item(s)` });
      if (tile.characters?.length) {
        badges.push({ icon: `☺${tile.characters.length}`, label: `${tile.characters.length} character(s)` });
      }
      if (tile.teleporters?.length) badges.push({ icon: `⇅${tile.teleporters.length}`, label: "teleporter(s)" });
      const ruleCount = (tile.rules?.length ?? 0) + (tile.onEnter?.length ?? 0);
      if (ruleCount) badges.push({ icon: `⚙${ruleCount}`, label: `${ruleCount} rule(s)` });
      if (!tile.description.trim()) badges.push({ icon: "✎", label: "needs a description" });

      cells.push(
        <button
          key={`c${x},${y}`}
          type="button"
          className={`ed-cell ed-cell--tile${isSelected ? " ed-cell--selected" : ""}${isStart ? " ed-cell--start" : ""}`}
          style={{ gridColumn: col, gridRow: row }}
          onClick={() => onSelect(x, y)}
          aria-pressed={isSelected}
          aria-label={`${tile.name} at ${x}, ${y}${badges.length ? `: ${badges.map((b) => b.label).join(", ")}` : ""}`}
        >
          <span className="ed-cell__name">{tile.name || "(unnamed)"}</span>
          <span className="ed-cell__badges" aria-hidden="true">
            {badges.map((b) => (
              <span key={b.label} title={b.label}>
                {b.icon}
              </span>
            ))}
          </span>
        </button>,
      );

      for (const dir of ["east", "south"] as const) {
        const nx = dir === "east" ? x + 1 : x;
        const ny = dir === "south" ? y + 1 : y;
        const other = area.tiles[coordKey(nx, ny)];
        if (!other) continue;
        const edge: Edge | undefined = area.edges[edgeKey(x, y, dir)];
        const kind = edge?.kind ?? "open";
        cells.push(
          <button
            key={`e${x},${y},${dir}`}
            type="button"
            className={`ed-edge ed-edge--${dir === "east" ? "v" : "h"} ed-edge--${kind}`}
            style={dir === "east" ? { gridColumn: col + 1, gridRow: row } : { gridColumn: col, gridRow: row + 1 }}
            onClick={() => onCycleEdge(x, y, dir)}
            aria-label={`Passage between ${tile.name} and ${other.name}: ${kind}. Click to change.`}
            title={`${kind} (click: open → wall → locked)`}
          >
            {kind === "locked" ? <span aria-hidden="true">🔒</span> : null}
          </button>,
        );
      }
    }
  }

  return (
    <div className="ed-map" role="group" aria-label={`Map of ${area.name}`}>
      <div
        className="ed-map__grid"
        style={{
          gridTemplateColumns: Array.from({ length: cols * 2 - 1 }, (_, i) => (i % 2 ? "0.9rem" : "6.5rem")).join(" "),
          gridTemplateRows: Array.from({ length: rows * 2 - 1 }, (_, i) => (i % 2 ? "0.9rem" : "3.75rem")).join(" "),
        }}
      >
        {cells}
      </div>
    </div>
  );
}
