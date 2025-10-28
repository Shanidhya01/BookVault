// backend/models/BorrowRecord.js
import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  borrowDate: { type: Date },           // set when approved
  dueDate: { type: Date },              // borrowDate + 14 days (on approval)
  returnDate: { type: Date },
  status: { type: String, enum: ["pending", "approved", "rejected", "borrowed", "returned"], default: "pending" },
  requestedAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  rejectedAt: { type: Date },
  fine: { type: Number, default: 0 }    // ₹10 per day after dueDate
}, { timestamps: true });

export default mongoose.model("BorrowRecord", borrowSchema);
