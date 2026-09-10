import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero-section-dark" id="hero">
      {/* Background Hero Image with atmospheric overlays */}
      <div className="hero-image-bg-container">
        <img 
          src="/images/hero-meeting.png" 
          alt="NexziByte TechTalk Collaboration" 
          className="hero-image-element" 
        />
        <div className="hero-dark-overlay"></div>
        <div className="hero-ambient-blue-glow"></div>
        <div className="hero-ambient-purple-glow"></div>
      </div>

      <div className="container-wide" style={{ position: "relative", zIndex: 3 }}>
        <div className="hero-content-grid-dark">
          {/* Main Hero Content */}
          <div className="hero-text-column-dark">
            <div className="hero-badge-wrap">
              <span className="hero-badge-dark">
                <Sparkles size={14} style={{ color: "var(--coral)" }} />
                NEXZIBYTE TECHTALK 2026
              </span>
            </div>

            <h1 className="hero-heading-dark">
              Where Technology Meets{" "}
              <span className="hero-highlight-vibrant">Ideas, People &amp; Possibilities.</span>
            </h1>

            <p className="hero-description-dark">
              Connect with developers, founders, innovators, and technology leaders. 
              Discover new ideas, experience powerful conversations, and build meaningful 
              connections that shape the future of technology.
            </p>

            <div className="hero-btn-row">
              <button 
                type="button" 
                className="btn btn-primary btn-lg"
                onClick={() => navigate("/summits")}
              >
                <span>Explore Summits</span>
                <ArrowRight size={18} />
              </button>

              <button 
                type="button"
                className="btn btn-glass-dark btn-lg"
                onClick={() => {
                  const el = document.getElementById("explore-tech");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore TechTalk
              </button>
            </div>

            <div className="hero-supporting-text-dark">
              <CheckCircle2 size={16} style={{ color: "#34D399" }} />
              <span>Join a growing community of technology enthusiasts, builders and innovators.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
