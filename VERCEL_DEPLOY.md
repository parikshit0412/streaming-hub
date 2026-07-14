# 🌐 Vercel Deployment Walkthrough: Click-by-Click Guide

This document provides a click-by-click walkthrough on the Vercel dashboard to deploy the **StreamHub** monorepo. Because Vercel natively supports **Nx Monorepos**, we deploy the sub-applications first and then bind them to the React Host Shell.

---

### Step 1: Log in and Import the Repository
1. Go to **[https://vercel.com/](https://vercel.com/)** and log in using your GitHub account.
2. On your Vercel Dashboard, click the **Add New** button (top right) and select **Project**.
3. Under **Import Git Repository**, find your `streaming-hub` repository and click **Import**.

---

### Step 2: Deploy the Vue Browse App (`streaming-hub-browse`)
This will compile and host the Vue Browse MFE custom-element script.

1. **Project Name:** Set this to `streaming-hub-browse`.
2. **Framework Preset:** Select **Vite** (Vercel will auto-detect it, but confirm it is selected).
3. **Root Directory:** Keep this as `./` (do not change it).
4. Click on **Build and Development Settings** to expand it:
   * **Build Command:** Turn the toggle **ON** and type: `npx nx build browse`
   * **Output Directory:** Turn the toggle **ON** and type: `dist/apps/browse`
5. Click **Deploy**.
6. When deployment finishes, copy the URL Vercel gives you (e.g., `https://streaming-hub-browse-yourusername.vercel.app`).

---

### Step 3: Deploy the Angular Settings App (`streaming-hub-settings`)
This compiles the Angular settings dashboard.

1. Go back to your Vercel Dashboard, click **Add New** ➔ **Project**, and import `streaming-hub` again.
2. **Project Name:** Set this to `streaming-hub-settings`.
3. **Framework Preset:** Select **Angular**.
4. Click on **Build and Development Settings**:
   * **Build Command:** Turn the toggle **ON** and type: `npx nx build settings`
   * **Output Directory:** Turn the toggle **ON** and type: `dist/apps/settings`
5. Click **Deploy**.
6. Copy the URL generated for this app (e.g., `https://streaming-hub-settings-yourusername.vercel.app`).

---

### Step 4: Deploy the Next.js Watchlist App (`streaming-hub-watchlist`)
This compiles the Next.js watchlist queue application.

1. Click **Add New** ➔ **Project** and import `streaming-hub` again.
2. **Project Name:** Set this to `streaming-hub-watchlist`.
3. **Framework Preset:** Select **Next.js**.
4. Click on **Build and Development Settings**:
   * **Build Command:** Turn the toggle **ON** and type: `npx nx build watchlist`
   * **Output Directory:** Turn the toggle **ON** and type: `dist/apps/watchlist/out`
5. Click **Deploy**.
6. Copy the URL generated for this app (e.g., `https://streaming-hub-watchlist-yourusername.vercel.app`).

---

### Step 5: Update the Routing in `vercel.json`
Now we link the micro-frontends together so they function on a single domain.

1. Open [apps/host/vercel.json](file:///d:/ReactPlayProjects/project_one/streaming-hub/apps/host/vercel.json) in your code editor.
2. Paste the three URLs you copied from **Steps 2, 3, and 4** into the `destination` fields:
   ```json
   {
     "rewrites": [
       { "source": "/browse/:path*", "destination": "https://streaming-hub-browse-yourusername.vercel.app/:path*" },
       { "source": "/settings/:path*", "destination": "https://streaming-hub-settings-yourusername.vercel.app/:path*" },
       { "source": "/watchlist/:path*", "destination": "https://streaming-hub-watchlist-yourusername.vercel.app/:path*" }
     ]
   }
   ```
3. Commit and push the changes to GitHub:
   ```sh
   git add apps/host/vercel.json
   git commit -m "chore: update Vercel MFE routing URLs"
   git push
   ```

---

### Step 6: Deploy the React Host Portal (`streaming-hub-host`)
This launches the shell container which mounts all sub-apps.

1. Go to Vercel, click **Add New** ➔ **Project**, and import `streaming-hub` one last time.
2. **Project Name:** Set this to `streaming-hub-host` (or leave it as `streaming-hub`).
3. **Framework Preset:** Select **Other** or **Create React App**.
4. Click on **Build and Development Settings**:
   * **Build Command:** Turn the toggle **ON** and type: `npx nx build host`
   * **Output Directory:** Turn the toggle **ON** and type: `dist/apps/host`
5. Click on **Environment Variables** (just below the build settings):
   * **Key:** `NODE_ENV`
   * **Value:** `production`
   * Click **Add**.
6. Click **Deploy**.

**All Done!** Open the URL generated for the Host project (`streaming-hub-host`). The portal will run with all sub-apps resolving under the unified domain routing.
