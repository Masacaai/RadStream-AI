import { Link } from "react-router-dom";
import "./healthcare-landing.css";

export default function HealthcareLanding() {
  return (
    <div className="hl-root">
      {/* NAV */}
      <header className="hl-nav">
        <div className="hl-container hl-nav-inner">
          <div className="hl-logo">HOPPR X-ray</div>

          <nav className="hl-nav-links">
            <a href="#home" className="is-active">Home</a>
            <a href="#intro">About</a>
            <a href="#how">Technology</a>
            <a href="#services">Services</a>
          </nav>

          <div className="hl-nav-cta">
            <Link className="hl-btn hl-btn-black" to="/login">Try the demo</Link>
          </div>
        </div>
      </header>

      {/* HERO CARD */}
      <main id="home" className="hl-hero-wrap">
        <div className="hl-container">
          <section className="hl-hero-card">
            {/* left copy */}
            <div className="hl-left">
              <div className="hl-kicker">MTC Hacks 2025 • Hoppr AI Track</div>
              <h1 className="hl-title">Instant X-ray Insights</h1>
              <p className="hl-sub">
                Upload a DICOM and get a readable VLM report plus risk scores
                for key findings like pneumothorax, cardiomegaly, and pleural effusion —
                powered by Hoppr.
              </p>

              <div className="hl-cta-row">
                <Link to="/app" className="hl-btn hl-btn-black">Open demo</Link>
                <a href="#intro" className="hl-btn hl-btn-ghost">How it works</a>
              </div>

              <div className="hl-rating">
                <div className="hl-avatars">
                  <span style={{"--i":1}} className="hl-ava"></span>
                  <span style={{"--i":2}} className="hl-ava"></span>
                  <span style={{"--i":3}} className="hl-ava"></span>
                  <span style={{"--i":4}} className="hl-ava"></span>
                </div>
                <div className="hl-rating-text">
                  <strong>Demo project</strong> &nbsp;|&nbsp; For MTC Hacks 2025
                </div>
              </div>
            </div>

            {/* right image + overlays */}
            <div className="hl-right">
              <img className="hl-hero-img" src="/Baymax.jpg" alt="AI doctor robot" />

              {/* overlay: expert doctors */}
              <div className="hl-card doctors">
                <div className="hl-avatars small">
                  <span className="hl-ava"></span>
                  <span className="hl-ava"></span>
                  <span className="hl-ava"></span>
                </div>
                <div className="hl-card-text">
                  <strong>300+</strong><br/>Expert doctors
                </div>
              </div>

              {/* overlay: successful treatment */}
              <div className="hl-card success">
                <div className="hl-thumb"></div>
                <div className="hl-card-text">
                  <strong>5,000+</strong><br/>Successful Treatment
                </div>
              </div>

              {/* floating socials */}
              <ul className="hl-socials">
                <li><a aria-label="Facebook" href="#fb">f</a></li>
                <li><a aria-label="Twitter" href="#tw">x</a></li>
                <li><a aria-label="Instagram" href="#ig">◎</a></li>
              </ul>
            </div>
          </section>

          {/* INTRO / WHAT THIS IS */}
          <section id="intro" className="hl-intro">
            <div className="hl-container">
              <h2 style={{ margin: "0 0 10px" }}>What is this project?</h2>
              <p className="hl-intro-text">
                This MTCHacks 2025 demo uses <strong>Hoppr AI</strong> to convert an X-Ray
                <strong> DICOM</strong> into a concise <strong>vision-language model report</strong> and
                <strong> condition scores</strong> (e.g., pneumothorax, cardiomegaly, pleural effusion).
                The browser talks to a tiny <strong>Node/Express proxy</strong> so your API key stays server-side.
                Open the demo, upload a file, select models, and view results in seconds.
                
              </p>
              <div style={{ marginTop: 14 }}>
                <Link className="hl-btn hl-btn-black" to="/app">Open the demo</Link>
                <a className="hl-btn hl-btn-ghost" href="#how" style={{ marginLeft: 10 }}>See how it works</a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
