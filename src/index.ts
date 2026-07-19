import { Telegraf } from "telegraf";
import { ensureDefaultSettings, ensureDefaultDepositMethods, getBotStatus } from "./bot/settings.js";
import { registerStart } from "./bot/handlers/start.js";
import { registerWallet } from "./bot/handlers/wallet.js";
import { registerCategories, prefetchInitialContent, startBackgroundRefresher } from "./bot/handlers/categories.js";
import { registerOrders, registerOrderTextHandlers, startOrderPoller } from "./bot/handlers/orders.js";
import { registerAdmin, registerAdminTextHandlers, startPingScheduler } from "./bot/handlers/admin.js";
import * as http from "http";

const token = process.env.BOT_TOKEN;
const bot = new Telegraf(token);

// Middleware - فحص الحظر
bot.use(async (ctx, next) => {
  const status = await getBotStatus();
  const userId = ctx.from?.id;
  if (status == "off" && userId != 0) {
    const { getUser } = await import("./bot/users.js");
    const user = await getUser(userId);
    if (user?.isAdmin) {
      if (ctx.callbackQuery) return ctx.answerCbQuery("⚠️ البوت متوقف حاليا");
      return ctx.reply("⚠️ البوت متوقف حاليا من الادارة");
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

  bot.catch((err, ctx) => console.error("Bot error", err, ctx.update));
  await bot.launch({ dropPendingUpdates: false, allowedUpdates: ["message", "callback_query"] });

  prefetchInitialContent().catch(() => {});
  startBackgroundRefresher();
  startOrderPoller(bot);
  startPingScheduler(bot);

  // Keep alive ل Railway
  http.createServer((_, res) => { res.writeHead(200); res.end("OK"); }).listen(process.env.PORT || 3000);

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

main();
