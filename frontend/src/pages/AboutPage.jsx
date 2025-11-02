import React from "react";
import "./healthcare-landing.css"; // reuse same theme

export default function AboutPage() {
  return (
    <div className="hl-root">
      <header className="hl-nav">
        <div className="hl-container hl-nav-inner">
          <div className="hl-logo">HOPPR X-ray</div>

          <nav className="hl-nav-links">
            <a href="/">Home</a>
            <a href="/about" className="is-active">About</a>
            <a href="#tech">Technology</a>
            <a href="#services">Services</a>
          </nav>

          <div className="hl-nav-cta">
            <a className="hl-btn hl-btn-black" href="/login">Try the demo</a>
          </div>
        </div>
      </header>

      <main className="hl-about-page">
        <div className="hl-container">
          <h1 className="hl-about-title">About the Project</h1>
          <p className="hl-about-sub">
            Our project showcases Hoppr’s medical AI for chest X-ray analysis —
            transforming DICOM scans into readable vision–language reports with
            interpretable risk scores for key conditions. Designed for MTCHacks
            2025, this demo explores how AI can empower radiologists, doctors,
            and patients through fast and explainable medical imaging.
          </p>

          <div className="hl-about-grid">
            <div className="hl-about-card">
              <img src="/images/Scan.jpeg" alt="AI Model" />
              <h3>Smart Diagnosis</h3>
              <p>
                Deep learning models analyze visual patterns in chest X-rays and
                output explainable reports.
              </p>
            </div>
            <div className="hl-about-card">
              <img src="/images/Xray.jpg" alt="X-ray Scan" />
              <h3>Chest X-ray Insights</h3>
              <p>
                Vision–language alignment improves interpretability and speeds
                up clinical workflows.
              </p>
            </div>
            <div className="hl-about-card">
              <img src="/images/Patient.jpg" alt="Patient Care" />
              <h3>Empowering Healthcare</h3>
              <p>
                Built to help patients and doctors collaborate with transparent,
                accessible AI insights.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
