# Third-Party Vendor Risks — SY0-701 Study Notes (Section 10)

**Exam weight:** Domain 2.0 (Threats, Vulnerabilities & Mitigations) — OBJ 2.2, 2.3 · Domain 5.0 (Program Management & Oversight) — OBJ 5.3
**Lessons covered:** 89–94 (Third-party vendor risks · Supply chain risks · Supply chain attacks · Vendor assessment · Vendor selection & monitoring · Contracts & agreements)

---

## 1. Why Third-Party Vendor Risk Matters

- **Third-party vendor risk** = the security and operational challenges introduced by external entities you work with: **vendors, suppliers, and service providers**.
- Integrating external partners opens your environment to threats and vulnerabilities that can affect integrity, data security, and business continuity.
- Examples: a hardware provider whose components have vulnerabilities, a software supplier whose app has a hidden backdoor, an MSP with access to your sensitive data but weak security protocols.
- Core principle: **you are only as strong as the weakest link in your supply chain.**

### Know the three entity types (classic exam distinction)

| Entity | What they do | Example |
|---|---|---|
| **Vendor** | Provides goods or services to your organization | Microsoft, Oracle (software) |
| **Supplier** | Involved in production/delivery of products or parts | Processor, memory, hard-drive makers for a PC manufacturer |
| **MSP (Managed Service Provider)** | Hired to manage IT services on your behalf | AWS, Google Cloud |

---

## 2. Supply Chain Risks (Lesson 90)

### Hardware manufacturers
- A device like a router/switch contains hundreds of components from various suppliers — each can be a vulnerability if tampered with or from an untrusted source.
- **Trusted Foundry program** — used by low-risk-appetite entities (e.g., the **Department of Defense**) to ensure hardware is authentic and microprocessors are manufactured securely against a known-good baseline.
- **Secondary / aftermarket hardware sources** — budget-friendly but high risk of **counterfeit or tampered devices**: modified code with Trojans, remote/unauthorized access, operational failures.

### Software developers / providers
- Check that software is **properly licensed, authentic, free of known vulnerabilities/bugs**, and scanned with **antivirus/anti-malware**.
- **Open-source** software is easier to assess because you can review the **entire source code**; proprietary software (e.g., Microsoft Office) still gets scans and vulnerability assessments.

### Service providers / MSPs
- Unique challenges, especially **SaaS**: Can you ensure confidentiality and integrity of data they touch? Are their security protocols robust? Will they support incident response / forensics after a breach?
- The decision hinges on your organization's **risk appetite** and the ramifications of a data breach.

---

## 3. Supply Chain Attacks (Lesson 91) — HIGH-YIELD

**Definition:** an attack that targets a **weaker link in the supply chain** to gain access to a primary target — instead of attacking a well-defended organization directly.

### Real-world examples
- **2000s–2010s Cisco counterfeits:** counterfeit routers/switches sold on the secondary market.
- **Chip washing:** repackaging the contents of a microchip with a **less expensive chip or one containing embedded malware**. Best case: device malfunctions; worst case: always-on backdoor in your network hardware.
- **Rootkits embedded by overseas suppliers:** pre-installed malware providing backdoor access once devices are active.
- **SolarWinds (2021):** attackers infiltrated the **SolarWinds Orion software update system** and used it to distribute malware to thousands of clients, including governments. Lesson: attackers compromise the **update mechanism** to bypass even strong defenses (e.g., DoD).

### Mitigating supply chain attacks (4 things — memorize)
1. **Vendor due diligence** — especially vendors with access to critical systems/data; examine their security posture *and* their own supply chain management.
2. **Regular monitoring and audits** — early detection of suspicious activity.
3. **Education and collaboration** — share threats/vulnerabilities/best practices; joint defense with industry groups.
4. **Contractual safeguards** — contract language requiring security standards, with legal repercussions.

### CHIPS Act (2022) — know the numbers
- **~$280 billion** total funding to boost US semiconductor research and manufacturing.
- **$39 billion** in subsidies for US chip manufacturing.
- **25% investment tax credit** for manufacturing equipment.
- **$13 billion** for semiconductor research and workforce training.
- Goal: reduce reliance on **foreign-made semiconductors** and strengthen domestic supply chain resilience.

---

## 4. Vendor Assessment (Lesson 92) — HIGH-YIELD

- **Vendor assessment** = evaluating the security, reliability, and performance of external entities you rely on. A weak link in one vendor can reverberate across multiple businesses.

### Assessment methods (know each cold)
| Method | What it is |
|---|---|
| **Penetration testing of suppliers** | A **simulated cyberattack** against supplier systems to find exploitable vulnerabilities, the same way a real attacker would |
| **Right to audit clause** | Contract clause granting your organization the right to **evaluate the vendor's internal processes** and verify compliance with agreed standards (trust but verify) |
| **Internal audit** | The vendor's **self-assessment** against industry standards or organizational requirements |
| **Independent assessment** | Evaluation by a **third party with no stake** in the vendor (e.g., **ISO**) — neutral validation |
| **Supply chain analysis** | Deep dive into the vendor's **entire supply chain**, assessing the security and reliability of **each link** (counterfeit/tampered parts risk) |

> Exam tip: "trust but verify" is the mantra. Internal audits are commendable but may lack rigor → independent assessments add credibility.

---

## 5. Vendor Selection & Monitoring (Lesson 93)

### Selection
- **Due diligence** — rigorous evaluation beyond surface credentials: **financial stability, operational history, client testimonials, on-the-ground practices**.
- **Conflict of interest** — personal/financial relationships that could bias vendor-selection judgments. Mitigate by **requiring disclosures** or **excluding conflicted parties** from the decision.
- **Vendor questionnaire** — comprehensive document vendors complete so you can **compare vendors on standardized criteria** (e.g., data redundancy, security protocols, uptime guarantees, disaster recovery plans).
- **Rules of engagement** — guidelines dictating the **terms of interaction** with potential vendors: communication protocols, data-sharing policies, negotiation boundaries (e.g., deleting unsolicited proposals).

### Monitoring (after selection)
- **Performance reviews** — periodic evaluations of vendor deliverables against the **standards and objectives in the contract**.
- **Feedback loops** — **two-way communication channels** where both sides share feedback; leads to collaborative growth and refinement.

---

## 6. Contracts & Agreements (Lesson 94) — HIGH-YIELD

| Document | Purpose | Exam cue |
|---|---|---|
| **Basic contract** | Formally establishes a relationship; roles, responsibilities, repercussions for failure | The foundation stone |
| **SLA** (Service Level Agreement) | Defines the **standard of service** expected (e.g., downtime ≤ 2 hours/month); deviations → **penalties** | Uptime/downtime + penalties |
| **MOA** (Memorandum of Agreement) | **Formal**; outlines **specific responsibilities and roles** of each party | Formal + specific duties |
| **MOU** (Memorandum of Understanding) | **Less binding**; declaration of **mutual intent**, broad strokes | Intent, not commitment |
| **MSA** (Master Service Agreement) | **Blanket agreement** covering general terms across **multiple transactions**; supplemented by work orders/SOWs | Umbrella for repeat business |
| **SOW** (Statement/Scope of Work) | Details for a **particular project**: deliverables, timeline, milestones | Pairs with the MSA |
| **NDA** (Non-disclosure Agreement) | Keeps **sensitive information shared during negotiations confidential** | Discussing secrets before a deal |
| **BPA** (Business Partnership Agreement) | For entities pooling resources: profit sharing, decision-making structures, exit strategies; aka **Joint Venture (JV) agreement** | Partnership/revenue sharing |

> MOA vs MOU is a favorite exam trap: **MOA = formal and specific; MOU = informal intent.**

---

## 7. Likely Exam Scenarios

- "An organization wants the right to inspect a vendor's data-handling practices" → **right to audit clause**
- "A neutral body like ISO evaluates a data center" → **independent assessment**
- "Counterfeit chip repackaged into a device" → **chip washing**
- "Attackers compromised the software update mechanism to reach many clients" → **SolarWinds-style software supply chain attack**
- "Two organizations want to express intent to explore a partnership without binding details" → **MOU**
- "Document covering profit sharing and exit strategies between two firms" → **BPA / JV agreement**
- "Standardized document to compare cloud providers on redundancy and uptime" → **vendor questionnaire**

---

## 8. Rapid-Fire Self-Test (44 items)

1. Third-party vendor risk is introduced by which three external entity types? *(vendors, suppliers, service providers/MSPs)*
2. Which program ensures authentic, securely manufactured hardware for the DoD? *(Trusted Foundry)*
3. Why are secondary/aftermarket hardware sources risky? *(counterfeit/tampered devices, malware, backdoors)*
4. What makes open-source software easier to assess? *(full source code review possible)*
5. What must purchased software be checked for? *(licensing, authenticity, no known vulnerabilities, malware-scanned)*
6. What unique risk do SaaS providers pose? *(your data's confidentiality/integrity in their hands)*
7. Define a supply chain attack. *(targeting a weaker link to reach a primary target)*
8. What is chip washing? *(repackaging a chip's contents with a cheaper or malware-bearing chip)*
9. What's the worst-case outcome of a counterfeit chip? *(always-on backdoor in network hardware)*
10. What did the SolarWinds attackers compromise? *(the Orion software update system)*
11. Name the four mitigations for supply chain attacks. *(due diligence, monitoring/audits, education/collaboration, contractual safeguards)*
12. CHIPS Act total funding? *(~$280B)*
13. CHIPS Act manufacturing subsidies? *($39B)*
14. CHIPS Act investment tax credit? *(25%)*
15. CHIPS Act research/workforce funding? *($13B)*
16. CHIPS Act goal? *(reduce reliance on foreign semiconductors)*
17. Penetration testing of a vendor simulates what? *(a real cyberattack to find exploitable vulnerabilities)*
18. What does a right to audit clause grant? *(right to evaluate vendor's internal processes/compliance)*
19. An internal audit is the vendor's what? *(self-assessment)*
20. Who conducts an independent assessment? *(a neutral third party, e.g., ISO)*
21. What does a supply chain analysis examine? *(every link in the vendor's own supply chain)*
22. What is the cybersecurity mantra for vendor relations? *(trust but verify)*
23. What four things does vendor-selection due diligence examine? *(financial stability, operational history, testimonials, on-the-ground practices)*
24. How do you handle a conflict of interest in selection? *(disclosures; exclude conflicted parties)*
25. What's the purpose of a vendor questionnaire? *(standardized comparison of vendors)*
26. Rules of engagement cover what three areas? *(communication protocols, data sharing, negotiation boundaries)*
27. What are vendor performance reviews measured against? *(contract standards/objectives)*
28. Feedback loops are what kind of channels? *(two-way communication)*
29. What does a basic contract establish? *(relationship, roles, responsibilities, repercussions)*
30. What does an SLA define, and what happens on deviation? *(service standard; penalties)*
31. MOA vs MOU: which is formal? *(MOA)*
32. Which is a declaration of mutual intent? *(MOU)*
33. What does an MSA cover? *(blanket general terms across multiple transactions)*
34. What does an SOW specify? *(project deliverables, timeline, milestones)*
35. When is an NDA used? *(when sharing sensitive info before/without a formal partnership)*
36. What does a BPA outline? *(partnership nature, profit sharing, decision-making, exit strategies)*
37. BPA is also known as what? *(Joint Venture agreement)*
38. Vendor vs supplier vs MSP — which manages IT for you? *(MSP)*
39. Which entity provides parts used in production? *(supplier)*
40. Which entity sells finished goods/services (e.g., Microsoft)? *(vendor)*
41. Why is chip washing best case still bad? *(device malfunctions, network failures/crashes)*
42. What risk do overseas-manufactured devices carry per the lesson? *(pre-installed rootkits/backdoors)*
43. What makes internal audits insufficient sometimes? *(lack of rigor — need independent assessment)*
44. Supply chain security is whose job? *(everyone's — not just IT/security)*
