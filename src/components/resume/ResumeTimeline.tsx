"use client";

/**
 * The resume timeline.
 *
 * A branching tree is pinned to the left for the whole section while one job at
 * a time fades in beside it, driven by scroll position. A chevron glides down
 * the tree, the lanes fill in behind it, and a date rides alongside.
 *
 * It reads newest-first: the current role is at the top and scrolling down goes
 * back in time, the way `git log --graph` does.
 *
 * The tree is drawn to scale: vertical distance is elapsed time, so the line
 * fills at the rate the years actually passed and the rail doubles as a date
 * axis. Jobs are colored by employer, so a promotion reads as a shade change
 * and a move to a new company as a hue change. Where two jobs ran at once, the
 * civilian one is on top and the concurrent service posting sits behind it as a
 * tab rather than taking the stage.
 */

import * as React from "react";
import { usePrefersReducedMotion } from "@noahwright/design";
import { JobCard } from "./JobCard";
import {
  ENTRIES_CHRONOLOGICAL,
  ENTRIES_NEWEST_FIRST,
  FORK_YEAR,
  MERGE_YEAR,
  TIMELINE_END,
  TIMELINE_START,
  PRIMARY_TRACK,
  RESUME_MARKERS,
  entryEnd,
  jobColorVar,
  markerEntry,
  yearToFraction,
  type ResumeEntry,
} from "@/lib/resume";
import {
  PACING_VH,
  buildRailPaths,
  trackX,
  mergeCurve,
  sectionProgress,
  stopFade,
} from "./scrollRail";
import "./job-colors.css";
import "./resume-timeline.css";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatYear(year: number): string {
  /* Decimal years are stored to three places (2025.583 for August), which
     lands a hair under the month boundary. Nudge before flooring, or a dot
     reads as the month before its own date. */
  const months = Math.floor(year * 12 + 0.05);
  return `${MONTHS[((months % 12) + 12) % 12]} ${Math.floor(months / 12)}`;
}

interface Stop {
  id: string;
  /** `entries[0]` is the stop's own job; the rest are concurrent, behind tabs. */
  entries: ResumeEntry[];
}

/** Other-lane jobs already running the day this one starts. */
function concurrentAtStart(entry: ResumeEntry): ResumeEntry[] {
  return ENTRIES_CHRONOLOGICAL.filter(
    (other) =>
      other.track !== entry.track &&
      entry.start >= other.start &&
      entry.start < entryEnd(other)
  );
}

/*
 * One stop per job, newest first. Reserve service is dated just before the first civilian
 * role, so the reserve stop finds nothing running yet and stands alone, while
 * each civilian stop picks the reserve posting up as a tab. That is what puts
 * the civilian card on top through the overlap without hiding the service one.
 */
const STOPS: Stop[] = ENTRIES_NEWEST_FIRST.map((entry) => ({
  id: entry.id,
  entries: [entry, ...concurrentAtStart(entry)],
}));

/**
 * A stop whose job may be running alongside one on the other track. The stop's
 * own job is on top; anything concurrent sits behind it as a tab, so the second
 * career is visible and one click away without ever taking the stage uninvited.
 */
function StackedStop({
  stop,
  shown,
  isActiveStop,
  colorOf,
  onPick,
}: {
  stop: Stop;
  shown: ResumeEntry;
  isActiveStop: boolean;
  colorOf: (entry: ResumeEntry) => string;
  onPick: (entryId: string) => void;
}) {
  const stacked = stop.entries.length > 1;
  return (
    <div className="rt__stack">
      {stacked && (
        <div className="rt__tabs" role="tablist" aria-label="Concurrent roles">
          {/* Ordered by track so the strip reads left to right the same way the
              rail does. Which one is showing is carried by the selected state,
              not by position. */}
          {[...stop.entries]
            .sort((a, b) => a.track - b.track)
            .map((entry) => {
              const on = entry.id === shown.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  tabIndex={isActiveStop ? 0 : -1}
                  className={on ? "rt__tab rt__tab--on" : "rt__tab"}
                  style={{ ["--lane-color" as string]: colorOf(entry) }}
                  onClick={() => onPick(entry.id)}
                >
                  <span className="rt__tab-role">{entry.role}</span>
                </button>
              );
            })}
        </div>
      )}
      <div className="rt__stack-card">
        <JobCard entry={shown} color={colorOf(shown)} />
      </div>
    </div>
  );
}

export default function ResumeTimeline() {
  const stops = STOPS;
  const colorOf = jobColorVar;
  const reducedMotion = usePrefersReducedMotion();

  const sectionRef = React.useRef<HTMLDivElement>(null);
  const stickyRef = React.useRef<HTMLDivElement>(null);
  const railRef = React.useRef<HTMLDivElement>(null);
  const clipId = React.useId();

  const [enhanced, setEnhanced] = React.useState(false);
  const [rail, setRail] = React.useState<{ width: number; height: number } | null>(null);
  const [stickyHeight, setStickyHeight] = React.useState(0);
  const [fade, setFade] = React.useState(() => stopFade(0, stops.length));

  /* Once the incoming card is the more visible of the two, it is the one the
     reader is looking at — so the lit dot and the tab strip should follow it
     rather than the card on its way out. */
  const activeIndex =
    fade.next !== null && fade.nextOpacity > fade.activeOpacity ? fade.next : fade.active;
  const active = stops[Math.min(activeIndex, stops.length - 1)];

  /**
   * Which card is on top within a stop that stacks concurrent jobs. Null means
   * the stop's own job — so the civilian role wins by default and the service
   * one is a deliberate choice. Cleared whenever the active stop changes, so a
   * pick never carries over to a different moment in the career.
   */
  const [tabPick, setTabPick] = React.useState<{ stop: string; entry: string } | null>(null);
  const selected =
    tabPick && tabPick.stop === active.id
      ? (active.entries.find((e) => e.id === tabPick.entry) ?? active.entries[0])
      : active.entries[0];

  React.useEffect(() => {
    setTabPick((pick) => (pick && pick.stop !== active.id ? null : pick));
  }, [active.id]);

  /* Pinning only makes sense with JS and without a reduced-motion preference —
     a scroll-driven pinned pane is exactly the kind of motion that setting is
     asking us to avoid. Everything falls back to a plain stacked list. */
  React.useLayoutEffect(() => {
    if (!reducedMotion) setEnhanced(true);
  }, [reducedMotion]);

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

  /**
   * Land with the marker exactly on the stop's dot. The card is already fully
   * opaque there because the handover finishes a little earlier in the previous
   * slice — see `SETTLE` in `scrollRail.ts`.
   */
  const scrollToStop = React.useCallback(
    (index: number) => {
      const section = sectionRef.current;
      if (!section || !enhanced) return;
      const travel = section.offsetHeight - stickyHeight;
      window.scrollTo({
        top: section.offsetTop + (index / stops.length) * travel,
        behavior: "smooth",
      });
    },
    [enhanced, stickyHeight, stops.length]
  );

  /**
   * Tapping a dot goes to that job: scroll to the stop it leads, and bring it
   * to the front there. When it is only ever a concurrent tab of the stop you
   * are already on, switch tabs in place rather than scrolling away.
   */
  const goToEntry = React.useCallback(
    (entryId: string) => {
      const owner = stops.findIndex((stop) => stop.entries[0].id === entryId);
      if (owner === -1) {
        if (active.entries.some((e) => e.id === entryId)) {
          setTabPick({ stop: active.id, entry: entryId });
        }
        return;
      }
      setTabPick(null);
      scrollToStop(owner);
    },
    [active, scrollToStop, stops]
  );

  /* ---- rail geometry ---- */
  const geometry = React.useMemo(() => {
    if (!rail || rail.height === 0) return null;
    const { width, height } = rail;
    const padTop = 34;
    const padBottom = 34;
    const usable = Math.max(1, height - padTop - padBottom);

    /* Drawn to scale, so vertical distance is elapsed time and the rail
       doubles as a date axis the marker's position can be read against. */
    const nodes = ENTRIES_CHRONOLOGICAL.map((entry) => ({
      entry,
      x: trackX(width, entry.track),
      y: padTop + yearToFraction(entry.start) * usable,
    }));

    const yearToY = (y: number) => padTop + yearToFraction(y) * usable;

    /* Awards, degrees and training sit on the lane of the job they fell in,
       as diamonds so they never read as another job. */
    const markers = RESUME_MARKERS.map((marker) => {
      const y = yearToY(marker.date);
      /* Distance to the nearest job dot on the same lane, so the diamond's tap
         target can shrink rather than cover a dot a few pixels away. */
      const gap = Math.min(
        Infinity,
        ...nodes
          .filter((n) => n.entry.track === marker.track)
          .map((n) => Math.abs(n.y - y))
      );
      return {
        marker,
        entry: markerEntry(marker),
        x: trackX(width, marker.track),
        y,
        hitHeight: Math.max(6, Math.min(14, 2 * gap - 8)),
      };
    });

    /** Read a rail position back as a date. Newest is at the top. */
    const yearAtY = (y: number) =>
      TIMELINE_END - ((y - padTop) / usable) * (TIMELINE_END - TIMELINE_START);

    const primaryNodes = nodes.filter((n) => n.entry.track === PRIMARY_TRACK);
    const branchNodes = nodes.filter((n) => n.entry.track !== PRIMARY_TRACK);

    /* Where the career splits in two: the first civilian job that starts at or
       after the fork. Everything civilian before that belongs to an earlier
       chapter, not to the branch. */
    const forkNode = branchNodes.find((n) => n.entry.start >= FORK_YEAR - 0.01);
    /* Where an earlier civilian chapter runs into service: a civilian job that
       ends exactly as the first service entry begins. */
    const serviceStart = primaryNodes.length ? primaryNodes[0].entry.start : null;
    const mergeNode =
      serviceStart === null
        ? undefined
        : branchNodes.find((n) => Math.abs(entryEnd(n.entry) - serviceStart) < 0.02);

    const paths = buildRailPaths({
      railWidth: width,
      serviceStartY: primaryNodes.length ? primaryNodes[0].y : yearToY(TIMELINE_START),
      branchToY: forkNode ? forkNode.y : yearToY(FORK_YEAR),
      serviceEndY: yearToY(MERGE_YEAR),
    });

    const ticks: number[] = [];
    for (let y = 2010; y <= Math.floor(TIMELINE_END); y += 2) ticks.push(y);

    /*
     * Both lanes are drawn one segment per job, spanning that job's own start
     * and end rather than running to the next node. That matters because the
     * career is not continuous on either lane: there are years of service with
     * no civilian job and a short gap between leaving active duty and joining
     * the Reserve, and a segment that ran node-to-node would silently paper
     * over both. Per-job segments also let each civilian job carry its own
     * color — same hue as the one beside it means a promotion at the same
     * employer, a new hue means a new company.
     */
    const segmentFor = (node: (typeof nodes)[number]) => {
      const endY = yearToY(entryEnd(node.entry));
      if (node.entry.id === forkNode?.entry.id) {
        /* Carries the fork curve in with it, so the branch is already the color
           of the job it leads to. The curve lands on this node, so the run of
           the job continues straight up from there. */
        return `${paths.branchCurve} L ${paths.civilianX} ${endY}`;
      }
      if (node.entry.id === mergeNode?.entry.id) {
        /* Rises into the service lane, so leaving this job to enlist reads as
           one line becoming the other. */
        const bend = Math.min(30, Math.max(12, node.y - endY));
        return (
          `M ${paths.civilianX} ${node.y} L ${paths.civilianX} ${endY + bend} ` +
          mergeCurve({ railWidth: width, fromY: endY + bend, toY: endY })
        );
      }
      return `M ${node.x} ${node.y} L ${node.x} ${endY}`;
    };

    const branchSegments = branchNodes.map((node) => ({
      id: node.entry.id,
      entry: node.entry,
      d: segmentFor(node),
    }));

    const primarySegments = primaryNodes.map((node) => ({
      id: node.entry.id,
      entry: node.entry,
      d: segmentFor(node),
    }));

    return {
      nodes,
      markers,
      paths,
      branchSegments,
      primarySegments,
      yearToY,
      yearAtY,
      ticks,
      bottomY: height - padBottom,
    };
  }, [rail]);

  /**
   * The marker travels from the active stop's node to the next one across that
   * stop's *whole* slice, so it — and the date riding it — advance steadily the
   * entire time you are scrolling. Tying it to the crossfade instead would park
   * it on a node for most of the slice and then sprint between jobs.
   */
  const markerY = React.useMemo(() => {
    if (!geometry) return 0;
    const meanY = (stop: Stop) => {
      /* A stacked stop's extra entries are concurrent jobs tucked behind it as
         tabs, not co-occupants of the moment — so the marker aims at the stop's
         own dot. Only a genuinely shared stop (the side-by-side variant) puts
         the marker between two lanes. */
      const anchors = stop.entries.slice(0, 1);
      const ys = anchors
        .map((e) => geometry.nodes.find((n) => n.entry.id === e.id)?.y)
        .filter((y): y is number => y !== undefined);
      return ys.length ? ys.reduce((a, b) => a + b, 0) / ys.length : 0;
    };
    const current = stops[Math.min(fade.markerIndex, stops.length - 1)];
    const from = meanY(current);
    const upcoming = stops[fade.markerIndex + 1];
    /* Past the last node there is nothing to aim at, so run on to the end of
       the rail — otherwise the line stops filling early. */
    const to = upcoming ? meanY(upcoming) : geometry.bottomY;
    return from + (to - from) * Math.min(1, Math.max(0, fade.local));
  }, [geometry, fade.markerIndex, fade.local, stops]);

  const markerYear = geometry ? geometry.yearAtY(markerY) : null;

  const activeEntryIds = new Set(active.entries.map((e) => e.id));

  /* Dot targets are capped to the gap between the two lanes so a service dot
     and a civilian one that start weeks apart never cover each other. On a
     narrow rail that leaves a small target, which is why the tab strip — not
     the dots — is the primary way to reach a concurrent job on a phone. */
  const jumpWidth = rail
    ? Math.max(16, Math.min(44, Math.abs(trackX(rail.width, 2) - trackX(rail.width, 1)) - 3))
    : 44;

  const sectionStyle: React.CSSProperties = enhanced
    ? { height: `calc(${stops.length * PACING_VH}vh + ${stickyHeight}px)` }
    : {};

  return (
    <div
      className={enhanced ? "rt rt--enhanced" : "rt"}
      ref={sectionRef}
      style={sectionStyle}
    >
          <div className="rt__sticky" ref={stickyRef}>
            <div className="rt__rail" ref={railRef} aria-hidden="true">
              {geometry && rail && (
                <svg
                  width={rail.width}
                  height={rail.height}
                  viewBox={`0 0 ${rail.width} ${rail.height}`}
                  fill="none"
                  className="rt__svg"
                >
                  <defs>
                    <clipPath id={`${clipId}-trail`}>
                      <rect x={0} y={0} width={rail.width} height={Math.max(0, markerY)} />
                    </clipPath>
                  </defs>

                  <rect
                    className="rt__overlap"
                    x={geometry.paths.serviceX - 11}
                    y={geometry.paths.overlapTop}
                    width={geometry.paths.civilianX - geometry.paths.serviceX + 22}
                    height={Math.max(
                      0,
                      geometry.paths.overlapBottom - geometry.paths.overlapTop
                    )}
                    rx={12}
                  />

                  {geometry.ticks.map((tick) => {
                    const tickY = geometry.yearToY(tick);
                    /* The date riding the marker sits in the same column as the
                       tick labels, so a tick it is passing steps aside. */
                    const covered = Math.abs(tickY - markerY) < 16;
                    return (
                      <g key={tick}>
                        <line
                          x1={4}
                          y1={tickY}
                          x2={rail.width - 4}
                          y2={tickY}
                          className="rt__tick-line"
                        />
                        <text
                          x={2}
                          y={tickY - 3}
                          className="rt__tick-label"
                          opacity={covered ? 0 : undefined}
                        >
                          {tick}
                        </text>
                      </g>
                    );
                  })}

                  {/* Whole tree twice: dimmed underneath for the part not yet
                      reached, then again at full strength clipped to above the
                      marker, which is what fills the line in as you scroll. */}
                  {[false, true].map((lit) => {
                    const lane = (
                      <>
                        {geometry.primarySegments.map((segment) => (
                          <path
                            key={segment.id}
                            className={lit ? "rt__line" : "rt__line rt__line--dim"}
                            d={segment.d}
                            stroke={colorOf(segment.entry)}
                          />
                        ))}
                        {geometry.branchSegments.map((segment) => (
                          <path
                            key={segment.id}
                            className={lit ? "rt__line" : "rt__line rt__line--dim"}
                            d={segment.d}
                            stroke={colorOf(segment.entry)}
                          />
                        ))}
                      </>
                    );
                    return lit ? (
                      <g key="lit" clipPath={`url(#${clipId}-trail)`}>
                        {lane}
                      </g>
                    ) : (
                      <g key="dim">{lane}</g>
                    );
                  })}

                  {geometry.primarySegments.length > 0 && (
                    <line
                      className="rt__cap"
                      x1={geometry.paths.serviceX - 7}
                      y1={geometry.paths.serviceEndY}
                      x2={geometry.paths.serviceX + 7}
                      y2={geometry.paths.serviceEndY}
                      stroke={colorOf(
                        geometry.primarySegments[geometry.primarySegments.length - 1].entry
                      )}
                    />
                  )}

                  {geometry.markers.map(({ marker, entry, x, y }) => {
                    const passed = y <= markerY;
                    const color = entry ? colorOf(entry) : "var(--primary)";
                    const r = 5;
                    return (
                      <path
                        key={marker.id}
                        d={`M ${x} ${y - r} L ${x + r} ${y} L ${x} ${y + r} L ${x - r} ${y} Z`}
                        fill={passed ? color : "var(--background)"}
                        stroke={color}
                        strokeWidth={2}
                        strokeLinejoin="round"
                        className="rt__milestone"
                        opacity={passed ? 1 : 0.7}
                      />
                    );
                  })}

                  {geometry.nodes.map(({ entry, x, y }) => {
                    const isActive = selected.id === entry.id;
                    const inStop = activeEntryIds.has(entry.id);
                    const passed = y <= markerY;
                    const color = colorOf(entry);
                    return (
                      <circle
                        key={entry.id}
                        cx={x}
                        cy={y}
                        r={isActive ? 8 : inStop ? 6.5 : 5}
                        fill={isActive || passed ? color : "var(--background)"}
                        stroke={color}
                        strokeWidth={2.5}
                        className={isActive ? "rt__node rt__node--active" : "rt__node"}
                        opacity={isActive || passed ? 1 : 0.55}
                      />
                    );
                  })}

                  {/* Scroll position marker. */}
                  <g className="rt__marker" transform={`translate(0 ${markerY})`}>
                    <line
                      x1={0}
                      y1={0}
                      x2={rail.width}
                      y2={0}
                      className="rt__marker-line"
                    />
                    <path
                      d={`M ${rail.width - 13} -6 L ${rail.width - 6} 0 L ${rail.width - 13} 6`}
                      className="rt__marker-chevron"
                    />
                  </g>
                </svg>
              )}

              {/* Date rides the marker. No CSS transition on either: both must
                  track scroll exactly, or they lag behind and then catch up
                  once scrolling stops. */}
              {enhanced && markerYear !== null && (
                <span className="rt__readout" style={{ top: markerY }}>
                  {formatYear(markerYear)}
                </span>
              )}

              {/* Diamonds take you to the job they fell in. They sit above the job
                  targets, with each target trimmed to stop short of the nearest
                  job dot, so both stay reachable. */}
              {enhanced &&
                geometry &&
                rail &&
                geometry.markers.map(({ marker, entry, x, y, hitHeight }) =>
                  entry ? (
                    <button
                      key={marker.id}
                      type="button"
                      className="rt__jump rt__jump--milestone"
                      style={{
                        top: y,
                        left: x - 9,
                        height: hitHeight,
                        ["--label-shift" as string]: `${rail.width - x + 5}px`,
                      }}
                      onClick={() => goToEntry(entry.id)}
                    >
                      <span className="rt__jump-label">
                        {marker.label} · {marker.dateLabel}
                      </span>
                    </button>
                  ) : null
                )}

              {/* One jump target per dot, so every job is reachable — including
                  a service posting that only ever appears as a concurrent tab. */}
              {enhanced &&
                geometry &&
                rail &&
                geometry.nodes.map(({ entry, x, y }) => (
                  <button
                    key={entry.id}
                    type="button"
                    className="rt__jump"
                    /* Scoped to its own lane column rather than the full rail
                       width. Two jobs that start weeks apart sit only a few
                       pixels apart on a to-scale rail, so full-width targets
                       would overlap and the upper dot could never be hit. */
                    style={{
                      top: y,
                      left: x - jumpWidth / 2,
                      width: jumpWidth,
                      ["--label-shift" as string]: `${rail.width - x + 14}px`,
                    }}
                    onClick={() => goToEntry(entry.id)}
                  >
                    <span className="rt__jump-label">{entry.role}</span>
                  </button>
                ))}
            </div>

            <div className="rt__stage">
              <ol className="rt__stops">
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
                        "rt__stop",
                        "rt__stop--stacked",
                        enhanced && !shown && "rt__stop--gone",
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
                      <StackedStop
                        stop={stop}
                        shown={stop.id === active.id ? selected : stop.entries[0]}
                        isActiveStop={stop.id === active.id}
                        colorOf={colorOf}
                        onPick={(entryId) => setTabPick({ stop: stop.id, entry: entryId })}
                      />
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
    </div>
  );
}
