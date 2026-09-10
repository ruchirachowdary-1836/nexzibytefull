import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, Calendar, MapPin, ArrowRight, CheckCircle, Video, Tag, Building2, Users 
} from "lucide-react";
import { FEATURED_SUMMIT, FEATURED_SUMMITS_LIST, UPCOMING_EVENTS } from "../data/mockData.js";
import { useApp } from "../context/AppContext.jsx";

export default function FeaturedSummit() {
  const { openPassModal, openSummitModal } = useApp();
  const [activeIdx, setActiveIdx] = useState(0);

  const summitsList = FEATURED_SUMMITS_LIST && FEATURED_SUMMITS_LIST.length > 0 
    ? FEATURED_SUMMITS_LIST 
    : [FEATURED_SUMMIT];

  const currentSummit = summitsList[activeIdx] || FEATURED_SUMMIT;

  const handleReadAnnouncement = () => {
    const matched = UPCOMING_EVENTS.find(e => e.id === currentSummit.id) || UPCOMING_EVENTS[0];
    openSummitModal(matched);
  };

  return (
    <section className="section-padding featured-summit-section" id="summits">
      <div className="container">
        {/* Summit Switcher Tabs if multiple summits */}
        {summitsList.length > 1 && (
          <div className="summit-switcher-nav" style={{ marginBottom: "28px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", marginRight: "4px" }}>
              Featured Milestone:
            </span>
            {summitsList.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                className={`summit-switch-btn ${activeIdx === idx ? "active" : ""}`}
                onClick={() => setActiveIdx(idx)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  border: activeIdx === idx ? "2px solid var(--primary-purple)" : "1px solid var(--border-color)",
                  background: activeIdx === idx ? "var(--primary-purple)" : "var(--bg-white)",
                  color: activeIdx === idx ? "#FFFFFF" : "var(--text-main)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all var(--transition-fast)",
                  boxShadow: activeIdx === idx ? "0 4px 14px rgba(108, 43, 217, 0.25)" : "none"
                }}
              >
                <Sparkles size={14} style={{ color: activeIdx === idx ? "#FFFFFF" : "var(--primary-purple)" }} />
                <span>{s.tag || s.title}</span>
              </button>
            ))}
          </div>
        )}

        <div className="featured-summit-grid">
          {/* LEFT: Content & Stats */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
              <span className="section-label" style={{ marginBottom: 0 }}>
                <Sparkles size={13} />
                {currentSummit.badge}
              </span>
              {currentSummit.date && (
                <span style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "var(--primary-purple)",
                  background: "var(--soft-lavender)",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-full)",
                  boxShadow: "0 2px 6px rgba(108, 43, 217, 0.2)"
                }}>
                  {currentSummit.date}
                </span>
              )}
            </div>

            <h2 className="section-heading" style={{ fontSize: "clamp(2.1rem, 3.6vw, 3.1rem)", lineHeight: 1.15 }}>
              {currentSummit.title}
            </h2>

            {currentSummit.subtitle && (
              <div style={{ fontSize: "1.0625rem", fontWeight: 600, color: "var(--coral)", marginTop: "-12px", marginBottom: "18px" }}>
                {currentSummit.subtitle}
              </div>
            )}

            <div className="summit-statement">
              "{currentSummit.statement}"
            </div>

            <p className="summit-desc">
              {currentSummit.description}
            </p>

            {/* Highlights bullet list */}
            {currentSummit.highlights && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                {currentSummit.highlights.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9375rem", color: "#374151" }}>
                    <CheckCircle size={16} style={{ color: "#16A34A", flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Stats Row */}
            <div className="summit-stats-row">
              {currentSummit.stats.map((st) => (
                <div key={st.label} className="summit-stat-item">
                  <strong>{st.value}</strong>
                  <span>{st.label}</span>
                </div>
              ))}
            </div>

            {/* Hashtags display */}
            {currentSummit.hashtags && currentSummit.hashtags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "26px" }}>
                {currentSummit.hashtags.slice(0, 6).map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--primary-purple)",
                      background: "rgba(108, 43, 217, 0.08)",
                      padding: "3px 10px",
                      borderRadius: "var(--radius-full)"
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="summit-actions-row">
              <Link
                to={`/summits/${currentSummit.id || "summit-gpacts-2026"}`}
                className="btn btn-coral"
              >
                View Full Summit Details &amp; Agenda <ArrowRight size={16} />
              </Link>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleReadAnnouncement}
              >
                Read Official Announcement
              </button>

              <Link 
                to="/summits"
                className="btn btn-secondary"
              >
                Explore All Summits
              </Link>
            </div>
          </div>

          {/* RIGHT: Large Conference Visual Showcase */}
          <div className="summit-image-box">
            <img 
              src={currentSummit.image} 
              alt={currentSummit.title} 
              className="summit-main-photo"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/renewable-energy.jpg";
              }}
            />
            <div className="summit-floating-venue-badge">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.875rem", fontWeight: 700, color: "var(--text-main)" }}>
                  <MapPin size={15} style={{ color: "var(--coral)" }} />
                  <span>{currentSummit.location}</span>
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                  World’s Biggest Pharma AI &amp; IT Summit — Hyderabad
                </div>
              </div>

              <span style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "var(--primary-purple)",
                background: "var(--soft-lavender)",
                padding: "6px 12px",
                borderRadius: "var(--radius-full)",
                boxShadow: "0 2px 8px rgba(108, 43, 217, 0.2)"
              }}>
                {currentSummit.date}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
