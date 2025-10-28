// backend/routes/borrowRoutes.js
import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  requestBorrow,
  listPendingRequests,
  approveRequest,
  rejectRequest,
  returnBook,
  getUserRecords,
  getAllRecords
} from "../controllers/borrowController.js";

const router = express.Router();

// student requests borrow
router.post("/request/:bookId", protect, requestBorrow);

// list pending requests (admin)
router.get("/requests", protect, admin, listPendingRequests);

// approve/reject requests
router.post("/approve/:requestId", protect, admin, approveRequest);
router.post("/reject/:requestId", protect, admin, rejectRequest);

// return book (student or admin trigger)
router.put("/:recordId/return", protect, returnBook);

// user records
router.get("/me", protect, getUserRecords);

// admin all records with optional filters
router.get("/", protect, admin, getAllRecords);

export default router;
