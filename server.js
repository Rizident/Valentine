import express from "express";
import nodemailer from "nodemailer";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

// ✅ Счётчики в памяти
let data = {
  yes: 0,
  no: 0,
  firstClick: null,
  lastClick: null
};

// Настройка почты
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendMail(lastClick) {
  try {
    await transporter.sendMail({
      from: `"Valentine Bot" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "💘 New Valentine Response",
      text: `
Someone interacted with your Valentine page.

YES: ${data.yes}
NO: ${data.no}

First click: ${data.firstClick}
Last click: ${lastClick}
`
    });
  } catch (err) {
    console.log("Mail error:", err);
  }
}

// Обработчик кликов
app.post("/click/:type", async (req, res) => {
  const type = req.params.type.toUpperCase();

  if (!data.firstClick) data.firstClick = type;
  data.lastClick = type;

  if (type === "YES") data.yes++;
  if (type === "NO") data.no++;

  sendMail(type); // асинхронно

  res.json({ success: true, data });
});

// Reset счётчиков
app.post("/reset", (req, res) => {
  data = { yes: 0, no: 0, firstClick: null, lastClick: null };
  res.json({ success: true });
});

// Отдаём index.html для всех маршрутов
app.get('*', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

// Запуск сервера
const PORT = process.env.PORT || 3000;

app.listen(PORT)
  .on('listening', () => console.log(`Server running on port ${PORT}`))
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Try another port.`);
    } else {
      console.error(err);
    }
  });
