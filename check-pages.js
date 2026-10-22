// Checks every simulator / feedback / final-exam page for a mismatched
// start-screen description (copy-paste bug) and broken question data.
const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, 'exam-simulator');

const sections = [];
for (const f of fs.readdirSync(DIR)) {
  const m = f.match(/^SY0-701-exam-simulator-(\d+)-(.+)\.html$/);
  if (m) sections.push({ num: parseInt(m[1], 10), slug: m[2] });
}
sections.sort((a, b) => a.num - b.num);

const TOPIC_KW = {
  'exam-tips': ['exam-tip', 'trick question', 'test-taking'],
  'threat-actors': ['threat actor', 'apt', 'attribution', 'motivation'],
  'physical-security': ['physical security', 'badge', 'tailgating', 'surveillance', 'bollard'],
  'social-engineering': ['social engineering', 'phishing', 'pretexting'],
  'malware': ['malware', 'trojan', 'ransomware', 'virus'],
  'data-protection': ['data protection', 'classification', 'dlp', 'masking'],
  'cryptographic-solutions': ['cryptograph', 'encryption', 'certificate', 'hashing', 'pki'],
  'risk-management': ['risk management', 'sle', 'ale', 'risk register', 'risk treatment'],
  'third-party-vendor-risks': ['vendor', 'third-part', 'supply chain'],
  'governance-and-compliance': ['governance', 'compliance', 'regulat', 'framework'],
  'asset-and-change-management': ['asset management', 'change management'],
  'audits-and-assessments': ['audit', 'assessment'],
  'cyber-resilience': ['resilien', 'disaster recovery', 'business continuity', 'backup'],
  'security-architecture': ['architecture', 'zero trust', 'segmentation'],
  'security-infrastructure': ['infrastructure', 'firewall', 'ids', 'siem'],
  'identity-and-access-management': ['identity', 'authentication', 'authorization', 'access management'],
  'vulnerabilities-and-attacks': ['vulnerabilit', 'injection', 'xss', 'exploit'],
  'malicious-activity': ['malicious', 'brute force', 'spoof'],
  'hardening': ['hardening', 'baseline', 'patch'],
  'security-techniques': ['techniques', 'least privilege', 'separation of duties'],
  'vulnerability-management': ['vulnerability management', 'scan'],
  'alerting-and-monitoring': ['monitoring', 'alerting', 'baseline deviation'],
  'incident-response': ['incident response', 'containment', 'playbook'],
  'investigating-an-incident': ['investigat', 'forensic', 'evidence'],
  'automation-and-orchestration': ['automation', 'orchestration'],
  'security-awareness': ['awareness', 'training'],
  'exam-readiness': ['readiness'],
  'conclusion': ['conclusion', 'next step'],
};
function ownKWs(slug) { return TOPIC_KW[slug] || [slug.replace(/-/g, ' ')]; }

function getDesc(html) {
  const m = html.match(/<div id="start-screen"[\s\S]*?<p>([\s\S]*?)<\/p>/);
  return m ? m[1].replace(/<[^>]+>/g, ' ').toLowerCase() : '';
}
function countQ(html) {
  const m = html.match(/const EXAM = (\[[\s\S]*?\]);/);
  if (!m) return -1;
  try {
    const arr = Function('"use strict";return (' + m[1] + ')')();
    return arr.length;
  } catch (err) { return -2; }
}

let bad = 0;
function check(file, slug) {  const html = fs.readFileSync(path.join(DIR, file), 'utf8');
  const desc = getDesc(html);
  const n = countQ(html);
  const own = ownKWs(slug).some(k => desc.includes(k));
  let otherHit = null;
  for (const [s2, kws] of Object.entries(TOPIC_KW)) {
    if (s2 === slug) continue;
    if (kws.some(k => desc.includes(k))) { otherHit = s2; break; }
  }
  const status = [];
  if (n <= 0) status.push('QUESTIONS BROKEN (' + n + ')');
  if (desc && !own && otherHit) status.push('DESC MISMATCH -> looks like "' + otherHit + '"');
  if (!desc) status.push('NO DESC FOUND');
  if (status.length) { bad++; console.log(file + '  [' + slug + ']  ' + status.join('; ')); }
}

for (const s of sections) {
  const nn = s.num === 0 ? '00' : String(s.num);
  check(`SY0-701-exam-simulator-${nn}-${s.slug}.html`, s.slug);
  check(`SY0-701-practice-exam-feedback-${nn}.html`, s.slug);
  check(`SY0-701-final-exam-${s.slug}.html`, s.slug);
}
console.log(bad ? `issues found: ${bad}` : 'all pages OK');
