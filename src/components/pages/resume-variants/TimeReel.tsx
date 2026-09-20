"use client";

/**
 * TEMPORARY prototype — `/resume8`, "Time Reel".
 *
 * The other two pinned variants advance one *job* per scroll slice. This one
 * advances through *time*: the tree is drawn to scale, scroll position maps to
 * a year, and whatever was running that year is what you see. Concurrency
 * therefore falls out of the model rather than being a special case — through
 * the overlap the stage simply holds two cards, one per lane, and the panes
 * open and close as each lane starts and stops.
 *
 * The trade-off to judge: a four-year posting takes four years' worth of
 * scrolling, so long roles dwell and short ones go by quickly.
 */

import * as React from "react";
import { Container, usePrefersReducedMotion } from "@noahwright/design";
import { VariantShell } from "./VariantChrome";
import { PacingControl } from "./PacingControl";
import { JobCard } from "./JobCard";
import {
  ENTRIES_CHRONOLOGICAL,
  FORK_YEAR,
  MERGE_YEAR,
  RESUME_LANES,
  TIMELINE_END,
  TIMELINE_START,
  entryEnd,
  laneColorVar,
  yearToFraction,
  type LaneId,
  type ResumeEntry,
} from "@/lib/resumeDemo";
import {
  PACING_VH,
  buildRailPaths,
  laneIndex,
  laneX,
  readStoredPacing,
  sectionProgress,
  writeStoredPacing,
  type Pacing,
} from "./scrollRail";
import "./time-reel.css";

/** Years of fade at each end of a role. */
const FADE_YEARS = 0.25;

/**
 * Full through the middle of a role, ramping inside its own date range at each
 * end. Ramping *inside* the range rather than past it matters: roles on a lane
 * butt up against each other, so fading past the boundary would superimpose two
 * blocks of text at half opacity, which is unreadable. This way the outgoing
 * role reaches zero exactly as the next one starts to rise.
 */
function entryOpacity(entry: ResumeEntry, year: number): number {
  const start = entry.start;
  const end = entryEnd(entry);
  if (year <= start || year >= end) return 0;
  const rampIn = (year - start) / FADE_YEARS;
  const rampOut = (end - year) / FADE_YEARS;
  return Math.max(0, Math.min(1, rampIn, rampOut));
}

function formatYear(year: number): string {
  const whole = Math.floor(year);
  const month = Math.min(11, Math.max(0, Math.floor((year - whole) * 12)));
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${names[month]} ${whole}`;
}

export default function TimeReel() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const stickyRef = React.useRef<HTMLDivElement>(null);
  const railRef = React.useRef<HTMLDivElement>(null);
  const clipId = React.useId();

  const [enhanced, setEnhanced] = React.useState(false);
  const [pacing, setPacing] = React.useState<Pacing>("standard");
  const [rail, setRail] = React.useState<{ width: number; height: number } | null>(null);
  const [stickyHeight, setStickyHeight] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  /** Two full cards do not fit below this width; the second one trims. */
  const [narrow, setNarrow] = React.useState(false);

  const year = TIMELINE_START + progress * (TIMELINE_END - TIMELINE_START);

  React.useLayoutEffect(() => {
    if (!reducedMotion) setEnhanced(true);
  }, [reducedMotion]);

  React.useEffect(() => {
    const stored = readStoredPacing();
    if (stored) setPacing(stored);
  }, []);

  React.useEffect(() => {
    const query = window.matchMedia("(max-width: 900px)");
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  React.useLayoutEffect(() => {
    if (!enhanced) return;
    const railEl = railRef.current;
    const stickyEl = stickyRef.current;
    if (!railEl || !stickyEl) return;

    const measure = () => {
      const rect = railEl.getBoundingClientRect();
      setRail({ width: rect.width, height: rect.height });
      setStickyHeight(stickyEl.getBoundingClientRect().height);
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(railEl);
    observer.observe(stickyEl);
    return () => observer.disconnect();
  }, [enhanced]);

  React.useEffect(() => {
    if (!enhanced) return;
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const height = stickyRef.current?.getBoundingClientRect().height ?? stickyHeight;
      setProgress(sectionProgress(section.getBoundingClientRect(), height));
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
  }, [enhanced, stickyHeight]);

  const scrollToYear = React.useCallback(
    (target: number) => {
      const section = sectionRef.current;
      if (!section || !enhanced) return;
      const travel = section.offsetHeight - stickyHeight;
      window.scrollTo({
        top: section.offsetTop + yearToFraction(target) * travel,
        behavior: "smooth",
      });
    },
    [enhanced, stickyHeight]
  );

  const changePacing = React.useCallback(
    (value: Pacing) => {
      const section = sectionRef.current;
      const heldYear = year;
      setPacing(value);
      writeStoredPacing(value);
      if (!section || !enhanced) return;
      window.requestAnimationFrame(() => {
        const travel = section.offsetHeight - stickyHeight;
        window.scrollTo({
          top: section.offsetTop + yearToFraction(heldYear) * travel,
          behavior: "auto",
        });
      });
    },
    [enhanced, stickyHeight, year]
  );

  /* ---- rail geometry: to scale, so vertical distance is elapsed time ---- */
  const geometry = React.useMemo(() => {
    if (!rail || rail.height === 0) return null;
    const { width, height } = rail;
    const padTop = 30;
    const padBottom = 30;
    const usable = Math.max(1, height - padTop - padBottom);
    const yearY = (y: number) => padTop + yearToFraction(y) * usable;

    const nodes = ENTRIES_CHRONOLOGICAL.map((entry) => ({
      entry,
      x: laneX(width, laneIndex(entry.lane)),
      y: yearY(entry.start),
    }));

    const paths = buildRailPaths({
      railWidth: width,
      topY: yearY(TIMELINE_START),
      bottomY: yearY(TIMELINE_END),
      forkY: yearY(FORK_YEAR),
      civilianFirstY: yearY(FORK_YEAR) + 44,
      serviceEndY: yearY(MERGE_YEAR),
    });

    const ticks: number[] = [];
    for (let y = 2010; y <= Math.floor(TIMELINE_END); y += 2) ticks.push(y);

    return { nodes, paths, yearY, ticks, usable, padTop };
  }, [rail]);

  const markerY = geometry ? geometry.yearY(year) : 0;

  /* Which lanes have something running right now. */
  const laneOpacity = React.useMemo(() => {
    const result: Record<LaneId, number> = { service: 0, civilian: 0 };
    for (const entry of ENTRIES_CHRONOLOGICAL) {
      result[entry.lane] = Math.max(result[entry.lane], entryOpacity(entry, year));
    }
    return result;
  }, [year]);

  const serviceLive = laneOpacity.service > 0.01;
  const civilianLive = laneOpacity.civilian > 0.01;
  const dual = serviceLive && civilianLive;

  const columns = !enhanced
    ? undefined
    : dual
      ? "1fr 1fr"
      : serviceLive
        ? "1fr 0fr"
        : "0fr 1fr";

  const sectionStyle: React.CSSProperties = enhanced
    ? { height: `calc(${ENTRIES_CHRONOLOGICAL.length * PACING_VH[pacing]}vh + ${stickyHeight}px)` }
    : {};

  return (
    <VariantShell
      current="resume8"
      name="Time Reel"
      idea="Scrolling moves through time rather than through jobs: the tree is drawn to scale and whatever was running that year is what you see. The stage opens into two panes on its own through the overlap."
    >
      <Container padding="lg">
        <div
          className={enhanced ? "tr tr--enhanced" : "tr"}
          ref={sectionRef}
          style={sectionStyle}
        >
          <div className="tr__sticky" ref={stickyRef}>
            <div className="tr__rail" ref={railRef} aria-hidden="true">
              {geometry && rail && (
                <svg
                  width={rail.width}
                  height={rail.height}
                  viewBox={`0 0 ${rail.width} ${rail.height}`}
                  fill="none"
                  className="tr__svg"
                >
                  <defs>
                    <clipPath id={`${clipId}-trail`}>
                      <rect x={0} y={0} width={rail.width} height={Math.max(0, markerY)} />
                    </clipPath>
                  </defs>

                  <rect
                    className="tr__overlap"
                    x={geometry.paths.serviceX - 10}
                    y={geometry.paths.overlapTop}
                    width={geometry.paths.civilianX - geometry.paths.serviceX + 20}
                    height={Math.max(
                      0,
                      geometry.paths.overlapBottom - geometry.paths.overlapTop
                    )}
                    rx={10}
                  />

                  {geometry.ticks.map((tick) => (
                    <g key={tick} className="tr__tick">
                      <line
                        x1={4}
                        y1={geometry.yearY(tick)}
                        x2={rail.width - 4}
                        y2={geometry.yearY(tick)}
                        className="tr__tick-line"
                      />
                      <text x={2} y={geometry.yearY(tick) - 3} className="tr__tick-label">
                        {tick}
                      </text>
                    </g>
                  ))}

                  <path
                    className="tr__line tr__line--dim"
                    d={geometry.paths.service}
                    stroke={laneColorVar("service")}
                  />
                  <path
                    className="tr__line tr__line--dim"
                    d={geometry.paths.branch}
                    stroke={laneColorVar("civilian")}
                  />

                  <g clipPath={`url(#${clipId}-trail)`}>
                    <path
                      className="tr__line"
                      d={geometry.paths.service}
                      stroke={laneColorVar("service")}
                    />
                    <path
                      className="tr__line"
                      d={geometry.paths.branch}
                      stroke={laneColorVar("civilian")}
                    />
                  </g>

                  <line
                    className="tr__cap"
                    x1={geometry.paths.serviceX - 7}
                    y1={geometry.paths.serviceEndY}
                    x2={geometry.paths.serviceX + 7}
                    y2={geometry.paths.serviceEndY}
                    stroke={laneColorVar("service")}
                  />

                  {geometry.nodes.map(({ entry, x, y }) => {
                    const live = entryOpacity(entry, year) > 0.5;
                    return (
                      <circle
                        key={entry.id}
                        cx={x}
                        cy={y}
                        r={live ? 7.5 : 4.5}
                        fill={y <= markerY ? laneColorVar(entry.lane) : "var(--background)"}
                        stroke={laneColorVar(entry.lane)}
                        strokeWidth={2.5}
                        className={live ? "tr__node tr__node--live" : "tr__node"}
                        opacity={y <= markerY ? 1 : 0.5}
                      />
                    );
                  })}

                  <g className="tr__marker" transform={`translate(0 ${markerY})`}>
                    <line x1={0} y1={0} x2={rail.width} y2={0} className="tr__marker-line" />
                    <path
                      d={`M ${rail.width - 13} -6 L ${rail.width - 6} 0 L ${rail.width - 13} 6`}
                      className="tr__marker-chevron"
                    />
                  </g>
                </svg>
              )}

              {enhanced && geometry && (
                <span className="tr__readout" style={{ top: markerY }}>
                  {formatYear(year)}
                </span>
              )}

              {enhanced &&
                geometry &&
                geometry.nodes.map(({ entry, y }) => (
                  <button
                    key={entry.id}
                    type="button"
                    className="tr__jump"
                    style={{ top: y }}
                    onClick={() => scrollToYear(entry.start + 0.1)}
                  >
                    <span className="tr__jump-label">{entry.role}</span>
                  </button>
                ))}
            </div>

            <div className="tr__stage">
              {enhanced && (
                <div className="tr__toolbar">
                  <span className="tr__era">
                    {dual ? "Two careers at once" : serviceLive ? "Air Force only" : "Civilian only"}
                  </span>
                  <PacingControl value={pacing} onChange={changePacing} />
                </div>
              )}

              <div
                className={
                  enhanced && dual ? "tr__panes tr__panes--dual" : "tr__panes"
                }
                style={enhanced ? { gridTemplateColumns: columns } : undefined}
              >
                {RESUME_LANES.map((lane, laneIdx) => (
                  <div
                    key={lane.id}
                    className={
                      enhanced && laneOpacity[lane.id] <= 0.01
                        ? "tr__pane tr__pane--off"
                        : "tr__pane"
                    }
                    style={enhanced ? { opacity: laneOpacity[lane.id] } : undefined}
                  >
                    {ENTRIES_CHRONOLOGICAL.filter((e) => e.lane === lane.id).map((entry) => {
                      const opacity = enhanced ? entryOpacity(entry, year) : 1;
                      return (
                        <div
                          key={entry.id}
                          className={
                            enhanced && opacity <= 0.01 ? "tr__slot tr__slot--gone" : "tr__slot"
                          }
                          style={enhanced ? { opacity } : undefined}
                          aria-hidden={enhanced && opacity < 0.5 ? true : undefined}
                        >
                          <JobCard
                            entry={entry}
                            compact={enhanced && dual && narrow && laneIdx > 0}
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </VariantShell>
  );
}
