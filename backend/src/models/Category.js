// models/Category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      // unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    iconUrl: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

categorySchema.index({ name: 1 }, { unique: true });

categorySchema.index({ isActive: 1, createdAt: -1 });

categorySchema.index({ name: "text", description: "text" });

export default mongoose.model("Category", categorySchema);
