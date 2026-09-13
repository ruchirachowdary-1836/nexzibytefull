import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Sparkles, Calendar, Clock, MapPin, Share2, Bookmark, CheckCircle2,
  ArrowRight, ArrowLeft, Mic, Building2, Ticket,
  Shield, Lock, Coffee, Check, Navigation, AlertCircle, Award,
  MessageSquare
} from "lucide-react";
import { FOUNDER_MEETS_LIST, DEFAULT_FOUNDER_MEET } from "../data/founderMeetsData.js";
import { useApp } from "../context/AppContext.jsx";

export default function FounderMeetDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openPassModal, showToast } = useApp();

  const [savedMeet, setSavedMeet] = useState(false);

  // Selected meet
  const currentMeet = useMemo(() => {
    if (!id) return DEFAULT_FOUNDER_MEET;
    const found = FOUNDER_MEETS_LIST.find((m) => m.id === id);
    if (found) return found;
    if (id === "hyderabad-techtalk-founder-summit" || id === "nexzibyte-ktr-product-launch-meet" || id === "hyderabad-techtalk") {
      return FOUNDER_MEETS_LIST[0];
    }
    return DEFAULT_FOUNDER_MEET;
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentMeet.id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(`🔗 Link to "${currentMeet.name}" copied to clipboard!`);
    } else {
      showToast("Link ready to share!");
    }
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(currentMeet.name);
    const details = encodeURIComponent(currentMeet.about);
    const location = encodeURIComponent(`${currentMeet.venue?.name}, ${currentMeet.location}`);
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleCalendarUrl, "_blank", "noopener,noreferrer");
    showToast("Opening Google Calendar...");
  };

  return (
    <div className="founder-meet-details-luxury">
      {/* ── 1. SUBBAR & BREADCRUMBS ── */}
      <div className="founder-subbar">
        <div className="container">
          <div className="founder-subbar-inner">
            <Link to="/founder-meets" className="founder-back-btn">
              <ArrowLeft size={16} />
              <span>Back to All Founder Meets</span>
            </Link>

            <div className="founder-subbar-actions">
              <button
                type="button"
                className={`subbar-action-btn ${savedMeet ? "active" : ""}`}
                onClick={() => {
                  setSavedMeet(!savedMeet);
                  showToast(savedMeet ? "Removed from saved meets" : "⭐ Meet saved to bookmarks");
                }}
              >
                <Bookmark size={15} />
                <span>{savedMeet ? "Saved" : "Save Meet"}</span>
              </button>

              <button
                type="button"
                className="subbar-action-btn"
                onClick={handleShare}
              >
                <Share2 size={15} />
                <span>Share</span>
              </button>

              <button
                type="button"
                className="subbar-action-btn"
                onClick={handleAddToCalendar}
              >
                <Calendar size={15} />
                <span>Add to Calendar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. EXECUTIVE HERO BANNER ── */}
      <section className="meet-hero-banner">
        <div className="meet-hero-bg-overlay" />
        <img
          src={currentMeet.bannerImage}
          alt={currentMeet.name}
          className="meet-hero-backdrop-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1600&auto=format&fit=crop&q=80";
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 3 }}>
          <div className="meet-hero-split-grid">
            <div className="meet-hero-content">
              {/* Badges */}
              <div className="meet-badges-row">
                <span className="meet-hero-badge">
                  <Lock size={12} className="lock-icon" />
                  {currentMeet.badge}
                </span>
                <span className="meet-edition-badge">
                  {currentMeet.edition || "Executive Edition"}
                </span>
                {currentMeet.status === "upcoming" ? (
                  <span className="meet-status-badge upcoming">
                    ⚡ {currentMeet.spotsRemaining} of {currentMeet.spotsTotal} Spots Remaining
                  </span>
                ) : (
                  <span className="meet-status-badge past">
                    🏁 Event Concluded • Recap Available
                  </span>
                )}
              </div>

              {/* Title & Tagline */}
              <h1 className="meet-hero-title">
                {currentMeet.name}
              </h1>

              <p className="meet-hero-tagline">
                {currentMeet.tagline}
              </p>

              {/* Event Key Info Grid */}
              <div className="meet-key-info-bar">
                <div className="meet-info-cell">
                  <Calendar size={18} className="info-icon coral" />
                  <div>
                    <span className="cell-label">DATE</span>
                    <strong className="cell-val">{currentMeet.date}</strong>
                  </div>
                </div>

                <div className="meet-info-cell">
                  <Clock size={18} className="info-icon purple" />
                  <div>
                    <span className="cell-label">TIME</span>
                    <strong className="cell-val">{currentMeet.time}</strong>
                  </div>
                </div>

                <div className="meet-info-cell">
                  <MapPin size={18} className="info-icon blue" />
                  <div>
                    <span className="cell-label">PRIVATE LOCATION</span>
                    <strong className="cell-val">{currentMeet.venue?.name || currentMeet.location}</strong>
                  </div>
                </div>

                <div className="meet-info-cell">
                  <Shield size={18} className="info-icon green" />
                  <div>
                    <span className="cell-label">CONFIDENTIALITY</span>
                    <strong className="cell-val">Chatham House Rule</strong>
                  </div>
                </div>
              </div>

              {/* Hero CTA */}
              <div className="meet-hero-cta-row">
                {currentMeet.status === "upcoming" ? (
                  <button
                    type="button"
                    className="btn btn-amber btn-lg meet-register-cta"
                    onClick={() => openPassModal(currentMeet.registration?.passTypeId || "founder-pass")}
                  >
                    <Ticket size={18} />
                    <span>{currentMeet.registration?.ctaText || "Get Founder VIP Pass — ₹499"}</span>
                    <ArrowRight size={18} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={() => {
                      const el = document.getElementById("about-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <span>Read Event Recap</span>
                    <ArrowRight size={18} />
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-secondary btn-lg"
                  onClick={() => {
                    const el = document.getElementById("agenda-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <Clock size={16} />
                  <span>View Networking Agenda</span>
                </button>
              </div>
            </div>

            {/* Right Column: Hero Featured Media Card */}
            <div className="meet-hero-media-col">
              <div className="meet-hero-featured-media-card">
                <div className="media-card-badge">
                  <Sparkles size={14} style={{ color: "#C4B5FD" }} />
                  <span>OFFICIAL LAUNCH PHOTOGRAPH</span>
                </div>
                <div className="media-card-img-wrap">
                  <img
                    src={currentMeet.image || "/images/ktr-nexzibyte-launch.jpg"}
                    alt="Sri KTR launching NexziByte AI Platform with Founder & MD Nagunoori Durga Prasad"
                    className="media-card-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/ktr-nexzibyte-launch.png";
                    }}
                  />
                  <div className="media-card-gradient-overlay" />
                </div>
                <div className="media-card-caption">
                  <div className="media-caption-title">
                    <Award size={15} style={{ color: "#6C2BD9", flexShrink: 0 }} />
                    <strong>Official Product Launch by Sri KTR</strong>
                  </div>
                  <p className="media-caption-desc">
                    Sri K. T. Rama Rao (KTR) inaugurating <em>"The Future of Trusted &amp; Verified Talent"</em> with Founder &amp; MD Nagunoori Durga Prasad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ── 3. ABOUT THE EVENT & DISCUSSION PROMPTS ── */}
      <section className="section-padding meet-about-section" id="about-section">
        <div className="container">
          <div className="meet-about-grid">
            {/* Left: About Text */}
            <div className="meet-about-text-col">
              <span className="section-label coral">
                <Sparkles size={13} />
                SESSION BRIEFING
              </span>
              <h2 className="section-heading" style={{ color: "#FFFFFF" }}>
                About The Event
              </h2>

              <div className="meet-about-narrative">
                {currentMeet.about.split("\n\n").map((para, i) => (
                  <p key={i} className="meet-narrative-para">{para}</p>
                ))}
              </div>

              {/* Discussion Prompts */}
              {currentMeet.discussionPrompts && currentMeet.discussionPrompts.length > 0 && (
                <div className="meet-prompts-box">
                  <h3 className="prompts-heading">
                    <MessageSquare size={17} style={{ color: "var(--coral)" }} />
                    Core Discussion Prompts &amp; Problem Statements
                  </h3>
                  <div className="prompts-list">
                    {currentMeet.discussionPrompts.map((prm, idx) => (
                      <div key={idx} className="prompt-item">
                        <span className="prompt-bullet">0{idx + 1}</span>
                        <span className="prompt-text">{prm}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Networking Protocols Card */}
            <div className="meet-protocols-col">
              <div className="protocols-card">
                <div className="protocols-card-header">
                  <Shield size={20} className="shield-icon" />
                  <div>
                    <h3 className="protocols-title">Networking Protocols</h3>
                    <span className="protocols-subtitle">Chatham House Rules Enforced</span>
                  </div>
                </div>

                <div className="protocols-body">
                  <div className="protocol-meta-item">
                    <strong className="meta-k">Format:</strong>
                    <span className="meta-v">{currentMeet.networkingInformation?.format}</span>
                  </div>
                  <div className="protocol-meta-item">
                    <strong className="meta-k">Dress Code:</strong>
                    <span className="meta-v">{currentMeet.networkingInformation?.dressCode}</span>
                  </div>
                  <div className="protocol-meta-item">
                    <strong className="meta-k">Target Audience:</strong>
                    <span className="meta-v">{currentMeet.networkingInformation?.targetAudience}</span>
                  </div>
                  <div className="protocol-meta-item">
                    <strong className="meta-k">Hospitality:</strong>
                    <span className="meta-v">{currentMeet.networkingInformation?.included}</span>
                  </div>

                  <div className="rules-divider" />

                  <h4 className="rules-heading">Ground Rules for Attendees:</h4>
                  <div className="rules-checklist">
                    {currentMeet.networkingInformation?.rules?.map((rule, idx) => (
                      <div key={idx} className="rule-entry">
                        <CheckCircle2 size={16} className="rule-check" />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3.5 HISTORIC LAUNCH MOMENT SHOWCASE ── */}
      <section className="section-padding launch-moment-section">
        <div className="container">
          <div className="launch-moment-grid">
            <div className="launch-moment-img-wrap">
              <img
                src="/images/ktr-nexzibyte-launch.jpg"
                alt="Sri KTR launching NexziByte AI platform with Founder & MD Nagunoori Durga Prasad"
                className="launch-moment-img"
              />
              <div className="launch-moment-caption">
                <strong>Official Launch Photograph:</strong>
                <span> Sri K. T. Rama Rao (KTR) launching NexziByte's AI platform <em>"The Future of Trusted &amp; Verified Talent"</em> with Founder &amp; MD Nagunoori Durga Prasad and team.</span>
              </div>
            </div>

            <div className="launch-moment-text-wrap">
              <span className="section-label coral">
                <Sparkles size={13} />
                OFFICIAL MILESTONE LAUNCH
              </span>
              <h2 className="launch-moment-title">
                "A Major Milestone Toward Innovation, Technology &amp; Digital Transformation"
              </h2>

              <div className="launch-official-quote-box">
                <span className="launch-quote-icon">“</span>
                <p className="launch-quote-body">
                  We are proud and excited to announce the official launch of our product by K. T. Rama Rao garu. This launch is a major milestone in our journey toward innovation, technology, and digital transformation. Our platform is designed to empower businesses, streamline hiring, and connect talented professionals with the right opportunities through AI-driven solutions.
                </p>
                <div className="launch-quote-author" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <img
                    src="/images/founder-md-durga-prasad.png"
                    alt="Nagunoori Durga Prasad - Founder & Managing Director, NexziByte Solutions"
                    style={{ width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover", objectPosition: "center 15%", border: "2px solid #D97706", boxShadow: "0 4px 14px rgba(217, 119, 6, 0.4)", flexShrink: 0 }}
                  />
                  <div>
                    <strong>Nagunoori Durga Prasad</strong>
                    <span>Founder &amp; Managing Director, NexziByte Solutions</span>
                  </div>
                </div>
              </div>

              <div className="launch-key-takeaways">
                <div className="takeaway-pill">
                  <CheckCircle2 size={16} style={{ color: "#10B981", flexShrink: 0 }} />
                  <span>Product: <strong>The Future of Trusted &amp; Verified Talent</strong></span>
                </div>
                <div className="takeaway-pill">
                  <CheckCircle2 size={16} style={{ color: "#10B981", flexShrink: 0 }} />
                  <span>Chief Dignitary: <strong>Sri K. T. Rama Rao (KTR)</strong></span>
                </div>
                <div className="takeaway-pill">
                  <CheckCircle2 size={16} style={{ color: "#10B981", flexShrink: 0 }} />
                  <span>Core Leaders Present: <strong>Nagunoori Durga Prasad, Narasaiah Nagunoori &amp; Partner Founders</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ── 5. TIMETABLE & NETWORKING AGENDA ── */}
      <section className="section-padding meet-agenda-section" id="agenda-section">
        <div className="container">
          <div className="agenda-intro-center">
            <span className="section-label coral">
              <Clock size={13} />
              STRUCTURED NETWORKING
            </span>
            <h2 className="section-heading" style={{ color: "#FFFFFF" }}>
              Session Timetable &amp; Agenda
            </h2>
            <p className="section-subtitle" style={{ color: "rgba(255,255,255,0.7)", margin: "0 auto" }}>
              Every minute is intentionally orchestrated to maximize meaningful connections and actionable takeaways.
            </p>
          </div>

          <div className="meet-agenda-timeline">
            {currentMeet.agenda?.map((item, idx) => (
              <div key={idx} className="meet-timeline-row">
                <div className="timeline-time-badge">
                  <Clock size={14} style={{ color: "var(--coral)" }} />
                  <span>{item.time}</span>
                </div>

                <div className="timeline-content-card">
                  <div className="timeline-header-line">
                    <span className="timeline-type-pill">{item.type}</span>
                    <span className="timeline-host-name">Lead: {item.host}</span>
                  </div>
                  <h3 className="timeline-session-title">{item.title}</h3>
                  <p className="timeline-session-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. VENUE & ACCESS INFORMATION ── */}
      <section className="section-padding meet-venue-section">
        <div className="container">
          <div className="meet-venue-card-wrap">
            <div className="venue-details-col">
              <span className="section-label">
                <MapPin size={13} />
                PRIVATE VENUE DETAILS
              </span>
              <h2 className="venue-title-h2">{currentMeet.venue?.name}</h2>

              <div className="venue-room-chip">
                <Building2 size={16} style={{ color: "var(--coral)" }} />
                <span>{currentMeet.venue?.room}</span>
              </div>

              <address className="venue-street-address">
                {currentMeet.venue?.address}
              </address>

              <div className="venue-directions-block">
                <div className="direction-item">
                  <strong>Directions:</strong>
                  <span>{currentMeet.venue?.directions}</span>
                </div>
                <div className="direction-item">
                  <strong>Parking:</strong>
                  <span>{currentMeet.venue?.parking}</span>
                </div>
              </div>

              <div className="concierge-notice">
                <AlertCircle size={17} style={{ color: "var(--coral)", flexShrink: 0 }} />
                <span>
                  Please present your verified Digital Delegate Pass QR code at the private reception desk upon arrival.
                </span>
              </div>
            </div>

            {/* Registration CTA Card */}
            <div className="meet-ticket-box">
              <div className="ticket-box-header">
                <span className="ticket-box-badge">{currentMeet.registration?.badge || "FOUNDER PASS"}</span>
                <div className="ticket-price-display">
                  <span className="price-amount">{currentMeet.registration?.price || "₹250"}</span>
                  <span className="price-term">All-Inclusive Delegate Access</span>
                </div>
              </div>

              <div className="ticket-perks-checklist">
                <div className="perk-row">
                  <Check size={16} className="perk-chk" />
                  <span>Entry to private closed-door roundtable</span>
                </div>
                <div className="perk-row">
                  <Check size={16} className="perk-chk" />
                  <span>1-on-1 scheduled investor matchmaking session</span>
                </div>
                <div className="perk-row">
                  <Check size={16} className="perk-chk" />
                  <span>Private dining reception and cocktails</span>
                </div>
                <div className="perk-row">
                  <Check size={16} className="perk-chk" />
                  <span>Verified digital QR pass with instant check-in</span>
                </div>
              </div>

              {currentMeet.status === "upcoming" ? (
                <button
                  type="button"
                  className="btn btn-amber btn-lg w-100"
                  onClick={() => openPassModal(currentMeet.registration?.passTypeId || "founder-pass")}
                >
                  <Ticket size={16} />
                  <span>{currentMeet.registration?.ctaText || "Get Founder VIP Pass — ₹499"}</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary btn-lg w-100"
                  onClick={() => navigate("/founder-meets")}
                >
                  <span>Explore Upcoming Meets</span>
                </button>
              )}

              <p className="ticket-guarantee-note">
                Vetted access • Digital Pass delivered instantly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. OTHER FOUNDER MEETS (Only if other meets exist) ── */}
      {FOUNDER_MEETS_LIST.filter(m => m.id !== currentMeet.id).length > 0 && (
        <section className="section-padding meet-related-section">
          <div className="container">
            <div className="related-meets-header">
              <div>
                <span className="section-label coral">
                  <Calendar size={13} />
                  MORE FOUNDER CIRCLES
                </span>
                <h2 className="section-heading" style={{ color: "#FFFFFF" }}>
                  Other Founder Meets
                </h2>
              </div>
              <Link to="/founder-meets" className="btn btn-secondary btn-sm">
                <span>View All Meets</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="related-meets-grid">
              {FOUNDER_MEETS_LIST.filter(m => m.id !== currentMeet.id).slice(0, 2).map((rel) => (
                <div
                  key={rel.id}
                  className="related-meet-card"
                  onClick={() => navigate(`/founder-meets/${rel.id}`)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="rel-meet-img-wrap">
                    <img src={rel.image} alt={rel.name} className="rel-meet-img" />
                    <span className="rel-meet-badge">{rel.badge}</span>
                  </div>
                  <div className="rel-meet-body">
                    <div className="rel-meta-row">
                      <Calendar size={13} style={{ color: "var(--coral)" }} />
                      <span>{rel.date}</span>
                      <span>•</span>
                      <MapPin size={13} style={{ color: "var(--electric-blue)" }} />
                      <span>{rel.location}</span>
                    </div>
                    <h3 className="rel-meet-title">{rel.name}</h3>
                    <p className="rel-meet-desc">{rel.shortDescription}</p>
                    <div className="rel-view-link">
                      <span>View Meet Details</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
