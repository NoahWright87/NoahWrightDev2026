"use client";

/**
 * TEMPORARY — lets the scroll-driven prototypes be retuned in the browser
 * rather than guessing a scroll distance up front. The choice persists across
 * the three pinned-rail pages so they can be compared at matched pacing.
 */

import { PACING_LABEL, PACING_ORDER, type Pacing } from "./scrollRail";
import "./pacing-control.css";

export function PacingControl({
  value,
  onChange,
}: {
  value: Pacing;
  onChange: (value: Pacing) => void;
}) {
  return (
    <div className="pacing" role="group" aria-label="Scroll pacing">
      <span className="pacing__label">Pace</span>
      {PACING_ORDER.map((option) => (
        <button
          key={option}
          type="button"
          className={
            option === value ? "pacing__option pacing__option--on" : "pacing__option"
          }
          onClick={() => onChange(option)}
          aria-pressed={option === value}
        >
          {PACING_LABEL[option]}
        </button>
      ))}
    </div>
  );
}

export default PacingControl;
