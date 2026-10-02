/**
 * Resume content. Facts and voice come from Noah's one-page resume (Google Doc,
 * Sep 2026) and his LinkedIn profile; the page runs a little longer than the
 * one-pager but keeps its style: short, punchy, number-first, no novels.
 *
 * Copy rules: lead with a strong verb or a number, keep a summary to one line,
 * and never invent a metric. Anything still wanting Noah's numbers is listed in
 * `src/app/resume/resume.todo.md`.
 */

/**
 * Which parallel line of the timeline a job sits on. 1 is the leftmost.
 *
 * Deliberately a number rather than a name: a second track is just "another
 * job running at the same time", whatever kind of job it is. It is never shown
 * to the reader — the rail's two lines and the per-job colors already say which
 * is which. The geometry currently draws two tracks; the model allows any
 * number.
 */
export type TrackId = number;

/** The track a job runs on unless it is concurrent with another. */
export const PRIMARY_TRACK: TrackId = 1;

export type EntryKind = "role" | "promotion";
export type Commitment = "full-time" | "part-time";

export interface ResumeEntry {
  id: string;
  track: TrackId;
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
  /**
   * Jobs sharing a color group share a hue. Defaults to `org`; set it where one
   * employer appears under more than one name, so the timeline does not read
   * that as a move to a different company.
   */
  colorGroup?: string;
}

export type MarkerKind = "award" | "cert" | "education" | "training";

/**
 * An award, degree, course or certification. On the rail it is a short branch
 * off the job it happened during; on the stage it gets a card of its own.
 */
export interface ResumeMarker {
  id: string;
  /** The lane it branches off — the job it happened during. */
  track: TrackId;
  /** Decimal year the marker sits at. */
  date: number;
  dateLabel: string;
  label: string;
  /** Shorter name for its tab, where `label` is long. */
  short?: string;
  /** Who awarded or granted it. */
  issuer?: string;
  /** One or two lines, written for a civilian reader. */
  detail: string;
  /** Distinctions such as "Summa cum laude · 3.97 GPA". */
  honors?: string;
  /** The certificate itself, under `public/`. */
  href?: string;
  kind: MarkerKind;
}

export const MARKER_KIND_LABEL: Record<MarkerKind, string> = {
  award: "Award",
  cert: "Certification",
  education: "Degree",
  training: "Training",
};

/**
 * March 2020 — leaving active duty, joining the Reserve and starting at CGI all
 * happen the same month, so this is where the single track becomes two.
 */
export const FORK_YEAR = 2020.167;
/** May 2022 — Reserve service ends and the career is civilian-only again. */
export const MERGE_YEAR = 2022.333;

export const TIMELINE_START = 2008.5;
export const TIMELINE_END = 2026.75;

export const RESUME_ENTRIES: ResumeEntry[] = [
  {
    id: "art-clem",
    track: 2,
    role: "Computer Programmer",
    org: "Art Clem Enterprises",
    start: 2008.5,
    end: 2011.333,
    dateLabel: "Jul 2008 — May 2011",
    commitment: "full-time",
    kind: "role",
    summary: "Hired as a temp; automated my way into being the de facto head of IT.",
    highlights: [
      "Integrated UPS/USPS APIs to auto-select carriers, eliminating $30K/yr of manual labor",
      "Automated order processing end to end, scaling sales without adding headcount",
      "Built web scrapers and a barcode-scanner system to keep inventory accurate",
      "Ran the retail site and social media, shipping a marketing video every week",
    ],
    skills: ["Visual Basic for Applications (VBA)", "SQL", "Web Scraping"],
  },
  {
    /* Covers basic and technical training too (May–Dec 2011), the way Noah's
       one-pager does; a separate trainee card had nothing to say. */
    id: "usaf-programmer",
    track: 1,
    role: "Programmer & Team Lead, Air University",
    org: "U.S. Air Force",
    start: 2011.333,
    end: 2016.167,
    dateLabel: "May 2011 — Mar 2016",
    commitment: "full-time",
    kind: "role",
    summary:
      "Enlisted, then rose from programmer to lead of 3 — owning the whole lifecycle with no PM, designer or QA.",
    highlights: [
      "Found 190+ critical vulnerabilities and fixed 72 coding flaws, securing $1M in databases",
      "Led a framework upgrade of the student information system: 645K lines of legacy code",
      "Cut class archiving from 2+ hours to under a minute",
      "Saved $220K+ by purging inactive LMS accounts to free up licenses",
    ],
    skills: ["C#", "ASP.NET", "Microsoft SQL Server"],
    colorGroup: "U.S. Air Force",
  },
  {
    id: "usaf-instructor",
    track: 1,
    role: "Instructor, Airman Leadership School",
    org: "U.S. Air Force",
    start: 2016.167,
    end: 2020.083,
    dateLabel: "Mar 2016 — Feb 2020",
    commitment: "full-time",
    kind: "promotion",
    summary: "Hand-picked to teach the 5-week course that prepares Airmen to supervise.",
    highlights: [
      "Delivered 4,032 hours of curriculum; 315 graduates earned 2,844 college credits",
      "Beta-tested the largest overhaul of Air Force supervisor training in 20 years ($10M); it developed 16,000 Airmen and won us Team of the Quarter (Q2 2018)",
      "Researched and rolled out Canvas LMS, later adopted by 67 schoolhouses",
      "Automated instructor duties with JS/VBA scripts, enabling 30% larger classes",
    ],
    skills: ["Teaching", "Public Speaking", "JavaScript", "VBA"],
    colorGroup: "U.S. Air Force",
  },
  {
    id: "usaf-reserve",
    track: 1,
    role: "Manager & Trainer, Cybersecurity Unit",
    org: "U.S. Air Force Reserve",
    start: 2020.167,
    end: 2022.333,
    dateLabel: "Mar 2020 — May 2022",
    commitment: "part-time",
    kind: "role",
    summary: "Part-time Reserve service alongside a civilian engineering career.",
    highlights: [
      "Managed 3 direct reports: performance reviews, disciplinary plans, career mentorship",
      "Taught Windows/Linux terminal, Python scripting and public speaking",
      "Automated Splunk query-writing for the unit's threat hunting",
    ],
    skills: ["Python", "Splunk", "Linux"],
    colorGroup: "U.S. Air Force",
  },
  {
    id: "cgi",
    track: 2,
    role: "Software Engineer",
    org: "CGI",
    start: 2020.167,
    end: 2021.333,
    dateLabel: "Mar 2020 — May 2021",
    commitment: "full-time",
    kind: "role",
    summary: "Scrum team refactoring an insurance platform — remote from the first month of COVID.",
    highlights: [
      "Led the automated testing effort: inverted a legacy service's dependencies, raising coverage 0% ⇒ 70% in one sprint",
      "Fixed 250+ tech-debt issues flagged by SonarQube; mentored junior engineers",
      "Ran Jenkins pipelines, reviewed code and covered prod support for .NET microservices",
    ],
    skills: ["C#", "ASP.NET", "Jenkins", "SonarQube"],
  },
  {
    id: "sovereign",
    track: 2,
    role: "Senior Software Engineer",
    org: "Sovereign Sportsman Solutions",
    start: 2021.333,
    end: 2022.167,
    dateLabel: "May 2021 — Mar 2022",
    commitment: "full-time",
    kind: "role",
    summary: "Full-stack .NET for government permitting web apps.",
    highlights: [
      "Led a new feature end to end: requirements, DB schema, CRUD pages",
      "Built with C#, Entity Framework, Kendo UI, Vue.js and SQL Server",
      "Worked directly with government clients on requirements and design",
    ],
    skills: ["C#", "Entity Framework", "Vue.js", "Kendo UI"],
  },
  {
    id: "google",
    track: 2,
    role: "Software Engineer",
    org: "Google",
    start: 2022.167,
    end: 2023.167,
    dateLabel: "Mar 2022 — Mar 2023",
    commitment: "full-time",
    kind: "role",
    summary: "Payments Platform, which moves money for Google's internal teams. Recruited via the Foobar challenge.",
    highlights: [
      "Maintained Java gRPC microservices, a TypeScript frontend and the SQL database behind the platform",
      "Built a secure proxy for gRPC calls",
      "Led a code-health push: fixed flaky tests, improved onboarding and on-call docs",
    ],
    skills: ["Java", "gRPC", "TypeScript", "SQL"],
  },
  {
    id: "signify-senior",
    track: 2,
    role: "Senior Software Engineer, Scheduling",
    org: "Signify Health",
    start: 2023.167,
    end: 2024.583,
    dateLabel: "Mar 2023 — Aug 2024",
    commitment: "full-time",
    kind: "role",
    summary: "Scheduling and routing for clinicians who visit members at home.",
    highlights: [
      "Built a route optimization service on open-source OR-Tools, replacing a GCP service: $30K/mo saved, 10% less drive time",
      "Drove feature flag adoption with a LaunchDarkly wrapper, enabling phased rollouts and reducing MTTR",
    ],
    skills: ["Google OR-Tools", "LaunchDarkly", "Feature Flags"],
  },
  {
    id: "signify-manager",
    track: 2,
    role: "Software Engineering Manager, Scheduling",
    org: "Signify Health",
    start: 2024.583,
    end: 2025.583,
    dateLabel: "Aug 2024 — Aug 2025",
    commitment: "full-time",
    kind: "promotion",
    summary: "Promoted to lead the 9-SWE Scheduling team.",
    highlights: [
      "Cut web app latency 90% (minutes ⇒ seconds): found the cause, coordinated fixes across repos and teams",
      "Eliminated near-daily alerts by directing the team to harden code while on call",
      "Unified support intake for 6+ teams, giving the visibility to prioritize bug fixes",
    ],
    skills: ["Engineering Management", "On-Call", "Performance Tuning"],
  },
  {
    id: "signify-enablement",
    track: 2,
    role: "Software Engineering Manager, Engineering Enablement",
    org: "Signify Health",
    start: 2025.583,
    end: null,
    dateLabel: "Aug 2025 — Present",
    commitment: "full-time",
    kind: "promotion",
    summary: "Stood up the team that sets standards and owns shared tooling for 30+ engineering teams.",
    highlights: [
      "Automated the SDLC with a fleet of AI agents: POC to 100+ repos in 6 months, now merging 700+ PRs a month",
      "Led 4 SWEs; partnered with Principals and SRE to set org-wide standards",
      "Built an engineering metrics dashboard tracking DORA metrics and velocity",
      "Hands-on EM: surveyed users, ran the backlog, hired, mentored, reviewed and shipped code",
    ],
    skills: ["Engineering Management", "AI Agents", "DORA Metrics", "Developer Productivity"],
  },
];

/*
 * Newest first, matching the page. Several are dated to the year only; the
 * month is picked just to place them on the rail, spread out where a year has
 * more than one.
 */
export const RESUME_MARKERS: ResumeMarker[] = [
  {
    id: "sejpme",
    track: 1,
    date: 2021.7,
    dateLabel: "2021",
    label: "SEJPME I",
    issuer: "Joint Staff",
    detail: "Senior Enlisted Joint Professional Military Education: how the services plan and work together.",
    kind: "training",
  },
  {
    id: "nco-academy",
    track: 1,
    date: 2021.3,
    dateLabel: "2021",
    label: "NCO Academy",
    issuer: "U.S. Air Force",
    detail: "The Air Force's leadership school for mid-level supervisors.",
    kind: "training",
  },
  {
    id: "afcm",
    track: 1,
    date: 2020.05,
    dateLabel: "Feb 2020",
    label: "Air Force Commendation Medal",
    short: "Commendation Medal",
    issuer: "42d Force Support Squadron",
    detail:
      "For four years teaching Airman Leadership School: 4,032 hours of curriculum, 315 graduates, and Canvas LMS adopted by 67 schoolhouses.",
    href: "/documents/wright-afcm-2020.pdf",
    kind: "award",
  },
  {
    id: "trident-bs",
    track: 1,
    date: 2019.5,
    dateLabel: "2019",
    label: "B.S. Computer Science",
    issuer: "Trident University International",
    detail: "Earned online while teaching full time.",
    honors: "Summa cum laude · 3.97 GPA",
    kind: "education",
  },
  {
    id: "ccaf-instructional-tech",
    track: 1,
    date: 2017.5,
    dateLabel: "2017",
    label: "A.S. Instructor of Technology & Military Science",
    short: "A.S. Instructional Tech",
    issuer: "Community College of the Air Force",
    detail: "The Air Force's accredited community college.",
    kind: "education",
  },
  {
    id: "nco-of-the-quarter",
    track: 1,
    date: 2016.917,
    dateLabel: "Dec 2016",
    label: "NCO of the Quarter",
    detail: "Picked as the unit's top mid-level enlisted leader for the quarter.",
    kind: "award",
  },
  {
    id: "epme-instructor-course",
    track: 1,
    date: 2016.35,
    dateLabel: "2016",
    label: "EPME Instructor Course",
    issuer: "U.S. Air Force",
    detail: "Certifies instructors for the Air Force's enlisted leadership schools.",
    kind: "training",
  },
  {
    id: "afam",
    track: 1,
    date: 2016.1,
    dateLabel: "Feb 2016",
    label: "Air Force Achievement Medal",
    short: "Achievement Medal",
    issuer: "Air University",
    detail:
      "For four years as a programmer: 190+ critical vulnerabilities found, a 645K-line framework upgrade, and $220K+ saved.",
    href: "/documents/wright-afam-2016.pdf",
    kind: "award",
  },
  {
    id: "airman-of-the-year",
    track: 1,
    date: 2015.917,
    dateLabel: "2015",
    label: "Airman of the Year",
    issuer: "Headquarters Air University",
    detail: "Named the headquarters' top junior enlisted Airman for the year.",
    kind: "award",
  },
  {
    id: "security-plus",
    track: 1,
    date: 2015.7,
    dateLabel: "2015",
    label: "CompTIA Security+",
    short: "Security+",
    issuer: "CompTIA",
    detail: "Industry-standard security certification, required for the role.",
    kind: "cert",
  },
  {
    id: "ccaf-cs-tech",
    track: 1,
    date: 2015.45,
    dateLabel: "2015",
    label: "A.S. Computer Science Technology",
    short: "A.S. CS Technology",
    issuer: "Community College of the Air Force",
    detail: "The Air Force's accredited community college.",
    kind: "education",
  },
  {
    id: "als",
    track: 1,
    date: 2015.2,
    dateLabel: "2015",
    label: "Airman Leadership School",
    issuer: "U.S. Air Force",
    detail: "The 5-week course every Airman takes before supervising others. I went on to teach it.",
    kind: "training",
  },
  {
    id: "airman-of-the-quarter",
    track: 1,
    date: 2013.917,
    dateLabel: "Q4 2013",
    label: "Airman of the Quarter",
    issuer: "Headquarters Air University",
    detail: "Named the headquarters' top junior enlisted Airman for the quarter.",
    kind: "award",
  },
];

/** The line at the top of the page, after the tagline on Noah's one-pager. */
export const RESUME_SUMMARY =
  "Engineering manager with 15+ years in software, remote since 2020. Ex-Googler and U.S. Air Force vet, now leading Engineering Enablement at Signify Health.";

/* ------------------------------------------------------------------ */
/* Helpers shared across the prototypes                                */
/* ------------------------------------------------------------------ */

/** Entries sorted oldest-first. Colors and concurrency are worked out on this. */
export const ENTRIES_CHRONOLOGICAL = [...RESUME_ENTRIES].sort((a, b) => a.start - b.start);

/** Entries sorted newest-first — the order the page reads in. */
export const ENTRIES_NEWEST_FIRST = [...ENTRIES_CHRONOLOGICAL].reverse();

/* ------------------------------------------------------------------ */
/* Per-job colors                                                      */
/* ------------------------------------------------------------------ */

/** What a job is colored by: its employer, or an explicit shared group. */
function colorGroupOf(entry: ResumeEntry): string {
  return entry.colorGroup ?? entry.org;
}

/** Color groups, oldest first — each gets its own hue. */
export const COLOR_GROUPS: string[] = ENTRIES_CHRONOLOGICAL.reduce<string[]>(
  (acc, entry) => {
    const group = colorGroupOf(entry);
    return acc.includes(group) ? acc : [...acc, group];
  },
  []
);

/**
 * Color for a single job: a hue per color group, a shade per role within it.
 * That is what makes a promotion (same hue, different shade) read differently
 * from a move to a new company (a different hue entirely).
 *
 * Values live in `job-colors.css` so each has a light and a dark variant. Only
 * groups that need a given shade have to define it — the fallback chain drops
 * back to the group's base color rather than to the theme primary, so an extra
 * role never shows up as an unrelated hue.
 */
export function jobColorVar(entry: ResumeEntry): string {
  const group = colorGroupOf(entry);
  const groupIndex = Math.max(0, COLOR_GROUPS.indexOf(group));
  const rolesHere = ENTRIES_CHRONOLOGICAL.filter((e) => colorGroupOf(e) === group);
  const role = Math.max(0, rolesHere.findIndex((e) => e.id === entry.id));
  /* Clamped to the palette defined in job-colors.css; widen it rather than let
     two groups share a hue. */
  const g = Math.min(groupIndex, 5);
  const shade = Math.min(role, 3);
  return `var(--job-e${g}-${shade}, var(--job-e${g}-0, var(--primary)))`;
}

/**
 * Milestones close together in time, drawn as one node on the rail and shown
 * as tabs on one card. Without grouping, the six from 2015–16 sit a few pixels
 * apart on a to-scale rail and bleed together.
 */
export interface MilestoneGroup {
  id: string;
  track: TrackId;
  /** Oldest first. */
  markers: ResumeMarker[];
  start: number;
  end: number;
}

/** Milestones on one lane this close (in years) to the previous share a group. */
const GROUP_GAP = 0.45;

export const MILESTONE_GROUPS: MilestoneGroup[] = (() => {
  const sorted = [...RESUME_MARKERS].sort((a, b) => a.track - b.track || a.date - b.date);
  const groups: MilestoneGroup[] = [];
  for (const marker of sorted) {
    const last = groups[groups.length - 1];
    if (last && last.track === marker.track && marker.date - last.end <= GROUP_GAP) {
      last.markers.push(marker);
      last.end = marker.date;
    } else {
      groups.push({
        id: marker.id,
        track: marker.track,
        markers: [marker],
        start: marker.date,
        end: marker.date,
      });
    }
  }
  return groups;
})();

/** The job a marker falls inside, so it can borrow that job's color. */
export function markerEntry(marker: ResumeMarker): ResumeEntry | undefined {
  return ENTRIES_CHRONOLOGICAL.find(
    (entry) =>
      entry.track === marker.track &&
      marker.date >= entry.start &&
      marker.date < entryEnd(entry)
  );
}

/**
 * Decimal year -> 0..1 position down the timeline. Newest-first, so today is 0
 * and the start of the career is 1.
 */
export function yearToFraction(year: number): number {
  return (TIMELINE_END - year) / (TIMELINE_END - TIMELINE_START);
}

/** An entry's end year, treating an open-ended role as running to today. */
export function entryEnd(entry: ResumeEntry): number {
  return entry.end ?? TIMELINE_END;
}
