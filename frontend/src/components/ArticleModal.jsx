import React from "react";
import { X, Clock, User, Share2, Sparkles, Bookmark } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

export default function ArticleModal() {
  const { articleModalOpen, setArticleModalOpen, selectedArticle, showToast } = useApp();

  if (!articleModalOpen || !selectedArticle) return null;

  return (
    <div className="modal-backdrop-overlay" onClick={() => setArticleModalOpen(false)}>
      <div 
        className="modal-content-card" 
        style={{ maxWidth: "720px", padding: "36px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={() => setArticleModalOpen(false)}
          aria-label="Close article"
        >
          <X size={18} />
        </button>

        <div>
          <span className="section-label">
            <Sparkles size={13} />
            {selectedArticle.category}
          </span>

          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginTop: "8px", lineHeight: 1.25 }}>
            {selectedArticle.title}
          </h2>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
            margin: "16px 0 24px",
            paddingBottom: "16px",
            borderBottom: "1px solid var(--border-color)"
          }}>
            <span style={{ fontWeight: 600, color: "var(--text-main)" }}>By {selectedArticle.author}</span>
            <span>•</span>
            <span>{selectedArticle.role}</span>
            <span>•</span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Clock size={13} />
              {selectedArticle.readingTime}
            </span>
          </div>

          <div style={{
            fontSize: "1.05rem",
            lineHeight: 1.7,
            color: "#27272A",
            display: "flex",
            flexDirection: "column",
            gap: "18px"
          }}>
            <p style={{ fontWeight: 500, color: "var(--text-secondary)", fontSize: "1.1rem" }}>
              {selectedArticle.excerpt}
            </p>
            <p>
              {selectedArticle.content}
            </p>
            <p>
              At NexziByte TechTalk, our technical tracks prioritize hands-on architectural rigor over speculative buzzwords. Every pattern highlighted above has been tested against real-world production constraints, multi-region database latencies, and high-frequency concurrency.
            </p>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "32px",
            paddingTop: "20px",
            borderTop: "1px solid var(--border-color)"
          }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => showToast("Article saved to your reading list.")}
              >
                <Bookmark size={15} />
                <span>Save Article</span>
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showToast("Article link copied to clipboard!");
                }}
              >
                <Share2 size={15} />
                <span>Share</span>
              </button>
            </div>

            <button 
              type="button" 
              className="btn btn-primary btn-sm"
              onClick={() => setArticleModalOpen(false)}
            >
              Done Reading
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
