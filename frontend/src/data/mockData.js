/* ══════════════════════════════════════════════════════════════════
   NEXZIBYTE TECHTALK — CURATED PLATFORM DATA (WARM IVORY & EDITORIAL)
   ══════════════════════════════════════════════════════════════════ */

export const PARTNER_COMPANIES = [
  { name: "Google", domain: "google.com", symbol: "G" },
  { name: "Microsoft", domain: "microsoft.com", symbol: "MSFT" },
  { name: "Amazon", domain: "amazon.com", symbol: "AMZN" },
  { name: "AWS", domain: "aws.amazon.com", symbol: "AWS" },
  { name: "Oracle", domain: "oracle.com", symbol: "ORCL" },
  { name: "NVIDIA", domain: "nvidia.com", symbol: "NVDA" },
  { name: "GitHub", domain: "github.com", symbol: "GH" },
  { name: "Salesforce", domain: "salesforce.com", symbol: "CRM" },
];

export const CATEGORIES = [
  { id: "python-ai", name: "Python & AI/ML", fullName: "Python Development & AI/ML with Cloud", count: 48, desc: "Python architectures, machine learning models, neural systems, and cloud-native deployment." },
  { id: "creative-media", name: "Creative Media", fullName: "Digital & Creative Media (Internship Track)", count: 36, desc: "Graphic design, cinematic video editing, and digital marketing internship roles." },
  { id: "fullstack", name: "Full-Stack Web", fullName: "Full-Stack & Web Development", count: 54, desc: "Frontend, Backend, React.js, Next.js, Java, DevOps, UI/UX, Data Science & enterprise skills." },
  { id: "cloud", name: "Cloud Computing", fullName: "Cloud & Infrastructure Engineering", count: 32, desc: "AWS, Docker, Kubernetes, and high-availability cloud systems." },
  { id: "business", name: "Operations & BD", fullName: "Tech Support, HR & Business Development", count: 26, desc: "Enterprise operations, tech support, tech recruitment, and business development." }
];

export const COMMUNITY_STATS = [
  { value: "5K+", number: 5000, suffix: "+", label: "Community Members", desc: "Engineers, founders, and innovators" },
  { value: "50+", number: 50, suffix: "+", label: "Speakers", desc: "Industry leaders & principal architects" },
  { value: "30+", number: 30, suffix: "+", label: "Events & Sessions", desc: "Summits, meets, and technical masterclasses" },
  { value: "100+", number: 100, suffix: "+", label: "Technology Topics", desc: "From AI agents to distributed infrastructure" },
];

export const EXPLORE_FEATURES = [
  {
    number: "01",
    id: "explore-feed",
    title: "EXPLORE FEED",
    description: "Technology articles, discussions and industry insights from practitioners building modern systems.",
    icon: "BookOpen",
    link: "/explore"
  },
  {
    number: "02",
    id: "summits",
    title: "TECHTALK SUMMITS",
    description: "Large technology events featuring experts and innovators tackling the next decade of infrastructure.",
    icon: "Calendar",
    link: "/summits"
  },
  {
    number: "03",
    id: "founder-meets",
    title: "FOUNDER MEETS",
    description: "Connect with startup founders and entrepreneurs building high-velocity technology ventures.",
    icon: "Rocket",
    link: "/founder-meets"
  },
  {
    number: "04",
    id: "speakers",
    title: "SPEAKERS",
    description: "Learn directly from industry professionals, engineering fellows, and technology executives.",
    icon: "Mic",
    link: "/speakers"
  },
  {
    number: "05",
    id: "technical-content",
    title: "TECHNICAL CONTENT",
    description: "Practical knowledge about modern technologies, production architecture patterns, and benchmarks.",
    icon: "Code",
    link: "/explore"
  },
  {
    number: "06",
    id: "community",
    title: "COMMUNITY",
    description: "Build meaningful professional relationships with like-minded builders, peers, and collaborators.",
    icon: "Users",
    link: "/founder-meets"
  }
];

export const COURSE_CATEGORIES = [
  { id: "all", label: "All Courses" },
  { id: "programming", label: "Programming & Core" },
  { id: "ai-ml", label: "AI & Machine Learning" },
  { id: "data", label: "Data Science & Analytics" },
  { id: "fullstack", label: "Full Stack Development" },
  { id: "cloud-devops", label: "Cloud & DevOps" },
  { id: "security-qa", label: "Cybersecurity & Testing" }
];

export const COURSES = [
  {
    id: "python",
    category: "PROGRAMMING & BACKEND",
    categoryGroup: "programming",
    badge: "Core Foundation",
    title: "Python",
    subtitle: "Modern Core & Advanced Python Engineering with Automation",
    shortDesc: "Master procedural and object-oriented Python, data structures, algorithms, asynchronous programming, file handling, APIs, and data automation scripts with industry best practices.",
    fullDesc: "This comprehensive Python course takes you from programming essentials to advanced system scripting and backend engineering. Build deep command of Python data models, OOP design patterns, generator pipelines, concurrency with asyncio and threading, database integration with SQLite & PostgreSQL, and unit testing frameworks.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&auto=format&fit=crop&q=80",
    isLarge: false,
    tags: [
      "Python 3",
      "OOP Architecture",
      "Data Structures",
      "Algorithms",
      "Asyncio",
      "Multithreading",
      "File I/O",
      "PostgreSQL",
      "Unit Testing (pytest)",
      "Automation Scripts",
      "CLI Tools",
      "REST API Consumption"
    ],
    roles: [
      "Python Developer",
      "Backend Software Engineer",
      "Automation Engineer",
      "Junior Systems Engineer"
    ],
    duration: "8 Weeks (Intensive)",
    level: "Beginner to Advanced",
    mode: "Classroom (Hyderabad) & Live Online",
    internshipNote: "Direct recruitment for Python automation & backend engineering interns."
  },
  {
    id: "java",
    category: "ENTERPRISE BACKEND",
    categoryGroup: "programming",
    badge: "Enterprise Standard",
    title: "Java",
    subtitle: "Core Java, JVM Internals, OOP & Collections Framework",
    shortDesc: "Master Core Java, memory architecture, multithreading, concurrency, the Collections framework, Java Streams, Lambdas, and enterprise design patterns.",
    fullDesc: "Built for developers targeting mission-critical enterprise engineering. Dive deep into JVM architecture, garbage collection mechanics, exception handling, object-oriented principles, multithreaded concurrency, modern Java Streams, functional interfaces, Maven build lifecycle, and robust database persistence with JDBC.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&auto=format&fit=crop&q=80",
    isLarge: false,
    tags: [
      "Core Java",
      "Java 17/21",
      "OOP Principles",
      "Collections Framework",
      "Java Streams",
      "Multithreading",
      "JVM Internals",
      "JDBC",
      "Design Patterns",
      "Maven",
      "JUnit 5",
      "Exception Handling"
    ],
    roles: [
      "Java Developer",
      "Backend Software Engineer",
      "Enterprise Application Engineer",
      "Associate Software Engineer"
    ],
    duration: "10 Weeks",
    level: "Beginner to Advanced",
    mode: "Classroom (Hyderabad) & Live Online",
    internshipNote: "Active internship hiring for Core Java and Enterprise software modules."
  },
  {
    id: "ai",
    category: "ARTIFICIAL INTELLIGENCE",
    categoryGroup: "ai-ml",
    badge: "Next-Gen Intelligence",
    title: "AI",
    subtitle: "Foundations of Artificial Intelligence & Autonomous Cognitive Systems",
    shortDesc: "Explore the core theoretical and applied domains of Artificial Intelligence: search heuristics, knowledge graphs, neural computations, cognitive agents, and computer vision.",
    fullDesc: "Unpack the mathematical foundations and applied frameworks driving modern Artificial Intelligence. Study heuristic search, probabilistic reasoning, knowledge representation, reinforcement mechanics, convolutional architectures, and agentic workflows shaping autonomous enterprise systems.",
    image: "/images/ai-course.jpg",
    isLarge: false,
    tags: [
      "Artificial Intelligence",
      "Cognitive Systems",
      "Neural Networks",
      "Knowledge Graphs",
      "Heuristic Search",
      "Computer Vision",
      "NLP Basics",
      "Reinforcement Learning",
      "AI Agent Workflows",
      "OpenAI APIs"
    ],
    roles: [
      "AI Engineer",
      "Cognitive Systems Specialist",
      "Applied AI Developer",
      "AI Research Associate"
    ],
    duration: "12 Weeks",
    level: "Intermediate to Advanced",
    mode: "Hybrid (Hyderabad Campus & Online)",
    internshipNote: "Recruiting interns for applied AI prototypes and enterprise intelligence tools."
  },
  {
    id: "machine-learning",
    category: "APPLIED MACHINE LEARNING",
    categoryGroup: "ai-ml",
    badge: "High-Growth Track",
    title: "Machine Learning",
    subtitle: "Supervised, Unsupervised Learning & Predictive Modeling",
    shortDesc: "Master classical machine learning algorithms, statistical regression, classification trees, ensemble models (Random Forest, XGBoost), clustering, and validation metrics.",
    fullDesc: "A rigorous mathematical and code-driven exploration of applied machine learning. Learn data preprocessing, feature engineering, variance-bias tradeoff analysis, linear/logistic regression, decision trees, gradient boosting, dimensionality reduction (PCA), and production model serialization.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=900&auto=format&fit=crop&q=80",
    isLarge: false,
    tags: [
      "Supervised Learning",
      "Unsupervised Learning",
      "Linear Regression",
      "Logistic Classification",
      "Random Forest",
      "XGBoost",
      "K-Means Clustering",
      "PCA",
      "Scikit-Learn",
      "Hyperparameter Tuning",
      "Cross Validation",
      "Model Metrics"
    ],
    roles: [
      "Machine Learning Engineer",
      "Predictive Analytics Specialist",
      "Data Modeler",
      "Applied ML Associate"
    ],
    duration: "12 Weeks",
    level: "Foundational to Advanced",
    mode: "Hybrid (Hyderabad Campus & Online)",
    internshipNote: "Internship positions available for statistical modeling and predictive pipelines."
  },
  {
    id: "python-with-ml",
    category: "SCIENTIFIC PYTHON & ML",
    categoryGroup: "ai-ml",
    badge: "Popular Developer Track",
    title: "Python with ML",
    subtitle: "NumPy, Pandas, Scikit-Learn & Applied Machine Learning Workflows",
    shortDesc: "Combine Python programming prowess with practical machine learning: data manipulation, statistical plotting, feature extraction, and training robust scikit-learn models.",
    fullDesc: "The perfect bridge between Python coding and production machine learning. Master vectorized math with NumPy, high-speed data wrangling with Pandas, exploratory data visualization with Matplotlib & Seaborn, followed by implementing and testing machine learning models for real enterprise datasets.",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=900&auto=format&fit=crop&q=80",
    isLarge: false,
    tags: [
      "Python",
      "NumPy",
      "Pandas",
      "Matplotlib",
      "Seaborn",
      "Scikit-Learn",
      "Data Wrangling",
      "Feature Extraction",
      "Model Pipelines",
      "Data Preprocessing",
      "REST API Serving",
      "Jupyter Notebooks"
    ],
    roles: [
      "Python ML Developer",
      "Junior ML Engineer",
      "Data Pipeline Developer",
      "Analytics Engineer"
    ],
    duration: "12 Weeks",
    level: "Beginner to Intermediate",
    mode: "Classroom (Hyderabad) & Live Online",
    internshipNote: "Active internship hiring for data cleaning, exploratory pipelines, and ML models."
  },
  {
    id: "ai-ml-with-python",
    category: "ARTIFICIAL INTELLIGENCE & DEEP LEARNING",
    categoryGroup: "ai-ml",
    badge: "Flagship Comprehensive Track 🌟",
    title: "AI & ML with Python",
    subtitle: "End-to-End Artificial Intelligence, Deep Learning & Python Engineering",
    shortDesc: "The complete journey: advanced Python, statistical machine learning, deep neural networks with PyTorch & TensorFlow, computer vision, and NLP model deployment.",
    fullDesc: "Our flagship intensive track designed for ambitious builders. Covers object-oriented Python, mathematical statistics, classical machine learning algorithms, deep learning architectures (CNNs, RNNs, LSTMs, Transformers), model fine-tuning, GPU acceleration, and microservice containerization with FastAPI and Docker.",
    image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=900&auto=format&fit=crop&q=80",
    isLarge: true,
    tags: [
      "Python 3",
      "Machine Learning",
      "Deep Learning",
      "PyTorch",
      "TensorFlow",
      "FastAPI",
      "CNNs",
      "NLP & Transformers",
      "Computer Vision",
      "Docker Containerization",
      "MLOps",
      "Model Deployment"
    ],
    roles: [
      "AI/ML Engineer",
      "Deep Learning Architect",
      "Python AI Specialist",
      "Machine Learning Scientist"
    ],
    duration: "16 Weeks (Comprehensive)",
    level: "Beginner to Architect Level",
    mode: "Hybrid (Hyderabad Campus & Online)",
    internshipNote: "Priority internship selection & direct deployment on NexziByte AI client projects."
  },
  {
    id: "data-science",
    category: "DATA & ADVANCED ANALYTICS",
    categoryGroup: "data",
    badge: "High Demand",
    title: "Data Science",
    subtitle: "Exploratory Data Analysis, Statistical Inference & Predictive Intelligence",
    shortDesc: "Master hypothesis testing, probability, complex data mining, predictive modeling, machine learning algorithms, and executive data storytelling.",
    fullDesc: "Become a proficient data scientist capable of extracting strategic value from raw business datasets. Learn data wrangling with Python & SQL, inferential statistics, A/B testing methodology, regression analysis, clustering algorithms, and creating interactive executive dashboards.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80",
    isLarge: false,
    tags: [
      "Data Science",
      "Python",
      "Advanced SQL",
      "Pandas",
      "Probability & Statistics",
      "Hypothesis Testing",
      "A/B Testing",
      "Machine Learning",
      "Data Storytelling",
      "Tableau / Power BI",
      "Feature Engineering",
      "Data Cleaning"
    ],
    roles: [
      "Data Scientist",
      "Quantitative Analyst",
      "Business Data Scientist",
      "Analytics Consultant"
    ],
    duration: "14 Weeks",
    level: "Intermediate to Advanced",
    mode: "Hybrid & Online Mentorship",
    internshipNote: "Internship opportunities for quantitative analysis, statistical modeling, and insights."
  },
  {
    id: "generative-ai",
    category: "GENERATIVE AI & LLMs",
    categoryGroup: "ai-ml",
    badge: "Cutting Edge 🚀",
    title: "Generative AI",
    subtitle: "LLMs, LangChain, RAG Systems, Vector DBs & Autonomous AI Agents",
    shortDesc: "Build next-generation generative AI products: fine-tune Large Language Models, engineer RAG pipelines with Pinecone/Chroma, orchestrate multi-agent workflows, and prompt architecture.",
    fullDesc: "Master the forefront of the Generative AI revolution. Architect enterprise-grade Retrieval-Augmented Generation (RAG) systems, work with LangChain, LlamaIndex, vector databases (Pinecone, ChromaDB), integrate OpenAI / Claude / open-source Hugging Face models, craft advanced system prompts, and deploy autonomous multi-agent systems.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80",
    isLarge: true,
    tags: [
      "Generative AI",
      "Large Language Models (LLMs)",
      "LangChain",
      "LlamaIndex",
      "RAG Architecture",
      "Vector Databases",
      "Prompt Engineering",
      "Hugging Face",
      "Pinecone / ChromaDB",
      "Autonomous Agents",
      "Fine-Tuning",
      "API Security"
    ],
    roles: [
      "Generative AI Engineer",
      "LLM Application Architect",
      "AI Agent Developer",
      "Applied GenAI Specialist"
    ],
    duration: "10 Weeks",
    level: "Intermediate to Advanced",
    mode: "Hybrid (Hyderabad Campus & Online)",
    internshipNote: "Immediate internship recruitment for GenAI application builders & RAG engineers."
  },
  {
    id: "java-full-stack",
    category: "FULL-STACK DEVELOPMENT",
    categoryGroup: "fullstack",
    badge: "Enterprise Standard",
    title: "Java Full Stack",
    subtitle: "Spring Boot, Microservices, React.js & Enterprise Database Systems",
    shortDesc: "Build enterprise software: Spring Boot microservices, Spring Security with JWT, Hibernate/JPA, relational database design, and reactive React.js single-page frontends.",
    fullDesc: "An all-in-one enterprise software engineering program. Master modern React with hooks, state management, RESTful API integration, paired with robust Java Spring Boot backends, Spring Security (OAuth2/JWT), Hibernate ORM, PostgreSQL/MySQL architectures, and Docker containerization.",
    image: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=900&auto=format&fit=crop&q=80",
    isLarge: false,
    tags: [
      "Java",
      "Spring Boot",
      "Spring Security",
      "Hibernate / JPA",
      "React.js",
      "RESTful APIs",
      "Microservices",
      "PostgreSQL",
      "MySQL",
      "Docker",
      "Maven",
      "JWT Authentication"
    ],
    roles: [
      "Java Full Stack Developer",
      "Spring Boot Engineer",
      "Enterprise Software Engineer",
      "Full Stack Developer"
    ],
    duration: "16 Weeks (Comprehensive)",
    level: "Beginner to Enterprise Architect",
    mode: "Classroom (Hyderabad) & Live Online",
    internshipNote: "Guaranteed enterprise interview opportunities & full-stack development internships."
  },
  {
    id: "python-full-stack",
    category: "FULL-STACK DEVELOPMENT",
    categoryGroup: "fullstack",
    badge: "High Velocity Track",
    title: "Python Full Stack",
    subtitle: "Django, FastAPI, React/Next.js & Cloud Database Solutions",
    shortDesc: "Develop end-to-end web applications with Django and FastAPI, asynchronous background tasks with Celery/Redis, modern React frontend interfaces, and cloud databases.",
    fullDesc: "Learn full-cycle software development using Python. Master Django web framework with ORM and MVC architecture, high-throughput asynchronous APIs with FastAPI, responsive frontend development using React, authentication, database migrations, and deployment to cloud infrastructure.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop&q=80",
    isLarge: false,
    tags: [
      "Python",
      "Django",
      "FastAPI",
      "React.js",
      "REST APIs",
      "PostgreSQL",
      "Celery",
      "Redis",
      "HTML5 & Modern CSS",
      "Docker",
      "Authentication",
      "Cloud Hosting"
    ],
    roles: [
      "Python Full Stack Developer",
      "Backend API Engineer",
      "Full Stack Web Developer",
      "Web Applications Engineer"
    ],
    duration: "14 Weeks",
    level: "Beginner to Advanced",
    mode: "Hybrid (Hyderabad Campus & Online)",
    internshipNote: "Active internship hiring for Python full-stack application development."
  },
  {
    id: "mern-stack",
    category: "FULL-STACK DEVELOPMENT",
    categoryGroup: "fullstack",
    badge: "Startup Standard",
    title: "MERN Stack",
    subtitle: "MongoDB, Express.js, React.js & Node.js End-to-End JavaScript",
    shortDesc: "Master the ubiquitous JavaScript stack: design schema-flexible MongoDB databases, construct Express/Node REST APIs, manage React state, and deploy cloud-native web apps.",
    fullDesc: "Become a proficient full stack developer with 100% JavaScript/TypeScript. Learn Node.js runtime mechanics, Express server routing and middleware, MongoDB data modeling with Mongoose, React hooks and context/Redux, JWT session authentication, and full-stack deployment on modern cloud platforms.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=900&auto=format&fit=crop&q=80",
    isLarge: false,
    tags: [
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js",
      "JavaScript ES6+",
      "TypeScript",
      "RESTful APIs",
      "Mongoose ORM",
      "Redux Toolkit",
      "JWT Authentication",
      "TailwindCSS",
      "Cloud Deployment"
    ],
    roles: [
      "MERN Stack Developer",
      "Frontend React Engineer",
      "Node.js Backend Developer",
      "Full Stack JavaScript Engineer"
    ],
    duration: "14 Weeks",
    level: "Beginner to Advanced",
    mode: "Hybrid & Online Mentorship",
    internshipNote: "Internship roles available for dynamic MERN web application development."
  },
  {
    id: "cloud-computing",
    category: "CLOUD & INFRASTRUCTURE",
    categoryGroup: "cloud-devops",
    badge: "Foundational Infrastructure",
    title: "Cloud Computing",
    subtitle: "Multi-Cloud Architecture, Virtualization, Networking & Storage",
    shortDesc: "Understand global cloud infrastructure: compute virtualization, virtual private clouds (VPCs), object/block storage, serverless paradigms, load balancing, and high availability.",
    fullDesc: "A comprehensive foundation in enterprise cloud computing. Learn how distributed data centers operate, design fault-tolerant virtual networks, configure multi-zone load balancers, secure cloud identities with IAM, manage cost governance, and architect resilient cross-cloud infrastructure.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop&q=80",
    isLarge: false,
    tags: [
      "Cloud Computing",
      "Virtualization",
      "Cloud Architecture",
      "VPC & Subnets",
      "Storage (S3/Blob)",
      "IAM & Security",
      "Serverless Computing",
      "Load Balancing",
      "High Availability",
      "Disaster Recovery",
      "Cloud Monitoring",
      "Cost Optimization"
    ],
    roles: [
      "Cloud Solutions Architect",
      "Cloud Infrastructure Engineer",
      "Systems Administrator",
      "Cloud Operations Specialist"
    ],
    duration: "10 Weeks",
    level: "Foundational to Advanced",
    mode: "Classroom (Hyderabad) & Live Online",
    internshipNote: "Hiring cloud operations and infrastructure monitoring interns."
  },
  {
    id: "aws",
    category: "CLOUD & INFRASTRUCTURE",
    categoryGroup: "cloud-devops",
    badge: "Cloud Certification Prep",
    title: "AWS",
    subtitle: "Amazon Web Services Solutions Architect & SysOps Mastery",
    shortDesc: "Deep hands-on AWS training: EC2 compute, S3 storage, RDS/DynamoDB databases, Lambda serverless, VPC networking, CloudFront CDN, Route53, and IAM security.",
    fullDesc: "Achieve deep, hands-on mastery of Amazon Web Services. Configure enterprise VPC networks, auto-scaling compute groups, serverless microservices with AWS Lambda & API Gateway, managed database clusters, CloudWatch alerting, and prepare thoroughly for AWS Certified Solutions Architect Associate.",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=900&auto=format&fit=crop&q=80",
    isLarge: false,
    tags: [
      "AWS EC2",
      "AWS S3",
      "AWS Lambda",
      "AWS VPC",
      "AWS RDS & DynamoDB",
      "IAM Policies",
      "CloudWatch",
      "CloudFront CDN",
      "Route 53",
      "Auto Scaling",
      "API Gateway",
      "Solutions Architect Prep"
    ],
    roles: [
      "AWS Cloud Engineer",
      "AWS Solutions Architect",
      "Cloud Infrastructure Specialist",
      "AWS SysOps Administrator"
    ],
    duration: "10 Weeks",
    level: "Beginner to Certified Associate",
    mode: "Hybrid (Hyderabad Campus & Online)",
    internshipNote: "Internship positions available for AWS cloud migration and infrastructure automation."
  },
  {
    id: "devops",
    category: "DEVOPS & PLATFORM ENGINEERING",
    categoryGroup: "cloud-devops",
    badge: "High Impact Track",
    title: "DevOps",
    subtitle: "CI/CD Pipelines, Docker, Kubernetes, Terraform & SRE Practices",
    shortDesc: "Automate modern software delivery: build automated CI/CD with GitHub Actions/Jenkins, containerize apps with Docker, orchestrate with Kubernetes, and code infrastructure with Terraform.",
    fullDesc: "Transform into a high-impact DevOps and Platform Engineer. Learn containerization from first principles with Docker, multi-node orchestration with Kubernetes (K8s), declarative infrastructure as code with Terraform, continuous integration/continuous deployment (CI/CD) pipelines, and observability with Prometheus and Grafana.",
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=900&auto=format&fit=crop&q=80",
    isLarge: false,
    tags: [
      "DevOps",
      "Docker",
      "Kubernetes (K8s)",
      "CI/CD Pipelines",
      "GitHub Actions",
      "Jenkins",
      "Terraform (IaC)",
      "Linux Shell Scripting",
      "Prometheus",
      "Grafana",
      "Ansible",
      "GitOps"
    ],
    roles: [
      "DevOps Engineer",
      "Site Reliability Engineer (SRE)",
      "Platform Engineer",
      "Cloud Automation Engineer"
    ],
    duration: "12 Weeks",
    level: "Intermediate to Advanced",
    mode: "Hybrid & Online Mentorship",
    internshipNote: "Active recruitment for DevOps automation and CI/CD platform engineering interns."
  },
  {
    id: "cybersecurity",
    category: "CYBERSECURITY & DEFENSE",
    categoryGroup: "security-qa",
    badge: "Mission Critical 🛡️",
    title: "Cybersecurity",
    subtitle: "Ethical Hacking, Network Defense, SOC Operations & Vulnerability Assessment",
    shortDesc: "Defend enterprise systems: learn ethical penetration testing, network packet inspection with Wireshark, OWASP Top 10 web vulnerabilities, cryptography, and SOC incident analysis.",
    fullDesc: "Comprehensive defensive security and ethical hacking curriculum. Master network defense protocols, firewall and IDS/IPS configurations, vulnerability scanning with Nessus/Nmap, web application penetration testing (OWASP Top 10), cryptographic protocols, and security operations center (SOC) event monitoring.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=900&auto=format&fit=crop&q=80",
    isLarge: false,
    tags: [
      "Cybersecurity",
      "Ethical Hacking",
      "Network Defense",
      "OWASP Top 10",
      "Penetration Testing",
      "Wireshark",
      "Nmap & Nessus",
      "SIEM & SOC Operations",
      "Cryptography",
      "Incident Response",
      "Vulnerability Management",
      "Linux Hardening"
    ],
    roles: [
      "Cybersecurity Analyst",
      "Information Security Specialist",
      "SOC Analyst",
      "Penetration Tester",
      "Security Engineer"
    ],
    duration: "12 Weeks",
    level: "Beginner to Advanced",
    mode: "Classroom (Hyderabad) & Live Online",
    internshipNote: "Internship cohorts open for security audit, vulnerability analysis, and SOC monitoring."
  },
  {
    id: "data-analytics",
    category: "DATA & BUSINESS INTELLIGENCE",
    categoryGroup: "data",
    badge: "Career Accelerator",
    title: "Data Analytics",
    subtitle: "Advanced SQL, Power BI, Excel Dashboards & Business Analytics",
    shortDesc: "Transform raw corporate datasets into strategic business decisions: write complex SQL analytical queries, build automated Excel models, and design interactive Power BI & Tableau dashboards.",
    fullDesc: "An applied, industry-standard data analytics program. Learn advanced SQL (window functions, subqueries, CTEs, performance tuning), build real-time interactive business intelligence dashboards in Power BI and Tableau, master advanced Excel modeling, and communicate data-driven recommendations to executive leadership.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80",
    isLarge: false,
    tags: [
      "Data Analytics",
      "Advanced SQL",
      "Power BI",
      "Tableau",
      "Advanced Excel",
      "DAX & Power Query",
      "Business Intelligence",
      "KPI Metrics",
      "Data Modeling",
      "Python Analytics",
      "Executive Dashboards",
      "Data Cleaning"
    ],
    roles: [
      "Data Analyst",
      "Business Intelligence (BI) Developer",
      "Reporting Analyst",
      "Operations Data Analyst"
    ],
    duration: "10 Weeks",
    level: "Beginner to Industry Ready",
    mode: "Hybrid & Online Mentorship",
    internshipNote: "Internship hiring for corporate dashboard creation and business intelligence reporting."
  },
  {
    id: "software-testing",
    category: "QUALITY ASSURANCE & TESTING",
    categoryGroup: "security-qa",
    badge: "Quality Engineering",
    title: "Software Testing",
    subtitle: "Manual Testing, Automated Selenium, API Testing & Postman",
    shortDesc: "Ensure software reliability: master manual testing principles, STLC test case creation, automated browser testing with Selenium WebDriver, API testing with Postman, and Jira bug tracking.",
    fullDesc: "Comprehensive quality assurance curriculum covering both manual and automated testing. Master Software Testing Life Cycle (STLC), test case design techniques, defect tracking in Jira, cross-browser automated testing with Selenium WebDriver and Java/Python, and REST API testing with Postman and Newman.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop&q=80",
    isLarge: false,
    tags: [
      "Software Testing",
      "Manual Testing",
      "Automation Testing",
      "Selenium WebDriver",
      "API Testing (Postman)",
      "TestNG / JUnit",
      "Jira Defect Tracking",
      "STLC & SDLC",
      "Regression Testing",
      "Test Plan & Strategy",
      "Git for QA",
      "Agile Testing"
    ],
    roles: [
      "QA Engineer",
      "Software Test Automation Engineer",
      "Manual Test Analyst",
      "API QA Specialist",
      "Quality Assurance Analyst"
    ],
    duration: "10 Weeks",
    level: "Beginner to Industry Ready",
    mode: "Classroom (Hyderabad) & Live Online",
    internshipNote: "Recruiting QA and Automation testing interns for enterprise release validation."
  }
];

// Alias for backwards compatibility
export const TECH_TOPICS = COURSES;

export const FEATURED_SUMMITS_LIST = [
  {
    id: "summit-gpacts-2026",
    badge: "WORLD’S BIGGEST PHARMA AI & IT SUMMIT",
    tag: "LATEST SUMMIT 🚀",
    title: "Nexzibyte Solutions at GPACTS 2026 🚀",
    subtitle: "World’s Biggest Pharma AI & IT Summit — Hyderabad",
    statement: "Events like GPACTS provide an opportunity to understand evolving industry challenges, connect with professionals across the ecosystem, and explore where technology and AI can create meaningful business impact.",
    description: "Nexzibyte Solutions was pleased to be part of GPACTS 2026 – World’s Biggest Pharma AI & IT Summit, held in Hyderabad on 3 September 2026. The event brought together 400+ delegates, 50 speakers, 13 partners, and 140+ unique companies, creating a strong platform for industry leaders and technology professionals to exchange ideas and perspectives.",
    location: "Hyderabad, India",
    date: "3 September 2026",
    stats: [
      { label: "Delegates", value: "400+" },
      { label: "Speakers", value: "50" },
      { label: "Partners", value: "13" },
      { label: "Unique Companies", value: "140+" }
    ],
    image: "/images/summit-gpacts.jpg",
    highlights: [
      "World’s Biggest Pharma AI & IT Summit held in Hyderabad",
      "400+ delegates, 50 speakers, 13 partners, and 140+ unique companies",
      "Discussions around AI, digital transformation, technology & future of Pharma",
      "Exploring where technology and AI create meaningful business impact",
      "Valuable day of learning, conversations, networking, and new perspectives"
    ],
    hashtags: [
      "#NexzibyteSolutions", "#GPACTS2026", "#PharmaAI", "#ArtificialIntelligence",
      "#PharmaIT", "#DigitalTransformation", "#Technology", "#Innovation",
      "#Networking", "#Hyderabad"
    ]
  },
  {
    id: "summit-gcc-2026",
    badge: "FLAGSHIP GLOBAL SUMMIT",
    tag: "GCC WORLD",
    title: "Global Capability Center (GCC) Summit 2026",
    subtitle: "Enterprise Technology, AI & Cloud Automation",
    statement: "Another summit. Another opportunity to connect, collaborate, and shape the future of innovation.",
    description: "Nagunoori Durga Prasad, Founder & Managing Director of NexziByte Solutions Pvt. Ltd., joins GCC leaders, delegates, and the ETGCCWorld community at ITC Kohenur, Hyderabad to discuss the future of AI, Enterprise Technology, Cloud, and Intelligent Automation.",
    location: "ITC Kohenur, HITEC City, Hyderabad",
    date: "5th August 2026",
    stats: [
      { label: "GCC Leaders", value: "500+" },
      { label: "Enterprise Innovators", value: "100+" },
      { label: "AI & Tech Tracks", value: "25+" }
    ],
    image: "/images/summit-gcc-announcement.jpg",
    highlights: [
      "Discussion on Enterprise AI, Cloud & Intelligent Automation",
      "Featuring Nagunoori Durga Prasad, Founder & MD of NexziByte Solutions",
      "ETGCCWorld community networking at ITC Kohenur, HITEC City",
      "Exploring strategic technology partnerships and scalable digital products"
    ],
    hashtags: [
      "#GCCSummit2026", "#ETGCCWorld", "#NexziByte", "#GlobalCapabilityCenters",
      "#ArtificialIntelligence", "#EnterpriseAI", "#DigitalTransformation",
      "#CloudComputing", "#ProductEngineering", "#Innovation", "#Technology",
      "#BusinessNetworking", "#Hyderabad"
    ]
  }
];

export const FEATURED_SUMMIT = FEATURED_SUMMITS_LIST[0];

export const UPCOMING_EVENTS = [
  {
    id: "summit-gpacts-2026",
    number: "01",
    type: "PHARMA AI & IT SUMMIT",
    category: "summits",
    badge: "World’s Biggest Summit 🚀",
    title: "Nexzibyte Solutions at GPACTS 2026 🚀",
    statement: "Events like GPACTS provide an opportunity to understand evolving industry challenges, connect with professionals across the ecosystem, and explore where technology and AI can create meaningful business impact.",
    location: "Hyderabad, India",
    venue: "Hyderabad Convention Centre, Hyderabad",
    date: "3 September 2026",
    time: "Full-Day Summit & Executive Keynotes",
    dignitaries: "Nexzibyte Solutions Leadership & Industry Delegates",
    speakersCount: "50 Speakers & 400+ Delegates",
    spotsLeft: 35,
    image: "/images/summit-gpacts.jpg",
    description: "Nexzibyte Solutions was pleased to be part of GPACTS 2026 – World’s Biggest Pharma AI & IT Summit, held in Hyderabad on 3 September 2026. Bringing together 400+ delegates, 50 speakers, 13 partners, and 140+ unique companies.",
    fullContent: `Nexzibyte Solutions at GPACTS 2026 🚀

We were pleased to be part of GPACTS 2026 – World’s Biggest Pharma AI & IT Summit, held in Hyderabad on 3 September 2026.

The event brought together 400+ delegates, 50 speakers, 13 partners, and 140+ unique companies, creating a strong platform for industry leaders and technology professionals to exchange ideas and perspectives.

The discussions around AI, digital transformation, technology, and the future of Pharma were particularly insightful.

For us at Nexzibyte Solutions, events like GPACTS provide an opportunity to understand evolving industry challenges, connect with professionals across the ecosystem, and explore where technology and AI can create meaningful business impact.

A valuable day of learning, conversations, networking, and new perspectives.

We look forward to continuing these conversations and exploring opportunities to contribute to the evolving Pharma + AI + IT ecosystem.

📍 Hyderabad 
🗓️ 3 September 2026`,
    hashtags: [
      "#NexzibyteSolutions", "#GPACTS2026", "#PharmaAI", "#ArtificialIntelligence",
      "#PharmaIT", "#DigitalTransformation", "#Technology", "#Innovation",
      "#Networking", "#Hyderabad"
    ]
  },
  {
    id: "summit-product-launch",
    number: "02",
    type: "PRODUCT LAUNCH",
    category: "launches",
    badge: "Ministerial Unveiling",
    title: "Product Launch Unveiled by Shri Ponnam Prabhakar Garu",
    statement: "A significant step forward in our journey to innovate and deliver impactful solutions.",
    location: "Hyderabad, India",
    venue: "Government & Enterprise Delegation Hall, Hyderabad",
    date: "August 2026",
    time: "10:30 AM IST",
    dignitaries: "Shri Ponnam Prabhakar garu & Dedicated Team",
    speakersCount: "Ministerial & Leadership Delegation",
    spotsLeft: 85,
    image: "/images/summit-product-launch.jpg",
    description: "We are honored to announce the successful launch of our product, unveiled by Shri Ponnam Prabhakar garu. This milestone marks a significant step forward in our journey to innovate and deliver impactful solutions.",
    fullContent: `We are honored to announce the successful launch of our product, unveiled by Shri Ponnam Prabhakar garu.

This milestone marks a significant step forward in our journey to innovate and deliver impactful solutions. The launch reflects our commitment to empowering businesses and professionals with cutting-edge technology.

We extend our sincere gratitude to Shri Ponnam Prabhakar garu for his support and encouragement, and to our dedicated team whose efforts made this achievement possible.

Excited for what lies ahead as we continue to grow and create value.`,
    hashtags: ["#ProductLaunch", "#Innovation", "#Technology", "#Growth", "#Milestone", "#ponnamprabhakar"]
  },
  {
    id: "summit-gcc-2026-announcement",
    number: "03",
    type: "GLOBAL SUMMIT",
    category: "summits",
    badge: "Flagship Summit",
    title: "Global Capability Center (GCC) Summit 2026",
    statement: "Another summit. Another opportunity to connect, collaborate, and shape the future of innovation.",
    location: "Hyderabad, India",
    venue: "ITC Kohenur, HITEC City, Hyderabad",
    date: "5th August 2026",
    time: "9:00 AM – 6:30 PM IST",
    dignitaries: "Nagunoori Durga Prasad (Founder & MD), ETGCCWorld Community",
    speakersCount: "GCC Leaders & Innovators",
    spotsLeft: 50,
    image: "/images/summit-gcc-announcement.jpg",
    description: "Nagunoori Durga Prasad, Founder & Managing Director of NexziByte Solutions Pvt. Ltd., attending the GCC Summit 2026 at ITC Kohenur, joining industry leaders and the ETGCCWorld community to explore the future of enterprise innovation.",
    fullContent: `Another summit. Another opportunity to connect, collaborate, and shape the future of innovation.

We're excited to announce that Nagunoori Durga Prasad, Founder & Managing Director of NexziByte Solutions Pvt. Ltd., will be attending the Global Capability Center (GCC) Summit 2026 in Hyderabad, joining industry leaders and the ETGCCWorld community to exchange ideas and explore the future of enterprise innovation.

The summit brings together GCC leaders, delegates, enterprise decision-makers, innovators, and technology partners to discuss the future of Artificial Intelligence, Enterprise Technology, Digital Transformation, Cloud, and Intelligent Automation.

At NexziByte Solutions, we build AI-powered products, enterprise software, and scalable digital solutions that help organizations innovate, transform, and grow.

If you're attending the summit, we'd love to connect, exchange ideas, and explore opportunities to build impactful technology solutions together.

📍 ITC Kohenur, HITEC City, Hyderabad
📅 5th August 2026
See you at GCC Summit 2026!`,
    hashtags: [
      "#GCCSummit2026", "#ETGCCWorld", "#NexziByte", "#GlobalCapabilityCenters",
      "#ArtificialIntelligence", "#EnterpriseAI", "#DigitalTransformation",
      "#CloudComputing", "#ProductEngineering", "#Innovation", "#Technology",
      "#BusinessNetworking", "#Hyderabad"
    ]
  },
  {
    id: "summit-gcc-2026-recap",
    number: "04",
    type: "SUMMIT RECAP",
    category: "summits",
    badge: "Executive Dispatch",
    title: "Building Connections, Driving Innovation — GCC Summit 2026",
    statement: "Meaningful conversations spark meaningful innovation.",
    location: "Hyderabad, India",
    venue: "ITC Kohenur & ETGCCWorld Executive Lounge",
    date: "August 2026",
    time: "Post-Summit Dispatch",
    dignitaries: "Nagunoori Durgaprasad, Founder & Managing Director",
    speakersCount: "Global Organization Leaders",
    spotsLeft: 120,
    image: "/images/summit-gcc-recap.jpg",
    description: "NexziByte Solutions was proud to participate in the Global Capability Center (GCC) Summit 2026, engaging with industry professionals and exploring emerging technology trends.",
    fullContent: `Building Connections. Driving Innovation. Creating Opportunities.

NexziByte Solutions was proud to participate in the Global Capability Center (GCC) Summit 2026 one of India's premier platforms bringing together Global Capability Centers, enterprise leaders, innovators, and technology decision-makers.

The summit provided an excellent opportunity to engage with industry professionals, exchange insights on AI, digital transformation, enterprise technology, and the rapidly evolving GCC ecosystem.

Throughout the event, we had the privilege of networking with leaders from global organizations, exploring emerging technology trends, and discussing how strategic technology partnerships can accelerate business growth and innovation.

At NexziByte, we believe that meaningful conversations spark meaningful innovation. Events like GCC Summit strengthen our commitment to delivering scalable digital solutions while building long-term partnerships with enterprises across industries.

A sincere thank you to the organizers, speakers, and everyone we had the pleasure of connecting with. We look forward to continuing these conversations and transforming ideas into impactful collaborations.

Nagunoori Durgaprasad
Founder & Managing Director | NexziByte Solutions Pvt. Ltd.`,
    hashtags: [
      "#GCCSummit2026", "#NexziByte", "#ETGCCWorld", "#AI",
      "#DigitalTransformation", "#EnterpriseTechnology", "#GlobalCapabilityCenters",
      "#Innovation", "#Networking", "#Leadership", "#BusinessGrowth",
      "#Technology", "#Hyderabad"
    ]
  },
  {
    id: "summit-renewable-energy-kusum",
    number: "05",
    type: "ROUNDTABLE",
    category: "roundtables",
    badge: "CleanTech & PM-KUSUM",
    title: "Exploring Future of Renewable Energy Through Tech & Innovation",
    statement: "Perspectives with industry leaders on a smarter, more sustainable energy ecosystem.",
    location: "Telangana, India",
    venue: "Telangana PM-KUSUM & Atirath Holdings Leadership Council",
    date: "August 2026",
    time: "High-Level Executive Session",
    dignitaries: "BVS Laxmi, Balakrishnan Ramachandran, Ram, Kiran",
    speakersCount: "4 Industry Leaders & Chairs",
    spotsLeft: 40,
    image: "/images/renewable-energy.jpg",
    description: "Insightful meeting with BVS Laxmi (President, Telangana PM-KUSUM Farmers Association), Balakrishnan Ramachandran (Chairman, Atirath Holding), Ram (CEO, @SynergyGroup), and Kiran (Director, Atirath Holdings India Limited) focusing on solar energy, AI innovations, and clean tech collaborations.",
    fullContent: `Exploring the Future of Renewable Energy Through Technology & Innovation

We had a valuable and insightful meeting with BVS Laxmi, President of the Telangana PM-KUSUM Farmers Association; Balakrishnan Ramachandran, Chairman of Atirath Holding; Ram, CEO of @SynergyGroup and Kiran, Director of Atirath Holdings India Limited.

The discussion focused on solar energy, PM-KUSUM initiatives, AI-driven innovations, technology solutions, and opportunities for collaboration in the renewable energy sector.

It was a valuable opportunity to exchange perspectives with industry leaders and explore how technology and innovation can contribute to a smarter, more sustainable energy ecosystem.

At NexziByte Solutions, we look forward to building meaningful partnerships and developing impactful technology-driven solutions for the future of sustainable energy.

We appreciate the valuable insights and look forward to the possibilities ahead.`,
    hashtags: [
      "#SolarEnergy", "#PMKUSUM", "#RenewableEnergy", "#CleanEnergy",
      "#AI", "#EnergyTech", "#SustainableEnergy", "#Innovation",
      "#Technology", "#Collaboration", "#NexziByteSolutions"
    ]
  },
  {
    id: "summit-client-mou-collaboration",
    number: "06",
    type: "STRATEGIC MOU",
    category: "partnerships",
    badge: "Strategic Partnership",
    title: "Another Step Forward: Client Collaboration and MoU Signing",
    statement: "Building partnerships. Creating opportunities. Driving growth.",
    location: "Hyderabad, India",
    venue: "NexziByte Corporate Headquarters, Hyderabad",
    date: "August 2026",
    time: "Strategic Signing Ceremony",
    dignitaries: "NexziByte Executive Team & Enterprise Partners",
    speakersCount: "Strategic Enterprise Stakeholders",
    spotsLeft: 60,
    image: "/images/summit-mou.jpg",
    description: "Successful completion of a new Client collaboration and MoU, marking another milestone in building strong, long-term business partnerships built on trust, innovation, and shared growth.",
    fullContent: `Another Step Forward for NexziByte Solutions!

We’re proud to announce the successful completion of a new Client collaboration and MoU, marking another milestone in our journey of building strong and meaningful business partnerships.

At NexziByte Solutions, we believe in creating long-term collaborations built on trust, innovation, technology, expertise, and shared growth.

Looking forward to a successful journey ahead, creating new opportunities and achieving many more milestones together! 

Building partnerships. Creating opportunities. Driving growth.`,
    hashtags: [
      "#NexziByteSolutions", "#MoU", "#Collaboration", "#StrategicPartnership",
      "#BusinessGrowth", "#TechnologySolutions", "#CustomSoftwareDevelopment",
      "#SoftwareSolutions", "#DigitalTransformation", "#Innovation",
      "#BusinessPartnership", "#Hyderabad"
    ]
  }
];

export const SPEAKERS = [
  {
    id: "sp-1",
    name: "Nagunoori Durgaprasad",
    gender: "male",
    role: "Founder & Managing Director",
    company: "NexziByte Solutions",
    category: "leadership",
    topic: "Architecting Enterprise AI & Scalable Digital Ecosystems for the Next Decade",
    image: "/images/founder-md-durga-prasad.png",
    linkedin: "https://linkedin.com",
    bio: "Pioneering technology executive championing AI-powered products, developer communities, and enterprise digital transformation globally."
  },
  {
    id: "sp-2",
    name: "Narasaiah Nagunoori",
    gender: "male",
    role: "Director",
    company: "NexziByte Solutions",
    category: "leadership",
    topic: "Strategic Governance & Building Sustainable High-Impact Tech Enterprises",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
    bio: "Guiding strategic business growth, corporate governance, and enterprise partnerships at NexziByte Solutions."
  },
  {
    id: "sp-3",
    name: "Karthik Sakkinala",
    gender: "male",
    role: "Founder",
    company: "pyenk.com",
    category: "engineering",
    topic: "Zero-to-One Product Engineering & Modern Web Innovation",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
    bio: "Entrepreneur and founder of pyenk.com, driving next-generation digital products, developer tooling, and technical innovation."
  },
  {
    id: "sp-4",
    name: "Sunil",
    gender: "male",
    role: "Founder",
    company: "stafi.com",
    category: "leadership",
    topic: "Scaling On-Demand Talent Platforms & Tech Staffing Ecosystems",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
    bio: "Founder of stafi.com, innovating modern talent acquisition, enterprise staffing solutions, and distributed engineering workforces."
  },
  {
    id: "sp-5",
    name: "Venkata Sunil Kumar",
    gender: "male",
    role: "Founder",
    company: "Referral Community",
    category: "leadership",
    topic: "Community-Led Growth, Network Effects & Referral Engines",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
    bio: "Community builder and founder of Referral Community, empowering professionals with peer networks, collaboration, and talent ecosystems."
  },
  {
    id: "sp-6",
    name: "Tejaswini Gangula",
    gender: "female",
    role: "Technical Manager",
    company: "NexziByte Solutions",
    category: "engineering",
    topic: "Engineering Resilient Microservices & Modern Full Stack Architecture",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
    bio: "Technical manager at NexziByte Solutions leading engineering teams in architecting high-performance cloud applications and resilient platforms."
  },
  {
    id: "sp-7",
    name: "Durgesh Siva Naga",
    gender: "male",
    role: "Digital Marketing Manager",
    company: "NexziByte Solution",
    category: "marketing",
    topic: "Data-Driven Growth Marketing & Digital Transformation for Tech Brands",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
    bio: "Digital marketing manager leading brand visibility, growth marketing strategies, and omnichannel tech campaigns at NexziByte Solutions."
  }
];

export const PASSES = [
  {
    id: "visitor-pass",
    type: "VISITOR PASS",
    badge: "FREE ENTRY",
    price: "FREE",
    priceNum: 0,
    currency: "",
    description: "Experience TechTalk, connect with the community and attend selected open sessions.",
    features: [
      "Open community event entry",
      "Selected keynote sessions & panels",
      "Technology exhibition hall access",
      "Community networking lounges",
      "Verified digital QR pass"
    ],
    buttonText: "Claim Free Visitor Pass",
    subtext: "100% Free with instant digital pass generation.",
    highlight: false,
    color: "purple"
  },
  {
    id: "student-pass",
    type: "STUDENT PASS",
    badge: "STUDENT & RESEARCHER",
    price: "₹99",
    priceNum: 99,
    currency: "₹",
    description: "Subsidized accreditation for college students, researchers, and aspiring tech developers.",
    features: [
      "Full student community event entry",
      "Selected architecture keynotes & student tracks",
      "Hands-on coding workshop & lab access",
      "Internship pool & campus recruiter networking",
      "Digital Student Certificate of Participation",
      "Verified digital QR student pass"
    ],
    buttonText: "Claim Student Pass — ₹99",
    subtext: "Valid Student ID required at check-in.",
    highlight: false,
    color: "teal"
  },
  {
    id: "founder-pass",
    type: "FOUNDER PASS",
    badge: "FOUNDER & CXO CIRCLE",
    price: "₹499",
    priceNum: 499,
    currency: "₹",
    description: "For startup founders, co-founders, and entrepreneurs seeking capital, collaboration, and enterprise pilots.",
    features: [
      "VIP entry to exclusive Founder Meets & Circles",
      "Chatham House closed-door founder roundtables",
      "1-on-1 Investor & Angel Syndicate matchmaking",
      "Enterprise POC & customer discovery breakouts",
      "Access to NexziByte Founder Alumni Lounge",
      "Digital Verified Founder VIP Pass & Directory"
    ],
    buttonText: "Get Founder Pass — ₹499",
    subtext: "High-signal circle. Strictly no vanity pitches.",
    highlight: true,
    color: "amber"
  },
  {
    id: "delegation-pass",
    type: "DELEGATION PASS",
    badge: "CORPORATE DELEGATE",
    price: "₹250",
    priceNum: 250,
    currency: "₹",
    description: "For corporate delegates, software architects, engineering managers, and tech leaders.",
    features: [
      "Full corporate delegate event accreditation",
      "All expert, architecture & teardown sessions",
      "Speaker Q&A & corporate networking lounges",
      "Official Event Kit & Digital Masterclass Notes",
      "Digital Certificate of Participation",
      "Full delegate community & priority seating"
    ],
    buttonText: "Get Delegation Pass — ₹250",
    subtext: "Complete all-access corporate accreditation.",
    highlight: false,
    color: "coral"
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "DISCOVER",
    description: "Explore events, articles and technology topics curated by experienced software architects.",
    icon: "Compass"
  },
  {
    step: "02",
    title: "REGISTER",
    description: "Choose your event and pass. Complete instant registration or apply for exclusive delegate access.",
    icon: "Ticket"
  },
  {
    step: "03",
    title: "CONNECT",
    description: "Meet speakers, founders and technology professionals through curated in-person and digital sessions.",
    icon: "Users"
  },
  {
    step: "04",
    title: "GROW",
    description: "Learn, collaborate and build opportunities that accelerate your engineering career and ventures.",
    icon: "TrendingUp"
  }
];

export const TECHNICAL_ARTICLES = [
  {
    id: "art-1",
    category: "PYTHON & AI/ML",
    title: "Architecting Enterprise AI/ML Pipelines & Cloud Deployments in Python",
    author: "Dr. Rajesh Raman",
    role: "Principal AI Scientist",
    readingTime: "6 min read",
    date: "Sep 02, 2026",
    excerpt: "From neural network modeling to cloud-scale inference: how modern Python teams structure FastAPI microservices, Docker containers, and AWS GPU workloads.",
    content: "Building AI-powered products in production requires more than simple model weights. Modern Python architectures combine asynchronous FastAPI endpoints, containerized Docker instances, and automated model monitoring across cloud platforms like AWS and GCP to achieve low-latency predictions under heavy throughput."
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
    content: "Modern tech brands win on narrative clarity. NexziByte actively recruits interns across graphic design, video editing, and digital marketing to produce dynamic visual assets, motion reels in Premiere Pro and After Effects, and data-driven growth marketing funnels that capture enterprise attention."
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
    content: "Enterprise web development requires mastering reactive user interfaces in React.js and Next.js alongside resilient Java backends. Coupling this with automated DevOps deployment creates robust systems capable of serving millions of concurrent requests with zero downtime."
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
    content: "Great software cannot succeed in a silo. Modern development programs train practitioners across technical support, IT talent acquisition, and business development to ensure products are built with empathy, scaled with top talent, and monetized effectively in competitive markets."
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
    content: "Cloud computing provides the elasticity required for compute-heavy AI/ML applications. We explore how containerizing Python services with Docker and automating deployments on AWS enables instantaneous scaling during peak data ingestion periods."
  },
  {
    id: "art-6",
    category: "CREATIVE MEDIA",
    title: "Visual Design & Video Production Workflows for Tech Interns",
    author: "Sneha Reddy",
    role: "Creative Media Mentor",
    readingTime: "5 min read",
    date: "Aug 12, 2026",
    excerpt: "A practical guide for graphic design and video editing interns creating production-ready assets with Figma, Photoshop, and Premiere Pro.",
    content: "Interns joining our creative media programs learn real-world production pipelines from day one. By mastering vector UI design in Figma and dynamic video editing in Premiere Pro, creators produce stunning visual content that elevates tech brands."
  }
];

export const FOUNDER_MEETS_DATA = {
  heading: "Where Founders Meet Builders",
  description: "A focused space for entrepreneurs, developers, creators and innovators to exchange ideas, discover collaborators and build meaningful connections.",
  tagline: "No pitch decks. No vanity metrics. Just authentic founder-to-founder problem solving.",
  stats: [
    { label: "Founders Connected", value: "240+" },
    { label: "Capital Facilitated", value: "$4.2M" },
    { label: "Co-Founders Paired", value: "18+" }
  ],
  image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80",
  highlights: [
    "Vetted attendee circles limited to active builders and technical founders",
    "Deep-dive sessions on B2B customer acquisition and enterprise sales cycles",
    "Direct conversations with active pre-seed and seed angel syndicates",
    "Quarterly closed-door roundtables across Tier-1 tech hubs"
  ]
};

export const TESTIMONIALS = [
  {
    id: "t1",
    name: "Arun Kulkarni",
    role: "Senior Distributed Systems Engineer",
    company: "FinTech Scaleup",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
    quote: "TechTalk gave me the opportunity to meet people, learn from experts and discover opportunities I wouldn't have found alone. The quality of architectural conversations is truly world-class."
  },
  {
    id: "t2",
    name: "TechTalk Editorial",
    role: "Staff Cloud Architect",
    company: "NexziByte Ecosystem",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80",
    quote: "The digital pass experience, the high-density technical sessions, and the founder circles made TechTalk the most rewarding conference I've attended in years."
  },
  {
    id: "t3",
    name: "Rohit Chandra",
    role: "Technical Co-Founder",
    company: "AgenticIQ",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
    quote: "Through TechTalk's Founder Meets in Hyderabad, I found our lead infrastructure engineer and closed our first enterprise design partner within three weeks."
  },
  {
    id: "t4",
    name: "Deepika Rao",
    role: "Machine Learning Researcher",
    company: "AI Frontier Labs",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    quote: "Unlike marketing-heavy conferences, TechTalk speakers dive straight into production code, latency profiling, and real failure post-mortems. Simply exceptional."
  }
];

export const COMMUNITY_COLLAGE_PHOTOS = [
  {
    title: "Main Keynote Stage",
    category: "Summits",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
    size: "large"
  },
  {
    title: "Interactive Technical Workshops",
    category: "Masterclasses",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80",
    size: "tall"
  },
  {
    title: "Founder Matchmaking Circle",
    category: "Networking",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80",
    size: "standard"
  },
  {
    title: "Audience Q&A & Code Clinics",
    category: "Community",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80",
    size: "wide"
  },
  {
    title: "Speaker Panel Discussion",
    category: "Keynote",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80",
    size: "standard"
  }
];

export const FAQ_ITEMS = [
  {
    q: "What is NexziByte TechTalk?",
    a: "NexziByte TechTalk is a premier international technology community and event platform. It connects developers, students, startup founders, technology leaders, and innovators through technical content, global summits, hands-on masterclasses, and high-impact networking opportunities."
  },
  {
    q: "Who can attend TechTalk?",
    a: "TechTalk is open to all technology enthusiasts: software engineers, architects, students, tech leads, startup founders, researchers, and enterprise innovators who are eager to build, connect, and explore what comes next."
  },
  {
    q: "What is included in the Visitor Pass?",
    a: "The Visitor Pass is completely FREE and grants open event entry, access to selected speaker sessions and keynote stages, technology exhibition hall access, community networking lounges, and an official verified Digital Event Pass with a unique QR code for instant check-in."
  },
  {
    q: "How much does the Visitor Pass cost?",
    a: "The Visitor Pass is 100% free! We believe in open access and empowering the developer community to discover new ideas and connect with innovators."
  },
  {
    q: "How much is the Delegate Pass?",
    a: "The Delegate Pass is priced at ₹250. It provides all-access delegate entry, deep-dive expert sessions, closed-door Founder Meets, digital certificates of participation, and exclusive delegate networking lounges."
  },
  {
    q: "How does QR check-in work?",
    a: "Upon claiming a Visitor Pass or purchasing a Delegate Pass, you receive a secure, unique digital pass with an embedded cryptographic QR code. At the venue, simply open your digital pass on your phone; our staff scanner verifies access in under 1 second without paper tickets."
  },
  {
    q: "Can students attend TechTalk?",
    a: "Absolutely! We welcome students and aspiring engineers. Students can claim the Free Visitor Pass or upgrade to the ₹250 Delegate Pass to showcase their projects, meet senior mentors, and participate in closed-door Founder Meets."
  },
  {
    q: "How can I become a speaker?",
    a: "We actively invite technical practitioners and founders with real-world insights. You can apply via our Speaker Program portal or submit a proposal detailing your talk topic, architecture lessons, and takeaways for our community review board."
  },
  {
    q: "Where are TechTalk events held?",
    a: "Our flagship summits and in-person founder meets are hosted in major technology hubs, primarily in Hyderabad, India (including the HICC Novotel and T-Hub), alongside synchronized 4K interactive virtual stages for our global community."
  }
];

/* ══════════════════════════════════════════════════════════════════
   DEDICATED EVENTS PAGE DATA (NEXZIBYTE TECHTALK DISCOVERY PLATFORM)
   ══════════════════════════════════════════════════════════════════ */

export const DEDICATED_UPCOMING_EVENTS = [
  {
    id: "event-ai-future-tech-summit",
    title: "AI & Future Technology Summit 2026",
    category: "AI & Technology",
    filterCategory: "conferences", // filters: all, upcoming, workshops, conferences, techtalks, webinars, meetups
    date: "September 20, 2026",
    rawDate: "2026-09-20",
    monthGroup: "sep-2026",
    time: "10:00 AM – 4:00 PM",
    location: "Hyderabad",
    venue: "T-Hub Phase 2 Auditorium, HITEC City, Hyderabad",
    mode: "offline", // online or offline
    modeBadge: "In-Person Summit",
    description: "Explore artificial intelligence, automation, emerging technologies and their impact on businesses and careers.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&auto=format&fit=crop&q=80",
    badge: "Flagship Summit",
    spotsLeft: 42,
    about: "The AI & Future Technology Summit 2026 is NexziByte's premier gathering designed for software architects, data scientists, founders, and students who want to build and scale next-generation cognitive systems. Through keynotes, live code breakdowns, and interactive panels, learn how autonomous AI agents, enterprise LLMs, and intelligent automation are actively reshaping product development and modern industries.",
    agenda: [
      { time: "09:30 AM", title: "Registration & Morning Networking Coffee", speaker: "Host Team" },
      { time: "10:00 AM", title: "Keynote: The Post-Transformer Era & Agentic Workflows", speaker: "Nagunoori Durga Prasad (Founder & MD, NexziByte)" },
      { time: "11:30 AM", title: "Deep Dive: Scaling Real-Time Multimodal AI in Production", speaker: "Arun Varma (Lead AI Architect)" },
      { time: "01:00 PM", title: "Executive Networking Lunch & AI Demo Showcase", speaker: "Exhibition Hall" },
      { time: "02:00 PM", title: "Panel: AI Governance, Reliability & Future Tech Careers", speaker: "Industry Panelists" },
      { time: "03:30 PM", title: "Open Q&A, Certificate Distribution & Closing Remarks", speaker: "NexziByte Team" }
    ],
    speakers: [
      { name: "Nagunoori Durga Prasad", role: "Founder & Managing Director", org: "NexziByte Solutions", image: "/images/founder-md-durga-prasad.png" },
      { name: "Dr. Arvind Ramesh", role: "Chief AI Scientist", org: "NeuralCognition Labs", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" },
      { name: "Sanya Roy", role: "VP of Engineering", org: "HyperScale Cloud", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80" }
    ],
    whoShouldAttend: [
      "AI & Machine Learning Engineers seeking production architectures",
      "Software Developers transitioning to Agentic AI and LLM tool chains",
      "Startup Founders & Tech Executives looking to integrate cognitive automation",
      "Computer Science students preparing for careers in high-impact AI domains"
    ],
    learnings: [
      "Architecture patterns for autonomous LLM agents and multi-agent coordination",
      "Strategies to reduce inference latency and optimize vector storage at scale",
      "Real-world enterprise case studies spanning healthcare, finance, and cloud",
      "Direct networking with top tech talent and hiring engineering teams"
    ]
  },
  {
    id: "event-fullstack-dev-meetup",
    title: "Full Stack Developer Meetup",
    category: "Development",
    filterCategory: "meetups",
    date: "September 27, 2026",
    rawDate: "2026-09-27",
    monthGroup: "sep-2026",
    time: "11:00 AM – 2:00 PM",
    location: "Hyderabad",
    venue: "NexziByte Tech Campus, Madhapur, Hyderabad",
    mode: "offline",
    modeBadge: "In-Person Meetup",
    description: "Connect with developers and learn about modern frontend, backend, API and cloud development.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80",
    badge: "Community Circle",
    spotsLeft: 28,
    about: "A high-energy developer gathering focused on what works in production today. Hear from practitioners building full-stack applications with React, Next.js, Java Spring Boot, Node.js, and serverless backends. Includes live coding clinics, architecture reviews, and open peer networking.",
    agenda: [
      { time: "11:00 AM", title: "Welcome & Community Mixer", speaker: "Community Leads" },
      { time: "11:20 AM", title: "Modern Frontend at Scale: Server Components & Edge Rendering", speaker: "Kavya Menon (Senior Frontend Lead)" },
      { time: "12:15 PM", title: "Robust Backend APIs: Microservices vs Modular Monoliths", speaker: "Vikram Deshmukh (Principal Architect)" },
      { time: "01:00 PM", title: "Interactive Lightning Talks & Code Clinics", speaker: "Community Participants" },
      { time: "01:45 PM", title: "Hiring Mixer & Networking", speaker: "NexziByte Talent Team" }
    ],
    speakers: [
      { name: "Kavya Menon", role: "Senior Frontend Lead", org: "NexziByte", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80" },
      { name: "Vikram Deshmukh", role: "Principal Cloud Architect", org: "Apex Global", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" }
    ],
    whoShouldAttend: [
      "Frontend, Backend, and Full-Stack Developers",
      "Junior Engineers and Coding Bootcamp Graduates",
      "Tech Leads building web applications and SaaS platforms",
      "Anyone curious about full-stack engineering trends in 2026"
    ],
    learnings: [
      "Modern full-stack frameworks and state synchronization techniques",
      "API design best practices for high-concurrency microservices",
      "Deployment pipelines using Docker, GitHub Actions, and Edge CDNs",
      "Career progression advice for software engineers in tech hubs"
    ]
  },
  {
    id: "event-build-with-ai-workshop",
    title: "Build with AI Workshop",
    category: "Workshop",
    filterCategory: "workshops",
    date: "October 5, 2026",
    rawDate: "2026-10-05",
    monthGroup: "oct-2026",
    time: "10:00 AM – 1:00 PM",
    location: "Online",
    venue: "NexziByte Interactive Virtual Stage (Global Live Stream)",
    mode: "online",
    modeBadge: "Hands-on Online",
    description: "A hands-on workshop focused on practical AI tools, machine learning concepts and real-world applications.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&auto=format&fit=crop&q=80",
    badge: "Hands-on Masterclass",
    spotsLeft: 75,
    about: "Bring your laptop and code along! This 3-hour intensive workshop walks you step-by-step through creating your first practical AI-powered application. We will cover prompt engineering, function calling, fine-tuned embeddings, and deploying an interactive AI assistant with live code repositories provided.",
    agenda: [
      { time: "10:00 AM", title: "Setup, Environment Check & API Access Provisioning", speaker: "Workshop Instructors" },
      { time: "10:20 AM", title: "Module 1: Foundations of Applied LLMs & Structured Outputs", speaker: "Rohan Nair" },
      { time: "11:15 AM", title: "Module 2: Building a Real-World RAG Pipeline with Vector DBs", speaker: "Rohan Nair & TAs" },
      { time: "12:15 PM", title: "Module 3: Deploying Your AI App to Production & Live Q&A", speaker: "Workshop Team" }
    ],
    speakers: [
      { name: "Rohan Nair", role: "Head of AI Engineering", org: "NexziByte Solutions", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80" }
    ],
    whoShouldAttend: [
      "Engineers looking for practical, zero-fluff AI development guidance",
      "Students eager to build portfolio-ready AI applications",
      "Product managers wanting to understand how AI services work under the hood"
    ],
    learnings: [
      "Writing structured prompt pipelines and reliable schema validators",
      "Connecting private documents to vector databases using hybrid search",
      "Avoiding common hallucinations and optimizing token budget efficiency",
      "Access to open-source starter repos and verifiable completion credentials"
    ]
  },
  {
    id: "event-cloud-devops-techtalk",
    title: "Cloud & DevOps TechTalk",
    category: "TechTalk",
    filterCategory: "techtalks",
    date: "October 12, 2026",
    rawDate: "2026-10-12",
    monthGroup: "oct-2026",
    time: "5:00 PM – 7:00 PM",
    location: "Online",
    venue: "NexziByte TechTalk Live Webinar Studio",
    mode: "online",
    modeBadge: "Live Webinar",
    description: "Learn modern cloud infrastructure, CI/CD, deployment workflows and DevOps practices.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop&q=80",
    badge: "Cloud Architecture",
    spotsLeft: 95,
    about: "A deep dive into cloud reliability, container orchestration, and continuous delivery. Senior DevOps engineers share hard-won production lessons on Kubernetes cluster operations, Terraform infrastructure as code, zero-downtime rolling deploys, and automated canary releases.",
    agenda: [
      { time: "05:00 PM", title: "Opening Remarks: Modern Cloud State of the Union", speaker: "NexziByte Moderator" },
      { time: "05:15 PM", title: "Zero to Production with Kubernetes & GitOps", speaker: "Manish Joshi (Staff DevOps Architect)" },
      { time: "06:00 PM", title: "Observability & Incident Management with Prometheus/Grafana", speaker: "Ananya Sen (SRE Lead)" },
      { time: "06:40 PM", title: "Live Q&A and Architecture Teardown", speaker: "Panel" }
    ],
    speakers: [
      { name: "Manish Joshi", role: "Staff DevOps Architect", org: "CloudScale India", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80" },
      { name: "Ananya Sen", role: "SRE Engineering Lead", org: "NexziByte Cloud", image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&auto=format&fit=crop&q=80" }
    ],
    whoShouldAttend: [
      "DevOps, Platform, and Site Reliability Engineers",
      "Cloud Administrators and System Architects",
      "Software Engineers managing cloud deployments and CI/CD pipelines"
    ],
    learnings: [
      "Building idempotent Terraform pipelines across multi-region environments",
      "Automated secret management and security posture in containerized stacks",
      "Designing fault-tolerant microservice networking with service meshes",
      "Benchmarking container cold-starts and reducing cloud infrastructure costs"
    ]
  },
  {
    id: "event-python-ml-bootcamp",
    title: "Python & Machine Learning Bootcamp",
    category: "Workshop",
    filterCategory: "workshops",
    date: "October 18, 2026",
    rawDate: "2026-10-18",
    monthGroup: "oct-2026",
    time: "9:30 AM – 3:00 PM",
    location: "Hyderabad",
    venue: "NexziByte Learning Hub, HITEC City, Hyderabad",
    mode: "offline",
    modeBadge: "Intensive Bootcamp",
    description: "Learn Python fundamentals, data analysis and machine learning through practical projects.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&auto=format&fit=crop&q=80",
    badge: "Accelerated Learning",
    spotsLeft: 22,
    about: "Designed for aspiring data scientists and programmers who want to accelerate their journey from Python fundamentals to real-world machine learning. Work on real datasets, clean data using Pandas/NumPy, build classification/regression models with Scikit-Learn, and evaluate performance metrics.",
    agenda: [
      { time: "09:30 AM", title: "Breakfast & Rapid Python Refresher (Data Structures & OOP)", speaker: "Instructor Team" },
      { time: "10:30 AM", title: "Data Wrangling & Statistical Insights with Pandas & Seaborn", speaker: "Dr. Neha Patel" },
      { time: "12:00 PM", title: "Building & Tuning Machine Learning Pipelines", speaker: "Dr. Neha Patel" },
      { time: "01:00 PM", title: "Catered Lunch & Peer Collaboration", speaker: "Community Lounge" },
      { time: "01:45 PM", title: "Capstone Project: End-to-End Predictive Model Deployment", speaker: "Hands-on Lab" }
    ],
    speakers: [
      { name: "Dr. Neha Patel", role: "Principal Data Scientist & Lead Trainer", org: "NexziByte Academy", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80" }
    ],
    whoShouldAttend: [
      "Beginner and Intermediate Python Programmers",
      "Analysts wanting to transition into Data Science & Machine Learning",
      "Students preparing for technology campus placements and project presentations"
    ],
    learnings: [
      "Proficiency with Python data science stack (NumPy, Pandas, Matplotlib)",
      "Model training, cross-validation, hyperparameter tuning, and evaluation",
      "Packaging ML models into lightweight FastAPI microservices",
      "Bootcamp Certificate of Achievement issued by NexziByte TechTalk"
    ]
  },
  {
    id: "event-career-connect-meetup",
    title: "Career Connect – Tech Industry Meetup",
    category: "Networking",
    filterCategory: "meetups",
    date: "October 25, 2026",
    rawDate: "2026-10-25",
    monthGroup: "oct-2026",
    time: "4:00 PM – 7:00 PM",
    location: "Hyderabad",
    venue: "The Quorum / Cyber City Tech Lounge, Hyderabad",
    mode: "offline",
    modeBadge: "Networking & Recruitment",
    description: "Meet technology professionals, mentors, recruiters and students while exploring career opportunities.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&auto=format&fit=crop&q=80",
    badge: "Recruitment & Mentorship",
    spotsLeft: 30,
    about: "Career Connect brings together technology hiring managers, startup founders, industry mentors, and ambitious engineers under one roof. Whether you're seeking your next engineering role, exploring an internship track, or seeking mentorship on navigating tech careers, this event provides direct, high-value conversations.",
    agenda: [
      { time: "04:00 PM", title: "Doors Open & Ice-Breaker Circles", speaker: "Career Leads" },
      { time: "04:30 PM", title: "Fireside Chat: What Tech Companies Actually Look For in 2026", speaker: "Recruitment Panel" },
      { time: "05:15 PM", title: "Resume Clinics & 1-on-1 Mentorship Tables", speaker: "Senior Staff Engineers" },
      { time: "06:15 PM", title: "Open Networking, Refreshments & Direct Hiring Discussions", speaker: "All Attendees" }
    ],
    speakers: [
      { name: "Rahul Deshpande", role: "Director of Talent Acquisition", org: "NexziByte Solutions", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80" },
      { name: "Meera Krishnan", role: "Engineering Manager", org: "Global Tech Services", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80" }
    ],
    whoShouldAttend: [
      "Job Seekers & Software Engineers exploring new career horizons",
      "Final-year Students and Recent Graduates looking for mentorship",
      "Tech Recruiters and Founders actively hiring engineering talent"
    ],
    learnings: [
      "Direct face-to-face conversations with active tech recruiters",
      "Actionable feedback on GitHub portfolios, resumes, and projects",
      "Insight into high-demand skills and hiring salary benchmarks for 2026",
      "Lasting connections with mentors and developer peers across Hyderabad"
    ]
  }
];

export const FEATURED_EVENT_DETAILS = {
  id: "featured-tech-innovation-summit-2026",
  label: "Featured Event",
  title: "NexziByte Tech Innovation Summit 2026",
  category: "Flagship Summit",
  description: "Join developers, technology leaders, founders, students and innovators for a day of learning, networking and conversations around the future of technology.",
  date: "November 14 – 15, 2026",
  rawDate: "2026-11-14",
  time: "9:00 AM – 6:00 PM IST",
  venue: "HICC Novotel & HITEC City Convention Centre, Hyderabad",
  location: "Hyderabad, India",
  speakers: "30+ Industry Keynotes & CTOs",
  expectedAttendees: "2,000+ Builders & Innovators",
  image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80",
  badge: "Annual Flagship Gathering 🏆",
  stats: [
    { label: "Keynote Speakers", value: "30+" },
    { label: "Attendees", value: "2,000+" },
    { label: "Technology Tracks", value: "6 Tracks" },
    { label: "Partner Companies", value: "40+" }
  ],
  about: "The NexziByte Tech Innovation Summit 2026 is our largest annual gathering, bringing together the global builder community. Over two action-packed days, experience keynote speeches by pioneering technology leaders, intensive architectural teardowns, an exhibition hall featuring breakthrough startups, and dedicated roundtables on AI, Cloud, Enterprise Engineering, and Tech Careers.",
  agenda: [
    { time: "Day 1 - 09:00 AM", title: "Grand Inauguration & Ministerial Welcome", speaker: "Leadership Delegation" },
    { time: "Day 1 - 10:30 AM", title: "Opening Keynote: Building Next-Gen Distributed Platforms", speaker: "Global Keynote Speaker" },
    { time: "Day 1 - 02:00 PM", title: "Parallel Tracks: AI Systems, Cloud Native & Modern Web", speaker: "Track Leads" },
    { time: "Day 2 - 10:00 AM", title: "Founder Circles: Venture Matchmaking & Growth Playbooks", speaker: "Founders & Investors" },
    { time: "Day 2 - 04:00 PM", title: "Innovation Awards & Grand Community Gala", speaker: "NexziByte Team" }
  ],
  speakersList: [
    { name: "Nagunoori Durga Prasad", role: "Founder & MD", org: "NexziByte Solutions", image: "/images/founder-md-durga-prasad.png" },
    { name: "Priya Sundaram", role: "Director of AI Research", org: "Cognitive Next", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80" },
    { name: "Rajesh Kannan", role: "Head of Cloud Architecture", org: "Enterprise Cloudways", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" }
  ],
  whoShouldAttend: [
    "Software Architects, Senior Engineers, and Product Builders",
    "Founders, Startup Operators, and Venture Enthusiasts",
    "University Students and Faculty exploring cutting-edge computing",
    "Enterprise Decision Makers and Digital Transformation Leaders"
  ],
  learnings: [
    "Macro perspectives on emerging software and artificial intelligence trends",
    "High-impact networking with over 2,000 technology professionals",
    "Hands-on exhibition access showcasing next-generation tech prototypes",
    "Exclusive delegate gift kit, digital credentials, and gala dinner invitation"
  ]
};

export const DEDICATED_PAST_EVENTS = [
  {
    id: "past-gpacts-2026",
    title: "GPACTS 2026 – Pharma AI & IT Summit",
    category: "Industry Summit",
    date: "September 3, 2026",
    location: "Hyderabad",
    venue: "Hyderabad Convention Centre, Hyderabad",
    description: "NexziByte Solutions participated in an industry event focused on AI, digital transformation and technology innovation.",
    image: "/images/summit-gpacts.jpg",
    stats: [
      { label: "Delegates", value: "400+" },
      { label: "Speakers", value: "50" },
      { label: "Partners", value: "13" },
      { label: "Unique Companies", value: "140+" }
    ],
    highlights: [
      "World's biggest Pharma AI & IT Summit held in Hyderabad",
      "400+ delegates, 50 speakers, 13 partners, and 140+ unique companies",
      "Discussions around AI, digital transformation, and the future of Pharma tech",
      "NexziByte Solutions explored where AI can create meaningful business impact",
      "High-level networking with corporate healthcare and pharmaceutical leaders"
    ],
    recapStatement: "Events like GPACTS provide an opportunity to understand evolving industry challenges, connect with professionals across the ecosystem, and explore where technology and AI can create meaningful business impact."
  },
  {
    id: "past-gcc-summit-2026",
    title: "GCC Summit 2026",
    category: "Industry Conference",
    date: "August 5, 2026",
    location: "Hyderabad",
    venue: "ITC Kohenur, HITEC City, Hyderabad",
    description: "A professional summit covering Global Capability Centers, enterprise technology, AI, cloud and digital transformation.",
    image: "/images/summit-gcc-announcement.jpg",
    stats: [
      { label: "GCC Leaders", value: "500+" },
      { label: "Enterprise Innovators", value: "100+" },
      { label: "AI & Tech Tracks", value: "25+" }
    ],
    highlights: [
      "Nagunoori Durga Prasad, Founder & MD of NexziByte, joined ETGCCWorld community",
      "Deep discussions on Enterprise AI, Cloud Computing, and Intelligent Automation",
      "Networking with leadership delegations from Fortune 500 Global Capability Centers",
      "Accelerating strategic enterprise technology partnerships and scalable digital products"
    ],
    recapStatement: "Meaningful conversations spark meaningful innovation. Events like GCC Summit strengthen our commitment to delivering scalable digital solutions while building long-term enterprise partnerships."
  },
  {
    id: "past-nexzibyte-developer-connect",
    title: "NexziByte Developer Connect",
    category: "Community Meetup",
    date: "July 18, 2026",
    location: "Hyderabad",
    venue: "NexziByte Community Auditorium, Hyderabad",
    description: "A technology networking and knowledge-sharing session connecting aspiring developers and industry professionals.",
    image: "/images/hero-meeting.png",
    stats: [
      { label: "Builders & Students", value: "250+" },
      { label: "Mentors", value: "20+" },
      { label: "Code Clinics", value: "8 Sessions" }
    ],
    highlights: [
      "Hands-on coding clinics, resume reviews, and live architecture breakdowns",
      "Connecting aspiring developers with senior engineering leads and tech mentors",
      "Open discussions on career pathways, modern frontend/backend stacks, and open source",
      "Interactive project showcases by college students and early-stage builders"
    ],
    recapStatement: "NexziByte Developer Connect was built on our core philosophy: where technology meets ideas, people, and possibilities. Seeing developers share insights and forge mentorships was truly inspiring."
  }
];

// Re-export dedicated summits and founder meets data
export * from "./summitsData.js";
export * from "./founderMeetsData.js";