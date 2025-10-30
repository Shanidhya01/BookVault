import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { getSettings, updateSettings } from "../controllers/settingsController.js";

const router = express.Router();

router.get("/", protect, admin, getSettings);
router.put("/", protect, admin, updateSettings);

export default router;
