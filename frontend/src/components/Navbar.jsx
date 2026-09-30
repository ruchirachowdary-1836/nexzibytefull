import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  ChevronDown, ChevronUp, Menu, X, ArrowRight, Sparkles, User, ShieldCheck, 
  Calendar, Users, Rocket, Mic, BookOpen, Layers, CheckCircle2, Ticket,
  Handshake, Cpu, Globe, Bell, Plus, LogOut
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { roleHomePath } from "../lib/role-access.js";

// Official NexziByte Brand Logo + TechTalk Wordmark
export function TechTalkBrandedLogo() {
  return (
    <div className="techtalk-brand-logo-wrap" aria-label="TechTalk by NexziByte">
      <div className="nexzibyte-nav-brand-card" title="NexziByte">
        <img 
          src="/images/nexzibyte-logo-nav.png" 
          alt="NexziByte" 
          className="nexzibyte-nav-brand-img"
        />
      </div>
      <div className="techtalk-brand-divider" />
      <div className="techtalk-logo-mark">
        <span className="logo-text-tech">Tech</span>
        <span className="logo-text-talk">Talk</span>
      </div>
    </div>
  );
}

export const TechLogoSymbol = TechTalkBrandedLogo;

// Custom Right Arrow SVG icon matching the boxed arrow button in reference images
function DropdownArrowIcon() {
  return (
    <svg 
      width="20" 
      height="15" 
      viewBox="0 0 20 15" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.6" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="dropdown-editorial-svg"
    >
      <path d="M1 7.5h17M12 2l6 5.5-6 5.5" />
    </svg>
  );
}

export default function Navbar() {
  const { setLoginModalOpen, openPassModal, user, isLoggedIn, authReady, logout, unreadNotificationCount } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".nav-dropdown-wrapper")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // Universal navigation handler (smooth scroll if on home, navigate otherwise)
  const handleNavigation = (path, hashId) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);

    if (!authReady) return;
    if (!isLoggedIn) {
      navigate("/login", {
        state: {
          from: { pathname: path, hash: hashId ? `#${hashId}` : "" },
          message: "Please sign in or create an account to access this section.",
        },
      });
      return;
    }

    if (location.pathname === "/") {
      if (hashId) {
        const el = document.getElementById(hashId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", `#${hashId}`);
          return;
        }
      }
      navigate(path);
    } else {
      navigate(path);
    }
  };

  const handleProtectedPass = (passType) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    if (!authReady) return;
    if (!isLoggedIn) {
      navigate("/login", {
        state: {
          from: { pathname: "/partner" },
          message: "Please sign in or create an account to access this section.",
        },
      });
      return;
    }
    openPassModal(passType);
  };

  const toggleDropdown = (name) => {
    setActiveDropdown(prev => (prev === name ? null : name));
  };

  return (
    <header className={`site-header-dark ${isHomePage ? "header-on-image" : "header-inner-page"} ${scrolled ? "scrolled" : "transparent"}`}>
      <div className="container-wide">
        <div className="navbar-inner-dark">
          {/* LEFT: Logo */}
          <Link to="/" className="brand-logo-link">
            <TechTalkBrandedLogo />
          </Link>

          {/* CENTER: Navigation with Dropdown Cards matching reference screenshots */}
          <nav className="nav-center-menu-dark" aria-label="Main Navigation">
            {/* 1. COMMUNITY (Events & Pricing) */}
            <div 
              className="nav-dropdown-wrapper"
              onMouseEnter={() => setActiveDropdown("community")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                type="button" 
                className={`nav-dropdown-btn-pill ${activeDropdown === "community" ? "is-active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("community");
                }}
                aria-expanded={activeDropdown === "community"}
              >
                <span>COMMUNITY</span>
                {activeDropdown === "community" ? (
                  <ChevronUp size={13} strokeWidth={2.8} />
                ) : (
                  <ChevronDown size={13} strokeWidth={2.8} />
                )}
              </button>

              {activeDropdown === "community" && (
                <div className="nav-editorial-dropdown-panel" role="menu">
                  <button 
                    type="button"
                    className="nav-editorial-dropdown-item"
                    onClick={() => handleNavigation("/events", null)}
                    role="menuitem"
                  >
                    <div className="dropdown-editorial-content">
                      <div className="dropdown-editorial-title">Events</div>
                      <div className="dropdown-editorial-desc">Explore career-growth events</div>
                    </div>
                    <div className="dropdown-editorial-arrow-box" aria-hidden="true">
                      <DropdownArrowIcon />
                    </div>
                  </button>

                  <button 
                    type="button"
                    className="nav-editorial-dropdown-item"
                    onClick={() => handleNavigation("/summits", null)}
                    role="menuitem"
                  >
                    <div className="dropdown-editorial-content">
                      <div className="dropdown-editorial-title">Summits</div>
                      <div className="dropdown-editorial-desc">Flagship tech conferences &amp; stages</div>
                    </div>
                    <div className="dropdown-editorial-arrow-box" aria-hidden="true">
                      <DropdownArrowIcon />
                    </div>
                  </button>

                  <button 
                    type="button"
                    className="nav-editorial-dropdown-item"
                    onClick={() => handleNavigation("/founder-meets", null)}
                    role="menuitem"
                  >
                    <div className="dropdown-editorial-content">
                      <div className="dropdown-editorial-title">Founder Meets</div>
                      <div className="dropdown-editorial-desc">Venture networking &amp; founder circles</div>
                    </div>
                    <div className="dropdown-editorial-arrow-box" aria-hidden="true">
                      <DropdownArrowIcon />
                    </div>
                  </button>

                  <button 
                    type="button"
                    className="nav-editorial-dropdown-item"
                    onClick={() => {
                      setActiveDropdown(null);
                      handleProtectedPass("visitor-pass");
                    }}
                    role="menuitem"
                  >
                    <div className="dropdown-editorial-content">
                      <div className="dropdown-editorial-title">Pricing</div>
                      <div className="dropdown-editorial-desc">Find out pricing options</div>
                    </div>
                    <div className="dropdown-editorial-arrow-box" aria-hidden="true">
                      <DropdownArrowIcon />
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 2. SERVICES (Courses & Internship in place of CV & Individual Coaching) */}
            <div 
              className="nav-dropdown-wrapper"
              onMouseEnter={() => setActiveDropdown("services")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                type="button" 
                className={`nav-dropdown-btn-pill ${activeDropdown === "services" ? "is-active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("services");
                }}
                aria-expanded={activeDropdown === "services"}
              >
                <span>SERVICES</span>
                {activeDropdown === "services" ? (
                  <ChevronUp size={13} strokeWidth={2.8} />
                ) : (
                  <ChevronDown size={13} strokeWidth={2.8} />
                )}
              </button>

              {activeDropdown === "services" && (
                <div className="nav-editorial-dropdown-panel" role="menu">
                  <button 
                    type="button"
                    className="nav-editorial-dropdown-item"
                    onClick={() => handleNavigation("/courses", null)}
                    role="menuitem"
                  >
                    <div className="dropdown-editorial-content">
                      <div className="dropdown-editorial-title">Courses</div>
                      <div className="dropdown-editorial-desc">Industry-aligned tech courses &amp; tracks</div>
                    </div>
                    <div className="dropdown-editorial-arrow-box" aria-hidden="true">
                      <DropdownArrowIcon />
                    </div>
                  </button>

                  <button 
                    type="button"
                    className="nav-editorial-dropdown-item"
                    onClick={() => handleNavigation("/internship", null)}
                    role="menuitem"
                  >
                    <div className="dropdown-editorial-content">
                      <div className="dropdown-editorial-title">Internship</div>
                      <div className="dropdown-editorial-desc">Gain real-world experience &amp; get hired (23 Tracks)</div>
                    </div>
                    <div className="dropdown-editorial-arrow-box" aria-hidden="true">
                      <DropdownArrowIcon />
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 3. RESOURCES (Resource center & Success stories) */}
            <div 
              className="nav-dropdown-wrapper"
              onMouseEnter={() => setActiveDropdown("resources")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                type="button" 
                className={`nav-dropdown-btn-pill ${activeDropdown === "resources" ? "is-active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("resources");
                }}
                aria-expanded={activeDropdown === "resources"}
              >
                <span>RESOURCES</span>
                {activeDropdown === "resources" ? (
                  <ChevronUp size={13} strokeWidth={2.8} />
                ) : (
                  <ChevronDown size={13} strokeWidth={2.8} />
                )}
              </button>

              {activeDropdown === "resources" && (
                <div className="nav-editorial-dropdown-panel" role="menu">
                  <button 
                    type="button"
                    className="nav-editorial-dropdown-item"
                    onClick={() => handleNavigation("/explore", null)}
                    role="menuitem"
                  >
                    <div className="dropdown-editorial-content">
                      <div className="dropdown-editorial-title">Resource center</div>
                      <div className="dropdown-editorial-desc">Download our free resources</div>
                    </div>
                    <div className="dropdown-editorial-arrow-box" aria-hidden="true">
                      <DropdownArrowIcon />
                    </div>
                  </button>

                  <button 
                    type="button"
                    className="nav-editorial-dropdown-item"
                    onClick={() => handleNavigation("/#testimonials", "testimonials")}
                    role="menuitem"
                  >
                    <div className="dropdown-editorial-content">
                      <div className="dropdown-editorial-title">Success stories</div>
                      <div className="dropdown-editorial-desc">Inspiring job search journeys</div>
                    </div>
                    <div className="dropdown-editorial-arrow-box" aria-hidden="true">
                      <DropdownArrowIcon />
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 4. ABOUT (About us & Contact us) */}
            <div 
              className="nav-dropdown-wrapper"
              onMouseEnter={() => setActiveDropdown("about")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                type="button" 
                className={`nav-dropdown-btn-pill ${activeDropdown === "about" ? "is-active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown("about");
                }}
                aria-expanded={activeDropdown === "about"}
              >
                <span>ABOUT</span>
                {activeDropdown === "about" ? (
                  <ChevronUp size={13} strokeWidth={2.8} />
                ) : (
                  <ChevronDown size={13} strokeWidth={2.8} />
                )}
              </button>

              {activeDropdown === "about" && (
                <div className="nav-editorial-dropdown-panel" role="menu">
                  <button 
                    type="button"
                    className="nav-editorial-dropdown-item"
                    onClick={() => handleNavigation("/#community-intro", "community-intro")}
                    role="menuitem"
                  >
                    <div className="dropdown-editorial-content">
                      <div className="dropdown-editorial-title">About us</div>
                      <div className="dropdown-editorial-desc">The story behind TechTalk</div>
                    </div>
                    <div className="dropdown-editorial-arrow-box" aria-hidden="true">
                      <DropdownArrowIcon />
                    </div>
                  </button>

                  <button 
                    type="button"
                    className="nav-editorial-dropdown-item"
                    onClick={() => handleNavigation("/#contact-us", "contact-us")}
                    role="menuitem"
                  >
                    <div className="dropdown-editorial-content">
                      <div className="dropdown-editorial-title">Contact us</div>
                      <div className="dropdown-editorial-desc">Need help? Reach out to us</div>
                    </div>
                    <div className="dropdown-editorial-arrow-box" aria-hidden="true">
                      <DropdownArrowIcon />
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 5. PARTNER (Lime accent matching Screenshot 4) */}
            <button 
              type="button" 
              className="nav-partner-btn"
              onClick={() => {
                handleProtectedPass("speaker-pass");
              }}
            >
              <span>PARTNER</span>
            </button>
          </nav>

          {/* RIGHT: Post + Notification + Profile + (Logout OR Login) + Join Community CTA */}
          <div className="nav-right-actions-dark">
            {isLoggedIn ? (
              <>
                {/* Notifications Bell */}
                <Link 
                  to="/profile?tab=notifications" 
                  className={`nav-notif-bell-btn ${location.search.includes("tab=notifications") ? "is-active" : ""}`}
                  title="View Ecosystem Notifications"
                >
                  <Bell size={16} />
                  {unreadNotificationCount > 0 && (
                    <span className="notif-indicator-dot" />
                  )}
                </Link>

                {/* Profile Pill */}
                <Link 
                  to="/profile" 
                  className={`nav-profile-pill-link ${location.pathname === "/profile" ? "is-active" : ""}`}
                  title="View Professional Technology Profile"
                >
                  <div className="nav-profile-avatar-tiny">
                    <img 
                      src={user?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"} 
                      alt={user?.name || "Profile"} 
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>
                  <span className="nav-profile-name-tiny">
                    {user?.name ? (user.name.length > 18 ? user.name.split(" ")[0] : user.name) : "Sign in"}
                  </span>
                </Link>
                <Link to={roleHomePath(user?.role)} className="nav-login-btn-dark">
                  Dashboard
                </Link>

                {/* Quick Post Action Button — Situated properly with creator profile */}
                <Link 
                  to="/create-post" 
                  className={`nav-quick-post-btn ${location.pathname === "/create-post" ? "is-active" : ""}`}
                  title="Create Technical Dispatch"
                >
                  <Plus size={14} strokeWidth={2.4} />
                  <span>Post</span>
                </Link>

                {/* Logout Button */}
                <button 
                  type="button" 
                  className="nav-logout-btn-dark"
                  onClick={() => {
                    logout();
                    if (location.pathname === "/profile" || location.pathname === "/create-post") {
                      navigate("/");
                    }
                  }}
                  title="Sign out of your session"
                  aria-label="Logout"
                  id="nav-logout-btn"
                >
                  <LogOut size={13} strokeWidth={2.4} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="nav-login-btn-dark"
                  id="nav-login-btn"
                >
                  Login
                </Link>
                <Link
                  to="/profile"
                  className="nav-login-btn-dark"
                  id="nav-profile-btn"
                >
                  Profile
                </Link>
                <Link
                  to={roleHomePath(user?.role)}
                  className="mobile-nav-link-dark"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </>
            )}

            <button 
              type="button" 
              className="nav-join-community-btn"
              onClick={() => handleProtectedPass("visitor-pass")}
            >
              Join Community
            </button>

            {/* Mobile Menu Button */}
            <button 
              type="button"
              className="mobile-toggle-btn-dark"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-dark">
          {/* USER PROFILE Section */}
          {isLoggedIn ? (
            <div className="mobile-drawer-section" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.12)", paddingBottom: "14px" }}>
              <div className="mobile-drawer-category">TECHNOLOGY PROFILE &amp; ACTIONS</div>
              <Link 
                to="/profile"
                className={`mobile-nav-link-dark ${location.pathname === "/profile" ? "active-mobile-blue" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "10px", color: "#38BDF8", fontWeight: 700 }}
              >
                <User size={18} />
                <span>{user?.name || "Sign in"} (View Profile)</span>
              </Link>
              <Link 
                to="/create-post"
                className="mobile-nav-link-dark"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--coral)", fontWeight: 700, marginTop: "6px" }}
              >
                <Plus size={18} />
                <span>+ Create Technical Dispatch</span>
              </Link>
              <Link 
                to="/profile?tab=notifications"
                className="mobile-nav-link-dark"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}
              >
                <Bell size={18} />
                <span>Notifications {unreadNotificationCount > 0 ? `(${unreadNotificationCount} unread)` : ""}</span>
              </Link>
            </div>
          ) : (
            <div className="mobile-drawer-section" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.12)", paddingBottom: "14px" }}>
              <div className="mobile-drawer-category">COMMUNITY ACCOUNT</div>
              <Link 
                to="/login"
                className="mobile-nav-link-dark"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "10px", color: "#38BDF8", fontWeight: 700 }}
              >
                <User size={18} />
                <span>Sign In to NexziByte TechTalk</span>
              </Link>
            </div>
          )}

          {/* COMMUNITY Section */}
          <div className="mobile-drawer-section">
            <div className="mobile-drawer-category">COMMUNITY</div>
            <button 
              type="button" 
              className={`mobile-nav-link-dark ${location.pathname === "/events" ? "active-mobile-blue" : ""}`}
              onClick={() => handleNavigation("/events", null)}
            >
              Events (Upcoming &amp; Discovery)
            </button>
            <button 
              type="button" 
              className={`mobile-nav-link-dark ${location.pathname.startsWith("/summits") ? "active-mobile-blue" : ""}`}
              onClick={() => handleNavigation("/summits", null)}
            >
              Summits (Flagship Conferences)
            </button>
            <button 
              type="button" 
              className={`mobile-nav-link-dark ${location.pathname.startsWith("/founder-meets") ? "active-mobile-blue" : ""}`}
              onClick={() => handleNavigation("/founder-meets", null)}
            >
              Founder Meets (Venture Network)
            </button>
            <button 
              type="button" 
              className="mobile-nav-link-dark" 
              onClick={() => handleProtectedPass("visitor-pass")}
            >
              Pricing &amp; Passes
            </button>
          </div>

          {/* SERVICES Section */}
          <div className="mobile-drawer-section">
            <div className="mobile-drawer-category">SERVICES</div>
            <button 
              type="button" 
              className={`mobile-nav-link-dark ${location.pathname === "/courses" ? "active-mobile-blue" : ""}`}
              onClick={() => handleNavigation("/courses", null)}
            >
              Courses (65+ Tracks)
            </button>
            <button 
              type="button" 
              className={`mobile-nav-link-dark ${location.pathname === "/internship" ? "active-mobile-blue" : ""}`}
              onClick={() => handleNavigation("/internship", null)}
            >
              Internship (23 Specialized Tracks)
            </button>
          </div>

          {/* RESOURCES Section */}
          <div className="mobile-drawer-section">
            <div className="mobile-drawer-category">RESOURCES</div>
            <button 
              type="button" 
              className="mobile-nav-link-dark" 
              onClick={() => handleNavigation("/explore", null)}
            >
              Resource Center &amp; Articles
            </button>
            <button 
              type="button" 
              className="mobile-nav-link-dark" 
              onClick={() => handleNavigation("/#testimonials", "testimonials")}
            >
              Success Stories
            </button>
          </div>

          {/* ABOUT & PARTNER Section */}
          <div className="mobile-drawer-section">
            <div className="mobile-drawer-category">ABOUT &amp; PARTNER</div>
            <button 
              type="button" 
              className="mobile-nav-link-dark" 
              onClick={() => handleNavigation("/#community-intro", "community-intro")}
            >
              About Us
            </button>
            <button 
              type="button" 
              className="mobile-nav-link-dark" 
              onClick={() => handleNavigation("/#contact-us", "contact-us")}
            >
              Contact Us
            </button>
            <button 
              type="button" 
              className="mobile-nav-link-dark"
              style={{ color: "#FFFFFF", fontWeight: 800 }}
              onClick={() => handleProtectedPass("speaker-pass")}
            >
              Partner With Us
            </button>
          </div>
          
          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            {isLoggedIn ? (
              <button 
                type="button" 
                className="btn btn-secondary btn-sm mobile-logout-btn"
                style={{ flex: 1, borderColor: "rgba(239, 68, 68, 0.45)", color: "#EF4444", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                onClick={() => { 
                  setMobileMenuOpen(false); 
                  logout(); 
                  if (location.pathname === "/profile" || location.pathname === "/create-post") {
                    navigate("/");
                  }
                }}
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            ) : (
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
                onClick={() => { setMobileMenuOpen(false); setLoginModalOpen(true); }}
              >
                Login
              </button>
            )}
            <button 
              type="button" 
              className="nav-join-community-btn"
              style={{ flex: 1 }}
              onClick={() => handleProtectedPass("visitor-pass")}
            >
              Join Community
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
