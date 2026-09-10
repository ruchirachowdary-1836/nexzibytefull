import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { FOUNDER_MEETS_DATA } from "../data/mockData.js";
import { useApp } from "../context/AppContext.jsx";

export default function FounderMeets() {
  const { openPassModal } = useApp();

  return (
    <section className="section-padding" id="founder-meets">
      <div className="container">
        <div className="founder-meets-grid">
          {/* LEFT: Editorial Content & Mission */}
          <div>
            <span className="section-label coral">
              <Sparkles size={13} />
              VENTURE &amp; COLLABORATION CIRCLES
            </span>

            <h2 className="section-heading" style={{ fontSize: "clamp(2.2rem, 3.8vw, 3rem)" }}>
              {FOUNDER_MEETS_DATA.heading}
            </h2>

            <p className="section-subtitle" style={{ marginBottom: "20px" }}>
              {FOUNDER_MEETS_DATA.description}
            </p>

            <div className="founder-tagline-box">
              "{FOUNDER_MEETS_DATA.tagline}"
            </div>

            <div className="founder-stats-strip">
              {FOUNDER_MEETS_DATA.stats.map((st) => (
                <div key={st.label} className="founder-stat-item">
                  <strong>{st.value}</strong>
                  <span>{st.label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
              {FOUNDER_MEETS_DATA.highlights.map((item, idx) => (
                <div key={idx} className="founder-highlight-item">
                  <CheckCircle2 size={17} style={{ color: "var(--coral)", flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link 
                to="/founder-meets"
                className="btn btn-coral btn-lg"
              >
                Explore Founder Meets &amp; Circles <ArrowRight size={18} />
              </Link>
              <button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={() => openPassModal("delegate-pass")}
              >
                Apply for Delegate Pass
              </button>
            </div>
          </div>

          {/* RIGHT: Original Founder Meets Image */}
          <div className="founder-meets-image-wrap">
            <img 
              src={FOUNDER_MEETS_DATA.image} 
              alt="Founder Meets" 
              className="founder-meets-img" 
              loading="lazy" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
