import React, { useEffect, useState } from "react";
import { 
  X, Calendar, Clock, MapPin, Sparkles, CheckCircle2, 
  ArrowRight, Users, BookOpen, Award
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { api, waitForRegistrationEmail } from "../lib/api.js";

export default function EventDetailModal({ event, isOpen, onClose, autoFocusRegister = false }) {
  const { showToast, user } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [registrationError, setRegistrationError] = useState("");
  const [emailResending, setEmailResending] = useState(false);

  useEffect(() => {
    setSubmitting(false);
    setRegistered(false);
    setRegistration(null);
    setRegistrationError("");
    setEmailResending(false);
  }, [isOpen, event?.event_type, event?.id]);

  if (!isOpen || !event) return null;

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!user?.email) {
      setRegistrationError("Sign in with a verified account before registering.");
      return;
    }
    if (!["summit", "founder_meet"].includes(event.event_type) || !Number.isInteger(Number(event.id))) {
      setRegistrationError("This event is not currently available for registration. Choose a published event from the event list.");
      return;
    }
    setSubmitting(true);
    setRegistrationError("");
    try {
      const created = await api.registerForEvent(event.event_type, Number(event.id));
      setRegistration({
        ...created,
        email: user.email,
        event_name: created.event_name || event.title,
        email_delivery_status: created.email_delivery_status || "pending",
      });
      setRegistered(true);
      setSubmitting(false);
      waitForRegistrationEmail("registration", created.id)
        .then((updated) => {
          if (updated) {
            setRegistration((current) => (
              current ? { ...current, email_delivery_status: updated.email_delivery_status } : current
            ));
          }
        })
        .catch(() => {});
    } catch (error) {
      setRegistrationError(error.message || "Registration could not be completed. Please try again.");
      showToast(error.message || "Registration could not be completed. Please try again.");
      setSubmitting(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!registration?.id) return;
    setEmailResending(true);
    setRegistrationError("");
    try {
      await api.resendRegistrationEmail("registration", registration.id);
      const updated = await waitForRegistrationEmail("registration", registration.id);
      if (updated) {
        setRegistration((current) => (
          current ? { ...current, email_delivery_status: updated.email_delivery_status } : current
        ));
      }
    } catch (error) {
      setRegistrationError(error.message || "Confirmation email could not be resent.");
    } finally {
      setEmailResending(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="event-modal-title">
      <div 
        className="modal-container event-detail-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Hero Event Banner */}
        <div className="event-modal-banner-wrap">
          <img 
            src={event.image} 
            alt={event.title} 
            className="event-modal-banner-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80";
            }}
          />
          <div className="event-modal-banner-overlay">
            <div className="event-modal-banner-content">
              <div className="event-modal-tag-row">
                <span className="event-category-badge-pill">{event.category}</span>
                {event.modeBadge && (
                  <span className="event-mode-badge-pill">{event.modeBadge}</span>
                )}
                {event.badge && (
                  <span className="event-spotlight-badge-pill">{event.badge}</span>
                )}
              </div>
              <h2 id="event-modal-title" className="event-modal-title">{event.title}</h2>
              <div className="event-modal-quick-meta">
                <div className="event-modal-meta-item">
                  <Calendar size={16} className="text-blue-accent" />
                  <span>{event.date}</span>
                </div>
                <div className="event-modal-meta-item">
                  <Clock size={16} className="text-blue-accent" />
                  <span>{event.time}</span>
                </div>
                <div className="event-modal-meta-item">
                  <MapPin size={16} className="text-blue-accent" />
                  <span>{event.venue || event.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Main Body Grid */}
        <div className="event-modal-body-grid">
          {/* Left / Main Details Column */}
          <div className="event-modal-main-column">
            {/* About Section */}
            <div className="event-modal-section">
              <h3 className="event-modal-section-title">
                <BookOpen size={18} className="text-blue-accent" />
                About the Event
              </h3>
              <p className="event-modal-paragraph">
                {event.about || event.description}
              </p>
            </div>

            {/* Event Agenda Timeline */}
            {event.agenda && event.agenda.length > 0 && (
              <div className="event-modal-section">
                <h3 className="event-modal-section-title">
                  <Clock size={18} className="text-blue-accent" />
                  Event Agenda
                </h3>
                <div className="event-agenda-timeline">
                  {event.agenda.map((item, idx) => (
                    <div key={idx} className="event-agenda-item">
                      <div className="event-agenda-time">{item.time}</div>
                      <div className="event-agenda-dot" aria-hidden="true" />
                      <div className="event-agenda-content">
                        <div className="event-agenda-title">{item.title}</div>
                        {item.speaker && (
                          <div className="event-agenda-speaker">Led by: {item.speaker}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Keynote Speakers */}
            {((event.speakers && event.speakers.length > 0) || (event.speakersList && event.speakersList.length > 0)) && (
              <div className="event-modal-section">
                <h3 className="event-modal-section-title">
                  <Users size={18} className="text-blue-accent" />
                  Featured Speakers &amp; Leaders
                </h3>
                <div className="event-speakers-grid">
                  {(event.speakers || event.speakersList || []).map((spk, idx) => (
                    <div key={idx} className="event-speaker-card">
                      <img 
                        src={spk.image} 
                        alt={spk.name} 
                        className="event-speaker-avatar"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80";
                        }}
                      />
                      <div className="event-speaker-info">
                        <div className="event-speaker-name">{spk.name}</div>
                        <div className="event-speaker-role">{spk.role}</div>
                        <div className="event-speaker-org">{spk.org}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Who Should Attend */}
            {event.whoShouldAttend && event.whoShouldAttend.length > 0 && (
              <div className="event-modal-section">
                <h3 className="event-modal-section-title">
                  <Users size={18} className="text-blue-accent" />
                  Who Should Attend
                </h3>
                <ul className="event-checklist">
                  {event.whoShouldAttend.map((item, idx) => (
                    <li key={idx} className="event-checklist-item">
                      <CheckCircle2 size={17} className="text-blue-accent flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What Participants Will Learn */}
            {event.learnings && event.learnings.length > 0 && (
              <div className="event-modal-section">
                <h3 className="event-modal-section-title">
                  <Award size={18} className="text-blue-accent" />
                  What You Will Learn &amp; Experience
                </h3>
                <ul className="event-checklist">
                  {event.learnings.map((item, idx) => (
                    <li key={idx} className="event-checklist-item">
                      <Sparkles size={17} className="text-blue-accent flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right / Sticky Registration Card Column */}
          <div className="event-modal-sidebar-column">
            <div className="event-registration-card" id="event-registration-card">
              {!registered ? (
                <>
                  <div className="event-reg-header">
                    <span className="event-reg-badge">FREE ACCESS PASS</span>
                    <h3 className="event-reg-title">Register for This Event</h3>
                    <p className="event-reg-subtitle">
                      Register with your verified TechTalk account. Your pass is generated and saved by the server.
                    </p>
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="event-reg-form">
                    <div className="event-form-group">
                      <span className="event-form-label">Registering as</span>
                      <div className="event-form-input" aria-label="Signed in account">
                        {user?.name || "Signed-in member"} · {user?.email || "Sign in required"}
                      </div>
                    </div>

                    {registrationError && <p role="alert">{registrationError}</p>}

                    <button 
                      type="submit" 
                      className="btn btn-blue-primary btn-full"
                      disabled={submitting || !user || !event.event_type || !Number.isInteger(Number(event.id))}
                    >
                      {submitting ? (
                        <span>Registering Your Seat...</span>
                      ) : (
                        <>
                          <span>Register Now</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>

                    <p className="event-reg-notice">
                      🔒 No spam. Passes are 100% free and verified by NexziByte TechTalk.
                    </p>
                  </form>
                </>
              ) : (
                <div className="event-reg-success-card">
                  <div className="event-success-icon-wrap">
                    <CheckCircle2 size={36} className="text-blue-accent" />
                  </div>
                  <h3 className="event-success-title">You're Registered!</h3>
                  <p className="event-success-desc">
                    {registration?.email_delivery_status === "sent"
                      ? "Registration successful. Brevo accepted the confirmation email submission."
                      : registration?.email_delivery_status === "failed"
                        ? "Registration successful. Your pass has been generated, but we couldn't send the confirmation email yet."
                        : registration?.email_delivery_status === "not_eligible"
                          ? "Registration successful. Email confirmation requires an active account with a verified email."
                          : "Registration successful. Your pass has been generated; confirmation email status is still processing."}
                  </p>

                  <div className="event-pass-preview-box">
                    <div className="event-pass-preview-label">CONFIRMED PASS ID</div>
                    <div className="event-pass-preview-id">{registration?.pass_id}</div>
                    <div className="event-pass-preview-name">{user?.name}</div>
                    <div className="event-pass-preview-event">{event.date} • {event.venue || event.location}</div>
                    <div className="event-pass-preview-event">Registered email: {registration?.email}</div>
                    <div className="event-pass-preview-event">Email status: {registration?.email_delivery_status || "pending"}</div>
                    {registration?.email_delivery_status === "failed" && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        disabled={emailResending}
                        onClick={handleResendConfirmation}
                      >
                        {emailResending ? "Requesting resend…" : "Resend confirmation email"}
                      </button>
                    )}
                    {registrationError && <p role="alert">{registrationError}</p>}
                  </div>

                  <div className="event-success-actions">
                    <button 
                      type="button" 
                      className="btn btn-blue-primary btn-full"
                      onClick={onClose}
                    >
                      Done &amp; Return to Events
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
