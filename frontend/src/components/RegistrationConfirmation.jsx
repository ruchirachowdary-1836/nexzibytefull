import React, { useState } from "react";
import { Mail, RefreshCw, X } from "lucide-react";
import { api, waitForRegistrationEmail } from "../lib/api.js";
import { useApp } from "../context/AppContext.jsx";

export default function RegistrationConfirmation() {
  const { registrationNotice, setRegistrationNotice } = useApp();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  if (!registrationNotice) return null;

  const status = registrationNotice.email_delivery_status;
  const message = status === "sent"
    ? `Confirmation sent to ${registrationNotice.email}.`
    : status === "failed"
      ? `Your registration was saved, but the email to ${registrationNotice.email} was not sent.`
      : status === "not_eligible"
        ? "Your registration was saved. Email confirmation is available only for a verified account email."
        : status === "unknown"
          ? "Your registration was saved. We could not check email delivery; view My Passes for the latest status."
          : `Your registration was saved. The confirmation email to ${registrationNotice.email} is still sending; check My Passes shortly.`;

  const resend = async () => {
    setSending(true);
    setError("");
    try {
      await api.resendRegistrationEmail(registrationNotice.kind, registrationNotice.id);
      const updated = await waitForRegistrationEmail(registrationNotice.kind, registrationNotice.id);
      setRegistrationNotice({
        ...registrationNotice,
        email_delivery_status: updated?.email_delivery_status || "queued",
        email: updated?.email || registrationNotice.email,
      });
    } catch (requestError) {
      setError(requestError.message || "Email resend could not be completed.");
    } finally {
      setSending(false);
    }
  };

  return (
    <aside
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        zIndex: 1200,
        right: "20px",
        bottom: "20px",
        width: "min(440px, calc(100vw - 40px))",
        padding: "16px",
        borderRadius: "14px",
        background: "#fff",
        boxShadow: "0 12px 40px rgba(17, 17, 24, .2)",
        border: "1px solid rgba(108, 59, 255, .18)",
      }}
    >
      <button
        type="button"
        aria-label="Dismiss confirmation"
        onClick={() => setRegistrationNotice(null)}
        style={{ position: "absolute", right: "10px", top: "10px" }}
      >
        <X size={16} />
      </button>
      <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", paddingRight: "18px" }}>
        <Mail size={20} aria-hidden="true" />
        <div>
          <strong>{message}</strong>
          {registrationNotice.title && <div>{registrationNotice.title}</div>}
          {error && <p role="alert">{error}</p>}
          {status !== "not_eligible" && (
            <button
              type="button"
              className="btn btn-secondary"
              disabled={sending || status === "queued" || status === "pending" || status === "sending"}
              onClick={resend}
              style={{ marginTop: "10px" }}
            >
              <RefreshCw size={14} aria-hidden="true" />
              {sending ? "Sending…" : "Resend confirmation"}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
