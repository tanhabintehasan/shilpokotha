import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customer: { type: String, required: true },
    date: { type: Date, default: Date.now },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    items: Array, // Optional: to store product details
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
