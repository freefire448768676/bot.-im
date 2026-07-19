import { Telegraf, Markup } from "telegraf";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { pgTable, serial, text, numeric, integer, boolean } from "drizzle-orm/pg-core";
import { eq, asc, inArray } from "drizzle-orm";
import * as http from "http";
import "dotenv/config";

// ==================== [ DB SETUP ] ====================
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client);

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

// ==================== [ GLOBALS + CACHE ] ====================
const PRODUCTS_TTL = 15 * 60 * 1000; // 15 دقيقة
const CONTENT_TTL = 15 * 60 * 1000;
const OVERRIDES_TTL = 5 * 60 * 1000;

let productCache: any[] = [];
let productCacheTime = 0;
let overridesCache: any[] = [];
let overridesCacheTime = 0;

const token = process.env.BOT_TOKEN!;
const bot = new Telegraf(token);

// ==================== [ UTILS ] ====================
async function ensureDefaultSettings() {
  await db.insert(settingsTable).values({key: 'bot_status', value: 'on'}).onConflictDoNothing();
}
async function getBotStatus() {
  const [res] = await db.select().from(settingsTable).where(eq(settingsTable.key, 'bot_status'));
  return res?.value || 'on';
}
async function getUser(id: number) {
  const [res] = await db.select().from(usersTable).where(eq(usersTable.id, id));
  return res;
}
async function listAdmins() { // [1] إصلاح: ترجع array
  const res = await db.select().from(usersTable).where(eq(usersTable.isAdmin, true));
  return res.map(u => u.id);
}

async function loadCategoryOverrides() { // [3] إصلاح: ترجع markup + sortOrder
  if(Date.now() - overridesCacheTime > OVERRIDES_TTL){
    overridesCache = await db.select().from(categoryOverridesTable);
    overridesCacheTime = Date.now();
  }
  return overridesCache;
}

async function loadProducts() {
  if(Date.now() - productCacheTime > PRODUCTS_TTL){
    productCache = await db.select().from(productsTable);
    productCacheTime = Date.now();
  }
  return productCache;
}

function effectivePriceUsd(p: any, ov: any, catMarkup: number, userMarkup: number, globalMarkup = 0) { // [3]
  let price = Number(p.price || p.base_price || 0); // [1] fallback base_price
  if(price === 0) return 0;

  const markups = [
    Number(ov?.customMarkupPercent || 0),
    Number(catMarkup || 0),
    Number(userMarkup || 0),
    Number(globalMarkup || 0)
  ].filter(x => x > 0);

  const finalMarkup = markups[0] || 0; // اول واحد موجود
  return price * (1 + finalMarkup / 100);
}

// ==================== [ MIDDLEWARE - [5] عمل البوت ] ====================
bot.use(async (ctx, next) => {
  try {
    const status = await getBotStatus();
    const userId = ctx.from?.id;
    if (status === "off" && userId) {
      const user = await getUser(userId);
      if (!user?.isAdmin) {
        if (ctx.callbackQuery) return ctx.answerCbQuery("🚫 البوت متوقف مؤقتاً");
        return ctx.reply("🚫 البوت متوقف مؤقتاً للصيانة. يرجى المحاولة لاحقاً.");
      }
    }
    return next();
  } catch (e) {
    console.error(e);
    return next();
  }
});

// ==================== [ HANDLERS ] ====================
bot.start(async (ctx) => {
  ctx.reply("مرحبا في متجر المروان ✅");
});

// [2] لوحة الادمن
bot.command('admin', async (ctx) => {
  const admins = await listAdmins();
  if(!admins.includes(ctx.from.id)) return;

  const status = await getBotStatus();
  ctx.reply("لوحة الادمن", Markup.inlineKeyboard([
    [Markup.button.callback(status === 'on'? "🟢 عمل البوت: شغّال" : "🔴 عمل البوت: متوقف", "adm:toggleStatus")]
  ]));
});

bot.action("adm:toggleStatus", async (ctx) => {
  try{
    const status = await getBotStatus();
    const newStatus = status === 'on'? 'off' : 'on';
    await db.insert(settingsTable).values({key: 'bot_status', value: newStatus}).onConflictDoUpdate({target: settingsTable.key, set: {value: newStatus}});
    await ctx.answerCbQuery("تم التغيير");
    ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
      [Markup.button.callback(newStatus === 'on'? "🟢 عمل البوت: شغّال" : "🔴 عمل البوت: متوقف", "adm:toggleStatus")]
    ]).reply_markup)
  }catch(e){console.error(e)}
});

// [1] زر الرجوع
bot.action(/cat:(\d+):(\d+):(\d+)/, async (ctx) => {
  try{
    const [,catId, backTo] = ctx.match;
    if(backTo === '0'){ // [1] إصلاح: يروح للقائمة مو home
      return ctx.editMessageText("قائمة الأقسام");
    }
    // باقي منطق الاقسام...
  }catch(e){console.error(e)}
});

// [2] ربح القسم
bot.action(/adm:setCatMarkup:(\d+)/, async (ctx) => {
  try{
    const catId = ctx.match[1];
    await ctx.reply(`ارسل نسبة الربح الجديدة للقسم ${catId} %`);
    // منطق حفظ في categoryOverridesTable.customMarkupPercent
  }catch(e){console.error(e)}
});

// [2] ترتيب القسم
bot.action(/adm:setCatSort:(\d+)/, async (ctx) => {
  try{
    const catId = ctx.match[1];
    await ctx.reply(`ارسل رقم الترتيب الجديد للقسم ${catId}`);
    // منطق حفظ في categoryOverridesTable.sortOrder
  }catch(e){console.error(e)}
});

// [2] ربح مستخدم
bot.action(/adm:setUserMarkup:(\d+)/, async (ctx) => {
  try{
    const userId = ctx.match[1];
    await ctx.reply(`ارسل نسبة الربح الخاصة للمستخدم ${userId} %`);
    // منطق حفظ في usersTable.customMarkupPercent
  }catch(e){console.error(e)}
});

// [3] طلب
async function startOrderFlow(ctx: any, productId: number) {
  try{
    const products = await loadProducts();
    const p = products.find(x => x.id === productId);
    if(!p) return;

    const overrides = await loadCategoryOverrides();
    const ov = overrides.find(o => o.categoryId === p.parent_id);
    const user = await getUser(ctx.from.id);

    const catMarkup = Number(ov?.customMarkupPercent || 0);
    const userMarkup = Number(user?.customMarkupPercent || 0);

    const totalUsd = effectivePriceUsd(p, ov, catMarkup, userMarkup);

    if(totalUsd === 0){ // [3] حجب سعر 0
      return ctx.reply("⚠️ هذا المنتج لا يملك سعراً محدداً في النظام. يرجى التواصل مع الإدارة لضبط سعره.");
    }

    ctx.reply(`📋 الرد: سعر المنتج ${totalUsd.toFixed(2)}$`); // [1] "الرد" بدل "رد الموقع"
  }catch(e){console.error(e)}
}

// ==================== [ LAUNCH ] ====================
async function main() {
  await ensureDefaultSettings();

  process.on("uncaughtException", (e) => console.error("uncaughtException", e));
  process.on("unhandledRejection", (e) => console.error("unhandledRejection", e));
  bot.catch((err, ctx) => console.error("Bot error", err, ctx.update));

  await bot.launch({ dropPendingUpdates: true });
  console.log("Bot started");

  // [4] Express خفيف
  http.createServer((_, res) => { res.writeHead(200); res.end("OK"); }).listen(process.env.PORT || 3000);

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

main();
