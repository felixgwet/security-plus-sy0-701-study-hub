# Automation and Orchestration — SY0-701 Study Notes (Section 26, OBJ 4.7)

## Key Definitions
- **Automation** = automatically executing tasks without manual intervention (software/scripts). Makes individual tasks autonomous.
- **Orchestration** = coordinated, sequenced execution of MULTIPLE automated tasks to achieve a workflow, managing order and dependencies. Big-picture.
- **SOAR** = Security Orchestration, Automation, and Response — a class of tools that orchestrate/automate **playbooks** and deliver **data enrichment**. Think **"SIEM 2.0"** (SIEM + SOAR integrated). Primarily used for **incident response** (also threat hunting).
- **Playbook** = checklist of actions to detect/respond to a specific incident type (can be manual or automated).
- **Runbook** = an **automated version of a playbook** with clearly defined **human interaction points** (e.g. pause at step 2 for an analyst decision).

## When to Automate/Orchestrate — 5 Considerations
1. **Complexity** — best ROI on repetitive tasks that are somewhat complex. Nightly backup = automation only; multi-step malware IR workflow (isolate → image → forensics → reformat → reinstall → scan → return) = orchestration.
2. **Cost** — large upfront investment (devs/service provider) vs long-term savings; do a **cost-benefit analysis** (hardware, software, personnel, ongoing support). Example: manual voucher fulfillment → automation → full orchestration as volume grew.
3. **Single points of failure** — build **redundancy, failover, and manual fallback processes** so failed automation doesn't halt the business.
4. **Technical debt** — hastily built automation accumulates suboptimal code that must be refactored; schedule regular reviews/updates.
5. **Ongoing supportability** — APIs/webhooks change when vendors update systems and **break your automations**; ensure in-house skills/training to maintain them (outsourced one-time builds often fail later).
- **Best candidates: repeatable + stable processes.** One-off or highly variable tasks (e.g. a migration done once every few years) → do manually (30 min manual vs 4–5 hours to automate).

## 7 Benefits of Automation & Orchestration
1. **Increased efficiency / time savings** — patch, deploy, back up without human intervention; fewer human errors.
2. **Enforcing baselines** — consistently apply security/compliance baselines enterprise-wide.
3. **Standard infrastructure configurations** — consistent builds; auto-corrective actions on deviation.
4. **Scaling securely** — dynamic cloud scale-up/down with security protocols intact (humans can't deploy VMs as fast or securely).
5. **Increased employee retention** — removing mundane work reduces burnout; staff focus on meaningful work.
6. **Faster reaction times** — automated detection/response; machines never tired or on vacation; minutes vs hours/days.
7. **Workforce multiplier** — smaller team manages larger infrastructure; automation costs trend down while labor costs rise.

## Automating Support Tickets
- **Ticket creation (6 steps)**: ① user submits via email/web form/portal → ② automation monitors submissions and generates tickets on predefined criteria → ③ captures details (issue, contact, metadata) → ④ categorizes (network, software...) → ⑤ assigns priority per rules → ⑥ notifies the right team/technician.
- **Ticket escalation (5 steps)**: ① define escalation criteria (issue nature, urgency, SLA) → ② automation rules monitor attributes (priority, response time, unresolved status) → ③ trigger actions (notify supervisor, reassign to higher-tier expert, raise priority) → ④ monitor/track progress → ⑤ resolution/closure + user notification.
- Dion example: Q&A posts polled every 4 hours → tickets; unanswered tickets escalate at 24/48 h per SLA.

## Automating Onboarding
- **User provisioning**: collect info (HR portal) → create accounts (email, work platforms, comms) → auto-assign roles/access by department/position (**RBAC-driven**) → notify employee/manager/IT → continuous synchronization (promotions/department moves update access).
- **Resource provisioning (5 steps)**: requirements analysis (role/department) → allocation (procure or assign: workstation, phone, license) → configuration/customization (designer gets Adobe; salesperson gets CRM) → verification + **auditing** (inventory/compliance) → feedback from employee/manager.
- Deprovisioning on departure is equally important.

## Automating Security
1. **Guardrails** — automated safety controls preventing insecure configs; continuously monitor; on violation: alert + auto-correct (revoke permissions, reconfigure, isolate workstation).
2. **Security groups** — virtual firewall for cloud instances; automate assignment by function/location/project; dynamically adjust as threats evolve; analyze traffic vs rules.
3. **Enabling/disabling services and access** — auto-review who has access (least privilege); unusual activity → auto-restrict until analyst review; schedule services on/off to shrink attack windows.
4. **Permissions management (RBAC)** — auto provision/deprovision on join/move/leave; routine compliance checks of permission settings.
- Goal: operate "at the speed of cyber" — precision + reactivity, not just workload reduction.

## Automating Application Development — CI/CD
- Waterfall = 3–12 months per release; Agile = weeks; **CI/CD = same day, multiple releases/day** (Flickr: up to 10/day).
- **Continuous Integration (CI)** — developers merge code into a central repo multiple times/day; each check-in verified by automated builds + automated tests; fast feedback loop.
- **Release** = finalizing/preparing software for delivery into an environment (staging/production). **Deployment** = installing the software into the target environment so it's operational. (Release = make available; deploy = install it.)
- **Continuous Delivery** — code is ALWAYS in a deployable state (automated build/test through staging) but **production deployment is a MANUAL business decision**. (Dion Training uses this — CTO/COO decide timing.)
- **Continuous Deployment** — every change passing all pipeline stages is **automatically deployed to production with NO human intervention**; includes **automated rollback** to the previous known-good state on failure.
- Culture shift: developers own post-code deployment quality; ops shift from deployment logistics to process improvement; collective responsibility.

## Integrations and APIs
- **Integration** = combining subsystems into one comprehensive system. **API** = rules/protocols letting one product/service talk to another in a controlled way with a specific data format; the #1 tool for microservice/service-oriented interconnection; enables cloud provisioning/deprovisioning and third-party service calls.
- **REST** = architectural style; standard HTTP methods/status codes, URIs, MIME types; **stateless**; uses **JSON**; lightweight, easy with websites.
- **SOAP** = strict protocol; **XML** format with header+body; more robust — extra **security features and transaction compliance**; suits enterprise/regulated services.
- Real-world example: Udemy API → Freshdesk API sync (<150 lines Python on AWS Lambda, ~$1/month).
- **cURL** — default tool on Linux/Mac (installable on Windows) to test APIs over HTTP/HTTPS (also FTP, SCP, LDAP...). Example: `curl --data "firstname=bob&lastname=smith" https://httpbin.org/post` → JSON response showing echoed data.

## High-yield exam triggers
- "Checklist of IR actions" → **playbook**; "automated playbook with human checkpoints" → **runbook**.
- "SIEM 2.0" → **SOAR**.
- "Always deployable but manual go-live" → **continuous delivery**; "no human intervention to production" → **continuous deployment**.
- "REST/SOAP" → JSON/stateless vs XML/transaction+security.
- "API testing tool" → **cURL --data**.
- "Manual fallback if automation fails" → **single point of failure** mitigation.
- "Vendor updated their system and broke our automation" → **supportability**.
