import { Telegraf } from "telegraf";
import { ensureDefaults } from "../artifacts/api-server/src/bot/settings.js";
import { ensureDefaultDepositMethods } from "../artifacts/api-server/src/bot/handlers/wallet.js";
import { registerStart, registerCommands } from "../artifacts/api-server/src/bot/handlers/start.js";
import { prefetchInitialContent, registerCategories, startBackgroundRefresher } from "../artifacts/api-server/src/bot/handlers/categories.js";
import { registerOrders, registerOrderTextHandlers, startOrderPoller } from "../artifacts/api-server/src/bot/handlers/orders.js";
import { registerAdmin, registerAdminTextHandlers, startPingScheduler } from "../artifacts/api-server/src/bot/handlers/admin.js";
import { logger } from "../artifacts/api-server/src/lib/logger.js";

let bot;

async function initBot() {
  if (bot) return bot;
  
  const token = process.env.BOT_TOKEN;
  if (!token) throw new Error("BOT_TOKEN is not set");

  await ensureDefaults();
  await ensureDefaultDepositMethods();

  bot = new Telegraf(token, { handlerTimeout: 60000 });

  const _rateMap = new Map();
  bot.use((ctx, next) => {
    const uid = ctx.from?.id;
    if (!uid) return next();
    const now = Date.now();
    const times = (_rateMap.get(uid) ?? []).filter((t) => now - t < 3000);
    if (times.length >= 4) {
      if (ctx.callbackQuery) ctx.answerCbQuery("⏱️ الرجاء الانتظار لحظة...").catch(() => {});
      return;
    }
    times.push(now);
    _rateMap.set(uid, times);
    if (_rateMap.size > 50000) {
      for (const [k, v] of _rateMap) if (v.every((t) => now - t > 3000)) _rateMap.delete(k);
    }
    return next();
  });

  registerStart(bot);
  registerCategories(bot);
  registerOrders(bot);
  registerAdmin(bot);
  registerOrderTextHandlers(bot);
  registerAdminTextHandlers(bot);

  bot.catch((err, ctx) => logger.error({ err, update: ctx.update }, "telegraf error"));
  await registerCommands(bot);
  
  prefetchInitialContent().catch(() => {});
  startBackgroundRefresher();
  
  return bot;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(200).send("OK");

  try {
    const bot = await initBot();
    await bot.handleUpdate(req.body);
    return res.status(200).json({ ok: true });
  } catch (err) {
    logger.error({ err }, "webhook handler error");
    return res.status(500).json({ ok: false });
  }
}
