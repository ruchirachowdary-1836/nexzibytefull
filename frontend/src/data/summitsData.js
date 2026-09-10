/* ══════════════════════════════════════════════════════════════════
   NEXZIBYTE TECHTALK — SUMMITS DATA (COMPREHENSIVE CONFERENCE PLATFORM)
   ══════════════════════════════════════════════════════════════════ */

export const SUMMIT_LIST = [
  {
    id: "featured-tech-innovation-summit-2026",
    title: "NexziByte Tech Innovation Summit 2026",
    subtitle: "The Premier Global Gathering for Software Architects, AI Pioneers & Engineering Leaders",
    badge: "ANNUAL FLAGSHIP SUMMIT 🏆",
    statusBadge: "Registration Open",
    tagline: "Where Technology Meets Ideas, People & Scalable Possibilities",
    bannerImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=80",
    date: "November 14 – 15, 2026",
    rawDate: "2026-11-14",
    time: "09:00 AM – 06:30 PM IST",
    location: "Hyderabad, India",
    mode: "In-Person & Synchronized 4K Live Stream",
    expectedAttendees: "2,000+ Builders & Leaders",
    spotsLeft: 48,
    stats: [
      { label: "Keynote Speakers", value: "45+" },
      { label: "Attendees", value: "2,000+" },
      { label: "Technology Tracks", value: "6 Tracks" },
      { label: "Partner Companies", value: "40+" }
    ],
    about: `The NexziByte Tech Innovation Summit 2026 is our flagship annual conference, bringing together 2,000+ software engineers, principal architects, enterprise decision-makers, startup founders, and aspiring technologists under one roof.

Across two immersive days at the prestigious HICC Novotel & HITEC City Convention Centre, participants will explore the frontiers of artificial intelligence, high-throughput cloud systems, distributed databases, modern frontend engineering, and cybersecurity. 

Featuring keynotes by industry visionaries, architectural teardowns of real-world systems handling billions of requests, interactive hands-on code clinics, and an expansive technology exhibition hall, this summit is built from the ground up for practitioners who build the future.`,
    highlights: [
      "Keynotes from Fortune 500 CTOs and global open-source fellows",
      "6 parallel technical tracks: AI & ML, Distributed Systems, Cloud & DevOps, Modern Web, Cybersecurity, and Engineering Leadership",
      "Hands-on architectural code clinics with live latency profiling",
      "Executive delegation lounge and closed-door venture networking sessions",
      "Exclusive delegate pass kit, verified digital credentials, and gala dinner celebration"
    ],
    whoShouldAttend: [
      {
        title: "Software Architects & Senior Engineers",
        desc: "Gain deep technical insight into microservices, distributed reliability, and scalable LLM orchestration."
      },
      {
        title: "CTOs & Engineering Directors",
        desc: "Evaluate emerging technology stacks, cloud cost optimization patterns, and engineering culture frameworks."
      },
      {
        title: "Tech Founders & Product Leaders",
        desc: "Discover enterprise partners, meet angel syndicates, and accelerate product-market fit."
      },
      {
        title: "Ambitious Students & Developers",
        desc: "Meet hiring engineering teams, showcase innovative side-projects, and learn directly from industry masters."
      }
    ],
    themes: [
      {
        title: "Agentic AI & LLM Systems in Production",
        desc: "Beyond chat interfaces: Multi-agent coordination, deterministic evaluation, vector caching, and reducing inference latency at scale."
      },
      {
        title: "Resilient Multi-Region Cloud & DevOps",
        desc: "Zero-downtime continuous deployment, Kubernetes platform engineering, eBPF observability, and cloud cost governance."
      },
      {
        title: "Enterprise Web Platforms & Micro-Frontends",
        desc: "Next.js 15, React 19 architecture, real-time edge computing, server-driven UI, and web performance optimization."
      },
      {
        title: "Zero-Trust Cybersecurity & API Security",
        desc: "Hardening enterprise surfaces against automated AI threat vectors, cryptographic identity verification, and supply chain security."
      }
    ],
    agenda: [
      {
        day: "Day 1 — Nov 14",
        date: "Friday, November 14, 2026",
        tracks: ["Main Keynote Stage", "Track A: AI & Data", "Track B: Cloud & Infra", "Hands-on Code Clinics"],
        sessions: [
          {
            time: "08:30 AM – 09:30 AM",
            title: "Delegate Registration, Badge Pick-up & Networking Breakfast",
            type: "Reception",
            room: "Grand Concourse & Welcome Foyer",
            track: "All Tracks",
            speaker: { name: "Summit Organizing Board", role: "NexziByte Team", company: "NexziByte Solutions" },
            description: "Collect your digital-verified badge kit, grab morning artisanal coffee, and connect with fellow delegates."
          },
          {
            time: "09:30 AM – 10:30 AM",
            title: "Opening Keynote: Architecting Enterprise AI & Scalable Digital Platforms for the Next Decade",
            type: "Keynote",
            room: "Main Auditorium Hall A",
            track: "Main Keynote Stage",
            speaker: { name: "Nagunoori Durga Prasad", gender: "male", role: "Founder & Managing Director", company: "NexziByte Solutions", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80" },
            description: "How modern enterprises are transitioning from exploratory proof-of-concepts to revenue-generating autonomous AI ecosystems."
          },
          {
            time: "10:45 AM – 11:45 AM",
            title: "The Post-Transformer Era: Multi-Agent Systems & Cognitive Workflows",
            type: "Deep Dive",
            room: "Main Auditorium Hall A",
            track: "Track A: AI & Data",
            speaker: { name: "Dr. Arvind Ramesh", role: "Chief AI Scientist", company: "NeuralCognition Labs", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" },
            description: "Architectural patterns for autonomous LLM agents, long-term memory retrieval, and multi-agent coordination in enterprise workflows."
          },
          {
            time: "11:45 AM – 12:45 PM",
            title: "Zero-Downtime Multi-Region Kubernetes & Infrastructure at Global Scale",
            type: "Architecture Teardown",
            room: "Hall B (Cloud Stage)",
            track: "Track B: Cloud & Infra",
            speaker: { name: "Sanya Roy", role: "VP of Infrastructure Engineering", company: "HyperScale Cloud", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80" },
            description: "Managing cross-region traffic failover, state synchronization, and sub-10ms latencies under unexpected traffic spikes."
          },
          {
            time: "12:45 PM – 02:00 PM",
            title: "Executive Networking Lunch & Innovation Exhibition Showcase",
            type: "Networking",
            room: "Exhibition Pavilions & Dining Atrium",
            track: "All Tracks",
            speaker: { name: "40+ Enterprise Sponsors", role: "Innovation Showcase", company: "Ecosystem Partners" },
            description: "Enjoy a multi-cuisine networking lunch while exploring live demo booths and cutting-edge tech exhibits."
          },
          {
            time: "02:00 PM – 03:30 PM",
            title: "Hands-on Code Clinic: Building Real-Time Asynchronous AI Endpoints with Python & Rust",
            type: "Interactive Workshop",
            room: "Workshop Lab 1",
            track: "Hands-on Code Clinics",
            speaker: { name: "Kiran Varma", role: "Staff Systems Engineer", company: "NexziByte Solutions", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80" },
            description: "Bring your laptop: write, profile, and deploy a low-latency streaming inference service capable of 5,000 RPS."
          },
          {
            time: "03:45 PM – 05:00 PM",
            title: "Panel Discussion: The Future of Engineering Careers & Generative Coding Tools",
            type: "Panel",
            room: "Main Auditorium Hall A",
            track: "Main Keynote Stage",
            speaker: { name: "Industry Leaders Panel", role: "Engineering VPs & CTOs", company: "Google, AWS, NexziByte, GitHub" },
            description: "How AI coding assistants, autonomous test suites, and declarative development are changing the hiring landscape for developers."
          },
          {
            time: "05:00 PM – 06:30 PM",
            title: "Founder Matchmaking Circle & VIP Networking Reception",
            type: "VIP Reception",
            room: "The Presidential Skyline Lounge",
            track: "Networking",
            speaker: { name: "Founder & Investor Council", role: "Venture Partners", company: "Angel Syndicate" },
            description: "Exclusive reception for Delegate & VIP pass holders, startup founders, and enterprise technology executives."
          }
        ]
      },
      {
        day: "Day 2 — Nov 15",
        date: "Saturday, November 15, 2026",
        tracks: ["Keynote Stage", "Track C: Frontend & Mobile", "Track D: Security & Web3", "Hackathon & Demos"],
        sessions: [
          {
            time: "09:00 AM – 10:00 AM",
            title: "Keynote: Next-Generation Reactive Interfaces & Edge-Computed Web Applications",
            type: "Keynote",
            room: "Main Auditorium Hall A",
            track: "Keynote Stage",
            speaker: { name: "Tejaswini Gangula", role: "Technical Lead", company: "NexziByte Solutions", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80" },
            description: "Architecting zero-bundle-size React components, server actions, and streaming hydration across distributed edge CDNs."
          },
          {
            time: "10:15 AM – 11:30 AM",
            title: "Hardening Enterprise APIs Against AI-Powered Zero-Day Exploits",
            type: "Security Teardown",
            room: "Hall B (Security Track)",
            track: "Track D: Security & Web3",
            speaker: { name: "Vikram Malhotra", role: "Chief Information Security Officer", company: "CyberShield Enterprise", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" },
            description: "Lessons from analyzing 10 million automated bot attacks and implementing cryptographic runtime verification."
          },
          {
            time: "11:45 AM – 01:15 PM",
            title: "Demo Arena: 10 Breakthrough Tech Startups Pitch Live to Enterprise CTOs",
            type: "Startup Showcase",
            room: "Main Auditorium Hall A",
            track: "Keynote Stage",
            speaker: { name: "Curated Startup Founders", role: "Founders & Builders", company: "NexziByte Accelerator" },
            description: "Watch 10 vetted technology startups demo their live products with 3-minute Q&As from enterprise decision-makers."
          },
          {
            time: "01:15 PM – 02:30 PM",
            title: "Delegate Networking Luncheon & Mentorship Tables",
            type: "Networking",
            room: "Grand Dining Pavilion",
            track: "All Tracks",
            speaker: { name: "Community Mentors", role: "Senior Architects", company: "Leading Tech Firms" },
            description: "Join structured tables grouped by domain (AI, Cloud, Security, Careers) for focused peer conversations."
          },
          {
            time: "02:30 PM – 04:00 PM",
            title: "Building Sustainable High-Impact Tech Enterprises in South Asia",
            type: "Fireside Chat",
            room: "Hall A",
            track: "Keynote Stage",
            speaker: { name: "Narasaiah Nagunoori", role: "Director", company: "NexziByte Solutions", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80" },
            description: "Strategic principles for growing resilient tech enterprises, navigating economic shifts, and cultivating elite technical talent."
          },
          {
            time: "04:15 PM – 05:30 PM",
            title: "NexziByte TechTalk Innovation Awards & Closing Keynote",
            type: "Awards & Gala",
            room: "Main Auditorium Hall A",
            track: "Keynote Stage",
            speaker: { name: "Executive Jury Board", role: "Award Committee", company: "TechTalk Ecosystem" },
            description: "Honoring the year's best technical architectures, open source contributors, and community champions."
          }
        ]
      }
    ],
    speakers: [
      {
        id: "sp-summit-1",
        name: "Nagunoori Durga Prasad",
        gender: "male",
        role: "Founder & Managing Director",
        company: "NexziByte Solutions",
        topic: "Architecting Enterprise AI & Scalable Digital Platforms",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80",
        bio: "Pioneering technology executive championing AI-powered products, developer communities, and enterprise digital transformation globally.",
        linkedin: "https://linkedin.com",
        featured: true
      },
      {
        id: "sp-summit-2",
        name: "Dr. Arvind Ramesh",
        gender: "male",
        role: "Chief AI Scientist",
        company: "NeuralCognition Labs",
        topic: "Autonomous Multi-Agent LLM Coordination in Production",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
        bio: "Former AI research fellow with 14+ granted patents in transformer optimization and continuous neural inference architectures.",
        linkedin: "https://linkedin.com",
        featured: true
      },
      {
        id: "sp-summit-3",
        name: "Sanya Roy",
        gender: "female",
        role: "VP of Infrastructure Engineering",
        company: "HyperScale Cloud",
        topic: "Zero-Downtime Multi-Region Kubernetes at Global Scale",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
        bio: "Cloud systems architect who has overseen cloud infrastructure powering over 250 million monthly active enterprise users.",
        linkedin: "https://linkedin.com",
        featured: true
      },
      {
        id: "sp-summit-4",
        name: "Narasaiah Nagunoori",
        gender: "male",
        role: "Director",
        company: "NexziByte Solutions",
        topic: "Strategic Governance & Building Sustainable Tech Enterprises",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80",
        bio: "Business leader with decades of corporate governance experience steering sustainable enterprise growth and talent empowerment.",
        linkedin: "https://linkedin.com",
        featured: false
      },
      {
        id: "sp-summit-5",
        name: "Tejaswini Gangula",
        gender: "female",
        role: "Technical Lead",
        company: "NexziByte Solutions",
        topic: "Next-Gen Reactive Interfaces & Edge Web Applications",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&auto=format&fit=crop&q=80",
        bio: "Full-stack specialist driving high-performance micro-frontends, responsive web applications, and resilient React ecosystems.",
        linkedin: "https://linkedin.com",
        featured: false
      },
      {
        id: "sp-summit-6",
        name: "Vikram Malhotra",
        gender: "male",
        role: "Chief Information Security Officer",
        company: "CyberShield Enterprise",
        topic: "Defending Enterprise APIs Against Automated AI Exploits",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
        bio: "Cybersecurity veteran and international speaker specializing in runtime application self-protection and zero-trust cryptography.",
        linkedin: "https://linkedin.com",
        featured: false
      }
    ],
    sponsors: {
      title: {
        name: "NexziByte Solutions",
        role: "Title & Founding Host",
        logo: "NEXZIBYTE",
        desc: "Enterprise software, generative AI platforms, and scalable digital product engineering.",
        website: "https://nexzibyte.com"
      },
      platinum: [
        { name: "Google Cloud", symbol: "GCP", category: "Cloud & AI Infrastructure Partner", website: "https://cloud.google.com" },
        { name: "Amazon Web Services", symbol: "AWS", category: "Global Cloud Computing Partner", website: "https://aws.amazon.com" },
        { name: "Microsoft Azure", symbol: "MSFT", category: "Enterprise Intelligence Partner", website: "https://azure.microsoft.com" }
      ],
      gold: [
        { name: "NVIDIA", symbol: "NVDA", category: "Accelerated Computing Partner" },
        { name: "GitHub", symbol: "GH", category: "Developer Tools Partner" },
        { name: "Oracle Cloud", symbol: "ORCL", category: "Enterprise Database Partner" },
        { name: "Salesforce", symbol: "CRM", category: "Enterprise CRM & Cloud Partner" }
      ],
      ecosystem: [
        { name: "T-Hub Hyderabad", type: "Innovation Ecosystem Partner" },
        { name: "Telangana PM-KUSUM", type: "CleanTech & Green Energy Partner" },
        { name: "ETGCCWorld", type: "Global Capability Center Partner" },
        { name: "Hyderabad Tech Guild", type: "Community Partner" }
      ]
    },
    venue: {
      name: "HICC Novotel & HITEC City Convention Centre",
      subname: "South Asia's Premier Purpose-Built Convention Arena",
      address: "Novotel & HICC Complex, Near HITEC City, PO Bag 1101, Cyberabad Post Office, Hyderabad, Telangana 500081",
      city: "Hyderabad, India",
      coordinates: "17.4720° N, 78.3732° E",
      hall: "Grand Ballrooms 1 – 4 & Technology Exhibition Pavilions",
      phone: "+91 40 6682 4422",
      features: [
        "100,000+ sq ft pillar-less air-conditioned plenary arena",
        "Dedicated Gigabit Wi-Fi 6 infrastructure for all delegates",
        "Multilingual simultaneous translation facilities",
        "Ample multi-level valet parking for 2,500+ vehicles",
        "On-site five-star catering lounges and private executive suites"
      ],
      transit: {
        metro: "HITEC City Metro Station (Blue Line) — 6 minutes via free shuttle",
        airport: "Rajiv Gandhi International Airport (HYD) — 35 minutes via PVNR Expressway",
        railway: "Secunderabad Junction / Nampally Railway Station — 30 minutes drive",
        cab: "Dedicated Ola, Uber & Rapido drop-off & pickup points at Gate 2"
      }
    },
    tickets: [
      {
        id: "visitor-pass",
        name: "Visitor Pass",
        badge: "COMMUNITY PASS",
        price: "FREE",
        amountNum: 0,
        currency: "",
        validity: "Access to Day 1 & Day 2",
        features: [
          "Open event exhibition hall entry",
          "Selected keynote sessions (General Seating)",
          "Technology partner demo zones",
          "Community networking lounges",
          "Official digital event pass with QR code"
        ],
        btnText: "Claim Free Visitor Pass",
        recommended: false,
        passTypeId: "visitor-pass"
      },
      {
        id: "delegate-pass",
        name: "All-Access Delegate Pass",
        badge: "MOST POPULAR 🌟",
        price: "₹250",
        amountNum: 250,
        currency: "₹",
        validity: "Full 2-Day Complete Access",
        features: [
          "Full access to all 6 technical tracks & keynotes",
          "Priority seating in Main Plenary Hall",
          "Access to closed-door Founder Meets & Investor Circles",
          "Speaker Q&A and greenroom networking sessions",
          "Verified Digital Certificate of Participation",
          "Buffet networking luncheon and official delegate merchandise kit"
        ],
        btnText: "Get Delegate Pass — ₹250",
        recommended: true,
        passTypeId: "delegate-pass"
      },
      {
        id: "vip-executive-pass",
        name: "VIP Executive Pass",
        badge: "EXECUTIVE & INVESTOR",
        price: "₹999",
        amountNum: 999,
        currency: "₹",
        validity: "VIP White-Glove Accreditation",
        features: [
          "Reserved front-row seating at all keynote sessions",
          "Exclusive access to Presidential Skyline Lounge",
          "1-on-1 scheduled meetings with keynote speakers & founders",
          "Invitation to Friday Night Executive Gala Dinner",
          "Complimentary valet parking & priority check-in desk",
          "Lifetime digital access to session video recordings & slide decks"
        ],
        btnText: "Get VIP Pass — ₹999",
        recommended: false,
        passTypeId: "delegate-pass"
      }
    ],
    relatedSummits: ["summit-gpacts-2026", "summit-gcc-2026", "summit-product-launch"]
  },
  {
    id: "summit-gpacts-2026",
    title: "Nexzibyte Solutions at GPACTS 2026 🚀",
    subtitle: "World’s Biggest Pharma AI & IT Summit — Hyderabad",
    badge: "WORLD’S BIGGEST PHARMA AI SUMMIT",
    statusBadge: "Summit Recap Available",
    tagline: "Where Life Sciences, AI and Technology Meet to Shape Healthcare",
    bannerImage: "/images/summit-gpacts.jpg",
    date: "3 September 2026",
    rawDate: "2026-09-03",
    time: "09:00 AM – 06:00 PM IST",
    location: "Hyderabad, India",
    mode: "In-Person Executive Summit",
    expectedAttendees: "400+ Pharma & AI Delegates",
    spotsLeft: 0,
    stats: [
      { label: "Delegates", value: "400+" },
      { label: "Speakers", value: "50" },
      { label: "Partners", value: "13" },
      { label: "Unique Companies", value: "140+" }
    ],
    about: `Nexzibyte Solutions was pleased to be part of GPACTS 2026 – World’s Biggest Pharma AI & IT Summit, held in Hyderabad on 3 September 2026. The landmark gathering brought together 400+ delegates, 50 speakers, 13 partners, and 140+ unique healthcare, pharmaceutical, and technology companies.

The event established an influential forum for senior technology leaders, biotech founders, and life sciences researchers to exchange perspectives on the accelerating convergence of Artificial Intelligence and Pharmaceutical Engineering.

For Nexzibyte Solutions, GPACTS provided an invaluable opportunity to understand evolving industry challenges, engage with decision-makers across the healthcare ecosystem, and demonstrate where our AI products and digital transformation solutions create tangible, life-saving business impact.`,
    highlights: [
      "World's largest specialized Pharma AI & IT summit hosted in Hyderabad",
      "400+ delegates, 50 speakers, 13 partners, and 140+ unique companies",
      "High-level discussions on generative molecular modeling, clinical trial automation, and regulatory compliance",
      "Exploring where custom AI architectures compress clinical drug discovery cycles",
      "High-density networking with pharmaceutical C-suite executives and IT innovators"
    ],
    whoShouldAttend: [
      {
        title: "Life Sciences & Pharma Executives",
        desc: "Learn how modern AI models speed up drug candidate screening and compliance workflows."
      },
      {
        title: "Enterprise IT & Cloud Engineers",
        desc: "Design compliant, HIPAA/FDA-ready cloud architectures for sensitive health data."
      },
      {
        title: "AI & Bioinformatic Researchers",
        desc: "Explore neural network applications in genomics, pathology diagnostics, and clinical trials."
      }
    ],
    themes: [
      {
        title: "AI-Driven Drug Discovery & Formulation",
        desc: "Utilizing deep learning representations to model protein interactions and predict pharmacokinetic properties."
      },
      {
        title: "Regulatory Tech & Automated FDA Compliance",
        desc: "Building audit-proof data pipelines and continuous validation systems across pharmaceutical manufacturing."
      },
      {
        title: "Decentralized Clinical Trials & Data Sharing",
        desc: "Privacy-preserving machine learning and federated datasets across multi-institution trial networks."
      }
    ],
    agenda: [
      {
        day: "Full-Day Summit",
        date: "Thursday, September 3, 2026",
        tracks: ["Plenary Stage", "Pharma AI Track", "Regulatory & IT Track"],
        sessions: [
          {
            time: "09:00 AM – 10:00 AM",
            title: "Inaugural Addresses & Ministerial Opening",
            type: "Keynote",
            room: "Grand Plenary Hall",
            track: "Plenary Stage",
            speaker: { name: "GPACTS Organizing Committee", role: "Summit Directors", company: "GPACTS Council" },
            description: "Opening reflections on Hyderabad as the global vaccine and pharmaceutical innovation capital."
          },
          {
            time: "10:15 AM – 11:30 AM",
            title: "NexziByte Presentation: Where AI Creates Meaningful Impact in Life Sciences",
            type: "Keynote",
            room: "Plenary Hall",
            track: "Pharma AI Track",
            speaker: { name: "Nagunoori Durga Prasad", role: "Founder & MD", company: "NexziByte Solutions" },
            description: "Addressing real-world deployment challenges in deploying machine learning across enterprise pharmaceutical pipelines."
          },
          {
            time: "11:45 AM – 01:00 PM",
            title: "Executive Panel: Navigating AI Transformation in Regulated Healthcare Environments",
            type: "Panel",
            room: "Hall A",
            track: "Regulatory & IT Track",
            speaker: { name: "Pharma IT Leaders", role: "CIOs & VP Technologists", company: "Top 10 Global Pharma Firms" },
            description: "Balancing rapid technological adoption with strict patient safety and global regulatory mandates."
          },
          {
            time: "02:00 PM – 04:00 PM",
            title: "Ecosystem Exhibition & Partnership Matchmaking Sessions",
            type: "Networking",
            room: "Exhibition Concourse",
            track: "Plenary Stage",
            speaker: { name: "140+ Companies", role: "Delegates", company: "GPACTS 2026" },
            description: "One-on-one technology consultations and collaborative agreement discussions."
          }
        ]
      }
    ],
    speakers: [
      {
        id: "sp-gpacts-1",
        name: "Nagunoori Durga Prasad",
        gender: "male",
        role: "Founder & Managing Director",
        company: "NexziByte Solutions",
        topic: "Bridging Enterprise AI with Healthcare & Pharma Workflows",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80",
        bio: "Founder and Managing Director leading digital product engineering and enterprise AI solutions across healthcare and technology verticals.",
        linkedin: "https://linkedin.com",
        featured: true
      },
      {
        id: "sp-gpacts-2",
        name: "Dr. K. Srinivas Rao",
        gender: "male",
        role: "Head of Digital Health & Bio-AI",
        company: "Global Therapeutics",
        topic: "Predictive Analytics in Phase 3 Clinical Protocols",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
        bio: "Leading translational research in utilizing neural networks to shorten clinical validation timelines by 40%.",
        linkedin: "https://linkedin.com",
        featured: true
      }
    ],
    sponsors: {
      title: {
        name: "GPACTS Council & NexziByte",
        role: "Host & Technology Partner",
        logo: "GPACTS",
        desc: "Global Pharmaceutical AI & Technology Summit.",
        website: "#"
      },
      platinum: [
        { name: "Global Pharma Consortium", symbol: "GPC", category: "Life Sciences Partner" },
        { name: "BioTech AI Hub", symbol: "BAI", category: "Computational Biology Partner" }
      ],
      gold: [
        { name: "Healthcare Cloud Systems", symbol: "HCS", category: "HIPAA Compliant Cloud" }
      ],
      ecosystem: [
        { name: "Genome Valley Hyderabad", type: "Cluster Partner" }
      ]
    },
    venue: {
      name: "Hyderabad Convention Centre",
      subname: "International Life Sciences & IT Convention Arena",
      address: "HITEC City / Madhapur Business District, Hyderabad, Telangana 500081",
      city: "Hyderabad, India",
      coordinates: "17.4474° N, 78.3762° E",
      hall: "Grand Plenary Auditorium & Executive Boardrooms",
      phone: "+91 40 6682 8800",
      features: [
        "Specialized scientific presentation screens and wireless audio",
        "Executive lounges for private B2B discussions",
        "Full pharmaceutical and biotech exhibition concourse"
      ],
      transit: {
        metro: "Durgam Cheruvu Metro Station (Blue Line) — 5 mins",
        airport: "Hyderabad International Airport (HYD) — 32 mins",
        railway: "Hyderabad Deccan (Nampally) — 25 mins",
        cab: "Direct cab pickup zone at Main Gate"
      }
    },
    tickets: [
      {
        id: "visitor-pass",
        name: "Visitor Pass",
        badge: "COMMUNITY PASS",
        price: "FREE",
        amountNum: 0,
        currency: "",
        validity: "Open Exhibition Access",
        features: ["Exhibition hall access", "General keynote seating", "Digital pass"],
        btnText: "Claim Free Visitor Pass",
        recommended: false,
        passTypeId: "visitor-pass"
      },
      {
        id: "delegate-pass",
        name: "Executive Delegate Pass",
        badge: "DELEGATE ENTRY",
        price: "₹250",
        amountNum: 250,
        currency: "₹",
        validity: "Full Summit & Sessions Access",
        features: ["All technical sessions", "Pharma AI roundtables", "Networking lunch", "Certificate"],
        btnText: "Get Delegate Pass — ₹250",
        recommended: true,
        passTypeId: "delegate-pass"
      }
    ],
    relatedSummits: ["featured-tech-innovation-summit-2026", "summit-gcc-2026", "summit-product-launch"]
  },
  {
    id: "summit-gcc-2026",
    title: "Global Capability Center (GCC) Summit 2026",
    subtitle: "Enterprise Technology, AI & Cloud Automation at ITC Kohenur",
    badge: "ENTERPRISE GCC WORLD",
    statusBadge: "Registration Available",
    tagline: "Another Summit. Another Opportunity to Connect, Collaborate & Shape Innovation.",
    bannerImage: "/images/summit-gcc-announcement.jpg",
    date: "5th August 2026",
    rawDate: "2026-08-05",
    time: "09:00 AM – 06:30 PM IST",
    location: "ITC Kohenur, HITEC City, Hyderabad",
    mode: "In-Person Executive Summit",
    expectedAttendees: "500+ GCC Leaders & Innovators",
    spotsLeft: 22,
    stats: [
      { label: "GCC Leaders", value: "500+" },
      { label: "Enterprise Innovators", value: "100+" },
      { label: "AI & Tech Tracks", value: "25+" },
      { label: "Global Enterprises", value: "80+" }
    ],
    about: `Nagunoori Durga Prasad, Founder & Managing Director of NexziByte Solutions Pvt. Ltd., joins GCC leaders, enterprise delegates, and the ETGCCWorld community at ITC Kohenur, Hyderabad to explore the future of Enterprise AI, Cloud Computing, and Intelligent Automation.

Global Capability Centers in India have evolved from transactional execution hubs into strategic engines of global technology innovation. The GCC Summit 2026 convenes the leaders who head these massive organizations to discuss how AI-driven products and scalable engineering teams drive global business transformation.

NexziByte Solutions engages with GCC leaders to showcase enterprise software frameworks, scalable talent pipelines, and custom AI products built to power multinational operational resilience.`,
    highlights: [
      "In-depth dialogues on the transition of GCCs into Global Product Innovation Centers",
      "Featuring Nagunoori Durga Prasad, Founder & MD of NexziByte Solutions",
      "Executive networking at the prestigious ITC Kohenur, overlooking Durgam Cheruvu",
      "Exploring enterprise software architectures, LLM automation, and cloud cost management",
      "Building strategic technology partnerships across Fortune 500 GCC entities"
    ],
    whoShouldAttend: [
      {
        title: "GCC Managing Directors & Center Heads",
        desc: "Share best practices on scaling talent, navigating multi-region compliance, and driving R&D value."
      },
      {
        title: "Chief Technology Officers & VPs of Engineering",
        desc: "Analyze modern software stacks, cloud transformation, and automated QA systems."
      },
      {
        title: "Technology Partners & Solution Providers",
        desc: "Connect directly with GCC decision-makers seeking agile digital engineering partners."
      }
    ],
    themes: [
      {
        title: "GCCs as Global Value Creators",
        desc: "Moving up the value chain from cost-arbitrage centers to autonomous centers of product excellence."
      },
      {
        title: "Intelligent Automation & Enterprise AI",
        desc: "Implementing enterprise-grade cognitive systems to streamline global supply chains, operations, and IT support."
      },
      {
        title: "Talent Architecture & Tech Leadership",
        desc: "Attracting, mentoring, and retaining top-tier software engineers and AI practitioners."
      }
    ],
    agenda: [
      {
        day: "Full-Day Summit",
        date: "Wednesday, August 5, 2026",
        tracks: ["Main Ballroom Stage", "Enterprise AI Lounge", "GCC Leadership Roundtables"],
        sessions: [
          {
            time: "09:00 AM – 10:00 AM",
            title: "Welcome Address & State of Global Capability Centers 2026",
            type: "Keynote",
            room: "Kohinoor Grand Ballroom",
            track: "Main Ballroom Stage",
            speaker: { name: "ETGCCWorld Leadership", role: "Conference Directors", company: "ETGCCWorld" },
            description: "Unveiling latest benchmark metrics on GCC expansion and high-value tech employment in India."
          },
          {
            time: "10:15 AM – 11:30 AM",
            title: "Keynote Session: Building AI-Powered Scalable Digital Solutions for Global Enterprises",
            type: "Keynote",
            room: "Kohinoor Grand Ballroom",
            track: "Main Ballroom Stage",
            speaker: { name: "Nagunoori Durga Prasad", gender: "male", role: "Founder & MD", company: "NexziByte Solutions", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80" },
            description: "How NexziByte architects AI-powered products and scalable enterprise software that help global organizations transform and grow."
          },
          {
            time: "11:45 AM – 01:00 PM",
            title: "Panel: Cloud Automation & Cost Governance in Multi-Tenant Environments",
            type: "Panel",
            room: "Summit Room 1",
            track: "Enterprise AI Lounge",
            speaker: { name: "Enterprise Cloud Leaders", role: "Heads of Cloud Architecture", company: "Global GCCs" },
            description: "Practical approaches to managing multi-million-dollar AWS/Azure bills while maintaining 99.99% availability."
          },
          {
            time: "01:00 PM – 02:30 PM",
            title: "Networking Luncheon & Executive Bilateral Meetings",
            type: "Networking",
            room: "Golconda Atrium & Dining Verandah",
            track: "GCC Leadership Roundtables",
            speaker: { name: "All Delegates", role: "Leaders", company: "Global Capability Centers" },
            description: "Curated networking lunch with private meeting suites for enterprise collaboration."
          }
        ]
      }
    ],
    speakers: [
      {
        id: "sp-gcc-1",
        name: "Nagunoori Durga Prasad",
        gender: "male",
        role: "Founder & Managing Director",
        company: "NexziByte Solutions",
        topic: "Enterprise AI, Cloud & Intelligent Digital Products for Global GCCs",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80",
        bio: "Founder and MD of NexziByte Solutions, leading enterprise digital transformation, AI initiatives, and tech ecosystem development.",
        linkedin: "https://linkedin.com",
        featured: true
      },
      {
        id: "sp-gcc-2",
        name: "Ananya Deshmukh",
        gender: "female",
        role: "Managing Director",
        company: "Global Tech GCC India",
        topic: "Evolving GCCs into Global Product Innovation Hubs",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
        bio: "Pioneering technology leader driving multi-million-dollar digital transformations across South Asia and Europe.",
        linkedin: "https://linkedin.com",
        featured: true
      }
    ],
    sponsors: {
      title: {
        name: "NexziByte Solutions & ETGCCWorld",
        role: "Host & Enterprise Technology Partner",
        logo: "NEXZIBYTE",
        desc: "Scalable enterprise software and AI solutions.",
        website: "#"
      },
      platinum: [
        { name: "ITC Kohenur", symbol: "ITC", category: "Hospitality & Venue Host" },
        { name: "Enterprise Cloudways", symbol: "ECW", category: "Cloud Partner" }
      ],
      gold: [],
      ecosystem: [
        { name: "ETGCCWorld Network", type: "Ecosystem Partner" }
      ]
    },
    venue: {
      name: "ITC Kohenur, Hyderabad",
      subname: "Luxury Business & Conference Landmark at HITEC City",
      address: "Plot No. 5, Survey No. 83/1, Hyderabad Knowledge City, Madhapur, Hyderabad, Telangana 500081",
      city: "Hyderabad, India",
      coordinates: "17.4332° N, 78.3846° E",
      hall: "Kohinoor Grand Ballroom & Executive Boardrooms",
      phone: "+91 40 6766 0101",
      features: [
        "Unrivaled five-star luxury amenities with panoramic lake views",
        "High-definition AV conferencing and secure acoustic partitions",
        "Fine-dining catering and private executive suites for bilateral discussions"
      ],
      transit: {
        metro: "Raidurg Metro Station — 4 mins",
        airport: "Hyderabad Airport (HYD) — 30 mins via ORR",
        railway: "Lingampally Railway Station — 20 mins",
        cab: "Dedicated hotel concierge and valet staging"
      }
    },
    tickets: [
      {
        id: "visitor-pass",
        name: "Visitor Pass",
        badge: "COMMUNITY PASS",
        price: "FREE",
        amountNum: 0,
        currency: "",
        validity: "Open Session Access",
        features: ["Open session access", "Exhibition viewing", "Digital Pass"],
        btnText: "Claim Free Visitor Pass",
        recommended: false,
        passTypeId: "visitor-pass"
      },
      {
        id: "delegate-pass",
        name: "Executive Delegate Pass",
        badge: "ALL-ACCESS",
        price: "₹250",
        amountNum: 250,
        currency: "₹",
        validity: "Full Summit & Networking Access",
        features: ["All GCC leadership sessions", "Enterprise AI roundtables", "Networking luncheon", "Certificate"],
        btnText: "Get Delegate Pass — ₹250",
        recommended: true,
        passTypeId: "delegate-pass"
      }
    ],
    relatedSummits: ["featured-tech-innovation-summit-2026", "summit-gpacts-2026", "summit-product-launch"]
  },
  {
    id: "summit-product-launch",
    title: "NexziByte Product Launch Unveiled by Shri Ponnam Prabhakar Garu",
    subtitle: "Ministerial Unveiling & Enterprise Technology Showcase",
    badge: "MINISTERIAL UNVEILING",
    statusBadge: "Milestone Accomplished",
    tagline: "A Significant Step Forward in Empowering Businesses With Cutting-Edge Technology",
    bannerImage: "/images/summit-product-launch.jpg",
    date: "August 2026",
    rawDate: "2026-08-20",
    time: "10:30 AM – 02:00 PM IST",
    location: "Hyderabad, India",
    mode: "VIP Ministerial Ceremony",
    expectedAttendees: "350+ Leaders & Dignitaries",
    spotsLeft: 0,
    stats: [
      { label: "Dignitaries", value: "25+" },
      { label: "Enterprise Leaders", value: "150+" },
      { label: "Products Unveiled", value: "3" },
      { label: "Media Coverage", value: "12+" }
    ],
    about: `We are honored to celebrate the successful launch of our flagship product suite, unveiled by Shri Ponnam Prabhakar garu (Hon'ble Minister for Transport and BC Welfare, Government of Telangana).

This milestone marks a significant leap forward in NexziByte's journey to innovate and deliver impactful digital solutions. The launch reflects our enduring commitment to empowering businesses, educational institutions, and professionals with cutting-edge technology.

We extend our deepest gratitude to Shri Ponnam Prabhakar garu for his generous support and encouragement, and to our dedicated team whose relentless efforts made this historic achievement possible.`,
    highlights: [
      "Official product unveiling ceremony led by Shri Ponnam Prabhakar garu",
      "Showcasing NexziByte's next-generation enterprise software ecosystem",
      "Attended by government dignitaries, enterprise clients, and community mentors",
      "Demonstrating technology solutions designed to spur regional innovation and youth employment"
    ],
    whoShouldAttend: [
      {
        title: "Enterprise Technology Partners",
        desc: "Explore newly unveiled enterprise software and collaboration frameworks."
      },
      {
        title: "Government & Industry Delegations",
        desc: "Discover public-private initiatives accelerating digital literacy and tech adoption."
      }
    ],
    themes: [
      {
        title: "Digital Empowerment & Regional Growth",
        desc: "Fostering technology-driven employment, internships, and entrepreneurship in Telangana."
      },
      {
        title: "Enterprise Software Innovation",
        desc: "Building accessible, world-class digital platforms with modern security and cloud architecture."
      }
    ],
    agenda: [
      {
        day: "Ceremony Schedule",
        date: "Thursday, August 20, 2026",
        tracks: ["Main Stage"],
        sessions: [
          {
            time: "10:30 AM – 11:00 AM",
            title: "Welcome Address & Introduction to NexziByte Mission",
            type: "Keynote",
            room: "Main Auditorium",
            track: "Main Stage",
            speaker: { name: "Nagunoori Durga Prasad", role: "Founder & MD", company: "NexziByte Solutions" },
            description: "Opening reflections on the journey of NexziByte Solutions and the technology vision."
          },
          {
            time: "11:00 AM – 12:00 PM",
            title: "Official Product Unveiling by Shri Ponnam Prabhakar garu",
            type: "Unveiling",
            room: "Main Stage",
            track: "Main Stage",
            speaker: { name: "Shri Ponnam Prabhakar garu", role: "Hon'ble Minister", company: "Govt. of Telangana" },
            description: "Keynote address on regional tech growth, youth skilling, and product innovation."
          },
          {
            time: "12:00 PM – 01:30 PM",
            title: "Product Demonstration & Felicitations",
            type: "Showcase",
            room: "Main Stage",
            track: "Main Stage",
            speaker: { name: "Engineering Leadership Team", role: "Product Architects", company: "NexziByte Solutions" },
            description: "Live demonstration of product features followed by felicitation of contributors."
          }
        ]
      }
    ],
    speakers: [
      {
        id: "sp-launch-1",
        name: "Shri Ponnam Prabhakar garu",
        gender: "male",
        role: "Hon'ble Minister for Transport and BC Welfare",
        company: "Government of Telangana",
        topic: "Empowering Regional Innovation, Youth Skilling & Digital Leadership",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
        bio: "Distinguished public leader championing infrastructure development, welfare, and technology empowerment across Telangana.",
        linkedin: "#",
        featured: true
      },
      {
        id: "sp-launch-2",
        name: "Nagunoori Durga Prasad",
        gender: "male",
        role: "Founder & Managing Director",
        company: "NexziByte Solutions",
        topic: "The NexziByte Vision: Building Impactful Technology Products",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80",
        bio: "Founder and Managing Director leading digital product engineering and enterprise software innovation.",
        linkedin: "https://linkedin.com",
        featured: true
      }
    ],
    sponsors: {
      title: {
        name: "NexziByte Solutions",
        role: "Product Creator & Host",
        logo: "NEXZIBYTE",
        desc: "Enterprise software & digital products.",
        website: "https://nexzibyte.com"
      },
      platinum: [],
      gold: [],
      ecosystem: [
        { name: "Government of Telangana", type: "Supporting Institution" }
      ]
    },
    venue: {
      name: "Government & Enterprise Delegation Hall",
      subname: "Central State Convention Arena",
      address: "HITEC City / Secretariat Precinct, Hyderabad, Telangana",
      city: "Hyderabad, India",
      coordinates: "17.4123° N, 78.4712° E",
      hall: "Plenary Chamber",
      phone: "+91 40 2345 0000",
      features: [
        "State-of-the-art ministerial briefing stage",
        "High-security protocol and dignitary suites",
        "Press and broadcast media facilities"
      ],
      transit: {
        metro: "Assembly / HITEC City Stations",
        airport: "Hyderabad Airport (HYD) — 30 mins",
        railway: "Hyderabad Deccan — 10 mins",
        cab: "VIP Entrance Gate 1"
      }
    },
    tickets: [
      {
        id: "visitor-pass",
        name: "Visitor Pass",
        badge: "COMMUNITY PASS",
        price: "FREE",
        amountNum: 0,
        currency: "",
        validity: "Open Access",
        features: ["Community pass", "Product keynote replay"],
        btnText: "Claim Free Visitor Pass",
        recommended: false,
        passTypeId: "visitor-pass"
      },
      {
        id: "delegate-pass",
        name: "Delegate Pass",
        badge: "COMMUNITY DELEGATE",
        price: "₹250",
        amountNum: 250,
        currency: "₹",
        validity: "Complete Access",
        features: ["Full session recordings", "Launch certificate", "Community perks"],
        btnText: "Get Delegate Pass — ₹250",
        recommended: true,
        passTypeId: "delegate-pass"
      }
    ],
    relatedSummits: ["featured-tech-innovation-summit-2026", "summit-gpacts-2026", "summit-gcc-2026"]
  }
];

export const DEFAULT_SUMMIT = SUMMIT_LIST[0];
