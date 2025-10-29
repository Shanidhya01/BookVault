import cron from "node-cron";
import dotenv from "dotenv";
import { scanAndNotifyOverdues } from "../controllers/borrowController.js";

dotenv.config();

export function startOverdueScheduler() {
  const schedule = process.env.CRON_SCHEDULE || "0 9 * * *"; // default: 09:00 daily
  console.log(`Scheduler: starting overdue scanner with schedule: ${schedule}`);

  cron.schedule(schedule, async () => {
    console.log(`[${new Date().toISOString()}] Scheduler: scanning for overdue records...`);
    try {
      const result = await scanAndNotifyOverdues();
      console.log("Scheduler result:", result);
    } catch (err) {
      console.error("Scheduler error:", err);
    }
  }, {
    timezone: process.env.CRON_TZ || "UTC"
  });
}
