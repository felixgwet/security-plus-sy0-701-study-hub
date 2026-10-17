# Investigating an Incident — SY0-701 Study Notes (Section 25, OBJ 4.9)

> The exam's hardest objective: you'll be given a **log snippet** and must identify the attack and recommend remediation. Practice reading each log type below.

## Core Data Sources Overview
- **SIEM**: aggregates sensor data for real-time analysis. Key concepts: **sensors** (monitored endpoints feeding data), **sensitivity** (how much is logged — too much overloads processing/bandwidth/storage), **trends** (e.g. rising failed logins = possible brute force), **alerts** (threshold notifications like "5 failed logins"), **correlation** (normalize IPs/hostnames AND **time — use UTC** across systems).
- **Log types**: network, system, application, security (failed/successful logins), web/proxy (sites visited, files touched), DNS (who resolved what), authentication (logon/logoff success/fail), **dump files** (memory contents written to disk on crash), VoIP (call metadata/recordings).
- **Syslog family** — central log collection: **Syslog / Rsyslog / Syslog-ng** are Linux/Unix-only. **NXLog** is **cross-platform (Linux, Unix, Windows) and open source** — the exam differentiator.
- **Linux logging**: `journalctl` queries systemd's `journald` daemon logs.
- **Flow protocols**: **NetFlow** (Cisco, proprietary; traffic metadata/summarization — who, where, how much, NOT contents), **sFlow** (Sampled Flow, open standard; captures 1 of N packets), **IPFIX** (IETF standard; used by billing/accounting — e.g. $10/GB metering).
- **Metadata** = data about data (phone bill analogy: who/when/how long, not content). Types: email (senders, servers transited), mobile, web (sites visited, time on page), file (creator, dates, size).

## Reading Dashboards (Splunk example)
- Dashboards in the SOC = single pane of glass. Elements: notables by category (access, endpoint, network, identity), **urgency levels** (unknown, informational, low, medium, high, critical), trends over time, top hosts by notable events.
- Red/up = bad. A spike from ~100 to ~1000 endpoint events = investigate that host (drill down by clicking).

## Automated Reports (EDR daily report example)
- Fields: report ID, generation date, report period, prepared-by, **executive summary** (read first to decide if it needs you), alerts by severity, incident analysis (threat trends, user behavior, data-flow anomalies), recommendations, conclusion, appendix (log snippets, IPs/domains).
- Worked examples: **Critical** — 4:53 a.m. rapid file access matching ransomware footprint → user suspended, host isolated, backup initiated. **High** — 20+ failed admin logins in <5 min on the DC from an *internal* IP → block IP, reset password (insider or already-compromised host). **Moderate** — large outbound transfer to threat-intel-flagged IP → terminate connection, review (could be offsite backup = benign). **Informational** — FileZilla install with hash mismatch → app whitelisting blocked it; confirm with user (policy violation vs. compromised account if user denies).

## Vulnerability Scan Reports
- Header: report ID, scan date/time, scanner + definition versions, operator. **Executive summary** highlights themes (e.g. 50/100 hosts missing a 5-year-old patch = patch management problem). Findings listed critical→informational or by most-vulnerable host.
- **Always validate findings manually** — scanners produce false positives (Mac flagged for missing a Windows patch) and miss your compensating controls.
- Authenticated vs unauthenticated attacker matters (authenticated RCE needs insider/credentials; unauthenticated RDP RCE = anyone). CVSS reflects impact scope too (Exchange server > single desktop).
- If no patch exists or the platform can't take it → **compensating controls**.
- **Context changes priority**: server being decommissioned tomorrow = deprioritize its critical CVE.
- Look up CVEs at **cve.org**. Remediation examples: MS21-087 hotfix; disable RDP if unused; Apache Druid/Spring/Log4j updates (Log4Shell = CVE-2021-44228, fixed in Log4j 2.15.0+).
- Recommendations: patch high immediately, medium next maintenance window, low per standard cycle.

## Packet Capture Analysis (columns: No. · Time elapsed · Source · Destination · Protocol · Length · Info)
- **Record the capture start time** to correlate with SIEM (timestamps are elapsed-time offsets).
- Capture 1: SYN packets from one source to a sequence of destination ports (80, 23, 22, 21, 443...) = **Nmap port scan** (reconnaissance).
- Capture 2: SYN flood from ONE source, no SYN-ACK/ACK replies = **DoS (SYN flood)** — half-open connections exhausting the server.
- Capture 3: same destination hammered by MANY different sources (.101, .102, .103...) = **DDoS** (botnet).
- Exam tip: in a 10-line snippet ask "what are they showing me?" — same source+scanning ports = scan; one source+incomplete handshakes = DoS; many sources+one victim = DDoS.

## Firewall Logs
- **Layer 4 firewall log**: date/time, src/dst IP, src/dst port, protocol, action. One external IP incrementing source ports (54321, 54322...) while stepping through destination ports (22→80→443→8080), all blocked = **port scan**.
- **Web application firewall (Layer 7, deep packet inspection)** log: method (GET/POST), URI, status code. **200** = OK; **403 Forbidden** = understood but refused (WAF blocked). SQLi tells: `'OR '1'='1' --`, `DROP TABLE users` (destructive), `WAIT FOR DELAY` (time-based blind), `SELECT COUNT(*) FROM sysusers` (info gathering).
- **SQL injection mitigation = WAF** with input sanitization between users and the database.

## Application Logs (Word processor example)
- Normal: document open/save, templates, print jobs, email sends. **Malicious**: macro execution attempt **blocked** (event 5400) → macro security alert (5401) → macro scanned, **matches known malware** (5402) → file **quarantined** (5403) → admin alert (5409). The flagged file = **Q3-Financials.docx**.

## Endpoint Logs (malware infection chain)
- Browser opened → download **setup.exe** → AV flags suspicious → **user overrides** → stage 1 **dropper** runs → outbound connection to remote server → **update.bin** (stage 2 dropper) downloads → **disables antivirus** → payload deploys → malicious process (malproc.exe) spawns → **unauthorized registry modification** → unusual outbound traffic (**data exfiltration**) → **breach alert from IoC**.
- Stage 1 dropper = downloader; stage 2 = the real payload.

## OS Security Logs (password cracking)
- PINs incrementing one at a time (123456 → 123457...) every 2 seconds, 5 fails → lockout = **brute force**.
- Common words (puppy, baseball, cupcake) or leetspeak variants (puppy1, b@seball) = **dictionary attack**.

## IPS/IDS Logs
- **Action = blocked → it's an IPS** (and the threat was mitigated — lower priority). **Alerted/monitored = it got through** — investigate first.
- Among six HIGH events (SQLi 4105, buffer overflow 4110, priv-esc 4115, brute force 4120, internal network scan 4125, data exfiltration 4130), the top priority = **data exfiltration that was ALERTED, not blocked** — data may have left; also retune the IPS. Blocked highs are handled. (Also consider blocking repeat attacker IPs.)

## Network (Router) Logs
- Columns: date, time, interface (Gi0/1...), action (allow/deny), details.
- Normal: internal-to-internal across subnets; **8.8.8.8 over UDP 53 = Google DNS**; ICMP ping; SSH TCP 22; denied NetBIOS UDP 137 broadcast.
- **Suspicious**: repeated **ARP replies mapping the SAME IP (192.168.1.10) to DIFFERENT MAC addresses** within seconds = **ARP spoofing** (attacker flipping MACs). One of the exam's harder analysis questions.

## Metadata in Investigations (invoice.pdf example)
- File metadata: name, size, type, created/modified/accessed dates, owner, checksum, file path.
- **Checksum (MD5/SHA-256)** = digital fingerprint → add to blocklists so no one else executes the same malware.
- **Extension/type mismatch**: `.pdf` whose true type is .exe/.doc = suspicious.
- Odd dates (created 2012 but "sent today") or created/modified/accessed all minutes ago = investigate.
- **File path C:\TEMP\** (vs. trusted user folders) = malware indicator.
- Owner tells you which user/account to interview.

## High-yield exam triggers
- "Linux/Unix only logging daemon" → rsyslog/syslog-ng; "works on Windows too, open source" → **NXLog**.
- "Same IP, two MACs, ARP replies" → **ARP spoofing**.
- "OR '1'='1" in URI → **SQL injection → WAF**.
- "SYN only, no ACKs, one source" → **SYN flood DoS**; many sources → **DDoS**.
- "Sequential ports from one IP" → **port scan**; "PINs 123456, 123457..." → **brute force**; "puppy, baseball" → **dictionary attack**.
- "setup.exe downloads update.bin, AV disabled, registry change, odd outbound" → **dropper malware + exfiltration**.
- "Alerted vs blocked" in IPS logs → **alerted = got through = investigate first**.
- "MD5/SHA-256 of malicious file" → block by **hash** (fingerprint).
