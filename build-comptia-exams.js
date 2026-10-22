// Builds 3 CompTIA-style full-course exams (90 questions each, all 28 sections,
// escalating difficulty) from the existing question banks in exam-simulator/.
// Exam 1 Foundations <- topic quizzes (recall-level)
// Exam 2 Intermediate <- per-section final exams
// Exam 3 Expert <- mega-exam pools (classified by keyword) + hardest final questions
// Run: node build-comptia-exams.js
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'exam-simulator');
const OUT = DIR;

// ---------- deterministic PRNG ----------
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled(arr, seed) {
  const a = arr.slice();
  const rnd = mulberry32(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------- extraction ----------
function extractArray(file, varName) {
  const html = fs.readFileSync(file, 'utf8');
  const start = html.indexOf(`const ${varName} = [`);
  if (start < 0) return null;
  const arrStart = html.indexOf('[', start);
  const end = html.indexOf('\n];', arrStart);
  if (end < 0) return null;
  const literal = html.slice(arrStart, end) + '\n]';
  try {
    return Function('"use strict";return (' + literal + ')')();
  } catch (e) {
    console.error('PARSE FAIL', file, e.message);
    return null;
  }
}
function norm(item, src) {
  if (!item || !item.q || !Array.isArray(item.options)) return null;
  return {
    type: item.type || 'mcq',
    pick: item.pick,
    q: String(item.q),
    options: item.options.map(String),
    answer: item.answer,
    why: item.why ? String(item.why) : '',
    ...(item.terms ? { terms: item.terms } : {}),
    ...(item.defs ? { defs: item.defs } : {}),
  };
}

// ---------- section list (canonical order) ----------
const files = fs.readdirSync(DIR);
const sections = [];
for (const f of files) {
  const m = f.match(/^SY0-701-exam-simulator-(\d+)-(.+)\.html$/);
  if (m) sections.push({ num: parseInt(m[1], 10), slug: m[2] });
}
sections.sort((a, b) => a.num - b.num);

// ---------- per-section pools ----------
const pools = {}; // slug -> { quiz:[], final:[], feedback:[] }
for (const s of sections) pools[s.slug] = { quiz: [], final: [], feedback: [] };

for (const s of sections) {
  const quizFile = path.join(DIR, `${s.slug}-quiz.html`);
  const finalFile = path.join(DIR, `SY0-701-final-exam-${s.slug}.html`);
  const fbFile = path.join(DIR, `SY0-701-practice-exam-feedback-${s.num}.html`);
  if (fs.existsSync(quizFile)) {
    (extractArray(quizFile, 'QUESTIONS') || []).forEach(it => {
      const n = norm(it, 'quiz'); if (n) pools[s.slug].quiz.push(n);
    });
  }
  if (fs.existsSync(finalFile)) {
    (extractArray(finalFile, 'EXAM') || []).forEach(it => {
      const n = norm(it, 'final'); if (n) pools[s.slug].final.push(n);
    });
  }
  if (fs.existsSync(fbFile)) {
    (extractArray(fbFile, 'EXAM') || []).forEach(it => {
      const n = norm(it, 'feedback'); if (n) pools[s.slug].feedback.push(n);
    });
  }
}

// ---------- mega pools, classified into sections by keyword ----------
const KW = {
  'exam-tips': ['trick question', 'distractor', 'exam', 'test writers', 'read the question'],
  'threat-actors': ['apt', 'nation-state', 'script kiddie', 'hacktivist', 'insider threat', 'threat actor', 'attribution', 'false flag', 'shadow it', 'competitor'],
  'physical-security': ['badge', 'tailgat', 'bollard', 'fence', 'cctv', 'camera', 'sensor', 'mantrap', 'turnstile', 'fire suppression', 'lock', 'key card', 'piR motion', 'infrared', 'microwave', 'ultrasonic', 'pressure mat'],
  'social-engineering': ['phishing', 'pretext', 'baiting', 'quid pro quo', 'shoulder surf', 'dumpster', 'social engineer', 'vishing', 'smishing', 'whaling', 'watering hole', 'impersonat'],
  'malware': ['trojan', 'ransomware', 'spyware', 'adware', 'rootkit', 'worm', 'virus', 'malware', 'keylogger', 'botnet', 'dropper', 'backdoor', 'logic bomb'],
  'data-protection': ['data loss prevention', 'dlp', 'data classification', 'retention', 'masking', 'tokenization', 'pii', 'pci dss data', 'data sovereignty', 'anonymization', 'de-identification'],
  'cryptographic-solutions': ['aes', 'rsa', 'ecc', 'sha-', 'sha256', 'tls', 'ssl', 'certificate', 'pki', 'key exchange', 'digital signature', 'hashing', 'block cipher', 'stream cipher', 'perfect forward', 'hmac', 'pgp'],
  'risk-management': ['risk =', 'likelihood', 'impact', 'risk accept', 'risk transfer', 'risk mitigate', 'risk avoid', 'residual risk', 'risk register', 'threat assessment', 'sleet'],
  'third-party-vendor-risks': ['vendor', 'supplier', 'sla', 'mou', 'due diligence', 'supply chain', 'third-party', 'contractor', 'memorandum of understanding'],
  'governance-and-compliance': ['gdpr', 'hipaa', 'sox', 'sarbanes', 'pci dss', 'iso 27001', 'nist', 'governance', 'framework', 'policy vs', 'standard', 'guideline', 'regulation', 'oversight', 'ciso'],
  'asset-and-change-management': ['asset inventory', 'asset management', 'change management', 'change advisory', 'cab', 'capex', 'opex', 'scada', 'iot asset', 'legacy system'],
  'audits-and-assessments': ['audit', 'assessment', 'penetration test', 'penetration engagement', 'vulnerability scan', 'attestation', 'internal vs external', 'red team'],
  'cyber-resilience': ['bcp', 'business continuity', 'disaster recovery', 'backup', 'raid', 'redundan', 'mttr', 'mtbf', 'hot site', 'cold site', 'warm site', 'fault tolerance', 'single point of failure'],
  'security-architecture': ['zero trust', 'segmentation', 'microsegment', 'dmz', 'defense in depth', 'sdn', 'sase', 'sd-wan', 'containerization', 'serverless', 'edge computing', 'embedded system', 'secure by design'],
  'security-infrastructure': ['firewall', 'ids', 'ips', 'proxy', 'waf', 'honeypot', 'honeynet', 'siem', 'soar', 'edr', 'ngfw', 'vpn', 'load balancer', 'jump box', 'bastion', 'data diode', 'network access control'],
  'identity-and-access-management': ['mfa', 'oauth', 'saml', 'ldap', 'kerberos', 'sso', 'single sign-on', 'pam', 'authentication', 'authorization', 'access control', 'dac', 'rbac', 'abac', 'fido', 'biometric', 'otp', 'hotp', 'totp', 'passwordless'],
  'vulnerabilities-and-attacks': ['sql injection', 'xss', 'cross-site scripting', 'csrf', 'buffer overflow', 'directory traversal', 'zero-day', 'cve', 'cvss', 'exploit', 'injection', 'xxe', 'request forgery', 'race condition'],
  'malicious-activity': ['brute force', 'password spray', 'downgrade', 'relay', 'pass the hash', 'spoofing', 'on-path', 'man-in-the-middle', 'denial of service', ' ddos', 'botnet traffic', 'escalat', 'persistence'],
  'hardening': ['hardening', 'baseline configuration', 'patch', 'disab', 'secure config', 'sandbox', 'air gap', 'trusted computing', 'eol', 'end-of-life'],
  'security-techniques': ['least privilege', 'separation of duties', 'job rotation', 'mandatory vacation', 'access review', 'role-based access', 'need to know', 'privilege creep'],
  'vulnerability-management': ['vulnerability scan', 'vulnerability management', 'bug bounty', 'rescan', 'credentialed scan', 'non-credentialed', 'red team', 'exploit framework'],
  'alerting-and-monitoring': ['alert', 'alert tuning', 'baseline deviation', 'threshold', 'packet capture', 'netflow', 'log aggregat', 'snmp', 'syslog', 'impossible travel', 'monitoring'],
  'incident-response': ['incident response', 'containment', 'eradication', 'recovery phase', 'chain of custody', 'severity', 'playbook', 'exercise', 'tabletop', 'simulation', 'first responder', 'isolation'],
  'investigating-an-incident': ['forensic', 'evidence', 'order of volatility', 'timeline', 'disk image', 'capture', 'analyze the data', 'memory dump'],
  'automation-and-orchestration': ['automation', 'orchestration', 'runbook', 'continuous integration', 'continuous deployment', 'ci/cd', 'api integration', 'machine learning detection'],
  'security-awareness': ['awareness', 'training', 'phishing simulation', 'onboarding', 'user education', 'role-based training'],
  'exam-readiness': ['readiness', 'practice exam', 'mock', 'score', 'weak area'],
  'conclusion': ['conclusion', 'course complete', 'next steps', 'career'],
};
function classify(q) {
  const text = (q.q + ' ' + q.options.join(' ')).toLowerCase();
  let best = null, bestScore = 0;
  for (const [slug, kws] of Object.entries(KW)) {
    let score = 0;
    for (const kw of kws) {
      if (text.includes(kw)) score += kw.length > 6 ? 2 : 1;
    }
    if (score > bestScore) { bestScore = score; best = slug; }
  }
  return best; // may be null
}
const megaPools = {}; // slug -> []  (plus 'mixed')
for (const slug of Object.keys(pools)) megaPools[slug] = [];
megaPools.mixed = [];
for (const mega of ['SY0-701-mega-exam-v3-hardest.html', 'SY0-701-mega-exam-v2-harder.html', 'SY0-701-mega-exam-v1-realistic.html']) {
  const arr = extractArray(path.join(DIR, mega), 'EXAM') || [];
  for (const it of arr) {
    const n = norm(it, mega); if (!n) continue;
    const slug = classify(n);
    (megaPools[slug] || megaPools.mixed).push(n);
  }
}

// ---------- exam assembly ----------
const TOTAL = 90;
const N = sections.length; // 28
const base = Math.floor(TOTAL / N);      // 3
const extra = TOTAL - base * N;          // 6 sections get one more
const extraNums = new Set(sections.slice(0, extra).map(s => s.num));

function pickFrom(pool, count, seed, sortFn) {
  const sorted = sortFn ? pool.slice().sort(sortFn) : shuffled(pool, seed);
  return sorted.slice(0, count);
}

function buildExam(tier) {
  const perSection = {}; // slug -> [questions]
  const leftovers = [];
  sections.forEach((s, i) => {
    const need = base + (extraNums.has(s.num) ? 1 : 0);
    let picks = [];
    if (tier === 1) {
      // easiest first: shortest stems from quizzes, backfill with feedback
      picks = pickFrom(pools[s.slug].quiz, need, 100 + i, (a, b) => a.q.length - b.q.length);
      if (picks.length < need) picks = picks.concat(pickFrom(pools[s.slug].feedback, need - picks.length, 200 + i, (a, b) => a.q.length - b.q.length));
    } else if (tier === 2) {
      picks = pickFrom(pools[s.slug].final, need, 300 + i);
      if (picks.length < need) picks = picks.concat(pickFrom(pools[s.slug].feedback, need - picks.length, 400 + i));
    } else {
      // expert: mega pool first (already v3->v2->v1 order by construction), hardest = longest stems
      picks = pickFrom(megaPools[s.slug], need, 500 + i, (a, b) => b.q.length - a.q.length);
      if (picks.length < need) picks = picks.concat(pickFrom(pools[s.slug].final, need - picks.length, 600 + i, (a, b) => b.q.length - a.q.length));
      if (picks.length < need) picks = picks.concat(pickFrom(pools[s.slug].feedback, need - picks.length, 700 + i, (a, b) => b.q.length - a.q.length));
    }
    perSection[s.slug] = picks;
    leftovers.push(...picks);
  });

  // interleave sections round-robin so topics are mixed, not blocked
  const exam = [];
  for (let round = 0; round < base + 1; round++) {
    for (const s of sections) {
      if (perSection[s.slug][round]) exam.push({ ...perSection[s.slug][round], sec: s.slug });
    }
  }
  // distribute mega 'mixed' leftovers into any remaining slots (expert tier only)
  if (exam.length < TOTAL) {
    const fillPool = tier === 3
      ? shuffled(megaPools.mixed, 900)
      : shuffled(sections.flatMap(s => tier === 1 ? pools[s.slug].quiz : pools[s.slug].final), 901);
    for (const q of fillPool) {
      if (exam.length >= TOTAL) break;
      if (!exam.includes(q)) exam.push({ ...q, sec: classify(q) || 'mixed' });
    }
  }
  return exam.slice(0, TOTAL);
}

// ---------- render from v1 template ----------
const template = fs.readFileSync(path.join(DIR, 'SY0-701-mega-exam-v1-realistic.html'), 'utf8');

const EXAMS = [
  {
    file: 'SY0-701-comptia-full-exam-1-foundations.html',
    title: 'CompTIA-Style Full Practice Exam 1 — Foundations',
    h1: 'Full-Course CompTIA-Style Exam 1 — Foundations',
    badge: 'CompTIA Security+ SY0-701 · FULL PRACTICE EXAM · 90 Questions',
    comment: 'COMPTIA-STYLE FULL EXAM 1 (FOUNDATIONS) — 90 questions across all 28 sections. Recall- and concept-level items drawn from the topic quizzes. Suggested starting point of the three-exam ladder.',
    desc: 'A full-length, CompTIA-style practice exam: <b style="color:var(--text)">90 questions spanning all 28 sections</b> at foundations level — the rung one of three. Clear this comfortably before attempting Exam 2.',
    tier: 1,
  },
  {
    file: 'SY0-701-comptia-full-exam-2-intermediate.html',
    title: 'CompTIA-Style Full Practice Exam 2 — Intermediate',
    h1: 'Full-Course CompTIA-Style Exam 2 — Intermediate',
    badge: 'CompTIA Security+ SY0-701 · FULL PRACTICE EXAM · 90 Questions',
    comment: 'COMPTIA-STYLE FULL EXAM 2 (INTERMEDIATE) — 90 questions across all 28 sections. Scenario-based items drawn from the per-section final exams. Rung two of three.',
    desc: 'A full-length, CompTIA-style practice exam: <b style="color:var(--text)">90 questions spanning all 28 sections</b> at intermediate level — scenario-heavy, drawn from the section final exams. Rung two of three.',
    tier: 2,
  },
  {
    file: 'SY0-701-comptia-full-exam-3-expert.html',
    title: 'CompTIA-Style Full Practice Exam 3 — Expert',
    h1: 'Full-Course CompTIA-Style Exam 3 — Expert',
    badge: 'CompTIA Security+ SY0-701 · FULL PRACTICE EXAM · 90 Questions',
    comment: 'COMPTIA-STYLE FULL EXAM 3 (EXPERT) — 90 questions across all 28 sections. Hardest pool: mega-exam questions plus the toughest final-exam scenarios. Final rung of the ladder.',
    desc: 'A full-length, CompTIA-style practice exam: <b style="color:var(--text)">90 questions spanning all 28 sections</b> at expert level — the hardest pool, above real-exam difficulty. Final rung of the ladder.',
    tier: 3,
  },
];

function replaceOnce(haystack, from, to) {
  if (from instanceof RegExp) {
    if (!from.test(haystack)) { console.error('MISSING PATTERN:', String(from).slice(0, 60)); return haystack; }
    return haystack.replace(from, () => to);
  }
  const i = haystack.indexOf(from);
  if (i < 0) { console.error('MISSING PATTERN:', from.slice(0, 60)); return haystack; }
  return haystack.slice(0, i) + to + haystack.slice(i + from.length);
}

for (const cfg of EXAMS) {
  const exam = buildExam(cfg.tier);
  if (exam.length !== TOTAL) console.error(`WARNING: ${cfg.file} has ${exam.length} questions`);
  // remove source-specific extra fields we added
  const clean = exam.map(({ type, pick, q, options, answer, why, terms, defs, sec }) => {
    const o = { type, q, options, answer, why, sec };
    if (pick) o.pick = pick;
    if (terms) o.terms = terms;
    if (defs) o.defs = defs;
    return o;
  });

  let html = template;
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${cfg.title}</title>`);
  html = replaceOnce(html, '<div class="badge">CompTIA Security+ SY0-701 · FINAL EXAM · Official Style</div>', `<div class="badge">${cfg.badge}</div>`);
  html = replaceOnce(html, '<h1>Full-Course Mega Exam V1 — Exam-Level</h1>', `<h1>${cfg.h1}</h1>`);
  html = replaceOnce(html, /<p><b style="color:var\(--text\)">This full-course capstone[\s\S]*?Pass this comfortably before attempting V2\.<\/p>/, `<p>${cfg.desc}</p>`);
  html = replaceOnce(html, /<b id="fact-q">\d+<\/b>/, '<b id="fact-q">90</b>');
  html = replaceOnce(html, /<b id="fact-t">[\d:]+<\/b>/, '<b id="fact-t">90:00</b>');
  html = replaceOnce(html, 'Begin Final Exam', 'Begin Exam');
  html = replaceOnce(html, '<div class="badge">Final Exam Score Report</div>', '<div class="badge">Score Report</div>');
  html = replaceOnce(html, 'Retake Final Exam', 'Retake Exam');
  // replace comment block
  html = replaceOnce(html, /\/\* =+[\s\S]*?=+ \*\//, `/* ============================================================\n   ${cfg.comment}\n   ============================================================ */`);
  // replace EXAM array
  const aStart = html.indexOf('const EXAM = [');
  const arrStart = html.indexOf('[', aStart);
  const aEnd = html.indexOf('\n];', arrStart);
  html = html.slice(0, aStart) + 'const EXAM = ' + JSON.stringify(clean, null, 1) + ';' + html.slice(aEnd + 3);
  // timer: 60s per question -> 90:00
  html = replaceOnce(html, 'const SECONDS_PER_QUESTION = 90;', 'const SECONDS_PER_QUESTION = 60;');

  fs.writeFileSync(path.join(OUT, cfg.file), html);
  const types = {};
  clean.forEach(q => types[q.type] = (types[q.type] || 0) + 1);
  console.log(`${cfg.file}: ${clean.length} questions ${JSON.stringify(types)}`);
}
console.log('done');
