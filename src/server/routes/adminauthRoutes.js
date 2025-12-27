import express from "express";
const router = express.Router();

// NAMED IMPORT: Wrapped in curly braces
import { protectAdmin } from "../middleware/adminGuard.js";
import { adminLogin } from "../controllers/adminauthController.js";

// Admin Login (Public)
router.post("/login", adminLogin);

// Example of a Protected Admin Route
// router.get("/dashboard", protectAdmin, getAdminStats);

export default router;
