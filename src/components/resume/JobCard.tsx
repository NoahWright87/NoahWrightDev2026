"use client";

import { Heading, Text, Pill } from "@noahwright/design";
import { markersWithin, trackLabel, type ResumeEntry } from "@/lib/resume";
import "./job-card.css";

/** One job, as shown on the timeline stage. */
export function JobCard({
  entry,
  color,
  showTrack = false,
}: {
  entry: ResumeEntry;
  color: string;
  /**
   * Name the track this job runs on. Only worth saying while another job is
   * running alongside it — otherwise there is only one line to be on.
   */
  showTrack?: boolean;
}) {
  const markers = markersWithin(entry);
  /* Full-time is the default and says nothing; part-time is the exception and
     is the whole reason a job can share a stretch of the timeline. */
  const showCommitment = entry.commitment !== "full-time";

  return (
    <article className="jc" style={{ ["--job-color" as string]: color }}>
      {showTrack && <span className="jc__track">{trackLabel(entry.track)}</span>}

      <Heading level={3}>{entry.role}</Heading>
      <p className="jc__org">{entry.org}</p>

      <div className="jc__meta">
        <span className="jc__date">{entry.dateLabel}</span>
        {showCommitment && <span className="jc__commitment">{entry.commitment}</span>}
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
