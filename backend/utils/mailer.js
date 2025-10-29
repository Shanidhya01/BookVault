import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// verify transporter (optional)
transporter.verify().then(() => {
  console.log("Mailer: SMTP connection OK");
}).catch(err => {
  console.warn("Mailer: SMTP verify failed:", err.message);
});

export async function sendMail({ to, subject, text, html }) {
  const msg = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html
  };
  return transporter.sendMail(msg);
}
