import express from "express";
import fs from "fs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // загружаем .env до использования process.env

const app = express();
app.use(express.json());
app.use(express.static("public"));

const DATA_FILE = "./data.json";

// функции для работы с данными
function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    return { yes: 0, no: 0, firstClick: null, lastClick: null };
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// настройка почты
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendMail(data, last) {
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
Last click: ${last}
`
    });
  } catch (err) {
    console.log("Mail error:", err);
  }
}

// маршрут для кликов
app.post("/click/:type", async (req, res) => {
  const type = req.params.type.toUpperCase();
  const data = loadData();

  if (!data.firstClick) data.firstClick = type;
  data.lastClick = type;

  if (type === "YES") data.yes++;
  if (type === "NO") data.no++;

  saveData(data);
  sendMail(data, type); // отправка письма асинхронно

  res.json({ success: true, data });
});

// сброс счётчиков
app.post("/reset", (req, res) => {
  const resetData = { yes: 0, no: 0, firstClick: null, lastClick: null };
  saveData(resetData);
  res.json({ success: true });
});

app.listen(3000, () => console.log("Server running"));
