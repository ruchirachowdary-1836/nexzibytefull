import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Calendar, MapPin, ArrowRight, Sparkles, Clock, Users, 
  Tag, ExternalLink, Filter, BookOpen 
} from "lucide-react";
import { UPCOMING_EVENTS } from "../data/mockData.js";
import { useApp } from "../context/AppContext.jsx";

const CATEGORY_TABS = [
  { id: "all", label: "All Summits & Meets", count: UPCOMING_EVENTS.length },
  { id: "summits", label: "Global Summits", count: UPCOMING_EVENTS.filter(e => e.category === "summits").length },
  { id: "launches", label: "Product Launches", count: UPCOMING_EVENTS.filter(e => e.category === "launches").length },
  { id: "roundtables", label: "Executive Meets", count: UPCOMING_EVENTS.filter(e => e.category === "roundtables").length },
  { id: "partnerships", label: "Strategic MoUs", count: UPCOMING_EVENTS.filter(e => e.category === "partnerships").length },
];

export default function UpcomingEvents() {
  const { openPassModal, openSummitModal } = useApp();
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredEvents = UPCOMING_EVENTS.filter((ev) => {
    if (activeFilter === "all") return true;
    return ev.category === activeFilter;
  });

  return (
    <section className="section-padding" id="upcoming-events">
      <div className="container">
        {/* Section Header */}
        <div className="upcoming-events-header">
          <div style={{ maxWidth: "720px" }}>
            <span className="section-label">
              <Sparkles size={13} />
              SUMMITS, MEETS &amp; MILESTONES
            </span>
            <h2 className="section-heading">NexziByte Summits &amp; Executive Meets</h2>
            <p className="section-subtitle">
              Explore our landmark product unveilings, global capability summits, leadership roundtables, and strategic business collaborations.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="events-count-pill">
            <span className="events-count-number">{UPCOMING_EVENTS.length}</span>
            <span>Active Summits &amp; Milestones</span>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="events-filter-bar">
          <div className="events-filter-scroll">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`events-tab-btn ${activeFilter === tab.id ? "active" : ""}`}
                onClick={() => setActiveFilter(tab.id)}
              >
                <span>{tab.label}</span>
                <span className="events-tab-count">{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Summits & Events Grid */}
        <div className="upcoming-events-grid">
          {filteredEvents.map((ev) => (
            <div 
              key={ev.id} 
              className="event-card summit-card-enhanced"
              onClick={() => openSummitModal(ev)}
            >
              {/* Card Image Banner */}
              <div className="event-card-image-wrap">
                <img 
                  src={ev.image} 
                  alt={ev.title} 
                  className="event-card-img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/renewable-energy.jpg";
                  }}
                />
                <span className="event-type-tag">{ev.type}</span>
                {ev.badge && (
                  <span className="event-badge-tag">{ev.badge}</span>
                )}
                {ev.number && (
                  <span className="event-index-tag">#{ev.number}</span>
                )}
              </div>

              {/* Card Content Body */}
              <div className="event-card-body">
                <div className="event-meta-header">
                  <div className="event-date-row">
                    <Calendar size={14} />
                    <span>{ev.date}</span>
                  </div>
                  {ev.spotsLeft && (
                    <span className="event-status-pill">
                      {ev.spotsLeft} Open
                    </span>
                  )}
                </div>

                <h3 className="event-card-heading">{ev.title}</h3>

                <div className="event-location-row">
                  <MapPin size={14} style={{ color: "var(--coral)", flexShrink: 0 }} />
                  <span>{ev.venue || ev.location}</span>
                </div>

                {ev.dignitaries && (
                  <div className="event-dignitary-badge">
                    <Users size={13} style={{ color: "#16A34A", flexShrink: 0 }} />
                    <span>{ev.dignitaries}</span>
                  </div>
                )}

                <p className="event-card-text">{ev.description}</p>

                {/* Hashtags Preview */}
                {ev.hashtags && ev.hashtags.length > 0 && (
                  <div className="event-hashtags-preview">
                    {ev.hashtags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="event-mini-tag">
                        {tag}
                      </span>
                    ))}
                    {ev.hashtags.length > 3 && (
                      <span className="event-mini-tag-more">
                        +{ev.hashtags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Footer Actions */}
                <div className="event-card-footer">
                  <button
                    type="button"
                    className="view-event-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openSummitModal(ev);
                    }}
                  >
                    <span>Read Full Announcement</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty Filter State */}
        {filteredEvents.length === 0 && (
          <div className="events-empty-state">
            <BookOpen size={40} style={{ opacity: 0.4, marginBottom: "12px" }} />
            <h3>No events found in this category</h3>
            <p>Try switching to "All Summits &amp; Meets" to view all milestones.</p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ marginTop: "16px" }}
              onClick={() => setActiveFilter("all")}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
