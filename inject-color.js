// Injects a colorful gradient theme override into every pack HTML page.
// Appends a single <style id="colorful-theme"> before </head>; idempotent.
// Run AFTER generators, BEFORE prepare-mobile.js.
const fs = require('fs');
const path = require('path');

const STYLE = `<style id="colorful-theme">
/* ===== colorful theme override (inject-color.js) ===== */
body { background-image:
  radial-gradient(900px 420px at 85% -8%, rgba(240,136,62,.10), transparent 60%),
  radial-gradient(700px 380px at -5% 108%, rgba(88,166,255,.08), transparent 60%),
  radial-gradient(500px 300px at 50% 50%, rgba(227,75,169,.04), transparent 70%);
  background-attachment: fixed; }
h1 { background: linear-gradient(90deg, #f0883e 0%, #e34ba9 55%, #58a6ff 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent; }
.badge { background: linear-gradient(90deg, rgba(240,136,62,.20), rgba(88,166,255,.14)) !important;
  border: 1px solid rgba(240,136,62,.45) !important; color: #ffd9b3 !important; }
.btn { background: linear-gradient(135deg, #f0883e, #e36414) !important;
  border: none !important; box-shadow: 0 3px 14px rgba(240,136,62,.35); }
.btn:hover { filter: brightness(1.12); box-shadow: 0 5px 20px rgba(240,136,62,.55); }
.btn.ghost { background: rgba(240,136,62,.10) !important; border: 1px solid rgba(240,136,62,.5) !important;
  box-shadow: none; color: #ffb26b !important; }
a { color: #7fb0ff; }
.fact b { background: linear-gradient(90deg, #f0883e, #e34ba9); -webkit-background-clip: text;
  background-clip: text; color: transparent; }
.score-big { background: linear-gradient(90deg, #f0883e, #e34ba9, #58a6ff);
  -webkit-background-clip: text; background-clip: text; color: transparent !important; }
.verdict { text-shadow: 0 0 22px rgba(240,136,62,.35); }
.tile, .q-card, .card { border-color: #303a4a; transition: border-color .15s, transform .15s; }
.tile:hover, .q-card:hover { border-color: #f0883e !important; }
.option.selected, .opt.selected, .pal-btn.answered { border-color: #f0883e !important;
  background: linear-gradient(135deg, rgba(240,136,62,.22), rgba(227,75,169,.14)) !important; }
.pal-btn.flagged { border-color: #e34ba9 !important; }
::selection { background: rgba(240,136,62,.4); }
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: #0d1117; }
::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #f0883e, #e34ba9); border-radius: 5px; }
table tbody tr:hover { background: rgba(240,136,62,.06) !important; }
</style>`;

function patchTree(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) { if (!/^(planner-app|\.git)$/.test(f)) patchTree(p); continue; }
    if (!f.endsWith('.html')) continue;
    const html = fs.readFileSync(p, 'utf8');
    if (html.includes('id="colorful-theme"')) continue;
    if (html.includes('id="iphone-optimizations"') && !html.includes('</head>')) continue;
    const out = html.replace(/<\/head>/i, STYLE + '\n</head>');
    if (out === html) { console.error('no </head> in', p); continue; }
    fs.writeFileSync(p, out);
    patched++;
  }
}
let patched = 0;
patchTree(__dirname);
console.log(`colorful theme injected: ${patched} pages`);
