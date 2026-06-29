import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  changePassword
} from "../controllers/userController.js";

const router = express.Router();

// ======================================
// Login Required
// ======================================

router.use(authMiddleware);

// ======================================
// Profile (Admin + Cashier)
// ======================================

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/change-password", changePassword);

// ======================================
// Admin Only
// ======================================

router.use(roleMiddleware("Admin"));

// ======================================
// Get All Users
// ======================================

router.get("/", getUsers);

// ======================================
// Create User
// ======================================

router.post("/", createUser);

// ======================================
// Update User
// ======================================

router.put("/:id", updateUser);

// ======================================
// Delete User
// ======================================

router.delete("/:id", deleteUser);

export default router;
