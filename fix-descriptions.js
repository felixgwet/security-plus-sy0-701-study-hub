// Fixes the copy-paste description bug in the source course files:
// many simulator/feedback pages describe the WRONG section (risk management).
// Replaces the coverage sentence with an accurate per-section description.
// Idempotent. Run: node fix-descriptions.js
const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, 'exam-simulator');

const COVERAGE = {
  'exam-tips': 'exam-taking strategy: how SY0-701 questions are precisely written, distractor elimination, the confidentiality / integrity / availability associations, recognition-based study tactics, and pacing a 60-90 day study plan',
  'threat-actors': 'motivations, attributes, actor types, insider threats, shadow IT, threat vectors, and deception technologies',
  'physical-security': 'physical security: barriers and bollards, badge systems and mantraps, surveillance cameras and sensors, tailgating prevention, and fire suppression',
  'social-engineering': 'social engineering: phishing and spear phishing, pretexting, baiting, quid pro quo, watering-hole attacks, and human-factor defenses',
  'malware': 'malware: viruses, worms, trojans, ransomware, spyware, rootkits and bootkits, fileless malware, and modern dropper chains',
  'data-protection': 'data protection: classification and labeling, data loss prevention, retention and destruction, masking, tokenization, and anonymization of PII',
  'cryptographic-solutions': 'cryptographic solutions: symmetric vs asymmetric algorithms, hashing and digital signatures, PKI and certificates, key exchange, and TLS',
  'risk-management': 'the five-step risk management lifecycle, the four risk assessment frequencies (ad-hoc, recurring, one-time, continuous), risk identification and the business impact analysis, the RTO / RPO / MTTR / MTBF metrics, the risk register with KRIs and risk owners, risk appetite vs tolerance, qualitative vs quantitative analysis with SLE / EF / ARO / ALE calculations, the four treatment strategies (transfer, accept, avoid, mitigate), and risk monitoring & reporting with residual and control risk',
  'third-party-vendor-risks': 'third-party risk: vendor assessment and due diligence, contracts, SLAs and MOUs, supply-chain risk, data sovereignty, and cloud shared-responsibility models',
  'governance-and-compliance': 'governance and compliance: policies vs standards vs procedures vs guidelines, regulatory frameworks (GDPR, HIPAA, PCI DSS, SOX), industry standards (ISO 27001, NIST CSF), oversight and the role of the CISO',
  'asset-and-change-management': 'asset and change management: building the asset inventory, data classification and ownership, change-control workflows and the CAB, and managing SCADA / ICS, IoT and legacy systems',
  'audits-and-assessments': 'audits and assessments: internal vs external audits, vulnerability scans vs penetration tests, attestation of compliance, findings and remediation tracking',
  'cyber-resilience': 'cyber resilience and redundancy: business continuity and disaster recovery planning, backup types and rotation schemes, RAID, MTTR / MTBF / RTO / RPO, and hot / warm / cold recovery sites',
  'security-architecture': 'security architecture: defense-in-depth, zero trust, network segmentation and the DMZ, SDN, SASE / SD-WAN, and securing cloud, containerized and embedded environments',
  'security-infrastructure': 'security infrastructure: firewalls and NGFWs, IDS / IPS placement, proxies and WAFs, SIEM, SOAR, EDR / XDR, honeypots and deception technology, VPNs and secure gateways',
  'identity-and-access-management': 'identity and access management: authentication factors and MFA, federation (SAML, OAuth, OpenID), LDAP and Kerberos, SSO, privileged access management, and access-control models (DAC, MAC, RBAC, ABAC)',
  'vulnerabilities-and-attacks': 'vulnerabilities and attacks: SQL injection and cross-site scripting, buffer overflows, race conditions, zero-days, CVE / CVSS scoring, and attack-surface management',
  'malicious-activity': 'malicious activity: brute force and password spraying, spoofing and on-path attacks, downgrade and relay attacks, pass-the-hash, DoS / DDoS, and persistence techniques',
  'hardening': 'hardening: baseline configurations, patch management, endpoint and server hardening, disabling unused services and ports, sandboxing, air gaps, and end-of-life system risk',
  'security-techniques': 'security techniques: least privilege, separation of duties, job rotation, mandatory vacations, access reviews, and need-to-know',
  'vulnerability-management': 'vulnerability management: scan cadence, credentialed vs non-credentialed scans, penetration-test rules of engagement, bug bounties, and remediation verification',
  'alerting-and-monitoring': 'alerting and monitoring: baselines and threshold tuning, syslog and SIEM aggregation, NetFlow and packet capture, SNMP polling, and managing alert fatigue',
  'incident-response': 'incident response: preparation through lessons learned, containment / eradication / recovery, severity levels, playbooks, and exercising plans with tabletop simulations',
  'investigating-an-incident': 'digital forensics: evidence acquisition and the order of volatility, chain of custody, memory and disk imaging, and building a forensic timeline',
  'automation-and-orchestration': 'automation and orchestration: scripting and API-driven workflows, CI/CD pipeline security, SOAR playbooks, and machine-learning-assisted detection',
  'security-awareness': 'security awareness: role-based training programs, phishing simulations, onboarding and continuous education, and measuring program effectiveness',
  'exam-readiness': 'exam readiness: full practice-exam strategy, timing and pacing, reviewing weak objectives, and final-week preparation',
  'conclusion': 'course wrap-up: certification logistics, what to do after passing Security+, and career pathway guidance',
};
const TOPIC_TITLE = {};
for (const s of Object.keys(COVERAGE)) {
  TOPIC_TITLE[s] = s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}
TOPIC_TITLE['exam-tips'] = 'Exam Tips';
TOPIC_TITLE['identity-and-access-management'] = 'Identity and Access Management';
TOPIC_TITLE['third-party-vendor-risks'] = 'Third-Party Vendor Risks';

// sections whose pages are known-broken in the source (all get rewritten regardless)
const sections = [];
for (const f of fs.readdirSync(DIR)) {
  const m = f.match(/^SY0-701-exam-simulator-(\d+)-(.+)\.html$/);
  if (m) sections.push({ num: parseInt(m[1], 10), slug: m[2] });
}
sections.sort((a, b) => a.num - b.num);

let fixed = 0, ok = 0;
for (const s of sections) {
  const nn = s.num === 0 ? '00' : String(s.num);
  const desc = COVERAGE[s.slug];
  if (!desc) { console.error('no description for', s.slug); continue; }
  const title = TOPIC_TITLE[s.slug];

  // --- simulator page ---
  const simFile = path.join(DIR, `SY0-701-exam-simulator-${nn}-${s.slug}.html`);
  let html = fs.readFileSync(simFile, 'utf8');
  const simRe = /(<p><b style="color:var\(--text\)">This mimics real exam conditions, unlike the practice quiz\.<\/b> )[\s\S]*?( Question styles match CompTIA:)/;
  const simNew = html.replace(simRe, `$1A completely new question set covering ${desc}.$2`);
  if (simNew !== html) { fs.writeFileSync(simFile, simNew); fixed++; } else ok++;

  // --- feedback page ---
  const fbFile = path.join(DIR, `SY0-701-practice-exam-feedback-${nn}.html`);
  html = fs.readFileSync(fbFile, 'utf8');
  const fbRe = /A completely new question set on [^<]*\./;
  const m2 = html.match(fbRe);
  if (m2 && !m2[0].includes(title)) {
    fs.writeFileSync(fbFile, html.replace(fbRe, `A completely new question set on ${title}.`));
    fixed++;
  } else ok++;
}
console.log(`descriptions fixed: ${fixed}, already correct: ${ok}`);
