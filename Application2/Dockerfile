FROM node:18-alpine AS builder

#Install dependencies backend
WORKDIR /app
COPY package.json ./.
COPY package-lock.json ./.
COPY .env ./.
COPY src ./src/.
RUN npm install

#Install depedencies frontend
WORKDIR /app/frontend
COPY ./frontend/public ./public/.
COPY ./frontend/src ./src/.
COPY ./frontend/index.html ./.
COPY ./frontend/package.json ./.
COPY ./frontend/package-lock.json ./.
COPY ./frontend/postcss.config.cjs ./.
COPY ./frontend/tailwind.config.cjs ./.
COPY ./frontend/vite.config.js ./.
RUN npm install

WORKDIR /app
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules/.
COPY --from=builder /app/public ./public/.
COPY --from=builder /app/src ./src/.
COPY --from=builder /app/.env ./.
COPY --from=builder /app/package.json ./.

CMD ["node", "./src/index.js"]