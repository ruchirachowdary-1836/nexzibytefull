import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Ticket } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

export default function FinalCTA() {
  const { openPassModal } = useApp();

  return (
    <section className="final-cta-section" id="join-techtalk">
      {/* Subtle Coral Ambient Glow Accent */}
      <div className="final-cta-coral-accent" aria-hidden="true"></div>

      <div className="container">
        <div className="final-cta-inner">
          <span className="section-label">
            <Sparkles size={13} />
            JOIN THE ECOSYSTEM
          </span>

          <h2 className="final-cta-heading">
            Your Next Connection Could Change Everything.
          </h2>

          <p className="final-cta-desc">
            Join NexziByte TechTalk and become part of a community building what's next in technology.
          </p>

          <div className="final-cta-btn-row">
            <button 
              type="button" 
              className="btn btn-primary btn-lg"
              onClick={() => {
                const el = document.getElementById("summits");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Sparkles size={18} />
              <span>Explore Upcoming Summits</span>
            </button>

            <button 
              type="button" 
              className="btn btn-secondary btn-lg"
              onClick={() => {
                const el = document.getElementById("founder-meets");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <ArrowRight size={18} style={{ color: "var(--coral)" }} />
              <span>Connect at Founder Meets</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
