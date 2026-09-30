import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Briefcase, Building2, GraduationCap, MapPin, UserCheck, UserPlus } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";

function formatDate(value) {
  if (!value) return "Present";
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

export default function PublicProfilePage() {
  const { id } = useParams();
  const { user, isLoggedIn } = useApp();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingFollow, setSavingFollow] = useState(false);
  const isSelf = String(user?.id) === String(id);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api.getProfessionalProfile(id)
      .then((data) => { if (active) setProfile(data); })
      .catch((requestError) => { if (active) setError(requestError.message || "This profile could not be loaded."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const toggleFollow = async () => {
    if (!profile || savingFollow) return;
    setSavingFollow(true);
    try {
      const following = profile.is_following
        ? await api.unfollowUser(profile.id)
        : await api.followUser(profile.id);
      setProfile((current) => ({
        ...current,
        is_following: following.following,
        followers_count: Math.max(
          0,
          current.followers_count + (following.changed ? (following.following ? 1 : -1) : 0),
        ),
      }));
    } catch (requestError) {
      setError(requestError.message || "The follow action could not be completed.");
    } finally {
      setSavingFollow(false);
    }
  };

  if (loading) return <main className="section-padding"><div className="container" role="status">Loading profile…</div></main>;
  if (error && !profile) return <main className="section-padding"><div className="container" role="alert">{error}</div></main>;
  if (!profile) return null;

  return (
    <main className="section-padding">
      <div className="container" style={{ maxWidth: "900px" }}>
        {error && <p role="alert">{error}</p>}
        <section className="profile-section-card" style={{ padding: "32px", marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
            {profile.profile_image && (
              <img src={profile.profile_image} alt="" style={{ width: "104px", height: "104px", borderRadius: "50%", objectFit: "cover" }} />
            )}
            <div style={{ flex: 1, minWidth: "220px" }}>
              <span className="section-label">TECHTALK MEMBER</span>
              <h1 className="section-heading" style={{ margin: "8px 0" }}>{profile.name}</h1>
              {profile.headline && <p className="card-subheading">{profile.headline}{profile.current_company ? ` · ${profile.current_company}` : ""}</p>}
              {profile.location && <p className="card-desc" style={{ display: "flex", gap: "6px", alignItems: "center" }}><MapPin size={15} /> {profile.location}</p>}
              <p className="card-desc">{profile.followers_count} followers · {profile.following_count} following</p>
            </div>
            {isSelf ? (
              <Link className="btn btn-secondary" to="/profile">Edit profile</Link>
            ) : isLoggedIn ? (
              <button type="button" className="btn btn-primary" onClick={toggleFollow} disabled={savingFollow}>
                {profile.is_following ? <UserCheck size={16} /> : <UserPlus size={16} />}
                {savingFollow ? "Saving…" : profile.is_following ? "Following" : "Follow"}
              </button>
            ) : (
              <Link className="btn btn-primary" to="/login">Sign in to follow</Link>
            )}
          </div>
          {profile.bio && <p style={{ marginTop: "24px", color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>{profile.bio}</p>}
          {profile.skills?.length > 0 && (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "20px" }}>
              {profile.skills.map((skill) => <span key={skill} className="article-category-tag">{skill.trim()}</span>)}
            </div>
          )}
        </section>

        <section className="profile-section-card" style={{ marginBottom: "24px" }}>
          <h2 className="card-subheading"><Briefcase size={18} /> Experience</h2>
          {profile.experiences.length === 0 && <p className="card-desc">No experience has been added yet.</p>}
          {profile.experiences.map((experience) => (
            <article key={experience.id} style={{ padding: "18px 0", borderBottom: "1px solid var(--border-color)" }}>
              <h3>{experience.title}</h3>
              <p className="card-desc"><Building2 size={14} /> {experience.company} · {formatDate(experience.start_date)} – {formatDate(experience.end_date)}</p>
              {experience.description && <p style={{ color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>{experience.description}</p>}
            </article>
          ))}
        </section>

        <section className="profile-section-card">
          <h2 className="card-subheading"><GraduationCap size={18} /> Education</h2>
          {profile.education.length === 0 && <p className="card-desc">No education has been added yet.</p>}
          {profile.education.map((entry) => (
            <article key={entry.id} style={{ padding: "18px 0", borderBottom: "1px solid var(--border-color)" }}>
              <h3>{entry.school}</h3>
              <p className="card-desc">{entry.degree} · {entry.field} · {entry.year}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
