FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY .

WORKDIR /app/artifacts/api-server
RUN npx prisma generate

WORKDIR /app
CMD ["sh", "-c", "cd artifacts/api-server && npx prisma db push && npx tsx dist/index.js"]
