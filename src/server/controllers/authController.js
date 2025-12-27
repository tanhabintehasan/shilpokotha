import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// --- CUSTOMER LOGIN ---
export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });

    // 2. Validate user and compare password
    if (user && (await bcrypt.compare(password, user.password))) {
      // 3. Generate Token (30 days for customers)
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      // 4. Return data matching your Signin/index.jsx
      return res.status(200).json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      // Exit early if credentials fail
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("User Login Error:", error.message);
    return res.status(500).json({ message: "Server Error during login" });
  }
};

// --- CUSTOMER SIGNUP ---
export const userSignup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "customer", // Default role for standard signup
    });

    if (user) {
      return res.status(201).json({
        message: "User registered successfully",
        _id: user._id,
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("User Signup Error:", error.message);
    return res.status(500).json({ message: "Registration failed on server" });
  }
};
