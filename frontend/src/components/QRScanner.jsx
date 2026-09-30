import React, { useState, useRef, useEffect } from "react";
import QrScanner from "qr-scanner";
import { 
  Camera, CheckCircle, XCircle, RefreshCw, QrCode, Sparkles, 
  Check, ShieldAlert, ArrowRight, UserCheck, AlertTriangle 
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { apiRequest } from "../lib/api.js";

export default function QRScanner() {
  const { activePass, checkInPass, showToast, user } = useApp();
  
  const [scannerOpen, setScannerOpen] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanResult, setScanResult] = useState({
    status: "idle",
    attendee: "No pass scanned",
    event: "",
    pass: "",
    amount: "",
    payment: "",
    checkedIn: false,
    passId: ""
  });

  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const scanLockRef = useRef(false);

  // Sync with activePass
  useEffect(() => {
    if (!activePass) return;
    setScanResult((previous) => ({
      ...previous,
      attendee: previous.attendee || activePass.holder,
      pass: previous.pass || activePass.passType,
      amount: previous.amount || activePass.price,
      checkedIn: activePass.checkedIn,
      passId: previous.passId || activePass.passId
    }));
  }, [activePass]);

  useEffect(() => () => {
    scannerRef.current?.stop();
    scannerRef.current?.destroy();
  }, []);

  const stopScanner = () => {
    scannerRef.current?.stop();
    scannerRef.current?.destroy();
    scannerRef.current = null;
    scanLockRef.current = false;
    setCameraActive(false);
  };

  const verifyQr = async (token) => {
    if (scanLockRef.current) return;
    scanLockRef.current = true;
    try {
      const result = await apiRequest("/qr/verify", {
        method: "POST",
        useNeonToken: true,
        body: JSON.stringify({ token }),
      });
      const valid = result.status === "VALID";
      setScanResult({
        status: valid ? "valid" : "invalid",
        attendee: result.attendee || "Unknown attendee",
        event: result.event || "",
        pass: result.pass_type || result.event_type || "Digital pass",
        amount: result.amount || "",
        payment: valid ? "Verified" : result.status,
        checkedIn: result.checked_in || false,
        passId: result.pass_id || "",
      });
      showToast(valid ? `✓ QR verified: ${result.pass_id || "valid pass"}` : `✕ ${result.status || "Invalid QR code"}`);
      stopScanner();
    } catch (error) {
      setScanResult((previous) => ({
        ...previous,
        status: "invalid",
        attendee: "Unable to retrieve attendee",
        payment: "Verification failed",
        error: error.message,
      }));
      showToast(`Unable to verify QR code: ${error.message}`);
      scanLockRef.current = false;
    }
  };

  const toggleCamera = async () => {
    if (cameraActive) {
      stopScanner();
      showToast("Camera stream stopped.");
    } else {
      try {
        if (!window.isSecureContext) throw new Error("Camera access requires HTTPS.");
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("This browser does not support camera access.");
        if (!videoRef.current) throw new Error("Scanner video is not ready.");
        const scanner = new QrScanner(
          videoRef.current,
          ({ data }) => verifyQr(data),
          { preferredCamera: "environment", highlightScanRegion: false, returnDetailedScanResult: true }
        );
        scannerRef.current = scanner;
        await scanner.start();
        setCameraActive(true);
        showToast("Camera ready. Align the QR code inside the frame.");
      } catch (err) {
        stopScanner();
        showToast(`Camera unavailable: ${err.message}`);
      }
    }
  };

  // Simulate scanning a Valid Pass (Lalitha TT26-000125)
  const handleScanValid = () => {
    if (activePass?.qrData) verifyQr(activePass.qrData);
    else showToast("No issued QR pass is available for testing.");
  };

  // Simulate scanning an Invalid Pass
  const handleScanInvalid = () => verifyQr("techtalk:pass:invalid.invalid");

  // Perform Check In
  const handleCheckInAttendee = () => {
    if (scanResult.status !== "valid") return;
    checkInPass(scanResult.passId);
    setScanResult((prev) => ({ ...prev, checkedIn: true }));
  };

  if (!["staff", "admin"].includes(user?.role)) return null;

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
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="scanner-video-preview"
                style={{ display: cameraActive ? "block" : "none" }}
              />
              {!cameraActive && (
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
                <span>Scan Current Pass ({activePass?.holder || "none issued"})</span>
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
                    <div className="detail-label">Event</div>
                    <div className="detail-value">{scanResult.event || "TechTalk access"}</div>
                  </div>

                  <div className="detail-item-box">
                    <div className="detail-label">Pass</div>
                    <div className="detail-value" style={{ color: "var(--primary-purple)" }}>
                      {scanResult.pass}
                    </div>
                  </div>

                  <div className="detail-item-box">
                    <div className="detail-label">Pass ID</div>
                    <div className="detail-value">{scanResult.passId}</div>
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
                    {scanResult.error ? `Unable to verify QR code: ${scanResult.error}` : "This QR code could not be verified."}
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
