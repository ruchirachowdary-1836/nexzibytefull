import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, Search, X, RotateCcw, Clock, MapPin, DollarSign, 
  ArrowRight, Briefcase, GraduationCap, CheckCircle2, ChevronDown, 
  ChevronUp, Award, Users, Rocket, HelpCircle, Layers, ShieldCheck
} from "lucide-react";
import { 
  INTERNSHIPS, 
  INTERNSHIP_CATEGORIES, 
  INTERNSHIP_HIGHLIGHTS, 
  INTERNSHIP_STEPS, 
  INTERNSHIP_FAQS 
} from "../data/internshipsData.js";
import { useApp } from "../context/AppContext.jsx";

export default function InternshipPage() {
  const { openInternshipModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  // Filter internships based on category & search query
  const filteredInternships = useMemo(() => {
    return INTERNSHIPS.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.categoryGroup === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchDesc = item.shortDesc?.toLowerCase().includes(q);
      const matchSkills = item.skills?.some(s => s.toLowerCase().includes(q));

      return matchTitle || matchCat || matchDesc || matchSkills;
    });
  }, [selectedCategory, searchQuery]);

  // Dynamic counts for category tabs
  const categoryCounts = useMemo(() => {
    const counts = { all: INTERNSHIPS.length };
    INTERNSHIPS.forEach((item) => {
      if (item.categoryGroup) {
        counts[item.categoryGroup] = (counts[item.categoryGroup] || 0) + 1;
      }
    });
    return counts;
  }, []);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="inner-page-wrapper internship-page-container">
      {/* 1. Page Hero Banner */}
      <div className="page-hero-banner" style={{ paddingBottom: "70px" }}>
        <div className="container">
          <div className="page-hero-badge">
            <Sparkles size={14} style={{ color: "#10B981" }} />
            <span>NEXZIBYTE TALENT ECOSYSTEM</span>
          </div>

          <h1 className="page-hero-title">
            Specialized Industry <span className="hero-highlight-vibrant">Internship Tracks</span>
          </h1>

          <p className="page-hero-subtitle" style={{ maxWidth: "800px" }}>
            Launch your career with hands-on enterprise projects, 1-on-1 architect mentorship, real production code deployments, and direct Pre-Placement Offer (PPO) opportunities across 23 specialized disciplines.
          </p>

          {/* Key Metric Cards */}
          <div className="internship-hero-stats-row">
            <div className="internship-stat-card">
              <div className="stat-card-val">23</div>
              <div className="stat-card-label">Specialized Tracks</div>
            </div>
            <div className="internship-stat-card">
              <div className="stat-card-val">1:1</div>
              <div className="stat-card-label">Senior Architect Mentorship</div>
            </div>
            <div className="internship-stat-card">
              <div className="stat-card-val">Stipend</div>
              <div className="stat-card-label">Performance Linked</div>
            </div>
            <div className="internship-stat-card">
              <div className="stat-card-val">65%+</div>
              <div className="stat-card-label">Direct PPO Conversion Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Internship Discovery Section */}
      <section className="section-padding" style={{ paddingTop: "50px", background: "var(--bg-white)" }} id="internship-catalog">
        <div className="container">
          {/* Section Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px", marginBottom: "36px" }}>
            <div>
              <span className="section-label">
                <Briefcase size={13} />
                ACTIVE HIRING COHORTS (HYDERABAD &amp; REMOTE)
              </span>
              <h2 className="section-heading" style={{ fontSize: "clamp(1.9rem, 3.2vw, 2.7rem)" }}>
                Explore Open Internship Positions
              </h2>
              <p className="section-subtitle" style={{ margin: 0 }}>
                Select your domain of interest to discover active openings, curriculum requirements, and application deadlines.
              </p>
            </div>

            <div className="courses-recruitment-callout">
              <div className="pulse-dot-green"></div>
              <div>
                <strong style={{ display: "block", fontSize: "0.875rem", color: "var(--text-main)" }}>
                  2024 - 2027 Batches Eligible
                </strong>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  Fast-Track 48-Hour Technical Screening
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar & Category Filter Pills */}
          <div className="courses-filter-controls">
            <div className="courses-filter-top-row">
              <div className="courses-search-bar">
                <Search size={16} className="courses-search-icon" />
                <input
                  type="text"
                  placeholder="Search by role, skills or tools (e.g. Python, AI, React, HR, DevOps, Data Science)..."
                  className="courses-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="courses-search-clear"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <div className="courses-count-badge">
                Showing {filteredInternships.length} of {INTERNSHIPS.length} Tracks
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="courses-category-pills" role="tablist">
              {INTERNSHIP_CATEGORIES.map((cat) => {
                const count = categoryCounts[cat.id] || 0;
                const isActive = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`course-filter-pill-btn ${isActive ? "active" : ""}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    role="tab"
                    aria-selected={isActive}
                  >
                    <span>{cat.label}</span>
                    <span className="course-filter-pill-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Internships Grid */}
          {filteredInternships.length > 0 ? (
            <div className="courses-cards-grid" style={{ marginTop: "32px" }}>
              {filteredInternships.map((item) => (
                <div key={item.id} className="course-card-premium internship-card-custom">
                  {/* Card Image Banner */}
                  <div className="course-image-box">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="course-card-img"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/ai-course.jpg";
                      }}
                    />
                    <div className="course-image-overlay">
                      <span className="course-category-tag">{item.category}</span>
                      {item.badge && (
                        <span className="course-badge-pill" style={{ background: "#10B981", color: "#FFFFFF" }}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="course-body-content">
                    {/* Title */}
                    <div style={{ marginBottom: "12px" }}>
                      <h3 className="course-card-title" style={{ fontSize: "1.25rem", lineHeight: 1.3 }}>
                        {item.title}
                      </h3>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                        <span className="internship-ppo-pill">
                          <CheckCircle2 size={12} style={{ color: "#16A34A" }} />
                          PPO Pathway
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                          {item.openings}
                        </span>
                      </div>
                    </div>

                    {/* Short Description */}
                    <p className="course-short-desc" style={{ minHeight: "68px" }}>
                      {item.shortDesc}
                    </p>

                    {/* Skills Chips */}
                    <div className="course-skills-block" style={{ marginTop: "12px", marginBottom: "16px" }}>
                      <div className="course-skills-label">
                        <span>Key Skills &amp; Tools:</span>
                      </div>
                      <div className="course-skills-tags">
                        {item.skills.slice(0, 4).map((skill) => (
                          <span key={skill} className="course-skill-chip">
                            {skill}
                          </span>
                        ))}
                        {item.skills.length > 4 && (
                          <span className="course-skill-chip" style={{ background: "var(--bg-white)", borderColor: "var(--border-color)", fontWeight: 700 }}>
                            +{item.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meta Row (Duration, Location, Stipend) */}
                    <div className="internship-meta-grid">
                      <div className="internship-meta-cell">
                        <Clock size={13} style={{ color: "var(--text-secondary)" }} />
                        <span>{item.duration}</span>
                      </div>
                      <div className="internship-meta-cell">
                        <MapPin size={13} style={{ color: "var(--coral)" }} />
                        <span>{item.location.split("/")[0]}</span>
                      </div>
                      <div className="internship-meta-cell" style={{ gridColumn: "1 / -1", color: "#065F46", background: "#ECFDF5", padding: "6px 10px", borderRadius: "6px", fontWeight: 600 }}>
                        <DollarSign size={13} style={{ color: "#10B981" }} />
                        <span>{item.stipend}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="course-actions-row" style={{ marginTop: "18px" }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ flex: 1 }}
                        onClick={() => openInternshipModal(item, "overview")}
                      >
                        <span>View Details</span>
                      </button>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1.2 }}
                        onClick={() => openInternshipModal(item, "apply")}
                      >
                        <span>Apply Now</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="courses-empty-state">
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "var(--soft-lavender)",
                color: "var(--primary-purple)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px"
              }}>
                <Search size={26} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "8px", color: "var(--text-main)" }}>
                No Internship Track Found
              </h3>
              <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
                We couldn't find any internships matching "{searchQuery}" in this category. Try adjusting your search query or view all available tracks.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleResetFilters}
              >
                <RotateCcw size={14} />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. Program Value Pillars & Benefits */}
      <section className="section-padding" style={{ background: "var(--bg-main)", borderTop: "1px solid var(--border-color)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 50px" }}>
            <span className="section-label">
              <Award size={13} />
              WHY INTERN AT NEXZIBYTE
            </span>
            <h2 className="section-heading">
              More Than An Internship. A Real Career Launchpad.
            </h2>
            <p className="section-subtitle">
              We reject trivial tasks and busywork. You will build and deploy mission-critical features with active engineering feedback from industry veterans.
            </p>
          </div>

          <div className="internship-benefits-grid">
            {INTERNSHIP_HIGHLIGHTS.map((item) => (
              <div key={item.number} className="internship-benefit-card">
                <span className="internship-benefit-number">{item.number}</span>
                <h3 className="internship-benefit-title">{item.title}</h3>
                <p className="internship-benefit-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Four-Step Application Roadmap */}
      <section className="section-padding" style={{ background: "var(--bg-white)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 50px" }}>
            <span className="section-label">
              <Rocket size={13} />
              SIMPLE, TRANSPARENT PROCESS
            </span>
            <h2 className="section-heading">
              How The Hiring Journey Works
            </h2>
            <p className="section-subtitle">
              Our 4-step selection journey moves fast — from initial application to offer letter in as few as 5 business days.
            </p>
          </div>

          <div className="internship-steps-grid">
            {INTERNSHIP_STEPS.map((step) => (
              <div key={step.step} className="internship-step-card">
                <div className="internship-step-badge">Step {step.step}</div>
                <h3 className="internship-step-title">{step.title}</h3>
                <p className="internship-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions */}
      <section className="section-padding" style={{ background: "var(--bg-main)", borderTop: "1px solid var(--border-color)" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="section-label">
              <HelpCircle size={13} />
              GOT QUESTIONS?
            </span>
            <h2 className="section-heading">
              Internship Program FAQs
            </h2>
            <p className="section-subtitle">
              Everything you need to know about eligibility, stipends, college credits, and full-time hiring.
            </p>
          </div>

          <div className="faq-accordion-wrap">
            {INTERNSHIP_FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className={`faq-item-card ${isOpen ? "open" : ""}`}
                  onClick={() => toggleFaq(index)}
                >
                  <button 
                    type="button" 
                    className="faq-question-btn"
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-text">{faq.q}</span>
                    <span className="faq-icon-wrap">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer-body">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Bottom Final CTA */}
      <section className="internship-bottom-cta">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="page-hero-badge" style={{ margin: "0 auto 16px" }}>
            <Sparkles size={14} style={{ color: "#34D399" }} />
            <span>APPLICATIONS OPEN FOR UPCOMING BATCH</span>
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 3.8vw, 3rem)", fontWeight: 850, color: "#FFFFFF", marginBottom: "16px" }}>
            Ready to Build Your Tech Career?
          </h2>
          <p style={{ fontSize: "1.0625rem", color: "rgba(255, 255, 255, 0.8)", maxWidth: "640px", margin: "0 auto 30px", lineHeight: 1.6 }}>
            Join hundreds of ambitious students and graduates currently gaining real production experience across our 23 engineering and business cohorts.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <a 
              href="#internship-catalog" 
              className="btn btn-primary"
              style={{ background: "#FFFFFF", color: "#0F172A", fontWeight: 800 }}
            >
              <span>Explore All 23 Tracks</span>
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
