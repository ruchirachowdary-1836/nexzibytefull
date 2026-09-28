import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Search, Calendar, Clock, MapPin, Sparkles, Filter, 
  ArrowRight, Users, ExternalLink, CheckCircle2, ChevronRight,
  Globe, Laptop, Building2, Mic, RotateCcw, Award, Star
} from "lucide-react";
import { 
  DEDICATED_UPCOMING_EVENTS, 
  FEATURED_EVENT_DETAILS, 
  DEDICATED_PAST_EVENTS 
} from "../data/mockData.js";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";

// Modals
import EventDetailModal from "./EventDetailModal.jsx";
import PastEventHighlightsModal from "./PastEventHighlightsModal.jsx";
import HostEventModal from "./HostEventModal.jsx";

// Category Filter Pills Configuration
const CATEGORY_FILTERS = [
  { id: "all", label: "All Events" },
  { id: "upcoming", label: "Upcoming" },
  { id: "workshops", label: "Workshops" },
  { id: "conferences", label: "Conferences" },
  { id: "techtalks", label: "Tech Talks" },
  { id: "webinars", label: "Webinars" },
  { id: "meetups", label: "Meetups" }
];

function displayEventDate(value) {
  if (!value) return "Date to be announced";
  const parsed = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(parsed.getTime())
    ? String(value)
    : parsed.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function displayEventTime(value) {
  if (!value) return "Time to be announced";
  const [hours, minutes] = String(value).split(":").map(Number);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return String(value);
  const parsed = new Date();
  parsed.setHours(hours, minutes, 0, 0);
  return parsed.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function mapPublishedEvent(record, eventType, index) {
  const decoration = DEDICATED_UPCOMING_EVENTS.find(
    (event) => event.title.toLowerCase() === record.title.toLowerCase(),
  ) || {};
  const rawDate = String(record.date || "").slice(0, 10);
  const month = rawDate.slice(5, 7);
  return {
    ...decoration,
    id: record.id,
    event_type: eventType,
    title: record.title,
    rawDate,
    date: displayEventDate(rawDate),
    monthGroup: month === "09" ? "sep-2026" : month === "10" ? "oct-2026" : "later",
    time: displayEventTime(record.time),
    location: record.location || record.venue || "Online",
    venue: record.venue || record.location || "To be announced",
    mode: /online|virtual/i.test(`${record.location || ""} ${record.venue || ""}`) ? "online" : "offline",
    modeBadge: eventType === "summit" ? "Published Summit" : "Founder Meet",
    description: record.description || decoration.description || "Published NexziByte event.",
    image: decoration.image || DEDICATED_UPCOMING_EVENTS[index % DEDICATED_UPCOMING_EVENTS.length].image,
    category: decoration.category || (eventType === "summit" ? "Summit" : "Founder Meet"),
    filterCategory: decoration.filterCategory || (eventType === "summit" ? "conferences" : "meetups"),
    agenda: decoration.title ? decoration.agenda : [],
    speakers: decoration.title ? decoration.speakers : [],
    about: record.description || decoration.about || record.title,
  };
}

export default function EventsPage() {
  const { showToast } = useApp();
  const [publishedEvents, setPublishedEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState("");

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");

  // Modal States
  const [selectedEventForDetail, setSelectedEventForDetail] = useState(null);
  const [autoFocusRegister, setAutoFocusRegister] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [selectedPastEvent, setSelectedPastEvent] = useState(null);
  const [pastModalOpen, setPastModalOpen] = useState(false);

  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [hostModalType, setHostModalType] = useState("host"); // "host" or "speaker"

  useEffect(() => {
    let active = true;
    api.getUpcomingEvents()
      .then((data) => {
        if (!active) return;
        const records = [
          ...(data.summits || []).map((event, index) => mapPublishedEvent(event, "summit", index)),
          ...(data.founder_meets || []).map((event, index) => mapPublishedEvent(event, "founder_meet", index)),
        ];
        setPublishedEvents(records);
      })
      .catch((error) => {
        if (active) setEventsError(error.message || "Published events could not be loaded.");
      })
      .finally(() => {
        if (active) setEventsLoading(false);
      });
    return () => { active = false; };
  }, []);

  // Open Event Details
  const handleOpenEventDetails = (event, focusRegister = false) => {
    setSelectedEventForDetail(event);
    setAutoFocusRegister(focusRegister);
    setDetailModalOpen(true);
  };

  // Open Past Event Highlights
  const handleOpenPastHighlights = (pastEvt) => {
    setSelectedPastEvent(pastEvt);
    setPastModalOpen(true);
  };

  // Open Host / Speaker Modal
  const handleOpenHostModal = (type) => {
    setHostModalType(type);
    setHostModalOpen(true);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setDateFilter("all");
    setLocationFilter("all");
    setModeFilter("all");
  };

  // Filtered Upcoming Events
  const filteredEvents = useMemo(() => {
    return publishedEvents.filter((ev) => {
      // 1. Text Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = ev.title.toLowerCase().includes(q);
        const matchesDesc = ev.description.toLowerCase().includes(q);
        const matchesCat = ev.category.toLowerCase().includes(q);
        const matchesLoc = ev.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCat && !matchesLoc) {
          return false;
        }
      }

      // 2. Category Filter Pill
      if (selectedCategory !== "all") {
        if (selectedCategory === "upcoming") {
          // All 6 items are upcoming
        } else if (selectedCategory === "workshops") {
          if (ev.filterCategory !== "workshops" && !ev.category.toLowerCase().includes("workshop")) return false;
        } else if (selectedCategory === "conferences") {
          if (ev.filterCategory !== "conferences" && !ev.category.toLowerCase().includes("summit")) return false;
        } else if (selectedCategory === "techtalks") {
          if (ev.filterCategory !== "techtalks" && !ev.category.toLowerCase().includes("techtalk")) return false;
        } else if (selectedCategory === "webinars") {
          if (ev.mode !== "online") return false;
        } else if (selectedCategory === "meetups") {
          if (ev.filterCategory !== "meetups" && !ev.category.toLowerCase().includes("meetup")) return false;
        }
      }

      // 3. Date Filter
      if (dateFilter !== "all") {
        if (dateFilter === "sep-2026" && ev.monthGroup !== "sep-2026") return false;
        if (dateFilter === "oct-2026" && ev.monthGroup !== "oct-2026") return false;
        if (dateFilter === "later" && (ev.monthGroup === "sep-2026" || ev.monthGroup === "oct-2026")) return false;
      }

      // 4. Location Filter
      if (locationFilter !== "all") {
        if (locationFilter === "hyderabad" && !ev.location.toLowerCase().includes("hyderabad")) return false;
        if (locationFilter === "online" && ev.mode !== "online") return false;
      }

      // 5. Mode Filter (Online / Offline)
      if (modeFilter !== "all") {
        if (modeFilter === "online" && ev.mode !== "online") return false;
        if (modeFilter === "offline" && ev.mode !== "offline") return false;
      }

      return true;
    });
  }, [publishedEvents, searchQuery, selectedCategory, dateFilter, locationFilter, modeFilter]);

  const openFeaturedEvent = (focusRegister = false) => {
    const matchingEvent = publishedEvents.find(
      (candidate) => candidate.title.toLowerCase() === FEATURED_EVENT_DETAILS.title.toLowerCase(),
    );
    if (matchingEvent) {
      handleOpenEventDetails(matchingEvent, focusRegister);
      return;
    }
    document.getElementById("events-browser")?.scrollIntoView({ behavior: "smooth" });
    showToast("Choose a currently published event to register and receive a database-backed pass.");
  };

  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "all" || dateFilter !== "all" || locationFilter !== "all" || modeFilter !== "all";

  return (
    <div className="events-page-root">
      {/* ══════════════════════════════════════════════════════════════════
          1. EVENTS PAGE HERO BANNER
          ══════════════════════════════════════════════════════════════════ */}
      <section className="events-banner-section">
        {/* Subtle Tech Pattern & Blue Ambient Gradient */}
        <div className="events-banner-grid-overlay" aria-hidden="true" />
        <div className="events-banner-glow" aria-hidden="true" />

        <div className="container">
          <div className="events-banner-content">
            <div className="events-page-badge">
              <Sparkles size={14} className="events-badge-sparkle" />
              <span>NEXZIBYTE TECHTALK EVENTS DISCOVERY</span>
            </div>

            <h1 className="events-page-main-heading">
              Explore NexziByte Events
            </h1>

            <p className="events-page-main-subheading">
              Discover technology events, workshops, industry meetups and learning experiences that connect ideas, people and opportunities.
            </p>

            {/* Quick Stats Strip */}
            <div className="events-stats-strip">
              <div className="events-stat-pill">
                <span className="events-stat-number">{publishedEvents.length}</span>
                <span className="events-stat-text">Upcoming Events</span>
              </div>
              <div className="events-stat-pill">
                <span className="events-stat-number">2,500+</span>
                <span className="events-stat-text">Active Attendees</span>
              </div>
              <div className="events-stat-pill">
                <span className="events-stat-number">100% Free</span>
                <span className="events-stat-text">Pass Access</span>
              </div>
              <div className="events-stat-pill">
                <span className="events-stat-number">Hyderabad &amp; Online</span>
                <span className="events-stat-text">Dual Formats</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          2. EVENT SEARCH AND FILTERS AREA
          ══════════════════════════════════════════════════════════════════ */}
      <section className="events-search-filter-section" id="events-browser">
        <div className="container">
          <div className="events-search-filter-card">
            {/* Search Input Bar */}
            <div className="events-search-bar-wrap">
              <div className="events-search-input-box">
                <Search size={20} className="events-search-icon" />
                <input 
                  type="text"
                  placeholder="Search events, workshops or topics..."
                  className="events-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search events"
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    className="events-search-clear-btn"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Primary Rounded Category Filter Pills */}
            <div className="events-category-filters-row">
              <div className="events-filter-pills-wrap">
                {CATEGORY_FILTERS.map((cat) => (
                  <button 
                    key={cat.id}
                    type="button"
                    className={`events-filter-pill-btn ${selectedCategory === cat.id ? "active" : ""}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Secondary Multi-Select Dropdowns */}
            <div className="events-dropdown-filters-row">
              <div className="events-dropdown-group">
                <label className="events-dropdown-label">
                  <Calendar size={13} />
                  <span>Date</span>
                </label>
                <select 
                  className="events-select-input"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  aria-label="Filter by date"
                >
                  <option value="all">All Dates (2026)</option>
                  <option value="sep-2026">September 2026</option>
                  <option value="oct-2026">October 2026</option>
                  <option value="later">Later (Nov+ 2026)</option>
                </select>
              </div>

              <div className="events-dropdown-group">
                <label className="events-dropdown-label">
                  <MapPin size={13} />
                  <span>Location</span>
                </label>
                <select 
                  className="events-select-input"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  aria-label="Filter by location"
                >
                  <option value="all">All Locations</option>
                  <option value="hyderabad">Hyderabad (In-Person)</option>
                  <option value="online">Online / Virtual</option>
                </select>
              </div>

              <div className="events-dropdown-group">
                <label className="events-dropdown-label">
                  <Globe size={13} />
                  <span>Format</span>
                </label>
                <select 
                  className="events-select-input"
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value)}
                  aria-label="Filter by format"
                >
                  <option value="all">Online &amp; Offline</option>
                  <option value="online">Online Only</option>
                  <option value="offline">Offline / In-Person</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button 
                  type="button" 
                  className="events-reset-filter-btn"
                  onClick={handleClearFilters}
                >
                  <RotateCcw size={14} />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          3. UPCOMING NEXZIBYTE EVENTS (3-COLUMN RESPONSIVE CARDS)
          ══════════════════════════════════════════════════════════════════ */}
      <section className="events-upcoming-section">
        <div className="container">
          {/* Section Header */}
          <div className="events-section-header-row">
            <div>
              <div className="events-section-tag">
                <Calendar size={13} className="text-blue-accent" />
                <span>CALENDAR &amp; REGISTRATIONS</span>
              </div>
              <h2 className="events-section-heading">Upcoming Events</h2>
              <p className="events-section-subtitle">
                Explore hand-crafted summits, practical workshops, and developer meetups scheduled across Hyderabad and interactive online stages.
              </p>
            </div>

            <div className="events-match-count-pill">
              Showing <strong>{filteredEvents.length}</strong> of {publishedEvents.length} events
            </div>
          </div>
          {eventsLoading && <p role="status">Loading published events…</p>}
          {eventsError && <p role="alert">{eventsError}</p>}

          {/* 3-Column Card Grid */}
          {filteredEvents.length > 0 ? (
            <div className="events-three-col-grid">
              {filteredEvents.map((evt) => (
                <div key={evt.id} className="event-primary-card">
                  {/* Image Container with Zoom Effect */}
                  <div 
                    className="event-card-img-container"
                    onClick={() => handleOpenEventDetails(evt, false)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${evt.title}`}
                  >
                    <img 
                      src={evt.image} 
                      alt={evt.title} 
                      className="event-card-zoom-img"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&auto=format&fit=crop&q=80";
                      }}
                    />
                    <div className="event-card-badges-row">
                      <span className="event-category-pill">{evt.category}</span>
                      <span className={`event-mode-indicator-pill ${evt.mode === 'online' ? 'mode-online' : 'mode-offline'}`}>
                        {evt.mode === "online" ? <Laptop size={11} /> : <Building2 size={11} />}
                        <span>{evt.location}</span>
                      </span>
                    </div>

                    {evt.badge && (
                      <span className="event-ribbon-badge">{evt.badge}</span>
                    )}
                  </div>

                  {/* Card Content Body */}
                  <div className="event-card-content-box">
                    <h3 
                      className="event-card-title-text"
                      onClick={() => handleOpenEventDetails(evt, false)}
                      role="button"
                      tabIndex={0}
                    >
                      {evt.title}
                    </h3>

                    {/* Meta Row: Date, Time, Location */}
                    <div className="event-card-meta-list">
                      <div className="event-card-meta-item">
                        <Calendar size={14} className="text-blue-accent flex-shrink-0" />
                        <span>{evt.date}</span>
                      </div>
                      <div className="event-card-meta-item">
                        <Clock size={14} className="text-blue-accent flex-shrink-0" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="event-card-meta-item">
                        <MapPin size={14} className="text-blue-accent flex-shrink-0" />
                        <span>{evt.venue || evt.location}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="event-card-description-text">
                      {evt.description}
                    </p>

                    {/* Dual Action Buttons */}
                    <div className="event-card-actions-row">
                      <button 
                        type="button" 
                        className="btn btn-secondary btn-sm flex-1"
                        onClick={() => handleOpenEventDetails(evt, false)}
                      >
                        <span>View Details</span>
                      </button>

                      <button 
                        type="button" 
                        className="btn btn-blue-primary btn-sm flex-1"
                        onClick={() => handleOpenEventDetails(evt, true)}
                      >
                        <span>Register Now</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !eventsLoading && !eventsError && publishedEvents.length === 0 ? (
            <div className="events-empty-state-box">
              <h3 className="events-empty-title">No published events are open for registration</h3>
              <p className="events-empty-desc">Please check back when a summit or founder meet is published.</p>
            </div>
          ) : !eventsLoading && !eventsError ? (
            <div className="events-empty-state-box">
              <Sparkles size={40} className="text-blue-accent" style={{ opacity: 0.5, marginBottom: "16px" }} />
              <h3 className="events-empty-title">No matching events found</h3>
              <p className="events-empty-desc">
                We couldn’t find any events matching your selected search query or filters.
              </p>
              <button 
                type="button" 
                className="btn btn-blue-primary btn-sm"
                onClick={handleClearFilters}
                style={{ marginTop: "16px" }}
              >
                Reset All Filters
              </button>
            </div>
          ) : null}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          4. FEATURED NEXZIBYTE EVENT (LARGE ASYMMETRIC 2-COLUMN SHOWCASE)
          ══════════════════════════════════════════════════════════════════ */}
      <section className="events-featured-section">
        <div className="container">
          <div className="featured-event-card-container">
            {/* Left Side: Large Conference Image */}
            <div className="featured-event-image-side">
              <img 
                src={FEATURED_EVENT_DETAILS.image} 
                alt={FEATURED_EVENT_DETAILS.title} 
                className="featured-event-large-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80";
                }}
              />
              <div className="featured-event-image-badge">
                <Star size={14} />
                <span>NEXZIBYTE ANNUAL SHOWCASE</span>
              </div>
            </div>

            {/* Right Side: Event Details */}
            <div className="featured-event-details-side">
              <div className="featured-event-label-row">
                <span className="featured-event-label-pill">{FEATURED_EVENT_DETAILS.label}</span>
                <span className="featured-event-spotlight-pill">{FEATURED_EVENT_DETAILS.badge}</span>
              </div>

              <h2 className="featured-event-title-text">
                {FEATURED_EVENT_DETAILS.title}
              </h2>

              <p className="featured-event-description-text">
                {FEATURED_EVENT_DETAILS.description}
              </p>

              {/* Show Date, Time, Venue, Speakers, Expected Attendees */}
              <div className="featured-event-info-grid">
                <div className="featured-info-box">
                  <div className="featured-info-icon-wrap">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <div className="featured-info-label">Date</div>
                    <div className="featured-info-value">{FEATURED_EVENT_DETAILS.date}</div>
                  </div>
                </div>

                <div className="featured-info-box">
                  <div className="featured-info-icon-wrap">
                    <Clock size={18} />
                  </div>
                  <div>
                    <div className="featured-info-label">Time</div>
                    <div className="featured-info-value">{FEATURED_EVENT_DETAILS.time}</div>
                  </div>
                </div>

                <div className="featured-info-box">
                  <div className="featured-info-icon-wrap">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className="featured-info-label">Venue</div>
                    <div className="featured-info-value">{FEATURED_EVENT_DETAILS.venue}</div>
                  </div>
                </div>

                <div className="featured-info-box">
                  <div className="featured-info-icon-wrap">
                    <Mic size={18} />
                  </div>
                  <div>
                    <div className="featured-info-label">Speakers</div>
                    <div className="featured-info-value">{FEATURED_EVENT_DETAILS.speakers}</div>
                  </div>
                </div>

                <div className="featured-info-box featured-info-full">
                  <div className="featured-info-icon-wrap">
                    <Users size={18} />
                  </div>
                  <div>
                    <div className="featured-info-label">Expected Attendees</div>
                    <div className="featured-info-value">{FEATURED_EVENT_DETAILS.expectedAttendees}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: View Event & Reserve Your Spot */}
              <div className="featured-event-actions-row">
                <button 
                  type="button" 
                  className="btn btn-secondary btn-lg"
                  onClick={() => openFeaturedEvent(false)}
                >
                  <span>View Event</span>
                  <ExternalLink size={16} />
                </button>

                <button 
                  type="button" 
                  className="btn btn-blue-primary btn-lg"
                  onClick={() => openFeaturedEvent(true)}
                >
                  <Sparkles size={16} />
                  <span>Reserve Your Spot</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          5. PAST NEXZIBYTE EVENTS SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <section className="events-past-section">
        <div className="container">
          <div className="events-section-header-row">
            <div>
              <div className="events-section-tag">
                <Award size={13} className="text-blue-accent" />
                <span>ARCHIVE &amp; IMPACT DISPATCHES</span>
              </div>
              <h2 className="events-section-heading">Past Events</h2>
              <p className="events-section-subtitle">
                Explore previous NexziByte summits, industry conferences, and developer networking sessions that shaped tech conversations.
              </p>
            </div>
          </div>

          <div className="past-events-three-col-grid">
            {DEDICATED_PAST_EVENTS.map((pastEvt) => (
              <div key={pastEvt.id} className="past-event-archive-card">
                <div className="past-card-img-wrap">
                  <img 
                    src={pastEvt.image} 
                    alt={pastEvt.title} 
                    className="past-card-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/summit-gpacts.jpg";
                    }}
                  />
                  <span className="past-badge-pill">{pastEvt.category}</span>
                </div>

                <div className="past-card-content">
                  <div className="past-card-meta-row">
                    <div className="past-meta-item">
                      <Calendar size={13} className="text-blue-accent" />
                      <span>{pastEvt.date}</span>
                    </div>
                    <div className="past-meta-item">
                      <MapPin size={13} className="text-blue-accent" />
                      <span>{pastEvt.location}</span>
                    </div>
                  </div>

                  <h3 className="past-card-title">{pastEvt.title}</h3>

                  <p className="past-card-desc">{pastEvt.description}</p>

                  <div className="past-card-actions">
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm btn-full"
                      onClick={() => handleOpenPastHighlights(pastEvt)}
                    >
                      <span>View Highlights</span>
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          7. HOST AN EVENT / COLLABORATE SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <section className="events-host-collab-section">
        <div className="container">
          <div className="host-collab-box">
            <div className="host-collab-ambient-glow" aria-hidden="true" />

            <div className="host-collab-inner">
              <span className="host-collab-tag">
                <Sparkles size={14} className="text-blue-accent" />
                PARTNERSHIP &amp; COMMUNITY COLLABORATION
              </span>

              <h2 className="host-collab-heading">
                Want to Host or Collaborate on an Event?
              </h2>

              <p className="host-collab-text">
                Partner with NexziByte TechTalk to organize workshops, tech talks, community meetups and industry-focused learning experiences.
              </p>

              <div className="host-collab-btn-row">
                <button 
                  type="button" 
                  className="btn btn-blue-primary btn-lg"
                  onClick={() => handleOpenHostModal("host")}
                >
                  <Calendar size={18} />
                  <span>Host an Event</span>
                </button>

                <button 
                  type="button" 
                  className="btn btn-secondary btn-lg"
                  onClick={() => handleOpenHostModal("speaker")}
                >
                  <Mic size={18} />
                  <span>Become a Speaker</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          MODALS
          ══════════════════════════════════════════════════════════════════ */}
      {/* 6. Event Detail Modal with Registration Card */}
      <EventDetailModal 
        event={selectedEventForDetail}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        autoFocusRegister={autoFocusRegister}
      />

      {/* Past Event Highlights Modal */}
      <PastEventHighlightsModal 
        event={selectedPastEvent}
        isOpen={pastModalOpen}
        onClose={() => setPastModalOpen(false)}
      />

      {/* Host / Speaker Modal */}
      <HostEventModal 
        isOpen={hostModalOpen}
        onClose={() => setHostModalOpen(false)}
        defaultType={hostModalType}
      />
    </div>
  );
}
