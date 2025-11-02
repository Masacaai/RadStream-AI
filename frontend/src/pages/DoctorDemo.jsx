import React from "react";
import CollapsibleReport from "../components/CollapsibleReport";
import "./healthcare-landing.css";

export default function DoctorDemo() {
  const reports = [
    {
      title: "Patient: Abdul Khan",
      summary: "AI detected mild opacity, low risk. Review recommended.",
      details: [
        { label: "Scan", value: "CXR_00123.png" },
        { label: "Radiologist", value: "Dr. Ammar" },
        { label: "Diagnosis", value: "Slight cardiomegaly" },
        { label: "Recommendation", value: "Follow-up in 3 months" },
      ],
    },
    {
      title: "Patient: Sara Ali",
      summary: "Clear X-ray. No abnormalities detected.",
      details: [
        { label: "Scan", value: "CXR_00456.png" },
        { label: "Radiologist", value: "Dr. Ammar" },
        { label: "Diagnosis", value: "Normal" },
        { label: "Recommendation", value: "Annual check-up" },
      ],
    },
  ];

  return (
    <div className="demo-root">
      <header className="demo-header">
        <h1>Doctor Dashboard</h1>
        <p>Review patient scans and AI-assisted reports</p>
      </header>

      <main className="demo-container">
        {reports.map((r, i) => (
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
