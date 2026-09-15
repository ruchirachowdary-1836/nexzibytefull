import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Clock, User, BookOpen } from "lucide-react";
import { TECHNICAL_ARTICLES } from "../data/mockData.js";
import { useApp } from "../context/AppContext.jsx";

export default function TechnicalContent() {
  const { openArticleReader } = useApp();

  return (
    <section className="section-padding technical-content-section" id="technical-content">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px", marginBottom: "40px" }}>
          <div style={{ maxWidth: "680px" }}>
            <span className="section-label">
              <Sparkles size={13} />
              ENGINEERING DISPATCHES
            </span>
            <h2 className="section-heading">Learn From the Community</h2>
            <p className="section-subtitle">
              In-depth architectural breakdowns, real-world case studies, and engineering practices shared by senior contributors.
            </p>
          </div>

          <Link to="/explore" className="btn btn-secondary">
            <span>Explore All Articles</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="articles-grid">
          {TECHNICAL_ARTICLES.map((art) => (
            <div 
              key={art.id} 
              className="article-card"
              onClick={() => openArticleReader(art)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && openArticleReader(art)}
            >
              <div className="article-category-tag">{art.category}</div>
              <h3 className="article-title">{art.title}</h3>
              <p className="article-excerpt">{art.excerpt}</p>

              <div className="article-meta-row">
                <div>
                  <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{art.author}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px", fontSize: "0.75rem" }}>
                    <Clock size={12} />
                    <span>{art.readingTime}</span>
                  </div>
                </div>

                <Link 
                  to={`/posts/${art.id}`} 
                  className="article-read-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Read Article</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
