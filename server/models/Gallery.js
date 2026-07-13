import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, default: "" },
    type: { type: String, enum: ["image", "video"], default: "image" },
    url: { type: String, required: true },
    category: { type: String, default: "Events" }, // E.g., Events, Awards, Hackathons
    description: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Gallery", GallerySchema);
