import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Sparkles, ArrowRight, Calendar, MapPin, Clock, 
  Users, CheckCircle2, ShieldCheck, Ticket, Briefcase, Zap 
} from "lucide-react";
import { FOUNDER_MEETS_DATA } from "../data/mockData.js";
import { FOUNDER_MEETS_LIST } from "../data/founderMeetsData.js";
import { useApp } from "../context/AppContext.jsx";

export default function FounderMeets() {
  const { openPassModal } = useApp();
  const navigate = useNavigate();

  // Highlighted landmark meet and upcoming circles
  const landmarkMeet = FOUNDER_MEETS_LIST[0]; // KTR Launch Meet
  const upcomingCircles = FOUNDER_MEETS_LIST.slice(1, 3); // Hyderabad & Bengaluru

  return (
    <section className="founder-meets-compact-section" id="founder-meets">
      <div className="container-wide">
        {/* Compact Header */}
        <div className="founder-header-compact">
          <div className="founder-header-text">
            <span className="section-label coral">
              <Sparkles size={13} />
              VENTURE &amp; COLLABORATION CIRCLES
            </span>
            <h2 className="founder-compact-heading">
              Where Founders Meet Builders &amp; Capital
            </h2>
            <p className="founder-compact-subtitle">
              Exclusive closed-door roundtables, 1-on-1 investor matchmaking, and landmark venture milestones. Strictly no vanity pitches.
            </p>
          </div>

          <div className="founder-header-actions">
            <div className="founder-stats-chips">
              <span className="stat-chip"><strong>240+</strong> Founders Connected</span>
              <span className="stat-chip"><strong>$4.2M</strong> Capital Facilitated</span>
              <span className="stat-chip"><strong>18+</strong> Co-Founders Paired</span>
            </div>
            <Link to="/founder-meets" className="btn btn-secondary btn-sm">
              <span>View All Founder Circles ({FOUNDER_MEETS_LIST.length})</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* 1. FEATURED LANDMARK FOUNDER MEET (Clearly Visible, Zero Dead Space) */}
        {landmarkMeet && (
          <div className="landmark-meet-compact-card">
            <div className="landmark-meet-media">
              <img 
                src={landmarkMeet.image} 
                alt={landmarkMeet.name} 
                className="landmark-meet-img" 
                loading="lazy" 
              />
              <div className="landmark-meet-badge-overlay">
                <Sparkles size={13} />
                <span>OFFICIAL LANDMARK MILESTONE</span>
              </div>
            </div>

            <div className="landmark-meet-body">
              <div className="landmark-top-meta">
                <span className="landmark-edition-tag">
                  {landmarkMeet.badge}
                </span>
                <span className="landmark-live-tag">
                  Platform Live in Production
                </span>
              </div>

              <h3 className="landmark-meet-title">
                {landmarkMeet.name}
              </h3>

              <p className="landmark-meet-desc">
                {landmarkMeet.tagline}
              </p>

              {/* Date & Location Pill Strip */}
              <div className="landmark-info-strip">
                <div className="landmark-info-item">
                  <Calendar size={14} className="icon-gold" />
                  <span>{landmarkMeet.date}</span>
                </div>
                <div className="landmark-info-item">
                  <Clock size={14} className="icon-gold" />
                  <span>{landmarkMeet.time}</span>
                </div>
                <div className="landmark-info-item">
                  <MapPin size={14} className="icon-gold" />
                  <span>{landmarkMeet.location}</span>
                </div>
              </div>

              {/* Dignitaries Preview */}
              <div className="landmark-dignitaries-row">
                <span className="dignitaries-label">Key Leadership &amp; Dignitaries:</span>
                <div className="dignitaries-list">
                  {landmarkMeet.featuredFounders?.map((f) => (
                    <div key={f.name} className="dignitary-mini-badge" title={`${f.name} (${f.role})`}>
                      <img src={f.avatar} alt={f.name} className="dignitary-mini-avatar" />
                      <div>
                        <div className="dignitary-mini-name">{f.name}</div>
                        <div className="dignitary-mini-role">{f.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="landmark-actions-row">
                <Link 
                  to={`/founder-meets/${landmarkMeet.id}`}
                  className="btn btn-coral"
                >
                  <span>Explore Landmark Launch Details</span>
                  <ArrowRight size={16} />
                </Link>

                <button
                  type="button"
                  className="btn btn-amber"
                  onClick={() => openPassModal("founder-pass")}
                >
                  <Briefcase size={16} />
                  <span>Get Founder VIP Pass (₹499)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. UPCOMING CURATED FOUNDER CIRCLES (2-Column Compact Grid) */}
        <div className="upcoming-circles-grid">
          {upcomingCircles.map((circle) => (
            <div key={circle.id} className="circle-compact-card">
              <div className="circle-compact-header">
                <span className="circle-badge">{circle.badge}</span>
                <span className="circle-spots-tag">
                  <Users size={12} />
                  <span>{circle.spotsRemaining} Seats Left</span>
                </span>
              </div>

              <h4 className="circle-compact-title">{circle.name}</h4>
              <p className="circle-compact-desc">{circle.tagline}</p>

              <div className="circle-meta-pills">
                <div className="circle-meta-item">
                  <Calendar size={13} />
                  <span>{circle.date}</span>
                </div>
                <div className="circle-meta-item">
                  <Clock size={13} />
                  <span>{circle.time}</span>
                </div>
                <div className="circle-meta-item">
                  <MapPin size={13} />
                  <span>{circle.location}</span>
                </div>
              </div>

              <div className="circle-guest-preview">
                <img 
                  src={circle.guestOfHonor?.image} 
                  alt={circle.guestOfHonor?.name} 
                  className="circle-guest-avatar" 
                />
                <div>
                  <div className="circle-guest-name">{circle.guestOfHonor?.name}</div>
                  <div className="circle-guest-topic">"{circle.guestOfHonor?.topic}"</div>
                </div>
              </div>

              <div className="circle-card-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => navigate(`/founder-meets/${circle.id}`)}
                >
                  <span>Circle Agenda</span>
                  <ArrowRight size={14} />
                </button>

                <button
                  type="button"
                  className="btn btn-amber btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => openPassModal("founder-pass")}
                >
                  <Ticket size={14} />
                  <span>Founder Pass</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
