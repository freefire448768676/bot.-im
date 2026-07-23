// ============================================================
//  متجر المروان — بوت تيليجرام v2.0
//  محسّن: أداء عالٍ، لوحة إدارة مخفية، إصلاح كامل
// ============================================================
"use strict";

const { Telegraf, Markup } = require("telegraf");
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

// ── DB pool محسّن ─────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("railway") || process.env.DATABASE_URL.includes("neon") || process.env.DATABASE_URL.includes("supabase")
    ? { rejectUnauthorized: false }
    : false,
  max: 20,                 // حد أقصى 20 اتصال متزامن
  min: 2,                  // اتصالان دائمان جاهزان
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  statement_timeout: 15_000,
});

// simple query helper
async function q(text, params = []) {
  const client = await pool.connect();
  try { return await client.query(text, params); }
  finally { client.release(); }
}

// ── Create tables if not exist ────────────────────────────────
async function ensureTables() {
  await q(`
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
      custom_markup_percent NUMERIC(6,2),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS bot_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
      custom_parent_id INTEGER,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS broadcasts (
      id SERIAL PRIMARY KEY,
      message TEXT NOT NULL,
      sent_by BIGINT NOT NULL,
      sent_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS contact_links (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      link TEXT NOT NULL,
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
  `);

  // إضافة العمود الجديد إذا لم يكن موجوداً
  await q(`ALTER TABLE category_overrides ADD COLUMN IF NOT EXISTS custom_parent_id INTEGER`).catch(() => {});
}

// ============================================================
//  SETTINGS
// ============================================================
const settingsCache = new Map();

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
  admin_login_command: "Abdulmalik Marai 1122334455",
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
  const res = await q("SELECT key, value FROM bot_settings");
  settingsCache.clear();
  for (const r of res.rows) settingsCache.set(r.key, r.value);
}

async function ensureDefaults() {
  await loadAllSettings();
  for (const [k, v] of Object.entries(DEFAULTS)) {
    if (!settingsCache.has(k)) {
      await q("INSERT INTO bot_settings(key,value) VALUES($1,$2) ON CONFLICT DO NOTHING", [k, v]);
      settingsCache.set(k, v);
    }
  }
}

async function getSetting(key) {
  if (!settingsCache.has(key)) await loadAllSettings();
  return settingsCache.get(key) ?? DEFAULTS[key] ?? "";
}

async function setSetting(key, value) {
  settingsCache.set(key, value);
  await q("INSERT INTO bot_settings(key,value,updated_at) VALUES($1,$2,NOW()) ON CONFLICT(key) DO UPDATE SET value=$2, updated_at=NOW()", [key, value]);
}

async function getMarkupPercent() { const n = Number(await getSetting("markup_percent")); return Number.isFinite(n) ? n : 3; }
async function getExchangeRate() { const n = Number(await getSetting("exchange_rate")); return Number.isFinite(n) && n > 0 ? n : 132; }
async function getBotStatus() { return getSetting("bot_status"); }
async function getExcludedKeywords() { const v = await getSetting("excluded_product_keywords"); return v.split(",").map(k => k.trim().toLowerCase()).filter(Boolean); }
async function getSocialKeywords() { const v = await getSetting("social_keywords"); return v.split(",").map(k => k.trim().toLowerCase()).filter(Boolean); }
async function getSocialMarkupPercent() { const n = Number(await getSetting("social_markup_percent")); return Number.isFinite(n) ? n : 3; }
async function getSocialMinQty() { const n = Number(await getSetting("social_min_qty")); return Number.isFinite(n) && n > 0 ? n : 500; }
async function getSocialMaxQty() { const n = Number(await getSetting("social_max_qty")); return Number.isFinite(n) && n > 0 ? n : 10000; }
async function getAdminPassword() { return getSetting("admin_password"); }
async function getAdminLoginCommand() { return getSetting("admin_login_command"); }
async function getBtnBackLabel() { return getSetting("btn_back_label"); }
async function getBtnHomeLabel() { return getSetting("btn_home_label"); }
async function getBtnPrevLabel() { return getSetting("btn_prev_label"); }
async function getBtnNextLabel() { return getSetting("btn_next_label"); }

function isSocialProduct(name, catName, kws) {
  const n = ((name ?? "") + " " + (catName ?? "")).toLowerCase();
  return kws.some(k => k && n.includes(k));
}

// ============================================================
//  USER CACHE
// ============================================================
const userCache = new Map();
const USER_CACHE_TTL = 30_000;
function userCacheGet(id) { const hit = userCache.get(id); if (hit && hit.exp > Date.now()) return hit.u; return undefined; }
function userCacheSet(id, u) { userCache.set(id, { u, exp: Date.now() + USER_CACHE_TTL }); }
function invalidateUserCache(id) { userCache.delete(id); }

async function upsertUser(u) {
  const res = await q(
    `INSERT INTO users(id,username,first_name,last_name)
     VALUES($1,$2,$3,$4)
     ON CONFLICT(id) DO UPDATE SET
       username=COALESCE($2,users.username),
       first_name=COALESCE($3,users.first_name),
       last_name=COALESCE($4,users.last_name)
     RETURNING *`,
    [u.id, u.username ?? null, u.first_name ?? null, u.last_name ?? null]
  );
  const row = res.rows[0];
  userCacheSet(u.id, row);
  return row;
}

async function getUser(id) {
  const cached = userCacheGet(id);
  if (cached !== undefined) return cached;
  const res = await q("SELECT * FROM users WHERE id=$1", [id]);
  const u = res.rows[0] ?? null;
  userCacheSet(id, u);
  return u;
}

async function adjustBalance(id, deltaUsd) {
  invalidateUserCache(id);
  const res = await q("UPDATE users SET balance=balance+$1 WHERE id=$2 RETURNING *", [deltaUsd, id]);
  const u = res.rows[0] ?? null;
  if (u) userCacheSet(id, u);
  return u;
}

async function setStatus(id, status) {
  invalidateUserCache(id);
  await q("UPDATE users SET status=$1 WHERE id=$2", [status, id]);
}

async function setAdmin(id, isAdmin, isSuperAdmin) {
  invalidateUserCache(id);
  if (isSuperAdmin !== undefined) {
    await q("UPDATE users SET is_admin=$1, is_super_admin=$2 WHERE id=$3", [isAdmin, isSuperAdmin, id]);
  } else {
    await q("UPDATE users SET is_admin=$1 WHERE id=$2", [isAdmin, id]);
  }
}

async function markAdminAuthed(id) {
  invalidateUserCache(id);
  await q("UPDATE users SET admin_authed_at=NOW() WHERE id=$1", [id]);
}

async function listUsers(offset = 0, limit = 20) {
  const res = await q("SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2", [limit, offset]);
  return res.rows;
}

async function countUsers() {
  const res = await q("SELECT COUNT(*)::int AS c FROM users");
  return res.rows[0]?.c ?? 0;
}

async function searchUser(query) {
  const idNum = Number(query.replace(/[^0-9]/g, ""));
  const u = query.replace(/^@/, "");
  const res = await q(
    `SELECT * FROM users WHERE id=$1 OR username ILIKE $2 OR first_name ILIKE $2 LIMIT 20`,
    [Number.isFinite(idNum) && idNum > 0 ? idNum : 0, `%${u}%`]
  );
  return res.rows;
}

async function listAdmins() {
  const res = await q("SELECT * FROM users WHERE is_admin=true");
  return res.rows;
}

async function setUserMarkup(id, markupPercent) {
  invalidateUserCache(id);
  await q("UPDATE users SET custom_markup_percent=$1 WHERE id=$2", [markupPercent, id]);
}

async function getSuperAdmin() {
  const res = await q("SELECT * FROM users WHERE is_super_admin=true LIMIT 1");
  return res.rows[0] ?? null;
}

// ============================================================
//  FORMAT HELPERS
// ============================================================
async function loadOverrideMap(productIds) {
  const map = new Map();
  if (!productIds.length) return map;
  const res = await q(`SELECT * FROM product_overrides WHERE product_id = ANY($1)`, [productIds]);
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
  const res = await q("SELECT * FROM product_overrides");
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

function formatBalance(usd, rate) {
  return `${usd.toFixed(2)}$ | ${Math.round(usd * rate).toLocaleString("en-US")} ل.س`;
}

// ============================================================
//  ORANOS API
// ============================================================
const ORANOS_BASE = process.env.ORANOS_API_BASE ?? "https://api.oranosmarket.com";
const ORANOS_TOKEN = process.env.ORANOS_API_TOKEN ?? "";

const oranosClient = axios.create({
  baseURL: ORANOS_BASE, timeout: 20000,
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
    const res = await wrapRequest(() => oranosClient.get(`/client/api/newOrder/${productId}/params?${search.toString()}`));
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
أجب دائماً بالعربية. كن دقيقاً وعملياً.`;

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
      body: JSON.stringify({ model: "gpt-4o-mini", max_completion_tokens: 1024, messages: [{ role: "system", content: AI_SYSTEM_PROMPT }, ...hist] }),
    });
    if (!resp.ok) { hist.pop(); convHistory.set(userId, hist); return buildSmartFaq(userMessage); }
    const data = await resp.json();
    const reply = data.choices?.[0]?.message?.content?.trim() ?? buildSmartFaq(userMessage);
    hist.push({ role: "assistant", content: reply });
    convHistory.set(userId, hist);
    return reply;
  } catch { hist.pop(); convHistory.set(userId, hist); return buildSmartFaq(userMessage); }
}

function clearAiHistory(userId) { convHistory.delete(userId); }
function hasAiKey() { return !!process.env.OPENAI_API_KEY; }

function buildSmartFaq(msg) {
  const m = msg.toLowerCase();
  if (m.includes("رصيد") || m.includes("balance")) return "💰 لمعرفة رصيدك استخدم زر *رصيدي* في القائمة الرئيسية.";
  if (m.includes("إيداع") || m.includes("شحن") || m.includes("deposit")) return "💳 لشحن رصيدك اضغط زر *إيداع* في القائمة الرئيسية.";
  if (m.includes("طلب") || m.includes("order")) return "📦 لمتابعة طلباتك اضغط زر *طلباتي* في القائمة الرئيسية.";
  if (m.includes("سعر") || m.includes("price")) return "💱 *تعديل سعر الصرف:*\nالإدارة → ⚙️ الإعدادات → 💱 تعديل سعر الصرف";
  if (m.includes("ربح") || m.includes("markup")) return "📈 *نسبة الربح:*\nالإدارة → ⚙️ الإعدادات → ✏️ تعديل الربح العام";
  return "📞 للمساعدة تواصل مع الدعم عبر زر *الدعم* في القائمة.";
}

// ============================================================
//  PRODUCT CACHE
// ============================================================
const PRODUCTS_TTL = 5 * 60_000;
const CONTENT_TTL = 5 * 60_000;
const OVERRIDES_TTL = 3 * 60_000;
const PAGE_SIZE = 8;

let productsCache = null;
const contentCache = new Map();
let allOverridesCache = null;

async function getCachedProducts() {
  if (productsCache && productsCache.expiry > Date.now()) return productsCache.products;
  const products = await fetchAllProducts();
  productsCache = { products, expiry: Date.now() + PRODUCTS_TTL };
  return products;
}

async function getCachedContent(parentId) {
  const cached = contentCache.get(parentId);
  if (cached && cached.expiry > Date.now()) return cached.content;
  const content = await fetchContent(parentId);
  contentCache.set(parentId, { content, expiry: Date.now() + CONTENT_TTL });
  return content;
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
  if (!ids.length) return new Map();
  const res = await q(`SELECT * FROM category_overrides WHERE category_id = ANY($1)`, [ids]);
  const m = new Map();
  for (const r of res.rows) m.set(r.category_id, {
    customName: r.custom_name,
    hidden: r.hidden,
    sortOrder: r.sort_order,
    customMarkupPercent: r.custom_markup_percent != null ? Number(r.custom_markup_percent) : null,
    customParentId: r.custom_parent_id ?? null,
  });
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
  const rawPrice = Number(p.price) || Number(p.base_price) || Number(p.price_usd) || 0;
  return Number((rawPrice * (1 + m / 100)).toFixed(4));
}

// ─── رسالة الصيانة (إزالة "الموقع") ─────────────────────────
const BOT_MAINTENANCE_MSG = "🔧 البوت قيد الصيانة حالياً.\nسيعود للعمل بأقرب وقت ممكن. نشكر صبركم! 🙏";
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME ?? "admin").split(",")[0].trim();

// ============================================================
//  STEP STATE (per user)
// ============================================================
const stepMap = new Map();
function getStep(uid) { return stepMap.get(uid) ?? { kind: "idle" }; }
function setStep(uid, s) { stepMap.set(uid, s); }

// ── مرجع البوت للاستخدام الداخلي ─────────────────────────────
let _botRef = null;

// ── مديرون موثّقون هذه الجلسة فقط (يُعاد ضبطه عند إعادة التشغيل)
const authedAdminIds = new Set();

// ── حالة التنقل: userId → Map<catId, page> ────────────────────
const navState = new Map();
function saveNavPage(uid, catId, page) {
  if (!navState.has(uid)) navState.set(uid, new Map());
  navState.get(uid).set(catId, page);
}
function getNavPage(uid, catId) { return navState.get(uid)?.get(catId) ?? 1; }

// ── إشعارات الإيداع: depositId → [{adminId, messageId}] ───────
const depositNotifications = new Map();
async function clearDepositForOtherAdmins(processorId, depId, statusText) {
  const list = depositNotifications.get(depId) ?? [];
  depositNotifications.delete(depId);
  for (const n of list) {
    if (n.adminId === processorId) continue;
    try {
      await _botRef?.telegram.editMessageCaption(n.adminId, n.messageId, undefined,
        `${statusText}\n(تمت المعالجة بواسطة مدير آخر)`);
    } catch { /* ignore */ }
  }
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

async function ensureUser(ctx) {
  const f = ctx.from;
  if (!f) return null;
  return upsertUser({ id: f.id, username: f.username, first_name: f.first_name, last_name: f.last_name });
}

// ─── لوحة الإدارة مخفية - لا تظهر في القائمة الرئيسية ─────
function mainMenu() {
  const rows = [
    [Markup.button.callback("🛒 المنتجات", "cat:0:1:0"), Markup.button.callback("💰 رصيدي", "balance")],
    [Markup.button.callback("💳 إيداع", "deposit"), Markup.button.callback("📦 طلباتي", "myorders:1")],
    [Markup.button.callback("📞 الدعم", "support"), Markup.button.callback("🔄 تحديث", "home")],
  ];
  return Markup.inlineKeyboard(rows);
}

// لوحة الإدارة تظهر فقط للمدير بعد تسجيل الدخول
function mainMenuAdmin() {
  const rows = [
    [Markup.button.callback("🛒 المنتجات", "cat:0:1:0"), Markup.button.callback("💰 رصيدي", "balance")],
    [Markup.button.callback("💳 إيداع", "deposit"), Markup.button.callback("📦 طلباتي", "myorders:1")],
    [Markup.button.callback("📞 الدعم", "support"), Markup.button.callback("🔄 تحديث", "home")],
    [Markup.button.callback("👑 لوحة الإدارة", "admin:menu")],
  ];
  return Markup.inlineKeyboard(rows);
}

async function showMainMenu(ctx) {
  const user = await ensureUser(ctx);
  if (!user) return;
  setStep(user.id, { kind: "idle" });
  const status = await getBotStatus();
  if (status === "off" && !authedAdminIds.has(user.id)) {
    await sendOrEdit(ctx, "🔧 البوت قيد الصيانة. سيعود للعمل بأقرب وقت ممكن. نشكر صبركم! 🙏");
    return;
  }
  if (user.status === "banned") { await sendOrEdit(ctx, "🚫 تم حظرك من استخدام البوت."); return; }
  const rate = await getExchangeRate();
  const greeting = `أهلاً فيك في متجر المروان 🌟\nالاسم: ${user.first_name ?? "—"}${user.username ? ` (@${user.username})` : ""}\nالرقم: ${user.id}\nالرصيد: ${formatBalance(Number(user.balance), rate)}\n\nاختر من القائمة 👇`;
  // لوحة الإدارة تظهر فقط لمن سجّل الدخول هذه الجلسة عبر الأمر السري
  await sendOrEdit(ctx, greeting, authedAdminIds.has(user.id) ? mainMenuAdmin() : mainMenu());
}

async function showContactLinks(ctx) {
  const res = await q("SELECT * FROM contact_links WHERE active=true ORDER BY id");
  const links = res.rows;
  if (!links.length) {
    await ctx.reply(`📞 للدعم: @${ADMIN_USERNAME}`, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
    return;
  }
  const rows = links.map(l => [Markup.button.url(l.name, l.link.startsWith("http") ? l.link : `https://t.me/${l.link.replace(/^@/, "")}`)]);
  rows.push([Markup.button.callback("🏠 الرئيسية", "home")]);
  await ctx.reply("📞 وسائل التواصل:", Markup.inlineKeyboard(rows));
}

// ============================================================
//  DEPOSIT
// ============================================================
async function ensureDefaultDepositMethods() {
  const res = await q("SELECT COUNT(*)::int AS c FROM deposit_methods");
  if (res.rows[0].c > 0) return;
  // ملاحظة: إزالة "أرسل المبلغ والرقم الذي حولت منه" من التعليمات
  await q(`INSERT INTO deposit_methods(name,identifier,instructions) VALUES
    ('شام كاش','02d7079d7229d8860c7d89467bfdc938','حول المبلغ إلى رقم شام كاش أعلاه ثم أرسل صورة الإشعار'),
    ('سيريتل كاش','32820534','حول المبلغ إلى رقم سيريتل كاش أعلاه ثم أرسل صورة الإشعار')`);
}

async function showDepositMenu(ctx) {
  await ensureDefaultDepositMethods();
  const res = await q("SELECT * FROM deposit_methods WHERE active=true ORDER BY id");
  const methods = res.rows;
  if (!methods.length) {
    await sendOrEdit(ctx, "❌ لا توجد طرق إيداع متاحة حالياً.", Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
    return;
  }
  const rows = methods.map(m => [Markup.button.callback(`💳 ${m.name}`, `dep:method:${m.id}`)]);
  rows.push([Markup.button.callback("🏠 الرئيسية", "home")]);
  await sendOrEdit(ctx, "💳 اختر طريقة الإيداع:", Markup.inlineKeyboard(rows));
}

async function showDepositMethod(ctx, methodId) {
  const res = await q("SELECT * FROM deposit_methods WHERE id=$1 AND active=true", [methodId]);
  const m = res.rows[0];
  if (!m) { await ctx.reply("⚠️ الطريقة غير متاحة."); return; }
  setStep(ctx.from.id, { kind: "deposit:number", methodId: m.id, methodName: m.name });
  const text = `💳 ${m.name}\n🔑 الرقم: \`${m.identifier}\`\n\n📋 التعليمات:\n${m.instructions}\n\n📱 أرسل رقم هاتفك الذي حولت منه:`;
  await ctx.reply(text, { parse_mode: "Markdown", ...Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "dep:cancel")]]) });
}

async function notifyAdminsDeposit(ctx, depositRow) {
  const user = await getUser(ctx.from.id);
  const text = `📥 طلب إيداع جديد #${depositRow.id}\n👤 ${user?.first_name ?? "—"}${user?.username ? " @" + user.username : ""} (${ctx.from.id})\n💳 ${depositRow.method_name}\n📱 ${depositRow.payer_number ?? "—"}`;
  const kb = Markup.inlineKeyboard([[Markup.button.callback("✅ موافقة", `adm:dep:approve:${depositRow.id}`), Markup.button.callback("❌ رفض", `adm:dep:reject:${depositRow.id}`)]]);
  const admins = await listAdmins();
  const notifications = [];
  for (const a of admins) {
    try {
      const msg = await ctx.telegram.sendPhoto(a.id, depositRow.screenshot_file_id, { caption: text, ...kb });
      notifications.push({ adminId: a.id, messageId: msg.message_id });
    } catch { /* ignore */ }
  }
  if (notifications.length) depositNotifications.set(depositRow.id, notifications);
}

// ============================================================
//  PRODUCTS & CATEGORIES
// ============================================================
async function showCategory(ctx, parentId, page, backTo) {
  const u = await getUser(ctx.from.id);
  const isAdmin = !!u?.is_admin && authedAdminIds.has(ctx.from.id);
  const kws = await getExcludedKeywords();
  const excludedStr = await getSetting("excluded_category_ids");
  const excludedCats = new Set(excludedStr.split(",").map(s => Number(s.trim())).filter(Number.isFinite));
  const content = await getCachedContent(parentId);
  const catOv = await loadCategoryOverrides([...content.categories.map(c => c.id), parentId]);
  const socialKws = await getSocialKeywords();
  const socialMarkup = await getSocialMarkupPercent();
  const markup = await getMarkupPercent();
  const ovMap = await getAllOverridesCached();

  // فلترة الأقسام - دعم نقل القسم إلى داخل قسم آخر
  const movedToHere = [];
  for (const [cid, ov] of catOv) {
    if (ov.customParentId === parentId && cid !== parentId) movedToHere.push(cid);
  }

  const visibleCats = [];
  for (const c of content.categories) {
    if (excludedCats.has(c.id)) continue;
    const ov = catOv.get(c.id);
    if (ov?.hidden && !isAdmin) continue;
    // تحقق إذا القسم نُقل إلى مكان آخر
    if (ov?.customParentId != null && ov.customParentId !== parentId) continue;
    const visible = await isCategoryVisible(c.id, await buildVisibleCategoryIds(excludedCats, kws));
    if (!visible && !isAdmin) continue;
    visibleCats.push(c);
  }

  const visibleProds = content.products.filter(p => {
    if (!p.available && !isAdmin) return false;
    if (isExcludedProduct(p, kws)) return false;
    const ov = ovMap.get(p.id);
    if (ov?.hidden && !isAdmin) return false;
    if (ov?.customCategoryId != null && ov.customCategoryId !== parentId) return false;
    return true;
  });

  const vcRes = await q("SELECT * FROM virtual_categories WHERE parent_id=$1 ORDER BY position", [parentId]);
  const vcRows = isAdmin ? vcRes.rows : vcRes.rows.filter(v => v.active);
  const vcBtns = vcRows.map(v => Markup.button.callback(`${v.active ? "📂 " : "🔒 "}${v.name}`.slice(0, 60), `vcat:${v.id}:1:${parentId}`));

  const mpRes = await q("SELECT * FROM manual_products WHERE category_id=$1 AND category_is_virtual=false AND active=true ORDER BY id", [parentId]);
  const rate = await getExchangeRate();
  const manualBtns = mpRes.rows.map(m => {
    const usd = Number(m.price_usd); const syp = Math.round(usd * rate);
    return Markup.button.callback(`🛒 ${m.name} • ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س`.slice(0, 60), `mprod:${m.id}:${parentId}`);
  });

  if (!visibleCats.length && !visibleProds.length && !vcBtns.length && !manualBtns.length) {
    const [backLabel, homeLabel] = await Promise.all([getBtnBackLabel(), getBtnHomeLabel()]);
    const emptyRows = [];
    if (isAdmin) {
      emptyRows.push([Markup.button.callback("✏️ تعديل اسم القسم", `adm:catEdit:${parentId}`)]);
      emptyRows.push([Markup.button.callback("🙈 إخفاء القسم", `adm:catToggle:${parentId}`)]);
    }
    if (parentId === 0) emptyRows.push([Markup.button.callback(homeLabel, "home")]);
    else { const bp = getNavPage(ctx.from.id, backTo); emptyRows.push([Markup.button.callback(backLabel, backTo === 0 ? "home" : `cat:${backTo}:${bp}:0`), Markup.button.callback(homeLabel, "home")]); }
    await sendOrEdit(ctx, "📭 هذا القسم فارغ حالياً.", Markup.inlineKeyboard(emptyRows)); return;
  }

  visibleCats.sort((a, b) => (catOv.get(a.id)?.sortOrder ?? 9999) - (catOv.get(b.id)?.sortOrder ?? 9999));
  const catBtns = [
    ...vcBtns,
    ...visibleCats.map(c => {
      const ov = catOv.get(c.id);
      const label = ov?.customName ?? c.name;
      return Markup.button.callback(`${ov?.hidden ? "🔒 " : "📂 "}${label}`.slice(0, 60), `cat:${c.id}:1:${parentId}`);
    }),
  ];
  const prodBtns = await Promise.all(visibleProds.map(async p => {
    const ov = ovMap.get(p.id);
    const usd = await effectivePriceUsd(p, ov, markup, socialMarkup, socialKws);
    const syp = Math.round(usd * rate);
    const name = ov?.customName ?? p.name;
    return Markup.button.callback(`${ov?.hidden ? "🔒 " : "🛒 "}${name} • ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س`.slice(0, 60), `prod:${p.id}:${parentId}`);
  }));

  const all = [...catBtns, ...prodBtns, ...manualBtns];
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const safe = Math.min(Math.max(1, page), totalPages);
  saveNavPage(ctx.from.id, parentId, safe); // حفظ الصفحة الحالية للرجوع الصحيح
  const slice = all.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE);

  const [backLabel, homeLabel, prevLabel, nextLabel] = await Promise.all([getBtnBackLabel(), getBtnHomeLabel(), getBtnPrevLabel(), getBtnNextLabel()]);
  const rows = [];
  if (isAdmin && parentId !== 0) {
    const curOv = (await q("SELECT * FROM category_overrides WHERE category_id=$1", [parentId])).rows[0];
    rows.push([Markup.button.callback("✏️ تعديل اسم القسم", `adm:catEdit:${parentId}`), Markup.button.callback(curOv?.hidden ? "👁 إظهار" : "🙈 إخفاء", `adm:catToggle:${parentId}`)]);
    rows.push([Markup.button.callback("% نسبة ربح القسم", `adm:catMarkup:${parentId}`), Markup.button.callback("🔢 ترتيب القسم", `adm:catSort:${parentId}`)]);
    rows.push([Markup.button.callback("🚚 نقل كل منتجات القسم", `adm:moveCatAll:${parentId}`), Markup.button.callback("📁 نقل القسم إلى قسم", `adm:moveCatToParent:${parentId}`)]);
  }
  for (const b of slice) rows.push([b]);
  const nav = [];
  if (safe > 1) nav.push(Markup.button.callback(prevLabel, `cat:${parentId}:${safe - 1}:${backTo}`));
  nav.push(Markup.button.callback(`${safe}/${totalPages}`, "noop"));
  if (safe < totalPages) nav.push(Markup.button.callback(nextLabel, `cat:${parentId}:${safe + 1}:${backTo}`));
  if (nav.length > 1) rows.push(nav);
  if (parentId === 0) rows.push([Markup.button.callback(homeLabel, "home")]);
  else {
    const backPage = getNavPage(ctx.from.id, backTo);
    rows.push([Markup.button.callback(backLabel, backTo === 0 ? "home" : `cat:${backTo}:${backPage}:0`), Markup.button.callback(homeLabel, "home")]);
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
    const page = getNavPage(ctx.from.id, to); // استخدم آخر صفحة زارها المستخدم
    const vc = (await q("SELECT id FROM virtual_categories WHERE id=$1", [to])).rows[0];
    if (vc) return Markup.button.callback(backLabel, `vcat:${to}:${page}:0`);
    return Markup.button.callback(backLabel, `cat:${to}:${page}:0`);
  }

  if (!p) { await sendOrEdit(ctx, "⚠️ المنتج غير موجود.", Markup.inlineKeyboard([[await resolveBackBtn(backTo)]])); return; }
  const kws = await getExcludedKeywords();
  const u = await getUser(ctx.from.id);
  const isAdmin = !!u?.is_admin;
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
  } else if (!p.qty_values) { qtyInfo = "الكمية: 1 (ثابتة)"; }
  else if (Array.isArray(p.qty_values)) { qtyInfo = `الكميات المتاحة: ${p.qty_values.join(", ")}`; }
  else { qtyInfo = `الكمية بين ${p.qty_values.min} و ${p.qty_values.max}`; }

  const displayName = ov?.customName ?? p.name;
  const instructions = ov?.instructions?.trim() || getProductApiNotes(p);
  const text = `🛒 ${displayName}\n${p.category_name ? `القسم: ${p.category_name}\n` : ""}السعر: ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س\n${qtyInfo}${instructions ? `\n\n📋 تعليمات:\n${instructions}` : ""}`;

  const backBtnResolved = await resolveBackBtn(backTo);
  const btns = [];
  if (p.available || isAdmin) btns.push([Markup.button.callback("🛒 طلب الآن", `buy:${p.id}:${backTo}`)]);
  if (isAdmin) {
    btns.push([Markup.button.callback("✏️ تعديل السعر", `adm:editPrice:${p.id}`), Markup.button.callback("📋 تعليمات", `adm:editInstr:${p.id}`)]);
    btns.push([Markup.button.callback("📝 تعديل الاسم", `adm:renameProd:${p.id}`), Markup.button.callback("🚚 نقل لقسم آخر", `adm:moveProd:${p.id}`)]);
    btns.push([Markup.button.callback(ov?.hidden ? "👁 إظهار" : "🙈 إخفاء", `adm:hideProd:${p.id}`)]);
  }
  btns.push([backBtnResolved, Markup.button.callback(homeLabel, "home")]);
  await sendOrEdit(ctx, text, Markup.inlineKeyboard(btns));
}

async function showVirtualCategory(ctx, vcId, page, backTo) {
  const u = await getUser(ctx.from.id);
  const isAdmin = !!u?.is_admin && authedAdminIds.has(ctx.from.id);
  const vcRes = await q("SELECT * FROM virtual_categories WHERE id=$1", [vcId]);
  const vc = vcRes.rows[0];
  if (!vc || (!vc.active && !isAdmin)) { await sendOrEdit(ctx, "⚠️ هذا القسم غير متاح.", Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]])); return; }
  const [backLabel, homeLabel, prevLabel, nextLabel] = await Promise.all([getBtnBackLabel(), getBtnHomeLabel(), getBtnPrevLabel(), getBtnNextLabel()]);
  let backBtn;
  if (backTo === 0) backBtn = Markup.button.callback(homeLabel, "home");
  else {
    const parentVcat = (await q("SELECT id FROM virtual_categories WHERE id=$1", [backTo])).rows[0];
    backBtn = parentVcat ? Markup.button.callback(backLabel, `vcat:${backTo}:1:0`) : Markup.button.callback(backLabel, `cat:${backTo}:1:0`);
  }

  const allOv = await getAllOverridesCached();
  const allProducts = await getCachedProducts();
  const kws = await getExcludedKeywords();
  const markup = await getMarkupPercent();
  const rate = await getExchangeRate();
  const socialKws = await getSocialKeywords();
  const socialMarkup = await getSocialMarkupPercent();

  const subVcRes = await q("SELECT * FROM virtual_categories WHERE parent_id=$1 ORDER BY position", [vcId]);
  const subVcs = isAdmin ? subVcRes.rows : subVcRes.rows.filter(v => v.active);
  const subVcBtns = subVcs.map(v => Markup.button.callback(`${v.active ? "📂 " : "🔒 "}${v.name}`.slice(0, 60), `vcat:${v.id}:1:${vcId}`));

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

  const mpRes = isAdmin
    ? await q("SELECT * FROM manual_products WHERE category_id=$1 AND category_is_virtual=true ORDER BY id", [vcId])
    : await q("SELECT * FROM manual_products WHERE category_id=$1 AND category_is_virtual=true AND active=true ORDER BY id", [vcId]);
  const manualBtnsVc = mpRes.rows.map(m => {
    const usd = Number(m.price_usd); const syp = Math.round(usd * rate);
    return Markup.button.callback(`🛒 ${m.name} • ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س`.slice(0, 60), `mprod:${m.id}:${vcId}`);
  });

  if (!visible.length && !subVcBtns.length && !manualBtnsVc.length && !isAdmin) { await sendOrEdit(ctx, "📭 هذا القسم فارغ حالياً.", Markup.inlineKeyboard([[backBtn]])); return; }

  const ovMap = await loadOverrideMap(visible.map(p => p.id));
  const prodBtns = await Promise.all(visible.map(async p => {
    const ov = ovMap.get(p.id);
    const usd = await effectivePriceUsd(p, ov, markup, socialMarkup, socialKws);
    const syp = Math.round(usd * rate);
    return Markup.button.callback(`${ov?.hidden ? "🔒 " : "🛒 "}${ov?.customName ?? p.name} • ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س`.slice(0, 60), `prod:${p.id}:${vcId}`);
  }));

  const allBtns = [...subVcBtns, ...prodBtns, ...manualBtnsVc];
  const totalPages = Math.max(1, Math.ceil(allBtns.length / PAGE_SIZE));
  const safe = Math.min(Math.max(1, page), totalPages);
  saveNavPage(ctx.from.id, vcId, safe);
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
    const parentIsVcat = (await q("SELECT id FROM virtual_categories WHERE id=$1", [backTo])).rows[0];
    backBtn = parentIsVcat ? Markup.button.callback(backLabel, `vcat:${backTo}:1:0`) : Markup.button.callback(backLabel, `cat:${backTo}:1:0`);
  }
  const mRes = await q("SELECT * FROM manual_products WHERE id=$1", [mId]);
  const m = mRes.rows[0];
  const u = await getUser(ctx.from.id);
  const isAdmin = !!u?.is_admin;
  if (!m || (!m.active && !isAdmin)) { await sendOrEdit(ctx, "⚠️ المنتج غير متاح.", Markup.inlineKeyboard([[backBtn]])); return; }
  const rate = await getExchangeRate();
  const usd = Number(m.price_usd); const syp = Math.round(usd * rate);
  const balance = u ? Number(u.balance) : 0;
  const canAfford = balance >= usd;
  const text = `🛒 ${m.name}\nالسعر: ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س\nالرصيد: ${formatBalance(balance, rate)}${m.instructions ? `\n\n📋 ${m.instructions}` : ""}`;
  const rows = [];
  if (m.active && canAfford) rows.push([Markup.button.callback("🛒 طلب الآن", `mbuy:${m.id}`)]);
  else if (m.active && !canAfford) rows.push([Markup.button.callback("💳 شحن رصيد", "deposit")]);
  rows.push([backBtn, Markup.button.callback(homeLabel, "home")]);
  await sendOrEdit(ctx, text, Markup.inlineKeyboard(rows));
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

// إزالة "رد الموقع" - فقط محتوى الرد
function formatApiResponseClean(resp) {
  const parts = [];
  const code = extractDeliveredCode(resp);
  if (code) parts.push(code);
  if (resp.message?.trim() && resp.message.trim() !== "success") {
    parts.push(resp.message.trim());
  }
  const orderData = extractOrderData(resp);
  if (orderData?.status && typeof orderData.status === "string") {
    const raw = orderData.status;
    const label = statusLabel(raw);
    if (!parts.some(p => p.includes(raw) || p.includes(label))) {
      if (!ACCEPT_STATUSES.has(raw.toLowerCase())) parts.push(`📊 الحالة: ${label}`);
    }
  }
  return [...new Set(parts)].filter(Boolean).join("\n\n").trim();
}

// للتوافق مع الكود القديم
function formatFullApiResponse(resp) {
  return formatApiResponseClean(resp);
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

// إصلاح حساب السعر في عداد الكميات
function formatPriceLabel(qty, unitPriceUsd) {
  if (!unitPriceUsd || unitPriceUsd <= 0) return `${Number(qty).toLocaleString("en-US")}`;
  const total = unitPriceUsd * qty;
  if (total <= 0) return `${Number(qty).toLocaleString("en-US")}`;
  const totalStr = total < 0.001 ? total.toFixed(6)
    : total < 0.01 ? total.toFixed(4)
    : total < 1 ? total.toFixed(3)
    : total.toFixed(2);
  return `${Number(qty).toLocaleString("en-US")} — ${totalStr}$`;
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
  const unitPriceUsd = await effectivePriceUsd(p, ov, markup, socialMarkup, socialKws, null, userMarkup);
  const isSocial = isSocialProduct(p.name, p.category_name, socialKws);
  const paramKeys = Array.isArray(p.params) ? p.params : [];

  if (isSocial) {
    const parsedSocial = parseQtyValues(p.qty_values);
    if (parsedSocial.kind === "list" && parsedSocial.values.length > 0) {
      setStep(ctx.from.id, { kind: "order:qty", productId: p.id, productName: p.name, priceUsd: unitPriceUsd, paramKeys, qtyValues: parsedSocial.values, backTo });
      const rows = parsedSocial.values.slice(0, 24).map(v => {
        const label = formatPriceLabel(v, unitPriceUsd);
        return [Markup.button.callback(label, `ord:qty:${v}`)];
      });
      rows.push([Markup.button.callback("❌ إلغاء", "ord:cancel")]);
      await sendOrEdit(ctx, `🛒 ${p.name}\n\nاختر الكمية:`, Markup.inlineKeyboard(rows)); return;
    }
    let min, max;
    if (parsedSocial.kind === "range" && Number.isFinite(parsedSocial.min) && parsedSocial.min > 0)
      { min = parsedSocial.min; max = parsedSocial.max; }
    else { min = await getSocialMinQty(); max = await getSocialMaxQty(); }
    setStep(ctx.from.id, { kind: "order:qty", productId: p.id, productName: p.name, priceUsd: unitPriceUsd, paramKeys, qtyValues: { min, max }, backTo });
    await sendOrEdit(ctx, `🛒 ${p.name}\n\nأرسل الكمية (بين ${min.toLocaleString("en-US")} و ${max.toLocaleString("en-US")}):`, Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "ord:cancel")]])); return;
  }

  const parsed = parseQtyValues(p.qty_values);
  if (parsed.kind === "fixed") { await askNextParam(ctx, p, unitPriceUsd, 1, paramKeys, {}, 0, backTo); return; }
  if (parsed.kind === "list") {
    setStep(ctx.from.id, { kind: "order:qty", productId: p.id, productName: p.name, priceUsd: unitPriceUsd, paramKeys, qtyValues: parsed.values, backTo });
    const rows = parsed.values.slice(0, 24).map(v => {
      const label = formatPriceLabel(v, unitPriceUsd);
      return [Markup.button.callback(label, `ord:qty:${v}`)];
    });
    rows.push([Markup.button.callback("❌ إلغاء", "ord:cancel")]);
    await sendOrEdit(ctx, `🛒 ${p.name}\nاختر الكمية:`, Markup.inlineKeyboard(rows)); return;
  }
  setStep(ctx.from.id, { kind: "order:qty", productId: p.id, productName: p.name, priceUsd: unitPriceUsd, paramKeys, qtyValues: { min: parsed.min, max: parsed.max }, backTo });
  await sendOrEdit(ctx, `🛒 ${p.name}\nأرسل الكمية (بين ${parsed.min} و ${parsed.max}):`, Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "ord:cancel")]]));
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
  const text = `🧾 تأكيد الطلب\n\n🛒 المنتج: ${p.name}\n🔢 الكمية: ${qty.toLocaleString("en-US")}\n${paramsLines ? paramsLines + "\n" : ""}💰 الإجمالي: ${totalUsdStr}$ | ${totalSyp.toLocaleString("en-US")} ل.س\n💳 رصيدك: ${formatBalance(balance, rate)}\n\n${lowBalance ? "❌ ليس لديك رصيد كافي. يرجى شحن رصيدك ثم المحاولة مجدداً." : "هل تريد تأكيد الطلب؟"}`;
  const rows = lowBalance
    ? [[Markup.button.callback("💳 شحن رصيد", "deposit")], [Markup.button.callback("❌ إلغاء", "ord:cancel")]]
    : [[Markup.button.callback("✅ تأكيد وتنفيذ", "ord:confirm"), Markup.button.callback("❌ إلغاء", "ord:cancel")]];
  await sendOrEdit(ctx, text, Markup.inlineKeyboard(rows));
}

async function executeOrder(ctx) {
  const step = getStep(ctx.from.id);
  if (step.kind !== "order:params") return;
  let all = await getCachedProducts(); let p = all.find(x => x.id === step.productId);
  if (!p) { all = await fetchAllProducts(); p = all.find(x => x.id === step.productId); }
  if (!p) { await ctx.reply("⚠️ المنتج غير موجود."); return; }

  const totalUsd = Number((step.priceUsd * step.qty).toFixed(4));
  const u = await getUser(ctx.from.id);
  const balance = u ? Number(u.balance) : 0;
  if (balance < totalUsd) { await ctx.reply("❌ ليس لديك رصيد كافٍ.", Markup.inlineKeyboard([[Markup.button.callback("💳 شحن رصيد", "deposit")], [Markup.button.callback("🏠 الرئيسية", "home")]])); setStep(ctx.from.id, { kind: "idle" }); return; }
  await clearInlineKeyboard(ctx).catch(() => {});
  const orderUuid = crypto.randomUUID();
  await adjustBalance(ctx.from.id, -totalUsd);
  const execRate = await getExchangeRate();
  const totalSyp = Math.round(totalUsd * execRate);
  const params = { ...step.collected };
  if (step.qty && step.qty !== 1) params["qty"] = step.qty;
  const insRes = await q(
    `INSERT INTO orders(user_id,product_id,product_name,qty,params,price_usd,oranos_uuid,status)
     VALUES($1,$2,$3,$4,$5,$6,$7,'pending') RETURNING *`,
    [ctx.from.id, p.id, p.name, String(step.qty), JSON.stringify(step.collected), String(totalUsd), orderUuid]
  );
  const order = insRes.rows[0];
  await ctx.reply(`⏳ جاري تنفيذ طلبك #${order.id}...\n💸 تم خصم ${totalUsd.toFixed(2)}$ | ${totalSyp.toLocaleString("en-US")} ل.س من رصيدك.`);
  let resp;
  try { resp = await placeOrder(p.id, params, orderUuid); }
  catch { resp = { status: "ERR", message: "خطأ شبكة" }; }
  const apiStatus = (resp.status ?? "").toLowerCase();
  const success = apiStatus === "success" || apiStatus === "ok" || apiStatus === "accept";
  if (!success) {
    await adjustBalance(ctx.from.id, totalUsd);
    await q("UPDATE orders SET status='error', api_response=$1 WHERE id=$2", [JSON.stringify(resp), order.id]);
    setStep(ctx.from.id, { kind: "idle" });
    const errText = formatApiResponseClean(resp);
    const errMsg = resp.message && resp.message !== "Network error" ? resp.message : "تعذّر التنفيذ";
    await ctx.reply(
      `❌ تعذّر تنفيذ الطلب #${order.id}.\nالسبب: ${errMsg}\n✅ تمت إعادة ${totalUsd.toFixed(2)}$ | ${totalSyp.toLocaleString("en-US")} ل.س إلى رصيدك.${errText ? `\n\n${errText}` : ""}`,
      Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]])
    ); return;
  }
  const deliveredCode = extractDeliveredCode(resp);
  const oranosOrderId = resp.data?.order_id ?? null;
  const apiInnerStatus = (resp.data?.status ?? apiStatus).toString();
  await q("UPDATE orders SET status=$1, oranos_order_id=$2, api_response=$3, delivered_code=$4 WHERE id=$5",
    [apiInnerStatus === "accept" ? "accept" : apiInnerStatus, oranosOrderId, JSON.stringify(resp), deliveredCode ?? null, order.id]);
  setStep(ctx.from.id, { kind: "idle" });
  const cleanResp = formatApiResponseClean(resp);
  const isWaiting = !ACCEPT_STATUSES.has(apiInnerStatus.toLowerCase()) && !REJECT_STATUSES.has(apiInnerStatus.toLowerCase());
  await ctx.reply(`✅ تم استلام طلبك #${order.id}\nالحالة: ${statusLabel(apiInnerStatus)}\n🛒 ${p.name} × ${step.qty}\n💰 ${totalUsd.toFixed(2)}$ | ${totalSyp.toLocaleString("en-US")} ل.س`);
  if (deliveredCode) {
    await ctx.reply(`🔑 تفاصيل الطلب:\n\n${deliveredCode}`, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
  } else if (cleanResp && !isWaiting) {
    await ctx.reply(cleanResp, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
  } else if (isWaiting) {
    await ctx.reply("⏳ طلبك قيد المعالجة. سيتم إخطارك تلقائياً عند اكتماله. نشكر صبركم! 🙏", Markup.inlineKeyboard([[Markup.button.callback("🔄 تحديث الحالة", `ord:check:${order.id}`)], [Markup.button.callback("🏠 الرئيسية", "home")]]));
  } else {
    await ctx.reply("شكراً لاستخدامك متجرنا! 🌟", Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
  }
}

async function showMyOrders(ctx, page) {
  const limit = 8; const offset = (page - 1) * limit;
  const res = await q("SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3", [ctx.from.id, limit + 1, offset]);
  const hasNext = res.rows.length > limit; const slice = res.rows.slice(0, limit);
  if (!slice.length) { await sendOrEdit(ctx, "📭 لا يوجد لديك أي طلبات بعد.", Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]])); return; }
  const lines = slice.map(r => `#${r.id} • ${r.product_name} ×${r.qty} • ${Number(r.price_usd).toFixed(2)}$ • ${statusLabel(r.status)}`);
  const navRow = [];
  if (page > 1) navRow.push(Markup.button.callback("⬅️ السابق", `myorders:${page - 1}`));
  if (hasNext) navRow.push(Markup.button.callback("التالي ➡️", `myorders:${page + 1}`));
  const kb = []; if (navRow.length) kb.push(navRow);
  kb.push([Markup.button.callback("🏠 الرئيسية", "home")]);
  await sendOrEdit(ctx, `📦 طلباتي\n\n${lines.join("\n")}`, Markup.inlineKeyboard(kb));
}

async function checkOrderStatus(ctx, orderId) {
  const res = await q("SELECT * FROM orders WHERE id=$1", [orderId]);
  const row = res.rows[0];
  if (!row || Number(row.user_id) !== ctx.from.id) { await ctx.reply("⚠️ غير موجود."); return; }
  if (!row.oranos_order_id) { await ctx.reply(`الحالة الحالية: ${statusLabel(row.status)}`); return; }
  try {
    const resp = await checkOrder(row.oranos_order_id);
    const orderData = extractOrderData(resp);
    const rawStatus = ((orderData?.status ?? row.status) ?? "").toString().toLowerCase();
    const isRejected = REJECT_STATUSES.has(rawStatus); const isAccepted = ACCEPT_STATUSES.has(rawStatus);
    const finalStatus = isRejected ? "reject" : isAccepted ? "accept" : rawStatus;
    if (finalStatus !== row.status) {
      const code = extractDeliveredCode(resp);
      await q("UPDATE orders SET status=$1, api_response=$2" + (code ? ", delivered_code=$3" : "") + " WHERE id=" + (code ? "$4" : "$3"),
        code ? [finalStatus, JSON.stringify(resp), code, row.id] : [finalStatus, JSON.stringify(resp), row.id]);
      if (isRejected && !REJECT_STATUSES.has(row.status)) await adjustBalance(ctx.from.id, Number(row.price_usd));
      const cleanText = formatApiResponseClean(resp);
      if (code && !row.delivered_code) await ctx.reply(`🔑 تفاصيل الطلب #${row.id}:\n\n${code}`);
      else if (cleanText) await ctx.reply(`📋 طلب #${row.id}:\n\n${cleanText}`);
    }
    await ctx.reply(`الحالة الحالية للطلب #${row.id}: ${statusLabel(finalStatus)}`);
  } catch { await ctx.reply("⚠️ تعذّر فحص الحالة الآن."); }
}

async function pollOneOrder(bot, order) {
  let resp = null;
  if (order.oranos_order_id) resp = await checkOrder(order.oranos_order_id).catch(() => null);
  if (!resp && order.oranos_uuid) resp = await checkOrder(order.oranos_uuid, true).catch(() => null);
  if (!resp) return;
  const orderData = extractOrderData(resp);
  const rawNew = ((orderData?.status ?? "").toString().toLowerCase());
  if (!rawNew || rawNew === order.status) return;
  const isRejected = REJECT_STATUSES.has(rawNew); const isAccepted = ACCEPT_STATUSES.has(rawNew);
  const prevRejected = REJECT_STATUSES.has(order.status); const prevAccepted = ACCEPT_STATUSES.has(order.status);
  if (isRejected && prevRejected) return; if (isAccepted && prevAccepted) return;
  const code = extractDeliveredCode(resp);
  const finalStatus = isRejected ? "reject" : isAccepted ? "accept" : rawNew;
  await q("UPDATE orders SET status=$1, api_response=$2" + (code ? ", delivered_code=$3" : "") + " WHERE id=" + (code ? "$4" : "$3"),
    code ? [finalStatus, JSON.stringify(resp), code, order.id] : [finalStatus, JSON.stringify(resp), order.id]);
  const cleanText = formatApiResponseClean(resp);
  const priceUsd = Number(order.price_usd); const rate = await getExchangeRate();
  if (isRejected) {
    if (!prevRejected) await adjustBalance(order.user_id, priceUsd);
    const refundSyp = Math.round(priceUsd * rate);
    const msgLines = [`❌ تم رفض الطلب #${order.id}`, `🛒 المنتج: ${order.product_name}`, `💰 تمت إعادة ${priceUsd.toFixed(2)}$ | ${refundSyp.toLocaleString("en-US")} ل.س إلى رصيدك.`];
    if (cleanText) msgLines.push(`\n${cleanText}`);
    await bot.telegram.sendMessage(order.user_id, msgLines.join("\n")).catch(() => {});
  } else if (isAccepted) {
    const priceSyp = Math.round(priceUsd * rate);
    const msgLines = [`✅ تم تنفيذ طلبك #${order.id} بنجاح!`, `🛒 المنتج: ${order.product_name}`, `💰 ${priceUsd.toFixed(2)}$ | ${priceSyp.toLocaleString("en-US")} ل.س`];
    if (code) msgLines.push(`\n🔑 التفاصيل:\n${code}`);
    else if (cleanText) msgLines.push(`\n${cleanText}`);
    await bot.telegram.sendMessage(order.user_id, msgLines.join("\n")).catch(() => {});
  }
}

function startOrderPoller(bot) {
  setInterval(async () => {
    try {
      const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const res = await q(
        "SELECT * FROM orders WHERE status != ALL($1) AND created_at > $2 LIMIT 200",
        [TERMINAL_STATUSES, cutoff]
      );
      const CHUNK = 5;
      for (let i = 0; i < res.rows.length; i += CHUNK) {
        await Promise.allSettled(res.rows.slice(i, i + CHUNK).map(order => pollOneOrder(bot, order).catch(() => {})));
      }
    } catch { /* silent */ }
  }, 90_000).unref();
}

// ============================================================
//  ADMIN
// ============================================================
async function requireAdmin(ctx) {
  if (!authedAdminIds.has(ctx.from.id)) { await ctx.reply("⛔ هذا القسم للإدارة فقط."); return false; }
  const u = await getUser(ctx.from.id);
  if (!u?.is_admin) { await ctx.reply("⛔ هذا القسم للإدارة فقط."); return false; }
  return true;
}

async function requireSuperAdmin(ctx) {
  if (!authedAdminIds.has(ctx.from.id)) { await ctx.reply("⛔ هذا الإجراء للمدير الأعلى فقط."); return false; }
  const u = await getUser(ctx.from.id);
  if (!u?.is_super_admin) { await ctx.reply("⛔ هذا الإجراء للمدير الأعلى فقط."); return false; }
  return true;
}

async function showAdminMenu(ctx) {
  if (!(await requireAdmin(ctx))) return;
  const status = await getBotStatus();
  const u = await getUser(ctx.from.id);
  const isSA = !!u?.is_super_admin;
  const rows = [
    [Markup.button.callback("📥 طلبات الإيداع", "adm:depList:1"), Markup.button.callback("👥 المستخدمون", "adm:users:1")],
    [Markup.button.callback("🔍 بحث مستخدم", "adm:findUser"), Markup.button.callback("📦 كل الطلبات", "adm:allOrders:1")],
    [Markup.button.callback("📣 رسالة جماعية", "adm:broadcast"), Markup.button.callback("💳 طرق الإيداع", "adm:methods")],
    [Markup.button.callback("🛒 إدارة المنتجات", "cat:0:1:0"), Markup.button.callback("⚙️ الإعدادات", "adm:settings")],
    [Markup.button.callback("📞 وسائل التواصل", "adm:contacts"), Markup.button.callback("📁 أقسام مخصصة", "adm:vcList")],
    [Markup.button.callback("➕ منتج يدوي", "adm:manualProds"), Markup.button.callback("🛠️ مساعد الإدارة", "adm:aiSupport")],
    [Markup.button.callback("🔄 بينج تلقائي", "adm:ping"), Markup.button.callback(status === "on" ? "🟢 البوت: شغال" : "🔴 البوت: متوقف", "adm:toggleStatus")],
    [Markup.button.callback("🚪 تسجيل خروج", "adm:logout"), Markup.button.callback("🏠 الرئيسية", "home")],
  ];
  await sendOrEdit(ctx, `👑 لوحة الإدارة${isSA ? " (مدير أعلى)" : ""}`, Markup.inlineKeyboard(rows));
}

async function showSettingsMenu(ctx) {
  if (!(await requireAdmin(ctx))) return;
  const [m, sm, r] = await Promise.all([getMarkupPercent(), getSocialMarkupPercent(), getExchangeRate()]);
  const loginCmd = await getAdminLoginCommand();
  const u = await getUser(ctx.from.id);
  const isSA = !!u?.is_super_admin;
  const rows = [
    [Markup.button.callback("✏️ تعديل الربح العام", "adm:setMarkup")],
    [Markup.button.callback("✏️ تعديل ربح السوشل", "adm:setSocialMarkup")],
    [Markup.button.callback("💱 تعديل سعر الصرف", "adm:setRate")],
    [Markup.button.callback("🔑 تغيير كلمة المرور", "adm:newPass")],
    [Markup.button.callback("🔘 تعديل أزرار التنقل", "adm:btnLabels")],
  ];
  if (isSA) {
    rows.push([Markup.button.callback("🔐 تغيير أمر الدخول السري", "adm:changeLoginCmd")]);
  }
  rows.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
  await sendOrEdit(ctx, `⚙️ الإعدادات\n\nالربح العام: ${m}%\nربح السوشل: ${sm}%\nسعر الصرف: ${r} ل.س/$\nأمر الدخول: \`${loginCmd}\``,
    Markup.inlineKeyboard(rows));
}

async function showDepList(ctx, page) {
  if (!(await requireAdmin(ctx))) return;
  const limit = 8; const offset = (page - 1) * limit;
  const res = await q("SELECT * FROM deposit_requests WHERE status='pending' ORDER BY created_at DESC LIMIT $1 OFFSET $2", [limit + 1, offset]);
  const hasNext = res.rows.length > limit; const slice = res.rows.slice(0, limit);
  if (!slice.length) { await sendOrEdit(ctx, "📭 لا توجد طلبات إيداع معلقة.", Markup.inlineKeyboard([[Markup.button.callback("⬅️ رجوع", "admin:menu")]])); return; }
  const kb = slice.map(d => [Markup.button.callback(`#${d.id} • ${d.method_name} • UID:${d.user_id}`, `adm:depShow:${d.id}`)]);
  const nav = [];
  if (page > 1) nav.push(Markup.button.callback("⬅️ السابق", `adm:depList:${page - 1}`));
  if (hasNext) nav.push(Markup.button.callback("التالي ➡️", `adm:depList:${page + 1}`));
  if (nav.length) kb.push(nav);
  kb.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
  await sendOrEdit(ctx, "📥 طلبات الإيداع المعلقة:", Markup.inlineKeyboard(kb));
}

async function showDepDetails(ctx, depId) {
  if (!(await requireAdmin(ctx))) return;
  const res = await q("SELECT * FROM deposit_requests WHERE id=$1", [depId]);
  const d = res.rows[0]; if (!d) { await ctx.reply("⚠️ غير موجود."); return; }
  const u = await getUser(d.user_id);
  const text = `📥 طلب إيداع #${d.id}\nالحالة: ${d.status}\nالطريقة: ${d.method_name}\nالمستخدم: ${u?.first_name ?? ""} ${u?.username ? "@" + u.username : ""} (${d.user_id})\nرصيد المستخدم: ${u ? Number(u.balance).toFixed(2) : "0.00"}$\nرقم المُحوِّل: ${d.payer_number ?? "—"}`;
  const balanceRow = [Markup.button.callback("➕ شحن رصيد", `adm:userAdd:${d.user_id}`), Markup.button.callback("➖ خصم رصيد", `adm:userSub:${d.user_id}`)];
  const kb = d.status === "pending"
    ? Markup.inlineKeyboard([[Markup.button.callback("✅ موافقة", `adm:dep:approve:${d.id}`), Markup.button.callback("❌ رفض", `adm:dep:reject:${d.id}`)], balanceRow, [Markup.button.callback("👤 ملف المستخدم", `adm:user:${d.user_id}`)], [Markup.button.callback("⬅️ رجوع", "adm:depList:1")]])
    : Markup.inlineKeyboard([balanceRow, [Markup.button.callback("👤 ملف المستخدم", `adm:user:${d.user_id}`)], [Markup.button.callback("⬅️ رجوع", "adm:depList:1")]]);
  try { await ctx.replyWithPhoto(d.screenshot_file_id, { caption: text, ...kb }); }
  catch { await ctx.reply(text + "\n\n(تعذّر تحميل الصورة)", kb); }
}

async function approveDeposit(ctx, depId) {
  if (!(await requireAdmin(ctx))) return;
  setStep(ctx.from.id, { kind: "admin:depositApproveAmount", depositId: depId });
  await ctx.reply(`💵 أرسل المبلغ بالدولار لإضافته إلى رصيد المستخدم لطلب الإيداع #${depId}:`, Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "admin:menu")]]));
}

async function rejectDeposit(ctx, depId) {
  if (!(await requireAdmin(ctx))) return;
  // تحقق ذري: يُحدَّث فقط إذا كان "pending"
  const res = await q("UPDATE deposit_requests SET status='rejected', processed_by=$1, processed_at=NOW() WHERE id=$2 AND status='pending' RETURNING *", [ctx.from.id, depId]);
  if (!res.rows.length) { await ctx.reply("⚠️ تمت معالجة هذا الطلب مسبقاً بواسطة مدير آخر."); return; }
  const d = res.rows[0];
  await clearDepositForOtherAdmins(ctx.from.id, depId, `❌ طلب إيداع #${depId} — تم الرفض`);
  await ctx.reply(`❌ تم رفض طلب الإيداع #${depId}.`);
  if (d) { try { await ctx.telegram.sendMessage(d.user_id, `❌ تم رفض طلب الإيداع #${d.id}. للاستفسار راسل @${ADMIN_USERNAME}.`); } catch { /* ignore */ } }
}

async function showUserCard(ctx, uid) {
  if (!(await requireAdmin(ctx))) return;
  const u = await getUser(uid); if (!u) { await ctx.reply("⚠️ غير موجود."); return; }
  const me = await getUser(ctx.from.id);
  const isMeSA = !!me?.is_super_admin;
  const statsRes = await q("SELECT COUNT(*)::int AS c, COALESCE(SUM(price_usd),0)::text AS s FROM orders WHERE user_id=$1", [uid]);
  const oc = statsRes.rows[0]?.c ?? 0; const sum = Number(statsRes.rows[0]?.s ?? 0);
  const text = `👤 ${u.first_name ?? "—"}${u.username ? " @" + u.username : ""}\nID: ${u.id}\nالرصيد: ${Number(u.balance).toFixed(2)}$\nالحالة: ${u.status}\nإداري؟ ${u.is_admin ? "نعم" : "لا"}${u.is_super_admin ? " (أعلى)" : ""}\nعدد الطلبات: ${oc} • إجمالي: ${sum.toFixed(2)}$`;
  const kb = [
    [Markup.button.callback("➕ شحن رصيد", `adm:userAdd:${uid}`), Markup.button.callback("➖ خصم رصيد", `adm:userSub:${uid}`)],
    [Markup.button.callback(u.status === "banned" ? "✅ رفع الحظر" : "🚫 حظر", `adm:userBan:${uid}`), Markup.button.callback(u.is_admin ? "👤 إلغاء إداري" : "👑 جعله إداري", `adm:userAdmin:${uid}`)],
    [Markup.button.callback("📦 طلباته", `adm:userOrders:${uid}:1`), Markup.button.callback("% ربح خاص", `adm:userMarkup:${uid}`)],
  ];
  // المدير الأعلى يستطيع تعيين مدير أعلى آخر
  if (isMeSA && uid !== ctx.from.id) {
    kb.push([Markup.button.callback(u.is_super_admin ? "⬇️ إلغاء المدير الأعلى" : "🌟 جعله مديراً أعلى", `adm:userSA:${uid}`)]);
  }
  kb.push([Markup.button.callback("⬅️ رجوع", "adm:users:1")]);
  await sendOrEdit(ctx, text, Markup.inlineKeyboard(kb));
}

function startPingScheduler(bot) {
  setInterval(async () => {
    try {
      const enabled = (await getSetting("auto_ping_enabled")) === "on"; if (!enabled) return;
      const targetId = Number(await getSetting("auto_ping_target_user_id")); if (!targetId) return;
      const intervalMin = Number(await getSetting("auto_ping_interval_min")) || 5;
      const lastSent = Number(await getSetting("auto_ping_last_sent")) || 0;
      if (Date.now() - lastSent < intervalMin * 60_000) return;
      await setSetting("auto_ping_last_sent", String(Date.now()));
      await bot.telegram.sendMessage(targetId, "/start").catch(() => {});
    } catch { /* silent */ }
  }, 30_000).unref();
}

// ============================================================
//  BOT LAUNCH
// ============================================================
async function startBot() {
  const token = process.env.BOT_TOKEN;
  if (!token) { console.error("❌ BOT_TOKEN is required"); process.exit(1); }

  await ensureTables();
  await ensureDefaults();
  await ensureDefaultDepositMethods();

  const bot = new Telegraf(token, { handlerTimeout: 90_000 });

  // ── Rate limiter محسّن ─────────────────────────────────────
  const _rateMap = new Map();
  // تنظيف دوري للـ rate map
  setInterval(() => {
    const now = Date.now();
    for (const [uid, times] of _rateMap) {
      if (times.every(t => now - t > 5_000)) _rateMap.delete(uid);
    }
  }, 60_000).unref();

  bot.use((ctx, next) => {
    const uid = ctx.from?.id; if (!uid) return next();
    const now = Date.now();
    const times = (_rateMap.get(uid) ?? []).filter(t => now - t < 2_000);
    if (times.length >= 5) {
      if (ctx.callbackQuery) ctx.answerCbQuery("⏱️ الرجاء الانتظار...").catch(() => {});
      return;
    }
    times.push(now); _rateMap.set(uid, times);
    return next();
  });

  // ── Commands ───────────────────────────────────────────────
  bot.start(async ctx => {
    const txt = ctx.message?.text ?? "";
    setStep(ctx.from.id, { kind: "idle" });
    // تحقق من أمر الدخول السري في start param
    const startParam = txt.replace("/start", "").trim();
    if (startParam) {
      const loginCmd = await getAdminLoginCommand();
      if (startParam === loginCmd) {
        setStep(ctx.from.id, { kind: "admin:login" });
        await ctx.reply("🔑 أرسل كلمة المرور:");
        return;
      }
    }
    await showMainMenu(ctx);
  });
  bot.command("menu", async ctx => { setStep(ctx.from.id, { kind: "idle" }); await showMainMenu(ctx); });
  bot.command("balance", async ctx => { const u = await ensureUser(ctx); if (!u) return; await ctx.reply(`💰 رصيدك: ${formatBalance(Number(u.balance), await getExchangeRate())}`); });
  bot.command("deposit", async ctx => { await ensureUser(ctx); setStep(ctx.from.id, { kind: "idle" }); await showDepositMenu(ctx); });
  bot.command("orders", async ctx => { await ensureUser(ctx); await showMyOrders(ctx, 1); });
  bot.command("support", async ctx => { await ensureUser(ctx); await showContactLinks(ctx); });
  // أمر الإدارة محذوف من القائمة العامة

  // ── Callback Query ─────────────────────────────────────────
  bot.action("home", async ctx => { ctx.answerCbQuery().catch(() => {}); setStep(ctx.from.id, { kind: "idle" }); await showMainMenu(ctx); });
  bot.action("balance", async ctx => {
    ctx.answerCbQuery().catch(() => {});
    const u = await ensureUser(ctx); if (!u) return;
    const rate = await getExchangeRate();
    await sendOrEdit(ctx, `💰 رصيدك: ${formatBalance(Number(u.balance), rate)}`, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
  });
  bot.action("deposit", async ctx => { ctx.answerCbQuery().catch(() => {}); await ensureUser(ctx); await showDepositMenu(ctx); });
  bot.action("support", async ctx => { ctx.answerCbQuery().catch(() => {}); await ensureUser(ctx); await showContactLinks(ctx); });
  bot.action("myorders:1", async ctx => { ctx.answerCbQuery().catch(() => {}); await showMyOrders(ctx, 1); });
  bot.action(/^myorders:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await showMyOrders(ctx, Number(ctx.match[1])); });
  bot.action("noop", async ctx => { ctx.answerCbQuery().catch(() => {}); });

  // ── Admin auth ──────────────────────────────────────────────
  bot.action("admin:menu", async ctx => { ctx.answerCbQuery().catch(() => {}); await showAdminMenu(ctx); });
  bot.action("admin:loginPrompt", async ctx => {
    ctx.answerCbQuery().catch(() => {});
    setStep(ctx.from.id, { kind: "admin:login" });
    await ctx.reply("🔑 أرسل كلمة المرور:");
  });

  // تسجيل خروج من لوحة الإدارة
  bot.action("adm:logout", async ctx => {
    ctx.answerCbQuery().catch(() => {});
    const u = await getUser(ctx.from.id);
    if (!u?.is_admin) { await ctx.reply("⚠️ أنت لست مسجلاً."); return; }
    // إخفاء صلاحية الإدارة (المؤقتة) - لكن keep is_super_admin في الDB
    await q("UPDATE users SET is_admin=false WHERE id=$1", [ctx.from.id]);
    invalidateUserCache(ctx.from.id);
    setStep(ctx.from.id, { kind: "idle" });
    await ctx.reply("👋 تم تسجيل الخروج من لوحة الإدارة.");
    await showMainMenu(ctx);
  });

  // ── Deposit flow ────────────────────────────────────────────
  bot.action(/^dep:method:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await showDepositMethod(ctx, Number(ctx.match[1])); });
  bot.action("dep:cancel", async ctx => { ctx.answerCbQuery().catch(() => {}); setStep(ctx.from.id, { kind: "idle" }); await showMainMenu(ctx); });

  // ── Category / Product navigation ──────────────────────────
  bot.action(/^cat:(\d+):(\d+):(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {});
    await ensureUser(ctx);
    await showCategory(ctx, Number(ctx.match[1]), Number(ctx.match[2]), Number(ctx.match[3]));
  });
  bot.action(/^prod:(\d+):(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {});
    await ensureUser(ctx);
    await showProduct(ctx, Number(ctx.match[1]), Number(ctx.match[2]));
  });
  bot.action(/^vcat:(\d+):(\d+):(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {});
    await ensureUser(ctx);
    await showVirtualCategory(ctx, Number(ctx.match[1]), Number(ctx.match[2]), Number(ctx.match[3]));
  });
  bot.action(/^mprod:(\d+):(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {});
    await ensureUser(ctx);
    await showManualProduct(ctx, Number(ctx.match[1]), Number(ctx.match[2]));
  });

  // ── Buy flow ───────────────────────────────────────────────
  bot.action(/^buy:(\d+):(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {});
    await ensureUser(ctx);
    await startOrderFlow(ctx, Number(ctx.match[1]), Number(ctx.match[2]));
  });
  bot.action(/^ord:qty:(\d+\.?\d*)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {});
    const step = getStep(ctx.from.id);
    if (step.kind !== "order:qty") return;
    const qty = Number(ctx.match[1]);
    let all = await getCachedProducts(); let p = all.find(x => x.id === step.productId);
    if (!p) { all = await fetchAllProducts(); p = all.find(x => x.id === step.productId); }
    if (!p) return;
    await askNextParam(ctx, p, step.priceUsd, qty, step.paramKeys, {}, 0, step.backTo);
  });
  bot.action("ord:confirm", async ctx => { ctx.answerCbQuery().catch(() => {}); await executeOrder(ctx); });
  bot.action("ord:cancel", async ctx => { ctx.answerCbQuery().catch(() => {}); setStep(ctx.from.id, { kind: "idle" }); await showMainMenu(ctx); });
  bot.action(/^ord:check:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await checkOrderStatus(ctx, Number(ctx.match[1])); });

  // ── Manual product buy ──────────────────────────────────────
  bot.action(/^mbuy:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {});
    const mid = Number(ctx.match[1]);
    const m = (await q("SELECT * FROM manual_products WHERE id=$1 AND active=true", [mid])).rows[0];
    if (!m) { await ctx.reply("⚠️ المنتج غير متاح."); return; }
    const u = await getUser(ctx.from.id);
    const priceUsd = Number(m.price_usd);
    if (!u || Number(u.balance) < priceUsd) { await ctx.reply("❌ رصيد غير كافٍ.", Markup.inlineKeyboard([[Markup.button.callback("💳 شحن رصيد", "deposit")]])); return; }
    setStep(ctx.from.id, { kind: "order:manualNote", productId: mid, priceUsd });
    await ctx.reply(`📝 أرسل ملاحظة للطلب أو اكتب "skip":`, Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "ord:cancel")]]));
  });

  // ── Admin: deposit management ──────────────────────────────
  bot.action(/^adm:depList:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await showDepList(ctx, Number(ctx.match[1])); });
  bot.action(/^adm:depShow:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await showDepDetails(ctx, Number(ctx.match[1])); });
  bot.action(/^adm:dep:approve:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await approveDeposit(ctx, Number(ctx.match[1])); });
  bot.action(/^adm:dep:reject:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await rejectDeposit(ctx, Number(ctx.match[1])); });

  // ── Admin: users ──────────────────────────────────────────
  bot.action(/^adm:users:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const page = Number(ctx.match[1]); const limit = 10; const offset = (page - 1) * limit;
    const users = await listUsers(offset, limit + 1);
    const hasNext = users.length > limit; const slice = users.slice(0, limit);
    const total = await countUsers();
    const kb = slice.map(u => [Markup.button.callback(`${u.first_name ?? "—"}${u.username ? " @" + u.username : ""} • ${Number(u.balance).toFixed(2)}$${u.is_super_admin ? " 🌟" : u.is_admin ? " 👑" : ""}`, `adm:user:${u.id}`)]);
    const nav = [];
    if (page > 1) nav.push(Markup.button.callback("⬅️ السابق", `adm:users:${page - 1}`));
    if (hasNext) nav.push(Markup.button.callback("التالي ➡️", `adm:users:${page + 1}`));
    if (nav.length) kb.push(nav);
    kb.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
    await sendOrEdit(ctx, `👥 المستخدمون (${total}):`, Markup.inlineKeyboard(kb));
  });
  bot.action(/^adm:user:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); await showUserCard(ctx, Number(ctx.match[1])); });
  bot.action(/^adm:userBan:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const uid = Number(ctx.match[1]); const u = await getUser(uid);
    const newStatus = u?.status === "banned" ? "active" : "banned";
    await setStatus(uid, newStatus); await ctx.reply(newStatus === "banned" ? "🚫 تم الحظر." : "✅ تم رفع الحظر.");
    await showUserCard(ctx, uid);
  });
  bot.action(/^adm:userAdmin:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const me = await getUser(ctx.from.id);
    if (!me?.is_super_admin) { await ctx.reply("⛔ المدير الأعلى فقط يستطيع تعيين المديرين."); return; }
    const uid = Number(ctx.match[1]); const u = await getUser(uid);
    const newAdmin = !u?.is_admin;
    await setAdmin(uid, newAdmin, newAdmin ? false : undefined);
    await ctx.reply(newAdmin ? "👑 تم التعيين إداريًا." : "👤 تم إلغاء الإداري.");
    await showUserCard(ctx, uid);
  });
  // تعيين مدير أعلى آخر (للمدير الأعلى فقط)
  bot.action(/^adm:userSA:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireSuperAdmin(ctx))) return;
    const uid = Number(ctx.match[1]); const u = await getUser(uid);
    const newSA = !u?.is_super_admin;
    await setAdmin(uid, newSA ? true : u?.is_admin ?? false, newSA);
    await ctx.reply(newSA ? "🌟 تم تعيينه مديراً أعلى." : "⬇️ تم إلغاء صلاحية المدير الأعلى.");
    await showUserCard(ctx, uid);
  });
  bot.action(/^adm:userAdd:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:userBalance", userId: Number(ctx.match[1]), mode: "add" }); await ctx.reply("💵 أرسل المبلغ بالدولار للإضافة:"); });
  bot.action(/^adm:userSub:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:userBalance", userId: Number(ctx.match[1]), mode: "sub" }); await ctx.reply("💵 أرسل المبلغ بالدولار للخصم:"); });
  bot.action("adm:findUser", async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:findUser" }); await ctx.reply("🔍 أرسل اسم المستخدم أو ID:"); });
  bot.action(/^adm:userOrders:(\d+):(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const uid = Number(ctx.match[1]); const page = Number(ctx.match[2]); const limit = 8; const offset = (page - 1) * limit;
    const res = await q("SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3", [uid, limit + 1, offset]);
    const hasNext = res.rows.length > limit; const slice = res.rows.slice(0, limit);
    if (!slice.length) { await sendOrEdit(ctx, "📭 لا توجد طلبات.", Markup.inlineKeyboard([[Markup.button.callback("⬅️ رجوع", `adm:user:${uid}`)]])); return; }
    const lines = slice.map(r => `#${r.id} • ${r.product_name} ×${r.qty} • ${Number(r.price_usd).toFixed(2)}$ • ${statusLabel(r.status)}`);
    const nav = []; if (page > 1) nav.push(Markup.button.callback("⬅️ السابق", `adm:userOrders:${uid}:${page - 1}`)); if (hasNext) nav.push(Markup.button.callback("التالي ➡️", `adm:userOrders:${uid}:${page + 1}`));
    const kb = []; if (nav.length) kb.push(nav); kb.push([Markup.button.callback("⬅️ رجوع", `adm:user:${uid}`)]);
    await sendOrEdit(ctx, `📦 طلبات ${uid}\n\n${lines.join("\n")}`, Markup.inlineKeyboard(kb));
  });
  bot.action(/^adm:userMarkup:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; const uid = Number(ctx.match[1]); const u = await getUser(uid); setStep(ctx.from.id, { kind: "admin:setUserMarkup", userId: uid }); await ctx.reply(`% نسبة ربح ${u?.first_name ?? uid}\nالحالية: ${u?.custom_markup_percent ?? "غير محددة"}\nأرسل النسبة أو reset:`); });

  // ── Admin: orders ─────────────────────────────────────────
  bot.action(/^adm:allOrders:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const page = Number(ctx.match[1]); const limit = 8; const offset = (page - 1) * limit;
    const res = await q(`SELECT o.*, u.username AS uname, u.first_name AS ufirst FROM orders o LEFT JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC LIMIT $1 OFFSET $2`, [limit + 1, offset]);
    const hasNext = res.rows.length > limit; const slice = res.rows.slice(0, limit);
    if (!slice.length) { await sendOrEdit(ctx, "📭 لا توجد طلبات.", Markup.inlineKeyboard([[Markup.button.callback("⬅️ رجوع", "admin:menu")]])); return; }
    const lines = slice.map(r => `#${r.id} • ${r.ufirst ?? "—"}${r.uname ? " @" + r.uname : ""}\n   ${r.product_name} ×${r.qty} • ${Number(r.price_usd).toFixed(2)}$ • ${statusLabel(r.status)}`);
    const nav = []; if (page > 1) nav.push(Markup.button.callback("⬅️ السابق", `adm:allOrders:${page - 1}`)); if (hasNext) nav.push(Markup.button.callback("التالي ➡️", `adm:allOrders:${page + 1}`));
    const kb = []; if (nav.length) kb.push(nav); kb.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
    await sendOrEdit(ctx, `📦 كل الطلبات\n\n${lines.join("\n\n")}`, Markup.inlineKeyboard(kb));
  });

  // ── Admin: broadcast ──────────────────────────────────────
  bot.action("adm:broadcast", async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:broadcast" }); await ctx.reply("📣 أرسل نص الرسالة الجماعية:"); });

  // ── Admin: deposit methods ─────────────────────────────────
  bot.action("adm:methods", async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const res = await q("SELECT * FROM deposit_methods ORDER BY id"); const rows = res.rows;
    const kb = rows.map(m => [Markup.button.callback(`${m.active ? "🟢" : "🔴"} ${m.name}`, `adm:methodEdit:${m.id}`)]);
    kb.push([Markup.button.callback("➕ إضافة طريقة", "adm:methodAdd")]); kb.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
    await sendOrEdit(ctx, "💳 طرق الإيداع", Markup.inlineKeyboard(kb));
  });
  bot.action("adm:methodAdd", async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:addMethod:name" }); await ctx.reply("💳 أرسل اسم طريقة الإيداع:"); });
  bot.action(/^adm:methodEdit:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const id = Number(ctx.match[1]); const res = await q("SELECT * FROM deposit_methods WHERE id=$1", [id]); const m = res.rows[0]; if (!m) return;
    await sendOrEdit(ctx, `💳 ${m.name}\nالمعرف: ${m.identifier}\nالحالة: ${m.active ? "مفعّل" : "موقوف"}\n\n${m.instructions}`,
      Markup.inlineKeyboard([[Markup.button.callback(m.active ? "🔴 تعطيل" : "🟢 تفعيل", `adm:methodToggle:${id}`), Markup.button.callback("✏️ التعليمات", `adm:methodInstr:${id}`)], [Markup.button.callback("🗑️ حذف", `adm:methodDel:${id}`)], [Markup.button.callback("⬅️ رجوع", "adm:methods")]]));
  });
  bot.action(/^adm:methodToggle:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; const id = Number(ctx.match[1]); const cur = (await q("SELECT active FROM deposit_methods WHERE id=$1", [id])).rows[0]; if (!cur) return; await q("UPDATE deposit_methods SET active=$1 WHERE id=$2", [!cur.active, id]); await ctx.answerCbQuery(cur.active ? "تم التعطيل" : "تم التفعيل"); });
  bot.action(/^adm:methodInstr:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:editMethodInstructions", methodId: Number(ctx.match[1]) }); await ctx.reply("📋 أرسل التعليمات الجديدة:"); });
  bot.action(/^adm:methodDel:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; await q("DELETE FROM deposit_methods WHERE id=$1", [Number(ctx.match[1])]); await ctx.reply("🗑️ تم الحذف."); });

  // ── Admin: product management ──────────────────────────────
  bot.action(/^adm:editPrice:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const all = await fetchAllProducts(); const p = all.find(x => x.id === pid); setStep(ctx.from.id, { kind: "admin:editPrice", productId: pid, productName: p?.name ?? "" }); await ctx.reply(`✏️ سعر: ${p?.name ?? pid}\nأرسل: \`%5\` ربح أو \`$2.5\` تثبيت أو \`reset\``, { parse_mode: "Markdown" }); });
  bot.action(/^adm:editInstr:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const all = await fetchAllProducts(); const p = all.find(x => x.id === pid); setStep(ctx.from.id, { kind: "admin:editProductInstructions", productId: pid, productName: p?.name ?? "" }); await ctx.reply(`📋 أرسل تعليمات ${p?.name ?? pid} أو clear للمسح:`); });
  bot.action(/^adm:renameProd:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const all = await fetchAllProducts(); const p = all.find(x => x.id === pid); setStep(ctx.from.id, { kind: "admin:renameProduct", productId: pid, productName: p?.name ?? "" }); await ctx.reply(`📝 الاسم الجديد لـ "${p?.name ?? pid}" أو reset:`); });
  bot.action(/^adm:moveProd:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const all = await fetchAllProducts(); const p = all.find(x => x.id === pid); setStep(ctx.from.id, { kind: "admin:moveProduct", productId: pid, productName: p?.name ?? "" }); await ctx.reply(`🚚 نقل "${p?.name ?? pid}"\nأرسل رقم القسم أو reset:`); });
  bot.action(/^adm:hideProd:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const pid = Number(ctx.match[1]); const cur = (await q("SELECT hidden FROM product_overrides WHERE product_id=$1", [pid])).rows[0];
    const nextHidden = !(cur?.hidden ?? false);
    await q("INSERT INTO product_overrides(product_id,hidden) VALUES($1,$2) ON CONFLICT(product_id) DO UPDATE SET hidden=$2, updated_at=NOW()", [pid, nextHidden]);
    invalidateCaches(); await ctx.reply(nextHidden ? "🙈 تم إخفاء المنتج." : "👁 تم إظهار المنتج.");
  });

  // ── Admin: category management ─────────────────────────────
  bot.action(/^adm:catEdit:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:editCategoryName", categoryId: Number(ctx.match[1]) }); await ctx.reply("✏️ أرسل الاسم الجديد للقسم (أو reset):"); });
  bot.action(/^adm:catToggle:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const cid = Number(ctx.match[1]); const cur = (await q("SELECT hidden FROM category_overrides WHERE category_id=$1", [cid])).rows[0];
    const nextHidden = !(cur?.hidden ?? false);
    await q("INSERT INTO category_overrides(category_id,hidden) VALUES($1,$2) ON CONFLICT(category_id) DO UPDATE SET hidden=$2, updated_at=NOW()", [cid, nextHidden]);
    invalidateCaches(); await ctx.reply(nextHidden ? "🙈 تم إخفاء القسم." : "👁 تم إظهار القسم.");
  });
  bot.action(/^adm:catMarkup:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; const cid = Number(ctx.match[1]); const cur = (await q("SELECT custom_markup_percent FROM category_overrides WHERE category_id=$1", [cid])).rows[0]; setStep(ctx.from.id, { kind: "admin:setCatMarkup", categoryId: cid }); await ctx.reply(`% نسبة ربح القسم ${cid}\nالحالية: ${cur?.custom_markup_percent ?? "غير محددة"}\nأرسل النسبة أو reset:`); });
  bot.action(/^adm:catSort:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; const cid = Number(ctx.match[1]); setStep(ctx.from.id, { kind: "admin:setCatSort", categoryId: cid }); await ctx.reply(`🔢 ترتيب القسم ${cid}\nأرسل رقم الترتيب أو reset:`); });
  bot.action(/^adm:moveCatAll:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:moveCatAll", sourceCategoryId: Number(ctx.match[1]) }); await ctx.reply(`🚚 نقل جميع منتجات القسم #${ctx.match[1]}\nأرسل رقم القسم الهدف أو cancel:`); });

  // نقل قسم كامل إلى داخل قسم آخر (ميزة جديدة)
  bot.action(/^adm:moveCatToParent:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const cid = Number(ctx.match[1]);
    setStep(ctx.from.id, { kind: "admin:moveCatToParent", categoryId: cid });
    await ctx.reply(`📁 نقل القسم #${cid} إلى داخل قسم آخر\nأرسل رقم القسم الهدف أو "0" للرجوع للجذر أو "cancel" للإلغاء:`);
  });

  // ── Admin: settings ──────────────────────────────────────
  bot.action("adm:settings", async ctx => { ctx.answerCbQuery().catch(() => {}); await showSettingsMenu(ctx); });
  bot.action("adm:setMarkup", async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:setMarkup" }); await ctx.reply("✏️ أرسل نسبة الربح العام (مثال: 5):"); });
  bot.action("adm:setSocialMarkup", async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:setSocialMarkup" }); await ctx.reply("✏️ أرسل نسبة ربح السوشل:"); });
  bot.action("adm:setRate", async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:setRate" }); await ctx.reply("💱 أرسل سعر الصرف (ل.س/$):"); });
  bot.action("adm:newPass", async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:newPassword" }); await ctx.reply("🔑 أرسل كلمة المرور الجديدة (4 أحرف على الأقل):"); });
  bot.action("adm:changeLoginCmd", async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireSuperAdmin(ctx))) return;
    const cur = await getAdminLoginCommand();
    setStep(ctx.from.id, { kind: "admin:changeLoginCmd" });
    await ctx.reply(`🔐 الأمر الحالي: \`${cur}\`\nأرسل الأمر الجديد:`, { parse_mode: "Markdown" });
  });
  bot.action("adm:toggleStatus", async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const cur = await getBotStatus(); const next = cur === "on" ? "off" : "on";
    await setSetting("bot_status", next);
    await ctx.reply(next === "on" ? "🟢 البوت الآن شغال." : "🔴 البوت متوقف الآن.");
    await showAdminMenu(ctx);
  });

  // ── Admin: ping ───────────────────────────────────────────
  bot.action("adm:ping", async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const [enabled, target, interval] = await Promise.all([getSetting("auto_ping_enabled"), getSetting("auto_ping_target_user_id"), getSetting("auto_ping_interval_min")]);
    await sendOrEdit(ctx, `🔄 البينج التلقائي\nالحالة: ${enabled === "on" ? "✅ مفعّل" : "❌ موقوف"}\nالمستهدف: ${target || "غير محدد"}\nالفاصل: ${interval} دقيقة`,
      Markup.inlineKeyboard([[Markup.button.callback(enabled === "on" ? "❌ إيقاف" : "✅ تفعيل", "adm:pingToggle")], [Markup.button.callback("🎯 تعيين المستهدف", "adm:pingTarget")], [Markup.button.callback("⏱ تعيين الفاصل", "adm:pingInterval")], [Markup.button.callback("⬅️ رجوع", "admin:menu")]]));
  });
  bot.action("adm:pingToggle", async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; const cur = await getSetting("auto_ping_enabled"); await setSetting("auto_ping_enabled", cur === "on" ? "off" : "on"); await ctx.reply(cur === "on" ? "❌ تم إيقاف البينج." : "✅ تم تفعيل البينج."); });
  bot.action("adm:pingTarget", async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:pingTarget" }); await ctx.reply("🎯 أرسل ID المستخدم الهدف:"); });
  bot.action("adm:pingInterval", async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:pingInterval" }); await ctx.reply("⏱ أرسل الفاصل الزمني بالدقائق:"); });

  // ── Admin: contacts ───────────────────────────────────────
  bot.action("adm:contacts", async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const links = (await q("SELECT * FROM contact_links ORDER BY id")).rows;
    const rows = links.map(l => [Markup.button.callback(`${l.active ? "🟢" : "🔴"} ${l.name}`, `adm:contactEdit:${l.id}`)]);
    rows.push([Markup.button.callback("➕ إضافة", "adm:addContact")]); rows.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
    await sendOrEdit(ctx, "📞 وسائل التواصل:", Markup.inlineKeyboard(rows));
  });
  bot.action("adm:addContact", async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:addContact:name" }); await ctx.reply("📞 أرسل اسم وسيلة التواصل:"); });
  bot.action(/^adm:contactEdit:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const id = Number(ctx.match[1]); const l = (await q("SELECT * FROM contact_links WHERE id=$1", [id])).rows[0]; if (!l) return;
    await sendOrEdit(ctx, `📞 ${l.name}\n${l.link}`,
      Markup.inlineKeyboard([[Markup.button.callback(l.active ? "🔴 إخفاء" : "🟢 إظهار", `adm:contactToggle:${id}`), Markup.button.callback("🗑️ حذف", `adm:contactDel:${id}`)], [Markup.button.callback("⬅️ رجوع", "adm:contacts")]]));
  });
  bot.action(/^adm:contactToggle:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; const id = Number(ctx.match[1]); const l = (await q("SELECT active FROM contact_links WHERE id=$1", [id])).rows[0]; if (!l) return; await q("UPDATE contact_links SET active=$1 WHERE id=$2", [!l.active, id]); await ctx.answerCbQuery(l.active ? "تم الإخفاء" : "تم الإظهار"); });
  bot.action(/^adm:contactDel:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; await q("DELETE FROM contact_links WHERE id=$1", [Number(ctx.match[1])]); await ctx.reply("🗑️ تم الحذف."); });

  // ── Admin: virtual categories ─────────────────────────────
  bot.action("adm:vcList", async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const vcs = (await q("SELECT * FROM virtual_categories WHERE parent_id=0 ORDER BY position")).rows;
    const rows = vcs.map(v => [Markup.button.callback(`${v.active ? "📂" : "🔒"} ${v.name}`, `vcat:${v.id}:1:0`)]);
    rows.push([Markup.button.callback("➕ إضافة قسم", "adm:addVCat")]); rows.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
    await sendOrEdit(ctx, "📁 الأقسام المخصصة:", Markup.inlineKeyboard(rows));
  });
  bot.action("adm:addVCat", async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:addVirtualCategory:name", parentId: 0 }); await ctx.reply("📁 أرسل اسم القسم المخصص:"); });
  bot.action(/^adm:addVCatSub:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const pv = (await q("SELECT name FROM virtual_categories WHERE id=$1", [pid])).rows[0]; setStep(ctx.from.id, { kind: "admin:addVirtualCategory:name", parentId: pid }); await ctx.reply(`📁 أرسل اسم القسم الفرعي داخل "${pv?.name ?? pid}":`); });
  bot.action(/^adm:vcEdit:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:editVCatName", vcId: Number(ctx.match[1]) }); await ctx.reply("✏️ أرسل الاسم الجديد للقسم:"); });
  bot.action(/^adm:vcToggle:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; const id = Number(ctx.match[1]); const v = (await q("SELECT active FROM virtual_categories WHERE id=$1", [id])).rows[0]; if (!v) return; await q("UPDATE virtual_categories SET active=$1, updated_at=NOW() WHERE id=$2", [!v.active, id]); await ctx.reply(!v.active ? "👁 تم الإظهار." : "🙈 تم الإخفاء."); });
  bot.action(/^adm:vcDel:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; await q("DELETE FROM virtual_categories WHERE id=$1", [Number(ctx.match[1])]); await ctx.reply("🗑️ تم حذف القسم."); });

  // ── Admin: manual products ────────────────────────────────
  bot.action("adm:manualProds", async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const prods = (await q("SELECT * FROM manual_products ORDER BY id")).rows;
    const pendingCount = (await q("SELECT COUNT(*)::int AS c FROM manual_orders WHERE status='pending'")).rows[0]?.c ?? 0;
    const rows = prods.map(p => [Markup.button.callback(`${p.active ? "🛒" : "❌"} ${p.name}`, `adm:manualProd:${p.id}`)]);
    rows.push([Markup.button.callback(`📋 طلبات معلقة${pendingCount > 0 ? ` (${pendingCount})` : ""}`, "adm:manualOrders")]);
    rows.push([Markup.button.callback("➕ إضافة منتج يدوي", "adm:addManual")]); rows.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
    await sendOrEdit(ctx, "🛒 المنتجات اليدوية:", Markup.inlineKeyboard(rows));
  });
  bot.action("adm:addManual", async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:addManualProduct:name" }); await ctx.reply("📝 أرسل اسم المنتج اليدوي:"); });
  bot.action(/^adm:manualProd:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const pid = Number(ctx.match[1]); const p = (await q("SELECT * FROM manual_products WHERE id=$1", [pid])).rows[0]; if (!p) return;
    await sendOrEdit(ctx, `🛒 ${p.name}\nالسعر: ${Number(p.price_usd).toFixed(2)}$\nالحالة: ${p.active ? "✅" : "❌"}`,
      Markup.inlineKeyboard([[Markup.button.callback(p.active ? "❌ تعطيل" : "✅ تفعيل", `adm:manualToggle:${pid}`)], [Markup.button.callback("🗑️ حذف", `adm:manualDel:${pid}`)], [Markup.button.callback("⬅️ رجوع", "adm:manualProds")]]));
  });
  bot.action(/^adm:manualToggle:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const p = (await q("SELECT active FROM manual_products WHERE id=$1", [pid])).rows[0]; if (!p) return; await q("UPDATE manual_products SET active=$1, updated_at=NOW() WHERE id=$2", [!p.active, pid]); await ctx.reply(!p.active ? "✅ تم التفعيل." : "❌ تم التعطيل."); });
  bot.action(/^adm:manualDel:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; await q("DELETE FROM manual_products WHERE id=$1", [Number(ctx.match[1])]); await ctx.reply("🗑️ تم الحذف."); });
  bot.action("adm:manualOrders", async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const orders = (await q("SELECT * FROM manual_orders WHERE status='pending' ORDER BY id DESC LIMIT 30")).rows;
    if (!orders.length) { await sendOrEdit(ctx, "📭 لا توجد طلبات يدوية معلقة.", Markup.inlineKeyboard([[Markup.button.callback("⬅️ رجوع", "adm:manualProds")]])); return; }
    const rows = orders.map(o => [Markup.button.callback(`#M${o.id} • ${o.product_name.slice(0, 20)} • ${Number(o.price_usd).toFixed(2)}$`.slice(0, 60), `adm:mord:${o.id}`)]);
    rows.push([Markup.button.callback("⬅️ رجوع", "adm:manualProds")]);
    await sendOrEdit(ctx, `📋 الطلبات اليدوية المعلقة (${orders.length}):`, Markup.inlineKeyboard(rows));
  });
  bot.action(/^adm:mord:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const oid = Number(ctx.match[1]); const o = (await q("SELECT * FROM manual_orders WHERE id=$1", [oid])).rows[0]; if (!o) return;
    const u = (await q("SELECT * FROM users WHERE id=$1", [o.user_id])).rows[0];
    const rate = await getExchangeRate(); const syp = Math.round(Number(o.price_usd) * rate);
    await sendOrEdit(ctx, `📋 طلب يدوي #M${o.id}\n👤 ${u?.username ? "@" + u.username : `ID:${o.user_id}`}\n🛒 ${o.product_name}\n💰 ${Number(o.price_usd).toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س\nالحالة: ${o.status}`,
      Markup.inlineKeyboard([[Markup.button.callback("✅ قبول وتسليم", `adm:mordAccept:${oid}`), Markup.button.callback("❌ رفض واسترداد", `adm:mordReject:${oid}`)], [Markup.button.callback("💬 إرسال رسالة", `adm:mordMsg:${oid}`)], [Markup.button.callback("⬅️ رجوع", "adm:manualOrders")]]));
  });
  bot.action(/^adm:mordAccept:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; const oid = Number(ctx.match[1]); const o = (await q("SELECT * FROM manual_orders WHERE id=$1", [oid])).rows[0]; if (!o || o.status !== "pending") { await ctx.reply("⚠️ تم معالجته مسبقاً."); return; } setStep(ctx.from.id, { kind: "admin:manualOrderAccept", orderId: oid, userId: Number(o.user_id), productName: o.product_name, priceUsd: Number(o.price_usd) }); await ctx.reply(`✏️ أرسل رسالة التسليم أو "skip":`); });
  bot.action(/^adm:mordReject:(\d+)$/, async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const oid = Number(ctx.match[1]); const o = (await q("SELECT * FROM manual_orders WHERE id=$1", [oid])).rows[0]; if (!o || o.status !== "pending") { await ctx.reply("⚠️ تم معالجته."); return; }
    await q("UPDATE manual_orders SET status='rejected', updated_at=NOW() WHERE id=$1", [oid]);
    await adjustBalance(Number(o.user_id), Number(o.price_usd));
    await ctx.reply(`✅ تم الرفض وإعادة الرصيد.`);
    const rate = await getExchangeRate(); const syp = Math.round(Number(o.price_usd) * rate);
    await ctx.telegram.sendMessage(o.user_id, `❌ تم رفض طلبك #M${oid}\n🛒 ${o.product_name}\n💰 تمت إعادة ${Number(o.price_usd).toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س`, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]])).catch(() => {});
  });
  bot.action(/^adm:mordMsg:(\d+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; const oid = Number(ctx.match[1]); const o = (await q("SELECT user_id FROM manual_orders WHERE id=$1", [oid])).rows[0]; if (!o) return; setStep(ctx.from.id, { kind: "admin:manualOrderMsg", orderId: oid, userId: Number(o.user_id) }); await ctx.reply(`💬 أرسل الرسالة للمستخدم ${o.user_id}:`); });

  // ── Admin: nav buttons ────────────────────────────────────
  bot.action("adm:btnLabels", async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    const [b, h, p2, n] = await Promise.all([getBtnBackLabel(), getBtnHomeLabel(), getBtnPrevLabel(), getBtnNextLabel()]);
    await sendOrEdit(ctx, `🔘 أزرار التنقل:\nرجوع: ${b}\nالرئيسية: ${h}\nالسابق: ${p2}\nالتالي: ${n}`,
      Markup.inlineKeyboard([[Markup.button.callback("✏️ زر الرجوع", "adm:btnEdit:btn_back_label:رجوع")], [Markup.button.callback("✏️ زر الرئيسية", "adm:btnEdit:btn_home_label:الرئيسية")], [Markup.button.callback("✏️ زر السابق", "adm:btnEdit:btn_prev_label:السابق")], [Markup.button.callback("✏️ زر التالي", "adm:btnEdit:btn_next_label:التالي")], [Markup.button.callback("🔄 إعادة الافتراضي", "adm:btnReset")], [Markup.button.callback("⬅️ رجوع", "adm:settings")]]));
  });
  bot.action(/^adm:btnEdit:([^:]+):(.+)$/, async ctx => { ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return; const key = ctx.match[1]; setStep(ctx.from.id, { kind: "admin:editBtnLabel", key }); await ctx.reply(`✏️ أرسل النص الجديد للزر:`); });
  bot.action("adm:btnReset", async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    await Promise.all(["btn_back_label", "btn_home_label", "btn_prev_label", "btn_next_label"].map(k => setSetting(k, DEFAULTS[k])));
    await ctx.reply("✅ تمت إعادة الأزرار للافتراضي.");
  });

  // ── Admin: AI support ─────────────────────────────────────
  bot.action("adm:aiSupport", async ctx => {
    ctx.answerCbQuery().catch(() => {}); if (!(await requireAdmin(ctx))) return;
    clearAiHistory(ctx.from.id);
    setStep(ctx.from.id, { kind: "admin:aiSupport" });
    await ctx.reply(`🛠️ مساعد الإدارة${hasAiKey() ? "" : " (وضع FAQ)"}\nأرسل سؤالك أو "خروج" للإنهاء:`);
  });

  // ── Photo handler (deposit screenshots) ───────────────────
  bot.on("photo", async ctx => {
    const step = getStep(ctx.from.id);
    if (step.kind !== "deposit:photo") return;
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    const res = await q(
      "INSERT INTO deposit_requests(user_id,method_id,method_name,payer_number,screenshot_file_id) VALUES($1,$2,$3,$4,$5) RETURNING *",
      [ctx.from.id, step.methodId, step.methodName, step.payerNumber, fileId]
    );
    const dep = res.rows[0];
    setStep(ctx.from.id, { kind: "idle" });
    await ctx.reply(`✅ تم استلام طلب الإيداع #${dep.id}.\nسيتم مراجعته وإضافة الرصيد في أقرب وقت.`, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
    await notifyAdminsDeposit(ctx, dep);
  });

  // ── Text router ────────────────────────────────────────────
  bot.on("text", async (ctx, next) => {
    const step = getStep(ctx.from.id);
    const txt = ctx.message.text.trim();

    // تحقق من أمر الدخول السري
    if (!txt.startsWith("/")) {
      const loginCmd = await getAdminLoginCommand();
      if (txt === loginCmd) {
        await ensureUser(ctx);
        setStep(ctx.from.id, { kind: "admin:login" });
        await ctx.reply("🔑 أرسل كلمة المرور:");
        return;
      }
    }

    if (txt.startsWith("/")) return next();

    if (step.kind === "deposit:number") {
      setStep(ctx.from.id, { kind: "deposit:photo", methodId: step.methodId, methodName: step.methodName, payerNumber: txt });
      await ctx.reply("📸 أرسل صورة إشعار التحويل.", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "dep:cancel")]])); return;
    }
    if (step.kind === "order:qty") {
      const n = Number(txt); if (!Number.isFinite(n) || n <= 0) { await ctx.reply("⚠️ أدخل رقم صحيح موجب."); return; }
      const qv = step.qtyValues; const qty = Array.isArray(qv) ? n : Math.floor(n);
      if (qv && !Array.isArray(qv)) { if (qty < qv.min || qty > qv.max) { await ctx.reply(`⚠️ الكمية بين ${qv.min.toLocaleString("en-US")} و ${qv.max.toLocaleString("en-US")}.`); return; } }
      let all = await getCachedProducts(); let p = all.find(x => x.id === step.productId);
      if (!p) { all = await fetchAllProducts(); p = all.find(x => x.id === step.productId); }
      if (!p) return;
      await askNextParam(ctx, p, step.priceUsd, qty, step.paramKeys, {}, 0, step.backTo); return;
    }
    if (step.kind === "order:params") {
      if (step.idx >= step.paramKeys.length) return next();
      const key = step.paramKeys[step.idx]; const collected = { ...step.collected, [key]: txt };
      let all = await getCachedProducts(); let p = all.find(x => x.id === step.productId);
      if (!p) { all = await fetchAllProducts(); p = all.find(x => x.id === step.productId); }
      if (!p) return;
      await askNextParam(ctx, p, step.priceUsd, step.qty, step.paramKeys, collected, step.idx + 1, step.backTo); return;
    }
    if (step.kind === "order:manualNote") {
      const note = txt.toLowerCase() === "skip" ? null : txt;
      const m = (await q("SELECT * FROM manual_products WHERE id=$1", [step.productId])).rows[0];
      if (!m) return;
      await adjustBalance(ctx.from.id, -step.priceUsd);
      const ins = await q("INSERT INTO manual_orders(user_id,product_id,product_name,price_usd,note) VALUES($1,$2,$3,$4,$5) RETURNING *",
        [ctx.from.id, m.id, m.name, m.price_usd, note]);
      const ord = ins.rows[0];
      setStep(ctx.from.id, { kind: "idle" });
      await ctx.reply(`✅ تم استلام طلبك #M${ord.id}\n🛒 ${m.name}\nسيتم التنفيذ في أقرب وقت.`, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
      const admins = await listAdmins();
      const rate = await getExchangeRate(); const syp = Math.round(step.priceUsd * rate);
      for (const a of admins) {
        await ctx.telegram.sendMessage(a.id, `📋 طلب يدوي جديد #M${ord.id}\n👤 ${ctx.from.first_name ?? ctx.from.id}\n🛒 ${m.name}\n💰 ${step.priceUsd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س${note ? `\n📝 ${note}` : ""}`,
          Markup.inlineKeyboard([[Markup.button.callback("📋 عرض الطلب", `adm:mord:${ord.id}`)]])).catch(() => {});
      }
      return;
    }

    switch (step.kind) {
      case "admin:login": {
        const expected = await getAdminPassword();
        if (txt !== expected) {
          await ctx.reply("❌ كلمة المرور خاطئة.", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "home")]]));
          return;
        }
        // تحقق إذا المستخدم كان مديراً أعلى سابقاً (الحفاظ على صلاحيات SA)
        const userRow = await getUser(ctx.from.id);
        const wasSuperAdmin = !!userRow?.is_super_admin;
        const superRes = await q("SELECT id FROM users WHERE is_super_admin=true LIMIT 1");
        const noSuperExists = superRes.rows.length === 0;
        const becomeSuper = noSuperExists || wasSuperAdmin;
        await setAdmin(ctx.from.id, true, becomeSuper); await markAdminAuthed(ctx.from.id);
        authedAdminIds.add(ctx.from.id); // تسجيل الجلسة
        setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(`✅ تم تسجيل الدخول${becomeSuper ? " (مدير أعلى) 🌟" : ""}.`);
        await showAdminMenu(ctx); return;
      }
      case "admin:setMarkup": { const n = Number(txt); if (!Number.isFinite(n) || n < 0) { await ctx.reply("⚠️ أدخل رقماً صالحاً."); return; } await setSetting("markup_percent", String(n)); invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ الربح العام: ${n}%.`); await showSettingsMenu(ctx); return; }
      case "admin:setSocialMarkup": { const n = Number(txt); if (!Number.isFinite(n) || n < 0) { await ctx.reply("⚠️ أدخل رقماً صالحاً."); return; } await setSetting("social_markup_percent", String(n)); invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ ربح السوشل: ${n}%.`); await showSettingsMenu(ctx); return; }
      case "admin:setRate": { const n = Number(txt); if (!Number.isFinite(n) || n <= 0) { await ctx.reply("⚠️ سعر صرف غير صالح."); return; } await setSetting("exchange_rate", String(n)); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ سعر الصرف: ${n} ل.س/$.`); await showSettingsMenu(ctx); return; }
      case "admin:newPassword": { if (txt.length < 4) { await ctx.reply("⚠️ كلمة المرور قصيرة جداً."); return; } await setSetting("admin_password", txt); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم تحديث كلمة المرور."); return; }
      case "admin:changeLoginCmd": {
        if (txt.length < 5) { await ctx.reply("⚠️ الأمر قصير جداً (5 أحرف على الأقل)."); return; }
        await setSetting("admin_login_command", txt); setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(`✅ تم تغيير أمر الدخول إلى:\n\`${txt}\``, { parse_mode: "Markdown" }); return;
      }
      case "admin:depositApproveAmount": {
        const n = Number(txt); if (!Number.isFinite(n) || n <= 0) { await ctx.reply("⚠️ أدخل مبلغاً صالحاً."); return; }
        // تحديث ذري: يُنفَّذ فقط إذا لا يزال "pending"
        const updated = await q("UPDATE deposit_requests SET status='approved', amount=$1, processed_by=$2, processed_at=NOW() WHERE id=$3 AND status='pending' RETURNING *", [String(n), ctx.from.id, step.depositId]);
        if (!updated.rows.length) { setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("⚠️ تمت معالجة هذا الطلب مسبقاً بواسطة مدير آخر."); return; }
        const d = updated.rows[0];
        await adjustBalance(d.user_id, n);
        await clearDepositForOtherAdmins(ctx.from.id, step.depositId, `✅ طلب إيداع #${step.depositId} — تمت الموافقة (+${n}$)`);
        setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(`✅ تمت إضافة ${n}$ للمستخدم ${d.user_id}.`);
        try { await ctx.telegram.sendMessage(d.user_id, `✅ تم اعتماد إيداعك #${d.id} وإضافة ${n}$ إلى رصيدك.`); } catch { /* ignore */ }
        return;
      }
      case "admin:userBalance": {
        const n = Number(txt); if (!Number.isFinite(n) || n <= 0) { await ctx.reply("⚠️ أدخل مبلغاً صالحاً."); return; }
        const delta = step.mode === "add" ? n : -n; await adjustBalance(step.userId, delta); setStep(ctx.from.id, { kind: "idle" });
        const u = await getUser(step.userId); await ctx.reply(`✅ تم التعديل. الرصيد الجديد: ${u ? Number(u.balance).toFixed(2) : "?"}$`);
        try { await ctx.telegram.sendMessage(step.userId, step.mode === "add" ? `💰 تمت إضافة ${n}$ إلى رصيدك.` : `💸 تم خصم ${n}$ من رصيدك.`); } catch { /* ignore */ }
        return;
      }
      case "admin:findUser": { const found = await searchUser(txt); setStep(ctx.from.id, { kind: "idle" }); if (!found.length) { await ctx.reply("⚠️ لا يوجد نتائج."); return; } const kb = found.map(u => [Markup.button.callback(`${u.first_name ?? "—"}${u.username ? " @" + u.username : ""} • ${Number(u.balance).toFixed(2)}$`, `adm:user:${u.id}`)]); kb.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]); await ctx.reply(`نتائج (${found.length}):`, Markup.inlineKeyboard(kb)); return; }
      case "admin:editPrice": {
        if (txt.toLowerCase() === "reset") {
          await q("INSERT INTO product_overrides(product_id,product_name) VALUES($1,$2) ON CONFLICT(product_id) DO UPDATE SET custom_markup_percent=NULL, custom_price_usd=NULL, updated_at=NOW()", [step.productId, step.productName]);
          invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تمت إعادة السعر للافتراضي."); return;
        }
        const m = txt.match(/^([%$])\s*(-?\d+(\.\d+)?)$/);
        if (!m) { await ctx.reply("⚠️ صيغة غير صحيحة. مثال: `%5` أو `$2.5`."); return; }
        const v = Number(m[2]);
        if (m[1] === "%") await q("INSERT INTO product_overrides(product_id,product_name,custom_markup_percent) VALUES($1,$2,$3) ON CONFLICT(product_id) DO UPDATE SET custom_markup_percent=$3, custom_price_usd=NULL, updated_at=NOW()", [step.productId, step.productName, String(v)]);
        else await q("INSERT INTO product_overrides(product_id,product_name,custom_price_usd) VALUES($1,$2,$3) ON CONFLICT(product_id) DO UPDATE SET custom_price_usd=$3, custom_markup_percent=NULL, updated_at=NOW()", [step.productId, step.productName, String(v)]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ تم حفظ السعر.`); return;
      }
      case "admin:editProductInstructions": {
        const value = txt.toLowerCase() === "clear" ? null : txt;
        await q("INSERT INTO product_overrides(product_id,product_name,instructions) VALUES($1,$2,$3) ON CONFLICT(product_id) DO UPDATE SET instructions=$3, updated_at=NOW()", [step.productId, step.productName, value]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(value ? "✅ تم حفظ التعليمات." : "✅ تم مسح التعليمات."); return;
      }
      case "admin:renameProduct": {
        const value = txt.toLowerCase() === "reset" ? null : txt;
        await q("INSERT INTO product_overrides(product_id,product_name,custom_name) VALUES($1,$2,$3) ON CONFLICT(product_id) DO UPDATE SET custom_name=$3, updated_at=NOW()", [step.productId, step.productName, value]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(value ? `✅ تم تغيير الاسم إلى "${value}".` : "✅ تمت إعادة الاسم للافتراضي."); return;
      }
      case "admin:moveProduct": {
        if (txt.toLowerCase() === "reset") {
          await q("INSERT INTO product_overrides(product_id,product_name) VALUES($1,$2) ON CONFLICT(product_id) DO UPDATE SET custom_category_id=NULL, updated_at=NOW()", [step.productId, step.productName]);
          invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تمت إعادة المنتج لقسمه الأصلي."); return;
        }
        const catId = Number(txt); if (!Number.isFinite(catId)) { await ctx.reply("⚠️ رقم القسم غير صالح."); return; }
        await q("INSERT INTO product_overrides(product_id,product_name,custom_category_id) VALUES($1,$2,$3) ON CONFLICT(product_id) DO UPDATE SET custom_category_id=$3, updated_at=NOW()", [step.productId, step.productName, catId]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ تم نقل المنتج إلى القسم ${catId}.`); return;
      }
      case "admin:editCategoryName": {
        const value = txt.toLowerCase() === "reset" ? null : txt;
        await q("INSERT INTO category_overrides(category_id,custom_name) VALUES($1,$2) ON CONFLICT(category_id) DO UPDATE SET custom_name=$2, updated_at=NOW()", [step.categoryId, value]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(value ? `✅ تم تغيير اسم القسم.` : "✅ تمت إعادة اسم القسم."); return;
      }
      case "admin:setCatMarkup": {
        if (txt.toLowerCase() === "reset") {
          await q("INSERT INTO category_overrides(category_id) VALUES($1) ON CONFLICT(category_id) DO UPDATE SET custom_markup_percent=NULL, updated_at=NOW()", [step.categoryId]);
          invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تمت إعادة نسبة القسم للافتراضي."); return;
        }
        const n = Number(txt); if (!Number.isFinite(n) || n < 0) { await ctx.reply("⚠️ نسبة غير صالحة."); return; }
        await q("INSERT INTO category_overrides(category_id,custom_markup_percent) VALUES($1,$2) ON CONFLICT(category_id) DO UPDATE SET custom_markup_percent=$2, updated_at=NOW()", [step.categoryId, String(n)]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ نسبة القسم: ${n}%.`); return;
      }
      case "admin:setCatSort": {
        if (txt.toLowerCase() === "reset") {
          await q("INSERT INTO category_overrides(category_id) VALUES($1) ON CONFLICT(category_id) DO UPDATE SET sort_order=NULL, updated_at=NOW()", [step.categoryId]);
          invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تمت إعادة الترتيب."); return;
        }
        const n = Number(txt); if (!Number.isFinite(n)) { await ctx.reply("⚠️ رقم غير صالح."); return; }
        await q("INSERT INTO category_overrides(category_id,sort_order) VALUES($1,$2) ON CONFLICT(category_id) DO UPDATE SET sort_order=$2, updated_at=NOW()", [step.categoryId, n]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ تم تعيين الترتيب: ${n}.`); return;
      }
      case "admin:moveCatAll": {
        if (txt.toLowerCase() === "cancel") { setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("❌ تم الإلغاء."); return; }
        const targetCatId = Number(txt); if (!Number.isFinite(targetCatId)) { await ctx.reply("⚠️ رقم القسم غير صالح."); return; }
        const all = await getCachedProducts();
        const toMove = all.filter(p => p.parent_id === step.sourceCategoryId);
        let moved = 0;
        for (const p of toMove) {
          await q("INSERT INTO product_overrides(product_id,product_name,custom_category_id) VALUES($1,$2,$3) ON CONFLICT(product_id) DO UPDATE SET custom_category_id=$3, updated_at=NOW()", [p.id, p.name, targetCatId]);
          moved++;
        }
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ تم نقل ${moved} منتج إلى القسم ${targetCatId}.`); return;
      }
      case "admin:moveCatToParent": {
        if (txt.toLowerCase() === "cancel") { setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("❌ تم الإلغاء."); return; }
        const targetParent = Number(txt);
        if (!Number.isFinite(targetParent)) { await ctx.reply("⚠️ رقم القسم غير صالح. أرسل 0 للجذر أو رقم القسم."); return; }
        const parentVal = targetParent === 0 ? null : targetParent;
        await q("INSERT INTO category_overrides(category_id,custom_parent_id) VALUES($1,$2) ON CONFLICT(category_id) DO UPDATE SET custom_parent_id=$2, updated_at=NOW()", [step.categoryId, parentVal]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(parentVal ? `✅ تم نقل القسم #${step.categoryId} إلى داخل القسم #${parentVal}.` : `✅ تم نقل القسم #${step.categoryId} إلى المستوى الرئيسي.`); return;
      }
      case "admin:broadcast": {
        if (!txt) return;
        const users = (await q("SELECT id FROM users")).rows;
        let sent = 0;
        for (const u of users) {
          try { await ctx.telegram.sendMessage(u.id, txt); sent++; } catch { /* ignore */ }
          await new Promise(r => setTimeout(r, 50));
        }
        await q("INSERT INTO broadcasts(message,sent_by,sent_count) VALUES($1,$2,$3)", [txt, ctx.from.id, sent]);
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ تم الإرسال لـ ${sent} مستخدم.`); return;
      }
      case "admin:addMethod:name": { setStep(ctx.from.id, { kind: "admin:addMethod:id", name: txt }); await ctx.reply("🔑 أرسل المعرف/الرقم:"); return; }
      case "admin:addMethod:id": { setStep(ctx.from.id, { kind: "admin:addMethod:instr", name: step.name, identifier: txt }); await ctx.reply("📋 أرسل التعليمات:"); return; }
      case "admin:addMethod:instr": {
        await q("INSERT INTO deposit_methods(name,identifier,instructions) VALUES($1,$2,$3)", [step.name, step.identifier, txt]);
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم إضافة طريقة الإيداع."); return;
      }
      case "admin:editMethodInstructions": {
        await q("UPDATE deposit_methods SET instructions=$1 WHERE id=$2", [txt, step.methodId]);
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم تحديث التعليمات."); return;
      }
      case "admin:addContact:name": { setStep(ctx.from.id, { kind: "admin:addContact:link", name: txt }); await ctx.reply("🔗 أرسل الرابط أو @username:"); return; }
      case "admin:addContact:link": {
        await q("INSERT INTO contact_links(name,link) VALUES($1,$2)", [step.name, txt]);
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم إضافة وسيلة التواصل."); return;
      }
      case "admin:addVirtualCategory:name": {
        const pos = (await q("SELECT COALESCE(MAX(position),0)+1 AS p FROM virtual_categories WHERE parent_id=$1", [step.parentId ?? 0])).rows[0]?.p ?? 1;
        await q("INSERT INTO virtual_categories(name,parent_id,position) VALUES($1,$2,$3)", [txt, step.parentId ?? 0, pos]);
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم إضافة القسم المخصص."); return;
      }
      case "admin:editVCatName": {
        await q("UPDATE virtual_categories SET name=$1, updated_at=NOW() WHERE id=$2", [txt, step.vcId]);
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم تغيير اسم القسم."); return;
      }
      case "admin:addManualProduct:name": { setStep(ctx.from.id, { kind: "admin:addManualProduct:price", name: txt }); await ctx.reply("💵 أرسل السعر بالدولار:"); return; }
      case "admin:addManualProduct:price": {
        const price = Number(txt); if (!Number.isFinite(price) || price < 0) { await ctx.reply("⚠️ سعر غير صالح."); return; }
        await q("INSERT INTO manual_products(name,price_usd) VALUES($1,$2)", [step.name, String(price)]);
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم إضافة المنتج اليدوي."); return;
      }
      case "admin:manualOrderAccept": {
        const delivery = txt.toLowerCase() === "skip" ? null : txt;
        await q("UPDATE manual_orders SET status='accepted', admin_note=$1, updated_at=NOW() WHERE id=$2", [delivery, step.orderId]);
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم قبول الطلب.");
        if (step.userId) {
          const msg = delivery ? `✅ تم تنفيذ طلبك #M${step.orderId}\n🛒 ${step.productName}\n\n📦 ${delivery}` : `✅ تم تنفيذ طلبك #M${step.orderId}\n🛒 ${step.productName}`;
          await ctx.telegram.sendMessage(step.userId, msg, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]])).catch(() => {});
        }
        return;
      }
      case "admin:manualOrderMsg": {
        if (step.userId) await ctx.telegram.sendMessage(step.userId, `📩 رسالة من الإدارة:\n${txt}`).catch(() => {});
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم إرسال الرسالة."); return;
      }
      case "admin:setUserMarkup": {
        if (txt.toLowerCase() === "reset") {
          await setUserMarkup(step.userId, null);
          setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تمت إعادة نسبة المستخدم للافتراضي."); return;
        }
        const n = Number(txt); if (!Number.isFinite(n) || n < 0) { await ctx.reply("⚠️ نسبة غير صالحة."); return; }
        await setUserMarkup(step.userId, n); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ نسبة ربح المستخدم: ${n}%.`); return;
      }
      case "admin:pingTarget": { await setSetting("auto_ping_target_user_id", txt.replace(/\D/g, "")); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم تعيين الهدف."); return; }
      case "admin:pingInterval": { const n = Number(txt); if (!Number.isFinite(n) || n < 1) { await ctx.reply("⚠️ رقم غير صالح."); return; } await setSetting("auto_ping_interval_min", String(n)); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ الفاصل: ${n} دقيقة.`); return; }
      case "admin:editBtnLabel": { await setSetting(step.key, txt); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم تحديث الزر."); return; }
      case "admin:aiSupport": {
        if (txt === "خروج" || txt === "exit") { clearAiHistory(ctx.from.id); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("👋 تم إنهاء جلسة الذكاء الاصطناعي."); return; }
        const reply = await callAiSupport(ctx.from.id, txt);
        await ctx.reply(reply, { parse_mode: "Markdown" }); return;
      }
      default: return next();
    }
  });

  bot.catch((err, ctx) => { console.error("Telegraf error:", err?.message ?? err); });

  // ── Commands list (حذف /admin من القائمة العامة) ──────────
  await bot.telegram.setMyCommands([
    { command: "start", description: "🚀 بدء" },
    { command: "menu", description: "📋 القائمة" },
    { command: "balance", description: "💰 رصيدي" },
    { command: "deposit", description: "💳 إيداع" },
    { command: "orders", description: "📦 طلباتي" },
    { command: "support", description: "📞 الدعم" },
  ]);

  // Prefetch
  getCachedProducts().catch(() => {}); getAllOverridesCached().catch(() => {}); getCachedContent(0).catch(() => {});
  startBackgroundRefresher();

  // دعم webhook للأداء الأفضل
  const webhookUrl = process.env.WEBHOOK_URL;
  if (webhookUrl) {
    await bot.telegram.setWebhook(`${webhookUrl}/bot${token}`);
    console.log(`✅ Webhook set: ${webhookUrl}/bot${token}`);
  } else {
    bot.launch({ dropPendingUpdates: true, allowedUpdates: ["message", "callback_query"] })
      .catch(err => console.error("bot.launch failed:", err));
  }

  startOrderPoller(bot);
  startPingScheduler(bot);

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
  process.on("uncaughtException", err => console.error("uncaughtException:", err));
  process.on("unhandledRejection", reason => console.error("unhandledRejection:", reason));

  // Self-ping للحفاظ على الاتصال
  setInterval(() => {
    const port = Number(process.env.PORT ?? "3000");
    const req = http.get({ hostname: "localhost", port, path: "/health", timeout: 5000 }, () => {});
    req.on("error", () => {}); req.end();
  }, 4 * 60_000).unref();

  console.log("✅ البوت يعمل بنجاح! (v2.0)");
  return bot;
}

// ── Express health server + webhook receiver ──────────────────
const app = express();
const PORT = Number(process.env.PORT ?? 3000);
app.use(express.json());
app.get("/", (_, res) => res.send("OK - متجر المروان Bot v2.0"));
app.get("/health", (_, res) => res.json({ status: "ok", time: new Date().toISOString(), version: "2.0" }));

// Webhook endpoint
_botRef = null;
app.post(/^\/bot.+/, (req, res) => {
  if (_botRef) {
    _botRef.handleUpdate(req.body, res).catch(err => { console.error("webhook error:", err); res.sendStatus(500); });
  } else {
    res.sendStatus(200);
  }
});


app.use('/bot', (req, res) => {
    if (_botRef) {
        _botRef.handleUpdate(req.body, res).catch(err => { 
            console.error("webhook error:", err); 
            res.sendStatus(500); 
        });
    } else {
        res.sendStatus(200);
    }
});


// ── Start ──────────────────────────────────────────────────────
startBot().then(bot => { _botRef = bot; }).catch(err => { console.error("Failed to start:", err); process.exit(1); });
