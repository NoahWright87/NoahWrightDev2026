/**
 * TEMPORARY — shared machinery for the pinned-rail prototypes (`/resume6`–`/resume8`).
 *
 * All three pin a branch-style tree to the left and reveal one job at a time as
 * you scroll. This module holds the parts they agree on: pacing, rail geometry,
 * and the scroll-progress math.
 */

import type { LaneId, ResumeEntry } from "@/lib/resumeDemo";

/* ------------------------------------------------------------------ */
/* Pacing                                                              */
/* ------------------------------------------------------------------ */

export type Pacing = "snappy" | "standard" | "cinematic";

/** Viewport heights of scrolling per stop. */
export const PACING_VH: Record<Pacing, number> = {
  snappy: 55,
  standard: 100,
  cinematic: 150,
};

export const PACING_ORDER: Pacing[] = ["snappy", "standard", "cinematic"];

export const PACING_LABEL: Record<Pacing, string> = {
  snappy: "Snappy",
  standard: "Standard",
  cinematic: "Cinematic",
};

export const PACING_STORAGE_KEY = "nw-resume-proto-pacing";

/** Read the saved pacing. Storage can throw or be empty, so this never rejects. */
export function readStoredPacing(): Pacing | null {
  try {
    const value = window.localStorage.getItem(PACING_STORAGE_KEY);
    return value && (PACING_ORDER as string[]).includes(value) ? (value as Pacing) : null;
  } catch {
    return null;
  }
}

export function writeStoredPacing(pacing: Pacing): void {
  try {
    window.localStorage.setItem(PACING_STORAGE_KEY, pacing);
  } catch {
    /* Private browsing or blocked storage — the choice just doesn't persist. */
  }
}

/* ------------------------------------------------------------------ */
/* Rail geometry                                                       */
/* ------------------------------------------------------------------ */

export const LANE_ORDER: LaneId[] = ["service", "civilian"];

export function laneIndex(id: LaneId): number {
  return LANE_ORDER.indexOf(id);
}

/** Lane centers sit proportionally inside the rail, so any rail width works. */
export function laneX(railWidth: number, index: number): number {
  return railWidth * (0.3 + index * 0.4);
}

/**
 * Piecewise-linear map from a decimal year to a rail pixel offset, anchored on
 * the node positions. Lets the rail place the fork and the end of service at
 * dates that fall between two stops.
 */
export function makeYearToY(
  points: { start: number; y: number }[],
  height: number
): (year: number) => number {
  return (year: number) => {
    if (points.length === 0) return 0;
    if (points.length === 1) return points[0].y;

    if (year <= points[0].start) {
      const [a, b] = [points[0], points[1]];
      const span = b.start - a.start;
      if (span <= 0) return a.y;
      return Math.max(0, a.y + ((year - a.start) / span) * (b.y - a.y));
    }

    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      if (year >= a.start && year <= b.start) {
        const span = b.start - a.start;
        if (span <= 0) return b.y;
        return a.y + ((year - a.start) / span) * (b.y - a.y);
      }
    }

    const a = points[points.length - 2];
    const b = points[points.length - 1];
    const span = b.start - a.start;
    if (span <= 0) return b.y;
    return Math.min(height, b.y + ((year - b.start) / span) * (b.y - a.y));
  };
}

export interface RailPaths {
  serviceX: number;
  civilianX: number;
  service: string;
  /** Fork curve plus the whole civilian lane, as one path. */
  branch: string;
  /** Just the fork curve, for callers drawing the lane in colored segments. */
  branchCurve: string;
  /** Where the fork curve lands on the civilian lane. */
  branchCurveEndY: number;
  forkY: number;
  serviceEndY: number;
  overlapTop: number;
  overlapBottom: number;
}

/**
 * Build the two lane paths. The branch resolves within a fixed distance rather
 * than stretching across the whole gap, so the split always reads as a fork.
 */
export function buildRailPaths(opts: {
  railWidth: number;
  topY: number;
  bottomY: number;
  forkY: number;
  civilianFirstY: number;
  serviceEndY: number;
}): RailPaths {
  const { railWidth, topY, bottomY, forkY, civilianFirstY, serviceEndY } = opts;
  const serviceX = laneX(railWidth, 0);
  const civilianX = laneX(railWidth, 1);

  const gap = Math.max(20, civilianFirstY - forkY);
  const curve = Math.min(gap, 88);
  const curveEnd = forkY + curve;

  const branchCurve =
    `M ${serviceX} ${forkY} ` +
    `C ${serviceX} ${forkY + curve * 0.6}, ${civilianX} ${curveEnd - curve * 0.6}, ` +
    `${civilianX} ${curveEnd}`;

  return {
    serviceX,
    civilianX,
    service: `M ${serviceX} ${topY} L ${serviceX} ${serviceEndY}`,
    branch: `${branchCurve} L ${civilianX} ${bottomY}`,
    branchCurve,
    branchCurveEndY: curveEnd,
    forkY,
    serviceEndY,
    overlapTop: forkY,
    overlapBottom: serviceEndY,
  };
}

/* ------------------------------------------------------------------ */
/* Scroll progress                                                     */
/* ------------------------------------------------------------------ */

/**
 * How far through a pinned section the viewport has travelled, 0 to 1.
 * The travel distance is the section height minus the sticky pane, since the
 * pane stops moving once it is pinned.
 */
export function sectionProgress(sectionRect: DOMRect, stickyHeight: number): number {
  const travel = sectionRect.height - stickyHeight;
  if (travel <= 0) return 0;
  return Math.min(1, Math.max(0, -sectionRect.top / travel));
}

export interface StopFade {
  /** Index of the stop currently in focus. */
  active: number;
  /** Stop the marker is travelling *from*. Trails `active` through a handover. */
  markerIndex: number;
  /** Index fading in behind it, or `null` when the active stop is settled. */
  next: number | null;
  /** Opacity of the active stop, 0 to 1. */
  activeOpacity: number;
  /** Opacity of the incoming stop, 0 to 1. */
  nextOpacity: number;
  /** Continuous position across stops, for placing the scroll indicator. */
  position: number;
  /** How far through the active stop's own slice, 0 to 1. */
  local: number;
}

/**
 * Fraction of each stop's slice spent handing over to the next one. Kept short
 * deliberately: the handover is the only part of the scroll where the stage is
 * not showing a readable card, so it should pass quickly.
 */
const FADE_BAND = 0.14;

/**
 * The outgoing card clears before the incoming one is substantially there. A
 * true cross-dissolve superimposes two blocks of text at half opacity each,
 * which is unreadable; staggering the ramps keeps the overlap faint. The
 * incoming ramp starts before the outgoing one finishes, so there is no frame
 * where the stage is completely empty.
 */
const OUT_RAMP = 0.5;
const IN_DELAY = 0.35;

/**
 * Fraction of a slice the incoming card is already settled for before the
 * marker actually reaches its dot. Without it the card arrives at the exact
 * frame the marker lands, so tapping a dot catches the job still fading in.
 */
const SETTLE = 0.12;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * Split progress into "which stop, and how far into its handover".
 * Each stop holds steady for most of its slice and crossfades only at the end,
 * so two cards are never both half-faded for long.
 */
export function stopFade(progress: number, count: number): StopFade {
  if (count <= 1) {
    return {
      active: 0,
      markerIndex: 0,
      next: null,
      activeOpacity: 1,
      nextOpacity: 0,
      position: 0,
      local: progress,
    };
  }

  /* The marker runs on the raw scale, so it sits exactly on a dot at the start
     of that dot's slice. Card changes run on a scale shifted slightly earlier,
     so the handover finishes while the marker is still short of the next dot. */
  const raw = Math.min(progress * count, count - 0.0001);
  const markerIndex = Math.min(Math.floor(raw), count - 1);
  const local = raw - markerIndex;

  const shifted = Math.min(raw + SETTLE, count - 0.0001);
  const active = Math.min(Math.floor(shifted), count - 1);
  const cardLocal = shifted - active;

  const fadeStart = 1 - FADE_BAND;
  if (cardLocal < fadeStart || active === count - 1) {
    return {
      active,
      markerIndex,
      next: null,
      activeOpacity: 1,
      nextOpacity: 0,
      position: active,
      local,
    };
  }

  const u = (cardLocal - fadeStart) / FADE_BAND;
  return {
    active,
    markerIndex,
    next: active + 1,
    activeOpacity: 1 - clamp01(u / OUT_RAMP),
    nextOpacity: clamp01((u - IN_DELAY) / (1 - IN_DELAY)),
    position: active + u,
    local,
  };
}

/** Entries live at a given year — one normally, two through the overlap. */
export function entriesAtYear(entries: ResumeEntry[], year: number, endOfTime: number): ResumeEntry[] {
  return entries.filter((entry) => {
    const end = entry.end ?? endOfTime;
    return year >= entry.start && year < end;
  });
}
