FROM grafana/grafana:10.0.3-ubuntu

# Copy provisioning configurations
COPY --chown=472:472 ./grafana/provisioning /etc/grafana/provisioning
COPY --chown=472:472 ./grafana/dashboards /etc/grafana/dashboards
