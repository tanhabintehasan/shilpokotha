import express from "express";
const router = express.Router();
import { 
  addOrderItems, 
  getOrders, 
  updateOrderStatus, 
  deleteOrder // This must match the export name in the controller
} from "../controllers/orderController.js";

router.post("/", addOrderItems);
router.get("/", getOrders);
router.put("/status/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);

export default router;