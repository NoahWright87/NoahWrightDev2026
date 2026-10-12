"use client";

import { useState } from "react";
import type { Direction, Edge, Teleporter, Tile, TileRef, World } from "@/lib/adventure/types";
import { DIRECTIONS } from "@/lib/adventure/types";
import {
  coordKey,
  describeRef,
  edgeKey,
  getTile,
  neighbour,
  newId,
  parseTileKey,
  sameTile,
  tileKey,
} from "@/lib/adventure/world";
import { slugId } from "@/lib/adventure/usages";
import {
  Checkbox,
  ConditionsEditor,
  ListField,
  newRule,
  newTrigger,
  RulesEditor,
  Section,
  Select,
  SmallButton,
  TextArea,
  TextField,
  TilePicker,
} from "./fields";

type Tab = "description" | "exits" | "contents" | "rules";

interface TileInspectorProps {
  world: World;
  at: TileRef;
  /** Applies a change to a copy of the world. */
  edit: (fn: (w: World) => void) => void;
  onGoTo: (ref: TileRef) => void;
  onPlaytestFrom: (ref: TileRef) => void;
}

export default function TileInspector({ world, at, edit, onGoTo, onPlaytestFrom }: TileInspectorProps) {
  const [tab, setTab] = useState<Tab>("description");
  const tile = getTile(world, at);
  if (!tile) return null;

  const editTile = (fn: (t: Tile, w: World) => void) =>
    edit((w) => {
      const t = getTile(w, at);
      if (t) fn(t, w);
    });

  const isStart = sameTile(world.start, at);
  const tabs: { id: Tab; label: string }[] = [
    { id: "description", label: "Description" },
    { id: "exits", label: `Exits${tile.teleporters?.length ? ` (${tile.teleporters.length}⇅)` : ""}` },
    {
      id: "contents",
      label: `Contents${(tile.items?.length ?? 0) + (tile.characters?.length ?? 0) + (tile.scenery?.length ?? 0) ? ` (${(tile.items?.length ?? 0) + (tile.characters?.length ?? 0) + (tile.scenery?.length ?? 0)})` : ""}`,
    },
    { id: "rules", label: `Rules${(tile.rules?.length ?? 0) + (tile.onEnter?.length ?? 0) ? ` (${(tile.rules?.length ?? 0) + (tile.onEnter?.length ?? 0)})` : ""}` },
  ];

  return (
    <div className="ed-inspector">
      <div className="ed-inspector__head">
        <div>
          <h2>{tile.name || "(unnamed)"}</h2>
          <p className="ed-hint">
            {world.areas[at.area]?.name} · {at.x}, {at.y}
            {isStart ? " · ★ start" : ""}
          </p>
        </div>
        <div className="ed-inspector__actions">
          <SmallButton onClick={() => onPlaytestFrom(at)} title="Playtest from this room">
            ▶ Play from here
          </SmallButton>
          {!isStart ? (
            <SmallButton onClick={() => edit((w) => void (w.start = { ...at }))} title="Make this the start room">
              ★ Set as start
            </SmallButton>
          ) : null}
          <SmallButton
            danger
            disabled={isStart}
            title={isStart ? "The start room can't be deleted" : "Delete this room"}
            onClick={() => {
              if (!window.confirm(`Delete "${tile.name}"? Anything placed here goes with it.`)) return;
              edit((w) => {
                const area = w.areas[at.area];
                delete area.tiles[coordKey(at.x, at.y)];
                for (const dir of DIRECTIONS) delete area.edges[edgeKey(at.x, at.y, dir)];
              });
            }}
          >
            Delete room
          </SmallButton>
        </div>
      </div>

      <div className="ed-tabs" role="tablist" aria-label="Room sections">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={tab === t.id ? "ed-tab ed-tab--active" : "ed-tab"}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="ed-inspector__body">
        {tab === "description" ? <DescriptionTab world={world} tile={tile} editTile={editTile} /> : null}
        {tab === "exits" ? (
          <ExitsTab world={world} at={at} tile={tile} edit={edit} editTile={editTile} onGoTo={onGoTo} />
        ) : null}
        {tab === "contents" ? <ContentsTab world={world} at={at} tile={tile} edit={edit} editTile={editTile} /> : null}
        {tab === "rules" ? <RulesTab world={world} tile={tile} editTile={editTile} /> : null}
      </div>
    </div>
  );
}

type EditTile = (fn: (t: Tile, w: World) => void) => void;

function DescriptionTab({ world, tile, editTile }: { world: World; tile: Tile; editTile: EditTile }) {
  const details = tile.details ?? [];
  return (
    <>
      <TextField label="Name" value={tile.name} onChange={(name) => editTile((t) => void (t.name = name))} />
      <TextArea
        label="Description"
        value={tile.description}
        rows={4}
        hint="Shown on arrival and on “look”. Items, characters and exits are listed after it automatically."
        onChange={(description) => editTile((t) => void (t.description = description))}
      />
      <Section
        title="Extra lines"
        hint="Added to the description only when their conditions hold (a door that's open, a light that's on)."
        actions={
          <SmallButton onClick={() => editTile((t) => void (t.details = [...(t.details ?? []), { text: "" }]))}>
            + line
          </SmallButton>
        }
      >
        {details.map((d, i) => (
          <div key={i} className="ed-card">
            <ConditionsEditor
              world={world}
              value={d.conditions ?? []}
              onChange={(conditions) =>
                editTile((t) => void (t.details![i] = { ...d, conditions: conditions.length ? conditions : undefined }))
              }
            />
            <TextArea
              label="Line"
              value={d.text}
              rows={2}
              onChange={(text) => editTile((t) => void (t.details![i] = { ...d, text }))}
            />
            <SmallButton danger onClick={() => editTile((t) => void t.details!.splice(i, 1))}>
              Remove line
            </SmallButton>
          </div>
        ))}
      </Section>
    </>
  );
}

const EDGE_OPTIONS: { value: Edge["kind"] | "open"; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "wall", label: "Wall" },
  { value: "locked", label: "Locked" },
];

function ExitsTab({
  world,
  at,
  tile,
  edit,
  editTile,
  onGoTo,
}: {
  world: World;
  at: TileRef;
  tile: Tile;
  edit: (fn: (w: World) => void) => void;
  editTile: EditTile;
  onGoTo: (ref: TileRef) => void;
}) {
  const setEdge = (dir: Direction, edge: Edge | null) =>
    edit((w) => {
      const key = edgeKey(at.x, at.y, dir);
      if (edge) w.areas[at.area].edges[key] = edge;
      else delete w.areas[at.area].edges[key];
    });
  const teleporters = tile.teleporters ?? [];
  const setTeleporter = (i: number, next: Teleporter) => editTile((t) => void (t.teleporters![i] = next));

  return (
    <>
      <Section title="Compass exits" hint="Neighbouring rooms connect automatically. Make the passage a wall or a lock here, or click the gap on the map.">
        {DIRECTIONS.map((dir) => {
          const other = getTile(world, neighbour(at, dir));
          const edge = world.areas[at.area].edges[edgeKey(at.x, at.y, dir)];
          if (!other) {
            return (
              <p key={dir} className="ed-exit ed-exit--none">
                <strong>{dir}</strong> · no room
              </p>
            );
          }
          return (
            <div key={dir} className="ed-exit">
              <div className="ed-row">
                <strong className="ed-exit__dir">{dir}</strong>
                <span className="ed-grow">→ {other.name}</span>
                <Select
                  label={`Passage ${dir}`}
                  hideLabel
                  value={edge?.kind ?? "open"}
                  options={EDGE_OPTIONS}
                  onChange={(kind) =>
                    setEdge(
                      dir,
                      kind === "open"
                        ? null
                        : kind === "wall"
                          ? { kind: "wall" }
                          : { kind: "locked", opensWhen: [], lockedText: "It's locked." },
                    )
                  }
                />
              </div>
              {edge?.kind === "locked" ? (
                <div className="ed-card">
                  <ConditionsEditor
                    label="Opens when"
                    world={world}
                    value={edge.opensWhen}
                    onChange={(opensWhen) => setEdge(dir, { ...edge, opensWhen })}
                  />
                  <TextField
                    label="Said while locked"
                    value={edge.lockedText}
                    onChange={(lockedText) => setEdge(dir, { ...edge, lockedText })}
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </Section>

      <Section
        title="Teleporters"
        hint="Jump to any room in any area: doors into buildings, stairs, ladders. An elevator is a room with a rule per button whose effect teleports."
        actions={
          <SmallButton
            onClick={() =>
              editTile(
                (t) =>
                  void (t.teleporters = [
                    ...teleporters,
                    { id: newId("tp"), label: "inside", commands: ["in", "enter"], to: { ...at } },
                  ]),
              )
            }
          >
            + teleporter
          </SmallButton>
        }
      >
        {teleporters.map((tp, i) => (
          <div key={tp.id} className="ed-card">
            <div className="ed-grid2">
              <TextField
                label="Listed as"
                value={tp.label}
                hint="In the exits line: “Exits: north, up the ladder.”"
                onChange={(label) => setTeleporter(i, { ...tp, label })}
              />
              <ListField
                label="Commands"
                value={tp.commands}
                placeholder="up, climb ladder"
                hint="Whole commands. A leading “go” is ignored."
                onChange={(commands) => setTeleporter(i, { ...tp, commands })}
              />
            </div>
            <TilePicker label="Goes to" world={world} value={tp.to} onChange={(to) => setTeleporter(i, { ...tp, to })} />
            <ConditionsEditor
              world={world}
              value={tp.conditions ?? []}
              onChange={(conditions) => setTeleporter(i, { ...tp, conditions: conditions.length ? conditions : undefined })}
            />
            {tp.conditions?.length ? (
              <TextField
                label="Said when blocked"
                value={tp.blockedText ?? ""}
                onChange={(blockedText) => setTeleporter(i, { ...tp, blockedText: blockedText || undefined })}
              />
            ) : null}
            <TextField
              label="Said on the way"
              value={tp.text ?? ""}
              placeholder="(optional)"
              onChange={(text) => setTeleporter(i, { ...tp, text: text || undefined })}
            />
            <div className="ed-row">
              <Checkbox
                label="Secret (not listed in exits)"
                checked={!!tp.hidden}
                onChange={(hidden) => setTeleporter(i, { ...tp, hidden: hidden || undefined })}
              />
              <span className="ed-grow" />
              <SmallButton onClick={() => onGoTo(tp.to)} title={`Go to ${describeRef(world, tp.to)}`}>
                Go there →
              </SmallButton>
              <SmallButton
                title="Add a teleporter at the destination that comes back here"
                disabled={!getTile(world, tp.to) || sameTile(tp.to, at)}
                onClick={() =>
                  edit((w) => {
                    const dest = getTile(w, tp.to);
                    if (!dest) return;
                    dest.teleporters = [
                      ...(dest.teleporters ?? []),
                      { id: newId("tp"), label: "back", commands: ["back", "out", "exit", "leave"], to: { ...at } },
                    ];
                  })
                }
              >
                + return trip
              </SmallButton>
              <SmallButton danger title="Delete teleporter" onClick={() => editTile((t) => void t.teleporters!.splice(i, 1))}>
                ✕
              </SmallButton>
            </div>
          </div>
        ))}
      </Section>
    </>
  );
}

function ContentsTab({
  world,
  at,
  tile,
  edit,
  editTile,
}: {
  world: World;
  at: TileRef;
  tile: Tile;
  edit: (fn: (w: World) => void) => void;
  editTile: EditTile;
}) {
  const [newItem, setNewItem] = useState("");
  const [newCharacter, setNewCharacter] = useState("");
  const placedAt = placements(world);
  const here = tileKey(at);

  const place = (kind: "items" | "characters", id: string) =>
    edit((w) => {
      for (const area of Object.values(w.areas)) {
        for (const t of Object.values(area.tiles)) {
          if (t[kind]) t[kind] = t[kind]!.filter((x) => x !== id);
        }
      }
      const t = getTile(w, at)!;
      t[kind] = [...(t[kind] ?? []), id];
    });

  const unplace = (kind: "items" | "characters", id: string) =>
    editTile((t) => void (t[kind] = (t[kind] ?? []).filter((x) => x !== id)));

  return (
    <>
      <Section title="Items here" hint="Each item starts in one place. Placing it here moves it.">
        <ul className="ed-chips">
          {(tile.items ?? []).map((id) => (
            <li key={id}>
              {world.items[id]?.name ?? `(missing: ${id})`}
              <SmallButton danger title={`Remove ${id} from this room`} onClick={() => unplace("items", id)}>
                ✕
              </SmallButton>
            </li>
          ))}
        </ul>
        <div className="ed-row">
          <PlaceSelect
            label="Place an item"
            options={Object.entries(world.items)
              .filter(([id]) => placedAt.items[id] !== here)
              .map(([id, item]) => ({
                value: id,
                label: placedAt.items[id] ? `${item.name} (move from ${describeRef(world, parseTileKey(placedAt.items[id]))})` : item.name,
              }))}
            onPick={(id) => place("items", id)}
          />
          <form
            className="ed-row"
            onSubmit={(e) => {
              e.preventDefault();
              const name = newItem.trim();
              if (!name) return;
              edit((w) => {
                const id = slugId(name, w.items);
                w.items[id] = { name, description: "" };
                const t = getTile(w, at)!;
                t.items = [...(t.items ?? []), id];
              });
              setNewItem("");
            }}
          >
            <input aria-label="New item name" placeholder="New item name" value={newItem} onChange={(e) => setNewItem(e.target.value)} />
            <button type="submit" className="ed-btn ed-btn--small">
              Create here
            </button>
          </form>
        </div>
      </Section>

      <Section title="Characters here">
        <ul className="ed-chips">
          {(tile.characters ?? []).map((id) => (
            <li key={id}>
              {world.characters[id]?.name ?? `(missing: ${id})`}
              <SmallButton danger title={`Remove ${id} from this room`} onClick={() => unplace("characters", id)}>
                ✕
              </SmallButton>
            </li>
          ))}
        </ul>
        <div className="ed-row">
          <PlaceSelect
            label="Place a character"
            options={Object.entries(world.characters)
              .filter(([id]) => placedAt.characters[id] !== here)
              .map(([id, ch]) => ({
                value: id,
                label: placedAt.characters[id] ? `${ch.name} (move from ${describeRef(world, parseTileKey(placedAt.characters[id]))})` : ch.name,
              }))}
            onPick={(id) => place("characters", id)}
          />
          <form
            className="ed-row"
            onSubmit={(e) => {
              e.preventDefault();
              const name = newCharacter.trim();
              if (!name) return;
              edit((w) => {
                const id = slugId(name, w.characters);
                w.characters[id] = { name, description: "" };
                const t = getTile(w, at)!;
                t.characters = [...(t.characters ?? []), id];
              });
              setNewCharacter("");
            }}
          >
            <input
              aria-label="New character name"
              placeholder="New character name"
              value={newCharacter}
              onChange={(e) => setNewCharacter(e.target.value)}
            />
            <button type="submit" className="ed-btn ed-btn--small">
              Create here
            </button>
          </form>
        </div>
      </Section>

      <Section
        title="Scenery"
        hint="Things to examine that can't be taken. Rules in this room can use their names as nouns."
        actions={
          <SmallButton
            onClick={() => editTile((t) => void (t.scenery = [...(t.scenery ?? []), { names: [], description: "" }]))}
          >
            + scenery
          </SmallButton>
        }
      >
        {(tile.scenery ?? []).map((s, i) => (
          <div key={i} className="ed-card">
            <ListField
              label="Names"
              value={s.names}
              placeholder="sign, post"
              onChange={(names) => editTile((t) => void (t.scenery![i] = { ...s, names }))}
            />
            <TextArea
              label="Description"
              value={s.description}
              rows={2}
              onChange={(description) => editTile((t) => void (t.scenery![i] = { ...s, description }))}
            />
            <SmallButton danger onClick={() => editTile((t) => void t.scenery!.splice(i, 1))}>
              Remove scenery
            </SmallButton>
          </div>
        ))}
      </Section>
    </>
  );
}

/** A select that acts like a menu: pick something and it resets. */
function PlaceSelect({
  label,
  options,
  onPick,
}: {
  label: string;
  options: { value: string; label: string }[];
  onPick: (id: string) => void;
}) {
  return (
    <select
      aria-label={label}
      value=""
      disabled={!options.length}
      onChange={(e) => {
        if (e.target.value) onPick(e.target.value);
      }}
    >
      <option value="">{options.length ? `${label}…` : `${label} (none left)`}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** Where each item and character starts, as "Room name (Area)". */
function placements(world: World) {
  const items: Record<string, string> = {};
  const characters: Record<string, string> = {};
  for (const [areaId, area] of Object.entries(world.areas)) {
    for (const [coord, t] of Object.entries(area.tiles)) {
      const key = `${areaId}:${coord}`;
      for (const id of t.items ?? []) items[id] = key;
      for (const id of t.characters ?? []) characters[id] = key;
    }
  }
  return { items, characters };
}

function RulesTab({ world, tile, editTile }: { world: World; tile: Tile; editTile: EditTile }) {
  return (
    <>
      <Section
        title="Commands in this room"
        hint="Checked top to bottom, before the built-in verbs, so a rule can override “take” or “look”. The first rule whose conditions hold wins."
        actions={<SmallButton onClick={() => editTile((t) => void (t.rules = [...(t.rules ?? []), newRule()]))}>+ rule</SmallButton>}
      >
        <RulesEditor
          world={world}
          value={tile.rules ?? []}
          nounHint="Scenery or item words. Empty means the verb on its own."
          onChange={(rules) => editTile((t) => void (t.rules = rules.length ? rules : undefined))}
        />
      </Section>
      <Section
        title="On arrival"
        hint="Runs every time the player walks in (tick “once” for a first-visit line), before the room is described."
        actions={
          <SmallButton onClick={() => editTile((t) => void (t.onEnter = [...(t.onEnter ?? []), newTrigger()]))}>
            + trigger
          </SmallButton>
        }
      >
        <RulesEditor
          world={world}
          value={tile.onEnter ?? []}
          triggers
          onChange={(onEnter) => editTile((t) => void (t.onEnter = onEnter.length ? onEnter : undefined))}
        />
      </Section>
    </>
  );
}
