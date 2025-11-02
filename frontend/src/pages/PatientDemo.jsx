import React from "react";
import "./healthcare-landing.css";

export default function PatientDemo() {
  return (
    <div className="demo-root">
      <header className="demo-header">
        <h1>Welcome, Abdul</h1>
        <p>Your personalized X-ray insight summary</p>
      </header>

      <main className="demo-container">
        <section className="demo-card">
          <h2>Recent Scan Result</h2>
          <img
            src="/images/xray-scan.jpg"
            alt="Chest X-ray"
            className="demo-img"
          />
          <p>
            <strong>No major abnormalities</strong> detected.  
            Slight opacity observed — recommended routine follow-up.
          </p>
        </section>

        <section className="demo-card">
          <h2>Doctor’s Notes</h2>
          <p>
            Your chest X-ray looks healthy overall. Keep up regular check-ups
            and report any breathing issues to your physician.
          </p>
        </section>
      </main>
    </div>
  );
}
