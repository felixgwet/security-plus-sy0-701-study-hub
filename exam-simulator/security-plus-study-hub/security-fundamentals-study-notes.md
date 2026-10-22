# Security Fundamentals — Study Notes (Section 02)

> Based on the course's Section 02 lecture ("Fundamentals of Security") — SY0-701 Domain 1, objectives 1.1 and 1.2. This is the foundation every other section builds on.

---

## 1. Security vs. Usability (The Core Tension)

- Security and convenience are **always at odds**. Make something more secure → less usable; make it more convenient → less secure.
- Classic example: ISP-provided Wi-Fi routers ship with a long random password (secure, hard to memorize) — so users change it to `magic2912` (convenient, easy to crack). Some routers even **print the password on the device itself**.
- Users will actively **bypass controls** that make their jobs harder — plan for this human factor in every security decision.
- The business cost is real: in 2022 the average major-company data breach cost **$4.35 million**.
- The goal ("sweet spot"): easy enough for legitimate users, hard enough that threat actors can't get in.

## 2. Two Definitions the Exam Loves to Contrast

| Term | Protects | Example |
|---|---|---|
| **Information security** | The **data/information itself** — protecting it from unauthorized access, unlawful modification, disruption, disclosure, corruption, destruction | Encrypting sensitive files |
| **Information system security** | The **systems that hold and process** the data | Hardening the server, network device, or smartphone that stores the data |

Exam cue: data itself → information security; the devices holding it → information system security.

## 3. The CIA Triad — and Its Modern Extension

| Pillar | Means | Example |
|---|---|---|
| **Confidentiality** | Information accessible only to authorized parties | Encrypting files so only authorized people can decrypt and read them |
| **Integrity** | Data stays accurate and unaltered unless modification is required | Checksums verify a file was not changed/corrupted in transit |
| **Availability** | Resources accessible and functional when needed | Website redundancy keeps it online under high traffic |

**Expanded model — C.I.A.N.A:** the triad has grown to include:
- **Non-repudiation** — guaranteeing an action/event took place and **cannot be denied** by the parties involved. Example: a **digitally signed email** — the sender cannot deny sending it.
- **Authentication** — verifying identity. (Leads directly into the AAAs below.)

## 4. The AAAs of Security

- **Authentication** — verifying the **identity** of a user or system. Example: username + password checked against a stored version at login.
- **Authorization** — determining **what actions/resources** an authenticated user may perform. Example: you may have read permission on database records but not write/edit.
- **Accounting** — **tracking** user activities and resource utilization, typically for **auditing or billing**. Example: logging all user activity on the network to detect unusual or unauthorized behavior.

Order matters: authenticate (who are you?) → authorize (what may you do?) → account (what did you do?).

## 5. Security Controls

**Definition:** measures or mechanisms put in place to **mitigate risks** and protect the CIA of information systems and their data.

**Categories (by nature):**
- **Technical** — technology-based (firewalls, encryption, access control lists)
- **Managerial** — administrative/management processes (policies, risk assessments, standards)
- **Operational** — day-to-day procedures (awareness training, physical security procedures)
- **Physical** — tangible protections (locks, guards, fences)

**Types (by function):**
- **Preventative** — stops an incident before it happens (firewall, encryption)
- **Deterrent** — discourages attackers (warning banners, visible cameras)
- **Detective** — identifies/discovers incidents (IDS, log monitoring, CCTV review)
- **Corrective** — restores after an incident (backups, patching, failover)
- **Compensating** — alternative control when the primary is not feasible
- **Directive** — directs/guid behavior (policies, signage, procedures)

## 6. Zero Trust

- **Principle: trust no one by default** — no user, inside or outside the organization, is trusted automatically. **Everyone must be verified** before accessing resources.
- Achieved through two planes:
  - **Control plane**: adaptive identity, threat scope reduction, policy-driven access controls, secured zones.
  - **Data plane**: subject and system, **policy engine**, **policy administrator**, and **policy enforcement points** (PEPs).

---

## Key Takeaways

1. Security vs. usability is a permanent trade-off — users bypass controls that are too painful, so design for the sweet spot.
2. **Information security = protect the data; information system security = protect the systems holding it.**
3. CIA triad + **N**on-repudiation + **A**uthentication = the modern pentagon; the AAAs (authentication → authorization → accounting) flow from it.
4. Know the four control **categories** (technical, managerial, operational, physical) and six **types** (preventative, deterrent, detective, corrective, compensating, directive).
5. **Zero trust = verify everyone**, every time — control plane (policy decisions) + data plane (policy enforcement).
