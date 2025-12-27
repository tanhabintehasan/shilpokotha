import express from "express";
import Product from "../models/Product.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ... (Keep your GET /all/:type and PATCH /toggle/:id)

// GET All Products (Used by Client Frontend)
router.get("/", async (req, res) => {
  try {
    const { designType } = req.query;
    let query = designType ? { designType } : {};
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT Update Product (This is what was missing!)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, designType, stock, link } = req.body;
    
    // Create an object with the updated fields
    let updateData = { 
      name, 
      description, 
      price, 
      category, 
      designType, 
      stock, 
      link 
    };

    // If a new file was uploaded, update the imageURL path
    if (req.file) {
      updateData.imageURL = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true } // Returns the updated document
    );

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE Product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;