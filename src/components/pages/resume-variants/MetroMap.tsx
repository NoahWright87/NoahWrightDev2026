"use client";

/**
 * TEMPORARY prototype — `/resume4`, "Metro Map".
 *
 * A transit diagram rather than a scrolling spine: stations are evenly spaced
 * (schematic, not to scale), the branch is a 45-degree interchange, and service
 * ends at a terminus bar. The map is a fixed-size object you read whole — it
 * stays put while the detail panel beside it swaps as you pick stations.
 */

import * as React from "react";
import { Container, Heading, Text, Pill } from "@noahwright/design";
import { VariantShell } from "./VariantChrome";
import {
  ENTRIES_CHRONOLOGICAL,
  laneById,
  laneColorVar,
  markersWithin,
  entryDurationLabel,
  type ResumeEntry,
} from "@/lib/resumeDemo";
import "./metro-map.css";

const MAP_W = 312;
const MAP_H = 740;
const SERVICE_X = 34;
const CIVILIAN_X = 94;
const LABEL_X = 116;

/**
 * Schematic station positions — deliberately even, with a wider gap at the
 * interchange to make room for the 45-degree branch. Spacing has to clear a
 * two-line role label plus its org line without colliding with its neighbour.
 */
const STATION_Y = [44, 130, 216, 336, 422, 508, 594, 680];
/** Where the service line stops — between the 2018 and 2021 civilian stations. */
const SERVICE_TERMINUS_Y = 450;

export default function MetroMap() {
  const [selectedId, setSelectedId] = React.useState<string>(ENTRIES_CHRONOLOGICAL[0].id);
  const selected =
    ENTRIES_CHRONOLOGICAL.find((e) => e.id === selectedId) ?? ENTRIES_CHRONOLOGICAL[0];

  const stations = ENTRIES_CHRONOLOGICAL.map((entry, i) => ({
    entry,
    y: STATION_Y[i] ?? 40 + i * 72,
    x: entry.lane === "service" ? SERVICE_X : CIVILIAN_X,
  }));

  const forkY = stations[2].y;
  const branchPath =
    `M ${SERVICE_X} ${forkY} ` +
    `L ${SERVICE_X} ${forkY + 20} ` +
    `L ${CIVILIAN_X} ${forkY + 20 + (CIVILIAN_X - SERVICE_X)} ` +
    `L ${CIVILIAN_X} ${MAP_H - 30}`;

  return (
    <VariantShell
      current="resume4"
      name="Metro Map"
      idea="A schematic you read as a whole rather than scroll through: even station spacing, a 45-degree interchange where the careers split, and a terminus bar where service ends."
    >
      <Container padding="lg">
        <div className="mm">
          <div className="mm__map-wrap">
            <div className="mm__map" style={{ width: MAP_W, height: MAP_H }}>
              <svg
                width={MAP_W}
                height={MAP_H}
                viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                fill="none"
                aria-hidden="true"
                className="mm__svg"
              >
                {/* Service line */}
                <path
                  d={`M ${SERVICE_X} 18 L ${SERVICE_X} ${SERVICE_TERMINUS_Y}`}
                  stroke={laneColorVar("service")}
                  strokeWidth={9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Civilian line, branching at the interchange */}
                <path
                  d={branchPath}
                  stroke={laneColorVar("civilian")}
                  strokeWidth={9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Terminus bar */}
                <line
                  x1={SERVICE_X - 13}
                  y1={SERVICE_TERMINUS_Y}
                  x2={SERVICE_X + 13}
                  y2={SERVICE_TERMINUS_Y}
                  stroke={laneColorVar("service")}
                  strokeWidth={5}
                  strokeLinecap="round"
                />

                {/* Interchange halo where the two lines meet */}
                <circle
                  cx={SERVICE_X}
                  cy={forkY}
                  r={15}
                  fill="none"
                  stroke={laneColorVar("civilian")}
                  strokeWidth={2}
                  strokeDasharray="3 4"
                  className="mm__interchange"
                />

                {stations.map(({ entry, x, y }) => {
                  const isSelected = entry.id === selectedId;
                  return (
                    <circle
                      key={entry.id}
                      cx={x}
                      cy={y}
                      r={isSelected ? 9 : 7}
                      fill="var(--background)"
                      stroke={laneColorVar(entry.lane)}
                      strokeWidth={isSelected ? 5 : 4}
                      className="mm__station"
                    />
                  );
                })}
              </svg>

              {/* Station labels as real buttons, positioned over the diagram. */}
              {stations.map(({ entry, y }) => {
                const isSelected = entry.id === selectedId;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    className={isSelected ? "mm__label mm__label--selected" : "mm__label"}
                    style={{
                      top: y,
                      left: LABEL_X,
                      ["--lane-color" as string]: laneColorVar(entry.lane),
                    }}
                    onClick={() => setSelectedId(entry.id)}
                    aria-pressed={isSelected}
                  >
                    <span className="mm__label-role">{entry.role}</span>
                    <span className="mm__label-meta">
                      {entry.org} · {Math.floor(entry.start)}
                    </span>
                  </button>
                );
              })}

              {/* Sits below the terminus bar, in the empty space the service
                  line leaves behind, rather than beside a station label. */}
              <span className="mm__terminus-note" style={{ top: SERVICE_TERMINUS_Y + 12 }}>
                service ends
                <br />
                2019
              </span>
            </div>
          </div>

          <section
            className="mm__detail"
            style={{ ["--lane-color" as string]: laneColorVar(selected.lane) }}
            aria-live="polite"
          >
            <Detail entry={selected} />
          </section>
        </div>
      </Container>
    </VariantShell>
  );
}

function Detail({ entry }: { entry: ResumeEntry }) {
  const markers = markersWithin(entry);
  return (
    <>
      <span className="mm__detail-lane">{laneById(entry.lane).label}</span>
      <Heading level={2}>{entry.role}</Heading>
      <p className="mm__detail-org">{entry.org}</p>
      <div className="mm__detail-meta">
        <span>{entry.dateLabel}</span>
        <span
          className={
            entry.commitment === "part-time"
              ? "vres-commitment vres-commitment--part-time"
              : "vres-commitment"
          }
        >
          {entry.commitment}
        </span>
        <span>{entryDurationLabel(entry)}</span>
      </div>
      <Text>{entry.summary}</Text>
      <ul className="vres-highlights">
        {entry.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
      {markers.length > 0 && (
        <ul className="mm__detail-markers">
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
    </>
  );
}
