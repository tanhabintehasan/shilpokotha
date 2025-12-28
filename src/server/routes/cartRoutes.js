import express from "express";
const router = express.Router();
import { 
  addToCart, 
  getCart, 
  updateCartQty, 
  removeFromCart 
} from "../controllers/cartController.js";

// GET /api/cart/:userId
router.get("/:userId", getCart);

// POST /api/cart/add
router.post("/add", addToCart);

// PUT /api/cart/update-qty
router.put("/update-qty", updateCartQty);

// DELETE /api/cart/remove
router.delete("/remove", removeFromCart);

// CRITICAL: This is required for 'import cartRoutes from ...' to work
export default router;