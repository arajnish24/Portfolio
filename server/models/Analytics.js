import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema(
  {
    ip: { type: String, default: "Anonymous" },
    country: { type: String, default: "Unknown" },
    device: { type: String, default: "Desktop" },
    browser: { type: String, default: "Chrome" },
    os: { type: String, default: "Windows" },
    actionType: {
      type: String,
      enum: ["profile_view", "resume_download", "project_click", "blog_view"],
      default: "profile_view",
    },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.model("Analytics", AnalyticsSchema);
