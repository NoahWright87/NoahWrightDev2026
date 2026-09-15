"use client";

/**
 * TEMPORARY prototype — `/resume2`, "Parallel Tracks".
 *
 * Two real content columns: service on the left, civilian on the right, with a
 * year spine between them. Entries that start at the same moment share a row,
 * so the June 2016 transition literally sits side by side. Collapses to one
 * chronological column on narrow screens, where lane identity is carried by a
 * colored edge and a chip instead of by position.
 */

import * as React from "react";
import { Container, Heading, Text, Pill } from "@noahwright/design";
import { VariantShell } from "./VariantChrome";
import {
  ENTRIES_CHRONOLOGICAL,
  FORK_YEAR,
  MERGE_YEAR,
  laneById,
  laneColorVar,
  markersWithin,
  type ResumeEntry,
} from "@/lib/resumeDemo";
import "./parallel-tracks.css";

interface TrackRow {
  key: string;
  year: number;
  service: ResumeEntry | null;
  civilian: ResumeEntry | null;
}

/** Entries starting within a few months of each other share a row. */
function buildRows(): TrackRow[] {
  const rows: TrackRow[] = [];
  for (const entry of ENTRIES_CHRONOLOGICAL) {
    const last = rows[rows.length - 1];
    const slotFree = last && last[entry.lane] === null;
    if (last && slotFree && Math.abs(entry.start - last.year) < 0.6) {
      last[entry.lane] = entry;
      continue;
    }
    rows.push({
      key: entry.id,
      year: entry.start,
      service: entry.lane === "service" ? entry : null,
      civilian: entry.lane === "civilian" ? entry : null,
    });
  }
  return rows;
}

function yearLabel(year: number): string {
  return String(Math.floor(year));
}

export default function ParallelTracks() {
  const rows = React.useMemo(buildRows, []);

  return (
    <VariantShell
      current="resume2"
      name="Parallel Tracks"
      idea="Both careers get their own column, so the three overlapping years are literally side by side. On a phone it folds down to one chronological column with colored edges."
    >
      <Container padding="lg">
        <div className="pt">
          <div className="pt__headers" aria-hidden="true">
            <div className="pt__header pt__header--service">{laneById("service").label}</div>
            <div className="pt__header-spacer" />
            <div className="pt__header pt__header--civilian">{laneById("civilian").label}</div>
          </div>

          <div className="pt__grid">
            {rows.map((row) => {
              const serviceActive = row.year < MERGE_YEAR;
              const civilianActive = row.year >= FORK_YEAR;
              const isFork = Math.abs(row.year - FORK_YEAR) < 0.01;
              const isOverlap = row.year >= FORK_YEAR && row.year < MERGE_YEAR;

              return (
                <React.Fragment key={row.key}>
                  <div className={`pt__cell pt__cell--left${isOverlap ? " pt__cell--overlap" : ""}`}>
                    {row.service && <EntryCard entry={row.service} align="right" />}
                  </div>

                  <div className={`pt__spine${isOverlap ? " pt__spine--overlap" : ""}`}>
                    <span
                      className={serviceActive ? "pt__line pt__line--service" : "pt__line pt__line--off"}
                      aria-hidden="true"
                    />
                    <span
                      className={
                        civilianActive ? "pt__line pt__line--civilian" : "pt__line pt__line--off pt__line--right"
                      }
                      aria-hidden="true"
                    />
                    {isFork && (
                      <svg className="pt__branch" viewBox="0 0 60 60" preserveAspectRatio="none" aria-hidden="true">
                        <path
                          d="M 14 0 C 14 26, 46 20, 46 52"
                          fill="none"
                          stroke={laneColorVar("civilian")}
                          strokeWidth={3}
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                    )}
                    <span className="pt__year">{yearLabel(row.year)}</span>
                    {row.service && (
                      <span
                        className="pt__node pt__node--service"
                        style={{ background: laneColorVar("service") }}
                        aria-hidden="true"
                      />
                    )}
                    {row.civilian && (
                      <span
                        className="pt__node pt__node--civilian"
                        style={{ background: laneColorVar("civilian") }}
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <div className={`pt__cell pt__cell--right${isOverlap ? " pt__cell--overlap" : ""}`}>
                    {row.civilian && <EntryCard entry={row.civilian} align="left" />}
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          <div className="pt__terminus">
            <span aria-hidden="true" className="pt__terminus-cap" />
            <Text tone="muted">
              Ten years of service concludes in July 2019. One track from here.
            </Text>
          </div>
        </div>
      </Container>
    </VariantShell>
  );
}

function EntryCard({ entry, align }: { entry: ResumeEntry; align: "left" | "right" }) {
  const markers = markersWithin(entry);
  return (
    <article
      className={`pt__card pt__card--${align}`}
      style={{ ["--lane-color" as string]: laneColorVar(entry.lane) }}
    >
      <span className="pt__lane-chip">{laneById(entry.lane).shortLabel}</span>
      <Heading level={3}>{entry.role}</Heading>
      <p className="pt__org">{entry.org}</p>
      <div className="pt__meta">
        <span className="pt__date">{entry.dateLabel}</span>
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
      <Text>{entry.summary}</Text>
      <ul className="vres-highlights">
        {entry.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
      {markers.length > 0 && (
        <ul className="pt__markers">
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
    </article>
  );
}
