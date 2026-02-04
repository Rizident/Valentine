import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.sendMail({
  from: `"Valentine Bot" <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_USER,
  subject: "Test Email",
  text: "Если это письмо пришло — всё настроено правильно!"
}).then(() => console.log("Mail sent")).catch(console.error);
