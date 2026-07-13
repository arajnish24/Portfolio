import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    degree: { type: String, required: true },
    college: { type: String, required: true },
    university: { type: String, default: "" },
    percentage: { type: Number },
    cgpa: { type: Number },
    duration: { type: String, default: "" }, // E.g., '2018 - 2022'
    certificate: { type: String, default: "" }, // Link to certificate image/doc
  },
  { timestamps: true },
);

export default mongoose.model("Education", EducationSchema);
