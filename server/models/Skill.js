import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Frontend",
        "Backend",
        "Database",
        "DevOps",
        "Programming Languages",
        "Soft Skills",
        "Frameworks",
        "Libraries",
        "Tools",
      ],
      default: "Frontend",
    },
    level: { type: Number, min: 1, max: 100, default: 80 },
  },
  { timestamps: true },
);

export default mongoose.model("Skill", SkillSchema);
