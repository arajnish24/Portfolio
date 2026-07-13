import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [{ type: String }],
    github: { type: String, default: "" },
    live: { type: String, default: "" },
    playStore: { type: String, default: "" },
    appStore: { type: String, default: "" },
    images: [{ type: String }],
    video: { type: String, default: "" },
    features: [{ type: String }],
    duration: { type: String, default: "" },
    status: {
      type: String,
      enum: ["published", "draft", "scheduled", "archived"],
      default: "published",
    },
    teamSize: { type: Number, default: 1 },
    clientName: { type: String, default: "Personal Project" },
    tags: [{ type: String }],
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Intermediate",
    },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: String }], // Array of IP addresses or visitor emails to prevent duplicate likes
    downloads: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },
    isHidden: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("Project", ProjectSchema);
