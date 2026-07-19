import { Telegraf } from "telegraf";
import { ensureDefaultSettings, ensureDefaultDepositMethods, getBotStatus, getUser } from "./lib/db.js";
import { registerStart } from "./bot/handlers/start.js";
import { registerWallet } from "./bot/handlers/wallet.js";
import { registerCategories, prefetchInitialContent, startBackgroundRefresher } from "./bot/handlers/categories.js";
import { registerOrders, registerOrderTextHandlers, startOrderPoller } from "./bot/handlers/orders.js";
import { registerAdmin, registerAdminTextHandlers, startPingScheduler } from "./bot/handlers/admin.js";
import * as http from "http";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is not set");

const bot = new Telegraf(token);

// Middleware - فحص عمل البوت
bot.use(async (ctx, next) => {
  const status = await getBotStatus();
  const userId = ctx.from?.id;
  if (status === "off" && userId) {
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

  process.on("uncaughtException", (e) => console.error("uncaughtException", e));
  process.on("unhandledRejection", (e) => console.error("unhandledRejection", e));
  bot.catch((err, ctx) => console.error("Bot error", err, ctx.update));

  await bot.launch({ dropPendingUpdates: false, allowedUpdates: ["message", "callback_query"] });

  prefetchInitialContent().catch(() => {});
  startBackgroundRefresher();
  startOrderPoller(bot);
  startPingScheduler(bot);

  http.createServer((_, res) => { res.writeHead(200); res.end("OK"); }).listen(process.env.PORT || 3000);

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

main();
