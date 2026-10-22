# Security+ (SY0-701) Study Notes — Section 03: Threat Actors

**Exam objectives covered:** 1.2 (fundamental security concepts — deception tech), 2.1 (compare/contrast common threat actors and motivations), 2.2 (common threat vectors and attack surfaces)

**⚠️ How the exam tests this:** SY0-701 loves **scenario questions** here. They describe an attack or attacker behavior and ask "which type of threat actor is MOST likely involved?" The skill is matching **motivation + capability + origin**, not memorizing definitions. Every note below is tuned for that.

---

## 1. Core Definitions (expect 2–3 direct questions)

- **Threat actor:** An individual or entity responsible for incidents that impact security and data protection. Range: lone hackers → organized crime → nation-states.
- **Intent vs. Motivation — classic exam trap:**
  - **Intent** = the *specific objective/goal* of the attack (what they want to achieve).
  - **Motivation** = the *underlying reason/driving force* behind it (why they do it).
  - Exam phrasing: "The attackers' desire to profit from the sale of the stolen data is BEST described as the…" → **motivation**, not intent.
- **Attack surface** = ALL points where an unauthorized user can enter or extract data — the *sum of all potential vulnerabilities and entry points*. (The **where** of an attack.)
- **Threat vector** = the means/pathway used to deliver a payload or carry out an unwanted action. (The **how** of an attack.)
  - 🧠 Memory hook: **Vector = how | Surface = where**. If asked how to *reduce* attack surface: restrict access, remove unnecessary software, disable unused protocols.

---

## 2. Threat Actor Motivations (OBJ 2.1) — know all ten cold

| Motivation | What it means | Signature clue in a scenario |
|---|---|---|
| **Data exfiltration** | Unauthorized transfer of data out of a computer/system | Stealing PII, IP, trade secrets; selling on dark web, identity theft |
| **Financial gain** | Money via ransomware, banking Trojans | Ransom demand, bank account theft — #1 motivator of organized crime |
| **Blackmail** | Threaten to release compromising info unless demands met | Demands in **untraceable cryptocurrency (Bitcoin)**; forms: ransomware, **doxxing**, sextortion |
| **Service disruption** | Take services offline (usually via **DDoS**) | Traffic flood; motive = chaos, political statement, or ransom |
| **Philosophical/political beliefs** | Attacking for a cause = **hacktivism** | Political/social/environmental agenda; targets political, financial, media orgs |
| **Ethical reasons** | Authorized hackers (pen testers, bug bounty hunters) improving security | Has *permission*; goal = find & patch vulns before malicious actors do |
| **Revenge** | Harm a current/former employer | Disgruntled/fired/laid-off employee causes breach or leaks data |
| **Disruption or chaos** | "Some men just want to watch the world burn" | Thrill-seeking, challenge, harm for its own sake; spreading malware, hitting critical infrastructure |
| **Espionage** | Spying to gather sensitive/classified info | Nation-state (national security advantage) or rival company (competitive intel) or hacktivist (political advantage) |
| **War** | Cyber attacks as a tool of modern warfare | Nation-state; disrupt infrastructure, compromise national security, economic damage; geopolitical objectives |

**Exam traps:**
- Ethical hackers = motivated by **ethical reasons** but they are *authorized*. Don't classify them as malicious.
- Blackmail vs. Financial gain: if the scenario emphasizes *threatening to release info* (not encrypting systems), the motivation is **blackmail** even though payment is involved.
- Hacktivist actions (defacement, DDoS, leaks) can look identical to crime — the **ideology** (not money) is the discriminator.

---

## 3. Threat Actor Attributes (OBJ 2.1)

Three attributes define/differentiate actors:

### A. Origin — Internal vs. External
- **Internal:** individuals/entities *within* the org (angry employees, contractors, business associates) who have **legitimate access** and abuse it. More dangerous per-capita: intimate knowledge of infrastructure, vulnerabilities, and procedures.
- **External:** outside individuals/groups (cybercriminals, hacktivists, competitors, state-sponsored) with **no authorized access** — must use malware, social engineering, exploits to get in.

### B. Resources and Funding
- The tools, skills, personnel, and budget at the actor's disposal.
- Drives the **scale, frequency, and sophistication** of attacks.
- Spectrum: lone hacker with one PC ↔ nation-state with advanced tools, teams, computing power, huge budgets.

### C. Level of Sophistication / Capability (rated low → high)
- **Low:** widely available tools, common malware, phishing → **Script kiddies**.
- **High:** advanced skills, **custom-developed malware, zero-day exploits, advanced evasion techniques** → nation-states, APT groups — can dwell undetected for extended periods.
- **Script kiddie:** limited technical knowledge; uses **pre-made scripts/tools without understanding the underlying principles**; cannot create or modify tools.

### ⭐ Know cold: APT (Advanced Persistent Threat)
- **Prolonged, targeted** cyberattack: intruder gains unauthorized access and **remains undetected for an extended period** to steal data / monitor network activity — **rather than cause immediate damage**.
- Sponsored by a nation-state or its proxies (including organized crime groups these days).
- Distinguishing words on the exam: **long dwell time, stealth, data theft over destruction, "persistent."**

---

## 4. Threat Actor Types (OBJ 2.1) — the big scenario-matching table

| Actor | Skill/Resources | Motivation | Signature behaviors | Exam examples |
|---|---|---|---|---|
| **Unskilled attacker / Script kiddie** | Very low; downloaded tools | Recognition, thrill, curiosity; **NOT money or politics** | Uses others' tools (e.g., **LOIC** for DDoS), defaces websites, spreads malware; targets **unpatched known vulns**; **opportunistic, not targeted** | "Teenager downloads a tool and floods a website" |
| **Hacktivist** | Varies widely — can be highly sophisticated | Ideology, social/political change, protest perceived injustice | **Website defacement** (electronic graffiti/vandalism), DDoS, **doxxing**, data leaks | **Anonymous** (Operation Payback vs. MPAA/RIAA), **LulzSec** (50 Days of Lulz: Sony, CIA, FBI) |
| **Organized crime** | High; well-structured, role-based syndicates; transnational | **Financial gain, almost always** | Ransomware, identity theft, online fraud, data breaches, custom malware, phishing campaigns; can be **hired as mercenaries** by governments; exploits crypto/dark web to evade | **FIN7** (retail/hospitality phishing), **Carbanak** (>$1B from banks, custom Carbanak malware, ATM cash-out) |
| **Nation-state** | Highest; government funded; intelligence/military or deniable proxies | Geopolitical/strategic goals: espionage, sabotage, influence, cyber warfare; **NOT financial gain** (except **North Korea** — sanctions → targets banks/crypto exchanges for regime funding) | Custom malware, zero-days, APT campaigns; **false flag attacks**; **plausible deniability** via independent-looking cutouts | **Stuxnet** (US/Israel-attributed; destroyed Iranian nuclear centrifuges via zero-days; crossed an **air gap via infected USB**); 2016 US election influence (Russia-attributed) |
| **Insider threat** | Varies by role/access **and** personal skill — a skilled intern can out-damage an unskilled admin | Financial gain, revenge, **or unintentional carelessness** | Data theft, sabotage, misuse of privileges, installing backdoors/malware for external attackers; helps facilitate external attacks | **Edward Snowden** (NSA contractor, 2013 leaks); **2020 Twitter** breach (attacker + two insiders ran Bitcoin scam on celebrity accounts) |
| **Shadow IT** (not an actor — a *condition*) | n/a | Employee convenience/efficiency | Use of IT systems, devices, software, apps, cloud services **without explicit organizational approval**; also called **stealth IT**; BYOD and personal cloud storage (Dropbox/Google Drive) are common forms | "Sales rep stores client files in a personal cloud account" |

**Key comparisons the exam will force you to make:**
- Hacktivist vs. Organized crime → **ideology vs. money**
- Nation-state vs. Organized crime → **geopolitics vs. money**; nation-state won't seek ransom payments (North Korea excepted)
- Organized crime hired by a government still = **financially motivated mercenary**, not ideologically motivated
- Insider vs. external → insider already **has legitimate access**; damage scales with their access + knowledge
- Insider threats can be **malicious OR careless/unintentional** (untrained employee clicks phishing link) — exam loves this nuance

**Insider threat mitigations (know the list):** **zero trust architecture, robust access controls, regular audits, employee security awareness training.**

---

## 5. Threat Vectors & Attack Surfaces (OBJ 2.2) — six vectors, with tricks

| Vector | Mechanism | Exam-level detail |
|---|---|---|
| **Message-based** | Email, SMS, instant messaging | **Phishing** = attacker impersonates a trusted entity to trick victims into revealing sensitive info; malicious links/attachments deliver malware, Trojans, viruses |
| **Image-based** | Malicious code embedded inside image files; executes when the image is opened/loaded | **Stegano (2017):** malware hidden in banner-ad pixels on popular sites; exploited old Internet Explorer vulns, redirected to exploit kit, silently installed malware |
| **File-based** | Malicious files disguised as legitimate documents/software | Delivered as email attachments, via file-sharing services, or hosted on malicious sites (e.g., "cracked"/pirated software carrying malware) |
| **Voice calls** | **Vishing** (voice phishing) | Caller impersonates bank/service provider/government; e.g., fake IRS call demanding SSN/credit card. Real IRS initiates contact by **mail**, not phone calls |
| **Removable devices** | USB thumb drives, external HDDs/SSDs | **Baiting:** attacker leaves malware-infected USB in parking lot/lobby; victim plugs it in → malware executes. Or attacker uses social engineering to get inside and connect it themselves |
| **Unsecured networks** | Wireless, wired, Bluetooth lacking security | **Wireless:** rogue access points = **evil twins** (fake Wi-Fi mimicking legitimate network → intercept/capture/modify traffic). **Wired:** cable tapping; unauthorized devices via **MAC address cloning** or **VLAN hopping**. **Bluetooth:** **BlueBorne** (take over devices, spread malware, on-path/MITM attacks) and **BlueSmack** exploits |

**Attack surface reduction (choose these answers):** restrict access, remove unnecessary software, disable unused protocols. Email/IM, removable devices, and unsecured networks all *expand* the attack surface.

---

## 6. Deception & Disruption Technologies (OBJ 1.2) — Outsmarting Threat Actors

**Why:** Move from reactive to proactive defense. Deception tech misleads/confuses/diverts attackers away from critical assets while detecting and neutralizing threats. Goal: learn their **TTPs**.

**TTP = Tactics, Techniques, and Procedures** — the methods and patterns of behavior associated with a specific threat actor/group. Used to detect, mitigate, and counter threats. (Learn the acronym cold — guaranteed appearance.)

### The honey-family (know the differences precisely — guaranteed question)

| Tech | What it is | Key facts / traps |
|---|---|---|
| **Honeypot** | Decoy system/server mimicking a real system with attractive-looking vulnerabilities | Purpose is **NOT to block/prevent attacks** — it's to **gather info on attacker methods, motives, TTPs**. Can detect insider snooping/fraud. Deploy in a **screened subnet / isolated segment** reachable from the Internet |
| **Honeynet** | An entire **network of honeypots** mimicking servers, routers, switches | Used by large orgs/researchers to observe complex multi-stage attacks; logs successful AND failed attacks. **Trap:** double-edged sword — attacker may learn how your *production* systems are configured |
| **Honeyfile** | Decoy **file** placed in a system to lure attackers | Contains fake data + hidden metadata/**digital watermarks**; access triggers an alert; some contain code to **enumerate the attacker's own network**; placed under *looser* defenses than real sensitive files; any file type (docs, spreadsheets, images, even executables) |
| **Honeytoken** | Fake **piece of data/resource with NO legitimate value or use**, monitored for access | Fake user account (e.g., "Admin"/"Root" account that no one should ever log into), bogus URL, dummy DB record. **Any interaction = likely breach.** Especially useful for **detecting insider threats** and identifying data-leak pathways |

### Disruption techniques (secondary, but recognizable)
- **Bogus DNS entries** — fake DNS records mislead attackers to non-existent domains, waste their time, alert defenders
- **Decoy directories** — fake folders/files; unauthorized access raises an alert while attacker believes they succeeded
- **Dynamic page generation** — ever-changing content confuses/slows web crawlers and scrapers
- **Port triggering** — services/ports stay closed/hidden until triggered, hiding services from attackers
- **Spoofing fake telemetry data** — feed false data during a detected network scan

---

## 7. Rapid-Fire Exam Cheat Sheet

- Vector = **how** | Surface = **where**
- APT = long dwell time + stealth + **steal, don't break**
- Script kiddie = uses tools, **can't build/modify** them; motivated by **recognition/thrill**
- Hacktivist = **cause, not cash**; defacement/DDoS/doxxing/leaks
- Organized crime = **cash**; ransomware; transnational syndicate; can be a hired gun
- Nation-state = **geopolitics**; false flags, plausible deniability, zero-days; **North Korea = the money-motivated exception**
- Insider = has **legitimate access**; malicious *or* careless; mitigate with **zero trust + access controls + audits + awareness training**
- Shadow IT = **unapproved** tech (stealth IT); BYOD & personal cloud count
- Baiting = **infected USB left to be found**
- Evil twin = **rogue AP** faking legitimate Wi-Fi
- BlueBorne/BlueSmack = **Bluetooth** attacks
- Honeypot = decoy **system**; Honeynet = decoy **network**; Honeyfile = decoy **file** (watermarks); Honeytoken = fake **data** (any touch = alarm)
- Honeypot's job = **intelligence gathering, not prevention**
- Stegano = malware in **image pixels** (banner ads)
