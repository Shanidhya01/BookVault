import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { borrowBook, returnBook, getUserBorrowRecords, getAllBorrowRecords } from "../controllers/borrowController.js";

const router = express.Router();

router.post("/:bookId", protect, borrowBook);
router.post("/return/:recordId", protect, returnBook);
router.get("/me", protect, getUserBorrowRecords);
router.get("/", protect, admin, getAllBorrowRecords);

export default router;
