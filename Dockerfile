# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY .env ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src/ ./src/
COPY types/ ./types/

# Build the application
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# Production stage
FROM node:20-alpine AS production

# Set node to production
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY .env ./

# Non-root user for security
RUN addgroup -g 1001 nodeapp && \
    adduser -S -u 1001 -G nodeapp nodeapp && \
    chown -R nodeapp:nodeapp /app

USER nodeapp

# Expose port (adjust as needed)
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]