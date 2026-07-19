import { Telegraf, Markup, session } from "telegraf";
import express from "express";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "dotenv/config";

const token = process.env.BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const DATABASE_URL = process.env.DATABASE_URL;

if (!token ||!WEBHOOK_URL ||!DATABASE_URL) throw new Error("Missing ENV");

const client = postgres(DATABASE_URL);
const db = drizzle(client);
const bot = new Telegraf(token);
const app = express();
app.use(express.json());
bot.use(session());

// ===== [CONFIG] =====
const ADMIN_IDS = [123456789]; // <<< غيره لايديك
let BOT_STATUS = 'on';

// ===== [API تنفيذ الطلبات - حط رابطك هون] =====
const API_URL = "https://api.tanfeez.com/v1/order"; // <<< غيره لرابط API تبعك
const API_KEY = "ضع_مفتاح_API_هنا"; // <<< ضع مفتاح API تبعك

async function executeOrder(productName, quantity, userInfo) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ product: productName, qty: quantity, user: userInfo })
    });
    const data = await res.json();
    return data.status === "success"; // true اذا تم التنفيذ
  } catch(e) {
    console.error("API Error:", e);
    return false;
  }
}

// ===== [UTILS DB] =====
async function getProducts() {
  return await db.query.products.findMany(); // لازم يكون عندك جدول products
}
async function getCategories() {
  return await db.query.categories.findMany({ orderBy: (c, {asc}) => [asc(c.sortOrder)] }); // [1] ترتيب
}

// ===== [MIDDLEWARE [4]+[5]] =====
bot.use(async (ctx, next) => {
  if (BOT_STATUS === "off" && ctx.from &&!ADMIN_IDS.includes(ctx.from.id)) {
    if (ctx.callbackQuery) return ctx.answerCbQuery("🚫 البوت متوقف مؤقتاً");
    return ctx.reply("🚫 البوت متوقف مؤقتاً للصيانة.");
  }
  return next();
});

// ===== [KEYBOARDS] =====
function mainMenu() { return Markup.inlineKeyboard([
  [Markup.button.callback("📦 المنتجات", "show:categories")],
  [Markup.button.callback("👑 لوحة الادمن", "adm:panel")]
])}

async function categoriesMenu() {
  const cats = await getCategories(); // [1]
  const buttons = cats.map(c => [Markup.button.callback(c.name, `cat:${c.id}:0:0`)]); // [1] backTo=0
  buttons.push([Markup.button.callback("⬅️ القائمة الرئيسية", "back:main")]);
  return Markup.inlineKeyboard(buttons);
}

// ===== [HANDLERS] =====
bot.start((ctx) => ctx.reply(`اهلا ${ctx.from.first_name} 👋`, mainMenu()));
bot.action("show:categories", async (ctx) => ctx.editMessageText("اختر القسم:", await categoriesMenu()));

bot.action(/cat:(\d+):(\d+):(\d+)/, async (ctx) => {
  const [,catId, backTo] = ctx.match;
  if(backTo === '0') return ctx.editMessageText("اختر القسم:", await categoriesMenu());

  const prods = await db.query.products.findMany({ where: (p, {eq}) => eq(p.parent_id, Number(catId)) });
  const buttons = prods.map(p => [Markup.button.callback(`${p.name} - ${p.price}$`, `prod:${p.id}`)]);
  buttons.push([Markup.button.callback("⬅️ رجوع للاقسام", "back:categories")]); // [1]
  ctx.editMessageText("اختر المنتج:", Markup.inlineKeyboard(buttons));
});

bot.action(/prod:(\d+)/, async (ctx) => { // [3] مع حساب الربح
  const p = await db.query.products.findFirst({ where: (p, {eq}) => eq(p.id, Number(ctx.match[1])) });
  const ov = await db.query.categoryOverrides.findFirst({ where: (o, {eq}) => eq(o.catId, p.parent_id) });
  const user = await db.query.users.findFirst({ where: (u, {eq}) => eq(u.userId, ctx.from.id) });

  const catMarkup = Number(ov?.customMarkupPercent || 0); // [2]
  const userMarkup = Number(user?.customMarkupPercent || 0); // [2]
  const totalUsd = Number(p.price) * (1 + (catMarkup || userMarkup || 0) / 100);

  if(totalUsd === 0) return ctx.reply("⚠️ هذا المنتج لا يملك سعراً محدداً في النظام."); // [3]

  ctx.reply(`📋 الرد: تأكيد الطلب\nالمنتج: ${p.name}\nالسعر: ${totalUsd.toFixed(2)}$`, // [1]
    Markup.inlineKeyboard([[Markup.button.callback("✅ تأكيد الطلب", `order:confirm:${p.id}:${totalUsd}`)]])
  );
});

bot.action(/order:confirm:(\d+):([\d.]+)/, async (ctx) => { // [API]
  const [,prodId, price] = ctx.match;
  const p = await db.query.products.findFirst({ where: (p, {eq}) => eq(p.id, Number(prodId)) });

  const success = await executeOrder(p.name, 1, ctx.from); // تنفيذ عبر API

  if(success){
    // حفظ الطلب بال DB
    await db.insert(db.orders).values({ userId: ctx.from.id, productId: Number(prodId), price: Number(price), status: "تم التنفيذ" });
    // اشعار للادمن [1]
    for(const adminId of ADMIN_IDS){ bot.telegram.sendMessage(adminId, `🔔 طلب جديد تم تنفيذه: ${p.name}`); }
    ctx.editMessageText(`✅ تم استلام طلبك وتنفيذه بنجاح`);
  } else {
    ctx.editMessageText(`❌ فشل تنفيذ الطلب. تواصل مع الادارة`);
  }
});

// ===== [ADMIN [2]+[5]] =====
bot.action("adm:panel", (ctx) => {
  if(!ADMIN_IDS.includes(ctx.from.id)) return ctx.answerCbQuery("ليس لديك صلاحية");
  ctx.editMessageText("👑 لوحة الادمن", Markup.inlineKeyboard([
    [Markup.button.callback(BOT_STATUS === 'on'? "🟢 عمل البوت: شغّال" : "🔴 عمل البوت: متوقف", "adm:toggleStatus")], // [5]
    [Markup.button.callback("💰 ربح قسم", "adm:setCatMarkup")],
    [Markup.button.callback("👤 ربح مستخدم", "adm:setUserMarkup")] // [2]
  ]));
});

bot.action("adm:toggleStatus", (ctx) => {
  BOT_STATUS = BOT_STATUS === 'on'? 'off' : 'on';
  ctx.answerCbQuery("تم التغيير");
});

// ===== [WEBHOOK] =====
app.use(bot.webhookCallback('/' + token));
app.get('/', (req, res) => res.send('OK'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await bot.telegram.setWebhook(`${WEBHOOK_URL}/${token}`);
  console.log("Bot running with DB + API");
});
