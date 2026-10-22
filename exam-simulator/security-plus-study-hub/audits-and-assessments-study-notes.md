# Audits and Assessments — SY0-701 Study Notes (Section 13 · OBJ 5.5)

Exam weighting: Domain 5 (Security Program Management & Oversight). Objective 5.5: *explain the types and purposes of audits and assessments.* This section is heavily tested — the audit-vs-assessment distinction, penetration testing types, and reconnaissance categories are perennial exam favorites.

---

## 1. Audits vs. Assessments — the core distinction (Lesson 113)

| | **Audit** | **Assessment** |
|---|---|---|
| What | Systematic evaluation of information systems, applications, and security controls to ascertain their **efficiency and effectiveness** | Detailed analysis of systems to **identify vulnerabilities and risks** |
| Who | Typically an **independent entity** (for unbiased view) | Performed before implementing new systems or major changes |
| Goal | Verify controls work and compliance is met; identify gaps in policies, procedures, controls | Understand potential risks/threats and **propose mitigation strategies** |
| Output | Findings on compliance & control effectiveness | Prioritized risks and recommended fixes |

- Audits can be **internal** (org's own audit team) or **external** (third party).
- **Assessment types:** risk assessments, vulnerability assessments, threat assessments.

### Regulations you'll see constantly in this objective
- **GDPR** — General Data Protection Regulation (EU, all industries)
- **HIPAA** — Health Insurance Portability and Accountability Act (healthcare)
- **PCI DSS** — Payment Card Industry Data Security Standard (credit card handlers)
- (Later: GLBA, Sarbanes-Oxley appear in attestation context)

---

## 2. Internal Audits and Assessments (Lesson 114)

**Internal audit** = systematic evaluation by the organization's *own* audit team:
- Assesses effectiveness of **internal controls**, compliance with regulations, integrity of systems/processes.
- Focus areas: data protection, network security, access controls, incident response procedures.
- Example: password policy audit (complexity, rotation, actual employee adherence); user access control audit (least privilege, segregation of duties, prompt revocation on termination/role change, testing with a limited account).
- Frequency: often **quarterly or annually**, driven by industry compliance requirements.

**Key concepts:**
- **Compliance** — ensuring systems/practices adhere to standards, regulations, laws. May be *legally required*, which is why internal audits are mandatory in some industries.
- **Audit committee** — group (typically board members) that **oversees audit and compliance activities**: reviews financial reporting and internal controls, oversees internal/external audit performance, ensures legal/regulatory compliance, addresses issues raised by auditors.

**Internal assessment** = in-depth analysis to identify/evaluate risks & vulnerabilities:
- Often done **before** new systems launch or significant changes.
- Mostly **self-assessments** (internal evaluations against specific standards) — great for finding compliance gaps *before* formal audits.
- Large orgs may have a **dedicated internal assessment group** that travels the enterprise.

**The four-step internal assessment flow** (know this order):
1. **Threat modeling** — identify potential threats (SQLi, XSS, DoS…)
2. **Vulnerability assessment** — automated tools + manual testing for known vulns
3. **Risk assessment** — likelihood, impact, cost of controls
4. **Recommend mitigation strategies** — code fixes, new controls, architecture changes

---

## 3. Internal Self-Assessment Checklist (Lesson 115)

- Demo used the **MCIT Cybersecurity Self-Assessment Checklist** (Minnesota Counties Intergovernmental Trust) — format: series of **Yes/No questions** + comments, action items, and **who each action is assigned to**.
- Every action item must be **assigned to a specific individual or group** for follow-up — accountability is the point.
- Work on it **as a cross-functional group**: administration, IT staff, cybersecurity professionals.
- Typical questions cover: incidents in past 12 months, incident response plan, business continuity plan (vital operations inventory, essential hardware/software inventory, third-party agreements), antivirus on every device + up to date, mobile device policy + training.
- Checklists give a **quick overview of current risk posture** — they don't fix anything by themselves.

---

## 4. External Audits and Assessments (Lesson 116)

**External audit** = systematic evaluation by an **independent third party**:
- Provides an **objective, unbiased** view of the true security posture.
- Example: financial institution hiring an external auditor for **PCI DSS** compliance quarterly/annually — auditor reviews the cardholder data environment, firewalls, encryption, access controls.
- Regulations like **GDPR and PCI DSS require regular independent third-party audits** — this validation builds trust with customers, stakeholders, regulators.

**External assessment** = detailed analysis by independent entity(es) to find vulnerabilities/risks — automated scanning + manual testing; can be risk/vulnerability/threat assessments.
- Example: healthcare org engaging a firm to vulnerability-assess its EHR system for HIPAA compliance.

**Regulatory compliance** — the goal of being aware of and complying with relevant laws/policies/regulations:
- Increasingly achieved via **consolidated, harmonized control sets** — e.g., using the **NIST Cybersecurity Framework** as the umbrella mechanism while mapping individual regulations inside it.
- Industry-specific: HIPAA (healthcare), PCI DSS (cards); general: GDPR.

**Examinations** — detailed external inspections of security infrastructure:
- Cover network security, data protection, access controls — much like an assessment.
- **Plus:** standardized **testing of key personnel** (knowledge exams, current certifications).
- Example: **nuclear power plants — examinations every 1–5 years**; computer networks, ICS/SCADA equipment, and operational procedures are examined; employees must pass knowledge-based exams to maintain authority to operate.
- Most cybersecurity pros will never face an examination — they'll undergo typical assessments. It depends on your industry.

**Independent third-party audits** — crucial component of cybersecurity strategy:
- Unbiased perspective; catch weaknesses internal teams overlook.
- Validate security measures → build trust.
- **Required by many regulations** (GDPR, PCI DSS) as part of compliance.

---

## 5. External Assessment in Practice — HIPAA (Lesson 117)

- Demo: San Bernardino County **HIPAA Audit Checklist**.
- You answer **Yes/No** and **provide a link to evidence** (file on a share drive or portal like Dropbox/Google Drive/OneDrive).
- Some items: "identify applicable industry guidance" — answer Yes/No, **no documentation needed**, just identify the reference material.
- HIPAA checklist categories: General Governance, **Administrative Safeguards** (entity-level risk assessment, risk management policy), **Physical Safeguards** (physical security policies, data destruction/media reuse procedures, role-based access lists, employee PHI access logs), **Technical Safeguards** (encryption policies, internal audit policies on IT safeguards, system-generated user access listings), Privacy section, and **HITECH** capabilities.
- **HITECH** = Health Information Technology for Economic and Clinical Health Act — created to motivate implementation of **electronic health records** and supporting tech in the US.
- Key exam takeaway: **audits/assessments don't FIX security issues — they VALIDATE** that you meet a compliance level, to minimize attack surface and prove readiness against known threats.

---

## 6. Penetration Testing (Lesson 118)

**Penetration testing (pentest / ethical hacking)** = simulated cyber attack against a system, network, or web app to find exploitable vulnerabilities. Goal: identify and fix vulnerabilities **before malicious actors exploit them** — not to cause damage.

**Four types (memorize the mapping):**

| Type | Also known as | What it does |
|---|---|---|
| **Physical** | — | Tests locks, access cards, cameras; tailgating, badge cloning. Benefits: find physical vulns, raise security awareness, prevent unauthorized access. |
| **Offensive** | **Red Teaming** | Actively seeks vulns and exploits them like a real attacker. Proactive/aggressive. Benefits: simulate real attacks for defenders; **garner funding** by demonstrating how vulnerable systems are. |
| **Defensive** | **Blue Teaming** | Reactive: strengthen systems, detect/respond to attacks, improve incident response times. |
| **Integrated** | **Purple Teaming** | Red + Blue together in one engagement. Red attacks; Blue detects/responds. If Blue catches it → Red goes more advanced. If Blue misses it → Red **walks Blue through the attack** and how to configure sensors to detect it. Promotes collaboration. |

---

## 7. Reconnaissance in Pentesting (Lesson 119)

**Reconnaissance** = the initial phase where the attacker gathers as much information as possible about the target (IP addresses, domain details, mail servers, detection systems) to plan the attack and increase success rate — like a thief casing a home.

**Two types:**
- **Active** — directly engages the target: ping, port scans, connection attempts. More information, **higher risk of detection** (e.g., **Nmap** port scan — defenders see it and may trace the source).
- **Passive** — no direct engagement: online research, **OSINT**, observing network traffic, public databases. Less likely to be detected, but yields less information (e.g., **WHOIS** lookups for phishing targets).

**Three environment types (controls how much recon is needed):**

| Environment | Info given | Simulates | Recon needed |
|---|---|---|---|
| **Known** (white box) | Detailed: diagrams, IPs, app details, OS versions, even credentials | **Insider threat** | Little to none — focus is evaluating vulns in known assets |
| **Partially known** (gray box) | Limited: some IP ranges or endpoints; rest withheld | Attacker with partial insider knowledge (from prior breach) | Important — fills the gaps; uncovers hidden/forgotten assets |
| **Unknown** (black box) | Minimal to none — maybe just company name/domain | **Real-world external attacker** | Extensive — must discover assets, then vulns, then exploit paths |

---

## 8. Basic PenTest Demo — Metasploit (Lesson 120)

Exam expects: remember **what tool does what**, not how to run commands.

**Metasploit** — the #1 multipurpose penetration testing framework (preinstalled on **Kali Linux** and **Parrot Linux**). Covers reconnaissance → exploitation → post-exploitation. Launch with `msfconsole`.

**Module categories:**
- **Exploits** — code that delivers a payload and attacks a target
- **Auxiliary** — scanners, sniffers, fuzzers, spoofers (non-exploit features; can even replace Nmap for scanning)
- **Post** — post-exploitation tasks: persistence, covering tracks
- **Payloads** — what the exploit delivers and runs (gives control/elevated permissions)
- **Encoders** — get payloads to destination intact/undetected (bypass IDS, firewalls, ACLs)
- **Nops** — no-operations; keep payload sizes consistent across exploit attempts; useful for evasion
- **Evasion** — techniques to get past defenses

**Module naming pattern:** module type / platform / service / module name (e.g., `exploit/windows/smb/ms17_010_psexec` = EternalBlue, the WannaCry core vulnerability, MS patch from March 2017).

**Key commands:** `use` (load a module), `options` (see required settings), `set RHOST <ip>` (target host), RPORT (target port), LHOST/LPORT (local), `show payloads`, `set payload <name>` (note: `set payload` + spaces, unlike `use` + slashes), `run`. **An exploit without a payload does nothing.**

**Demo flow:** Nmap subnet scan (`172.16.218.0/24`) → find target with 23 open ports → `nmap -sV` service/version fingerprint → identify vulnerable service (UnrealIRCd 3.2.8.1 backdoor on port 6667) → `search IRC` in Metasploit → `use exploit/unix/irc/unrealircd3281backdoor` → set RHOST/RPORT → set payload `cmd/unix/bind_perl` → `run` → bind shell on port 4444 → **root access** (`whoami` = root).

**Sessions:** Metasploit supports multiple concurrent sessions (chaining exploits across systems). Ctrl+Z backgrounds a session; `sessions -l` lists; `sessions <n>` switches.

---

## 9. Attestation of Findings (Lesson 121)

**Attestation** = formal validation/confirmation by an entity asserting the **accuracy and authenticity** of specific information.

**Attestation of findings** proves:
1. The penetration test **actually occurred**
2. The findings are **valid**, based on **evidence**

- Required when testing is for **compliance/regulatory reasons** (GLBA, HIPAA, Sarbanes-Oxley, PCI DSS) → a **letter of attestation** from the pentest firm is the official record.
- Not required if the org simply wanted a test for its own purposes.
- Letter should include: **summary of findings + proof the assessment occurred** during a given period — the org shows it to third parties as proof.

**Attestation vs. report — key difference: attestation INCLUDES EVIDENCE.**
- Attestation meeting: walk through findings with proof — detailed reports, data, logs, explanations, maybe exploit code. Sensitive items (custom exploit code) can be shown but **not left with the organization**.
- The report shows findings + remediation recommendations, but not necessarily how you exploited the vuln.

**Other attestation flavors (integrity checking):**
- **Software attestation** — validate software integrity, e.g., checking a digital signature on an update (valid signature = authentic, untampered).
- **Hardware attestation** — validate hardware integrity, e.g., **TPM (Trusted Platform Module)** stores measurements of hardware/firmware configs checked at boot.
- **System attestation** — validate security posture, e.g., cloud provider attesting SOC 2 / ISO 27001 compliance.

Internal audit attestation → accuracy of financial records, risk management effectiveness, policy adherence. External audit attestation → financial statements true/fair view — relied on by investors, creditors, regulators.

**Bottom line:** attestation strengthens **trust, transparency, accountability**.

---

## Rapid-Fire Exam Facts

1. Audit = effectiveness/efficiency of controls; assessment = find vulns & risks.
2. Internal audit team = own org; external = independent third party.
3. Audit committee = board-level oversight of audit & compliance.
4. Self-assessment order: threat modeling → vulnerability assessment → risk assessment → mitigation recommendations.
5. Every checklist action item needs a named assignee.
6. GDPR, HIPAA, PCI DSS — know which regulation fits which industry.
7. Examinations (power plants, 1–5 years) test *people* too, not just systems.
8. NIST CSF used to harmonize multiple compliance frameworks.
9. Red = offensive, Blue = defensive, Purple = integrated, plus physical.
10. Purple team: Blue misses → Red teaches Blue how to detect it.
11. Active recon (Nmap scan) risks detection; passive (WHOIS/OSINT) is stealthy but thinner.
12. Known = insider threat scenario, little recon; unknown = external attacker, extensive recon.
13. Metasploit module types: exploits, auxiliary, post, payloads, encoders, nops, evasion.
14. Encoders get payloads past defenses; nops keep payload size consistent.
15. Exploit without payload = failed run.
16. RHOST = target; LHOST = your machine.
17. EternalBlue = MS17-010 = WannaCry.
18. Attestation includes evidence; the report may not.
19. Letter of attestation proves the pentest happened — needed for compliance (GLBA/HIPAA/SOX/PCI DSS).
20. TPM = hardware attestation; digital signature check = software attestation; SOC 2/ISO 27001 claim = system attestation.
