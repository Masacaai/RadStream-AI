import { Link } from "react-router-dom";
import "./landing.css";

export default function Landing() {
  return (
    <div className="lp-root">
      {/* NAV */}
      <header className="lp-nav">
        <div className="lp-container lp-nav-inner">
          <div className="lp-logo">Hoppr X-ray</div>
          <nav className="lp-nav-links">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#faq">FAQ</a>
            <Link className="lp-btn lp-btn-outline" to="/app">Open Demo</Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-container lp-hero-grid">
          <div className="lp-hero-copy">
            <h1>Instant Chest X-ray Insights</h1>
            <p className="lp-sub">
              Upload a DICOM to get a concise report and risk scores for key findings —
              powered by Hoppr.
            </p>
            <div className="lp-cta-row">
              <Link className="lp-btn" to="/app">Try the demo</Link>
              <a className="lp-btn lp-btn-ghost" href="#how">How it works</a>
            </div>
            <div className="lp-badges">
              <span className="lp-badge">Built for MTCHacks 2025</span>
              <span className="lp-dot">•</span>
              <span className="lp-badge">Hoppr AI Track</span>
            </div>
          </div>

          <div className="lp-hero-card">
            <div className="lp-window">
              <div className="lp-window-bar">
                <span/><span/><span/>
              </div>
              <div className="lp-window-body">
                <div className="lp-skeleton">
                  <div className="lp-skel-left">
                    <div className="lp-skel-line wide"/>
                    <div className="lp-skel-btn"/>
                    <div className="lp-skel-check"/>
                    <div className="lp-skel-check"/>
                    <div className="lp-skel-check"/>
                  </div>
                  <div className="lp-skel-right">
                    <div className="lp-skel-chip"/>
                    <div className="lp-skel-box"/>
                    <div className="lp-skel-row"/>
                    <div className="lp-skel-row"/>
                    <div className="lp-skel-row"/>
                  </div>
                </div>
              </div>
            </div>
            <div className="lp-caption">Demo UI preview</div>
          </div>
        </div>
      </section>

      {/* VALUE */}
      <section id="features" className="lp-section">
        <div className="lp-container">
          <h2>Why this matters</h2>
          <div className="lp-cards">
            <div className="lp-card">
              <h3>Readable report</h3>
              <p>Generate a clinician-style findings paragraph with a VLM.</p>
            </div>
            <div className="lp-card">
              <h3>Key conditions</h3>
              <p>Get scores for pneumothorax, cardiomegaly, pleural effusion, and more.</p>
            </div>
            <div className="lp-card">
              <h3>Privacy-first</h3>
              <p>Your API key stays server-side via a lightweight proxy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="lp-section lp-section-alt">
        <div className="lp-container">
          <h2>How it works</h2>
          <ol className="lp-steps">
            <li><span>1</span> Create a study container.</li>
            <li><span>2</span> Upload a DICOM (.dcm).</li>
            <li><span>3</span> Get a VLM report + classifier scores.</li>
          </ol>
          <div className="lp-center">
            <Link className="lp-btn" to="/app">Open the demo</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="lp-section">
        <div className="lp-container">
          <h2>FAQ</h2>
          <div className="lp-faq">
            <details>
              <summary>Is this a medical device?</summary>
              <p>No — this is a hackathon demo for research/education only.</p>
            </details>
            <details>
              <summary>Which files are supported?</summary>
              <p>DICOM files (.dcm). Batch upload is on the roadmap.</p>
            </details>
            <details>
              <summary>Where is data processed?</summary>
              <p>Sent securely to Hoppr API via our server proxy; your browser never sees the key.</p>
            </details>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-container lp-footer-inner">
          <div>© {new Date().getFullYear()} Hoppr X-ray (MTCHacks 2025)</div>
          <div className="lp-footer-links">
            <a href="#features">Features</a>
            <a href="#faq">FAQ</a>
            <Link to="/app">Demo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
