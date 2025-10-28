// backend/routes/adminRoutes.js
import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { getStats } from "../controllers/adminController.js";

const router = express.Router();
router.get("/stats", protect, admin, getStats);

export default router;
