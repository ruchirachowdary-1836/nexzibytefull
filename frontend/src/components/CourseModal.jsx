import React, { useState, useEffect } from "react";
import { 
  X, Sparkles, Clock, MapPin, Briefcase, GraduationCap, 
  CheckCircle2, ArrowRight, Share2, Award, UserCheck, Send 
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";

export default function CourseModal() {
  const { 
    courseModalOpen, 
    setCourseModalOpen, 
    selectedCourse, 
    showToast,
    courseInitialTab 
  } = useApp();

  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "curriculum" | "apply"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interestRole: "",
    experienceLevel: "Student / Fresh Graduate",
    notes: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && courseModalOpen) {
        setCourseModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [courseModalOpen, setCourseModalOpen]);

  // Reset form state when course changes
  useEffect(() => {
    if (selectedCourse) {
      setFormData(prev => ({
        ...prev,
        interestRole: selectedCourse.roles ? selectedCourse.roles[0] : ""
      }));
      setSubmitted(false);
      setActiveTab(courseInitialTab || "overview");
    }
  }, [selectedCourse, courseInitialTab]);

  if (!courseModalOpen || !selectedCourse) return null;

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      showToast("Please fill in your name, email, and phone number.");
      return;
    }
    setSubmitting(true);
    try {
      const [firstName, ...lastNameParts] = formData.name.trim().split(/\s+/);
      await api.submitApplication({
        first_name: firstName,
        last_name: lastNameParts.join(" ") || firstName,
        email: formData.email,
        partnership_type: "course-application",
        details: `Course: ${selectedCourse.title}\nPhone: ${formData.phone}\nRole: ${formData.interestRole}\nExperience: ${formData.experienceLevel}\nNotes: ${formData.notes || "Not provided"}`,
      });
      setSubmitted(true);
      showToast(`Application for ${selectedCourse.title} submitted successfully.`);
    } catch (error) {
      showToast(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="modal-backdrop-overlay" 
      onClick={() => setCourseModalOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-modal-title"
    >
      <div 
        className="modal-content-card course-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "800px", width: "95%" }}
      >
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={() => setCourseModalOpen(false)}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Header Hero */}
        <div className="course-modal-hero">
          <img 
            src={selectedCourse.image} 
            alt={selectedCourse.title} 
            className="course-modal-img"
          />
          <div className="course-modal-overlay">
            <div className="course-modal-tags-row">
              <span className="course-badge-pill">
                <Sparkles size={12} />
                {selectedCourse.category}
              </span>
              {selectedCourse.badge && (
                <span className="course-status-pill" style={{ background: "rgba(16, 185, 129, 0.9)", color: "#ffffff", fontWeight: 700 }}>
                  {selectedCourse.badge}
                </span>
              )}
            </div>
            <h2 id="course-modal-title" className="course-modal-title">
              {selectedCourse.title}
            </h2>
            <div className="course-modal-subtitle">
              {selectedCourse.subtitle}
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="course-modal-tabs-bar">
          <button 
            type="button"
            className={`course-modal-tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <span>Track Overview</span>
          </button>
          <button 
            type="button"
            className={`course-modal-tab-btn ${activeTab === "curriculum" ? "active" : ""}`}
            onClick={() => setActiveTab("curriculum")}
          >
            <span>Skills &amp; Roles</span>
          </button>
          <button 
            type="button"
            className={`course-modal-tab-btn ${activeTab === "apply" ? "active" : ""}`}
            onClick={() => setActiveTab("apply")}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <UserCheck size={14} />
              Apply for Track / Internship
            </span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="course-modal-body">
          {activeTab === "overview" && (
            <div>
              {/* Quick Meta Row */}
              <div className="course-modal-quick-meta">
                <div className="quick-meta-item">
                  <Clock size={15} style={{ color: "#16A34A" }} />
                  <div>
                    <span className="quick-label">Duration</span>
                    <strong className="quick-val">{selectedCourse.duration}</strong>
                  </div>
                </div>
                <div className="quick-meta-item">
                  <MapPin size={15} style={{ color: "var(--coral)" }} />
                  <div>
                    <span className="quick-label">Format</span>
                    <strong className="quick-val">{selectedCourse.mode}</strong>
                  </div>
                </div>
                <div className="quick-meta-item">
                  <Award size={15} style={{ color: "var(--electric-blue)" }} />
                  <div>
                    <span className="quick-label">Certification</span>
                    <strong className="quick-val">Industry Recognized</strong>
                  </div>
                </div>
              </div>

              {/* Special Internship Recruitment Notice */}
              {selectedCourse.internshipNote && (
                <div className="course-recruitment-banner">
                  <div className="pulse-dot-green"></div>
                  <div>
                    <strong style={{ fontSize: "0.9375rem", display: "block", color: "#065F46" }}>
                      Active Talent Recruitment
                    </strong>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.875rem", color: "#047857", lineHeight: 1.45 }}>
                      "{selectedCourse.internshipNote}"
                    </p>
                  </div>
                </div>
              )}

              {/* Detailed Explanation */}
              <div className="course-modal-text">
                <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px", color: "var(--text-main)" }}>
                  Program Overview
                </h4>
                <p>{selectedCourse.fullDesc || selectedCourse.shortDesc}</p>
                <p style={{ marginTop: "12px", color: "var(--text-secondary)", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                  Our curriculum combines direct hands-on lab exercises, system architecture teardowns, live mentor code reviews, and enterprise capstone project delivery to ensure you are day-one production ready.
                </p>
              </div>

              {/* Roles Chips */}
              {selectedCourse.roles && (
                <div style={{ marginTop: "24px" }}>
                  <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, marginBottom: "10px", color: "var(--text-main)" }}>
                    Career Roles &amp; Outcomes:
                  </h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {selectedCourse.roles.map(r => (
                      <span key={r} className="course-role-badge">
                        <CheckCircle2 size={13} style={{ color: "#16A34A" }} />
                        <span>{r}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "curriculum" && (
            <div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px", color: "var(--text-main)" }}>
                Core Skills, Tools &amp; Technologies Covered
              </h4>
              <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
                Every module is reinforced with real-world architecture teardowns, hands-on production code, and portfolio project delivery.
              </p>

              <div className="course-all-skills-grid">
                {selectedCourse.tags.map((skill, index) => (
                  <div key={skill} className="curriculum-skill-card">
                    <span className="skill-number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="skill-name">{skill}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "30px", background: "var(--bg-main)", padding: "20px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                <h5 style={{ fontSize: "0.9375rem", fontWeight: 700, marginBottom: "6px", color: "var(--text-main)" }}>
                  Looking for Internship Placement?
                </h5>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>
                  Top performers in this track are immediately fast-tracked for NexziByte internship placements and enterprise partner interviews.
                </p>
              </div>
            </div>
          )}

          {activeTab === "apply" && (
            <div>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "var(--emerald, #10B981)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px"
                  }}>
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "8px" }}>
                    Application Received!
                  </h3>
                  <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", maxWidth: "460px", margin: "0 auto 24px" }}>
                    Thank you, <strong>{formData.name}</strong>. Our admissions and internship recruitment team will review your application for <strong>{selectedCourse.title}</strong> and reach out via email/phone within 24 hours.
                  </p>
                  <button 
                    type="button" 
                    className="btn btn-primary btn-sm"
                    onClick={() => setCourseModalOpen(false)}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication}>
                  <div style={{ marginBottom: "20px" }}>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "4px", color: "var(--text-main)" }}>
                      Apply for {selectedCourse.title}
                    </h4>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>
                      Submit your application for upcoming training and internship cohorts in Hyderabad &amp; Online.
                    </p>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Your Full Name" 
                        className="form-input"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input 
                        type="email" 
                        required
                        placeholder="you@domain.com" 
                        className="form-input"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="+91 98765 43210" 
                        className="form-input"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Target Role / Track</label>
                      <select 
                        className="form-input"
                        value={formData.interestRole}
                        onChange={(e) => setFormData({ ...formData, interestRole: e.target.value })}
                      >
                        {selectedCourse.roles && selectedCourse.roles.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                        <option value="General Internship">General Internship Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Current Experience Level</label>
                    <select 
                      className="form-input"
                      value={formData.experienceLevel}
                      onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    >
                      <option value="Student / Fresh Graduate">Student / Fresh Graduate (Seeking Internship)</option>
                      <option value="Early Career (1-2 Years)">Early Career (1-2 Years Professional)</option>
                      <option value="Experienced Professional">Experienced Professional (Upskilling)</option>
                      <option value="Career Switcher">Career Switcher</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message / Why are you interested? (Optional)</label>
                    <textarea 
                      rows={3} 
                      placeholder="Tell us about your background, portfolio, or career goals..."
                      className="form-input"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setCourseModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                    >
                      <Send size={15} />
                      <span>Submit Application</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="course-modal-footer">
          <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
            📍 Hyderabad Campus &amp; Live Remote Mentorship
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {activeTab !== "apply" && (
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={() => setActiveTab("apply")}
              >
                <span>Apply for this Track</span>
                <ArrowRight size={14} />
              </button>
            )}
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => setCourseModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
