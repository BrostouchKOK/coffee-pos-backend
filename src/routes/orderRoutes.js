import express from "express";

import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Order (Checkout)
router.post("/", authMiddleware, createOrder);

// Get All Orders
router.get("/", authMiddleware, getOrders);

// Get Single Order
router.get("/:id", authMiddleware, getOrderById);

router.put("/:id/status", authMiddleware, updateOrderStatus);

// Update status
export default router;
