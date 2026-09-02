import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  Compass,
  CreditCard,
  Globe,
  Heart,
  Lock,
  MapPin,
  MessageSquare,
  Mic,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  UserRound,
  Zap,
} from 'lucide-react';
import { mockData } from './data/mockData';
import { apiService } from './lib/api';
import './App.css';

const siteSections = [
  { to: '/', label: 'Home' },
  { to: '/summits', label: 'Summits' },
  { to: '/speakers', label: 'Speakers' },
  { to: '/pricing', label: 'Pricing' },
];

const featureCards = [
  { icon: Sparkles, title: 'Executive learning', text: 'Access high-signal industry insight designed for product, engineering and leadership decision-makers.' },
  { icon: TrendingUp, title: 'Career growth', text: 'Learn from experienced operators and founders who are building the next generation of technology businesses.' },
  { icon: ShieldCheck, title: 'High-trust network', text: 'Build relationships with credible professionals in a focused, premium environment.' },
];

const howItWorks = [
  { step: '01', title: 'Discover the right conversations', text: 'Explore executive briefings, founder stories and curated technical learning designed for modern teams.' },
  { step: '02', title: 'Join premium events', text: 'Reserve seats for speaker sessions, founder meets and high-intent networking experiences.' },
  { step: '03', title: 'Apply what you learn', text: 'Turn insight into action with peer accountability, practical frameworks and stronger professional momentum.' },
];

const testimonials = [
  { name: 'Ayesha M.', role: 'VP Product', quote: 'The community feels polished and useful. It is the kind of network I want to stay close to as I grow in leadership.' },
  { name: 'Rayan P.', role: 'Platform Engineer', quote: 'The sessions are practical, well curated and immediately relevant to real engineering and product work.' },
  { name: 'Sana I.', role: 'Startup Founder', quote: 'NexziByte brings the right balance of learning, access and credibility without the noise.' },
];

const pricingPlans = [
  { name: 'Starter', price: '$19', description: 'For professionals building a stronger technical and career foundation.', perks: ['Weekly strategic briefings', '10 premium resources', 'Community Q&A access', 'Member event alerts'] },
  { name: 'Growth', price: '$49', description: 'For product builders and operators who want deeper learning and event access.', perks: ['Everything in Starter', 'Priority pricing for launches', 'Member-only workshops', '1:1 office hours access', 'Exclusive networking invites'] },
  { name: 'Founder', price: '$99', description: 'For leaders scaling teams, companies and their professional influence.', perks: ['Everything in Growth', 'Founder meet access', 'VIP event priority', 'Career and GTM review sessions', 'Private founder circle access'] },
];

const faqs = [
  { q: 'Who is TechTalk for?', a: 'TechTalk is built for builders, founders, learners, and professionals who want to grow in technology and careers.' },
  { q: 'Can I register for events without a membership?', a: 'Yes. Event tickets can be purchased individually, and memberships unlock deeper access and price benefits.' },
  { q: 'How do refunds work?', a: 'Refunds are offered for cancellations made before the event date, with the option to transfer your seat.' },
];

const loadGoogleScript = () => new Promise((resolve, reject) => {
  if (typeof window === 'undefined') return reject(new Error('Google sign-in is only available in the browser.'));
  if (window.google?.accounts?.id) return resolve();

  const existingScript = document.querySelector('script[data-google-gsi="true"]');
  if (existingScript) {
    existingScript.addEventListener('load', () => resolve(), { once: true });
    existingScript.addEventListener('error', () => reject(new Error('Google script failed to load.')), { once: true });
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  script.dataset.googleGsi = 'true';
  script.onload = () => resolve();
  script.onerror = () => reject(new Error('Google script failed to load.'));
  document.head.appendChild(script);
});

function App() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(mockData.posts);
  const [speakers, setSpeakers] = useState(mockData.speakers);
  const [summits, setSummits] = useState(mockData.summits);
  const [founderMeets, setFounderMeets] = useState(mockData.founderMeets);
  const [checkoutEvent, setCheckoutEvent] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Growth');

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      const [apiPosts, apiSpeakers, apiSummits, apiFounderMeets, currentUser] = await Promise.all([
        apiService.getPosts(),
        apiService.getSpeakers(),
        apiService.getSummits(),
        apiService.getFounderMeets(),
        apiService.getCurrentUser(),
      ]);
      if (ignore) return;
      if (apiPosts?.length) setPosts(apiPosts);
      if (apiSpeakers?.length) setSpeakers(apiSpeakers);
      if (apiSummits?.length) setSummits(apiSummits);
      if (apiFounderMeets?.length) setFounderMeets(apiFounderMeets);
      if (currentUser) setUser(currentUser);
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const openCheckout = (event, plan = selectedPlan) => {
    setCheckoutEvent(event);
    setSelectedPlan(plan);
    setCheckoutOpen(true);
  };

  const handleLogout = () => {
    apiService.logout();
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<HomePage posts={posts} summits={summits} founderMeets={founderMeets} speakers={speakers} openCheckout={openCheckout} />} />
          <Route path="/explore" element={<ExplorePage posts={posts} />} />
          <Route path="/posts/:postId" element={<PostDetailPage posts={posts} />} />
          <Route path="/summits" element={<SummitsPage summits={summits} speakers={speakers} openCheckout={openCheckout} />} />
          <Route path="/summits/:eventId" element={<SummitDetailPage summits={summits} speakers={speakers} openCheckout={openCheckout} />} />
          <Route path="/founder-meets" element={<FounderMeetsPage founderMeets={founderMeets} speakers={speakers} openCheckout={openCheckout} />} />
          <Route path="/founder-meets/:eventId" element={<FounderMeetDetailPage founderMeets={founderMeets} speakers={speakers} openCheckout={openCheckout} />} />
          <Route path="/speakers" element={<SpeakersPage speakers={speakers} />} />
          <Route path="/pricing" element={<PricingPage openCheckout={openCheckout} />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/profile" element={<ProfilePage user={user} posts={posts} />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/register" element={<RegisterPage setUser={setUser} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {checkoutOpen && <CheckoutModal event={checkoutEvent} plan={selectedPlan} onClose={() => setCheckoutOpen(false)} />}
      </Layout>
    </BrowserRouter>
  );
}

function Layout({ children, user, onLogout }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">N</div>
          <div>
            <div className="brand-name">NexziByte</div>
            <div className="brand-subtitle">Executive tech community</div>
          </div>
        </div>

        <nav className="main-nav" aria-label="Primary navigation">
          {siteSections.map((section) => (
            <NavLink key={section.to} to={section.to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {section.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <button type="button" className="ghost-btn" aria-label="Notifications">
            <Bell size={16} />
          </button>
          {user ? (
            <>
              <Link className="user-badge" to="/profile">
                <UserRound size={16} />
                {user.name || 'Member'}
              </Link>
              <button type="button" className="primary-btn small" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="secondary-btn small" to="/login">Login</Link>
              <Link className="primary-btn small" to="/register">Join now</Link>
            </>
          )}
        </div>
      </header>

      <main className="page-content">{children}</main>

      <footer className="site-footer">
        <div>
          <div className="footer-brand">NexziByte</div>
          <p>Technology events, learning and strategic networking for modern teams.</p>
        </div>
        <div className="footer-links">
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://x.com" target="_blank" rel="noreferrer">X</a>
        </div>
      </footer>
    </div>
  );
}

function HomePage({ posts, summits, founderMeets, speakers, openCheckout }) {
  const featuredPosts = posts.slice(0, 3);
  const highlightEvent = summits[0];
  const highlightMeet = founderMeets[0];

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Enterprise event platform</span>
          <h1>Built for leaders shaping the next generation of technology.</h1>
          <p>
            NexziByte connects product leaders, engineers, founders and operators through focused learning, executive events and strategic hiring opportunities.
          </p>
          <div className="cta-row">
            <Link className="primary-btn" to="/summits">Explore events</Link>
            <Link className="secondary-btn" to="/pricing">Membership</Link>
          </div>
          <div className="stats-row">
            <div>
              <strong>28K+</strong>
              <span>Members</span>
            </div>
            <div>
              <strong>42</strong>
              <span>Events</span>
            </div>
            <div>
              <strong>96%</strong>
              <span>Retention</span>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-panel-top">
            <span className="chip">Featured</span>
            <strong>AI & Product</strong>
          </div>
          <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80" alt="Executive team discussion" />
          <div className="panel-stats">
            <div>
              <span>Upcoming summit</span>
              <strong>{highlightEvent?.title}</strong>
            </div>
            <div>
              <span>Featured speaker</span>
              <strong>{speakers[0]?.name}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section muted-section">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">How it works</span>
            <h2>Purpose-built for serious learning and access</h2>
          </div>
        </div>
        <div className="steps-grid">
          {howItWorks.map((item) => (
            <div key={item.step} className="step-card">
              <span className="step-number">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="brand-strip">
        <div className="brand-strip-item">AI & data</div>
        <div className="brand-strip-item">Career growth</div>
        <div className="brand-strip-item">Product strategy</div>
        <div className="brand-strip-item">Founder networks</div>
      </section>

      <section className="content-section">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">Why members stay</span>
            <h2>Everything you need to grow in tech — in one place</h2>
          </div>
        </div>
        <div className="feature-grid">
          {featureCards.map(({ icon: Icon, title, text }) => (
            <div key={title} className="feature-card">
              <div className="feature-icon"><Icon size={22} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section muted-section">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">Featured content</span>
            <h2>Fresh insight from the community</h2>
          </div>
          <Link className="text-link" to="/explore">View all <ArrowRight size={16} /></Link>
        </div>
        <div className="post-grid">
          {featuredPosts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">Trending topics</span>
            <h2>What the community is learning right now</h2>
          </div>
        </div>
        <div className="tag-cloud">
          {mockData.trendingTopics.map((topic) => <span key={topic} className="tag-pill">{topic}</span>)}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">Events</span>
            <h2>High-signal experiences that create momentum</h2>
          </div>
        </div>
        <div className="event-grid">
          <EventCard event={highlightEvent} type="summit" speakers={speakers} onCheckout={openCheckout} />
          <EventCard event={highlightMeet} type="founder" speakers={speakers} onCheckout={openCheckout} />
        </div>
      </section>

      <section className="content-section muted-section">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">Experts</span>
            <h2>Meet the people behind the conversation</h2>
          </div>
        </div>
        <div className="speaker-grid">
          {speakers.slice(0, 4).map((speaker) => <SpeakerCard key={speaker.id} speaker={speaker} />)}
        </div>
      </section>

      <section className="content-section testimonial-section">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">Community feedback</span>
            <h2>Members come for the learning and stay for the network</h2>
          </div>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <div key={item.name} className="testimonial-card">
              <div className="stars">
                {[...Array(5)].map((_, index) => <Star key={index} size={14} fill="currentColor" />)}
              </div>
              <p>“{item.quote}”</p>
              <div className="testimonial-author">
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section pricing-box">
        <div className="pricing-cta">
          <div>
            <span className="eyebrow">Membership</span>
            <h2>Invest in your next chapter</h2>
          </div>
          <Link className="primary-btn" to="/pricing">See plans</Link>
        </div>
      </section>

      <section className="content-section newsletter-box">
        <div>
          <span className="eyebrow">Stay in the loop</span>
          <h2>Get the latest tech, career and founder insight once a week.</h2>
        </div>
        <form className="newsletter-form">
          <input type="email" placeholder="Your email address" />
          <button type="button" className="primary-btn">Subscribe</button>
        </form>
      </section>
    </>
  );
}

function ExplorePage({ posts }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = useMemo(() => ['All', ...new Set(posts.map((post) => post.category))], [posts]);

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const haystack = `${post.title} ${post.excerpt} ${post.author} ${(post.tags || []).join(' ')}`.toLowerCase();
    return matchesCategory && haystack.includes(query.toLowerCase());
  });

  return (
    <section className="content-section">
      <div className="section-heading-row stacked-row">
        <div>
          <span className="eyebrow">TechTalk feed</span>
          <h2>Explore the knowledge ecosystem</h2>
        </div>
        <div className="toolbar">
          <label className="search-field">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search posts, authors, topics" />
          </label>
        </div>
      </div>

      <div className="filter-row">
        {categories.map((category) => (
          <button type="button" key={category} className={category === selectedCategory ? 'chip-btn active' : 'chip-btn'} onClick={() => setSelectedCategory(category)}>
            {category}
          </button>
        ))}
      </div>

      <div className="post-grid">
        {filteredPosts.length ? filteredPosts.map((post) => <PostCard key={post.id} post={post} />) : <EmptyState text="No posts match your filters." />}
      </div>
    </section>
  );
}

function PostDetailPage({ posts }) {
  const { postId } = useParams();
  const post = posts.find((item) => item.id === Number(postId));
  if (!post) return <EmptyState text="This post is not available." />;

  return (
    <section className="content-section article-page">
      <div className="article-banner-wrap">
        <img src={post.image} alt={post.title} className="article-banner" />
      </div>
      <article className="article-body">
        <div className="meta-row">
          <span className="chip">{post.category}</span>
          <span>{post.publishedAt}</span>
          <span>{post.readTime}</span>
        </div>
        <h1>{post.title}</h1>
        <div className="author-row">
          <div className="avatar-circle">{(post.author || 'C').charAt(0)}</div>
          <div>
            <strong>{post.author}</strong>
            <small>{post.authorRole}</small>
          </div>
        </div>
        <div className="tag-row">
          {(post.tags || []).map((tag) => <span key={tag} className="tag-pill">{tag}</span>)}
        </div>
        <p className="lead">{post.excerpt}</p>
        <div className="article-content">
          {(post.content || '').split('\n\n').map((paragraph, index) => <p key={`${post.id}-paragraph-${index}`}>{paragraph}</p>)}
        </div>
        <div className="article-actions">
          <button type="button" className="ghost-btn"><Heart size={16} /> {post.reactions}</button>
          <button type="button" className="ghost-btn"><MessageSquare size={16} /> {post.comments}</button>
        </div>
      </article>
    </section>
  );
}

function SummitsPage({ summits, speakers, openCheckout }) {
  return (
    <section className="content-section">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">TechTalk summits</span>
          <h2>Learn from operators, founders and product leaders</h2>
        </div>
      </div>
      <div className="event-grid">
        {summits.map((event) => <EventCard key={event.id} event={event} type="summit" speakers={speakers} onCheckout={openCheckout} />)}
      </div>
    </section>
  );
}

function SummitDetailPage({ summits, speakers, openCheckout }) {
  const { eventId } = useParams();
  const event = summits.find((item) => item.id === Number(eventId));
  if (!event) return <EmptyState text="Summit not found." />;

  const relatedSpeakers = speakers.filter((speaker) => event.speakers?.includes(speaker.id));

  return (
    <section className="content-section detail-page">
      <div className="detail-banner-wrap">
        <img src={event.banner} alt={event.title} className="detail-banner" />
      </div>
      <div className="detail-content">
        <div>
          <span className="eyebrow">Summit</span>
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <div className="meta-list">
            <span><CalendarDays size={16} /> {event.date}</span>
            <span><MapPin size={16} /> {event.location}</span>
            <span><Mic size={16} /> {event.venue}</span>
          </div>
        </div>
        <div className="detail-cta">
          <button type="button" className="primary-btn" onClick={() => openCheckout(event, 'Growth')}>Register now</button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-panel">
          <h3>Agenda</h3>
          <ul>{(event.agenda || []).map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="detail-panel">
          <h3>Featured speakers</h3>
          <div className="mini-speaker-list">
            {relatedSpeakers.map((speaker) => (
              <div key={speaker.id} className="mini-speaker">
                <img src={speaker.photo} alt={speaker.name} />
                <div>
                  <strong>{speaker.name}</strong>
                  <small>{speaker.designation}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FounderMeetsPage({ founderMeets, speakers, openCheckout }) {
  return (
    <section className="content-section">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">Founder meets</span>
          <h2>High-intent conversations for builders and operators</h2>
        </div>
      </div>
      <div className="event-grid">
        {founderMeets.map((event) => <EventCard key={event.id} event={event} type="founder" speakers={speakers} onCheckout={openCheckout} />)}
      </div>
    </section>
  );
}

function FounderMeetDetailPage({ founderMeets, speakers, openCheckout }) {
  const { eventId } = useParams();
  const event = founderMeets.find((item) => item.id === Number(eventId));
  if (!event) return <EmptyState text="Founder meet not found." />;

  return (
    <section className="content-section detail-page">
      <div className="detail-banner-wrap">
        <img src={event.banner} alt={event.title} className="detail-banner" />
      </div>
      <div className="detail-content">
        <div>
          <span className="eyebrow">Founder meet</span>
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <div className="meta-list">
            <span><CalendarDays size={16} /> {event.date}</span>
            <span><MapPin size={16} /> {event.location}</span>
            <span><Compass size={16} /> {event.venue}</span>
          </div>
        </div>
        <div className="detail-cta">
          <button type="button" className="primary-btn" onClick={() => openCheckout(event, 'Founder')}>Reserve your spot</button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-panel">
          <h3>Networking</h3>
          <p>{event.networking_info}</p>
          <h3>Founder insight</h3>
          <p>{event.founder_information}</p>
        </div>
        <div className="detail-panel">
          <h3>Agenda</h3>
          <ul>{(event.agenda || []).map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}

function SpeakersPage({ speakers }) {
  return (
    <section className="content-section">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">Experts</span>
          <h2>Meet the voices shaping modern technology</h2>
        </div>
      </div>
      <div className="speaker-grid">
        {speakers.map((speaker) => <SpeakerCard key={speaker.id} speaker={speaker} />)}
      </div>
    </section>
  );
}

function PricingPage({ openCheckout }) {
  return (
    <section className="content-section pricing-page">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">Membership</span>
          <h2>Choose the plan that matches your next move</h2>
        </div>
      </div>

      <div className="pricing-grid">
        {pricingPlans.map((plan) => (
          <div key={plan.name} className={plan.name === 'Growth' ? 'pricing-card featured' : 'pricing-card'}>
            <div className="plan-header">
              <span className="chip">{plan.name}</span>
              <div className="plan-price">{plan.price}<span>/mo</span></div>
            </div>
            <p>{plan.description}</p>
            <ul>
              {plan.perks.map((perk) => <li key={perk}><Check size={16} /> {perk}</li>)}
            </ul>
            <button type="button" className="primary-btn" onClick={() => openCheckout(null, plan.name)}>
              Choose {plan.name}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function CreatePostPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', category: 'Artificial Intelligence' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await apiService.createPost({ title: form.title, content: form.content, category_id: 1 });
      navigate('/explore');
    } catch {
      navigate('/explore');
    }
  };

  return (
    <section className="content-section form-page">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">Create post</span>
          <h2>Share a technical insight with the community</h2>
        </div>
      </div>

      <form className="editor-form" onSubmit={handleSubmit}>
        <label>
          Post title
          <input name="title" value={form.title} onChange={handleChange} placeholder="How we design AI systems that users trust" />
        </label>
        <label>
          Category
          <select name="category" value={form.category} onChange={handleChange}>
            {mockData.categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
          </select>
        </label>
        <label>
          Content
          <textarea name="content" value={form.content} onChange={handleChange} rows="10" placeholder="Write your article here..." />
        </label>
        <div className="editor-actions">
          <button type="button" className="secondary-btn">Save draft</button>
          <button type="submit" className="primary-btn">Publish</button>
        </div>
      </form>
    </section>
  );
}

function ProfilePage({ user, posts }) {
  const profile = user || {
    name: 'Aarav Nair',
    email: 'aarav@techtalk.dev',
    bio: 'Product-minded technologist exploring AI, design and software systems.',
    skills: ['AI', 'React', 'Product strategy'],
    location: 'Hyderabad, India',
  };

  return (
    <section className="content-section profile-page">
      <div className="profile-hero">
        <div className="avatar-large">{profile.name.charAt(0)}</div>
        <div>
          <span className="eyebrow">Profile</span>
          <h2>{profile.name}</h2>
          <p>{profile.bio}</p>
          <div className="profile-meta">
            <span><Globe size={15} /> {profile.location || 'Remote'}</span>
            <span><Compass size={15} /> Product-minded engineer</span>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-panel">
          <h3>Skills</h3>
          <div className="tag-row">
            {(profile.skills || ['AI', 'Design', 'Leadership']).map((skill) => <span key={skill} className="tag-pill">{skill}</span>)}
          </div>
        </div>
        <div className="profile-panel">
          <h3>Activity</h3>
          <ul className="plain-list">
            <li>Published {posts.length} community insights</li>
            <li>Saved 7 popular posts</li>
            <li>Registered for 3 events</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function LoginPage({ setUser }) {
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [googleError, setGoogleError] = useState('');

  const handleGoogleLogin = useCallback(async ({ credential }) => {
    try {
      const response = await apiService.loginWithGoogle(credential);
      const token = response?.access_token;
      if (!token) throw new Error('Google login failed');
      const profile = await apiService.getCurrentUser();
      setUser(profile || { name: 'Google member', email: 'google-member@techtalk.dev' });
      navigate('/profile');
    } catch {
      setGoogleError('Unable to verify your Google account. Please try again.');
    }
  }, [navigate, setUser]);

  useEffect(() => {
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      setGoogleError('Google sign-in is not configured yet. Add VITE_GOOGLE_CLIENT_ID to your frontend .env file.');
      return undefined;
    }

    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        if (cancelled || !googleButtonRef.current || !window.google?.accounts?.id) return;
        if (googleButtonRef.current.dataset.googleInitialized === 'true') return;
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleLogin,
        });
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          shape: 'pill',
          logo_alignment: 'left',
        });
        googleButtonRef.current.dataset.googleInitialized = 'true';
      })
      .catch(() => {
        if (!cancelled) setGoogleError('Google sign-in could not load.');
      });

    return () => {
      cancelled = true;
    };
  }, [handleGoogleLogin]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await apiService.login(form);
      const profile = await apiService.getCurrentUser();
      setUser(profile || { name: form.email.split('@')[0], email: form.email });
      navigate('/profile');
    } catch {
      setError('Unable to sign in. Please verify your credentials.');
    }
  };

  return (
    <section className="content-section auth-page">
      <div className="auth-card">
        <span className="eyebrow">Welcome back</span>
        <h2>Log in to TechTalk</h2>
        <div className="auth-socials">
          <button type="button" className="secondary-btn full-width">Continue with LinkedIn</button>
          <div ref={googleButtonRef} className="google-auth-button" />
        </div>
        {googleError ? <p className="form-error">{googleError}</p> : null}
        <form onSubmit={handleSubmit} className="editor-form compact-form">
          <label>
            Email
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </label>
          <label>
            Password
            <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          </label>
          <div className="switch-row">
            <label className="checkbox-inline"><input type="checkbox" defaultChecked /> Remember me</label>
            <Link to="/register">Forgot password?</Link>
          </div>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" className="primary-btn">Log in</button>
        </form>
        <p className="auth-link">New here? <Link to="/register">Create an account</Link></p>
      </div>
    </section>
  );
}

function RegisterPage({ setUser }) {
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [googleError, setGoogleError] = useState('');

  const handleGoogleRegister = useCallback(async ({ credential }) => {
    try {
      const response = await apiService.loginWithGoogle(credential);
      const token = response?.access_token;
      if (!token) throw new Error('Google registration failed');
      const profile = await apiService.getCurrentUser();
      setUser(profile || { name: 'Google member', email: 'google-member@techtalk.dev' });
      navigate('/profile');
    } catch {
      setGoogleError('Google registration failed. Please try again.');
    }
  }, [navigate, setUser]);

  useEffect(() => {
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      setGoogleError('Google sign-in is not configured yet. Add VITE_GOOGLE_CLIENT_ID to your frontend .env file.');
      return undefined;
    }

    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        if (cancelled || !googleButtonRef.current || !window.google?.accounts?.id) return;
        if (googleButtonRef.current.dataset.googleInitialized === 'true') return;
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleRegister,
        });
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signup_with',
          shape: 'pill',
          logo_alignment: 'left',
        });
        googleButtonRef.current.dataset.googleInitialized = 'true';
      })
      .catch(() => {
        if (!cancelled) setGoogleError('Google sign-in could not load.');
      });

    return () => {
      cancelled = true;
    };
  }, [handleGoogleRegister]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await apiService.register(form);
      const profile = await apiService.getCurrentUser();
      setUser(profile || { name: form.name, email: form.email });
      navigate('/profile');
    } catch {
      setUser({ name: form.name, email: form.email });
      navigate('/profile');
    }
  };

  return (
    <section className="content-section auth-page">
      <div className="auth-card">
        <span className="eyebrow">Join the community</span>
        <h2>Create your TechTalk account</h2>
        <div className="auth-socials">
          <button type="button" className="secondary-btn full-width">Sign up with LinkedIn</button>
          <div ref={googleButtonRef} className="google-auth-button" />
        </div>
        {googleError ? <p className="form-error">{googleError}</p> : null}
        <form onSubmit={handleSubmit} className="editor-form compact-form">
          <label>
            Full name
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </label>
          <label>
            Password
            <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          </label>
          <div className="switch-row">
            <label className="checkbox-inline"><input type="checkbox" defaultChecked /> I agree to the terms</label>
          </div>
          <button type="submit" className="primary-btn">Create account</button>
        </form>
      </div>
    </section>
  );
}

function PostCard({ post }) {
  const authorName = post.author || 'Community member';
  return (
    <article className="post-card">
      <img src={post.image} alt={post.title} />
      <div className="post-body">
        <div className="meta-row small-meta">
          <span className="chip">{post.category}</span>
          <span>{post.publishedAt}</span>
        </div>
        <Link className="post-title" to={`/posts/${post.id}`}>{post.title}</Link>
        <p>{post.excerpt}</p>
        <div className="post-footer">
          <div className="author-inline">
            <div className="avatar-circle small">{authorName.charAt(0)}</div>
            <span>{authorName}</span>
          </div>
          <div className="stat-row">
            <span><Heart size={14} /> {post.reactions}</span>
            <span><MessageSquare size={14} /> {post.comments}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function EventCard({ event, type, speakers = [], onCheckout }) {
  if (!event) return null;
  const eventSpeakers = speakers.filter((speaker) => event.speakers?.includes(speaker.id));
  const route = type === 'summit' ? `/summits/${event.id}` : `/founder-meets/${event.id}`;

  return (
    <article className="event-card">
      <img src={event.banner} alt={event.title} />
      <div className="event-body">
        <div className="meta-row small-meta">
          <span className="chip">{type === 'summit' ? 'Summit' : 'Founder meet'}</span>
          <span>{event.date}</span>
        </div>
        <Link className="event-title" to={route}>{event.title}</Link>
        <p>{event.description}</p>
        <div className="event-meta-list">
          <span><MapPin size={14} /> {event.location}</span>
          <span><CalendarDays size={14} /> {event.time}</span>
        </div>
        <div className="speaker-stack">
          {eventSpeakers.slice(0, 2).map((speaker) => <img key={speaker.id} src={speaker.photo} alt={speaker.name} title={speaker.name} />)}
        </div>
        <div className="event-action-row">
          <Link className="secondary-btn small" to={route}>View details</Link>
          <button type="button" className="primary-btn small" onClick={() => onCheckout?.(event, type === 'summit' ? 'Growth' : 'Founder')}>Get ticket</button>
        </div>
      </div>
    </article>
  );
}

function SpeakerCard({ speaker }) {
  return (
    <article className="speaker-card">
      <img src={speaker.photo} alt={speaker.name} />
      <div className="speaker-body">
        <h3>{speaker.name}</h3>
        <p className="speaker-role">{speaker.designation}</p>
        <p className="speaker-company">{speaker.company}</p>
        <div className="tag-row">
          {(speaker.expertise || []).slice(0, 3).map((item) => <span key={item} className="tag-pill">{item}</span>)}
        </div>
      </div>
    </article>
  );
}

function CheckoutModal({ event, plan, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="checkout-modal" onClick={(eventObject) => eventObject.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">Secure checkout</span>
            <h3>{event ? event.title : `${plan} membership`}</h3>
          </div>
          <button type="button" className="ghost-btn" onClick={onClose}>Close</button>
        </div>

        <div className="checkout-layout">
          <div className="checkout-summary">
            <div className="summary-box">
              <p>{event ? 'Event ticket' : 'Membership plan'}</p>
              <strong>{event ? 'Premium access pass' : `${plan} plan`}</strong>
            </div>
            <div className="summary-price">$79</div>
            <ul className="plain-list">
              <li><Lock size={14} /> Secure checkout</li>
              <li><ShieldCheck size={14} /> Instant confirmation</li>
              <li><Zap size={14} /> Priority event access</li>
            </ul>
          </div>

          <form className="checkout-form">
            <label>
              Cardholder name
              <input type="text" placeholder="Alex Morgan" />
            </label>
            <label>
              Card number
              <input type="text" placeholder="4242 4242 4242 4242" />
            </label>
            <div className="checkout-split">
              <label>
                Expiry
                <input type="text" placeholder="09/29" />
              </label>
              <label>
                CVV
                <input type="text" placeholder="123" />
              </label>
            </div>
            <label>
              Billing email
              <input type="email" placeholder="alex@email.com" />
            </label>
            <button type="button" className="primary-btn full-width" onClick={onClose}>Complete payment</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return <div className="empty-state">{text}</div>;
}

function NotFound() {
  return (
    <section className="content-section auth-page">
      <div className="auth-card">
        <span className="eyebrow">Page missing</span>
        <h2>We couldn’t find that page.</h2>
        <Link className="primary-btn" to="/">Return home</Link>
      </div>
    </section>
  );
}

export default App;
