import React from "react";
import CollapsibleReport from "../components/CollapsibleReport";
import "./healthcare-landing.css";

export default function RadiologistDemo() {
  const scans = [
    {
      title: "Scan 1 – John Doe",
      summary: "Pending AI analysis. Click to view details.",
      details: [
        { label: "Scan ID", value: "RAD001" },
        { label: "Patient", value: "John Doe" },
        { label: "AI Output", value: "Effusion probability: 0.21" },
        { label: "Observation", value: "Minimal findings" },
      ],
    },
    {
      title: "Scan 2 – Abdul Khan",
      summary: "AI flagged minor opacity, needs confirmation.",
      details: [
        { label: "Scan ID", value: "RAD002" },
        { label: "Patient", value: "Abdul Khan" },
        { label: "AI Output", value: "Opacity confidence: 0.78" },
        { label: "Observation", value: "Likely benign" },
      ],
    },
  ];

  return (
    <div className="demo-root">
      <header className="demo-header">
        <h1>Radiologist Workbench</h1>
        <p>Analyze, visualize, and verify AI findings</p>
      </header>

      <main className="demo-container">
        {scans.map((s, i) => (
          <CollapsibleReport
            key={i}
            title={s.title}
            summary={s.summary}
            details={s.details}
          />
        ))}
      </main>
    </div>
  );
}
