// Generates interactive study tools from the existing pack:
//   1. Per-section interactive notes pages  (exam-simulator/<slug>-study-notes.html)
//      - rendered from each <slug>-study-notes.md: collapsible topic cards,
//        live search, per-topic "mark reviewed" with persistent progress
//   2. Per-section flashcard decks          (exam-simulator/flashcards-<slug>.html)
//      - cards auto-extracted from that section's simulator, quiz, feedback
//        & final exam question banks (mcq + multi-answer only, deduped)
//   3. Combined deck + deck index           (flashcards-all.html, flashcards.html)
//      - flip cards, Know it / Still learning tracking (persisted), shuffle,
//        weak-only review mode
// Run: node build-study-tools.js   (idempotent — safe to re-run)
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'exam-simulator');
const files = fs.readdirSync(DIR);

// ---------- shared helpers ----------
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function titleize(slug) {
  const small = new Set(['and', 'of', 'the', 'for', 'in', 'a', 'an', 'to', 'it']);
  return slug.split('-').map((w, i) => (i > 0 && small.has(w)) ? w : w[0].toUpperCase() + w.slice(1)).join(' ');
}
function hashId(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

// Canonical section order from the numbered simulator pages
const simRe = /^SY0-701-exam-simulator-(\d+)-(.+)\.html$/;
const sections = [];
for (const f of files) {
  const m = f.match(simRe);
  if (m) sections.push({ num: parseInt(m[1], 10), slug: m[2] });
}
sections.sort((a, b) => a.num - b.num);

// Extra topics that only have quiz/notes (e.g. security-fundamentals)
const extraSlugs = [...new Set(files
  .filter(f => /^[a-z0-9-]+-study-notes\.md$/.test(f))
  .map(f => f.replace(/-study-notes\.md$/, '')))]
  .filter(slug => !sections.some(s => s.slug === slug));

const allTopics = [
  ...sections.map(s => ({ key: s.slug, num: s.num, label: `Section ${s.num} · ${titleize(s.slug)}` })),
  ...extraSlugs.map(slug => ({ key: slug, num: null, label: titleize(slug) })),
];

// ---------- question extraction (for flashcards) ----------
// Scan a JS array literal with string/comment awareness and eval it.
function extractArray(src, varNames) {
  for (const name of varNames) {
    const m = src.match(new RegExp(`const\\s+${name}\\s*=\\s*\\[`));
    if (!m) continue;
    let i = src.indexOf('[', m.index);
    let depth = 0, state = 'normal', quote = '', escNext = false;
    for (; i < src.length; i++) {
      const c = src[i], n = src[i + 1];
      if (state === 'line') { if (c === '\n') state = 'normal'; continue; }
      if (state === 'block') { if (c === '*' && n === '/') { state = 'normal'; i++; } continue; }
      if (state === 'string') {
        if (escNext) { escNext = false; continue; }
        if (c === '\\') { escNext = true; continue; }
        if (c === quote) state = 'normal';
        continue;
      }
      if (c === '/' && n === '/') { state = 'line'; i++; continue; }
      if (c === '/' && n === '*') { state = 'block'; i++; continue; }
      if (c === "'" || c === '"' || c === '`') { state = 'string'; quote = c; continue; }
      if (c === '[') depth++;
      if (c === ']') { depth--; if (depth === 0) return eval('(' + src.slice(src.indexOf('[', m.index), i + 1) + ')'); }
    }
  }
  return null;
}

function cardsFromPages(paths) {
  const seen = new Set(), cards = [];
  for (const p of paths) {
    if (!p || !fs.existsSync(p)) continue;
    const arr = extractArray(fs.readFileSync(p, 'utf8'), ['EXAM', 'QUESTIONS']) || [];
    for (const q of arr) {
      if (!q || (q.type !== 'mcq' && q.type !== 'multi' && q.type !== undefined)) continue;
      if (!q.q || !Array.isArray(q.options) || q.answer === undefined) continue;
      const norm = q.q.replace(/\s+/g, ' ').trim().toLowerCase();
      if (seen.has(norm)) continue;
      seen.add(norm);
      const idxs = Array.isArray(q.answer) ? q.answer : [q.answer];
      const answers = idxs.map(i => q.options[i]).filter(Boolean);
      cards.push({
        id: hashId(norm),
        q: q.q.trim(),
        a: answers.join(';  '),
        why: (q.why || '').trim(),
        multi: q.type === 'multi',
      });
    }
  }
  return cards;
}

function nn(num) { return num === 0 ? '00' : String(num); }

// ---------- markdown → HTML (notes renderer) ----------
function inline(s) {
  return esc(s)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}
function renderMarkdown(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0, firstH1 = true;
  const topQuote = [];
  // Banner = any blockquote lines appearing before the first "## " topic
  // (the md files put the objectives quote after the "# " title).
  {
    let firstTopic = lines.findIndex(l => l.startsWith('## '));
    if (firstTopic === -1) firstTopic = lines.length;
    for (let j = 0; j < firstTopic; j++) {
      const l = lines[j];
      if (l.startsWith('>')) topQuote.push(inline(l.replace(/^>\s?/, '')));
    }
    if (topQuote.length) {
      lines.splice(0, firstTopic); // drop consumed header/quote lines
    }
  }
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('# ')) {
      if (firstH1) { out.push(`<p class="doc-title">${inline(line.slice(2))}</p>`); firstH1 = false; }
      else out.push(`<h2>${inline(line.slice(2))}</h2>`);
      i++; continue;
    }
    if (line.startsWith('## ')) {
      // close previous card if open
      if (out.cardOpen) { out.push('</div></details>'); out.cardOpen = false; }
      out.push(`<details class="topic" open><summary><span class="t-name">${inline(line.slice(3))}</span><span class="t-state"></span><button class="t-review" onclick="toggleReview(event,this)" title="Mark topic as reviewed">&nbsp;</button></summary><div class="topic-body">`);
      out.cardOpen = true;
      i++; continue;
    }
    if (line.startsWith('### ')) { out.push(`<h3>${inline(line.slice(4))}</h3>`); i++; continue; }
    if (/^\s*---+\s*$/.test(line)) { i++; continue; }

    // table
    if (line.trim().startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) { rows.push(lines[i].trim()); i++; }
      const cells = r => r.replace(/^\||\|$/g, '').split('|').map(c => inline(c.trim()));
      let html = '<div class="tblwrap"><table>';
      let r = 0;
      if (rows.length && /^[\s|:-]+$/.test(rows[1] || '')) {
        html += '<thead><tr>' + cells(rows[0]).map(c => `<th>${c}</th>`).join('') + '</tr></thead>';
        r = 2;
      }
      html += '<tbody>';
      for (; r < rows.length; r++) html += '<tr>' + cells(rows[r]).map(c => `<td>${c}</td>`).join('') + '</tr>';
      html += '</tbody></table></div>';
      out.push(html);
      continue;
    }
    // list
    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
        const m = lines[i].match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
        items.push({ indent: m[1].length, ol: /\d/.test(m[2]), text: m[3] });
        i++;
      }
      let html = '', curOl = null, depth = 0;
      for (const it of items) {
        const lvl = it.indent >= 2 ? 1 : 0;
        while (depth < lvl) { html += curOl === false ? '<ul>' : '<ul>'; depth++; }
        while (depth > lvl) { html += '</ul>'; depth--; }
        html += `<li>${inline(it.text)}</li>`;
      }
      while (depth > 0) { html += '</ul>'; depth--; }
      out.push(`<ul class="mdlist">${html}</ul>`);
      continue;
    }
    if (line.trim() === '') { i++; continue; }
    // paragraph (gather until blank)
    const para = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== '' && !/^#{1,3}\s/.test(lines[i]) && !/^\s*([-*]|\d+\.)\s+/.test(lines[i]) && !lines[i].trim().startsWith('|') && !/^\s*---+\s*$/.test(lines[i])) {
      para.push(lines[i]); i++;
    }
    out.push(`<p>${inline(para.join(' '))}</p>`);
  }
  if (out.cardOpen) out.push('</div></details>');
  return { body: out.join('\n'), banner: topQuote.join('<br>') };
}

// ---------- page templates ----------
function pageShell(title, desc, body, extraHead = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<style>
  :root {
    --bg: #0d1117; --panel: #161b22; --border: #30363d; --text: #e6edf3;
    --muted: #8b949e; --accent: #f0883e; --accent-dim: rgba(240,136,62,.14);
    --green: #3fb950; --red: #f85149; --gold: #d29922; --blue: #58a6ff;
    color-scheme: dark;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Segoe UI", system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
  .container { width: 100%; max-width: 880px; margin: 0 auto; padding: 22px 16px 90px; }
  a { color: var(--blue); text-decoration: none; } a:hover { text-decoration: underline; }
  .topbar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; font-size: 13px; color: var(--muted); }
  .topbar .grow { flex: 1; }
  .badge { display: inline-block; background: var(--accent-dim); color: var(--accent); border: 1px solid rgba(240,136,62,.4); border-radius: 999px; padding: 4px 14px; font-size: 12px; }
  h1 { font-size: 24px; margin: 10px 0 6px; }
  .sub { color: var(--muted); font-size: 14px; line-height: 1.6; margin-bottom: 18px; }
  .btn { display: inline-block; background: var(--accent); color: #0d1117; font-weight: 600; font-size: 14px; border: none; border-radius: 8px; padding: 10px 22px; cursor: pointer; transition: filter .15s; }
  .btn:hover { filter: brightness(1.12); }
  .btn.ghost { background: transparent; color: var(--text); border: 1px solid var(--border); }
  ${extraHead}
</style>
</head>
<body>
<div class="container">
${body}
</div>
</body>
</html>`;
}

function notesPage(topic, md, prev, next) {
  const { body, banner } = renderMarkdown(md);
  const topics = (md.match(/^## /gm) || []).length;
  const nav = (p, label) => p
    ? `<a class="btn ghost" href="${encodeURIComponent(p.key)}-study-notes.html">${label}: ${esc(p.label)}</a>` : '';
  const bodyHtml = `
  <div class="topbar">
    <a href="../library.html">&larr; Full library</a>
    <span class="grow"></span>
    <span id="prog" class="badge"></span>
  </div>
  <h1>${esc(topic.label)} &mdash; Interactive Notes</h1>
  <p class="sub">Tap a topic to expand it. Search filters topics instantly. Mark topics as reviewed to track your reading progress &mdash; it is saved on this device.</p>
  ${banner ? `<div class="banner">${banner}</div>` : ''}
  <input id="search" type="search" placeholder="Search these notes&hellip;" autocomplete="off">
  <div id="cards">${body}</div>
  <p id="noresults" style="display:none;color:var(--muted);padding:24px 0;text-align:center;">No topics match your search.</p>
  <div class="pagenav">${nav(prev, '&larr; Prev')} ${nav(next, 'Next &rarr;')}</div>
  <script>
    var SLUG = ${JSON.stringify(topic.key)};
    var TOTAL = ${topics};
    var KEY = 'secplus_review_v1';
    function loadState(){ try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch(e){ return {}; } }
    function myTopics(){ var s = loadState(); return s[SLUG] || []; }
    function saveTopics(arr){ var s = loadState(); s[SLUG] = arr; localStorage.setItem(KEY, JSON.stringify(s)); }
    function paint(){
      var done = myTopics();
      document.querySelectorAll('details.topic').forEach(function(d, i){
        var btn = d.querySelector('.t-review');
        var isDone = done.indexOf(i) !== -1;
        btn.textContent = isDone ? '\\u2713 Reviewed' : 'Mark reviewed';
        btn.classList.toggle('done', isDone);
        d.classList.toggle('reviewed', isDone);
      });
      var el = document.getElementById('prog');
      el.textContent = done.length + ' / ' + TOTAL + ' topics reviewed';
      el.style.borderColor = done.length === TOTAL ? 'var(--green)' : '';
      el.style.color = done.length === TOTAL ? 'var(--green)' : '';
    }
    function toggleReview(ev, btn){
      ev.preventDefault(); ev.stopPropagation();
      var card = btn.closest('details.topic');
      var i = Array.prototype.indexOf.call(document.querySelectorAll('details.topic'), card);
      var done = myTopics();
      var at = done.indexOf(i);
      if (at === -1) done.push(i); else done.splice(at, 1);
      saveTopics(done); paint();
    }
    document.getElementById('search').addEventListener('input', function(){
      var v = this.value.trim().toLowerCase(); var shown = 0;
      document.querySelectorAll('details.topic').forEach(function(d){
        var hit = !v || d.textContent.toLowerCase().indexOf(v) !== -1;
        d.style.display = hit ? '' : 'none';
        if (hit) shown++;
      });
      document.getElementById('noresults').style.display = shown ? 'none' : '';
    });
    paint();
  <\/script>`;
  const style = `
  .banner { background: var(--accent-dim); border: 1px solid rgba(240,136,62,.35); border-radius: 10px; padding: 14px 16px; font-size: 13.5px; line-height: 1.65; margin-bottom: 16px; }
  #search { width: 100%; padding: 12px 16px; font-size: 16px; background: var(--panel); border: 1px solid var(--border); border-radius: 10px; color: var(--text); margin-bottom: 16px; }
  #search:focus { outline: none; border-color: var(--accent); }
  details.topic { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; margin-bottom: 12px; overflow: hidden; }
  details.topic.reviewed { border-color: rgba(63,185,80,.5); }
  details.topic summary { display: flex; align-items: center; gap: 10px; padding: 14px 16px; cursor: pointer; font-weight: 600; font-size: 15px; list-style: none; user-select: none; }
  details.topic summary::-webkit-details-marker { display: none; }
  details.topic summary::before { content: '\\25B8'; color: var(--accent); transition: transform .15s; flex: 0 0 auto; }
  details.topic[open] summary::before { transform: rotate(90deg); }
  .t-name { flex: 1; }
  .t-review { flex: 0 0 auto; background: transparent; border: 1px solid var(--border); color: var(--muted); border-radius: 999px; padding: 4px 12px; font-size: 12px; cursor: pointer; min-height: 30px; }
  .t-review.done { border-color: var(--green); color: var(--green); }
  .topic-body { padding: 2px 18px 18px 34px; font-size: 14.5px; line-height: 1.7; color: #c9d1d9; }
  .topic-body p { margin: 8px 0; }
  .topic-body h2 { font-size: 17px; margin: 14px 0 6px; color: var(--text); }
  .topic-body h3 { font-size: 15px; margin: 14px 0 4px; color: var(--gold); }
  .topic-body strong { color: var(--text); }
  .topic-body code { background: #2d333b; padding: 1px 6px; border-radius: 4px; font-size: 13px; }
  .topic-body .mdlist { margin: 8px 0 8px 18px; }
  .topic-body .mdlist .mdlist, .topic-body .mdlist ul { margin-left: 16px; }
  .topic-body li { margin: 4px 0; }
  .tblwrap { overflow-x: auto; margin: 10px 0; }
  .tblwrap table { border-collapse: collapse; width: 100%; font-size: 13.5px; }
  .tblwrap th { text-align: left; color: var(--gold); padding: 8px 10px; border-bottom: 1px solid var(--border); white-space: nowrap; }
  .tblwrap td { padding: 8px 10px; border-bottom: 1px solid #21262e; vertical-align: top; }
  .pagenav { display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin-top: 28px; }
  .pagenav .btn { font-size: 13px; padding: 10px 14px; margin: 0; max-width: 48%; }
  @media (max-width: 600px) { .topic-body { padding-left: 18px; } details.topic summary { padding: 14px 12px; font-size: 14px; } }`;
  return pageShell(`${topic.label} — Interactive Notes`, '', bodyHtml, style);
}

function flashcardsPage(deckLabel, decks, backHref, backLabel) {
  // decks: [{label, cards:[{id,q,a,why,multi}]}]
  const totalCards = decks.reduce((n, d) => n + d.cards.length, 0);
  const bodyHtml = `
  <div class="topbar">
    <a href="${backHref}">&larr; ${backLabel}</a>
    <span class="grow"></span>
    <select id="deckSel" style="${decks.length > 1 ? '' : 'display:none;'}background:var(--panel);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:8px 10px;font-size:14px;">
      ${decks.map((d, i) => `<option value="${i}">${esc(d.label)} (${d.cards.length} cards)</option>`).join('')}
    </select>
  </div>
  <h1>${esc(deckLabel)}</h1>
  <p class="sub">Tap the card to flip it, then grade yourself honestly &mdash; the deck remembers what you know and will prioritize your weak cards.</p>
  <div class="stats">
    <div class="stat"><b id="stTotal">0</b><span>cards</span></div>
    <div class="stat"><b id="stKnown" style="color:var(--green)">0</b><span>known</span></div>
    <div class="stat"><b id="stLearn" style="color:var(--gold)">0</b><span>learning</span></div>
    <div class="stat"><b id="stPos">0/0</b><span>position</span></div>
  </div>
  <div class="controls">
    <label class="chk"><input type="checkbox" id="shuffle"> Shuffle</label>
    <label class="chk"><input type="checkbox" id="weakOnly"> Weak cards only</label>
    <button class="btn ghost" id="restart" style="margin:0;padding:8px 16px;font-size:13px;">Restart deck</button>
  </div>
  <div class="deck" id="deck" style="display:none;">
    <div class="card" id="card" tabindex="0" role="button" aria-label="flashcard — tap to flip">
      <div class="card-face card-front"><span class="face-tag">Question</span><div class="card-text" id="front"></div><span class="flip-hint">tap to flip</span></div>
      <div class="card-face card-back"><span class="face-tag">Answer</span><div class="card-text" id="back"></div><div class="why" id="why"></div><span class="flip-hint">tap to flip back</span></div>
    </div>
    <div class="grade">
      <button class="btn g-learn" id="btnLearn">Still learning</button>
      <button class="btn g-know" id="btnKnow">Know it</button>
    </div>
  </div>
  <div class="deckdone" id="deckDone" style="display:none;">
    <div class="score-big" id="donePct"></div>
    <p class="sub" id="doneMsg" style="text-align:center;"></p>
    <div style="text-align:center;"><button class="btn" id="again">Go again</button></div>
  </div>`;
  const style = `
  .stats { display: flex; gap: 10px; flex-wrap: wrap; margin: 6px 0 14px; }
  .stat { background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 10px 18px; text-align: center; flex: 1; min-width: 74px; }
  .stat b { display: block; font-size: 20px; }
  .stat span { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .05em; }
  .controls { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; font-size: 14px; color: var(--muted); }
  .chk { display: flex; align-items: center; gap: 6px; cursor: pointer; min-height: 32px; }
  .chk input { width: 18px; height: 18px; accent-color: var(--accent); }
  .deck { perspective: 1200px; }
  .card { position: relative; width: 100%; min-height: 300px; cursor: pointer; transform-style: preserve-3d; transition: transform .45s; outline: none; }
  .card.flipped { transform: rotateY(180deg); }
  .card-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; background: var(--panel); border: 1px solid var(--border); border-radius: 14px; padding: 22px; display: flex; flex-direction: column; }
  .card-front { border-top: 3px solid var(--accent); }
  .card-back { transform: rotateY(180deg); border-top: 3px solid var(--green); }
  .face-tag { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); margin-bottom: 10px; }
  .card-text { font-size: 16.5px; line-height: 1.6; flex: 1; overflow-y: auto; }
  .card-back .card-text { color: var(--green); font-weight: 600; }
  .why { font-size: 13.5px; color: var(--muted); line-height: 1.55; border-top: 1px solid var(--border); margin-top: 12px; padding-top: 10px; max-height: 130px; overflow-y: auto; }
  .why:empty { display: none; }
  .flip-hint { font-size: 11px; color: #6e7681; text-align: center; margin-top: 10px; }
  .grade { display: flex; gap: 12px; margin-top: 16px; }
  .grade .btn { flex: 1; margin: 0; padding: 14px; font-size: 15px; }
  .g-learn { background: transparent; border: 1px solid var(--gold); color: var(--gold); }
  .g-know { background: transparent; border: 1px solid var(--green); color: var(--green); }
  .g-learn:hover { background: rgba(210,153,34,.12); filter: none; }
  .g-know:hover { background: rgba(63,185,80,.12); filter: none; }
  .deckdone { background: var(--panel); border: 1px solid var(--border); border-radius: 14px; padding: 36px 22px; text-align: center; }
  .score-big { font-size: 56px; font-weight: 700; color: var(--green); margin: 6px 0; }
  @media (max-width: 600px) { .card { min-height: 340px; } .card-text { font-size: 15.5px; } }`;
  const script = `
  <script>
    var DECKS = ${JSON.stringify(decks.map(d => ({ label: d.label, cards: d.cards }))).replace(/</g, '\\u003c')};
    var KEY = 'secplus_cards_v1';
    var deckIdx = 0, order = [], pos = 0, flipped = false;
    function loadState(){ try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch(e){ return {}; } }
    function saveState(s){ localStorage.setItem(KEY, JSON.stringify(s)); }
    function deck(){ return DECKS[deckIdx]; }
    function state(){ var s = loadState(); return s[deck().label] || {}; }
    function setState(st){ var s = loadState(); s[deck().label] = st; saveState(s); }
    function isWeak(c){ return state()[c.id] !== 'known'; }
    function buildOrder(){
      var cards = deck().cards.slice();
      if (document.getElementById('weakOnly').checked) {
        cards = cards.filter(isWeak);
        if (!cards.length) cards = deck().cards.slice();
      }
      if (document.getElementById('shuffle').checked) {
        for (var i = cards.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = cards[i]; cards[i] = cards[j]; cards[j] = t; }
      } else {
        cards.sort(function(a, b){ return (state()[a.id] === 'known') - (state()[b.id] === 'known'); });
      }
      order = cards; pos = 0;
    }
    function paintStats(){
      var st = state(), k = 0;
      deck().cards.forEach(function(c){ if (st[c.id] === 'known') k++; });
      document.getElementById('stTotal').textContent = deck().cards.length;
      document.getElementById('stKnown').textContent = k;
      document.getElementById('stLearn').textContent = deck().cards.length - k;
      document.getElementById('stPos').textContent = order.length ? (pos + 1) + '/' + order.length : '0/0';
    }
    function show(){
      flipped = false;
      var card = document.getElementById('card');
      card.classList.remove('flipped');
      if (pos >= order.length) { finish(); return; }
      document.getElementById('deck').style.display = '';
      document.getElementById('deckDone').style.display = 'none';
      var c = order[pos];
      document.getElementById('front').textContent = c.q;
      document.getElementById('back').textContent = c.a;
      document.getElementById('why').textContent = c.why || '';
      paintStats();
    }
    function finish(){
      document.getElementById('deck').style.display = 'none';
      document.getElementById('deckDone').style.display = '';
      var st = state(), k = 0;
      deck().cards.forEach(function(c){ if (st[c.id] === 'known') k++; });
      var pct = deck().cards.length ? Math.round(100 * k / deck().cards.length) : 0;
      document.getElementById('donePct').textContent = pct + '%';
      document.getElementById('donePct').style.color = pct >= 80 ? 'var(--green)' : pct >= 50 ? 'var(--gold)' : 'var(--red)';
      document.getElementById('doneMsg').textContent = pct >= 80 ? 'Deck mastered — well done. Come back before exam day to keep it fresh.' : pct >= 50 ? 'Good progress. Run "Weak cards only" until this hits 80%.' : 'Keep drilling — mark honestly and the deck will carry you.';
      paintStats();
    }
    function flip(){ flipped = !flipped; document.getElementById('card').classList.toggle('flipped', flipped); }
    function grade(known){
      var st = state();
      st[order[pos].id] = known ? 'known' : 'learning';
      setState(st);
      pos++;
      show();
    }
    document.getElementById('card').addEventListener('click', flip);
    document.getElementById('card').addEventListener('keydown', function(e){ if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); } });
    document.getElementById('btnKnow').addEventListener('click', function(){ grade(true); });
    document.getElementById('btnLearn').addEventListener('click', function(){ grade(false); });
    document.getElementById('shuffle').addEventListener('change', function(){ buildOrder(); show(); });
    document.getElementById('weakOnly').addEventListener('change', function(){ buildOrder(); show(); });
    document.getElementById('restart').addEventListener('click', function(){ pos = 0; show(); });
    document.getElementById('again').addEventListener('click', function(){ buildOrder(); show(); });
    document.getElementById('deckSel').addEventListener('change', function(){ deckIdx = parseInt(this.value, 10); buildOrder(); show(); });
    document.addEventListener('keydown', function(e){ if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return; if (e.key === ' ') { e.preventDefault(); flip(); } if (e.key === 'ArrowRight') grade(true); if (e.key === 'ArrowLeft') grade(false); });
    buildOrder(); show();
  <\/script>`;
  return pageShell(deckLabel, '', bodyHtml + script, style);
}

// ---------- build ----------
let notesCount = 0, deckCount = 0, cardTotal = 0;
const deckIndex = [];

allTopics.forEach((topic, ti) => {
  const mdFile = path.join(DIR, `${topic.key}-study-notes.md`);
  const prev = allTopics[ti - 1] || null;
  const next = allTopics[ti + 1] || null;

  // 1. notes page
  if (fs.existsSync(mdFile)) {
    const md = fs.readFileSync(mdFile, 'utf8');
    fs.writeFileSync(path.join(DIR, `${topic.key}-study-notes.html`), notesPage(topic, md, prev, next));
    notesCount++;
  }

  // 2. flashcard deck from all question banks of this section
  const paths = topic.num !== null ? [
    path.join(DIR, `SY0-701-exam-simulator-${nn(topic.num)}-${topic.key}.html`),
    path.join(DIR, `${topic.key}-quiz.html`),
    path.join(DIR, `SY0-701-practice-exam-feedback-${nn(topic.num)}.html`),
    path.join(DIR, `SY0-701-final-exam-${topic.key}.html`),
  ] : [
    path.join(DIR, `${topic.key}-quiz.html`),
  ];
  const cards = cardsFromPages(paths);
  if (cards.length) {
    fs.writeFileSync(
      path.join(DIR, `flashcards-${topic.key}.html`),
      flashcardsPage(`${topic.label} — Flashcards`, [{ label: topic.label, cards }], '../flashcards.html', 'All decks')
    );
    deckIndex.push({ topic, cards });
    deckCount++; cardTotal += cards.length;
  }
});

// 3. combined deck + index
if (deckIndex.length) {
  const all = flashcardsPage('All Sections — Flashcards',
    deckIndex.map(d => ({ label: d.topic.label, cards: d.cards })),
    'library.html', 'Full library');
  fs.writeFileSync(path.join(DIR, 'flashcards-all.html'), all);

  const tiles = '';
  const idxBody = `
  <div class="topbar"><a href="../library.html">&larr; Full library</a><span class="grow"></span><a class="btn" href="flashcards-all.html" style="margin:0;padding:10px 18px;font-size:14px;">Study all sections (${cardTotal} cards)</a></div>
  <h1>Flashcard Decks</h1>
  <p class="sub">Every card is built from that section's question bank (simulator + quiz + feedback + final exam). Your Know-it / Still-learning progress is saved on this device and feeds the weak-cards-first ordering.</p>
  <div class="grid">
    ${deckIndex.map(d => `
    <a class="tile" href="flashcards-${d.topic.key}.html">
      <b>${esc(d.topic.label)}</b>
      <span class="cnt">${d.cards.length} cards</span>
      <span class="prog" data-label="${esc(d.topic.label)}"></span>
    </a>`).join('\n    ')}
  </div>
  <script>
    var KEY = 'secplus_cards_v1';
    function loadState(){ try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch(e){ return {}; } }
    document.querySelectorAll('.prog').forEach(function(el){
      var st = loadState()[el.getAttribute('data-label')] || {};
      var k = 0, t = 0;
      // counts are patched below with per-deck totals
      t = parseInt(el.getAttribute('data-total') || '0', 10);
      Object.keys(st).forEach(function(id){ if (st[id] === 'known') k++; });
      el.textContent = k + ' / ' + t + ' known';
      el.style.color = k === t ? 'var(--green)' : 'var(--muted)';
    });
  <\/script>`;
  const idxStyle = `
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px; }
  .tile { display: block; background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 16px 18px; color: var(--text); }
  .tile:hover { border-color: var(--accent); text-decoration: none; }
  .tile b { display: block; margin-bottom: 6px; font-size: 15px; }
  .tile .cnt { font-size: 12px; color: var(--muted); display: block; }
  .tile .prog { font-size: 12px; display: block; margin-top: 6px; color: var(--gold); }`;
  // patch totals into the index
  let idxHtml = pageShell('Flashcard Decks — SY0-701', '', idxBody, idxStyle);
  idxHtml = idxHtml.replace(/class="prog" data-label="([^"]+)"/g, (m, label) => {
    const d = deckIndex.find(x => x.topic.label === label);
    return `class="prog" data-label="${label}" data-total="${d ? d.cards.length : 0}"`;
  });
  fs.writeFileSync(path.join(DIR, 'flashcards.html'), idxHtml);
}

console.log(`study tools written: ${notesCount} interactive notes pages, ${deckCount} section decks (${cardTotal} cards), plus flashcards.html index & flashcards-all.html combined deck`);
