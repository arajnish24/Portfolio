import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Share2,
  BookmarkCheck,
  Bookmark,
  Eye,
  ThumbsUp,
  ExternalLink,
} from "lucide-react";

const ProjectsSection = ({
  projects,
  likedProjects,
  bookmarkedProjects,
  handleLikeProject,
  toggleBookmark,
  onShare,
}) => {
  // Filtering & Sorting states
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Project filtering & sorting logic
  const filteredAndSortedProjects = projects
    .filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.technologies?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesDifficulty =
        difficulty === "All" || p.difficulty === difficulty;
      return matchesSearch && matchesDifficulty;
    })
    .sort((a, b) => {
      if (sortBy === "likes") {
        return (b.likes || 0) - (a.likes || 0);
      }
      if (sortBy === "views") {
        return (b.views || 0) - (a.views || 0);
      }
      // default: newest
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  return (
    <section
      id="projects"
      className="container mx-auto px-6 max-w-7xl space-y-10"
    >
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
          Featured <span className="text-premium-gradient">Projects</span>
        </h2>
        <p className="text-xs text-slate-500 font-sans">
          Filter and search verified project credentials
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="space-y-4 bg-slate-900/20 p-5 rounded-3xl border border-slate-900">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none text-white font-sans"
              placeholder="Search project..."
            />
            <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-600" />
          </div>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs focus:outline-none text-slate-300 font-sans"
          >
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-3 text-xs focus:outline-none text-slate-300 font-sans"
          >
            <option value="newest">Sort: Newest</option>
            <option value="likes">Sort: Likes</option>
            <option value="views">Sort: Views</option>
          </select>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {filteredAndSortedProjects.map((p) => {
          const isBookmarked = bookmarkedProjects.includes(p._id);
          const isLiked = likedProjects.includes(p._id);

          return (
            <div
              key={p._id}
              className="glass-panel rounded-3xl overflow-hidden flex flex-col justify-between hover:scale-[1.01] hover:border-slate-800 transition-all border border-slate-900 shadow-xl relative"
            >
              <div>
                <div className="h-48 md:h-56 w-full relative overflow-hidden">
                  <Link to={`/projects/${p._id}`}>
                    <img
                      src={
                        p.images?.[0] ||
                        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600"
                      }
                      alt={p.title}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-all"
                    />
                  </Link>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => onShare(p)}
                      className="p-2 bg-slate-950/80 backdrop-blur border border-slate-800/60 rounded-xl text-slate-400 hover:text-white cursor-pointer"
                      title="Share Project"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => toggleBookmark(p._id)}
                      className="p-2 bg-slate-950/80 backdrop-blur border border-slate-800/60 rounded-xl text-slate-400 hover:text-white cursor-pointer"
                      title={
                        isBookmarked ? "Remove Bookmark" : "Bookmark Project"
                      }
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="h-3.5 w-3.5 text-blue-400" />
                      ) : (
                        <Bookmark className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-blue-400 uppercase tracking-widest font-mono font-bold">
                      ✔ VERIFIED OWNER GATED
                    </span>
                    <span className="text-[9px] bg-slate-950 border border-slate-900 text-slate-500 px-2 py-0.5 rounded font-bold font-sans">
                      {p.difficulty}
                    </span>
                  </div>

                  <Link to={`/projects/${p._id}`}>
                    <h4 className="font-extrabold text-lg text-white leading-tight hover:text-blue-400 transition-colors cursor-pointer font-sans">
                      {p.title}
                    </h4>
                  </Link>
                  <p className="text-slate-400 text-xs leading-relaxed font-light font-sans">
                    {p.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {p.technologies?.map((tech) => (
                      <span
                        key={tech}
                        className="bg-slate-950 border border-slate-900/80 px-2 py-0.5 rounded text-[9px] text-slate-400 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 mt-4 border-t border-slate-900/80 flex items-center justify-between text-xs font-sans">
                <div className="flex gap-4 text-[10px] text-slate-500 font-bold">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> {p.views || 0}
                  </span>
                  <button
                    onClick={() => handleLikeProject(p._id)}
                    disabled={isLiked}
                    className={`flex items-center gap-1 hover:text-blue-400 transition-colors ${
                      isLiked
                        ? "text-blue-500 hover:text-blue-500 font-extrabold"
                        : "cursor-pointer font-bold"
                    }`}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" /> {p.likes || 0}
                  </button>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/projects/${p._id}`}
                    className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg font-bold text-[10px] flex items-center justify-center cursor-pointer"
                  >
                    Showcase
                  </Link>
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-slate-950 border border-slate-900 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {p.live && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 bg-blue-600/90 text-white rounded-lg font-bold hover:bg-blue-500 text-[10px] cursor-pointer"
                    >
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
  );
};

export default ProjectsSection;
