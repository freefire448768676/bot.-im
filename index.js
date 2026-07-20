// ============================================================
//  متجر المروان — بوت تيليجرام
//  ملف موحد للنشر على Railway / GitHub
// ============================================================
"use strict";

const { Telegraf, Markup } = require("telegraf");
const { drizzle } = require("drizzle-orm/node-postgres");
const {
  pgTable, bigint, text, numeric, boolean, timestamp,
  serial, integer, jsonb,
} = require("drizzle-orm/pg-core");
const { eq, sql, desc, or, ilike, inArray, and, not, gt } = require("drizzle-orm");
const { Pool } = require("pg");
const axios = require("axios");
const express = require("express");
const http = require("http");
const crypto = require("crypto");

// ── ENV check ────────────────────────────────────────────────
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is required");
  process.exit(1);
}

// ── DB setup ─────────────────────────────────────────────────
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ── Schema ───────────────────────────────────────────────────
const usersTable = pgTable("users", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  username: text("username"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  balance: numeric("balance", { precision: 14, scale: 4 }).notNull().default("0"),
  status: text("status").notNull().default("active"),
  isAdmin: boolean("is_admin").notNull().default(false),
  isSuperAdmin: boolean("is_super_admin").notNull().default(false),
  adminAuthedAt: timestamp("admin_authed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  customMarkupPercent: numeric("custom_markup_percent", { precision: 6, scale: 2 }),
});

const productOverridesTable = pgTable("product_overrides", {
  productId: integer("product_id").primaryKey(),
  productName: text("product_name"),
  customName: text("custom_name"),
  customCategoryId: integer("custom_category_id"),
  customMarkupPercent: numeric("custom_markup_percent", { precision: 6, scale: 2 }),
  customPriceUsd: numeric("custom_price_usd", { precision: 14, scale: 4 }),
  hidden: boolean("hidden").notNull().default(false),
  instructions: text("instructions"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

const categoryOverridesTable = pgTable("category_overrides", {
  categoryId: integer("category_id").primaryKey(),
  customName: text("custom_name"),
  hidden: boolean("hidden").notNull().default(false),
  customMarkupPercent: numeric("custom_markup_percent", { precision: 6, scale: 2 }),
  sortOrder: integer("sort_order"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

const ordersTable = pgTable("orders", {
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

const depositMethodsTable = pgTable("deposit_methods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  identifier: text("identifier").notNull(),
  instructions: text("instructions").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

const depositRequestsTable = pgTable("deposit_requests", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
  methodId: integer("method_id").notNull(),
  methodName: text("method_name").notNull(),
  payerNumber: text("payer_number"),
  screenshotFileId: text("screenshot_file_id").notNull(),
  amount: numeric("amount", { precision: 14, scale: 4 }),
  status: text("status").notNull().default("pending"),
  processedBy: bigint("processed_by", { mode: "number" }),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

const botSettingsTable = pgTable("bot_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

const broadcastsTable = pgTable("broadcasts", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  sentBy: bigint("sent_by", { mode: "number" }).notNull(),
  sentCount: integer("sent_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

const manualOrdersTable = pgTable("manual_orders", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  priceUsd: numeric("price_usd", { precision: 14, scale: 4 }).notNull(),
  note: text("note"),
  status: text("status").notNull().default("pending"),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

const manualProductsTable = pgTable("manual_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  categoryId: integer("category_id").notNull().default(0),
  categoryIsVirtual: boolean("category_is_virtual").notNull().default(false),
  priceUsd: numeric("price_usd", { precision: 14, scale: 4 }).notNull().default("0"),
  apiProductId: integer("api_product_id"),
  instructions: text("instructions"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

const virtualCategoriesTable = pgTable("virtual_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  parentId: integer("parent_id").notNull().default(0),
  position: integer("position").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

const contactLinksTable = pgTable("contact_links", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  link: text("link").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

const schema = {
  usersTable, productOverridesTable, categoryOverridesTable, ordersTable,
  depositMethodsTable, depositRequestsTable, botSettingsTable, broadcastsTable,
  manualOrdersTable, manualProductsTable, virtualCategoriesTable, contactLinksTable,
};

const db = drizzle(pool, { schema });

// ============================================================
//  SETTINGS
// ============================================================
const settingsCache = new Map();
let settingsLoaded = false;

const DEFAULTS = {
  markup_percent: "3",
  exchange_rate: "132",
  bot_status: "on",
  currency_label: "ل.س",
  excluded_category_ids: "6,81,561",
  excluded_product_keywords: "سيرتل كاش,سيريتل كاش,syriatel cash,mtn كاش,mtn cash,ام تي ان كاش",
  social_markup_percent: "3",
  social_min_qty: "500",
  social_max_qty: "10000",
  social_keywords: "سوشل,social,تواصل اجتماعي,اجتماعي,انستغرام,instagram,تيك توك,tiktok,فيسبوك,facebook,تويتر,twitter,يوتيوب,youtube,تليجرام,telegram,سناب,snap",
  ai_keywords: "ذكاء اصطناعي,chatgpt,gpt,openai,claude,gemini,midjourney,perplexity,ai ",
  admin_password: "0941408061@0941408061aM",
  auto_ping_enabled: "off",
  auto_ping_interval_min: "5",
  auto_ping_target_user_id: "",
  auto_ping_last_sent: "0",
  btn_back_label: "⬅️ رجوع",
  btn_home_label: "🏠 الرئيسية",
  btn_prev_label: "⬅️ السابق",
  btn_next_label: "التالي ➡️",
};

async function loadAllSettings() {
  const rows = await db.select().from(botSettingsTable);
  settingsCache.clear();
  for (const r of rows) settingsCache.set(r.key, r.value);
  settingsLoaded = true;
}

async function ensureDefaults() {
  if (!settingsLoaded) await loadAllSettings();
  for (const [k, v] of Object.entries(DEFAULTS)) {
    if (!settingsCache.has(k)) {
      await db.insert(botSettingsTable).values({ key: k, value: v }).onConflictDoNothing();
      settingsCache.set(k, v);
    }
  }
}

async function getSetting(key) {
  if (!settingsLoaded) await loadAllSettings();
  return settingsCache.get(key) ?? DEFAULTS[key] ?? "";
}

async function setSetting(key, value) {
  await db.insert(botSettingsTable).values({ key, value })
    .onConflictDoUpdate({ target: botSettingsTable.key, set: { value, updatedAt: new Date() } });
  settingsCache.set(key, value);
}

async function deleteSetting(key) {
  await db.delete(botSettingsTable).where(eq(botSettingsTable.key, key));
  settingsCache.delete(key);
}

async function getMarkupPercent() {
  const n = Number(await getSetting("markup_percent"));
  return Number.isFinite(n) ? n : 3;
}
async function getExchangeRate() {
  const n = Number(await getSetting("exchange_rate"));
  return Number.isFinite(n) && n > 0 ? n : 132;
}
async function getBotStatus() {
  return (await getSetting("bot_status")) === "off" ? "off" : "on";
}
async function getExcludedCategoryIds() {
  const v = await getSetting("excluded_category_ids");
  return new Set(v.split(",").map(s => Number(s.trim())).filter(n => Number.isFinite(n) && n > 0));
}
async function getExcludedKeywords() {
  const v = await getSetting("excluded_product_keywords");
  return v.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
}
async function getSocialKeywords() {
  const v = await getSetting("social_keywords");
  return v.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
}
async function getSocialMarkupPercent() {
  const n = Number(await getSetting("social_markup_percent"));
  return Number.isFinite(n) ? n : 3;
}
async function getSocialMinQty() {
  const n = Number(await getSetting("social_min_qty"));
  return Number.isFinite(n) && n > 0 ? n : 500;
}
async function getSocialMaxQty() {
  const n = Number(await getSetting("social_max_qty"));
  return Number.isFinite(n) && n > 0 ? n : 10000;
}
async function getAdminPassword() { return getSetting("admin_password"); }
async function getBtnBackLabel() { return (await getSetting("btn_back_label")) || "⬅️ رجوع"; }
async function getBtnHomeLabel() { return (await getSetting("btn_home_label")) || "🏠 الرئيسية"; }
async function getBtnPrevLabel() { return (await getSetting("btn_prev_label")) || "⬅️ السابق"; }
async function getBtnNextLabel() { return (await getSetting("btn_next_label")) || "التالي ➡️"; }

function isSocialProduct(name, categoryName, keywords) {
  const hay = `${name ?? ""} ${categoryName ?? ""}`.toLowerCase();
  return keywords.some(k => k && hay.includes(k));
}

// ============================================================
//  SESSION STATE
// ============================================================
const sessions = new Map();

function getStep(userId) { return sessions.get(userId) ?? { kind: "idle" }; }
function setStep(userId, step) {
  if (step.kind === "idle") sessions.delete(userId);
  else sessions.set(userId, step);
}
function clearStep(userId) { sessions.delete(userId); }

// ============================================================
//  USER FUNCTIONS
// ============================================================
const userCache = new Map();
const USER_CACHE_TTL = 30_000;

function userCacheGet(id) {
  const hit = userCache.get(id);
  if (hit && hit.exp > Date.now()) return hit.u;
  return undefined;
}
function userCacheSet(id, u) {
  userCache.set(id, { u, exp: Date.now() + USER_CACHE_TTL });
}
function invalidateUserCache(id) { userCache.delete(id); }

async function upsertUser(u) {
  const existing = await db.select().from(usersTable).where(eq(usersTable.id, u.id)).limit(1);
  let result;
  if (existing.length === 0) {
    const inserted = await db.insert(usersTable).values({
      id: u.id, username: u.username ?? null,
      firstName: u.first_name ?? null, lastName: u.last_name ?? null,
    }).returning();
    result = inserted[0];
  } else {
    const updated = await db.update(usersTable).set({
      username: u.username ?? existing[0].username,
      firstName: u.first_name ?? existing[0].firstName,
      lastName: u.last_name ?? existing[0].lastName,
    }).where(eq(usersTable.id, u.id)).returning();
    result = updated[0];
  }
  userCacheSet(u.id, result);
  return result;
}

async function getUser(id) {
  const cached = userCacheGet(id);
  if (cached !== undefined) return cached;
  const rows = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
  const u = rows[0] ?? null;
  userCacheSet(id, u);
  return u;
}

async function adjustBalance(id, deltaUsd) {
  invalidateUserCache(id);
  const updated = await db.update(usersTable)
    .set({ balance: sql`balance + ${deltaUsd}` })
    .where(eq(usersTable.id, id)).returning();
  const u = updated[0] ?? null;
  if (u) userCacheSet(id, u);
  return u;
}

async function setStatus(id, status) {
  invalidateUserCache(id);
  await db.update(usersTable).set({ status }).where(eq(usersTable.id, id));
}

async function setAdmin(id, isAdmin, isSuperAdmin) {
  invalidateUserCache(id);
  await db.update(usersTable)
    .set({ isAdmin, ...(isSuperAdmin !== undefined ? { isSuperAdmin } : {}) })
    .where(eq(usersTable.id, id));
}

async function markAdminAuthed(id) {
  invalidateUserCache(id);
  await db.update(usersTable).set({ adminAuthedAt: new Date() }).where(eq(usersTable.id, id));
}

async function listUsers(offset = 0, limit = 20) {
  return db.select().from(usersTable).orderBy(desc(usersTable.createdAt)).limit(limit).offset(offset);
}

async function countUsers() {
  const r = await db.select({ c: sql`count(*)::int` }).from(usersTable);
  return r[0]?.c ?? 0;
}

async function searchUser(query) {
  const idNum = Number(query.replace(/[^0-9]/g, ""));
  const u = query.replace(/^@/, "");
  return db.select().from(usersTable).where(
    or(
      Number.isFinite(idNum) && idNum > 0 ? eq(usersTable.id, idNum) : undefined,
      ilike(usersTable.username, `%${u}%`),
      ilike(usersTable.firstName, `%${u}%`),
    )
  ).limit(20);
}

async function listAdmins() {
  return db.select().from(usersTable).where(eq(usersTable.isAdmin, true));
}

async function setUserMarkup(id, markupPercent) {
  invalidateUserCache(id);
  await db.update(usersTable)
    .set({ customMarkupPercent: markupPercent === null ? null : String(markupPercent) })
    .where(eq(usersTable.id, id));
}

async function getSuperAdmin() {
  const rows = await db.select().from(usersTable).where(eq(usersTable.isSuperAdmin, true)).limit(1);
  return rows[0] ?? null;
}

// ============================================================
//  FORMAT HELPERS
// ============================================================
async function loadOverrideMap(productIds) {
  const map = new Map();
  if (productIds.length === 0) return map;
  const rows = await db.select().from(productOverridesTable)
    .where(inArray(productOverridesTable.productId, productIds));
  for (const r of rows) {
    map.set(r.productId, {
      customPriceUsd: r.customPriceUsd != null ? Number(r.customPriceUsd) : null,
      customMarkupPercent: r.customMarkupPercent != null ? Number(r.customMarkupPercent) : null,
      customName: r.customName,
      customCategoryId: r.customCategoryId,
      hidden: r.hidden,
      instructions: r.instructions,
    });
  }
  return map;
}

async function loadAllOverrides() {
  const rows = await db.select().from(productOverridesTable);
  const map = new Map();
  for (const r of rows) {
    map.set(r.productId, {
      customPriceUsd: r.customPriceUsd != null ? Number(r.customPriceUsd) : null,
      customMarkupPercent: r.customMarkupPercent != null ? Number(r.customMarkupPercent) : null,
      customName: r.customName,
      customCategoryId: r.customCategoryId,
      hidden: r.hidden,
      instructions: r.instructions,
    });
  }
  return map;
}

function formatBalance(usd, rate) {
  return `${usd.toFixed(2)}$ | ${Math.round(usd * rate).toLocaleString("en-US")} ل.س`;
}

// ============================================================
//  ORANOS API
// ============================================================
const ORANOS_BASE = process.env.ORANOS_API_BASE ?? "https://api.oranosmarket.com";
const ORANOS_TOKEN = process.env.ORANOS_API_TOKEN ?? "";

const oranosClient = axios.create({
  baseURL: ORANOS_BASE, timeout: 15000,
  headers: { "api-token": ORANOS_TOKEN, Accept: "application/json" },
});

let _maintenanceMode = false;
function isMaintenanceMode() { return _maintenanceMode; }

function wrapRequest(fn) {
  return fn().then(v => { _maintenanceMode = false; return v; }).catch(err => {
    const status = err?.response?.status;
    if (status === 503 || status === 502 || status === 529) _maintenanceMode = true;
    throw err;
  });
}

async function fetchContent(parentId) {
  const res = await wrapRequest(() => oranosClient.get(`/client/api/content/${parentId}`));
  const data = res.data ?? {};
  _maintenanceMode = false;
  return {
    products: Array.isArray(data.products) ? data.products : [],
    categories: Array.isArray(data.categories) ? data.categories : [],
  };
}

async function fetchAllProducts() {
  const res = await wrapRequest(() => oranosClient.get("/client/api/products"));
  return Array.isArray(res.data) ? res.data : [];
}

async function placeOrder(productId, params, orderUuid) {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) search.set(k, String(v));
  search.set("order_uuid", orderUuid);
  try {
    const res = await wrapRequest(() =>
      oranosClient.get(`/client/api/newOrder/${productId}/params?${search.toString()}`)
    );
    return res.data;
  } catch (err) {
    if (err?.response?.data) return err.response.data;
    return { status: "ERR", message: "Network error" };
  }
}

async function checkOrder(orderId, byUuid = false) {
  const search = new URLSearchParams();
  search.set("orders", `[${orderId}]`);
  if (byUuid) search.set("uuid", "1");
  const res = await wrapRequest(() => oranosClient.get(`/client/api/check?${search.toString()}`));
  return res.data;
}

function extractDeliveredCode(resp) {
  const d = resp?.data;
  if (!d) return null;
  const candidates = [];
  if (d.data) candidates.push(d.data);
  if (d.replay_api) candidates.push(d.replay_api);
  const lines = [];
  const visit = v => {
    if (v == null) return;
    if (typeof v === "string" && v.trim()) lines.push(v.trim());
    else if (typeof v === "number") lines.push(String(v));
    else if (Array.isArray(v)) v.forEach(visit);
    else if (typeof v === "object") {
      for (const [k, val] of Object.entries(v)) {
        if (val == null) continue;
        if (typeof val === "object") visit(val);
        else lines.push(`${k}: ${val}`);
      }
    }
  };
  for (const c of candidates) visit(c);
  const out = lines.filter(Boolean).join("\n").trim();
  return out || null;
}

function getProductApiNotes(p) {
  const v = (p.notes ?? p.description ?? p.details ?? "").trim();
  return v || null;
}

// ============================================================
//  AI SUPPORT
// ============================================================
const convHistory = new Map();

const AI_SYSTEM_PROMPT = `أنت مساعد ذكاء اصطناعي متخصص في إدارة متجر "متجر المروان" على تيليجرام.
البوت يبيع منتجات رقمية عبر منصة oranosmarket.com.
أجب دائماً بالعربية. كن دقيقاً وعملياً. إذا لم تعرف الإجابة، قل ذلك بصراحة.`;

async function callAiSupport(userId, userMessage) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return buildSmartFaq(userMessage);
  const hist = convHistory.get(userId) ?? [];
  hist.push({ role: "user", content: userMessage });
  if (hist.length > 20) hist.splice(0, hist.length - 20);
  convHistory.set(userId, hist);
  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini", max_completion_tokens: 1024,
        messages: [{ role: "system", content: AI_SYSTEM_PROMPT }, ...hist],
      }),
    });
    if (!resp.ok) { hist.pop(); convHistory.set(userId, hist); return buildSmartFaq(userMessage); }
    const data = await resp.json();
    const reply = data.choices?.[0]?.message?.content?.trim() ?? buildSmartFaq(userMessage);
    hist.push({ role: "assistant", content: reply });
    convHistory.set(userId, hist);
    return reply;
  } catch {
    hist.pop(); convHistory.set(userId, hist);
    return buildSmartFaq(userMessage);
  }
}

function clearAiHistory(userId) { convHistory.delete(userId); }
function hasAiKey() { return !!process.env.OPENAI_API_KEY; }

function buildSmartFaq(msg) {
  const q = msg.toLowerCase().trim();
  if ((q.includes("سعر") && q.includes("صرف")) || q.includes("ليرة"))
    return `💱 *تعديل سعر الصرف:*\n1. لوحة الإدارة\n2. ⚙️ الإعدادات\n3. 💱 تعديل سعر الصرف\n4. أرسل القيمة الجديدة`;
  if (q.includes("ربح") || q.includes("markup"))
    return `📈 *تعديل نسبة الربح:*\nالإعدادات ← ✏️ تعديل الربح العام\nأرسل رقماً فقط (مثال: 10 يعني 10%)`;
  if (q.includes("رصيد"))
    return `💰 *تعديل رصيد مستخدم:*\nلوحة الإدارة ← 🔍 بحث مستخدم\nاضغط ➕ أو ➖`;
  if (q.includes("إيداع") || q.includes("شحن"))
    return `💳 *إدارة الإيداعات:*\nلوحة الإدارة ← 📥 طلبات الإيداع`;
  return `🤖 *مساعد متجر المروان*\n\nاكتب سؤالك وسأجيبك فوراً 💡\n` +
    (process.env.OPENAI_API_KEY ? `✅ المساعد الذكي مفعّل` : `⚠️ أضف OPENAI_API_KEY لتفعيل الذكاء الاصطناعي`);
}

// ============================================================
//  KEYBOARDS
// ============================================================
function mainMenu(isAdmin) {
  const rows = [
    [Markup.button.callback("🛒 المنتجات", "cat:0:1:0"), Markup.button.callback("💰 رصيدي", "balance")],
    [Markup.button.callback("💳 إيداع", "deposit"), Markup.button.callback("📦 طلباتي", "myorders:1")],
    [Markup.button.callback("📞 الدعم", "support"), Markup.button.callback("🔄 /start", "home")],
  ];
  if (isAdmin) rows.push([Markup.button.callback("👑 لوحة الإدارة", "admin:menu")]);
  else rows.push([Markup.button.callback("🔐 تسجيل دخول الإدارة", "admin:loginPrompt")]);
  return Markup.inlineKeyboard(rows);
}

// ============================================================
//  TG HELPERS
// ============================================================
async function sendOrEdit(ctx, text, extra) {
  const cb = ctx.callbackQuery;
  const msg = cb?.message;
  if (msg && !("photo" in msg && msg.photo)) {
    try { await ctx.editMessageText(text, extra); return; } catch (err) {
      const desc = err?.description ?? "";
      if (/not modified/i.test(desc)) return;
    }
  }
  await ctx.reply(text, extra);
}

async function clearInlineKeyboard(ctx) {
  try { await ctx.editMessageReplyMarkup(undefined); } catch { /* ignore */ }
}

// ============================================================
//  PRODUCT / CATEGORY CACHE
// ============================================================
const PAGE_SIZE = 8;
let productsCache = null;
const PRODUCTS_TTL = 5 * 60_000;
const contentCache = new Map();
const CONTENT_TTL = 5 * 60_000;
let allOverridesCache = null;
const OVERRIDES_TTL = 60_000;

async function getCachedProducts() {
  if (productsCache && productsCache.expiry > Date.now()) return productsCache.products;
  const products = await fetchAllProducts();
  productsCache = { products, expiry: Date.now() + PRODUCTS_TTL };
  return products;
}

async function getAllOverridesCached() {
  if (allOverridesCache && allOverridesCache.expiry > Date.now()) return allOverridesCache.map;
  const map = await loadAllOverrides();
  allOverridesCache = { map, expiry: Date.now() + OVERRIDES_TTL };
  return map;
}

function invalidateCaches() {
  productsCache = null;
  contentCache.clear();
  allOverridesCache = null;
}

async function getCachedContent(parentId) {
  const hit = contentCache.get(parentId);
  if (hit && hit.expiry > Date.now()) return hit.content;
  const content = await fetchContent(parentId);
  contentCache.set(parentId, { content, expiry: Date.now() + CONTENT_TTL });
  return content;
}

async function prefetchInitialContent() {
  try {
    await getCachedProducts();
    await getAllOverridesCached();
    await getCachedContent(0);
  } catch { /* lazy */ }
}

let refresherStarted = false;
function startBackgroundRefresher() {
  if (refresherStarted) return;
  refresherStarted = true;
  setInterval(() => {
    fetchAllProducts().then(p => { productsCache = { products: p, expiry: Date.now() + PRODUCTS_TTL }; }).catch(() => {});
    loadAllOverrides().then(m => { allOverridesCache = { map: m, expiry: Date.now() + OVERRIDES_TTL }; }).catch(() => {});
    fetchContent(0).then(c => { contentCache.set(0, { content: c, expiry: Date.now() + CONTENT_TTL }); }).catch(() => {});
  }, 4 * 60_000).unref();
}

function isExcludedProduct(p, kws) {
  const n = (p.name ?? "").toLowerCase();
  return kws.some(k => k && n.includes(k));
}

async function loadCategoryOverrides(ids) {
  if (ids.length === 0) return new Map();
  const rows = await db.select().from(categoryOverridesTable)
    .where(inArray(categoryOverridesTable.categoryId, ids));
  const m = new Map();
  for (const r of rows) m.set(r.categoryId, { customName: r.customName, hidden: r.hidden, sortOrder: r.sortOrder, customMarkupPercent: r.customMarkupPercent != null ? Number(r.customMarkupPercent) : null });
  return m;
}

async function buildVisibleCategoryIds(excludedCats, kws) {
  const all = await getCachedProducts();
  const direct = new Set();
  for (const p of all) {
    if (!p.available || isExcludedProduct(p, kws)) continue;
    const c = p.parent_id;
    if (typeof c === "number" && c > 0 && !excludedCats.has(c)) direct.add(c);
  }
  return direct;
}

async function isCategoryVisible(catId, visibleDirect) {
  if (visibleDirect.has(catId)) return true;
  const c = await getCachedContent(catId);
  for (const sub of c.categories) if (await isCategoryVisible(sub.id, visibleDirect)) return true;
  return false;
}

async function effectivePriceUsd(p, override, defaultMarkup, socialMarkup, socialKws, categoryMarkupPercent, userMarkupPercent) {
  if (override?.customPriceUsd != null) return override.customPriceUsd;
  let m;
  if (override?.customMarkupPercent != null) m = Number(override.customMarkupPercent);
  else if (categoryMarkupPercent != null) m = Number(categoryMarkupPercent);
  else if (userMarkupPercent != null) m = Number(userMarkupPercent);
  else m = defaultMarkup;
  if (isSocialProduct(p.name, p.category_name, socialKws)) m = Math.max(m, socialMarkup);
  const rawPrice = Number(p.price) || Number(p.base_price) || 0;
  return Number((rawPrice * (1 + m / 100)).toFixed(4));
}

const MAINTENANCE_MSG = "🔧 الموقع قيد الصيانة حالياً.\nسيعود البوت للعمل بأقرب وقت ممكن. شكراً لصبرك! 🙏";

// ============================================================
//  ADMIN_USERNAME
// ============================================================
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_USERNAMES_LOWER = ADMIN_USERNAME.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);

// ============================================================
//  START / MAIN MENU
// ============================================================
async function ensureUser(ctx) {
  const f = ctx.from;
  if (!f) return null;
  return upsertUser({ id: f.id, username: f.username, first_name: f.first_name, last_name: f.last_name });
}

async function showMainMenu(ctx) {
  const user = await ensureUser(ctx);
  if (!user) return;
  setStep(user.id, { kind: "idle" });
  const status = await getBotStatus();
  if (status === "off" && !user.isAdmin) { await sendOrEdit(ctx, "🚫 البوت متوقف مؤقتاً للصيانة."); return; }
  if (user.status === "banned") { await sendOrEdit(ctx, "🚫 تم حظرك من استخدام البوت."); return; }
  const rate = await getExchangeRate();
  const greeting = `أهلاً فيك في متجر المروان 🌟\n` +
    `الاسم: ${user.firstName ?? "—"}${user.username ? ` (@${user.username})` : ""}\n` +
    `الرقم التعريفي: ${user.id}\n` +
    `الرصيد: ${formatBalance(Number(user.balance), rate)}\n\nاختر من القائمة بالأسفل 👇`;
  await sendOrEdit(ctx, greeting, mainMenu(user.isAdmin));
}

async function showContactLinks(ctx) {
  const links = await db.select().from(contactLinksTable).where(eq(contactLinksTable.active, true));
  if (links.length === 0) {
    await ctx.reply(`📞 للدعم التواصل مع: @${ADMIN_USERNAME}`,
      Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
    return;
  }
  const rows = links.map(l => [Markup.button.url(l.name, l.link.startsWith("http") ? l.link : `https://t.me/${l.link.replace(/^@/, "")}`)]);
  rows.push([Markup.button.callback("🏠 الرئيسية", "home")]);
  await ctx.reply("📞 وسائل التواصل:", Markup.inlineKeyboard(rows));
}

// ============================================================
//  DEPOSIT / WALLET
// ============================================================
async function ensureDefaultDepositMethods() {
  const ex = await db.select().from(depositMethodsTable);
  if (ex.length > 0) return;
  await db.insert(depositMethodsTable).values([
    { name: "شام كاش", identifier: "02d7079d7229d8860c7d89467bfdc938", instructions: "حول المبلغ إلى رقم/معرف شام كاش أعلاه ثم أرسل:\n1) المبلغ والرقم الذي حولت منه\n2) صورة إشعار التحويل", active: true },
    { name: "سيريتل كاش", identifier: "32820534", instructions: "حول المبلغ إلى رقم سيريتل كاش أعلاه ثم أرسل:\n1) المبلغ والرقم الذي حولت منه\n2) صورة إشعار التحويل", active: true },
  ]);
}

async function showDepositMenu(ctx) {
  await ensureDefaultDepositMethods();
  const methods = await db.select().from(depositMethodsTable).where(eq(depositMethodsTable.active, true));
  if (methods.length === 0) { await ctx.reply("لا توجد طرق إيداع متاحة."); return; }
  const rows = methods.map(m => [Markup.button.callback(`💳 ${m.name}`, `dep:pick:${m.id}`)]);
  rows.push([Markup.button.callback("🏠 الرئيسية", "home")]);
  await ctx.reply("اختر طريقة الإيداع:", Markup.inlineKeyboard(rows));
}

async function notifyAdminsDeposit(ctx, depositId) {
  const r = (await db.select().from(depositRequestsTable).where(eq(depositRequestsTable.id, depositId)).limit(1))[0];
  if (!r) return;
  const admins = await listAdmins();
  const text = `🔔 طلب إيداع جديد #${r.id}\nالمستخدم: ${ctx.from?.id} ${ctx.from?.username ? "@" + ctx.from.username : ""}\n` +
    `الطريقة: ${r.methodName}\nرقم/تفاصيل المُحوِّل: ${r.payerNumber ?? "—"}`;
  const kb = Markup.inlineKeyboard([[
    Markup.button.callback("✅ موافقة", `adm:dep:approve:${r.id}`),
    Markup.button.callback("❌ رفض", `adm:dep:reject:${r.id}`),
  ]]);
  for (const a of admins) {
    try { await ctx.telegram.sendPhoto(a.id, r.screenshotFileId, { caption: text, ...kb }); } catch { /* ignore */ }
  }
}

// ============================================================
//  CATEGORY DISPLAY
// ============================================================
async function showCategory(ctx, parentId, page, backTo) {
  if (isMaintenanceMode()) {
    await sendOrEdit(ctx, MAINTENANCE_MSG, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
    return;
  }
  const user = await getUser(ctx.from.id);
  const isAdmin = !!user?.isAdmin;
  let content;
  try { content = await getCachedContent(parentId); }
  catch { await sendOrEdit(ctx, MAINTENANCE_MSG, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]])); return; }

  const excludedCats = await getExcludedCategoryIds();
  const kws = await getExcludedKeywords();
  const socialKws = await getSocialKeywords();
  const socialMarkup = await getSocialMarkupPercent();
  const visibleDirect = await buildVisibleCategoryIds(excludedCats, kws);
  const catIds = content.categories.map(c => c.id);
  const catOv = await loadCategoryOverrides(catIds);
  const candidate = content.categories.filter(c => {
    if (excludedCats.has(c.id)) return false;
    const ov = catOv.get(c.id);
    if (ov?.hidden && !isAdmin) return false;
    if (!c.name || c.name === "null") return false;
    return true;
  });
  let visibleCats = candidate;
  if (!isAdmin) {
    const checks = await Promise.all(candidate.map(async c => ({ c, ok: await isCategoryVisible(c.id, visibleDirect) })));
    visibleCats = checks.filter(x => x.ok).map(x => x.c);
  }

  const allProducts = await getCachedProducts();
  const allOv = await getAllOverridesCached();
  const movedIntoHere = [];
  const movedAwayFromHere = new Set();
  for (const [pid, ov] of allOv) {
    if (ov.customCategoryId == null) continue;
    if (ov.customCategoryId === parentId) { const p = allProducts.find(x => x.id === pid); if (p) movedIntoHere.push(p); }
    else movedAwayFromHere.add(pid);
  }
  const baseProducts = content.products.filter(p => !movedAwayFromHere.has(p.id));
  const mergedById = new Map();
  for (const p of baseProducts) mergedById.set(p.id, p);
  for (const p of movedIntoHere) mergedById.set(p.id, p);
  const merged = Array.from(mergedById.values());
  const prodIds = merged.map(p => p.id);
  const ovMap = await loadOverrideMap(prodIds);
  const visibleProds = merged.filter(p => {
    if (isExcludedProduct(p, kws)) return false;
    const ov = ovMap.get(p.id);
    if (ov?.hidden && !isAdmin) return false;
    if (!p.available && !isAdmin) return false;
    return true;
  });

  const vcRows = await db.select().from(virtualCategoriesTable).where(eq(virtualCategoriesTable.parentId, parentId));
  const virtualCats = isAdmin ? vcRows : vcRows.filter(v => v.active);
  const vcBtns = virtualCats.map(v => {
    const prefix = v.active ? "📂 " : "🔒 ";
    return Markup.button.callback(`${prefix}${v.name}`.slice(0, 60), `vcat:${v.id}:1:${parentId}`);
  });

  const manualRows = await db.select().from(manualProductsTable).where(and(
    eq(manualProductsTable.categoryId, parentId),
    eq(manualProductsTable.categoryIsVirtual, false),
    eq(manualProductsTable.active, true),
  ));
  const rate = await getExchangeRate();
  const manualBtns = manualRows.map(m => {
    const usd = Number(m.priceUsd);
    const syp = Math.round(usd * rate);
    return Markup.button.callback(`🛒 ${m.name} • ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س`.slice(0, 60), `mprod:${m.id}:${parentId}`);
  });

  if (visibleCats.length === 0 && visibleProds.length === 0 && vcBtns.length === 0 && manualBtns.length === 0) {
    const [backLabel, homeLabel] = await Promise.all([getBtnBackLabel(), getBtnHomeLabel()]);
    const emptyBackBtn = backTo === 0 ? Markup.button.callback(homeLabel, "home") : Markup.button.callback(backLabel, `cat:${backTo}:1:0`);
    const emptyRows = [];
    if (isAdmin) {
      emptyRows.push([Markup.button.callback("✏️ تعديل اسم القسم", `adm:catEdit:${parentId}`)]);
      emptyRows.push([Markup.button.callback("🙈 إخفاء القسم", `adm:catToggle:${parentId}`)]);
      emptyRows.push([Markup.button.callback("🚚 نقل كل منتجات القسم", `adm:moveCatAll:${parentId}`)]);
    }
    emptyRows.push([emptyBackBtn]);
    await sendOrEdit(ctx, "📭 هذا القسم فارغ حالياً.", Markup.inlineKeyboard(emptyRows));
    return;
  }

  const markup = await getMarkupPercent();
  visibleCats.sort((a, b) => {
    const aSort = catOv.get(a.id)?.sortOrder ?? 9999;
    const bSort = catOv.get(b.id)?.sortOrder ?? 9999;
    return aSort - bSort;
  });

  const catBtns = [
    ...vcBtns,
    ...visibleCats.map(c => {
      const ov = catOv.get(c.id);
      const label = ov?.customName ?? c.name;
      const prefix = ov?.hidden ? "🔒 " : "📂 ";
      return Markup.button.callback(`${prefix}${label}`.slice(0, 60), `cat:${c.id}:1:${parentId}`);
    }),
  ];
  const prodBtns = await Promise.all(visibleProds.map(async p => {
    const ov = ovMap.get(p.id);
    const usd = await effectivePriceUsd(p, ov, markup, socialMarkup, socialKws);
    const syp = Math.round(usd * rate);
    const hidden = ov?.hidden ? "🔒 " : "🛒 ";
    const name = ov?.customName ?? p.name;
    return Markup.button.callback(`${hidden}${name} • ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س`.slice(0, 60), `prod:${p.id}:${parentId}`);
  }));

  const all = [...catBtns, ...prodBtns, ...manualBtns];
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const safe = Math.min(Math.max(1, page), totalPages);
  const slice = all.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE);

  const rows = [];
  if (isAdmin && parentId !== 0) {
    const cur = (await db.select().from(categoryOverridesTable).where(eq(categoryOverridesTable.categoryId, parentId)).limit(1))[0];
    rows.push([Markup.button.callback("✏️ تعديل اسم القسم", `adm:catEdit:${parentId}`), Markup.button.callback(cur?.hidden ? "👁 إظهار" : "🙈 إخفاء", `adm:catToggle:${parentId}`)]);
    rows.push([Markup.button.callback("% نسبة ربح القسم", `adm:catMarkup:${parentId}`), Markup.button.callback("🔢 ترتيب القسم", `adm:catSort:${parentId}`)]);
    rows.push([Markup.button.callback("🚚 نقل كل منتجات القسم", `adm:moveCatAll:${parentId}`)]);
  }
  for (const b of slice) rows.push([b]);

  const [backLabel, homeLabel, prevLabel, nextLabel] = await Promise.all([getBtnBackLabel(), getBtnHomeLabel(), getBtnPrevLabel(), getBtnNextLabel()]);
  const nav = [];
  if (safe > 1) nav.push(Markup.button.callback(prevLabel, `cat:${parentId}:${safe - 1}:${backTo}`));
  nav.push(Markup.button.callback(`${safe}/${totalPages}`, "noop"));
  if (safe < totalPages) nav.push(Markup.button.callback(nextLabel, `cat:${parentId}:${safe + 1}:${backTo}`));
  if (nav.length > 1) rows.push(nav);

  if (parentId === 0) {
    rows.push([Markup.button.callback(homeLabel, "home")]);
  } else {
    const backTarget = backTo === 0 ? "home" : `cat:${backTo}:1:0`;
    const backBtnFinal = backTo === 0 ? Markup.button.callback(backLabel, "home") : Markup.button.callback(backLabel, backTarget);
    rows.push([backBtnFinal, Markup.button.callback(homeLabel, "home")]);
  }

  const title = parentId === 0 ? "🛒 الأقسام الرئيسية" : `📂 ${catOv.get(parentId)?.customName ?? "محتويات القسم"}`;
  await sendOrEdit(ctx, title, Markup.inlineKeyboard(rows));
}

async function showProduct(ctx, productId, backTo) {
  const all = await getCachedProducts();
  const p = all.find(x => x.id === productId);
  const [backLabel, homeLabel] = await Promise.all([getBtnBackLabel(), getBtnHomeLabel()]);

  async function resolveBackBtn(to) {
    if (to === 0) return Markup.button.callback(homeLabel, "home");
    const vc = (await db.select().from(virtualCategoriesTable).where(eq(virtualCategoriesTable.id, to)).limit(1))[0];
    if (vc) return Markup.button.callback(backLabel, `vcat:${to}:1:0`);
    return Markup.button.callback(backLabel, `cat:${to}:1:0`);
  }

  if (!p) { await sendOrEdit(ctx, "⚠️ المنتج غير موجود.", Markup.inlineKeyboard([[await resolveBackBtn(backTo)]])); return; }
  const kws = await getExcludedKeywords();
  const u = await getUser(ctx.from.id);
  const isAdmin = !!u?.isAdmin;
  if (isExcludedProduct(p, kws) && !isAdmin) { await sendOrEdit(ctx, "⚠️ هذا المنتج غير متاح.", Markup.inlineKeyboard([[await resolveBackBtn(backTo)]])); return; }
  const ovMap = await loadOverrideMap([p.id]);
  const ov = ovMap.get(p.id);
  const markup = await getMarkupPercent();
  const rate = await getExchangeRate();
  const socialKws = await getSocialKeywords();
  const socialMarkup = await getSocialMarkupPercent();
  const isSocial = isSocialProduct(p.name, p.category_name, socialKws);
  const usd = await effectivePriceUsd(p, ov, markup, socialMarkup, socialKws);
  const syp = Math.round(usd * rate);

  let qtyInfo = "";
  if (isSocial) {
    const parsed = p.qty_values;
    if (parsed && !Array.isArray(parsed) && Number(parsed.min) > 0 && Number(parsed.max) > 0)
      qtyInfo = `الكمية بين ${Number(parsed.min).toLocaleString("en-US")} و ${Number(parsed.max).toLocaleString("en-US")}`;
    else if (parsed && Array.isArray(parsed) && parsed.length > 0)
      qtyInfo = `الكميات المتاحة: ${parsed.join(", ")}`;
    else { const min = await getSocialMinQty(); const max = await getSocialMaxQty(); qtyInfo = `الكمية بين ${min.toLocaleString("en-US")} و ${max.toLocaleString("en-US")}`; }
  } else if (!p.qty_values) {
    qtyInfo = "الكمية: 1 (ثابتة)";
  } else if (Array.isArray(p.qty_values)) {
    qtyInfo = `الكميات المتاحة: ${p.qty_values.join(", ")}`;
  } else {
    qtyInfo = `الكمية بين ${p.qty_values.min} و ${p.qty_values.max}`;
  }

  const customInstructions = ov?.instructions?.trim() || null;
  const apiNotes = getProductApiNotes(p);
  const instructions = customInstructions ?? apiNotes;
  const displayName = ov?.customName ?? p.name;
  const text = `🛒 ${displayName}\n${p.category_name ? `القسم: ${p.category_name}\n` : ""}` +
    `السعر: ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س\n${qtyInfo}` +
    (instructions ? `\n\n📋 تعليمات:\n${instructions}` : "");

  const backBtnResolved = await resolveBackBtn(backTo);
  const btns = [];
  if (p.available || isAdmin) btns.push([Markup.button.callback("🛒 طلب الآن", `buy:${p.id}:${backTo}`)]);
  if (isAdmin) {
    btns.push([Markup.button.callback("✏️ تعديل السعر", `adm:editPrice:${p.id}`), Markup.button.callback("📋 تعليمات", `adm:editInstr:${p.id}`)]);
    btns.push([Markup.button.callback("📝 تعديل الاسم", `adm:renameProd:${p.id}`), Markup.button.callback("🚚 نقل لقسم آخر", `adm:moveProd:${p.id}`)]);
    btns.push([Markup.button.callback(ov?.hidden ? "👁 إظهار" : "🙈 إخفاء", `adm:hideProd:${p.id}`)]);
  }
  const effectiveBack = backTo === 0 ? Markup.button.callback(backLabel, "cat:0:1:0") : backBtnResolved;
  btns.push([effectiveBack, Markup.button.callback(homeLabel, "home")]);
  await sendOrEdit(ctx, text, Markup.inlineKeyboard(btns));
}

async function showVirtualCategory(ctx, vcId, page, backTo) {
  const u = await getUser(ctx.from.id);
  const isAdmin = !!u?.isAdmin;
  const vc = (await db.select().from(virtualCategoriesTable).where(eq(virtualCategoriesTable.id, vcId)).limit(1))[0];
  if (!vc || (!vc.active && !isAdmin)) {
    await sendOrEdit(ctx, "⚠️ هذا القسم غير متاح.", Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
    return;
  }
  const [backLabel, homeLabel, prevLabel, nextLabel] = await Promise.all([getBtnBackLabel(), getBtnHomeLabel(), getBtnPrevLabel(), getBtnNextLabel()]);
  let backBtn;
  if (backTo === 0) backBtn = Markup.button.callback(homeLabel, "home");
  else {
    const parentIsVcat = (await db.select().from(virtualCategoriesTable).where(eq(virtualCategoriesTable.id, backTo)).limit(1))[0];
    backBtn = parentIsVcat ? Markup.button.callback(backLabel, `vcat:${backTo}:1:0`) : Markup.button.callback(backLabel, `cat:${backTo}:1:0`);
  }

  const allOv = await getAllOverridesCached();
  const allProducts = await getCachedProducts();
  const kws = await getExcludedKeywords();
  const markup = await getMarkupPercent();
  const rate = await getExchangeRate();
  const socialKws = await getSocialKeywords();
  const socialMarkup = await getSocialMarkupPercent();

  const subVcRows = await db.select().from(virtualCategoriesTable).where(eq(virtualCategoriesTable.parentId, vcId));
  const subVcs = isAdmin ? subVcRows : subVcRows.filter(v => v.active);
  const subVcBtns = subVcs.map(v => {
    const prefix = v.active ? "📂 " : "🔒 ";
    return Markup.button.callback(`${prefix}${v.name}`.slice(0, 60), `vcat:${v.id}:1:${vcId}`);
  });

  const movedPids = [];
  for (const [pid, ov] of allOv) { if (ov.customCategoryId === vcId) movedPids.push(pid); }
  const products = allProducts.filter(p => movedPids.includes(p.id));
  const visible = products.filter(p => {
    if (isExcludedProduct(p, kws)) return false;
    const ov = allOv.get(p.id);
    if (ov?.hidden && !isAdmin) return false;
    if (!p.available && !isAdmin) return false;
    return true;
  });

  const manualRowsVc = isAdmin
    ? await db.select().from(manualProductsTable).where(and(eq(manualProductsTable.categoryId, vcId), eq(manualProductsTable.categoryIsVirtual, true)))
    : await db.select().from(manualProductsTable).where(and(eq(manualProductsTable.categoryId, vcId), eq(manualProductsTable.categoryIsVirtual, true), eq(manualProductsTable.active, true)));

  const manualBtnsVc = manualRowsVc.filter(m => isAdmin || m.active).map(m => {
    const usd = Number(m.priceUsd);
    const syp = Math.round(usd * rate);
    return Markup.button.callback(`🛒 ${m.name} • ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س`.slice(0, 60), `mprod:${m.id}:${vcId}`);
  });

  if (visible.length === 0 && subVcBtns.length === 0 && manualBtnsVc.length === 0 && !isAdmin) {
    await sendOrEdit(ctx, "📭 هذا القسم فارغ حالياً.", Markup.inlineKeyboard([[backBtn]]));
    return;
  }

  const ovMap = await loadOverrideMap(visible.map(p => p.id));
  const prodBtns = await Promise.all(visible.map(async p => {
    const ov = ovMap.get(p.id);
    const usd = await effectivePriceUsd(p, ov, markup, socialMarkup, socialKws);
    const syp = Math.round(usd * rate);
    const hidden = ov?.hidden ? "🔒 " : "🛒 ";
    const name = ov?.customName ?? p.name;
    return Markup.button.callback(`${hidden}${name} • ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س`.slice(0, 60), `prod:${p.id}:${vcId}`);
  }));

  const allBtns = [...subVcBtns, ...prodBtns, ...manualBtnsVc];
  const totalPages = Math.max(1, Math.ceil(allBtns.length / PAGE_SIZE));
  const safe = Math.min(Math.max(1, page), totalPages);
  const slice = allBtns.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE);

  const rows = [];
  if (isAdmin) {
    rows.push([Markup.button.callback("✏️ تعديل الاسم", `adm:vcEdit:${vcId}`), Markup.button.callback(vc.active ? "🙈 إخفاء" : "👁 إظهار", `adm:vcToggle:${vcId}`)]);
    rows.push([Markup.button.callback("➕ قسم فرعي", `adm:addVCatSub:${vcId}`), Markup.button.callback("🗑️ حذف القسم", `adm:vcDel:${vcId}`)]);
  }
  for (const b of slice) rows.push([b]);
  const nav = [];
  if (safe > 1) nav.push(Markup.button.callback(prevLabel, `vcat:${vcId}:${safe - 1}:${backTo}`));
  nav.push(Markup.button.callback(`${safe}/${totalPages}`, "noop"));
  if (safe < totalPages) nav.push(Markup.button.callback(nextLabel, `vcat:${vcId}:${safe + 1}:${backTo}`));
  if (nav.length > 1) rows.push(nav);
  if (backTo === 0) rows.push([backBtn]);
  else rows.push([backBtn, Markup.button.callback(homeLabel, "home")]);
  await sendOrEdit(ctx, `📂 ${vc.name}`, Markup.inlineKeyboard(rows));
}

async function showManualProduct(ctx, mId, backTo) {
  const [backLabel, homeLabel] = await Promise.all([getBtnBackLabel(), getBtnHomeLabel()]);
  let backBtn;
  if (backTo === 0) backBtn = Markup.button.callback(homeLabel, "home");
  else {
    const parentIsVcat = (await db.select().from(virtualCategoriesTable).where(eq(virtualCategoriesTable.id, backTo)).limit(1))[0];
    backBtn = parentIsVcat ? Markup.button.callback(backLabel, `vcat:${backTo}:1:0`) : Markup.button.callback(backLabel, `cat:${backTo}:1:0`);
  }
  const m = (await db.select().from(manualProductsTable).where(eq(manualProductsTable.id, mId)).limit(1))[0];
  const u = await getUser(ctx.from.id);
  const isAdmin = !!u?.isAdmin;
  if (!m || (!m.active && !isAdmin)) { await sendOrEdit(ctx, "⚠️ المنتج غير متاح.", Markup.inlineKeyboard([[backBtn]])); return; }
  const rate = await getExchangeRate();
  const usd = Number(m.priceUsd);
  const syp = Math.round(usd * rate);
  const balance = u ? Number(u.balance) : 0;
  const canAfford = balance >= usd;
  const text = `🛒 ${m.name}\nالسعر: ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س\n💳 رصيدك: ${balance.toFixed(2)}$\n` +
    (m.instructions ? `\n📋 تعليمات:\n${m.instructions}\n` : "");
  const btns = [];
  if (m.apiProductId) btns.push([Markup.button.callback("🛒 طلب الآن", `buy:${m.apiProductId}:${backTo}`)]);
  else if (canAfford) btns.push([Markup.button.callback("🛒 اطلب الآن (يدوي)", `mord:buy:${mId}:${backTo}`)]);
  else btns.push([Markup.button.callback("💳 شحن رصيد", "deposit")]);
  if (isAdmin) {
    btns.push([Markup.button.callback("✏️ تعديل السعر", `adm:manualEditPrice:${mId}`), Markup.button.callback("🗑️ حذف", `adm:manualDel:${mId}`)]);
    btns.push([Markup.button.callback(m.active ? "❌ تعطيل" : "✅ تفعيل", `adm:manualToggle:${mId}`)]);
  }
  if (backTo === 0) btns.push([backBtn]);
  else btns.push([backBtn, Markup.button.callback(homeLabel, "home")]);
  await sendOrEdit(ctx, text, Markup.inlineKeyboard(btns));
}

// ============================================================
//  ORDER FLOW
// ============================================================
const REJECT_STATUSES = new Set(["reject","rejected","error","refused","cancel","cancelled","canceled","fail","failed"]);
const ACCEPT_STATUSES = new Set(["accept","accepted","success","done","complete","completed","delivered"]);
const TERMINAL_STATUSES = ["accept","accepted","success","done","complete","completed","delivered","reject","rejected","error","refused","cancel","cancelled","canceled","fail","failed"];

function extractOrderData(resp) {
  if (!resp.data) return null;
  if (Array.isArray(resp.data)) return resp.data[0] ?? null;
  return resp.data;
}

function formatFullApiResponse(resp) {
  const parts = [];
  if (resp.message?.trim()) parts.push(resp.message.trim());
  const code = extractDeliveredCode(resp);
  if (code) parts.push(code);
  const orderData = extractOrderData(resp);
  if (orderData?.status && typeof orderData.status === "string") {
    const raw = orderData.status;
    const label = statusLabel(raw);
    if (!parts.some(p => p.includes(raw) || p.includes(label))) parts.push(`📊 الحالة: ${label}`);
  }
  return [...new Set(parts)].filter(Boolean).join("\n\n").trim();
}

function parseQtyValues(qv) {
  if (!qv) return { kind: "fixed" };
  if (Array.isArray(qv)) return { kind: "list", values: qv.map(v => Number(v)).filter(Number.isFinite) };
  return { kind: "range", min: Number(qv.min), max: Number(qv.max) };
}

function statusLabel(s) {
  const n = (s ?? "").toString().toLowerCase().trim();
  if (ACCEPT_STATUSES.has(n) || n === "1" || n === "true") return "✅ مقبول";
  if (REJECT_STATUSES.has(n) || n === "0" || n === "false") return "❌ مرفوض";
  return "⏳ انتظار";
}

async function startOrderFlow(ctx, productId, backTo) {
  let all = await getCachedProducts();
  let p = all.find(x => x.id === productId);
  if (!p) { all = await fetchAllProducts(); p = all.find(x => x.id === productId); }
  if (!p) { await ctx.reply("⚠️ المنتج غير موجود."); return; }
  if (!p.available) { await ctx.reply("⚠️ هذا المنتج غير متاح حالياً."); return; }

  const ovMap = await loadOverrideMap([p.id]);
  const ov = ovMap.get(p.id);
  const markup = await getMarkupPercent();
  const socialKws = await getSocialKeywords();
  const socialMarkup = await getSocialMarkupPercent();
  const user = await getUser(ctx.from.id);
  const userMarkup = user?.customMarkupPercent != null ? Number(user.customMarkupPercent) : null;
  const unitPriceUsd = await effectivePriceUsd(p, ov, markup, socialMarkup, socialKws, null, userMarkup);
  const isSocial = isSocialProduct(p.name, p.category_name, socialKws);
  const paramKeys = Array.isArray(p.params) ? p.params : [];

  if (isSocial) {
    const parsedSocial = parseQtyValues(p.qty_values);
    if (parsedSocial.kind === "list" && parsedSocial.values.length > 0) {
      setStep(ctx.from.id, { kind: "order:qty", productId: p.id, productName: p.name, priceUsd: unitPriceUsd, paramKeys, qtyValues: parsedSocial.values, backTo });
      const rows = parsedSocial.values.slice(0, 24).map(v => {
        const total = unitPriceUsd * v;
        const label = total === 0 ? `${v.toLocaleString("en-US")}` : `${v.toLocaleString("en-US")} — ${total < 0.005 ? total.toFixed(4) : total.toFixed(2)}$`;
        return [Markup.button.callback(label, `ord:qty:${v}`)];
      });
      rows.push([Markup.button.callback("❌ إلغاء", "ord:cancel")]);
      const unitLabel = unitPriceUsd > 0 ? `\n💰 سعر الوحدة: ${unitPriceUsd < 0.005 ? unitPriceUsd.toFixed(6) : unitPriceUsd.toFixed(4)}$` : "";
      await sendOrEdit(ctx, `🛒 ${p.name}${unitLabel}\n\nاختر الكمية:`, Markup.inlineKeyboard(rows));
      return;
    }
    let min, max;
    if (parsedSocial.kind === "range" && Number.isFinite(parsedSocial.min) && parsedSocial.min > 0 && Number.isFinite(parsedSocial.max) && parsedSocial.max > 0) {
      min = parsedSocial.min; max = parsedSocial.max;
    } else { min = await getSocialMinQty(); max = await getSocialMaxQty(); }
    setStep(ctx.from.id, { kind: "order:qty", productId: p.id, productName: p.name, priceUsd: unitPriceUsd, paramKeys, qtyValues: { min, max }, backTo });
    const priceHint = unitPriceUsd > 0 ? `\n💰 السعر للوحدة: ${unitPriceUsd < 0.005 ? unitPriceUsd.toFixed(6) : unitPriceUsd.toFixed(4)}$` : "";
    await sendOrEdit(ctx, `🛒 ${p.name}${priceHint}\n\nأرسل الكمية المطلوبة (بين ${min.toLocaleString("en-US")} و ${max.toLocaleString("en-US")}):`, Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "ord:cancel")]]));
    return;
  }

  const parsed = parseQtyValues(p.qty_values);
  if (parsed.kind === "fixed") { await askNextParam(ctx, p, unitPriceUsd, 1, paramKeys, {}, 0, backTo); return; }
  if (parsed.kind === "list") {
    setStep(ctx.from.id, { kind: "order:qty", productId: p.id, productName: p.name, priceUsd: unitPriceUsd, paramKeys, qtyValues: parsed.values, backTo });
    const rows = parsed.values.slice(0, 24).map(v => [Markup.button.callback(String(v), `ord:qty:${v}`)]);
    rows.push([Markup.button.callback("❌ إلغاء", "ord:cancel")]);
    await sendOrEdit(ctx, `🛒 ${p.name}\n💰 سعر الوحدة: ${unitPriceUsd.toFixed(4)}$\n\nاختر الكمية:`, Markup.inlineKeyboard(rows));
    return;
  }
  setStep(ctx.from.id, { kind: "order:qty", productId: p.id, productName: p.name, priceUsd: unitPriceUsd, paramKeys, qtyValues: { min: parsed.min, max: parsed.max }, backTo });
  await sendOrEdit(ctx, `🛒 ${p.name}\n💰 سعر الوحدة: ${unitPriceUsd.toFixed(4)}$\n\nأرسل الكمية المطلوبة (بين ${parsed.min} و ${parsed.max}):`, Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "ord:cancel")]]));
}

async function askNextParam(ctx, p, unitPriceUsd, qty, paramKeys, collected, idx, backTo) {
  if (idx >= paramKeys.length) { await showOrderConfirmation(ctx, p, unitPriceUsd, qty, collected, backTo); return; }
  setStep(ctx.from.id, { kind: "order:params", productId: p.id, productName: p.name, priceUsd: unitPriceUsd, qty, paramKeys, collected, idx, backTo });
  const key = paramKeys[idx];
  await ctx.reply(`📝 أدخل قيمة الحقل: *${key}*`, { parse_mode: "Markdown", ...Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "ord:cancel")]]) });
}

async function showOrderConfirmation(ctx, p, unitPriceUsd, qty, collected, backTo) {
  const totalUsd = Number((unitPriceUsd * qty).toFixed(4));
  const rate = await getExchangeRate();
  const totalSyp = Math.round(totalUsd * rate);
  const u = await getUser(ctx.from.id);
  const balance = u ? Number(u.balance) : 0;
  const paramsLines = Object.entries(collected).map(([k, v]) => `• ${k}: ${v}`).join("\n");
  setStep(ctx.from.id, { kind: "order:params", productId: p.id, productName: p.name, priceUsd: unitPriceUsd, qty, paramKeys: Object.keys(collected), collected, idx: Object.keys(collected).length, backTo });
  const lowBalance = balance < totalUsd;
  const totalUsdStr = totalUsd < 0.005 ? totalUsd.toFixed(4) : totalUsd.toFixed(2);
  const text = `🧾 تأكيد الطلب\n\n🛒 المنتج: ${p.name}\n🔢 الكمية: ${qty.toLocaleString("en-US")}\n` +
    (paramsLines ? `${paramsLines}\n` : "") +
    `💰 الإجمالي: ${totalUsdStr}$ | ${totalSyp.toLocaleString("en-US")} ل.س\n💳 رصيدك: ${formatBalance(balance, rate)}\n\n` +
    (lowBalance ? `❌ ليس لديك رصيد كافي. يرجى شحن رصيدك ثم المحاولة مجدداً.` : `هل تريد تأكيد الطلب؟`);
  const rows = lowBalance
    ? [[Markup.button.callback("💳 شحن رصيد", "deposit")], [Markup.button.callback("❌ إلغاء", "ord:cancel")]]
    : [[Markup.button.callback("✅ تأكيد وتنفيذ", "ord:confirm"), Markup.button.callback("❌ إلغاء", "ord:cancel")]];
  await sendOrEdit(ctx, text, Markup.inlineKeyboard(rows));
}

async function executeOrder(ctx) {
  const step = getStep(ctx.from.id);
  if (step.kind !== "order:params") return;
  let all = await getCachedProducts();
  let p = all.find(x => x.id === step.productId);
  if (!p) { all = await fetchAllProducts(); p = all.find(x => x.id === step.productId); }
  if (!p) { await ctx.reply("⚠️ المنتج غير موجود."); setStep(ctx.from.id, { kind: "idle" }); return; }

  const totalUsd = Number((step.priceUsd * step.qty).toFixed(4));
  const u = await getUser(ctx.from.id);
  const balance = u ? Number(u.balance) : 0;
  if (balance < totalUsd) {
    await ctx.reply("❌ ليس لديك رصيد كافي، اشحن رصيد ثم حاول مجدداً.",
      Markup.inlineKeyboard([[Markup.button.callback("💳 شحن رصيد", "deposit")], [Markup.button.callback("🏠 الرئيسية", "home")]]));
    setStep(ctx.from.id, { kind: "idle" }); return;
  }

  await clearInlineKeyboard(ctx);
  const orderUuid = crypto.randomUUID();
  await adjustBalance(ctx.from.id, -totalUsd);
  const execRate = await getExchangeRate();
  const totalSyp = Math.round(totalUsd * execRate);

  const params = { ...step.collected };
  if (step.qty && step.qty !== 1) params["qty"] = step.qty;

  const inserted = await db.insert(ordersTable).values({
    userId: ctx.from.id, productId: p.id, productName: p.name,
    qty: String(step.qty), params: step.collected, priceUsd: String(totalUsd),
    oranosUuid: orderUuid, status: "pending",
  }).returning();
  const order = inserted[0];

  await ctx.reply(`⏳ جاري تنفيذ طلبك #${order.id}...\n💸 تم خصم ${totalUsd.toFixed(2)}$ | ${totalSyp.toLocaleString("en-US")} ل.س من رصيدك.`);

  let resp;
  try { resp = await placeOrder(p.id, params, orderUuid); }
  catch (err) { resp = { status: "ERR", message: "خطأ شبكة" }; }

  const apiStatus = (resp.status ?? "").toLowerCase();
  const success = apiStatus === "success" || apiStatus === "ok" || apiStatus === "accept";

  if (!success) {
    await adjustBalance(ctx.from.id, totalUsd);
    await db.update(ordersTable).set({ status: "error", apiResponse: resp }).where(eq(ordersTable.id, order.id));
    setStep(ctx.from.id, { kind: "idle" });
    const fullErrText = formatFullApiResponse(resp);
    await ctx.reply(
      `❌ تعذّر تنفيذ الطلب #${order.id}.\nالسبب: ${resp.message ?? "خطأ غير معروف"}\n✅ تمت إعادة ${totalUsd.toFixed(2)}$ | ${totalSyp.toLocaleString("en-US")} ل.س إلى رصيدك.` +
      (fullErrText ? `\n\n📋 رد الموقع:\n${fullErrText}` : ""),
      Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
    return;
  }

  const deliveredCode = extractDeliveredCode(resp);
  const oranosOrderId = resp.data?.order_id ?? null;
  const apiInnerStatus = (resp.data?.status ?? apiStatus).toString();

  await db.update(ordersTable).set({
    status: apiInnerStatus === "accept" ? "accept" : apiInnerStatus,
    oranosOrderId, apiResponse: resp, deliveredCode: deliveredCode ?? null,
  }).where(eq(ordersTable.id, order.id));
  setStep(ctx.from.id, { kind: "idle" });

  const fullRespText = formatFullApiResponse(resp);
  const isWaiting = !ACCEPT_STATUSES.has(apiInnerStatus.toLowerCase()) && !REJECT_STATUSES.has(apiInnerStatus.toLowerCase());

  await ctx.reply(`✅ تم استلام طلبك #${order.id}\nالحالة: ${statusLabel(apiInnerStatus)}\n🛒 ${p.name} × ${step.qty}\n💰 ${totalUsd.toFixed(2)}$ | ${totalSyp.toLocaleString("en-US")} ل.س`);

  if (deliveredCode) {
    await ctx.reply(`🔑 تفاصيل الطلب:\n\n${deliveredCode}`, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
  } else if (fullRespText) {
    await ctx.reply(`📋 رد الموقع:\n\n${fullRespText}`, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
  } else if (isWaiting) {
    await ctx.reply("⏳ طلبك قيد المعالجة. سيتم إخطارك تلقائياً عند اكتماله أو رفضه.",
      Markup.inlineKeyboard([[Markup.button.callback("🔄 تحديث الحالة", `ord:check:${order.id}`)], [Markup.button.callback("🏠 الرئيسية", "home")]]));
  } else {
    await ctx.reply("شكراً لاستخدامك متجرنا! 🌟", Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
  }
}

async function showMyOrders(ctx, page) {
  const limit = 8;
  const offset = (page - 1) * limit;
  const rows = await db.select().from(ordersTable).where(eq(ordersTable.userId, ctx.from.id)).orderBy(desc(ordersTable.createdAt)).limit(limit + 1).offset(offset);
  const hasNext = rows.length > limit;
  const slice = rows.slice(0, limit);
  if (slice.length === 0) { await sendOrEdit(ctx, "📭 لا يوجد لديك أي طلبات بعد.", Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]])); return; }
  const lines = slice.map(r => `#${r.id} • ${r.productName} ×${r.qty} • ${Number(r.priceUsd).toFixed(2)}$ • ${statusLabel(r.status)}`);
  const navRow = [];
  if (page > 1) navRow.push(Markup.button.callback("⬅️ السابق", `myorders:${page - 1}`));
  if (hasNext) navRow.push(Markup.button.callback("التالي ➡️", `myorders:${page + 1}`));
  const kb = [];
  if (navRow.length) kb.push(navRow);
  kb.push([Markup.button.callback("🏠 الرئيسية", "home")]);
  await sendOrEdit(ctx, `📦 طلباتي\n\n${lines.join("\n")}`, Markup.inlineKeyboard(kb));
}

async function checkOrderStatus(ctx, orderId) {
  const row = (await db.select().from(ordersTable).where(eq(ordersTable.id, orderId)).limit(1))[0];
  if (!row || row.userId !== ctx.from.id) { await ctx.reply("⚠️ غير موجود."); return; }
  if (!row.oranosOrderId) { await ctx.reply(`الحالة الحالية: ${statusLabel(row.status)}`); return; }
  try {
    const resp = await checkOrder(row.oranosOrderId);
    const orderData = extractOrderData(resp);
    const rawStatus = ((orderData?.status ?? row.status) ?? "").toString().toLowerCase();
    const isRejected = REJECT_STATUSES.has(rawStatus);
    const isAccepted = ACCEPT_STATUSES.has(rawStatus);
    const finalStatus = isRejected ? "reject" : isAccepted ? "accept" : rawStatus;
    if (finalStatus !== row.status) {
      const code = extractDeliveredCode(resp);
      await db.update(ordersTable).set({ status: finalStatus, apiResponse: resp, ...(code ? { deliveredCode: code } : {}) }).where(eq(ordersTable.id, row.id));
      if (isRejected && !REJECT_STATUSES.has(row.status)) await adjustBalance(ctx.from.id, Number(row.priceUsd));
      const fullText = formatFullApiResponse(resp);
      if (code && !row.deliveredCode) await ctx.reply(`🔑 تفاصيل الطلب #${row.id}:\n\n${code}`);
      else if (fullText) await ctx.reply(`📋 رد الموقع للطلب #${row.id}:\n\n${fullText}`);
    }
    const rate = await getExchangeRate();
    const priceUsd = Number(row.priceUsd);
    await ctx.reply(`الحالة الحالية للطلب #${row.id}: ${statusLabel(finalStatus)}\n💰 ${priceUsd.toFixed(2)}$ | ${Math.round(priceUsd * rate).toLocaleString("en-US")} ل.س`);
  } catch { await ctx.reply("⚠️ تعذّر فحص الحالة الآن."); }
}

async function pollOneOrder(bot, order) {
  let resp = null;
  if (order.oranosOrderId) resp = await checkOrder(order.oranosOrderId).catch(() => null);
  if (!resp && order.oranosUuid) resp = await checkOrder(order.oranosUuid, true).catch(() => null);
  if (!resp) return;
  const orderData = extractOrderData(resp);
  const rawNew = ((orderData?.status ?? "").toString().toLowerCase());
  if (!rawNew || rawNew === order.status) return;
  const isRejected = REJECT_STATUSES.has(rawNew);
  const isAccepted = ACCEPT_STATUSES.has(rawNew);
  const prevRejected = REJECT_STATUSES.has(order.status);
  const prevAccepted = ACCEPT_STATUSES.has(order.status);
  if (isRejected && prevRejected) return;
  if (isAccepted && prevAccepted) return;
  const code = extractDeliveredCode(resp);
  const finalStatus = isRejected ? "reject" : isAccepted ? "accept" : rawNew;
  await db.update(ordersTable).set({ status: finalStatus, apiResponse: resp, ...(code ? { deliveredCode: code } : {}) }).where(eq(ordersTable.id, order.id));
  const fullText = formatFullApiResponse(resp);
  const priceUsd = Number(order.priceUsd);
  const rate = await getExchangeRate();
  if (isRejected) {
    if (!prevRejected) await adjustBalance(order.userId, priceUsd);
    const refundSyp = Math.round(priceUsd * rate);
    const msgLines = [`❌ تم رفض الطلب #${order.id}`, `🛒 المنتج: ${order.productName}`, `💰 تمت إعادة ${priceUsd.toFixed(2)}$ | ${refundSyp.toLocaleString("en-US")} ل.س إلى رصيدك.`];
    if (fullText) msgLines.push(`\n📋 رد الموقع:\n${fullText}`);
    msgLines.push("\n⟳ يمكنك المحاولة مجدداً من القائمة الرئيسية.");
    await bot.telegram.sendMessage(order.userId, msgLines.join("\n")).catch(() => {});
  } else if (isAccepted) {
    const priceSyp = Math.round(priceUsd * rate);
    const msgLines = [`✅ تم تنفيذ طلبك #${order.id} بنجاح!`, `🛒 المنتج: ${order.productName}`, `💰 المبلغ: ${priceUsd.toFixed(2)}$ | ${priceSyp.toLocaleString("en-US")} ل.س`];
    if (fullText) msgLines.push(`\n📋 رد الموقع:\n${fullText}`);
    await bot.telegram.sendMessage(order.userId, msgLines.join("\n")).catch(() => {});
  } else {
    const msgLines = [`🔄 تحديث الطلب #${order.id}`, `🛒 المنتج: ${order.productName}`, `📊 الحالة: ${statusLabel(rawNew)}`];
    if (fullText) msgLines.push(`\n📋 رد الموقع:\n${fullText}`);
    await bot.telegram.sendMessage(order.userId, msgLines.join("\n")).catch(() => {});
  }
}

function startOrderPoller(bot) {
  setInterval(async () => {
    try {
      const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const pendingRows = await db.select().from(ordersTable).where(and(not(inArray(ordersTable.status, TERMINAL_STATUSES)), gt(ordersTable.createdAt, cutoff))).limit(200);
      const CHUNK = 5;
      for (let i = 0; i < pendingRows.length; i += CHUNK) {
        await Promise.allSettled(pendingRows.slice(i, i + CHUNK).map(order => pollOneOrder(bot, order).catch(() => {})));
      }
    } catch { /* silent */ }
  }, 90_000).unref();
}

// ============================================================
//  ADMIN FUNCTIONS
// ============================================================
async function requireAdmin(ctx) {
  const u = await getUser(ctx.from.id);
  if (!u?.isAdmin) { await ctx.reply("⛔ هذا القسم للإدارة فقط."); return false; }
  return true;
}

async function showAdminMenu(ctx) {
  if (!(await requireAdmin(ctx))) return;
  const status = await getBotStatus();
  const rows = [
    [Markup.button.callback("📥 طلبات الإيداع", "adm:depList:1"), Markup.button.callback("👥 المستخدمون", "adm:users:1")],
    [Markup.button.callback("🔍 بحث مستخدم", "adm:findUser"), Markup.button.callback("📦 كل الطلبات", "adm:allOrders:1")],
    [Markup.button.callback("📣 رسالة جماعية", "adm:broadcast"), Markup.button.callback("💳 طرق الإيداع", "adm:methods")],
    [Markup.button.callback("🛒 إدارة المنتجات", "cat:0:1:0"), Markup.button.callback("⚙️ الإعدادات", "adm:settings")],
    [Markup.button.callback("📞 وسائل التواصل", "adm:contacts"), Markup.button.callback("📁 أقسام مخصصة", "adm:vcList")],
    [Markup.button.callback("➕ إضافة منتج يدوي", "adm:manualProds"), Markup.button.callback("🛠️ مساعد الإدارة", "adm:aiSupport")],
    [Markup.button.callback("🔄 بينج تلقائي /start", "adm:ping"), Markup.button.callback(status === "on" ? "🟢 البوت: شغال" : "🔴 البوت: متوقف", "adm:toggleStatus")],
    [Markup.button.callback("🏠 الرئيسية", "home")],
  ];
  await sendOrEdit(ctx, "👑 لوحة الإدارة", Markup.inlineKeyboard(rows));
}

async function showSettingsMenu(ctx) {
  if (!(await requireAdmin(ctx))) return;
  const m = await getMarkupPercent();
  const sm = await getSocialMarkupPercent();
  const r = await getExchangeRate();
  await sendOrEdit(ctx, `⚙️ الإعدادات\n\nالربح العام: ${m}%\nربح السوشل ميديا: ${sm}%\nسعر الصرف: ${r} ل.س لكل دولار`,
    Markup.inlineKeyboard([
      [Markup.button.callback("✏️ تعديل الربح العام", "adm:setMarkup")],
      [Markup.button.callback("✏️ تعديل ربح السوشل", "adm:setSocialMarkup")],
      [Markup.button.callback("💱 تعديل سعر الصرف", "adm:setRate")],
      [Markup.button.callback("🔑 تغيير كلمة المرور", "adm:newPass")],
      [Markup.button.callback("🔘 تعديل أزرار التنقل", "adm:btnLabels")],
      [Markup.button.callback("⬅️ رجوع", "admin:menu")],
    ]));
}

async function showDepList(ctx, page) {
  if (!(await requireAdmin(ctx))) return;
  const limit = 8; const offset = (page - 1) * limit;
  const rows = await db.select().from(depositRequestsTable).where(eq(depositRequestsTable.status, "pending")).orderBy(desc(depositRequestsTable.createdAt)).limit(limit + 1).offset(offset);
  const hasNext = rows.length > limit; const slice = rows.slice(0, limit);
  if (slice.length === 0) { await sendOrEdit(ctx, "📭 لا توجد طلبات إيداع معلقة.", Markup.inlineKeyboard([[Markup.button.callback("⬅️ رجوع", "admin:menu")]])); return; }
  const kb = slice.map(d => [Markup.button.callback(`#${d.id} • ${d.methodName} • UID:${d.userId}`, `adm:depShow:${d.id}`)]);
  const nav = [];
  if (page > 1) nav.push(Markup.button.callback("⬅️ السابق", `adm:depList:${page - 1}`));
  if (hasNext) nav.push(Markup.button.callback("التالي ➡️", `adm:depList:${page + 1}`));
  if (nav.length) kb.push(nav);
  kb.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
  await sendOrEdit(ctx, "📥 طلبات الإيداع المعلقة:", Markup.inlineKeyboard(kb));
}

async function showDepDetails(ctx, depId) {
  if (!(await requireAdmin(ctx))) return;
  const d = (await db.select().from(depositRequestsTable).where(eq(depositRequestsTable.id, depId)).limit(1))[0];
  if (!d) { await ctx.reply("⚠️ غير موجود."); return; }
  const u = await getUser(d.userId);
  const text = `📥 طلب إيداع #${d.id}\nالحالة: ${d.status}\nالطريقة: ${d.methodName}\n` +
    `المستخدم: ${u?.firstName ?? ""} ${u?.username ? "@" + u.username : ""} (${d.userId})\n` +
    `رصيد المستخدم: ${u ? Number(u.balance).toFixed(2) : "0.00"}$\nرقم/تفاصيل المُحوِّل: ${d.payerNumber ?? "—"}`;
  const balanceRow = [Markup.button.callback("➕ شحن رصيد", `adm:userAdd:${d.userId}`), Markup.button.callback("➖ خصم رصيد", `adm:userSub:${d.userId}`)];
  const kb = d.status === "pending"
    ? Markup.inlineKeyboard([[Markup.button.callback("✅ موافقة", `adm:dep:approve:${d.id}`), Markup.button.callback("❌ رفض", `adm:dep:reject:${d.id}`)], balanceRow, [Markup.button.callback("👤 ملف المستخدم", `adm:user:${d.userId}`)], [Markup.button.callback("⬅️ رجوع", "adm:depList:1")]])
    : Markup.inlineKeyboard([balanceRow, [Markup.button.callback("👤 ملف المستخدم", `adm:user:${d.userId}`)], [Markup.button.callback("⬅️ رجوع", "adm:depList:1")]]);
  try { await ctx.replyWithPhoto(d.screenshotFileId, { caption: text, ...kb }); }
  catch { await ctx.reply(text + "\n\n(تعذّر تحميل الصورة)", kb); }
}

async function approveDeposit(ctx, depId) {
  if (!(await requireAdmin(ctx))) return;
  setStep(ctx.from.id, { kind: "admin:depositApproveAmount", depositId: depId });
  await ctx.reply(`💵 أرسل المبلغ بالدولار لإضافته إلى رصيد المستخدم لطلب الإيداع #${depId}:`, Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "admin:menu")]]));
}

async function rejectDeposit(ctx, depId) {
  if (!(await requireAdmin(ctx))) return;
  await db.update(depositRequestsTable).set({ status: "rejected", processedBy: ctx.from.id, processedAt: new Date() }).where(eq(depositRequestsTable.id, depId));
  const d = (await db.select().from(depositRequestsTable).where(eq(depositRequestsTable.id, depId)).limit(1))[0];
  await ctx.reply(`❌ تم رفض طلب الإيداع #${depId}.`);
  if (d) {
    try { await ctx.telegram.sendMessage(d.userId, `❌ تم رفض طلب الإيداع #${d.id}. للاستفسار راسل @${ADMIN_USERNAME}.`); }
    catch { /* ignore */ }
  }
}

async function showUsersList(ctx, page) {
  if (!(await requireAdmin(ctx))) return;
  const limit = 10; const offset = (page - 1) * limit;
  const rows = await listUsers(offset, limit);
  const total = await countUsers();
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (rows.length === 0) { await sendOrEdit(ctx, "👥 لا يوجد مستخدمون.", Markup.inlineKeyboard([[Markup.button.callback("⬅️ رجوع", "admin:menu")]])); return; }
  const kb = rows.map(u => [Markup.button.callback(`${u.isAdmin ? "👑 " : u.status === "banned" ? "🚫 " : "👤 "}${u.firstName ?? "—"}${u.username ? " @" + u.username : ""} • ${Number(u.balance).toFixed(2)}$`, `adm:user:${u.id}`)]);
  const nav = [];
  if (page > 1) nav.push(Markup.button.callback("⬅️ السابق", `adm:users:${page - 1}`));
  nav.push(Markup.button.callback(`${page}/${totalPages}`, "noop"));
  if (page < totalPages) nav.push(Markup.button.callback("التالي ➡️", `adm:users:${page + 1}`));
  kb.push(nav); kb.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
  await sendOrEdit(ctx, `👥 المستخدمون (${total})`, Markup.inlineKeyboard(kb));
}

async function showUserCard(ctx, uid) {
  if (!(await requireAdmin(ctx))) return;
  const u = await getUser(uid);
  if (!u) { await ctx.reply("⚠️ غير موجود."); return; }
  const orderCountRow = await db.select({ c: sql`count(*)::int`, sum: sql`coalesce(sum(price_usd),0)::text` }).from(ordersTable).where(eq(ordersTable.userId, uid));
  const oc = orderCountRow[0]?.c ?? 0;
  const sum = Number(orderCountRow[0]?.sum ?? 0);
  const text = `👤 ${u.firstName ?? "—"}${u.username ? " @" + u.username : ""}\nID: ${u.id}\nالرصيد: ${Number(u.balance).toFixed(2)}$\nالحالة: ${u.status}\nإداري؟ ${u.isAdmin ? "نعم" : "لا"}\nعدد الطلبات: ${oc} • إجمالي: ${sum.toFixed(2)}$`;
  const kb = [
    [Markup.button.callback("➕ شحن رصيد", `adm:userAdd:${uid}`), Markup.button.callback("➖ خصم رصيد", `adm:userSub:${uid}`)],
    [Markup.button.callback(u.status === "banned" ? "✅ رفع الحظر" : "🚫 حظر", `adm:userBan:${uid}`), Markup.button.callback(u.isAdmin ? "👤 إلغاء إداري" : "👑 جعله إداري", `adm:userAdmin:${uid}`)],
    [Markup.button.callback("📦 طلباته", `adm:userOrders:${uid}:1`), Markup.button.callback("% نسبة ربح خاصة", `adm:userMarkup:${uid}`)],
    [Markup.button.callback("⬅️ رجوع", "adm:users:1")],
  ];
  await sendOrEdit(ctx, text, Markup.inlineKeyboard(kb));
}

async function showUserOrders(ctx, uid, page) {
  if (!(await requireAdmin(ctx))) return;
  const limit = 10; const offset = (page - 1) * limit;
  const rows = await db.select().from(ordersTable).where(eq(ordersTable.userId, uid)).orderBy(desc(ordersTable.createdAt)).limit(limit + 1).offset(offset);
  const hasNext = rows.length > limit; const slice = rows.slice(0, limit);
  if (slice.length === 0) { await sendOrEdit(ctx, "📭 لا توجد طلبات.", Markup.inlineKeyboard([[Markup.button.callback("⬅️ رجوع", `adm:user:${uid}`)]])); return; }
  const lines = slice.map(r => `#${r.id} • ${r.productName} ×${r.qty} • ${Number(r.priceUsd).toFixed(2)}$ • ${r.status}`);
  const nav = [];
  if (page > 1) nav.push(Markup.button.callback("⬅️ السابق", `adm:userOrders:${uid}:${page - 1}`));
  if (hasNext) nav.push(Markup.button.callback("التالي ➡️", `adm:userOrders:${uid}:${page + 1}`));
  const kb = [];
  if (nav.length) kb.push(nav);
  kb.push([Markup.button.callback("⬅️ رجوع", `adm:user:${uid}`)]);
  await sendOrEdit(ctx, `📦 طلبات المستخدم ${uid}\n\n${lines.join("\n")}`, Markup.inlineKeyboard(kb));
}

async function showAllOrders(ctx, page) {
  if (!(await requireAdmin(ctx))) return;
  const limit = 8; const offset = (page - 1) * limit;
  const rows = await db.select({ id: ordersTable.id, userId: ordersTable.userId, productName: ordersTable.productName, qty: ordersTable.qty, priceUsd: ordersTable.priceUsd, status: ordersTable.status, uname: usersTable.username, ufirst: usersTable.firstName })
    .from(ordersTable).leftJoin(usersTable, eq(usersTable.id, ordersTable.userId)).orderBy(desc(ordersTable.createdAt)).limit(limit + 1).offset(offset);
  const hasNext = rows.length > limit; const slice = rows.slice(0, limit);
  if (slice.length === 0) { await sendOrEdit(ctx, "📭 لا توجد طلبات بعد.", Markup.inlineKeyboard([[Markup.button.callback("⬅️ رجوع", "admin:menu")]])); return; }
  const lines = slice.map(r => { const who = `${r.ufirst ?? "—"}${r.uname ? " @" + r.uname : ""} (${r.userId})`; return `#${r.id} • ${who}\n   ${r.productName} ×${r.qty} • ${Number(r.priceUsd).toFixed(2)}$ • ${r.status}`; });
  const nav = [];
  if (page > 1) nav.push(Markup.button.callback("⬅️ السابق", `adm:allOrders:${page - 1}`));
  if (hasNext) nav.push(Markup.button.callback("التالي ➡️", `adm:allOrders:${page + 1}`));
  const kb = [];
  if (nav.length) kb.push(nav);
  kb.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
  await sendOrEdit(ctx, `📦 كل طلبات المستخدمين\n\n${lines.join("\n\n")}`, Markup.inlineKeyboard(kb));
}

async function showMethods(ctx) {
  if (!(await requireAdmin(ctx))) return;
  const rows = await db.select().from(depositMethodsTable).orderBy(depositMethodsTable.id);
  const kb = rows.map(m => [Markup.button.callback(`${m.active ? "🟢" : "🔴"} ${m.name} • ${m.identifier}`, `adm:methodEdit:${m.id}`)]);
  kb.push([Markup.button.callback("➕ إضافة طريقة", "adm:methodAdd")]);
  kb.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
  await sendOrEdit(ctx, "💳 طرق الإيداع", Markup.inlineKeyboard(kb));
}

async function showMethodEdit(ctx, methodId) {
  if (!(await requireAdmin(ctx))) return;
  const m = (await db.select().from(depositMethodsTable).where(eq(depositMethodsTable.id, methodId)).limit(1))[0];
  if (!m) { await ctx.reply("⚠️ غير موجود."); return; }
  await sendOrEdit(ctx, `💳 ${m.name}\nالمعرف: ${m.identifier}\nالحالة: ${m.active ? "مفعّل" : "موقوف"}\n\nالتعليمات:\n${m.instructions}`,
    Markup.inlineKeyboard([
      [Markup.button.callback(m.active ? "🔴 تعطيل" : "🟢 تفعيل", `adm:methodToggle:${m.id}`), Markup.button.callback("✏️ تعديل التعليمات", `adm:methodInstr:${m.id}`)],
      [Markup.button.callback("🗑️ حذف", `adm:methodDel:${m.id}`)],
      [Markup.button.callback("⬅️ رجوع", "adm:methods")],
    ]));
}

async function showPingMenu(ctx) {
  if (!(await requireAdmin(ctx))) return;
  const enabled = (await getSetting("auto_ping_enabled")) === "on";
  const intervalMin = Number(await getSetting("auto_ping_interval_min")) || 5;
  const targetId = await getSetting("auto_ping_target_user_id");
  await sendOrEdit(ctx, `🔄 البينج التلقائي /start\n\nالحالة: ${enabled ? "🟢 مفعّل" : "🔴 موقوف"}\nالفترة: كل ${intervalMin} دقيقة\nالمستلم: ${targetId ? `المستخدم #${targetId}` : "غير محدد"}`,
    Markup.inlineKeyboard([
      [Markup.button.callback(enabled ? "🔴 إيقاف البينج" : "🟢 تفعيل البينج", "adm:pingToggle")],
      [Markup.button.callback(`⏱️ تغيير الفترة (حالياً: ${intervalMin} د)`, "adm:pingSetInterval")],
      [Markup.button.callback("⬅️ رجوع", "admin:menu")],
    ]));
}

function startPingScheduler(bot) {
  setInterval(async () => {
    try {
      const enabled = (await getSetting("auto_ping_enabled")) === "on";
      if (!enabled) return;
      const targetId = Number(await getSetting("auto_ping_target_user_id"));
      if (!targetId) return;
      const intervalMin = Number(await getSetting("auto_ping_interval_min")) || 5;
      const lastSent = Number(await getSetting("auto_ping_last_sent")) || 0;
      const now = Date.now();
      if (now - lastSent < intervalMin * 60_000) return;
      await setSetting("auto_ping_last_sent", String(now));
      await bot.telegram.sendMessage(targetId, "/start").catch(() => {});
    } catch { /* silent */ }
  }, 30_000).unref();
}

// ============================================================
//  BOT REGISTRATION
// ============================================================
async function startBot() {
  const token = process.env.BOT_TOKEN;
  if (!token) { console.error("❌ BOT_TOKEN is required"); process.exit(1); }

  await ensureDefaults();
  await ensureDefaultDepositMethods();

  const bot = new Telegraf(token, { handlerTimeout: 60_000 });

  // Rate limiter
  const _rateMap = new Map();
  bot.use((ctx, next) => {
    const uid = ctx.from?.id;
    if (!uid) return next();
    const now = Date.now();
    const times = (_rateMap.get(uid) ?? []).filter(t => now - t < 3_000);
    if (times.length >= 4) {
      if (ctx.callbackQuery) ctx.answerCbQuery("⏱️ الرجاء الانتظار لحظة...").catch(() => {});
      return;
    }
    times.push(now);
    _rateMap.set(uid, times);
    if (_rateMap.size > 50_000) {
      for (const [k, v] of _rateMap) if (v.every(t => now - t > 3_000)) _rateMap.delete(k);
    }
    return next();
  });

  // ── /start, /menu, /balance, /support, /contact, /admin ──
  bot.start(async ctx => { setStep(ctx.from.id, { kind: "idle" }); await showMainMenu(ctx); });
  bot.command("menu", async ctx => { setStep(ctx.from.id, { kind: "idle" }); await showMainMenu(ctx); });
  bot.command("balance", async ctx => {
    const u = await ensureUser(ctx); if (!u) return;
    await ctx.reply(`💰 رصيدك: ${formatBalance(Number(u.balance), await getExchangeRate())}`);
  });
  bot.command("support", async ctx => showContactLinks(ctx));
  bot.command("contact", async ctx => showContactLinks(ctx));
  bot.command("orders", async ctx => { await ensureUser(ctx); await showMyOrders(ctx, 1); });
  bot.command("deposit", async ctx => { await ensureUser(ctx); await showDepositMenu(ctx); });
  bot.command("admin", async ctx => {
    await ensureUser(ctx);
    const u = await getUser(ctx.from.id);
    if (u?.isAdmin) await showAdminMenu(ctx);
    else {
      setStep(ctx.from.id, { kind: "admin:login" });
      await ctx.reply("🔐 أرسل كلمة مرور الإدارة:", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "home")]]));
    }
  });

  // ── Simple callbacks ──
  bot.action("noop", async ctx => ctx.answerCbQuery());
  bot.action("home", async ctx => { ctx.answerCbQuery().catch(() => {}); await showMainMenu(ctx); });
  bot.action("balance", async ctx => {
    ctx.answerCbQuery().catch(() => {});
    const u = await ensureUser(ctx); if (!u) return;
    await sendOrEdit(ctx, `💰 رصيدك: ${formatBalance(Number(u.balance), await getExchangeRate())}`, { reply_markup: { inline_keyboard: [[{ text: "🏠 الرئيسية", callback_data: "home" }]] } });
  });
  bot.action("support", async ctx => { ctx.answerCbQuery().catch(() => {}); await showContactLinks(ctx); });
  bot.action("deposit", async ctx => { ctx.answerCbQuery().catch(() => {}); await ensureUser(ctx); await showDepositMenu(ctx); });

  // ── Categories ──
  bot.action(/^cat:(\d+):(\d+):(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await showCategory(ctx, Number(ctx.match[1]), Number(ctx.match[2]), Number(ctx.match[3])); });
  bot.action(/^cat:(\d+):(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await showCategory(ctx, Number(ctx.match[1]), Number(ctx.match[2]), 0); });
  bot.action(/^prod:(\d+):(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await showProduct(ctx, Number(ctx.match[1]), Number(ctx.match[2])); });
  bot.action(/^buy:(\d+):(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await startOrderFlow(ctx, Number(ctx.match[1]), Number(ctx.match[2])); });
  bot.action(/^vcat:(\d+):(\d+):(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await showVirtualCategory(ctx, Number(ctx.match[1]), Number(ctx.match[2]), Number(ctx.match[3])); });
  bot.action(/^vcat:(\d+):(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await showVirtualCategory(ctx, Number(ctx.match[1]), Number(ctx.match[2]), 0); });
  bot.action(/^mprod:(\d+):(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await showManualProduct(ctx, Number(ctx.match[1]), Number(ctx.match[2])); });

  // ── Manual orders ──
  bot.action(/^mord:buy:(\d+):(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); await ensureUser(ctx);
    const mId = Number(ctx.match[1]); const backTo = Number(ctx.match[2]);
    const m = (await db.select().from(manualProductsTable).where(eq(manualProductsTable.id, mId)).limit(1))[0];
    if (!m || !m.active) { await ctx.reply("⚠️ المنتج غير متاح."); return; }
    const u = await getUser(ctx.from.id);
    const balance = u ? Number(u.balance) : 0;
    const usd = Number(m.priceUsd);
    const rate = await getExchangeRate();
    const syp = Math.round(usd * rate);
    if (balance < usd) {
      await sendOrEdit(ctx, `❌ رصيدك غير كافٍ.\n🛒 المنتج: ${m.name}\n💰 السعر: ${usd.toFixed(2)}$\n💳 رصيدك: ${balance.toFixed(2)}$`,
        Markup.inlineKeyboard([[Markup.button.callback("💳 شحن رصيد", "deposit")], [Markup.button.callback("❌ إلغاء", "home")]])); return;
    }
    await sendOrEdit(ctx, `🧾 تأكيد الطلب اليدوي\n\n🛒 المنتج: ${m.name}\n💰 السعر: ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س\n💳 رصيدك: ${balance.toFixed(2)}$\n\n⚠️ سيتم خصم المبلغ الآن ويقوم الأدمن بتنفيذ الطلب يدوياً.`,
      Markup.inlineKeyboard([[Markup.button.callback("✅ تأكيد وخصم الرصيد", `mord:confirm:${mId}:${backTo}`)], [Markup.button.callback("❌ إلغاء", `mprod:${mId}:${backTo}`)]]));
  });
  bot.action(/^mord:confirm:(\d+):(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); await ensureUser(ctx);
    const mId = Number(ctx.match[1]);
    const m = (await db.select().from(manualProductsTable).where(eq(manualProductsTable.id, mId)).limit(1))[0];
    if (!m || !m.active) { await ctx.reply("⚠️ المنتج غير متاح."); return; }
    const u = await getUser(ctx.from.id);
    const balance = u ? Number(u.balance) : 0;
    const usd = Number(m.priceUsd);
    if (balance < usd) { await ctx.reply("❌ ليس لديك رصيد كافٍ."); return; }
    await clearInlineKeyboard(ctx).catch(() => {});
    await adjustBalance(ctx.from.id, -usd);
    const order = (await db.insert(manualOrdersTable).values({ userId: ctx.from.id, productId: mId, productName: m.name, priceUsd: String(usd), status: "pending" }).returning())[0];
    const rate = await getExchangeRate();
    const syp = Math.round(usd * rate);
    await ctx.reply(`✅ تم استلام طلبك #M${order.id}\n🛒 المنتج: ${m.name}\n💰 تم خصم ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س من رصيدك.\n\n⏳ سيقوم الأدمن بمعالجة طلبك قريباً.`,
      Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
    const admins = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.isAdmin, true));
    const notif = `🆕 طلب يدوي جديد #M${order.id}\n👤 المستخدم: ${ctx.from.id}${ctx.from.username ? ` (@${ctx.from.username})` : ""}\n🛒 المنتج: ${m.name}\n💰 ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س`;
    for (const admin of admins) await ctx.telegram.sendMessage(admin.id, notif, Markup.inlineKeyboard([[Markup.button.callback("📋 عرض الطلب", `adm:mord:${order.id}`)]])).catch(() => {});
  });

  // ── Deposit ──
  bot.action(/^dep:pick:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {});
    const m = (await db.select().from(depositMethodsTable).where(eq(depositMethodsTable.id, Number(ctx.match[1]))).limit(1))[0];
    if (!m) { await ctx.reply("⚠️ غير موجود."); return; }
    setStep(ctx.from.id, { kind: "deposit:number", methodId: m.id, methodName: m.name });
    await ctx.reply(`💳 ${m.name}\nالرقم/المعرف: \`${m.identifier}\`\n\n${m.instructions}\n\nأرسل: المبلغ والرقم الذي حولت منه`,
      { parse_mode: "Markdown", ...Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "dep:cancel")]]) });
  });
  bot.action("dep:cancel", async ctx => {
    ctx.answerCbQuery("تم الإلغاء").catch(() => {});
    setStep(ctx.from.id, { kind: "idle" });
    await ctx.reply("تم إلغاء عملية الإيداع.");
  });

  // ── Orders ──
  bot.action(/^myorders:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await showMyOrders(ctx, Number(ctx.match[1])); });
  bot.action("ord:cancel", async ctx => {
    ctx.answerCbQuery("تم الإلغاء").catch(() => {});
    setStep(ctx.from.id, { kind: "idle" });
    await sendOrEdit(ctx, "تم إلغاء الطلب.", Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
  });
  bot.action("ord:confirm", async ctx => { ctx.answerCbQuery().catch(() => {}); await executeOrder(ctx); });
  bot.action(/^ord:qty:([\d.]+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {});
    const step = getStep(ctx.from.id);
    if (step.kind !== "order:qty") return;
    const qty = Number(ctx.match[1]);
    if (!Number.isFinite(qty) || qty <= 0) return;
    let all = await getCachedProducts();
    let p = all.find(x => x.id === step.productId);
    if (!p) { all = await fetchAllProducts(); p = all.find(x => x.id === step.productId); }
    if (!p) return;
    await askNextParam(ctx, p, step.priceUsd, qty, step.paramKeys, {}, 0, step.backTo);
  });
  bot.action(/^ord:check:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await checkOrderStatus(ctx, Number(ctx.match[1])); });

  // ── Admin Menu ──
  bot.action("admin:menu", async ctx => { ctx.answerCbQuery().catch(() => {}); await showAdminMenu(ctx); });
  bot.action("admin:loginPrompt", async ctx => {
    ctx.answerCbQuery().catch(() => {});
    setStep(ctx.from.id, { kind: "admin:login" });
    await ctx.reply("🔐 أرسل كلمة مرور الإدارة:", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "home")]]));
  });
  bot.action("adm:settings", async ctx => { ctx.answerCbQuery().catch(() => {}); await showSettingsMenu(ctx); });
  bot.action("adm:setMarkup", async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:setMarkup" }); await ctx.reply("📈 أرسل نسبة الربح العام (مثال: 3 أو 5.5):"); });
  bot.action("adm:setSocialMarkup", async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:setSocialMarkup" }); await ctx.reply("📈 أرسل نسبة ربح السوشل ميديا:"); });
  bot.action("adm:setRate", async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:setRate" }); await ctx.reply("💱 أرسل سعر الصرف (ل.س لكل دولار):"); });
  bot.action("adm:newPass", async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:newPassword" }); await ctx.reply("🔑 أرسل كلمة المرور الجديدة:"); });
  bot.action("adm:toggleStatus", async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const cur = await getBotStatus();
    await setSetting("bot_status", cur === "on" ? "off" : "on");
    await showAdminMenu(ctx);
  });

  // Deposits admin
  bot.action(/^adm:depList:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await showDepList(ctx, Number(ctx.match[1])); });
  bot.action(/^adm:depShow:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await showDepDetails(ctx, Number(ctx.match[1])); });
  bot.action(/^adm:dep:approve:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await clearInlineKeyboard(ctx); await approveDeposit(ctx, Number(ctx.match[1])); });
  bot.action(/^adm:dep:reject:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await clearInlineKeyboard(ctx); await rejectDeposit(ctx, Number(ctx.match[1])); });

  // Users admin
  bot.action(/^adm:users:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await showUsersList(ctx, Number(ctx.match[1])); });
  bot.action("adm:findUser", async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:findUser" }); await ctx.reply("🔍 أرسل اسم المستخدم أو الرقم التعريفي:"); });
  bot.action(/^adm:user:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await showUserCard(ctx, Number(ctx.match[1])); });
  bot.action(/^adm:userAdd:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:userBalance", userId: Number(ctx.match[1]), mode: "add" }); await ctx.reply(`💵 أرسل المبلغ بالدولار لإضافته إلى المستخدم ${ctx.match[1]}:`); });
  bot.action(/^adm:userSub:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:userBalance", userId: Number(ctx.match[1]), mode: "deduct" }); await ctx.reply(`💵 أرسل المبلغ بالدولار لخصمه من المستخدم ${ctx.match[1]}:`); });
  bot.action(/^adm:userBan:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const uid = Number(ctx.match[1]); const u = await getUser(uid); if (!u) return;
    await setStatus(uid, u.status === "banned" ? "active" : "banned");
    await showUserCard(ctx, uid);
  });
  bot.action(/^adm:userAdmin:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const me = await getUser(ctx.from.id);
    if (!me?.isSuperAdmin) { await ctx.reply("⛔ يحتاج هذا الإجراء لصلاحيات المدير الأعلى."); return; }
    const uid = Number(ctx.match[1]); const u = await getUser(uid); if (!u) return;
    await setAdmin(uid, !u.isAdmin);
    await showUserCard(ctx, uid);
  });
  bot.action(/^adm:userOrders:(\d+):(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await showUserOrders(ctx, Number(ctx.match[1]), Number(ctx.match[2])); });
  bot.action(/^adm:userMarkup:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const uid = Number(ctx.match[1]); const u = await getUser(uid);
    const curMarkup = u?.customMarkupPercent != null ? Number(u.customMarkupPercent) : null;
    setStep(ctx.from.id, { kind: "admin:setUserMarkup", userId: uid });
    await ctx.reply(`% نسبة ربح المستخدم ${u?.firstName ?? uid}\nالنسبة الحالية: ${curMarkup !== null ? curMarkup + "%" : "غير محددة"}\n\nأرسل النسبة أو reset لإزالتها:`);
  });

  // All orders
  bot.action(/^adm:allOrders:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await showAllOrders(ctx, Number(ctx.match[1])); });

  // Broadcast
  bot.action("adm:broadcast", async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:broadcast" }); await ctx.reply("📣 أرسل نص الرسالة الجماعية:"); });

  // Methods
  bot.action("adm:methods", async ctx => { ctx.answerCbQuery().catch(() => {}); await showMethods(ctx); });
  bot.action("adm:methodAdd", async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:addMethod:name" }); await ctx.reply("💳 أرسل اسم طريقة الإيداع:"); });
  bot.action(/^adm:methodEdit:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await showMethodEdit(ctx, Number(ctx.match[1])); });
  bot.action(/^adm:methodToggle:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const id = Number(ctx.match[1]);
    const cur = (await db.select().from(depositMethodsTable).where(eq(depositMethodsTable.id, id)).limit(1))[0];
    if (!cur) return;
    await db.update(depositMethodsTable).set({ active: !cur.active }).where(eq(depositMethodsTable.id, id));
    await showMethodEdit(ctx, id);
  });
  bot.action(/^adm:methodInstr:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:editMethodInstructions", methodId: Number(ctx.match[1]) }); await ctx.reply("📋 أرسل التعليمات الجديدة:"); });
  bot.action(/^adm:methodDel:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const id = Number(ctx.match[1]);
    await db.delete(depositMethodsTable).where(eq(depositMethodsTable.id, id));
    await ctx.reply(`🗑️ تم حذف طريقة الإيداع #${id}.`);
    await showMethods(ctx);
  });

  // Product overrides
  bot.action(/^adm:editPrice:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const pid = Number(ctx.match[1]);
    const all = await fetchAllProducts(); const p = all.find(x => x.id === pid);
    setStep(ctx.from.id, { kind: "admin:editPrice", productId: pid, productName: p?.name ?? "" });
    await ctx.reply(`✏️ تعديل سعر المنتج: ${p?.name ?? pid}\n\nأرسل:\n• \`%5\` لربح 5%\n• \`$2.5\` لتثبيت السعر\n• \`reset\` للافتراضي`, { parse_mode: "Markdown" });
  });
  bot.action(/^adm:editInstr:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const pid = Number(ctx.match[1]);
    const all = await fetchAllProducts(); const p = all.find(x => x.id === pid);
    setStep(ctx.from.id, { kind: "admin:editProductInstructions", productId: pid, productName: p?.name ?? "" });
    await ctx.reply(`📋 أرسل تعليمات المنتج ${p?.name ?? pid}.\nللإلغاء أرسل: clear`);
  });
  bot.action(/^adm:renameProd:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const pid = Number(ctx.match[1]);
    const all = await fetchAllProducts(); const p = all.find(x => x.id === pid);
    setStep(ctx.from.id, { kind: "admin:renameProduct", productId: pid, productName: p?.name ?? "" });
    await ctx.reply(`📝 أرسل الاسم الجديد للمنتج "${p?.name ?? pid}".\nللعودة للأصلي: reset`);
  });
  bot.action(/^adm:moveProd:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const pid = Number(ctx.match[1]);
    const all = await fetchAllProducts(); const p = all.find(x => x.id === pid);
    setStep(ctx.from.id, { kind: "admin:moveProduct", productId: pid, productName: p?.name ?? "" });
    await ctx.reply(`🚚 نقل المنتج "${p?.name ?? pid}"\nأرسل رقم القسم أو reset للعودة:`);
  });
  bot.action(/^adm:hideProd:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const pid = Number(ctx.match[1]);
    const cur = (await db.select().from(productOverridesTable).where(eq(productOverridesTable.productId, pid)).limit(1))[0];
    const nextHidden = !(cur?.hidden ?? false);
    await db.insert(productOverridesTable).values({ productId: pid, hidden: nextHidden }).onConflictDoUpdate({ target: productOverridesTable.productId, set: { hidden: nextHidden, updatedAt: new Date() } });
    invalidateCaches();
    await ctx.reply(nextHidden ? "🙈 تم إخفاء المنتج." : "👁 تم إظهار المنتج.");
  });

  // Category admin
  bot.action(/^adm:catEdit:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:editCategoryName", categoryId: Number(ctx.match[1]) }); await ctx.reply("✏️ أرسل الاسم الجديد للقسم (أو reset):"); });
  bot.action(/^adm:catToggle:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const cid = Number(ctx.match[1]);
    const cur = (await db.select().from(categoryOverridesTable).where(eq(categoryOverridesTable.categoryId, cid)).limit(1))[0];
    const nextHidden = !(cur?.hidden ?? false);
    await db.insert(categoryOverridesTable).values({ categoryId: cid, hidden: nextHidden }).onConflictDoUpdate({ target: categoryOverridesTable.categoryId, set: { hidden: nextHidden, updatedAt: new Date() } });
    invalidateCaches();
    await ctx.reply(nextHidden ? "🙈 تم إخفاء القسم." : "👁 تم إظهار القسم.");
  });
  bot.action(/^adm:catMarkup:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const cid = Number(ctx.match[1]);
    const cur = (await db.select().from(categoryOverridesTable).where(eq(categoryOverridesTable.categoryId, cid)).limit(1))[0];
    const curMarkup = cur?.customMarkupPercent != null ? Number(cur.customMarkupPercent) : null;
    setStep(ctx.from.id, { kind: "admin:setCatMarkup", categoryId: cid });
    await ctx.reply(`% نسبة ربح القسم ${cid}\nالحالية: ${curMarkup !== null ? curMarkup + "%" : "غير محددة"}\n\nأرسل النسبة أو reset:`);
  });
  bot.action(/^adm:catSort:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const cid = Number(ctx.match[1]);
    const cur = (await db.select().from(categoryOverridesTable).where(eq(categoryOverridesTable.categoryId, cid)).limit(1))[0];
    setStep(ctx.from.id, { kind: "admin:setCatSort", categoryId: cid });
    await ctx.reply(`🔢 ترتيب القسم ${cid}\nالحالي: ${cur?.sortOrder != null ? cur.sortOrder : "غير محدد"}\n\nأرسل رقم الترتيب أو reset:`);
  });
  bot.action(/^adm:moveCatAll:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const sourceCatId = Number(ctx.match[1]);
    setStep(ctx.from.id, { kind: "admin:moveCatAll", sourceCategoryId: sourceCatId });
    await ctx.reply(`🚚 نقل جميع منتجات القسم #${sourceCatId}\nأرسل رقم القسم الهدف أو cancel للإلغاء:`);
  });

  // Contacts
  bot.action("adm:contacts", async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const links = await db.select().from(contactLinksTable).orderBy(contactLinksTable.id);
    const rows = links.map(l => [Markup.button.callback(`${l.active ? "✅" : "❌"} ${l.name}`, `adm:contactEdit:${l.id}`)]);
    rows.push([Markup.button.callback("➕ إضافة وسيلة تواصل", "adm:addContact")]);
    rows.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
    await sendOrEdit(ctx, "📞 وسائل التواصل:", Markup.inlineKeyboard(rows));
  });
  bot.action("adm:addContact", async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:addContact:name" }); await ctx.reply("📝 أرسل اسم وسيلة التواصل:"); });
  bot.action(/^adm:contactEdit:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const cid = Number(ctx.match[1]);
    const c = (await db.select().from(contactLinksTable).where(eq(contactLinksTable.id, cid)).limit(1))[0];
    if (!c) { await ctx.reply("⚠️ غير موجود."); return; }
    await sendOrEdit(ctx, `📞 ${c.name}\nالرابط: ${c.link}\nالحالة: ${c.active ? "✅ مفعل" : "❌ معطل"}`,
      Markup.inlineKeyboard([[Markup.button.callback(c.active ? "❌ تعطيل" : "✅ تفعيل", `adm:contactToggle:${cid}`)], [Markup.button.callback("✏️ تعديل الرابط", `adm:contactLink:${cid}`)], [Markup.button.callback("🗑️ حذف", `adm:contactDel:${cid}`)], [Markup.button.callback("⬅️ رجوع", "adm:contacts")]]));
  });
  bot.action(/^adm:contactToggle:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const cid = Number(ctx.match[1]);
    const c = (await db.select().from(contactLinksTable).where(eq(contactLinksTable.id, cid)).limit(1))[0];
    if (!c) { await ctx.reply("⚠️ غير موجود."); return; }
    await db.update(contactLinksTable).set({ active: !c.active, updatedAt: new Date() }).where(eq(contactLinksTable.id, cid));
    await ctx.reply(!c.active ? "✅ تم تفعيل وسيلة التواصل." : "❌ تم تعطيلها.");
  });
  bot.action(/^adm:contactLink:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:editContactLink", contactId: Number(ctx.match[1]) }); await ctx.reply("🔗 أرسل الرابط الجديد:"); });
  bot.action(/^adm:contactDel:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; await db.delete(contactLinksTable).where(eq(contactLinksTable.id, Number(ctx.match[1]))); await ctx.reply("🗑️ تم حذف وسيلة التواصل."); });

  // Virtual categories
  bot.action("adm:vcList", async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const vcs = await db.select().from(virtualCategoriesTable).orderBy(virtualCategoriesTable.id);
    const rows = vcs.map(v => [Markup.button.callback(`${v.active ? "📂" : "🔒"} ${v.name}`, `adm:vcInfo:${v.id}`)]);
    rows.push([Markup.button.callback("➕ إضافة قسم مخصص", "adm:addVCat")]);
    rows.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
    await sendOrEdit(ctx, "📁 الأقسام المخصصة:", Markup.inlineKeyboard(rows));
  });
  bot.action("adm:addVCat", async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:addVirtualCategory:name", parentId: 0 }); await ctx.reply("📁 أرسل اسم القسم المخصص الجديد:"); });
  bot.action(/^adm:vcInfo:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const vcId = Number(ctx.match[1]);
    const vc = (await db.select().from(virtualCategoriesTable).where(eq(virtualCategoriesTable.id, vcId)).limit(1))[0];
    if (!vc) { await ctx.reply("⚠️ غير موجود."); return; }
    await sendOrEdit(ctx, `📁 القسم: ${vc.name}\nالحالة: ${vc.active ? "✅ مرئي" : "❌ مخفي"}\n\nلإضافة منتجات: افتح المنتج ← 🚚 نقل ← ID القسم: ${vcId}`,
      Markup.inlineKeyboard([[Markup.button.callback("✏️ تعديل الاسم", `adm:vcEdit:${vcId}`)], [Markup.button.callback(vc.active ? "🙈 إخفاء" : "👁 إظهار", `adm:vcToggle:${vcId}`)], [Markup.button.callback("🗑️ حذف", `adm:vcDel:${vcId}`)], [Markup.button.callback("⬅️ رجوع", "adm:vcList")]]));
  });
  bot.action(/^adm:vcEdit:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:editVirtualCategory", vcId: Number(ctx.match[1]) }); await ctx.reply("✏️ أرسل الاسم الجديد للقسم:"); });
  bot.action(/^adm:vcToggle:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const vcId = Number(ctx.match[1]);
    const vc = (await db.select().from(virtualCategoriesTable).where(eq(virtualCategoriesTable.id, vcId)).limit(1))[0];
    if (!vc) { await ctx.reply("⚠️ غير موجود."); return; }
    await db.update(virtualCategoriesTable).set({ active: !vc.active, updatedAt: new Date() }).where(eq(virtualCategoriesTable.id, vcId));
    invalidateCaches();
    await ctx.reply(!vc.active ? "👁 تم إظهار القسم." : "🙈 تم إخفاء القسم.");
  });
  bot.action(/^adm:vcDel:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; await db.delete(virtualCategoriesTable).where(eq(virtualCategoriesTable.id, Number(ctx.match[1]))); invalidateCaches(); await ctx.reply("🗑️ تم حذف القسم المخصص."); });
  bot.action(/^adm:addVCatSub:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const parentVcId = Number(ctx.match[1]);
    const parentVc = (await db.select().from(virtualCategoriesTable).where(eq(virtualCategoriesTable.id, parentVcId)).limit(1))[0];
    setStep(ctx.from.id, { kind: "admin:addVirtualCategory:name", parentId: parentVcId });
    await ctx.reply(`📁 أرسل اسم القسم الفرعي داخل "${parentVc?.name ?? parentVcId}":`);
  });

  // Manual products
  bot.action("adm:manualProds", async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const prods = await db.select().from(manualProductsTable).orderBy(manualProductsTable.id);
    const pendingCount = (await db.select().from(manualOrdersTable).where(eq(manualOrdersTable.status, "pending"))).length;
    const rows = prods.map(p => [Markup.button.callback(`${p.active ? "🛒" : "❌"} ${p.name}`, `adm:manualProd:${p.id}`)]);
    rows.push([Markup.button.callback(`📋 طلبات معلقة ${pendingCount > 0 ? `(${pendingCount})` : ""}`, "adm:manualOrders")]);
    rows.push([Markup.button.callback("➕ إضافة منتج يدوي", "adm:addManual")]);
    rows.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
    await sendOrEdit(ctx, "🛒 المنتجات اليدوية:", Markup.inlineKeyboard(rows));
  });
  bot.action("adm:addManual", async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:addManualProduct:name" }); await ctx.reply("📝 أرسل اسم المنتج اليدوي:"); });
  bot.action(/^adm:manualProd:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const pid = Number(ctx.match[1]);
    const p = (await db.select().from(manualProductsTable).where(eq(manualProductsTable.id, pid)).limit(1))[0];
    if (!p) { await ctx.reply("⚠️ غير موجود."); return; }
    await sendOrEdit(ctx, `🛒 ${p.name}\nالسعر: ${Number(p.priceUsd).toFixed(2)}$\nالحالة: ${p.active ? "✅ مفعل" : "❌ معطل"}`,
      Markup.inlineKeyboard([[Markup.button.callback(p.active ? "❌ تعطيل" : "✅ تفعيل", `adm:manualToggle:${pid}`)], [Markup.button.callback("🗑️ حذف", `adm:manualDel:${pid}`)], [Markup.button.callback("⬅️ رجوع", "adm:manualProds")]]));
  });
  bot.action(/^adm:manualEditPrice:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:editManualPrice", productId: Number(ctx.match[1]) }); await ctx.reply("💵 أرسل السعر الجديد بالدولار:"); });
  bot.action(/^adm:manualToggle:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const pid = Number(ctx.match[1]);
    const p = (await db.select().from(manualProductsTable).where(eq(manualProductsTable.id, pid)).limit(1))[0];
    if (!p) { await ctx.reply("⚠️ غير موجود."); return; }
    await db.update(manualProductsTable).set({ active: !p.active, updatedAt: new Date() }).where(eq(manualProductsTable.id, pid));
    await ctx.reply(!p.active ? "✅ تم تفعيل المنتج." : "❌ تم تعطيله.");
  });
  bot.action(/^adm:manualDel:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; await db.delete(manualProductsTable).where(eq(manualProductsTable.id, Number(ctx.match[1]))); await ctx.reply("🗑️ تم حذف المنتج اليدوي."); });

  // Manual orders admin
  bot.action("adm:manualOrders", async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const orders = await db.select().from(manualOrdersTable).where(eq(manualOrdersTable.status, "pending")).orderBy(desc(manualOrdersTable.id)).limit(30);
    if (orders.length === 0) { await sendOrEdit(ctx, "📭 لا توجد طلبات يدوية معلقة.", Markup.inlineKeyboard([[Markup.button.callback("⬅️ رجوع", "adm:manualProds")]])); return; }
    const rows = orders.map(o => [Markup.button.callback(`#M${o.id} • ${o.productName.slice(0, 20)} • ${Number(o.priceUsd).toFixed(2)}$`.slice(0, 60), `adm:mord:${o.id}`)]);
    rows.push([Markup.button.callback("⬅️ رجوع", "adm:manualProds")]);
    await sendOrEdit(ctx, `📋 الطلبات اليدوية المعلقة (${orders.length}):`, Markup.inlineKeyboard(rows));
  });
  bot.action(/^adm:mord:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const oid = Number(ctx.match[1]);
    const o = (await db.select().from(manualOrdersTable).where(eq(manualOrdersTable.id, oid)).limit(1))[0];
    if (!o) { await ctx.reply("⚠️ الطلب غير موجود."); return; }
    const u = (await db.select().from(usersTable).where(eq(usersTable.id, o.userId)).limit(1))[0];
    const rate = await getExchangeRate();
    const syp = Math.round(Number(o.priceUsd) * rate);
    const text = `📋 طلب يدوي #M${o.id}\n👤 المستخدم: ${u?.username ? "@" + u.username : `ID:${o.userId}`}\n🛒 المنتج: ${o.productName}\n💰 ${Number(o.priceUsd).toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س\nالحالة: ${o.status}`;
    await sendOrEdit(ctx, text, Markup.inlineKeyboard([
      [Markup.button.callback("✅ قبول وتسليم", `adm:mordAccept:${oid}`), Markup.button.callback("❌ رفض واسترداد", `adm:mordReject:${oid}`)],
      [Markup.button.callback("💬 إرسال رسالة", `adm:mordMsg:${oid}`)],
      [Markup.button.callback("⬅️ رجوع", "adm:manualOrders")],
    ]));
  });
  bot.action(/^adm:mordAccept:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const oid = Number(ctx.match[1]);
    const o = (await db.select().from(manualOrdersTable).where(eq(manualOrdersTable.id, oid)).limit(1))[0];
    if (!o || o.status !== "pending") { await ctx.reply("⚠️ الطلب غير موجود أو تم معالجته."); return; }
    setStep(ctx.from.id, { kind: "admin:manualOrderAccept", orderId: oid, userId: o.userId, productName: o.productName, priceUsd: Number(o.priceUsd) });
    await ctx.reply(`✏️ أرسل رسالة التسليم (رابط، كود...) أو "skip" لتخطيها:`);
  });
  bot.action(/^adm:mordReject:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const oid = Number(ctx.match[1]);
    const o = (await db.select().from(manualOrdersTable).where(eq(manualOrdersTable.id, oid)).limit(1))[0];
    if (!o || o.status !== "pending") { await ctx.reply("⚠️ الطلب غير موجود أو تم معالجته."); return; }
    await db.update(manualOrdersTable).set({ status: "rejected", updatedAt: new Date() }).where(eq(manualOrdersTable.id, oid));
    await adjustBalance(o.userId, Number(o.priceUsd));
    const rate = await getExchangeRate();
    const syp = Math.round(Number(o.priceUsd) * rate);
    await ctx.reply(`✅ تم رفض الطلب #M${oid} وإعادة الرصيد.`);
    await ctx.telegram.sendMessage(o.userId, `❌ تم رفض طلبك #M${oid}\n🛒 المنتج: ${o.productName}\n💰 تمت إعادة ${Number(o.priceUsd).toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س إلى رصيدك.`, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]])).catch(() => {});
  });
  bot.action(/^adm:mordMsg:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const oid = Number(ctx.match[1]);
    const o = (await db.select().from(manualOrdersTable).where(eq(manualOrdersTable.id, oid)).limit(1))[0];
    if (!o) { await ctx.reply("⚠️ الطلب غير موجود."); return; }
    setStep(ctx.from.id, { kind: "admin:manualOrderMsg", orderId: oid, userId: o.userId });
    await ctx.reply(`💬 أرسل الرسالة للمستخدم ${o.userId}:`);
  });

  // Nav button labels
  bot.action("adm:btnLabels", async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const [b, h, p, n] = await Promise.all([getBtnBackLabel(), getBtnHomeLabel(), getBtnPrevLabel(), getBtnNextLabel()]);
    await sendOrEdit(ctx, `🔘 أزرار التنقل:\nرجوع: ${b}\nالرئيسية: ${h}\nالسابق: ${p}\nالتالي: ${n}`,
      Markup.inlineKeyboard([
        [Markup.button.callback("✏️ زر الرجوع", "adm:btnEdit:btn_back_label:رجوع")],
        [Markup.button.callback("✏️ زر الرئيسية", "adm:btnEdit:btn_home_label:الرئيسية")],
        [Markup.button.callback("✏️ زر السابق", "adm:btnEdit:btn_prev_label:السابق")],
        [Markup.button.callback("✏️ زر التالي", "adm:btnEdit:btn_next_label:التالي")],
        [Markup.button.callback("🔄 إعادة الافتراضي للكل", "adm:btnReset")],
        [Markup.button.callback("⬅️ رجوع", "adm:settings")],
      ]));
  });
  bot.action(/^adm:btnEdit:([^:]+):(.+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    setStep(ctx.from.id, { kind: "admin:editBtnLabel", settingKey: ctx.match[1], labelName: ctx.match[2] });
    await ctx.reply(`✏️ أرسل النص الجديد لزر "${ctx.match[2]}" (أو reset للافتراضي):`);
  });
  bot.action("adm:btnReset", async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    await Promise.all(["btn_back_label", "btn_home_label", "btn_prev_label", "btn_next_label"].map(k => deleteSetting(k)));
    await ctx.reply("✅ تمت إعادة نصوص الأزرار للافتراضية.");
  });

  // AI support
  bot.action("adm:aiSupport", async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    setStep(ctx.from.id, { kind: "admin:aiSupport" });
    const aiActive = hasAiKey();
    await sendOrEdit(ctx, `🛠️ مساعد الإدارة\n\n${aiActive ? "✅ الذكاء الاصطناعي مفعّل — اسألني أي شيء\n\n" : "💡 اسألني عن أي إعداد\n\n"}اكتب سؤالك الآن:`,
      Markup.inlineKeyboard([[Markup.button.callback("🗑️ مسح المحادثة", "adm:aiClear")], [Markup.button.callback("⬅️ رجوع للإدارة", "admin:menu")]]));
  });
  bot.action("adm:aiClear", async ctx => {
    ctx.answerCbQuery("🗑️ تم مسح المحادثة").catch(() => {}); if (!(await requireAdmin(ctx))) return;
    clearAiHistory(ctx.from.id); setStep(ctx.from.id, { kind: "idle" });
  });

  // Ping
  bot.action("adm:ping", async ctx => { ctx.answerCbQuery().catch(() => {}); await showPingMenu(ctx); });
  bot.action("adm:pingToggle", async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const enabled = (await getSetting("auto_ping_enabled")) === "on";
    if (!enabled) {
      await setSetting("auto_ping_enabled", "on");
      await setSetting("auto_ping_target_user_id", String(ctx.from.id));
      await setSetting("auto_ping_last_sent", "0");
    } else {
      await setSetting("auto_ping_enabled", "off");
    }
    await showPingMenu(ctx);
  });
  bot.action("adm:pingSetInterval", async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const cur = Number(await getSetting("auto_ping_interval_min")) || 5;
    setStep(ctx.from.id, { kind: "admin:setPingInterval" });
    await ctx.reply(`⏱️ أرسل الفترة بالدقائق (1-1440).\nالقيمة الحالية: ${cur} دقيقة:`);
  });

  // ── Photo handler ──
  bot.on("photo", async (ctx, next) => {
    const step = getStep(ctx.from.id);
    if (step.kind !== "deposit:photo") return next();
    const photos = ctx.message.photo;
    const fileId = photos[photos.length - 1].file_id;
    const inserted = await db.insert(depositRequestsTable).values({
      userId: ctx.from.id, methodId: step.methodId, methodName: step.methodName,
      payerNumber: step.payerNumber, screenshotFileId: fileId,
    }).returning();
    setStep(ctx.from.id, { kind: "idle" });
    const dep = inserted[0];
    await ctx.reply(`✅ تم استلام طلب الإيداع #${dep.id}.\nسيتم مراجعته قريباً.`);
    await notifyAdminsDeposit(ctx, dep.id);
  });

  // ── Text router ──
  bot.on("text", async (ctx, next) => {
    const step = getStep(ctx.from.id);
    const txt = ctx.message.text.trim();
    if (txt.startsWith("/")) return next();

    // deposit:number
    if (step.kind === "deposit:number") {
      setStep(ctx.from.id, { kind: "deposit:photo", methodId: step.methodId, methodName: step.methodName, payerNumber: txt });
      await ctx.reply("📸 الآن أرسل صورة إشعار التحويل.", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "dep:cancel")]]));
      return;
    }

    // order:qty
    if (step.kind === "order:qty") {
      const n = Number(txt);
      if (!Number.isFinite(n) || n <= 0) { await ctx.reply("⚠️ أدخل رقم صحيح موجب."); return; }
      const qv = step.qtyValues;
      const qty = Array.isArray(qv) ? n : Math.floor(n);
      if (qv && !Array.isArray(qv)) {
        if (qty < qv.min || qty > qv.max) { await ctx.reply(`⚠️ يجب أن تكون الكمية بين ${qv.min.toLocaleString("en-US")} و ${qv.max.toLocaleString("en-US")}.`); return; }
      } else if (Array.isArray(qv) && qv.length > 0) {
        const match = qv.find(v => Math.abs(v - qty) < 0.0001);
        if (!match) { await ctx.reply(`⚠️ الكمية يجب أن تكون من: ${qv.join(", ")}`); return; }
      }
      let all = await getCachedProducts(); let p = all.find(x => x.id === step.productId);
      if (!p) { all = await fetchAllProducts(); p = all.find(x => x.id === step.productId); }
      if (!p) return;
      await askNextParam(ctx, p, step.priceUsd, qty, step.paramKeys, {}, 0, step.backTo);
      return;
    }

    // order:params
    if (step.kind === "order:params") {
      if (step.idx >= step.paramKeys.length) return next();
      const key = step.paramKeys[step.idx];
      const collected = { ...step.collected, [key]: txt };
      let all = await getCachedProducts(); let p = all.find(x => x.id === step.productId);
      if (!p) { all = await fetchAllProducts(); p = all.find(x => x.id === step.productId); }
      if (!p) return;
      await askNextParam(ctx, p, step.priceUsd, step.qty, step.paramKeys, collected, step.idx + 1, step.backTo);
      return;
    }

    // Admin text handlers
    switch (step.kind) {
      case "admin:login": {
        const expected = await getAdminPassword();
        if (txt !== expected) { await ctx.reply("❌ كلمة المرور خاطئة، حاول مجدداً:", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "home")]])); return; }
        const existingSuper = await db.select().from(usersTable).where(eq(usersTable.isSuperAdmin, true)).limit(1);
        const becomeSuper = existingSuper.length === 0;
        await setAdmin(ctx.from.id, true, becomeSuper);
        await markAdminAuthed(ctx.from.id);
        setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(`✅ تم تسجيل الدخول بنجاح${becomeSuper ? " (مدير أعلى)" : ""}.`);
        await showAdminMenu(ctx);
        return;
      }
      case "admin:setMarkup": {
        const n = Number(txt);
        if (!Number.isFinite(n) || n < 0) { await ctx.reply("⚠️ أدخل رقماً صالحاً."); return; }
        await setSetting("markup_percent", String(n)); invalidateCaches();
        setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(`✅ تم ضبط الربح العام على ${n}%.`); await showSettingsMenu(ctx); return;
      }
      case "admin:setSocialMarkup": {
        const n = Number(txt);
        if (!Number.isFinite(n) || n < 0) { await ctx.reply("⚠️ أدخل رقماً صالحاً."); return; }
        await setSetting("social_markup_percent", String(n)); invalidateCaches();
        setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(`✅ تم ضبط ربح السوشل على ${n}%.`); await showSettingsMenu(ctx); return;
      }
      case "admin:setRate": {
        const n = Number(txt);
        if (!Number.isFinite(n) || n <= 0) { await ctx.reply("⚠️ أدخل سعر صرف صالح."); return; }
        await setSetting("exchange_rate", String(n));
        setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(`✅ تم ضبط سعر الصرف على ${n} ل.س/$.`); await showSettingsMenu(ctx); return;
      }
      case "admin:newPassword": {
        if (txt.length < 4) { await ctx.reply("⚠️ كلمة المرور قصيرة جداً."); return; }
        await setSetting("admin_password", txt);
        setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply("✅ تم تحديث كلمة المرور."); await showSettingsMenu(ctx); return;
      }
      case "admin:depositApproveAmount": {
        const n = Number(txt);
        if (!Number.isFinite(n) || n <= 0) { await ctx.reply("⚠️ أدخل مبلغاً صالحاً (دولار)."); return; }
        const d = (await db.select().from(depositRequestsTable).where(eq(depositRequestsTable.id, step.depositId)).limit(1))[0];
        if (!d) { setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("⚠️ طلب الإيداع غير موجود."); return; }
        await db.update(depositRequestsTable).set({ status: "approved", amount: String(n), processedBy: ctx.from.id, processedAt: new Date() }).where(eq(depositRequestsTable.id, step.depositId));
        await adjustBalance(d.userId, n);
        setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(`✅ تمت إضافة ${n}$ لرصيد المستخدم ${d.userId}.`);
        try { await ctx.telegram.sendMessage(d.userId, `✅ تم اعتماد طلب الإيداع #${d.id} وإضافة ${n}$ إلى رصيدك.`); } catch { /* ignore */ }
        return;
      }
      case "admin:userBalance": {
        const n = Number(txt);
        if (!Number.isFinite(n) || n <= 0) { await ctx.reply("⚠️ أدخل مبلغاً صالحاً."); return; }
        const delta = step.mode === "add" ? n : -n;
        await adjustBalance(step.userId, delta);
        setStep(ctx.from.id, { kind: "idle" });
        const u = await getUser(step.userId);
        await ctx.reply(`✅ تم تعديل رصيد المستخدم ${step.userId}.\nالرصيد الجديد: ${u ? Number(u.balance).toFixed(2) : "?"}$`);
        try { await ctx.telegram.sendMessage(step.userId, step.mode === "add" ? `💰 تم إضافة ${n}$ إلى رصيدك من قبل الإدارة.` : `💸 تم خصم ${n}$ من رصيدك من قبل الإدارة.`); } catch { /* ignore */ }
        return;
      }
      case "admin:findUser": {
        const found = await searchUser(txt);
        setStep(ctx.from.id, { kind: "idle" });
        if (found.length === 0) { await ctx.reply("⚠️ لا يوجد نتائج."); return; }
        const kb = found.map(u => [Markup.button.callback(`${u.firstName ?? "—"}${u.username ? " @" + u.username : ""} • ${Number(u.balance).toFixed(2)}$`, `adm:user:${u.id}`)]);
        kb.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
        await ctx.reply(`نتائج البحث (${found.length}):`, Markup.inlineKeyboard(kb));
        return;
      }
      case "admin:editPrice": {
        if (txt.toLowerCase() === "reset") {
          await db.insert(productOverridesTable).values({ productId: step.productId, productName: step.productName }).onConflictDoUpdate({ target: productOverridesTable.productId, set: { customMarkupPercent: null, customPriceUsd: null, updatedAt: new Date() } });
          invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تمت إعادة السعر للافتراضي."); return;
        }
        const m = txt.match(/^([%$])\s*(-?\d+(\.\d+)?)$/);
        if (!m) { await ctx.reply("⚠️ صيغة غير صحيحة. مثال: `%5` أو `$2.5`."); return; }
        const v = Number(m[2]);
        const set = { productId: step.productId, productName: step.productName, updatedAt: new Date() };
        if (m[1] === "%") { set.customMarkupPercent = String(v); set.customPriceUsd = null; }
        else { set.customPriceUsd = String(v); set.customMarkupPercent = null; }
        await db.insert(productOverridesTable).values(set).onConflictDoUpdate({ target: productOverridesTable.productId, set });
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ تم حفظ السعر الجديد للمنتج ${step.productName}.`); return;
      }
      case "admin:editProductInstructions": {
        const value = txt.toLowerCase() === "clear" ? null : txt;
        await db.insert(productOverridesTable).values({ productId: step.productId, productName: step.productName, instructions: value }).onConflictDoUpdate({ target: productOverridesTable.productId, set: { instructions: value, updatedAt: new Date() } });
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(value ? "✅ تم حفظ التعليمات." : "✅ تم مسح التعليمات."); return;
      }
      case "admin:renameProduct": {
        const value = txt.toLowerCase() === "reset" ? null : txt;
        await db.insert(productOverridesTable).values({ productId: step.productId, productName: step.productName, customName: value }).onConflictDoUpdate({ target: productOverridesTable.productId, set: { customName: value, updatedAt: new Date() } });
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(value ? `✅ تم تغيير اسم المنتج إلى: ${value}` : "✅ تمت إعادة الاسم الأصلي."); return;
      }
      case "admin:moveProduct": {
        let target = null;
        if (txt.toLowerCase() !== "reset") {
          const n = Number(txt);
          if (!Number.isInteger(n) || n <= 0) { await ctx.reply("⚠️ يجب إرسال رقم القسم."); return; }
          target = n;
        }
        await db.insert(productOverridesTable).values({ productId: step.productId, productName: step.productName, customCategoryId: target }).onConflictDoUpdate({ target: productOverridesTable.productId, set: { customCategoryId: target, updatedAt: new Date() } });
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(target == null ? "✅ تمت إعادة المنتج لقسمه الأصلي." : `✅ تم نقل المنتج إلى القسم رقم ${target}.`); return;
      }
      case "admin:moveCatAll": {
        if (txt.toLowerCase() === "cancel") { setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("❌ تم إلغاء العملية."); return; }
        const targetId = Number(txt);
        if (!Number.isInteger(targetId) || targetId <= 0) { await ctx.reply("⚠️ يجب إرسال رقم القسم الهدف، أو cancel للإلغاء."); return; }
        const allProducts = await getCachedProducts();
        const sourcePids = allProducts.filter(p => p.parent_id === step.sourceCategoryId).map(p => p.id);
        if (sourcePids.length === 0) { setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("⚠️ لم يتم العثور على منتجات."); return; }
        let moved = 0;
        for (const pid of sourcePids) {
          const product = allProducts.find(p => p.id === pid);
          await db.insert(productOverridesTable).values({ productId: pid, productName: product?.name ?? String(pid), customCategoryId: targetId }).onConflictDoUpdate({ target: productOverridesTable.productId, set: { customCategoryId: targetId, updatedAt: new Date() } });
          moved++;
        }
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(`✅ تم نقل ${moved} منتج من القسم #${step.sourceCategoryId} إلى القسم #${targetId}.`); return;
      }
      case "admin:editCategoryName": {
        const value = txt.toLowerCase() === "reset" ? null : txt;
        await db.insert(categoryOverridesTable).values({ categoryId: step.categoryId, customName: value }).onConflictDoUpdate({ target: categoryOverridesTable.categoryId, set: { customName: value, updatedAt: new Date() } });
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم تحديث اسم القسم."); return;
      }
      case "admin:broadcast": {
        const userRows = await db.select({ id: usersTable.id }).from(usersTable);
        let sent = 0;
        for (const u of userRows) { try { await ctx.telegram.sendMessage(u.id, txt); sent++; } catch { /* ignore */ } }
        await db.insert(broadcastsTable).values({ message: txt, sentBy: ctx.from.id, sentCount: sent });
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`📣 تم الإرسال إلى ${sent} مستخدم.`); return;
      }
      case "admin:addMethod:name": {
        setStep(ctx.from.id, { kind: "admin:addMethod:id", name: txt });
        await ctx.reply("📌 أرسل الرقم/المعرف لطريقة الإيداع:"); return;
      }
      case "admin:addMethod:id": {
        setStep(ctx.from.id, { kind: "admin:addMethod:instructions", name: step.name, identifier: txt });
        await ctx.reply("📋 أرسل تعليمات الإيداع للمستخدمين:"); return;
      }
      case "admin:addMethod:instructions": {
        await db.insert(depositMethodsTable).values({ name: step.name, identifier: step.identifier, instructions: txt, active: true });
        setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(`✅ تمت إضافة طريقة الإيداع "${step.name}".`);
        await showMethods(ctx); return;
      }
      case "admin:editMethodInstructions": {
        await db.update(depositMethodsTable).set({ instructions: txt }).where(eq(depositMethodsTable.id, step.methodId));
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم تحديث التعليمات.");
        await showMethodEdit(ctx, step.methodId); return;
      }
      case "admin:addContact:name": {
        setStep(ctx.from.id, { kind: "admin:addContact:link", name: txt });
        await ctx.reply(`🔗 أرسل رابط/معرف "${txt}":`); return;
      }
      case "admin:addContact:link": {
        await db.insert(contactLinksTable).values({ name: step.name, link: txt, active: true });
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ تمت إضافة وسيلة التواصل "${step.name}".`); return;
      }
      case "admin:editContactLink": {
        await db.update(contactLinksTable).set({ link: txt, updatedAt: new Date() }).where(eq(contactLinksTable.id, step.contactId));
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم تحديث رابط التواصل."); return;
      }
      case "admin:addVirtualCategory:name": {
        await db.insert(virtualCategoriesTable).values({ name: txt, parentId: step.parentId, active: true });
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(`✅ تمت إضافة القسم "${txt}".`); return;
      }
      case "admin:editVirtualCategory": {
        await db.update(virtualCategoriesTable).set({ name: txt, updatedAt: new Date() }).where(eq(virtualCategoriesTable.id, step.vcId));
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ تم تغيير اسم القسم إلى: ${txt}`); return;
      }
      case "admin:addManualProduct:name": {
        setStep(ctx.from.id, { kind: "admin:addManualProduct:price", name: txt });
        await ctx.reply(`💵 أرسل سعر المنتج بالدولار:`); return;
      }
      case "admin:addManualProduct:price": {
        const price = Number(txt);
        if (!Number.isFinite(price) || price < 0) { await ctx.reply("⚠️ سعر غير صحيح."); return; }
        setStep(ctx.from.id, { kind: "admin:addManualProduct:catId", name: step.name, priceUsd: price });
        await ctx.reply("📁 أرسل رقم القسم (ID) الذي سيظهر فيه المنتج (0 للرئيسية):"); return;
      }
      case "admin:addManualProduct:catId": {
        const catId = Number(txt);
        if (!Number.isInteger(catId) || catId < 0) { await ctx.reply("⚠️ أرسل رقماً صحيحاً."); return; }
        const isVcat = catId > 0 ? !!(await db.select({ id: virtualCategoriesTable.id }).from(virtualCategoriesTable).where(eq(virtualCategoriesTable.id, catId)).limit(1))[0] : false;
        setStep(ctx.from.id, { kind: "admin:addManualProduct:apiId", name: step.name, priceUsd: step.priceUsd, categoryId: catId, categoryIsVirtual: isVcat });
        await ctx.reply(`📁 القسم المختار: ${isVcat ? "📂 قسم مخصص" : "🗂️ قسم حقيقي"} (ID: ${catId})\n\n🔗 أرسل رقم المنتج في API الموقع (أو skip للتخطي):`); return;
      }
      case "admin:addManualProduct:apiId": {
        const apiId = txt.toLowerCase() === "skip" ? null : Number(txt);
        await db.insert(manualProductsTable).values({ name: step.name, priceUsd: String(step.priceUsd), categoryId: step.categoryId, categoryIsVirtual: step.categoryIsVirtual ?? false, apiProductId: apiId && Number.isInteger(apiId) ? apiId : null, active: true });
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ تمت إضافة المنتج "${step.name}" بسعر ${step.priceUsd.toFixed(2)}$.`); return;
      }
      case "admin:editManualPrice": {
        const price = Number(txt);
        if (!Number.isFinite(price) || price < 0) { await ctx.reply("⚠️ سعر غير صحيح."); return; }
        await db.update(manualProductsTable).set({ priceUsd: String(price), updatedAt: new Date() }).where(eq(manualProductsTable.id, step.productId));
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ تم تحديث السعر إلى ${price.toFixed(2)}$.`); return;
      }
      case "admin:editBtnLabel": {
        const value = txt.toLowerCase() === "reset" ? null : txt;
        if (value) await setSetting(step.settingKey, value); else await deleteSetting(step.settingKey);
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(value ? `✅ تم تحديث الزر إلى: ${value}` : "✅ تمت إعادة النص الافتراضي."); return;
      }
      case "admin:manualOrderMsg": {
        await ctx.telegram.sendMessage(step.userId, `💬 رسالة من الإدارة بخصوص طلبك #M${step.orderId}:\n\n${txt}`, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]])).catch(() => {});
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ تم إرسال الرسالة للمستخدم ${step.userId}.`); return;
      }
      case "admin:manualOrderAccept": {
        const o = (await db.select().from(manualOrdersTable).where(eq(manualOrdersTable.id, step.orderId)).limit(1))[0];
        if (!o || o.status !== "pending") { setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("⚠️ الطلب غير موجود أو تم معالجته."); return; }
        await db.update(manualOrdersTable).set({ status: "accepted", adminNote: txt === "skip" ? null : txt, updatedAt: new Date() }).where(eq(manualOrdersTable.id, step.orderId));
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ تم قبول الطلب #M${step.orderId}.`);
        const rate = await getExchangeRate();
        const syp = Math.round(step.priceUsd * rate);
        const deliveryMsg = `✅ تم تنفيذ طلبك #M${step.orderId} بنجاح!\n🛒 المنتج: ${step.productName}\n💰 المبلغ: ${step.priceUsd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س` + (txt !== "skip" ? `\n\n📦 التسليم:\n${txt}` : "");
        await ctx.telegram.sendMessage(step.userId, deliveryMsg, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]])).catch(() => {}); return;
      }
      case "admin:aiSupport": {
        const thinking = await ctx.reply("🤔 جاري التفكير...");
        const aiReply = await callAiSupport(ctx.from.id, txt);
        try { await ctx.telegram.deleteMessage(ctx.chat.id, thinking.message_id); } catch { /* ignore */ }
        await ctx.reply(aiReply, Markup.inlineKeyboard([[Markup.button.callback("🗑️ مسح المحادثة", "adm:aiClear")], [Markup.button.callback("⬅️ خروج للإدارة", "admin:menu")]]));
        return;
      }
      case "admin:setPingInterval": {
        const n = Number(txt);
        if (!Number.isFinite(n) || n < 1 || n > 1440) { await ctx.reply("⚠️ أرسل رقماً بين 1 و 1440."); return; }
        await setSetting("auto_ping_interval_min", String(Math.round(n)));
        await setSetting("auto_ping_last_sent", "0");
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ تم تحديد الفترة: كل ${Math.round(n)} دقيقة.`); return;
      }
      case "admin:setCatMarkup": {
        const cid = step.categoryId;
        if (txt.toLowerCase() === "reset") {
          await db.insert(categoryOverridesTable).values({ categoryId: cid, customMarkupPercent: null }).onConflictDoUpdate({ target: categoryOverridesTable.categoryId, set: { customMarkupPercent: null } });
          invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ تم إزالة نسبة الربح المخصصة للقسم ${cid}.`); return;
        }
        const n = Number(txt);
        if (!Number.isFinite(n) || n < 0) { await ctx.reply("⚠️ أدخل رقماً صالحاً أو reset."); return; }
        await db.insert(categoryOverridesTable).values({ categoryId: cid, customMarkupPercent: String(n) }).onConflictDoUpdate({ target: categoryOverridesTable.categoryId, set: { customMarkupPercent: String(n) } });
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ تم ضبط نسبة ربح القسم ${cid} على ${n}%.`); return;
      }
      case "admin:setCatSort": {
        const cid = step.categoryId;
        if (txt.toLowerCase() === "reset") {
          await db.insert(categoryOverridesTable).values({ categoryId: cid, sortOrder: null }).onConflictDoUpdate({ target: categoryOverridesTable.categoryId, set: { sortOrder: null } });
          invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ تم إزالة الترتيب المخصص للقسم ${cid}.`); return;
        }
        const n = Number(txt);
        if (!Number.isInteger(n) || n < 1) { await ctx.reply("⚠️ أدخل رقماً صحيحاً موجباً أو reset."); return; }
        await db.insert(categoryOverridesTable).values({ categoryId: cid, sortOrder: n }).onConflictDoUpdate({ target: categoryOverridesTable.categoryId, set: { sortOrder: n } });
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ تم ضبط ترتيب القسم ${cid} على ${n}.`); return;
      }
      case "admin:setUserMarkup": {
        const uid = step.userId;
        if (txt.toLowerCase() === "reset") {
          await setUserMarkup(uid, null); setStep(ctx.from.id, { kind: "idle" });
          await ctx.reply(`✅ تم إزالة نسبة الربح المخصصة للمستخدم ${uid}.`); return;
        }
        const n = Number(txt);
        if (!Number.isFinite(n) || n < 0) { await ctx.reply("⚠️ أدخل رقماً صالحاً أو reset."); return; }
        await setUserMarkup(uid, n); setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(`✅ تم ضبط نسبة ربح المستخدم ${uid} على ${n}%.`); return;
      }
      default:
        return next();
    }
  });

  bot.catch((err, ctx) => {
    console.error("Telegraf error:", err?.message ?? err, ctx?.update);
  });

  // Set commands
  await bot.telegram.setMyCommands([
    { command: "start", description: "🚀 بدء" },
    { command: "menu", description: "📋 القائمة" },
    { command: "balance", description: "💰 رصيدي" },
    { command: "deposit", description: "💳 إيداع" },
    { command: "orders", description: "📦 طلباتي" },
    { command: "support", description: "📞 الدعم" },
    { command: "admin", description: "👑 الإدارة" },
  ]);

  prefetchInitialContent().catch(() => {});
  startBackgroundRefresher();

  bot.launch({ dropPendingUpdates: false, allowedUpdates: ["message", "callback_query"] })
    .catch(err => console.error("bot.launch failed:", err));

  startOrderPoller(bot);
  startPingScheduler(bot);

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
  process.on("uncaughtException", err => console.error("uncaughtException:", err));
  process.on("unhandledRejection", reason => console.error("unhandledRejection:", reason));

  // Self-ping HTTP keep-alive
  setInterval(() => {
    const port = Number(process.env.PORT ?? "3000");
    const req = http.get({ hostname: "localhost", port, path: "/health", timeout: 5000 }, () => {});
    req.on("error", () => {});
    req.end();
  }, 4 * 60_000).unref();

  console.log("✅ Bot launched successfully");
  return bot;
}

// ============================================================
//  EXPRESS HEALTH SERVER
// ============================================================
const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.get("/", (_, res) => res.send("OK"));
app.get("/health", (_, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Health server on port ${PORT}`);
});

// ── Start ─────────────────────────────────────────────────────
startBot().catch(err => {
  console.error("Failed to start bot:", err);
  process.exit(1);
});
