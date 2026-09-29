import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, CheckCircle2, Ticket, ShieldCheck, CreditCard, Sparkles, GraduationCap, Briefcase, Building, UserCheck, Landmark } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { useStaticCatalog } from "../lib/use-static-catalog.js";

export default function PassRegistrationModal() {
  const { 
    passModalOpen, 
    setPassModalOpen, 
    selectedPassType, 
    setSelectedPassType, 
    registerPass,
    user,
    showToast,
  } = useApp();
  const { items: passes, error: passesError } = useStaticCatalog("pricing");
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
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

  const selectedPlan = passes.find((pass) => pass.id === activeType);
  const unitPrice = selectedPlan?.priceNum || 0;
  const groupPrice = selectedPlan?.groupPriceNum || unitPrice;
  const totalPrice = isDelegation
    ? (delegationMembers === 1 ? unitPrice : delegationMembers * groupPrice)
    : unitPrice;
  const formattedPrice = totalPrice === 0 ? "FREE" : `₹${totalPrice}`;
  const currentDetails = selectedPlan
    ? {
        title: `Claim Your ${selectedPlan.type}`,
        price: formattedPrice,
        amount: formattedPrice,
        badge: selectedPlan.badge,
        btnColor: isVisitor ? "btn-primary" : isStudent ? "btn-teal" : isFounder ? "btn-amber" : "btn-coral",
        accentColor: "var(--primary-purple)",
        btnIcon: isStudent ? GraduationCap : isFounder ? Briefcase : isDelegation ? CreditCard : Ticket,
        btnText: isDelegation
          ? `${selectedPlan.type} — ${formattedPrice} (${delegationMembers} ${delegationMembers === 1 ? "Attendee" : "Attendees"})`
          : selectedPlan.buttonText,
        subtext: selectedPlan.subtext,
      }
    : {
        title: "Pass pricing unavailable",
        price: "—",
        amount: "—",
        badge: "",
        btnColor: "btn-primary",
        accentColor: "var(--primary-purple)",
        btnIcon: Ticket,
        btnText: "Unavailable",
        subtext: "",
      };

  if (!passModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user?.email) {
      showToast("Please sign in before requesting a pass.");
      navigate("/login");
      return;
    }
    if (!selectedPlan) {
      showToast(passesError || "Pass options are not available yet. Please try again shortly.");
      return;
    }
    const registeredEmail = user.email;
    const registeredName = user.name || name;
    if (!registeredName || !phone) {
      showToast("⚠️ Please provide Full Name, Email Address, and Contact Number.");
      return;
    }

    setIsProcessing(true);
    registerPass({
        attendeeName: isDelegation ? `${registeredName} (${delegationMembers} Attendees)` : registeredName,
        email: registeredEmail,
        phone,
        contact: phone,
        passType: activeType,
        amount: currentDetails.amount,
        organization,
        role: isStudent ? `${role} (${additionalField || "Student"})` : role,
        notes: isDelegation ? `Delegation size: ${delegationMembers} members. Contact: ${phone}. ${notes}` : `Contact: ${phone}. ${notes || additionalField}`
      }).catch((error) => {
        showToast(`⚠️ ${error.message || "Unable to generate your pass."}`);
      }).finally(() => {
        setIsProcessing(false);
      });
      // Smoothly jump down to the generated ticket
      window.setTimeout(() => {
        const ticketEl = document.getElementById("digital-pass");
        if (ticketEl) ticketEl.scrollIntoView({ behavior: "smooth" });
      }, 50);
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
              <span className="tab-pill-name">{passes.find((pass) => pass.id === "visitor-pass")?.type || "Visitor Pass"}</span>
              <span className="tab-pill-price">{passes.find((pass) => pass.id === "visitor-pass")?.price || "—"}</span>
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
              <span className="tab-pill-name">{passes.find((pass) => pass.id === "student-pass")?.type || "Student Pass"}</span>
              <span className="tab-pill-price">{passes.find((pass) => pass.id === "student-pass")?.price || "—"}</span>
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
              <span className="tab-pill-name">{passes.find((pass) => pass.id === "founder-pass")?.type || "Founder Pass"}</span>
              <span className="tab-pill-price">{passes.find((pass) => pass.id === "founder-pass")?.price || "—"}</span>
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
              <span className="tab-pill-name">{passes.find((pass) => pass.id === "delegation-pass")?.type || "Delegation Pass"}</span>
              <span className="tab-pill-price">{passes.find((pass) => pass.id === "delegation-pass")?.price || "—"}</span>
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
                value={user?.email || email}
                readOnly
                aria-describedby="pass-email-help"
              />
              <small id="pass-email-help">This pass will be sent to your Neon Auth email.</small>
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
                        {delegationMembers >= 2
                          ? `Group Rate: ₹${groupPrice} / member`
                          : `Single: ₹${unitPrice}`}
                      </span>
                    </strong>
                    <p style={{ margin: "3px 0 0", fontSize: "0.775rem", color: "var(--text-secondary)" }}>
                      {delegationMembers === 1 
                        ? `1 Member = ₹${unitPrice}. Add 2+ members to unlock the ₹${groupPrice} per member group discount!`
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
                      {num} {num === 1 ? `member (₹${unitPrice})` : `members (₹${num * groupPrice})`}
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
