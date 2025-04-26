# -----------------------
# STAGE 1: Build NestJS App (with full deps)
# -----------------------
FROM --platform=linux/arm64 node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy dependency definitions and install everything
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy source code and build
COPY . .
RUN pnpm run build

# -----------------------
# STAGE 2: Runtime (lightweight production image)
# -----------------------
FROM --platform=linux/arm64 node:22-alpine AS runner

# Use non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Install pnpm runtime (required if node_modules needs pnpm structure)
RUN npm install -g pnpm

# Copy only necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Set permissions
RUN chown -R appuser:appgroup /app
USER appuser

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main"]
