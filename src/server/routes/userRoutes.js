import express from "express";
import { getAllUsers, deleteUser, updateUserStatus } from "../controllers/userController.js";

const router = express.Router();

// This handles: GET http://localhost:5000/api/users
router.get("/", getAllUsers); 

// This handles: DELETE http://localhost:5000/api/users/:id
router.delete("/:id", deleteUser);

// This handles: PUT http://localhost:5000/api/users/:id/status
router.put("/:id/status", updateUserStatus);

export default router;