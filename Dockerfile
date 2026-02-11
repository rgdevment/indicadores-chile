################################
# Base: shared across stages
################################
FROM node:24-alpine AS base
RUN apk add --no-cache dumb-init
WORKDIR /app

################################
# Dependencies: install all deps
################################
FROM base AS deps
COPY package*.json ./
RUN npm ci --ignore-scripts

################################
# Development: hot-reload target
################################
FROM deps AS development
ENV NODE_ENV=development
COPY . .
EXPOSE 3000 9229
CMD ["dumb-init", "npx", "nest", "start", "--watch"]

################################
# Builder: compile TypeScript
################################
FROM deps AS builder
COPY . .
RUN npm run build

################################
# Production: minimal & secure
################################
FROM base AS production

ENV NODE_ENV=production

# Production-only dependencies
COPY package*.json ./
RUN npm ci --ignore-scripts --omit=dev && npm cache clean --force

# Copy compiled app from builder
COPY --from=builder /app/dist ./dist

# Copy i18n resources if present
COPY --from=builder /app/src/resources ./dist/resources

# Non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch('http://localhost:3000/health').then(r=>{if(!r.ok)throw r});process.exit(0)"]

CMD ["dumb-init", "node", "dist/main"]
