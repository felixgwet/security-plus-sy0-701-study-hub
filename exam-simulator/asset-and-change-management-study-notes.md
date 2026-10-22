# Asset and Change Management — SY0-701 Study Notes (Section 12)

**Exam weight:** Domain 1.0 (General Security Concepts) — OBJ 1.3 (change management processes & security impact) · Domain 4.0 (Security Operations) — OBJ 4.1 (security techniques for computing resources) & 4.2 (hardware/software/data asset management)
**Lessons covered:** 104–112 (Intro · Acquisition & procurement · Mobile asset deployments · Asset management · Asset disposal & decommissioning · Change management · Change management processes · Technical implications · Documenting changes)

---

## 1. Foundations (Lesson 104)

- **Asset management** = systematic process of developing, operating, maintaining, and selling assets in a cost-effective manner — every digital asset (hardware to software) is identified, cataloged, and monitored.
- **Change management** = structured approach to transitioning individuals, teams, and organizations from a current state to a desired future state — modifications done in a controlled, secure manner.
- Together they prevent, detect, and respond to cyber threats.

## 2. Acquisition and Procurement (Lesson 105) — know the difference!

- **Acquisition** = the process of **obtaining** goods and services.
- **Procurement** = the **entire process** of sourcing and obtaining — including everything that leads up to the actual acquisition.

### Purchase options
| Option | Used for |
|---|---|
| **Company credit card** | Minor, low-cost, fast purchases (ink, toner, paper); per-role transaction limits set by the company |
| **Individual purchase** | Employee pays personally, then seeks **reimbursement** — travel without a company travel card, emergencies, or companies with no company card yet |
| **Purchase order (PO)** | Larger/expensive purchases — a **formal document issued by the purchasing department** that **authorizes** a purchase |

> PO trap: a purchase order is **NOT a payment** — it's a financial promise to pay, typically net 15 / net 30 / net 60 per the MSA.

### Internal approval process (example: US Navy ITPR)
1. Detailed assessment of the need and benefits
2. Check product against IT standards — security and interoperability with current systems
3. Verify budget allocation and funding source
4. Formal request rises through **multiple levels of approval** by senior decision-makers

After approval: assess compatibility, perform security checks/configurations, train end users, integrate into workflows.

## 3. Mobile Asset Deployment Models (Lesson 106) — HIGH-YIELD

| Model | Who owns | Personal use? | Pros | Cons |
|---|---|---|---|---|
| **BYOD** (bring your own device) | Employee | Yes (one device) | Cheap for org; employee freedom; satisfaction | Employee controls security; hard to add to MDM, patch, enforce configs |
| **COPE** (corporate-owned, personally enabled) | Company | Yes (company-car analogy) | Standard models; simpler management; MDM-managed | High upfront cost; org can monitor → employee privacy concerns |
| **CYOD** (choose your own device) | Company | Usually **work-only** (two phones) | Middle ground — employee choice from approved list + org control/standardization; best for MDM | High upfront cost; privacy concerns; carrying two devices |

**Decision factors: cost, security, employee satisfaction.** Security paramount → **CYOD** (best control, all devices in MDM).

## 4. Asset Management (Lesson 107)

Two main areas: **assignment/accounting** and **monitoring/tracking**.

- **Assignment/ownership allocation** — every asset assigned to an owner (person/team/department) — no ambiguity; eases troubleshooting, upgrades, replacement.
- **Classification** — categorize by function, **value**, and other criteria: high-value assets (servers with critical data) get stringent maintenance; low-value assets (old laptop in storage) get recycled/disposed.
- **Monitoring** — maintain an inventory/record of every asset: specifications, location, assigned users, service history.
- **Asset tracking** — goes further: specialized software/technologies to monitor location, status, condition of physical assets (e.g., GPS location of a device).
- **Enumeration** — identifying and counting assets with software tools/scanners: what's connected to the network, what software/OS runs, each asset's health. Detects unauthorized devices; informs patching and vulnerability decisions. (First step when acquiring another company: enumerate their network.)
- **MDM (Mobile Device Management)** — securely manage/monitor smartphones, tablets, laptops: enforce corporate policies, software uniformity, safeguard data. Enables **remote lock and wipe** of lost devices and pushing patches/updates/apps to **thousands of devices simultaneously**.

## 5. Asset Disposal & Decommissioning (Lesson 108) — HIGH-YIELD

Governing document: **NIST Special Publication 800-88 — Guidelines for Media Sanitization.**

### Sanitization methods (data unrecoverable; device may survive)
| Method | How it works | Key fact |
|---|---|---|
| **Overwrite** | Replace data with random data, repeated — **1, 7, or 35 passes** depending on classification level | More passes for higher classification |
| **Degaussing** | Strong magnetic field disrupts magnetic domains (HDD, tape) | **Permanently destroys the drive's ability to store data** — device cannot be reused |
| **Secure Erase** | Firmware-level built-in erasure routine purges all blocks | Older method; **flaws found** → replaced by cryptographic erase |
| **Cryptographic Erase (CE)** | **Destroy the encryption keys** — data remains but is unreadable | Extremely fast (30–60 seconds); device can be **repurposed or resold** safely |

### Destruction (device beyond recovery/reuse)
- **Shredding, pulverizing, melting, incinerating** — NIST-recommended.
- NSA shredded hard drives from top-secret workstations.
- For **secret/top-secret data, sanitization is NOT enough → destruction** is required.

### Certification & data retention
- **Certification** = act of **proof** that data/hardware was securely disposed — an audit log of the sanitization/destruction process; vital for regulatory controls and sensitive data (government, financial, health).
- **Data lifecycle**: creation → processing → archiving → destruction.
- **Data retention** = strategically deciding what to keep and for how long — regulations may mandate keeping financial transactions or medical records; retained data supports historical analysis, trend prediction, dispute resolution.
- Why not keep everything? Storage costs, retrieval clutter, and **the more you store, the more you must secure** — a bigger target for threat actors.

## 6. Change Management (Lesson 109)

- Change must be **approved** — no installing software or changing configurations without an approval process; changes are assessed for value and implementability with minimal disruption.
- **CAB (Change Advisory Board)** — body of representatives from across the organization that conducts **due diligence** on proposed changes: viability, potential impacts, alignment with organizational objectives.
- **Change owner** — individual/team who initiates the change request; the **advocate** who details reasons, benefits, and implementation challenges.
- **Stakeholders** — anyone with a **vested interest**: directly impacted OR has a role in assessment/implementation. Types: technical (developers, server admins), business (support teams), end users. Must be **consulted or informed** before the change (example: server reboot = 5 minutes of global downtime; train users; brief support team; warn students ahead).
- **Impact analysis** — what could go wrong? Immediate effects on business processes, reputation, users; long-term operational impact; unforeseen challenges.

## 7. Change Management Process (Lesson 110) — HIGH-YIELD

**Five steps:** prepare → create vision → implement → verify → document.
1. **Prepare** — understand current state; assess existing processes; identify inefficiencies; gather resources; engage stakeholders.
2. **Create vision** — the North Star: desired future state, reasons, picture of success; generates buy-in.
3. **Implement** — training, restructuring, new tools; **continuous communication** to reduce resistance.
4. **Verify** — compare the new state to envisioned objectives (surveys, metrics analysis, stakeholder interviews); fix discrepancies.
5. **Document** — historical record + lessons learned for continuous improvement.

### Ongoing requirements
- **Scheduled maintenance windows** — never change on the fly or in peak hours (example: Saturday midnight–4 a.m.); **emergency changes** (e.g., critical Microsoft patch) can be approved and implemented in minutes/hours/days.
- **Backout plan** — predetermined strategy to revert to the original state; the safety net.
- **Test results** after implementation — validate success; confirm no new issues.
- **SOPs (Standard Operating Procedures)** — detailed step-by-step instructions ensuring consistency and reduced errors.

## 8. Technical Implications of Changes (Lesson 111) — HIGH-YIELD

| Element | What to watch |
|---|---|
| **Allow list / deny list (block list)** | Adding/removing one IP can inadvertently grant or restrict access to critical services; a firewall upgrade requires a **firewall rules review** so rules migrate properly |
| **Restricted activities** | Tasks restricted due to impact (accessing a protected database; rebooting a too-sensitive server) — verify none are hidden in the proposed change |
| **Downtime** | Estimate it; weigh against benefits; consider peak hours; schedule in the maintenance window |
| **Service/application restarts** | Restarting a domain controller disrupts all users — lost data in transit, backlogs; it's more than the restart time |
| **Legacy applications** | Old but still-functional software; less supported; even minor updates can cause malfunctions/crashes — identify them before changing |
| **Dependencies** | Apps rely on specific databases/services; a change in one area cascades across systems, networks, even partners' architecture — **map dependencies first** |

## 9. Documenting Changes (Lesson 112)

- **Version control** — tracks and manages changes to documents/software/files; enables collaboration and **reverting to a previous stable version** when rollback is needed; preserves continuity and stability.
- **Update diagrams** after every change — the visual snapshot must reflect reality; at team/enterprise scale, undocumented changes cause misunderstandings and misconfigurations.
- **Revise policies and procedures** when a change doesn't yield the desired result — don't just fix the immediate issue; prevent recurrence through iterative process improvement.
- **Update change requests / trouble tickets** post-implementation — creates a timeline, informs stakeholders, and preserves change history.

---

## 10. Rapid-Fire Self-Test (44 items)

1. Acquisition vs procurement? *(obtaining goods/services vs the entire sourcing process leading up to it)*
2. Which purchase option suits low-cost urgent items? *(company credit card)*
3. What is an individual purchase? *(employee pays, then gets reimbursed)*
4. What is a PO? *(formal purchasing-department document authorizing a purchase)*
5. Is a PO a payment? *(no — a promise to pay, net 15/30/60 per MSA)*
6. Navy ITPR sequence? *(need/benefits assessment → standards check → budget verification → multi-level approval)*
7. BYOD ownership and key drawback? *(employee-owned; employee controls security, MDM/patching hard)*
8. COPE meaning? *(corporate-owned, personally enabled — company car analogy)*
9. CYOD meaning? *(choose from a company-approved shortlist)*
10. Which model gives the best security control? *(CYOD — all devices MDM-managed)*
11. Three deployment decision factors? *(cost, security, employee satisfaction)*
12. Asset management's two main areas? *(assignment/accounting; monitoring/tracking)*
13. Why classify assets? *(value-based decisions on maintenance, replacement, retirement)*
14. Monitoring vs tracking? *(inventory records vs location/status/condition via specialized tech like GPS)*
15. What is enumeration? *(identifying/counting assets with tools — connected devices, software/OS, health)*
16. Why enumerate before acquiring a company? *(see what assets exist to reuse, upgrade, or retire)*
17. What does MDM enable for a lost phone? *(remote lock or wipe)*
18. MDM push capability? *(patches/updates/apps to thousands of devices simultaneously)*
19. Which NIST publication covers media sanitization? *(SP 800-88)*
20. Overwrite pass counts? *(1, 7, or 35 by classification level)*
21. Degaussing effect on the drive? *(destroys its ability to store data — unusable after)*
22. What replaced Secure Erase? *(cryptographic erase — flaws found in Secure Erase)*
23. How does cryptographic erase work? *(destroy the encryption keys; data stays but unreadable; 30–60 seconds)*
24. Why is CE good for resale? *(device can be repurposed/resold — data indecipherable)*
25. Four NIST destruction methods? *(shredding, pulverizing, melting, incinerating)*
26. For top-secret data, is sanitization enough? *(no — destruction required)*
27. What is certification in disposal? *(act of proof + audit log of sanitization/destruction)*
28. Data lifecycle stages? *(creation, processing, archiving, destruction)*
29. Why retain data? *(regulatory mandates, historical analysis, disputes)*
30. The storage mantra? *(the more you store, the more you must secure)*
31. Who approves changes? *(CAB — Change Advisory Board)*
32. CAB's role? *(due diligence: viability, impact, alignment with objectives)*
33. Change owner role? *(initiates request; advocate for reasons/benefits/challenges)*
34. Who is a stakeholder? *(anyone with vested interest — impacted or involved)*
35. Stakeholder categories in the Dion example? *(technical, business, end users)*
36. What does impact analysis ask? *(what could go wrong; effects on business/reputation/users; long-term impact)*
37. Five change process steps? *(prepare, create vision, implement, verify, document)*
38. Why are maintenance windows used? *(minimize disruption; avoid peak hours)*
39. What is an emergency change? *(critical patch etc. — approved and deployed in minutes/hours/days)*
40. What is a backout plan? *(predetermined strategy to revert to the original state)*
41. What is an SOP? *(detailed step-by-step instructions for a task)*
42. What does a firewall upgrade require? *(a firewall rules review so rules migrate correctly)*
43. Why map dependencies before changing? *(a minor tweak can cascade into a major outage elsewhere)*
44. After a change, which records get updated? *(diagrams, policies/procedures if needed, change requests/trouble tickets)*
