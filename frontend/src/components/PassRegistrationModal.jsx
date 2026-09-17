import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, CheckCircle2, Ticket, ShieldCheck, CreditCard, Sparkles, GraduationCap, Briefcase, Building, UserCheck, Landmark } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { PASSES } from "../data/mockData.js";

export default function PassRegistrationModal() {
  const { 
    passModalOpen, 
    setPassModalOpen, 
    selectedPassType, 
    setSelectedPassType, 
    registerPass 
  } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState("Lalitha Mindhi");
  const [email, setEmail] = useState("lalitha@nexzibyte.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [organization, setOrganization] = useState("NexziByte Ecosystem");
  const [role, setRole] = useState("Senior Systems Architect");
  const [additionalField, setAdditionalField] = useState("");
  const [notes, setNotes] = useState("");
  const [delegationMembers, setDelegationMembers] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Normalize active pass type
  const activeType = selectedPassType === "delegate-pass" ? "delegation-pass" : selectedPassType || "visitor-pass";

  const isVisitor = activeType === "visitor-pass";
  const isStudent = activeType === "student-pass";
  const isFounder = activeType === "founder-pass";
  const isDelegation = activeType === "delegation-pass";

  // Price & label lookup
  const getPassDetails = () => {
    switch (activeType) {
      case "student-pass":
        return {
          title: "Claim Your Student Pass",
          price: "₹99",
          amount: "₹99",
          badge: "Student & Researcher",
          btnColor: "btn-teal",
          accentColor: "#059669",
          btnIcon: GraduationCap,
          btnText: "Claim Student Pass — ₹99",
          subtext: "Valid College / Student ID required at check-in counter."
        };
      case "founder-pass":
        return {
          title: "Apply for Founder VIP Pass",
          price: "₹499",
          amount: "₹499",
          badge: "Founder & CXO Circle",
          btnColor: "btn-amber",
          accentColor: "#D97706",
          btnIcon: Briefcase,
          btnText: "Secure Founder Pass — ₹499",
          subtext: "Chatham House rules. Zero vanity metrics. Authentic peer network."
        };
      case "delegation-pass": {
        const total = delegationMembers === 1 ? 250 : delegationMembers * 200;
        return {
          title: "Get Corporate Delegation Pass",
          price: `₹${total}`,
          amount: `₹${total}`,
          badge: "Corporate Delegate",
          btnColor: "btn-coral",
          accentColor: "var(--coral)",
          btnIcon: CreditCard,
          btnText: `Complete Purchase — ₹${total} (${delegationMembers} ${delegationMembers === 1 ? "Attendee" : "Attendees"})`,
          subtext: delegationMembers === 1
            ? "₹250 for 1 member • Register 2+ members to unlock ₹200/member group rate!"
            : `🎉 Group Rate Applied: ₹200 per member (${delegationMembers} attendees = ₹${total}, save ₹${delegationMembers * 50}!)`
        };
      }
      default:
        return {
          title: "Claim Your Free Visitor Pass",
          price: "FREE",
          amount: "FREE",
          badge: "Community Visitor",
          btnColor: "btn-primary",
          accentColor: "var(--primary-purple)",
          btnIcon: Ticket,
          btnText: "Claim Free Visitor Pass",
          subtext: "100% Free with instant digital QR pass generation."
        };
    }
  };

  const currentDetails = getPassDetails();

  if (!passModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      showToast("⚠️ Please provide Full Name, Email Address, and Contact Number.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      registerPass({
        attendeeName: isDelegation ? `${name} (${delegationMembers} Attendees)` : name,
        email,
        phone,
        contact: phone,
        passType: activeType,
        amount: currentDetails.amount,
        organization,
        role: isStudent ? `${role} (${additionalField || "Student"})` : role,
        notes: isDelegation ? `Delegation size: ${delegationMembers} members. Contact: ${phone}. ${notes}` : `Contact: ${phone}. ${notes || additionalField}`
      });
      setIsProcessing(false);
      // Smoothly jump down to the generated ticket
      const ticketEl = document.getElementById("digital-pass");
      if (ticketEl) {
        ticketEl.scrollIntoView({ behavior: "smooth" });
      }
    }, 600);
  };

  return (
    <div className="modal-backdrop-overlay" onClick={() => setPassModalOpen(false)}>
      <div className="modal-content-card modal-pass-card-wide" onClick={(e) => e.stopPropagation()}>
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={() => setPassModalOpen(false)}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div style={{ marginBottom: "20px" }}>
          <span className="section-label">
            <Sparkles size={13} />
            ACCREDITATION PORTAL
          </span>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginTop: "6px" }}>
            {currentDetails.title}
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "3px" }}>
            Instant digital credentials issued with cryptographic QR verification.
          </p>
        </div>

        {/* 4 Separate Passes Selector Tabs */}
        <div className="pass-modal-tabs-strip" role="tablist">
          <button
            type="button"
            className={`pass-modal-tab ${isVisitor ? "active visitor" : ""}`}
            onClick={() => setSelectedPassType("visitor-pass")}
            role="tab"
            aria-selected={isVisitor}
          >
            <div className="tab-pill-icon"><Ticket size={14} /></div>
            <div className="tab-pill-info">
              <span className="tab-pill-name">Visitor Pass</span>
              <span className="tab-pill-price">FREE</span>
            </div>
          </button>

          <button
            type="button"
            className={`pass-modal-tab ${isStudent ? "active student" : ""}`}
            onClick={() => setSelectedPassType("student-pass")}
            role="tab"
            aria-selected={isStudent}
          >
            <div className="tab-pill-icon"><GraduationCap size={14} /></div>
            <div className="tab-pill-info">
              <span className="tab-pill-name">Student Pass</span>
              <span className="tab-pill-price">₹99</span>
            </div>
          </button>

          <button
            type="button"
            className={`pass-modal-tab ${isFounder ? "active founder" : ""}`}
            onClick={() => setSelectedPassType("founder-pass")}
            role="tab"
            aria-selected={isFounder}
          >
            <div className="tab-pill-icon"><Briefcase size={14} /></div>
            <div className="tab-pill-info">
              <span className="tab-pill-name">Founder Pass</span>
              <span className="tab-pill-price">₹499</span>
            </div>
          </button>

          <button
            type="button"
            className={`pass-modal-tab ${isDelegation ? "active delegate" : ""}`}
            onClick={() => setSelectedPassType("delegation-pass")}
            role="tab"
            aria-selected={isDelegation}
          >
            <div className="tab-pill-icon"><Building size={14} /></div>
            <div className="tab-pill-info">
              <span className="tab-pill-name">Delegation Pass</span>
              <span className="tab-pill-price">from ₹200</span>
            </div>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="form-field-group">
              <label className="form-label">Full Name *</label>
              <input 
                type="text" 
                required
                className="form-input" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Lalitha Mindhi"
              />
            </div>

            <div className="form-field-group">
              <label className="form-label">Email Address *</label>
              <input 
                type="email" 
                required
                className="form-input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. lalitha@company.com"
              />
            </div>
          </div>

          <div className="form-field-group">
            <label className="form-label">Contact Number *</label>
            <input 
              type="tel" 
              required
              className="form-input" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +91 98765 43210"
            />
          </div>

          {/* Dynamic Context Fields based on Pass Type */}
          {isStudent && (
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "12px" }}>
              <div className="form-field-group">
                <label className="form-label">College / University Name *</label>
                <input 
                  type="text" 
                  required
                  className="form-input" 
                  value={organization} 
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. JNTU Hyderabad / Osmania University"
                />
              </div>
              <div className="form-field-group">
                <label className="form-label">Degree &amp; Graduation Year *</label>
                <input 
                  type="text" 
                  required
                  className="form-input" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. B.Tech CSE (2026)"
                />
              </div>
            </div>
          )}

          {isFounder && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "12px" }}>
                <div className="form-field-group">
                  <label className="form-label">Startup / Company Name *</label>
                  <input 
                    type="text" 
                    required
                    className="form-input" 
                    value={organization} 
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. AgenticIQ / MyStartup.ai"
                  />
                </div>
                <div className="form-field-group">
                  <label className="form-label">Role in Startup *</label>
                  <input 
                    type="text" 
                    required
                    className="form-input" 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Co-Founder &amp; CTO"
                  />
                </div>
              </div>
              <div className="form-field-group">
                <label className="form-label">Funding &amp; Venture Stage</label>
                <select 
                  className="form-input"
                  value={additionalField}
                  onChange={(e) => setAdditionalField(e.target.value)}
                >
                  <option value="">Select Stage...</option>
                  <option value="Bootstrapped / Revenue-funded">Bootstrapped / Revenue-funded</option>
                  <option value="Pre-Seed (Building MVP)">Pre-Seed (Building MVP)</option>
                  <option value="Seed Stage ($200K - $1M)">Seed Stage ($200K - $1M)</option>
                  <option value="Growth / Series A+">Growth / Series A+</option>
                  <option value="Ideation / Early Concept">Ideation / Early Concept</option>
                </select>
              </div>
            </>
          )}

          {isDelegation && (
            <>
              {/* Member Selection / Dynamic Roster Counter for Delegation Pass */}
              <div style={{
                background: "rgba(244, 63, 94, 0.07)",
                border: "1px solid rgba(244, 63, 94, 0.28)",
                borderRadius: "12px",
                padding: "14px 16px",
                marginBottom: "14px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                  <div>
                    <strong style={{ fontSize: "0.9rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>Delegation Attendees</span>
                      <span style={{ 
                        fontSize: "0.725rem", 
                        padding: "2px 8px", 
                        borderRadius: "12px", 
                        background: delegationMembers >= 2 ? "#10B981" : "rgba(244, 63, 94, 0.2)",
                        color: "#FFFFFF",
                        fontWeight: 700 
                      }}>
                        {delegationMembers >= 2 ? "Group Rate: ₹200 / member" : "Single: ₹250"}
                      </span>
                    </strong>
                    <p style={{ margin: "3px 0 0", fontSize: "0.775rem", color: "var(--text-secondary)" }}>
                      {delegationMembers === 1 
                        ? "1 Member = ₹250. Add 2+ members to unlock the ₹200 per member group discount!" 
                        : `🎉 Group Discount Applied: ₹200 × ${delegationMembers} members = ₹${delegationMembers * 200} (You save ₹${delegationMembers * 50})`}
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ width: "32px", height: "32px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", fontWeight: 800, fontSize: "1rem" }}
                      onClick={() => setDelegationMembers(Math.max(1, delegationMembers - 1))}
                      disabled={delegationMembers <= 1}
                      title="Decrease member count"
                    >
                      -
                    </button>

                    <span style={{ minWidth: "32px", textAlign: "center", fontWeight: 800, fontSize: "1.15rem", color: "var(--coral, #F43F5E)" }}>
                      {delegationMembers}
                    </span>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ width: "32px", height: "32px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", fontWeight: 800, fontSize: "1rem" }}
                      onClick={() => setDelegationMembers(Math.min(25, delegationMembers + 1))}
                      title="Add another member"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Quick Presets */}
                <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "10px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Quick presets:</span>
                  {[1, 2, 3, 5, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setDelegationMembers(num)}
                      style={{
                        padding: "3px 10px",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background: delegationMembers === num ? "var(--coral, #F43F5E)" : "rgba(255, 255, 255, 0.06)",
                        color: delegationMembers === num ? "#FFFFFF" : "var(--text-secondary)",
                        border: "1px solid",
                        borderColor: delegationMembers === num ? "var(--coral, #F43F5E)" : "rgba(255, 255, 255, 0.12)",
                        cursor: "pointer"
                      }}
                    >
                      {num} {num === 1 ? "member (₹250)" : `members (₹${num * 200})`}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "12px" }}>
                <div className="form-field-group">
                  <label className="form-label">Corporate Enterprise / Firm *</label>
                  <input 
                    type="text" 
                    required
                    className="form-input" 
                    value={organization} 
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. NexziByte / Tech Enterprise"
                  />
                </div>
                <div className="form-field-group">
                  <label className="form-label">Lead Delegate Role *</label>
                  <input 
                    type="text" 
                    required
                    className="form-input" 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Principal Cloud Architect"
                  />
                </div>
              </div>
            </>
          )}

          {isVisitor && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-field-group">
                <label className="form-label">Affiliation / College (Optional)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={organization} 
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="NexziByte / University"
                />
              </div>
              <div className="form-field-group">
                <label className="form-label">Current Role / Interest</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Developer / Enthusiast"
                />
              </div>
            </div>
          )}

          {(isFounder || isDelegation) && (
            <div className="form-field-group">
              <label className="form-label">
                {isFounder ? "What are you looking for from the Founder Circle?" : "Delegation Focus / Objectives"}
              </label>
              <textarea 
                className="form-input" 
                rows="2"
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isFounder ? "e.g. Looking for enterprise pilot design partners and seed angel syndicates..." : "e.g. Scalable microservices architecture, AI infrastructure, team upskilling..."}
              />
            </div>
          )}

          {/* Pricing & Accreditation Summary Box */}
          <div style={{
            background: "var(--bg-main)",
            padding: "14px 16px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            marginTop: "8px",
            marginBottom: "18px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", marginBottom: "4px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Pass Category</span>
              <span style={{ fontWeight: 700, color: currentDetails.accentColor }}>{currentDetails.badge}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: currentDetails.accentColor }}>
                  {currentDetails.amount === "FREE" ? "FREE (₹0)" : currentDetails.amount}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                  {currentDetails.subtext}
                </div>
              </div>
              <div style={{
                fontSize: "0.75rem",
                padding: "4px 10px",
                borderRadius: "var(--radius-full)",
                background: "var(--bg-white)",
                border: "1px solid var(--border-color)",
                fontWeight: 600,
                color: "var(--text-secondary)"
              }}>
                Instant Digital QR Pass
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className={`btn ${currentDetails.btnColor}`}
            style={{ width: "100%", padding: "12px 20px" }}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span>Generating Verified Pass...</span>
            ) : (
              <>
                <currentDetails.btnIcon size={17} />
                <span>{currentDetails.btnText}</span>
              </>
            )}
          </button>

          {!isVisitor && (
            <button
              type="button"
              className="btn btn-outline"
              style={{
                width: "100%",
                marginTop: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontSize: "0.85rem",
                padding: "10px 16px"
              }}
              onClick={() => {
                setPassModalOpen(false);
                const queryStr = isDelegation 
                  ? `/checkout?pass=${activeType}&members=${delegationMembers}`
                  : `/checkout?pass=${activeType}`;
                navigate(queryStr);
              }}
            >
              <Landmark size={15} style={{ color: "#004c8f" }} />
              <span>Proceed to Indian Banking / UPI Checkout Page 🇮🇳</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
