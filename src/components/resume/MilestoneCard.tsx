"use client";

import { MARKER_KIND_LABEL, type ResumeMarker } from "@/lib/resume";
import "./milestone-card.css";

/**
 * An award, degree, course or certification, shown on the stage beneath the
 * job it happened during. Kept deliberately short: it sits under a job card
 * and has to fit beside it.
 */
export function MilestoneCard({ marker, color }: { marker: ResumeMarker; color: string }) {
  return (
    <article className="mc" style={{ ["--job-color" as string]: color }}>
      <div className="mc__head">
        <span className="mc__kind">{MARKER_KIND_LABEL[marker.kind]}</span>
        <span className="mc__date">{marker.dateLabel}</span>
      </div>
      <h3 className="mc__title">{marker.label}</h3>
      {marker.issuer && <p className="mc__issuer">{marker.issuer}</p>}
      {marker.honors && <p className="mc__honors">{marker.honors}</p>}
      <p className="mc__detail">{marker.detail}</p>
      {marker.href && (
        <a className="mc__link" href={marker.href} target="_blank" rel="noopener">
          View citation (PDF)
        </a>
      )}
    </article>
  );
}

export default MilestoneCard;
