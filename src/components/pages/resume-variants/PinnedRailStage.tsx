"use client";

/**
 * TEMPORARY prototype — `/resume6` (single) and `/resume7` (split).
 *
 * A branch-style tree is pinned to the left for the whole section while one job
 * at a time fades in and out beside it, driven by scroll position. A chevron
 * glides down the tree and the lanes fill in behind it to show how far along
 * you are.
 *
 * The two modes differ in exactly one respect, so they can be compared cleanly:
 * `single` shows one job per stop even through the years two ran at once;
 * `split` merges those years into shared stops showing both jobs side by side.
 */

import * as React from "react";
import { Container, usePrefersReducedMotion } from "@noahwright/design";
import { VariantShell } from "./VariantChrome";
import { PacingControl } from "./PacingControl";
import { JobCard } from "./JobCard";
import {
  ENTRIES_CHRONOLOGICAL,
  FORK_YEAR,
  MERGE_YEAR,
  entryEnd,
  laneColorVar,
  type ResumeEntry,
} from "@/lib/resumeDemo";
import {
  PACING_VH,
  buildRailPaths,
  laneIndex,
  laneX,
  makeYearToY,
  readStoredPacing,
  sectionProgress,
  stopFade,
  writeStoredPacing,
  type Pacing,
} from "./scrollRail";
import "./pinned-rail.css";

export type StageMode = "single" | "split";

interface Stop {
  id: string;
  /** Ordered service-lane first, so the left card is always the service one. */
  entries: ResumeEntry[];
}

function overlaps(a: ResumeEntry, b: ResumeEntry): boolean {
  return a.start < entryEnd(b) && b.start < entryEnd(a);
}

/** The other lane's job running at the moment this one begins, if any. */
function partnerFor(entry: ResumeEntry): ResumeEntry | undefined {
  return ENTRIES_CHRONOLOGICAL.find(
    (other) =>
      other.lane !== entry.lane &&
      overlaps(other, entry) &&
      entry.start >= other.start &&
      entry.start < entryEnd(other)
  );
}

function buildStops(mode: StageMode): Stop[] {
  if (mode === "single") {
    return ENTRIES_CHRONOLOGICAL.map((entry) => ({ id: entry.id, entries: [entry] }));
  }

  const stops: Stop[] = [];
  for (const entry of ENTRIES_CHRONOLOGICAL) {
    const partner = partnerFor(entry);
    const set = partner
      ? [entry, partner].sort((a, b) => laneIndex(a.lane) - laneIndex(b.lane))
      : [entry];
    const id = set.map((e) => e.id).join("+");
    // Consecutive stops covering the same pair are the same moment — merge them.
    if (stops.length > 0 && stops[stops.length - 1].id === id) continue;
    stops.push({ id, entries: set });
  }
  return stops;
}

const MODE_COPY: Record<StageMode, { slug: string; name: string; idea: string }> = {
  single: {
    slug: "resume6",
    name: "Pinned Rail",
    idea: "The tree stays pinned while one job at a time fades in beside it. Strictly one job per stop, even through the years two ran at once — compare against Dual Focus, which is identical apart from that.",
  },
  split: {
    slug: "resume7",
    name: "Dual Focus",
    idea: "Identical to Pinned Rail except through the overlap, where the stage splits and both concurrent jobs appear together. The one difference to judge is whether that split is worth the layout change.",
  },
};

export default function PinnedRailStage({ mode }: { mode: StageMode }) {
  const copy = MODE_COPY[mode];
  const stops = React.useMemo(() => buildStops(mode), [mode]);
  const reducedMotion = usePrefersReducedMotion();

  const sectionRef = React.useRef<HTMLDivElement>(null);
  const stickyRef = React.useRef<HTMLDivElement>(null);
  const railRef = React.useRef<HTMLDivElement>(null);
  const clipId = React.useId();

  const [enhanced, setEnhanced] = React.useState(false);
  const [pacing, setPacing] = React.useState<Pacing>("standard");
  const [rail, setRail] = React.useState<{ width: number; height: number } | null>(null);
  const [stickyHeight, setStickyHeight] = React.useState(0);
  /** Below this width a pair cannot sit side by side, so the second card trims. */
  const [narrow, setNarrow] = React.useState(false);
  const [fade, setFade] = React.useState(() => stopFade(0, stops.length));

  const active = stops[Math.min(fade.active, stops.length - 1)];
  const next = fade.next !== null ? stops[Math.min(fade.next, stops.length - 1)] : null;

  /* Pinning only makes sense with JS and without a reduced-motion preference —
     a scroll-driven pinned pane is exactly the kind of motion that setting is
     asking us to avoid. Everything falls back to a plain stacked list. */
  React.useLayoutEffect(() => {
    if (!reducedMotion) setEnhanced(true);
  }, [reducedMotion]);

  React.useEffect(() => {
    const stored = readStoredPacing();
    if (stored) setPacing(stored);
  }, []);

  React.useEffect(() => {
    const query = window.matchMedia("(max-width: 900px)");
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  /* Measure the rail and the pinned pane. */
  React.useLayoutEffect(() => {
    if (!enhanced) return;
    const railEl = railRef.current;
    const stickyEl = stickyRef.current;
    if (!railEl || !stickyEl) return;

    const measure = () => {
      const railRect = railEl.getBoundingClientRect();
      setRail({ width: railRect.width, height: railRect.height });
      setStickyHeight(stickyEl.getBoundingClientRect().height);
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(railEl);
    observer.observe(stickyEl);
    return () => observer.disconnect();
  }, [enhanced]);

  /* Drive the stage from scroll position. */
  React.useEffect(() => {
    if (!enhanced) return;
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const height = stickyRef.current?.getBoundingClientRect().height ?? stickyHeight;
      setFade(stopFade(sectionProgress(rect, height), stops.length));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enhanced, stops.length, stickyHeight]);

  /** Scroll so a given stop is centered in its slice. */
  const scrollToStop = React.useCallback(
    (index: number) => {
      const section = sectionRef.current;
      if (!section || !enhanced) return;
      const travel = section.offsetHeight - stickyHeight;
      const target =
        section.offsetTop + ((index + 0.4) / stops.length) * travel;
      window.scrollTo({ top: target, behavior: "smooth" });
    },
    [enhanced, stickyHeight, stops.length]
  );

  /* Changing pacing resizes the section, so hold the reader's place. */
  const changePacing = React.useCallback(
    (value: Pacing) => {
      const section = sectionRef.current;
      const held = fade.active;
      setPacing(value);
      writeStoredPacing(value);
      if (!section || !enhanced) return;
      window.requestAnimationFrame(() => {
        const travel = section.offsetHeight - stickyHeight;
        window.scrollTo({
          top: section.offsetTop + ((held + 0.4) / stops.length) * travel,
          behavior: "auto",
        });
      });
    },
    [enhanced, fade.active, stickyHeight, stops.length]
  );

  /* ---- rail geometry: nodes evenly spaced down the pinned rail ---- */
  const geometry = React.useMemo(() => {
    if (!rail || rail.height === 0) return null;
    const { width, height } = rail;
    const padTop = 34;
    const padBottom = 34;
    const usable = Math.max(1, height - padTop - padBottom);
    const step = usable / Math.max(1, ENTRIES_CHRONOLOGICAL.length - 1);

    const nodes = ENTRIES_CHRONOLOGICAL.map((entry, i) => ({
      entry,
      x: laneX(width, laneIndex(entry.lane)),
      y: padTop + i * step,
    }));

    const yearToY = makeYearToY(
      nodes.map((n) => ({ start: n.entry.start, y: n.y })),
      height
    );
    const firstCivilian = nodes.find((n) => n.entry.lane === "civilian");

    const paths = buildRailPaths({
      railWidth: width,
      topY: padTop - 18,
      bottomY: height - padBottom + 22,
      forkY: yearToY(FORK_YEAR),
      civilianFirstY: firstCivilian ? firstCivilian.y : yearToY(FORK_YEAR) + 60,
      serviceEndY: yearToY(MERGE_YEAR),
    });

    return { nodes, paths, yearToY };
  }, [rail]);

  /** Chevron sits on the active stop's node, or between them when two are live. */
  const markerY = React.useMemo(() => {
    if (!geometry) return 0;
    const meanY = (stop: Stop) => {
      const ys = stop.entries
        .map((e) => geometry.nodes.find((n) => n.entry.id === e.id)?.y)
        .filter((y): y is number => y !== undefined);
      return ys.length ? ys.reduce((a, b) => a + b, 0) / ys.length : 0;
    };
    const from = meanY(active);
    if (!next) return from;
    return from + (meanY(next) - from) * (fade.position - fade.active);
  }, [geometry, active, next, fade.position, fade.active]);

  const activeEntryIds = new Set(active.entries.map((e) => e.id));

  const sectionStyle: React.CSSProperties = enhanced
    ? { height: `calc(${stops.length * PACING_VH[pacing]}vh + ${stickyHeight}px)` }
    : {};

  return (
    <VariantShell current={copy.slug} name={copy.name} idea={copy.idea}>
      <Container padding="lg">
        <div
          className={enhanced ? "pr pr--enhanced" : "pr"}
          ref={sectionRef}
          style={sectionStyle}
        >
          <div className="pr__sticky" ref={stickyRef}>
            <div className="pr__rail" ref={railRef} aria-hidden="true">
              {geometry && rail && (
                <svg
                  width={rail.width}
                  height={rail.height}
                  viewBox={`0 0 ${rail.width} ${rail.height}`}
                  fill="none"
                  className="pr__svg"
                >
                  <defs>
                    <clipPath id={`${clipId}-trail`}>
                      <rect x={0} y={0} width={rail.width} height={Math.max(0, markerY)} />
                    </clipPath>
                  </defs>

                  <rect
                    className="pr__overlap"
                    x={geometry.paths.serviceX - 11}
                    y={geometry.paths.overlapTop}
                    width={geometry.paths.civilianX - geometry.paths.serviceX + 22}
                    height={Math.max(
                      0,
                      geometry.paths.overlapBottom - geometry.paths.overlapTop
                    )}
                    rx={12}
                  />

                  {/* Whole tree, dimmed — the part you have not reached yet. */}
                  <path
                    className="pr__line pr__line--dim"
                    d={geometry.paths.service}
                    stroke={laneColorVar("service")}
                  />
                  <path
                    className="pr__line pr__line--dim"
                    d={geometry.paths.branch}
                    stroke={laneColorVar("civilian")}
                  />

                  {/* Same tree at full strength, clipped to everything above the chevron. */}
                  <g clipPath={`url(#${clipId}-trail)`}>
                    <path
                      className="pr__line"
                      d={geometry.paths.service}
                      stroke={laneColorVar("service")}
                    />
                    <path
                      className="pr__line"
                      d={geometry.paths.branch}
                      stroke={laneColorVar("civilian")}
                    />
                  </g>

                  <line
                    className="pr__cap"
                    x1={geometry.paths.serviceX - 7}
                    y1={geometry.paths.serviceEndY}
                    x2={geometry.paths.serviceX + 7}
                    y2={geometry.paths.serviceEndY}
                    stroke={laneColorVar("service")}
                  />

                  {geometry.nodes.map(({ entry, x, y }) => {
                    const isActive = activeEntryIds.has(entry.id);
                    const passed = y <= markerY;
                    return (
                      <circle
                        key={entry.id}
                        cx={x}
                        cy={y}
                        r={isActive ? 8 : 5}
                        fill={isActive || passed ? laneColorVar(entry.lane) : "var(--background)"}
                        stroke={laneColorVar(entry.lane)}
                        strokeWidth={2.5}
                        className={isActive ? "pr__node pr__node--active" : "pr__node"}
                        opacity={isActive || passed ? 1 : 0.55}
                      />
                    );
                  })}

                  {/* Scroll position marker. */}
                  <g className="pr__marker" transform={`translate(0 ${markerY})`}>
                    <line
                      x1={0}
                      y1={0}
                      x2={rail.width}
                      y2={0}
                      className="pr__marker-line"
                    />
                    <path
                      d={`M ${rail.width - 13} -6 L ${rail.width - 6} 0 L ${rail.width - 13} 6`}
                      className="pr__marker-chevron"
                    />
                  </g>
                </svg>
              )}

              {/* Clickable jump targets over the rail nodes. */}
              {enhanced &&
                geometry &&
                stops.map((stop, index) => {
                  const node = geometry.nodes.find((n) => n.entry.id === stop.entries[0].id);
                  if (!node) return null;
                  return (
                    <button
                      key={stop.id}
                      type="button"
                      className="pr__jump"
                      style={{ top: node.y }}
                      onClick={() => scrollToStop(index)}
                    >
                      <span className="pr__jump-label">
                        {stop.entries.map((e) => e.role).join(" + ")}
                      </span>
                    </button>
                  );
                })}
            </div>

            <div className="pr__stage">
              {enhanced && (
                <div className="pr__toolbar">
                  <span className="pr__counter">
                    {Math.min(fade.active + 1, stops.length)} / {stops.length}
                  </span>
                  <PacingControl value={pacing} onChange={changePacing} />
                </div>
              )}

              <ol className="pr__stops">
                {stops.map((stop, index) => {
                  const opacity =
                    !enhanced
                      ? 1
                      : index === fade.active
                        ? fade.activeOpacity
                        : index === fade.next
                          ? fade.nextOpacity
                          : 0;
                  const shown = opacity > 0.01;
                  /* Outgoing cards drift up and away; incoming ones rise into
                     place, so the handover reads as a swap, not a blink. */
                  const leaving = index === fade.active && fade.next !== null;
                  const drift = (1 - opacity) * 12 * (leaving ? -1 : 1);
                  return (
                    <li
                      key={stop.id}
                      className={[
                        "pr__stop",
                        stop.entries.length > 1 && "pr__stop--pair",
                        enhanced && !shown && "pr__stop--gone",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      style={
                        enhanced
                          ? { opacity, transform: `translateY(${drift.toFixed(2)}px)` }
                          : undefined
                      }
                      aria-hidden={enhanced && opacity < 0.5 ? true : undefined}
                    >
                      {stop.entries.map((entry, i) => (
                        <JobCard
                          key={entry.id}
                          entry={entry}
                          compact={stop.entries.length > 1 && i > 0 && narrow}
                        />
                      ))}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </Container>
    </VariantShell>
  );
}
