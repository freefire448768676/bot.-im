import { Telegraf, Markup, session } from "telegraf";
import express from "express";
import "dotenv/config";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is not set");

const bot = new Telegraf(token);
const app = express();
app.use(express.json());
bot.use(session());

// ===== [CONFIG] =====
const ADMIN_IDS = [123456789]; // <<< 1. حط ايديك هون ضروري من @userinfobot
const WEBHOOK_URL = process.env.WEBHOOK_URL; // <<< 2. حط رابط Railway هون
let BOT_STATUS = 'on';
let GLOBAL_MARKUP = 0;

// ===== [DB IN MEMORY] =====
let DB = {
  categories: [
    {id: 1, parent_id: 0, name: "🎮 شحن العاب", sortOrder: 1, hidden: false},
    {id: 2, parent_id: 0, name: "📱 خدمات السوشيال", sortOrder: 2, hidden: false}
  ],
  products: [
    {id: 1, parent_id: 1, name: "ببجي 60 UC", base_price: 1.50, price: 1.50, description: "يصل خلال 5 دقائق", stock: 999},
    {id: 2, parent_id: 2, name: "متابعين انستا 1000", base_price: 3.00, price: 3.00, description: "ضمان شهر", stock: 999},
  ],
  categoryOverrides: {},
  users: {},
  orders: []
};
let ORDER_ID = 1;

// ===== [UTILS] =====
function getAdmins() { return ADMIN_IDS; }
function effectivePriceUsd(p, catMarkup, userMarkup, globalMarkup = GLOBAL_MARKUP) {
  let price = Number(p.price || p.base_price || 0);
  if(price === 0) return 0;
  const markups = [catMarkup, userMarkup, globalMarkup].filter(x => x > 0);
  const finalMarkup = markups[0] || 0;
  return price * (1 + finalMarkup / 100);
}

// ===== [MIDDLEWARE] =====
bot.use(async (ctx, next) => {
  if (BOT_STATUS === "off" && ctx.from) {
    if (!ADMIN_IDS.includes(ctx.from.id)) {
      if (ctx.callbackQuery) return ctx.answerCbQuery("🚫 البوت متوقف مؤقتاً");
      return ctx.reply("🚫 البوت متوقف مؤقتاً للصيانة.");
    }
  }
  return next();
});

// ===== [KEYBOARDS] =====
function mainMenu(ctx) {
  return Markup.inlineKeyboard([
    [Markup.button.callback("📦 المنتجات", "show:categories")],
    [Markup.button.callback("👑 لوحة الادمن", "adm:panel")]
  ]);
}
function categoriesMenu() {
  const sorted = [...DB.categories].filter(c =>!c.hidden).sort((a,b) => (DB.categoryOverrides[a.id]?.sortOrder || a.sortOrder) - (DB.categoryOverrides[b.id]?.sortOrder || b.sortOrder));
  const buttons = sorted.map(c => [Markup.button.callback(c.name, `cat:${c.id}:0:0`)]);
  buttons.push([Markup.button.callback("⬅️ القائمة الرئيسية", "back:main")]);
  return Markup.inlineKeyboard(buttons);
}
function productsMenu(catId) {
  const prods = DB.products.filter(p => p.parent_id == catId && p.stock > 0);
  const buttons = prods.map(p => [Markup.button.callback(p.name, `prod:${p.id}`)]);
  buttons.push([Markup.button.callback("⬅️ رجوع للاقسام", "back:categories")]);
  return Markup.inlineKeyboard(buttons);
}

// ===== [HANDLERS] =====
bot.start((ctx) => {
  if(!DB.users[ctx.from.id]) DB.users[ctx.from.id] = {balance: 0, customMarkupPercent: 0};
  ctx.reply(`اهلا ${ctx.from.first_name} 👋\nفي متجر المروان`, mainMenu(ctx));
});
bot.command('menu', (ctx) => ctx.reply("القائمة الرئيسية", mainMenu(ctx)));

bot.action("show:categories", (ctx) => ctx.editMessageText("اختر القسم:", categoriesMenu()));
bot.action(/cat:(\d+):(\d+):(\d+)/, (ctx) => {
  const [,catId, backTo] = ctx.match;
  if(backTo === '0') return ctx.editMessageText("اختر القسم:", categoriesMenu());
  ctx.editMessageText("اختر المنتج:", productsMenu(catId));
});
bot.action("back:main", (ctx) => ctx.editMessageText(`اهلا ${ctx.from.first_name}`, mainMenu(ctx)));
bot.action("back:categories", (ctx) => ctx.editMessageText("اختر القسم:", categoriesMenu()));

bot.action(/prod:(\d+)/, (ctx) => {
  const p = DB.products.find(x => x.id == ctx.match[1]);
  const ov = DB.categoryOverrides[p.parent_id] || {};
  const catMarkup = Number(ov.customMarkupPercent || 0);
  const userMarkup = Number(DB.users[ctx.from.id]?.customMarkupPercent || 0);
  const totalUsd = effectivePriceUsd(p, catMarkup, userMarkup);

  if(totalUsd === 0) return ctx.reply("⚠️ هذا المنتج لا يملك سعراً محدداً في النظام.");
  ctx.reply(`📋 الرد: تأكيد الطلب\n\nالمنتج: ${p.name}\nالسعر: ${totalUsd.toFixed(2)}$\n${p.description}`,
    Markup.inlineKeyboard([[Markup.button.callback("✅ تأكيد الطلب", `order:confirm:${p.id}:${totalUsd}`)]])
  );
});

bot.action(/order:confirm:(\d+):([\d.]+)/, (ctx) => {
  const [,prodId, price] = ctx.match;
  const order = { id: ORDER_ID++, userId: ctx.from.id, productId: Number(prodId), status: "قيد التنفيذ", price: Number(price) };
  DB.orders.push(order);
  for(const adminId of getAdmins()){ bot.telegram.sendMessage(adminId, `🔔 طلب جديد #${order.id}`); }
  ctx.editMessageText(`✅ تم استلام طلبك #${order.id}`);
});

// ===== [ADMIN] =====
bot.action("adm:panel", (ctx) => {
  if(!ADMIN_IDS.includes(ctx.from.id)) return ctx.answerCbQuery("ليس لديك صلاحية");
  ctx.editMessageText("👑 لوحة تحكم الادمن", Markup.inlineKeyboard([
    [Markup.button.callback(BOT_STATUS === 'on'? "🟢 عمل البوت: شغّال" : "🔴 عمل البوت: متوقف", "adm:toggleStatus")],
    [Markup.button.callback("💰 ربح قسم", "adm:setCatMarkup")],
    [Markup.button.callback("⬅️ رجوع", "back:main")]
  ]));
});
bot.action("adm:toggleStatus", (ctx) => {
  BOT_STATUS = BOT_STATUS === 'on'? 'off' : 'on';
  ctx.answerCbQuery("تم التغيير");
  ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
    [Markup.button.callback(BOT_STATUS === 'on'? "🟢 عمل البوت: شغّال" : "🔴 عمل البوت: متوقف", "adm:toggleStatus")]
  ]).reply_markup)
});
bot.action("adm:setCatMarkup", (ctx) => {
  ctx.reply("ارسل: `ايدي_القسم نسبة_الربح`");
  bot.once('text', (ctx2) => {
    const [catId, percent] = ctx2.message.text.split(" ");
    DB.categoryOverrides[catId] = {...DB.categoryOverrides[catId], customMarkupPercent: Number(percent) };
    ctx2.reply(`✅ تم حفظ ربح ${percent}%`);
  });
});

// ===== [WEBHOOK + EXPRESS - سر تشغيل Railway] =====
app.use(bot.webhookCallback('/' + token));

app.get('/', (req, res) => res.send('OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  if(WEBHOOK_URL){
    await bot.telegram.setWebhook(`${WEBHOOK_URL}/${token}`);
    console.log("Webhook set to:", `${WEBHOOK_URL}/${token}`);
  } else {
    console.log("ERROR: WEBHOOK_URL not set in Railway Variables");
  }
});

// Error handlers
process.on("uncaughtException", (e) => console.error(e));
process.on("unhandledRejection", (e) => console.error(e));
