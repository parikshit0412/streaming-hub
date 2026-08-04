# Stage 1: Build all micro-frontends in Nx monorepo
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build all applications (Host, Browse, Settings, Watchlist)
COPY . .
RUN npx nx run-many --target=build

# Stage 2: Production Server with Grafana & Express
FROM node:20-alpine AS runner
WORKDIR /app

# Install Grafana package inside Alpine
RUN apk add --no-cache grafana

# Prepare Grafana directories and default config
RUN mkdir -p /etc/grafana /var/lib/grafana /var/log/grafana \
    && touch /etc/grafana/grafana.ini \
    && chmod -R 777 /var/lib/grafana /var/log/grafana

# Copy Grafana provisioning and dashboards
COPY ./grafana/provisioning /etc/grafana/provisioning
COPY ./grafana/dashboards /etc/grafana/dashboards

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled application outputs and server script
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/apps/watchlist/out ./apps/watchlist/out
COPY --from=builder /app/preview-server.js ./preview-server.js
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

# Grafana environment variables
ENV GF_SECURITY_ALLOW_EMBEDDING=true
ENV GF_AUTH_ANONYMOUS_ENABLED=true
ENV GF_AUTH_ANONYMOUS_ORG_ROLE=Viewer
ENV GF_AUTH_DISABLE_LOGIN_FORM=true
ENV GF_DASHBOARDS_DEFAULT_HOME_DASHBOARD_PATH=/etc/grafana/dashboards/streaming_metrics.json
ENV GF_SERVER_SERVE_FROM_SUB_PATH=true
ENV GF_SERVER_ROOT_URL=http://localhost:3000/grafana/
ENV GF_SERVER_HTTP_PORT=3000
ENV GF_PATHS_DATA=/var/lib/grafana
ENV GF_PATHS_LOGS=/var/log/grafana
ENV GF_PATHS_PROVISIONING=/etc/grafana/provisioning

# Render dynamic PORT fallback
ENV PORT=10000
EXPOSE 10000

CMD ["/bin/sh", "entrypoint.sh"]
