# Identity and Access Management Solutions — Study Notes (Section 17 · OBJ 2.4 & 4.6)

Identity is Domain 4's heart and SY0-701 loves scenario questions here: "which factor is this?", "which access control model fits?", "what stops password spraying?". Know the definitions and the attacks.

## 1. IAM Fundamentals

Goal: the **right individuals** access the **right resources** at the **right times** for the **right reasons**.

Four processes:
- **Identification** — user CLAIMS an identity (username/email). Claiming, not proving.
- **Authentication** — VERIFYING that claimed identity (password, biometrics, factors).
- **Authorization** — determining what permissions/access the authenticated user has (HR sees personnel files; finance sees financial data).
- **Accounting (auditing)** — tracking and recording user activities (logins, actions, changes) for monitoring, forensics, evidence.

Supporting concepts:
- **Provisioning** — creating accounts and granting appropriate access (new hire setup).
- **Deprovisioning** — removing access when no longer needed (termination) — critical against insider-threat revenge.
- **Identity proofing** — verifying identity BEFORE account creation (driver's license, passport, trusted data source).
- **Interoperability** — systems working together via standards like **SAML / OpenID Connect**.
- **Attestation** — periodic reviews/audits confirming accounts and rights are correct and minimal.

## 2. Multifactor Authentication

Five factor categories:
| Factor | Type | Examples |
|---|---|---|
| Something you **know** | Knowledge | Password, PIN, security question |
| Something you **have** | Possession | Smart card, hardware token/key fob, soft token (app), phone receiving SMS code |
| Something you **are** | Inherence | Fingerprint, face, iris, voice |
| Something you **do** | Behavior | Keystroke patterns, mouse movement, gait, swipe style |
| Somewhere you **are** | Location | IP address, GPS, network connection |

- **Single-factor** = one category. Username + password + security questions = STILL single-factor (all knowledge).
- **2FA** = two different categories (password + phone code). **MFA** = two or more; 2FA is a subset of MFA.
- Smart card + PIN = 2FA (possession + knowledge) — classic government badge model.
- Hardware tokens: key fobs rotating codes every **30–60 seconds**; USB tokens holding a private-key certificate. Soft tokens: authenticator apps (Google/Microsoft Authenticator) or **SMS one-time codes valid 3–10 minutes**.
- Biometrics data points: fingerprint ~1 in 50,000 false match (Apple); Face ID ~1 in 1,000,000 — roughly 20× stronger.
- **Passkeys** (passwordless): public-key cryptography — private key stays on the device protected by the lock screen; **public key on the server** (server breach leaks no secret). Each passkey unique per service → phishing-resistant. Benefits: better login success, lower drop-off, reduced MFA cost.
- Security vs convenience: more factors = safer but harder to use; most orgs use 2–3.

## 3. Password Security

Five policy characteristics:
1. **Length** — the #1 strength driver; every added character multiplies the crack time (4-digit PIN = 10,000 combos; 8 digits = 100M). Recommend **12–16+ characters** (via the "relaxed minimum password length" setting beyond 14).
2. **Complexity** — mix of upper, lower, numbers, special characters (72-char alphabet → 4-char password has ~26.8M combos vs 10k numeric).
3. **Reuse** — never across accounts; enforce **password history** (demo set to 24) so old passwords can't cycle back. Note: recycled >90-day-old passwords may already be cracked (cracking takes 3–6 months).
4. **Expiration** — forced periodic change (e.g., 90 days). **NIST no longer recommends forced expiration** in most orgs (it breeds keyboard-walking: diontraining1→2→3) unless password managers are mandatory.
5. **Password age** — **minimum age** (e.g., 3 days) stops users rapidly cycling changes to defeat password history and return to their favorite password.

**Password managers** (Bitwarden, 1Password, Dashlane, browser built-ins): one encrypted vault behind a single strong master password. Features: generation, autofill, secure sharing (login without revealing the password), cross-platform.

**Passwordless options**: biometrics, hardware tokens, one-time passwords (OTP, 3–10 min validity, single use), magic links (single-use emailed link), passkeys.

## 4. Password Attacks (OBJ 2.4)

| Attack | How it works | Key mitigation |
|---|---|---|
| **Brute force** | Every possible combination until found; slow vs long/complex | Length, complexity, attempt limits, MFA, CAPTCHA |
| **Dictionary** | Tries a list of common passwords; modern lists include **Leet Speak** (P@$$w0rd) substitutions | Same as brute force |
| **Password spraying** | A FEW common passwords tried across MANY accounts — avoids per-account lockout | Unique passwords, MFA |
| **Hybrid** | Dictionary word + brute-forced variation (e.g. word + 6-digit number appended, generated dynamically) | Length + complexity |

- **John the Ripper** demo: `john --format=Raw-md5 mypassword.txt` cracked instantly via wordlist lookup. Cracked hashes cached in `~/.john/john.pot` (delete to re-crack).
- **Salting** = random string added before hashing; defeats rainbow/lookup tables. Use **SHA-256 + salt** (never plain MD5).

## 5. Single Sign-On (SSO)

One set of credentials → many applications, via a **trusted relationship** with an **Identity Provider (IdP)**. User authenticates to the IdP (e.g., domain controller); apps query the IdP and get an authentication assertion.

Benefits: better UX, productivity, fewer helpdesk resets, stronger passwords (only one to remember → less reuse).

Three protocols:
- **LDAP** — directory access/maintenance over IP; central user repository; lookups for authN and group/role data for authZ; plain text capable → use **LDAPS (SSL/StartTLS)** for credentials.
- **OAuth (Open Authorization)** — token-based authN/Z for third-party services WITHOUT exposing the password; JSON Web Tokens (JWT, Base64, digitally signed); authorization server issues access token presented to resource/API server. ("Log in with Google" = OAuth.)
- **SAML (Security Assertion Markup Language)** — XML-based standard for logging users into apps based on sessions in another context; app redirects to IdP, IdP verifies and returns a SAML response/assertion; decouples services from identity providers.

## 6. Federation

Sharing identities ACROSS organizations: users log in with their HOME organization's credentials to access a PARTNER's systems, based on pre-established trust. Covers employees, partners, suppliers, customers.

Six steps: (1) login initiation (domain recognized as federated), (2) redirect to the IdP (home network), (3) authenticate at IdP, (4) IdP generates an **assertion** (token with identity/auth status/attributes, e.g. SAML or OpenID Connect), (5) user returned to the **service provider** with the assertion, (6) SP verifies the assertion and grants access.

Benefits: simplified UX, reduced admin overhead (no partner account management), better security (no password reuse/insecure storage). Technologies: **SAML, OAuth, OpenID Connect**.

## 7. Privileged Access Management (PAM)

Policies + procedures + technical controls preventing abuse of privileged accounts. Three components:
- **Just-in-time (JIT) permissions** — admin rights granted only when needed for a specific task/period, revoked on completion (no standing privilege).
- **Password vaulting** — privileged credentials (Windows admin, Linux root) stored in a secure vault requiring MFA; checkout is logged (who/when).
- **Temporal (temporary) accounts** — time-limited accounts auto-disabled/deleted (e.g., contractor account for a project, killed at completion).

## 8. Access Control Models (OBJ 4.6)

| Model | Decided by | Example / notes |
|---|---|---|
| **MAC** (Mandatory) | Central authority via **security labels/clearances** | Military: Secret clearance reads Secret/Confidential/Unclassified, NOT Top Secret. Everything not expressly allowed is forbidden. Complex, costly — high-security systems only. |
| **DAC** (Discretionary) | The resource **owner** decides who gets access | Sharing a file and adding a specific user; need-to-know based on identity. |
| **RBAC** (Role-based) | User's **role/group** | Windows groups mirroring org chart (Accounting, HR, nested Employees group). Great for high turnover — permissions follow the role. |
| **Rule-based** | **Rules/ACLs** applied to all users | Router/firewall ACLs affecting everyone on a segment; quickly changeable. |
| **ABAC** (Attribute-based) | Attributes of user, environment AND resource | User role + time of access + location + data sensitivity combine into the decision. |

(Note the course's collision: RBAC also abbreviates rule-based in one slide — context tells them apart.)

- **Time-of-day restrictions** — access only during set hours (e.g., block 2 AM logins); pairs with other models; blunts insider threats acting in irregular hours.
- **Least privilege** — minimum access needed for the job, nothing more (read-only users can't write). Also limits damage from compromised accounts.
- **Permission/authorization creep** — users accumulate rights across moves/promotions (Samantha's three departments). Fix: revoke old permissions at role change + attestation reviews.

## 9. Assigning Permissions

- **Local administrator** = master key (system settings, installs); **standard user** = limited key (no config changes, own storage area only). Everyday work on standard accounts.
- **Microsoft account** — online account spanning Windows/Office 365/Xbox/Skype; can replace a local account.
- **UAC (User Account Control)** — Windows checkpoint: actions needing admin rights require explicit authorization (password or Yes); the shield icon marks such actions. Purpose: stop malware from silently gaining admin privilege.
- Groups: users inherit group permissions (Administrators, Standard Users; nested groups).
- File/folder permissions (Windows: right-click → Properties → Security): read / write / execute / full control, set per file or folder (folder applies to contents). When in doubt, grant LESS.

## Quick-fire traps

- Username + password + security question = single-factor (all knowledge).
- Spraying = few passwords × many accounts (avoids lockout).
- NIST says drop forced password expiration (unless managers are mandated).
- Passkeys: private key on device, public key on server — server breach ≠ credential leak.
- MAC = labels; DAC = owner; RBAC = role/group; rule-based = ACLs; ABAC = attributes.
- Federation crosses orgs; SSO can be within one org.
- PAM trio: JIT, vaulting, temporal accounts.
- Deprovisioning at termination — insider threat defense.
- UAC prompts = least-privilege enforcement on Windows.
