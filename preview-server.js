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
 *   /_next/*             → apps/watchlist/out/_next       (Next.js Chunks & Assets)
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8085;
const ROOT = path.resolve(__dirname);

const http = require('http');

// 1. Grafana telemetry reverse proxy — mount BEFORE Host catch-all
app.use('/grafana', (req, res) => {
  const options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/grafana' + req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: '127.0.0.1:3000'
    }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', () => {
    res.status(502).send('Grafana service offline or initializing...');
  });

  req.pipe(proxyReq, { end: true });
});

// 2. Sub-MFE static files & Next.js chunk proxies
app.use('/browse',    express.static(path.join(ROOT, 'dist/apps/browse')));
app.use('/settings',  express.static(path.join(ROOT, 'dist/apps/settings/browser')));
app.use('/watchlist', express.static(path.join(ROOT, 'apps/watchlist/out')));
app.use('/_next',     express.static(path.join(ROOT, 'apps/watchlist/out/_next')));

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
