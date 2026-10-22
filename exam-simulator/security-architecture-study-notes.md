# Security Architecture — Study Notes (Section 15 · OBJ 3.1 & 4.1)

Exam weight feel: architecture "compare and contrast" questions are everywhere on SY0-701. Know the definitions cold, and know which model fits which scenario (the exam loves "which architecture BEST fits…").

## 1. On-Premise vs Cloud vs Hybrid

| Model | Who manages | Best for |
|---|---|---|
| On-premise | Organization owns/maintains everything (servers, updates, security, power) | Maximum control, sensitive data, regulatory needs (law firm, HIPAA patient data) |
| Cloud (IaaS/PaaS/SaaS) | Split per the **responsibility matrix** (always defined in the contract) | Scalability, low upfront cost, fast deployment |
| Hybrid | Mix of on-prem + private + public cloud; move workloads between environments | Sensitive data on-prem, high-volume low-sensitivity tasks in cloud |

- **Responsibility matrix**: division of responsibilities between provider and customer. In **IaaS** the provider manages the *infrastructure only* — the customer handles OS, middleware, runtime, data, and applications. It changes with the model and contract.
- **Hybrid considerations**: data security, compliance, interoperability, cost.
- **Key cloud considerations** (memorize the list): availability, resilience, cost, responsiveness, **scalability**, ease of deployment, **risk transference** (some risk moves to the provider — but the customer is still responsible for securing their own data), ease of recovery, **patch availability** (provider patches automatically) vs **inability to patch** (legacy app incompatibility), power (provider's problem), compute.
- Availability ≠ resilience: availability = accessible when needed (SLAs, e.g. 99.99% uptime); resilience = ability to recover from failures and keep functioning.

## 2. Cloud Security Issues (the 8 classic weaknesses)

1. **Shared physical server vulnerabilities** — multi-tenant; mitigate with hypervisor protection, secure multi-tenancy, isolation
2. **Inadequate virtual environment security** — secure VM templates, patch VMs, monitor, network segmentation to stop lateral movement
3. **User access management** — weak passwords, excessive permissions; MFA + least privilege + activity monitoring
4. **Lack of up-to-date security measures**
5. **Single point of failure** — redundancy + failover across multiple servers/data centers/providers
6. **Weak authentication and encryption practices**
7. **Unclear policies** — confusion/inconsistency in data handling, access control, incident response
8. **Data remnants** — residual data left after deletion; recoverable by attackers. Fix: secure deletion that **overwrites** data, secure backup management, verify removal

Cloud security is a **shared responsibility**: provider secures the infrastructure, customer secures their data and applications.

## 3. Virtualization & Containerization (very high exam frequency)

- **Hypervisor** = platform that distributes physical resources (CPU, memory, disk) among VMs.
- **Type 1 (bare-metal/native)**: runs directly on hardware, acts like a specialized OS — Hyper-V, XenServer, ESXi/vSphere. **Faster and more efficient** (no host OS consuming resources).
- **Type 2 (hosted)**: runs inside a standard OS — VirtualBox, VMware Workstation. More versatile, less efficient.
- **Containers** (Docker, Kubernetes, OpenShift): lightweight alternative; app + dependencies isolated in user space, **shares the host OS kernel** with other containers. Benefits: efficiency/speed, portability, scalability, isolation, consistency.
- **Virtualization vulnerabilities** (know all six):
  - **VM escape** — attacker breaks out of a VM to interact with the hypervisor, then into other VMs. Hard, but real. Mitigation: host VMs with similar classification together on the same physical server/segment.
  - **Privilege elevation** — especially catastrophic on the hypervisor itself (VMware hypervisor flaw → any guest OS). Keep current on hotfixes/service packs.
  - **Live VM migration** — VM moves host-to-host; attacker positioned between the two hosts conducts an **adversary-in-the-middle** attack and captures unencrypted data in transit.
  - **Resource reuse** — memory/storage not cleared before reassignment; previous tenant's sensitive data leaks to the next (big in multi-tenant cloud).
  - **VM sprawl** — VMs deployed without oversight, unpatched and untracked.
  - Container-specific: all containers share **one OS** — exploit the OS kernel and every container is at risk.
- **Securing VMs**: patch OS/apps/hypervisor, AV + host firewall per VM, strong passwords, minimize VM-to-VM/shared-resource connections, remove unneeded features (attack surface), distribute VMs across physical servers (DoS resilience), track and patch everything, **encrypt the VM files** themselves.

## 4. Serverless

- Not "no servers" — provider manages servers, databases, some app logic; developers write individual **functions** triggered by events, run only when needed = **Function as a Service (FaaS)**. Examples: AWS Lambda, Google Cloud Functions.
- Benefits: pay only for compute time consumed (no charge when idle), automatic/precise scaling, developers focus on code, faster time to market.
- Risks: **vendor lock-in** (proprietary provider interfaces make switching hard), **immaturity of best practices** (new field, practices still evolving), critical dependency on the provider.

## 5. Microservices

- Application broken into small, autonomous, independently deployable services, each doing one business function, communicating over lightweight mechanisms. Contrast: **monolithic** = all components interconnected and interdependent.
- Netflix example: moved from monolith (whole system went down under load) to microservices (recommendations, signups, encoding, each separate).
- Benefits: **scalability** (scale each service independently), **flexibility** (different languages/stacks/teams per service), **resilience** (one service failing ≠ whole system down), faster independent deployments/updates.
- Challenges: complexity (inter-service communication, distributed testing), data management (each service may have its own DB → consistency problems), network latency, security (bigger attack surface — many services talking over a network).

## 6. Network Infrastructure — Separation

- **Physical separation (air gap)**: system isolated from all other networks — remove ALL direct and indirect connections including Wi-Fi and Bluetooth. Used for classified military/gov networks and ICS in critical infrastructure. Most secure method *if* strict physical security is in place — but **not infallible: Stuxnet** compromised air-gapped systems.
- **Logical separation**: boundaries via firewalls, **VLANs**, rules/policies. Example: VLAN segregating HR traffic from marketing on the same physical network; firewall screen/DMZ subnet for external-facing services. More flexible and easier to implement than physical — **but not as secure**; misconfigured devices can be exploited.

## 7. Software-Defined Networking (SDN)

Architecture that decouples control and forwarding, giving a centralized programmatic view. Three planes:

| Plane | Role |
|---|---|
| **Data (forwarding) plane** | Moves packets place to place; forwarding decisions per IP/Ethernet; switches/routers do the sending/receiving |
| **Control plane** | **The brain** — decides where traffic is sent. In SDN it is **centralized**: one controller dictates traffic flow for the whole network (in traditional networks each router has its own) |
| **Application plane** | Network applications live here; they instruct the controller, which manipulates the network |

Real-world: Google B4 (data-center WAN traffic/bandwidth efficiency), AT&T Domain 2.0.

## 8. Infrastructure as Code (IaC)

- Managing/provisioning infrastructure through machine-readable definition files (code) instead of manual configuration. Languages: YAML, JSON, HCL (HashiCorp Configuration Language). Key DevOps practice, pairs with cloud.
- **Idempotence** — running the operation any number of times produces the **same result**; identical environment every run regardless of initial state.
- Goal: eliminate **snowflake systems** (one-off inconsistent builds that introduce risk).
- Benefits: speed/efficiency, consistency & standardization, scalability, cost savings, auditability & compliance (code is versioned and auditable).
- Challenges: learning curve, growing complexity (mitigate: modularization, documentation), security risks (secrets exposed in code files, insecure configs introduced).

## 9. Centralized vs Decentralized

| | Centralized | Decentralized |
|---|---|---|
| Structure | One location/authority (central server, mainframe, data center) | Functions distributed across nodes, no single point of control |
| Benefits | Control, consistency (one data store), cost-effective to maintain | Resiliency (node failure ≠ system down), scalability (add nodes), flexibility (remote work, distributed teams) |
| Risks | **Single point of failure**, scalability limits, juicy target (one compromise = everything) | More security risk (every remote connection an entry point), management complexity, data inconsistency/synchronization issues |

## 10. IoT

- Network of physical devices with sensors, software and connectivity exchanging data near real time.
- Components: **hub/control system** (central point connecting devices, collects/processes data, sends commands — Amazon Echo, Google Home, or an app), **smart devices** (appliances to industrial robots), **wearables** (watches, fitness trackers, smart glasses), **sensors** (eyes and ears — measure temperature, motion, pressure etc.).
- Top risks: **weak default usernames/passwords** left unchanged, **poorly configured network services** (open ports, unencrypted communication, unnecessary services). Best practice: **put IoT devices on a separate network/segment**.

## 11. Embedded Systems

- Dedicated computer built for one or two specific functions inside a larger device: smartphones, cameras, microwaves, vehicles (engine control, ABS, airbags), medical (pacemakers, insulin pumps), industrial automation/robotics.
- **RTOS (real-time operating system)**: executes processes in a timely, predictable manner, no buffer delays — flight navigation, medical equipment.
- Risks: hardware failure (harsh environments), software bugs (safety risks), security vulnerabilities, outdated systems (long operational lives).
- Securing them: **network segmentation** (breach of one segment ≠ whole network), **wrappers** (e.g. IPsec tunneling — interceptor sees only the wrapper header showing entry/exit points), **firmware code control** (secure coding, code reviews, automated testing, secure boot, cryptographic signatures), and coping with the **inability to patch** (downtime unacceptable / physically unreachable / never designed for updates) via **over-the-air updates** (delivered remotely — needs careful security planning).

## Quick-fire exam traps

- Type 1 hypervisor = bare metal = faster. Type 2 = hosted inside an OS.
- VM escape target = the **hypervisor**; container risk = shared **kernel**.
- Data remnants = data left after deletion → overwrite.
- Live migration attack = adversary-in-the-middle between the two physical hosts.
- IaC repeatability = **idempotence**; one-off systems = **snowflakes**.
- SDN control plane = centralized brain; data plane = moves packets.
- Air gap strongest but Stuxnet proved it breakable.
- Serverless = FaaS, pay-per-execution, vendor lock-in risk.
- Microservice dies alone; monolith falls as one.
- IoT defaults + open services → segment them off.
