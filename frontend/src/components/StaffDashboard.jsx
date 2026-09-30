import React, { useEffect, useState } from "react";
import { api } from "../lib/api.js";

export default function StaffDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.getStaffDashboard()
      .then((data) => {
        if (active) setDashboard(data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "The staff dashboard could not be loaded.");
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="section-padding">
      <div className="container">
        <span className="section-label">STAFF OPERATIONS</span>
        <h1 className="section-heading">Staff dashboard</h1>
        {error && <p role="alert">{error}</p>}
        {!dashboard && !error && <p role="status">Loading events and counts…</p>}
        {dashboard && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <strong>{dashboard.total_registrations}</strong>
                <span>Event registrations</span>
              </div>
              <div className="stat-card">
                <strong>{dashboard.check_in_count}</strong>
                <span>Check-ins recorded ({dashboard.check_in_count_scope})</span>
              </div>
            </div>
            {!dashboard.has_event_data ? (
              <p role="status" style={{ marginTop: "24px" }}>No event data yet.</p>
            ) : (
              <section aria-labelledby="staff-events-title" style={{ marginTop: "32px" }}>
                <h2 id="staff-events-title">Events</h2>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th scope="col" style={{ textAlign: "left", padding: "10px" }}>Event</th>
                        <th scope="col" style={{ textAlign: "left", padding: "10px" }}>Type</th>
                        <th scope="col" style={{ textAlign: "left", padding: "10px" }}>Date</th>
                        <th scope="col" style={{ textAlign: "left", padding: "10px" }}>Registrations</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.events.map((event) => (
                        <tr key={`${event.event_type}-${event.id}`}>
                          <td>{event.title}</td>
                          <td>{event.event_type === "founder_meet" ? "Founder meet" : "Summit"}</td>
                          <td>{event.date || "—"}</td>
                          <td>{event.registration_count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
