FROM node:18
WORKDIR /app
COPY package.json ./
RUN npm install
COPY .
EXPOSE 8080
CMD ["npx", "tsx", "المصدر/index.ts"]
