import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    // Setting options to ensure stable connection
    const conn = await mongoose.connect(uri, {
      dbName: "shilpokotha", // This FORCES Mongoose to use your database name
    });

    // --- DEBUGGING LOGS ---
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📂 Active Database: ${conn.connection.name}`);

    // Optional: Check if the 'orders' collection exists (just for debugging)
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(
      `📊 Collections found: ${collections.map((c) => c.name).join(", ")}`
    );
  } catch (error) {
    console.error(`❌ Database Error: ${error.message}`);
    // Check if the error is due to an IP whitelist issue (common in Atlas)
    if (error.message.includes("DS012")) {
      console.error("💡 Tip: Check your MongoDB Atlas IP Whitelist!");
    }
    process.exit(1);
  }
};

export default connectDB;
