import express from "express";
import { protectUser } from "../middleware/authMiddleware.js";
import { 
  addToWishlist, 
  getWishlist, 
  removeFromWishlist 
} from "../controllers/wishlistController.js";

const router = express.Router();

// All wishlist operations require the user to be logged in
router.use(protectUser); 

// @route   GET /api/wishlist/:userId
// @desc    Fetch all items in user's wishlist
router.get("/:userId", getWishlist);

// @route   POST /api/wishlist/add
// @desc    Add a product to the wishlist
router.post("/add", addToWishlist);

// @route   DELETE /api/wishlist/remove
// @desc    Remove a specific product from the wishlist
// Expects userId and productId as query parameters or in body
router.delete("/remove", removeFromWishlist);

export default router;