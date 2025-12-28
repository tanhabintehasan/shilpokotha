import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    // Link to the user who owns this cart
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      unique: true // One user = One cart
    },
    items: [
      {
        productId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "Product", 
          required: true 
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, default: 1, min: 1 },
        img: { type: String }, // Store the primary image filename
        size: { type: String, required: true }, // Crucial for your casual shirts/apparel
      },
    ],
    // Optional: Keep track of the total cart value on the server side
    cartTotal: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Middleware to calculate cartTotal before saving (Optional but helpful)
cartSchema.pre("save", function (next) {
  this.cartTotal = this.items.reduce((acc, item) => acc + item.price * item.qty, 0);
  next();
});

export default mongoose.model("Cart", cartSchema);