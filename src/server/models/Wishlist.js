import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    // Link to the user who owns this wishlist
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      unique: true // One user = One wishlist
    },
    products: [
      {
        productId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "Product", 
          required: true 
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        img: { type: String }, // Store the primary image filename for quick display
        // Note: We usually don't store 'size' or 'qty' in wishlist 
        // because the user chooses those only when moving to cart.
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Wishlist", wishlistSchema);