import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter, Link, NavLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  Bookmark,
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
  Share2,
  ShieldCheck,
  Star,
  UserRound,
  Zap,
} from 'lucide-react';
import { mockData } from './data/mockData';
import { apiService, getAuthToken } from './lib/api';
import './App.css';

const siteSections = [
  { to: '/', label: 'Home', requiresAuth: false },
  { to: '/explore', label: 'Explore', requiresAuth: true },
  { to: '/explore', label: 'Topics', requiresAuth: true },
  { to: '/summits', label: 'Summits', requiresAuth: true },
  { to: '/founder-meets', label: 'Founder Meets', requiresAuth: true },
  { to: '/speakers', label: 'Speakers', requiresAuth: true },
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
          <Route path="/" element={<HomePage user={user} posts={posts} />} />
          <Route path="/explore" element={<ProtectedRoute user={user}><ExplorePage posts={posts} /></ProtectedRoute>} />
          <Route path="/posts/:postId" element={<PostDetailPage posts={posts} />} />
          <Route path="/summits" element={<ProtectedRoute user={user}><SummitsPage summits={summits} speakers={speakers} openCheckout={openCheckout} /></ProtectedRoute>} />
          <Route path="/summits/:eventId" element={<ProtectedRoute user={user}><SummitDetailPage summits={summits} speakers={speakers} openCheckout={openCheckout} /></ProtectedRoute>} />
          <Route path="/founder-meets" element={<ProtectedRoute user={user}><FounderMeetsPage founderMeets={founderMeets} speakers={speakers} openCheckout={openCheckout} /></ProtectedRoute>} />
          <Route path="/founder-meets/:eventId" element={<ProtectedRoute user={user}><FounderMeetDetailPage founderMeets={founderMeets} speakers={speakers} openCheckout={openCheckout} /></ProtectedRoute>} />
          <Route path="/speakers" element={<ProtectedRoute user={user}><SpeakersPage speakers={speakers} /></ProtectedRoute>} />
          <Route path="/pricing" element={<PricingPage openCheckout={openCheckout} />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/profile" element={<ProfilePage user={user} posts={posts} />} />
          <Route path="/my-posts" element={<MyPostsPage posts={posts} />} />
          <Route path="/saved-posts" element={<SavedPostsPage posts={posts} />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/scanner" element={<ProtectedRoute user={user}><ScannerPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/register" element={<RegisterPage setUser={setUser} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {checkoutOpen && <CheckoutModal event={checkoutEvent} plan={selectedPlan} onClose={() => setCheckoutOpen(false)} />}
      </Layout>
    </BrowserRouter>
  );
}

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function Layout({ children, user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let ignore = false;
    const loadUnreadCount = async () => {
      if (!getAuthToken()) {
        setUnreadNotifications(0);
        return;
      }
      const response = await apiService.getUnreadNotificationCount();
      if (!ignore) setUnreadNotifications(response?.count || 0);
    };
    loadUnreadCount();
    const interval = window.setInterval(loadUnreadCount, 15000);
    return () => {
      ignore = true;
      window.clearInterval(interval);
    };
  }, [user]);

  return (
    <div className="app-shell">
      <header className={`topbar${hasScrolled ? ' scrolled' : ''}${user ? ' authenticated' : ''}`}>
        <Link className="brand-wrap" to="/">
          <span className="brand-mark">N</span>
          <span className="brand-name">NEXZIBYTE</span>
          <span className="brand-divider">/</span>
          <span className="brand-product">TECHTALK</span>
        </Link>

        <nav className={`main-nav${mobileMenuOpen ? ' open' : ''}`} aria-label="Primary navigation">
          {siteSections.map((section) => {
            const target = !user && section.requiresAuth ? '/login' : section.to;

            return (
              <NavLink
                key={`${section.to}-${section.label}`}
                to={target}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={() => setMobileMenuOpen(false)}
              >
                {section.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="header-actions">
          <Link className="search-link" to={user ? '/explore' : '/login'} aria-label="Search">
            <Search size={16} />
            <span>Search</span>
          </Link>

          {user ? (
            <>
              <Link className="notification-link" to="/notifications" aria-label="Notifications">
                <Bell size={16} />
                <span>Notifications</span>
                {unreadNotifications > 0 ? <span className="notification-badge">{unreadNotifications}</span> : null}
              </Link>
              <Link className="user-badge" to="/profile">
                <UserRound size={16} />
                {user.name || 'Profile'}
              </Link>
              <Link className="ghost-btn small" to="/scanner">Scanner</Link>
              <button type="button" className="primary-btn small" onClick={onLogout}>Sign out</button>
            </>
          ) : (
            <>
              <Link className="sign-in-link" to="/login">Sign In</Link>
              <Link className="primary-btn small join-community-btn" to="/register">Join Community <ArrowRight size={14} /></Link>
            </>
          )}
          <button type="button" className="mobile-menu-toggle" aria-label="Toggle menu" onClick={() => setMobileMenuOpen((cur) => !cur)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <main className="page-content">{children}</main>

      <footer className="site-footer">
        <div className="footer-column brand-column">
          <div className="footer-brand">TECHTALK</div>
          <p>Where technology meets the people building tomorrow.</p>
        </div>

        <div className="footer-column">
          <h4>Knowledge</h4>
          <div className="footer-links vertical-links">
            <Link to={user ? '/explore' : '/login'}>Explore</Link>
            <Link to={user ? '/explore' : '/login'}>Topics</Link>
            <Link to={user ? '/explore' : '/login'}>Trending</Link>
          </div>
        </div>

        <div className="footer-column">
          <h4>Events</h4>
          <div className="footer-links vertical-links">
            <Link to={user ? '/summits' : '/login'}>Summits</Link>
            <Link to={user ? '/founder-meets' : '/login'}>Founder Meets</Link>
            <Link to={user ? '/speakers' : '/login'}>Speakers</Link>
          </div>
        </div>

        <div className="footer-column">
          <h4>Community</h4>
          <div className="footer-links vertical-links">
            <Link to={user ? '/explore' : '/login'}>About</Link>
            <Link to="/register">Join TechTalk</Link>
            <a href="mailto:hello@nexzibyte.com">Contact</a>
          </div>
        </div>

        <div className="footer-column">
          <h4>NEXZIBYTE</h4>
          <div className="footer-links social-links">
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://x.com" target="_blank" rel="noreferrer">X</a>
          </div>
        </div>
      </footer>
      <div className="footer-bottom">© 2026 NexziByte</div>
    </div>
  );
}

function HomePage({ user, posts }) {
  const featuredPosts = posts.slice(0, 4);
  const leadStory = featuredPosts[0];
  const secondaryStories = featuredPosts.slice(1, 4);

  return (
    <>
      <div className="breaking-bar">
        <span className="breaking-label">Trending now</span>
        <div className="breaking-marquee">
          <span>AI</span>
          <span>Startups</span>
          <span>Cybersecurity</span>
          <span>Future of technology</span>
          <span>Innovation</span>
          <span>Gadgets</span>
        </div>
      </div>

      <section className="hero-section editorial-hero">
        <div className="hero-copy">
          <span className="eyebrow">NEXZIBYTE PRESENTS</span>
          <h1>Where Technology Meets the People Building Tomorrow.</h1>
          <p>
            Discover breakthrough ideas, emerging technologies, industry voices, and conversations shaping the future.
          </p>
          <div className="cta-row">
            <Link className="primary-btn" to={user ? '/explore' : '/login'}>Explore TechTalk <ArrowRight size={15} /></Link>
            <Link className="secondary-btn" to="/register">Join the Community</Link>
          </div>
          <div className="stats-row">
            <div>
              <strong>28K+</strong>
              <span>Readers</span>
            </div>
            <div>
              <strong>96%</strong>
              <span>Signal quality</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-wrap">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80" alt="Technology editorial cover" />
          </div>
          <div className="hero-mini-stack">
            {secondaryStories.slice(0, 2).map((story) => (
              <div key={story.id} className="hero-mini-card">
                <span>{story.category}</span>
                <strong>{story.title}</strong>
              </div>
            ))}
          </div>
          <div className="hero-floating-card hero-featured-story">
            <span className="chip">Featured story</span>
            <strong>{leadStory?.title || 'The future of AI agents'}</strong>
            <small>{leadStory?.category || 'AI'} <span aria-hidden="true">•</span> {leadStory?.readTime || '6 min read'}</small>
          </div>
        </div>
      </section>

      <section className="content-section trust-strip">
        <div className="trust-strip-label">
          <span className="eyebrow">Trusted signal</span>
          <strong>Built for people shaping what comes next.</strong>
        </div>
        <div className="trust-metrics">
          <span><strong>28K+</strong> readers</span>
          <span><strong>140+</strong> contributors</span>
          <span><strong>96%</strong> signal quality</span>
          <span><strong>18</strong> technology categories</span>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">Trending topics</span>
            <h2>What leaders are watching right now</h2>
          </div>
        </div>
        <div className="trend-grid topic-pills">
          {[
            'Artificial Intelligence',
            'Cybersecurity',
            'Cloud Computing',
            'Startups',
            'Web Development',
            'Data Science',
            'Future of Work'
          ].map((item) => (
            <Link key={item} className="topic-pill" to={user ? '/explore' : '/login'}>{item}</Link>
          ))}
        </div>
      </section>

      <section className="content-section editorial-grid-section">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">Featured story</span>
            <h2>The story setting the agenda this week</h2>
          </div>
          <Link className="text-link" to={user ? '/explore' : '/login'}>View all stories <ArrowRight size={16} /></Link>
        </div>

        <div className="editorial-grid">
          <article className="feature-story card-surface">
            <img src={leadStory?.image} alt={leadStory?.title} />
            <div className="story-body">
              <span className="story-tag">{leadStory?.category}</span>
              <h3>{leadStory?.title}</h3>
              <p>{leadStory?.excerpt}</p>
              <div className="story-meta">
                <span>{leadStory?.author}</span>
                <span>{leadStory?.publishedAt}</span>
                <span>{leadStory?.readTime}</span>
              </div>
            </div>
          </article>

          <div className="stacked-story-list">
            {secondaryStories.slice(0, 2).map((post) => (
              <article key={post.id} className="mini-story card-surface">
                <img src={post.image} alt={post.title} />
                <div>
                  <span className="story-tag small-tag">{post.category}</span>
                  <h4>{post.title}</h4>
                  <div className="story-meta compact-meta">
                    <span>{post.author}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">Latest tech stories</span>
            <h2>Latest from TechTalk</h2>
          </div>
          <Link className="text-link" to={user ? '/explore' : '/login'}>Read the feed <ArrowRight size={16} /></Link>
        </div>
        <div className="latest-story-grid">
          {posts.slice(1, 4).map((post) => (
            <article key={post.id} className="latest-story-card">
              <img src={post.image} alt={post.title} />
              <div className="latest-story-content">
                <div className="latest-story-kicker">
                  <span>{post.category}</span>
                  <span aria-hidden="true">•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="latest-story-meta">
                  <span>{post.author}</span>
                  <span>{post.publishedAt}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section muted-section">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">Editor's picks</span>
            <h2>Stories worth your attention</h2>
          </div>
          <Link className="text-link" to={user ? '/explore' : '/login'}>Explore all picks <ArrowRight size={16} /></Link>
        </div>

        <div className="editors-picks-list">
          {[
            'The New Era of AI Infrastructure',
            'Why Cybersecurity Is Becoming Autonomous',
            'Building Products in the Age of AI',
            'What Developers Should Learn Next'
          ].map((title, index) => (
            <Link key={title} className="editors-pick-row" to={user ? '/explore' : '/login'}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{title}</strong>
              <ArrowRight size={18} />
            </Link>
          ))}
        </div>
      </section>

      <section className="content-section muted-section">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">Startups & innovation</span>
            <h2>Stories from founders building the future</h2>
          </div>
        </div>

        <div className="story-columns">
          <div className="story-column large">
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80" alt="Startup founders" />
            <div className="story-body">
              <span className="story-tag">Startups</span>
              <h3>What durable startup companies do differently in uncertain markets</h3>
              <p>Founders who win are not chasing momentum alone. They build clarity, operating rhythm and product trust.</p>
            </div>
          </div>

          <div className="story-column small-list">
            {[{ title: 'The funding climate keeps rewarding efficient growth', category: 'Business' }, { title: 'Why the best product teams design for trust from day one', category: 'Innovation' }, { title: 'New infrastructure tools are helping founders move faster', category: 'Technology' }].map((entry) => (
              <div key={entry.title} className="small-list-item">
                <span>{entry.category}</span>
                <strong>{entry.title}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">Cybersecurity</span>
            <h2>Security, trust and resilient digital systems</h2>
          </div>
        </div>

        <div className="security-panel card-surface">
          <div>
            <span className="story-tag">Cybersecurity</span>
            <h3>Security is no longer a backend concern — it is a product strategy issue.</h3>
            <p>Teams are rethinking security around user trust, resilient architecture and transparent governance.</p>
          </div>
          <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80" alt="Cybersecurity systems" />
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">The future</span>
            <h2>Beyond the next cycle: spaces, systems and human progress</h2>
          </div>
        </div>

        <div className="futuristic-grid">
          <div className="future-card feature-card card-surface">
            <span className="story-tag">Space + AI</span>
            <h3>New frontier technologies are changing the pace of scientific discovery</h3>
          </div>
          <div className="future-card card-surface">
            <span className="story-tag">Quantum</span>
            <h3>Why early experimentation matters in quantum infrastructure</h3>
          </div>
          <div className="future-card card-surface">
            <span className="story-tag">Robotics</span>
            <h3>Human-centered automation is becoming a design challenge</h3>
          </div>
        </div>
      </section>

      <section className="content-section muted-section community-section">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">Why join TechTalk</span>
            <h2>Technology Is Better When Ideas Are Shared.</h2>
          </div>
          <Link className="primary-btn" to={user ? '/profile' : '/register'}>{user ? 'Open your profile' : 'Join the community'}</Link>
        </div>
        <div className="feature-grid benefit-grid">
          {[
            { number: '01', title: 'Discover', text: 'Explore technology shaping the future.' },
            { number: '02', title: 'Learn', text: 'Access insights from builders and experts.' },
            { number: '03', title: 'Share', text: 'Publish your ideas and technical knowledge.' },
            { number: '04', title: 'Connect', text: 'Meet people building what comes next.' },
          ].map(({ number, title, text }) => (
            <article key={title} className="feature-card card-surface">
              <span className="benefit-number">{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section newsletter-box premium-newsletter">
        <div>
          <span className="eyebrow">Stay ahead of technology.</span>
          <h2>The most important conversations in technology, delivered directly to you.</h2>
        </div>
        <form className="newsletter-form">
          <input type="email" placeholder="Enter your email address" />
          <button type="button" className="primary-btn">Subscribe <ArrowRight size={15} /></button>
        </form>
      </section>
    </>
  );
}

function ExplorePage({ posts }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Latest');
  const [savedPosts, setSavedPosts] = useState([]);

  const categories = useMemo(() => ['All', ...new Set(posts.map((post) => post.category))], [posts]);

  const filteredPosts = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    const results = posts.filter((post) => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const haystack = `${post.title} ${post.excerpt} ${post.author} ${(post.tags || []).join(' ')}`.toLowerCase();
      const matchesQuery = !lowerQuery || haystack.includes(lowerQuery);
      return matchesCategory && matchesQuery;
    });

    switch (sortBy) {
      case 'Most liked':
        return [...results].sort((a, b) => (b.reactions || 0) - (a.reactions || 0));
      case 'Most commented':
        return [...results].sort((a, b) => (b.comments || 0) - (a.comments || 0));
      case 'Oldest':
        return [...results].sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
      case 'Latest':
      default:
        return [...results].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    }
  }, [posts, query, selectedCategory, sortBy]);

  const trendingTopics = ['AI', 'React', 'Cloud', 'Cybersecurity', 'Data Science', 'Web Development', 'Startups'];

  const toggleSave = (postId) => {
    setSavedPosts((current) => (current.includes(postId) ? current.filter((id) => id !== postId) : [...current, postId]));
  };

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

      <div className="sort-row">
        <label>
          Sort by
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option>Latest</option>
            <option>Most liked</option>
            <option>Most commented</option>
            <option>Oldest</option>
          </select>
        </label>
      </div>

      <div className="trending-strip">
        <span className="eyebrow subtle-eyebrow">Trending</span>
        <div className="trending-tags">
          {trendingTopics.map((topic) => <span key={topic} className="tag-pill">{topic}</span>)}
        </div>
      </div>

      <div className="post-grid">
        {filteredPosts.length ? filteredPosts.map((post) => <PostCard key={post.id} post={post} isSaved={savedPosts.includes(post.id)} onSave={toggleSave} />) : <EmptyState text="No posts match your filters." />}
      </div>
    </section>
  );
}

function PostDetailPage({ posts }) {
  const { postId } = useParams();
  const post = posts.find((item) => item.id === Number(postId));
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isReacted, setIsReacted] = useState(Boolean(post?.user_reacted));
  const [reactionCount, setReactionCount] = useState(post?.reactions || 0);
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    if (!post) return undefined;
    let ignore = false;
    apiService.getComments(post.id).then((loadedComments) => {
      if (!ignore) setComments(Array.isArray(loadedComments) ? loadedComments : []);
    });
    setIsReacted(Boolean(post.user_reacted));
    setReactionCount(post.reactions || 0);
    return () => {
      ignore = true;
    };
  }, [post?.id, post?.user_reacted, post?.reactions]);

  if (!post) return <EmptyState text="This post is not available." />;

  const relatedPosts = posts.filter((item) => item.id !== post.id).slice(0, 3);
  const handleReaction = async () => {
    if (!getAuthToken()) return;
    const nextReacted = !isReacted;
    setIsReacted(nextReacted);
    setReactionCount((count) => Math.max(0, count + (nextReacted ? 1 : -1)));
    const response = await apiService.toggleReaction(post.id);
    if (!response) {
      setIsReacted(!nextReacted);
      setReactionCount((count) => Math.max(0, count + (nextReacted ? -1 : 1)));
    }
  };
  const handleComment = async (event) => {
    event.preventDefault();
    const content = commentText.trim();
    if (!content || !getAuthToken()) return;
    setCommentError('');
    const savedComment = await apiService.addComment(post.id, content);
    if (!savedComment) {
      setCommentError('Unable to add your comment. Please try again.');
      return;
    }
    setComments((current) => [...current, savedComment]);
    setCommentText('');
  };

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

        <div className="article-actions article-actions-row">
          <button type="button" className={`ghost-btn${isReacted ? ' active-reaction' : ''}`} onClick={handleReaction}><Heart size={16} fill={isReacted ? 'currentColor' : 'none'} /> {reactionCount}</button>
          <button type="button" className="ghost-btn"><MessageSquare size={16} /> {comments.length || post.comments}</button>
          <button type="button" className="ghost-btn"><Share2 size={16} /> Share</button>
        </div>

        <div className="article-content">
          {(post.content || '').split('\n\n').map((paragraph, index) => <p key={`${post.id}-paragraph-${index}`}>{paragraph}</p>)}
        </div>

        <div className="toc-panel">
          <h3>Table of contents</h3>
          <ul>
            {(post.tags || []).slice(0, 4).map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
        </div>

        <section className="comments-section">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">Conversation</span>
              <h2>Comments</h2>
            </div>
          </div>
          <div className="comment-list">
            {comments.length ? comments.map((comment) => (
              <article key={comment.id} className="comment-item">
                <div className="avatar-circle small">{(comment.name || 'C').charAt(0)}</div>
                <div>
                  <div className="comment-meta"><strong>{comment.name || 'Community member'}</strong><span>{relativeTime(comment.created_at)}</span></div>
                  <p>{comment.content}</p>
                </div>
              </article>
            )) : <p className="muted-text">No comments yet. Start the conversation.</p>}
          </div>
          {getAuthToken() ? (
            <form className="comment-form" onSubmit={handleComment}>
              <textarea value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Share your perspective..." rows="4" />
              <button type="submit" className="primary-btn" disabled={!commentText.trim()}>Post comment</button>
              {commentError ? <p className="form-error">{commentError}</p> : null}
            </form>
          ) : <p className="muted-text">Sign in to join the conversation.</p>}
        </section>
      </article>

      <div className="related-posts">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">Related posts</span>
            <h2>More to read</h2>
          </div>
        </div>
        <div className="post-grid compact-grid">
          {relatedPosts.map((item) => <PostCard key={item.id} post={item} />)}
        </div>
      </div>
    </section>
  );
}

function SummitsPage({ summits, speakers, openCheckout }) {
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const upcomingSummits = (summits || []).filter((event) => event.status !== 'past');
  const pastSummits = (summits || []).filter((event) => event.status === 'past');
  const featuredSummit = (summits || [])[0] || null;
  const visibleSummits = activeFilter === 'upcoming' ? upcomingSummits : pastSummits;

  return (
    <section className="content-section">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">TechTalk summits</span>
          <h2>Learn from operators, founders and product leaders</h2>
        </div>
      </div>

      {featuredSummit ? (
        <div className="featured-event-panel card-surface">
          <img src={featuredSummit.banner} alt={featuredSummit.title} />
          <div className="featured-event-copy">
            <span className="chip">Featured summit</span>
            <h3>{featuredSummit.title}</h3>
            <p>{featuredSummit.description}</p>
            <div className="meta-list">
              <span><CalendarDays size={16} /> {featuredSummit.date}</span>
              <span><MapPin size={16} /> {featuredSummit.location}</span>
              <span><ShieldCheck size={16} /> {featuredSummit.status === 'past' ? 'Completed' : 'Registration open'}</span>
            </div>
            <button type="button" className="primary-btn" onClick={() => openCheckout?.(featuredSummit, 'Growth')}>Register</button>
          </div>
        </div>
      ) : null}

      <div className="toolbar-row">
        <div className="pill-group">
          <button type="button" className={activeFilter === 'upcoming' ? 'chip-btn active' : 'chip-btn'} onClick={() => setActiveFilter('upcoming')}>Upcoming</button>
          <button type="button" className={activeFilter === 'past' ? 'chip-btn active' : 'chip-btn'} onClick={() => setActiveFilter('past')}>Past</button>
        </div>
      </div>

      <div className="event-grid">
        {visibleSummits.length ? visibleSummits.map((event) => <EventCard key={event.id} event={event} type="summit" speakers={speakers} onCheckout={openCheckout} />) : <EmptyState text="No summits available in this section yet." />}
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
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const upcomingMeetups = (founderMeets || []).filter((event) => event.status !== 'past');
  const pastMeetups = (founderMeets || []).filter((event) => event.status === 'past');
  const featuredMeet = (founderMeets || [])[0] || null;
  const visibleMeetups = activeFilter === 'upcoming' ? upcomingMeetups : pastMeetups;

  return (
    <section className="content-section">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">Founder meets</span>
          <h2>High-intent conversations for builders and operators</h2>
        </div>
      </div>

      {featuredMeet ? (
        <div className="featured-event-panel card-surface">
          <img src={featuredMeet.banner} alt={featuredMeet.title} />
          <div className="featured-event-copy">
            <span className="chip">Featured founder meet</span>
            <h3>{featuredMeet.title}</h3>
            <p>{featuredMeet.description}</p>
            <div className="meta-list">
              <span><CalendarDays size={16} /> {featuredMeet.date}</span>
              <span><MapPin size={16} /> {featuredMeet.location}</span>
              <span><Compass size={16} /> {featuredMeet.networking_info}</span>
            </div>
            <button type="button" className="primary-btn" onClick={() => openCheckout?.(featuredMeet, 'Founder')}>Reserve spot</button>
          </div>
        </div>
      ) : null}

      <div className="toolbar-row">
        <div className="pill-group">
          <button type="button" className={activeFilter === 'upcoming' ? 'chip-btn active' : 'chip-btn'} onClick={() => setActiveFilter('upcoming')}>Upcoming</button>
          <button type="button" className={activeFilter === 'past' ? 'chip-btn active' : 'chip-btn'} onClick={() => setActiveFilter('past')}>Past</button>
        </div>
      </div>

      <div className="event-grid">
        {visibleMeetups.length ? visibleMeetups.map((event) => <EventCard key={event.id} event={event} type="founder" speakers={speakers} onCheckout={openCheckout} />) : <EmptyState text="No founder meets available in this section yet." />}
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
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'Artificial Intelligence',
    tags: '',
    coverImage: '',
    preview: false,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await apiService.createPost({
        title: form.title,
        content: form.content,
        category_id: 1,
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        image: form.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      });
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
          Tags
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="AI, UX, Product, Leadership" />
        </label>
        <label>
          Cover image URL
          <input name="coverImage" value={form.coverImage} onChange={handleChange} placeholder="https://example.com/cover.jpg" />
        </label>
        <label>
          Content
          <textarea name="content" value={form.content} onChange={handleChange} rows="10" placeholder="Write your article here..." />
        </label>

        <div className="preview-box">
          <h3>Preview</h3>
          <div className="preview-card">
            <span className="chip">{form.category}</span>
            <h4>{form.title || 'Untitled article'}</h4>
            <p>{form.content ? form.content.slice(0, 120) : 'Your story preview will appear here.'}</p>
          </div>
        </div>

        <div className="editor-actions">
          <label className="checkbox-inline"><input type="checkbox" name="preview" checked={form.preview} onChange={handleChange} /> Enable preview mode</label>
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
    title: 'Senior Product Strategist',
    email: 'aarav@techtalk.dev',
    bio: 'Product-minded technologist exploring AI, design and software systems.',
    skills: ['AI', 'React', 'Product strategy'],
    location: 'Hyderabad, India',
    links: { portfolio: 'https://example.com', linkedin: 'https://linkedin.com', x: 'https://x.com' },
  };

  return (
    <section className="content-section profile-page">
      <div className="profile-hero">
        <div className="avatar-large">{profile.name.charAt(0)}</div>
        <div>
          <span className="eyebrow">Profile</span>
          <h2>{profile.name}</h2>
          <p className="profile-title">{profile.title || 'Community member'}</p>
          <p>{profile.bio}</p>
          <div className="profile-meta">
            <span><Globe size={15} /> {profile.location || 'Remote'}</span>
            <span><Compass size={15} /> Product-minded engineer</span>
          </div>
          <div className="profile-links">
            {profile.links ? (
              <>
                <a href={profile.links.portfolio} target="_blank" rel="noreferrer">Portfolio</a>
                <a href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                <a href={profile.links.x} target="_blank" rel="noreferrer">X</a>
              </>
            ) : null}
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

      <div className="profile-stats">
        <div className="stat-box">
          <strong>{posts.length}</strong>
          <span>Published posts</span>
        </div>
        <div className="stat-box">
          <strong>7</strong>
          <span>Saved posts</span>
        </div>
        <div className="stat-box">
          <strong>3</strong>
          <span>Events joined</span>
        </div>
      </div>

      <div className="profile-actions">
        <Link className="secondary-btn" to="/my-posts">My Posts</Link>
        <Link className="secondary-btn" to="/saved-posts">Saved Posts</Link>
        <Link className="secondary-btn" to="/notifications">Notifications</Link>
        <Link className="secondary-btn" to="/settings">Settings</Link>
      </div>
    </section>
  );
}

function MyPostsPage({ posts }) {
  return (
    <section className="content-section">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">My Posts</span>
          <h2>Published and draft insights</h2>
        </div>
      </div>
      <div className="post-grid">
        {posts.slice(0, 3).map((post) => <PostCard key={post.id} post={post} />)}
      </div>
    </section>
  );
}

function SavedPostsPage({ posts }) {
  return (
    <section className="content-section">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">Saved Posts</span>
          <h2>Content you want to revisit</h2>
        </div>
      </div>
      <div className="post-grid">
        {posts.slice(1, 4).map((post) => <PostCard key={post.id} post={post} />)}
      </div>
    </section>
  );
}

function relativeTime(value) {
  if (!value) return '';
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    apiService.getNotifications().then((loaded) => {
      if (!ignore) {
        setNotifications(Array.isArray(loaded) ? loaded : []);
        setLoading(false);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const markRead = async (notification) => {
    if (notification.is_read) return;
    const updated = await apiService.markNotificationRead(notification.id);
    if (updated) setNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, is_read: true } : item));
  };

  const markAllRead = async () => {
    const result = await apiService.markAllNotificationsRead();
    if (result) setNotifications((current) => current.map((item) => ({ ...item, is_read: true })));
  };

  return (
    <section className="content-section">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">Notifications</span>
          <h2>Community updates</h2>
        </div>
        <button type="button" className="secondary-btn" onClick={markAllRead} disabled={!notifications.some((note) => !note.is_read)}>Mark all as read</button>
      </div>
      <div className="notification-list">
        {loading ? <p className="muted-text">Loading notifications...</p> : notifications.length ? notifications.map((note) => (
          <button type="button" key={note.id} className={`notification-item${note.is_read ? ' read' : ' unread'}`} onClick={() => markRead(note)}>
            <div className="notification-dot" />
            <div>
              <strong>{note.title}</strong>
              <p>{note.message}</p>
            </div>
            <span>{relativeTime(note.created_at)}</span>
          </button>
        )) : <p className="muted-text">You are all caught up.</p>}
      </div>
    </section>
  );
}

function SettingsPage() {
  return (
    <section className="content-section">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">Settings</span>
          <h2>Account preferences</h2>
        </div>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <h3>Profile settings</h3>
          <form className="editor-form compact-form">
            <label>
              Full name
              <input defaultValue="Aarav Nair" />
            </label>
            <label>
              Professional title
              <input defaultValue="Senior Product Strategist" />
            </label>
            <label>
              Bio
              <textarea rows="4" defaultValue="Product-minded technologist exploring AI, design and software systems." />
            </label>
            <label>
              Location
              <input defaultValue="Hyderabad, India" />
            </label>
          </form>
        </div>

        <div className="settings-card">
          <h3>Account settings</h3>
          <form className="editor-form compact-form">
            <label>
              Email
              <input type="email" defaultValue="aarav@techtalk.dev" />
            </label>
            <label>
              Preferred role
              <input defaultValue="Product leader" />
            </label>
            <label>
              Website
              <input defaultValue="https://example.com" />
            </label>
          </form>
        </div>

        <div className="settings-card">
          <h3>Notification preferences</h3>
          <div className="toggle-stack">
            <label className="checkbox-inline"><input type="checkbox" defaultChecked /> Comments and replies</label>
            <label className="checkbox-inline"><input type="checkbox" defaultChecked /> Event reminders</label>
            <label className="checkbox-inline"><input type="checkbox" defaultChecked /> Followers and community updates</label>
            <label className="checkbox-inline"><input type="checkbox" defaultChecked /> Registration updates</label>
          </div>
        </div>

        <div className="settings-card">
          <h3>Privacy & security</h3>
          <form className="editor-form compact-form">
            <label>
              Current password
              <input type="password" defaultValue="••••••••" />
            </label>
            <label>
              New password
              <input type="password" placeholder="Enter a new password" />
            </label>
            <label className="checkbox-inline"><input type="checkbox" defaultChecked /> Make profile visible to the public</label>
          </form>
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
      <div className="auth-shell">
        <div className="auth-spotlight">
          <span className="eyebrow">Member access</span>
          <h2>Access the next wave of product, AI, and startup intelligence.</h2>
          <p>Join a premium network of builders, founders, researchers, and operators shaping tomorrow’s technology decisions.</p>
          <ul>
            <li>Private event registrations</li>
            <li>Curated founder and speaker access</li>
            <li>Exclusive community updates</li>
          </ul>
        </div>

        <div className="auth-card">
          <span className="eyebrow">Welcome back</span>
          <h2>Log in to TechTalk</h2>
          <div className="auth-socials">
            <button type="button" className="secondary-btn full-width">Continue with LinkedIn</button>
            <div ref={googleButtonRef} className="google-auth-button" />
          </div>
          <p className="oauth-note">Google may show an unverified-app warning while this OAuth consent screen is in testing. Add your email as a test user in Google Cloud Console to continue.</p>
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
      </div>
    </section>
  );
}

function RegisterPage({ setUser }) {
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'Product Leader', terms: false });
  const [googleError, setGoogleError] = useState('');
  const [error, setError] = useState('');

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

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Please complete all required fields.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!form.terms) {
      setError('Please accept the terms and conditions to continue.');
      return;
    }

    try {
      await apiService.register({ ...form, role: form.role });
      const profile = await apiService.getCurrentUser();
      setUser(profile || { name: form.name, email: form.email, role: form.role });
      navigate('/profile');
    } catch {
      setUser({ name: form.name, email: form.email, role: form.role });
      navigate('/profile');
    }
  };

  return (
    <section className="content-section auth-page">
      <div className="auth-shell">
        <div className="auth-spotlight">
          <span className="eyebrow">Member access</span>
          <h2>Build a smarter network around your next breakthrough.</h2>
          <p>Create your profile to unlock founders, expert sessions, private events and premium learning opportunities.</p>
          <ul>
            <li>Join premium events</li>
            <li>Follow curated tech leaders</li>
            <li>Access community conversations</li>
          </ul>
        </div>

        <div className="auth-card">
          <span className="eyebrow">Join the community</span>
          <h2>Create your TechTalk account</h2>
          <div className="auth-socials">
            <div ref={googleButtonRef} className="google-auth-button" />
          </div>
          <p className="oauth-note">Google may show an unverified-app warning while this OAuth consent screen is in testing. Add your email as a test user in Google Cloud Console to continue.</p>
          {googleError ? <p className="form-error">{googleError}</p> : null}
          {error ? <p className="form-error">{error}</p> : null}
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
              Professional role
              <input value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} />
            </label>
            <label>
              Password
              <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            </label>
            <label>
              Confirm password
              <input type="password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} />
            </label>
            <div className="switch-row">
              <label className="checkbox-inline"><input type="checkbox" checked={form.terms} onChange={(event) => setForm({ ...form, terms: event.target.checked })} /> I agree to the terms and privacy policy</label>
            </div>
            <button type="submit" className="primary-btn">Create account</button>
          </form>
          <p className="auth-link">Already a member? <Link to="/login">Log in</Link></p>
        </div>
      </div>
    </section>
  );
}

function PostCard({ post, isSaved = false, onSave }) {
  const authorName = post.author || 'Community member';
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <article className="post-card">
      <div className="card-image-wrap">
        <img src={post.image} alt={post.title} />
        <button type="button" className={`save-btn${isSaved ? ' active' : ''}`} onClick={() => onSave?.(post.id)} aria-label="Save post">
          <Bookmark size={15} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="post-body">
        <div className="meta-row small-meta">
          <span className="chip">{post.category}</span>
          <span>{post.publishedAt}</span>
        </div>
        <Link className="post-title" to={`/posts/${post.id}`}>{post.title}</Link>
        <p>{post.excerpt}</p>
        <div className="tag-row compact-tags">
          {(post.tags || []).slice(0, 3).map((tag) => <span key={tag} className="tag-pill">{tag}</span>)}
        </div>
        <div className="post-footer">
          <div className="author-inline">
            <div className="avatar-circle small">{authorInitial}</div>
            <span>{authorName}</span>
          </div>
          <div className="stat-row">
            <span><Heart size={14} /> {post.reactions}</span>
            <span><MessageSquare size={14} /> {post.comments}</span>
          </div>
        </div>
        <div className="post-meta-row">
          <span>{post.readTime}</span>
          <span>{post.authorRole || 'Editor'}</span>
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
          <span>{event.status === 'past' ? 'Completed' : 'Registration open'}</span>
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
    <article className="speaker-card professional-speaker-card">
      <img src={speaker.photo} alt={speaker.name} />
      <div className="speaker-body">
        <h3>{speaker.name}</h3>
        <p className="speaker-role">{speaker.designation}</p>
        <p className="speaker-company">{speaker.company}</p>
        <p className="speaker-bio">{speaker.bio || 'Technology leader helping teams navigate product, leadership and innovation.'}</p>
        <div className="tag-row">
          {(speaker.expertise || []).slice(0, 3).map((item) => <span key={item} className="tag-pill">{item}</span>)}
        </div>
        <Link className="speaker-profile-link" to="/speakers">View profile <ArrowRight size={15} /></Link>
      </div>
    </article>
  );
}

function CheckoutModal({ event, plan, onClose }) {
  const [passType, setPassType] = useState('Visitor - Free');
  const [company, setCompany] = useState('');
  const [attendeeName, setAttendeeName] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const passCode = `TT-${event?.id || 'MEM'}-${(attendeeName || 'GUEST').replace(/\s+/g, '').slice(0, 5).toUpperCase()}`;

  if (confirmed) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="checkout-modal confirmation-modal" onClick={(eventObject) => eventObject.stopPropagation()}>
          <div className="modal-header">
            <div>
              <span className="eyebrow">Registration confirmed</span>
              <h3>Your access pass is ready.</h3>
            </div>
            <button type="button" className="ghost-btn" onClick={onClose}>Close</button>
          </div>
          <div className="pass-ticket">
            <div>
              <span className="chip">{passType}</span>
              <h4>{event?.title || `${plan} membership`}</h4>
              <p>{attendeeName || 'Registered attendee'}{company ? ` • ${company}` : ''}</p>
              <strong>{passCode}</strong>
            </div>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(passCode)}`} alt="Scannable event pass QR code" />
          </div>
        </div>
      </div>
    );
  }

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

          <form className="checkout-form" onSubmit={(eventObject) => { eventObject.preventDefault(); setConfirmed(true); }}>
            {event ? (
              <>
                <label>
                  Attendee name
                  <input type="text" value={attendeeName} onChange={(eventObject) => setAttendeeName(eventObject.target.value)} placeholder="Your full name" required />
                </label>
                <label>
                  Company name
                  <input type="text" value={company} onChange={(eventObject) => setCompany(eventObject.target.value)} placeholder="Company or organization" required />
                </label>
                <label>
                  Pass type
                  <select value={passType} onChange={(eventObject) => setPassType(eventObject.target.value)}>
                    <option>Visitor - Free</option>
                    <option>Delegate - ₹250</option>
                  </select>
                </label>
              </>
            ) : null}
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
            <button type="submit" className="primary-btn full-width">Complete registration</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return <div className="empty-state">{text}</div>;
}

function ScannerPage() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);

  const verifyPass = (event) => {
    event.preventDefault();
    const normalized = code.trim();
    if (!normalized) {
      setResult({ valid: false, message: 'Enter a pass code to verify.' });
      return;
    }
    setResult({
      valid: normalized.toUpperCase().startsWith('TT-'),
      message: normalized.toUpperCase().startsWith('TT-')
        ? 'Pass verified. Allow entry and confirm the attendee details.'
        : 'Pass not recognized. Check the QR code or pass ID and try again.',
    });
  };

  return (
    <section className="content-section scanner-page">
      <div className="scanner-intro">
        <span className="eyebrow">Event operations</span>
        <h2>Scan and verify event passes.</h2>
        <p>Use the pass ID encoded in a registration QR code to validate attendee access at the door.</p>
      </div>
      <div className="scanner-layout">
        <div className="scanner-frame">
          <div className="scanner-corner scanner-corner-top" />
          <div className="scanner-line" />
          <strong>Ready to scan</strong>
          <span>Camera integration can be connected to the production scanner device.</span>
        </div>
        <form className="scanner-form" onSubmit={verifyPass}>
          <label>
            Pass ID
            <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="TT-2026-001" />
          </label>
          <button type="submit" className="primary-btn">Verify pass</button>
          {result ? <div className={`scanner-result${result.valid ? ' valid' : ' invalid'}`}>{result.message}</div> : null}
        </form>
      </div>
    </section>
  );
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
