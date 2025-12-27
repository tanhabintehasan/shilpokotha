import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "./models/User.js";

// Setup path for ES Modules to ensure .env is found
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const seedAdmin = async () => {
  try {
    // 1. Connect using the URI from your .env
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("⏳ Connecting to database to seed admin...");

    // 2. Check if the admin email already exists
    const adminExists = await User.findOne({
      email: "tanhabintehasan03@gmail.com", // Your requested email
    });

    if (adminExists) {
      console.log(
        "⚠️ This Admin already exists! You can go to the login page now."
      );
      process.exit();
    }

    // 3. Creating the Admin with your specified credentials
    const admin = new User({
      name: "Tanha Binte Hasan",
      email: "tanhabintehasan03@gmail.com",
      password: "@Tanha.900t", // Your requested password
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin 'Tanha Binte Hasan' created successfully!");
    console.log("📧 Email: tanhabintehasan03@gmail.com");
    console.log("🔑 Password: @Tanha.900t");

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
