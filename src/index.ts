import express from "express";
import http from "http";
import { startBot } from "./bot/index";

const app = express();
const PORT = process.env.PORT || 3000;
const APP_URL = process.env.APP_URL || `https://bot-im-production.up.railway.app`;

app.get("/health", (req, res) => {
  res.send("OK");
});

app.get("/", (req, res) => {
  res.send("Bot is running");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Health server running on port ${PORT}`);
});

startBot().catch((err) => {
  console.error("Failed to start bot", err);
  process.exit(1);
});

// صحي البوت كل 14 دقيقة عشان ما ينام على Railway
setInterval(() => {
  http.get(`${APP_URL}/`, (res) => {
    console.log(`Keep alive ping: ${res.statusCode}`);
  }).on("error", (err) => {
    console.error("Keep alive error:", err.message);
  });
}, 14 * 60 * 1000);

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));
