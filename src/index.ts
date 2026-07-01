import { startBot } from "./bot/index.js";

void startBot().catch((err) => {
  console.error("Failed to start bot:", err);
});
