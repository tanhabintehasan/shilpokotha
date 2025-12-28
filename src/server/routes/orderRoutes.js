import express from "express";
const router = express.Router();
import { addOrderItems, getOrders, updateOrderStatus, deleteOrder } from "../controllers/orderController.js";

// This becomes POST http://localhost:5000/api/orders
router.post("/", addOrderItems); 

// This becomes GET http://localhost:5000/api/orders
router.get("/", getOrders);

router.put("/status/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);

export default router;