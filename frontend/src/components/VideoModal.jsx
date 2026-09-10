import React from "react";
import { X, Sparkles, MapPin, Calendar, Users } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

export default function VideoModal() {
  const { videoModalOpen, setVideoModalOpen } = useApp();

  if (!videoModalOpen) return null;

  return (
    <div className="modal-backdrop-overlay" onClick={() => setVideoModalOpen(false)}>
      <div 
        className="modal-content-card" 
        style={{ maxWidth: "800px", padding: "28px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={() => setVideoModalOpen(false)}
          aria-label="Close video player"
        >
          <X size={18} />
        </button>

        <div style={{ marginBottom: "16px" }}>
          <span className="section-label">
            <Sparkles size={13} />
            CINEMATIC PREVIEW
          </span>
          <h3 style={{ fontSize: "1.45rem", fontWeight: 800 }}>
            NexziByte TechTalk 2026 Highlight Reel
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            A glimpse into our stage sessions, networking salons, and developer community.
          </p>
        </div>

        <div style={{
          position: "relative",
          paddingBottom: "56.25%",
          height: 0,
          borderRadius: "12px",
          overflow: "hidden",
          background: "#000000",
          boxShadow: "var(--shadow-lg)"
        }}>
          <video
            autoPlay
            controls
            playsInline
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-39760-large.mp4" type="video/mp4" />
          </video>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "20px",
          paddingTop: "14px",
          borderTop: "1px solid var(--border-color)",
          fontSize: "0.875rem",
          color: "var(--text-secondary)"
        }}>
          <div style={{ display: "flex", gap: "16px" }}>
            <span>📍 Hyderabad, India</span>
            <span>🎤 50+ Keynotes</span>
            <span>👥 1000+ Builders</span>
          </div>

          <a href="#passes" className="btn btn-primary btn-sm" onClick={() => setVideoModalOpen(false)}>
            Get Your Pass
          </a>
        </div>
      </div>
    </div>
  );
}
