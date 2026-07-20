// ============================================================
//  بوت متجر المروان - نسخة Railway (JavaScript/pg)
//  تم تحويله من TypeScript/Drizzle إلى JavaScript/SQL
// ============================================================

const { Telegraf, Markup } = require("telegraf");
const { Pool } = require("pg");
const axios = require("axios");
const express = require("express");
const crypto = require("crypto");
const http = require("http");

// ── Environment Variables Required ──
// BOT_TOKEN=your_telegram_bot_token
// DATABASE_URL=postgresql://user:pass@host:port/db
// ORANOS_API_TOKEN=your_oranos_token
// ORANOS_API_BASE=https://api.oranosmarket.com (optional)
// ADMIN_USERNAME=your_telegram_username
// PORT=3000 (Railway sets this automatically)
// OPENAI_API_KEY=sk-... (optional, for AI support)

// ═════════════════════════════════════════════════════════════
//  CONFIG & LOGGER
// ═════════════════════════════════════════════════════════════

const logger = {
  info: (msg, extra) => console.log(`[INFO] ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`, extra || ''),
  warn: (msg, extra) => console.warn(`[WARN] ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`, extra || ''),
  error: (msg, extra) => console.error(`[ERROR] ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`, extra || ''),
  debug: (msg, extra) => process.env.DEBUG && console.log(`[DEBUG] ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`, extra || ''),
};

// ═════════════════════════════════════════════════════════════
//  EXPRESS SERVER (for Railway health checks)
// ═════════════════════════════════════════════════════════════

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("OK - Bot is running"));
app.get("/health", (req, res) => res.send("OK"));
app.listen(PORT, () => logger.info(`Express server running on port ${PORT}`));

// ═════════════════════════════════════════════════════════════
//  DATABASE (PostgreSQL via pg)
// ═════════════════════════════════════════════════════════════

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set!");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('railway.app') || process.env.DATABASE_URL.includes('render.com') 
    ? { rejectUnauthorized: false } 
    : false
});

// Initialize tables
async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY,
        username TEXT,
        first_name TEXT,
        last_name TEXT,
        balance NUMERIC(14,4) NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'active',
        is_admin BOOLEAN NOT NULL DEFAULT false,
        is_super_admin BOOLEAN NOT NULL DEFAULT false,
        admin_authed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        custom_markup_percent NUMERIC(6,2)
      );
      
      CREATE TABLE IF NOT EXISTS product_overrides (
        product_id INTEGER PRIMARY KEY,
        product_name TEXT,
        custom_name TEXT,
        custom_category_id INTEGER,
        custom_markup_percent NUMERIC(6,2),
        custom_price_usd NUMERIC(14,4),
        hidden BOOLEAN NOT NULL DEFAULT false,
        instructions TEXT,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS category_overrides (
        category_id INTEGER PRIMARY KEY,
        custom_name TEXT,
        hidden BOOLEAN NOT NULL DEFAULT false,
        custom_markup_percent NUMERIC(6,2),
        sort_order INTEGER,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL,
        product_id INTEGER NOT NULL,
        product_name TEXT NOT NULL,
        qty NUMERIC(14,4) NOT NULL,
        params JSONB NOT NULL DEFAULT '{}',
        price_usd NUMERIC(14,4) NOT NULL,
        oranos_order_id TEXT,
        oranos_uuid TEXT NOT NULL UNIQUE,
        status TEXT NOT NULL DEFAULT 'pending',
        api_response JSONB,
        delivered_code TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS deposit_methods (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        identifier TEXT NOT NULL,
        instructions TEXT NOT NULL,
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS deposit_requests (
        id SERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL,
        method_id INTEGER NOT NULL,
        method_name TEXT NOT NULL,
        payer_number TEXT,
        screenshot_file_id TEXT NOT NULL,
        amount NUMERIC(14,4),
        status TEXT NOT NULL DEFAULT 'pending',
        processed_by BIGINT,
        processed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS bot_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS broadcasts (
        id SERIAL PRIMARY KEY,
        message TEXT NOT NULL,
        sent_by BIGINT NOT NULL,
        sent_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS manual_orders (
        id SERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL,
        product_id INTEGER NOT NULL,
        product_name TEXT NOT NULL,
        price_usd NUMERIC(14,4) NOT NULL,
        note TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        admin_note TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS manual_products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category_id INTEGER NOT NULL DEFAULT 0,
        category_is_virtual BOOLEAN NOT NULL DEFAULT false,
        price_usd NUMERIC(14,4) NOT NULL DEFAULT 0,
        api_product_id INTEGER,
        instructions TEXT,
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS virtual_categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        parent_id INTEGER NOT NULL DEFAULT 0,
        position INTEGER NOT NULL DEFAULT 0,
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS contact_links (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        link TEXT NOT NULL,
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    logger.info("Database tables initialized");
  } finally {
    client.release();
  }
}

// ═════════════════════════════════════════════════════════════
//  SETTINGS
// ═════════════════════════════════════════════════════════════

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
  ai_keywords: "ذكاء اصطناعي,chatgpt,gpt,openai,claude,gemini,midjourney,perplexity,ai",
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

const settingsCache = new Map();
let settingsLoaded = false;

async function loadSettings() {
  const res = await pool.query('SELECT key, value FROM bot_settings');
  settingsCache.clear();
  for (const row of res.rows) settingsCache.set(row.key, row.value);
  settingsLoaded = true;
}

async function ensureDefaults() {
  if (!settingsLoaded) await loadSettings();
  for (const [k, v] of Object.entries(DEFAULTS)) {
    if (!settingsCache.has(k)) {
      await pool.query('INSERT INTO bot_settings(key, value) VALUES($1,$2) ON CONFLICT(key) DO NOTHING', [k, v]);
      settingsCache.set(k, v);
    }
  }
}

async function getSetting(key) {
  if (!settingsLoaded) await loadSettings();
  return settingsCache.get(key) ?? DEFAULTS[key] ?? "";
}

async function setSetting(key, value) {
  await pool.query(`
    INSERT INTO bot_settings(key, value, updated_at) VALUES($1,$2,NOW())
    ON CONFLICT(key) DO UPDATE SET value=$2, updated_at=NOW()
  `, [key, value]);
  settingsCache.set(key, value);
}

async function deleteSetting(key) {
  await pool.query('DELETE FROM bot_settings WHERE key=$1', [key]);
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

async function getAiKeywords() {
  const v = await getSetting("ai_keywords");
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

async function getAdminPassword() {
  return await getSetting("admin_password");
}

async function getBtnBackLabel() { return (await getSetting("btn_back_label")) || "⬅️ رجوع"; }
async function getBtnHomeLabel() { return (await getSetting("btn_home_label")) || "🏠 الرئيسية"; }
async function getBtnPrevLabel() { return (await getSetting("btn_prev_label")) || "⬅️ السابق"; }
async function getBtnNextLabel() { return (await getSetting("btn_next_label")) || "التالي ➡️"; }

function isSocialProduct(name, categoryName, keywords) {
  const hay = `${name ?? ""} ${categoryName ?? ""}`.toLowerCase();
  return keywords.some(k => k && hay.includes(k));
}

function isAiProduct(name, categoryName, keywords) {
  const hay = `${name ?? ""} ${categoryName ?? ""}`.toLowerCase();
  return keywords.some(k => k && hay.includes(k));
}

// ═════════════════════════════════════════════════════════════
//  USERS
// ═════════════════════════════════════════════════════════════

const userCache = new Map();
const USER_CACHE_TTL = 30000;

function cacheGet(id) {
  const hit = userCache.get(id);
  if (hit && hit.exp > Date.now()) return hit.u;
  return undefined;
}

function cacheSet(id, u) {
  userCache.set(id, { u, exp: Date.now() + USER_CACHE_TTL });
}

function invalidateUserCache(id) {
  userCache.delete(id);
}

async function upsertUser(u) {
  const existing = await pool.query('SELECT * FROM users WHERE id=$1 LIMIT 1', [u.id]);
  let result;
  if (existing.rows.length === 0) {
    const inserted = await pool.query(
      'INSERT INTO users(id, username, first_name, last_name) VALUES($1,$2,$3,$4) RETURNING *',
      [u.id, u.username ?? null, u.first_name ?? null, u.last_name ?? null]
    );
    result = inserted.rows[0];
  } else {
    const updated = await pool.query(
      'UPDATE users SET username=$1, first_name=$2, last_name=$3 WHERE id=$4 RETURNING *',
      [u.username ?? existing.rows[0].username, u.first_name ?? existing.rows[0].first_name, u.last_name ?? existing.rows[0].last_name, u.id]
    );
    result = updated.rows[0];
  }
  cacheSet(u.id, result);
  return result;
}

async function getUser(id) {
  const cached = cacheGet(id);
  if (cached !== undefined) return cached;
  const res = await pool.query('SELECT * FROM users WHERE id=$1 LIMIT 1', [id]);
  const u = res.rows[0] ?? null;
  cacheSet(id, u);
  return u;
}

async function adjustBalance(id, deltaUsd) {
  invalidateUserCache(id);
  const updated = await pool.query('UPDATE users SET balance = balance + $1 WHERE id=$2 RETURNING *', [deltaUsd, id]);
  const u = updated.rows[0] ?? null;
  if (u) cacheSet(id, u);
  return u;
}

async function setBalance(id, balanceUsd) {
  invalidateUserCache(id);
  const updated = await pool.query('UPDATE users SET balance = $1 WHERE id=$2 RETURNING *', [String(balanceUsd), id]);
  const u = updated.rows[0] ?? null;
  if (u) cacheSet(id, u);
  return u;
}

async function setStatus(id, status) {
  invalidateUserCache(id);
  await pool.query('UPDATE users SET status = $1 WHERE id=$2', [status, id]);
}

async function setAdmin(id, isAdmin, isSuperAdmin) {
  invalidateUserCache(id);
  const fields = { is_admin: isAdmin };
  if (isSuperAdmin !== undefined) fields.is_super_admin = isSuperAdmin;
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  await pool.query(`UPDATE users SET ${keys.map((k,i) => `${k}=$${i+1}`).join(',')} WHERE id=$${keys.length+1}`, [...values, id]);
}

async function markAdminAuthed(id) {
  invalidateUserCache(id);
  await pool.query('UPDATE users SET admin_authed_at = NOW() WHERE id=$1', [id]);
}

async function listUsers(offset = 0, limit = 20) {
  const res = await pool.query('SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
  return res.rows;
}

async function countUsers() {
  const res = await pool.query('SELECT COUNT(*)::int as c FROM users');
  return res.rows[0]?.c ?? 0;
}

async function searchUser(query) {
  const idNum = Number(query.replace(/[^0-9]/g, ""));
  const u = query.replace(/^@/, "");
  let sql = 'SELECT * FROM users WHERE ';
  const params = [];
  let conds = [];
  if (Number.isFinite(idNum) && idNum > 0) {
    conds.push(`id=$${params.length+1}`);
    params.push(idNum);
  }
  conds.push(`username ILIKE $${params.length+1}`);
  params.push(`%${u}%`);
  conds.push(`first_name ILIKE $${params.length+1}`);
  params.push(`%${u}%`);
  sql += conds.join(' OR ') + ' LIMIT 20';
  const res = await pool.query(sql, params);
  return res.rows;
}

async function listAdmins() {
  const res = await pool.query('SELECT * FROM users WHERE is_admin = true');
  return res.rows;
}

async function setUserMarkup(id, markupPercent) {
  invalidateUserCache(id);
  await pool.query('UPDATE users SET custom_markup_percent = $1 WHERE id=$2', [markupPercent === null ? null : String(markupPercent), id]);
}

async function getSuperAdmin() {
  const res = await pool.query('SELECT * FROM users WHERE is_super_admin = true LIMIT 1');
  return res.rows[0] ?? null;
}

// ═════════════════════════════════════════════════════════════
//  ORANOS API
// ═════════════════════════════════════════════════════════════

const baseURL = process.env["ORANOS_API_BASE"] ?? "https://api.oranosmarket.com";
const apiToken = process.env["ORANOS_API_TOKEN"] ?? "";

const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: { "api-token": apiToken, Accept: "application/json" },
});

let _maintenanceMode = false;
function isMaintenanceMode() { return _maintenanceMode; }

function wrapRequest(fn) {
  return fn().then(v => { _maintenanceMode = false; return v; }).catch(err => {
    const status = err.response?.status;
    if (status === 503 || status === 502 || status === 529) _maintenanceMode = true;
    throw err;
  });
}

async function fetchProfile() {
  const res = await wrapRequest(() => apiClient.get("/client/api/profile"));
  return res.data;
}

async function fetchContent(parentId) {
  const res = await wrapRequest(() => apiClient.get(`/client/api/content/${parentId}`));
  const data = res.data ?? {};
  return {
    products: Array.isArray(data.products) ? data.products : [],
    categories: Array.isArray(data.categories) ? data.categories : [],
  };
}

async function fetchAllProducts() {
  const res = await wrapRequest(() => apiClient.get("/client/api/products"));
  return Array.isArray(res.data) ? res.data : [];
}

async function placeOrder(productId, params, orderUuid) {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) search.set(k, String(v));
  search.set("order_uuid", orderUuid);
  try {
    const res = await wrapRequest(() => apiClient.get(`/client/api/newOrder/${productId}/params?${search.toString()}`));
    return res.data;
  } catch (err) {
    if (err.response?.data) return err.response.data;
    logger.error({ err }, "placeOrder failed");
    return { status: "ERR", message: "Network error" };
  }
}

async function checkOrder(orderId, byUuid = false) {
  const search = new URLSearchParams();
  search.set("orders", `[${orderId}]`);
  if (byUuid) search.set("uuid", "1");
  const res = await wrapRequest(() => apiClient.get(`/client/api/check?${search.toString()}`));
  return res.data;
}

function extractDeliveredCode(resp) {
  const d = resp?.data;
  if (!d) return null;
  const candidates = [];
  if (d.data) candidates.push(d.data);
  if (d.replay_api) candidates.push(d.replay_api);
  const lines = [];
  const visit = (v) => {
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

// ═════════════════════════════════════════════════════════════
//  FORMAT & OVERRIDES
// ═════════════════════════════════════════════════════════════

async function loadOverrideMap(productIds) {
  const map = new Map();
  if (productIds.length === 0) return map;
  const res = await pool.query('SELECT * FROM product_overrides WHERE product_id = ANY($1)', [productIds]);
  for (const r of res.rows) {
    map.set(r.product_id, {
      customPriceUsd: r.custom_price_usd != null ? Number(r.custom_price_usd) : null,
      customMarkupPercent: r.custom_markup_percent != null ? Number(r.custom_markup_percent) : null,
      customName: r.custom_name,
      customCategoryId: r.custom_category_id,
      hidden: r.hidden,
      instructions: r.instructions,
    });
  }
  return map;
}

async function loadAllOverrides() {
  const res = await pool.query('SELECT * FROM product_overrides');
  const map = new Map();
  for (const r of res.rows) {
    map.set(r.product_id, {
      customPriceUsd: r.custom_price_usd != null ? Number(r.custom_price_usd) : null,
      customMarkupPercent: r.custom_markup_percent != null ? Number(r.custom_markup_percent) : null,
      customName: r.custom_name,
      customCategoryId: r.custom_category_id,
      hidden: r.hidden,
      instructions: r.instructions,
    });
  }
  return map;
}

async function priceWithOverride(id, basePrice, defaultMarkup, override) {
  if (override?.customPriceUsd != null) return override.customPriceUsd;
  const m = override?.customMarkupPercent ?? defaultMarkup;
  return Number((basePrice * (1 + m / 100)).toFixed(4));
}

function formatBalance(usd, rate) {
  return `${usd.toFixed(2)}$ | ${Math.round(usd * rate).toLocaleString("en-US")} ل.س`;
}

function formatPriceLine(usd, rate) {
  return `${usd.toFixed(2)}$ | ${Math.round(usd * rate).toLocaleString("en-US")} ل.س`;
}

// ═════════════════════════════════════════════════════════════
//  STATE MANAGEMENT
// ═════════════════════════════════════════════════════════════

const sessions = new Map();

function getStep(userId) {
  return sessions.get(userId) ?? { kind: "idle" };
}

function setStep(userId, step) {
  if (step.kind === "idle") sessions.delete(userId);
  else sessions.set(userId, step);
}

function clearStep(userId) {
  sessions.delete(userId);
}

// ═════════════════════════════════════════════════════════════
//  KEYBOARDS
// ═════════════════════════════════════════════════════════════

function mainMenu(isAdmin) {
  const rows = [
    [Markup.button.callback("🛒 المنتجات", "cat:0:1:0"), Markup.button.callback("💰 رصيدي", "balance")],
    [Markup.button.callback("💳 إيداع", "deposit"), Markup.button.callback("📦 طلباتي", "myorders:1")],
    [Markup.button.callback("📞 الدعم", "support"), Markup.button.callback("🔄 /start", "home")],
  ];
  if (isAdmin) {
    rows.push([Markup.button.callback("👑 لوحة الإدارة", "admin:menu")]);
  } else {
    rows.push([Markup.button.callback("🔐 تسجيل دخول الإدارة", "admin:loginPrompt")]);
  }
  return Markup.inlineKeyboard(rows);
}

// ═════════════════════════════════════════════════════════════
//  TG HELPERS
// ═════════════════════════════════════════════════════════════

async function sendOrEdit(ctx, text, extra) {
  const cb = ctx.callbackQuery;
  const msg = cb?.message;
  if (msg && !msg.photo) {
    try {
      await ctx.editMessageText(text, extra);
      return;
    } catch (err) {
      const desc = err.description ?? "";
      if (/not modified/i.test(desc)) return;
      logger.debug({ desc }, "edit failed, falling back to reply");
    }
  }
  await ctx.reply(text, extra);
}

async function clearInlineKeyboard(ctx) {
  try {
    await ctx.editMessageReplyMarkup(undefined);
  } catch {
    /* ignore */
  }
}

// ═════════════════════════════════════════════════════════════
//  AI SUPPORT
// ═════════════════════════════════════════════════════════════

const convHistory = new Map();

const SYSTEM_PROMPT = `أنت مساعد ذكاء اصطناعي متخصص في إدارة متجر "متجر المروان" على تيليجرام.
البوت يبيع منتجات رقمية عبر منصة oranosmarket.com.

المزايا الرئيسية للبوت:
- بيع منتجات رقمية (ألعاب، سوشل ميديا، ذكاء اصطناعي، اشتراكات، وغيرها)
- نظام رصيد بالدولار مع عرض تلقائي بالليرة السورية
- لوحة إدارة شاملة: طلبات، مستخدمون، إيداعات، إعدادات
- نسبة ربح عامة + نسبة ربح للسوشل ميديا قابلتان للتعديل
- طلبات إيداع تتم بالموافقة اليدوية من الأدمن
- إشعارات تلقائية عند قبول أو رفض الطلب
- رد رصيد تلقائي عند رفض الطلب بمبالغ بالدولار والليرة
- بث رسائل جماعية لجميع المستخدمين
- أقسام مخصصة وأسعار مخصصة لكل منتج
- منتجات يدوية يضيفها الأدمن
- بينج تلقائي كل X دقائق للتأكد أن البوت شغال
- مساعد ذكي (هذا الحوار) للإجابة على أسئلة الإدارة

الإعدادات الرئيسية في لوحة الإدارة:
- سعر الصرف: كم ليرة سورية = 1 دولار (الإعدادات ← تعديل سعر الصرف)
- نسبة الربح العام: تُضاف على سعر API لجميع المنتجات (الإعدادات ← تعديل الربح العام)
- نسبة ربح السوشل ميديا: للمنتجات ذات الطابع الاجتماعي (الإعدادات ← تعديل ربح السوشل)
- كلمة مرور الإدارة: للوصول للوحة (الإعدادات ← تغيير كلمة المرور)
- حالة البوت: تشغيل/إيقاف (وضع الصيانة) من الزر في لوحة الإدارة
- البينج التلقائي: لوحة الإدارة ← 🔄 بينج تلقائي

كيف يعمل البوت بشكل عام:
1. المستخدم يضغط /start ويتصفح المنتجات
2. يختار المنتج ويدخل الكميات والمعاملات المطلوبة
3. يؤكد الطلب → يُخصم الرصيد تلقائياً
4. البوت يرسل الطلب لـ oranosmarket.com
5. الطلب قد ينفذ فوراً أو يبقى معلقاً
6. إذا تأخر: يتحقق البوت كل 90 ثانية ويُشعر المستخدم عند الحل
7. رفض الطلب: يُعاد الرصيد + إشعار بالمبلغ بالعملتين

أجب دائماً بالعربية. كن دقيقاً وعملياً. إذا لم تعرف الإجابة، قل ذلك بصراحة.`;

async function callAiSupport(userId, userMessage) {
  const apiKey = process.env["OPENAI_API_KEY"];
  if (!apiKey) return buildSmartFaq(userMessage);

  const hist = convHistory.get(userId) ?? [];
  hist.push({ role: "user", content: userMessage });
  if (hist.length > 20) hist.splice(0, hist.length - 20);
  convHistory.set(userId, hist);

  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "gpt-4o-mini", max_completion_tokens: 1024, messages: [{ role: "system", content: SYSTEM_PROMPT }, ...hist] }),
    });
    if (!resp.ok) {
      hist.pop();
      convHistory.set(userId, hist);
      return buildSmartFaq(userMessage);
    }
    const data = await resp.json();
    const reply = data.choices?.[0]?.message?.content?.trim() ?? buildSmartFaq(userMessage);
    hist.push({ role: "assistant", content: reply });
    convHistory.set(userId, hist);
    return reply;
  } catch (err) {
    hist.pop();
    convHistory.set(userId, hist);
    return buildSmartFaq(userMessage);
  }
}

function clearAiHistory(userId) {
  convHistory.delete(userId);
}

function hasAiKey() {
  return !!process.env["OPENAI_API_KEY"];
}

function buildSmartFaq(msg) {
  const q = msg.toLowerCase().trim();

  if ((q.includes("سعر") && q.includes("صرف")) || q.includes("ليرة") || q.includes("ل.س")) {
    return `💱 *تعديل سعر الصرف:*\n1. لوحة الإدارة\n2. ⚙️ الإعدادات\n3. 💱 تعديل سعر الصرف\n4. أرسل القيمة الجديدة\n\n_مثال: إذا أرسلت 500، فكل دولار = 500 ل.س_\n\nملاحظة: سعر الصرف يؤثر على عرض الأسعار فقط، لا يغير الأرصدة المخزنة.`;
  }
  if (q.includes("ربح") || q.includes("markup") || q.includes("هامش")) {
    return `📈 *تعديل نسبة الربح:*\n\n*الربح العام* (لكل المنتجات):\nالإعدادات ← ✏️ تعديل الربح العام\n\n*ربح السوشل ميديا* (منتجات التواصل):\nالإعدادات ← ✏️ تعديل ربح السوشل\n\nأرسل رقماً فقط (مثال: 10 يعني 10%)`;
  }
  if (q.includes("رصيد") && (q.includes("أضف") || q.includes("إضافة") || q.includes("خصم") || q.includes("تعديل"))) {
    return `💰 *تعديل رصيد مستخدم:*\n1. لوحة الإدارة ← 🔍 بحث مستخدم\n2. أدخل معرف المستخدم أو اسمه\n3. اضغط ➕ إضافة رصيد أو ➖ خصم رصيد\n4. أدخل المبلغ بالدولار\n\nأو من: 👥 المستخدمون ← اختر المستخدم`;
  }
  if (q.includes("إيداع") || q.includes("شحن") || q.includes("قبول") || q.includes("رفض")) {
    return `💳 *إدارة الإيداعات:*\n\n• طلبات جديدة: لوحة الإدارة ← 📥 طلبات الإيداع\n• لقبول طلب: اضغط ✅ قبول وأدخل المبلغ\n• لرفض طلب: اضغط ❌ رفض\n\n*إضافة طريقة إيداع:*\nلوحة الإدارة ← 💳 طرق الإيداع ← ➕ إضافة طريقة`;
  }
  if ((q.includes("كلمة") && q.includes("مرور")) || q.includes("باسورد") || q.includes("password")) {
    return `🔑 *تغيير كلمة المرور:*\n1. لوحة الإدارة\n2. ⚙️ الإعدادات\n3. 🔑 تغيير كلمة المرور\n4. أرسل كلمة المرور الجديدة`;
  }
  if (q.includes("منتج") || q.includes("سعر منتج") || q.includes("تعديل منتج")) {
    return `🛒 *تعديل سعر منتج:*\n1. لوحة الإدارة ← 🛒 إدارة المنتجات\n2. اختر القسم ثم المنتج\n3. اضغط 💲 تعديل السعر\n4. أرسل السعر بالدولار أو النسبة%\n\n*إضافة منتج يدوي:*\nلوحة الإدارة ← ➕ إضافة منتج يدوي`;
  }
  if (q.includes("بث") || q.includes("رسالة جماعية") || q.includes("broadcast")) {
    return `📣 *إرسال رسالة جماعية:*\n1. لوحة الإدارة\n2. 📣 رسالة جماعية\n3. اكتب الرسالة وأرسلها\n\nستُرسل لجميع المستخدمين النشطين تلقائياً.`;
  }
  if (q.includes("صيانة") || q.includes("إيقاف البوت") || q.includes("تشغيل البوت")) {
    return `🔧 *وضع الصيانة:*\nمن لوحة الإدارة، اضغط زر الحالة:\n• 🟢 البوت: شغال ← اضغطه لإيقاف البوت\n• 🔴 البوت: متوقف ← اضغطه لتشغيل البوت\n\nعند الإيقاف: تظهر رسالة صيانة للمستخدمين ولا يمكنهم الشراء.`;
  }
  if (q.includes("سوشل") || q.includes("سوشال") || q.includes("social") || q.includes("انستغرام") || q.includes("يوتيوب")) {
    return `📱 *إعدادات السوشل ميديا:*\n\n• نسبة الربح: الإعدادات ← تعديل ربح السوشل\n• الحد الأدنى/الأقصى للكمية: محدد تلقائياً من المنتج نفسه، وإلا من الإعدادات العامة\n• الكلمات المفتاحية: تحدد أي المنتجات تُعامَل كسوشل ميديا\n\nالمنتجات التي لها qty_values خاصة تستخدمها بدلاً من الإعدادات العامة.`;
  }
  if (q.includes("طلب") || q.includes("أوردر") || q.includes("order")) {
    return `📦 *إدارة الطلبات:*\n\n• كل الطلبات: لوحة الإدارة ← 📦 كل الطلبات\n• طلبات مستخدم: 👥 المستخدمون ← اختر المستخدم ← 📋 طلباته\n\n*الإشعارات التلقائية:*\n• عند القبول: يُرسل للمستخدم كود + رد الموقع\n• عند الرفض: يُعاد الرصيد + إشعار بالمبلغ بالعملتين\n• يتحقق البوت من الطلبات المعلقة كل 90 ثانية`;
  }
  if (q.includes("بينج") || q.includes("keep alive") || q.includes("ping") || q.includes("شغال")) {
    return `🔄 *البينج التلقائي:*\nمن لوحة الإدارة ← 🔄 بينج تلقائي\n\n• يرسل رسالة /start للأدمن كل X دقائق\n• يمكن تفعيله وإيقافه وتحديد الفترة\n• يستخدم لضمان أن البوت يعمل بشكل مستمر`;
  }
  if (q.includes("قسم") || q.includes("category") || q.includes("فئة")) {
    return `📁 *الأقسام المخصصة:*\nلوحة الإدارة ← 📁 أقسام مخصصة\n\n• إضافة قسم: ➕ داخل القسم الأصلي\n• نقل منتج لقسم: افتح المنتج ← 🚚 نقل ← أرسل رقم القسم\n• تغيير اسم قسم: افتح القسم ← ✏️ تعديل الاسم`;
  }
  if (q.includes("مستخدم") || q.includes("user") || q.includes("عميل")) {
    return `👥 *إدارة المستخدمين:*\n\n• عرض الكل: لوحة الإدارة ← 👥 المستخدمون\n• بحث بالاسم/المعرف: 🔍 بحث مستخدم\n• من بطاقة المستخدم يمكنك:\n  - ➕/➖ تعديل الرصيد\n  - 🚫 حظر/رفع الحظر\n  - 📋 عرض طلباته`;
  }

  return `🤖 *مساعد متجر المروان*\n\nيمكنني مساعدتك في:\n\n` +
    `• 💱 سعر الصرف ونسب الربح\n` +
    `• 💰 إدارة أرصدة المستخدمين\n` +
    `• 📥 طلبات الإيداع وطرقها\n` +
    `• 🛒 أسعار المنتجات وإدارتها\n` +
    `• 📣 الرسائل الجماعية\n` +
    `• 🔧 وضع الصيانة\n` +
    `• 📦 متابعة الطلبات\n` +
    `• 🔄 البينج التلقائي\n\n` +
    `اكتب سؤالك بالتفصيل وسأجيبك فوراً. 💡\n\n` +
    (process.env["OPENAI_API_KEY"]
      ? `✅ المساعد الذكي مفعّل (GPT-4o mini)`
      : `⚠️ *لتفعيل الذكاء الاصطناعي الكامل:*\nأضف OPENAI_API_KEY في Secrets`);
}

// ═════════════════════════════════════════════════════════════
//  CATEGORIES & PRODUCTS (with caching)
// ═════════════════════════════════════════════════════════════

const PAGE_SIZE = 8;
let productsCache = null;
const PRODUCTS_TTL = 15 * 60 * 1000;
const contentCache = new Map();
const CONTENT_TTL = 15 * 60 * 1000;
let allOverridesCache = null;
const OVERRIDES_TTL = 5 * 60 * 1000;

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
  } catch { }
}

let refresherStarted = false;
function startBackgroundRefresher() {
  if (refresherStarted) return;
  refresherStarted = true;
  setInterval(() => {
    fetchAllProducts().then(p => { productsCache = { products: p, expiry: Date.now() + PRODUCTS_TTL }; }).catch(() => {});
    loadAllOverrides().then(m => { allOverridesCache = { map: m, expiry: Date.now() + OVERRIDES_TTL }; }).catch(() => {});
    fetchContent(0).then(c => { contentCache.set(0, { content: c, expiry: Date.now() + CONTENT_TTL }); }).catch(() => {});
  }, 4 * 60 * 1000).unref();
}

function isExcludedProduct(p, kws) {
  const n = (p.name ?? "").toLowerCase();
  return kws.some(k => k && n.includes(k));
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

// ═════════════════════════════════════════════════════════════
//  START HANDLER
// ═════════════════════════════════════════════════════════════

const ADMIN_USERNAME = process.env["ADMIN_USERNAME"] ?? "aMohammedMari";

async function ensureUser(ctx) {
  const f = ctx.from;
  if (!f) return null;
  return upsertUser({
    id: f.id,
    username: f.username ?? undefined,
    first_name: f.first_name ?? undefined,
    last_name: f.last_name ?? undefined,
  });
}

async function showMainMenu(ctx) {
  const user = await ensureUser(ctx);
  if (!user) return;
  setStep(user.id, { kind: "idle" });
  const status = await getBotStatus();
  if (status === "off" && !user.is_admin) {
    await sendOrEdit(ctx, "🚫 البوت متوقف مؤقتاً للصيانة.");
    return;
  }
  if (user.status === "banned") {
    await sendOrEdit(ctx, "🚫 تم حظرك من استخدام البوت.");
    return;
  }
  const rate = await getExchangeRate();
  const greeting =
    `أهلاً فيك في متجر المروان 🌟\n` +
    `الاسم: ${user.first_name ?? "—"}${user.username ? ` (@${user.username})` : ""}\n` +
    `الرقم التعريفي: ${user.id}\n` +
    `الرصيد: ${formatBalance(Number(user.balance), rate)}\n\n` +
    `اختر من القائمة بالأسفل 👇`;
  await sendOrEdit(ctx, greeting, mainMenu(user.is_admin));
}

async function showContactLinks(ctx) {
  const res = await pool.query('SELECT * FROM contact_links WHERE active = true');
  const links = res.rows;
  if (links.length === 0) {
    await ctx.reply(`📞 للدعم التواصل مع: @${ADMIN_USERNAME}`,
      Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
    return;
  }
  const rows = links.map(l => [Markup.button.url(l.name, l.link.startsWith("http") ? l.link : `https://t.me/${l.link.replace(/^@/, "")}`)]);
  rows.push([Markup.button.callback("🏠 الرئيسية", "home")]);
  await ctx.reply("📞 وسائل التواصل:", Markup.inlineKeyboard(rows));
}

// ═════════════════════════════════════════════════════════════
//  WALLET / DEPOSIT HANDLERS
// ═════════════════════════════════════════════════════════════

async function ensureDefaultDepositMethods() {
  const ex = await pool.query('SELECT * FROM deposit_methods');
  if (ex.rows.length > 0) return;
  await pool.query(`
    INSERT INTO deposit_methods(name, identifier, instructions, active) VALUES
    ($1,$2,$3,true), ($4,$5,$6,true)
  `, [
    "شام كاش", "02d7079d7229d8860c7d89467bfdc938",
    "حول المبلغ إلى رقم/معرف شام كاش أعلاه ثم أرسل لنا:\n1) المبلغ والرقم الذي حولت منه\n2) صورة إشعار التحويل",
    "سيريتل كاش", "32820534",
    "حول المبلغ إلى رقم سيريتل كاش أعلاه ثم أرسل لنا:\n1) المبلغ والرقم الذي حولت منه\n2) صورة إشعار التحويل"
  ]);
}

async function showDepositMenu(ctx) {
  await ensureDefaultDepositMethods();
  const res = await pool.query('SELECT * FROM deposit_methods WHERE active = true');
  const methods = res.rows;
  if (methods.length === 0) {
    await ctx.reply("لا توجد طرق إيداع متاحة.");
    return;
  }
  const rows = methods.map(m => [Markup.button.callback(`💳 ${m.name}`, `dep:pick:${m.id}`)]);
  rows.push([Markup.button.callback("🏠 الرئيسية", "home")]);
  await ctx.reply("اختر طريقة الإيداع:", Markup.inlineKeyboard(rows));
}

async function showMethodDetails(ctx, methodId) {
  const res = await pool.query('SELECT * FROM deposit_methods WHERE id=$1 LIMIT 1', [methodId]);
  const m = res.rows[0];
  if (!m) { await ctx.reply("⚠️ غير موجود."); return; }
  setStep(ctx.from.id, { kind: "deposit:number", methodId: m.id, methodName: m.name });
  await ctx.reply(
    `💳 ${m.name}\nالرقم/المعرف: \\`${m.identifier}\\`\n\n${m.instructions}\n\nأرسل: المبلغ والرقم الذي حولت منه`,
    { parse_mode: "Markdown", ...Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "dep:cancel")]]) },
  );
}

async function notifyAdmins(ctx, depositId) {
  const res = await pool.query('SELECT * FROM deposit_requests WHERE id=$1 LIMIT 1', [depositId]);
  const r = res.rows[0];
  if (!r) return;
  const admins = await listAdmins();
  const text =
    `🔔 طلب إيداع جديد #${r.id}\nالمستخدم: ${ctx.from?.id} ${ctx.from?.username ? "@" + ctx.from.username : ""}\n` +
    `الطريقة: ${r.method_name}\nرقم/تفاصيل المُحوِّل: ${r.payer_number ?? "—"}`;
  const kb = Markup.inlineKeyboard([
    [Markup.button.callback("✅ موافقة", `adm:dep:approve:${r.id}`), Markup.button.callback("❌ رفض", `adm:dep:reject:${r.id}`)],
  ]);
  for (const a of admins) {
    try {
      await ctx.telegram.sendPhoto(a.id, r.screenshot_file_id, { caption: text, ...kb });
    } catch { }
  }
}

// ═════════════════════════════════════════════════════════════
//  ORDERS HANDLERS
// ═════════════════════════════════════════════════════════════

const REJECT_STATUSES = new Set(["reject", "rejected", "error", "refused", "cancel", "cancelled", "canceled", "fail", "failed"]);
const ACCEPT_STATUSES = new Set(["accept", "accepted", "success", "done", "complete", "completed", "delivered"]);
const TERMINAL_STATUSES = [...REJECT_STATUSES, ...ACCEPT_STATUSES];

function statusLabel(s) {
  const n = (s ?? "").toString().toLowerCase().trim();
  if (ACCEPT_STATUSES.has(n) || n === "1" || n === "true") return "✅ مقبول";
  if (REJECT_STATUSES.has(n) || n === "0" || n === "false") return "❌ مرفوض";
  return "⏳ انتظار";
}

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
    const label = statusLabel(orderData.status);
    if (!parts.some(p => p.includes(orderData.status) || p.includes(label))) parts.push(`📊 الحالة: ${label}`);
  }
  return [...new Set(parts)].filter(Boolean).join("\n\n").trim();
}

function parseQtyValues(qv) {
  if (!qv) return { kind: "fixed" };
  if (Array.isArray(qv)) return { kind: "list", values: qv.map(v => Number(v)).filter(Number.isFinite) };
  return { kind: "range", min: Number(qv.min), max: Number(qv.max) };
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
  const userMarkup = user?.custom_markup_percent != null ? Number(user.custom_markup_percent) : null;
  
  // Load category markup
  let catMarkup = null;
  const catId = ov?.customCategoryId ?? p.parent_id;
  if (catId) {
    const catRes = await pool.query('SELECT custom_markup_percent FROM category_overrides WHERE category_id=$1', [catId]);
    if (catRes.rows[0]?.custom_markup_percent != null) catMarkup = Number(catRes.rows[0].custom_markup_percent);
  }
  
  const unitPriceUsd = await effectivePriceUsd(p, ov, markup, socialMarkup, socialKws, catMarkup, userMarkup);
  if (unitPriceUsd === 0) {
    await ctx.reply("⚠️ هذا المنتج لا يملك سعراً محدداً في النظام. يرجى التواصل مع الإدارة لضبط سعره.");
    return;
  }

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
    } else {
      min = await getSocialMinQty(); max = await getSocialMaxQty();
    }
    setStep(ctx.from.id, { kind: "order:qty", productId: p.id, productName: p.name, priceUsd: unitPriceUsd, paramKeys, qtyValues: { min, max }, backTo });
    const priceHint = unitPriceUsd > 0 ? `\n💰 السعر للوحدة: ${unitPriceUsd < 0.005 ? unitPriceUsd.toFixed(6) : unitPriceUsd.toFixed(4)}$` : "";
    await sendOrEdit(ctx, `🛒 ${p.name}${priceHint}\n\nأرسل الكمية المطلوبة (بين ${min.toLocaleString("en-US")} و ${max.toLocaleString("en-US")}):`, Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "ord:cancel")]]));
    return;
  }

  const parsed = parseQtyValues(p.qty_values);
  if (parsed.kind === "fixed") {
    return askNextParam(ctx, p, unitPriceUsd, 1, paramKeys, {}, 0, backTo);
  }
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
  if (idx >= paramKeys.length) return showOrderConfirmation(ctx, p, unitPriceUsd, qty, collected, backTo);
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
  const text = `🧾 تأكيد الطلب\n\n🛒 المنتج: ${p.name}\n🔢 الكمية: ${qty.toLocaleString("en-US")}\n${paramsLines ? paramsLines + "\n" : ""}💰 الإجمالي: ${totalUsdStr}$ | ${totalSyp.toLocaleString("en-US")} ل.س\n💳 رصيدك: ${formatBalance(balance, rate)}\n\n${lowBalance ? "❌ ليس لديك رصيد كافي. يرجى شحن رصيدك ثم المحاولة مجدداً." : "هل تريد تأكيد الطلب؟"}`;
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
    await ctx.reply("❌ ليس لديك رصيد كافي، اشحن رصيد ثم حاول مجدداً.", Markup.inlineKeyboard([[Markup.button.callback("💳 شحن رصيد", "deposit")], [Markup.button.callback("🏠 الرئيسية", "home")]]));
    setStep(ctx.from.id, { kind: "idle" });
    return;
  }

  await clearInlineKeyboard(ctx);
  const orderUuid = crypto.randomUUID();
  await adjustBalance(ctx.from.id, -totalUsd);
  const execRate = await getExchangeRate();
  const totalSyp = Math.round(totalUsd * execRate);

  const params = { ...step.collected };
  if (step.qty && step.qty !== 1) params.qty = step.qty;

  const inserted = await pool.query(
    'INSERT INTO orders(user_id, product_id, product_name, qty, params, price_usd, oranos_uuid, status) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
    [ctx.from.id, p.id, p.name, String(step.qty), JSON.stringify(step.collected), String(totalUsd), orderUuid, "pending"]
  );
  const order = inserted.rows[0];

  await ctx.reply(`⏳ جاري تنفيذ طلبك #${order.id}...\n💸 تم خصم ${totalUsd.toFixed(2)}$ | ${totalSyp.toLocaleString("en-US")} ل.س من رصيدك.`);

  let resp;
  try { resp = await placeOrder(p.id, params, orderUuid); }
  catch (err) { logger.error({ err }, "placeOrder threw"); resp = { status: "ERR", message: "خطأ شبكة" }; }

  const apiStatus = (resp.status ?? "").toLowerCase();
  const success = apiStatus === "success" || apiStatus === "ok" || apiStatus === "accept";

  if (!success) {
    await adjustBalance(ctx.from.id, totalUsd);
    await pool.query('UPDATE orders SET status=$1, api_response=$2 WHERE id=$3', ["error", JSON.stringify(resp), order.id]);
    setStep(ctx.from.id, { kind: "idle" });
    const fullErrText = formatFullApiResponse(resp);
    await ctx.reply(`❌ تعذّر تنفيذ الطلب #${order.id}.\nالسبب: ${resp.message ?? "خطأ غير معروف"}\n✅ تمت إعادة ${totalUsd.toFixed(2)}$ | ${totalSyp.toLocaleString("en-US")} ل.س إلى رصيدك.${fullErrText ? `\n\n📋 الرد:\n${fullErrText}` : ""}`, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
    return;
  }

  const deliveredCode = extractDeliveredCode(resp);
  const oranosOrderId = resp.data?.order_id ?? null;
  const apiInnerStatus = (resp.data?.status ?? apiStatus).toString();

  await pool.query('UPDATE orders SET status=$1, oranos_order_id=$2, api_response=$3, delivered_code=$4 WHERE id=$5',
    [apiInnerStatus === "accept" ? "accept" : apiInnerStatus, oranosOrderId, JSON.stringify(resp), deliveredCode ?? null, order.id]);

  setStep(ctx.from.id, { kind: "idle" });
  const fullRespText = formatFullApiResponse(resp);
  const isWaiting = !ACCEPT_STATUSES.has(apiInnerStatus.toLowerCase()) && !REJECT_STATUSES.has(apiInnerStatus.toLowerCase());

  await ctx.reply(`✅ تم استلام طلبك #${order.id}\nالحالة: ${statusLabel(apiInnerStatus)}\n🛒 ${p.name} × ${step.qty}\n💰 ${totalUsd.toFixed(2)}$ | ${totalSyp.toLocaleString("en-US")} ل.س`);

  if (deliveredCode) {
    const deliveryLines = [`🔑 تفاصيل الطلب:\n\n${deliveredCode}`];
    if (fullRespText && !fullRespText.includes(deliveredCode)) deliveryLines.push(`\n📋 الرد:\n${fullRespText}`);
    await ctx.reply(deliveryLines.join(""), Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
  } else if (fullRespText) {
    await ctx.reply(`📋 الرد:\n\n${fullRespText}`, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
  } else if (isWaiting) {
    await ctx.reply("⏳ طلبك قيد المعالجة. سيتم إخطارك تلقائياً عند اكتماله أو رفضه.", Markup.inlineKeyboard([
      [Markup.button.callback("🔄 تحديث الحالة", `ord:check:${order.id}`)],
      [Markup.button.callback("🏠 الرئيسية", "home")],
    ]));
  } else {
    await ctx.reply("شكراً لاستخدامك متجرنا! 🌟", Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
  }
}

async function showMyOrders(ctx, page) {
  const limit = 8;
  const offset = (page - 1) * limit;
  const res = await pool.query('SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3', [ctx.from.id, limit + 1, offset]);
  const rows = res.rows;
  const hasNext = rows.length > limit;
  const slice = rows.slice(0, limit);
  if (slice.length === 0) {
    await sendOrEdit(ctx, "📭 لا يوجد لديك أي طلبات بعد.", Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
    return;
  }
  const lines = slice.map(r => `#${r.id} • ${r.product_name} ×${r.qty} • ${Number(r.price_usd).toFixed(2)}$ • ${statusLabel(r.status)}`);
  const navRow = [];
  if (page > 1) navRow.push(Markup.button.callback("⬅️ السابق", `myorders:${page - 1}`));
  if (hasNext) navRow.push(Markup.button.callback("التالي ➡️", `myorders:${page + 1}`));
  const kb = [];
  if (navRow.length) kb.push(navRow);
  kb.push([Markup.button.callback("🏠 الرئيسية", "home")]);
  await sendOrEdit(ctx, `📦 طلباتي\n\n${lines.join("\n")}`, Markup.inlineKeyboard(kb));
}

async function checkOrderStatus(ctx, orderId) {
  const res = await pool.query('SELECT * FROM orders WHERE id=$1 AND user_id=$2 LIMIT 1', [orderId, ctx.from.id]);
  const row = res.rows[0];
  if (!row) { await ctx.reply("⚠️ غير موجود."); return; }
  if (!row.oranos_order_id) { await ctx.reply(`الحالة الحالية: ${statusLabel(row.status)}`); return; }
  try {
    const resp = await checkOrder(row.oranos_order_id);
    const orderData = extractOrderData(resp);
    const rawStatus = ((orderData?.status ?? row.status) ?? "").toString().toLowerCase();
    const isRejected = REJECT_STATUSES.has(rawStatus);
    const isAccepted = ACCEPT_STATUSES.has(rawStatus);
    const finalStatus = isRejected ? "reject" : isAccepted ? "accept" : rawStatus;

    if (finalStatus !== row.status) {
      const code = extractDeliveredCode(resp);
      await pool.query('UPDATE orders SET status=$1, api_response=$2, delivered_code=$3 WHERE id=$4',
        [finalStatus, JSON.stringify(resp), code ?? row.delivered_code, row.id]);
      if (isRejected && !REJECT_STATUSES.has(row.status)) await adjustBalance(ctx.from.id, Number(row.price_usd));
      const fullText = formatFullApiResponse(resp);
      if (code && !row.delivered_code) await ctx.reply(`🔑 تفاصيل الطلب #${row.id}:\n\n${code}`);
      else if (fullText) await ctx.reply(`📋 الرد للطلب #${row.id}:\n\n${fullText}`);
    }
    const rate = await getExchangeRate();
    const priceUsd = Number(row.price_usd);
    const priceSyp = Math.round(priceUsd * rate);
    await ctx.reply(`الحالة الحالية للطلب #${row.id}: ${statusLabel(finalStatus)}\n💰 ${priceUsd.toFixed(
