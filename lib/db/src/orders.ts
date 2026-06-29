import { pgTable, serial, bigint, integer, text, numeric, jsonb, timestamp } from "drizzle-orm/pg-core";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  qty: numeric("qty", { precision: 14, scale: 4 }).notNull(),
  params: jsonb("params").notNull().default({}),
  priceUsd: numeric("price_usd", { precision: 14, scale: 4 }).notNull(),
  oranosOrderId: text("oranos_order_id"),
  oranosUuid: text("oranos_uuid").notNull().unique(),
  status: text("status").notNull().default("pending"),
  apiResponse: jsonb("api_response"),
  deliveredCode: text("delivered_code"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Order = typeof ordersTable.$inferSelect;
export type InsertOrder = typeof ordersTable.$inferInsert;
