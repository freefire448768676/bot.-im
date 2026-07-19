import { Telegraf, Markup } from "telegraf";
import http from "http";
import "dotenv/config";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is not set");
const bot = new Telegraf(token);

// ===== [ ذاكرة بدل DB - نفس بياناتك ] =====
let botStatus = 'on';
let admins = [YOUR_TELEGRAM_ID]; // <<< حط ايديك هون ضروري
let globalMarkupPercent = 0;

let categoryOverrides = {
  // مثال: "1": {customMarkupPercent: 10, sortOrder: 1}
};
let userMarkups = {
  // مثال: "123456": 5
};

let products = [
  {id: 1, parent_id: 1, name: "شحن ببجي 60UC", base_price: 1.5, price: 1.5, description: "يصل خلال 5 دقائق"},
  {id: 2, parent_id: 1, name: "شحن ببجي 325UC", base_price: 7.5, price: 7.5, description: "يصل خلال 5 دقائق"},
  {id: 3, parent_id: 2, name: "متابعين انستا 1000", base_price: 3, price: 3, description: "ضمان شهر"}
];

let categories = [
  {id: 1, parent_id: 0, name: "شحن العاب"},
  {id: 2, parent_id: 0, name: "خدمات السوشيال"}
];

// ===== [ دوال السعر - تعديلك ] =====
function effectivePriceUsd(p, catMarkup, userMarkup, globalMarkup = globalMarkupPercent) {
  let price = Number(p.price || p.base_price || 0);
  if(price === 0) return 0;
  const markups = [catMarkup, userMarkup, globalMarkup].filter(x => x > 0);
  const finalMarkup = markups[0] || 0;
  return price * (1 + finalMarkup / 100);
}

// ===== [ MIDDLEWARE - عمل البوت ] =====
bot.use(async (ctx, next) => {
  if (botStatus === "off" && ctx.from) {
    if (!admins.includes(ctx.from.id)) {
      if (ctx.callbackQuery) return ctx.answerCbQuery("🚫 البوت متوقف مؤقتاً");
      return ctx.reply("🚫 البوت متوقف مؤقتاً للصيانة.");
    }
  }
  return next();
});

// ===== [ القوائم ] =====
function mainMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("📦 المنتجات", "show:categories")],
    [Markup.button.callback("👑 لوحة الادمن", "adm:panel")]
  ]);
}

function categoriesMenu() {
  const buttons = categories.map(c =>
    [Markup.button.callback(c.name, `cat:${c.id}:0:0`)]
  );
  buttons.push([Markup.button.callback("⬅️ رجوع", "back:main")]);
  return Markup.inlineKeyboard(buttons);
}

function productsMenu(catId) {
  const prods = products.filter(p => p.parent_id == catId);
  const buttons = prods.map(p =>
    [Markup.button.callback(p.name, `prod:${p.id}`)]
  );
  buttons.push([Markup.button.callback("⬅️ رجوع للاقسام", "back:categories")]);
  return Markup.inlineKeyboard(buttons);
}

// ===== [ الاوامر ] =====
bot.start((ctx) => {
  ctx.reply(`اهلا ${ctx.from.first_name} بمتجر المروان`, mainMenu());
});

bot.command('menu', (ctx) => {
  ctx.reply("القائمة الرئيسية", mainMenu());
});

// ===== [ الازرار ] =====
bot.action("show:categories", (ctx) => {
  ctx.editMessageText("اختر القسم:", categoriesMenu());
});

bot.action(/cat:(\d+):(\d+):(\d+)/, (ctx) => { // [1] زر الرجوع
  const [,catId, backTo] = ctx.match;
  if(backTo === '0'){
    return ctx.editMessageText("اختر القسم:", categoriesMenu()); // رجوع للاقسام
  }
  ctx.editMessageText("المنتجات:", productsMenu(catId));
});

bot.action("back:main", (ctx) => {
  ctx.editMessageText(`اهلا ${ctx.from.first_name} بمتجر المروان`, mainMenu());
});

bot.action("back:categories", (ctx) => {
  ctx.editMessageText("اختر القسم:", categoriesMenu());
});

bot.action(/prod:(\d+)/, async (ctx) => { // [3] الطلب وحجب 0$
  const p = products.find(x => x.id == ctx.match[1]);
  if(!p) return;

  const ov = categoryOverrides[p.parent_id] || {};
  const catMarkup = Number(ov.customMarkupPercent || 0);
  const userMarkup = Number(userMarkups[ctx.from.id] || 0);
  const totalUsd = effectivePriceUsd(p, catMarkup, userMarkup);

  if(totalUsd === 0){
    return ctx.reply("⚠️ هذا المنتج لا يملك سعراً محدداً في النظام. يرجى التواصل مع الإدارة لضبط سعره.");
  }
  ctx.reply(`📋 الرد: ${p.name}\nالسعر: ${totalUsd.toFixed(2)}$\n${p.description}`); // [1] "الرد"
});

// ===== [ لوحة الادمن - كل تعديلاتك ] =====
bot.action("adm:panel", async (ctx) => {
  if(!admins.includes(ctx.from.id)) return;
  ctx.editMessageText("لوحة تحكم الادمن", Markup.inlineKeyboard([
    [Markup.button.callback(botStatus === 'on'? "🟢 عمل البوت: شغّال" : "🔴 عمل البوت: متوقف", "adm:toggleStatus")],
    [Markup.button.callback("💰 ربح قسم", "adm:setCatMarkup:1")],
    [Markup.button.callback("🔢 ترتيب قسم", "adm:setCatSort:1")],
    [Markup.button.callback("👤 ربح مستخدم", "adm:setUserMarkup:123")],
    [Markup.button.callback("⬅️ رجوع", "back:main")]
  ]));
});

bot.action("adm:toggleStatus", async (ctx) => { // [5]
  botStatus = botStatus === 'on'? 'off' : 'on';
  await ctx.answerCbQuery("تم التغيير");
  ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
    [Markup.button.callback(botStatus === 'on'? "🟢 عمل البوت: شغّال" : "🔴 عمل البوت: متوقف", "adm:toggleStatus")]
  ]).reply_markup)
});

bot.action(/adm:setCatMarkup:(\d+)/, (ctx) => { // [2]
  ctx.reply(`ارسل نسبة الربح الجديدة للقسم ${ctx.match[1]} %`);
  bot.once('text', (ctx2) => {
    categoryOverrides[ctx.match[1]] = {...categoryOverrides[ctx.match[1]], customMarkupPercent: Number(ctx2.message.text) };
    ctx2.reply("تم حفظ نسبة الربح");
  });
});

bot.action(/adm:setCatSort:(\d+)/, (ctx) => { // [2]
  ctx.reply(`ارسل رقم الترتيب الجديد للقسم ${ctx.match[1]}`);
  bot.once('text', (ctx2) => {
    categoryOverrides[ctx.match[1]] = {...categoryOverrides[ctx.match[1]], sortOrder: Number(ctx2.message.text) };
    ctx2.reply("تم حفظ الترتيب");
  });
});

bot.action(/adm:setUserMarkup:(\d+)/, (ctx) => { // [2]
  ctx.reply(`ارسل نسبة الربح الخاصة للمستخدم ${ctx.match[1]} %`);
  bot.once('text', (ctx2) => {
    userMarkups[ctx.match[1]] = Number(ctx2.message.text);
    ctx2.reply("تم حفظ ربح المستخدم");
  });
});

// ===== [ التشغيل ] =====
bot.launch();
console.log("Bot started");

http.createServer((_, res) => { res.writeHead(200); res.end("OK"); }).listen(process.env.PORT || 3000);
