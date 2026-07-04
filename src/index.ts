import express from "express";
import http from "http";
import { startBot } from "./bot/index";

const app = express();
const PORT = process.env.PORT || 3000;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`; // ضفنا هاد

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(PORT, "0.0.0.0", () => { // ضفنا 0.0.0.0
  console.log(`Health server running on port ${PORT}`);
});

// 2. تشغيل البوت
startBot().catch((err) => {
  console.error("Failed to start bot", err);
  process.exit(1);
});

// 3. كل 14 دقيقة نضرب /health لحتى ما ينام
setInterval(() => {
  http.get(`${APP_URL}/health`); // عدلنا localhost
}, 14 * 60 * 1000);

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));
