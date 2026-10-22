// Builds the three exam pages for Section 02 — Security Fundamentals
//   (lectures 04-16 of the course), all tagged sec:'security-fundamentals':
//   1. SY0-701-exam-simulator-1-security-fundamentals.html  (17 q, mixed incl. match + order)
//   2. SY0-701-practice-exam-feedback-1.html                (12 q, graded feedback)
//   3. SY0-701-final-exam-security-fundamentals.html        (15 scenario questions)
// Run: node build-section-fundamentals.js   (idempotent — rebuilds from template)
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'exam-simulator');
const SEC = 'security-fundamentals';

// ---------- question banks ----------
const SIM = [
  { type: 'mcq', q: "An ISP ships home routers with a long random Wi-Fi password printed on the device, and most customers immediately change it to something simple like 'magic2912'. What security principle does this illustrate?",
    options: ["Security and usability are always at odds, and users bypass controls that are too painful",
      "Random passwords are inherently insecure",
      "ISPs should never ship preconfigured devices",
      "Writing passwords down is a compensating control"],
    answer: 0,
    why: "The core tension of security: make something more secure and it becomes less usable; make it more convenient and it becomes less secure. Users will actively bypass painful controls, so you design for the sweet spot." },
  { type: 'mcq', q: "A company encrypts its customer database so the data itself stays protected no matter which device holds it. Which discipline is this?",
    options: ["Information system security", "Information security", "Operational security", "Physical security"],
    answer: 1,
    why: "Information security protects the data/information itself. Information system security protects the systems (servers, network devices) that hold and process the data. Encryption of the data = information security." },
  { type: 'mcq', q: "An unpatched flaw in a web server allows an attacker to take it over. In risk terms, the unpatched flaw is the ______ and the attacker is the ______.",
    options: ["threat; vulnerability", "vulnerability; threat", "risk; control", "control; risk"],
    answer: 1,
    why: "A vulnerability is a weakness that could be exploited. A threat is any activity or event with the potential to cause harm. The threat exploits the vulnerability, creating risk." },
  { type: 'multi', pick: 3, q: "Which of the following are methods of achieving confidentiality? (Select THREE.)",
    options: ["Encryption", "Data masking", "Load balancing", "Physical security controls", "Redundant power supplies"],
    answer: [0, 1, 3],
    why: "The course's five confidentiality methods: encryption, access controls, data masking, physical security, and training/awareness. Load balancing and redundant power support availability, not confidentiality." },
  { type: 'mcq', q: "A software vendor publishes a file along with its SHA-256 value so customers can verify the download was not altered. Which pillar of security (and which method) does this serve?",
    options: ["Confidentiality — encryption", "Integrity — hashing", "Availability — redundancy", "Non-repudiation — auditing"],
    answer: 1,
    why: "A hash fingerprint proves the file was not changed or corrupted — that is integrity. Hashing, digital signatures, checksums, access controls, and audits are the five integrity methods." },
  { type: 'mcq', q: "A cloud provider advertises 'five nines' of availability. Approximately how much downtime per year does that allow?",
    options: ["8.76 hours", "52.56 minutes", "5.26 minutes", "3.65 days"],
    answer: 2,
    why: "Five nines = 99.999% uptime = about 5.26 minutes of downtime per year. (Three nines = 8.76 hours; four nines = 52.56 minutes.)" },
  { type: 'mcq', q: "An organization maintains a fully equipped second data center in another city that can take over operations if the primary site fails. Which type of redundancy is this?",
    options: ["Hardware redundancy", "Software redundancy", "Data redundancy", "Geographic (site) redundancy"],
    answer: 3,
    why: "A second site in a different location is geographic/site redundancy. The four types are geographic, hardware, software, and data redundancy." },
  { type: 'mcq', q: "A digitally signed email is the classic example of which security concept?",
    options: ["Confidentiality", "Integrity", "Non-repudiation", "Availability"],
    answer: 2,
    why: "Non-repudiation guarantees an action took place and cannot be denied by the parties involved — the sender cannot deny sending a digitally signed message. It relies on integrity (the signature) to work." },
  { type: 'multi', pick: 3, q: "Which of the following are valid authentication factors? (Select THREE.)",
    options: ["Something you know", "Something you have", "Something you approve", "Something you are", "Something you configure"],
    answer: [0, 1, 3],
    why: "The five factors: something you know (password/PIN), something you have (smart card/token/phone), something you are (biometrics), something you do (behavior), and somewhere you are (location). 'Approve' and 'configure' are not factors." },
  { type: 'mcq', q: "A user logs in with a password and then types a code sent to their phone. Which statement is correct?",
    options: ["This is single-factor authentication because a password was used",
      "This is MFA because it combines two different factor categories — something you know and something you have",
      "This is MFA because two passwords were used",
      "This is not MFA because SMS codes are insecure"],
    answer: 1,
    why: "MFA requires two or more factors from DIFFERENT categories. Password (know) + phone code (have) = two categories = MFA. Two things from the same category (password + security question) would not be." },
  { type: 'mcq', q: "On a file server, the owner of a shared folder decides who else may read and write it. Which authorization model is in use?",
    options: ["Mandatory Access Control (MAC)", "Discretionary Access Control (DAC)", "Role-Based Access Control (RBAC)", "Rule-based access control"],
    answer: 1,
    why: "In DAC the resource OWNER decides who gets access. In MAC the system labels decide (users cannot change permissions); in RBAC permissions attach to roles; rule-based rules apply to everyone." },
  { type: 'mcq', q: "A hospital assigns permissions to job functions — 'Nurse', 'Physician', 'Billing' — and every account inherits the permissions of its assigned function. Which model is this?",
    options: ["MAC", "DAC", "ABAC", "RBAC"],
    answer: 3,
    why: "Role-Based Access Control attaches permissions to roles; joining a role grants its permissions. It simplifies administration when many users share the same job function." },
  { type: 'multi', pick: 2, q: "Which tools are commonly used for accounting — tracking user activity and resource utilization? (Select TWO.)",
    options: ["Syslog", "Firewall", "Wireshark", "SIEM", "Antivirus"],
    answer: [0, 3],
    why: "The course's accounting tools: Syslog (centralized logs), Wireshark (packet analysis), and SIEM (log correlation and alerting). A firewall is a preventive control and antivirus is detection/correction — not accounting tools." },
  { type: 'match', q: "Match each security control TYPE to the course's example of it.",
    terms: ["Preventative", "Deterrent", "Detective", "Corrective"],
    defs: ["A locked door that stops unauthorized entry before it happens",
      "A burglar-alarm sign in the window that discourages a break-in attempt",
      "The burglar alarm itself, which identifies a break-in as it happens",
      "Antivirus software quarantining an infected file after detection"],
    answer: [0, 1, 2, 3],
    why: "Preventative stops the incident (lock, firewall); deterrent discourages the attempt (sign, warning banner); detective discovers it (alarm, IDS); corrective restores afterwards (quarantine, restore from backup)." },
  { type: 'mcq', q: "In a Zero Trust architecture, which component sits in the DATA plane and makes the allow/deny decision at the resource itself?",
    options: ["The policy engine", "The policy administrator", "The policy enforcement point (PEP)", "Adaptive identity"],
    answer: 2,
    why: "The data plane consists of the subject/system and the policy enforcement point, which executes the decision at the resource. The policy engine and policy administrator belong to the control plane, which defines the policies." },
  { type: 'order', q: "Order the four steps of a gap analysis, from first to last.",
    items: ["Document the current state against baselines",
      "Define the desired state",
      "Identify the gaps between the two",
      "Create a remediation plan (POA&M)"],
    why: "Gap analysis: measure where you are against a baseline, define where you want to be, find the difference, then write a Plan of Action & Milestones to close it." },
  { type: 'mcq', q: "A factory cannot upgrade a legacy controller to support modern encryption, so it tunnels all its traffic through a VPN instead. The VPN tunnel is an example of which control type?",
    options: ["Preventative", "Directive", "Compensating", "Deterrent"],
    answer: 2,
    why: "A compensating control is the alternative measure used when the primary control is not feasible — here, the VPN compensates for the legacy system's inability to do modern encryption." },
];

const FEEDBACK = [
  { type: 'mcq', q: "Ensuring information is accessible only to authorized parties defines which pillar of the CIA triad?",
    options: ["Confidentiality", "Integrity", "Availability", "Non-repudiation"],
    answer: 0,
    why: "Confidentiality = only authorized parties can access the information. Integrity = data stays accurate/unaltered. Availability = accessible when needed. Non-repudiation sits outside the classic triad." },
  { type: 'multi', pick: 3, q: "Which are methods of ensuring integrity? (Select THREE.)",
    options: ["Hashing", "Digital signatures", "Data masking", "Checksums", "Tokenization"],
    answer: [0, 1, 3],
    why: "Integrity methods: hashing, digital signatures, checksums, access controls (who may modify), and audits. Masking and tokenization are confidentiality methods." },
  { type: 'mcq', q: "A service level of 99.9% ('three nines') allows roughly how much downtime per year?",
    options: ["5.26 minutes", "52.56 minutes", "8.76 hours", "3.65 days"],
    answer: 2,
    why: "Three nines = 99.9% = 8.76 hours/year. Four nines = 52.56 minutes; five nines = 5.26 minutes; two nines = 3.65 days." },
  { type: 'mcq', q: "RAID arrays, spare power supplies, and hot-swappable drives are all examples of which redundancy type?",
    options: ["Geographic redundancy", "Hardware redundancy", "Software redundancy", "Data redundancy"],
    answer: 1,
    why: "Spare physical components ready to take over are hardware redundancy. RAID also provides fault tolerance for disks specifically." },
  { type: 'mcq', q: "A company posts a warning that premises are monitored 24/7. The WARNING SIGN itself is which type of control?",
    options: ["Preventative", "Deterrent", "Detective", "Corrective"],
    answer: 1,
    why: "The sign discourages an attack from being attempted — a deterrent. (The alarm behind it would be the detective control.) Course trap: sign = deterrent, alarm = detective." },
  { type: 'mcq', q: "After detecting an infection, antivirus software isolates the malicious file so it can do no further harm. Isolating/quarantining the file is which control type?",
    options: ["Preventative", "Detective", "Corrective", "Directive"],
    answer: 2,
    why: "Corrective controls restore or fix after an incident. Quarantining an infected file is the course's example of a corrective control." },
  { type: 'mcq', q: "An acceptable use policy (AUP) telling employees what they may and may not do on company systems is which control type?",
    options: ["Managerial", "Directive", "Compensating", "Operational"],
    answer: 1,
    why: "Directive controls direct or guide behavior — policies, signage, procedures. (AUP is the course's example. 'Managerial' is a category, not a type.)" },
  { type: 'mcq', q: "Which control type describes an alternative safeguard used when the primary control cannot be implemented?",
    options: ["Compensating", "Deterrent", "Preventative", "Detective"],
    answer: 0,
    why: "Compensating controls stand in for the primary control when it isn't feasible — e.g., a VPN tunnel protecting a legacy system that can't do modern encryption." },
  { type: 'multi', pick: 3, q: "Which of the following are recognized authorization models? (Select THREE.)",
    options: ["Mandatory Access Control (MAC)", "Discretionary Access Control (DAC)", "Reputational access control", "Role-Based Access Control (RBAC)", "Time-based access control"],
    answer: [0, 1, 3],
    why: "The five models: MAC (system labels), DAC (owner decides), RBAC (permissions attach to roles), ABAC (attributes), and rule-based. 'Reputational' and 'time-based' are made up." },
  { type: 'mcq', q: "In the correct order, the AAAs of security are:",
    options: ["Accounting → Authentication → Authorization", "Authentication → Authorization → Accounting", "Authorization → Accounting → Authentication", "Authentication → Accounting → Authorization"],
    answer: 1,
    why: "First verify WHO you are (authentication), then decide WHAT you may do (authorization), then track WHAT you did (accounting)." },
  { type: 'mcq', q: "The modern extension of the CIA triad is the C.I.A.N.A pentagon. What do the two extra letters stand for?",
    options: ["Notification and Alerting", "Non-repudiation and Authentication", "Networking and Administration", "Normalization and Anonymization"],
    answer: 1,
    why: "C.I.A.N.A = Confidentiality, Integrity, Availability, Non-repudiation, Authentication. The AAAs flow directly from this model." },
  { type: 'mcq', q: "The final deliverable of a gap analysis — the document listing what will be fixed, by whom, and by when — is called a:",
    options: ["Risk register", "Plan of Action & Milestones (POA&M)", "Acceptable use policy", "Baseline configuration"],
    answer: 1,
    why: "A POA&M is the remediation plan produced by a gap analysis: current state vs desired state, the identified gaps, and the milestones to close them." },
];

const FINAL = [
  { type: 'mcq', q: "Scenario: A healthcare network needs to guarantee that a physician who issues a medication order cannot later deny issuing it, and that the order cannot be altered in transit. Which solution BEST satisfies both requirements?",
    options: ["Store the orders in an encrypted database", "Digitally sign each order", "Require MFA for physician logins", "Mirror the order database to a second site"],
    answer: 1,
    why: "A digital signature provides non-repudiation (the signer cannot deny it) built on integrity (any alteration invalidates the signature). Encryption alone protects confidentiality; MFA proves identity at login but does not bind the sender to the message." },
  { type: 'mcq', q: "Scenario: Your SLA commits to 99.99% uptime for a customer portal. Over a full year, what is the MAXIMUM total downtime you can experience without breaching the SLA?",
    options: ["About 8.76 hours", "About 52.56 minutes", "About 5.26 minutes", "About 3.65 days"],
    answer: 1,
    why: "Four nines (99.99%) = 52.56 minutes per year. Know the table: 99% = 3.65 days, 99.9% = 8.76 hours, 99.99% = 52.56 minutes, 99.999% = 5.26 minutes." },
  { type: 'mcq', q: "Scenario: A plant's legacy controller cannot support modern encryption and cannot be replaced this year. As a workaround, the security team routes all controller traffic through an encrypted VPN tunnel. How should this VPN be classified?",
    options: ["A preventative control, because it encrypts", "A compensating control, because it substitutes for the control the legacy system cannot implement", "A directive control, because it directs traffic", "A deterrent control, because attackers see the tunnel"],
    answer: 1,
    why: "When the primary control (modern encryption on the device) is not feasible, the alternative safeguard is compensating — the course's own example." },
  { type: 'mcq', q: "Scenario: During a Zero Trust rollout review, an architect asks where the policy enforcement point (PEP) lives and what it does. Which answer is correct?",
    options: ["It sits in the control plane and writes access policies", "It sits in the data plane and executes the allow/deny decision at the resource", "It sits in the data plane and defines adaptive identity", "It sits in the control plane alongside the policy engine"],
    answer: 1,
    why: "The data plane = subject/system + the PEP, which enforces the decision. The control plane (adaptive identity, threat scope reduction, policy-driven access control, secured zones) uses the policy engine and policy administrator to DECIDE." },
  { type: 'mcq', q: "Scenario: A bank requires a password plus a fingerprint scan to open its vault application. Which statement BEST analyzes this design?",
    options: ["It is single-factor because only one login event occurs",
      "It is MFA because it combines something you know with something you are — two different factor categories",
      "It is MFA because biometrics are always the second factor",
      "It is two-factor but not MFA, since fingerprints are behavioral"],
    answer: 1,
    why: "Password = something you know; fingerprint = something you are. Two different categories = MFA. (Something you DO — typing cadence — would be the behavioral factor.)" },
  { type: 'mcq', q: "Scenario: When an employee moves from the Sales department to Engineering, her access changes automatically because permissions belong to departmental roles rather than to her account. Which authorization model is the company using, and what is the main benefit?",
    options: ["DAC — the user owns her files", "MAC — labels prevent all changes", "RBAC — permissions attach to roles, so access follows the job function and administrative effort drops", "Rule-based — one rule governs every transfer"],
    answer: 2,
    why: "Role-Based Access Control assigns permissions to roles; switching roles switches permissions automatically, which is exactly the administration-simplification scenario described." },
  { type: 'mcq', q: "Scenario: After a suspected insider incident, a security manager pulls centralized logs and correlates them across the network to reconstruct exactly what a specific user account did, minute by minute. Which AAA is the manager performing, and which tool category is most appropriate?",
    options: ["Authorization — firewall rules", "Accounting — a SIEM", "Authentication — biometrics", "Non-repudiation — hashing"],
    answer: 1,
    why: "Tracking what users did is accounting. A SIEM aggregates and correlates logs (Syslog feeds, etc.) to reconstruct activity — far more practical than reading individual logs by hand." },
  { type: 'mcq', q: "Scenario: An auditor measures your current security posture against industry baselines, compares it to the posture your regulator expects, and hands you a prioritized list of missing controls with owners and deadlines. Which process produced this deliverable?",
    options: ["A risk transfer exercise", "A gap analysis ending in a POA&M", "A penetration test", "An access review"],
    answer: 1,
    why: "Document current state vs baseline, define the desired state, identify gaps, and produce a Plan of Action & Milestones — the four steps of a gap analysis." },
  { type: 'mcq', q: "Scenario: A user downloads a vendor's installer, computes its hash, and finds it does not match the hash published on the vendor's site. Which security concern has the hash check revealed, and which pillar does it protect?",
    options: ["A confidentiality failure — the file should be re-encrypted", "An integrity failure — the file differs from what the vendor published and must not be installed", "An availability failure — the server was slow", "An authentication failure — the user needs MFA"],
    answer: 1,
    why: "A changed hash means the file's contents changed — the integrity pillar. Hashing is one of the five integrity methods; it says nothing about who can read the file." },
  { type: 'mcq', q: "Scenario: A support dashboard displays customer card numbers, but policy says agents only ever need the last four digits. The team updates the dashboard to show only 'XXXX-XXXX-XXXX-4821'. Which confidentiality method is this?",
    options: ["Encryption", "Hashing", "Data masking", "Geographic redundancy"],
    answer: 2,
    why: "Showing only part of the data (last 4 digits) is data masking — one of the five confidentiality methods alongside encryption, access controls, physical security, and training." },
  { type: 'multi', pick: 3, q: "Scenario: A warehouse wants to discourage break-ins without spending on a monitoring team. Which controls are DETERRENTS? (Select THREE.)",
    options: ["A sign warning that the site is alarmed", "Perimeter lighting", "A fence with barbed wire", "An IDS alerting on motion", "A backup generator"],
    answer: [0, 1, 2],
    why: "Deterrents discourage the attempt: warning signs, lighting, fences, visible guards/cameras. The IDS is detective; the generator supports availability." },
  { type: 'mcq', q: "Scenario: A flood takes your primary data center offline, but services fail over to a fully equipped second site in another region within minutes and customers notice nothing. Which two concepts does this demonstrate?",
    options: ["Data masking and confidentiality", "Geographic redundancy and availability", "Compensating controls and deterrence", "Accounting and integrity"],
    answer: 1,
    why: "A second site in another region = geographic (site) redundancy; seamless continued service = availability. Redundancy is one of the key availability mechanisms alongside fault tolerance, RAID, clustering, and load balancing." },
  { type: 'multi', pick: 4, q: "Scenario: A startup wants to maximize the availability of its flagship web application. Which measures directly support availability? (Select FOUR.)",
    options: ["Load balancing across multiple servers", "Data backups", "Fault-tolerant hardware with RAID", "Data masking of user records", "A UPS with a backup generator", "An acceptable use policy"],
    answer: [0, 1, 2, 4],
    why: "Availability mechanisms: the four redundancy types, fault tolerance, RAID, clustering, load balancing, backups, and clean power (UPS/generator). Masking is confidentiality; an AUP is a directive control." },
  { type: 'mcq', q: "Scenario: An employee receives a convincing email asking them to wire money to a 'vendor' and, busy and distracted, complies. No malware was involved. How should this incident be categorized at the highest level?",
    options: ["A natural threat", "An intentional (man-made) threat executed through social engineering", "An unintentional threat", "A vulnerability, not a threat"],
    answer: 1,
    why: "Threats are natural, intentional, or unintentional. A deliberate attacker tricking a human is an intentional/man-made threat — the human weakness the attacker exploited is the vulnerability." },
  { type: 'mcq', q: "Scenario: In a Zero Trust design review, a colleague says: 'Once the subject's identity is verified, the component that cross-references the access request against the organization's predefined policies is the ______.' Fill in the blank.",
    options: ["policy enforcement point", "policy engine", "secured zone", "subject/system"],
    answer: 1,
    why: "The policy engine works like a rule book, checking each request against predefined policies; the policy administrator manages those policies. Both serve the control plane; the PEP in the data plane executes the outcome." },
];

// ---------- template surgery (same approach as build-comptia-exams.js) ----------
const template = fs.readFileSync(path.join(DIR, 'SY0-701-mega-exam-v1-realistic.html'), 'utf8');

function replaceOnce(haystack, from, to) {
  if (from instanceof RegExp) {
    if (!from.test(haystack)) { console.error('MISSING PATTERN:', String(from).slice(0, 60)); return haystack; }
    return haystack.replace(from, () => to);
  }
  const i = haystack.indexOf(from);
  if (i < 0) { console.error('MISSING PATTERN:', from.slice(0, 60)); return haystack; }
  return haystack.slice(0, i) + to + haystack.slice(i + from.length);
}
function fmtTime(s) {
  const m = Math.floor(s / 60), r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}
function build(cfg, bank) {
  const clean = bank.map(q => ({ ...q, sec: SEC }));
  let html = template;
  const secs = clean.length * 90;
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${cfg.title}</title>`);
  html = replaceOnce(html, '<div class="badge">CompTIA Security+ SY0-701 · FINAL EXAM · Official Style</div>', `<div class="badge">${cfg.badge}</div>`);
  html = replaceOnce(html, '<h1>Full-Course Mega Exam V1 — Exam-Level</h1>', `<h1>${cfg.h1}</h1>`);
  html = replaceOnce(html, /<p><b style="color:var\(--text\)">This full-course capstone[\s\S]*?Pass this comfortably before attempting V2\.<\/p>/, `<p>${cfg.desc}</p>`);
  html = replaceOnce(html, /<b id="fact-q">\d+<\/b>/, `<b id="fact-q">${clean.length}</b>`);
  html = replaceOnce(html, /<b id="fact-t">[\d:]+<\/b>/, `<b id="fact-t">${fmtTime(secs)}</b>`);
  html = replaceOnce(html, 'Begin Final Exam', cfg.begin);
  html = replaceOnce(html, 'Retake Final Exam', cfg.retake);
  html = replaceOnce(html, '<div class="badge">Final Exam Score Report</div>', `<div class="badge">${cfg.report}</div>`);
  html = replaceOnce(html, /\/\* =+[\s\S]*?=+ \*\//, `/* ============================================================\n   ${cfg.comment}\n   ============================================================ */`);
  // replace EXAM array — robust bracket matching (template may minify EXAM to one line)
  const aStart = html.indexOf('const EXAM = [');
  const arrStart = html.indexOf('[', aStart);
  let depth = 0, aEnd = -1, inStr = false, quote = '', esc = false;
  for (let i = arrStart; i < html.length; i++) {
    const c = html[i];
    if (inStr) {
      if (esc) { esc = false; continue; }
      if (c === '\\') { esc = true; continue; }
      if (c === quote) inStr = false;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = true; quote = c; continue; }
    if (c === '[') depth++;
    if (c === ']') { depth--; if (depth === 0) { aEnd = i; break; } }
  }
  if (aEnd < 0) { console.error('EXAM array end not found for', cfg.file); process.exit(1); }
  html = html.slice(0, aStart) + 'const EXAM = ' + JSON.stringify(clean, null, 1) + ';' + html.slice(aEnd + 1);
  fs.writeFileSync(path.join(DIR, cfg.file), html);
  const types = {};
  clean.forEach(q => types[q.type] = (types[q.type] || 0) + 1);
  console.log(`${cfg.file}: ${clean.length} questions ${JSON.stringify(types)}`);
}

build({
  file: 'SY0-701-exam-simulator-1-security-fundamentals.html',
  title: 'Security+ SY0-701 — Section Simulator · Security Fundamentals',
  badge: 'CompTIA Security+ SY0-701 · SECTION 02 · Security Fundamentals',
  h1: 'Security Fundamentals — Section Simulator',
  desc: 'A quick check of the <b style="color:var(--text)">Section 02 fundamentals</b>: CIA/C.I.A.N.A, the AAAs, authentication factors, control categories and types, Zero Trust and gap analysis. 17 questions including matching and ordering formats, with full explanations.',
  begin: 'Begin Section Check', retake: 'Retake Section Check',
  report: 'Section Simulator Score Report',
  comment: 'SECTION 02 SIMULATOR — SECURITY FUNDAMENTALS (lectures 04-16): 17 mixed-format questions (mcq, multi, match, order).',
}, SIM);

build({
  file: 'SY0-701-practice-exam-feedback-1.html',
  title: 'Security+ SY0-701 — Feedback Exam · Security Fundamentals',
  badge: 'CompTIA Security+ SY0-701 · FEEDBACK EXAM · Security Fundamentals',
  h1: 'Security Fundamentals — Feedback Exam',
  desc: 'A graded <b style="color:var(--text)">feedback exam for Section 02</b> — 12 questions across all thirteen fundamentals lectures. Every attempt feeds your Analytics page, so take it early and retake often to track readiness.',
  begin: 'Begin Feedback Exam', retake: 'Retake Feedback Exam',
  report: 'Feedback Exam Score Report',
  comment: 'FEEDBACK EXAM 1 — SECURITY FUNDAMENTALS: 12 graded questions covering lectures 04-16. Results flow to Analytics.',
}, FEEDBACK);

build({
  file: 'SY0-701-final-exam-security-fundamentals.html',
  title: 'Security+ SY0-701 — Final Exam · Security Fundamentals',
  badge: 'CompTIA Security+ SY0-701 · SECTION FINAL · Security Fundamentals',
  h1: 'Security Fundamentals — Section Final Exam',
  desc: 'The <b style="color:var(--text)">Section 02 final</b>: 15 scenario-based questions in CompTIA style, drawn from all thirteen fundamentals lectures — controls classification, the AAAs, Zero Trust planes, availability math and gap analysis. Pass this before moving deeper into the course.',
  begin: 'Begin Final Exam', retake: 'Retake Final Exam',
  report: 'Final Exam Score Report',
  comment: 'SECTION 02 FINAL EXAM — SECURITY FUNDAMENTALS: 15 scenario questions, CompTIA-style, lectures 04-16.',
}, FINAL);

console.log('done');
