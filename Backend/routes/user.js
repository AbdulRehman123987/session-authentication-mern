import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import User from "../models/User.js";

const router = express.Router();

// Protected route — requireAuth middleware runs first
router.get("/profile", requireAuth, async (req, res) => {
  const user = await User.findById(req.session.userId).select("-password");
  res.json(user);
});

export default router;
