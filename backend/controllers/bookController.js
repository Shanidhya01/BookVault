import Book from "../models/Book.js";
import fs from "fs";
import path from "path";

export const createBook = async (req, res) => {
  const { title, author, category, isbn, totalCopies } = req.body;
  const total = Number(totalCopies) || 1;
  const available = total;
  let coverUrl = null;
  if (req.file) coverUrl = `/uploads/${req.file.filename}`;

  const book = await Book.create({ title, author, category, isbn, totalCopies: total, availableCopies: available, coverUrl });
  res.status(201).json(book);
};

export const getBooks = async (req, res) => {
  const { q, category } = req.query;
  const filter = {};
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { author: { $regex: q, $options: "i" } },
      { isbn: { $regex: q, $options: "i" } },
    ];
  }
  if (category) filter.category = category;
  const books = await Book.find(filter).sort({ createdAt: -1 });
  res.json(books);
};

export const getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
};

export const updateBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });

  const { title, author, category, isbn, totalCopies } = req.body;
  if (title) book.title = title;
  if (author) book.author = author;
  if (category) book.category = category;
  if (isbn) book.isbn = isbn;
  if (totalCopies) {
    const total = Number(totalCopies);
    // adjust availableCopies relative to new total
    const diff = total - book.totalCopies;
    book.totalCopies = total;
    book.availableCopies = Math.max(0, book.availableCopies + diff);
  }
  if (req.file) {
    // remove old file if exists
    if (book.coverUrl) {
      const filepath = path.join(process.cwd(), book.coverUrl);
      fs.unlink(filepath, (err) => { if (err) console.warn("Failed to delete old cover", err); });
    }
    book.coverUrl = `/uploads/${req.file.filename}`;
  }

  await book.save();
  res.json(book);
};

export const deleteBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  // delete cover
  if (book.coverUrl) {
    const filepath = path.join(process.cwd(), book.coverUrl);
    fs.unlink(filepath, (err) => { if (err) console.warn("Failed to delete cover", err); });
  }
  await book.remove();
  res.json({ message: "Book removed" });
};
