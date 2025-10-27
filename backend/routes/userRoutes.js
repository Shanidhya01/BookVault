import express from "express";
import { register, login, getProfile, listUsers } from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.get("/", protect, admin, listUsers);

export default router;
