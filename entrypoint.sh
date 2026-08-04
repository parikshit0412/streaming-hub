#!/bin/sh
set -e

# Start Grafana in the background
grafana-server \
  --homepath=/usr/share/grafana \
  --config=/etc/grafana/grafana.ini \
  cfg:default.paths.data=/var/lib/grafana \
  cfg:default.paths.logs=/var/log/grafana \
  cfg:default.paths.provisioning=/etc/grafana/provisioning &

# Wait for Grafana to initialize before starting Express
sleep 3

# Start Node preview server in foreground
exec node preview-server.js
