# Stage 1: Build the project
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Enable Corepack and Yarn 4.4.0, and install dependencies
COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack enable && corepack prepare yarn@4.4.0 --activate \
    && yarn install --immutable

# Copy the rest of the project files and build
COPY . .
RUN yarn build

# Stage 2: Create the production image
FROM node:20-alpine AS runner

# Create non-root user, set working directory, and prepare environment
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && mkdir -p /app

WORKDIR /app

# Copy built project and necessary files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml

# Install only production dependencies and set ownership
RUN corepack enable && corepack prepare yarn@4.4.0 --activate \
    && yarn workspaces focus --production \
    && chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port 3000
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Command to run the application
CMD ["yarn", "start:prod"]
