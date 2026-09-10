import React from "react";
import { PARTNER_COMPANIES } from "../data/mockData.js";

export default function LogoMarquee() {
  // Duplicate for seamless infinite marquee loop
  const marqueeItems = [...PARTNER_COMPANIES, ...PARTNER_COMPANIES, ...PARTNER_COMPANIES];

  return (
    <section className="trusted-section">
      <div className="container">
        <div className="trusted-header">
          <h2 className="trusted-heading">People Building the Future</h2>
          <p className="trusted-subtitle">
            Connect with professionals, founders, developers and technology enthusiasts.
          </p>
        </div>

        <div className="marquee-container" aria-label="Partner Technology Companies">
          <div className="marquee-content">
            {marqueeItems.map((comp, idx) => (
              <div key={`${comp.name}-${idx}`} className="marquee-logo-item">
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "30px",
                  height: "30px",
                  borderRadius: "6px",
                  background: "var(--bg-main)",
                  border: "1px solid var(--border-color)",
                  fontSize: "0.8125rem",
                  fontWeight: 800,
                  color: "var(--primary-purple)",
                  marginRight: "6px"
                }}>
                  {comp.symbol}
                </span>
                <span>{comp.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
