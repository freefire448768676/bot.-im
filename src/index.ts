import { Telegraf } from "telegraf";
import rateLimit from "telegraf-ratelimit";
import { ensureDefaultSettings, ensureDefaultDepositMethods, getBotStatus } from "./lib/db/index.js";
import { registerStart } from "./bot/handlers/start.js";
import { registerWallet } from "./bot/handlers/wallet.js";
import { registerCategories, prefetchInitialContent, startBackgroundRefresher } from "./bot/handlers/categories.js";
import { registerOrders, registerOrderTextHandlers, startOrderPoller } from "./bot/handlers/orders.js";
import { registerAdmin, registerAdminTextHandlers, startPingScheduler } from "./bot/handlers/admin.js";
import * as http from "http";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is not set");

const bot = new Telegraf(token);

// Rate Limit: 3 رسائل بالثانية
const limitConfig = {
  window: 1000,
  limit: 3,
  onLimitExceeded: (ctx: any) => ctx.reply("⏳ انتظر قليلاً ثم أعد المحاولة")
};
bot.use(rateLimit(limitConfig));

// Middleware - فحص عمل البوت
bot.use(async (ctx, next) => {
  const status = await getBotStatus();
  const userId = ctx.from?.id;
  if (status == "off" && userId) {
    const { getUser } = await import("./lib/db/index.js");
    const user = await getUser(userId);
    if (!user?.isAdmin) {
      if (ctx.callbackQuery) return ctx.answerCbQuery("🚫 البوت متوقف مؤقتاً للصيانة");
      return ctx.reply("🚫 البوت متوقف مؤقتاً للصيانة. يرجى المحاولة لاحقاً.");
    }
  }
  return next();
});

async function main() {
  await ensureDefaultSettings();
  await ensureDefaultDepositMethods();

  registerStart(bot);
  registerCategories(bot);
  registerWallet(bot);
  registerOrders(bot);
  registerAdmin(bot);
  registerOrderTextHandlers(bot);
  registerAdminTextHandlers(bot);

  // معالجة الاخطاء
  process.on("uncaughtException", (e) => console.error("uncaughtException", e));
  process.on("unhandledRejection", (e) => console.error("unhandledRejection", e));
  bot.catch((err, ctx) => console.error("Bot error", err, ctx.update));

  await bot.launch({ dropPendingUpdates: false, allowedUpdates: ["message", "callback_query"] });

  prefetchInitialContent().catch(() => {});
  startBackgroundRefresher();
  startOrderPoller(bot);
  startPingScheduler(bot);

  // سيرفر خفيف ل Railway + UptimeRobot
  http.createServer((_, res) => { res.writeHead(200); res.end("OK"); }).listen(process.env.PORT || 3000);

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("unhandledRejection", () => bot.stop("SIGTERM"));
}

main();
