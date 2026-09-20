"use client";

/**
 * TEMPORARY — the job card shared by the pinned-rail prototypes
 * (`/resume6`–`/resume8`). Kept in one place so the three pages differ only in
 * how cards are revealed, never in what a card looks like.
 */

import { Heading, Text, Pill } from "@noahwright/design";
import {
  FORK_YEAR,
  MERGE_YEAR,
  laneById,
  laneColorVar,
  markersWithin,
  type ResumeEntry,
} from "@/lib/resumeDemo";
import "./job-card.css";

export function JobCard({
  entry,
  compact = false,
}: {
  entry: ResumeEntry;
  /** Trims the card to its header — used for the second card in a tight pair. */
  compact?: boolean;
}) {
  const markers = markersWithin(entry);
  const concurrent = entry.start >= FORK_YEAR && entry.start < MERGE_YEAR;

  return (
    <article
      className={compact ? "jc jc--compact" : "jc"}
      style={{ ["--lane-color" as string]: laneColorVar(entry.lane) }}
    >
      <div className="jc__top">
        <span className="jc__lane">{laneById(entry.lane).label}</span>
        {concurrent && <span className="jc__concurrent">both careers</span>}
      </div>

      <Heading level={3}>{entry.role}</Heading>
      <p className="jc__org">{entry.org}</p>

      <div className="jc__meta">
        <span className="jc__date">{entry.dateLabel}</span>
        <span
          className={
            entry.commitment === "part-time"
              ? "vres-commitment vres-commitment--part-time"
              : "vres-commitment"
          }
        >
          {entry.commitment}
        </span>
      </div>

      <div className="jc__body">
        <Text>{entry.summary}</Text>

        <ul className="vres-highlights">
          {entry.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>

        {markers.length > 0 && (
          <ul className="jc__markers">
            {markers.map((m) => (
              <li key={m.id}>
                <strong>{m.label}</strong> <span>{m.dateLabel}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="vres-skills">
          {entry.skills.map((skill) => (
            <Pill key={skill} variant="default" size="small">
              {skill}
            </Pill>
          ))}
        </div>
      </div>
    </article>
  );
}

export default JobCard;
