################################
# Base: imagen mínima compartida
################################
FROM node:24-alpine AS base
RUN apk add --no-cache dumb-init
WORKDIR /app

################################
# Dependencias: compilación nativa (better-sqlite3)
################################
FROM base AS deps
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci && npm cache clean --force

################################
# Development: hot-reload + debugger
################################
FROM deps AS development
ENV NODE_ENV=development
COPY . .
EXPOSE 3000 9229
CMD ["dumb-init", "npx", "nest", "start", "--watch"]

################################
# Builder: compila TypeScript
################################
FROM deps AS builder
COPY . .
RUN npm run build && npm prune --omit=dev

################################
# Production: imagen mínima y segura
################################
FROM base AS production

ENV NODE_ENV=production

# Solo copiar lo necesario desde builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/resources ./dist/resources
COPY --from=builder /app/package.json ./

# Crear directorio para volumen de datos + usuario sin privilegios
RUN mkdir -p /app/data \
    && addgroup -S app && adduser -S app -G app \
    && chown -R app:app /app

USER app

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch('http://localhost:3000/health').then(r=>{if(!r.ok)throw r});process.exit(0)"]

CMD ["dumb-init", "node", "dist/main"]
