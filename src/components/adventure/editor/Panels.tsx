"use client";

import { useState } from "react";
import type { Issue } from "@/lib/adventure/checks";
import type { Character, Item, MessageKey, TileRef, Topic, World } from "@/lib/adventure/types";
import { allFlags, findUsages, slugId, type Usage } from "@/lib/adventure/usages";
import { DEFAULT_MESSAGES } from "@/lib/adventure/world";
import {
  Checkbox,
  ConditionsEditor,
  EffectsEditor,
  ListField,
  newRule,
  RulesEditor,
  Section,
  SmallButton,
  TextArea,
  TextField,
  TilePicker,
} from "./fields";

type Edit = (fn: (w: World) => void) => void;

// ------------------------------------------------------------ shared list + detail layout

function Library<T extends { name: string }>({
  noun,
  entries,
  selected,
  onSelect,
  onCreate,
  children,
}: {
  noun: string;
  entries: [string, T][];
  selected: string | null;
  onSelect: (id: string) => void;
  onCreate: (name: string) => void;
  children: React.ReactNode;
}) {
  const [name, setName] = useState("");
  return (
    <div className="ed-library">
      <div className="ed-library__list">
        <form
          className="ed-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            onCreate(name.trim());
            setName("");
          }}
        >
          <input aria-label={`New ${noun} name`} placeholder={`New ${noun}`} value={name} onChange={(e) => setName(e.target.value)} />
          <button type="submit" className="ed-btn ed-btn--small">
            Add
          </button>
        </form>
        {entries.length ? (
          <ul>
            {entries.map(([id, entry]) => (
              <li key={id}>
                <button
                  type="button"
                  className={selected === id ? "ed-libitem ed-libitem--active" : "ed-libitem"}
                  aria-pressed={selected === id}
                  onClick={() => onSelect(id)}
                >
                  {entry.name || id}
                  <small>{id}</small>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="ed-hint">No {noun}s yet.</p>
        )}
      </div>
      <div className="ed-library__detail">{children}</div>
    </div>
  );
}

function UsageList({ usages, onGoTo }: { usages: Usage[]; onGoTo: (ref: TileRef) => void }) {
  if (!usages.length) return <p className="ed-hint">Not used anywhere yet.</p>;
  return (
    <ul className="ed-usages">
      {usages.map((u, i) => (
        <li key={i}>
          {u.at ? (
            <button type="button" className="ed-linkish" onClick={() => onGoTo(u.at!)}>
              {u.text}
            </button>
          ) : (
            u.text
          )}
        </li>
      ))}
    </ul>
  );
}

/** Removes an item or character from every tile it's placed in. */
function unplaceEverywhere(w: World, kind: "items" | "characters", id: string) {
  for (const area of Object.values(w.areas)) {
    for (const t of Object.values(area.tiles)) {
      if (t[kind]?.includes(id)) t[kind] = t[kind]!.filter((x) => x !== id);
    }
  }
}

// ------------------------------------------------------------ items

export function ItemsPanel({ world, edit, onGoTo }: { world: World; edit: Edit; onGoTo: (ref: TileRef) => void }) {
  const [selected, setSelected] = useState<string | null>(Object.keys(world.items)[0] ?? null);
  const item = selected ? world.items[selected] : undefined;
  const set = (fn: (i: Item) => void) => edit((w) => selected && w.items[selected] && fn(w.items[selected]));

  return (
    <Library
      noun="item"
      entries={Object.entries(world.items)}
      selected={selected}
      onSelect={setSelected}
      onCreate={(name) => {
        const id = slugId(name, world.items);
        edit((w) => void (w.items[id] = { name, description: "" }));
        setSelected(id);
      }}
    >
      {item && selected ? (
        <>
          <div className="ed-grid2">
            <TextField label="Name" value={item.name} onChange={(name) => set((i) => void (i.name = name))} />
            <ListField
              label="Other names"
              value={item.aliases ?? []}
              placeholder="key, brass thing"
              hint="Players can also use the last word of the name."
              onChange={(aliases) => set((i) => void (i.aliases = aliases.length ? aliases : undefined))}
            />
          </div>
          <TextArea label="Description" value={item.description} onChange={(d) => set((i) => void (i.description = d))} />
          <Checkbox
            label="Can be picked up"
            checked={item.portable !== false}
            onChange={(portable) => set((i) => void (i.portable = portable ? undefined : false))}
          />
          <Section
            title="Rules"
            hint="Commands that mention this item (carried or in the room). Nouns name the other thing: “use key on door” → nouns: door."
            actions={<SmallButton onClick={() => set((i) => void (i.rules = [...(i.rules ?? []), newRule()]))}>+ rule</SmallButton>}
          >
            <RulesEditor
              world={world}
              value={item.rules ?? []}
              nounHint="The other thing, if any."
              onChange={(rules) => set((i) => void (i.rules = rules.length ? rules : undefined))}
            />
          </Section>
          <Section title="Used in">
            <UsageList usages={findUsages(world, { kind: "item", id: selected })} onGoTo={onGoTo} />
          </Section>
          <SmallButton
            danger
            onClick={() => {
              if (!window.confirm(`Delete "${item.name}"? Rules that mention it will show up in Checks.`)) return;
              edit((w) => {
                delete w.items[selected];
                unplaceEverywhere(w, "items", selected);
              });
              setSelected(null);
            }}
          >
            Delete item
          </SmallButton>
        </>
      ) : (
        <p className="ed-hint">Pick an item, or add one.</p>
      )}
    </Library>
  );
}

// ------------------------------------------------------------ characters

export function CharactersPanel({ world, edit, onGoTo }: { world: World; edit: Edit; onGoTo: (ref: TileRef) => void }) {
  const [selected, setSelected] = useState<string | null>(Object.keys(world.characters)[0] ?? null);
  const character = selected ? world.characters[selected] : undefined;
  const set = (fn: (c: Character) => void) =>
    edit((w) => selected && w.characters[selected] && fn(w.characters[selected]));
  const topics = character?.topics ?? [];
  const setTopic = (i: number, t: Topic) => set((c) => void (c.topics![i] = t));

  return (
    <Library
      noun="character"
      entries={Object.entries(world.characters)}
      selected={selected}
      onSelect={setSelected}
      onCreate={(name) => {
        const id = slugId(name, world.characters);
        edit((w) => void (w.characters[id] = { name, description: "" }));
        setSelected(id);
      }}
    >
      {character && selected ? (
        <>
          <div className="ed-grid2">
            <TextField label="Name" value={character.name} onChange={(name) => set((c) => void (c.name = name))} />
            <ListField
              label="Other names"
              value={character.aliases ?? []}
              onChange={(aliases) => set((c) => void (c.aliases = aliases.length ? aliases : undefined))}
            />
          </div>
          <TextArea label="Description" value={character.description} onChange={(d) => set((c) => void (c.description = d))} />
          <TextArea
            label="Greeting"
            value={character.greeting ?? ""}
            rows={2}
            hint="Said on “talk to …”."
            onChange={(g) => set((c) => void (c.greeting = g || undefined))}
          />
          <Section
            title="Topics"
            hint="“ask <character> about <keyword>”. The first topic with a matching keyword whose conditions hold answers."
            actions={
              <SmallButton onClick={() => set((c) => void (c.topics = [...topics, { keywords: [], text: "" }]))}>
                + topic
              </SmallButton>
            }
          >
            {topics.map((t, i) => (
              <div key={i} className="ed-card">
                <ListField label="Keywords" value={t.keywords} placeholder="key, shed" onChange={(keywords) => setTopic(i, { ...t, keywords })} />
                <ConditionsEditor
                  world={world}
                  value={t.conditions ?? []}
                  onChange={(conditions) => setTopic(i, { ...t, conditions: conditions.length ? conditions : undefined })}
                />
                <TextArea label="Answer" value={t.text} rows={2} onChange={(text) => setTopic(i, { ...t, text })} />
                <EffectsEditor
                  world={world}
                  value={t.effects ?? []}
                  onChange={(effects) => setTopic(i, { ...t, effects: effects.length ? effects : undefined })}
                />
                <SmallButton danger onClick={() => set((c) => void c.topics!.splice(i, 1))}>
                  Remove topic
                </SmallButton>
              </div>
            ))}
          </Section>
          <Section
            title="Rules"
            hint="Other commands aimed at this character (“pet cat”, “give bone to dog” → verbs: give, nouns: bone)."
            actions={<SmallButton onClick={() => set((c) => void (c.rules = [...(c.rules ?? []), newRule()]))}>+ rule</SmallButton>}
          >
            <RulesEditor
              world={world}
              value={character.rules ?? []}
              nounHint="The other thing, if any."
              onChange={(rules) => set((c) => void (c.rules = rules.length ? rules : undefined))}
            />
          </Section>
          <Section title="Used in">
            <UsageList usages={findUsages(world, { kind: "character", id: selected })} onGoTo={onGoTo} />
          </Section>
          <SmallButton
            danger
            onClick={() => {
              if (!window.confirm(`Delete "${character.name}"?`)) return;
              edit((w) => {
                delete w.characters[selected];
                unplaceEverywhere(w, "characters", selected);
              });
              setSelected(null);
            }}
          >
            Delete character
          </SmallButton>
        </>
      ) : (
        <p className="ed-hint">Pick a character, or add one.</p>
      )}
    </Library>
  );
}

// ------------------------------------------------------------ flags

export function FlagsPanel({ world, edit, onGoTo }: { world: World; edit: Edit; onGoTo: (ref: TileRef) => void }) {
  const [name, setName] = useState("");
  const flags = allFlags(world);
  return (
    <div>
      <p className="ed-hint">
        Flags are named on/off switches (“door_open”). Rules set and check them. Every flag starts off. Declaring one here is
        optional; it adds a note and puts it in the suggestions.
      </p>
      <form
        className="ed-row"
        onSubmit={(e) => {
          e.preventDefault();
          const flag = name.trim().replace(/\s+/g, "_");
          if (!flag) return;
          edit((w) => void (w.flags[flag] = w.flags[flag] ?? {}));
          setName("");
        }}
      >
        <input aria-label="New flag name" placeholder="new_flag" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit" className="ed-btn ed-btn--small">
          Declare
        </button>
      </form>
      {flags.map((flag) => {
        const declared = flag in world.flags;
        return (
          <div key={flag} className="ed-card">
            <div className="ed-row">
              <code className="ed-grow">{flag}</code>
              {declared ? (
                <SmallButton danger title={`Undeclare ${flag}`} onClick={() => edit((w) => void delete w.flags[flag])}>
                  ✕
                </SmallButton>
              ) : (
                <SmallButton onClick={() => edit((w) => void (w.flags[flag] = {}))}>Declare</SmallButton>
              )}
            </div>
            {declared ? (
              <TextField
                label="Note"
                value={world.flags[flag].note ?? ""}
                onChange={(note) => edit((w) => void (w.flags[flag] = { note: note || undefined }))}
              />
            ) : null}
            <UsageList usages={findUsages(world, { kind: "flag", id: flag })} onGoTo={onGoTo} />
          </div>
        );
      })}
    </div>
  );
}

// ------------------------------------------------------------ checks

export function ChecksPanel({ issues, onGoTo }: { issues: Issue[]; onGoTo: (ref: TileRef) => void }) {
  if (!issues.length) return <p className="ed-hint">No problems found. Ship it.</p>;
  return (
    <ul className="ed-issues">
      {issues.map((issue, i) => (
        <li key={i} className={`ed-issue ed-issue--${issue.level}`}>
          <span className="ed-issue__level">{issue.level === "error" ? "Error" : "Warning"}</span>
          {issue.at ? (
            <button type="button" className="ed-linkish" onClick={() => onGoTo(issue.at!)}>
              {issue.text}
            </button>
          ) : (
            <span>{issue.text}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

// ------------------------------------------------------------ world settings

export function WorldPanel({ world, edit }: { world: World; edit: Edit }) {
  return (
    <>
      <div className="ed-grid2">
        <TextField label="Title" value={world.title} onChange={(title) => edit((w) => void (w.title = title))} />
        <TextField
          label="Author"
          value={world.author ?? ""}
          onChange={(author) => edit((w) => void (w.author = author || undefined))}
        />
      </div>
      <TextArea
        label="Intro"
        value={world.intro ?? ""}
        rows={3}
        hint="Printed once, before the first room."
        onChange={(intro) => edit((w) => void (w.intro = intro || undefined))}
      />
      <TilePicker label="Start room" world={world} value={world.start} onChange={(start) => edit((w) => void (w.start = start))} />
      <Section
        title="Stock replies"
        hint="What the game says when no rule applies. Leave blank for the default. {noun}, {verb} and {list} are filled in."
      >
        {(Object.keys(DEFAULT_MESSAGES) as MessageKey[]).map((key) => (
          <TextField
            key={key}
            label={key}
            value={world.messages?.[key] ?? ""}
            placeholder={DEFAULT_MESSAGES[key]}
            onChange={(text) =>
              edit((w) => {
                const messages = { ...(w.messages ?? {}) };
                if (text) messages[key] = text;
                else delete messages[key];
                w.messages = Object.keys(messages).length ? messages : undefined;
              })
            }
          />
        ))}
      </Section>
    </>
  );
}
