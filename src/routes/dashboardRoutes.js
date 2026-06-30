import express from "express";
import { getDashboardStats, getLowStockProducts } from "../controllers/dashboardController.js";
import authMiddleware  from "../middleware/authMiddleware.js";

const router = express.Router();

// Dashboard Statistics
router.get("/", authMiddleware, getDashboardStats);
router.get("/low-stock",authMiddleware, getLowStockProducts);

export default router;
