import express from "express";
import http from "http";
import { startBot } from "./bot/index";

// 1. سيرفر الـ Health عشان Railway و UptimeRobot
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Health server running on port ${PORT}`);
});

// 2. شغل البوت تبعك
startBot().catch((err) => {
  console.error("Failed to start bot", err);
  process.exit(1);
});

// 3. نخلي البوت صاحي: نضرب /health كل 4 دقايق لحالنا
setInterval(() => {
  http.get(`http://localhost:${PORT}/health`);
}, 4 * 60 * 1000);

process.once("SIGINT", () => process.exit(0));
process.once("SIGTERM", () => process.exit(0));
