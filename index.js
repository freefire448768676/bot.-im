// ============================================================
// ظ…طھط¬ط± ط§ظ„ظ…ط±ظˆ ط§ظ† â€” ط¨ظˆ طھ طھظٹظ„ظٹط¬ط±ط§ظ… v2.3 (ط¥ط¬ظ‹ط§ط ط´ط§ظ…ظ„)
// ط¥طμظ‹ط§ط§طھ: ط§ظ‹ط £ط¯ط§ط،طŒ طھط¯ظپظ‚ ط§ظ‹ط¥ظٹط¯ط§ط¹طŒ ط¥ط²ط§ظ‹ط© ط £ط±ظ‚ط§ظ… ط§ظ‹ط·ظ‹ط¨ط§طھ
// ============================================================
"استخدام صارم"؛

const { Telegraf, Markup } = require("telegraf");
const { Pool } = require("pg");
const axios = require("axios");
const express = require("express");
const http = require("http");
const https = require("https");
const crypto = require("crypto");
const { TextDecoder } = require("util");

// أ ™ ™ ™ â ¬ A . ™أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ ™أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ ™أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ ™أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ ™أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ ™أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ ™أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ ™أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ ™أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ ™أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ ™أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ ™أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ ™أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ ™أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ ™أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ ™أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ
إذا لم يكن عنوان URL لقاعدة البيانات موجودًا في متغير البيئة (process.env.DATABASE_URL)،
  console.error("• عنوان URL لقاعدة البيانات مطلوب");
  process.exit(1);
}

// أ ™أ ™â€ڑآ¬أ ‚¬إ'أ ™أ ™ ¬ع'آ¬أ ™أ ™ â€ڑآ¬أ ™ ‚¬إ'أ ™ â€¬ع'آ¬ تجمع قاعدة البيانات ظ…طط³ظ'ظ† ™أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ ¬ع'آ¬أ¢أ¢a‚¬آ¬أ‚¬إ'أ¢a‚¬ع'آ¬أ¢أ¢a‚¬آ¬أ‚¬إ'أ¢a‚¬ع'آ¬أما ™أ€ڑآ¬أ¬إ' 'أ''أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ ‚¬إ ™ أ ‚¬ع'آ ¬أ ™ â ™ â ¬إ ™ â ™ ع'آ ¬أ ™ â€ڑآ¬أ ™ â ™ €أ'أ'أ'أ'آ¬أƒأ¢a‚¬آ¬أ‚آ¬أ¬ع'آ¬أ‌أ¢a‚¬إم¬أ'آ¬أ ™أ'أ'أ'أ'أ'أ'أ'أ'أ'أ ع'آ¬أ¢أ¢a‚¬آ¬أ‚آ‚¬أ¬أ¬ع'آ¬أ¬إ'أ¢أ‚¬ع'آ¬أ¢أ¢a‚¬آ¬أ¬إ'أ ‚¬ع'آ¬أ¢أأ¢a‚¬آ¬أ¢a‚¬أ¬أ¬ع'آ¬أ‌أ¢a€ڑآ¬أ‚¬إ'أ¢أ¢a‚¬ع'آ¬أأ¢a‚¬آ¬أ ™ ¬أ ™ ™ ع ™ آ ¬ أ واحدة ڑآ¬أ‚¬إ’أ¢أ‚¬ع'آ¬أ¢أ¢a‚¬آ¬أ‚¬إ'أ¢a‚¬ع'آ¬أ™أ¢a‚¬آ¬أ‚¬إ'أ¢a‚¬ع'آ¬أ¢أ ™ ™ ẫ 'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ ‹‹‹‹‹ ¬إ ™ ™ â ¬ â ™ â â ¬ â ¬ â ™ â â ¬ع'آ¬أ ™ ™ â ¬إ ™ ™ â ¬ع'آ ¬أ ™ أ ™ ¬ ¬أ'أ'أ'''أ''أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ â€ڑآ¬أ‚¬إ’أ¢a‚¬ع'آ¬أƒأ¢a‚¬آ¬أ¬إ'أ¢a‚¬ع'آ¬أ¢a¢a€ڑآ¬أ¬إ'أƑآ¬ع'آ¬
const _dbUrl = process.env.DATABASE_URL;
const _needSSL = _dbUrl.includes("railway") || _dbUrl.includes("neon") || _dbUrl.includes("supabase");
const pool = new Pool({
  سلسلة الاتصال: _dbUrl،
  ssl: _needSSL ? { rejectUnauthorized: false } : false,
  الحد الأقصى: 10
  الحد الأدنى: 2
  idleTimeoutMillis: 30_000,
  مهلة الاتصال بالمللي ثانية: 5000
  مهلة الاستعلام: 8000،
  statement_timeout: 8_000,
  // ط¥ط¬ط¨ط§ط± PostgreSQL ط¹ظ„ظ‰ ط§ط³طھط®ط¯ط§ظ… UTF-8 ظپظٹ ظƒظ„ ط§طھطط§ظ„
  الخيارات: "-c client_encoding=UTF8",
});
pool.on("error", err => console.error("خطأ في تجمع PostgreSQL:", err?.message ?? err));

async function q(text, params = []) {
  const client = await pool.connect();
  حاول { أعد await client.query(text, params); }
  وأخيرًا { client.release(); }
}

// ™أ™â€ڑآ¬أ¢â€¬إ'أ¢أ¢a‚¬ع'آ¬أ¢أˈâ€ڑآ¬أ¢â€¬إ'أ¢أ¢â€¬ع'آ¬ قم بإنشاء الجداول إذا لم تكن موجودة ‹‹‹‹‹‹‹‹ ‹‹‹ ‹‹‹‹‹‹‹‹ ‹‹‹ ‹‹‹‹‹‹‹‹ ‹‹‹ ‹‹‹‹‹‹‹‹ ‹‹‹ ‹‹‹‹‹‹‹‹ ‹‹‹ ‹‹‹‹‹‹‹‹ ‹‹‹ ‹‹‹‹‹‹‹‹ ‹‹‹ ‹‹‹‹‹‹‹‹ ‹‹‹ ‹‹‹‹‹‹‹‹ ‹‹‹ ‹‹‹‹‹‹‹‹ ‹‹‹ ‹‹‹‹‹‹‹‹ ‹‹‹ ‹‹‹‹‹‹‹‹ ‹‹‹ ‹‹‹‹‹‹‹‹ ‹‹‹ ‹‹‹‹‹‹‹‹ ‹‹‹ ‹‹‹‹‹‹‹‹ ‹‹‹ ‹‹‹‹‹‹‹‹ ‹‹‹
async function ensureTables() {
  انتظر q(`
    إنشاء جدول المستخدمين إذا لم يكن موجودًا (
      مفتاح أساسي كبير من نوع BIGINT،
      اسم المستخدم نص،
      الاسم الأول (نص)،
      اسم العائلة (نص)،
      balance NUMERIC(14,4) NOT NULL DEFAULT 0,
      الحالة نص غير فارغ، القيمة الافتراضية هي 'نشط'،
      is_admin BOOLEAN NOT NULL DEFAULT false,
      is_super_admin BOOLEAN NOT NULL DEFAULT false,
      admin_authed_at TIMESTAMPTZ,
      custom_markup_percent NUMERIC(6,2),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    إنشاء جدول bot_settings إذا لم يكن موجودًا (
      مفتاح النص الأساسي،
      قيمة النص غير فارغة،
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    إنشاء جدول إذا لم يكن موجودًا deposit_methods (
      مفتاح id التسلسلي الأساسي،
      الاسم نص غير فارغ،
      المعرف TEXT NOT NULL،
      التعليمات: النص غير فارغ،
      image_file_id TEXT,
      نشط، قيمة منطقية، غير فارغ، القيمة الافتراضية: صحيح.
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    إنشاء جدول إذا لم يكن موجودًا deposit_requests (
      مفتاح id التسلسلي الأساسي،
      user_id BIGINT NOT NULL,
      method_id عدد صحيح غير فارغ،
      method_name TEXT NOT NULL,
      رقم_الدافع نصي،
      screenshot_file_id TEXT NOT NULL,
      المبلغ رقمي (14،4)،
      الحالة نص غير فارغ، القيمة الافتراضية هي 'معلق'،
      تمت معالجته بواسطة BIGINT،
      تمت المعالجة في TIMESTAMPTZ،
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    إنشاء جدول إذا لم يكن موجودًا (
      مفتاح id التسلسلي الأساسي،
      user_id BIGINT NOT NULL,
      product_id عدد صحيح غير فارغ،
      اسم المنتج نص غير فارغ،
      الكمية عددية (14،4) غير فارغة،
      params JSONB NOT NULL DEFAULT '{}',
      price_usd NUMERIC(14,4) NOT NULL,
      oranos_order_id TEXT,
      oranos_uuid TEXT NOT NULL UNIQUE,
      الحالة نص غير فارغ، القيمة الافتراضية هي 'معلق'،
      api_response JSONB,
      تم تسليم_الرمز نصياً،
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    إنشاء جدول إذا لم يكن موجودًا product_overrides (
      product_id INTEGER PRIMARY KEY,
      اسم المنتج (نص)،
      custom_name TEXT,
      custom_category_id عدد صحيح،
      custom_markup_percent NUMERIC(6,2),
      custom_price_usd NUMERIC(14,4),
      قيمة منطقية مخفية غير فارغة، القيمة الافتراضية خطأ.
      تم حذف القيمة المنطقية NOT NULL DEFAULT false،
      نص التعليمات،
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    إنشاء جدول إذا لم يكن موجودًا category_overrides (
      category_id INTEGER PRIMARY KEY,
      custom_name TEXT,
      قيمة منطقية مخفية غير فارغة، القيمة الافتراضية خطأ.
      custom_markup_percent NUMERIC(6,2),
      sort_order عدد صحيح،
      custom_parent_id عدد صحيح،
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    إنشاء جدول إذا لم يكن موجودًا باسم broadcasts (
      مفتاح id التسلسلي الأساسي،
      نص الرسالة غير فارغ،
      sent_by BIGINT NOT NULL,
      sent_count عدد صحيح غير فارغ القيمة الافتراضية 0،
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    إنشاء جدول admin_messages إذا لم يكن موجودًا (
      مفتاح id التسلسلي الأساسي،
      admin_id BIGINT NOT NULL,
      user_id BIGINT NOT NULL,
      نص الرسالة غير فارغ،
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    إنشاء جدول contact_links إذا لم يكن موجودًا (
      مفتاح id التسلسلي الأساسي،
      الاسم نص غير فارغ،
      رابط نص غير فارغ،
      نشط، قيمة منطقية، غير فارغ، القيمة الافتراضية: صحيح.
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    إنشاء جدول virtual_categories إذا لم يكن موجودًا (
      مفتاح id التسلسلي الأساسي،
      الاسم نص غير فارغ،
      parent_id عدد صحيح غير فارغ القيمة الافتراضية 0،
      position INTEGER NOT NULL DEFAULT 0,
      نشط، قيمة منطقية، غير فارغ، القيمة الافتراضية: صحيح.
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    إنشاء جدول manual_categories إذا لم يكن موجودًا (
      مفتاح id التسلسلي الأساسي،
      الاسم نص غير فارغ،
      parent_id عدد صحيح غير فارغ القيمة الافتراضية 0،
      position INTEGER NOT NULL DEFAULT 0,
      نشط، قيمة منطقية، غير فارغ، القيمة الافتراضية: صحيح.
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    إنشاء فهرس إذا لم يكن موجودًا manual_categories_parent_idx على manual_categories(parent_id)؛
    إنشاء جدول manual_products إذا لم يكن موجودًا (
      مفتاح id التسلسلي الأساسي،
      الاسم نص غير فارغ،
      category_id عدد صحيح غير فارغ القيمة الافتراضية 0،
      category_is_virtual BOOLEAN NOT NULL DEFAULT false,
      price_usd NUMERIC(14,4) NOT NULL DEFAULT 0,
      api_product_id عدد صحيح،
      نص التعليمات،
      نشط، قيمة منطقية، غير فارغ، القيمة الافتراضية: صحيح.
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    إنشاء جدول إذا لم يكن موجودًا manual_orders (
      مفتاح id التسلسلي الأساسي،
      user_id BIGINT NOT NULL,
      product_id عدد صحيح غير فارغ،
      اسم المنتج نص غير فارغ،
      price_usd NUMERIC(14,4) NOT NULL,
      ملاحظة نصية،
      الحالة نص غير فارغ، القيمة الافتراضية هي 'معلق'،
      ملاحظة إدارية نصية،
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    إنشاء جدول api_sources إذا لم يكن موجودًا (
      مفتاح id التسلسلي الأساسي،
      الاسم نص غير فارغ،
      base_url نص غير فارغ،
      token_encrypted TEXt,
      نشط، قيمة منطقية، غير فارغ، القيمة الافتراضية: صحيح.
      is_primary BOOLEAN NOT NULL DEFAULT false,
      last_sync_at TIMESTAMPTZ,
      last_sync_error TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    إنشاء جدول cached_categories إذا لم يكن موجودًا (
      مفتاح أساسي كبير من نوع BIGINT،
      source_id عدد صحيح غير فارغ،
      external_id نص غير فارغ،
      الاسم نص غير فارغ،
      parent_id BIGINT NOT NULL DEFAULT 0,
      raw JSONB NOT NULL DEFAULT '{}',
      نشط، قيمة منطقية، غير فارغ، القيمة الافتراضية: صحيح.
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(source_id, external_id)
    );
    إنشاء جدول cached_products إذا لم يكن موجودًا (
      مفتاح أساسي كبير من نوع BIGINT،
      source_id عدد صحيح غير فارغ،
      external_id نص غير فارغ،
      الاسم نص غير فارغ،
      parent_id BIGINT NOT NULL DEFAULT 0,
      اسم_الفئة نص،
      السعر (رقمي (14،6))
      متاح BOOLEAN غير فارغ DEFAULT صحيح،
      qty_values ​​JSONB,
      params JSONB,
      raw JSONB NOT NULL DEFAULT '{}',
      تم حذف القيمة المنطقية NOT NULL DEFAULT false،
      last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(source_id, external_id)
    );
    إنشاء فهرس إذا لم يكن موجودًا cached_products_parent_idx على cached_products(parent_id)؛
    إنشاء فهرس إذا لم يكن موجودًا cached_products_source_idx على cached_products(source_id)؛
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
// إعدادات
// ============================================================
const settingsCache = new Map();
let _settingsCacheExpiry = 0;
let _settingsInFlight = null;
const SETTINGS_TTL = 2 * 60_000؛ // 2 ط¯ظ‚ظٹظ‚ط©

const DEFAULTS = {
  نسبة الزيادة في السعر: "3"،
  سعر الصرف: "132"
  bot_status: "on",
  currency_label: "ظ.ط³",
  معرّفات الفئات المستبعدة: "6,81,561"،
  Excluded_product_keywords: "ط³ظٹط±طھظ„ ظƒط§ط´,ط³ظٹط±ظٹطھظ„ ظƒط§ط´,syriatel Cash,mtn ظƒط§ط´,mtn Cash,ط§ظ… طھظٹ ط§ط¸أ¢â‚¬ ظƒط§ط´,
  نسبة الربح الاجتماعي: "3"،
  social_min_qty: "500",
  social_max_qty: "10000",
  social_keywords: "ط³ظˆط´ظ„,اجتماعي,طھظˆط§طظ„ ط§ط¬طھظ…ط§ط¹ظٹ,ط§ط¬طھظ…ط§ط¹ظٹ,ط§ط¸أ¢â‚¬ ط³طھط;ط±ط§ظ…,instagram,طھظٹظƒ طھظˆظƒ,tiktok,ظپظٹط³ط¨ظˆظƒ,facebook,طھظˆظٹطھط±,twitter,ظٹظˆطھظٹظˆط¨,youtube,طھظ„ط;ط±ط§ظ…,telegram,ط³ط¸أ¢â‚¬ ط§ط¨,snap",
  ai_keywords: "ط°ظƒط§ط، ط§طμط·ط¸أ¢â‚¬ ط§ط¹ظٹ,chatgpt,gpt,openai,كلود,gemini,midjourney,perplexity,ai ",
  كلمة مرور المسؤول: "0941408061@0941408061aM"،
  admin_login_command: "عبد الملك مرعي 1122334455"،
  auto_ping_enabled: "إيقاف"
  auto_ping_interval_min: "5",
  auto_ping_target_user_id: "",
  auto_ping_last_sent: "0",
  btn_back_label: "â¬…ï¸ڈ ط±ط¬ظˆط¹",
  btn_home_label: ""ںڈ ط§ظ"ط±ط¦ظٹط³ظٹط©",
  btn_prev_label: "â¬…ï¸ڈ ط§ظ„ط³ط§ط¨ظ‚,
  btn_next_label: "ط§ظ„طھط§ظ„ظٹ ‍،ï¸ڈ",
};

// القيم الافتراضية القياسية لترميز UTF-8. هذه القيم تتجاوز القيم الحرفية القديمة المُعدّلة أعلاه.
// قبل إدخال القيم الافتراضية في قاعدة البيانات أو إصلاحها فيها.
Object.assign(DEFAULTS, {
  currency_label: "ظ.ط³",
  Excluded_product_keywords: "ط³ظٹط±ظٹطھظ„ ظƒط§ط´,ط³ظٹط±ظٹطھظ„ ظƒط§ط´,syriatel Cash,mtn ظƒط§ط´,mtn Cash,ط§ظ… طھظٹ ط§ظ† ظƒط§ط´,
  social_keywords: "ط³ظˆط´ط§ظ„,اجتماعي,طھظˆط§طظ„ ط§ط¹ظٹ,ط§ط¬طھظ…ط§ط¹ظٹ,ط§ظ†ط³طھط;ط±ط§ظ…,instagram,طھظٹظƒ طھظˆظƒ,tiktok,ظپظٹط³ط¨ظˆظƒ,facebook,طھظˆظٹطھط±,twitter,ظٹظˆطھظٹظˆط¨,youtube,طھظ„ط;ط±ط§ظ…,telegram,ط³ظ†ط§ط¨,snap",
  ai_keywords: "ط°ظƒط§ط، ط§طμط·ظ†ط§ط¹ظٹ,chatgpt,gpt,openai,كلود,الجوزاء,رحلة منتصف الليل,الحيرة,ai ",
  btn_back_label: "â¬…ï¸ڈ ط±ط¬ظˆط¹",
  btn_home_label: ""ںڈ ط§ظ"ط±ط¦ظٹط³ظٹط©",
  btn_prev_label: "â¬…ï¸ڈ ط§ظ„ط³ط§ط¨ظ‚,
  btn_next_label: "ط§ظ„طھط§ظ„ظٹ ‍،ï¸ڈ",
});

async function loadAllSettings() {
  إذا كانت (_settingsInFlight) تُرجع _settingsInFlight؛
  _settingsInFlight = (async () => {
  const res = await q("SELECT key, value FROM bot_settings");
  settingsCache.clear();
  for (const r of res.rows) settingsCache.set(r.key, r.value);
  })().finally(() => { _settingsInFlight = null; });
  return _settingsInFlight;
}

async function ensureDefaults() {
  انتظر تحميل جميع الإعدادات();
  for (const [k, v] of Object.entries(DEFAULTS)) {
    إذا لم يكن (!settingsCache.has(k)) {
      await q("INSERT INTO bot_settings(key,value) VALUES($1,$2) ON CONFLICT DO NOTHING", [k, v]);
      settingsCache.set(k, v);
    }
  }
  // إصلاح إعدادات العرض/الفلتر المعروفة فقط من إصدارات mojibake القديمة.
  // لا تتم إعادة كتابة الأسرار وأوامر تسجيل الدخول والقيم التي يدخلها المستخدم هنا أبدًا.
  const repairableKeys = new Set([
    "currency_label", "excluded_product_keywords", "social_keywords",
    "الكلمات المفتاحية للذكاء الاصطناعي"، "ملصق الزر الخلفي"، "ملصق الزر الرئيسي"، "ملصق الزر السابق"،
    "btn_next_label",
  ]);
  for (const key of repairableKeys) {
    const current = settingsCache.get(key);
    const repaired = repairArabicEncoding(current);
    إذا كان (الحالي != فارغ && تم إصلاحه !== الحالي) {
      await q("UPDATE bot_settings SET value=$1,updated_at=NOW() WHERE key=$2", [repaired, key]);
      settingsCache.set(key, repaired);
    }
  }
}

async function getSetting(key) {
  إذا لم يكن المفتاح موجودًا في ذاكرة التخزين المؤقت للإعدادات أو كان تاريخ اليوم أكبر من تاريخ انتهاء صلاحية ذاكرة التخزين المؤقت للإعدادات،
    انتظر تحميل جميع الإعدادات();
    _settingsCacheExpiry = Date.now() + SETTINGS_TTL;
  }
  return settingsCache.get(key) ?? DEFAULTS[key] ?? "";
}

دالة غير متزامنة setSetting(key, value) {
  settingsCache.set(key, value);
  _settingsCacheExpiry = Date.now() + SETTINGS_TTL; // طھظ…ط¯ظٹط¯ ط§ظ„ظƒط§ط´ ط¨ط¹ط¯ ط £ظٹ طھطط¯ظٹط«
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

دالة isSocialProduct(name, catName, kws) {
  const n = ((name ?? "") + " " + (catName ?? "")).toLowerCase();
  return kws.some(k => k && n.includes(k));
}

// ============================================================
// ذاكرة التخزين المؤقت للمستخدم
// ============================================================
const userCache = new Map();
const USER_CACHE_TTL = 60_000؛ // 60 ط«ط§ظ† ظٹط©
دالة userCacheGet(id) { const hit = userCache.get(id); if (hit && hit.exp > Date.now()) return hit.u; return undefined; }
دالة userCacheSet(id, u) { userCache.set(id, { u, exp: Date.now() + USER_CACHE_TTL }); }
function invalidateUserCache(id) { userCache.delete(id); }

async function upsertUser(u) {
  const res = await q(
    `INSERT INTO users(id,username,first_name,last_name)
     القيم ($1، $2، $3، $4)
     ON CONFLICT(id) DO UPDATE SET
       اسم المستخدم = COALESCE($2,users.username),
       first_name=COALESCE($3,users.first_name),
       last_name=COALESCE($4,users.last_name)
     إرجاع *`,
    [u.id, u.username ?? null, u.first_name ?? null, u.last_name ?? null]
  );
  const row = res.rows[0];
  userCacheSet(u.id, row);
  أعد الصف؛
}

دالة غير متزامنة getUser(id) {
  const cached = userCacheGet(id);
  إذا كان (cached !== undefined) فقم بإرجاع cached؛
  const res = await q("SELECT * FROM users WHERE id=$1", [id]);
  const u = res.rows[0] ?? null;
  userCacheSet(id, u);
  أعد u؛
}

دالة غير متزامنة لضبط الرصيد (id، deltaUsd) {
  invalidateUserCache(id);
  const res = await q("UPDATE users SET balance=balance+$1 WHERE id=$2 RETURNING *", [deltaUsd, id]);
  const u = res.rows[0] ?? null;
  إذا كان (u) userCacheSet(id, u);
  أعد u؛
}

دالة غير متزامنة debitBalance(id, amountUsd) {
  const amount = Number(amountUsd);
  إذا لم يكن الرقم منتهيًا (القيمة) أو كانت القيمة أقل من أو تساوي صفرًا، فسيتم إرجاع قيمة فارغة (null).
  invalidateUserCache(id);
  const res = await q(
    "تحديث المستخدمين SET balance=balance-$1 WHERE id=$2 AND balance >= $1 RETURNING *",
    [المبلغ، المعرف]
  );
  const u = res.rows[0] ?? null;
  إذا كان (u) userCacheSet(id, u);
  أعد u؛
}

async function setStatus(id, status) {
  invalidateUserCache(id);
  await q("UPDATE users SET status=$1 WHERE id=$2", [status, id]);
}

وظيفة غير متزامنة setAdmin(id, isAdmin, isSuperAdmin) {
  invalidateUserCache(id);
  إذا (isSuperAdmin !== غير محدد) {
    await q("UPDATE users SET is_admin=$1, is_super_admin=$2 WHERE id=$3", [isAdmin, isSuperAdmin, id]);
  } آخر {
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

دالة غير متزامنة listUsers(offset = 0, limit = 20) {
  const res = await q("SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2", [limit, offset]);
  أعد عدد الصفوف في res.
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
  أعد عدد الصفوف في res.
}

async function listAdmins() {
  const res = await q("SELECT * FROM users WHERE is_admin=true");
  أعد عدد الصفوف في res.
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
// أدوات المساعدة في التنسيق
// ============================================================
async function loadOverrideMap(productIds) {
  const map = new Map();
  إذا لم يكن عدد معرّفات المنتجات يساوي صفرًا، فسيتم إرجاع الخريطة.
  const res = await q(`SELECT * FROM product_overrides WHERE product_id = ANY($1)`, [productIds]);
  for (const r of res.rows) {
    map.set(r.product_id, {
      customPriceUsd: r.custom_price_usd != null ? Number(r.custom_price_usd) : null,
      customMarkupPercent: r.custom_markup_percent != null ? Number(r.custom_markup_percent) : null,
      customName: r.custom_name,
      customCategoryId: r.custom_category_id,
      مخفي: r.hidden،
      تم الحذف: r.deleted،
      التعليمات: r.instructions،
    });
  }
  أعد الخريطة؛
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
      مخفي: r.hidden،
      تم الحذف: r.deleted،
      التعليمات: r.instructions،
    });
  }
  أعد الخريطة؛
}

دالة تنسيق الرصيد (دولار أمريكي، سعر الصرف) {
  return `${usd.toFixed(2)}$ | ${Math.round(usd * rate).toLocaleString("en-US")} ظ„.ط³`;
}

// أ ™أ ™â€ڑآ¬أ ™ ‚¬إ'أ ™أ ™ ‚¬ع'آ¬أ ™أ ™أ ™ ‚¬إ'أ ™ â‚¬ع'آ¬ ط¥ط ميكروظ„ط§ط ط§ظ„ظ† طμ ط§ظ„ط¹ط±ط¨ظٹ ط§ظط°ظٹ“ ظٹطμظ‹ ط £طظٹط§ظ† ط§ظ‹ ط¨طھط±ظ…ظٹط² Windows/UTF-8 ط®ط§ط·ط¦ ‹‹‹‹‹‹‹‹ ‹‹‹
let cp1256Reverse = null;
let windows1252Reverse = null;
يحاول {
  cp1256Reverse = new Map();
  const decoder = new TextDecoder("windows-1256");
  for (let byte = 0; byte <= 255; byte++) {
    const decoded = decoder.decode(Uint8Array.of(byte));
    إذا كان طول (decoded.length === 1) cp1256Reverse.set(decoded, byte);
  }
  windows1252Reverse = new Map();
  const latinDecoder = new TextDecoder("windows-1252");
  for (let byte = 0; byte <= 255; byte++) {
    const decoded = latinDecoder.decode(Uint8Array.of(byte));
    إذا كان طول (decoded.length === 1) windows1252Reverse.set(decoded, byte);
  }
} يمسك {
  cp1256Reverse = null;
  windows1252Reverse = null;
}

دالة إصلاح ترميز اللغة العربية الإصدار الثاني (القيمة) {
  إذا كانت القيمة فارغة (null)، فأرجع القيمة.
  const state = repairArabicEncodingV2._state ?? (() => {
    const cp1256 = new TextDecoder("windows-1256");
    const utf8 = new TextEncoder();
    const mangle = input => cp1256.decode(utf8.encode(input));
    const displaySymbols = [
      "ًں›'"، "ًں'°"، "ًں'³"، "ًں"¦"، "ًں"‍"، "ًں""، "ًںڈ "، "â‌Œ"، "âœ…"، "âڑ ï¸ڈ"، "ًں"‹، "ًں"¥"،
      "إلىں'¤، "إلىں'µ، "∳، "إلىں"'، "إلىں§¾، "إلىں"¢، "إلىں"، "إلىں"ˆ، "إلىں'±، "إلىں"‌، "إلىں™ˆ، "إلىں'پ،
      "ًں› ï¸ڈ"، "ًںڑ€"، "ًں" £"، "ًں'¥"، "âڑ™ï¸ڈ"، "ًں–¼"، "ًں"'"، "ًں""، "ًں"¨"، "ًں'¬"، "ڈï¸ڈ"،
      "â†©ï¸ڈ"، "â¬…ï¸ڈ"، "â‍،ï¸ڈ"، "ًں"پ"، "ًں"چ"، "ًں—'ï¸ڈ"، "â‍•"، "â‍–"، "ًں"ٹ"، "ًں"،"، "ًں§¹"،
      "ًں§ "، "ًں¤–"، "ًںژ¯"، "ً"§"، "ًں›چï¸ڈ"، "ًں""، "ًں"—"، "ًں''"، "ًںŒں"، "ًں"‚، "ًں"پ"،
      "ًںں"، "ًں"´، "â›" ، "ًںڑڑ"، "ًںڑ«، "âڈ±"، "ًں™ڈ"، "ًں'‡"، "أ—"، "â€¢"، "â†"، "â†'"،
    ];
    const sourceChars = [];
    for (let code = 0x20; code <= 0x06ff; code++) sourceChars.push(String.fromCodePoint(code));
    sourceChars.push(...displaySymbols);

    const decodeMap = new Map();
    const truncated = [];
    for (let passes = 1; passages <= 3; passages++) {
      for (const sourceChar of sourceChars) {
        let corrupted = sourceChar;
        for (let pass = 0; pass < passs; pass++) corrupted = mangle(corrupted);
        إذا كان (corrupted !== sourceChar && corrupted.length > 1) decodeMap.set(corrupted, sourceChar);
        إذا كانت (النتائج === 3 && الرموز المعروضة تتضمن (الحرف المصدر) && الكلمة التالفة تنتهي بـ "\u00a0")) {
          truncated.push([corrupted.slice(0, -1), sourceChar]);
          إذا كانت نهاية الكلمة التالفة هي "ط¢ط¢\u00a0"، فسيتم إضافة الحرف المصدر إلى الكلمة التالفة.
        }
      }
    }
    // فقدت النسخة الملصقة من المصدر البايتات الأخيرة لهذه الأحرف العربية الشائعة.
    truncated.push(["ظ†", "ظ†"]);
    truncated.push(["ظˆ", "ظˆ"]);

    const keys = [...decodeMap.keys()].sort((a, b) => b.length - a.length);
    const truncatedKeys = [...new Map(truncated).entries()]
      .sort((a, b) => b[0].length - a[0].length);
    const escapeRegex = input => input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return { decodeMap, keys, truncatedKeys, escapeRegex };
  })();
  repairArabicEncodingV2._state = state;

  let text = String(value);
  const marker = char => `\uE000${char}\uE001`;
  for (const [prefix, char] of state.truncatedKeys) {
    const escaped = state.escapeRegex(prefix);
    text = text.replace(new RegExp(`${escaped} `, "g"), marker(char) + " ");
    text = text.replace(
      new RegExp(`${escaped} (?=ط·|ط¸|ط £|ظ‹|[.,:;!?طŒط›)\\]}"'$])`, "g"),
      marker(char),
    );
    text = text.replace(new RegExp(`${escaped}(?=ط·|ط¸|ط£|ظ‹)`, "g"), marker(char));
    text = text.replace(
      new RegExp(`${escaped}(?=$|[.,:;!?طŒط›)\\]}"'$])`, "g"),
      شار،
    );
  }

  let output = "";
  for (let index = 0; index < text.length;) {
    let found;
    for (const key of state.keys) {
      إذا كان النص يبدأ بالمفتاح المحدد في الفهرس {
        تم العثور على = المفتاح؛
        استراحة؛
      }
    }
    إذا (تم العثور عليه) {
      output += state.decodeMap.get(found);
      index += found.length;
    } آخر {
      output += text[index];
      index += 1;
    }
  }
  output = output.replace(/\uE000([\s\S]*?)\uE001/g, "$1");
  const textFixes = [
    ["âڑ ¸ڈ"، "âڑ ¸ڈ"]،
    ["ظ‡ط°ط§"، "ظ‡ط°ط§"]،
    ["ط¥ط¸ظ‡ط§ط±", "ط¥ط¸ظ‡ط§ط±"],
    ["ط§ظ„ظ…ظ†طھط¬", "ط§ظ„ظ…ظ†طھط¬"],
    ["ظ†ظ‡ط§ط¦ظٹط§ظ‹"، "ظ†ظ‡ط§ط¦ظٹط§ظ‹"],
    ["ظƒط§ظپظچ"، "ظƒط§ظپظچ"]،
    ["ط§ظ"ظ…ط³طھط®ط¯ظ…ظˆط¸أ¢أ¢â€ڑآ¬", "ط§ظ„ظ…ط³طھط®ط¯ظ…ظˆظ†"],
    ["ظ…ط²ط§ظ…ظ†طھظ†ط§ط§", "ظ…ط²ط§ظ…ظ†طھظ‡ط§"],
    ["ط¥ط¶ط§ظپطھظ‡ط§", "ط¥ط¶ط§ظپطھظ‡ط§"],
    ["ط¥ط¶ط§ظپط© ظ…ظ†طھط¬ ظ†طŒظ†ط§", "ط¥ط¶ط§ظپط© ظ…ظ†طھط¬ ظ‡ظ†ط§"],
    ["ط§ط®طھظٹط§ط± ظ†طŒط°ظ†طŒ ط§ظ„ط·ط±ظٹظ‚ط©, "ط§ط®طھظٹط§ط± ظ‡ط°ظ‡ ط§ظ„ط·ط±ظٹظ‚ط©"],
    ["ط¬ط¹ظ„ظ‡ ط¥ط¯ط§ط±ظٹ", "ط¬ط¹ظ„ظ‡ ط¥ط¯ط§ط±ظٹ"],
    ["ط¬ط¹ظ„ظ‡ ظ…ط¯ظٹط±ط§ظ‹ ط £ط¹ظ„ظ‰, “ط¬ط¹ظ„ظ‡ ظ…ط¯ظٹط±ط§ظ‹ ط £ط¹ظ„ظ‰”],
    ["طھط¹ظٹظٹظ†ظ†طŒ"، "طھط¹ظٹظٹظ†ظ‡"]،
    ["ط§ظ†طھظ†طŒطھ", "ط§ظ†طھظ‡طھ"],
    ["ط·ظ"ط¨ط§طھظ‡", "ط·ظ"ط¨ط§طھظ‡"],
    ["ظ…ظ†طھط¬ط§طھظ†طŒ", "ظ…ظ†طھط¬ط§طھظ‡"],
    ["ظ‚ط³ظ…ظ†طŒ", "ظ‚ط³ظ…ظ‡"],
    ["ط®ط§ط±ط¬ظ†طŒ", "ط®ط§ط±ط¬ظ‡"],
    ["ظ…ط¹ط§ظ„ط¬طھظ†طŒ", “ظ…ط¹ط§ظ„ط¬طھظ‡”],
    ["ط³طھط¸ظ†طŒط±", "ط³طھط¸ظ‡ط±"],
    ["طھطظˆظٹظظ†طŒ"، "طھطظˆظٹظظ‡"]،
    ["ظپظ†طŒظ…"، "ظپظ‡ظ…"],
    ["ط £ط±ط³ظ"ظ†طŒ"، "ط £ط±ط³ظ"ظ‡"]،
    ["ط¥ظ†ظ†طŒط§ط،"، "ط¥ظ†ظ‡ط§ط،"],
    ["ط§ظ"ظ…ط³طھظ‡ط¯ظپ", "ط§ظ"ظ…ط³طھظ‡ط¯ظپ"],
    ["ط§ظ"ظ…ط³طھظ‡ط¯ظپ", "ط§ظ"ظ…ط³طھظ‡ط¯ظپ"],
    ["ط§ظ"ط ™ط¸أ ˈâ€ڑآ¬"، "ط§ظ"ط ™ظ†"]،
    ["ظ…ط²ط§ظ…ظ†طھظ†ط§ط§", "ظ…ط²ط§ظ…ظ†طھظ‡ط§"],
    ["ظ…ط²ط§ظ…ط¸أ¢أ¢â€ڑآ¬ طھظ‡ط§”، “ظ…ط²ط§ظ…ظ†طھظ‡ط§”],
    ["ط§ظ"ط¨ظٹط§ط¸أ¢أ¢â€ڑآ¬ ط§طھ", "ط§ظ"ط¨ظٹط§ظ†ط§طھ"],
    ["ط¨ط¯ط¸ط«أ¢â‚¬ ظ†", "ط¨ط¯ظˆظ†"],
    ["ظٹظƒط¸ط«أˈ¬ ظ†", "ظٹظ…ظƒظ†"],
    ["ظٹظ…ظƒط¸أ¢â‚¬ ط £ط¸أ¢â‚¬ ظٹظƒظˆط¸أ¢â‚¬ ظپط§ط±ط؛ط§ظ‹”، “ظٹظ…ظƒظ† ط £ظ† ظٹظƒظˆظ† ظپط§ط±ط؛ط§ظ‹”],
    ["ظٹظ…ظƒظ† ط £ظ† ظٹظ…ظƒظ† ظپط§ط±ط؛ط§ظ‹”، "ظٹظ…ظƒظ† ط £ظ† ظٹظƒظˆظ† ظپط§ط±ط؛ط§ظ‹"],
    ["ط¸ط«أ¢â‚¬ رمز واجهة برمجة التطبيقات"، "ط £ظˆ رمز واجهة برمجة التطبيقات"]،
    ["ظ…ط¸أ¢â‚¬ ط§ظ„ظƒطھط§ظ„ظˆط¬”، “ظ…ظ† ط§ظ„ظƒطھط§ظ„ظˆط¬”],
    ["طھط £ظƒظٹط¯طŒ ط§طط°ظپ"، "طھط £ظƒظٹد، ط§طط°ظپ"],
    ["ط¸ط«أ¢â‚¬ ظ†ظ‚ظ„, “ط¯ظˆظ† ظ†ظ‚ظ„”],
    ["ع؛أ¢أ¢â€ڑآ¬ط› أ¯آ¸عˆ", "ًں› ï¸ڈ"],
    ["ًں¤–", "وں› ï¸ڈ"],
    ["ع؛أ ™ â€ڑآ ‚¬إ'إ'"، "ًں" —"]،
    ["بئں"—", "بئں"—"],
    ["ع؛ع'ع¾", "بںڑھ"],
    ["ٺڑھ", "ٺڑھ"],
    ["ع؛أ ™ â€ڑآ ‚¬إ'ع ©"، "ًں"ک"]،
    ["ٺ"ک", "ٺ"ک"],
    ["ع؛أ ™ â€ڑآ ‚¬إ'ع¯"، "ًں"گ"]،
    ["ٺ"گ", "ٺ"گ"],
    ["â¬‡ï¸ڈ", "â¬‡ï¸ڈ"],
    ["âگ", "âگ"],
  ];
  for (const [bad, good] of textFixes) output = output.split(bad).join(good);
  const commonTextFixes = [["ظ‹ع؛عˆ"،ًںڈ "],["أˈأ' أ¯آ¸عˆ"،"âڑ ï¸ڈ"],["ظ‹ع؛أˈأˈ¬â€ژط«أâ‚¬ "ً"ًں™ˆ"],["ظ‹ع؛آ§ط›"،"ًں›چï¸ڈ"],["ظ‹ع;أ¢أ¢â€ڬآ¬إ“ط«أâ‚¬ ""ًں"ˆ"],["ظ‹ع;أأ¢â€ڑآ¬إ“آ¤"،ًًں“¸"],["ظ‹ع;أ¢أ¢â€ڑآ¬إ“آ©"،" ں'¬"],["ظ‹ع;أ¢أ¢â€ڑآ¬ع©أ¢أ¢â€ڑآ¬آ¹"،ًںڑھ"],["ظ‹ع؛أ¢أ¢â€ڑآ¬ط› أ¯آ¸عˆ″ًًں¤–”],[”ظ‹ع;أ¢أ¢a‚¬آ¬أ¢â‚¬إ'إ'″ًًں”—”],[”ظ‹ع;أأ¢â€ڑآ¬أ¢â‚¬إ 'ط¹أ¢â‚¬″иًں”چ”],[”ظ‹ع;أˈâ€ڑآ¬أ¢â‚¬إ'ع©”,ًں”ک”],[”ظ‹ع;أ¢أ¢a‚¬آ¬أ‚â‚ ¬إ'ع¯"،ًں”گ"],["ظ‹ع؛ع'ع¾"،ًںڑھ"],["أآ¬أ¢أâ€ڑآ¬طŒأ¯آ¸عˆ"،â¬‡ï¸ڈ"],[ "أآع¯"،âگ"],["ظ‹ع؛أˈâ€ڑآ¬ط›"،ًں¤–"],["ظ†طŒط°ط§"،ظ‡ط°ط§"],["ظ†طŒظ† ط§"،"ظ‡ظ†ط§"],["ط¥ط¸ظ†طŒط§ط±"،ط¥ط¸ظ‡ط§ط±"],["ط§ظ„ظ…ط¸أ¢â‚¬ طھط¬”,ط§ظ„ظ…ظ†طھط¬”],[”ط¸أ¢â‚¬ ظ‡ط§ط¦ظٹط§ظ‹”،،ظ†ظ‡ط§ط¦ظٹط§ظ‹”],[”ط¸أ¢â‚¬ ط¹ظ…طŒ ط§طط°ظپ”،،طھط £ظƒظٹط¯طŒ ط§طط°ظپ"],["ط§ظ„ظ…ظ† طھط¬ط§طھ"،ط§ظ„ظ…ظ†طھط¬ط§طھ"],["ط§ظ„ظ…ظ† طھط¬"،ط§ظ„ظ…ظ†طھط¬"],["ظ…ظ† طھط¬ط§طھ"،ظ…ظ†طھط¬ط§طھ"],["ظ…ظ† طھط¬"،ظ…ظ†طھط¬"],["ط§ظط¯ط®ظˆ ظ"،"ط§ظ„ط¯ط®ظˆظ"],["ظظˆظˆ طط©"، "ظ"ظ"ظˆطط©"],["ظˆ ط³ط§ط¦ظ""،"ظˆط³ط§ط¦ظ""],["ط§ظ"طھظˆ ط§طط©""،"ط§ظ"طھظˆط§طμظ"],["طھظˆ ط¬ط¯"،طھظˆط¬ط¯"],["ظٹظˆ ط¬ط¯"،"،ظٹظˆط¬ط¯"],["ظ…ظˆ ط§ظپظ‚ط©"،ظ…ظˆط§ظپظ‚ط©"],["ظ…ظˆ ط¬ظˆ ط¯"،ظ…ظˆط¬ظˆط¯"],["ط±ط¬ظˆ ط¹"،ط±ط¬ظˆط¹"],["ظ† ظˆط¯"],["ظٹط¯ظˆ ظٹط©"،ظٹط¯ظˆظٹط©"],["ظٹط¯ظˆ ظٹ"،"،ظٹط¯ظˆظٹ"],["ظ† ط³ط¨ط©"،ظ†ط³ط¨ط©"],["ظˆ ظ‚طھ"،ظˆظ‚طھ"],["طھظ† ظپظٹط°"،"طھظ†ظپظٹط°"],["ط§ظ"طھظ† ظپظٹط°"،"ط§ظ"طھظ†ظپظٹط°"],["طھظ… ط¥ظ† ط´ط§ط،"،"،طھظ… ط¥ظ†ط´ط§ط،"],["ظ‚ط¨ظˆ ظ"،ظ‚ط¨ظˆظ„"],["ط¬ط¹ظظ†طŒ"،ط¬ط¹ظظ‡"],["ط·ظ„ط¨ط§طھظ†طŒ"،ط·ظط¨ط§طھظ‡"],["ط¥ط¶ط§ظپطھظ†طŒ"،ط¥ط¶ط §ظپطھظ‡"],["ط§ظ"ظ…ط³طھظ†طŒط¯ظپ"،"ط§ظ„ظ…ط³طھظ‡ط¯ظپ"],["ط§ظظ†طŒط¯ظپ"،ط§ظ„ظ…ط³طھظ‡ط¯ظپ"],["ط§ظ„ظ…ط±ظˆ ط±"،ط§ظˆ طھ"،"ط§ظ„ط¨ظˆطھ"],["ط§ظظ…ط³طھط®ط¯ظ…ظˆ ظ†"،"،ط§ظ„ظ…ط³طھط®ط¯ظ…ظˆظ†"],["ظ…طھظˆ ظ‚ظپ"،ظ…طھظˆظ‚ظپ"],["ط®ط±ظˆ ط¬"،"ط®ط±ظˆط¬"],["ط§ظ"طμظˆ ط±ط©"،"ط§ظططظˆط±ط©"],["ظˆ ط¶ط¹"، "ظˆط¶ط¹"],["ط§ظ"ط¥ظ† ظ†طŒط§ط،"،"،ط§ظ"ط¥ظ†ظ‡ط§ط،"],["ط¥ظظٹظ†طŒ"،ط¥ظظٹظ‡"],["ط´طظ† ط±طμظٹط¯"،ط´طظ† ط±طظٹط¯"],["ط £ظ‚ط±ط¨ ظˆ ظ‚طھ"،ط £ظ‚ط±ط¨ ظˆظ‚طھ"],["ط§طط·ظ† ط§ط¹ظٹ"،"ط§طط·ظ†ط§ط¹ظٹ"],["ط§ظ"ط§طط·ظ† ط§ط¹ظٹ"،"ط§ظ"ط§طط·ظ†ط§ط¹ظٹ"],["ط¨ظٹط§ظ† ط§طھ"،"ط¨ظٹط§ظ†ط§طھ"],["ط§ظ"طھظˆ ط«ظٹظ‚"،"ط§ظ"طھظˆط"ظٹظ‚"],["ظƒط§ظپط¸ط¹أ¢â‚¬"،ظƒط§ظپظچ"]];
  for (const [bad, good] of commonTextFixes) output = output.split(bad).join(good);
  أعد الناتج؛
}

دالة إصلاح ترميز اللغة العربية (القيمة) {
  أعد إصلاح ترميز اللغة العربية الإصدار الثاني (القيمة)؛
  إذا كانت القيمة فارغة (null)، فأرجع القيمة.
  let text = String(value);
  // عدّ علامات الموجبيك القابلة للتمييز، بما في ذلك الأقصر
  // تم إنتاج نموذج "ط§ظ" بواسطة خطأ واحد في Windows-1256/UTF-8.
  const mojibakeScore = s => {
    const text = String(s);
    يعود (
      (text.match(/(?:ط·[آ·آ¸][^ \n]{0,3}|ط·[\u0600-\u06ff]|ط§|[ط £ط¥][آ¢ئ'آ¯]|[أ¢أ°أ¯][^\s]{1,3}|ظ‹ع؛|ظ‹ع؛)/g) || []).length
    );
  };
  const decodeRuns = (input, reverse) => {
    إذا لم يكن (reverse) فأرجع المدخلات؛
    let output = "";
    let run = "";
    const flush = () => {
      إذا لم يتم تشغيل البرنامج، فقم بالخروج.
      const bytes = [];
      for (const char of Array.from(run)) {
        إذا كان (char.codePointAt(0) <= 127) bytes.push(char.codePointAt(0));
        وإلا إذا كان (reverse.has(char)) bytes.push(reverse.get(char));
        وإلا { output += run; run = ""; return; }
      }
      يحاول {
        const decoded = new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(bytes));
        output += decoded && mojibakeScore(decoded) < mojibakeScore(run) ? decoded : run;
      } catch { output += run; }
      تشغيل = "";
    };
    for (const char of Array.from(input)) {
      إذا كان (char.codePointAt(0) <= 127 || reverse.has(char)) run += char;
      وإلا { flush(); output += char; }
    }
    flush();
    أعد الناتج؛
  };

  // ط¥طμظ‹ط§ط ط§ظ‹ط¸أ¢â‚¬ طμظˆطμ ط§ظ‹ظ‚ط¯ظٹظ…ط© ط§ظ„ظ…طظپظˆط¸ط© ط¨ط¹ط¯ ظپظƒ UTF-8 ط¨طھط±ظ…ظٹط² Windows-1256/1252.
  for (let i = 0; i < 3; i++) {
    const before = mojibakeScore(text);
    let next = decodeRuns(text, cp1256Reverse);
    next = decodeRuns(next, windows1252Reverse);
    إذا كانت نتيجة mojibakeScore(next) أكبر من أو تساوي نتيجة before، فاخرج من الحلقة.
    النص = التالي؛
  }

  // ط¨ط¹ط¶ ط§ظ„ط±ظ…ظˆط² ط§ظ„ظ‚ط¯ظٹظ…ط© طھط¶ط±ط±طھ ظ…ط¹ ظ…طط¯ط¯ طھط¸أ¢â‚¬ ط³ظٹظ‚ emojiit› ط§ط³طھط¨ط¯ط§ظ„ظ‡ط§ ظ„ط§ ظٹط¤ط«ط± ط¹ظ‹ظ‰ ط§ظ‹ط¸أ¢â‚¬ طμ ط§ظ„ط¹ط±ط¨ظٹ ط§ظ„طμطظٹط.
  const emojiFixes = {
    "بںڈ ": "بںڈ ", "بں›'": "بں›'", "بں'°": "بں'°", "بں'³": "بں'³", "بں“¦": "بں“¦",
    "ًں"‚": "ًں"‚, "ًں"‹": "ًں"‹, "ًں"'": "ًں"', "ًں"„": "ًں"„, "ًں"—": "ظ‹ع؛أ‚¬â€Œإ'",
    "ًں"¥": "ًں"¥", "ًں" £": "ًں" £, "ًں"‍": "ظ‹ع;أ¢â‚¬ ع©", "ًں"": "ًں"", "ًں"§": "ًں"§",
    "ًں”´": "ًں"´", "ًںڢ": "ًںں", "ظ‹ع;â€”أ¢أ¢â€ڑآ¬ع©": "ًں—'ï¸ڈ", "ظ‹ع;أ¢أ¢â€ڑآ¬أâ‚¬إ'ط«أâ‚¬ ": "ظ‹ع؛أ‚¬â€Œth†", "ًں"‌": "ًں"‌",
    "ًں'μ": "ًں'μ", "ظ‹ع;أ¢أ¢â€ڑآ¬أ¢â€‍آآ¸": "ظ‹ع;أâ‚¬â℈آ¸", "ًں§¾": "ًں§¾", "ًں"": "ًں", "ًںŒں": "ًںŒں",
    "ًں'¤": "ًں'¤", "ًں'¥": "ًں'¥", "ًں'‡": "ًں'‡", "ًںڑھ": "ظ‹ع;أ©¬ع©Â‚¬آ¹", "ًں”گ": "ظ‹ع؛أ‚¬â€Œع¯", "ًں"گ": "
    "ًں“": "ًں", "ًں"ˆ": "ًں"ˆ, "ًں"‌": "ًں"‌", "ًں"پ": "ظ‹ع;أâ‚¬إ"إ'", "ًںژ¯": "ًںژ¯",
    "ًں¤–": "ًں¤–", "ظ‹ع؛أ¢أ¢â€ڑآ¬أâ‚¬إ'أˈâ€ڑآ¬إ'": "ًں"'", "ظ‹ع;إ،": "ًںڑ«", "ظ‹ع;ع'": "ظ‹ع;ع'€"", "ظ‹ع;إ'": "ظ‹ع;إ'ع¯",
  };
  for (const [bad, good] of Object.entries(emojiFixes)) text = text.split(bad).join(good);
  for (let i = 0; i < 2; i++) {
    const next = decodeRuns(decodeRuns(text, cp1256Reverse), windows1252Reverse);
    إذا كانت نتيجة تحويل النص التالي إلى صيغة mojibakeScore أكبر من أو تساوي نتيجة تحويل النص إلى صيغة mojibakeScore، فاخرج من الحلقة.
    النص = التالي؛
  }
  أعد النص؛
}

دالة normalizeTelegramPayload(value, key = "") {
  إذا كان نوع القيمة هو "سلسلة نصية" {
    const protectedKeys = new Set([
      "callback_data", "url", "file_id", "parse_mode", "chat_id", "message_id",
      "inline_message_id", "callback_query_id", "media", "token", "method",
    ]);
    return protectedKeys.has(key) ? value : repairArabicEncoding(value);
  }
  إذا كانت القيمة عبارة عن مصفوفة، فسيتم إرجاع القيمة بعد تطبيق دالة map عليها، ثم يتم تحويلها إلى مصفوفة باستخدام دالة normalizeTelegramPayload.
  إذا لم تكن القيمة موجودة، أو كان نوعها ليس كائنًا، أو كانت القيمة مخزنة مؤقتًا، فسيتم إرجاع القيمة.
  const out = {};
  for (const [childKey, childValue] of Object.entries(value)) {
    out[childKey] = normalizeTelegramPayload(childValue, childKey);
  }
  العودة للخارج؛
}

// أ ™أ ™ €ڑآ¬أ ™ ‚¬إ'أ ™أ ™ ‚¬ع'آ¬أ ™أ ™ â€ڑآ¬أ ™ ‚¬إ'أ ™أ ™ ¬ع'آ¬ ط§ط³طھط®ط±ط§ط¬ ط§ظ„ظ…ط¨ظ„ط; ظ…ظ† ظ† طμ ط¨طμظٹط؛ ظ…ط®طھظ„ظپط© ™أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ ™ ™ ™ €أ¬أ'أ'أ'أ'ع'آ¬أبحث عن ¬أ'أ'أ'â¬ع'آ¬أ¢أ¢a‚¬آ¬أ¬إ'أ¢a‚¬ع'آ¬أ¢أأ¬آ¬أ ™إ'أ¢أ¢a‚¬آ'آ¬أ‌أƑآ¬أ ’أ‘أ‘‘آ¬أ‘أƑآ¬أ‘‘‘‘‘‘‘‘‘‘‘‘‘‘‘‘‘‘‘ 'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ'أ ‹‹‹‹‹‹‹›› ع'آ¬أ¢أ¢a‚¬آ¬أ‚آ‚¬أ¬أ¬ع'آ¬أ¬إ'أ¢أ‚¬ع'آ¬أ™أ¢أ€ڑآ¬أ¬إ'أ¢a‚¬ع'آ¬
دالة استخراج المبلغ من النص (txt، سعر الصرف) {
  إذا لم يكن النص موجودًا، فأرجع قيمة فارغة.
  const clean = repairArabicEncoding(txt.replace(/,/g, "")).trim();

  // ظ†طŒظ„ ظ†طŒظˆ ط¨ط§ظ„ظ„ظٹط±ط© ط§ظ„ط³ظˆ ط±ظٹط©طں
  const isSYP = /ظ„\.ط³|ظ„ظٹط±ط© ط³ظˆط±ظٹط©|ظ„ظٹط±ط©|ط³ظˆط±ظٹ|syp/i.test(clean);
  // ظ†طŒظ„ ظ†ط§ظˆ ط¨ط§ظ„ط¯ظˆ ظ„ط§ط±طں
  const isUSD = /\$|usd|ط¯ظˆظ„ط§ط±/i.test(clean);

  // ط§ط³طھط®ط±ط¬ ط £ظˆ ظ ط±ظ‚ظ… (طط³طھط®ط±ط¬ ط¹ط´ط±ظٹ)
  const numMatch = clean.match(/(\d+\.?\d*)/);
  إذا لم يكن الرقم مطابقًا، فأرجع قيمة فارغة.

  const num = parseFloat(numMatch[1]);
  إذا لم يكن العدد منتهيًا أو كان أقل من أو يساوي صفرًا، فسيتم إرجاع قيمة فارغة.

  إذا (كانت SYP) {
    // طظˆ ظ’ظ„ ظ…ظ† ظ„ظٹط±ط© ط¥ظ„ظ‰ ط¯ظˆ ظ„ط§ط±
    const rate = Number(exchangeRate) || 132;
    إرجاع العدد / المعدل؛
  }
  // ط§ظپطھط±ط§ط¶ظٹط§ظ‹ ط¯ظˆ ظ‹ط§ط±
  أعد الرقم؛
}

// ============================================================
// واجهة برمجة تطبيقات أورانوس
// ============================================================
const ORANOS_BASE = process.env.ORANOS_API_BASE ?? "https://api.oranosmarket.com";
const ORANOS_TOKEN = process.env.ORANOS_API_TOKEN ?? "";
const API_ROOT_CATEGORY = 900_000_000;

دالة normalizeApiBase(value) {
  return String(value ?? "")
    .تقليم()
    .replace(/\/+$/, "")
    .replace(/\/api\/v2\/(?:products|content|order|check|balance|profile)$/i, "")
    .replace(/\/api\/v2$/i, "")
    .replace(/\/client\/api\/products$/i, "")
    .replace(/\/client\/api$/i, "");
}

دالة getApiEncryptionKey() {
  return crypto.createHash("sha256")
    .update(String(process.env.API_CONFIG_ENCRYPTION_KEY || process.env.BOT_TOKEN || process.env.DATABASE_URL || "marwan-api-config"))
    .هضم()؛
}

دالة encryptApiToken(token) {
  إذا لم يكن الرمز المميز موجودًا، فأرجع قيمة فارغة.
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getApiEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(token), "utf8"), cipher.final()]);
  return `${iv.toString("base64")}.${cipher.getAuthTag().toString("base64")}.${encrypted.toString("base64")}`;
}

دالة فك تشفير رمز API (القيمة) {
  إذا لم تكن القيمة موجودة، فأرجع "";
  يحاول {
    const [iv64, tag64, data64] = String(value).split(".");
    const decipher = crypto.createDecipheriv("aes-256-gcm", getApiEncryptionKey(), Buffer.from(iv64, "base64"));
    decipher.setAuthTag(Buffer.from(tag64, "base64"));
    return Buffer.concat([decipher.update(Buffer.from(data64, "base64")), decipher.final()]).toString("utf8");
  } يمسك {
    يعود ""؛
  }
}

async function ensurePrimaryApiSource() {
  const existing = await q("SELECT id,name,base_url FROM api_sources WHERE is_primary=true LIMIT 1");
  إذا كان عدد الصفوف الموجودة {
    انتظر q(
      "UPDATE api_sources SET name=$1,base_url=COALESCE($2,base_url), token_encrypted=COALESCE($3,token_encrypted), active=true, updated_at=NOW() WHERE id=$4",
      [
        RepairArabicEncoding(existing.rows[0].name) || "API ط§ظ"ط £ط³ط§ط³ظٹ"،
        process.env.ORANOS_API_BASE || /api\.example\.com/i.test(existing.rows[0].base_url || "")
          ? normalizeApiBase(ORANOS_BASE)
          : باطل،
        ORANOS_TOKEN ? encryptApiToken(ORANOS_TOKEN) : null,
        existing.rows[0].id,
      ]
    );
    return existing.rows[0].id;
  }
  const inserted = await q(
    `INSERT INTO api_sources(name,base_url,token_encrypted,active,is_primary)
     VALUES($1,$2,$3,true,true) RETURNING id`,
    ["API ط§ظ„ط £ط³ط§ط³ظٹ", NormalizeApiBase(ORANOS_BASE), encryptApiToken(ORANOS_TOKEN)]
  );
  أعد معرف الصف الأول في العنصر المُدرج.
}

async function listApiSources(includeInactive = true) {
  const res = await q(
    `SELECT id,name,base_url,active,is_primary,last_sync_at,last_sync_error,created_at
     FROM api_sources ${includeInactive ? "" : "WHERE active=true"} ORDER BY is_primary DESC, id`
  );
  أعد عدد الصفوف في res.
}

دالة غير متزامنة getApiSource(id) {
  const res = await q("SELECT * FROM api_sources WHERE id=$1", [id]);
  return res.rows[0] ?? null;
}

async function getPrimaryApiSource() {
  const res = await q("SELECT * FROM api_sources WHERE is_primary=true AND active=true LIMIT 1");
  return res.rows[0] ?? null;
}

دالة apiClientFor(source) {
  const token = decryptApiToken(source.token_encrypted);
  return axios.create({
    baseURL: normalizeApiBase(source.base_url),
    مهلة الانتظار: 8000
    الرؤوس: {
      "api-token": رمز مميز،
      "x-api-token": رمز مميز،
      المصادقة: رمز مميز؟ `Bearer ${token}` : غير مُعرّف،
      مقبول: "application/json"،
    },
    httpAgent: new http.Agent({ keepAlive: true, maxSockets: 20 }),
    httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 20 }),
  });
}

دالة stableProductId(source, externalId) {
  const sourceId = Number(source.id);
  const numeric = Number(externalId);
  إذا كان (source.is_primary && Number.isSafeInteger(numeric) && numeric > 0) أرجع numeric؛
  const hash = crypto.createHash("sha1").update(`${sourceId}:${externalId}`).digest();
  const value = hash.readUInt32BE(0) % 800_000_000;
  return API_ROOT_CATEGORY + (sourceId * 100_000_000) + value;
}

دالة sourceRootCategoryId(sourceId) {
  أعد API_ROOT_CATEGORY + Number(sourceId)؛
}

دالة apiProductForDb(row) {
  const raw = row.raw && typeof row.raw === "object" ? row.raw : {};
  يعود {
    ...خام،
    المعرّف: رقم (row.id)،
    source_id: Number(row.source_id),
    source_product_id: row.external_id,
    parent_id: Number(row.parent_id || 0),
    اسم_الفئة: إصلاح_ترميز_العربية(اسم_الفئة_في_الصف || اسم_الفئة_في_الصف || ""),
    الاسم: إصلاح ترميز اللغة العربية (اسم الصف)،
    السعر: إذا كان سعر الصف غير فارغ، يتم تعيينه كرقم، وإلا يتم تعيينه كسعر الصف.
    متاح: row.available && !row.deleted,
    qty_values: row.qty_values ​​?? raw.qty_values,
    المعاملات: row.params ?? raw.params,
  };
}

دالة categoryForDb(row) {
  return { id: Number(row.id), name: repairArabicEncoding(row.name), parent_id: Number(row.parent_id || 0) };
}

// طھط®طھظ„ظپ ط§ط³طھط¬ط§ط¨ط© ط¨ط¹ط¶ ظ† ط³ط® API ط¨ظٹظ† ظ…ط¨ظپظˆ ظپط© ظ…ط¨ط§ط´ط±ط© ظˆ {المنتجات} ظˆ {بيانات}.
// طھظˆ طظٹط¯ظ†طŒط§ ظ‡ظ†ط§ ظٹظ…ظ† ط¹ ط¥ط¶ط§ظپط© ظ…طط¯ط± ظ† ط§ط¬ط ط¸ط§ظ†طŒط±ظٹط§ظ‹ ظ„ظظ† ظ†طŒ ظٹط¸ظ†طŒط± ظپط§ط±ط؛ط§ظ‹ ظ„ظ„ظ…ط³طھط®ط¯ظ….
دالة استخراج حمولة المنتجات (الحمولة) {
  إذا كانت الحمولة عبارة عن مصفوفة، فسيتم إرجاع الحمولة.
  إذا كانت (Array.isArray(payload?.products)) تُرجع payload.products؛
  إذا كانت (Array.isArray(payload?.items)) تُرجع payload.items؛
  إذا كانت (Array.isArray(payload?.results)) إرجاع payload.results؛
  إذا كانت البيانات عبارة عن مصفوفة، فسيتم إرجاع البيانات الموجودة في الحمولة.
  إذا كانت البيانات عبارة عن مصفوفة، فسيتم إرجاع البيانات الموجودة في البيانات.
  إذا كانت البيانات عبارة عن مصفوفة، فسيتم إرجاع البيانات الموجودة في البيانات.
  إذا كانت (Array.isArray(payload?.data?.results)) إرجاع payload.data.results؛
  إذا كانت البيانات في الحمولة عبارة عن مصفوفة، فسيتم إرجاع البيانات الموجودة في الحمولة.
  إذا كانت نتيجة الحمولة عبارة عن مصفوفة، فسيتم إرجاع نتيجة الحمولة.
  إذا كانت نتيجة البيانات في الحمولة عبارة عن مصفوفة، فسيتم إرجاع نتيجة البيانات في الحمولة.
  إذا كانت (Array.isArray(payload?.response?.products)) إرجاع payload.response.products؛
  يعود []؛
}

دالة externalProductId(raw) {
  إرجاع raw?.id ?? raw?.product_id ?? raw?.productId ?? raw?.service_id ?? raw?.service ?? raw?.sku ?? raw?.code;
}

دالة externalProductName(raw, externalId) {
  return raw?.name ?? raw?.title ?? raw?.product_name ?? raw?.productName ?? `ظ…ظ†طھط¬ ${externalId}`;
}

دالة externalCategoryName(raw) {
  const category = raw?.category_name ?? raw?.categoryName ?? raw?.category ?? raw?.category_title ?? "";
  إذا كانت الفئة موجودة ونوعها "كائن"، فسيتم إرجاع اسم الفئة أو عنوانها أو لا شيء.
  إرجاع الفئة؛
}

دالة externalQtyValues(raw) {
  const explicit = raw?.qty_values ​​?? raw?.quantity_values ​​?? raw?.quantities;
  إذا كان (explicit != null) فأرجع explicit؛
  const min = raw?.min_quantity ?? raw?.minQuantity ?? raw?.min_qty ?? raw?.min;
  const max = raw?.max_quantity ?? raw?.maxQuantity ?? raw?.max_qty ?? raw?.max;
  إذا كان (min != null || max != null) أرجع { min, max };
  أعد الكمية الخام؟ أو الكمية الخام؟ أو لا شيء؛
}

async function fetchProductsFromApi(source) {
  const client = apiClientFor(source);
  const endpoints = ["/api/v2/products", "/client/api/products", "/api/products", "/products"];
  let lastError = null;
  for (const endpoint of endpoints) {
    يحاول {
      const response = await wrapRequest(() => client.get(endpoint));
      const products = extractProductsPayload(response.data);
      إذا كان طول قائمة المنتجات (products.length) يتم إرجاع المنتجات؛
      lastError = new Error(`لم تُرجع واجهة برمجة التطبيقات أي منتجات من ${endpoint}`);
    } catch (err) {
      lastError = err;
      const status = err?.response?.status;
      إذا (كانت الحالة && الحالة !== 404 && الحالة !== 405) ارمِ خطأً؛
    }
  }
  يحاول {
    const content = await fetchContent(0, source.id);
    إذا كان (content.products.length) أعد content.products؛
  } catch (contentError) {
    lastError = contentError;
  }
  throw lastError ?? new Error("لم تُرجع واجهة برمجة التطبيقات أي منتجات");
}

async function fetchApiProfile(source) {
  const client = apiClientFor(source);
  const res = await wrapRequest(() => client.get("/api/v2/profile"));
  أعد res.data؛
}

async function fetchApiBalance(source) {
  const client = apiClientFor(source);
  const res = await wrapRequest(() => client.get("/api/v2/balance"));
  أعد res.data؛
}

async function syncApiSource(source, prefetchedProducts = null) {
  const products = prefetchedProducts ?? await fetchProductsFromApi(source);
  const seen = [];
  for (const raw of products) {
    const externalId = String(externalProductId(raw) ?? "");
    إذا لم يكن المعرف الخارجي موجودًا، فتابع؛
    const botId = StableProductId(source, ExternalId);
    const rawCategory = raw.category && typeof raw.category === "object" ? raw.category : null;
    const parentId = source.is_primary
      ؟ رقم(raw.parent_id ?? raw.parentId ?? raw.category_id ?? raw.categoryId ?? rawCategory?.id ?? 0)
      : sourceRootCategoryId(source.id);
    const rawPrice = Number(raw.price) || Number(raw.base_price) || Number(raw.price_usd) || Number(raw.cost) || Number(raw.amount) || 0;
    انتظر q(
      `INSERT INTO cached_products
       (id,source_id,external_id,name,parent_id,category_name,price,available,qty_values,params,raw,deleted,last_seen_at,updated_at)
       القيم (1 دولار، 2 دولار، 3 دولار، 4 دولار، 5 دولار، 6 دولار، 7 دولار، 8 دولار، 9 دولار، 10 دولار، 11 دولار،
              COALESCE((SELECT deleted FROM product_overrides WHERE product_id=$1),false),
              الآن()، الآن())
       ON CONFLICT(source_id,external_id) DO UPDATE SET
         id=$1,name=$4,parent_id=$5,category_name=$6,price=$7,available=$8,
          qty_values=$9,params=$10,raw=$11,
          تم الحذف = COALESCE((SELECT deleted FROM product_overrides WHERE product_id=$1),false),
          last_seen_at=NOW(),updated_at=NOW(),
      [
        botId، source.id، externalId، repairArabicEncoding(String(externalProductName(raw, externalId)))، parentId،
        repairArabicEncoding(externalCategoryName(raw)) || null, rawPrice,
        raw.available !== false && raw.active !== false && raw.status !== "inactive",
        externalQtyValues(raw),
        raw.params ?? raw.parameters ?? null, JSON.stringify(raw),
      ]
    );
    seen.push(externalId);
  }
  إذا كان عدد المشاهدات {
    انتظر q(
      "تحديث cached_products SET deleted=true,available=false,updated_at=NOW() WHERE source_id=$1 AND external_id <> ALL($2)",
      [source.id, seen]
    );
  } آخر {
    await q("UPDATE cached_products SET deleted=true,available=false,updated_at=NOW() WHERE source_id=$1", [source.id]);
  }
  await q("UPDATE api_sources SET last_sync_at=NOW(),last_sync_error=NULL,updated_at=NOW() WHERE id=$1", [source.id]);
  أعد طول العنصر المرئي.
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
  const payload = res.data ?? {};
  const data = payload?.data && typeof payload.data === "object" && !Array.isArray(payload.data)
    بيانات الحمولة؟
    الحمولة؛
  _maintenanceMode = false;
  يعود {
    المنتجات: (Array.isArray(data.products) ? data.products : extractProductsPayload(payload)).map(p => ({
      ...ص،
      الاسم: إصلاح الترميز العربي (اسم الملف)،
      اسم_الفئة: إصلاح_الترميز_العربي(p.category_name ?? p.categoryName ?? ""),
    })),
    الفئات: Array.isArray(data.categories)؟ data.categories.map(c => ({
      ...ج،
      الاسم: إصلاح ترميز اللغة العربية (c.name)،
    })) : [],
  };
}

دالة غير متزامنة fetchAllProducts(sourceId = null) {
  const source = sourceId != null
    انتظر حتى يتم استدعاء دالة getApiSource(Number(sourceId)).catch(() => null)
    انتظر حتى يتم استدعاء getPrimaryApiSource().catch(() => null);
  const client = source ? apiClientFor(source) : oranosClient;
  let res;
  يحاول {
    res = await wrapRequest(() => client.get("/api/v2/products"));
  } catch (err) {
    const status = err?.response?.status;
    إذا كانت حالة الخطأ لا تساوي 404 ولا تساوي 405، فقم برمي الخطأ.
    res = await wrapRequest(() => client.get("/client/api/products"));
  }
  const products = extractProductsPayload(res.data);
  إذا لم يكن هناك مصدر، فأرجع المنتجات؛
  return products.map(raw => {
    const externalId = String(externalProductId(raw) ?? "");
    يعود {
      ...خام،
      id: stableProductId(source, externalId),
      source_id: Number(source.id),
      source_product_id: externalId,
      parent_id: source.is_primary ? Number(raw.parent_id || 0) : sourceRootCategoryId(source.id),
      اسم_الفئة: إصلاح_ترميز_العربية(اسم_الفئة_الخارجية(الخام)),
      الاسم: إصلاح ترميز اللغة العربية (سلسلة (اسم المنتج الخارجي (الخام، المعرف الخارجي)))،
    };
  }).filter(p => p.source_product_id);
}

async function placeOrderRequest(client, productId, params, orderUuid) {
  const body = { product_id: productId, ...params, order_uuid: orderUuid };
  يحاول {
    return (await wrapRequest(() => client.post("/api/v2/order", body))).data;
  } catch (err) {
    const status = err?.response?.status;
    إذا كانت حالة الخطأ لا تساوي 404 ولا تساوي 405، فقم برمي الخطأ.
    const search = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) search.set(k, String(v));
    search.set("order_uuid", orderUuid);
    return (await wrapRequest(() => client.get(`/client/api/newOrder/${encodeURIComponent(productId)}/params?${search.toString()}`))).data;
  }
}

async function placeOrder(productId, params, orderUuid) {
  يحاول {
    const source = await getPrimaryApiSource().catch(() => null);
    const client = source ? apiClientFor(source) : oranosClient;
    العودة في انتظار placeOrderRequest(client, ProductId, params, orderUuid);
  } catch (err) {
    إذا كان (err?.response?.data) فقم بإرجاع err.response.data؛
    return { status: "ERR", message: "خطأ في الشبكة" };
  }
}

async function placeOrderForProduct(product, params, orderUuid) {
  إذا لم يكن (product?.source_id) {
    قم بإرجاع عملية الطلب باستخدام (معرف المنتج، المعلمات، معرف الطلب الفريد).
  }
  const source = await getApiSource(Number(product.source_id));
  if (!source || !source.active) return { الحالة: "ERR"، الرسالة: "ظ…طط¯ط± ط§ظ„ظ…ظ†طھط¬ ط؛ظٹط± ظ…طھط§ط” };
  إذا كان (source.is_primary) فقم بإرجاع placeOrder(product.source_product_id ?? product.id, params, orderUuid);
  يحاول {
    return await placeOrderRequest(apiClientFor(source), product.source_product_id, params, orderUuid);
  } catch (err) {
    إذا كان (err?.response?.data) فقم بإرجاع err.response.data؛
    return { status: "ERR", message: "خطأ في الشبكة" };
  }
}

دالة غير متزامنة تتحقق من الطلب (معرف الطلب، بواسطة المعرف الفريد = خطأ) {
  const search = new URLSearchParams();
  search.set("orders", `[${orderId}]`);
  إذا كان (byUuid) search.set("uuid", "1");
  const source = await getPrimaryApiSource().catch(() => null);
  const client = source ? apiClientFor(source) : oranosClient;
  يحاول {
    const res = await wrapRequest(() => client.get(`/api/v2/check?${search.toString()}`));
    أعد res.data؛
  } catch (err) {
    const status = err?.response?.status;
    إذا كانت حالة الخطأ لا تساوي 404 ولا تساوي 405، فقم برمي الخطأ.
    const res = await wrapRequest(() => client.get(`/client/api/check?${search.toString()}`));
    أعد res.data؛
  }
}

async function checkOrderForSource(orderId, sourceId, byUuid = false) {
  إذا لم يكن (sourceId) صحيحًا، فقم بإرجاع checkOrder(orderId, byUuid)؛
  const source = await getApiSource(Number(sourceId));
  إذا لم يكن المصدر نشطًا أو لم يكن نشطًا، فسيتم إرجاع قيمة فارغة.
  إذا كان (source.is_primary) فقم بإرجاع checkOrder(orderId, byUuid);
  const search = new URLSearchParams({ orders: `[${orderId}]` });
  إذا كان (byUuid) search.set("uuid", "1");
  const client = apiClientFor(source);
  يحاول {
    const res = await wrapRequest(() => client.get(`/api/v2/check?${search.toString()}`));
    أعد res.data؛
  } catch (err) {
    const status = err?.response?.status;
    إذا كانت حالة الخطأ لا تساوي 404 ولا تساوي 405، فقم برمي الخطأ.
    const res = await wrapRequest(() => client.get(`/client/api/check?${search.toString()}`));
    أعد res.data؛
  }
}

دالة استخراج رمز التسليم (الاستجابة) {
  const rawD = resp?.data;
  const d = Array.isArray(rawD) ؟ الخام[0] : الخام؛
  إذا لم يكن (d && !resp?.replay_api) فأرجع قيمة فارغة (null)؛
  const candidates = [];
  إذا كان (d?.data) candidates.push(d.data);
  إذا كان (d?.replay_api) candidates.push(d.replay_api);
  إذا كان (resp?.replay_api) candidates.push(resp.replay_api);
  إذا كان (d?.response) candidates.push(d.response);
  إذا كان (d?.result) candidates.push(d.result);
  إذا كان (d?.note) candidates.push(d.note);
  إذا كان (d?.notes) candidates.push(d.notes);
  const lines = [];
  const visit = v => {
    إذا كان (v == null) فارجع؛
    إذا كان نوع المتغير v هو "سلسلة نصية" وكان المتغير v قابلاً للحذف، فسيتم إضافة المتغير v بعد حذفه إلى الأسطر.
    وإلا إذا كان نوع v هو "رقم"، فسيتم إضافة السلسلة النصية (v) إلى الأسطر.
    وإلا إذا كانت (Array.isArray(v)) v.forEach(visit);
    وإلا إذا كان نوع v هو "كائن" {
      for (const [k, val] of Object.entries(v)) {
        إذا كانت القيمة فارغة، فتابع.
        إذا كان نوع القيمة هو "كائن"، فقم بزيارة (القيمة)؛
        وإلا، أضف السطر التالي: `${k}: ${val}`);
      }
    }
  };
  for (const c of candidates) visit(c);
  const out = lines.filter(Boolean).join("\n").trim();
  return out ? repairArabicEncoding(out) : null;
}

دالة getProductApiNotes(p) {
  const v = repairArabicEncoding((p.notes ?? p.description ?? p.details ?? "")).trim();
  return v || null;
}

// ============================================================
//  AI SUPPORT
// ============================================================
const convHistory = new Map();

// ظ„ط§ ظ† ط°ظƒط± ط§ط³ظ… ط§ظ„ظ…ظˆ ظ‚ط¹ ط£ظˆ  ط£ظٹ ط±ط§ط¨ط· ط®ط§ط±ط¬ظٹ ظپظٹ ط§ظ„ط¨ط±ظˆ ظ…ط¨طھ
const AI_SYSTEM_PROMPT = `ط£ظ† طھ ظ…ط³ط§ط¹ط¯ ط°ظƒط§ط، ط§طµط·ظ†ط§ط¹ظٹ ظ…طھط®طµطµ ظپظٹ ط¥ط¯ط§ط±ط© ظ…طھط¬ط± "ظ…طھط¬ط± ط§ظ„ظ…ط±ظˆ ط§ظ† " ط¹ظ„ظ‰ طھظٹظ„ظٹط¬ط±ط§ظ….
ط§ظ„ط¨ظˆطھ ظٹط¨ظٹط¹ ظ…ظ†طھط¬ط§طھ ط±ظ‚ظ…ظٹط© ط¨ط´ظƒظ„ ط¢ظ„ظٹ.
ط£ط¬ط¨ ط¯ط§ط¦ظ…ط§ظ‹ ط¨ط§ظ„ط¹ط±ط¨ظٹط©. ظƒظ†  ط¯ظ‚ظٹظ‚ط§ظ‹ ظˆ ط¹ظ…ظ„ظٹط§ظ‹. ظ„ط§ طھط°ظƒط± ط£ط³ظ…ط§ط، ظ…ظˆ ط§ظ‚ط¹ ط£ظˆ  ط±ظˆ ط§ط¨ط· ط®ط§ط±ط¬ظٹط©.`;

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
  if (m.includes("ط±طµظٹط¯")) return "ًں’° ظ„ظ…ط¹ط±ظپط© ط±طµظٹط¯ظƒ ط§ط³طھط®ط¯ظ… ط²ط± *ط±طµظٹط¯ظٹ* ظپظٹ ط§ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط±ط¦ظٹط³ظٹط©.";
  if (m.includes("ط¥ظٹط¯ط§ط¹") || m.includes("ط´ط­ط¸أ¢â‚¬ ")) return "ًں’³ ظ„ط´ط­ط¸أ¢â‚¬  ط±طµظٹط¯ظƒ ط§ط¶ط؛ط· ط²ط± *ط¥ظٹط¯ط§ط¹* ظپظٹ ط§ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط±ط¦ظٹط³ظٹط©.";
  if (m.includes("ط·ظ„ط¨")) return "ًں“¦ ظ„ظ…طھط§ط¨ط¹ط© ط·ظ„ط¨ط§طھظƒ ط§ط¶ط؛ط· ط²ط± *ط·ظ„ط¨ط§طھظٹ* ظپظٹ ط§ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط±ط¦ظٹط³ظٹط©.";
  if (m.includes("ط³ط¹ط±")) return "ًں’± ظ„طھط¹ط¯ظٹظ„ ط³ط¹ط± ط§ظ„طµط±ظپ: ط§ط°ظ‡ط¨ ط¥ظ„ظ‰ ط§ظ„ط¥ط¯ط§ط±ط© أ¢أ¢â‚¬ ع¯ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ أ¢أ¢â‚¬ ع¯ طھط¹ط¯ظٹظ„ ط³ط¹ط± ط§ظ„طµط±ظپ.";
  if (m.includes("ط±ط¨ط­")) return "ًں“ˆ ظ„طھط¹ط¯ظٹظ„ ط¸أ¢â‚¬ ط³ط¨ط© ط§ظ„ط±ط¨ط­: ط§ط°ظ‡ط¨ ط¥ظ„ظ‰ ط§ظ„ط¥ط¯ط§ط±ط© أ¢أ¢â‚¬ ع¯ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ أ¢أ¢â‚¬ ع¯ طھط¹ط¯ظٹظ„ ط§ظ„ط±ط¨ط­ ط§ظ„ط¹ط§ظ….";
  if (m.includes("ط±طμظٹط¯") || m.includes("balance")) return "ًں'° ظ„ظ…ط¹ط±ظپط© ط±طμظٹط¯ظƒ ط§ط³طھط®ط¯ظ… ط²ط± *ط±طμظٹط¯ظٹ* ظپظٹ ط§ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط±ط¦ظٹط³ظٹط©.”;
  إذا (m.includes("ط¥ظٹط¯ط§ط¹") || m.includes("ط´طظ† ") || m.includes("deposit")) return "ًں'³ ظ„ط´طظ† ط±طظٹط¯ظƒ ط§ط¶ط;ط· ط²ط± *ط¥ظٹط¯ط§ط¹* ظپظٹ ط§ظ‹ظ‚ط§ط¦ظ…ط© ط§ظ‹ط±ط¦ظٹط³ظٹط©.”;
  إذا (m.includes("ط·ظ„ط¨") || m.includes("order")) return "ًں"¦ ظظ…طھط§ط¨ط¹ط© ط·ظ„ط¨ط§طھظƒ ط§ط¶ط;ط· ط²ط± *ط·ظ„ط¨ط§طھظٹ* ظپظٹ ط§ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط±ط¦ظٹط³ظٹط©.”;
  if (m.includes("ط³ط¹ط±") || m.includes("price")) return "ًں'± *طھط¹ط¯ظٹظ„ ط³ط¹ط± ط§ظ„طμط±ظپ:*\nط§ظ„ط¥ط¯ط§ط±ط© أ¢أ¢أ¢â€ڑآ¬ ™أ¢a‚¬آ¯ظٹظ„ ط³ط¹ط± ط§ظ„طوطط±ظپ”;
  إذا (m.includes("ط±ط¨ط") || m.includes("markup")) return "ًں"ˆ *ظ†ط³ط¨ط© ط§ظ„ط±ط¨ط:*\nط§ظ„ط¥ط¯ط§ط±ط© أ¢أ¢أ¢â€ڑآ¬ أ¢أ¢â€ڑآ¬أ¢â€‍آ âڑ™ï¸ڈ ط§ظ‹ط¥ط¹ط¯ط§ط¯ط§طھ ™أ¢a¯ظٹظ‹ ط§ظ‹ط±ط¨ط ط§ظ‹ط¹ط§ظ…”;
  return "ًں“‍ ظ„ظ…ط³ط§ط¹ط¯ط© طھظˆ ط§طμظ„ ظ…ط¹ ط§ظ„ط¯ط¹ظ… ط¹ط¨ط± ط²ط± *ط§ظ„ط¯ط¹ظ…* ظپظٹ ط§ظ„ظ‚ط§ط¦ظ…ط©..";
}

// استبدل تطبيق الأسئلة الشائعة القديم بنص UTF-8 نظيف ومطابق
// ضد مدخلات المستخدم التي تم إصلاحها.
دالة بناء الأسئلة الشائعة الذكية (الرسالة) {
  const m = repairArabicEncoding(msg).toLowerCase();
  if (m.includes("ط±طμظٹط¯") || m.includes("balance")) return "ًں'° ظ„ظ…ط¹ط±ظپط© ط±طμظٹط¯ظƒ ط§ط³طھط®ط¯ظ… ط²ط± آ«ط±طμظٹط¯ظٹآ» ظپظٹ ط§ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط±ط¦ظٹط³ظٹط©.”;
  إذا (m.includes("ط¥ظٹط¯ط§ط¹") || m.includes("ط´طظ†") || m.includes("deposit")) return "ًں'³ ظ„ط´طظ† ط±طظٹط¯ظƒ ط§ط¶ط;ط· ط²ط± آ«ط¥ظٹط¯ط§ع» ظپظٹ ط§ظ‹ظ‚ط§ط¦ظ…ط© ط§ظ‹ط±ط¦ظٹط³ظٹط©.”;
  if (m.includes("ط·ظ„ط¨") || m.includes("order")) return "ًں"¦ ظظ…طھط§ط¨ط¹ط© ط·ظ„ط¨ط§طھظƒ ط§ط¶ط;ط· ط²ط± ط¨ط§طھظٹآ» ظپظٹ ط§ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط±ط¦ظٹط³ظٹط©.”;
  إذا (m.includes("ط³ط¹ط±") || m.includes("price")) return "ظ‹ع؛’آ² ظ„طھط¹ط¯ظٹظ„ ط³ط¹ط± ط§ظ„طμط±ظپ ط§ط°ظ‡ط¨ ط¥ظ„ظ‰ ط§ظ„ط¥ط¯ط§ط±ط© أ¢â€ ع¯ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ أâ€ ع¯ طھط¹ط¯ظٹظ„ ط³ط¹ط± ط§ظ„طμط±ظپ..";
  إذا (m.includes("ط±ط¨ط") || m.includes("markup")) return "ًں"ˆ ظ„طھط¹ط¯ظٹظ„ ظ†ط³ط¨ط© ط§ظ„ط±ط¨ط ط§ط°ظ‡ط¨ ط¥ظ„ظ‰ ط§ظ„ط¥ط¯ط§ط±ط© أ¢â€ ع¯ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ أâ€ ع¯ طھط¹ط¯ظٹظ‹ ط§ظ‹ط±ط¨ط ط§ظ‹ط¹ط§ظ….”;
  return "ًں'¬ ظظ… ط £ط¬ط¯ ط¥ط¬ط§ط¨ط© ظ…طط¯ط¯ط©. طھظˆط§طμظ„ ظ…ط¹ ط§ظ„ط¥ط¯ط§ط±ط© ط¹ط¨ط± ط²ط± د«ط§ظ„ط¯ط¹ظ…آ» ظپظٹ ط§ظ„ظ‚ط§ط¦ظ…ط©.”;
}

// ============================================================
// ذاكرة التخزين المؤقت للمنتج
// ============================================================
المنتجات الثابتة_TTL = 2 * 60_000؛ // ط§ظ„ظƒط§ط´ ط³ط±ظٹط¹ ظ…ط¹ ط¨ظ‚ط§ط، ط§ظ„ط§ط³طھط¬ط§ط¨ط© ظپظˆ ط±ظٹط©
const CONTENT_TTL = 2 * 60_000;
const OVERRIDES_TTL = 10 * 60_000; // ظƒط§ط´ 10 ط¯ظ‚ط§ط¦ظ‚
const PAGE_SIZE = 8;

let productsCache = null;
const contentCache = new Map();
let allOverridesCache = null;

// in-flight deduplication: ظ„ط§ طھظڈط±ط³ظ„ ط·ظ„ط¨ط§طھ ظ…طھط¹ط¯ط¯ط© ظ„ظ† ظپط³ ط§ظ„ط¨ظٹط§ظ†ط§طھ ظپظٹ ظ† ظپط³ ط§ظ„ظˆظ‚طھ
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
    // ط¹ظ† ط¯ طھط¹ط·ظ„ API ظ† ط³طھط®ط¯ظ… ط¢ط®ط± ط¨ظٹط§ظ†ط§طھ ظ…ط­ظ„ظٹط© ط¨ط¯ظ„ط§ظ‹ ظ…ظ†  طھط¹ظ„ظٹظ‚ ظ„ظˆ ط­ط© ط§ظ„ظ…ط³طھط®ط¯ظ….
    const content = await fetchContent(parentId).catch(() => cached?.content ?? buildFallbackContent(parentId));
    const sources = await listApiSources(false);
    const extraSources = sources.filter(s => !s.is_primary && parentId === 0);
    if (extraSources.length) {
      const extraRootIds = new Set(extraSources.map(s => sourceRootCategoryId(s.id)));
      content.categories = [
        ...(content.categories || []).filter(c => !extraRootIds.has(Number(c.id))),
        // ظƒظ„ API ط¥ط¶ط§ظپظٹ ظٹط¸ظ†طŒط± ط¨ط§ط³ظ…ظ†طŒ ط§ظ„ط°ظٹ ط­ط¯ط¯ظ†طŒ ط§ظ„ظ…ط¯ظٹط±طŒ ظˆ ظ„ظٹط³ ط¨ط§ط³ظ… طھظ‚ظ† ظٹ ظ…ط«ظ„ "ظ…ظ†طھط¬ط§طھ API".
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
    // ظ…ط²ط§ظ…ظ† ط© ظ‚ط§ط¹ط¯ط© ط§ظ„ظ…ظ†طھط¬ط§طھ ط¨ط§ظ„ط®ظ„ظپظٹط©طŒ ظˆ طھط¨ظ‚ظ‰ ط§ظ„ط§ط³طھط¬ط§ط¨ط© ظ…ظ†  ط§ظ„ظƒط§ط´/ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ظپظˆ ط±ظٹط©
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

// أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ ط¨ظ† ط§ط، ظ…ط¬ظ…ظˆ ط¹ط© IDs ط§ظ„ط£ظ‚ط³ط§ظ… ط§ظ„طھظٹ طھط­طھظˆ ظٹ ظ…ظ†طھط¬ط§طھ ط¸ط§ظ†طŒط±ط© أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
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

const BOT_MAINTENANCE_MSG = "ًں”§ ط§ظ„ط¨ظˆطھ ظ‚ظٹط¯ ط§ظ„طµظٹط§ظ† ط© ط­ط§ظ„ظٹط§ظ‹.\nط³ظٹط¹ظˆ ط¯ ظ„ظ„ط¹ظ…ظ„ ط¨ط£ظ‚ط±ط¨ ظˆظ‚طھ ظ…ظ…ظƒظ† . ظ† ط´ظƒط± طµط¨ط±ظƒظ…! ًں™ڈ";
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME ?? "admin").split(",")[0].trim();

// ============================================================
//  STEP STATE (per user)
// ============================================================
const stepMap = new Map();
function getStep(uid) { return stepMap.get(uid) ?? { kind: "idle" }; }
function setStep(uid, s) { stepMap.set(uid, s); }

let _botRef = null;
const authedAdminIds = new Set();

// أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ ط­ط§ظ„ط© ط§ظ„طھظ†ظ‚ظ„: userId أ¢أ¢أ¢â€ڑآ¬ أ¢أ¢â€ڑآ¬أ¢â€‍آ¢ Map<catId, page> أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
const navState = new Map();
function saveNavPage(uid, catId, page) {
  if (!navState.has(uid)) navState.set(uid, new Map());
  navState.get(uid).set(catId, page);
}
function getNavPage(uid, catId) { return navState.get(uid)?.get(catId) ?? 1; }

// أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ ط¥ط´ط¹ط§ط±ط§طھ ط§ظ„ط¥ظٹط¯ط§ط¹ أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
const depositNotifications = new Map();
async function clearDepositForOtherAdmins(processorId, depId, statusText) {
  const list = depositNotifications.get(depId) ?? [];
  depositNotifications.delete(depId);
  for (const n of list) {
    if (n.adminId === processorId) continue;
    try {
      await _botRef?.telegram.editMessageCaption(n.adminId, n.messageId, undefined,
        `${statusText}\n(طھظ…طھ ط§ظ„ظ…ط¹ط§ظ„ط¬ط© ط¨ظˆ ط§ط³ط·ط© ظ…ط¯ظٹط± ط¢ط®ط±)`);
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

// أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ ظ„ظˆ ط­ط© ط§ظ„ط¥ط¯ط§ط±ط© ظ…ط®ظپظٹط© - ظ„ط§ طھط¸ظ†طŒط± ظپظٹ ط§ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط±ط¦ظٹط³ظٹط© أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
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
  if (user.status === "banned") { await sendOrEdit(ctx, "ًںڑ« طھظ… ط­ط¸ط±ظƒ ظ…ظ†  ط§ط³طھط®ط¯ط§ظ… ط§ظ„ط¨ظˆطھ."); return; }
  const [status, rate, adminSessionActive] = await Promise.all([
    getBotStatus(),
    getExchangeRate(),
    isAdminSessionActive(user.id),
  ]);
  if (status === "off" && !authedAdminIds.has(user.id) && !adminSessionActive) {
    await sendOrEdit(ctx, "ًں”§ ط§ظ„ط¨ظˆطھ ظ‚ظٹط¯ ط§ظ„طµظٹط§ظ† ط©. ط³ظٹط¹ظˆ ط¯ ظ„ظ„ط¹ظ…ظ„ ط¨ط£ظ‚ط±ط¨ ظˆظ‚طھ ظ…ظ…ظƒظ† . ظ† ط´ظƒط± طµط¨ط±ظƒظ…! ًں™ڈ");
    return;
  }
  const greeting = `ط£ظ†طŒظ„ط§ظ‹ ظپظٹظƒ ظپظٹ ظ…طھط¬ط± ط§ظ„ظ…ط±ظˆ ط§ظ†  ًںŒں\nط§ظ„ط§ط³ظ…: ${user.first_name ?? "â€”"}${user.username ? ` (@${user.username})` : ""}\nط§ظ„ط±ظ‚ظ…: ${user.id}\nط§ظ„ط±طµظٹط¯: ${formatBalance(Number(user.balance), rate)}\n\nط§ط®طھط± ظ…ظ†  ط§ظ„ظ‚ط§ط¦ظ…ط© ًں‘‡`;
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
    await ctx.reply(`ًں“‍ ظ„ظ„ط¯ط¹ظ…: @${ADMIN_USERNAME}`, Markup.inlineKeyboard([[Markup.button.callback("ًںڈ   ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]]));
    return;
  }
  const rows = links.map(l => [Markup.button.url(l.name, l.link.startsWith("http") ? l.link : `https://t.me/${l.link.replace(/^@/, "")}`)]);
  rows.push([Markup.button.callback("ًںڈ   ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]);
  await ctx.reply("ًں“‍ ظˆط³ط§ط¦ظ„ ط§ظ„طھظˆط§طµظ„:", Markup.inlineKeyboard(rows));
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
    await sendOrEdit(ctx, "â‌Œ ظ„ط§ طھظˆط¬ط¯ ط·ط±ظ‚ ط¥ظٹط¯ط§ط¹ ظ…طھط§ط­ط© ط­ط§ظ„ظٹط§ظ‹.", Markup.inlineKeyboard([[Markup.button.callback("ًںڈ   ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]]));
    return;
  }
  const rows = methods.map(m => [Markup.button.callback(`ًں’³ ${m.name}`, `dep:method:${m.id}`)]);
  rows.push([Markup.button.callback("ًںڈ   ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]);
  await sendOrEdit(ctx, "ًں’³ ط§ط®طھط± ط·ط±ظٹظ‚ط© ط§ظ„ط¥ظٹط¯ط§ط¹:", Markup.inlineKeyboard(rows));
}

async function showDepositMethod(ctx, methodId) {
  const res = await q("SELECT * FROM deposit_methods WHERE id=$1 AND active=true", [methodId]);
  const m = res.rows[0];
  if (!m) { await ctx.reply("âڑ ï¸ڈ ط§ظ„ط·ط±ظٹظ‚ط© ط؛ظٹط± ظ…طھط§ط­ط©."); return; }
  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ طھط¯ظپظ‚ ط§ظ„ط¥ظٹط¯ط§ط¹: ظ† ط·ظ„ط¨ ط§ظ„ظ…ط¨ظ„ط؛ ط£ظˆ ظ„ط§ظ‹طŒ ط«ظ… ط§ظ„طµظˆط±ط© أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
  setStep(ctx.from.id, { kind: "deposit:info", methodId: m.id, methodName: m.name, amount: null, photoFileId: null });
  const kb = Markup.inlineKeyboard([[Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "deposit"), Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "dep:cancel")]]);
  const infoText = `ًں’³ ${m.name}\nًں”‘ ط§ظ„ط±ظ‚ظ…: \`${m.identifier}\`\n\nًں“‹ ط§ظ„طھط¹ظ„ظٹظ…ط§طھ:\n${m.instructions}\n\nًں“¸ ط£ط±ط³ظ„ ط§ظ„ظ…ط¨ظ„ط؛ ظˆ طµظˆ ط±ط© ط¥ط´ط¹ط§ط± ط§ظ„طھط­ظˆ ظٹظ„ (ظٹظ…ظƒظ† ظƒ ط¥ط±ط³ط§ظ„ظ†طŒظ…ط§ ط¨ط£ظٹ طھط±طھظٹط¨).`;
  if (m.image_file_id) {
    await ctx.replyWithPhoto(m.image_file_id, { caption: infoText, parse_mode: "Markdown", ...kb });
  } else {
    await ctx.reply(infoText, { parse_mode: "Markdown", ...kb });
  }
}

// أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ ط¥ظƒظ…ط§ظ„ ط·ظ„ط¨ ط§ظ„ط¥ظٹط¯ط§ط¹ ط¨ط¹ط¯ ط§ط³طھظ„ط§ظ… ط§ظ„ظ…ط¨ظ„ط؛ ظˆ ط§ظ„طµظˆط±ط© أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
async function completeDepositRequest(ctx, step) {
  const res = await q(
    "INSERT INTO deposit_requests(user_id,method_id,method_name,amount,screenshot_file_id) VALUES($1,$2,$3,$4,$5) RETURNING *",
    [ctx.from.id, step.methodId, step.methodName, step.amount != null ? String(step.amount) : null, step.photoFileId]
  );
  const dep = res.rows[0];
  setStep(ctx.from.id, { kind: "idle" });
  await ctx.reply("ط³ظٹطھظ… ظ…ط±ط§ط¬ط¹ط© ط·ظ„ط¨ظƒ ظپظٹ ط£ظ‚ط±ط¨ ظˆظ‚طھ ظ…ظ…ظƒظ† .", Markup.inlineKeyboard([[Markup.button.callback("ًںڈ   ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]]));
  // ظ„ط§ ظ† ط¤ط®ط± ط±ط¯ ط§ظ„ظ…ط³طھط®ط¯ظ… ط¨ط³ط¨ط¨ ط¥ط±ط³ط§ظ„ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ظ„ط¹ط¯ط© ظ…ط¯ط±ط§ط،.
  void notifyAdminsDeposit(ctx, dep).catch(err => console.error("deposit notification failed:", err?.message ?? err));
}

async function notifyAdminsDeposit(ctx, depositRow) {
  const user = await getUser(ctx.from.id);
  const amountStr = depositRow.amount ? `${Number(depositRow.amount).toFixed(2)}$` : "â€”";
  const text = `ًں“¥ ط·ظ„ط¨ ط¥ظٹط¯ط§ط¹ ط¬ط¯ظٹط¯\nًں‘¤ ${user?.first_name ?? "â€”"}${user?.username ? " @" + user.username : ""} (${ctx.from.id})\nًں’³ ${depositRow.method_name}\nًں’µ ط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ظ…ظڈط­ظˆ ظژظ‘ظ„: ${amountStr}`;
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

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ طھط´ط؛ظٹظ„ ط¬ظ…ظٹط¹ ط§ظ„ط§ط³طھط¹ظ„ط§ظ…ط§طھ ط§ظ„ظ…ط³طھظ‚ظ„ط© ط¨ط§ظ„طھظˆ ط§ط²ظٹ أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
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

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ ط¥طµظ„ط§ط­ ط§ظ„ط£ط¯ط§ط،: ط§ط³طھط®ط±ط¬ ظ…ط¬ظ…ظˆ ط¹ط© ط§ظ„ط£ظ‚ط³ط§ظ… ط§ظ„ط¸ط§ظ†طŒط±ط© ظ…ط±ط© ظˆ ط§ط­ط¯ط© ط®ط§ط±ط¬ ط§ظ„ط­ظ„ظ‚ط© أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
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
  const vcBtns = vcRows.map(v => Markup.button.callback(`${v.active ? "ًں“‚ " : "ًں”’ "}${v.name}`.slice(0, 60), `vcat:${v.id}:1:${parentId}`));

  const manualBtns = mpRes.rows.map(m => {
    const usd = Number(m.price_usd); const syp = Math.round(usd * rate);
    return Markup.button.callback(`ًں›’ ${m.name} â€¢ ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ظ„.ط³`.slice(0, 60), `mprod:${m.id}:${parentId}`);
  });

  const manualCatalogExists = !!manualCatalogRes.rows[0]?.exists;
  if (!visibleCats.length && !visibleProds.length && !vcBtns.length && !manualBtns.length &&
      !(parentId === 0 && manualCatalogExists)) {
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
  const manualCatalogBtns = parentId === 0 && manualCatalogExists
    ? [Markup.button.callback("ًں›چï¸ڈ ط§ظ„ظ…ظ†طھط¬ط§طھ ط§ظ„ظٹط¯ظˆظٹط©", "mcat:0:1:0")]
    : [];

  const catBtns = [
    ...manualCatalogBtns,
    ...vcBtns,
    ...visibleCats.map(c => {
      const ov = catOv.get(c.id);
      const label = ov?.customName ?? c.name;
      return Markup.button.callback(`${ov?.hidden ? "ًں”’ " : "ًں“‚ "}${label}`.slice(0, 60), `cat:${c.id}:1:${parentId}`);
    }),
  ];

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ طھط·ط¨ظٹظ‚ markup ط§ظ„ظ…ط³طھط®ط¯ظ… ط§ظ„ط®ط§طµ ظپظٹ ط£ط³ط¹ط§ط± ظ‚ط§ط¦ظ…ط© ط§ظ„ظ…ظ†طھط¬ط§طھ أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
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

  const title = parentId === 0 ? "ًں›’ ط§ظ„ط£ظ‚ط³ط§ظ… ط§ظ„ط±ط¦ظٹط³ظٹط©" : `ًں“‚ ${catOv.get(parentId)?.customName ?? "ظ…ط­طھظˆ ظٹط§طھ ط§ظ„ظ‚ط³ظ…"}`;
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
  const quantityMode = parseQtyValues(p.qty_values, p);

  let qtyInfo = "";
  if (quantityMode.kind === "fixed") {
    qtyInfo = "ط§ظ„ظƒظ…ظٹط©: 1 (ط«ط§ط¨طھظ…ط©)";
  } else if (quantityMode.kind === "list") {
    qtyInfo = `ط§ظ„ظƒظ…ظٹط§طھ ط§ظ„ظ…طھط§ط­ط©: ${quantityMode.values.join(", ")}`;
  } else if (Number.isFinite(quantityMode.min) && Number.isFinite(quantityMode.max)) {
    qtyInfo = `ط§ظ„ظƒظ…ظٹط© ط¨ظٹظ†  ${quantityMode.min} ظˆ  ${quantityMode.max}`;
  } else if (isSocial) {
    const [min, max] = await Promise.all([getSocialMinQty(), getSocialMaxQty()]);
    qtyInfo = `ط§ظ„ظƒظ…ظٹط© ط¨ظٹظ†  ${min.toLocaleString("en-US")} ظˆ  ${max.toLocaleString("en-US")}`;
  }

  const displayName = ov?.customName ?? p.name;
  const instructions = ov?.instructions?.trim() || getProductApiNotes(p);
  const sourceInfo = isAdmin && p.source_id ? `\nAPI: #${p.source_id}` : "";
  const text = `ًں›’ ${displayName}\n${p.category_name ? `ط§ظ„ظ‚ط³ظ…: ${p.category_name}\n` : ""}ط§ظ„ط³ط¹ط±: ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ظ„.ط³\n${qtyInfo}${sourceInfo}${instructions ? `\n\nًں“‹ طھط¹ظ„ظٹظ…ط§طھ:\n${instructions}` : ""}`;

  const backBtnResolved = await resolveBackBtn(backTo);
  const btns = [];
  if (p.available || isAdmin) btns.push([Markup.button.callback("ًں›’ ط·ظ„ط¨ ط§ظ„ط¢ظ† ", `buy:${p.id}:${backTo}`)]);
  if (isAdmin) {
    btns.push([Markup.button.callback("âœڈï¸ڈ طھط¹ط¯ظٹظ„ ط§ظ„ط³ط¹ط±", `adm:editPrice:${p.id}`), Markup.button.callback("ًں“‹ طھط¹ظ„ظٹظ…ط§طھ", `adm:editInstr:${p.id}`)]);
    btns.push([Markup.button.callback("ًں“‌ طھط¹ط¯ظٹظ„ ط§ظ„ط§ط³ظ…", `adm:renameProd:${p.id}`), Markup.button.callback("ًںڑڑ ظ†ظ‚ظ„ ظ„ظ‚ط³ظ… ط¢ط®ط±", `adm:moveProd:${p.id}`)]);
    btns.push([Markup.button.callback(ov?.hidden ? "ًں‘پ ط¥ط¸ظ‡ط§ط±" : "ًں™ˆ ط¥ط®ظپط§ط،", `adm:hideProd:${p.id}`)]);
    btns.push([Markup.button.callback("ًں—‘ï¸ڈ ط­ط°ظپ ط§ظ„ظ…ظ†طھط¬ ظ†ظ‡ط§ط¦ظٹط§ظ‹", `adm:deleteProdAsk:${p.id}`)]);
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
    Markup.button.callback(`${c.active ? "ًں“‚" : "ًں”’"} ${c.name}`.slice(0, 60), `mcat:${c.id}:1:${categoryId}`)
  );
  const productBtns = products.map(m => {
    const usd = Number(m.price_usd);
    const syp = Math.round(usd * rate);
    return Markup.button.callback(`ًں›’ ${m.name} â€¢ ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ظ„.ط³`.slice(0, 60), `mprod:${m.id}:${categoryId}`);
  });
  const all = [...categoryBtns, ...productBtns];
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const safe = Math.min(Math.max(1, page), totalPages);
  saveNavPage(ctx.from.id, `manual:${categoryId}`, safe);
  const slice = all.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE);

  const rows = [];
  if (isAdmin) {
    if (isRoot) {
      rows.push([Markup.button.callback("âڑ™ï¸ڈ ط¥ط¯ط§ط±ط© ط£ظ‚ط³ط§ظ… ط§ظ„ظ…ظ†طھط¬ط§طھ ط§ظ„ظٹط¯ظˆظٹط©", "adm:manualCats")]);
      rows.push([Markup.button.callback("â‍• ط¥ط¶ط§ظپط© ظ…ظ†طھط¬ ط¹ط§ظ…", "adm:addManual")]);
    } else {
      rows.push([
        Markup.button.callback("âœڈï¸ڈ طھط¹ط¯ظٹظ„ ط§ظ„ط§ط³ظ…", `adm:mcatEdit:${categoryId}`),
        Markup.button.callback(categories.length ? "ًں“‚ ط¥ط¯ط§ط±ط© ط§ظ„ظپط±ط¹ظٹط©" : "â‍• ظ‚ط³ظ… ظپط±ط¹ظٹ", `adm:manualCats:${categoryId}`),
      ]);
      rows.push([
        Markup.button.callback("â‍• ط¥ط¶ط§ظپط© ظ…ظ†طھط¬ ظ‡ظ†ط§", `adm:addManualInCat:${categoryId}`),
        Markup.button.callback(currentCategory?.active ? "ًں”´ طھط¹ط·ظٹظ„ ط§ظ„ظ‚ط³ظ…" : "ًںں¢ طھظپط¹ظٹظ„ ط§ظ„ظ‚ط³ظ…", `adm:mcatToggle:${categoryId}`),
      ]);
      rows.push([
        Markup.button.callback("ًںڑڑ ط¥ط®ط±ط§ط¬ ظƒظ„ ط§ظ„ظ…ظ†طھط¬ط§طھ", `adm:mcatMoveAll:${categoryId}`),
        Markup.button.callback("ًں—‘ï¸ڈ ط­ط°ظپ ط§ظ„ظ‚ط³ظ…", `adm:mcatDel:${categoryId}`),
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
  const title = isRoot ? "ًں›چï¸ڈ ط§ظ„ظ…ظ†طھط¬ط§طھ ط§ظ„ظٹط¯ظˆظٹط©" : `ًں“‚ ${currentCategory?.name ?? "ظ‚ط³ظ… ظٹط¯ظˆظٹ"}`;
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
  if (!vc || (!vc.active && !isAdmin)) { await sendOrEdit(ctx, "âڑ ï¸ڈ ظ‡ط°ط§ ط§ظ„ظ‚ط³ظ… ط؛ظٹط± ظ…طھط§ط­.", Markup.inlineKeyboard([[Markup.button.callback("ًںڈ   ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]])); return; }
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
    return Markup.button.callback(`ًں›’ ${m.name} â€¢ ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ظ„.ط³`.slice(0, 60), `mprod:${m.id}:${vcId}`);
  });

  if (!visible.length && !subVcBtns.length && !manualBtnsVc.length && !isAdmin) { await sendOrEdit(ctx, "ًں“­ ظ‡ط°ط§ ط§ظ„ظ‚ط³ظ… ظپط§ط±ط؛ ط­ط§ظ„ظٹط§ظ‹.", Markup.inlineKeyboard([[backBtn, Markup.button.callback(homeLabel, "home")]])); return; }

  const ovMap = await loadOverrideMap(visible.map(p => p.id));
  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ طھط·ط¨ظٹظ‚ markup ط§ظ„ظ…ط³طھط®ط¯ظ… ط§ظ„ط®ط§طµ أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
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
    rows.push([Markup.button.callback("â‍• ظ‚ط³ظ… ظپط±ط¹ظٹ", `adm:addVCatSub:${vcId}`), Markup.button.callback("ًںڑڑ ط¥ط®ط±ط§ط¬ ط§ظ„ظ…ظ†طھط¬ط§طھ", `adm:vcMoveAll:${vcId}`)]);
    rows.push([Markup.button.callback("ًں—‘ï¸ڈ ط­ط°ظپ ط§ظ„ظ‚ط³ظ…", `adm:vcDel:${vcId}`)]);
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
    const parentIsManualCat = (await q("SELECT id FROM manual_categories WHERE id=$1", [backTo])).rows[0];
    backBtn = parentIsManualCat
      ? Markup.button.callback(backLabel, `mcat:${backTo}:${getNavPage(ctx.from.id, `manual:${backTo}`)}:0`)
      : Markup.button.callback(backLabel, `cat:${backTo}:1:0`);
  }
  const mRes = await q("SELECT * FROM manual_products WHERE id=$1", [mId]);
  const m = mRes.rows[0];
  const [u, sessionActive] = await Promise.all([getUser(ctx.from.id), isAdminSessionActive(ctx.from.id)]);
  const isAdmin = !!u?.is_admin && (authedAdminIds.has(ctx.from.id) || sessionActive);
  if (!m || (!m.active && !isAdmin)) { await sendOrEdit(ctx, "âڑ ï¸ڈ ط§ظ„ظ…ظ†طھط¬ ط؛ظٹط± ظ…طھط§ط­.", Markup.inlineKeyboard([[backBtn, Markup.button.callback(homeLabel, "home")]])); return; }
  const rate = await getExchangeRate();
  const usd = Number(m.price_usd); const syp = Math.round(usd * rate);
  const balance = u ? Number(u.balance) : 0;
  const canAfford = balance >= usd;
  const text = `ًں›’ ${m.name}\nط§ظ„ط³ط¹ط±: ${usd.toFixed(2)}$ | ${syp.toLocaleString("en-US")} ظ„.ط³\nط§ظ„ط±طµظٹط¯: ${formatBalance(balance, rate)}${m.instructions ? `\n\nًں“‹ ${m.instructions}` : ""}`;
  const rows = [];
  if (m.active && canAfford) rows.push([Markup.button.callback("ًں›’ ط·ظ„ط¨ ط§ظ„ط¢ظ† ", `mbuy:${m.id}`)]);
  else if (m.active && !canAfford) rows.push([Markup.button.callback("ًں’³ ط´ط­ظ† ط±طµظٹط¯", "deposit")]);
  if (isAdmin) rows.push([Markup.button.callback("ًں—‘ï¸ڈ ط­ط°ظپ ط§ظ„ظ…ظ†طھط¬ ظ†ظ‡ط§ط¦ظٹط§ظ‹", `adm:deleteManualProdAsk:${m.id}`)]);
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
      if (!ACCEPT_STATUSES.has(raw.toLowerCase())) parts.push(`ًں“ٹ ط§ظ„ط­ط§ظ„ط©: ${label}`);
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
  if (ACCEPT_STATUSES.has(n) || n === "1" || n === "true") return "âœ… ظ…ظ‚ط¨ظˆظ„";
  if (REJECT_STATUSES.has(n) || n === "0" || n === "false") return "â‌Œ ظ…ط±ظپظˆ ط¶";
  return "âڈ³ ط§ظ† طھط¸ط§ط±";
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
  if (!p) { all = await getCachedProducts(); p = all.find(x => x.id === productId); }
  if (!p) { await ctx.reply("âڑ ï¸ڈ ط§ظ„ظ…ظ†طھط¬ ط؛ظٹط± ظ…ظˆط¬ظˆط¯."); return; }
  if (!p.available) { await ctx.reply("âڑ ï¸ڈ ظ‡ط°ط§ ط§ظ„ظ…ظ†طھط¬ ط؛ظٹط± ظ…طھط§ط­ ط­ط§ظ„ظٹط§ظ‹."); return; }

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ طھظ†ظپظٹط° ظ…ظˆ ط§ط²ط¸ط¹أ¢â‚¬  ظ„طھط³ط±ظٹط¹ ط§ظ„ط§ط³طھط¬ط§ط¨ط© أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
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
      rows.push([Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "ord:cancel")]);
      await sendOrEdit(ctx, `ًں›’ ${p.name}\n\nط§ط®طھط± ط§ظ„ظƒظ…ظٹط©:`, Markup.inlineKeyboard(rows)); return;
    }
    let min, max;
    if (parsedSocial.kind === "range" && Number.isFinite(parsedSocial.min) && parsedSocial.min > 0)
      { min = parsedSocial.min; max = parsedSocial.max; }
    else { min = await getSocialMinQty(); max = await getSocialMaxQty(); }
    setStep(ctx.from.id, { kind: "order:qty", productId: p.id, productName: p.name, priceUsd: unitPriceUsd, paramKeys, qtyValues: { min, max }, backTo });
    await sendOrEdit(ctx, `ًں›’ ${p.name}\n\nط£ط±ط³ظ„ ط§ظ„ظƒظ…ظٹط© (ط¨ظٹظ†  ${min.toLocaleString("en-US")} ظˆ  ${max.toLocaleString("en-US")}):`, Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "ord:cancel")]])); return;
  }

  const parsed = quantityMode;
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
  await sendOrEdit(ctx, `ًں›’ ${p.name}\nط£ط±ط³ظ„ ط§ظ„ظƒظ…ظٹط© (ط¨ظٹظ†  ${parsed.min} ظˆ  ${parsed.max}):`, Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "ord:cancel")]]));
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
  const text = `ًں§¾ طھط£ظƒظٹط¯ ط§ظ„ط·ظ„ط¨\n\nًں›’ ط§ظ„ظ…ظ†طھط¬: ${p.name}\nًں”¢ ط§ظ„ظƒظ…ظٹط©: ${qty.toLocaleString("en-US")}\n${paramsLines ? paramsLines + "\n" : ""}ًں’° ط§ظ„ط¥ط¬ظ…ط§ظ„ظٹ: ${totalUsdStr}$ | ${totalSyp.toLocaleString("en-US")} ظ„.ط³\nًں’³ ط±طµظٹط¯ظƒ: ${formatBalance(balance, rate)}\n\n${lowBalance ? "â‌Œ ظ„ظٹط³ ظ„ط¯ظٹظƒ ط±طµظٹط¯ ظƒط§ظپظٹ. ظٹط±ط¬ظ‰ ط´ط­ظ† ط±طµظٹط¯ظƒ ط«ظ… ط§ظ„ظ…ط­ط§ظˆ ظ„ط© ظ…ط¬ط¯ط¯ط§ظ‹." : "ظ†طŒظ„ طھط±ظٹط¯ طھط£ظƒظٹط¯ ط§ظ„ط·ظ„ط¨طں"}`;
  const rows = lowBalance
    ? [[Markup.button.callback("ًں’³ ط´ط­ظ† ط±طµظٹط¯", "deposit")], [Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "ord:cancel")]]
    : [[Markup.button.callback("âœ… طھط£ظƒظٹط¯ ظˆ طھظ†ظپظٹط°", "ord:confirm"), Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "ord:cancel")]];
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
    await ctx.answerCbQuery("âڈ³ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„طھظ†ظپظٹط°...").catch(() => {});
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
  if (!p) { await ctx.reply("âڑ ï¸ڈ ط§ظ„ظ…ظ†طھط¬ ط؛ظٹط± ظ…ظˆط¬ظˆط¯."); return; }

  const totalUsd = Number((step.priceUsd * step.qty).toFixed(4));
  const u = await getUser(ctx.from.id);
  const balance = u ? Number(u.balance) : 0;
  if (balance < totalUsd) { await ctx.reply("â‌Œ ظ„ظٹط³ ظ„ط¯ظٹظƒ ط±طµظٹط¯ ظƒط§ظپظچ .", Markup.inlineKeyboard([[Markup.button.callback("ًں’³ ط´ط­ظ† ط±طµظٹط¯", "deposit")], [Markup.button.callback("ًںڈ   ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]])); setStep(ctx.from.id, { kind: "idle" }); return; }
  await clearInlineKeyboard(ctx).catch(() => {});
  const orderUuid = crypto.randomUUID();
  const debited = await debitBalance(ctx.from.id, totalUsd);
  if (!debited) {
    setStep(ctx.from.id, { kind: "idle" });
    await ctx.reply("â‌Œ طھط؛ظٹظ‘ط± ط§ظ„ط±طµظٹط¯ ظ‚ط¨ظ„ طھظ†ظپظٹط° ط§ظ„ط·ظ„ط¨. ط­ط¯ظ‘ط« ط§ظ„ط±طµظٹط¯ ظˆ ط­ط§ظˆ ظ„ ظ…ط¬ط¯ط¯ط§ظ‹.", Markup.inlineKeyboard([[Markup.button.callback("ًںڈ   ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]]));
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
  await ctx.reply("âڈ³ ط¬ط§ط±ظٹ طھظ†ظپظٹط° ط·ظ„ط¨ظƒ...");
  let resp;
  let finalApiStatus;

  try {
    resp = await placeOrderForProduct(p, params, orderUuid);
    const initialStatus = (resp?.status ?? "").toLowerCase();

    if (ACCEPT_STATUSES.has(initialStatus) || REJECT_STATUSES.has(initialStatus)) {
      finalApiStatus = initialStatus;
    } else {
      // ظ„ط§ ظ† ظ† طھط¸ط± ظ† طھظٹط¬ط© API ط¯ط§ط®ظ„ ظ…ط¹ط§ظ„ط¬ ط¶ط؛ط·ط© ط§ظ„ظ…ط³طھط®ط¯ظ…ط› ط³ظٹظƒظ…ظ„ظ†طŒط§ ط§ظ„ظ€poller ط¨ط§ظ„ط®ظ„ظپظٹط©.
      // ط§ظ„ط§ظ† طھط¸ط§ط± ط§ظ„ط³ط§ط¨ظ‚ ظƒط§ظ†  ظٹط¨ظ‚ظٹ ظ…ط¹ط§ظ„ط¬ ط§ظ„ط·ظ„ط¨ ظ…ظپطھظˆ ط­ط§ظ‹ ط­طھظ‰ 150 ط«ط§ظ† ظٹط©.
      finalApiStatus = "pending";
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
    const checkResp = await checkOrderForSource(orderUuid, p.source_id, true).catch(() => null);
    const detailedResp = checkResp ?? resp;
    await q("UPDATE orders SET status='reject', api_response=$1 WHERE id=$2", [JSON.stringify(detailedResp), order.id]);
    setStep(ctx.from.id, { kind: "idle" });
    const rejectReason = extractDeliveredCode(detailedResp) ||
      (detailedResp?.message && detailedResp.message !== "Network error" ? detailedResp.message : null);
    // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ ظ„ط§ ظ† ط¹ط±ط¶ ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨ ظ„ظ„ظ…ط³طھط®ط¯ظ… أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
    await ctx.reply(
      `â‌Œ طھظ… ط±ظپط¶ ط§ظ„ط·ظ„ط¨.\n` +
      (rejectReason ? `ًں“‹ ط§ظ„ط³ط¨ط¨: ${rejectReason}\n` : "") +
      `âœ… طھظ…طھ ط¥ط¹ط§ط¯ط© ${totalUsd.toFixed(2)}$ | ${totalSyp.toLocaleString("en-US")} ظ„.ط³ ط¥ظ„ظ‰ ط±طµظٹط¯ظƒ.`,
      Markup.inlineKeyboard([[Markup.button.callback("ًںڈ   ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]])
    );
    return;
  }

  if (isPending) {
    await q("UPDATE orders SET status='pending', api_response=$1 WHERE id=$2", [JSON.stringify(resp), order.id]);
    setStep(ctx.from.id, { kind: "idle" });
    // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ ظ„ط§ ظ† ط¹ط±ط¶ ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨ ظ„ظ„ظ…ط³طھط®ط¯ظ… أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
    await ctx.reply(
      `âڈ³ ط·ظ„ط¨ظƒ ظ‚ظٹط¯ ط§ظ„ظ…ط¹ط§ظ„ط¬ط©.\nًں›’ ${p.name} أ— ${step.qty}\nًں’° ${totalUsd.toFixed(2)}$ | ${totalSyp.toLocaleString("en-US")} ظ„.ط³\n\nط³ط£ظڈط¹ظ„ظ…ظƒ طھظ„ظ‚ط§ط¦ظٹط§ظ‹ ط¹ظ† ط¯ ط§ظƒطھظ…ط§ظ„ظ†طŒ.`,
      Markup.inlineKeyboard([
        [Markup.button.callback("ًں”„ طھط­ط¯ظٹط« ط§ظ„ط­ط§ظ„ط©", `ord:check:${order.id}`)],
        [Markup.button.callback("ًںڈ   ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]
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
  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ ظ„ط§ ظ† ط¹ط±ط¶ ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨ ظ„ظ„ظ…ط³طھط®ط¯ظ… أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
  await ctx.reply(`âœ… طھظ… طھظ†ظپظٹط° ط·ظ„ط¨ظƒ ط¨ظ†ط¬ط§ط­!\nًں›’ ${p.name} أ— ${step.qty}\nًں’° ${totalUsd.toFixed(2)}$ | ${totalSyp.toLocaleString("en-US")} ظ„.ط³`);
  if (deliveredCode) {
    await ctx.reply(`ًں”‘ طھظپط§طµظٹظ„ ط§ظ„ط·ظ„ط¨:\n\`\`\`\n${deliveredCode}\n\`\`\``,
      { parse_mode: "Markdown", ...Markup.inlineKeyboard([[Markup.button.callback("ًںڈ   ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]]) });
  } else {
    await ctx.reply("ط´ظƒط±ط§ظ‹ ظ„ط§ط³طھط®ط¯ط§ظ…ظƒ ظ…طھط¬ط±ظ†ط§! ًںŒں", Markup.inlineKeyboard([[Markup.button.callback("ًںڈ   ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]]));
  }
}

async function showMyOrders(ctx, page) {
  const limit = 8; const offset = (page - 1) * limit;
  const res = await q("SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3", [ctx.from.id, limit + 1, offset]);
  const hasNext = res.rows.length > limit; const slice = res.rows.slice(0, limit);
  if (!slice.length) { await sendOrEdit(ctx, "ًں“­ ظ„ط§ ظٹظˆط¬ط¯ ظ„ط¯ظٹظƒ ط£ظٹ ط·ظ„ط¨ط§طھ ط¨ط¹ط¯.", Markup.inlineKeyboard([[Markup.button.callback("ًںڈ   ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]])); return; }
  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ ظ„ط§ ظ† ط¹ط±ط¶ ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨ ظپظٹ ظ‚ط§ط¦ظ…ط© ط§ظ„ط·ظ„ط¨ط§طھ أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
  const lines = slice.map(r => `ًں›’ ${r.product_name} أ—${r.qty} â€¢ ${Number(r.price_usd).toFixed(2)}$ â€¢ ${statusLabel(r.status)}`);
  const navRow = [];
  if (page > 1) navRow.push(Markup.button.callback("â¬…ï¸ڈ ط§ظ„ط³ط§ط¨ظ‚", `myorders:${page - 1}`));
  if (hasNext) navRow.push(Markup.button.callback("ط§ظ„طھط§ظ„ظٹ â‍،ï¸ڈ", `myorders:${page + 1}`));
  const kb = []; if (navRow.length) kb.push(navRow);
  kb.push([Markup.button.callback("ًںڈ   ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]);
  await sendOrEdit(ctx, `ًں“¦ ط·ظ„ط¨ط§طھظٹ\n\n${lines.join("\n")}`, Markup.inlineKeyboard(kb));
}

async function checkOrderStatus(ctx, orderId) {
  const res = await q("SELECT * FROM orders WHERE id=$1", [orderId]);
  const row = res.rows[0];
  if (!row || Number(row.user_id) !== ctx.from.id) { await ctx.reply("âڑ ï¸ڈ ط؛ظٹط± ظ…ظˆط¬ظˆط¯."); return; }
  if (!row.oranos_order_id) { await ctx.reply(`ط§ظ„ط­ط§ظ„ط© ط§ظ„ط­ط§ظ„ظٹط©: ${statusLabel(row.status)}`); return; }
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
      // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ ظ„ط§ ظ† ط¹ط±ط¶ ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨ ظ„ظ„ظ…ط³طھط®ط¯ظ… أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
      if (code && !row.delivered_code) await ctx.reply(`ًں”‘ طھظپط§طµظٹظ„ ط§ظ„ط·ظ„ط¨:\n\n${code}`);
      else if (cleanText) await ctx.reply(`ًں“‹ طھط­ط¯ظٹط« ط·ظ„ط¨ظƒ:\n\n${cleanText}`);
    }
    await ctx.reply(`ط§ظ„ط­ط§ظ„ط© ط§ظ„ط­ط§ظ„ظٹط© ظ„ط·ظ„ط¨ظƒ: ${statusLabel(finalStatus)}`);
  } catch { await ctx.reply("âڑ ï¸ڈ طھط¹ط°ظ‘ط± ظپط­طµ ط§ظ„ط­ط§ظ„ط© ط§ظ„ط¢ظ† ."); }
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
    // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ ظ„ط§ ظ† ط¹ط±ط¶ ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨ ظ„ظ„ظ…ط³طھط®ط¯ظ… أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
    const msgLines = [
      `â‌Œ طھظ… ط±ظپط¶ ط£ط­ط¯ ط·ظ„ط¨ط§طھظƒ`,
      `ًں›’ ط§ظ„ظ…ظ†طھط¬: ${order.product_name}`,
      ...(rejectReply ? [`ًں“‹ ط§ظ„ط±ط¯: ${rejectReply}`] : []),
      `ًں’° طھظ…طھ ط¥ط¹ط§ط¯ط© ${priceUsd.toFixed(2)}$ | ${refundSyp.toLocaleString("en-US")} ظ„.ط³ ط¥ظ„ظ‰ ط±طµظٹط¯ظƒ.`
    ];
    await bot.telegram.sendMessage(order.user_id, msgLines.join("\n"),
      Markup.inlineKeyboard([[Markup.button.callback("ًںڈ   ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]])).catch(() => {});
  } else if (isAccepted) {
    const priceSyp = Math.round(priceUsd * rate);
    // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ ظ„ط§ ظ† ط¹ط±ط¶ ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨ ظ„ظ„ظ…ط³طھط®ط¯ظ… أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
    const msgLines = [
      `âœ… طھظ… طھظ†ظپظٹط° ط£ط­ط¯ ط·ظ„ط¨ط§طھظƒ ط¨ظ†ط¬ط§ط­!`,
      `ًں›’ ط§ظ„ظ…ظ†طھط¬: ${order.product_name}`,
      `ًں’° ${priceUsd.toFixed(2)}$ | ${priceSyp.toLocaleString("en-US")} ظ„.ط³`
    ];
    if (code) {
      msgLines.push(`\nًں”‘ طھظپط§طµظٹظ„ ط§ظ„ط·ظ„ط¨:\n\`\`\`\n${code}\n\`\`\``);
      await bot.telegram.sendMessage(order.user_id, msgLines.join("\n"),
        { parse_mode: "Markdown", ...Markup.inlineKeyboard([[Markup.button.callback("ًںڈ   ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]]) }).catch(() => {});
    } else if (cleanText) {
      msgLines.push(`\nًں“‹ طھظپط§طµظٹظ„ ط§ظ„ط·ظ„ط¨:\n\`\`\`\n${cleanText}\n\`\`\``);
      await bot.telegram.sendMessage(order.user_id, msgLines.join("\n"),
        { parse_mode: "Markdown", ...Markup.inlineKeyboard([[Markup.button.callback("ًںڈ   ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]]) }).catch(() => {});
    } else {
      await bot.telegram.sendMessage(order.user_id, msgLines.join("\n"),
        Markup.inlineKeyboard([[Markup.button.callback("ًںڈ   ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]])).catch(() => {});
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
    await ctx.reply("â›” ظ‡ط°ط§ ط§ظ„ظ‚ط³ظ… ظ„ظ„ط¥ط¯ط§ط±ط© ظپظ‚ط·.");
    return false;
  }
  if (!sessionActive && !authedAdminIds.has(ctx.from.id)) {
    setStep(ctx.from.id, { kind: "admin:login" });
    await ctx.reply("ًں”‘ ط£ط±ط³ظ„ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ظ„ظ„ط¯ط®ظˆ ظ„ ط¥ظ„ظ‰ ظ„ظˆ ط­ط© ط§ظ„ط¥ط¯ط§ط±ط©:");
    return false;
  }
  if (!sessionActive && authedAdminIds.has(ctx.from.id)) {
    authedAdminIds.delete(ctx.from.id);
    setStep(ctx.from.id, { kind: "admin:login" });
    await ctx.reply("ًں”‘ ط§ظ† طھظ†طŒطھ ط¬ظ„ط³ط© ط§ظ„ط¥ط¯ط§ط±ط©. ط£ط±ط³ظ„ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ظ„ظ„ط¯ط®ظˆ ظ„ ظ…ط¬ط¯ط¯ط§ظ‹:");
    return false;
  }
  return true;
}

async function requireSuperAdmin(ctx) {
  const [u, sessionActive] = await Promise.all([getUser(ctx.from.id), isAdminSessionActive(ctx.from.id)]);
  if (!u?.is_super_admin || (!sessionActive && !authedAdminIds.has(ctx.from.id))) {
    await ctx.reply("â›” ظ‡ط°ط§ ط§ظ„ط¥ط¬ط±ط§ط، ظ„ظ„ظ…ط¯ظٹط± ط§ظ„ط£ط¹ظ„ظ‰ ظپظ‚ط·.");
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
    [Markup.button.callback("ًں“¥ ط·ظ„ط¨ط§طھ ط§ظ„ط¥ظٹط¯ط§ط¹", "adm:depList:1"), Markup.button.callback("ًں‘¥ ط§ظ„ظ…ط³طھط®ط¯ظ…ظˆظ† ", "adm:users:1")],
    [Markup.button.callback("ًں”چ  ط¨ط­ط« ظ…ط³طھط®ط¯ظ…", "adm:findUser"), Markup.button.callback("ًں“¦ ظƒظ„ ط§ظ„ط·ظ„ط¨ط§طھ", "adm:allOrders:1")],
    [Markup.button.callback("ًں“£ ط±ط³ط§ظ„ط© ط¬ظ…ط§ط¹ظٹط©", "adm:broadcast"), Markup.button.callback("ًں’³ ط·ط±ظ‚ ط§ظ„ط¥ظٹط¯ط§ط¹", "adm:methods")],
    [Markup.button.callback("ًں›’ ط¥ط¯ط§ط±ط© ط§ظ„ظ…ظ†طھط¬ط§طھ", "cat:0:1:0"), Markup.button.callback("âڑ™ï¸ڈ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ", "adm:settings")],
    [Markup.button.callback("ًں“‍ ظˆط³ط§ط¦ظ„ ط§ظ„طھظˆط§طµظ„", "adm:contacts"), Markup.button.callback("ًں“پ ط£ظ‚ط³ط§ظ… ظ…ط®طµطµط©", "adm:vcList")],
    [Markup.button.callback("â‍• ظ…ظ†طھط¬ ظٹط¯ظˆظٹ", "adm:manualProds"), Markup.button.callback("ًں¤– ظ…ط³ط§ط¹ط¯ ط§ظ„ط¥ط¯ط§ط±ط©", "adm:aiSupport")],
    [Markup.button.callback("ًں”— APIs ط§ظ„ظ…ظ†طھط¬ط§طھ", "adm:apis"), Markup.button.callback("ًں”„ ط¨ظٹظ† ط¬ طھظ„ظ‚ط§ط¦ظٹ", "adm:ping")],
    [Markup.button.callback(status === "on" ? "ًںں¢ ط§ظ„ط¨ظˆطھ: ط´ط؛ط§ظ„" : "ًں”´ ط§ظ„ط¨ظˆطھ: ظ…طھظˆظ‚ظپ", "adm:toggleStatus")],
    [Markup.button.callback("ًںڑھ طھط³ط¬ظٹظ„ ط®ط±ظˆط¬", "adm:logout"), Markup.button.callback("ًںڈ   ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")],
  ];
  await sendOrEdit(ctx, `ًں‘‘ ظ„ظˆ ط­ط© ط§ظ„ط¥ط¯ط§ط±ط©${isSA ? " (ظ…ط¯ظٹط± ط£ط¹ظ„ظ‰)" : ""}`, Markup.inlineKeyboard(rows));
}

async function showSettingsMenu(ctx) {
  if (!(await requireAdmin(ctx))) return;
  const [m, sm, r] = await Promise.all([getMarkupPercent(), getSocialMarkupPercent(), getExchangeRate()]);
  const loginCmd = await getAdminLoginCommand();
  const u = await getUser(ctx.from.id);
  const isSA = !!u?.is_super_admin;
  const rows = [
    [Markup.button.callback("âœڈï¸ڈ طھط¹ط¯ظٹظ„ ط§ظ„ط±ط¨ط­ ط§ظ„ط¹ط§ظ…", "adm:setMarkup")],
    [Markup.button.callback("âœڈï¸ڈ طھط¹ط¯ظٹظ„ ط±ط¨ط­ ط§ظ„ط³ظˆ ط´ظ„", "adm:setSocialMarkup")],
    [Markup.button.callback("ًں’± طھط¹ط¯ظٹظ„ ط³ط¹ط± ط§ظ„طµط±ظپ", "adm:setRate")],
    [Markup.button.callback("ًں”‘ طھط؛ظٹظٹط± ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±", "adm:newPass")],
    [Markup.button.callback("ًں”ک طھط¹ط¯ظٹظ„ ط£ط²ط±ط§ط± ط§ظ„طھظ†ظ‚ظ„", "adm:btnLabels")],
  ];
  if (isSA) {
    rows.push([Markup.button.callback("ًں”گ طھط؛ظٹظٹط± ط£ظ…ط± ط§ظ„ط¯ط®ظˆظ„ ط§ظ„ط³ط±ظٹ", "adm:changeLoginCmd")]);
  }
  rows.push([Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "admin:menu")]);
  await sendOrEdit(ctx, `âڑ™ï¸ڈ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ\n\nط§ظ„ط±ط¨ط­ ط§ظ„ط¹ط§ظ…: ${m}%\nط±ط¨ط­ ط§ظ„ط³ظˆ ط´ظ„: ${sm}%\nط³ط¹ط± ط§ظ„طµط±ظپ: ${r} ظ„.ط³/$\nط£ظ…ط± ط§ظ„ط¯ط®ظˆظ„: \`${loginCmd}\``,
    Markup.inlineKeyboard(rows));
}

async function showApiSources(ctx) {
  if (!(await requireAdmin(ctx))) return;
  const sources = await listApiSources();
  const rows = sources.map(s => [
    Markup.button.callback(`${s.active ? "ًںں¢" : "ًں”´"} ${s.name}${s.is_primary ? " â­گ" : ""}`.slice(0, 60), `adm:api:${s.id}`)
  ]);
  rows.push([Markup.button.callback("â‍• ط¥ط¶ط§ظپط© API ظ…ظ†طھط¬ط§طھ", "adm:apiAdd")]);
  rows.push([Markup.button.callback("ًں”„ ظ…ط²ط§ظ…ظ† ط© ظƒظ„ ط§ظ„ظ…ظ†طھط¬ط§طھ ط§ظ„ط¢ظ† ", "adm:apiSyncAll")]);
  rows.push([Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "admin:menu")]);
  await sendOrEdit(ctx, "ًں”— APIs ط§ظ„ظ…ظ†طھط¬ط§طھ\n\nظٹطھظ… ط­ظپط¸ ط§ظ„ظ…ظ†طھط¬ط§طھ ظپظٹ ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ظˆ ظ…ط²ط§ظ…ظ† طھظ†طŒط§ طھظ„ظ‚ط§ط¦ظٹط§ظ‹.", Markup.inlineKeyboard(rows));
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
  const text = `ًں“¥ ط·ظ„ط¨ ط¥ظٹط¯ط§ط¹\nط§ظ„ط­ط§ظ„ط©: ${d.status}\nط§ظ„ط·ط±ظٹظ‚ط©: ${d.method_name}\nط§ظ„ظ…ط³طھط®ط¯ظ…: ${u?.first_name ?? ""} ${u?.username ? "@" + u.username : ""} (${d.user_id})\nط±طµظٹط¯ ط§ظ„ظ…ط³طھط®ط¯ظ…: ${u ? Number(u.balance).toFixed(2) : "0.00"}$\nط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ظ…ظڈط­ظˆ ظژظ‘ظ„: ${d.amount ? Number(d.amount).toFixed(2) + "$" : "â€”"}`;
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
  await ctx.reply(`ًں’µ ط£ط±ط³ظ„ ط§ظ„ظ…ط¨ظ„ط؛ ط¨ط§ظ„ط¯ظˆ ظ„ط§ط± ظ„ط¥ط¶ط§ظپطھظ‡ ط¥ظ„ظ‰ ط±طµظٹط¯ ط§ظ„ظ…ط³طھط®ط¯ظ…:`, Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "admin:menu")]]));
}

async function rejectDeposit(ctx, depId) {
  if (!(await requireAdmin(ctx))) return;
  const res = await q("UPDATE deposit_requests SET status='rejected', processed_by=$1, processed_at=NOW() WHERE id=$2 AND status='pending' RETURNING *", [ctx.from.id, depId]);
  if (!res.rows.length) { await ctx.reply("âڑ ï¸ڈ طھظ…طھ ظ…ط¹ط§ظ„ط¬ط© ظ‡ط°ط§ ط§ظ„ط·ظ„ط¨ ظ…ط³ط¨ظ‚ط§ظ‹ ط¨ظˆ ط§ط³ط·ط© ظ…ط¯ظٹط± ط¢ط®ط±."); return; }
  const d = res.rows[0];
  await clearDepositForOtherAdmins(ctx.from.id, depId, `â‌Œ ط·ظ„ط¨ ط¥ظٹط¯ط§ط¹ â€” طھظ… ط§ظ„ط±ظپط¶`);
  await ctx.reply(`â‌Œ طھظ… ط±ظپط¶ ط·ظ„ط¨ ط§ظ„ط¥ظٹط¯ط§ط¹.`);
  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ ظ„ط§ ظ† ط¹ط±ط¶ ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨ ظ„ظ„ظ…ط³طھط®ط¯ظ… أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
  if (d) { try { await ctx.telegram.sendMessage(d.user_id, `â‌Œ طھظ… ط±ظپط¶ ط·ظ„ط¨ ط§ظ„ط¥ظٹط¯ط§ط¹. ظ„ظ„ط§ط³طھظپط³ط§ط± ط±ط§ط³ظ„ @${ADMIN_USERNAME}.`); } catch { /* ignore */ } }
}

async function showUserCard(ctx, uid) {
  if (!(await requireAdmin(ctx))) return;
  const u = await getUser(uid); if (!u) { await ctx.reply("âڑ ï¸ڈ ط؛ظٹط± ظ…ظˆط¬ظˆط¯."); return; }
  const me = await getUser(ctx.from.id);
  const isMeSA = !!me?.is_super_admin;
  const statsRes = await q("SELECT COUNT(*)::int AS c, COALESCE(SUM(price_usd),0)::text AS s FROM orders WHERE user_id=$1", [uid]);
  const oc = statsRes.rows[0]?.c ?? 0; const sum = Number(statsRes.rows[0]?.s ?? 0);
  const text = `ًں‘¤ ${u.first_name ?? "â€”"}${u.username ? " @" + u.username : ""}\nID: ${u.id}\nط§ظ„ط±طµظٹط¯: ${Number(u.balance).toFixed(2)}$\nط§ظ„ط­ط§ظ„ط©: ${u.status}\nط¥ط¯ط§ط±ظٹطں ${u.is_admin ? "ظ† ط¹ظ…" : "ظ„ط§"}${u.is_super_admin ? " (ط£ط¹ظ„ظ‰)" : ""}\nط¹ط¯ط¯ ط§ظ„ط·ظ„ط¨ط§طھ: ${oc} â€¢ ط¥ط¬ظ…ط§ظ„ظٹ: ${sum.toFixed(2)}$`;
  const kb = [
    [Markup.button.callback("â‍• ط´ط­ظ† ط±طµظٹط¯", `adm:userAdd:${uid}`), Markup.button.callback("â‍– ط®طµظ… ط±طµظٹط¯", `adm:userSub:${uid}`)],
    [Markup.button.callback(u.status === "banned" ? "âœ… ط±ظپط¹ ط§ظ„ط­ط¸ط±" : "ًںڑ« ط­ط¸ط±", `adm:userBan:${uid}`), Markup.button.callback(u.is_admin ? "ًں‘¤ ط¥ظ„ط؛ط§ط، ط¥ط¯ط§ط±ظٹ" : "ًں‘‘ ط¬ط¹ظ„ظ‡ ط¥ط¯ط§ط±ظٹ", `adm:userAdmin:${uid}`)],
    [Markup.button.callback("ًں“¦ ط·ظ„ط¨ط§طھظ‡", `adm:userOrders:${uid}:1`), Markup.button.callback("% ط±ط¨ط­ ط®ط§طµ", `adm:userMarkup:${uid}`)],
    [Markup.button.callback("ًں’¬ ظ…ط±ط§ط³ظ„ط© ط§ظ„ظ…ط³طھط®ط¯ظ… ط®ط§طµ", `adm:userMsg:${uid}`)],
  ];
  if (isMeSA && uid !== ctx.from.id) {
    kb.push([Markup.button.callback(u.is_super_admin ? "â¬‡ï¸ڈ ط¥ظ„ط؛ط§ط، ط§ظ„ظ…ط¯ظٹط± ط§ظ„ط£ط¹ظ„ظ‰" : "ًںŒں ط¬ط¹ظ„ظ‡ ظ…ط¯ظٹط±ط§ظ‹ ط£ط¹ظ„ظ‰", `adm:userSA:${uid}`)]);
  }
  kb.push([Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "adm:users:1")]);
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
      console.log("ًں”„ ط¨ط¯ط، ط§طھطµط§ظ„ Telegram polling...");
      await bot.launch(launchConfig);
      if (shouldStop()) break;
      const livedMs = Date.now() - startedAt;
      attempt = livedMs >= 60_000 ? 0 : attempt + 1;
      console.error("âڑ ï¸ڈ ط§ظ† طھظ†طŒظ‰ ط§طھطµط§ظ„ Telegram pollingطŒ ط³طھطھظ… ط¥ط¹ط§ط¯ط© ط§ظ„ظ…ط­ط§ظˆ ظ„ط©.");
    } catch (err) {
      if (shouldStop()) break;
      attempt += 1;
      console.error(`âڑ ï¸ڈ طھط¹ط°ط± ط§طھطµط§ظ„ Telegram polling (ظ…ط­ط§ظˆ ظ„ط© ${attempt}):`, err?.message ?? err);
    }
    if (shouldStop()) break;
    const delay = Math.min(POLLING_RETRY_MAX_MS, POLLING_RETRY_BASE_MS * (2 ** Math.min(attempt - 1, 4)));
    console.log(`âڈ³ ط¥ط¹ط§ط¯ط© ط§طھطµط§ظ„ Telegram ط¨ط¹ط¯ ${Math.ceil(delay / 1000)} ط«ظˆ ط§ظ† ط¸ط¹أ¢â‚¬ ...`);
    await waitMs(delay);
  }
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
  await ensurePrimaryApiSource();
  // ظ„ط§ ظ† ظ† طھط¸ط± ظ…ط²ط§ظ…ظ† ط© API ط§ظ„ط·ظˆ ظٹظ„ط© ظ‚ط¨ظ„ طھط´ط؛ظٹظ„ ظ…ط¹ط§ظ„ط¬ط§طھ Telegram.

  const bot = new Telegraf(token, { handlerTimeout: 90_000 });
  _botRef = bot;
  // ط§ط®طھط¨ط§ط± ط§ظ„ط§طھطµط§ظ„ ط¨ط§ظ„طھظˆظƒط¸أ¢â‚¬  ظ…ط¨ظƒط±ط§ظ‹ ط­طھظ‰ ظٹط¸ظ‡ط± ط®ط·ط£ Telegram ظپظٹ ط³ط¬ظ„ Railway ط¨ظˆط¶ظˆط­.
  const botInfo = await bot.telegram.getMe();
  console.log(`âœ… طھظ… ط§ظ„ط§طھطµط§ظ„ ط¨طھظ„ظٹط¬ط±ط§ظ…: @${botInfo.username ?? botInfo.id}`);
  // طھظˆ ط­ظٹط¯ ظƒظ„ ط§ظ„ظ† طµظˆ طµ ط§ظ„ط®ط§ط±ط¬ط© ط¥ظ„ظ‰ Telegram ظ‚ط¨ظ„ ط§ظ„ط¥ط±ط³ط§ظ„طŒ ط¨ظ…ط§ ظپظٹظ†طŒط§ ط§ظ„ط£ط²ط±ط§ط±
  const originalCallApi = bot.telegram.callApi.bind(bot.telegram);
  bot.telegram.callApi = (method, payload, ...rest) => {
    // Telegraf ظٹط±ط³ظ„ getUpdates ظƒظ€ long polling ط¨ظ…ظ†طŒظ„ط© 50 ط«ط§ظ† ظٹط©.
    // ظ„ط§ ظ† ط¶ط¹ ط¹ظ„ظٹظ†طŒ Promise.race ط£ظˆ  AbortController ط®ط§ط±ط¬ظٹط§ظ‹طŒ ظ„ط£ظ†  ط£ظٹ ظ…ظ†طŒظ„ط©
    // ط¥ط¶ط§ظپظٹط© ظ‡ظ†ط§ ظ‚ط¯ طھظ‚ط·ط¹ ط§ظ„ط·ظ„ط¨ ظ‚ط¨ظ„ ط£ظ†  طھظ† طھظ†طŒظٹ ظ…ظ†طŒظ„ط© Telegram ط§ظ„ط·ط¨ظٹط¹ظٹط©.
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

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Rate limiter + ط±ط¯ ظپظˆ ط±ظٹ ط¹ظ„ظ‰ callback أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
  const _rateMap = new Map();
  setInterval(() => {
    const now = Date.now();
    for (const [uid, times] of _rateMap) {
      if (times.every(t => now - t > 5_000)) _rateMap.delete(uid);
    }
  }, 60_000).unref();

  bot.use((ctx, next) => {
    const uid = ctx.from?.id; if (!uid) return next();
    // ط£ط²ط±ط§ط± Telegram ظ„ط§ طھظڈط­ط¬ط¨ ط¨ظ…ط­ط¯ط¯ ط§ظ„ط±ط³ط§ط¦ظ„ط› ط§ظ„ط¶ط؛ط· ط§ظ„ظ…طھطھط§ط¨ط¹ ظٹط¬ط¨ ط£ظ†  ظٹطµظ„ ظ„ظ„ظ…ط¹ط§ظ„ط¬.
    if (ctx.callbackQuery) {
      ctx.answerCbQuery().catch(() => {});
      return next();
    }
    const now = Date.now();
    const times = (_rateMap.get(uid) ?? []).filter(t => now - t < 3_000);
    // ظ† ط­ط¯ ط§ظ„ط±ط³ط§ط¦ظ„ ط§ظ„ظ† طµظٹط© ط§ظ„ظ…ط²ط¹ط¬ط© ظپظ‚ط·طŒ ظˆ ظ„ط§ ظ† ط³ظ‚ط· ط¶ط؛ط·ط§طھ ط§ظ„ط£ط²ط±ط§ط± ط§ظ„ط·ط¨ظٹط¹ظٹط©.
    if (times.length >= 30) {
      return;
    }
    times.push(now); _rateMap.set(uid, times);
    return next();
  });

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Commands أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
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

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Callback Queries أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
  bot.action("home", async ctx => { setStep(ctx.from.id, { kind: "idle" }); await showMainMenu(ctx); });
  bot.action("balance", async ctx => {
    const u = await ensureUser(ctx); if (!u) return;
    const rate = await getExchangeRate();
    await sendOrEdit(ctx, `ًں’° ط±طµظٹط¯ظƒ: ${formatBalance(Number(u.balance), rate)}`, Markup.inlineKeyboard([[Markup.button.callback("ًںڈ   ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]]));
  });
  bot.action("deposit", async ctx => { await ensureUser(ctx); await showDepositMenu(ctx); });
  bot.action("support", async ctx => { await ensureUser(ctx); await showContactLinks(ctx); });
  bot.action(/^myorders:(\d+)$/, async ctx => { await showMyOrders(ctx, Number(ctx.match[1])); });
  bot.action("noop", async ctx => { /* ظ† ظ‚ط±ط© ط¹ظ„ظ‰ ط±ظ‚ظ… ط§ظ„طµظپط­ط© */ });

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Admin auth أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
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
    const greeting = `ط£ظ†طŒظ„ط§ظ‹ ظپظٹظƒ ظپظٹ ظ…طھط¬ط± ط§ظ„ظ…ط±ظˆ ط§ظ†  ًںŒں\nط§ظ„ط§ط³ظ…: ${user?.first_name ?? "â€”"}${user?.username ? ` (@${user.username})` : ""}\nط§ظ„ط±ظ‚ظ…: ${ctx.from.id}\nط§ظ„ط±طµظٹط¯: ${formatBalance(Number(user?.balance ?? 0), rate)}\n\nطھظ… طھط³ط¬ظٹظ„ ط§ظ„ط®ط±ظˆط¬ ظ…ظ†  ظ„ظˆ ط­ط© ط§ظ„ط¥ط¯ط§ط±ط© ًںڑھ\nط§ط®طھط± ظ…ظ†  ط§ظ„ظ‚ط§ط¦ظ…ط© ًں‘‡`;
    await sendOrEdit(ctx, greeting, mainMenu());
  });

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Deposit flow أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
  bot.action(/^dep:method:(\d+)$/, async ctx => { await showDepositMethod(ctx, Number(ctx.match[1])); });
  bot.action("dep:cancel", async ctx => { setStep(ctx.from.id, { kind: "idle" }); await showMainMenu(ctx); });

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Category / Product navigation أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
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

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Buy flow أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
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

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Manual product buy أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
  bot.action(/^mbuy:(\d+)$/, async ctx => {
    const mid = Number(ctx.match[1]);
    const m = (await q("SELECT * FROM manual_products WHERE id=$1 AND active=true", [mid])).rows[0];
    if (!m) { await ctx.reply("âڑ ï¸ڈ ط§ظ„ظ…ظ†طھط¬ ط؛ظٹط± ظ…طھط§ط­."); return; }
    const u = await getUser(ctx.from.id);
    const priceUsd = Number(m.price_usd);
    if (!u || Number(u.balance) < priceUsd) { await ctx.reply("â‌Œ ط±طµظٹط¯ ط؛ظٹط± ظƒط§ظپظچ .", Markup.inlineKeyboard([[Markup.button.callback("ًں’³ ط´ط­ظ† ط±طµظٹط¯", "deposit")]])); return; }
    setStep(ctx.from.id, { kind: "order:manualNote", productId: mid, priceUsd });
    await ctx.reply(`ًں“‌ ط£ط±ط³ظ„ ظ…ظ„ط§ط­ط¸ط© ظ„ظ„ط·ظ„ط¨ ط£ظˆ  ط§ظƒطھط¨ "skip":`, Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "ord:cancel")]]));
  });

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Admin: deposit management أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
  bot.action(/^adm:depList:(\d+)$/, async ctx => { await showDepList(ctx, Number(ctx.match[1])); });
  bot.action(/^adm:depShow:(\d+)$/, async ctx => { await showDepDetails(ctx, Number(ctx.match[1])); });
  bot.action(/^adm:dep:approve:(\d+)$/, async ctx => { await approveDeposit(ctx, Number(ctx.match[1])); });
  bot.action(/^adm:dep:reject:(\d+)$/, async ctx => { await rejectDeposit(ctx, Number(ctx.match[1])); });

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Admin: users أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
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
    await sendOrEdit(ctx, `ًں‘¥ ط§ظ„ظ…ط³طھط®ط¯ظ…ظˆظ†  (${total}):`, Markup.inlineKeyboard(kb));
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
    if (!me?.is_super_admin) { await ctx.reply("â›” ط§ظ„ظ…ط¯ظٹط± ط§ظ„ط£ط¹ظ„ظ‰ ظپظ‚ط· ظٹط³طھط·ظٹط¹ طھط¹ظٹظٹظ†  ط§ظ„ظ…ط¯ظٹط±ظٹظ† ."); return; }
    const uid = Number(ctx.match[1]); const u = await getUser(uid);
    const newAdmin = !u?.is_admin;
    await setAdmin(uid, newAdmin, newAdmin ? false : undefined);
    if (!newAdmin) {
      authedAdminIds.delete(uid);
      await setAdminSession(uid, false).catch(() => {});
    }
    await ctx.reply(newAdmin ? "ًں‘‘ طھظ… ط§ظ„طھط¹ظٹظٹظ†  ط¥ط¯ط§ط±ظٹظ‹ط§." : "ًں‘¤ طھظ… ط¥ظ„ط؛ط§ط، ط§ظ„ط¥ط¯ط§ط±ظٹ.");
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
    await ctx.reply(newSA ? "ًںŒں طھظ… طھط¹ظٹظٹظ† ظ†طŒ ظ…ط¯ظٹط±ط§ظ‹ ط£ط¹ظ„ظ‰." : "â¬‡ï¸ڈ طھظ… ط¥ظ„ط؛ط§ط، طµظ„ط§ط­ظٹط© ط§ظ„ظ…ط¯ظٹط± ط§ظ„ط£ط¹ظ„ظ‰.");
    await showUserCard(ctx, uid);
  });
  bot.action(/^adm:userAdd:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:userBalance", userId: Number(ctx.match[1]), mode: "add" }); await ctx.reply("ًں’µ ط£ط±ط³ظ„ ط§ظ„ظ…ط¨ظ„ط؛ ط¨ط§ظ„ط¯ظˆ ظ„ط§ط± ظ„ظ„ط¥ط¶ط§ظپط©:", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "admin:menu")]])); });
  bot.action(/^adm:userSub:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:userBalance", userId: Number(ctx.match[1]), mode: "sub" }); await ctx.reply("ًں’µ ط£ط±ط³ظ„ ط§ظ„ظ…ط¨ظ„ط؛ ط¨ط§ظ„ط¯ظˆ ظ„ط§ط± ظ„ظ„ط®طµظ…:", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "admin:menu")]])); });
  bot.action("adm:findUser", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:findUser" }); await ctx.reply("ًں”چ  ط£ط±ط³ظ„ ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ… ط£ظˆ  ID:", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "admin:menu")]])); });
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
  bot.action(/^adm:userMarkup:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const uid = Number(ctx.match[1]); const u = await getUser(uid); setStep(ctx.from.id, { kind: "admin:setUserMarkup", userId: uid }); await ctx.reply(`% ظ†ط³ط¨ط© ط±ط¨ط­ ${u?.first_name ?? uid}\nط§ظ„ط­ط§ظ„ظٹط©: ${u?.custom_markup_percent ?? "ط؛ظٹط± ظ…ط­ط¯ط¯ط©"}\nط£ط±ط³ظ„ ط§ظ„ظ†ط³ط¨ط© ط£ظˆ  reset:`, Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", `adm:user:${uid}`)]])); });
  bot.action(/^adm:userMsg:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const uid = Number(ctx.match[1]); const u = await getUser(uid);
    if (!u) { await ctx.reply("âڑ ï¸ڈ ط§ظ„ظ…ط³طھط®ط¯ظ… ط؛ظٹط± ظ…ظˆط¬ظˆط¯."); return; }
    setStep(ctx.from.id, { kind: "admin:userMessage", userId: uid });
    await ctx.reply(`ًں’¬ ط£ط±ط³ظ„ ط§ظ„ط±ط³ط§ظ„ط© ط§ظ„ط®ط§طµط© ط¥ظ„ظ‰ ${u.first_name ?? uid}:\nط³طھطµظ„ ط¥ظ„ظٹظ‡ ظ…ظ†  ط§ظ„ط¨ظˆطھ ظ…ط¨ط§ط´ط±ط©.`, Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", `adm:user:${uid}`)]]));
  });

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Admin: orders أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
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

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Admin: broadcast أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
  bot.action("adm:broadcast", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:broadcast" }); await ctx.reply("ًں“£ ط£ط±ط³ظ„ ظ† طµ ط§ظ„ط±ط³ط§ظ„ط© ط§ظ„ط¬ظ…ط§ط¹ظٹط©:", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "admin:menu")]])); });

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Admin: deposit methods أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
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
    await sendOrEdit(ctx, `ًں’³ ${m.name}\nط§ظ„ظ…ط¹ط±ظپ: ${m.identifier}\nط§ظ„ط­ط§ظ„ط©: ${m.active ? "ظ…ظپط¹ظ‘ظ„" : "ظ…ظˆ ظ‚ظˆ ظپ"}\nًں–¼ طµظˆ ط±ط©: ${m.image_file_id ? "âœ… ظ…ظˆط¬ظˆط¯ط©" : "â‌Œ ظ„ط§ ظٹظˆط¬ط¯"}\n\n${m.instructions}`,
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

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Admin: product management أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
  bot.action(/^adm:editPrice:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const all = await getCachedProducts(); const p = all.find(x => x.id === pid); setStep(ctx.from.id, { kind: "admin:editPrice", productId: pid, productName: p?.name ?? "" }); await ctx.reply(`âœڈï¸ڈ ط³ط¹ط±: ${p?.name ?? pid}\nط£ط±ط³ظ„: \`%5\` ط±ط¨ط­ ط£ظˆ  \`$2.5\` طھط«ط¨ظٹطھ ط£ظˆ  \`reset\``, { parse_mode: "Markdown" }); });
  bot.action(/^adm:editInstr:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const all = await getCachedProducts(); const p = all.find(x => x.id === pid); setStep(ctx.from.id, { kind: "admin:editProductInstructions", productId: pid, productName: p?.name ?? "" }); await ctx.reply(`ًں“‹ ط£ط±ط³ظ„ طھط¹ظ„ظٹظ…ط§طھ ${p?.name ?? pid} ط£ظˆ  clear ظ„ظ„ظ…ط³ط­:`, Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", `prod:${pid}:0`)]])); });
  bot.action(/^adm:renameProd:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const all = await getCachedProducts(); const p = all.find(x => x.id === pid); setStep(ctx.from.id, { kind: "admin:renameProduct", productId: pid, productName: p?.name ?? "" }); await ctx.reply(`ًں“‌ ط§ظ„ط§ط³ظ… ط§ظ„ط¬ط¯ظٹط¯ ظ„ظ€ "${p?.name ?? pid}" ط£ظˆ  reset:`); });
  bot.action(/^adm:moveProd:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const pid = Number(ctx.match[1]); const all = await getCachedProducts(); const p = all.find(x => x.id === pid); setStep(ctx.from.id, { kind: "admin:moveProduct", productId: pid, productName: p?.name ?? "" }); await ctx.reply(`ًںڑڑ ظ†ظ‚ظ„ "${p?.name ?? pid}"\nط£ط±ط³ظ„ ط±ظ‚ظ… ط§ظ„ظ‚ط³ظ… ط£ظˆ  reset:`, Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", `prod:${pid}:0`)]])); });
  bot.action(/^adm:hideProd:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const pid = Number(ctx.match[1]); const cur = (await q("SELECT hidden FROM product_overrides WHERE product_id=$1", [pid])).rows[0];
    const nextHidden = !(cur?.hidden ?? false);
    await q("INSERT INTO product_overrides(product_id,hidden) VALUES($1,$2) ON CONFLICT(product_id) DO UPDATE SET hidden=$2, updated_at=NOW()", [pid, nextHidden]);
    invalidateCaches(); await ctx.reply(nextHidden ? "ًں™ˆ طھظ… ط¥ط®ظپط§ط، ط§ظ„ظ…ظ†طھط¬." : "ًں‘پ طھظ… ط¥ط¸ظ‡ط§ط± ط§ظ„ظ…ظ†طھط¬.");
  });
  bot.action(/^adm:deleteProd:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const pid = Number(ctx.match[1]);
    const product = (await q("SELECT name FROM cached_products WHERE id=$1", [pid])).rows[0];
    if (!product) { await ctx.reply("â‌Œ ط§ظ„ظ…ظ†طھط¬ ط؛ظٹط± ظ…ظˆط¬ظˆط¯."); return; }
    await q(
      `INSERT INTO product_overrides(product_id,product_name,deleted,hidden)
       VALUES($1,$2,true,true)
       ON CONFLICT(product_id) DO UPDATE SET deleted=true,hidden=true,updated_at=NOW()`,
      [pid, product.name]
    );
    await q("UPDATE cached_products SET deleted=true,available=false,updated_at=NOW() WHERE id=$1", [pid]);
    invalidateCaches();
    await ctx.reply("âœ… طھظ… ط­ط°ظپ ط§ظ„ظ…ظ†طھط¬ ظ†ظ‡ط§ط¦ظٹط§ظ‹ ظ…ط¸أ¢â‚¬  ط§ظ„ظƒطھط§ظ„ظˆط¬.");
    await showMainMenu(ctx);
  });
  bot.action(/^adm:deleteProdAsk:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const pid = Number(ctx.match[1]);
    await ctx.reply(
      "âڑ ï¸ڈ ط­ط°ظپ ط§ظ„ظ…ظ†طھط¬ ط¸أ¢â‚¬ ظ‡ط§ط¦ظٹ ظˆظ„ط§ ظٹط¹ظˆط¯ ط¹ط¸أ¢â‚¬ ط¯ ط§ظ„ظ…ط²ط§ظ…ط¸أ¢â‚¬ ط©. ظ‡ظ„ طھط±ظٹط¯ ط§ظ„ظ…طھط§ط¨ط¹ة؟",
      Markup.inlineKeyboard([[
        Markup.button.callback("âœ… طھط£ظƒظٹط¯طŒ ط§ط­ط°ظپ", `adm:deleteProd:${pid}`),
        Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", `prod:${pid}:0`),
      ]])
    );
  });
  bot.action(/^adm:deleteManualProd:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const id = Number(ctx.match[1]);
    const deleted = await q("DELETE FROM manual_products WHERE id=$1 RETURNING id", [id]);
    if (!deleted.rows.length) { await ctx.reply("â‌Œ ط§ظ„ظ…ظ†طھط¬ ط؛ظٹط± ظ…ظˆط¬ظˆط¯."); return; }
    invalidateCaches();
    await ctx.reply("âœ… طھظ… ط­ط°ظپ ط§ظ„ظ…ظ†طھط¬ ظ†ظ‡ط§ط¦ظٹط§ظ‹.");
    await showMainMenu(ctx);
  });
  bot.action(/^adm:deleteManualProdAsk:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const id = Number(ctx.match[1]);
    await ctx.reply(
      "âڑ ï¸ڈ ط­ط°ظپ ط§ظ„ظ…ظ†طھط¬ ط§ظ„ظٹط¯ظˆظٹ ط¸أ¢â‚¬ ظ‡ط§ط¦ظٹ. ظ‡ظ„ طھط±ظٹط¯ ط§ظ„ظ…طھط§ط¨ط¹ة؟",
      Markup.inlineKeyboard([[
        Markup.button.callback("âœ… طھط£ظƒظٹط¯طŒ ط§ط­ط°ظپ", `adm:deleteManualProd:${id}`),
        Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", `mprod:${id}:0`),
      ]])
    );
  });

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Admin: category management أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
  bot.action(/^adm:catEdit:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:editCategoryName", categoryId: Number(ctx.match[1]) }); await ctx.reply("âœڈï¸ڈ ط£ط±ط³ظ„ ط§ظ„ط§ط³ظ… ط§ظ„ط¬ط¯ظٹط¯ ظ„ظ„ظ‚ط³ظ… (ط£ظˆ  reset):"); });
  bot.action(/^adm:catToggle:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const cid = Number(ctx.match[1]); const cur = (await q("SELECT hidden FROM category_overrides WHERE category_id=$1", [cid])).rows[0];
    const nextHidden = !(cur?.hidden ?? false);
    await q("INSERT INTO category_overrides(category_id,hidden) VALUES($1,$2) ON CONFLICT(category_id) DO UPDATE SET hidden=$2, updated_at=NOW()", [cid, nextHidden]);
    invalidateCaches(); await ctx.reply(nextHidden ? "ًں™ˆ طھظ… ط¥ط®ظپط§ط، ط§ظ„ظ‚ط³ظ…." : "ًں‘پ طھظ… ط¥ط¸ظ‡ط§ط± ط§ظ„ظ‚ط³ظ….");
  });
  bot.action(/^adm:catMarkup:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const cid = Number(ctx.match[1]); const cur = (await q("SELECT custom_markup_percent FROM category_overrides WHERE category_id=$1", [cid])).rows[0]; setStep(ctx.from.id, { kind: "admin:setCatMarkup", categoryId: cid }); await ctx.reply(`% ظ†ط³ط¨ط© ط±ط¨ط­ ط§ظ„ظ‚ط³ظ… ${cid}\nط§ظ„ط­ط§ظ„ظٹط©: ${cur?.custom_markup_percent ?? "ط؛ظٹط± ظ…ط­ط¯ط¯ط©"}\nط£ط±ط³ظ„ ط§ظ„ظ†ط³ط¨ط© ط£ظˆ  reset:`); });
  bot.action(/^adm:catSort:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const cid = Number(ctx.match[1]); setStep(ctx.from.id, { kind: "admin:setCatSort", categoryId: cid }); await ctx.reply(`ًں”¢ طھط±طھظٹط¨ ط§ظ„ظ‚ط³ظ… ${cid}\nط£ط±ط³ظ„ ط±ظ‚ظ… ط§ظ„طھط±طھظٹط¨ ط£ظˆ  reset:`); });
  bot.action(/^adm:moveCatAll:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:moveCatAll", sourceCategoryId: Number(ctx.match[1]) }); await ctx.reply(`ًںڑڑ ظ†ظ‚ظ„ ط¬ظ…ظٹط¹ ظ…ظ†طھط¬ط§طھ ط§ظ„ظ‚ط³ظ…\nط£ط±ط³ظ„ ط±ظ‚ظ… ط§ظ„ظ‚ط³ظ… ط§ظ„ظ…ط³طھظ‡ط¯ظپ ط£ظˆ  cancel:`, Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", `cat:${ctx.match[1]}:1:0`)]])); });
  bot.action(/^adm:moveCatToParent:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const cid = Number(ctx.match[1]);
    setStep(ctx.from.id, { kind: "admin:moveCatToParent", categoryId: cid });
    await ctx.reply(`ًں“پ ظ†ظ‚ظ„ ط§ظ„ظ‚ط³ظ… ط¥ظ„ظ‰ ط¯ط§ط®ظ„ ظ‚ط³ظ… ط¢ط®ط±\nط£ط±ط³ظ„ ط±ظ‚ظ… ط§ظ„ظ‚ط³ظ… ط§ظ„ظ…ط³طھظ‡ط¯ظپ ط£ظˆ  "0" ظ„ظ„ط±ط¬ظˆط¹ ظ„ظ„ط¬ط°ط± ط£ظˆ  "cancel" ظ„ظ„ط¥ظ„ط؛ط§ط،:`, Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", `cat:${cid}:1:0`)]]));
  });

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Admin: settings أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
  bot.action("adm:settings", async ctx => { await showSettingsMenu(ctx); });
  bot.action("adm:setMarkup", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:setMarkup" }); await ctx.reply("âœڈï¸ڈ ط£ط±ط³ظ„ ظ†ط³ط¨ط© ط§ظ„ط±ط¨ط­ ط§ظ„ط¹ط§ظ… (ظ…ط«ط§ظ„: 5):", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "adm:settings")]])); });
  bot.action("adm:setSocialMarkup", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:setSocialMarkup" }); await ctx.reply("âœڈï¸ڈ ط£ط±ط³ظ„ ظ†ط³ط¨ط© ط±ط¨ط­ ط§ظ„ط³ظˆ ط´ظ„:", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "adm:settings")]])); });
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
    await ctx.reply(next === "on" ? "ًںں¢ ط§ظ„ط¨ظˆطھ ط§ظ„ط¢ظ†  ط´ط؛ط§ظ„." : "ًں”´ ط§ظ„ط¨ظˆطھ ظ…طھظˆظ‚ظپ ط§ظ„ط¢ظ† .");
    await showAdminMenu(ctx);
  });

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Admin: product API sources أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
  bot.action("adm:apis", async ctx => { await showApiSources(ctx); });
  bot.action("adm:apiAdd", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    setStep(ctx.from.id, { kind: "admin:addApi:name" });
    await ctx.reply("ًں”— ط£ط±ط³ظ„ ط§ط³ظ… ط§ظ„ظ€API ط§ظ„ط¬ط¯ظٹط¯:", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "adm:apis")]]));
  });
  bot.action(/^adm:apiRename:(\d+)$/, async ctx => {
    if (!(await requireSuperAdmin(ctx))) return;
    const source = await getApiSource(Number(ctx.match[1]));
    if (!source) { await ctx.reply("âڑ ï¸ڈ ظ…طµط¯ط± ط§ظ„ظ€API ط؛ظٹط± ظ…ظˆط¬ظˆط¯."); return; }
    setStep(ctx.from.id, { kind: "admin:renameApi", sourceId: source.id, oldName: source.name });
    await ctx.reply(`âœڈï¸ڈ ط§ظ„ط§ط³ظ… ط§ظ„ط­ط§ظ„ظٹ: ${source.name}\nط£ط±ط³ظ„ ط§ظ„ط§ط³ظ… ط§ظ„ط¬ط¯ظٹط¯:`, Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", `adm:api:${source.id}`)]]));
  });
  bot.action(/^adm:api:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const source = await getApiSource(Number(ctx.match[1]));
    if (!source) { await ctx.reply("âڑ ï¸ڈ ظ…طµط¯ط± ط§ظ„ظ€API ط؛ظٹط± ظ…ظˆط¬ظˆط¯."); return; }
    const lastSync = source.last_sync_at ? new Date(source.last_sync_at).toLocaleString("ar") : "ظ„ظ… طھطھظ… ط§ظ„ظ…ط²ط§ظ…ظ† ط©";
    const error = source.last_sync_error ? `\nâڑ ï¸ڈ ط¢ط®ط± ط®ط·ط£: ${source.last_sync_error}` : "";
    const buttons = [];
    const me = await getUser(ctx.from.id);
    if (me?.is_super_admin) {
      buttons.push([Markup.button.callback("âœڈï¸ڈ طھط؛ظٹظٹط± ط§ط³ظ… API", `adm:apiRename:${source.id}`)]);
    }
    if (!source.is_primary) {
      buttons.push([Markup.button.callback(source.active ? "ًں”´ طھط¹ط·ظٹظ„" : "ًںں¢ طھظپط¹ظٹظ„", `adm:apiToggle:${source.id}`), Markup.button.callback("ًں—‘ï¸ڈ ط­ط°ظپ", `adm:apiDel:${source.id}`)]);
    }
    buttons.push([Markup.button.callback("ًں”„ ظ…ط²ط§ظ…ظ† ط© ط§ظ„ط¢ظ† ", `adm:apiSync:${source.id}`)]);
    buttons.push([Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "adm:apis")]);
    await sendOrEdit(ctx,
      `ًں”— ${source.name}${source.is_primary ? " â­گ (ط§ظ„ط£ط³ط§ط³ظٹ)" : ""}\nط§ظ„ط±ط§ط¨ط·: ${source.base_url}\nط§ظ„ط­ط§ظ„ط©: ${source.active ? "ظ…ظپط¹ظ‘ظ„" : "ظ…ظˆ ظ‚ظˆ ظپ"}\nط¢ط®ط± ظ…ط²ط§ظ…ظ† ط©: ${lastSync}${error}`,
      Markup.inlineKeyboard(buttons));
  });
  bot.action(/^adm:apiToggle:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const id = Number(ctx.match[1]); const source = await getApiSource(id);
    if (!source || source.is_primary) { await ctx.reply("âڑ ï¸ڈ ظ„ط§ ظٹظ…ظƒظ†  طھط¹ط·ظٹظ„ ط§ظ„ظ€API ط§ظ„ط£ط³ط§ط³ظٹ."); return; }
    await q("UPDATE api_sources SET active=$1,updated_at=NOW() WHERE id=$2", [!source.active, id]);
    invalidateCaches(); await showApiSources(ctx);
  });
  bot.action(/^adm:apiDel:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const id = Number(ctx.match[1]); const source = await getApiSource(id);
    if (!source || source.is_primary) { await ctx.reply("âڑ ï¸ڈ ظ„ط§ ظٹظ…ظƒظ†  ط­ط°ظپ ط§ظ„ظ€API ط§ظ„ط£ط³ط§ط³ظٹ."); return; }
    await q("DELETE FROM cached_products WHERE source_id=$1", [id]);
    await q("DELETE FROM api_sources WHERE id=$1", [id]);
    invalidateCaches(); await ctx.reply("âœ… طھظ… ط­ط°ظپ API ظˆ ظ…ظ†طھط¬ط§طھظ†طŒ ظ…ظ†  ط§ظ„ظƒطھط§ظ„ظˆ ط¬."); await showApiSources(ctx);
  });
  bot.action(/^adm:apiSync:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const source = await getApiSource(Number(ctx.match[1]));
    if (!source) { await ctx.reply("âڑ ï¸ڈ ظ…طµط¯ط± ط§ظ„ظ€API ط؛ظٹط± ظ…ظˆط¬ظˆط¯."); return; }
    try {
      const count = await syncApiSource(source);
      invalidateCaches();
      await ctx.reply(`âœ… طھظ…طھ ظ…ط²ط§ظ…ظ† ط© ${count} ظ…ظ†طھط¬ ظ…ظ†  ${source.name}.`);
    } catch (err) {
      await q("UPDATE api_sources SET last_sync_error=$1 WHERE id=$2", [String(err?.message ?? err).slice(0, 500), source.id]).catch(() => {});
      await ctx.reply("â‌Œ ظپط´ظ„طھ ط§ظ„ظ…ط²ط§ظ…ظ† ط©. طھط­ظ‚ظ‚ ظ…ظ†  ط§ظ„ط±ط§ط¨ط· ظˆ API token.");
    }
    await showApiSources(ctx);
  });
  bot.action("adm:apiSyncAll", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    await ctx.reply("âڈ³ ط¨ط¯ط£طھ ظ…ط²ط§ظ…ظ† ط© ط§ظ„ظ…ظ†طھط¬ط§طھ ط¨ط§ظ„ط®ظ„ظپظٹط©...");
    const summary = await syncAllApiSources();
    const successful = summary.filter(item => item.ok);
    const failed = summary.filter(item => !item.ok);
    const syncedCount = successful.reduce((total, item) => total + item.count, 0);
    const failedText = failed.length
      ? `\nط£ط®ط،ط§ظ„ طھط­ط¯ظٹط«: ${failed.map(item => `${repairArabicEncoding(item.source.name)} (${item.error})`).join(" | ")}`
      : "";
    await ctx.reply(`âœ… ط§ظ† طھظ†طŒطھ ظ…ط²ط§ظ…ظ† ط© ${successful.length} ظ…ظ† APIs ظ„ظ…ظ†  ${syncedCount} ظ…ط½ظ„طھ ظ…ظ† ط¬ط§طھ.${failedText}`);
    await showApiSources(ctx);
  });

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Admin: ping أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
  bot.action("adm:ping", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const [enabled, target, interval] = await Promise.all([getSetting("auto_ping_enabled"), getSetting("auto_ping_target_user_id"), getSetting("auto_ping_interval_min")]);
    await sendOrEdit(ctx, `ًں”„ ط§ظ„ط¨ظٹظ† ط¬ ط§ظ„طھظ„ظ‚ط§ط¦ظٹ\nط§ظ„ط­ط§ظ„ط©: ${enabled === "on" ? "âœ… ظ…ظپط¹ظ‘ظ„" : "â‌Œ ظ…ظˆ ظ‚ظˆ ظپ"}\nط§ظ„ظ…ط³طھظ‡ط¯ظپ: ${target || "ط؛ظٹط± ظ…ط­ط¯ط¯"}\nط§ظ„ظپط§طµظ„: ${interval} ط¯ظ‚ظٹظ‚ط©`,
      Markup.inlineKeyboard([[Markup.button.callback(enabled === "on" ? "â‌Œ ط¥ظٹظ‚ط§ظپ" : "âœ… طھظپط¹ظٹظ„", "adm:pingToggle")], [Markup.button.callback("ًںژ¯ طھط¹ظٹظٹظ†  ط§ظ„ظ…ط³طھظ‡ط¯ظپ", "adm:pingTarget")], [Markup.button.callback("âڈ± طھط¹ظٹظٹظ†  ط§ظ„ظپط§طµظ„", "adm:pingInterval")], [Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "admin:menu")]]));
  });
  bot.action("adm:pingToggle", async ctx => { if (!(await requireAdmin(ctx))) return; const cur = await getSetting("auto_ping_enabled"); await setSetting("auto_ping_enabled", cur === "on" ? "off" : "on"); await ctx.reply(cur === "on" ? "â‌Œ طھظ… ط¥ظٹظ‚ط§ظپ ط§ظ„ط¨ظٹظ† ط¬." : "âœ… طھظ… طھظپط¹ظٹظ„ ط§ظ„ط¨ظٹظ† ط¬."); });
  bot.action("adm:pingTarget", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:pingTarget" }); await ctx.reply("ًںژ¯ ط£ط±ط³ظ„ ID ط§ظ„ظ…ط³طھط®ط¯ظ… ط§ظ„ظ…ط³طھظ‡ط¯ظپ:"); });
  bot.action("adm:pingInterval", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:pingInterval" }); await ctx.reply("âڈ± ط£ط±ط³ظ„ ط§ظ„ظپط§طµظ„ ط§ظ„ط²ظ…ظ† ظٹ ط¨ط§ظ„ط¯ظ‚ط§ط¦ظ‚:"); });

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Admin: contacts أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
  bot.action("adm:contacts", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const links = (await q("SELECT * FROM contact_links ORDER BY id")).rows;
    const rows = links.map(l => [Markup.button.callback(`${l.active ? "ًںں¢" : "ًں”´"} ${l.name}`, `adm:contactEdit:${l.id}`)]);
    rows.push([Markup.button.callback("â‍• ط¥ط¶ط§ظپط©", "adm:addContact")]); rows.push([Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "admin:menu")]);
    await sendOrEdit(ctx, "ًں“‍ ظˆط³ط§ط¦ظ„ ط§ظ„طھظˆط§طµظ„:", Markup.inlineKeyboard(rows));
  });
  bot.action("adm:addContact", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:addContact:name" }); await ctx.reply("ًں“‍ ط£ط±ط³ظ„ ط§ط³ظ… ظˆ ط³ظٹظ„ط© ط§ظ„طھظˆط§طµظ„:", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "adm:contacts")]])); });
  bot.action(/^adm:contactEdit:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const id = Number(ctx.match[1]); const l = (await q("SELECT * FROM contact_links WHERE id=$1", [id])).rows[0]; if (!l) return;
    await sendOrEdit(ctx, `ًں“‍ ${l.name}\n${l.link}`,
      Markup.inlineKeyboard([[Markup.button.callback(l.active ? "ًں”´ ط¥ط®ظپط§ط،" : "ًںں¢ ط¥ط¸ظ‡ط§ط±", `adm:contactToggle:${id}`), Markup.button.callback("ًں—‘ï¸ڈ ط­ط°ظپ", `adm:contactDel:${id}`)], [Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "adm:contacts")]]));
  });
  bot.action(/^adm:contactToggle:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const id = Number(ctx.match[1]); const l = (await q("SELECT active FROM contact_links WHERE id=$1", [id])).rows[0]; if (!l) return; await q("UPDATE contact_links SET active=$1 WHERE id=$2", [!l.active, id]); });
  bot.action(/^adm:contactDel:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; await q("DELETE FROM contact_links WHERE id=$1", [Number(ctx.match[1])]); await ctx.reply("ًں—‘ï¸ڈ طھظ… ط§ظ„ط­ط°ظپ."); });

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Admin: manual product categories أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
  bot.action("adm:manualCats", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const cats = (await q("SELECT * FROM manual_categories WHERE parent_id=0 ORDER BY position,id")).rows;
    const rows = cats.map(c => [
      Markup.button.callback(`${c.active ? "ًں“‚" : "ًں”’"} ${c.name}`, `mcat:${c.id}:1:0`)
    ]);
    rows.push([Markup.button.callback("â‍• ط¥ط¶ط§ظپط© ظ‚ط³ظ… ظٹط¯ظˆظٹ", "adm:addManualCat:0")]);
    rows.push([Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "adm:manualProds")]);
    await sendOrEdit(ctx, "ًں›چï¸ڈ ط£ظ‚ط³ط§ظ… ط§ظ„ظ…ظ†طھط¬ط§طھ ط§ظ„ظٹط¯ظˆظٹط©:", Markup.inlineKeyboard(rows));
  });
  bot.action(/^adm:manualCats:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const parentId = Number(ctx.match[1]);
    const parent = (await q("SELECT name FROM manual_categories WHERE id=$1", [parentId])).rows[0];
    const cats = (await q("SELECT * FROM manual_categories WHERE parent_id=$1 ORDER BY position,id", [parentId])).rows;
    const rows = cats.map(c => [Markup.button.callback(`${c.active ? "ًں“‚" : "ًں”’"} ${c.name}`, `mcat:${c.id}:1:${parentId}`)]);
    rows.push([Markup.button.callback("â‍• ط¥ط¶ط§ظپط© ظ‚ط³ظ… ظپط±ط¹ظٹ", `adm:addManualCat:${parentId}`)]);
    rows.push([Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", `mcat:${parentId}:1:0`)]);
    await sendOrEdit(ctx, `ًں“‚ ط£ظ‚ط³ط§ظ… ط¯ط§ط®ظ„ "${parent?.name ?? parentId}":`, Markup.inlineKeyboard(rows));
  });
  bot.action(/^adm:addManualCat:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    setStep(ctx.from.id, { kind: "admin:addManualCategory:name", parentId: Number(ctx.match[1]) });
    await ctx.reply("ًں›چï¸ڈ ط£ط±ط³ظ„ ط§ط³ظ… ظ‚ط³ظ… ط§ظ„ظ…ظ†طھط¬ط§طھ ط§ظ„ظٹط¯ظˆظٹط©:", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "adm:manualCats")]]));
  });
  bot.action(/^adm:mcatEdit:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    setStep(ctx.from.id, { kind: "admin:editManualCategoryName", categoryId: Number(ctx.match[1]) });
    await ctx.reply("âœڈï¸ڈ ط£ط±ط³ظ„ ط§ظ„ط§ط³ظ… ط§ظ„ط¬ط¯ظٹط¯ ظ„ظ„ظ‚ط³ظ… ط§ظ„ظٹط¯ظˆظٹ:");
  });
  bot.action(/^adm:mcatToggle:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const id = Number(ctx.match[1]);
    const cat = (await q("SELECT active FROM manual_categories WHERE id=$1", [id])).rows[0];
    if (!cat) { await ctx.reply("âڑ ï¸ڈ ط§ظ„ظ‚ط³ظ… ط؛ظٹط± ظ…ظˆط¬ظˆط¯."); return; }
    await q("UPDATE manual_categories SET active=$1,updated_at=NOW() WHERE id=$2", [!cat.active, id]);
    invalidateCaches();
    await ctx.reply(cat.active ? "ًں™ˆ طھظ… طھط¹ط·ظٹظ„ ط§ظ„ظ‚ط³ظ…." : "ًں‘پ طھظ… طھظپط¹ظٹظ„ ط§ظ„ظ‚ط³ظ….");
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
    await ctx.reply(`âœ… طھظ… ط¥ط®ط±ط§ط¬ ${moved.rows.length} ظ…ظ†طھط¬ط§ظ‹ ظ…ظ†  ط§ظ„ظ‚ط³ظ… ظˆ ط¬ط¹ظ„ظ‡ط§ ط¶ظ…ظ†  ط§ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط¹ط§ظ…ط©.`);
    await showManualCategory(ctx, rootId, 1, 0);
  });
  bot.action(/^adm:mcatDel:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const id = Number(ctx.match[1]);
    const cat = (await q("SELECT name FROM manual_categories WHERE id=$1", [id])).rows[0];
    if (!cat) { await ctx.reply("âڑ ï¸ڈ ط§ظ„ظ‚ط³ظ… ط؛ظٹط± ظ…ظˆط¬ظˆط¯."); return; }
    await sendOrEdit(ctx, `âڑ ï¸ڈ ط³ظٹطھظ… ط­ط°ظپ ط§ظ„ظ‚ط³ظ… "${cat.name}" ظˆ ظƒظ„ ط§ظ„ط£ظ‚ط³ط§ظ… ط§ظ„ظپط±ط¹ظٹط©.\nط³طھظڈظ†ظ‚ظ„ ط§ظ„ظ…ظ†طھط¬ط§طھ ط¥ظ„ظ‰ ط§ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط¹ط§ظ…ط©. ظ†طŒظ„ طھطھط§ط¨ط¹طں`,
      Markup.inlineKeyboard([
        [Markup.button.callback("âœ… ظ† ط¹ظ…طŒ ط§ط­ط°ظپ ط§ظ„ظ‚ط³ظ…", `adm:mcatDelConfirm:${id}`)],
        [Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", `mcat:${id}:1:0`)]
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
    await ctx.reply("âœ… طھظ… ط­ط°ظپ ط§ظ„ظ‚ط³ظ… ظˆ ظ†ظ‚ظ„ ظ…ظ†طھط¬ط§طھظ†طŒ ط¥ظ„ظ‰ ط§ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط¹ط§ظ…ط©.");
    await showCategory(ctx, 0, 1, 0);
  });

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Admin: virtual categories أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
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
    await ctx.reply(`âœ… طھظ… ط¥ط®ط±ط§ط¬ ${manual.rows.length + api.rows.length} ظ…ظ†طھط¬ط§ظ‹ ظ…ظ†  ط§ظ„ظ‚ط³ظ….`);
    await showVirtualCategory(ctx, rootId, 1, 0);
  });
  bot.action(/^adm:vcDel:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const id = Number(ctx.match[1]);
    const cat = (await q("SELECT name FROM virtual_categories WHERE id=$1", [id])).rows[0];
    if (!cat) { await ctx.reply("âڑ ï¸ڈ ط§ظ„ظ‚ط³ظ… ط؛ظٹط± ظ…ظˆط¬ظˆط¯."); return; }
    await sendOrEdit(ctx, `âڑ ï¸ڈ ط³ظٹطھظ… ط­ط°ظپ ط§ظ„ظ‚ط³ظ… "${cat.name}" ظˆ ظƒظ„ ط§ظ„ط£ظ‚ط³ط§ظ… ط§ظ„ظپط±ط¹ظٹط©.\nط³طھظڈظ†ظ‚ظ„ ط§ظ„ظ…ظ†طھط¬ط§طھ ط¥ظ„ظ‰ ط£ظ‚ط³ط§ظ…ظ†طŒط§ ط§ظ„ط£طµظ„ظٹط©/ط§ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط¹ط§ظ…ط©. ظ†طŒظ„ طھطھط§ط¨ط¹طں`,
      Markup.inlineKeyboard([
        [Markup.button.callback("âœ… ظ† ط¹ظ…طŒ ط§ط­ط°ظپ ط§ظ„ظ‚ط³ظ…", `adm:vcDelConfirm:${id}`)],
        [Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", `vcat:${id}:1:0`)]
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
    await ctx.reply("âœ… طھظ… ط­ط°ظپ ط§ظ„ظ‚ط³ظ… ظˆ ظ†ظ‚ظ„ ط§ظ„ظ…ظ†طھط¬ط§طھ ط®ط§ط±ط¬ظ†طŒ.");
    await showCategory(ctx, 0, 1, 0);
  });

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Admin: manual products أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
  bot.action("adm:manualProds", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const prods = (await q("SELECT * FROM manual_products ORDER BY id")).rows;
    const pendingCount = (await q("SELECT COUNT(*)::int AS c FROM manual_orders WHERE status='pending'")).rows[0]?.c ?? 0;
    const rows = prods.map(p => [Markup.button.callback(`${p.active ? "ًں›’" : "â‌Œ"} ${p.name}`, `adm:manualProd:${p.id}`)]);
    rows.push([Markup.button.callback(`ًں“‹ ط·ظ„ط¨ط§طھ ظ…ط¹ظ„ظ‚ط©${pendingCount > 0 ? ` (${pendingCount})` : ""}`, "adm:manualOrders")]);
    rows.push([Markup.button.callback("ًں›چï¸ڈ ط£ظ‚ط³ط§ظ… ط§ظ„ظ…ظ†طھط¬ط§طھ ط§ظ„ظٹط¯ظˆظٹط©", "adm:manualCats")]);
    rows.push([Markup.button.callback("â‍• ط¥ط¶ط§ظپط© ظ…ظ†طھط¬ ظٹط¯ظˆظٹ", "adm:addManual")]); rows.push([Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "admin:menu")]);
    await sendOrEdit(ctx, "ًں›’ ط§ظ„ظ…ظ†طھط¬ط§طھ ط§ظ„ظٹط¯ظˆظٹط©:", Markup.inlineKeyboard(rows));
  });
  bot.action("adm:addManual", async ctx => { if (!(await requireAdmin(ctx))) return; setStep(ctx.from.id, { kind: "admin:addManualProduct:name" }); await ctx.reply("ًں“‌ ط£ط±ط³ظ„ ط§ط³ظ… ط§ظ„ظ…ظ†طھط¬ ط§ظ„ظٹط¯ظˆظٹ:", Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "adm:manualProds")]])); });
  bot.action(/^adm:addManualInCat:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const categoryId = Number(ctx.match[1]);
    const cat = (await q("SELECT name FROM manual_categories WHERE id=$1", [categoryId])).rows[0];
    if (!cat) { await ctx.reply("âڑ ï¸ڈ ط§ظ„ظ‚ط³ظ… ط؛ظٹط± ظ…ظˆط¬ظˆط¯."); return; }
    setStep(ctx.from.id, { kind: "admin:addManualProduct:name", manualCategoryId: categoryId });
    await ctx.reply(`ًں“‌ ط£ط±ط³ظ„ ط§ط³ظ… ط§ظ„ظ…ظ†طھط¬ ظ„ط¥ط¶ط§ظپطھظ‡ ط¯ط§ط®ظ„ "${cat.name}":`, Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", `mcat:${categoryId}:1:0`)]]));
  });
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
      Markup.inlineKeyboard([[Markup.button.callback("âœ… ظ‚ط¨ظˆظ„ ظˆ طھط³ظ„ظٹظ…", `adm:mordAccept:${oid}`), Markup.button.callback("â‌Œ ط±ظپط¶ ظˆ ط§ط³طھط±ط¯ط§ط¯", `adm:mordReject:${oid}`)], [Markup.button.callback("ًں’¬ ط¥ط±ط³ط§ظ„ ط±ط³ط§ظ„ط©", `adm:mordMsg:${oid}`)], [Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "adm:manualOrders")]]));
  });
  bot.action(/^adm:mordAccept:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const oid = Number(ctx.match[1]); const o = (await q("SELECT * FROM manual_orders WHERE id=$1", [oid])).rows[0]; if (!o || o.status !== "pending") { await ctx.reply("âڑ ï¸ڈ طھظ… ظ…ط¹ط§ظ„ط¬طھظ†طŒ ظ…ط³ط¨ظ‚ط§ظ‹."); return; } setStep(ctx.from.id, { kind: "admin:manualOrderAccept", orderId: oid, userId: Number(o.user_id), productName: o.product_name, priceUsd: Number(o.price_usd) }); await ctx.reply(`âœڈï¸ڈ ط£ط±ط³ظ„ ط±ط³ط§ظ„ط© ط§ظ„طھط³ظ„ظٹظ… ط£ظˆ  "skip":`); });
  bot.action(/^adm:mordReject:(\d+)$/, async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const oid = Number(ctx.match[1]); const o = (await q("SELECT * FROM manual_orders WHERE id=$1", [oid])).rows[0]; if (!o || o.status !== "pending") { await ctx.reply("âڑ ï¸ڈ طھظ… ظ…ط¹ط§ظ„ط¬طھظ†طŒ."); return; }
    await q("UPDATE manual_orders SET status='rejected', updated_at=NOW() WHERE id=$1", [oid]);
    await adjustBalance(Number(o.user_id), Number(o.price_usd));
    await ctx.reply(`âœ… طھظ… ط§ظ„ط±ظپط¶ ظˆ ط¥ط¹ط§ط¯ط© ط§ظ„ط±طµظٹط¯.`);
    const rate = await getExchangeRate(); const syp = Math.round(Number(o.price_usd) * rate);
    // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ ظ„ط§ ظ† ط¹ط±ط¶ ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨ ظ„ظ„ظ…ط³طھط®ط¯ظ… أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
    await ctx.telegram.sendMessage(o.user_id, `â‌Œ طھظ… ط±ظپط¶ ط·ظ„ط¨ظƒ\nًں›’ ${o.product_name}\nًں’° طھظ…طھ ط¥ط¹ط§ط¯ط© ${Number(o.price_usd).toFixed(2)}$ | ${syp.toLocaleString("en-US")} ظ„.ط³`, Markup.inlineKeyboard([[Markup.button.callback("ًںڈ   ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]])).catch(() => {});
  });
  bot.action(/^adm:mordMsg:(\d+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const oid = Number(ctx.match[1]); const o = (await q("SELECT user_id FROM manual_orders WHERE id=$1", [oid])).rows[0]; if (!o) return; setStep(ctx.from.id, { kind: "admin:manualOrderMsg", orderId: oid, userId: Number(o.user_id) }); await ctx.reply(`ًں’¬ ط£ط±ط³ظ„ ط§ظ„ط±ط³ط§ظ„ط© ظ„ظ„ظ…ط³طھط®ط¯ظ… ${o.user_id}:`); });

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Admin: nav buttons أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
  bot.action("adm:btnLabels", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    const [b, h, p2, n] = await Promise.all([getBtnBackLabel(), getBtnHomeLabel(), getBtnPrevLabel(), getBtnNextLabel()]);
    await sendOrEdit(ctx, `ًں”ک ط£ط²ط±ط§ط± ط§ظ„طھظ†ظ‚ظ„:\nط±ط¬ظˆط¹: ${b}\nط§ظ„ط±ط¦ظٹط³ظٹط©: ${h}\nط§ظ„ط³ط§ط¨ظ‚: ${p2}\nط§ظ„طھط§ظ„ظٹ: ${n}`,
      Markup.inlineKeyboard([[Markup.button.callback("âœڈï¸ڈ ط²ط± ط§ظ„ط±ط¬ظˆط¹", "adm:btnEdit:btn_back_label:ط±ط¬ظˆط¹")], [Markup.button.callback("âœڈï¸ڈ ط²ط± ط§ظ„ط±ط¦ظٹط³ظٹط©", "adm:btnEdit:btn_home_label:ط§ظ„ط±ط¦ظٹط³ظٹط©")], [Markup.button.callback("âœڈï¸ڈ ط²ط± ط§ظ„ط³ط§ط¨ظ‚", "adm:btnEdit:btn_prev_label:ط§ظ„ط³ط§ط¨ظ‚")], [Markup.button.callback("âœڈï¸ڈ ط²ط± ط§ظ„طھط§ظ„ظٹ", "adm:btnEdit:btn_next_label:ط§ظ„طھط§ظ„ظٹ")], [Markup.button.callback("ًں”„ ط¥ط¹ط§ط¯ط© ط§ظ„ط§ظپطھط±ط§ط¶ظٹ", "adm:btnReset")], [Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "adm:settings")]]));
  });
  bot.action(/^adm:btnEdit:([^:]+):(.+)$/, async ctx => { if (!(await requireAdmin(ctx))) return; const key = ctx.match[1]; setStep(ctx.from.id, { kind: "admin:editBtnLabel", key }); await ctx.reply(`âœڈï¸ڈ ط£ط±ط³ظ„ ط§ظ„ظ† طµ ط§ظ„ط¬ط¯ظٹط¯ ظ„ظ„ط²ط±:`); });
  bot.action("adm:btnReset", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    await Promise.all(["btn_back_label", "btn_home_label", "btn_prev_label", "btn_next_label"].map(k => setSetting(k, DEFAULTS[k])));
    await ctx.reply("âœ… طھظ…طھ ط¥ط¹ط§ط¯ط© ط§ظ„ط£ط²ط±ط§ط± ظ„ظ„ط§ظپطھط±ط§ط¶ظٹ.");
  });

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Admin: AI support أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
  bot.action("adm:aiSupport", async ctx => {
    if (!(await requireAdmin(ctx))) return;
    clearAiHistory(ctx.from.id);
    setStep(ctx.from.id, { kind: "admin:aiSupport" });
    await ctx.reply(`ًں¤– ظ…ط³ط§ط¹ط¯ ط§ظ„ط¥ط¯ط§ط±ط©${hasAiKey() ? "" : " (ظˆط¶ط¹ FAQ)"}\nط£ط±ط³ظ„ ط³ط¤ط§ظ„ظƒ ط£ظˆ  "ط®ط±ظˆط¬" ظ„ظ„ط¥ظ† ظ†طŒط§ط،:`, Markup.inlineKeyboard([[Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "admin:menu")]]));
  });

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Photo handler أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
  bot.on("photo", async ctx => {
    const step = getStep(ctx.from.id);
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;

    if (step.kind === "admin:setMethodImage") {
      await q("UPDATE deposit_methods SET image_file_id=$1 WHERE id=$2", [fileId, step.methodId]);
      setStep(ctx.from.id, { kind: "idle" });
      await ctx.reply("âœ… طھظ… ط­ظپط¸ ط§ظ„طµظˆط±ط©. ط³طھط¸ظ†طŒط± ظ„ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†  ط¹ظ† ط¯ ط§ط®طھظٹط§ط± ظ†طŒط°ظ†طŒ ط§ظ„ط·ط±ظٹظ‚ط©.");
      return;
    }

    if (step.kind === "admin:addMethod:photo") {
      await q("INSERT INTO deposit_methods(name,identifier,instructions,image_file_id) VALUES($1,$2,$3,$4)",
        [step.name, step.identifier, step.instructions, fileId]);
      setStep(ctx.from.id, { kind: "idle" });
      await ctx.reply("âœ… طھظ… ط¥ط¶ط§ظپط© ط·ط±ظٹظ‚ط© ط§ظ„ط¥ظٹط¯ط§ط¹ ظ…ط¹ ط§ظ„طµظˆط±ط©.");
      return;
    }

    // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ طھط¯ظپظ‚ ط§ظ„ط¥ظٹط¯ط§ط¹ ط§ظ„ط¬ط¯ظٹط¯: ط§ط³طھظ„ط§ظ… ط§ظ„طµظˆط±ط© أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
    if (step.kind === "deposit:info") {
      // ط¥ط°ط§ ط£ط±ط³ظ„ ط§ظ„ظ…ط³طھط®ط¯ظ… ط§ظ„ظ…ط¨ظ„ط؛ ظپظٹ طھط¹ظ„ظٹظ‚ ط§ظ„طµظˆط±ط©طŒ ظ† ظ‚ط±ط£ظ†طŒ ظ…ط¨ط§ط´ط±ط©.
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
        // ظ„ط¯ظٹظ† ط§ ط§ظ„ظ…ط¨ظ„ط؛ ظˆ ط§ظ„طµظˆط±ط©طŒ ط§ظƒظ…ظ„ ط§ظ„ط·ظ„ط¨
        await completeDepositRequest(ctx, newStep);
      } else {
        // ط§ط³طھظ„ظ…ظ† ط§ ط§ظ„طµظˆط±ط© ظ‚ط¨ظ„ ط§ظ„ظ…ط¨ظ„ط؛طŒ ط§ط·ظ„ط¨ ط§ظ„ظ…ط¨ظ„ط؛
        setStep(ctx.from.id, newStep);
        await ctx.reply("ط£ط±ط³ظ„ ط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ط°ظٹ ظ‚ظ…طھ ط¨طھط­ظˆ ظٹظ„ظ†طŒ:",
          Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "dep:cancel")]]));
      }
      return;
    }
  });

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Text router أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
  bot.on("text", async (ctx, next) => {
    const step = getStep(ctx.from.id);
    const rawTxt = ctx.message.text.trim();
    const txt = repairArabicEncoding(rawTxt);

    // طھط­ظ‚ظ‚ ظ…ظ†  ط£ظ…ط± ط§ظ„ط¯ط®ظˆظ„ ط§ظ„ط³ط±ظٹ
    if (!txt.startsWith("/")) {
      const loginCmd = await getAdminLoginCommand();
      if (rawTxt === loginCmd) {
        await ensureUser(ctx);
        setStep(ctx.from.id, { kind: "admin:login" });
        await ctx.reply("ًں”‘ ط£ط±ط³ظ„ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±:");
        return;
      }
    }

    if (txt.startsWith("/")) return next();

    // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ طھط¯ظپظ‚ ط§ظ„ط¥ظٹط¯ط§ط¹ ط§ظ„ط¬ط¯ظٹط¯: ط§ط³طھظ„ط§ظ… ط§ظ„ظ…ط¨ظ„ط؛ أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
    if (step.kind === "deposit:info") {
      const exchangeRate = await getExchangeRate();
      const amount = extractAmountFromText(txt, exchangeRate);
      if (!amount || amount <= 0) {
        await ctx.reply("âڑ ï¸ڈ ظ„ظ… ط£ط³طھط·ط¹ ظپظ†طŒظ… ط§ظ„ظ…ط¨ظ„ط؛. ط£ط±ط³ظ„ظ†طŒ ط¨ط´ظƒظ„ ط£ظˆ ط¶ط­ (ظ…ط«ط§ظ„: 5$ ط£ظˆ  1000 ظ„.ط³).",
          Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "dep:cancel")]]));
        return;
      }
      const newStep = { ...step, amount };
      if (newStep.photoFileId) {
        // ظ„ط¯ظٹظ† ط§ ط§ظ„ظ…ط¨ظ„ط؛ ظˆ ط§ظ„طµظˆط±ط©طŒ ط§ظƒظ…ظ„ ط§ظ„ط·ظ„ط¨
        await completeDepositRequest(ctx, newStep);
      } else {
        setStep(ctx.from.id, newStep);
        await ctx.reply(`ط£ط±ط³ظ„ طµظˆ ط±ط© ط¥ط´ط¹ط§ط± ط§ظ„طھط­ظˆ ظٹظ„.`,
          Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "dep:cancel")]]));
      }
      return;
    }

    if (step.kind === "order:qty") {
      const n = Number(txt); if (!Number.isFinite(n) || n <= 0) { await ctx.reply("âڑ ï¸ڈ ط£ط¯ط®ظ„ ط±ظ‚ظ… طµط­ظٹط­ ظ…ظˆ ط¬ط¨."); return; }
      const qv = step.qtyValues; const qty = Array.isArray(qv) ? n : Math.floor(n);
      if (qv && !Array.isArray(qv)) { if (qty < qv.min || qty > qv.max) { await ctx.reply(`âڑ ï¸ڈ ط§ظ„ظƒظ…ظٹط© ط¨ظٹظ†  ${qv.min.toLocaleString("en-US")} ظˆ  ${qv.max.toLocaleString("en-US")}.`); return; } }
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
         await ctx.reply("â‌Œ ط±طµظٹط¯ ط؛ظٹط± ظƒط§ظپظچ  ط­ط§ظ„ظٹط§ظ‹. ط­ط§ظˆ ظ„ طھط­ط¯ظٹط« ط§ظ„ط±طµظٹط¯ ط«ظ… ط£ط¹ط¯ ط§ظ„ط·ظ„ط¨.");
         return;
       }
      const ins = await q("INSERT INTO manual_orders(user_id,product_id,product_name,price_usd,note) VALUES($1,$2,$3,$4,$5) RETURNING *",
        [ctx.from.id, m.id, m.name, m.price_usd, note]);
      const ord = ins.rows[0];
      setStep(ctx.from.id, { kind: "idle" });
      // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ ظ„ط§ ظ† ط¹ط±ط¶ ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨ ظ„ظ„ظ…ط³طھط®ط¯ظ… أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
      await ctx.reply(`âœ… طھظ… ط§ط³طھظ„ط§ظ… ط·ظ„ط¨ظƒ\nًں›’ ${m.name}\nط³ظٹطھظ… ط§ظ„طھظ†ظپظٹط° ظپظٹ ط£ظ‚ط±ط¨ ظˆظ‚طھ.`, Markup.inlineKeyboard([[Markup.button.callback("ًںڈ   ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]]));
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
        if (rawTxt !== expected) {
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
      case "admin:setSocialMarkup": { const n = Number(txt); if (!Number.isFinite(n) || n < 0) { await ctx.reply("âڑ ï¸ڈ ط£ط¯ط®ظ„ ط±ظ‚ظ…ط§ظ‹ طµط§ظ„ط­ط§ظ‹."); return; } await setSetting("social_markup_percent", String(n)); invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`âœ… ط±ط¨ط­ ط§ظ„ط³ظˆ ط´ظ„: ${n}%.`); await showSettingsMenu(ctx); return; }
      case "admin:setRate": { const n = Number(txt); if (!Number.isFinite(n) || n <= 0) { await ctx.reply("âڑ ï¸ڈ ط³ط¹ط± طµط±ظپ ط؛ظٹط± طµط§ظ„ط­."); return; } await setSetting("exchange_rate", String(n)); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`âœ… ط³ط¹ط± ط§ظ„طµط±ظپ: ${n} ظ„.ط³/$.`); await showSettingsMenu(ctx); return; }
      case "admin:newPassword": { if (rawTxt.length < 4) { await ctx.reply("âڑ ï¸ڈ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ظ‚طµظٹط±ط© ط¬ط¯ط§ظ‹."); return; } await setSetting("admin_password", rawTxt); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ… طھط­ط¯ظٹط« ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±."); return; }
      case "admin:changeLoginCmd": {
        if (rawTxt.length < 5) { await ctx.reply("âڑ ï¸ڈ ط§ظ„ط£ظ…ط± ظ‚طµظٹط± ط¬ط¯ط§ظ‹ (5 ط£ط­ط±ظپ ط¹ظ„ظ‰ ط§ظ„ط£ظ‚ظ„)."); return; }
        await setSetting("admin_login_command", rawTxt); setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(`âœ… طھظ… طھط؛ظٹظٹط± ط£ظ…ط± ط§ظ„ط¯ط®ظˆظ„.`, { parse_mode: "Markdown" }); return;
      }
      case "admin:depositApproveAmount": {
        const n = Number(txt); if (!Number.isFinite(n) || n <= 0) { await ctx.reply("âڑ ï¸ڈ ط£ط¯ط®ظ„ ظ…ط¨ظ„ط؛ط§ظ‹ طµط§ظ„ط­ط§ظ‹."); return; }
        const updated = await q("UPDATE deposit_requests SET status='approved', amount=$1, processed_by=$2, processed_at=NOW() WHERE id=$3 AND status='pending' RETURNING *", [String(n), ctx.from.id, step.depositId]);
        if (!updated.rows.length) { setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âڑ ï¸ڈ طھظ…طھ ظ…ط¹ط§ظ„ط¬ط© ظ‡ط°ط§ ط§ظ„ط·ظ„ط¨ ظ…ط³ط¨ظ‚ط§ظ‹ ط¨ظˆ ط§ط³ط·ط© ظ…ط¯ظٹط± ط¢ط®ط±."); return; }
        const d = updated.rows[0];
        await adjustBalance(d.user_id, n);
        await clearDepositForOtherAdmins(ctx.from.id, step.depositId, `âœ… ط·ظ„ط¨ ط¥ظٹط¯ط§ط¹ â€” طھظ…طھ ط§ظ„ظ…ظˆط§ظپظ‚ط© (+${n}$)`);
        setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(`âœ… طھظ…طھ ط¥ط¶ط§ظپط© ${n}$ ظ„ظ„ظ…ط³طھط®ط¯ظ… ${d.user_id}.`);
        // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ ط±ط³ط§ظ„ط© ظˆ ط§ط¶ط­ط© ظ„ظ„ظ…ط³طھط®ط¯ظ… ط¨ط¯ظˆ ظ†  ط±ظ‚ظ… ط·ظ„ط¨ أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
        try { await ctx.telegram.sendMessage(d.user_id, `âœ… طھظ… ظ‚ط¨ظˆظ„ ط·ظ„ط¨ ط¥ظٹط¯ط§ط¹ظƒطŒ ظˆ طھظ…طھ ط¥ط¶ط§ظپط© ${n}$ ط¥ظ„ظ‰ ط±طµظٹط¯ظƒ.`); } catch { /* ignore */ }
        return;
      }
      case "admin:userBalance": {
        const n = Number(txt); if (!Number.isFinite(n) || n <= 0) { await ctx.reply("âڑ ï¸ڈ ط£ط¯ط®ظ„ ظ…ط¨ظ„ط؛ط§ظ‹ طµط§ظ„ط­ط§ظ‹."); return; }
        const delta = step.mode === "add" ? n : -n; await adjustBalance(step.userId, delta); setStep(ctx.from.id, { kind: "idle" });
        const u = await getUser(step.userId); await ctx.reply(`âœ… طھظ… ط§ظ„طھط¹ط¯ظٹظ„. ط§ظ„ط±طµظٹط¯ ط§ظ„ط¬ط¯ظٹط¯: ${u ? Number(u.balance).toFixed(2) : "?"}$`);
        try { await ctx.telegram.sendMessage(step.userId, step.mode === "add" ? `ًں’° طھظ…طھ ط¥ط¶ط§ظپط© ${n}$ ط¥ظ„ظ‰ ط±طµظٹط¯ظƒ.` : `ظ‹ع؛أ¢أ¢â€ڑآ¬أ¢â€‍آ¢آ¸ طھظ… ط®طµظ… ${n}$ ظ…ظ†  ط±طµظٹط¯ظƒ.`); } catch { /* ignore */ }
        return;
      }
      case "admin:findUser": { const found = await searchUser(txt); setStep(ctx.from.id, { kind: "idle" }); if (!found.length) { await ctx.reply("âڑ ï¸ڈ ظ„ط§ ظٹظˆط¬ط¯ ظ† طھط§ط¦ط¬."); return; } const kb = found.map(u => [Markup.button.callback(`${u.first_name ?? "â€”"}${u.username ? " @" + u.username : ""} â€¢ ${Number(u.balance).toFixed(2)}$`, `adm:user:${u.id}`)]); kb.push([Markup.button.callback("â¬…ï¸ڈ ط±ط¬ظˆط¹", "admin:menu")]); await ctx.reply(`ظ† طھط§ط¦ط¬ (${found.length}):`, Markup.inlineKeyboard(kb)); return; }
      case "admin:editPrice": {
        if (txt.toLowerCase() === "reset") {
          await q("INSERT INTO product_overrides(product_id,product_name) VALUES($1,$2) ON CONFLICT(product_id) DO UPDATE SET custom_markup_percent=NULL, custom_price_usd=NULL, updated_at=NOW()", [step.productId, step.productName]);
          invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ…طھ ط¥ط¹ط§ط¯ط© ط§ظ„ط³ط¹ط± ظ„ظ„ط§ظپطھط±ط§ط¶ظٹ."); return;
        }
        const m = txt.match(/^([%$])\s*(-?\d+(\.\d+)?)$/);
        if (!m) { await ctx.reply("âڑ ï¸ڈ طµظٹط؛ط© ط؛ظٹط± طµط­ظٹط­ط©. ظ…ط«ط§ظ„: `%5` ط£ظˆ  `$2.5`."); return; }
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
          invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ…طھ ط¥ط¹ط§ط¯ط© ط§ظ„ظ…ظ†طھط¬ ظ„ظ‚ط³ظ…ظ†طŒ ط§ظ„ط£طµظ„ظٹ."); return;
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
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`âœ… طھظ… طھط¹ظٹظٹظ†  ط§ظ„طھط±طھظٹط¨: ${n}.`); return;
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
        if (!Number.isFinite(targetParent)) { await ctx.reply("âڑ ï¸ڈ ط±ظ‚ظ… ط§ظ„ظ‚ط³ظ… ط؛ظٹط± طµط§ظ„ط­. ط£ط±ط³ظ„ 0 ظ„ظ„ط¬ط°ط± ط£ظˆ  ط±ظ‚ظ… ط§ظ„ظ‚ط³ظ…."); return; }
        const parentVal = targetParent === 0 ? null : targetParent;
        await q("INSERT INTO category_overrides(category_id,custom_parent_id) VALUES($1,$2) ON CONFLICT(category_id) DO UPDATE SET custom_parent_id=$2, updated_at=NOW()", [step.categoryId, parentVal]);
        invalidateCaches(); setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(parentVal ? `âœ… طھظ… ظ†ظ‚ظ„ ط§ظ„ظ‚ط³ظ… ط¥ظ„ظ‰ ط¯ط§ط®ظ„ ط§ظ„ظ‚ط³ظ… ${parentVal}.` : `âœ… طھظ… ظ†ظ‚ظ„ ط§ظ„ظ‚ط³ظ… ط¥ظ„ظ‰ ط§ظ„ظ…ط³طھظˆ ظ‰ ط§ظ„ط±ط¦ظٹط³ظٹ.`); return;
      }
      case "admin:userMessage": {
        if (!txt) { await ctx.reply("âڑ ï¸ڈ ط§ظ„ط±ط³ط§ظ„ط© ظپط§ط±ط؛ط©."); return; }
        try {
          await ctx.telegram.sendMessage(step.userId, `ًں’¬ ط±ط³ط§ظ„ط© ظ…ظ†  ط§ظ„ط¥ط¯ط§ط±ط©:\n\n${txt}`);
          await q("INSERT INTO admin_messages(admin_id,user_id,message) VALUES($1,$2,$3)", [ctx.from.id, step.userId, txt]);
          setStep(ctx.from.id, { kind: "idle" });
          await ctx.reply("âœ… طھظ… ط¥ط±ط³ط§ظ„ ط§ظ„ط±ط³ط§ظ„ط© ظ„ظ„ظ…ط³طھط®ط¯ظ… ط¨ط´ظƒظ„ ط®ط§طµ.");
        } catch {
          setStep(ctx.from.id, { kind: "idle" });
          await ctx.reply("â‌Œ طھط¹ط°ط± ط¥ط±ط³ط§ظ„ ط§ظ„ط±ط³ط§ظ„ط©. ط±ط¨ظ…ط§ ط§ظ„ظ…ط³طھط®ط¯ظ… ط­ط¸ط± ط§ظ„ط¨ظˆطھ.");
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
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`âœ… طھظ… ط§ظ„ط¥ط±ط³ط§ظ„ ظ„ظ€ ${sent} ظ…ط³طھط®ط¯ظ….`); return;
      }
      case "admin:addMethod:name": { setStep(ctx.from.id, { kind: "admin:addMethod:id", name: txt }); await ctx.reply("ًں”‘ ط£ط±ط³ظ„ ط§ظ„ظ…ط¹ط±ظپ/ط§ظ„ط±ظ‚ظ…:"); return; }
      case "admin:addMethod:id": { setStep(ctx.from.id, { kind: "admin:addMethod:instr", name: step.name, identifier: txt }); await ctx.reply("ًں“‹ ط£ط±ط³ظ„ ط§ظ„طھط¹ظ„ظٹظ…ط§طھ:"); return; }
      case "admin:addMethod:instr": {
        setStep(ctx.from.id, { kind: "admin:addMethod:photo", name: step.name, identifier: step.identifier, instructions: txt });
        await ctx.reply("ًں–¼ ط£ط±ط³ظ„ طµظˆ ط±ط© ظ„ط·ط±ظٹظ‚ط© ط§ظ„ط¥ظٹط¯ط§ط¹ ط£ظˆ  ط§ظƒطھط¨ *skip* ظ„طھط®ط·ظ‘ظٹ:", { parse_mode: "Markdown" }); return;
      }
      case "admin:addMethod:photo": {
        if (txt.toLowerCase() === "skip") {
          await q("INSERT INTO deposit_methods(name,identifier,instructions) VALUES($1,$2,$3)", [step.name, step.identifier, step.instructions]);
          setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ… ط¥ط¶ط§ظپط© ط·ط±ظٹظ‚ط© ط§ظ„ط¥ظٹط¯ط§ط¹ ط¨ط¯ظˆ ظ†  طµظˆ ط±ط©."); return;
        }
        await ctx.reply("âڑ ï¸ڈ ط£ط±ط³ظ„ طµظˆ ط±ط© ط£ظˆ  ط§ظƒطھط¨ *skip* ظ„طھط®ط·ظ‘ظٹ.", { parse_mode: "Markdown" }); return;
      }
      case "admin:addApi:name": {
        if (!txt.trim()) { await ctx.reply("â‌Œ ط§ط³ظ… ط§ظ„ظ€API ظ„ط§ ظٹظ…ظƒط¸أ¢â‚¬  ط£ط¸أ¢â‚¬  ظٹظƒظˆط¸أ¢â‚¬  ظپط§ط±ط؛ط§ظ‹."); return; }
        setStep(ctx.from.id, { kind: "admin:addApi:base", name: txt.trim() });
        await ctx.reply(
          "ظ‹ع؛أ¢â‚¬â€Œإ’ ط£ط±ط³ظ„ ط±ط§ط¨ط· ط§ظ„ظ€API ط§ظ„ط¬ط¯ظٹط¯.\nظ…ط«ط§ظ„ طھط¬ط±ظٹط¨ظٹ: https://api.example.com",
          Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "adm:apis")]])
        );
        return;
      }
      case "admin:addApi:base": {
        const baseUrl = normalizeApiBase(txt);
        if (!/^https?:\/\/\S+$/i.test(baseUrl)) {
          await ctx.reply("â‌Œ ط£ط±ط³ظ„ ط±ط§ط¨ط· API طµط­ظٹط­ط§ظ‹ ظٹط¨ط¯ط£ ط¨ظ€ https:// ط£ظˆ http://.");
          return;
        }
        setStep(ctx.from.id, { kind: "admin:addApi:token", name: step.name, baseUrl });
        await ctx.reply(
          "ًں”‘ ط£ط±ط³ظ„ API token ظپظ‚ط·.\nط³ظٹطھظ… ط¬ظ„ط¨ ط§ظ„ظ…ظ†طھط¬ط§طھ ظ…ط¨ط§ط´ط±ط© ظ…ط¸أ¢â‚¬  ظ‡ط°ط§ ط§ظ„ط±ط§ط¨ط· ظˆظ…ط²ط§ظ…ط¸أ¢â‚¬ طھظ‡ط§ ظ…ط¹ ظƒطھط§ظ„ظˆط¬ ط§ظ„ظ€API ط§ظ„ط£ط³ط§ط³ظٹ.\nظ„ط¸أ¢â‚¬  ظٹط¸ظ‡ط± ط§ظ„ظ€token ظ„ظ„ظ…ط³طھط®ط¯ظ…ظٹط¸أ¢â‚¬  ظˆط³ظٹظڈط­ظپط¸ ظ…ط´ظپط±ط§ظ‹.",
          Markup.inlineKeyboard([[Markup.button.callback("â‌Œ ط¥ظ„ط؛ط§ط،", "adm:apis")]])
        );
        return;
      }
      case "admin:addApi:token": {
        if (!txt) { await ctx.reply("âڑ ï¸ڈ ط§ظ„ظ€API token ظ„ط§ ظٹظ…ظƒظ†  ط£ظ†  ظٹظƒظˆ ظ†  ظپط§ط±ط؛ط§ظ‹."); return; }
        const draft = {
          id: 0,
          name: step.name,
          base_url: step.baseUrl,
          token_encrypted: encryptApiToken(rawTxt),
          active: true,
          is_primary: false,
        };
        try {
          // ط§ط®طھط¨ط± ط§ظ„ظ€API ظ‚ط¨ظ„ ط¥ظ† ط´ط§ط، ط§ظ„ط³ط¬ظ„ ط­طھظ‰ ظ„ط§ ظٹط¨ظ‚ظ‰ API ظپط§ط±ط؛ط§ظ‹ ط¹ظ† ط¯ ظپط´ظ„ ط§ظ„طھظˆط«ظٹظ‚.
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
          await ctx.reply(`âœ… طھظ…طھ ط¥ط¶ط§ظپط© ${step.name} ظˆ ظ…ط²ط§ظ…ظ† ط© ${count} ظ…ظ†طھط¬.`);
        } catch (err) {
          setStep(ctx.from.id, { kind: "idle" });
          await ctx.reply(`â‌Œ ظپط´ظ„طھ ط¥ط¶ط§ظپط© ط§ظ„ظ€API ظˆ ظ„ظ… ظٹطھظ… ط­ظپط¸ظ†طŒ ظ„ط£ظ† ظ†طŒ ظپط§ط±ط؛ ط£ظˆ  ظپط´ظ„ ط§ظ„طھظˆط«ظٹظ‚.\nط§ظ„ط³ط¨ط¨: ${String(err?.message ?? err).slice(0, 180)}`);
        }
        await showApiSources(ctx);
        return;
      }
      case "admin:renameApi": {
        if (!(await requireSuperAdmin(ctx))) return;
        const value = txt.trim();
        if (!value) { await ctx.reply("âڑ ï¸ڈ ط§ظ„ط§ط³ظ… ظ„ط§ ظٹظ…ظƒظ†  ط£ظ†  ظٹظƒظˆ ظ†  ظپط§ط±ط؛ط§ظ‹."); return; }
        await q("UPDATE api_sources SET name=$1,updated_at=NOW() WHERE id=$2", [value, step.sourceId]);
        invalidateCaches();
        setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply("âœ… طھظ… طھط؛ظٹظٹط± ط§ط³ظ… API.");
        await showApiSources(ctx);
        return;
      }
      case "admin:editMethodInstructions": {
        await q("UPDATE deposit_methods SET instructions=$1 WHERE id=$2", [txt, step.methodId]);
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ… طھط­ط¯ظٹط« ط§ظ„طھط¹ظ„ظٹظ…ط§طھ."); return;
      }
      case "admin:addContact:name": { setStep(ctx.from.id, { kind: "admin:addContact:link", name: txt }); await ctx.reply("ًں”— ط£ط±ط³ظ„ ط§ظ„ط±ط§ط¨ط· ط£ظˆ  @username:"); return; }
      case "admin:addContact:link": {
        await q("INSERT INTO contact_links(name,link) VALUES($1,$2)", [step.name, txt]);
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ… ط¥ط¶ط§ظپط© ظˆ ط³ظٹظ„ط© ط§ظ„طھظˆط§طµظ„."); return;
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
      case "admin:addManualProduct:name": {
        setStep(ctx.from.id, {
          kind: "admin:addManualProduct:price",
          name: txt,
          manualCategoryId: step.manualCategoryId ?? 0,
        });
        await ctx.reply("ًں’µ ط£ط±ط³ظ„ ط§ظ„ط³ط¹ط± ط¨ط§ظ„ط¯ظˆ ظ„ط§ط±:");
        return;
      }
      case "admin:addManualProduct:price": {
        const price = Number(txt); if (!Number.isFinite(price) || price < 0) { await ctx.reply("âڑ ï¸ڈ ط³ط¹ط± ط؛ظٹط± طµط§ظ„ط­."); return; }
        if (step.manualCategoryId > 0) {
          await q(
            "INSERT INTO manual_products(name,category_id,category_is_virtual,price_usd) VALUES($1,$2,true,$3)",
            [step.name, step.manualCategoryId, String(price)]
          );
          invalidateCaches();
          setStep(ctx.from.id, { kind: "idle" });
          await ctx.reply("âœ… طھظ… ط¥ط¶ط§ظپط© ط§ظ„ظ…ظ†طھط¬ ط¯ط§ط®ظ„ ط§ظ„ظ‚ط³ظ… ط§ظ„ظٹط¯ظˆظٹ.");
          return;
        }
        setStep(ctx.from.id, { kind: "admin:addManualProduct:category", name: step.name, price });
        const cats = (await q("SELECT id,name FROM manual_categories ORDER BY id")).rows;
        const catText = cats.length
          ? cats.map(c => `${c.id}: ${c.name}`).join("\n")
          : "ظ„ط§ طھظˆط¬ط¯ ط£ظ‚ط³ط§ظ… ط¨ط¹ط¯";
        await ctx.reply(`ًں“‚ ط£ط±ط³ظ„ ط±ظ‚ظ… ط§ظ„ظ‚ط³ظ… ط§ظ„ظٹط¯ظˆظٹطŒ ط£ظˆ  0 ظ„ظˆط¶ط¹ ط§ظ„ظ…ظ†طھط¬ ظپظٹ ط§ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط¹ط§ظ…ط©:\n\n${catText}`);
        return;
      }
      case "admin:addManualProduct:category": {
        const categoryId = Number(txt);
        if (!Number.isInteger(categoryId) || categoryId < 0) {
          await ctx.reply("âڑ ï¸ڈ ط£ط±ط³ظ„ ط±ظ‚ظ… ظ‚ط³ظ… طµط­ظٹط­ ط£ظˆ  0 ظ„ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط¹ط§ظ…ط©.");
          return;
        }
        if (categoryId > 0) {
          const cat = (await q("SELECT id FROM manual_categories WHERE id=$1", [categoryId])).rows[0];
          if (!cat) { await ctx.reply("âڑ ï¸ڈ ظ‡ط°ط§ ط§ظ„ظ‚ط³ظ… ط؛ظٹط± ظ…ظˆط¬ظˆط¯. ط£ط±ط³ظ„ ط±ظ‚ظ…ط§ظ‹ ظ…ظ†  ط§ظ„ظ‚ط§ط¦ظ…ط©."); return; }
        }
        await q(
          "INSERT INTO manual_products(name,category_id,category_is_virtual,price_usd) VALUES($1,$2,$3,$4)",
          [step.name, categoryId, categoryId > 0, String(step.price)]
        );
        invalidateCaches();
        setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply(categoryId > 0 ? "âœ… طھظ… ط¥ط¶ط§ظپط© ط§ظ„ظ…ظ†طھط¬ ط¯ط§ط®ظ„ ط§ظ„ظ‚ط³ظ… ط§ظ„ظٹط¯ظˆظٹ." : "âœ… طھظ… ط¥ط¶ط§ظپط© ط§ظ„ظ…ظ†طھط¬ ط§ظ„ظٹط¯ظˆظٹ ط¥ظ„ظ‰ ط§ظ„ظ‚ط§ط¦ظ…ط© ط§ظ„ط¹ط§ظ…ط©.");
        return;
      }
      case "admin:addManualCategory:name": {
        const parentId = Number(step.parentId ?? 0);
        const pos = (await q("SELECT COALESCE(MAX(position),0)+1 AS p FROM manual_categories WHERE parent_id=$1", [parentId])).rows[0]?.p ?? 1;
        await q("INSERT INTO manual_categories(name,parent_id,position) VALUES($1,$2,$3)", [txt, parentId, pos]);
        setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply("âœ… طھظ… ط¥ظ†ط´ط§ط، ظ‚ط³ظ… ط§ظ„ظ…ظ†طھط¬ط§طھ ط§ظ„ظٹط¯ظˆظٹط©.");
        await showManualCategory(ctx, parentId, 1, 0);
        return;
      }
      case "admin:editManualCategoryName": {
        await q("UPDATE manual_categories SET name=$1,updated_at=NOW() WHERE id=$2", [txt, step.categoryId]);
        setStep(ctx.from.id, { kind: "idle" });
        await ctx.reply("âœ… طھظ… طھط؛ظٹظٹط± ط§ط³ظ… ط§ظ„ظ‚ط³ظ… ط§ظ„ظٹط¯ظˆظٹ.");
        return;
      }
      case "admin:manualOrderAccept": {
        const delivery = txt.toLowerCase() === "skip" ? null : txt;
        await q("UPDATE manual_orders SET status='accepted', admin_note=$1, updated_at=NOW() WHERE id=$2", [delivery, step.orderId]);
        setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ… ظ‚ط¨ظˆظ„ ط§ظ„ط·ظ„ط¨.");
        if (step.userId) {
          // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ ظ„ط§ ظ† ط¹ط±ط¶ ط±ظ‚ظ… ط§ظ„ط·ظ„ط¨ ظ„ظ„ظ…ط³طھط®ط¯ظ… أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
          const msg = delivery ? `âœ… طھظ… طھظ†ظپظٹط° ط·ظ„ط¨ظƒ\nًں›’ ${step.productName}\n\nًں“¦ ${delivery}` : `âœ… طھظ… طھظ†ظپظٹط° ط·ظ„ط¨ظƒ\nًں›’ ${step.productName}`;
          await ctx.telegram.sendMessage(step.userId, msg, Markup.inlineKeyboard([[Markup.button.callback("ًںڈ   ط§ظ„ط±ط¦ظٹط³ظٹط©", "home")]])).catch(() => {});
        }
        return;
      }
      case "admin:manualOrderMsg": {
        if (step.userId) {
          await ctx.telegram.sendMessage(step.userId, `ًں’¬ ط±ط³ط§ظ„ط© ظ…ظ†  ط§ظ„ط¥ط¯ط§ط±ط©:\n${txt}`).catch(() => {});
          await q("INSERT INTO admin_messages(admin_id,user_id,message) VALUES($1,$2,$3)", [ctx.from.id, step.userId, txt]);
        }
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
      case "admin:pingTarget": { await setSetting("auto_ping_target_user_id", txt.replace(/\D/g, "")); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ… طھط¹ظٹظٹظ†  ط§ظ„ظ…ط³طھظ‡ط¯ظپ."); return; }
      case "admin:pingInterval": { const n = Number(txt); if (!Number.isFinite(n) || n < 1) { await ctx.reply("âڑ ï¸ڈ ط±ظ‚ظ… ط؛ظٹط± طµط§ظ„ط­."); return; } await setSetting("auto_ping_interval_min", String(n)); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply(`âœ… ط§ظ„ظپط§طµظ„: ${n} ط¯ظ‚ظٹظ‚ط©.`); return; }
      case "admin:editBtnLabel": { await setSetting(step.key, txt); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("âœ… طھظ… طھط­ط¯ظٹط« ط§ظ„ط²ط±."); return; }
      case "admin:aiSupport": {
        if (txt === "ط®ط±ظˆط¬" || txt.toLowerCase() === "exit") { clearAiHistory(ctx.from.id); setStep(ctx.from.id, { kind: "idle" }); await ctx.reply("ًںڑھ طھظ… ط¥ظ† ظ†طŒط§ط، ط¬ظ„ط³ط© ط§ظ„ط°ظƒط§ط، ط§ظ„ط§طµط·ظ†ط§ط¹ظٹ."); return; }
        const reply = await callAiSupport(ctx.from.id, txt);
        await ctx.reply(reply, { parse_mode: "Markdown" }); return;
      }
      default: return next();
    }
  });

  bot.catch(async (err, ctx) => {
    console.error("Telegraf error:", err?.message ?? err);
    try {
      if (ctx?.callbackQuery) await ctx.answerCbQuery("âڑ ï¸ڈ ط­ط¯ط« ط®ط·ط£ ظ…ط¤ظ‚طھطŒ ط­ط§ظˆ ظ„ ظ…ط±ط© ط£ط®ط±ظ‰.").catch(() => {});
      else if (ctx?.chat) await ctx.reply("âڑ ï¸ڈ ط­ط¯ط« ط®ط·ط£ ظ…ط¤ظ‚طھ. ط­ط§ظˆ ظ„ ظ…ط±ط© ط£ط®ط±ظ‰ ط¨ط¹ط¯ ظ„ط­ط¸ط§طھ.").catch(() => {});
    } catch { /* ظ„ط§ ظ† ط³ظ…ط­ ظ„ط®ط·ط£ ط§ظ„ط¥ط´ط¹ط§ط± ط¨ط¥ظٹظ‚ط§ظپ ط§ظ„ظ…ط¹ط§ظ„ط¬ */ }
  });

  void bot.telegram.setMyCommands([
    { command: "start", description: "ًںڑ€ ط¨ط¯ط،" },
    { command: "menu", description: "ًں“‹ ط§ظ„ظ‚ط§ط¦ظ…ط©" },
    { command: "balance", description: "ًں’° ط±طµظٹط¯ظٹ" },
    { command: "deposit", description: "ًں’³ ط¥ظٹط¯ط§ط¹" },
    { command: "orders", description: "ًں“¦ ط·ظ„ط¨ط§طھظٹ" },
    { command: "support", description: "ًں“‍ ط§ظ„ط¯ط¹ظ…" },
  ]).catch(err => console.error("setMyCommands failed:", err?.message ?? err));

  // أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ طھط³ط®ظٹظ†  ط§ظ„ظƒط§ط´ ظ…ط¨ظƒط±ط§ظ‹ ظ„طھط³ط±ظٹط¹ ط£ظˆ ظ„ ط§ط³طھط¬ط§ط¨ط© أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
  getCachedProducts().catch(() => {}); getAllOverridesCached().catch(() => {}); getCachedContent(0).catch(() => {});
  startBackgroundRefresher();
  void syncAllApiSources().catch(err => console.error("Initial product sync failed:", err?.message ?? err));

  let telegramShutdownRequested = false;
  const shouldStopTelegram = () => telegramShutdownRequested;

  // ط¥ط¹ط¯ط§ط¯ polling طµط±ظٹط­: Telegraf ظٹط³طھط®ط¯ظ… timeout=50 ظپظٹ ط·ظ„ط¨ getUpdates.
  // ظ„ط§ ظ† ط­ط°ظپ ط§ظ„طھط­ط¯ظٹط«ط§طھ ط§ظ„ظ…ط¹ظ„ظ‚ط© ط¹ظ† ط¯ ط¥ط¹ط§ط¯ط© ط§ظ„ط§طھطµط§ظ„ ط­طھظ‰ ظ„ط§ طھط¶ظٹط¹ ط±ط³ط§ط¦ظ„ ط§ظ„ظ…ط³طھط®ط¯ظ….
  const pollingConfig = {
    timeout: 50,
    dropPendingUpdates: false,
    allowedUpdates: ["message", "callback_query"],
  };

  const stopTelegram = reason => {
    telegramShutdownRequested = true;
    // ظپظٹ ظˆط¶ط¹ webhook ظ„ط§ ظٹظ† ط´ط¦ Telegraf ط®ط§ط¯ظ…ط§ظ‹ ط¯ط§ط®ظ„ظٹط§ظ‹.
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
      console.log("âœ… Telegram webhook set successfully");
    } catch (err) {
      // ط¥ط°ط§ ظƒط§ظ†  ط±ط§ط¨ط· Railway ط؛ظٹط± طµط­ظٹط­ ظ† ط¹ظˆ ط¯ ط¥ظ„ظ‰ polling ظ…ط¹ ط¥ط¹ط§ط¯ط© ط§طھطµط§ظ„ ظ…ط³طھظ…ط±ط©.
      console.error("setWebhook failed, switching to reconnecting polling:", err?.message ?? err);
      await bot.telegram.deleteWebhook().catch(() => {});
      void runPollingWithReconnect(bot, pollingConfig, shouldStopTelegram);
    }
  } else {
    // ط£ط²ظ„ ط£ظٹ Webhook ظ‚ط¯ظٹظ… ظ‚ط¨ظ„ طھط´ط؛ظٹظ„ pollingط› ظˆط¬ظˆط¯ظ‡ ظٹظ…ط¸أ¢â‚¬ ط¹ Telegram ظ…ط¸أ¢â‚¬  طھط³ظ„ظٹظ… ط§ظ„طھط­ط¯ظٹط«ط§طھ.
    await bot.telegram.deleteWebhook({ drop_pending_updates: false }).catch(err => {
      console.error("deleteWebhook before polling failed:", err?.message ?? err);
    });
    // ظ„ط§ ط¸أ¢â‚¬ طھط±ظƒ ط±ظپط¶ bot.launch ظٹط¸أ¢â‚¬ ظ‡ظٹ polling ظ†ظ‡ط§ط¦ظٹط§ظ‹ ط¨ط¹ط¯ timeout ط£ظˆ ط§ط¸أ¢â‚¬ ظ‚ط·ط§ط¹ ظ…ط¤ظ‚طھ.
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

  console.log("âœ… ط§ظ„ط¨ظˆطھ ظٹط¹ظ…ظ„ ط¨ظ†ط¬ط§ط­! (v2.3)");
  return bot;
}

// أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Express health server + webhook receiver أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
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
    // ط§ظ„ط±ط¯ ظ…ط¨ط§ط´ط±ط© ط¹ظ„ظ‰ Telegram ظٹظ…ظ† ط¹ ط¥ط¹ط§ط¯ط© ط¥ط±ط³ط§ظ„ ظ† ظپط³ ط§ظ„طھط­ط¯ظٹط« ط¹ظ† ط¯ ط¨ط·ط، ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ط£ظˆ  API
    res.sendStatus(200);
    _botRef.handleUpdate(req.body).catch(err => { console.error("webhook error:", err); });
  } else {
    res.sendStatus(200);
  }
});

// أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬ Start أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬أ¢أ¢أ¢â€ڑآ¬أ¢â‚¬إ’أ¢أ¢â‚¬ع‘آ¬
const server = http.createServer(app);
server.requestTimeout = 15_000;
server.headersTimeout = 10_000;
server.on("error", err => console.error("HTTP server error:", err?.message ?? err));
server.listen(PORT, () => console.log(`ًںڑ€ Server on port ${PORT}`));
startBot().then(bot => { _botRef = bot; }).catch(err => { console.error("Failed to start:", err); process.exit(1); });
