import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Owner", "Visitor"], default: "Visitor" },
    isVerified: { type: Boolean, default: false },
    emailVerifyOTP: { type: String },
    emailVerifyOTPExpires: { type: Date },
    resetPasswordOTP: { type: String },
    resetPasswordOTPExpires: { type: Date },

    // Security Token (Encrypted/Encoded string, e.g. PX-8453-9452-ABCD)
    portfolioToken: { type: String },
    tokenRegenOTP: { type: String },
    tokenRegenOTPExpires: { type: Date },

    // Portfolio details
    profession: { type: String, default: "" },
    bio: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    location: { type: String, default: "" },
    contactDetails: {
      phone: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
      telegram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
    },

    // SEO settings
    seo: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      keywords: { type: String, default: "" },
      ogImage: { type: String, default: "" },
    },

    // Appearance settings
    themeSettings: {
      theme: { type: String, default: "dark" }, // dark, light, system
      accentColor: { type: String, default: "#3b82f6" }, // hex / class
      fontFamily: { type: String, default: "Inter" },
      layout: { type: String, default: "standard" }, // standard, glass, neo
      animationsEnabled: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", UserSchema);
