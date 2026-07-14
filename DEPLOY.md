# 🚀 StreamHub: Deployment Guide

This guide explains how to deploy the complete **StreamHub** micro-frontend monorepo to production. Since the monorepo consists of isolated apps served under a single shell context, you can deploy it in two ways:

1.  **Server-Based Deployment (Docker & Nginx Proxy):** Standard for cloud VMs (AWS EC2, DigitalOcean, Azure).
2.  **Serverless/Static Hosting (Vercel):** Standard for free, high-performance static CDNs.

---

## Option 1: Docker-Based Server Deployment (AWS EC2 / DigitalOcean Droplet)
This is the recommended approach for hosting the entire stack (including the Grafana metrics container) behind a single Nginx reverse proxy on a virtual server.

### Step 1: Set Up your Cloud Server
1.  Launch a virtual machine (Ubuntu 22.04 LTS, minimum 2GB RAM is recommended to build the monorepo).
2.  SSH into your VM:
    ```sh
    ssh root@your-server-ip
    ```
3.  Install **Docker** and **Docker Compose V2**:
    ```sh
    sudo apt update && sudo apt upgrade -y
    sudo apt install -y docker.io docker-compose-v2
    ```

### Step 2: Deploy and Start Services
1.  Clone the repository on the server:
    ```sh
    git clone https://github.com/parikshit0412/streaming-hub.git
    cd streaming-hub
    ```
2.  Boot the services:
    ```sh
    docker compose up -d --build
    ```
3.  Your portal is now live:
    *   **Main Streaming Portal:** `http://your-server-ip:8080` (or update `docker-compose.yml` ports mapping to `"80:80"` to serve on default port 80).
    *   **Grafana Dashboard:** `http://your-server-ip:3000`

---

## Option 2: Serverless / Static Deployment (Vercel)
Vercel allows you to host all micro-frontends completely for free. Since the apps are static exports in production, we can deploy them as **four separate projects** from the same monorepo, using Vercel's Edge CDN to route paths.

### Step 1: Deploy the Sub-Microfrontends (Vue, Angular, Next.js)
On your [Vercel Dashboard](https://vercel.com/), import the `streaming-hub` repository three times to create the sub-applications with these configurations:

#### 1. Vue Browse App (`streaming-hub-browse`)
*   **Framework Preset:** Vite
*   **Root Directory:** *Leave Default (Root)*
*   **Build Command:** `npx nx build browse`
*   **Output Directory:** `dist/apps/browse`

#### 2. Angular Settings App (`streaming-hub-settings`)
*   **Framework Preset:** Angular
*   **Root Directory:** *Leave Default (Root)*
*   **Build Command:** `npx nx build settings`
*   **Output Directory:** `dist/apps/settings`

#### 3. Next.js Watchlist App (`streaming-hub-watchlist`)
*   **Framework Preset:** Next.js
*   **Root Directory:** *Leave Default (Root)*
*   **Build Command:** `npx nx build watchlist`
*   **Output Directory:** `dist/apps/watchlist/out`

*Deploy these three projects first and note down their production URLs (e.g., `https://streaming-hub-browse.vercel.app`).*

---

### Step 2: Configure the React Host Shell (`vercel.json`)
The React Host app is deployed as the main shell. It uses `apps/host/vercel.json` to act as the serverless Nginx proxy, routing all sub-paths (`/browse`, `/settings`, `/watchlist`) to the deployment URLs you noted in Step 1.

1.  Open the [vercel.json](file:///d:/ReactPlayProjects/project_one/streaming-hub/apps/host/vercel.json) file:
2.  Update the destinations with your actual Vercel URLs:
    ```json
    {
      "rewrites": [
        { "source": "/browse/:path*", "destination": "https://your-vue-mfe-url.vercel.app/:path*" },
        { "source": "/settings/:path*", "destination": "https://your-angular-mfe-url.vercel.app/:path*" },
        { "source": "/watchlist/:path*", "destination": "https://your-watchlist-mfe-url.vercel.app/:path*" }
      ]
    }
    ```
3.  Commit and push the updated config to GitHub:
    ```sh
    git add apps/host/vercel.json
    git commit -m "chore: configure Vercel production routing destinations"
    git push
    ```

---

### Step 3: Deploy the React Host App
Finally, deploy the shell portal to Vercel:

1.  Import the `streaming-hub` repository in Vercel.
2.  Configure the build:
    *   **Framework Preset:** Create React App / Webpack
    *   **Root Directory:** *Leave Default (Root)*
    *   **Build Command:** `npx nx build host`
    *   **Output Directory:** `dist/apps/host`
3.  Add an Environment Variable:
    *   **Key:** `NODE_ENV`
    *   **Value:** `production`
4.  Click **Deploy**.

*Visiting your main Host Shell URL will load the unified micro-frontend portal with all sub-apps nested under the same domain context!*
