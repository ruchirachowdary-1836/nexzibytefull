import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api.js";
import { useApp } from "../context/AppContext.jsx";

export default function AdminDashboard() {
  const { user } = useApp();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !["admin", "staff", "hr"].includes(user.role)) return;
    api.getAdminDashboard().then(setDashboard).catch((requestError) => setError(requestError.message));
  }, [user]);

  if (!user || !["admin", "staff", "hr"].includes(user.role)) {
    return <div className="section-padding"><div className="container"><h1 className="section-heading">Staff &amp; HR access only</h1><p className="section-subtitle">This dashboard is restricted to authorized staff members.</p><Link className="btn btn-primary" to="/dashboard">Open member dashboard</Link></div></div>;
  }
  return (
    <div className="section-padding">
      <div className="container">
        <span className="section-label">STAFF &amp; HR OPERATIONS</span>
        <h1 className="section-heading">Admin dashboard</h1>
        {error && <p role="alert">{error}</p>}
        {dashboard && <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(dashboard, null, 2)}</pre>}
      </div>
    </div>
  );
}
