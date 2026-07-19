import { Telegraf, Markup } from "telegraf";
import http from "http";
import "dotenv/config";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is not set");
const bot = new Telegraf(token);

// ===== [ الاعدادات الاساسية ] =====
let botStatus = 'on';
let admins = [0]; // <<< مهم: حط ايدي التليجرام تبعك هون. جيبه من @userinfobot
let globalMarkupPercent = 0;

// ===== [ البيانات - عدلها من هون ] =====
let categoryOverrides = {
  // "1": {customMarkupPercent: 10, sortOrder: 1} // مثال: ربح 10% للقسم 1
};
let userMarkups = {
  // "123456789": 5 // مثال: ربح 5% للمستخدم
};

let categories = [
  {id: 1, parent_id: 0, name: "🎮 شحن العاب"},
  {id: 2, parent_id: 0, name: "📱 خدمات السوشيال"},
  {id: 3, parent_id: 0, name: "💳 بطاقات رقمية"}
];

let products = [
  {id: 1, parent_id: 1, name: "ببجي 60 UC", base_price: 1.50, price: 1.50, description: "يصل خلال 5 دقائق - بالايدي"},
  {id: 2, parent_id: 1, name: "بجي 325 UC", base_price: 7.50, price: 7.50, description: "يصل خلال 5 دقائق - بالايدي"},
  {id: 3, parent_id: 2, name: "متابعين انستغرام 1000", base_price: 3.00, price: 3.00, description: "ضمان شهر - يبدأ خلال ساعة"},
  {id: 4, parent_id: 3, name: "بطاقة قوقل بلاي 10$", base_price: 10.00, price: 10.00, description: "كود فوري"}
];

// ===== [ دوال الحساب - تعديلاتك ] =====
function effectivePriceUsd(p, catMarkup, userMarkup, globalMarkup = globalMarkupPercent) {
  let price = Number(p.price || p.base_price || 0);
  if(price === 0) return 0; // [3] حجب 0$
  const markups = [catMarkup, userMarkup, globalMarkup].filter(x => x > 0);
  const finalMarkup = markups[0] || 0;
  return price * (1 + finalMarkup / 100);
}

// ===== [ MIDDLEWARE - عمل البوت ] =====
bot.use(async (ctx, next) => {
  if (botStatus === "off" && ctx.from) {
    if (!admins.includes(ctx.from.id)) {
      if (ctx.callbackQuery) return ctx.answerCbQuery("🚫 البوت متوقف مؤقتاً");
      return ctx.reply("🚫 البوت متوقف مؤقتاً للصيانة. يرجى المحاولة لاحقاً.");
    }
  }
  return next();
});

// ===== [ القوائم ] =====
function mainMenu(ctx) {
  return Markup.inlineKeyboard([
    [Markup.button.callback("📦 المنتجات", "show:categories")],
    [Markup.button.callback("👑 لوحة الادمن", "adm:panel")],
    [Markup.button.callback("💰 رصيدي", "show:balance")]
  ]);
}

function categoriesMenu() {
  const buttons = categories.map(c => [Markup.button.callback(c.name, `cat:${c.id}:0:0`)]); // [1] زر الرجوع
  buttons.push([Markup.button.callback("⬅️ القائمة الرئيسية", "back:main")]);
  return Markup.inlineKeyboard(buttons);
}

function productsMenu(catId) {
  const prods = products.filter(p => p.parent_id == catId);
  const buttons = prods.map(p => [Markup.button.callback(p.name, `prod:${p.id}`)]);
  buttons.push([Markup.button.callback("⬅️ رجوع للاقسام", "back:categories")]);
  return Markup.inlineKeyboard(buttons);
}

// ===== [ الاوامر ] =====
bot.start((ctx) => {
  ctx.reply(`اهلا ${ctx.from.first_name} 👋\nفي متجر المروان`, mainMenu(ctx));
});

bot.command('menu', (ctx) => {
  ctx.reply("القائمة الرئيسية", mainMenu(ctx));
});

// ===== [ الازرار ] =====
bot.action("show:categories", (ctx) => {
  ctx.editMessageText("اختر القسم:", categoriesMenu());
});

bot.action(/cat:(\d+):(\d+):(\d+)/, (ctx) => { // [1] زر الرجوع للاقسام
  const [,catId, backTo] = ctx.match;
  if(backTo === '0'){
    return ctx.editMessageText("اختر القسم:", categoriesMenu());
  }
  ctx.editMessageText("اختر المنتج:", productsMenu(catId));
});

bot.action("back:main", (ctx) => {
  ctx.editMessageText(`اهلا ${ctx.from.first_name} 👋\nفي متجر المروان`, mainMenu(ctx));
});

bot.action("back:categories", (ctx) => {
  ctx.editMessageText("اختر القسم:", categoriesMenu());
});

bot.action("show:balance", (ctx) => {
  ctx.answerCbQuery("رصيدك: 0.00 $", {show_alert: true});
});

bot.action(/prod:(\d+)/, async (ctx) => { // [3] الطلب
  const p = products.find(x => x.id == ctx.match[1]);
  if(!p) return;

  const ov = categoryOverrides[p.parent_id] || {};
  const catMarkup = Number(ov.customMarkupPercent || 0);
  const userMarkup = Number(userMarkups[ctx.from.id] || 0);
  const totalUsd = effectivePriceUsd(p, catMarkup, userMarkup);

  if(totalUsd === 0){
    return ctx.reply("⚠️ هذا المنتج لا يملك سعراً محدداً في النظام. يرجى التواصل مع الإدارة لضبط سعره.");
  }
  ctx.reply(`📋 الرد: تفاصيل الطلب\n\nالمنتج: ${p.name}\nالسعر: ${totalUsd.toFixed(2)}$\nالوصف: ${p.description}\n\nارسل المعلومات المطلوبة لاتمام الطلب`); // [1] "الرد"
});

// ===== [ لوحة الادمن - كل تعديلاتك ] =====
bot.action("adm:panel", async (ctx) => {
  if(!admins.includes(ctx.from.id)) return ctx.answerCbQuery("ليس لديك صلاحية");
  ctx.editMessageText("👑 لوحة تحكم الادمن", Markup.inlineKeyboard([
    [Markup.button.callback(botStatus === 'on'? "🟢 عمل البوت: شغّال" : "🔴 عمل البوت: متوقف", "adm:toggleStatus")], // [5]
    [Markup.button.callback("💰 ربح قسم", "adm:setCatMarkup:1")],
    [Markup.button.callback("🔢 ترتيب قسم", "adm:setCatSort:1")],
    [Markup.button.callback("👤 ربح مستخدم", "adm:setUserMarkup:0")],
    [Markup.button.callback("⬅️ رجوع", "back:main")]
  ]));
});

bot.action("adm:toggleStatus", async (ctx) => { // [5]
  botStatus = botStatus === 'on'? 'off' : 'on';
  await ctx.answerCbQuery("تم تغيير حالة البوت");
  ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
    [Markup.button.callback(botStatus === 'on'? "🟢 عمل البوت: شغّال" : "🔴 عمل البوت: متوقف", "adm:toggleStatus")]
  ]).reply_markup)
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
  ctx.reply(`ارسل ايدي المستخدم ثم نسبة الربح %`);
  bot.once('text', (ctx2) => {
    const [userId, percent] = ctx2.message.text.split(" ");
    userMarkups[userId] = Number(percent);
    ctx2.reply(`✅ تم حفظ ربح ${percent}% للمستخدم ${userId}`);
  });
});

// ===== [ التشغيل ] =====
bot.launch();
console.log("Bot started successfully");

http.createServer((_, res) => { res.writeHead(200); res.end("OK"); }).listen(process.env.PORT || 3000);
