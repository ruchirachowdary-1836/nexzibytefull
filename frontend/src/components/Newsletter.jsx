import React, { useState } from "react";
import { Sparkles, Mail, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.subscribeNewsletter(email.trim());
      setSubscribed(true);
      showToast("You are subscribed to NexziByte TechTalk.");
    } catch (submitError) {
      setError(submitError.message || "Your subscription could not be saved.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="newsletter-section" id="newsletter">
      <div className="container">
        <div className="newsletter-box">
          <span className="section-label">
            <Sparkles size={13} />
            WEEKLY DISPATCH
          </span>

          <h2 className="section-heading">Stay Ahead of What's Next</h2>
          
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Get technology insights, upcoming events and community updates directly in your inbox.
          </p>

          {subscribed ? (
            <div style={{
              background: "#DCFCE7",
              border: "1px solid #BBF7D0",
              color: "#15803D",
              padding: "16px 24px",
              borderRadius: "var(--radius-full)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: 600,
              fontSize: "0.9375rem",
              marginTop: "24px"
            }}>
              <CheckCircle2 size={18} />
              <span>You're subscribed! Check your inbox for the latest dispatch.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="newsletter-form">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
                aria-label="Email address"
              />
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
          )}
          {error && <p role="alert" className="form-error-message">{error}</p>}
        </div>
      </div>
    </section>
  );
}
