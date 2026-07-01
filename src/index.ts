import { startBot } from "./bot/index.js";

startBot().catch((err) => {
  console.error("Failed to start bot:", err);
  process.exit(1);
});
