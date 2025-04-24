# -----------------------
# STAGE 1: Build NestJS App (with full deps)
# -----------------------
FROM --platform=linux/arm64 node:22-alpine AS builder

WORKDIR /app

# Copy dependency definitions and install everything (dev included for build)
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# -----------------------
# STAGE 2: Runtime (lightweight production image)
# -----------------------
FROM --platform=linux/arm64 node:22-alpine AS runner

# Use non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only what we need from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Permissions and env
RUN chown -R appuser:appgroup /app
USER appuser

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main"]
