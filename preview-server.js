/**
 * Local production preview server for StreamHub micro-frontend monorepo.
 *
 * Mimics Vercel's edge rewrites locally by mounting each sub-application's
 * build output at the correct route prefix:
 *
 *   /                    → dist/apps/host                (React Host Shell)
 *   /browse/*            → dist/apps/browse              (Vue Browse MFE)
 *   /settings/*          → dist/apps/settings/browser    (Angular Settings MFE)
 *   /watchlist/*         → apps/watchlist/out             (Next.js Watchlist MFE)
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8085;

const ROOT = path.resolve(__dirname);

// 1. Sub-MFE static files — mount sub-paths BEFORE the Host catch-all
app.use('/browse',    express.static(path.join(ROOT, 'dist/apps/browse')));
app.use('/settings',  express.static(path.join(ROOT, 'dist/apps/settings/browser')));
app.use('/watchlist', express.static(path.join(ROOT, 'apps/watchlist/out')));

// 2. Host Shell static files
app.use(express.static(path.join(ROOT, 'dist/apps/host')));

// 3. SPA / index.html fallback for each sub-app
app.use((req, res) => {
  if (req.path.startsWith('/browse')) {
    return res.sendFile(path.join(ROOT, 'dist/apps/browse/index.html'));
  }
  if (req.path.startsWith('/settings')) {
    return res.sendFile(path.join(ROOT, 'dist/apps/settings/browser/index.html'));
  }
  if (req.path.startsWith('/watchlist')) {
    return res.sendFile(path.join(ROOT, 'apps/watchlist/out/index.html'));
  }
  // Everything else → Host Shell SPA
  res.sendFile(path.join(ROOT, 'dist/apps/host/index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  🚀 StreamHub Production Preview`);
  console.log(`  ────────────────────────────────`);
  console.log(`  Host Shell:       http://localhost:${PORT}/`);
  console.log(`  Browse (Vue):     http://localhost:${PORT}/browse/`);
  console.log(`  Settings (Ng):    http://localhost:${PORT}/settings/`);
  console.log(`  Watchlist (Next): http://localhost:${PORT}/watchlist/`);
  console.log(`  ────────────────────────────────\n`);
});
