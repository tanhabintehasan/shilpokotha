import Cart from "../models/Cart.js";
import mongoose from "mongoose";

// @desc    Add item to cart or update quantity
export const addToCart = async (req, res) => {
  const { userId, item } = req.body; 
  try {
    if (!mongoose.Types.ObjectId.isValid(item.productId)) {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }

    let cart = await Cart.findOne({ userId });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (p) => p.productId.toString() === item.productId && p.size === item.size
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].qty += Number(item.qty);
      } else {
        cart.items.push(item);
      }
      await cart.save();
    } else {
      cart = await Cart.create({ userId, items: [item] });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get user cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(200).json({ items: [] });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Update quantity (called by updateQty in frontend)
export const updateCartQty = async (req, res) => {
  const { userId, productId, size, delta } = req.body; 
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].qty + delta;
      cart.items[itemIndex].qty = newQty < 1 ? 1 : newQty;
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// @desc    Remove item (called by removeItem in frontend)
export const removeFromCart = async (req, res) => {
  const { userId, productId, size } = req.query;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => !(item.productId.toString() === productId && item.size === size)
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Remove failed", error: error.message });
  }
};