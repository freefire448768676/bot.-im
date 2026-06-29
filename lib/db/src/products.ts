import { pgTable, serial, text, numeric, jsonb, boolean } from "drizzle-orm/pg-core";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  oranosProductId: text("oranos_product_id").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  priceUsd: numeric("price_usd", { precision: 14, scale: 4 }).notNull(),
  markupPercent: numeric("markup_percent", { precision: 6, scale: 2 }).notNull().default("0"),
  paramsSchema: jsonb("params_schema").notNull().default({}),
  isActive: boolean("is_active").notNull().default(true),
});

export type Product = typeof productsTable.$inferSelect;
export type InsertProduct = typeof productsTable.$inferInsert;
