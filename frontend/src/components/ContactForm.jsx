import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { api } from "../lib/api.js";

const EMPTY_FORM = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState({});
  const [error, setError] = useState("");

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const result = await api.submitContactInquiry({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      setEmailNotifications(result.email_notifications || {});
      setSubmitted(true);
      setForm(EMPTY_FORM);
    } catch (submitError) {
      setError(submitError.message || "Your inquiry could not be saved. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-padding" id="contact-us" aria-labelledby="contact-us-title">
      <div className="container" style={{ maxWidth: "760px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <span className="section-label">CONTACT NEXZIBYTE TECHTALK</span>
          <h2 id="contact-us-title" className="section-heading">How can we help?</h2>
          <p className="section-subtitle">
            Send our team a message. Your inquiry is saved securely and we will follow up by email.
          </p>
        </div>
        {submitted ? (
          <div className="host-success-box" role="status">
            <CheckCircle2 size={36} />
            <h3 className="host-success-title">Your message was received</h3>
            <p className="host-success-desc">
              We saved your inquiry. Thank you for reaching out.
            </p>
            {emailNotifications.admin_notification === "sent" ? (
              <p>Our team has been notified and will follow up by email.</p>
            ) : (
              <p>Our team notification could not be sent yet. We will review your saved inquiry.</p>
            )}
            {emailNotifications.submitter_confirmation !== "sent" && (
              <p role="status">We could not send a confirmation email yet.</p>
            )}
            <button type="button" className="btn btn-secondary" onClick={() => setSubmitted(false)}>
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="host-form">
            <div className="event-form-row">
              <label className="event-form-group" style={{ flex: 1 }}>
                <span className="event-form-label">Full name *</span>
                <input className="event-form-input" name="name" maxLength={120} required value={form.name} onChange={updateField} autoComplete="name" />
              </label>
              <label className="event-form-group" style={{ flex: 1 }}>
                <span className="event-form-label">Email address *</span>
                <input className="event-form-input" type="email" name="email" maxLength={255} required value={form.email} onChange={updateField} autoComplete="email" />
              </label>
            </div>
            <div className="event-form-row">
              <label className="event-form-group" style={{ flex: 1 }}>
                <span className="event-form-label">Phone number (optional)</span>
                <input className="event-form-input" type="tel" name="phone" maxLength={40} value={form.phone} onChange={updateField} autoComplete="tel" />
              </label>
              <label className="event-form-group" style={{ flex: 1 }}>
                <span className="event-form-label">Subject *</span>
                <input className="event-form-input" name="subject" maxLength={200} required value={form.subject} onChange={updateField} />
              </label>
            </div>
            <label className="event-form-group">
              <span className="event-form-label">Message *</span>
              <textarea className="event-form-textarea" name="message" rows={5} maxLength={5000} required value={form.message} onChange={updateField} />
            </label>
            {error && <p role="alert" className="form-error-message">{error}</p>}
            <button type="submit" className="btn btn-blue-primary" disabled={submitting}>
              <Send size={16} />
              {submitting ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
