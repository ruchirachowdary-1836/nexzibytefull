import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route, Link, useSearchParams, useLocation } from "react-router-dom";
import { 
  Sparkles, Search, Filter, ArrowLeft, ArrowRight, Calendar, MapPin, 
  Clock, Mic, QrCode, CheckCircle2, BookOpen, Layers, ShieldCheck 
} from "lucide-react";

import { AppProvider, useApp } from "./context/AppContext.jsx";
import { 
  CATEGORIES, TECHNICAL_ARTICLES, UPCOMING_EVENTS, SPEAKERS, 
  PASSES, FEATURED_SUMMIT, FOUNDER_MEETS_DATA 
} from "./data/mockData.js";
import "./styles.css";

// Reusable Components
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import LogoMarquee from "./components/LogoMarquee.jsx";
import CommunityIntro from "./components/CommunityIntro.jsx";
import Stats from "./components/Stats.jsx";
import ExploreTechTalk from "./components/ExploreTechTalk.jsx";
import TechnologyTopics from "./components/TechnologyTopics.jsx";
import FeaturedSummit from "./components/FeaturedSummit.jsx";
import UpcomingEvents from "./components/UpcomingEvents.jsx";
import Speakers from "./components/Speakers.jsx";
import Passes from "./components/Passes.jsx";
import DigitalPass from "./components/DigitalPass.jsx";
import QRScanner from "./components/QRScanner.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import TechnicalContent from "./components/TechnicalContent.jsx";
import FounderMeets from "./components/FounderMeets.jsx";
import Testimonials from "./components/Testimonials.jsx";
import CommunityImpact from "./components/CommunityImpact.jsx";
import FinalCTA from "./components/FinalCTA.jsx";
import FAQ from "./components/FAQ.jsx";
import Newsletter from "./components/Newsletter.jsx";
import Footer from "./components/Footer.jsx";
import EventsPage from "./components/EventsPage.jsx";
import InternshipPage from "./components/InternshipPage.jsx";
import UserProfilePage from "./components/UserProfilePage.jsx";
import SummitDetailsPage from "./components/SummitDetailsPage.jsx";
import FounderMeetsPage from "./components/FounderMeetsPage.jsx";
import FounderMeetDetailsPage from "./components/FounderMeetDetailsPage.jsx";

// Modals
import PassRegistrationModal from "./components/PassRegistrationModal.jsx";
import VideoModal from "./components/VideoModal.jsx";
import ArticleModal from "./components/ArticleModal.jsx";
import SummitModal from "./components/SummitModal.jsx";
import CourseModal from "./components/CourseModal.jsx";
import InternshipModal from "./components/InternshipModal.jsx";
import LoginModal from "./components/LoginModal.jsx";

/* ══════════════════════════════════════════════════════════════════
   PAGES
   ══════════════════════════════════════════════════════════════════ */

// 1. HOME PAGE
function HomePage() {
  return (
    <main className="home-page-luxury">
      <Hero />
      <LogoMarquee />
      <CommunityIntro />
      <Stats />
      <ExploreTechTalk />
      <HowItWorks />
      <UpcomingEvents />
      <TechnicalContent />
      <FounderMeets />
      <Testimonials />
      <CommunityImpact />
      <FinalCTA />
      <FAQ />
      <Newsletter />
    </main>
  );
}

// 2. EXPLORE FEED PAGE (/explore)
function ExploreFeedPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCatParam = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(activeCatParam);
  const [searchFilter, setSearchFilter] = useState("");
  const { openArticleReader } = useApp();

  useEffect(() => {
    if (activeCatParam) {
      setActiveCategory(activeCatParam);
    }
  }, [activeCatParam]);

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    if (catId === "all") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  const filteredArticles = TECHNICAL_ARTICLES.filter((art) => {
    const matchesCat = activeCategory === "all" || art.category.toLowerCase().includes(activeCategory.toLowerCase());
    const matchesSearch = !searchFilter || 
      art.title.toLowerCase().includes(searchFilter.toLowerCase()) || 
      art.excerpt.toLowerCase().includes(searchFilter.toLowerCase()) ||
      art.category.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="section-padding">
      <div className="container">
        <div style={{ marginBottom: "36px" }}>
          <span className="section-label">COMMUNITY KNOWLEDGE</span>
          <h1 className="section-heading">Explore Feed &amp; Dispatches</h1>
          <p className="section-subtitle">
            Browse technical articles, architecture teardowns, and engineering insights across key technology domains.
          </p>
        </div>

        {/* Search & Category Filter Pills */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px" }}>
          <div style={{ position: "relative", maxWidth: "500px" }}>
            <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
            <input
              type="text"
              placeholder="Search articles, architectures, tags..."
              className="form-input"
              style={{ paddingLeft: "44px", borderRadius: "var(--radius-full)" }}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => handleCategorySelect("all")}
              className={`btn btn-sm ${activeCategory === "all" ? "btn-primary" : "btn-secondary"}`}
            >
              All Topics ({TECHNICAL_ARTICLES.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={`btn btn-sm ${activeCategory === cat.id ? "btn-primary" : "btn-secondary"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="articles-grid">
          {filteredArticles.map((art) => (
            <div 
              key={art.id} 
              className="article-card"
              onClick={() => openArticleReader(art)}
              role="button"
              tabIndex={0}
            >
              <div className="article-category-tag">{art.category}</div>
              <h3 className="article-title">{art.title}</h3>
              <p className="article-excerpt">{art.excerpt}</p>
              <div className="article-meta-row">
                <div>
                  <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{art.author}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px", fontSize: "0.75rem" }}>
                    <Clock size={12} />
                    <span>{art.readingTime}</span>
                  </div>
                </div>
                <div className="article-read-btn">
                  <span>Read</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
            <BookOpen size={48} style={{ opacity: 0.3, marginBottom: "16px" }} />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-main)" }}>No dispatches found</h3>
            <p style={{ fontSize: "0.9375rem" }}>Try adjusting your search query or topic filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// 5. SPEAKERS PAGE (/speakers)
function SpeakersPage() {
  return (
    <div className="inner-page-wrapper">
      <div className="page-hero-banner">
        <div className="container">
          <div className="page-hero-badge">
            <Mic size={14} style={{ color: "#38BDF8" }} />
            <span>DISTINGUISHED SPEAKERS &amp; ARCHITECTS</span>
          </div>
          <h1 className="page-hero-title">
            Learn From Industry Leaders &amp; <span className="hero-highlight-vibrant">Visionaries</span>
          </h1>
          <p className="page-hero-subtitle">
            Connect with keynote architects, engineering leaders, and founders from Fortune 500 tech enterprises and disruptive startups.
          </p>
        </div>
      </div>
      <Speakers />
      <Testimonials />
      <FinalCTA />
    </div>
  );
}

// 6. COURSES & INTERNSHIPS PAGE (/courses)
function CoursesPage() {
  return (
    <div className="inner-page-wrapper">
      <div className="page-hero-banner">
        <div className="container">
          <div className="page-hero-badge">
            <Sparkles size={14} style={{ color: "var(--coral)" }} />
            <span>PROFESSIONAL COURSES &amp; INTERNSHIPS</span>
          </div>
          <h1 className="page-hero-title">
            Industry-Aligned Courses &amp; <span className="hero-highlight-vibrant">Internship Tracks</span>
          </h1>
          <p className="page-hero-subtitle">
            Comprehensive curriculum, live enterprise projects, and active internship recruitment across 65+ high-growth technology disciplines.
          </p>
        </div>
      </div>
      <TechnologyTopics />
      <Passes />
      <FAQ />
    </div>
  );
}

// 7. PASSES PAGE (/passes)
function PassesPage() {
  return (
    <div>
      <Passes />
      <DigitalPass />
      <QRScanner />
      <FAQ />
    </div>
  );
}

// 8. SCANNER PAGE (/scanner)
function ScannerPage() {
  return (
    <div style={{ paddingTop: "20px" }}>
      <QRScanner />
      <DigitalPass />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN APPLICATION ROUTER & WRAPPER
   ══════════════════════════════════════════════════════════════════ */
function App() {
  const { toastMessage, user, setLoginModalOpen } = useApp();
  const location = useLocation();

  // Scroll to top on navigation change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isHomePage = location.pathname === "/";

  return (
    <div className={`app-shell ${isHomePage ? "app-shell-home-luxury" : ""}`}>
      {/* Sticky Header Navigation */}
      <Navbar />

      {/* Main Routed Content */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/explore" element={<ExploreFeedPage />} />
        <Route path="/summits" element={<SummitDetailsPage />} />
        <Route path="/summits/:id" element={<SummitDetailsPage />} />
        <Route path="/summit-details" element={<SummitDetailsPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/internship" element={<InternshipPage />} />
        <Route path="/founder-meets" element={<FounderMeetsPage />} />
        <Route path="/founder-meets/:id" element={<FounderMeetDetailsPage />} />
        <Route path="/founder-meet-details" element={<FounderMeetDetailsPage />} />
        <Route path="/speakers" element={<SpeakersPage />} />
        <Route path="/passes" element={<PassesPage />} />
        <Route path="/scanner" element={<ScannerPage />} />
        <Route path="/profile" element={user ? <UserProfilePage /> : <LoginRequired onLogin={() => setLoginModalOpen(true)} />} />
        <Route path="*" element={<HomePage />} />
      </Routes>

      {/* Spacious Footer */}
      <Footer />

      {/* Modals */}
      <PassRegistrationModal />
      <VideoModal />
      <ArticleModal />
      <SummitModal />
      <CourseModal />
      <InternshipModal />
      <LoginModal />

      {/* Interactive Toast Notification Banner */}
      {toastMessage && (
        <div className="toast-banner" role="alert">
          <Sparkles size={16} style={{ color: "var(--coral)" }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

function LoginRequired({ onLogin }) {
  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: "620px", textAlign: "center" }}>
        <span className="section-label">MEMBERS ONLY</span>
        <h1 className="section-heading">Create an account to view your profile.</h1>
        <p className="section-subtitle">Your profile will be built from the information you submit and saved to your account.</p>
        <button type="button" className="btn btn-primary" onClick={onLogin}>Login or create account</button>
      </div>
    </div>
  );
}

// Error Boundary to prevent blank white screens on runtime errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("TechTalk ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "60px 20px", textAlign: "center", minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#F7F5F0", color: "#18181B" }}>
          <div style={{ maxWidth: "540px", background: "#FFFFFF", padding: "36px", borderRadius: "16px", border: "1px solid #E7E3DC", boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "12px", color: "#6C2BD9" }}>TechTalk Platform Recovery</h2>
            <p style={{ fontSize: "0.9375rem", color: "#666666", marginBottom: "20px" }}>
              An unexpected render issue occurred. Click below to recover or return home.
            </p>
            {this.state.error?.message && (
              <pre style={{ fontSize: "0.8125rem", background: "#FFF7ED", color: "#9A3412", padding: "10px 14px", borderRadius: "8px", overflowX: "auto", textAlign: "left", marginBottom: "20px" }}>
                {this.state.error.message}
              </pre>
            )}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button 
                type="button" 
                onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = "/"; }}
                style={{ padding: "10px 20px", background: "#6C2BD9", color: "#FFFFFF", borderRadius: "9999px", fontWeight: 700, border: "none", cursor: "pointer" }}
              >
                Return to Home
              </button>
              <button 
                type="button" 
                onClick={() => window.location.reload()}
                style={{ padding: "10px 20px", background: "#E7E3DC", color: "#18181B", borderRadius: "9999px", fontWeight: 700, border: "none", cursor: "pointer" }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Root Render
const rootElement = document.getElementById("root");
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
function RootProviders({ children }) {
  if (!clerkPublishableKey) return children;
  return <ClerkProvider publishableKey={clerkPublishableKey}>{children}</ClerkProvider>;
}
if (rootElement) {
  if (!window.__techtalk_root) {
    window.__techtalk_root = createRoot(rootElement);
  }
  window.__techtalk_root.render(
    <ErrorBoundary>
      <RootProviders>
        <BrowserRouter>
          <AppProvider>
            <App />
          </AppProvider>
        </BrowserRouter>
      </RootProviders>
    </ErrorBoundary>
  );
}
