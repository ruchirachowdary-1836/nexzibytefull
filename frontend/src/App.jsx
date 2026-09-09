import { useCallback, useEffect, useMemo, useState } from 'react';
import { SignInButton, SignUpButton } from '@clerk/react';
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
  { to: '/explore', label: 'Community', requiresAuth: true },
  { to: '/services', label: 'Services', requiresAuth: false },
  { to: '/founder-meets', label: 'Resources', requiresAuth: true },
  { to: '/speakers', label: 'About', requiresAuth: true },
  { to: '/pricing', label: 'Partner', requiresAuth: false },
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

function App({ clerkUser = null, onClerkSignOut }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(mockData.posts);
  const [speakers, setSpeakers] = useState(mockData.speakers);
  const [summits, setSummits] = useState(mockData.summits);
  const [founderMeets, setFounderMeets] = useState(mockData.founderMeets);
  const [checkoutEvent, setCheckoutEvent] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Growth');

  useEffect(() => {
    if (clerkUser) {
      setUser(clerkUser);
    } else if (user?.isClerkUser) {
      setUser(null);
    }
  }, [clerkUser]);

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
    if (onClerkSignOut && clerkUser) {
      void onClerkSignOut();
    }
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
          <Route path="/services" element={<ServicesPage user={user} />} />
          <Route path="/services/cv-linkedin-review" element={<CvLinkedinReviewPage user={user} />} />
          <Route path="/services/individual-coaching" element={<IndividualCoachingPage user={user} />} />
          <Route path="/resources/resource-center" element={<ResourceCenterPage />} />
          <Route path="/resources/success-stories" element={<SuccessStoriesPage />} />
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
          <span className="brand-mark">T</span>
          <span className="brand-name">Tech<span>Talk</span></span>
          <span className="brand-product">/ NEXZIBYTE</span>
        </Link>

        <nav className={`main-nav${mobileMenuOpen ? ' open' : ''}`} aria-label="Primary navigation">
          {siteSections.map((section) => {
            const target = !user && section.requiresAuth ? '/login' : section.to;

            if (section.label === 'Community') {
              return (
                <div key={section.label} className="nav-dropdown">
                  <NavLink
                    to={target}
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Community <span className="nav-caret">⌄</span>
                  </NavLink>
                  <div className="nav-dropdown-menu">
                    <Link to={user ? '/summits' : '/login'} onClick={() => setMobileMenuOpen(false)}>
                      <strong>Events</strong>
                      <span>Explore career-growth events</span>
                      <ArrowRight size={18} />
                    </Link>
                    <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>
                      <strong>Pricing</strong>
                      <span>Find out pricing options</span>
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              );
            }

            if (section.label === 'Resources') {
              return (
                <div key={section.label} className="nav-dropdown">
                  <NavLink to={target} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} onClick={() => setMobileMenuOpen(false)}>
                    Resources <span className="nav-caret">⌄</span>
                  </NavLink>
                  <div className="nav-dropdown-menu">
                    <Link to="/resources/resource-center" onClick={() => setMobileMenuOpen(false)}><strong>Resource Center</strong><span>Tools for your next move</span><ArrowRight size={18} /></Link>
                    <Link to="/resources/success-stories" onClick={() => setMobileMenuOpen(false)}><strong>Success Stories</strong><span>See member career wins</span><ArrowRight size={18} /></Link>
                  </div>
                </div>
              );
            }

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
              <button type="button" className="primary-btn small" onClick={onLogout}>Sign out</button>
            </>
          ) : (
            <>
              {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? (
                <>
                  <SignInButton mode="modal">
                    <button type="button" className="sign-in-link">Login</button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button type="button" className="primary-btn small join-community-btn">Join community <ArrowRight size={14} /></button>
                  </SignUpButton>
                </>
              ) : (
                <>
                  <Link className="sign-in-link" to="/login">Login</Link>
                  <Link className="primary-btn small join-community-btn" to="/register">Join community <ArrowRight size={14} /></Link>
                </>
              )}
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
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="career-home">
      <section className="career-hero">
        <div className="career-hero-copy">
          <span className="career-kicker">NEXZIBYTE / TECHTALK</span>
          <h1>Build &amp;<br />grow your<br /><em>career.</em></h1>
          <p>Join a focused community for builders, founders and technology professionals who want better opportunities and stronger momentum.</p>
          <div className="career-hero-actions">
            <Link className="career-lilac-btn" to={user ? '/profile' : '/register'}>{user ? 'Open your profile' : 'Become a member'} <ArrowRight size={19} /></Link>
            <span className="career-sticker">FOR PEOPLE IN TECH</span>
          </div>
        </div>
        <div className="career-hero-art">
          <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=85" alt="Technology team collaborating" />
          <div className="career-hero-overlay">Your next<br /><strong>move starts here.</strong></div>
        </div>
      </section>

      <section className="career-proof">
        <div className="career-proof-copy">
          <h2>Join a growing network <mark>accelerating</mark> their careers in tech.</h2>
          <div className="career-company-pills">
            {['AI builders', 'Product teams', 'Cloud leaders', 'Startup founders', 'Growth operators', 'Engineering'].map((label) => <span key={label}>{label}</span>)}
          </div>
        </div>
        <div className="career-proof-metrics">
          {[
            ['28K+', 'readers'],
            ['140+', 'contributors'],
            ['30+', 'community events'],
            ['18', 'tech categories'],
          ].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
        </div>
      </section>

      <section className="career-service-grid">
        <div className="career-service-art">
          <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85" alt="Technology leaders in a working session" />
        </div>
        <article className="career-service-copy">
          <span className="career-service-tag">Get hired</span>
          <h2>Set the foundation<br />&amp; get noticed.</h2>
          <p>Build a sharper professional story with practical insights, expert content, templates and community guidance for your next opportunity.</p>
          <Link className="career-outline-btn" to={user ? '/explore' : '/login'}>Explore the knowledge feed <ArrowRight size={17} /></Link>
        </article>
        <article className="career-service-copy">
          <span className="career-service-tag">Grow further</span>
          <h2>Turn good work<br />into real momentum.</h2>
          <p>Learn how to communicate impact, lead better conversations and grow with role-specific perspectives from people doing the work.</p>
          <Link className="career-outline-btn" to={user ? '/summits' : '/login'}>See upcoming conversations <ArrowRight size={17} /></Link>
        </article>
        <div className="career-service-art">
          <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=85" alt="Community networking event" />
        </div>
      </section>

      <section className="career-accelerator">
        <div>
          <span className="career-kicker">More than a community</span>
          <h2>We are your<br /><mark>career accelerator.</mark></h2>
        </div>
        <p>Whether you are switching careers, navigating your first technology role or chasing your next promotion, TechTalk gives you the signal, support and people to keep moving.</p>
      </section>

      <section className="career-membership">
        <div className="career-membership-heading">
          <span className="career-kicker">What you get with membership</span>
          <h2>Learn. Apply.<br /><mark>Execute.</mark></h2>
        </div>
        <div className="career-benefit-list">
          {[
            ['01', 'Learn', 'Weekly briefings, practical workshops and expert-led conversations that keep your skills current.'],
            ['02', 'Apply', 'Role-specific playbooks, templates and frameworks you can use in your next interview or project.'],
            ['03', 'Execute', 'A focused resource library and accountability system to turn good intentions into progress.'],
            ['04', 'Improve', 'Feedback from experienced builders and thoughtful peers when you need a second perspective.'],
            ['05', 'Connect', 'Founder meets, summits and small-group conversations built for meaningful relationships.'],
          ].map(([number, title, text]) => (
            <article key={number} className="career-benefit-row">
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <ArrowRight size={20} />
            </article>
          ))}
        </div>
      </section>

      <section className="career-stories">
        <div className="career-stories-heading">
          <span className="career-kicker">Member perspective</span>
          <h2>See how focused<br /><mark>community</mark> creates momentum.</h2>
        </div>
        <div className="career-story-grid">
          {testimonials.map((testimonial, index) => (
            <article key={testimonial.name} className="career-story-card">
              <div className="career-story-number">0{index + 1}</div>
              <p>“{testimonial.quote}”</p>
              <div>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="career-membership-cta">
        <div>
          <span className="career-kicker">Join TechTalk today</span>
          <h2>Invest in your<br /><em>next move.</em></h2>
          <p>Get expert-led sessions, practical resources, private events and a community that keeps you accountable.</p>
          <Link className="career-dark-btn" to={user ? '/pricing' : '/register'}>{user ? 'View membership' : 'Become a member'} <ArrowRight size={19} /></Link>
        </div>
        <div className="career-membership-price">
          <strong>$49</strong>
          <span>monthly membership</span>
          <small>Cancel whenever you need.</small>
        </div>
      </section>

      <section className="career-faq">
        <div className="career-faq-heading">
          <span className="career-kicker">Questions, answered</span>
          <h2>Frequently<br /><mark>asked.</mark></h2>
        </div>
        <div className="career-faq-list">
          {faqs.map((faq, index) => (
            <div key={faq.q} className={`career-faq-item${openFaq === index ? ' open' : ''}`}>
              <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                <span>{faq.q}</span>
                <span className="career-faq-icon">{openFaq === index ? '−' : '+'}</span>
              </button>
              {openFaq === index ? <p>{faq.a}</p> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="career-final-cta">
        <span className="career-kicker">Your next chapter</span>
        <h2>Make your next move<br /><em>count.</em></h2>
        <Link className="career-dark-btn" to={user ? '/profile' : '/register'}>Join the community <ArrowRight size={19} /></Link>
      </section>
    </div>
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
    <div className="events-page">
      <section className="events-intro">
        <span className="career-kicker">NEXZIBYTE / COMMUNITY</span>
        <h1>Join our next<br /><mark>event.</mark></h1>
        <p>Meet the people building what comes next. Join practical conversations, founder rooms and high-signal events designed to move your career forward.</p>
      </section>

      <section className="events-upcoming">
        <div className="events-section-title">
          <h2><mark>Upcoming</mark> events</h2>
          <div className="events-filter">
            <button type="button" className={activeFilter === 'upcoming' ? 'active' : ''} onClick={() => setActiveFilter('upcoming')}>Upcoming</button>
            <button type="button" className={activeFilter === 'past' ? 'active' : ''} onClick={() => setActiveFilter('past')}>Past</button>
          </div>
        </div>
        {featuredSummit && activeFilter === 'upcoming' ? (
          <article className="events-featured-card">
            <div className="events-featured-image"><img src={featuredSummit.banner} alt={featuredSummit.title} /></div>
            <div className="events-featured-copy">
              <div className="events-tags"><span>In-person</span><span>Career growth</span><span>Community</span></div>
              <h3>{featuredSummit.title}</h3>
              <p>{featuredSummit.description}</p>
              <div className="events-date"><CalendarDays size={16} /> {featuredSummit.date} <span>•</span> {featuredSummit.location}</div>
              <button type="button" className="career-lilac-btn" onClick={() => openCheckout?.(featuredSummit, 'Growth')}>Sign up to join <ArrowRight size={18} /></button>
            </div>
          </article>
        ) : null}
      </section>

      <section className="events-grid-section">
        <div className="events-section-title">
          <h2>{activeFilter === 'upcoming' ? 'More ways to connect' : <><mark>Past</mark> events</>}</h2>
        </div>
        <div className="events-card-grid">
          {visibleSummits.length ? visibleSummits.map((event) => (
            <article key={event.id} className="events-dark-card">
              <div className="events-card-accent" />
              <div className="events-tags"><span>{event.status === 'past' ? 'Webinar' : 'In-person'}</span><span>Career growth</span></div>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div className="events-date"><CalendarDays size={16} /> {event.date} <span>•</span> {event.location}</div>
              <button type="button" className="career-lilac-btn" onClick={() => openCheckout?.(event, 'Growth')}>Sign up to join <ArrowRight size={17} /></button>
            </article>
          )) : <EmptyState text={`No ${activeFilter} events available yet.`} />}
        </div>
      </section>

      <section className="events-newsletter">
        <div>
          <span className="career-kicker">Stay in the loop</span>
          <h2>Sign up for our<br /><mark>newsletter.</mark></h2>
        </div>
        <div>
          <p>Get weekly event alerts, practical career advice and behind-the-scenes updates from the TechTalk community.</p>
          <form className="events-newsletter-form">
            <input type="email" placeholder="Enter email address" aria-label="Email address" />
            <button type="button" className="career-dark-btn">Subscribe <ArrowRight size={17} /></button>
          </form>
        </div>
      </section>
    </div>
  );
}

function ServicesPage({ user }) {
  return (
    <div className="services-page">
      <section className="services-hero">
        <span className="career-kicker">NEXZIBYTE / SERVICES</span>
        <h1>Make your next<br /><mark>move count.</mark></h1>
        <p>Practical, personal support to help you present your experience with confidence and make progress in your career.</p>
      </section>

      <section className="services-list">
        <article className="service-feature-card">
          <div className="service-feature-number">01</div>
          <div className="service-feature-copy">
            <span className="career-service-tag">Get noticed</span>
            <h2>CV &amp; LinkedIn<br /><mark>review.</mark></h2>
            <p>Turn your experience into a clear, compelling professional story. Get focused feedback on your CV and LinkedIn profile so the right opportunities can find you.</p>
            <ul>
              <li><Check size={17} /> Detailed CV structure and content feedback</li>
              <li><Check size={17} /> LinkedIn headline, profile and positioning review</li>
              <li><Check size={17} /> Practical edits you can apply immediately</li>
            </ul>
            <Link className="career-dark-btn service-action" to="/services/cv-linkedin-review">Book your review <ArrowRight size={17} /></Link>
          </div>
          <div className="service-feature-art service-review-art" aria-hidden="true">
            <span>YOUR<br /><em>story</em><br />deserves<br />to be seen.</span>
          </div>
        </article>

        <article className="service-feature-card service-coaching-card">
          <div className="service-feature-number">02</div>
          <div className="service-feature-copy">
            <span className="career-service-tag">Go further</span>
            <h2>Individual<br /><mark>coaching.</mark></h2>
            <p>Get a focused thought partner for your next career move. Work through decisions, prepare for important conversations and leave with a plan you can act on.</p>
            <ul>
              <li><Check size={17} /> One-to-one support built around your goals</li>
              <li><Check size={17} /> Interview, promotion and career-change preparation</li>
              <li><Check size={17} /> Clear next steps and accountability</li>
            </ul>
            <Link className="career-lilac-btn service-action" to="/services/individual-coaching">Explore coaching <ArrowRight size={17} /></Link>
          </div>
          <div className="service-feature-art service-coaching-art" aria-hidden="true">
            <span>BUILD<br /><em>your</em><br />next<br />chapter.</span>
          </div>
        </article>
      </section>

      <section className="services-cta">
        <span className="career-kicker">Not sure where to start?</span>
        <h2>Start with the move<br /><mark>that feels right.</mark></h2>
        <Link className="career-dark-btn" to={user ? '/pricing' : '/login'}>Talk to the community <ArrowRight size={17} /></Link>
      </section>
    </div>
  );
}

function CvLinkedinReviewPage({ user }) {
  const [openQuestion, setOpenQuestion] = useState(0);
  const reviewFaqs = [
    { q: 'How long does it take to get my review?', a: 'Your review is delivered within 5 to 7 working days. We will keep you updated as soon as your feedback is ready.' },
    { q: 'Do we need to have a call before the review?', a: 'No call is required. You share your CV and LinkedIn profile through the booking flow, and our reviewers work from your goals and experience.' },
    { q: 'Who will be reviewing my CV and LinkedIn?', a: 'Your materials are reviewed by experienced career professionals who understand hiring, positioning and what makes profiles stand out.' },
    { q: 'Can I get support after the review is complete?', a: 'Yes. Your review includes clear next steps, and you can continue with individual coaching if you want deeper support.' },
    { q: 'Do I need previous experience to book a review?', a: 'Not at all. The review is useful whether you are starting out, changing direction or preparing for your next senior opportunity.' },
  ];

  return (
    <div className="cv-review-page">
      <section className="cv-review-hero">
        <div className="cv-review-hero-copy">
          <span className="career-kicker">NEXZIBYTE / PROFILE REVIEW</span>
          <h1><mark>Elevate</mark> your<br />professional<br />profile.</h1>
          <p>From crafting a standout CV to building an optimised LinkedIn profile, we help you set the right foundations to get noticed and land more interviews.</p>
        </div>
        <div className="review-profile-card review-card-one"><strong>PRIYA PATEL</strong><span>Business Analyst</span><em>LinkedIn Optimised</em></div>
        <div className="review-profile-card review-card-two"><strong>LAURA GARCIA</strong><span>Marketing Executive</span><em>CV Reviewed</em></div>
        <div className="review-profile-card review-card-three"><strong>JULIE TESSE</strong><span>Software Engineer</span><em>CV Reviewed</em></div>
        <div className="review-profile-card review-card-four"><strong>JANE LEE</strong><span>Head of Sales</span><em>LinkedIn Optimised</em></div>
      </section>

      <section className="cv-review-trust">
        <h2>Trusted by <mark>400+ job seekers</mark><br />who have landed interviews at</h2>
        <div className="review-company-list"><span>HubSpot</span><span>Salesforce</span><span>Google</span><span>Amazon</span><span>TikTok</span><span>Atlassian</span></div>
      </section>

      <section className="cv-review-work">
        <div className="cv-review-work-heading">
          <span className="career-kicker">Make your profile work for you</span>
          <h2>A clearer story.<br /><mark>More opportunity.</mark></h2>
        </div>
        <div className="cv-review-feature-grid">
          <div className="cv-review-image review-image-profile"><img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1000&q=85" alt="CV and profile review workspace" /></div>
          <article><span>Visibility</span><h3>Optimise your LinkedIn for search</h3><p>Make your profile easier for the right recruiters and hiring managers to find.</p><ul><li>Relevant profile positioning</li><li>Stronger sections that show value</li><li>Clear formatting that boosts engagement</li></ul></article>
          <article><span>Story</span><h3>Tell the right story in your CV</h3><p>Turn your experience into a focused, compelling narrative that helps you stand out.</p><ul><li>Achievement-led content</li><li>Role-specific language</li><li>Impact that hiring teams can see</li></ul></article>
          <div className="cv-review-image review-image-writing"><img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=85" alt="Professional preparing a CV" /></div>
        </div>
        <Link className="career-lilac-btn" to={user ? '/pricing' : '/login'}>Get your review <ArrowRight size={17} /></Link>
      </section>

      <section className="cv-review-process">
        <div><span className="career-kicker">Simple, focused support</span><h2>This is how<br /><mark>it works.</mark></h2></div>
        <div className="cv-review-steps"><article><strong>01</strong><h3>Share your goals</h3><p>Tell us what you are aiming for and send your current CV and LinkedIn profile.</p></article><article><strong>02</strong><h3>Receive expert feedback</h3><p>We review your materials and highlight exactly what to improve and why.</p></article><article><strong>03</strong><h3>Make your next move</h3><p>Apply the changes with confidence and start showing up for the right opportunities.</p></article></div>
      </section>

      <section className="cv-review-faq">
        <div><span className="career-kicker">Frequently asked</span><h2>Your questions,<br /><mark>answered.</mark></h2></div>
        <div className="career-faq-list">{reviewFaqs.map((faq, index) => <div key={faq.q} className={`career-faq-item${openQuestion === index ? ' open' : ''}`}><button type="button" onClick={() => setOpenQuestion(openQuestion === index ? -1 : index)}><span>{faq.q}</span><span className="career-faq-icon">{openQuestion === index ? '−' : '+'}</span></button>{openQuestion === index ? <p>{faq.a}</p> : null}</div>)}</div>
      </section>

      <section className="cv-review-newsletter"><div><h2>Sign up to our<br />newsletter.</h2><span>Join 35,000 subscribers</span></div><div><p>Get weekly career advice, practical strategies and behind-the-scenes updates to help you keep moving forward.</p><form><input type="email" placeholder="Enter email address" aria-label="Email address" /><button type="button">Subscribe <ArrowRight size={15} /></button></form></div></section>
    </div>
  );
}

function IndividualCoachingPage({ user }) {
  const pillars = [
    ['Pillar 1', 'Finding the perfect role', 'Clarify your direction and build a search strategy around the opportunities that fit you.'],
    ['Pillar 2', 'Building an amazing CV', 'Position your experience with an achievement-led CV that gets read.'],
    ['Pillar 3', 'Optimising your LinkedIn profile', 'Become easier to find and easier to trust with a clear professional presence.'],
    ['Pillar 4', 'Mastering networking', 'Build relationships that create momentum and lead to better conversations.'],
    ['Pillar 5', 'Preparing for interviews', 'Practice your story, sharpen your answers and show up with confidence.'],
  ];
  const benefits = [
    ['Individual strategy session', 'Start with a personalised one-to-one session to define your goals and create a tailored action plan.'],
    ['CV & LinkedIn review', 'Get expert feedback to make your profile and experience clear to the right people.'],
    ['Unlimited support', 'Keep momentum with ongoing support, check-ins and advice whenever you need it.'],
    ['Interview preparation', 'Prepare for success with practice, feedback and practical interview techniques.'],
    ['Career accelerator programme', 'Access focused learning on networking, applications, negotiation and career growth.'],
    ['Community access', 'Join a supportive network of professionals who share insight, encouragement and opportunities.'],
  ];

  return (
    <div className="coaching-page">
      <section className="coaching-hero">
        <span className="career-kicker">NEXZIBYTE / INDIVIDUAL COACHING</span>
        <h1>Everything you<br />need <mark>to get hired.</mark></h1>
        <p>Whether you are struggling to stand out or do not know where to start, our coaching programme is designed to accelerate your job search and get you hired.</p>
        <div className="coaching-proof-cards">{['Tomi Adeleke', 'Malatika K', 'Mia I', 'Yasmin M', 'Tadiwa M', 'Alex P', 'Anna G', 'Liam Carter'].map((name, index) => <div key={name} style={{ transform: `rotate(${index % 2 ? 5 : -5}deg)` }}><strong>{name}</strong><span>{['Software Engineer', 'Account Manager', 'Product Designer', 'Programme Manager'][index % 4]}</span><em>{['Hired in under 2 weeks', '3 job offers secured', '2 offers in 2 months', 'Offer accepted'][index % 4]}</em></div>)}</div>
      </section>

      <section className="coaching-trust"><h2>Join <mark>220+ applicants</mark> we have helped get hired at</h2><div className="review-company-list"><span>HubSpot</span><span>Salesforce</span><span>Google</span><span>Amazon</span><span>Leapwork</span><span>TikTok</span></div></section>

      <section className="coaching-pillars"><div><span className="career-kicker">A strategy built around you</span><h2>Our coaching<br /><mark>programmes.</mark></h2><p>Landing your dream job is not just about submitting countless applications. It is about standing out at every stage of the process. Our structured framework helps you build confidence and land your ideal role.</p></div><div className="coaching-pillar-grid">{pillars.map(([label, title, text]) => <article key={label}><span>{label}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className="coaching-accelerator"><div><h2>Accelerating careers,<br /><mark>one job at a time.</mark></h2><p>We have helped job seekers secure positions at ambitious startups and technology companies across the world.</p></div><div className="coaching-metrics"><strong>8X<span>increase in interviews</span></strong><strong>&lt;1 WEEK<span>to land first interview</span></strong><strong>85%<span>get a job offer in 3 months</span></strong></div></section>

      <section className="coaching-benefits"><span className="career-kicker">Everything you need to get hired, all in one place</span><h2>Support that keeps<br /><mark>you moving.</mark></h2><div className="coaching-benefit-grid">{benefits.map(([title, text], index) => <article key={title}><b>{String(index + 1).padStart(2, '0')}</b><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className="coaching-packages"><span className="career-kicker">Choose your programme</span><h2>Invest in your<br /><mark>next chapter.</mark></h2><div className="coaching-package-grid">{[['Starter', '£599', 'Land interviews'], ['Ultimate', '£1,199', 'Land a job offer']].map(([name, price, outcome]) => <article key={name}><span>{name}</span><mark>{outcome}</mark><strong>{price}</strong><ul>{['1:1 strategy session', 'CV & LinkedIn review', 'Progress check-in sessions', 'Unlimited support', 'Community access'].map((item) => <li key={item}><Check size={15} /> {item}</li>)}</ul><Link className="career-lime-btn" to={user ? '/pricing' : '/login'}>Join the {name} programme <ArrowRight size={16} /></Link></article>)}</div></section>

      <section className="coaching-community"><div><span className="career-kicker">Keep growing with us</span><h2>Join the TechTalk<br /><mark>community.</mark></h2><p>Get expert-led webinars, practical workshops, templates, member discounts and accountability support alongside your coaching.</p><Link className="career-lime-btn" to={user ? '/pricing' : '/login'}>Join the community now <ArrowRight size={16} /></Link></div><div className="coaching-community-art">YOUR<br /><em>next</em><br />chapter.</div></section>
    </div>
  );
}

function ResourceCenterPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const resources = [
    ['CV templates', 'Job seekers', 'Download ATS-friendly templates you can use in your next application.'],
    ['Interview questions', 'Job seekers', 'Prepare for your next interview with commonly asked questions.'],
    ['Interview answers', 'Job seekers', 'Learn how to answer interview questions using a clear STAR method.'],
    ['LinkedIn optimiser', 'Career growth', 'Improve your profile positioning and become easier to find.'],
    ['Cover letter template', 'Job seekers', 'Tell a focused story that connects your experience to the role.'],
    ['Career planning guide', 'Career growth', 'Build a practical plan for your next 90 days of growth.'],
  ];
  const visibleResources = activeFilter === 'All' ? resources : resources.filter((resource) => resource[1] === activeFilter);

  return (
    <div className="resource-center-page">
      <section className="resource-center-hero">
        <span className="career-kicker">NEXZIBYTE / RESOURCES</span>
        <h1>Resource<br /><mark>center.</mark></h1>
        <p>Essential tools and resources for job seekers and career growth.</p>
        <div className="resource-filters">{['All', 'Job seekers', 'Career growth'].map((filter) => <button key={filter} type="button" className={activeFilter === filter ? 'active' : ''} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div>
      </section>
      <section className="resource-card-grid">{visibleResources.map(([title, category, description], index) => <article key={title}><div className="resource-card-art"><span>{title}</span></div><div className="resource-card-copy"><small>{category}</small><p>{description}</p><button type="button" className="career-lilac-btn">Download <ArrowRight size={16} /></button></div></article>)}</section>
    </div>
  );
}

function SuccessStoriesPage() {
  const stories = [
    ['From application to offer in under 2 weeks', 'Tatiana L', 'Customer'],
    ['From Argentina to London with visa sponsorship', 'Florencia M', 'Finance'],
    ['From career pivot to job offer in 1 month', 'Charmaine W', 'Operations'],
    ['One job offer from messaging the right person', 'Daniel R', 'Tech sales'],
    ['One job offer from the hidden job market', 'Aisha K', 'Product'],
    ['From KFC to tech sales in 2 weeks', 'Tadiwa M', 'Tech sales'],
  ];
  return (
    <div className="success-stories-page">
      <section className="success-stories-hero"><span className="career-kicker">NEXZIBYTE / COMMUNITY</span><h1>Meet our<br /><mark>success stories.</mark></h1><p>See how TechTalk has shaped real careers.</p><div className="resource-filters"><button type="button" className="active">All</button><button type="button">Marketing</button><button type="button">Customer</button><button type="button">Finance</button><button type="button">Tech</button></div></section>
      <section className="success-story-grid">{stories.map(([headline, name, role], index) => <article key={name}><div className={`success-story-art story-tone-${index % 3}`}><h2>{headline}</h2><span>{role}</span></div><div className="success-story-copy"><small>{role}</small><h3>{name}</h3><button type="button" className="career-lilac-btn">Read story <ArrowRight size={16} /></button></div></article>)}</section>
    </div>
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
                <div className="mini-speaker-placeholder" aria-hidden="true" />
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
  const [openQuestion, setOpenQuestion] = useState(0);
  const benefits = [
    ['Access the full TechTalk community', 'Connect with people across product, marketing, sales and engineering. Learn from others, share wins and grow together.'],
    ['Live weekly sessions with industry leaders', 'Join practical sessions with recruiters, hiring managers, founders and top performers who share what it really takes to grow.'],
    ['Monthly in-person events', 'Build real relationships with peers, mentors and people working at ambitious technology companies.'],
    ['High-quality feedback from experts', 'Get thoughtful feedback on your CV, LinkedIn profile and professional story before your next move.'],
    ['Weekly Q&A and strategy calls', 'Ask questions, get unstuck and leave with clear next steps for your career journey.'],
    ['Role-specific templates and resources', 'Use practical tools for applications, negotiations, performance reviews and career planning.'],
  ];

  return (
    <div className="pricing-reference-page">
      <section className="pricing-hero">
        <span className="career-kicker">NEXZIBYTE / MEMBERSHIP</span>
        <h1>Join the TechTalk<br /><mark>community today.</mark></h1>
        <div className="pricing-plan-grid">
          {pricingPlans.slice(0, 2).map((plan, index) => (
            <article key={plan.name} className={`pricing-reference-card${index === 1 ? ' light' : ''}`}>
              <span className="pricing-plan-label">{index === 0 ? 'Job seeker hub' : 'Career growth hub'}</span>
              <div className="pricing-reference-price">{index === 0 ? '$49' : '$140'} <span>/ {index === 0 ? 'month' : 'quarter'}</span></div>
              <span className="pricing-highlight">{index === 0 ? 'Get hired' : 'Level up'}</span>
              <ul>
                {plan.perks.concat(index === 0 ? ['Accountability groups to stay motivated', 'Individual support from career coaches'] : ['Career growth resources', 'Upskill Lab for new AI skills']).slice(0, 7).map((perk) => <li key={perk}><Check size={16} /> {perk}</li>)}
              </ul>
              <button type="button" className="career-lilac-btn" onClick={() => openCheckout(null, plan.name)}>Become a full member <ArrowRight size={17} /></button>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-benefits">
        <span className="career-kicker">Membership benefits</span>
        <h2>Everything you need to get<br /><mark>hired, grow and thrive.</mark></h2>
        <div className="pricing-benefit-grid">
          {benefits.map(([title, text], index) => (
            <article key={title}>
              <span className="pricing-benefit-icon">{String(index + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-testimonials">
        <div className="pricing-testimonials-heading">
          <span className="career-kicker">Member stories</span>
          <h2>Real tools.<br /><mark>Real results.</mark></h2>
        </div>
        <div className="pricing-review-grid">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name}>
              <div className="pricing-review-stars">★★★★★</div>
              <strong>{testimonial.name}</strong>
              <span>{testimonial.role}</span>
              <p>“{testimonial.quote}”</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-faq">
        <div>
          <span className="career-kicker">Questions, answered</span>
          <h2>Frequently<br /><mark>asked.</mark></h2>
        </div>
        <div className="career-faq-list">
          {faqs.concat([
            { q: 'Can I cancel anytime?', a: 'Yes. Your membership is flexible and you can cancel before your next billing period.' },
            { q: 'Do I need to be technical to join?', a: 'No. TechTalk is for anyone building a career in technology, from operations and sales to engineering and leadership.' },
          ]).map((faq, index) => (
            <div key={faq.q} className={`career-faq-item${openQuestion === index ? ' open' : ''}`}>
              <button type="button" onClick={() => setOpenQuestion(openQuestion === index ? -1 : index)}>
                <span>{faq.q}</span>
                <span className="career-faq-icon">{openQuestion === index ? '−' : '+'}</span>
              </button>
              {openQuestion === index ? <p>{faq.a}</p> : null}
            </div>
          ))}
        </div>
      </section>
    </div>
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
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

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
            {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? (
              <SignInButton mode="modal">
                <button type="button" className="secondary-btn full-width">Continue with Clerk</button>
              </SignInButton>
            ) : <p className="form-error">Clerk authentication is not configured for this deployment.</p>}
          </div>
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
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'Product Leader', terms: false });
  const [error, setError] = useState('');

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
      await apiService.register({ name: form.name, email: form.email, password: form.password, role: form.role });
      await apiService.login({ email: form.email, password: form.password });
      const profile = await apiService.getCurrentUser();
      if (!profile) throw new Error('Account was created, but the new session could not be started. Please log in.');
      setUser(profile);
      navigate('/profile');
    } catch (registrationError) {
      setError(registrationError.message || 'Registration failed. Please try again.');
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
            {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? (
              <SignUpButton mode="modal">
                <button type="button" className="secondary-btn full-width">Create account with Clerk</button>
              </SignUpButton>
            ) : <p className="form-error">Clerk authentication is not configured for this deployment.</p>}
          </div>
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
          {eventSpeakers.slice(0, 2).map((speaker) => <span key={speaker.id} className="mini-speaker-placeholder" aria-label={speaker.name} title={speaker.name} />)}
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
      <div className="speaker-image-placeholder" aria-hidden="true" />
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
