import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "customer", "super-admin", "editor"], // Expanded to match your UI
      default: "customer",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Banned"],
      default: "Active", // New users start as Active
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true, // This automatically provides 'createdAt' (Joined Date) and 'updatedAt'
  }
);

// Helpful for the Admin Table to see how long ago a user joined
userSchema.virtual("joinedDate").get(function () {
  return this.createdAt;
});

export default mongoose.model("User", userSchema);
