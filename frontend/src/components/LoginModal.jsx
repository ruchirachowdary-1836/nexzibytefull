import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Sparkles, User, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

export default function LoginModal() {
  const { loginModalOpen, setLoginModalOpen, user, login, showToast } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  if (!loginModalOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const authenticated = await login({ email, password });
      setLoginModalOpen(false);
      showToast(`Welcome back, ${authenticated.name || "Member"}! Signed in to NexziByte TechTalk.`);
    } catch (error) {
      showToast(`⚠️ ${error.message}`);
    }
  };

  const handleRegisterClick = () => {
    setLoginModalOpen(false);
    navigate("/register");
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
            MEMBER SIGN IN
          </span>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginTop: "6px" }}>
            Welcome to TechTalk
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Access your registered digital passes, discussions, and authored dispatches.
          </p>
        </div>

        <form onSubmit={handleLogin}>
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
              <button
                type="button"
                className="form-link-subtle"
                onClick={() => showToast(`Password recovery link sent to ${email}.`)}
              >
                Forgot password?
              </button>
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

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "14px" }}>
            <span>Sign In to NexziByte</span>
            <ArrowRight size={15} />
          </button>

          <div className="auth-footer-switcher" style={{ marginTop: "18px", textAlign: "center", fontSize: "0.875rem" }}>
            <span style={{ color: "var(--text-secondary)" }}>Don't have an account? </span>
            <button
              type="button"
              className="switcher-link"
              onClick={handleRegisterClick}
              style={{ background: "none", border: "none", color: "var(--nexzibyte-purple)", fontWeight: 700, cursor: "pointer" }}
            >
              Register here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
