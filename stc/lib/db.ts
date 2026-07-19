import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import { pgTable, serial, text, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
export const db = drizzle(pool);

// ========== SCHEMA ==========
export const settingsTable = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value"),
});

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey(),
  username: text("username"),
  firstName: text("first_name"),
  isAdmin: boolean("is_admin").default(false),
  balance: numeric("balance").default("0"),
  customMarkupPercent: numeric("custom_markup_percent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categoryOverridesTable = pgTable("category_overrides", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id"),
  customName: text("custom_name"),
  hidden: boolean("hidden").default(false),
  customMarkupPercent: numeric("custom_markup_percent"),
  sortOrder: integer("sort_order").default(0),
});

export const depositMethodsTable = pgTable("deposit_methods", {
  id: serial("id").primaryKey(),
  name: text("name"),
  enabled: boolean("enabled").default(true),
});

// ========== FUNCTIONS ==========
export async function ensureDefaultSettings() {
  await db.insert(settingsTable).values({key: "bot_status", value: "on"}).onConflictDoNothing();
  await db.insert(settingsTable).values({key: "global_markup", value: "0"}).onConflictDoNothing();
}

export async function ensureDefaultDepositMethods() {
  await db.insert(depositMethodsTable).values({name: "USDT", enabled: true}).onConflictDoNothing();
}

export async function getBotStatus() {
  const res = await db.select().from(settingsTable).where(eq(settingsTable.key, "bot_status"));
  return res[0]?.value || "on";
}

export async function getUser(userId: number) {
  const res = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  return res[0];
}
