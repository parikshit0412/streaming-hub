# StreamingHub Project Gaps Analysis

This document outlines the architectural, deployment, monitoring, developer experience, and security gaps identified in the current state of the **StreamingHub** micro-frontend (MFE) repository.

---

## 1. Architectural & MFE Integration Gaps

*   **Iframe-based Isolation vs. Modern MFEs:**
    *   The host application (`apps/host`) embeds the Vue and Angular micro-frontends using `<iframe src="http://localhost:4201">` and `<iframe src="http://localhost:4202">`.
    *   **Implications:** Iframes cause layout/scrolling friction, break accessibility, disrupt browser back-button navigation, and introduce performance overhead (loading separate runtimes and vendor libraries).
    *   **Better Approach:** Utilize a modern micro-frontend approach like **Webpack Module Federation**, **single-spa**, or **Web Components** to run everything in a single DOM context.
*   **Hardcoded Development Ports in Host App:**
    *   The iframe URLs in [app.tsx](file:///d:/ReactPlayProjects/project_one/streaming-hub/apps/host/src/app/app.tsx) are hardcoded to `http://localhost:4201` (Vue) and `http://localhost:4202` (Angular).
    *   **Implications:** The application will fail when deployed to any environment other than a local machine where ports 4201 and 4202 are active.
*   **Lack of Cross-MFE Routing & Deep Linking:**
    *   The routing in the host application is controlled via basic React state (`activeTab`).
    *   **Implications:** If a user refreshes the page while on the Settings or Browse tab, it resets back to the Home tab. Also, it is impossible to deep-link directly to a specific sub-route within the Angular or Vue micro-frontends.
*   **Zero MFE Communication / Shared State:**
    *   There is no message-passing interface or shared store between the React host, Vue browse, and Angular settings MFEs.
    *   **Implications:** Features like user profile updates in the Settings MFE cannot propagate to the Host navigation bar avatar or other MFE views.

---

## 2. Docker & Reverse Proxy Orchestration Gaps

*   **Incomplete Docker Compose Setup:**
    *   [docker-compose.yml](file:///d:/ReactPlayProjects/project_one/streaming-hub/docker-compose.yml) only defines the `grafana` service.
    *   **Implications:** There are no services configured for Nginx, the React host app, the Vue app, or the Angular app, making it impossible to spin up the entire application stack with a single `docker compose up` command.
*   **Orphaned Nginx Configuration:**
    *   An [nginx.conf](file:///d:/ReactPlayProjects/project_one/streaming-hub/nginx.conf) exists in the root directory and defines reverse proxy rules mapping `/` to `host-app:80`, `/browse` to `browse-app:80`, and `/settings` to `settings-app:80`.
    *   **Implications:** These proxy targets are Docker DNS-based names (`host-app`, `browse-app`, `settings-app`), which will fail to resolve because they are not declared in `docker-compose.yml`.
*   **Missing `.dockerignore` Files:**
    *   None of the MFE directories (`apps/host`, `apps/browse`, `apps/settings`) or the root folder contain a `.dockerignore` file.
    *   **Implications:** Running Docker builds will copy massive local folders like `node_modules`, `.angular`, and `.nx` into the Docker build context. This causes slow builds and can lead to runtime execution issues inside Alpine container environments (due to OS-mismatched binaries).

---

## 3. Monitoring & Grafana Integration Gaps

*   **Mocked System Metrics:**
    *   The embedded Grafana dashboard in Account Settings (`apps/settings/src/app/app.html`) displays streaming latency and active viewers. However, the dashboard configuration ([streaming_metrics.json](file:///d:/ReactPlayProjects/project_one/streaming-hub/grafana/dashboards/streaming_metrics.json)) utilizes Grafana's built-in **`randomWalk`** mock data query.
    *   **Implications:** No real metrics are collected or displayed.
*   **No Active Telemetry Exporter:**
    *   There are no telemetry collectors (e.g., Prometheus, OpenTelemetry Collector) or telemetry SDKs/exporters set up in the frontends or backends to measure real load times, buffering metrics, video start delays, or API errors.

---

## 4. Developer Experience (DX) Gaps

*   **Empty npm Scripts:**
    *   The root [package.json](file:///d:/ReactPlayProjects/project_one/streaming-hub/package.json) contains an empty `"scripts"` object: `"scripts": {}`.
    *   **Implications:** Developers must manually type complex Nx commands like `npx nx serve host`, `npx nx serve browse`, and `npx nx serve settings` in separate terminal windows. There is no unified `npm run dev` or `npm run start` script to concurrently launch all local servers.
*   **Duplicate Styling Systems:**
    *   Each app features duplicate stylesheet rules for common UI patterns (e.g., `.btn`, `.btn-primary`, `.glass-panel`, and `@import url('https://fonts.googleapis.com/...');`).
    *   **Implications:** Changes to the design language (colors, borders, fonts) require updating multiple separate files in different apps, violating the DRY (Don't Repeat Yourself) principle.

---

## 5. Security & Authentication Gaps

*   **Static/Disabled Profile Updates:**
    *   The Account Settings page shows a mockup profile interface where editing fields is disabled, and changes cannot be saved back to any database or backend service.
*   **Unauthenticated Grafana Embed:**
    *   Grafana is set to allow anonymous viewing and embedding without any authentication layer (`GF_AUTH_ANONYMOUS_ENABLED=true`).
    *   **Implications:** Although fine for local demonstrations, this introduces security concerns if deployed publicly, as arbitrary external websites could embed the dashboard or access internal system insights.
