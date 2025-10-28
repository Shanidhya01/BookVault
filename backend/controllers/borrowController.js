import BorrowRecord from "../models/BorrowRecord.js";
import Book from "../models/Book.js";
import mongoose from "mongoose";

const FINE_PER_DAY = 10; // ₹10 per day

// Student requests a borrow (creates pending record)
export const requestBorrow = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // optional: prevent duplicate pending requests for same user+book
    const exists = await BorrowRecord.findOne({ user: req.user._id, book: bookId, status: { $in: ["pending","approved","borrowed"] }});
    if (exists) return res.status(400).json({ message: "You already have an active request or borrowed this book" });

    const record = await BorrowRecord.create({
      user: req.user._id,
      book: bookId,
      status: "pending",
      requestedAt: new Date()
    });

    res.status(201).json(record);
  } catch (err) {
    console.error(err); res.status(500).json({ message: "Server error" });
  }
};

// Admin lists pending requests
export const listPendingRequests = async (req, res) => {
  try {
    const records = await BorrowRecord.find({ status: "pending" }).populate("book").populate("user").sort({ requestedAt: -1 });
    res.json(records);
  } catch (err) {
    console.error(err); res.status(500).json({ message: "Server error" });
  }
};

// Admin approve request: set approvedAt, status->approved->borrowed, set borrowDate/dueDate and decrement book avail
export const approveRequest = async (req, res) => {
  try {
    const id = req.params.requestId;
    const record = await BorrowRecord.findById(id);
    if (!record) return res.status(404).json({ message: "Request not found" });
    if (record.status !== "pending") return res.status(400).json({ message: "Request is not pending" });

    const book = await Book.findById(record.book);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.availableCopies < 1) return res.status(400).json({ message: "No copies available to approve" });

    // mark approved & borrowed
    const now = new Date();
    record.status = "borrowed";
    record.approvedAt = now;
    record.borrowDate = now;
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + 14);
    record.dueDate = dueDate;

    // decrement book available copies
    book.availableCopies -= 1;
    await book.save();
  await record.save();

  // Use single populate with array for multiple fields
  const populated = await record.populate(["book", "user"]);
  res.json(populated);
  } catch (err) {
    console.error(err); res.status(500).json({ message: "Server error" });
  }
};

// Admin reject request
export const rejectRequest = async (req, res) => {
  try {
    const id = req.params.requestId;
    const record = await BorrowRecord.findById(id);
    if (!record) return res.status(404).json({ message: "Request not found" });
    if (record.status !== "pending") return res.status(400).json({ message: "Request is not pending" });

    record.status = "rejected";
    record.rejectedAt = new Date();
    await record.save();
    res.json(record);
  } catch (err) {
    console.error(err); res.status(500).json({ message: "Server error" });
  }
};

// User returns book: calculate fine, update book.availableCopies
export const returnBook = async (req, res) => {
  try {
    const recordId = req.params.recordId;
    const record = await BorrowRecord.findById(recordId).populate("book").populate("user");
    if (!record) return res.status(404).json({ message: "Borrow record not found" });
    if (record.status !== "borrowed") return res.status(400).json({ message: "Record not currently borrowed" });

    const now = new Date();
    record.returnDate = now;
    record.status = "returned";

    // calculate fine if overdue
    let fine = 0;
    if (record.dueDate && now > record.dueDate) {
      const diffMs = now - record.dueDate;
      const daysLate = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      fine = daysLate * FINE_PER_DAY;
    }
    record.fine = fine;

    // increment book availableCopies (cap at totalCopies)
    const book = await Book.findById(record.book._id);
    if (book) {
      book.availableCopies = Math.min(book.totalCopies, (book.availableCopies || 0) + 1);
      await book.save();
    }

    await record.save();
    res.json({ record, fine });
  } catch (err) {
    console.error(err); res.status(500).json({ message: "Server error" });
  }
};

// Get borrow records for current user (student) — includes overdue flag and fine recalculated on-the-fly
export const getUserRecords = async (req, res) => {
  try {
    const records = await BorrowRecord.find({ user: req.user._id }).populate("book").sort({ borrowDate: -1 });
    const now = new Date();
    const enriched = records.map(rec => {
      const isOverdue = rec.status === "borrowed" && rec.dueDate && now > rec.dueDate;
      let currentFine = rec.fine || 0;
      if (isOverdue) {
        const daysLate = Math.ceil((now - rec.dueDate) / (1000 * 60 * 60 * 24));
        currentFine = daysLate * FINE_PER_DAY;
      }
      return { ...rec.toObject(), isOverdue, currentFine };
    });
    res.json(enriched);
  } catch (err) {
    console.error(err); res.status(500).json({ message: "Server error" });
  }
};

// Admin: all borrow records (with filters)
export const getAllRecords = async (req, res) => {
  try {
    const { userName, bookTitle, status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    let query = BorrowRecord.find(filter).populate("user", "name email").populate("book", "title author isbn");
    // basic text filters:
    // if userName or bookTitle provided, we can filter in-memory after populate
    const records = await query.sort({ createdAt: -1 });
    let results = records;
    if (userName) {
      results = results.filter(r => r.user && r.user.name.toLowerCase().includes(userName.toLowerCase()));
    }
    if (bookTitle) {
      results = results.filter(r => r.book && r.book.title.toLowerCase().includes(bookTitle.toLowerCase()));
    }

    // recalc fines if currently overdue
    const now = new Date();
    results = results.map(r => {
      const obj = r.toObject();
      obj.isOverdue = obj.status === "borrowed" && obj.dueDate && now > new Date(obj.dueDate);
      if (obj.isOverdue) {
        const daysLate = Math.ceil((now - new Date(obj.dueDate)) / (1000 * 60 * 60 * 24));
        obj.currentFine = daysLate * FINE_PER_DAY;
      } else {
        obj.currentFine = obj.fine || 0;
      }
      return obj;
    });

    res.json(results);
  } catch (err) {
    console.error(err); res.status(500).json({ message: "Server error" });
  }
};
