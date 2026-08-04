#!/bin/sh
# Ensure Grafana config directory and file exist
mkdir -p /etc/grafana
touch /etc/grafana/grafana.ini

# Start Grafana service in background on port 3000
grafana-server --homepath /usr/share/grafana --config /etc/grafana/grafana.ini &

# Start Node preview server in foreground
exec node preview-server.js
