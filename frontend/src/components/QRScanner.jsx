import React, { useState, useRef, useEffect } from "react";
import { 
  Camera, CheckCircle, XCircle, RefreshCw, QrCode, Sparkles, 
  Check, ShieldAlert, ArrowRight, UserCheck, AlertTriangle 
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

export default function QRScanner() {
  const { activePass, checkInPass, resetCheckIn, showToast } = useApp();
  
  const [scannerOpen, setScannerOpen] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanResult, setScanResult] = useState({
    status: "valid", // "valid", "invalid", "idle"
    attendee: activePass.holder,
    pass: activePass.passType,
    amount: activePass.price,
    payment: "Verified",
    checkedIn: activePass.checkedIn,
    passId: activePass.passId
  });

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Sync with activePass
  useEffect(() => {
    setScanResult({
      status: "valid",
      attendee: activePass.holder,
      pass: activePass.passType,
      amount: activePass.price,
      payment: "Verified",
      checkedIn: activePass.checkedIn,
      passId: activePass.passId
    });
  }, [activePass]);

  // Handle Browser Camera toggle
  const toggleCamera = async () => {
    if (cameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      setCameraActive(false);
      showToast("Camera stream stopped.");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
        showToast("Live camera stream activated!");
      } catch (err) {
        setCameraActive(false);
        showToast("Camera access unavailable. Using interactive scanner simulation.");
      }
    }
  };

  // Scan an issued pass identifier from the backend.
  const handleScanValid = () => {
    setScanResult({
      status: "valid",
      attendee: activePass.holder,
      pass: activePass.passType,
      amount: activePass.price,
      payment: "Verified",
      checkedIn: activePass.checkedIn,
      passId: activePass.passId
    });
    showToast(`✓ QR Scanned: Verified pass ${activePass.passId} for ${activePass.holder}`);
  };

  // Simulate scanning an Invalid Pass
  const handleScanInvalid = () => {
    setScanResult({
      status: "invalid",
      attendee: "Unknown",
      pass: "N/A",
      amount: "₹0",
      payment: "Failed / Unrecognized",
      checkedIn: false,
      passId: "TT-INVALID-999"
    });
    showToast("✕ INVALID PASS: QR code hash signature mismatch.");
  };

  // Perform Check In
  const handleCheckInAttendee = () => {
    if (scanResult.status !== "valid") return;
    checkInPass(scanResult.passId);
    setScanResult((prev) => ({ ...prev, checkedIn: true }));
  };

  return (
    <section className="scanner-section" id="scanner">
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto" }}>
          <span className="section-label">
            <Sparkles size={13} />
            VENUE ENTRANCE ACCESS CONTROL
          </span>
          <h2 className="section-heading">Fast. Secure. Contactless.</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Scan an attendee's QR code and verify their event access instantly.
          </p>
        </div>

        <div className="scanner-ui-container">
          {/* LEFT: Professional Scanner Interface & Camera Frame */}
          <div>
            <div className="scanner-viewport-box">
              {/* If camera is active, render real video */}
              {cameraActive ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="scanner-video-preview" 
                />
              ) : (
                /* High-tech simulated camera preview */
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(circle at center, #1E1035 0%, #0A0E17 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <div style={{ textAlign: "center", color: "#A1A1AA" }}>
                    <QrCode size={56} style={{ color: "var(--primary-purple)", marginBottom: "12px", opacity: 0.9 }} />
                    <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>Optical Scanner Sensor Ready</div>
                    <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>Align attendee pass QR code within reticle</div>
                  </div>
                </div>
              )}

              {/* Four Corner Brackets Reticle */}
              <div className="scanner-reticle">
                <div className="scanner-corner top-left"></div>
                <div className="scanner-corner top-right"></div>
                <div className="scanner-corner bottom-left"></div>
                <div className="scanner-corner bottom-right"></div>

                {/* Animated Laser Scanning Line */}
                <div className="scanner-laser-line"></div>
              </div>

              {/* Status Overlay */}
              <div className="scanner-simulation-overlay">
                <span>{cameraActive ? "● LIVE WEBCAM" : "● SIMULATION MODE"}</span>
                <span>FPS: 60 | LATENCY: 12ms</span>
              </div>
            </div>

            {/* Quick Actions for Testing */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "18px", flexWrap: "wrap" }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={toggleCamera}
              >
                <Camera size={15} />
                <span>{cameraActive ? "Stop Camera" : "Open QR Scanner (Camera)"}</span>
              </button>

              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={handleScanValid}
              >
                <CheckCircle size={15} style={{ color: "#16A34A" }} />
                <span>Scan Valid Pass ({activePass.holder})</span>
              </button>

              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={handleScanInvalid}
              >
                <AlertTriangle size={15} style={{ color: "#EF4444" }} />
                <span>Test Invalid QR</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Scanner Verification Results Panel */}
          <div className="scanner-results-card">
            {scanResult.status === "valid" ? (
              <div>
                <div className="scan-status-banner valid">
                  <CheckCircle size={22} />
                  <span>✓ PASS VERIFIED</span>
                </div>

                <div className="attendee-details-grid">
                  <div className="detail-item-box">
                    <div className="detail-label">Attendee</div>
                    <div className="detail-value">{scanResult.attendee}</div>
                  </div>

                  <div className="detail-item-box">
                    <div className="detail-label">Pass</div>
                    <div className="detail-value" style={{ color: "var(--primary-purple)" }}>
                      {scanResult.pass}
                    </div>
                  </div>

                  <div className="detail-item-box">
                    <div className="detail-label">Amount</div>
                    <div className="detail-value">{scanResult.amount}</div>
                  </div>

                  <div className="detail-item-box">
                    <div className="detail-label">Payment</div>
                    <div className="detail-value" style={{ color: "#16A34A" }}>
                      {scanResult.payment}
                    </div>
                  </div>
                </div>

                <div className="detail-item-box" style={{ marginBottom: "24px" }}>
                  <div className="detail-label">Check-in Status</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "4px" }}>
                    <div style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: scanResult.checkedIn ? "#16A34A" : "var(--coral)"
                    }}>
                      {scanResult.checkedIn ? "✓ Checked In (Venue Entry Verified)" : "Not Checked In"}
                    </div>
                    {scanResult.checkedIn && (
                      <button 
                        type="button"
                        onClick={() => resetCheckIn(scanResult.passId)}
                        style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textDecoration: "underline" }}
                      >
                        Reset Status
                      </button>
                    )}
                  </div>
                </div>

                <div className="scanner-toggle-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={handleCheckInAttendee}
                    disabled={scanResult.checkedIn}
                  >
                    <UserCheck size={18} />
                    <span>{scanResult.checkedIn ? "Attendee Already Checked In" : "Check In Attendee"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="scan-status-banner invalid">
                  <XCircle size={22} />
                  <span>✕ INVALID PASS</span>
                </div>

                <div style={{ background: "#FFFFFF", padding: "24px", borderRadius: "12px", border: "1px solid #FECACA", marginBottom: "24px" }}>
                  <p style={{ color: "#B91C1C", fontWeight: 600, marginBottom: "8px" }}>
                    This QR code could not be verified.
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                    The cryptographic signature was not recognized in the NexziByte TechTalk 2026 database. 
                    Please direct the attendee to the accreditation desk.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: "100%" }}
                  onClick={handleScanValid}
                >
                  <RefreshCw size={16} />
                  <span>Retry Scan with Valid Pass</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
