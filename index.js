// ============================================================
//  ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬  ط£آ¢أ¢â€ڑآ¬أ¢â‚¬â€Œ ط·آ·ط¢آ¨ط·آ¸ط«â€ ط·آ·ط¹آ¾ ط·آ·ط¹آ¾ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ¬ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ v2.3 (ط·آ·ط¢آ¥ط·آ·ط¢آµط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ­ ط·آ·ط¢آ´ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬â€چ)
//  ط·آ·ط¢آ¥ط·آ·ط¢آµط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ·ط¹آ¾: ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط·إ’ط·آ·ط¥â€™ ط·آ·ط¹آ¾ط·آ·ط¢آ¯ط·آ¸ط¸آ¾ط·آ¸أ¢â‚¬ع‘ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹ط·آ·ط¥â€™ ط·آ·ط¢آ¥ط·آ·ط¢آ²ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾
// ============================================================
"use strict";

const { Telegraf, Markup } = require("telegraf");
const { Pool } = require("pg");
const axios = require("axios");
const express = require("express");
const http = require("http");
const https = require("https");
const crypto = require("crypto");
const { TextDecoder } = require("util");

// ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ENV check ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
if (!process.env.DATABASE_URL) {
  console.error("ط£آ¢أ¢â‚¬إ’ط¥â€™ DATABASE_URL is required");
  process.exit(1);
}

// ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ DB pool ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ­ط·آ·ط¢آ³ط·آ¸أ¢â‚¬ع©ط·آ¸أ¢â‚¬  ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
const _dbUrl = process.env.DATABASE_URL;
const _needSSL = _dbUrl.includes("railway") || _dbUrl.includes("neon") || _dbUrl.includes("supabase");
const pool = new Pool({
  connectionString: _dbUrl,
  ssl: _needSSL ? { rejectUnauthorized: false } : false,
  max: 10,
  min: 2,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  query_timeout: 8_000,
  statement_timeout: 8_000,
  // ط·آ·ط¢آ¥ط·آ·ط¢آ¬ط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¢آ± PostgreSQL ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ UTF-8 ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ·ط¹آ¾ط·آ·ط¢آµط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چ
  options: "-c client_encoding=UTF8",
});
pool.on("error", err => console.error("PostgreSQL pool error:", err?.message ?? err));

async function q(text, params = []) {
  const client = await pool.connect();
  try { return await client.query(text, params); }
  finally { client.release(); }
}

// ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Create tables if not exist ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
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
      deleted BOOLEAN NOT NULL DEFAULT false,
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
    CREATE TABLE IF NOT EXISTS admin_messages (
      id SERIAL PRIMARY KEY,
      admin_id BIGINT NOT NULL,
      user_id BIGINT NOT NULL,
      message TEXT NOT NULL,
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
    CREATE INDEX IF NOT EXISTS manual_categories_parent_idx ON manual_categories(parent_id);
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
    CREATE TABLE IF NOT EXISTS api_sources (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      base_url TEXT NOT NULL,
      token_encrypted TEXT,
      active BOOLEAN NOT NULL DEFAULT true,
      is_primary BOOLEAN NOT NULL DEFAULT false,
      last_sync_at TIMESTAMPTZ,
      last_sync_error TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS cached_categories (
      id BIGINT PRIMARY KEY,
      source_id INTEGER NOT NULL,
      external_id TEXT NOT NULL,
      name TEXT NOT NULL,
      parent_id BIGINT NOT NULL DEFAULT 0,
      raw JSONB NOT NULL DEFAULT '{}',
      active BOOLEAN NOT NULL DEFAULT true,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(source_id, external_id)
    );
    CREATE TABLE IF NOT EXISTS cached_products (
      id BIGINT PRIMARY KEY,
      source_id INTEGER NOT NULL,
      external_id TEXT NOT NULL,
      name TEXT NOT NULL,
      parent_id BIGINT NOT NULL DEFAULT 0,
      category_name TEXT,
      price NUMERIC(14,6),
      available BOOLEAN NOT NULL DEFAULT true,
      qty_values JSONB,
      params JSONB,
      raw JSONB NOT NULL DEFAULT '{}',
      deleted BOOLEAN NOT NULL DEFAULT false,
      last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(source_id, external_id)
    );
    CREATE INDEX IF NOT EXISTS cached_products_parent_idx ON cached_products(parent_id);
    CREATE INDEX IF NOT EXISTS cached_products_source_idx ON cached_products(source_id);
  `);

  await q(`ALTER TABLE category_overrides ADD COLUMN IF NOT EXISTS custom_parent_id INTEGER`).catch(() => {});
  await q(`ALTER TABLE deposit_methods ADD COLUMN IF NOT EXISTS image_file_id TEXT`).catch(() => {});
  await q(`ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_session_active BOOLEAN NOT NULL DEFAULT false`).catch(() => {});
  await q(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS api_source_id INTEGER`).catch(() => {});
  await q(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS external_order_id TEXT`).catch(() => {});
  await q(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS external_product_id TEXT`).catch(() => {});
  await q(`ALTER TABLE product_overrides ADD COLUMN IF NOT EXISTS deleted BOOLEAN NOT NULL DEFAULT false`).catch(() => {});
  await q(`ALTER TABLE product_overrides ALTER COLUMN product_id TYPE BIGINT USING product_id::bigint`).catch(() => {});
  await q(`ALTER TABLE orders ALTER COLUMN product_id TYPE BIGINT USING product_id::bigint`).catch(() => {});
}

// ============================================================
//  SETTINGS
// ============================================================
const settingsCache = new Map();
let _settingsCacheExpiry = 0;
let _settingsInFlight = null;
const SETTINGS_TTL = 2 * 60_000; // 2 ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬ع‘ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ©

const DEFAULTS = {
  markup_percent: "3",
  exchange_rate: "132",
  bot_status: "on",
  currency_label: "ظ„.ط³",
  excluded_category_ids: "6,81,561",
  excluded_product_keywords: "ط·آ³ط¸ظ¹ط·آ±ط·ع¾ط¸â€‍ ط¸ئ’ط·آ§ط·آ´,ط·آ³ط¸ظ¹ط·آ±ط¸ظ¹ط·ع¾ط¸â€‍ ط¸ئ’ط·آ§ط·آ´,syriatel cash,mtn ط¸ئ’ط·آ§ط·آ´,mtn cash,ط·آ§ط¸â€¦ ط·ع¾ط¸ظ¹ ط·آ§ط¸â€  ط¸ئ’ط·آ§ط·آ´",
  social_markup_percent: "3",
  social_min_qty: "500",
  social_max_qty: "10000",
  social_keywords: "ط·آ³ط¸ث†ط·آ´ط¸â€‍,social,ط·ع¾ط¸ث†ط·آ§ط·آµط¸â€‍ ط·آ§ط·آ¬ط·ع¾ط¸â€¦ط·آ§ط·آ¹ط¸ظ¹,ط·آ§ط·آ¬ط·ع¾ط¸â€¦ط·آ§ط·آ¹ط¸ظ¹,ط·آ§ط¸â€ ط·آ³ط·ع¾ط·ط›ط·آ±ط·آ§ط¸â€¦,instagram,ط·ع¾ط¸ظ¹ط¸ئ’ ط·ع¾ط¸ث†ط¸ئ’,tiktok,ط¸ظ¾ط¸ظ¹ط·آ³ط·آ¨ط¸ث†ط¸ئ’,facebook,ط·ع¾ط¸ث†ط¸ظ¹ط·ع¾ط·آ±,twitter,ط¸ظ¹ط¸ث†ط·ع¾ط¸ظ¹ط¸ث†ط·آ¨,youtube,ط·ع¾ط¸â€‍ط·ط›ط·آ±ط·آ§ط¸â€¦,telegram,ط·آ³ط¸â€ ط·آ§ط·آ¨,snap",
  ai_keywords: "ط·آ°ط¸ئ’ط·آ§ط·طŒ ط·آ§ط·آµط·آ·ط¸â€ ط·آ§ط·آ¹ط¸ظ¹,chatgpt,gpt,openai,claude,gemini,midjourney,perplexity,ai ",
  admin_password: "0941408061@0941408061aM",
  admin_login_command: "Abdulmalik Marai 1122334455",
  auto_ping_enabled: "off",
  auto_ping_interval_min: "5",
  auto_ping_target_user_id: "",
  auto_ping_last_sent: "0",
  btn_back_label: "أ¢آ¬â€¦أ¯آ¸عˆ ط·آ±ط·آ¬ط¸ث†ط·آ¹",
  btn_home_label: "ظ‹ع؛عˆ  ط·آ§ط¸â€‍ط·آ±ط·آ¦ط¸ظ¹ط·آ³ط¸ظ¹ط·آ©",
  btn_prev_label: "أ¢آ¬â€¦أ¯آ¸عˆ ط·آ§ط¸â€‍ط·آ³ط·آ§ط·آ¨ط¸â€ڑ",
  btn_next_label: "ط·آ§ط¸â€‍ط·ع¾ط·آ§ط¸â€‍ط¸ظ¹ أ¢â€چطŒأ¯آ¸عˆ",
};

// Canonical UTF-8 defaults. These override legacy mojibake literals above
// before defaults are inserted into or repaired in the database.
Object.assign(DEFAULTS, {
  currency_label: "ظ„.ط³",
  excluded_product_keywords: "ط³ظٹط±ظٹطھظ„ ظƒط§ط´,ط³ظٹط±ظٹطھظ„ ظƒط§ط´,syriatel cash,mtn ظƒط§ط´,mtn cash,ط§ظ… طھظٹ ط§ظ† ظƒط§ط´",
  social_keywords: "ط³ظˆط´ط§ظ„,social,طھظˆط§طµظ„ ط§ط¬طھظ…ط§ط¹ظٹ,ط§ط¬طھظ…ط§ط¹ظٹ,ط§ظ†ط³طھط؛ط±ط§ظ…,instagram,طھظٹظƒ طھظˆظƒ,tiktok,ظپظٹط³ط¨ظˆظƒ,facebook,طھظˆظٹطھط±,twitter,ظٹظˆطھظٹظˆط¨,youtube,طھظ„ط؛ط±ط§ظ…,telegram,ط³ظ†ط§ط¨,snap",
  ai_keywords: "ط°ظƒط§ط، ط§طµط·ظ†ط§ط¹ظٹ,chatgpt,gpt,openai,claude,gemini,midjourney,perplexity,ai ",
  btn_back_label: "â¬…ï¸ڈ ط±ط¬ظˆط¹",
  btn_home_label: "ًںڈ  ط§ظ„ط±ط¦ظٹط³ظٹط©",
  btn_prev_label: "â¬…ï¸ڈ ط§ظ„ط³ط§ط¨ظ‚",
  btn_next_label: "ط§ظ„طھط§ظ„ظٹ â‍،ï¸ڈ",
});

async function loadAllSettings() {
  if (_settingsInFlight) return _settingsInFlight;
  _settingsInFlight = (async () => {
  const res = await q("SELECT key, value FROM bot_settings");
  settingsCache.clear();
  for (const r of res.rows) settingsCache.set(r.key, r.value);
  })().finally(() => { _settingsInFlight = null; });
  return _settingsInFlight;
}

async function ensureDefaults() {
  await loadAllSettings();
  for (const [k, v] of Object.entries(DEFAULTS)) {
    if (!settingsCache.has(k)) {
      await q("INSERT INTO bot_settings(key,value) VALUES($1,$2) ON CONFLICT DO NOTHING", [k, v]);
      settingsCache.set(k, v);
    }
  }
  // Repair only known display/filter settings from older mojibake versions.
  // Secrets, login commands, and user-entered values are never rewritten here.
  const repairableKeys = new Set([
    "currency_label", "excluded_product_keywords", "social_keywords",
    "ai_keywords", "btn_back_label", "btn_home_label", "btn_prev_label",
    "btn_next_label",
  ]);
  for (const key of repairableKeys) {
    const current = settingsCache.get(key);
    const repaired = repairArabicEncoding(current);
    if (current != null && repaired !== current) {
      await q("UPDATE bot_settings SET value=$1,updated_at=NOW() WHERE key=$2", [repaired, key]);
      settingsCache.set(key, repaired);
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
  _settingsCacheExpiry = Date.now() + SETTINGS_TTL; // ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¦â€™ط·آ·ط¢آ§ط·آ·ط¢آ´ ط·آ·ط¢آ¨ط·آ·ط¢آ¹ط·آ·ط¢آ¯ ط·آ·ط¢آ£ط·آ¸ط¸آ¹ ط·آ·ط¹آ¾ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ«
  await q("INSERT INTO bot_settings(key,value,updated_at) VALUES($1,$2,NOW()) ON CONFLICT(key) DO UPDATE SET value=$2, updated_at=NOW()", [key, value]);
}

async function getMarkupPercent() { const n = Number(await getSetting("markup_percent")); return Number.isFinite(n) ? n : 3; }
async function getExchangeRate() { const n = Number(await getSetting("exchange_rate")); return Number.isFinite(n) && n > 0 ? n : 132; }
async function getBotStatus() { return getSetting("bot_status"); }
async function getExcludedKeywords() { const v = repairArabicEncoding(await getSetting("excluded_product_keywords")); return v.split(",").map(k => k.trim().toLowerCase()).filter(Boolean); }
async function getSocialKeywords() { const v = repairArabicEncoding(await getSetting("social_keywords")); return v.split(",").map(k => k.trim().toLowerCase()).filter(Boolean); }
async function getSocialMarkupPercent() { const n = Number(await getSetting("social_markup_percent")); return Number.isFinite(n) ? n : 3; }
async function getSocialMinQty() { const n = Number(await getSetting("social_min_qty")); return Number.isFinite(n) && n > 0 ? n : 500; }
async function getSocialMaxQty() { const n = Number(await getSetting("social_max_qty")); return Number.isFinite(n) && n > 0 ? n : 10000; }
async function getAdminPassword() { return getSetting("admin_password"); }
async function getAdminLoginCommand() { return getSetting("admin_login_command"); }
async function getBtnBackLabel() { return repairArabicEncoding(await getSetting("btn_back_label")); }
async function getBtnHomeLabel() { return repairArabicEncoding(await getSetting("btn_home_label")); }
async function getBtnPrevLabel() { return repairArabicEncoding(await getSetting("btn_prev_label")); }
async function getBtnNextLabel() { return repairArabicEncoding(await getSetting("btn_next_label")); }

function isSocialProduct(name, catName, kws) {
  const n = ((name ?? "") + " " + (catName ?? "")).toLowerCase();
  return kws.some(k => k && n.includes(k));
}

// ============================================================
//  USER CACHE
// ============================================================
const userCache = new Map();
const USER_CACHE_TTL = 60_000; // 60 ط·آ·ط¢آ«ط·آ·ط¢آ§ط·آ¸أ¢â‚¬ ط·آ¸ط¸آ¹ط·آ·ط¢آ©
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

async function debitBalance(id, amountUsd) {
  const amount = Number(amountUsd);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  invalidateUserCache(id);
  const res = await q(
    "UPDATE users SET balance=balance-$1 WHERE id=$2 AND balance >= $1 RETURNING *",
    [amount, id]
  );
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
      deleted: r.deleted,
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
      deleted: r.deleted,
      instructions: r.instructions,
    });
  }
  return map;
}

function formatBalance(usd, rate) {
  return `${usd.toFixed(2)}$ | ${Math.round(usd * rate).toLocaleString("en-US")} ظ„.ط³`;
}

// ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ·ط¢آ¥ط·آ·ط¢آµط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ­ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ ط·آ·ط¢آµ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ·ط¢آ±ط·آ·ط¢آ¨ط·آ¸ط¸آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ°ط·آ¸ط¸آ¹ ط·آ¸ط¸آ¹ط·آ·ط¢آµط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ£ط·آ·ط¢آ­ط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ·ط¢آ¨ط·آ·ط¹آ¾ط·آ·ط¢آ±ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ² Windows/UTF-8 ط·آ·ط¢آ®ط·آ·ط¢آ§ط·آ·ط¢آ·ط·آ·ط¢آ¦ ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
let cp1256Reverse = null;
let windows1252Reverse = null;
try {
  cp1256Reverse = new Map();
  const decoder = new TextDecoder("windows-1256");
  for (let byte = 0; byte <= 255; byte++) {
    const decoded = decoder.decode(Uint8Array.of(byte));
    if (decoded.length === 1) cp1256Reverse.set(decoded, byte);
  }
  windows1252Reverse = new Map();
  const latinDecoder = new TextDecoder("windows-1252");
  for (let byte = 0; byte <= 255; byte++) {
    const decoded = latinDecoder.decode(Uint8Array.of(byte));
    if (decoded.length === 1) windows1252Reverse.set(decoded, byte);
  }
} catch {
  cp1256Reverse = null;
  windows1252Reverse = null;
}

function repairArabicEncoding(value) {
  if (value == null) return value;
  let text = String(value);
  // Count recognizable mojibake markers, including the shorter
  // "ط·آ§ط¸â€‍" form produced by a single Windows-1256/UTF-8 mistake.
  const mojibakeScore = s => {
    const text = String(s);
    return (
      (text.match(/(?:ط·[آ·آ¸][^ \n]{0,3}|ط·[\u0600-\u06ff]|ط·آ§|[ط£ط¥][آ¢ئ’آ¯]|[أ¢أ°أ¯][^\s]{1,3}|ظ‹ع؛|ط¸â€¹ط¹ط›)/g) || []).length
    );
  };
  const decodeRuns = (input, reverse) => {
    if (!reverse) return input;
    let output = "";
    let run = "";
    const flush = () => {
      if (!run) return;
      const bytes = [];
      for (const char of Array.from(run)) {
        if (char.codePointAt(0) <= 127) bytes.push(char.codePointAt(0));
        else if (reverse.has(char)) bytes.push(reverse.get(char));
        else { output += run; run = ""; return; }
      }
      try {
        const decoded = new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(bytes));
        output += decoded && mojibakeScore(decoded) < mojibakeScore(run) ? decoded : run;
      } catch { output += run; }
      run = "";
    };
    for (const char of Array.from(input)) {
      if (char.codePointAt(0) <= 127 || reverse.has(char)) run += char;
      else { flush(); output += char; }
    }
    flush();
    return output;
  };

  // ط·آ¥ط·آµط¸â€‍ط·آ§ط·آ­ ط·آ§ط¸â€‍ط¸â€ ط·آµط¸ث†ط·آµ ط·آ§ط¸â€‍ط¸â€ڑط·آ¯ط¸ظ¹ط¸â€¦ط·آ© ط·آ§ط¸â€‍ط¸â€¦ط·آ­ط¸ظ¾ط¸ث†ط·آ¸ط·آ© ط·آ¨ط·آ¹ط·آ¯ ط¸ظ¾ط¸ئ’ UTF-8 ط·آ¨ط·ع¾ط·آ±ط¸â€¦ط¸ظ¹ط·آ² Windows-1256/1252.
  for (let i = 0; i < 3; i++) {
    const before = mojibakeScore(text);
    let next = decodeRuns(text, cp1256Reverse);
    next = decodeRuns(next, windows1252Reverse);
    if (mojibakeScore(next) >= before) break;
    text = next;
  }

  // ط·آ¨ط·آ¹ط·آ¶ ط·آ§ط¸â€‍ط·آ±ط¸â€¦ط¸ث†ط·آ² ط·آ§ط¸â€‍ط¸â€ڑط·آ¯ط¸ظ¹ط¸â€¦ط·آ© ط·ع¾ط·آ¶ط·آ±ط·آ±ط·ع¾ ط¸â€¦ط·آ¹ ط¸â€¦ط·آ­ط·آ¯ط·آ¯ ط·ع¾ط¸â€ ط·آ³ط¸ظ¹ط¸â€ڑ emojiط·â€؛ ط·آ§ط·آ³ط·ع¾ط·آ¨ط·آ¯ط·آ§ط¸â€‍ط¸â€،ط·آ§ ط¸â€‍ط·آ§ ط¸ظ¹ط·آ¤ط·آ«ط·آ± ط·آ¹ط¸â€‍ط¸â€° ط·آ§ط¸â€‍ط¸â€ ط·آµ ط·آ§ط¸â€‍ط·آ¹ط·آ±ط·آ¨ط¸ظ¹ ط·آ§ط¸â€‍ط·آµط·آ­ط¸ظ¹ط·آ­.
  const emojiFixes = {
    "ط¸â€¹ط¹ط›ط¹ث†": "ًںڈ ", "ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢": "ظ‹ع؛â€؛â€™", "ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ°": "ظ‹ع؛â€™آ°", "ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ³": "ظ‹ع؛â€™آ³", "ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ¦": "ظ‹ع؛â€œآ¦",
    "ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع‘": "ظ‹ع؛â€œâ€ڑ", "ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬آ¹": "ظ‹ع؛â€œâ€¹", "ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬ع©": "ظ‹ع؛â€‌â€ک", "ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬â€چ": "ظ‹ع؛â€‌â€‍", "ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¥â€™": "ظ‹ع؛â€‌إ’",
    "ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ¥": "ظ‹ع؛â€œآ¥", "ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ£": "ظ‹ع؛â€œآ£", "ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع†": "ظ‹ع؛â€ ع©", "ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¢آ¢": "ظ‹ع؛â€‌آ¢", "ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¢آ§": "ظ‹ع؛â€‌آ§",
    "ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¢آ´": "ظ‹ع؛â€‌آ´", "ط¸â€¹ط¹ط›ط¹ط›ط¢آ¢": "ظ‹ع؛ع؛آ¢", "ط¸â€¹ط¹ط›أ¢â‚¬â€‌أ¢â‚¬ع©": "ظ‹ع؛â€”â€کأ¯آ¸عˆ", "ط¸â€¹ط¹ط›أ¢â‚¬â€Œط«â€ ": "ظ‹ع؛â€‌ث†", "ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬إ’": "ظ‹ع؛â€œâ€Œ",
    "ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آµ": "ظ‹ع؛â€™آµ", "ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ¸": "ظ‹ع؛â€™آ¸", "ط¸â€¹ط¹ط›ط¢آ§ط¢آ¾": "ظ‹ع؛آ§آ¾", "ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¢آ¢": "ظ‹ع؛â€‌آ¢", "ط¸â€¹ط¹ط›ط¥â€™ط¹ط›": "ظ‹ع؛إ’ع؛",
    "ط¸â€¹ط¹ط›أ¢â‚¬ع©ط¢آ¤": "ظ‹ع؛â€کآ¤", "ط¸â€¹ط¹ط›أ¢â‚¬ع©ط¢آ¥": "ظ‹ع؛â€کآ¥", "ط¸â€¹ط¹ط›أ¢â‚¬ع©أ¢â‚¬طŒ": "ظ‹ع؛â€کâ€،", "ط¸â€¹ط¹ط›أ¢â‚¬ع©أ¢â‚¬آ¹": "ظ‹ع؛â€کâ€¹", "ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¹آ¯": "ظ‹ع؛â€‌ع¯",
    "ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ­": "ظ‹ع؛â€œآ­", "ط¸â€¹ط¹ط›أ¢â‚¬إ“ط«â€ ": "ظ‹ع؛â€œث†", "ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬إ’": "ظ‹ع؛â€œâ€Œ", "ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¸آ¾": "ظ‹ع؛â€œإ’", "ط¸â€¹ط¹ط›ط¹ع©ط¢آ¯": "ظ‹ع؛عکآ¯",
    "ط¸â€¹ط¹ط›أ¢â‚¬ط›": "ًں¤–", "ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬إ’": "ظ‹ع؛â€‌â€™", "ط¸â€¹ط¹ط›ط¥طŒ": "ظ‹ع؛ع‘آ«", "ط¸â€¹ط¹ط›ط¹â€ک": "ظ‹ع؛ع‘â€”", "ط¸â€¹ط¹ط›ط¥â€™": "ظ‹ع؛إ’ع¯",
  };
  for (const [bad, good] of Object.entries(emojiFixes)) text = text.split(bad).join(good);
  for (let i = 0; i < 2; i++) {
    const next = decodeRuns(decodeRuns(text, cp1256Reverse), windows1252Reverse);
    if (mojibakeScore(next) >= mojibakeScore(text)) break;
    text = next;
  }
  return text;
}

function normalizeTelegramPayload(value, key = "") {
  if (typeof value === "string") {
    const protectedKeys = new Set([
      "callback_data", "url", "file_id", "parse_mode", "chat_id", "message_id",
      "inline_message_id", "callback_query_id", "media", "token", "method",
    ]);
    return protectedKeys.has(key) ? value : repairArabicEncoding(value);
  }
  if (Array.isArray(value)) return value.map(item => normalizeTelegramPayload(item, key));
  if (!value || typeof value !== "object" || Buffer.isBuffer(value)) return value;
  const out = {};
  for (const [childKey, childValue] of Object.entries(value)) {
    out[childKey] = normalizeTelegramPayload(childValue, childKey);
  }
  return out;
}

// ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ¬ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬  ط·آ¸أ¢â‚¬ ط·آ·ط¢آµ ط·آ·ط¢آ¨ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط·â€؛ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ®ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¾ط·آ·ط¢آ© ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
function extractAmountFromText(txt, exchangeRate) {
  if (!txt) return null;
  const clean = repairArabicEncoding(txt.replace(/,/g, "")).trim();

  // ط·آ¸أ¢â‚¬طŒط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬طŒط·آ¸ط«â€  ط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ±ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ¸ط¸آ¹ط·آ·ط¢آ©ط·آ·ط¹ط›
  const isSYP = /ظ„\.ط³|ظ„ظٹط±ط© ط³ظˆط±ظٹط©|ظ„ظٹط±ط©|ط³ظˆط±ظٹ|syp/i.test(clean);
  // ط·آ¸أ¢â‚¬طŒط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬طŒط·آ¸ط«â€  ط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¹ط›
  const isUSD = /\$|usd|ط¯ظˆظ„ط§ط±/i.test(clean);

  // ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ±ط·آ·ط¢آ¬ ط·آ·ط¢آ£ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ (ط·آ·ط¢آµط·آ·ط¢آ­ط·آ¸ط¸آ¹ط·آ·ط¢آ­ ط·آ·ط¢آ£ط·آ¸ط«â€  ط·آ·ط¢آ¹ط·آ·ط¢آ´ط·آ·ط¢آ±ط·آ¸ط¸آ¹)
  const numMatch = clean.match(/(\d+\.?\d*)/);
  if (!numMatch) return null;

  const num = parseFloat(numMatch[1]);
  if (!Number.isFinite(num) || num <= 0) return null;

  if (isSYP) {
    // ط·آ·ط¢آ­ط·آ¸ط«â€ ط·آ¸أ¢â‚¬ع©ط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬  ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ±ط·آ·ط¢آ© ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ±
    const rate = Number(exchangeRate) || 132;
    return num / rate;
  }
  // ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¹آ¾ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ¶ط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ±
  return num;
}

// ============================================================
//  ORANOS API
// ============================================================
const ORANOS_BASE = process.env.ORANOS_API_BASE ?? "https://api.example.com";
const ORANOS_TOKEN = process.env.ORANOS_API_TOKEN ?? "";
const API_ROOT_CATEGORY = 900_000_000;

function normalizeApiBase(value) {
  return String(value ?? "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/api\/v2\/(?:products|content|order|check|balance|profile)$/i, "")
    .replace(/\/api\/v2$/i, "")
    .replace(/\/client\/api\/products$/i, "")
    .replace(/\/client\/api$/i, "");
}

function getApiEncryptionKey() {
  return crypto.createHash("sha256")
    .update(String(process.env.API_CONFIG_ENCRYPTION_KEY || process.env.BOT_TOKEN || process.env.DATABASE_URL || "marwan-api-config"))
    .digest();
}

function encryptApiToken(token) {
  if (!token) return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getApiEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(token), "utf8"), cipher.final()]);
  return `${iv.toString("base64")}.${cipher.getAuthTag().toString("base64")}.${encrypted.toString("base64")}`;
}

function decryptApiToken(value) {
  if (!value) return "";
  try {
    const [iv64, tag64, data64] = String(value).split(".");
    const decipher = crypto.createDecipheriv("aes-256-gcm", getApiEncryptionKey(), Buffer.from(iv64, "base64"));
    decipher.setAuthTag(Buffer.from(tag64, "base64"));
    return Buffer.concat([decipher.update(Buffer.from(data64, "base64")), decipher.final()]).toString("utf8");
  } catch {
    return "";
  }
}

async function ensurePrimaryApiSource() {
  const existing = await q("SELECT id,name FROM api_sources WHERE is_primary=true LIMIT 1");
  if (existing.rows.length) {
    await q(
      "UPDATE api_sources SET name=$1,base_url=COALESCE($2,base_url), token_encrypted=COALESCE($3,token_encrypted), active=true, updated_at=NOW() WHERE id=$4",
      [
        repairArabicEncoding(existing.rows[0].name) || "API ط§ظ„ط£ط³ط§ط³ظٹ",
        process.env.ORANOS_API_BASE ? normalizeApiBase(ORANOS_BASE) : null,
        ORANOS_TOKEN ? encryptApiToken(ORANOS_TOKEN) : null,
        existing.rows[0].id,
      ]
    );
    return existing.rows[0].id;
  }
  const inserted = await q(
    `INSERT INTO api_sources(name,base_url,token_encrypted,active,is_primary)
     VALUES($1,$2,$3,true,true) RETURNING id`,
    ["API ط§ظ„ط£ط³ط§ط³ظٹ", normalizeApiBase(ORANOS_BASE), encryptApiToken(ORANOS_TOKEN)]
  );
  return inserted.rows[0].id;
}

async function listApiSources(includeInactive = true) {
  const res = await q(
    `SELECT id,name,base_url,active,is_primary,last_sync_at,last_sync_error,created_at
     FROM api_sources ${includeInactive ? "" : "WHERE active=true"} ORDER BY is_primary DESC, id`
  );
  return res.rows;
}

async function getApiSource(id) {
  const res = await q("SELECT * FROM api_sources WHERE id=$1", [id]);
  return res.rows[0] ?? null;
}

async function getPrimaryApiSource() {
  const res = await q("SELECT * FROM api_sources WHERE is_primary=true AND active=true LIMIT 1");
  return res.rows[0] ?? null;
}

function apiClientFor(source) {
  const token = decryptApiToken(source.token_encrypted);
  return axios.create({
    baseURL: normalizeApiBase(source.base_url),
    timeout: 8_000,
    headers: {
      "api-token": token,
      "x-api-token": token,
      Authorization: token ? `Bearer ${token}` : undefined,
      Accept: "application/json",
    },
    httpAgent: new http.Agent({ keepAlive: true, maxSockets: 20 }),
    httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 20 }),
  });
}

function stableProductId(source, externalId) {
  const sourceId = Number(source.id);
  const numeric = Number(externalId);
  if (source.is_primary && Number.isSafeInteger(numeric) && numeric > 0) return numeric;
  const hash = crypto.createHash("sha1").update(`${sourceId}:${externalId}`).digest();
  const value = hash.readUInt32BE(0) % 800_000_000;
  return API_ROOT_CATEGORY + (sourceId * 100_000_000) + value;
}

function sourceRootCategoryId(sourceId) {
  return API_ROOT_CATEGORY + Number(sourceId);
}

function apiProductForDb(row) {
  const raw = row.raw && typeof row.raw === "object" ? row.raw : {};
  return {
    ...raw,
    id: Number(row.id),
    source_id: Number(row.source_id),
    source_product_id: row.external_id,
    parent_id: Number(row.parent_id || 0),
    category_name: repairArabicEncoding(row.category_name || raw.category_name || ""),
    name: repairArabicEncoding(row.name),
    price: row.price != null ? Number(row.price) : raw.price,
    available: row.available && !row.deleted,
    qty_values: row.qty_values ?? raw.qty_values,
    params: row.params ?? raw.params,
  };
}

function categoryForDb(row) {
  return { id: Number(row.id), name: repairArabicEncoding(row.name), parent_id: Number(row.parent_id || 0) };
}

// ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¾ ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ·ط¢آ© ط·آ·ط¢آ¨ط·آ·ط¢آ¹ط·آ·ط¢آ¶ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ³ط·آ·ط¢آ® API ط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬  ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آµط·آ¸ط¸آ¾ط·آ¸ط«â€ ط·آ¸ط¸آ¾ط·آ·ط¢آ© ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¢آ´ط·آ·ط¢آ±ط·آ·ط¢آ© ط·آ¸ط«â€  {products} ط·آ¸ط«â€  {data}.
// ط·آ·ط¹آ¾ط·آ¸ط«â€ ط·آ·ط¢آ­ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ§ ط·آ¸أ¢â‚¬طŒط·آ¸أ¢â‚¬ ط·آ·ط¢آ§ ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¹ ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¢آ© ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آµط·آ·ط¢آ¯ط·آ·ط¢آ± ط·آ¸أ¢â‚¬ ط·آ·ط¢آ§ط·آ·ط¢آ¬ط·آ·ط¢آ­ ط·آ·ط¢آ¸ط·آ·ط¢آ§ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ±ط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ¸أ¢â‚¬â€چط·آ¸ط¦â€™ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬طŒ ط·آ¸ط¸آ¹ط·آ·ط¢آ¸ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ± ط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦.
function extractProductsPayload(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.products)) return payload.data.products;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.data?.results)) return payload.data.results;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.data?.result)) return payload.data.result;
  if (Array.isArray(payload?.response?.products)) return payload.response.products;
  return [];
}

function externalProductId(raw) {
  return raw?.id ?? raw?.product_id ?? raw?.productId ?? raw?.service_id ?? raw?.service ?? raw?.sku ?? raw?.code;
}

function externalProductName(raw, externalId) {
  return raw?.name ?? raw?.title ?? raw?.product_name ?? raw?.productName ?? `ظ…ظ†طھط¬ ${externalId}`;
}

function externalCategoryName(raw) {
  const category = raw?.category_name ?? raw?.categoryName ?? raw?.category ?? raw?.category_title ?? "";
  if (category && typeof category === "object") return category.name ?? category.title ?? "";
  return category;
}

function externalQtyValues(raw) {
  const explicit = raw?.qty_values ?? raw?.quantity_values ?? raw?.quantities;
  if (explicit != null) return explicit;
  const min = raw?.min_quantity ?? raw?.minQuantity ?? raw?.min_qty ?? raw?.min;
  const max = raw?.max_quantity ?? raw?.maxQuantity ?? raw?.max_qty ?? raw?.max;
  if (min != null || max != null) return { min, max };
  return raw?.quantity ?? raw?.qty ?? null;
}

async function fetchProductsFromApi(source) {
  const client = apiClientFor(source);
  const endpoints = ["/api/v2/products", "/client/api/products", "/api/products", "/products"];
  let lastError = null;
  for (const endpoint of endpoints) {
    try {
      const response = await wrapRequest(() => client.get(endpoint));
      const products = extractProductsPayload(response.data);
      if (products.length) return products;
      lastError = new Error(`API returned no products from ${endpoint}`);
    } catch (err) {
      lastError = err;
      const status = err?.response?.status;
      if (status && status !== 404 && status !== 405) throw err;
    }
  }
  throw lastError ?? new Error("API returned no products");
}

async function fetchApiProfile(source) {
  const client = apiClientFor(source);
  const res = await wrapRequest(() => client.get("/api/v2/profile"));
  return res.data;
}

async function fetchApiBalance(source) {
  const client = apiClientFor(source);
  const res = await wrapRequest(() => client.get("/api/v2/balance"));
  return res.data;
}

async function syncApiSource(source, prefetchedProducts = null) {
  const products = prefetchedProducts ?? await fetchProductsFromApi(source);
  const seen = [];
  for (const raw of products) {
    const externalId = String(externalProductId(raw) ?? "");
    if (!externalId) continue;
    const botId = stableProductId(source, externalId);
    const parentId = source.is_primary
      ? Number(raw.parent_id || 0)
      : sourceRootCategoryId(source.id);
    const rawPrice = Number(raw.price) || Number(raw.base_price) || Number(raw.price_usd) || Number(raw.cost) || Number(raw.amount) || 0;
    await q(
      `INSERT INTO cached_products
       (id,source_id,external_id,name,parent_id,category_name,price,available,qty_values,params,raw,deleted,last_seen_at,updated_at)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,
              COALESCE((SELECT deleted FROM product_overrides WHERE product_id=$1),false),
              NOW(),NOW())
       ON CONFLICT(source_id,external_id) DO UPDATE SET
         id=$1,name=$4,parent_id=$5,category_name=$6,price=$7,available=$8,
          qty_values=$9,params=$10,raw=$11,
          deleted=COALESCE((SELECT deleted FROM product_overrides WHERE product_id=$1),false),
          last_seen_at=NOW(),updated_at=NOW()`,
      [
        botId, source.id, externalId, repairArabicEncoding(String(externalProductName(raw, externalId))), parentId,
        repairArabicEncoding(externalCategoryName(raw)) || null, rawPrice,
        raw.available !== false && raw.active !== false && raw.status !== "inactive",
        externalQtyValues(raw),
        raw.params ?? raw.parameters ?? null, JSON.stringify(raw),
      ]
    );
    seen.push(externalId);
  }
  if (seen.length) {
    await q(
      "UPDATE cached_products SET deleted=true,available=false,updated_at=NOW() WHERE source_id=$1 AND external_id <> ALL($2)",
      [source.id, seen]
    );
  } else {
    await q("UPDATE cached_products SET deleted=true,available=false,updated_at=NOW() WHERE source_id=$1", [source.id]);
  }
  await q("UPDATE api_sources SET last_sync_at=NOW(),last_sync_error=NULL,updated_at=NOW() WHERE id=$1", [source.id]);
  return seen.length;
}

let _syncAllInFlight = null;
async function syncAllApiSources() {
  if (_syncAllInFlight) return _syncAllInFlight;
  _syncAllInFlight = (async () => {
    const sources = await listApiSources(false);
    const results = await Promise.allSettled(sources.map(source => syncApiSource(source)));
    const summary = [];
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status === "rejected") {
        const error = String(result.reason?.message ?? result.reason).slice(0, 500);
        await q("UPDATE api_sources SET last_sync_error=$1,updated_at=NOW() WHERE id=$2", [error, sources[i].id]).catch(() => {});
        summary.push({ source: sources[i], ok: false, count: 0, error });
      } else {
        summary.push({ source: sources[i], ok: true, count: Number(result.value) || 0, error: null });
      }
    }
    invalidateCaches();
    return summary;
  })().finally(() => { _syncAllInFlight = null; });
  return _syncAllInFlight;
}

async function getCachedCatalogProducts() {
  const res = await q("SELECT * FROM cached_products WHERE deleted=false ORDER BY id");
  return res.rows.map(apiProductForDb);
}

async function buildFallbackContent(parentId) {
  const products = await getCachedCatalogProducts().catch(() => []);
  const directProducts = products.filter(p => Number(p.parent_id || 0) === Number(parentId));
  if (parentId >= API_ROOT_CATEGORY) {
    return { products: directProducts, categories: [] };
  }
  const categories = new Map();
  for (const p of products) {
    const id = Number(p.parent_id || 0);
    if (id <= 0 || categories.has(id)) continue;
    categories.set(id, {
      id,
      name: repairArabicEncoding(p.category_name) || `ظ‚ط³ظ… ${id}`,
      parent_id: 0,
    });
  }
  return {
    products: directProducts,
    categories: parentId === 0 ? [...categories.values()] : [],
  };
}

const oranosClient = axios.create({
  baseURL: ORANOS_BASE,
  timeout: 8_000,
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

async function fetchContent(parentId, sourceId = null) {
  const source = sourceId != null
    ? await getApiSource(Number(sourceId)).catch(() => null)
    : await getPrimaryApiSource().catch(() => null);
  const client = source ? apiClientFor(source) : oranosClient;
  let res;
  try {
    res = await wrapRequest(() => client.get(`/api/v2/content/${parentId}`));
  } catch (err) {
    const status = err?.response?.status;
    if (status !== 404 && status !== 405) throw err;
    res = await wrapRequest(() => client.get(`/client/api/content/${parentId}`));
  }
  const data = res.data ?? {};
  _maintenanceMode = false;
  return {
    products: Array.isArray(data.products) ? data.products.map(p => ({
      ...p,
      name: repairArabicEncoding(p.name),
      category_name: repairArabicEncoding(p.category_name ?? p.categoryName ?? ""),
    })) : [],
    categories: Array.isArray(data.categories) ? data.categories.map(c => ({
      ...c,
      name: repairArabicEncoding(c.name),
    })) : [],
  };
}

async function fetchAllProducts(sourceId = null) {
  const source = sourceId != null
    ? await getApiSource(Number(sourceId)).catch(() => null)
    : await getPrimaryApiSource().catch(() => null);
  const client = source ? apiClientFor(source) : oranosClient;
  let res;
  try {
    res = await wrapRequest(() => client.get("/api/v2/products"));
  } catch (err) {
    const status = err?.response?.status;
    if (status !== 404 && status !== 405) throw err;
    res = await wrapRequest(() => client.get("/client/api/products"));
  }
  const products = extractProductsPayload(res.data);
  if (!source) return products;
  return products.map(raw => {
    const externalId = String(externalProductId(raw) ?? "");
    return {
      ...raw,
      id: stableProductId(source, externalId),
      source_id: Number(source.id),
      source_product_id: externalId,
      parent_id: source.is_primary ? Number(raw.parent_id || 0) : sourceRootCategoryId(source.id),
      category_name: repairArabicEncoding(externalCategoryName(raw)),
      name: repairArabicEncoding(String(externalProductName(raw, externalId))),
    };
  }).filter(p => p.source_product_id);
}

async function placeOrderRequest(client, productId, params, orderUuid) {
  const body = { product_id: productId, ...params, order_uuid: orderUuid };
  try {
    return (await wrapRequest(() => client.post("/api/v2/order", body))).data;
  } catch (err) {
    const status = err?.response?.status;
    if (status !== 404 && status !== 405) throw err;
    const search = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) search.set(k, String(v));
    search.set("order_uuid", orderUuid);
    return (await wrapRequest(() => client.get(`/client/api/newOrder/${encodeURIComponent(productId)}/params?${search.toString()}`))).data;
  }
}

async function placeOrder(productId, params, orderUuid) {
  try {
    const source = await getPrimaryApiSource().catch(() => null);
    const client = source ? apiClientFor(source) : oranosClient;
    return await placeOrderRequest(client, productId, params, orderUuid);
  } catch (err) {
    if (err?.response?.data) return err.response.data;
    return { status: "ERR", message: "Network error" };
  }
}

async function placeOrderForProduct(product, params, orderUuid) {
  if (!product?.source_id) {
    return placeOrder(product.id, params, orderUuid);
  }
  const source = await getApiSource(Number(product.source_id));
  if (!source || !source.active) return { status: "ERR", message: "ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آµط·آ·ط¢آ¯ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ·ط¢آ­" };
  if (source.is_primary) return placeOrder(product.source_product_id ?? product.id, params, orderUuid);
  try {
    return await placeOrderRequest(apiClientFor(source), product.source_product_id, params, orderUuid);
  } catch (err) {
    if (err?.response?.data) return err.response.data;
    return { status: "ERR", message: "Network error" };
  }
}

async function checkOrder(orderId, byUuid = false) {
  const search = new URLSearchParams();
  search.set("orders", `[${orderId}]`);
  if (byUuid) search.set("uuid", "1");
  const source = await getPrimaryApiSource().catch(() => null);
  const client = source ? apiClientFor(source) : oranosClient;
  try {
    const res = await wrapRequest(() => client.get(`/api/v2/check?${search.toString()}`));
    return res.data;
  } catch (err) {
    const status = err?.response?.status;
    if (status !== 404 && status !== 405) throw err;
    const res = await wrapRequest(() => client.get(`/client/api/check?${search.toString()}`));
    return res.data;
  }
}

async function checkOrderForSource(orderId, sourceId, byUuid = false) {
  if (!sourceId) return checkOrder(orderId, byUuid);
  const source = await getApiSource(Number(sourceId));
  if (!source || !source.active) return null;
  if (source.is_primary) return checkOrder(orderId, byUuid);
  const search = new URLSearchParams({ orders: `[${orderId}]` });
  if (byUuid) search.set("uuid", "1");
  const client = apiClientFor(source);
  try {
    const res = await wrapRequest(() => client.get(`/api/v2/check?${search.toString()}`));
    return res.data;
  } catch (err) {
    const status = err?.response?.status;
    if (status !== 404 && status !== 405) throw err;
    const res = await wrapRequest(() => client.get(`/client/api/check?${search.toString()}`));
    return res.data;
  }
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
  return out ? repairArabicEncoding(out) : null;
}

function getProductApiNotes(p) {
  const v = repairArabicEncoding((p.notes ?? p.description ?? p.details ?? "")).trim();
  return v || null;
}

// ============================================================
//  AI SUPPORT
// ============================================================
const convHistory = new Map();

// ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ°ط·آ¸ط¦â€™ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ¹ ط·آ·ط¢آ£ط·آ¸ط«â€  ط·آ·ط¢آ£ط·آ¸ط¸آ¹ ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ·ط¢آ· ط·آ·ط¢آ®ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط¸آ¹ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ±ط·آ¸ط«â€ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ·ط¹آ¾
const AI_SYSTEM_PROMPT = `ط·آ·ط¢آ£ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ¹ط·آ·ط¢آ¯ ط·آ·ط¢آ°ط·آ¸ط¦â€™ط·آ·ط¢آ§ط·آ·ط·إ’ ط·آ·ط¢آ§ط·آ·ط¢آµط·آ·ط¢آ·ط·آ¸أ¢â‚¬ ط·آ·ط¢آ§ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آµط·آ·ط¢آµ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ ط·آ·ط¢آ¥ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ© ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ± "ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬ " ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ·ط¹آ¾ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ¬ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦.
ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط«â€ ط·آ·ط¹آ¾ ط·آ¸ط¸آ¹ط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ·ط¢آ¹ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ© ط·آ·ط¢آ¨ط·آ·ط¢آ´ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ¢ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹.
ط·آ·ط¢آ£ط·آ·ط¢آ¬ط·آ·ط¢آ¨ ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ·ط¢آ±ط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ·ط¢آ©. ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬  ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬ع‘ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ¸ط«â€ ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹. ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ·ط¹آ¾ط·آ·ط¢آ°ط·آ¸ط¦â€™ط·آ·ط¢آ± ط·آ·ط¢آ£ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ط·آ·ط·إ’ ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ¹ ط·آ·ط¢آ£ط·آ¸ط«â€  ط·آ·ط¢آ±ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ·ط¢آ· ط·آ·ط¢آ®ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط¸آ¹ط·آ·ط¢آ©.`;

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
     body: JSON.stringify({ model: "gpt-4o-mini", max_completion_tokens: 1024, messages: [{ role: "system", content: repairArabicEncoding(AI_SYSTEM_PROMPT) }, ...hist] }),
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
  const m = repairArabicEncoding(msg).toLowerCase();
  if (m.includes("ط·آ±ط·آµط¸ظ¹ط·آ¯")) return "ظ‹ع؛â€™آ° ط¸â€‍ط¸â€¦ط·آ¹ط·آ±ط¸ظ¾ط·آ© ط·آ±ط·آµط¸ظ¹ط·آ¯ط¸ئ’ ط·آ§ط·آ³ط·ع¾ط·آ®ط·آ¯ط¸â€¦ ط·آ²ط·آ± *ط·آ±ط·آµط¸ظ¹ط·آ¯ط¸ظ¹* ط¸ظ¾ط¸ظ¹ ط·آ§ط¸â€‍ط¸â€ڑط·آ§ط·آ¦ط¸â€¦ط·آ© ط·آ§ط¸â€‍ط·آ±ط·آ¦ط¸ظ¹ط·آ³ط¸ظ¹ط·آ©.";
  if (m.includes("ط·آ¥ط¸ظ¹ط·آ¯ط·آ§ط·آ¹") || m.includes("ط·آ´ط·آ­ط¸â€ ")) return "ظ‹ع؛â€™آ³ ط¸â€‍ط·آ´ط·آ­ط¸â€  ط·آ±ط·آµط¸ظ¹ط·آ¯ط¸ئ’ ط·آ§ط·آ¶ط·ط›ط·آ· ط·آ²ط·آ± *ط·آ¥ط¸ظ¹ط·آ¯ط·آ§ط·آ¹* ط¸ظ¾ط¸ظ¹ ط·آ§ط¸â€‍ط¸â€ڑط·آ§ط·آ¦ط¸â€¦ط·آ© ط·آ§ط¸â€‍ط·آ±ط·آ¦ط¸ظ¹ط·آ³ط¸ظ¹ط·آ©.";
  if (m.includes("ط·آ·ط¸â€‍ط·آ¨")) return "ظ‹ع؛â€œآ¦ ط¸â€‍ط¸â€¦ط·ع¾ط·آ§ط·آ¨ط·آ¹ط·آ© ط·آ·ط¸â€‍ط·آ¨ط·آ§ط·ع¾ط¸ئ’ ط·آ§ط·آ¶ط·ط›ط·آ· ط·آ²ط·آ± *ط·آ·ط¸â€‍ط·آ¨ط·آ§ط·ع¾ط¸ظ¹* ط¸ظ¾ط¸ظ¹ ط·آ§ط¸â€‍ط¸â€ڑط·آ§ط·آ¦ط¸â€¦ط·آ© ط·آ§ط¸â€‍ط·آ±ط·آ¦ط¸ظ¹ط·آ³ط¸ظ¹ط·آ©.";
  if (m.includes("ط·آ³ط·آ¹ط·آ±")) return "ظ‹ع؛â€™آ± ط¸â€‍ط·ع¾ط·آ¹ط·آ¯ط¸ظ¹ط¸â€‍ ط·آ³ط·آ¹ط·آ± ط·آ§ط¸â€‍ط·آµط·آ±ط¸ظ¾: ط·آ§ط·آ°ط¸â€،ط·آ¨ ط·آ¥ط¸â€‍ط¸â€° ط·آ§ط¸â€‍ط·آ¥ط·آ¯ط·آ§ط·آ±ط·آ© أ¢â€ ع¯ ط·آ§ط¸â€‍ط·آ¥ط·آ¹ط·آ¯ط·آ§ط·آ¯ط·آ§ط·ع¾ أ¢â€ ع¯ ط·ع¾ط·آ¹ط·آ¯ط¸ظ¹ط¸â€‍ ط·آ³ط·آ¹ط·آ± ط·آ§ط¸â€‍ط·آµط·آ±ط¸ظ¾.";
  if (m.includes("ط·آ±ط·آ¨ط·آ­")) return "ظ‹ع؛â€œث† ط¸â€‍ط·ع¾ط·آ¹ط·آ¯ط¸ظ¹ط¸â€‍ ط¸â€ ط·آ³ط·آ¨ط·آ© ط·آ§ط¸â€‍ط·آ±ط·آ¨ط·آ­: ط·آ§ط·آ°ط¸â€،ط·آ¨ ط·آ¥ط¸â€‍ط¸â€° ط·آ§ط¸â€‍ط·آ¥ط·آ¯ط·آ§ط·آ±ط·آ© أ¢â€ ع¯ ط·آ§ط¸â€‍ط·آ¥ط·آ¹ط·آ¯ط·آ§ط·آ¯ط·آ§ط·ع¾ أ¢â€ ع¯ ط·ع¾ط·آ¹ط·آ¯ط¸ظ¹ط¸â€‍ ط·آ§ط¸â€‍ط·آ±ط·آ¨ط·آ­ ط·آ§ط¸â€‍ط·آ¹ط·آ§ط¸â€¦.";
  if (m.includes("ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯") || m.includes("balance")) return "ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ° ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ط·آ·ط¢آ±ط·آ¸ط¸آ¾ط·آ·ط¢آ© ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط¦â€™ ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ²ط·آ·ط¢آ± *ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط¸آ¹* ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©.";
  if (m.includes("ط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹") || m.includes("ط·آ·ط¢آ´ط·آ·ط¢آ­ط·آ¸أ¢â‚¬ ") || m.includes("deposit")) return "ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ³ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ´ط·آ·ط¢آ­ط·آ¸أ¢â‚¬  ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط¦â€™ ط·آ·ط¢آ§ط·آ·ط¢آ¶ط·آ·ط·â€؛ط·آ·ط¢آ· ط·آ·ط¢آ²ط·آ·ط¢آ± *ط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹* ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©.";
  if (m.includes("ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨") || m.includes("order")) return "ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ¦ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ·ط¢آ¹ط·آ·ط¢آ© ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾ط·آ¸ط¦â€™ ط·آ·ط¢آ§ط·آ·ط¢آ¶ط·آ·ط·â€؛ط·آ·ط¢آ· ط·آ·ط¢آ²ط·آ·ط¢آ± *ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾ط·آ¸ط¸آ¹* ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©.";
  if (m.includes("ط·آ·ط¢آ³ط·آ·ط¢آ¹ط·آ·ط¢آ±") || m.includes("price")) return "ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ± *ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ³ط·آ·ط¢آ¹ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آµط·آ·ط¢آ±ط·آ¸ط¸آ¾:*\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ© ط£آ¢أ¢â‚¬ أ¢â‚¬â„¢ ط£آ¢ط¹â€کأ¢â€‍آ¢ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط£آ¢أ¢â‚¬ أ¢â‚¬â„¢ ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ± ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ³ط·آ·ط¢آ¹ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آµط·آ·ط¢آ±ط·آ¸ط¸آ¾";
  if (m.includes("ط·آ·ط¢آ±ط·آ·ط¢آ¨ط·آ·ط¢آ­") || m.includes("markup")) return "ط¸â€¹ط¹ط›أ¢â‚¬إ“ط«â€  *ط·آ¸أ¢â‚¬ ط·آ·ط¢آ³ط·آ·ط¢آ¨ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¨ط·آ·ط¢آ­:*\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ© ط£آ¢أ¢â‚¬ أ¢â‚¬â„¢ ط£آ¢ط¹â€کأ¢â€‍آ¢ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط£آ¢أ¢â‚¬ أ¢â‚¬â„¢ ط£آ¢ط¥â€œط¹ث†ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¨ط·آ·ط¢آ­ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦";
  return "ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع† ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ·ط¹آ¾ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ·ط¢آµط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¹ط·آ·ط¢آ¨ط·آ·ط¢آ± ط·آ·ط¢آ²ط·آ·ط¢آ± *ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬آ¦* ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ©.";
}

// Replace the legacy FAQ implementation with clean UTF-8 text and matching
// against repaired user input.
function buildSmartFaq(msg) {
  const m = repairArabicEncoding(msg).toLowerCase();
  if (m.includes("ط±طµظٹط¯") || m.includes("balance")) return "ًں’° ظ„ظ…ط¹ط±ظپط© ط±طµظٹط¯ظƒ ط§ط³طھط®ط¯ظ… ط²ط± آ«ط±طµظٹط¯ظٹآ» ظپظٹ ط§ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط±ط¦ظٹط³ظٹط©.";
  if (m.includes("ط¥ظٹط¯ط§ط¹") || m.includes("ط´ط­ظ†") || m.includes("deposit")) return "ًں’³ ظ„ط´ط­ظ† ط±طµظٹط¯ظƒ ط§ط¶ط؛ط· ط²ط± آ«ط¥ظٹط¯ط§ط¹آ» ظپظٹ ط§ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط±ط¦ظٹط³ظٹط©.";
  if (m.includes("ط·ظ„ط¨") || m.includes("order")) return "ًں“¦ ظ„ظ…طھط§ط¨ط¹ط© ط·ظ„ط¨ط§طھظƒ ط§ط¶ط؛ط· ط²ط± آ«ط·ظ„ط¨ط§طھظٹآ» ظپظٹ ط§ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط±ط¦ظٹط³ظٹط©.";
  if (m.includes("ط³ط¹ط±") || m.includes("price")) return "ًں’² ظ„طھط¹ط¯ظٹظ„ ط³ط¹ط± ط§ظ„طµط±ظپ ط§ط°ظ‡ط¨ ط¥ظ„ظ‰ ط§ظ„ط¥ط¯ط§ط±ط© â†گ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ â†گ طھط¹ط¯ظٹظ„ ط³ط¹ط± ط§ظ„طµط±ظپ.";
  if (m.includes("ط±ط¨ط­") || m.includes("markup")) return "ًں“ˆ ظ„طھط¹ط¯ظٹظ„ ظ†ط³ط¨ط© ط§ظ„ط±ط¨ط­ ط§ط°ظ‡ط¨ ط¥ظ„ظ‰ ط§ظ„ط¥ط¯ط§ط±ط© â†گ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ â†گ طھط¹ط¯ظٹظ„ ط§ظ„ط±ط¨ط­ ط§ظ„ط¹ط§ظ….";
  return "ًں’¬ ظ„ظ… ط£ط¬ط¯ ط¥ط¬ط§ط¨ط© ظ…ط­ط¯ط¯ط©. طھظˆط§طµظ„ ظ…ط¹ ط§ظ„ط¥ط¯ط§ط±ط© ط¹ط¨ط± ط²ط± آ«ط§ظ„ط¯ط¹ظ…آ» ظپظٹ ط§ظ„ظ‚ط§ط¦ظ…ط©.";
}

// ============================================================
//  PRODUCT CACHE
// ============================================================
const PRODUCTS_TTL  = 2 * 60_000;    // ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¦â€™ط·آ·ط¢آ§ط·آ·ط¢آ´ ط·آ·ط¢آ³ط·آ·ط¢آ±ط·آ¸ط¸آ¹ط·آ·ط¢آ¹ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط·إ’ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ·ط¢آ© ط·آ¸ط¸آ¾ط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ¸ط¸آ¹ط·آ·ط¢آ©
const CONTENT_TTL   = 2 * 60_000;
const OVERRIDES_TTL = 10 * 60_000;   // ط·آ¸ط¦â€™ط·آ·ط¢آ§ط·آ·ط¢آ´ 10 ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬ع‘
const PAGE_SIZE = 8;

let productsCache = null;
const contentCache = new Map();
let allOverridesCache = null;

// in-flight deduplication: ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ·ط¹آ¾ط·آ¸ط¹ث†ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ ط·آ¸ط¸آ¾ط·آ·ط¢آ³ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬ ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ ط·آ¸أ¢â‚¬ ط·آ¸ط¸آ¾ط·آ·ط¢آ³ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط«â€ ط·آ¸أ¢â‚¬ع‘ط·آ·ط¹آ¾
let _productsInFlight    = null;
const _contentInFlight   = new Map();
let _overridesInFlight   = null;

async function getCachedProducts() {
  if (productsCache && productsCache.expiry > Date.now()) return productsCache.products;
  if (_productsInFlight) return _productsInFlight;
  _productsInFlight = getCachedCatalogProducts()
    .then(async products => {
      if (products.length) return products;
      const cachedCount = await q("SELECT COUNT(*)::int AS c FROM cached_products");
      if (cachedCount.rows[0]?.c) return products;
      const source = await getPrimaryApiSource().catch(() => null);
      if (!source) return [];
      await syncApiSource(source);
      return getCachedCatalogProducts();
    })
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
  const p = (async () => {
    if (parentId >= API_ROOT_CATEGORY) {
      const sourceId = parentId - API_ROOT_CATEGORY;
      const products = await getCachedProducts();
      return {
        products: products.filter(p => p.source_id === sourceId && p.parent_id === parentId),
        categories: [],
      };
    }
    // ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¯ ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چ API ط·آ¸أ¢â‚¬ ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¢ط·آ·ط¢آ®ط·آ·ط¢آ± ط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬ ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ­ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ© ط·آ·ط¢آ¨ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬  ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع‘ ط·آ¸أ¢â‚¬â€چط·آ¸ط«â€ ط·آ·ط¢آ­ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦.
    const content = await fetchContent(parentId).catch(() => cached?.content ?? buildFallbackContent(parentId));
    const sources = await listApiSources(false);
    const extraSources = sources.filter(s => !s.is_primary && parentId === 0);
    if (extraSources.length) {
      const extraRootIds = new Set(extraSources.map(s => sourceRootCategoryId(s.id)));
      content.categories = [
        ...(content.categories || []).filter(c => !extraRootIds.has(Number(c.id))),
        // ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چ API ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ ط·آ¸ط¸آ¹ط·آ·ط¢آ¸ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ± ط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬طŒ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ°ط·آ¸ط¸آ¹ ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬طŒ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ±ط·آ·ط¥â€™ ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ³ ط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬ ط·آ¸ط¸آ¹ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ«ط·آ¸أ¢â‚¬â€چ "ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ API".
        ...extraSources.map(s => ({ id: sourceRootCategoryId(s.id), name: s.name, parent_id: 0 })),
      ];
    }
    return content;
  })()
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
    // ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ²ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¢آ© ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ®ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ط·آ·ط¢آ©ط·آ·ط¥â€™ ط·آ¸ط«â€ ط·آ·ط¹آ¾ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ·ط¢آ© ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¦â€™ط·آ·ط¢آ§ط·آ·ط¢آ´/ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬ ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ¸ط¸آ¾ط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ¸ط¸آ¹ط·آ·ط¢آ©
    Promise.all([
      syncAllApiSources(),
      loadAllOverrides().then(m => { allOverridesCache = { map: m, expiry: Date.now() + OVERRIDES_TTL }; }),
    ]).then(() => {
      productsCache = null;
      contentCache.clear();
      return getCachedContent(0);
    }).catch(() => {});
  }, 2 * 60_000).unref();
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

// ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬ ط·آ·ط¢آ§ط·آ·ط·إ’ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¬ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ¹ط·آ·ط¢آ© IDs ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ¸ط¸آ¹ ط·آ·ط¹آ¾ط·آ·ط¢آ­ط·آ·ط¹آ¾ط·آ¸ط«â€ ط·آ¸ط¸آ¹ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ¸ط·آ·ط¢آ§ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ±ط·آ·ط¢آ© ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
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

async function isCategoryVisible(catId, visibleDirect, visited = new Set()) {
  if (visibleDirect.has(catId)) return true;
  if (visited.has(catId)) return false;
  visited.add(catId);
  const c = await getCachedContent(catId);
  for (const sub of c.categories) if (await isCategoryVisible(sub.id, visibleDirect, visited)) return true;
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

const BOT_MAINTENANCE_MSG = "ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¢آ§ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط«â€ ط·آ·ط¹آ¾ ط·آ¸أ¢â‚¬ع‘ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬ ط·آ·ط¢آ© ط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹.\nط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ¹ط·آ¸ط«â€ ط·آ·ط¢آ¯ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ¨ط·آ·ط¢آ£ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ±ط·آ·ط¢آ¨ ط·آ¸ط«â€ ط·آ¸أ¢â‚¬ع‘ط·آ·ط¹آ¾ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬ . ط·آ¸أ¢â‚¬ ط·آ·ط¢آ´ط·آ¸ط¦â€™ط·آ·ط¢آ± ط·آ·ط¢آµط·آ·ط¢آ¨ط·آ·ط¢آ±ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬آ¦! ط¸â€¹ط¹ط›أ¢â€‍آ¢ط¹ث†";
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME ?? "admin").split(",")[0].trim();

// ============================================================
//  STEP STATE (per user)
// ============================================================
const stepMap = new Map();
function getStep(uid) { return stepMap.get(uid) ?? { kind: "idle" }; }
function setStep(uid, s) { stepMap.set(uid, s); }

let _botRef = null;
const authedAdminIds = new Set();

// ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬â€چ: userId ط£آ¢أ¢â‚¬ أ¢â‚¬â„¢ Map<catId, page> ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
const navState = new Map();
function saveNavPage(uid, catId, page) {
  if (!navState.has(uid)) navState.set(uid, new Map());
  navState.get(uid).set(catId, page);
}
function getNavPage(uid, catId) { return navState.get(uid)?.get(catId) ?? 1; }

// ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ·ط¢آ¥ط·آ·ط¢آ´ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹ ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
const depositNotifications = new Map();
async function clearDepositForOtherAdmins(processorId, depId, statusText) {
  const list = depositNotifications.get(depId) ?? [];
  depositNotifications.delete(depId);
  for (const n of list) {
    if (n.adminId === processorId) continue;
    try {
      await _botRef?.telegram.editMessageCaption(n.adminId, n.messageId, undefined,
        `${statusText}\n(ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ط·آ·ط¢آ© ط·آ·ط¢آ¨ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ·ط¢آ·ط·آ·ط¢آ© ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آ¢ط·آ·ط¢آ®ط·آ·ط¢آ±)`);
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
  const cached = userCacheGet(f.id);
  if (cached !== undefined && cached !== null) return cached;
  return upsertUser({ id: f.id, username: f.username, first_name: f.first_name, last_name: f.last_name });
}

// ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ¸أ¢â‚¬â€چط·آ¸ط«â€ ط·آ·ط¢آ­ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ© ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ®ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ط·آ·ط¢آ© - ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ·ط¹آ¾ط·آ·ط¢آ¸ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ± ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ© ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
function mainMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾", "cat:0:1:0"), Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ° ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط¸آ¹", "balance")],
    [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ³ ط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹", "deposit"), Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ¦ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾ط·آ¸ط¸آ¹", "myorders:1")],
    [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬آ¦", "support"), Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬â€چ ط·آ·ط¹آ¾ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ«", "home")],
  ]);
}

function mainMenuAdmin() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾", "cat:0:1:0"), Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ° ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط¸آ¹", "balance")],
    [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ³ ط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹", "deposit"), Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ¦ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾ط·آ¸ط¸آ¹", "myorders:1")],
    [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬آ¦", "support"), Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬â€چ ط·آ·ط¹آ¾ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ«", "home")],
    [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬ع©أ¢â‚¬ع© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ·ط¢آ®ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸ط«â€ ط·آ·ط¢آ­ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ©", "admin:menu")],
  ]);
}

async function showMainMenu(ctx) {
  const user = await ensureUser(ctx);
  if (!user) return;
  setStep(user.id, { kind: "idle" });
  if (user.status === "banned") { await sendOrEdit(ctx, "ط¸â€¹ط¹ط›ط¹â€کط¢آ« ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ­ط·آ·ط¢آ¸ط·آ·ط¢آ±ط·آ¸ط¦â€™ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬  ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط«â€ ط·آ·ط¹آ¾."); return; }
  const [status, rate, adminSessionActive] = await Promise.all([
    getBotStatus(),
    getExchangeRate(),
    isAdminSessionActive(user.id),
  ]);
  if (status === "off" && !authedAdminIds.has(user.id) && !adminSessionActive) {
    await sendOrEdit(ctx, "ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¢آ§ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط«â€ ط·آ·ط¹آ¾ ط·آ¸أ¢â‚¬ع‘ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬ ط·آ·ط¢آ©. ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ¹ط·آ¸ط«â€ ط·آ·ط¢آ¯ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ¨ط·آ·ط¢آ£ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ±ط·آ·ط¢آ¨ ط·آ¸ط«â€ ط·آ¸أ¢â‚¬ع‘ط·آ·ط¹آ¾ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬ . ط·آ¸أ¢â‚¬ ط·آ·ط¢آ´ط·آ¸ط¦â€™ط·آ·ط¢آ± ط·آ·ط¢آµط·آ·ط¢آ¨ط·آ·ط¢آ±ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬آ¦! ط¸â€¹ط¹ط›أ¢â€‍آ¢ط¹ث†");
    return;
  }
  const greeting = `ط·آ·ط¢آ£ط·آ¸أ¢â‚¬طŒط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ط·آ¸ط¦â€™ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬  ط¸â€¹ط¹ط›ط¥â€™ط¹ط›\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦: ${user.first_name ?? "ط£آ¢أ¢â€ڑآ¬أ¢â‚¬â€Œ"}${user.username ? ` (@${user.username})` : ""}\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦: ${user.id}\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯: ${formatBalance(Number(user.balance), rate)}\n\nط·آ·ط¢آ§ط·آ·ط¢آ®ط·آ·ط¹آ¾ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط¸â€¹ط¹ط›أ¢â‚¬ع©أ¢â‚¬طŒ`;
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
    await ctx.reply(`ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع† ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬آ¦: @${ADMIN_USERNAME}`, Markup.inlineKeyboard([[Markup.button.callback("ط¸â€¹ط¹ط›ط¹ث†  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "home")]]));
    return;
  }
  const rows = links.map(l => [Markup.button.url(l.name, l.link.startsWith("http") ? l.link : `https://t.me/${l.link.replace(/^@/, "")}`)]);
  rows.push([Markup.button.callback("ط¸â€¹ط¹ط›ط¹ث†  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "home")]);
  await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع† ط·آ¸ط«â€ ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ·ط¢آµط·آ¸أ¢â‚¬â€چ:", Markup.inlineKeyboard(rows));
}

// ============================================================
//  DEPOSIT
// ============================================================
let _depositMethodsEnsured = false;
async function ensureDefaultDepositMethods() {
  if (_depositMethodsEnsured) return;
  const res = await q("SELECT COUNT(*)::int AS c FROM deposit_methods");
  if (res.rows[0].c > 0) {
    const methods = await q("SELECT id,name,instructions FROM deposit_methods");
    for (const method of methods.rows) {
      const name = repairArabicEncoding(method.name);
      const instructions = repairArabicEncoding(method.instructions);
      if (name !== method.name || instructions !== method.instructions) {
        await q("UPDATE deposit_methods SET name=$1,instructions=$2 WHERE id=$3", [name, instructions, method.id]);
      }
    }
    _depositMethodsEnsured = true;
    return;
  }
  await q(`INSERT INTO deposit_methods(name,identifier,instructions) VALUES
    ('ط´ط§ظ… ظƒط§ط´','02d7079d7229d8860c7d89467bfdc938','ط­ظˆظ‘ظ„ ط§ظ„ظ…ط¨ظ„ط؛ ط¥ظ„ظ‰ ط±ظ‚ظ… ط´ط§ظ… ظƒط§ط´ ط£ط¹ظ…ط§ظ„طŒ ط«ظ… ط£ط±ط³ظ„ طµظˆط±ط© ط§ظ„ط¥ط´ط¹ط§ط±'),
    ('ط³ظٹط±ظٹطھظ„ ظƒط§ط´','32820534','ط­ظˆظ‘ظ„ ط§ظ„ظ…ط¨ظ„ط؛ ط¥ظ„ظ‰ ط±ظ‚ظ… ط³ظٹط±ظٹطھظ„ ظƒط§ط´ ط£ط¹ظ…ط§ظ„طŒ ط«ظ… ط£ط±ط³ظ„ طµظˆط±ط© ط§ظ„ط¥ط´ط¹ط§ط±')`);
  _depositMethodsEnsured = true;
}

async function showDepositMenu(ctx) {
  if (!_depositMethodsEnsured) await ensureDefaultDepositMethods();
  const res = await q("SELECT * FROM deposit_methods WHERE active=true ORDER BY id");
  const methods = res.rows;
  if (!methods.length) {
    await sendOrEdit(ctx, "ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ·ط¹آ¾ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ·ط¢آ¯ ط·آ·ط¢آ·ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ ط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ·ط¢آ­ط·آ·ط¢آ© ط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹.", Markup.inlineKeyboard([[Markup.button.callback("ط¸â€¹ط¹ط›ط¹ث†  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "home")]]));
    return;
  }
  const rows = methods.map(m => [Markup.button.callback(`ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ³ ${m.name}`, `dep:method:${m.id}`)]);
  rows.push([Markup.button.callback("ط¸â€¹ط¹ط›ط¹ث†  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "home")]);
  await sendOrEdit(ctx, "ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ³ ط·آ·ط¢آ§ط·آ·ط¢آ®ط·آ·ط¹آ¾ط·آ·ط¢آ± ط·آ·ط¢آ·ط·آ·ط¢آ±ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹:", Markup.inlineKeyboard(rows));
}

async function showDepositMethod(ctx, methodId) {
  const res = await q("SELECT * FROM deposit_methods WHERE id=$1 AND active=true", [methodId]);
  const m = res.rows[0];
  if (!m) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ·ط¢آ±ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ© ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ·ط¢آ­ط·آ·ط¢آ©."); return; }
  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¯ط·آ¸ط¸آ¾ط·آ¸أ¢â‚¬ع‘ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹: ط·آ¸أ¢â‚¬ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ ط·آ·ط¢آ£ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ط·آ·ط¥â€™ ط·آ·ط¢آ«ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آµط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ·ط¢آ© ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  setStep(ctx.from.id, { kind: "deposit:info", methodId: m.id, methodName: m.name, amount: null, photoFileId: null });
  const kb = Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "deposit"), Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "dep:cancel")]]);
  const infoText = `ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ³ ${m.name}\nط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬ع© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦: \`${m.identifier}\`\n\nط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ط·آ·ط¹آ¾:\n${m.instructions}\n\nط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ¤ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ ط·آ¸ط«â€ ط·آ·ط¢آµط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ·ط¢آ© ط·آ·ط¢آ¥ط·آ·ط¢آ´ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ­ط·آ¸ط«â€ ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ (ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬ ط·آ¸ط¦â€™ ط·آ·ط¢آ¥ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬طŒط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ ط·آ·ط¢آ¨ط·آ·ط¢آ£ط·آ¸ط¸آ¹ ط·آ·ط¹آ¾ط·آ·ط¢آ±ط·آ·ط¹آ¾ط·آ¸ط¸آ¹ط·آ·ط¢آ¨).`;
  if (m.image_file_id) {
    await ctx.replyWithPhoto(m.image_file_id, { caption: infoText, parse_mode: "Markdown", ...kb });
  } else {
    await ctx.reply(infoText, { parse_mode: "Markdown", ...kb });
  }
}

// ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ·ط¢آ¥ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹ ط·آ·ط¢آ¨ط·آ·ط¢آ¹ط·آ·ط¢آ¯ ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آµط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ·ط¢آ© ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
async function completeDepositRequest(ctx, step) {
  const res = await q(
    "INSERT INTO deposit_requests(user_id,method_id,method_name,amount,screenshot_file_id) VALUES($1,$2,$3,$4,$5) RETURNING *",
    [ctx.from.id, step.methodId, step.methodName, step.amount != null ? String(step.amount) : null, step.photoFileId]
  );
  const dep = res.rows[0];
  setStep(ctx.from.id, { kind: "idle" });
  await ctx.reply("ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ¬ط·آ·ط¢آ¹ط·آ·ط¢آ© ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط¦â€™ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ ط·آ·ط¢آ£ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ±ط·آ·ط¢آ¨ ط·آ¸ط«â€ ط·آ¸أ¢â‚¬ع‘ط·آ·ط¹آ¾ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬ .", Markup.inlineKeyboard([[Markup.button.callback("ط¸â€¹ط¹ط›ط¹ث†  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "home")]]));
  // ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¤ط·آ·ط¢آ®ط·آ·ط¢آ± ط·آ·ط¢آ±ط·آ·ط¢آ¯ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¨ط·آ·ط¢آ³ط·آ·ط¢آ¨ط·آ·ط¢آ¨ ط·آ·ط¢آ¥ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ´ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¯ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط·إ’.
  void notifyAdminsDeposit(ctx, dep).catch(err => console.error("deposit notification failed:", err?.message ?? err));
}

async function notifyAdminsDeposit(ctx, depositRow) {
  const user = await getUser(ctx.from.id);
  const amountStr = depositRow.amount ? `${Number(depositRow.amount).toFixed(2)}$` : "ط£آ¢أ¢â€ڑآ¬أ¢â‚¬â€Œ";
  const text = `ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ¥ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹ ط·آ·ط¢آ¬ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ¯\nط¸â€¹ط¹ط›أ¢â‚¬ع©ط¢آ¤ ${user?.first_name ?? "ط£آ¢أ¢â€ڑآ¬أ¢â‚¬â€Œ"}${user?.username ? " @" + user.username : ""} (${ctx.from.id})\nط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ³ ${depositRow.method_name}\nط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آµ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸ط¹ث†ط·آ·ط¢آ­ط·آ¸ط«â€ ط·آ¸ط¹ع©ط·آ¸أ¢â‚¬ع©ط·آ¸أ¢â‚¬â€چ: ${amountStr}`;
  const kb = Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ©", `adm:dep:approve:${depositRow.id}`), Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ±ط·آ¸ط¸آ¾ط·آ·ط¢آ¶", `adm:dep:reject:${depositRow.id}`)]]);
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

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ·ط¹آ¾ط·آ·ط¢آ´ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ¬ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ·ط¢آ²ط·آ¸ط¸آ¹ ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
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

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ·ط¢آ¥ط·آ·ط¢آµط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ­ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط·إ’: ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ±ط·آ·ط¢آ¬ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¬ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ¹ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¸ط·آ·ط¢آ§ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ±ط·آ·ط¢آ© ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ·ط¢آ© ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ·ط¢آ®ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ¬ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ© ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  const visibleDirectSet = await buildVisibleCategoryIds(excludedCats, kws);

  const visibility = await Promise.all(
    content.categories.map(c => isCategoryVisible(c.id, visibleDirectSet))
  );
  const visibleCats = content.categories.filter((c, index) => {
    if (excludedCats.has(c.id)) return false;
    const ov = catOv.get(c.id);
    if (ov?.hidden && !isAdmin) return false;
    if (ov?.customParentId != null && ov.customParentId !== parentId) return false;
    return isAdmin || visibility[index];
  });

  const visibleProds = content.products.filter(p => {
    if (!p.available && !isAdmin) return false;
    if (isExcludedProduct(p, kws)) return false;
    const ov = ovMap.get(p.id);
    if (ov?.deleted) return false;
    if (ov?.hidden && !isAdmin) return false;
    if (ov?.customCategoryId != null && ov.customCategoryId !== parentId) return false;
    return true;
  });

  const [vcRes, mpRes, manualCatalogRes, rate, backLabel, homeLabel, prevLabel, nextLabel] = await Promise.all([
    q("SELECT * FROM virtual_categories WHERE parent_id=$1 ORDER BY position", [parentId]),
    q("SELECT * FROM manual_products WHERE category_id=$1 AND category_is_virtual=false AND active=true ORDER BY id", [parentId]),
    parentId === 0
      ? q(`SELECT EXISTS(SELECT 1 FROM manual_categories WHERE parent_id=0 ${isAdmin ? "" : "AND active=true"}) AS exists`)
      : Promise.resolve({ rows: [{ exists: false }] }),
    getExchangeRate(),
    getBtnBackLabel(), getBtnHomeLabel(), getBtnPrevLabel(), getBtnNextLabel(),
  ]);

  const vcRows = isAdmin ? vcRes.rows : vcRes.rows.filter(v => v.active);
  const vcBtns = vcRows.map(v => Markup.button.callback(`${v.active ? "ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع‘ " : "ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬â„¢ "}${v.name}`.slice(0, 60), `vcat:${v.id}:1:${parentId}`));

  const manualBtns = mpRes.rows.map(m => {
    const usd = Number(m.price_usd); const syp = Math.round(usd * rate);
    return Markup.button.callback(`ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ${m.name} ط£آ¢أ¢â€ڑآ¬ط¢آ¢ ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ط·آ¸أ¢â‚¬â€چ.ط·آ·ط¢آ³`.slice(0, 60), `mprod:${m.id}:${parentId}`);
  });

  const manualCatalogExists = !!manualCatalogRes.rows[0]?.exists;
  if (!visibleCats.length && !visibleProds.length && !vcBtns.length && !manualBtns.length &&
      !(parentId === 0 && manualCatalogExists)) {
    const emptyRows = [];
    if (isAdmin) {
      emptyRows.push([Markup.button.callback("ط£آ¢ط¥â€œط¹ث†ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦", `adm:catEdit:${parentId}`)]);
      emptyRows.push([Markup.button.callback("ط¸â€¹ط¹ط›أ¢â€‍آ¢ط«â€  ط·آ·ط¢آ¥ط·آ·ط¢آ®ط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط·إ’ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦", `adm:catToggle:${parentId}`)]);
    }
    if (parentId === 0) {
      if (isAdmin) emptyRows.push([Markup.button.callback(backLabel, "admin:menu"), Markup.button.callback(homeLabel, "home")]);
      else emptyRows.push([Markup.button.callback(homeLabel, "home")]);
    } else {
      const bp = getNavPage(ctx.from.id, backTo);
      const backAction = backTo === 0 ? "cat:0:1:0" : `cat:${backTo}:${bp}:0`;
      emptyRows.push([Markup.button.callback(backLabel, backAction), Markup.button.callback(homeLabel, "home")]);
    }
    await sendOrEdit(ctx, "ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ­ ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ°ط·آ·ط¢آ§ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط·â€؛ ط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹.", Markup.inlineKeyboard(emptyRows)); return;
  }

  visibleCats.sort((a, b) => (catOv.get(a.id)?.sortOrder ?? 9999) - (catOv.get(b.id)?.sortOrder ?? 9999));
  const manualCatalogBtns = parentId === 0 && manualCatalogExists
    ? [Markup.button.callback("ط¸â€¹ط¹ط›ط¢آ§ط·â€؛ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "mcat:0:1:0")]
    : [];

  const catBtns = [
    ...manualCatalogBtns,
    ...vcBtns,
    ...visibleCats.map(c => {
      const ov = catOv.get(c.id);
      const label = ov?.customName ?? c.name;
      return Markup.button.callback(`${ov?.hidden ? "ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬â„¢ " : "ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع‘ "}${label}`.slice(0, 60), `cat:${c.id}:1:${parentId}`);
    }),
  ];

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ·ط¹آ¾ط·آ·ط¢آ·ط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع‘ markup ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ®ط·آ·ط¢آ§ط·آ·ط¢آµ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ ط·آ·ط¢آ£ط·آ·ط¢آ³ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ± ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  const prodBtns = await Promise.all(visibleProds.map(async p => {
    const ov = ovMap.get(p.id);
    const usd = await effectivePriceUsd(p, ov, markup, socialMarkup, socialKws, null, userMarkupPercent);
    const syp = Math.round(usd * rate);
    const name = ov?.customName ?? p.name;
    return Markup.button.callback(`${ov?.hidden ? "ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬â„¢ " : "ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ "}${name} ط£آ¢أ¢â€ڑآ¬ط¢آ¢ ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ط·آ¸أ¢â‚¬â€چ.ط·آ·ط¢آ³`.slice(0, 60), `prod:${p.id}:${parentId}`);
  }));

  const all = [...catBtns, ...prodBtns, ...manualBtns];
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const safe = Math.min(Math.max(1, page), totalPages);
  saveNavPage(ctx.from.id, parentId, safe);
  const slice = all.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE);

  const rows = [];
  if (isAdmin && parentId !== 0) {
    const curOv = (await q("SELECT * FROM category_overrides WHERE category_id=$1", [parentId])).rows[0];
    rows.push([Markup.button.callback("ط£آ¢ط¥â€œط¹ث†ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦", `adm:catEdit:${parentId}`), Markup.button.callback(curOv?.hidden ? "ط¸â€¹ط¹ط›أ¢â‚¬ع©ط¸آ¾ ط·آ·ط¢آ¥ط·آ·ط¢آ¸ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ§ط·آ·ط¢آ±" : "ط¸â€¹ط¹ط›أ¢â€‍آ¢ط«â€  ط·آ·ط¢آ¥ط·آ·ط¢آ®ط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط·إ’", `adm:catToggle:${parentId}`)]);
    rows.push([Markup.button.callback("% ط·آ¸أ¢â‚¬ ط·آ·ط¢آ³ط·آ·ط¢آ¨ط·آ·ط¢آ© ط·آ·ط¢آ±ط·آ·ط¢آ¨ط·آ·ط¢آ­ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦", `adm:catMarkup:${parentId}`), Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¢آ¢ ط·آ·ط¹آ¾ط·آ·ط¢آ±ط·آ·ط¹آ¾ط·آ¸ط¸آ¹ط·آ·ط¢آ¨ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦", `adm:catSort:${parentId}`)]);
    rows.push([Markup.button.callback("ط¸â€¹ط¹ط›ط¹â€کط¹â€ک ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬â€چ ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦", `adm:moveCatAll:${parentId}`), Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¸آ¾ ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦", `adm:moveCatToParent:${parentId}`)]);
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

  const title = parentId === 0 ? "ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©" : `ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع‘ ${catOv.get(parentId)?.customName ?? "ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ­ط·آ·ط¹آ¾ط·آ¸ط«â€ ط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦"}`;
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

  if (!p) { await sendOrEdit(ctx, "ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¯.", Markup.inlineKeyboard([[await resolveBackBtn(backTo)]])); return; }

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

  if (isExcludedProduct(p, kws) && !isAdmin) { await sendOrEdit(ctx, "ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ°ط·آ·ط¢آ§ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ·ط¢آ­.", Markup.inlineKeyboard([[await resolveBackBtn(backTo)]])); return; }
  const ov = ovMap.get(p.id);
  const isSocial = isSocialProduct(p.name, p.category_name, socialKws);
  const usd = await effectivePriceUsd(p, ov, markup, socialMarkup, socialKws, null, userMarkupPercent);
  const syp = Math.round(usd * rate);
  const quantityMode = parseQtyValues(p.qty_values, p);

  let qtyInfo = "";
  if (quantityMode.kind === "fixed") {
    qtyInfo = "ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¦â€™ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ©: 1 (ط·آ·ط¢آ«ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ©)";
  } else if (quantityMode.kind === "list") {
    qtyInfo = `ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¦â€™ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ·ط¢آ­ط·آ·ط¢آ©: ${quantityMode.values.join(", ")}`;
  } else if (Number.isFinite(quantityMode.min) && Number.isFinite(quantityMode.max)) {
    qtyInfo = `ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¦â€™ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ© ط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬  ${quantityMode.min} ط·آ¸ط«â€  ${quantityMode.max}`;
  } else if (isSocial) {
    const [min, max] = await Promise.all([getSocialMinQty(), getSocialMaxQty()]);
    qtyInfo = `ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¦â€™ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ© ط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬  ${min.toLocaleString("en-US")} ط·آ¸ط«â€  ${max.toLocaleString("en-US")}`;
  }

  const displayName = ov?.customName ?? p.name;
  const instructions = ov?.instructions?.trim() || getProductApiNotes(p);
  const sourceInfo = isAdmin && p.source_id ? `\nAPI: #${p.source_id}` : "";
  const text = `ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ${displayName}\n${p.category_name ? `ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦: ${p.category_name}\n` : ""}ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ¹ط·آ·ط¢آ±: ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ط·آ¸أ¢â‚¬â€چ.ط·آ·ط¢آ³\n${qtyInfo}${sourceInfo}${instructions ? `\n\nط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬آ¹ ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ط·آ·ط¹آ¾:\n${instructions}` : ""}`;

  const backBtnResolved = await resolveBackBtn(backTo);
  const btns = [];
  if (p.available || isAdmin) btns.push([Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¢ط·آ¸أ¢â‚¬ ", `buy:${p.id}:${backTo}`)]);
  if (isAdmin) {
    btns.push([Markup.button.callback("ط£آ¢ط¥â€œط¹ث†ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ¹ط·آ·ط¢آ±", `adm:editPrice:${p.id}`), Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬آ¹ ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ط·آ·ط¹آ¾", `adm:editInstr:${p.id}`)]);
    btns.push([Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬إ’ ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦", `adm:renameProd:${p.id}`), Markup.button.callback("ط¸â€¹ط¹ط›ط¹â€کط¹â€ک ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¢ط·آ·ط¢آ®ط·آ·ط¢آ±", `adm:moveProd:${p.id}`)]);
    btns.push([Markup.button.callback(ov?.hidden ? "ط¸â€¹ط¹ط›أ¢â‚¬ع©ط¸آ¾ ط·آ·ط¢آ¥ط·آ·ط¢آ¸ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ§ط·آ·ط¢آ±" : "ط¸â€¹ط¹ط›أ¢â€‍آ¢ط«â€  ط·آ·ط¢آ¥ط·آ·ط¢آ®ط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط·إ’", `adm:hideProd:${p.id}`)]);
    btns.push([Markup.button.callback("ظ‹ع؛â€”â€کأ¯آ¸عˆ ط·آ­ط·آ°ط¸ظ¾ ط·آ§ط¸â€‍ط¸â€¦ط¸â€ ط·ع¾ط·آ¬ ط¸â€ ط¸â€،ط·آ§ط·آ¦ط¸ظ¹ط·آ§ط¸â€¹", `adm:deleteProdAsk:${p.id}`)]);
  }
  btns.push([backBtnResolved, Markup.button.callback(homeLabel, "home")]);
  await sendOrEdit(ctx, text, Markup.inlineKeyboard(btns));
}

async function showManualCategory(ctx, categoryId, page, backTo) {
  const [u, sessionActive, rate, backLabel, homeLabel, prevLabel, nextLabel] = await Promise.all([
    getUser(ctx.from.id),
    isAdminSessionActive(ctx.from.id),
    getExchangeRate(),
    getBtnBackLabel(), getBtnHomeLabel(), getBtnPrevLabel(), getBtnNextLabel(),
  ]);
  const isAdmin = !!u?.is_admin && (authedAdminIds.has(ctx.from.id) || sessionActive);
  const isRoot = categoryId === 0;
  const catRes = await q(
    `SELECT * FROM manual_categories WHERE parent_id=$1 ${isAdmin ? "" : "AND active=true"} ORDER BY position,id`,
    [categoryId]
  );
  const productRes = await q(
    isRoot
      ? "SELECT * FROM manual_products WHERE false"
      : `SELECT * FROM manual_products WHERE category_id=$1 AND category_is_virtual=true ${isAdmin ? "" : "AND active=true"} ORDER BY id`,
    isRoot ? [] : [categoryId]
  );
  const categories = catRes.rows;
  const products = productRes.rows;
  const currentCategory = isRoot ? null : (await q("SELECT * FROM manual_categories WHERE id=$1", [categoryId])).rows[0];
  const categoryBtns = categories.map(c =>
    Markup.button.callback(`${c.active ? "ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع‘" : "ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬â„¢"} ${c.name}`.slice(0, 60), `mcat:${c.id}:1:${categoryId}`)
  );
  const productBtns = products.map(m => {
    const usd = Number(m.price_usd);
    const syp = Math.round(usd * rate);
    return Markup.button.callback(`ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ${m.name} ط£آ¢أ¢â€ڑآ¬ط¢آ¢ ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ط·آ¸أ¢â‚¬â€چ.ط·آ·ط¢آ³`.slice(0, 60), `mprod:${m.id}:${categoryId}`);
  });
  const all = [...categoryBtns, ...productBtns];
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const safe = Math.min(Math.max(1, page), totalPages);
  saveNavPage(ctx.from.id, `manual:${categoryId}`, safe);
  const slice = all.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE);

  const rows = [];
  if (isAdmin) {
    if (isRoot) {
      rows.push([Markup.button.callback("ط£آ¢ط¹â€کأ¢â€‍آ¢ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ¥ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ© ط·آ·ط¢آ£ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "adm:manualCats")]);
      rows.push([Markup.button.callback("ط£آ¢أ¢â‚¬ع†أ¢â‚¬آ¢ ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¢آ© ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦", "adm:addManual")]);
    } else {
      rows.push([
        Markup.button.callback("ط£آ¢ط¥â€œط¹ث†ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦", `adm:mcatEdit:${categoryId}`),
        Markup.button.callback(categories.length ? "ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع‘ ط·آ·ط¢آ¥ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¾ط·آ·ط¢آ±ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ط·آ·ط¢آ©" : "ط£آ¢أ¢â‚¬ع†أ¢â‚¬آ¢ ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ¸ط¸آ¾ط·آ·ط¢آ±ط·آ·ط¢آ¹ط·آ¸ط¸آ¹", `adm:manualCats:${categoryId}`),
      ]);
      rows.push([
        Markup.button.callback("ط£آ¢أ¢â‚¬ع†أ¢â‚¬آ¢ ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¢آ© ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ ط·آ¸أ¢â‚¬طŒط·آ¸أ¢â‚¬ ط·آ·ط¢آ§", `adm:addManualInCat:${categoryId}`),
        Markup.button.callback(currentCategory?.active ? "ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¢آ´ ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ·ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦" : "ط¸â€¹ط¹ط›ط¹ط›ط¢آ¢ ط·آ·ط¹آ¾ط·آ¸ط¸آ¾ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦", `adm:mcatToggle:${categoryId}`),
      ]);
      rows.push([
        Markup.button.callback("ط¸â€¹ط¹ط›ط¹â€کط¹â€ک ط·آ·ط¢آ¥ط·آ·ط¢آ®ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ¬ ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾", `adm:mcatMoveAll:${categoryId}`),
        Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â€‌أ¢â‚¬ع©ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ­ط·آ·ط¢آ°ط·آ¸ط¸آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦", `adm:mcatDel:${categoryId}`),
      ]);
    }
  }
  for (const b of slice) rows.push([b]);
  const nav = [];
  if (safe > 1) nav.push(Markup.button.callback(prevLabel, `mcat:${categoryId}:${safe - 1}:${backTo}`));
  nav.push(Markup.button.callback(`${safe}/${totalPages}`, "noop"));
  if (safe < totalPages) nav.push(Markup.button.callback(nextLabel, `mcat:${categoryId}:${safe + 1}:${backTo}`));
  if (nav.length > 1) rows.push(nav);

  const backAction = isRoot
    ? "cat:0:1:0"
    : `mcat:${backTo}:${getNavPage(ctx.from.id, `manual:${backTo}`)}:0`;
  rows.push([
    Markup.button.callback(backLabel, backAction),
    Markup.button.callback(homeLabel, "home"),
  ]);
  const title = isRoot ? "ط¸â€¹ط¹ط›ط¢آ§ط·â€؛ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸ط¸آ¹ط·آ·ط¢آ©" : `ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع‘ ${currentCategory?.name ?? "ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸ط¸آ¹"}`;
  await sendOrEdit(ctx, title, Markup.inlineKeyboard(rows));
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
  if (!vc || (!vc.active && !isAdmin)) { await sendOrEdit(ctx, "ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ°ط·آ·ط¢آ§ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ·ط¢آ­.", Markup.inlineKeyboard([[Markup.button.callback("ط¸â€¹ط¹ط›ط¹ث†  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "home")]])); return; }
  let backBtn;
  if (backTo === 0) {
    backBtn = Markup.button.callback(backLabel, "cat:0:1:0");
  } else {
    const parentVcat = (await q("SELECT id FROM virtual_categories WHERE id=$1", [backTo])).rows[0];
    backBtn = parentVcat ? Markup.button.callback(backLabel, `vcat:${backTo}:1:0`) : Markup.button.callback(backLabel, `cat:${backTo}:1:0`);
  }

  const subVcRes = await q("SELECT * FROM virtual_categories WHERE parent_id=$1 ORDER BY position", [vcId]);
  const subVcs = isAdmin ? subVcRes.rows : subVcRes.rows.filter(v => v.active);
  const subVcBtns = subVcs.map(v => Markup.button.callback(`${v.active ? "ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع‘ " : "ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬â„¢ "}${v.name}`.slice(0, 60), `vcat:${v.id}:1:${vcId}`));

  const movedPids = [];
  for (const [pid, ov] of allOv) { if (ov.customCategoryId === vcId) movedPids.push(pid); }
  const products = allProducts.filter(p => movedPids.includes(p.id));
  const visible = products.filter(p => {
    if (isExcludedProduct(p, kws)) return false;
    const ov = allOv.get(p.id);
    if (ov?.deleted) return false;
    if (ov?.hidden && !isAdmin) return false;
    if (!p.available && !isAdmin) return false;
    return true;
  });

  const mpRes = isAdmin
    ? await q("SELECT * FROM manual_products WHERE category_id=$1 AND category_is_virtual=true ORDER BY id", [vcId])
    : await q("SELECT * FROM manual_products WHERE category_id=$1 AND category_is_virtual=true AND active=true ORDER BY id", [vcId]);
  const manualBtnsVc = mpRes.rows.map(m => {
    const usd = Number(m.price_usd); const syp = Math.round(usd * rate);
    return Markup.button.callback(`ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ${m.name} ط£آ¢أ¢â€ڑآ¬ط¢آ¢ ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ط·آ¸أ¢â‚¬â€چ.ط·آ·ط¢آ³`.slice(0, 60), `mprod:${m.id}:${vcId}`);
  });

  if (!visible.length && !subVcBtns.length && !manualBtnsVc.length && !isAdmin) { await sendOrEdit(ctx, "ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ­ ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ°ط·آ·ط¢آ§ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط·â€؛ ط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹.", Markup.inlineKeyboard([[backBtn, Markup.button.callback(homeLabel, "home")]])); return; }

  const ovMap = await loadOverrideMap(visible.map(p => p.id));
  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ·ط¹آ¾ط·آ·ط¢آ·ط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع‘ markup ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ®ط·آ·ط¢آ§ط·آ·ط¢آµ ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  const prodBtns = await Promise.all(visible.map(async p => {
    const ov = ovMap.get(p.id);
    const usd = await effectivePriceUsd(p, ov, markup, socialMarkup, socialKws, null, userMarkupPercent);
    const syp = Math.round(usd * rate);
    return Markup.button.callback(`${ov?.hidden ? "ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬â„¢ " : "ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ "}${ov?.customName ?? p.name} ط£آ¢أ¢â€ڑآ¬ط¢آ¢ ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ط·آ¸أ¢â‚¬â€چ.ط·آ·ط¢آ³`.slice(0, 60), `prod:${p.id}:${vcId}`);
  }));

  const allBtns = [...subVcBtns, ...prodBtns, ...manualBtnsVc];
  const totalPages = Math.max(1, Math.ceil(allBtns.length / PAGE_SIZE));
  const safe = Math.min(Math.max(1, page), totalPages);
  saveNavPage(ctx.from.id, vcId, safe);
  const slice = allBtns.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE);

  const rows = [];
  if (isAdmin) {
    rows.push([Markup.button.callback("ط£آ¢ط¥â€œط¹ث†ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦", `adm:vcEdit:${vcId}`), Markup.button.callback(vc.active ? "ط¸â€¹ط¹ط›أ¢â€‍آ¢ط«â€  ط·آ·ط¢آ¥ط·آ·ط¢آ®ط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط·إ’" : "ط¸â€¹ط¹ط›أ¢â‚¬ع©ط¸آ¾ ط·آ·ط¢آ¥ط·آ·ط¢آ¸ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ§ط·آ·ط¢آ±", `adm:vcToggle:${vcId}`)]);
    rows.push([Markup.button.callback("ط£آ¢أ¢â‚¬ع†أ¢â‚¬آ¢ ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ¸ط¸آ¾ط·آ·ط¢آ±ط·آ·ط¢آ¹ط·آ¸ط¸آ¹", `adm:addVCatSub:${vcId}`), Markup.button.callback("ط¸â€¹ط¹ط›ط¹â€کط¹â€ک ط·آ·ط¢آ¥ط·آ·ط¢آ®ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ¬ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾", `adm:vcMoveAll:${vcId}`)]);
    rows.push([Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â€‌أ¢â‚¬ع©ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ­ط·آ·ط¢آ°ط·آ¸ط¸آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦", `adm:vcDel:${vcId}`)]);
  }
  for (const b of slice) rows.push([b]);
  const nav = [];
  if (safe > 1) nav.push(Markup.button.callback(prevLabel, `vcat:${vcId}:${safe - 1}:${backTo}`));
  nav.push(Markup.button.callback(`${safe}/${totalPages}`, "noop"));
  if (safe < totalPages) nav.push(Markup.button.callback(nextLabel, `vcat:${vcId}:${safe + 1}:${backTo}`));
  if (nav.length > 1) rows.push(nav);
  rows.push([backBtn, Markup.button.callback(homeLabel, "home")]);
  await sendOrEdit(ctx, `ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع‘ ${vc.name}`, Markup.inlineKeyboard(rows));
}

async function showManualProduct(ctx, mId, backTo) {
  const [backLabel, homeLabel] = await Promise.all([getBtnBackLabel(), getBtnHomeLabel()]);
  let backBtn;
  if (backTo === 0) {
    backBtn = Markup.button.callback(backLabel, "cat:0:1:0");
  } else {
    const parentIsManualCat = (await q("SELECT id FROM manual_categories WHERE id=$1", [backTo])).rows[0];
    backBtn = parentIsManualCat
      ? Markup.button.callback(backLabel, `mcat:${backTo}:${getNavPage(ctx.from.id, `manual:${backTo}`)}:0`)
      : Markup.button.callback(backLabel, `cat:${backTo}:1:0`);
  }
  const mRes = await q("SELECT * FROM manual_products WHERE id=$1", [mId]);
  const m = mRes.rows[0];
  const [u, sessionActive] = await Promise.all([getUser(ctx.from.id), isAdminSessionActive(ctx.from.id)]);
  const isAdmin = !!u?.is_admin && (authedAdminIds.has(ctx.from.id) || sessionActive);
  if (!m || (!m.active && !isAdmin)) { await sendOrEdit(ctx, "ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ·ط¢آ­.", Markup.inlineKeyboard([[backBtn, Markup.button.callback(homeLabel, "home")]])); return; }
  const rate = await getExchangeRate();
  const usd = Number(m.price_usd); const syp = Math.round(usd * rate);
  const balance = u ? Number(u.balance) : 0;
  const canAfford = balance >= usd;
  const text = `ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ${m.name}\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ¹ط·آ·ط¢آ±: ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ط·آ¸أ¢â‚¬â€چ.ط·آ·ط¢آ³\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯: ${formatBalance(balance, rate)}${m.instructions ? `\n\nط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬آ¹ ${m.instructions}` : ""}`;
  const rows = [];
  if (m.active && canAfford) rows.push([Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¢ط·آ¸أ¢â‚¬ ", `mbuy:${m.id}`)]);
  else if (m.active && !canAfford) rows.push([Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ³ ط·آ·ط¢آ´ط·آ·ط¢آ­ط·آ¸أ¢â‚¬  ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯", "deposit")]);
  if (isAdmin) rows.push([Markup.button.callback("ظ‹ع؛â€”â€کأ¯آ¸عˆ ط·آ­ط·آ°ط¸ظ¾ ط·آ§ط¸â€‍ط¸â€¦ط¸â€ ط·ع¾ط·آ¬ ط¸â€ ط¸â€،ط·آ§ط·آ¦ط¸ظ¹ط·آ§ط¸â€¹", `adm:deleteManualProdAsk:${m.id}`)]);
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
    parts.push(repairArabicEncoding(resp.message.trim()));
  }
  const orderData = extractOrderData(resp);
  if (orderData?.status && typeof orderData.status === "string") {
    const raw = orderData.status;
    const label = statusLabel(raw);
    if (!parts.some(p => p.includes(raw) || p.includes(label))) {
      if (!ACCEPT_STATUSES.has(raw.toLowerCase())) parts.push(`ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¸آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ©: ${label}`);
    }
  }
  return repairArabicEncoding([...new Set(parts)].filter(Boolean).join("\n\n").trim());
}

function formatFullApiResponse(resp) {
  return formatApiResponseClean(resp);
}

function parseQtyValues(qv, product = null) {
  const type = String(product?.product_type ?? product?.productType ?? product?.type ?? "").toLowerCase();
  const declaredQuantity = product?.quantity ?? product?.qty ?? product?.quantity_value;
  if (type === "package" || type === "fixed" || (Number(declaredQuantity) === 1 && !product?.min && !product?.max)) {
    return { kind: "fixed" };
  }
  if (!qv) return { kind: "fixed" };
  if (typeof qv === "number" || (typeof qv === "string" && Number.isFinite(Number(qv)))) {
    return { kind: "fixed" };
  }
  if (Array.isArray(qv)) return { kind: "list", values: qv.map(v => Number(v)).filter(Number.isFinite) };
  const min = Number(qv.min);
  const max = Number(qv.max);
  if (min === 1 && max === 1) return { kind: "fixed" };
  return { kind: "range", min, max };
}

function statusLabel(s) {
  const n = (s ?? "").toString().toLowerCase().trim();
  if (ACCEPT_STATUSES.has(n) || n === "1" || n === "true") return "ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ¨ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چ";
  if (REJECT_STATUSES.has(n) || n === "0" || n === "false") return "ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ¸ط¸آ¾ط·آ¸ط«â€ ط·آ·ط¢آ¶";
  return "ط£آ¢ط¹ث†ط¢آ³ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¸ط·آ·ط¢آ§ط·آ·ط¢آ±";
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
  return `${Number(qty).toLocaleString("en-US")} ط£آ¢أ¢â€ڑآ¬أ¢â‚¬â€Œ ${totalStr}$`;
}

async function startOrderFlow(ctx, productId, backTo) {
  let all = await getCachedProducts();
  let p = all.find(x => x.id === productId);
  if (!p) { all = await getCachedProducts(); p = all.find(x => x.id === productId); }
  if (!p) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¯."); return; }
  if (!p.available) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ°ط·آ·ط¢آ§ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ·ط¢آ­ ط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹."); return; }

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ط·آ·ط¢آ° ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ·ط¢آ²ط·آ¸ط¹â€  ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ³ط·آ·ط¢آ±ط·آ¸ط¸آ¹ط·آ·ط¢آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ·ط¢آ© ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
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
  const quantityMode = parseQtyValues(p.qty_values, p);

  if (isSocial && quantityMode.kind !== "fixed") {
    const parsedSocial = quantityMode;
    if (parsedSocial.kind === "list" && parsedSocial.values.length > 0) {
      setStep(ctx.from.id, { kind: "order:qty", productId: p.id, productName: p.name, priceUsd: unitPriceUsd, paramKeys, qtyValues: parsedSocial.values, backTo });
      const rows = parsedSocial.values.slice(0, 24).map(v => {
        const label = formatPriceLabel(v, unitPriceUsd);
        return [Markup.button.callback(label, `ord:qty:${v}`)];
      });
      rows.push([Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "ord:cancel")]);
      await sendOrEdit(ctx, `ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ${p.name}\n\nط·آ·ط¢آ§ط·آ·ط¢آ®ط·آ·ط¹آ¾ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¦â€™ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ©:`, Markup.inlineKeyboard(rows)); return;
    }
    let min, max;
    if (parsedSocial.kind === "range" && Number.isFinite(parsedSocial.min) && parsedSocial.min > 0)
      { min = parsedSocial.min; max = parsedSocial.max; }
    else { min = await getSocialMinQty(); max = await getSocialMaxQty(); }
    setStep(ctx.from.id, { kind: "order:qty", productId: p.id, productName: p.name, priceUsd: unitPriceUsd, paramKeys, qtyValues: { min, max }, backTo });
    await sendOrEdit(ctx, `ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ${p.name}\n\nط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¦â€™ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ© (ط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬  ${min.toLocaleString("en-US")} ط·آ¸ط«â€  ${max.toLocaleString("en-US")}):`, Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "ord:cancel")]])); return;
  }

  const parsed = quantityMode;
  if (parsed.kind === "fixed") { await askNextParam(ctx, p, unitPriceUsd, 1, paramKeys, {}, 0, backTo); return; }
  if (parsed.kind === "list") {
    setStep(ctx.from.id, { kind: "order:qty", productId: p.id, productName: p.name, priceUsd: unitPriceUsd, paramKeys, qtyValues: parsed.values, backTo });
    const rows = parsed.values.slice(0, 24).map(v => {
      const label = formatPriceLabel(v, unitPriceUsd);
      return [Markup.button.callback(label, `ord:qty:${v}`)];
    });
    rows.push([Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "ord:cancel")]);
    await sendOrEdit(ctx, `ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ${p.name}\nط·آ·ط¢آ§ط·آ·ط¢آ®ط·آ·ط¹آ¾ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¦â€™ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ©:`, Markup.inlineKeyboard(rows)); return;
  }
  setStep(ctx.from.id, { kind: "order:qty", productId: p.id, productName: p.name, priceUsd: unitPriceUsd, paramKeys, qtyValues: { min: parsed.min, max: parsed.max }, backTo });
  await sendOrEdit(ctx, `ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ${p.name}\nط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¦â€™ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ© (ط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬  ${parsed.min} ط·آ¸ط«â€  ${parsed.max}):`, Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "ord:cancel")]]));
}

async function askNextParam(ctx, p, unitPriceUsd, qty, paramKeys, collected, idx, backTo) {
  if (idx >= paramKeys.length) { await showOrderConfirmation(ctx, p, unitPriceUsd, qty, collected, backTo); return; }
  setStep(ctx.from.id, { kind: "order:params", productId: p.id, productName: p.name, priceUsd: unitPriceUsd, qty, paramKeys, collected, idx, backTo });
  const key = paramKeys[idx];
  await ctx.reply(`ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬إ’ ط·آ·ط¢آ£ط·آ·ط¢آ¯ط·آ·ط¢آ®ط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬ع‘ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬â€چ: *${key}*`, { parse_mode: "Markdown", ...Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "ord:cancel")]]) });
}

async function showOrderConfirmation(ctx, p, unitPriceUsd, qty, collected, backTo) {
  const totalUsd = Number((unitPriceUsd * qty).toFixed(4));
  const rate = await getExchangeRate();
  const totalSyp = Math.round(totalUsd * rate);
  const u = await getUser(ctx.from.id);
  const balance = u ? Number(u.balance) : 0;
  const paramsLines = Object.entries(collected).map(([k, v]) => `ط£آ¢أ¢â€ڑآ¬ط¢آ¢ ${k}: ${v}`).join("\n");
  setStep(ctx.from.id, { kind: "order:params", productId: p.id, productName: p.name, priceUsd: unitPriceUsd, qty, paramKeys: Object.keys(collected), collected, idx: Object.keys(collected).length, backTo });
  const lowBalance = balance < totalUsd;
  const totalUsdStr = totalUsd < 0.005 ? totalUsd.toFixed(4) : totalUsd.toFixed(2);
  const text = `ط¸â€¹ط¹ط›ط¢آ§ط¢آ¾ ط·آ·ط¹آ¾ط·آ·ط¢آ£ط·آ¸ط¦â€™ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨\n\nط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬: ${p.name}\nط¸â€¹ط¹ط›أ¢â‚¬â€Œط¢آ¢ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¦â€™ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ©: ${qty.toLocaleString("en-US")}\n${paramsLines ? paramsLines + "\n" : ""}ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ° ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¬ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹: ${totalUsdStr}$ | ${totalSyp.toLocaleString("en-US")} ط·آ¸أ¢â‚¬â€چ.ط·آ·ط¢آ³\nط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ³ ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط¦â€™: ${formatBalance(balance, rate)}\n\n${lowBalance ? "ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ³ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ¸ط¦â€™ ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ¸ط¦â€™ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹. ط·آ¸ط¸آ¹ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ´ط·آ·ط¢آ­ط·آ¸أ¢â‚¬  ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط¦â€™ ط·آ·ط¢آ«ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¬ط·آ·ط¢آ¯ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹." : "ط·آ¸أ¢â‚¬طŒط·آ¸أ¢â‚¬â€چ ط·آ·ط¹آ¾ط·آ·ط¢آ±ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ·ط¹آ¾ط·آ·ط¢آ£ط·آ¸ط¦â€™ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¹ط›"}`;
  const rows = lowBalance
    ? [[Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ³ ط·آ·ط¢آ´ط·آ·ط¢آ­ط·آ¸أ¢â‚¬  ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯", "deposit")], [Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "ord:cancel")]]
    : [[Markup.button.callback("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ·ط¢آ£ط·آ¸ط¦â€™ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ¸ط«â€ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ط·آ·ط¢آ°", "ord:confirm"), Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "ord:cancel")]];
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

const orderExecutionLocks = new Set();
async function executeOrder(ctx) {
  const uid = ctx.from.id;
  if (orderExecutionLocks.has(uid)) {
    await ctx.answerCbQuery("ط£آ¢ط¹ث†ط¢آ³ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط¦â€™ ط·آ¸أ¢â‚¬ع‘ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ¸أ¢â‚¬ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ط·آ·ط¢آ°...").catch(() => {});
    return;
  }
  orderExecutionLocks.add(uid);
  try {
    return await executeOrderInternal(ctx);
  } finally {
    orderExecutionLocks.delete(uid);
  }
}

async function executeOrderInternal(ctx) {
  const step = getStep(ctx.from.id);
  if (step.kind !== "order:params") return;
  let all = await getCachedProducts(); let p = all.find(x => x.id === step.productId);
  if (!p) { all = await getCachedProducts(); p = all.find(x => x.id === step.productId); }
  if (!p) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¯."); return; }

  const totalUsd = Number((step.priceUsd * step.qty).toFixed(4));
  const u = await getUser(ctx.from.id);
  const balance = u ? Number(u.balance) : 0;
  if (balance < totalUsd) { await ctx.reply("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ³ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ¸ط¦â€™ ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ¸ط¦â€™ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ¸ط¹â€ .", Markup.inlineKeyboard([[Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ³ ط·آ·ط¢آ´ط·آ·ط¢آ­ط·آ¸أ¢â‚¬  ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯", "deposit")], [Markup.button.callback("ط¸â€¹ط¹ط›ط¹ث†  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "home")]])); setStep(ctx.from.id, { kind: "idle" }); return; }
  await clearInlineKeyboard(ctx).catch(() => {});
  const orderUuid = crypto.randomUUID();
  const debited = await debitBalance(ctx.from.id, totalUsd);
  if (!debited) {
    setStep(ctx.from.id, { kind: "idle" });
    await ctx.reply("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¹آ¾ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع©ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ط·آ·ط¢آ° ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨. ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬ع©ط·آ·ط¢آ« ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ¸ط«â€ ط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¬ط·آ·ط¢آ¯ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹.", Markup.inlineKeyboard([[Markup.button.callback("ط¸â€¹ط¹ط›ط¹ث†  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "home")]]));
    return;
  }
  const execRate = await getExchangeRate();
  const totalSyp = Math.round(totalUsd * execRate);
  const params = { ...step.collected };
  if (step.qty && step.qty !== 1) params["qty"] = step.qty;
  const insRes = await q(
    `INSERT INTO orders(user_id,product_id,product_name,qty,params,price_usd,oranos_uuid,api_source_id,external_product_id,status)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending') RETURNING *`,
    [ctx.from.id, p.id, p.name, String(step.qty), JSON.stringify(step.collected), String(totalUsd), orderUuid,
      Number(p.source_id || 1), String(p.source_product_id ?? p.id)]
  );
  const order = insRes.rows[0];
  await ctx.reply("ط£آ¢ط¹ث†ط¢آ³ ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ¸ط¸آ¹ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ط·آ·ط¢آ° ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط¦â€™...");
  let resp;
  let finalApiStatus;

  try {
    resp = await placeOrderForProduct(p, params, orderUuid);
    const initialStatus = (resp?.status ?? "").toLowerCase();

    if (ACCEPT_STATUSES.has(initialStatus) || REJECT_STATUSES.has(initialStatus)) {
      finalApiStatus = initialStatus;
    } else {
      // ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¸ط·آ·ط¢آ± ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ¸ط¸آ¹ط·آ·ط¢آ¬ط·آ·ط¢آ© API ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ®ط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ ط·آ·ط¢آ¶ط·آ·ط·â€؛ط·آ·ط¢آ·ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ط·آ·أ¢â‚¬ط› ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬طŒط·آ·ط¢آ§ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â€ڑآ¬poller ط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ®ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ط·آ·ط¢آ©.
      // ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¸ط·آ·ط¢آ§ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬ع‘ ط·آ¸ط¦â€™ط·آ·ط¢آ§ط·آ¸أ¢â‚¬  ط·آ¸ط¸آ¹ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬ع‘ط·آ¸ط¸آ¹ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¸آ¾ط·آ·ط¹آ¾ط·آ¸ط«â€ ط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ·ط¢آ­ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ° 150 ط·آ·ط¢آ«ط·آ·ط¢آ§ط·آ¸أ¢â‚¬ ط·آ¸ط¸آ¹ط·آ·ط¢آ©.
      finalApiStatus = "pending";
    }
  } catch {
    resp = { status: "ERR", message: "ط·آ·ط¢آ®ط·آ·ط¢آ·ط·آ·ط¢آ£ ط·آ·ط¢آ´ط·آ·ط¢آ¨ط·آ¸ط¦â€™ط·آ·ط¢آ©" };
    finalApiStatus = "err";
  }

  const success = ACCEPT_STATUSES.has(finalApiStatus);
  const isRejected = REJECT_STATUSES.has(finalApiStatus);
  const isPending = !success && !isRejected && finalApiStatus !== "err";

  if (isRejected || finalApiStatus === "err") {
    await adjustBalance(ctx.from.id, totalUsd);
    const checkResp = await checkOrderForSource(orderUuid, p.source_id, true).catch(() => null);
    const detailedResp = checkResp ?? resp;
    await q("UPDATE orders SET status='reject', api_response=$1 WHERE id=$2", [JSON.stringify(detailedResp), order.id]);
    setStep(ctx.from.id, { kind: "idle" });
    const rejectReason = extractDeliveredCode(detailedResp) ||
      (detailedResp?.message && detailedResp.message !== "Network error" ? detailedResp.message : null);
    // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¹ط·آ·ط¢آ±ط·آ·ط¢آ¶ ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
    await ctx.reply(
      `ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ±ط·آ¸ط¸آ¾ط·آ·ط¢آ¶ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨.\n` +
      (rejectReason ? `ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ¨ط·آ·ط¢آ¨: ${rejectReason}\n` : "") +
      `ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ ط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ© ${totalUsd.toFixed(2)}$ | ${totalSyp.toLocaleString("en-US")} ط·آ¸أ¢â‚¬â€چ.ط·آ·ط¢آ³ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط¦â€™.`,
      Markup.inlineKeyboard([[Markup.button.callback("ط¸â€¹ط¹ط›ط¹ث†  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "home")]])
    );
    return;
  }

  if (isPending) {
    await q("UPDATE orders SET status='pending', api_response=$1 WHERE id=$2", [JSON.stringify(resp), order.id]);
    setStep(ctx.from.id, { kind: "idle" });
    // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¹ط·آ·ط¢آ±ط·آ·ط¢آ¶ ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
    await ctx.reply(
      `ط£آ¢ط¹ث†ط¢آ³ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط¦â€™ ط·آ¸أ¢â‚¬ع‘ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ط·آ·ط¢آ©.\nط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ${p.name} ط·آ£أ¢â‚¬â€‌ ${step.qty}\nط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ° ${totalUsd.toFixed(2)}$ | ${totalSyp.toLocaleString("en-US")} ط·آ¸أ¢â‚¬â€چ.ط·آ·ط¢آ³\n\nط·آ·ط¢آ³ط·آ·ط¢آ£ط·آ¸ط¹ث†ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸ط¦â€™ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¯ ط·آ·ط¢آ§ط·آ¸ط¦â€™ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬طŒ.`,
      Markup.inlineKeyboard([
        [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬â€چ ط·آ·ط¹آ¾ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ« ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ©", `ord:check:${order.id}`)],
        [Markup.button.callback("ط¸â€¹ط¹ط›ط¹ث†  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "home")]
      ])
    );
    return;
  }

  const deliveredCode = extractDeliveredCode(resp);
  const orderData = extractOrderData(resp);
  const externalOrderId = orderData?.order_id ?? orderData?.id ?? resp?.order_id ?? null;
  await q("UPDATE orders SET status='accept', oranos_order_id=$1, external_order_id=$2, api_response=$3, delivered_code=$4 WHERE id=$5",
    [externalOrderId, externalOrderId, JSON.stringify(resp), deliveredCode ?? null, order.id]);
  setStep(ctx.from.id, { kind: "idle" });
  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¹ط·آ·ط¢آ±ط·آ·ط¢آ¶ ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  await ctx.reply(`ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ط·آ·ط¢آ° ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط¦â€™ ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¢آ­!\nط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ${p.name} ط·آ£أ¢â‚¬â€‌ ${step.qty}\nط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ° ${totalUsd.toFixed(2)}$ | ${totalSyp.toLocaleString("en-US")} ط·آ¸أ¢â‚¬â€چ.ط·آ·ط¢آ³`);
  if (deliveredCode) {
    await ctx.reply(`ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬ع© ط·آ·ط¹آ¾ط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨:\n\`\`\`\n${deliveredCode}\n\`\`\``,
      { parse_mode: "Markdown", ...Markup.inlineKeyboard([[Markup.button.callback("ط¸â€¹ط¹ط›ط¹ث†  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "home")]]) });
  } else {
    await ctx.reply("ط·آ·ط¢آ´ط·آ¸ط¦â€™ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¦â€™ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ ط·آ·ط¢آ§! ط¸â€¹ط¹ط›ط¥â€™ط¹ط›", Markup.inlineKeyboard([[Markup.button.callback("ط¸â€¹ط¹ط›ط¹ث†  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "home")]]));
  }
}

async function showMyOrders(ctx, page) {
  const limit = 8; const offset = (page - 1) * limit;
  const res = await q("SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3", [ctx.from.id, limit + 1, offset]);
  const hasNext = res.rows.length > limit; const slice = res.rows.slice(0, limit);
  if (!slice.length) { await sendOrEdit(ctx, "ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ­ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸ط¸آ¹ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ·ط¢آ¯ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ¸ط¦â€™ ط·آ·ط¢آ£ط·آ¸ط¸آ¹ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ¨ط·آ·ط¢آ¹ط·آ·ط¢آ¯.", Markup.inlineKeyboard([[Markup.button.callback("ط¸â€¹ط¹ط›ط¹ث†  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "home")]])); return; }
  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¹ط·آ·ط¢آ±ط·آ·ط¢آ¶ ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  const lines = slice.map(r => `ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ${r.product_name} ط·آ£أ¢â‚¬â€‌${r.qty} ط£آ¢أ¢â€ڑآ¬ط¢آ¢ ${Number(r.price_usd).toFixed(2)}$ ط£آ¢أ¢â€ڑآ¬ط¢آ¢ ${statusLabel(r.status)}`);
  const navRow = [];
  if (page > 1) navRow.push(Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬ع‘", `myorders:${page - 1}`));
  if (hasNext) navRow.push(Markup.button.callback("ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ ط£آ¢أ¢â‚¬ع†ط·إ’ط£آ¯ط¢آ¸ط¹ث†", `myorders:${page + 1}`));
  const kb = []; if (navRow.length) kb.push(navRow);
  kb.push([Markup.button.callback("ط¸â€¹ط¹ط›ط¹ث†  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "home")]);
  await sendOrEdit(ctx, `ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ¦ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾ط·آ¸ط¸آ¹\n\n${lines.join("\n")}`, Markup.inlineKeyboard(kb));
}

async function checkOrderStatus(ctx, orderId) {
  const res = await q("SELECT * FROM orders WHERE id=$1", [orderId]);
  const row = res.rows[0];
  if (!row || Number(row.user_id) !== ctx.from.id) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¯."); return; }
  if (!row.oranos_order_id) { await ctx.reply(`ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ©: ${statusLabel(row.status)}`); return; }
  try {
    const resp = await checkOrderForSource(row.oranos_order_id, row.api_source_id);
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
      // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¹ط·آ·ط¢آ±ط·آ·ط¢آ¶ ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
      if (code && !row.delivered_code) await ctx.reply(`ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬ع© ط·آ·ط¹آ¾ط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨:\n\n${code}`);
      else if (cleanText) await ctx.reply(`ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬آ¹ ط·آ·ط¹آ¾ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ« ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط¦â€™:\n\n${cleanText}`);
    }
    await ctx.reply(`ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ© ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط¦â€™: ${statusLabel(finalStatus)}`);
  } catch { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ°ط·آ¸أ¢â‚¬ع©ط·آ·ط¢آ± ط·آ¸ط¸آ¾ط·آ·ط¢آ­ط·آ·ط¢آµ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¢ط·آ¸أ¢â‚¬ ."); }
}

async function pollOneOrder(bot, order) {
  let resp = null;
  if (order.oranos_order_id) resp = await checkOrderForSource(order.oranos_order_id, order.api_source_id).catch(() => null);
  if (!resp && order.oranos_uuid) resp = await checkOrderForSource(order.oranos_uuid, order.api_source_id, true).catch(() => null);
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
    // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¹ط·آ·ط¢آ±ط·آ·ط¢آ¶ ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
    const msgLines = [
      `ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ±ط·آ¸ط¸آ¾ط·آ·ط¢آ¶ ط·آ·ط¢آ£ط·آ·ط¢آ­ط·آ·ط¢آ¯ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾ط·آ¸ط¦â€™`,
      `ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬: ${order.product_name}`,
      ...(rejectReply ? [`ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¯: ${rejectReply}`] : []),
      `ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ° ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ ط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ© ${priceUsd.toFixed(2)}$ | ${refundSyp.toLocaleString("en-US")} ط·آ¸أ¢â‚¬â€چ.ط·آ·ط¢آ³ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط¦â€™.`
    ];
    await bot.telegram.sendMessage(order.user_id, msgLines.join("\n"),
      Markup.inlineKeyboard([[Markup.button.callback("ط¸â€¹ط¹ط›ط¹ث†  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "home")]])).catch(() => {});
  } else if (isAccepted) {
    const priceSyp = Math.round(priceUsd * rate);
    // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¹ط·آ·ط¢آ±ط·آ·ط¢آ¶ ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
    const msgLines = [
      `ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ط·آ·ط¢آ° ط·آ·ط¢آ£ط·آ·ط¢آ­ط·آ·ط¢آ¯ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾ط·آ¸ط¦â€™ ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¢آ­!`,
      `ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬: ${order.product_name}`,
      `ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ° ${priceUsd.toFixed(2)}$ | ${priceSyp.toLocaleString("en-US")} ط·آ¸أ¢â‚¬â€چ.ط·آ·ط¢آ³`
    ];
    if (code) {
      msgLines.push(`\nط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬ع© ط·آ·ط¹آ¾ط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨:\n\`\`\`\n${code}\n\`\`\``);
      await bot.telegram.sendMessage(order.user_id, msgLines.join("\n"),
        { parse_mode: "Markdown", ...Markup.inlineKeyboard([[Markup.button.callback("ط¸â€¹ط¹ط›ط¹ث†  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "home")]]) }).catch(() => {});
    } else if (cleanText) {
      msgLines.push(`\nط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬آ¹ ط·آ·ط¹آ¾ط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨:\n\`\`\`\n${cleanText}\n\`\`\``);
      await bot.telegram.sendMessage(order.user_id, msgLines.join("\n"),
        { parse_mode: "Markdown", ...Markup.inlineKeyboard([[Markup.button.callback("ط¸â€¹ط¹ط›ط¹ث†  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "home")]]) }).catch(() => {});
    } else {
      await bot.telegram.sendMessage(order.user_id, msgLines.join("\n"),
        Markup.inlineKeyboard([[Markup.button.callback("ط¸â€¹ط¹ط›ط¹ث†  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "home")]])).catch(() => {});
    }
  }
}

function startOrderPoller(bot) {
  let running = false;
  setInterval(async () => {
    if (running) return;
    running = true;
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
    finally { running = false; }
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
    await ctx.reply("ط£آ¢أ¢â‚¬ط›أ¢â‚¬â€Œ ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ°ط·آ·ط¢آ§ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ© ط·آ¸ط¸آ¾ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ·.");
    return false;
  }
  if (!sessionActive && !authedAdminIds.has(ctx.from.id)) {
    setStep(ctx.from.id, { kind: "admin:login" });
    await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬ع© ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ¸ط«â€ ط·آ·ط¢آ± ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ·ط¢آ®ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ¸أ¢â‚¬â€چط·آ¸ط«â€ ط·آ·ط¢آ­ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ©:");
    return false;
  }
  if (!sessionActive && authedAdminIds.has(ctx.from.id)) {
    authedAdminIds.delete(ctx.from.id);
    setStep(ctx.from.id, { kind: "admin:login" });
    await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬ع© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬طŒط·آ·ط¹آ¾ ط·آ·ط¢آ¬ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ©. ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ¸ط«â€ ط·آ·ط¢آ± ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ·ط¢آ®ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¬ط·آ·ط¢آ¯ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹:");
    return false;
  }
  return true;
}

async function requireSuperAdmin(ctx) {
  const [u, sessionActive] = await Promise.all([getUser(ctx.from.id), isAdminSessionActive(ctx.from.id)]);
  if (!u?.is_super_admin || (!sessionActive && !authedAdminIds.has(ctx.from.id))) {
    await ctx.reply("ط£آ¢أ¢â‚¬ط›أ¢â‚¬â€Œ ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ°ط·آ·ط¢آ§ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¬ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط·إ’ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ¸ط¸آ¾ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ·.");
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
    [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ¥ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹", "adm:depList:1"), Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬ع©ط¢آ¥ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ¸أ¢â‚¬ ", "adm:users:1")],
    [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¹â€  ط·آ·ط¢آ¨ط·آ·ط¢آ­ط·آ·ط¢آ« ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦", "adm:findUser"), Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ¦ ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾", "adm:allOrders:1")],
    [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ£ ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ط·آ·ط¢آ¬ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "adm:broadcast"), Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ³ ط·آ·ط¢آ·ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹", "adm:methods")],
    [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ط·آ·ط¢آ¥ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾", "cat:0:1:0"), Markup.button.callback("ط£آ¢ط¹â€کأ¢â€‍آ¢ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¹آ¾", "adm:settings")],
    [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع† ط·آ¸ط«â€ ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ·ط¢آµط·آ¸أ¢â‚¬â€چ", "adm:contacts"), Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¸آ¾ ط·آ·ط¢آ£ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ®ط·آ·ط¢آµط·آ·ط¢آµط·آ·ط¢آ©", "adm:vcList")],
    [Markup.button.callback("ط£آ¢أ¢â‚¬ع†أ¢â‚¬آ¢ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸ط¸آ¹", "adm:manualProds"), Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬ط› ط£آ¯ط¢آ¸ط¹ث† ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ¹ط·آ·ط¢آ¯ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ©", "adm:aiSupport")],
    [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¥â€™ APIs ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾", "adm:apis"), Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬â€چ ط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¬ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸ط¸آ¹", "adm:ping")],
    [Markup.button.callback(status === "on" ? "ط¸â€¹ط¹ط›ط¹ط›ط¢آ¢ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط«â€ ط·آ·ط¹آ¾: ط·آ·ط¢آ´ط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چ" : "ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¢آ´ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط«â€ ط·آ·ط¹آ¾: ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ط·آ¸ط«â€ ط·آ¸أ¢â‚¬ع‘ط·آ¸ط¸آ¾", "adm:toggleStatus")],
    [Markup.button.callback("ط¸â€¹ط¹ط›ط¹â€کط¹آ¾ ط·آ·ط¹آ¾ط·آ·ط¢آ³ط·آ·ط¢آ¬ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ®ط·آ·ط¢آ±ط·آ¸ط«â€ ط·آ·ط¢آ¬", "adm:logout"), Markup.button.callback("ط¸â€¹ط¹ط›ط¹ث†  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "home")],
  ];
  await sendOrEdit(ctx, `ط¸â€¹ط¹ط›أ¢â‚¬ع©أ¢â‚¬ع© ط·آ¸أ¢â‚¬â€چط·آ¸ط«â€ ط·آ·ط¢آ­ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ©${isSA ? " (ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آ£ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ°)" : ""}`, Markup.inlineKeyboard(rows));
}

async function showSettingsMenu(ctx) {
  if (!(await requireAdmin(ctx))) return;
  const [m, sm, r] = await Promise.all([getMarkupPercent(), getSocialMarkupPercent(), getExchangeRate()]);
  const loginCmd = await getAdminLoginCommand();
  const u = await getUser(ctx.from.id);
  const isSA = !!u?.is_super_admin;
  const rows = [
    [Markup.button.callback("ط£آ¢ط¥â€œط¹ث†ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¨ط·آ·ط¢آ­ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦", "adm:setMarkup")],
    [Markup.button.callback("ط£آ¢ط¥â€œط¹ث†ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ±ط·آ·ط¢آ¨ط·آ·ط¢آ­ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ¸ط«â€ ط·آ·ط¢آ´ط·آ¸أ¢â‚¬â€چ", "adm:setSocialMarkup")],
    [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ± ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ³ط·آ·ط¢آ¹ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آµط·آ·ط¢آ±ط·آ¸ط¸آ¾", "adm:setRate")],
    [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬ع© ط·آ·ط¹آ¾ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ¸ط«â€ ط·آ·ط¢آ±", "adm:newPass")],
    [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¹آ© ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ£ط·آ·ط¢آ²ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬â€چ", "adm:btnLabels")],
  ];
  if (isSA) {
    rows.push([Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¹آ¯ ط·آ·ط¹آ¾ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آ£ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ·ط¢آ®ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ±ط·آ¸ط¸آ¹", "adm:changeLoginCmd")]);
  }
  rows.push([Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "admin:menu")]);
  await sendOrEdit(ctx, `ط£آ¢ط¹â€کأ¢â€‍آ¢ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¹آ¾\n\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¨ط·آ·ط¢آ­ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦: ${m}%\nط·آ·ط¢آ±ط·آ·ط¢آ¨ط·آ·ط¢آ­ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ¸ط«â€ ط·آ·ط¢آ´ط·آ¸أ¢â‚¬â€چ: ${sm}%\nط·آ·ط¢آ³ط·آ·ط¢آ¹ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آµط·آ·ط¢آ±ط·آ¸ط¸آ¾: ${r} ط·آ¸أ¢â‚¬â€چ.ط·آ·ط¢آ³/$\nط·آ·ط¢آ£ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ·ط¢آ®ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چ: \`${loginCmd}\``,
    Markup.inlineKeyboard(rows));
}

async function showApiSources(ctx) {
  if (!(await requireAdmin(ctx))) return;
  const sources = await listApiSources();
  const rows = sources.map(s => [
    Markup.button.callback(`${s.active ? "ط¸â€¹ط¹ط›ط¹ط›ط¢آ¢" : "ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¢آ´"} ${s.name}${s.is_primary ? " ط£آ¢ط¢آ­ط¹آ¯" : ""}`.slice(0, 60), `adm:api:${s.id}`)
  ]);
  rows.push([Markup.button.callback("ط£آ¢أ¢â‚¬ع†أ¢â‚¬آ¢ ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¢آ© API ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾", "adm:apiAdd")]);
  rows.push([Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬â€چ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ²ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¢آ© ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¢ط·آ¸أ¢â‚¬ ", "adm:apiSyncAll")]);
  rows.push([Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "admin:menu")]);
  await sendOrEdit(ctx, "ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¥â€™ APIs ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾\n\nط·آ¸ط¸آ¹ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ­ط·آ¸ط¸آ¾ط·آ·ط¢آ¸ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬ ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ¸ط«â€ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ²ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ§ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹.", Markup.inlineKeyboard(rows));
}

async function showDepList(ctx, page) {
  if (!(await requireAdmin(ctx))) return;
  const limit = 8; const offset = (page - 1) * limit;
  const res = await q("SELECT * FROM deposit_requests WHERE status='pending' ORDER BY created_at DESC LIMIT $1 OFFSET $2", [limit + 1, offset]);
  const hasNext = res.rows.length > limit; const slice = res.rows.slice(0, limit);
  if (!slice.length) { await sendOrEdit(ctx, "ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ­ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ·ط¹آ¾ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ·ط¢آ¯ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ©.", Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "admin:menu")]])); return; }
  const kb = slice.map(d => [Markup.button.callback(`${d.method_name} ط£آ¢أ¢â€ڑآ¬ط¢آ¢ ${d.amount ? Number(d.amount).toFixed(2) + "$" : "ط£آ¢أ¢â€ڑآ¬أ¢â‚¬â€Œ"} ط£آ¢أ¢â€ڑآ¬ط¢آ¢ UID:${d.user_id}`, `adm:depShow:${d.id}`)]);
  const nav = [];
  if (page > 1) nav.push(Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬ع‘", `adm:depList:${page - 1}`));
  if (hasNext) nav.push(Markup.button.callback("ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ ط£آ¢أ¢â‚¬ع†ط·إ’ط£آ¯ط¢آ¸ط¹ث†", `adm:depList:${page + 1}`));
  if (nav.length) kb.push(nav);
  kb.push([Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "admin:menu")]);
  await sendOrEdit(ctx, "ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ¥ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ©:", Markup.inlineKeyboard(kb));
}

async function showDepDetails(ctx, depId) {
  if (!(await requireAdmin(ctx))) return;
  const res = await q("SELECT * FROM deposit_requests WHERE id=$1", [depId]);
  const d = res.rows[0]; if (!d) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¯."); return; }
  const u = await getUser(d.user_id);
  const text = `ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ¥ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ©: ${d.status}\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ·ط¢آ±ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ©: ${d.method_name}\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦: ${u?.first_name ?? ""} ${u?.username ? "@" + u.username : ""} (${d.user_id})\nط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦: ${u ? Number(u.balance).toFixed(2) : "0.00"}$\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸ط¹ث†ط·آ·ط¢آ­ط·آ¸ط«â€ ط·آ¸ط¹ع©ط·آ¸أ¢â‚¬ع©ط·آ¸أ¢â‚¬â€چ: ${d.amount ? Number(d.amount).toFixed(2) + "$" : "ط£آ¢أ¢â€ڑآ¬أ¢â‚¬â€Œ"}`;
  const balanceRow = [Markup.button.callback("ط£آ¢أ¢â‚¬ع†أ¢â‚¬آ¢ ط·آ·ط¢آ´ط·آ·ط¢آ­ط·آ¸أ¢â‚¬  ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯", `adm:userAdd:${d.user_id}`), Markup.button.callback("ط£آ¢أ¢â‚¬ع†أ¢â‚¬â€œ ط·آ·ط¢آ®ط·آ·ط¢آµط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯", `adm:userSub:${d.user_id}`)];
  const kb = d.status === "pending"
    ? Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ©", `adm:dep:approve:${d.id}`), Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ±ط·آ¸ط¸آ¾ط·آ·ط¢آ¶", `adm:dep:reject:${d.id}`)], balanceRow, [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬ع©ط¢آ¤ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦", `adm:user:${d.user_id}`)], [Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "adm:depList:1")]])
    : Markup.inlineKeyboard([balanceRow, [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬ع©ط¢آ¤ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦", `adm:user:${d.user_id}`)], [Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "adm:depList:1")]]);
  try { await ctx.replyWithPhoto(d.screenshot_file_id, { caption: text, ...kb }); }
  catch { await ctx.reply(text + "\n\n(ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ°ط·آ¸أ¢â‚¬ع©ط·آ·ط¢آ± ط·آ·ط¹آ¾ط·آ·ط¢آ­ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آµط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ·ط¢آ©)", kb); }
}

async function approveDeposit(ctx, depId) {
  if (!(await requireAdmin(ctx))) return;
  setStep(ctx.from.id, { kind: "admin:depositApproveAmount", depositId: depId });
  await ctx.reply(`ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آµ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ ط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ± ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬طŒ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦:`, Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "admin:menu")]]));
}

async function rejectDeposit(ctx, depId) {
  if (!(await requireAdmin(ctx))) return;
  const res = await q("UPDATE deposit_requests SET status='rejected', processed_by=$1, processed_at=NOW() WHERE id=$2 AND status='pending' RETURNING *", [ctx.from.id, depId]);
  if (!res.rows.length) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ط·آ·ط¢آ© ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ°ط·آ·ط¢آ§ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ·ط¢آ¨ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ·ط¢آ·ط·آ·ط¢آ© ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آ¢ط·آ·ط¢آ®ط·آ·ط¢آ±."); return; }
  const d = res.rows[0];
  await clearDepositForOtherAdmins(ctx.from.id, depId, `ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹ ط£آ¢أ¢â€ڑآ¬أ¢â‚¬â€Œ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ¸ط¸آ¾ط·آ·ط¢آ¶`);
  await ctx.reply(`ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ±ط·آ¸ط¸آ¾ط·آ·ط¢آ¶ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹.`);
  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¹ط·آ·ط¢آ±ط·آ·ط¢آ¶ ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  if (d) { try { await ctx.telegram.sendMessage(d.user_id, `ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ±ط·آ¸ط¸آ¾ط·آ·ط¢آ¶ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹. ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ¸ط¸آ¾ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ± ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ @${ADMIN_USERNAME}.`); } catch { /* ignore */ } }
}

async function showUserCard(ctx, uid) {
  if (!(await requireAdmin(ctx))) return;
  const u = await getUser(uid); if (!u) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¯."); return; }
  const me = await getUser(ctx.from.id);
  const isMeSA = !!me?.is_super_admin;
  const statsRes = await q("SELECT COUNT(*)::int AS c, COALESCE(SUM(price_usd),0)::text AS s FROM orders WHERE user_id=$1", [uid]);
  const oc = statsRes.rows[0]?.c ?? 0; const sum = Number(statsRes.rows[0]?.s ?? 0);
  const text = `ط¸â€¹ط¹ط›أ¢â‚¬ع©ط¢آ¤ ${u.first_name ?? "ط£آ¢أ¢â€ڑآ¬أ¢â‚¬â€Œ"}${u.username ? " @" + u.username : ""}\nID: ${u.id}\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯: ${Number(u.balance).toFixed(2)}$\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ©: ${u.status}\nط·آ·ط¢آ¥ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ¸ط¸آ¹ط·آ·ط¹ط› ${u.is_admin ? "ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬آ¦" : "ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§"}${u.is_super_admin ? " (ط·آ·ط¢آ£ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ°)" : ""}\nط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ¯ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾: ${oc} ط£آ¢أ¢â€ڑآ¬ط¢آ¢ ط·آ·ط¢آ¥ط·آ·ط¢آ¬ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹: ${sum.toFixed(2)}$`;
  const kb = [
    [Markup.button.callback("ط£آ¢أ¢â‚¬ع†أ¢â‚¬آ¢ ط·آ·ط¢آ´ط·آ·ط¢آ­ط·آ¸أ¢â‚¬  ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯", `adm:userAdd:${uid}`), Markup.button.callback("ط£آ¢أ¢â‚¬ع†أ¢â‚¬â€œ ط·آ·ط¢آ®ط·آ·ط¢آµط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯", `adm:userSub:${uid}`)],
    [Markup.button.callback(u.status === "banned" ? "ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¢آ±ط·آ¸ط¸آ¾ط·آ·ط¢آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ¸ط·آ·ط¢آ±" : "ط¸â€¹ط¹ط›ط¹â€کط¢آ« ط·آ·ط¢آ­ط·آ·ط¢آ¸ط·آ·ط¢آ±", `adm:userBan:${uid}`), Markup.button.callback(u.is_admin ? "ط¸â€¹ط¹ط›أ¢â‚¬ع©ط¢آ¤ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’ ط·آ·ط¢آ¥ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ¸ط¸آ¹" : "ط¸â€¹ط¹ط›أ¢â‚¬ع©أ¢â‚¬ع© ط·آ·ط¢آ¬ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬طŒ ط·آ·ط¢آ¥ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ¸ط¸آ¹", `adm:userAdmin:${uid}`)],
    [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ¦ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬طŒ", `adm:userOrders:${uid}:1`), Markup.button.callback("% ط·آ·ط¢آ±ط·آ·ط¢آ¨ط·آ·ط¢آ­ ط·آ·ط¢آ®ط·آ·ط¢آ§ط·آ·ط¢آµ", `adm:userMarkup:${uid}`)],
    [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ¬ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ®ط·آ·ط¢آ§ط·آ·ط¢آµ", `adm:userMsg:${uid}`)],
  ];
  if (isMeSA && uid !== ctx.from.id) {
    kb.push([Markup.button.callback(u.is_super_admin ? "ط£آ¢ط¢آ¬أ¢â‚¬طŒط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ°" : "ط¸â€¹ط¹ط›ط¥â€™ط¹ط› ط·آ·ط¢آ¬ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬طŒ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ·ط¢آ£ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ°", `adm:userSA:${uid}`)]);
  }
  kb.push([Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "adm:users:1")]);
  await sendOrEdit(ctx, text, Markup.inlineKeyboard(kb));
}

function startPingScheduler(bot) {
  let running = false;
  setInterval(async () => {
    if (running) return;
    running = true;
    try {
      const enabled = (await getSetting("auto_ping_enabled")) === "on"; if (!enabled) return;
      const targetId = Number(await getSetting("auto_ping_target_user_id")); if (!targetId) return;
      const intervalMin = Number(await getSetting("auto_ping_interval_min")) || 5;
      const lastSent = Number(await getSetting("auto_ping_last_sent")) || 0;
      if (Date.now() - lastSent < intervalMin * 60_000) return;
      await setSetting("auto_ping_last_sent", String(Date.now()));
      await bot.telegram.sendMessage(targetId, "/start").catch(() => {});
    } catch { /* silent */ }
    finally { running = false; }
  }, 30_000).unref();
}

const TELEGRAM_REQUEST_TIMEOUT_MS = 15_000;
const TELEGRAM_LONG_POLL_TIMEOUT_SECONDS = 50;
const POLLING_RETRY_BASE_MS = 2_000;
const POLLING_RETRY_MAX_MS = 30_000;

function waitMs(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runPollingWithReconnect(bot, launchConfig, shouldStop) {
  let attempt = 0;
  while (!shouldStop()) {
    const startedAt = Date.now();
    try {
      console.log("ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬â€چ ط·آ·ط¢آ¨ط·آ·ط¢آ¯ط·آ·ط·إ’ ط·آ·ط¢آ§ط·آ·ط¹آ¾ط·آ·ط¢آµط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چ Telegram polling...");
      await bot.launch(launchConfig);
      if (shouldStop()) break;
      const livedMs = Date.now() - startedAt;
      attempt = livedMs >= 60_000 ? 0 : attempt + 1;
      console.error("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬طŒط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ§ط·آ·ط¹آ¾ط·آ·ط¢آµط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چ Telegram pollingط·آ·ط¥â€™ ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ©.");
    } catch (err) {
      if (shouldStop()) break;
      attempt += 1;
      console.error(`ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ°ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ·ط¹آ¾ط·آ·ط¢آµط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چ Telegram polling (ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ${attempt}):`, err?.message ?? err);
    }
    if (shouldStop()) break;
    const delay = Math.min(POLLING_RETRY_MAX_MS, POLLING_RETRY_BASE_MS * (2 ** Math.min(attempt - 1, 4)));
    console.log(`ط£آ¢ط¹ث†ط¢آ³ ط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ·ط¹آ¾ط·آ·ط¢آµط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چ Telegram ط·آ·ط¢آ¨ط·آ·ط¢آ¹ط·آ·ط¢آ¯ ${Math.ceil(delay / 1000)} ط·آ·ط¢آ«ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬ ط·آ¸ط¹â€ ...`);
    await waitMs(delay);
  }
}

// ============================================================
//  BOT LAUNCH
// ============================================================
async function startBot() {
  const token = process.env.BOT_TOKEN;
  if (!token) { console.error("ط£آ¢أ¢â‚¬إ’ط¥â€™ BOT_TOKEN is required"); process.exit(1); }

  await ensureTables();
  await ensureDefaults();
  await ensureDefaultDepositMethods();
  await ensurePrimaryApiSource();
  // ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¸ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ²ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¢آ© API ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸ط«â€ ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چ ط·آ·ط¹آ¾ط·آ·ط¢آ´ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ Telegram.

  const bot = new Telegraf(token, { handlerTimeout: 90_000 });
  _botRef = bot;
  // ط·آ§ط·آ®ط·ع¾ط·آ¨ط·آ§ط·آ± ط·آ§ط¸â€‍ط·آ§ط·ع¾ط·آµط·آ§ط¸â€‍ ط·آ¨ط·آ§ط¸â€‍ط·ع¾ط¸ث†ط¸ئ’ط¸â€  ط¸â€¦ط·آ¨ط¸ئ’ط·آ±ط·آ§ط¸â€¹ ط·آ­ط·ع¾ط¸â€° ط¸ظ¹ط·آ¸ط¸â€،ط·آ± ط·آ®ط·آ·ط·آ£ Telegram ط¸ظ¾ط¸ظ¹ ط·آ³ط·آ¬ط¸â€‍ Railway ط·آ¨ط¸ث†ط·آ¶ط¸ث†ط·آ­.
  const botInfo = await bot.telegram.getMe();
  console.log(`أ¢إ“â€¦ ط·ع¾ط¸â€¦ ط·آ§ط¸â€‍ط·آ§ط·ع¾ط·آµط·آ§ط¸â€‍ ط·آ¨ط·ع¾ط¸â€‍ط¸ظ¹ط·آ¬ط·آ±ط·آ§ط¸â€¦: @${botInfo.username ?? botInfo.id}`);
  // ط·آ·ط¹آ¾ط·آ¸ط«â€ ط·آ·ط¢آ­ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ ط·آ·ط¢آµط·آ¸ط«â€ ط·آ·ط¢آµ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ®ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ·ط¢آ© ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° Telegram ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¥â€™ ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ§ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ·ط¢آ²ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ±
  const originalCallApi = bot.telegram.callApi.bind(bot.telegram);
  bot.telegram.callApi = (method, payload, ...rest) => {
    // Telegraf ط·آ¸ط¸آ¹ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ getUpdates ط·آ¸ط¦â€™ط·آ¸أ¢â€ڑآ¬ long polling ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬طŒط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© 50 ط·آ·ط¢آ«ط·آ·ط¢آ§ط·آ¸أ¢â‚¬ ط·آ¸ط¸آ¹ط·آ·ط¢آ©.
    // ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¶ط·آ·ط¢آ¹ ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬طŒ Promise.race ط·آ·ط¢آ£ط·آ¸ط«â€  AbortController ط·آ·ط¢آ®ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ط·آ·ط¥â€™ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ¸أ¢â‚¬  ط·آ·ط¢آ£ط·آ¸ط¸آ¹ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬طŒط·آ¸أ¢â‚¬â€چط·آ·ط¢آ©
    // ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ط·آ·ط¢آ© ط·آ¸أ¢â‚¬طŒط·آ¸أ¢â‚¬ ط·آ·ط¢آ§ ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ¯ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ·ط·آ·ط¢آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ£ط·آ¸أ¢â‚¬  ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬طŒط·آ¸ط¸آ¹ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬طŒط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© Telegram ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ط·آ·ط¢آ©.
    if (method === "getUpdates") {
      const normalizedPayload = normalizeTelegramPayload(payload);
      return originalCallApi(method, {
        ...normalizedPayload,
        timeout: TELEGRAM_LONG_POLL_TIMEOUT_SECONDS,
      }, ...rest);
    }

    const timeoutMs = TELEGRAM_REQUEST_TIMEOUT_MS;
    const requestController = new AbortController();
    const parentSignal = rest[0]?.signal;
    const signal = parentSignal && AbortSignal.any
      ? AbortSignal.any([parentSignal, requestController.signal])
      : requestController.signal;
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => {
        requestController.abort();
        reject(new Error(`Telegram ${method} timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });
    const callOptions = { ...(rest[0] ?? {}), signal };
    return Promise.race([
      originalCallApi(method, normalizeTelegramPayload(payload), callOptions, ...rest.slice(1)),
      timeout,
    ]).finally(() => clearTimeout(timer));
  };

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Rate limiter + ط·آ·ط¢آ±ط·آ·ط¢آ¯ ط·آ¸ط¸آ¾ط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ¸ط¸آ¹ ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° callback ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  const _rateMap = new Map();
  setInterval(() => {
    const now = Date.now();
    for (const [uid, times] of _rateMap) {
      if (times.every(t => now - t > 5_000)) _rateMap.delete(uid);
    }
  }, 60_000).unref();

  bot.use((ctx, next) => {
    const uid = ctx.from?.id; if (!uid) return next();
    // ط·آ·ط¢آ£ط·آ·ط¢آ²ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ± Telegram ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ·ط¹آ¾ط·آ¸ط¹ث†ط·آ·ط¢آ­ط·آ·ط¢آ¬ط·آ·ط¢آ¨ ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ·ط¢آ¯ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬â€چط·آ·أ¢â‚¬ط› ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¶ط·آ·ط·â€؛ط·آ·ط¢آ· ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ·ط¢آ¹ ط·آ¸ط¸آ¹ط·آ·ط¢آ¬ط·آ·ط¢آ¨ ط·آ·ط¢آ£ط·آ¸أ¢â‚¬  ط·آ¸ط¸آ¹ط·آ·ط¢آµط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬.
    if (ctx.callbackQuery) {
      ctx.answerCbQuery().catch(() => {});
      return next();
    }
    const now = Date.now();
    const times = (_rateMap.get(uid) ?? []).filter(t => now - t < 3_000);
    // ط·آ¸أ¢â‚¬ ط·آ·ط¢آ­ط·آ·ط¢آ¯ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ²ط·آ·ط¢آ¹ط·آ·ط¢آ¬ط·آ·ط¢آ© ط·آ¸ط¸آ¾ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ·ط·آ·ط¥â€™ ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ³ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ· ط·آ·ط¢آ¶ط·آ·ط·â€؛ط·آ·ط¢آ·ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ·ط¢آ²ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ط·آ·ط¢آ©.
    if (times.length >= 30) {
      return;
    }
    times.push(now); _rateMap.set(uid, times);
    return next();
  });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Commands ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.start(async ctx => {
    const txt = ctx.message?.text ?? "";
    setStep(ctx.from.id, { kind: "idle" });
    const startParam = txt.replace("/start", "").trim();
    if (startParam) {
      const loginCmd = await getAdminLoginCommand();
      if (startParam === loginCmd) {
        setStep(ctx.from.id, { kind: "admin:login" });
        await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬ع© ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ¸ط«â€ ط·آ·ط¢آ±:");
        return;
      }
    }
    await showMainMenu(ctx);
  });
  bot.command("menu", async ctx => { setStep(ctx.from.id, { kind: "idle" }); await showMainMenu(ctx); });
  bot.command("balance", async ctx => { const u = await ensureUser(ctx); if (!u) return; await ctx.reply(`ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ° ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط¦â€™: ${formatBalance(Number(u.balance), await getExchangeRate())}`); });
  bot.command("deposit", async ctx => { await ensureUser(ctx); setStep(ctx.from.id, { kind: "idle" }); await showDepositMenu(ctx); });
  bot.command("orders", async ctx => { await ensureUser(ctx); await showMyOrders(ctx, 1); });
  bot.command("support", async ctx => { await ensureUser(ctx); await showContactLinks(ctx); });

  bot.command("admin", async ctx => {
    const user = await ensureUser(ctx);
    if (!user?.is_admin) {
      await ctx.reply("ط£آ¢أ¢â‚¬ط›أ¢â‚¬â€Œ ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ°ط·آ·ط¢آ§ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ± ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ© ط·آ¸ط¸آ¾ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ·.");
      return;
    }
    const sessionActive = await isAdminSessionActive(ctx.from.id);
    if (!sessionActive && !authedAdminIds.has(ctx.from.id)) {
      setStep(ctx.from.id, { kind: "admin:login" });
      await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬ع© ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ¸ط«â€ ط·آ·ط¢آ±:");
      return;
    }
    await showAdminMenu(ctx);
  });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Callback Queries ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.action("home", async ctx => { setStep(ctx.from.id, { kind: "idle" }); await showMainMenu(ctx); });
  bot.action("balance", async ctx => {
    const u = await ensureUser(ctx); if (!u) return;
    const rate = await getExchangeRate();
    await sendOrEdit(ctx, `ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ° ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط¦â€™: ${formatBalance(Number(u.balance), rate)}`, Markup.inlineKeyboard([[Markup.button.callback("ط¸â€¹ط¹ط›ط¹ث†  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "home")]]));
  });
  bot.action("deposit", async ctx => { await ensureUser(ctx); await showDepositMenu(ctx); });
  bot.action("support", async ctx => { await ensureUser(ctx); await showContactLinks(ctx); });
  bot.action(/^myorders:(\d+)$/, async ctx => { await showMyOrders(ctx, Number(ctx.match[1])); });
  bot.action("noop", async ctx => { /* ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ±ط·آ·ط¢آ© ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آµط·آ¸ط¸آ¾ط·آ·ط¢آ­ط·آ·ط¢آ© */ });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Admin auth ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.action("admin:menu", async ctx => { await showAdminMenu(ctx); });
  bot.action("admin:loginPrompt", async ctx => {
    setStep(ctx.from.id, { kind: "admin:login" });
    await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬ع© ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ¸ط«â€ ط·آ·ط¢آ±:");
  });

  bot.action("adm:logout", async ctx => {
    authedAdminIds.delete(ctx.from.id);
    await setAdminSession(ctx.from.id, false);
    invalidateUserCache(ctx.from.id);
    setStep(ctx.from.id, { kind: "idle" });
    const user = await getUser(ctx.from.id);
    const rate = await getExchangeRate();
    const greeting = `ط·آ·ط¢آ£ط·آ¸أ¢â‚¬طŒط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ط·آ¸ط¦â€™ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬  ط¸â€¹ط¹ط›ط¥â€™ط¹ط›\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦: ${user?.first_name ?? "ط£آ¢أ¢â€ڑآ¬أ¢â‚¬â€Œ"}${user?.username ? ` (@${user.username})` : ""}\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦: ${ctx.from.id}\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯: ${formatBalance(Number(user?.balance ?? 0), rate)}\n\nط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ·ط¢آ³ط·آ·ط¢آ¬ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ®ط·آ·ط¢آ±ط·آ¸ط«â€ ط·آ·ط¢آ¬ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬  ط·آ¸أ¢â‚¬â€چط·آ¸ط«â€ ط·آ·ط¢آ­ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ© ط¸â€¹ط¹ط›أ¢â‚¬ع©أ¢â‚¬آ¹\nط·آ·ط¢آ§ط·آ·ط¢آ®ط·آ·ط¹آ¾ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط¸â€¹ط¹ط›أ¢â‚¬ع©أ¢â‚¬طŒ`;
    await sendOrEdit(ctx, greeting, mainMenu());
  });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Deposit flow ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.action(/^dep:method:(\d+)$/, async ctx => { await showDepositMethod(ctx, Number(ctx.match[1])); });
  bot.action("dep:cancel", async ctx => { setStep(ctx.from.id, { kind: "idle" }); await showMainMenu(ctx); });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Category / Product navigation ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
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
  bot.action(/^mcat:(\d+):(\d+):(\d+)$/, async ctx => {
    await ensureUser(ctx);
    await showManualCategory(ctx, Number(ctx.match[1]), Number(ctx.match[2]), Number(ctx.match[3]));
  });
  bot.action(/^mprod:(\d+):(\d+)$/, async ctx => {
    await ensureUser(ctx);
    await showManualProduct(ctx, Number(ctx.match[1]), Number(ctx.match[2]));
  });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Buy flow ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.action(/^buy:(\d+):(\d+)$/, async ctx => {
    await ensureUser(ctx);
    await startOrderFlow(ctx, Number(ctx.match[1]), Number(ctx.match[2]));
  });
  bot.action(/^ord:qty:(\d+\.?\d*)$/, async ctx => {
    const step = getStep(ctx.from.id);
    if (step.kind !== "order:qty") return;
    const qty = Number(ctx.match[1]);
    let all = await getCachedProducts(); let p = all.find(x => x.id === step.productId);
    if (!p) { all = await getCachedProducts(); p = all.find(x => x.id === step.productId); }
    if (!p) return;
    await askNextParam(ctx, p, step.priceUsd, qty, step.paramKeys, {}, 0, step.backTo);
  });
  bot.action("ord:confirm", async ctx => { await executeOrder(ctx); });
  bot.action("ord:cancel", async ctx => { setStep(ctx.from.id, { kind: "idle" }); await showMainMenu(ctx); });
  bot.action(/^ord:check:(\d+)$/, async ctx => { await checkOrderStatus(ctx, Number(ctx.match[1])); });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Manual product buy ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.action(/^mbuy:(\d+)$/, async ctx => {
    const mid = Number(ctx.match[1]);
    const m = (await q("SELECT * FROM manual_products WHERE id=$1 AND active=true", [mid])).rows[0];
    if (!m) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ·ط¢آ­."); return; }
    const u = await getUser(ctx.from.id);
    const priceUsd = Number(m.price_usd);
    if (!u || Number(u.balance) < priceUsd) { await ctx.reply("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸ط¦â€™ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ¸ط¹â€ .", Markup.inlineKeyboard([[Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ³ ط·آ·ط¢آ´ط·آ·ط¢آ­ط·آ¸أ¢â‚¬  ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯", "deposit")]])); return; }
    setStep(ctx.from.id, { kind: "order:manualNote", productId: mid, priceUsd });
    await ctx.reply(`ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬إ’ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ­ط·آ·ط¢آ¸ط·آ·ط¢آ© ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ·ط¢آ£ط·آ¸ط«â€  ط·آ·ط¢آ§ط·آ¸ط¦â€™ط·آ·ط¹آ¾ط·آ·ط¢آ¨ "skip":`, Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "ord:cancel")]]));
  });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Admin: deposit management ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.action(/^adm:depList:(\d+)$/, async ctx => { await showDepList(ctx, Number(ctx.match[1])); });
  bot.action(/^adm:depShow:(\d+)$/, async ctx => { await showDepDetails(ctx, Number(ctx.match[1])); });
  bot.action(/^adm:dep:approve:(\d+)$/, async ctx => { await approveDeposit(ctx, Number(ctx.match[1])); });
  bot.action(/^adm:dep:reject:(\d+)$/, async ctx => { await rejectDeposit(ctx, Number(ctx.match[1])); });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Admin: users ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.action(/^adm:users:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const page = Number(ctx.match[1]); const limit = 10; const offset = (page - 1) * limit;
    const users = await listUsers(offset, limit + 1);
    const hasNext = users.length > limit; const slice = users.slice(0, limit);
    const total = await countUsers();
    const kb = slice.map(u => [Markup.button.callback(`${u.first_name ?? "ط£آ¢أ¢â€ڑآ¬أ¢â‚¬â€Œ"}${u.username ? " @" + u.username : ""} ط£آ¢أ¢â€ڑآ¬ط¢آ¢ ${Number(u.balance).toFixed(2)}$${u.is_super_admin ? " ط¸â€¹ط¹ط›ط¥â€™ط¹ط›" : u.is_admin ? " ط¸â€¹ط¹ط›أ¢â‚¬ع©أ¢â‚¬ع©" : ""}`, `adm:user:${u.id}`)]);
    const nav = [];
    if (page > 1) nav.push(Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬ع‘", `adm:users:${page - 1}`));
    if (hasNext) nav.push(Markup.button.callback("ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ ط£آ¢أ¢â‚¬ع†ط·إ’ط£آ¯ط¢آ¸ط¹ث†", `adm:users:${page + 1}`));
    if (nav.length) kb.push(nav);
    kb.push([Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "admin:menu")]);
    await sendOrEdit(ctx, `ط¸â€¹ط¹ط›أ¢â‚¬ع©ط¢آ¥ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ¸أ¢â‚¬  (${total}):`, Markup.inlineKeyboard(kb));
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
    await ctx.reply(newStatus === "banned" ? "ط¸â€¹ط¹ط›ط¹â€کط¢آ« ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ¸ط·آ·ط¢آ±." : "ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ±ط·آ¸ط¸آ¾ط·آ·ط¢آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ¸ط·آ·ط¢آ±.");
    await showUserCard(ctx, uid);
  });
  bot.action(/^adm:userAdmin:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const me = await getUser(ctx.from.id);
    if (!me?.is_super_admin) { await ctx.reply("ط£آ¢أ¢â‚¬ط›أ¢â‚¬â€Œ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ¸ط¸آ¾ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ· ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ·ط·آ¸ط¸آ¹ط·آ·ط¢آ¹ ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ±ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ ."); return; }
    const uid = Number(ctx.match[1]); const u = await getUser(uid);
    const newAdmin = !u?.is_admin;
    await setAdmin(uid, newAdmin, newAdmin ? false : undefined);
    if (!newAdmin) {
      authedAdminIds.delete(uid);
      await setAdminSession(uid, false).catch(() => {});
    }
    await ctx.reply(newAdmin ? "ط¸â€¹ط¹ط›أ¢â‚¬ع©أ¢â‚¬ع© ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬  ط·آ·ط¢آ¥ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬آ¹ط·آ·ط¢آ§." : "ط¸â€¹ط¹ط›أ¢â‚¬ع©ط¢آ¤ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ¸ط¸آ¹.");
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
    await ctx.reply(newSA ? "ط¸â€¹ط¹ط›ط¥â€™ط¹ط› ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬طŒ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ·ط¢آ£ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ°." : "ط£آ¢ط¢آ¬أ¢â‚¬طŒط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’ ط·آ·ط¢آµط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ­ط·آ¸ط¸آ¹ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ°.");
    await showUserCard(ctx, uid);
  });
  bot.action(/^adm:userAdd:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:userBalance", userId: Number(ctx.match[1]), mode: "add" }); await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آµ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ ط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ± ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¢آ©:", Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "admin:menu")]])); });
  bot.action(/^adm:userSub:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:userBalance", userId: Number(ctx.match[1]), mode: "sub" }); await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آµ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ ط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ± ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ·ط¢آ®ط·آ·ط¢آµط·آ¸أ¢â‚¬آ¦:", Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "admin:menu")]])); });
  bot.action("adm:findUser", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:findUser" }); await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¹â€  ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ£ط·آ¸ط«â€  ID:", Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "admin:menu")]])); });
  bot.action(/^adm:userOrders:(\d+):(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const uid = Number(ctx.match[1]); const page = Number(ctx.match[2]); const limit = 8; const offset = (page - 1) * limit;
    const res = await q("SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3", [uid, limit + 1, offset]);
    const hasNext = res.rows.length > limit; const slice = res.rows.slice(0, limit);
    if (!slice.length) { await sendOrEdit(ctx, "ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ­ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ·ط¹آ¾ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ·ط¢آ¯ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾.", Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", `adm:user:${uid}`)]])); return; }
    const lines = slice.map(r => `ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ${r.product_name} ط·آ£أ¢â‚¬â€‌${r.qty} ط£آ¢أ¢â€ڑآ¬ط¢آ¢ ${Number(r.price_usd).toFixed(2)}$ ط£آ¢أ¢â€ڑآ¬ط¢آ¢ ${statusLabel(r.status)}`);
    const nav = []; if (page > 1) nav.push(Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬ع‘", `adm:userOrders:${uid}:${page - 1}`)); if (hasNext) nav.push(Markup.button.callback("ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ ط£آ¢أ¢â‚¬ع†ط·إ’ط£آ¯ط¢آ¸ط¹ث†", `adm:userOrders:${uid}:${page + 1}`));
    const kb = []; if (nav.length) kb.push(nav); kb.push([Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", `adm:user:${uid}`)]);
    await sendOrEdit(ctx, `ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ¦ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ${uid}\n\n${lines.join("\n")}`, Markup.inlineKeyboard(kb));
  });
  bot.action(/^adm:userMarkup:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const uid = Number(ctx.match[1]); const u = await getUser(uid); setStep(ctx.from.id, { kind: "admin:setUserMarkup", userId: uid }); await ctx.reply(`% ط·آ¸أ¢â‚¬ ط·آ·ط¢آ³ط·آ·ط¢آ¨ط·آ·ط¢آ© ط·آ·ط¢آ±ط·آ·ط¢آ¨ط·آ·ط¢آ­ ${u?.first_name ?? uid}\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ©: ${u?.custom_markup_percent ?? "ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ·ط¢آ¯ط·آ·ط¢آ©"}\nط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ ط·آ·ط¢آ³ط·آ·ط¢آ¨ط·آ·ط¢آ© ط·آ·ط¢آ£ط·آ¸ط«â€  reset:`, Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", `adm:user:${uid}`)]])); });
  bot.action(/^adm:userMsg:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const uid = Number(ctx.match[1]); const u = await getUser(uid);
    if (!u) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¯."); return; }
    setStep(ctx.from.id, { kind: "admin:userMessage", userId: uid });
    await ctx.reply(`ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ¬ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ®ط·آ·ط¢آ§ط·آ·ط¢آµط·آ·ط¢آ© ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ${u.first_name ?? uid}:\nط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آµط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬طŒ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط«â€ ط·آ·ط¹آ¾ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¢آ´ط·آ·ط¢آ±ط·آ·ط¢آ©.`, Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", `adm:user:${uid}`)]]));
  });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Admin: orders ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.action(/^adm:allOrders:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const page = Number(ctx.match[1]); const limit = 8; const offset = (page - 1) * limit;
    const res = await q(`SELECT o.*, u.username AS uname, u.first_name AS ufirst FROM orders o LEFT JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC LIMIT $1 OFFSET $2`, [limit + 1, offset]);
    const hasNext = res.rows.length > limit; const slice = res.rows.slice(0, limit);
    if (!slice.length) { await sendOrEdit(ctx, "ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ­ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ·ط¹آ¾ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ·ط¢آ¯ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾.", Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "admin:menu")]])); return; }
    const lines = slice.map(r => `${r.ufirst ?? "ط£آ¢أ¢â€ڑآ¬أ¢â‚¬â€Œ"}${r.uname ? " @" + r.uname : ""}\n   ${r.product_name} ط·آ£أ¢â‚¬â€‌${r.qty} ط£آ¢أ¢â€ڑآ¬ط¢آ¢ ${Number(r.price_usd).toFixed(2)}$ ط£آ¢أ¢â€ڑآ¬ط¢آ¢ ${statusLabel(r.status)}`);
    const nav = []; if (page > 1) nav.push(Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬ع‘", `adm:allOrders:${page - 1}`)); if (hasNext) nav.push(Markup.button.callback("ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ ط£آ¢أ¢â‚¬ع†ط·إ’ط£آ¯ط¢آ¸ط¹ث†", `adm:allOrders:${page + 1}`));
    const kb = []; if (nav.length) kb.push(nav); kb.push([Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "admin:menu")]);
    await sendOrEdit(ctx, `ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ¦ ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾\n\n${lines.join("\n\n")}`, Markup.inlineKeyboard(kb));
  });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Admin: broadcast ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.action("adm:broadcast", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:broadcast" }); await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ£ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬ ط·آ·ط¢آµ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ط·آ·ط¢آ©:", Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "admin:menu")]])); });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Admin: deposit methods ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.action("adm:methods", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const res = await q("SELECT * FROM deposit_methods ORDER BY id"); const rows = res.rows;
    const kb = rows.map(m => [Markup.button.callback(`${m.active ? "ط¸â€¹ط¹ط›ط¹ط›ط¢آ¢" : "ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¢آ´"} ${m.name}`, `adm:methodEdit:${m.id}`)]);
    kb.push([Markup.button.callback("ط£آ¢أ¢â‚¬ع†أ¢â‚¬آ¢ ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¢آ© ط·آ·ط¢آ·ط·آ·ط¢آ±ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ©", "adm:methodAdd")]); kb.push([Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "admin:menu")]);
    await sendOrEdit(ctx, "ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ³ ط·آ·ط¢آ·ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹", Markup.inlineKeyboard(kb));
  });
  bot.action("adm:methodAdd", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:addMethod:name" }); await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ³ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ·ط·آ·ط¢آ±ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹:", Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "adm:methods")]])); });
  bot.action(/^adm:methodEdit:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const id = Number(ctx.match[1]); const res = await q("SELECT * FROM deposit_methods WHERE id=$1", [id]); const m = res.rows[0]; if (!m) return;
    await sendOrEdit(ctx, `ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ³ ${m.name}\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ط·آ·ط¢آ±ط·آ¸ط¸آ¾: ${m.identifier}\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ©: ${m.active ? "ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¸آ¾ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬ع©ط·آ¸أ¢â‚¬â€چ" : "ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ¸أ¢â‚¬ع‘ط·آ¸ط«â€ ط·آ¸ط¸آ¾"}\nط¸â€¹ط¹ط›أ¢â‚¬â€œط¢آ¼ ط·آ·ط¢آµط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ·ط¢آ©: ${m.image_file_id ? "ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¯ط·آ·ط¢آ©" : "ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸ط¸آ¹ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ·ط¢آ¯"}\n\n${m.instructions}`,
      Markup.inlineKeyboard([
        [Markup.button.callback(m.active ? "ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¢آ´ ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ·ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ" : "ط¸â€¹ط¹ط›ط¹ط›ط¢آ¢ ط·آ·ط¹آ¾ط·آ¸ط¸آ¾ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ", `adm:methodToggle:${id}`), Markup.button.callback("ط£آ¢ط¥â€œط¹ث†ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ط·آ·ط¹آ¾", `adm:methodInstr:${id}`)],
        [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â€œط¢آ¼ ط·آ·ط¢آ±ط·آ¸ط¸آ¾ط·آ·ط¢آ¹/ط·آ·ط¹آ¾ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آµط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ·ط¢آ©", `adm:methodImg:${id}`), Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â€‌أ¢â‚¬ع©ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ­ط·آ·ط¢آ°ط·آ¸ط¸آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آµط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ·ط¢آ©", `adm:methodImgDel:${id}`)],
        [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â€‌أ¢â‚¬ع©ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ­ط·آ·ط¢آ°ط·آ¸ط¸آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ·ط¢آ±ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ©", `adm:methodDel:${id}`)],
        [Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "adm:methods")]
      ]));
  });
  bot.action(/^adm:methodToggle:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const id = Number(ctx.match[1]); const cur = (await q("SELECT active FROM deposit_methods WHERE id=$1", [id])).rows[0]; if (!cur) return; await q("UPDATE deposit_methods SET active=$1 WHERE id=$2", [!cur.active, id]); });
  bot.action(/^adm:methodInstr:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:editMethodInstructions", methodId: Number(ctx.match[1]) }); await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬آ¹ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ©:", Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "adm:methods")]])); });
  bot.action(/^adm:methodDel:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; await q("DELETE FROM deposit_methods WHERE id=$1", [Number(ctx.match[1])]); await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬â€‌أ¢â‚¬ع©ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ°ط·آ¸ط¸آ¾."); });
  bot.action(/^adm:methodImg:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    setStep(ctx.from.id, { kind: "admin:setMethodImage", methodId: Number(ctx.match[1]) });
    await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬â€œط¢آ¼ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آµط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ¸ط¸آ¹ ط·آ·ط¹آ¾ط·آ·ط¢آ±ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ§:", Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "adm:methods")]]));
  });
  bot.action(/^adm:methodImgDel:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    await q("UPDATE deposit_methods SET image_file_id=NULL WHERE id=$1", [Number(ctx.match[1])]);
    await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ­ط·آ·ط¢آ°ط·آ¸ط¸آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آµط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ·ط¢آ©.");
  });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Admin: product management ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.action(/^adm:editPrice:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const all = await getCachedProducts(); const p = all.find(x => x.id === pid); setStep(ctx.from.id, { kind: "admin:editPrice", productId: pid, productName: p?.name ?? "" }); await ctx.reply(`ط£آ¢ط¥â€œط¹ث†ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ³ط·آ·ط¢آ¹ط·آ·ط¢آ±: ${p?.name ?? pid}\nط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ: \`%5\` ط·آ·ط¢آ±ط·آ·ط¢آ¨ط·آ·ط¢آ­ ط·آ·ط¢آ£ط·آ¸ط«â€  \`$2.5\` ط·آ·ط¹آ¾ط·آ·ط¢آ«ط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ·ط¹آ¾ ط·آ·ط¢آ£ط·آ¸ط«â€  \`reset\``, { parse_mode: "Markdown" }); });
  bot.action(/^adm:editInstr:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const all = await getCachedProducts(); const p = all.find(x => x.id === pid); setStep(ctx.from.id, { kind: "admin:editProductInstructions", productId: pid, productName: p?.name ?? "" }); await ctx.reply(`ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬آ¹ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ط·آ·ط¹آ¾ ${p?.name ?? pid} ط·آ·ط¢آ£ط·آ¸ط«â€  clear ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¢آ­:`, Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", `prod:${pid}:0`)]])); });
  bot.action(/^adm:renameProd:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const all = await getCachedProducts(); const p = all.find(x => x.id === pid); setStep(ctx.from.id, { kind: "admin:renameProduct", productId: pid, productName: p?.name ?? "" }); await ctx.reply(`ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬إ’ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â€ڑآ¬ "${p?.name ?? pid}" ط·آ·ط¢آ£ط·آ¸ط«â€  reset:`); });
  bot.action(/^adm:moveProd:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const all = await getCachedProducts(); const p = all.find(x => x.id === pid); setStep(ctx.from.id, { kind: "admin:moveProduct", productId: pid, productName: p?.name ?? "" }); await ctx.reply(`ط¸â€¹ط¹ط›ط¹â€کط¹â€ک ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬â€چ "${p?.name ?? pid}"\nط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ£ط·آ¸ط«â€  reset:`, Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", `prod:${pid}:0`)]])); });
  bot.action(/^adm:hideProd:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const pid = Number(ctx.match[1]); const cur = (await q("SELECT hidden FROM product_overrides WHERE product_id=$1", [pid])).rows[0];
    const nextHidden = !(cur?.hidden ?? false);
    await q("INSERT INTO product_overrides(product_id,hidden) VALUES($1,$2) ON CONFLICT(product_id) DO UPDATE SET hidden=$2, updated_at=NOW()", [pid, nextHidden]);
    invalidateCaches(); await ctx.reply(nextHidden ? "ط¸â€¹ط¹ط›أ¢â€‍آ¢ط«â€  ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ·ط¢آ®ط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط·إ’ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬." : "ط¸â€¹ط¹ط›أ¢â‚¬ع©ط¸آ¾ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ·ط¢آ¸ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ§ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬.");
  });
  bot.action(/^adm:deleteProd:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const pid = Number(ctx.match[1]);
    const product = (await q("SELECT name FROM cached_products WHERE id=$1", [pid])).rows[0];
    if (!product) { await ctx.reply("أ¢â€Œإ’ ط·آ§ط¸â€‍ط¸â€¦ط¸â€ ط·ع¾ط·آ¬ ط·ط›ط¸ظ¹ط·آ± ط¸â€¦ط¸ث†ط·آ¬ط¸ث†ط·آ¯."); return; }
    await q(
      `INSERT INTO product_overrides(product_id,product_name,deleted,hidden)
       VALUES($1,$2,true,true)
       ON CONFLICT(product_id) DO UPDATE SET deleted=true,hidden=true,updated_at=NOW()`,
      [pid, product.name]
    );
    await q("UPDATE cached_products SET deleted=true,available=false,updated_at=NOW() WHERE id=$1", [pid]);
    invalidateCaches();
    await ctx.reply("أ¢إ“â€¦ ط·ع¾ط¸â€¦ ط·آ­ط·آ°ط¸ظ¾ ط·آ§ط¸â€‍ط¸â€¦ط¸â€ ط·ع¾ط·آ¬ ط¸â€ ط¸â€،ط·آ§ط·آ¦ط¸ظ¹ط·آ§ط¸â€¹ ط¸â€¦ط¸â€  ط·آ§ط¸â€‍ط¸ئ’ط·ع¾ط·آ§ط¸â€‍ط¸ث†ط·آ¬.");
    await showMainMenu(ctx);
  });
  bot.action(/^adm:deleteProdAsk:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const pid = Number(ctx.match[1]);
    await ctx.reply(
      "أ¢ع‘ أ¯آ¸عˆ ط·آ­ط·آ°ط¸ظ¾ ط·آ§ط¸â€‍ط¸â€¦ط¸â€ ط·ع¾ط·آ¬ ط¸â€ ط¸â€،ط·آ§ط·آ¦ط¸ظ¹ ط¸ث†ط¸â€‍ط·آ§ ط¸ظ¹ط·آ¹ط¸ث†ط·آ¯ ط·آ¹ط¸â€ ط·آ¯ ط·آ§ط¸â€‍ط¸â€¦ط·آ²ط·آ§ط¸â€¦ط¸â€ ط·آ©. ط¸â€،ط¸â€‍ ط·ع¾ط·آ±ط¸ظ¹ط·آ¯ ط·آ§ط¸â€‍ط¸â€¦ط·ع¾ط·آ§ط·آ¨ط·آ¹ط·آ©ط·ع؛",
      Markup.inlineKeyboard([[
        Markup.button.callback("أ¢إ“â€¦ ط¸â€ ط·آ¹ط¸â€¦ط·إ’ ط·آ§ط·آ­ط·آ°ط¸ظ¾", `adm:deleteProd:${pid}`),
        Markup.button.callback("أ¢â€Œإ’ ط·آ¥ط¸â€‍ط·ط›ط·آ§ط·طŒ", `prod:${pid}:0`),
      ]])
    );
  });
  bot.action(/^adm:deleteManualProd:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const id = Number(ctx.match[1]);
    const deleted = await q("DELETE FROM manual_products WHERE id=$1 RETURNING id", [id]);
    if (!deleted.rows.length) { await ctx.reply("أ¢â€Œإ’ ط·آ§ط¸â€‍ط¸â€¦ط¸â€ ط·ع¾ط·آ¬ ط·ط›ط¸ظ¹ط·آ± ط¸â€¦ط¸ث†ط·آ¬ط¸ث†ط·آ¯."); return; }
    invalidateCaches();
    await ctx.reply("أ¢إ“â€¦ ط·ع¾ط¸â€¦ ط·آ­ط·آ°ط¸ظ¾ ط·آ§ط¸â€‍ط¸â€¦ط¸â€ ط·ع¾ط·آ¬ ط¸â€ ط¸â€،ط·آ§ط·آ¦ط¸ظ¹ط·آ§ط¸â€¹.");
    await showMainMenu(ctx);
  });
  bot.action(/^adm:deleteManualProdAsk:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const id = Number(ctx.match[1]);
    await ctx.reply(
      "أ¢ع‘ أ¯آ¸عˆ ط·آ­ط·آ°ط¸ظ¾ ط·آ§ط¸â€‍ط¸â€¦ط¸â€ ط·ع¾ط·آ¬ ط·آ§ط¸â€‍ط¸ظ¹ط·آ¯ط¸ث†ط¸ظ¹ ط¸â€ ط¸â€،ط·آ§ط·آ¦ط¸ظ¹. ط¸â€،ط¸â€‍ ط·ع¾ط·آ±ط¸ظ¹ط·آ¯ ط·آ§ط¸â€‍ط¸â€¦ط·ع¾ط·آ§ط·آ¨ط·آ¹ط·آ©ط·ع؛",
      Markup.inlineKeyboard([[
        Markup.button.callback("أ¢إ“â€¦ ط¸â€ ط·آ¹ط¸â€¦ط·إ’ ط·آ§ط·آ­ط·آ°ط¸ظ¾", `adm:deleteManualProd:${id}`),
        Markup.button.callback("أ¢â€Œإ’ ط·آ¥ط¸â€‍ط·ط›ط·آ§ط·طŒ", `mprod:${id}:0`),
      ]])
    );
  });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Admin: category management ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.action(/^adm:catEdit:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:editCategoryName", categoryId: Number(ctx.match[1]) }); await ctx.reply("ط£آ¢ط¥â€œط¹ث†ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ (ط·آ·ط¢آ£ط·آ¸ط«â€  reset):"); });
  bot.action(/^adm:catToggle:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const cid = Number(ctx.match[1]); const cur = (await q("SELECT hidden FROM category_overrides WHERE category_id=$1", [cid])).rows[0];
    const nextHidden = !(cur?.hidden ?? false);
    await q("INSERT INTO category_overrides(category_id,hidden) VALUES($1,$2) ON CONFLICT(category_id) DO UPDATE SET hidden=$2, updated_at=NOW()", [cid, nextHidden]);
    invalidateCaches(); await ctx.reply(nextHidden ? "ط¸â€¹ط¹ط›أ¢â€‍آ¢ط«â€  ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ·ط¢آ®ط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط·إ’ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦." : "ط¸â€¹ط¹ط›أ¢â‚¬ع©ط¸آ¾ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ·ط¢آ¸ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ§ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦.");
  });
  bot.action(/^adm:catMarkup:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const cid = Number(ctx.match[1]); const cur = (await q("SELECT custom_markup_percent FROM category_overrides WHERE category_id=$1", [cid])).rows[0]; setStep(ctx.from.id, { kind: "admin:setCatMarkup", categoryId: cid }); await ctx.reply(`% ط·آ¸أ¢â‚¬ ط·آ·ط¢آ³ط·آ·ط¢آ¨ط·آ·ط¢آ© ط·آ·ط¢آ±ط·آ·ط¢آ¨ط·آ·ط¢آ­ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ${cid}\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ©: ${cur?.custom_markup_percent ?? "ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ·ط¢آ¯ط·آ·ط¢آ©"}\nط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ ط·آ·ط¢آ³ط·آ·ط¢آ¨ط·آ·ط¢آ© ط·آ·ط¢آ£ط·آ¸ط«â€  reset:`); });
  bot.action(/^adm:catSort:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const cid = Number(ctx.match[1]); setStep(ctx.from.id, { kind: "admin:setCatSort", categoryId: cid }); await ctx.reply(`ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¢آ¢ ط·آ·ط¹آ¾ط·آ·ط¢آ±ط·آ·ط¹آ¾ط·آ¸ط¸آ¹ط·آ·ط¢آ¨ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ${cid}\nط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ±ط·آ·ط¹آ¾ط·آ¸ط¸آ¹ط·آ·ط¢آ¨ ط·آ·ط¢آ£ط·آ¸ط«â€  reset:`); });
  bot.action(/^adm:moveCatAll:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:moveCatAll", sourceCategoryId: Number(ctx.match[1]) }); await ctx.reply(`ط¸â€¹ط¹ط›ط¹â€کط¹â€ک ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ¬ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ¹ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦\nط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬طŒط·آ·ط¢آ¯ط·آ¸ط¸آ¾ ط·آ·ط¢آ£ط·آ¸ط«â€  cancel:`, Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", `cat:${ctx.match[1]}:1:0`)]])); });
  bot.action(/^adm:moveCatToParent:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const cid = Number(ctx.match[1]);
    setStep(ctx.from.id, { kind: "admin:moveCatToParent", categoryId: cid });
    await ctx.reply(`ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¸آ¾ ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ®ط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¢ط·آ·ط¢آ®ط·آ·ط¢آ±\nط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬طŒط·آ·ط¢آ¯ط·آ¸ط¸آ¾ ط·آ·ط¢آ£ط·آ¸ط«â€  "0" ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ط·آ·ط¢آ°ط·آ·ط¢آ± ط·آ·ط¢آ£ط·آ¸ط«â€  "cancel" ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’:`, Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", `cat:${cid}:1:0`)]]));
  });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Admin: settings ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.action("adm:settings", async ctx => { await showSettingsMenu(ctx); });
  bot.action("adm:setMarkup", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:setMarkup" }); await ctx.reply("ط£آ¢ط¥â€œط¹ث†ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ³ط·آ·ط¢آ¨ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¨ط·آ·ط¢آ­ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ (ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ«ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چ: 5):", Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "adm:settings")]])); });
  bot.action("adm:setSocialMarkup", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:setSocialMarkup" }); await ctx.reply("ط£آ¢ط¥â€œط¹ث†ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ³ط·آ·ط¢آ¨ط·آ·ط¢آ© ط·آ·ط¢آ±ط·آ·ط¢آ¨ط·آ·ط¢آ­ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ¸ط«â€ ط·آ·ط¢آ´ط·آ¸أ¢â‚¬â€چ:", Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "adm:settings")]])); });
  bot.action("adm:setRate", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:setRate" }); await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ± ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ³ط·آ·ط¢آ¹ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آµط·آ·ط¢آ±ط·آ¸ط¸آ¾ (ط·آ¸أ¢â‚¬â€چ.ط·آ·ط¢آ³/$):", Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "adm:settings")]])); });
  bot.action("adm:newPass", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:newPassword" }); await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬ع© ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ¸ط«â€ ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ© (4 ط·آ·ط¢آ£ط·آ·ط¢آ­ط·آ·ط¢آ±ط·آ¸ط¸آ¾ ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬â€چ):", Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "adm:settings")]])); });
  bot.action("adm:changeLoginCmd", async ctx => {
    if (!(await requireSuperAdmin(ctx))) return;
    const cur = await getAdminLoginCommand();
    setStep(ctx.from.id, { kind: "admin:changeLoginCmd" });
    await ctx.reply(`ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¹آ¯ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹: \`${cur}\`\nط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ¯:`, { parse_mode: "Markdown" });
  });
  bot.action("adm:toggleStatus", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const cur = await getBotStatus(); const next = cur === "on" ? "off" : "on";
    await setSetting("bot_status", next);
    await ctx.reply(next === "on" ? "ط¸â€¹ط¹ط›ط¹ط›ط¢آ¢ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط«â€ ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¢ط·آ¸أ¢â‚¬  ط·آ·ط¢آ´ط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چ." : "ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¢آ´ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط«â€ ط·آ·ط¹آ¾ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ط·آ¸ط«â€ ط·آ¸أ¢â‚¬ع‘ط·آ¸ط¸آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¢ط·آ¸أ¢â‚¬ .");
    await showAdminMenu(ctx);
  });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Admin: product API sources ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.action("adm:apis", async ctx => { await showApiSources(ctx); });
  bot.action("adm:apiAdd", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    setStep(ctx.from.id, { kind: "admin:addApi:name" });
    await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¥â€™ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â€ڑآ¬API ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ¯:", Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "adm:apis")]]));
  });
  bot.action(/^adm:apiRename:(\d+)$/, async ctx => {
    if (!(await requireSuperAdmin(ctx))) return;
    const source = await getApiSource(Number(ctx.match[1]));
    if (!source) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آµط·آ·ط¢آ¯ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â€ڑآ¬API ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¯."); return; }
    setStep(ctx.from.id, { kind: "admin:renameApi", sourceId: source.id, oldName: source.name });
    await ctx.reply(`ط£آ¢ط¥â€œط¹ث†ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹: ${source.name}\nط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ¯:`, Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", `adm:api:${source.id}`)]]));
  });
  bot.action(/^adm:api:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const source = await getApiSource(Number(ctx.match[1]));
    if (!source) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آµط·آ·ط¢آ¯ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â€ڑآ¬API ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¯."); return; }
    const lastSync = source.last_sync_at ? new Date(source.last_sync_at).toLocaleString("ar") : "ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ²ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¢آ©";
    const error = source.last_sync_error ? `\nط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ¢ط·آ·ط¢آ®ط·آ·ط¢آ± ط·آ·ط¢آ®ط·آ·ط¢آ·ط·آ·ط¢آ£: ${source.last_sync_error}` : "";
    const buttons = [];
    const me = await getUser(ctx.from.id);
    if (me?.is_super_admin) {
      buttons.push([Markup.button.callback("ط£آ¢ط¥â€œط¹ث†ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¹آ¾ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ API", `adm:apiRename:${source.id}`)]);
    }
    if (!source.is_primary) {
      buttons.push([Markup.button.callback(source.active ? "ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¢آ´ ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ·ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ" : "ط¸â€¹ط¹ط›ط¹ط›ط¢آ¢ ط·آ·ط¹آ¾ط·آ¸ط¸آ¾ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ", `adm:apiToggle:${source.id}`), Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â€‌أ¢â‚¬ع©ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ­ط·آ·ط¢آ°ط·آ¸ط¸آ¾", `adm:apiDel:${source.id}`)]);
    }
    buttons.push([Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬â€چ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ²ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¢ط·آ¸أ¢â‚¬ ", `adm:apiSync:${source.id}`)]);
    buttons.push([Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "adm:apis")]);
    await sendOrEdit(ctx,
      `ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¥â€™ ${source.name}${source.is_primary ? " ط£آ¢ط¢آ­ط¹آ¯ (ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸ط¸آ¹)" : ""}\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ·ط¢آ·: ${source.base_url}\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ©: ${source.active ? "ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¸آ¾ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬ع©ط·آ¸أ¢â‚¬â€چ" : "ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ¸أ¢â‚¬ع‘ط·آ¸ط«â€ ط·آ¸ط¸آ¾"}\nط·آ·ط¢آ¢ط·آ·ط¢آ®ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ²ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¢آ©: ${lastSync}${error}`,
      Markup.inlineKeyboard(buttons));
  });
  bot.action(/^adm:apiToggle:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const id = Number(ctx.match[1]); const source = await getApiSource(id);
    if (!source || source.is_primary) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬  ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ·ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â€ڑآ¬API ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸ط¸آ¹."); return; }
    await q("UPDATE api_sources SET active=$1,updated_at=NOW() WHERE id=$2", [!source.active, id]);
    invalidateCaches(); await showApiSources(ctx);
  });
  bot.action(/^adm:apiDel:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const id = Number(ctx.match[1]); const source = await getApiSource(id);
    if (!source || source.is_primary) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬  ط·آ·ط¢آ­ط·آ·ط¢آ°ط·آ¸ط¸آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â€ڑآ¬API ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸ط¸آ¹."); return; }
    await q("DELETE FROM cached_products WHERE source_id=$1", [id]);
    await q("DELETE FROM api_sources WHERE id=$1", [id]);
    invalidateCaches(); await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ­ط·آ·ط¢آ°ط·آ¸ط¸آ¾ API ط·آ¸ط«â€ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬طŒ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¦â€™ط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط«â€ ط·آ·ط¢آ¬."); await showApiSources(ctx);
  });
  bot.action(/^adm:apiSync:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const source = await getApiSource(Number(ctx.match[1]));
    if (!source) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آµط·آ·ط¢آ¯ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â€ڑآ¬API ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¯."); return; }
    try {
      const count = await syncApiSource(source);
      invalidateCaches();
      await ctx.reply(`ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ²ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¢آ© ${count} ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬  ${source.name}.`);
    } catch (err) {
      await q("UPDATE api_sources SET last_sync_error=$1 WHERE id=$2", [String(err?.message ?? err).slice(0, 500), source.id]).catch(() => {});
      await ctx.reply("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ¸ط¸آ¾ط·آ·ط¢آ´ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ²ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¢آ©. ط·آ·ط¹آ¾ط·آ·ط¢آ­ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬ع‘ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ·ط¢آ· ط·آ¸ط«â€ API token.");
    }
    await showApiSources(ctx);
  });
  bot.action("adm:apiSyncAll", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    await ctx.reply("ط£آ¢ط¹ث†ط¢آ³ ط·آ·ط¢آ¨ط·آ·ط¢آ¯ط·آ·ط¢آ£ط·آ·ط¹آ¾ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ²ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ®ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ط·آ·ط¢آ©...");
    const summary = await syncAllApiSources();
    const successful = summary.filter(item => item.ok);
    const failed = summary.filter(item => !item.ok);
    const syncedCount = successful.reduce((total, item) => total + item.count, 0);
    const failedText = failed.length
      ? `\nط·آ·ط¢آ£ط·آ·ط¢آ®ط·آ·ط·إ’ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چ ط·آ·ط¹آ¾ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ«: ${failed.map(item => `${repairArabicEncoding(item.source.name)} (${item.error})`).join(" | ")}`
      : "";
    await ctx.reply(`ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬طŒط·آ·ط¹آ¾ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ²ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¢آ© ${successful.length} ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ APIs ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬  ${syncedCount} ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ½ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾.${failedText}`);
    await showApiSources(ctx);
  });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Admin: ping ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.action("adm:ping", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const [enabled, target, interval] = await Promise.all([getSetting("auto_ping_enabled"), getSetting("auto_ping_target_user_id"), getSetting("auto_ping_interval_min")]);
    await sendOrEdit(ctx, `ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¬ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸ط¸آ¹\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ©: ${enabled === "on" ? "ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¸آ¾ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬ع©ط·آ¸أ¢â‚¬â€چ" : "ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ¸أ¢â‚¬ع‘ط·آ¸ط«â€ ط·آ¸ط¸آ¾"}\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ¯ط·آ¸ط¸آ¾: ${target || "ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ·ط¢آ¯"}\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط¢آµط·آ¸أ¢â‚¬â€چ: ${interval} ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬ع‘ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ©`,
      Markup.inlineKeyboard([[Markup.button.callback(enabled === "on" ? "ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ¸ط¸آ¾" : "ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸ط¸آ¾ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ", "adm:pingToggle")], [Markup.button.callback("ط¸â€¹ط¹ط›ط¹ع©ط¢آ¯ ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ¯ط·آ¸ط¸آ¾", "adm:pingTarget")], [Markup.button.callback("ط£آ¢ط¹ث†ط¢آ± ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط¢آµط·آ¸أ¢â‚¬â€چ", "adm:pingInterval")], [Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "admin:menu")]]));
  });
  bot.action("adm:pingToggle", async ctx => { if (!(await requireAdmin(ctx))) return; const cur = await getSetting("auto_ping_enabled"); await setSetting("auto_ping_enabled", cur === "on" ? "off" : "on"); await ctx.reply(cur === "on" ? "ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ¸ط¸آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¬." : "ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸ط¸آ¾ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¬."); });
  bot.action("adm:pingTarget", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:pingTarget" }); await ctx.reply("ط¸â€¹ط¹ط›ط¹ع©ط¢آ¯ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ID ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬طŒط·آ·ط¢آ¯ط·آ¸ط¸آ¾:"); });
  bot.action("adm:pingInterval", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:pingInterval" }); await ctx.reply("ط£آ¢ط¹ث†ط¢آ± ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط¢آµط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ²ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ¸ط¸آ¹ ط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬ع‘:"); });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Admin: contacts ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.action("adm:contacts", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const links = (await q("SELECT * FROM contact_links ORDER BY id")).rows;
    const rows = links.map(l => [Markup.button.callback(`${l.active ? "ط¸â€¹ط¹ط›ط¹ط›ط¢آ¢" : "ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¢آ´"} ${l.name}`, `adm:contactEdit:${l.id}`)]);
    rows.push([Markup.button.callback("ط£آ¢أ¢â‚¬ع†أ¢â‚¬آ¢ ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¢آ©", "adm:addContact")]); rows.push([Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "admin:menu")]);
    await sendOrEdit(ctx, "ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع† ط·آ¸ط«â€ ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ·ط¢آµط·آ¸أ¢â‚¬â€چ:", Markup.inlineKeyboard(rows));
  });
  bot.action("adm:addContact", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:addContact:name" }); await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع† ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ¸ط«â€ ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ·ط¢آµط·آ¸أ¢â‚¬â€چ:", Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "adm:contacts")]])); });
  bot.action(/^adm:contactEdit:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const id = Number(ctx.match[1]); const l = (await q("SELECT * FROM contact_links WHERE id=$1", [id])).rows[0]; if (!l) return;
    await sendOrEdit(ctx, `ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع† ${l.name}\n${l.link}`,
      Markup.inlineKeyboard([[Markup.button.callback(l.active ? "ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¢آ´ ط·آ·ط¢آ¥ط·آ·ط¢آ®ط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط·إ’" : "ط¸â€¹ط¹ط›ط¹ط›ط¢آ¢ ط·آ·ط¢آ¥ط·آ·ط¢آ¸ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ§ط·آ·ط¢آ±", `adm:contactToggle:${id}`), Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â€‌أ¢â‚¬ع©ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ­ط·آ·ط¢آ°ط·آ¸ط¸آ¾", `adm:contactDel:${id}`)], [Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "adm:contacts")]]));
  });
  bot.action(/^adm:contactToggle:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const id = Number(ctx.match[1]); const l = (await q("SELECT active FROM contact_links WHERE id=$1", [id])).rows[0]; if (!l) return; await q("UPDATE contact_links SET active=$1 WHERE id=$2", [!l.active, id]); });
  bot.action(/^adm:contactDel:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; await q("DELETE FROM contact_links WHERE id=$1", [Number(ctx.match[1])]); await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬â€‌أ¢â‚¬ع©ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ°ط·آ¸ط¸آ¾."); });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Admin: manual product categories ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.action("adm:manualCats", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const cats = (await q("SELECT * FROM manual_categories WHERE parent_id=0 ORDER BY position,id")).rows;
    const rows = cats.map(c => [
      Markup.button.callback(`${c.active ? "ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع‘" : "ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬â„¢"} ${c.name}`, `mcat:${c.id}:1:0`)
    ]);
    rows.push([Markup.button.callback("ط£آ¢أ¢â‚¬ع†أ¢â‚¬آ¢ ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¢آ© ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸ط¸آ¹", "adm:addManualCat:0")]);
    rows.push([Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "adm:manualProds")]);
    await sendOrEdit(ctx, "ط¸â€¹ط¹ط›ط¢آ§ط·â€؛ ط·آ·ط¢آ£ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸ط¸آ¹ط·آ·ط¢آ©:", Markup.inlineKeyboard(rows));
  });
  bot.action(/^adm:manualCats:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const parentId = Number(ctx.match[1]);
    const parent = (await q("SELECT name FROM manual_categories WHERE id=$1", [parentId])).rows[0];
    const cats = (await q("SELECT * FROM manual_categories WHERE parent_id=$1 ORDER BY position,id", [parentId])).rows;
    const rows = cats.map(c => [Markup.button.callback(`${c.active ? "ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع‘" : "ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬â„¢"} ${c.name}`, `mcat:${c.id}:1:${parentId}`)]);
    rows.push([Markup.button.callback("ط£آ¢أ¢â‚¬ع†أ¢â‚¬آ¢ ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¢آ© ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ¸ط¸آ¾ط·آ·ط¢آ±ط·آ·ط¢آ¹ط·آ¸ط¸آ¹", `adm:addManualCat:${parentId}`)]);
    rows.push([Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", `mcat:${parentId}:1:0`)]);
    await sendOrEdit(ctx, `ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع‘ ط·آ·ط¢آ£ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ®ط·آ¸أ¢â‚¬â€چ "${parent?.name ?? parentId}":`, Markup.inlineKeyboard(rows));
  });
  bot.action(/^adm:addManualCat:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    setStep(ctx.from.id, { kind: "admin:addManualCategory:name", parentId: Number(ctx.match[1]) });
    await ctx.reply("ط¸â€¹ط¹ط›ط¢آ§ط·â€؛ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸ط¸آ¹ط·آ·ط¢آ©:", Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "adm:manualCats")]]));
  });
  bot.action(/^adm:mcatEdit:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    setStep(ctx.from.id, { kind: "admin:editManualCategoryName", categoryId: Number(ctx.match[1]) });
    await ctx.reply("ط£آ¢ط¥â€œط¹ث†ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸ط¸آ¹:");
  });
  bot.action(/^adm:mcatToggle:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const id = Number(ctx.match[1]);
    const cat = (await q("SELECT active FROM manual_categories WHERE id=$1", [id])).rows[0];
    if (!cat) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¯."); return; }
    await q("UPDATE manual_categories SET active=$1,updated_at=NOW() WHERE id=$2", [!cat.active, id]);
    invalidateCaches();
    await ctx.reply(cat.active ? "ط¸â€¹ط¹ط›أ¢â€‍آ¢ط«â€  ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ·ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦." : "ط¸â€¹ط¹ط›أ¢â‚¬ع©ط¸آ¾ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸ط¸آ¾ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦.");
    await showManualCategory(ctx, id, 1, 0);
  });
  bot.action(/^adm:mcatMoveAll:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const rootId = Number(ctx.match[1]);
    const ids = [rootId];
    for (let i = 0; i < ids.length; i++) {
      const children = (await q("SELECT id FROM manual_categories WHERE parent_id=$1", [ids[i]])).rows;
      ids.push(...children.map(r => Number(r.id)));
    }
    const moved = await q(
      "UPDATE manual_products SET category_id=0,category_is_virtual=false,updated_at=NOW() WHERE category_id=ANY($1) RETURNING id",
      [ids]
    );
    invalidateCaches();
    await ctx.reply(`ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ·ط¢آ®ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ¬ ${moved.rows.length} ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬طŒط·آ·ط¢آ§ ط·آ·ط¢آ¶ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ©.`);
    await showManualCategory(ctx, rootId, 1, 0);
  });
  bot.action(/^adm:mcatDel:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const id = Number(ctx.match[1]);
    const cat = (await q("SELECT name FROM manual_categories WHERE id=$1", [id])).rows[0];
    if (!cat) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¯."); return; }
    await sendOrEdit(ctx, `ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ­ط·آ·ط¢آ°ط·آ¸ط¸آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ "${cat.name}" ط·آ¸ط«â€ ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¾ط·آ·ط¢آ±ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ط·آ·ط¢آ©.\nط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ¸ط¹ث†ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ©. ط·آ¸أ¢â‚¬طŒط·آ¸أ¢â‚¬â€چ ط·آ·ط¹آ¾ط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ·ط¢آ¹ط·آ·ط¹ط›`,
      Markup.inlineKeyboard([
        [Markup.button.callback("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬آ¦ط·آ·ط¥â€™ ط·آ·ط¢آ§ط·آ·ط¢آ­ط·آ·ط¢آ°ط·آ¸ط¸آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦", `adm:mcatDelConfirm:${id}`)],
        [Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", `mcat:${id}:1:0`)]
      ]));
  });
  bot.action(/^adm:mcatDelConfirm:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const rootId = Number(ctx.match[1]);
    const ids = [rootId];
    for (let i = 0; i < ids.length; i++) {
      const children = (await q("SELECT id FROM manual_categories WHERE parent_id=$1", [ids[i]])).rows;
      ids.push(...children.map(r => Number(r.id)));
    }
    await q("UPDATE manual_products SET category_id=0,category_is_virtual=false,updated_at=NOW() WHERE category_id=ANY($1)", [ids]);
    await q("DELETE FROM manual_categories WHERE id=ANY($1)", [ids]);
    invalidateCaches();
    await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ­ط·آ·ط¢آ°ط·آ¸ط¸آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ¸ط«â€ ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬طŒ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ©.");
    await showCategory(ctx, 0, 1, 0);
  });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Admin: virtual categories ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.action("adm:vcList", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const vcs = (await q("SELECT * FROM virtual_categories WHERE parent_id=0 ORDER BY position")).rows;
    const rows = vcs.map(v => [Markup.button.callback(`${v.active ? "ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع‘" : "ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬â„¢"} ${v.name}`, `vcat:${v.id}:1:0`)]);
    rows.push([Markup.button.callback("ط£آ¢أ¢â‚¬ع†أ¢â‚¬آ¢ ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¢آ© ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦", "adm:addVCat")]); rows.push([Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "admin:menu")]);
    await sendOrEdit(ctx, "ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¸آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ®ط·آ·ط¢آµط·آ·ط¢آµط·آ·ط¢آ©:", Markup.inlineKeyboard(rows));
  });
  bot.action("adm:addVCat", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:addVirtualCategory:name", parentId: 0 }); await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¸آ¾ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ®ط·آ·ط¢آµط·آ·ط¢آµ:", Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "adm:vcList")]])); });
  bot.action(/^adm:addVCatSub:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const pv = (await q("SELECT name FROM virtual_categories WHERE id=$1", [pid])).rows[0]; setStep(ctx.from.id, { kind: "admin:addVirtualCategory:name", parentId: pid }); await ctx.reply(`ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¸آ¾ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¾ط·آ·ط¢آ±ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ®ط·آ¸أ¢â‚¬â€چ "${pv?.name ?? pid}":`, Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", `vcat:${pid}:1:0`)]])); });
  bot.action(/^adm:vcEdit:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:editVCatName", vcId: Number(ctx.match[1]) }); await ctx.reply("ط£آ¢ط¥â€œط¹ث†ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦:"); });
  bot.action(/^adm:vcToggle:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const id = Number(ctx.match[1]); const v = (await q("SELECT active FROM virtual_categories WHERE id=$1", [id])).rows[0]; if (!v) return; await q("UPDATE virtual_categories SET active=$1, updated_at=NOW() WHERE id=$2", [!v.active, id]); await ctx.reply(!v.active ? "ط¸â€¹ط¹ط›أ¢â‚¬ع©ط¸آ¾ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¸ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ§ط·آ·ط¢آ±." : "ط¸â€¹ط¹ط›أ¢â€‍آ¢ط«â€  ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ®ط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط·إ’."); });
  bot.action(/^adm:vcMoveAll:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const rootId = Number(ctx.match[1]);
    const ids = [rootId];
    for (let i = 0; i < ids.length; i++) {
      const children = (await q("SELECT id FROM virtual_categories WHERE parent_id=$1", [ids[i]])).rows;
      ids.push(...children.map(r => Number(r.id)));
    }
    const manual = await q(
      "UPDATE manual_products SET category_id=0,category_is_virtual=false,updated_at=NOW() WHERE category_id=ANY($1) RETURNING id",
      [ids]
    );
    const api = await q(
      "UPDATE product_overrides SET custom_category_id=NULL,updated_at=NOW() WHERE custom_category_id=ANY($1) RETURNING product_id",
      [ids]
    );
    invalidateCaches();
    await ctx.reply(`ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ·ط¢آ®ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ¬ ${manual.rows.length + api.rows.length} ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦.`);
    await showVirtualCategory(ctx, rootId, 1, 0);
  });
  bot.action(/^adm:vcDel:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const id = Number(ctx.match[1]);
    const cat = (await q("SELECT name FROM virtual_categories WHERE id=$1", [id])).rows[0];
    if (!cat) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¯."); return; }
    await sendOrEdit(ctx, `ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ­ط·آ·ط¢آ°ط·آ¸ط¸آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ "${cat.name}" ط·آ¸ط«â€ ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¾ط·آ·ط¢آ±ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ط·آ·ط¢آ©.\nط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ¸ط¹ث†ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ£ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ§ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ·ط¢آµط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ©/ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ©. ط·آ¸أ¢â‚¬طŒط·آ¸أ¢â‚¬â€چ ط·آ·ط¹آ¾ط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ·ط¢آ¹ط·آ·ط¹ط›`,
      Markup.inlineKeyboard([
        [Markup.button.callback("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬آ¦ط·آ·ط¥â€™ ط·آ·ط¢آ§ط·آ·ط¢آ­ط·آ·ط¢آ°ط·آ¸ط¸آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦", `adm:vcDelConfirm:${id}`)],
        [Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", `vcat:${id}:1:0`)]
      ]));
  });
  bot.action(/^adm:vcDelConfirm:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const rootId = Number(ctx.match[1]);
    const ids = [rootId];
    for (let i = 0; i < ids.length; i++) {
      const children = (await q("SELECT id FROM virtual_categories WHERE parent_id=$1", [ids[i]])).rows;
      ids.push(...children.map(r => Number(r.id)));
    }
    await q("UPDATE manual_products SET category_id=0,category_is_virtual=false,updated_at=NOW() WHERE category_id=ANY($1)", [ids]);
    await q("UPDATE product_overrides SET custom_category_id=NULL,updated_at=NOW() WHERE custom_category_id=ANY($1)", [ids]);
    await q("DELETE FROM virtual_categories WHERE id=ANY($1)", [ids]);
    invalidateCaches();
    await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ­ط·آ·ط¢آ°ط·آ¸ط¸آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ¸ط«â€ ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ®ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸أ¢â‚¬طŒ.");
    await showCategory(ctx, 0, 1, 0);
  });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Admin: manual products ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.action("adm:manualProds", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const prods = (await q("SELECT * FROM manual_products ORDER BY id")).rows;
    const pendingCount = (await q("SELECT COUNT(*)::int AS c FROM manual_orders WHERE status='pending'")).rows[0]?.c ?? 0;
    const rows = prods.map(p => [Markup.button.callback(`${p.active ? "ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢" : "ط£آ¢أ¢â‚¬إ’ط¥â€™"} ${p.name}`, `adm:manualProd:${p.id}`)]);
    rows.push([Markup.button.callback(`ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬آ¹ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ©${pendingCount > 0 ? ` (${pendingCount})` : ""}`, "adm:manualOrders")]);
    rows.push([Markup.button.callback("ط¸â€¹ط¹ط›ط¢آ§ط·â€؛ ط·آ·ط¢آ£ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "adm:manualCats")]);
    rows.push([Markup.button.callback("ط£آ¢أ¢â‚¬ع†أ¢â‚¬آ¢ ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¢آ© ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸ط¸آ¹", "adm:addManual")]); rows.push([Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "admin:menu")]);
    await sendOrEdit(ctx, "ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸ط¸آ¹ط·آ·ط¢آ©:", Markup.inlineKeyboard(rows));
  });
  bot.action("adm:addManual", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:addManualProduct:name" }); await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬إ’ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸ط¸آ¹:", Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "adm:manualProds")]])); });
  bot.action(/^adm:addManualInCat:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const categoryId = Number(ctx.match[1]);
    const cat = (await q("SELECT name FROM manual_categories WHERE id=$1", [categoryId])).rows[0];
    if (!cat) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¯."); return; }
    setStep(ctx.from.id, { kind: "admin:addManualProduct:name", manualCategoryId: categoryId });
    await ctx.reply(`ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬إ’ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬طŒ ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ®ط·آ¸أ¢â‚¬â€چ "${cat.name}":`, Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", `mcat:${categoryId}:1:0`)]]));
  });
  bot.action(/^adm:manualProd:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const pid = Number(ctx.match[1]); const p = (await q("SELECT * FROM manual_products WHERE id=$1", [pid])).rows[0]; if (!p) return;
    await sendOrEdit(ctx, `ط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ${p.name}\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ¹ط·آ·ط¢آ±: ${Number(p.price_usd).toFixed(2)}$\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ©: ${p.active ? "ط£آ¢ط¥â€œأ¢â‚¬آ¦" : "ط£آ¢أ¢â‚¬إ’ط¥â€™"}`,
      Markup.inlineKeyboard([[Markup.button.callback(p.active ? "ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ·ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ" : "ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸ط¸آ¾ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ", `adm:manualToggle:${pid}`)], [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â€‌أ¢â‚¬ع©ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ­ط·آ·ط¢آ°ط·آ¸ط¸آ¾", `adm:manualDel:${pid}`)], [Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "adm:manualProds")]]));
  });
  bot.action(/^adm:manualToggle:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const p = (await q("SELECT active FROM manual_products WHERE id=$1", [pid])).rows[0]; if (!p) return; await q("UPDATE manual_products SET active=$1, updated_at=NOW() WHERE id=$2", [!p.active, pid]); await ctx.reply(!p.active ? "ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ¸ط¸آ¾ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ." : "ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ·ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ."); });
  bot.action(/^adm:manualDel:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; await q("DELETE FROM manual_products WHERE id=$1", [Number(ctx.match[1])]); await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬â€‌أ¢â‚¬ع©ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ°ط·آ¸ط¸آ¾."); });
  bot.action("adm:manualOrders", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const orders = (await q("SELECT * FROM manual_orders WHERE status='pending' ORDER BY id DESC LIMIT 30")).rows;
    if (!orders.length) { await sendOrEdit(ctx, "ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ­ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ·ط¹آ¾ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ·ط¢آ¯ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸ط¸آ¹ط·آ·ط¢آ© ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ©.", Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "adm:manualProds")]])); return; }
    const rows = orders.map(o => [Markup.button.callback(`${o.product_name.slice(0, 20)} ط£آ¢أ¢â€ڑآ¬ط¢آ¢ ${Number(o.price_usd).toFixed(2)}$`.slice(0, 60), `adm:mord:${o.id}`)]);
    rows.push([Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "adm:manualProds")]);
    await sendOrEdit(ctx, `ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸ط¸آ¹ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ© (${orders.length}):`, Markup.inlineKeyboard(rows));
  });
  bot.action(/^adm:mord:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const oid = Number(ctx.match[1]); const o = (await q("SELECT * FROM manual_orders WHERE id=$1", [oid])).rows[0]; if (!o) return;
    const u = (await q("SELECT * FROM users WHERE id=$1", [o.user_id])).rows[0];
    const rate = await getExchangeRate(); const syp = Math.round(Number(o.price_usd) * rate);
    await sendOrEdit(ctx, `ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬آ¹ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸ط¸آ¹\nط¸â€¹ط¹ط›أ¢â‚¬ع©ط¢آ¤ ${u?.username ? "@" + u.username : `ID:${o.user_id}`}\nط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ${o.product_name}\nط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ° ${Number(o.price_usd).toFixed(2)}$ | ${syp.toLocaleString("en-US")} ط·آ¸أ¢â‚¬â€چ.ط·آ·ط¢آ³\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ©: ${o.status}`,
      Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ¨ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چ ط·آ¸ط«â€ ط·آ·ط¹آ¾ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬آ¦", `adm:mordAccept:${oid}`), Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ±ط·آ¸ط¸آ¾ط·آ·ط¢آ¶ ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ±ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¯", `adm:mordReject:${oid}`)], [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ¬ ط·آ·ط¢آ¥ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ©", `adm:mordMsg:${oid}`)], [Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "adm:manualOrders")]]));
  });
  bot.action(/^adm:mordAccept:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const oid = Number(ctx.match[1]); const o = (await q("SELECT * FROM manual_orders WHERE id=$1", [oid])).rows[0]; if (!o || o.status !== "pending") { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬طŒ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹."); return; } setStep(ctx.from.id, { kind: "admin:manualOrderAccept", orderId: oid, userId: Number(o.user_id), productName: o.product_name, priceUsd: Number(o.price_usd) }); await ctx.reply(`ط£آ¢ط¥â€œط¹ث†ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ£ط·آ¸ط«â€  "skip":`); });
  bot.action(/^adm:mordReject:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const oid = Number(ctx.match[1]); const o = (await q("SELECT * FROM manual_orders WHERE id=$1", [oid])).rows[0]; if (!o || o.status !== "pending") { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬طŒ."); return; }
    await q("UPDATE manual_orders SET status='rejected', updated_at=NOW() WHERE id=$1", [oid]);
    await adjustBalance(Number(o.user_id), Number(o.price_usd));
    await ctx.reply(`ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ¸ط¸آ¾ط·آ·ط¢آ¶ ط·آ¸ط«â€ ط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯.`);
    const rate = await getExchangeRate(); const syp = Math.round(Number(o.price_usd) * rate);
    // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¹ط·آ·ط¢آ±ط·آ·ط¢آ¶ ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
    await ctx.telegram.sendMessage(o.user_id, `ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ±ط·آ¸ط¸آ¾ط·آ·ط¢آ¶ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط¦â€™\nط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ${o.product_name}\nط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ° ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ ط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ© ${Number(o.price_usd).toFixed(2)}$ | ${syp.toLocaleString("en-US")} ط·آ¸أ¢â‚¬â€چ.ط·آ·ط¢آ³`, Markup.inlineKeyboard([[Markup.button.callback("ط¸â€¹ط¹ط›ط¹ث†  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "home")]])).catch(() => {});
  });
  bot.action(/^adm:mordMsg:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const oid = Number(ctx.match[1]); const o = (await q("SELECT user_id FROM manual_orders WHERE id=$1", [oid])).rows[0]; if (!o) return; setStep(ctx.from.id, { kind: "admin:manualOrderMsg", orderId: oid, userId: Number(o.user_id) }); await ctx.reply(`ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ¬ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ${o.user_id}:`); });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Admin: nav buttons ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.action("adm:btnLabels", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const [b, h, p2, n] = await Promise.all([getBtnBackLabel(), getBtnHomeLabel(), getBtnPrevLabel(), getBtnNextLabel()]);
    await sendOrEdit(ctx, `ط¸â€¹ط¹ط›أ¢â‚¬â€Œط¹آ© ط·آ·ط¢آ£ط·آ·ط¢آ²ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬â€چ:\nط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹: ${b}\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©: ${h}\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬ع‘: ${p2}\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹: ${n}`,
      Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢ط¥â€œط¹ث†ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ²ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "adm:btnEdit:btn_back_label:ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹")], [Markup.button.callback("ط£آ¢ط¥â€œط¹ث†ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ²ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "adm:btnEdit:btn_home_label:ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©")], [Markup.button.callback("ط£آ¢ط¥â€œط¹ث†ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ²ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬ع‘", "adm:btnEdit:btn_prev_label:ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬ع‘")], [Markup.button.callback("ط£آ¢ط¥â€œط¹ث†ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ²ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹", "adm:btnEdit:btn_next_label:ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹")], [Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬â€چ ط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¹آ¾ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ¶ط·آ¸ط¸آ¹", "adm:btnReset")], [Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "adm:settings")]]));
  });
  bot.action(/^adm:btnEdit:([^:]+):(.+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const key = ctx.match[1]; setStep(ctx.from.id, { kind: "admin:editBtnLabel", key }); await ctx.reply(`ط£آ¢ط¥â€œط¹ث†ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ ط·آ·ط¢آµ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ·ط¢آ²ط·آ·ط¢آ±:`); });
  bot.action("adm:btnReset", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    await Promise.all(["btn_back_label", "btn_home_label", "btn_prev_label", "btn_next_label"].map(k => setSetting(k, DEFAULTS[k])));
    await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ ط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ·ط¢آ²ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ± ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¹آ¾ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ¶ط·آ¸ط¸آ¹.");
  });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Admin: AI support ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.action("adm:aiSupport", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    clearAiHistory(ctx.from.id);
    setStep(ctx.from.id, { kind: "admin:aiSupport" });
    await ctx.reply(`ط¸â€¹ط¹ط›أ¢â‚¬ط› ط£آ¯ط¢آ¸ط¹ث† ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ¹ط·آ·ط¢آ¯ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ©${hasAiKey() ? "" : " (ط·آ¸ط«â€ ط·آ·ط¢آ¶ط·آ·ط¢آ¹ FAQ)"}\nط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ³ط·آ·ط¢آ¤ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¦â€™ ط·آ·ط¢آ£ط·آ¸ط«â€  "ط·آ·ط¢آ®ط·آ·ط¢آ±ط·آ¸ط«â€ ط·آ·ط¢آ¬" ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ§ط·آ·ط·إ’:`, Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "admin:menu")]]));
  });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Photo handler ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.on("photo", async ctx => {
    const step = getStep(ctx.from.id);
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;

    if (step.kind === "admin:setMethodImage") {
      await q("UPDATE deposit_methods SET image_file_id=$1 WHERE id=$2", [fileId, step.methodId]);
      setStep(ctx.from.id, { kind: "idle" });
      await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ­ط·آ¸ط¸آ¾ط·آ·ط¢آ¸ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آµط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ·ط¢آ©. ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ¸ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ± ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬  ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¯ ط·آ·ط¢آ§ط·آ·ط¢آ®ط·آ·ط¹آ¾ط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ·ط¢آ± ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ°ط·آ¸أ¢â‚¬طŒ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ·ط¢آ±ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ©.");
      return;
    }

    if (step.kind === "admin:addMethod:photo") {
      await q("INSERT INTO deposit_methods(name,identifier,instructions,image_file_id) VALUES($1,$2,$3,$4)",
        [step.name, step.identifier, step.instructions, fileId]);
      setStep(ctx.from.id, { kind: "idle" });
      await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¢آ© ط·آ·ط¢آ·ط·آ·ط¢آ±ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آµط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ·ط¢آ©.");
      return;
    }

    // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¯ط·آ¸ط¸آ¾ط·آ¸أ¢â‚¬ع‘ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ¯: ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آµط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ·ط¢آ© ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
    if (step.kind === "deposit:info") {
      // ط·آ·ط¢آ¥ط·آ·ط¢آ°ط·آ·ط¢آ§ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع‘ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آµط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ·ط¢آ©ط·آ·ط¥â€™ ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ±ط·آ·ط¢آ£ط·آ¸أ¢â‚¬طŒ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¢آ´ط·آ·ط¢آ±ط·آ·ط¢آ©.
      const caption = ctx.message.caption?.trim() || "";
      const captionAmount = caption
        ? extractAmountFromText(caption, await getExchangeRate())
        : null;
      const newStep = {
        ...step,
        photoFileId: fileId,
        amount: step.amount ?? captionAmount,
      };
      if (newStep.amount !== null) {
        // ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ ط·آ·ط¢آ§ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آµط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ·ط¢آ©ط·آ·ط¥â€™ ط·آ·ط¢آ§ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨
        await completeDepositRequest(ctx, newStep);
      } else {
        // ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¢آ§ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آµط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ·ط¢آ© ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¥â€™ ط·آ·ط¢آ§ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛
        setStep(ctx.from.id, newStep);
        await ctx.reply("ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ°ط·آ¸ط¸آ¹ ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ ط·آ·ط¢آ¨ط·آ·ط¹آ¾ط·آ·ط¢آ­ط·آ¸ط«â€ ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬طŒ:",
          Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "dep:cancel")]]));
      }
      return;
    }
  });

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Text router ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  bot.on("text", async (ctx, next) => {
    const step = getStep(ctx.from.id);
    const rawTxt = ctx.message.text.trim();
    const txt = repairArabicEncoding(rawTxt);

    // ط·آ·ط¹آ¾ط·آ·ط¢آ­ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬ع‘ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬  ط·آ·ط¢آ£ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ·ط¢آ®ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ±ط·آ¸ط¸آ¹
    if (!txt.startsWith("/")) {
      const loginCmd = await getAdminLoginCommand();
      if (rawTxt === loginCmd) {
        await ensureUser(ctx);
        setStep(ctx.from.id, { kind: "admin:login" });
        await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬ع© ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ¸ط«â€ ط·آ·ط¢آ±:");
        return;
      }
    }

    if (txt.startsWith("/")) return next();

    // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¯ط·آ¸ط¸آ¾ط·آ¸أ¢â‚¬ع‘ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ¯: ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
    if (step.kind === "deposit:info") {
      const exchangeRate = await getExchangeRate();
      const amount = extractAmountFromText(txt, exchangeRate);
      if (!amount || amount <= 0) {
        await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ£ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ·ط·آ·ط¢آ¹ ط·آ¸ط¸آ¾ط·آ¸أ¢â‚¬طŒط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛. ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬طŒ ط·آ·ط¢آ¨ط·آ·ط¢آ´ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ£ط·آ¸ط«â€ ط·آ·ط¢آ¶ط·آ·ط¢آ­ (ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ«ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چ: 5$ ط·آ·ط¢آ£ط·آ¸ط«â€  1000 ط·آ¸أ¢â‚¬â€چ.ط·آ·ط¢آ³).",
          Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "dep:cancel")]]));
        return;
      }
      const newStep = { ...step, amount };
      if (newStep.photoFileId) {
        // ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ ط·آ·ط¢آ§ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آµط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ·ط¢آ©ط·آ·ط¥â€™ ط·آ·ط¢آ§ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨
        await completeDepositRequest(ctx, newStep);
      } else {
        setStep(ctx.from.id, newStep);
        await ctx.reply(`ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آµط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ·ط¢آ© ط·آ·ط¢آ¥ط·آ·ط¢آ´ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ­ط·آ¸ط«â€ ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ.`,
          Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "dep:cancel")]]));
      }
      return;
    }

    if (step.kind === "order:qty") {
      const n = Number(txt); if (!Number.isFinite(n) || n <= 0) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ£ط·آ·ط¢آ¯ط·آ·ط¢آ®ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آµط·آ·ط¢آ­ط·آ¸ط¸آ¹ط·آ·ط¢آ­ ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ·ط¢آ¨."); return; }
      const qv = step.qtyValues; const qty = Array.isArray(qv) ? n : Math.floor(n);
      if (qv && !Array.isArray(qv)) { if (qty < qv.min || qty > qv.max) { await ctx.reply(`ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¦â€™ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ© ط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬  ${qv.min.toLocaleString("en-US")} ط·آ¸ط«â€  ${qv.max.toLocaleString("en-US")}.`); return; } }
      let all = await getCachedProducts(); let p = all.find(x => x.id === step.productId);
      if (!p) { all = await getCachedProducts(); p = all.find(x => x.id === step.productId); }
      if (!p) return;
      await askNextParam(ctx, p, step.priceUsd, qty, step.paramKeys, {}, 0, step.backTo); return;
    }
    if (step.kind === "order:params") {
      if (step.idx >= step.paramKeys.length) return next();
      const key = step.paramKeys[step.idx]; const collected = { ...step.collected, [key]: txt };
      let all = await getCachedProducts(); let p = all.find(x => x.id === step.productId);
      if (!p) { all = await getCachedProducts(); p = all.find(x => x.id === step.productId); }
      if (!p) return;
      await askNextParam(ctx, p, step.priceUsd, step.qty, step.paramKeys, collected, step.idx + 1, step.backTo); return;
    }
    if (step.kind === "order:manualNote") {
      const note = txt.toLowerCase() === "skip" ? null : txt;
      const m = (await q("SELECT * FROM manual_products WHERE id=$1", [step.productId])).rows[0];
      if (!m) return;
       const debited = await debitBalance(ctx.from.id, step.priceUsd);
       if (!debited) {
         setStep(ctx.from.id, { kind: "idle" });
         await ctx.reply("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸ط¦â€™ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ¸ط¹â€  ط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹. ط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چ ط·آ·ط¹آ¾ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ« ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ·ط¢آ«ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ£ط·آ·ط¢آ¹ط·آ·ط¢آ¯ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨.");
         return;
       }
      const ins = await q("INSERT INTO manual_orders(user_id,product_id,product_name,price_usd,note) VALUES($1,$2,$3,$4,$5) RETURNING *",
        [ctx.from.id, m.id, m.name, m.price_usd, note]);
      const ord = ins.rows[0];
      setStep(ctx.from.id, { kind: "idle" });
      // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¹ط·آ·ط¢آ±ط·آ·ط¢آ¶ ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
      await ctx.reply(`ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط¦â€™\nط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ${m.name}\nط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ¸أ¢â‚¬ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ط·آ·ط¢آ° ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ ط·آ·ط¢آ£ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ±ط·آ·ط¢آ¨ ط·آ¸ط«â€ ط·آ¸أ¢â‚¬ع‘ط·آ·ط¹آ¾.`, Markup.inlineKeyboard([[Markup.button.callback("ط¸â€¹ط¹ط›ط¹ث†  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "home")]]));
      const admins = await listAdmins();
      const rate = await getExchangeRate(); const syp = Math.round(step.priceUsd * rate);
      for (const a of admins) {
        await ctx.telegram.sendMessage(a.id, `ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬آ¹ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸ط¸آ¹ ط·آ·ط¢آ¬ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ¯\nط¸â€¹ط¹ط›أ¢â‚¬ع©ط¢آ¤ ${ctx.from.first_name ?? ctx.from.id}\nط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ${m.name}\nط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ° ${step.priceUsd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ط·آ¸أ¢â‚¬â€چ.ط·آ·ط¢آ³${note ? `\nط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬إ’ ${note}` : ""}`,
          Markup.inlineKeyboard([[Markup.button.callback("ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬آ¹ ط·آ·ط¢آ¹ط·آ·ط¢آ±ط·آ·ط¢آ¶ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨", `adm:mord:${ord.id}`)]])).catch(() => {});
      }
      return;
    }

    switch (step.kind) {
      case "admin:login": {
        const expected = await getAdminPassword();
        if (rawTxt !== expected) {
          await ctx.reply("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ¸ط«â€ ط·آ·ط¢آ± ط·آ·ط¢آ®ط·آ·ط¢آ§ط·آ·ط¢آ·ط·آ·ط¢آ¦ط·آ·ط¢آ©.", Markup.inlineKeyboard([[Markup.button.callback("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’", "home")]]));
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
        await ctx.reply(`ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ·ط¢آ³ط·آ·ط¢آ¬ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ·ط¢آ®ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چ${becomeSuper ? " (ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آ£ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ°) ط¸â€¹ط¹ط›ط¥â€™ط¹ط›" : ""}.`);
        await showAdminMenu(ctx); return;
      }
      case "admin:setMarkup": { const n = Number(txt); if (!Number.isFinite(n) || n < 0) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ£ط·آ·ط¢آ¯ط·آ·ط¢آ®ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ·ط¢آµط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹."); return; } await setSetting("markup_percent", String(n)); invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¨ط·آ·ط¢آ­ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦: ${n}%.`); await showSettingsMenu(ctx); return; }
      case "admin:setSocialMarkup": { const n = Number(txt); if (!Number.isFinite(n) || n < 0) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ£ط·آ·ط¢آ¯ط·آ·ط¢آ®ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ·ط¢آµط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹."); return; } await setSetting("social_markup_percent", String(n)); invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¢آ±ط·آ·ط¢آ¨ط·آ·ط¢آ­ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ¸ط«â€ ط·آ·ط¢آ´ط·آ¸أ¢â‚¬â€چ: ${n}%.`); await showSettingsMenu(ctx); return; }
      case "admin:setRate": { const n = Number(txt); if (!Number.isFinite(n) || n <= 0) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ³ط·آ·ط¢آ¹ط·آ·ط¢آ± ط·آ·ط¢آµط·آ·ط¢آ±ط·آ¸ط¸آ¾ ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آµط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­."); return; } await setSetting("exchange_rate", String(n)); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¢آ³ط·آ·ط¢آ¹ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آµط·آ·ط¢آ±ط·آ¸ط¸آ¾: ${n} ط·آ¸أ¢â‚¬â€چ.ط·آ·ط¢آ³/$.`); await showSettingsMenu(ctx); return; }
      case "admin:newPassword": { if (rawTxt.length < 4) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ¸ط«â€ ط·آ·ط¢آ± ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ±ط·آ·ط¢آ© ط·آ·ط¢آ¬ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹."); return; } await setSetting("admin_password", rawTxt); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ« ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ¸ط«â€ ط·آ·ط¢آ±."); return; }
      case "admin:changeLoginCmd": {
        if (rawTxt.length < 5) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ± ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آ¬ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ (5 ط·آ·ط¢آ£ط·آ·ط¢آ­ط·آ·ط¢آ±ط·آ¸ط¸آ¾ ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬â€چ)."); return; }
        await setSetting("admin_login_command", rawTxt); setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(`ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آ£ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ·ط¢آ®ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چ.`, { parse_mode: "Markdown" }); return;
      }
      case "admin:depositApproveAmount": {
        const n = Number(txt); if (!Number.isFinite(n) || n <= 0) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ£ط·آ·ط¢آ¯ط·آ·ط¢آ®ط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ·ط¢آµط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹."); return; }
        const updated = await q("UPDATE deposit_requests SET status='approved', amount=$1, processed_by=$2, processed_at=NOW() WHERE id=$3 AND status='pending' RETURNING *", [String(n), ctx.from.id, step.depositId]);
        if (!updated.rows.length) { setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ط·آ·ط¢آ© ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ°ط·آ·ط¢آ§ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ·ط¢آ¨ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ·ط¢آ·ط·آ·ط¢آ© ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آ¢ط·آ·ط¢آ®ط·آ·ط¢آ±."); return; }
        const d = updated.rows[0];
        await adjustBalance(d.user_id, n);
        await clearDepositForOtherAdmins(ctx.from.id, step.depositId, `ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹ ط£آ¢أ¢â€ڑآ¬أ¢â‚¬â€Œ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ© (+${n}$)`);
        setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(`ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¢آ© ${n}$ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ${d.user_id}.`);
        // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ·ط¢آ¶ط·آ·ط¢آ­ط·آ·ط¢آ© ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¨ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸أ¢â‚¬  ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
        try { await ctx.telegram.sendMessage(d.user_id, `ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ¨ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹ط·آ¸ط¦â€™ط·آ·ط¥â€™ ط·آ¸ط«â€ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¢آ© ${n}$ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط¦â€™.`); } catch { /* ignore */ }
        return;
      }
      case "admin:userBalance": {
        const n = Number(txt); if (!Number.isFinite(n) || n <= 0) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ£ط·آ·ط¢آ¯ط·آ·ط¢آ®ط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ·ط¢آµط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹."); return; }
        const delta = step.mode === "add" ? n : -n; await adjustBalance(step.userId, delta); setStep(ctx.from.id, { kind: "idle" });
        const u = await getUser(step.userId); await ctx.reply(`ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ. ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ¯: ${u ? Number(u.balance).toFixed(2) : "?"}$`);
        try { await ctx.telegram.sendMessage(step.userId, step.mode === "add" ? `ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ° ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¢آ© ${n}$ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط¦â€™.` : `ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ¸ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ®ط·آ·ط¢آµط·آ¸أ¢â‚¬آ¦ ${n}$ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬  ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط¦â€™.`); } catch { /* ignore */ }
        return;
      }
      case "admin:findUser": { const found = await searchUser(txt); setStep(ctx.from.id, { kind: "idle" }); if (!found.length) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸ط¸آ¹ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ·ط¢آ¯ ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ·ط¢آ¬."); return; } const kb = found.map(u => [Markup.button.callback(`${u.first_name ?? "ط£آ¢أ¢â€ڑآ¬أ¢â‚¬â€Œ"}${u.username ? " @" + u.username : ""} ط£آ¢أ¢â€ڑآ¬ط¢آ¢ ${Number(u.balance).toFixed(2)}$`, `adm:user:${u.id}`)]); kb.push([Markup.button.callback("ط£آ¢ط¢آ¬أ¢â‚¬آ¦ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¹", "admin:menu")]); await ctx.reply(`ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ·ط¢آ¬ (${found.length}):`, Markup.inlineKeyboard(kb)); return; }
      case "admin:editPrice": {
        if (txt.toLowerCase() === "reset") {
          await q("INSERT INTO product_overrides(product_id,product_name) VALUES($1,$2) ON CONFLICT(product_id) DO UPDATE SET custom_markup_percent=NULL, custom_price_usd=NULL, updated_at=NOW()", [step.productId, step.productName]);
          invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ ط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¹آ¾ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ¶ط·آ¸ط¸آ¹."); return;
        }
        const m = txt.match(/^([%$])\s*(-?\d+(\.\d+)?)$/);
        if (!m) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط·â€؛ط·آ·ط¢آ© ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آµط·آ·ط¢آ­ط·آ¸ط¸آ¹ط·آ·ط¢آ­ط·آ·ط¢آ©. ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ«ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چ: `%5` ط·آ·ط¢آ£ط·آ¸ط«â€  `$2.5`."); return; }
        const v = Number(m[2]);
        if (m[1] === "%") await q("INSERT INTO product_overrides(product_id,product_name,custom_markup_percent) VALUES($1,$2,$3) ON CONFLICT(product_id) DO UPDATE SET custom_markup_percent=$3, custom_price_usd=NULL, updated_at=NOW()", [step.productId, step.productName, String(v)]);
        else await q("INSERT INTO product_overrides(product_id,product_name,custom_price_usd) VALUES($1,$2,$3) ON CONFLICT(product_id) DO UPDATE SET custom_price_usd=$3, custom_markup_percent=NULL, updated_at=NOW()", [step.productId, step.productName, String(v)]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ­ط·آ¸ط¸آ¾ط·آ·ط¢آ¸ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ¹ط·آ·ط¢آ±.`); return;
      }
      case "admin:editProductInstructions": {
        const value = txt.toLowerCase() === "clear" ? null : txt;
        await q("INSERT INTO product_overrides(product_id,product_name,instructions) VALUES($1,$2,$3) ON CONFLICT(product_id) DO UPDATE SET instructions=$3, updated_at=NOW()", [step.productId, step.productName, value]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(value ? "ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ­ط·آ¸ط¸آ¾ط·آ·ط¢آ¸ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ط·آ·ط¹آ¾." : "ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¢آ­ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ط·آ·ط¹آ¾."); return;
      }
      case "admin:renameProduct": {
        const value = txt.toLowerCase() === "reset" ? null : txt;
        await q("INSERT INTO product_overrides(product_id,product_name,custom_name) VALUES($1,$2,$3) ON CONFLICT(product_id) DO UPDATE SET custom_name=$3, updated_at=NOW()", [step.productId, step.productName, value]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(value ? `ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° "${value}".` : "ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ ط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¹آ¾ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ¶ط·آ¸ط¸آ¹."); return;
      }
      case "admin:moveProduct": {
        if (txt.toLowerCase() === "reset") {
          await q("INSERT INTO product_overrides(product_id,product_name) VALUES($1,$2) ON CONFLICT(product_id) DO UPDATE SET custom_category_id=NULL, updated_at=NOW()", [step.productId, step.productName]);
          invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ ط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬طŒ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ·ط¢آµط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹."); return;
        }
        const catId = Number(txt); if (!Number.isFinite(catId)) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آµط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­."); return; }
        await q("INSERT INTO product_overrides(product_id,product_name,custom_category_id) VALUES($1,$2,$3) ON CONFLICT(product_id) DO UPDATE SET custom_category_id=$3, updated_at=NOW()", [step.productId, step.productName, catId]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ${catId}.`); return;
      }
      case "admin:editCategoryName": {
        const value = txt.toLowerCase() === "reset" ? null : txt;
        await q("INSERT INTO category_overrides(category_id,custom_name) VALUES($1,$2) ON CONFLICT(category_id) DO UPDATE SET custom_name=$2, updated_at=NOW()", [step.categoryId, value]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(value ? `ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦.` : "ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ ط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦."); return;
      }
      case "admin:setCatMarkup": {
        if (txt.toLowerCase() === "reset") {
          await q("INSERT INTO category_overrides(category_id) VALUES($1) ON CONFLICT(category_id) DO UPDATE SET custom_markup_percent=NULL, updated_at=NOW()", [step.categoryId]);
          invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ ط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ¸أ¢â‚¬ ط·آ·ط¢آ³ط·آ·ط¢آ¨ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¹آ¾ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ¶ط·آ¸ط¸آ¹."); return;
        }
        const n = Number(txt); if (!Number.isFinite(n) || n < 0) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ¸أ¢â‚¬ ط·آ·ط¢آ³ط·آ·ط¢آ¨ط·آ·ط¢آ© ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آµط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ©."); return; }
        await q("INSERT INTO category_overrides(category_id,custom_markup_percent) VALUES($1,$2) ON CONFLICT(category_id) DO UPDATE SET custom_markup_percent=$2, updated_at=NOW()", [step.categoryId, String(n)]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ³ط·آ·ط¢آ¨ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦: ${n}%.`); return;
      }
      case "admin:setCatSort": {
        if (txt.toLowerCase() === "reset") {
          await q("INSERT INTO category_overrides(category_id) VALUES($1) ON CONFLICT(category_id) DO UPDATE SET sort_order=NULL, updated_at=NOW()", [step.categoryId]);
          invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ ط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ±ط·آ·ط¹آ¾ط·آ¸ط¸آ¹ط·آ·ط¢آ¨."); return;
        }
        const n = Number(txt); if (!Number.isFinite(n)) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آµط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­."); return; }
        await q("INSERT INTO category_overrides(category_id,sort_order) VALUES($1,$2) ON CONFLICT(category_id) DO UPDATE SET sort_order=$2, updated_at=NOW()", [step.categoryId, n]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ±ط·آ·ط¹آ¾ط·آ¸ط¸آ¹ط·آ·ط¢آ¨: ${n}.`); return;
      }
      case "admin:moveCatAll": {
        if (txt.toLowerCase() === "cancel") { setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’."); return; }
        const targetCatId = Number(txt); if (!Number.isFinite(targetCatId)) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آµط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­."); return; }
        const all = await getCachedProducts();
        const toMove = all.filter(p => p.parent_id === step.sourceCategoryId);
        let moved = 0;
        for (const p of toMove) {
          await q("INSERT INTO product_overrides(product_id,product_name,custom_category_id) VALUES($1,$2,$3) ON CONFLICT(product_id) DO UPDATE SET custom_category_id=$3, updated_at=NOW()", [p.id, p.name, targetCatId]);
          moved++;
        }
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬â€چ ${moved} ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ${targetCatId}.`); return;
      }
      case "admin:moveCatToParent": {
        if (txt.toLowerCase() === "cancel") { setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ·ط·إ’."); return; }
        const targetParent = Number(txt);
        if (!Number.isFinite(targetParent)) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آµط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­. ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ 0 ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ط·آ·ط¢آ°ط·آ·ط¢آ± ط·آ·ط¢آ£ط·آ¸ط«â€  ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦."); return; }
        const parentVal = targetParent === 0 ? null : targetParent;
        await q("INSERT INTO category_overrides(category_id,custom_parent_id) VALUES($1,$2) ON CONFLICT(category_id) DO UPDATE SET custom_parent_id=$2, updated_at=NOW()", [step.categoryId, parentVal]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(parentVal ? `ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ®ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ${parentVal}.` : `ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ¸ط«â€ ط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹.`); return;
      }
      case "admin:userMessage": {
        if (!txt) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط·â€؛ط·آ·ط¢آ©."); return; }
        try {
          await ctx.telegram.sendMessage(step.userId, `ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ© ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ©:\n\n${txt}`);
          await q("INSERT INTO admin_messages(admin_id,user_id,message) VALUES($1,$2,$3)", [ctx.from.id, step.userId, txt]);
          setStep(ctx.from.id, { kind: "idle" });
          await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¨ط·آ·ط¢آ´ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ®ط·آ·ط¢آ§ط·آ·ط¢آµ.");
        } catch {
          setStep(ctx.from.id, { kind: "idle" });
          await ctx.reply("ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ·ط¢آ°ط·آ·ط¢آ± ط·آ·ط¢آ¥ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ©. ط·آ·ط¢آ±ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ­ط·آ·ط¢آ¸ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط«â€ ط·آ·ط¹آ¾.");
        }
        return;
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
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â€ڑآ¬ ${sent} ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦.`); return;
      }
      case "admin:addMethod:name": { setStep(ctx.from.id, { kind: "admin:addMethod:id", name: txt }); await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬ع© ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ط·آ·ط¢آ±ط·آ¸ط¸آ¾/ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦:"); return; }
      case "admin:addMethod:id": { setStep(ctx.from.id, { kind: "admin:addMethod:instr", name: step.name, identifier: txt }); await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬آ¹ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ط·آ·ط¹آ¾:"); return; }
      case "admin:addMethod:instr": {
        setStep(ctx.from.id, { kind: "admin:addMethod:photo", name: step.name, identifier: step.identifier, instructions: txt });
        await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬â€œط¢آ¼ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آµط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ·ط¢آ© ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ·ط¢آ±ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹ ط·آ·ط¢آ£ط·آ¸ط«â€  ط·آ·ط¢آ§ط·آ¸ط¦â€™ط·آ·ط¹آ¾ط·آ·ط¢آ¨ *skip* ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ·ط·آ¸أ¢â‚¬ع©ط·آ¸ط¸آ¹:", { parse_mode: "Markdown" }); return;
      }
      case "admin:addMethod:photo": {
        if (txt.toLowerCase() === "skip") {
          await q("INSERT INTO deposit_methods(name,identifier,instructions) VALUES($1,$2,$3)", [step.name, step.identifier, step.instructions]);
          setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¢آ© ط·آ·ط¢آ·ط·آ·ط¢آ±ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹ ط·آ·ط¢آ¨ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸أ¢â‚¬  ط·آ·ط¢آµط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ·ط¢آ©."); return;
        }
        await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آµط·آ¸ط«â€ ط·آ·ط¢آ±ط·آ·ط¢آ© ط·آ·ط¢آ£ط·آ¸ط«â€  ط·آ·ط¢آ§ط·آ¸ط¦â€™ط·آ·ط¹آ¾ط·آ·ط¢آ¨ *skip* ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ·ط·آ¸أ¢â‚¬ع©ط·آ¸ط¸آ¹.", { parse_mode: "Markdown" }); return;
      }
      case "admin:addApi:name": {
        if (!txt.trim()) { await ctx.reply("أ¢â€Œإ’ ط·آ§ط·آ³ط¸â€¦ ط·آ§ط¸â€‍ط¸â‚¬API ط¸â€‍ط·آ§ ط¸ظ¹ط¸â€¦ط¸ئ’ط¸â€  ط·آ£ط¸â€  ط¸ظ¹ط¸ئ’ط¸ث†ط¸â€  ط¸ظ¾ط·آ§ط·آ±ط·ط›ط·آ§ط¸â€¹."); return; }
        setStep(ctx.from.id, { kind: "admin:addApi:base", name: txt.trim() });
        await ctx.reply(
          "ظ‹ع؛â€‌إ’ ط·آ£ط·آ±ط·آ³ط¸â€‍ ط·آ±ط·آ§ط·آ¨ط·آ· ط·آ§ط¸â€‍ط¸â‚¬API ط·آ§ط¸â€‍ط·آ¬ط·آ¯ط¸ظ¹ط·آ¯.\nط¸â€¦ط·آ«ط·آ§ط¸â€‍ ط·ع¾ط·آ¬ط·آ±ط¸ظ¹ط·آ¨ط¸ظ¹: https://api.example.com",
          Markup.inlineKeyboard([[Markup.button.callback("أ¢â€Œإ’ ط·آ¥ط¸â€‍ط·ط›ط·آ§ط·طŒ", "adm:apis")]])
        );
        return;
      }
      case "admin:addApi:base": {
        const baseUrl = normalizeApiBase(txt);
        if (!/^https?:\/\/\S+$/i.test(baseUrl)) {
          await ctx.reply("أ¢â€Œإ’ ط·آ£ط·آ±ط·آ³ط¸â€‍ ط·آ±ط·آ§ط·آ¨ط·آ· API ط·آµط·آ­ط¸ظ¹ط·آ­ط·آ§ط¸â€¹ ط¸ظ¹ط·آ¨ط·آ¯ط·آ£ ط·آ¨ط¸â‚¬ https:// ط·آ£ط¸ث† http://.");
          return;
        }
        setStep(ctx.from.id, { kind: "admin:addApi:token", name: step.name, baseUrl });
        await ctx.reply(
          "ظ‹ع؛â€‌â€ک ط·آ£ط·آ±ط·آ³ط¸â€‍ API token ط¸ظ¾ط¸â€ڑط·آ·.\nط·آ³ط¸ظ¹ط·ع¾ط¸â€¦ ط·آ¬ط¸â€‍ط·آ¨ ط·آ§ط¸â€‍ط¸â€¦ط¸â€ ط·ع¾ط·آ¬ط·آ§ط·ع¾ ط¸â€¦ط·آ¨ط·آ§ط·آ´ط·آ±ط·آ© ط¸â€¦ط¸â€  ط¸â€،ط·آ°ط·آ§ ط·آ§ط¸â€‍ط·آ±ط·آ§ط·آ¨ط·آ· ط¸ث†ط¸â€¦ط·آ²ط·آ§ط¸â€¦ط¸â€ ط·ع¾ط¸â€،ط·آ§ ط¸â€¦ط·آ¹ ط¸ئ’ط·ع¾ط·آ§ط¸â€‍ط¸ث†ط·آ¬ ط·آ§ط¸â€‍ط¸â‚¬API ط·آ§ط¸â€‍ط·آ£ط·آ³ط·آ§ط·آ³ط¸ظ¹.\nط¸â€‍ط¸â€  ط¸ظ¹ط·آ¸ط¸â€،ط·آ± ط·آ§ط¸â€‍ط¸â‚¬token ط¸â€‍ط¸â€‍ط¸â€¦ط·آ³ط·ع¾ط·آ®ط·آ¯ط¸â€¦ط¸ظ¹ط¸â€  ط¸ث†ط·آ³ط¸ظ¹ط¸عˆط·آ­ط¸ظ¾ط·آ¸ ط¸â€¦ط·آ´ط¸ظ¾ط·آ±ط·آ§ط¸â€¹.",
          Markup.inlineKeyboard([[Markup.button.callback("أ¢â€Œإ’ ط·آ¥ط¸â€‍ط·ط›ط·آ§ط·طŒ", "adm:apis")]])
        );
        return;
      }
      case "admin:addApi:token": {
        if (!txt) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â€ڑآ¬API token ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬  ط·آ·ط¢آ£ط·آ¸أ¢â‚¬  ط·آ¸ط¸آ¹ط·آ¸ط¦â€™ط·آ¸ط«â€ ط·آ¸أ¢â‚¬  ط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹."); return; }
        const draft = {
          id: 0,
          name: step.name,
          base_url: step.baseUrl,
          token_encrypted: encryptApiToken(rawTxt),
          active: true,
          is_primary: false,
        };
        try {
          // ط·آ·ط¢آ§ط·آ·ط¢آ®ط·آ·ط¹آ¾ط·آ·ط¢آ¨ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â€ڑآ¬API ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬ ط·آ·ط¢آ´ط·آ·ط¢آ§ط·آ·ط·إ’ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ¬ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ­ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ° ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸ط¸آ¹ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ° API ط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¯ ط·آ¸ط¸آ¾ط·آ·ط¢آ´ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ¸ط«â€ ط·آ·ط¢آ«ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع‘.
          const products = await fetchProductsFromApi(draft);
          const validProducts = products.filter(raw => raw && (raw.id ?? raw.product_id ?? raw.productId) != null);
          if (!validProducts.length) throw new Error("API returned no products with valid IDs");
          const inserted = await q(
            "INSERT INTO api_sources(name,base_url,token_encrypted,active,is_primary) VALUES($1,$2,$3,true,false) RETURNING id",
            [step.name, draft.base_url, draft.token_encrypted]
          );
          const source = await getApiSource(inserted.rows[0].id);
          let count;
          try {
            count = await syncApiSource(source, validProducts);
          } catch (syncError) {
            await q("DELETE FROM cached_products WHERE source_id=$1", [source.id]).catch(() => {});
            await q("DELETE FROM api_sources WHERE id=$1", [source.id]).catch(() => {});
            throw syncError;
          }
          invalidateCaches();
          setStep(ctx.from.id, { kind: "idle" });
          await ctx.reply(`ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¢آ© ${step.name} ط·آ¸ط«â€ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ²ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¢آ© ${count} ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬.`);
        } catch (err) {
          setStep(ctx.from.id, { kind: "idle" });
          await ctx.reply(`ط£آ¢أ¢â‚¬إ’ط¥â€™ ط·آ¸ط¸آ¾ط·آ·ط¢آ´ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â€ڑآ¬API ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ ط·آ¸ط¸آ¹ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ­ط·آ¸ط¸آ¾ط·آ·ط¢آ¸ط·آ¸أ¢â‚¬طŒ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ£ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬طŒ ط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط·â€؛ ط·آ·ط¢آ£ط·آ¸ط«â€  ط·آ¸ط¸آ¾ط·آ·ط¢آ´ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ¸ط«â€ ط·آ·ط¢آ«ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع‘.\nط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ¨ط·آ·ط¢آ¨: ${String(err?.message ?? err).slice(0, 180)}`);
        }
        await showApiSources(ctx);
        return;
      }
      case "admin:renameApi": {
        if (!(await requireSuperAdmin(ctx))) return;
        const value = txt.trim();
        if (!value) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬  ط·آ·ط¢آ£ط·آ¸أ¢â‚¬  ط·آ¸ط¸آ¹ط·آ¸ط¦â€™ط·آ¸ط«â€ ط·آ¸أ¢â‚¬  ط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط·â€؛ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹."); return; }
        await q("UPDATE api_sources SET name=$1,updated_at=NOW() WHERE id=$2", [value, step.sourceId]);
        invalidateCaches();
        setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ API.");
        await showApiSources(ctx);
        return;
      }
      case "admin:editMethodInstructions": {
        await q("UPDATE deposit_methods SET instructions=$1 WHERE id=$2", [txt, step.methodId]);
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ« ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ط·آ·ط¹آ¾."); return;
      }
      case "admin:addContact:name": { setStep(ctx.from.id, { kind: "admin:addContact:link", name: txt }); await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬â€Œأ¢â‚¬â€‌ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ·ط¢آ· ط·آ·ط¢آ£ط·آ¸ط«â€  @username:"); return; }
      case "admin:addContact:link": {
        await q("INSERT INTO contact_links(name,link) VALUES($1,$2)", [step.name, txt]);
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¢آ© ط·آ¸ط«â€ ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ¸ط«â€ ط·آ·ط¢آ§ط·آ·ط¢آµط·آ¸أ¢â‚¬â€چ."); return;
      }
      case "admin:addVirtualCategory:name": {
        const pos = (await q("SELECT COALESCE(MAX(position),0)+1 AS p FROM virtual_categories WHERE parent_id=$1", [step.parentId ?? 0])).rows[0]?.p ?? 1;
        await q("INSERT INTO virtual_categories(name,parent_id,position) VALUES($1,$2,$3)", [txt, step.parentId ?? 0, pos]);
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ®ط·آ·ط¢آµط·آ·ط¢آµ."); return;
      }
      case "admin:editVCatName": {
        await q("UPDATE virtual_categories SET name=$1, updated_at=NOW() WHERE id=$2", [txt, step.vcId]);
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦."); return;
      }
      case "admin:addManualProduct:name": {
        setStep(ctx.from.id, {
          kind: "admin:addManualProduct:price",
          name: txt,
          manualCategoryId: step.manualCategoryId ?? 0,
        });
        await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آµ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ¹ط·آ·ط¢آ± ط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آ±:");
        return;
      }
      case "admin:addManualProduct:price": {
        const price = Number(txt); if (!Number.isFinite(price) || price < 0) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ³ط·آ·ط¢آ¹ط·آ·ط¢آ± ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آµط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­."); return; }
        if (step.manualCategoryId > 0) {
          await q(
            "INSERT INTO manual_products(name,category_id,category_is_virtual,price_usd) VALUES($1,$2,true,$3)",
            [step.name, step.manualCategoryId, String(price)]
          );
          invalidateCaches();
          setStep(ctx.from.id, { kind: "idle" });
          await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ®ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸ط¸آ¹.");
          return;
        }
        setStep(ctx.from.id, { kind: "admin:addManualProduct:category", name: step.name, price });
        const cats = (await q("SELECT id,name FROM manual_categories ORDER BY id")).rows;
        const catText = cats.length
          ? cats.map(c => `${c.id}: ${c.name}`).join("\n")
          : "ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ·ط¹آ¾ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ·ط¢آ¯ ط·آ·ط¢آ£ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¨ط·آ·ط¢آ¹ط·آ·ط¢آ¯";
        await ctx.reply(`ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع‘ ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸ط¸آ¹ط·آ·ط¥â€™ ط·آ·ط¢آ£ط·آ¸ط«â€  0 ط·آ¸أ¢â‚¬â€چط·آ¸ط«â€ ط·آ·ط¢آ¶ط·آ·ط¢آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ©:\n\n${catText}`);
        return;
      }
      case "admin:addManualProduct:category": {
        const categoryId = Number(txt);
        if (!Number.isInteger(categoryId) || categoryId < 0) {
          await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آµط·آ·ط¢آ­ط·آ¸ط¸آ¹ط·آ·ط¢آ­ ط·آ·ط¢آ£ط·آ¸ط«â€  0 ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ©.");
          return;
        }
        if (categoryId > 0) {
          const cat = (await q("SELECT id FROM manual_categories WHERE id=$1", [categoryId])).rows[0];
          if (!cat) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ°ط·آ·ط¢آ§ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ¬ط·آ¸ط«â€ ط·آ·ط¢آ¯. ط·آ·ط¢آ£ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ©."); return; }
        }
        await q(
          "INSERT INTO manual_products(name,category_id,category_is_virtual,price_usd) VALUES($1,$2,$3,$4)",
          [step.name, categoryId, categoryId > 0, String(step.price)]
        );
        invalidateCaches();
        setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(categoryId > 0 ? "ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ®ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸ط¸آ¹." : "ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ·ط¢آ¶ط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸ط¸آ¹ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ©.");
        return;
      }
      case "admin:addManualCategory:name": {
        const parentId = Number(step.parentId ?? 0);
        const pos = (await q("SELECT COALESCE(MAX(position),0)+1 AS p FROM manual_categories WHERE parent_id=$1", [parentId])).rows[0]?.p ?? 1;
        await q("INSERT INTO manual_categories(name,parent_id,position) VALUES($1,$2,$3)", [txt, parentId, pos]);
        setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬ ط·آ·ط¢آ´ط·آ·ط¢آ§ط·آ·ط·إ’ ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸ط¸آ¹ط·آ·ط¢آ©.");
        await showManualCategory(ctx, parentId, 1, 0);
        return;
      }
      case "admin:editManualCategoryName": {
        await q("UPDATE manual_categories SET name=$1,updated_at=NOW() WHERE id=$2", [txt, step.categoryId]);
        setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط«â€ ط·آ¸ط¸آ¹.");
        return;
      }
      case "admin:manualOrderAccept": {
        const delivery = txt.toLowerCase() === "skip" ? null : txt;
        await q("UPDATE manual_orders SET status='accepted', admin_note=$1, updated_at=NOW() WHERE id=$2", [delivery, step.orderId]);
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ¨ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨.");
        if (step.userId) {
          // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¹ط·آ·ط¢آ±ط·آ·ط¢آ¶ ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
          const msg = delivery ? `ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ط·آ·ط¢آ° ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط¦â€™\nط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ${step.productName}\n\nط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ¦ ${delivery}` : `ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬ ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ط·آ·ط¢آ° ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط¦â€™\nط¸â€¹ط¹ط›أ¢â‚¬ط›أ¢â‚¬â„¢ ${step.productName}`;
          await ctx.telegram.sendMessage(step.userId, msg, Markup.inlineKeyboard([[Markup.button.callback("ط¸â€¹ط¹ط›ط¹ث†  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©", "home")]])).catch(() => {});
        }
        return;
      }
      case "admin:manualOrderMsg": {
        if (step.userId) {
          await ctx.telegram.sendMessage(step.userId, `ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ© ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ©:\n${txt}`).catch(() => {});
          await q("INSERT INTO admin_messages(admin_id,user_id,message) VALUES($1,$2,$3)", [ctx.from.id, step.userId, txt]);
        }
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ©."); return;
      }
      case "admin:setUserMarkup": {
        if (txt.toLowerCase() === "reset") {
          await setUserMarkup(step.userId, null);
          setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¹آ¾ ط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ¸أ¢â‚¬ ط·آ·ط¢آ³ط·آ·ط¢آ¨ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ¸ط¸آ¾ط·آ·ط¹آ¾ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ¶ط·آ¸ط¸آ¹."); return;
        }
        const n = Number(txt); if (!Number.isFinite(n) || n < 0) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ¸أ¢â‚¬ ط·آ·ط¢آ³ط·آ·ط¢آ¨ط·آ·ط¢آ© ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آµط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ©."); return; }
        await setUserMarkup(step.userId, n); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ³ط·آ·ط¢آ¨ط·آ·ط¢آ© ط·آ·ط¢آ±ط·آ·ط¢آ¨ط·آ·ط¢آ­ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦: ${n}%.`); return;
      }
      case "admin:pingTarget": { await setSetting("auto_ping_target_user_id", txt.replace(/\D/g, "")); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ·ط¢آ¹ط·آ¸ط¸آ¹ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬طŒط·آ·ط¢آ¯ط·آ¸ط¸آ¾."); return; }
      case "admin:pingInterval": { const n = Number(txt); if (!Number.isFinite(n) || n < 1) { await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آµط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­."); return; } await setSetting("auto_ping_interval_min", String(n)); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط¢آµط·آ¸أ¢â‚¬â€چ: ${n} ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬ع‘ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ©.`); return; }
      case "admin:editBtnLabel": { await setSetting(step.key, txt); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¹آ¾ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ« ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ²ط·آ·ط¢آ±."); return; }
      case "admin:aiSupport": {
        if (txt === "ط®ط±ظˆط¬" || txt.toLowerCase() === "exit") { clearAiHistory(ctx.from.id); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("ط¸â€¹ط¹ط›أ¢â‚¬ع©أ¢â‚¬آ¹ ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬ ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ§ط·آ·ط·إ’ ط·آ·ط¢آ¬ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ°ط·آ¸ط¦â€™ط·آ·ط¢آ§ط·آ·ط·إ’ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آµط·آ·ط¢آ·ط·آ¸أ¢â‚¬ ط·آ·ط¢آ§ط·آ·ط¢آ¹ط·آ¸ط¸آ¹."); return; }
        const reply = await callAiSupport(ctx.from.id, txt);
        await ctx.reply(reply, { parse_mode: "Markdown" }); return;
      }
      default: return next();
    }
  });

  bot.catch(async (err, ctx) => {
    console.error("Telegraf error:", err?.message ?? err);
    try {
      if (ctx?.callbackQuery) await ctx.answerCbQuery("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ·ط¢آ« ط·آ·ط¢آ®ط·آ·ط¢آ·ط·آ·ط¢آ£ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¤ط·آ¸أ¢â‚¬ع‘ط·آ·ط¹آ¾ط·آ·ط¥â€™ ط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ·ط¢آ© ط·آ·ط¢آ£ط·آ·ط¢آ®ط·آ·ط¢آ±ط·آ¸أ¢â‚¬آ°.").catch(() => {});
      else if (ctx?.chat) await ctx.reply("ط£آ¢ط¹â€ک ط£آ¯ط¢آ¸ط¹ث† ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ·ط¢آ« ط·آ·ط¢آ®ط·آ·ط¢آ·ط·آ·ط¢آ£ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¤ط·آ¸أ¢â‚¬ع‘ط·آ·ط¹آ¾. ط·آ·ط¢آ­ط·آ·ط¢آ§ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ·ط¢آ© ط·آ·ط¢آ£ط·آ·ط¢آ®ط·آ·ط¢آ±ط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ¨ط·آ·ط¢آ¹ط·آ·ط¢آ¯ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ·ط¢آ¸ط·آ·ط¢آ§ط·آ·ط¹آ¾.").catch(() => {});
    } catch { /* ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ³ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ­ ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ®ط·آ·ط¢آ·ط·آ·ط¢آ£ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ´ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ± ط·آ·ط¢آ¨ط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ¸ط¸آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¬ */ }
  });

  void bot.telegram.setMyCommands([
    { command: "start", description: "ط¸â€¹ط¹ط›ط¹â€کأ¢â€ڑآ¬ ط·آ·ط¢آ¨ط·آ·ط¢آ¯ط·آ·ط·إ’" },
    { command: "menu", description: "ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ©" },
    { command: "balance", description: "ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ° ط·آ·ط¢آ±ط·آ·ط¢آµط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ¸ط¸آ¹" },
    { command: "deposit", description: "ط¸â€¹ط¹ط›أ¢â‚¬â„¢ط¢آ³ ط·آ·ط¢آ¥ط·آ¸ط¸آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¹" },
    { command: "orders", description: "ط¸â€¹ط¹ط›أ¢â‚¬إ“ط¢آ¦ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¹آ¾ط·آ¸ط¸آ¹" },
    { command: "support", description: "ط¸â€¹ط¹ط›أ¢â‚¬إ“أ¢â‚¬ع† ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¯ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬آ¦" },
  ]).catch(err => console.error("setMyCommands failed:", err?.message ?? err));

  // ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ ط·آ·ط¹آ¾ط·آ·ط¢آ³ط·آ·ط¢آ®ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬  ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¦â€™ط·آ·ط¢آ§ط·آ·ط¢آ´ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ¸ط¦â€™ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ³ط·آ·ط¢آ±ط·آ¸ط¸آ¹ط·آ·ط¢آ¹ ط·آ·ط¢آ£ط·آ¸ط«â€ ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ·ط¢آ© ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
  getCachedProducts().catch(() => {}); getAllOverridesCached().catch(() => {}); getCachedContent(0).catch(() => {});
  startBackgroundRefresher();
  void syncAllApiSources().catch(err => console.error("Initial product sync failed:", err?.message ?? err));

  let telegramShutdownRequested = false;
  const shouldStopTelegram = () => telegramShutdownRequested;

  // ط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¯ polling ط·آ·ط¢آµط·آ·ط¢آ±ط·آ¸ط¸آ¹ط·آ·ط¢آ­: Telegraf ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ timeout=50 ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ ط·آ·ط¢آ·ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ getUpdates.
  // ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ­ط·آ·ط¢آ°ط·آ¸ط¸آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ«ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ© ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¯ ط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¹آ¾ط·آ·ط¢آµط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ­ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ° ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ·ط¹آ¾ط·آ·ط¢آ¶ط·آ¸ط¸آ¹ط·آ·ط¢آ¹ ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ¦ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ·ط¢آ®ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦.
  const pollingConfig = {
    timeout: 50,
    dropPendingUpdates: false,
    allowedUpdates: ["message", "callback_query"],
  };

  const stopTelegram = reason => {
    telegramShutdownRequested = true;
    // ط·آ¸ط¸آ¾ط·آ¸ط¸آ¹ ط·آ¸ط«â€ ط·آ·ط¢آ¶ط·آ·ط¢آ¹ webhook ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬ ط·آ·ط¢آ´ط·آ·ط¢آ¦ Telegraf ط·آ·ط¢آ®ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹ ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ®ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¹.
    if (!bot.polling && !bot.webhookServer) return;
    try {
      bot.stop(reason);
    } catch (err) {
      console.error("Telegram stop warning:", err?.message ?? err);
    }
  };

  const railwayDomain = String(process.env.RAILWAY_PUBLIC_DOMAIN ?? "").replace(/^https?:\/\//i, "").replace(/\/+$/, "");
  const webhookUrl = process.env.WEBHOOK_URL || (railwayDomain ? `https://${railwayDomain}` : "");
  if (webhookUrl) {
    try {
      await bot.telegram.setWebhook(`${webhookUrl.replace(/\/+$/, "")}/bot${token}`);
      console.log("أ¢إ“â€¦ Telegram webhook set successfully");
    } catch (err) {
      // ط·آ·ط¢آ¥ط·آ·ط¢آ°ط·آ·ط¢آ§ ط·آ¸ط¦â€™ط·آ·ط¢آ§ط·آ¸أ¢â‚¬  ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ¨ط·آ·ط¢آ· Railway ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ·ط¢آ± ط·آ·ط¢آµط·آ·ط¢آ­ط·آ¸ط¸آ¹ط·آ·ط¢آ­ ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¹ط·آ¸ط«â€ ط·آ·ط¢آ¯ ط·آ·ط¢آ¥ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° polling ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¹ ط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ·ط¹آ¾ط·آ·ط¢آµط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¹آ¾ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ·ط¢آ©.
      console.error("setWebhook failed, switching to reconnecting polling:", err?.message ?? err);
      await bot.telegram.deleteWebhook().catch(() => {});
      void runPollingWithReconnect(bot, pollingConfig, shouldStopTelegram);
    }
  } else {
    // ط·آ£ط·آ²ط¸â€‍ ط·آ£ط¸ظ¹ Webhook ط¸â€ڑط·آ¯ط¸ظ¹ط¸â€¦ ط¸â€ڑط·آ¨ط¸â€‍ ط·ع¾ط·آ´ط·ط›ط¸ظ¹ط¸â€‍ pollingط·â€؛ ط¸ث†ط·آ¬ط¸ث†ط·آ¯ط¸â€، ط¸ظ¹ط¸â€¦ط¸â€ ط·آ¹ Telegram ط¸â€¦ط¸â€  ط·ع¾ط·آ³ط¸â€‍ط¸ظ¹ط¸â€¦ ط·آ§ط¸â€‍ط·ع¾ط·آ­ط·آ¯ط¸ظ¹ط·آ«ط·آ§ط·ع¾.
    await bot.telegram.deleteWebhook({ drop_pending_updates: false }).catch(err => {
      console.error("deleteWebhook before polling failed:", err?.message ?? err);
    });
    // ط¸â€‍ط·آ§ ط¸â€ ط·ع¾ط·آ±ط¸ئ’ ط·آ±ط¸ظ¾ط·آ¶ bot.launch ط¸ظ¹ط¸â€ ط¸â€،ط¸ظ¹ polling ط¸â€ ط¸â€،ط·آ§ط·آ¦ط¸ظ¹ط·آ§ط¸â€¹ ط·آ¨ط·آ¹ط·آ¯ timeout ط·آ£ط¸ث† ط·آ§ط¸â€ ط¸â€ڑط·آ·ط·آ§ط·آ¹ ط¸â€¦ط·آ¤ط¸â€ڑط·ع¾.
    void runPollingWithReconnect(bot, pollingConfig, shouldStopTelegram);
  }

  startOrderPoller(bot);
  startPingScheduler(bot);

  process.once("SIGINT", () => stopTelegram("SIGINT"));
  process.once("SIGTERM", () => stopTelegram("SIGTERM"));
  process.on("uncaughtException", err => console.error("uncaughtException:", err));
  process.on("unhandledRejection", reason => console.error("unhandledRejection:", reason));

  setInterval(() => {
    const port = Number(process.env.PORT ?? "3000");
    const req = http.get({ hostname: "localhost", port, path: "/health", timeout: 5000 }, () => {});
    req.on("error", () => {}); req.end();
  }, 4 * 60_000).unref();

  console.log("ط£آ¢ط¥â€œأ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط«â€ ط·آ·ط¹آ¾ ط·آ¸ط¸آ¹ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ¨ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¬ط·آ·ط¢آ§ط·آ·ط¢آ­! (v2.3)");
  return bot;
}

// ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Express health server + webhook receiver ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
const app = express();
const PORT = Number(process.env.PORT ?? 3000);
app.use(express.json({ limit: "256kb" }));
app.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = body => {
    res.set("Content-Type", "application/json; charset=utf-8");
    return originalJson(body);
  };
  next();
});
app.get("/", (_, res) => res.send("OK"));
app.get("/health", (_, res) => res.json({ status: "ok", time: new Date().toISOString(), version: "2.3" }));

app.post(/^\/bot.+/, (req, res) => {
  if (_botRef) {
    // ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¯ ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ·ط¢آ´ط·آ·ط¢آ±ط·آ·ط¢آ© ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ° Telegram ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¹ ط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ·ط¢آ¥ط·آ·ط¢آ±ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چ ط·آ¸أ¢â‚¬ ط·آ¸ط¸آ¾ط·آ·ط¢آ³ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ« ط·آ·ط¢آ¹ط·آ¸أ¢â‚¬ ط·آ·ط¢آ¯ ط·آ·ط¢آ¨ط·آ·ط¢آ·ط·آ·ط·إ’ ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬ ط·آ·ط¢آ§ط·آ·ط¹آ¾ ط·آ·ط¢آ£ط·آ¸ط«â€  API
    res.sendStatus(200);
    _botRef.handleUpdate(req.body).catch(err => { console.error("webhook error:", err); });
  } else {
    res.sendStatus(200);
  }
});

// ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ Start ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬ط£آ¢أ¢â‚¬â€Œأ¢â€ڑآ¬
const server = http.createServer(app);
server.requestTimeout = 15_000;
server.headersTimeout = 10_000;
server.on("error", err => console.error("HTTP server error:", err?.message ?? err));
server.listen(PORT, () => console.log(`ط¸â€¹ط¹ط›ط¹â€کأ¢â€ڑآ¬ Server on port ${PORT}`));
startBot().then(bot => { _botRef = bot; }).catch(err => { console.error("Failed to start:", err); process.exit(1); });
