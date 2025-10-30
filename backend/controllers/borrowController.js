// backend/controllers/borrowController.js
import BorrowRecord from "../models/BorrowRecord.js";
import Book from "../models/Book.js";
import { sendMail } from "../utils/mailer.js";
import { notifyWaitlistOnReturn } from "./bookController.js";

const FINE_PER_DAY = 10; // ₹10 per day

// student requests
export const requestBorrow = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

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

// admin lists pending
export const listPendingRequests = async (req, res) => {
  try {
    const records = await BorrowRecord.find({ status: "pending" }).populate("book").populate("user").sort({ requestedAt: -1 });
    res.json(records);
  } catch (err) {
    console.error(err); res.status(500).json({ message: "Server error" });
  }
};

// approve request (admin)
export const approveRequest = async (req, res) => {
  try {
    const id = req.params.requestId;
    const record = await BorrowRecord.findById(id).populate("user").populate("book");
    if (!record) return res.status(404).json({ message: "Request not found" });
    if (record.status !== "pending") return res.status(400).json({ message: "Request is not pending" });

    const book = await Book.findById(record.book._id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.availableCopies < 1) return res.status(400).json({ message: "No copies available to approve" });

    const now = new Date();
    record.status = "borrowed";
    record.approvedAt = now;
    record.borrowDate = now;
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + 14);
    record.dueDate = dueDate;

    book.availableCopies -= 1;
    await book.save();
    await record.save();

    // send email to student - approval notification
    try {
      await sendMail({
        to: record.user.email,
        subject: `Borrow request approved: ${record.book.title}`,
        text: `Hello ${record.user.name},\n\nYour request to borrow "${record.book.title}" has been approved. Due date: ${record.dueDate.toDateString()}.\n\nRegards,\nBookVault`,
        html: `<p>Hello ${record.user.name},</p><p>Your request to borrow "<strong>${record.book.title}</strong>" has been <strong>approved</strong>.</p><p>Due date: ${record.dueDate.toDateString()}</p><p>Regards,<br/>BookVault</p>`
      });
    } catch (mailErr) {
      console.warn("Failed to send approval email:", mailErr.message);
    }

  // Use single populate with array for multiple fields
  const populated = await record.populate(["book", "user"]);
  res.json(populated);
  } catch (err) {
    console.error(err); res.status(500).json({ message: "Server error" });
  }
};

// reject request (admin)
export const rejectRequest = async (req, res) => {
  try {
    const id = req.params.requestId;
    const record = await BorrowRecord.findById(id).populate("user").populate("book");
    if (!record) return res.status(404).json({ message: "Request not found" });
    if (record.status !== "pending") return res.status(400).json({ message: "Request is not pending" });

    record.status = "rejected";
    record.rejectedAt = new Date();
    await record.save();

    try {
      await sendMail({
        to: record.user.email,
        subject: `Borrow request rejected: ${record.book.title}`,
        text: `Hello ${record.user.name},\n\nYour request to borrow "${record.book.title}" was rejected by the admin.\n\nRegards,\nBookVault`,
        html: `<p>Hello ${record.user.name},</p><p>Your request to borrow "<strong>${record.book.title}</strong>" was <strong>rejected</strong>.</p><p>Regards,<br/>BookVault</p>`
      });
    } catch (mailErr) {
      console.warn("Failed to send rejection email:", mailErr.message);
    }

    res.json(record);
  } catch (err) {
    console.error(err); res.status(500).json({ message: "Server error" });
  }
};

// return book (student or admin)
export const returnBook = async (req, res) => {
  try {
    const recordId = req.params.recordId;
    const record = await BorrowRecord.findById(recordId).populate("book").populate("user");
    if (!record) return res.status(404).json({ message: "Borrow record not found" });
    if (record.status !== "borrowed") return res.status(400).json({ message: "Record not currently borrowed" });

    const now = new Date();
    record.returnDate = now;
    record.status = "returned";

    let fine = 0;
    if (record.dueDate && now > record.dueDate) {
      const diffMs = now - record.dueDate;
      const daysLate = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      fine = daysLate * FINE_PER_DAY;
    }
    record.fine = fine;

    // increment book availability
    const book = record.book ? await Book.findById(record.book._id) : null;
    if (book) {
      book.availableCopies = Math.min(book.totalCopies, (book.availableCopies || 0) + 1);
      await book.save();
      await notifyWaitlistOnReturn(book);
    }

    await record.save();

    // send return confirmation / fine notice email
    try {
      await sendMail({
        to: record.user.email,
        subject: `Book returned: ${record.book.title}`,
        text: `Hello ${record.user.name},\n\nYou returned "${record.book.title}". Fine: ₹${fine}.\n\nRegards,\nBookVault`,
        html: `<p>Hello ${record.user.name},</p><p>You returned "<strong>${record.book.title}</strong>".</p><p>Fine: <strong>₹${fine}</strong></p><p>Regards,<br/>BookVault</p>`
      });
    } catch (mailErr) {
      console.warn("Failed to send return email:", mailErr.message);
    }

    res.json({ record, fine });
  } catch (err) {
    console.error(err); res.status(500).json({ message: "Server error" });
  }
};


// get user records (student)
export const getUserRecords = async (req, res) => {
  try {
    const records = await BorrowRecord.find({ user: req.user._id }).populate("book").sort({ borrowDate: -1 });
    const book = records.book ? await Book.findById(records.book._id) : null;
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

// admin: all records (with pagination & filters)
export const getAllRecords = async (req, res) => {
  try {
    const { userName, bookTitle, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    // basic query (no text search across refs), we'll populate then filter text fields in-memory
    const skip = (Number(page) - 1) * Number(limit);
    const total = await BorrowRecord.countDocuments(filter);
    let query = BorrowRecord.find(filter).populate("user", "name email").populate("book", "title author isbn").sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    let records = await query.exec();

    // text filters
    if (userName) records = records.filter(r => r.user && r.user.name.toLowerCase().includes(userName.toLowerCase()));
    if (bookTitle) records = records.filter(r => r.book && r.book.title.toLowerCase().includes(bookTitle.toLowerCase()));

    // enrich with currentFine & isOverdue
    const now = new Date();
    const enriched = records.map(r => {
      const obj = r.toObject();
      obj.isOverdue = obj.status === "borrowed" && obj.dueDate && now > new Date(obj.dueDate);
      if (obj.isOverdue) {
        const daysLate = Math.ceil((now - new Date(obj.dueDate)) / (1000 * 60 * 60 * 24));
        obj.currentFine = daysLate * FINE_PER_DAY;
      } else obj.currentFine = obj.fine || 0;
      return obj;
    });

    res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
      data: enriched
    });
  } catch (err) {
    console.error(err); res.status(500).json({ message: "Server error" });
  }
};


/*
  Helper: scanAndNotifyOverdues
  - Finds borrowed records whose dueDate < now and that haven't been notified today (overdueNotifiedAt)
  - Calculates fine (updates record.fine to currentFine)
  - Sends email reminder to user
  - Updates overdueNotifiedAt to now
*/
export const scanAndNotifyOverdues = async () => {
  try {
    const now = new Date();
    // find borrowed records with dueDate in past and not already notified today
    const candidates = await BorrowRecord.find({
      status: "borrowed",
      dueDate: { $lt: now }
    }).populate("user").populate("book");

    for (const rec of candidates) {
      // detect last notified date (avoid multiple sends per day)
      const lastNotified = rec.overdueNotifiedAt ? new Date(rec.overdueNotifiedAt) : null;
      const lastNotifiedDay = lastNotified ? lastNotified.toDateString() : null;
      if (lastNotifiedDay === now.toDateString()) {
        // already notified today
        continue;
      }

      // compute current fine
      const daysLate = Math.ceil((now - rec.dueDate) / (1000 * 60 * 60 * 24));
      const currentFine = daysLate * FINE_PER_DAY;
      rec.fine = currentFine;

      // set notifiedAt to now
      rec.overdueNotifiedAt = now;
      await rec.save();

      // send email
    try {
      await sendMail({
        to: record.user.email,
        subject: `Book returned: ${record.book ? record.book.title : "Unknown Book"}`,
        text: `Hello ${record.user.name},\n\nYou returned \"${record.book ? record.book.title : "Unknown Book"}\". Fine: ₹${fine}.\n\nRegards,\nBookVault`,
        html: `<p>Hello ${record.user.name},</p><p>You returned \"<strong>${record.book ? record.book.title : "Unknown Book"}</strong>\".</p><p>Fine: <strong>₹${fine}</strong></p><p>Regards,<br/>BookVault</p>`
      });
    } catch (mailErr) {
      console.warn("Failed to send return email:", mailErr.message);
    }
    }
    return { processed: candidates.length };
  } catch (err) {
    console.error("scanAndNotifyOverdues error:", err);
    return { processed: 0, error: err.message };
  }
};
