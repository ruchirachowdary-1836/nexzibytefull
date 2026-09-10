import React, { useState, useEffect } from "react";
import { 
  X, Sparkles, Clock, MapPin, Briefcase, GraduationCap, 
  CheckCircle2, ArrowRight, Award, UserCheck, Send, DollarSign,
  Building2, Calendar, FileText
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";

export default function InternshipModal() {
  const { 
    internshipModalOpen, 
    setInternshipModalOpen, 
    selectedInternship, 
    showToast,
    internshipInitialTab 
  } = useApp();

  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "apply"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    gradYear: "2025",
    role: "",
    linkedin: "",
    notes: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [appId, setAppId] = useState("");

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && internshipModalOpen) {
        setInternshipModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [internshipModalOpen, setInternshipModalOpen]);

  // Reset form state when internship changes
  useEffect(() => {
    if (selectedInternship) {
      setFormData(prev => ({
        ...prev,
        role: selectedInternship.title
      }));
      setSubmitted(false);
      setActiveTab(internshipInitialTab || "overview");
      setAppId(`NXB-INT-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [selectedInternship, internshipInitialTab]);

  if (!internshipModalOpen || !selectedInternship) return null;

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      showToast("Please fill in your name, email, and phone number.");
      return;
    }
    try {
      const [firstName, ...lastNameParts] = formData.name.trim().split(/\s+/);
      await api.submitApplication({
        first_name: firstName,
        last_name: lastNameParts.join(" ") || firstName,
        email: formData.email,
        partnership_type: "internship-application",
        details: `Internship: ${selectedInternship.title}\nPhone: ${formData.phone}\nCollege: ${formData.college}\nGraduation year: ${formData.gradYear}\nLinkedIn: ${formData.linkedin || "Not provided"}\nNotes: ${formData.notes || "Not provided"}`,
      });
      setSubmitted(true);
      showToast(`Application for ${selectedInternship.title} submitted. Reference: ${appId}`);
    } catch (error) {
      showToast(error.message);
    }
  };

  return (
    <div 
      className="modal-backdrop-overlay" 
      onClick={() => setInternshipModalOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="internship-modal-title"
    >
      <div 
        className="modal-content-card course-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "820px", width: "95%" }}
      >
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={() => setInternshipModalOpen(false)}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Hero Banner */}
        <div className="course-modal-hero" style={{ height: "200px" }}>
          <img 
            src={selectedInternship.image} 
            alt={selectedInternship.title} 
            className="course-modal-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/ai-course.jpg";
            }}
          />
          <div className="course-modal-overlay">
            <div className="course-modal-tags-row">
              <span className="course-badge-pill">
                <Sparkles size={12} />
                {selectedInternship.category}
              </span>
              <span className="course-status-pill" style={{ background: "rgba(16, 185, 129, 0.95)", color: "#ffffff", fontWeight: 700 }}>
                {selectedInternship.badge}
              </span>
              <span className="course-status-pill" style={{ background: "rgba(99, 102, 241, 0.9)", color: "#ffffff" }}>
                {selectedInternship.openings}
              </span>
            </div>
            <h2 id="internship-modal-title" className="course-modal-title" style={{ fontSize: "clamp(1.4rem, 2.8vw, 1.9rem)" }}>
              {selectedInternship.title}
            </h2>
            <div className="course-modal-subtitle" style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginTop: "4px" }}>
              <span>NexziByte TechTalk Ecosystem Cohort</span>
              <span>•</span>
              <span style={{ color: "#34D399", fontWeight: 700 }}>Pre-Placement Offer (PPO) Pathway</span>
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
            <span>Track Overview &amp; Roles</span>
          </button>
          <button 
            type="button"
            className={`course-modal-tab-btn ${activeTab === "apply" ? "active" : ""}`}
            onClick={() => setActiveTab("apply")}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <UserCheck size={14} />
              Apply for Internship
            </span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="course-modal-body">
          {activeTab === "overview" && (
            <div>
              {/* Quick Meta Row */}
              <div className="course-modal-quick-meta" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))" }}>
                <div className="quick-meta-item">
                  <Clock size={15} style={{ color: "#16A34A" }} />
                  <div>
                    <span className="quick-label">Duration</span>
                    <strong className="quick-val">{selectedInternship.duration}</strong>
                  </div>
                </div>
                <div className="quick-meta-item">
                  <MapPin size={15} style={{ color: "var(--coral)" }} />
                  <div>
                    <span className="quick-label">Location</span>
                    <strong className="quick-val">{selectedInternship.location}</strong>
                  </div>
                </div>
                <div className="quick-meta-item">
                  <DollarSign size={15} style={{ color: "#F59E0B" }} />
                  <div>
                    <span className="quick-label">Stipend</span>
                    <strong className="quick-val">Performance Stipend</strong>
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

              {/* Role Summary */}
              <div className="course-modal-text" style={{ marginTop: "20px" }}>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "8px", color: "var(--text-main)" }}>
                  About the Internship Track
                </h4>
                <p>{selectedInternship.shortDesc}</p>
              </div>

              {/* Eligibility Notice */}
              <div style={{ marginTop: "16px", background: "rgba(37, 99, 235, 0.06)", border: "1px solid rgba(37, 99, 235, 0.2)", padding: "14px 18px", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: "12px" }}>
                <GraduationCap size={20} style={{ color: "var(--electric-blue)", flexShrink: 0 }} />
                <div>
                  <strong style={{ fontSize: "0.875rem", color: "var(--text-main)", display: "block" }}>
                    Eligibility Criteria:
                  </strong>
                  <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                    {selectedInternship.eligibility}
                  </span>
                </div>
              </div>

              {/* Key Responsibilities */}
              <div style={{ marginTop: "22px" }}>
                <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, marginBottom: "12px", color: "var(--text-main)" }}>
                  Core Responsibilities &amp; What You'll Do:
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {selectedInternship.responsibilities.map((resp, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <CheckCircle2 size={16} style={{ color: "#16A34A", flexShrink: 0, marginTop: "2px" }} />
                      <span style={{ fontSize: "0.875rem", color: "var(--text-main)", lineHeight: 1.45 }}>
                        {resp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills & Technologies Tags */}
              <div style={{ marginTop: "24px" }}>
                <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, marginBottom: "10px", color: "var(--text-main)" }}>
                  Tools &amp; Curriculum Skills:
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {selectedInternship.skills.map((skill) => (
                    <span key={skill} className="course-skill-chip" style={{ fontSize: "0.8125rem", padding: "5px 12px" }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Perks & Career Outcomes */}
              <div style={{ marginTop: "24px", background: "var(--bg-main)", padding: "16px 20px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                <h5 style={{ fontSize: "0.9375rem", fontWeight: 700, marginBottom: "10px", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Sparkles size={14} style={{ color: "var(--coral)" }} />
                  Internship Perks &amp; Career Benefits:
                </h5>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {selectedInternship.perks.map((perk) => (
                    <span key={perk} style={{ background: "var(--bg-white)", border: "1px solid var(--border-color)", padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-main)" }}>
                      ✓ {perk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom CTA to Apply */}
              <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveTab("apply")}
                >
                  <span>Proceed to Application</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {activeTab === "apply" && (
            <div>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "#DCFCE7",
                    color: "#16A34A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px"
                  }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "8px", color: "var(--text-main)" }}>
                    Application Submitted Successfully!
                  </h3>
                  <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", maxWidth: "520px", margin: "0 auto 16px", lineHeight: 1.6 }}>
                    Thank you for applying for the <strong>{selectedInternship.title}</strong> cohort. Your application has been registered with reference ID:
                  </p>
                  <div style={{ display: "inline-block", background: "var(--bg-main)", border: "1px dashed var(--border-color)", padding: "8px 18px", borderRadius: "8px", fontWeight: 800, color: "var(--electric-blue)", letterSpacing: "0.05em", marginBottom: "24px" }}>
                    {appId}
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                    Our engineering &amp; talent recruitment team will review your profile and reach out via email/phone within 2 business days for the initial screening.
                  </p>
                  <div style={{ marginTop: "24px" }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setInternshipModalOpen(false)}
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication} className="course-application-form">
                  <div style={{ marginBottom: "20px" }}>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "4px", color: "var(--text-main)" }}>
                      Apply for {selectedInternship.title}
                    </h4>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>
                      Fill in your details below to join the upcoming NexziByte engineering and operations cohort.
                    </p>
                  </div>

                  <div className="form-grid-2col">
                    <div className="form-field-group">
                      <label className="form-label" htmlFor="applicant-name">Full Name *</label>
                      <input 
                        id="applicant-name"
                        type="text" 
                        required 
                        className="form-input-text"
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="form-field-group">
                      <label className="form-label" htmlFor="applicant-email">Email Address *</label>
                      <input 
                        id="applicant-email"
                        type="email" 
                        required 
                        className="form-input-text"
                        placeholder="e.g. rahul@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2col" style={{ marginTop: "14px" }}>
                    <div className="form-field-group">
                      <label className="form-label" htmlFor="applicant-phone">Phone / WhatsApp Number *</label>
                      <input 
                        id="applicant-phone"
                        type="tel" 
                        required 
                        className="form-input-text"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="form-field-group">
                      <label className="form-label" htmlFor="applicant-grad">Graduation Batch *</label>
                      <select 
                        id="applicant-grad"
                        className="form-input-text"
                        value={formData.gradYear}
                        onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                      >
                        <option value="2027">2027 Batch (Current Student)</option>
                        <option value="2026">2026 Batch (Current Student)</option>
                        <option value="2025">2025 Batch (Pre-Final / Final Year)</option>
                        <option value="2024">2024 Batch (Recent Graduate)</option>
                        <option value="other">Other / Working Professional</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-2col" style={{ marginTop: "14px" }}>
                    <div className="form-field-group">
                      <label className="form-label" htmlFor="applicant-college">College / University Name</label>
                      <input 
                        id="applicant-college"
                        type="text" 
                        className="form-input-text"
                        placeholder="e.g. JNTU Hyderabad / Osmania"
                        value={formData.college}
                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      />
                    </div>

                    <div className="form-field-group">
                      <label className="form-label" htmlFor="applicant-linkedin">LinkedIn or GitHub URL</label>
                      <input 
                        id="applicant-linkedin"
                        type="url" 
                        className="form-input-text"
                        placeholder="https://linkedin.com/in/..."
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-field-group" style={{ marginTop: "14px" }}>
                    <label className="form-label" htmlFor="applicant-notes">Why are you interested in this track? (Optional)</label>
                    <textarea 
                      id="applicant-notes"
                      rows={3} 
                      className="form-input-text"
                      placeholder="Mention your relevant projects, tech background, or what you want to learn..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => setActiveTab("overview")}
                    >
                      Back to Details
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                    >
                      <Send size={15} />
                      <span>Submit Internship Application</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
