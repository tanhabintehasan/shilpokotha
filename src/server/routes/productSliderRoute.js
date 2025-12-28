import express from "express";
import multer from "multer";
import ProductSlider from "../models/ProductSlider.js";

const router = express.Router();

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Correct path: This matches PUT /api/product-slider/update/:id
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, category, price, stock, description, designType } = req.body;
    let updateData = { name, category, price, stock, description, designType };

    if (req.file) {
      updateData.imageURL = `/uploads/${req.file.filename}`;
    }

    const updatedAsset = await ProductSlider.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedAsset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.status(200).json(updatedAsset);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

// Correct path: This matches POST /api/product-slider/add
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, category, price, stock, description, designType } = req.body;
    const imageURL = req.file ? `/uploads/${req.file.filename}` : "";

    const newAsset = new ProductSlider({
      name,
      category,
      price,
      stock,
      description,
      designType,
      imageURL,
    });

    await newAsset.save();
    res.status(201).json(newAsset);
  } catch (err) {
    res.status(500).json({ message: "Add failed", error: err.message });
  }
});

export default router;