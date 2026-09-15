"use client";

/**
 * TEMPORARY prototype — `/resume5`, "Quiet Spine".
 *
 * The restrained option. A small at-a-glance strip up top carries the
 * dual-career fact in about two seconds, then the resume itself is a plain
 * single column grouped into three chapters with sticky headers. Details are
 * collapsed by default so a recruiter can skim roles and dates without
 * scrolling past everything.
 */

import * as React from "react";
import { Container, Heading, Text, Pill } from "@noahwright/design";
import { VariantShell } from "./VariantChrome";
import {
  ENTRIES_CHRONOLOGICAL,
  FORK_YEAR,
  MERGE_YEAR,
  RESUME_CHAPTERS,
  RESUME_LANES,
  TIMELINE_END,
  entryDurationYears,
  laneById,
  laneColorVar,
  markersWithin,
  yearToFraction,
  type ResumeEntry,
} from "@/lib/resumeDemo";
import "./quiet-spine.css";

const pct = (n: number) => `${(n * 100).toFixed(3)}%`;

interface Chapter {
  id: string;
  label: string;
  detail: string;
  range: string;
  trackCount: number;
  entries: ResumeEntry[];
}

function buildChapters(): Chapter[] {
  const chapters: Chapter[] = [
    {
      ...RESUME_CHAPTERS[0],
      range: "2009 — 2016",
      trackCount: 1,
      entries: [],
    },
    {
      ...RESUME_CHAPTERS[1],
      range: "2016 — 2019",
      trackCount: 2,
      entries: [],
    },
    {
      ...RESUME_CHAPTERS[2],
      range: "2019 — present",
      trackCount: 1,
      entries: [],
    },
  ];

  for (const entry of ENTRIES_CHRONOLOGICAL) {
    if (entry.start < FORK_YEAR) chapters[0].entries.push(entry);
    else if (entry.start < MERGE_YEAR) chapters[1].entries.push(entry);
    else chapters[2].entries.push(entry);
  }
  return chapters;
}

export default function QuietSpine() {
  const chapters = React.useMemo(buildChapters, []);

  return (
    <VariantShell
      current="resume5"
      name="Quiet Spine"
      idea="Deliberately restrained: one glance-strip carries the dual-career shape, then it is a plain skimmable resume in three chapters. Details stay collapsed until asked for."
    >
      <Container padding="lg">
        <GlanceStrip />
      </Container>

      <Container padding="lg">
        <div className="qs">
          {chapters.map((chapter) => (
            <section key={chapter.id} className="qs__chapter">
              <header className="qs__chapter-head">
                <div className="qs__chapter-head-inner">
                  <span className="qs__chapter-range">{chapter.range}</span>
                  <h2 className="qs__chapter-label">{chapter.label}</h2>
                  <span
                    className={
                      chapter.trackCount === 2
                        ? "qs__chapter-tracks qs__chapter-tracks--two"
                        : "qs__chapter-tracks"
                    }
                  >
                    {chapter.trackCount === 2 ? "two tracks" : "one track"}
                  </span>
                </div>
                <p className="qs__chapter-detail">{chapter.detail}</p>
              </header>

              <ol className="qs__entries">
                {chapter.entries.map((entry) => (
                  <li
                    key={entry.id}
                    className="qs__entry"
                    style={{ ["--lane-color" as string]: laneColorVar(entry.lane) }}
                  >
                    <span className="qs__dot" aria-hidden="true" />
                    <div className="qs__entry-body">
                      <div className="qs__entry-head">
                        <div>
                          <Heading level={3}>{entry.role}</Heading>
                          <p className="qs__org">
                            {entry.org}
                            <span className="qs__lane-chip">{laneById(entry.lane).shortLabel}</span>
                            {entry.commitment === "part-time" && (
                              <span className="vres-commitment vres-commitment--part-time">
                                part-time
                              </span>
                            )}
                          </p>
                        </div>
                        <span className="qs__date">
                          {entry.dateLabel}
                          <span className="qs__len">{entryDurationYears(entry)}y</span>
                        </span>
                      </div>

                      <Text>{entry.summary}</Text>

                      <details className="qs__details">
                        <summary>Details</summary>
                        <ul className="vres-highlights">
                          {entry.highlights.map((h) => (
                            <li key={h}>{h}</li>
                          ))}
                        </ul>
                        {markersWithin(entry).map((m) => (
                          <p key={m.id} className="qs__marker">
                            <strong>{m.label}</strong> — {m.detail} <span>{m.dateLabel}</span>
                          </p>
                        ))}
                        <div className="vres-skills">
                          {entry.skills.map((skill) => (
                            <Pill key={skill} variant="default" size="small">
                              {skill}
                            </Pill>
                          ))}
                        </div>
                      </details>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </Container>
    </VariantShell>
  );
}

function GlanceStrip() {
  return (
    <div className="qs-glance">
      <span className="qs-glance__title">Career at a glance</span>
      <div className="qs-glance__chart">
        <div
          className="qs-glance__overlap"
          style={{
            left: pct(yearToFraction(FORK_YEAR)),
            width: pct(yearToFraction(MERGE_YEAR) - yearToFraction(FORK_YEAR)),
          }}
          aria-hidden="true"
        />
        {RESUME_LANES.map((lane) => (
          <div key={lane.id} className="qs-glance__row">
            <span className="qs-glance__name">{lane.shortLabel}</span>
            <div className="qs-glance__track">
              <span
                className="qs-glance__bar"
                style={{
                  left: pct(yearToFraction(lane.start)),
                  width: pct(yearToFraction(lane.end ?? TIMELINE_END) - yearToFraction(lane.start)),
                  background: laneColorVar(lane.id),
                }}
              />
            </div>
          </div>
        ))}
        <div className="qs-glance__axis" aria-hidden="true">
          {[2010, 2014, 2016, 2019, 2022, 2026].map((year) => (
            <span
              key={year}
              className="qs-glance__tick"
              style={{ left: pct(yearToFraction(year)) }}
            >
              {year}
            </span>
          ))}
        </div>
      </div>
      <p className="qs-glance__caption">
        Ten years of Air Force service and a civilian engineering career, running together from 2016
        to 2019.
      </p>
    </div>
  );
}
