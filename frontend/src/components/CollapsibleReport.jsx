import React, { useState } from "react";
import "../pages/healthcare-landing.css";


export default function CollapsibleReport({ title, summary, details }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="report-card">
      <div className="report-header" onClick={() => setOpen(!open)}>
        <span className="report-title">{title}</span>
        <button className="report-toggle">
          {open ? "▲ Hide" : "▼ View"}
        </button>
      </div>
      <p className="report-summary">{summary}</p>

      {open && (
        <div className="report-details">
          {details.map((d, i) => (
            <p key={i}>
              <strong>{d.label}:</strong> {d.value}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
