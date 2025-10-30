import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  maxBooksPerUser: { type: Number, default: 3 },
  loanPeriodDays: { type: Number, default: 14 },
  finePerDay: { type: Number, default: 10 },
}, { timestamps: true });

export default mongoose.model("Settings", settingsSchema);
