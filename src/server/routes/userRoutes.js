import express from "express";
const router = express.Router();

// FIX: Point to the actual filename 'userGuard.js'
import { protectUser } from "../middleware/userGuard.js";
import { userLogin, userSignup } from "../controllers/authController.js";

router.post("/login", userLogin);
router.post("/signup", userSignup);

export default router;
