import express from "express";
// Import using curly braces for Named Exports
import { protectUser } from "../middleware/userGuard.js";
import { userLogin, userSignup } from "../controllers/authController.js";

const router = express.Router();

// Public routes
router.post("/login", userLogin);
router.post("/signup", userSignup);

// Example of how to use the named export guard on a route
// router.get("/me", protectUser, getMe);

export default router;
