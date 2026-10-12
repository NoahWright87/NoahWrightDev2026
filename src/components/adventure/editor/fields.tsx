"use client";

import { useEffect, useId, useState } from "react";
import type {
  Condition,
  ConditionType,
  Effect,
  EffectType,
  Rule,
  TileRef,
  Trigger,
  World,
} from "@/lib/adventure/types";
import { coordKey, newId, parseCoordKey } from "@/lib/adventure/world";

// Small, plain form controls for the editor. Everything is controlled: a field
// gets a value and reports a new one; the editor owns the world.

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className="ed-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className="ed-field">
      <label htmlFor={id}>{label}</label>
      <textarea id={id} value={value} rows={rows} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}

/**
 * A comma-separated list. It keeps its own text while typing (so "a, " isn't
 * immediately tidied to "a") and reports the parsed list as it goes.
 */
export function ListField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  hint?: string;
}) {
  const id = useId();
  const joined = value.join(", ");
  const [text, setText] = useState(joined);
  // Take outside changes (undo, load) without fighting the user's typing.
  useEffect(() => {
    setText((current) => (splitList(current).join(", ") === joined ? current : joined));
  }, [joined]);
  return (
    <div className="ed-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={text}
        placeholder={placeholder}
        onChange={(e) => {
          setText(e.target.value);
          onChange(splitList(e.target.value));
        }}
        onBlur={() => setText(joined)}
      />
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}

function splitList(text: string): string[] {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="ed-check">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  hideLabel,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  hideLabel?: boolean;
}) {
  const id = useId();
  return (
    <div className={hideLabel ? "ed-field ed-field--inline" : "ed-field"}>
      <label htmlFor={id} className={hideLabel ? "ed-sr" : undefined}>
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Section({
  title,
  children,
  actions,
  hint,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  hint?: string;
}) {
  return (
    <section className="ed-section">
      <div className="ed-section__head">
        <h3>{title}</h3>
        {actions}
      </div>
      {hint ? <p className="ed-hint">{hint}</p> : null}
      {children}
    </section>
  );
}

export function SmallButton({
  children,
  onClick,
  danger,
  title,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  title?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={danger ? "ed-btn ed-btn--small ed-btn--danger" : "ed-btn ed-btn--small"}
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// ------------------------------------------------------------ tile references

/** Picks a tile: an area, then one of that area's tiles. */
export function TilePicker({
  label,
  world,
  value,
  onChange,
}: {
  label: string;
  world: World;
  value: TileRef;
  onChange: (value: TileRef) => void;
}) {
  const areaIds = Object.keys(world.areas);
  const area = world.areas[value.area];
  const tiles = area ? Object.entries(area.tiles) : [];
  const current = coordKey(value.x, value.y);
  return (
    <fieldset className="ed-tilepicker">
      <legend>{label}</legend>
      <Select
        label="Area"
        value={value.area}
        options={[
          ...(area ? [] : [{ value: value.area, label: `(missing: ${value.area})` }]),
          ...areaIds.map((id) => ({ value: id, label: world.areas[id].name })),
        ]}
        onChange={(areaId) => {
          const first = Object.keys(world.areas[areaId]?.tiles ?? {})[0] ?? "0,0";
          onChange({ area: areaId, ...parseCoordKey(first) });
        }}
      />
      <Select
        label="Tile"
        value={current}
        options={[
          ...(area?.tiles[current] ? [] : [{ value: current, label: `(missing: ${current})` }]),
          ...tiles.map(([coord, tile]) => ({ value: coord, label: `${coord} · ${tile.name}` })),
        ]}
        onChange={(coord) => onChange({ area: value.area, ...parseCoordKey(coord) })}
      />
    </fieldset>
  );
}

// ------------------------------------------------------------ conditions

const CONDITION_LABELS: Record<ConditionType, string> = {
  hasItem: "Player has item",
  itemHere: "Item is in this room",
  characterHere: "Character is in this room",
  flag: "Flag is set",
  visited: "Player has visited",
};

function defaultCondition(type: ConditionType, world: World): Condition {
  const item = Object.keys(world.items)[0] ?? "";
  switch (type) {
    case "hasItem":
      return { type, item };
    case "itemHere":
      return { type, item };
    case "characterHere":
      return { type, character: Object.keys(world.characters)[0] ?? "" };
    case "flag":
      return { type, flag: Object.keys(world.flags)[0] ?? "" };
    case "visited":
      return { type, tile: { ...world.start } };
  }
}

export function ConditionsEditor({
  label = "Only when",
  world,
  value,
  onChange,
}: {
  label?: string;
  world: World;
  value: Condition[];
  onChange: (value: Condition[]) => void;
}) {
  const set = (i: number, c: Condition) => onChange(value.map((old, j) => (j === i ? c : old)));
  return (
    <div className="ed-list">
      <div className="ed-list__head">
        <span>{label}</span>
        <SmallButton onClick={() => onChange([...value, defaultCondition("flag", world)])}>+ condition</SmallButton>
      </div>
      {value.length === 0 ? <p className="ed-hint">Always.</p> : null}
      {value.map((c, i) => (
        <div key={i} className="ed-row">
          <Select
            label="Negate"
            hideLabel
            value={c.not ? "not" : "is"}
            options={[
              { value: "is", label: "if" },
              { value: "not", label: "unless" },
            ]}
            onChange={(v) => set(i, { ...c, not: v === "not" || undefined })}
          />
          <Select
            label="Condition"
            hideLabel
            value={c.type}
            options={Object.entries(CONDITION_LABELS).map(([v, l]) => ({ value: v as ConditionType, label: l }))}
            onChange={(type) => set(i, { ...defaultCondition(type, world), not: c.not })}
          />
          <ConditionTarget world={world} condition={c} onChange={(next) => set(i, next)} />
          <SmallButton danger title="Remove condition" onClick={() => onChange(value.filter((_, j) => j !== i))}>
            ✕
          </SmallButton>
        </div>
      ))}
    </div>
  );
}

function ConditionTarget({
  world,
  condition: c,
  onChange,
}: {
  world: World;
  condition: Condition;
  onChange: (c: Condition) => void;
}) {
  switch (c.type) {
    case "hasItem":
    case "itemHere":
      return <ItemSelect world={world} value={c.item} onChange={(item) => onChange({ ...c, item })} />;
    case "characterHere":
      return (
        <CharacterSelect world={world} value={c.character} onChange={(character) => onChange({ ...c, character })} />
      );
    case "flag":
      return <FlagInput world={world} value={c.flag} onChange={(flag) => onChange({ ...c, flag })} />;
    case "visited":
      return <TilePicker label="Tile" world={world} value={c.tile} onChange={(tile) => onChange({ ...c, tile })} />;
  }
}

export function ItemSelect({ world, value, onChange }: { world: World; value: string; onChange: (id: string) => void }) {
  return (
    <Select
      label="Item"
      hideLabel
      value={value}
      options={[
        ...(world.items[value] ? [] : [{ value, label: value ? `(missing: ${value})` : "(no items yet)" }]),
        ...Object.entries(world.items).map(([id, item]) => ({ value: id, label: item.name })),
      ]}
      onChange={onChange}
    />
  );
}

export function CharacterSelect({
  world,
  value,
  onChange,
}: {
  world: World;
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <Select
      label="Character"
      hideLabel
      value={value}
      options={[
        ...(world.characters[value] ? [] : [{ value, label: value ? `(missing: ${value})` : "(no characters yet)" }]),
        ...Object.entries(world.characters).map(([id, ch]) => ({ value: id, label: ch.name })),
      ]}
      onChange={onChange}
    />
  );
}

/** Flags are free text (new ones are fine) with the declared ones suggested. */
export function FlagInput({ world, value, onChange }: { world: World; value: string; onChange: (flag: string) => void }) {
  const listId = useId();
  return (
    <span className="ed-field ed-field--inline">
      <input
        aria-label="Flag name"
        list={listId}
        value={value}
        placeholder="flag_name"
        onChange={(e) => onChange(e.target.value.replace(/\s+/g, "_"))}
      />
      <datalist id={listId}>
        {Object.keys(world.flags).map((f) => (
          <option key={f} value={f} />
        ))}
      </datalist>
    </span>
  );
}

// ------------------------------------------------------------ effects

const EFFECT_LABELS: Record<EffectType, string> = {
  setFlag: "Set flag",
  clearFlag: "Clear flag",
  giveItem: "Give player item",
  removeItem: "Remove item from game",
  placeItem: "Put item in a room",
  moveCharacter: "Move character",
  teleport: "Teleport player",
  endGame: "End the game",
};

function defaultEffect(type: EffectType, world: World): Effect {
  const item = Object.keys(world.items)[0] ?? "";
  switch (type) {
    case "setFlag":
    case "clearFlag":
      return { type, flag: Object.keys(world.flags)[0] ?? "" };
    case "giveItem":
    case "removeItem":
      return { type, item };
    case "placeItem":
      return { type, item, tile: { ...world.start } };
    case "moveCharacter":
      return { type, character: Object.keys(world.characters)[0] ?? "", tile: { ...world.start } };
    case "teleport":
      return { type, to: { ...world.start } };
    case "endGame":
      return { type, text: "" };
  }
}

export function EffectsEditor({
  world,
  value,
  onChange,
}: {
  world: World;
  value: Effect[];
  onChange: (value: Effect[]) => void;
}) {
  const set = (i: number, e: Effect) => onChange(value.map((old, j) => (j === i ? e : old)));
  return (
    <div className="ed-list">
      <div className="ed-list__head">
        <span>Then</span>
        <SmallButton onClick={() => onChange([...value, defaultEffect("setFlag", world)])}>+ effect</SmallButton>
      </div>
      {value.length === 0 ? <p className="ed-hint">Just say the text.</p> : null}
      {value.map((e, i) => (
        <div key={i} className="ed-row">
          <Select
            label="Effect"
            hideLabel
            value={e.type}
            options={Object.entries(EFFECT_LABELS).map(([v, l]) => ({ value: v as EffectType, label: l }))}
            onChange={(type) => set(i, defaultEffect(type, world))}
          />
          <EffectTarget world={world} effect={e} onChange={(next) => set(i, next)} />
          <SmallButton danger title="Remove effect" onClick={() => onChange(value.filter((_, j) => j !== i))}>
            ✕
          </SmallButton>
        </div>
      ))}
    </div>
  );
}

function EffectTarget({ world, effect: e, onChange }: { world: World; effect: Effect; onChange: (e: Effect) => void }) {
  switch (e.type) {
    case "setFlag":
    case "clearFlag":
      return <FlagInput world={world} value={e.flag} onChange={(flag) => onChange({ ...e, flag })} />;
    case "giveItem":
    case "removeItem":
      return <ItemSelect world={world} value={e.item} onChange={(item) => onChange({ ...e, item })} />;
    case "placeItem":
      return (
        <>
          <ItemSelect world={world} value={e.item} onChange={(item) => onChange({ ...e, item })} />
          <TilePicker label="Into" world={world} value={e.tile} onChange={(tile) => onChange({ ...e, tile })} />
        </>
      );
    case "moveCharacter":
      return (
        <>
          <CharacterSelect world={world} value={e.character} onChange={(character) => onChange({ ...e, character })} />
          <Checkbox
            label="Out of the game"
            checked={e.tile === null}
            onChange={(gone) => onChange({ ...e, tile: gone ? null : { ...world.start } })}
          />
          {e.tile ? (
            <TilePicker label="To" world={world} value={e.tile} onChange={(tile) => onChange({ ...e, tile })} />
          ) : null}
        </>
      );
    case "teleport":
      return <TilePicker label="To" world={world} value={e.to} onChange={(to) => onChange({ ...e, to })} />;
    case "endGame":
      return (
        <span className="ed-field ed-field--inline ed-grow">
          <input
            aria-label="Ending text"
            value={e.text ?? ""}
            placeholder="Ending text"
            onChange={(ev) => onChange({ ...e, text: ev.target.value })}
          />
        </span>
      );
  }
}

// ------------------------------------------------------------ rules

export function newRule(): Rule {
  return { id: newId("rule"), verbs: [], text: "" };
}

export function newTrigger(): Trigger {
  return { id: newId("enter"), text: "" };
}

/**
 * Edits a list of rules (verbs + nouns) or, with `triggers`, of triggers that
 * fire without a command (on entering a room).
 */
export function RulesEditor<T extends Trigger>({
  world,
  value,
  onChange,
  triggers,
  nounHint,
}: {
  world: World;
  value: T[];
  onChange: (value: T[]) => void;
  triggers?: boolean;
  nounHint?: string;
}) {
  const set = (i: number, r: T) => onChange(value.map((old, j) => (j === i ? r : old)));
  const move = (i: number, by: number) => {
    const next = [...value];
    const [r] = next.splice(i, 1);
    next.splice(i + by, 0, r);
    onChange(next);
  };
  return (
    <div className="ed-rules">
      {value.map((rule, i) => (
        <RuleCard
          key={rule.id}
          world={world}
          rule={rule}
          triggers={triggers}
          nounHint={nounHint}
          first={i === 0}
          last={i === value.length - 1}
          onChange={(r) => set(i, r)}
          onMove={(by) => move(i, by)}
          onDelete={() => onChange(value.filter((_, j) => j !== i))}
        />
      ))}
    </div>
  );
}

function RuleCard<T extends Trigger>({
  world,
  rule,
  triggers,
  nounHint,
  first,
  last,
  onChange,
  onMove,
  onDelete,
}: {
  world: World;
  rule: T;
  triggers?: boolean;
  nounHint?: string;
  first: boolean;
  last: boolean;
  onChange: (rule: T) => void;
  onMove: (by: number) => void;
  onDelete: () => void;
}) {
  // New, empty rules start open; the user decides after that.
  const [open, setOpen] = useState(() => !rule.text && !rule.effects?.length);
  const asRule = rule as unknown as Rule;
  return (
    <details className="ed-rule" open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>
        <span className="ed-rule__title">
          {triggers ? summarizeTrigger(rule) : summarizeRule(asRule)}
          {rule.once ? " · once" : ""}
        </span>
        <span className="ed-rule__actions">
          <SmallButton title="Move up" disabled={first} onClick={() => onMove(-1)}>
            ↑
          </SmallButton>
          <SmallButton title="Move down" disabled={last} onClick={() => onMove(1)}>
            ↓
          </SmallButton>
          <SmallButton danger title="Delete" onClick={onDelete}>
            ✕
          </SmallButton>
        </span>
      </summary>
      <div className="ed-rule__body">
        {!triggers ? (
          <div className="ed-grid2">
            <ListField
              label="Verbs"
              value={asRule.verbs}
              placeholder="pull, yank"
              hint="Synonyms of built-in verbs count (get = take)."
              onChange={(verbs) => onChange({ ...rule, verbs })}
            />
            <ListField
              label="Nouns"
              value={asRule.nouns ?? []}
              placeholder="lever"
              hint={nounHint}
              onChange={(nouns) => onChange({ ...rule, nouns: nouns.length ? nouns : undefined })}
            />
          </div>
        ) : null}
        <ConditionsEditor
          world={world}
          value={rule.conditions ?? []}
          onChange={(conditions) => onChange({ ...rule, conditions: conditions.length ? conditions : undefined })}
        />
        <TextArea
          label="Say"
          value={rule.text ?? ""}
          rows={2}
          onChange={(text) => onChange({ ...rule, text: text || undefined })}
        />
        <EffectsEditor
          world={world}
          value={rule.effects ?? []}
          onChange={(effects) => onChange({ ...rule, effects: effects.length ? effects : undefined })}
        />
        <Checkbox
          label="Only once per game"
          checked={!!rule.once}
          onChange={(once) => onChange({ ...rule, once: once || undefined })}
        />
      </div>
    </details>
  );
}

function summarizeTrigger(trigger: Trigger): string {
  const text = trigger.text?.trim();
  return text ? `On arrival: “${text.length > 40 ? `${text.slice(0, 40)}…` : text}”` : "On arrival";
}

function summarizeRule(rule: Rule): string {
  if (!rule.verbs.length) return "New rule (add a verb)";
  const nouns = rule.nouns?.length ? ` ${rule.nouns[0]}` : "";
  return `${rule.verbs.join(" / ")}${nouns}${rule.conditions?.length ? " · if…" : ""}`;
}
