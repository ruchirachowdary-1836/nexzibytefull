import React, { useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Clock, Calendar, Bookmark, Share2, Sparkles, 
  MessageSquare, Heart, ThumbsUp, Send, CheckCircle2, User,
  CornerDownRight, Copy, Check, ChevronRight, Tag, BookOpen,
  Eye, Terminal, Award
} from "lucide-react";
import { TECHNICAL_ARTICLES } from "../data/mockData.js";
import { useApp } from "../context/AppContext.jsx";

export default function PostDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userPosts, savedPosts, toggleSavePost, user, showToast } = useApp();

  // Find article across all mock data sets
  const article = useMemo(() => {
    // 1. Check user dispatches first
    const fromUser = userPosts.find((p) => p.id === id);
    if (fromUser) return fromUser;

    // 2. Check technical articles
    const fromArticles = TECHNICAL_ARTICLES.find((a) => a.id === id);
    if (fromArticles) return fromArticles;

    // 3. Fallback to default
    return userPosts[0] || TECHNICAL_ARTICLES[0];
  }, [id, userPosts]);

  // Reactions State (Interactive claps / likes)
  const [likesCount, setLikesCount] = useState(
    typeof article.likes === "number" ? article.likes : 142
  );
  const [hasLiked, setHasLiked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Comments State (Interactive threaded discussion)
  const [comments, setComments] = useState([
    {
      id: "c-1",
      author: "Dr. Rajesh Raman",
      role: "Principal AI Scientist",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      time: "2 hours ago",
      text: "Outstanding architecture breakdown! The token-bucket rate limiter with sub-millisecond Redis cluster failover is exactly what we needed for high-throughput edge nodes.",
      likes: 14
    },
    {
      id: "c-2",
      author: "Tejaswini Gangula",
      role: "Technical Lead",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
      time: "Yesterday",
      text: "Curious how you manage data synchronization when rolling out schema migrations with zero customer downtime. Would love a follow-up deep dive on your PostgreSQL replication setup!",
      likes: 9
    }
  ]);
  const [newCommentText, setNewCommentText] = useState("");

  // Check if current article is saved
  const isSaved = savedPosts.some((p) => p.id === article.id);

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo(0, 0);
    setHasLiked(false);
    setLikesCount(typeof article.likes === "number" ? article.likes : 142);
  }, [id, article.id]);

  const handleLike = () => {
    if (hasLiked) {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
      showToast("❤️ Thank you for appreciating this technical dispatch!");
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showToast("🔗 Article link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2500);
    } else {
      showToast("Link: " + window.location.href);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment = {
      id: `c-${Date.now()}`,
      author: user?.name || "Authenticated member",
      role: user?.role || "Senior Full Stack Developer",
      avatar: user?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
      time: "Just now",
      text: newCommentText.trim(),
      likes: 1
    };

    setComments((prev) => [newComment, ...prev]);
    setNewCommentText("");
    showToast("💬 Your comment has been published to the discussion thread!");
  };

  // Related dispatches (3 items not matching current article)
  const relatedDispatches = useMemo(() => {
    const combined = [...userPosts, ...TECHNICAL_ARTICLES];
    const unique = [];
    const seen = new Set();
    for (const item of combined) {
      if (item.id !== article.id && !seen.has(item.id)) {
        seen.add(item.id);
        unique.push(item);
      }
      if (unique.length >= 3) break;
    }
    return unique;
  }, [article.id, userPosts]);

  return (
    <div className="post-details-page-wrapper">
      {/* Editorial Breadcrumb & Navigation Bar */}
      <div className="post-breadcrumbs-bar">
        <div className="container">
          <div className="breadcrumbs-inner">
            <Link to="/explore" className="breadcrumb-back-link">
              <ArrowLeft size={16} />
              <span>Back to Explore Feed</span>
            </Link>
            <div className="breadcrumb-separator">/</div>
            <span className="breadcrumb-current-cat">{article.category || "TECH DISPATCH"}</span>
            <div className="breadcrumb-separator">/</div>
            <span className="breadcrumb-current-title">{article.title.slice(0, 42)}...</span>
          </div>
        </div>
      </div>

      {/* Main Post Container */}
      <article className="post-editorial-container">
        <div className="container">
          {/* Post Header */}
          <header className="post-header-editorial">
            <div className="post-meta-top">
              <span className="post-category-pill">
                <Sparkles size={13} />
                {article.category || "ENGINEERING"}
              </span>
              <span className="post-meta-dot">•</span>
              <span className="post-reading-time">
                <Clock size={14} />
                {article.readingTime || "7 min read"}
              </span>
              <span className="post-meta-dot">•</span>
              <span className="post-publish-date">
                <Calendar size={14} />
                {article.date || "September 2026"}
              </span>
            </div>

            <h1 className="post-headline-editorial">{article.title}</h1>

            <p className="post-excerpt-editorial">{article.excerpt}</p>

            {/* Author Profile Strip */}
            <div className="post-author-editorial-bar">
              <div className="author-editorial-left">
                <img 
                  src={article.avatar || user?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"} 
                  alt={article.author}
                  className="author-editorial-avatar"
                />
                <div>
                  <div className="author-editorial-name-row">
                    <span className="author-editorial-name">{article.author}</span>
                    <span className="author-verified-badge" title="Verified TechTalk Contributor">
                      <CheckCircle2 size={13} />
                      Verified
                    </span>
                  </div>
                  <div className="author-editorial-role">{article.role || "Lead Architect"}</div>
                </div>
              </div>

              {/* Action Buttons: Save & Share */}
              <div className="post-actions-editorial">
                <button 
                  type="button" 
                  className={`btn-action-pill ${isSaved ? "is-saved" : ""}`}
                  onClick={() => toggleSavePost(article)}
                  title={isSaved ? "Remove from Bookmarks" : "Save to Reading List"}
                >
                  <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                  <span>{isSaved ? "Saved" : "Save"}</span>
                </button>

                <button 
                  type="button" 
                  className="btn-action-pill"
                  onClick={handleShare}
                  title="Share Article Link"
                >
                  {copiedLink ? <Check size={16} style={{ color: "#10B981" }} /> : <Share2 size={16} />}
                  <span>{copiedLink ? "Copied!" : "Share"}</span>
                </button>
              </div>
            </div>
          </header>

          {/* Cover Graphic Banner */}
          <div className="post-hero-banner-frame">
            <img 
              src={article.coverImage || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80"} 
              alt={article.title}
              className="post-hero-banner-img"
            />
            <div className="post-hero-banner-overlay">
              <span className="banner-badge">
                <Terminal size={14} />
                NexziByte Architectural Teardown
              </span>
            </div>
          </div>

          {/* Editorial Article Body */}
          <div className="post-body-layout">
            <div className="post-body-main">
              {/* Lead Paragraph */}
              <div className="post-body-lead">
                {article.content || "When engineering production microservices at enterprise scale, naive Express setups choke under synchronous bottleneck operations. By offloading I/O spikes into Redis cluster memory and decoupling CPU-bound processing into worker threads, we achieved sub-15ms response latency across distributed NexziByte edge nodes."}
              </div>

              {/* Architecture Highlight Box */}
              <div className="architecture-callout-card">
                <div className="callout-card-title">
                  <Sparkles size={16} style={{ color: "var(--coral)" }} />
                  <span>CORE ARCHITECTURAL TAKEAWAY</span>
                </div>
                <p>
                  Decoupling stateful request tracking from stateless worker instances via distributed Redis token buckets ensures zero single points of failure, sub-millisecond cluster failover, and linear scaling during 10x traffic surges.
                </p>
              </div>

              {/* Technical Deep Dive Paragraphs */}
              <h2 className="post-section-title">1. Concurrency Patterns &amp; Event-Loop Profiling</h2>
              <p>
                In high-throughput microservices, CPU-bound execution blocks Node.js event loops, degrading I/O operations and ballooning latency p99 metrics. By offloading cryptographic token validation and compression routines to isolated worker threads via thread pools, we maintain event-loop ticks under 4 milliseconds even during peak traffic bursts.
              </p>
              <p>
                Furthermore, adopting connection pooling with persistent keep-alive sockets eliminates TCP three-way handshake overhead for internal inter-service communication across our private cluster network.
              </p>

              {/* Code Snippet Box */}
              <div className="code-snippet-card">
                <div className="code-snippet-header">
                  <div className="code-snippet-dots">
                    <span className="dot dot-red" />
                    <span className="dot dot-yellow" />
                    <span className="dot dot-green" />
                  </div>
                  <span className="code-snippet-filename">rateLimiter.ts — Redis Token Bucket</span>
                  <button 
                    type="button" 
                    className="code-copy-btn"
                    onClick={() => showToast("Code snippet copied to clipboard!")}
                  >
                    <Copy size={13} />
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="code-snippet-pre">
{`import { Redis } from "ioredis";

export class DistributedTokenBucket {
  constructor(private redis: Redis, private capacity: number, private refillRatePerSec: number) {}

  async tryAcquire(key: string, tokens: number = 1): Promise<boolean> {
    const now = Date.now();
    const script = \`
      local current = tonumber(redis.call('get', KEYS[1]) or ARGV[1])
      if current >= tonumber(ARGV[2]) then
        redis.call('decrby', KEYS[1], ARGV[2])
        return 1
      else
        return 0
      end
    \`;
    const result = await this.redis.eval(script, 1, key, this.capacity, tokens);
    return result === 1;
  }
}`}
                </pre>
              </div>

              <h2 className="post-section-title">2. Resilient Failover &amp; Circuit Breaking</h2>
              <p>
                Every network call over distributed topologies must anticipate latency spikes and transient failure modes. By wrapping downstream database and Redis calls inside automated circuit breakers with exponential backoff and jitter, we prevent cascading retry storms across the NexziByte technology platform.
              </p>

              {/* Tags Strip */}
              <div className="post-tags-strip">
                <span className="tags-label">
                  <Tag size={15} />
                  Topics &amp; Tags:
                </span>
                <div className="tags-pills-list">
                  {(article.tags || ["Node.js", "Redis", "Docker", "System Design"]).map((tag, i) => (
                    <Link key={i} to={`/explore?category=${encodeURIComponent(tag)}`} className="tag-editorial-pill">
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Floating Claps & Appreciation Bar */}
              <div className="post-engagement-bar">
                <div className="engagement-left">
                  <button 
                    type="button" 
                    className={`btn-clap ${hasLiked ? "has-clapped" : ""}`}
                    onClick={handleLike}
                  >
                    <Heart size={20} fill={hasLiked ? "#EF4444" : "none"} color={hasLiked ? "#EF4444" : "currentColor"} />
                    <span>{likesCount} Claps</span>
                  </button>

                  <div className="engagement-stat">
                    <Eye size={18} />
                    <span>{article.views || "2.4k"} Reads</span>
                  </div>

                  <div className="engagement-stat">
                    <MessageSquare size={18} />
                    <span>{comments.length} Discussion Notes</span>
                  </div>
                </div>

                <div className="engagement-right">
                  <button 
                    type="button" 
                    className={`btn-action-pill ${isSaved ? "is-saved" : ""}`}
                    onClick={() => toggleSavePost(article)}
                  >
                    <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                    <span>{isSaved ? "Saved" : "Save Article"}</span>
                  </button>

                  <button 
                    type="button" 
                    className="btn-action-pill"
                    onClick={handleShare}
                  >
                    <Share2 size={16} />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Author Bio Card */}
              <div className="author-bio-card">
                <img 
                  src={article.avatar || user?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"} 
                  alt={article.author}
                  className="author-bio-avatar"
                />
                <div className="author-bio-content">
                  <div className="author-bio-header">
                    <div>
                      <h4 className="author-bio-name">{article.author}</h4>
                      <p className="author-bio-title">{article.role || "Senior Full Stack Developer"}</p>
                    </div>
                    <Link to="/profile" className="btn btn-secondary btn-sm">
                      View Profile
                    </Link>
                  </div>
                  <p className="author-bio-text">
                    Author and distributed systems practitioner at NexziByte TechTalk. Passionate about event concurrency, high-scale web platforms, and mentoring emerging software architects.
                  </p>
                </div>
              </div>

              {/* Discussion Thread Section (§10 Requirement) */}
              <section className="post-discussion-section">
                <div className="discussion-header">
                  <h3 className="discussion-title">
                    <MessageSquare size={20} style={{ color: "var(--primary-purple)" }} />
                    Community Discussion ({comments.length})
                  </h3>
                  <span className="discussion-subtitle">
                    Share your architectural questions, feedback, or implementation experiences.
                  </span>
                </div>

                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="comment-form-card">
                  <div className="comment-form-top">
                    <img 
                      src={user?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"} 
                      alt="Current User" 
                      className="comment-user-avatar"
                    />
                    <div className="comment-user-meta">
                      <span className="comment-user-name">{user?.name || "Authenticated member"}</span>
                      <span className="comment-user-role">Commenting as Verified Member</span>
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Write a constructive technical thought or question..."
                    className="form-input comment-textarea"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    required
                  />
                  <div className="comment-form-actions">
                    <button type="submit" className="btn btn-primary btn-sm">
                      <Send size={14} />
                      <span>Post Comment</span>
                    </button>
                  </div>
                </form>

                {/* Comment Thread List */}
                <div className="comment-thread-list">
                  {comments.map((comment) => (
                    <div key={comment.id} className="comment-thread-card">
                      <img src={comment.avatar} alt={comment.author} className="comment-author-avatar" />
                      <div className="comment-body-block">
                        <div className="comment-meta-row">
                          <span className="comment-author-name">{comment.author}</span>
                          <span className="comment-author-role">{comment.role}</span>
                          <span className="comment-time">• {comment.time}</span>
                        </div>
                        <p className="comment-text-content">{comment.text}</p>
                        <div className="comment-footer-actions">
                          <button 
                            type="button" 
                            className="comment-like-btn"
                            onClick={() => showToast("Liked comment.")}
                          >
                            <ThumbsUp size={13} />
                            <span>{comment.likes}</span>
                          </button>
                          <button 
                            type="button" 
                            className="comment-reply-btn"
                            onClick={() => showToast("Reply thread opened.")}
                          >
                            <CornerDownRight size={13} />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Related Dispatches Section */}
          <section className="related-dispatches-section">
            <div className="related-header">
              <span className="section-label">CONTINUE READING</span>
              <h3 className="section-heading">Related Technical Dispatches</h3>
            </div>

            <div className="articles-grid">
              {relatedDispatches.map((rel) => (
                <div 
                  key={rel.id} 
                  className="article-card"
                  onClick={() => navigate(`/posts/${rel.id}`)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="article-category-tag">{rel.category}</div>
                  <h4 className="article-title">{rel.title}</h4>
                  <p className="article-excerpt">{rel.excerpt}</p>
                  <div className="article-meta-row">
                    <div>
                      <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{rel.author}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px", fontSize: "0.75rem" }}>
                        <Clock size={12} />
                        <span>{rel.readingTime}</span>
                      </div>
                    </div>
                    <div className="article-read-btn">
                      <span>Read</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
