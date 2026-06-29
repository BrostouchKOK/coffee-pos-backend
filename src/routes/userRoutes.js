import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// ======================================
// All User APIs require Login
// ======================================
router.use(authMiddleware);

// ======================================
// Admin Only
// ======================================
router.use(roleMiddleware("Admin"));

// ======================================
// Get All Users
// GET /api/users
// ======================================
router.get("/", getUsers);

// ======================================
// Create User
// POST /api/users
// ======================================
router.post("/", createUser);

// ======================================
// Update User
// PUT /api/users/:id
// ======================================
router.put("/:id", updateUser);

// ======================================
// Delete User
// DELETE /api/users/:id
// ======================================
router.delete("/:id", deleteUser);

export default router;
