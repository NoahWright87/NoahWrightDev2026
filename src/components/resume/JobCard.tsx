"use client";

import { Heading, Text, Pill } from "@noahwright/design";
import {
  FORK_YEAR,
  MERGE_YEAR,
  laneById,
  markersWithin,
  type ResumeEntry,
} from "@/lib/resume";
import "./job-card.css";

/** One job, as shown on the timeline stage. */
export function JobCard({ entry, color }: { entry: ResumeEntry; color: string }) {
  const markers = markersWithin(entry);
  const concurrent = entry.start >= FORK_YEAR && entry.start < MERGE_YEAR;

  return (
    <article className="jc" style={{ ["--job-color" as string]: color }}>
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
              ? "jc__commitment jc__commitment--part-time"
              : "jc__commitment"
          }
        >
          {entry.commitment}
        </span>
      </div>

      <Text>{entry.summary}</Text>

      <ul className="jc__highlights">
        {entry.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>

      {markers.length > 0 && (
        <ul className="jc__markers">
          {markers.map((marker) => (
            <li key={marker.id}>
              <strong>{marker.label}</strong> <span>{marker.dateLabel}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="jc__skills">
        {entry.skills.map((skill) => (
          <Pill key={skill} variant="default" size="small">
            {skill}
          </Pill>
        ))}
      </div>
    </article>
  );
}

export default JobCard;
