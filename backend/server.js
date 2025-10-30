import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import { startOverdueScheduler } from "./scheduler/overdueSchedular.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// static for uploaded covers
app.use("/uploads", express.static("uploads"));

// Serve React frontend build
import path from "path";
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("/*", (req, res) => {
  // If not an API route, serve index.html
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
  }
});

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/settings", settingsRoutes);

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Server Error" });
});

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI;

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  // Start the overdue scheduler
  startOverdueScheduler();
})
.catch(err => {
  console.error("DB connection error:", err);
});
