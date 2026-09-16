import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

export default function MemberDashboard() {
  const { user, userPosts, passesList, logout } = useApp();
  if (!user) {
    return <div className="section-padding"><div className="container"><h1 className="section-heading">Sign in to view your dashboard</h1><Link className="btn btn-primary" to="/login">Sign in</Link></div></div>;
  }
  return (
    <div className="section-padding">
      <div className="container">
        <span className="section-label">MEMBER DASHBOARD</span>
        <h1 className="section-heading">Welcome, {user.name || user.email}</h1>
        <p className="section-subtitle">Your account activity, passes, and published dispatches are loaded from the backend.</p>
        <div className="stats-grid">
          <div className="stat-card"><strong>{passesList.length}</strong><span>Pass requests</span></div>
          <div className="stat-card"><strong>{userPosts.length}</strong><span>Published dispatches</span></div>
          <div className="stat-card"><strong>{user.email}</strong><span>Verified account</span></div>
        </div>
        <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
          <Link className="btn btn-primary" to="/profile">Open profile</Link>
          <Link className="btn btn-secondary" to="/passes">View passes</Link>
          <button className="btn btn-outline" type="button" onClick={logout}>Sign out</button>
        </div>
      </div>
    </div>
  );
}
