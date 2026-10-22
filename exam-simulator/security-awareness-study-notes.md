# Security Awareness — SY0-701 Study Notes (Section 27, OBJ 5.6)

## Security Awareness Overview
- **Security awareness** = knowledge/understanding of threats and mitigations. Goal: equip people to recognize and respond to threats. **Human error remains one of the most significant vulnerabilities** — technical defenses alone aren't enough.

## Recognizing Insider Threats
- **Insider threat** = security risk from people INSIDE the organization: employees, former employees, contractors, business partners — with knowledge of security practices/data/systems. Intentional OR unintentional.
- Contributing factors: personnel issues, financial struggles, job dissatisfaction.
- **Warning signs (exam vocabulary):**
  - **Altered states** (drunk/hungover regularly) — impaired judgment, coercion risk (clearance holders are flagged).
  - **Emotional distress** (giving away possessions, depression) — less vigilant, exploitable by competitors/nation-states. Handle with empathy via management/HR.
  - **Lifestyle incongruences** — lifestyle beyond income ($80K salary + $150K car + $2M house). May be innocent (spouse's income, reported windfall) — requires **discreet investigation** without violating privacy. Clearance holders file financial disclosures and report windfalls.
  - **Financial struggles/debt** — susceptible to bribery or selling secrets to competitors.
- **Insider threat program**: security culture encouraging reporting, training on warning signs, policies supporting mental health/financial well-being, fair and confidential investigations.
- **User activity monitoring**: detect anomalous access, mass copying/downloading of sensitive data, odd hours — **balanced with employee privacy rights**.

## Password Management
- **Password reuse is the biggest trap** — one breached site (Yahoo, Target...) exposes every account sharing that password; usernames are usually the same email everywhere. Use a **long, strong, UNIQUE password per site**.
- **Password managers** remember/generate them. Browsers have built-in managers (Chrome Autofill), but **standalone third-party managers (1Password, Dashlane, LastPass, Bitwarden) are more secure**.
- Bitwarden demo: install browser extension → create account with a strong **master password (the encryption key — lose it, lose everything; you only memorize this ONE)** → vault stores credentials encrypted → generator makes 14+ char passwords (upper/lower/numbers/symbols) → auto-fill on sites.
- Corporate accounts allow secure password SHARING within an org.

## Avoiding Social Engineering
- **Situational awareness** = mindfulness of surroundings, requested actions, and consequences. First line of defense.
- **Shoulder surfing** — peeking at your screen. Counter: awareness in public, **privacy screen protectors**, don't read confidential info in public.
- **Eavesdropping** — listening to conversations. Counter: sensitive talks only in soundproofed/secure areas; beware smart devices (phones, watches) that could record remotely.
- **Piggybacking/tailgating** — unauthorized people following authorized staff in. Counter: **access control vestibules (mantraps)** — one person at a time — plus awareness at doors.
- **Dumpster diving** — sifting trash for reconstructable info. Counter: awareness + shredding policies.
- **OPSEC (operational security)** — military origin; protecting critical info that reveals activities to adversaries. Every small detail is a puzzle piece social engineers assemble from social media, calls, casual talk. A mindset, not just a protocol.
- **Baiting** — planted **USB thumb drives** (never pick up / never plug in) and **malicious charging cables** in public (airports, coffee shops — malware in cable firmware). **Carry your own cable/charger.**
- **Phone scams/impersonation (vishing)** — fake IT support creating **urgency/fear of legal or financial consequences** to rush you past normal procedures. People make mistakes when rushed — be proactive, not reactive.
- **Proactive culture**: regular training for ALL positions, simulated phishing with remediation for clickers.

## Policies and Handbooks
- **Policy** = deliberate system of principles/rules guiding decisions; upholds internal controls, legal/ethical compliance. **Handbook** = comprehensive reference guide (procedures, guidelines, best practices) — e.g. employee handbook.
- Examples: data protection, remote work, acceptable use, conflict-of-interest policies; employee/training/compliance handbooks.
- **Data destruction policy examples**: color-coded paper (pink = sensitive → cross-cut shred; government: white recycle / pink shred / yellow incinerate) to defeat dumpster diving.
- Remote-work policies define what may leave the office (gov example: no smartphones inside; notebooks can't go home; bag checks at exit).
- Handbooks also say what TO do: how to report suspicious email (who to contact, what info, how to isolate).
- **Review policies at least annually**; update and highlight significant changes (one-page summary); train on the WHY so staff can make judgment calls when the policy doesn't cover something. Policies are **guides, not guardrails** — escalate gaps to leadership.

## Remote and Hybrid Work Security
- **Remote work** = working outside a traditional office (home, coffee shop, abroad). **Hybrid** = blend of office + remote.
- Risks: physical controls don't extend; data transits public/untrusted networks (eavesdropping on unencrypted connections, weak Wi-Fi passwords); higher loss/theft of devices.
- **Controls:**
  - **VPN** for encrypted end-to-end connections back to the company network.
  - **MFA** as an added layer if credentials are compromised.
  - **Company-issued devices** preferred (updated security software, firewalls, monitoring). If **BYOD** (vs CYOD/COPE) — org must define required security measures (patching, updates) but **ownership complicates enforcement** (can't install software without consent).
  - **Full-disk encryption + remote wipe** for lost/stolen devices.
  - **Automated backups** (server or cloud) — recovery from ransomware/loss.
  - **Secure collaboration tools**: end-to-end encryption, robust admin controls, compliance with international standards.
  - Continuous training (phishing recognition, data handling, incident reporting); clear security-team communication; regular audits and feedback sessions.

## Creating a Culture of Security
- Culture of security = every member prioritizes security in daily tasks/decisions; collective responsibility.
- Uses **organizational change management (OCM)**, strategic development, comprehensive execution, constant monitoring/reporting.
- **Starts at the TOP** — executives set the tone; security as shared corporate responsibility, not a mandated directive (down to seasonal/part-time staff).
- Phases: ① **Development** — strategic planning, policies, threat education, empowerment (confidence to recognize/respond). ② **Execution** — continual (not one-time): roll out policies, training, simulated attacks, daily communication; embed into workflows. ③ **Monitoring & reporting** — initial monitoring then recurring check-ins; track compliance, assess effectiveness, find improvements; teach everyone HOW/WHERE to report.
- **No-blame reporting culture** — fear of blame suppresses incident reporting (counterproductive). Encourage reporting; value employee input.
- **Feedback loops** — insights from monitoring/reporting shape future actions; continuous learning/adaptation.

## High-yield exam triggers
- "$80K salary, $150K sports car" → **lifestyle incongruence**.
- "Gave away possessions, depression" → **emotional distress** (engage with empathy).
- "Found USB in parking lot" → **baiting** — never plug in.
- "Free charging cable at the airport" → **baiting (juice jacking-style)** — carry your own.
- "Following an employee through the door" → **tailgating/piggybacking** → **access control vestibule**.
- "One master password encrypts the vault" → **password manager** (Bitwarden/LastPass/Dashwarden class).
- "Review at least once per year" → **policy review cycle**.
- "Fear of being blamed for reporting" → **no-blame culture / feedback loops**.
- "Executives set the tone" → **OCM starts at the top**.
