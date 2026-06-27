import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
  getSalesSummary,
  getTopProducts,
  getPaymentMethods,
  getDateRangeReport,
} from "../controllers/reportsController.js";

const router = express.Router();

// All reports require authentication
router.use(authMiddleware);

// Admin only
router.use(roleMiddleware("Admin"));

// Routes
router.get("/summary", getSalesSummary);

router.get("/top-products", getTopProducts);

router.get("/payment-methods", getPaymentMethods);

router.get("/date-range", getDateRangeReport);

export default router;
