// Injects iPhone/touch optimizations into every HTML page of the pack.
// Idempotent (skips files already patched). Run: node prepare-mobile.js
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

const MOBILE_CSS = `<style id="iphone-optimizations">
/* iPhone / touch optimizations */
html { -webkit-text-size-adjust: 100%; }
body { -webkit-tap-highlight-color: rgba(88,166,255,.25); }
button, .btn, .opt, .pal-btn, input, select, textarea { min-height: 44px; font-size: 16px; }
.q-text, .screen p { overflow-wrap: break-word; }
@media (max-width: 640px) {
  .container, .wrap { padding-left: 12px; padding-right: 12px; }
  .screen { padding: 24px 16px; }
  .exam-facts { flex-wrap: wrap; }
  .card { padding: 16px; }
}
</style>`;

const APPLE_META = `<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="theme-color" content="#0d1117">
<link rel="manifest" href="manifest.json">
<link rel="apple-touch-icon" href="icon.png">`;

function walk(dir) {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(p));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

let patched = 0, skipped = 0;
for (const f of walk(ROOT)) {
  let html = fs.readFileSync(f, 'utf8');
  if (html.includes('id="iphone-optimizations"')) { skipped++; continue; }
  if (!html.includes('</head>')) { console.error('no </head>:', f); continue; }
  html = html.replace('</head>', MOBILE_CSS + '\n</head>');
  // entry page only: apple meta + manifest
  if (path.basename(f) === 'index.html') {
    html = html.replace('</head>', APPLE_META + '\n</head>');
  }
  fs.writeFileSync(f, html);
  patched++;
}
console.log(`mobile CSS injected: ${patched}, already patched: ${skipped}`);
