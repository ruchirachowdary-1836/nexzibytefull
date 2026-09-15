import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  X, Calendar, MapPin, Sparkles, Share2, Bookmark, CheckCircle2, 
  Users, Tag, ArrowRight, ExternalLink 
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";

export default function SummitModal() {
  const { 
    summitModalOpen, 
    setSummitModalOpen, 
    selectedSummit, 
    openPassModal, 
    showToast 
  } = useApp();
  const [registering, setRegistering] = React.useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && summitModalOpen) {
        setSummitModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [summitModalOpen, setSummitModalOpen]);

  useEffect(() => {
    if (!summitModalOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [summitModalOpen]);

  if (!summitModalOpen || !selectedSummit) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(`🔗 Link to "${selectedSummit.title}" copied to clipboard!`);
    } else {
      showToast("Link ready to share!");
    }
  };

  const handleTagClick = (tag) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(tag);
      showToast(`Tag ${tag} copied to clipboard!`);
    }
  };

  const handleRegister = async () => {
    if (!selectedSummit?.id) return;
    setRegistering(true);
    try {
      await api.registerForEvent(selectedSummit.eventType || "founder_meet", Number(selectedSummit.id));
      showToast("Your event registration was submitted.");
    } catch (error) {
      showToast(error.message);
    } finally {
      setRegistering(false);
    }
  };

  return createPortal((
    <div 
      className="modal-backdrop-overlay" 
      onClick={() => setSummitModalOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="summit-modal-title"
    >
      <div 
        className="modal-content-card summit-modal-card" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={() => setSummitModalOpen(false)}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Header Visual Banner */}
        <div className="summit-modal-hero">
          <img 
            src={selectedSummit.image} 
            alt={selectedSummit.title} 
            className="summit-modal-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/renewable-energy.jpg";
            }}
          />
          <div className="summit-modal-overlay">
            <div className="summit-modal-tags-row">
              <span className="summit-badge-pill">
                <Sparkles size={12} />
                {selectedSummit.badge || selectedSummit.type}
              </span>
              <span className="summit-type-pill">
                {selectedSummit.type}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="summit-modal-body">
          {/* Metadata Row */}
          <div className="summit-modal-meta-row">
            <div className="summit-meta-item">
              <Calendar size={15} style={{ color: "#16A34A" }} />
              <span>{selectedSummit.date}</span>
            </div>
            <div className="summit-meta-item">
              <MapPin size={15} style={{ color: "var(--coral)" }} />
              <span>{selectedSummit.venue || selectedSummit.location}</span>
            </div>
            {selectedSummit.dignitaries && (
              <div className="summit-meta-item">
                <Users size={15} style={{ color: "var(--electric-blue)" }} />
                <span>{selectedSummit.dignitaries}</span>
              </div>
            )}
          </div>

          <h2 id="summit-modal-title" className="summit-modal-title">
            {selectedSummit.title}
          </h2>

          {selectedSummit.statement && (
            <div className="summit-modal-quote">
              "{selectedSummit.statement}"
            </div>
          )}

          {/* Full Announcement Text */}
          <div className="summit-modal-text-content">
            {selectedSummit.fullContent ? (
              selectedSummit.fullContent.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))
            ) : (
              <p>{selectedSummit.description}</p>
            )}
          </div>

          {/* Hashtags Section */}
          {selectedSummit.hashtags && selectedSummit.hashtags.length > 0 && (
            <div className="summit-modal-hashtags-wrap">
              <span className="hashtags-label">
                <Tag size={13} />
                Tags:
              </span>
              <div className="hashtags-list">
                {selectedSummit.hashtags.map((tag, idx) => (
                  <button 
                    key={idx} 
                    type="button" 
                    className="hashtag-pill-btn"
                    onClick={() => handleTagClick(tag)}
                    title="Click to copy tag"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="summit-modal-footer">
            <div className="summit-modal-footer-actions">
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={handleShare}
              >
                <Share2 size={15} />
                <span>Share</span>
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => showToast("Summit saved to your calendar list.")}
              >
                <Bookmark size={15} />
                <span>Bookmark</span>
              </button>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={handleRegister}
                disabled={registering}
              >
                {registering ? "Registering..." : "Apply / Register"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ), document.body);
}
