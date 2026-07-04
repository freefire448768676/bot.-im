import { Telegraf } from "telegraf";
import express from "express";
import http from "http";

const bot = new Telegraf(process.env.BOT_TOKEN!);
const PORT = process.env.PORT || 8080;

// 1. اوامر البوت تبعك
bot.start((ctx) => ctx.reply("اهلا وسهلا! البوت شغال 24/7"));
// حط باقي اوامر البوت تبعك هون

// 2. سيرفر الـ health عشان Railway ما ينام
const app = express();
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`Health server running on port ${PORT}`);
});

// 3. شغل البوت
bot.launch();
console.log("Bot is running...");

// 4. self-ping كل 4 دقايق زيادة امان
setInterval(() => {
  http.get(`http://localhost:${PORT}/health`);
}, 4 * 60 * 1000);

// ايقاف امن
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
