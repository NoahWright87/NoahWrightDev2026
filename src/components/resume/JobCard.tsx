"use client";

import { Heading, Text, Pill } from "@noahwright/design";
import type { ResumeEntry } from "@/lib/resume";
import "./job-card.css";

/** One job, as shown on the timeline stage. */
export function JobCard({ entry, color }: { entry: ResumeEntry; color: string }) {
  /* Full-time is the default and says nothing; part-time is the exception and
     is the whole reason a job can share a stretch of the timeline. */
  const showCommitment = entry.commitment !== "full-time";

  return (
    <article className="jc" style={{ ["--job-color" as string]: color }}>
      <Heading level={2}>{entry.role}</Heading>
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
