# Cryptographic Solutions — Exam-Tailored Study Notes

**Course section:** 08 – Cryptographic Solutions (Lessons 68–80)
**Exam objectives covered:** 1.4 (Explain the importance of using appropriate cryptographic solutions), 2.3 (Explain various types of vulnerabilities), 2.4 (Analyze indicators of malicious activity)

Cryptography is a **heavyweight topic on SY0-701** — expect questions in every domain, especially scenario questions that ask you to pick the right algorithm/tool for a situation, and PBQ-style matching of algorithms to their properties.

---

## 1. Core Concepts (Lesson 68)

- **Cryptography** = practice of writing/solving codes to hide information's true meaning.
- **Encryption** = converting **plaintext** into **ciphertext** (and back with the key).
- **Algorithm/cipher** = the mathematical function. **Key** = the secret that determines the output.
- ⚠️ **TRAP: Security comes from the KEY, never the algorithm.** Modern algorithms are open/publicly reviewed (open source by design). "Security through obscurity" is considered unreliable. If keys are compromised, the whole system falls no matter how strong the algorithm.
- **Key length is directly proportional to security.** 128-bit is secure for most uses; 256-bit is exponentially stronger (not just 2x — squaring the work factor).
- **Key rotation**: regularly change keys (best practice). Examples: TLS keys rotated annually by policy; some cloud providers auto-rotate every 90 days.
- Keys must be stored in secure hardware modules, encrypted at rest, transmitted securely, access limited, and audited.

### The Three Data States (frequently tested)

| State | Meaning | Example protection |
|---|---|---|
| **Data at rest** | Inactive, archived on storage | Disk/file encryption (BitLocker) |
| **Data in transit** | Moving across a network (or RAM ↔ CPU) | TLS/IPSec tunnels |
| **Data in use** | Actively being processed/changed in the CPU | Secure enclaves, confidential computing |

---

## 2. Symmetric vs Asymmetric (Lesson 69)

| | Symmetric | Asymmetric |
|---|---|---|
| Keys | **One shared secret key** encrypts AND decrypts | **Key pair**: public + private |
| Also called | Private key encryption | Public key cryptography |
| Speed | ~100–1,000x faster | Slow |
| Key distribution | **Big problem** (n people need n(n−1)/2 key pairs) | Solved — public key is shared openly |
| Non-repudiation | ❌ No (everyone shares the same key) | ✅ Yes (only you have your private key) |

- ⚠️ **TRAP:** In symmetric crypto, "private key" means "shared secret" — NOT the same as the asymmetric private key.
- **Hybrid approach (how the real world works):** use asymmetric encryption to securely exchange a symmetric session key, then switch to symmetric (AES) for the bulk of the transfer. HTTPS/TLS does exactly this.

### Who encrypts with which key? (asked constantly)

| Goal | Key used | Why |
|---|---|---|
| **Confidentiality** | Encrypt with **receiver's PUBLIC** key | Only receiver's private key can decrypt — even the sender can't read it back |
| **Non-repudiation / digital signature** | Encrypt (sign) with **sender's PRIVATE** key | Anyone can verify with sender's public key; only sender could have signed |

### Stream vs Block Ciphers

- **Stream cipher**: encrypts **one byte/bit at a time** using a keystream generator + XOR. Great for real-time streams (audio/video). Usually hardware-based. Example: **RC4**.
- **Block cipher**: breaks input into **fixed-size blocks** (64/128/256 bits); pads short final block. Easier to implement in software, fewer security weaknesses. Examples: AES, DES, 3DES, Blowfish, Twofish.

---

## 3. Symmetric Algorithms (Lesson 70)

| Algorithm | Key size | Block/Stream | Notes |
|---|---|---|---|
| **DES** | 64-bit key (8 bits parity) = **56-bit effective** | Block (64-bit blocks, 16 rounds) | Obsolete — too weak |
| **3DES** | Three 56-bit keys → effective **112-bit** | Block | Encrypt–decrypt–encrypt with 3 keys; deprecated |
| **IDEA** | 128-bit | Block (64-bit blocks) | Used in PGP |
| **AES (Rijndael)** | **128 / 192 / 256-bit** | Block | ⭐ **The standard** — chosen by NIST to replace DES/3DES; used by US gov for sensitive-but-unclassified data |
| **Blowfish** | 32–448-bit | Block (64-bit) | Free/open, DES replacement |
| **Twofish** | 128/192/256-bit | Block (128-bit) | Open source |
| **RC4** | 40–2048-bit | **Stream** ⭐ | Only stream cipher in this list; used in SSL and WEP |
| **RC5** | up to 2048-bit | Block | — |
| **RC6** | — | Block | RC5-based; lost the AES contest to Rijndael |

⚠️ **TRAP:** "RC" = **Rivest Cipher** (Ron Rivest). RC1 never published, RC2 weak, RC3 cracked before release. **RC4 is THE stream cipher** to remember. **AES is the answer** for "which symmetric algorithm should you use?" in almost every scenario question.

---

## 4. Asymmetric Algorithms (Lesson 71)

| Algorithm | Purpose | Notes |
|---|---|---|
| **Diffie-Hellman (DH)** | **Key exchange** | Used to securely exchange symmetric keys, e.g. when establishing VPN/IPsec tunnels. Susceptible to on-path (MitM) attacks → needs authentication (password/cert) during exchange |
| **RSA** | Key exchange, encryption, **digital signatures** | Named for Rivest, Shamir, Adleman. Security relies on difficulty of **factoring large prime numbers**. Key sizes 1,024–4,096 bits. Used in those 6-digit 30–60-second rotating MFA tokens |
| **ECC (Elliptic Curve Cryptography)** | Encryption on **low-power/mobile devices** | Based on algebraic structure of elliptic curves over finite fields. ~**6x more efficient than RSA**: a 256-bit ECC key ≈ 2,048-bit RSA key in strength |

**ECC variants:**
- **ECDH** – Elliptic Curve Diffie-Hellman (ECC version of DH key exchange)
- **ECDHE** – Ephemeral; a **different key for each** key-establishment session (perfect forward secrecy)
- **ECDSA** – Elliptic Curve Digital Signature Algorithm; used by US government for digital signatures

⚠️ **TRAP:** For "mobile device / tablet / low processing power" questions, the answer is **ECC**. For "key exchange for a VPN tunnel," the answer is **Diffie-Hellman**. For "digital signature in commercial world," the answer is usually **RSA**.

---

## 5. Hashing (Lesson 72)

- Hashing = **one-way** cryptographic function. Input → fixed-length **message digest** (digital fingerprint). Same input = same digest, always; one-bit change = completely different digest. Output length is always the same regardless of input size.
- **Cannot be reversed** — you cannot recover the original message from the digest.

| Algorithm | Digest size | Notes |
|---|---|---|
| **MD5** | **128-bit** | Most famous; ⚠️ susceptible to **collisions** — no longer suitable for security certificates |
| **SHA-1** | **160-bit** | Better than MD5, still being phased out |
| **SHA-2** | 224 / 256 / 384 / 512-bit | SHA-256 and SHA-512 are the workhorses |
| **SHA-3** | 224–512-bit | Newer; **120 rounds** vs 64–80 in SHA-2 |
| **RIPEMD** | 160 / 256 / 320-bit | RIPEMD-160 most common; open-source SHA competitor |
| **HMAC** | varies | Hash-based Message Authentication Code — checks **integrity + authenticity**; paired with an underlying hash (HMAC-MD5, HMAC-SHA256) |

### Digital Signatures (critical concept)

A **digital signature = hash digest encrypted with the sender's PRIVATE key**.

1. Sender hashes the message (e.g., SHA-1 → 160-bit digest).
2. Sender encrypts that digest with their **private key** → this is the signature, attached to the message.
3. Receiver decrypts the signature with sender's **public key**, re-hashes the message, and compares.
4. Match = **integrity** (not modified) + **non-repudiation** (only the sender has that private key).

- **DSA** (Digital Signature Algorithm) = the US government standard (DSS); **RSA** is what most commercial entities use (faster, also does encryption and key distribution).
- **Code signing** = digitally signing software/installers (hash encrypted with the developer's private key) so app stores and users can verify the file hasn't been modified.

---

## 6. Increasing Hash Security (Lesson 73)

### Two hash attacks
- **Pass-the-Hash**: attacker steals a password's **hash** from a system and reuses it directly to authenticate — no need to crack it back to plaintext. Tools like **Mimikatz** automate hash harvesting. Defenses: patch workstations, proper domain trusts, MFA, least privilege.
- **Birthday attack**: exploits the **Birthday Paradox** — find two different messages that produce the **same hash** (a collision). With only **23 people** there's a >50% chance two share a birthday; only **57** for 99%. Same math makes hash collisions far more likely than intuition suggests → use long digests (SHA-256 over MD5).

### Defenses (all frequently tested)

| Technique | What it does |
|---|---|
| **Key stretching** | Runs a weak key through an algorithm repeatedly to create a longer, stronger key — makes brute force far slower. Used by WPA, WPA2, PGP |
| **Salting** | Adds **random data (salt)** to a password before hashing → identical passwords produce different hashes. Defeats dictionary, brute force, and **rainbow table** attacks |
| **Nonce** | "**Number used once**" — unique random value added to authentication so captured data can't be replayed. Defeats **replay attacks** |
| **Account lockout** | Limit failed logins (e.g., lock after 3 attempts) to slow down password guessing |

⚠️ **TRAP: Rainbow tables** = pre-computed tables for reversing hashes. Salting makes them impractical (attacker must rebuild a table per salt).

---

## 7. PKI (Lesson 74)

- **PKI (Public Key Infrastructure)** = the entire system — hardware, software, policies, procedures, people — for managing digital keys and certificates, built on asymmetric encryption.
- ⚠️ **TRAP: PKI ≠ public key cryptography.** PKI is the whole framework that *creates and manages* the key pairs; public key cryptography is just the encrypt/decrypt process inside it.
- **Real-world flow (HTTPS):** browser gets the server's public key from a **Certificate Authority (CA)** → browser generates a random symmetric key → encrypts it with the server's public key → server decrypts with its private key → both switch to a symmetric AES/TLS tunnel for bulk data. The padlock = success.
- **Certificate Authority (CA)** = trusted third party that issues digital certificates and keeps global trust intact.
- **Key escrow** = cryptographic keys stored with a secure **third party** so they can be recovered if lost (or for legal investigation). Controversial: if an attacker gets the escrowed keys, vast amounts of data are exposed. Access should be strongly regulated.

---

## 8. Digital Certificates (Lessons 75–76)

A **digital certificate** = digitally signed electronic document that binds a **public key to an identity** (person, server, or device). Uses the **X.509** standard. Contains owner info, owner's public key, and CA info.

### 14 terms you must know (exam favorites)

| Term | Meaning |
|---|---|
| **Wildcard certificate** | One certificate covers **all subdomains** of a domain (*.example.com). Cheap and easy to manage, BUT if revoked, all subdomains are affected |
| **SAN (Subject Alternate Name)** | Field that lets **one certificate cover multiple different domains** (e.g., example.com + example.org). ⚠️ Different domains → SAN, NOT wildcard |
| **Single-sided certificate** | Only the **server** authenticates to the client (normal HTTPS) |
| **Dual-sided certificate** | **Both** server and client authenticate with certificates; more secure but 2x server processing — used in high-security environments |
| **Self-signed certificate** | Signed by the entity itself; provides encryption but **no third-party trust** → browser warning. OK for testing/dev/internal closed systems |
| **Third-party certificate** | Issued/signed by a trusted CA whose root is embedded in browsers/OS |
| **Root of Trust / Chain of Trust** | Validation path up to a trusted root CA (e.g., Verisign, DigiCert). If a **root CA is compromised, every certificate it issued is compromised** |
| **Certificate Authority (CA)** | Trusted third party that issues certificates; its name, digital signature, serial number, validity dates are in the cert |
| **Registration Authority (RA)** | Receives the certificate request, collects identifying info, forwards to the CA |
| **CSR (Certificate Signing Request)** | Encoded block of text (org name, domain, locality, country, **public key**) sent to the CA. ⚠️ The **private key never leaves the requester** |
| **CRL (Certificate Revocation List)** | The CA's full list of **all revoked certificates**; checked before handing out a public key |
| **OCSP (Online Certificate Status Protocol)** | Checks revocation status of **one certificate** by serial number — faster than downloading the whole CRL, but **no encryption** (less secure) |
| **OCSP stapling** | Server fetches its OCSP record at intervals and **staples** it to the TLS handshake — no extra connection needed, faster tunnel setup |
| **Public key pinning** | HTTPS site presents trusted public keys in its HTTP header so the browser can detect **impersonation/fraudulent certificates** |
| **Key escrow agent** | Holds a secure copy of private keys against loss; retrieval should require **two admins** (separation of duties) |
| **Key recovery agent** | Specialized software to restore lost/corrupted keys — like a backup of the CA's keys for disaster recovery |

### Certificate demo takeaways (Lesson 76)
- Google uses an **ECC 256-bit** cert (mobile-first, low-power friendly); Apple serves an **RSA 2,048-bit** cert to desktops. Equivalent security, very different key sizes — same lesson as §4.
- Click the padlock → certificate details: subject, issuer, validity, public key info, fingerprint, signature algorithm (e.g., SHA-256 with RSA).

---

## 9. Blockchain (Lesson 77)

- **Blockchain** = shared, **immutable** ledger for recording transactions and tracking assets, built on hashing.
- Each **block** contains: the **previous block's hash**, a **timestamp**, and the transaction data (hashed into a Merkle-style tree → root hash). Change one block and every later block's hash breaks.
- **Public ledger** = record-keeping system that keeps participants' identities secure and semi-anonymous and tracks balances/transactions.
- **Decentralized** peer-to-peer network — no single point of control; trust comes from the math, not an intermediary.
- **Smart contracts** = self-executing code on the blockchain; terms written into code, execute automatically when conditions are met, tamper-proof once deployed (popularized by Ethereum).
- **Permissioned blockchain** = business-use blockchain with known participants (IBM pushes this).
- Non-crypto uses: **supply chain** traceability (track food from farm to store), voting, property transfers, IP protection.

---

## 10. Encryption Tools (Lesson 78)

| Tool | What it is | Exam cue |
|---|---|---|
| **TPM (Trusted Platform Module)** | Dedicated **microcontroller** on the motherboard that secures hardware via integrated cryptographic keys; hardware-level vault. Used by **BitLocker** | "Secures keys in hardware on the endpoint" |
| **HSM (Hardware Security Module)** | Physical appliance that safeguards/manages digital keys; performs crypto in a **tamper-proof** environment; accelerates crypto; used for **mission-critical/financial transactions** and regulatory compliance | "Bank-grade vault for enterprise key storage" |
| **KMS (Key Management System)** | Centralized system managing the **full key lifecycle** — generation, distribution, storage, rotation, retirement, destruction — for devices/apps | "Manage thousands of cloud keys automatically" |
| **Secure enclave** | **Co-processor isolated from the main CPU**; shielded processing/storage of sensitive data (Face ID/Touch ID, Apple Pay data). Data never leaves the enclave, safe even if the device is compromised | "Biometric data protection on phones" |

---

## 11. Obfuscation (Lesson 79)

| Technique | What it does | Example |
|---|---|---|
| **Steganography** | Hides secret data **inside an ordinary non-secret file** so the message's *existence* is concealed ("covered writing"). Not encryption — hidden in plain sight. Common carrier: images (tweak pixel colors); also used with encryption for extra layers | Hiding a message inside a cat photo |
| **Tokenization** | Replaces sensitive data with **non-sensitive tokens** that have no exploitable meaning; real data lives in a separate secure vault. Used heavily in **payment systems / PCI DSS** to shrink compliance scope | Merchant stores a token, not your card number |
| **Data masking (data obfuscation)** | Disguises original data while keeping it **usable and realistic** for a specific purpose | Test DB uses fictional names; support staff sees only last 4 digits of a card/SSN |

⚠️ **TRAP:** Encryption makes data unreadable; **steganography hides that the data even exists**. Tokenization *replaces* the data with a token (reversible via the vault); masking *alters* the data for display (last-4 style).

---

## 12. Cryptographic Attacks (Lesson 80 — OBJ 2.3 & 2.4)

### Downgrade attack (a.k.a. version rollback attack)
- Forces a system to use a **weaker/older protocol** than it supports, exploiting known flaws in the old version. Works because systems keep backward compatibility.
- **POODLE** (Padding Oracle On Downgraded Legacy Encryption) = the famous example, forced connections back to **SSL 3.0**.
- Countermeasures: phase out legacy protocols entirely; **version intolerance checks** (start by claiming to support only the newest version and see if the peer really can't do better).

### Collision attack
- Find **two different inputs with the same hash output**. Exploits hash-based file verification (e.g., poisoned download that matches the published MD5 hash).
- **MD5** collisions were practically demonstrated → MD5 is dead for certificates/signatures.
- Powered by the **Birthday Paradox/attack**: collisions are far easier to find than brute-forcing a specific value (only ~2^(n/2) attempts, not 2^n).

### Quantum computing & post-quantum crypto
- **Qubit** = quantum bit using superposition — many combinations of 1/0 simultaneously. Quantum computers excel at the math problems underlying asymmetric crypto.
- ⚠️ **Asymmetric algorithms (RSA, ECC, DH) are mathematically breakable by quantum computers** via rapid factoring of large primes / solving discrete logarithms. Symmetric crypto survives better — just double the key (AES-128 → AES-256 squares the brute-force work).
- Post-quantum = algorithms that run on today's classical computers but resist quantum attacks:
  - **CRYSTALS-Kyber** – NIST's pick for **general encryption** (lattice-based, ≈ AES-256 strength)
  - **CRYSTALS-Dilithium** (primary), **FALCON**, **SPHINCS+** – for **digital signatures** (SPHINCS+ is hash-based; the others lattice-based)
- NIST completed its 6-year competition in **2022**, selecting four algorithms.

---

## Rapid-Fire Self-Test (say the answer before looking)

1. What provides the security in any encryption system — the algorithm or the key? → **The key**
2. Name the three data states. → **At rest, in transit, in use**
3. Symmetric key count needed for 6 people to all talk to each other? → **15 (n(n−1)/2)**
4. Which key encrypts for confidentiality in asymmetric crypto? → **Receiver's public key**
5. Which key creates a digital signature? → **Sender's private key**
6. Stream vs block cipher difference? → **Byte-at-a-time (keystream/XOR) vs fixed-size blocks with padding**
7. The one stream cipher among DES/3DES/IDEA/AES/Blowfish/Twofish/RC4? → **RC4**
8. Default "which symmetric algorithm?" answer? → **AES (128/192/256-bit)**
9. DES effective key length? → **56 bits (64 minus 8 parity)**
10. 3DES effective strength? → **112-bit (3 × 56-bit keys)**
11. Algorithm for VPN/IPsec key exchange? → **Diffie-Hellman**
12. RSA's security relies on? → **Factoring large prime numbers**
13. Best asymmetric choice for mobile/low-power? → **ECC** (256-bit ECC ≈ 2,048-bit RSA)
14. What does ECDHE add? → **Ephemeral keys — new key each session**
15. Hashing is reversible — true or false? → **False — one-way**
16. MD5 digest size? SHA-1? SHA-256? → **128 / 160 / 256 bits**
17. What is a digital signature, mechanically? → **A hash digest encrypted with the sender's private key**
18. What does HMAC add? → **Integrity + authenticity (keyed hash)**
19. Two ways to attack stored password hashes? → **Pass-the-hash and birthday attack**
20. Defense against rainbow tables? → **Salting**
21. What is a nonce? → **Number used once — defeats replay attacks**
22. PKI vs public key cryptography? → **PKI = whole management framework; public key crypto = just the encrypt/decrypt piece**
23. What binds a public key to an identity? → **A digital certificate (X.509)**
24. One cert for all subdomains? → **Wildcard**
25. One cert for two different domains? → **SAN field**
26. Cert signed by itself, browser warning? → **Self-signed**
27. Who collects your info before the CA issues a cert? → **Registration Authority (RA)**
28. What never leaves the requester during a CSR? → **The private key**
29. CRL vs OCSP? → **Full revocation list vs single-certificate status check (faster, unencrypted)**
30. OCSP stapling benefit? → **No extra connection at handshake — faster, server presents cached status**
31. Defends against fraudulent certs / impersonation via HTTP header? → **Public key pinning**
32. Every cert compromised if what is compromised? → **The root CA**
33. TPM vs HSM? → **Endpoint microcontroller (BitLocker) vs enterprise tamper-proof crypto appliance**
34. Full lifecycle key management system? → **KMS**
35. Where does Face ID data live? → **Secure enclave (isolated co-processor)**
36. Hiding a message inside an image? → **Steganography**
37. Replacing card numbers with vault-referenced tokens? → **Tokenization**
38. Showing only last 4 digits to support staff? → **Data masking**
39. Attack that forces SSL 3.0? → **POODLE (downgrade/version rollback attack)**
40. Probability principle behind collision attacks? → **Birthday paradox** (23 people → >50%)
41. Which crypto family dies to quantum computers? → **Asymmetric (RSA/ECC/DH)**
42. Post-quantum pick for encryption? For signatures? → **CRYSTALS-Kyber / CRYSTALS-Dilithium (or FALCON, SPHINCS+)**
43. Post-quantum defense for symmetric crypto? → **Longer keys (AES-128 → AES-256)**
44. Steganography vs encryption? → **Hides the existence of the message vs makes it unreadable**
