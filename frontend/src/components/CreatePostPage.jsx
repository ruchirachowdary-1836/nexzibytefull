import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Sparkles, ArrowLeft, Send, Save, Eye, Edit3, Image as ImageIcon, 
  Tag, Clock, CheckCircle2, AlertCircle, Layers, Code, Bold, Italic, 
  List, Quote, Link2, Terminal, Info, BookOpen
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

const CATEGORY_OPTIONS = [
  "FRONTEND ENGINEERING",
  "BACKEND & CLOUD",
  "SYSTEM ARCHITECTURE",
  "DATABASE ARCHITECTURE",
  "AI / ML & DATA SCIENCE",
  "DEVOPS & CONTAINERIZATION",
  "CYBERSECURITY & NETWORKING",
  "MOBILE ARCHITECTURE"
];

const SUGGESTED_TAGS = [
  "React 19", "Node.js", "Redis", "TypeScript", "Microservices", 
  "System Design", "PostgreSQL", "Docker", "AWS", "Next.js", "Kafka"
];

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { createPost, user, showToast } = useApp();

  // Form Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80");
  
  // Tags State
  const [tags, setTags] = useState(["React 19", "System Design"]);
  const [tagInput, setTagInput] = useState("");

  // Editor View Mode: "edit" | "split" | "preview"
  const [viewMode, setViewMode] = useState("split");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-calculated reading time
  const readingTime = useMemo(() => {
    const words = (content || "").trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.ceil(words / 200));
    return `${mins} min read (${words} words)`;
  }, [content]);

  // Handle adding a tag
  const handleAddTag = (tagToAdd) => {
    const cleaned = tagToAdd.trim().replace(/^#/, "");
    if (cleaned && !tags.includes(cleaned) && tags.length < 6) {
      setTags([...tags, cleaned]);
      setTagInput("");
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Quick formatting toolbar insertion
  const insertFormatting = (prefix, suffix = "") => {
    setContent((prev) => prev + `\n${prefix}text${suffix}`);
  };

  // Save as Draft
  const handleSaveDraft = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast("⚠️ Please enter a title for your draft.");
      return;
    }

    createPost({
      title: title.trim(),
      category,
      excerpt: excerpt.trim() || title.trim(),
      content: content.trim() || "Draft content in progress...",
      tags,
      coverImage,
      status: "draft"
    });

    navigate("/profile?tab=posts");
  };

  // Publish Dispatch
  const handlePublish = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast("⚠️ Please provide a headline for your technical dispatch.");
      return;
    }
    if (!content.trim() || content.trim().length < 40) {
      showToast("⚠️ Content is too short. Please write at least a few sentences.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newPost = createPost({
        title: title.trim(),
        category,
        excerpt: excerpt.trim() || content.slice(0, 140) + "...",
        content: content.trim(),
        tags,
        coverImage,
        status: "published"
      });

      setIsSubmitting(false);
      navigate(`/posts/${newPost.id}`);
    }, 400);
  };

  return (
    <div className="create-post-page-wrapper">
      {/* Editorial Top Bar */}
      <div className="create-post-topbar">
        <div className="container">
          <div className="create-post-topbar-inner">
            <div className="topbar-left">
              <Link to="/profile?tab=posts" className="back-link-subtle">
                <ArrowLeft size={16} />
                <span>My Dispatches</span>
              </Link>
              <div className="topbar-divider" />
              <div className="topbar-title-block">
                <span className="topbar-badge">
                  <Edit3 size={13} />
                  AUTHORING STUDIO
                </span>
                <span className="topbar-title">Create Technical Dispatch</span>
              </div>
            </div>

            {/* View Mode Toggle & Action Buttons */}
            <div className="topbar-actions">
              {/* View Switcher Pills */}
              <div className="view-mode-pill-group">
                <button
                  type="button"
                  className={`view-pill-btn ${viewMode === "edit" ? "is-active" : ""}`}
                  onClick={() => setViewMode("edit")}
                  title="Editor Only"
                >
                  <Edit3 size={14} />
                  <span>Editor</span>
                </button>
                <button
                  type="button"
                  className={`view-pill-btn ${viewMode === "split" ? "is-active" : ""}`}
                  onClick={() => setViewMode("split")}
                  title="Side-by-side Live Preview"
                >
                  <Layers size={14} />
                  <span>Split View</span>
                </button>
                <button
                  type="button"
                  className={`view-pill-btn ${viewMode === "preview" ? "is-active" : ""}`}
                  onClick={() => setViewMode("preview")}
                  title="Full Reader Preview"
                >
                  <Eye size={14} />
                  <span>Preview</span>
                </button>
              </div>

              {/* Save Draft Button */}
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={handleSaveDraft}
              >
                <Save size={15} />
                <span>Save Draft</span>
              </button>

              {/* Publish Button */}
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={handlePublish}
                disabled={isSubmitting}
              >
                <Send size={15} />
                <span>{isSubmitting ? "Publishing..." : "Publish Dispatch"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Main Canvas */}
      <div className="create-post-canvas">
        <div className="container">
          <div className={`editor-view-grid view-${viewMode}`}>
            {/* ══════════════════════════════════════════════════════════════════
                LEFT PANEL: AUTHORING FORM
                ══════════════════════════════════════════════════════════════════ */}
            {(viewMode === "edit" || viewMode === "split") && (
              <div className="editor-form-panel">
                {/* Meta Configuration Strip */}
                <div className="editor-meta-config-card">
                  <div className="meta-row-two-col">
                    <div className="form-field-group">
                      <label className="form-label">Category / Domain</label>
                      <select 
                        className="form-input form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        {CATEGORY_OPTIONS.map((cat, i) => (
                          <option key={i} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-field-group">
                      <label className="form-label">Est. Read Time</label>
                      <div className="read-time-pill-box">
                        <Clock size={14} />
                        <span>{readingTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cover Image URL */}
                  <div className="form-field-group" style={{ marginTop: "12px" }}>
                    <label className="form-label">
                      <ImageIcon size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                      Cover Image URL
                    </label>
                    <input 
                      type="url" 
                      className="form-input"
                      placeholder="https://images.unsplash.com/..."
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                    />
                  </div>
                </div>

                {/* Article Headline Input */}
                <div className="editor-title-container">
                  <input 
                    type="text"
                    className="editor-headline-input"
                    placeholder="Article Headline (e.g., Scaling Microservices with Node.js & Redis...)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                  />
                </div>

                {/* Article Excerpt / Executive Summary */}
                <div className="editor-excerpt-container">
                  <textarea
                    rows={2}
                    className="editor-excerpt-input"
                    placeholder="Short summary / architectural excerpt (1-2 sentences that appear on feed cards)..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                  />
                </div>

                {/* Formatting Quick Toolbar */}
                <div className="editor-toolbar-strip">
                  <button type="button" className="toolbar-icon-btn" onClick={() => insertFormatting("**", "**")} title="Bold">
                    <Bold size={15} />
                  </button>
                  <button type="button" className="toolbar-icon-btn" onClick={() => insertFormatting("*", "*")} title="Italic">
                    <Italic size={15} />
                  </button>
                  <button type="button" className="toolbar-icon-btn" onClick={() => insertFormatting("\n## ")} title="Section Heading">
                    <span style={{ fontWeight: 800, fontSize: "0.85rem" }}>H2</span>
                  </button>
                  <button type="button" className="toolbar-icon-btn" onClick={() => insertFormatting("```javascript\n", "\n```")} title="Code Block">
                    <Code size={15} />
                  </button>
                  <button type="button" className="toolbar-icon-btn" onClick={() => insertFormatting("\n- ")} title="Bullet List">
                    <List size={15} />
                  </button>
                  <button type="button" className="toolbar-icon-btn" onClick={() => insertFormatting("\n> ")} title="Blockquote">
                    <Quote size={15} />
                  </button>
                  <button type="button" className="toolbar-icon-btn" onClick={() => insertFormatting("[link text](", ")")} title="Link">
                    <Link2 size={15} />
                  </button>
                </div>

                {/* Main Content Body Area */}
                <div className="editor-body-container">
                  <textarea
                    className="editor-textarea-main"
                    rows={16}
                    placeholder="Write your technical dispatch here... Break down system architecture, trade-offs, code snippets, and performance benchmarks."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                {/* Tags Management Box */}
                <div className="editor-tags-card">
                  <label className="form-label">
                    <Tag size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                    Architecture Tags &amp; Tech Stack (Max 6)
                  </label>
                  
                  {/* Current Active Tags */}
                  <div className="editor-tags-active-list">
                    {tags.map((tag, idx) => (
                      <span key={idx} className="editor-tag-chip">
                        #{tag}
                        <button 
                          type="button" 
                          className="tag-remove-x"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    {/* Tag input field */}
                    <input 
                      type="text"
                      placeholder="Add tag + Enter..."
                      className="tag-inline-input"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          handleAddTag(tagInput);
                        }
                      }}
                    />
                  </div>

                  {/* Quick Suggestion Chips */}
                  <div className="editor-tags-suggestions">
                    <span className="suggestion-label">Suggestions:</span>
                    {SUGGESTED_TAGS.filter(t => !tags.includes(t)).slice(0, 7).map((sugg, i) => (
                      <button 
                        key={i} 
                        type="button" 
                        className="suggestion-chip"
                        onClick={() => handleAddTag(sugg)}
                      >
                        +{sugg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                RIGHT PANEL: LIVE PREVIEW CANVAS
                ══════════════════════════════════════════════════════════════════ */}
            {(viewMode === "preview" || viewMode === "split") && (
              <div className="editor-preview-panel">
                <div className="preview-canvas-card">
                  <div className="preview-canvas-header">
                    <div className="preview-badge-status">
                      <Eye size={13} />
                      <span>LIVE DISPATCH PREVIEW</span>
                    </div>
                    <span className="preview-note">Rendering in TechTalk Reader Engine</span>
                  </div>

                  {/* Preview Article Frame */}
                  <div className="preview-article-content">
                    {/* Category & Metadata */}
                    <div className="preview-meta-row">
                      <span className="preview-category-tag">{category}</span>
                      <span>•</span>
                      <span>{readingTime}</span>
                      <span>•</span>
                      <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>

                    {/* Headline */}
                    <h1 className="preview-headline">
                      {title || "Untitled Technical Dispatch"}
                    </h1>

                    {/* Excerpt */}
                    {excerpt && (
                      <p className="preview-excerpt">
                        {excerpt}
                      </p>
                    )}

                    {/* Author Byline */}
                    <div className="preview-author-byline">
                      <img 
                        src={user?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"} 
                        alt="Author" 
                        className="preview-author-avatar"
                      />
                      <div>
                        <div className="preview-author-name">{user?.name || "Your name"}</div>
                        <div className="preview-author-role">{user?.role || "Community member"}</div>
                      </div>
                    </div>

                    {/* Cover Image */}
                    {coverImage && (
                      <div className="preview-cover-box">
                        <img src={coverImage} alt="Cover Preview" className="preview-cover-img" />
                      </div>
                    )}

                    {/* Main Content Body */}
                    <div className="preview-body-text">
                      {content ? (
                        content.split("\n\n").map((para, pIdx) => {
                          if (para.startsWith("## ")) {
                            return <h2 key={pIdx} className="preview-h2">{para.replace("## ", "")}</h2>;
                          }
                          if (para.startsWith("> ")) {
                            return (
                              <blockquote key={pIdx} className="preview-blockquote">
                                {para.replace("> ", "")}
                              </blockquote>
                            );
                          }
                          if (para.startsWith("```")) {
                            return (
                              <pre key={pIdx} className="preview-code-block">
                                <code>{para.replace(/```[a-z]*\n?/g, "")}</code>
                              </pre>
                            );
                          }
                          return <p key={pIdx}>{para}</p>;
                        })
                      ) : (
                        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                          Start typing in the editor on the left to see the live formatted dispatch preview...
                        </p>
                      )}
                    </div>

                    {/* Tags Preview */}
                    {tags.length > 0 && (
                      <div className="preview-tags-row">
                        {tags.map((t, idx) => (
                          <span key={idx} className="preview-tag-pill">#{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
