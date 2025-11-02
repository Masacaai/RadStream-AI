import React from "react";
import "./healthcare-landing.css";

export default function RadiologistDemo() {
  return (
    <div className="demo-root">
      <header className="demo-header">
        <h1>Radiologist Workbench</h1>
        <p>AI-enhanced diagnostic visualization</p>
      </header>

      <main className="demo-container grid-2">
        <section className="demo-card">
          <h2>X-ray Viewer</h2>
          <img
            src="/images/xray-scan.jpg"
            alt="X-ray viewer"
            className="demo-img"
          />
          <p>
            Annotated regions highlight possible opacities detected by Hoppr AI.
          </p>
        </section>

        <section className="demo-card">
          <h2>Model Report</h2>
          <p>
            The model identified minor lung opacity with confidence score 0.81.
            No sign of pneumothorax or effusion.
          </p>
          <button className="login-btn" style={{ marginTop: "10px" }}>
            Download Report (PDF)
          </button>
        </section>
      </main>
    </div>
  );
}
