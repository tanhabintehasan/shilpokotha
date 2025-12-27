import express from "express";
import Category from "../models/Category.js";
import { deleteItem, getById } from "./generic.js";

const router = express.Router();

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

// --- 1. Static Routes ---

// GET ALL: /api/categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST ADD: /api/categories/add
router.post("/add", async (req, res) => {
  try {
    const categoryData = {
      ...req.body,
      slug: slugify(req.body.name),
    };
    const newCat = new Category(categoryData);
    await newCat.save();
    res.status(201).json(newCat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- 2. Dynamic ID Routes ---

// GET BY ID: /api/categories/:id
router.get("/:id", (req, res) => getById(Category, req.params.id, res));

// DELETE: /api/categories/:id
router.delete("/:id", (req, res) => deleteItem(Category, req.params.id, res));

// PUT UPDATE: /api/categories/:id
router.put("/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.body.name) updateData.slug = slugify(req.body.name);

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
