import express from "express";
import multer from "multer";
import { protect, admin } from "../middleware/authMiddleware.js";
import { getBooks, createBook, getBookById, updateBook, deleteBook } from "../controllers/bookController.js";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}_${Math.round(Math.random()*1e9)}${ext}`);
  }
});
const upload = multer({ storage });

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", protect, admin, upload.single("cover"), createBook);
router.put("/:id", protect, admin, upload.single("cover"), updateBook);
router.delete("/:id", protect, admin, deleteBook);

export default router;
