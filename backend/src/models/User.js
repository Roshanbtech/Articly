import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  dob: Date,
  passwordHash: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  preferences: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  profileImage: {
    publicId: { type: String },
    version: { type: String },
    originalName: { type: String },
  },
  blockedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
  isBlocked: { type: Boolean, default: false },
}, { timestamps: true });

userSchema.index({ createdAt: -1 });
userSchema.index({
  firstName: "text",
  lastName: "text",
  email: "text",
  phone: "text",
});

export default mongoose.model("User", userSchema);
