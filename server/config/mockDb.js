import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE_PATH = path.join(__dirname, '../data/db_fallback.json');

const ensureDirectoryExists = () => {
  const dir = path.dirname(FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const getSeedData = () => {
  const ownerId = 'o_owner';
  
  // Bcrypt hash for password: 'password123'
  const hashedPassword = '$2a$10$Uv0t8QzP8lZ9xQ29.3QW/uP5C58N.qV1b5Z2Y.mP9J3GvFj.2U12a';

  const defaultOwner = {
    _id: ownerId,
    name: "Anmol Rajnish",
    email: "owner@portfolio.com",
    password: hashedPassword,
    role: "Owner",
    isVerified: true,
    portfolioToken: "PX-8453-9452-ABCD", // Portfolio Verification Token
    profession: "Senior Full Stack & Identity Security Architect",
    bio: "Lead Developer specializing in high-security MERN stack architectures, client-server verification systems, and cloud databases. Focused on delivering premium, modern web applications with seamless UX/UI transitions.",
    profileImage: "/AR.jpg",
    resumeUrl: "/Updated_Resume.pdf",
    location: "Mumbai, India",
    contactDetails: {
      phone: "+91 9876543210",
      whatsapp: "+919876543210",
      telegram: "anmol_rajnish",
      linkedin: "anmol-rajnish",
      github: "anmol-rajnish"
    },
    seo: {
      title: "Anmol Rajnish | Senior Full Stack Architect Portfolio",
      description: "Explore the secure portfolio and projects of Anmol Rajnish, showcasing MERN stack expertise and DevSecOps engineering.",
      keywords: "React, Node, Express, MongoDB, Security, TailwindCSS, JWT, Portfolios",
      ogImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800"
    },
    themeSettings: {
      theme: "dark",
      accentColor: "#3b82f6",
      fontFamily: "Inter",
      layout: "glass",
      animationsEnabled: true
    }
  };

  const defaultProjects = [
    {
      _id: "p_portfoliox",
      ownerId: ownerId,
      title: "PortfolioX Platform",
      description: "A production-ready secure MERN portfolio system with dual-key token restrictions, resilient database failovers, and embedded recruiter analytics trackers.",
      technologies: ["React", "Express.js", "Node.js", "MongoDB", "Tailwind CSS"],
      github: "https://github.com/alex-carter-code/portfoliox",
      live: "https://portfoliox-demo.com",
      playStore: "",
      appStore: "",
      images: ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600"],
      video: "",
      features: ["Token verification", "Dynamic metrics dashboard", "Email alerts Integration", "Responsive grid layout"],
      duration: "3 months",
      status: "published",
      teamSize: 1,
      clientName: "Open Source Community",
      tags: ["Full Stack", "Identity Management", "Security"],
      difficulty: "Advanced",
      views: 128,
      likes: 45,
      likedBy: [],
      downloads: 12,
      isPinned: true,
      isHidden: false,
      isFeatured: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: "p_cloudstore",
      ownerId: ownerId,
      title: "CloudStore Microservice Gateway",
      description: "High-performance API gateway resolving client queries, compression rules, rate limit filters, and routing mappings across AWS instances.",
      technologies: ["Node.js", "Express", "Docker", "AWS API Gateway", "Redis"],
      github: "https://github.com/alex-carter-code/cloudstore",
      live: "",
      playStore: "",
      appStore: "",
      images: ["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600"],
      video: "",
      features: ["Redis cache queries", "IP rate throttling", "JWT bearer validation checks"],
      duration: "2 months",
      status: "published",
      teamSize: 3,
      clientName: "Veloce Systems",
      tags: ["DevOps", "APIs", "Microservices"],
      difficulty: "Advanced",
      views: 92,
      likes: 31,
      likedBy: [],
      downloads: 8,
      isPinned: false,
      isHidden: false,
      isFeatured: false,
      createdAt: new Date().toISOString()
    }
  ];

  const defaultSkills = [
    { _id: "s_react", ownerId: ownerId, name: "React.js", category: "Frontend", level: 95 },
    { _id: "s_node", ownerId: ownerId, name: "Node.js & Express", category: "Backend", level: 90 },
    { _id: "s_mongo", ownerId: ownerId, name: "MongoDB & Mongoose", category: "Database", level: 88 },
    { _id: "s_docker", ownerId: ownerId, name: "Docker & Kubernetes", category: "DevOps", level: 82 },
    { _id: "s_ts", ownerId: ownerId, name: "TypeScript", category: "Programming Languages", level: 85 },
    { _id: "s_git", ownerId: ownerId, name: "Git & GitHub Actions", category: "Tools", level: 92 }
  ];

  const defaultExperience = [
    {
      _id: "exp_1",
      ownerId: ownerId,
      company: "Apex Tech Labs",
      position: "Lead Full Stack Architect",
      location: "San Francisco, CA (Hybrid)",
      joiningDate: "June 2024",
      leavingDate: "Present",
      responsibilities: [
        "Architected secure verification gates for user onboarding pipelines.",
        "Refactored Docker orchestration configurations, increasing cloud resources utilization by 22%."
      ],
      achievements: [
        "Received Outstanding Engineering Lead Award in 2025."
      ]
    },
    {
      _id: "exp_2",
      ownerId: ownerId,
      company: "ByteWave Solutions",
      position: "MERN Stack Engineer",
      location: "Remote",
      joiningDate: "March 2022",
      leavingDate: "May 2024",
      responsibilities: [
        "Delivered responsive dashboards in React, integrating Chart.js feeds and dynamic custom themes.",
        "Engineered Node gateway endpoints mapping CRUD requests."
      ],
      achievements: [
        "Optimized frontend build times by 35% using tree-shaking mechanisms."
      ]
    }
  ];

  const defaultEducation = [
    {
      _id: "edu_1",
      ownerId: ownerId,
      degree: "B.S. in Computer Science",
      college: "Stanford University",
      university: "Stanford University",
      percentage: 94,
      cgpa: 3.85,
      duration: "2018 - 2022",
      certificate: "https://example.com/stanford-diploma.pdf"
    }
  ];

  const defaultCertificates = [
    {
      _id: "cert_1",
      ownerId: ownerId,
      title: "AWS Certified Solutions Architect",
      organization: "Amazon Web Services",
      date: "2024",
      verificationLink: "https://aws.amazon.com/verification",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600"
    }
  ];

  const defaultTestimonials = [
    {
      _id: "t_1",
      ownerId: ownerId,
      clientName: "Sarah Jenkins",
      position: "VP of Product",
      company: "ByteWave Solutions",
      comment: "Alex is an exceptional developer who combines technical mastery of the MERN stack with a strong commitment to application security. A true professional!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200"
    }
  ];

  const defaultBlogs = [
    {
      _id: "b_1",
      ownerId: ownerId,
      title: "Securing MERN Stack Apps in Production",
      slug: "securing-mern-stack-production",
      content: "# Introduction\n\nSecurity is paramount in web development. In this article, we'll explore key ways to secure Express APIs and React dashboards.\n\n## 1. Headers Configuration\nUse `helmet` to manage HTTP headers securely.\n\n```javascript\napp.use(helmet());\n```\n\n## 2. Token Restrictions\nEnsure all write queries are checked against session keys and unique security passwords.",
      coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600",
      category: "Security",
      tags: ["MERN", "Security", "Express", "Node"],
      views: 110,
      likes: 18,
      likedBy: [],
      readingTime: "4 min read",
      comments: [
        { name: "John Doe", email: "john@example.com", content: "Great security checklist!", createdAt: new Date() }
      ],
      status: "published",
      publishDate: new Date().toISOString()
    }
  ];

  const defaultGallery = [
    {
      _id: "g_1",
      ownerId: ownerId,
      title: "Speaking at WebConf 2025",
      type: "image",
      url: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=600",
      category: "Events",
      description: "Delivering a keynote on Node.js performance scaling."
    }
  ];

  const defaultMessages = [];
  const defaultAnalytics = [
    { _id: "a_1", ip: "127.0.0.1", country: "United States", device: "Desktop", browser: "Chrome", os: "Windows", actionType: "profile_view", timestamp: new Date().toISOString() }
  ];
  const defaultNotifications = [
    { _id: "n_1", text: "Welcome to your secure PortfolioX admin panel!", type: "system", isRead: false, createdAt: new Date().toISOString() }
  ];

  return {
    users: [defaultOwner],
    projects: defaultProjects,
    skills: defaultSkills,
    experience: defaultExperience,
    education: defaultEducation,
    certificates: defaultCertificates,
    testimonials: defaultTestimonials,
    blogs: defaultBlogs,
    messages: defaultMessages,
    analytics: defaultAnalytics,
    notifications: defaultNotifications,
    gallery: defaultGallery,
    otps: {}
  };
};

export const initDb = () => {
  ensureDirectoryExists();
  if (!fs.existsSync(FILE_PATH)) {
    const seed = getSeedData();
    fs.writeFileSync(FILE_PATH, JSON.stringify(seed, null, 2));
  }
};

export const readDb = () => {
  initDb();
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading mock DB file, resetting:', error);
    return getSeedData();
  }
};

export const writeDb = (data) => {
  ensureDirectoryExists();
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing mock DB file:', error);
    return false;
  }
};

export const mockDbHelper = {
  // Collection fetch/write helpers
  getCollection: (name) => {
    const db = readDb();
    return db[name] || [];
  },

  saveToCollection: (collectionName, item) => {
    const db = readDb();
    if (!db[collectionName]) db[collectionName] = [];
    
    const index = db[collectionName].findIndex(x => x._id === item._id);
    if (index > -1) {
      db[collectionName][index] = { ...db[collectionName][index], ...item };
    } else {
      if (!item._id) item._id = collectionName.charAt(0) + '_' + Math.random().toString(36).substr(2, 9);
      db[collectionName].push(item);
    }
    
    writeDb(db);
    return item;
  },

  deleteFromCollection: (collectionName, id) => {
    const db = readDb();
    if (!db[collectionName]) return false;
    
    const index = db[collectionName].findIndex(x => x._id === id);
    if (index > -1) {
      db[collectionName].splice(index, 1);
      writeDb(db);
      return true;
    }
    return false;
  },

  // Specialized OTP helpers
  saveOtp: (mobileOrEmail, otp, expiresAt) => {
    const db = readDb();
    if (!db.otps) db.otps = {};
    db.otps[mobileOrEmail] = { otp, expiresAt };
    writeDb(db);
  },

  verifyOtp: (mobileOrEmail, otp) => {
    const db = readDb();
    if (!db.otps || !db.otps[mobileOrEmail]) return false;
    const record = db.otps[mobileOrEmail];
    if (new Date().getTime() > record.expiresAt) {
      delete db.otps[mobileOrEmail];
      writeDb(db);
      return false;
    }
    if (record.otp === otp) {
      delete db.otps[mobileOrEmail];
      writeDb(db);
      return true;
    }
    return false;
  }
};
