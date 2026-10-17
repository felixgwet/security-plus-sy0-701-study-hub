# Cyber Resilience and Redundancy — SY0-701 Study Notes (Section 14 · OBJ 3.4)

Exam weighting: Domain 3 (Security Architecture). Objective 3.4: *explain the importance of resilience and recovery in security architecture.* Heavy on RAID levels, power terminology, backup types, site types (hot/warm/cold), and testing methods — expect several questions from this objective.

---

## 1. Core Definitions (Lesson 122)

- **Cyber resilience** — the entity's ability to **continuously deliver the intended outcome despite adverse cyber events**.
- **Redundancy** — having **additional systems, equipment, or processes** to ensure continued functionality if primary ones fail.
- Redundancy reduces the chance of total system failure: backups take over when primaries fail.

---

## 2. High Availability (Lesson 123)

**High availability (HA)** — a service's ability to be continuously available by minimizing downtime to the lowest amount possible.

**Uptime** — measured as a percentage:
- **Five nines = 99.999%** → max ~**5 minutes downtime/year** (the gold standard)
- **Six nines = 99.9999%** → ~**31 seconds/year** (some cloud networks)

**Four HA mechanisms (know the differences):**

| Mechanism | What it does |
|---|---|
| **Load balancing** | Distributes workloads across multiple computing resources — optimizes resource use, maximizes throughput, minimizes response time, prevents overloading any single resource. All requests hit the load balancer first; it redirects them. |
| **Clustering** | Multiple computers/storage devices/network connections working together **as a single system** for availability, reliability, scalability. Focus: **no single point of failure** — keeps an application available even on hardware failure. |
| **Redundancy** | Duplication of critical components/functions to increase reliability: multiple power supplies, network connections, servers, services, providers. |
| **Multi-cloud** | Distributing data/apps/services across several cloud environments — mitigates single-provider outage risk, enables cost optimization, **avoids vendor lock-in**. Requires consistent data management, unified threat management, consistent policy enforcement across clouds. |

**Load balancing vs clustering (classic exam distinction):**
- Load balancing = handles **excess traffic** (performance, distribution)
- Clustering = provides **redundancy on failure** (continuity)
- Combined: load balancer manages resources normally; clustering takes over on component failure.

**Redundancy sub-types:**
- **Power supply redundancy** — two PSUs in a server; facility with UPS, generator, or connections to 2+ power grids
- **Network redundancy** — multiple cabled connections or cable + wireless
- **Server/service redundancy** — load-balanced or clustered; workload shifts seamlessly if an instance fails
- **Provider diversity** — 2+ ISPs or service providers (e.g., Stripe + a backup credit card processor; two domain controllers as primary/secondary so one can be patched while the other serves users)
- Caveat: redundant hardware for everything doubles cost — balance with software/cloud redundancy.

---

## 3. Data Redundancy — RAID (Lesson 124)

**RAID** = Redundant Array of Independent Disks — combines multiple physical disks into **one logical device** the OS sees.

| RAID | Keyword | Min disks | Can lose | Notes |
|---|---|---|---|---|
| **RAID 0** | **Striping** | 2 | **0 — NO redundancy** | Pure performance. Only RAID with no fault tolerance. One disk dies = all data lost. |
| **RAID 1** | **Mirroring** | 2 | 1 | Identical copy on both disks. Least downtime — complete copy ready instantly. 50% storage overhead. |
| **RAID 5** | **Striping with parity** | 3 | 1 | Parity striped across array; surviving disks reconstruct data (slower until rebuild). Supports **hot swap** — replace failed disk while server runs, then rebuild. |
| **RAID 6** | **Striping with double parity** | 4 | **2** | "One better than RAID 5" — two parity blocks. Survives two simultaneous disk failures. |
| **RAID 10 (1+0)** | **Striped array of mirrored arrays** | 4 | Up to 2* | RAID 1 sets first, then RAID 0 stripe across them. Performance + fault tolerance. *Only if the two failures are NOT in the same mirrored pair; after one-per-mirror loss it keeps running but has no fault tolerance left — replace drives fast. |

**Tolerance classifications (know these tiers):**
- **Failure-resistant** — withstands hardware malfunctions without losing data, via **mirroring** → RAID 1, RAID 10
- **Fault-tolerant** — continues operating **with no downtime** despite hardware failure, via mirroring or striping with parity → RAID 1, 5, 6, 10
- **Disaster-tolerant** — protects against **catastrophic events** using **two independent zones** with full access to all data → RAID 1, RAID 10 (full mirrors)

### RAID Demo (Lesson 125)
- Windows Disk Management: **New Striped Volume** = RAID 0 (two 800GB disks → one ~1.6TB drive D "editing"); **New Mirrored Volume** = RAID 1 (two disks → one disk's worth of space, drive R "redundant", 50% overhead).
- Trade-off in one line: *performance and double space (RAID 0) vs redundancy and half space (RAID 1).*

---

## 4. Capacity Planning (Lesson 126)

**Capacity planning** — strategic planning ensuring the organization is equipped to meet future demands at the right time, cost-effectively. **Four elements:**

1. **People** — analyze current personnel skills/capacity; forecast hiring, training, downsizing. Right number of people with right skills. (Retail hiring 20 seasonal workers Oct 1, offboarding after Jan 1.)
2. **Technology** — understand current software/hardware, utilization rates, future demands; can existing tech handle projected growth? Cloud enables scaling up for promotions and back down afterward.
3. **Infrastructure** — physical space and utilities: offices, warehouses, production facilities, data centers. (Server rack space, power draw, heat calculations; declined on-prem installs that could live in the cloud, saving space for low-latency needs.)
4. **Processes** — workflows withstand demand fluctuations (up OR down); streamline via automation or outsourcing. (Automating 500 simultaneous user account creations instead of manual onboarding bottleneck.)

Telemedicine example ties all four: train/hire staff (people), secure compliant platform scaled for traffic (technology), dedicated consultation spaces (infrastructure), new scheduling/follow-up workflows and privacy-aligned data procedures (processes).

---

## 5. Powering Data Centers (Lesson 127)

**Five power conditions (memorize):**

| Condition | What it is | Example (120V baseline) |
|---|---|---|
| **Surge** | Small, unexpected **increase** in voltage | 125–130V |
| **Spike** | **Short transient** voltage spike — short circuit, tripped breaker, outage, **lightning** | jumps to 150V, 175V+ |
| **Sag** | Small, unexpected **decrease** in voltage, short duration | 120V → 115–117V (may stay online; harms hardware over time) |
| **Undervoltage** (brownout) | Voltage reduced to **lower levels for a longer period** | 120V → 70–80V (systems go offline) |
| **Power loss** (blackout) | **Total loss** of power | complete outage; **restoration can cause a spike** |

**Protection infrastructure:**
- **Line conditioner** — smooths minor fluctuations (surges, sags, pronounced undervoltage); delivers clean power at the expected level. Cannot sustain systems through major undervoltage or full power failure.
- **UPS (uninterruptible power supply)** — emergency power when normal input fails; provides line-conditioning functions + battery backup. Runtime: typically **15–60 minutes** (rack-mounted ~10–15 min). Buys time — not a long-term solution.
- **Generator** — converts mechanical energy into electrical energy (electromagnetic induction). Three varieties:
  - **Portable gas engine** — cheapest to operate; noisy, high-maintenance; extension-cord powered; small loads only
  - **Permanently installed** (diesel/propane/natural gas) — backbone of data center emergency power; whole-building power for hours/days/weeks; **auto-starts** in ~30–60 seconds
  - **Battery inverter** (lead-acid, NiCd, lithium-ion) — quiet, low-maintenance; short duration/low wattage; **bridges the gap** until long-term generators come online
- **PDC (power distribution center)** — centralized hub receiving and distributing power; integrated circuit protection, monitoring, load balancing; integrates with UPS and generators for seamless backup transition.

Typical layered design: utility → PDC (conditioning/load balancing) → rack UPS (battery, 10–15 min) → servers; generators auto-start in 30–60s and take the load from the PDC.

---

## 6. Data Backups (Lesson 128)

Golden rule: **never put all your eggs in one basket.** A backup = duplicate copies of digital information protecting against loss, corruption, unavailability.

**Seven concepts:**

1. **Onsite vs offsite**
   - **Onsite** — backups in your own facility; fast restores, but destroyed with the building in a fire/flood
   - **Offsite** — geographically separate copies (cloud, or tapes shipped to a remote facility) — protection against physical disasters. (War example: nightly tape backups, weekly shipment 1,000 miles away, outside missile range.)
2. **Frequency** — ask: *how much data am I willing to lose?* Set by **RPO** (recovery point objective): RPO of 1 hour → backup at least hourly; RPO of 2 days → daily backups fine. Also weigh data change rate vs time/storage/bandwidth/cost.
3. **Encryption** — **data-at-rest** (encrypted on the storage device) AND **data-in-transit** (protected while moving to/from the backup destination). Stolen encrypted media stays unintelligible without the key.
4. **Snapshots** — point-in-time copies recording **only changes since the previous snapshot**; more efficient, quicker, enables rollback to a known-good state. Ideal for databases/file servers where consistency is critical. (Not a full copy like a traditional backup.)
5. **Recovery** — the ultimate goal. Steps: **select the right backup → initiate recovery → validate data integrity → test the recovery process → document and report → notify stakeholders**. Best practice: **practice recovery at least once per month** — untested backups may be useless.
6. **Replication** — **real-time or near-real-time** copies; data lives in two places simultaneously. One server crashes, the other continues **without interruption**. For HA environments that can't afford downtime. (Periodic vs continuous is the key distinction from backups.)
7. **Journaling** (change tracking/logging) — meticulous record of **every change** to data over time; enables precise point-in-time recovery, granular rollback for legal proceedings/compliance audits; valuable in databases for the audit trail. Manage granularity, journal size, retention, and tamper-proofing.

---

## 7. Continuity of Operations Plans (Lesson 129)

Two major terms:
- **BCP (Business Continuity Plan)** — plans/processes for responding to a **disruptive event** (incident); covers non-technical disruptions too (lost merchant account, riots blocking the office). Preventative actions + recovery steps.
- **DRP (Disaster Recovery Plan)** — plans/processes for responding to a **disaster**; a **subset of the BCP**. Focus: resuming operations quickly after disasters (hurricanes, fires, floods, earthquakes).

Selection rule: incident → BCP; disaster → DRP. Often managed together as **BC/DR**.

**Ownership and development:**
- **Senior management** owns BCP development — without their support it stalls. They set goals and risk acceptance based on **risk appetite and risk tolerance**.
- Senior management appoints a **business continuity coordinator** who leads the **business continuity committee** — with representatives from **technology, legal, security, communications**, and other departments (NOT just IT — continuity covers the whole business).
- The committee determines recovery priorities, identifies and prioritizes systems needed for continuity, reports to senior management.
- **Define scope** to avoid scope creep; large orgs may split the plan by business function or geography, but pieces must operate coherently.

Real-world patterns: AWS multi-region/multi-AZ hosting for hurricane-prone Orlando; staff split US/Philippines covering for each other's floods and outages (geographic dispersion of people).

---

## 8. Redundant Site Considerations (Lesson 130)

**Four (plus two) site types:**

| Site | What it is | Switchover | Cost |
|---|---|---|---|
| **Hot** | Fully equipped, **up and running continuously**; switch with almost no downtime; data constantly mirrored | Instant | **Most expensive** — "two of everything" |
| **Warm** | Fundamentals in place (power, phone lines, network, maybe desks) but no installed computers/phones; equipment bought after disaster | **Days** | Middle |
| **Cold** | Empty shell — the course example: leased building with bathrooms, tables, chairs; **no network, phones, or computers** | **1–2 months** | Cheapest |
| **Mobile** | Portable units (trailers/tents) delivered to you; can be hot, warm, or cold depending on configuration | Varies | Varies |

- Hot sites are usually reserved for **mission-critical functions only** (50 essential staff, not 500). Hybrid models: hot for critical, warm/cold for the rest.
- **DJC2** (Deployable Joint Command and Control) — US military mobile command center: delivered anywhere in ~**72 hours**, functionality in 24h, full services in ~7 days; powered by generators, portable AC; supports ~200 people. Deployed to Haiti after the 2010 earthquake.
- **Virtual sites** — cloud-based versions of hot/warm/cold:
  - Virtual hot = fully replicated, instantly accessible cloud environment
  - Virtual warm = partially replicated, quickly scaled up
  - Virtual cold = critical data/config stored, resources activated only on disaster (minimizes ongoing cost)
- **Platform diversity** — different OSes, network equipment, or cloud providers at redundant sites vs primary:
  - Same platform everywhere = easier support, lower cost — but a Cisco-specific vulnerability could kill BOTH primary and hot site
  - Different platforms = immune to single-vendor flaws; more complexity and support cost
  - Cloud provider diversity = spread across providers or regions to survive platform-specific outages; also pricing leverage and geographic reach
- **Geographic dispersion** — spread resources across locations for higher redundancy.

Also from the lesson's example: internet redundancy in layers — microwave link (primary), cable company (secondary), cellular modem ~20 Mbps (tertiary). Failover between them in seconds. Power: solar → battery → generator → grid.

---

## 9. Resilience and Recovery Testing (Lesson 131)

- **Resilience testing** — assesses a system's ability to **withstand and adapt** to disruptive events.
- **Recovery testing** — evaluates a system's capacity to **restore normal operations** after a disruptive event.
- Both are a "fire drill" for networks and operations. Four methods:

| Method | What it is | Cost/effort |
|---|---|---|
| **Tabletop exercise** | Scenario-based **discussion** among key stakeholders around a table; a facilitator announces an **exercise inject** (e.g., domain controller compromised by a nation-state actor); teams discuss responses. No real deployment. Gaps become SOPs/playbooks. Low cost, engaging, team-building. | Lowest |
| **Failover test** | Controlled experiment **actually cutting over** from primary to backup/secondary (e.g., East Coast DC → West Coast hot site). Verifies the plan truly works. Needs a **rollback plan**. More resources/time/energy. | High |
| **Simulation** | Computer-generated/artificial environment mimicking the real system (e.g., cloud replica of the corporate network); red team attacks while blue team detects/responds. Tests people under realistic chaos; observer feedback after. | Medium-high |
| **Parallel processing** | Replicate data and processes to a **secondary system and run BOTH simultaneously**; verifies the secondary can handle processing without disrupting operations. Zero-disruption goal — meticulous planning required. | Medium |

- These are **not one-time**: test, adapt, improve routinely. Resilience is an ongoing journey, not a checkbox.

---

## Rapid-Fire Exam Facts

1. Five nines = 99.999% = ~5 min/year; six nines ≈ 31 sec/year.
2. Load balancing = traffic distribution; clustering = single-system failover; both combine.
3. Provider diversity: two ISPs, Stripe + backup processor, primary/secondary domain controllers.
4. Multi-cloud avoids vendor lock-in — but demands unified management/policy.
5. RAID 0 = striping, no redundancy, 2+ disks, zero loss tolerance.
6. RAID 1 = mirroring, 2 disks, lose 1, 50% overhead.
7. RAID 5 = striping + parity, 3+ disks, lose 1, hot swap supported.
8. RAID 6 = double parity, 4+ disks, lose 2.
9. RAID 10 = stripe of mirrors, 4+ disks, lose 2 (not from the same mirror pair).
10. Failure-resistant = mirroring (RAID 1/10); fault-tolerant = no downtime (1/5/6/10); disaster-tolerant = two independent full-access zones (RAID 1/10).
11. Capacity planning = people, technology, infrastructure, processes.
12. Surge = small voltage increase; spike = short transient (lightning); sag = small decrease; undervoltage/brownout = lower voltage, longer time; blackout = total loss (restoration can spike!).
13. Line conditioner = clean power, minor fluctuations; UPS = battery 15–60 min (line conditioning included); generators = long-term (portable gas / permanent diesel-propane-gas auto-start 30–60s / battery inverter bridges the gap); PDC = distribution hub with protection, monitoring, load balancing.
14. Onsite = fast restore, dies in the fire; offsite = survives the disaster.
15. Backup frequency is set by RPO: 1-hour RPO → hourly backups.
16. Encrypt backups at rest AND in transit.
17. Snapshots record only changes since last snapshot; great for DBs.
18. Recovery steps: select → restore → validate → test → document → notify; practice monthly.
19. Replication = real-time/near-real-time, two places at once, no interruption.
20. Journaling = every-change log for granular rollback and audit trails.
21. BCP = disruptive events/incidents (+ non-technical); DRP = disasters; DRP ⊂ BCP; BC/DR together. Senior management owns it; cross-functional committee; watch scope creep.
22. Hot = instant, most expensive; warm = days; cold = weeks/months, cheapest; mobile = trailers/tents (DJC2: 72h delivery, 7 days full, 200 people).
23. Virtual hot/warm/cold = cloud equivalents.
24. Platform diversity: same vendor = easy but shared-vulnerability risk; different = resilient but complex.
25. Testing: tabletop (talk), failover (real cutover + rollback plan), simulation (virtual environment, red vs blue), parallel processing (both systems run together). Test routinely, forever.
