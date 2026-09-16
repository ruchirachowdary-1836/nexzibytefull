import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Sparkles, Lock, Mail, User, Briefcase, Eye, EyeOff, 
  CheckCircle2, ArrowRight, ShieldCheck, QrCode, Terminal, 
  ArrowLeft, Check, LogOut
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { neonAuthEnabled } from "../lib/neon.js";

const ROLE_OPTIONS = [
  "Senior Full Stack Developer",
  "Distributed Systems Architect",
  "Founder / Co-Founder",
  "Technology Student / Researcher",
  "AI / Machine Learning Engineer",
  "Cloud & DevOps Engineer",
  "Product Manager / Tech Lead",
  "Enterprise Technology Leader"
];

export default function AuthPage({ defaultMode = "login" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn, logout, login, register, loginWithGoogle, showToast } = useApp();

  // Mode: "login" or "register"
  const [mode, setMode] = useState(
    location.pathname === "/register" ? "register" : defaultMode
  );

  // Sync mode with route if navigating between /login and /register
  useEffect(() => {
    if (location.pathname === "/register") {
      setMode("register");
    } else if (location.pathname === "/login") {
      setMode("login");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isLoggedIn && location.pathname !== "/profile") {
      navigate("/profile", { replace: true });
    }
  }, [isLoggedIn, location.pathname, navigate]);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState(user?.email || "");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Form States
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regRole, setRegRole] = useState(ROLE_OPTIONS[0]);
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [referralContact, setReferralContact] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      showToast("⚠️ Please enter your email address.");
      return;
    }

    try {
      const authenticated = await login({ email: loginEmail.trim(), password: loginPassword });
      showToast(`✓ Welcome back, ${authenticated.name || "Member"}! You are signed in.`);
      navigate("/profile");
    } catch (error) {
      if (neonAuthEnabled && error.code === "EMAIL_VERIFICATION_REQUIRED") {
        showToast("📧 Verify your email with the code we sent, then sign in again.");
        navigate(`/verify-email?email=${encodeURIComponent(loginEmail.trim())}&provider=neon`);
        return;
      }
      showToast(`⚠️ ${error.message}`);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      showToast("⚠️ Please complete all required registration fields.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      showToast("⚠️ Passwords do not match. Please verify.");
      return;
    }

    if (!acceptTerms) {
      showToast("⚠️ Please accept the TechTalk Terms of Service.");
      return;
    }

    try {
      const result = await register({ name: regName.trim(), email: regEmail.trim(), password: regPassword, role: regRole, referral_contact: referralContact, accept_terms: acceptTerms });
      showToast(`📧 ${result.detail || "Account created. Check your email to verify your account."}`);
      navigate(`/verify-email?email=${encodeURIComponent(regEmail.trim())}&provider=neon`);
    } catch (error) {
      showToast(`⚠️ ${error.message}`);
    }
  };

  const handleForgotPassword = () => {
    showToast(`📧 Password reset instructions sent to ${loginEmail || "your email"}.`);
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      showToast(`⚠️ ${error.message}`);
    }
  };

  return (
    <div className="auth-page-luxury-wrapper">
      <div className="container">
        {/* Back Link */}
        <div style={{ marginBottom: "24px" }}>
          <Link to="/" className="breadcrumb-back-link">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="auth-page-card-grid">
          {/* ══════════════════════════════════════════════════════════════════
              LEFT SIDE: BRAND VALUE PANEL
              ══════════════════════════════════════════════════════════════════ */}
          <div className="auth-brand-side-card">
            <div className="auth-brand-badge">
              <Sparkles size={14} style={{ color: "var(--coral)" }} />
              <span>NEXZIBYTE TECHNOLOGY COMMUNITY</span>
            </div>

            <h2 className="auth-brand-headline">
              Where Technology Meets Ideas, <span className="hero-highlight-vibrant">People &amp; Possibilities</span>.
            </h2>

            <p className="auth-brand-subtitle">
              Join India’s premier technology ecosystem uniting engineers, founders, researchers, and enterprise architects across high-impact dispatches and summits.
            </p>

            {/* Feature Checklist */}
            <div className="auth-feature-checklist">
              <div className="auth-feature-item">
                <div className="feature-icon-box">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <strong>Digital Event Passes &amp; QR Entry</strong>
                  <p>Instant verification for Student, Founder, Delegation, and Visitor passes.</p>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="feature-icon-box">
                  <Terminal size={16} />
                </div>
                <div>
                  <strong>Technical Dispatches &amp; Case Studies</strong>
                  <p>Publish architecture teardowns, share blueprints, and discuss microservices.</p>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="feature-icon-box">
                  <Briefcase size={16} />
                </div>
                <div>
                  <strong>Exclusive Founder Meets Ecosystem</strong>
                  <p>Direct networking with startup leaders, Angel investors, and Sri KTR launch initiatives.</p>
                </div>
              </div>
            </div>

            {/* Platform Trust Stats */}
            <div className="auth-stats-strip">
              <div className="auth-stat-col">
                <div className="stat-num">5,000+</div>
                <div className="stat-lbl">Active Members</div>
              </div>
              <div className="auth-stat-col">
                <div className="stat-num">65+</div>
                <div className="stat-lbl">Tech Summits</div>
              </div>
              <div className="auth-stat-col">
                <div className="stat-num">100%</div>
                <div className="stat-lbl">Open Architecture</div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              RIGHT SIDE: AUTH FORM CARD
              ══════════════════════════════════════════════════════════════════ */}
          <div className="auth-form-side-card">
            {/* Active Session Notice Banner */}
            {isLoggedIn && (
              <div style={{ marginBottom: "18px", padding: "12px 16px", borderRadius: "10px", background: "rgba(56, 189, 248, 0.08)", border: "1px solid rgba(56, 189, 248, 0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                <div style={{ fontSize: "0.85rem", color: "#38BDF8" }}>
                  <span>Signed in as <strong>{user?.name || "Member"}</strong> ({user?.email})</span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: "4px 12px", fontSize: "0.8rem" }}
                  >
                    View Profile
                  </button>
                  <button
                    type="button"
                    onClick={logout}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: "4px 12px", fontSize: "0.8rem", color: "#EF4444", borderColor: "rgba(239, 68, 68, 0.4)", display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    <LogOut size={13} />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}

            {/* Mode Switcher Tabs (§18) */}
            <div className="auth-tabs-header" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={mode === "login"}
                className={`auth-tab-btn ${mode === "login" ? "is-active" : ""}`}
                onClick={() => setMode("login")}
              >
                Sign In
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={mode === "register"}
                className={`auth-tab-btn ${mode === "register" ? "is-active" : ""}`}
                onClick={() => setMode("register")}
              >
                Create Account
              </button>
            </div>

            {/* ─── TAB 1: LOGIN FORM (§18 Requirement) ─── */}
            {mode === "login" && (
              <form onSubmit={handleLoginSubmit} className="auth-form-content">
                <div className="form-header-block">
                  <h3 className="form-heading">Welcome Back</h3>
                  <p className="form-subtext">Sign in to your TechTalk ecosystem profile and digital passes.</p>
                </div>

                {/* Email Address */}
                <div className="form-field-group">
                  <label className="form-label">
                    <Mail size={13} style={{ display: "inline", marginRight: "4px" }} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="name@organization.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>

                {/* Password */}
                <div className="form-field-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label className="form-label">
                      <Lock size={13} style={{ display: "inline", marginRight: "4px" }} />
                      Password
                    </label>
                    <button 
                      type="button" 
                      className="form-link-subtle"
                      onClick={handleForgotPassword}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      required
                      className="form-input"
                      style={{ paddingRight: "40px" }}
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="form-checkbox-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me on this browser for 30 days</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary btn-auth-submit">
                  <span>Sign In to TechTalk</span>
                  <ArrowRight size={16} />
                </button>
                <button type="button" className="btn btn-secondary btn-auth-submit" onClick={handleGoogleLogin}>
                  Continue with Google
                </button>

                {/* Switch to Register */}
                <div className="auth-footer-switcher">
                  <span>Don't have an account yet?</span>
                  <button
                    type="button"
                    className="switcher-link"
                    onClick={() => setMode("register")}
                  >
                    Create an account
                  </button>
                </div>
              </form>
            )}

            {/* ─── TAB 2: REGISTER FORM (§18 Requirement) ─── */}
            {mode === "register" && (
              <form onSubmit={handleRegisterSubmit} className="auth-form-content">
                <div className="form-header-block">
                  <h3 className="form-heading">Create TechTalk Account</h3>
                  <p className="form-subtext">Join fellow architects, founders, and engineers today.</p>
                </div>

                {/* Full Name */}
                <div className="form-field-group">
                  <label className="form-label">
                    <User size={13} style={{ display: "inline", marginRight: "4px" }} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Your full name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                </div>

                {/* Work / Personal Email */}
                <div className="form-field-group">
                  <label className="form-label">
                    <Mail size={13} style={{ display: "inline", marginRight: "4px" }} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="name@nexzibyte.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>

                {/* Professional Role Selection (§18 Requirement) */}
                <div className="form-field-group">
                  <label className="form-label">
                    <Briefcase size={13} style={{ display: "inline", marginRight: "4px" }} />
                    Professional Role
                  </label>
                  <select
                    className="form-input form-select"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                  >
                    {ROLE_OPTIONS.map((r, i) => (
                      <option key={i} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field-group">
                  <label className="form-label">Referral Contact Number (optional)</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91 98765 43210"
                    value={referralContact}
                    onChange={(e) => setReferralContact(e.target.value)}
                  />
                </div>

                {/* Password & Confirm Password Row */}
                <div className="form-row-two-col">
                  <div className="form-field-group">
                    <label className="form-label">Password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showRegPassword ? "text" : "password"}
                        required
                        className="form-input"
                        placeholder="At least 8 characters"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                      >
                        {showRegPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-field-group">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      required
                      className="form-input"
                      placeholder="Repeat password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* Terms Acceptance Checkbox (§18 Requirement) */}
                <div className="form-checkbox-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      required
                    />
                    <span>
                      I agree to the <a href="/#terms" className="form-link-subtle">Terms of Service</a> and <a href="/#privacy" className="form-link-subtle">Privacy Policy</a>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary btn-auth-submit">
                  <span>Register for TechTalk</span>
                  <ArrowRight size={16} />
                </button>

                {/* Switch to Login */}
                <div className="auth-footer-switcher">
                  <span>Already have an account?</span>
                  <button
                    type="button"
                    className="switcher-link"
                    onClick={() => setMode("login")}
                  >
                    Sign in here
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
