# Security Fundamentals — Study Notes (Section 02)

> Based on all 13 lectures of the course's Section 02 (lectures 04–16) — SY0-701 Domain 1, objectives 1.1 and 1.2. This is the foundation every other section builds on: the exam assumes you can classify controls, apply the AAA model, and reason about CIA/C/I/A/N/A in any scenario.

---

## 1. Security vs. Usability (The Core Tension)

- Security and convenience are **always at odds**. Make something more secure → less usable; make it more convenient → less secure.
- Classic example: ISP-provided Wi-Fi routers ship with a long random password (secure, hard to memorize) — so users change it to `magic2912` (convenient, easy to crack). Some routers even **print the password on the device itself**.
- Users will actively **bypass controls** that make their jobs harder — plan for this human factor in every security decision.
- The business cost is real: in 2022 the average major-company data breach cost **$4.35 million** (IBM figure).
- The goal ("sweet spot"): easy enough for legitimate users, hard enough that threat actors can't get in.

## 2. Information Security vs. Information System Security

| Term | Protects | Example |
|---|---|---|
| **Information security** | The **data/information itself** — protecting it from unauthorized access, unlawful modification, disruption, disclosure, corruption, destruction | Encrypting sensitive files |
| **Information system security** | The **systems that hold and process** the data | Hardening the server, network device, or smartphone that stores the data |

Exam cue: data itself → information security; the devices holding it → information system security.

## 3. Threats and Vulnerabilities (OBJ 1.2)

| Term | Definition |
|---|---|
| **Threat** | Any activity or event with the **potential to cause harm** to an information system, the data it holds, or the organization. |
| **Vulnerability** | A **weakness** that could be exploited to cause harm. |
| **Risk** | The **likelihood** that a threat will exploit a vulnerability, combined with the **impact** if it does. |

- **Threats** come from three sources: **natural** (earthquake, flood, tornado), **intentional/man-made** (attacks by threat actors), and **unintentional** (accidental deletion, misconfiguration).
- The chain to remember: a **threat** exploits a **vulnerability** → which creates a **risk** → mitigated by **controls** → protecting **assets**.

## 4. Confidentiality — Methods (OBJ 1.2)

Confidentiality = information is accessible **only to authorized parties**. Five methods the course lists:

1. **Encryption** — encode data so only authorized parties can read it (files, transmissions).
2. **Access controls** — restrict who can view/read the data (file permissions, role-based views).
3. **Data masking / tokenization** — hide portions of the data (showing only last 4 digits of a card number).
4. **Physical security** — locks, guards, badge readers that keep unauthorized people away from the data/hardware.
5. **Training and awareness** — teach people to protect sensitive information (clean desk, not discussing secrets publicly).

## 5. Integrity — Methods (OBJ 1.2)

Integrity = data stays **accurate and unaltered** unless modification is required. Five methods:

1. **Hashing** — compute a fingerprint of the data; any change changes the hash.
2. **Digital signatures** — prove the data came from a specific sender and wasn't altered.
3. **Checksums** — verify a file was not changed/corrupted in transit.
4. **Access controls** — restrict **who can modify** the data (separate from confidentiality's "who can see").
5. **Audits and audit trails** — review logs of who changed what and when.

Note for the exam: integrity protects data from **unauthorized modification** — not just corruption, but deliberate tampering.

## 6. Availability — "The Nines" and Redundancy (OBJ 1.2)

Availability = resources are **accessible and functional when needed**.

| Uptime | Downtime per year |
|---|---|
| 99% ("two nines") | 3.65 days |
| 99.9% ("three nines") | 8.76 hours |
| 99.99% ("four nines") | 52.56 minutes |
| 99.999% ("five nines") | 5.26 minutes |

**Four types of redundancy:**
1. **Geographic / site redundancy** — a second data center in another location takes over if the first fails.
2. **Hardware redundancy** — spare components ready to swap in (servers, drives, power supplies, RAID arrays).
3. **Software redundancy** — mirrored applications/services that keep running if one instance fails (clustering, failover).
4. **Data redundancy** — multiple copies of the data (backups, replication).

Also supporting availability: fault tolerance, RAID, clustering, load balancing, UPS + generator, and keeping systems patched.

## 7. Non-Repudiation (OBJ 1.2)

- **Non-repudiation** = guaranteeing an action or event took place and **cannot be denied** by the parties involved.
- Closely tied to **integrity** — if you can prove the data wasn't altered and who sent it, they can't deny it.
- Examples: a **digitally signed email** (the sender cannot deny sending it), a **signed contract**, hash verification of a file, audit/receipt logs.

## 8. Authentication — The Five Factors (OBJ 1.2)

Authentication = verifying the **identity** of a user or system — the **first A** of AAA. **Five factors:**

| Factor | Name | Examples |
|---|---|---|
| 1 | Something you **know** | Password, PIN, passphrase |
| 2 | Something you **have** | Smart card, hardware token, phone (OTP app) |
| 3 | Something you **are** | Biometrics — fingerprint, retina, face |
| 4 | Something you **do** | Behavior — typing cadence, mouse movement, gait |
| 5 | Somewhere you **are** | Location — geofencing, IP-based location |

- **MFA** = using **two or more factors from different categories**. Password + SMS code = MFA (know + have). Password + security question is **NOT** MFA (same category).
- Passwordless authentication (Windows Hello, FIDO2 keys) still maps onto these factors.

## 9. Authorization Models (OBJ 1.2)

Authorization = determining **what an authenticated user may do** — the **second A**.

| Model | Rule |
|---|---|
| **MAC** (Mandatory Access Control) | Labels/clearances — the **system** decides; users cannot change permissions (military: Top Secret/Secret) |
| **DAC** (Discretionary Access Control) | The **owner** of the resource decides who gets access (file sharing on your own folder) |
| **RBAC** (Role-Based Access Control) | Permissions attach to **roles** (HR, Finance, IT-Admin); join the role → get the permissions |
| **ABAC** (Attribute-Based Access Control) | Decisions from **attributes** — user dept, device type, time of day, location |
| **Rule-based** | Rules apply to **everyone** regardless of who they are ("no FTP after 6pm") |

Supporting idea: **least privilege** — give only the minimum access needed for the job.

## 10. Accounting (OBJ 1.2)

Accounting = **tracking** user activities and resource utilization — the **third A**.

- Purpose: **auditing** (who did what, when — for security investigations) and **billing** (usage metering).
- Common tools: **Syslog** (centralized log collection), **Wireshark** (packet capture/analysis), **SIEM** (correlates logs from across the network, alerts on anomalies).
- Order of the AAAs: authenticate (**who are you?**) → authorize (**what may you do?**) → account (**what did you do?**).

## 11. Security Control Categories (OBJ 1.1)

Controls are grouped by **nature** into four categories:

| Category | Nature | Examples |
|---|---|---|
| **Technical** | Technology-based mechanisms | Firewalls, encryption, access control lists, IDS |
| **Managerial** | Administrative/management processes | Policies, risk assessments, standards, procedures |
| **Operational** | Day-to-day operational procedures | Security awareness training, physical security procedures, maintenance |
| **Physical** | Tangible protections | Locks, guards, fences, badge readers, cameras |

## 12. Security Control Types (OBJ 1.1)

Controls are grouped by **function** into six types — the exam's favorite classification question:

| Type | Function | Course examples |
|---|---|---|
| **Preventative** | Stops the incident before it happens | Firewall, encryption, a **locked door** |
| **Deterrent** | Discourages an attack from being attempted | The burglar-alarm **sign** in the window, warning banners, lights, visible guards |
| **Detective** | Identifies/discovers the incident as it happens | The burglar **alarm** itself, IDS, CCTV, log monitoring |
| **Corrective** | Restores systems after an incident | Patching a vulnerability, restoring from backup, **antivirus quarantining an infected file** |
| **Compensating** | Alternative control used when the primary isn't feasible | Using a **VPN tunnel to protect a legacy system** that can't support modern encryption |
| **Directive** | Directs/guides behavior | An **acceptable use policy (AUP)**, signage, procedures |

Exam traps from this table: the alarm **sign** is deterrent but the alarm is detective; AV **quarantine** is corrective; a **VPN over legacy** is compensating; an **AUP** is directive.

## 13. Zero Trust (OBJ 1.2)

- **Core principle: never trust, always verify** — no user, device, or application is trusted by default, **inside or outside** the network. Everyone must be authenticated and authorized **every time**.
- Operates through two planes:
  - **Control plane** — defines and manages access: **adaptive identity** (real-time validation using behavior, device, location), **threat scope reduction**, **policy-driven access control**, **secured zones** (isolated environments for sensitive data). The control plane uses a **policy engine** (cross-references each request against its rule book of policies) and a **policy administrator** (establishes and manages those policies) to **decide** whether access is granted.
  - **Data plane** — **executes** the decisions: the **subject or system** (the individual/entity requesting access) and the **policy enforcement point (PEP)** (the gate that allows or denies the request at the resource).
- Related mantra: **assume breach** — design as if the attacker is already inside.

## 14. Gap Analysis and POA&M (OBJ 1.2)

Gap analysis = comparing **where you are** with **where you want to be**, then closing the gap. **Four steps:**

1. **Document the current state** — measure against established **baselines**.
2. **Define the desired state** — what the security posture should look like (from standards, regulations, business needs).
3. **Identify the gaps** — the difference between the two.
4. **Create a remediation plan** — a **POA&M (Plan of Action & Milestones)**: what will be fixed, by whom, and by when.

---

## Key Takeaways

1. Security vs. usability is a permanent trade-off — design for the sweet spot.
2. A **threat** exploits a **vulnerability** → creates **risk** → mitigated by **controls**.
3. CIA + **N**on-repudiation + **A**uthentication = the modern pentagon; the **AAAs** (authenticate → authorize → account) flow from it.
4. Authentication has **five factors** (know / have / are / do / somewhere) — MFA needs two **different** categories.
5. Authorization models: **MAC** (system labels), **DAC** (owner decides), **RBAC** (roles), **ABAC** (attributes), **rule-based** (rules for everyone).
6. **Four control categories** (technical, managerial, operational, physical) × **six control types** (preventative, deterrent, detective, corrective, compensating, directive) — know the course's exact examples.
7. **Zero trust = verify everything**, via the control plane (policy engine decides) and data plane (PEP enforces).
8. **Gap analysis:** current state → desired state → find gaps → **POA&M** to remediate.
