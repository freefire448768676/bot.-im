import { Telegraf, Markup } from "telegraf";
import http from "http";
import "dotenv/config";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is not set");

const bot = new Telegraf(token);

// ===== [ ذاكرة بدل DB ] =====
let botStatus = 'on';
let admins = [YOUR_ID_HERE]; // <<< حط ايدي التليجرام تبعك هون
let categoryOverrides = {}; // { "1": {markup: 10, sort: 1} }
let userMarkups = {}; // { "123": 5 }
let products = [ // حط منتجاتك هون مؤقت
  {id: 1, parent_id: 1, name: "منتج تجريبي", base_price: 10, price: 10}
];

// ===== [ دوال السعر ] =====
function effectivePriceUsd(p, catMarkup, userMarkup, globalMarkup = 0) {
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

// ===== [ الاوامر ] =====
bot.start((ctx) => {
  ctx.reply(`اهلا ${ctx.from.first_name}`);
});

bot.command('admin', (ctx) => {
  if(!admins.includes(ctx.from.id)) return;
  ctx.reply("لوحة الادمن", Markup.inlineKeyboard([
    [Markup.button.callback(botStatus === 'on'? "🟢 عمل البوت: شغّال" : "🔴 عمل البوت: متوقف", "adm:toggleStatus")]
  ]));
});

// ===== [ ازرار الادمن - تعديلاتك ] =====
bot.action("adm:toggleStatus", async (ctx) => {
  botStatus = botStatus === 'on'? 'off' : 'on';
  await ctx.answerCbQuery("تم");
  await ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
    [Markup.button.callback(botStatus === 'on'? "🟢 عمل البوت: شغّال" : "🔴 عمل البوت: متوقف", "adm:toggleStatus")]
  ]).reply_markup)
});

bot.action(/adm:setCatMarkup:(\d+)/, (ctx) => {
  const catId = ctx.match[1];
  ctx.reply(`ارسل نسبة الربح الجديدة للقسم ${catId} %`);
  bot.once('text', (ctx2) => {
    categoryOverrides[catId] = {...categoryOverrides[catId], markup: Number(ctx2.message.text) };
    ctx2.reply("تم حفظ نسبة الربح");
  });
});

bot.action(/adm:setCatSort:(\d+)/, (ctx) => {
  const catId = ctx.match[1];
  ctx.reply(`ارسل رقم الترتيب الجديد للقسم ${catId}`);
  bot.once('text', (ctx2) => {
    categoryOverrides[catId] = {...categoryOverrides[catId], sort: Number(ctx2.message.text) };
    ctx2.reply("تم حفظ الترتيب");
  });
});

bot.action(/adm:setUserMarkup:(\d+)/, (ctx) => {
  const userId = ctx.match[1];
  ctx.reply(`ارسل نسبة الربح الخاصة للمستخدم ${userId} %`);
  bot.once('text', (ctx2) => {
    userMarkups[userId] = Number(ctx2.message.text);
    ctx2.reply("تم حفظ نسبة ربح المستخدم");
  });
});

// ===== [ زر الرجوع - تعديلك ] =====
bot.action(/cat:(\d+):(\d+):(\d+)/, (ctx) => {
  const [,catId, backTo] = ctx.match;
  if(backTo === '0'){
    return ctx.editMessageText("قائمة الأقسام"); // رجوع للقائمة
  }
  ctx.editMessageText(`داخل القسم ${catId}`);
});

// ===== [ الطلب - تعديلاتك ] =====
async function startOrderFlow(ctx, productId) {
  try{
    const p = products.find(x => x.id === productId);
    if(!p) return;

    const ov = categoryOverrides[p.parent_id] || {};
    const catMarkup = Number(ov.markup || 0);
    const userMarkup = Number(userMarkups[ctx.from.id] || 0);

    const totalUsd = effectivePriceUsd(p, catMarkup, userMarkup);

    if(totalUsd === 0){
      return ctx.reply("⚠️ هذا المنتج لا يملك سعراً محدداً في النظام. يرجى التواصل مع الإدارة لضبط سعره.");
    }
    ctx.reply(`📋 الرد: سعر المنتج ${totalUsd.toFixed(2)}$`); // "الرد" بدل "رد الموقع"
  }catch(e){console.error(e)}
}

// ===== [ التشغيل ] =====
async function main() {
  bot.catch((err, ctx) => console.error("Bot error", err));
  await bot.launch({ dropPendingUpdates: true });
  console.log("Bot started");

  // سيرفر وهمي لـ Railway
  http.createServer((_, res) => { res.writeHead(200); res.end("OK"); }).listen(process.env.PORT || 3000);

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}
main();
