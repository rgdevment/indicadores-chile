FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.4.0 --activate

COPY package.json yarn.lock ./

RUN yarn install --immutable

COPY . .

RUN yarn build

FROM node:20-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.4.0 --activate

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/node_modules ./node_modules

RUN yarn install --immutable --check-cache

EXPOSE 3000

ENV NODE_ENV=production

CMD ["yarn", "start:prod"]
