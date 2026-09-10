import React from "react";
import { BookOpen, Users, Hammer, Sparkles, ArrowRight } from "lucide-react";

export default function CommunityIntro() {
  return (
    <section className="section-padding" id="community-intro">
      <div className="container">
        <div className="community-intro-grid">
          {/* LEFT: Large Technology / Community Photograph */}
          <div className="community-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80"
              alt="NexziByte TechTalk Builders Community"
              className="community-photo"
              loading="lazy"
            />
            <div className="community-photo-badge">
              <span style={{ color: "var(--primary-purple)", marginRight: "6px" }}>●</span>
              NexziByte Technology Ecosystem 2026
            </div>
          </div>

          {/* RIGHT: Editorial Content & Three Mini Features */}
          <div className="community-content-column">
            <span className="section-label">
              <Sparkles size={13} />
              MORE THAN AN EVENT
            </span>

            <h2 className="section-heading">
              A community built for people who create what comes next.
            </h2>

            <p className="section-subtitle" style={{ marginBottom: "28px" }}>
              NexziByte TechTalk brings together developers, students, founders, entrepreneurs, 
              technology professionals and innovators through technical content, events, summits 
              and meaningful networking.
            </p>

            <div className="community-pillars-list">
              {/* Mini Feature 1: Learn */}
              <div className="pillar-item">
                <div className="pillar-icon-box">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="pillar-title">Learn</h3>
                  <p className="pillar-desc">
                    Discover practical technical knowledge from industry professionals.
                  </p>
                </div>
              </div>

              {/* Mini Feature 2: Connect */}
              <div className="pillar-item">
                <div className="pillar-icon-box">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="pillar-title">Connect</h3>
                  <p className="pillar-desc">
                    Meet developers, founders, speakers and technology leaders.
                  </p>
                </div>
              </div>

              {/* Mini Feature 3: Build */}
              <div className="pillar-item">
                <div className="pillar-icon-box">
                  <Hammer size={20} />
                </div>
                <div>
                  <h3 className="pillar-title">Build</h3>
                  <p className="pillar-desc">
                    Turn ideas, knowledge and connections into real opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
