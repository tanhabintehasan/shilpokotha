import jwt from "jsonwebtoken";
import User from "../models/User.js";

// NAMED EXPORT: Ensure 'export const' is used
export const protectUser = async (req, res, next) => {
  let token;

  // 1. Extract Token from Headers or Cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // 2. Stop if no token exists
  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }

  try {
    // 3. Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Validate Decoded ID and Fetch User
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res
        .status(404)
        .json({ message: "User not found or account deleted" });
    }

    // 5. Success - Move to next middleware/controller
    return next();
  } catch (error) {
    console.error("User Auth Error:", error.message);

    // Optional: Clear corrupted cookie
    if (req.cookies && req.cookies.token) {
      res.clearCookie("token");
    }

    return res
      .status(401)
      .json({ message: "Not authorized, token expired or invalid" });
  }
};
