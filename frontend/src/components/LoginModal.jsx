import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Eye, EyeOff } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { TechTalkMinimalLogo } from "./AuthPage.jsx";

export default function LoginModal() {
  const { loginModalOpen, setLoginModalOpen, user, login, showToast } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!loginModalOpen) return null;

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    try {
      const authenticatedUser = await login({ email: email.trim(), password });
      setLoginModalOpen(false);
      showToast(`✓ Welcome back, ${authenticatedUser?.name || "Member"}! You are signed in.`);
      navigate("/profile");
    } catch (error) {
      showToast(`⚠️ ${error.message || "Unable to sign in."}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterClick = () => {
    setLoginModalOpen(false);
    navigate("/register");
  };

  const handleForgotPassword = () => {
    showToast(`📧 Password reset instructions sent to ${email}.`);
  };

  return (
    <div className="modal-backdrop-overlay" onClick={() => setLoginModalOpen(false)}>
      <div
        className="modal-content-card"
        style={{
          maxWidth: "420px",
          background: "#FFFFFF",
          borderRadius: "20px",
          padding: "36px 30px",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={() => setLoginModalOpen(false)}
          aria-label="Close modal"
          style={{ top: "16px", right: "16px" }}
        >
          <X size={18} />
        </button>

        {/* TechTalk Brand Logo mark with Picture 3 purple */}
        <div style={{ marginBottom: "20px" }}>
          <TechTalkMinimalLogo size={1.05} />
        </div>

        {/* Title matching Picture 2 */}
        <h2 style={{
          fontSize: "1.75rem",
          fontWeight: 800,
          color: "#0F172A",
          margin: "0 0 28px 0",
          letterSpacing: "-0.025em"
        }}>
          Log in to your account
        </h2>

        {/* Form or One-Click Email Sign In matching Picture 2 with Picture 3 purple */}
        {showEmailInput ? (
          <form onSubmit={handleLogin} style={{ textAlign: "left", width: "100%", marginBottom: "16px" }}>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                Email Address
              </label>
              <input
                type="email"
                required
                autoFocus
                className="form-input"
                style={{ background: "#F8FAFC", border: "1.5px solid #CBD5E1", color: "#0F172A", padding: "12px 14px", borderRadius: "10px" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#334155" }}>Password</label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  style={{ background: "none", border: "none", color: "#6C2BD9", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", padding: 0 }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="form-input"
                  style={{ background: "#F8FAFC", border: "1.5px solid #CBD5E1", color: "#0F172A", padding: "12px 14px", paddingRight: "40px", borderRadius: "10px" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748B", cursor: "pointer" }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "16px 28px",
                borderRadius: "9999px",
                background: "#6C2BD9",
                color: "#FFFFFF",
                fontSize: "1.05rem",
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(108, 43, 217, 0.35)",
                display: "block"
              }}
            >
              {submitting ? "Signing in..." : "Sign in with an email"}
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowEmailInput(true)}
            style={{
              width: "100%",
              padding: "16px 28px",
              borderRadius: "9999px",
              background: "#6C2BD9",
              color: "#FFFFFF",
              fontSize: "1.05rem",
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(108, 43, 217, 0.35)",
              display: "block",
              letterSpacing: "-0.01em"
            }}
          >
            Sign in with an email
          </button>
        )}

        {/* Links matching Picture 2 with Picture 3 purple */}
        <div style={{
          marginTop: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          fontSize: "0.95rem"
        }}>
          <div style={{ color: "#475569" }}>
            <span>Don't have an account? </span>
            <button
              type="button"
              onClick={handleRegisterClick}
              style={{
                background: "none",
                border: "none",
                color: "#6C2BD9",
                fontWeight: 700,
                cursor: "pointer",
                padding: 0,
                fontSize: "inherit"
              }}
            >
              Create account
            </button>
          </div>

          <div>
            <button
              type="button"
              onClick={handleForgotPassword}
              style={{
                background: "none",
                border: "none",
                color: "#6C2BD9",
                fontWeight: 600,
                cursor: "pointer",
                padding: 0,
                fontSize: "inherit"
              }}
            >
              Forgot your password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
