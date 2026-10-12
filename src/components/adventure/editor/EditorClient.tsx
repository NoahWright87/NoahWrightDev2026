"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import NextLink from "next/link";
import { Heading, Text } from "@noahwright/design";
import SiteShell from "@/components/SiteShell";
import { checkWorld } from "@/lib/adventure/checks";
import {
  BUILT_IN_WORLDS,
  DEFAULT_EDITOR_WORLD,
  downloadWorld,
  fetchBuiltInWorld,
  loadDraft,
  loadSavedWorld,
  saveDraft,
  saveWorld,
} from "@/lib/adventure/storage";
import type { TileRef, World } from "@/lib/adventure/types";
import { parseWorldJson } from "@/lib/adventure/validate";
import { coordKey, edgeKey, parseCoordKey } from "@/lib/adventure/world";
import { slugId } from "@/lib/adventure/usages";
import MapGrid from "./MapGrid";
import { CharactersPanel, ChecksPanel, FlagsPanel, ItemsPanel, WorldPanel } from "./Panels";
import Playtest from "./Playtest";
import TileInspector from "./TileInspector";
import "../adventure.css";
import "./editor.css";

type Tab = "map" | "items" | "characters" | "flags" | "checks" | "world";

const HISTORY_LIMIT = 100;
/** Keystrokes in the same field closer together than this are one undo step. */
const COALESCE_MS = 800;

function typingTarget(): Element | null {
  const el = typeof document === "undefined" ? null : document.activeElement;
  return el && (el.tagName === "TEXTAREA" || (el.tagName === "INPUT" && (el as HTMLInputElement).type !== "checkbox"))
    ? el
    : null;
}

export default function EditorClient() {
  const [world, setWorld] = useState<World | null>(null);
  const [source, setSource] = useState("");
  /** JSON of the world as last loaded, saved or exported: anything else is "unsaved". */
  const [baseline, setBaseline] = useState("");
  const [hasLocalSave, setHasLocalSave] = useState(false);
  const [status, setStatus] = useState<{ text: string; error?: boolean } | null>(null);
  const [tab, setTab] = useState<Tab>("map");
  const [areaId, setAreaId] = useState("");
  const [selected, setSelected] = useState<{ x: number; y: number } | null>(null);
  const [playtest, setPlaytest] = useState<World | null>(null);
  const [past, setPast] = useState<World[]>([]);
  const [future, setFuture] = useState<World[]>([]);
  const lastEdit = useRef<{ at: number; target: Element | null }>({ at: 0, target: null });
  const fileInput = useRef<HTMLInputElement>(null);
  // Edits read the latest world from here, so fast typing never edits a stale copy.
  const worldRef = useRef<World | null>(null);
  const replaceWorld = useCallback((next: World) => {
    worldRef.current = next;
    setWorld(next);
  }, []);

  const open = useCallback((next: World, from: string, message?: string) => {
    replaceWorld(next);
    setSource(from);
    setBaseline(JSON.stringify(next));
    setAreaId(next.start.area);
    setSelected({ x: next.start.x, y: next.start.y });
    setPast([]);
    setFuture([]);
    setPlaytest(null);
    if (message) setStatus({ text: message });
  }, [replaceWorld]);

  // First load: the autosaved draft if there is one, otherwise the example.
  useEffect(() => {
    setHasLocalSave(!!loadSavedWorld());
    const draft = loadDraft();
    if (draft) {
      open(draft.world, draft.source, draft.dirty ? "Restored your unsaved work from last time." : undefined);
      if (draft.dirty) setBaseline("");
      return;
    }
    fetchBuiltInWorld(DEFAULT_EDITOR_WORLD)
      .then((w) => open(w, DEFAULT_EDITOR_WORLD))
      .catch((e: Error) => setStatus({ text: e.message, error: true }));
  }, [open]);

  const json = useMemo(() => (world ? JSON.stringify(world) : ""), [world]);
  const dirty = !!world && json !== baseline;

  // Autosave a draft so a refresh doesn't lose work.
  useEffect(() => {
    if (!world) return;
    const timer = window.setTimeout(() => saveDraft({ world, source, dirty }), 400);
    return () => window.clearTimeout(timer);
  }, [world, source, dirty]);

  const edit = useCallback(
    (fn: (w: World) => void) => {
      const current = worldRef.current;
      if (!current) return;
      const next = structuredClone(current);
      fn(next);
      const now = Date.now();
      const target = typingTarget();
      const typing = !!target && target === lastEdit.current.target && now - lastEdit.current.at < COALESCE_MS;
      if (!typing) setPast((p) => [...p, current].slice(-HISTORY_LIMIT));
      lastEdit.current = { at: now, target };
      setFuture([]);
      replaceWorld(next);
    },
    [replaceWorld],
  );

  const undo = () => {
    if (!world || !past.length) return;
    setFuture((f) => [world, ...f]);
    replaceWorld(past[past.length - 1]);
    setPast((p) => p.slice(0, -1));
    lastEdit.current = { at: 0, target: null };
  };
  const redo = () => {
    if (!world || !future.length) return;
    setPast((p) => [...p, world]);
    replaceWorld(future[0]);
    setFuture((f) => f.slice(1));
    lastEdit.current = { at: 0, target: null };
  };

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== "z") return;
      // Let text fields keep their own undo.
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select")) return;
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const confirmDiscard = () => !dirty || window.confirm("You have changes that aren't saved or exported. Load anyway?");

  async function loadBuiltIn(id: string) {
    if (!confirmDiscard()) return;
    try {
      const w = await fetchBuiltInWorld(id);
      open(w, id, `Loaded “${BUILT_IN_WORLDS.find((b) => b.id === id)?.label ?? id}”.`);
    } catch (e) {
      setStatus({ text: (e as Error).message, error: true });
    }
  }

  function loadLocal() {
    if (!confirmDiscard()) return;
    const saved = loadSavedWorld();
    if (saved) open(saved, "local", "Loaded the world saved in this browser.");
    else setStatus({ text: "Nothing is saved in this browser yet.", error: true });
  }

  async function onUpload(file: File) {
    if (!confirmDiscard()) return;
    const result = parseWorldJson(await file.text());
    if (!result.ok) {
      setStatus({ text: `Couldn't load ${file.name}:\n${result.errors.join("\n")}`, error: true });
      return;
    }
    open(result.world, "upload", `Loaded ${file.name}.`);
  }

  function saveLocal() {
    if (!world) return;
    if (saveWorld(world)) {
      setHasLocalSave(true);
      setBaseline(json);
      // Now, not after the debounce: "Play saved" is often the very next click.
      saveDraft({ world, source, dirty: false });
      setStatus({ text: "Saved in this browser. Play it on the real page with “Play saved”." });
    } else {
      setStatus({ text: "This browser won't let the page save (private mode or blocked storage).", error: true });
    }
  }

  function exportFile() {
    if (!world) return;
    downloadWorld(world);
    setBaseline(json);
    saveDraft({ world, source, dirty: false });
    setStatus({ text: "Exported. To publish, commit it as public/adventure/worlds/site.json." });
  }

  const goTo = useCallback((ref: TileRef) => {
    setTab("map");
    setAreaId(ref.area);
    setSelected({ x: ref.x, y: ref.y });
  }, []);

  const issues = useMemo(() => (world ? checkWorld(world) : []), [world]);
  const errorCount = issues.filter((i) => i.level === "error").length;

  if (!world) {
    return (
      <SiteShell>
        <div className="ed-page">
          <Heading level={1}>Adventure editor</Heading>
          {status ? <p className={status.error ? "ed-status ed-status--error" : "ed-status"}>{status.text}</p> : <Text tone="muted">Loading…</Text>}
        </div>
      </SiteShell>
    );
  }

  const area = world.areas[areaId] ?? world.areas[world.start.area];
  const currentAreaId = world.areas[areaId] ? areaId : world.start.area;
  const selectedRef = selected && area?.tiles[coordKey(selected.x, selected.y)] ? { area: currentAreaId, ...selected } : null;

  const tabs: { id: Tab; label: string }[] = [
    { id: "map", label: "Map" },
    { id: "items", label: `Items (${Object.keys(world.items).length})` },
    { id: "characters", label: `Characters (${Object.keys(world.characters).length})` },
    { id: "flags", label: "Flags" },
    { id: "checks", label: issues.length ? `Checks (${issues.length}${errorCount ? ` · ${errorCount} errors` : ""})` : "Checks ✓" },
    { id: "world", label: "World" },
  ];

  return (
    <SiteShell>
      <div className="ed-page">
        <header className="ed-header">
          <div>
            <Heading level={1}>Adventure editor</Heading>
            <Text tone="muted">
              This is the tool that builds <NextLink href="/adventure">the site&rsquo;s text adventure</NextLink>. Make your own:
              it all stays in your browser until you export it.{" "}
              <a href="https://github.com/NoahWright87/NoahWrightDev2026/tree/main/src/lib/adventure" target="_blank" rel="noreferrer">
                Source on GitHub
              </a>
              .
            </Text>
          </div>
        </header>

        <div className="ed-toolbar" role="toolbar" aria-label="Editor">
          <select
            aria-label="Load a world"
            value=""
            onChange={(e) => {
              const v = e.target.value;
              e.target.value = "";
              if (v === "upload") fileInput.current?.click();
              else if (v === "local") loadLocal();
              else if (v) void loadBuiltIn(v);
            }}
          >
            <option value="">Load…</option>
            {BUILT_IN_WORLDS.map((b) => (
              <option key={b.id} value={b.id} title={b.note}>
                {b.label}
              </option>
            ))}
            {hasLocalSave ? <option value="local">Saved in this browser</option> : null}
            <option value="upload">Upload a file…</option>
          </select>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void onUpload(file);
            }}
          />
          <button type="button" className="ed-btn" onClick={undo} disabled={!past.length} title="Undo (Ctrl+Z)">
            ↶ Undo
          </button>
          <button type="button" className="ed-btn" onClick={redo} disabled={!future.length} title="Redo (Ctrl+Shift+Z)">
            ↷ Redo
          </button>
          <span className="ed-toolbar__spacer" />
          <button type="button" className="ed-btn ed-btn--primary" onClick={() => setPlaytest(playtest ? null : world)}>
            {playtest ? "Close playtest" : "▶ Playtest"}
          </button>
          <button type="button" className="ed-btn" onClick={saveLocal} title="Keep it in this browser's storage">
            Save to local
          </button>
          {hasLocalSave ? (
            <a className="ed-btn" href="/adventure?world=local" title="Play the saved world on the real game page">
              Play saved ↗
            </a>
          ) : null}
          <button type="button" className="ed-btn" onClick={exportFile} title="Download the world as JSON">
            Export
          </button>
        </div>
        <p className="ed-meta">
          <strong>{world.title || "Untitled"}</strong>
          {" · "}
          {source === "upload" ? "uploaded file" : source === "local" ? "saved in this browser" : BUILT_IN_WORLDS.find((b) => b.id === source)?.label ?? "draft"}
          {" · "}
          <span className={dirty ? "ed-dirty" : undefined}>{dirty ? "unsaved changes (autosaved as a draft)" : "no unsaved changes"}</span>
        </p>
        {status ? (
          <p className={status.error ? "ed-status ed-status--error" : "ed-status"} role={status.error ? "alert" : "status"}>
            {status.text}
            <button type="button" className="ed-status__close" aria-label="Dismiss" onClick={() => setStatus(null)}>
              ✕
            </button>
          </p>
        ) : null}

        {playtest ? (
          <Playtest
            world={playtest}
            onRestartWithEdits={() => setPlaytest(world)}
            onClose={() => setPlaytest(null)}
            onGoTo={goTo}
          />
        ) : null}

        <div className="ed-tabs ed-tabs--main" role="tablist" aria-label="Editor sections">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`ed-tab${tab === t.id ? " ed-tab--active" : ""}${t.id === "checks" && errorCount ? " ed-tab--error" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div role="tabpanel" className="ed-panel">
          {tab === "map" ? (
            <div className="ed-maptab">
              <div className="ed-maptab__map">
                <AreaBar
                  world={world}
                  areaId={currentAreaId}
                  onPick={(id) => {
                    setAreaId(id);
                    const first = Object.keys(world.areas[id]?.tiles ?? {})[0];
                    setSelected(first ? parseCoordKey(first) : null);
                  }}
                  edit={edit}
                />
                <MapGrid
                  world={world}
                  areaId={currentAreaId}
                  selected={selected}
                  onSelect={(x, y) => setSelected({ x, y })}
                  onCreate={(x, y) => {
                    edit((w) => void (w.areas[currentAreaId].tiles[coordKey(x, y)] = { name: "New room", description: "" }));
                    setSelected({ x, y });
                  }}
                  onCycleEdge={(x, y, dir) =>
                    edit((w) => {
                      const edges = w.areas[currentAreaId].edges;
                      const key = edgeKey(x, y, dir);
                      const kind = edges[key]?.kind;
                      if (!kind) edges[key] = { kind: "wall" };
                      else if (kind === "wall") edges[key] = { kind: "locked", opensWhen: [], lockedText: "It's locked." };
                      else delete edges[key];
                    })
                  }
                />
                <p className="ed-hint">
                  Click <strong>+</strong> to add a room, a room to edit it, and the gap between two rooms to cycle open → wall → locked.
                  ★ start · ▣ items · ☺ characters · ⇅ teleporters · ⚙ rules · ✎ needs a description.
                </p>
              </div>
              <div className="ed-maptab__inspector">
                {selectedRef ? (
                  <TileInspector
                    key={`${selectedRef.area}:${selectedRef.x},${selectedRef.y}`}
                    world={world}
                    at={selectedRef}
                    edit={edit}
                    onGoTo={goTo}
                    onPlaytestFrom={(ref) => setPlaytest({ ...world, start: ref })}
                  />
                ) : (
                  <p className="ed-hint">Pick a room on the map.</p>
                )}
              </div>
            </div>
          ) : null}
          {tab === "items" ? <ItemsPanel world={world} edit={edit} onGoTo={goTo} /> : null}
          {tab === "characters" ? <CharactersPanel world={world} edit={edit} onGoTo={goTo} /> : null}
          {tab === "flags" ? <FlagsPanel world={world} edit={edit} onGoTo={goTo} /> : null}
          {tab === "checks" ? <ChecksPanel issues={issues} onGoTo={goTo} /> : null}
          {tab === "world" ? <WorldPanel world={world} edit={edit} /> : null}
        </div>
      </div>
    </SiteShell>
  );
}

function AreaBar({
  world,
  areaId,
  onPick,
  edit,
}: {
  world: World;
  areaId: string;
  onPick: (id: string) => void;
  edit: (fn: (w: World) => void) => void;
}) {
  const area = world.areas[areaId];
  const holdsStart = world.start.area === areaId;
  return (
    <div className="ed-areabar">
      <select aria-label="Area" value={areaId} onChange={(e) => onPick(e.target.value)}>
        {Object.entries(world.areas).map(([id, a]) => (
          <option key={id} value={id}>
            {a.name}
          </option>
        ))}
      </select>
      <input
        aria-label="Area name"
        value={area?.name ?? ""}
        onChange={(e) => edit((w) => void (w.areas[areaId].name = e.target.value))}
      />
      <button
        type="button"
        className="ed-btn ed-btn--small"
        title="Add an area: a separate grid, reached by teleporter"
        onClick={() => {
          const id = slugId("area", world.areas);
          edit((w) => void (w.areas[id] = { name: `Area ${Object.keys(w.areas).length + 1}`, tiles: { "0,0": { name: "New room", description: "" } }, edges: {} }));
          onPick(id);
        }}
      >
        + Area
      </button>
      <button
        type="button"
        className="ed-btn ed-btn--small ed-btn--danger"
        disabled={holdsStart || Object.keys(world.areas).length < 2}
        title={holdsStart ? "This area holds the start room" : "Delete this area"}
        onClick={() => {
          if (!window.confirm(`Delete the area “${area?.name}” and all its rooms?`)) return;
          edit((w) => void delete w.areas[areaId]);
          onPick(world.start.area);
        }}
      >
        Delete area
      </button>
    </div>
  );
}
