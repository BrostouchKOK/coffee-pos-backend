// routes/settingsRoutes.js

import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  getSettings,
  updateSettings,
} from "../controllers/settingsController.js";

const router = express.Router();

// Only logged-in users
router.use(authMiddleware);

// Admin only
router.use(roleMiddleware("Admin"));

// GET Settings
router.get("/", getSettings);

// UPDATE Settings
router.put("/", upload.single("logo"), updateSettings);

export default router;
