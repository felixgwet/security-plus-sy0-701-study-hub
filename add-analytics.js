// Injects analytics tracking into every timed exam page:
//   - adds sec:"<section-slug>" to each question (for per-section analytics)
//   - calls saveResult(details, points) on submit, which stores the attempt in
//     localStorage under 'secplus_results_v1' for analytics.html to read.
// Idempotent — safe to re-run. Run AFTER build-comptia-exams.js.
// Run: node add-analytics.js
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'exam-simulator');
const KEY = 'secplus_results_v1';

const KW = {
  'exam-tips': ['trick question', 'distractor', 'exam', 'test writers', 'read the question'],
  'threat-actors': ['apt', 'nation-state', 'script kid', 'hacktivist', 'insider threat', 'threat actor', 'attribution', 'false flag', 'shadow it', 'competitor'],
  'physical-security': ['badge', 'tailgat', 'bollard', 'fence', 'cctv', 'camera', 'sensor', 'mantrap', 'turnstile', 'fire suppression', 'key card', 'infrared', 'microwave', 'ultrasonic'],
  'social-engineering': ['phishing', 'pretext', 'baiting', 'quid pro quo', 'shoulder surf', 'dumpster', 'social engineer', 'vishing', 'smishing', 'whaling', 'watering hole', 'impersonat'],
  'malware': ['trojan', 'ransomware', 'spyware', 'adware', 'rootkit', 'worm', 'virus', 'malware', 'keylogger', 'botnet', 'dropper', 'backdoor', 'logic bomb'],
  'data-protection': ['data loss prevention', 'dlp', 'data classification', 'retention', 'masking', 'tokenization', 'pii', 'data sovereignty', 'anonymization', 'de-identification'],
  'cryptographic-solutions': ['aes', 'rsa', 'ecc', 'sha-', 'sha256', 'tls', 'ssl', 'certificate', 'pki', 'key exchange', 'digital signature', 'hashing', 'block cipher', 'stream cipher', 'perfect forward', 'hmac'],
  'risk-management': ['risk =', 'likelihood', 'impact', 'risk accept', 'risk transfer', 'risk mitigate', 'risk avoid', 'residual risk', 'risk register', 'sleet'],
  'third-party-vendor-risks': ['vendor', 'supplier', 'sla', 'mou', 'due diligence', 'supply chain', 'third-party', 'contractor', 'memorandum of understanding'],
  'governance-and-compliance': ['gdpr', 'hipaa', 'sox', 'sarbanes', 'pci dss', 'iso 27001', 'nist', 'governance', 'framework', 'policy vs', 'standard', 'guideline', 'regulation', 'oversight', 'ciso'],
  'asset-and-change-management': ['asset inventory', 'asset management', 'change management', 'change advisory', 'cab', 'capex', 'opex', 'scada', 'iot asset', 'legacy system'],
  'audits-and-assessments': ['audit', 'assessment', 'penetration test', 'vulnerability scan', 'attestation', 'red team'],
  'cyber-resilience': ['bcp', 'business continuity', 'disaster recovery', 'backup', 'raid', 'redundan', 'mttr', 'mtbf', 'hot site', 'cold site', 'warm site', 'fault tolerance'],
  'security-architecture': ['zero trust', 'segmentation', 'microsegment', 'dmz', 'defense in depth', 'sdn', 'sase', 'sd-wan', 'containerization', 'serverless', 'edge computing', 'embedded system'],
  'security-infrastructure': ['firewall', 'ids', 'ips', 'proxy', 'waf', 'honeypot', 'honeynet', 'siem', 'soar', 'edr', 'ngfw', 'vpn', 'load balancer', 'jump box', 'bastion', 'data diode'],
  'identity-and-access-management': ['mfa', 'oauth', 'saml', 'ldap', 'kerberos', 'sso', 'single sign-on', 'pam', 'authentication', 'authorization', 'access control', 'rbac', 'abac', 'fido', 'biometric', 'otp', 'hotp', 'totp', 'passwordless'],
  'vulnerabilities-and-attacks': ['sql injection', 'xss', 'cross-site scripting', 'csrf', 'buffer overflow', 'directory traversal', 'zero-day', 'cve', 'cvss', 'exploit', 'injection', 'xxe', 'request forgery'],
  'malicious-activity': ['brute force', 'password spray', 'downgrade', 'relay', 'pass the hash', 'spoofing', 'on-path', 'man-in-the-middle', 'denial of service', 'ddos', 'escalat'],
  'hardening': ['hardening', 'baseline configuration', 'patch', 'disab', 'secure config', 'sandbox', 'air gap', 'trusted computing', 'end-of-life', 'eol'],
  'security-techniques': ['least privilege', 'separation of duties', 'job rotation', 'mandatory vacation', 'access review', 'need to know', 'privilege creep'],
  'vulnerability-management': ['vulnerability scan', 'vulnerability management', 'bug bounty', 'rescan', 'credentialed scan', 'non-credentialed'],
  'alerting-and-monitoring': ['alert', 'alert tuning', 'baseline deviation', 'threshold', 'packet capture', 'netflow', 'log aggregat', 'snmp', 'syslog', 'impossible travel'],
  'incident-response': ['incident response', 'containment', 'eradication', 'recovery phase', 'chain of custody', 'severity', 'playbook', 'tabletop', 'first responder', 'isolation'],
  'investigating-an-incident': ['forensic', 'evidence', 'order of volatility', 'timeline', 'disk image', 'memory dump'],
  'automation-and-orchestration': ['automation', 'orchestration', 'runbook', 'continuous integration', 'continuous deployment', 'ci/cd', 'api integration', 'machine learning'],
  'security-awareness': ['awareness', 'training', 'phishing simulation', 'onboarding', 'user education'],
  'exam-readiness': ['readiness', 'practice exam', 'mock', 'weak area'],
  'conclusion': ['conclusion', 'course complete', 'next steps', 'career'],
};
function classify(q) {
  const text = (q.q + ' ' + ((q.options || q.terms || [])).join(' ')).toLowerCase();
  let best = null, bestScore = 0;
  for (const [slug, kws] of Object.entries(KW)) {
    let score = 0;
    for (const kw of kws) if (text.includes(kw)) score += kw.length > 6 ? 2 : 1;
    if (score > bestScore) { bestScore = score; best = slug; }
  }
  return best;
}

function extractArray(html, varName) {
  const start = html.indexOf(`const ${varName} = [`);
  if (start < 0) return null;
  const arrStart = html.indexOf('[', start);
  const end = html.indexOf('\n];', arrStart);
  if (end < 0) return null;
  try {
    return Function('"use strict";return (' + html.slice(arrStart, end) + '\n])')();
  } catch (e) {
    return null;
  }
}

const SNIPPET = `
<script>
/* analytics hook — stores each attempt in localStorage for analytics.html */
function saveResult(details, points) {
  try {
    const KEY = '${KEY}';
    const all = JSON.parse(localStorage.getItem(KEY) || '[]');
    const sections = {};
    details.forEach(function (d) {
      const slug = (d.q && d.q.sec) || 'general';
      if (!sections[slug]) sections[slug] = { c: 0, t: 0 };
      sections[slug].t += 1;
      sections[slug].c += d.pts;
    });
    all.push({
      exam: document.title,
      file: location.pathname.split('/').pop(),
      date: new Date().toISOString(),
      points: points,
      total: EXAM.length,
      pct: points / EXAM.length,
      timeLeft: (typeof timeLeft !== 'undefined') ? timeLeft : null,
      sections: sections
    });
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch (e) { /* storage unavailable — ignore */ }
}
</script>
`;

const targets = fs.readdirSync(DIR).filter(f =>
  /^SY0-701-(comptia-full-exam|mega-exam|final-exam)-.+\.html$/.test(f)
);

let patched = 0, skipped = 0;
for (const f of targets) {
  const fp = path.join(DIR, f);
  let html = fs.readFileSync(fp, 'utf8');
  if (html.includes('function saveResult')) { skipped++; continue; }

  // 1) tag questions with their section
  let sec = null;
  const fm = f.match(/^SY0-701-final-exam-(.+)\.html$/);
  if (fm) sec = fm[1];
  const examArr = extractArray(html, 'EXAM');
  if (!examArr) { console.error('no EXAM array:', f); continue; }
  let changed = false;
  for (const q of examArr) {
    if (!q.sec) { q.sec = sec || classify(q) || 'mixed'; changed = true; }
  }
  if (changed) {
    const aStart = html.indexOf('const EXAM = [');
    const arrStart = html.indexOf('[', aStart);
    const aEnd = html.indexOf('\n];', arrStart);
    html = html.slice(0, aStart) + 'const EXAM = ' + JSON.stringify(examArr) + ';' + html.slice(aEnd + 3);
  }

  // 2) hook submit
  const hook = 'const pct = points / EXAM.length;';
  if (!html.includes(hook)) { console.error('no hook point:', f); continue; }
  html = html.replace(hook, hook + '\n  saveResult(details, points);');

  // 3) append saveResult definition
  html = html.replace('</body>', SNIPPET + '</body>');
  fs.writeFileSync(fp, html);
  patched++;
}
console.log(`patched: ${patched}, already tracked: ${skipped}, total targets: ${targets.length}`);
