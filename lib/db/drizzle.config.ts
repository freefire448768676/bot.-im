import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/src/users.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
