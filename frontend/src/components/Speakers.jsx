import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, ArrowRight, Mic, Search, Users, ExternalLink } from "lucide-react";
import { SPEAKERS } from "../data/mockData.js";
import { useApp } from "../context/AppContext.jsx";

function LinkedInIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z"/>
    </svg>
  );
}

export default function Speakers() {
  const { showToast } = useApp();
  const location = useLocation();
  const isDedicatedPage = location.pathname === "/speakers";

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: `All Keynotes (${SPEAKERS.length})` },
    { id: "leadership", label: "Founders & Leadership" },
    { id: "engineering", label: "Engineering & Tech" },
    { id: "marketing", label: "Growth & Marketing" }
  ];

  const filteredSpeakers = SPEAKERS.filter((speaker) => {
    const matchesCategory = activeCategory === "all" || speaker.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      speaker.name.toLowerCase().includes(q) ||
      speaker.role.toLowerCase().includes(q) ||
      speaker.company.toLowerCase().includes(q) ||
      speaker.topic.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const displayedSpeakers = isDedicatedPage ? filteredSpeakers : SPEAKERS;

  return (
    <section className="section-padding" id="speakers">
      <div className="container">
        {/* Section Heading & Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px", marginBottom: "36px" }}>
          <div style={{ maxWidth: "720px" }}>
            <span className="section-label">
              <Sparkles size={13} />
              KEYNOTE &amp; TECHNICAL LEADERSHIP
            </span>
            <h2 className="section-heading">Meet the Minds Shaping Technology</h2>
            <p className="section-subtitle">
              Learn directly from architects, researchers, and venture founders who build scalable systems and next-generation products.
            </p>
          </div>

          {!isDedicatedPage && (
            <Link to="/speakers" className="btn btn-secondary">
              <span>View All Speakers ({SPEAKERS.length})</span>
              <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {/* Dedicated Page Controls: Search + Categories */}
        {isDedicatedPage && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px" }}>
            <div style={{ position: "relative", maxWidth: "520px" }}>
              <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
              <input 
                type="text" 
                placeholder="Search speakers by name, role, company or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "46px", borderRadius: "var(--radius-full)" }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`btn btn-sm ${activeCategory === cat.id ? "btn-primary" : "btn-secondary"}`}
                  style={{ borderRadius: "var(--radius-full)" }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Speakers Grid with True Male & Female Profile Pictures */}
        <div className="speakers-grid">
          {displayedSpeakers.map((speaker) => (
            <div key={speaker.id} className="speaker-card speaker-card-enhanced">
              {/* Speaker Profile Image Wrap */}
              <div className="speaker-photo-wrap">
                <img 
                  src={speaker.image} 
                  alt={speaker.name} 
                  className="speaker-photo-img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = speaker.gender === "female"
                      ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80"
                      : "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80";
                  }}
                />
                <div className="speaker-company-badge">{speaker.company}</div>
              </div>

              {/* Speaker Card Content Body */}
              <div className="speaker-content">
                <div className="speaker-card-header">
                  <span className="speaker-badge-tag">
                    <Mic size={13} style={{ color: "#16A34A" }} />
                    {speaker.category === "ai" 
                      ? "AI RESEARCHER" 
                      : (speaker.category === "leadership" ? "LEADERSHIP KEYNOTE" : "KEYNOTE SPEAKER")}
                  </span>

                  <a 
                    href={speaker.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="speaker-linkedin-btn"
                    aria-label={`${speaker.name} LinkedIn`}
                    onClick={(e) => {
                      e.stopPropagation();
                      showToast(`Opening LinkedIn profile for ${speaker.name}...`);
                    }}
                  >
                    <LinkedInIcon size={16} />
                    <span>Connect</span>
                  </a>
                </div>

                <h3 className="speaker-name">{speaker.name}</h3>
                <div className="speaker-role">{speaker.role}</div>

                {speaker.bio && (
                  <p className="speaker-bio-snippet" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: "1.5" }}>
                    {speaker.bio}
                  </p>
                )}

                <div className="speaker-talk-box">
                  <div className="speaker-talk-label">
                    <Mic size={11} style={{ display: "inline", marginRight: "4px" }} />
                    Keynote Topic
                  </div>
                  <div className="speaker-talk-topic">{speaker.topic}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {displayedSpeakers.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
            <Users size={48} style={{ opacity: 0.3, marginBottom: "16px" }} />
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px" }}>No speakers found</h3>
            <p style={{ fontSize: "0.9375rem" }}>Try adjusting your search keywords or category filters.</p>
          </div>
        )}
      </div>
    </section>
  );
}
