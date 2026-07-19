import { Telegraf, Markup } from "telegraf";
import http from "http";
import "dotenv/config";

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("BOT_TOKEN is not set");
  process.exit(1);
}

const bot = new Telegraf(token);

// ===== بوت تجربة =====
bot.start((ctx) => ctx.reply("البوت شغال ✅"));

bot.launch();
console.log("Bot started");

// سيرفر وهمي لـ Railway
http.createServer((_, res) => { res.writeHead(200); res.end("OK"); }).listen(process.env.PORT || 3000);
