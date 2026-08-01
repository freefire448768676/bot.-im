#!/usr/bin/env node
// ============================================================
//  سكريبت النسخ الاحتياطي — يُشغَّل يدوياً من سطر الأوامر
//  الاستخدام: node scripts/backup.js
//  أو:        pnpm --filter @workspace/marwan-bot run backup
// ============================================================
"use strict";

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL غير محدد في .env");
  process.exit(1);
}

const _dbUrl = process.env.DATABASE_URL;
const _needSSL = _dbUrl.includes("railway") || _dbUrl.includes("neon") ||
  _dbUrl.includes("supabase") || _dbUrl.includes("render") ||
  _dbUrl.includes("replit") || _dbUrl.includes("amazonaws");

const pool = new Pool({
  connectionString: _dbUrl,
  ssl: _needSSL ? { rejectUnauthorized: false } : false,
  max: 3,
  connectionTimeoutMillis: 10_000,
});

const TABLES = [
  "users",
  "bot_settings",
  "deposit_methods",
  "deposit_requests",
  "orders",
  "product_overrides",
  "category_overrides",
  "broadcasts",
  "contact_links",
  "virtual_categories",
  "manual_products",
  "manual_orders",
];

async function main() {
  console.log("📦 بدء تصدير قاعدة البيانات...\n");

  const backup = {
    version: "2.4",
    exported_at: new Date().toISOString(),
    tables: {},
  };

  let totalRows = 0;

  for (const table of TABLES) {
    try {
      const client = await pool.connect();
      const res = await client.query(`SELECT * FROM ${table} ORDER BY 1`);
      client.release();
      backup.tables[table] = res.rows;
      totalRows += res.rows.length;
      console.log(`  ✅ ${table}: ${res.rows.length} سجل`);
    } catch (err) {
      console.warn(`  ⚠️  ${table}: ${err?.message}`);
      backup.tables[table] = [];
    }
  }

  // حفظ الملف
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const filename = `backup_${timestamp}.json`;
  const outputDir = path.join(__dirname, "../backups");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, filename);

  fs.writeFileSync(outputPath, JSON.stringify(backup, null, 2), "utf8");

  console.log(`\n✅ تم التصدير بنجاح!`);
  console.log(`📄 الملف: ${outputPath}`);
  console.log(`📊 إجمالي السجلات: ${totalRows}`);

  await pool.end();
}

main().catch(err => {
  console.error("❌ فشل التصدير:", err?.message);
  process.exit(1);
});

