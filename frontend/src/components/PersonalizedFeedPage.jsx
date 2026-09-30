import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, MessageSquare, RefreshCw, ThumbsUp } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";

export default function PersonalizedFeedPage() {
  const { user } = useApp();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFeed = async () => {
    setLoading(true);
    setError("");
    try {
      setPosts(await api.getPersonalizedFeed());
    } catch (requestError) {
      setError(requestError.message || "Your network feed could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  return (
    <main className="section-padding">
      <div className="container" style={{ maxWidth: "900px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "20px", marginBottom: "32px" }}>
          <div>
            <span className="section-label">YOUR PROFESSIONAL NETWORK</span>
            <h1 className="section-heading">Network Feed</h1>
            <p className="section-subtitle">Recent published dispatches from you and the people you follow.</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={loadFeed} disabled={loading}>
            <RefreshCw size={15} />
            Refresh
          </button>
        </header>

        {loading && <p role="status">Loading your feed…</p>}
        {!loading && error && <p role="alert">{error}</p>}
        {!loading && !error && posts.length === 0 && (
          <section className="profile-section-card" style={{ textAlign: "center", padding: "36px" }}>
            <h2 className="card-subheading">Your feed is ready when you are</h2>
            <p className="card-desc">Follow members to see their published work here, or share your own first dispatch.</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", marginTop: "20px" }}>
              <Link to="/explore" className="btn btn-secondary">Explore TechTalk</Link>
              <Link to="/create-post" className="btn btn-primary">Write a dispatch</Link>
            </div>
          </section>
        )}

        {!loading && !error && posts.map((post) => (
          <article key={post.id} className="profile-section-card" style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
              <div>
                <Link to={`/members/${post.author_id}`} style={{ fontWeight: 700, color: "var(--text-main)" }}>
                  {post.author}
                </Link>
                {post.authorRole && <p className="card-desc" style={{ margin: "3px 0 0" }}>{post.authorRole}</p>}
              </div>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <Clock size={14} /> {post.publishedAt}
              </span>
            </div>
            <div style={{ marginTop: "20px" }}>
              <span className="article-category-tag">{post.category}</span>
              <h2 className="card-subheading" style={{ marginTop: "12px" }}>{post.title}</h2>
              {post.cover_image && (
                <img
                  src={post.cover_image}
                  alt=""
                  loading="lazy"
                  style={{ width: "100%", maxHeight: "360px", objectFit: "cover", borderRadius: "var(--radius-md)", margin: "12px 0" }}
                />
              )}
              <p style={{ color: "var(--text-secondary)", whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                {post.content || post.excerpt}
              </p>
            </div>
            <footer style={{ display: "flex", gap: "18px", color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "18px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><ThumbsUp size={15} /> {post.reactions}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><MessageSquare size={15} /> {post.comments}</span>
              <Link to={`/members/${post.author_id}`} style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                View profile <ArrowRight size={14} />
              </Link>
            </footer>
          </article>
        ))}
        <p className="card-desc" style={{ textAlign: "center", marginTop: "28px" }}>Signed in as {user?.name || "member"}</p>
      </div>
    </main>
  );
}
