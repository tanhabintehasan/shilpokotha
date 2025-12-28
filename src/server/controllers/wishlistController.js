import Wishlist from "../models/Wishlist.js";

// @desc    Add item to wishlist (Matches addToCart logic)
export const addToWishlist = async (req, res) => {
  const { userId, productId, name, price, img } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ userId });
    
    const newItem = { productId, name, price, img };

    if (wishlist) {
      // Check if item already exists to prevent duplicates (same as cart index check)
      const itemIndex = wishlist.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (itemIndex === -1) {
        wishlist.products.push(newItem);
        await wishlist.save();
      }
      // If it exists, we don't increment (unlike cart) but we still save/return
    } else {
      wishlist = await Wishlist.create({ userId, products: [newItem] });
    }
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get user wishlist (Matches getCart logic)
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId });
    if (!wishlist) return res.status(200).json({ products: [] });
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Remove Item from Wishlist (Matches removeFromCart logic)
export const removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.query; // Received via URL query params
  try {
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.products = wishlist.products.filter(
      (item) => item.productId.toString() !== productId
    );

    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Remove failed", error: error.message });
  }
};