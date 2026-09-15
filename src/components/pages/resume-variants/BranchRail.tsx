"use client";

/**
 * TEMPORARY prototype — `/resume1`, "Branch Rail".
 *
 * The graph lives in a narrow rail on the left; content stays in a single
 * column at every screen size. Lane geometry is measured from the real DOM
 * positions of the entry rows, so the rail always lines up with the content
 * no matter how the cards reflow. A sticky minimap on wide screens is a
 * literal scaled copy of the same rail, and doubles as jump navigation.
 */

import * as React from "react";
import { Container, Heading, Text, Pill } from "@noahwright/design";
import { VariantShell } from "./VariantChrome";
import {
  ENTRIES_CHRONOLOGICAL,
  FORK_YEAR,
  MERGE_YEAR,
  RESUME_LANES,
  laneColorVar,
  markersWithin,
  type LaneId,
  type ResumeEntry,
} from "@/lib/resumeDemo";
import "./branch-rail.css";

/** Distance from a row's top edge down to its node center. Matches CSS. */
const NODE_OFFSET = 34;

const LANE_ORDER: LaneId[] = ["service", "civilian"];

function laneIndex(id: LaneId): number {
  return LANE_ORDER.indexOf(id);
}

/** Lane centers sit proportionally inside the rail, so the same math works at any rail width. */
function laneX(railWidth: number, index: number): number {
  return railWidth * (0.26 + index * 0.42);
}

interface RowGeometry {
  id: string;
  /** Node center, in pixels from the top of the timeline container. */
  y: number;
  start: number;
  lane: LaneId;
}

interface Geometry {
  height: number;
  railWidth: number;
  rows: RowGeometry[];
}

/**
 * Piecewise-linear map from a decimal year to a pixel offset, anchored on the
 * measured row positions. Lets the rail place the fork and the end of service
 * at dates that fall *between* two entries rather than on one.
 */
function makeYearToY(rows: RowGeometry[], height: number): (year: number) => number {
  return (year: number) => {
    if (rows.length === 0) return 0;
    if (rows.length === 1) return rows[0].y;

    if (year <= rows[0].start) {
      const [a, b] = [rows[0], rows[1]];
      const span = b.start - a.start;
      if (span <= 0) return a.y;
      return Math.max(0, a.y + ((year - a.start) / span) * (b.y - a.y));
    }

    for (let i = 0; i < rows.length - 1; i++) {
      const a = rows[i];
      const b = rows[i + 1];
      if (year >= a.start && year <= b.start) {
        const span = b.start - a.start;
        if (span <= 0) return b.y;
        return a.y + ((year - a.start) / span) * (b.y - a.y);
      }
    }

    const a = rows[rows.length - 2];
    const b = rows[rows.length - 1];
    const span = b.start - a.start;
    if (span <= 0) return b.y;
    return Math.min(height, b.y + ((year - b.start) / span) * (b.y - a.y));
  };
}

export default function BranchRail() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const railRef = React.useRef<HTMLDivElement>(null);
  const rowRefs = React.useRef<Record<string, HTMLLIElement | null>>({});

  const [geom, setGeom] = React.useState<Geometry | null>(null);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [visible, setVisible] = React.useState<Set<string>>(new Set());
  const [drawn, setDrawn] = React.useState(false);
  /**
   * Scroll reveal is opt-in from JS. Rendering visible-by-default means content
   * is never stranded at `opacity: 0` without JS, in print, or for a row the
   * observer never gets to see.
   */
  const [enhanced, setEnhanced] = React.useState(false);
  const [viewport, setViewport] = React.useState<{ top: number; bottom: number }>({
    top: 0,
    bottom: 0,
  });

  /* Measure row positions; re-measure whenever anything resizes. */
  React.useLayoutEffect(() => {
    const container = containerRef.current;
    const rail = railRef.current;
    if (!container || !rail) return;

    const measure = () => {
      const containerRect = container.getBoundingClientRect();
      const rows: RowGeometry[] = [];
      for (const entry of ENTRIES_CHRONOLOGICAL) {
        const el = rowRefs.current[entry.id];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        rows.push({
          id: entry.id,
          y: rect.top - containerRect.top + NODE_OFFSET,
          start: entry.start,
          lane: entry.lane,
        });
      }
      setGeom({
        height: containerRect.height,
        railWidth: rail.getBoundingClientRect().width,
        rows,
      });
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    for (const el of Object.values(rowRefs.current)) {
      if (el) observer.observe(el);
    }
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* Reveal rows as they scroll into view, and draw the lines once. */
  React.useLayoutEffect(() => {
    setEnhanced(true);
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (records) => {
        setVisible((prev) => {
          const next = new Set(prev);
          let changed = false;
          for (const record of records) {
            const id = record.target.getAttribute("data-entry-id");
            if (record.isIntersecting && id && !next.has(id)) {
              next.add(id);
              changed = true;
            }
          }
          return changed ? next : prev;
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    for (const el of Object.values(rowRefs.current)) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (records) => {
        if (records.some((r) => r.isIntersecting)) setDrawn(true);
      },
      { threshold: 0.02 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  /* Track which slice of the timeline is on screen, for the minimap window. */
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = container.getBoundingClientRect();
      if (rect.height === 0) return;
      setViewport({
        top: Math.max(0, Math.min(1, -rect.top / rect.height)),
        bottom: Math.max(0, Math.min(1, (-rect.top + window.innerHeight) / rect.height)),
      });
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [geom?.height]);

  const scrollToEntry = React.useCallback((id: string) => {
    const el = rowRefs.current[id];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setActiveId(id);
  }, []);

  /* ---- derived geometry ---- */
  const paths = React.useMemo(() => {
    if (!geom || geom.rows.length < 2) return null;
    const { rows, railWidth, height } = geom;
    const yearToY = makeYearToY(rows, height);

    const serviceX = laneX(railWidth, 0);
    const civilianX = laneX(railWidth, 1);

    const firstCivilian = rows.find((r) => r.lane === "civilian");
    const lastRow = rows[rows.length - 1];

    const serviceTop = rows[0].y - 20;
    const serviceEnd = yearToY(MERGE_YEAR);
    const forkY = yearToY(FORK_YEAR);
    const civilianFirstY = firstCivilian ? firstCivilian.y : forkY + 60;
    const civilianEnd = Math.min(height - 6, lastRow.y + 46);

    /**
     * Resolve the split within a fixed distance instead of stretching it across
     * the whole gap — a tall card would otherwise turn the branch into a long
     * slow diagonal rather than a legible fork.
     */
    const gap = Math.max(24, civilianFirstY - forkY);
    const curve = Math.min(gap, 104);
    const curveEnd = forkY + curve;
    const branch =
      `M ${serviceX} ${forkY} ` +
      `C ${serviceX} ${forkY + curve * 0.6}, ${civilianX} ${curveEnd - curve * 0.6}, ` +
      `${civilianX} ${curveEnd} ` +
      `L ${civilianX} ${civilianEnd}`;

    return {
      serviceX,
      civilianX,
      service: `M ${serviceX} ${serviceTop} L ${serviceX} ${serviceEnd}`,
      branch,
      serviceEnd,
      forkY,
      overlapTop: forkY,
      overlapBottom: serviceEnd,
      yearToY,
    };
  }, [geom]);

  const railNodes = React.useMemo(() => {
    if (!geom || !paths) return [];
    return ENTRIES_CHRONOLOGICAL.map((entry) => {
      const row = geom.rows.find((r) => r.id === entry.id);
      if (!row) return null;
      return {
        entry,
        x: laneX(geom.railWidth, laneIndex(entry.lane)),
        y: row.y,
      };
    }).filter(Boolean) as { entry: ResumeEntry; x: number; y: number }[];
  }, [geom, paths]);

  return (
    <VariantShell
      current="resume1"
      name="Branch Rail"
      idea="The graph sits in a narrow rail and the content stays in one column at every width, so the shape survives on a phone. Hover an entry to light up its lane."
    >
      <Container padding="lg">
        <div className={enhanced ? "br br--enhanced" : "br"} ref={containerRef}>
          <div className="br__rail" ref={railRef} aria-hidden="true">
            {geom && paths && (
              <svg
                className={drawn ? "br__svg br__svg--drawn" : "br__svg"}
                width={geom.railWidth}
                height={geom.height}
                viewBox={`0 0 ${geom.railWidth} ${geom.height}`}
                fill="none"
              >
                {/* The window where both careers run at once. */}
                <rect
                  className="br__overlap"
                  x={paths.serviceX - 12}
                  y={paths.overlapTop}
                  width={paths.civilianX - paths.serviceX + 24}
                  height={Math.max(0, paths.overlapBottom - paths.overlapTop)}
                  rx={14}
                />

                <path
                  className="br__line br__line--service"
                  d={paths.service}
                  pathLength={1}
                  stroke={laneColorVar("service")}
                />
                <path
                  className="br__line br__line--civilian"
                  d={paths.branch}
                  pathLength={1}
                  stroke={laneColorVar("civilian")}
                />

                {/* Terminal cap where service ends. */}
                <line
                  className="br__cap"
                  x1={paths.serviceX - 8}
                  y1={paths.serviceEnd}
                  x2={paths.serviceX + 8}
                  y2={paths.serviceEnd}
                  stroke={laneColorVar("service")}
                />

                {railNodes.map(({ entry, x, y }) => {
                  const isActive = activeId === entry.id;
                  const isCurrent = entry.end === null;
                  return (
                    <g key={entry.id} className={isActive ? "br__node br__node--active" : "br__node"}>
                      {isCurrent && (
                        <circle className="br__pulse" cx={x} cy={y} r={9} fill={laneColorVar(entry.lane)} />
                      )}
                      <circle
                        cx={x}
                        cy={y}
                        r={entry.kind === "promotion" ? 4.5 : 6.5}
                        fill={entry.kind === "promotion" ? "var(--background)" : laneColorVar(entry.lane)}
                        stroke={laneColorVar(entry.lane)}
                        strokeWidth={2.5}
                      />
                    </g>
                  );
                })}

                {/* Awards, certs and education as small diamonds on their lane. */}
                {geom.rows.length > 1 &&
                  ENTRIES_CHRONOLOGICAL.flatMap((entry) =>
                    markersWithin(entry).map((marker) => {
                      const x = laneX(geom.railWidth, laneIndex(marker.lane));
                      const y = paths.yearToY(marker.date);
                      return (
                        <rect
                          key={marker.id}
                          className="br__marker"
                          x={x - 4}
                          y={y - 4}
                          width={8}
                          height={8}
                          rx={1.5}
                          fill="var(--background)"
                          stroke={laneColorVar(marker.lane)}
                          strokeWidth={2}
                          transform={`rotate(45 ${x} ${y})`}
                        />
                      );
                    })
                  )}
              </svg>
            )}
          </div>

          <ol className="br__rows">
            {ENTRIES_CHRONOLOGICAL.map((entry) => {
              const markers = markersWithin(entry);
              const isVisible = visible.has(entry.id);
              return (
                <li
                  key={entry.id}
                  data-entry-id={entry.id}
                  ref={(el) => {
                    rowRefs.current[entry.id] = el;
                  }}
                  className={[
                    "br__row",
                    isVisible && "br__row--visible",
                    activeId === entry.id && "br__row--active",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{ ["--lane-color" as string]: laneColorVar(entry.lane) }}
                  onMouseEnter={() => setActiveId(entry.id)}
                  onMouseLeave={() => setActiveId(null)}
                  onFocus={() => setActiveId(entry.id)}
                  onBlur={() => setActiveId(null)}
                >
                  <article className="br__card" tabIndex={0}>
                    <header className="br__card-head">
                      <div className="br__card-title">
                        <Heading level={3}>{entry.role}</Heading>
                        <p className="br__org">{entry.org}</p>
                      </div>
                      <div className="br__card-meta">
                        <span className="br__date">{entry.dateLabel}</span>
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
                    </header>

                    <Text>{entry.summary}</Text>

                    <ul className="vres-highlights">
                      {entry.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>

                    {markers.length > 0 && (
                      <ul className="br__markers">
                        {markers.map((m) => (
                          <li key={m.id}>
                            <span className="br__marker-kind">{m.kind}</span>
                            <strong>{m.label}</strong>
                            <span className="br__marker-date">{m.dateLabel}</span>
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
                </li>
              );
            })}
          </ol>
        </div>
      </Container>

      {/* Sticky miniature of the same rail — wide screens only. */}
      {geom && paths && geom.rows.length > 1 && (
        <MiniMap
          geom={geom}
          viewport={viewport}
          activeId={activeId}
          onJump={scrollToEntry}
          onHover={setActiveId}
        />
      )}
    </VariantShell>
  );
}

function MiniMap({
  geom,
  viewport,
  activeId,
  onJump,
  onHover,
}: {
  geom: Geometry;
  viewport: { top: number; bottom: number };
  activeId: string | null;
  onJump: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  const H = 230;
  const W = 46;
  const scale = geom.height === 0 ? 0 : H / geom.height;
  const miniRows = geom.rows.map((r) => ({ ...r, my: r.y * scale }));
  const yearToY = makeYearToY(geom.rows, geom.height);

  const sx = laneX(W, 0);
  const cx = laneX(W, 1);
  const forkY = yearToY(FORK_YEAR) * scale;
  const serviceEnd = yearToY(MERGE_YEAR) * scale;
  const firstCivilian = miniRows.find((r) => r.lane === "civilian");
  const civFirstY = firstCivilian ? firstCivilian.my : forkY + 20;
  const lastRow = miniRows[miniRows.length - 1];
  const dy = Math.max(10, civFirstY - forkY);

  return (
    <aside className="br-mini" aria-label="Timeline navigation">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
        <rect
          className="br-mini__window"
          x={0}
          y={viewport.top * H}
          width={W}
          height={Math.max(6, (viewport.bottom - viewport.top) * H)}
          rx={6}
        />
        <path
          d={`M ${sx} ${miniRows[0].my - 6} L ${sx} ${serviceEnd}`}
          stroke={laneColorVar("service")}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <path
          d={
            `M ${sx} ${forkY} C ${sx} ${forkY + dy * 0.55}, ${cx} ${civFirstY - dy * 0.55}, ` +
            `${cx} ${civFirstY} L ${cx} ${lastRow.my + 8}`
          }
          stroke={laneColorVar("civilian")}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {miniRows.map((row) => {
          const entry = ENTRIES_CHRONOLOGICAL.find((e) => e.id === row.id);
          if (!entry) return null;
          const x = laneX(W, laneIndex(row.lane));
          return (
            <g key={row.id}>
              <circle
                cx={x}
                cy={row.my}
                r={activeId === row.id ? 5 : 3.2}
                fill={laneColorVar(row.lane)}
                className="br-mini__node"
              />
              {/* Generous invisible hit area — the visible dot is too small to click. */}
              <circle
                cx={x}
                cy={row.my}
                r={11}
                fill="transparent"
                className="br-mini__hit"
                onClick={() => onJump(row.id)}
                onMouseEnter={() => onHover(row.id)}
                onMouseLeave={() => onHover(null)}
              >
                <title>{`${entry.role} — ${entry.dateLabel}`}</title>
              </circle>
            </g>
          );
        })}
      </svg>
      <p className="br-mini__caption">
        {RESUME_LANES.map((l) => l.shortLabel).join(" / ")}
      </p>
    </aside>
  );
}
