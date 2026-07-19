import { Telegraf, Markup, session } from "telegraf";
import http from "http";
import "dotenv/config";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is not set");
const bot = new Telegraf(token);
bot.use(session());

// ===== [CONFIG] =====
const ADMIN_IDS = [0]; // <<< حط ايديك هون من @userinfobot
let BOT_STATUS = 'on'; // [5] عمل البوت
let GLOBAL_MARKUP = 0;

// ===== [DB IN MEMORY - نسخة من ريبلت] =====
let DB = {
  categories: [
    {id: 1, parent_id: 0, name: "🎮 شحن العاب", sortOrder: 1, hidden: false},
    {id: 2, parent_id: 0, name: "📱 خدمات السوشيال", sortOrder: 2, hidden: false},
    {id: 3, parent_id: 0, name: "💳 بطاقات رقمية", sortOrder: 3, hidden: false}
  ],
  products: [
    {id: 1, parent_id: 1, name: "بجي 60 UC", base_price: 1.50, price: 1.50, description: "يصل خلال 5 دقائق - بالايدي", stock: 999},
    {id: 2, parent_id: 1, name: "بجي 325 UC", base_price: 7.50, price: 7.50, description: "يصل خلال 5 دقائق - بالايدي", stock: 999},
    {id: 3, parent_id: 2, name: "متابعين انستا 1000", base_price: 3.00, price: 3.00, description: "ضمان شهر", stock: 999},
    {id: 4, parent_id: 3, name: "بطاقة قوقل بلاي 10$", base_price: 10.00, price: 10.00, description: "كود فوري", stock: 10},
  ],
  categoryOverrides: {}, // [2] {catId: {customMarkupPercent, sortOrder, customName}}
  userMarkups: {}, // [2] {userId: percent}
  users: {}, // {userId: {balance: 0, customMarkupPercent: 0}}
  orders: [] // {id, userId, productId, status, price, info}
};
let ORDER_ID = 1;

// ===== [UTILS - نفس ريبلت] =====
function getAdmins() { // [1] listAdmins
  return ADMIN_IDS;
}

function loadCategoryOverrides() { // [3]
  return DB.categoryOverrides;
}

function effectivePriceUsd(p, catMarkup, userMarkup, globalMarkup = GLOBAL_MARKUP) { // [3]
  let price = Number(p.price || p.base_price || 0); // [1] fallback
  if(price === 0) return 0; // [3] حجب 0$

  const markups = [catMarkup, userMarkup, globalMarkup].filter(x => x > 0);
  const finalMarkup = markups[0] || 0;
  return price * (1 + finalMarkup / 100);
}

// ===== [MIDDLEWARE - [4] + [5]] =====
bot.use(async (ctx, next) => {
  // [5] عمل البوت
  if (BOT_STATUS === "off" && ctx.from) {
    if (!ADMIN_IDS.includes(ctx.from.id)) {
      if (ctx.callbackQuery) return ctx.answerCbQuery("🚫 البوت متوقف مؤقتاً");
      return ctx.reply("🚫 البوت متوقف مؤقتاً للصيانة. يرجى المحاولة لاحقاً.");
    }
  }

  // [4] Rate Limit
  const id = ctx.from?.id;
  if(id){
    const now = Date.now();
    ctx.session.reqTimes = (ctx.session.reqTimes || []).filter(t => now - t < 1000);
    if(ctx.session.reqTimes.length >= 3) return ctx.answerCbQuery("⏳ انتظر قليلاً ثم أعد المحاولة");
    ctx.session.reqTimes.push(now);
  }
  return next();
});

// ===== [KEYBOARDS] =====
function mainMenu(ctx) {
  return Markup.inlineKeyboard([
    [Markup.button.callback("📦 المنتجات", "show:categories")],
    [Markup.button.callback("💰 رصيدي", "show:wallet")],
    [Markup.button.callback("📋 طلباتي", "show:orders")],
    [Markup.button.callback("👑 لوحة الادمن", "adm:panel")]
  ]);
}

function categoriesMenu() {
  const overrides = loadCategoryOverrides(); // [3]
  const sorted = [...DB.categories]
   .filter(c =>!c.hidden)
   .sort((a,b) => (overrides[a.id]?.sortOrder || a.sortOrder || 999) - (overrides[b.id]?.sortOrder || b.sortOrder || 999)); // [1]

  const buttons = sorted.map(c => [Markup.button.callback(overrides[c.id]?.customName || c.name, `cat:${c.id}:0:0`)]); // [1] backTo=0
  buttons.push([Markup.button.callback("⬅️ القائمة الرئيسية", "back:main")]);
  return Markup.inlineKeyboard(buttons);
}

function productsMenu(catId) {
  const prods = DB.products.filter(p => p.parent_id == catId && p.stock > 0);
  const buttons = prods.map(p => [Markup.button.callback(p.name, `prod:${p.id}`)]);
  buttons.push([Markup.button.callback("⬅️ رجوع للاقسام", "back:categories")]); // [1]
  return Markup.inlineKeyboard(buttons);
}

function adminPanel() {
  return Markup.inlineKeyboard([
    [Markup.button.callback(BOT_STATUS === 'on'? "🟢 عمل البوت: شغّال" : "🔴 عمل البوت: متوقف", "adm:toggleStatus")], // [5]
    [Markup.button.callback("💰 ربح قسم", "adm:menu:setCatMarkup")],
    [Markup.button.callback("🔢 ترتيب قسم", "adm:menu:setCatSort")],
    [Markup.button.callback("👤 ربح مستخدم", "adm:menu:setUserMarkup")],
    [Markup.button.callback("📦 ادارة المنتجات", "adm:menu:products")],
    [Markup.button.callback("⬅️ رجوع", "back:main")]
  ]);
}

// ===== [HANDLERS - نفس منطق ريبلت] =====
bot.start(async (ctx) => { // [4] try/catch
  try {
    if(!DB.users[ctx.from.id]) DB.users[ctx.from.id] = {balance: 0, customMarkupPercent: 0};
    ctx.reply(`اهلا ${ctx.from.first_name} 👋\nفي متجر المروان`, mainMenu(ctx));
  } catch(e) { console.error(e) }
});

bot.command('menu', (ctx) => ctx.reply("القائمة الرئيسية", mainMenu(ctx)));

bot.action("show:categories", async (ctx) => {
  try { await ctx.editMessageText("اختر القسم:", categoriesMenu()); } catch(e){}
});

bot.action(/cat:(\d+):(\d+):(\d+)/, async (ctx) => { // [1] زر الرجوع
  try {
    const [,catId, backTo] = ctx.match;
    if(backTo === '0') return ctx.editMessageText("اختر القسم:", categoriesMenu());
    await ctx.editMessageText("اختر المنتج:", productsMenu(catId));
  } catch(e){}
});

bot.action("back:main", async (ctx) => {
  try { await ctx.editMessageText(`اهلا ${ctx.from.first_name} 👋\nفي متجر المروان`, mainMenu(ctx)); } catch(e){}
});

bot.action("back:categories", async (ctx) => {
  try { await ctx.editMessageText("اختر القسم:", categoriesMenu()); } catch(e){}
});

bot.action("show:wallet", async (ctx) => {
  const user = DB.users[ctx.from.id];
  ctx.answerCbQuery(`رصيدك: ${user.balance.toFixed(2)}$`, {show_alert: true});
});

bot.action("show:orders", async (ctx) => {
  const myOrders = DB.orders.filter(o => o.userId == ctx.from.id);
  if(myOrders.length === 0) return ctx.answerCbQuery("لا توجد طلبات", {show_alert: true});
  let text = "📋 طلباتك:\n\n" + myOrders.map(o => `#${o.id} - ${DB.products.find(p=>p.id==o.productId)?.name} - ${o.status}`).join("\n");
  ctx.answerCbQuery(text, {show_alert: true});
});

bot.action(/prod:(\d+)/, async (ctx) => { // [3] startOrderFlow
  try {
    const p = DB.products.find(x => x.id == ctx.match[1]);
    if(!p) return;

    const overrides = loadCategoryOverrides();
    const ov = overrides[p.parent_id] || {};
    const catMarkup = Number(ov.customMarkupPercent || 0); // [3]
    const userMarkup = Number(DB.users[ctx.from.id]?.customMarkupPercent || 0); // [3]
    const totalUsd = effectivePriceUsd(p, catMarkup, userMarkup);

    if(totalUsd === 0){ // [3] حجب 0$
      return ctx.reply("⚠️ هذا المنتج لا يملك سعراً محدداً في النظام. يرجى التواصل مع الإدارة لضبط سعره.");
    }

    // [1] "📋 الرد:"
    ctx.reply(
      `📋 الرد: تأكيد الطلب\n\n` +
      `المنتج: ${p.name}\n` +
      `السعر: ${totalUsd.toFixed(2)}$\n` +
      `الوصف: ${p.description}\n\n` +
      `ارسل المعلومات المطلوبة:`,
      Markup.inlineKeyboard([[Markup.button.callback("✅ تأكيد الطلب", `order:confirm:${p.id}:${totalUsd}`)]])
    );
  } catch(e) { console.error(e) }
});

bot.action(/order:confirm:(\d+):([\d.]+)/, async (ctx) => {
  try {
    const [,prodId, price] = ctx.match;
    const order = {
      id: ORDER_ID++, userId: ctx.from.id, productId: Number(prodId),
      status: "قيد التنفيذ", price: Number(price), info: "تم الطلب"
    };
    DB.orders.push(order);

    // [1] اشعار للادمن
    for(const adminId of getAdmins()){
      bot.telegram.sendMessage(adminId, `🔔 طلب جديد #${order.id}\nمن: ${ctx.from.first_name}\nالمنتج: ${DB.products.find(p=>p.id==prodId)?.name}\nالسعر: ${price}$`);
    }

    ctx.editMessageText(`✅ تم استلام طلبك #${order.id}\nسيتم تنفيذه قريبا`);
  } catch(e) { console.error(e) }
});

// ===== [ADMIN HANDLERS - [2]] =====
bot.action("adm:panel", async (ctx) => {
  try {
    if(!ADMIN_IDS.includes(ctx.from.id)) return ctx.answerCbQuery("ليس لديك صلاحية");
    await ctx.editMessageText("👑 لوحة تحكم الادمن", adminPanel());
  } catch(e){}
});

bot.action("adm:toggleStatus", async (ctx) => { // [5]
  try {
    BOT_STATUS = BOT_STATUS === 'on'? 'off' : 'on';
    await ctx.answerCbQuery("تم تغيير حالة البوت");
    await ctx.editMessageReplyMarkup(adminPanel().reply_markup)
  } catch(e){}
});

bot.action("adm:menu:setCatMarkup", async (ctx) => { // [2]
  ctx.reply("ارسل: `ايدي_القسم نسبة_الربح`", {parse_mode: "Markdown"});
  bot.once('text', (ctx2) => {
    const [catId, percent] = ctx2.message.text.split(" ");
    DB.categoryOverrides[catId] = {...DB.categoryOverrides[catId], customMarkupPercent: Number(percent) };
    ctx2.reply(`✅ تم حفظ ربح ${percent}% للقسم ${catId}`);
  });
});

bot.action("adm:menu:setCatSort", async (ctx) => { // [2]
  ctx.reply("ارسل: `ايدي_القسم رقم_الترتيب`", {parse_mode: "Markdown"});
  bot.once('text', (ctx2) => {
    const [catId, sort] = ctx2.message.text.split(" ");
    DB.categoryOverrides[catId] = {...DB.categoryOverrides[catId], sortOrder: Number(sort) };
    ctx2.reply(`✅ تم حفظ ترتيب ${sort} للقسم ${catId}`);
  });
});

bot.action("adm:menu:setUserMarkup", async (ctx) => { // [2]
  ctx.reply("ارسل: `ايدي_المستخدم نسبة_الربح`", {parse_mode: "Markdown"});
  bot.once('text', (ctx2) => {
    const [userId, percent] = ctx2.message.text.split(" ");
    if(!DB.users[userId]) DB.users[userId] = {balance: 0};
    DB.users[userId].customMarkupPercent = Number(percent);
    ctx2.reply(`✅ تم حفظ ربح ${percent}% للمستخدم ${userId}`);
  });
});

bot.action("adm:menu:products", async (ctx) => {
  let text = "📦 المنتجات:\n" + DB.products.map(p => `${p.id}. ${p.name} - ${p.price}$`).join("\n");
  ctx.reply(text);
});

// ===== [LAUNCH - [4]] =====
bot.launch();
console.log("Bot started successfully");

http.createServer((_, res) => { res.writeHead(200); res.end("OK"); }).listen(process.env.PORT || 3000); // [4] Express

// [4] Error handlers
process.on("uncaughtException", (e) => console.error("uncaughtException", e));
process.on("unhandledRejection", (e) => console.error("unhandledRejection", e));
bot.catch((err, ctx) => console.error("Bot error", err));
