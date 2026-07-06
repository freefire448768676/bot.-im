FROM node:20-alpine

WORKDIR /app

# انسخ كل المشروع
COPY .

# فوت على مجلد البوت ونزل المكتبات
WORKDIR /app/artifacts/api-server
RUN npm install

# شغل Prisma
RUN npx prisma generate

# ارجع لل root وشغل
WORKDIR /app
CMD ["sh", "-c", "cd artifacts/api-server && npx prisma db push && node dist/index.js"]
