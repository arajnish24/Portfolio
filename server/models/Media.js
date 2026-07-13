import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    data: { type: String, required: true }, // base64-encoded string of the image data for MongoDB storage
    cloudinaryUrl: { type: String, default: "" },
    localUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Media", MediaSchema);
