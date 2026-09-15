"use client";

/**
 * TEMPORARY prototype — `/resume3`, "Time Scrubber".
 *
 * Time runs left to right across a chart at the top: one bar per track, each
 * role a segment whose width is its actual duration, with the overlap window
 * shaded. Picking a segment drives a detail panel below. Unlike the vertical
 * variants this one is measured — a long tenure genuinely looks long — and the
 * full list underneath keeps it readable as a plain resume.
 */

import * as React from "react";
import { Container, Heading, Text, Pill } from "@noahwright/design";
import { VariantShell } from "./VariantChrome";
import {
  ENTRIES_CHRONOLOGICAL,
  FORK_YEAR,
  MERGE_YEAR,
  RESUME_LANES,
  RESUME_MARKERS,
  TIMELINE_END,
  TIMELINE_START,
  entryEnd,
  entryDurationLabel,
  entryDurationYears,
  laneById,
  laneColorVar,
  markersWithin,
  yearToFraction,
  yearTicks,
  type ResumeEntry,
} from "@/lib/resumeDemo";
import "./time-scrubber.css";

const pct = (n: number) => `${(n * 100).toFixed(3)}%`;

export default function TimeScrubber() {
  const [selectedId, setSelectedId] = React.useState<string>(
    ENTRIES_CHRONOLOGICAL[ENTRIES_CHRONOLOGICAL.length - 1].id
  );
  const [hoverYear, setHoverYear] = React.useState<number | null>(null);
  const chartRef = React.useRef<HTMLDivElement>(null);

  const selected =
    ENTRIES_CHRONOLOGICAL.find((e) => e.id === selectedId) ?? ENTRIES_CHRONOLOGICAL[0];

  const move = React.useCallback(
    (delta: number) => {
      const index = ENTRIES_CHRONOLOGICAL.findIndex((e) => e.id === selectedId);
      const next = Math.max(0, Math.min(ENTRIES_CHRONOLOGICAL.length - 1, index + delta));
      setSelectedId(ENTRIES_CHRONOLOGICAL[next].id);
    },
    [selectedId]
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      move(-1);
    }
  };

  const onMouseMove = (event: React.MouseEvent) => {
    const el = chartRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const fraction = (event.clientX - rect.left) / rect.width;
    if (fraction < 0 || fraction > 1) {
      setHoverYear(null);
      return;
    }
    setHoverYear(TIMELINE_START + fraction * (TIMELINE_END - TIMELINE_START));
  };

  const ticks = yearTicks();

  return (
    <VariantShell
      current="resume3"
      name="Time Scrubber"
      idea="Time runs left to right and segment width is real duration, so the overlap is measurable rather than implied. Pick any segment to load it below; arrow keys step through."
    >
      <Container padding="lg">
        <div className="ts">
          <div className="ts__scroller">
            <div
              className="ts__chart"
              ref={chartRef}
              onMouseMove={onMouseMove}
              onMouseLeave={() => setHoverYear(null)}
              onKeyDown={onKeyDown}
              role="group"
              aria-label="Career timeline chart"
            >
              {/* Overlap window */}
              <div
                className="ts__overlap"
                style={{
                  left: pct(yearToFraction(FORK_YEAR)),
                  width: pct(yearToFraction(MERGE_YEAR) - yearToFraction(FORK_YEAR)),
                }}
                aria-hidden="true"
              >
                <span className="ts__overlap-label">both</span>
              </div>

              {/* Year gridlines */}
              {ticks.map((year) => (
                <div
                  key={year}
                  className={year % 2 === 0 ? "ts__gridline ts__gridline--major" : "ts__gridline"}
                  style={{ left: pct(yearToFraction(year)) }}
                  aria-hidden="true"
                />
              ))}

              {hoverYear !== null && (
                <div
                  className="ts__playhead"
                  style={{ left: pct(yearToFraction(hoverYear)) }}
                  aria-hidden="true"
                >
                  <span className="ts__playhead-label">{Math.floor(hoverYear)}</span>
                </div>
              )}

              {/* One bar per lane */}
              {RESUME_LANES.map((lane) => (
                <div key={lane.id} className="ts__lane">
                  <span className="ts__lane-name" style={{ color: laneColorVar(lane.id) }}>
                    {lane.shortLabel}
                  </span>
                  <div className="ts__track">
                    <span
                      className="ts__track-base"
                      style={{
                        left: pct(yearToFraction(lane.start)),
                        width: pct(
                          yearToFraction(lane.end ?? TIMELINE_END) - yearToFraction(lane.start)
                        ),
                        background: `color-mix(in srgb, ${laneColorVar(lane.id)} 18%, transparent)`,
                      }}
                      aria-hidden="true"
                    />
                    {ENTRIES_CHRONOLOGICAL.filter((e) => e.lane === lane.id).map((entry) => {
                      const left = yearToFraction(entry.start);
                      const width = yearToFraction(entryEnd(entry)) - left;
                      const isSelected = entry.id === selectedId;
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          className={
                            isSelected ? "ts__segment ts__segment--selected" : "ts__segment"
                          }
                          style={{
                            left: pct(left),
                            width: pct(width),
                            background: laneColorVar(lane.id),
                            opacity: entry.commitment === "part-time" ? 0.62 : 1,
                          }}
                          onClick={() => setSelectedId(entry.id)}
                          aria-pressed={isSelected}
                        >
                          <span className="ts__segment-label">{entry.role}</span>
                        </button>
                      );
                    })}
                    {RESUME_MARKERS.filter((m) => m.lane === lane.id).map((marker) => (
                      <span
                        key={marker.id}
                        className="ts__marker"
                        style={{
                          left: pct(yearToFraction(marker.date)),
                          borderColor: laneColorVar(lane.id),
                        }}
                        title={`${marker.label} — ${marker.dateLabel}`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* Axis */}
              <div className="ts__axis" aria-hidden="true">
                {ticks
                  .filter((y) => y % 2 === 0)
                  .map((year) => (
                    <span
                      key={year}
                      className="ts__axis-label"
                      style={{ left: pct(yearToFraction(year)) }}
                    >
                      {year}
                    </span>
                  ))}
              </div>
            </div>
          </div>
          <p className="ts__hint">
            Click a segment or use the arrow keys. Bar width is real duration; the dimmed bar is
            part-time reserve service.
          </p>

          <DetailPanel entry={selected} />

          <div className="ts__list">
            <Heading level={2}>Full history</Heading>
            <ol className="ts__list-rows">
              {[...ENTRIES_CHRONOLOGICAL].reverse().map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    className={
                      entry.id === selectedId ? "ts__list-row ts__list-row--selected" : "ts__list-row"
                    }
                    style={{ ["--lane-color" as string]: laneColorVar(entry.lane) }}
                    onClick={() => setSelectedId(entry.id)}
                  >
                    <span className="ts__list-date">{entry.dateLabel}</span>
                    <span className="ts__list-role">
                      <strong>{entry.role}</strong>
                      <span className="ts__list-org">{entry.org}</span>
                    </span>
                    <span className="ts__list-len">{entryDurationYears(entry)}y</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </VariantShell>
  );
}

function DetailPanel({ entry }: { entry: ResumeEntry }) {
  const markers = markersWithin(entry);
  return (
    <section
      className="ts__detail"
      style={{ ["--lane-color" as string]: laneColorVar(entry.lane) }}
      aria-live="polite"
    >
      <header className="ts__detail-head">
        <div>
          <span className="ts__detail-lane">{laneById(entry.lane).label}</span>
          <Heading level={2}>{entry.role}</Heading>
          <p className="ts__detail-org">{entry.org}</p>
        </div>
        <div className="ts__detail-meta">
          <span className="ts__detail-date">{entry.dateLabel}</span>
          <span
            className={
              entry.commitment === "part-time"
                ? "vres-commitment vres-commitment--part-time"
                : "vres-commitment"
            }
          >
            {entry.commitment}
          </span>
          <span className="ts__detail-len">{entryDurationLabel(entry)}</span>
        </div>
      </header>
      <Text>{entry.summary}</Text>
      <ul className="vres-highlights">
        {entry.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
      {markers.length > 0 && (
        <ul className="ts__detail-markers">
          {markers.map((m) => (
            <li key={m.id}>
              <strong>{m.label}</strong>
              <span>{m.dateLabel}</span>
              <Text tone="muted">{m.detail}</Text>
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
    </section>
  );
}
