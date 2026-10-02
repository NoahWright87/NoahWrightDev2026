/**
 * Machinery for the resume timeline: pacing, rail geometry, and the
 * scroll-progress math.
 */

import type { ResumeEntry } from "@/lib/resume";

/* ------------------------------------------------------------------ */
/* Pacing                                                             */
/* ------------------------------------------------------------------ */

/**
 * Viewport heights of scrolling per job. One screen per job was chosen over
 * faster and slower settings after trying all three in the browser.
 */
export const PACING_VH = 100;

/* ------------------------------------------------------------------ */
/* Rail geometry                                                       */
/* ------------------------------------------------------------------ */

/**
 * Width kept clear at the rail's left edge for the date riding the scroll
 * marker, so it never covers a lane or a milestone branching off one. Only on
 * a wide rail; a phone's rail is too narrow to spare it.
 */
export const READOUT_GUTTER = 64;

/** Track centers sit proportionally in the rail, right of the date gutter. */
export function trackX(railWidth: number, track: number): number {
  const gutter = railWidth > 120 ? READOUT_GUTTER : 0;
  return gutter + (railWidth - gutter) * (0.3 + (track - 1) * 0.4);
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

/**
 * A curve bending the civilian lane into the service lane. Works in either
 * direction; newest-first it rises from `fromY` up to `toY`.
 */
export function mergeCurve(opts: { railWidth: number; fromY: number; toY: number }): string {
  const { railWidth, fromY, toY } = opts;
  const serviceX = trackX(railWidth, 1);
  const civilianX = trackX(railWidth, 2);
  const delta = toY - fromY;
  const span = Math.sign(delta || -1) * Math.max(12, Math.abs(delta));
  return (
    `C ${civilianX} ${fromY + span * 0.6}, ${serviceX} ${toY - span * 0.6}, ` +
    `${serviceX} ${toY}`
  );
}

export interface RailPaths {
  serviceX: number;
  civilianX: number;
  /** Just the fork curve, for callers drawing the lane in colored segments. */
  branchCurve: string;
  /** Where on the service lane the branch leaves — below the node it leads to. */
  branchFromY: number;
  serviceEndY: number;
  overlapTop: number;
  overlapBottom: number;
}

/** How far below its first node the branch leaves the service lane. */
const BRANCH_SPAN = 42;

/**
 * Build the fork between the two lanes.
 *
 * The rail runs newest-first, so time goes *up* the page, the way
 * `git log --graph` reads. The branch leaves the service lane *below* the first
 * node of the new lane — slightly earlier in time — and arrives at that node
 * from underneath. Curving away at the node's own height instead would leave the
 * dot sitting over a line that starts beside it, so the new lane looks like it
 * appears from nowhere. The divergence point being slightly earlier than the
 * fork date is the usual convention — the dot still sits exactly on its date.
 */
export function buildRailPaths(opts: {
  railWidth: number;
  /** Where the service lane begins — its oldest point, so the lowest. */
  serviceStartY: number;
  /** The first node on the branched lane. The curve lands here. */
  branchToY: number;
  /** Where the service lane ends — its newest point, so above the fork. */
  serviceEndY: number;
}): RailPaths {
  const { railWidth, serviceStartY, branchToY, serviceEndY } = opts;
  const serviceX = trackX(railWidth, 1);
  const civilianX = trackX(railWidth, 2);

  /* Never reach back past the start of the lane being branched from. */
  const span = Math.max(12, Math.min(BRANCH_SPAN, serviceStartY - branchToY));
  const branchFromY = branchToY + span;

  const branchCurve =
    `M ${serviceX} ${branchFromY} ` +
    `C ${serviceX} ${branchFromY - span * 0.45}, ${civilianX} ${branchToY + span * 0.55}, ` +
    `${civilianX} ${branchToY}`;

  return {
    serviceX,
    civilianX,
    branchCurve,
    branchFromY,
    serviceEndY,
    overlapTop: serviceEndY,
    overlapBottom: branchToY,
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
const FADE_BAND = 0.1;

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
 * How far, as a fraction of a slice, card changes trail the marker. Each slice
 * is one job's own stretch of time, so the handover belongs right at the
 * boundary: this centres it there, the outgoing card fading just before the
 * marker crosses into the next job and the incoming one settling just after.
 * Running it much earlier shows a job's card while the date already reads the
 * next job — up to a year early in a long one — and pairs milestones with the
 * wrong job.
 */
const CARD_LAG = FADE_BAND * 0.4;

/**
 * Where a jump lands within a stop's slice: just past the handover, so the
 * card is fully in when the scroll stops.
 */
export const LAND_OFFSET = CARD_LAG + 0.02;

/**
 * Nudge a scroll target out of a card handover, so a jump never stops with
 * two cards half-faded. Milestones near a job boundary need this: the point
 * where the marker crosses them can fall inside the handover.
 */
export function settledRaw(raw: number): number {
  const boundary = Math.round(raw);
  const before = boundary - FADE_BAND + CARD_LAG - 0.02;
  const after = boundary + LAND_OFFSET;
  if (boundary === 0 || raw <= before || raw >= after) return raw;
  return raw < boundary ? before : after;
}

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

  const shifted = Math.min(Math.max(0, raw - CARD_LAG), count - 0.0001);
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
