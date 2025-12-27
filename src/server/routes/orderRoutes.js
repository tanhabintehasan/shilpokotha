import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    console.log(`📦 Found ${orders.length} orders in Atlas`); // Debugging line
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Database Error: " + err.message });
  }
});

// UPDATE STATUS
router.put("/status/:id", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE ORDER
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
