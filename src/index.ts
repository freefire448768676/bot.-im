import express from 'express';
import http from 'http';
import { startBot } from './bot/index';

const app = express();
const PORT = process.env.PORT || 3000;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

// 1. Health check ل Railway
app.get('/health', (req, res) => {
  res.send('OK');
});

// 2. الصفحة الرئيسية
app.get('/', (req, res) => {
  res.send('Bot is running');
});

// 3. شغل السيرفر
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Health server running on port ${PORT}`);
});

// 4. شغل البوت تبعك
startBot().catch((err) => {
  console.error('Failed to start bot', err);
  process.exit(1);
});

// 5. اهم شي: Keep Alive كل 14 دقيقة عشان Railway ما ينيمه
setInterval(() => {
  http.get(`${APP_URL}/health`, (res) => {
    console.log(`Keep alive ping: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error('Keep alive error:', err.message);
  });
}, 14 * 60 * 1000);

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
