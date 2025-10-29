// backend/scripts/seedBooks.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import Book from "../models/Book.js";
import User from "../models/User.js";
import connectDB from "../config/db.js";

const sampleBooks = [
  { title: "Introduction to Algorithms", author: "Cormen", category: "Computer", isbn: "9780262032933", totalCopies: 3, availableCopies: 3 },
  { title: "Clean Code", author: "Robert C. Martin", category: "Computer", isbn: "9780132350884", totalCopies: 3, availableCopies: 3 },
  { title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", isbn: "9780553380163", totalCopies: 2, availableCopies: 2 },
  { title: "Sapiens", author: "Yuval Noah Harari", category: "History", isbn: "9780062316097", totalCopies: 2, availableCopies: 2 },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Fiction", isbn: "9780743273565", totalCopies: 2, availableCopies: 2 }
];

async function seed() {
  try {
    await connectDB();
    console.log("Seeding sample books...");
    await Book.deleteMany({});
    await Book.insertMany(sampleBooks);
    console.log("Books seeded.");

    // optionally seed an admin user (if not exists)
    const adminEmail = "lickykumar0011s@gmail.com";
    const exists = await User.findOne({ email: adminEmail });
    if (!exists) {
      const admin = await User.create({ name: "Admin", email: adminEmail, password: "adminpass", role: "admin" });
      console.log("Admin created:", adminEmail, "password: adminpass");
    } else console.log("Admin already exists:", adminEmail);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
