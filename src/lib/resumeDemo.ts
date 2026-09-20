/**
 * TEMPORARY — fake resume data shared by the `/resume1`–`/resume5` layout
 * prototypes. Every variant renders from this one source so the only thing
 * that differs between them is the presentation.
 *
 * None of this is real. It mirrors the *shape* of a dual-track career
 * (active duty -> reserves alongside a full-time civilian job -> civilian
 * only) so the branching visuals have something honest to draw. Replace with
 * real content once a layout is chosen, then delete the prototype routes.
 */

export type LaneId = "service" | "civilian";

export interface ResumeLane {
  id: LaneId;
  /** Full name used in headings and legends. */
  label: string;
  /** Compact name for chips and tight rails. */
  shortLabel: string;
  /** Design-system color token this lane is drawn in. */
  color: "primary" | "secondary";
  /** Decimal year the lane begins. */
  start: number;
  /** Decimal year the lane ends, or `null` while ongoing. */
  end: number | null;
}

export type EntryKind = "role" | "promotion";
export type Commitment = "full-time" | "part-time";

export interface ResumeEntry {
  id: string;
  lane: LaneId;
  role: string;
  org: string;
  /** Decimal year — 2016.42 is roughly June 2016. Used for geometry. */
  start: number;
  /** Decimal year, or `null` for the current role. */
  end: number | null;
  /** Human date range, e.g. "Jun 2016 — Sep 2018". */
  dateLabel: string;
  commitment: Commitment;
  /** `promotion` entries continue at the same org as the entry above them. */
  kind: EntryKind;
  summary: string;
  highlights: string[];
  skills: string[];
}

export type MarkerKind = "award" | "cert" | "education";

export interface ResumeMarker {
  id: string;
  lane: LaneId;
  /** Decimal year the marker sits at. */
  date: number;
  dateLabel: string;
  label: string;
  detail: string;
  kind: MarkerKind;
}

/** A narrative beat — the moments the shape of the career actually changes. */
export interface ResumeChapter {
  id: string;
  year: number;
  label: string;
  detail: string;
}

export const RESUME_LANES: ResumeLane[] = [
  {
    id: "service",
    label: "U.S. Air Force",
    shortLabel: "USAF",
    color: "secondary",
    start: 2009.6,
    end: 2019.5,
  },
  {
    id: "civilian",
    label: "Civilian Engineering",
    shortLabel: "Civilian",
    color: "primary",
    start: 2016.45,
    end: null,
  },
];

/**
 * The year the single track becomes two — the centerpiece of every variant.
 *
 * Reserve service starts a few weeks *before* the civilian job rather than the
 * same day. That is realistic, and it matters to the layouts: identical dates
 * would stack the two rail nodes on top of each other on a to-scale rail, so
 * neither could be aimed at or read separately while scrolling.
 */
export const FORK_YEAR = 2016.3;
/** The year the service track ends and the career is civilian-only again. */
export const MERGE_YEAR = 2019.5;

export const TIMELINE_START = 2009.6;
export const TIMELINE_END = 2026.75;

export const RESUME_ENTRIES: ResumeEntry[] = [
  {
    id: "usaf-apprentice",
    lane: "service",
    role: "Avionics Systems Apprentice",
    org: "U.S. Air Force",
    start: 2009.6,
    end: 2013.1,
    dateLabel: "Aug 2009 — Feb 2013",
    commitment: "full-time",
    kind: "role",
    summary:
      "Maintained and troubleshot flight-line electrical systems on a 14-aircraft fleet, working rotating shifts under a strict inspection regime.",
    highlights: [
      "Completed a two-year technical training pipeline while deployed twice.",
      "Cut average diagnostic turnaround on recurring faults from 6 hours to under 2.",
      "Wrote the shop's first shared troubleshooting reference, still in use four years later.",
    ],
    skills: ["Diagnostics", "Technical Documentation", "Process Discipline"],
  },
  {
    id: "usaf-craftsman",
    lane: "service",
    role: "Systems Craftsman, Staff Sergeant",
    org: "U.S. Air Force",
    start: 2013.1,
    end: 2016.3,
    dateLabel: "Feb 2013 — Apr 2016",
    commitment: "full-time",
    kind: "promotion",
    summary:
      "Led a six-person maintenance crew and owned the training pipeline for incoming technicians across two shops.",
    highlights: [
      "Ran onboarding and qualification for 20+ incoming technicians.",
      "Built a scheduling spreadsheet-turned-tool that eliminated a weekly manual roster rebuild.",
      "Selected for promotion two cycles early.",
    ],
    skills: ["Team Leadership", "Training Design", "Scheduling", "Automation"],
  },
  {
    id: "usaf-reserve",
    lane: "service",
    role: "Technical Sergeant, Air Force Reserve",
    org: "U.S. Air Force Reserve",
    start: 2016.3,
    end: 2019.5,
    dateLabel: "Apr 2016 — Jul 2019",
    commitment: "part-time",
    kind: "promotion",
    summary:
      "Transitioned to part-time reserve service — one weekend a month plus annual training — while starting a full-time civilian engineering career.",
    highlights: [
      "Kept full technical qualification while working a separate full-time job.",
      "Mentored four junior technicians through their upgrade training.",
      "Closed out ten years of service with an honorable discharge.",
    ],
    skills: ["Mentorship", "Time Management", "Dual-Role Operations"],
  },
  {
    id: "civ-engineer-1",
    lane: "civilian",
    role: "Software Engineer I",
    org: "Cobalt Ridge Software",
    start: 2016.45,
    end: 2018.7,
    dateLabel: "Jun 2016 — Sep 2018",
    commitment: "full-time",
    kind: "role",
    summary:
      "First civilian engineering role. Built internal tooling for a logistics platform while finishing a CS degree at night.",
    highlights: [
      "Shipped an internal admin console that replaced a manual database-editing workflow.",
      "Reduced a nightly batch job's runtime from 90 minutes to 11.",
      "Became the go-to reviewer for the team's reporting subsystem.",
    ],
    skills: ["TypeScript", "Node.js", "PostgreSQL", "Internal Tooling"],
  },
  {
    id: "civ-engineer-2",
    lane: "civilian",
    role: "Software Engineer II",
    org: "Cobalt Ridge Software",
    start: 2018.7,
    end: 2021.2,
    dateLabel: "Sep 2018 — Mar 2021",
    commitment: "full-time",
    kind: "promotion",
    summary:
      "Owned the customer-facing scheduling product end to end, from API design through frontend delivery.",
    highlights: [
      "Led the rewrite of a legacy scheduling UI used by 400+ daily operators.",
      "Introduced the team's first automated visual regression suite.",
      "Ran the on-call rotation redesign that cut after-hours pages by two thirds.",
    ],
    skills: ["React", "API Design", "Testing", "On-Call Operations"],
  },
  {
    id: "civ-senior",
    lane: "civilian",
    role: "Senior Software Engineer",
    org: "Meridian Freight Tech",
    start: 2021.2,
    end: 2024.0,
    dateLabel: "Mar 2021 — Jan 2024",
    commitment: "full-time",
    kind: "role",
    summary:
      "Joined a platform team building the internal services every product team depended on, and started drifting toward engineering enablement.",
    highlights: [
      "Designed the shared component library adopted by five product teams.",
      "Cut new-service bootstrap time from three days to twenty minutes with a generator.",
      "Mentored six engineers, three of whom were promoted within the year.",
    ],
    skills: ["Design Systems", "Platform Engineering", "Developer Experience", "Mentorship"],
  },
  {
    id: "civ-staff",
    lane: "civilian",
    role: "Staff Engineer, Platform",
    org: "Meridian Freight Tech",
    start: 2024.0,
    end: 2026.1,
    dateLabel: "Jan 2024 — Feb 2026",
    commitment: "full-time",
    kind: "promotion",
    summary:
      "Set technical direction for developer tooling across the org and built the case for a dedicated enablement function.",
    highlights: [
      "Drove a build-system migration that took CI from 22 minutes to 6.",
      "Authored the org's engineering standards, replacing a decade of tribal knowledge.",
      "Piloted AI-assisted code review across three teams before a full rollout.",
    ],
    skills: ["Technical Strategy", "Build Systems", "CI/CD", "AI Tooling"],
  },
  {
    id: "civ-manager",
    lane: "civilian",
    role: "Engineering Manager, Engineering Enablement",
    org: "Meridian Freight Tech",
    start: 2026.1,
    end: null,
    dateLabel: "Feb 2026 — Present",
    commitment: "full-time",
    kind: "promotion",
    summary:
      "Building and leading the team that makes every other engineering team faster — tooling, standards, and the guardrails that keep speed safe.",
    highlights: [
      "Stood up the enablement team from scratch: charter, hiring, and first roadmap.",
      "Shipped an internal platform now used daily by 120 engineers.",
      "Established the metrics the org uses to talk about developer productivity.",
    ],
    skills: ["Engineering Management", "Developer Enablement", "Hiring", "Strategy"],
  },
];

export const RESUME_MARKERS: ResumeMarker[] = [
  {
    id: "edu-bs",
    lane: "civilian",
    date: 2018.4,
    dateLabel: "May 2018",
    label: "B.S. Computer Science",
    detail: "Earned at night over four years while serving and working full time.",
    kind: "education",
  },
  {
    id: "award-service",
    lane: "service",
    date: 2015.3,
    dateLabel: "Apr 2015",
    label: "Air Force Commendation Medal",
    detail: "Awarded for the shop's training overhaul and sustained maintenance readiness.",
    kind: "award",
  },
  {
    id: "award-discharge",
    lane: "service",
    date: 2019.5,
    dateLabel: "Jul 2019",
    label: "Honorable Discharge",
    detail: "Ten years of combined active-duty and reserve service.",
    kind: "award",
  },
  {
    id: "cert-cloud",
    lane: "civilian",
    date: 2022.6,
    dateLabel: "Aug 2022",
    label: "Cloud Solutions Architect",
    detail: "Professional-level certification, renewed in 2025.",
    kind: "cert",
  },
];

export const RESUME_CHAPTERS: ResumeChapter[] = [
  {
    id: "chapter-enlist",
    year: 2009.6,
    label: "Enlisted",
    detail: "Active duty begins — one track, full time.",
  },
  {
    id: "chapter-fork",
    year: FORK_YEAR,
    label: "Two careers at once",
    detail:
      "Active duty ends and reserve service begins, alongside a full-time civilian engineering job. Both tracks run in parallel for three years.",
  },
  {
    id: "chapter-merge",
    year: MERGE_YEAR,
    label: "Civilian only",
    detail: "Service concludes after ten years; engineering becomes the single track.",
  },
];

export const RESUME_SKILL_GROUPS: { category: string; skills: string[] }[] = [
  {
    category: "Leadership",
    skills: ["Engineering Management", "Mentorship", "Hiring", "Technical Strategy", "Team Building"],
  },
  {
    category: "Engineering",
    skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "API Design", "Design Systems"],
  },
  {
    category: "Enablement",
    skills: ["Developer Experience", "CI/CD", "Build Systems", "Internal Tooling", "AI Tooling"],
  },
];

export const RESUME_SUMMARY =
  "Engineering leader with a decade of military service and a decade of software behind it. I build the tools, standards, and teams that let other engineers move fast without breaking things that matter.";

/* ------------------------------------------------------------------ */
/* Helpers shared across the prototypes                                */
/* ------------------------------------------------------------------ */

/** Entries sorted oldest-first, the reading order every variant uses. */
export const ENTRIES_CHRONOLOGICAL = [...RESUME_ENTRIES].sort((a, b) => a.start - b.start);

/** Entries sorted newest-first, for the variants that lead with the present. */
export const ENTRIES_REVERSE_CHRONOLOGICAL = [...RESUME_ENTRIES].sort((a, b) => b.start - a.start);

export function laneById(id: LaneId): ResumeLane {
  const lane = RESUME_LANES.find((l) => l.id === id);
  if (!lane) throw new Error(`Unknown lane: ${id}`);
  return lane;
}

/** CSS color for a lane, as a design-system token reference. */
export function laneColorVar(id: LaneId): string {
  return `var(--${laneById(id).color})`;
}

/* ------------------------------------------------------------------ */
/* Per-job colors                                                      */
/* ------------------------------------------------------------------ */

/** Civilian employers, oldest first — each gets its own hue. */
export const CIVILIAN_EMPLOYERS: string[] = ENTRIES_CHRONOLOGICAL.filter(
  (entry) => entry.lane === "civilian"
).reduce<string[]>((acc, entry) => (acc.includes(entry.org) ? acc : [...acc, entry.org]), []);

/**
 * Color for a single job.
 *
 * Service work is always the one Air Force blue — it is all the same employer,
 * so there is nothing for a second hue to distinguish. Civilian jobs take a hue
 * per employer and a shade per role within it, which is what makes a promotion
 * (same hue, different shade) read differently from a move to a new company
 * (a different hue entirely).
 *
 * Values live in `job-colors.css` so each has a light and a dark variant.
 */
export function jobColorVar(entry: ResumeEntry): string {
  if (entry.lane === "service") return "var(--job-usaf)";
  const employer = Math.max(0, CIVILIAN_EMPLOYERS.indexOf(entry.org));
  const rolesHere = ENTRIES_CHRONOLOGICAL.filter(
    (e) => e.lane === "civilian" && e.org === entry.org
  );
  const role = Math.max(0, rolesHere.findIndex((e) => e.id === entry.id));
  return `var(--job-e${Math.min(employer, 2)}-${Math.min(role, 2)}, var(--primary))`;
}

/** The employer's own hue, for legends and grouping. */
export function employerColorVar(org: string): string {
  if (!CIVILIAN_EMPLOYERS.includes(org)) return "var(--job-usaf)";
  return `var(--job-e${Math.min(CIVILIAN_EMPLOYERS.indexOf(org), 2)}-0, var(--primary))`;
}

/** True when this entry continues at the same employer as the one before it. */
export function isSameEmployerAsPrevious(entry: ResumeEntry): boolean {
  const index = ENTRIES_CHRONOLOGICAL.findIndex((e) => e.id === entry.id);
  if (index <= 0) return false;
  const previousSameLane = ENTRIES_CHRONOLOGICAL.slice(0, index)
    .filter((e) => e.lane === entry.lane)
    .pop();
  return previousSameLane?.org === entry.org;
}

/** Decimal year -> 0..1 position across the whole timeline. */
export function yearToFraction(year: number): number {
  return (year - TIMELINE_START) / (TIMELINE_END - TIMELINE_START);
}

/** An entry's end year, treating an open-ended role as running to today. */
export function entryEnd(entry: ResumeEntry): number {
  return entry.end ?? TIMELINE_END;
}

/** Whole years an entry spans, rounded for display. */
export function entryDurationYears(entry: ResumeEntry): number {
  return Math.max(1, Math.round(entryEnd(entry) - entry.start));
}

/** "4 years" / "1 year". */
export function entryDurationLabel(entry: ResumeEntry): string {
  const years = entryDurationYears(entry);
  return `${years} ${years === 1 ? "year" : "years"}`;
}

/** Markers that fall inside an entry's date range. */
export function markersWithin(entry: ResumeEntry): ResumeMarker[] {
  return RESUME_MARKERS.filter(
    (m) => m.lane === entry.lane && m.date >= entry.start && m.date < entryEnd(entry)
  );
}

/** True while both lanes are running — the overlap window. */
export function isOverlapYear(year: number): boolean {
  return year >= FORK_YEAR && year < MERGE_YEAR;
}

/** Integer year ticks across the timeline, for axes and scrubbers. */
export function yearTicks(step = 1): number[] {
  const first = Math.ceil(TIMELINE_START);
  const last = Math.floor(TIMELINE_END);
  const ticks: number[] = [];
  for (let y = first; y <= last; y += step) ticks.push(y);
  return ticks;
}
