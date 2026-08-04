# Stage 1: Build all micro-frontends in Nx monorepo
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build all applications (Host, Browse, Settings, Watchlist)
COPY . .
RUN npx nx run-many --target=build

# Stage 2: Production Server
FROM node:20-alpine AS runner
WORKDIR /app

# Install only production dependencies (Express)
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled application outputs and preview-server script
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/apps/watchlist/out ./apps/watchlist/out
COPY --from=builder /app/preview-server.js ./preview-server.js

# Render dynamic PORT fallback
ENV PORT=10000
EXPOSE 10000

CMD ["node", "preview-server.js"]
