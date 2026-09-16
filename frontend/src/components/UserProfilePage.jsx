import React, { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  User, MapPin, Briefcase, Calendar, Mail, Globe,
  Sparkles, ShieldCheck, CheckCircle2, Award, Bookmark, BookOpen, Clock,
  ArrowRight, ExternalLink, Edit3, Share2, Ticket, Terminal, Cpu, Database,
  Cloud, Code, Layers, GitCommit, GitPullRequest, Mic, Search, X, RefreshCw,
  Flame, Check, Eye, ThumbsUp, Trash2, Bell, Settings as SettingsIcon,
  CheckCheck, Plus, Lock, Shield, Sliders, ToggleLeft, ToggleRight,
  MessageSquare, Heart, ChevronRight, Filter, LogOut
} from "lucide-react";

function GitHubIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

function LinkedInIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z"/>
    </svg>
  );
}

function XTwitterIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

import { useApp } from "../context/AppContext.jsx";
import {
  DEFAULT_PROFILE,
  PROFILE_METRICS,
  SKILL_CATEGORIES,
  PUBLISHED_POSTS,
  DRAFT_POSTS_INITIAL,
  ACTIVITY_FEED,
  CAREER_TIMELINE,
  SPEAKING_ENGAGEMENTS,
  generateContributionGrid
} from "../data/userProfileData.js";

export default function UserProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { 
    user, 
    isLoggedIn,
    logout,
    updateUserProfile, 
    resetUserProfile, 
    savedPosts, 
    toggleSavePost, 
    openArticleReader,
    openPassModal,
    showToast,
    userPosts,
    userDrafts,
    deletePost,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotificationCount
  } = useApp();

  // Active Tab state: 'activity' | 'posts' | 'saved' | 'skills' | 'experience' | 'notifications' | 'settings'
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "activity");

  // Sync tab with URL search parameter
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  // Posts Sub-tab: "published" | "drafts"
  const [postsSubTab, setPostsSubTab] = useState("published");

  // Notifications Filter: "all" | "comment" | "reaction" | "follower" | "event" | "pass"
  const [notifFilter, setNotifFilter] = useState("all");

  // Settings Sub-tab: "profile" | "account" | "notifications" | "privacy" | "security"
  const [settingsSection, setSettingsSection] = useState("profile");
  const [accountEmail, setAccountEmail] = useState(user?.email || DEFAULT_PROFILE.email);
  const [accountHandle, setAccountHandle] = useState(user?.handle || DEFAULT_PROFILE.handle);
  const [accountTimezone, setAccountTimezone] = useState(user?.timezone || DEFAULT_PROFILE.timezone);
  const [notifPrefs, setNotifPrefs] = useState({
    emailNotifs: true,
    pushNotifs: true,
    weeklyDigest: true,
    eventAnnouncements: true
  });
  const [privacyPrefs, setPrivacyPrefs] = useState({
    publicProfile: true,
    showActivity: true
  });
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirmPass: ""
  });

  // In-session Profile Editor Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || DEFAULT_PROFILE.name,
    title: user?.title || DEFAULT_PROFILE.title,
    bio: user?.bio || DEFAULT_PROFILE.bio,
    location: user?.location || DEFAULT_PROFILE.location,
    role: user?.role || DEFAULT_PROFILE.role,
    company: user?.company || DEFAULT_PROFILE.company,
    avatar: user?.avatar || DEFAULT_PROFILE.avatar
  });

  // Filter & Search states
  const [postSearch, setPostSearch] = useState("");
  const [selectedSkillCategory, setSelectedSkillCategory] = useState("All");

  // Contribution Heatmap Data (Memoized 52 weeks)
  const heatmapData = useMemo(() => generateContributionGrid(), []);
  const [hoveredDay, setHoveredDay] = useState(null);

  // Check if current user details deviate from default (indicating active session edits)
  const isModified = user?.name !== DEFAULT_PROFILE.name || 
                     user?.bio !== DEFAULT_PROFILE.bio || 
                     user?.location !== DEFAULT_PROFILE.location || 
                     user?.title !== DEFAULT_PROFILE.title;

  // Open Edit Modal with current values
  const handleOpenEdit = () => {
    setFormData({
      name: user?.name || DEFAULT_PROFILE.name,
      title: user?.title || DEFAULT_PROFILE.title,
      bio: user?.bio || DEFAULT_PROFILE.bio,
      location: user?.location || DEFAULT_PROFILE.location,
      role: user?.role || DEFAULT_PROFILE.role,
      company: user?.company || DEFAULT_PROFILE.company,
      avatar: user?.avatar || DEFAULT_PROFILE.avatar
    });
    setEditModalOpen(true);
  };

  // Submit in-session changes
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    updateUserProfile(formData);
    setEditModalOpen(false);
  };

  // Quick reset back to Aiswarya defaults
  const handleResetToDefault = () => {
    resetUserProfile();
    setFormData({
      name: DEFAULT_PROFILE.name,
      title: DEFAULT_PROFILE.title,
      bio: DEFAULT_PROFILE.bio,
      location: DEFAULT_PROFILE.location,
      role: DEFAULT_PROFILE.role,
      company: DEFAULT_PROFILE.company,
      avatar: DEFAULT_PROFILE.avatar
    });
    setEditModalOpen(false);
  };

  // Share profile handler
  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("✓ Profile link copied to clipboard!");
    } else {
      showToast("Profile URL: " + window.location.href);
    }
  };

  // Filter posts (published or drafts)
  const currentPostSource = postsSubTab === "published" ? (userPosts || PUBLISHED_POSTS) : (userDrafts || DRAFT_POSTS_INITIAL);
  const filteredPosts = currentPostSource.filter(p => {
    const q = postSearch.toLowerCase();
    return !q || 
      p.title.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) || 
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)));
  });

  return (
    <div className="profile-page-wrapper">
      {/* ══════════════════════════════════════════════════════════════════
          HERO & IDENTITY SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <section className="profile-hero-section">
        {/* Cover Architectural Backdrop */}
        <div className="profile-cover-banner">
          <div className="profile-cover-mesh" />
          <div className="profile-cover-grid" />
          
          <div className="profile-cover-tags">
            <span className="profile-badge-pill verified">
              <ShieldCheck size={13} />
              <span>Verified NexziByte Architect</span>
            </span>
            <span className="profile-badge-pill id-code">
              <Terminal size={12} />
              <span>ID NO: {user?.passId || "TT26-000107"}</span>
            </span>
          </div>
        </div>

        <div className="container">
          <div className="profile-identity-card">
            <div className="profile-identity-top">
              {/* Avatar with Status Ring */}
              <div className="profile-avatar-wrapper">
                <img 
                  src={user?.avatar || DEFAULT_PROFILE.avatar} 
                  alt={user?.name || "M. L. S. V. Aiswarya"} 
                  className="profile-avatar-img"
                  onError={(e) => {
                    // Fallback to stylized initials if image link breaks
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="profile-avatar-fallback" style={{ display: "none" }}>
                  {user?.avatarInitials || "MA"}
                </div>
                <div className="profile-status-indicator" title={user?.status || "Available for Consulting"} />
              </div>

              {/* Action Buttons: Edit (Session), Share, Pass */}
              <div className="profile-hero-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm profile-action-btn"
                  onClick={handleOpenEdit}
                  id="btn-edit-profile-session"
                >
                  <Edit3 size={15} />
                  <span>Edit Profile <span className="action-pill-tag">Session</span></span>
                </button>

                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm profile-action-btn"
                  onClick={handleShareProfile}
                  id="btn-share-profile"
                >
                  <Share2 size={15} />
                  <span>Share</span>
                </button>

                <button 
                  type="button" 
                  className="btn btn-primary btn-sm profile-action-btn"
                  onClick={() => openPassModal("visitor-pass")}
                  id="btn-profile-pass"
                >
                  <Ticket size={15} />
                  <span>My Event Pass</span>
                </button>

                {isLoggedIn ? (
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm profile-action-btn profile-logout-btn"
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    id="btn-profile-logout"
                    title="Sign out of TechTalk session"
                  >
                    <LogOut size={15} style={{ color: "#EF4444" }} />
                    <span>Log Out</span>
                  </button>
                ) : (
                  <Link 
                    to="/login"
                    className="btn btn-secondary btn-sm profile-action-btn"
                    id="btn-profile-login"
                    title="Sign in to your account"
                  >
                    <User size={15} />
                    <span>Log In</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Signed-Out Guest Notice Banner */}
            {!isLoggedIn && (
              <div className="session-active-indicator-bar" style={{ background: "rgba(239, 68, 68, 0.08)", borderColor: "rgba(239, 68, 68, 0.3)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <User size={15} style={{ color: "#EF4444" }} />
                  <span><strong>Signed Out Preview:</strong> You are currently viewing this technology profile in guest mode.</span>
                </div>
                <Link 
                  to="/login" 
                  className="session-reset-btn"
                  style={{ borderColor: "#EF4444", color: "#EF4444", textDecoration: "none" }}
                >
                  <span>Log In to TechTalk</span>
                </Link>
              </div>
            )}

            {/* In-Session Edit Indicator Banner */}
            {isModified && (
              <div className="session-active-indicator-bar">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="session-pulse-dot" />
                  <span><strong>Active Session Mode:</strong> Profile is currently customized for this session (not permanently saved to database).</span>
                </div>
                <button 
                  type="button" 
                  className="session-reset-btn"
                  onClick={handleResetToDefault}
                  title="Restore original profile details"
                >
                  <RefreshCw size={12} />
                  <span>Reset to M. L. S. V. Aiswarya</span>
                </button>
              </div>
            )}

            {/* Profile Core Information */}
            <div className="profile-info-block">
              <div className="profile-name-row">
                <h1 className="profile-display-name">
                  {user?.name || DEFAULT_PROFILE.name}
                </h1>
                <button 
                  type="button" 
                  className="profile-quick-edit-pencil" 
                  onClick={handleOpenEdit}
                  title="Quick change display name (session only)"
                  aria-label="Edit name"
                >
                  <Edit3 size={16} />
                </button>
                <span className="profile-handle">{user?.handle || "@aiswarya_mlsv"}</span>
                <span className="profile-verified-badge" title="Verified Engineering Fellow">
                  <CheckCircle2 size={16} />
                </span>
              </div>

              <div className="profile-headline-title">
                {user?.title || DEFAULT_PROFILE.title}
              </div>

              <p className="profile-bio-text">
                {user?.bio || DEFAULT_PROFILE.bio}
              </p>

              {/* Meta details bar */}
              <div className="profile-meta-chips">
                <div className="meta-chip">
                  <MapPin size={14} className="meta-icon-pin" />
                  <span>{user?.location || DEFAULT_PROFILE.location}</span>
                  <span className="meta-timezone-pill">IST (UTC+5:30)</span>
                </div>

                <div className="meta-chip">
                  <Briefcase size={14} />
                  <span>{user?.company || DEFAULT_PROFILE.company}</span>
                </div>

                <div className="meta-chip">
                  <Calendar size={14} />
                  <span>Member since {user?.memberSince || "March 2024"}</span>
                </div>

                <div className="meta-chip status-chip">
                  <span className="status-live-dot" />
                  <span>{user?.status || "Available for Consulting & Keynotes"}</span>
                </div>
              </div>

              {/* Social & Professional Connections */}
              <div className="profile-social-links-row">
                <a 
                  href={user?.socials?.github || DEFAULT_PROFILE.socials.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="profile-social-pill"
                >
                  <GitHubIcon size={15} />
                  <span>GitHub</span>
                </a>

                <a 
                  href={user?.socials?.linkedin || DEFAULT_PROFILE.socials.linkedin} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="profile-social-pill"
                >
                  <LinkedInIcon size={15} />
                  <span>LinkedIn</span>
                </a>

                <a 
                  href={user?.socials?.twitter || DEFAULT_PROFILE.socials.twitter} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="profile-social-pill"
                >
                  <XTwitterIcon size={15} />
                  <span>X / Twitter</span>
                </a>

                <a 
                  href={user?.socials?.portfolio || DEFAULT_PROFILE.socials.portfolio} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="profile-social-pill"
                >
                  <Globe size={15} />
                  <span>Portfolio</span>
                  <ExternalLink size={12} />
                </a>

                <a 
                  href={user?.socials?.devto || DEFAULT_PROFILE.socials.devto} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="profile-social-pill"
                >
                  <BookOpen size={15} />
                  <span>Dev.to</span>
                </a>

                <a 
                  href={`mailto:${user?.email || DEFAULT_PROFILE.email}`} 
                  className="profile-social-pill"
                >
                  <Mail size={15} />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              EXECUTIVE METRICS GRID
              ══════════════════════════════════════════════════════════════════ */}
          <div className="profile-metrics-strip">
            {PROFILE_METRICS.map((metric, idx) => (
              <div key={idx} className="metric-strip-card">
                <div className="metric-strip-val">
                  {idx === 1 ? savedPosts.length : metric.value}{metric.suffix}
                </div>
                <div className="metric-strip-label">{metric.label}</div>
                <div className="metric-strip-desc">{metric.desc}</div>
              </div>
            ))}
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              PRIMARY TABBED PORTFOLIO NAVIGATION
              ══════════════════════════════════════════════════════════════════ */}
          <div className="profile-tabs-header">
            <div className="profile-tabs-list" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "activity"}
                className={`profile-tab-btn ${activeTab === "activity" ? "is-active" : ""}`}
                onClick={() => handleTabChange("activity")}
              >
                <Flame size={16} />
                <span>Activity &amp; Heatmap</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "posts"}
                className={`profile-tab-btn ${activeTab === "posts" ? "is-active" : ""}`}
                onClick={() => handleTabChange("posts")}
              >
                <BookOpen size={16} />
                <span>My Dispatches</span>
                <span className="tab-counter-badge">{userPosts.length + userDrafts.length}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "saved"}
                className={`profile-tab-btn ${activeTab === "saved" ? "is-active" : ""}`}
                onClick={() => handleTabChange("saved")}
              >
                <Bookmark size={16} />
                <span>Saved Architectures</span>
                <span className="tab-counter-badge">{savedPosts.length}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "notifications"}
                className={`profile-tab-btn ${activeTab === "notifications" ? "is-active" : ""}`}
                onClick={() => handleTabChange("notifications")}
              >
                <Bell size={16} />
                <span>Notifications</span>
                {unreadNotificationCount > 0 && (
                  <span className="tab-counter-badge notif-pill-badge">{unreadNotificationCount}</span>
                )}
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "skills"}
                className={`profile-tab-btn ${activeTab === "skills" ? "is-active" : ""}`}
                onClick={() => handleTabChange("skills")}
              >
                <Cpu size={16} />
                <span>Skills &amp; Tech Stack</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "experience"}
                className={`profile-tab-btn ${activeTab === "experience" ? "is-active" : ""}`}
                onClick={() => handleTabChange("experience")}
              >
                <Briefcase size={16} />
                <span>Experience &amp; Talks</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "settings"}
                className={`profile-tab-btn ${activeTab === "settings" ? "is-active" : ""}`}
                onClick={() => handleTabChange("settings")}
              >
                <SettingsIcon size={16} />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              TAB 1: ACTIVITY & CONTRIBUTION HEATMAP
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "activity" && (
            <div className="tab-content-fade">
              {/* GitHub-style Contribution Heatmap Panel */}
              <div className="profile-section-card heatmap-card">
                <div className="heatmap-header">
                  <div>
                    <span className="section-label">
                      <Terminal size={12} />
                      ANNUAL REPOSITORY CONTRIBUTIONS
                    </span>
                    <h3 className="card-subheading">1,284 Contributions in 2026</h3>
                    <p className="card-desc">
                      Continuous delivery across distributed microservices, pull request reviews, and open-source contributions.
                    </p>
                  </div>

                  <div className="heatmap-stats-pills">
                    <div className="stat-pill">
                      <span className="stat-pill-label">Longest Streak</span>
                      <span className="stat-pill-val">34 Days</span>
                    </div>
                    <div className="stat-pill">
                      <span className="stat-pill-label">Current Streak</span>
                      <span className="stat-pill-val">12 Days</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Heatmap Matrix */}
                <div className="heatmap-container-outer">
                  {/* Month header row */}
                  <div className="heatmap-months-row">
                    {heatmapData.monthLabels.map((m, idx) => (
                      <span 
                        key={idx} 
                        className="heatmap-month-label"
                        style={{ left: `${(m.weekIndex / 52) * 100}%` }}
                      >
                        {m.month}
                      </span>
                    ))}
                  </div>

                  {/* 52-week Grid */}
                  <div className="heatmap-scroll-area">
                    <div className="heatmap-days-legend">
                      <span>Mon</span>
                      <span>Wed</span>
                      <span>Fri</span>
                    </div>

                    <div className="heatmap-grid" role="grid" aria-label="Contribution activity">
                      {heatmapData.weeks.map((week, wIdx) => (
                        <div key={wIdx} className="heatmap-week-col">
                          {week.map((day, dIdx) => (
                            <div
                              key={dIdx}
                              className={`heatmap-cell level-${day.level}`}
                              onMouseEnter={() => setHoveredDay(day)}
                              onMouseLeave={() => setHoveredDay(null)}
                              aria-label={`${day.count} contributions on ${day.formattedDate}`}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tooltip on hover */}
                  <div className="heatmap-footer-row">
                    <div className="heatmap-tooltip-indicator">
                      {hoveredDay ? (
                        <span>
                          <strong>{hoveredDay.count} {hoveredDay.count === 1 ? "contribution" : "contributions"}</strong> on {hoveredDay.formattedDate}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)" }}>
                          Hover over any cell to view daily production commits
                        </span>
                      )}
                    </div>

                    {/* Intensity Legend */}
                    <div className="heatmap-legend">
                      <span>Less</span>
                      <span className="legend-box level-0" />
                      <span className="legend-box level-1" />
                      <span className="legend-box level-2" />
                      <span className="legend-box level-3" />
                      <span className="legend-box level-4" />
                      <span>More</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Timeline Stream */}
              <div className="profile-section-card" style={{ marginTop: "24px" }}>
                <span className="section-label">
                  <Flame size={12} />
                  DEVELOPER TIMELINE
                </span>
                <h3 className="card-subheading">Recent Engineering &amp; Community Activity</h3>
                <p className="card-desc">
                  Chronological dispatch of architectural commits, published whitepapers, and conference milestones.
                </p>

                <div className="activity-timeline-list">
                  {ACTIVITY_FEED.map((act) => (
                    <div key={act.id} className="activity-timeline-item">
                      <div className="timeline-badge-node" style={{ backgroundColor: act.badgeColor }}>
                        {act.type === "commit" && <GitCommit size={14} />}
                        {act.type === "publish" && <BookOpen size={14} />}
                        {act.type === "talk" && <Mic size={14} />}
                        {act.type === "pr" && <GitPullRequest size={14} />}
                        {act.type === "bookmark" && <Bookmark size={14} />}
                        {act.type === "credential" && <Award size={14} />}
                      </div>

                      <div className="activity-timeline-content">
                        <div className="activity-top-row">
                          <span className="activity-tag-pill" style={{ borderColor: act.badgeColor, color: act.badgeColor }}>
                            {act.badge}
                          </span>
                          <span className="activity-time">{act.timestamp}</span>
                        </div>

                        <h4 className="activity-title">{act.title}</h4>
                        <p className="activity-desc">{act.description}</p>

                        {act.repo && (
                          <div className="activity-meta-repo">
                            <Code size={13} />
                            <code>{act.repo}</code>
                            {act.hash && <span className="activity-commit-hash">#{act.hash}</span>}
                          </div>
                        )}

                        {act.articleId && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm activity-view-btn"
                            onClick={() => {
                              const art = PUBLISHED_POSTS.find(p => p.id === act.articleId);
                              if (art) openArticleReader(art);
                            }}
                          >
                            <span>Read Published Dispatch</span>
                            <ArrowRight size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 2: MY DISPATCHES & DRAFTS (§19 Requirement)
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "posts" && (
            <div className="tab-content-fade">
              {/* Search & Filter & Create Action Bar */}
              <div className="profile-section-card" style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                  <div>
                    <span className="section-label">ORIGINAL WRITING</span>
                    <h3 className="card-subheading">Authored Dispatches &amp; Revisions</h3>
                    <p className="card-desc">Production-proven patterns, distributed systems case studies, and ongoing technical drafts.</p>
                  </div>

                  <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                    <div className="post-search-box">
                      <Search size={16} className="post-search-icon" />
                      <input
                        type="text"
                        placeholder="Search dispatches, tags..."
                        value={postSearch}
                        onChange={(e) => setPostSearch(e.target.value)}
                        className="form-input post-search-input"
                      />
                    </div>

                    <Link to="/create-post" className="btn btn-primary btn-sm">
                      <Plus size={15} />
                      <span>Create Dispatch</span>
                    </Link>
                  </div>
                </div>

                {/* Sub-tabs: Published vs Drafts */}
                <div className="posts-subtab-bar" style={{ marginTop: "20px", display: "flex", gap: "10px", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${postsSubTab === "published" ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => setPostsSubTab("published")}
                  >
                    <span>Published Dispatches</span>
                    <span style={{ opacity: 0.8, fontSize: "0.75rem" }}>({userPosts.length})</span>
                  </button>

                  <button
                    type="button"
                    className={`btn btn-sm ${postsSubTab === "drafts" ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => setPostsSubTab("drafts")}
                  >
                    <span>Drafts &amp; Work in Progress</span>
                    <span style={{ opacity: 0.8, fontSize: "0.75rem" }}>({userDrafts.length})</span>
                  </button>
                </div>
              </div>

              {/* Grid of Posts */}
              <div className="profile-posts-grid">
                {filteredPosts.map((post) => (
                  <article key={post.id} className="profile-post-card">
                    <div className="post-card-header">
                      <span className="post-category-tag">{post.category}</span>
                      
                      {/* Post Status Badge (§19 Requirement) */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className={`post-status-pill ${post.status === "Draft" ? "status-draft" : post.status === "Under Review" ? "status-review" : "status-published"}`}>
                          {post.status || "Published"}
                        </span>
                        <span className="post-date-text">{post.date || post.lastModified}</span>
                      </div>
                    </div>

                    <h3 className="post-card-title">{post.title}</h3>
                    <p className="post-card-excerpt">{post.excerpt}</p>

                    {/* Tag list */}
                    <div className="post-tags-wrap">
                      {(post.tags || []).map((t, idx) => (
                        <span key={idx} className="post-topic-tag">#{t}</span>
                      ))}
                    </div>

                    <div className="post-card-footer">
                      <div className="post-engagement-meta">
                        <span className="meta-read-time">
                          <Clock size={12} />
                          {post.readingTime}
                        </span>
                        {postsSubTab === "published" && (
                          <>
                            <span>•</span>
                            <span className="meta-views" title="Total Views">
                              <Eye size={12} />
                              {post.views || "1.2k"}
                            </span>
                            <span>•</span>
                            <span className="meta-likes" title="Community Claps">
                              <ThumbsUp size={12} />
                              {post.likes || 42}
                            </span>
                          </>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: "8px" }}>
                        {postsSubTab === "drafts" ? (
                          <>
                            <Link
                              to="/create-post"
                              className="btn btn-secondary btn-sm"
                              title="Edit this draft"
                            >
                              <Edit3 size={14} />
                              <span>Edit</span>
                            </Link>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => deletePost(post.id, true)}
                              title="Delete Draft"
                              style={{ color: "#EF4444" }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => toggleSavePost(post)}
                              title="Bookmark this post"
                            >
                              <Bookmark size={14} />
                            </button>
                            <Link
                              to={`/posts/${post.id}`}
                              className="btn btn-primary btn-sm"
                            >
                              <span>Read</span>
                              <ArrowRight size={13} />
                            </Link>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => deletePost(post.id, false)}
                              title="Delete Dispatch"
                              style={{ color: "#EF4444" }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="profile-empty-state">
                  <BookOpen size={42} style={{ opacity: 0.3 }} />
                  <h4>No {postsSubTab} dispatches found</h4>
                  <p>
                    {postsSubTab === "drafts" 
                      ? "You do not have any pending drafts. Click 'Create Dispatch' above to start writing."
                      : "Try adjusting your search keywords or publish a new dispatch."}
                  </p>
                  <Link to="/create-post" className="btn btn-primary btn-sm" style={{ marginTop: "14px" }}>
                    <Plus size={15} />
                    <span>Create New Dispatch</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 3: SAVED POSTS & ARCHITECTURES
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "saved" && (
            <div className="tab-content-fade">
              <div className="profile-section-card" style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                  <div>
                    <span className="section-label">CURATED READING LIST</span>
                    <h3 className="card-subheading">Saved Architecture Blueprints &amp; Articles</h3>
                    <p className="card-desc">
                      Bookmarked technical papers and session summaries saved for ongoing engineering research.
                    </p>
                  </div>
                  <div className="saved-counter-pill">
                    <Bookmark size={14} />
                    <span>{savedPosts.length} Saved Dispatches</span>
                  </div>
                </div>
              </div>

              <div className="profile-posts-grid">
                {savedPosts.map((post) => (
                  <article key={post.id} className="profile-post-card saved-card">
                    <div className="post-card-header">
                      <span className="post-category-tag">{post.category}</span>
                      <span className="post-date-text">Saved on {post.savedOn || "Aug 2026"}</span>
                    </div>

                    <h3 className="post-card-title">{post.title}</h3>
                    <p className="post-card-excerpt">{post.excerpt}</p>

                    <div className="post-author-row">
                      <div className="post-author-info">
                        <span className="post-author-name">{post.author}</span>
                        <span className="post-author-role">{post.role}</span>
                      </div>
                    </div>

                    <div className="post-card-footer">
                      <span className="meta-read-time">
                        <Clock size={12} />
                        {post.readingTime}
                      </span>

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => toggleSavePost(post)}
                          title="Remove from saved reading list"
                          style={{ color: "#EF4444" }}
                        >
                          <Trash2 size={14} />
                          <span>Remove</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => openArticleReader(post)}
                        >
                          <span>Read</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {savedPosts.length === 0 && (
                <div className="profile-empty-state">
                  <Bookmark size={42} style={{ opacity: 0.3 }} />
                  <h4>No saved blueprints</h4>
                  <p>Bookmark technical dispatches from the Explore feed to view them here.</p>
                  <Link to="/explore" className="btn btn-primary btn-sm" style={{ marginTop: "16px" }}>
                    <span>Browse Explore Feed</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 4: SKILLS & TECH STACK MATRIX
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "skills" && (
            <div className="tab-content-fade">
              <div className="profile-section-card" style={{ marginBottom: "24px" }}>
                <span className="section-label">TECHNICAL COMPETENCIES</span>
                <h3 className="card-subheading">Core Technology Stack &amp; Architectural Mastery</h3>
                <p className="card-desc">
                  Categorized breakdown of programming languages, distributed frameworks, and cloud infrastructure used across production systems.
                </p>

                {/* Category Pill Selectors */}
                <div className="skill-category-filters">
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedSkillCategory === "All" ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => setSelectedSkillCategory("All")}
                  >
                    All Disciplines
                  </button>
                  {SKILL_CATEGORIES.map((cat, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`btn btn-sm ${selectedSkillCategory === cat.category ? "btn-primary" : "btn-secondary"}`}
                      onClick={() => setSelectedSkillCategory(cat.category)}
                    >
                      {cat.category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="skills-domains-grid">
                {SKILL_CATEGORIES.filter(cat => selectedSkillCategory === "All" || selectedSkillCategory === cat.category).map((cat, idx) => (
                  <div key={idx} className="skill-domain-card">
                    <div className="domain-card-header">
                      <div className="domain-accent-dot" style={{ backgroundColor: cat.color }} />
                      <h4 className="domain-title">{cat.category}</h4>
                    </div>

                    <div className="domain-skills-wrap">
                      {cat.skills.map((s, sIdx) => (
                        <div key={sIdx} className="skill-matrix-pill">
                          <div className="skill-pill-top">
                            <span className="skill-name">{s.name}</span>
                            <span className={`skill-level-badge level-${s.level.toLowerCase()}`}>
                              {s.level}
                            </span>
                          </div>
                          <div className="skill-pill-bottom">
                            <span className="skill-years">{s.years} exp</span>
                            <div className="skill-bar-track">
                              <div 
                                className="skill-bar-fill" 
                                style={{ 
                                  backgroundColor: cat.color,
                                  width: s.level === "Expert" ? "95%" : s.level === "Advanced" ? "82%" : "65%"
                                }} 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 5: CAREER EXPERIENCE & SPEAKING ENGAGEMENTS
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "experience" && (
            <div className="tab-content-fade">
              {/* Career Timeline */}
              <div className="profile-section-card">
                <span className="section-label">ENGINEERING LEADERSHIP</span>
                <h3 className="card-subheading">Professional Career Journey</h3>
                <p className="card-desc">Demonstrated enterprise impact across high-growth technology ventures.</p>

                <div className="career-timeline-wrapper">
                  {CAREER_TIMELINE.map((item, idx) => (
                    <div key={idx} className="career-timeline-card">
                      <div className="career-period-badge">{item.period}</div>
                      <div className="career-card-content">
                        <h4 className="career-role">{item.role}</h4>
                        <div className="career-company-row">
                          <span className="career-company">{item.company}</span>
                          <span>•</span>
                          <span className="career-loc">{item.location}</span>
                        </div>
                        <ul className="career-highlights-list">
                          {item.highlights.map((h, hIdx) => (
                            <li key={hIdx}>{h}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Speaking Engagements */}
              <div className="profile-section-card" style={{ marginTop: "24px" }}>
                <span className="section-label">TECHTALK STAGES</span>
                <h3 className="card-subheading">Conference Talks &amp; Masterclasses</h3>
                <p className="card-desc">Keynote addresses and technical workshops presented to engineering audiences.</p>

                <div className="speaking-grid">
                  {SPEAKING_ENGAGEMENTS.map((spk, idx) => (
                    <div key={idx} className="speaking-card">
                      <div className="speaking-tag-pill">{spk.tag}</div>
                      <h4 className="speaking-topic">{spk.topic}</h4>
                      <div className="speaking-event-name">{spk.event}</div>
                      <div className="speaking-meta-row">
                        <span>{spk.date}</span>
                        <span>•</span>
                        <span>{spk.attendees}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 6: NOTIFICATIONS (§19 Requirement)
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "notifications" && (
            <div className="tab-content-fade">
              {/* Notifications Header Card */}
              <div className="profile-section-card" style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                  <div>
                    <span className="section-label">
                      <Bell size={12} />
                      ECOSYSTEM ACTIVITY
                    </span>
                    <h3 className="card-subheading">Community Notifications &amp; Alerts</h3>
                    <p className="card-desc">
                      Real-time updates on discussions, reactions to your architectural dispatches, follower alerts, and pass verifications.
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    {unreadNotificationCount > 0 && (
                      <span className="notif-unread-count-pill">
                        {unreadNotificationCount} Unread
                      </span>
                    )}
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={markAllNotificationsRead}
                    >
                      <CheckCheck size={14} />
                      <span>Mark All Read</span>
                    </button>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="notif-filters-strip" style={{ marginTop: "18px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${notifFilter === "all" ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => setNotifFilter("all")}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${notifFilter === "comment" ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => setNotifFilter("comment")}
                  >
                    Comments
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${notifFilter === "reaction" ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => setNotifFilter("reaction")}
                  >
                    Reactions
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${notifFilter === "pass" ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => setNotifFilter("pass")}
                  >
                    Passes &amp; Tickets
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${notifFilter === "event" ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => setNotifFilter("event")}
                  >
                    Event Updates
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${notifFilter === "follower" ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => setNotifFilter("follower")}
                  >
                    Followers
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="notifications-stream-list">
                {notifications
                  .filter((n) => notifFilter === "all" || n.type === notifFilter)
                  .map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`notification-item-card ${!notif.read ? "is-unread" : ""}`}
                      onClick={() => {
                        if (!notif.read) markNotificationRead(notif.id);
                        if (notif.targetLink) navigate(notif.targetLink);
                      }}
                    >
                      <div className="notif-avatar-col">
                        <img 
                          src={notif.actor?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"} 
                          alt={notif.actor?.name || "Member"} 
                          className="notif-avatar-img"
                        />
                        <span className={`notif-type-icon-badge badge-${notif.type}`}>
                          {notif.type === "comment" && <MessageSquare size={11} />}
                          {notif.type === "reaction" && <Heart size={11} />}
                          {notif.type === "pass" && <Ticket size={11} />}
                          {notif.type === "follower" && <User size={11} />}
                          {notif.type === "event" && <Calendar size={11} />}
                        </span>
                      </div>

                      <div className="notif-content-col">
                        <div className="notif-top-row">
                          <div className="notif-meta-left">
                            <span className="notif-actor-name">{notif.actor?.name}</span>
                            <span className="notif-badge-pill">{notif.badge}</span>
                          </div>
                          <span className="notif-time-ago">{notif.time}</span>
                        </div>

                        <h4 className="notif-title-text">{notif.title}</h4>
                        <p className="notif-desc-text">{notif.description}</p>

                        <div className="notif-actions-bottom">
                          {notif.targetLink && (
                            <Link 
                              to={notif.targetLink} 
                              className="notif-target-link"
                              onClick={(e) => {
                                e.stopPropagation();
                                markNotificationRead(notif.id);
                              }}
                            >
                              <span>View details</span>
                              <ChevronRight size={13} />
                            </Link>
                          )}

                          {!notif.read && (
                            <button
                              type="button"
                              className="btn-mark-read-pill"
                              onClick={(e) => {
                                e.stopPropagation();
                                markNotificationRead(notif.id);
                              }}
                            >
                              <Check size={12} />
                              <span>Mark Read</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {!notif.read && (
                        <div className="notif-unread-dot" title="Unread notification" />
                      )}
                    </div>
                  ))}
              </div>

              {notifications.filter((n) => notifFilter === "all" || n.type === notifFilter).length === 0 && (
                <div className="profile-empty-state">
                  <Bell size={42} style={{ opacity: 0.3 }} />
                  <h4>No {notifFilter} notifications</h4>
                  <p>You are all caught up with your TechTalk notifications.</p>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 7: SETTINGS (§19 Requirement)
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "settings" && (
            <div className="tab-content-fade">
              {/* Settings Layout with Vertical Nav and Content Panel */}
              <div className="settings-page-grid">
                {/* Left Settings Sidebar Nav */}
                <div className="settings-sidebar-nav">
                  <button
                    type="button"
                    className={`settings-nav-item ${settingsSection === "profile" ? "is-active" : ""}`}
                    onClick={() => setSettingsSection("profile")}
                  >
                    <User size={16} />
                    <span>Profile Identity</span>
                  </button>

                  <button
                    type="button"
                    className={`settings-nav-item ${settingsSection === "account" ? "is-active" : ""}`}
                    onClick={() => setSettingsSection("account")}
                  >
                    <Mail size={16} />
                    <span>Account &amp; Handle</span>
                  </button>

                  <button
                    type="button"
                    className={`settings-nav-item ${settingsSection === "notifications" ? "is-active" : ""}`}
                    onClick={() => setSettingsSection("notifications")}
                  >
                    <Bell size={16} />
                    <span>Notification Preferences</span>
                  </button>

                  <button
                    type="button"
                    className={`settings-nav-item ${settingsSection === "privacy" ? "is-active" : ""}`}
                    onClick={() => setSettingsSection("privacy")}
                  >
                    <Shield size={16} />
                    <span>Privacy &amp; Visibility</span>
                  </button>

                  <button
                    type="button"
                    className={`settings-nav-item ${settingsSection === "security" ? "is-active" : ""}`}
                    onClick={() => setSettingsSection("security")}
                  >
                    <Lock size={16} />
                    <span>Security &amp; Password</span>
                  </button>
                </div>

                {/* Right Settings Content Form Card */}
                <div className="settings-content-card">
                  {/* 1. Profile Identity Settings */}
                  {settingsSection === "profile" && (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        updateUserProfile(formData);
                      }}
                      className="settings-form-block"
                    >
                      <div className="settings-section-header">
                        <span className="section-label">PROFILE INFORMATION</span>
                        <h3 className="card-subheading">Public Developer Profile</h3>
                        <p className="card-desc">Manage how your name, architectural role, and biography appear across TechTalk dispatches.</p>
                      </div>

                      <div className="form-field-group">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-field-group">
                        <label className="form-label">Professional Title / Headline</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-field-group">
                        <label className="form-label">Location</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                      </div>

                      <div className="form-field-group">
                        <label className="form-label">Company / Ecosystem</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                      </div>

                      <div className="form-field-group">
                        <label className="form-label">Avatar Image URL</label>
                        <input
                          type="url"
                          className="form-input"
                          value={formData.avatar}
                          onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                        />
                      </div>

                      <div className="form-field-group">
                        <label className="form-label">Professional Biography</label>
                        <textarea
                          rows={4}
                          className="form-input"
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                      </div>

                      <div className="settings-btn-row">
                        <button type="submit" className="btn btn-primary btn-sm">
                          <Check size={15} />
                          <span>Save Profile Changes</span>
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-secondary btn-sm"
                          onClick={handleResetToDefault}
                        >
                          <RefreshCw size={14} />
                          <span>Reset to Default</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* 2. Account & Credentials Settings */}
                  {settingsSection === "account" && (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        updateUserProfile({ email: accountEmail, handle: accountHandle, timezone: accountTimezone });
                        showToast("✓ Account credentials updated.");
                      }}
                      className="settings-form-block"
                    >
                      <div className="settings-section-header">
                        <span className="section-label">ACCOUNT CREDENTIALS</span>
                        <h3 className="card-subheading">Primary Account Settings</h3>
                        <p className="card-desc">Configure your registered login email, developer username, and regional timezone.</p>
                      </div>

                      <div className="form-field-group">
                        <label className="form-label">Registered Email Address</label>
                        <input
                          type="email"
                          className="form-input"
                          value={accountEmail}
                          onChange={(e) => setAccountEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-field-group">
                        <label className="form-label">Developer Handle / Username</label>
                        <input
                          type="text"
                          className="form-input"
                          value={accountHandle}
                          onChange={(e) => setAccountHandle(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-field-group">
                        <label className="form-label">Primary Time Zone</label>
                        <select
                          className="form-input form-select"
                          value={accountTimezone}
                          onChange={(e) => setAccountTimezone(e.target.value)}
                        >
                          <option value="IST (UTC+5:30)">IST (UTC+5:30) — India Standard Time</option>
                          <option value="UTC (UTC+0:00)">UTC (UTC+0:00) — Coordinated Universal Time</option>
                          <option value="PST (UTC-8:00)">PST (UTC-8:00) — Pacific Standard Time</option>
                          <option value="EST (UTC-5:00)">EST (UTC-5:00) — Eastern Standard Time</option>
                          <option value="SGT (UTC+8:00)">SGT (UTC+8:00) — Singapore Time</option>
                        </select>
                      </div>

                      <div className="settings-btn-row">
                        <button type="submit" className="btn btn-primary btn-sm">
                          <Check size={15} />
                          <span>Save Account Settings</span>
                        </button>
                      </div>

                      {/* Active Session Sign-Out Box */}
                      <div className="settings-session-box" style={{ marginTop: "32px", padding: "22px", borderRadius: "14px", background: "rgba(239, 68, 68, 0.04)", border: "1px solid rgba(239, 68, 68, 0.22)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                          <div>
                            <strong style={{ color: "#EF4444", fontSize: "0.9375rem", display: "flex", alignItems: "center", gap: "8px" }}>
                              <LogOut size={16} /> Active Session &amp; Sign Out
                            </strong>
                            <p style={{ margin: "6px 0 0", fontSize: "0.8125rem", color: "var(--text-secondary)", maxWidth: "480px" }}>
                              Terminates your active session on this browser. You can securely log back in at any time with your credentials.
                            </p>
                          </div>
                          <button 
                            type="button" 
                            className="btn btn-sm"
                            style={{ background: "#EF4444", color: "#FFFFFF", border: "none", fontWeight: 700, padding: "8px 18px", borderRadius: "8px", display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
                            onClick={() => {
                              logout();
                              navigate("/");
                            }}
                            id="btn-account-settings-logout"
                          >
                            <LogOut size={14} />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* 3. Notification Preferences Settings */}
                  {settingsSection === "notifications" && (
                    <div className="settings-form-block">
                      <div className="settings-section-header">
                        <span className="section-label">COMMUNICATION PREFERENCES</span>
                        <h3 className="card-subheading">Notification Preferences</h3>
                        <p className="card-desc">Control what alerts you receive via email, web push, and weekly digests.</p>
                      </div>

                      <div className="settings-toggle-list">
                        <div className="settings-toggle-item">
                          <div>
                            <strong>Email Dispatches &amp; Summaries</strong>
                            <p>Receive curated architectural case studies and community whitepapers weekly.</p>
                          </div>
                          <button
                            type="button"
                            className={`toggle-switch-btn ${notifPrefs.emailNotifs ? "is-on" : ""}`}
                            onClick={() => {
                              setNotifPrefs({ ...notifPrefs, emailNotifs: !notifPrefs.emailNotifs });
                              showToast(`Email notifications ${!notifPrefs.emailNotifs ? "enabled" : "disabled"}.`);
                            }}
                          >
                            <span className="switch-slider" />
                          </button>
                        </div>

                        <div className="settings-toggle-item">
                          <div>
                            <strong>Push Notifications for Discussion Comments</strong>
                            <p>Instant alerts when an architect replies to your technical dispatches.</p>
                          </div>
                          <button
                            type="button"
                            className={`toggle-switch-btn ${notifPrefs.pushNotifs ? "is-on" : ""}`}
                            onClick={() => {
                              setNotifPrefs({ ...notifPrefs, pushNotifs: !notifPrefs.pushNotifs });
                              showToast(`Push notifications ${!notifPrefs.pushNotifs ? "enabled" : "disabled"}.`);
                            }}
                          >
                            <span className="switch-slider" />
                          </button>
                        </div>

                        <div className="settings-toggle-item">
                          <div>
                            <strong>Weekly Architecture Digest</strong>
                            <p>A weekly roundup of top trending microservices patterns and summit videos.</p>
                          </div>
                          <button
                            type="button"
                            className={`toggle-switch-btn ${notifPrefs.weeklyDigest ? "is-on" : ""}`}
                            onClick={() => {
                              setNotifPrefs({ ...notifPrefs, weeklyDigest: !notifPrefs.weeklyDigest });
                              showToast(`Weekly digest ${!notifPrefs.weeklyDigest ? "enabled" : "disabled"}.`);
                            }}
                          >
                            <span className="switch-slider" />
                          </button>
                        </div>

                        <div className="settings-toggle-item">
                          <div>
                            <strong>TechTalk Summit &amp; Pass Verification Alerts</strong>
                            <p>Critical updates on your registered Student, Founder, or Delegation passes.</p>
                          </div>
                          <button
                            type="button"
                            className={`toggle-switch-btn ${notifPrefs.eventAnnouncements ? "is-on" : ""}`}
                            onClick={() => {
                              setNotifPrefs({ ...notifPrefs, eventAnnouncements: !notifPrefs.eventAnnouncements });
                              showToast(`Event alerts ${!notifPrefs.eventAnnouncements ? "enabled" : "disabled"}.`);
                            }}
                          >
                            <span className="switch-slider" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. Privacy & Visibility Settings */}
                  {settingsSection === "privacy" && (
                    <div className="settings-form-block">
                      <div className="settings-section-header">
                        <span className="section-label">DATA &amp; VISIBILITY</span>
                        <h3 className="card-subheading">Privacy &amp; Community Visibility</h3>
                        <p className="card-desc">Manage your public presence, contribution heatmap visibility, and profile discovery.</p>
                      </div>

                      <div className="settings-toggle-list">
                        <div className="settings-toggle-item">
                          <div>
                            <strong>Public Technology Profile</strong>
                            <p>Allow other developers and founders to find your profile and read your dispatches.</p>
                          </div>
                          <button
                            type="button"
                            className={`toggle-switch-btn ${privacyPrefs.publicProfile ? "is-on" : ""}`}
                            onClick={() => {
                              setPrivacyPrefs({ ...privacyPrefs, publicProfile: !privacyPrefs.publicProfile });
                              showToast(`Public profile ${!privacyPrefs.publicProfile ? "enabled" : "hidden"}.`);
                            }}
                          >
                            <span className="switch-slider" />
                          </button>
                        </div>

                        <div className="settings-toggle-item">
                          <div>
                            <strong>Show Contribution Heatmap</strong>
                            <p>Display your 52-week repository commit heatmap and activity stream publicly.</p>
                          </div>
                          <button
                            type="button"
                            className={`toggle-switch-btn ${privacyPrefs.showActivity ? "is-on" : ""}`}
                            onClick={() => {
                              setPrivacyPrefs({ ...privacyPrefs, showActivity: !privacyPrefs.showActivity });
                              showToast(`Activity heatmap ${!privacyPrefs.showActivity ? "visible" : "hidden"}.`);
                            }}
                          >
                            <span className="switch-slider" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. Security & Password Settings */}
                  {settingsSection === "security" && (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (passwords.newPass !== passwords.confirmPass) {
                          showToast("⚠️ New passwords do not match.");
                          return;
                        }
                        if (passwords.newPass.length < 8) {
                          showToast("⚠️ Password must be at least 8 characters.");
                          return;
                        }
                        showToast("✓ Password updated successfully.");
                        setPasswords({ current: "", newPass: "", confirmPass: "" });
                      }}
                      className="settings-form-block"
                    >
                      <div className="settings-section-header">
                        <span className="section-label">ACCOUNT SECURITY</span>
                        <h3 className="card-subheading">Change Password &amp; Credentials</h3>
                        <p className="card-desc">Ensure your account is using a secure, strong password with at least 8 characters.</p>
                      </div>

                      <div className="form-field-group">
                        <label className="form-label">Current Password</label>
                        <input
                          type="password"
                          className="form-input"
                          placeholder="Enter current password"
                          value={passwords.current}
                          onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-field-group">
                        <label className="form-label">New Password</label>
                        <input
                          type="password"
                          className="form-input"
                          placeholder="Minimum 8 characters"
                          value={passwords.newPass}
                          onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-field-group">
                        <label className="form-label">Confirm New Password</label>
                        <input
                          type="password"
                          className="form-input"
                          placeholder="Re-enter new password"
                          value={passwords.confirmPass}
                          onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                          required
                        />
                      </div>

                      <div className="settings-btn-row">
                        <button type="submit" className="btn btn-primary btn-sm">
                          <Lock size={14} />
                          <span>Update Security Password</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          IN-SESSION NAME & PROFILE EDIT MODAL (NON-PERMANENT SESSION MODE)
          ══════════════════════════════════════════════════════════════════ */}
      {editModalOpen && (
        <div className="modal-backdrop-overlay" onClick={() => setEditModalOpen(false)}>
          <div 
            className="modal-content-card profile-edit-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="modal-title-profile-edit"
          >
            <button 
              type="button" 
              className="modal-close-btn" 
              onClick={() => setEditModalOpen(false)}
              aria-label="Close edit modal"
            >
              <X size={18} />
            </button>

            <div className="modal-header-block">
              <span className="section-label">
                <Sparkles size={13} />
                IN-MEMORY SESSION EDIT
              </span>
              <h3 id="modal-title-profile-edit" style={{ fontSize: "1.5rem", fontWeight: 800, marginTop: "6px" }}>
                Customize Technology Profile
              </h3>
              <div className="session-notice-alert">
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <Sparkles size={16} style={{ color: "#F97316", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <strong>Temporary In-Session Mode:</strong> You can freely change your name, title, bio, and location for testing. Changes update everywhere across the platform immediately, and will not permanently overwrite any remote database.
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveEdit}>
              {/* Full Name Input (Specific User Requirement) */}
              <div className="form-field-group">
                <label className="form-label">
                  <span>Display Name <span style={{ color: "#EF4444" }}>*</span></span>
                  <span className="field-hint">Access to change name in session</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. M. L. S. V. Aiswarya"
                  id="input-profile-name"
                />
              </div>

              {/* Professional Title */}
              <div className="form-field-group">
                <label className="form-label">Professional Title</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Senior Full Stack Developer & Systems Architect"
                  id="input-profile-title"
                />
              </div>

              {/* Bio */}
              <div className="form-field-group">
                <label className="form-label">Professional Bio</label>
                <textarea
                  rows={3}
                  className="form-input"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="e.g. Full stack developer specializing in modern web applications..."
                  id="textarea-profile-bio"
                />
              </div>

              {/* Location */}
              <div className="form-field-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Bhimavaram, Andhra Pradesh, India"
                  id="input-profile-location"
                />
              </div>

              {/* Company & Role */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-field-group">
                  <label className="form-label">Role</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>
                <div className="form-field-group">
                  <label className="form-label">Company / Ecosystem</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
              </div>

              {/* Avatar URL option */}
              <div className="form-field-group">
                <label className="form-label">Avatar Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleResetToDefault}
                >
                  <RefreshCw size={13} />
                  <span>Reset to Default</span>
                </button>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    id="btn-save-profile-session"
                  >
                    <Check size={14} />
                    <span>Apply to Session</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
