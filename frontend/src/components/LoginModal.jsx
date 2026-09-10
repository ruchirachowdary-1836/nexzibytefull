import React, { useState } from "react";
import { X, Sparkles, User, ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

export default function LoginModal() {
  const { loginModalOpen, setLoginModalOpen, user, setUser, showToast } = useApp();
  const [email, setEmail] = useState(user?.email || "lalitha@nexzibyte.com");
  const [name, setName] = useState(user?.name || "Lalitha");

  if (!loginModalOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name,
      fullName: name,
      email,
      isLoggedIn: true
    }));
    setLoginModalOpen(false);
    showToast(`Welcome, ${name}! Signed in to NexziByte TechTalk.`);
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

        <div style={{ marginBottom: "24px" }}>
          <span className="section-label">
            <Sparkles size={13} />
            MEMBER SIGN IN
          </span>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginTop: "6px" }}>
            Welcome to TechTalk
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Access your registered digital passes, discussions, and event tickets.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-field-group">
            <label className="form-label">Attendee Name</label>
            <input 
              type="text" 
              required
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-field-group">
            <label className="form-label">Registered Email</label>
            <input 
              type="email" 
              required
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "10px" }}>
            <User size={16} />
            <span>Sign In to NexziByte</span>
          </button>
        </form>
      </div>
    </div>
  );
}
