import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Sparkles, Rocket, Users, Shield, TrendingUp, Building2, Calendar, 
  MapPin, Clock, ArrowRight, CheckCircle2, ChevronRight, 
  Ticket, Coffee, Award, Lock, Star, MessageSquare
} from "lucide-react";
import { 
  FOUNDER_NETWORKING_OPPORTUNITIES, 
  FOUNDER_MEETS_LIST 
} from "../data/founderMeetsData.js";
import { useApp } from "../context/AppContext.jsx";

const OPPORTUNITY_ICONS = {
  Shield: Shield,
  TrendingUp: TrendingUp,
  Building2: Building2,
  Users: Users
};

export default function FounderMeetsPage() {
  const navigate = useNavigate();
  const { openPassModal, showToast } = useApp();

  const [activeFilter, setActiveFilter] = useState("all"); // "all", "upcoming", "past"

  // Filtered Meets
  const filteredMeets = useMemo(() => {
    if (activeFilter === "all") return FOUNDER_MEETS_LIST;
    return FOUNDER_MEETS_LIST.filter((m) => m.status === activeFilter);
  }, [activeFilter]);

  const upcomingCount = FOUNDER_MEETS_LIST.filter(m => m.status === "upcoming").length;
  const pastCount = FOUNDER_MEETS_LIST.filter(m => m.status === "past").length;

  return (
    <div className="founder-meets-page-luxury">
      {/* ── 1. EXECUTIVE HERO BANNER ── */}
      <section className="founder-page-hero">
        <div className="founder-hero-glow-blob top-left" />
        <div className="founder-hero-glow-blob bottom-right" />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="founder-hero-header-wrap">
            <div className="founder-hero-badge-pill">
              <Sparkles size={14} style={{ color: "var(--coral)" }} />
              <span>NEXZIBYTE VENTURE &amp; FOUNDER NETWORK</span>
            </div>

            <h1 className="founder-page-title">
              Where Technology Founders <br />
              <span className="founder-gradient-text">Meet Builders &amp; Capital</span>
            </h1>

            <p className="founder-page-subtitle">
              NexziByte's curated founder networking ecosystem connects venture-backed entrepreneurs, bootstrapped builders, and senior technology architects for confidential, high-signal collaboration.
            </p>

            <div className="founder-creed-box">
              <span className="creed-quote-mark">“</span>
              <p className="creed-text">
                No pitch decks. No vanity metrics. Just authentic founder-to-founder problem solving, customer discovery, and tactical growth playbooks.
              </p>
            </div>

            {/* Ecosystem Metrics Strip */}
            <div className="founder-metrics-strip">
              <div className="founder-metric-cell">
                <strong>240+</strong>
                <span>Founders Connected</span>
              </div>
              <div className="founder-metric-divider" />
              <div className="founder-metric-cell">
                <strong>$4.2M+</strong>
                <span>Capital Facilitated</span>
              </div>
              <div className="founder-metric-divider" />
              <div className="founder-metric-cell">
                <strong>18+</strong>
                <span>Co-Founders Paired</span>
              </div>
              <div className="founder-metric-divider" />
              <div className="founder-metric-cell">
                <strong>35+</strong>
                <span>Enterprise Pilots Initiated</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="founder-hero-actions" style={{ marginBottom: "48px" }}>
              <button 
                type="button" 
                className="btn btn-coral btn-lg"
                onClick={() => {
                  const el = document.getElementById("meets-directory");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Rocket size={18} />
                <span>Explore Official Founder Meet</span>
                <ArrowRight size={18} />
              </button>

              <button 
                type="button" 
                className="btn btn-secondary btn-lg"
                onClick={() => {
                  const el = document.getElementById("networking-opportunities");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Users size={18} />
                <span>Networking Opportunities</span>
              </button>
            </div>

            {/* Featured Landmark Launch Card with Sri KTR Picture */}
            <div className="founder-hero-landmark-card">
              <div className="landmark-badge">
                <Sparkles size={14} style={{ color: "#6C2BD9" }} />
                <span>OFFICIAL NEXZIBYTE AI PRODUCT LAUNCH</span>
              </div>
              <div className="landmark-media-grid">
                <div className="landmark-img-wrap">
                  <img 
                    src="/images/ktr-nexzibyte-launch.jpg" 
                    alt="Sri K. T. Rama Rao (KTR) launching NexziByte product with Founder & MD Nagunoori Durga Prasad" 
                    className="landmark-img"
                  />
                  <div className="landmark-photo-caption">
                    <strong>Official Launch:</strong> Sri KTR inaugurating <em>"The Future of Trusted &amp; Verified Talent"</em> with Nagunoori Durga Prasad
                  </div>
                </div>
                <div className="landmark-text-content">
                  <span className="landmark-kicker">HISTORIC TELANGANA TECH MILESTONE</span>
                  <h2 className="landmark-title">
                    Official Product Launch by Sri K. T. Rama Rao (KTR)
                  </h2>
                  <p className="landmark-desc">
                    Sri <strong>K. T. Rama Rao (KTR)</strong> officially inaugurated NexziByte Solutions' groundbreaking AI platform <em>"The Future of Trusted &amp; Verified Talent"</em> alongside Founder &amp; MD <strong>Nagunoori Durga Prasad</strong>, Director <strong>Narasaiah Nagunoori</strong>, and technology ecosystem partners.
                  </p>

                  <div className="landmark-quote-box">
                    <span className="landmark-quote-mark">“</span>
                    <p className="landmark-quote-text">
                      We are proud and excited to announce the official launch of our product by K. T. Rama Rao garu. This launch is a major milestone in our journey toward innovation, technology, and digital transformation. Our platform connects verified tech talent with enterprise opportunities.
                    </p>
                    <div className="landmark-quote-author">
                      <strong>Nagunoori Durga Prasad</strong>
                      <span>Founder &amp; Managing Director, NexziByte Solutions</span>
                    </div>
                  </div>

                  <div className="landmark-cta-row">
                    <Link to="/founder-meets/nexzibyte-ktr-product-launch-meet" className="btn btn-coral btn-lg">
                      <Rocket size={16} />
                      <span>View Full Meet Details &amp; Keynote</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. NETWORKING OPPORTUNITIES SECTION ── */}
      <section className="section-padding founder-opps-section" id="networking-opportunities">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 48px auto" }}>
            <span className="section-label coral">
              <Sparkles size={13} />
              ECOSYSTEM VALUE PROPOSITIONS
            </span>
            <h2 className="section-heading">
              Networking Opportunities
            </h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>
              Four structured pillars designed to remove friction from fundraising, enterprise sales, technical co-founder matching, and peer troubleshooting.
            </p>
          </div>

          <div className="founder-opps-grid">
            {FOUNDER_NETWORKING_OPPORTUNITIES.map((opp) => {
              const IconComp = OPPORTUNITY_ICONS[opp.icon] || Shield;
              return (
                <div key={opp.id} className="founder-opp-card">
                  <div className="opp-card-header">
                    <div className="opp-icon-wrapper">
                      <IconComp size={22} className="opp-icon" />
                    </div>
                    <span className="opp-badge-tag">{opp.badge}</span>
                  </div>

                  <h3 className="opp-title">{opp.title}</h3>
                  <div className="opp-subtitle">{opp.subtitle}</div>
                  <p className="opp-desc">{opp.description}</p>

                  <div className="opp-stats-chip">
                    <CheckCircle2 size={15} style={{ color: "var(--coral)", flexShrink: 0 }} />
                    <span>{opp.stats}</span>
                  </div>

                  <div className="opp-perks-list">
                    {opp.perks.map((p, idx) => (
                      <div key={idx} className="opp-perk-item">
                        <span className="perk-bullet">•</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. FOUNDER MEETS DIRECTORY (UPCOMING & PAST) ── */}
      <section className="section-padding founder-meets-directory-section" id="meets-directory">
        <div className="container">
          {/* Section Header with Tabs */}
          <div className="directory-header-row">
            <div>
              <span className="section-label coral">
                <Calendar size={13} />
                VENTURE SESSIONS
              </span>
              <h2 className="section-heading">
                Founder Meets Schedule
              </h2>
              <p className="section-subtitle">
                Browse upcoming closed-door roundtables and recaps from past investor mixers.
              </p>
            </div>

            {/* Filter Tabs / Landmark Badge */}
            {pastCount > 0 ? (
              <div className="meets-filter-tabs">
                <button
                  type="button"
                  className={`filter-tab-btn ${activeFilter === "all" ? "active" : ""}`}
                  onClick={() => setActiveFilter("all")}
                >
                  All Meets ({FOUNDER_MEETS_LIST.length})
                </button>
                <button
                  type="button"
                  className={`filter-tab-btn ${activeFilter === "upcoming" ? "active" : ""}`}
                  onClick={() => setActiveFilter("upcoming")}
                >
                  Upcoming Meets ({upcomingCount})
                </button>
                <button
                  type="button"
                  className={`filter-tab-btn ${activeFilter === "past" ? "active" : ""}`}
                  onClick={() => setActiveFilter("past")}
                >
                  Past Meets ({pastCount})
                </button>
              </div>
            ) : (
              <div className="single-meet-status-pill">
                <Sparkles size={14} style={{ color: "#6C2BD9" }} />
                <span>OFFICIAL LANDMARK FOUNDER MEET</span>
              </div>
            )}
          </div>

          {/* Cards Grid */}
          <div className={`founder-meets-cards-grid ${filteredMeets.length === 1 ? "single-meet-container" : ""}`}>
            {filteredMeets.map((meet) => (
              <div 
                key={meet.id} 
                className={`founder-meet-card ${filteredMeets.length === 1 ? "single-meet-spotlight" : ""} ${meet.status === "past" ? "past-meet-card" : ""}`}
              >
                {/* Event Image Banner */}
                <div className="meet-card-img-wrap">
                  <img 
                    src={meet.image} 
                    alt={meet.name} 
                    className="meet-card-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80";
                    }}
                  />
                  <div className="meet-card-img-overlay">
                    <span className="meet-card-badge">{meet.badge}</span>
                    <span className={`meet-status-tag ${meet.status}`}>
                      {meet.status === "upcoming" ? "🟢 Upcoming" : "🏁 Completed"}
                    </span>
                  </div>
                </div>

                {/* Event Information */}
                <div className="meet-card-body">
                  <div className="meet-card-meta-row">
                    <div className="meet-meta-chip">
                      <Calendar size={14} style={{ color: "var(--coral)" }} />
                      <span>{meet.date}</span>
                    </div>
                    <div className="meet-meta-chip">
                      <Clock size={14} style={{ color: "var(--primary-purple)" }} />
                      <span>{meet.time.split("–")[0]}</span>
                    </div>
                  </div>

                  <h3 className="meet-card-title">{meet.name}</h3>

                  {meet.guestOfHonor && (
                    <div className="meet-guest-honor-tag">
                      <Award size={13} style={{ color: "#6C2BD9", flexShrink: 0 }} />
                      <span>{meet.guestOfHonor.honorific?.includes("Dignitary") ? "Chief Dignitary" : "Guest of Honor"}: <strong>{meet.guestOfHonor.name}</strong></span>
                    </div>
                  )}

                  <div className="meet-location-chip">
                    <MapPin size={14} style={{ color: "var(--electric-blue)", flexShrink: 0 }} />
                    <span>{meet.location}</span>
                  </div>

                  <p className="meet-card-desc">{meet.shortDescription}</p>



                  {/* Spots indicator */}
                  {meet.status === "upcoming" && (
                    <div className="meet-spots-indicator">
                      <div className="spots-bar-bg">
                        <div 
                          className="spots-bar-fill" 
                          style={{ width: `${Math.max(20, ((meet.spotsTotal - meet.spotsRemaining) / meet.spotsTotal) * 100)}%` }} 
                        />
                      </div>
                      <div className="spots-text">
                        ⚡ {meet.spotsRemaining} of {meet.spotsTotal} seats left
                      </div>
                    </div>
                  )}

                  {/* Card Actions / Registration CTA */}
                  <div className="meet-card-actions">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate(`/founder-meets/${meet.id}`)}
                    >
                      <span>View Details</span>
                      <ChevronRight size={14} />
                    </button>

                    {meet.status === "upcoming" ? (
                      <button
                        type="button"
                        className="btn btn-coral btn-sm"
                        onClick={() => openPassModal("delegate-pass")}
                      >
                        <Ticket size={14} />
                        <span>Apply / Register</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/founder-meets/${meet.id}`)}
                      >
                        <span>Read Recap</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. HOST A CIRCLE / PITCH APPLICATION CTA ── */}
      <section className="section-padding founder-host-cta-section">
        <div className="container">
          <div className="founder-host-cta-card">
            <div className="host-cta-content">
              <span className="section-label coral" style={{ marginBottom: "8px" }}>
                <Rocket size={13} />
                COMMUNITY INITIATIVE
              </span>
              <h2 className="host-cta-heading">
                Building something groundbreaking in AI, SaaS, or Cloud Infrastructure?
              </h2>
              <p className="host-cta-desc">
                Apply to host a closed-door founder roundtable or pitch your startup to NexziByte's angel syndicates and enterprise client network.
              </p>
              <div className="host-cta-features">
                <div className="feature-chip">
                  <CheckCircle2 size={16} style={{ color: "#16A34A" }} />
                  <span>Vetted founder peer group</span>
                </div>
                <div className="feature-chip">
                  <CheckCircle2 size={16} style={{ color: "#16A34A" }} />
                  <span>Direct introductions to enterprise decision makers</span>
                </div>
                <div className="feature-chip">
                  <CheckCircle2 size={16} style={{ color: "#16A34A" }} />
                  <span>No upfront fees or equity requirements</span>
                </div>
              </div>
            </div>

            <div className="host-cta-actions">
              <button
                type="button"
                className="btn btn-coral btn-lg"
                onClick={() => showToast("Founder Meet host application received! Our team will reach out within 24 hours.")}
              >
                <span>Apply to Host a Founder Meet</span>
                <ArrowRight size={16} />
              </button>
              <span className="host-note">Applications reviewed weekly by NexziByte Venture Council</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
