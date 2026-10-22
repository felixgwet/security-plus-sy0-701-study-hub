# Section 18 — Vulnerabilities and Attacks (SY0-701 Study Notes)

Exam-weight: this domain (18–19 combined) is one of the heaviest on the SY0-701. Expect direct "identify the attack from a snippet/log" questions — the course gives explicit exam tips for each one.

## 166 — Hardware Vulnerabilities

- **Firmware attacks**: malware embedded in device firmware (BIOS/UEFI, network devices); hard to detect because it survives OS reinstalls.
- **End-of-life / legacy / unsupported systems**: no more patches = permanent vulnerabilities. Mitigate by isolating/segmenting them (e.g., VLAN + firewall rules) and planning decommissioning.
- **Unpatched systems**: known CVEs left open. Patch management is the fix.
- **Misconfigurations**: default passwords, open ports, insecure settings. Fix with configuration baselines/enforcement and hardening.
- Mitigation set: hardening, patching, configuration enforcement, decommissioning, isolation/segmentation of legacy gear.

## 167 — Bluetooth Attacks & Best Practices

Know the "blue" family — a classic matching/identification question:

| Attack | What it does |
|---|---|
| **Bluejacking** | Sends unsolicited messages (spam) to a Bluetooth device |
| **Bluesnarfing** | Steals/reads data (contacts, call logs, texts) from the device *without* authorization |
| **Bluebugging** | Takes *control* of device functions (calls, texts) |
| **Bluesmack** | DoS — floods the device to crash/disable it |
| **Blueborne** | Worm-like airborne spread between Bluetooth devices in seconds — no pairing needed |

Bluetooth risks: insecure pairing, device spoofing, on-path (MITM) attacks.

Best practices: turn BT off when unused; non-discoverable mode by default; update firmware; pair only known devices; unique PIN/passkey; refuse unsolicited pairing requests; encrypt sensitive transfers.

## 168 — Mobile Device Vulnerabilities

- **Sideloading**: installing apps from unofficial sources outside the app store — bypasses store review/malware screening.
- **Jailbreak (iOS) / Root (Android)**: gives escalated permissions, removes built-in protections, and often blocks official OTA updates.
- **Insecure connections**: open/public Wi-Fi and unknown Bluetooth. Prefer cellular data or 802.1X-secured enterprise Wi-Fi.
- **MDM (Mobile Device Management)** enforces: patching, configuration management/baselines, best practices — block sideloading, detect jailbreak/root, force VPN use.

## 169 — SQL & XML Injection

- **Injection** (generic): insertion of code/data through an input form so the application executes attacker input as part of a command/query.
- **SQLi**: attacker enters malicious SQL into a form field/URL parameter/cookie/header. Classic payload: `' OR 1=1;` — the apostrophe escapes the string, `1=1` is always true, so the OR makes the whole WHERE clause true → access granted.
  - **Exam tip**: see an apostrophe + "X = X" in a log → SQL injection. Guaranteed 1–2 questions.
  - **Prevention #1 = input validation / sanitization.** #2 = WAF (web application firewall) in front of the app.
  - Attack tools exist (sqlmap automates discovery + dumping databases), but the exam only cares that you recognize and prevent it.
- **XML injection**: malicious XML data sent to an XML-driven app. XML uses *custom* tags (vs HTML's fixed keywords like `<img>`, `<a href>`; vs JavaScript functions). Exam tip: any clearly-XML snippet in a question = XML vulnerability/exploitation/injection.
- **XML bomb ("billion laughs")**: nested entity references expand exponentially, consuming up to GBs of memory → DoS.
- **XXE (XML External Entity)**: embeds a request for a local resource — e.g. `<!ENTITY xxe SYSTEM "file:///etc/shadow">` reads the Linux password-hash file. Defense: validate/sanitize + disable unnecessary entity processing.

## 170 — Zero-Day Attacks

- A **zero-day** is a vulnerability unknown to the vendor — no patch exists. "Zero-day" can refer to the vulnerability, the exploit, or the malware (exam uses them interchangeably).
- Zero-days are **expensive**, stockpiled, and used against **high-value targets**, usually after generic malware fails.
- Signature-based AV is **useless** pre-signature → detection relies on behavior/heuristics (AI-driven detection, sandboxing).

## 171 — Operating System Vulnerabilities

- Sources: unpatched systems, zero-days, misconfigurations, data exfiltration, malicious/compromised software updates.
- Defenses: patching; host-based IPS (HIPS); configuration management; encryption at rest; endpoint protection; host firewall; allow-listing (application control); verify update signatures/hashes before installing.

## 172–173 — SQLi Demo (awareness only)

Burp Suite captures the request (cookie/session data); sqlmap automates: find vulnerable parameter → enumerate databases (`--dbs`) → tables (`--tables`) → columns (`--columns`) → dump & crack password hashes. Exam expects **no tool knowledge** — just awareness of why input validation matters.

## 174 — Cross-Site Scripting (XSS) & Cross-Site Request Forgery (XSRF/CSRF)

**XSS** — malicious script injected into a *trusted* site, delivered to and executed in the victim's browser at the trust level of that site. Relies on missing input validation.

- Steps: find input-validation weakness → craft malicious URL → user clicks → trusted site serves page with injected code → code runs in victim's browser.
- **Reflected / non-persistent**: one-time; requires the victim to click the crafted link.
- **Persistent / stored**: code saved into the site's database — every visitor who loads that page runs it. More dangerous.
- **DOM-based (client-side)**: script manipulates the Document Object Model in the browser. Exam tip: `document.cookie`, `document.write` in the payload → DOM-based XSS.
- **Exam tip**: `<script>` or JavaScript inside a captured URL/log → XSS.
- Uses: defacement, session-cookie theft, intercepting form data, malware install.

**Session management background**: HTTP is stateless; sessions tracked via cookies. Session cookie = non-persistent (memory only); persistent cookies stored in cache until expiry/deletion. Encrypt cookies. **Session hijacking**: attacker steals/modifies the session cookie or predicts a weak session token (session prediction) to take over an authenticated session. Use truly random, non-predictable, one-time session tokens.

**XSRF/CSRF** — attacker gets the victim's browser to perform an *unwanted action* on a site where the victim is already authenticated (change password/email, initiate transfer). Works via the site's own session cookies — victim may not even click anything (hidden `<img>` tags). Prevent with: user-specific anti-CSRF tokens in forms, randomness + extra info (2FA) on password reset, require current password to change password.

Exam distinguisher:
- **XSS** = attacker code *runs in the victim's browser* on the trusted site.
- **XSRF/CSRF** = victim's browser *performs an action* they didn't intend.

## 175 — Buffer Overflow

- Writing more data into a buffer than it was allocated → spills into adjacent memory.
- Goal: overwrite the **return pointer** on the program's **stack** so execution jumps to attacker's code → remote code execution ("smashing the stack").
- **NOP slide**: fill buffer with NOP (no-operation) instructions so the randomized/approximate return address "slides" down to the attacker's code.
- **ASLR (Address Space Layout Randomization)**: randomizes memory addresses of well-known programs so return pointers are hard to guess. Introduced with Windows Vista. (Bypasses exist — side-channel attacks — but out of scope.)
- Exam takeaway: putting more data into memory than designed → malicious code execution.

## 176 — Race Conditions

- Outcome depends on order/timing of events; attacker wins the "race" to use a resource before legitimate processing.
- Found when multiple threads write the same variable/memory location concurrently; can be triggered via pointer dereference exploits.
- **Dirty COW (2016)**: classic race condition in the Linux kernel's **copy-on-write** mechanism → local privilege escalation (turn read-only file mapping into write). Hard to detect — nothing in the logs.
- Three sub-types (same vulnerability, different moments):
  - **TOC (time-of-check)**: app checks a state, attacker changes it before the operation.
  - **TOU (time-of-use)**: attacker changes state between check and use.
  - **TOE (time-of-evaluation)**: inputs manipulated during a calculation/decision window.
- **Prevention: locks and mutexes** — mutex = mutually exclusive flag letting only one thread into a code section (like SharePoint file checkout locks). Badly designed locks → **deadlock**: two processes each wait for the other to release a resource; circular dependency needs external intervention.

---

### High-yield rapid-fire list
- `' OR 1=1` → SQLi; prevent with input validation (+ WAF).
- `<script>…</script>` in URL → XSS; `document.*` → DOM-based XSS.
- Victim unknowingly performs an action → XSRF/CSRF → anti-CSRF tokens.
- Billion laughs → XML bomb; `/etc/shadow` via entity → XXE.
- Stack/return pointer/NOP → buffer overflow; ASLR = mitigation.
- Steal contacts via BT → bluesnarfing; control device → bluebugging; spam → bluejacking; DoS → bluesmack; airborne worm → Blueborne.
- Copy-on-write race → Dirty COW privilege escalation.
- Lock resource → mutex; circular wait → deadlock.
- Randomized session tokens + one-time use → stop session prediction/hijacking.
- Zero-day = no patch yet; signature AV blind until a signature exists.
