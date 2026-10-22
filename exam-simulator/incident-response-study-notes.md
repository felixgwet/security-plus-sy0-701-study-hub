# Incident Response — SY0-701 Study Notes (Section 24, OBJ 4.8)

## Incident Response Overview
- An **incident** = an act of violating an explicit or implied security policy (stolen password login, malware install, etc.).
- Primary goal: **minimize impact, reduce time to identify and contain, recover swiftly**.
- **NIST SP 800-61** defines FOUR phases: Preparation · Detection & Analysis · Containment/Eradication/Recovery · Post-Incident Activity.
- **CompTIA exam uses a SEVEN-phase model** — know this one:
  1. **Preparation** — harden systems, write policies/procedures, build the communication plan (encrypted, **out-of-band** comm paths), train/test staff, create **incident response kits**.
  2. **Detection** — determine whether an incident occurred; triage analysts categorize and assess severity.
  3. **Analysis** — examine scope and impact; notify stakeholders; begin initial response actions.
  4. **Containment** — limit scope/magnitude; stop spread (disconnect infected client, lock out user).
  5. **Eradication** — remove the malicious activity (delete malware, reinstall known-good image).
  6. **Recovery** — restore systems to normal secured state (known-good backups, patches, config updates); monitor for lingering threats.
  7. **Post-Incident Activity (Lessons Learned)** — RCA, lessons learned, after-action report.
- The process **loops** — new suspicious findings send you back to detection/analysis.

## Post-Incident Activity (3 actions)
1. **Root Cause Analysis (RCA)** — systematic identification of the incident's initial source to prevent recurrence. 4 steps: ① define/scope the incident → ② determine causal relationships → ③ identify an effective solution → ④ implement and track the solution. **No-blame approach** (NTSB model) — encourages honest reporting, finds systemic weaknesses.
2. **Lessons learned** — document what went right/wrong; improve processes (e.g. faster emergency change approvals).
3. **After-action report** — formal report containing the RCA + lessons-learned recommendations; technical detail or executive summary.

## Incident Response Team
- Core = experienced cybersecurity pros + temporary subject experts (e.g. DBA for a database incident). Large orgs: dedicated teams; small orgs: ad-hoc additional duty.
- Team composition: **leader (skilled responder), SMEs, IT support, legal counsel, HR, PR**.
- Management provides funding/resources and makes critical business decisions + communications.
- **Outsourced IR** is effective but expensive and the outsiders must learn your network first.

## Threat Hunting
- **Proactive** search for threats that bypassed normal monitoring — assumes your existing rules/signatures **failed to alert**.
- Starts with a **hypothesis** from threat modeling: who would attack us, how, with what impact? Combine with **threat intelligence**.
- Profile threat actors/TTPs (insider, hacktivist, criminal org, nation-state APT).
- Hunt in the **SIEM**: logs, processes, file systems, registry changes. Look for things **without signatures** — new TTPs → create new IoCs.
- Fuel: **advisories and bulletins** (vendor/researcher publications on new TTPs/vulns) + **intelligence fusion and threat data** (IoC/TTP feeds correlated with SIEM logs).
- Example flow: advisory on new malware → hunt for outbound C2 traffic → check suspect hosts' process lists → compare infected hosts → identify execution method → block vector (allowlisting or blocklist) → build new IPS signatures.
- Benefits: improves detection capability; converts findings into new rules/IoCs. Costly in time/resources.

## Training vs Testing vs Simulation
- **Training** = education on processes/procedures/priorities. Role-based: first responders (technical), managers/executives (risk decisions, comms with law enforcement/media), end users (how to report phishing; remedial training if clicked).
  - Incorporate **lessons learned** into training; include soft skills/team building.
- **Testing** = practical exercises proving people can execute procedures. Three forms:
  - **Tabletop exercise (TTX)** — discussion-based scenario walk-through around a table; cheap but theoretical, no hands-on. Can be **red team vs blue team** back-and-forth.
  - **Penetration test** — red team conducts a scenario-based intrusion tied to threat modeling with a **specific goal**; requires agreed **methodology and rules of engagement** (e.g. DDoS usually excluded). Tools: **Metasploit, Cobalt Strike, Kali Linux, ParrotOS, Commando OS** — if defenders see these on the network, think pentest or attacker.
  - **Simulation / full-scale exercise** — realistic hands-on multi-stage scenarios (simulated phishing/ransomware up to multi-site breaches with law enforcement/PR); tests decisions under pressure, communication, and plan gaps. Expensive (full-scale can cost hundreds of thousands).

## Digital Forensic Procedures (4 phases)
1. **Identification** — secure the scene (safety first, e.g. with police), prevent contamination, photograph/document, determine scope of evidence (tablet? server? smart TV?).
2. **Collection** — with proper **authorization** (law enforcement = warrant; enterprise = CIO/CSO/CEO approval). Follow **order of volatility** and preserve **chain of custody**.
3. **Analysis** — repeatable methods/tools on the forensic copy; strict documented protocols; find hidden files, timestamps, user actions.
4. **Reporting** — document methods, tools, actions, findings, conclusions; analyst must be prepared to **testify in court**.

### Order of Volatility (NIST SP 800-86) — collect most-volatile FIRST
1. **System memory** (CPU registers/cache, RAM)
2. **System state** (configs, active sessions — data obtainable without altering state)
3. **Storage devices** (HDD/SSD — non-volatile but changing)
4. **Network traffic and logs**
5. **Remotely stored archives** (backups, cloud, printouts — least volatile)

Extended practitioner view: CPU registers/cache → memory (routing tables, ARP caches, process tables, swap) → mass storage → remotely logged data (SIEM) → physical config/topology → archival media (backup tapes, CDR).
- **Windows registry warning**: much of it is on disk, but **HKLM\Hardware lives only in memory** — capture via memory dump first. The HARDWARE hive records every disk ever connected (find that thumb drive!).

### Key Evidence Concepts
- **Chain of custody** — documented, verifiable record of evidence handling from collection to court; every handler documents actions/transfers. Breaks = evidence may be inadmissible.
- **Disk imaging** — bit-by-bit copy of a device (including deleted files and unallocated space); original stays untouched; analyze the image. Lab: `dd` with a **write blocker**, then `md5sum`/SHA-1/SHA-256 hash (MD5 is weak — prefer SHA). **FTK Imager** creates raw DD images (usable by any tool; E01=EnCase, AFF=FTK), chunks at ~1.5 GB, auto-verifies hashes; deleted files (marked X) recoverable; unallocated/slack space inspected.
- **File carving** — extracting files/fragments without relying on the file system (when metadata is missing/corrupt).
- **Data acquisition** — methods/tools to create a forensically sound copy. Legal right to seize first — **BYOD devices complicate consent**; some data only exists while powered on.
- Collection checklist: capture/hash images (FTK Imager), analyze with **FTK/EnCase**, screenshot the machine, review network captures, pull CCTV if trespass suspected, consider volatility order, witness statements, licensing/docs review, track man-hours and costs.
- **Legal hold** — formal notification when litigation is reasonably expected; freeze/preserve all potentially relevant data; destruction = severe legal consequences.
- **Preservation** — proactive protection of evidence (backups, isolation, access controls; don't overwrite/delete/modify).
- **E-discovery** — identify, collect, and produce electronically stored information for litigation.
- Appoint a **legal liaison** (in-house counsel) for law enforcement interaction.
- **Forensic code of ethics — 3 principles: avoid bias, repeatable actions, preserve evidence.** Use an analyst removed from the case (collectors vs examiners separation) to minimize bias; document every action (time, command, result, screenshot) so others can reproduce; always analyze the image, never the original.

## High-yield exam triggers
- "Seven phases of incident response" → Preparation, Detection, Analysis, Containment, Eradication, Recovery, Post-Incident Activity.
- "Collect first" → **CPU registers/cache and memory** (order of volatility).
- "Documented evidence-handling record" → **chain of custody**.
- "Bit-by-bit copy including deleted files" → **disk imaging**; analyze the image, not the original.
- "Extract files with no file system metadata" → **file carving**.
- "Proactive, assumes alerts failed" → **threat hunting**.
- "Scenario-based intrusion with rules of engagement" → **penetration test**.
- "Discussion-only exercise" → **tabletop (TTX)**.
- "Litigation expected — freeze data" → **legal hold**.
- "No-blame investigation" → **root cause analysis** culture.
