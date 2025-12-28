import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "customer", "super-admin", "editor"],
      default: "customer",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Banned"],
      default: "Active",
    },
    avatar: { type: String, default: "" }, // Added for My Account compatibility
    phone: { type: String, default: "" },  // Added for My Account compatibility
    lastLogin: { type: Date },
  },
  {
    timestamps: true, // Provides createdAt (Joined Date)
    toJSON: { virtuals: true }, // Ensures virtuals show up in the API response
    toObject: { virtuals: true }
  }
);

// Helpful virtual for the Admin Table
userSchema.virtual("joinedDate").get(function () {
  return this.createdAt;
});

// FORCE COLLECTION NAME: The 3rd argument 'users' ensures it looks in the correct collection
export default mongoose.model("User", userSchema, "users");