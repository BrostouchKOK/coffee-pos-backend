import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ===============================
// Get Products
// ===============================
router.get("/", authMiddleware, getProducts);

// ===============================
// Get Product By ID
// ===============================
router.get("/:id", authMiddleware, getProductById);

// ===============================
// Create Product
// Admin Only
// ===============================
router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin"),
  upload.single("image"),
  createProduct,
);

// ===============================
// Update Product
// Admin Only
// ===============================
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  upload.single("image"),
  updateProduct,
);

// ===============================
// Delete Product
// Admin Only
// ===============================
router.delete("/:id", authMiddleware, roleMiddleware("Admin"), deleteProduct);

export default router;
