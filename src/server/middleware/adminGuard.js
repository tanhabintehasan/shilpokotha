import jwt from "jsonwebtoken";
import User from "../models/User.js";

// NAMED EXPORT: Standardized for your route imports
export const protectAdmin = async (req, res, next) => {
  let token;

  // 1. Extract Token from Headers (Bearer) or Cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // 2. Early Exit: If no token is provided
  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no admin token found" });
  }

  try {
    // 3. Verify the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find User and check privileges
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    // 5. Strict Admin Check
    // Checks both 'role' field and 'isAdmin' boolean for safety
    if (user.role === "admin" || user.isAdmin === true) {
      req.user = user;
      return next(); // Authorization successful
    } else {
      return res
        .status(403)
        .json({ message: "Access denied: Admin privileges required" });
    }
  } catch (error) {
    console.error("Admin Auth Guard Error:", error.message);

    // 6. Token failure (Expired or Tampered)
    return res
      .status(401)
      .json({ message: "Not authorized, token invalid or expired" });
  }
};
