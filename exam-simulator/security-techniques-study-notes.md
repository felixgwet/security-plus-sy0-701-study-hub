# Section 21 — Security Techniques (SY0-701 Study Notes)

Objectives 4.1 & 4.5: applying security techniques to computing resources and modifying enterprise capabilities to enhance security. Heavily tested: WPA3 features, DKIM/SPF/DMARC, EDR/XDR, UBA, and secure protocol/port selection.

## 199 — Wireless Infrastructure Security

- **WAP placement**: center of the facility, away from windows/exterior walls — signals that leak into the parking lot invite attackers. Mount high (shelf/ceiling) for coverage and less interference. If a WAP must sit on an exterior wall, use a **unidirectional antenna** aimed inward (omnidirectional broadcasts 360°).
- **ESS (extended service set)**: multiple WAPs cooperating for seamless roaming across a large building. Watch **interference**:
  - **Co-channel interference**: two WAPs overlapping on the SAME channel → collisions and retransmissions.
  - **Adjacent channel interference**: channels too close (e.g., 1, 3, 6) → overlapping frequency errors. In 2.4 GHz use only **channels 1, 6, and 11** (each 22 MHz wide, only 100 MHz total — these three don't overlap).
- **Site survey**: plan/design the wireless network — site visit to test RF interference and find optimal AP locations (what's already broadcasting in the band).
- **Heat map**: graphical map of signal strength/coverage per location, color-coded. Use it to find dead zones, overly strong signals, and **signal leaking outside the building** (then reposition APs or turn power down / aim unidirectional antennas inward).

## 200 — Wireless Security Settings

**Encryption evolution (exam loves this):**
- **WEP (1999)**: static shared key, 64/128-bit (24-bit IV + 40/104-bit key), weak RC4 → crackable in ~3 minutes. Never use.
- **WPA (2003)**: interim fix; **TKIP** dynamically generates a new 128-bit key per packet, but inherits WEP weaknesses; insufficient integrity checks. Insecure.
- **WPA2 (2004, 802.11i)**: **AES + CCMP** (Counter Cipher Mode with Block Chaining MAC Protocol), adds **MIC** (message integrity code). Vulnerable to **KRACK (2016)**.
- **WPA3** — current standard, four key features:
  1. **SAE (Simultaneous Authentication of Equals)**: replaces the WPA2 pre-shared key four-way handshake with a Diffie-Hellman-based protocol → resistant to **offline dictionary attacks** even with weak passwords; captured handshake data is useless for password guessing.
  2. **Enhanced Open (OWE — Opportunistic Wireless Encryption)**: individualized encryption on open (no-password) networks; protects public Wi-Fi against passive eavesdropping. Not full authentication.
  3. **Updated crypto: AES-GCMP** (Galois/Counter Mode) replacing CCMP; 128-bit for personal, **192-bit option for enterprise**.
  4. **Management frame protection**: protects deauth/disassoc-type frames from forgery/tampering (defeats deauth-based attacks; these frames used to be unprotected).

**AAA protocols:**
- **RADIUS**: centralized **authentication, authorization, accounting** over UDP; industry standard for network access.
- **TACACS+**: AAA with **separated** authn/authz/accounting (more granular control), uses **TCP** and **encrypts the entire authentication payload** — favored for device administration.

**EAP family (authentication framework for wireless/PPP):**
- **EAP**: framework, not a specific protocol — negotiates the auth method.
- **PEAP**: EAP inside a TLS tunnel; **requires certificates on BOTH server and client**.
- **EAP-TTLS**: server-side certificate only; carries a second auth protocol inside the TLS tunnel (extends TLS across platforms).
- **EAP-FAST**: Cisco; uses Protected Access Credentials (PAC) to re-authenticate securely when roaming without full re-auth; replaced vulnerable **LEAP**.

## 201 — Application Security (six areas)

1. **Input validation**: the gatekeeper — define validation rules (e.g., phone number = 10 digits); validate **front-end AND back-end** (front-end alone can be bypassed; back-end alone is costly). Not a cure-all — still need defense in depth.
2. **Secure cookies**: transmit only over HTTPS; **never use persistent cookies for session verification** — issue a fresh cookie at each authentication. Attributes: **Secure** (HTTPS only), **HttpOnly** (unreachable by DOM/client scripts → blocks XSS cookie theft), **SameSite** (restricts cross-origin sending → reduces CSRF).
3. **Static code analysis (SAST)**: examine **source code before running** for buffer overflows, SQLi, XSS, missing validation. Tool must support the language. Human review = **manual code review** (ideally by a different programmer).
4. **Dynamic code analysis (DAST)**: test the app **while running**; finds runtime errors, memory leaks static analysis misses. Two common methods: **fuzzing** (inject massive random/malformed data to force crashes) and **stress testing** (extreme load — thousands/millions of simulated users — to find bottlenecks and test load balancing/recovery).
5. **Code signing**: hash the file, encrypt the hash with the developer's **private key** = digital signature; receiver verifies with the public key in the shipped certificate. Proves **authenticity + integrity** (not that the code is vulnerability-free). App stores require it.
6. **Sandboxing**: isolate running/untrusted programs, limiting resources and changes they can make; browser sandboxes confine web code; can run multiple OS sandboxes on one host for testing.

## 202 — Network Access Control (NAC)

- NAC scans devices for security state **before** granting network access; works for internal, wired, or VPN-connected devices.
- Flow: device enters a **virtual holding area** while scanned (simple checks like EAP auth up through AV definitions, patch status) → pass = full access; **fail = quarantine** in a screened subnet for remediation (AV updates, patches, configs) — logically isolated until healthy.
- **Agents**: **persistent** (installed software — good for corporate-owned, managed devices) vs **non-persistent** (downloaded via captive-portal link, scans, then deletes itself — good for BYOD, e.g., college campuses).
- **802.1x**: the IEEE port-based NAC standard most NAC solutions build on.
- Access rules beyond health: **time-based** (schedules, e.g., deny 2 AM logins — beware global teams), **location-based** (geo-IP/GPS — Florida user suddenly in Italy → remediate), **role-based (adaptive NAC)** (re-evaluate when a device attempts new functions — a user laptop joining a server-management subnet is rejected), **rule-based** (complex if/then admission policies).
- NAC = defense in depth + supports **zero trust**.

## 203 — Web and DNS Filtering

**Web filtering (content filtering)** types:
- **Agent-based**: software agent on each device enforces policy — works anywhere, best for remote/mobile workers.
- **Centralized proxy**: all requests go through an intermediary server that evaluates policy and fetches/blocks content.
- **URL scanning**: check requested URL against a database of known malicious sites; match = blocked.
- **Content categorization**: classify sites (social media, adult, gambling) and allow/block categories.
- **Block rules**: explicit admin rules (e.g., block an IP seen in suspected exfiltration during incident response).
- **Reputation-based filtering**: third-party reputation score (history of malware/phishing) decides block/allow.

**DNS filtering**: block by refusing to resolve blocked domains — the DNS server simply won't return the IP. Common in schools to enforce acceptable use.

## 204 — Email Security

- **DKIM**: sender signs email headers with a digital signature; receiver validates against the **public key in the sender domain's DNS**. Proves origin + content not tampered in transit. Anti-spoofing, better deliverability/reputation.
- **SPF**: domain publishes authorized sending **IPs in DNS**; receiving server checks the sender's IP against that list — not listed → spam/reject. Prevents sender-address forging.
- **DMARC**: domain owner publishes a **policy telling receivers what to do** with messages that fail SPF/DKIM (works with either or both). Anti-BEC/phishing minimum baseline — every email server should have it.
- **Email gateway**: entry/exit point for all mail (SMTP-based); handles **routing, security scanning** (spam/phishing/malware in and out), **policy enforcement** (block sensitive outgoing mail, block known-bad senders), and **encryption/decryption** of messages. Deployment: **on-premise** (max control, you maintain it), **cloud-based** (scalability, less maintenance, provider-defined security), or **hybrid** (balance).
- **Spam filtering**: content analysis, **Bayesian filtering**, DNS-based sinkhole/blocklists, and custom rules (flag "lottery/free/prize" language).

## 205 — EDR / FIM / XDR

- **EDR (endpoint detection & response)**: monitors endpoint/network events into a central DB for analysis, detection, investigation, reporting, alerting. Six steps: **data collection → consolidation → threat detection → alerts/response → investigation → remediation** (remove malware, reverse changes, restore from secure baseline).
  - Detection: signature-based (known patterns) + behavior-based (anomalies).
  - Response: alert analysts or automated playbook actions (e.g., **isolate the endpoint** from the network).
- **FIM (file integrity monitoring)**: agent hashes critical files; compares current state to a **known-good baseline** of hashes; unauthorized change → alert. Often bundled into EDR/XDR.
- **XDR (extended detection & response)**: integrates **multiple protection layers — email, endpoint, server, cloud workloads, network** — into ONE platform; correlates data across all layers for faster detection/response; replaces separate siloed tools.
- EDR = endpoints only; XDR = everything, correlated.

## 206 — User Behavior Analytics (UBA/UEBA)

- Uses **big data + machine learning** to baseline **normal user behavior**, then flags anomalies: late-night logins, accessing unusual file sets, bulk downloads (exfil), read-only accounts suddenly modifying/deleting.
- **UEBA** = UBA + monitoring **entities** (routers, servers, endpoints), not just user accounts.
- Benefits: **early threat detection** (beats manual log review by days/weeks), **insider threat detection** (hardest for traditional tools), **improved incident response** (auto-logout of compromised accounts, rich context).
- Anomalies are alerts for review — may be legitimate (working late).

## 207 — Selecting Secure Protocols

- **Rule: pick the encrypted version** — HTTP→**HTTPS**, FTP→**SFTP** (over SSH tunnel), Telnet→**SSH**, SMTP→**SMTPS**, POP3→**POP3S**, IMAP→**IMAPS**, SNMP→**SNMPS**. Usually just an "S" suffix.
- **Ports**: well-known 0–1023 (system services); registered 1024–49,151 (applications); dynamic/private 49,152–65,535 (client side, randomly assigned).
- Key port numbers: HTTP 80 / HTTPS 443; SMTP 25 / **SMTPS 587**; POP3 110 / **POP3S 995**; IMAP 143 / **IMAPS 993**.
- **Least privilege for ports**: open only what's needed; block the rest. To force HTTPS, open 443 and close 80.
- **Non-standard ports** (e.g., web on 8888): add obscurity, not security — never a substitute for encryption/auth; document carefully.
- **Transport**: **TCP** = connection-oriented, ACKs, retransmission, sequencing → accuracy (web, email). **UDP** = connectionless, no error checking/recovery → speed (streaming video, gaming; a lost frame is skipped).

---

### High-yield rapid-fire list
- WEP RC4/24-bit IV (3-min crack) → WPA TKIP → WPA2 AES-CCMP + MIC (KRACK) → WPA3: SAE (anti offline dictionary), Enhanced Open/OWE, AES-GCMP (192-bit enterprise), mgmt frame protection.
- RADIUS = UDP AAA combined; TACACS+ = TCP, encrypts whole auth payload, separates AAA functions.
- PEAP = client+server certs; EAP-TTLS = server cert only; EAP-FAST = Cisco PAC, replaced LEAP.
- 2.4 GHz channels → 1, 6, 11 only. Heat map = signal/coverage picture.
- SAST = source before run; DAST = running app; fuzzing = random input crashes; stress = extreme load.
- Cookie attributes: Secure, HttpOnly, SameSite. Never persistent cookies for sessions.
- NAC: pass → network; fail → quarantine subnet. 802.1x = port-based NAC. BYOD → non-persistent agent + captive portal.
- DKIM = signature verified via DNS public key; SPF = authorized sender IPs in DNS; DMARC = policy for failed checks.
- EDR = endpoints; XDR = endpoints+network+email+cloud correlated; FIM = hash vs known-good baseline; UEBA adds entities.
- SMTPS 587, POP3S 995, IMAPS 993, HTTPS 443. TCP accurate, UDP fast. Non-standard port = obscurity only.
