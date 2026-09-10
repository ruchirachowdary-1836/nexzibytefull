import React, { useState } from "react";
import { 
  X, Calendar, Clock, MapPin, Sparkles, CheckCircle2, 
  ArrowRight, Users, BookOpen, Award, Building, User, Mail, Phone, MapPinCheck 
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

export default function EventDetailModal({ event, isOpen, onClose, autoFocusRegister = false }) {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
    city: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [regPassId, setRegPassId] = useState("");

  if (!isOpen || !event) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      showToast("Please fill in your name, email, and phone number.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const generatedPassId = `NEX-EVT-${Math.floor(100000 + Math.random() * 900000)}`;
      setRegPassId(generatedPassId);
      setSubmitting(false);
      setRegistered(true);
      showToast(`Registration confirmed! Pass ID: ${generatedPassId}`);
    }, 800);
  };

  const handleResetRegistration = () => {
    setRegistered(false);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      organization: "",
      role: "",
      city: ""
    });
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
                      Secure your confirmed delegate seat and receive your digital QR pass instantly.
                    </p>
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="event-reg-form">
                    <div className="event-form-group">
                      <label htmlFor="reg-name" className="event-form-label">
                        <User size={14} /> Full Name *
                      </label>
                      <input 
                        id="reg-name"
                        type="text"
                        name="fullName"
                        required
                        placeholder="e.g. Alex Sharma"
                        className="event-form-input"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        autoFocus={autoFocusRegister}
                      />
                    </div>

                    <div className="event-form-group">
                      <label htmlFor="reg-email" className="event-form-label">
                        <Mail size={14} /> Email Address *
                      </label>
                      <input 
                        id="reg-email"
                        type="email"
                        name="email"
                        required
                        placeholder="alex@company.com"
                        className="event-form-input"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="event-form-group">
                      <label htmlFor="reg-phone" className="event-form-label">
                        <Phone size={14} /> Phone Number *
                      </label>
                      <input 
                        id="reg-phone"
                        type="tel"
                        name="phone"
                        required
                        placeholder="+91 98765 43210"
                        className="event-form-input"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="event-form-group">
                      <label htmlFor="reg-org" className="event-form-label">
                        <Building size={14} /> College / Company
                      </label>
                      <input 
                        id="reg-org"
                        type="text"
                        name="organization"
                        placeholder="e.g. IIT Hyderabad / Tech Corp"
                        className="event-form-input"
                        value={formData.organization}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="event-form-row">
                      <div className="event-form-group" style={{ flex: 1 }}>
                        <label htmlFor="reg-role" className="event-form-label">
                          Role
                        </label>
                        <input 
                          id="reg-role"
                          type="text"
                          name="role"
                          placeholder="e.g. Developer / Student"
                          className="event-form-input"
                          value={formData.role}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="event-form-group" style={{ flex: 1 }}>
                        <label htmlFor="reg-city" className="event-form-label">
                          <MapPinCheck size={14} /> City
                        </label>
                        <input 
                          id="reg-city"
                          type="text"
                          name="city"
                          placeholder="e.g. Hyderabad"
                          className="event-form-input"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-blue-primary btn-full"
                      disabled={submitting}
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
                    We’ve reserved your spot for <strong>{event.title}</strong>. A confirmation pass email has been dispatched.
                  </p>

                  <div className="event-pass-preview-box">
                    <div className="event-pass-preview-label">CONFIRMED PASS ID</div>
                    <div className="event-pass-preview-id">{regPassId}</div>
                    <div className="event-pass-preview-name">{formData.fullName}</div>
                    <div className="event-pass-preview-event">{event.date} • {event.location}</div>
                  </div>

                  <div className="event-success-actions">
                    <button 
                      type="button" 
                      className="btn btn-blue-primary btn-full"
                      onClick={onClose}
                    >
                      Done &amp; Return to Events
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm btn-full"
                      onClick={handleResetRegistration}
                      style={{ marginTop: "8px" }}
                    >
                      Register Another Attendee
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
