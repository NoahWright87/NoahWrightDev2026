/**
 * Resume content — originally transcribed from Noah's LinkedIn profile (Sep
 * 2026), then tightened into short scope lines and impact-first bullets. Every
 * number is his; none were added in the rewrite.
 *
 * Still wanting a human pass:
 *
 * - Several roles still want numbers Noah hasn't dug up yet; see
 *   `src/app/resume/resume.todo.md`.
 * - LinkedIn had `signify-senior` running to Sep 2025, overlapping the manager
 *   role by a year. It now ends at the Aug 2024 promotion.
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

export type MarkerKind = "award" | "cert" | "education";

export interface ResumeMarker {
  id: string;
  track: TrackId;
  /** Decimal year the marker sits at. */
  date: number;
  dateLabel: string;
  label: string;
  detail: string;
  kind: MarkerKind;
}

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
    summary:
      "Hired as a temp; automated my own job away and became the de facto head of IT for a small retail business.",
    highlights: [
      "Cut $30K/year of manual labor by integrating UPS/USPS APIs to pick carriers automatically",
      "Scaled sales volume without adding headcount by automating order processing end to end, with built-in double-checks to catch errors",
      "Improved inventory accuracy with a barcode-scanner system and web scrapers for product and vendor data",
      "Ran the retail website and social media, producing a marketing video every week",
    ],
    skills: ["Visual Basic for Applications (VBA)", "SQL", "Web Scraping"],
  },
  {
    id: "usaf-trainee",
    track: 1,
    role: "Trainee",
    org: "United States Air Force",
    start: 2011.333,
    end: 2011.917,
    dateLabel: "May 2011 — Dec 2011",
    commitment: "full-time",
    kind: "role",
    summary:
      "Enlisted in the Air Force and completed Basic Military Training and technical school.",
    highlights: [],
    skills: [],
    colorGroup: "U.S. Air Force",
  },
  {
    id: "usaf-team-lead",
    track: 1,
    role: "Software Development Team Lead",
    org: "United States Air Force",
    start: 2011.917,
    end: 2016.167,
    dateLabel: "Dec 2011 — Mar 2016",
    commitment: "full-time",
    kind: "promotion",
    summary:
      "Rose from developer to tech lead of 3, owning the full lifecycle of C#/ASP.NET modules with no PM, designer or QA.",
    highlights: [
      "Fixed 262 security vulnerabilities, including SQL injection and remote code execution",
      "Cut a 2-hour batch job to 1 minute by refactoring legacy code for multithreading",
      "Safeguarded the PII of thousands of students; earned Security+ certification",
      "Earned multiple Airman of the Quarter awards and an Air Force Achievement Medal",
    ],
    skills: ["C#", "ASP.NET", "Microsoft SQL Server"],
    colorGroup: "U.S. Air Force",
  },
  {
    id: "usaf-instructor",
    track: 1,
    role: "Enlisted Professional Military Education Instructor",
    org: "United States Air Force",
    start: 2016.167,
    end: 2020.083,
    dateLabel: "Mar 2016 — Feb 2020",
    commitment: "full-time",
    kind: "promotion",
    summary:
      "Hand-picked to teach Airman Leadership School, the 5-week course that prepares Airmen to supervise.",
    highlights: [
      "Automated administrative work with JavaScript and VBA, growing class size 30% without adding staff",
      "Integrated PayPal checkout for 2K reservations worth $52K+ and cut printed material 90%",
      "Taught leadership and public speaking to hundreds of Airmen",
      "Earned Team of the Quarter (Q2 2019) for a new curriculum and learning management system",
    ],
    skills: ["Teaching", "Public Speaking", "Learning Management Systems"],
    colorGroup: "U.S. Air Force",
  },
  {
    id: "usaf-reserve",
    track: 1,
    role: "Non-Commissioned Officer in Charge",
    org: "US Air Force Reserve",
    start: 2020.167,
    end: 2022.333,
    dateLabel: "Mar 2020 — May 2022",
    commitment: "part-time",
    kind: "role",
    summary:
      "Part-time Reserve service alongside a civilian engineering career, training the unit's incoming cybersecurity Airmen.",
    highlights: [
      "Mentored 3 direct reports and wrote their performance reviews",
      "Taught Windows terminal, Python scripting and public speaking to the unit's cybersecurity Airmen",
      "Trained the unit on Splunk threat hunting and scripted the creation of its queries",
    ],
    skills: ["Python", "Splunk"],
    colorGroup: "U.S. Air Force",
  },
  {
    id: "cgi",
    track: 2,
    role: "Senior .NET Developer",
    org: "CGI",
    start: 2020.167,
    end: 2021.333,
    dateLabel: "Mar 2020 — May 2021",
    commitment: "full-time",
    kind: "role",
    summary: "Scrum team on a large refactoring effort for an insurance client, remote from the start of COVID.",
    highlights: [
      "Raised code coverage from 0% to 70% in one sprint by refactoring a legacy service for dependency injection and automated tests",
      "Fixed 250+ tech-debt issues found by SonarQube; mentored junior engineers on best practices",
      "Maintained .NET microservices integrating internal and external REST APIs",
      "Ran Jenkins pipelines, reviewed code, demoed features and covered production support",
    ],
    skills: ["C#", "ASP.NET", "Jenkins", "SonarQube"],
  },
  {
    id: "sovereign",
    track: 2,
    role: "Senior Software Developer",
    org: "Sovereign Sportsman Solutions",
    start: 2021.333,
    end: 2022.167,
    dateLabel: "May 2021 — Mar 2022",
    commitment: "full-time",
    kind: "role",
    summary: "Built permit-management sites for state and local governments on a remote scrum team.",
    highlights: [
      "Led full-stack delivery of a new feature: requirements, database schema and CRUD pages",
      "Built and maintained full-stack apps in C#, Entity Framework, MVC, Vue.js and SQL Server",
      "Gathered requirements and reviewed designs directly with government clients",
    ],
    skills: ["C#", "ASP.NET MVC", "Vue.js", "Microsoft Azure"],
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
    summary:
      "Full-stack engineer on the Payments Platform that lets Google's internal teams send and receive money. Joined by invitation after solving Google's Foobar challenge.",
    highlights: [
      "Built a secure proxy for gRPC calls and Java backend microservices",
      "Improved accessibility of TypeScript and Closure Templates front ends",
      "Led the team's code-health effort: improved onboarding and on-call docs and fixed flaky tests",
    ],
    skills: ["Java", "TypeScript", "gRPC", "Linux"],
  },
  {
    id: "signify-senior",
    track: 2,
    role: "Senior Software Engineer",
    org: "Signify Health",
    start: 2023.167,
    end: 2024.583,
    dateLabel: "Mar 2023 — Aug 2024",
    commitment: "full-time",
    kind: "role",
    summary:
      "Scheduling and route optimization for a healthcare company that sends clinicians to members' homes.",
    highlights: [
      "Saved $30K/month by replacing a paid routing product with open-source Google OR-Tools, cutting clinician drive times 10%",
      "Championed flag-driven development, building the processes and reusable packages that made feature flags easy to adopt",
    ],
    skills: ["Google OR-Tools", "Feature Flags"],
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
    summary:
      "Promoted to manage the Scheduling team of 9 software engineers.",
    highlights: [
      "Cut average latency of the scheduling app 90% by reworking inefficient backend code",
      "Shipped new visit types and safety-based restrictions, and tightened integration with scheduling partners",
      "Redesigned engineering interviews with new questions and scoring rubrics",
    ],
    skills: ["Engineering Management", "Hiring"],
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
    summary:
      "Stood up and lead a 5-person team that raises the bar for Signify's 30+ engineering teams, using AI agents to scale a small team to a whole org.",
    highlights: [
      "Launched AI coding agents, now in 100+ repos, that automate much of the SDLC, from refining issues to opening tested pull requests",
      "Built an engineering metrics dashboard tracking DORA metrics and velocity over time, with data from Jira, GitHub and SonarQube",
      "Raised the quality bar org-wide: SonarQube quality gates on every PR, plus vulnerability and code-ownership checks rolling out with SRE and QE",
      "Own the shared libraries every team builds on, including Kafka pub/sub, logging and feature flags",
    ],
    skills: ["Engineering Management", "AI Agents", "DORA Metrics", "Developer Productivity", "Kafka"],
  },
];

export const RESUME_MARKERS: ResumeMarker[] = [
  {
    id: "ccaf-programming",
    track: 1,
    // LinkedIn gives the year only; placed mid-year for positioning.
    date: 2015.5,
    dateLabel: "2015",
    label: "A.S. Computer Programming",
    detail: "Community College of the Air Force.",
    kind: "education",
  },
  {
    id: "ccaf-instructional-tech",
    track: 1,
    date: 2017.5,
    dateLabel: "2017",
    label: "A.S. Educational/Instructional Technology",
    detail: "Community College of the Air Force.",
    kind: "education",
  },
  {
    id: "trident-bs",
    track: 1,
    date: 2019.5,
    dateLabel: "2019",
    label: "B.S. Computer Science",
    detail: "Trident University International. Summa Cum Laude.",
    kind: "education",
  },
  {
    id: "afcm",
    track: 1,
    date: 2020.0,
    dateLabel: "2020",
    label: "Air Force Commendation Medal",
    detail:
      "Awarded for contributions that improved both the Airman Leadership School and the wider organization.",
    kind: "award",
  },
];

export const RESUME_SKILL_GROUPS: { category: string; skills: string[] }[] = [
  {
    category: "Leadership",
    skills: [
      "Engineering Management",
      "Developer Productivity",
      "DORA Metrics",
      "AI Agents",
      "Hiring",
      "Teaching",
      "Public Speaking",
    ],
  },
  {
    category: "Engineering",
    skills: [
      "C#",
      "ASP.NET",
      "Java",
      "TypeScript",
      "Vue.js",
      "Python",
      "SQL",
      "Microsoft SQL Server",
      "gRPC",
      "Kafka",
      "Google OR-Tools",
      "Feature Flags",
    ],
  },
  {
    category: "Platform & Tools",
    skills: ["GitHub Actions", "SonarQube", "Jenkins", "Microsoft Azure", "Splunk", "Linux", "Atlassian Suite"],
  },
];

/** The one line of prose at the top of the page. Worth Noah's own pass. */
export const RESUME_SUMMARY =
  "Leading Signify Health's Engineering Enablement team since August 2025, using AI agents to let a 5-person team serve 30+ engineering teams. Previously managed Signify's Scheduling team and engineered payments at Google, after nine years of active-duty U.S. Air Force service and two in the Reserve.";

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

/** Markers that fall inside an entry's date range. */
export function markersWithin(entry: ResumeEntry): ResumeMarker[] {
  return RESUME_MARKERS.filter(
    (m) => m.track === entry.track && m.date >= entry.start && m.date < entryEnd(entry)
  );
}
