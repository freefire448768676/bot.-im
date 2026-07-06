import { Telegraf } from "telegraf";
import * as http from "http";
import express from "express"; // 1. حطيناه فوق
import { logger } from "../lib/logger";
import { ensureDefaults } from "./settings";
import { ensureDefaultDepositMethods, registerWallet } from "./handlers/wallet";
import { registerStart, registerCommands } from "./handlers/start";
import {
  prefetchInitialContent,
  registerCategories,
  startBackgroundRefresher,
} from "./handlers/categories";
import { registerOrders, registerOrderTextHandlers, startOrderPoller } from "./handlers/orders";
import { registerAdmin, registerAdminTextHandlers, startPingScheduler } from "./handlers/admin";

let bot: Telegraf | null = null;

export async function startBot() {
  const token = process.env["BOT_TOKEN"];
  if (!token) {
    logger.warn("BOT_TOKEN is not set, Telegram bot will not start.");
    return;
  }
  await ensureDefaults();
  await ensureDefaultDepositMethods();

  bot = new Telegraf(token, { handlerTimeout: 60_000 });

  const _rateMap = new Map<number, number[]>();
  bot.use((ctx, next) => {
    const uid = ctx.from?.id;
    if (!uid) return next();
    const now = Date.now();
    const times = (_rateMap.get(uid) ?? []).filter((t) => now - t < 3_000);
    if (times.length >= 4) {
      if (ctx.callbackQuery)
        (ctx as import("telegraf").Context).answerCbQuery("⏱️ الرجاء الانتظار لحظة...").catch(() => {});
      return;
    }
    times.push(now);
    _rateMap.set(uid, times);
    if (_rateMap.size > 50_000) {
      for (const [k, v] of _rateMap)
        if (v.every((t) => now - t > 3_000)) _rateMap.delete(k);
    }
    return next();
  });

  registerStart(bot);
  registerCategories(bot);
  registerWallet(bot);
  registerOrders(bot);
  registerAdmin(bot);

  registerOrderTextHandlers(bot);
  registerAdminTextHandlers(bot);

  bot.catch((err, ctx) => {
    logger.error({ err, update: ctx.update }, "telegraf error");
  });

  await registerCommands(bot);

  prefetchInitialContent().catch(() => {});
  startBackgroundRefresher();

  bot.launch({
    dropPendingUpdates: false,
    allowedUpdates: ["message", "callback_query"],
  }).catch((err) => {
    logger.error({ err }, "bot.launch failed");
  });
  logger.info("Telegram bot launched (long polling)");

  startOrderPoller(bot);
  startPingScheduler(bot);

  process.once("SIGINT", () => bot?.stop("SIGINT"));
  process.once("SIGTERM", () => bot?.stop("SIGTERM"));

  process.on("uncaughtException", (err) => {
    logger.error({ err }, "uncaughtException — continuing");
  });
  process.on("unhandledRejection", (reason) => {
    logger.error({ reason }, "unhandledRejection — continuing");
  });

  setInterval(() => {
    const port = Number(process.env["PORT"] ?? "8080");
    const req = http.get({ hostname: "localhost", port, path: "/health", timeout: 5000 }, () => {});
    req.on("error", () => {});
    req.end();
  }, 4 * 60_000).unref();
}

export function getBot() {
  return bot;
}

// ===== 2. ضيف هاد بس باخر الملف =====
const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => res.send("Bot is running"));
app.get("/health", (req, res) => res.send("OK"));

app.listen(PORT, "0.0.0.0", () => {
  logger.info(`Health server running on port ${PORT}`);
});
