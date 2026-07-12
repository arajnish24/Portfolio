import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, Code, Globe, ShieldCheck, Plus, Edit3, BarChart3, Share2, 
  Settings, Trash2, CheckCircle2, AlertTriangle, Eye, EyeOff, 
  PlusCircle, BookOpen, Briefcase, Award, Sparkles, Copy, ExternalLink, 
  Sun, Moon, Layers, Download, CheckSquare, Bell, Clock, Lock, 
  FileText, Star, Heart, MessageSquare, UploadCloud, Camera, RefreshCw
} from 'lucide-react';

const DashboardPage = () => {
  const { user, token, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  // Route protection
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState('overview');

  // Core owner stats and logs
  const [stats, setStats] = useState({ profileViews: 380, resumeDownloads: 24, projectClicks: 90, totalLikes: 45 });
  const [charts, setCharts] = useState({ devices: [], browsers: [], os: [], traffic: [] });
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Add Project Token Verification Modal States
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const [emailVerificationOtp, setEmailVerificationOtp] = useState('');
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const [tokenWarning, setTokenWarning] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [editingProjectId, setEditingProjectId] = useState(null);

  // Add Project Form State
  const [newProject, setNewProject] = useState({
    title: '', description: '', technologies: '', github: '', 
    live: '', playStore: '', appStore: '', images: '', video: '', features: '', 
    duration: '', status: 'published', teamSize: 1, clientName: 'Personal', tags: '', difficulty: 'Intermediate'
  });
  const [projectStatus, setProjectStatus] = useState('');

  // Profile data edit
  const [profileData, setProfileData] = useState({
    name: '', profileImage: '', profession: '', resumeUrl: '', bio: '', location: '', phone: '', whatsapp: '', telegram: '', linkedin: '', github: ''
  });
  const [profileMsg, setProfileMsg] = useState('');

  // Appearance setting states
  const [themeConfig, setThemeConfig] = useState({
    theme: 'dark', accentColor: '#3b82f6', fontFamily: 'Inter', layout: 'glass', animationsEnabled: true
  });
  const [themeMsg, setThemeMsg] = useState('');

  // Security Regen state
  const [regenPassword, setRegenPassword] = useState('');
  const [regenMsg, setRegenMsg] = useState('');

  const [gallery, setGallery] = useState([]);
  const [contentSubTab, setContentSubTab] = useState('skills');
  const [contentMsg, setContentMsg] = useState('');

  // Skills
  const [skillForm, setSkillForm] = useState({ name: '', category: 'Frontend', level: 80 });
  const [editingSkillId, setEditingSkillId] = useState(null);

  // Experience
  const [expForm, setExpForm] = useState({ company: '', position: '', location: '', joiningDate: '', leavingDate: '', responsibilities: '', achievements: '' });
  const [editingExpId, setEditingExpId] = useState(null);

  // Education
  const [eduForm, setEduForm] = useState({ degree: '', college: '', university: '', percentage: '', cgpa: '', duration: '', certificate: '' });
  const [editingEduId, setEditingEduId] = useState(null);

  // Gallery
  const [galForm, setGalForm] = useState({ title: '', type: 'image', url: '', category: 'Events', description: '' });
  const [editingGalId, setEditingGalId] = useState(null);

  // Certificates
  const [certForm, setCertForm] = useState({ title: '', organization: '', date: '', verificationLink: '', image: '' });
  const [editingCertId, setEditingCertId] = useState(null);

  const [isCopied, setIsCopied] = useState(false);

  // Fetch all collections on mount
  const refreshDashboardData = () => {
    if (!token) return;

    // Fetch owner details
    fetch('/api/portfolio/owner')
      .then(res => res.json())
      .then(data => {
        if (data.owner) {
          const o = data.owner;
          setProfileData({
            name: o.name || '',
            profileImage: o.profileImage || '',
            profession: o.profession || '',
            resumeUrl: o.resumeUrl || '',
            bio: o.bio || '',
            location: o.location || '',
            phone: o.contactDetails?.phone || '',
            whatsapp: o.contactDetails?.whatsapp || '',
            telegram: o.contactDetails?.telegram || '',
            linkedin: o.contactDetails?.linkedin || '',
            github: o.contactDetails?.github || ''
          });
          if (o.themeSettings) {
            setThemeConfig(o.themeSettings);
          }
        }
        if (data.skills) setSkills(data.skills);
        if (data.experiences) setExperiences(data.experiences);
        if (data.educations) setEducations(data.educations);
        if (data.certificates) setCertificates(data.certificates);
        if (data.blogs) setBlogs(data.blogs);
        if (data.gallery) setGallery(data.gallery);
      }).catch(err => console.warn(err));

    // Fetch projects
    fetch('/api/project')
      .then(res => res.json())
      .then(data => {
        if (data.projects) setProjects(data.projects);
      }).catch(err => console.warn(err));

    // Fetch analytics
    fetch('/api/dashboard/analytics', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data.metrics) setStats(data.metrics);
        if (data.charts) setCharts(data.charts);
      }).catch(err => console.warn(err));

    // Fetch messages
    fetch('/api/messages', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data.messages) setMessages(data.messages);
      }).catch(err => console.warn(err));

    // Fetch notifications
    fetch('/api/dashboard/notifications', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data.notifications) setNotifications(data.notifications);
      }).catch(err => console.warn(err));
  };

  useEffect(() => {
    refreshDashboardData();
  }, [token]);

  if (!user) return null;

  const isOwner = user.role === 'Owner';

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Portfolio details Update
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg('');

    try {
      const res = await fetch('/api/portfolio/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileData.name,
          profileImage: profileData.profileImage,
          profession: profileData.profession,
          bio: profileData.bio,
          location: profileData.location,
          resumeUrl: profileData.resumeUrl,
          contactDetails: {
            phone: profileData.phone,
            whatsapp: profileData.whatsapp,
            telegram: profileData.telegram,
            linkedin: profileData.linkedin,
            github: profileData.github
          }
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      updateUser(data.user);
      setProfileMsg('Portfolio details updated successfully!');
      refreshDashboardData();
    } catch (err) {
      setProfileMsg(`Error: ${err.message}`);
    }
  };

  // Appearance Configurations
  const handleThemeSave = async (e) => {
    e.preventDefault();
    setThemeMsg('');
    try {
      const res = await fetch('/api/portfolio/appearance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(themeConfig)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      updateUser({ themeSettings: themeConfig });
      setThemeMsg('Appearance settings updated successfully!');
      refreshDashboardData();
    } catch (err) {
      setThemeMsg(err.message);
    }
  };

  // Token regeneration
  const handleRegenToken = async (e) => {
    e.preventDefault();
    setRegenMsg('');
    try {
      const res = await fetch('/api/auth/regenerate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: regenPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      updateUser({ portfolioToken: data.portfolioToken });
      setRegenPassword('');
      setRegenMsg(`Regenerated! New Token: ${data.portfolioToken}`);
      refreshDashboardData();
    } catch (err) {
      setRegenMsg(err.message);
    }
  };

  // Trigger sending dynamic OTP to email and showing modal
  const triggerProjectVerification = async () => {
    setIsTokenVerified(false);
    setShowTokenModal(true);
    setTokenError('');
    setTokenWarning('');
    setDevOtp('');
    setVerificationToken('');
    setEmailVerificationOtp('');
    try {
      const res = await fetch('/api/auth/send-project-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      let data = {};
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        await res.text();
        throw new Error('Server returned HTML instead of JSON. Check if your backend Web Service on Render is online, or verify your VITE_API_URL / Redirect rules.');
      }
      if (!res.ok) throw new Error(data.message || 'Failed to dispatch verification OTP');

      if (data.warning) {
        setTokenWarning(data.warning);
        setDevOtp(data.mockOtp);
      }
    } catch (err) {
      setTokenError(`Failed to send email verification: ${err.message}`);
    }
  };

  // Verify Project Token before posting project
  const handleVerifyProjectToken = async (e) => {
    e.preventDefault();
    setTokenError('');
    try {
      const res = await fetch('/api/auth/verify-project-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token: verificationToken, emailOtp: emailVerificationOtp })
      });
      let data = {};
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        await res.text();
        throw new Error('Server returned HTML instead of JSON. Check if your backend Web Service on Render is online, or verify your VITE_API_URL / Redirect rules.');
      }
      if (!res.ok) throw new Error(data.message || 'Verification failed');

      setIsTokenVerified(true);
      setShowTokenModal(false);
    } catch (err) {
      setTokenError(err.message);
    }
  };

  // Add Project Submit / Edit Project Submit
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setProjectStatus('submitting');
    try {
      const url = editingProjectId ? `/api/project/${editingProjectId}` : '/api/project';
      const method = editingProjectId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newProject,
          technologies: typeof newProject.technologies === 'string'
            ? newProject.technologies.split(',').map(x => x.trim()).filter(Boolean)
            : newProject.technologies,
          features: typeof newProject.features === 'string'
            ? newProject.features.split(',').map(x => x.trim()).filter(Boolean)
            : newProject.features,
          tags: typeof newProject.tags === 'string'
            ? newProject.tags.split(',').map(x => x.trim()).filter(Boolean)
            : newProject.tags,
          images: newProject.images ? (Array.isArray(newProject.images) ? newProject.images : [newProject.images]) : [],
          portfolioToken: verificationToken
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setProjectStatus('success');
      setNewProject({
        title: '', description: '', technologies: '', github: '', 
        live: '', playStore: '', appStore: '', images: '', video: '', features: '', 
        duration: '', status: 'published', teamSize: 1, clientName: 'Personal', tags: '', difficulty: 'Intermediate'
      });
      setIsTokenVerified(false);
      setVerificationToken('');
      setEditingProjectId(null);
      refreshDashboardData();
      setTimeout(() => setProjectStatus(''), 4000);
    } catch (err) {
      setProjectStatus(`error: ${err.message}`);
    }
  };

  const handleEditProjectClick = (p) => {
    setEditingProjectId(p._id);
    setNewProject({
      title: p.title || '',
      description: p.description || '',
      technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : (p.technologies || ''),
      github: p.github || '',
      live: p.live || '',
      playStore: p.playStore || '',
      appStore: p.appStore || '',
      images: Array.isArray(p.images) ? (p.images[0] || '') : (p.images || ''),
      video: p.video || '',
      features: Array.isArray(p.features) ? p.features.join(', ') : (p.features || ''),
      duration: p.duration || '',
      status: p.status || 'published',
      teamSize: p.teamSize || 1,
      clientName: p.clientName || 'Personal',
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
      difficulty: p.difficulty || 'Intermediate'
    });
    if (!verificationToken) {
      triggerProjectVerification();
    } else {
      setIsTokenVerified(true);
    }
  };

  const handleFileUpload = async (file, callback) => {
    if (!file) return;
    
    // Check file format extension
    const filetypes = /jpeg|jpg|png|gif|webp|svg|pdf|doc|docx/i;
    if (!filetypes.test(file.name)) {
      alert('Supported file formats: jpg, jpeg, png, gif, webp, svg, pdf, doc, docx');
      return;
    }
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await fetch('/api/portfolio/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      
      callback(data.url);
    } catch (err) {
      alert(`Upload error: ${err.message}`);
    }
  };

  // Delete project
  const handleProjectDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await fetch(`/api/project/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      refreshDashboardData();
    } catch (err) {
      console.warn(err);
    }
  };

  // Helper for adding/updating collection items
  const handleCollectionSubmit = async (e, collectionName, id, body, resetForm) => {
    e.preventDefault();
    setContentMsg('');
    try {
      const url = id 
        ? `/api/collections/${collectionName}/${id}` 
        : `/api/collections/${collectionName}`;
      const method = id ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message);

      setContentMsg(`${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)} saved successfully!`);
      resetForm();
      refreshDashboardData();
      setTimeout(() => setContentMsg(''), 4000);
    } catch (err) {
      setContentMsg(`Error saving ${collectionName}: ${err.message}`);
    }
  };

  // Helper for deleting items
  const handleCollectionDelete = async (collectionName, id) => {
    if (!confirm(`Are you sure you want to delete this item?`)) return;
    try {
      const res = await fetch(`/api/collections/${collectionName}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message);
      
      setContentMsg(`Item deleted successfully.`);
      refreshDashboardData();
      setTimeout(() => setContentMsg(''), 4000);
    } catch (err) {
      setContentMsg(`Error deleting: ${err.message}`);
    }
  };

  // Mark notifications read
  const handleMarkNotificationsRead = async () => {
    try {
      await fetch('/api/dashboard/notifications/read', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      refreshDashboardData();
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-7xl">
      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center font-extrabold text-lg text-white uppercase">
                {user.name.charAt(0)}
              </div>
              <div className="text-xs space-y-0.5">
                <h4 className="font-extrabold text-white">{user.name}</h4>
                <p className="text-slate-500 font-mono">{user.email}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-900 flex flex-col gap-1.5 text-xs text-slate-400 font-semibold">
              <span className="flex justify-between">Role: <strong className="text-white">{user.role}</strong></span>
              <span className="flex justify-between">Identity Status: <strong className={user.isVerified ? 'text-emerald-400' : 'text-amber-500'}>{user.isVerified ? '✔ Verified' : 'Pending OTP'}</strong></span>
            </div>
          </div>

          {/* Sidebar Menu Links */}
          <div className="glass-panel p-4 rounded-3xl border border-slate-800 flex flex-col gap-1.5 text-xs font-bold text-slate-400">
            <button onClick={() => setActiveTab('overview')} className={`w-full py-2.5 px-4 rounded-xl text-left transition-colors flex items-center gap-2 cursor-pointer ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'hover:bg-slate-900/60 hover:text-white'}`}>
              <BarChart3 className="h-4 w-4" /> Overview & Analytics
            </button>
            <button onClick={() => setActiveTab('projects')} className={`w-full py-2.5 px-4 rounded-xl text-left transition-colors flex items-center gap-2 cursor-pointer ${activeTab === 'projects' ? 'bg-blue-600 text-white' : 'hover:bg-slate-900/60 hover:text-white'}`}>
              <Code className="h-4 w-4" /> Projects Management
            </button>
            <button onClick={() => setActiveTab('content')} className={`w-full py-2.5 px-4 rounded-xl text-left transition-colors flex items-center gap-2 cursor-pointer ${activeTab === 'content' ? 'bg-blue-600 text-white' : 'hover:bg-slate-900/60 hover:text-white'}`}>
              <Briefcase className="h-4 w-4" /> Content Manager
            </button>
            <button onClick={() => setActiveTab('profile')} className={`w-full py-2.5 px-4 rounded-xl text-left transition-colors flex items-center gap-2 cursor-pointer ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'hover:bg-slate-900/60 hover:text-white'}`}>
              <User className="h-4 w-4" /> Profile details
            </button>
            <button onClick={() => setActiveTab('messages')} className={`w-full py-2.5 px-4 rounded-xl text-left transition-colors flex items-center gap-2 cursor-pointer ${activeTab === 'messages' ? 'bg-blue-600 text-white' : 'hover:bg-slate-900/60 hover:text-white'}`}>
              <MessageSquare className="h-4 w-4" /> Inbox ({messages.length})
            </button>
            <button onClick={() => setActiveTab('appearance')} className={`w-full py-2.5 px-4 rounded-xl text-left transition-colors flex items-center gap-2 cursor-pointer ${activeTab === 'appearance' ? 'bg-blue-600 text-white' : 'hover:bg-slate-900/60 hover:text-white'}`}>
              <Layers className="h-4 w-4" /> Themes & Appearance
            </button>
            <button onClick={() => setActiveTab('security')} className={`w-full py-2.5 px-4 rounded-xl text-left transition-colors flex items-center gap-2 cursor-pointer ${activeTab === 'security' ? 'bg-blue-600 text-white' : 'hover:bg-slate-900/60 hover:text-white'}`}>
              <Lock className="h-4 w-4" /> Account Security
            </button>
            <button onClick={() => { logout(); navigate('/'); }} className="w-full py-2.5 px-4 rounded-xl text-left hover:bg-rose-950/20 text-rose-400 transition-colors flex items-center gap-2 cursor-pointer">
              <EyeOff className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="lg:col-span-3">
          
          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Security Warning banner for Visitors */}
              {!isOwner && (
                <div className="flex items-start gap-3 p-5 bg-rose-950/40 border border-rose-900 text-rose-300 rounded-3xl text-xs">
                  <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block">READ-ONLY MODE:</span> You are registered as a **Visitor**. Write operations (publishing projects, updating timeline records, regenerating token keys) are blocked and restricted to the portfolio **Owner**.
                  </div>
                </div>
              )}

              {/* Stats overview boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="glass-panel p-5 rounded-2xl border border-slate-900 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">👁️ Profile Views</span>
                  <span className="text-2xl font-extrabold mt-1 block">{stats.profileViews}</span>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-slate-900 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">📂 Total Projects</span>
                  <span className="text-2xl font-extrabold mt-1 block">{projects.length}</span>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-slate-900 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">❤️ Total Likes</span>
                  <span className="text-2xl font-extrabold mt-1 block text-rose-400">{stats.totalLikes}</span>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-slate-900 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">📄 CV Downloads</span>
                  <span className="text-2xl font-extrabold mt-1 block text-blue-400">{stats.resumeDownloads}</span>
                </div>
              </div>

              {/* Analytical Charts */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">Recruiter Traffic (Browser / Device)</h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Browser Share */}
                  <div className="space-y-3 bg-slate-950/60 p-4 border border-slate-900 rounded-2xl text-xs">
                    <span className="font-bold text-slate-400 block border-b border-slate-900 pb-1">Browsers Used</span>
                    <div className="space-y-2">
                      <div className="flex justify-between"><span>Chrome</span><strong>78%</strong></div>
                      <div className="flex justify-between"><span>Firefox</span><strong>12%</strong></div>
                      <div className="flex justify-between"><span>Safari</span><strong>10%</strong></div>
                    </div>
                  </div>
                  {/* Device Share */}
                  <div className="space-y-3 bg-slate-950/60 p-4 border border-slate-900 rounded-2xl text-xs">
                    <span className="font-bold text-slate-400 block border-b border-slate-900 pb-1">Device Form Factors</span>
                    <div className="space-y-2">
                      <div className="flex justify-between"><span>Desktop</span><strong>65%</strong></div>
                      <div className="flex justify-between"><span>Mobile Screen</span><strong>30%</strong></div>
                      <div className="flex justify-between"><span>Tablet</span><strong>5%</strong></div>
                    </div>
                  </div>
                  {/* OS share */}
                  <div className="space-y-3 bg-slate-950/60 p-4 border border-slate-900 rounded-2xl text-xs">
                    <span className="font-bold text-slate-400 block border-b border-slate-900 pb-1">Operating Systems</span>
                    <div className="space-y-2">
                      <div className="flex justify-between"><span>Windows</span><strong>55%</strong></div>
                      <div className="flex justify-between"><span>MacOS</span><strong>35%</strong></div>
                      <div className="flex justify-between"><span>Linux</span><strong>10%</strong></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notifications clear */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">Platform Notifications</h3>
                  <button onClick={handleMarkNotificationsRead} className="text-[10px] text-blue-400 font-bold hover:underline">Mark all read</button>
                </div>
                <div className="space-y-2.5 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n._id} className="text-xs flex items-start gap-2 border-b border-slate-900/60 pb-2 last:border-b-0">
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.isRead ? 'bg-slate-800' : 'bg-blue-500'}`} />
                      <p className="text-slate-300">{n.text}</p>
                    </div>
                  ))}
                  {notifications.length === 0 && <p className="text-xs text-slate-500 italic">No notifications yet.</p>}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PROJECTS MANAGEMENT */}
          {activeTab === 'projects' && (
            <div className="space-y-10">
              
              {/* verification tokens checklist */}
              {isOwner && (
                <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">verified upload gate</span>
                  
                  {isTokenVerified ? (
                    <div className="p-4 bg-emerald-950/40 border border-emerald-900 text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      <span>Verification token authenticated. You can now publish projects.</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <p className="text-slate-400">Add Project requires verification token authorization:</p>
                      <button
                        onClick={triggerProjectVerification}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-5 rounded-xl transition-all cursor-pointer"
                      >
                        Enter Portfolio Token
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Publish Form (only active if token is verified) */}
              {isTokenVerified && (
                <form onSubmit={handleProjectSubmit} className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
                  <h3 className="text-base font-extrabold text-white border-b border-slate-900 pb-2">
                    {editingProjectId ? 'Update Project Details' : 'Publish Project Details'}
                  </h3>
                  
                  {projectStatus && (
                    <div className={`p-4 rounded-xl text-xs font-semibold ${projectStatus === 'success' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900' : 'bg-rose-950/40 text-rose-300 border border-rose-900'}`}>
                      {projectStatus === 'success' ? 'Project saved successfully!' : projectStatus}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      className="bg-slate-950 border border-slate-850 rounded-xl py-3 px-4 text-xs text-white"
                      placeholder="Title"
                      required
                    />
                    <input
                      type="text"
                      value={newProject.technologies}
                      onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                      className="bg-slate-950 border border-slate-850 rounded-xl py-3 px-4 text-xs text-white"
                      placeholder="Technologies (comma-separated, e.g. React, Node)"
                      required
                    />
                  </div>

                  <textarea
                    rows={3}
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 px-4 text-xs resize-none"
                    placeholder="Description summary..."
                    required
                  />

                  <div className="grid md:grid-cols-3 gap-4 text-xs">
                    <input
                      type="url"
                      value={newProject.github}
                      onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                      className="bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3"
                      placeholder="GitHub Link"
                    />
                    <input
                      type="url"
                      value={newProject.live}
                      onChange={(e) => setNewProject({ ...newProject, live: e.target.value })}
                      className="bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3"
                      placeholder="Live Demo Link"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newProject.images}
                        onChange={(e) => setNewProject({ ...newProject, images: e.target.value })}
                        className="flex-1 bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 min-w-0"
                        placeholder="Screenshot URL"
                        required
                      />
                      <label className="bg-slate-900 border border-slate-850 hover:border-slate-750 text-slate-400 font-bold px-4 rounded-xl cursor-pointer flex items-center justify-center whitespace-nowrap transition-colors">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e.target.files[0], (url) => {
                            setNewProject({ ...newProject, images: url });
                          })}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsTokenVerified(false);
                        setVerificationToken('');
                        setEditingProjectId(null);
                        setNewProject({
                          title: '', description: '', technologies: '', github: '', 
                          live: '', playStore: '', appStore: '', images: '', video: '', features: '', 
                          duration: '', status: 'published', teamSize: 1, clientName: 'Personal', tags: '', difficulty: 'Intermediate'
                        });
                      }}
                      className="bg-slate-900 border border-slate-850 text-slate-400 py-3 px-6 rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl text-xs transition-colors"
                    >
                      {editingProjectId ? 'Update Project' : 'Publish Project'}
                    </button>
                  </div>
                </form>
              )}

              {/* List of projects */}
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 border-b border-slate-900 pb-2">Recent Projects</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {projects.map((p) => (
                    <div key={p._id} className="glass-panel p-5 rounded-2xl border border-slate-900 flex justify-between items-center text-xs">
                      <div>
                        <h4 className="font-extrabold text-white text-sm">{p.title}</h4>
                        <span className="text-[10px] text-slate-500 block mt-1">Difficulty: {p.difficulty}</span>
                      </div>
                      {isOwner && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleEditProjectClick(p)}
                            className="p-2 bg-blue-950/40 hover:bg-blue-900 border border-blue-900/60 text-blue-300 rounded-lg transition-colors cursor-pointer"
                            title="Edit Project Details"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleProjectDelete(p._id)}
                            className="p-2 bg-rose-950/40 hover:bg-rose-900 border border-rose-900/60 text-rose-300 rounded-lg transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: PROFILE DETAILS */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
              <h3 className="text-base font-extrabold text-white border-b border-slate-900 pb-2 flex items-center gap-1.5">
                <Edit3 className="h-5 w-5 text-blue-400" />
                <span>Modify Portfolio details</span>
              </h3>

              {profileMsg && (
                <div className="p-4 rounded-xl text-xs font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-900">
                  {profileMsg}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-slate-400 uppercase block">Display Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500"
                    disabled={!isOwner}
                    required
                  />
                </div>
                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-slate-400 uppercase block">Profile Photo URL / File</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={profileData.profileImage}
                      onChange={(e) => setProfileData({ ...profileData, profileImage: e.target.value })}
                      className="flex-1 bg-slate-950 border border-slate-850 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 min-w-0"
                      disabled={!isOwner}
                      required
                    />
                    {isOwner && (
                      <label className="bg-slate-900 border border-slate-850 hover:border-slate-750 text-slate-400 font-bold px-4 rounded-xl cursor-pointer flex items-center justify-center whitespace-nowrap transition-colors text-[10px]">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e.target.files[0], (url) => {
                            setProfileData({ ...profileData, profileImage: url });
                          })}
                        />
                      </label>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-slate-400 uppercase block">Resume / CV Document</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={profileData.resumeUrl}
                      onChange={(e) => setProfileData({ ...profileData, resumeUrl: e.target.value })}
                      className="flex-1 bg-slate-950 border border-slate-850 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 min-w-0 font-mono text-[10px]"
                      disabled={!isOwner}
                      placeholder="/Updated_Resume.pdf or http://..."
                    />
                    {isOwner && (
                      <label className="bg-slate-900 border border-slate-850 hover:border-slate-750 text-slate-400 font-bold px-4 rounded-xl cursor-pointer flex items-center justify-center whitespace-nowrap transition-colors text-[10px]">
                        Upload
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e.target.files[0], (url) => {
                            setProfileData({ ...profileData, resumeUrl: url });
                          })}
                        />
                      </label>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-slate-400 uppercase block">Headline Position</label>
                  <input
                    type="text"
                    value={profileData.profession}
                    onChange={(e) => setProfileData({ ...profileData, profession: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500"
                    disabled={!isOwner}
                    required
                  />
                </div>
                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-slate-400 uppercase block">Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500"
                    disabled={!isOwner}
                    required
                  />
                </div>
              </div>

              {profileData.profileImage && (
                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-slate-400 uppercase block">Photo Preview</label>
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-800">
                    <img src={profileData.profileImage} alt="Profile Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-400 uppercase block">Biography</label>
                <textarea
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 px-4 resize-none text-white focus:outline-none focus:border-blue-500"
                  disabled={!isOwner}
                  required
                />
              </div>

              {/* Social connector handles */}
              <div className="space-y-4 pt-2 border-t border-slate-900">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Social connectors</span>
                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <input
                    type="text"
                    placeholder="GitHub Username"
                    value={profileData.github}
                    onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                    className="bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3"
                    disabled={!isOwner}
                  />
                  <input
                    type="text"
                    placeholder="LinkedIn Handle"
                    value={profileData.linkedin}
                    onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                    className="bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3"
                    disabled={!isOwner}
                  />
                </div>
              </div>

              {isOwner && (
                <div className="flex justify-end pt-4 border-t border-slate-900">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl text-xs transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          )}

          {/* TAB 4: INBOX MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <h3 className="text-base font-extrabold text-white border-b border-slate-900 pb-2 flex items-center gap-1.5">
                <MessageSquare className="h-5 w-5 text-blue-400" />
                <span>Inbox Messages</span>
              </h3>

              <div className="space-y-4">
                {messages.map((m) => (
                  <div key={m._id} className="glass-panel p-5 rounded-2xl border border-slate-900 space-y-3 relative text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-white text-sm">{m.name} <span className="text-slate-500 font-mono font-normal">({m.email})</span></h5>
                        <p className="text-[10px] text-blue-400 font-semibold mt-0.5">Subject: {m.subject}</p>
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold">{new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed font-light">{m.message}</p>

                    {m.replyContent && (
                      <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-900 mt-2">
                        <span className="font-bold text-blue-400 uppercase text-[9px] block">Simulated Reply Alert:</span>
                        <p className="text-[11px] text-slate-300 mt-1 font-light italic">"{m.replyContent}"</p>
                      </div>
                    )}

                    {isOwner && !m.replyContent && (
                      <button
                        onClick={() => {
                          const rep = prompt('Type simulated reply contents:');
                          if (rep) {
                            fetch(`/api/messages/${m._id}`, {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                              },
                              body: JSON.stringify({ replyContent: rep })
                            }).then(() => refreshDashboardData()).catch(err => console.warn(err));
                          }
                        }}
                        className="bg-slate-950 hover:bg-slate-900 text-blue-400 border border-slate-900 hover:border-slate-850 px-3 py-1.5 rounded-lg font-bold text-[10px] mt-2 block"
                      >
                        Reply Message
                      </button>
                    )}
                  </div>
                ))}
                {messages.length === 0 && <p className="text-xs text-slate-500 italic py-6 text-center">No messages received.</p>}
              </div>
            </div>
          )}

          {/* TAB 5: APPEARANCE CONFIGURATION */}
          {activeTab === 'appearance' && (
            <form onSubmit={handleThemeSave} className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
              <h3 className="text-base font-extrabold text-white border-b border-slate-900 pb-2">Layout & Themes</h3>

              {themeMsg && (
                <div className="p-4 rounded-xl text-xs font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-900">
                  {themeMsg}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-400 uppercase block">Active Theme</label>
                  <select
                    value={themeConfig.theme}
                    onChange={(e) => setThemeConfig({ ...themeConfig, theme: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 px-4"
                    disabled={!isOwner}
                  >
                    <option value="dark">Slate Dark</option>
                    <option value="light">Modern Light</option>
                    <option value="system">System Default</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-400 uppercase block">Accent Highlight Color</label>
                  <input
                    type="color"
                    value={themeConfig.accentColor}
                    onChange={(e) => setThemeConfig({ ...themeConfig, accentColor: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl h-12 p-1"
                    disabled={!isOwner}
                  />
                </div>
              </div>

              {isOwner && (
                <div className="flex justify-end pt-4 border-t border-slate-900">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl text-xs transition-colors"
                  >
                    Sync Appearance
                  </button>
                </div>
              )}
            </form>
          )}

          {/* TAB 4: CONTENT MANAGER */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Tab Header */}
              <div className="glass-panel p-4 md:p-6 rounded-3xl border border-slate-800 flex justify-between items-center flex-wrap gap-4">
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-white">Collections Content Manager</h3>
                  <p className="text-[10px] text-slate-500">Edit skills, milestones, and gallery items displayed on the public landing page</p>
                </div>
                
                {contentMsg && (
                  <div className="p-3 bg-blue-950/40 text-blue-300 border border-blue-900/60 rounded-xl text-xs font-semibold">
                    {contentMsg}
                  </div>
                )}
              </div>

              {/* Sub-navigation Menu */}
              <div className="flex gap-2 border-b border-slate-900 pb-2 overflow-x-auto">
                <button
                  onClick={() => { setContentSubTab('skills'); setContentMsg(''); }}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${contentSubTab === 'skills' ? 'bg-blue-600 text-white' : 'bg-slate-950 border border-slate-900 text-slate-400 hover:text-white'}`}
                >
                  Skills & Proficiency
                </button>
                <button
                  onClick={() => { setContentSubTab('experience'); setContentMsg(''); }}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${contentSubTab === 'experience' ? 'bg-blue-600 text-white' : 'bg-slate-950 border border-slate-900 text-slate-400 hover:text-white'}`}
                >
                  Milestones (Experiences)
                </button>
                <button
                  onClick={() => { setContentSubTab('education'); setContentMsg(''); }}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${contentSubTab === 'education' ? 'bg-blue-600 text-white' : 'bg-slate-950 border border-slate-900 text-slate-400 hover:text-white'}`}
                >
                  Milestones (Educations)
                </button>
                <button
                  onClick={() => { setContentSubTab('gallery'); setContentMsg(''); }}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${contentSubTab === 'gallery' ? 'bg-blue-600 text-white' : 'bg-slate-950 border border-slate-900 text-slate-400 hover:text-white'}`}
                >
                  Events & Gallery
                </button>
                <button
                  onClick={() => { setContentSubTab('certificates'); setContentMsg(''); }}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${contentSubTab === 'certificates' ? 'bg-blue-600 text-white' : 'bg-slate-950 border border-slate-900 text-slate-400 hover:text-white'}`}
                >
                  Certifications
                </button>
              </div>

              {/* 1. SKILLS MANAGER SUB-TAB */}
              {contentSubTab === 'skills' && (
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Skill form */}
                  {isOwner && (
                    <form
                      onSubmit={(e) => handleCollectionSubmit(e, 'skills', editingSkillId, skillForm, () => {
                        setSkillForm({ name: '', category: 'Frontend', level: 80 });
                        setEditingSkillId(null);
                      })}
                      className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 md:col-span-1 h-fit"
                    >
                      <h4 className="font-extrabold text-sm text-white">
                        {editingSkillId ? 'Edit Skill record' : 'Add Skill record'}
                      </h4>
                      <div className="space-y-1 text-xs">
                        <label className="text-slate-400 font-bold block">Skill Name</label>
                        <input
                          type="text"
                          value={skillForm.name}
                          onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-white focus:outline-none"
                          placeholder="e.g. React.js"
                          required
                        />
                      </div>
                      <div className="space-y-1 text-xs">
                        <label className="text-slate-400 font-bold block">Category</label>
                        <select
                          value={skillForm.category}
                          onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-slate-300 focus:outline-none"
                        >
                          <option value="Frontend">Frontend</option>
                          <option value="Backend">Backend</option>
                          <option value="Database">Database</option>
                          <option value="DevOps">DevOps</option>
                          <option value="Tools">Tools</option>
                          <option value="Programming Languages">Programming Languages</option>
                          <option value="Core">Core</option>
                        </select>
                      </div>
                      <div className="space-y-1 text-xs">
                        <label className="text-slate-400 font-bold block">Proficiency Level ({skillForm.level}%)</label>
                        <input
                          type="range"
                          min="1"
                          max="100"
                          value={skillForm.level}
                          onChange={(e) => setSkillForm({ ...skillForm, level: parseInt(e.target.value) })}
                          className="w-full bg-slate-950 h-2 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        {editingSkillId && (
                          <button
                            type="button"
                            onClick={() => {
                              setSkillForm({ name: '', category: 'Frontend', level: 80 });
                              setEditingSkillId(null);
                            }}
                            className="flex-1 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-400 font-bold py-2.5 rounded-xl text-xs"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                        >
                          {editingSkillId ? 'Update' : 'Add Skill'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Skills list */}
                  <div className={`${isOwner ? 'md:col-span-2' : 'md:col-span-3'} space-y-4`}>
                    <h4 className="font-extrabold text-sm text-slate-300 uppercase tracking-wider">Current Skills</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {skills.map((s) => (
                        <div key={s._id} className="glass-panel p-4 rounded-2xl border border-slate-900 flex justify-between items-center text-xs">
                          <div className="space-y-1">
                            <h5 className="font-extrabold text-white">{s.name}</h5>
                            <span className="text-[9px] text-slate-500">{s.category} — {s.level}% Proficiency</span>
                          </div>
                          {isOwner && (
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingSkillId(s._id);
                                  setSkillForm({ name: s.name || '', category: s.category || 'Frontend', level: s.level || 80 });
                                }}
                                className="p-1.5 bg-blue-950/40 hover:bg-blue-900 border border-blue-900/60 text-blue-300 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit3 className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleCollectionDelete('skills', s._id)}
                                className="p-1.5 bg-rose-950/40 hover:bg-rose-900 border border-rose-900/60 text-rose-300 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. EXPERIENCE MANAGER SUB-TAB */}
              {contentSubTab === 'experience' && (
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Experience form */}
                  {isOwner && (
                    <form
                      onSubmit={(e) => handleCollectionSubmit(e, 'experience', editingExpId, {
                        ...expForm,
                        responsibilities: typeof expForm.responsibilities === 'string' ? expForm.responsibilities.split('\n').filter(Boolean) : expForm.responsibilities,
                        achievements: typeof expForm.achievements === 'string' ? expForm.achievements.split('\n').filter(Boolean) : expForm.achievements
                      }, () => {
                        setExpForm({ company: '', position: '', location: '', joiningDate: '', leavingDate: '', responsibilities: '', achievements: '' });
                        setEditingExpId(null);
                      })}
                      className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 md:col-span-1 h-fit"
                    >
                      <h4 className="font-extrabold text-sm text-white">
                        {editingExpId ? 'Edit Work Experience' : 'Add Work Experience'}
                      </h4>
                      <div className="space-y-1 text-xs">
                        <label className="text-slate-400 font-bold block">Company</label>
                        <input
                          type="text"
                          value={expForm.company}
                          onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-white focus:outline-none"
                          required
                        />
                      </div>
                      <div className="space-y-1 text-xs">
                        <label className="text-slate-400 font-bold block">Position</label>
                        <input
                          type="text"
                          value={expForm.position}
                          onChange={(e) => setExpForm({ ...expForm, position: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-white focus:outline-none"
                          required
                        />
                      </div>
                      <div className="space-y-1 text-xs">
                        <label className="text-slate-400 font-bold block">Location</label>
                        <input
                          type="text"
                          value={expForm.location}
                          onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-white focus:outline-none"
                          placeholder="e.g. Remote or Delhi, India"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="space-y-1">
                          <label className="text-slate-400 font-bold block">Joining Date</label>
                          <input
                            type="text"
                            value={expForm.joiningDate}
                            onChange={(e) => setExpForm({ ...expForm, joiningDate: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-white focus:outline-none"
                            placeholder="e.g. June 2024"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 font-bold block">Leaving Date</label>
                          <input
                            type="text"
                            value={expForm.leavingDate}
                            onChange={(e) => setExpForm({ ...expForm, leavingDate: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-white focus:outline-none"
                            placeholder="e.g. Present"
                          />
                        </div>
                      </div>
                      <div className="space-y-1 text-xs">
                        <label className="text-slate-400 font-bold block">Responsibilities (one per line)</label>
                        <textarea
                          rows={3}
                          value={expForm.responsibilities}
                          onChange={(e) => setExpForm({ ...expForm, responsibilities: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-white focus:outline-none resize-none"
                        />
                      </div>
                      <div className="space-y-1 text-xs">
                        <label className="text-slate-400 font-bold block">Achievements (one per line)</label>
                        <textarea
                          rows={3}
                          value={expForm.achievements}
                          onChange={(e) => setExpForm({ ...expForm, achievements: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-white focus:outline-none resize-none"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        {editingExpId && (
                          <button
                            type="button"
                            onClick={() => {
                              setExpForm({ company: '', position: '', location: '', joiningDate: '', leavingDate: '', responsibilities: '', achievements: '' });
                              setEditingExpId(null);
                            }}
                            className="flex-1 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-400 font-bold py-2.5 rounded-xl text-xs"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                        >
                          {editingExpId ? 'Update' : 'Add Experience'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Experience List */}
                  <div className={`${isOwner ? 'md:col-span-2' : 'md:col-span-3'} space-y-4`}>
                    <h4 className="font-extrabold text-sm text-slate-300 uppercase tracking-wider">Current Experiences</h4>
                    <div className="space-y-4">
                      {experiences.map((exp) => (
                        <div key={exp._id} className="glass-panel p-5 rounded-2xl border border-slate-900 flex justify-between items-start text-xs">
                          <div className="space-y-1.5 max-w-[80%]">
                            <h5 className="font-extrabold text-white text-sm">{exp.position}</h5>
                            <div className="text-[10px] text-slate-400">
                              <span className="font-semibold text-blue-400">{exp.company}</span> — {exp.location} | {exp.joiningDate} - {exp.leavingDate || 'Present'}
                            </div>
                            {exp.responsibilities && exp.responsibilities.length > 0 && (
                              <ul className="list-disc pl-4 text-slate-500 space-y-0.5 text-[10px] mt-1.5">
                                {exp.responsibilities.map((r, idx) => <li key={idx}>{r}</li>)}
                              </ul>
                            )}
                          </div>
                          {isOwner && (
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingExpId(exp._id);
                                  setExpForm({
                                    company: exp.company || '',
                                    position: exp.position || '',
                                    location: exp.location || '',
                                    joiningDate: exp.joiningDate || '',
                                    leavingDate: exp.leavingDate || '',
                                    responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities.join('\n') : (exp.responsibilities || ''),
                                    achievements: Array.isArray(exp.achievements) ? exp.achievements.join('\n') : (exp.achievements || '')
                                  });
                                }}
                                className="p-1.5 bg-blue-950/40 hover:bg-blue-900 border border-blue-900/60 text-blue-300 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleCollectionDelete('experience', exp._id)}
                                className="p-1.5 bg-rose-950/40 hover:bg-rose-900 border border-rose-900/60 text-rose-300 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. EDUCATION MANAGER SUB-TAB */}
              {contentSubTab === 'education' && (
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Education Form */}
                  {isOwner && (
                    <form
                      onSubmit={(e) => handleCollectionSubmit(e, 'education', editingEduId, eduForm, () => {
                        setEduForm({ degree: '', college: '', university: '', percentage: '', cgpa: '', duration: '', certificate: '' });
                        setEditingEduId(null);
                      })}
                      className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 md:col-span-1 h-fit"
                    >
                      <h4 className="font-extrabold text-sm text-white">
                        {editingEduId ? 'Edit Education record' : 'Add Education record'}
                      </h4>
                      <div className="space-y-1 text-xs">
                        <label className="text-slate-400 font-bold block">Degree / Certification</label>
                        <input
                          type="text"
                          value={eduForm.degree}
                          onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-white focus:outline-none"
                          required
                        />
                      </div>
                      <div className="space-y-1 text-xs">
                        <label className="text-slate-400 font-bold block">College / Institution</label>
                        <input
                          type="text"
                          value={eduForm.college}
                          onChange={(e) => setEduForm({ ...eduForm, college: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-white focus:outline-none"
                          required
                        />
                      </div>
                      <div className="space-y-1 text-xs">
                        <label className="text-slate-400 font-bold block">University</label>
                        <input
                          type="text"
                          value={eduForm.university}
                          onChange={(e) => setEduForm({ ...eduForm, university: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-white focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="space-y-1">
                          <label className="text-slate-400 font-bold block">Percentage (%)</label>
                          <input
                            type="number"
                            value={eduForm.percentage}
                            onChange={(e) => setEduForm({ ...eduForm, percentage: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 font-bold block">CGPA</label>
                          <input
                            type="text"
                            value={eduForm.cgpa}
                            onChange={(e) => setEduForm({ ...eduForm, cgpa: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-white focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-1 text-xs">
                        <label className="text-slate-400 font-bold block">Duration / Years</label>
                        <input
                          type="text"
                          value={eduForm.duration}
                          onChange={(e) => setEduForm({ ...eduForm, duration: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-white focus:outline-none"
                          placeholder="e.g. 2020 - 2024"
                        />
                      </div>
                      <div className="space-y-1 text-xs">
                        <label className="text-slate-400 font-bold block">Certificate File / Link</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={eduForm.certificate}
                            onChange={(e) => setEduForm({ ...eduForm, certificate: e.target.value })}
                            className="flex-1 bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-white focus:outline-none min-w-0"
                            placeholder="Link or Uploaded file path"
                          />
                          <label className="bg-slate-900 border border-slate-850 hover:border-slate-750 text-slate-400 font-bold px-3 rounded-xl cursor-pointer flex items-center justify-center whitespace-nowrap text-[10px]">
                            Upload
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e.target.files[0], (url) => {
                                setEduForm({ ...eduForm, certificate: url });
                              })}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        {editingEduId && (
                          <button
                            type="button"
                            onClick={() => {
                              setEduForm({ degree: '', college: '', university: '', percentage: '', cgpa: '', duration: '', certificate: '' });
                              setEditingEduId(null);
                            }}
                            className="flex-1 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-400 font-bold py-2.5 rounded-xl text-xs"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                        >
                          {editingEduId ? 'Update' : 'Add Education'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Education List */}
                  <div className={`${isOwner ? 'md:col-span-2' : 'md:col-span-3'} space-y-4`}>
                    <h4 className="font-extrabold text-sm text-slate-300 uppercase tracking-wider">Current Education</h4>
                    <div className="space-y-4">
                      {educations.map((edu) => (
                        <div key={edu._id} className="glass-panel p-5 rounded-2xl border border-slate-900 flex justify-between items-center text-xs">
                          <div className="space-y-1 max-w-[80%]">
                            <h5 className="font-extrabold text-white text-sm">{edu.degree}</h5>
                            <div className="text-[10px] text-slate-400">
                              <span className="font-semibold text-blue-400">{edu.college}</span> {edu.university && `| ${edu.university}`}
                            </div>
                            <div className="text-[9px] text-slate-500">
                              Duration: {edu.duration} {edu.cgpa && `| CGPA: ${edu.cgpa}`} {edu.percentage && `| Percentage: ${edu.percentage}%`}
                            </div>
                          </div>
                          {isOwner && (
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingEduId(edu._id);
                                  setEduForm({
                                    degree: edu.degree || '',
                                    college: edu.college || '',
                                    university: edu.university || '',
                                    percentage: edu.percentage || '',
                                    cgpa: edu.cgpa || '',
                                    duration: edu.duration || '',
                                    certificate: edu.certificate || ''
                                  });
                                }}
                                className="p-1.5 bg-blue-950/40 hover:bg-blue-900 border border-blue-900/60 text-blue-300 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleCollectionDelete('education', edu._id)}
                                className="p-1.5 bg-rose-950/40 hover:bg-rose-900 border border-rose-900/60 text-rose-300 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. GALLERY MANAGER SUB-TAB */}
              {contentSubTab === 'gallery' && (
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Gallery Form */}
                  {isOwner && (
                    <form
                      onSubmit={(e) => handleCollectionSubmit(e, 'gallery', editingGalId, galForm, () => {
                        setGalForm({ title: '', type: 'image', url: '', category: 'Events', description: '' });
                        setEditingGalId(null);
                      })}
                      className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 md:col-span-1 h-fit"
                    >
                      <h4 className="font-extrabold text-sm text-white">
                        {editingGalId ? 'Edit Gallery Item' : 'Add Gallery Item'}
                      </h4>
                      <div className="space-y-1 text-xs">
                        <label className="text-slate-400 font-bold block">Title</label>
                        <input
                          type="text"
                          value={galForm.title}
                          onChange={(e) => setGalForm({ ...galForm, title: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-white focus:outline-none"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="space-y-1">
                          <label className="text-slate-400 font-bold block">Type</label>
                          <select
                            value={galForm.type}
                            onChange={(e) => setGalForm({ ...galForm, type: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-slate-300 focus:outline-none"
                          >
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 font-bold block">Category</label>
                          <input
                            type="text"
                            value={galForm.category}
                            onChange={(e) => setGalForm({ ...galForm, category: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-white focus:outline-none"
                            placeholder="e.g. Events, Setup"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1 text-xs">
                        <label className="text-slate-400 font-bold block">Media File / Link</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={galForm.url}
                            onChange={(e) => setGalForm({ ...galForm, url: e.target.value })}
                            className="flex-1 bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-white focus:outline-none min-w-0"
                            placeholder="Image URL or Path"
                            required
                          />
                          <label className="bg-slate-900 border border-slate-850 hover:border-slate-750 text-slate-400 font-bold px-3 rounded-xl cursor-pointer flex items-center justify-center whitespace-nowrap text-[10px]">
                            Upload
                            <input
                              type="file"
                              accept="image/*,video/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e.target.files[0], (url) => {
                                setGalForm({ ...galForm, url: url });
                              })}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="space-y-1 text-xs">
                        <label className="text-slate-400 font-bold block">Description</label>
                        <textarea
                          rows={3}
                          value={galForm.description}
                          onChange={(e) => setGalForm({ ...galForm, description: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-white focus:outline-none resize-none"
                          placeholder="Short description of the event or item..."
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        {editingGalId && (
                          <button
                            type="button"
                            onClick={() => {
                              setGalForm({ title: '', type: 'image', url: '', category: 'Events', description: '' });
                              setEditingGalId(null);
                            }}
                            className="flex-1 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-400 font-bold py-2.5 rounded-xl text-xs"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                        >
                          {editingGalId ? 'Update' : 'Add Item'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Gallery Items List */}
                  <div className={`${isOwner ? 'md:col-span-2' : 'md:col-span-3'} space-y-4`}>
                    <h4 className="font-extrabold text-sm text-slate-300 uppercase tracking-wider">Current Gallery Items</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {gallery.map((g) => (
                        <div key={g._id} className="glass-panel p-4 rounded-2xl border border-slate-900 flex justify-between items-center text-xs gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-800">
                              <img src={g.url} alt={g.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <h5 className="font-extrabold text-white truncate">{g.title}</h5>
                              <span className="text-[8px] bg-slate-950 border border-slate-850 text-slate-400 px-1.5 py-0.5 rounded font-semibold">{g.category}</span>
                            </div>
                          </div>
                          {isOwner && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  setEditingGalId(g._id);
                                  setGalForm({
                                    title: g.title || '',
                                    type: g.type || 'image',
                                    url: g.url || '',
                                    category: g.category || 'Events',
                                    description: g.description || ''
                                  });
                                }}
                                className="p-1.5 bg-blue-950/40 hover:bg-blue-900 border border-blue-900/60 text-blue-300 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit3 className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleCollectionDelete('gallery', g._id)}
                                className="p-1.5 bg-rose-950/40 hover:bg-rose-900 border border-rose-900/60 text-rose-300 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. CERTIFICATES MANAGER SUB-TAB */}
              {contentSubTab === 'certificates' && (
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Certificate form */}
                  {isOwner && (
                    <form
                      onSubmit={(e) => handleCollectionSubmit(e, 'certificates', editingCertId, certForm, () => {
                        setCertForm({ title: '', organization: '', date: '', verificationLink: '', image: '' });
                        setEditingCertId(null);
                      })}
                      className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 md:col-span-1 h-fit"
                    >
                      <h4 className="font-extrabold text-sm text-white">
                        {editingCertId ? 'Edit Certificate' : 'Add Certificate'}
                      </h4>
                      <div className="space-y-1 text-xs">
                        <label className="text-slate-400 font-bold block">Certification Title</label>
                        <input
                          type="text"
                          value={certForm.title}
                          onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-white focus:outline-none"
                          placeholder="e.g. AWS Solutions Architect"
                          required
                        />
                      </div>
                      <div className="space-y-1 text-xs">
                        <label className="text-slate-400 font-bold block">Issuing Organization</label>
                        <input
                          type="text"
                          value={certForm.organization}
                          onChange={(e) => setCertForm({ ...certForm, organization: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-white focus:outline-none"
                          placeholder="e.g. Amazon Web Services"
                          required
                        />
                      </div>
                      <div className="space-y-1 text-xs">
                        <label className="text-slate-400 font-bold block">Date Issued (or Year)</label>
                        <input
                          type="text"
                          value={certForm.date}
                          onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-white focus:outline-none"
                          placeholder="e.g. 2025"
                        />
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <label className="text-slate-400 font-bold block">Certificate Image URL / Badge</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={certForm.image}
                            onChange={(e) => setCertForm({ ...certForm, image: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-white focus:outline-none text-[10px] font-mono"
                            placeholder="/badge.png or http://..."
                          />
                          <input
                            type="file"
                            id="cert-file-upload"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              await handleFileUpload(file, (url) => {
                                setCertForm({ ...certForm, image: url });
                              });
                            }}
                          />
                          <label
                            htmlFor="cert-file-upload"
                            className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold py-2.5 px-3.5 rounded-xl cursor-pointer flex items-center justify-center shrink-0"
                          >
                            Upload
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2 text-xs">
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl flex-1 cursor-pointer"
                        >
                          {editingCertId ? 'Save Changes' : 'Add Certificate'}
                        </button>
                        {editingCertId && (
                          <button
                            type="button"
                            onClick={() => {
                              setCertForm({ title: '', organization: '', date: '', verificationLink: '', image: '' });
                              setEditingCertId(null);
                            }}
                            className="bg-slate-900 border border-slate-800 text-slate-400 py-2.5 px-4 rounded-xl cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  )}

                  {/* Certificates List */}
                  <div className={`glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 ${isOwner ? 'md:col-span-2' : 'md:col-span-3'}`}>
                    <h4 className="font-extrabold text-sm text-white">Certificates Directory ({certificates.length})</h4>
                    <div className="grid sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                      {certificates.map((c) => (
                        <div key={c._id} className="bg-slate-950/60 border border-slate-900 p-4 rounded-2xl flex items-start gap-4">
                          <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                            {c.image && !c.image.toLowerCase().endsWith('.pdf') ? (
                              <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                            ) : c.image && c.image.toLowerCase().endsWith('.pdf') ? (
                              <FileText className="h-6 w-6 text-blue-400" />
                            ) : (
                              <Award className="h-6 w-6 text-slate-650" />
                            )}
                          </div>
                          <div className="space-y-1 min-w-0 flex-1">
                            <h5 className="font-extrabold text-xs text-white truncate">{c.title}</h5>
                            <p className="text-[10px] text-blue-400 font-semibold">{c.organization}</p>
                            {c.date && <p className="text-[9px] text-slate-500 font-semibold">{c.date}</p>}
                          </div>
                          {isOwner && (
                            <div className="flex flex-col gap-1.5 shrink-0">
                              <button
                                onClick={() => {
                                  setEditingCertId(c._id);
                                  setCertForm({
                                    title: c.title || '',
                                    organization: c.organization || '',
                                    date: c.date || '',
                                    verificationLink: c.verificationLink || '',
                                    image: c.image || ''
                                  });
                                }}
                                className="p-1.5 bg-blue-950/40 hover:bg-blue-900 border border-blue-900/60 text-blue-300 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit3 className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleCollectionDelete('certificates', c._id)}
                                className="p-1.5 bg-rose-950/40 hover:bg-rose-900 border border-rose-900/60 text-rose-300 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SECURITY */}
          {activeTab === 'security' && (
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-white border-b border-slate-900 pb-2">Portfolio Verification Token</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  This unique verification token acts as your authorization key for project writes. Copy it and keep it secure.
                </p>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 flex justify-between items-center gap-4">
                  <code className="text-xs font-bold text-amber-400 font-mono select-all">
                    {user.portfolioToken || 'No token generated'}
                  </code>
                  {user.portfolioToken && (
                    <button
                      onClick={() => copyToClipboard(user.portfolioToken)}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      {isCopied ? 'Copied!' : <Copy className="h-4 w-4" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Regeneration form */}
              {isOwner && (
                <form onSubmit={handleRegenToken} className="space-y-4 border-t border-slate-900 pt-6">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Regenerate Token Code</span>
                  
                  {regenMsg && (
                    <div className="p-3 bg-emerald-950/40 text-emerald-400 border border-emerald-900 rounded-xl text-xs font-semibold font-mono">
                      {regenMsg}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4 text-xs items-end">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-400 uppercase block">Account Password</label>
                      <input
                        type="password"
                        value={regenPassword}
                        onChange={(e) => setRegenPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 px-4"
                        placeholder="Verify your password"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-rose-950 hover:bg-rose-900 border border-rose-900/60 text-rose-300 py-3 px-8 rounded-xl font-bold transition-all text-xs"
                    >
                      Regenerate Token
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

        </div>

      </div>

      {/* VERIFY TOKEN MODAL WINDOW */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-6">
          <form onSubmit={handleVerifyProjectToken} className="glass-panel p-6 max-w-sm w-full rounded-3xl border border-slate-800 shadow-2xl space-y-4 animate-premium-float">
            <div className="space-y-1.5 text-center">
              <ShieldCheck className="h-8 w-8 text-blue-400 mx-auto" />
              <h4 className="font-extrabold text-sm text-white uppercase">Dual-Key Project Authorization</h4>
              <p className="text-[10px] text-slate-500 font-semibold">Enter your secure Portfolio Token and the email verification code sent to your admin inbox</p>
            </div>

            {tokenError && (
              <p className="p-2 bg-rose-950/40 text-rose-300 border border-rose-900 rounded-xl text-[10px] font-bold text-center">
                {tokenError}
              </p>
            )}

            {tokenWarning && (
              <div className="p-3 bg-amber-950/40 border border-amber-900 text-amber-300 rounded-xl text-[10px] space-y-1">
                <p className="font-bold text-center">⚠️ {tokenWarning}</p>
                {devOtp && <p className="text-xs font-extrabold font-mono tracking-widest bg-slate-950/80 p-2 rounded text-center text-blue-400">{devOtp}</p>}
              </div>
            )}

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Portfolio Token</label>
                <input
                  type="password"
                  value={verificationToken}
                  onChange={(e) => setVerificationToken(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl py-2.5 px-4 text-xs font-mono text-center tracking-widest text-white focus:outline-none"
                  placeholder="PX-XXXX-XXXX-XXXX"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Verification Code (OTP)</label>
                <input
                  type="text"
                  value={emailVerificationOtp}
                  onChange={(e) => setEmailVerificationOtp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl py-2.5 px-4 text-xs font-mono text-center tracking-widest text-white focus:outline-none"
                  placeholder="------"
                  maxLength={6}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 text-xs pt-2">
              <button
                type="button"
                onClick={() => { setShowTokenModal(false); setVerificationToken(''); setEmailVerificationOtp(''); }}
                className="bg-slate-900 border border-slate-850 text-slate-400 py-2 px-4 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-xl"
              >
                Verify & Unlock
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default DashboardPage;
