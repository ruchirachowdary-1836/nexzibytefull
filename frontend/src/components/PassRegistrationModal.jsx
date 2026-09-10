import React, { useState, useEffect } from "react";
import { X, CheckCircle2, Ticket, ShieldCheck, CreditCard, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { PASSES } from "../data/mockData.js";

export default function PassRegistrationModal() {
  const { 
    passModalOpen, 
    setPassModalOpen, 
    selectedPassType, 
    setSelectedPassType, 
    registerPass,
    showToast
  } = useApp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const isVisitor = selectedPassType === "visitor-pass" || selectedPassType === "VISITOR PASS";

  if (!passModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsProcessing(true);
    try {
      await registerPass({
        attendeeName: name,
        email,
        passType: selectedPassType,
        amount: isVisitor ? "FREE" : "₹250",
        notes: `${company ? `Company/college: ${company}\n` : ""}${role ? `Role: ${role}\n` : ""}${notes}`,
      });
      setIsProcessing(false);
      // Smoothly jump down to the generated ticket
      const ticketEl = document.getElementById("digital-pass");
      if (ticketEl) {
        ticketEl.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      setIsProcessing(false);
      showToast(error.message);
    }
  };

  return (
    <div className="modal-backdrop-overlay" onClick={() => setPassModalOpen(false)}>
      <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={() => setPassModalOpen(false)}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div style={{ marginBottom: "24px" }}>
          <span className="section-label">
            <Sparkles size={13} />
            ACCREDITATION PORTAL
          </span>
          <h3 style={{ fontSize: "1.6rem", fontWeight: 800, marginTop: "6px" }}>
            {isVisitor ? "Claim Your Free Visitor Pass" : "Get Your Delegate Pass (₹250)"}
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Instant digital credentials issued with cryptographic QR verification.
          </p>
        </div>

        {/* Pass Type Selector Toggle */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          background: "var(--bg-main)",
          padding: "6px",
          borderRadius: "var(--radius-md)",
          marginBottom: "24px"
        }}>
          <button
            type="button"
            style={{
              padding: "10px",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.875rem",
              fontWeight: 700,
              background: isVisitor ? "var(--bg-white)" : "transparent",
              color: isVisitor ? "var(--text-main)" : "var(--text-secondary)",
              boxShadow: isVisitor ? "var(--shadow-sm)" : "none",
              border: isVisitor ? "2px solid var(--primary-purple)" : "none"
            }}
            onClick={() => setSelectedPassType("visitor-pass")}
          >
            Visitor Pass (Free)
          </button>

          <button
            type="button"
            style={{
              padding: "10px",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.875rem",
              fontWeight: 700,
              background: !isVisitor ? "var(--bg-white)" : "transparent",
              color: !isVisitor ? "var(--coral)" : "var(--text-secondary)",
              boxShadow: !isVisitor ? "var(--shadow-sm)" : "none",
              border: !isVisitor ? "1px solid var(--border-color)" : "none"
            }}
            onClick={() => setSelectedPassType("delegate-pass")}
          >
            Delegate Pass (₹250)
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field-group">
            <label className="form-label">Full Name</label>
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
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              required
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. lalitha@company.com"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="form-field-group">
              <label className="form-label">Company / College</label>
              <input 
                type="text" 
                className="form-input" 
                value={company} 
                onChange={(e) => setCompany(e.target.value)}
                placeholder="NexziByte / University"
              />
            </div>
            <div className="form-field-group">
              <label className="form-label">Designation / Role</label>
              <input 
                type="text" 
                className="form-input" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                placeholder="Software Engineer"
              />
            </div>
          </div>

          {!isVisitor && (
            <div className="form-field-group">
              <label className="form-label">Why would you like Delegate Access?</label>
              <textarea 
                className="form-input" 
                rows="2"
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share your focus area (e.g. AI research, founder scaling, infrastructure architecture)..."
              />
            </div>
          )}

          {/* Pricing Summary Box */}
          <div style={{
            background: "var(--bg-main)",
            padding: "16px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            marginBottom: "24px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "4px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Pass Type</span>
              <span style={{ fontWeight: 700 }}>{isVisitor ? "Free Visitor Event Access" : "All-Access Delegate Credential"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", fontWeight: 800 }}>
              <span>Total Amount</span>
              <span style={{ color: isVisitor ? "#15803D" : "var(--coral)" }}>
                {isVisitor ? "FREE (₹0)" : "₹250"}
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            className={`btn ${isVisitor ? "btn-primary" : "btn-coral"}`}
            style={{ width: "100%" }}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span>Generating Secure Pass...</span>
            ) : isVisitor ? (
              <>
                <Ticket size={17} />
                <span>Claim Free Visitor Pass</span>
              </>
            ) : (
              <>
                <CreditCard size={17} />
                <span>Complete Purchase — ₹250</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
