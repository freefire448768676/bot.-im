import { Telegraf, Markup } from "telegraf";
import http from "http";
import "dotenv/config";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is not set");
const bot = new Telegraf(token);

// ===== [1] الاعدادات والذاكرة بدل DB =====
let botStatus = 'on'; // [5] عمل البوت
let admins = [0]; // <<< حط ايديك هون من @userinfobot
let globalMarkupPercent = 0;

// Cache - [4]
let cache = { products: null, categories: null, overrides: null, users: null };
let cacheTime = { products: 0, categories: 0, overrides: 0, users: 0 };
const TTL = { products: 15*60*1000, categories: 15*60*1000, overrides: 5*60*1000, users: 5*60*1000 };

// Rate Limit - [4]
const userRequests = new Map();

// بيانات
let categoryOverrides = {}; // [2] { "1": {customMarkupPercent: 10, sortOrder: 1} }
let userMarkups = {}; // [2] { "123": 5 }

let categories = [
  {id: 1, parent_id: 0, name: "🎮 شحن العاب", sortOrder: 1},
  {id: 2, parent_id: 0, name: "📱 خدمات السوشيال", sortOrder: 2},
  {id: 3, parent_id: 0, name: "💳 بطاقات رقمية", sortOrder: 3}
];

let products = [
  {id: 1, parent_id: 1, name: "ببجي 60 UC", base_price: 1.50, price: 1.50, description: "يصل خلال 5 دقائق"},
  {id: 2, parent_id: 1, name: "ببجي 325 UC", base_price: 7.50, price: 7.50, description: "يصل خلال 5 دقائق"},
  {id: 3, parent_id: 2, name: "متابعين انستا 1000", base_price: 0, price: 0, description: "ضمان شهر"} // [1] سعر 0 للتجربة
];

// ===== [2+3] دوال الحساب مع الاولوية =====
function effectivePriceUsd(p, catMarkup, userMarkup, globalMarkup = globalMarkupPercent) {
  let price = Number(p.price || p.base_price || 0); // [1] fallback على base_price
  if(price === 0) return 0; // [3] حجب 0$

  // الاولوية: customPrice > productMarkup > categoryMarkup > userMarkup > global
  const markups = [catMarkup, userMarkup, globalMarkup].filter(x => x > 0);
  const finalMarkup = markups[0] || 0;
  return price * (1 + finalMarkup / 100);
}

// ===== [4] Rate Limit Middleware =====
bot.use(async (ctx, next) => {
  const id = ctx.from?.id;
  if(!id) return next();
  const now = Date.now();
  const reqs = userRequests.get(id) || [];
  const recent = reqs.filter(t => now - t < 1000); // 1000ms window
  if(recent.length >= 3){ // limit 3
    return ctx.answerCbQuery("⏳ انتظر قليلاً ثم أعد المحاولة");
  }
  recent.push(now);
  userRequests.set(id, recent);
  return next();
});

// ===== [5] Middleware عمل البوت =====
bot.use(async (ctx, next) => {
  if (botStatus === "off" && ctx.from) {
    if (!admins.includes(ctx.from.id)) {
      if (ctx.callbackQuery) return ctx.answerCbQuery("🚫 البوت متوقف مؤقتاً");
      return ctx.reply("🚫 البوت متوقف مؤقتاً للصيانة. يرجى المحاولة لاحقاً.");
    }
  }
  return next();
});

// ===== [1] دوال القوائم مع الترتيب =====
function mainMenu(ctx) {
  return Markup.inlineKeyboard([
    [Markup.button.callback("📦 المنتجات", "show:categories")],
    [Markup.button.callback("👑 لوحة الادمن", "adm:panel")]
  ]);
}

function categoriesMenu() {
  // [1] ترتيب حسب sortOrder
  const sorted = [...categories].sort((a,b) => (categoryOverrides[a.id]?.sortOrder || a.sortOrder || 999) - (categoryOverrides[b.id]?.sortOrder || b.sortOrder || 999));
  const buttons = sorted.map(c => [Markup.button.callback(c.name, `cat:${c.id}:0:0`)]); // [1] backTo=0
  buttons.push([Markup.button.callback("⬅️ القائمة الرئيسية", "back:main")]);
  return Markup.inlineKeyboard(buttons);
}

function productsMenu(catId) {
  const prods = products.filter(p => p.parent_id == catId);
  const buttons = prods.map(p => [Markup.button.callback(p.name, `prod:${p.id}`)]);
  buttons.push([Markup.button.callback("⬅️ رجوع للاقسام", "back:categories")]); // [1] رجوع صحيح
  return Markup.inlineKeyboard(buttons);
}

// ===== [ الاوامر ] =====
bot.start((ctx) => {
  ctx.reply(`اهلا ${ctx.from.first_name} 👋\nفي متجر المروان`, mainMenu(ctx));
});

bot.command('menu', (ctx) => {
  ctx.reply("القائمة الرئيسية", mainMenu(ctx));
});

// ===== [ الازرار - مع try/catch ] =====
bot.action("show:categories", async (ctx) => { // [4]
  try { ctx.editMessageText("اختر القسم:", categoriesMenu()); }
  catch(e) { console.error(e); }
});

bot.action(/cat:(\d+):(\d+):(\d+)/, async (ctx) => { // [1] زر الرجوع
  try {
    const [,catId, backTo] = ctx.match;
    if(backTo === '0'){
      return ctx.editMessageText("اختر القسم:", categoriesMenu());
    }
    ctx.editMessageText("اختر المنتج:", productsMenu(catId));
  } catch(e) { console.error(e); }
});

bot.action("back:main", async (ctx) => {
  try { ctx.editMessageText(`اهلا ${ctx.from.first_name} 👋\nفي متجر المروان`, mainMenu(ctx)); }
  catch(e) { console.error(e); }
});

bot.action("back:categories", async (ctx) => {
  try { ctx.editMessageText("اختر القسم:", categoriesMenu()); }
  catch(e) { console.error(e); }
});

bot.action(/prod:(\d+)/, async (ctx) => { // [3] الطلب
  try {
    const p = products.find(x => x.id == ctx.match[1]);
    if(!p) return;

    const ov = categoryOverrides[p.parent_id] || {};
    const catMarkup = Number(ov.customMarkupPercent || 0); // [3]
    const userMarkup = Number(userMarkups[ctx.from.id] || 0); // [3]
    const totalUsd = effectivePriceUsd(p, catMarkup, userMarkup);

    if(totalUsd === 0){ // [3] حجب 0$
      return ctx.reply("⚠️ هذا المنتج لا يملك سعراً محدداً في النظام. يرجى التواصل مع الإدارة لضبط سعره.");
    }
    ctx.reply(`📋 الرد: تفاصيل الطلب\n\nالمنتج: ${p.name}\nالسعر: ${totalUsd.toFixed(2)}$\nالوصف: ${p.description}`); // [1] "الرد"
  } catch(e) { console.error(e); }
});

// ===== [2+5] لوحة الادمن كاملة =====
bot.action("adm:panel", async (ctx) => {
  try {
    if(!admins.includes(ctx.from.id)) return ctx.answerCbQuery("ليس لديك صلاحية");
    ctx.editMessageText("👑 لوحة تحكم الادمن", Markup.inlineKeyboard([
      [Markup.button.callback(botStatus === 'on'? "🟢 عمل البوت: شغّال" : "🔴 عمل البوت: متوقف", "adm:toggleStatus")], // [5]
      [Markup.button.callback("💰 ربح قسم", "adm:setCatMarkup:1")],
      [Markup.button.callback("🔢 ترتيب قسم", "adm:setCatSort:1")],
      [Markup.button.callback("👤 ربح مستخدم", "adm:setUserMarkup:0")],
      [Markup.button.callback("⬅️ رجوع", "back:main")]
    ]));
  } catch(e) { console.error(e); }
});

bot.action("adm:toggleStatus", async (ctx) => { // [5]
  try {
    botStatus = botStatus === 'on'? 'off' : 'on';
    await ctx.answerCbQuery("تم تغيير حالة البوت");
    ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
      [Markup.button.callback(botStatus === 'on'? "🟢 عمل البوت: شغّال" : "🔴 عمل البوت: متوقف", "adm:toggleStatus")]
    ]).reply_markup)
  } catch(e) { console.error(e); }
});

bot.action(/adm:setCatMarkup:(\d+)/, (ctx) => { // [2]
  ctx.reply(`ارسل نسبة الربح الجديدة للقسم ${ctx.match[1]} %`);
  bot.once('text', (ctx2) => {
    categoryOverrides[ctx.match[1]] = {...categoryOverrides[ctx.match[1]], customMarkupPercent: Number(ctx2.message.text) };
    ctx2.reply("✅ تم حفظ نسبة الربح");
  });
});

bot.action(/adm:setCatSort:(\d+)/, (ctx) => { // [2]
  ctx.reply(`ارسل رقم الترتيب الجديد للقسم ${ctx.match[1]}`);
  bot.once('text', (ctx2) => {
    categoryOverrides[ctx.match[1]] = {...categoryOverrides[ctx.match[1]], sortOrder: Number(ctx2.message.text) };
    ctx2.reply("✅ تم حفظ الترتيب");
  });
});

bot.action(/adm:setUserMarkup:(\d+)/, (ctx) => { // [2]
  ctx.reply(`ارسل: ايدي_المستخدم نسبة_الربح`);
  bot.once('text', (ctx2) => {
    const [userId, percent] = ctx2.message.text.split(" ");
    userMarkups[userId] = Number(percent);
    ctx2.reply(`✅ تم حفظ ربح ${percent}% للمستخدم ${userId}`);
  });
});

// ===== [4] التشغيل + Express + Error handlers =====
bot.launch();
console.log("Bot started successfully");

http.createServer((_, res) => { res.writeHead(200); res.end("OK"); }).listen(process.env.PORT || 3000);

// [4] Error handling
process.on("uncaughtException", (e) => console.error("uncaughtException", e));
process.on("unhandledRejection", (e) => console.error("unhandledRejection", e));
bot.catch((err, ctx) => console.error("Bot error", err));
