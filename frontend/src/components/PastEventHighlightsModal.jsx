import React from "react";
import { X, Calendar, MapPin, Sparkles, CheckCircle2, Award, Building, Share2 } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

export default function PastEventHighlightsModal({ event, isOpen, onClose }) {
  const { showToast } = useApp();

  if (!isOpen || !event) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Highlights link copied to clipboard!");
    } else {
      showToast("Shared event highlights!");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="past-modal-title">
      <div 
        className="modal-container past-event-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          type="button"
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Banner image */}
        <div className="past-modal-banner-wrap">
          <img 
            src={event.image} 
            alt={event.title} 
            className="past-modal-banner-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/summit-gpacts.jpg";
            }}
          />
          <div className="past-modal-banner-overlay">
            <span className="past-category-tag">{event.category}</span>
            <h2 id="past-modal-title" className="past-modal-title">{event.title}</h2>
            <div className="past-modal-meta">
              <div className="past-meta-item">
                <Calendar size={15} />
                <span>{event.date}</span>
              </div>
              <div className="past-meta-item">
                <MapPin size={15} />
                <span>{event.venue || event.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="past-modal-body">
          {/* Stats Bar */}
          {event.stats && event.stats.length > 0 && (
            <div className="past-stats-grid">
              {event.stats.map((st, i) => (
                <div key={i} className="past-stat-card">
                  <div className="past-stat-value">{st.value}</div>
                  <div className="past-stat-label">{st.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="past-modal-section">
            <h3 className="past-section-heading">Event Overview</h3>
            <p className="past-modal-text">{event.description}</p>
          </div>

          {/* Key Highlights */}
          {event.highlights && event.highlights.length > 0 && (
            <div className="past-modal-section">
              <h3 className="past-section-heading">Key Highlights &amp; Outcomes</h3>
              <ul className="past-highlights-list">
                {event.highlights.map((item, idx) => (
                  <li key={idx} className="past-highlight-item">
                    <CheckCircle2 size={16} className="text-blue-accent flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Leadership Quote / Recap Statement */}
          {event.recapStatement && (
            <div className="past-quote-card">
              <div className="past-quote-mark">“</div>
              <p className="past-quote-text">{event.recapStatement}</p>
              <div className="past-quote-author">
                <strong>NexziByte Leadership &amp; Community Dispatch</strong>
              </div>
            </div>
          )}

          <div className="past-modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={handleShare}
            >
              <Share2 size={15} />
              <span>Share Highlights</span>
            </button>
            <button 
              type="button" 
              className="btn btn-blue-primary btn-sm"
              onClick={onClose}
            >
              Close Highlights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
