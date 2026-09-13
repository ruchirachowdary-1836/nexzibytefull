import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  User, MapPin, Briefcase, Calendar, Mail, Globe,
  Sparkles, ShieldCheck, CheckCircle2, Award, Bookmark, BookOpen, Clock,
  ArrowRight, ExternalLink, Edit3, Share2, Ticket, Terminal, Cpu, Database,
  Cloud, Code, Layers, GitCommit, GitPullRequest, Mic, Search, X, RefreshCw,
  Flame, Check, Eye, ThumbsUp, Trash2
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

export default function UserProfilePage() {
  const { 
    user, 
    updateUserProfile, 
    resetUserProfile, 
    savedPosts, 
    toggleSavePost, 
    openArticleReader,
    openPassModal,
    showToast 
  } = useApp();

  // Active Tab state: 'activity' | 'posts' | 'saved' | 'skills' | 'experience'
  const [activeTab, setActiveTab] = useState("activity");

  // In-session Profile Editor Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    title: user?.professional_role || "",
    bio: user?.bio || "",
    location: user?.location || "",
    role: user?.professional_role || "",
    company: "",
    avatar: user?.profile_image || "",
    website: user?.website || "",
    linkedin_url: user?.linkedin_url || "",
    github_url: user?.github_url || "",
    twitter_url: user?.twitter_url || "",
    devto_url: user?.devto_url || ""
  });

  // Filter & Search states
  const [postSearch, setPostSearch] = useState("");
  const [selectedSkillCategory, setSelectedSkillCategory] = useState("All");

  // Contribution Heatmap Data (Memoized 52 weeks)
  const heatmapData = useMemo(() => ({ weeks: [], monthLabels: [] }), []);
  const [hoveredDay, setHoveredDay] = useState(null);
  const profilePosts = user?.posts || [];
  const activityFeed = [];
  const careerTimeline = [];
  const speakingEngagements = [];
  const normalizedSkills = Array.isArray(user?.skills)
    ? user.skills
    : typeof user?.skills === "string"
      ? user.skills.split(",")
      : [];
  const profileSkillCategories = normalizedSkills.length
    ? [{
        category: "Skills",
        color: "#2563EB",
        skills: normalizedSkills
          .map((skill) => typeof skill === "string" ? skill.trim() : skill?.name)
          .filter(Boolean)
          .map((name) => ({ name, level: "Added by user", years: "" }))
      }]
    : [];
  const profileMetrics = [
    { label: "Published Dispatches", value: user?.activity?.posts_count || 0, suffix: "", desc: "Posts published from this account" },
    { label: "Saved Architectures", value: savedPosts.length, suffix: "", desc: "Saved items in this session" },
    { label: "Annual Contributions", value: "—", suffix: "", desc: "Verified repository activity only" },
    { label: "Event Registrations", value: user?.activity?.registrations_count || 0, suffix: "", desc: "Registrations stored for this account" }
  ];

  // Check if current user details deviate from default (indicating active session edits)
  // Open Edit Modal with current values
  const handleOpenEdit = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      title: user?.professional_role || "",
      bio: user?.bio || "",
      location: user?.location || "",
      role: user?.professional_role || "",
      company: "",
      avatar: user?.profile_image || ""
      ,website: user?.website || "",
      linkedin_url: user?.linkedin_url || "",
      github_url: user?.github_url || "",
      twitter_url: user?.twitter_url || "",
      devto_url: user?.devto_url || ""
    });
    setEditModalOpen(true);
  };

  // Submit in-session changes
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    try {
      await updateUserProfile(formData);
      setEditModalOpen(false);
    } catch (error) {
      showToast(error.message || "Unable to save your profile.");
    }
  };

  const handleResetToDefault = () => {
    resetUserProfile();
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

  // Filter published posts
  const filteredPosts = profilePosts.filter(p => {
    const q = postSearch.toLowerCase();
    return !q || 
      p.title.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) || 
      p.tags.some(t => t.toLowerCase().includes(q));
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
            {user?.passId && (
              <span className="profile-badge-pill id-code">
                <Terminal size={12} />
                <span>ID: {user.passId}</span>
              </span>
            )}
          </div>
        </div>

        <div className="container">
          <div className="profile-identity-card">
            <div className="profile-identity-top">
              {/* Avatar with Status Ring */}
              <div className="profile-avatar-wrapper">
                <img 
                  src={user?.profile_image || undefined}
                  alt={user?.name || "Nexzibyte TechTalk"}
                  className="profile-avatar-img"
                  onError={(e) => {
                    // Fallback to stylized initials if image link breaks
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="profile-avatar-fallback" style={{ display: "none" }}>
                  {(user?.name || "?").split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                {user && <div className="profile-status-indicator" title={user.is_active ? "Active account" : "Inactive account"} />}
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
              </div>
            </div>

            {/* In-Session Edit Indicator Banner */}
            {/* Profile Core Information */}
            <div className="profile-info-block">
              <div className="profile-name-row">
                <h1 className="profile-display-name">
                  {user?.name || "Your profile"}
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
                {user?.handle && <span className="profile-handle">{user.handle}</span>}
              </div>

              <div className="profile-headline-title">
                {user?.professional_role || "Add your professional role"}
              </div>

              <p className="profile-bio-text">
                {user?.bio || "Add a short bio to introduce yourself."}
              </p>

              {/* Meta details bar */}
              <div className="profile-meta-chips">
                <div className="meta-chip">
                  <MapPin size={14} className="meta-icon-pin" />
                  <span>{user?.location || "Add your location"}</span>
                  <span className="meta-timezone-pill">IST (UTC+5:30)</span>
                </div>

                <div className="meta-chip">
                  <Briefcase size={14} />
                  <span>{user?.professional_role || "Add your role"}</span>
                </div>

                <div className="meta-chip">
                  <Calendar size={14} />
                  <span>Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Today"}</span>
                </div>

                <div className="meta-chip status-chip">
                  <span className="status-live-dot" />
                  <span>{user?.is_active ? "Account active" : "Account inactive"}</span>
                </div>
              </div>

              {/* Social & Professional Connections */}
              <div className="profile-social-links-row">
                {[
                  [user?.github_url, "GitHub", GitHubIcon],
                  [user?.linkedin_url, "LinkedIn", LinkedInIcon],
                  [user?.twitter_url, "X / Twitter", XTwitterIcon],
                  [user?.website, "Portfolio", Globe],
                  [user?.devto_url, "Dev.to", BookOpen],
                  [user?.email && `mailto:${user.email}`, "Email", Mail]
                ].filter(([href]) => href).map(([href, label, Icon]) => (
                  <a key={label} href={href} target={label === "Email" ? undefined : "_blank"} rel={label === "Email" ? undefined : "noreferrer"} className="profile-social-pill">
                    <Icon size={15} />
                    <span>{label}</span>
                    {label !== "Email" && <ExternalLink size={12} />}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              EXECUTIVE METRICS GRID
              ══════════════════════════════════════════════════════════════════ */}
          <div className="profile-metrics-strip">
            {profileMetrics.map((metric, idx) => (
              <div key={idx} className="metric-strip-card">
                <div className="metric-strip-val">
                  {metric.value}{metric.suffix}
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
                onClick={() => setActiveTab("activity")}
              >
                <Flame size={16} />
                <span>Activity &amp; Heatmap</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "posts"}
                className={`profile-tab-btn ${activeTab === "posts" ? "is-active" : ""}`}
                onClick={() => setActiveTab("posts")}
              >
                <BookOpen size={16} />
                <span>Published Dispatches</span>
                <span className="tab-counter-badge">{profilePosts.length}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "saved"}
                className={`profile-tab-btn ${activeTab === "saved" ? "is-active" : ""}`}
                onClick={() => setActiveTab("saved")}
              >
                <Bookmark size={16} />
                <span>Saved Architectures</span>
                <span className="tab-counter-badge">{savedPosts.length}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "skills"}
                className={`profile-tab-btn ${activeTab === "skills" ? "is-active" : ""}`}
                onClick={() => setActiveTab("skills")}
              >
                <Cpu size={16} />
                <span>Skills &amp; Tech Stack</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "experience"}
                className={`profile-tab-btn ${activeTab === "experience" ? "is-active" : ""}`}
                onClick={() => setActiveTab("experience")}
              >
                <Briefcase size={16} />
                <span>Experience &amp; Talks</span>
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
                    <h3 className="card-subheading">
                      {user?.github_url ? "GitHub contribution history" : "Connect GitHub to show contributions"}
                    </h3>
                    <p className="card-desc">
                      {user?.github_url
                        ? "Your verified repository activity will appear here once GitHub sync is enabled."
                        : "Add your GitHub profile in Edit Profile. No contribution numbers are shown until they can be verified."}
                    </p>
                  </div>

                  <div className="heatmap-stats-pills">
                    <div className="stat-pill">
                      <span className="stat-pill-label">Longest Streak</span>
                      <span className="stat-pill-val">—</span>
                    </div>
                    <div className="stat-pill">
                      <span className="stat-pill-label">Current Streak</span>
                      <span className="stat-pill-val">—</span>
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
                      {heatmapData.weeks.length ? heatmapData.weeks.map((week, wIdx) => (
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
                      )) : (
                        <span className="card-desc">No verified GitHub contribution data connected.</span>
                      )}
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
                          Connect GitHub to view verified daily contributions
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
                  {activityFeed.map((act) => (
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
                              const art = profilePosts.find(p => p.id === act.articleId);
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
              TAB 2: PUBLISHED POSTS (Authored by TechTalk)
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "posts" && (
            <div className="tab-content-fade">
              {/* Search & Filter Bar */}
              <div className="profile-section-card" style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                  <div>
                    <span className="section-label">ORIGINAL WRITING</span>
                    <h3 className="card-subheading">Authored Technical Dispatches</h3>
                    <p className="card-desc">Production-proven patterns, distributed systems case studies, and engineering breakdowns.</p>
                  </div>

                  <div className="post-search-box">
                    <Search size={16} className="post-search-icon" />
                    <input
                      type="text"
                      placeholder="Search authored dispatches, tags..."
                      value={postSearch}
                      onChange={(e) => setPostSearch(e.target.value)}
                      className="form-input post-search-input"
                    />
                  </div>
                </div>
              </div>

              {/* Grid of Published Posts */}
              <div className="profile-posts-grid">
                {filteredPosts.map((post) => (
                  <article key={post.id} className="profile-post-card">
                    <div className="post-card-header">
                      <span className="post-category-tag">{post.category}</span>
                      <span className="post-date-text">{post.date}</span>
                    </div>

                    <h3 className="post-card-title">{post.title}</h3>
                    <p className="post-card-excerpt">{post.excerpt}</p>

                    {/* Tag list */}
                    <div className="post-tags-wrap">
                      {post.tags.map((t, idx) => (
                        <span key={idx} className="post-topic-tag">#{t}</span>
                      ))}
                    </div>

                    <div className="post-card-footer">
                      <div className="post-engagement-meta">
                        <span className="meta-read-time">
                          <Clock size={12} />
                          {post.readingTime}
                        </span>
                        <span>•</span>
                        <span className="meta-views" title="Total Views">
                          <Eye size={12} />
                          {post.views}
                        </span>
                        <span>•</span>
                        <span className="meta-likes" title="Community Claps">
                          <ThumbsUp size={12} />
                          {post.likes}
                        </span>
                      </div>

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => toggleSavePost(post)}
                          title="Bookmark this post"
                        >
                          <Bookmark size={14} />
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

              {filteredPosts.length === 0 && (
                <div className="profile-empty-state">
                  <BookOpen size={42} style={{ opacity: 0.3 }} />
                  <h4>No dispatches found</h4>
                  <p>Try adjusting your search keywords to find published articles.</p>
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
                  {profileSkillCategories.map((cat, idx) => (
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
                {profileSkillCategories.filter(cat => selectedSkillCategory === "All" || selectedSkillCategory === cat.category).map((cat, idx) => (
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
                  {careerTimeline.map((item, idx) => (
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
                  {speakingEngagements.map((spk, idx) => (
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
                ACCOUNT PROFILE
              </span>
              <h3 id="modal-title-profile-edit" style={{ fontSize: "1.5rem", fontWeight: 800, marginTop: "6px" }}>
                Customize Technology Profile
              </h3>
              <div className="session-notice-alert">
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <Sparkles size={16} style={{ color: "#F97316", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    Changes are saved securely to your authenticated Nexzibyte account and restored whenever you sign in.
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
                  placeholder="e.g. Nexzibyte TechTalk"
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

              <div className="form-field-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                />
                <span className="field-hint">Changing this also changes the email used to sign in.</span>
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

              <div className="form-field-group">
                <label className="form-label">Professional Links</label>
                <div style={{ display: "grid", gap: "10px" }}>
                  {[
                    ["github_url", "GitHub URL", "https://github.com/username"],
                    ["linkedin_url", "LinkedIn URL", "https://linkedin.com/in/username"],
                    ["twitter_url", "X / Twitter URL", "https://x.com/username"],
                    ["website", "Portfolio URL", "https://yourportfolio.com"],
                    ["devto_url", "Dev.to URL", "https://dev.to/username"]
                  ].map(([field, label, placeholder]) => (
                    <input
                      key={field}
                      type="url"
                      className="form-input"
                      value={formData[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      placeholder={placeholder}
                      aria-label={label}
                    />
                  ))}
                </div>
                <span className="field-hint">Only links you add will appear on your public profile.</span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleResetToDefault}
                >
                  <RefreshCw size={13} />
                  <span>Sign out</span>
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
