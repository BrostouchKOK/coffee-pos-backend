import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Any logged-in user
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// Admin only
router.get("/admin", authMiddleware, roleMiddleware("Admin"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin",
  });
});

// Admin or Cashier
router.get(
  "/cashier",
  authMiddleware,
  roleMiddleware("Admin", "Cashier"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Cashier",
    });
  },
);

export default router;
