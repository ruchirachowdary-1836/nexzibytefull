import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api.js";
import { useApp } from "../context/AppContext.jsx";

const STAFF_ROLES = ["admin", "staff", "hr", "super_admin"];

export default function AdminDashboard() {
  const { user } = useApp();
  const [dashboard, setDashboard] = useState(null);
  const [registrations, setRegistrations] = useState({ total: 0, items: [] });
  const [filters, setFilters] = useState({});
  const [draftFilters, setDraftFilters] = useState({});
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(null);

  const loadRegistrations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRegistrations(await api.getAdminRegistrations(filters));
    } catch (requestError) {
      setError(requestError.message || "Admin registrations could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (!user || !STAFF_ROLES.includes(user.role)) return;
    api.getAdminDashboard().then(setDashboard).catch((requestError) => setError(requestError.message));
  }, [user]);

  useEffect(() => {
    if (user && STAFF_ROLES.includes(user.role)) loadRegistrations();
  }, [user, loadRegistrations]);

  const updateDraft = (key) => (event) => {
    setDraftFilters((current) => ({ ...current, [key]: event.target.value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    setFilters({ ...draftFilters });
  };

  const viewRegistration = async (id) => {
    setError("");
    try {
      setSelected(await api.getAdminRegistration(id));
    } catch (requestError) {
      setError(requestError.message || "Registration details could not be loaded.");
    }
  };

  const resend = async (registration) => {
    setResending(registration.id);
    setNotice("");
    setError("");
    try {
      const result = await api.resendAdminRegistrationEmail(registration.id);
      setNotice(result.submitted_to_provider
        ? "Brevo accepted the email submission."
        : "The registration remains saved, but Brevo did not accept the email submission.");
      await loadRegistrations();
    } catch (requestError) {
      setError(requestError.message || "Email resend could not be completed.");
    } finally {
      setResending(null);
    }
  };

  if (!user || !STAFF_ROLES.includes(user.role)) {
    return <div className="section-padding"><div className="container"><h1 className="section-heading">Staff access only</h1><p className="section-subtitle">This dashboard is restricted to authorized staff members.</p><Link className="btn btn-primary" to="/dashboard">Open member dashboard</Link></div></div>;
  }

  return (
    <div className="section-padding">
      <div className="container">
        <span className="section-label">STAFF &amp; HR OPERATIONS</span>
        <h1 className="section-heading">Admin dashboard</h1>
        {error && <p role="alert">{error}</p>}
        {notice && <p role="status">{notice}</p>}
        {dashboard && <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(dashboard, null, 2)}</pre>}

        <section aria-labelledby="admin-registrations-title" style={{ marginTop: "36px" }}>
          <h2 id="admin-registrations-title">Event registrations ({registrations.total})</h2>
          <form onSubmit={applyFilters} style={{ display: "flex", gap: "10px", flexWrap: "wrap", margin: "16px 0" }}>
            <input aria-label="Search user name or email" placeholder="Name or email" value={draftFilters.search || ""} onChange={updateDraft("search")} />
            <input aria-label="Filter event name" placeholder="Event name" value={draftFilters.event || ""} onChange={updateDraft("event")} />
            <input aria-label="Filter pass ID" placeholder="Pass ID" value={draftFilters.pass_id || ""} onChange={updateDraft("pass_id")} />
            <select aria-label="Filter event type" value={draftFilters.event_type || ""} onChange={updateDraft("event_type")}>
              <option value="">All event types</option>
              <option value="summit">Summit</option>
              <option value="founder_meet">Founder meet</option>
            </select>
            <input aria-label="Filter event ID" type="number" min="1" placeholder="Event ID" value={draftFilters.event_id || ""} onChange={updateDraft("event_id")} />
            <input aria-label="Filter registration status" placeholder="Registration status" value={draftFilters.status || ""} onChange={updateDraft("status")} />
            <select aria-label="Filter email status" value={draftFilters.email_status || ""} onChange={updateDraft("email_status")}>
              <option value="">All email statuses</option>
              {["pending", "sending", "sent", "failed", "not_eligible"].map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <label>From <input aria-label="Registered from date" type="date" value={draftFilters.registered_from || ""} onChange={updateDraft("registered_from")} /></label>
            <label>To <input aria-label="Registered through date" type="date" value={draftFilters.registered_to || ""} onChange={updateDraft("registered_to")} /></label>
            <button type="submit" className="btn btn-primary">Apply filters</button>
          </form>

          {loading ? <p role="status">Loading registrations…</p> : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["ID", "User / email", "Event", "Type / ID", "Status", "Registered at", "Pass ID", "Email status", "Email sent", "Last attempt", "Actions"].map((heading) => <th key={heading} scope="col" style={{ textAlign: "left", padding: "10px" }}>{heading}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {registrations.items.map((registration) => (
                    <tr key={registration.id}>
                      <td>{registration.id}</td>
                      <td>{registration.user_name}<br />{registration.email}</td>
                      <td>{registration.event_name}</td>
                      <td>{registration.event_type} / {registration.event_id}</td>
                      <td>{registration.status}</td>
                      <td>{registration.registered_at ? new Date(registration.registered_at).toLocaleString() : "—"}</td>
                      <td>{registration.pass_id || "Pending"}</td>
                      <td>{registration.email_delivery_status || "pending"}</td>
                      <td>{registration.email_sent_at ? new Date(registration.email_sent_at).toLocaleString() : "—"}</td>
                      <td>{registration.email_last_attempt_at ? new Date(registration.email_last_attempt_at).toLocaleString() : "—"}</td>
                      <td>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => viewRegistration(registration.id)}>View</button>{" "}
                        <button type="button" className="btn btn-secondary btn-sm" disabled={resending === registration.id} onClick={() => resend(registration)}>
                          {resending === registration.id ? "Sending…" : "Resend email"}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!registrations.items.length && <tr><td colSpan="11">No registrations match these filters.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
          {selected && (
            <aside aria-label="Selected registration details" style={{ marginTop: "20px", padding: "16px", border: "1px solid currentColor", borderRadius: "12px" }}>
              <button type="button" onClick={() => setSelected(null)} aria-label="Close registration details">Close</button>
              <h3>Registration #{selected.id}: {selected.event_name}</h3>
              <p>{selected.user_name} · {selected.email}</p>
              <p>{selected.event_type} #{selected.event_id} · {selected.status}</p>
              <p>Pass: {selected.pass_id || "Pending"} · QR available: {selected.qr_available ? "Yes" : "No"}</p>
              <p>Email: {selected.email_delivery_status} · Sent at: {selected.email_sent_at ? new Date(selected.email_sent_at).toLocaleString() : "Not submitted"}</p>
              <p>Last attempt: {selected.email_last_attempt_at ? new Date(selected.email_last_attempt_at).toLocaleString() : "None"}</p>
            </aside>
          )}
        </section>
      </div>
    </div>
  );
}
