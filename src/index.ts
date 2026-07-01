import { startBot } from "./bot/index.js";

void startBot().catch((err: unknown) => {
  console.error("Failed to start bot:", err);
});
