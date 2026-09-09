// ============================================================
//  متجر المروان — بوت تيليجرام v4.4 (تدقيق وإصلاح شامل)
//  إضافات: API ثاني، منتجات يدوية متكاملة، أقسام يدوية، ردود متعددة
// ============================================================
"use strict";

const { Telegraf, Markup } = require("telegraf");
const { Pool } = require("pg");
const axios = require("axios");
const express = require("express");
const http = require("http");
const https = require("https");
const crypto = require("crypto");

// ── ENV check ──────────────────────────────────────────────────────────
if (!process.env.DATABASE_URL) {
console.error("❌ DATABASE_URL is required");
process.exit(1);
}

// ── DB pool محسّن ──────────────────────────────────────────────────────
const _dbUrl = process.env.DATABASE_URL;
const _needSSL =
  _dbUrl.includes("railway") ||
  _dbUrl.includes("neon") ||
  _dbUrl.includes("supabase");
const pool = new Pool({
connectionString: _dbUrl,
ssl: _needSSL ? { rejectUnauthorized: false } : false,
max: 10,
min: 2,
idleTimeoutMillis: 30_000,
connectionTimeoutMillis: 5_000,
statement_timeout: 15_000,
});

async function q(text, params = []) {
const client = await pool.connect();
try { return await client.query(text, params); }
finally { client.release(); }
}

// ── Create tables if not exist ─────────────────────────────────────────
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
image_file_id TEXT,
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
api_source_id INTEGER,
cancel_enabled BOOLEAN NOT NULL DEFAULT false,
cancel_seconds INTEGER,
cancel_url TEXT,
cancel_available_at TIMESTAMPTZ,
refunded_at TIMESTAMPTZ,
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
api_source_id INTEGER,
external_id TEXT,
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
CREATE TABLE IF NOT EXISTS manual_categories (
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
manual_category_id INTEGER,
price_usd NUMERIC(14,4) NOT NULL DEFAULT 0,
markup_percent NUMERIC(6,2),
description TEXT,
instructions TEXT,
image_file_id TEXT,
stock_qty INTEGER NOT NULL DEFAULT -1,
api_product_id INTEGER,
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
CREATE TABLE IF NOT EXISTS manual_order_replies (
id SERIAL PRIMARY KEY,
order_id INTEGER NOT NULL REFERENCES manual_orders(id) ON DELETE CASCADE,
admin_id BIGINT,
message TEXT NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS api_sources (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
base_url TEXT NOT NULL,
api_token TEXT NOT NULL,
markup_percent NUMERIC(6,2) NOT NULL DEFAULT 3,
active BOOLEAN NOT NULL DEFAULT true,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS api_source_products (
id SERIAL PRIMARY KEY,
api_source_id INTEGER NOT NULL REFERENCES api_sources(id) ON DELETE CASCADE,
external_id TEXT NOT NULL,
name TEXT NOT NULL,
category_name TEXT,
category_id INTEGER,
parent_id INTEGER DEFAULT 0,
price NUMERIC(14,4),
base_price NUMERIC(14,4),
rate NUMERIC(14,4),
qty_values JSONB,
params JSONB,
notes TEXT,
available BOOLEAN DEFAULT true,
cancel_enabled BOOLEAN NOT NULL DEFAULT false,
cancel_seconds INTEGER,
cancel_url TEXT,
admin_deleted BOOLEAN NOT NULL DEFAULT false,
admin_hidden BOOLEAN NOT NULL DEFAULT false,
custom_name TEXT,
updated_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE(api_source_id, external_id)
);
CREATE TABLE IF NOT EXISTS api_source_categories (
id SERIAL PRIMARY KEY,
api_source_id INTEGER NOT NULL REFERENCES api_sources(id) ON DELETE CASCADE,
external_id TEXT NOT NULL,
name TEXT NOT NULL,
parent_id INTEGER DEFAULT 0,
custom_parent_id INTEGER,
admin_deleted BOOLEAN NOT NULL DEFAULT false,
active BOOLEAN NOT NULL DEFAULT true,
updated_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE(api_source_id, external_id)
);
CREATE TABLE IF NOT EXISTS product_catalog_cache (
cache_key TEXT PRIMARY KEY,
payload JSONB NOT NULL,
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS processed_telegram_updates (
update_id BIGINT PRIMARY KEY,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`);

// ── Migration: add columns if not exist ──
const migrations = [
"ALTER TABLE category_overrides ADD COLUMN IF NOT EXISTS custom_parent_id INTEGER",
"ALTER TABLE deposit_methods ADD COLUMN IF NOT EXISTS image_file_id TEXT",
"ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_session_active BOOLEAN NOT NULL DEFAULT false",
"ALTER TABLE users ADD COLUMN IF NOT EXISTS can_delete_products BOOLEAN NOT NULL DEFAULT false",
"ALTER TABLE product_overrides ADD COLUMN IF NOT EXISTS api_source_id INTEGER",
"ALTER TABLE product_overrides ADD COLUMN IF NOT EXISTS external_id TEXT",
"ALTER TABLE orders ADD COLUMN IF NOT EXISTS api_source_id INTEGER",
"ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancel_enabled BOOLEAN NOT NULL DEFAULT false",
"ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancel_seconds INTEGER",
"ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancel_url TEXT",
"ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancel_available_at TIMESTAMPTZ",
"ALTER TABLE orders ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ",
"ALTER TABLE manual_products ADD COLUMN IF NOT EXISTS manual_category_id INTEGER",
"ALTER TABLE manual_products ADD COLUMN IF NOT EXISTS description TEXT",
"ALTER TABLE manual_products ADD COLUMN IF NOT EXISTS image_file_id TEXT",
"ALTER TABLE manual_products ADD COLUMN IF NOT EXISTS stock_qty INTEGER NOT NULL DEFAULT -1",
"ALTER TABLE manual_products ADD COLUMN IF NOT EXISTS markup_percent NUMERIC(6,2)",
"ALTER TABLE api_sources ADD COLUMN IF NOT EXISTS api_token TEXT",
"ALTER TABLE api_sources ADD COLUMN IF NOT EXISTS markup_percent NUMERIC(6,2)",
"ALTER TABLE api_sources ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true",
"ALTER TABLE api_sources ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()",
"UPDATE api_sources SET api_token='' WHERE api_token IS NULL",
"UPDATE api_sources SET markup_percent=3 WHERE markup_percent IS NULL",
"UPDATE api_sources SET active=true WHERE active IS NULL",
"UPDATE api_sources SET updated_at=NOW() WHERE updated_at IS NULL",
"ALTER TABLE api_sources ALTER COLUMN api_token SET DEFAULT ''",
"ALTER TABLE api_sources ALTER COLUMN api_token SET NOT NULL",
"ALTER TABLE api_sources ALTER COLUMN markup_percent SET DEFAULT 3",
"ALTER TABLE api_sources ALTER COLUMN markup_percent SET NOT NULL",
"ALTER TABLE api_sources ALTER COLUMN active SET DEFAULT true",
"ALTER TABLE api_sources ALTER COLUMN active SET NOT NULL",
"ALTER TABLE api_source_products ADD COLUMN IF NOT EXISTS cancel_enabled BOOLEAN NOT NULL DEFAULT false",
"ALTER TABLE api_source_products ADD COLUMN IF NOT EXISTS cancel_seconds INTEGER",
"ALTER TABLE api_source_products ADD COLUMN IF NOT EXISTS cancel_url TEXT",
"ALTER TABLE api_source_products ADD COLUMN IF NOT EXISTS admin_deleted BOOLEAN NOT NULL DEFAULT false",
"ALTER TABLE api_source_products ADD COLUMN IF NOT EXISTS admin_hidden BOOLEAN NOT NULL DEFAULT false",
"ALTER TABLE api_source_products ADD COLUMN IF NOT EXISTS custom_name TEXT",
"ALTER TABLE api_source_categories ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true",
"ALTER TABLE api_source_categories ADD COLUMN IF NOT EXISTS custom_parent_id INTEGER",
"ALTER TABLE api_source_categories ADD COLUMN IF NOT EXISTS admin_deleted BOOLEAN NOT NULL DEFAULT false",
"CREATE INDEX IF NOT EXISTS idx_api_source_products_category_available ON api_source_products(category_id, available)",
"CREATE INDEX IF NOT EXISTS idx_api_source_products_source_available ON api_source_products(api_source_id, available)",
"CREATE INDEX IF NOT EXISTS idx_api_source_products_source_category_available ON api_source_products(api_source_id, category_id, available)",
"CREATE INDEX IF NOT EXISTS idx_api_source_categories_parent_active ON api_source_categories(api_source_id, parent_id, active)",
];
for (const mig of migrations) {
try { await q(mig); }
catch (e) { console.error("DB migration failed:", mig, e.message); }
}
}

// ============================================================
//  SETTINGS
// ============================================================
const settingsCache = new Map();
let _settingsCacheExpiry = 0;
const SETTINGS_TTL = 2 * 60_000; // 2 دقيقة

const DEFAULTS = {
markup_percent: "3",
exchange_rate: "132",
bot_status: "on",
currency_label: "ل.س",
excluded_category_ids: "6,81,561",
excluded_product_keywords: "سيرتل كاش,سيريتل كاش,syriatel cash,mtn كاش,mtn cash,ام تي ان كاش",
social_markup_percent: "3",
social_keywords: "سوشل,social,تواصل اجتماعي,اجتماعي,انستغرام,instagram,تيك توك,tiktok,فيسبوك,facebook,تويتر,twitter,يوتيوب,youtube,تليجرام,telegram,سناب,snap",
ai_keywords: "ذكاء اصطناعي,chatgpt,gpt,openai,claude,gemini,midjourney,perplexity,ai ",
// Configure these in Railway Variables. Do not keep credentials in source code.
admin_password: process.env.ADMIN_PASSWORD ?? "",
admin_login_command: process.env.ADMIN_LOGIN_COMMAND ?? "",
auto_ping_enabled: "off",
auto_ping_interval_min: "5",
auto_ping_target_user_id: "",
auto_ping_last_sent: "0",
  deposit_admin_notifications: "off",
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
// تصحيح تسمية زر الرئيسية القديمة دون التأثير على باقي الإعدادات.
if (settingsCache.has("btn_home_label") && /عد\s+الرئيسية|الرئيسيه/i.test(String(settingsCache.get("btn_home_label")))) {
  await q("UPDATE bot_settings SET value=$1 WHERE key=$2", [DEFAULTS.btn_home_label, "btn_home_label"]);
  settingsCache.set("btn_home_label", DEFAULTS.btn_home_label);
}
for (const [k, v] of Object.entries(DEFAULTS)) {
if (!settingsCache.has(k)) {
await q("INSERT INTO bot_settings(key,value) VALUES($1,$2) ON CONFLICT DO NOTHING", [k, v]);
settingsCache.set(k, v);
}
}
}

async function getSetting(key) {
if (!settingsCache.has(key) || Date.now() > _settingsCacheExpiry) {
await loadAllSettings();
_settingsCacheExpiry = Date.now() + SETTINGS_TTL;
}
return settingsCache.get(key) ?? DEFAULTS[key] ?? "";
}

async function setSetting(key, value) {
settingsCache.set(key, value);
_settingsCacheExpiry = Date.now() + SETTINGS_TTL;
await q("INSERT INTO bot_settings(key,value,updated_at) VALUES($1,$2,NOW()) ON CONFLICT(key) DO UPDATE SET value=$2, updated_at=NOW()", [key, value]);
}

async function getMarkupPercent() { const n = Number(await getSetting("markup_percent")); return Number.isFinite(n) ? n : 3; }
async function getExchangeRate() { const n = Number(await getSetting("exchange_rate")); return Number.isFinite(n) && n > 0 ? n : 132; }
async function getBotStatus() { return getSetting("bot_status"); }
async function getExcludedKeywords() { const v = await getSetting("excluded_product_keywords"); return v.split(",").map(k => k.trim().toLowerCase()).filter(Boolean); }
async function getSocialKeywords() { const v = await getSetting("social_keywords"); return v.split(",").map(k => k.trim().toLowerCase()).filter(Boolean); }
async function getSocialMarkupPercent() { const n = Number(await getSetting("social_markup_percent")); return Number.isFinite(n) ? n : 3; }
async function getSocialMinQty() { const n = Number(await getSetting("social_min_qty")); return Number.isFinite(n) && n > 0 ? n : null; }
async function getSocialMaxQty() { const n = Number(await getSetting("social_max_qty")); return Number.isFinite(n) && n > 0 ? n : null; }
async function getAdminPassword() { return getSetting("admin_password"); }
async function getAdminLoginCommand() { return getSetting("admin_login_command"); }
async function getBtnBackLabel() { return getSetting("btn_back_label"); }
async function getBtnHomeLabel() {
  const label = await getSetting("btn_home_label");
  // إصلاح أي قيمة قديمة/خاطئة مثل "عد الرئيسية" من الإصدارات السابقة.
  if (!label || /عد\s+الرئيسية|الرئيسيه/i.test(String(label)) || !String(label).includes("الرئيسية")) {
    return DEFAULTS.btn_home_label;
  }
  return String(label).trim();
}
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
const USER_CACHE_TTL = 60_000;
function userCacheGet(id) { const hit = userCache.get(id); if (hit && hit.exp > Date.now()) return hit.u; return undefined; }
function userCacheSet(id, u) { userCache.set(id, { u, exp: Date.now() + USER_CACHE_TTL }); }
function invalidateUserCache(id) { userCache.delete(id); }

async function upsertUser(u) {
const res = await q(`
INSERT INTO users(id,username,first_name,last_name)
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

async function setAdminSession(id, active) {
invalidateUserCache(id);
await q("UPDATE users SET admin_session_active=$1 WHERE id=$2", [active, id]);
}

async function isAdminSessionActive(id) {
const u = await getUser(id);
return !!u?.admin_session_active && !!u?.is_admin;
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
const res = await q(`SELECT * FROM users WHERE id=$1 OR username ILIKE $2 OR first_name ILIKE $2 LIMIT 20`, [Number.isFinite(idNum) && idNum > 0 ? idNum : 0, `%${u}%`]);
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
const res = await q("SELECT * FROM product_overrides WHERE product_id = ANY($1)", [productIds]);
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

// ── استخراج المبلغ من نص بصيغ مختلفة ─────────────────────────────
function extractAmountFromText(txt, exchangeRate) {
if (!txt) return null;
const clean = txt.replace(/,/g, "").trim();

const isSYP = /ل\.س|ليرة|ليره|ليرات|سوري|سورية|syp|ريال|ريالات|ريوال/i.test(clean);
const isUSD = /\$|usd|دولار|دولارات/i.test(clean);

const numMatch = clean.match(/(\d+\.?\d*)/);
if (!numMatch) return null;

const num = parseFloat(numMatch[1]);
if (!Number.isFinite(num) || num <= 0) return null;

if (isSYP) {
const rate = Number(exchangeRate) || 132;
return num / rate;
}
return num;
}

// ============================================================
//  ORANOS API (المصدر الأساسي)
// ============================================================
const ORANOS_BASE = process.env.ORANOS_API_BASE ?? "https://api.oranosmarket.com";
const ORANOS_TOKEN = process.env.ORANOS_API_TOKEN ?? "";

const oranosClient = axios.create({
baseURL: ORANOS_BASE,
timeout: 12000,
headers: { "api-token": ORANOS_TOKEN, Accept: "application/json" },
httpAgent:  new http.Agent({ keepAlive: true, maxSockets: 20 }),
httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 20 }),
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
const data = res.data;
if (Array.isArray(data)) return data;
if (Array.isArray(data?.products)) return data.products;
if (Array.isArray(data?.data)) return data.data;
if (Array.isArray(data?.result)) return data.result;
return [];
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
search.set("orders", String(orderId));
if (byUuid) search.set("uuid", "1");
const res = await wrapRequest(() => oranosClient.get(`/client/api/check?${search.toString()}`));
return res.data;
}

function extractDeliveredCode(resp) {
const rawD = resp?.data;
const records = Array.isArray(rawD) ? rawD : (rawD != null ? [rawD] : []);
if (!records.length && !resp?.replay_api && !resp?.response && !resp?.result && !resp?.note && !resp?.notes) return null;
const candidates = [];
for (const d of records) {
if (Array.isArray(d?.delivery)) candidates.push(d.delivery);
else if (d?.delivery != null) candidates.push(d.delivery);
if (d?.data) candidates.push(d.data);
if (d?.replay_api) candidates.push(d.replay_api);
if (d?.response) candidates.push(d.response);
if (d?.result) candidates.push(d.result);
if (d?.note) candidates.push(d.note);
if (d?.notes) candidates.push(d.notes);
}
if (resp?.replay_api) candidates.push(resp.replay_api);
if (resp?.response) candidates.push(resp.response);
if (resp?.result) candidates.push(resp.result);
if (resp?.note) candidates.push(resp.note);
if (resp?.notes) candidates.push(resp.notes);
const lines = [];
const seen = new Set();
const visit = v => {
if (v == null) return;
if (typeof v === "string" && v.trim()) { const x = v.trim(); if (!seen.has(x)) { seen.add(x); lines.push(x); } }
else if (typeof v === "number") { const x = String(v); if (!seen.has(x)) { seen.add(x); lines.push(x); } }
else if (Array.isArray(v)) v.forEach(visit);
else if (typeof v === "object") {
for (const [k, val] of Object.entries(v)) {
if (val == null) continue;
if (typeof val === "object") visit(val);
else { const x = `${k}: ${val}`; if (!seen.has(x)) { seen.add(x); lines.push(x); } }
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
//  API SOURCES MANAGER (المصدر الثاني+)
// ============================================================
const apiSourceClients = new Map();

function getApiSourceClient(source) {
const key = source.id;
if (apiSourceClients.has(key)) return apiSourceClients.get(key);
const client = axios.create({
baseURL: String(source.base_url || "").replace(/\/+$/, ""),
timeout: 15000,
headers: {
"api-token": source.api_token,
Accept: "application/json",
"Content-Type": "application/json",
},
httpAgent: new http.Agent({ keepAlive: true, maxSockets: 20 }),
httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 20 }),
});
apiSourceClients.set(key, client);
return client;
}

function unwrapApiList(data, keys = ["products", "data", "result", "items"]) {
if (Array.isArray(data)) return data;
for (const key of keys) {
const value = data?.[key];
if (Array.isArray(value)) return value;
if (value && typeof value === "object") {
for (const nestedKey of keys) if (Array.isArray(value[nestedKey])) return value[nestedKey];
}
}
return [];
}

function isApi2ProductLike(value) {
return !!value && typeof value === "object" && (
value.product_id != null || value.price != null || value.params != null ||
value.qty_values != null || value.product_type != null || value.available != null
);
}

function normalizeApi2Content(data) {
const root = data?.data && typeof data.data === "object" && !Array.isArray(data.data) ? data.data : data;
let categories = [];
let products = [];

const categoryCandidates = [root?.categories, root?.category, root?.children];
for (const candidate of categoryCandidates) {
if (Array.isArray(candidate)) categories.push(...candidate);
}

const productCandidates = [root?.products, root?.items, root?.result];
for (const candidate of productCandidates) {
if (Array.isArray(candidate)) products.push(...candidate);
}
if (Array.isArray(root?.data)) {
if (root.data.some(isApi2ProductLike)) products.push(...root.data);
else categories.push(...root.data);
}
if (Array.isArray(data)) {
if (data.some(isApi2ProductLike)) products.push(...data);
else categories.push(...data);
}

// Remove duplicates while preserving the provider's order.
const uniq = (arr, keyFn) => {
const seen = new Set(); const out = [];
for (const item of arr) {
const key = keyFn(item);
if (key == null || seen.has(key)) continue;
seen.add(key); out.push(item);
}
return out;
};
return {
categories: uniq(categories, c => String(c?.id ?? c?.category_id ?? c?.categoryId ?? "")).filter(c => c?.id != null || c?.category_id != null || c?.categoryId != null),
products: uniq(products, x => String(x?.id ?? x?.product_id ?? "")).filter(p => p?.id != null || p?.product_id != null),
};
}

function flattenApiCategories(items, parentExternalId = 0, out = []) {
for (const c of Array.isArray(items) ? items : []) {
const id = c?.id ?? c?.category_id ?? c?.categoryId;
if (id == null) continue;
const parentId = c?.parent_id ?? c?.parentId ?? c?.parent?.id ?? parentExternalId ?? 0;
const row = { ...c, id, parent_id: parentId ?? 0, name: c?.name ?? c?.title ?? `Category ${id}` };
out.push(row);
const children = c?.categories ?? c?.children ?? c?.subcategories ?? [];
if (Array.isArray(children) && children.length) flattenApiCategories(children, id, out);
}
return out;
}

function normalizeProviderQty(raw) {
if (raw == null || raw === "") return null;
if (Array.isArray(raw)) {
  const values = raw.map(v => Number(v)).filter(Number.isFinite);
  return values.length ? values : null;
}
if (typeof raw === "number") return Number.isFinite(raw) && raw > 0 ? [raw] : null;
if (typeof raw === "string") {
  const text = raw.trim();
  if (!text) return null;
  try { return normalizeProviderQty(JSON.parse(text)); } catch {}
  const range = text.match(/^(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)$/);
  if (range) return { min: Number(range[1]), max: Number(range[2]) };
  const n = Number(text.replace(/,/g, ""));
  return Number.isFinite(n) && n > 0 ? [n] : null;
}
if (typeof raw === "object") {
  const min = raw.min ?? raw.minimum ?? raw.min_qty ?? raw.min_quantity ?? raw.min_order ?? raw.min_order_qty ?? raw.min_order_quantity ?? raw.min_quantity ?? raw.purchase_limit ?? raw.from;
  const max = raw.max ?? raw.maximum ?? raw.max_qty ?? raw.max_quantity ?? raw.max_order ?? raw.max_order_qty ?? raw.max_order_quantity ?? raw.max_quantity ?? raw.max_purchase ?? raw.purchase_limit ?? raw.to;
  if (min != null || max != null) {
    const a = Number(min); const b = Number(max ?? min);
    if (Number.isFinite(a) && Number.isFinite(b) && a > 0 && b > 0) return { min: Math.min(a,b), max: Math.max(a,b) };
  }
  for (const key of ["values", "options", "quantities", "qty_values", "quantity"]) {
    if (raw[key] != null) { const v = normalizeProviderQty(raw[key]); if (v) return v; }
  }
}
return null;
}

function normalizeProviderParams(raw) {
if (Array.isArray(raw)) return raw.map(v => typeof v === "string" ? v : (v?.name ?? v?.key ?? v?.id ?? v)).filter(v => v != null).map(String);
if (raw && typeof raw === "object") return Object.keys(raw);
return [];
}

async function fetchApiSourceProducts(source) {
const client = getApiSourceClient(source);
const res = await client.get("/api/v2/products");
return unwrapApiList(res.data, ["products", "data", "result", "items"]).map(p => ({
...p,
id: p?.id ?? p?.product_id,
name: p?.name ?? p?.title ?? `Product ${p?.id ?? p?.product_id ?? ""}`,
category_id: p?.category_id ?? p?.categoryId ?? p?.category?.id ?? null,
category_name: p?.category_name ?? p?.category?.name ?? null,
price: p?.price ?? p?.base_price ?? null,
base_price: p?.base_price ?? p?.price ?? null,
params: normalizeProviderParams(p?.params ?? p?.parameters ?? p?.fields ?? p?.requirements),
qty_values: normalizeProviderQty(
  (p?.min_order != null || p?.max_order != null || p?.min_order_qty != null || p?.max_order_qty != null || p?.min_order_quantity != null || p?.max_order_quantity != null || p?.min_quantity != null || p?.max_quantity != null || p?.min_qty != null || p?.max_qty != null || p?.purchase_limit != null || p?.max_purchase != null)
    ? {
        min: p?.min_order ?? p?.min_order_qty ?? p?.min_order_quantity ?? p?.min_quantity ?? p?.min_qty ?? (p?.max_purchase != null || p?.purchase_limit != null || p?.max_order != null || p?.max_qty != null ? 1 : null),
        max: p?.max_order ?? p?.max_order_qty ?? p?.max_order_quantity ?? p?.max_quantity ?? p?.max_qty ?? p?.max_purchase ?? p?.purchase_limit,
      }
    : (p?.qty_values ?? p?.quantity ?? p?.qty ?? p?.quantities ?? p?.quantity_range)
),
available: p?.available !== false && p?.active !== false && p?.enabled !== false,
}));
}

async function fetchApiSourceContent(source, parentId = 0) {
const client = getApiSourceClient(source);
const res = await client.get(`/api/v2/content/${encodeURIComponent(parentId)}`);
return normalizeApi2Content(res.data);
}

async function placeApiSourceOrder(source, productId, params, orderUuid, qty = 1) {
const client = getApiSourceClient(source);
const numericProductId = Number(productId);
const body = {
product_id: Number.isFinite(numericProductId) ? numericProductId : productId,
qty: Number.isFinite(Number(qty)) && Number(qty) > 0 ? Number(qty) : 1,
order_uuid: orderUuid,
params: params && typeof params === "object" ? params : {},
};
try {
const res = await client.post("/api/v2/order", body);
return res.data;
} catch (err) {
if (err?.response?.data) return err.response.data;
return { status: "ERR", message: err?.message || "Network error" };
}
}

async function checkApiSourceOrder(source, orderId, byUuid = false) {
const client = getApiSourceClient(source);
try {
const query = new URLSearchParams();
query.set("orders", String(orderId));
if (byUuid) query.set("uuid", "1");
const res = await client.get(`/api/v2/check?${query.toString()}`);
return res.data;
} catch (err) {
if (err?.response?.data) return err.response.data;
return { status: "ERR", message: err?.message || "Network error" };
}
}

function extractCancelMeta(product) {
const urlCandidates = [
product?.cancel_url, product?.cancel_link, product?.cancellation_url, product?.cancellation_link,
product?.cancel?.url, product?.cancel?.link, product?.cancellation?.url, product?.cancellation?.link,
typeof product?.cancel === "string" ? product.cancel : null,
typeof product?.cancellation === "string" ? product.cancellation : null,
product?.links?.cancel, product?.actions?.cancel?.url,
];
const cancelUrl = urlCandidates.find(v => typeof v === "string" && (v.startsWith("http://") || v.startsWith("https://") || v.startsWith("/"))) ?? null;
const secondsCandidates = [
product?.cancel_seconds, product?.cancellation_seconds, product?.cancel_after_seconds,
product?.cancel_duration, product?.cancel_time, product?.cancellation_time,
product?.cancel?.seconds, product?.cancel?.after_seconds, product?.cancel?.after,
product?.cancellation?.seconds, product?.cancellation?.after_seconds, product?.cancellation?.after,
];
const rawSeconds = secondsCandidates.find(v => v != null && v !== "");
const parseDurationSeconds = value => {
if (value == null || value === "") return null;
if (typeof value === "number") return Number.isFinite(value) && value > 0 ? Math.floor(value) : null;
const text = String(value).trim().toLowerCase();
if (/^\d+(?:\.\d+)?$/.test(text)) return Math.floor(Number(text));
const hm = text.match(/^(?:(\d+)\s*(?:h|hr|hour|hours|ساعة|ساعات)\s*)?(?:(\d+)\s*(?:m|min|minute|minutes|دقيقة|دقائق)\s*)?(?:(\d+)\s*(?:s|sec|second|seconds|ثانية|ثواني))?$/i);
if (hm && (hm[1] || hm[2] || hm[3])) return Number(hm[1]||0)*3600 + Number(hm[2]||0)*60 + Number(hm[3]||0);
const clock = text.match(/^(\d+):([0-5]\d)(?::([0-5]\d))?$/);
if (clock) return Number(clock[1])*60 + Number(clock[2]) + Number(clock[3]||0);
return null;
};
const seconds = parseDurationSeconds(rawSeconds);
return { cancelUrl, cancelSeconds: seconds };
}

async function collectApi2Catalog(source) {
const queue = [0];
const visited = new Set();
const allCategories = [];
const allProducts = [];
const categorySeen = new Set();
const productSeen = new Set();
let calls = 0;
const MAX_CATEGORIES = 200;

while (queue.length && calls < MAX_CATEGORIES) {
  const parentId = queue.shift();
  const key = String(parentId ?? 0);
  if (visited.has(key)) continue;
  visited.add(key);
  calls++;

  const content = await fetchApiSourceContent(source, parentId);
  for (const c of content.categories || []) {
    const id = c?.id ?? c?.category_id ?? c?.categoryId;
    if (id == null) continue;
    const idKey = String(id);
    const parent = c?.parent_id ?? c?.parentId ?? c?.parent?.id ?? parentId ?? 0;
    const row = { ...c, id, parent_id: parent ?? 0, name: c?.name ?? c?.title ?? `Category ${id}` };
    if (!categorySeen.has(idKey)) {
      categorySeen.add(idKey);
      allCategories.push(row);
    }
    if (!visited.has(idKey)) queue.push(id);
  }
  for (const pr of content.products || []) {
    const id = pr?.id ?? pr?.product_id;
    if (id == null) continue;
    const idKey = String(id);
    if (!productSeen.has(idKey)) {
      productSeen.add(idKey);
      allProducts.push(pr);
    }
  }
}

// The complete product endpoint is authoritative for products. It also covers
// providers that do not expose products from each category page.
let endpointProducts = [];
try { endpointProducts = await fetchApiSourceProducts(source); } catch (e) {
  if (!allProducts.length) throw e;
}
for (const pr of endpointProducts) {
  const id = pr?.id ?? pr?.product_id;
  if (id == null) continue;
  const idKey = String(id);
  if (!productSeen.has(idKey)) { productSeen.add(idKey); allProducts.push(pr); }
}
return { categories: allCategories, products: allProducts };
}

async function syncApiSource(sourceId) {
const src = (await q("SELECT * FROM api_sources WHERE id=$1", [sourceId])).rows[0];
if (!src) throw new Error("Product source not found");

const catalog = await collectApi2Catalog(src);
const categories = catalog.categories || [];
const products = catalog.products || [];
const categoryMap = new Map();
const pendingCategories = [...categories];
const seenCategories = new Set();
let guard = 0;

while (pendingCategories.length && guard++ < categories.length * 3 + 20) {
  let progressed = false;
  for (let i = pendingCategories.length - 1; i >= 0; i--) {
    const c = pendingCategories[i];
    const extId = String(c.id);
    if (seenCategories.has(extId)) { pendingCategories.splice(i, 1); continue; }
    const parentExt = c.parent_id == null || String(c.parent_id) === "0" ? "0" : String(c.parent_id);
    if (parentExt !== "0" && !categoryMap.has(parentExt)) continue;
    const parentLocalId = parentExt === "0" ? 0 : categoryMap.get(parentExt);
    const existing = (await q("SELECT id FROM api_source_categories WHERE api_source_id=$1 AND external_id=$2 LIMIT 1", [src.id, extId])).rows[0];
    let localId;
    if (existing) {
      const r = await q("UPDATE api_source_categories SET name=$1,parent_id=$2,active=CASE WHEN admin_deleted THEN false ELSE true END,updated_at=NOW() WHERE id=$3 RETURNING id", [c.name, parentLocalId, existing.id]);
      localId = r.rows[0].id;
    } else {
      const r = await q("INSERT INTO api_source_categories(api_source_id,external_id,name,parent_id,custom_parent_id,active) VALUES($1,$2,$3,$4,NULL,true) RETURNING id", [src.id, extId, c.name, parentLocalId]);
      localId = r.rows[0].id;
    }
    categoryMap.set(extId, localId);
    seenCategories.add(extId);
    pendingCategories.splice(i, 1);
    progressed = true;
  }
  if (!progressed) break;
}

// Unknown parents are kept at root rather than dropping the category.
for (const c of pendingCategories) {
  const extId = String(c.id);
  if (seenCategories.has(extId)) continue;
  const existing = (await q("SELECT id FROM api_source_categories WHERE api_source_id=$1 AND external_id=$2 LIMIT 1", [src.id, extId])).rows[0];
  let localId;
  if (existing) {
    const r = await q("UPDATE api_source_categories SET name=$1,parent_id=0,active=CASE WHEN admin_deleted THEN false ELSE true END,updated_at=NOW() WHERE id=$2 RETURNING id", [c.name, existing.id]);
    localId = r.rows[0].id;
  } else {
    const r = await q("INSERT INTO api_source_categories(api_source_id,external_id,name,parent_id,custom_parent_id,active) VALUES($1,$2,$3,0,NULL,true) RETURNING id", [src.id, extId, c.name]);
    localId = r.rows[0].id;
  }
  categoryMap.set(extId, localId);
  seenCategories.add(extId);
}

// بعض مزوّدي المنتجات لا يعيدون قائمة الأقسام من /content/0، لكنهم يضعون
// category_id/category_name داخل كل منتج. ننشئ/نحدّث هذه الأقسام من نفس بيانات المصدر
// حتى لا تختفي منتجات المصدر الثاني من المتجر.
for (const raw of products) {
  const extCat = raw?.category_id ?? raw?.categoryId ?? raw?.category?.id;
  const catName = raw?.category_name ?? raw?.category?.name ?? (extCat != null ? `قسم ${extCat}` : null);
  if (extCat == null || !catName) continue;
  const extKey = String(extCat);
  if (categoryMap.has(extKey)) continue;
  const existing = (await q("SELECT id FROM api_source_categories WHERE api_source_id=$1 AND external_id=$2 LIMIT 1", [src.id, extKey])).rows[0];
  let localId;
  if (existing) {
    const r = await q("UPDATE api_source_categories SET name=CASE WHEN admin_deleted THEN name ELSE $1 END, active=CASE WHEN admin_deleted THEN false ELSE true END, updated_at=NOW() WHERE id=$2 RETURNING id", [catName, existing.id]);
    localId = r.rows[0].id;
  } else {
    const r = await q("INSERT INTO api_source_categories(api_source_id,external_id,name,parent_id,custom_parent_id,active) VALUES($1,$2,$3,0,NULL,true) RETURNING id", [src.id, extKey, catName]);
    localId = r.rows[0].id;
  }
  categoryMap.set(extKey, localId);
}

const seenProductIds = new Set();
for (const raw of products) {
  const externalId = String(raw?.id ?? raw?.product_id ?? "").trim();
  if (!externalId) continue;
  seenProductIds.add(externalId);
  const categoryExternalId = raw?.category_id ?? raw?.categoryId ?? raw?.category?.id ?? null;
  const categoryLocalId = categoryExternalId == null ? null : (categoryMap.get(String(categoryExternalId)) ?? null);
  const qtyValues = normalizeProviderQty(
  (raw?.min_order != null || raw?.max_order != null || raw?.min_order_qty != null || raw?.max_order_qty != null || raw?.min_order_quantity != null || raw?.max_order_quantity != null || raw?.min_quantity != null || raw?.max_quantity != null || raw?.min_qty != null || raw?.max_qty != null || raw?.purchase_limit != null || raw?.max_purchase != null)
    ? {
        min: raw?.min_order ?? raw?.min_order_qty ?? raw?.min_order_quantity ?? raw?.min_quantity ?? raw?.min_qty ?? (raw?.max_purchase != null || raw?.purchase_limit != null || raw?.max_order != null || raw?.max_qty != null ? 1 : null),
        max: raw?.max_order ?? raw?.max_order_qty ?? raw?.max_order_quantity ?? raw?.max_quantity ?? raw?.max_qty ?? raw?.max_purchase ?? raw?.purchase_limit,
      }
    : (raw?.qty_values ?? raw?.quantity ?? raw?.qty ?? raw?.quantities ?? raw?.quantity_range)
);
  const params = normalizeProviderParams(raw?.params ?? raw?.parameters ?? raw?.fields ?? raw?.requirements);
  const cancel = extractCancelMeta(raw);
  const available = raw?.available !== false && raw?.active !== false && raw?.enabled !== false;
  const parentId = categoryLocalId;
  const name = raw?.name ?? raw?.title ?? `Product ${externalId}`;
  const categoryName = raw?.category_name ?? raw?.category?.name ?? null;
  const price = raw?.price ?? raw?.base_price ?? 0;
  const basePrice = raw?.base_price ?? raw?.price ?? 0;
  const rate = raw?.rate ?? null;
  const notes = raw?.notes ?? raw?.description ?? raw?.details ?? null;

  await q(`
INSERT INTO api_source_products(api_source_id,external_id,name,category_name,category_id,parent_id,price,base_price,rate,qty_values,params,notes,available,cancel_enabled,cancel_seconds,cancel_url)
VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
ON CONFLICT(api_source_id,external_id) DO UPDATE SET
name=CASE WHEN api_source_products.custom_name IS NOT NULL THEN api_source_products.name ELSE EXCLUDED.name END,
category_name=EXCLUDED.category_name,
category_id=COALESCE(EXCLUDED.category_id,api_source_products.category_id),
parent_id=COALESCE(EXCLUDED.parent_id,api_source_products.parent_id),
price=EXCLUDED.price,base_price=EXCLUDED.base_price,rate=EXCLUDED.rate,
qty_values=EXCLUDED.qty_values,params=EXCLUDED.params,notes=EXCLUDED.notes,
available=CASE WHEN api_source_products.admin_deleted THEN false ELSE EXCLUDED.available END,
cancel_enabled=EXCLUDED.cancel_enabled,cancel_seconds=EXCLUDED.cancel_seconds,cancel_url=EXCLUDED.cancel_url,updated_at=NOW()`,
    [src.id, externalId, name, categoryName, categoryLocalId, parentId, price, basePrice, rate, JSON.stringify(qtyValues), JSON.stringify(params), notes, available, !!cancel.cancelUrl && !!cancel.cancelSeconds, cancel.cancelSeconds, cancel.cancelUrl]
  );
}

// Deactivate anything the provider no longer returns. This also runs when the
// provider returns an empty catalog, so deleted products/categories cannot remain
// visible forever in the local database.
const seenCategoryList = [...seenCategories];
await q(
  "UPDATE api_source_categories SET active=false,updated_at=NOW() WHERE api_source_id=$1 AND NOT (external_id = ANY($2))",
  [src.id, seenCategoryList]
).catch(() => {});
if (seenCategoryList.length) {
  await q(
    "UPDATE api_source_categories SET active=CASE WHEN admin_deleted THEN false ELSE true END WHERE api_source_id=$1 AND external_id = ANY($2)",
    [src.id, seenCategoryList]
  );
}
const seenProductList = [...seenProductIds];
await q(
  "UPDATE api_source_products SET available=false,updated_at=NOW() WHERE api_source_id=$1 AND NOT (external_id = ANY($2))",
  [src.id, seenProductList]
).catch(() => {});
return seenProductIds.size;
}

async function testApiSourceConnection(source) {
try {
const products = await fetchApiSourceProducts(source);
return { ok: true, count: products.length };
} catch (err) {
return { ok: false, error: err?.response?.data?.detail?.message || err?.message || "Product source connection failed" };
}
}

async function listApiSources() {
const res = await q("SELECT * FROM api_sources ORDER BY id");
return res.rows;
}

async function getApiSource(id) {
const res = await q("SELECT * FROM api_sources WHERE id=$1", [id]);
return res.rows[0] ?? null;
}

async function createApiSource(name, baseUrl, apiToken, markupPercent) {
const res = await q(
"INSERT INTO api_sources(name,base_url,api_token,markup_percent) VALUES($1,$2,$3,$4) RETURNING *",
[name, baseUrl, apiToken, markupPercent]
);
return res.rows[0];
}

async function updateApiSource(id, updates) {
const fields = [];
const values = [];
let idx = 1;
for (const [k, v] of Object.entries(updates)) {
fields.push(`${k}=$${idx}`);
values.push(v);
idx++;
}
values.push(id);
await q(`UPDATE api_sources SET ${fields.join(",")}, updated_at=NOW() WHERE id=$${idx}`, values);
}

async function deleteApiSource(id) {
await q("DELETE FROM api_sources WHERE id=$1", [id]);
apiSourceClients.delete(id);
}

// ── Default المصدر الثاني requested by the owner ─────────────────────────────
// Stored in the database once; existing rows are updated with the supplied token.
const DEFAULT_API2_NAME = "المصدر الثاني - Maxstore1";
const DEFAULT_API2_BASE_URL = "https://maxstore1.com";
const DEFAULT_API2_TOKEN = "msk_NRw8ZXlYtdPBil0wSxz2sAT4AV58gMvo2ITGGq-YC14";
const DEFAULT_API2_MARKUP = 5;

async function ensureDefaultApi2() {
try {
const existing = (await q("SELECT * FROM api_sources WHERE lower(trim(base_url))=lower(trim($1)) ORDER BY id LIMIT 1", [DEFAULT_API2_BASE_URL])).rows[0];
if (existing) {
await q("UPDATE api_sources SET name=$1, api_token=$2, markup_percent=$3, active=true, updated_at=NOW() WHERE id=$4", [DEFAULT_API2_NAME, DEFAULT_API2_TOKEN, DEFAULT_API2_MARKUP, existing.id]);
apiSourceClients.delete(existing.id);
return existing.id;
}
const created = await createApiSource(DEFAULT_API2_NAME, DEFAULT_API2_BASE_URL, DEFAULT_API2_TOKEN, DEFAULT_API2_MARKUP);
return created.id;
} catch (e) {
console.error("Default Source2 setup failed:", e.message);
return null;
}
}

// ============================================================
//  AI SUPPORT
// ============================================================
const convHistory = new Map();

const AI_SYSTEM_PROMPT = `أنت مساعد ذكاء اصطناعي متخصص في إدارة متجر "متجر المروان" على تيليجرام.
البوت يبيع منتجات رقمية بشكل آلي.
أجب دائماً بالعربي. كن دقيقاً وعملياً. لا تذكر أسماء مواقع أو روابط خارجية.`;

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
return "📞 استخدم زر الدعم من القائمة للتواصل مع الإدارة.";
}

// ============================================================
//  PRODUCT CACHE — DB first, API refresh in background
// ============================================================
const PRODUCTS_TTL = 5 * 60_000;
const CONTENT_TTL = 5 * 60_000;
const OVERRIDES_TTL = 2 * 60_000;
const PAGE_SIZE = 8;
const CATALOG_REFRESH_MS = 60_000;

let productsCache = null;
const contentCache = new Map();
let allOverridesCache = null;
let _productsInFlight = null;
const _contentInFlight = new Map();
let _overridesInFlight = null;
let _catalogRefreshInFlight = null;

async function loadCatalogCache(key) {
try {
const res = await q("SELECT payload FROM product_catalog_cache WHERE cache_key=$1", [key]);
return res.rows[0]?.payload ?? null;
} catch { return null; }
}

async function saveCatalogCache(key, payload) {
try {
await q("INSERT INTO product_catalog_cache(cache_key,payload,updated_at) VALUES($1,$2,NOW()) ON CONFLICT(cache_key) DO UPDATE SET payload=$2, updated_at=NOW()", [key, JSON.stringify(payload)]);
} catch (e) { console.error("catalog cache save error:", e.message); }
}

function normalizeApi1Products(products) {
return (Array.isArray(products) ? products : []).map(p => ({ ...p, _source: "api1", _source_id: null }));
}

function normalizeApi2Products(rows) {
return rows.map(p => ({
id: `ext_${p.api_source_id}_${p.external_id}`,
_source: "api2", _source_id: p.api_source_id, _external_id: p.external_id,
name: p.custom_name ?? p.name, category_name: p.category_name, category_id: p.category_id,
parent_id: p.parent_id, price: p.price, base_price: p.base_price, rate: p.rate,
qty_values: p.qty_values, params: p.params, notes: p.notes, available: p.available, admin_hidden: p.admin_hidden ?? false, custom_name: p.custom_name ?? null,
api_source_product_id: p.id,
cancel_enabled: p.cancel_enabled ?? false, cancel_seconds: p.cancel_seconds ?? null, cancel_url: p.cancel_url ?? null
}));
}

async function getCachedProducts() {
if (productsCache && productsCache.expiry > Date.now()) return productsCache.products;
if (_productsInFlight) return _productsInFlight;
_productsInFlight = (async () => {
// Fast path: database snapshot. Never wait for المصدر الأساسي on a normal button press.
const cachedApi1 = await loadCatalogCache("api1_products");
if (Array.isArray(cachedApi1)) {
const api1 = normalizeApi1Products(cachedApi1);
let api2 = [];
try {
const r = await q("SELECT * FROM api_source_products WHERE available=true ORDER BY id");
api2 = normalizeApi2Products(r.rows);
} catch {}
const all = [...api1, ...api2];
productsCache = { products: all, expiry: Date.now() + PRODUCTS_TTL };
_productsInFlight = null;
// Refresh silently; the user gets the DB snapshot immediately.
refreshCatalogCache().catch(() => {});
return all;
}

// First boot only: seed the database once.
try {
const api1 = await fetchAllProducts();
await saveCatalogCache("api1_products", api1);
const all = normalizeApi1Products(api1);
try {
const r = await q("SELECT * FROM api_source_products WHERE available=true ORDER BY id");
all.push(...normalizeApi2Products(r.rows));
} catch {}
productsCache = { products: all, expiry: Date.now() + PRODUCTS_TTL };
return all;
} finally { _productsInFlight = null; }
})();
return _productsInFlight;
}

async function getCachedContent(parentId) {
const cached = contentCache.get(parentId);
if (cached && cached.expiry > Date.now()) return cached.content;
if (_contentInFlight.has(parentId)) return _contentInFlight.get(parentId);

const p = (async () => {
const db = await loadCatalogCache(`api1_content_${parentId}`);
if (db && Array.isArray(db.products) && Array.isArray(db.categories)) {
contentCache.set(parentId, { content: db, expiry: Date.now() + CONTENT_TTL });
fetchAndCacheContent(parentId).catch(() => {});
return db;
}
return fetchAndCacheContent(parentId);
})().finally(() => _contentInFlight.delete(parentId));
_contentInFlight.set(parentId, p);
return p;
}

async function fetchAndCacheContent(parentId) {
const content = await fetchContent(parentId);
contentCache.set(parentId, { content, expiry: Date.now() + CONTENT_TTL });
await saveCatalogCache(`api1_content_${parentId}`, content);
return content;
}

async function getAllOverridesCached() {
if (allOverridesCache && allOverridesCache.expiry > Date.now()) return allOverridesCache.map;
if (_overridesInFlight) return _overridesInFlight;
_overridesInFlight = loadAllOverrides().then(map => {
allOverridesCache = { map, expiry: Date.now() + OVERRIDES_TTL };
_overridesInFlight = null;
return map;
}).catch(err => { _overridesInFlight = null; throw err; });
return _overridesInFlight;
}

async function refreshCatalogCache() {
if (_catalogRefreshInFlight) return _catalogRefreshInFlight;
_catalogRefreshInFlight = (async () => {
try {
const api1 = await fetchAllProducts();
await saveCatalogCache("api1_products", api1);
productsCache = { products: normalizeApi1Products(api1), expiry: Date.now() + PRODUCTS_TTL };
} catch (e) { console.error("API1 products refresh failed:", e.message); }

try {
const root = await fetchContent(0);
await saveCatalogCache("api1_content_0", root);
contentCache.set(0, { content: root, expiry: Date.now() + CONTENT_TTL });
// لا نرسل طلباً لكل قسم هنا. الأقسام الفرعية تُحدّث عند الحاجة في الخلفية،
// واللقطة القديمة من قاعدة البيانات تبقى صالحة للعرض الفوري.
} catch (e) { console.error("API1 content refresh failed:", e.message); }

try {
const sources = (await listApiSources()).filter(src => src.active);
await Promise.allSettled(sources.map(async src => {
try { await syncApiSource(src.id); }
catch (e) { console.error(`API ${src.id} refresh failed:`, e.message); }
}));
// Rebuild unified in-memory cache after Source2 refresh.
productsCache = null;
} catch (e) { console.error("Source2 refresh failed:", e.message); }

try {
allOverridesCache = null;
} catch {}
})().finally(() => { _catalogRefreshInFlight = null; });
return _catalogRefreshInFlight;
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
setInterval(() => { refreshCatalogCache().catch(() => {}); }, CATALOG_REFRESH_MS).unref();
refreshCatalogCache().catch(() => {});
}

function isExcludedProduct(p, kws) {
const n = (p.name ?? "").toLowerCase();
return kws.some(k => k && n.includes(k));
}

async function loadCategoryOverrides(ids) {
if (!ids.length) return new Map();
const res = await q("SELECT * FROM category_overrides WHERE category_id = ANY($1)", [ids]);
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

// product source markup override
if (p._source === 'api2' && p._source_id) {
try {
const src = await getApiSource(p._source_id);
if (src?.markup_percent != null) m = Number(src.markup_percent);
} catch (e) {}
}

const isSocial = isSocialProduct(p.name, p.category_name, socialKws);
if (isSocial) m = Math.max(m, socialMarkup);
let rawPrice = Number(p.price) || Number(p.base_price) || Number(p.price_usd) || 0;
if (rawPrice === 0) {
const rateVal = Number(p.rate) || Number(p.cost) || 0;
if (rateVal > 0) {
rawPrice = isSocial ? rateVal / 1000 : rateVal;
}
}
return Number((rawPrice * (1 + m / 100)).toFixed(6));
}

// API2 products inherit the same store rules as the rest of the catalog.
// Provider data remains authoritative for name/price/quantity/params/availability,
// while local store settings (source/category/user/product markup, hidden/name overrides,
// social markup) are applied on top without hard-coding provider quantities.
async function getApi2DisplayData(row, userId, preloaded = {}) {
  const p = {
    id: `ext_${row.api_source_id}_${row.external_id}`,
    api_source_product_id: row.id,
    name: row.custom_name ?? row.name,
    category_name: row.category_name,
    category_id: row.category_id,
    parent_id: row.parent_id,
    price: row.price,
    base_price: row.base_price,
    rate: row.rate,
    _source: "api2",
    _source_id: row.api_source_id,
  };
  const [src, user, catOvRes, markup, socialMarkup, socialKws] = await Promise.all([
    preloaded.source ?? getApiSource(row.api_source_id),
    preloaded.user ?? getUser(userId),
    preloaded.categoryOverride ?? q("SELECT custom_markup_percent, custom_name, hidden FROM category_overrides WHERE category_id=$1", [Number(row.category_id)]).then(r => r.rows[0] ?? null),
    preloaded.markup ?? getMarkupPercent(),
    preloaded.socialMarkup ?? getSocialMarkupPercent(),
    preloaded.socialKws ?? getSocialKeywords(),
  ]);
  const override = null;
  const userMarkupPercent = user?.custom_markup_percent != null ? Number(user.custom_markup_percent) : null;
  const categoryMarkupPercent = catOvRes?.custom_markup_percent != null ? Number(catOvRes.custom_markup_percent) : null;
  const priceUsd = await effectivePriceUsd(p, override, Number(src?.markup_percent ?? markup), socialMarkup, socialKws, categoryMarkupPercent, userMarkupPercent);
  return { priceUsd, override, categoryOverride: catOvRes, source: src, user, userMarkupPercent };
}

const BOT_MAINTENANCE_MSG = "🔧 البوت قيد الصيانة حالياً.\nسيعود للعمل بأقرب وقت ممكن. نشكر صبركم! 🙏";
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME ?? "admin").split(",")[0].trim();

// ============================================================
//  STEP STATE (per user)
// ============================================================
const stepMap = new Map();
function getStep(uid) { return stepMap.get(uid) ?? { kind: "idle" }; }
function setStep(uid, s) { stepMap.set(uid, s); }

let _botRef = null;
const authedAdminIds = new Set();

// ── حالة التنقل: userId → Map<catId, page> ────────────────────────────
const navState = new Map();
function saveNavPage(uid, catId, page) {
if (!navState.has(uid)) navState.set(uid, new Map());
navState.get(uid).set(catId, page);
}
function getNavPage(uid, catId) { return navState.get(uid)?.get(catId) ?? 1; }

// ── إشعارات الإيداع ──────────────────────────────────────────────────
const depositNotifications = new Map();
async function clearDepositForOtherAdmins(processorId, depId, statusText) {
const list = depositNotifications.get(depId) ?? [];
depositNotifications.delete(depId);
for (const n of list) {
if (n.adminId === processorId) continue;
try {
await _botRef?.telegram.deleteMessage(n.adminId, n.messageId);
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

// ── لوحة الإدارة مخفية - لا تظهر في القائمة الرئيسية ──────────────
function mainMenu() {
return Markup.inlineKeyboard([
[Markup.button.callback("🛒 المنتجات", "cat:0:1:0"), Markup.button.callback("💰 رصيدي", "balance")],
[Markup.button.callback("💳 إيداع", "deposit"), Markup.button.callback("📦 طلباتي", "myorders:1")],
[Markup.button.callback("📞 الدعم", "support"), Markup.button.callback("🔄 تحديث", "home")],
]);
}

function mainMenuAdmin() {
return Markup.inlineKeyboard([
[Markup.button.callback("🛒 المنتجات", "cat:0:1:0"), Markup.button.callback("💰 رصيدي", "balance")],
[Markup.button.callback("💳 إيداع", "deposit"), Markup.button.callback("📦 طلباتي", "myorders:1")],
[Markup.button.callback("📞 الدعم", "support"), Markup.button.callback("🔄 تحديث", "home")],
[Markup.button.callback("👑 الدخول للوحة الإدارة", "admin:menu")],
]);
}

async function showMainMenu(ctx) {
const user = await ensureUser(ctx);
if (!user) return;
setStep(user.id, { kind: "idle" });
if (user.status === "banned") { await sendOrEdit(ctx, "🚫 تم حظرك من استخدام البوت."); return; }
const [status, rate, adminSessionActive] = await Promise.all([
getBotStatus(),
getExchangeRate(),
isAdminSessionActive(user.id),
]);
if (status === "off" && !authedAdminIds.has(user.id) && !adminSessionActive) {
await sendOrEdit(ctx, "🔧 البوت قيد الصيانة. سيعود للعمل بأقرب وقت ممكن. نشكر صبركم! 🙏");
return;
}
const greeting = `أهلًا بك في متجر المروان 🌟

الاسم: ${user.first_name ?? "-"}${user.username ? ` (@${user.username})` : ""}
الرقم: ${user.id}
الرصيد: ${formatBalance(Number(user.balance), rate)}

اختر من القائمة 👇`;
if (authedAdminIds.has(user.id) && !adminSessionActive && !user.is_admin) {
authedAdminIds.delete(user.id);
}
const isAuthed = adminSessionActive || (authedAdminIds.has(user.id) && !!user.is_admin);
await sendOrEdit(ctx, greeting, isAuthed ? mainMenuAdmin() : mainMenu());
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
let _depositMethodsEnsured = false;
async function ensureDefaultDepositMethods() {
if (_depositMethodsEnsured) return;
const res = await q("SELECT COUNT(*)::int AS c FROM deposit_methods");
if (res.rows[0].c > 0) { _depositMethodsEnsured = true; return; }
await q(`INSERT INTO deposit_methods(name,identifier,instructions) VALUES
('شام كاش','02d7079d7229d8860c7d89467bfdc938','حول المبلغ إلى رقم شام كاش أعلاه ثم أرسل صورة الإشعار'),
('سيريتل كاش','32820534','حول المبلغ إلى رقم سيريتل كاش أعلاه ثم أرسل صورة الإشعار')`);
_depositMethodsEnsured = true;
}

async function showDepositMenu(ctx) {
if (!_depositMethodsEnsured) await ensureDefaultDepositMethods();
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
setStep(ctx.from.id, { kind: "deposit:info", methodId: m.id, methodName: m.name, amount: null, photoFileId: null });
const kb = Markup.inlineKeyboard([[Markup.button.callback("⬅️ رجوع", "deposit"), Markup.button.callback("❌ إلغاء", "dep:cancel")]]);
const infoText = `💳 ${m.name}\n🔑 الرقم: ${m.identifier}\n\n📋 التعليمات:\n${m.instructions}\n\n📎 أرسل المبلغ وصورة إشعار التحويل\n(يمكنك إرسالهما بأي ترتيب)`;
if (m.image_file_id) {
await ctx.replyWithPhoto(m.image_file_id, { caption: infoText, ...kb });
} else {
await ctx.reply(infoText, kb);
}
}

async function completeDepositRequest(ctx, step) {
const res = await q(
"INSERT INTO deposit_requests(user_id,method_id,method_name,amount,screenshot_file_id) VALUES($1,$2,$3,$4,$5) RETURNING *",
[ctx.from.id, step.methodId, step.methodName, step.amount != null ? String(step.amount) : null, step.photoFileId]
);
const dep = res.rows[0];
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply("سيتم مراجعة طلبك في أقرب وقت ممكن.", Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
await notifyAdminsDeposit(ctx, dep);
}

async function notifyAdminsDeposit(ctx, depositRow) {
if ((await getSetting("deposit_admin_notifications")) !== "on") return;
const user = await getUser(ctx.from.id);
const amountStr = depositRow.amount ? `${Number(depositRow.amount).toFixed(2)}$` : "—";
const text = `📥 طلب إيداع جديد\n👤 ${user?.first_name ?? "—"}${user?.username ? " @" + user.username : ""} (${ctx.from.id})\n💳 ${depositRow.method_name}\n💵 المبلغ المُحوَّل: ${amountStr}`;
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
async function findApi1CategoryById(targetId) {
const wanted = Number(targetId);
if (!Number.isInteger(wanted) || wanted <= 0) return null;
const visited = new Set();
const walk = async parentId => {
if (visited.has(Number(parentId))) return null;
visited.add(Number(parentId));
const content = await getCachedContent(parentId);
for (const c of content.categories || []) {
if (Number(c.id) === wanted) return c;
const nested = await walk(c.id);
if (nested) return nested;
}
return null;
};
try { return await walk(0); } catch { return null; }
}

async function getMovedApi1Categories(parentId) {
const rows = (await q("SELECT category_id, custom_name, hidden, custom_parent_id FROM category_overrides WHERE custom_parent_id=$1", [parentId])).rows;
const moved = await Promise.all(rows.map(async r => {
  const providerCategory = await findApi1CategoryById(r.category_id);
  if (!providerCategory) return null;
  return {
    id: Number(r.category_id),
    name: r.custom_name || providerCategory.name,
    _moved: true,
    _override: r,
  };
}));
return moved.filter(Boolean);
}

async function showCategory(ctx, parentId, page, backTo) {
const [u, _catSessActive] = await Promise.all([getUser(ctx.from.id), isAdminSessionActive(ctx.from.id)]);
const isAdmin = !!u?.is_admin && (authedAdminIds.has(ctx.from.id) || _catSessActive);
const userMarkupPercent = u?.custom_markup_percent != null ? Number(u.custom_markup_percent) : null;

const [kws, excludedStr, content, socialKws, socialMarkup, markup, ovMap] = await Promise.all([
getExcludedKeywords(),
getSetting("excluded_category_ids"),
getCachedContent(parentId),
getSocialKeywords(),
getSocialMarkupPercent(),
getMarkupPercent(),
getAllOverridesCached(),
]);
const excludedCats = new Set(excludedStr.split(",").map(s => Number(s.trim())).filter(Number.isFinite));
const catOv = await loadCategoryOverrides([...content.categories.map(c => c.id), parentId]);

// لا نفحص كل قسم عبر API عند كل ضغطة. content نفسه محفوظ في قاعدة البيانات،
// لذلك نعرض الأقسام مباشرة ونترك التحديث للمزامنة الخلفية. هذا يمنع البطء
// الناتج عن عشرات/مئات طلبات API المتسلسلة عند فتح "المنتجات".
const visibleCats = [];
for (const c of content.categories) {
if (excludedCats.has(c.id)) continue;
const ov = catOv.get(c.id);
if (ov?.hidden && !isAdmin) continue;
if (ov?.customParentId != null && ov.customParentId !== parentId) continue;
visibleCats.push(c);
}
if (isAdmin || parentId !== 0) {
const moved = await getMovedApi1Categories(parentId);
for (const c of moved) {
const ov = catOv.get(c.id) ?? c._override;
if (ov?.hidden && !isAdmin) continue;
if (!visibleCats.some(x => Number(x.id) === Number(c.id))) visibleCats.push(c);
}
}

const visibleProds = content.products.filter(p => {
if (!p.available && !isAdmin) return false;
if (isExcludedProduct(p, kws)) return false;
const ov = ovMap.get(p.id);
if (ov?.hidden && !isAdmin) return false;
if (ov?.customCategoryId != null && ov.customCategoryId !== parentId) return false;
return true;
});

// المصدر الثاني products in this category
const [api2Prods, api2Cats] = await Promise.all([
q("SELECT * FROM api_source_products WHERE category_id=$1 AND available=true", [parentId]),
q("SELECT * FROM api_source_categories WHERE COALESCE(custom_parent_id,parent_id)=$1 AND active=true ORDER BY id", [parentId]).catch(() => ({ rows: [] })),
]);

const [vcRes, mpRes, rate, backLabel, homeLabel, prevLabel, nextLabel] = await Promise.all([
q("SELECT * FROM virtual_categories WHERE parent_id=$1 ORDER BY position", [parentId]),
q("SELECT * FROM manual_products WHERE category_id=$1 AND category_is_virtual=false AND active=true ORDER BY id", [parentId]),
getExchangeRate(),
getBtnBackLabel(), getBtnHomeLabel(), getBtnPrevLabel(), getBtnNextLabel(),
]);

// Manual categories
const manualCatRes = await q("SELECT * FROM manual_categories WHERE parent_id=$1 AND active=true ORDER BY position", [parentId]);
const manualCats = isAdmin ? (await q("SELECT * FROM manual_categories WHERE parent_id=$1 ORDER BY position", [parentId])).rows : manualCatRes.rows;

const vcRows = isAdmin ? vcRes.rows : vcRes.rows.filter(v => v.active);
const vcBtns = vcRows.map(v => Markup.button.callback(`${v.active ? "📂 " : "🔒 "}${v.name}`.slice(0, 60), `vcat:${v.id}:1:${parentId}`));

const manualCatBtns = manualCats.map(mc => Markup.button.callback(`📁 ${mc.name}`.slice(0, 60), `mcat:${mc.id}:1:${parentId}`));

const manualBtns = mpRes.rows.map(m => {
const usd = Number(m.price_usd); const syp = Math.round(usd * rate);
return Markup.button.callback(`🛒 ${m.name} • ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س`.slice(0, 60), `mprod:${m.id}:${parentId}`);
});

// المصدر الثاني category buttons
const api2CatBtns = api2Cats.rows.map(c => Markup.button.callback(`📂 ${c.name}`.slice(0, 60), `api2cat:${c.id}:1:${parentId}`));

if (!visibleCats.length && !visibleProds.length && !vcBtns.length && !manualBtns.length && !manualCatBtns.length && !api2CatBtns.length && !api2Prods.rows.length) {
const emptyRows = [];
if (isAdmin) {
emptyRows.push([Markup.button.callback("✏️ تعديل اسم القسم", `adm:catEdit:${parentId}`)]);
emptyRows.push([Markup.button.callback("🙈 إخفاء القسم", `adm:catToggle:${parentId}`)]);
emptyRows.push([Markup.button.callback("🗑️ حذف القسم", `adm:catDelete:${parentId}`)]);
}
if (parentId === 0) {
if (isAdmin) emptyRows.push([Markup.button.callback(backLabel, "admin:menu"), Markup.button.callback(homeLabel, "home")]);
else emptyRows.push([Markup.button.callback(homeLabel, "home")]);
} else {
const bp = getNavPage(ctx.from.id, backTo);
const backAction = backTo === 0 ? "cat:0:1:0" : `cat:${backTo}:${bp}:0`;
emptyRows.push([Markup.button.callback(backLabel, backAction), Markup.button.callback(homeLabel, "home")]);
}
await sendOrEdit(ctx, "📭 هذا القسم فارغ حالياً.", Markup.inlineKeyboard(emptyRows)); return;
}

visibleCats.sort((a, b) => (catOv.get(a.id)?.sortOrder ?? 9999) - (catOv.get(b.id)?.sortOrder ?? 9999));
const catBtns = [
...vcBtns,
...manualCatBtns,
...api2CatBtns,
...visibleCats.map(c => {
const ov = catOv.get(c.id);
const label = ov?.customName ?? c._override?.custom_name ?? c.name;
const adminLabel = "";
return Markup.button.callback(`${ov?.hidden ? "🔒 " : "📂 "}${adminLabel}${label}`.slice(0, 60), `cat:${c.id}:1:${parentId}`);
}),
];

const prodBtns = await Promise.all(visibleProds.map(async p => {
const ov = ovMap.get(p.id);
const usd = await effectivePriceUsd(p, ov, markup, socialMarkup, socialKws, null, userMarkupPercent);
const syp = Math.round(usd * rate);
const name = ov?.customName ?? p.name;
return Markup.button.callback(`${ov?.hidden ? "🔒 " : "🛒 "}${name} • ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س`.slice(0, 60), `prod:${p.id}:${parentId}`);
}));

// المصدر الثاني product buttons
const api2SourceIds = [...new Set(api2Prods.rows.map(p => Number(p.api_source_id)).filter(Boolean))];
const api2Sources = api2SourceIds.length ? (await q("SELECT id, markup_percent FROM api_sources WHERE id = ANY($1)", [api2SourceIds])).rows : [];
const api2MarkupMap = new Map(api2Sources.map(src => [Number(src.id), Number(src.markup_percent ?? markup)]));
const api2CatOvRes = api2Prods.rows.length ? await q("SELECT category_id, custom_markup_percent FROM category_overrides WHERE category_id = ANY($1)", [[...new Set(api2Prods.rows.map(p => Number(p.category_id)).filter(Boolean))]]) : { rows: [] };
const api2CatMarkupMap = new Map(api2CatOvRes.rows.map(r => [Number(r.category_id), r.custom_markup_percent != null ? Number(r.custom_markup_percent) : null]));
const api2ProdBtns = await Promise.all(api2Prods.rows.map(async p => {
if (p.admin_hidden && !isAdmin) return null;
const override = null;
const categoryMarkup = api2CatMarkupMap.get(Number(p.category_id)) ?? null;
const srcMarkup = api2MarkupMap.get(Number(p.api_source_id)) ?? markup;
const usd = await effectivePriceUsd({ ...p, _source: "api2", _source_id: p.api_source_id, id: `ext_${p.api_source_id}_${p.external_id}` }, override, srcMarkup, socialMarkup, socialKws, categoryMarkup, userMarkupPercent);
const name = p.custom_name ?? p.name;
const syp = Math.round(usd * rate);
return Markup.button.callback(`🛒 ${name} • ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س`.slice(0, 60), `api2prod:${p.id}:${parentId}`);
}));
const api2ProdBtnsSafe = api2ProdBtns.filter(Boolean);

const all = [...catBtns, ...prodBtns, ...manualBtns, ...api2ProdBtnsSafe];
const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
const safe = Math.min(Math.max(1, page), totalPages);
saveNavPage(ctx.from.id, parentId, safe);
const slice = all.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE);

const rows = [];
if (isAdmin && parentId !== 0) {
const curOv = (await q("SELECT * FROM category_overrides WHERE category_id=$1", [parentId])).rows[0];
rows.push([Markup.button.callback("✏️ تعديل اسم القسم", `adm:catEdit:${parentId}`), Markup.button.callback(curOv?.hidden ? "👁 إظهار" : "🙈 إخفاء", `adm:catToggle:${parentId}`)]);
rows.push([Markup.button.callback("% نسبة ربح القسم", `adm:catMarkup:${parentId}`)]);
rows.push([Markup.button.callback("🚚 نقل كل منتجات القسم", `adm:moveCatAll:${parentId}`), Markup.button.callback("📁 نقل القسم إلى قسم", `adm:moveCatToParent:${parentId}`)]);
rows.push([Markup.button.callback("🗑️ حذف القسم", `adm:catDelete:${parentId}`)]);
}
for (const b of slice) rows.push([b]);

const nav = [];
if (safe > 1) nav.push(Markup.button.callback(prevLabel, `cat:${parentId}:${safe - 1}:${backTo}`));
nav.push(Markup.button.callback(`${safe}/${totalPages}`, "noop"));
if (safe < totalPages) nav.push(Markup.button.callback(nextLabel, `cat:${parentId}:${safe + 1}:${backTo}`));
if (nav.length > 1) rows.push(nav);

if (parentId === 0) {
if (isAdmin) {
rows.push([Markup.button.callback(backLabel, "admin:menu"), Markup.button.callback(homeLabel, "home")]);
} else {
rows.push([Markup.button.callback(homeLabel, "home")]);
}
} else {
const backPage = getNavPage(ctx.from.id, backTo);
const backAction = backTo === 0 ? `cat:0:${backPage}:0` : `cat:${backTo}:${backPage}:0`;
rows.push([Markup.button.callback(backLabel, backAction), Markup.button.callback(homeLabel, "home")]);
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
const page = getNavPage(ctx.from.id, to);
const vc = (await q("SELECT id FROM virtual_categories WHERE id=$1", [to])).rows[0];
if (vc) return Markup.button.callback(backLabel, `vcat:${to}:${page}:0`);
return Markup.button.callback(backLabel, `cat:${to}:${page}:0`);
}

if (!p) { await sendOrEdit(ctx, "⚠️ المنتج غير موجود.", Markup.inlineKeyboard([[await resolveBackBtn(backTo)]])); return; }

const [kws, u, ovMap, markup, rate, socialKws, socialMarkup, sessionActive] = await Promise.all([
getExcludedKeywords(),
getUser(ctx.from.id),
loadOverrideMap([p.id]),
getMarkupPercent(),
getExchangeRate(),
getSocialKeywords(),
getSocialMarkupPercent(),
isAdminSessionActive(ctx.from.id),
]);
const isAdmin = !!u?.is_admin && (authedAdminIds.has(ctx.from.id) || sessionActive);
const isSuperAdmin = !!u?.is_super_admin && isAdmin;
const userMarkupPercent = u?.custom_markup_percent != null ? Number(u.custom_markup_percent) : null;

if (isExcludedProduct(p, kws) && !isAdmin) { await sendOrEdit(ctx, "⚠️ هذا المنتج غير متاح.", Markup.inlineKeyboard([[await resolveBackBtn(backTo)]])); return; }
const ov = ovMap.get(p.id);
const isSocial = isSocialProduct(p.name, p.category_name, socialKws);
const usd = await effectivePriceUsd(p, ov, markup, socialMarkup, socialKws, null, userMarkupPercent);
const syp = Math.round(usd * rate);

let qtyInfo = "";
const qtyDisplay = parseQtyValues(p.qty_values);
if (qtyDisplay.kind === "fixed") qtyInfo = "الكمية: 1 (ثابتة)";
else if (qtyDisplay.kind === "list") qtyInfo = `الكميات المتاحة: ${qtyDisplay.values.join(", ")}`;
else qtyInfo = `الكمية بين ${qtyDisplay.min.toLocaleString("en-US")} و ${qtyDisplay.max.toLocaleString("en-US")}`;

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
if (isSuperAdmin || !!u?.can_delete_products) btns.push([Markup.button.callback("🗑️ حذف من المتجر", `adm:deleteProd:${p.id}`)]);
}
btns.push([backBtnResolved, Markup.button.callback(homeLabel, "home")]);
await sendOrEdit(ctx, text, Markup.inlineKeyboard(btns));
}

async function showVirtualCategory(ctx, vcId, page, backTo) {
const [u, _vcSessActive] = await Promise.all([getUser(ctx.from.id), isAdminSessionActive(ctx.from.id)]);
const isAdmin = !!u?.is_admin && (authedAdminIds.has(ctx.from.id) || _vcSessActive);
const userMarkupPercent = u?.custom_markup_percent != null ? Number(u.custom_markup_percent) : null;

const [vcRes, allOv, allProducts, kws, markup, rate, socialKws, socialMarkup, backLabel, homeLabel, prevLabel, nextLabel] = await Promise.all([
q("SELECT * FROM virtual_categories WHERE id=$1", [vcId]),
getAllOverridesCached(),
getCachedProducts(),
getExcludedKeywords(),
getMarkupPercent(),
getExchangeRate(),
getSocialKeywords(),
getSocialMarkupPercent(),
getBtnBackLabel(), getBtnHomeLabel(), getBtnPrevLabel(), getBtnNextLabel(),
]);
const vc = vcRes.rows[0];
if (!vc || (!vc.active && !isAdmin)) { await sendOrEdit(ctx, "⚠️ هذا القسم غير متاح.", Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]])); return; }
let backBtn;
if (backTo === 0) {
backBtn = Markup.button.callback(backLabel, "cat:0:1:0");
} else {
const parentVcat = (await q("SELECT id FROM virtual_categories WHERE id=$1", [backTo])).rows[0];
backBtn = parentVcat ? Markup.button.callback(backLabel, `vcat:${backTo}:1:0`) : Markup.button.callback(backLabel, `cat:${backTo}:1:0`);
}

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

if (!visible.length && !subVcBtns.length && !manualBtnsVc.length && !isAdmin) { await sendOrEdit(ctx, "📭 هذا القسم فارغ حالياً.", Markup.inlineKeyboard([[backBtn, Markup.button.callback(homeLabel, "home")]])); return; }

const ovMap = await loadOverrideMap(visible.map(p => p.id));
const prodBtns = await Promise.all(visible.map(async p => {
const ov = ovMap.get(p.id);
const usd = await effectivePriceUsd(p, ov, markup, socialMarkup, socialKws, null, userMarkupPercent);
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
rows.push([backBtn, Markup.button.callback(homeLabel, "home")]);
await sendOrEdit(ctx, `📂 ${vc.name}`, Markup.inlineKeyboard(rows));
}

// ============================================================
//  MANUAL CATEGORIES
// ============================================================
async function showManualCategory(ctx, mcId, page, backTo) {
const [u, _sessActive] = await Promise.all([getUser(ctx.from.id), isAdminSessionActive(ctx.from.id)]);
const isAdmin = !!u?.is_admin && (authedAdminIds.has(ctx.from.id) || _sessActive);
const isSuperAdmin = !!u?.is_super_admin && isAdmin;
const userMarkupPercent = u?.custom_markup_percent != null ? Number(u.custom_markup_percent) : null;

const [mcRes, rate, backLabel, homeLabel, prevLabel, nextLabel] = await Promise.all([
q("SELECT * FROM manual_categories WHERE id=$1", [mcId]),
getExchangeRate(),
getBtnBackLabel(), getBtnHomeLabel(), getBtnPrevLabel(), getBtnNextLabel(),
]);
const mc = mcRes.rows[0];
if (!mc || (!mc.active && !isAdmin)) { await sendOrEdit(ctx, "⚠️ هذا القسم غير متاح.", Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]])); return; }

let backBtn;
if (backTo === 0) {
backBtn = Markup.button.callback(backLabel, "cat:0:1:0");
} else {
const parentMc = (await q("SELECT id FROM manual_categories WHERE id=$1", [backTo])).rows[0];
backBtn = parentMc ? Markup.button.callback(backLabel, `mcat:${backTo}:1:0`) : Markup.button.callback(backLabel, `cat:${backTo}:1:0`);
}

// Sub categories
const subMcRes = await q("SELECT * FROM manual_categories WHERE parent_id=$1 ORDER BY position", [mcId]);
const subMcs = isAdmin ? subMcRes.rows : subMcRes.rows.filter(v => v.active);
const subMcBtns = subMcs.map(v => Markup.button.callback(`${v.active ? "📁 " : "🔒 "}${v.name}`.slice(0, 60), `mcat:${v.id}:1:${mcId}`));

// Products in this category
const mpRes = isAdmin
? await q("SELECT * FROM manual_products WHERE manual_category_id=$1 ORDER BY id", [mcId])
: await q("SELECT * FROM manual_products WHERE manual_category_id=$1 AND active=true ORDER BY id", [mcId]);

const manualBtns = mpRes.rows.map(m => {
const usd = Number(m.price_usd);
const markup = m.markup_percent != null ? Number(m.markup_percent) : 0;
const finalUsd = usd * (1 + markup / 100);
const syp = Math.round(finalUsd * rate);
const stockLabel = m.stock_qty === 0 ? "❌ نفذ" : m.stock_qty > 0 ? `📦 ${m.stock_qty}` : "";
return Markup.button.callback(`🛒 ${m.name} ${stockLabel} • ${finalUsd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س`.slice(0, 60), `mprod:${m.id}:${mcId}`);
});

if (!subMcBtns.length && !manualBtns.length && !isAdmin) {
await sendOrEdit(ctx, "📭 هذا القسم فارغ حالياً.", Markup.inlineKeyboard([[backBtn, Markup.button.callback(homeLabel, "home")]])); return;
}

const allBtns = [...subMcBtns, ...manualBtns];
const totalPages = Math.max(1, Math.ceil(allBtns.length / PAGE_SIZE));
const safe = Math.min(Math.max(1, page), totalPages);
saveNavPage(ctx.from.id, mcId, safe);
const slice = allBtns.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE);

const rows = [];
if (isAdmin) {
rows.push([Markup.button.callback("✏️ تعديل الاسم", `adm:mcEdit:${mcId}`), Markup.button.callback(mc.active ? "🙈 إخفاء" : "👁 إظهار", `adm:mcToggle:${mcId}`)]);
rows.push([Markup.button.callback("➕ قسم فرعي", `adm:addMcSub:${mcId}`), Markup.button.callback("🗑️ حذف القسم", `adm:mcDel:${mcId}`)]);
rows.push([Markup.button.callback("➕ إضافة منتج", `adm:addManualProd:${mcId}`)]);
}
for (const b of slice) rows.push([b]);
const nav = [];
if (safe > 1) nav.push(Markup.button.callback(prevLabel, `mcat:${mcId}:${safe - 1}:${backTo}`));
nav.push(Markup.button.callback(`${safe}/${totalPages}`, "noop"));
if (safe < totalPages) nav.push(Markup.button.callback(nextLabel, `mcat:${mcId}:${safe + 1}:${backTo}`));
if (nav.length > 1) rows.push(nav);
rows.push([backBtn, Markup.button.callback(homeLabel, "home")]);
await sendOrEdit(ctx, `📁 ${mc.name}`, Markup.inlineKeyboard(rows));
}

async function showManualProduct(ctx, mId, backTo) {
const [backLabel, homeLabel] = await Promise.all([getBtnBackLabel(), getBtnHomeLabel()]);
let backBtn;
if (backTo === 0) {
backBtn = Markup.button.callback(backLabel, "cat:0:1:0");
} else {
const parentIsMc = (await q("SELECT id FROM manual_categories WHERE id=$1", [backTo])).rows[0];
const parentIsVcat = (await q("SELECT id FROM virtual_categories WHERE id=$1", [backTo])).rows[0];
if (parentIsMc) backBtn = Markup.button.callback(backLabel, `mcat:${backTo}:1:0`);
else if (parentIsVcat) backBtn = Markup.button.callback(backLabel, `vcat:${backTo}:1:0`);
else backBtn = Markup.button.callback(backLabel, `cat:${backTo}:1:0`);
}
const mRes = await q("SELECT * FROM manual_products WHERE id=$1", [mId]);
const m = mRes.rows[0];
const u = await getUser(ctx.from.id);
const isAdmin = !!u?.is_admin;
if (!m || (!m.active && !isAdmin)) { await sendOrEdit(ctx, "⚠️ المنتج غير متاح.", Markup.inlineKeyboard([[backBtn, Markup.button.callback(homeLabel, "home")]])); return; }
const rate = await getExchangeRate();
const usd = Number(m.price_usd);
const markup = m.markup_percent != null ? Number(m.markup_percent) : 0;
const finalUsd = usd * (1 + markup / 100);
const syp = Math.round(finalUsd * rate);
const balance = u ? Number(u.balance) : 0;
const canAfford = balance >= finalUsd;
const stockAvailable = m.stock_qty === -1 || m.stock_qty > 0;

let text = `🛒 ${m.name}\n`;
if (m.description) text += `📝 ${m.description}\n`;
text += `السعر: ${finalUsd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س\n`;
text += `الرصيد: ${formatBalance(balance, rate)}\n`;
if (m.stock_qty >= 0) text += `📦 المخزون: ${m.stock_qty}\n`;
if (m.instructions) text += `\n📋 ${m.instructions}`;
if (m.image_file_id) {
// Will send photo separately
}

const rows = [];
if (m.active && canAfford && stockAvailable) rows.push([Markup.button.callback("🛒 طلب الآن", `mbuy:${m.id}`)]);
else if (m.active && !canAfford) rows.push([Markup.button.callback("💳 شحن رصيد", "deposit")]);
else if (!stockAvailable) rows.push([Markup.button.callback("❌ نفذ المخزون", "noop")]);
rows.push([backBtn, Markup.button.callback(homeLabel, "home")]);

if (m.image_file_id) {
await ctx.replyWithPhoto(m.image_file_id, { caption: text, ...Markup.inlineKeyboard(rows) });
} else {
await sendOrEdit(ctx, text, Markup.inlineKeyboard(rows));
}
}

// ============================================================
//  المصدر الثاني CATEGORY & PRODUCT DISPLAY
// ============================================================
async function showApi2Category(ctx, catId, page, backTo) {
const [u, _sessActive] = await Promise.all([getUser(ctx.from.id), isAdminSessionActive(ctx.from.id)]);
const isAdmin = !!u?.is_admin && (authedAdminIds.has(ctx.from.id) || _sessActive);
const isSuperAdmin = !!u?.is_super_admin && isAdmin;

const [catRes, rate, backLabel, homeLabel, prevLabel, nextLabel] = await Promise.all([
q("SELECT * FROM api_source_categories WHERE id=$1", [catId]),
getExchangeRate(),
getBtnBackLabel(), getBtnHomeLabel(), getBtnPrevLabel(), getBtnNextLabel(),
]);
const cat = catRes.rows[0];
if (!cat) { await sendOrEdit(ctx, "⚠️ القسم غير موجود.", Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]])); return; }

let backBtn;
if (backTo === 0) backBtn = Markup.button.callback(backLabel, "cat:0:1:0");
else backBtn = Markup.button.callback(backLabel, `cat:${backTo}:1:0`);

// Sub categories
const subRes = await q("SELECT * FROM api_source_categories WHERE COALESCE(custom_parent_id,parent_id)=$1 AND active=true ORDER BY id", [catId]);
const subBtns = subRes.rows.map(c => Markup.button.callback(`📂 ${c.name}`.slice(0, 60), `api2cat:${c.id}:1:${catId}`));

// Products
const prodRes = await q("SELECT * FROM api_source_products WHERE category_id=$1 AND available=true", [catId]);
const src = await getApiSource(cat.api_source_id);
const [markup, socialMarkup, socialKws, user, catOvRes] = await Promise.all([
getMarkupPercent(), getSocialMarkupPercent(), getSocialKeywords(), getUser(ctx.from.id),
q("SELECT custom_markup_percent FROM category_overrides WHERE category_id=$1", [catId]),
]);
const categoryMarkup = catOvRes.rows[0]?.custom_markup_percent != null ? Number(catOvRes.rows[0].custom_markup_percent) : null;
const userMarkupPercent = user?.custom_markup_percent != null ? Number(user.custom_markup_percent) : null;

const prodBtns = (await Promise.all(prodRes.rows.map(async p => {
if (p.admin_hidden && !isAdmin) return null;
const override = null;
const usd = await effectivePriceUsd({ ...p, _source: "api2", _source_id: p.api_source_id, id: `ext_${p.api_source_id}_${p.external_id}` }, override, Number(src?.markup_percent ?? markup), socialMarkup, socialKws, categoryMarkup, userMarkupPercent);
const syp = Math.round(usd * rate);
const name = p.custom_name ?? p.name;
return Markup.button.callback(`🛒 ${name} • ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س`.slice(0, 60), `api2prod:${p.id}:${catId}`);
}))).filter(Boolean);

const allBtns = [...subBtns, ...prodBtns];
const totalPages = Math.max(1, Math.ceil(allBtns.length / PAGE_SIZE));
const safe = Math.min(Math.max(1, page), totalPages);
const slice = allBtns.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE);

const rows = [];
for (const b of slice) rows.push([b]);
const nav = [];
if (safe > 1) nav.push(Markup.button.callback(prevLabel, `api2cat:${catId}:${safe - 1}:${backTo}`));
nav.push(Markup.button.callback(`${safe}/${totalPages}`, "noop"));
if (safe < totalPages) nav.push(Markup.button.callback(nextLabel, `api2cat:${catId}:${safe + 1}:${backTo}`));
if (nav.length > 1) rows.push(nav);
if (isAdmin) {
rows.push([Markup.button.callback("📁 نقل القسم إلى قسم", `adm:moveApi2CatToParent:${cat.id}`)]);
rows.push([Markup.button.callback("🗑️ حذف القسم", `adm:deleteApi2Cat:${cat.id}`)]);
}
rows.push([backBtn, Markup.button.callback(homeLabel, "home")]);
await sendOrEdit(ctx, `📂 ${cat.name}`, Markup.inlineKeyboard(rows));
}

async function showApi2Product(ctx, prodId, backTo) {
const [backLabel, homeLabel, u, sessionActive] = await Promise.all([getBtnBackLabel(), getBtnHomeLabel(), getUser(ctx.from.id), isAdminSessionActive(ctx.from.id)]);
const isAdmin = !!u?.is_admin && (authedAdminIds.has(ctx.from.id) || sessionActive);
const isSuperAdmin = !!u?.is_super_admin && isAdmin;
let backBtn;
if (backTo === 0) backBtn = Markup.button.callback(backLabel, "cat:0:1:0");
else {
const parentIsCat = (await q("SELECT id FROM api_source_categories WHERE id=$1", [backTo])).rows[0];
backBtn = parentIsCat ? Markup.button.callback(backLabel, `api2cat:${backTo}:1:0`) : Markup.button.callback(backLabel, `cat:${backTo}:1:0`);
}

const pRes = await q("SELECT * FROM api_source_products WHERE id=$1", [prodId]);
const p = pRes.rows[0];
if (!p || !p.available || (p.admin_hidden && !isAdmin)) { await sendOrEdit(ctx, "⚠️ المنتج غير متاح.", Markup.inlineKeyboard([[backBtn, Markup.button.callback(homeLabel, "home")]])); return; }

const [rate, display] = await Promise.all([
getExchangeRate(),
getApi2DisplayData(p, ctx.from.id),
]);
const usd = display.priceUsd;
const syp = Math.round(usd * rate);

const qtyDisplay = parseQtyValues(p.qty_values);
let qtyInfo = qtyDisplay.kind === "fixed"
  ? "الكمية: 1 (ثابتة)"
  : qtyDisplay.kind === "list"
    ? `الكميات المتاحة: ${qtyDisplay.values.join(", ")}`
    : `الكمية بين ${qtyDisplay.min.toLocaleString("en-US")} و ${qtyDisplay.max.toLocaleString("en-US")}`;

let text = `🛒 ${p.custom_name ?? p.name}\n`;
if (p.category_name) text += `القسم: ${p.category_name}\n`;
text += `السعر: ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س\n`;
if (qtyInfo) text += `${qtyInfo}\n`;
if (p.notes) text += `\n📋 ${p.notes}`;

const rows = [
[Markup.button.callback("🛒 طلب الآن", `api2buy:${p.id}:${backTo}`)],
];
if (isAdmin) {
rows.push([Markup.button.callback("📝 تعديل اسم المنتج", `adm:api2RenameProd:${p.id}`), Markup.button.callback(p.admin_hidden ? "👁 إظهار المنتج" : "🙈 إخفاء المنتج", `adm:api2HideProd:${p.id}`)]);
if (isSuperAdmin || !!u?.can_delete_products) rows.push([Markup.button.callback("🗑️ حذف المنتج", `adm:deleteApi2Prod:${p.id}`)]);
}
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
if (!resp?.data) return null;
if (Array.isArray(resp.data)) return resp.data[0] ?? null;
return resp.data;
}

function extractApiStatuses(resp) {
const values = [];
const seen = new Set();
const walk = (value, key = "") => {
  if (value == null) return;
  if (Array.isArray(value)) { for (const item of value) walk(item, key); return; }
  if (typeof value !== "object") {
    if (/status|state|result/i.test(key)) {
      const n = String(value).trim().toLowerCase();
      if (n && !seen.has(n)) { seen.add(n); values.push(n); }
    }
    return;
  }
  for (const [k, v] of Object.entries(value)) walk(v, k);
};
walk(resp);
return values;
}

function getBestApiStatus(resp) {
const statuses = extractApiStatuses(resp);
const accepted = statuses.find(s => ACCEPT_STATUSES.has(s) || ["1","true"].includes(s));
if (accepted) return accepted;
const rejected = statuses.find(s => REJECT_STATUSES.has(s) || ["0","false"].includes(s));
if (rejected) return rejected;
// Some order endpoints expose an error only as a numeric code (for example
// insufficient balance / invalid quantity) without a textual status. Treat a
// documented 1xx-style order error with a message as a rejection so the order
// cannot remain pending forever.
let numericError = false;
const walkError = value => {
if (numericError || value == null) return;
if (Array.isArray(value)) { for (const item of value) walkError(item); return; }
if (typeof value !== "object") return;
for (const [k, v] of Object.entries(value)) {
if (/^(?:code|error_code|errorCode)$/i.test(k) && [100,105,106,109,110].includes(Number(v))) numericError = true;
else if (typeof v === "object") walkError(v);
}
};
walkError(resp);
if (numericError) return "error";
return statuses.find(s => !["pending","wait","waiting","processing","in_progress","in-progress","queued","queue","new"].includes(s)) || statuses[0] || "";
}

function extractProviderOrderId(resp) {
const preferred = ["order_id","orderId","order_number","orderNumber","provider_order_id","providerOrderId","order_uuid","orderUuid","uuid"];
let found = null;
const walk = value => {
  if (found != null || value == null) return;
  if (Array.isArray(value)) { for (const item of value) walk(item); return; }
  if (typeof value !== "object") return;
  for (const key of preferred) {
    if (value[key] != null && String(value[key]).trim()) { found = String(value[key]); return; }
  }
  for (const v of Object.values(value)) walk(v);
};
walk(resp);
return found;
}

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

function formatFullApiResponse(resp) {
return formatApiResponseClean(resp);
}

function parseQtyValues(qv) {
if (qv == null || qv === "") return { kind: "fixed" };
if (typeof qv === "string") {
  const text = qv.trim();
  if (!text) return { kind: "fixed" };
  try { return parseQtyValues(JSON.parse(text)); } catch {}
  const n = Number(text.replace(/,/g, ""));
  if (Number.isFinite(n) && n > 0) return { kind: "list", values: [n] };
  const m = text.match(/^(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)$/);
  if (m) return { kind: "range", min: Math.min(Number(m[1]), Number(m[2])), max: Math.max(Number(m[1]), Number(m[2])) };
  return { kind: "fixed" };
}
if (Array.isArray(qv)) {
  const values = qv.map(v => Number(v)).filter(Number.isFinite).filter(v => v > 0);
  if (!values.length) return { kind: "fixed" };
  return { kind: "list", values };
}
if (typeof qv === "number") return qv > 0 ? { kind: "list", values: [qv] } : { kind: "fixed" };
const min = Number(qv.min ?? qv.minimum ?? qv.min_qty ?? qv.min_quantity ?? qv.from);
const max = Number(qv.max ?? qv.maximum ?? qv.max_qty ?? qv.max_quantity ?? qv.to ?? qv.min ?? qv.minimum);
if (Number.isFinite(min) && min > 0 && Number.isFinite(max) && max > 0) return { kind: "range", min: Math.min(min,max), max: Math.max(min,max) };
return { kind: "fixed" };
}

function statusLabel(s) {
const n = (s ?? "").toString().toLowerCase().trim();
if (ACCEPT_STATUSES.has(n) || n === "1" || n === "true") return "✅ مقبول";
if (REJECT_STATUSES.has(n) || n === "0" || n === "false") return "❌ مرفوض";
return "⏳ انتظار";
}

function formatPriceLabel(qty, unitPriceUsd) {
if (!unitPriceUsd || unitPriceUsd <= 0) return `${Number(qty).toLocaleString("en-US")}`;
const total = unitPriceUsd * qty;
if (total <= 0) return `${Number(qty).toLocaleString("en-US")}`;
let totalStr;
if (total >= 1) totalStr = total.toFixed(2);
else if (total >= 0.01) totalStr = total.toFixed(3);
else if (total >= 0.001) totalStr = total.toFixed(4);
else totalStr = total.toFixed(6);
if (parseFloat(totalStr) === 0) totalStr = total.toFixed(8);
return `${Number(qty).toLocaleString("en-US")} — ${totalStr}$`;
}

async function startOrderFlow(ctx, productId, backTo) {
let all = await getCachedProducts();
let p = all.find(x => x.id === productId);
if (!p) { all = await fetchAllProducts(); p = all.find(x => x.id === productId); }
if (!p) { await ctx.reply("⚠️ المنتج غير موجود."); return; }
if (!p.available) { await ctx.reply("⚠️ هذا المنتج غير متاح حالياً."); return; }

const [ovMap, markup, socialKws, socialMarkup, user] = await Promise.all([
loadOverrideMap([p.id]),
getMarkupPercent(),
getSocialKeywords(),
getSocialMarkupPercent(),
getUser(ctx.from.id),
]);
const ov = ovMap.get(p.id);
const userMarkup = user?.custom_markup_percent != null ? Number(user.custom_markup_percent) : null;
const unitPriceUsd = await effectivePriceUsd(p, ov, markup, socialMarkup, socialKws, null, userMarkup);
const paramKeys = Array.isArray(p.params) ? p.params : [];
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
await ctx.reply(`📋 أدخل قيمة الحقل: ${key}`, Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "ord:cancel")]]));
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
const text = `🧾 تأكيد الطلب\n\n🛒 المنتج: ${p.name}\n🔢 الكمية: ${qty.toLocaleString("en-US")}\n${paramsLines ? paramsLines + "\n" : ""}💰 الإجمالي: ${totalUsdStr}$ | ${totalSyp.toLocaleString("en-US")} ل.س\n💳 رصيدك: ${formatBalance(balance, rate)}\n\n${lowBalance ? "❌ ليس لديك رصيد كافٍ. يرجى شحن رصيدك ثم المحاولة مجدداً." : "هل تريد تأكيد الطلب؟"}`;
const rows = lowBalance
? [[Markup.button.callback("💳 شحن رصيد", "deposit")], [Markup.button.callback("❌ إلغاء", "ord:cancel")]]
: [[Markup.button.callback("✅ تأكيد وتنفيذ", "ord:confirm"), Markup.button.callback("❌ إلغاء", "ord:cancel")]];
await sendOrEdit(ctx, text, Markup.inlineKeyboard(rows));
}

async function waitForOrderCompletion(orderUuid, source, orderId, maxAttempts = 30, delayMs = 5000) {
let lastResp = null;
for (let i = 0; i < maxAttempts; i++) {
await new Promise(r => setTimeout(r, delayMs));
let resp = null;
if (source?._source === "api2" && source._source_id) {
const src = await getApiSource(source._source_id).catch(() => null);
if (src) {
resp = await checkApiSourceOrder(src, orderId, false).catch(() => null);
if (!resp) resp = await checkApiSourceOrder(src, orderUuid, true).catch(() => null);
}
} else {
resp = await checkOrder(orderId, false).catch(() => null);
if (!resp) resp = await checkOrder(orderUuid, true).catch(() => null);
}
if (!resp) continue;
lastResp = resp;
const orderData = extractOrderData(resp);
const status = getBestApiStatus(resp);
if (ACCEPT_STATUSES.has(status) || REJECT_STATUSES.has(status)) return { resp, finalStatus: status, completed: true };
}
return { resp: lastResp, finalStatus: "timeout", completed: false };
}

const _orderExecutionLocks = new Set();

async function executeOrder(ctx) {
const userId = Number(ctx.from.id);
if (_orderExecutionLocks.has(userId)) {
await ctx.reply("⏳ جاري تنفيذ طلبك، انتظر قليلاً...");
return;
}
_orderExecutionLocks.add(userId);
try {
await executeOrderLocked(ctx);
} finally {
_orderExecutionLocks.delete(userId);
}
}

async function executeOrderLocked(ctx) {
const step = getStep(ctx.from.id);
if (step.kind !== "order:params") return;
let all = await getCachedProducts();
let p = all.find(x => x.id === step.productId);
if (!p && step._api2 && step._api2_id) {
const pRes = await q("SELECT * FROM api_source_products WHERE id=$1", [step._api2_id]);
const row = pRes.rows[0];
if (row) {
p = {
  id: `ext_${row.api_source_id}_${row.external_id}`,
  name: row.custom_name ?? row.name,
  category_name: row.category_name,
  price: row.price,
  base_price: row.base_price,
  rate: row.rate,
  params: row.params,
  qty_values: row.qty_values,
  available: row.available,
  _source: "api2",
  _source_id: row.api_source_id,
  _external_id: row.external_id,
  cancel_enabled: row.cancel_enabled,
  cancel_seconds: row.cancel_seconds,
  cancel_url: row.cancel_url,
};
}
}
if (!p) { all = await fetchAllProducts(); p = all.find(x => x.id === step.productId); }
if (!p) { await ctx.reply("⚠️ المنتج غير موجود."); return; }
if (!p.available || (p._source === "api2" && p.admin_hidden)) { await ctx.reply("⚠️ هذا المنتج لم يعد متاحاً حالياً."); return; }

const totalUsd = Number((step.priceUsd * step.qty).toFixed(4));
if (!Number.isFinite(totalUsd) || totalUsd <= 0) {
await ctx.reply("⚠️ تعذر حساب قيمة الطلب.");
setStep(ctx.from.id, { kind: "idle" });
return;
}

await clearInlineKeyboard(ctx).catch(() => {});
const orderUuid = crypto.randomUUID();
// Atomic balance deduction prevents two simultaneous confirmations from spending
// the same balance.
invalidateUserCache(ctx.from.id);
const charged = await q(
  "UPDATE users SET balance=balance-$1 WHERE id=$2 AND balance >= $1 RETURNING *",
  [totalUsd, ctx.from.id]
);
if (!charged.rows.length) {
await ctx.reply("❌ ليس لديك رصيد كافٍ.", Markup.inlineKeyboard([[Markup.button.callback("💳 شحن رصيد", "deposit")], [Markup.button.callback("🏠 الرئيسية", "home")]]));
setStep(ctx.from.id, { kind: "idle" });
return;
}
userCacheSet(ctx.from.id, charged.rows[0]);
const execRate = await getExchangeRate();
const totalSyp = Math.round(totalUsd * execRate);
const params = { ...step.collected };
if (step.qty && step.qty !== 1) params.qty = step.qty;

let insRes;
try {
insRes = await q(
`INSERT INTO orders(user_id,product_id,product_name,qty,params,price_usd,oranos_uuid,status,api_source_id,cancel_enabled,cancel_seconds,cancel_url,cancel_available_at)
VALUES($1,$2,$3,$4,$5,$6,$7,'pending',$8,$9,$10,$11,$12) RETURNING *`,
[ctx.from.id, p.id, p.name, String(step.qty), JSON.stringify(step.collected), String(totalUsd), orderUuid, p._source === "api2" ? p._source_id : null, p._source === "api2" ? !!p.cancel_enabled && !!p.cancel_url && Number(p.cancel_seconds) > 0 : false, p._source === "api2" ? (Number(p.cancel_seconds) || null) : null, p._source === "api2" ? (p.cancel_url || null) : null, p._source === "api2" && p.cancel_enabled && p.cancel_url && Number(p.cancel_seconds) > 0 ? new Date(Date.now() + Number(p.cancel_seconds) * 1000) : null]
);
} catch (e) {
await adjustBalance(ctx.from.id, totalUsd);
throw e;
}

const order = insRes.rows[0];
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply(
`⏳ جاري تنفيذ طلبك...\n🛒 ${p.name} × ${step.qty}\n💰 ${totalUsd.toFixed(2)}$ | ${totalSyp.toLocaleString("en-US")} ل.س`,
Markup.inlineKeyboard([[Markup.button.callback("🔄 تحديث الحالة", `ord:check:${order.id}`)], [Markup.button.callback("🏠 الرئيسية", "home")]])
);

// لا ننتظر تنفيذ الـAPI داخل رسالة المستخدم. التنفيذ والفحص يعملان بالخلفية.
processOrderInBackground(order, p, params, totalUsd, totalSyp).catch(async err => {
console.error("Background order execution failed:", err);
try {
const updated = await q("UPDATE orders SET status='reject', api_response=$1 WHERE id=$2 AND status='pending' RETURNING id", [JSON.stringify({ status: "ERR", message: err?.message ?? "خطأ غير معروف" }), order.id]);
if (updated.rows.length) {
await adjustBalance(order.user_id, totalUsd).catch(() => {});
await _botRef?.telegram.sendMessage(order.user_id, `❌ تعذر تنفيذ الطلب.\n💰 تمت إعادة ${totalUsd.toFixed(2)}$ إلى رصيدك.`, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]])).catch(() => {});
}
} catch {}
});
}

async function processOrderInBackground(order, p, params, totalUsd, totalSyp) {
let resp;
try {
if (p._source === "api2" && p._source_id) {
const src = await getApiSource(p._source_id);
if (!src) throw new Error("مصدر المنتجات غير موجود");
resp = await placeApiSourceOrder(src, p._external_id, params, order.oranos_uuid, Number(order.qty) || 1);
} else {
resp = await placeOrder(p.id, params, order.oranos_uuid);
}
} catch (e) {
resp = { status: "ERR", message: e?.message ?? "خطأ شبكة" };
}

const initialStatus = getBestApiStatus(resp);
const orderApiId = extractProviderOrderId(resp) || order.oranos_uuid;

if (REJECT_STATUSES.has(initialStatus) || initialStatus === "err") {
const updated = await q(
"UPDATE orders SET status='reject', oranos_order_id=$1, api_response=$2 WHERE id=$3 AND status='pending' RETURNING id",
[orderApiId, JSON.stringify(resp), order.id]
);
if (!updated.rows.length) return;
await adjustBalance(order.user_id, totalUsd);
const reason = extractDeliveredCode(resp) || (resp?.message && resp.message !== "Network error" ? resp.message : null);
await _botRef?.telegram.sendMessage(
order.user_id,
`❌ تم رفض الطلب.${reason ? `\n📋 السبب: ${reason}` : ""}\n💰 تمت إعادة ${totalUsd.toFixed(2)}$ | ${totalSyp.toLocaleString("en-US")} ل.س إلى رصيدك.`,
Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]])
).catch(() => {});
return;
}

if (ACCEPT_STATUSES.has(initialStatus)) {
const deliveredCode = extractDeliveredCode(resp);
const updated = await q(
"UPDATE orders SET status='accept', oranos_order_id=$1, api_response=$2, delivered_code=$3 WHERE id=$4 AND status='pending' RETURNING id",
[orderApiId, JSON.stringify(resp), deliveredCode ?? null, order.id]
);
if (!updated.rows.length) return;
const lines = [`✅ تم تنفيذ طلبك بنجاح!`, `🛒 ${p.name} × ${order.qty}`, `💰 ${totalUsd.toFixed(2)}$ | ${totalSyp.toLocaleString("en-US")} ل.س`];
if (deliveredCode) lines.push(`\n🔑 تفاصيل الطلب:\n\n${deliveredCode}`);
await _botRef?.telegram.sendMessage(order.user_id, lines.join("\n"), Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]])).catch(() => {});
return;
}

// الطلب لم يُحسم بعد: نحفظ رقم الطلب ونترك الـpoller يفحصه كل عدة ثوانٍ.
await q(
"UPDATE orders SET status='pending', oranos_order_id=$1, api_response=$2 WHERE id=$3 AND status='pending'",
[orderApiId, JSON.stringify(resp), order.id]
);
await fastPollOrder(order.id, 5, 1200);
}

async function showMyOrders(ctx, page) {
const limit = 8; const offset = (page - 1) * limit;
const res = await q("SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3", [ctx.from.id, limit + 1, offset]);
const hasNext = res.rows.length > limit; const slice = res.rows.slice(0, limit);
if (!slice.length) { await sendOrEdit(ctx, "📭 لا يوجد لديك أي طلبات بعد.", Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]])); return; }
const lines = slice.map(r => `🛒 ${r.product_name} ×${r.qty} • ${Number(r.price_usd).toFixed(2)}$ • ${statusLabel(r.status)}`);
const orderRows = [];
for (const r of slice) {
const row = [];
if (r.status === "pending") row.push(Markup.button.callback("🔄 الحالة", `ord:check:${r.id}`));
if (r.status === "pending" && r.cancel_enabled && r.cancel_url && r.cancel_available_at && new Date(r.cancel_available_at).getTime() <= Date.now()) row.push(Markup.button.callback("❌ إلغاء الطلب", `api2cancel:${r.id}`));
if (row.length) orderRows.push(row);
}
const navRow = [];
if (page > 1) navRow.push(Markup.button.callback("⬅️ السابق", `myorders:${page - 1}`));
if (hasNext) navRow.push(Markup.button.callback("التالي ➡️", `myorders:${page + 1}`));
const kb = [];
for (const row of orderRows) kb.push(row);
if (navRow.length) kb.push(navRow);
kb.push([Markup.button.callback("🏠 الرئيسية", "home")]);
await sendOrEdit(ctx, `📦 طلباتي\n\n${lines.join("\n")}`, Markup.inlineKeyboard(kb));
}

function buildCancelUrl(rawUrl, source, order) {
if (!rawUrl) return null;
let url = String(rawUrl).trim();
const orderId = encodeURIComponent(String(order.oranos_order_id ?? ""));
const uuid = encodeURIComponent(String(order.oranos_uuid ?? ""));
url = url.replace(/\{(?:order_id|orderId|id)\}/gi, orderId)
.replace(/\{(?:order_uuid|orderUuid|uuid)\}/gi, uuid);
if (url.startsWith("/")) url = `${String(source.base_url).replace(/\/+$/, "")}${url}`;
return url;
}

function cancellationConfirmed(resp) {
const values = [];
const walk = v => {
if (v == null) return;
if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") values.push(String(v).toLowerCase());
else if (Array.isArray(v)) v.forEach(walk);
else if (typeof v === "object") Object.values(v).forEach(walk);
};
walk(resp);
const text = values.join(" ");
const hasExplicitCancel = /cancelled|canceled|cancellation\s*(successful|success|done|ok)|cancel\s*(successful|success|done|ok)/.test(text);
const hasSuccessFlag = /(?:^|[\s:_-])(success|successful|ok|true|done|completed)(?:$|[\s:_-])/.test(text) && !/error|failed|rejected|denied/.test(text);
return hasExplicitCancel || hasSuccessFlag;
}

async function requestApiSourceCancellation(source, order) {
const url = buildCancelUrl(order.cancel_url, source, order);
if (!url) return { ok: false, response: { status: "NO_CANCEL_URL" } };
try {
const client = getApiSourceClient(source);
const res = await client.get(url);
return { ok: cancellationConfirmed(res.data), response: res.data };
} catch (err) {
return { ok: false, response: err?.response?.data ?? { status: "ERR", message: err?.message ?? "Cancellation request failed" } };
}
}

async function refundCancelledOrder(order, bot, ctx = null) {
const client = await pool.connect();
try {
await client.query("BEGIN");
const locked = (await client.query("SELECT * FROM orders WHERE id=$1 FOR UPDATE", [order.id])).rows[0];
if (!locked || Number(locked.user_id) !== Number(order.user_id) || locked.status === "cancelled" || locked.refunded_at) {
await client.query("ROLLBACK");
return false;
}
await client.query("UPDATE orders SET status='cancelled', refunded_at=NOW(), api_response=$1 WHERE id=$2", [JSON.stringify(order._cancelResponse ?? {}), order.id]);
await client.query("UPDATE users SET balance=balance+$1 WHERE id=$2", [Number(locked.price_usd), locked.user_id]);
await client.query("COMMIT");
const rate = await getExchangeRate();
const syp = Math.round(Number(locked.price_usd) * rate);
const telegram = bot?.telegram ?? ctx?.telegram;
if (telegram) await telegram.sendMessage(locked.user_id, `✅ تم إلغاء الطلب بنجاح.\n🛒 ${locked.product_name}\n💰 تمت إعادة ${Number(locked.price_usd).toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س إلى رصيدك.`, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]])).catch(() => {});
return true;
} catch (e) {
try { await client.query("ROLLBACK"); } catch {}
throw e;
} finally { client.release(); }
}

async function cancelApi2Order(ctx, orderId) {
const row = (await q("SELECT * FROM orders WHERE id=$1", [orderId])).rows[0];
if (!row || Number(row.user_id) !== Number(ctx.from.id) || !row.api_source_id) { await ctx.reply("⚠️ الطلب غير موجود."); return; }
if (row.status !== "pending") { await ctx.reply("⚠️ لا يمكن إلغاء هذا الطلب بعد تغير حالته."); return; }
if (!row.cancel_enabled || !row.cancel_url || !row.cancel_seconds) { await ctx.reply("⚠️ هذا المنتج لا يدعم الإلغاء."); return; }
const availableAt = row.cancel_available_at ? new Date(row.cancel_available_at).getTime() : new Date(row.created_at).getTime() + Number(row.cancel_seconds) * 1000;
if (Date.now() < availableAt) { const remaining = Math.ceil((availableAt - Date.now()) / 1000); await ctx.reply(`⏳ لا يمكن إلغاء الطلب الآن. الإلغاء يصبح متاحاً بعد ${remaining} ثانية.`); return; }
const src = await getApiSource(row.api_source_id);
if (!src) { await ctx.reply("⚠️ مصدر المنتجات غير موجود."); return; }
await ctx.reply("⏳ جاري إلغاء الطلب والتحقق من العملية...");
const result = await requestApiSourceCancellation(src, row);
if (!result.ok) { await ctx.reply(`❌ لم يتم تأكيد إلغاء الطلب.\nالتفاصيل: ${formatApiResponseClean(result.response) || "غير معروف"}`); return; }
row._cancelResponse = result.response;
const refunded = await refundCancelledOrder(row, null, ctx);
if (!refunded) { await ctx.reply("⚠️ تم إرسال الإلغاء لكن تعذر تسجيل إعادة الرصيد."); return; }
await ctx.reply("✅ تم إلغاء الطلب وإعادة قيمته إلى رصيدك.", Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
}

async function checkOrderStatus(ctx, orderId) {
const row = (await q("SELECT * FROM orders WHERE id=$1", [orderId])).rows[0];
if (!row || Number(row.user_id) !== Number(ctx.from.id)) { await ctx.reply("⚠️ غير موجود."); return; }
if (!row.oranos_order_id && !row.oranos_uuid) {
await ctx.reply(`الحالة الحالية لطلبك: ${statusLabel(row.status)}`, Markup.inlineKeyboard([[Markup.button.callback("🔄 تحديث الحالة", `ord:check:${row.id}`)], [Markup.button.callback("🏠 الرئيسية", "home")]]));
return;
}
try {
let resp;
if (row.api_source_id) {
const src = await getApiSource(row.api_source_id);
if (!src) throw new Error("مصدر المنتجات غير موجود");
resp = await checkApiSourceOrder(src, row.oranos_order_id, false);
const firstStatus = getBestApiStatus(resp);
if (!ACCEPT_STATUSES.has(firstStatus) && !REJECT_STATUSES.has(firstStatus) && row.oranos_uuid) {
  const uuidResp = await checkApiSourceOrder(src, row.oranos_uuid, true);
  if (uuidResp) {
    const uuidStatus = getBestApiStatus(uuidResp);
    if (ACCEPT_STATUSES.has(uuidStatus) || REJECT_STATUSES.has(uuidStatus) || !firstStatus) resp = uuidResp;
    else if (uuidStatus !== firstStatus) resp = uuidResp;
  }
}
} else {
resp = await checkOrder(row.oranos_order_id, false);
const firstStatus = getBestApiStatus(resp);
if (!ACCEPT_STATUSES.has(firstStatus) && !REJECT_STATUSES.has(firstStatus) && row.oranos_uuid) {
  const uuidResp = await checkOrder(row.oranos_uuid, true);
  if (uuidResp) {
    const uuidStatus = getBestApiStatus(uuidResp);
    if (ACCEPT_STATUSES.has(uuidStatus) || REJECT_STATUSES.has(uuidStatus) || !firstStatus) resp = uuidResp;
    else if (uuidStatus !== firstStatus) resp = uuidResp;
  }
}
}
const rawNew = getBestApiStatus(resp) || String(row.status ?? "").toLowerCase();
const isRejected = REJECT_STATUSES.has(rawNew);
const isAccepted = ACCEPT_STATUSES.has(rawNew);
const finalStatus = isRejected ? "reject" : isAccepted ? "accept" : "pending";
const code = extractDeliveredCode(resp);
let latest = row.status;
if (finalStatus !== row.status) {
const updateSql = "UPDATE orders SET status=$1, api_response=$2" + (code ? ", delivered_code=$3" : "") + " WHERE id=" + (code ? "$4" : "$3") + " AND status=$" + (code ? "5" : "4") + " RETURNING id";
const updateParams = code ? [finalStatus, JSON.stringify(resp), code, row.id, row.status] : [finalStatus, JSON.stringify(resp), row.id, row.status];
const updated = await q(updateSql, updateParams);
if (updated.rows.length) {
if (isRejected) {
await adjustBalance(ctx.from.id, Number(row.price_usd));
latest = "reject";
} else if (isAccepted) latest = "accept";
} else {
latest = (await q("SELECT status FROM orders WHERE id=$1", [row.id])).rows[0]?.status ?? finalStatus;
}
} else {
latest = row.status;
}
if (latest === "accept") {
await ctx.reply(code ? `✅ تم تنفيذ طلبك بنجاح.\n🔑 تفاصيل الطلب:\n\n${code}` : "✅ تم تنفيذ طلبك بنجاح.", Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
return;
}
if (latest === "reject") {
await ctx.reply("❌ تم رفض طلبك. تمت إعادة المبلغ إلى رصيدك.", Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
return;
}
await ctx.reply("⏳ طلبك ما زال قيد التنفيذ.", Markup.inlineKeyboard([[Markup.button.callback("🔄 تحديث الحالة", `ord:check:${row.id}`)], [Markup.button.callback("🏠 الرئيسية", "home")]]));
} catch (e) {
console.error("checkOrderStatus failed:", e);
await ctx.reply("⚠️ تعذّر فحص الحالة الآن.", Markup.inlineKeyboard([[Markup.button.callback("🔄 المحاولة مجدداً", `ord:check:${row.id}`)], [Markup.button.callback("🏠 الرئيسية", "home")]]));
}
}

async function pollOneOrder(bot, order) {
const identifiers = [];
if (order.oranos_order_id) identifiers.push({ value: String(order.oranos_order_id), byUuid: false });
if (order.oranos_uuid) identifiers.push({ value: String(order.oranos_uuid), byUuid: true });
for (const ident of identifiers) {
  let resp = null;
  if (order.api_source_id) {
    const src = await getApiSource(order.api_source_id).catch(() => null);
    if (src) resp = await checkApiSourceOrder(src, ident.value, ident.byUuid).catch(() => null);
  } else {
    resp = await checkOrder(ident.value, ident.byUuid).catch(() => null);
  }
  if (!resp) continue;
  const rawNew = getBestApiStatus(resp);
  if (!rawNew || ["err","error"].includes(String(rawNew).toLowerCase())) continue;
  const isRejected = REJECT_STATUSES.has(rawNew) || ["0","false"].includes(rawNew);
  const isAccepted = ACCEPT_STATUSES.has(rawNew) || ["1","true"].includes(rawNew);
  if (!isRejected && !isAccepted) continue;
  const finalStatus = isRejected ? "reject" : "accept";
  const code = extractDeliveredCode(resp);
  const updateSql = "UPDATE orders SET status=$1, api_response=$2" + (code ? ", delivered_code=$3" : "") + " WHERE id=" + (code ? "$4" : "$3") + " AND status=$" + (code ? "5" : "4") + " RETURNING id";
  const updateParams = code ? [finalStatus, JSON.stringify(resp), code, order.id, order.status] : [finalStatus, JSON.stringify(resp), order.id, order.status];
  const updated = await q(updateSql, updateParams);
  if (!updated.rows.length) return false;

  const priceUsd = Number(order.price_usd);
  const rate = await getExchangeRate();
  if (isRejected) {
    await adjustBalance(order.user_id, priceUsd);
    const refundSyp = Math.round(priceUsd * rate);
    await bot.telegram.sendMessage(order.user_id, `❌ تم رفض طلبك.\n💰 تمت إعادة ${priceUsd.toFixed(2)}$ | ${refundSyp.toLocaleString("en-US")} ل.س إلى رصيدك.`, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]])).catch(() => {});
  } else {
    const priceSyp = Math.round(priceUsd * rate);
    const message = code
      ? `✅ تم تنفيذ طلبك بنجاح!\n🛒 ${order.product_name} × ${order.qty}\n💰 ${priceUsd.toFixed(2)}$ | ${priceSyp.toLocaleString("en-US")} ل.س\n\n🔑 تفاصيل الطلب:\n\n${code}`
      : `✅ تم تنفيذ طلبك بنجاح!\n🛒 ${order.product_name} × ${order.qty}\n💰 ${priceUsd.toFixed(2)}$ | ${priceSyp.toLocaleString("en-US")} ل.س`;
    await bot.telegram.sendMessage(order.user_id, message, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]])).catch(() => {});
  }
  return true;
}
return false;
}

async function fastPollOrder(orderId, attempts = 5, delayMs = 1200) {
if (!_botRef) return;
for (let i = 0; i < attempts; i++) {
  await new Promise(r => setTimeout(r, delayMs));
  const row = (await q("SELECT * FROM orders WHERE id=$1", [orderId])).rows[0];
  if (!row || row.status !== "pending") return;
  const done = await pollOneOrder(_botRef, row).catch(() => false);
  if (done) return;
}
}

function startOrderPoller(bot) {
let polling = false;
setInterval(async () => {
if (polling) return;
polling = true;
try {
const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
const res = await q(
"SELECT * FROM orders WHERE status != ALL($1) AND created_at > $2 LIMIT 200",
[TERMINAL_STATUSES, cutoff]
);
const CHUNK = 10;
for (let i = 0; i < res.rows.length; i += CHUNK) {
await Promise.allSettled(res.rows.slice(i, i + CHUNK).map(order => pollOneOrder(bot, order).catch(() => {})));
}
} catch (e) {
console.error("Order poller failed:", e.message);
} finally {
polling = false;
}
}, 2_000).unref();
}


// ============================================================
//  ADMIN / ROLE PERMISSIONS
//  - كل المدراء يصلون لميزات الإدارة العادية.
//  - المدير الأعلى وحده يعيّن/يلغي المدير الأعلى.
//  - حذف المنتجات للمدير الأعلى، أو لمدير منحه المدير الأعلى الصلاحية.
// ============================================================
async function requireAdmin(ctx) {
const [sessionActive, u] = await Promise.all([
isAdminSessionActive(ctx.from.id),
getUser(ctx.from.id),
]);
if (!u?.is_admin) {
authedAdminIds.delete(ctx.from.id);
await setAdminSession(ctx.from.id, false).catch(() => {});
await ctx.reply("⛔ هذا القسم للإدارة فقط.");
return false;
}
if (!sessionActive && !authedAdminIds.has(ctx.from.id)) {
setStep(ctx.from.id, { kind: "admin:login" });
await ctx.reply("🔑 أرسل كلمة المرور للدخول إلى لوحة الإدارة:");
return false;
}
if (!sessionActive && authedAdminIds.has(ctx.from.id)) {
authedAdminIds.delete(ctx.from.id);
setStep(ctx.from.id, { kind: "admin:login" });
await ctx.reply("🔑 انتهت جلسة الإدارة. أرسل كلمة المرور للدخول مجدداً:");
return false;
}
return true;
}

async function requireSuperAdmin(ctx) {
if (!authedAdminIds.has(ctx.from.id)) { await ctx.reply("⛔ هذا الإجراء للمدير الأعلى فقط."); return false; }
const u = await getUser(ctx.from.id);
if (!u?.is_super_admin) { await ctx.reply("⛔ هذا الإجراء للمدير الأعلى فقط."); return false; }
return true;
}

async function requireProductDelete(ctx) {
if (!(await requireAdmin(ctx))) return false;
const u = await getUser(ctx.from.id);
if (!u?.is_super_admin && !u?.can_delete_products) {
await ctx.reply("⛔ حذف المنتجات متاح للمدير الأعلى أو للمدير الذي منحه المدير الأعلى هذه الصلاحية.");
return false;
}
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
[Markup.button.callback("📁 أقسام يدوية", "adm:manualCats"), Markup.button.callback("➕ منتج يدوي", "adm:manualProds")],
[Markup.button.callback("🔌 مصادر المنتجات", "adm:apiSources"), Markup.button.callback("🛟 مساعد الإدارة", "adm:aiSupport")],
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
const depNotif = (await getSetting("deposit_admin_notifications")) === "on";
rows.push([Markup.button.callback("🔐 تغيير أمر الدخول السري", "adm:changeLoginCmd")]);
rows.push([Markup.button.callback(depNotif ? "🔔 إشعارات الإيداع: مفعلة" : "🔕 إشعارات الإيداع: متوقفة", "adm:depositNotifToggle")]);
rows.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
await sendOrEdit(ctx, `⚙️ الإعدادات\n\nالربح العام: ${m}%\nربح السوشل: ${sm}%\nسعر الصرف: ${r} ل.س/$\nأمر الدخول: ${loginCmd}\nإشعارات طلبات الإيداع: ${depNotif ? "مفعلة" : "متوقفة"}`,
Markup.inlineKeyboard(rows));
}

async function showDepList(ctx, page) {
if (!(await requireAdmin(ctx))) return;
const limit = 8; const offset = (page - 1) * limit;
const res = await q("SELECT * FROM deposit_requests WHERE status='pending' ORDER BY created_at DESC LIMIT $1 OFFSET $2", [limit + 1, offset]);
const hasNext = res.rows.length > limit; const slice = res.rows.slice(0, limit);
if (!slice.length) { await sendOrEdit(ctx, "📭 لا توجد طلبات إيداع معلقة.", Markup.inlineKeyboard([[Markup.button.callback("⬅️ رجوع", "admin:menu")]])); return; }
const kb = slice.map(d => [Markup.button.callback(`${d.method_name} • ${d.amount ? Number(d.amount).toFixed(2) + "$" : "—"} • UID:${d.user_id}`, `adm:depShow:${d.id}`)]);
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
const text = `📥 طلب إيداع\nالحالة: ${d.status}\nالطريقة: ${d.method_name}\nالمستخدم: ${u?.first_name ?? ""} ${u?.username ? "@" + u.username : ""} (${d.user_id})\nرصيد المستخدم: ${u ? Number(u.balance).toFixed(2) : "0.00"}$\nالمبلغ المُحوَّل: ${d.amount ? Number(d.amount).toFixed(2) + "$" : "—"}`;
const balanceRow = [Markup.button.callback("➕ شحن رصيد", `adm:userAdd:${d.user_id}`), Markup.button.callback("➖ خصم رصيد", `adm:userSub:${d.user_id}`)];
const kb = d.status === "pending"
? Markup.inlineKeyboard([[Markup.button.callback("✅ موافقة", `adm:dep:approve:${d.id}`), Markup.button.callback("❌ رفض", `adm:dep:reject:${d.id}`)], balanceRow, [Markup.button.callback("👤 ملف المستخدم", `adm:user:${d.user_id}`)], [Markup.button.callback("⬅️ رجوع", "adm:depList:1")]])
: Markup.inlineKeyboard([balanceRow, [Markup.button.callback("👤 ملف المستخدم", `adm:user:${d.user_id}`)], [Markup.button.callback("⬅️ رجوع", "adm:depList:1")]]);
try { await ctx.replyWithPhoto(d.screenshot_file_id, { caption: text, ...kb }); }
catch { await ctx.reply(`${text}\n\n(تعذّر تحميل الصورة)`, kb); }
}

async function approveDeposit(ctx, depId, overrideAmount = null) {
if (!(await requireAdmin(ctx))) return;
const client = await pool.connect();
let d;
let approvedAmount = null;
try {
await client.query("BEGIN");
const res = await client.query("SELECT * FROM deposit_requests WHERE id=$1 FOR UPDATE", [depId]);
d = res.rows[0];
if (!d || d.status !== "pending") {
await client.query("ROLLBACK");
await ctx.reply("⚠️ تمت معالجة طلب الإيداع مسبقاً.");
return;
}
if (overrideAmount == null) {
await client.query("ROLLBACK");
setStep(ctx.from.id, { kind: "admin:depositApproveAmount", depositId: depId });
await ctx.reply("💵 أرسل المبلغ بالدولار لإضافته إلى رصيد المستخدم:", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "admin:menu")]]));
return;
}
const amount = Number(overrideAmount);
if (!Number.isFinite(amount) || amount <= 0) {
await client.query("ROLLBACK");
setStep(ctx.from.id, { kind: "admin:depositApproveAmount", depositId: depId });
await ctx.reply("⚠️ أرسل مبلغاً صحيحاً أكبر من صفر.");
return;
}
approvedAmount = amount;
await client.query("UPDATE users SET balance=balance+$1 WHERE id=$2", [amount, d.user_id]);
await client.query("UPDATE deposit_requests SET status='approved', amount=$1, processed_by=$2, processed_at=NOW() WHERE id=$3", [amount, ctx.from.id, depId]);
await client.query("COMMIT");
} catch (e) {
try { await client.query("ROLLBACK"); } catch {}
throw e;
} finally { client.release(); }

invalidateUserCache(d.user_id);
await clearDepositForOtherAdmins(ctx.from.id, depId, "✅ طلب إيداع — تمت الموافقة");
setStep(ctx.from.id, { kind: "idle" });
const amount = Number(approvedAmount);
await ctx.reply(`✅ تمت الموافقة على الإيداع.
💵 تمت إضافة ${amount.toFixed(2)}$ إلى رصيد المستخدم.`);
await ctx.telegram.sendMessage(d.user_id, `✅ تمت الموافقة على إيداعك.
💰 تمت إضافة ${amount.toFixed(2)}$ إلى رصيدك.`, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]])).catch(() => {});
}

async function rejectDeposit(ctx, depId) {
if (!(await requireAdmin(ctx))) return;
const res = await q("UPDATE deposit_requests SET status='rejected', processed_by=$1, processed_at=NOW() WHERE id=$2 AND status='pending' RETURNING *", [ctx.from.id, depId]);
if (!res.rows.length) { await ctx.reply("⚠️ تمت معالجة هذا الطلب مسبقاً بواسطة مدير آخر."); return; }
const d = res.rows[0];
await clearDepositForOtherAdmins(ctx.from.id, depId, "❌ طلب إيداع — تم الرفض");
await ctx.reply("❌ تم رفض طلب الإيداع.");
if (d) { try { await ctx.telegram.sendMessage(d.user_id, "❌ تم رفض طلب الإيداع."); } catch { /* ignore */ } }
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
if (isMeSA && uid !== ctx.from.id) {
kb.push([Markup.button.callback(u.is_super_admin ? "⬇️ إلغاء المدير الأعلى" : "🌟 جعله مديراً أعلى", `adm:userSA:${uid}`)]);
if (u.is_admin && !u.is_super_admin) {
kb.push([Markup.button.callback(u.can_delete_products ? "🗑️ إلغاء صلاحية حذف المنتجات" : "🗑️ منحه صلاحية حذف المنتجات", `adm:userDeletePerm:${uid}`)]);
}
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
//  MANUAL ORDER REPLIES
// ============================================================
async function showManualOrderDetails(ctx, oid) {
if (!(await requireAdmin(ctx))) return;
const o = (await q("SELECT * FROM manual_orders WHERE id=$1", [oid])).rows[0];
if (!o) { await ctx.reply("⚠️ الطلب غير موجود."); return; }
const u = (await q("SELECT * FROM users WHERE id=$1", [o.user_id])).rows[0];
const rate = await getExchangeRate();
const syp = Math.round(Number(o.price_usd) * rate);

// Get replies
const replies = (await q("SELECT * FROM manual_order_replies WHERE order_id=$1 ORDER BY created_at", [oid])).rows;
let replyText = "";
if (replies.length) {
replyText = "\n\n💬 الردود:\n";
for (const r of replies) {
replyText += `— ${r.message}\n`;
}
}

const text = `📋 طلب يدوي\n👤 ${u?.username ? "@" + u.username : `ID:${o.user_id}`}\n🛒 ${o.product_name}\n💰 ${Number(o.price_usd).toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س\nالحالة: ${o.status}${o.admin_note ? `\n📦 ${o.admin_note}` : ""}${replyText}`;

const rows = [
[Markup.button.callback("✅ قبول وتسليم", `adm:mordAccept:${oid}`), Markup.button.callback("❌ رفض واسترداد", `adm:mordReject:${oid}`)],
[Markup.button.callback("💬 إرسال رد", `adm:mordReply:${oid}`)],
[Markup.button.callback("⬅️ رجوع", "adm:manualOrders")]
];
await sendOrEdit(ctx, text, Markup.inlineKeyboard(rows));
}

// ============================================================
//  API SOURCES ADMIN
// ============================================================
async function showApiSources(ctx) {
if (!(await requireAdmin(ctx))) return;
const sources = await listApiSources();
const rows = sources.map(s => [Markup.button.callback(`${s.active ? "🔌" : "🔴"} ${s.name} (${s.markup_percent}%)`, `adm:apiSource:${s.id}`)]);
rows.push([Markup.button.callback("➕ إضافة مصدر", "adm:addApi")]);
rows.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
await sendOrEdit(ctx, "🔌 مصادر المنتجات:", Markup.inlineKeyboard(rows));
}

async function showApiSourceDetails(ctx, id) {
if (!(await requireAdmin(ctx))) return;
const src = await getApiSource(id);
if (!src) { await ctx.reply("⚠️ المصدر غير موجود."); return; }
const prodCount = (await q("SELECT COUNT(*)::int AS c FROM api_source_products WHERE api_source_id=$1", [id])).rows[0]?.c ?? 0;
const text = `🔌 ${src.name}\nالربح: ${src.markup_percent}%\nالحالة: ${src.active ? "✅ نشط" : "🔴 معطل"}\nالمنتجات: ${prodCount}`;
const rows = [
[Markup.button.callback(src.active ? "🔴 تعطيل" : "✅ تفعيل", `adm:apiToggle:${id}`)],
[Markup.button.callback("🔄 تحديث المنتجات", `adm:apiSync:${id}`)],
[Markup.button.callback("✏️ تعديل الربح", `adm:apiMarkup:${id}`)],
[Markup.button.callback("🗑️ حذف المصدر", `adm:apiDel:${id}`)],
[Markup.button.callback("⬅️ رجوع", "adm:apiSources")]
];
await sendOrEdit(ctx, text, Markup.inlineKeyboard(rows));
}

// ============================================================
//  MANUAL CATEGORIES ADMIN
// ============================================================
async function showManualCategoriesAdmin(ctx) {
if (!(await requireAdmin(ctx))) return;
const cats = (await q("SELECT * FROM manual_categories WHERE parent_id=0 ORDER BY position")).rows;
const rows = cats.map(c => [Markup.button.callback(`${c.active ? "📁" : "🔒"} ${c.name}`, `adm:mcManage:${c.id}`)]);
rows.push([Markup.button.callback("➕ إضافة قسم", "adm:addMc")]);
rows.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
await sendOrEdit(ctx, "📁 الأقسام اليدوية:", Markup.inlineKeyboard(rows));
}

async function showManualCategoryAdmin(ctx, mcId) {
if (!(await requireAdmin(ctx))) return;
const mc = (await q("SELECT * FROM manual_categories WHERE id=$1", [mcId])).rows[0];
if (!mc) { await ctx.reply("⚠️ القسم غير موجود."); return; }
const prods = (await q("SELECT * FROM manual_products WHERE manual_category_id=$1 ORDER BY id", [mcId])).rows;
const rows = prods.map(p => [Markup.button.callback(`${p.active ? "🛒" : "❌"} ${p.name} (${Number(p.price_usd).toFixed(2)}$)`, `adm:manualProdEdit:${p.id}`)]);
rows.push([Markup.button.callback("➕ إضافة منتج", `adm:addManualProd:${mcId}`)]);
rows.push([Markup.button.callback("✏️ تعديل اسم القسم", `adm:mcEdit:${mcId}`)]);
rows.push([Markup.button.callback(mc.active ? "🙈 إخفاء" : "👁 إظهار", `adm:mcToggle:${mcId}`)]);
rows.push([Markup.button.callback("🗑️ حذف القسم", `adm:mcDel:${mcId}`)]);
rows.push([Markup.button.callback("⬅️ رجوع", "adm:manualCats")]);
await sendOrEdit(ctx, `📁 ${mc.name}\nالمنتجات: ${prods.length}`, Markup.inlineKeyboard(rows));
}

// ============================================================
//  BOT LAUNCH
// ============================================================
async function warmFirstCatalogSnapshot() {
try {
const cachedRoot = await loadCatalogCache("api1_content_0");
if (cachedRoot && Array.isArray(cachedRoot.products) && Array.isArray(cachedRoot.categories)) {
contentCache.set(0, { content: cachedRoot, expiry: Date.now() + CONTENT_TTL });
} else {
const root = await fetchContent(0);
await saveCatalogCache("api1_content_0", root);
contentCache.set(0, { content: root, expiry: Date.now() + CONTENT_TTL });
}
} catch (e) {
console.error("Root catalog warmup failed:", e.message);
}
try {
const cachedProducts = await loadCatalogCache("api1_products");
const api1 = Array.isArray(cachedProducts) ? normalizeApi1Products(cachedProducts) : [];
const api2Rows = (await q("SELECT * FROM api_source_products WHERE available=true ORDER BY id")).rows;
productsCache = { products: [...api1, ...normalizeApi2Products(api2Rows)], expiry: Date.now() + PRODUCTS_TTL };
} catch (e) {
console.error("Product snapshot warmup failed:", e.message);
}
}

async function startBot() {
const token = process.env.BOT_TOKEN;
if (!token) { console.error("❌ BOT_TOKEN is required"); process.exit(1); }

await ensureTables();
await ensureDefaults();
await ensureDefaultDepositMethods();
const defaultApi2Id = await ensureDefaultApi2();
// نفّذ مزامنة أولية قصيرة قبل تشغيل البوت حتى لا يظهر المتجر فارغاً من المصدر الثاني.
// إذا كان المصدر متوقفاً مؤقتاً، نكمل تشغيل البوت ونحاول تلقائياً في الخلفية لاحقاً.
if (defaultApi2Id) {
  try {
    const result = await Promise.race([
      syncApiSource(defaultApi2Id),
      new Promise((_, reject) => setTimeout(() => reject(new Error("initial sync timeout")), 30000))
    ]);
    console.log(`المصدر الثاني initial sync completed: ${result} products`);
  } catch (e) {
    console.error("Default Source2 initial sync failed:", e.message);
  }
}
// Build a local snapshot before Telegram starts.
await warmFirstCatalogSnapshot();
// لا ننتظر مزامنة الـAPI قبل تشغيل البوت. المزامنة تعمل بالخلفية
// حتى يستطيع المستخدم فتح البوت فوراً، وتُحفظ النتائج في قاعدة البيانات.
const bot = new Telegraf(token, { handlerTimeout: 90_000 });

// ── Rate limiter + رد فوري على callback ────────────────────────────────
const _rateMap = new Map();
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
if (ctx.callbackQuery) ctx.answerCbQuery().catch(() => {});
return next();
});

// منع معالجة نفس Telegram update مرتين حتى لو أعاد Telegram الإرسال أو كانت هناك نسخة ثانية من البوت.
const _processedUpdateIds = new Set();
const _processedUpdateTimers = new Map();
const _replyDedup = new Map();
bot.use(async (ctx, next) => {
const updateId = ctx.update?.update_id;
if (updateId != null) {
if (_processedUpdateIds.has(updateId)) return;
try {
const saved = await q("INSERT INTO processed_telegram_updates(update_id) VALUES($1) ON CONFLICT DO NOTHING RETURNING update_id", [updateId]);
if (!saved.rows.length) return;
} catch (e) {
// إذا تعذر جدول منع التكرار، نستخدم الحماية داخل الذاكرة على الأقل.
} 
_processedUpdateIds.add(updateId);
const timer = setTimeout(() => { _processedUpdateIds.delete(updateId); _processedUpdateTimers.delete(updateId); }, 60_000);
_processedUpdateTimers.set(updateId, timer);
}
const originalReply = ctx.reply.bind(ctx);
ctx.reply = async (...args) => {
const text = typeof args[0] === "string" ? args[0] : JSON.stringify(args[0]);
const userId = ctx.from?.id ?? 0;
const key = `${userId}:reply:${text}`;
const now = Date.now();
const last = _replyDedup.get(key) ?? 0;
if (now - last < 2500) return;
_replyDedup.set(key, now);
ctx.state = ctx.state || {};
ctx.state._replySent = true;
if (_replyDedup.size > 2000) {
for (const [k, t] of _replyDedup) if (now - t > 10000) _replyDedup.delete(k);
}
return originalReply(...args);
};
return next();
});

// ── Commands ──────────────────────────────────────────────────────────
bot.start(async ctx => {
const txt = ctx.message?.text ?? "";
setStep(ctx.from.id, { kind: "idle" });
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

bot.command("admin", async ctx => {
const user = await ensureUser(ctx);
if (!user?.is_admin) {
await ctx.reply("⛔ هذا الأمر للإدارة فقط.");
return;
}
const sessionActive = await isAdminSessionActive(ctx.from.id);
if (!sessionActive && !authedAdminIds.has(ctx.from.id)) {
setStep(ctx.from.id, { kind: "admin:login" });
await ctx.reply("🔑 أرسل كلمة المرور:");
return;
}
await showAdminMenu(ctx);
});

// ── Callback Queries ──────────────────────────────────────────────────
bot.action("home", async ctx => { setStep(ctx.from.id, { kind: "idle" }); await showMainMenu(ctx); });
bot.action("balance", async ctx => {
const u = await ensureUser(ctx); if (!u) return;
const rate = await getExchangeRate();
await sendOrEdit(ctx, `💰 رصيدك: ${formatBalance(Number(u.balance), rate)}`, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
});
bot.action("deposit", async ctx => { await ensureUser(ctx); await showDepositMenu(ctx); });
bot.action("support", async ctx => { await ensureUser(ctx); await showContactLinks(ctx); });
bot.action(/^myorders:(\d+)$/, async ctx => { await showMyOrders(ctx, Number(ctx.match[1])); });
bot.action("noop", async ctx => { /* نقرة على رقم الصفحة */ });

// ── Admin auth ────────────────────────────────────────────────────────
bot.action("admin:menu", async ctx => { await showAdminMenu(ctx); });
bot.action("admin:loginPrompt", async ctx => {
setStep(ctx.from.id, { kind: "admin:login" });
await ctx.reply("🔑 أرسل كلمة المرور:");
});

bot.action("adm:logout", async ctx => {
authedAdminIds.delete(ctx.from.id);
await setAdminSession(ctx.from.id, false);
invalidateUserCache(ctx.from.id);
setStep(ctx.from.id, { kind: "idle" });
const user = await getUser(ctx.from.id);
const rate = await getExchangeRate();
const greeting = `أهلاً فيك في متجر المروان 🌟\nالاسم: ${user?.first_name ?? "—"}${user?.username ? ` (@${user.username})` : ""}\nالرقم: ${ctx.from.id}\nالرصيد: ${formatBalance(Number(user?.balance ?? 0), rate)}\n\nتم تسجيل الخروج من لوحة الإدارة 👋\nاختر من القائمة 👇`;
await sendOrEdit(ctx, greeting, mainMenu());
});

// ── Deposit flow ──────────────────────────────────────────────────────
bot.action(/^dep:method:(\d+)$/, async ctx => { await showDepositMethod(ctx, Number(ctx.match[1])); });
bot.action("dep:cancel", async ctx => { setStep(ctx.from.id, { kind: "idle" }); await showMainMenu(ctx); });

// ── Category / Product navigation ─────────────────────────────────────
bot.action(/^cat:(\d+):(\d+):(\d+)$/, async ctx => {
await ensureUser(ctx);
await showCategory(ctx, Number(ctx.match[1]), Number(ctx.match[2]), Number(ctx.match[3]));
});
bot.action(/^prod:(\d+):(\d+)$/, async ctx => {
await ensureUser(ctx);
await showProduct(ctx, Number(ctx.match[1]), Number(ctx.match[2]));
});
bot.action(/^vcat:(\d+):(\d+):(\d+)$/, async ctx => {
await ensureUser(ctx);
await showVirtualCategory(ctx, Number(ctx.match[1]), Number(ctx.match[2]), Number(ctx.match[3]));
});
bot.action(/^mprod:(\d+):(\d+)$/, async ctx => {
await ensureUser(ctx);
await showManualProduct(ctx, Number(ctx.match[1]), Number(ctx.match[2]));
});
bot.action(/^mcat:(\d+):(\d+):(\d+)$/, async ctx => {
await ensureUser(ctx);
await showManualCategory(ctx, Number(ctx.match[1]), Number(ctx.match[2]), Number(ctx.match[3]));
});
bot.action(/^api2cat:(\d+):(\d+):(\d+)$/, async ctx => {
await ensureUser(ctx);
await showApi2Category(ctx, Number(ctx.match[1]), Number(ctx.match[2]), Number(ctx.match[3]));
});
bot.action(/^api2prod:(\d+):(\d+)$/, async ctx => {
await ensureUser(ctx);
await showApi2Product(ctx, Number(ctx.match[1]), Number(ctx.match[2]));
});

// ── Buy flow ──────────────────────────────────────────────────────────
bot.action(/^buy:(\d+):(\d+)$/, async ctx => {
await ensureUser(ctx);
await startOrderFlow(ctx, Number(ctx.match[1]), Number(ctx.match[2]));
});
bot.action(/^api2buy:(\d+):(\d+)$/, async ctx => {
await ensureUser(ctx);
const prodId = Number(ctx.match[1]);
const backTo = Number(ctx.match[2]);
const pRes = await q("SELECT * FROM api_source_products WHERE id=$1", [prodId]);
const p = pRes.rows[0];
if (!p) { await ctx.reply("⚠️ المنتج غير موجود."); return; }
if (!p.available || p.admin_hidden) { await ctx.reply("⚠️ المنتج غير متاح حالياً."); return; }

const [rate, display] = await Promise.all([
getExchangeRate(),
getApi2DisplayData(p, ctx.from.id),
]);
const unitPriceUsd = display.priceUsd;
const paramKeys = Array.isArray(p.params) ? p.params : [];
const parsed = parseQtyValues(p.qty_values);
if (parsed.kind === "fixed") {
setStep(ctx.from.id, { kind: "order:params", productId: `ext_${p.api_source_id}_${p.external_id}`, productName: p.custom_name ?? p.name, priceUsd: unitPriceUsd, qty: 1, paramKeys, collected: {}, idx: 0, backTo, _api2: true, _api2_id: p.id });
await askNextParam(ctx, { id: `ext_${p.api_source_id}_${p.external_id}`, name: p.custom_name ?? p.name, params: paramKeys }, unitPriceUsd, 1, paramKeys, {}, 0, backTo);
return;
}
if (parsed.kind === "list") {
setStep(ctx.from.id, { kind: "order:qty", productId: `ext_${p.api_source_id}_${p.external_id}`, productName: p.custom_name ?? p.name, priceUsd: unitPriceUsd, paramKeys, qtyValues: parsed.values, backTo, _api2: true, _api2_id: p.id });
const rows = parsed.values.slice(0, 24).map(v => {
const label = formatPriceLabel(v, unitPriceUsd);
return [Markup.button.callback(label, `ord:qty:${v}`)];
});
rows.push([Markup.button.callback("❌ إلغاء", "ord:cancel")]);
await sendOrEdit(ctx, `🛒 ${p.custom_name ?? p.name}\nاختر الكمية:`, Markup.inlineKeyboard(rows)); return;
}
setStep(ctx.from.id, { kind: "order:qty", productId: `ext_${p.api_source_id}_${p.external_id}`, productName: p.custom_name ?? p.name, priceUsd: unitPriceUsd, paramKeys, qtyValues: { min: parsed.min, max: parsed.max }, backTo, _api2: true, _api2_id: p.id });
await sendOrEdit(ctx, `🛒 ${p.custom_name ?? p.name}\nأرسل الكمية (بين ${parsed.min} و ${parsed.max}):`, Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "ord:cancel")]]));
});
bot.action(/^ord:qty:(\d+\.?\d*)$/, async ctx => {
const step = getStep(ctx.from.id);
if (step.kind !== "order:qty") return;
const qty = Number(ctx.match[1]);
let all = await getCachedProducts();
let p = all.find(x => x.id === step.productId);
if (!p && step._api2) {
const pRes = await q("SELECT * FROM api_source_products WHERE id=$1", [step._api2_id]);
if (pRes.rows[0]) {
const row = pRes.rows[0];
p = { id: step.productId, name: row.custom_name ?? row.name, category_name: row.category_name, params: row.params, qty_values: row.qty_values, available: row.available, admin_hidden: row.admin_hidden, _source: 'api2', _source_id: row.api_source_id, _external_id: row.external_id };
}
}
if (!p) { all = await fetchAllProducts(); p = all.find(x => x.id === step.productId); }
if (!p) return;
await askNextParam(ctx, p, step.priceUsd, qty, step.paramKeys, {}, 0, step.backTo);
});
bot.action("ord:confirm", async ctx => { await executeOrder(ctx); });
bot.action("ord:cancel", async ctx => { setStep(ctx.from.id, { kind: "idle" }); await showMainMenu(ctx); });
bot.action(/^ord:check:(\d+)$/, async ctx => { await checkOrderStatus(ctx, Number(ctx.match[1])); });
bot.action(/^api2cancel:(\d+)$/, async ctx => { await cancelApi2Order(ctx, Number(ctx.match[1])); });

// ── Manual product buy (NO NOTE REQUIRED) ─────────────────────────────
bot.action(/^mbuy:(\d+)$/, async ctx => {
const mid = Number(ctx.match[1]);
const client = await pool.connect();
let m;
let ord;
let priceUsd = 0;
try {
await client.query("BEGIN");
const mRes = await client.query("SELECT * FROM manual_products WHERE id=$1 AND active=true FOR UPDATE", [mid]);
m = mRes.rows[0];
if (!m) {
await client.query("ROLLBACK");
await ctx.reply("⚠️ المنتج غير متاح.");
return;
}
const markup = m.markup_percent != null ? Number(m.markup_percent) : 0;
priceUsd = Number((Number(m.price_usd) * (1 + markup / 100)).toFixed(4));
if (!Number.isFinite(priceUsd) || priceUsd <= 0) {
await client.query("ROLLBACK");
await ctx.reply("⚠️ سعر المنتج غير صالح حالياً.");
return;
}
if (Number(m.stock_qty) === 0) {
await client.query("ROLLBACK");
await ctx.reply("❌ نفذ المخزون.");
return;
}
const uRes = await client.query("SELECT * FROM users WHERE id=$1 FOR UPDATE", [ctx.from.id]);
const u = uRes.rows[0];
if (!u || Number(u.balance) < priceUsd) {
await client.query("ROLLBACK");
await ctx.reply("❌ رصيد غير كافٍ.", Markup.inlineKeyboard([[Markup.button.callback("💳 شحن رصيد", "deposit")]]));
return;
}
if (Number(m.stock_qty) > 0) {
const stockRes = await client.query("UPDATE manual_products SET stock_qty=stock_qty-1, updated_at=NOW() WHERE id=$1 AND stock_qty > 0 RETURNING stock_qty", [mid]);
if (!stockRes.rows.length) {
await client.query("ROLLBACK");
await ctx.reply("❌ نفذ المخزون.");
return;
}
}
const chargeRes = await client.query("UPDATE users SET balance=balance-$1 WHERE id=$2 AND balance >= $1 RETURNING *", [priceUsd, ctx.from.id]);
if (!chargeRes.rows.length) {
await client.query("ROLLBACK");
await ctx.reply("❌ رصيد غير كافٍ.", Markup.inlineKeyboard([[Markup.button.callback("💳 شحن رصيد", "deposit")]]));
return;
}
const ins = await client.query("INSERT INTO manual_orders(user_id,product_id,product_name,price_usd,status) VALUES($1,$2,$3,$4,'pending') RETURNING *", [ctx.from.id, m.id, m.name, priceUsd]);
ord = ins.rows[0];
await client.query("COMMIT");
invalidateUserCache(ctx.from.id);
userCacheSet(ctx.from.id, chargeRes.rows[0]);
} catch (e) {
try { await client.query("ROLLBACK"); } catch {}
throw e;
} finally {
client.release();
}

setStep(ctx.from.id, { kind: "idle" });
await ctx.reply(`✅ تم استلام طلبك\n🛒 ${m.name}\nسيتم التنفيذ في أقرب وقت.`, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));

const admins = await listAdmins();
const rate = await getExchangeRate();
const syp = Math.round(priceUsd * rate);
for (const a of admins) {
await ctx.telegram.sendMessage(a.id, `📋 طلب يدوي جديد\n👤 ${ctx.from.first_name ?? ctx.from.id}\n🛒 ${m.name}\n💰 ${priceUsd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س`,
Markup.inlineKeyboard([[Markup.button.callback("📋 عرض الطلب", `adm:mord:${ord.id}`)]])).catch(() => {});
}
});

// ── Admin: deposit management ─────────────────────────────────────────
bot.action(/^adm:depList:(\d+)$/, async ctx => { await showDepList(ctx, Number(ctx.match[1])); });
bot.action(/^adm:depShow:(\d+)$/, async ctx => { await showDepDetails(ctx, Number(ctx.match[1])); });
bot.action(/^adm:dep:approve:(\d+)$/, async ctx => { await approveDeposit(ctx, Number(ctx.match[1])); });
bot.action(/^adm:dep:reject:(\d+)$/, async ctx => { await rejectDeposit(ctx, Number(ctx.match[1])); });

// ── Admin: users ──────────────────────────────────────────────────────
bot.action(/^adm:users:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
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
bot.action(/^adm:user:(\d+)$/, async ctx => { await showUserCard(ctx, Number(ctx.match[1])); });
bot.action(/^adm:userBan:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const uid = Number(ctx.match[1]); const u = await getUser(uid);
const newStatus = u?.status === "banned" ? "active" : "banned";
await setStatus(uid, newStatus);
if (newStatus === "banned" && u?.is_admin) {
authedAdminIds.delete(uid);
await setAdminSession(uid, false).catch(() => {});
}
await ctx.reply(newStatus === "banned" ? "🚫 تم الحظر." : "✅ تم رفع الحظر.");
await showUserCard(ctx, uid);
});
bot.action(/^adm:userAdmin:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const uid = Number(ctx.match[1]); const u = await getUser(uid);
if (u?.is_super_admin && u.id !== ctx.from.id) { await ctx.reply("⛔ لا يمكن للمدير العادي تعديل صلاحية المدير الأعلى."); return; }
const newAdmin = !u?.is_admin;
await setAdmin(uid, newAdmin, newAdmin ? false : undefined);
if (!newAdmin) await q("UPDATE users SET can_delete_products=false WHERE id=$1", [uid]);
if (!newAdmin) {
authedAdminIds.delete(uid);
await setAdminSession(uid, false).catch(() => {});
}
await ctx.reply(newAdmin ? "👑 تم التعيين إداريًّا." : "👤 تم إلغاء الإداري.");
await showUserCard(ctx, uid);
});
bot.action(/^adm:userDeletePerm:(\d+)$/, async ctx => {
if (!(await requireSuperAdmin(ctx))) return;
const uid = Number(ctx.match[1]);
if (uid === ctx.from.id) { await ctx.reply("⚠️ هذه الصلاحية تُمنح لمدير عادي، وليس لحسابك المدير الأعلى."); return; }
const u = await getUser(uid);
if (!u?.is_admin || u?.is_super_admin) { await ctx.reply("⚠️ يجب أن يكون المستخدم مديراً عادياً."); return; }
const next = !u.can_delete_products;
await q("UPDATE users SET can_delete_products=$1 WHERE id=$2", [next, uid]);
invalidateUserCache(uid);
await ctx.reply(next ? "✅ تم منح المدير صلاحية حذف المنتجات." : "✅ تم إلغاء صلاحية حذف المنتجات.");
await showUserCard(ctx, uid);
});
bot.action(/^adm:userSA:(\d+)$/, async ctx => {
if (!(await requireSuperAdmin(ctx))) return;
const uid = Number(ctx.match[1]); const u = await getUser(uid);
const newSA = !u?.is_super_admin;
await setAdmin(uid, newSA ? true : u?.is_admin ?? false, newSA);
if (!newSA) {
authedAdminIds.delete(uid);
await setAdminSession(uid, false).catch(() => {});
}
await ctx.reply(newSA ? "🌟 تم تعيينه مديراً أعلى." : "⬇️ تم إلغاء صلاحية المدير الأعلى.");
await showUserCard(ctx, uid);
});
bot.action(/^adm:userAdd:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:userBalance", userId: Number(ctx.match[1]), mode: "add" }); await ctx.reply("💵 أرسل المبلغ بالدولار للإضافة:", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "admin:menu")]])); });
bot.action(/^adm:userSub:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:userBalance", userId: Number(ctx.match[1]), mode: "sub" }); await ctx.reply("💵 أرسل المبلغ بالدولار للخصم:", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "admin:menu")]])); });
bot.action("adm:findUser", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:findUser" }); await ctx.reply("🔍 أرسل اسم المستخدم أو ID:", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "admin:menu")]])); });
bot.action(/^adm:userOrders:(\d+):(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const uid = Number(ctx.match[1]); const page = Number(ctx.match[2]); const limit = 8; const offset = (page - 1) * limit;
const res = await q("SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3", [uid, limit + 1, offset]);
const hasNext = res.rows.length > limit; const slice = res.rows.slice(0, limit);
if (!slice.length) { await sendOrEdit(ctx, "📭 لا توجد طلبات.", Markup.inlineKeyboard([[Markup.button.callback("⬅️ رجوع", `adm:user:${uid}`)]])); return; }
const lines = slice.map(r => `🛒 ${r.product_name} ×${r.qty} • ${Number(r.price_usd).toFixed(2)}$ • ${statusLabel(r.status)}`);
const nav = []; if (page > 1) nav.push(Markup.button.callback("⬅️ السابق", `adm:userOrders:${uid}:${page - 1}`)); if (hasNext) nav.push(Markup.button.callback("التالي ➡️", `adm:userOrders:${uid}:${page + 1}`));
const kb = []; if (nav.length) kb.push(nav); kb.push([Markup.button.callback("⬅️ رجوع", `adm:user:${uid}`)]);
await sendOrEdit(ctx, `📦 طلبات المستخدم ${uid}\n\n${lines.join("\n")}`, Markup.inlineKeyboard(kb));
});
bot.action(/^adm:userMarkup:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const uid = Number(ctx.match[1]); const u = await getUser(uid); setStep(ctx.from.id, { kind: "admin:setUserMarkup", userId: uid }); await ctx.reply(`% نسبة ربح ${u?.first_name ?? uid}\nالحالية: ${u?.custom_markup_percent ?? "غير محددة"}\nأرسل النسبة أو reset:`, Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", `adm:user:${uid}`)]])); });

// ── Admin: orders ─────────────────────────────────────────────────────
bot.action(/^adm:allOrders:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const page = Number(ctx.match[1]); const limit = 8; const offset = (page - 1) * limit;
const res = await q("SELECT o.*, u.username AS uname, u.first_name AS ufirst FROM orders o LEFT JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC LIMIT $1 OFFSET $2", [limit + 1, offset]);
const hasNext = res.rows.length > limit; const slice = res.rows.slice(0, limit);
if (!slice.length) { await sendOrEdit(ctx, "📭 لا توجد طلبات.", Markup.inlineKeyboard([[Markup.button.callback("⬅️ رجوع", "admin:menu")]])); return; }
const lines = slice.map(r => `${r.ufirst ?? "—"}${r.uname ? " @" + r.uname : ""}\n   ${r.product_name} ×${r.qty} • ${Number(r.price_usd).toFixed(2)}$ • ${statusLabel(r.status)}`);
const nav = []; if (page > 1) nav.push(Markup.button.callback("⬅️ السابق", `adm:allOrders:${page - 1}`)); if (hasNext) nav.push(Markup.button.callback("التالي ➡️", `adm:allOrders:${page + 1}`));
const kb = []; if (nav.length) kb.push(nav); kb.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
await sendOrEdit(ctx, `📦 كل الطلبات\n\n${lines.join("\n\n")}`, Markup.inlineKeyboard(kb));
});

// ── Admin: broadcast ──────────────────────────────────────────────────
bot.action("adm:broadcast", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:broadcast" }); await ctx.reply("📣 أرسل نص الرسالة الجماعية:", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "admin:menu")]])); });

// ── Admin: deposit methods ────────────────────────────────────────────
bot.action("adm:methods", async ctx => {
if (!(await requireAdmin(ctx))) return;
const res = await q("SELECT * FROM deposit_methods ORDER BY id"); const rows = res.rows;
const kb = rows.map(m => [Markup.button.callback(`${m.active ? "🟢" : "🔴"} ${m.name}`, `adm:methodEdit:${m.id}`)]);
kb.push([Markup.button.callback("➕ إضافة طريقة", "adm:methodAdd")]); kb.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
await sendOrEdit(ctx, "💳 طرق الإيداع", Markup.inlineKeyboard(kb));
});
bot.action("adm:methodAdd", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:addMethod:name" }); await ctx.reply("💳 أرسل اسم طريقة الإيداع:", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "adm:methods")]])); });
bot.action(/^adm:methodEdit:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const id = Number(ctx.match[1]); const res = await q("SELECT * FROM deposit_methods WHERE id=$1", [id]); const m = res.rows[0]; if (!m) return;
await sendOrEdit(ctx, `💳 ${m.name}\nالمعرف: ${m.identifier}\nالحالة: ${m.active ? "مفعّل" : "موقوف"}\n🖼 صورة: ${m.image_file_id ? "✅ موجودة" : "❌ لا يوجد"}\n\n${m.instructions}`,
Markup.inlineKeyboard([
[Markup.button.callback(m.active ? "🔴 تعطيل" : "🟢 تفعيل", `adm:methodToggle:${id}`), Markup.button.callback("✏️ التعليمات", `adm:methodInstr:${id}`)],
[Markup.button.callback("🖼 رفع/تغيير الصورة", `adm:methodImg:${id}`), Markup.button.callback("🗑️ حذف الصورة", `adm:methodImgDel:${id}`)],
[Markup.button.callback("🗑️ حذف الطريقة", `adm:methodDel:${id}`)],
[Markup.button.callback("⬅️ رجوع", "adm:methods")]
]));
});
bot.action(/^adm:methodToggle:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const id = Number(ctx.match[1]);
const cur = (await q("SELECT active FROM deposit_methods WHERE id=$1", [id])).rows[0];
if (!cur) { await ctx.reply("⚠️ الطريقة غير موجودة."); return; }
await q("UPDATE deposit_methods SET active=$1, updated_at=NOW() WHERE id=$2", [!cur.active, id]);
await ctx.reply(!cur.active ? "🟢 تم تفعيل طريقة الإيداع." : "🔴 تم تعطيل طريقة الإيداع.");
});
bot.action(/^adm:methodInstr:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:editMethodInstructions", methodId: Number(ctx.match[1]) }); await ctx.reply("📋 أرسل التعليمات الجديدة:", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "adm:methods")]])); });
bot.action(/^adm:methodDel:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; await q("DELETE FROM deposit_methods WHERE id=$1", [Number(ctx.match[1])]); await ctx.reply("🗑️ تم الحذف."); });
bot.action(/^adm:methodImg:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
setStep(ctx.from.id, { kind: "admin:setMethodImage", methodId: Number(ctx.match[1]) });
await ctx.reply("🖼 أرسل الصورة التي تريد إضافتها:", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "adm:methods")]]));
});
bot.action(/^adm:methodImgDel:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
await q("UPDATE deposit_methods SET image_file_id=NULL WHERE id=$1", [Number(ctx.match[1])]);
await ctx.reply("✅ تم حذف الصورة.");
});

// ── Admin: product management ─────────────────────────────────────────
bot.action(/^adm:editPrice:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const all = await fetchAllProducts(); const p = all.find(x => x.id === pid); setStep(ctx.from.id, { kind: "admin:editPrice", productId: pid, productName: p?.name ?? "" }); await ctx.reply(`✏️ سعر: ${p?.name ?? pid}\nأرسل: %5 ربح أو $2.5 ثابت أو reset`); });
bot.action(/^adm:editInstr:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const all = await fetchAllProducts(); const p = all.find(x => x.id === pid); setStep(ctx.from.id, { kind: "admin:editProductInstructions", productId: pid, productName: p?.name ?? "" }); await ctx.reply(`📋 أرسل تعليمات ${p?.name ?? pid} أو clear للمسح:`, Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", `prod:${pid}:0`)]])); });
bot.action(/^adm:renameProd:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const all = await fetchAllProducts(); const p = all.find(x => x.id === pid); setStep(ctx.from.id, { kind: "admin:renameProduct", productId: pid, productName: p?.name ?? "" }); await ctx.reply(`📝 الاسم الجديد لـ "${p?.name ?? pid}" أو reset:`); });
bot.action(/^adm:moveProd:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const all = await fetchAllProducts(); const p = all.find(x => x.id === pid); setStep(ctx.from.id, { kind: "admin:moveProduct", productId: pid, productName: p?.name ?? "" }); await ctx.reply(`🚚 نقل "${p?.name ?? pid}"\nأرسل اسم القسم أو reset:`, Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", `prod:${pid}:0`)]])); });
bot.action(/^adm:hideProd:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const pid = Number(ctx.match[1]); const cur = (await q("SELECT hidden FROM product_overrides WHERE product_id=$1", [pid])).rows[0];
const nextHidden = !(cur?.hidden ?? false);
await q("INSERT INTO product_overrides(product_id,hidden) VALUES($1,$2) ON CONFLICT(product_id) DO UPDATE SET hidden=$2, updated_at=NOW()", [pid, nextHidden]);
invalidateCaches(); await ctx.reply(nextHidden ? "🙈 تم إخفاء المنتج." : "👁 تم إظهار المنتج.");
});
bot.action(/^adm:deleteProd:(\d+)$/, async ctx => {
if (!(await requireProductDelete(ctx))) return;
const pid = Number(ctx.match[1]);
await q("INSERT INTO product_overrides(product_id,hidden) VALUES($1,true) ON CONFLICT(product_id) DO UPDATE SET hidden=true, updated_at=NOW()", [pid]);
invalidateCaches();
await ctx.reply("🗑️ تم حذف المنتج من واجهة المتجر. يمكنك إظهاره لاحقاً من إدارة المنتج.");
});

// ── Admin: category management ────────────────────────────────────────
bot.action(/^adm:catDelete:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const cid = Number(ctx.match[1]);
if (!Number.isInteger(cid) || cid <= 0) { await ctx.reply("⚠️ لا يمكن حذف هذا القسم."); return; }
await q("INSERT INTO category_overrides(category_id,hidden) VALUES($1,true) ON CONFLICT(category_id) DO UPDATE SET hidden=true, updated_at=NOW()", [cid]);
invalidateCaches();
await ctx.reply("🗑️ تم حذف القسم من واجهة المتجر.");
});
bot.action(/^adm:catEdit:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:editCategoryName", categoryId: Number(ctx.match[1]) }); await ctx.reply("✏️ أرسل الاسم الجديد للقسم (أو reset):"); });
bot.action(/^adm:catToggle:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const cid = Number(ctx.match[1]); const cur = (await q("SELECT hidden FROM category_overrides WHERE category_id=$1", [cid])).rows[0];
const nextHidden = !(cur?.hidden ?? false);
await q("INSERT INTO category_overrides(category_id,hidden) VALUES($1,$2) ON CONFLICT(category_id) DO UPDATE SET hidden=$2, updated_at=NOW()", [cid, nextHidden]);
invalidateCaches(); await ctx.reply(nextHidden ? "🙈 تم إخفاء القسم." : "👁 تم إظهار القسم.");
});
bot.action(/^adm:catMarkup:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const cid = Number(ctx.match[1]); const cur = (await q("SELECT custom_markup_percent FROM category_overrides WHERE category_id=$1", [cid])).rows[0]; setStep(ctx.from.id, { kind: "admin:setCatMarkup", categoryId: cid }); await ctx.reply(`% نسبة ربح القسم ${cid}\nالحالية: ${cur?.custom_markup_percent ?? "غير محددة"}\nأرسل النسبة أو reset:`); });
bot.action(/^adm:moveCatAll:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:moveCatAll", sourceCategoryId: Number(ctx.match[1]) }); await ctx.reply(`🚚 نقل جميع منتجات القسم\nأرسل اسم القسم الهدف أو cancel:`, Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", `cat:${ctx.match[1]}:1:0`)]])); });
bot.action(/^adm:moveCatToParent:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const cid = Number(ctx.match[1]);
if (!Number.isInteger(cid) || cid <= 0) { await ctx.reply("⚠️ القسم المصدر غير صالح."); return; }
setStep(ctx.from.id, { kind: "admin:moveCatToParent", categoryId: cid });
const source = await findApi1CategoryById(cid);
const sourceName = source?.name || `قسم ${cid}`;

// نبني قائمة الهدف من قاعدة البيانات/الكاش مع إعطاء الأقسام الرئيسية أولوية،
// حتى يستطيع المدير نقل «بطاقات الألعاب» من القسم 3 إلى القسم 1 بسهولة.
const all = [];
const seenIds = new Set();
const visited = new Set();
const walk = async parentId => {
  const key = Number(parentId);
  if (visited.has(key)) return;
  visited.add(key);
  const content = await getCachedContent(parentId);
  for (const c of content.categories || []) {
    const id = Number(c.id);
    if (!Number.isInteger(id) || id <= 0 || id === cid || seenIds.has(id)) continue;
    seenIds.add(id);
    all.push({ ...c, _root: key === 0 });
    await walk(id);
  }
};
try { await walk(0); } catch (e) { console.error("Move-category target list failed:", e); }

// استبعاد القسم نفسه وجميع أحفاده لمنع إنشاء حلقة في شجرة الأقسام.
const descendants = new Set([cid]);
let changed = true;
while (changed) {
  changed = false;
  for (const c of all) {
    const id = Number(c.id);
    const parent = Number(c.parent_id ?? 0);
    if (!descendants.has(id) && descendants.has(parent)) {
      descendants.add(id);
      changed = true;
    }
  }
}

const candidates = all
  .filter(c => !descendants.has(Number(c.id)))
  .sort((a, b) => Number(b._root) - Number(a._root) || String(a.name ?? "").localeCompare(String(b.name ?? ""), "ar"))
  .slice(0, 80);

const buttons = candidates.map(c => Markup.button.callback(`📂 ${String(c.name ?? `قسم ${c.id}`).slice(0, 48)}`, `adm:moveCatTarget:${cid}:${c.id}`));
const rows = [];
for (let i = 0; i < buttons.length; i += 2) rows.push(buttons.slice(i, i + 2));
rows.unshift([Markup.button.callback("📁 الجذر (خارج الأقسام)", `adm:moveCatTarget:${cid}:0`)]);
rows.push([Markup.button.callback("❌ إلغاء", `cat:${cid}:1:0`)]);
await ctx.reply(`📁 نقل القسم «${sourceName}»
اختر القسم الهدف مباشرة، أو أرسل اسم القسم الهدف في رسالة.

مثال: إذا أردت نقل «بطاقات الألعاب» إلى القسم 1، اختر اسم القسم 1 من الأزرار أدناه.`, Markup.inlineKeyboard(rows));
});

bot.action(/^adm:moveCatTarget:(\d+):(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const sourceId = Number(ctx.match[1]);
const targetId = Number(ctx.match[2]);
if (!Number.isFinite(sourceId) || sourceId <= 0) { await ctx.reply("⚠️ القسم المصدر غير صالح."); return; }
if (targetId === sourceId) { await ctx.reply("⚠️ لا يمكن نقل القسم إلى نفسه."); return; }
if (targetId > 0) {
  const target = await findApi1CategoryById(targetId);
  if (!target) { await ctx.reply("⚠️ القسم الهدف غير موجود."); return; }
  let cursor = targetId;
  const seen = new Set([sourceId]);
  while (cursor > 0) {
    if (seen.has(cursor)) { await ctx.reply("⚠️ لا يمكن نقل القسم إلى داخل أحد أقسامه الفرعية."); return; }
    seen.add(cursor);
    const row = (await q("SELECT custom_parent_id FROM category_overrides WHERE category_id=$1", [cursor])).rows[0];
    const provider = await findApi1CategoryById(cursor);
    cursor = Number(row?.custom_parent_id ?? provider?.parent_id ?? 0);
  }
}
await q("INSERT INTO category_overrides(category_id,custom_parent_id) VALUES($1,$2) ON CONFLICT(category_id) DO UPDATE SET custom_parent_id=$2, updated_at=NOW()", [sourceId, targetId === 0 ? null : targetId]);
invalidateCaches();
setStep(ctx.from.id, { kind: "idle" });
const targetName = targetId === 0 ? "الجذر" : (await findApi1CategoryById(targetId))?.name || `قسم ${targetId}`;
await ctx.reply(`✅ تم نقل القسم إلى «${targetName}».`);
});
bot.action(/^adm:moveApi2CatToParent:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const cid = Number(ctx.match[1]);
const cat = (await q("SELECT * FROM api_source_categories WHERE id=$1", [cid])).rows[0];
if (!cat) { await ctx.reply("⚠️ القسم غير موجود."); return; }
setStep(ctx.from.id, { kind: "admin:moveApi2CatToParent", categoryId: cid });
await ctx.reply(`📁 نقل «${cat.name}» إلى داخل قسم آخر\nأرسل اسم القسم الهدف كما يظهر في المتجر، أو اكتب "0" للجذر أو "cancel" للإلغاء:`, Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", `api2cat:${cid}:1:0`) ]]));
});
bot.action(/^adm:deleteApi2Cat:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const cid = Number(ctx.match[1]);
await q("UPDATE api_source_categories SET active=false, admin_deleted=true, updated_at=NOW() WHERE id=$1", [cid]);
await q("UPDATE api_source_products SET available=false, admin_deleted=true, updated_at=NOW() WHERE category_id=$1", [cid]);
invalidateCaches();
await ctx.reply("🗑️ تم حذف القسم ومنتجاته من واجهة المتجر.");
});
bot.action(/^adm:deleteApi2Prod:(\d+)$/, async ctx => {
if (!(await requireProductDelete(ctx))) return;
const pid = Number(ctx.match[1]);
await q("UPDATE api_source_products SET available=false, admin_deleted=true, updated_at=NOW() WHERE id=$1", [pid]);
invalidateCaches();
await ctx.reply("🗑️ تم حذف المنتج من واجهة المتجر.");
});
bot.action(/^adm:api2HideProd:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const pid = Number(ctx.match[1]);
const row = (await q("SELECT name, admin_hidden FROM api_source_products WHERE id=$1", [pid])).rows[0];
if (!row) { await ctx.reply("⚠️ المنتج غير موجود."); return; }
const nextHidden = !row.admin_hidden;
await q("UPDATE api_source_products SET admin_hidden=$1, updated_at=NOW() WHERE id=$2", [nextHidden, pid]);
invalidateCaches();
await ctx.reply(nextHidden ? "🙈 تم إخفاء المنتج من المتجر." : "👁 تم إظهار المنتج من المتجر.");
});
bot.action(/^adm:api2RenameProd:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const pid = Number(ctx.match[1]);
const row = (await q("SELECT name FROM api_source_products WHERE id=$1", [pid])).rows[0];
if (!row) return;
setStep(ctx.from.id, { kind: "admin:renameApi2Product", productId: pid });
await ctx.reply(`📝 أرسل الاسم الجديد للمنتج «${row.name}»:`, Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", `api2prod:${pid}:0`)]]));
});

// ── Admin: settings ───────────────────────────────────────────────────
bot.action("adm:settings", async ctx => { await showSettingsMenu(ctx); });
bot.action("adm:setMarkup", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:setMarkup" }); await ctx.reply("✏️ أرسل نسبة الربح العام (مثال: 5):", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "adm:settings")]])); });
bot.action("adm:setSocialMarkup", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:setSocialMarkup" }); await ctx.reply("✏️ أرسل نسبة ربح السوشل:", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "adm:settings")]])); });
bot.action("adm:setRate", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:setRate" }); await ctx.reply("💱 أرسل سعر الصرف (ل.س/$):", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "adm:settings")]])); });
bot.action("adm:newPass", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:newPassword" }); await ctx.reply("🔑 أرسل كلمة المرور الجديدة (4 أحرف على الأقل):", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "adm:settings")]])); });
bot.action("adm:changeLoginCmd", async ctx => {
if (!(await requireAdmin(ctx))) return;
const cur = await getAdminLoginCommand();
setStep(ctx.from.id, { kind: "admin:changeLoginCmd" });
await ctx.reply(`🔐 الأمر الحالي: ${cur}\nأرسل الأمر الجديد:`);
});
bot.action("adm:toggleStatus", async ctx => {
if (!(await requireAdmin(ctx))) return;
const cur = await getBotStatus(); const next = cur === "on" ? "off" : "on";
await setSetting("bot_status", next);
await ctx.reply(next === "on" ? "🟢 البوت الآن شغال." : "🔴 البوت متوقف الآن.");
await showAdminMenu(ctx);
});

// ── Admin: ping ───────────────────────────────────────────────────────
bot.action("adm:ping", async ctx => {
if (!(await requireAdmin(ctx))) return;
const [enabled, target, interval] = await Promise.all([getSetting("auto_ping_enabled"), getSetting("auto_ping_target_user_id"), getSetting("auto_ping_interval_min")]);
await sendOrEdit(ctx, `🔄 البينج التلقائي\nالحالة: ${enabled === "on" ? "✅ مفعّل" : "❌ موقوف"}\nالمستهدف: ${target || "غير محدد"}\nالفاصل: ${interval} دقيقة`,
Markup.inlineKeyboard([[Markup.button.callback(enabled === "on" ? "❌ إيقاف" : "✅ تفعيل", "adm:pingToggle")], [Markup.button.callback("🎯 تعيين المستهدف", "adm:pingTarget")], [Markup.button.callback("⏱️ تعيين الفاصل", "adm:pingInterval")], [Markup.button.callback("⬅️ رجوع", "admin:menu")]]));
});
bot.action("adm:depositNotifToggle", async ctx => {
if (!(await requireAdmin(ctx))) return;
const current = (await getSetting("deposit_admin_notifications")) === "on";
await setSetting("deposit_admin_notifications", current ? "off" : "on");
await ctx.reply(current ? "🔕 تم إيقاف إشعارات طلبات الإيداع." : "🔔 تم تفعيل إشعارات طلبات الإيداع.");
await showSettingsMenu(ctx);
});
bot.action("adm:pingToggle", async ctx => { if (!(await requireAdmin(ctx))) return; const cur = await getSetting("auto_ping_enabled"); await setSetting("auto_ping_enabled", cur === "on" ? "off" : "on"); await ctx.reply(cur === "on" ? "❌ تم إيقاف البينج." : "✅ تم تفعيل البينج."); });
bot.action("adm:pingTarget", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:pingTarget" }); await ctx.reply("🎯 أرسل ID المستخدم الهدف:"); });
bot.action("adm:pingInterval", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:pingInterval" }); await ctx.reply("⏱️ أرسل الفاصل الزمني بالدقائق:"); });

// ── Admin: contacts ───────────────────────────────────────────────────
bot.action("adm:contacts", async ctx => {
if (!(await requireAdmin(ctx))) return;
const links = (await q("SELECT * FROM contact_links ORDER BY id")).rows;
const rows = links.map(l => [Markup.button.callback(`${l.active ? "🟢" : "🔴"} ${l.name}`, `adm:contactEdit:${l.id}`)]);
rows.push([Markup.button.callback("➕ إضافة", "adm:addContact")]); rows.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
await sendOrEdit(ctx, "📞 وسائل التواصل:", Markup.inlineKeyboard(rows));
});
bot.action("adm:addContact", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:addContact:name" }); await ctx.reply("📞 أرسل اسم وسيلة التواصل:", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "adm:contacts")]])); });
bot.action(/^adm:contactEdit:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const id = Number(ctx.match[1]); const l = (await q("SELECT * FROM contact_links WHERE id=$1", [id])).rows[0]; if (!l) return;
await sendOrEdit(ctx, `📞 ${l.name}\n${l.link}`,
Markup.inlineKeyboard([[Markup.button.callback(l.active ? "🔴 إخفاء" : "🟢 إظهار", `adm:contactToggle:${id}`), Markup.button.callback("🗑️ حذف", `adm:contactDel:${id}`)], [Markup.button.callback("⬅️ رجوع", "adm:contacts")]]));
});
bot.action(/^adm:contactToggle:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const id = Number(ctx.match[1]); const l = (await q("SELECT active FROM contact_links WHERE id=$1", [id])).rows[0]; if (!l) return; await q("UPDATE contact_links SET active=$1 WHERE id=$2", [!l.active, id]); });
bot.action(/^adm:contactDel:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; await q("DELETE FROM contact_links WHERE id=$1", [Number(ctx.match[1])]); await ctx.reply("🗑️ تم الحذف."); });

// ── Admin: virtual categories ─────────────────────────────────────────
bot.action("adm:vcList", async ctx => {
if (!(await requireAdmin(ctx))) return;
const vcs = (await q("SELECT * FROM virtual_categories WHERE parent_id=0 ORDER BY position")).rows;
const rows = vcs.map(v => [Markup.button.callback(`${v.active ? "📂" : "🔒"} ${v.name}`, `vcat:${v.id}:1:0`)]);
rows.push([Markup.button.callback("➕ إضافة قسم", "adm:addVCat")]); rows.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
await sendOrEdit(ctx, "📁 الأقسام المخصصة:", Markup.inlineKeyboard(rows));
});
bot.action("adm:addVCat", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:addVirtualCategory:name", parentId: 0 }); await ctx.reply("📁 أرسل اسم القسم المخصص:", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "adm:vcList")]])); });
bot.action(/^adm:addVCatSub:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const pv = (await q("SELECT name FROM virtual_categories WHERE id=$1", [pid])).rows[0]; setStep(ctx.from.id, { kind: "admin:addVirtualCategory:name", parentId: pid }); await ctx.reply(`📁 أرسل اسم القسم الفرعي داخل "${pv?.name ?? pid}":`, Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", `vcat:${pid}:1:0`)]])); });
bot.action(/^adm:vcEdit:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:editVCatName", vcId: Number(ctx.match[1]) }); await ctx.reply("✏️ أرسل الاسم الجديد للقسم:"); });
bot.action(/^adm:vcToggle:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const id = Number(ctx.match[1]); const v = (await q("SELECT active FROM virtual_categories WHERE id=$1", [id])).rows[0]; if (!v) return; await q("UPDATE virtual_categories SET active=$1, updated_at=NOW() WHERE id=$2", [!v.active, id]); await ctx.reply(!v.active ? "👁 تم الإظهار." : "🙈 تم الإخفاء."); });
bot.action(/^adm:vcDel:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; await q("DELETE FROM virtual_categories WHERE id=$1", [Number(ctx.match[1])]); await ctx.reply("🗑️ تم حذف القسم."); });

// ── Admin: manual categories ──────────────────────────────────────────
bot.action("adm:manualCats", async ctx => { await showManualCategoriesAdmin(ctx); });
bot.action("adm:addMc", async ctx => {
if (!(await requireAdmin(ctx))) return;
setStep(ctx.from.id, { kind: "admin:addManualCategory:name", parentId: 0 });
await ctx.reply("📁 أرسل اسم القسم اليدوي:", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "adm:manualCats")]]));
});
bot.action(/^adm:addMcSub:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const pid = Number(ctx.match[1]);
const pv = (await q("SELECT name FROM manual_categories WHERE id=$1", [pid])).rows[0];
setStep(ctx.from.id, { kind: "admin:addManualCategory:name", parentId: pid });
await ctx.reply(`📁 أرسل اسم القسم الفرعي داخل "${pv?.name ?? pid}":`, Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", `adm:mcManage:${pid}`)]]));
});
bot.action(/^adm:mcManage:(\d+)$/, async ctx => { await showManualCategoryAdmin(ctx, Number(ctx.match[1])); });
bot.action(/^adm:mcEdit:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
setStep(ctx.from.id, { kind: "admin:editManualCategoryName", mcId: Number(ctx.match[1]) });
await ctx.reply("✏️ أرسل الاسم الجديد للقسم:");
});
bot.action(/^adm:mcToggle:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const id = Number(ctx.match[1]);
const v = (await q("SELECT active FROM manual_categories WHERE id=$1", [id])).rows[0];
if (!v) return;
await q("UPDATE manual_categories SET active=$1, updated_at=NOW() WHERE id=$2", [!v.active, id]);
await ctx.reply(!v.active ? "👁 تم الإظهار." : "🙈 تم الإخفاء.");
});
bot.action(/^adm:mcDel:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
await q("DELETE FROM manual_categories WHERE id=$1", [Number(ctx.match[1])]);
await ctx.reply("🗑️ تم حذف القسم.");
});

// ── Admin: manual products ────────────────────────────────────────────
bot.action("adm:manualProds", async ctx => {
if (!(await requireAdmin(ctx))) return;
const prods = (await q("SELECT * FROM manual_products ORDER BY id")).rows;
const pendingCount = (await q("SELECT COUNT(*)::int AS c FROM manual_orders WHERE status='pending'")).rows[0]?.c ?? 0;
const rows = prods.map(p => [Markup.button.callback(`${p.active ? "🛒" : "❌"} ${p.name}`, `adm:manualProd:${p.id}`)]);
rows.push([Markup.button.callback(`📋 طلبات معلقة${pendingCount > 0 ? ` (${pendingCount})` : ""}`, "adm:manualOrders")]);
rows.push([Markup.button.callback("➕ إضافة منتج يدوي", "adm:addManual")]);
rows.push([Markup.button.callback("⬅️ رجوع", "admin:menu")]);
await sendOrEdit(ctx, "🛒 المنتجات اليدوية:", Markup.inlineKeyboard(rows));
});
bot.action("adm:addManual", async ctx => {
if (!(await requireAdmin(ctx))) return;
setStep(ctx.from.id, { kind: "admin:addManualProduct:name" });
await ctx.reply("📝 أرسل اسم المنتج اليدوي:", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "adm:manualProds")]]));
});
bot.action(/^adm:addManualProd:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
setStep(ctx.from.id, { kind: "admin:addManualProduct:name", categoryId: Number(ctx.match[1]) });
await ctx.reply("📝 أرسل اسم المنتج اليدوي:", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", `adm:mcManage:${ctx.match[1]}`)]]));
});
bot.action(/^adm:manualProd:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const pid = Number(ctx.match[1]); const p = (await q("SELECT * FROM manual_products WHERE id=$1", [pid])).rows[0]; if (!p) return;
const viewer = await getUser(ctx.from.id);
const canDelete = !!viewer?.is_super_admin || !!viewer?.can_delete_products;
await sendOrEdit(ctx, `🛒 ${p.name}\nالسعر: ${Number(p.price_usd).toFixed(2)}$\nالربح: ${p.markup_percent ?? "افتراضي"}%\nالمخزون: ${p.stock_qty === -1 ? "غير محدود" : p.stock_qty}\nالحالة: ${p.active ? "✅" : "❌"}`,
Markup.inlineKeyboard([
[Markup.button.callback("✏️ تعديل", `adm:manualProdEdit:${pid}`)],
[Markup.button.callback(p.active ? "❌ تعطيل" : "✅ تفعيل", `adm:manualToggle:${pid}`)],
...(canDelete ? [[Markup.button.callback("🗑️ حذف", `adm:manualDel:${pid}`)]] : []),
[Markup.button.callback("⬅️ رجوع", "adm:manualProds")]
]));
});
bot.action(/^adm:manualProdEdit:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const pid = Number(ctx.match[1]);
const p = (await q("SELECT * FROM manual_products WHERE id=$1", [pid])).rows[0];
if (!p) return;
setStep(ctx.from.id, { kind: "admin:editManualProduct", productId: pid, product: p });
await ctx.reply(
`✏️ تعديل المنتج: ${p.name}\n\nأرسل البيانات بالصيغة:\nname|price|markup|stock|description|instructions\n\nمثال:\nاسم المنتج|5.00|5|100|وصف|تعليمات\n\nأو أرسل "skip" للحفاظ على القيمة الحالية لكل حقل.\n\nالحالي:\nالاسم: ${p.name}\nالسعر: ${p.price_usd}$\nالربح: ${p.markup_percent ?? "افتراضي"}%\nالمخزون: ${p.stock_qty === -1 ? "غير محدود" : p.stock_qty}\nالوصف: ${p.description || "—"}\nالتعليمات: ${p.instructions || "—"}`
);
});
bot.action(/^adm:manualToggle:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const pid = Number(ctx.match[1]);
const p = (await q("SELECT active FROM manual_products WHERE id=$1", [pid])).rows[0];
if (!p) return;
await q("UPDATE manual_products SET active=$1, updated_at=NOW() WHERE id=$2", [!p.active, pid]);
await ctx.reply(!p.active ? "✅ تم التفعيل." : "❌ تم التعطيل.");
});
bot.action(/^adm:manualDel:(\d+)$/, async ctx => {
if (!(await requireProductDelete(ctx))) return;
await q("DELETE FROM manual_products WHERE id=$1", [Number(ctx.match[1])]);
await ctx.reply("🗑️ تم الحذف.");
});
bot.action("adm:manualOrders", async ctx => {
if (!(await requireAdmin(ctx))) return;
const orders = (await q("SELECT * FROM manual_orders WHERE status='pending' ORDER BY id DESC LIMIT 30")).rows;
if (!orders.length) { await sendOrEdit(ctx, "📭 لا توجد طلبات يدوية معلقة.", Markup.inlineKeyboard([[Markup.button.callback("⬅️ رجوع", "adm:manualProds")]])); return; }
const rows = orders.map(o => [Markup.button.callback(`${o.product_name.slice(0, 20)} • ${Number(o.price_usd).toFixed(2)}$`.slice(0, 60), `adm:mord:${o.id}`)]);
rows.push([Markup.button.callback("⬅️ رجوع", "adm:manualProds")]);
await sendOrEdit(ctx, `📋 الطلبات اليدوية المعلقة (${orders.length}):`, Markup.inlineKeyboard(rows));
});
bot.action(/^adm:mord:(\d+)$/, async ctx => { await showManualOrderDetails(ctx, Number(ctx.match[1])); });
bot.action(/^adm:mordAccept:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const oid = Number(ctx.match[1]);
const o = (await q("SELECT * FROM manual_orders WHERE id=$1", [oid])).rows[0];
if (!o || o.status !== "pending") { await ctx.reply("⚠️ تم معالجته مسبقاً."); return; }
setStep(ctx.from.id, { kind: "admin:manualOrderAccept", orderId: oid, userId: Number(o.user_id), productName: o.product_name, priceUsd: Number(o.price_usd) });
await ctx.reply(`'✏️ أرسل رسالة التسليم أو "skip":'`);
});
bot.action(/^adm:mordReject:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const oid = Number(ctx.match[1]);
const o = (await q("SELECT * FROM manual_orders WHERE id=$1", [oid])).rows[0];
if (!o || o.status !== "pending") { await ctx.reply("⚠️ تم معالجته."); return; }
const updated = await q("UPDATE manual_orders SET status='rejected', updated_at=NOW() WHERE id=$1 AND status='pending' RETURNING *", [oid]);
if (!updated.rows.length) { await ctx.reply("⚠️ تم معالجة الطلب مسبقاً."); return; }
await adjustBalance(Number(o.user_id), Number(o.price_usd));
await ctx.reply("✅ تم الرفض وإعادة الرصيد.");
const rate = await getExchangeRate(); const syp = Math.round(Number(o.price_usd) * rate);
await ctx.telegram.sendMessage(o.user_id, `❌ تم رفض طلبك\n🛒 ${o.product_name}\n💰 تمت إعادة ${Number(o.price_usd).toFixed(2)}$ | ${syp.toLocaleString("en-US")} ل.س`, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]])).catch(() => {});
});
bot.action(/^adm:mordReply:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const oid = Number(ctx.match[1]);
const o = (await q("SELECT user_id FROM manual_orders WHERE id=$1", [oid])).rows[0];
if (!o) return;
setStep(ctx.from.id, { kind: "admin:manualOrderReply", orderId: oid, userId: Number(o.user_id) });
await ctx.reply(`💬 أرسل الرد للمستخدم ${o.user_id}:`);
});
bot.action(/^adm:mordMsg:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const oid = Number(ctx.match[1]);
const o = (await q("SELECT user_id FROM manual_orders WHERE id=$1", [oid])).rows[0];
if (!o) return;
setStep(ctx.from.id, { kind: "admin:manualOrderMsg", orderId: oid, userId: Number(o.user_id) });
await ctx.reply(`💬 أرسل الرسالة للمستخدم ${o.user_id}:`);
});

// ── Admin: API Sources ────────────────────────────────────────────────
bot.action("adm:apiSources", async ctx => { await showApiSources(ctx); });
bot.action("adm:addApi", async ctx => {
if (!(await requireAdmin(ctx))) return;
setStep(ctx.from.id, { kind: "admin:addApiSource:name" });
await ctx.reply("🔌 أرسل اسم المصدر:", Markup.inlineKeyboard([[Markup.button.callback("❌ إلغاء", "adm:apiSources")]]));
});
bot.action(/^adm:apiSource:(\d+)$/, async ctx => { await showApiSourceDetails(ctx, Number(ctx.match[1])); });
bot.action(/^adm:apiToggle:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const id = Number(ctx.match[1]);
const src = await getApiSource(id);
if (!src) return;
await updateApiSource(id, { active: !src.active });
await ctx.reply(src.active ? "🔴 تم التعطيل." : "✅ تم التفعيل.");
});
bot.action(/^adm:apiSync:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const id = Number(ctx.match[1]);
await ctx.reply("🔄 جاري تحديث المنتجات...");
try {
const count = await syncApiSource(id);
invalidateCaches();
await refreshCatalogCache().catch(() => {});
await ctx.reply(`✅ تم تحديث ${count} منتج.`);
} catch (err) {
await ctx.reply(`❌ خطأ: ${err.message}`);
}
});
bot.action(/^adm:apiMarkup:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
const id = Number(ctx.match[1]);
const src = await getApiSource(id);
if (!src) return;
setStep(ctx.from.id, { kind: "admin:editApiMarkup", apiSourceId: id });
await ctx.reply(`% نسبة ربح ${src.name}\nالحالية: ${src.markup_percent}%\nأرسل النسبة الجديدة:`);
});
bot.action(/^adm:apiDel:(\d+)$/, async ctx => {
if (!(await requireAdmin(ctx))) return;
await deleteApiSource(Number(ctx.match[1]));
await ctx.reply("🗑️ تم حذف المصدر.");
});

// ── Admin: nav buttons ────────────────────────────────────────────────
bot.action("adm:btnLabels", async ctx => {
if (!(await requireAdmin(ctx))) return;
const [b, h, p2, n] = await Promise.all([getBtnBackLabel(), getBtnHomeLabel(), getBtnPrevLabel(), getBtnNextLabel()]);
await sendOrEdit(ctx, `🔘 أزرار التنقل:\nرجوع: ${b}\nالرئيسية: ${h}\nالسابق: ${p2}\nالتالي: ${n}`,
Markup.inlineKeyboard([[Markup.button.callback("✏️ زر الرجوع", "adm:btnEdit:btn_back_label:رجوع")], [Markup.button.callback("✏️ زر الرئيسية", "adm:btnEdit:btn_home_label:الرئيسية")], [Markup.button.callback("✏️ زر السابق", "adm:btnEdit:btn_prev_label:السابق")], [Markup.button.callback("✏️ زر التالي", "adm:btnEdit:btn_next_label:التالي")], [Markup.button.callback("🔄 إعادة الافتراضي", "adm:btnReset")], [Markup.button.callback("⬅️ رجوع", "adm:settings")]]));
});
bot.action(/^adm:btnEdit:([^:]+):(.+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const key = ctx.match[1]; setStep(ctx.from.id, { kind: "admin:editBtnLabel", key }); await ctx.reply("✏️ أرسل النص الجديد للزر:"); });
bot.action("adm:btnReset", async ctx => {
if (!(await requireAdmin(ctx))) return;
await Promise.all(["btn_back_label", "btn_home_label", "btn_prev_label", "btn_next_label"].map(k => setSetting(k, DEFAULTS[k])));
await ctx.reply("✅ تمت إعادة الأزرار للافتراضي.");
});

// ── Admin: AI support ─────────────────────────────────────────────────
bot.action("adm:aiSupport", async ctx => {
if (!(await requireAdmin(ctx))) return;
clearAiHistory(ctx.from.id);
setStep(ctx.from.id, { kind: "admin:aiSupport" });
await ctx.reply(`🛟 مساعد الإدارة${hasAiKey() ? "" : " (وضع FAQ)"}\nأرسل سؤالك أو "خروج" للإنهاء:`, Markup.inlineKeyboard([[Markup.button.callback("⬅️ رجوع", "admin:menu")]]));
});

// ── Text/photo input handler ───────────────────────────────────────────
// Keep this handler inside startBot. The previous version had the switch
// cases below outside any handler, which caused a syntax error on Railway.
const findOrderProduct = async step => {
let products = await getCachedProducts();
let product = products.find(item => String(item.id) === String(step.productId));
if (!product && step._api2 && step._api2_id) {
const result = await q("SELECT * FROM api_source_products WHERE id=$1", [step._api2_id]);
const row = result.rows[0];
if (row) {
product = {
id: step.productId,
name: row.name,
params: row.params,
available: row.available,
_source: "api2",
_source_id: row.api_source_id,
_external_id: row.external_id,
};
}
}
return product;
};

bot.on("text", async ctx => {
const txt = (ctx.message?.text ?? "").trim();
if (!txt) return;
const step = getStep(ctx.from.id);

switch (step.kind) {
case "admin:login": {
const password = await getAdminPassword();
const user = await getUser(ctx.from.id);
if (!user?.is_admin || !password || txt !== password) {
await ctx.reply("❌ كلمة المرور غير صحيحة.");
return;
}
authedAdminIds.add(ctx.from.id);
await setAdminSession(ctx.from.id, true);
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply("✅ تم تسجيل الدخول.");
await showAdminMenu(ctx);
return;
}
case "order:qty": {
const qty = Number(txt.replace(/,/g, ""));
const limits = Array.isArray(step.qtyValues)
? step.qtyValues
: [Number(step.qtyValues?.min), Number(step.qtyValues?.max)];
const valid = Number.isFinite(qty) && qty > 0 &&
(Array.isArray(step.qtyValues)
? step.qtyValues.includes(qty)
: qty >= limits[0] && qty <= limits[1]);
if (!valid) {
await ctx.reply("⚠️ الكمية غير صالحة. أرسل رقماً ضمن المجال المطلوب.");
return;
}
const product = await findOrderProduct(step);
if (!product) {
await ctx.reply("⚠️ المنتج غير موجود.");
return;
}
await askNextParam(ctx, product, step.priceUsd, qty, step.paramKeys ?? [], {}, 0, step.backTo);
return;
}
case "order:params": {
const product = await findOrderProduct(step);
if (!product) {
await ctx.reply("⚠️ المنتج غير موجود.");
return;
}
const key = step.paramKeys?.[step.idx];
const collected = { ...(step.collected ?? {}) };
if (key) collected[key] = txt;
await askNextParam(ctx, product, step.priceUsd, step.qty, step.paramKeys ?? [], collected, (step.idx ?? 0) + 1, step.backTo);
return;
}
case "admin:depositApproveAmount": {
const amount = Number(txt.replace(/,/g, ""));
if (!Number.isFinite(amount) || amount <= 0) {
await ctx.reply("⚠️ أرسل مبلغاً صحيحاً أكبر من صفر.");
return;
}
await approveDeposit(ctx, step.depositId, amount);
return;
}
case "deposit:info": {
const amount = extractAmountFromText(txt, await getExchangeRate());
if (!amount) {
await ctx.reply("⚠️ لم أتعرف على المبلغ. أرسله مثلاً: 5$ أو 660 ل.س.");
return;
}
const next = { ...step, amount };
setStep(ctx.from.id, next);
if (next.photoFileId) await completeDepositRequest(ctx, next);
else await ctx.reply("✅ تم حفظ المبلغ. الآن أرسل صورة إشعار التحويل.");
return;
}
case "admin:setMarkup":
case "admin:setSocialMarkup": {
const value = Number(txt);
if (!Number.isFinite(value) || value < 0) {
await ctx.reply("⚠️ أرسل نسبة صحيحة أكبر من أو تساوي صفر.");
return;
}
await setSetting(step.kind === "admin:setMarkup" ? "markup_percent" : "social_markup_percent", String(value));
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply("✅ تم حفظ النسبة.");
return;
}
case "admin:setRate": {
const value = Number(txt.replace(/,/g, ""));
if (!Number.isFinite(value) || value <= 0) {
await ctx.reply("⚠️ أرسل سعر صرف صحيحاً أكبر من صفر.");
return;
}
await setSetting("exchange_rate", String(value));
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply("✅ تم حفظ سعر الصرف.");
return;
}
case "admin:newPassword": {
if (txt.length < 4) {
await ctx.reply("⚠️ كلمة المرور يجب أن تكون 4 أحرف على الأقل.");
return;
}
await setSetting("admin_password", txt);
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply("✅ تم تغيير كلمة المرور.");
return;
}
case "admin:changeLoginCmd": {
if (!txt || txt.length < 3) {
await ctx.reply("⚠️ الأمر غير صالح.");
return;
}
await setSetting("admin_login_command", txt);
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply("✅ تم تغيير أمر الدخول السري.");
return;
}
case "admin:userBalance": {
const value = Number(txt.replace(/,/g, ""));
if (!Number.isFinite(value) || value <= 0) {
await ctx.reply("⚠️ أرسل مبلغاً صحيحاً أكبر من صفر.");
return;
}
await adjustBalance(step.userId, step.mode === "sub" ? -value : value);
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply("✅ تم تحديث الرصيد.");
await showUserCard(ctx, step.userId);
return;
}
case "admin:findUser": {
const users = await searchUser(txt);
setStep(ctx.from.id, { kind: "idle" });
if (!users.length) {
await ctx.reply("📭 لم يتم العثور على مستخدم.");
return;
}
const rows = users.map(user => [
Markup.button.callback(
`${user.first_name ?? "—"}${user.username ? ` @${user.username}` : ""}`,
`adm:user:${user.id}`,
),
]);
await ctx.reply("👥 نتائج البحث:", Markup.inlineKeyboard(rows));
return;
}
case "admin:broadcast": {
const users = await listUsers(0, 100000);
let sent = 0;
for (const user of users) {
try {
await ctx.telegram.sendMessage(user.id, txt);
sent++;
} catch { /* user may have blocked the bot */ }
}
await q("INSERT INTO broadcasts(message,sent_by,sent_count) VALUES($1,$2,$3)", [txt, ctx.from.id, sent]);
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply(`✅ تم إرسال الرسالة إلى ${sent} مستخدماً.`);
return;
}
case "admin:manualOrderAccept": {
const delivery = txt.toLowerCase() === "skip" ? null : txt;
const order = (await q("SELECT * FROM manual_orders WHERE id=$1", [step.orderId])).rows[0];
if (!order || order.status !== "pending") {
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply("⚠️ الطلب غير موجود أو تمت معالجته مسبقاً.");
return;
}
const updated = await q("UPDATE manual_orders SET status='accepted', admin_note=$1, updated_at=NOW() WHERE id=$2 AND status='pending' RETURNING id", [delivery, step.orderId]);
if (!updated.rows.length) {
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply("⚠️ تم معالجة الطلب مسبقاً.");
return;
}
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply("✅ تم قبول وتسليم الطلب.");
const message = `✅ تم تنفيذ طلبك\n🛒 ${order.product_name}${delivery ? `\n\n🔑 تفاصيل الطلب:\n${delivery}` : ""}`;
await ctx.telegram.sendMessage(order.user_id, message, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]])).catch(() => {});
return;
}
case "admin:manualOrderReply": {
await q("INSERT INTO manual_order_replies(order_id,admin_id,message) VALUES($1,$2,$3)", [step.orderId, ctx.from.id, txt]);
await ctx.telegram.sendMessage(step.userId, `💬 رد الإدارة:\n\n${txt}`).catch(() => {});
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply("✅ تم إرسال الرد.");
return;
}
case "admin:manualOrderMsg": {
const oid = step.orderId;
const order = (await q("SELECT user_id FROM manual_orders WHERE id=$1", [oid])).rows[0];
if (order) {
await ctx.telegram.sendMessage(order.user_id, `📩 رسالة من الإدارة:\n\n${txt}`).catch(() => {});
}
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply("✅ تم إرسال الرسالة.");
return;
}
case "admin:moveCatToParent": {
if (txt.toLowerCase() === "cancel") { setStep(ctx.from.id, { kind: "idle" }); await showAdminMenu(ctx); return; }
const sourceId = Number(step.categoryId);
if (!Number.isFinite(sourceId) || sourceId <= 0) { setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("⚠️ القسم المصدر غير صالح."); return; }
if (txt === "0" || txt.toLowerCase() === "reset") {
await q("INSERT INTO category_overrides(category_id,custom_parent_id) VALUES($1,NULL) ON CONFLICT(category_id) DO UPDATE SET custom_parent_id=NULL, updated_at=NOW()", [sourceId]);
invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم نقل القسم إلى الجذر."); return;
}
const visited = new Set();
const matches = [];
const walk = async parentId => {
if (visited.has(parentId)) return;
visited.add(parentId);
const content = await getCachedContent(parentId);
for (const c of content.categories || []) {
if (String(c.name ?? "").trim().toLowerCase() === txt.trim().toLowerCase()) matches.push(c);
await walk(c.id);
}
};
try { await walk(0); } catch (e) { await ctx.reply(`❌ تعذر البحث عن القسم: ${e.message}`); return; }
if (!matches.length) { await ctx.reply("❌ لم أجد قسماً بهذا الاسم ."); return; }
if (matches.length > 1) { await ctx.reply("⚠️ يوجد أكثر من قسم بنفس الاسم. أرسل اسماً مميزاً."); return; }
const target = matches[0];
if (Number(target.id) === sourceId) { await ctx.reply("⚠️ لا يمكن نقل القسم إلى نفسه."); return; }
await q("INSERT INTO category_overrides(category_id,custom_parent_id) VALUES($1,$2) ON CONFLICT(category_id) DO UPDATE SET custom_parent_id=$2, updated_at=NOW()", [sourceId, target.id]);
invalidateCaches(); setStep(ctx.from.id, { kind: "idle" });
await ctx.reply(`✅ تم نقل القسم إلى داخل «${target.name}».`);
return;
}
case "admin:moveProduct": {
const pid = Number(step.productId);
if (!Number.isFinite(pid) || pid <= 0) { setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("⚠️ المنتج غير صالح."); return; }
if (txt.toLowerCase() === "reset" || txt === "0") {
await q("INSERT INTO product_overrides(product_id,custom_category_id) VALUES($1,NULL) ON CONFLICT(product_id) DO UPDATE SET custom_category_id=NULL, updated_at=NOW()", [pid]);
invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم إعادة المنتج إلى قسمه الأصلي."); return;
}
const visited = new Set();
const matches = [];
const walk = async parentId => {
if (visited.has(parentId)) return;
visited.add(parentId);
const content = await getCachedContent(parentId);
for (const c of content.categories || []) {
if (String(c.name ?? "").trim().toLowerCase() === txt.trim().toLowerCase()) matches.push(c);
await walk(c.id);
}
};
try { await walk(0); } catch (e) { await ctx.reply(`❌ تعذر البحث عن القسم: ${e.message}`); return; }
if (!matches.length) { await ctx.reply("❌ لم أجد قسماً بهذا الاسم ."); return; }
if (matches.length > 1) { await ctx.reply("⚠️ يوجد أكثر من قسم بنفس الاسم. أرسل اسماً مميزاً."); return; }
await q("INSERT INTO product_overrides(product_id,custom_category_id) VALUES($1,$2) ON CONFLICT(product_id) DO UPDATE SET custom_category_id=$2, updated_at=NOW()", [pid, matches[0].id]);
invalidateCaches(); setStep(ctx.from.id, { kind: "idle" });
await ctx.reply(`✅ تم نقل المنتج إلى قسم «${matches[0].name}».`);
return;
}
case "admin:renameApi2Product": {
const pid = Number(step.productId);
if (!Number.isFinite(pid) || pid <= 0 || !txt) { await ctx.reply("⚠️ الاسم غير صالح."); return; }
await q("UPDATE api_source_products SET name=$1, custom_name=$1, updated_at=NOW() WHERE id=$2", [txt, pid]);
invalidateCaches();
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply("✅ تم تغيير اسم المنتج.");
return;
}
case "admin:moveApi2CatToParent": {
if (txt.toLowerCase() === "cancel") { setStep(ctx.from.id, { kind: "idle" }); await showAdminMenu(ctx); return; }
const sourceId = Number(step.categoryId);
const src = (await q("SELECT * FROM api_source_categories WHERE id=$1", [sourceId])).rows[0];
if (!src) { setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("⚠️ القسم المصدر غير موجود."); return; }
if (txt === "0" || txt.toLowerCase() === "reset") {
await q("UPDATE api_source_categories SET custom_parent_id=NULL, updated_at=NOW() WHERE id=$1", [sourceId]);
invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم نقل القسم إلى الجذر."); return;
}
const sourceName = String(txt).trim().toLowerCase();
const candidates = (await q("SELECT * FROM api_source_categories WHERE api_source_id=$1 AND active=true ORDER BY id", [src.api_source_id])).rows
.filter(c => String(c.name ?? "").trim().toLowerCase() === sourceName && Number(c.id) !== sourceId);
if (!candidates.length) { await ctx.reply("❌ لم أجد قسماً بهذا الاسم ."); return; }
if (candidates.length > 1) { await ctx.reply("⚠️ يوجد أكثر من قسم بنفس الاسم . أرسل اسماً مميزاً."); return; }
const target = candidates[0];
// Prevent cycles by walking the target's effective parents.
let cursor = target.id;
const seen = new Set([sourceId]);
while (cursor && Number(cursor) !== 0) {
if (seen.has(Number(cursor))) { await ctx.reply("⚠️ لا يمكن نقل القسم إلى داخل أحد أقسامه الفرعية."); return; }
seen.add(Number(cursor));
cursor = (await q("SELECT COALESCE(custom_parent_id,parent_id) AS parent_id FROM api_source_categories WHERE id=$1", [cursor])).rows[0]?.parent_id ?? 0;
}
await q("UPDATE api_source_categories SET custom_parent_id=$1, updated_at=NOW() WHERE id=$2", [target.id, sourceId]);
invalidateCaches(); setStep(ctx.from.id, { kind: "idle" });
await ctx.reply(`✅ تم نقل القسم إلى داخل «${target.name}».`);
return;
}
case "admin:addApiSource:name": {
setStep(ctx.from.id, { kind: "admin:addApiSource:url", name: txt });
await ctx.reply("🔗 أرسل أرسل رابط المصدر (base URL):");
return;
}
case "admin:addApiSource:url": {
setStep(ctx.from.id, { kind: "admin:addApiSource:token", name: step.name, baseUrl: txt });
await ctx.reply("🔑 أرسل رمز الربط:");
return;
}
case "admin:addApiSource:token": {
setStep(ctx.from.id, { kind: "admin:addApiSource:markup", name: step.name, baseUrl: step.baseUrl, apiToken: txt });
await ctx.reply("% أرسل نسبة الربح الافتراضية (مثال: 3):");
return;
}
case "admin:addApiSource:markup": {
const markup = Number(txt.replace(/,/g, ""));
if (!Number.isFinite(markup) || markup < 0) { await ctx.reply("⚠️ نسبة غير صالحة. أرسل رقماً مثل 5"); return; }
const baseUrl = String(step.baseUrl ?? "").trim().replace(/\/+$/, "");
if (!/^https?:\/\//i.test(baseUrl)) { await ctx.reply("⚠️ رابط المصدر غير صالح. أرسله بهذا الشكل: https://example.com"); return; }
if (!step.apiToken?.trim()) { await ctx.reply("⚠️ رمز الربط فارغ."); return; }
try {
const src = await createApiSource(step.name, baseUrl, step.apiToken.trim(), markup);
try { await syncApiSource(src.id); } catch (e) { console.error("Initial API sync failed:", e.message); }
invalidateCaches();
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply(`✅ تم إضافة المصدر: ${src.name}\n🔄 تم حفظ المنتجات وتحديث الأقسام.`);
} catch (e) {
console.error("Create product source failed:", e);
await ctx.reply(`❌ تعذر إضافة المصدر.\nالسبب: ${e?.message ?? "خطأ غير معروف"}`);
}
return;
}
case "admin:editApiMarkup": {
const markup = Number(txt.replace(/,/g, ""));
if (!Number.isFinite(markup) || markup < 0) { await ctx.reply("⚠️ نسبة غير صالحة."); return; }
try {
await updateApiSource(step.apiSourceId, { markup_percent: markup });
invalidateCaches();
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply("✅ تم تحديث نسبة الربح.");
} catch (e) {
console.error("API markup update failed:", e);
await ctx.reply(`❌ تعذر حفظ نسبة الربح.\nالسبب: ${e?.message ?? "خطأ غير معروف"}`);
}
return;
}
case "admin:editBtnLabel": {
await setSetting(step.key, txt);
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply("✅ تم تحديث نص الزر.");
return;
}
case "admin:pingTarget": {
const targetId = Number(txt);
if (!Number.isFinite(targetId) || targetId <= 0) { await ctx.reply("⚠️ ID غير صالح."); return; }
await setSetting("auto_ping_target_user_id", String(targetId));
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply("✅ تم تعيين المستهدف.");
return;
}
case "admin:pingInterval": {
const mins = Number(txt);
if (!Number.isFinite(mins) || mins < 1) { await ctx.reply("⚠️ قيمة غير صالحة (دقيقة واحدة على الأقل)."); return; }
await setSetting("auto_ping_interval_min", String(mins));
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply("✅ تم تعيين الفاصل الزمني.");
return;
}
case "admin:addManualCategory:name": {
const pos = (await q("SELECT COALESCE(MAX(position),0)+1 AS p FROM manual_categories WHERE parent_id=$1", [step.parentId ?? 0])).rows[0]?.p ?? 1;
await q("INSERT INTO manual_categories(name,parent_id,position) VALUES($1,$2,$3)", [txt, step.parentId ?? 0, pos]);
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply("✅ تم إضافة القسم اليدوي.");
return;
}
case "admin:editManualCategoryName": {
await q("UPDATE manual_categories SET name=$1, updated_at=NOW() WHERE id=$2", [txt, step.mcId]);
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply("✅ تم تغيير اسم القسم.");
return;
}
case "admin:editPrice": {
const raw = txt.trim().toLowerCase();
if (raw === "reset") {
  await q("INSERT INTO product_overrides(product_id,product_name) VALUES($1,$2) ON CONFLICT(product_id) DO UPDATE SET custom_markup_percent=NULL, custom_price_usd=NULL, updated_at=NOW()", [step.productId, step.productName]);
  invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تمت إعادة سعر المنتج للافتراضي."); return;
}
if (raw.startsWith("%")) {
  const n = Number(raw.slice(1).trim());
  if (!Number.isFinite(n) || n < 0) { await ctx.reply("⚠️ نسبة غير صالحة."); return; }
  await q("INSERT INTO product_overrides(product_id,product_name,custom_markup_percent,custom_price_usd) VALUES($1,$2,$3,NULL) ON CONFLICT(product_id) DO UPDATE SET custom_markup_percent=$3, custom_price_usd=NULL, updated_at=NOW()", [step.productId, step.productName, n]);
} else {
  const n = Number(raw.startsWith("$") ? raw.slice(1).trim() : raw);
  if (!Number.isFinite(n) || n < 0) { await ctx.reply("⚠️ أرسل %5 أو $2.5 أو reset."); return; }
  await q("INSERT INTO product_overrides(product_id,product_name,custom_price_usd,custom_markup_percent) VALUES($1,$2,$3,NULL) ON CONFLICT(product_id) DO UPDATE SET custom_price_usd=$3, custom_markup_percent=NULL, updated_at=NOW()", [step.productId, step.productName, n]);
}
invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم حفظ سعر المنتج."); return;
}
case "admin:editProductInstructions": {
const value = txt.toLowerCase() === "clear" ? null : txt;
await q("INSERT INTO product_overrides(product_id,product_name,instructions) VALUES($1,$2,$3) ON CONFLICT(product_id) DO UPDATE SET instructions=$3, updated_at=NOW()", [step.productId, step.productName, value]);
invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(value ? "✅ تم حفظ التعليمات." : "✅ تم مسح التعليمات."); return;
}
case "admin:renameProduct": {
const value = txt.toLowerCase() === "reset" ? null : txt;
await q("INSERT INTO product_overrides(product_id,product_name,custom_name) VALUES($1,$2,$3) ON CONFLICT(product_id) DO UPDATE SET custom_name=$3, updated_at=NOW()", [step.productId, step.productName, value]);
invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(value ? `✅ تم تغيير الاسم إلى «${value}».` : "✅ تمت إعادة الاسم للافتراضي."); return;
}
case "admin:editCategoryName": {
const value = txt.toLowerCase() === "reset" ? null : txt;
await q("INSERT INTO category_overrides(category_id,custom_name) VALUES($1,$2) ON CONFLICT(category_id) DO UPDATE SET custom_name=$2, updated_at=NOW()", [step.categoryId, value]);
invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(value ? "✅ تم تغيير اسم القسم." : "✅ تمت إعادة اسم القسم."); return;
}
case "admin:setCatMarkup": {
if (txt.toLowerCase() === "reset") {
  await q("INSERT INTO category_overrides(category_id) VALUES($1) ON CONFLICT(category_id) DO UPDATE SET custom_markup_percent=NULL, updated_at=NOW()", [step.categoryId]);
  invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تمت إعادة نسبة القسم للافتراضي."); return;
}
const n = Number(txt); if (!Number.isFinite(n) || n < 0) { await ctx.reply("⚠️ نسبة غير صالحة."); return; }
await q("INSERT INTO category_overrides(category_id,custom_markup_percent) VALUES($1,$2) ON CONFLICT(category_id) DO UPDATE SET custom_markup_percent=$2, updated_at=NOW()", [step.categoryId, n]);
invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ نسبة القسم: ${n}%.`); return;
}
case "admin:moveCatAll": {
if (txt.toLowerCase() === "cancel") { setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("❌ تم الإلغاء."); return; }
const sourceId = Number(step.sourceCategoryId);
if (!Number.isFinite(sourceId) || sourceId <= 0) { setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("⚠️ القسم المصدر غير صالح."); return; }
const targetName = txt.trim().toLowerCase();
const matches = [];
const visited = new Set();
const walk = async parentId => {
  if (visited.has(String(parentId))) return;
  visited.add(String(parentId));
  const content = await getCachedContent(parentId);
  for (const c of content.categories || []) {
    if (String(c.name ?? "").trim().toLowerCase() === targetName) matches.push(c);
    await walk(c.id);
  }
};
try { await walk(0); } catch (e) { await ctx.reply(`❌ تعذر البحث عن القسم: ${e.message}`); return; }
if (!matches.length) { await ctx.reply("❌ لم أجد قسماً بهذا الاسم."); return; }
if (matches.length > 1) { await ctx.reply("⚠️ يوجد أكثر من قسم بنفس الاسم. أرسل اسماً مميزاً."); return; }
const target = matches[0];
const all = await getCachedProducts();
const toMove = all.filter(p => Number(p.parent_id) === sourceId && p._source !== "api2");
for (const prod of toMove) {
  await q("INSERT INTO product_overrides(product_id,product_name,custom_category_id) VALUES($1,$2,$3) ON CONFLICT(product_id) DO UPDATE SET custom_category_id=$3, updated_at=NOW()", [prod.id, prod.name, target.id]);
}
invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`✅ تم نقل ${toMove.length} منتج إلى قسم «${target.name}».`); return;
}
case "admin:editVCatName": {
await q("UPDATE virtual_categories SET name=$1, updated_at=NOW() WHERE id=$2", [txt, step.vcId]);
setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم تغيير اسم القسم."); return;
}
case "admin:addContact:name": {
setStep(ctx.from.id, { kind: "admin:addContact:link", name: txt }); await ctx.reply("🔗 أرسل الرابط أو @username:"); return;
}
case "admin:addContact:link": {
await q("INSERT INTO contact_links(name,link) VALUES($1,$2)", [step.name, txt]);
setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم إضافة وسيلة التواصل."); return;
}
case "admin:addMethod:name": {
setStep(ctx.from.id, { kind: "admin:addMethod:id", name: txt }); await ctx.reply("🔑 أرسل المعرف/الرقم:"); return;
}
case "admin:addMethod:id": {
setStep(ctx.from.id, { kind: "admin:addMethod:instr", name: step.name, identifier: txt }); await ctx.reply("📋 أرسل التعليمات:"); return;
}
case "admin:addMethod:instr": {
setStep(ctx.from.id, { kind: "admin:addMethod:photo", name: step.name, identifier: step.identifier, instructions: txt });
await ctx.reply("🖼 أرسل صورة لطريقة الإيداع أو اكتب skip لتخطي الصورة:"); return;
}
case "admin:addMethod:photo": {
if (txt.toLowerCase() === "skip") {
  await q("INSERT INTO deposit_methods(name,identifier,instructions) VALUES($1,$2,$3)", [step.name, step.identifier, step.instructions]);
  setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم إضافة طريقة الإيداع."); return;
}
await ctx.reply("⚠️ أرسل صورة أو اكتب skip لتخطي الصورة."); return;
}
case "admin:editMethodInstructions": {
await q("UPDATE deposit_methods SET instructions=$1, updated_at=NOW() WHERE id=$2", [txt, step.methodId]);
setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم تحديث التعليمات."); return;
}
case "admin:addVirtualCategory:name": {
const pos = (await q("SELECT COALESCE(MAX(position),0)+1 AS p FROM virtual_categories WHERE parent_id=$1", [step.parentId ?? 0])).rows[0]?.p ?? 1;
await q("INSERT INTO virtual_categories(name,parent_id,position) VALUES($1,$2,$3)", [txt, step.parentId ?? 0, pos]);
setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم إضافة القسم المخصص."); return;
}
case "admin:addManualProduct:name": {
setStep(ctx.from.id, { kind: "admin:addManualProduct:price", name: txt, manualCategoryId: step.categoryId ?? 0 });
await ctx.reply("💵 أرسل السعر بالدولار:"); return;
}
case "admin:addManualProduct:price": {
const price = Number(txt.replace(/,/g, ""));
if (!Number.isFinite(price) || price < 0) { await ctx.reply("⚠️ سعر غير صالح."); return; }
const catId = Number(step.manualCategoryId ?? 0);
if (catId > 0) {
  await q("INSERT INTO manual_products(name,category_id,category_is_virtual,price_usd) VALUES($1,$2,true,$3)", [step.name, catId, String(price)]);
  invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم إضافة المنتج داخل القسم."); return;
}
setStep(ctx.from.id, { kind: "admin:addManualProduct:category", name: step.name, price });
const cats = (await q("SELECT id,name FROM manual_categories WHERE active=true ORDER BY id")).rows;
await ctx.reply(cats.length ? `📂 أرسل رقم القسم اليدوي، أو 0 للقائمة العامة:\n\n${cats.map(c => `${c.id}: ${c.name}`).join("\n")}` : "📂 أرسل 0 للقائمة العامة:"); return;
}
case "admin:addManualProduct:category": {
const categoryId = Number(txt);
if (!Number.isInteger(categoryId) || categoryId < 0) { await ctx.reply("⚠️ أرسل رقم قسم صحيح أو 0 للقائمة العامة."); return; }
if (categoryId > 0) {
  const cat = (await q("SELECT id FROM manual_categories WHERE id=$1 AND active=true", [categoryId])).rows[0];
  if (!cat) { await ctx.reply("⚠️ هذا القسم غير موجود."); return; }
}
await q("INSERT INTO manual_products(name,category_id,category_is_virtual,price_usd) VALUES($1,$2,$3,$4)", [step.name, categoryId, categoryId > 0, String(step.price)]);
invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("✅ تم إضافة المنتج اليدوي."); return;
}
case "admin:editManualProduct": {
const parts = txt.split("|").map(v => v.trim());
if (parts.length !== 6) { await ctx.reply("⚠️ الصيغة الصحيحة: name|price|markup|stock|description|instructions"); return; }
const [name, priceRaw, markupRaw, stockRaw, description, instructions] = parts;
const p = step.product || {};
const price = priceRaw.toLowerCase() === "skip" ? Number(p.price_usd) : Number(priceRaw);
const markup = markupRaw.toLowerCase() === "skip" ? p.markup_percent : (markupRaw === "" ? null : Number(markupRaw));
const stock = stockRaw.toLowerCase() === "skip" ? Number(p.stock_qty) : Number(stockRaw);
if (!Number.isFinite(price) || price < 0 || (markup != null && (!Number.isFinite(markup) || markup < 0)) || !Number.isInteger(stock)) { await ctx.reply("⚠️ توجد قيمة غير صالحة."); return; }
const finalName = name.toLowerCase() === "skip" ? p.name : name;
const finalDescription = description.toLowerCase() === "skip" ? p.description : description;
const finalInstructions = instructions.toLowerCase() === "skip" ? p.instructions : instructions;
await q("UPDATE manual_products SET name=$1,price_usd=$2,markup_percent=$3,stock_qty=$4,description=$5,instructions=$6,updated_at=NOW() WHERE id=$7", [finalName, price, markup, stock, finalDescription, finalInstructions, step.productId]);
setStep(ctx.from.id, { kind: "idle" }); invalidateCaches(); await ctx.reply("✅ تم تعديل المنتج اليدوي."); return;
}
case "admin:aiSupport": {
if (txt.toLowerCase() === "خروج") {
clearAiHistory(ctx.from.id);
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply("👋 تم إنهاء الجلسة.");
return;
}
const reply = await callAiSupport(ctx.from.id, txt);
await ctx.reply(reply, Markup.inlineKeyboard([[Markup.button.callback("⬅️ رجوع", "admin:menu")]]));
return;
}
case "admin:setUserMarkup": {
if (txt.toLowerCase() === "reset") {
await setUserMarkup(step.userId, null);
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply("✅ تمت إعادة نسبة الربح للافتراضي.");
return;
}
const n = Number(txt);
if (!Number.isFinite(n) || n < 0) { await ctx.reply("⚠️ نسبة غير صالحة."); return; }
await setUserMarkup(step.userId, n);
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply(`✅ نسبة الربح: ${n}%.`);
return;
}
default: {
const user = await ensureUser(ctx);
if (!user || user.status === "banned") return;
const reply = await callAiSupport(ctx.from.id, txt);
await ctx.reply(reply, Markup.inlineKeyboard([[Markup.button.callback("🏠 الرئيسية", "home")]]));
return;
}
}
});

bot.on("photo", async ctx => {
const step = getStep(ctx.from.id);
const photo = ctx.message?.photo?.at(-1);
if (!photo) return;
if (step.kind === "deposit:info") {
const next = { ...step, photoFileId: photo.file_id };
setStep(ctx.from.id, next);
if (next.amount != null) await completeDepositRequest(ctx, next);
else await ctx.reply("✅ تم حفظ الصورة. الآن أرسل المبلغ.");
return;
}
if (step.kind === "admin:setMethodImage") {
await q("UPDATE deposit_methods SET image_file_id=$1, updated_at=NOW() WHERE id=$2", [photo.file_id, step.methodId]);
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply("✅ تم حفظ صورة طريقة الإيداع.");
return;
}
if (step.kind === "admin:addMethod:photo") {
await q("INSERT INTO deposit_methods(name,identifier,instructions,image_file_id) VALUES($1,$2,$3,$4)", [step.name, step.identifier, step.instructions, photo.file_id]);
setStep(ctx.from.id, { kind: "idle" });
await ctx.reply("✅ تم إضافة طريقة الإيداع.");
return;
}
});

// ── Legacy admin text cases kept for compatibility ────────────────────
/*
* These cases used to be pasted outside the text handler. They are kept
* above in the handler so the source remains valid JavaScript.
*/

// ── Error handler ─────────────────────────────────────────────────────
bot.catch((err, ctx) => {
console.error("Bot error:", err);
try {
  if (ctx.callbackQuery) ctx.answerCbQuery("⚠️ تعذر تنفيذ العملية.").catch(() => {});
  // Never send a second user message after a handler already replied.
  else if (!ctx.state?._replySent) ctx.reply("⚠️ تعذر تنفيذ العملية. حاول مرة أخرى.").catch(() => {});
} catch { /* ignore */ }
});

// ── Launch ────────────────────────────────────────────────────────────
const mode = process.env.BOT_MODE || "polling";
if (mode === "webhook") {
const domain = process.env.WEBHOOK_DOMAIN?.replace(/\/+$/, "");
const port = Number(process.env.PORT) || 3000;
if (!domain) { console.error("WEBHOOK_DOMAIN required for webhook mode"); process.exit(1); }
await bot.launch({ webhook: { domain, port } });
console.log(`Webhook mode on ${domain}:${port}`);
} else {
await bot.launch();
console.log("Polling mode started");
}

_botRef = bot;
startBackgroundRefresher();
startOrderPoller(bot);
startPingScheduler(bot);

// Graceful shutdown
process.once("SIGINT", () => { bot.stop("SIGINT"); pool.end(); });
process.once("SIGTERM", () => { bot.stop("SIGTERM"); pool.end(); });

return bot;
}

// ============================================================
//  EXPRESS HEALTH CHECK
// ============================================================
const app = express();
app.get("/", (_req, res) => res.json({ status: "ok", bot: "running" }));
app.get("/health", (_req, res) => res.json({ status: "ok", time: new Date().toISOString() }));
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`Health check on port ${PORT}`));

// ============================================================
//  START
// ============================================================
startBot().catch(err => { console.error("Fatal:", err); process.exit(1); });
