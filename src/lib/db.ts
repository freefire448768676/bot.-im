import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pgTable, serial, text, numeric, integer, boolean } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client);

// جداول
export const settingsTable = pgTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

export const categoryOverridesTable = pgTable('category_overrides', {
  categoryId: integer('category_id').primaryKey(),
  customName: text('custom_name'),
  hidden: boolean('hidden').default(false),
  customMarkupPercent: numeric('custom_markup_percent'),
  sortOrder: integer('sort_order').default(0),
});

export const usersTable = pgTable('users', {
  id: integer('id').primaryKey(),
  isAdmin: boolean('is_admin').default(false),
  customMarkupPercent: numeric('custom_markup_percent'),
});

export const productsTable = pgTable('products', {
  id: serial('id').primaryKey(),
  parent_id: integer('parent_id'),
  name: text('name').notNull(),
  base_price: numeric('base_price'),
  price: numeric('price'),
});

// دوال
export async function ensureDefaultSettings() {
  await db.insert(settingsTable).values({key: 'bot_status', value: 'on'}).onConflictDoNothing();
}
export async function ensureDefaultDepositMethods() {}

export async function getBotStatus() {
  const [res] = await db.select().from(settingsTable).where(eq(settingsTable.key, 'bot_status'));
  return res?.value || 'on';
}

export async function getUser(id: number) {
  const [res] = await db.select().from(usersTable).where(eq(usersTable.id, id));
  return res;
}

export async function listAdmins() {
  const res = await db.select().from(usersTable).where(eq(usersTable.isAdmin, true));
  return res.map(u => u.id);
}
