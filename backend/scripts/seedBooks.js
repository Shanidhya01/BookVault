import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import Book from "../models/Book.js";
import User from "../models/User.js";
import connectDB from "../config/db.js";

const sampleBooks = [
  {
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    category: "Computer",
    isbn: "9780262032933",
    totalCopies: 3,
    availableCopies: 3,
    coverUrl:
      "https://images-na.ssl-images-amazon.com/images/I/41as+WafrFL._SX258_BO1,204,203,200_.jpg",
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Computer",
    isbn: "9780132350884",
    totalCopies: 3,
    availableCopies: 3,
    coverUrl:
      "https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX374_BO1,204,203,200_.jpg",
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    isbn: "9780553380163",
    totalCopies: 2,
    availableCopies: 2,
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/en/b/bb/BriefHistoryTime.jpg",
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    category: "History",
    isbn: "9780062316097",
    totalCopies: 2,
    availableCopies: 2,
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/en/8/8d/Sapiens_A_Brief_History_of_Humankind.jpg",
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    isbn: "9780743273565",
    totalCopies: 2,
    availableCopies: 2,
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/en/f/f7/TheGreatGatsby_1925jacket.jpeg",
  },
];

async function seed() {
  try {
    await connectDB();
    console.log("Seeding sample books...");
    await Book.deleteMany({});
    await Book.insertMany(sampleBooks);
    console.log("Books seeded successfully!");

    // Optionally seed admin user
    const adminEmail = "lickykumar0011s@gmail.com";
    const exists = await User.findOne({ email: adminEmail });
    if (!exists) {
      const admin = await User.create({
        name: "Admin",
        email: adminEmail,
        password: "adminpass",
        role: "admin",
      });
      console.log("Admin created:", adminEmail, "password: adminpass");
    } else console.log("Admin already exists:", adminEmail);

    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
