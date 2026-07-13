import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// Section Components
import HeroSection from "../components/portfolio/HeroSection";
import StatsSection from "../components/portfolio/StatsSection";
import AboutSection from "../components/portfolio/AboutSection";
import SkillsSection from "../components/portfolio/SkillsSection";
import CertificationsSection from "../components/portfolio/CertificationsSection";
import ProjectsSection from "../components/portfolio/ProjectsSection";
import GallerySection from "../components/portfolio/GallerySection";
import ContactSection from "../components/portfolio/ContactSection";
import Footer from "../components/portfolio/Footer";
import ShareModal from "../components/portfolio/ShareModal";

const PublicPortfolioPage = () => {
  const { user, token } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interactive visitor states
  const [likedProjects, setLikedProjects] = useState([]);
  const [bookmarkedProjects, setBookmarkedProjects] = useState([]);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [contactStatus, setContactStatus] = useState("");
  const [contactError, setContactError] = useState("");

  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

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
          github: "https://github.com/arajnish24",
        },
        themeSettings: {
          theme: "dark",
          accentColor: "#3b82f6",
          fontFamily: "Inter",
          layout: "glass",
          animationsEnabled: true,
        },
      },
      skills: [
        { name: "React.js", category: "Frontend", level: 95 },
        { name: "Node.js & Express", category: "Backend", level: 90 },
        { name: "MongoDB & Mongoose", category: "Database", level: 88 },
        { name: "Docker & Kubernetes", category: "DevOps", level: 82 },
        { name: "TypeScript", category: "Programming Languages", level: 85 },
        { name: "Tailwind CSS", category: "Tools", level: 95 },
      ],
      experiences: [
        {
          company: "Software Services & Solutions",
          position: "Intern",
          location: "Patna, Bihar",
          joiningDate: "01/07/2026",
          leavingDate: "Present",
          responsibilities: ["MERN Stack Developer"],
        },
      ],
      educations: [
        {
          degree: "B.Tech (Computer Science & Engineering)",
          college: "Teerthanker Mahaveer University",
          duration: "2023 - 2027",
          cgpa: 7.29,
        },
        {
          degree: "Intermediate",
          college: "High School, Malaur",
          duration: "2021 - 2023",
        },
        {
          degree: "Matriculation",
          college: "The Divine Public School, Bikramganj, Rohtas",
          completedIn: "2021",
        },
      ],
      certificates: [
        {
          _id: "c_mern",
          title: "Full Stack Web Development( MERN Stack)",
          organization: "Apna College",
          date: "2025",
        },
      ],
      blogs: [
        {
          _id: "b_1",
          title: "Securing MERN Stack Apps in Production",
          slug: "securing-mern-stack",
          category: "Security",
          views: 110,
          likes: 18,
          readingTime: "4 min read",
          content: "Security is paramount in web development...",
          createdAt: new Date().toISOString(),
        },
      ],
      gallery: [
        {
          title: "Speaking at WebConf 2025",
          type: "image",
          url: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=600",
          category: "Events",
        },
      ],
    };
  };

  const fetchPortfolioData = () => {
    setLoading(true);
    fetch("/api/portfolio/owner")
      .then(async (res) => {
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.message || "Failed to fetch");
        setData(resData);
      })
      .catch((err) => {
        console.warn(
          "Backend connection failed, running client static fallback mode."
        );
        setData(getFallbackData());
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPortfolioData();
    // Load local bookmarks
    const savedBookmarks = JSON.parse(
      localStorage.getItem("bookmarked_projects") || "[]"
    );
    setBookmarkedProjects(savedBookmarks);

    // Load local likes
    const localLikes = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("liked_")) {
        localLikes.push(key.replace("liked_", ""));
      }
    }
    setLikedProjects(localLikes);
  }, []);

  const handleLikeProject = (projectId) => {
    if (likedProjects.includes(projectId)) return;

    fetch(`/api/project/${projectId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to like project");
        return res.json();
      })
      .then((resData) => {
        const updatedProjects = data.projects.map((p) => {
          if (p._id === projectId) {
            return { ...p, likes: resData.likes };
          }
          return p;
        });
        setData({ ...data, projects: updatedProjects });
        localStorage.setItem(`liked_${projectId}`, "true");
        setLikedProjects([...likedProjects, projectId]);
      })
      .catch((err) => {
        console.error(err);
        alert("Could not record your like. Please try again.");
      });
  };

  const handleTrackDownload = () => {
    fetch("/api/portfolio/track-download", { method: "POST" }).catch((err) =>
      console.warn(err)
    );
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;

    setContactStatus("submitting");
    setContactError("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      let data = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(
          text
            ? text.slice(0, 100) + "..."
            : `Server error status ${res.status}`
        );
      }

      if (!res.ok) throw new Error(data.message || "Submission failed");

      setContactStatus("success");
      setContactForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setTimeout(() => setContactStatus(""), 4000);
    } catch (err) {
      setContactStatus("error");
      setContactError(err.message);
    }
  };

  const toggleBookmark = (projectId) => {
    let updated;
    if (bookmarkedProjects.includes(projectId)) {
      updated = bookmarkedProjects.filter((id) => id !== projectId);
    } else {
      updated = [...bookmarkedProjects, projectId];
    }
    setBookmarkedProjects(updated);
    localStorage.setItem("bookmarked_projects", JSON.stringify(updated));
  };

  const handleCopyLink = (projectId) => {
    const url = `${window.location.origin}/projects/${projectId}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy link: ", err));
  };

  if (loading)
    return (
      <div className="text-center py-24 text-xs text-slate-500">
        Loading portfolio website...
      </div>
    );
  if (!data)
    return (
      <div className="text-center py-24 text-xs text-slate-500">
        Portfolio Owner Profile not found.
      </div>
    );

  const {
    owner,
    skills,
    experiences,
    educations,
    certificates,
    gallery,
  } = data;
  const projects =
    data.projects && data.projects.length > 0
      ? data.projects
      : [
          {
            _id: "p_portfolio",
            title: "Portfolio Platform",
            description:
              "A production-ready secure MERN portfolio system with dual-key token restrictions, resilient database failovers, and embedded recruiter analytics trackers.",
            technologies: [
              "React",
              "Express.js",
              "Node.js",
              "MongoDB",
              "Tailwind CSS",
            ],
            github: "https://github.com/arajnish24/portfolio",
            live: "https://portfolio-demo.com",
            images: [
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600",
            ],
            features: [
              "Token verification",
              "Dynamic metrics dashboard",
              "Email alerts Integration",
              "Responsive grid layout",
            ],
            duration: "3 months",
            status: "published",
            teamSize: 1,
            clientName: "Open Source Community",
            tags: ["Full Stack", "Identity Management", "Security"],
            difficulty: "Advanced",
            views: 128,
            likes: 45,
          },
        ];

  return (
    <div className="space-y-24 bg-grid-mesh pb-20">
      <HeroSection
        owner={owner}
        handleTrackDownload={handleTrackDownload}
      />

      <StatsSection
        projectsCount={projects.length}
      />

      <AboutSection
        experiences={experiences}
        educations={educations}
      />

      <SkillsSection
        skills={skills}
      />

      <CertificationsSection
        certificates={certificates}
      />

      <ProjectsSection
        projects={projects}
        likedProjects={likedProjects}
        bookmarkedProjects={bookmarkedProjects}
        handleLikeProject={handleLikeProject}
        toggleBookmark={toggleBookmark}
        onShare={setSharingProject}
      />

      <GallerySection
        gallery={gallery}
      />

      <ContactSection
        contactForm={contactForm}
        setContactForm={setContactForm}
        contactStatus={contactStatus}
        contactError={contactError}
        handleContactSubmit={handleContactSubmit}
      />

      <Footer
        newsletterEmail={newsletterEmail}
        setNewsletterEmail={setNewsletterEmail}
        newsletterSuccess={newsletterSuccess}
        setNewsletterSuccess={setNewsletterSuccess}
      />

      <ShareModal
        sharingProject={sharingProject}
        setSharingProject={setSharingProject}
        copied={copied}
        handleCopyLink={handleCopyLink}
      />
    </div>
  );
};

export default PublicPortfolioPage;
