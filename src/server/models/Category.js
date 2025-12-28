import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  parent: { type: String, default: "None" },
  icon: { type: String, default: "📦" },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// FIX: Using async function WITHOUT the 'next' parameter
categorySchema.pre("validate", async function () {
  if (this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") 
      .replace(/[^\w-]+/g, ""); 
  }
});

export default mongoose.model("Category", categorySchema);