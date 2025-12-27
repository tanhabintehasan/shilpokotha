import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });

    // 2. Check if user exists and is an admin
    if (!user || !(user.role === "admin" || user.isAdmin === true)) {
      return res.status(403).json({
        message: "Access Denied: Not an Authorized Admin",
      });
    }

    // 3. Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Admin Password" });
    }

    // 4. Generate Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. Success Response
    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: true,
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error.message);
    return res.status(500).json({ message: "Server Error during admin login" });
  }
};
