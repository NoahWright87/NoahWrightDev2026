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
import { MilestoneCard } from "./MilestoneCard";
import { TabbedSlot, type SlotTab } from "./TabbedSlot";
import {
  ENTRIES_CHRONOLOGICAL,
  ENTRIES_NEWEST_FIRST,
  FORK_YEAR,
  MERGE_YEAR,
  TIMELINE_END,
  TIMELINE_START,
  PRIMARY_TRACK,
  RESUME_MARKERS,
  MILESTONE_GROUPS,
  entryEnd,
  type MilestoneGroup,
  type ResumeMarker,
  jobColorVar,
  markerEntry,
  yearToFraction,
  type ResumeEntry,
} from "@/lib/resume";
import {
  LAND_OFFSET,
  PACING_VH,
  settledRaw,
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
  /** The job this stop is about. Its card is on top unless a tab is picked. */
  entry: ResumeEntry;
}

/** One stop per job, newest first. */
const STOPS: Stop[] = ENTRIES_NEWEST_FIRST.map((entry) => ({ id: entry.id, entry }));

/**
 * How close, in years, the scroll date has to be to a job or a milestone for
 * it to show. Three months either side: a job you are about to reach appears
 * as a tab a little early, and one you have just left lingers briefly, so the
 * reader can click across without scrolling. The same window brings milestone
 * cards in and out.
 */
const NEARBY_YEARS = 0.25;

/**
 * A milestone in a long job is crossed quickly — the marker covers a five-year
 * job in one screen of scrolling — so three months alone can flash a card past.
 * It also stays up while the scroll is within this fraction of a slice of the
 * point where the marker crosses it.
 */
const MIN_DWELL = 0.1;

/** Every job running within `NEARBY_YEARS` of a date. */
function jobsAround(year: number): ResumeEntry[] {
  return ENTRIES_NEWEST_FIRST.filter(
    (e) => year >= e.start - NEARBY_YEARS && year <= entryEnd(e) + NEARBY_YEARS
  );
}

/** A stop's own job first, then anything else around at this date. */
function entriesFor(stop: Stop, year: number | null): ResumeEntry[] {
  if (year === null) return [stop.entry];
  return [stop.entry, ...jobsAround(year).filter((e) => e.id !== stop.entry.id)];
}

/** Color a milestone by the job it happened during. */
function milestoneColor(marker: ResumeMarker): string {
  const entry = markerEntry(marker);
  return entry ? jobColorVar(entry) : "var(--primary)";
}

/** Job tabs, ordered by track and then newest first, as the rail reads. */
function jobTabs(entries: ResumeEntry[]): SlotTab[] {
  return [...entries]
    .sort((a, b) => a.track - b.track || b.start - a.start)
    .map((entry) => ({ id: entry.id, label: entry.role, color: jobColorVar(entry) }));
}

/** Milestone tabs, newest first to match the job tabs. */
function milestoneTabs(markers: ResumeMarker[]): SlotTab[] {
  return [...markers]
    .sort((a, b) => b.date - a.date)
    .map((marker) => ({
      id: marker.id,
      label: marker.short ?? marker.label,
      color: milestoneColor(marker),
    }));
}

/**
 * A milestone slot that keeps its own tab selection. The plain fallback list
 * uses it under each job; the pinned view drives its slot from scroll instead.
 */
function MilestonesSlot({ markers }: { markers: ResumeMarker[] }) {
  const [pick, setPick] = React.useState<string | null>(null);
  const tabs = milestoneTabs(markers);
  const shown = markers.find((m) => m.id === pick) ?? markers.find((m) => m.id === tabs[0].id)!;
  return (
    <TabbedSlot
      tabs={tabs}
      selectedId={shown.id}
      onPick={setPick}
      label="Awards, education and training"
    >
      <MilestoneCard marker={shown} color={milestoneColor(shown)} />
    </TabbedSlot>
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
   * Which card is on top within a stop that stacks other jobs as tabs. Null
   * means the stop's own job, so anything else is a deliberate choice. Cleared
   * whenever the active stop changes, so a pick never carries over to a
   * different moment in the career.
   */
  const [tabPick, setTabPick] = React.useState<{ stop: string; entry: string } | null>(null);

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
   * Scroll to a position on the stop scale: 2.5 is halfway through the third
   * stop's slice, and a whole number is the top of that job's stretch of rail.
   */
  const scrollToRaw = React.useCallback(
    (raw: number) => {
      const section = sectionRef.current;
      if (!section || !enhanced) return;
      const travel = section.offsetHeight - stickyHeight;
      window.scrollTo({
        top: section.offsetTop + (raw / stops.length) * travel,
        behavior: "smooth",
      });
    },
    [enhanced, stickyHeight, stops.length]
  );

  /** Tapping a job's dot goes to that job's stop, with its own card on top. */
  const goToEntry = React.useCallback(
    (entryId: string) => {
      const owner = stops.findIndex((stop) => stop.entry.id === entryId);
      if (owner === -1) return;
      setTabPick(null);
      /* Just past the handover, so the card is fully in when it lands. */
      scrollToRaw(owner + LAND_OFFSET);
    },
    [scrollToRaw, stops]
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

    /*
     * Awards, degrees, training and certs are short branches off the lane of
     * the job they happened during: out, a node, and back in, like a feature
     * branch. They branch to the *outside* of the lane, away from the other
     * one, so nothing crowds the gap between the two careers. Milestones close
     * together are one group, drawn as one node with a count; its card lists
     * them as tabs.
     */
    const laneGap = Math.abs(trackX(width, 2) - trackX(width, 1));
    const BEND = 8;
    const groupNodes = MILESTONE_GROUPS.map((group) => {
      const laneX = trackX(width, group.track);
      const outward = group.track === PRIMARY_TRACK ? -1 : 1;
      /* As far out as the space beside the lane allows, without reaching the
         rail's edge. */
      const room = outward < 0 ? laneX - 7 : width - laneX - 7;
      const x = laneX + outward * Math.max(4, Math.min(laneGap * 0.45, room));
      const yNew = yearToY(group.end);
      const yOld = yearToY(group.start);
      return {
        group,
        laneX,
        x,
        y: (yNew + yOld) / 2,
        d:
          `M ${laneX} ${yOld + BEND} ` +
          `C ${laneX} ${yOld + BEND * 0.4}, ${x} ${yOld + BEND * 0.6}, ${x} ${yOld} ` +
          `L ${x} ${yNew} ` +
          `C ${x} ${yNew - BEND * 0.6}, ${laneX} ${yNew - BEND * 0.4}, ${laneX} ${yNew - BEND}`,
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
      groupNodes,
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
   * Where the marker is at each stop boundary. Each stop's slice of scrolling
   * covers that job's own stretch of rail: from the newer job's dot (or today,
   * for the first) down to this job's dot. So the date riding the marker is
   * always inside the job whose card is showing, which is also what lets
   * milestones pop up beside the right job.
   */
  const anchors = React.useMemo(() => {
    if (!geometry) return null;
    const nodeY = (entry: ResumeEntry) =>
      geometry.nodes.find((n) => n.entry.id === entry.id)?.y ?? 0;
    return [geometry.yearToY(TIMELINE_END), ...stops.map((stop) => nodeY(stop.entry))];
  }, [geometry, stops]);

  /**
   * The marker moves across the stop's *whole* slice, so it — and the date
   * riding it — advance steadily the entire time you are scrolling. Tying it to
   * the crossfade instead would park it for most of the slice and then sprint.
   */
  const markerY = React.useMemo(() => {
    if (!anchors) return 0;
    const i = Math.min(fade.markerIndex, stops.length - 1);
    const from = anchors[i];
    const to = anchors[i + 1];
    return from + (to - from) * Math.min(1, Math.max(0, fade.local));
  }, [anchors, fade.markerIndex, fade.local, stops.length]);

  const markerYear = geometry ? geometry.yearAtY(markerY) : null;
  const scrollRaw = fade.markerIndex + fade.local;

  const activeEntries = entriesFor(active, markerYear);
  const selected =
    tabPick && tabPick.stop === active.id
      ? (activeEntries.find((e) => e.id === tabPick.entry) ?? active.entry)
      : active.entry;
  const activeEntryIds = new Set(activeEntries.map((e) => e.id));

  /** Where on the stop scale the marker crosses each milestone group's node. */
  const groupRaw = React.useMemo(() => {
    const out = new Map<string, number>();
    if (!geometry || !anchors) return out;
    for (const node of geometry.groupNodes) {
      for (let i = 0; i < stops.length; i++) {
        const a = anchors[i];
        const b = anchors[i + 1];
        if (b > a && node.y >= a && node.y <= b) {
          out.set(node.group.id, i + (node.y - a) / (b - a));
          break;
        }
      }
    }
    return out;
  }, [geometry, anchors, stops.length]);

  /*
   * The group near the scroll date, if any: within three months of its span,
   * or close in scroll terms to its node. If two qualify, the nearer in time.
   */
  const activeGroup = React.useMemo(() => {
    if (!enhanced || markerYear === null) return null;
    let best: { group: MilestoneGroup; distance: number } | null = null;
    for (const group of MILESTONE_GROUPS) {
      const distance = Math.max(0, group.start - markerYear, markerYear - group.end);
      const raw = groupRaw.get(group.id);
      const near =
        distance <= NEARBY_YEARS || (raw !== undefined && Math.abs(scrollRaw - raw) <= MIN_DWELL);
      if (near && (!best || distance < best.distance)) best = { group, distance };
    }
    return best?.group ?? null;
  }, [enhanced, markerYear, groupRaw, scrollRaw]);

  /* Keep the last group on hand so the slot fades out with its content rather
     than going blank first. */
  const [slotGroup, setSlotGroup] = React.useState<MilestoneGroup | null>(null);
  React.useEffect(() => {
    if (activeGroup) setSlotGroup(activeGroup);
  }, [activeGroup]);
  const groupInSlot = activeGroup ?? slotGroup;

  /** A clicked milestone tab; otherwise the one nearest the scroll date shows. */
  const [milestonePick, setMilestonePick] = React.useState<{
    group: string;
    marker: string;
  } | null>(null);
  const shownMilestone = groupInSlot
    ? ((milestonePick?.group === groupInSlot.id
        ? groupInSlot.markers.find((m) => m.id === milestonePick.marker)
        : undefined) ??
      [...groupInSlot.markers].sort(
        (a, b) =>
          Math.abs(a.date - (markerYear ?? a.date)) - Math.abs(b.date - (markerYear ?? b.date))
      )[0])
    : null;

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
                    /* Right-aligned at the rail's far edge, leaving the left of
                       the rail for milestone branches. */
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
                          x={rail.width - 2}
                          y={tickY - 3}
                          textAnchor="end"
                          className="rt__tick-label"
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
                        {geometry.groupNodes.map((node) => (
                          <path
                            key={node.group.id}
                            className={
                              lit
                                ? "rt__line rt__line--milestone"
                                : "rt__line rt__line--milestone rt__line--dim"
                            }
                            d={node.d}
                            stroke={milestoneColor(node.group.markers[0])}
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

                  {geometry.groupNodes.map(({ group, x, y }) => {
                    const on = activeGroup?.id === group.id;
                    const passed = y <= markerY;
                    const color = milestoneColor(group.markers[0]);
                    const count = group.markers.length;
                    /* A group shows its count; a lone milestone is a plain,
                       smaller diamond. */
                    const r = count > 1 ? 8.5 : on ? 6 : 5;
                    return (
                      <g key={group.id} className="rt__milestone-node">
                        <path
                          d={`M ${x} ${y - r} L ${x + r} ${y} L ${x} ${y + r} L ${x - r} ${y} Z`}
                          fill={on || passed ? color : "var(--background)"}
                          stroke={color}
                          strokeWidth={on ? 2.5 : 2}
                          strokeLinejoin="round"
                          opacity={on || passed ? 1 : 0.75}
                        />
                        {count > 1 && (
                          <text
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="rt__milestone-count"
                            fill={on || passed ? "var(--background)" : color}
                          >
                            {count}
                          </text>
                        )}
                      </g>
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

              {/* Each diamond scrolls to where the marker crosses it, so its card
                  comes up. They sit above the job targets; they are off the
                  lane, so they never cover a job's dot. */}
              {enhanced &&
                geometry &&
                rail &&
                geometry.groupNodes.map(({ group, x, y, laneX }) => {
                  const raw = groupRaw.get(group.id);
                  if (raw === undefined) return null;
                  const size = group.markers.length > 1 ? 20 : 14;
                  /* Centred on the node, but never reaching across the lane:
                     on a narrow rail the node is only a few pixels out, and a
                     job's dot can sit right beside it. */
                  const left =
                    x < laneX
                      ? Math.min(x - size / 2, laneX - 3 - size)
                      : Math.max(x - size / 2, laneX + 3);
                  const newest = group.markers[group.markers.length - 1];
                  return (
                    <button
                      key={group.id}
                      type="button"
                      className="rt__jump rt__jump--milestone"
                      style={{
                        top: y,
                        left,
                        width: size,
                        height: size,
                        ["--label-shift" as string]: `${rail.width - left - size + 14}px`,
                      }}
                      onClick={() => {
                        setMilestonePick(null);
                        scrollToRaw(settledRaw(raw));
                      }}
                    >
                      <span className="rt__jump-label">
                        {group.markers.length > 1
                          ? `${group.markers.length} milestones · ${Math.floor(group.start)}–${Math.floor(group.end)}`
                          : `${newest.label} · ${newest.dateLabel}`}
                      </span>
                    </button>
                  );
                })}

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

            {/* Two slots, the job above and milestones below, both the same
                component. In the pinned view they hold fixed places and never
                resize; the plain list stacks a job's slots in order. */}
            {enhanced ? (
              <div className="rt__stage">
                <TabbedSlot
                  className="rt__slot"
                  tabs={jobTabs(activeEntries)}
                  selectedId={selected.id}
                  onPick={(entryId) => setTabPick({ stop: active.id, entry: entryId })}
                  label="Roles around this time"
                >
                  <JobCard entry={selected} color={colorOf(selected)} />
                </TabbedSlot>

                {groupInSlot && shownMilestone ? (
                  <TabbedSlot
                    className="rt__slot"
                    visible={activeGroup !== null}
                    tabs={milestoneTabs(groupInSlot.markers)}
                    selectedId={shownMilestone.id}
                    onPick={(markerId) =>
                      setMilestonePick({ group: groupInSlot.id, marker: markerId })
                    }
                    label="Awards, education and training"
                  >
                    <MilestoneCard marker={shownMilestone} color={milestoneColor(shownMilestone)} />
                  </TabbedSlot>
                ) : (
                  <div className="rt__slot" aria-hidden="true" />
                )}
              </div>
            ) : (
              <ol className="rt__list">
                {stops.map((stop) => {
                  const markers = RESUME_MARKERS.filter(
                    (m) => markerEntry(m)?.id === stop.entry.id
                  );
                  return (
                    <li key={stop.id} className="rt__list-item">
                      <TabbedSlot
                        tabs={jobTabs([stop.entry])}
                        selectedId={stop.entry.id}
                        onPick={() => {}}
                        label="Role"
                      >
                        <JobCard entry={stop.entry} color={colorOf(stop.entry)} />
                      </TabbedSlot>
                      {markers.length > 0 && <MilestonesSlot markers={markers} />}
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
    </div>
  );
}
