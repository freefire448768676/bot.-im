// ============================================================
//  ظ…طھط¬ط± ط§ظ„ظ…ط±ظˆط§ظ† â€” ط¨ظˆطھ طھظٹظ„ظٹط¬ط±ط§ظ… v2.3 (ط¥طµظ„ط§ط­ ط´ط§ظ…ظ„)
//  ط¥طµظ„ط§ط­ط§طھ: ط§ظ„ط£ط¯ط§ط،طŒ طھط¯ظپظ‚ ط§ظ„ط¥ظٹط¯ط§ط¹طŒ ط¥ط²ط§ظ„ط© ط£ط±ظ‚ط§ظ… ط§ظ„ط·ظ„ط¨ط§طھ
// ============================================================
"use strict";

const { Telegraf, Markup } = require("telegraf");
const { Pool } = require("pg");
const axios = require("axios");
const express = require("express");
const http = require("http");
const https = require("https");
const crypto = require("crypto");

// â”€â”€ ENV check â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
if (!process.env.DATABASE_URL) {
  console.error("â‌Œ DATABASE_URL is required");
  process.exit(1);
}

// â”€â”€ DB pool ظ…ط­ط³ظ‘ظ† â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const _dbUrl = process.env.DATABASE_URL;
const _needSSL = _dbUrl.includes("railway") || _dbUrl.includes("neon") || _dbUrl.includes("supabase");
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

// â”€â”€ Create tables if not exist â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  await q(`ALTER TABLE category_overrides ADD COLUMN IF NOT EXISTS custom_parent_id INTEGER`).catch(() => {});
  await q(`ALTER TABLE deposit_methods ADD COLUMN IF NOT EXISTS image_file_id TEXT`).catch(() => {});
  await q(`ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_session_active BOOLEAN NOT NULL DEFAULT false`).catch(() => {});
}

// ============================================================
//  SETTINGS
// ============================================================
const settingsCache = new Map();
let _settingsCacheExpiry = 0;
const SETTINGS_TTL = 2 * 60_000; // 2 ط¯ظ‚ظٹظ‚ط©

const DEFAULTS = {
  markup_percent: "3",
  exchange_rate: "132",
  bot_status: "on",
  currency_label: "ظ„.ط³",
  excluded_category_ids: "6,81,561",
  excluded_product_keywords: "ط³ظٹط±طھظ„ ظƒط§ط´,ط³ظٹط±ظٹطھظ„ ظƒط§ط´,syriatel cash,mtn ظƒط§ط´,mtn cash,ط§ظ… طھظٹ ط§ظ† ظƒط§ط´",
  social_markup_percent: "3",
  social_min_qty: "500",
  social_max_qty: "10000",
  social_keywords: "ط³ظˆط´ظ„,social,طھظˆط§طµظ„ ط§ط¬طھظ…ط§ط¹ظٹ,ط§ط¬طھظ…ط§ط¹ظٹ,ط§ظ†ط³طھط؛ط±ط§ظ…,instagram,طھظٹظƒ طھظˆظƒ,tiktok,ظپظٹط³ط¨ظˆظƒ,facebook,طھظˆظٹطھط±,twitter,ظٹظˆطھظٹظˆط¨,youtube,طھظ„ظٹط¬ط±ط§ظ…,telegram,ط³ظ†ط§ط¨,snap",
  ai_keywords: "ط°ظƒط§ط، ط§طµط·ظ†ط§ط¹ظٹ,chatgpt,gpt,openai,claude,gemini,midjourney,perplexity,ai ",
  admin_password: "0941408061@0941408061aM",
  admin_login_command: "Abdulmalik Marai 1122334455",
  auto_ping_enabled: "off",
  auto_ping_interval_min: "5",
  auto_ping_target_user_id: "",
  auto_ping_last_sent: "0",
  btn_back_label: "â¬…ï¸ڈ ط±ط¬ظˆط¹",
  btn_home_label: "ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©",
  btn_prev_label: "â¬…ï¸ڈ ط§ظ„ط³ط§ط¨ظ‚",
  btn_next_label: "ط§ظ„طھط§ظ„ظٹ â‍،ï¸ڈ",
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
  if (!settingsCache.has(key) || Date.now() > _settingsCacheExpiry) {
    await loadAllSettings();
    _settingsCacheExpiry = Date.now() + SETTINGS_TTL;
  }
  return settingsCache.get(key) ?? DEFAULTS[key] ?? "";
}

async function setSetting(key, value) {
  settingsCache.set(key, value);
  _settingsCacheExpiry = Date.now() + SETTINGS_TTL; // طھظ…ط¯ظٹط¯ ط§ظ„ظƒط§ط´ ط¨ط¹ط¯ ط£ظٹ طھط­ط¯ظٹط«
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
const USER_CACHE_TTL = 60_000; // 60 ط«ط§ظ†ظٹط©
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
  return `${usd.toFixed(2)}$ | ${Math.round(usd * rate).toLocaleString("en-US")} ظ„.ط³`;
}

// â”€â”€ ط§ط³طھط®ط±ط§ط¬ ط§ظ„ظ…ط¨ظ„ط؛ ظ…ظ† ظ†طµ ط¨طµظٹط؛ ظ…ط®طھظ„ظپط© â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function extractAmountFromText(txt, exchangeRate) {
  if (!txt) return null;
  const clean = txt.replace(/,/g, "").trim();

  // ظ‡ظ„ ظ‡ظˆ ط¨ط§ظ„ظ„ظٹط±ط© ط§ظ„ط³ظˆط±ظٹط©طں
  const isSYP = /ظ„\.ط³|ظ„ظٹط±ط©|ظ„ظٹط±ظ‡|ظ„ظٹط±ط§طھ|ط³ظˆط±ظٹ|ط³ظˆط±ظٹط©|syp|ط±ظٹط§ظ„|ط±ظٹط§ظ„ط§طھ|ط±ظٹظˆط§ظ„/i.test(clean);
  // ظ‡ظ„ ظ‡ظˆ ط¨ط§ظ„ط¯ظˆظ„ط§ط±طں
  const isUSD = /\$|usd|ط¯ظˆظ„ط§ط±|ط¯ظˆظ„ط§ط±ط§طھ/i.test(clean);

  // ط§ط³طھط®ط±ط¬ ط£ظˆظ„ ط±ظ‚ظ… (طµط­ظٹط­ ط£ظˆ ط¹ط´ط±ظٹ)
  const numMatch = clean.match(/(\d+\.?\d*)/);
  if (!numMatch) return null;

  const num = parseFloat(numMatch[1]);
  if (!Number.isFinite(num) || num <= 0) return null;

  if (isSYP) {
    // ط­ظˆظ‘ظ„ ظ…ظ† ظ„ظٹط±ط© ط¥ظ„ظ‰ ط¯ظˆظ„ط§ط±
    const rate = Number(exchangeRate) || 132;
    return num / rate;
  }
  // ط§ظپطھط±ط§ط¶ظٹط§ظ‹ ط¯ظˆظ„ط§ط±
  return num;
}

// ============================================================
//  ORANOS API
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
  const rawD = resp?.data;
  const d = Array.isArray(rawD) ? rawD[0] : rawD;
  if (!d && !resp?.replay_api) return null;
  const candidates = [];
  if (d?.data) candidates.push(d.data);
  if (d?.replay_api) candidates.push(d.replay_api);
  if (resp?.replay_api) candidates.push(resp.replay_api);
  if (d?.response) candidates.push(d.response);
  if (d?.result) candidates.push(d.result);
  if (d?.note) candidates.push(d.note);
  if (d?.notes) candidates.push(d.notes);
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

// ظ„ط§ ظ†ط°ظƒط± ط§ط³ظ… ط§ظ„ظ…ظˆظ‚ط¹ ط£ظˆ ط£ظٹ ط±ط§ط¨ط· ط®ط§ط±ط¬ظٹ ظپظٹ ط§ظ„ط¨ط±ظˆظ…ط¨طھ
const AI_SYSTEM_PROMPT = `ط£ظ†طھ ظ…ط³ط§ط¹ط¯ ط°ظƒط§ط، ط§طµط·ظ†ط§ط¹ظٹ ظ…طھط®طµطµ ظپظٹ ط¥ط¯ط§ط±ط© ظ…طھط¬ط± "ظ…طھط¬ط± ط§ظ„ظ…ط±ظˆط§ظ†" ط¹ظ„ظ‰ طھظٹظ„ظٹط¬ط±ط§ظ….
ط§ظ„ط¨ظˆطھ ظٹط¨ظٹط¹ ظ…ظ†طھط¬ط§طھ ط±ظ‚ظ…ظٹط© ط¨ط´ظƒظ„ ط¢ظ„ظٹ.
ط£ط¬ط¨ ط¯ط§ط¦ظ…ط§ظ‹ ط¨ط§ظ„ط¹ط±ط¨ظٹط©. ظƒظ† ط¯ظ‚ظٹظ‚ط§ظ‹ ظˆط¹ظ…ظ„ظٹط§ظ‹. ظ„ط§ طھط°ظƒط± ط£ط³ظ…ط§ط، ظ…ظˆط§ظ‚ط¹ ط£ظˆ ط±ظˆط§ط¨ط· ط®ط§ط±ط¬ظٹط©.`;

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
  if (m.includes("ط±طµظٹط¯") || m.includes("balance")) return "ًں’° ظ„ظ…ط¹ط±ظپط© ط±طµظٹط¯ظƒ ط§ط³طھط®ط¯ظ… ط²ط± *ط±طµظٹط¯ظٹ* ظپظٹ ط§ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط±ط¦ظٹط³ظٹط©.";
  if (m.includes("ط¥ظٹط¯ط§ط¹") || m.includes("ط´ط­ظ†") || m.includes("deposit")) return "ًں’³ ظ„ط´ط­ظ† ط±طµظٹط¯ظƒ ط§ط¶ط؛ط· ط²ط± *ط¥ظٹط¯ط§ط¹* ظپظٹ ط§ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط±ط¦ظٹط³ظٹط©.";
  if (m.includes("ط·ظ„ط¨") || m.includes("order")) return "ًں“¦ ظ„ظ…طھط§ط¨ط¹ط© ط·ظ„ط¨ط§طھظƒ ط§ط¶ط؛ط· ط²ط± *ط·ظ„ط¨ط§طھظٹ* ظپظٹ ط§ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط±ط¦ظٹط³ظٹط©.";
  if (m.includes("ط³ط¹ط±") || m.includes("price")) return "ًں’± *طھط¹ط¯ظٹظ„ ط³ط¹ط± ط§ظ„طµط±ظپ:*\nط§ظ„ط¥ط¯ط§ط±ط© â†’ âڑ™ï¸ڈ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ â†’ ًں’± طھط¹ط¯ظٹظ„ ط³ط¹ط± ط§ظ„طµط±ظپ";
  if (m.includes("ط±ط¨ط­") || m.includes("markup")) return "ًں“ˆ *ظ†ط³ط¨ط© ط§ظ„ط±ط¨ط­:*\nط§ظ„ط¥ط¯ط§ط±ط© â†’ âڑ™ï¸ڈ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ â†’ âœڈï¸ڈ طھط¹ط¯ظٹظ„ ط§ظ„ط±ط¨ط­ ط§ظ„ط¹ط§ظ…";
  return "ًں“‍ ظ„ظ„ظ…ط³ط§ط¹ط¯ط© طھظˆط§طµظ„ ظ…ط¹ ط§ظ„ط¯ط¹ظ… ط¹ط¨ط± ط²ط± *ط§ظ„ط¯ط¹ظ…* ظپظٹ ط§ظ„ظ‚ط§ط¦ظ…ط©.";
}

// ============================================================
//  PRODUCT CACHE
// ============================================================
const PRODUCTS_TTL  = 15 * 60_000;   // ظƒط§ط´ 15 ط¯ظ‚ظٹظ‚ط©
const CONTENT_TTL   = 15 * 60_000;   // ظƒط§ط´ 15 ط¯ظ‚ظٹظ‚ط©
const OVERRIDES_TTL = 10 * 60_000;   // ظƒط§ط´ 10 ط¯ظ‚ط§ط¦ظ‚
const PAGE_SIZE = 8;

let productsCache = null;
const contentCache = new Map();
let allOverridesCache = null;

// in-flight deduplication: ظ„ط§ طھظڈط±ط³ظ„ ط·ظ„ط¨ط§طھ ظ…طھط¹ط¯ط¯ط© ظ„ظ†ظپط³ ط§ظ„ط¨ظٹط§ظ†ط§طھ ظپظٹ ظ†ظپط³ ط§ظ„ظˆظ‚طھ
let _productsInFlight    = null;
const _contentInFlight   = new Map();
let _overridesInFlight   = null;

async function getCachedProducts() {
  if (productsCache && productsCache.expiry > Date.now()) return productsCache.products;
  if (_productsInFlight) return _productsInFlight;
  _productsInFlight = fetchAllProducts()
    .then(products => {
      productsCache = { products, expiry: Date.now() + PRODUCTS_TTL };
      _productsInFlight = null;
      return products;
    })
    .catch(err => { _productsInFlight = null; throw err; });
  return _productsInFlight;
}

async function getCachedContent(parentId) {
  const cached = contentCache.get(parentId);
  if (cached && cached.expiry > Date.now()) return cached.content;
  const inFlight = _contentInFlight.get(parentId);
  if (inFlight) return inFlight;
  const p = fetchContent(parentId)
    .then(content => {
      contentCache.set(parentId, { content, expiry: Date.now() + CONTENT_TTL });
      _contentInFlight.delete(parentId);
      return content;
    })
    .catch(err => { _contentInFlight.delete(parentId); throw err; });
  _contentInFlight.set(parentId, p);
  return p;
}

async function getAllOverridesCached() {
  if (allOverridesCache && allOverridesCache.expiry > Date.now()) return allOverridesCache.map;
  if (_overridesInFlight) return _overridesInFlight;
  _overridesInFlight = loadAllOverrides()
    .then(map => {
      allOverridesCache = { map, expiry: Date.now() + OVERRIDES_TTL };
      _overridesInFlight = null;
      return map;
    })
    .catch(err => { _overridesInFlight = null; throw err; });
  return _overridesInFlight;
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
    // طھط­ط¯ظٹط« ط§ظ„ظ…ظ†طھط¬ط§طھ ظˆط§ظ„ط£ظ‚ط³ط§ظ… ظˆط§ظ„ظ€ overrides ظپظٹ ط§ظ„ط®ظ„ظپظٹط© ط¨ط´ظƒظ„ ظ…طھظˆط§ط²ظچ
    Promise.all([
      fetchAllProducts().then(p => { productsCache = { products: p, expiry: Date.now() + PRODUCTS_TTL }; }),
      loadAllOverrides().then(m => { allOverridesCache = { map: m, expiry: Date.now() + OVERRIDES_TTL }; }),
      fetchContent(0).then(c => { contentCache.set(0, { content: c, expiry: Date.now() + CONTENT_TTL }); }),
    ]).catch(() => {});
  }, 11 * 60_000).unref(); // ط£ظ‚ظ„ ظ…ظ† TTL (15 ط¯ظ‚) ظ„طھط¨ظ‚ظ‰ ط§ظ„ظƒط§ط´ ط¯ط§ظپط¦ط© ط¯ط§ط¦ظ…ط§ظ‹
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

// â”€â”€ ط¨ظ†ط§ط، ظ…ط¬ظ…ظˆط¹ط© IDs ط§ظ„ط£ظ‚ط³ط§ظ… ط§ظ„طھظٹ طھط­طھظˆظٹ ظ…ظ†طھط¬ط§طھ ط¸ط§ظ‡ط±ط© â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

const BOT_MAINTENANCE_MSG = "ًں”§ ط§ظ„ط¨ظˆطھ ظ‚ظٹط¯ ط§ظ„طµظٹط§ظ†ط© ط­ط§ظ„ظٹط§ظ‹.\nط³ظٹط¹ظˆط¯ ظ„ظ„ط¹ظ…ظ„ ط¨ط£ظ‚ط±ط¨ ظˆظ‚طھ ظ…ظ…ظƒظ†. ظ†ط´ظƒط± طµط¨ط±ظƒظ…! ًں™ڈ";
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME ?? "admin").split(",")[0].trim();

// ============================================================
//  STEP STATE (per user)
// ============================================================
const stepMap = new Map();
function getStep(uid) { return stepMap.get(uid) ?? { kind: "idle" }; }
function setStep(uid, s) { stepMap.set(uid, s); }

let _botRef = null;
const authedAdminIds = new Set();

// â”€â”€ ط­ط§ظ„ط© ط§ظ„طھظ†ظ‚ظ„: userId â†’ Map<catId, page> â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const navState = new Map();
function saveNavPage(uid, catId, page) {
  if (!navState.has(uid)) navState.set(uid, new Map());
  navState.get(uid).set(catId, page);
}
function getNavPage(uid, catId) { return navState.get(uid)?.get(catId) ?? 1; }

// â”€â”€ ط¥ط´ط¹ط§ط±ط§طھ ط§ظ„ط¥ظٹط¯ط§ط¹ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const depositNotifications = new Map();
async function clearDepositForOtherAdmins(processorId, depId, statusText) {
  const list = depositNotifications.get(depId) ?? [];
  depositNotifications.delete(depId);
  for (const n of list) {
    if (n.adminId === processorId) continue;
    try {
      await _botRef?.telegram.editMessageCaption(n.adminId, n.messageId, undefined,
        `${statusText}\n(طھظ…طھ ط§ظ„ظ…ط¹ط§ظ„ط¬ط© ط¨ظˆط§ط³ط·ط© ظ…ط¯ظٹط± ط¢ط®ط±)`);
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

// â”€â”€ ظ„ظˆط­ط© ط§ظ„ط¥ط¯ط§ط±ط© ظ…ط®ظپظٹط© - ظ„ط§ طھط¸ظ‡ط± ظپظٹ ط§ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط±ط¦ظٹط³ظٹط© â”€â”€â”€â”€â”€
function mainMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("ًں›’ ط§ظ„ظ…ظ†طھط¬ط§طھ", "cat:0:1:0"), Markup.button.callback("ًں’° ط±طµظٹط¯ظٹ", "balance")],
    [Markup.button.callback("ًں’³ ط¥ظٹط¯ط§ط¹", "deposit"), Markup.button.callback("ًں“¦ ط·ظ„ط¨ط§طھظٹ", "myorders:1")],
    [Markup.button.callback("ًں“‍ ط§ظ„ط¯ط¹ظ…", "support"), Markup.button.callback("ًں”„ طھط­ط¯ظٹط«", "home")],
  ]);
}

function mainMenuAdmin() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("ًں›’ ط§ظ„ظ…ظ†طھط¬ط§طھ", "cat:0:1:0"), Markup.button.callback("ًں’° ط±طµظٹط¯ظٹ", "balance")],
    [Markup.button.callback("ًں’³ ط¥ظٹط¯ط§ط¹", "deposit"), Markup.button.callback("ًں“¦ ط·ظ„ط¨ط§طھظٹ", "myorders:1")],
    [Markup.button.callback("ًں“‍ ط§ظ„ط¯ط¹ظ…", "support"), Markup.button.callback("ًں”„ طھط­ط¯ظٹط«", "home")],
    [Markup.button.callback("ًں‘‘ ط§ظ„ط¯ط®ظˆظ„ ظ„ظ„ظˆط­ط© ط§ظ„ط¥ط¯ط§ط±ط©", "admin:menu")],
  ]);
}

async function showMainMenu(ctx) {
  const user = await ensureUser(ctx);
  if (!user) return;
  setStep(user.id, { kind: "idle" });
  if (user.status === "banned") { await sendOrEdit(ctx, "ًںڑ« طھظ… ط­ط¸ط±ظƒ ظ…ظ† ط§ط³طھط®ط¯ط§ظ… ط§ظ„ط¨ظˆطھ."); return; }
  const [status, rate, adminSessionActive] = await Promise.all([
    getBotStatus(),
    getExchangeRate(),
    isAdminSessionActive(user.id),
  ]);
  if (status === "off" && !authedAdminIds.has(user.id) && !adminSessionActive) {
    await sendOrEdit(ctx, "ًں”§ ط§ظ„ط¨ظˆطھ ظ‚ظٹط¯ ط§ظ„طµظٹط§ظ†ط©. ط³ظٹط¹ظˆط¯ ظ„ظ„ط¹ظ…ظ„ ط¨ط£ظ‚ط±ط¨ ظˆظ‚طھ ظ…ظ…ظƒظ†. ظ†ط´ظƒط± طµط¨ط±ظƒظ…! ًں™ڈ");
    return;
  }
  const greeting = `ط£ظ‡ظ„ط§ظ‹ ظپظٹظƒ ظپظٹ ظ…طھط¬ط± ط§ظ„ظ…ط±ظˆط§ظ† ًںŒں\nط§ظ„ط§ط³ظ…: ${user.first_name ?? "â€”"}${user.username ? ` (@${user.username})` : ""}\nط§ظ„ط±ظ‚ظ…: ${user.id}\nط§ظ„ط±طµظٹط¯: ${formatBalance(Number(user.balance), rate)}\n\nط§ط®طھط± ظ…ظ† ط§ظ„ظ‚ط§ط¦ظ…ط© ًں‘‡`;
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
    await ctx.reply(`ًں“‍ ظ„ظ„ط¯ط¹ظ…: @${ADMIN_USERNAME}`, Markup.inlineKeyboard([[Markup.button.callback("ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]]));
    return;
  }
  const rows = links.map(l => [Markup.button.url(l.name, l.link.startsWith("http") ? l.link : `https://t.me/${l.link.replace(/^@/, "")}`)]);
  rows.push([Markup.button.callback("ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]);
  await ctx.reply("ًں“‍ ظˆط³ط§ط¦ظ„ ط§ظ„طھظˆط§طµظ„:", Markup.inlineKeyboard(rows));
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
    ('ط´ط§ظ… ظƒط§ط´','02d7079d7229d8860c7d89467bfdc938','ط­ظˆظ„ ط§ظ„ظ…ط¨ظ„ط؛ ط¥ظ„ظ‰ ط±ظ‚ظ… ط´ط§ظ… ظƒط§ط´ ط£ط¹ظ„ط§ظ‡ ط«ظ… ط£ط±ط³ظ„ طµظˆط±ط© ط§ظ„ط¥ط´ط¹ط§ط±'),
    ('ط³ظٹط±ظٹطھظ„ ظƒط§ط´','32820534','ط­ظˆظ„ ط§ظ„ظ…ط¨ظ„ط؛ ط¥ظ„ظ‰ ط±ظ‚ظ… ط³ظٹط±ظٹطھظ„ ظƒط§ط´ ط£ط¹ظ„ط§ظ‡ ط«ظ… ط£ط±ط³ظ„ طµظˆط±ط© ط§ظ„ط¥ط´ط¹ط§ط±')`);
  _depositMethodsEnsured = true;
}

async function showDepositMenu(ctx) {
  if (!_depositMethodsEnsured) await ensureDefaultDepositMethods();
  const res = await q("SELECT * FROM deposit_methods WHERE active=true ORDER BY id");
  const methods = res.rows;
  if (!methods.length) {
    await sendOrEdit(ctx, "â‌Œ ظ„ط§ طھظˆط¬ط¯ ط·ط±ظ‚ ط¥ظٹط¯ط§ط¹ ظ…طھط§ط­ط© ط­ط§ظ„ظٹط§ظ‹.", Markup.inlineKeyboard([[Markup.button.callback("ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]]));
    return;
  }
  const rows = methods.map(m => [Markup.button.callback(`ًں’³ ${m.name}`, `dep:method:${m.id}`)]);
  rows.push([Markup.button.callback("ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]);
  await sendOrEdit(ctx, "ًں’³ ط§ط®طھط± ط·ط±ظٹظ‚ط© ط§ظ„ط¥ظٹط¯ط§ط¹:", Markup.inlineKeyboard(rows));
}

async function showDepositMethod(ctx, methodId) {
  const res = await q("SELECT * FROM deposit_methods WHERE id=$1 AND active=true", [methodId]);
  const m = res.rows[0];
  if (!m) { await ctx.reply("âڑ ï¸ڈ ط§ظ„ط·ط±ظٹظ‚ط© ط؛ظٹط± ظ…طھط§ط­ط©."); return; }
  // â”€â”€ طھط¯ظپظ‚ ط§ظ„ط¥ظٹط¯ط§ط¹: ظ†ط·ظ„ط¨ ط§ظ„ظ…ط¨ظ„ط؛ ط£ظˆظ„ط§ظ‹طŒ ط«ظ… ط§ظ„طµظˆط±ط© â”€â”€
  setStep(ctx.from.id, { kind: "deposit:info", methodId: m.id, methodName: m.name, amount: null, photoFileId: null });
  const kb = Markup.inlineKeyboard([[Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "deposit"), Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "dep:cancel")]]);
  const infoText = `ًں’³ ${m.name}\nًں”‘ ط§ظ„ط±ظ‚ظ…: \`${m.identifier}\`\n\nًں“‹ ط§ظ„طھط¹ظ„ظٹظ…ط§طھ:\n${m.instructions}\n\nًں“‌ ط£ط±ط³ظ„ ط§ظ„ظ…ط¨ظ„ط؛ ظˆطµظˆط±ط© ط¥ط´ط¹ط§ط± ط§ظ„طھط­ظˆظٹظ„\n(ظٹظ…ظƒظ†ظƒ ط¥ط±ط³ط§ظ„ظ‡ظ…ط§ ط¨ط£ظٹ طھط±طھظٹط¨)`;
  if (m.image_file_id) {
    await ctx.replyWithPhoto(m.image_file_id, { caption: infoText, parse_mode: "Markdown", ...kb });
  } else {
    await ctx.reply(infoText, { parse_mode: "Markdown", ...kb });
  }
}

// â”€â”€ ط¥ظƒظ…ط§ظ„ ط·ظ„ط¨ ط§ظ„ط¥ظٹط¯ط§ط¹ ط¨ط¹ط¯ ط§ط³طھظ„ط§ظ… ط§ظ„ظ…ط¨ظ„ط؛ ظˆط§ظ„طµظˆط±ط© â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function completeDepositRequest(ctx, step) {
  const res = await q(
    "INSERT INTO deposit_requests(user_id,method_id,method_name,amount,screenshot_file_id) VALUES($1,$2,$3,$4,$5) RETURNING *",
    [ctx.from.id, step.methodId, step.methodName, step.amount != null ? String(step.amount) : null, step.photoFileId]
  );
  const dep = res.rows[0];
  setStep(ctx.from.id, { kind: "idle" });
  await ctx.reply("ط³ظٹطھظ… ظ…ط±ط§ط¬ط¹ط© ط·ظ„ط¨ظƒ ظپظٹ ط£ظ‚ط±ط¨ ظˆظ‚طھ ظ…ظ…ظƒظ†.", Markup.inlineKeyboard([[Markup.button.callback("ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]]));
  await notifyAdminsDeposit(ctx, dep);
}

async function notifyAdminsDeposit(ctx, depositRow) {
  const user = await getUser(ctx.from.id);
  const amountStr = depositRow.amount ? `${Number(depositRow.amount).toFixed(2)}$` : "â€”";
  const text = `ًں“¥ ط·ظ„ط¨ ط¥ظٹط¯ط§ط¹ ط¬ط¯ظٹط¯\nًں‘¤ ${user?.first_name ?? "â€”"}${user?.username ? " @" + user.username : ""} (${ctx.from.id})\nًں’³ ${depositRow.method_name}\nًں’µ ط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ظ…ظڈط­ظˆظژظ‘ظ„: ${amountStr}`;
  const kb = Markup.inlineKeyboard([[Markup.button.callback("âœ… ظ…ظˆط§ظپظ‚ط©", `adm:dep:approve:${depositRow.id}`), Markup.button.callback("â‌Œ ط±ظپط¶", `adm:dep:reject:${depositRow.id}`)]]);
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
  const [u, _catSessActive] = await Promise.all([getUser(ctx.from.id), isAdminSessionActive(ctx.from.id)]);
  const isAdmin = !!u?.is_admin && (authedAdminIds.has(ctx.from.id) || _catSessActive);
  const userMarkupPercent = u?.custom_markup_percent != null ? Number(u.custom_markup_percent) : null;

  // â”€â”€ طھط´ط؛ظٹظ„ ط¬ظ…ظٹط¹ ط§ظ„ط§ط³طھط¹ظ„ط§ظ…ط§طھ ط§ظ„ظ…ط³طھظ‚ظ„ط© ط¨ط§ظ„طھظˆط§ط²ظٹ â”€â”€
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

  // â”€â”€ ط¥طµظ„ط§ط­ ط§ظ„ط£ط¯ط§ط،: ط§ط³طھط®ط±ط¬ ظ…ط¬ظ…ظˆط¹ط© ط§ظ„ط£ظ‚ط³ط§ظ… ط§ظ„ط¸ط§ظ‡ط±ط© ظ…ط±ط© ظˆط§ط­ط¯ط© ط®ط§ط±ط¬ ط§ظ„ط­ظ„ظ‚ط© â”€â”€
  const visibleDirectSet = await buildVisibleCategoryIds(excludedCats, kws);

  const visibleCats = [];
  for (const c of content.categories) {
    if (excludedCats.has(c.id)) continue;
    const ov = catOv.get(c.id);
    if (ov?.hidden && !isAdmin) continue;
    if (ov?.customParentId != null && ov.customParentId !== parentId) continue;
    const visible = await isCategoryVisible(c.id, visibleDirectSet);
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

  const [vcRes, mpRes, rate, backLabel, homeLabel, prevLabel, nextLabel] = await Promise.all([
    q("SELECT * FROM virtual_categories WHERE parent_id=$1 ORDER BY position", [parentId]),
    q("SELECT * FROM manual_products WHERE category_id=$1 AND category_is_virtual=false AND active=true ORDER BY id", [parentId]),
    getExchangeRate(),
    getBtnBackLabel(), getBtnHomeLabel(), getBtnPrevLabel(), getBtnNextLabel(),
  ]);

  const vcRows = isAdmin ? vcRes.rows : vcRes.rows.filter(v => v.active);
  const vcBtns = vcRows.map(v => Markup.button.callback(`${v.active ? "ًں“‚ " : "ًں”’ "}${v.name}`.slice(0, 60), `vcat:${v.id}:1:${parentId}`));

  const manualBtns = mpRes.rows.map(m => {
    const usd = Number(m.price_usd); const syp = Math.round(usd * rate);
    return Markup.button.callback(`ًں›’ ${m.name} â€¢ ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ظ„.ط³`.slice(0, 60), `mprod:${m.id}:${parentId}`);
  });

  if (!visibleCats.length && !visibleProds.length && !vcBtns.length && !manualBtns.length) {
    const emptyRows = [];
    if (isAdmin) {
      emptyRows.push([Markup.button.callback("âœڈï¸ڈ طھط¹ط¯ظٹظ„ ط§ط³ظ… ط§ظ„ظ‚ط³ظ…", `adm:catEdit:${parentId}`)]);
      emptyRows.push([Markup.button.callback("ًں™ˆ ط¥ط®ظپط§ط، ط§ظ„ظ‚ط³ظ…", `adm:catToggle:${parentId}`)]);
    }
    if (parentId === 0) {
      if (isAdmin) emptyRows.push([Markup.button.callback(backLabel, "admin:menu"), Markup.button.callback(homeLabel, "home")]);
      else emptyRows.push([Markup.button.callback(homeLabel, "home")]);
    } else {
      const bp = getNavPage(ctx.from.id, backTo);
      const backAction = backTo === 0 ? "cat:0:1:0" : `cat:${backTo}:${bp}:0`;
      emptyRows.push([Markup.button.callback(backLabel, backAction), Markup.button.callback(homeLabel, "home")]);
    }
    await sendOrEdit(ctx, "ًں“­ ظ‡ط°ط§ ط§ظ„ظ‚ط³ظ… ظپط§ط±ط؛ ط­ط§ظ„ظٹط§ظ‹.", Markup.inlineKeyboard(emptyRows)); return;
  }

  visibleCats.sort((a, b) => (catOv.get(a.id)?.sortOrder ?? 9999) - (catOv.get(b.id)?.sortOrder ?? 9999));
  const catBtns = [
    ...vcBtns,
    ...visibleCats.map(c => {
      const ov = catOv.get(c.id);
      const label = ov?.customName ?? c.name;
      return Markup.button.callback(`${ov?.hidden ? "ًں”’ " : "ًں“‚ "}${label}`.slice(0, 60), `cat:${c.id}:1:${parentId}`);
    }),
  ];

  // â”€â”€ طھط·ط¨ظٹظ‚ markup ط§ظ„ظ…ط³طھط®ط¯ظ… ط§ظ„ط®ط§طµ ظپظٹ ط£ط³ط¹ط§ط± ظ‚ط§ط¦ظ…ط© ط§ظ„ظ…ظ†طھط¬ط§طھ â”€â”€
  const prodBtns = await Promise.all(visibleProds.map(async p => {
    const ov = ovMap.get(p.id);
    const usd = await effectivePriceUsd(p, ov, markup, socialMarkup, socialKws, null, userMarkupPercent);
    const syp = Math.round(usd * rate);
    const name = ov?.customName ?? p.name;
    return Markup.button.callback(`${ov?.hidden ? "ًں”’ " : "ًں›’ "}${name} â€¢ ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ظ„.ط³`.slice(0, 60), `prod:${p.id}:${parentId}`);
  }));

  const all = [...catBtns, ...prodBtns, ...manualBtns];
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const safe = Math.min(Math.max(1, page), totalPages);
  saveNavPage(ctx.from.id, parentId, safe);
  const slice = all.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE);

  const rows = [];
  if (isAdmin && parentId !== 0) {
    const curOv = (await q("SELECT * FROM category_overrides WHERE category_id=$1", [parentId])).rows[0];
    rows.push([Markup.button.callback("âœڈï¸ڈ طھط¹ط¯ظٹظ„ ط§ط³ظ… ط§ظ„ظ‚ط³ظ…", `adm:catEdit:${parentId}`), Markup.button.callback(curOv?.hidden ? "ًں‘پ ط¥ط¸ظ‡ط§ط±" : "ًں™ˆ ط¥ط®ظپط§ط،", `adm:catToggle:${parentId}`)]);
    rows.push([Markup.button.callback("% ظ†ط³ط¨ط© ط±ط¨ط­ ط§ظ„ظ‚ط³ظ…", `adm:catMarkup:${parentId}`), Markup.button.callback("ًں”¢ طھط±طھظٹط¨ ط§ظ„ظ‚ط³ظ…", `adm:catSort:${parentId}`)]);
    rows.push([Markup.button.callback("ًںڑڑ ظ†ظ‚ظ„ ظƒظ„ ظ…ظ†طھط¬ط§طھ ط§ظ„ظ‚ط³ظ…", `adm:moveCatAll:${parentId}`), Markup.button.callback("ًں“پ ظ†ظ‚ظ„ ط§ظ„ظ‚ط³ظ… ط¥ظ„ظ‰ ظ‚ط³ظ…", `adm:moveCatToParent:${parentId}`)]);
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

  const title = parentId === 0 ? "ًں›’ ط§ظ„ط£ظ‚ط³ط§ظ… ط§ظ„ط±ط¦ظٹط³ظٹط©" : `ًں“‚ ${catOv.get(parentId)?.customName ?? "ظ…ط­طھظˆظٹط§طھ ط§ظ„ظ‚ط³ظ…"}`;
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

  if (!p) { await sendOrEdit(ctx, "âڑ ï¸ڈ ط§ظ„ظ…ظ†طھط¬ ط؛ظٹط± ظ…ظˆط¬ظˆط¯.", Markup.inlineKeyboard([[await resolveBackBtn(backTo)]])); return; }

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
  const userMarkupPercent = u?.custom_markup_percent != null ? Number(u.custom_markup_percent) : null;

  if (isExcludedProduct(p, kws) && !isAdmin) { await sendOrEdit(ctx, "âڑ ï¸ڈ ظ‡ط°ط§ ط§ظ„ظ…ظ†طھط¬ ط؛ظٹط± ظ…طھط§ط­.", Markup.inlineKeyboard([[await resolveBackBtn(backTo)]])); return; }
  const ov = ovMap.get(p.id);
  const isSocial = isSocialProduct(p.name, p.category_name, socialKws);
  const usd = await effectivePriceUsd(p, ov, markup, socialMarkup, socialKws, null, userMarkupPercent);
  const syp = Math.round(usd * rate);

  let qtyInfo = "";
  if (isSocial) {
    const parsed = p.qty_values;
    if (parsed && !Array.isArray(parsed) && Number(parsed.min) > 0 && Number(parsed.max) > 0)
      qtyInfo = `ط§ظ„ظƒظ…ظٹط© ط¨ظٹظ† ${Number(parsed.min).toLocaleString("en-US")} ظˆ ${Number(parsed.max).toLocaleString("en-US")}`;
    else if (parsed && Array.isArray(parsed) && parsed.length > 0)
      qtyInfo = `ط§ظ„ظƒظ…ظٹط§طھ ط§ظ„ظ…طھط§ط­ط©: ${parsed.join(", ")}`;
    else { const [min, max] = await Promise.all([getSocialMinQty(), getSocialMaxQty()]); qtyInfo = `ط§ظ„ظƒظ…ظٹط© ط¨ظٹظ† ${min.toLocaleString("en-US")} ظˆ ${max.toLocaleString("en-US")}`; }
  } else if (!p.qty_values) { qtyInfo = "ط§ظ„ظƒظ…ظٹط©: 1 (ط«ط§ط¨طھط©)"; }
  else if (Array.isArray(p.qty_values)) { qtyInfo = `ط§ظ„ظƒظ…ظٹط§طھ ط§ظ„ظ…طھط§ط­ط©: ${p.qty_values.join(", ")}`; }
  else { qtyInfo = `ط§ظ„ظƒظ…ظٹط© ط¨ظٹظ† ${p.qty_values.min} ظˆ ${p.qty_values.max}`; }

  const displayName = ov?.customName ?? p.name;
  const instructions = ov?.instructions?.trim() || getProductApiNotes(p);
  const text = `ًں›’ ${displayName}\n${p.category_name ? `ط§ظ„ظ‚ط³ظ…: ${p.category_name}\n` : ""}ط§ظ„ط³ط¹ط±: ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ظ„.ط³\n${qtyInfo}${instructions ? `\n\nًں“‹ طھط¹ظ„ظٹظ…ط§طھ:\n${instructions}` : ""}`;

  const backBtnResolved = await resolveBackBtn(backTo);
  const btns = [];
  if (p.available || isAdmin) btns.push([Markup.button.callback("ًں›’ ط·ظ„ط¨ ط§ظ„ط¢ظ†", `buy:${p.id}:${backTo}`)]);
  if (isAdmin) {
    btns.push([Markup.button.callback("âœڈï¸ڈ طھط¹ط¯ظٹظ„ ط§ظ„ط³ط¹ط±", `adm:editPrice:${p.id}`), Markup.button.callback("ًں“‹ طھط¹ظ„ظٹظ…ط§طھ", `adm:editInstr:${p.id}`)]);
    btns.push([Markup.button.callback("ًں“‌ طھط¹ط¯ظٹظ„ ط§ظ„ط§ط³ظ…", `adm:renameProd:${p.id}`), Markup.button.callback("ًںڑڑ ظ†ظ‚ظ„ ظ„ظ‚ط³ظ… ط¢ط®ط±", `adm:moveProd:${p.id}`)]);
    btns.push([Markup.button.callback(ov?.hidden ? "ًں‘پ ط¥ط¸ظ‡ط§ط±" : "ًں™ˆ ط¥ط®ظپط§ط،", `adm:hideProd:${p.id}`)]);
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
  if (!vc || (!vc.active && !isAdmin)) { await sendOrEdit(ctx, "âڑ ï¸ڈ ظ‡ط°ط§ ط§ظ„ظ‚ط³ظ… ط؛ظٹط± ظ…طھط§ط­.", Markup.inlineKeyboard([[Markup.button.callback("ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]])); return; }
  let backBtn;
  if (backTo === 0) {
    backBtn = Markup.button.callback(backLabel, "cat:0:1:0");
  } else {
    const parentVcat = (await q("SELECT id FROM virtual_categories WHERE id=$1", [backTo])).rows[0];
    backBtn = parentVcat ? Markup.button.callback(backLabel, `vcat:${backTo}:1:0`) : Markup.button.callback(backLabel, `cat:${backTo}:1:0`);
  }

  const subVcRes = await q("SELECT * FROM virtual_categories WHERE parent_id=$1 ORDER BY position", [vcId]);
  const subVcs = isAdmin ? subVcRes.rows : subVcRes.rows.filter(v => v.active);
  const subVcBtns = subVcs.map(v => Markup.button.callback(`${v.active ? "ًں“‚ " : "ًں”’ "}${v.name}`.slice(0, 60), `vcat:${v.id}:1:${vcId}`));

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
    return Markup.button.callback(`ًں›’ ${m.name} â€¢ ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ظ„.ط³`.slice(0, 60), `mprod:${m.id}:${vcId}`);
  });

  if (!visible.length && !subVcBtns.length && !manualBtnsVc.length && !isAdmin) { await sendOrEdit(ctx, "ًں“­ ظ‡ط°ط§ ط§ظ„ظ‚ط³ظ… ظپط§ط±ط؛ ط­ط§ظ„ظٹط§ظ‹.", Markup.inlineKeyboard([[backBtn, Markup.button.callback(homeLabel, "home")]])); return; }

  const ovMap = await loadOverrideMap(visible.map(p => p.id));
  // â”€â”€ طھط·ط¨ظٹظ‚ markup ط§ظ„ظ…ط³طھط®ط¯ظ… ط§ظ„ط®ط§طµ â”€â”€
  const prodBtns = await Promise.all(visible.map(async p => {
    const ov = ovMap.get(p.id);
    const usd = await effectivePriceUsd(p, ov, markup, socialMarkup, socialKws, null, userMarkupPercent);
    const syp = Math.round(usd * rate);
    return Markup.button.callback(`${ov?.hidden ? "ًں”’ " : "ًں›’ "}${ov?.customName ?? p.name} â€¢ ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ظ„.ط³`.slice(0, 60), `prod:${p.id}:${vcId}`);
  }));

  const allBtns = [...subVcBtns, ...prodBtns, ...manualBtnsVc];
  const totalPages = Math.max(1, Math.ceil(allBtns.length / PAGE_SIZE));
  const safe = Math.min(Math.max(1, page), totalPages);
  saveNavPage(ctx.from.id, vcId, safe);
  const slice = allBtns.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE);

  const rows = [];
  if (isAdmin) {
    rows.push([Markup.button.callback("âœڈï¸ڈ طھط¹ط¯ظٹظ„ ط§ظ„ط§ط³ظ…", `adm:vcEdit:${vcId}`), Markup.button.callback(vc.active ? "ًں™ˆ ط¥ط®ظپط§ط،" : "ًں‘پ ط¥ط¸ظ‡ط§ط±", `adm:vcToggle:${vcId}`)]);
    rows.push([Markup.button.callback("â‍• ظ‚ط³ظ… ظپط±ط¹ظٹ", `adm:addVCatSub:${vcId}`), Markup.button.callback("ًں—‘ï¸ڈ ط­ط°ظپ ط§ظ„ظ‚ط³ظ…", `adm:vcDel:${vcId}`)]);
  }
  for (const b of slice) rows.push([b]);
  const nav = [];
  if (safe > 1) nav.push(Markup.button.callback(prevLabel, `vcat:${vcId}:${safe - 1}:${backTo}`));
  nav.push(Markup.button.callback(`${safe}/${totalPages}`, "noop"));
  if (safe < totalPages) nav.push(Markup.button.callback(nextLabel, `vcat:${vcId}:${safe + 1}:${backTo}`));
  if (nav.length > 1) rows.push(nav);
  rows.push([backBtn, Markup.button.callback(homeLabel, "home")]);
  await sendOrEdit(ctx, `ًں“‚ ${vc.name}`, Markup.inlineKeyboard(rows));
}

async function showManualProduct(ctx, mId, backTo) {
  const [backLabel, homeLabel] = await Promise.all([getBtnBackLabel(), getBtnHomeLabel()]);
  let backBtn;
  if (backTo === 0) {
    backBtn = Markup.button.callback(backLabel, "cat:0:1:0");
  } else {
    const parentIsVcat = (await q("SELECT id FROM virtual_categories WHERE id=$1", [backTo])).rows[0];
    backBtn = parentIsVcat ? Markup.button.callback(backLabel, `vcat:${backTo}:1:0`) : Markup.button.callback(backLabel, `cat:${backTo}:1:0`);
  }
  const mRes = await q("SELECT * FROM manual_products WHERE id=$1", [mId]);
  const m = mRes.rows[0];
  const u = await getUser(ctx.from.id);
  const isAdmin = !!u?.is_admin;
  if (!m || (!m.active && !isAdmin)) { await sendOrEdit(ctx, "âڑ ï¸ڈ ط§ظ„ظ…ظ†طھط¬ ط؛ظٹط± ظ…طھط§ط­.", Markup.inlineKeyboard([[backBtn, Markup.button.callback(homeLabel, "home")]])); return; }
  const rate = await getExchangeRate();
  const usd = Number(m.price_usd); const syp = Math.round(usd * rate);
  const balance = u ? Number(u.balance) : 0;
  const canAfford = balance >= usd;
  const text = `ًں›’ ${m.name}\nط§ظ„ط³ط¹ط±: ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ظ„.ط³\nط§ظ„ط±طµظٹط¯: ${formatBalance(balance, rate)}${m.instructions ? `\n\nًں“‹ ${m.instructions}` : ""}`;
  const rows = [];
  if (m.active && canAfford) rows.push([Markup.button.callback("ًں›’ ط·ظ„ط¨ ط§ظ„ط¢ظ†", `mbuy:${m.id}`)]);
  else if (m.active && !canAfford) rows.push([Markup.button.callback("ًں’³ ط´ط­ظ† ط±طµظٹط¯", "deposit")]);
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
      if (!ACCEPT_STATUSES.has(raw.toLowerCase())) parts.push(`ًں“ٹ ط§ظ„ط­ط§ظ„ط©: ${label}`);
    }
  }
  return [...new Set(parts)].filter(Boolean).join("\n\n").trim();
}

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
  if (ACCEPT_STATUSES.has(n) || n === "1" || n === "true") return "âœ… ظ…ظ‚ط¨ظˆظ„";
  if (REJECT_STATUSES.has(n) || n === "0" || n === "false") return "â‌Œ ظ…ط±ظپظˆط¶";
  return "âڈ³ ط§ظ†طھط¸ط§ط±";
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
  return `${Number(qty).toLocaleString("en-US")} â€” ${totalStr}$`;
}

async function startOrderFlow(ctx, productId, backTo) {
  let all = await getCachedProducts();
  let p = all.find(x => x.id === productId);
  if (!p) { all = await fetchAllProducts(); p = all.find(x => x.id === productId); }
  if (!p) { await ctx.reply("âڑ ï¸ڈ ط§ظ„ظ…ظ†طھط¬ ط؛ظٹط± ظ…ظˆط¬ظˆط¯."); return; }
  if (!p.available) { await ctx.reply("âڑ ï¸ڈ ظ‡ط°ط§ ط§ظ„ظ…ظ†طھط¬ ط؛ظٹط± ظ…طھط§ط­ ط­ط§ظ„ظٹط§ظ‹."); return; }

  // â”€â”€ طھظ†ظپظٹط° ظ…ظˆط§ط²ظچ ظ„طھط³ط±ظٹط¹ ط§ظ„ط§ط³طھط¬ط§ط¨ط© â”€â”€
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
      rows.push([Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "ord:cancel")]);
      await sendOrEdit(ctx, `ًں›’ ${p.name}\n\nط§ط®طھط± ط§ظ„ظƒظ…ظٹط©:`, Markup.inlineKeyboard(rows)); return;
    }
    let min, max;
    if (parsedSocial.kind === "range" && Number.isFinite(parsedSocial.min) && parsedSocial.min > 0)
      { min = parsedSocial.min; max = parsedSocial.max; }
    else { min = await getSocialMinQty(); max = await getSocialMaxQty(); }
    setStep(ctx.from.id, { kind: "order:qty", productId: p.id, productName: p.name, priceUsd: unitPriceUsd, paramKeys, qtyValues: { min, max }, backTo });
    await sendOrEdit(ctx, `ًں›’ ${p.name}\n\nط£ط±ط³ظ„ ط§ظ„ظƒظ…ظٹط© (ط¨ظٹظ† ${min.toLocaleString("en-US")} ظˆ ${max.toLocaleString("en-US")}):`, Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "ord:cancel")]])); return;
  }

  const parsed = parseQtyValues(p.qty_values);
  if (parsed.kind === "fixed") { await askNextParam(ctx, p, unitPriceUsd, 1, paramKeys, {}, 0, backTo); return; }
  if (parsed.kind === "list") {
    setStep(ctx.from.id, { kind: "order:qty", productId: p.id, productName: p.name, priceUsd: unitPriceUsd, paramKeys, qtyValues: parsed.values, backTo });
    const rows = parsed.values.slice(0, 24).map(v => {
      const label = formatPriceLabel(v, unitPriceUsd);
      return [Markup.button.callback(label, `ord:qty:${v}`)];
    });
    rows.push([Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "ord:cancel")]);
    await sendOrEdit(ctx, `ًں›’ ${p.name}\nط§ط®طھط± ط§ظ„ظƒظ…ظٹط©:`, Markup.inlineKeyboard(rows)); return;
  }
  setStep(ctx.from.id, { kind: "order:qty", productId: p.id, productName: p.name, priceUsd: unitPriceUsd, paramKeys, qtyValues: { min: parsed.min, max: parsed.max }, backTo });
  await sendOrEdit(ctx, `ًں›’ ${p.name}\nط£ط±ط³ظ„ ط§ظ„ظƒظ…ظٹط© (ط¨ظٹظ† ${parsed.min} ظˆ ${parsed.max}):`, Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "ord:cancel")]]));
}

async function askNextParam(ctx, p, unitPriceUsd, qty, paramKeys, collected, idx, backTo) {
  if (idx >= paramKeys.length) { await showOrderConfirmation(ctx, p, unitPriceUsd, qty, collected, backTo); return; }
  setStep(ctx.from.id, { kind: "order:params", productId: p.id, productName: p.name, priceUsd: unitPriceUsd, qty, paramKeys, collected, idx, backTo });
  const key = paramKeys[idx];
  await ctx.reply(`ًں“‌ ط£ط¯ط®ظ„ ظ‚ظٹظ…ط© ط§ظ„ط­ظ‚ظ„: *${key}*`, { parse_mode: "Markdown", ...Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "ord:cancel")]]) });
}

async function showOrderConfirmation(ctx, p, unitPriceUsd, qty, collected, backTo) {
  const totalUsd = Number((unitPriceUsd * qty).toFixed(4));
  const rate = await getExchangeRate();
  const totalSyp = Math.round(totalUsd * rate);
  const u = await getUser(ctx.from.id);
  const balance = u ? Number(u.balance) : 0;
  const paramsLines = Object.entries(collected).map(([k, v]) => `â€¢ ${k}: ${v}`).join("\n");
  setStep(ctx.from.id, { kind: "order:params", productId: p.id, productName: p.name, priceUsd: unitPriceUsd, qty, paramKeys: Object.keys(collected), collected, idx: Object.keys(collected).length, backTo });
  const lowBalance = balance < totalUsd;
  const totalUsdStr = totalUsd < 0.005 ? totalUsd.toFixed(4) : totalUsd.toFixed(2);
  const text = `ًں§¾ طھط£ظƒظٹط¯ ط§ظ„ط·ظ„ط¨\n\nًں›’ ط§ظ„ظ…ظ†طھط¬: ${p.name}\nًں”¢ ط§ظ„ظƒظ…ظٹط©: ${qty.toLocaleString("en-US")}\n${paramsLines ? paramsLines + "\n" : ""}ًں’° ط§ظ„ط¥ط¬ظ…ط§ظ„ظٹ: ${totalUsdStr}$ | ${totalSyp.toLocaleString("en-US")} ظ„.ط³\nًں’³ ط±طµظٹط¯ظƒ: ${formatBalance(balance, rate)}\n\n${lowBalance ? "â‌Œ ظ„ظٹط³ ظ„ط¯ظٹظƒ ط±طµظٹط¯ ظƒط§ظپظٹ. ظٹط±ط¬ظ‰ ط´ط­ظ† ط±طµظٹط¯ظƒ ط«ظ… ط§ظ„ظ…ط­ط§ظˆظ„ط© ظ…ط¬ط¯ط¯ط§ظ‹." : "ظ‡ظ„ طھط±ظٹط¯ طھط£ظƒظٹط¯ ط§ظ„ط·ظ„ط¨طں"}`;
  const rows = lowBalance
    ? [[Markup.button.callback("ًں’³ ط´ط­ظ† ط±طµظٹط¯", "deposit")], [Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "ord:cancel")]]
    : [[Markup.button.callback("âœ… طھط£ظƒظٹط¯ ظˆطھظ†ظپظٹط°", "ord:confirm"), Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "ord:cancel")]];
  await sendOrEdit(ctx, text, Markup.inlineKeyboard(rows));
}

async function waitForOrderCompletion(orderUuid, maxAttempts = 30, delayMs = 5000) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, delayMs));
    const resp = await checkOrder(orderUuid, true).catch(() => null);
    if (!resp) continue;
    const orderData = extractOrderData(resp);
    const status = (orderData?.status ?? "").toString().toLowerCase();
    if (ACCEPT_STATUSES.has(status) || REJECT_STATUSES.has(status)) {
      return { resp, finalStatus: status, completed: true };
    }
  }
  return { resp: null, finalStatus: "timeout", completed: false };
}

async function executeOrder(ctx) {
  const step = getStep(ctx.from.id);
  if (step.kind !== "order:params") return;
  let all = await getCachedProducts(); let p = all.find(x => x.id === step.productId);
  if (!p) { all = await fetchAllProducts(); p = all.find(x => x.id === step.productId); }
  if (!p) { await ctx.reply("âڑ ï¸ڈ ط§ظ„ظ…ظ†طھط¬ ط؛ظٹط± ظ…ظˆط¬ظˆط¯."); return; }

  const totalUsd = Number((step.priceUsd * step.qty).toFixed(4));
  const u = await getUser(ctx.from.id);
  const balance = u ? Number(u.balance) : 0;
  if (balance < totalUsd) { await ctx.reply("â‌Œ ظ„ظٹط³ ظ„ط¯ظٹظƒ ط±طµظٹط¯ ظƒط§ظپظچ.", Markup.inlineKeyboard([[Markup.button.callback("ًں’³ ط´ط­ظ† ط±طµظٹط¯", "deposit")], [Markup.button.callback("ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]])); setStep(ctx.from.id, { kind: "idle" }); return; }
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
  await ctx.reply("âڈ³ ط¬ط§ط±ظٹ طھظ†ظپظٹط° ط·ظ„ط¨ظƒ...");
  let resp;
  let finalApiStatus;

  try {
    resp = await placeOrder(p.id, params, orderUuid);
    const initialStatus = (resp?.status ?? "").toLowerCase();

    if (ACCEPT_STATUSES.has(initialStatus) || REJECT_STATUSES.has(initialStatus)) {
      finalApiStatus = initialStatus;
    } else {
      const waitResult = await waitForOrderCompletion(orderUuid, 30, 5000);
      if (waitResult.completed) {
        resp = waitResult.resp;
        finalApiStatus = waitResult.finalStatus;
      } else {
        finalApiStatus = "pending";
      }
    }
  } catch {
    resp = { status: "ERR", message: "ط®ط·ط£ ط´ط¨ظƒط©" };
    finalApiStatus = "err";
  }

  const success = ACCEPT_STATUSES.has(finalApiStatus);
  const isRejected = REJECT_STATUSES.has(finalApiStatus);
  const isPending = !success && !isRejected && finalApiStatus !== "err";

  if (isRejected || finalApiStatus === "err") {
    await adjustBalance(ctx.from.id, totalUsd);
    const checkResp = await checkOrder(orderUuid, true).catch(() => null);
    const detailedResp = checkResp ?? resp;
    await q("UPDATE orders SET status='reject', api_response=$1 WHERE id=$2", [JSON.stringify(detailedResp), order.id]);
    setStep(ctx.from.id, { kind: "idle" });
    const rejectReason = extractDeliveredCode(detailedResp) ||
      (detailedResp?.message && detailedResp.message !== "Network error" ? detailedResp.message : null);
    // â”€â”€ ظ„ط§ ظ†ط¹ط±ط¶ ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨ ظ„ظ„ظ…ط³طھط®ط¯ظ… â”€â”€
    await ctx.reply(
      `â‌Œ طھظ… ط±ظپط¶ ط§ظ„ط·ظ„ط¨.\n` +
      (rejectReason ? `ًں“‹ ط§ظ„ط³ط¨ط¨: ${rejectReason}\n` : "") +
      `âœ… طھظ…طھ ط¥ط¹ط§ط¯ط© ${totalUsd.toFixed(2)}$ | ${totalSyp.toLocaleString("en-US")} ظ„.ط³ ط¥ظ„ظ‰ ط±طµظٹط¯ظƒ.`,
      Markup.inlineKeyboard([[Markup.button.callback("ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]])
    );
    return;
  }

  if (isPending) {
    await q("UPDATE orders SET status='pending', api_response=$1 WHERE id=$2", [JSON.stringify(resp), order.id]);
    setStep(ctx.from.id, { kind: "idle" });
    // â”€â”€ ظ„ط§ ظ†ط¹ط±ط¶ ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨ ظ„ظ„ظ…ط³طھط®ط¯ظ… â”€â”€
    await ctx.reply(
      `âڈ³ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط©.\nًں›’ ${p.name} أ— ${step.qty}\nًں’° ${totalUsd.toFixed(2)}$ | ${totalSyp.toLocaleString("en-US")} ظ„.ط³\n\nط³ط£ظڈط¹ظ„ظ…ظƒ طھظ„ظ‚ط§ط¦ظٹط§ظ‹ ط¹ظ†ط¯ ط§ظƒطھظ…ط§ظ„ظ‡.`,
      Markup.inlineKeyboard([
        [Markup.button.callback("ًں”„ طھط­ط¯ظٹط« ط§ظ„ط­ط§ظ„ط©", `ord:check:${order.id}`)],
        [Markup.button.callback("ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]
      ])
    );
    return;
  }

  const deliveredCode = extractDeliveredCode(resp);
  const oranosOrderId = resp?.data?.order_id ?? null;
  await q("UPDATE orders SET status='accept', oranos_order_id=$1, api_response=$2, delivered_code=$3 WHERE id=$4",
    [oranosOrderId, JSON.stringify(resp), deliveredCode ?? null, order.id]);
  setStep(ctx.from.id, { kind: "idle" });
  // â”€â”€ ظ„ط§ ظ†ط¹ط±ط¶ ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨ ظ„ظ„ظ…ط³طھط®ط¯ظ… â”€â”€
  await ctx.reply(`âœ… طھظ… طھظ†ظپظٹط° ط·ظ„ط¨ظƒ ط¨ظ†ط¬ط§ط­!\nًں›’ ${p.name} أ— ${step.qty}\nًں’° ${totalUsd.toFixed(2)}$ | ${totalSyp.toLocaleString("en-US")} ظ„.ط³`);
  if (deliveredCode) {
    await ctx.reply(`ًں”‘ طھظپط§طµظٹظ„ ط§ظ„ط·ظ„ط¨:\n\`\`\`\n${deliveredCode}\n\`\`\``,
      { parse_mode: "Markdown", ...Markup.inlineKeyboard([[Markup.button.callback("ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]]) });
  } else {
    await ctx.reply("ط´ظƒط±ط§ظ‹ ظ„ط§ط³طھط®ط¯ط§ظ…ظƒ ظ…طھط¬ط±ظ†ط§! ًںŒں", Markup.inlineKeyboard([[Markup.button.callback("ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]]));
  }
}

async function showMyOrders(ctx, page) {
  const limit = 8; const offset = (page - 1) * limit;
  const res = await q("SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3", [ctx.from.id, limit + 1, offset]);
  const hasNext = res.rows.length > limit; const slice = res.rows.slice(0, limit);
  if (!slice.length) { await sendOrEdit(ctx, "ًں“­ ظ„ط§ ظٹظˆط¬ط¯ ظ„ط¯ظٹظƒ ط£ظٹ ط·ظ„ط¨ط§طھ ط¨ط¹ط¯.", Markup.inlineKeyboard([[Markup.button.callback("ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]])); return; }
  // â”€â”€ ظ„ط§ ظ†ط¹ط±ط¶ ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨ ظپظٹ ظ‚ط§ط¦ظ…ط© ط§ظ„ط·ظ„ط¨ط§طھ â”€â”€
  const lines = slice.map(r => `ًں›’ ${r.product_name} أ—${r.qty} â€¢ ${Number(r.price_usd).toFixed(2)}$ â€¢ ${statusLabel(r.status)}`);
  const navRow = [];
  if (page > 1) navRow.push(Markup.button.callback("â¬…ï¸ڈ ط§ظ„ط³ط§ط¨ظ‚", `myorders:${page - 1}`));
  if (hasNext) navRow.push(Markup.button.callback("ط§ظ„طھط§ظ„ظٹ â‍،ï¸ڈ", `myorders:${page + 1}`));
  const kb = []; if (navRow.length) kb.push(navRow);
  kb.push([Markup.button.callback("ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]);
  await sendOrEdit(ctx, `ًں“¦ ط·ظ„ط¨ط§طھظٹ\n\n${lines.join("\n")}`, Markup.inlineKeyboard(kb));
}

async function checkOrderStatus(ctx, orderId) {
  const res = await q("SELECT * FROM orders WHERE id=$1", [orderId]);
  const row = res.rows[0];
  if (!row || Number(row.user_id) !== ctx.from.id) { await ctx.reply("âڑ ï¸ڈ ط؛ظٹط± ظ…ظˆط¬ظˆط¯."); return; }
  if (!row.oranos_order_id) { await ctx.reply(`ط§ظ„ط­ط§ظ„ط© ط§ظ„ط­ط§ظ„ظٹط©: ${statusLabel(row.status)}`); return; }
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
      // â”€â”€ ظ„ط§ ظ†ط¹ط±ط¶ ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨ ظ„ظ„ظ…ط³طھط®ط¯ظ… â”€â”€
      if (code && !row.delivered_code) await ctx.reply(`ًں”‘ طھظپط§طµظٹظ„ ط§ظ„ط·ظ„ط¨:\n\n${code}`);
      else if (cleanText) await ctx.reply(`ًں“‹ طھط­ط¯ظٹط« ط·ظ„ط¨ظƒ:\n\n${cleanText}`);
    }
    await ctx.reply(`ط§ظ„ط­ط§ظ„ط© ط§ظ„ط­ط§ظ„ظٹط© ظ„ط·ظ„ط¨ظƒ: ${statusLabel(finalStatus)}`);
  } catch { await ctx.reply("âڑ ï¸ڈ طھط¹ط°ظ‘ط± ظپط­طµ ط§ظ„ط­ط§ظ„ط© ط§ظ„ط¢ظ†."); }
}

async function pollOneOrder(bot, order) {
  let resp = null;
  if (order.oranos_order_id) resp = await checkOrder(order.oranos_order_id).catch(() => null);
  if (!resp && order.oranos_uuid) resp = await checkOrder(order.oranos_uuid, true).catch(() => null);
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

  await q("UPDATE orders SET status=$1, api_response=$2" + (code ? ", delivered_code=$3" : "") + " WHERE id=" + (code ? "$4" : "$3"),
    code ? [finalStatus, JSON.stringify(resp), code, order.id] : [finalStatus, JSON.stringify(resp), order.id]);

  const cleanText = formatApiResponseClean(resp);
  const priceUsd = Number(order.price_usd);
  const rate = await getExchangeRate();

  if (isRejected) {
    if (!prevRejected) await adjustBalance(order.user_id, priceUsd);
    const refundSyp = Math.round(priceUsd * rate);
    const rejectReply = code || cleanText || null;
    // â”€â”€ ظ„ط§ ظ†ط¹ط±ط¶ ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨ ظ„ظ„ظ…ط³طھط®ط¯ظ… â”€â”€
    const msgLines = [
      `â‌Œ طھظ… ط±ظپط¶ ط£ط­ط¯ ط·ظ„ط¨ط§طھظƒ`,
      `ًں›’ ط§ظ„ظ…ظ†طھط¬: ${order.product_name}`,
      ...(rejectReply ? [`ًں“‹ ط§ظ„ط±ط¯: ${rejectReply}`] : []),
      `ًں’° طھظ…طھ ط¥ط¹ط§ط¯ط© ${priceUsd.toFixed(2)}$ | ${refundSyp.toLocaleString("en-US")} ظ„.ط³ ط¥ظ„ظ‰ ط±طµظٹط¯ظƒ.`
    ];
    await bot.telegram.sendMessage(order.user_id, msgLines.join("\n"),
      Markup.inlineKeyboard([[Markup.button.callback("ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]])).catch(() => {});
  } else if (isAccepted) {
    const priceSyp = Math.round(priceUsd * rate);
    // â”€â”€ ظ„ط§ ظ†ط¹ط±ط¶ ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨ ظ„ظ„ظ…ط³طھط®ط¯ظ… â”€â”€
    const msgLines = [
      `âœ… طھظ… طھظ†ظپظٹط° ط£ط­ط¯ ط·ظ„ط¨ط§طھظƒ ط¨ظ†ط¬ط§ط­!`,
      `ًں›’ ط§ظ„ظ…ظ†طھط¬: ${order.product_name}`,
      `ًں’° ${priceUsd.toFixed(2)}$ | ${priceSyp.toLocaleString("en-US")} ظ„.ط³`
    ];
    if (code) {
      msgLines.push(`\nًں”‘ طھظپط§طµظٹظ„ ط§ظ„ط·ظ„ط¨:\n\`\`\`\n${code}\n\`\`\``);
      await bot.telegram.sendMessage(order.user_id, msgLines.join("\n"),
        { parse_mode: "Markdown", ...Markup.inlineKeyboard([[Markup.button.callback("ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]]) }).catch(() => {});
    } else if (cleanText) {
      msgLines.push(`\nًں“‹ طھظپط§طµظٹظ„ ط§ظ„ط·ظ„ط¨:\n\`\`\`\n${cleanText}\n\`\`\``);
      await bot.telegram.sendMessage(order.user_id, msgLines.join("\n"),
        { parse_mode: "Markdown", ...Markup.inlineKeyboard([[Markup.button.callback("ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]]) }).catch(() => {});
    } else {
      await bot.telegram.sendMessage(order.user_id, msgLines.join("\n"),
        Markup.inlineKeyboard([[Markup.button.callback("ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]])).catch(() => {});
    }
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
  }, 30_000).unref();
}

// ============================================================
//  ADMIN
// ============================================================
async function requireAdmin(ctx) {
  const [sessionActive, u] = await Promise.all([
    isAdminSessionActive(ctx.from.id),
    getUser(ctx.from.id),
  ]);
  if (!u?.is_admin) {
    authedAdminIds.delete(ctx.from.id);
    await setAdminSession(ctx.from.id, false).catch(() => {});
    await ctx.reply("â›” ظ‡ط°ط§ ط§ظ„ظ‚ط³ظ… ظ„ظ„ط¥ط¯ط§ط±ط© ظپظ‚ط·.");
    return false;
  }
  if (!sessionActive && !authedAdminIds.has(ctx.from.id)) {
    setStep(ctx.from.id, { kind: "admin:login" });
    await ctx.reply("ًں”‘ ط£ط±ط³ظ„ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ظ„ظ„ط¯ط®ظˆظ„ ط¥ظ„ظ‰ ظ„ظˆط­ط© ط§ظ„ط¥ط¯ط§ط±ط©:");
    return false;
  }
  if (!sessionActive && authedAdminIds.has(ctx.from.id)) {
    authedAdminIds.delete(ctx.from.id);
    setStep(ctx.from.id, { kind: "admin:login" });
    await ctx.reply("ًں”‘ ط§ظ†طھظ‡طھ ط¬ظ„ط³ط© ط§ظ„ط¥ط¯ط§ط±ط©. ط£ط±ط³ظ„ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ظ„ظ„ط¯ط®ظˆظ„ ظ…ط¬ط¯ط¯ط§ظ‹:");
    return false;
  }
  return true;
}

async function requireSuperAdmin(ctx) {
  if (!authedAdminIds.has(ctx.from.id)) { await ctx.reply("â›” ظ‡ط°ط§ ط§ظ„ط¥ط¬ط±ط§ط، ظ„ظ„ظ…ط¯ظٹط± ط§ظ„ط£ط¹ظ„ظ‰ ظپظ‚ط·."); return false; }
  const u = await getUser(ctx.from.id);
  if (!u?.is_super_admin) { await ctx.reply("â›” ظ‡ط°ط§ ط§ظ„ط¥ط¬ط±ط§ط، ظ„ظ„ظ…ط¯ظٹط± ط§ظ„ط£ط¹ظ„ظ‰ ظپظ‚ط·."); return false; }
  return true;
}

async function showAdminMenu(ctx) {
  if (!(await requireAdmin(ctx))) return;
  const status = await getBotStatus();
  const u = await getUser(ctx.from.id);
  const isSA = !!u?.is_super_admin;
  const rows = [
    [Markup.button.callback("ًں“¥ ط·ظ„ط¨ط§طھ ط§ظ„ط¥ظٹط¯ط§ط¹", "adm:depList:1"), Markup.button.callback("ًں‘¥ ط§ظ„ظ…ط³طھط®ط¯ظ…ظˆظ†", "adm:users:1")],
    [Markup.button.callback("ًں”چ ط¨ط­ط« ظ…ط³طھط®ط¯ظ…", "adm:findUser"), Markup.button.callback("ًں“¦ ظƒظ„ ط§ظ„ط·ظ„ط¨ط§طھ", "adm:allOrders:1")],
    [Markup.button.callback("ًں“£ ط±ط³ط§ظ„ط© ط¬ظ…ط§ط¹ظٹط©", "adm:broadcast"), Markup.button.callback("ًں’³ ط·ط±ظ‚ ط§ظ„ط¥ظٹط¯ط§ط¹", "adm:methods")],
    [Markup.button.callback("ًں›’ ط¥ط¯ط§ط±ط© ط§ظ„ظ…ظ†طھط¬ط§طھ", "cat:0:1:0"), Markup.button.callback("âڑ™ï¸ڈ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ", "adm:settings")],
    [Markup.button.callback("ًں“‍ ظˆط³ط§ط¦ظ„ ط§ظ„طھظˆط§طµظ„", "adm:contacts"), Markup.button.callback("ًں“پ ط£ظ‚ط³ط§ظ… ظ…ط®طµطµط©", "adm:vcList")],
    [Markup.button.callback("â‍• ظ…ظ†طھط¬ ظٹط¯ظˆظٹ", "adm:manualProds"), Markup.button.callback("ًں› ï¸ڈ ظ…ط³ط§ط¹ط¯ ط§ظ„ط¥ط¯ط§ط±ط©", "adm:aiSupport")],
    [Markup.button.callback("ًں”„ ط¨ظٹظ†ط¬ طھظ„ظ‚ط§ط¦ظٹ", "adm:ping"), Markup.button.callback(status === "on" ? "ًںں¢ ط§ظ„ط¨ظˆطھ: ط´ط؛ط§ظ„" : "ًں”´ ط§ظ„ط¨ظˆطھ: ظ…طھظˆظ‚ظپ", "adm:toggleStatus")],
    [Markup.button.callback("ًںڑھ طھط³ط¬ظٹظ„ ط®ط±ظˆط¬", "adm:logout"), Markup.button.callback("ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")],
  ];
  await sendOrEdit(ctx, `ًں‘‘ ظ„ظˆط­ط© ط§ظ„ط¥ط¯ط§ط±ط©${isSA ? " (ظ…ط¯ظٹط± ط£ط¹ظ„ظ‰)" : ""}`, Markup.inlineKeyboard(rows));
}

async function showSettingsMenu(ctx) {
  if (!(await requireAdmin(ctx))) return;
  const [m, sm, r] = await Promise.all([getMarkupPercent(), getSocialMarkupPercent(), getExchangeRate()]);
  const loginCmd = await getAdminLoginCommand();
  const u = await getUser(ctx.from.id);
  const isSA = !!u?.is_super_admin;
  const rows = [
    [Markup.button.callback("âœڈï¸ڈ طھط¹ط¯ظٹظ„ ط§ظ„ط±ط¨ط­ ط§ظ„ط¹ط§ظ…", "adm:setMarkup")],
    [Markup.button.callback("âœڈï¸ڈ طھط¹ط¯ظٹظ„ ط±ط¨ط­ ط§ظ„ط³ظˆط´ظ„", "adm:setSocialMarkup")],
    [Markup.button.callback("ًں’± طھط¹ط¯ظٹظ„ ط³ط¹ط± ط§ظ„طµط±ظپ", "adm:setRate")],
    [Markup.button.callback("ًں”‘ طھط؛ظٹظٹط± ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±", "adm:newPass")],
    [Markup.button.callback("ًں”ک طھط¹ط¯ظٹظ„ ط£ط²ط±ط§ط± ط§ظ„طھظ†ظ‚ظ„", "adm:btnLabels")],
  ];
  if (isSA) {
    rows.push([Markup.button.callback("ًں”گ طھط؛ظٹظٹط± ط£ظ…ط± ط§ظ„ط¯ط®ظˆظ„ ط§ظ„ط³ط±ظٹ", "adm:changeLoginCmd")]);
  }
  rows.push([Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "admin:menu")]);
  await sendOrEdit(ctx, `âڑ™ï¸ڈ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ\n\nط§ظ„ط±ط¨ط­ ط§ظ„ط¹ط§ظ…: ${m}%\nط±ط¨ط­ ط§ظ„ط³ظˆط´ظ„: ${sm}%\nط³ط¹ط± ط§ظ„طµط±ظپ: ${r} ظ„.ط³/$\nط£ظ…ط± ط§ظ„ط¯ط®ظˆظ„: \`${loginCmd}\``,
    Markup.inlineKeyboard(rows));
}

async function showDepList(ctx, page) {
  if (!(await requireAdmin(ctx))) return;
  const limit = 8; const offset = (page - 1) * limit;
  const res = await q("SELECT * FROM deposit_requests WHERE status='pending' ORDER BY created_at DESC LIMIT $1 OFFSET $2", [limit + 1, offset]);
  const hasNext = res.rows.length > limit; const slice = res.rows.slice(0, limit);
  if (!slice.length) { await sendOrEdit(ctx, "ًں“­ ظ„ط§ طھظˆط¬ط¯ ط·ظ„ط¨ط§طھ ط¥ظٹط¯ط§ط¹ ظ…ط¹ظ„ظ‚ط©.", Markup.inlineKeyboard([[Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "admin:menu")]])); return; }
  const kb = slice.map(d => [Markup.button.callback(`${d.method_name} â€¢ ${d.amount ? Number(d.amount).toFixed(2) + "$" : "â€”"} â€¢ UID:${d.user_id}`, `adm:depShow:${d.id}`)]);
  const nav = [];
  if (page > 1) nav.push(Markup.button.callback("â¬…ï¸ڈ ط§ظ„ط³ط§ط¨ظ‚", `adm:depList:${page - 1}`));
  if (hasNext) nav.push(Markup.button.callback("ط§ظ„طھط§ظ„ظٹ â‍،ï¸ڈ", `adm:depList:${page + 1}`));
  if (nav.length) kb.push(nav);
  kb.push([Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "admin:menu")]);
  await sendOrEdit(ctx, "ًں“¥ ط·ظ„ط¨ط§طھ ط§ظ„ط¥ظٹط¯ط§ط¹ ط§ظ„ظ…ط¹ظ„ظ‚ط©:", Markup.inlineKeyboard(kb));
}

async function showDepDetails(ctx, depId) {
  if (!(await requireAdmin(ctx))) return;
  const res = await q("SELECT * FROM deposit_requests WHERE id=$1", [depId]);
  const d = res.rows[0]; if (!d) { await ctx.reply("âڑ ï¸ڈ ط؛ظٹط± ظ…ظˆط¬ظˆط¯."); return; }
  const u = await getUser(d.user_id);
  const text = `ًں“¥ ط·ظ„ط¨ ط¥ظٹط¯ط§ط¹\nط§ظ„ط­ط§ظ„ط©: ${d.status}\nط§ظ„ط·ط±ظٹظ‚ط©: ${d.method_name}\nط§ظ„ظ…ط³طھط®ط¯ظ…: ${u?.first_name ?? ""} ${u?.username ? "@" + u.username : ""} (${d.user_id})\nط±طµظٹط¯ ط§ظ„ظ…ط³طھط®ط¯ظ…: ${u ? Number(u.balance).toFixed(2) : "0.00"}$\nط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ظ…ظڈط­ظˆظژظ‘ظ„: ${d.amount ? Number(d.amount).toFixed(2) + "$" : "â€”"}`;
  const balanceRow = [Markup.button.callback("â‍• ط´ط­ظ† ط±طµظٹط¯", `adm:userAdd:${d.user_id}`), Markup.button.callback("â‍– ط®طµظ… ط±طµظٹط¯", `adm:userSub:${d.user_id}`)];
  const kb = d.status === "pending"
    ? Markup.inlineKeyboard([[Markup.button.callback("âœ… ظ…ظˆط§ظپظ‚ط©", `adm:dep:approve:${d.id}`), Markup.button.callback("â‌Œ ط±ظپط¶", `adm:dep:reject:${d.id}`)], balanceRow, [Markup.button.callback("ًں‘¤ ظ…ظ„ظپ ط§ظ„ظ…ط³طھط®ط¯ظ…", `adm:user:${d.user_id}`)], [Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "adm:depList:1")]])
    : Markup.inlineKeyboard([balanceRow, [Markup.button.callback("ًں‘¤ ظ…ظ„ظپ ط§ظ„ظ…ط³طھط®ط¯ظ…", `adm:user:${d.user_id}`)], [Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "adm:depList:1")]]);
  try { await ctx.replyWithPhoto(d.screenshot_file_id, { caption: text, ...kb }); }
  catch { await ctx.reply(text + "\n\n(طھط¹ط°ظ‘ط± طھط­ظ…ظٹظ„ ط§ظ„طµظˆط±ط©)", kb); }
}

async function approveDeposit(ctx, depId) {
  if (!(await requireAdmin(ctx))) return;
  setStep(ctx.from.id, { kind: "admin:depositApproveAmount", depositId: depId });
  await ctx.reply(`ًں’µ ط£ط±ط³ظ„ ط§ظ„ظ…ط¨ظ„ط؛ ط¨ط§ظ„ط¯ظˆظ„ط§ط± ظ„ط¥ط¶ط§ظپطھظ‡ ط¥ظ„ظ‰ ط±طµظٹط¯ ط§ظ„ظ…ط³طھط®ط¯ظ…:`, Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "admin:menu")]]));
}

async function rejectDeposit(ctx, depId) {
  if (!(await requireAdmin(ctx))) return;
  const res = await q("UPDATE deposit_requests SET status='rejected', processed_by=$1, processed_at=NOW() WHERE id=$2 AND status='pending' RETURNING *", [ctx.from.id, depId]);
  if (!res.rows.length) { await ctx.reply("âڑ ï¸ڈ طھظ…طھ ظ…ط¹ط§ظ„ط¬ط© ظ‡ط°ط§ ط§ظ„ط·ظ„ط¨ ظ…ط³ط¨ظ‚ط§ظ‹ ط¨ظˆط§ط³ط·ط© ظ…ط¯ظٹط± ط¢ط®ط±."); return; }
  const d = res.rows[0];
  await clearDepositForOtherAdmins(ctx.from.id, depId, `â‌Œ ط·ظ„ط¨ ط¥ظٹط¯ط§ط¹ â€” طھظ… ط§ظ„ط±ظپط¶`);
  await ctx.reply(`â‌Œ طھظ… ط±ظپط¶ ط·ظ„ط¨ ط§ظ„ط¥ظٹط¯ط§ط¹.`);
  // â”€â”€ ظ„ط§ ظ†ط¹ط±ط¶ ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨ ظ„ظ„ظ…ط³طھط®ط¯ظ… â”€â”€
  if (d) { try { await ctx.telegram.sendMessage(d.user_id, `â‌Œ طھظ… ط±ظپط¶ ط·ظ„ط¨ ط§ظ„ط¥ظٹط¯ط§ط¹. ظ„ظ„ط§ط³طھظپط³ط§ط± ط±ط§ط³ظ„ @${ADMIN_USERNAME}.`); } catch { /* ignore */ } }
}

async function showUserCard(ctx, uid) {
  if (!(await requireAdmin(ctx))) return;
  const u = await getUser(uid); if (!u) { await ctx.reply("âڑ ï¸ڈ ط؛ظٹط± ظ…ظˆط¬ظˆط¯."); return; }
  const me = await getUser(ctx.from.id);
  const isMeSA = !!me?.is_super_admin;
  const statsRes = await q("SELECT COUNT(*)::int AS c, COALESCE(SUM(price_usd),0)::text AS s FROM orders WHERE user_id=$1", [uid]);
  const oc = statsRes.rows[0]?.c ?? 0; const sum = Number(statsRes.rows[0]?.s ?? 0);
  const text = `ًں‘¤ ${u.first_name ?? "â€”"}${u.username ? " @" + u.username : ""}\nID: ${u.id}\nط§ظ„ط±طµظٹط¯: ${Number(u.balance).toFixed(2)}$\nط§ظ„ط­ط§ظ„ط©: ${u.status}\nط¥ط¯ط§ط±ظٹطں ${u.is_admin ? "ظ†ط¹ظ…" : "ظ„ط§"}${u.is_super_admin ? " (ط£ط¹ظ„ظ‰)" : ""}\nط¹ط¯ط¯ ط§ظ„ط·ظ„ط¨ط§طھ: ${oc} â€¢ ط¥ط¬ظ…ط§ظ„ظٹ: ${sum.toFixed(2)}$`;
  const kb = [
    [Markup.button.callback("â‍• ط´ط­ظ† ط±طµظٹط¯", `adm:userAdd:${uid}`), Markup.button.callback("â‍– ط®طµظ… ط±طµظٹط¯", `adm:userSub:${uid}`)],
    [Markup.button.callback(u.status === "banned" ? "âœ… ط±ظپط¹ ط§ظ„ط­ط¸ط±" : "ًںڑ« ط­ط¸ط±", `adm:userBan:${uid}`), Markup.button.callback(u.is_admin ? "ًں‘¤ ط¥ظ„ط؛ط§ط، ط¥ط¯ط§ط±ظٹ" : "ًں‘‘ ط¬ط¹ظ„ظ‡ ط¥ط¯ط§ط±ظٹ", `adm:userAdmin:${uid}`)],
    [Markup.button.callback("ًں“¦ ط·ظ„ط¨ط§طھظ‡", `adm:userOrders:${uid}:1`), Markup.button.callback("% ط±ط¨ط­ ط®ط§طµ", `adm:userMarkup:${uid}`)],
  ];
  if (isMeSA && uid !== ctx.from.id) {
    kb.push([Markup.button.callback(u.is_super_admin ? "â¬‡ï¸ڈ ط¥ظ„ط؛ط§ط، ط§ظ„ظ…ط¯ظٹط± ط§ظ„ط£ط¹ظ„ظ‰" : "ًںŒں ط¬ط¹ظ„ظ‡ ظ…ط¯ظٹط±ط§ظ‹ ط£ط¹ظ„ظ‰", `adm:userSA:${uid}`)]);
  }
  kb.push([Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "adm:users:1")]);
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
  if (!token) { console.error("â‌Œ BOT_TOKEN is required"); process.exit(1); }

  await ensureTables();
  await ensureDefaults();
  await ensureDefaultDepositMethods();

  const bot = new Telegraf(token, { handlerTimeout: 90_000 });

  // â”€â”€ Rate limiter + ط±ط¯ ظپظˆط±ظٹ ط¹ظ„ظ‰ callback â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      if (ctx.callbackQuery) ctx.answerCbQuery("âڈ±ï¸ڈ ط§ظ„ط±ط¬ط§ط، ط§ظ„ط§ظ†طھط¸ط§ط±...").catch(() => {});
      return;
    }
    times.push(now); _rateMap.set(uid, times);
    if (ctx.callbackQuery) ctx.answerCbQuery().catch(() => {});
    return next();
  });

  // â”€â”€ Commands â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  bot.start(async ctx => {
    const txt = ctx.message?.text ?? "";
    setStep(ctx.from.id, { kind: "idle" });
    const startParam = txt.replace("/start", "").trim();
    if (startParam) {
      const loginCmd = await getAdminLoginCommand();
      if (startParam === loginCmd) {
        setStep(ctx.from.id, { kind: "admin:login" });
        await ctx.reply("ًں”‘ ط£ط±ط³ظ„ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±:");
        return;
      }
    }
    await showMainMenu(ctx);
  });
  bot.command("menu", async ctx => { setStep(ctx.from.id, { kind: "idle" }); await showMainMenu(ctx); });
  bot.command("balance", async ctx => { const u = await ensureUser(ctx); if (!u) return; await ctx.reply(`ًں’° ط±طµظٹط¯ظƒ: ${formatBalance(Number(u.balance), await getExchangeRate())}`); });
  bot.command("deposit", async ctx => { await ensureUser(ctx); setStep(ctx.from.id, { kind: "idle" }); await showDepositMenu(ctx); });
  bot.command("orders", async ctx => { await ensureUser(ctx); await showMyOrders(ctx, 1); });
  bot.command("support", async ctx => { await ensureUser(ctx); await showContactLinks(ctx); });

  bot.command("admin", async ctx => {
    const user = await ensureUser(ctx);
    if (!user?.is_admin) {
      await ctx.reply("â›” ظ‡ط°ط§ ط§ظ„ط£ظ…ط± ظ„ظ„ط¥ط¯ط§ط±ط© ظپظ‚ط·.");
      return;
    }
    const sessionActive = await isAdminSessionActive(ctx.from.id);
    if (!sessionActive && !authedAdminIds.has(ctx.from.id)) {
      setStep(ctx.from.id, { kind: "admin:login" });
      await ctx.reply("ًں”‘ ط£ط±ط³ظ„ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±:");
      return;
    }
    await showAdminMenu(ctx);
  });

  // â”€â”€ Callback Queries â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  bot.action("home", async ctx => { setStep(ctx.from.id, { kind: "idle" }); await showMainMenu(ctx); });
  bot.action("balance", async ctx => {
    const u = await ensureUser(ctx); if (!u) return;
    const rate = await getExchangeRate();
    await sendOrEdit(ctx, `ًں’° ط±طµظٹط¯ظƒ: ${formatBalance(Number(u.balance), rate)}`, Markup.inlineKeyboard([[Markup.button.callback("ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]]));
  });
  bot.action("deposit", async ctx => { await ensureUser(ctx); await showDepositMenu(ctx); });
  bot.action("support", async ctx => { await ensureUser(ctx); await showContactLinks(ctx); });
  bot.action(/^myorders:(\d+)$/, async ctx => { await showMyOrders(ctx, Number(ctx.match[1])); });
  bot.action("noop", async ctx => { /* ظ†ظ‚ط±ط© ط¹ظ„ظ‰ ط±ظ‚ظ… ط§ظ„طµظپط­ط© */ });

  // â”€â”€ Admin auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  bot.action("admin:menu", async ctx => { await showAdminMenu(ctx); });
  bot.action("admin:loginPrompt", async ctx => {
    setStep(ctx.from.id, { kind: "admin:login" });
    await ctx.reply("ًں”‘ ط£ط±ط³ظ„ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±:");
  });

  bot.action("adm:logout", async ctx => {
    authedAdminIds.delete(ctx.from.id);
    await setAdminSession(ctx.from.id, false);
    invalidateUserCache(ctx.from.id);
    setStep(ctx.from.id, { kind: "idle" });
    const user = await getUser(ctx.from.id);
    const rate = await getExchangeRate();
    const greeting = `ط£ظ‡ظ„ط§ظ‹ ظپظٹظƒ ظپظٹ ظ…طھط¬ط± ط§ظ„ظ…ط±ظˆط§ظ† ًںŒں\nط§ظ„ط§ط³ظ…: ${user?.first_name ?? "â€”"}${user?.username ? ` (@${user.username})` : ""}\nط§ظ„ط±ظ‚ظ…: ${ctx.from.id}\nط§ظ„ط±طµظٹط¯: ${formatBalance(Number(user?.balance ?? 0), rate)}\n\nطھظ… طھط³ط¬ظٹظ„ ط§ظ„ط®ط±ظˆط¬ ظ…ظ† ظ„ظˆط­ط© ط§ظ„ط¥ط¯ط§ط±ط© ًں‘‹\nط§ط®طھط± ظ…ظ† ط§ظ„ظ‚ط§ط¦ظ…ط© ًں‘‡`;
    await sendOrEdit(ctx, greeting, mainMenu());
  });

  // â”€â”€ Deposit flow â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  bot.action(/^dep:method:(\d+)$/, async ctx => { await showDepositMethod(ctx, Number(ctx.match[1])); });
  bot.action("dep:cancel", async ctx => { setStep(ctx.from.id, { kind: "idle" }); await showMainMenu(ctx); });

  // â”€â”€ Category / Product navigation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Buy flow â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  bot.action(/^buy:(\d+):(\d+)$/, async ctx => {
    await ensureUser(ctx);
    await startOrderFlow(ctx, Number(ctx.match[1]), Number(ctx.match[2]));
  });
  bot.action(/^ord:qty:(\d+\.?\d*)$/, async ctx => {
    const step = getStep(ctx.from.id);
    if (step.kind !== "order:qty") return;
    const qty = Number(ctx.match[1]);
    let all = await getCachedProducts(); let p = all.find(x => x.id === step.productId);
    if (!p) { all = await fetchAllProducts(); p = all.find(x => x.id === step.productId); }
    if (!p) return;
    await askNextParam(ctx, p, step.priceUsd, qty, step.paramKeys, {}, 0, step.backTo);
  });
  bot.action("ord:confirm", async ctx => { await executeOrder(ctx); });
  bot.action("ord:cancel", async ctx => { setStep(ctx.from.id, { kind: "idle" }); await showMainMenu(ctx); });
  bot.action(/^ord:check:(\d+)$/, async ctx => { await checkOrderStatus(ctx, Number(ctx.match[1])); });

  // â”€â”€ Manual product buy â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  bot.action(/^mbuy:(\d+)$/, async ctx => {
    const mid = Number(ctx.match[1]);
    const m = (await q("SELECT * FROM manual_products WHERE id=$1 AND active=true", [mid])).rows[0];
    if (!m) { await ctx.reply("âڑ ï¸ڈ ط§ظ„ظ…ظ†طھط¬ ط؛ظٹط± ظ…طھط§ط­."); return; }
    const u = await getUser(ctx.from.id);
    const priceUsd = Number(m.price_usd);
    if (!u || Number(u.balance) < priceUsd) { await ctx.reply("â‌Œ ط±طµظٹط¯ ط؛ظٹط± ظƒط§ظپظچ.", Markup.inlineKeyboard([[Markup.button.callback("ًں’³ ط´ط­ظ† ط±طµظٹط¯", "deposit")]])); return; }
    setStep(ctx.from.id, { kind: "order:manualNote", productId: mid, priceUsd });
    await ctx.reply(`ًں“‌ ط£ط±ط³ظ„ ظ…ظ„ط§ط­ط¸ط© ظ„ظ„ط·ظ„ط¨ ط£ظˆ ط§ظƒطھط¨ "skip":`, Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "ord:cancel")]]));
  });

  // â”€â”€ Admin: deposit management â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  bot.action(/^adm:depList:(\d+)$/, async ctx => { await showDepList(ctx, Number(ctx.match[1])); });
  bot.action(/^adm:depShow:(\d+)$/, async ctx => { await showDepDetails(ctx, Number(ctx.match[1])); });
  bot.action(/^adm:dep:approve:(\d+)$/, async ctx => { await approveDeposit(ctx, Number(ctx.match[1])); });
  bot.action(/^adm:dep:reject:(\d+)$/, async ctx => { await rejectDeposit(ctx, Number(ctx.match[1])); });

  // â”€â”€ Admin: users â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  bot.action(/^adm:users:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const page = Number(ctx.match[1]); const limit = 10; const offset = (page - 1) * limit;
    const users = await listUsers(offset, limit + 1);
    const hasNext = users.length > limit; const slice = users.slice(0, limit);
    const total = await countUsers();
    const kb = slice.map(u => [Markup.button.callback(`${u.first_name ?? "â€”"}${u.username ? " @" + u.username : ""} â€¢ ${Number(u.balance).toFixed(2)}$${u.is_super_admin ? " ًںŒں" : u.is_admin ? " ًں‘‘" : ""}`, `adm:user:${u.id}`)]);
    const nav = [];
    if (page > 1) nav.push(Markup.button.callback("â¬…ï¸ڈ ط§ظ„ط³ط§ط¨ظ‚", `adm:users:${page - 1}`));
    if (hasNext) nav.push(Markup.button.callback("ط§ظ„طھط§ظ„ظٹ â‍،ï¸ڈ", `adm:users:${page + 1}`));
    if (nav.length) kb.push(nav);
    kb.push([Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "admin:menu")]);
    await sendOrEdit(ctx, `ًں‘¥ ط§ظ„ظ…ط³طھط®ط¯ظ…ظˆظ† (${total}):`, Markup.inlineKeyboard(kb));
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
    await ctx.reply(newStatus === "banned" ? "ًںڑ« طھظ… ط§ظ„ط­ط¸ط±." : "âœ… طھظ… ط±ظپط¹ ط§ظ„ط­ط¸ط±.");
    await showUserCard(ctx, uid);
  });
  bot.action(/^adm:userAdmin:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const me = await getUser(ctx.from.id);
    if (!me?.is_super_admin) { await ctx.reply("â›” ط§ظ„ظ…ط¯ظٹط± ط§ظ„ط£ط¹ظ„ظ‰ ظپظ‚ط· ظٹط³طھط·ظٹط¹ طھط¹ظٹظٹظ† ط§ظ„ظ…ط¯ظٹط±ظٹظ†."); return; }
    const uid = Number(ctx.match[1]); const u = await getUser(uid);
    const newAdmin = !u?.is_admin;
    await setAdmin(uid, newAdmin, newAdmin ? false : undefined);
    if (!newAdmin) {
      authedAdminIds.delete(uid);
      await setAdminSession(uid, false).catch(() => {});
    }
    await ctx.reply(newAdmin ? "ًں‘‘ طھظ… ط§ظ„طھط¹ظٹظٹظ† ط¥ط¯ط§ط±ظٹظ‹ط§." : "ًں‘¤ طھظ… ط¥ظ„ط؛ط§ط، ط§ظ„ط¥ط¯ط§ط±ظٹ.");
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
    await ctx.reply(newSA ? "ًںŒں طھظ… طھط¹ظٹظٹظ†ظ‡ ظ…ط¯ظٹط±ط§ظ‹ ط£ط¹ظ„ظ‰." : "â¬‡ï¸ڈ طھظ… ط¥ظ„ط؛ط§ط، طµظ„ط§ط­ظٹط© ط§ظ„ظ…ط¯ظٹط± ط§ظ„ط£ط¹ظ„ظ‰.");
    await showUserCard(ctx, uid);
  });
  bot.action(/^adm:userAdd:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:userBalance", userId: Number(ctx.match[1]), mode: "add" }); await ctx.reply("ًں’µ ط£ط±ط³ظ„ ط§ظ„ظ…ط¨ظ„ط؛ ط¨ط§ظ„ط¯ظˆظ„ط§ط± ظ„ظ„ط¥ط¶ط§ظپط©:", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "admin:menu")]])); });
  bot.action(/^adm:userSub:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:userBalance", userId: Number(ctx.match[1]), mode: "sub" }); await ctx.reply("ًں’µ ط£ط±ط³ظ„ ط§ظ„ظ…ط¨ظ„ط؛ ط¨ط§ظ„ط¯ظˆظ„ط§ط± ظ„ظ„ط®طµظ…:", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "admin:menu")]])); });
  bot.action("adm:findUser", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:findUser" }); await ctx.reply("ًں”چ ط£ط±ط³ظ„ ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ… ط£ظˆ ID:", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "admin:menu")]])); });
  bot.action(/^adm:userOrders:(\d+):(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const uid = Number(ctx.match[1]); const page = Number(ctx.match[2]); const limit = 8; const offset = (page - 1) * limit;
    const res = await q("SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3", [uid, limit + 1, offset]);
    const hasNext = res.rows.length > limit; const slice = res.rows.slice(0, limit);
    if (!slice.length) { await sendOrEdit(ctx, "ًں“­ ظ„ط§ طھظˆط¬ط¯ ط·ظ„ط¨ط§طھ.", Markup.inlineKeyboard([[Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", `adm:user:${uid}`)]])); return; }
    const lines = slice.map(r => `ًں›’ ${r.product_name} أ—${r.qty} â€¢ ${Number(r.price_usd).toFixed(2)}$ â€¢ ${statusLabel(r.status)}`);
    const nav = []; if (page > 1) nav.push(Markup.button.callback("â¬…ï¸ڈ ط§ظ„ط³ط§ط¨ظ‚", `adm:userOrders:${uid}:${page - 1}`)); if (hasNext) nav.push(Markup.button.callback("ط§ظ„طھط§ظ„ظٹ â‍،ï¸ڈ", `adm:userOrders:${uid}:${page + 1}`));
    const kb = []; if (nav.length) kb.push(nav); kb.push([Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", `adm:user:${uid}`)]);
    await sendOrEdit(ctx, `ًں“¦ ط·ظ„ط¨ط§طھ ط§ظ„ظ…ط³طھط®ط¯ظ… ${uid}\n\n${lines.join("\n")}`, Markup.inlineKeyboard(kb));
  });
  bot.action(/^adm:userMarkup:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const uid = Number(ctx.match[1]); const u = await getUser(uid); setStep(ctx.from.id, { kind: "admin:setUserMarkup", userId: uid }); await ctx.reply(`% ظ†ط³ط¨ط© ط±ط¨ط­ ${u?.first_name ?? uid}\nط§ظ„ط­ط§ظ„ظٹط©: ${u?.custom_markup_percent ?? "ط؛ظٹط± ظ…ط­ط¯ط¯ط©"}\nط£ط±ط³ظ„ ط§ظ„ظ†ط³ط¨ط© ط£ظˆ reset:`, Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", `adm:user:${uid}`)]])); });

  // â”€â”€ Admin: orders â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  bot.action(/^adm:allOrders:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const page = Number(ctx.match[1]); const limit = 8; const offset = (page - 1) * limit;
    const res = await q(`SELECT o.*, u.username AS uname, u.first_name AS ufirst FROM orders o LEFT JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC LIMIT $1 OFFSET $2`, [limit + 1, offset]);
    const hasNext = res.rows.length > limit; const slice = res.rows.slice(0, limit);
    if (!slice.length) { await sendOrEdit(ctx, "ًں“­ ظ„ط§ طھظˆط¬ط¯ ط·ظ„ط¨ط§طھ.", Markup.inlineKeyboard([[Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "admin:menu")]])); return; }
    const lines = slice.map(r => `${r.ufirst ?? "â€”"}${r.uname ? " @" + r.uname : ""}\n   ${r.product_name} أ—${r.qty} â€¢ ${Number(r.price_usd).toFixed(2)}$ â€¢ ${statusLabel(r.status)}`);
    const nav = []; if (page > 1) nav.push(Markup.button.callback("â¬…ï¸ڈ ط§ظ„ط³ط§ط¨ظ‚", `adm:allOrders:${page - 1}`)); if (hasNext) nav.push(Markup.button.callback("ط§ظ„طھط§ظ„ظٹ â‍،ï¸ڈ", `adm:allOrders:${page + 1}`));
    const kb = []; if (nav.length) kb.push(nav); kb.push([Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "admin:menu")]);
    await sendOrEdit(ctx, `ًں“¦ ظƒظ„ ط§ظ„ط·ظ„ط¨ط§طھ\n\n${lines.join("\n\n")}`, Markup.inlineKeyboard(kb));
  });

  // â”€â”€ Admin: broadcast â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  bot.action("adm:broadcast", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:broadcast" }); await ctx.reply("ًں“£ ط£ط±ط³ظ„ ظ†طµ ط§ظ„ط±ط³ط§ظ„ط© ط§ظ„ط¬ظ…ط§ط¹ظٹط©:", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "admin:menu")]])); });

  // â”€â”€ Admin: deposit methods â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  bot.action("adm:methods", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const res = await q("SELECT * FROM deposit_methods ORDER BY id"); const rows = res.rows;
    const kb = rows.map(m => [Markup.button.callback(`${m.active ? "ًںں¢" : "ًں”´"} ${m.name}`, `adm:methodEdit:${m.id}`)]);
    kb.push([Markup.button.callback("â‍• ط¥ط¶ط§ظپط© ط·ط±ظٹظ‚ط©", "adm:methodAdd")]); kb.push([Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "admin:menu")]);
    await sendOrEdit(ctx, "ًں’³ ط·ط±ظ‚ ط§ظ„ط¥ظٹط¯ط§ط¹", Markup.inlineKeyboard(kb));
  });
  bot.action("adm:methodAdd", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:addMethod:name" }); await ctx.reply("ًں’³ ط£ط±ط³ظ„ ط§ط³ظ… ط·ط±ظٹظ‚ط© ط§ظ„ط¥ظٹط¯ط§ط¹:", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "adm:methods")]])); });
  bot.action(/^adm:methodEdit:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const id = Number(ctx.match[1]); const res = await q("SELECT * FROM deposit_methods WHERE id=$1", [id]); const m = res.rows[0]; if (!m) return;
    await sendOrEdit(ctx, `ًں’³ ${m.name}\nط§ظ„ظ…ط¹ط±ظپ: ${m.identifier}\nط§ظ„ط­ط§ظ„ط©: ${m.active ? "ظ…ظپط¹ظ‘ظ„" : "ظ…ظˆظ‚ظˆظپ"}\nًں–¼ طµظˆط±ط©: ${m.image_file_id ? "âœ… ظ…ظˆط¬ظˆط¯ط©" : "â‌Œ ظ„ط§ ظٹظˆط¬ط¯"}\n\n${m.instructions}`,
      Markup.inlineKeyboard([
        [Markup.button.callback(m.active ? "ًں”´ طھط¹ط·ظٹظ„" : "ًںں¢ طھظپط¹ظٹظ„", `adm:methodToggle:${id}`), Markup.button.callback("âœڈï¸ڈ ط§ظ„طھط¹ظ„ظٹظ…ط§طھ", `adm:methodInstr:${id}`)],
        [Markup.button.callback("ًں–¼ ط±ظپط¹/طھط؛ظٹظٹط± ط§ظ„طµظˆط±ط©", `adm:methodImg:${id}`), Markup.button.callback("ًں—‘ï¸ڈ ط­ط°ظپ ط§ظ„طµظˆط±ط©", `adm:methodImgDel:${id}`)],
        [Markup.button.callback("ًں—‘ï¸ڈ ط­ط°ظپ ط§ظ„ط·ط±ظٹظ‚ط©", `adm:methodDel:${id}`)],
        [Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "adm:methods")]
      ]));
  });
  bot.action(/^adm:methodToggle:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const id = Number(ctx.match[1]); const cur = (await q("SELECT active FROM deposit_methods WHERE id=$1", [id])).rows[0]; if (!cur) return; await q("UPDATE deposit_methods SET active=$1 WHERE id=$2", [!cur.active, id]); });
  bot.action(/^adm:methodInstr:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:editMethodInstructions", methodId: Number(ctx.match[1]) }); await ctx.reply("ًں“‹ ط£ط±ط³ظ„ ط§ظ„طھط¹ظ„ظٹظ…ط§طھ ط§ظ„ط¬ط¯ظٹط¯ط©:", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "adm:methods")]])); });
  bot.action(/^adm:methodDel:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; await q("DELETE FROM deposit_methods WHERE id=$1", [Number(ctx.match[1])]); await ctx.reply("ًں—‘ï¸ڈ طھظ… ط§ظ„ط­ط°ظپ."); });
  bot.action(/^adm:methodImg:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    setStep(ctx.from.id, { kind: "admin:setMethodImage", methodId: Number(ctx.match[1]) });
    await ctx.reply("ًں–¼ ط£ط±ط³ظ„ ط§ظ„طµظˆط±ط© ط§ظ„طھظٹ طھط±ظٹط¯ ط¥ط¶ط§ظپطھظ‡ط§:", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "adm:methods")]]));
  });
  bot.action(/^adm:methodImgDel:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    await q("UPDATE deposit_methods SET image_file_id=NULL WHERE id=$1", [Number(ctx.match[1])]);
    await ctx.reply("âœ… طھظ… ط­ط°ظپ ط§ظ„طµظˆط±ط©.");
  });

  // â”€â”€ Admin: product management â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  bot.action(/^adm:editPrice:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const all = await fetchAllProducts(); const p = all.find(x => x.id === pid); setStep(ctx.from.id, { kind: "admin:editPrice", productId: pid, productName: p?.name ?? "" }); await ctx.reply(`âœڈï¸ڈ ط³ط¹ط±: ${p?.name ?? pid}\nط£ط±ط³ظ„: \`%5\` ط±ط¨ط­ ط£ظˆ \`$2.5\` طھط«ط¨ظٹطھ ط£ظˆ \`reset\``, { parse_mode: "Markdown" }); });
  bot.action(/^adm:editInstr:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const all = await fetchAllProducts(); const p = all.find(x => x.id === pid); setStep(ctx.from.id, { kind: "admin:editProductInstructions", productId: pid, productName: p?.name ?? "" }); await ctx.reply(`ًں“‹ ط£ط±ط³ظ„ طھط¹ظ„ظٹظ…ط§طھ ${p?.name ?? pid} ط£ظˆ clear ظ„ظ„ظ…ط³ط­:`, Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", `prod:${pid}:0`)]])); });
  bot.action(/^adm:renameProd:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const all = await fetchAllProducts(); const p = all.find(x => x.id === pid); setStep(ctx.from.id, { kind: "admin:renameProduct", productId: pid, productName: p?.name ?? "" }); await ctx.reply(`ًں“‌ ط§ظ„ط§ط³ظ… ط§ظ„ط¬ط¯ظٹط¯ ظ„ظ€ "${p?.name ?? pid}" ط£ظˆ reset:`); });
  bot.action(/^adm:moveProd:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const all = await fetchAllProducts(); const p = all.find(x => x.id === pid); setStep(ctx.from.id, { kind: "admin:moveProduct", productId: pid, productName: p?.name ?? "" }); await ctx.reply(`ًںڑڑ ظ†ظ‚ظ„ "${p?.name ?? pid}"\nط£ط±ط³ظ„ ط±ظ‚ظ… ط§ظ„ظ‚ط³ظ… ط£ظˆ reset:`, Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", `prod:${pid}:0`)]])); });
  bot.action(/^adm:hideProd:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const pid = Number(ctx.match[1]); const cur = (await q("SELECT hidden FROM product_overrides WHERE product_id=$1", [pid])).rows[0];
    const nextHidden = !(cur?.hidden ?? false);
    await q("INSERT INTO product_overrides(product_id,hidden) VALUES($1,$2) ON CONFLICT(product_id) DO UPDATE SET hidden=$2, updated_at=NOW()", [pid, nextHidden]);
    invalidateCaches(); await ctx.reply(nextHidden ? "ًں™ˆ طھظ… ط¥ط®ظپط§ط، ط§ظ„ظ…ظ†طھط¬." : "ًں‘پ طھظ… ط¥ط¸ظ‡ط§ط± ط§ظ„ظ…ظ†طھط¬.");
  });

  // â”€â”€ Admin: category management â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  bot.action(/^adm:catEdit:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:editCategoryName", categoryId: Number(ctx.match[1]) }); await ctx.reply("âœڈï¸ڈ ط£ط±ط³ظ„ ط§ظ„ط§ط³ظ… ط§ظ„ط¬ط¯ظٹط¯ ظ„ظ„ظ‚ط³ظ… (ط£ظˆ reset):"); });
  bot.action(/^adm:catToggle:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const cid = Number(ctx.match[1]); const cur = (await q("SELECT hidden FROM category_overrides WHERE category_id=$1", [cid])).rows[0];
    const nextHidden = !(cur?.hidden ?? false);
    await q("INSERT INTO category_overrides(category_id,hidden) VALUES($1,$2) ON CONFLICT(category_id) DO UPDATE SET hidden=$2, updated_at=NOW()", [cid, nextHidden]);
    invalidateCaches(); await ctx.reply(nextHidden ? "ًں™ˆ طھظ… ط¥ط®ظپط§ط، ط§ظ„ظ‚ط³ظ…." : "ًں‘پ طھظ… ط¥ط¸ظ‡ط§ط± ط§ظ„ظ‚ط³ظ….");
  });
  bot.action(/^adm:catMarkup:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const cid = Number(ctx.match[1]); const cur = (await q("SELECT custom_markup_percent FROM category_overrides WHERE category_id=$1", [cid])).rows[0]; setStep(ctx.from.id, { kind: "admin:setCatMarkup", categoryId: cid }); await ctx.reply(`% ظ†ط³ط¨ط© ط±ط¨ط­ ط§ظ„ظ‚ط³ظ… ${cid}\nط§ظ„ط­ط§ظ„ظٹط©: ${cur?.custom_markup_percent ?? "ط؛ظٹط± ظ…ط­ط¯ط¯ط©"}\nط£ط±ط³ظ„ ط§ظ„ظ†ط³ط¨ط© ط£ظˆ reset:`); });
  bot.action(/^adm:catSort:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const cid = Number(ctx.match[1]); setStep(ctx.from.id, { kind: "admin:setCatSort", categoryId: cid }); await ctx.reply(`ًں”¢ طھط±طھظٹط¨ ط§ظ„ظ‚ط³ظ… ${cid}\nط£ط±ط³ظ„ ط±ظ‚ظ… ط§ظ„طھط±طھظٹط¨ ط£ظˆ reset:`); });
  bot.action(/^adm:moveCatAll:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:moveCatAll", sourceCategoryId: Number(ctx.match[1]) }); await ctx.reply(`ًںڑڑ ظ†ظ‚ظ„ ط¬ظ…ظٹط¹ ظ…ظ†طھط¬ط§طھ ط§ظ„ظ‚ط³ظ…\nط£ط±ط³ظ„ ط±ظ‚ظ… ط§ظ„ظ‚ط³ظ… ط§ظ„ظ‡ط¯ظپ ط£ظˆ cancel:`, Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", `cat:${ctx.match[1]}:1:0`)]])); });
  bot.action(/^adm:moveCatToParent:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const cid = Number(ctx.match[1]);
    setStep(ctx.from.id, { kind: "admin:moveCatToParent", categoryId: cid });
    await ctx.reply(`ًں“پ ظ†ظ‚ظ„ ط§ظ„ظ‚ط³ظ… ط¥ظ„ظ‰ ط¯ط§ط®ظ„ ظ‚ط³ظ… ط¢ط®ط±\nط£ط±ط³ظ„ ط±ظ‚ظ… ط§ظ„ظ‚ط³ظ… ط§ظ„ظ‡ط¯ظپ ط£ظˆ "0" ظ„ظ„ط±ط¬ظˆط¹ ظ„ظ„ط¬ط°ط± ط£ظˆ "cancel" ظ„ظ„ط¥ظ„ط؛ط§ط،:`, Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", `cat:${cid}:1:0`)]]));
  });

  // â”€â”€ Admin: settings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  bot.action("adm:settings", async ctx => { await showSettingsMenu(ctx); });
  bot.action("adm:setMarkup", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:setMarkup" }); await ctx.reply("âœڈï¸ڈ ط£ط±ط³ظ„ ظ†ط³ط¨ط© ط§ظ„ط±ط¨ط­ ط§ظ„ط¹ط§ظ… (ظ…ط«ط§ظ„: 5):", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "adm:settings")]])); });
  bot.action("adm:setSocialMarkup", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:setSocialMarkup" }); await ctx.reply("âœڈï¸ڈ ط£ط±ط³ظ„ ظ†ط³ط¨ط© ط±ط¨ط­ ط§ظ„ط³ظˆط´ظ„:", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "adm:settings")]])); });
  bot.action("adm:setRate", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:setRate" }); await ctx.reply("ًں’± ط£ط±ط³ظ„ ط³ط¹ط± ط§ظ„طµط±ظپ (ظ„.ط³/$):", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "adm:settings")]])); });
  bot.action("adm:newPass", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:newPassword" }); await ctx.reply("ًں”‘ ط£ط±ط³ظ„ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط§ظ„ط¬ط¯ظٹط¯ط© (4 ط£ط­ط±ظپ ط¹ظ„ظ‰ ط§ظ„ط£ظ‚ظ„):", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "adm:settings")]])); });
  bot.action("adm:changeLoginCmd", async ctx => {
    if (!(await requireSuperAdmin(ctx))) return;
    const cur = await getAdminLoginCommand();
    setStep(ctx.from.id, { kind: "admin:changeLoginCmd" });
    await ctx.reply(`ًں”گ ط§ظ„ط£ظ…ط± ط§ظ„ط­ط§ظ„ظٹ: \`${cur}\`\nط£ط±ط³ظ„ ط§ظ„ط£ظ…ط± ط§ظ„ط¬ط¯ظٹط¯:`, { parse_mode: "Markdown" });
  });
  bot.action("adm:toggleStatus", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const cur = await getBotStatus(); const next = cur === "on" ? "off" : "on";
    await setSetting("bot_status", next);
    await ctx.reply(next === "on" ? "ًںں¢ ط§ظ„ط¨ظˆطھ ط§ظ„ط¢ظ† ط´ط؛ط§ظ„." : "ًں”´ ط§ظ„ط¨ظˆطھ ظ…طھظˆظ‚ظپ ط§ظ„ط¢ظ†.");
    await showAdminMenu(ctx);
  });

  // â”€â”€ Admin: ping â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  bot.action("adm:ping", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const [enabled, target, interval] = await Promise.all([getSetting("auto_ping_enabled"), getSetting("auto_ping_target_user_id"), getSetting("auto_ping_interval_min")]);
    await sendOrEdit(ctx, `ًں”„ ط§ظ„ط¨ظٹظ†ط¬ ط§ظ„طھظ„ظ‚ط§ط¦ظٹ\nط§ظ„ط­ط§ظ„ط©: ${enabled === "on" ? "âœ… ظ…ظپط¹ظ‘ظ„" : "â‌Œ ظ…ظˆظ‚ظˆظپ"}\nط§ظ„ظ…ط³طھظ‡ط¯ظپ: ${target || "ط؛ظٹط± ظ…ط­ط¯ط¯"}\nط§ظ„ظپط§طµظ„: ${interval} ط¯ظ‚ظٹظ‚ط©`,
      Markup.inlineKeyboard([[Markup.button.callback(enabled === "on" ? "â‌Œ ط¥ظٹظ‚ط§ظپ" : "âœ… طھظپط¹ظٹظ„", "adm:pingToggle")], [Markup.button.callback("ًںژ¯ طھط¹ظٹظٹظ† ط§ظ„ظ…ط³طھظ‡ط¯ظپ", "adm:pingTarget")], [Markup.button.callback("âڈ± طھط¹ظٹظٹظ† ط§ظ„ظپط§طµظ„", "adm:pingInterval")], [Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "admin:menu")]]));
  });
  bot.action("adm:pingToggle", async ctx => { if (!(await requireAdmin(ctx))) return; const cur = await getSetting("auto_ping_enabled"); await setSetting("auto_ping_enabled", cur === "on" ? "off" : "on"); await ctx.reply(cur === "on" ? "â‌Œ طھظ… ط¥ظٹظ‚ط§ظپ ط§ظ„ط¨ظٹظ†ط¬." : "âœ… طھظ… طھظپط¹ظٹظ„ ط§ظ„ط¨ظٹظ†ط¬."); });
  bot.action("adm:pingTarget", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:pingTarget" }); await ctx.reply("ًںژ¯ ط£ط±ط³ظ„ ID ط§ظ„ظ…ط³طھط®ط¯ظ… ط§ظ„ظ‡ط¯ظپ:"); });
  bot.action("adm:pingInterval", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:pingInterval" }); await ctx.reply("âڈ± ط£ط±ط³ظ„ ط§ظ„ظپط§طµظ„ ط§ظ„ط²ظ…ظ†ظٹ ط¨ط§ظ„ط¯ظ‚ط§ط¦ظ‚:"); });

  // â”€â”€ Admin: contacts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  bot.action("adm:contacts", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const links = (await q("SELECT * FROM contact_links ORDER BY id")).rows;
    const rows = links.map(l => [Markup.button.callback(`${l.active ? "ًںں¢" : "ًں”´"} ${l.name}`, `adm:contactEdit:${l.id}`)]);
    rows.push([Markup.button.callback("â‍• ط¥ط¶ط§ظپط©", "adm:addContact")]); rows.push([Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "admin:menu")]);
    await sendOrEdit(ctx, "ًں“‍ ظˆط³ط§ط¦ظ„ ط§ظ„طھظˆط§طµظ„:", Markup.inlineKeyboard(rows));
  });
  bot.action("adm:addContact", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:addContact:name" }); await ctx.reply("ًں“‍ ط£ط±ط³ظ„ ط§ط³ظ… ظˆط³ظٹظ„ط© ط§ظ„طھظˆط§طµظ„:", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "adm:contacts")]])); });
  bot.action(/^adm:contactEdit:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const id = Number(ctx.match[1]); const l = (await q("SELECT * FROM contact_links WHERE id=$1", [id])).rows[0]; if (!l) return;
    await sendOrEdit(ctx, `ًں“‍ ${l.name}\n${l.link}`,
      Markup.inlineKeyboard([[Markup.button.callback(l.active ? "ًں”´ ط¥ط®ظپط§ط،" : "ًںں¢ ط¥ط¸ظ‡ط§ط±", `adm:contactToggle:${id}`), Markup.button.callback("ًں—‘ï¸ڈ ط­ط°ظپ", `adm:contactDel:${id}`)], [Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "adm:contacts")]]));
  });
  bot.action(/^adm:contactToggle:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const id = Number(ctx.match[1]); const l = (await q("SELECT active FROM contact_links WHERE id=$1", [id])).rows[0]; if (!l) return; await q("UPDATE contact_links SET active=$1 WHERE id=$2", [!l.active, id]); });
  bot.action(/^adm:contactDel:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; await q("DELETE FROM contact_links WHERE id=$1", [Number(ctx.match[1])]); await ctx.reply("ًں—‘ï¸ڈ طھظ… ط§ظ„ط­ط°ظپ."); });

  // â”€â”€ Admin: virtual categories â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  bot.action("adm:vcList", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const vcs = (await q("SELECT * FROM virtual_categories WHERE parent_id=0 ORDER BY position")).rows;
    const rows = vcs.map(v => [Markup.button.callback(`${v.active ? "ًں“‚" : "ًں”’"} ${v.name}`, `vcat:${v.id}:1:0`)]);
    rows.push([Markup.button.callback("â‍• ط¥ط¶ط§ظپط© ظ‚ط³ظ…", "adm:addVCat")]); rows.push([Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "admin:menu")]);
    await sendOrEdit(ctx, "ًں“پ ط§ظ„ط£ظ‚ط³ط§ظ… ط§ظ„ظ…ط®طµطµط©:", Markup.inlineKeyboard(rows));
  });
  bot.action("adm:addVCat", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:addVirtualCategory:name", parentId: 0 }); await ctx.reply("ًں“پ ط£ط±ط³ظ„ ط§ط³ظ… ط§ظ„ظ‚ط³ظ… ط§ظ„ظ…ط®طµطµ:", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "adm:vcList")]])); });
  bot.action(/^adm:addVCatSub:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const pv = (await q("SELECT name FROM virtual_categories WHERE id=$1", [pid])).rows[0]; setStep(ctx.from.id, { kind: "admin:addVirtualCategory:name", parentId: pid }); await ctx.reply(`ًں“پ ط£ط±ط³ظ„ ط§ط³ظ… ط§ظ„ظ‚ط³ظ… ط§ظ„ظپط±ط¹ظٹ ط¯ط§ط®ظ„ "${pv?.name ?? pid}":`, Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", `vcat:${pid}:1:0`)]])); });
  bot.action(/^adm:vcEdit:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:editVCatName", vcId: Number(ctx.match[1]) }); await ctx.reply("âœڈï¸ڈ ط£ط±ط³ظ„ ط§ظ„ط§ط³ظ… ط§ظ„ط¬ط¯ظٹط¯ ظ„ظ„ظ‚ط³ظ…:"); });
  bot.action(/^adm:vcToggle:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const id = Number(ctx.match[1]); const v = (await q("SELECT active FROM virtual_categories WHERE id=$1", [id])).rows[0]; if (!v) return; await q("UPDATE virtual_categories SET active=$1, updated_at=NOW() WHERE id=$2", [!v.active, id]); await ctx.reply(!v.active ? "ًں‘پ طھظ… ط§ظ„ط¥ط¸ظ‡ط§ط±." : "ًں™ˆ طھظ… ط§ظ„ط¥ط®ظپط§ط،."); });
  bot.action(/^adm:vcDel:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; await q("DELETE FROM virtual_categories WHERE id=$1", [Number(ctx.match[1])]); await ctx.reply("ًں—‘ï¸ڈ طھظ… ط­ط°ظپ ط§ظ„ظ‚ط³ظ…."); });

  // â”€â”€ Admin: manual products â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  bot.action("adm:manualProds", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const prods = (await q("SELECT * FROM manual_products ORDER BY id")).rows;
    const pendingCount = (await q("SELECT COUNT(*)::int AS c FROM manual_orders WHERE status='pending'")).rows[0]?.c ?? 0;
    const rows = prods.map(p => [Markup.button.callback(`${p.active ? "ًں›’" : "â‌Œ"} ${p.name}`, `adm:manualProd:${p.id}`)]);
    rows.push([Markup.button.callback(`ًں“‹ ط·ظ„ط¨ط§طھ ظ…ط¹ظ„ظ‚ط©${pendingCount > 0 ? ` (${pendingCount})` : ""}`, "adm:manualOrders")]);
    rows.push([Markup.button.callback("â‍• ط¥ط¶ط§ظپط© ظ…ظ†طھط¬ ظٹط¯ظˆظٹ", "adm:addManual")]); rows.push([Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "admin:menu")]);
    await sendOrEdit(ctx, "ًں›’ ط§ظ„ظ…ظ†طھط¬ط§طھ ط§ظ„ظٹط¯ظˆظٹط©:", Markup.inlineKeyboard(rows));
  });
  bot.action("adm:addManual", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:addManualProduct:name" }); await ctx.reply("ًں“‌ ط£ط±ط³ظ„ ط§ط³ظ… ط§ظ„ظ…ظ†طھط¬ ط§ظ„ظٹط¯ظˆظٹ:", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "adm:manualProds")]])); });
  bot.action(/^adm:manualProd:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const pid = Number(ctx.match[1]); const p = (await q("SELECT * FROM manual_products WHERE id=$1", [pid])).rows[0]; if (!p) return;
    await sendOrEdit(ctx, `ًں›’ ${p.name}\nط§ظ„ط³ط¹ط±: ${Number(p.price_usd).toFixed(2)}$\nط§ظ„ط­ط§ظ„ط©: ${p.active ? "âœ…" : "â‌Œ"}`,
      Markup.inlineKeyboard([[Markup.button.callback(p.active ? "â‌Œ طھط¹ط·ظٹظ„" : "âœ… طھظپط¹ظٹظ„", `adm:manualToggle:${pid}`)], [Markup.button.callback("ًں—‘ï¸ڈ ط­ط°ظپ", `adm:manualDel:${pid}`)], [Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "adm:manualProds")]]));
  });
  bot.action(/^adm:manualToggle:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const p = (await q("SELECT active FROM manual_products WHERE id=$1", [pid])).rows[0]; if (!p) return; await q("UPDATE manual_products SET active=$1, updated_at=NOW() WHERE id=$2", [!p.active, pid]); await ctx.reply(!p.active ? "âœ… طھظ… ط§ظ„طھظپط¹ظٹظ„." : "â‌Œ طھظ… ط§ظ„طھط¹ط·ظٹظ„."); });
  bot.action(/^adm:manualDel:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; await q("DELETE FROM manual_products WHERE id=$1", [Number(ctx.match[1])]); await ctx.reply("ًں—‘ï¸ڈ طھظ… ط§ظ„ط­ط°ظپ."); });
  bot.action("adm:manualOrders", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const orders = (await q("SELECT * FROM manual_orders WHERE status='pending' ORDER BY id DESC LIMIT 30")).rows;
    if (!orders.length) { await sendOrEdit(ctx, "ًں“­ ظ„ط§ طھظˆط¬ط¯ ط·ظ„ط¨ط§طھ ظٹط¯ظˆظٹط© ظ…ط¹ظ„ظ‚ط©.", Markup.inlineKeyboard([[Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "adm:manualProds")]])); return; }
    const rows = orders.map(o => [Markup.button.callback(`${o.product_name.slice(0, 20)} â€¢ ${Number(o.price_usd).toFixed(2)}$`.slice(0, 60), `adm:mord:${o.id}`)]);
    rows.push([Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "adm:manualProds")]);
    await sendOrEdit(ctx, `ًں“‹ ط§ظ„ط·ظ„ط¨ط§طھ ط§ظ„ظٹط¯ظˆظٹط© ط§ظ„ظ…ط¹ظ„ظ‚ط© (${orders.length}):`, Markup.inlineKeyboard(rows));
  });
  bot.action(/^adm:mord:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const oid = Number(ctx.match[1]); const o = (await q("SELECT * FROM manual_orders WHERE id=$1", [oid])).rows[0]; if (!o) return;
    const u = (await q("SELECT * FROM users WHERE id=$1", [o.user_id])).rows[0];
    const rate = await getExchangeRate(); const syp = Math.round(Number(o.price_usd) * rate);
    await sendOrEdit(ctx, `ًں“‹ ط·ظ„ط¨ ظٹط¯ظˆظٹ\nًں‘¤ ${u?.username ? "@" + u.username : `ID:${o.user_id}`}\nًں›’ ${o.product_name}\nًں’° ${Number(o.price_usd).toFixed(2)}$ | ${syp.toLocaleString("en-US")} ظ„.ط³\nط§ظ„ط­ط§ظ„ط©: ${o.status}`,
      Markup.inlineKeyboard([[Markup.button.callback("âœ… ظ‚ط¨ظˆظ„ ظˆطھط³ظ„ظٹظ…", `adm:mordAccept:${oid}`), Markup.button.callback("â‌Œ ط±ظپط¶ ظˆط§ط³طھط±ط¯ط§ط¯", `adm:mordReject:${oid}`)], [Markup.button.callback("ًں’¬ ط¥ط±ط³ط§ظ„ ط±ط³ط§ظ„ط©", `adm:mordMsg:${oid}`)], [Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "adm:manualOrders")]]));
  });
  bot.action(/^adm:mordAccept:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const oid = Number(ctx.match[1]); const o = (await q("SELECT * FROM manual_orders WHERE id=$1", [oid])).rows[0]; if (!o || o.status !== "pending") { await ctx.reply("âڑ ï¸ڈ طھظ… ظ…ط¹ط§ظ„ط¬طھظ‡ ظ…ط³ط¨ظ‚ط§ظ‹."); return; } setStep(ctx.from.id, { kind: "admin:manualOrderAccept", orderId: oid, userId: Number(o.user_id), productName: o.product_name, priceUsd: Number(o.price_usd) }); await ctx.reply(`âœڈï¸ڈ ط£ط±ط³ظ„ ط±ط³ط§ظ„ط© ط§ظ„طھط³ظ„ظٹظ… ط£ظˆ "skip":`); });
  bot.action(/^adm:mordReject:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const oid = Number(ctx.match[1]); const o = (await q("SELECT * FROM manual_orders WHERE id=$1", [oid])).rows[0]; if (!o || o.status !== "pending") { await ctx.reply("âڑ ï¸ڈ طھظ… ظ…ط¹ط§ظ„ط¬طھظ‡."); return; }
    await q("UPDATE manual_orders SET status='rejected', updated_at=NOW() WHERE id=$1", [oid]);
    await adjustBalance(Number(o.user_id), Number(o.price_usd));
    await ctx.reply(`âœ… طھظ… ط§ظ„ط±ظپط¶ ظˆط¥ط¹ط§ط¯ط© ط§ظ„ط±طµظٹط¯.`);
    const rate = await getExchangeRate(); const syp = Math.round(Number(o.price_usd) * rate);
    // â”€â”€ ظ„ط§ ظ†ط¹ط±ط¶ ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨ ظ„ظ„ظ…ط³طھط®ط¯ظ… â”€â”€
    await ctx.telegram.sendMessage(o.user_id, `â‌Œ طھظ… ط±ظپط¶ ط·ظ„ط¨ظƒ\nًں›’ ${o.product_name}\nًں’° طھظ…طھ ط¥ط¹ط§ط¯ط© ${Number(o.price_usd).toFixed(2)}$ | ${syp.toLocaleString("en-US")} ظ„.ط³`, Markup.inlineKeyboard([[Markup.button.callback("ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]])).catch(() => {});
  });
  bot.action(/^adm:mordMsg:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const oid = Number(ctx.match[1]); const o = (await q("SELECT user_id FROM manual_orders WHERE id=$1", [oid])).rows[0]; if (!o) return; setStep(ctx.from.id, { kind: "admin:manualOrderMsg", orderId: oid, userId: Number(o.user_id) }); await ctx.reply(`ًں’¬ ط£ط±ط³ظ„ ط§ظ„ط±ط³ط§ظ„ط© ظ„ظ„ظ…ط³طھط®ط¯ظ… ${o.user_id}:`); });

  // â”€â”€ Admin: nav buttons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  bot.action("adm:btnLabels", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const [b, h, p2, n] = await Promise.all([getBtnBackLabel(), getBtnHomeLabel(), getBtnPrevLabel(), getBtnNextLabel()]);
    await sendOrEdit(ctx, `ًں”ک ط£ط²ط±ط§ط± ط§ظ„طھظ†ظ‚ظ„:\nط±ط¬ظˆط¹: ${b}\nط§ظ„ط±ط¦ظٹط³ظٹط©: ${h}\nط§ظ„ط³ط§ط¨ظ‚: ${p2}\nط§ظ„طھط§ظ„ظٹ: ${n}`,
      Markup.inlineKeyboard([[Markup.button.callback("âœڈï¸ڈ ط²ط± ط§ظ„ط±ط¬ظˆط¹", "adm:btnEdit:btn_back_label:ط±ط¬ظˆط¹")], [Markup.button.callback("âœڈï¸ڈ ط²ط± ط§ظ„ط±ط¦ظٹط³ظٹط©", "adm:btnEdit:btn_home_label:ط§ظ„ط±ط¦ظٹط³ظٹط©")], [Markup.button.callback("âœڈï¸ڈ ط²ط± ط§ظ„ط³ط§ط¨ظ‚", "adm:btnEdit:btn_prev_label:ط§ظ„ط³ط§ط¨ظ‚")], [Markup.button.callback("âœڈï¸ڈ ط²ط± ط§ظ„طھط§ظ„ظٹ", "adm:btnEdit:btn_next_label:ط§ظ„طھط§ظ„ظٹ")], [Markup.button.callback("ًں”„ ط¥ط¹ط§ط¯ط© ط§ظ„ط§ظپطھط±ط§ط¶ظٹ", "adm:btnReset")], [Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "adm:settings")]]));
  });
  bot.action(/^adm:btnEdit:([^:]+):(.+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const key = ctx.match[1]; setStep(ctx.from.id, { kind: "admin:editBtnLabel", key }); await ctx.reply(`âœڈï¸ڈ ط£ط±ط³ظ„ ط§ظ„ظ†طµ ط§ظ„ط¬ط¯ظٹط¯ ظ„ظ„ط²ط±:`); });
  bot.action("adm:btnReset", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    await Promise.all(["btn_back_label", "btn_home_label", "btn_prev_label", "btn_next_label"].map(k => setSetting(k, DEFAULTS[k])));
    await ctx.reply("âœ… طھظ…طھ ط¥ط¹ط§ط¯ط© ط§ظ„ط£ط²ط±ط§ط± ظ„ظ„ط§ظپطھط±ط§ط¶ظٹ.");
  });

  // â”€â”€ Admin: AI support â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  bot.action("adm:aiSupport", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    clearAiHistory(ctx.from.id);
    setStep(ctx.from.id, { kind: "admin:aiSupport" });
    await ctx.reply(`ًں› ï¸ڈ ظ…ط³ط§ط¹ط¯ ط§ظ„ط¥ط¯ط§ط±ط©${hasAiKey() ? "" : " (ظˆط¶ط¹ FAQ)"}\nط£ط±ط³ظ„ ط³ط¤ط§ظ„ظƒ ط£ظˆ "ط®ط±ظˆط¬" ظ„ظ„ط¥ظ†ظ‡ط§ط،:`, Markup.inlineKeyboard([[Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "admin:menu")]]));
  });

  // â”€â”€ Photo handler â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  bot.on("photo", async ctx => {
    const step = getStep(ctx.from.id);
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;

    if (step.kind === "admin:setMethodImage") {
      await q("UPDATE deposit_methods SET image_file_id=$1 WHERE id=$2", [fileId, step.methodId]);
      setStep(ctx.from.id, { kind: "idle" });
      await ctx.reply("âœ… طھظ… ط­ظپط¸ ط§ظ„طµظˆط±ط©. ط³طھط¸ظ‡ط± ظ„ظ„ظ…ط³طھط®ط¯ظ…ظٹظ† ط¹ظ†ط¯ ط§ط®طھظٹط§ط± ظ‡ط°ظ‡ ط§ظ„ط·ط±ظٹظ‚ط©.");
      return;
    }

    if (step.kind === "admin:addMethod:photo") {
      await q("INSERT INTO deposit_methods(name,identifier,instructions,image_file_id) VALUES($1,$2,$3,$4)",
        [step.name, step.identifier, step.instructions, fileId]);
      setStep(ctx.from.id, { kind: "idle" });
      await ctx.reply("âœ… طھظ… ط¥ط¶ط§ظپط© ط·ط±ظٹظ‚ط© ط§ظ„ط¥ظٹط¯ط§ط¹ ظ…ط¹ ط§ظ„طµظˆط±ط©.");
      return;
    }

    // â”€â”€ طھط¯ظپظ‚ ط§ظ„ط¥ظٹط¯ط§ط¹ ط§ظ„ط¬ط¯ظٹط¯: ط§ط³طھظ„ط§ظ… ط§ظ„طµظˆط±ط© â”€â”€
    if (step.kind === "deposit:info") {
      const newStep = { ...step, photoFileId: fileId };
      if (newStep.amount !== null) {
        // ظ„ط¯ظٹظ†ط§ ط§ظ„ظ…ط¨ظ„ط؛ ظˆط§ظ„طµظˆط±ط©طŒ ط§ظƒظ…ظ„ ط§ظ„ط·ظ„ط¨
        await completeDepositRequest(ctx, newStep);
      } else {
        // ط§ط³طھظ„ظ…ظ†ط§ ط§ظ„طµظˆط±ط© ظ‚ط¨ظ„ ط§ظ„ظ…ط¨ظ„ط؛طŒ ط§ط·ظ„ط¨ ط§ظ„ظ…ط¨ظ„ط؛
        setStep(ctx.from.id, newStep);
        await ctx.reply("ط£ط±ط³ظ„ ط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ط°ظٹ ظ‚ظ…طھ ط¨طھط­ظˆظٹظ„ظ‡:",
          Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "dep:cancel")]]));
      }
      return;
    }
  });

  // â”€â”€ Text router â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  bot.on("text", async (ctx, next) => {
    const step = getStep(ctx.from.id);
    const txt = ctx.message.text.trim();

    // طھط­ظ‚ظ‚ ظ…ظ† ط£ظ…ط± ط§ظ„ط¯ط®ظˆظ„ ط§ظ„ط³ط±ظٹ
    if (!txt.startsWith("/")) {
      const loginCmd = await getAdminLoginCommand();
      if (txt === loginCmd) {
        await ensureUser(ctx);
        setStep(ctx.from.id, { kind: "admin:login" });
        await ctx.reply("ًں”‘ ط£ط±ط³ظ„ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±:");
        return;
      }
    }

    if (txt.startsWith("/")) return next();

    // â”€â”€ طھط¯ظپظ‚ ط§ظ„ط¥ظٹط¯ط§ط¹ ط§ظ„ط¬ط¯ظٹط¯: ط§ط³طھظ„ط§ظ… ط§ظ„ظ…ط¨ظ„ط؛ â”€â”€
    if (step.kind === "deposit:info") {
      const exchangeRate = await getExchangeRate();
      const amount = extractAmountFromText(txt, exchangeRate);
      if (!amount || amount <= 0) {
        await ctx.reply("âڑ ï¸ڈ ظ„ظ… ط£ط³طھط·ط¹ ظپظ‡ظ… ط§ظ„ظ…ط¨ظ„ط؛. ط£ط±ط³ظ„ظ‡ ط¨ط´ظƒظ„ ط£ظˆط¶ط­ (ظ…ط«ط§ظ„: 5$ ط£ظˆ 1000 ظ„.ط³).",
          Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "dep:cancel")]]));
        return;
      }
      const newStep = { ...step, amount };
      if (newStep.photoFileId) {
        // ظ„ط¯ظٹظ†ط§ ط§ظ„ظ…ط¨ظ„ط؛ ظˆط§ظ„طµظˆط±ط©طŒ ط§ظƒظ…ظ„ ط§ظ„ط·ظ„ط¨
        await completeDepositRequest(ctx, newStep);
      } else {
        setStep(ctx.from.id, newStep);
        await ctx.reply(`ط£ط±ط³ظ„ طµظˆط±ط© ط¥ط´ط¹ط§ط± ط§ظ„طھط­ظˆظٹظ„.`,
          Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "dep:cancel")]]));
      }
      return;
    }

    if (step.kind === "order:qty") {
      const n = Number(txt); if (!Number.isFinite(n) || n <= 0) { await ctx.reply("âڑ ï¸ڈ ط£ط¯ط®ظ„ ط±ظ‚ظ… طµط­ظٹط­ ظ…ظˆط¬ط¨."); return; }
      const qv = step.qtyValues; const qty = Array.isArray(qv) ? n : Math.floor(n);
      if (qv && !Array.isArray(qv)) { if (qty < qv.min || qty > qv.max) { await ctx.reply(`âڑ ï¸ڈ ط§ظ„ظƒظ…ظٹط© ط¨ظٹظ† ${qv.min.toLocaleString("en-US")} ظˆ ${qv.max.toLocaleString("en-US")}.`); return; } }
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
      // â”€â”€ ظ„ط§ ظ†ط¹ط±ط¶ ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨ ظ„ظ„ظ…ط³طھط®ط¯ظ… â”€â”€
      await ctx.reply(`âœ… طھظ… ط§ط³طھظ„ط§ظ… ط·ظ„ط¨ظƒ\nًں›’ ${m.name}\nط³ظٹطھظ… ط§ظ„طھظ†ظپظٹط° ظپظٹ ط£ظ‚ط±ط¨ ظˆظ‚طھ.`, Markup.inlineKeyboard([[Markup.button.callback("ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]]));
      const admins = await listAdmins();
      const rate = await getExchangeRate(); const syp = Math.round(step.priceUsd * rate);
      for (const a of admins) {
        await ctx.telegram.sendMessage(a.id, `ًں“‹ ط·ظ„ط¨ ظٹط¯ظˆظٹ ط¬ط¯ظٹط¯\nًں‘¤ ${ctx.from.first_name ?? ctx.from.id}\nًں›’ ${m.name}\nًں’° ${step.priceUsd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ظ„.ط³${note ? `\nًں“‌ ${note}` : ""}`,
          Markup.inlineKeyboard([[Markup.button.callback("ًں“‹ ط¹ط±ط¶ ط§ظ„ط·ظ„ط¨", `adm:mord:${ord.id}`)]])).catch(() => {});
      }
      return;
    }

    switch (step.kind) {
      case "admin:login": {
        const expected = await getAdminPassword();
        if (txt !== expected) {
          await ctx.reply("â‌Œ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ط®ط§ط·ط¦ط©.", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "home")]]));
          return;
        }
        const userRow = await getUser(ctx.from.id);
        const wasSuperAdmin = !!userRow?.is_super_admin;
        const superRes = await q("SELECT id FROM users WHERE is_super_admin=true LIMIT 1");
        const noSuperExists = superRes.rows.length === 0;
        const becomeSuper = noSuperExists || wasSuperAdmin;
        await setAdmin(ctx.from.id, true, becomeSuper); await markAdminAuthed(ctx.from.id);
        authedAdminIds.add(ctx.from.id);
        await setAdminSession(ctx.from.id, true);
        setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(`âœ… طھظ… طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„${becomeSuper ? " (ظ…ط¯ظٹط± ط£ط¹ظ„ظ‰) ًںŒں" : ""}.`);
        await showAdminMenu(ctx); return;
      }
      case "admin:setMarkup": { const n = Number(txt); if (!Number.isFinite(n) || n < 0) { await ctx.reply("âڑ ï¸ڈ ط£ط¯ط®ظ„ ط±ظ‚ظ…ط§ظ‹ طµط§ظ„ط­ط§ظ‹."); return; } await setSetting("markup_percent", String(n)); invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`âœ… ط§ظ„ط±ط¨ط­ ط§ظ„ط¹ط§ظ…: ${n}%.`); await showSettingsMenu(ctx); return; }
      case "admin:setSocialMarkup": { const n = Number(txt); if (!Number.isFinite(n) || n < 0) { await ctx.reply("âڑ ï¸ڈ ط£ط¯ط®ظ„ ط±ظ‚ظ…ط§ظ‹ طµط§ظ„ط­ط§ظ‹."); return; } await setSetting("social_markup_percent", String(n)); invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`âœ… ط±ط¨ط­ ط§ظ„ط³ظˆط´ظ„: ${n}%.`); await showSettingsMenu(ctx); return; }
      case "admin:setRate": { const n = Number(txt); if (!Number.isFinite(n) || n <= 0) { await ctx.reply("âڑ ï¸ڈ ط³ط¹ط± طµط±ظپ ط؛ظٹط± طµط§ظ„ط­."); return; } await setSetting("exchange_rate", String(n)); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`âœ… ط³ط¹ط± ط§ظ„طµط±ظپ: ${n} ظ„.ط³/$.`); await showSettingsMenu(ctx); return; }
      case "admin:newPassword": { if (txt.length < 4) { await ctx.reply("âڑ ï¸ڈ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ظ‚طµظٹط±ط© ط¬ط¯ط§ظ‹."); return; } await setSetting("admin_password", txt); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ… طھط­ط¯ظٹط« ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±."); return; }
      case "admin:changeLoginCmd": {
        if (txt.length < 5) { await ctx.reply("âڑ ï¸ڈ ط§ظ„ط£ظ…ط± ظ‚طµظٹط± ط¬ط¯ط§ظ‹ (5 ط£ط­ط±ظپ ط¹ظ„ظ‰ ط§ظ„ط£ظ‚ظ„)."); return; }
        await setSetting("admin_login_command", txt); setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(`âœ… طھظ… طھط؛ظٹظٹط± ط£ظ…ط± ط§ظ„ط¯ط®ظˆظ„.`, { parse_mode: "Markdown" }); return;
      }
      case "admin:depositApproveAmount": {
        const n = Number(txt); if (!Number.isFinite(n) || n <= 0) { await ctx.reply("âڑ ï¸ڈ ط£ط¯ط®ظ„ ظ…ط¨ظ„ط؛ط§ظ‹ طµط§ظ„ط­ط§ظ‹."); return; }
        const updated = await q("UPDATE deposit_requests SET status='approved', amount=$1, processed_by=$2, processed_at=NOW() WHERE id=$3 AND status='pending' RETURNING *", [String(n), ctx.from.id, step.depositId]);
        if (!updated.rows.length) { setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âڑ ï¸ڈ طھظ…طھ ظ…ط¹ط§ظ„ط¬ط© ظ‡ط°ط§ ط§ظ„ط·ظ„ط¨ ظ…ط³ط¨ظ‚ط§ظ‹ ط¨ظˆط§ط³ط·ط© ظ…ط¯ظٹط± ط¢ط®ط±."); return; }
        const d = updated.rows[0];
        await adjustBalance(d.user_id, n);
        await clearDepositForOtherAdmins(ctx.from.id, step.depositId, `âœ… ط·ظ„ط¨ ط¥ظٹط¯ط§ط¹ â€” طھظ…طھ ط§ظ„ظ…ظˆط§ظپظ‚ط© (+${n}$)`);
        setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(`âœ… طھظ…طھ ط¥ط¶ط§ظپط© ${n}$ ظ„ظ„ظ…ط³طھط®ط¯ظ… ${d.user_id}.`);
        // â”€â”€ ط±ط³ط§ظ„ط© ظˆط§ط¶ط­ط© ظ„ظ„ظ…ط³طھط®ط¯ظ… ط¨ط¯ظˆظ† ط±ظ‚ظ… ط·ظ„ط¨ â”€â”€
        try { await ctx.telegram.sendMessage(d.user_id, `âœ… طھظ… ظ‚ط¨ظˆظ„ ط·ظ„ط¨ ط¥ظٹط¯ط§ط¹ظƒطŒ ظˆطھظ…طھ ط¥ط¶ط§ظپط© ${n}$ ط¥ظ„ظ‰ ط±طµظٹط¯ظƒ.`); } catch { /* ignore */ }
        return;
      }
      case "admin:userBalance": {
        const n = Number(txt); if (!Number.isFinite(n) || n <= 0) { await ctx.reply("âڑ ï¸ڈ ط£ط¯ط®ظ„ ظ…ط¨ظ„ط؛ط§ظ‹ طµط§ظ„ط­ط§ظ‹."); return; }
        const delta = step.mode === "add" ? n : -n; await adjustBalance(step.userId, delta); setStep(ctx.from.id, { kind: "idle" });
        const u = await getUser(step.userId); await ctx.reply(`âœ… طھظ… ط§ظ„طھط¹ط¯ظٹظ„. ط§ظ„ط±طµظٹط¯ ط§ظ„ط¬ط¯ظٹط¯: ${u ? Number(u.balance).toFixed(2) : "?"}$`);
        try { await ctx.telegram.sendMessage(step.userId, step.mode === "add" ? `ًں’° طھظ…طھ ط¥ط¶ط§ظپط© ${n}$ ط¥ظ„ظ‰ ط±طµظٹط¯ظƒ.` : `ًں’¸ طھظ… ط®طµظ… ${n}$ ظ…ظ† ط±طµظٹط¯ظƒ.`); } catch { /* ignore */ }
        return;
      }
      case "admin:findUser": { const found = await searchUser(txt); setStep(ctx.from.id, { kind: "idle" }); if (!found.length) { await ctx.reply("âڑ ï¸ڈ ظ„ط§ ظٹظˆط¬ط¯ ظ†طھط§ط¦ط¬."); return; } const kb = found.map(u => [Markup.button.callback(`${u.first_name ?? "â€”"}${u.username ? " @" + u.username : ""} â€¢ ${Number(u.balance).toFixed(2)}$`, `adm:user:${u.id}`)]); kb.push([Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "admin:menu")]); await ctx.reply(`ظ†طھط§ط¦ط¬ (${found.length}):`, Markup.inlineKeyboard(kb)); return; }
      case "admin:editPrice": {
        if (txt.toLowerCase() === "reset") {
          await q("INSERT INTO product_overrides(product_id,product_name) VALUES($1,$2) ON CONFLICT(product_id) DO UPDATE SET custom_markup_percent=NULL, custom_price_usd=NULL, updated_at=NOW()", [step.productId, step.productName]);
          invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ…طھ ط¥ط¹ط§ط¯ط© ط§ظ„ط³ط¹ط± ظ„ظ„ط§ظپطھط±ط§ط¶ظٹ."); return;
        }
        const m = txt.match(/^([%$])\s*(-?\d+(\.\d+)?)$/);
        if (!m) { await ctx.reply("âڑ ï¸ڈ طµظٹط؛ط© ط؛ظٹط± طµط­ظٹط­ط©. ظ…ط«ط§ظ„: `%5` ط£ظˆ `$2.5`."); return; }
        const v = Number(m[2]);
        if (m[1] === "%") await q("INSERT INTO product_overrides(product_id,product_name,custom_markup_percent) VALUES($1,$2,$3) ON CONFLICT(product_id) DO UPDATE SET custom_markup_percent=$3, custom_price_usd=NULL, updated_at=NOW()", [step.productId, step.productName, String(v)]);
        else await q("INSERT INTO product_overrides(product_id,product_name,custom_price_usd) VALUES($1,$2,$3) ON CONFLICT(product_id) DO UPDATE SET custom_price_usd=$3, custom_markup_percent=NULL, updated_at=NOW()", [step.productId, step.productName, String(v)]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`âœ… طھظ… ط­ظپط¸ ط§ظ„ط³ط¹ط±.`); return;
      }
      case "admin:editProductInstructions": {
        const value = txt.toLowerCase() === "clear" ? null : txt;
        await q("INSERT INTO product_overrides(product_id,product_name,instructions) VALUES($1,$2,$3) ON CONFLICT(product_id) DO UPDATE SET instructions=$3, updated_at=NOW()", [step.productId, step.productName, value]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(value ? "âœ… طھظ… ط­ظپط¸ ط§ظ„طھط¹ظ„ظٹظ…ط§طھ." : "âœ… طھظ… ظ…ط³ط­ ط§ظ„طھط¹ظ„ظٹظ…ط§طھ."); return;
      }
      case "admin:renameProduct": {
        const value = txt.toLowerCase() === "reset" ? null : txt;
        await q("INSERT INTO product_overrides(product_id,product_name,custom_name) VALUES($1,$2,$3) ON CONFLICT(product_id) DO UPDATE SET custom_name=$3, updated_at=NOW()", [step.productId, step.productName, value]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(value ? `âœ… طھظ… طھط؛ظٹظٹط± ط§ظ„ط§ط³ظ… ط¥ظ„ظ‰ "${value}".` : "âœ… طھظ…طھ ط¥ط¹ط§ط¯ط© ط§ظ„ط§ط³ظ… ظ„ظ„ط§ظپطھط±ط§ط¶ظٹ."); return;
      }
      case "admin:moveProduct": {
        if (txt.toLowerCase() === "reset") {
          await q("INSERT INTO product_overrides(product_id,product_name) VALUES($1,$2) ON CONFLICT(product_id) DO UPDATE SET custom_category_id=NULL, updated_at=NOW()", [step.productId, step.productName]);
          invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ…طھ ط¥ط¹ط§ط¯ط© ط§ظ„ظ…ظ†طھط¬ ظ„ظ‚ط³ظ…ظ‡ ط§ظ„ط£طµظ„ظٹ."); return;
        }
        const catId = Number(txt); if (!Number.isFinite(catId)) { await ctx.reply("âڑ ï¸ڈ ط±ظ‚ظ… ط§ظ„ظ‚ط³ظ… ط؛ظٹط± طµط§ظ„ط­."); return; }
        await q("INSERT INTO product_overrides(product_id,product_name,custom_category_id) VALUES($1,$2,$3) ON CONFLICT(product_id) DO UPDATE SET custom_category_id=$3, updated_at=NOW()", [step.productId, step.productName, catId]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`âœ… طھظ… ظ†ظ‚ظ„ ط§ظ„ظ…ظ†طھط¬ ط¥ظ„ظ‰ ط§ظ„ظ‚ط³ظ… ${catId}.`); return;
      }
      case "admin:editCategoryName": {
        const value = txt.toLowerCase() === "reset" ? null : txt;
        await q("INSERT INTO category_overrides(category_id,custom_name) VALUES($1,$2) ON CONFLICT(category_id) DO UPDATE SET custom_name=$2, updated_at=NOW()", [step.categoryId, value]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(value ? `âœ… طھظ… طھط؛ظٹظٹط± ط§ط³ظ… ط§ظ„ظ‚ط³ظ….` : "âœ… طھظ…طھ ط¥ط¹ط§ط¯ط© ط§ط³ظ… ط§ظ„ظ‚ط³ظ…."); return;
      }
      case "admin:setCatMarkup": {
        if (txt.toLowerCase() === "reset") {
          await q("INSERT INTO category_overrides(category_id) VALUES($1) ON CONFLICT(category_id) DO UPDATE SET custom_markup_percent=NULL, updated_at=NOW()", [step.categoryId]);
          invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ…طھ ط¥ط¹ط§ط¯ط© ظ†ط³ط¨ط© ط§ظ„ظ‚ط³ظ… ظ„ظ„ط§ظپطھط±ط§ط¶ظٹ."); return;
        }
        const n = Number(txt); if (!Number.isFinite(n) || n < 0) { await ctx.reply("âڑ ï¸ڈ ظ†ط³ط¨ط© ط؛ظٹط± طµط§ظ„ط­ط©."); return; }
        await q("INSERT INTO category_overrides(category_id,custom_markup_percent) VALUES($1,$2) ON CONFLICT(category_id) DO UPDATE SET custom_markup_percent=$2, updated_at=NOW()", [step.categoryId, String(n)]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`âœ… ظ†ط³ط¨ط© ط§ظ„ظ‚ط³ظ…: ${n}%.`); return;
      }
      case "admin:setCatSort": {
        if (txt.toLowerCase() === "reset") {
          await q("INSERT INTO category_overrides(category_id) VALUES($1) ON CONFLICT(category_id) DO UPDATE SET sort_order=NULL, updated_at=NOW()", [step.categoryId]);
          invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ…طھ ط¥ط¹ط§ط¯ط© ط§ظ„طھط±طھظٹط¨."); return;
        }
        const n = Number(txt); if (!Number.isFinite(n)) { await ctx.reply("âڑ ï¸ڈ ط±ظ‚ظ… ط؛ظٹط± طµط§ظ„ط­."); return; }
        await q("INSERT INTO category_overrides(category_id,sort_order) VALUES($1,$2) ON CONFLICT(category_id) DO UPDATE SET sort_order=$2, updated_at=NOW()", [step.categoryId, n]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`âœ… طھظ… طھط¹ظٹظٹظ† ط§ظ„طھط±طھظٹط¨: ${n}.`); return;
      }
      case "admin:moveCatAll": {
        if (txt.toLowerCase() === "cancel") { setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("â‌Œ طھظ… ط§ظ„ط¥ظ„ط؛ط§ط،."); return; }
        const targetCatId = Number(txt); if (!Number.isFinite(targetCatId)) { await ctx.reply("âڑ ï¸ڈ ط±ظ‚ظ… ط§ظ„ظ‚ط³ظ… ط؛ظٹط± طµط§ظ„ط­."); return; }
        const all = await getCachedProducts();
        const toMove = all.filter(p => p.parent_id === step.sourceCategoryId);
        let moved = 0;
        for (const p of toMove) {
          await q("INSERT INTO product_overrides(product_id,product_name,custom_category_id) VALUES($1,$2,$3) ON CONFLICT(product_id) DO UPDATE SET custom_category_id=$3, updated_at=NOW()", [p.id, p.name, targetCatId]);
          moved++;
        }
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`âœ… طھظ… ظ†ظ‚ظ„ ${moved} ظ…ظ†طھط¬ ط¥ظ„ظ‰ ط§ظ„ظ‚ط³ظ… ${targetCatId}.`); return;
      }
      case "admin:moveCatToParent": {
        if (txt.toLowerCase() === "cancel") { setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("â‌Œ طھظ… ط§ظ„ط¥ظ„ط؛ط§ط،."); return; }
        const targetParent = Number(txt);
        if (!Number.isFinite(targetParent)) { await ctx.reply("âڑ ï¸ڈ ط±ظ‚ظ… ط§ظ„ظ‚ط³ظ… ط؛ظٹط± طµط§ظ„ط­. ط£ط±ط³ظ„ 0 ظ„ظ„ط¬ط°ط± ط£ظˆ ط±ظ‚ظ… ط§ظ„ظ‚ط³ظ…."); return; }
        const parentVal = targetParent === 0 ? null : targetParent;
        await q("INSERT INTO category_overrides(category_id,custom_parent_id) VALUES($1,$2) ON CONFLICT(category_id) DO UPDATE SET custom_parent_id=$2, updated_at=NOW()", [step.categoryId, parentVal]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(parentVal ? `âœ… طھظ… ظ†ظ‚ظ„ ط§ظ„ظ‚ط³ظ… ط¥ظ„ظ‰ ط¯ط§ط®ظ„ ط§ظ„ظ‚ط³ظ… ${parentVal}.` : `âœ… طھظ… ظ†ظ‚ظ„ ط§ظ„ظ‚ط³ظ… ط¥ظ„ظ‰ ط§ظ„ظ…ط³طھظˆظ‰ ط§ظ„ط±ط¦ظٹط³ظٹ.`); return;
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
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`âœ… طھظ… ط§ظ„ط¥ط±ط³ط§ظ„ ظ„ظ€ ${sent} ظ…ط³طھط®ط¯ظ….`); return;
      }
      case "admin:addMethod:name": { setStep(ctx.from.id, { kind: "admin:addMethod:id", name: txt }); await ctx.reply("ًں”‘ ط£ط±ط³ظ„ ط§ظ„ظ…ط¹ط±ظپ/ط§ظ„ط±ظ‚ظ…:"); return; }
      case "admin:addMethod:id": { setStep(ctx.from.id, { kind: "admin:addMethod:instr", name: step.name, identifier: txt }); await ctx.reply("ًں“‹ ط£ط±ط³ظ„ ط§ظ„طھط¹ظ„ظٹظ…ط§طھ:"); return; }
      case "admin:addMethod:instr": {
        setStep(ctx.from.id, { kind: "admin:addMethod:photo", name: step.name, identifier: step.identifier, instructions: txt });
        await ctx.reply("ًں–¼ ط£ط±ط³ظ„ طµظˆط±ط© ظ„ط·ط±ظٹظ‚ط© ط§ظ„ط¥ظٹط¯ط§ط¹ ط£ظˆ ط§ظƒطھط¨ *skip* ظ„طھط®ط·ظ‘ظٹ:", { parse_mode: "Markdown" }); return;
      }
      case "admin:addMethod:photo": {
        if (txt.toLowerCase() === "skip") {
          await q("INSERT INTO deposit_methods(name,identifier,instructions) VALUES($1,$2,$3)", [step.name, step.identifier, step.instructions]);
          setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ… ط¥ط¶ط§ظپط© ط·ط±ظٹظ‚ط© ط§ظ„ط¥ظٹط¯ط§ط¹ ط¨ط¯ظˆظ† طµظˆط±ط©."); return;
        }
        await ctx.reply("âڑ ï¸ڈ ط£ط±ط³ظ„ طµظˆط±ط© ط£ظˆ ط§ظƒطھط¨ *skip* ظ„طھط®ط·ظ‘ظٹ.", { parse_mode: "Markdown" }); return;
      }
      case "admin:editMethodInstructions": {
        await q("UPDATE deposit_methods SET instructions=$1 WHERE id=$2", [txt, step.methodId]);
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ… طھط­ط¯ظٹط« ط§ظ„طھط¹ظ„ظٹظ…ط§طھ."); return;
      }
      case "admin:addContact:name": { setStep(ctx.from.id, { kind: "admin:addContact:link", name: txt }); await ctx.reply("ًں”— ط£ط±ط³ظ„ ط§ظ„ط±ط§ط¨ط· ط£ظˆ @username:"); return; }
      case "admin:addContact:link": {
        await q("INSERT INTO contact_links(name,link) VALUES($1,$2)", [step.name, txt]);
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ… ط¥ط¶ط§ظپط© ظˆط³ظٹظ„ط© ط§ظ„طھظˆط§طµظ„."); return;
      }
      case "admin:addVirtualCategory:name": {
        const pos = (await q("SELECT COALESCE(MAX(position),0)+1 AS p FROM virtual_categories WHERE parent_id=$1", [step.parentId ?? 0])).rows[0]?.p ?? 1;
        await q("INSERT INTO virtual_categories(name,parent_id,position) VALUES($1,$2,$3)", [txt, step.parentId ?? 0, pos]);
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ… ط¥ط¶ط§ظپط© ط§ظ„ظ‚ط³ظ… ط§ظ„ظ…ط®طµطµ."); return;
      }
      case "admin:editVCatName": {
        await q("UPDATE virtual_categories SET name=$1, updated_at=NOW() WHERE id=$2", [txt, step.vcId]);
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ… طھط؛ظٹظٹط± ط§ط³ظ… ط§ظ„ظ‚ط³ظ…."); return;
      }
      case "admin:addManualProduct:name": { setStep(ctx.from.id, { kind: "admin:addManualProduct:price", name: txt }); await ctx.reply("ًں’µ ط£ط±ط³ظ„ ط§ظ„ط³ط¹ط± ط¨ط§ظ„ط¯ظˆظ„ط§ط±:"); return; }
      case "admin:addManualProduct:price": {
        const price = Number(txt); if (!Number.isFinite(price) || price < 0) { await ctx.reply("âڑ ï¸ڈ ط³ط¹ط± ط؛ظٹط± طµط§ظ„ط­."); return; }
        await q("INSERT INTO manual_products(name,price_usd) VALUES($1,$2)", [step.name, String(price)]);
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ… ط¥ط¶ط§ظپط© ط§ظ„ظ…ظ†طھط¬ ط§ظ„ظٹط¯ظˆظٹ."); return;
      }
      case "admin:manualOrderAccept": {
        const delivery = txt.toLowerCase() === "skip" ? null : txt;
        await q("UPDATE manual_orders SET status='accepted', admin_note=$1, updated_at=NOW() WHERE id=$2", [delivery, step.orderId]);
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ… ظ‚ط¨ظˆظ„ ط§ظ„ط·ظ„ط¨.");
        if (step.userId) {
          // â”€â”€ ظ„ط§ ظ†ط¹ط±ط¶ ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨ ظ„ظ„ظ…ط³طھط®ط¯ظ… â”€â”€
          const msg = delivery ? `âœ… طھظ… طھظ†ظپظٹط° ط·ظ„ط¨ظƒ\nًں›’ ${step.productName}\n\nًں“¦ ${delivery}` : `âœ… طھظ… طھظ†ظپظٹط° ط·ظ„ط¨ظƒ\nًں›’ ${step.productName}`;
          await ctx.telegram.sendMessage(step.userId, msg, Markup.inlineKeyboard([[Markup.button.callback("ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]])).catch(() => {});
        }
        return;
      }
      case "admin:manualOrderMsg": {
        if (step.userId) await ctx.telegram.sendMessage(step.userId, `ًں“© ط±ط³ط§ظ„ط© ظ…ظ† ط§ظ„ط¥ط¯ط§ط±ط©:\n${txt}`).catch(() => {});
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ… ط¥ط±ط³ط§ظ„ ط§ظ„ط±ط³ط§ظ„ط©."); return;
      }
      case "admin:setUserMarkup": {
        if (txt.toLowerCase() === "reset") {
          await setUserMarkup(step.userId, null);
          setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ…طھ ط¥ط¹ط§ط¯ط© ظ†ط³ط¨ط© ط§ظ„ظ…ط³طھط®ط¯ظ… ظ„ظ„ط§ظپطھط±ط§ط¶ظٹ."); return;
        }
        const n = Number(txt); if (!Number.isFinite(n) || n < 0) { await ctx.reply("âڑ ï¸ڈ ظ†ط³ط¨ط© ط؛ظٹط± طµط§ظ„ط­ط©."); return; }
        await setUserMarkup(step.userId, n); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`âœ… ظ†ط³ط¨ط© ط±ط¨ط­ ط§ظ„ظ…ط³طھط®ط¯ظ…: ${n}%.`); return;
      }
      case "admin:pingTarget": { await setSetting("auto_ping_target_user_id", txt.replace(/\D/g, "")); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ… طھط¹ظٹظٹظ† ط§ظ„ظ‡ط¯ظپ."); return; }
      case "admin:pingInterval": { const n = Number(txt); if (!Number.isFinite(n) || n < 1) { await ctx.reply("âڑ ï¸ڈ ط±ظ‚ظ… ط؛ظٹط± طµط§ظ„ط­."); return; } await setSetting("auto_ping_interval_min", String(n)); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`âœ… ط§ظ„ظپط§طµظ„: ${n} ط¯ظ‚ظٹظ‚ط©.`); return; }
      case "admin:editBtnLabel": { await setSetting(step.key, txt); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ… طھط­ط¯ظٹط« ط§ظ„ط²ط±."); return; }
      case "admin:aiSupport": {
        if (txt === "ط®ط±ظˆط¬" || txt === "exit") { clearAiHistory(ctx.from.id); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("ًں‘‹ طھظ… ط¥ظ†ظ‡ط§ط، ط¬ظ„ط³ط© ط§ظ„ط°ظƒط§ط، ط§ظ„ط§طµط·ظ†ط§ط¹ظٹ."); return; }
        const reply = await callAiSupport(ctx.from.id, txt);
        await ctx.reply(reply, { parse_mode: "Markdown" }); return;
      }
      default: return next();
    }
  });

  bot.catch((err, ctx) => { console.error("Telegraf error:", err?.message ?? err); });

  await bot.telegram.setMyCommands([
    { command: "start", description: "ًںڑ€ ط¨ط¯ط،" },
    { command: "menu", description: "ًں“‹ ط§ظ„ظ‚ط§ط¦ظ…ط©" },
    { command: "balance", description: "ًں’° ط±طµظٹط¯ظٹ" },
    { command: "deposit", description: "ًں’³ ط¥ظٹط¯ط§ط¹" },
    { command: "orders", description: "ًں“¦ ط·ظ„ط¨ط§طھظٹ" },
    { command: "support", description: "ًں“‍ ط§ظ„ط¯ط¹ظ…" },
  ]);

  // â”€â”€ طھط³ط®ظٹظ† ط§ظ„ظƒط§ط´ ظ…ط¨ظƒط±ط§ظ‹ ظ„طھط³ط±ظٹط¹ ط£ظˆظ„ ط§ط³طھط¬ط§ط¨ط© â”€â”€
  getCachedProducts().catch(() => {}); getAllOverridesCached().catch(() => {}); getCachedContent(0).catch(() => {});
  startBackgroundRefresher();

  const webhookUrl = process.env.WEBHOOK_URL;
  if (webhookUrl) {
    await bot.telegram.setWebhook(`${webhookUrl}/bot${token}`);
    console.log(`âœ… Webhook set: ${webhookUrl}/bot${token}`);
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

  setInterval(() => {
    const port = Number(process.env.PORT ?? "3000");
    const req = http.get({ hostname: "localhost", port, path: "/health", timeout: 5000 }, () => {});
    req.on("error", () => {}); req.end();
  }, 4 * 60_000).unref();

  console.log("âœ… ط§ظ„ط¨ظˆطھ ظٹط¹ظ…ظ„ ط¨ظ†ط¬ط§ط­! (v2.3)");
  return bot;
}

// â”€â”€ Express health server + webhook receiver â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const app = express();
const PORT = Number(process.env.PORT ?? 3000);
app.use(express.json());
app.get("/", (_, res) => res.send("OK"));
app.get("/health", (_, res) => res.json({ status: "ok", time: new Date().toISOString(), version: "2.3" }));
app.get("/api/healthz", (_, res) => res.json({ status: "ok" }));
app.get("/api/source", (_, res) => res.download(__dirname + "/bot.js", "bot.js"));

app.post(/^\/bot.+/, (req, res) => {
  if (_botRef) {
    _botRef.handleUpdate(req.body, res).catch(err => { console.error("webhook error:", err); res.sendStatus(500); });
  } else {
    res.sendStatus(200);
  }
});

// â”€â”€ Start â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const server = http.createServer(app);
server.listen(PORT, () => console.log(`ًںڑ€ Server on port ${PORT}`));
startBot().then(bot => { _botRef = bot; }).catch(err => { console.error("Failed to start:", err); process.exit(1); });
