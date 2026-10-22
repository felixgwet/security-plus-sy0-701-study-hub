# Governance and Compliance — SY0-701 Study Notes (Section 11)

**Exam weight:** Domain 5.0 (Program Management & Oversight) — OBJ 5.1 (security governance) & OBJ 5.4 (security compliance)
**Lessons covered:** 95–103 (Intro · Governance · Governance structures · Policies · Standards · Procedures · Governance considerations · Compliance · Non-compliance consequences)

---

## 1. Governance Fundamentals (Lesson 96) — HIGH-YIELD

**Governance** = the overall management of the organization's IT infrastructure, policies, procedures, and operations. It is the **first component of the GRC triad** (Governance, Risk, Compliance).

- Establishes a **strategic framework** aligning IT with business objectives and regulatory requirements — the rules, responsibilities, and practices that guide the organization.
- Key decision areas: **risk management, resource allocation, performance measurement**.
- Governance matters for: **risk management, strategic alignment, resource management, performance measurement**.

### The document hierarchy (memorize — favorite exam target)

| Level | What it is | Mandatory? |
|---|---|---|
| **Guidelines** | Recommended approach to handling situations | NOT mandatory |
| **Policies** | High-level guidelines outlining the org's commitments and intentions (data protection, ethical conduct) | Direction-setting |
| **Standards** | Specific, often **mandatory** rules that must be followed to adhere to a policy; often defined by industry/regulatory bodies | Mandatory |
| **Procedures** | Detailed **step-by-step** instructions to accomplish specific tasks | Mandatory in practice |

### Monitoring & revision
Governance must adapt as **technology, regulations, and industry culture** change.
- **Monitoring** = regularly reviewing/assessing the effectiveness of the framework; identifies gaps and weaknesses.
- **Revision** = updating the framework (policies, standards, procedures, infrastructure) to close those gaps.
- TechFirm example: cloud adoption (tech change, 2015) → new data-protection regulations (2018) → remote-work cultural shift — each triggered monitoring and revision.

---

## 2. Governance Structures (Lesson 97)

| Structure | Role |
|---|---|
| **Board of directors** | Elected by **shareholders**; sets strategic direction, establishes policies, makes significant decisions |
| **Committees** | Subgroups of the board with a specific focus: **audit committee** (financial reporting), **governance committee** (board effectiveness), **cybersecurity committee** (cyber risk) |
| **Government entities** | Establish/enforce laws and regulations — e.g., the **FTC** enforces consumer-protection and competition law |
| **Centralized** | Decision-making authority concentrated at the **top** → consistent decisions, clear authority, but **slow** to respond to local/departmental needs |
| **Decentralized** | Authority **distributed** throughout the org → quicker decisions, responsive, innovative — but risk of **inconsistency** |

---

## 3. Policies (Lesson 98) — HIGH-YIELD

- **Acceptable Use Policy (AUP)** — the do's and don'ts for users of IT systems (no dangerous websites, no unauthorized software, no personal gain).
- **Information security policy** — cornerstone of the security posture: data classification, access control, encryption, physical security (CIA).
- **Business continuity policy** — how the org continues **critical operations during and after** a disruption.
- **Disaster recovery policy** — recovering **IT systems and data** after a disaster: backups, restoration, hardware/software recovery, alternative processing locations.
- **Incident response policy** — detect, report, assess, respond to, and **learn from** security incidents (who to notify, containment, prevention of recurrence).
- **SDLC policy** — governs software development from requirements → design → coding → testing → deployment → maintenance; includes secure-coding standards and code reviews.
- **Change management policy** — changes to IT systems handled in a **controlled, coordinated** manner (request, approve, implement, review).

> Exam trap: business continuity = keep the *business* running; disaster recovery = restore the *IT systems and data*.

---

## 4. Standards (Lesson 99) — HIGH-YIELD

- **Password standards** — min length (8–12+ chars), mixed case + numbers + special characters, changes every **60–90 days**, no reuse; **hashing and salting** so a compromised password database doesn't expose passwords.
- **Access control standards** — three models:
  - **DAC** (Discretionary): the **owner** of the resource decides who can access it.
  - **MAC** (Mandatory): **labels/classifications** determine access — government/military.
  - **RBAC** (Role-based): access assigned by **job role** — only what the job requires.
  - Plus **least privilege** (minimal access needed) and **separation of duties** (no single person controls a critical process — anti-insider).
- **Physical security standards** — perimeter security (fences, gates, guards), surveillance (CCTV), access mechanisms (biometrics, keycards); environmental controls (fire suppression, HVAC, power redundancy); extra protection for secure areas (server rooms, data centers).
- **Encryption standards** — **AES** for data **at rest** (strong + efficient); **RSA** for secure communication (**public-key/PKI** nature).

---

## 5. Procedures (Lesson 100)

- **Change management procedure**: identify need & assess impact → develop plan → implement (often **in stages**) → review lessons learned. Key rules: test significant changes first; always have a **rollback plan**; schedule disruptive changes in a **maintenance window**; evaluate and document afterward.
- **Onboarding** — orientation, training, integration (productivity fast).
- **Offboarding** — retrieve company property, **disable access**, exit interview (feedback).
- **Playbooks** — a **checklist of actions** to **detect and respond to a specific incident type**; step-by-step so tasks are consistent and fast **regardless of who performs them**.

---

## 6. Governance Considerations (Lesson 101) — HIGH-YIELD

| Consideration | Example |
|---|---|
| **Regulatory** | **GDPR** (EU) — governs collection/storage/use of EU citizens' personal data; severe penalties for non-compliance |
| **Legal** | Contract law, intellectual property, corporate law; employment law; **litigation** (breach of contract, product liability, employment disputes) |
| **Industry** | Standards/best practices not legally binding but expected — e.g., **Agile** (Scrum/Kanban) in software; ignoring them = competitive disadvantage |
| **Local** | City ordinances, zoning laws |
| **Regional** | **CCPA** (California) — right to **know**, **delete**, **opt out of sale** of personal data |
| **National** | **ADA** (US) — reasonable accommodations for employees, accessibility for customers with disabilities |
| **Global** | GDPR again — applies **extraterritorially** to any company processing EU citizens' data; **conflict of laws** between jurisdictions must be navigated |

---

## 7. Compliance (Lesson 102) — HIGH-YIELD

### Compliance reporting
- **Internal** — collecting/analyzing data to show adherence to **internal policies**; done by the internal audit team or compliance department (e.g., report on transactions above a threshold that required compliance-officer approval).
- **External** — demonstrating compliance to **regulatory bodies, auditors, customers**; often **mandated by law or contract** (e.g., pharma companies report GMP adherence to the FDA).

### Compliance monitoring — four concepts (memorize the pairs)
| Pair | Distinction |
|---|---|
| **Due diligence** | The **exhaustive review** that identifies potential compliance risks (researching foreign laws before expanding overseas) |
| **Due care** | The **steps taken to mitigate** those risks (training employees, hiring a local legal advisor) |
| **Attestation** | A **formal declaration** by a responsible party that processes/controls **are compliant** (developers attest they followed data-security protocols) |
| **Acknowledgement** | **Recognition and acceptance** of the requirements by all relevant parties (signing a compliance agreement) |
| **Internal monitoring** | Reviewing own operations against **internal policies** |
| **External monitoring** | **Third-party reviews/audits** verifying compliance with external regulations/standards (ISO 9001 audit) |

### Automation
Automated compliance systems streamline data collection, **improve accuracy**, and provide **real-time monitoring** (auto-flag unauthorized patient-record access → HIPAA; auto-generate suspicious-transaction reports → anti-money-laundering).

---

## 8. Consequences of Non-Compliance (Lesson 103) — HIGH-YIELD NUMBERS

| Consequence | Key facts |
|---|---|
| **Fines** | GDPR: up to **€20 million OR 4% of annual global turnover, whichever is higher**; British Airways fined **£183 million** (2019, UK ICO) for a breach affecting **500,000 customers** |
| **Sanctions** | Restrictions on operations up to outright bans — e.g., China (2017) sanctioned companies for violating its cybersecurity law: warnings, fines, **confiscation of illegal income** |
| **Reputational damage** | **Equifax (2017)**: breach exposed **147 million** people; stock dropped **>30%** in weeks |
| **Loss of license** | **2016**: New York State Dept. of Financial Services **revoked a Bitcoin company's license** for failing cybersecurity requirements |
| **Contractual impacts** | Non-compliance → **breach of contract** → lawsuits, financial penalties, contract **termination** |

---

## 9. Rapid-Fire Self-Test (44 items)

1. What does GRC stand for? *(governance, risk, compliance)*
2. Which triad component is governance? *(the first)*
3. Governance definition in one line? *(overall management of IT infra, policies, procedures, operations — strategic framework aligned with business objectives)*
4. What are governance's three decision areas? *(risk management, resource allocation, performance measurement)*
5. Which document type is NOT mandatory and gives recommended approaches? *(guidelines)*
6. Policies = ? *(high-level commitments/intentions)*
7. Standards = ? *(specific, often mandatory rules to adhere to a policy)*
8. Procedures = ? *(step-by-step task instructions)*
9. What are the three triggers for governance revision? *(technology, regulatory, cultural change)*
10. Monitoring vs revision? *(review effectiveness/identify gaps vs update framework)*
11. Who elects the board of directors? *(shareholders)*
12. What does the audit committee oversee? *(financial reporting)*
13. What does the FTC enforce? *(consumer protection and competition law)*
14. Centralized structure trade-off? *(consistent, clear authority; slow to respond locally)*
15. Decentralized structure trade-off? *(fast, responsive, innovative; inconsistency risk)*
16. What does an AUP do? *(sets do's/don'ts for IT system use)*
17. Business continuity vs disaster recovery? *(keep business running vs restore IT systems/data)*
18. What does an incident response policy add beyond response? *(learning — preventing recurrence)*
19. SDLC stages? *(requirements, design, coding, testing, deployment, maintenance)*
20. Change management policy goal? *(controlled, coordinated changes)*
21. Password change interval per the course? *(every 60–90 days)*
22. Purpose of hashing and salting? *(compromised DB still doesn't expose passwords)*
23. DAC = ? *(resource owner decides access)*
24. MAC = ? *(labels/classifications; gov/military)*
25. RBAC = ? *(access by job role)*
26. Least privilege = ? *(minimal access to perform duties)*
27. Separation of duties prevents? *(one person controlling a critical process — insider risk)*
28. AES is preferred for? *(data at rest)*
29. RSA is preferred for? *(secure communication — public-key/PKI)*
30. First stage of the change management procedure? *(identify need, assess impact)*
31. Every change should have what? *(a rollback/backup plan)*
32. Disruptive changes should be scheduled when? *(maintenance window)*
33. Offboarding must include? *(retrieve property, disable access, exit interview)*
34. Playbook = ? *(checklist of actions to detect/respond to a specific incident type)*
35. GDPR governs data of whom? *(EU citizens — applies extraterritorially)*
36. CCPA grants what three rights? *(know, delete, opt out of sale)*
37. ADA requires? *(reasonable accommodations / accessibility for people with disabilities)*
38. Internal vs external compliance reporting? *(own policies by internal audit vs regulators/customers, often legally mandated)*
39. Due diligence = ? *(exhaustive review identifying compliance risks)*
40. Due care = ? *(steps taken to mitigate the risks)*
41. Attestation = ? *(formal declaration processes/controls are compliant)*
42. Acknowledgement = ? *(acceptance of requirements by relevant parties — e.g., signing)*
43. GDPR maximum fine? *(€20M or 4% of annual global turnover, whichever is higher)*
44. Name the five non-compliance consequences. *(fines, sanctions, reputational damage, loss of license, contractual impacts)*
