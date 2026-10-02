"use client";

/**
 * One slot on the timeline stage: a strip of tabs over a card. The job slot
 * and the milestone slot are both this component — they differ only in where
 * they sit and what card they render — so they look and move the same way.
 *
 * - The tab strip stays put while the card changes beneath it.
 * - Cards crossfade in place. No sliding: the card a reader is looking at
 *   should not move, only change.
 * - Tabs fade and slide in and out as they come and go, and the tabs beside
 *   them close or open the gap smoothly rather than jumping.
 * - The whole slot can fade out, keeping its last content while it does, so it
 *   never goes blank before it goes away.
 */

import * as React from "react";
import "./tabbed-slot.css";

export interface SlotTab {
  id: string;
  label: string;
  /** Accent for the tab's border and fill. */
  color: string;
}

/** How long a leaving tab or card takes to clear, in ms. Matches the CSS. */
const LEAVE_MS = 260;

/* ------------------------------------------------------------------ */
/* Tabs                                                                */
/* ------------------------------------------------------------------ */

interface RenderedTab extends SlotTab {
  leaving: boolean;
}

/**
 * Merge the tabs we should show with the ones still on their way out. A
 * leaving tab keeps its place — after whichever tab it used to follow — so the
 * strip closes up around it instead of reshuffling.
 */
function mergeTabs(previous: RenderedTab[], next: SlotTab[]): RenderedTab[] {
  const nextIds = new Set(next.map((t) => t.id));
  const merged: RenderedTab[] = next.map((t) => ({ ...t, leaving: false }));
  previous.forEach((tab, index) => {
    if (nextIds.has(tab.id)) return;
    let anchor = -1;
    for (let i = index - 1; i >= 0; i--) {
      anchor = merged.findIndex((m) => m.id === previous[i].id);
      if (anchor !== -1) break;
    }
    merged.splice(anchor + 1, 0, { ...tab, leaving: true });
  });
  return merged;
}

function TabStrip({
  tabs,
  selectedId,
  onPick,
  label,
  focusable,
}: {
  tabs: SlotTab[];
  selectedId: string;
  onPick: (id: string) => void;
  label: string;
  focusable: boolean;
}) {
  const [rendered, setRendered] = React.useState<RenderedTab[]>(() =>
    tabs.map((t) => ({ ...t, leaving: false }))
  );
  const tabKey = tabs.map((t) => `${t.id}:${t.label}`).join("|");

  React.useEffect(() => {
    setRendered((previous) => mergeTabs(previous, tabs));
    const timer = window.setTimeout(
      () => setRendered((current) => current.filter((t) => !t.leaving)),
      LEAVE_MS
    );
    return () => window.clearTimeout(timer);
    // `tabKey` stands in for `tabs`, which is a new array every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabKey]);

  /* Keep the selected tab in view when the strip is wider than the slot.
     Scrolls the strip only, never the page. */
  const stripRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const strip = stripRef.current;
    const tab = strip?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!strip || !tab) return;
    const left = tab.offsetLeft - strip.offsetLeft;
    if (left < strip.scrollLeft || left + tab.offsetWidth > strip.scrollLeft + strip.clientWidth) {
      strip.scrollTo({ left: Math.max(0, left - 24), behavior: "smooth" });
    }
  }, [selectedId, tabKey]);

  return (
    <div ref={stripRef} className="ts__tabs" role="tablist" aria-label={label}>
      {rendered.map((tab) => {
        const on = !tab.leaving && tab.id === selectedId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={on}
            tabIndex={focusable && !tab.leaving ? 0 : -1}
            aria-hidden={tab.leaving || undefined}
            className={["ts__tab", on && "ts__tab--on", tab.leaving && "ts__tab--leaving"]
              .filter(Boolean)
              .join(" ")}
            style={{ ["--tab-color" as string]: tab.color }}
            onClick={tab.leaving ? undefined : () => onPick(tab.id)}
          >
            <span className="ts__tab-label">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card crossfade                                                      */
/* ------------------------------------------------------------------ */

interface Layer {
  key: string;
  node: React.ReactNode;
}

/**
 * Crossfades between cards when `itemKey` changes. The outgoing card fades out
 * before the incoming one is mostly in — two blocks of text at half opacity
 * on top of each other are unreadable — and neither moves.
 */
function CardFader({ itemKey, children }: { itemKey: string; children: React.ReactNode }) {
  const [leaving, setLeaving] = React.useState<Layer[]>([]);
  const previous = React.useRef<Layer>({ key: itemKey, node: children });

  React.useEffect(() => {
    if (previous.current.key === itemKey) return;
    const outgoing = previous.current;
    setLeaving((layers) => [...layers.filter((l) => l.key !== itemKey), outgoing]);
    const timer = window.setTimeout(
      () => setLeaving((layers) => layers.filter((l) => l.key !== outgoing.key)),
      LEAVE_MS
    );
    return () => window.clearTimeout(timer);
  }, [itemKey]);

  /* Remember the latest render of the current card, so it fades out as it
     last looked. */
  React.useEffect(() => {
    previous.current = { key: itemKey, node: children };
  });

  return (
    <div className="ts__cards">
      {leaving.map((layer) => (
        <div key={layer.key} className="ts__card ts__card--leaving" aria-hidden="true">
          {layer.node}
        </div>
      ))}
      <div key={itemKey} className="ts__card ts__card--in" role="tabpanel">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The slot                                                            */
/* ------------------------------------------------------------------ */

export function TabbedSlot({
  tabs,
  selectedId,
  onPick,
  label,
  visible = true,
  className,
  children,
}: {
  tabs: SlotTab[];
  selectedId: string;
  onPick: (id: string) => void;
  /** Accessible name for the tab strip. */
  label: string;
  /** False fades the whole slot out, keeping what it last showed. */
  visible?: boolean;
  className?: string;
  /** The selected item's card. */
  children: React.ReactNode;
}) {
  return (
    <div
      className={["ts", visible ? "ts--on" : "ts--off", className].filter(Boolean).join(" ")}
      aria-hidden={visible ? undefined : true}
    >
      <TabStrip
        tabs={tabs}
        selectedId={selectedId}
        onPick={onPick}
        label={label}
        focusable={visible}
      />
      <CardFader itemKey={selectedId}>{children}</CardFader>
    </div>
  );
}

export default TabbedSlot;
