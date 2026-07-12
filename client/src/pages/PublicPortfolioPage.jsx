import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { 
  User, Award, Code, Globe, Mail, Phone, MapPin, Send, MessageSquare, 
  ThumbsUp, ExternalLink, Calendar, Star, StarOff, Bookmark, BookmarkCheck,
  Search, ShieldAlert, Sparkles, BookOpen, Briefcase, Plus, Terminal, RefreshCw, Eye,
  Share2, Copy, Check, FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PublicPortfolioPage = () => {
  const { user } = useAuth();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering states
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Interactive visitor states
  const [likedProjects, setLikedProjects] = useState([]);
  const [bookmarkedProjects, setBookmarkedProjects] = useState([]);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [contactStatus, setContactStatus] = useState('');
  
  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // QR Code display
  const [showQr, setShowQr] = useState(false);

  // Project Sharing Modal
  const [sharingProject, setSharingProject] = useState(null);
  const [copied, setCopied] = useState(false);

  // Static Fallback Data
  const getFallbackData = () => {
    return {
      owner: {
        name: "Anmol Rajnish",
        profession: "Lead Web Architect & DevSecOps Engineer",
        bio: "Passionate full-stack developer specializing in building secure, scalable, and responsive MERN stack web applications with custom security tokens.",
        profileImage: "/AR.jpg",
        location: "New Delhi, India",
        contactDetails: {
          phone: "+91 7766827105",
          whatsapp: "+91 7766827105",
          telegram: "@a_nmolraj1921",
          linkedin: "www.linkedin.com/in/arajnish2408",
          github: "https://github.com/arajnish24"
        },
        themeSettings: {
          theme: "dark",
          accentColor: "#3b82f6",
          fontFamily: "Inter",
          layout: "glass",
          animationsEnabled: true
        }
      },
      skills: [
        { name: "React.js", category: "Frontend", level: 95 },
        { name: "Node.js & Express", category: "Backend", level: 90 },
        { name: "MongoDB & Mongoose", category: "Database", level: 88 },
        { name: "Docker & Kubernetes", category: "DevOps", level: 82 },
        { name: "TypeScript", category: "Programming Languages", level: 85 },
        { name: "Tailwind CSS", category: "Tools", level: 95 }
      ],
      experiences: [
        { company: "Software Services & Solutions", position: "Intern", location: "Patna, Bihar", joiningDate: "01/07/2026", leavingDate: "Present", responsibilities: ["MERN Stack Developer"] },
      ],
      educations: [
        { degree: "B.Tech (Computer Science & Engineering)", college: "Teerthanker Mahaveer University", duration: "2023 - 2027", cgpa: 7.29 },
        { degree: "Intermediate", college: "High School, Malaur", duration: "2021 - 2023" },
        { degree: "Matriculation", college: "The Divine Public School, Bikramganj, Rohtas", completedIn: "2021" }
      ],
      certificates: [
        { _id: "c_mern", title: "Full Stack Web Development( MERN Stack)", organization: "Apna College", date: "2025" }
      ],
      blogs: [
        { _id: "b_1", title: "Securing MERN Stack Apps in Production", slug: "securing-mern-stack", category: "Security", views: 110, likes: 18, readingTime: "4 min read", content: "Security is paramount in web development...", createdAt: new Date().toISOString() }
      ],
      gallery: [
        { title: "Speaking at WebConf 2025", type: "image", url: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=600", category: "Events" }
      ]
    };
  };

  const fetchPortfolioData = () => {
    setLoading(true);
    fetch('/api/portfolio/owner')
      .then(async res => {
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.message || 'Failed to fetch');
        setData(resData);
      })
      .catch(err => {
        console.warn('Backend connection failed, running client static fallback mode.');
        setData(getFallbackData());
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPortfolioData();
    // Load local bookmarks
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarked_projects') || '[]');
    setBookmarkedProjects(savedBookmarks);
  }, []);

  const handleTrackDownload = () => {
    fetch('/api/portfolio/track-download', { method: 'POST' }).catch(err => console.warn(err));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;

    setContactStatus('submitting');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (!res.ok) throw new Error();
      setContactStatus('success');
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setContactStatus(''), 4000);
    } catch (err) {
      setContactStatus('error');
    }
  };

  const toggleBookmark = (projectId) => {
    let updated;
    if (bookmarkedProjects.includes(projectId)) {
      updated = bookmarkedProjects.filter(id => id !== projectId);
    } else {
      updated = [...bookmarkedProjects, projectId];
    }
    setBookmarkedProjects(updated);
    localStorage.setItem('bookmarked_projects', JSON.stringify(updated));
  };

  const handleCopyLink = (projectId) => {
    const url = `${window.location.origin}/projects/${projectId}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy link: ', err));
  };

  if (loading) return <div className="text-center py-24 text-xs text-slate-500">Loading portfolio website...</div>;
  if (!data) return <div className="text-center py-24 text-xs text-slate-500">Portfolio Owner Profile not found.</div>;

  const { owner, skills, experiences, educations, certificates, blogs, gallery } = data;
  const projects = (data.projects && data.projects.length > 0) ? data.projects : [
    {
      _id: "p_portfoliox",
      title: "PortfolioX Platform",
      description: "A production-ready secure MERN portfolio system with dual-key token restrictions, resilient database failovers, and embedded recruiter analytics trackers.",
      technologies: ["React", "Express.js", "Node.js", "MongoDB", "Tailwind CSS"],
      github: "https://github.com/arajnish24/portfoliox",
      live: "https://portfoliox-demo.com",
      images: ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600"],
      features: ["Token verification", "Dynamic metrics dashboard", "Email alerts Integration", "Responsive grid layout"],
      duration: "3 months",
      status: "published",
      teamSize: 1,
      clientName: "Open Source Community",
      tags: ["Full Stack", "Identity Management", "Security"],
      difficulty: "Advanced",
      views: 128,
      likes: 45
    }
  ];

  // Project filtering logic
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = difficulty === 'All' || p.difficulty === difficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="space-y-24 bg-grid-mesh pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="container mx-auto px-6 max-w-7xl pt-16 md:pt-24 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="space-y-6 max-w-2xl text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/60 border border-blue-900/60 text-xs font-semibold text-blue-400">
            <Sparkles className="h-4 w-4 animate-spin" />
            <span>Open For Recruitment</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Hi, I'm <span className="text-premium-gradient">{owner.name}</span>
          </h1>

          <p className="text-lg md:text-xl font-bold text-slate-300">
            {owner.profession}
          </p>

          <p className="text-sm md:text-base text-slate-400 leading-relaxed font-light">
            {owner.bio}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={owner.resumeUrl || '/Updated_Resume.pdf'}
              target="_blank"
              rel="noreferrer"
              onClick={handleTrackDownload}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3.5 px-8 rounded-2xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10 hover:scale-[1.02]"
            >
              <Terminal className="h-4 w-4" />
              <span>Explore Resume CV</span>
            </a>

            <a
              href="#contact"
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold py-3.5 px-8 rounded-2xl text-xs flex items-center gap-1.5 transition-all hover:scale-[1.02]"
            >
              <span>Hire Me</span>
            </a>

            <button
              onClick={() => setShowQr(!showQr)}
              className="p-3 bg-slate-950 border border-slate-900 rounded-2xl text-slate-500 hover:text-white"
              title="Share portfolio QR Code"
            >
              <Globe className="h-4 w-4" />
            </button>
          </div>

          {showQr && (
            <div className="glass-panel p-4 rounded-3xl border border-slate-850 w-fit space-y-2 animate-premium-float mt-4">
              <QRCodeSVG value={window.location.href} size={128} bgColor="#0b0f19" fgColor="#ffffff" includeMargin />
              <span className="text-[10px] text-slate-500 font-bold block text-center font-mono">SCAN TO VISIT MOBILE</span>
            </div>
          )}

        </div>

        {/* Hero Image / Badge */}
        <div className="relative shrink-0 w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-tr from-blue-500/10 to-purple-500/10 p-2 border border-slate-800 flex items-center justify-center overflow-hidden">
          <img
            src={owner.profileImage || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400"}
            alt={owner.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>

      </section>

      {/* 2. STATS STATS */}
      <section className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-900/10 border border-slate-900 p-6 rounded-3xl text-center">
          <div>
            <span className="text-3xl font-extrabold text-white block">5+</span>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mt-1">Years Experience</span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-blue-400 block">{projects.length}</span>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mt-1">Projects Published</span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-purple-400 block">40+</span>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mt-1">Happy Clients</span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-amber-400 block">8+</span>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mt-1">Industry Awards</span>
          </div>
        </div>
      </section>

      {/* 3. ABOUT & TIMELINE */}
      <section id="about" className="container mx-auto px-6 max-w-7xl space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">Biography & <span className="text-premium-gradient">Milestones</span></h2>
          <p className="text-xs text-slate-500">My academic training and career progression details</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Experience */}
          <div className="space-y-6">
            <h3 className="text-sm font-extrabold text-blue-400 uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-1.5">
              <Briefcase className="h-4.5 w-4.5" />
              <span>Work Experience</span>
            </h3>
            <div className="space-y-6">
              {experiences.map((exp, idx) => (
                <div key={idx} className="relative pl-6 border-l border-slate-900 space-y-1.5">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-blue-500 rounded-full" />
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white">{exp.position}</span>
                    <span className="text-slate-500">{exp.joiningDate} - {exp.leavingDate}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{exp.company} — {exp.location}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-6">
            <h3 className="text-sm font-extrabold text-purple-400 uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-1.5">
              <BookOpen className="h-4.5 w-4.5" />
              <span>Education Records</span>
            </h3>
            <div className="space-y-6">
              {educations.map((edu, idx) => (
                <div key={idx} className="relative pl-6 border-l border-slate-900 space-y-1.5">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-purple-500 rounded-full" />
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white">{edu.degree}</span>
                    <span className="text-slate-500">{edu.duration}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{edu.college}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. SKILLS SECTION */}
      <section id="skills" className="container mx-auto px-6 max-w-7xl space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">Skills & <span className="text-premium-gradient">Proficiencies</span></h2>
          <p className="text-xs text-slate-500">Visual breakdown of engineering proficiencies by categories</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-900 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">{skill.name}</span>
                <span className="text-blue-400 font-mono">{skill.level}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${skill.level}%` }} />
              </div>
              <span className="text-[9px] bg-slate-900/60 border border-slate-800 text-slate-500 px-2 py-0.5 rounded font-semibold block w-fit">
                {skill.category || 'Core'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4.5. CERTIFICATIONS SECTION */}
      {certificates && certificates.length > 0 && (
        <section id="certificates" className="container mx-auto px-6 max-w-7xl space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">Licenses & <span className="text-premium-gradient">Certifications</span></h2>
            <p className="text-xs text-slate-500">Verified credentials and professional certifications</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, idx) => (
              <Link
                key={idx}
                to={`/certificates/${cert._id}`}
                target="_blank"
                className="glass-panel p-6 rounded-2xl border border-slate-900 flex items-start gap-4 hover:border-slate-800 hover:bg-slate-900/15 hover:shadow-lg hover:shadow-blue-500/5 transition-all group cursor-pointer text-left"
              >
                <div className="w-14 h-14 bg-slate-950 border border-slate-900 rounded-xl overflow-hidden shrink-0 flex items-center justify-center group-hover:border-slate-800 transition-colors">
                  {cert.image && !cert.image.toLowerCase().endsWith('.pdf') ? (
                    <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                  ) : cert.image && cert.image.toLowerCase().endsWith('.pdf') ? (
                    <FileText className="h-7 w-7 text-blue-500/80 group-hover:text-blue-400 transition-colors" />
                  ) : (
                    <Award className="h-7 w-7 text-blue-500/80 group-hover:text-blue-400 transition-colors" />
                  )}
                </div>
                <div className="space-y-1.5 min-w-0 flex-1">
                  <h3 className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors truncate">{cert.title}</h3>
                  <p className="text-xs text-blue-400 font-semibold">{cert.organization}</p>
                  {cert.date && <p className="text-[10px] text-slate-500 font-medium">Issued {cert.date}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5. PROJECTS PORTFOLIO */}
      <section id="projects" className="container mx-auto px-6 max-w-7xl space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">Featured <span className="text-premium-gradient">Projects</span></h2>
          <p className="text-xs text-slate-500">Filter and search verified project credentials</p>
        </div>

        {/* Filter Toolbar */}
        <div className="space-y-4 bg-slate-900/20 p-5 rounded-3xl border border-slate-900">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none"
                placeholder="Search project..."
              />
              <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-600" />
            </div>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs focus:outline-none"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs focus:outline-none"
            >
              <option value="newest">Sort: Newest</option>
              <option value="likes">Sort: Likes</option>
              <option value="views">Sort: Views</option>
            </select>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredProjects.map((p) => {
            const isBookmarked = bookmarkedProjects.includes(p._id);
            return (
              <div key={p._id} className="glass-panel rounded-3xl overflow-hidden flex flex-col justify-between hover:scale-[1.01] hover:border-slate-800 transition-all border border-slate-900 shadow-xl relative">
                
                <div>
                  <div className="h-48 md:h-56 w-full relative overflow-hidden">
                    <Link to={`/projects/${p._id}`}>
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600'}
                        alt={p.title}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-all"
                      />
                    </Link>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => { setSharingProject(p); setCopied(false); }}
                        className="p-2 bg-slate-950/80 backdrop-blur border border-slate-800/60 rounded-xl text-slate-400 hover:text-white cursor-pointer"
                        title="Share Project"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => toggleBookmark(p._id)}
                        className="p-2 bg-slate-950/80 backdrop-blur border border-slate-800/60 rounded-xl text-slate-400 hover:text-white cursor-pointer"
                        title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Project'}
                      >
                        {isBookmarked ? <BookmarkCheck className="h-3.5 w-3.5 text-blue-400" /> : <Bookmark className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-blue-400 uppercase tracking-widest font-mono font-bold">✔ VERIFIED OWNER GATED</span>
                      <span className="text-[9px] bg-slate-950 border border-slate-900 text-slate-500 px-2 py-0.5 rounded font-bold">{p.difficulty}</span>
                    </div>

                    <Link to={`/projects/${p._id}`}>
                      <h4 className="font-extrabold text-lg text-white leading-tight hover:text-blue-400 transition-colors cursor-pointer">{p.title}</h4>
                    </Link>
                    <p className="text-slate-400 text-xs leading-relaxed font-light">{p.description}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {p.technologies?.map((tech) => (
                        <span key={tech} className="bg-slate-950 border border-slate-900/80 px-2 py-0.5 rounded text-[9px] text-slate-400 font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-4 border-t border-slate-900/80 flex items-center justify-between text-xs">
                  <div className="flex gap-4 text-[10px] text-slate-500 font-bold">
                    <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {p.views || 0}</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" /> {p.likes || 0}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/projects/${p._id}`} className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg font-bold text-[10px] flex items-center justify-center">
                      Showcase
                    </Link>
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noreferrer" className="p-2 bg-slate-950 border border-slate-900 rounded-lg text-slate-400 hover:text-white">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noreferrer" className="px-3.5 py-1.5 bg-blue-600/90 text-white rounded-lg font-bold hover:bg-blue-500 text-[10px]">
                        Demo
                      </a>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>



      {/* 7. GALLERY */}
      {gallery && gallery.length > 0 && (
        <section id="gallery" className="container mx-auto px-6 max-w-7xl space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">Events & <span className="text-premium-gradient">Gallery</span></h2>
            <p className="text-xs text-slate-500">Moments from hackathons, technology speaking sessions, and achievements</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((g, idx) => (
              <div key={idx} className="group relative rounded-2xl overflow-hidden aspect-video border border-slate-900/60 shadow-md">
                <img src={g.url} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-3 transition-opacity">
                  <h6 className="font-bold text-xs">{g.title}</h6>
                  <span className="text-[9px] text-blue-400 font-semibold">{g.category}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. CONTACT FORM */}
      <section id="contact" className="container mx-auto px-6 max-w-3xl space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">Get In <span className="text-premium-gradient">Touch</span></h2>
          <p className="text-xs text-slate-500">Submit the contact form to trigger simulated secure confirmations</p>
        </div>

        <form onSubmit={handleContactSubmit} className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-850 space-y-4">
          {contactStatus === 'success' && (
            <div className="p-4 bg-emerald-950/40 text-emerald-400 border border-emerald-900 rounded-xl text-xs font-semibold">
              ✔ Message submitted successfully! Secure email confirmation alert has been logged in console.
            </div>
          )}
          {contactStatus === 'error' && (
            <div className="p-4 bg-rose-950/40 text-rose-300 border border-rose-900 rounded-xl text-xs font-semibold">
              ❌ Submission failed. Please try again.
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              className="bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl py-3 px-4 text-xs focus:outline-none"
              placeholder="Name"
              required
            />
            <input
              type="email"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              className="bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl py-3 px-4 text-xs focus:outline-none"
              placeholder="Email"
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="tel"
              value={contactForm.phone}
              onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
              className="bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl py-3 px-4 text-xs focus:outline-none"
              placeholder="Mobile Number"
            />
            <input
              type="text"
              value={contactForm.subject}
              onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
              className="bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl py-3 px-4 text-xs focus:outline-none"
              placeholder="Subject"
            />
          </div>
          <textarea
            rows={4}
            value={contactForm.message}
            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl py-3 px-4 text-xs focus:outline-none resize-none"
            placeholder="Write message details..."
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={contactStatus === 'submitting'}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3.5 px-8 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <span>{contactStatus === 'submitting' ? 'Submitting...' : 'Send Message'}</span>
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </section>

      {/* 9. NEWSLETTER FOOTER */}
      <footer className="border-t border-slate-900/60 pt-12 space-y-6">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-left">
            <h5 className="font-extrabold text-sm text-white">Subscribe to Newsletter</h5>
            <p className="text-[10px] text-slate-500">Get periodic notifications on full-stack architecture updates.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="bg-slate-950 border border-slate-850 rounded-xl py-2 px-4 text-xs focus:outline-none w-full md:w-64"
              placeholder="name@example.com"
            />
            <button
              onClick={() => { if (newsletterEmail) setNewsletterSuccess(true); }}
              className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              Join
            </button>
          </div>
        </div>

        {newsletterSuccess && (
          <p className="text-center text-[10px] text-emerald-400 font-bold">✔ Registered successfully for newsletter!</p>
        )}

        <div className="border-t border-slate-950 py-6 text-center text-[10px] text-slate-600 font-semibold uppercase tracking-wider">
          © {new Date().getFullYear()} Portfolio platform. All Rights Reserved. • <Link to="/login" className="hover:underline text-slate-500">Admin Workspace</Link>
        </div>
      </footer>

      {/* PROJECT SHARE MODAL */}
      {sharingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-6">
          <div className="glass-panel p-6 max-w-md w-full rounded-3xl border border-slate-800 shadow-2xl space-y-6 animate-premium-float text-white relative">
            <button
              onClick={() => setSharingProject(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
            >
              &times;
            </button>

            <div className="space-y-1.5 text-center">
              <Share2 className="h-8 w-8 text-blue-400 mx-auto" />
              <h4 className="font-extrabold text-base text-white uppercase tracking-wide">Share Project</h4>
              <p className="text-xs text-slate-400 font-semibold">{sharingProject.title}</p>
            </div>

            {/* Copy Link Section */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Direct Project URL</span>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-850 p-2.5 rounded-xl">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/projects/${sharingProject._id}`}
                  className="bg-transparent text-xs text-slate-300 font-mono focus:outline-none flex-1 truncate select-all"
                />
                <button
                  onClick={() => handleCopyLink(sharingProject._id)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-2 rounded-lg transition-all flex items-center gap-1 text-[10px] cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Social Share Grid */}
            <div className="space-y-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Share via Social Channels</span>
              <div className="grid grid-cols-3 gap-3">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this project: ${sharingProject.title} - ${window.location.origin}/projects/${sharingProject._id}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-1.5 p-3 bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-900/40 hover:border-emerald-800/80 rounded-2xl transition-all group"
                >
                  <span className="text-emerald-400 group-hover:scale-110 transition-transform">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.864.001-2.641-1.024-5.122-2.887-6.986-1.864-1.864-4.348-2.89-6.99-2.891-5.45 0-9.88 4.417-9.883 9.87-.001 1.93.502 3.81 1.457 5.429l-.982 3.585 3.676-.964zm10.702-7.077c-.293-.147-1.737-.857-2.004-.954-.268-.099-.463-.147-.659.147-.196.293-.757.954-.928 1.15-.171.195-.341.219-.634.073-.293-.147-1.238-.456-2.36-1.456-.872-.777-1.46-1.738-1.631-2.031-.171-.293-.018-.452.129-.597.132-.131.293-.341.44-.512.146-.171.195-.293.293-.488.098-.195.049-.366-.024-.512-.073-.147-.659-1.585-.902-2.17-.237-.574-.479-.496-.659-.505-.171-.007-.366-.008-.561-.008-.195 0-.512.073-.78.366-.268.293-1.024 1.001-1.024 2.44 0 1.439 1.049 2.83 1.195 3.025.147.195 2.062 3.149 4.996 4.413.698.301 1.244.481 1.667.615.7.222 1.339.19 1.843.115.56-.083 1.737-.708 1.982-1.391.244-.683.244-1.268.171-1.39-.073-.122-.268-.195-.561-.342z"/></svg>
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold group-hover:text-white transition-colors">WhatsApp</span>
                </a>

                {/* Telegram */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(`${window.location.origin}/projects/${sharingProject._id}`)}&text=${encodeURIComponent(`Check out this project: ${sharingProject.title}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-1.5 p-3 bg-sky-950/20 hover:bg-sky-950/40 border border-sky-900/40 hover:border-sky-800/80 rounded-2xl transition-all group"
                >
                  <span className="text-sky-400 group-hover:scale-110 transition-transform">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0C5.352 0 0 5.344 0 11.928c0 6.584 5.352 11.928 11.944 11.928 6.593 0 11.944-5.344 11.944-11.928C23.888 5.344 18.537 0 11.944 0zm5.496 7.424c.176.88-.352 4.144-1.04 7.392-.28 1.312-.96 1.76-1.424 1.808-1.008.096-1.776-.656-2.752-1.296-1.52-1.008-2.384-1.632-3.856-2.608-1.712-1.12-.608-1.744.368-2.752.256-.256 4.704-4.304 4.784-4.656.008-.048.016-.24-.096-.336-.112-.096-.288-.064-.416-.032-.176.048-2.992 1.904-8.448 5.584-.8.544-1.52.8-2.176.784-.72-.016-2.112-.416-3.136-.752-1.264-.416-2.272-.64-2.176-1.36.048-.368.56-.752 1.52-1.136 5.92-2.576 9.872-4.272 11.856-5.104 5.648-2.352 6.816-2.768 7.584-2.784.168 0 .552.04.8.24.208.168.264.4.28.576z"/></svg>
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold group-hover:text-white transition-colors">Telegram</span>
                </a>

                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${window.location.origin}/projects/${sharingProject._id}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-1.5 p-3 bg-blue-950/20 hover:bg-blue-950/40 border border-blue-900/40 hover:border-blue-800/80 rounded-2xl transition-all group"
                >
                  <span className="text-blue-400 group-hover:scale-110 transition-transform">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold group-hover:text-white transition-colors">LinkedIn</span>
                </a>

                {/* Naukri.com */}
                <a
                  href="https://www.naukri.com/mnjuser/homepage"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleCopyLink(sharingProject._id)}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 bg-amber-950/20 hover:bg-amber-950/40 border border-amber-900/40 hover:border-amber-800/80 rounded-2xl transition-all group"
                  title="Copies link and opens Naukri page to add to your profile"
                >
                  <span className="text-amber-400 group-hover:scale-110 transition-transform font-bold text-xs tracking-tighter bg-amber-950/80 border border-amber-900 h-5 w-5 rounded-full flex items-center justify-center">N</span>
                  <span className="text-[10px] text-slate-400 font-bold group-hover:text-white transition-colors">Naukri.com</span>
                </a>

                {/* Twitter / X */}
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${window.location.origin}/projects/${sharingProject._id}`)}&text=${encodeURIComponent(`Check out this project: ${sharingProject.title}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-1.5 p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all group"
                >
                  <span className="text-white group-hover:scale-110 transition-transform">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold group-hover:text-white transition-colors">X / Twitter</span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:?subject=${encodeURIComponent(`Project Showcase: ${sharingProject.title}`)}&body=${encodeURIComponent(`Take a look at this project on my portfolio website: ${window.location.origin}/projects/${sharingProject._id}`)}`}
                  className="flex flex-col items-center gap-1.5 p-3 bg-purple-950/20 hover:bg-purple-950/40 border border-purple-900/40 hover:border-purple-800/80 rounded-2xl transition-all group"
                >
                  <span className="text-purple-400 group-hover:scale-110 transition-transform">
                    <Mail className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold group-hover:text-white transition-colors">Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PublicPortfolioPage;
