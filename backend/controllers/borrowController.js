import BorrowRecord from "../models/BorrowRecord.js";
import Book from "../models/Book.js";

export const borrowBook = async (req, res) => {
  const bookId = req.params.bookId;
  const userId = req.user._id;

  const book = await Book.findById(bookId);
  if (!book) return res.status(404).json({ message: "Book not found" });
  if (book.availableCopies < 1) return res.status(400).json({ message: "No copies available" });

  // reduce
  book.availableCopies -= 1;
  await book.save();

  const record = await BorrowRecord.create({ user: userId, book: bookId });
  res.status(201).json(record);
};

export const returnBook = async (req, res) => {
  const recordId = req.params.recordId;
  const record = await BorrowRecord.findById(recordId).populate("book");
  if (!record) return res.status(404).json({ message: "Borrow record not found" });
  if (record.status === "returned") return res.status(400).json({ message: "Already returned" });

  record.status = "returned";
  record.returnDate = new Date();
  await record.save();

  // increment book available copies
  const book = await Book.findById(record.book._id);
  if (book) {
    book.availableCopies += 1;
    if (book.availableCopies > book.totalCopies) book.availableCopies = book.totalCopies;
    await book.save();
  }

  res.json(record);
};

export const getUserBorrowRecords = async (req, res) => {
  const records = await BorrowRecord.find({ user: req.user._id }).populate("book").sort({ borrowDate: -1 });
  res.json(records);
};

export const getAllBorrowRecords = async (req, res) => {
  const records = await BorrowRecord.find().populate("book").populate("user").sort({ borrowDate: -1 });
  res.json(records);
};
