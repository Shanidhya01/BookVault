// backend/controllers/adminController.js
import User from "../models/User.js";
import Book from "../models/Book.js";
import BorrowRecord from "../models/BorrowRecord.js";

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();
    const totalBorrowedRecords = await BorrowRecord.countDocuments({ status: { $in: ["borrowed","approved"] }});
    const currentlyBorrowed = await BorrowRecord.countDocuments({ status: "borrowed" });

    // total fines outstanding (sum of fine for returned + current fines for borrowed)
    const allRecords = await BorrowRecord.find().lean();
    let totalFines = 0;
    const now = new Date();
    allRecords.forEach(r => {
      if (r.status === "returned") totalFines += r.fine || 0;
      else if (r.status === "borrowed" && r.dueDate && now > new Date(r.dueDate)) {
        const daysLate = Math.ceil((now - new Date(r.dueDate)) / (1000*60*60*24));
        totalFines += daysLate * 10;
      }
    });

    res.json({ totalUsers, totalBooks, totalBorrowedRecords, currentlyBorrowed, totalFines });
  } catch (err) {
    console.error(err); res.status(500).json({ message: "Server error" });
  }
};
