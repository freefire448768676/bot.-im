import { Bot } from 'grammy'
import { db } from './lib/db/index.js'
import { logger } from './lib/logger.js'
import dotenv from 'dotenv'

dotenv.config()

const bot = new Bot(process.env.BOT_TOKEN!)

bot.command('start', async (ctx) => {
  await ctx.reply('البوت اشتغل يا معلم 🔥')
  logger.info(`User ${ctx.from?.id} started bot`)
})

bot.on('message:text', async (ctx) => {
  await ctx.reply(`انت قلت: ${ctx.message.text}`)
})

bot.catch((err) => {
  logger.error(err)
})

bot.start()
logger.info('Bot is running...')
