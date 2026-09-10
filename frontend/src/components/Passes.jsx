import React from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { PASSES } from "../data/mockData.js";
import { useApp } from "../context/AppContext.jsx";

export default function Passes() {
  const { openPassModal } = useApp();

  return (
    <section className="section-padding passes-section" id="passes">
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto" }}>
          <span className="section-label">
            <Sparkles size={13} />
            EVENT ACCREDITATION &amp; PASSES
          </span>
          <h2 className="section-heading">Choose Your TechTalk Pass</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Simple access. Real connections. Valuable experiences.
          </p>
        </div>

        <div className="passes-grid">
          {PASSES.map((pass) => (
            <div 
              key={pass.id} 
              className={`pass-card ${pass.highlight ? "pass-highlighted" : ""}`}
            >
              <span className={`pass-badge ${pass.id === "visitor-pass" ? "visitor" : "delegate"}`}>
                {pass.badge}
              </span>

              <h3 className="pass-title">{pass.type}</h3>

              <div className="pass-price-row">
                <span className="pass-price-number">{pass.price}</span>
              </div>

              <p className="pass-desc">{pass.description}</p>

              <ul className="pass-features-list">
                {pass.features.map((feature) => (
                  <li key={feature} className="pass-feature-item">
                    <Check className="pass-feature-check" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="pass-btn-wrap">
                <button
                  type="button"
                  className={`btn ${pass.highlight ? "btn-coral" : "btn-primary"}`}
                  style={{ width: "100%" }}
                  onClick={() => openPassModal(pass.id)}
                >
                  {pass.buttonText}
                </button>

                {pass.subtext && (
                  <div className="pass-subtext">{pass.subtext}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
