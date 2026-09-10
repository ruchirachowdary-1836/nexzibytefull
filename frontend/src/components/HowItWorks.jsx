import React from "react";
import { Sparkles, Compass, Ticket, Users, TrendingUp } from "lucide-react";
import { HOW_IT_WORKS_STEPS } from "../data/mockData.js";

const STEP_ICONS = {
  Compass: Compass,
  Ticket: Ticket,
  Users: Users,
  TrendingUp: TrendingUp
};

export default function HowItWorks() {
  return (
    <section className="section-padding" id="how-it-works">
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto" }}>
          <span className="section-label">
            <Sparkles size={13} />
            THE JOURNEY
          </span>
          <h2 className="section-heading">How It Works</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Four straightforward steps from joining the community to unlocking transformative opportunities.
          </p>
        </div>

        <div className="how-it-works-steps-grid">
          {/* Connecting Rail on Desktop */}
          <div className="how-it-works-rail" aria-hidden="true"></div>

          {HOW_IT_WORKS_STEPS.map((step) => {
            const IconComponent = STEP_ICONS[step.icon] || Sparkles;
            return (
              <div key={step.step} className="step-card">
                <div className="step-num-bubble">{step.step}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
