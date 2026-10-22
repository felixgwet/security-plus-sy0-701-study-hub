# Physical Security — SY0-701 Study Notes (Section 04)

> **Maps to exam objectives:** 1.2 (compare & contrast types of security controls — the **physical controls** family) and 2.4 (given a scenario, analyze indicators of malicious activity).
> Physical security shows up on SY0-701 as **definition discrimination** ("Which control stops a vehicle-borne threat?") and **scenario questions** ("A guard finds a rug thrown over the fence — which brute-force technique is this?"). The single most-tested distinction in this whole section is **piggybacking vs. tailgating** — know it cold.

---

## 1. Perimeter Controls: Fencing & Bollards (Obj 1.2)

### Fencing — three purposes
1. **Visual deterrent / boundary** — marks where public space ends and private space begins.
2. **Physical barrier** — must be climbed, cut, or dug under; slows an intruder down.
3. **Delay** — buys time for detection and response. Fencing is **adaptable for large perimeters**.

### Fence countermeasures — match the attack to the defense (classic exam table)

| Attack against fence | Countermeasure |
|---|---|
| **Climbing** | Taller fence, **electrification**, **barbed wire** at the top |
| **Cutting** | More **robust materials**, **monitoring** (cameras/sensors/guards) |
| **Digging under** | **Underground portion** of the fence or **buried mesh** |

### Bollards
- **Definition:** short, sturdy vertical posts (steel or concrete) that control **vehicle** access.
- **Why they exist:** post-9/11 **anti-terrorism** measure — keep vehicle bombs (IEDs) outside the **blast radius** of a building; also stop **ram raiding** (smashing through storefronts to steal).
- Real-world disguises: **cement planters**, the **red balls outside Target**.
- Standard to know: **ASTM F2656-07 M30 P1** — stops a **15,000-lb vehicle at 30 mph** with penetration of **less than 1 meter (P1)**. The primary threat bollards address is **direct vehicle impact**.
- ⚠️ **Temporary/removable bollards can be tampered with or removed** — a scenario question may ask for the weakness.

**⚠️ Trap — fencing vs. bollards:** fencing = **people/perimeter** threats over large areas; bollards = **vehicular** threats in a **specified area**. "Vehicle-borne threat near the building entrance" → bollards, every time.

---

## 2. Brute Force Attacks (Obj 1.2 / 2.4)

**Two meanings you must separate:**
- **Cyber/crypto:** trying *every* possible combination until one works. Example from the course: a **4-digit PIN has 10,000 combinations** (0000–9999).
- **Physical:** forcible entry. Four forms:

| Physical brute-force form | What it looks like | Defense |
|---|---|---|
| **Forcible entry** | Breaking down doors; **glass cutting** to defeat windows | High-strength doors, **deadbolts**, **metal frames**, **solid-core** doors; **reinforced/laminated** glass |
| **Tampering with security devices** | Forcing a gate open; **blinding cameras/sensors** with paint, lights, or mirrors; smashing sensors | **Redundancy / multiple layers** of controls |
| **Confronting security personnel** | Distraction, assault, weapons | Guard training in **conflict resolution & self-defense**, **quick backup communication** |
| **Ramming barriers with vehicles** | Driving into government/military/bank buildings | **Bollards** and reinforced barriers that **absorb/dissipate energy** |

⚠️ The course's color details that make great distractors: a **rug thrown over barbed wire** to climb a fence (still brute force — climbing/cutting/ramming fences), and **the lock is the weakest point of a door**.

---

## 3. Surveillance (Obj 1.2)

**Definition:** an organized strategy/setup to **observe and report** activities. Four categories:

### a) Video surveillance (CCTV)
- **Wired:** cabled to a monitoring station — harder to interfere with.
- **Wireless:** easier to install, but susceptible to **jamming/interference**.
- A **detective control** (records what happened; does not prevent).
- Features: **motion detection, night vision, facial recognition, remote access**; **PTZ (Pan-Tilt-Zoom)** cameras operated from a **central guard station**.
- Placement: **entrances and exits** of critical infrastructure — **data centers, communications closets, building doors**.
- Process: **record + review** footage.

### b) Security guards
- The **most flexible and adaptable** surveillance/control tool.
- Can **detect unusual behavior, respond immediately, make judgment calls**, and act as a **visual deterrent**.
- Roles at checkpoints: **visual deterrent, verification assistance** (e.g., when the badge system fails/offline, visitors without badges → identity check + **temporary badge**), and **immediate response** (confront intruder or initiate emergency protocols).

### c) Lighting
- Crucial because it makes **video and guards more effective**: deters criminals, **reduces shadows/hiding spots**, improves footage quality.
- **Motion-activated lights** = deterrent **and** alert in one.

### d) Sensors — know the four types cold

| Sensor | How it works | Exam hook |
|---|---|---|
| **Infrared** | Detects **warm bodies** / heat | Excellent in **low light or darkness**; can be **defeated by heating the room** |
| **Pressure** | Detects **weight** on a floor area or mat | Simple contact/weight trigger |
| **Microwave** | Emits microwave pulses, measures reflection | Covers **large areas**; **prone to false alarms at high sensitivity** |
| **Ultrasonic** | **Echolocation** (like a bat) | Used in **automated doors**, indoor use |

---

## 4. Bypassing Security Controls (Obj 2.4)

**⚠️ This is the 2.4 content — "analyze indicators of malicious activity."** The exam describes an odd observation and asks what attack it indicates.

| Bypass method | Techniques | Countermeasure |
|---|---|---|
| **Visual obstruction** | **Spray paint, foam, stickers/tape** over a camera lens; **balloons/umbrellas** held over it | Tamper alarms, guard response |
| **Blinding sensors/cameras** | **Flashlights or lasers** aimed at the lens; **heating the room** to blind **infrared** sensors | Redundant sensor types, tamper alarms |
| **Interfering with acoustics** | **Loud music, jamming devices, white-noise machines** | — |
| **Interfering with electromagnetics** | **EMI / jamming** wireless setups; EMI generators; targeting the **Wi-Fi band** in a no-wireless facility | **Encrypted frequency hopping** against jamming/eavesdropping |
| **Attacking the physical environment** | **Temperature changes** to trick sensors; **killing the power supply** (unplugging, tampering with power boxes, sabotaging transformers); **arson** as distraction/destruction | **UPS / backup power**, tamper alarms |
| **Physical tampering** | **Cutting wires** (crude but effective; requires close proximity) | Tamper alarms, layered controls |

---

## 5. Access Control Vestibules & Entry Attacks (Obj 1.2)

### The vestibule (a.k.a. mantrap)
- A **double-door system**, electronically controlled so that **only one door can be open at a time**.
- Creates an **intermediate space between the untrusted outside area and the trusted inner area** — a person who fails verification is **trapped between the doors** until security personnel intervene.
- Often combined with **badges + security guards** for a multi-layered framework.
- Single-person-sized vestibules **prevent piggybacking and tailgating** (no room for two).

### Piggybacking vs. Tailgating — THE trap of this section

| | **Piggybacking** | **Tailgating** |
|---|---|---|
| Who is complicit? | The **authorized person intentionally allows** the unauthorized one in — through **complicity or negligence** | **No consent** — the authorized person doesn't know |
| How? | Usually **social engineering** (course example: pentester dressed as a **delivery driver with boxes** asking an employee to badge him in — worked ~50% of the time) | **Opportunistic** — closely following someone through a door/turnstile without their knowledge |
| Nature | Collaborative/deceptive | Covert |

### Access badges
- Embedded tech: **RFID** (radio frequency identification), **NFC** (near-field communication), legacy **magnetic stripe**.
- Cross-referenced against a **centralized database**; grants/denies based on the person's **role-based access level** (course example: NSA — building access ≠ individual office access).
- Every badge use is **logged → audit trail** for breach review.

---

## 6. Door Locks (Obj 1.2)

**Core idea:** all perimeter defenses become useless the moment someone is **inside the building** — interior locks protect the sensitive spaces (server rooms, network closets, offices).

### Weak vs. strong locks (course timing = great distractors)
- **Padlock** (basic **pin-and-tumbler**): defeatable in **~15 seconds** with a **lock pick + tension wrench**.
- **Privacy door locks** (bedroom/bathroom): pop open with a **slim rod/needle**, or a **flathead screwdriver/coin** on the slotted type.
- **Traditional keyed door locks:** defeated in **~30–60 seconds** by skilled attackers.

### Electronic lock mechanisms
| Mechanism | Notes |
|---|---|
| **PIN / identification number** | Course example: **8-digit PIN = 1 in 100 million** guess chance; per-person PINs enable **logging/auditing** |
| **Wireless signal** | **NFC tap** (smartphone), plus **Wi-Fi, Bluetooth, RFID** locks |
| **Biometric** | Fingerprint, **retinal scan**, **facial recognition** = **inherence factor — "something you are"** |
| **Cipher lock** | Older **mechanical** push-button **combination** lock; used on **server rooms/network closets**; costs more, higher protection |

### Biometric accuracy — FAR / FRR / CER (heavily tested)
- **FAR (False Acceptance Rate):** system accepts someone who **should NOT** be granted access. Drive toward zero by **increasing sensitivity**.
- **FRR (False Rejection Rate):** system **denies someone who SHOULD** have access — just as big a problem (authorized people locked out, half the time in the course example).
- **CER / EER (Crossover/Equal Error Rate):** the point where **FAR = FRR**. **The lower the CER, the better the biometric system.** When buying a fingerprint lock, compare CERs.

### MFA at the door
- Badge (something you **have**) + PIN (something you **know**); or **PIN + fingerprint**.
- Example from the course: open lobby → **turnstiles** requiring **badge + PIN** → the lobby/turnstile area itself is an **access control vestibule**.

---

## 7. Access Badge Cloning (Obj 2.4)

### The attack — four steps
1. **Scanning/reading:** handheld RFID/NFC reader captures the badge data — can be **concealed in a backpack**; done **without the owner's knowledge**.
   - Ranges: **NFC ~1–2 inches; RFID ~2–10 inches** (stronger antenna can roughly double this — attacker still must get close).
2. **Data extraction:** pull the **unique identifier / encrypted data** from the capture (can happen later, anywhere).
3. **Writing:** transfer to a **blank card/device**. Course tool: the **Flipper Zero** — reads **125 kHz RFID**, stores many codes, then **emulates** the badge or writes a physical clone.
4. **Using:** the clone behaves exactly like the original — building access, systems, even **NFC payment fraud**.

Why it's dangerous: **easy, cheap, stealthy** (no need to possess the original badge), and compromises physical security at scale.

### Defenses (six — matching/multi questions love this list)
1. **Advanced encryption** on the badge data (many basic systems use simple identifiers with **no robust encryption**).
2. **MFA** — badge + PIN/password/biometric; a cloned badge alone is then useless.
3. **Regularly update protocols/encryption keys** so clones stop working.
4. **User education** — cautious storage, report suspicious access attempts.
5. **Shielded wallets/sleeves** (RFID shielding) so the badge can't be read while carried.
6. **Monitor & audit access logs** — detect **impossible usage** (course example: badge used at the office while the owner is at a conference across the country).

---

## Rapid-Fire Self-Test

1. Fence attack: climbing → ? Cutting → ? Digging → ? *(taller/electrified/barbed · robust materials+monitoring · buried portion/mesh)*
2. Bollard standard ASTM F2656-07 **M30 P1** means? *(15,000 lb @ 30 mph, <1 m penetration)*
3. Fencing vs. bollards — which threat does each address? *(people/perimeter vs. vehicles)*
4. A 4-digit PIN = how many combinations? *(10,000)*
5. Weakest point of a door? *(the lock)*
6. Defense vs. ramming vehicles? *(bollards/reinforced barriers that absorb/dissipate energy)*
7. Which sensor uses echolocation, and where do you see it? *(ultrasonic · automated doors)*
8. Which sensor covers large areas but false-alarms at high sensitivity? *(microwave)*
9. How do you blind an infrared sensor? *(heat up the room)*
10. Countermeasure vs. wireless jamming/eavesdropping? *(encrypted frequency hopping)*
11. Define a vestibule. *(double doors, only one open at a time)*
12. Piggybacking vs. tailgating in one line each. *(authorized person intentionally lets someone in / unauthorized follows without consent)*
13. FAR vs. FRR? Which way do you tune sensitivity? *(accepts bad / rejects good · ↑sensitivity lowers FAR, raises FRR)*
14. What is the CER and do you want it high or low? *(FAR=FRR crossover · lower is better)*
15. NFC vs. RFID cloning ranges? *(1–2 in / 2–10 in)*
16. Name the Flipper Zero's two ways to use a captured badge. *(emulate / write to blank card)*
17. Clone used while the real owner is across the country — which control catches it? *(access-log monitoring/auditing)*
18. A guard station with PTZ cameras — what does PTZ stand for? *(Pan-Tilt-Zoom)*
19. Which lock is mechanical, push-button, combination-based? *(cipher lock)*
20. Motion-activated lights give you what two benefits? *(deterrent + alert)*

**Passing reminder:** the real SY0-701 needs **750/900** — expect 1.2 physical-control questions and 2.4 "indicator of malicious activity" questions to come largely from Lessons 30, 32, and 35.
