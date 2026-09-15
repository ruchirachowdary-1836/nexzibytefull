import React, { useState } from "react";
import { X, Sparkles, User, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { neonAuthEnabled } from "../lib/neon.js";

export default function LoginModal() {
  const { loginModalOpen, setLoginModalOpen, user, login, register, loginWithGoogle, showToast } = useApp();
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [referralContact, setReferralContact] = useState("");

  if (!loginModalOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const authenticatedUser = isRegistering
        ? await register({ name, email, password, role: "user", referral_contact: referralContact, accept_terms: acceptTerms })
        : await login({ email, password });
      setLoginModalOpen(false);
      showToast(isRegistering
        ? `Account created for ${authenticatedUser.name || name}.`
        : `Welcome back, ${authenticatedUser.name || "Member"}! Signed in to NexziByte TechTalk.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="modal-backdrop-overlay" onClick={() => setLoginModalOpen(false)}>
      <div className="modal-content-card" style={{ maxWidth: "440px" }} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={() => setLoginModalOpen(false)}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div style={{ marginBottom: "20px" }}>
          <span className="section-label">
            <Sparkles size={13} />
            {isRegistering ? "CREATE ACCOUNT" : "MEMBER SIGN IN"}
          </span>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginTop: "6px" }}>
            {isRegistering ? "Join the TechTalk community" : "Welcome to TechTalk"}
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            {isRegistering
              ? "Create your account to register for events and save your profile."
              : "Access your registered digital passes, discussions, and authored dispatches."}
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {error && <p className="form-error" role="alert">{error}</p>}
          {isRegistering && (
            <div className="form-field-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          {isRegistering && (
            <div className="form-field-group">
              <label className="form-label">Referral contact number (optional)</label>
              <input type="tel" className="form-input" value={referralContact} onChange={(e) => setReferralContact(e.target.value)} />
              <label className="checkbox-label" style={{ marginTop: "10px" }}>
                <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} required />
                <span>I accept the Terms and Conditions and Privacy Policy.</span>
              </label>
            </div>
          )}
          <div className="form-field-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                required
                className="form-input"
                placeholder="name@organization.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-field-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="form-label">Password</label>
              {!isRegistering && <button
                type="button"
                className="form-link-subtle"
                onClick={() => showToast(`Password recovery link sent to ${email}.`)}
              >
                Forgot password?
              </button>}
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="form-input"
                style={{ paddingRight: "40px" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="form-checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me for 30 days</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "14px" }} disabled={submitting}>
            <span>{submitting ? (isRegistering ? "Creating account..." : "Signing in...") : (isRegistering ? "Create account" : "Sign In to NexziByte")}</span>
            <ArrowRight size={15} />
          </button>
          {!isRegistering && neonAuthEnabled && (
            <button type="button" className="btn btn-secondary" style={{ width: "100%", marginTop: "10px" }} onClick={handleGoogle}>
              Continue with Google
            </button>
          )}

          <div className="auth-footer-switcher" style={{ marginTop: "18px", textAlign: "center", fontSize: "0.875rem" }}>
            <span style={{ color: "var(--text-secondary)" }}>Don't have an account? </span>
            <button
              type="button"
              className="switcher-link"
              onClick={() => {
                setIsRegistering((current) => !current);
                setError("");
              }}
              style={{ background: "none", border: "none", color: "var(--nexzibyte-purple)", fontWeight: 700, cursor: "pointer" }}
            >
              {isRegistering ? "Sign in instead" : "Register here"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
