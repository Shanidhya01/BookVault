import cron from "node-cron";
import BorrowRecord from "../models/BorrowRecord.js";
import User from "../models/User.js";
import sendMail from "../utils/mailer.js";

cron.schedule("0 8 * * *", async () => {
  // Run every day at 8am
  const now = new Date();
  const soon = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const dueSoon = await BorrowRecord.find({
    dueDate: { $gte: now, $lte: soon },
    status: "borrowed"
  }).populate("user").populate("book");

  for (const record of dueSoon) {
    await sendMail({
      to: record.user.email,
      subject: `Library Due Reminder: ${record.book.title}`,
      text: `Your borrowed book "${record.book.title}" is due on ${record.dueDate.toLocaleDateString()}. Please return or renew soon to avoid fines.`
    });
  }
});
