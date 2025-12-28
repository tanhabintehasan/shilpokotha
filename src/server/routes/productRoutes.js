import express from "express";
import Product from "../models/Product.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// 1. GET All Products
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

// 2. GET Single Product by ID (REQUIRED FOR PRODUCT DETAILS PAGE)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product details" });
  }
});

// 3. POST Add Product
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, designType, stock, link } = req.body;
    let imageURL = req.file ? `/uploads/${req.file.filename}` : "";

    const newProduct = new Product({
      name, description, price, category, designType, stock, link, imageURL,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. PUT Update Product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, designType, stock, link } = req.body;
    let updateData = { name, description, price, category, designType, stock, link };

    if (req.file) {
      updateData.imageURL = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. DELETE Product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;