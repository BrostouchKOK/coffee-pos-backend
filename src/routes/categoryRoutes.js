import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Anyone logged in can view categories
router.get("/", authMiddleware, getCategories);
router.get("/:id", authMiddleware, getCategoryById);

// Admin only
router.post("/", authMiddleware, roleMiddleware("Admin"), createCategory);

router.put("/:id", authMiddleware, roleMiddleware("Admin"), updateCategory);

router.delete("/:id", authMiddleware, roleMiddleware("Admin"), deleteCategory);

export default router;
