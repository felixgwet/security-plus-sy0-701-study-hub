// Generates library.html: every exam and quiz, ordered individually by section.
// Run: node build-library.js  (re-run after adding/removing files)
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'exam-simulator');
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.html') || f.endsWith('.md'));

function titleize(slug) {
  return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}
function link(href, label) {
  return href ? `<a href="exam-simulator/${encodeURIComponent(href)}">${label}</a>` : '<span class="na">&mdash;</span>';
}

// Canonical section order comes from the numbered simulator pages
const simRe = /^SY0-701-exam-simulator-(\d+)-(.+)\.html$/;
const sections = [];
for (const f of files) {
  const m = f.match(simRe);
  if (m) sections.push({ num: parseInt(m[1], 10), slug: m[2] });
}
sections.sort((a, b) => a.num - b.num);

const used = new Set();
function pick(re) {
  for (const f of files) {
    if (!used.has(f) && re.test(f)) { used.add(f); return f; }
  }
  return null;
}

// Rows for the main table
const rows = sections.map(s => {
  const nn = s.num === 0 ? '00' : String(s.num);
  const quiz = pick(new RegExp(`^${s.slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-quiz\\.html$`));
  let notes = pick(new RegExp(`^${s.slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(-and-redundancy)?-study-notes\\.html$`));
  const cards = pick(new RegExp(`^flashcards-${s.slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.html$`));
  const finalExam = pick(new RegExp(`^SY0-701-final-exam-${s.slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.html$`));
  const feedback = pick(new RegExp(`^SY0-701-practice-exam-feedback-${nn}\\.html$`));
  return { ...s, quiz, notes, cards, finalExam, feedback };
});

// Mega exams
const megas = files.filter(f => /mega-exam/.test(f)).sort().reverse();
megas.forEach(f => used.add(f));

// CompTIA-style full exams (90 questions, generated)
const comptias = files.filter(f => /comptia-full-exam/.test(f)).sort();
comptias.forEach(f => used.add(f));

// Anything left over that looks like a quiz/notes/exam (e.g. security-fundamentals)
// Study-tools pages (interactive notes html, flashcards) are linked from their own
// index/columns, and raw .md sources stay in the repo for regeneration only.
const extras = files.filter(f => !used.has(f) && !/^(SY0-701-exam-simulator|index)/.test(f) && !/-study-notes\.md$/.test(f) && !/^flashcards/.test(f));

const megaCards = megas.map(f => {
  const m = f.match(/mega-exam-(.+)\.html$/);
  const name = m ? titleize(m[1].replace(/^v\d-/, t => t.toUpperCase() + ' ')) : f;
  return `<a class="tile" href="exam-simulator/${encodeURIComponent(f)}"><b>Mega Exam &middot; ${name}</b><span>${f}</span></a>`;
}).join('\n      ');

const comptiaCards = comptias.map(f => {
  const m = f.match(/comptia-full-exam-(\d)-(.+)\.html$/);
  const name = m ? `Exam ${m[1]} &middot; ${titleize(m[2])}` : f;
  return `<a class="tile" href="exam-simulator/${encodeURIComponent(f)}" style="border-color:#4a6fa5;"><b>CompTIA-Style Full &middot; ${name}</b><span>90 questions &middot; all 28 sections &middot; 90 minutes</span></a>`;
}).join('\n      ');

const extraRows = extras.length ? `
    <h2>Additional Topics</h2>
    <table>
      <thead><tr><th>Topic</th><th>Quiz</th><th>Study Notes</th></tr></thead>
      <tbody>${extras.map(f => {
        const slug = f.replace(/-(quiz|study-notes)\.(html|md)$/, '');
        return '';
      }).join('')}</tbody>
    </table>` : '';

// Group extras by slug
const extraMap = {};
for (const f of extras) {
  const m = f.match(/^(.+?)-(quiz|study-notes)\.(html|md)$/);
  if (m) {
    (extraMap[m[1]] = extraMap[m[1]] || {})[m[2]] = f;
  }
}
const extraTable = Object.keys(extraMap).length ? `
    <h2>Additional Topics</h2>
    <table>
      <thead><tr><th>Topic</th><th>Quiz</th><th>Study Notes</th></tr></thead>
      <tbody>
      ${Object.entries(extraMap).map(([slug, o]) => `<tr><td>${titleize(slug)}</td><td>${link(o.quiz, 'Open quiz')}</td><td>${link(o['study-notes'], 'Open notes')}</td></tr>`).join('\n      ')}
      </tbody>
    </table>` : '';

const sectionRows = rows.map(r => {
  const nn = r.num === 0 ? '00' : String(r.num);
  return `<tr>
        <td class="num">${r.num}</td>
        <td class="topic">${titleize(r.slug)}</td>
        <td>${link(`SY0-701-exam-simulator-${nn}-${r.slug}.html`, 'Simulator')}</td>
        <td>${link(r.quiz, 'Quiz')}</td>
        <td>${link(r.notes, 'Notes')}</td>
        <td>${link(r.cards, 'Flashcards')}</td>
        <td>${link(r.feedback, 'Feedback')}</td>
        <td>${link(r.finalExam, 'Final Exam')}</td>
      </tr>`;
}).join('\n      ');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Security+ SY0-701 &mdash; Full Exam Library</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: "Segoe UI", system-ui, sans-serif; color: #e8eaf0; background: #0d1117; }
  .wrap { max-width: 1100px; margin: 0 auto; padding: 32px 24px 80px; }
  h1 { font-size: 26px; margin: 0 0 4px; }
  .sub { color: #9aa4b2; margin-bottom: 24px; }
  a { color: #7fb0ff; text-decoration: none; }
  a:hover { text-decoration: underline; }
  h2 { font-size: 18px; margin: 32px 0 12px; border-bottom: 1px solid #2d333b; padding-bottom: 8px; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th, td { text-align: left; padding: 9px 10px; border-bottom: 1px solid #21262e; }
  thead th { color: #9aa4b2; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
  tbody tr:hover { background: #161b22; }
  .num { color: #6e7681; width: 40px; }
  .topic { font-weight: 600; }
  .na { color: #484f58; }
  .megas { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; }
  .tile { display: block; padding: 16px 18px; border-radius: 12px; background: #1c2330; border: 1px solid #303a4a; }
  .tile:hover { border-color: #4a6fa5; text-decoration: none; }
  .tile b { display: block; margin-bottom: 4px; }
  .tile span { font-size: 12px; color: #9aa4b2; }
  .top { font-size: 13px; color: #9aa4b2; }
</style>
</head>
<body>
  <div class="wrap">
    <h1>Security+ SY0-701 &mdash; Full Exam Library</h1>
    <div class="sub">Every section, individually ordered. ${rows.length} sections + ${comptias.length} CompTIA-style 90-question full exams + ${megas.length} mega exams. <span class="top"><a href="index.html">&larr; Overview</a> &middot; <a href="analytics.html">Analytics</a> &middot; <a href="exam-simulator/flashcards.html">Flashcard decks</a></span></div>

    <h2>CompTIA-Style Full Exams &mdash; 90 questions, all sections, escalating difficulty</h2>
    <div class="megas">
      ${comptiaCards}
    </div>

    <h2>Mega Exams (full-length)</h2>
    <div class="megas">
      ${megaCards}
    </div>

    <h2>Sections ${rows[0] ? rows[0].num : ''} &ndash; ${rows.length ? rows[rows.length - 1].num : ''} &mdash; each with simulator, quiz, notes, flashcards, feedback &amp; final exam</h2>
    <table>
      <thead><tr><th>#</th><th>Section</th><th>Simulator</th><th>Quiz</th><th>Notes</th><th>Flashcards</th><th>Feedback</th><th>Final Exam</th></tr></thead>
      <tbody>
      ${sectionRows}
      </tbody>
    </table>
    ${extraTable}
  </div>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'library.html'), html);
console.log(`library.html written: ${rows.length} sections, ${megas.length} mega exams, ${Object.keys(extraMap).length} extra topics`);
