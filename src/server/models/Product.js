// D:\shilpokotha\my-project\src\server\models\Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, default: 0 },
  category: { type: String }, 
  imageURL: { type: String },
  link: { type: String, default: "" }, // Added for sliders/banners
  
  // THE 7 DROP DOWN TYPES
  designType: { 
    type: String, 
    required: true,
    enum: [
      'homeslide',      // 1. Home slider
      'homecatslide',   // 2. HomeCatSlider
      'bannerslide',    // 3. Banner Slider
      'productslide',   // 4. ProductSlider
      'blog',           // 5. Blog
      'design',         // 6. design
      'product'         // 7. product
    ],
    default: 'product'
  },

  isSlider: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }, // Added for slider management
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);