/* ══════════════════════════════════════════════════════════════════
   USER PROFILE DATA — M. L. S. V. AISWARYA
   Senior Full Stack Developer & Systems Architect
   Location: Bhimavaram, Andhra Pradesh, India
   ══════════════════════════════════════════════════════════════════ */

export const DEFAULT_PROFILE = {
  name: "M. L. S. V. Aiswarya",
  fullName: "M. L. S. V. Aiswarya",
  handle: "@aiswarya_mlsv",
  title: "Senior Full Stack Developer & Distributed Systems Architect",
  bio: "Full Stack Developer specializing in high-throughput web architectures, modern React 19 / Next.js ecosystems, resilient Node.js microservices, and cloud-native distributed platforms. Passionate about system scalability, developer tooling, and open-source software.",
  location: "Bhimavaram, Andhra Pradesh, India",
  timezone: "IST (UTC+5:30)",
  company: "NexziByte Engineering Ecosystem",
  role: "Lead Full Stack Engineer",
  email: "aiswarya.mlsv@nexzibyte.com",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
  avatarInitials: "MA",
  status: "Available for Tech Talks & Architecture Consulting",
  memberSince: "March 2024",
  verified: true,
  isLoggedIn: true,
  passId: "TT26-000107",
  socials: {
    github: "https://github.com/aiswarya-mlsv",
    linkedin: "https://linkedin.com/in/mlsv-aiswarya",
    twitter: "https://x.com/aiswarya_dev",
    portfolio: "https://aiswarya.tech",
    devto: "https://dev.to/aiswarya_mlsv"
  }
};

export const PROFILE_METRICS = [
  { label: "Published Dispatches", value: "6", suffix: "", desc: "Technical whitepapers & guides" },
  { label: "Saved Architectures", value: "5", suffix: "", desc: "Bookmarked blueprints & notes" },
  { label: "Annual Contributions", value: "1,284", suffix: "+", desc: "Commits, PRs & code reviews" },
  { label: "TechTalk Sessions", value: "4", suffix: "", desc: "Keynotes & deep-dive masterclasses" }
];

export const SKILL_CATEGORIES = [
  {
    category: "Frontend & Modern Web",
    color: "#6C2BD9",
    skills: [
      { name: "React 19 / 18", level: "Expert", years: "5 yrs" },
      { name: "Next.js 15 (App Router)", level: "Advanced", years: "4 yrs" },
      { name: "TypeScript", level: "Expert", years: "5 yrs" },
      { name: "Tailwind CSS", level: "Expert", years: "4 yrs" },
      { name: "Vite / Modern Bundlers", level: "Advanced", years: "3 yrs" },
      { name: "Redux Toolkit & Zustand", level: "Advanced", years: "4 yrs" },
      { name: "WebSockets / Realtime UI", level: "Advanced", years: "3 yrs" },
      { name: "Core Web Vitals Optimization", level: "Expert", years: "4 yrs" }
    ]
  },
  {
    category: "Backend & Microservices",
    color: "#2563EB",
    skills: [
      { name: "Node.js (Async Concurrency)", level: "Expert", years: "5 yrs" },
      { name: "Express.js & NestJS", level: "Advanced", years: "4 yrs" },
      { name: "Python (FastAPI / Flask)", level: "Advanced", years: "3 yrs" },
      { name: "RESTful API Architecture", level: "Expert", years: "5 yrs" },
      { name: "GraphQL & Apollo Server", level: "Advanced", years: "3 yrs" },
      { name: "Apache Kafka / Event Streams", level: "Intermediate", years: "2 yrs" },
      { name: "BullMQ / Redis Task Queues", level: "Advanced", years: "3 yrs" }
    ]
  },
  {
    category: "Databases & Caching",
    color: "#059669",
    skills: [
      { name: "PostgreSQL (Indexing & Sharding)", level: "Advanced", years: "4 yrs" },
      { name: "Redis (In-Memory & Pub/Sub)", level: "Expert", years: "4 yrs" },
      { name: "Prisma ORM & Drizzle", level: "Advanced", years: "3 yrs" },
      { name: "MongoDB", level: "Advanced", years: "4 yrs" },
      { name: "Elasticsearch", level: "Intermediate", years: "2 yrs" }
    ]
  },
  {
    category: "Cloud, DevOps & Tooling",
    color: "#F97316",
    skills: [
      { name: "Docker & Containerization", level: "Advanced", years: "4 yrs" },
      { name: "Kubernetes (EKS / Minikube)", level: "Intermediate", years: "2 yrs" },
      { name: "AWS (S3, ECS, Lambda, CloudFront)", level: "Advanced", years: "3 yrs" },
      { name: "GitHub Actions CI/CD", level: "Expert", years: "4 yrs" },
      { name: "Linux Administration & Bash", level: "Advanced", years: "5 yrs" },
      { name: "Prometheus & Grafana", level: "Intermediate", years: "2 yrs" }
    ]
  }
];

export const PUBLISHED_POSTS = [
  {
    id: "pub-1",
    title: "Building High-Throughput Microservices with Node.js, Redis & Docker",
    category: "BACKEND & CLOUD",
    author: "M. L. S. V. Aiswarya",
    role: "Senior Full Stack Developer",
    date: "Sep 05, 2026",
    readingTime: "7 min read",
    views: "2.4k",
    likes: 184,
    excerpt: "A comprehensive teardown of event-loop concurrency, Redis token-bucket rate limiters, and automated Docker orchestration for 100k requests per minute.",
    content: "When engineering production microservices at enterprise scale, naive Express setups choke under synchronous bottleneck operations. By offloading I/O spikes into Redis cluster memory and decoupling CPU-bound processing into worker threads, we achieved sub-15ms response latency across distributed NexziByte edge nodes.",
    tags: ["Node.js", "Redis", "Docker", "System Design", "Microservices"]
  },
  {
    id: "pub-2",
    title: "Mastering React 19 Server Actions & Optimistic UI in Production",
    category: "FRONTEND ENGINEERING",
    author: "M. L. S. V. Aiswarya",
    role: "Senior Full Stack Developer",
    date: "Aug 26, 2026",
    readingTime: "6 min read",
    views: "3.1k",
    likes: 246,
    excerpt: "How React 19 server actions eliminate client boilerplate, streamline cache invalidation, and deliver instant optimistic user experiences.",
    content: "React 19 fundamentally reimagines the boundary between client interactivity and server computation. In this dispatch, we explore how Server Actions paired with useOptimistic hook reduce client bundle size by 42% while providing instantaneous feedback during network turbulence.",
    tags: ["React 19", "Next.js", "Frontend", "JavaScript", "Performance"]
  },
  {
    id: "pub-3",
    title: "Distributed System Design: Designing Idempotent Payment & Webhook Pipelines",
    category: "SYSTEM ARCHITECTURE",
    author: "M. L. S. V. Aiswarya",
    role: "Senior Full Stack Developer",
    date: "Aug 14, 2026",
    readingTime: "9 min read",
    views: "4.8k",
    likes: 389,
    excerpt: "Preventing duplicate transactions and race conditions in distributed webhooks using Redis distributed locks and unique mutation keys.",
    content: "At-least-once delivery guarantees in webhook web architecture inevitably generate duplicate events. We walk through designing rock-solid idempotency layers using SHA-256 payload hashes, distributed Redlock patterns, and two-phase database validation.",
    tags: ["Distributed Systems", "Idempotency", "Webhooks", "PostgreSQL", "Redis"]
  },
  {
    id: "pub-4",
    title: "Zero-Downtime Database Schema Migrations on PostgreSQL with Prisma",
    category: "DATABASE ARCHITECTURE",
    author: "M. L. S. V. Aiswarya",
    role: "Senior Full Stack Developer",
    date: "Jul 29, 2026",
    readingTime: "5 min read",
    views: "1.9k",
    likes: 152,
    excerpt: "The expand-and-contract pattern for safe non-blocking schema evolution across multi-tenant production databases.",
    content: "Altering live tables with millions of rows risks catastrophic exclusive table locks. Using the expand-and-contract migration methodology with Prisma ORM, we illustrate how to rename columns and change data constraints without dropping a single active customer query.",
    tags: ["PostgreSQL", "Prisma", "DevOps", "Database", "Zero-Downtime"]
  },
  {
    id: "pub-5",
    title: "Modern Full-Stack Performance: Core Web Vitals, SSR Caching & Edge Middleware",
    category: "FULL-STACK WEB",
    author: "M. L. S. V. Aiswarya",
    role: "Senior Full Stack Developer",
    date: "Jul 11, 2026",
    readingTime: "8 min read",
    views: "2.8k",
    likes: 215,
    excerpt: "Engineering ultra-fast Largest Contentful Paint (LCP) and Interaction to Next Paint (INP) with stale-while-revalidate edge caching.",
    content: "Web performance directly governs customer retention and conversion. This guide details how to leverage Cloudflare & AWS CloudFront edge computing to evaluate authentication tokens before server execution, rendering pages in under 80 milliseconds worldwide.",
    tags: ["Next.js", "Edge Computing", "Core Web Vitals", "LCP", "Caching"]
  },
  {
    id: "pub-6",
    title: "Demystifying GraphQL Subscriptions for Real-Time Conference Telemetry",
    category: "BACKEND & APIS",
    author: "M. L. S. V. Aiswarya",
    role: "Senior Full Stack Developer",
    date: "Jun 19, 2026",
    readingTime: "6 min read",
    views: "1.6k",
    likes: 128,
    excerpt: "Scaling WebSocket subscriptions over GraphQL to broadcast live event check-ins and speaker Q&A metrics to thousands of concurrent devices.",
    content: "When broadcasting live conference session updates, continuous polling consumes massive server bandwidth. We explore implementing GraphQL Subscriptions with Apollo and Redis Pub/Sub to deliver real-time socket connections with minimal CPU overhead.",
    tags: ["GraphQL", "WebSockets", "Realtime", "Node.js", "Telemetry"]
  }
];

export const DRAFT_POSTS_INITIAL = [
  {
    id: "draft-1",
    title: "Designing Real-Time WebRTC Media Relays with Node.js & Mediasoup",
    category: "SYSTEM ARCHITECTURE",
    author: "M. L. S. V. Aiswarya",
    role: "Senior Full Stack Developer",
    lastModified: "Sep 08, 2026",
    readingTime: "8 min read",
    status: "Draft",
    progress: 75,
    excerpt: "Building high-performance selective forwarding units (SFU) in WebRTC for low-latency live video broadcasting across distributed nodes.",
    content: "Live audio/video streaming in conference rooms needs selective forwarding architecture to minimize peer bandwidth. By clustering Mediasoup workers over Node.js child processes, we can relay 4K streams to hundreds of participants with under 120ms glass-to-glass latency.",
    tags: ["WebRTC", "Node.js", "MediaSoup", "Streaming", "Realtime"]
  },
  {
    id: "draft-2",
    title: "Finite State Machine Architectures with XState v5 in Complex React 19 Forms",
    category: "FRONTEND ENGINEERING",
    author: "M. L. S. V. Aiswarya",
    role: "Senior Full Stack Developer",
    lastModified: "Sep 02, 2026",
    readingTime: "5 min read",
    status: "Under Review",
    progress: 90,
    excerpt: "Eliminating impossible UI states and race conditions in multi-step enterprise onboarding flows with deterministic statecharts.",
    content: "Complex user onboarding flows often suffer from fragile boolean flags (`isLoading`, `isSubmitting`, `isError`). Modeling these with XState v5 creates verifiable state machines where every transition is deterministic and impossible UI states are mathematically eliminated.",
    tags: ["XState", "React 19", "State Management", "TypeScript", "UX Architecture"]
  }
];

export const NOTIFICATIONS_INITIAL = [
  {
    id: "notif-1",
    type: "comment",
    title: "New comment on your dispatch",
    description: "Dr. Rajesh Raman commented: 'Superb breakdown of Redis rate limiting. How do you handle clock skew across multi-region nodes?'",
    time: "15 minutes ago",
    read: false,
    actor: {
      name: "Dr. Rajesh Raman",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      role: "Principal AI Scientist"
    },
    targetLink: "/posts/pub-1",
    badge: "Comment"
  },
  {
    id: "notif-2",
    type: "reaction",
    title: "Trending architectural appreciation",
    description: "Kiran Varma, Tejaswini Gangula and 48 others clapped for 'Mastering React 19 Server Actions & Optimistic UI'.",
    time: "2 hours ago",
    read: false,
    actor: {
      name: "Kiran Varma",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      role: "Staff Infrastructure Engineer"
    },
    targetLink: "/posts/pub-2",
    badge: "Reaction"
  },
  {
    id: "notif-3",
    type: "pass",
    title: "Pass Confirmed & Verified",
    description: "Your FOUNDER PASS (TT26-884920) for TechTalk Summit 2026 is confirmed. Access your Digital QR Pass anytime.",
    time: "Yesterday at 4:15 PM",
    read: false,
    actor: {
      name: "NexziByte TechTalk Desk",
      avatar: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&auto=format&fit=crop&q=80",
      role: "Official Desk"
    },
    targetLink: "/passes",
    badge: "Pass Verification"
  },
  {
    id: "notif-4",
    type: "follower",
    title: "New Architect Follower",
    description: "Tejaswini Gangula started following your technical dispatches and architectural blueprints.",
    time: "2 days ago",
    read: true,
    actor: {
      name: "Tejaswini Gangula",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
      role: "Technical Lead"
    },
    targetLink: "/profile",
    badge: "Follower"
  },
  {
    id: "notif-5",
    type: "event",
    title: "Founder Meet schedule finalized",
    description: "Agenda for TechTalk Founder Meet Circle: Hyderabad at T-Hub Phase 2 has been updated with Sri KTR Keynote.",
    time: "3 days ago",
    read: true,
    actor: {
      name: "Founder Meets Ecosystem",
      avatar: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80",
      role: "Ecosystem Partner"
    },
    targetLink: "/founder-meets/fm-hyd-1",
    badge: "Event Update"
  },
  {
    id: "notif-6",
    type: "reaction",
    title: "Milestone Reached",
    description: "Your article 'Building High-Throughput Microservices' reached 2,400+ reads and 180+ community stars.",
    time: "5 days ago",
    read: true,
    actor: {
      name: "TechTalk Dispatches",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      role: "Analytics Bot"
    },
    targetLink: "/posts/pub-1",
    badge: "Milestone"
  }
];

export const SAVED_POSTS_INITIAL = [
  {
    id: "art-1",
    category: "PYTHON & AI/ML",
    title: "Architecting Enterprise AI/ML Pipelines & Cloud Deployments in Python",
    author: "Dr. Rajesh Raman",
    role: "Principal AI Scientist",
    readingTime: "6 min read",
    date: "Sep 02, 2026",
    excerpt: "From neural network modeling to cloud-scale inference: how modern Python teams structure FastAPI microservices, Docker containers, and AWS GPU workloads.",
    content: "Building AI-powered products in production requires more than simple model weights. Modern Python architectures combine asynchronous FastAPI endpoints, containerized Docker instances, and automated model monitoring across cloud platforms like AWS and GCP to achieve low-latency predictions under heavy throughput.",
    savedOn: "Sep 03, 2026"
  },
  {
    id: "art-3",
    category: "FULL-STACK WEB",
    title: "Complete Full-Stack Engineering: React 19, Next.js, Java & Enterprise DevOps",
    author: "Tejaswini Gangula",
    role: "Technical Lead",
    readingTime: "8 min read",
    date: "Aug 27, 2026",
    excerpt: "Bridging frontend elegance with enterprise Java backends and resilient CI/CD pipelines: architecting scalable multi-tier web platforms.",
    content: "Enterprise web development requires mastering reactive user interfaces in React.js and Next.js alongside resilient Java backends. Coupling this with automated DevOps deployment creates robust systems capable of serving millions of concurrent requests with zero downtime.",
    savedOn: "Aug 29, 2026"
  },
  {
    id: "art-5",
    category: "CLOUD COMPUTING",
    title: "Cloud Computing Architectures for Machine Learning & Distributed Data",
    author: "Kiran Varma",
    role: "Staff Infrastructure Engineer",
    readingTime: "7 min read",
    date: "Aug 18, 2026",
    excerpt: "Deploying Python data automation and ML workloads across multi-region cloud infrastructures with Kubernetes and serverless scale.",
    content: "Cloud computing provides the elasticity required for compute-heavy AI/ML applications. We explore how containerizing Python services with Docker and automating deployments on AWS enables instantaneous scaling during peak data ingestion periods.",
    savedOn: "Aug 20, 2026"
  },
  {
    id: "art-2",
    category: "CREATIVE MEDIA",
    title: "The Creative Powerhouse: High-Impact Graphic Design, Video & Digital Marketing",
    author: "Durgesh Siva Naga",
    role: "Digital Marketing Lead",
    readingTime: "5 min read",
    date: "Aug 30, 2026",
    excerpt: "How creative interns and media teams craft compelling brand stories, viral motion graphics, and high-conversion digital marketing campaigns.",
    content: "Modern tech brands win on narrative clarity. NexziByte actively recruits interns across graphic design, video editing, and digital marketing to produce dynamic visual assets, motion reels in Premiere Pro and After Effects, and data-driven growth marketing funnels that capture enterprise attention.",
    savedOn: "Aug 31, 2026"
  },
  {
    id: "art-4",
    category: "OPERATIONS & BD",
    title: "Cross-Functional Synergy: Technical Support, HR & Business Development in Tech",
    author: "Narasaiah Nagunoori",
    role: "Director",
    readingTime: "6 min read",
    date: "Aug 22, 2026",
    excerpt: "Why successful technology companies train engineers and operators across UI/UX, Tech Support, HR recruitment, and Business Development.",
    content: "Great software cannot succeed in a silo. Modern development programs train practitioners across technical support, IT talent acquisition, and business development to ensure products are built with empathy, scaled with top talent, and monetized effectively in competitive markets.",
    savedOn: "Aug 24, 2026"
  }
];

export const ACTIVITY_FEED = [
  {
    id: "act-1",
    type: "commit",
    title: "Pushed 8 commits to nexzibyte/core-gateway",
    description: "Implemented distributed token bucket rate limiter with Redis clustering and sub-millisecond fallback.",
    timestamp: "Today at 2:30 PM",
    badge: "Git Push",
    badgeColor: "#2563EB",
    hash: "c89f2a4",
    repo: "nexzibyte/core-gateway"
  },
  {
    id: "act-2",
    type: "publish",
    title: "Published Technical Dispatch",
    description: "Building High-Throughput Microservices with Node.js, Redis & Docker published to TechTalk Dispatches.",
    timestamp: "Sep 05, 2026",
    badge: "Article Published",
    badgeColor: "#6C2BD9",
    articleId: "pub-1"
  },
  {
    id: "act-3",
    type: "talk",
    title: "Delivered Keynote: React 19 in Distributed Systems",
    description: "Presented a 45-minute technical masterclass on Server Components, Streaming SSR and edge middleware at TechTalk Summit.",
    timestamp: "Sep 01, 2026",
    badge: "Tech Speaker",
    badgeColor: "#F97316",
    location: "TechTalk Main Auditorium"
  },
  {
    id: "act-4",
    type: "pr",
    title: "Merged PR #204: Telemetry WebSockets Integration",
    description: "Merged pull request into production branch with 100% automated test coverage across 48 test suites.",
    timestamp: "Aug 28, 2026",
    badge: "PR Merged",
    badgeColor: "#059669",
    hash: "e441bb0",
    repo: "nexzibyte/techtalk-analytics"
  },
  {
    id: "act-5",
    type: "bookmark",
    title: "Saved Architecture Blueprint",
    description: "Saved 'Architecting Enterprise AI/ML Pipelines & Cloud Deployments in Python' to technical reading list.",
    timestamp: "Aug 22, 2026",
    badge: "Bookmark",
    badgeColor: "#D97706"
  },
  {
    id: "act-6",
    type: "credential",
    title: "Earned AWS Certified Solutions Architect Badge",
    description: "Renewed professional cloud architecture certification with specialization in high-availability distributed systems.",
    timestamp: "Aug 15, 2026",
    badge: "Certification",
    badgeColor: "#4F46E5"
  }
];

export const CAREER_TIMELINE = [
  {
    period: "2024 — Present",
    role: "Lead Full Stack Engineer & Cloud Architect",
    company: "NexziByte Technologies Ecosystem",
    location: "Bhimavaram & Remote",
    highlights: [
      "Leading cross-functional engineering teams developing scalable full-stack web platforms and event registration portals.",
      "Architected real-time WebSocket check-in infrastructure serving 5,000+ summit attendees with sub-second response times.",
      "Spearheaded adoption of React 19 Server Actions, Next.js App Router, and Redis distributed caching pipelines."
    ]
  },
  {
    period: "2022 — 2024",
    role: "Senior Software Engineer (Full Stack)",
    company: "CloudScale Systems",
    location: "Hyderabad, India",
    highlights: [
      "Engineered high-concurrency Node.js and TypeScript microservices processing over 12 million transactions weekly.",
      "Implemented zero-downtime database migrations with PostgreSQL, Prisma ORM, and automated GitHub Actions CI/CD pipelines.",
      "Mentored 14 junior and mid-level developers in distributed systems patterns, clean code principles, and test automation."
    ]
  },
  {
    period: "2020 — 2022",
    role: "Full Stack Developer",
    company: "Horizon Digital Labs",
    location: "Visakhapatnam, India",
    highlights: [
      "Built responsive Single Page Applications in React, Redux, and Tailwind CSS with 99+ Google Lighthouse performance scores.",
      "Designed RESTful APIs and webhook integrations with Express, MongoDB, and AWS S3.",
      "Collaborated closely with product designers to create reusable design system component libraries."
    ]
  }
];

export const SPEAKING_ENGAGEMENTS = [
  {
    event: "TechTalk Flagship Summit 2026",
    topic: "Next-Gen React 19 & Distributed Web Architectures",
    date: "September 2026",
    attendees: "1,200+ Engineers",
    slidesUrl: "#",
    tag: "Keynote Speaker"
  },
  {
    event: "Andhra Pradesh Developer Conclave",
    topic: "Scaling Node.js Microservices Beyond 50k QPS",
    date: "July 2026",
    attendees: "650+ Developers",
    slidesUrl: "#",
    tag: "Technical Session"
  },
  {
    event: "NexziByte Architecture Masterclass",
    topic: "Distributed Idempotency & Resilient Webhook Design",
    date: "April 2026",
    attendees: "400+ Systems Engineers",
    slidesUrl: "#",
    tag: "Masterclass"
  }
];

// Generates 52 weeks (7 days each = 364 days) of realistic commit activity data
export function generateContributionGrid() {
  const weeks = [];
  const now = new Date();
  
  // Seeded deterministic random generator for realistic activity pattern
  let seed = 42;
  function pseudoRandom() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthLabels = [];

  for (let w = 51; w >= 0; w--) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(now);
      date.setDate(now.getDate() - (w * 7 + (6 - d)));
      
      const rand = pseudoRandom();
      const isWeekend = d === 0 || d === 6;
      let count = 0;
      if (!isWeekend && rand > 0.22) {
        count = Math.floor(rand * 9) + 1;
      } else if (isWeekend && rand > 0.65) {
        count = Math.floor(rand * 5) + 1;
      }

      let level = 0;
      if (count === 0) level = 0;
      else if (count <= 2) level = 1;
      else if (count <= 5) level = 2;
      else if (count <= 8) level = 3;
      else level = 4;

      days.push({
        date: date.toISOString().split("T")[0],
        formattedDate: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        count,
        level,
        dayOfWeek: d
      });
    }

    const firstDayDate = new Date(days[0].date);
    if (firstDayDate.getDate() <= 7) {
      monthLabels.push({
        weekIndex: 51 - w,
        month: months[firstDayDate.getMonth()]
      });
    }

    weeks.push(days);
  }

  return { weeks, monthLabels };
}
