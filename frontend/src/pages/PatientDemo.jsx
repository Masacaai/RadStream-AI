import React from "react";
import CollapsibleReport from "../components/CollapsibleReport";
import "./healthcare-landing.css";

export default function PatientDemo() {
  const myReports = [
    {
      title: "Report – Chest X-ray (Jan 2025)",
      summary: "No significant abnormalities detected.",
      details: [
        { label: "Doctor", value: "Dr. Aaqel" },
        { label: "Radiologist", value: "Dr. Ammar" },
        { label: "Scan ID", value: "P001" },
        { label: "Summary", value: "Lungs clear, normal heart size" },
      ],
    },
  ];

  return (
    <div className="demo-root">
      <header className="demo-header">
        <h1>Welcome, Abdul</h1>
        <p>Your reports and insights are shown below</p>
      </header>

      <main className="demo-container">
        {myReports.map((r, i) => (
          <CollapsibleReport
            key={i}
            title={r.title}
            summary={r.summary}
            details={r.details}
          />
        ))}
      </main>
    </div>
  );
}
