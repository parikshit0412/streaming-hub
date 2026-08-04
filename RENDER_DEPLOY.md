# 🚀 Deploying StreamHub to Render using Docker

This guide provides step-by-step instructions to host the entire **StreamHub** micro-frontend monorepo on **Render** using a single Docker Web Service.

---

## 📋 Prerequisites

1. Your `streaming-hub` repository pushed to **GitHub**.
2. A free account on **[Render.com](https://render.com/)**.

---

## 🛠️ Step-by-Step Deployment Walkthrough

### Step 1: Push Code to GitHub
Ensure all recent changes and the root `Dockerfile` are pushed to your repository:
```bash
git add .
git commit -m "feat: add root Dockerfile and Render deployment setup"
git push origin main
```

---

### Step 2: Create a New Web Service on Render
1. Log in to your **[Render Dashboard](https://dashboard.render.com/)**.
2. Click **New +** at the top right and select **Web Service**.
3. Under **Connect a repository**, select your `streaming-hub` GitHub repository (if not connected yet, grant Render access to your repository).

---

### Step 3: Configure the Web Service Settings
Fill in the following fields on the service creation page:

| Field | Value |
| :--- | :--- |
| **Name** | `streamhub-portal` *(or any name you choose)* |
| **Region** | Select the region closest to you |
| **Branch** | `main` |
| **Root Directory** | Leave blank / `./` |
| **Runtime** | **Docker** |
| **Dockerfile Path** | `./Dockerfile` |
| **Instance Type** | **Free** (or Starter/Standard) |

---

### Step 4: Environment Variables (Optional)
Render automatically sets `$PORT` (default `10000`) and passes it into `preview-server.js`.
No extra environment variables are required for basic deployment.

---

### Step 5: Deploy & Access Your Application
1. Click **Create Web Service**.
2. Render will automatically pull your repository, execute the multi-stage `Dockerfile`, build all Nx micro-frontends (React Host, Vue Browse, Angular Settings, Next Watchlist), and launch the container.
3. Once the build status turns **Live**, click the URL provided by Render (e.g. `https://streamhub-portal.onrender.com`).

---

## ⚡ How It Works Under the Hood
- Render runs the multi-stage build:
  1. `builder`: Installs packages and runs `npx nx run-many --target=build` to compile all 4 sub-apps.
  2. `runner`: Serves the unified SPA routes using Node.js (`preview-server.js`) on `$PORT`.
- **All sub-apps resolve seamlessly under a single domain** (`/`, `/browse`, `/settings`, `/watchlist`).
