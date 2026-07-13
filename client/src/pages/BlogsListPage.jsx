import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Search,
  Eye,
  ThumbsUp,
  Calendar,
  Clock,
  ChevronRight,
} from "lucide-react";

const BlogsListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/collections/blogs")
      .then((res) => res.json())
      .then((data) => {
        if (data.blogs) setBlogs(data.blogs);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setLoading(false);
      });
  }, []);

  const categories = [
    "All",
    ...new Set(blogs.map((b) => b.category).filter(Boolean)),
  ];

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || b.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl space-y-10 bg-grid-mesh">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Articles & <span className="text-premium-gradient">Perspectives</span>
        </h2>
        <p className="text-sm text-slate-400 font-semibold leading-relaxed">
          Read my deep-dives on MERN development, cloud gateway architectures,
          identity verification tokens, and web application security pipelines.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-900/30 p-4 border border-slate-900 rounded-3xl">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500 rounded-2xl py-3 pl-10 pr-4 text-xs focus:outline-none"
            placeholder="Search articles..."
          />
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-600" />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${category === cat ? "bg-blue-600 text-white" : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center text-xs text-slate-500 py-16">
          Loading articles...
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <article
              key={blog._id}
              className="glass-panel rounded-3xl overflow-hidden flex flex-col justify-between hover:scale-[1.02] hover:border-slate-700 transition-all group"
            >
              <div>
                <div className="h-48 w-full relative">
                  <img
                    src={
                      blog.coverImage ||
                      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600"
                    }
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-blue-950/80 backdrop-blur text-blue-400 px-3 py-1 rounded-lg border border-blue-900/60 text-[10px] font-bold">
                    {blog.category || "General"}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />{" "}
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />{" "}
                      {blog.readingTime || "5 min read"}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {blog.content.replace(/[#*`]/g, "")}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-900/60 mt-4 flex items-center justify-between">
                <div className="flex gap-4 text-[10px] text-slate-500 font-bold">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> {blog.views || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3.5 w-3.5" /> {blog.likes || 0}
                  </span>
                </div>
                <Link
                  to={`/blogs/${blog.slug}`}
                  className="text-xs text-blue-400 font-bold flex items-center gap-1 hover:text-blue-300"
                >
                  <span>Read Article</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
          {filteredBlogs.length === 0 && (
            <div className="col-span-3 text-center py-16 text-slate-500 text-xs">
              No matching articles found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogsListPage;
