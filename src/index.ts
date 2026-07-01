import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { ensureDefaults } from "@workspace/db";
import { ensureDefaultDepositMethods } from "./bot/handlers/wallet.js";
import { registerStart, registerCommands } from "./bot/handlers/start.js";
import { registerCategories } from "./bot/handlers/categories.js";
import { registerOrders, startOrderPoller } from "./bot/handlers/orders.js";
import { registerAdmin, startPingScheduler } from "./bot/handlers/admin.js";

dotenv.config();

async function main() {
  const token = process.env.BOT_TOKEN;
  if (!token) throw new Error("BOT_TOKEN not set");
  
  await ensureDefaults();
  await ensureDefaultDepositMethods();

  const bot = new Telegraf(token);

  registerStart(bot);
  registerCategories(bot);
  registerOrders(bot);
  registerAdmin(bot);
  
  await registerCommands(bot);
  
  bot.launch();
  console.log("Bot is running with long polling");
  
  startOrderPoller(bot);
  startPingScheduler(bot);
  
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

main().catch(console.error);
