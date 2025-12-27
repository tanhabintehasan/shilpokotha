// models/category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  parent: { type: String, default: "None" },
  icon: { type: String, default: "📦" },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// AUTO-GENERATE SLUG BEFORE SAVING
categorySchema.pre("validate", function (next) {
  if (this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, ""); // Remove all non-word chars
  }
  next();
});

export default mongoose.model("Category", categorySchema);
