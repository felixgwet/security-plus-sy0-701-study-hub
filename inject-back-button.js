// Injects a "Back to Library" floating button into every exam/quiz page:
// it appears automatically when a result screen shows (exam finished).
// Idempotent (marker: window.__backBtnInit / id="back-lib-script"). Safe to re-run.
// Run AFTER generators, BEFORE prepare-mobile.js.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'exam-simulator');

const SNIPPET = relLib => `<script id="back-lib-script">
(function () {
  if (window.__backBtnInit) return; window.__backBtnInit = true;
  function lib() { return ${JSON.stringify(relLib)}; }
  function resultVisible() {
    var rs = document.getElementById('result-screen');
    if (rs && !rs.classList.contains('hidden') && rs.offsetParent !== null) return true;
    var big = document.querySelector('.score-big');
    if (big) {
      var el = big;
      while (el && el !== document.body) {
        if (el.classList && el.classList.contains('hidden')) return false;
        el = el.parentElement;
      }
      return big.offsetParent !== null;
    }
    return false;
  }
  function ensure() {
    if (!resultVisible() || document.getElementById('back-lib-btn')) return;
    var a = document.createElement('a');
    a.id = 'back-lib-btn';
    a.href = lib();
    a.textContent = '\\u2190 Back to Library';
    a.setAttribute('style', 'position:fixed;left:18px;bottom:18px;z-index:9999;' +
      'padding:11px 20px;border-radius:999px;font:600 14px/1 "Segoe UI",system-ui,sans-serif;' +
      'text-decoration:none;color:#fff;background:linear-gradient(135deg,#f0883e,#e36414);' +
      'box-shadow:0 4px 18px rgba(240,136,62,.45);border:1px solid rgba(255,255,255,.25);');
    document.body.appendChild(a);
  }
  setInterval(ensure, 400);
  if (document.readyState !== 'loading') ensure();
  else document.addEventListener('DOMContentLoaded', ensure);
})();
</script>`;

let patched = 0, skipped = 0;
function walk(dir, depth) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) { if (f !== 'planner-app') walk(p, depth + 1); continue; }
    if (!f.endsWith('.html')) continue;
    const html = fs.readFileSync(p, 'utf8');
    if (!/id="result-screen"|class="[^"]*score-big|id='result-screen'/.test(html)) { skipped++; continue; }
    if (html.includes('id="back-lib-script"')) { skipped++; continue; }
    const relLib = '../'.repeat(depth) + 'library.html';
    const out = html.replace(/<\/body>/i, SNIPPET(relLib) + '\n</body>');
    if (out === html) { console.error('no </body> in', p); continue; }
    fs.writeFileSync(p, out);
    patched++;
  }
}
walk(ROOT, 1);
console.log(`back-button injected: ${patched} pages, ${skipped} skipped`);
