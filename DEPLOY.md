# 🚀 StreamHub: Complete Deployment Guide

This guide provides step-by-step instructions for deploying the **StreamHub** micro-frontend monorepo to production. You can deploy using either **Docker (Recommended for Cloud Server/VM)** or **Vercel (Recommended for Serverless CDN)**.

---

## 🐳 Option 1: Docker-Based Deployment (AWS EC2 / DigitalOcean / Cloud VM)

This approach hosts the entire micro-frontend stack—including the **React Host**, **Vue Browse**, **Angular Settings**, **Next.js Watchlist**, **Nginx Reverse Proxy**, and **Grafana Metrics**—behind a single Nginx reverse proxy on a virtual server.

### Prerequisites
* Cloud VM (Ubuntu 22.04 LTS recommended, 2GB+ RAM)
* Docker & Docker Compose V2

### Step-by-Step Execution
1. **SSH into your Cloud Server**:
   ```sh
   ssh root@<YOUR_SERVER_IP>
   ```

2. **Install Docker & Docker Compose V2**:
   ```sh
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y docker.io docker-compose-v2
   ```

3. **Clone Repository & Boot Stack**:
   ```sh
   git clone https://github.com/parikshit0412/streaming-hub.git
   cd streaming-hub
   docker compose up -d --build
   ```

4. **Access Live Services**:
   * 🎬 **StreamHub Main Portal**: `http://<YOUR_SERVER_IP>:8080` *(To serve on standard port 80, update `docker-compose.yml` port mapping from `"8080:80"` to `"80:80"`)*.
   * 📊 **Grafana Telemetry Dashboard**: `http://<YOUR_SERVER_IP>:3000`.

---

## ⚡ Option 2: Serverless CDN Deployment (Vercel)

Vercel allows you to host all micro-frontends completely for free. Since the sub-apps compile into optimized static exports in production, we deploy them as **4 separate Vercel projects** connected via edge path rewrites.

### Step 1: Deploy Sub-Microfrontends
On your [Vercel Dashboard](https://vercel.com/), click **Add New > Project**, import the `streaming-hub` repository 3 times, and configure each project as follows:

| App | Vercel Project Name | Framework Preset | Build Command | Output Directory |
| :--- | :--- | :--- | :--- | :--- |
| **Vue Browse** | `streaming-hub-browse` | Vite | `npm run build:browse` | `dist/apps/browse` |
| **Angular Settings** | `streaming-hub-settings` | Angular | `npm run build:settings` | `dist/apps/settings/browser` |
| **Next.js Watchlist** | `streaming-hub-watchlist` | Other *(Static Export)* | `npm run build:watchlist` | `apps/watchlist/out` |

*Note down the assigned production URL for each sub-project (e.g., `https://streaming-hub-browse.vercel.app`).*

---

### Step 2: Update Vercel Edge Rewrites
Open [vercel.json](file:///d:/ReactPlayProjects/project_one/streaming-hub/vercel.json) in your root directory and set the destination URLs to your deployed Vercel sub-app URLs:

```json
{
  "rewrites": [
    { "source": "/browse/:path*", "destination": "https://your-vue-mfe-url.vercel.app/:path*" },
    { "source": "/settings/:path*", "destination": "https://your-angular-mfe-url.vercel.app/:path*" },
    { "source": "/watchlist/:path*", "destination": "https://your-watchlist-mfe-url.vercel.app/:path*" }
  ]
}
```

Commit and push your updated `vercel.json`:
```sh
git add vercel.json apps/host/vercel.json
git commit -m "chore: configure production Vercel MFE rewrite destinations"
git push origin main
```

---

### Step 3: Deploy React Host Shell
Finally, import the `streaming-hub` repository one last time to deploy the main Host Portal:

1. **Vercel Project Name**: `streaming-hub-host`
2. **Framework Preset**: Create React App / Webpack
3. **Build Command**: `npx nx build host`
4. **Output Directory**: `dist/apps/host`
5. **Environment Variable**:
   * Key: `NODE_ENV`
   * Value: `production`
6. Click **Deploy**.

*Navigating to your Host Portal URL (`https://streaming-hub-host.vercel.app`) loads the unified micro-frontend portal with Vue, Angular, and Next.js seamlessly nested under one single origin!*
