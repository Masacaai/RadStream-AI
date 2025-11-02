import React from "react";
import "./healthcare-landing.css";

export default function TechnologyPage() {
  return (
    <div className="tech-root">
      <header className="hl-nav">
        <div className="hl-container hl-nav-inner">
          <div className="hl-logo">HOPPR X-ray</div>

          <nav className="hl-nav-links">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/technology" className="is-active">
              Technology
            </a>
            <a href="/login">Demo</a>
          </nav>
        </div>
      </header>

      <main className="tech-container">
        <h1 className="tech-title">The Technology Behind Hoppr AI</h1>
        <p className="tech-sub">
          Hoppr uses cutting-edge vision-language models to bridge the gap between 
          medical imaging and natural language understanding. Our architecture 
          ensures transparency, interpretability, and fairness in clinical decision support.
        </p>

        <div className="tech-grid">
          <div className="tech-card">
            <img src="/images/Vlm.png" alt="VLM Architecture" />
            <h2>Vision-Language Models (VLMs)</h2>
            <p>
              Hoppr integrates multimodal AI that interprets both visual and textual data. 
              The model is trained on curated medical image–text pairs, enabling it to generate 
              interpretable reports directly from chest X-rays.
            </p>
          </div>

          <div className="tech-card">
            <img src="/images/Explainable.png" alt="Explainable AI" />
            <h2>Explainable AI (XAI)</h2>
            <p>
              Each model decision is paired with saliency-based visualizations that highlight 
              the regions influencing predictions. This transparency builds trust for doctors and radiologists.
            </p>
          </div>

          <div className="tech-card">
            <img src="/images/Privacy.png" alt="Data Security" />
            <h2>Data Privacy & Security</h2>
            <p>
              Hoppr ensures all patient data remains private with local file processing. 
              The system complies with healthcare data standards, using encryption and secure local storage.
            </p>
          </div>

          <div className="tech-card">
            <img src="/images/Model.webp" alt="Model Training" />
            <h2>Model Training & Optimization</h2>
            <p>
              Our models are fine-tuned using medical image benchmarks such as NIH-CXR and CheXpert, 
              leveraging adaptive loss functions for robust generalization across unseen cases.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
