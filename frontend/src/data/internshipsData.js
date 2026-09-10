/* ══════════════════════════════════════════════════════════════════
   NEXZIBYTE TECHTALK — COMPREHENSIVE INTERNSHIPS CATALOG
   23 Specialized Industry Internship Tracks with Stipends & PPO Pathways
   ══════════════════════════════════════════════════════════════════ */

export const INTERNSHIP_CATEGORIES = [
  { id: "all", label: "All Internships" },
  { id: "software-web", label: "💻 Software & Full Stack" },
  { id: "ai-data", label: "🤖 AI, ML & Data Science" },
  { id: "systems-cloud", label: "☁️ Systems & DevOps" },
  { id: "design-creative", label: "🎨 UI/UX & Creative" },
  { id: "business-ops", label: "📊 Business & Operations" },
];

export const INTERNSHIPS = [
  // ─────────────────────────────────────────────────────────────
  // 1. SOFTWARE & FULL STACK INTERNSHIPS
  // ─────────────────────────────────────────────────────────────
  {
    id: "fullstack-development-internship",
    title: "Full Stack Development Internship",
    category: "FULL STACK ENGINEERING",
    categoryGroup: "software-web",
    badge: "Most Popular",
    duration: "3 - 6 Months",
    stipend: "Performance Stipend + PPO Opportunity",
    location: "Hyderabad (Hybrid) / Remote Available",
    eligibility: "B.Tech / MCA / Degree (2024 - 2027 Graduates)",
    openings: "12 Openings",
    shortDesc: "Work alongside senior full-stack architects building scalable web platforms, REST APIs, and database schemas with live production deployment.",
    responsibilities: [
      "Develop responsive client-side UI components and connect them with backend APIs.",
      "Design relational and NoSQL database schemas for production workloads.",
      "Implement authentication, authorization, and role-based access control.",
      "Participate in weekly sprint reviews, code refactoring, and CI/CD releases."
    ],
    skills: ["React.js", "Node.js", "Express.js", "PostgreSQL", "MongoDB", "REST APIs", "Git", "Docker"],
    perks: ["Live Enterprise Deployments", "Senior Architect Mentorship", "Certificate of Internship", "Letter of Recommendation", "Pre-Placement Offer (PPO)"],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: "software-development-internship",
    title: "Software Development Internship",
    category: "CORE SOFTWARE ENGINEERING",
    categoryGroup: "software-web",
    badge: "Core Engineering",
    duration: "3 - 6 Months",
    stipend: "Performance Stipend + PPO Opportunity",
    location: "Hyderabad (In-Office / Hybrid)",
    eligibility: "B.Tech (CSE, IT, ECE) & MCA Students",
    openings: "10 Openings",
    shortDesc: "Tackle core software engineering challenges, data structures, algorithm optimization, and enterprise feature development across modern tech stacks.",
    responsibilities: [
      "Write clean, modular, and testable code adhering to SOLID software design principles.",
      "Implement automated unit and integration tests using modern testing frameworks.",
      "Optimize system algorithms for memory efficiency and execution speed.",
      "Collaborate with QA and Product teams to investigate and resolve defects."
    ],
    skills: ["Data Structures", "Algorithms", "Java / Python", "OOP", "SQL", "Git", "Clean Architecture", "Unit Testing"],
    perks: ["Code Review from Principal Engineers", "High-Scale Systems Exposure", "Internship Certificate", "Fast-Track PPO"],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: "python-internship",
    title: "Python Internship",
    category: "PYTHON & AUTOMATION",
    categoryGroup: "software-web",
    badge: "High Demand",
    duration: "3 - 6 Months",
    stipend: "Performance Stipend + PPO Opportunity",
    location: "Hyderabad (Hybrid) / Remote",
    eligibility: "Students & Recent Graduates with Python Proficiency",
    openings: "8 Openings",
    shortDesc: "Build backend automation scripts, asynchronous API services, and data scrapers using modern Python 3, FastAPI, and database connectors.",
    responsibilities: [
      "Build asynchronous REST APIs and microservices using FastAPI and Django.",
      "Write data automation pipelines and web scraping tools with Python.",
      "Integrate PostgreSQL and Redis caching for high-speed response times.",
      "Package Python applications into lightweight Docker containers for cloud hosting."
    ],
    skills: ["Python 3", "FastAPI", "Django", "Asyncio", "PostgreSQL", "Redis", "Docker", "Pytest"],
    perks: ["Real-World Automation Projects", "Cloud Deployment Experience", "Official Internship Letter", "PPO Consideration"],
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: "java-internship",
    title: "Java Internship",
    category: "ENTERPRISE BACKEND",
    categoryGroup: "software-web",
    badge: "Enterprise Track",
    duration: "3 - 6 Months",
    stipend: "Performance Stipend + PPO Opportunity",
    location: "Hyderabad (In-Office / Hybrid)",
    eligibility: "B.Tech / MCA with Core Java Knowledge",
    openings: "8 Openings",
    shortDesc: "Contribute to enterprise-grade backend microservices, Spring Boot architectures, JPA persistence layers, and cloud infrastructure.",
    responsibilities: [
      "Develop secure REST controllers using Spring Boot 3 and Java 17/21.",
      "Implement data persistence layers using Spring Data JPA and Hibernate.",
      "Configure Spring Security with JWT tokens and role-based permissions.",
      "Participate in daily Scrum standups and pull request reviews on GitHub."
    ],
    skills: ["Core Java", "Spring Boot", "Hibernate/JPA", "MySQL/PostgreSQL", "REST APIs", "Maven", "JUnit 5", "Git"],
    perks: ["Enterprise Client Project Access", "Direct Tech Lead Guidance", "Internship Certification", "Pre-Placement Offer"],
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: "reactjs-internship",
    title: "React.js Internship",
    category: "FRONTEND ENGINEERING",
    categoryGroup: "software-web",
    badge: "Frontend Star",
    duration: "3 - 6 Months",
    stipend: "Performance Stipend + PPO Opportunity",
    location: "Hyderabad (Hybrid) / Remote",
    eligibility: "Graduates & Students with Strong React & JS Fundamentals",
    openings: "10 Openings",
    shortDesc: "Craft fluid, accessible, and high-performance Single Page Applications (SPAs) with modern React, hooks, state managers, and component libraries.",
    responsibilities: [
      "Translate Figma UI designs into pixel-perfect, responsive React components.",
      "Manage global and local application state using Redux Toolkit or Zustand.",
      "Integrate client-side routing, Axios interceptors, and error boundaries.",
      "Optimize web vital scores, lazy-loading, and bundle sizes for lightning speed."
    ],
    skills: ["React 18", "JavaScript ES6+", "Redux Toolkit", "TailwindCSS", "HTML5 & CSS3", "REST APIs", "Vite", "Git"],
    perks: ["Production App Portfolio", "UX Design System Collaboration", "Internship Certificate", "Full-Time Hiring Pipeline"],
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: "nextjs-internship",
    title: "Next.js Internship",
    category: "FULL STACK WEB",
    categoryGroup: "software-web",
    badge: "Hot Tech",
    duration: "3 - 6 Months",
    stipend: "Performance Stipend + PPO Opportunity",
    location: "Hyderabad (Hybrid) / Remote",
    eligibility: "Passionate Web Developers with React & TypeScript Basics",
    openings: "6 Openings",
    shortDesc: "Engineer modern web applications utilizing Next.js App Router, Server Components (RSC), server actions, SEO optimization, and Edge deployment.",
    responsibilities: [
      "Build server-rendered and statically generated web apps using Next.js 14/15.",
      "Implement server actions and API routes with Prisma ORM database querying.",
      "Optimize Core Web Vitals, metadata, Open Graph tags, and technical SEO.",
      "Deploy scalable applications to Vercel and AWS Amplify."
    ],
    skills: ["Next.js (App Router)", "React.js", "TypeScript", "Prisma ORM", "TailwindCSS", "Server Actions", "Vercel"],
    perks: ["Cutting-Edge Framework Stack", "High-Impact Product Launches", "Internship Letter", "PPO Fast-Track"],
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: "angular-fullstack-internship",
    title: "Angular Full Stack Internship",
    category: "ENTERPRISE SPA & FULL STACK",
    categoryGroup: "software-web",
    badge: "Enterprise Grade",
    duration: "3 - 6 Months",
    stipend: "Performance Stipend + PPO Opportunity",
    location: "Hyderabad (In-Office / Hybrid)",
    eligibility: "B.Tech / MCA Candidates with TypeScript / Web Basics",
    openings: "6 Openings",
    shortDesc: "Develop enterprise-scale full-stack systems using Angular, TypeScript, RxJS, Node.js/Java backends, and relational databases.",
    responsibilities: [
      "Build modular Angular components, services, and dependency injection patterns.",
      "Manage reactive data streams and complex event pipelines using RxJS.",
      "Integrate backend RESTful web services with route guards and auth interceptors.",
      "Deliver enterprise reporting and real-time dashboard modules."
    ],
    skills: ["Angular 17/18", "TypeScript", "RxJS", "Node.js / Java", "PostgreSQL", "Reactive Forms", "Git"],
    perks: ["Corporate Banking & ERP Projects", "Architectural Teardowns", "Certificate of Completion", "PPO Pathway"],
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: "backend-internship",
    title: "Backend Internship",
    category: "DISTRIBUTED BACKEND SYSTEMS",
    categoryGroup: "software-web",
    badge: "Scale & APIs",
    duration: "3 - 6 Months",
    stipend: "Performance Stipend + PPO Opportunity",
    location: "Hyderabad (Hybrid) / Remote",
    eligibility: "Students & Grads with Server-Side Programming Knowledge",
    openings: "8 Openings",
    shortDesc: "Design robust REST/GraphQL APIs, message brokers, caching mechanisms, database indexes, and cloud server backends.",
    responsibilities: [
      "Architect and deploy clean RESTful API endpoints with validation and rate limiting.",
      "Design optimized relational schemas and tune database indexes for high throughput.",
      "Implement asynchronous message queues using Redis or RabbitMQ.",
      "Write automated integration tests and configure health check monitoring."
    ],
    skills: ["Node.js / Python / Java", "PostgreSQL", "Redis", "REST & GraphQL", "Docker", "Authentication (JWT)", "Git"],
    perks: ["High-Throughput Backend Exposure", "Mentorship from Principal Architects", "Internship Letter", "PPO"],
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=900&auto=format&fit=crop&q=80"
  },

  // ─────────────────────────────────────────────────────────────
  // 2. AI, ML & DATA SCIENCE INTERNSHIPS
  // ─────────────────────────────────────────────────────────────
  {
    id: "ai-internship",
    title: "Artificial Intelligence Internship",
    category: "APPLIED ARTIFICIAL INTELLIGENCE",
    categoryGroup: "ai-data",
    badge: "Next-Gen AI",
    duration: "3 - 6 Months",
    stipend: "Performance Stipend + PPO Opportunity",
    location: "Hyderabad (Hybrid) / Remote",
    eligibility: "B.Tech / M.Tech / MCA with Strong Python & Math Foundations",
    openings: "8 Openings",
    shortDesc: "Build intelligent systems, autonomous agents, prompt architectures, and enterprise AI workflows using leading generative models and APIs.",
    responsibilities: [
      "Design and deploy LLM applications with LangChain, LlamaIndex, and vector databases.",
      "Implement Retrieval-Augmented Generation (RAG) pipelines over enterprise document stores.",
      "Fine-tune lightweight transformer models and optimize prompt token efficiency.",
      "Evaluate AI system outputs for accuracy, safety, and hallucination reduction."
    ],
    skills: ["Python", "Generative AI", "LangChain", "Vector DBs (Chroma/Pinecone)", "RAG Systems", "OpenAI APIs", "PyTorch"],
    perks: ["Direct R&D on Frontier AI", "Co-Publish Tech Teardowns", "Certificate of Internship", "PPO to Full-Time AI Engineer"],
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: "aiml-internship",
    title: "AI/ML Internship",
    category: "MACHINE LEARNING & INTELLIGENCE",
    categoryGroup: "ai-data",
    badge: "High Demand",
    duration: "3 - 6 Months",
    stipend: "Performance Stipend + PPO Opportunity",
    location: "Hyderabad (In-Office / Hybrid)",
    eligibility: "Passionate Students with Machine Learning & Python Skills",
    openings: "8 Openings",
    shortDesc: "Train, evaluate, and deploy supervised and unsupervised machine learning models on real-world industrial and transactional datasets.",
    responsibilities: [
      "Perform exploratory data analysis and feature engineering on dirty real-world data.",
      "Train classification and regression models using Scikit-learn, XGBoost, and LightGBM.",
      "Build model inference endpoints using FastAPI and containerize them with Docker.",
      "Track experiment metrics, model drift, and hyperparameter tuning in MLflow."
    ],
    skills: ["Python", "Machine Learning", "Scikit-Learn", "Pandas", "NumPy", "XGBoost", "FastAPI", "Docker"],
    perks: ["Hands-On ML Pipeline Delivery", "1:1 Data Scientist Mentoring", "Internship Letter", "PPO Opportunity"],
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: "data-science-internship",
    title: "Data Science Internship",
    category: "DATA SCIENCE & PREDICTIVE ANALYTICS",
    categoryGroup: "ai-data",
    badge: "Data Leader",
    duration: "3 - 6 Months",
    stipend: "Performance Stipend + PPO Opportunity",
    location: "Hyderabad (Hybrid) / Remote",
    eligibility: "Degree in CS, Data Science, Math, Stats or Related Disciplines",
    openings: "8 Openings",
    shortDesc: "Conduct statistical modeling, hypothesis testing, predictive analytics, and executive data storytelling that transforms raw numbers into strategic decisions.",
    responsibilities: [
      "Extract and clean large datasets from PostgreSQL, BigQuery, and external APIs.",
      "Design statistical tests and run A/B testing analysis on product feature cohorts.",
      "Develop predictive forecasting models for customer churn and revenue growth.",
      "Present data-driven presentations and interactive notebooks to project leads."
    ],
    skills: ["Python", "SQL", "Statistical Modeling", "Pandas", "Matplotlib/Seaborn", "Scikit-Learn", "Jupyter"],
    perks: ["Enterprise Analytics Experience", "Direct Executive Stakeholder Demos", "Internship Certification", "PPO Track"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: "data-visualization-internship",
    title: "Data Visualization Internship",
    category: "BUSINESS INTELLIGENCE & VISUALIZATION",
    categoryGroup: "ai-data",
    badge: "Visual BI",
    duration: "3 - 6 Months",
    stipend: "Performance Stipend + PPO Opportunity",
    location: "Hyderabad (In-Office / Hybrid)",
    eligibility: "Graduates & Students with Power BI / Tableau / SQL Knowledge",
    openings: "6 Openings",
    shortDesc: "Transform raw organizational databases into interactive executive dashboards using Microsoft Power BI, Tableau, and SQL reporting pipelines.",
    responsibilities: [
      "Build dynamic KPI dashboards and executive scorecards in Power BI and Tableau.",
      "Write complex DAX formulas, calculated measures, and Power Query transformations.",
      "Perform relational data modeling using star schema and snowflake schema patterns.",
      "Automate data refreshes and publish secure reports with row-level security."
    ],
    skills: ["Power BI", "Tableau", "SQL", "DAX", "Power Query", "Data Modeling", "Excel", "KPI Design"],
    perks: ["Portfolio of Executive Dashboards", "Corporate Client Engagement", "Certificate of Internship", "PPO Pathway"],
    image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=900&auto=format&fit=crop&q=80"
  },

  // ─────────────────────────────────────────────────────────────
  // 3. SYSTEMS, CLOUD & DEVOPS INTERNSHIPS
  // ─────────────────────────────────────────────────────────────
  {
    id: "devops-internship",
    title: "DevOps Internship",
    category: "CLOUD INFRASTRUCTURE & DEVOPS",
    categoryGroup: "systems-cloud",
    badge: "High Growth",
    duration: "3 - 6 Months",
    stipend: "Performance Stipend + PPO Opportunity",
    location: "Hyderabad (In-Office / Hybrid)",
    eligibility: "B.Tech / MCA with Linux & Cloud Basics",
    openings: "6 Openings",
    shortDesc: "Automate continuous integration, container orchestration, Infrastructure as Code, and production monitoring for cloud-native software.",
    responsibilities: [
      "Build and maintain CI/CD pipelines using GitHub Actions and Jenkins.",
      "Write Dockerfiles and multi-container Docker Compose stacks for engineering teams.",
      "Manage Kubernetes deployments, services, ingress controllers, and config maps.",
      "Monitor cluster health and server metrics using Prometheus and Grafana."
    ],
    skills: ["Linux (Ubuntu/CentOS)", "Docker", "Kubernetes", "GitHub Actions", "AWS / Azure", "Terraform", "Prometheus"],
    perks: ["Cloud Architecture Production Access", "DevOps Engineer Career Mentoring", "Internship Letter", "PPO Fast-Track"],
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: "digital-engineering-internship",
    title: "Digital Engineering Internship",
    category: "DIGITAL TRANSFORMATION & CLOUD",
    categoryGroup: "systems-cloud",
    badge: "Industry 4.0",
    duration: "3 - 6 Months",
    stipend: "Performance Stipend + PPO Opportunity",
    location: "Hyderabad (Hybrid)",
    eligibility: "Engineering Graduates (All Disciplines)",
    openings: "6 Openings",
    shortDesc: "Drive digital modernization initiatives, cloud integration, API gateways, and automated enterprise workflows across client systems.",
    responsibilities: [
      "Participate in legacy software modernization and cloud migration assessments.",
      "Integrate enterprise SaaS platforms via REST webhooks and middleware pipelines.",
      "Develop digital self-service tools and internal process automation workflows.",
      "Document architectural diagrams, data flows, and security compliance matrices."
    ],
    skills: ["Cloud Computing", "REST APIs", "Python", "SQL", "System Architecture", "Agile Methodology", "Process Automation"],
    perks: ["Cross-Functional Tech Exposure", "Client Transformation Experience", "Certificate of Internship", "PPO Opportunity"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: "system-engineering-internship",
    title: "System Engineering Internship",
    category: "SYSTEMS INFRASTRUCTURE",
    categoryGroup: "systems-cloud",
    badge: "Core Systems",
    duration: "3 - 6 Months",
    stipend: "Performance Stipend + PPO Opportunity",
    location: "Hyderabad (In-Office)",
    eligibility: "B.Tech (CSE/ECE/EEE) & MCA Candidates",
    openings: "6 Openings",
    shortDesc: "Manage enterprise server operating systems, networking infrastructure, hardware provisioning, virtualization, and systems reliability.",
    responsibilities: [
      "Administer and configure Linux and Windows enterprise server environments.",
      "Set up network subnets, firewalls, DNS routing, and VPN connections.",
      "Automate repetitive server maintenance tasks using Shell / Bash scripting.",
      "Diagnose system bottlenecks, hardware logs, and memory performance issues."
    ],
    skills: ["Linux Server Administration", "Bash Scripting", "Networking (TCP/IP, DNS)", "Virtualization (VMware/KVM)", "System Security"],
    perks: ["Data Center & Cloud Infrastructure Hands-on", "Systems Engineering Cert", "PPO to Full-Time Systems Engineer"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: "system-associate-internship",
    title: "System Associate Internship",
    category: "IT INFRASTRUCTURE & SUPPORT",
    categoryGroup: "systems-cloud",
    badge: "Career Launchpad",
    duration: "3 - 6 Months",
    stipend: "Performance Stipend + PPO Opportunity",
    location: "Hyderabad (In-Office)",
    eligibility: "Any Degree / Diploma / B.Tech Freshers",
    openings: "8 Openings",
    shortDesc: "Support IT system provisioning, user access control, cloud account configurations, workstation security, and day-to-day enterprise operations.",
    responsibilities: [
      "Provision and configure software environments for engineering teams.",
      "Manage identity and access directories (Active Directory / Microsoft Entra ID).",
      "Monitor system uptime, security patch compliance, and incident tickets.",
      "Assist in IT asset tracking and network connectivity troubleshooting."
    ],
    skills: ["Windows & Linux OS", "Active Directory", "Network Troubleshooting", "Hardware Setup", "IT Service Desk Tools"],
    perks: ["Comprehensive IT Foundations", "Fast-Track Corporate Onboarding", "Internship Letter", "PPO Pathway"],
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=900&auto=format&fit=crop&q=80"
  },

  // ─────────────────────────────────────────────────────────────
  // 4. UI/UX & CREATIVE INTERNSHIPS
  // ─────────────────────────────────────────────────────────────
  {
    id: "uiux-internship",
    title: "UI/UX Internship",
    category: "PRODUCT DESIGN & EXPERIENCE",
    categoryGroup: "design-creative",
    badge: "Creative Tech",
    duration: "3 - 6 Months",
    stipend: "Performance Stipend + PPO Opportunity",
    location: "Hyderabad (Hybrid) / Remote",
    eligibility: "Design & Tech Students with Figma Proficiency",
    openings: "6 Openings",
    shortDesc: "Design intuitive, delightful digital interfaces, user flows, clickable prototypes in Figma, and design systems for enterprise and web applications.",
    responsibilities: [
      "Conduct user research, synthesize personas, and create user journey maps.",
      "Design wireframes, low-fidelity concepts, and high-fidelity mockups in Figma.",
      "Build scalable UI design tokens, component variants, and auto-layout systems.",
      "Collaborate closely with frontend engineers to ensure pixel-perfect implementation."
    ],
    skills: ["Figma", "Wireframing", "Design Systems", "User Research", "Prototyping", "Information Architecture", "Mobile & Web UX"],
    perks: ["Shipped Product Design Portfolio", "1:1 Senior Product Designer Mentorship", "Internship Certificate", "PPO Consideration"],
    image: "https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: "graphic-design-internship",
    title: "Graphic Design Internship",
    category: "VISUAL BRANDING & MEDIA",
    categoryGroup: "design-creative",
    badge: "Visual Arts",
    duration: "3 - 6 Months",
    stipend: "Performance Stipend + PPO Opportunity",
    location: "Hyderabad (In-Office / Hybrid)",
    eligibility: "Creative Minds with Adobe Suite / Figma Skills",
    openings: "6 Openings",
    shortDesc: "Create compelling visual assets, digital branding, social media campaigns, event collateral, and marketing visuals for tech summits and products.",
    responsibilities: [
      "Design high-impact social media banners, event posters, and digital brochures.",
      "Create branded presentation decks and visual infographics for technology talks.",
      "Ensure strict visual consistency across typography, color palettes, and logos.",
      "Collaborate with marketing teams to produce creative campaign assets."
    ],
    skills: ["Adobe Photoshop", "Adobe Illustrator", "Figma", "Canva Pro", "Typography", "Visual Branding", "Layout Design"],
    perks: ["Published Summit Brand Collateral", "Creative Freedom & Portfolio Building", "Internship Letter", "PPO Track"],
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: "digital-marketing-internship",
    title: "Digital Marketing Internship",
    category: "GROWTH & DIGITAL MARKETING",
    categoryGroup: "design-creative",
    badge: "Growth Engine",
    duration: "3 - 6 Months",
    stipend: "Performance Stipend + PPO Opportunity",
    location: "Hyderabad (Hybrid) / Remote",
    eligibility: "Graduates & Students with Digital Marketing Curiosity",
    openings: "6 Openings",
    shortDesc: "Execute digital growth campaigns, SEO optimization, performance marketing, social community building, and technical content distribution.",
    responsibilities: [
      "Manage social media channels (LinkedIn, Twitter/X, Instagram, YouTube) for TechTalk.",
      "Implement on-page and technical SEO strategies to increase organic search traffic.",
      "Create high-converting email newsletters and community announcement campaigns.",
      "Track marketing analytics, conversion funnels, and campaign ROI metrics."
    ],
    skills: ["SEO / SEM", "Social Media Marketing", "Content Strategy", "Google Analytics", "Email Campaigns", "Copywriting", "Canva"],
    perks: ["Live Campaign Budget Experience", "Community Growth Ownership", "Certificate of Internship", "PPO Pathway"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80"
  },

  // ─────────────────────────────────────────────────────────────
  // 5. BUSINESS, HR & OPERATIONS INTERNSHIPS
  // ─────────────────────────────────────────────────────────────
  {
    id: "business-development-internship",
    title: "Business Development Internship",
    category: "BUSINESS GROWTH & PARTNERSHIPS",
    categoryGroup: "business-ops",
    badge: "Revenue & Growth",
    duration: "3 - 6 Months",
    stipend: "Performance Stipend + Incentives + PPO",
    location: "Hyderabad (In-Office / Hybrid)",
    eligibility: "BBA / MBA / B.Tech Graduates with Strong Communication",
    openings: "8 Openings",
    shortDesc: "Engage with enterprise partners, tech startup founders, and educational institutions to forge strategic partnerships and expand community reach.",
    responsibilities: [
      "Identify and connect with potential corporate sponsors and summit partners.",
      "Prepare customized business proposals and sponsorship pitch decks.",
      "Conduct introductory partner meetings and maintain sales pipeline records in CRM.",
      "Represent NexziByte TechTalk at industry networking events and college meetups."
    ],
    skills: ["Client Relationship Management", "Sales Pitching", "Market Research", "CRM Tools", "Negotiation", "Public Speaking"],
    perks: ["High Performance Incentives", "Executive Corporate Networking", "Certificate of Internship", "PPO Opportunity"],
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: "hr-internship",
    title: "HR Internship",
    category: "HUMAN RESOURCES & TALENT ACQUISITION",
    categoryGroup: "business-ops",
    badge: "People Operations",
    duration: "3 - 6 Months",
    stipend: "Performance Stipend + PPO Opportunity",
    location: "Hyderabad (In-Office / Hybrid)",
    eligibility: "MBA (HR), BBA, or Any Graduate Interested in People Ops",
    openings: "6 Openings",
    shortDesc: "Drive tech talent acquisition, candidate screening, campus recruitment drives, onboarding experiences, and internal culture initiatives.",
    responsibilities: [
      "Source candidate profiles across LinkedIn, job portals, and campus alumni networks.",
      "Schedule and coordinate technical interviews with engineering team leads.",
      "Facilitate seamless onboarding and documentation for new internship cohorts.",
      "Organize employee engagement activities, feedback surveys, and culture workshops."
    ],
    skills: ["Talent Sourcing", "Interview Scheduling", "HR Operations", "Candidate Screening", "LinkedIn Recruiter", "Communication"],
    perks: ["Hands-On Tech Hiring Experience", "End-to-End Recruitment Ownership", "Internship Letter", "PPO Conversion"],
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: "process-executive-internship",
    title: "Process Executive Internship",
    category: "OPERATIONS & PROCESS EXCELLENCE",
    categoryGroup: "business-ops",
    badge: "Operations Core",
    duration: "3 - 6 Months",
    stipend: "Performance Stipend + PPO Opportunity",
    location: "Hyderabad (In-Office)",
    eligibility: "Any Graduate / Final Year Student with Analytical Aptitude",
    openings: "8 Openings",
    shortDesc: "Streamline daily operational workflows, verify data audits, monitor SLA compliance, and support client deliverables with accuracy.",
    responsibilities: [
      "Execute operational business processes according to standard operating procedures (SOPs).",
      "Perform quality checks, data reconciliation, and audit reporting in Excel/Google Sheets.",
      "Identify workflow bottlenecks and suggest practical automation improvements.",
      "Coordinate cross-team handoffs between engineering, support, and business units."
    ],
    skills: ["Process Optimization", "Excel & Data Audit", "SOP Adherence", "SLA Tracking", "Analytical Thinking", "Attention to Detail"],
    perks: ["Corporate Operations Experience", "Process Improvement Exposure", "Certificate of Internship", "Full-Time Hiring"],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&auto=format&fit=crop&q=80"
  },
  {
    id: "technical-support-internship",
    title: "Technical Support Internship",
    category: "CUSTOMER SUCCESS & TECH SUPPORT",
    categoryGroup: "business-ops",
    badge: "Customer Success",
    duration: "3 - 6 Months",
    stipend: "Performance Stipend + PPO Opportunity",
    location: "Hyderabad (In-Office / Hybrid)",
    eligibility: "B.Tech / BCA / B.Sc with Technical Problem-Solving Skills",
    openings: "8 Openings",
    shortDesc: "Provide Tier-1 and Tier-2 technical support, diagnose application queries, assist platform users, and document knowledge base articles.",
    responsibilities: [
      "Handle incoming technical support inquiries via email, chat, and support ticketing systems.",
      "Troubleshoot basic API authentication, software installation, and database connectivity issues.",
      "Escalate complex bugs to engineering development teams with detailed reproduction steps.",
      "Author helpful user documentation and FAQ guides for platform products."
    ],
    skills: ["Technical Troubleshooting", "Customer Support Tools (Zendesk/Jira)", "Basic SQL", "API Debugging", "Technical Writing"],
    perks: ["Product Support Mastery", "Direct Technical Team Interface", "Certificate of Internship", "PPO Opportunity"],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop&q=80"
  }
];

export const INTERNSHIP_HIGHLIGHTS = [
  {
    number: "01",
    title: "Real Enterprise Projects",
    desc: "No dummy exercises. You write production code, design real client systems, and contribute to live platform repositories."
  },
  {
    number: "02",
    title: "1-on-1 Architect Mentorship",
    desc: "Get paired directly with senior engineering fellows and lead architects who review your code and guide your career roadmap."
  },
  {
    number: "03",
    title: "Pre-Placement Offer (PPO)",
    desc: "Top 30% of interns who deliver outstanding performance in their cohort are offered direct full-time employment contracts."
  },
  {
    number: "04",
    title: "Recognized Certification",
    desc: "Receive an official Certificate of Internship, Letter of Recommendation, and verified project credentials for your resume."
  }
];

export const INTERNSHIP_STEPS = [
  {
    step: "01",
    title: "Submit Online Application",
    desc: "Choose your specialized track and submit your resume along with your project portfolio or GitHub."
  },
  {
    step: "02",
    title: "Technical Skill Screening",
    desc: "Complete a practical, role-relevant skill assessment or portfolio review designed by our team."
  },
  {
    step: "03",
    title: "Mentor Interaction",
    desc: "Discuss your technical passion, problem-solving mindset, and cohort availability with a project lead."
  },
  {
    step: "04",
    title: "Offer & Onboarding",
    desc: "Receive your official internship offer letter, get paired with a mentor, and begin building live projects."
  }
];

export const INTERNSHIP_FAQS = [
  {
    q: "Who is eligible to apply for NexziByte TechTalk internships?",
    a: "Our internships are open to current college students (2nd, 3rd, and final year) as well as recent graduates (2024, 2025, and upcoming batches) pursuing B.Tech, MCA, B.Sc, BCA, MBA, or related disciplines who possess passion and foundational skills in their chosen domain."
  },
  {
    q: "Is there a stipend provided during the internship?",
    a: "Yes. All our specialized internship tracks offer competitive performance stipends based on milestone completion, project contributions, and role complexity."
  },
  {
    q: "Can I do the internship remotely, or is it in-person in Hyderabad?",
    a: "We offer both in-office (at our Hyderabad innovation center) and flexible hybrid/remote formats depending on the specific track and student university schedules."
  },
  {
    q: "Will I receive college credit or an official NOC completion certificate?",
    a: "Yes. We provide official onboarding letters for college NOC approval, weekly work verification, and verified internship completion certificates recognized by universities and employers."
  },
  {
    q: "What are the chances of converting to a full-time role (PPO)?",
    a: "High. Over 65% of our full-time junior engineering and operations talent is hired directly through our internship cohorts via Pre-Placement Offers (PPOs)."
  }
];
