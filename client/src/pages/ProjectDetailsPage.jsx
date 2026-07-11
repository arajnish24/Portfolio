import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, Calendar, Eye, ThumbsUp, Download, Github, Globe, 
  Play, Cpu, ShieldCheck, Terminal, Award, Users, Hourglass, Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { token } = useAuth();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  const fetchProjectDetails = () => {
    setLoading(true);
    fetch(`/api/project/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.project) {
          setProject(data.project);
          // Check if user already liked it in this session
          const likedSession = localStorage.getItem(`liked_${id}`);
          if (likedSession) setLiked(true);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('Failed to fetch project details from server, using fallback details.');
        // Fallback project details matching the seeded projects
        const fallbackProject = {
          _id: id,
          title: "PortfolioX Platform",
          description: "A production-ready secure MERN portfolio system with dual-key token restrictions, resilient database failovers, and embedded recruiter analytics trackers. It prevents visual document spoofing and blocks spam publications.",
          technologies: ["React", "Express.js", "Node.js", "MongoDB", "Tailwind CSS"],
          github: "https://github.com/arajnish24/portfoliox",
          live: "https://portfoliox-demo.com",
          playStore: "https://play.google.com/store",
          appStore: "https://apple.com/app-store",
          images: ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900"],
          video: "",
          features: [
            "Unique Dual-Key portfolio token gates validation check.",
            "Dynamic visitor/recruiter device, OS, and browser analytics logging.",
            "Double-column print layout formats for resume PDF exports.",
            "Resilient MongoDB local JSON file failovers."
          ],
          duration: "3 months",
          status: "published",
          teamSize: 1,
          clientName: "Open Source Community",
          tags: ["Full Stack", "Identity Management", "Security"],
          difficulty: "Advanced",
          views: 129,
          likes: 45,
          codeSnippet: `// Secure write gate validation middleware\nconst verifyTokenHeader = (req, res, next) => {\n  const { portfolioToken } = req.body;\n  if (!portfolioToken) {\n    return res.status(401).json({ message: 'Token required' });\n  }\n  if (portfolioToken !== req.user.portfolioToken) {\n    return res.status(403).json({ message: 'TRANSACTION REJECTED: Invalid Token' });\n  }\n  next();\n};`
        };
        setProject(fallbackProject);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const handleLike = () => {
    if (!project || liked) return;

    fetch(`/api/project/${id}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })
      .then(res => res.json())
      .then(data => {
        setProject({ ...project, likes: data.likes });
        setLiked(true);
        localStorage.setItem(`liked_${id}`, 'true');
      })
      .catch(() => {
        // Fallback simulation
        setProject({ ...project, likes: (project.likes || 0) + 1 });
        setLiked(true);
        localStorage.setItem(`liked_${id}`, 'true');
      });
  };

  const handleDownloadTrack = () => {
    if (!project) return;
    setProject({ ...project, downloads: (project.downloads || 0) + 1 });
    fetch('/api/portfolio/track-download', { method: 'POST' }).catch(err => console.warn(err));
  };

  if (loading) {
    return <div className="text-center py-24 text-xs text-slate-500">Loading project showcase...</div>;
  }

  if (!project) {
    return (
      <div className="container mx-auto px-6 py-24 max-w-xl text-center space-y-4">
        <h3 className="text-xl font-bold">Project Showcase Not Found</h3>
        <Link to="/" className="text-blue-400 font-bold hover:underline">Return to profile</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl space-y-8 bg-grid-mesh">
      
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-bold transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back to Portfolio</span>
      </Link>

      {/* Showcase Cover and Header */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Gallery / Cover Image */}
        <div className="md:col-span-2 space-y-4">
          <div className="h-64 md:h-[400px] w-full rounded-3xl overflow-hidden border border-slate-900 shadow-2xl">
            <img
              src={project.images?.[0] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900'}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {project.images && project.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {project.images.map((img, idx) => (
                <div key={idx} className="w-24 h-16 rounded-xl overflow-hidden border border-slate-900 shrink-0">
                  <img src={img} alt="Screenshot" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Details Sidebar */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-850 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-white leading-tight">
              {project.title}
            </h2>
            <div className="flex items-center gap-2 text-[10px] bg-slate-950 border border-slate-900 p-2 rounded-xl text-slate-400 font-semibold w-fit">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Verified Creator Credentials</span>
            </div>
            
            <div className="pt-2 border-t border-slate-900 flex flex-col gap-2.5 text-xs text-slate-400">
              <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><Hourglass className="h-4 w-4 text-purple-400" /> Duration</span><strong className="text-white">{project.duration || 'N/A'}</strong></div>
              <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-emerald-400" /> Team Size</span><strong className="text-white">{project.teamSize || 1} Developer</strong></div>
              <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><Layers className="h-4 w-4 text-amber-400" /> Difficulty</span><strong className="text-white">{project.difficulty || 'Intermediate'}</strong></div>
              <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><Cpu className="h-4 w-4 text-blue-400" /> Client</span><strong className="text-white">{project.clientName || 'Personal'}</strong></div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-900 space-y-3">
            {project.live && (
              <a 
                href={project.live} 
                target="_blank" 
                rel="noreferrer"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl text-xs text-center flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
              >
                <Globe className="h-4 w-4" />
                <span>Visit Live Deployment</span>
              </a>
            )}
            {project.github && (
              <a 
                href={project.github} 
                target="_blank" 
                rel="noreferrer"
                className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold py-3 rounded-xl text-xs text-center flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Github className="h-4 w-4" />
                <span>View Source Repository</span>
              </a>
            )}
            
            {/* Play/App Store Links */}
            {(project.playStore || project.appStore) && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                {project.playStore && (
                  <a href={project.playStore} target="_blank" rel="noreferrer" className="bg-slate-950 border border-slate-900 p-2 rounded-xl text-[10px] text-center text-slate-300 font-bold">
                    Play Store
                  </a>
                )}
                {project.appStore && (
                  <a href={project.appStore} target="_blank" rel="noreferrer" className="bg-slate-950 border border-slate-900 p-2 rounded-xl text-[10px] text-center text-slate-300 font-bold">
                    App Store
                  </a>
                )}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Main Details and Showcase Material */}
      <div className="grid md:grid-cols-3 gap-8 items-start">
        
        {/* Core Showcase (Description & Code Snippet) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Description */}
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-850 space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Cpu className="h-5 w-5 text-blue-400" />
              <span>Project Showcase Overview</span>
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light">
              {project.description}
            </p>
          </div>

          {/* Key Features */}
          {project.features && project.features.length > 0 && (
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-850 space-y-4">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-400" />
                <span>Key Technical Features</span>
              </h3>
              <ul className="list-disc list-inside space-y-2 text-xs md:text-sm text-slate-300 font-light">
                {project.features.map((feat, idx) => (
                  <li key={idx} className="leading-relaxed"><strong className="text-white">{feat.split(':')[0]}:</strong>{feat.split(':')[1] || ''}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Code Snippet - Glassmorphism terminal */}
          {project.codeSnippet && (
            <div className="glass-panel rounded-3xl border border-slate-850 overflow-hidden space-y-0 shadow-2xl">
              <div className="bg-slate-900/60 px-5 py-3 border-b border-slate-850 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-blue-400" />
                  <span className="text-[10px] text-slate-400 font-bold font-mono">key_workspace_logic.js</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
              </div>
              <pre className="p-6 bg-slate-950/90 text-slate-300 font-mono text-[10px] md:text-xs overflow-x-auto select-all leading-relaxed">
                <code>{project.codeSnippet}</code>
              </pre>
            </div>
          )}

        </div>

        {/* Sidebar Info (Technologies & Stats) */}
        <div className="space-y-6">
          
          {/* Technologies */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-850 space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">Technologies Utilized</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech) => (
                <span key={tech} className="bg-slate-950 border border-slate-900 px-3 py-1 rounded-xl text-xs text-slate-300 font-mono font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Project Statistics & Actions */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-850 space-y-6">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">Showcase Interaction</h3>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">👁️ Project Views</span>
                <span className="text-xl font-extrabold mt-1 block">{project.views || 0}</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">❤️ Project Likes</span>
                <span className="text-xl font-extrabold mt-1 block text-rose-400">{project.likes || 0}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleLike}
                disabled={liked}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${liked ? 'bg-rose-950/20 text-rose-400 border border-rose-900/30' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer'}`}
              >
                <ThumbsUp className="h-4 w-4 text-rose-500" />
                <span>{liked ? 'Liked' : 'Like Project'}</span>
              </button>
              <button
                onClick={handleDownloadTrack}
                className="p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-300 hover:text-white cursor-pointer"
                title="Download Project Assets"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProjectDetailsPage;
