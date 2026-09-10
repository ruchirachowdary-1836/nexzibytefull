import React from "react";
import { Sparkles, Camera } from "lucide-react";
import { COMMUNITY_COLLAGE_PHOTOS } from "../data/mockData.js";

export default function CommunityImpact() {
  return (
    <section className="section-padding" id="community-impact">
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto" }}>
          <span className="section-label">
            <Sparkles size={13} />
            MOMENTS &amp; MOMENTUM
          </span>
          <h2 className="section-heading">More Than Numbers</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Real energy, high-signal technical debate, and lasting collaborations captured across our events.
          </p>
        </div>

        {/* Highlight Stats Bar */}
        <div className="impact-stats-bar">
          <div className="impact-stat-col">
            <strong>5,000+</strong>
            <span>Community Members</span>
          </div>
          <div className="impact-stat-col">
            <strong style={{ color: "var(--coral)" }}>100+</strong>
            <span>Technical Topics</span>
          </div>
          <div className="impact-stat-col">
            <strong>50+</strong>
            <span>Speakers</span>
          </div>
          <div className="impact-stat-col">
            <strong style={{ color: "#FBBF24" }}>30+</strong>
            <span>Events Held</span>
          </div>
        </div>

        {/* Asymmetrical Editorial Photo Collage */}
        <div className="editorial-photo-collage">
          {COMMUNITY_COLLAGE_PHOTOS.map((photo, idx) => (
            <div key={idx} className={`collage-item item-${idx + 1}`}>
              <img 
                src={photo.image} 
                alt={photo.title} 
                className="collage-img"
                loading="lazy" 
              />
              <span className="collage-tag">{photo.category}: {photo.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
