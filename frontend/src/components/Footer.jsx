import React from "react";
import { Link } from "react-router-dom";
import { TechLogoSymbol } from "./Navbar.jsx";
import { useApp } from "../context/AppContext.jsx";

function LinkedInIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z"/>
    </svg>
  );
}

function InstagramIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

function YouTubeIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function XIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

export default function Footer() {
  const { openPassModal, showToast } = useApp();

  const handleSocialClick = (platform) => {
    showToast(`Redirecting to NexziByte TechTalk on ${platform}...`);
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top-grid">
          {/* Logo & Tagline Column */}
          <div className="footer-brand-col">
            <Link to="/" className="brand-logo-link" style={{ display: "inline-block", textDecoration: "none" }}>
              <div className="footer-nexzibyte-card" title="NexziByte Solutions">
                <img 
                  src="/images/nexzibyte-logo-clean.png" 
                  alt="NexziByte" 
                  className="footer-nexzibyte-img"
                />
              </div>
            </Link>

            <div className="footer-tagline">
              Where Technology Meets Ideas, People &amp; Possibilities.
            </div>

            <p className="footer-about-text">
              TechTalk is an executive innovation &amp; technology community powered by <strong>NexziByte Solutions</strong> — connecting founders, engineers, and digital innovators across India and globally.
            </p>
          </div>

          {/* Column 1: Explore */}
          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links-list">
              <li><Link to="/events" className="footer-link" style={{ color: "var(--electric-blue)", fontWeight: 600 }}>Events</Link></li>
              <li><Link to="/summits" className="footer-link">Tech Talks</Link></li>
              <li><Link to="/courses" className="footer-link">Courses</Link></li>
              <li><Link to="/courses" className="footer-link">Internships</Link></li>
              <li><a href="/#community-intro" className="footer-link">About</a></li>
              <li><a href="/#contact-us" className="footer-link">Contact</a></li>
            </ul>
          </div>

          {/* Column 2: Learn */}
          <div>
            <h4 className="footer-col-title">Courses &amp; Tracks</h4>
            <ul className="footer-links-list">
              <li><Link to="/courses" className="footer-link">All 17 Technology Tracks</Link></li>
              <li><Link to="/explore?category=python-ai" className="footer-link">Python &amp; AI/ML</Link></li>
              <li><Link to="/explore?category=creative-media" className="footer-link">Creative Media (Internships)</Link></li>
              <li><Link to="/explore?category=fullstack" className="footer-link">Full-Stack Web</Link></li>
              <li><Link to="/explore?category=cloud" className="footer-link">Cloud Computing</Link></li>
            </ul>
          </div>

          {/* Column 3: Events */}
          <div>
            <h4 className="footer-col-title">Events Discovery</h4>
            <ul className="footer-links-list">
              <li><Link to="/events" className="footer-link">Upcoming Events</Link></li>
              <li><Link to="/events" className="footer-link">Tech Innovation Summit</Link></li>
              <li><Link to="/founder-meets" className="footer-link">Founder Meets</Link></li>
              <li><Link to="/speakers" className="footer-link">Distinguished Speakers</Link></li>
            </ul>
          </div>

          {/* Column 4: Passes */}
          <div>
            <h4 className="footer-col-title">Passes</h4>
            <ul className="footer-links-list">
              <li>
                <button 
                  type="button" 
                  className="footer-link" 
                  style={{ textAlign: "left", background: "none", border: "none", padding: 0 }}
                  onClick={() => openPassModal("visitor-pass")}
                >
                  Visitor Pass (Free)
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  className="footer-link" 
                  style={{ textAlign: "left", background: "none", border: "none", padding: 0 }}
                  onClick={() => openPassModal("student-pass")}
                >
                  Student Pass (₹99)
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  className="footer-link" 
                  style={{ textAlign: "left", background: "none", border: "none", padding: 0 }}
                  onClick={() => openPassModal("founder-pass")}
                >
                  Founder Pass (₹499)
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  className="footer-link" 
                  style={{ textAlign: "left", background: "none", border: "none", padding: 0 }}
                  onClick={() => openPassModal("delegation-pass")}
                >
                  Delegation Pass (₹250)
                </button>
              </li>
              <li><a href="/#scanner" className="footer-link">QR Check-in</a></li>
              <li><a href="/#digital-pass" className="footer-link">My Digital Pass</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Social Links */}
        <div className="footer-bottom-bar">
          <div>
            © 2026 NexziByte TechTalk — Where Technology Meets Ideas, People &amp; Possibilities.
          </div>

          <div style={{ display: "flex", gap: "20px", fontSize: "0.8125rem" }}>
            <a href="#" style={{ color: "var(--text-secondary)" }}>Privacy Policy</a>
            <a href="#" style={{ color: "var(--text-secondary)" }}>Terms of Service</a>
            <a href="/#contact-us" style={{ color: "var(--text-secondary)" }}>Contact Us</a>
          </div>

          <div className="footer-social-row">
            <button 
              type="button" 
              className="footer-social-icon-btn" 
              onClick={() => handleSocialClick("LinkedIn")}
              aria-label="LinkedIn"
            >
              <LinkedInIcon size={17} />
            </button>
            <button 
              type="button" 
              className="footer-social-icon-btn" 
              onClick={() => handleSocialClick("Instagram")}
              aria-label="Instagram"
            >
              <InstagramIcon size={17} />
            </button>
            <button 
              type="button" 
              className="footer-social-icon-btn" 
              onClick={() => handleSocialClick("YouTube")}
              aria-label="YouTube"
            >
              <YouTubeIcon size={17} />
            </button>
            <button 
              type="button" 
              className="footer-social-icon-btn" 
              onClick={() => handleSocialClick("X (Twitter)")}
              aria-label="X"
            >
              <XIcon size={17} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
