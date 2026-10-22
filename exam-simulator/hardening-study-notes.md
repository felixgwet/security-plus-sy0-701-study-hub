# Section 20 — Hardening (SY0-701 Study Notes)

Objectives 2.5, 4.1, 4.5: mitigation techniques to secure the enterprise, security techniques for computing resources, modifying enterprise capabilities to enhance security. Classic "given a scenario, pick the right hardening control" domain.

## 187/188 — Changing Default Configurations

Defaults exist for easy setup, NOT security. Change them first:

- **Default passwords**: e.g., admin/admin, administrator/password, admin/blank — published in manuals/knowledge bases. Change immediately; add MFA if supported; otherwise long/strong/unique (rotate ~90 days, use a password manager).
- **Unneeded ports/protocols**: audit what's in use; disable the rest — every open port is an attack surface. Move to encrypted versions where available: **HTTP (80) → HTTPS (443); SMTP (25) → SMTPS (587 or 465)**.
- **Extra open ports**: devices ship with ports open for max compatibility (e.g., 22 SSH and 23 Telnet). **Close Telnet (23) — plaintext, never use it.** Close 80 if only 443 is needed.
- Simple changes (passwords, closed ports) are the first, most formidable line of defense. Be proactive, not reactive.

## 189 — Restricting Applications & Least Functionality

- **Least functionality**: configure a workstation/server to provide ONLY the essential apps/services the user needs. Restrict unneeded applications, services, ports, protocols; uninstall unneeded apps (each adds code = vulnerabilities, and each must be patched).
- Legacy versions linger after upgrades (e.g., old Adobe installs) — uninstall them to eliminate their vulnerabilities.
- **Allowlisting** (bouncer list): only listed apps run; everything else blocked. **Most secure** (deny by default) but hard to manage (every app update changes the entry). Like an explicit allow ACL at the application level.
- **Blocklisting** (no-fly list): listed apps blocked; everything else runs. Easier to manage but **less secure** — new malware runs until you add a rule.
- Domain environments deploy lists centrally via **Active Directory group policies**.
- For higher security use allowlisting; at minimum blocklist known-bad apps.

## 190 — Unnecessary Services

- Services run in the background (e.g., print spooler). Disable unneeded ones — they consume resources and add attack surface.
- **Windows**: `services.msc` (set Startup: Manual/Automatic/Disabled — Stopping alone means it restarts at reboot; must set Disabled). CLI: `sc stop <service>`, `net stop <service>`. (Windows Update service = `wuauserv`; enterprises disable it on endpoints so patches come through the patch-management system instead.)
- **macOS**: Activity Monitor → Quit/Force Quit.
- **Linux/macOS terminal**: `top` to view processes, `kill <PID>` to terminate.

## 191 — Trusted Operating Systems

- **Trusted OS (TOS)**: enforces stringent security policies, usually **mandatory access control (MAC)** — access decided by administrator-defined policy, enforced by the OS; even the data owner cannot override. Used where integrity/confidentiality/availability are critical.
- **Common Criteria / EAL (Evaluation Assurance Level)**: EAL1 (lowest) → EAL7 (highest).
  - **Integrity-178B** (fighter jets — F-16, F-22, F-35, B-2, Airbus A380): **EAL6**, POSIX-based embedded.
  - **SELinux**: **EAL4+**; **Trusted Solaris**: MAC multi-level ops with auditing + compartmentalization.
  - Generic OS (Windows since 7, macOS since 10.6, many Linux): **EAL4 / EAL4+** — methodically designed/tested, good assurance, but far below EAL6/7, which require embedded/purpose-built systems (costly).
- **TCB (Trusted Computing Base)**: all parts critical to security; **microkernels minimize the TCB** → smaller attack surface.
- Mobile: Android uses sandboxing + tools like **AppArmor** for MAC.
- TOS trade-off: very expensive and challenging to design/maintain — balance security vs. usability/performance.

## 192 — Updates and Patches

- **Hotfix**: a patch for a **security issue** — apply immediately **after lab testing**.
- **Update**: adds **functionality/features**, usually not security — and can introduce new vulnerabilities needing future hotfixes.
- **Service pack**: bundles hundreds/thousands of hotfixes + updates into one installer (e.g., Windows XP SP3).
- **Reverse engineering risk**: attackers reverse-engineer released patches within days to build exploits → unpatched systems are breached. Most headline breaches = missing patches.
- Effective patch management program (9 elements): owner/team tracking vendor bulletins; automated patching mechanism covering OS + apps; include cloud resources; **triage patches urgent/important/non-critical**; **lab test environment**; detailed patching logs; firmware-update process; emergency push via change advisory board; periodic combined rollout of non-critical patches.

## 193 — Patch Management Process

**Four steps: Planning → Testing → Implementing → Auditing.**

1. **Planning**: policies/procedures/systems to track patches, verify compatibility, decide test/deploy methods. Tools: Microsoft Endpoint Configuration Manager or third-party.
2. **Testing**: test every patch in a small lab/test workstation before network-wide deployment — patches can break unique configurations.
3. **Implementing**: manual (tiny networks) or automated (large). Enterprises manage via an **update server** (disable the Windows Update service on endpoints). Mobile devices patch via **MDM**.
4. **Auditing**: scan/verify patches installed correctly, find failed deployments.

- **Patch rings**: staged rollout — Ring 1: 10–20 machines → Ring 2: 50–100 (admins/service desk) → Ring 3: 1,000–2,000 → Ring 4: everyone. Limits blast radius and service-desk calls.
- **Firmware management**: network devices run firmware (Cisco IOS = "inner network operating system"); flash firmware to update. Cisco UCS Manager centralizes it; third-party tools (e.g., ManageEngine DeviceExpert) automate upgrade/downgrade/configuration.
- Patch management = security + uptime + compliance + features.

## 194 — Group Policies

- **Group policy**: rules applied to sets of users or computer accounts; centrally manages settings. Local editor: **gpedit** (Run). Domain environments get an advanced version on the domain controller.
- Policies act as **security templates**: password complexity, account lockout, software/application restrictions.
- **GPOs** (group policy objects) harden the OS and build the **secure baseline** under configuration management.
- **Baselining**: measuring changes to establish what **normal** is, so deviations (e.g., unusual Saturday traffic spike → possible exfiltration) can be investigated. Every deviation is categorized: acceptable or investigate.
- **AppLocker** (under Application Control Policies): Windows allow/deny listing. Rule conditions: **Publisher** (block a compromised vendor's signed code), **Path** (e.g., block %WINDIR%\Temp\*), **File hash** (block a known malware digest). Default rules allow Program Files, Windows folder, and admins.

## 195 — SELinux

- **MAC (Mandatory Access Control)**: system-enforced, based on **subject clearance + object labels** — not owner discretion. Contrast **DAC**: owner controls access (chown/chmod).
- Context-based permission schemes: **SELinux** and **AppArmor** (both MAC). SELinux created by the **NSA**; default on **CentOS/Red Hat**.
- SELinux contexts: **User** (unconfined_u, user_u, sysadmin_u, root), **Role** (object_r for files/dirs), **Type** (the label — most important for fine-grained control), optional **Level** (sensitivity → multi-level security).
- **Modes**: **Disabled** (off, DAC only), **Enforcing** (policies applied), **Permissive** (logs violations but doesn't enforce — great for policy tuning).
- **Policies**: **Targeted** (default on RHEL/CentOS — only targeted processes confined, rest unconfined) vs **Strict** (MAC on everything — very hard to set up).
- Violations go to the audit log; expect false positives while tuning. SELinux is only as strong as the restrictive profiles you write.

## 196 — Data Encryption Levels

| Level | Tool example | Notes |
|---|---|---|
| **Full-disk** | BitLocker (Windows), FileVault (macOS); hardware FDE | Whole drive; PIN/password/key at boot; survives drive removal |
| **Partition** | VeraCrypt | One partition only (e.g., sensitive docs) — less overhead than whole disk |
| **Volume** | VeraCrypt | Encrypted container of chosen size; can layer on top of FDE |
| **File** | GPG (GNU Privacy Guard) | Individual files, e.g., before emailing |
| **Database** | SQL Server TDE (Transparent Data Encryption) | Whole DB encrypted across devices/cloud; no app changes |
| **Record** | Column-level | Encrypt only sensitive columns (credit card, SSN) — most granular |

Encryption adds read/write overhead → choose granularity to balance security vs. performance.

## 197 — Secure Baselines

- **Secure baseline**: standardized secure starting configuration establishing a minimum security level across assets.
- **Establish**: assess data types/workflows/threats; start from frameworks (**ISO 27001, NIST SP 800-53**). Build a template machine (format → OS → update → secure → scan), install role-based apps, scan again, then **image it** as the known-good baseline. Keep refining with patches/updates.
- **Deploy**: firewalls, permissions, encryption, AV/anti-malware; automated tools/scripts apply uniformly. **Windows: GPOs** (password policy, user rights, audit settings). **AWS: AWS Config** for cloud resources.
- **Maintain**: lock down systems (users can't install software/change configs); continuous monitoring for **deviation alerts** → SOC remediation; periodic reviews against evolving threats; user training/awareness.

---

### High-yield rapid-fire list
- admin/admin → change default password; port 23 → close it (Telnet = plaintext); 80→443, 25→587/465.
- Allowlist = deny by default = most secure; blocklist = allow by default = easier.
- `services.msc` set Disabled (not just Stop); `sc stop` / `net stop`; Linux `kill <PID>`; `top`.
- Hotfix = security, now; update = features; service pack = bundle.
- Plan → Test → Implement → Audit; patch rings limit blast radius.
- gpedit → GPOs → AppLocker (publisher/path/hash rules).
- SELinux: NSA, RHEL/CentOS default, Targeted policy default, Permissive = log-only.
- BitLocker/FileVault = FDE; VeraCrypt = partition/volume; GPG = file; TDE = database.
- ISO 27001 / NIST 800-53 = baseline starting frameworks; AWS Config = cloud baselines.
- EAL1–7: Integrity-178B EAL6; Windows/macOS/SELinux EAL4+; microkernel minimizes TCB.
