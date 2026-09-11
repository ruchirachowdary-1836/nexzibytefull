import React, { useState } from "react";
import { X, Sparkles, User } from "lucide-react";
import { useClerk } from "@clerk/clerk-react";
import { useApp } from "../context/AppContext.jsx";

export default function LoginModal() {
  const { loginModalOpen, setLoginModalOpen, login, register, showToast } = useApp();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

  if (!loginModalOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (mode === "register") await register({ name, email, password });
      else await login({ email, password, name });
      setLoginModalOpen(false);
      showToast("Welcome to NexziByte TechTalk.");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="modal-backdrop-overlay" onClick={() => setLoginModalOpen(false)}>
      <div className="modal-content-card" style={{ maxWidth: "440px" }} onClick={(event) => event.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={() => setLoginModalOpen(false)} aria-label="Close modal"><X size={18} /></button>
        <div style={{ marginBottom: "24px" }}>
          <span className="section-label"><Sparkles size={13} /> {mode === "login" ? "MEMBER SIGN IN" : "CREATE YOUR ACCOUNT"}</span>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginTop: "6px" }}>{mode === "login" ? "Welcome to TechTalk" : "Join NexziByte TechTalk"}</h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "4px" }}>Your profile is created from the details you submit and stored in your account.</p>
        </div>
        <form onSubmit={handleSubmit}>
          {mode === "register" ? <div className="form-field-group"><label className="form-label">Full Name</label><input type="text" required className="form-input" value={name} onChange={(event) => setName(event.target.value)} /></div> : null}
          <div className="form-field-group"><label className="form-label">Email</label><input type="email" required className="form-input" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
          <div className="form-field-group"><label className="form-label">Password</label><input type="password" required minLength={8} className="form-input" value={password} onChange={(event) => setPassword(event.target.value)} /></div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "10px" }}><User size={16} /><span>{mode === "login" ? "Sign In to NexziByte" : "Create NexziByte Account"}</span></button>
          {error ? <p className="form-error">{error}</p> : null}
        </form>
        {clerkEnabled ? <ClerkGoogleButton onSuccess={() => { setLoginModalOpen(false); showToast("Welcome to Nexzibyte TechTalk."); }} /> : null}
        <button type="button" className="btn btn-secondary" style={{ width: "100%", marginTop: "10px" }} onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>{mode === "login" ? "Create an account" : "Already have an account? Sign in"}</button>
      </div>
    </div>
  );
}

function ClerkGoogleButton({ onSuccess }) {
  const { openSignIn } = useClerk();
  return (
    <button
      type="button"
      className="btn btn-secondary"
      style={{ width: "100%", marginTop: "10px" }}
      onClick={() => openSignIn({ afterSignInUrl: window.location.pathname }).then(onSuccess)}
    >
      Continue with Google
    </button>
  );
}
