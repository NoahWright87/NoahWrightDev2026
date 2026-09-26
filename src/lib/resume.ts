/**
 * Resume content — transcribed from Noah's LinkedIn profile (Sep 2026).
 *
 * Summaries and highlights are his own words, copied verbatim rather than
 * rewritten. A few things carried over as-is and want a human pass:
 *
 * - `usaf-trainee` has no summary or highlights; that entry was cut off in the
 *   source and nothing has been invented to fill it.
 * - `signify-manager` still carries his "*More to come*" placeholder bullet.
 * - `signify-senior` runs to Sep 2025 while `signify-manager` starts Aug 2024,
 *   so the two overlap by a year on LinkedIn. Transcribed as given.
 * - LinkedIn truncates skill tags ("+7 skills"), so `skills` holds only the
 *   ones actually visible.
 * - `RESUME_SUMMARY` is the one piece of prose not taken from the profile.
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

export const RESUME_LANES: ResumeLane[] = [
  {
    id: "service",
    label: "U.S. Air Force",
    shortLabel: "USAF",
    color: "secondary",
    start: 2011.333,
    end: 2022.333,
  },
  {
    id: "civilian",
    label: "Civilian Engineering",
    shortLabel: "Civilian",
    color: "primary",
    start: 2008.5,
    end: null,
  },
];

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
    lane: "civilian",
    role: "Computer Programmer",
    org: "Art Clem Enterprises",
    start: 2008.5,
    end: 2011.333,
    dateLabel: "Jul 2008 — May 2011",
    commitment: "full-time",
    kind: "role",
    summary:
      "Hired as a temp worker, I programmed myself out of a job and became the de facto head of IT for this small company. I spent my time there automating tasks, allowing us to scale our volume of sales without a proportional increase in headcount.",
    highlights: [
      "Integrated with UPS/USPS APIs to automate carrier selection. Eliminated $30K/year of manual labor",
      "Crafted web scrapers to gather product/vendor info and implemented barcode-scanner system to improve inventory accuracy",
      "Maintained our retail website and social media accounts, producing weekly marketing videos",
      "Automated the entire business, speeding processes and reducing errors with automated double-checks",
    ],
    skills: ["Visual Basic for Applications (VBA)", "SQL"],
  },
  {
    id: "usaf-trainee",
    lane: "service",
    role: "Trainee",
    org: "United States Air Force",
    start: 2011.333,
    end: 2011.917,
    dateLabel: "May 2011 — Dec 2011",
    commitment: "full-time",
    kind: "role",
    // Cut off in the source screenshots — needs Noah's own words.
    summary: "",
    highlights: [],
    skills: [],
  },
  {
    id: "usaf-team-lead",
    lane: "service",
    role: "Software Development Team Lead",
    org: "United States Air Force",
    start: 2011.917,
    end: 2016.167,
    dateLabel: "Dec 2011 — Mar 2016",
    commitment: "full-time",
    kind: "promotion",
    summary:
      "My first USAF assignment, where I rose from individual contributor to tech lead with 3 direct reports. I managed the entire software development lifecycle from requirements gathering to final delivery -- all without a project manager, UX designer, or QA tester. We produced C# and ASP.NET modules for a DotNetNuke system that communicated with internal and external systems via a shared, on-premise service bus.",
    highlights: [
      "Resolved 262 code security vulnerabilities, including SQL injection and remote execution risks",
      "Refactored legacy code to introduce multithreaded processing, reducing 2-hour runtime to 1 minute",
      "Earned Security+ certification and safeguarded PII of thousands of USAF students",
      "Earned multiple Airman of the Quarter awards, an Air Force Achievement Medal, and was selected for a prestigious Developmental Special Duty",
    ],
    skills: ["Microsoft SQL Server", "ASP.NET"],
  },
  {
    id: "usaf-instructor",
    lane: "service",
    role: "Enlisted Professional Military Education Instructor",
    org: "United States Air Force",
    start: 2016.167,
    end: 2020.083,
    dateLabel: "Mar 2016 — Feb 2020",
    commitment: "full-time",
    kind: "promotion",
    summary:
      "I was hand-selected by leadership for this special position which involves preparing Airmen to be supervisors. I taught at the Airman Leadership School, which is a 5-week course that is required to attain the rank of Staff Sergeant and be assigned direct reports. While not a software engineering position, I still brought my coding skills to bear on the workplace, automating tasks wherever possible.",
    highlights: [
      "Wrote JavaScript/Visual Basic scripts to automate administrative duties. Increased class size 30% without adding headcount",
      "Integrated PayPal checkout, enabling 2K reservations worth >$52K. Drove paperless effort, eliminating 90% of printed material",
      "Taught leadership and public speaking skills to hundreds of Airmen and managed graduation ceremonies with hundreds in attendance",
      "We earned Team of the Quarter (Q2 2019) for pioneering a new curriculum and learning management system",
      "Awarded the Air Force Commendation Medal for contributions that improved both our school and the wider organization",
    ],
    skills: ["Teaching", "Learning Management Systems"],
  },
  {
    id: "usaf-reserve",
    lane: "service",
    role: "Non-Commissioned Officer in Charge",
    org: "US Air Force Reserve",
    start: 2020.167,
    end: 2022.333,
    dateLabel: "Mar 2020 — May 2022",
    commitment: "part-time",
    kind: "role",
    summary:
      "In 2020, I transitioned from active duty to the Reserves to settle down, be with family, and focus on programming. With my unique background, I was selected to teach the incoming personnel.",
    highlights: [
      "Taught Windows terminal, Python scripting, and public speaking fundamentals to unit's cybersecurity Airmen.",
      "Trained unit on using Splunk to investigate threats. Created script to automate creation of queries.",
      "Mentored three direct reports. Wrote performance reviews, and reported issues to leadership.",
    ],
    skills: ["Visual Basic for Applications (VBA)", "Microsoft PowerPoint"],
  },
  {
    id: "cgi",
    lane: "civilian",
    role: "Senior .NET Developer",
    org: "CGI",
    start: 2020.167,
    end: 2021.333,
    dateLabel: "Mar 2020 — May 2021",
    commitment: "full-time",
    kind: "role",
    summary:
      "I exited active duty in the USAF and joined a scrum team at a local insurance company. Our focus was on a large refactoring effort, but we were also all learning the \"new normal\" of remote work due to COVID.",
    highlights: [
      "Refactored legacy service to implement DI & automated testing. Increased code coverage from 0% to 70% in one sprint",
      "Used SonarQube to identify and correct 250+ tech debt issues. Mentored junior engineers on best practices",
      "Maintained .NET microservices that communicated with internal and external REST APIs",
      "As part of a scrum team, I demoed features, reviewed code, managed Jenkins build pipelines, and provided production support",
    ],
    skills: ["ASP.NET", "Atlassian Suite"],
  },
  {
    id: "sovereign",
    lane: "civilian",
    role: "Senior Software Developer",
    org: "Sovereign Sportsman Solutions",
    start: 2021.333,
    end: 2022.167,
    dateLabel: "May 2021 — Mar 2022",
    commitment: "full-time",
    kind: "role",
    summary:
      "As part of a remote scrum team, I built websites for local and state governments to help their citizens apply for and manage various permits. We worked closely with our government partners to gather requirements and deliver full-stack .NET solutions.",
    highlights: [
      "Developed and maintained full-stack .NET applications using C#, Entity Framework, MVC, Vue.js, and MS SQL Server",
      "Led full-stack development for new feature. Gathered requirements, designed DB schema, wrote CRUD pages",
      "Customer-centric team involved much direct interaction with our clients, gathering requirements and discussing design",
    ],
    skills: ["Microsoft Azure", "ASP.NET MVC"],
  },
  {
    id: "google",
    lane: "civilian",
    role: "Software Engineer",
    org: "Google",
    start: 2022.167,
    end: 2023.167,
    dateLabel: "Mar 2022 — Mar 2023",
    commitment: "full-time",
    kind: "role",
    summary:
      "I was invited to apply to Google after completing the Google Foobar challenge. While there, I worked on the Payments Platform, which provided tools for internal teams to make and receive payments.",
    highlights: [
      "Maintained TypeScript and closure template front ends, applying accessibility best practices.",
      "Implemented secure proxy for gRPC calls. Wrote Java code for backend microservices.",
      "Led documentation and code health effort. Improved onboarding/on-call docs and fixed flaky tests.",
    ],
    skills: ["Linux", "Java"],
  },
  {
    id: "signify-senior",
    lane: "civilian",
    role: "Senior Software Engineer",
    org: "Signify Health",
    start: 2023.167,
    end: 2025.667,
    dateLabel: "Mar 2023 — Sep 2025",
    commitment: "full-time",
    kind: "role",
    summary:
      "I joined Signify Health as a senior software engineer and worked on the Scheduling and Optimization systems at the company. We're a healthcare company that sends medical providers to our member's homes to give health assessments. My team works on scheduling those members and optimizing the routes the providers take.",
    highlights: [
      "Utilized open source OR Tools to optimize routes. Eliminated $30K/month on similar products and reduced drive times by 10%",
      "Championed flag-driven development, establishing processes and reusable packages to make flag use easier",
    ],
    skills: [],
  },
  {
    id: "signify-manager",
    lane: "civilian",
    role: "Software Engineering Manager",
    org: "Signify Health",
    start: 2024.583,
    end: null,
    dateLabel: "Aug 2024 — Present",
    commitment: "full-time",
    kind: "promotion",
    summary:
      "I was promoted to manager after contributing strongly to my first team at Signify Health. I have since managed a few teams there, with my largest including 9 direct reports. I initially continued in the Scheduling domain, am now managing the Engineering Enablement Team.",
    highlights: [
      "Engineering Enablement: Standardized SonarQube implementation, enforcing scans on all PRs and mandating stricter quality gates",
      "Engineering Enablement: *More to come*",
      "Scheduling and Optimization: Drastically improved efficiency of backend code, reducing average latency of scheduling app by 90%",
      "Scheduling and Optimization: Implemented new visit types, safety-based restrictions, and improved integration with scheduling partners",
      "Scheduling and Optimization: Contributed to overhaul of interviewing process, developing new questions and rubrics for engineer candidates",
      "Scheduling and Optimization: Led Tech Talk sessions, finding participants and sharing information with 100+ software engineers weekly",
      "Scheduling and Optimization: Improved team documentation and implemented processes to accelerate team velocity",
    ],
    skills: ["Software Management", "Engineering Management"],
  },
];

export const RESUME_MARKERS: ResumeMarker[] = [
  {
    id: "ccaf-programming",
    lane: "service",
    // LinkedIn gives the year only; placed mid-year for positioning.
    date: 2015.5,
    dateLabel: "2015",
    label: "A.S. Computer Programming",
    detail: "Community College of the Air Force.",
    kind: "education",
  },
  {
    id: "ccaf-instructional-tech",
    lane: "service",
    date: 2017.5,
    dateLabel: "2017",
    label: "A.S. Educational/Instructional Technology",
    detail: "Community College of the Air Force.",
    kind: "education",
  },
  {
    id: "trident-bs",
    lane: "service",
    date: 2019.5,
    dateLabel: "2019",
    label: "B.S. Computer Science",
    detail: "Trident University International. Summa Cum Laude.",
    kind: "education",
  },
  {
    id: "afcm",
    lane: "service",
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
    skills: ["Engineering Management", "Software Management", "Teaching", "Learning Management Systems"],
  },
  {
    category: "Engineering",
    skills: [
      "Java",
      "ASP.NET",
      "ASP.NET MVC",
      "Microsoft SQL Server",
      "SQL",
      "Visual Basic for Applications (VBA)",
    ],
  },
  {
    category: "Platform & Tools",
    skills: ["Linux", "Microsoft Azure", "Atlassian Suite", "Microsoft PowerPoint"],
  },
];

/**
 * The one piece of prose here not taken from the profile — assembled from the
 * dates above. Worth replacing with Noah's own words.
 */
export const RESUME_SUMMARY =
  "Software engineering manager at Signify Health, currently leading the Engineering Enablement team. Nearly nine years of active-duty U.S. Air Force service, then two more in the Reserve alongside a civilian engineering career.";

/* ------------------------------------------------------------------ */
/* Helpers shared across the prototypes                                */
/* ------------------------------------------------------------------ */

/** Entries sorted oldest-first, the reading order every variant uses. */
export const ENTRIES_CHRONOLOGICAL = [...RESUME_ENTRIES].sort((a, b) => a.start - b.start);

export function laneById(id: LaneId): ResumeLane {
  const lane = RESUME_LANES.find((l) => l.id === id);
  if (!lane) throw new Error(`Unknown lane: ${id}`);
  return lane;
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
  /* Clamped to the palette defined in job-colors.css. A sixth employer or a
     fourth role at one employer would reuse the last color rather than fall
     back to the theme primary — widen the palette if that happens. */
  return `var(--job-e${Math.min(employer, 4)}-${Math.min(role, 2)}, var(--primary))`;
}

/** The job a marker falls inside, so it can borrow that job's color. */
export function markerEntry(marker: ResumeMarker): ResumeEntry | undefined {
  return ENTRIES_CHRONOLOGICAL.find(
    (entry) =>
      entry.lane === marker.lane &&
      marker.date >= entry.start &&
      marker.date < entryEnd(entry)
  );
}

/** Decimal year -> 0..1 position across the whole timeline. */
export function yearToFraction(year: number): number {
  return (year - TIMELINE_START) / (TIMELINE_END - TIMELINE_START);
}

/** An entry's end year, treating an open-ended role as running to today. */
export function entryEnd(entry: ResumeEntry): number {
  return entry.end ?? TIMELINE_END;
}

/** Markers that fall inside an entry's date range. */
export function markersWithin(entry: ResumeEntry): ResumeMarker[] {
  return RESUME_MARKERS.filter(
    (m) => m.lane === entry.lane && m.date >= entry.start && m.date < entryEnd(entry)
  );
}
