# Section 07 — Data Protection · SY0-701 Study Notes

**Exam objective coverage:** 1.4 (cryptographic solutions), 3.3 (compare/contrast data protection concepts & strategies), 4.2 (asset management implications), 4.4 (alerting & monitoring — DLP), 4.5 (DLP configuration), 5.1 (governance) — lessons 59–67. This section is a pure memorization goldmine: classification levels, ownership roles, data states, and DLP types are asked constantly.

---

## 1. Data Protection & Classification (3.3)

**Data protection** = safeguarding important information from corruption, compromise, or loss — ensuring CIA of data.

Classification is based on: ① value to the organization and ② sensitivity **if disclosed**. **The data owner decides the classification level.**

⚠️ **Overclassifying** data wastes money — you end up protecting everything at the highest level (extra personnel, access controls, technical solutions). Classify properly so higher levels get more resources.

**Commercial (4 levels, lowest → highest):**

| Level | Impact if released | Examples |
|---|---|---|
| **Public** | None | Website content, this course |
| **Sensitive** | Minimal | Financial data, unreleased course material |
| **Private** | Internal-only | Personal records, salary info, SSNs — relates to an individual entity |
| **Confidential** | Serious | Trade secrets, IP, source code; approved personnel + third parties under NDA (e.g., CompTIA exam questions) |

**Critical data** = too valuable to allow any risk if captured; viewing severely restricted (e.g., credit card numbers, access limited to a few trusted individuals).

**Government/Military (5 levels, lowest → highest):**

| Level | Disclosure harm | Examples |
|---|---|---|
| **Unclassified** | None — releasable to the public, incl. via **FOIA** requests | Public info |
| **Sensitive but Unclassified (SBU)** | Won't hurt national security, but harms the individuals in it | Medical records, personal files of soldiers |
| **Confidential** | Could **seriously affect** the government | Trade secrets |
| **Secret** | Could **seriously damage** national security | Military deployment plans, defensive postures |
| **Top Secret** | Could **gravely damage** national security | Weapon system blueprints |

⚠️ Trap: memorize the affect → damage → gravely damage escalation. SBU is the one that protects *individuals* rather than the nation.

**Data lifecycle:** policies must define how data is stored, when, how long, and how it's destroyed. Follow local/state/federal **retention requirements** — some data must legally be kept for set periods.

---

## 2. Data Ownership Roles (4.2 & 5.1) — know every role cold

| Role | Definition | Key identifier |
|---|---|---|
| **Data owner** | **Senior executive** with ultimate responsibility for CIA of the information asset; labels the asset and mandates controls | NOT the file creator; NOT IT |
| **Data controller** | Entity deciding the **purposes and methods** of data collection, storage, usage; guarantees legality; holds **ultimate accountability for privacy breaches — cannot delegate** | The accountable one |
| **Data processor** | Group/individual **hired by the controller** to collect, store, or analyze data under the controller's direction | The hired hands |
| **Data steward** | Works **for the data owner**; ensures data quality and metadata; makes sure labeling/classification actually happens | Quality + correct labels |
| **Data custodian** | Manages the **systems** where data is stored (e.g., system administrator); enforces access control, encryption, backup/recovery per the owner's requirements | IT/sysadmin role |
| **Data privacy officer** | Oversees all privacy-related data (PII, SPI, PHI); ensures legal/regulatory compliance, purpose limitations, consent, data minimization, sovereignty, retention; **on the hook when a breach exposes user data** | Privacy compliance |

⚠️ **Biggest trap:** who should own data? The **business side** (department leaders, CFO for accounting data), never IT — IT knows systems, not data context. IT should be custodians.

---

## 3. Data States (3.3)

| State | Meaning | Protection methods |
|---|---|---|
| **Data at rest** | Stored in databases, file systems, storage systems; not moving | **Encryption** + ACLs |
| **Data in transit** (a.k.a. **in motion**) | Actively moved across internet/private network | **Communication tunneling**: SSL/TLS, VPN, IPsec |
| **Data in use** | Being created, retrieved, updated, deleted | Application-level encryption, access controls, **secure enclaves** |

**At-rest encryption methods (know the granularity ladder):**
1. **Full disk** — entire hard drive; encrypted when system off, decrypted when logged in
2. **Partition** — specific partitions only (e.g., the D: drive)
3. **File** — individual files
4. **Volume** — a set of selected files/directories
5. **Database** — at column, row, or table level
6. **Record** — specific *fields* within a database record (useful when users share one DB with different view rights)

**In-use nuance:** data must be decrypted to be processed — that's why it's hard to protect. **Secure enclaves** (e.g., Intel SGX) encrypt data even while it exists in memory so untrusted processes can't decode it.

---

## 4. Data Types (3.3 & 1.4)

| Type | Definition | Notes |
|---|---|---|
| **Regulated data** | Controlled by laws/regulations/industry standards | GDPR (EU), HIPAA (US) |
| **PII** | Any info identifying an individual: names, SSNs, addresses | Heavily targeted; privacy laws mandate protection |
| **PHI** | Health status, healthcare provision, or payment for healthcare linked to an individual | Protected by **HIPAA** |
| **Trade secrets** | Confidential business info giving competitive edge: manufacturing processes, marketing strategies, proprietary software, customer lists | Legal protection; severe penalties for disclosure |
| **IP** | Creations of the mind: inventions, literary/artistic works, designs, symbols | Protected by patents, copyrights, trademarks |
| **Legal information** | Legal proceedings, contracts, regulatory compliance data | Client confidentiality, legal professional privilege |
| **Financial information** | Sales records, invoices, tax documents, bank statements | Targeted for fraud/identity theft; **PCI DSS** applies |
| **Human-readable** | Text documents, spreadsheets | — |
| **Non-human readable** | Binary code, machine language | ⚠️ Still needs protection — can contain sensitive info |

---

## 5. Data Sovereignty (3.3)

- Data is subject to the **laws of the country where it's collected/processed** — must be managed, stored, and processed per that country's laws.
- Cloud computing made this critical (data centers scattered worldwide).
- **GDPR** protects EU citizens while within the EU/EEA borders (protection doesn't follow them outside). Any organization handling EU citizens' data must comply **regardless of the organization's location** — fines are hefty.
- **China and Russia** have strict sovereignty laws requiring data to be stored and processed **within national borders** — a challenge for multinationals using cloud.
- Know the **physical locations of your data centers** and cross-border data flows; no illegal transfers from a privacy jurisdiction without consent; cloud services may restrict access from multiple geographies.

---

## 6. Securing Data — the eight methods (3.3)

| Method | One-liner |
|---|---|
| **Geographic restrictions (geofencing)** | Virtual boundaries restricting access by location (e.g., ban logins from Asia/Africa when all employees are in the Americas); helps comply with sovereignty laws |
| **Encryption** | Plaintext → ciphertext with an algorithm + key; reversible with the decryption key; protects data at rest and in transit |
| **Hashing** | Converts data to a **fixed-size** hash value; **one-way** (cannot be reversed/decrypted); stores passwords, verifies file integrity |
| **Masking** | Replaces some/all of a field with placeholders (e.g., X), can keep partial data (area code) and the original format; **one-way**; a method of **de-identification** |
| **Tokenization** | Replaces sensitive data with non-sensitive **tokens**; original stored securely in a **separate database**; token is a reference — used in **payment processing to protect credit card numbers** |
| **Obfuscation** | Makes data unclear/unintelligible — via encryption, masking, pseudonyms |
| **Segmentation** | Divides network into segments, each with own controls; stops **lateral movement**; limits breach damage |
| **Permission restrictions** | ACLs / **RBAC** — limit access to those who need it (least privilege) |

⚠️ Trap trio: **encryption is reversible, hashing and masking are one-way**. Tokenization is reversible only via the token vault (separate DB). Masking vs tokenization: masking permanently replaces (de-identification); tokenization substitutes and keeps the original safe elsewhere.

---

## 7. Data Loss Prevention — DLP (4.4)

**DLP** = a strategy ensuring sensitive/critical information doesn't leave the organization, intentionally or unintentionally — detecting breaches/exfiltration. Why it matters: data theft evolved filing cabinets → laptops → external drives → thumb drives → cloud sync (Dropbox/Google Drive) — data and IP are "the currency of business."

**The four DLP types (2.4-level memorization):**

| Type | Placement | Watches |
|---|---|---|
| **Endpoint DLP** | Software installed on workstation/laptop | **Data in use** — blocks or alerts on file transfers per rules (like an IDS/IPS focused on data); detection mode or prevention mode |
| **Network DLP** | Hardware/software at the **network perimeter** | **Data in transit** — all traffic in/out, special focus on **outbound** data that shouldn't leave |
| **Storage DLP** | Software on servers in the data center | **Data at rest** — inspects stored (often encrypted/watermarked) data; catches odd access like bulk downloads at 2 a.m. |
| **Cloud-based DLP** | SaaS, part of the cloud service | Data stored in cloud services (e.g., Google Drive DLP) |

---

## 8. Configuring a DLP (4.5) — from the Google Workspace demo

**Console path (Google Workspace):** admin.google.com → **Security → Access and data control → Data protection**. (Gmail DLP lives separately: Apps → Google Workspace → Gmail → **Compliance → Content compliance**.) Office 365 is a similar process — concepts matter, not clicks.

**Rule-building flow (the exam-relevant skeleton):**
1. **Name + description** — e.g., "Block SSNs: prevent SSNs from being shared in chat or Drive."
2. **Scope** — who the rule applies to (default: everyone; can target groups, e.g., instructors only).
3. **Apps** — Google Chat (messages + file uploads; **OCR** checks uploaded photos, e.g., a picture of an SSN card) and/or Google Drive.
4. **Conditions** — what to scan for: **predefined data types** (per-country: US SSN, driver's license, passport…), **text string**, **regular expression**, or **word list** (e.g., codename "Operation Neptune").
5. **Likelihood threshold** — where actions kick in. ⚠️ **Low = floods of false positives**; for SSNs/phone numbers set **high or very high**. Also set minimum unique matches / match count.
6. **Actions (per app)** — Chat: **warn the user / block the message / audit (log + notify admins)**; Drive: **block external sharing / warn / disable download-print-copy** for viewers & commenters; add a custom user message.
7. **Alerting** — severity (low/medium/high) reported to the security dashboard + alert center; optional email notifications.
8. **Set to Active.**

**Gmail variant:** outbound rule + predefined content (US SSN) + high confidence threshold + action: **quarantine the message** (or modify, route, mark as spam, encrypt, reject) + **notify the sender**.

**Context matters:** DLP engines score *likelihood* using surrounding keywords — "SSN 123-45-6789" = very likely; the bare number 123-45-6789 alone = low/unlikely (could be any ID). A malformed "jason@diontraining" (no TLD) isn't recognized as an email at all. Use the built-in **DLP demo tool** to test what gets caught.

---

## Rapid-Fire Self-Test

1. Who decides a data item's classification? *(The data owner)*
2. Commercial classification levels low → high? *(Public, sensitive, private, confidential)*
3. Government levels low → high? *(Unclassified, SBU, confidential, secret, top secret)*
4. Which government level covers a soldier's medical record? *(Sensitive but unclassified)*
5. Which level: weapon system blueprints? *(Top secret — gravely damages national security)*
6. Which level: military deployment plans? *(Secret — seriously damages)*
7. What law releases government unclassified data to the public? *(FOIA)*
8. What does overclassifying cost you? *(Money, time, resources — everything protected at high level)*
9. Who can NEVER delegate privacy-breach accountability? *(The data controller)*
10. Who is hired to process data on the controller's behalf? *(The data processor)*
11. Who makes sure data actually gets labeled per policy? *(The data steward)*
12. What role is a system administrator? *(Data custodian)*
13. Who's on the hook when a breach exposes PII? *(The data privacy officer)*
14. Should IT own the data? *(No — the business side owns; IT custodians)*
15. Three data states? *(At rest, in transit/in motion, in use)*
16. Full disk vs partition vs volume vs record encryption? *(Whole drive / one partition / a set of files & dirs / specific fields in a DB record)*
17. Protecting data in transit? *(SSL/TLS, VPN, IPsec tunneling)*
18. What protects data in use? *(App-level encryption, access controls, secure enclaves like Intel SGX)*
19. PII vs PHI? *(Identifies an individual / health info linked to an individual, HIPAA-protected)*
20. Which standard governs cardholder financial data? *(PCI DSS)*
21. GDPR protects EU citizens where? *(Within EU/EEA borders)*
22. Which two countries demand in-country data storage? *(China and Russia)*
23. Hashing vs encryption? *(One-way fixed-size / reversible with key)*
24. Tokenization's original data goes where? *(A separate, secure database — used for payment cards)*
25. Masking is what kind of process? *(One-way de-identification that can preserve format)*
26. Segmentation stops what? *(Lateral movement between network segments)*
27. Four DLP types? *(Endpoint, network, storage, cloud-based)*
28. Endpoint DLP watches which state? *(Data in use)*
29. Storage DLP catches what odd behavior? *(Bulk downloads at 2 a.m. from servers)*
30. Why not set DLP threshold to "low"? *(False-positive flood)*
31. Gmail DLP lives under which menu? *(Compliance → Content compliance)*
32. What raises an SSN match from low to very likely? *(Context keywords like "SSN")*
