import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, Sparkles, Clock, MapPin, Briefcase, GraduationCap, 
  Search, X, RotateCcw, CheckCircle2, Award, BookOpen
} from "lucide-react";
import { COURSES, COURSE_CATEGORIES } from "../data/coursesData.js";
import { useApp } from "../context/AppContext.jsx";

export default function TechnologyTopics() {
  const { openCourseModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter courses based on active category and search query
  const filteredCourses = useMemo(() => {
    return COURSES.filter((course) => {
      const matchesCategory =
        selectedCategory === "all" ||
        course.categoryGroup === selectedCategory ||
        (course.categoryGroups && course.categoryGroups.includes(selectedCategory));

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchSubtitle = course.subtitle?.toLowerCase().includes(q);
      const matchDesc = course.shortDesc?.toLowerCase().includes(q);
      const matchCategory = course.category?.toLowerCase().includes(q);
      const matchTags = course.tags?.some((tag) => tag.toLowerCase().includes(q));
      const matchRoles = course.roles?.some((role) => role.toLowerCase().includes(q));

      return matchTitle || matchSubtitle || matchDesc || matchCategory || matchTags || matchRoles;
    });
  }, [selectedCategory, searchQuery]);

  // Dynamic counts for each category
  const categoryCounts = useMemo(() => {
    const counts = { all: COURSES.length };
    COURSES.forEach((course) => {
      const groups = new Set([course.categoryGroup, ...(course.categoryGroups || [])]);
      groups.forEach((group) => {
        if (group) {
          counts[group] = (counts[group] || 0) + 1;
        }
      });
    });
    return counts;
  }, []);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
  };

  return (
    <section className="section-padding courses-showcase-section" id="tech-topics">
      <div className="container">
        {/* Section Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px", marginBottom: "40px" }}>
          <div style={{ maxWidth: "780px" }}>
            <span className="section-label">
              <Sparkles size={13} />
              INDUSTRY-READY CAREER TRACKS
            </span>
            <h2 className="section-heading" style={{ fontSize: "clamp(2.1rem, 3.8vw, 3.2rem)" }}>
              Professional Courses &amp; Internship Cohorts
            </h2>
            <p className="section-subtitle">
              Comprehensive hands-on training, enterprise project architectures, and active internship recruitment across {COURSES.length}+ high-growth technology disciplines in Hyderabad and Online.
            </p>
          </div>

          <div className="courses-recruitment-callout">
            <div className="pulse-dot-green"></div>
            <div>
              <strong style={{ display: "block", fontSize: "0.875rem", color: "var(--text-main)" }}>
                Active Internship Hiring
              </strong>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                {COURSES.length}+ Specialized Engineering Cohorts Open in Hyderabad &amp; Online
              </span>
            </div>
          </div>
        </div>

        {/* Filter Controls: Search & Category Pills */}
        <div className="courses-filter-controls">
          <div className="courses-filter-top-row">
            <div className="courses-search-bar">
              <Search size={16} className="courses-search-icon" />
              <input
                type="text"
                placeholder="Search courses, tools, or skills (e.g., Python, AWS, Docker)..."
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
              Showing {filteredCourses.length} of {COURSES.length} Courses
            </div>
          </div>

          {/* Category Tabs */}
          <div className="courses-category-pills" role="tablist">
            {COURSE_CATEGORIES.map((cat) => {
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

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="courses-cards-grid">
            {filteredCourses.map((course) => {
              return (
                <div 
                  key={course.id} 
                  className="course-card-premium"
                >
                  {/* Course Image Banner */}
                  <div className="course-image-box">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="course-card-img"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/ai-course.jpg";
                      }}
                    />
                    <div className="course-image-overlay">
                      <span className="course-category-tag">{course.category}</span>
                      {course.badge && (
                        <span className="course-badge-pill">
                          {course.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Course Details Body */}
                  <div className="course-body-content">
                    {/* Title & Subtitle */}
                    <div style={{ marginBottom: "14px" }}>
                      <h3 className="course-card-title">{course.title}</h3>
                      <div className="course-card-subtitle">{course.subtitle}</div>
                    </div>

                    {/* Description */}
                    <p className="course-short-desc">
                      {course.shortDesc}
                    </p>

                    {/* Active Internship Callout Pill */}
                    {course.internshipNote && (
                      <div className="course-internship-pill">
                        <Briefcase size={14} style={{ color: "#16A34A", flexShrink: 0 }} />
                        <span>{course.internshipNote}</span>
                      </div>
                    )}

                    {/* Skills & Technologies Chips */}
                    <div className="course-skills-block">
                      <div className="course-skills-label">
                        <span>Curriculum Skills &amp; Tools:</span>
                      </div>
                      <div className="course-skills-tags">
                        {course.tags.slice(0, 5).map((tag) => (
                          <span key={tag} className="course-skill-chip">
                            {tag}
                          </span>
                        ))}
                        {course.tags.length > 5 && (
                          <span className="course-skill-chip" style={{ background: "var(--bg-white)", borderColor: "var(--border-color)", fontWeight: 700 }}>
                            +{course.tags.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Target Career Roles */}
                    {course.roles && (
                      <div className="course-roles-row">
                        <GraduationCap size={14} style={{ color: "var(--coral)", flexShrink: 0 }} />
                        <span className="course-roles-text">
                          <strong>Target Roles:</strong> {course.roles.slice(0, 3).join(", ")}
                          {course.roles.length > 3 ? ` +${course.roles.length - 3} more` : ""}
                        </span>
                      </div>
                    )}

                    {/* Metadata Row: Duration & Mode */}
                    <div className="course-meta-footer">
                      <div className="course-meta-info-item">
                        <Clock size={13} />
                        <span>{course.duration}</span>
                      </div>
                      <div className="course-meta-info-item">
                        <MapPin size={13} />
                        <span>{course.mode}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="course-actions-row">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => openCourseModal(course, "curriculum")}
                      >
                        <span>Curriculum &amp; Roles</span>
                        <ArrowRight size={14} />
                      </button>

                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => openCourseModal(course, "apply")}
                      >
                        Apply for Track
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
              No Courses Found
            </h3>
            <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
              We couldn't find any courses matching "{searchQuery}" in this category. Try adjusting your search query or view all available courses.
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
  );
}
