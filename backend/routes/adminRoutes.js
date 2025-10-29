// backend/routes/adminRoutes.js
import express from "express";
import Book from "../models/Book.js";
import User from "../models/User.js";
import BorrowRecord from "../models/BorrowRecord.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, admin, async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();
    const activeBorrows = await BorrowRecord.countDocuments({ status: "borrowed" });
    const overdueItems = await BorrowRecord.countDocuments({ dueDate: { $lt: new Date() }, status: "borrowed" });
    const totalFine = await BorrowRecord.aggregate([
      { $group: { _id: null, total: { $sum: "$fine" } } },
    ]);
    // Borrow trends for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    const borrowTrends = await BorrowRecord.aggregate([
      { $match: { borrowDate: { $gte: sixMonthsAgo } } },
      { $group: {
        _id: { $month: "$borrowDate" },
        count: { $sum: 1 }
      }},
      { $sort: { "_id": 1 } }
    ]);
    // Category-wise book distribution
    const categoryDistribution = await Book.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { category: "$_id", count: 1, _id: 0 } }
    ]);

    // Recent activities (last 5 borrow/return actions)
    const recentActivitiesRaw = await BorrowRecord.find({})
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate("user", "name")
      .populate("book", "title");
    const recentActivities = recentActivitiesRaw.map(r => ({
      type: r.status,
      userName: r.user?.name,
      bookTitle: r.book?.title,
      date: r.updatedAt
    }));

    res.json({
      totalBooks,
      totalUsers,
      activeBorrows,
      overdueItems,
      totalFine: totalFine[0]?.total || 0,
      borrowTrends,
      categoryDistribution,
      recentActivities,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin stats", error });
  }
});

export default router;
