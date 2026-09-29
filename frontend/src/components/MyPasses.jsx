import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, QrCode, RefreshCw } from "lucide-react";
import { api, waitForRegistrationEmail } from "../lib/api.js";
import { useApp } from "../context/AppContext.jsx";

export default function MyPasses() {
  const { activateVisitorPass, visitorTimeRemaining } = useApp();
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(null);
  const [activating, setActivating] = useState(null);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");

  const loadPasses = useCallback(async () => {
    setError("");
    try {
      setPasses(await api.myPasses());
    } catch (loadError) {
      setError(loadError.message || "Your passes could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPasses();
  }, [loadPasses]);

  const resend = async (pass) => {
    setResending(`${pass.kind}:${pass.id}`);
    setNotice("");
    try {
      await api.resendRegistrationEmail(pass.kind, pass.id);
      const updated = await waitForRegistrationEmail(pass.kind, pass.id);
      if (updated) {
        setPasses((current) => current.map((entry) => (
          entry.kind === updated.kind && entry.id === updated.id ? updated : entry
        )));
      } else {
        await loadPasses();
      }
      setNotice(`Confirmation resend requested for ${pass.email}.`);
    } catch (requestError) {
      setActionError(requestError.message || "Confirmation email could not be resent.");
    } finally {
      setResending(null);
    }
  };

  const activate = async (pass) => {
    setActivating(pass.id);
    setActionError("");
    setNotice("");
    try {
      const updated = await activateVisitorPass(pass.id);
      setPasses((current) => current.map((entry) => (
        entry.kind === "pass_request" && entry.id === pass.id
          ? { ...entry, ...updated, expires_at: updated.expires_at }
          : entry
      )));
      setNotice("Your 10-minute visitor pass is active.");
    } catch (activationError) {
      setActionError(activationError.message || "Visitor pass activation could not be completed.");
    } finally {
      setActivating(null);
    }
  };

  const countdown = visitorTimeRemaining == null
    ? null
    : `${Math.floor(visitorTimeRemaining / 60)}:${String(visitorTimeRemaining % 60).padStart(2, "0")}`;

  return (
    <section className="section-padding" aria-labelledby="my-passes-title">
      <div className="container">
        <span className="section-label">YOUR REGISTRATIONS</span>
        <h1 id="my-passes-title" className="section-heading">My passes</h1>
        <p className="section-subtitle">Your pass status and scannable QR codes, loaded directly from your account.</p>
        {countdown !== null && (
          <p role="status" aria-live="polite">
            Visitor access remaining: {countdown}. Access ends automatically when this timer reaches zero.
          </p>
        )}
        {loading && <p>Loading your passes…</p>}
        {error && <p role="alert">{error}</p>}
        {notice && <p role="status">{notice}</p>}
        {actionError && <p role="alert">{actionError}</p>}
        {!loading && !error && passes.length === 0 && (
          <div className="stat-card">
            <p>You do not have any passes or applications yet.</p>
            <Link to="/passes" className="btn btn-primary">Explore passes</Link>
          </div>
        )}
        <div style={{ display: "grid", gap: "16px", marginTop: "24px" }}>
          {passes.map((pass) => (
            <article key={`${pass.kind}:${pass.id}`} className="stat-card" style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
              {pass.qr_image_data_uri ? (
                <img
                  src={pass.qr_image_data_uri}
                  alt={`QR code for ${pass.title} pass ${pass.pass_id}`}
                  width="148"
                  height="148"
                />
              ) : (
                <div aria-label="Pass has not been issued" style={{ width: "148px", height: "148px", display: "grid", placeItems: "center" }}>
                  <QrCode size={42} aria-hidden="true" />
                  <span>Pass pending</span>
                </div>
              )}
              <div style={{ flex: "1 1 240px" }}>
                <h2>{pass.title}</h2>
                <p>Status: {pass.status}</p>
                <p>{pass.pass_id ? `Pass ID: ${pass.pass_id}` : "Pass not issued yet."}</p>
                {pass.expires_at && <p>Pass expires: {pass.expires_at}</p>}
                {pass.date && <p>Date: {pass.date}{pass.time ? ` · ${pass.time}` : ""}</p>}
                {pass.venue && <p>Venue or join details: {pass.venue}</p>}
                <p>
                  <Mail size={14} aria-hidden="true" /> Email: {pass.email_delivery_status || "pending"}
                  {pass.email && ` · ${pass.email}`}
                </p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={resending === `${pass.kind}:${pass.id}`}
                  onClick={() => resend(pass)}
                >
                  <RefreshCw size={14} aria-hidden="true" />
                  {resending === `${pass.kind}:${pass.id}` ? "Requesting…" : "Resend confirmation"}
                </button>
                {pass.pass_type === "visitor-pass" &&
                  ["approved", "issued"].includes(pass.status) &&
                  !pass.expires_at && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={activating === pass.id}
                      onClick={() => activate(pass)}
                    >
                      {activating === pass.id ? "Activating…" : "Start 10-minute visitor pass"}
                    </button>
                  )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
