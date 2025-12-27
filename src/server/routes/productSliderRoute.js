import express from "express";
const router = express.Router();
import Product from "../models/Product.js"; 

// ১. ম্যানেজমেন্টের জন্য সব প্রোডাক্ট আনা (Active + Inactive)
router.get("/all/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const assets = await Product.find({ designType: type })
      .select("name imageURL price category stock description designType isActive")
      .sort({ createdAt: -1 });
    res.status(200).json(assets);
  } catch (err) {
    res.status(500).json({ message: "Error fetching assets", error: err.message });
  }
});

// ২. ফ্রন্টএন্ড স্লাইডারের জন্য শুধুমাত্র Active প্রোডাক্ট আনা
router.get("/active/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const assets = await Product.find({ designType: type, isActive: true })
      .select("name imageURL price category stock description designType isActive")
      .sort({ createdAt: -1 });
    res.status(200).json(assets);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// ৩. ভিজিবিলিটি টগল করা
router.patch("/toggle/:id", async (req, res) => {
  try {
    const asset = await Product.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: "Not found" });
    asset.isActive = !asset.isActive;
    await asset.save();
    res.status(200).json({ id: asset._id, isActive: asset.isActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;