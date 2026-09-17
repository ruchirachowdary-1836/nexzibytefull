import React from "react";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap, Landmark } from "lucide-react";
import { PASSES } from "../data/mockData.js";
import { useApp } from "../context/AppContext.jsx";

export default function Passes() {
  const { openPassModal } = useApp();
  const navigate = useNavigate();

  const getPassBadgeClass = (id) => {
    switch (id) {
      case "student-pass": return "student";
      case "founder-pass": return "founder";
      case "visitor-pass": return "visitor";
      case "delegation-pass":
      case "delegate-pass": return "delegate";
      default: return "visitor";
    }
  };

  const getPassBtnClass = (pass) => {
    if (pass.id === "founder-pass") return "btn-amber";
    if (pass.id === "student-pass") return "btn-teal";
    if (pass.id === "delegation-pass") return "btn-coral";
    return "btn-primary";
  };

  return (
    <section className="section-padding passes-section" id="passes">
      <div className="container-wide">
        <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto" }}>
          <span className="section-label">
            <Sparkles size={13} />
            EVENT ACCREDITATION &amp; PASSES
          </span>
          <h2 className="section-heading">Choose Your TechTalk Pass</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Four tailored accreditation paths designed for Students, Founders, Community Visitors, and Corporate Delegations.
          </p>
        </div>

        <div className="passes-grid-4">
          {PASSES.map((pass) => (
            <div 
              key={pass.id} 
              className={`pass-card pass-theme-${pass.color || "purple"} ${pass.highlight ? "pass-highlighted" : ""}`}
            >
              {pass.highlight && (
                <div className="pass-highlight-banner">
                  <Zap size={12} />
                  <span>RECOMMENDED FOR BUILDERS</span>
                </div>
              )}

              <span className={`pass-badge ${getPassBadgeClass(pass.id)}`}>
                {pass.badge}
              </span>

              <h3 className="pass-title">{pass.type}</h3>

              <div className="pass-price-row">
                <span className="pass-price-number">{pass.price}</span>
                {pass.price !== "FREE" && (
                  <span className="pass-price-period">
                    {pass.id === "delegation-pass" ? "/ attendee" : "/ all-access"}
                  </span>
                )}
              </div>

              <p className="pass-desc">{pass.description}</p>

              <div className="pass-features-header">INCLUDED PRIVILEGES:</div>

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
                  className={`btn ${getPassBtnClass(pass)}`}
                  style={{ width: "100%" }}
                  onClick={() => {
                    if (pass.id === "visitor-pass") {
                      openPassModal(pass.id);
                    } else {
                      navigate(`/checkout?pass=${pass.id}`);
                    }
                  }}
                >
                  {pass.buttonText}
                </button>

                {pass.id !== "visitor-pass" && (
                  <div style={{ 
                    fontSize: "0.725rem", 
                    color: "var(--text-muted)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    gap: "4px", 
                    marginTop: "6px" 
                  }}>
                    <Landmark size={12} style={{ color: "#004c8f" }} />
                    <span>Indian Banks (SBI, HDFC, ICICI), UPI &amp; Cards</span>
                  </div>
                )}

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
