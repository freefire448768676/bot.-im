import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { registerStart } from "./bot/handlers/start";
import { registerCategories } from "./bot/handlers/categories";
import { registerOrders } from "./bot/handlers/orders";
import { registerAdmin } from "./bot/handlers/admin";
import { ensureDefaultDepositMethods } from "./bot/handlers/wallet";
import { startOrderPoller, startPingScheduler } from "./bot/handlers/admin";

dotenv.config();

async function main() {
  const token = process.env.BOT_TOKEN;
  if (!token) throw new Error("BOT_TOKEN not set");

  await ensureDefaultDepositMethods();

  const bot = new Telegraf(token);

  registerStart(bot);
  registerCategories(bot);
  registerOrders(bot);
  registerAdmin(bot);

  bot.launch();
  console.log("Bot is running with long polling");

  startOrderPoller();
  startPingScheduler();

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

main().catch(console.error);
