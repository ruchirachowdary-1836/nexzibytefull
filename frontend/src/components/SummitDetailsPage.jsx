import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Sparkles, Calendar, Clock, MapPin, Share2, Bookmark, CheckCircle2, 
  Users, ExternalLink, ArrowRight, ArrowLeft, Mic, Building2, Ticket, 
  Award, Globe, Shield, Download, ChevronRight, Navigation, Check,
  Radio, Phone, Layers, Info
} from "lucide-react";
import { SUMMIT_LIST, DEFAULT_SUMMIT } from "../data/summitsData.js";
import { useApp } from "../context/AppContext.jsx";

export default function SummitDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openPassModal, showToast } = useApp();

  // Selected summit based on URL param or fallback to default
  const currentSummit = useMemo(() => {
    if (!id) return DEFAULT_SUMMIT;
    const found = SUMMIT_LIST.find((s) => s.id === id);
    return found || DEFAULT_SUMMIT;
  }, [id]);

  // Agenda Active Day Tab
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [selectedTrackFilter, setSelectedTrackFilter] = useState("all");
  const [savedSummit, setSavedSummit] = useState(false);

  // Reset active day when summit changes
  useEffect(() => {
    setActiveDayIdx(0);
    setSelectedTrackFilter("all");
    window.scrollTo(0, 0);
  }, [currentSummit.id]);

  const activeDayAgenda = currentSummit.agenda && currentSummit.agenda[activeDayIdx] 
    ? currentSummit.agenda[activeDayIdx] 
    : currentSummit.agenda?.[0];

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    if (!activeDayAgenda?.sessions) return [];
    if (selectedTrackFilter === "all") return activeDayAgenda.sessions;
    return activeDayAgenda.sessions.filter(
      (sess) => sess.track === selectedTrackFilter || sess.track === "All Tracks"
    );
  }, [activeDayAgenda, selectedTrackFilter]);

  // Share handler
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(`🔗 Link to "${currentSummit.title}" copied to clipboard!`);
    } else {
      showToast("Link ready to share!");
    }
  };

  // Add to Calendar helper
  const handleAddToCalendar = () => {
    const title = encodeURIComponent(currentSummit.title);
    const details = encodeURIComponent(currentSummit.about);
    const location = encodeURIComponent(`${currentSummit.venue.name}, ${currentSummit.location}`);
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleCalendarUrl, "_blank", "noopener,noreferrer");
    showToast("Opening Google Calendar...");
  };

  // Toggle bookmark
  const handleBookmarkToggle = () => {
    setSavedSummit(prev => !prev);
    showToast(savedSummit ? "Summit removed from saved bookmarks." : "⭐ Summit saved to your bookmarks!");
  };

  return (
    <div className="summit-details-page">
      {/* ── 1. TOP BREADCRUMB & SUMMIT SWITCHER BAR ── */}
      <div className="summit-top-subbar">
        <div className="container">
          <div className="summit-subbar-inner">
            <div className="summit-breadcrumbs">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-sep">/</span>
              <Link to="/summits" className="breadcrumb-link">Summits</Link>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-current">{currentSummit.title}</span>
            </div>

            {/* Quick Switcher for all major summits */}
            <div className="summit-quick-picker">
              <span className="picker-label">EXPLORE SUMMITS:</span>
              <div className="picker-pills">
                {SUMMIT_LIST.map((summit) => (
                  <button
                    key={summit.id}
                    type="button"
                    onClick={() => navigate(`/summits/${summit.id}`)}
                    className={`picker-pill-btn ${summit.id === currentSummit.id ? "active" : ""}`}
                  >
                    {summit.id === "featured-tech-innovation-summit-2026" ? "Innovation Summit 2026" : 
                     summit.id === "summit-gpacts-2026" ? "GPACTS 2026" : 
                     summit.id === "summit-gcc-2026" ? "GCC Summit 2026" : "Product Launch"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. SUMMIT GRAND HERO BANNER ── */}
      <section className="summit-hero-banner-section">
        <div className="summit-hero-bg-overlay" />
        <img 
          src={currentSummit.bannerImage} 
          alt={currentSummit.title} 
          className="summit-hero-backdrop-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/summit-gpacts.jpg";
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 3 }}>
          <div className="summit-hero-grid">
            <div className="summit-hero-main">
              {/* Badge Row */}
              <div className="summit-badge-row">
                <span className="summit-hero-badge">
                  <Sparkles size={14} className="badge-sparkle-icon" />
                  {currentSummit.badge}
                </span>
                <span className="summit-status-badge">
                  <Radio size={12} className="live-dot-pulse" />
                  {currentSummit.statusBadge || "Registration Open"}
                </span>
                {currentSummit.spotsLeft > 0 && (
                  <span className="summit-spots-badge">
                    ⚡ {currentSummit.spotsLeft} Passes Remaining
                  </span>
                )}
              </div>

              {/* Title & Subtitle */}
              <h1 className="summit-hero-title">
                {currentSummit.title}
              </h1>

              <p className="summit-hero-subtitle">
                {currentSummit.subtitle}
              </p>

              <div className="summit-hero-tagline-box">
                "{currentSummit.tagline}"
              </div>

              {/* Event Meta Grid */}
              <div className="summit-meta-grid">
                <div className="summit-meta-card">
                  <Calendar size={18} className="meta-icon coral" />
                  <div>
                    <span className="meta-label">DATE</span>
                    <strong className="meta-val">{currentSummit.date}</strong>
                  </div>
                </div>

                <div className="summit-meta-card">
                  <Clock size={18} className="meta-icon purple" />
                  <div>
                    <span className="meta-label">TIME</span>
                    <strong className="meta-val">{currentSummit.time}</strong>
                  </div>
                </div>

                <div className="summit-meta-card">
                  <MapPin size={18} className="meta-icon blue" />
                  <div>
                    <span className="meta-label">VENUE &amp; CITY</span>
                    <strong className="meta-val">{currentSummit.venue?.name || currentSummit.location}</strong>
                  </div>
                </div>

                <div className="summit-meta-card">
                  <Globe size={18} className="meta-icon green" />
                  <div>
                    <span className="meta-label">ATTENDANCE MODE</span>
                    <strong className="meta-val">{currentSummit.mode}</strong>
                  </div>
                </div>
              </div>

              {/* Hero Action Buttons */}
              <div className="summit-hero-actions-bar">
                <button
                  type="button"
                  className="btn btn-coral btn-lg summit-cta-btn"
                  onClick={() => {
                    const el = document.getElementById("passes-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                    else openPassModal("delegate-pass");
                  }}
                >
                  <Ticket size={18} />
                  <span>Register for Summit Passes</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-lg"
                  onClick={() => {
                    const el = document.getElementById("agenda-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <Clock size={16} />
                  <span>Explore Schedule</span>
                </button>

                <div className="summit-hero-utility-btns">
                  <button 
                    type="button" 
                    className={`btn-icon-square ${savedSummit ? "bookmarked" : ""}`}
                    onClick={handleBookmarkToggle}
                    title="Bookmark Summit"
                    aria-label="Bookmark"
                  >
                    <Bookmark size={18} />
                  </button>

                  <button 
                    type="button" 
                    className="btn-icon-square"
                    onClick={handleShare}
                    title="Share Summit Link"
                    aria-label="Share"
                  >
                    <Share2 size={18} />
                  </button>

                  <button 
                    type="button" 
                    className="btn-icon-square"
                    onClick={handleAddToCalendar}
                    title="Add to Google Calendar"
                    aria-label="Add to Calendar"
                  >
                    <Calendar size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. CONFERENCE STATS STRIP ── */}
      <section className="summit-stats-strip-section">
        <div className="container">
          <div className="summit-stats-grid">
            {currentSummit.stats.map((st, idx) => (
              <div key={idx} className="summit-strip-stat-item">
                <div className="stat-number-display">{st.value}</div>
                <div className="stat-label-display">{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. ABOUT THE SUMMIT & PILLARS ── */}
      <section className="section-padding summit-about-section" id="about-section">
        <div className="container">
          <div className="summit-about-layout">
            {/* Left: About Content */}
            <div className="summit-about-main-text">
              <span className="section-label">
                <Sparkles size={13} />
                CONFERENCE BRIEFING
              </span>
              <h2 className="section-heading">
                About The Summit
              </h2>
              
              <div className="summit-editorial-body">
                {currentSummit.about.split("\n\n").map((para, i) => (
                  <p key={i} className="about-body-para">{para}</p>
                ))}
              </div>

              {/* Highlights Check List */}
              <div className="summit-highlights-box">
                <h3 className="highlights-title">Key Summit Highlights &amp; Takeaways</h3>
                <div className="highlights-checklist">
                  {currentSummit.highlights?.map((h, i) => (
                    <div key={i} className="highlight-item-row">
                      <CheckCircle2 size={18} className="highlight-check-icon" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Key Focus Themes */}
            <div className="summit-themes-sidebar">
              <div className="themes-card-wrapper">
                <h3 className="themes-card-heading">
                  <Layers size={18} className="themes-icon" />
                  Key Technical Themes
                </h3>
                <div className="themes-list">
                  {currentSummit.themes?.map((th, idx) => (
                    <div key={idx} className="theme-entry">
                      <div className="theme-number">0{idx + 1}</div>
                      <div>
                        <h4 className="theme-entry-title">{th.title}</h4>
                        <p className="theme-entry-desc">{th.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Who Should Attend Box */}
              <div className="who-attend-box">
                <h3 className="who-attend-heading">
                  <Users size={18} style={{ color: "var(--coral)" }} />
                  Who Should Attend
                </h3>
                <div className="who-attend-list">
                  {currentSummit.whoShouldAttend?.map((aud, idx) => (
                    <div key={idx} className="who-attend-item">
                      <div className="aud-title">{aud.title}</div>
                      <div className="aud-desc">{aud.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. INTERACTIVE MULTI-TRACK AGENDA ── */}
      <section className="section-padding summit-agenda-section" id="agenda-section">
        <div className="container">
          <div className="agenda-header-row">
            <div>
              <span className="section-label">
                <Clock size={13} />
                TIMETABLE &amp; TRACKS
              </span>
              <h2 className="section-heading">
                Summit Schedule &amp; Agenda
              </h2>
              <p className="section-subtitle">
                Explore keynotes, architectural deep-dives, panel discussions, and interactive code clinics.
              </p>
            </div>

            {/* Day Switcher Tabs if multi-day */}
            {currentSummit.agenda && currentSummit.agenda.length > 1 && (
              <div className="agenda-day-tabs">
                {currentSummit.agenda.map((ag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`agenda-day-tab-btn ${activeDayIdx === idx ? "active" : ""}`}
                    onClick={() => {
                      setActiveDayIdx(idx);
                      setSelectedTrackFilter("all");
                    }}
                  >
                    <strong>{ag.day}</strong>
                    <small>{ag.date.split(",")[0]}</small>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Track Filter Pills */}
          {activeDayAgenda?.tracks && activeDayAgenda.tracks.length > 1 && (
            <div className="agenda-track-filters-bar">
              <span className="track-filter-label">Filter Track:</span>
              <button
                type="button"
                className={`track-pill-btn ${selectedTrackFilter === "all" ? "active" : ""}`}
                onClick={() => setSelectedTrackFilter("all")}
              >
                All Tracks ({activeDayAgenda.sessions.length})
              </button>
              {activeDayAgenda.tracks.map((trk, i) => (
                <button
                  key={i}
                  type="button"
                  className={`track-pill-btn ${selectedTrackFilter === trk ? "active" : ""}`}
                  onClick={() => setSelectedTrackFilter(trk)}
                >
                  {trk}
                </button>
              ))}
            </div>
          )}

          {/* Timeline Session Cards */}
          <div className="agenda-timeline-feed">
            {filteredSessions.map((session, idx) => (
              <div key={idx} className={`agenda-timeline-card ${session.type?.toLowerCase().includes("keynote") ? "keynote-highlight" : ""}`}>
                {/* Time & Room Column */}
                <div className="session-time-col">
                  <div className="session-time-badge">
                    <Clock size={14} />
                    <span>{session.time}</span>
                  </div>
                  <div className="session-room-badge">
                    <MapPin size={13} />
                    <span>{session.room}</span>
                  </div>
                  <div className="session-track-badge">
                    {session.track}
                  </div>
                </div>

                {/* Session Details Column */}
                <div className="session-details-col">
                  <div className="session-type-pill">{session.type}</div>
                  <h3 className="session-card-title">{session.title}</h3>
                  <p className="session-card-desc">{session.description}</p>

                  {/* Speaker Preview */}
                  {session.speaker && (
                    <div className="session-speaker-row">
                      {session.speaker.image ? (
                        <img 
                          src={session.speaker.image} 
                          alt={session.speaker.name} 
                          className="speaker-thumb-circle"
                        />
                      ) : (
                        <div className="speaker-thumb-placeholder">
                          <Mic size={14} />
                        </div>
                      )}
                      <div>
                        <div className="speaker-name-text">{session.speaker.name}</div>
                        <div className="speaker-meta-text">
                          {session.speaker.role} • <span className="text-purple">{session.speaker.company}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. DISTINGUISHED SPEAKERS ── */}
      <section className="section-padding summit-speakers-section" id="speakers-section">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 48px auto" }}>
            <span className="section-label">
              <Mic size={13} />
              FEATURED ORATORS
            </span>
            <h2 className="section-heading">
              Distinguished Keynote Speakers
            </h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              Learn directly from engineering directors, startup founders, and researchers defining next-generation computing.
            </p>
          </div>

          <div className="summit-speakers-grid">
            {currentSummit.speakers?.map((sp) => (
              <div key={sp.id} className="summit-speaker-card">
                <div className="speaker-photo-wrap">
                  <img 
                    src={sp.image} 
                    alt={sp.name} 
                    className="speaker-photo-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = sp.gender === "female"
                        ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80"
                        : "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80";
                    }}
                  />
                  <div className="speaker-company-badge">{sp.company}</div>
                </div>

                <div className="speaker-card-content">
                  <h3 className="speaker-name">{sp.name}</h3>
                  <div className="speaker-role">{sp.role}</div>

                  <div className="speaker-talk-topic">
                    <span className="topic-label">SPEAKING ON:</span>
                    <div className="topic-text">"{sp.topic}"</div>
                  </div>

                  <p className="speaker-bio-snippet">{sp.bio}</p>

                  <div className="speaker-social-row">
                    {sp.linkedin && sp.linkedin !== "#" && (
                      <a 
                        href={sp.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="speaker-social-link"
                        title="View LinkedIn Profile"
                      >
                        <ExternalLink size={14} />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cfp-callout-banner">
            <div>
              <h3 className="cfp-title">Have an impactful architectural case study or research breakthrough?</h3>
              <p className="cfp-desc">We welcome proposals for lightning talks, deep-dive demos, and architecture teardowns from practitioners.</p>
            </div>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => showToast("Speaker Call for Papers (CFP) form open! We look forward to your submission.")}
            >
              Submit Speaker Proposal (CFP)
            </button>
          </div>
        </div>
      </section>

      {/* ── 7. SPONSORS & PARTNERS SECTION ── */}
      <section className="section-padding summit-sponsors-section" id="sponsors-section">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 40px auto" }}>
            <span className="section-label">
              <Building2 size={13} />
              COLLABORATING ORGANIZATIONS
            </span>
            <h2 className="section-heading">
              Sponsors &amp; Ecosystem Partners
            </h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              Proudly presented alongside industry leaders driving digital transformation, cloud computing, and advanced AI.
            </p>
          </div>

          {/* Title Sponsor */}
          {currentSummit.sponsors?.title && (
            <div className="title-sponsor-card">
              <span className="sponsor-tier-badge">HOST &amp; TITLE PARTNER</span>
              <div className="title-sponsor-inner">
                <div className="title-sponsor-brand">
                  <div className="brand-logo-text">{currentSummit.sponsors.title.logo || "NEXZIBYTE"}</div>
                  <div className="brand-full-name">{currentSummit.sponsors.title.name}</div>
                </div>
                <p className="title-sponsor-desc">
                  {currentSummit.sponsors.title.desc}
                </p>
              </div>
            </div>
          )}

          {/* Platinum Sponsors */}
          {currentSummit.sponsors?.platinum && currentSummit.sponsors.platinum.length > 0 && (
            <div className="sponsor-group-block">
              <h4 className="sponsor-group-label">PLATINUM ENTERPRISE PARTNERS</h4>
              <div className="sponsor-logos-grid platinum-grid">
                {currentSummit.sponsors.platinum.map((item, idx) => (
                  <div key={idx} className="sponsor-logo-box platinum">
                    <div className="sponsor-symbol-tag">{item.symbol}</div>
                    <div className="sponsor-name-title">{item.name}</div>
                    <div className="sponsor-category-label">{item.category}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gold Sponsors */}
          {currentSummit.sponsors?.gold && currentSummit.sponsors.gold.length > 0 && (
            <div className="sponsor-group-block">
              <h4 className="sponsor-group-label">GOLD TECHNOLOGY PARTNERS</h4>
              <div className="sponsor-logos-grid gold-grid">
                {currentSummit.sponsors.gold.map((item, idx) => (
                  <div key={idx} className="sponsor-logo-box gold">
                    <div className="sponsor-symbol-tag">{item.symbol}</div>
                    <div className="sponsor-name-title">{item.name}</div>
                    <div className="sponsor-category-label">{item.category}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ecosystem & Community Partners */}
          {currentSummit.sponsors?.ecosystem && currentSummit.sponsors.ecosystem.length > 0 && (
            <div className="sponsor-group-block">
              <h4 className="sponsor-group-label">ECOSYSTEM &amp; COMMUNITY PARTNERS</h4>
              <div className="ecosystem-tags-row">
                {currentSummit.sponsors.ecosystem.map((eco, idx) => (
                  <div key={idx} className="ecosystem-partner-tag">
                    <Globe size={14} style={{ color: "var(--coral)" }} />
                    <span className="eco-name">{eco.name}</span>
                    <span className="eco-type">({eco.type})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Partnership CTA */}
          <div className="sponsor-partnership-cta">
            <span>Want to showcase your platform or recruit top engineering talent?</span>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => showToast("Sponsorship prospectus will be sent to your email.")}
            >
              Request Sponsor Prospectus
            </button>
          </div>
        </div>
      </section>

      {/* ── 8. REGISTRATION CTA & PASSES SECTION ── */}
      <section className="section-padding summit-tickets-section" id="passes-section">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 48px auto" }}>
            <span className="section-label coral">
              <Ticket size={13} />
              JOIN THE CONVERSATION
            </span>
            <h2 className="section-heading">
              Secure Your Summit Pass
            </h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              Choose your accreditation tier. Instant verified digital pass generation with unique contactless QR verification.
            </p>
          </div>

          <div className="summit-tickets-grid">
            {currentSummit.tickets?.map((ticket) => (
              <div 
                key={ticket.id} 
                className={`summit-ticket-card ${ticket.recommended ? "recommended-tier" : ""}`}
              >
                {ticket.recommended && (
                  <div className="recommended-ribbon">
                    <Sparkles size={13} />
                    RECOMMENDED DELEGATE TIER
                  </div>
                )}

                <div className="ticket-header">
                  <span className="ticket-badge-tag">{ticket.badge}</span>
                  <h3 className="ticket-name">{ticket.name}</h3>
                  <div className="ticket-price-row">
                    <span className="ticket-price">{ticket.price}</span>
                    {ticket.validity && <span className="ticket-validity">{ticket.validity}</span>}
                  </div>
                </div>

                <div className="ticket-features-list">
                  {ticket.features.map((feat, i) => (
                    <div key={i} className="ticket-feat-item">
                      <Check size={16} className="feat-check" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className={`btn btn-lg w-100 ${ticket.recommended ? "btn-coral" : "btn-primary"}`}
                  onClick={() => openPassModal(ticket.passTypeId || "visitor-pass")}
                >
                  <Ticket size={16} />
                  <span>{ticket.btnText}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Guarantee Strip */}
          <div className="registration-guarantee-strip">
            <div className="guarantee-item">
              <Shield size={16} style={{ color: "#16A34A" }} />
              <span>Instant Digital Pass with Contactless QR Check-in</span>
            </div>
            <div className="guarantee-item">
              <Award size={16} style={{ color: "var(--coral)" }} />
              <span>Official Certificate of Participation for Delegates</span>
            </div>
            <div className="guarantee-item">
              <CheckCircle2 size={16} style={{ color: "var(--primary-purple)" }} />
              <span>100% Guaranteed Spot Verification</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. VENUE INFORMATION & DIRECTIONS ── */}
      <section className="section-padding summit-venue-section" id="venue-section">
        <div className="container">
          <div className="summit-venue-grid">
            {/* Left: Venue Specs & Transit */}
            <div className="venue-info-card">
              <span className="section-label">
                <MapPin size={13} />
                VENUE &amp; TRANSIT GUIDE
              </span>
              <h2 className="section-heading" style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)" }}>
                {currentSummit.venue?.name}
              </h2>
              <div className="venue-subname">{currentSummit.venue?.subname}</div>

              <div className="venue-address-box">
                <Navigation size={18} className="venue-address-icon" />
                <address className="venue-full-address">
                  {currentSummit.venue?.address}
                </address>
              </div>

              {/* Venue Perks */}
              <div className="venue-perks-list">
                <h4 className="venue-perks-heading">Venue Features &amp; Amenities:</h4>
                {currentSummit.venue?.features?.map((feat, i) => (
                  <div key={i} className="venue-perk-item">
                    <CheckCircle2 size={16} className="perk-check" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Transit Options */}
              <div className="venue-transit-block">
                <h4 className="transit-heading">How to Reach the Venue:</h4>
                <div className="transit-items-list">
                  <div className="transit-row">
                    <strong className="transit-mode">🚇 METRO:</strong>
                    <span>{currentSummit.venue?.transit?.metro}</span>
                  </div>
                  <div className="transit-row">
                    <strong className="transit-mode">✈️ AIRPORT:</strong>
                    <span>{currentSummit.venue?.transit?.airport}</span>
                  </div>
                  <div className="transit-row">
                    <strong className="transit-mode">🚆 RAILWAY:</strong>
                    <span>{currentSummit.venue?.transit?.railway}</span>
                  </div>
                  <div className="transit-row">
                    <strong className="transit-mode">🚕 CAB / RIDE:</strong>
                    <span>{currentSummit.venue?.transit?.cab}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Simulated Map & Interactive Card */}
            <div className="venue-map-showcase">
              <div className="interactive-map-frame">
                <div className="map-artistic-header">
                  <div className="map-pin-pulse">
                    <MapPin size={24} style={{ color: "#FFFFFF" }} />
                  </div>
                  <div>
                    <h4 style={{ color: "#FFFFFF", margin: 0, fontWeight: 700 }}>{currentSummit.venue?.name}</h4>
                    <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.75)" }}>{currentSummit.location}</span>
                  </div>
                </div>

                {/* Styled Map Canvas Visual */}
                <div className="map-canvas-mockup">
                  <div className="mock-grid-lines" />
                  <div className="mock-hitec-roads">
                    <div className="road main-artery">HITEC City Main Rd</div>
                    <div className="road hitech-flyover">Outer Ring Rd Expressway</div>
                  </div>
                  <div className="mock-marker-target">
                    <div className="marker-pin-dot" />
                    <div className="marker-tooltip">
                      <strong>{currentSummit.venue?.name}</strong>
                      <span>Main Plenary Hall</span>
                    </div>
                  </div>
                </div>

                <div className="map-footer-actions">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${currentSummit.venue?.name}, ${currentSummit.venue?.address}`)}`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary w-100"
                  >
                    <Navigation size={16} />
                    <span>Open in Google Maps / Get Directions</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. RELATED EVENTS & SUMMITS ── */}
      <section className="section-padding summit-related-section">
        <div className="container">
          <div className="related-header">
            <div>
              <span className="section-label">
                <Calendar size={13} />
                MORE FLAGSHIP GATHERINGS
              </span>
              <h2 className="section-heading">Related Summits &amp; Conferences</h2>
            </div>
            <Link to="/events" className="btn btn-secondary btn-sm">
              <span>View All Events</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="related-summits-grid">
            {SUMMIT_LIST.filter(s => s.id !== currentSummit.id).slice(0, 3).map((rel) => (
              <div 
                key={rel.id} 
                className="related-summit-card"
                onClick={() => navigate(`/summits/${rel.id}`)}
                role="button"
                tabIndex={0}
              >
                <div className="related-img-wrap">
                  <img 
                    src={rel.bannerImage} 
                    alt={rel.title} 
                    className="related-summit-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/summit-gpacts.jpg";
                    }}
                  />
                  <div className="related-badge-tag">{rel.badge}</div>
                </div>

                <div className="related-card-content">
                  <div className="related-meta-date">
                    <Calendar size={14} style={{ color: "var(--coral)" }} />
                    <span>{rel.date}</span>
                  </div>

                  <h3 className="related-card-title">{rel.title}</h3>
                  <p className="related-card-desc">{rel.subtitle}</p>

                  <div className="related-card-footer">
                    <div className="related-location">
                      <MapPin size={13} />
                      <span>{rel.location}</span>
                    </div>
                    <div className="related-view-link">
                      <span>Explore Summit</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
