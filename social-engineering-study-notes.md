# Social Engineering — SY0-701 Study Notes (Section 05)

> **Maps to exam objectives:** 2.2 (explain common threat vectors & attack surfaces — the human/SE vectors) and 5.6 (given a scenario, implement security awareness practices).
> Social engineering is one of the MOST heavily tested areas of SY0-701, and most questions are pure definition discrimination: "A caller claims to be from the IRS and demands payment within 24 hours or arrest — which motivational trigger?" Know the **six triggers**, the **phishing family tree**, the **four impersonation forms**, and **misinformation vs. disinformation** cold — those four clusters cover most of the section's exam weight.

---

## 1. What Social Engineering Is (Obj 2.2)

- A **manipulative strategy that exploits human psychology** to gain unauthorized access to **systems, data, or physical spaces**.
- Includes **written communication** (email/SMS) **and face-to-face interaction** — attackers manipulate people into revealing confidential info or performing compromising actions, instead of using technical hacking.
- Because the target is the **human element**, the #1 defense is **security awareness training** — regular training on recognizing and responding to SE attacks.

---

## 2. The Six Motivational Triggers (Obj 2.2) — THE core list

| Trigger | Mechanism | Course example |
|---|---|---|
| **Authority** | People comply with perceived power/position | Fake manager/executive, "important client," or **fake IRS agent** demanding a "late fee" within 24 hours or arrest |
| **Urgency** | Immediacy/time pressure makes people skip procedures | Hands-full-of-boxes at the door; **USB with slides "needed in 5 minutes"** (skips removable-media scanning); help-desk password reset "right now, big deadline" |
| **Social proof** | People copy what they see others doing | Scam website boosted by **likes/shares and friends' posts**; course-review psychology (100k enrolled → must be good) |
| **Scarcity** | Limited availability forces quick decisions | "Only 5 spots left," **$1,000 MacBook (normally $2,000) for the first five buyers** |
| **Likability** | People respond to people they like | Red Teams staff friendly/attractive members; **sports-team chit-chat** (Buffalo Bills gear on a desk) to open victims up |
| **Fear** | "If you don't, something bad happens" | Ransomware "$200 fine to decrypt"; **fake FBI agent threatens arrest** — note this stacks **fear + authority** |

**⚠️ Traps:**
- Triggers **combine** — the FBI/ransomware scams deliberately stack fear on authority. A stem describing two triggers is common.
- **Urgency vs. scarcity:** urgency = time pressure ("expires in 4 hours"); scarcity = *limited quantity* ("only 5 left"). Scarcity is "often used with urgency" but the driver is limited supply.
- Best defense against all of them: **security awareness training** (Obj 5.6).

---

## 3. The Four Forms of Impersonation (Obj 2.2)

| Form | Definition | Exam hook |
|---|---|---|
| **Impersonation** | Assuming the identity of **another person** to gain access or steal data | Attacker first **collects org info** to make lies believable ("Mike from IT, third floor — checking the workstation issues others reported"). Consequences up to **complete system takeover** |
| **Brand impersonation** | Pretending to **represent a legitimate company/brand** (logos, marketing language) in phishing emails/sites or social media | Defenses: user education, **secure email gateways**, **monitor the brand's online presence**. Famous case: **Nov 2020 fake Eli Lilly Twitter** ("insulin is free") → stock dropped **4% in under 24 hours**, billions in market cap lost |
| **Typosquatting** (URL hijacking / cyber-squatting) | Registering a **lookalike domain with typos** — *cousins, lookalikes, doppelganger domains* | gnail.com for gmail.com; **Di0ntraining.com (zero for O)**; hijacked **subdomain of a trusted cloud provider** (Diontraining.Azure.com — when the real company uses AWS). Defenses: **register your own misspellings** (Accolade owns acclade.com), domain-monitoring services, user training |
| **Watering hole attack** | Compromising a **specific website/service the target is known to use**, then delivering malware through it | **Passive attack** — the attacker never communicates directly with the target (predator waits at the river). Defenses: **patching**, threat intelligence, advanced malware detection |

---

## 4. Pretexting (Obj 2.2)

- A **fabricated, convincing scenario** used to manipulate a target into divulging information or performing actions — often impersonating a trusted person or authority.
- Course demo: fake toner vendor ("Bob Smith, Ink and Toner Express") **guesses a common printer brand so the receptionist corrects him** with the real model (Konica Minolta C368), then escalates to the printer's **IP address** (has her photograph the touchscreen). 
- Classic pretext: **"John from Microsoft — your Windows machine is infected."** (The course's mom knew it was fake because she has an **iMac** — Windows malware can't affect macOS.)
- ⚠️ **Never give out information by phone**, even seemingly innocent details (printer model, IP address) — they fill in the attacker's gaps. **Don't fill in the gaps for callers.**

---

## 5. The Phishing Family (Obj 2.2) — heavily tested

| Type | Channel / targeting | Distinguishing detail |
|---|---|---|
| **Phishing** | Mass **email** — the wide net | "Fisherman casts a wide net"; **spray and pray** to hundreds of thousands; urgency/fear lures; fake login pages capture credentials |
| **Spear phishing** | Email, **targeted** at specific individuals/orgs | Attacker **researches first**; tailored content = higher success. Course test: 1M random people get a fake Bank-of-America email = **phishing** (random list); 500 customers of a breached bank get tailored emails = **spear phishing** |
| **Whaling** | Spear phishing at **high-profile executives (CEO/CFO)** | Bigger payoff (execs can **approve large fund transfers**); much more prep/precision; often step one of **taking over the executive's account** for follow-on attacks |
| **Business email compromise (BEC)** | Compromised **internal** email account | Take over a legitimate account via social engineering or intrusion; impersonate **senior exec or trusted partner**; request **wire transfers, payment redirections, confidential data** from **finance or HR**. FBI IC3: **+14.5% increase, $2.7B losses** in a year |
| **Vishing** | **Voice** (phone) | Impersonate banks/government agencies; course notes people are easier to trick **by phone than by email** |
| **Smishing** | **SMS/text** | Fraudulent links or phone numbers; urgency bait |

---

## 6. Preventing Phishing & Awareness Practices (Obj 5.6)

- **Anti-phishing campaign** = user training **+ a simulated phishing campaign** run by an outside contractor or **SaaS platform**; must be **ongoing** (threats evolve); users who click get **in-depth remedial training**.
- Course demo: Trend Micro's free **Phish Insight** — build target list, pick a template (fake LinkedIn invite), spoof the sender (deliberately misspelled *invitations@linkedin.com* — missing a D), schedule, trigger remedial training **"when phished."** Hovering the link reveals the real destination (websitefun.club) instead of linkedin.com.

### The five key indicators of a phishing email
1. **Urgency** — "claim your iPhone within 4 hours or the offer expires."
2. **Unusual requests** — **IT will never ask for your password; your bank will never ask for your card number** by email/phone.
3. **Mismatched URLs** — display text says paypal.com/login but hover reveals paypal.hacked.xyz. **Always hover** to see the real destination.
4. **Suspicious email addresses** — the display name is just text; hover/double-click to see the real sender (e.g., mr.weirdo578@yahoo.com claiming to be PayPal/Microsoft). Official domain missing or overly complicated address = red flag.
5. **Poor spelling/grammar** — often **deliberate**: it weeds out suspicious users early so the attacker keeps only the gullible (watch for generative AI making this indicator less reliable).

### When phishing is suspected
- **Report** it per policy (delete, or forward to the security inbox like phishing@yourdomain.com).
- Triage: confirm with the indicators, **inform all users** (others got it too), remind them **don't click links or provide info**, investigate any opened/clicked messages, then **review and update countermeasures** (spam filters, extra training).

---

## 7. Frauds & Scams (Obj 2.2)

- **Fraud** = wrongful or criminal deception for **financial or personal gain** — the victim is **tricked into handing over** money/information (vs. theft, where it's taken directly).
- **Identity fraud vs. identity theft:** fraud = **using** the victim's identity assets (charging on their existing card); theft = **fully assuming** the victim's identity (a foreign national using your SSN to get a job). Used interchangeably in practice, but **CompTIA's preferred combined term is "identity fraud."**
- **Invoice scam** — tricked into paying a **fake invoice for something never ordered**. Toner variation: caller "confirms" your printer/toner (building a pretext, recording your "yes"), ships grossly overpriced toner (**$950 vs. ~$100 retail for two boxes**), then bills with **no refunds/exchanges** and a recording of your agreement. Any regularly consumed office supply works.
- **Technical invoice scam:** PDF invoice attached to a **spear-phishing email** — embedded malicious code infects the billing employee's machine (remote access trojan). **Analyze untrusted emails before opening attachments, especially invoice PDFs.**

---

## 8. Influence Campaigns, Misinformation & Disinformation (Obj 2.2)

- **Influence campaign** = coordinated effort to shape **public perception or behavior** toward a cause, individual, or group. Can be **benign** (public-health vaccination drives) or **malicious** (election manipulation) — malicious ones usually run by **nation-states or hacktivists**, amplified by social media with little fact-checking.
- **⚠️ The distinction the exam always tests:**
  - **Misinformation** = false info shared **without harmful intent** (honest mistakes — e.g., COVID-era claims that salt-water gargles or drinking chlorine could kill the virus).
  - **Disinformation** = **deliberate** creation/sharing of false info **to deceive** (Russian state-sponsored fake Facebook/Twitter accounts in the **2016 US election**).
- **2020 Twitter Bitcoin scam:** attackers hijacked accounts of **Obama, Biden, Musk, Gates** etc. and promised to "double" Bitcoin sent to an address — proof influence campaigns can pursue **pure financial gain**, not just politics.
- Societal countermeasures: **media literacy, fact-checking, transparency/accountability, regulation**.

---

## 9. Other Social Engineering Attacks (Obj 2.2)

| Attack | Definition | Defense |
|---|---|---|
| **Diversion theft** | Manipulating a situation / creating a distraction to steal items or info; digitally: **DNS spoofing** sends users to a fake brand-impersonation site that harvests credentials | Verify requests; DNS protections |
| **Hoaxes** | Malicious deception spread via social media/email; causes disruption/panic, often paired with phishing (a **"Windows virus" alert on a Mac** is an obvious hoax) | Critical thinking, fact-checking, verify reliable sources |
| **Shoulder surfing** | Direct observation of PINs/passwords/paperwork — including with **high-powered or CCTV cameras from far away** | **Privacy screens**, keypad shields, situational awareness |
| **Dumpster diving** | Searching trash for sensitive documents; **digital variant**: the recycle bin / "deleted" files | **Shred paper**, **clean desk policy**, securely **overwrite** deleted files on HDD/SSD/cloud |
| **Eavesdropping** | Secretly listening — phone, network interception, wiretaps, **on-path (MITM) attacks** | **Encrypted communication channels**, encrypt data in transit, patch systems |
| **Baiting** | Leaving a **malware-infected USB drive** where a curious victim will find and plug it in (malware installs in seconds) | Never use unknown USB devices; training |
| **Piggybacking / tailgating** | Following an authorized person into a secure area | See below |

**Piggybacking vs. tailgating (restated — still the #1 SE trap):**
- **Tailgating** = following an authorized person **without their knowledge** (Jane swipes; attacker slips in behind her unnoticed).
- **Piggybacking** = the attacker **convinces** the authorized person to let them in (delivery person with full hands asks John to hold the door; John badges them in willingly).
- ⚠️ New angle from this lesson: **insider threats use piggybacking** to enter an office/data center **without their badge being recorded in the security log**.

---

## Rapid-Fire Self-Test

1. The six motivational triggers? *(authority, urgency, social proof, scarcity, likability, fear)*
2. Fake IRS agent demanding payment in 24 hours or arrest — which trigger(s)? *(authority; often stacked with fear)*
3. "Only five spots left at half price" — which trigger? *(scarcity)*
4. A scam site promoted by friends' likes and shares exploits what? *(social proof)*
5. Name the four impersonation forms. *(impersonation, brand impersonation, typosquatting, watering hole)*
6. Fake Eli Lilly tweet, Nov 2020 — result? *(4% stock drop in <24h, billions in market cap)*
7. gnail.com and Di0ntraining.com (zero for O) are examples of? *(typosquatting — doppelganger/lookalike domains)*
8. Why is a watering hole attack "passive"? *(no direct communication with the target — malware via a trusted third-party site)*
9. The toner-call demo: what two facts did the attacker extract? *(printer model, then its IP address)*
10. 1M random Americans get fake Bank of America email — phishing or spear? *(phishing — untargeted; a breached-bank customer list would be spear)*
11. Whaling targets whom, and why is it worth the effort? *(CEOs/CFOs — they can approve large fund transfers)*
12. BEC in one sentence + the FBI figures. *(compromised internal account impersonating an exec to request wire transfers from finance/HR; +14.5%, $2.7B)*
13. Vishing vs. smishing? *(phone voice vs. SMS text)*
14. List the five phishing indicators. *(urgency, unusual requests, mismatched URLs, suspicious addresses, poor grammar)*
15. Why do some phishers deliberately use bad grammar? *(to weed out suspicious users early, keeping only gullible victims)*
16. Two components of an anti-phishing campaign? *(training + simulated phishing, with remedial training for clickers)*
17. CompTIA's preferred combined term for identity fraud/theft? *(identity fraud)*
18. The toner invoice scam's bill vs. retail? *(≈$950 vs ≈$100/box — "no refunds," recorded "yes")*
19. Misinformation vs. disinformation? *(false info shared without harmful intent vs. deliberately created to deceive)*
20. A "Windows virus" warning shown to a Mac user indicates what? *(a hoax)*
21. Which SE attack pairs with DNS spoofing to redirect traffic to fake sites? *(diversion theft)*
22. Defenses against digital dumpster diving? *(securely overwrite deleted files on HDD/SSD/cloud)*
23. Why do insiders prefer piggybacking? *(enter without their badge being logged)*

**Passing reminder:** the real SY0-701 needs **750/900** — expect multiple SE questions every exam: triggers (2.2), phishing-type identification (2.2), phishing indicators & campaign steps (5.6), and misinformation vs. disinformation (2.2).
