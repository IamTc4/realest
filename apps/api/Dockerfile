FROM node:18-alpine

WORKDIR /app

COPY package.json .
COPY apps/api/package.json ./apps/api/

RUN npm install

COPY apps/api ./apps/api

WORKDIR /app/apps/api

RUN npx prisma generate

EXPOSE 3001

CMD ["node", "index.js"]
