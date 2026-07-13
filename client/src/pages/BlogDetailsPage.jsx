import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  Calendar,
  Clock,
  Eye,
  ThumbsUp,
  MessageSquare,
  Send,
  User,
} from "lucide-react";

const BlogDetailsPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Comment Form States
  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    content: "",
  });
  const [commentStatus, setCommentStatus] = useState("");

  const fetchBlogDetails = () => {
    fetch(`/api/collections/blogs/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.blog) setBlog(data.blog);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBlogDetails();
  }, [slug]);

  const handleLike = () => {
    if (!blog) return;

    // Call in background, immediate local count increment for better UX
    setBlog({ ...blog, likes: (blog.likes || 0) + 1 });

    // Normally would call `POST /api/project/:id/like` or similar, stubbed or routed
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentForm.name || !commentForm.email || !commentForm.content) return;

    fetch(`/api/collections/blogs/${blog._id}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commentForm),
    })
      .then((res) => res.json())
      .then((data) => {
        setCommentStatus("Comment published successfully!");
        setCommentForm({ name: "", email: "", content: "" });
        fetchBlogDetails();
        setTimeout(() => setCommentStatus(""), 4000);
      })
      .catch((err) => console.error(err));
  };

  if (loading) {
    return (
      <div className="text-center py-24 text-xs text-slate-500">
        Loading article details...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-6 py-24 max-w-xl text-center space-y-4">
        <h3 className="text-xl font-bold">Article Not Found</h3>
        <Link to="/blogs" className="text-blue-400 font-bold hover:underline">
          Back to articles list
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl space-y-8 bg-grid-mesh">
      <Link
        to="/blogs"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-bold transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back to Articles</span>
      </Link>

      {/* Article Cover Image */}
      <div className="h-64 md:h-96 w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <img
          src={
            blog.coverImage ||
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900"
          }
          alt={blog.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title & Metadata */}
      <div className="space-y-4">
        <span className="bg-blue-950 text-blue-400 border border-blue-900/60 text-xs font-bold px-3 py-1 rounded-full">
          {blog.category}
        </span>
        <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
          {blog.title}
        </h2>

        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 font-semibold border-b border-slate-900 pb-6">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />{" "}
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {blog.readingTime || "5 min read"}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" /> {blog.views || 0} views
          </span>
          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-slate-500 hover:text-rose-400 transition-colors"
          >
            <ThumbsUp className="h-3.5 w-3.5 text-rose-500" /> {blog.likes || 0}{" "}
            likes
          </button>
        </div>
      </div>

      {/* Article Content */}
      <article className="prose prose-invert max-w-none text-xs md:text-sm text-slate-300 leading-relaxed font-light space-y-6">
        {blog.content.split("\n").map((paragraph, index) => {
          if (paragraph.startsWith("# ")) {
            return (
              <h2
                key={index}
                className="text-xl md:text-2xl font-extrabold text-white mt-8 mb-4"
              >
                {paragraph.replace("# ", "")}
              </h2>
            );
          }
          if (paragraph.startsWith("## ")) {
            return (
              <h3
                key={index}
                className="text-lg font-bold text-slate-200 mt-6 mb-3"
              >
                {paragraph.replace("## ", "")}
              </h3>
            );
          }
          if (paragraph.startsWith("```")) {
            return null; // Skip raw code tags for simplicity
          }
          return (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          );
        })}
      </article>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 border-t border-b border-slate-900 py-6">
        {blog.tags?.map((tag) => (
          <span
            key={tag}
            className="bg-slate-950 border border-slate-900/80 text-[10px] text-slate-400 font-bold px-3 py-1 rounded-lg"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Comments Section */}
      <div className="space-y-8 pt-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-400" />
          <span>Comments ({blog.comments?.length || 0})</span>
        </h3>

        {/* Comment list */}
        <div className="space-y-4">
          {blog.comments?.map((comment) => (
            <div
              key={comment._id}
              className="glass-panel p-5 rounded-2xl border border-slate-900 flex gap-3"
            >
              <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-slate-600" />
              </div>
              <div className="space-y-1.5 flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{comment.name}</span>
                  <span className="text-[10px] text-slate-600 font-semibold">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed font-light">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
          {(!blog.comments || blog.comments.length === 0) && (
            <p className="text-xs text-slate-600 italic">
              No comments posted yet. Start the conversation!
            </p>
          )}
        </div>

        {/* Add comment Form */}
        <form
          onSubmit={handleCommentSubmit}
          className="glass-panel p-6 rounded-3xl border border-slate-850 space-y-4"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Post a Comment
          </span>

          {commentStatus && (
            <div className="p-3 bg-emerald-950/40 text-emerald-400 border border-emerald-900 rounded-xl text-xs font-semibold">
              {commentStatus}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              value={commentForm.name}
              onChange={(e) =>
                setCommentForm({ ...commentForm, name: e.target.value })
              }
              className="bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl py-3 px-4 text-xs focus:outline-none"
              placeholder="Your display name"
              required
            />
            <input
              type="email"
              value={commentForm.email}
              onChange={(e) =>
                setCommentForm({ ...commentForm, email: e.target.value })
              }
              className="bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl py-3 px-4 text-xs focus:outline-none"
              placeholder="Your email address"
              required
            />
          </div>
          <textarea
            rows={3}
            value={commentForm.content}
            onChange={(e) =>
              setCommentForm({ ...commentForm, content: e.target.value })
            }
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl py-3 px-4 text-xs focus:outline-none resize-none"
            placeholder="Type your comment here..."
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10"
            >
              <span>Submit Comment</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
