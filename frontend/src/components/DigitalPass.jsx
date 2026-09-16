import React from "react";
import { 
  Sparkles, ShieldCheck, QrCode, Copy, Check, Download, 
  Smartphone, ExternalLink, Calendar, MapPin 
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

// Minimal SVG QR Code generator for the pass
export function PassQRCodeSVG({ value, size = 130 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`QR Code: ${value}`}
    >
      {/* Background */}
      <rect width="100" height="100" fill="#FFFFFF" rx="4" />

      {/* Top Left Marker */}
      <rect x="10" y="10" width="26" height="26" stroke="#18181B" strokeWidth="4" rx="2" fill="none" />
      <rect x="17" y="17" width="12" height="12" fill="#18181B" rx="1" />

      {/* Top Right Marker */}
      <rect x="64" y="10" width="26" height="26" stroke="#18181B" strokeWidth="4" rx="2" fill="none" />
      <rect x="71" y="17" width="12" height="12" fill="#18181B" rx="1" />

      {/* Bottom Left Marker */}
      <rect x="10" y="64" width="26" height="26" stroke="#18181B" strokeWidth="4" rx="2" fill="none" />
      <rect x="17" y="71" width="12" height="12" fill="#18181B" rx="1" />

      {/* Synthetic Scannable Pattern Grid */}
      <rect x="42" y="12" width="6" height="6" fill="#18181B" />
      <rect x="52" y="12" width="6" height="6" fill="#18181B" />
      <rect x="42" y="24" width="6" height="6" fill="#F97316" />
      <rect x="52" y="24" width="6" height="6" fill="#18181B" />

      <rect x="12" y="42" width="6" height="6" fill="#18181B" />
      <rect x="24" y="42" width="6" height="6" fill="#18181B" />
      <rect x="36" y="42" width="6" height="6" fill="#18181B" />
      <rect x="48" y="42" width="6" height="6" fill="#18181B" />
      <rect x="60" y="42" width="6" height="6" fill="#F97316" />
      <rect x="72" y="42" width="6" height="6" fill="#18181B" />
      <rect x="84" y="42" width="6" height="6" fill="#18181B" />

      <rect x="12" y="52" width="6" height="6" fill="#18181B" />
      <rect x="28" y="52" width="6" height="6" fill="#18181B" />
      <rect x="42" y="52" width="6" height="6" fill="#18181B" />
      <rect x="58" y="52" width="6" height="6" fill="#18181B" />
      <rect x="74" y="52" width="6" height="6" fill="#18181B" />

      <rect x="42" y="64" width="6" height="6" fill="#F97316" />
      <rect x="52" y="64" width="6" height="6" fill="#18181B" />
      <rect x="64" y="64" width="6" height="6" fill="#18181B" />
      <rect x="80" y="64" width="6" height="6" fill="#18181B" />

      <rect x="42" y="76" width="6" height="6" fill="#18181B" />
      <rect x="56" y="76" width="6" height="6" fill="#18181B" />
      <rect x="70" y="76" width="6" height="6" fill="#18181B" />
      <rect x="84" y="76" width="6" height="6" fill="#F97316" />

      <rect x="48" y="86" width="6" height="6" fill="#18181B" />
      <rect x="64" y="86" width="6" height="6" fill="#18181B" />
      <rect x="78" y="86" width="6" height="6" fill="#18181B" />
    </svg>
  );
}

export default function DigitalPass() {
  const { activePass, showToast } = useApp();

  const handleCopyId = () => {
    navigator.clipboard?.writeText(activePass.passId);
    showToast(`Copied Pass ID ${activePass.passId} to clipboard.`);
  };

  const handleDownload = () => {
    showToast(`Downloading digital ticket for ${activePass.holder} (${activePass.passId})...`);
  };

  return (
    <section className="section-padding digital-pass-section" id="digital-pass">
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto" }}>
          <span className="section-label">
            <Sparkles size={13} />
            CONTACTLESS ACCREDITATION
          </span>
          <h2 className="section-heading">Your TechTalk Pass, Always With You</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Every registered attendee receives a secure digital pass for fast and simple event check-in.
          </p>
        </div>

        <div className="ticket-showcase-container">
          <div className="ticket-wrapper">
            {/* Ticket Header Brand Band */}
            <div className="ticket-top-band">
              <div>
                <div style={{ fontSize: "0.75rem", letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.9 }}>
                  {activePass.org}
                </div>
                <div className="ticket-brand-title">
                  {activePass.event}
                </div>
              </div>

              <div className="ticket-edition-tag">
                {activePass.price}
              </div>
            </div>

            {/* Ticket Main Body */}
            <div className="ticket-body">
              <div className="ticket-info-block">
                <div>
                  <span className={`ticket-pass-type-badge ${
                    activePass.passType?.includes("STUDENT") ? "student" :
                    activePass.passType?.includes("FOUNDER") ? "founder" :
                    activePass.passType?.includes("DELEGAT") ? "delegate" : "visitor"
                  }`}>
                    {activePass.passType}
                  </span>
                </div>

                <div>
                  <div className="ticket-field-label">PASS HOLDER</div>
                  <div className="ticket-field-value">{activePass.holder}</div>
                  {(activePass.role || activePass.organization) && (
                    <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "2px", fontWeight: 600 }}>
                      {[activePass.role, activePass.organization].filter(Boolean).join(" • ")}
                    </div>
                  )}
                </div>

                <div>
                  <div className="ticket-field-label">PASS ID NO.</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="ticket-id-value">{activePass.passId}</span>
                    <button 
                      type="button"
                      onClick={handleCopyId} 
                      style={{ color: "var(--text-secondary)", padding: "4px" }}
                      title="Copy Pass ID"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px", fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <MapPin size={13} style={{ color: "var(--coral)" }} />
                    <span>Hyderabad, IN</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={13} style={{ color: "#16A34A" }} />
                    <span>2026 Season</span>
                  </div>
                </div>
              </div>

              {/* QR Code & Status */}
              <div className="ticket-qr-block">
                <div className="ticket-qr-svg-wrap">
                  <PassQRCodeSVG value={activePass.qrData} size={120} />
                </div>

                <div className="ticket-valid-tag">
                  <Check size={13} />
                  <span>{activePass.validation}</span>
                </div>
              </div>
            </div>

            {/* Ticket Perforated Tear Row & Badges */}
            <div className="ticket-pills-row">
              <div className="ticket-pill-item">
                <ShieldCheck size={15} style={{ color: "#16A34A" }} />
                <span>Secure</span>
              </div>
              <div className="ticket-pill-item">
                <Sparkles size={15} style={{ color: "var(--coral)" }} />
                <span>Unique</span>
              </div>
              <div className="ticket-pill-item">
                <Smartphone size={15} style={{ color: "var(--electric-blue)" }} />
                <span>Contactless</span>
              </div>
            </div>
          </div>
        </div>

        {/* Supporting Actions */}
        <div className="ticket-actions-bar">
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={handleDownload}
          >
            <Download size={15} />
            <span>Download Pass (PDF)</span>
          </button>

          <a href="/#scanner" className="btn btn-primary btn-sm">
            <QrCode size={15} />
            <span>Test In QR Scanner Below ↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
