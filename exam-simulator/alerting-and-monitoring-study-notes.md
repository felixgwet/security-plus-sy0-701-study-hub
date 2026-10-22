# Alerting and Monitoring — SY0-701 Study Notes (Section 23, OBJ 4.4)

## Alert Types & Goals
- **True positive**: alert correctly identifies a real threat.
- **False positive**: alert fires but no threat exists (wastes analyst time).
- **True negative**: no alert, no threat — correct.
- **False negative**: real threat, NO alert — system missed it (worst outcome).
- Goal: **maximize true positives, minimize false positives** → avoids **alert fatigue**.

## Monitoring Types
- **Automated monitoring**: software scans/analyzes logs, traffic, system data.
- **Manual monitoring**: humans review system data.
- **System monitoring**: CPU utilization, memory, disk usage, network performance.
- **Application (performance) monitoring**: response times, error rates, bottlenecks — tools: New Relic, AppDynamics.
- **Infrastructure monitoring**: servers, VMs, containers, cloud, network devices — tools: SolarWinds, PRTG.
- **Baseline** = set of established metrics representing NORMAL behavior. Deviations from baseline = investigate. Baseline is your reference point.

## Alerting & Monitoring Activities
1. **Log aggregation** — collect/consolidate logs centrally; used for troubleshooting, performance trends, security analysis (failed logins, privilege changes), compliance (GDPR, HIPAA).
2. **Alerting** — notifications on thresholds/anomalies via email, SMS, push. Some laws require immediate notification of events (e.g. breaches).
3. **Scanning**:
   - **Vulnerability scan** — compares systems against the **CVE** database (MITRE, cve.mitre.org). Tools: Nessus, OpenVAS, Qualys.
   - **Configuration scan** — checks configs against best practices/compliance standards. Tool example: **CIS-CAT** vs CIS Controls, PCI DSS.
   - **Code scan** — static analysis tools: Fortify, SonarQube (find SQLi, XSS, bad variables); dynamic analysis (pentesting) complements.
4. **Reporting** — Splunk, Sumo Logic generate compliance/performance reports.
5. **Archiving** — long-term storage (Amazon S3, Google Cloud Storage). **HIPAA requires 6 years** of data retention.
6. **Alert response** → **remediation** (fix the issue: patch, reconfigure, modify code) vs **validation** (prove the fix worked — e.g. rescan the DC).
   - **Quarantining** — isolate suspected-malicious system/file to stop spread.
   - **Alert tuning** — adjust thresholds/conditions/delivery to reduce false positives and noise.

## SNMP (Simple Network Management Protocol)
- Architecture: **SNMP manager** (central, collects/processes) + **agents** (on managed devices: routers, switches, printers, servers).
- Message types:
  - **Set** — manager → agent, changes a variable's value.
  - **Get** — manager → agent, retrieves variable value(s).
  - **Trap** — agent → manager, **asynchronous/unsolicited** notification of significant events (near real-time alarms).
- **Granular traps**: each trap carries a unique **OID** (object identifier); OIDs catalogued in the **MIB** (management information base, hierarchical namespace/translation file) → saves bandwidth.
- **Verbose traps**: full payload with all event info → more bandwidth, more server resources.
- Trap data stored as **variable bindings** (key-value pairs, e.g. SiteName: PR-Branch, Severity: Low).
- Versions:
  - **v1/v2**: security = **community strings** (default `public` = read-only, `private` = read-write), sent in **plaintext — insecure**.
  - **v3** adds: **integrity** (hashing), **authentication** (validating message source), **confidentiality** (encryption; originally DES 56-bit, newer firmware supports 3DES/AES). Also groups entities with different read/write privileges.

## SIEM (Security Information and Event Management)
- Real-time/near-real-time analysis of security alerts from network hardware and applications; **aggregates + correlates** logs centrally.
- Classic correlation example: VPN login from Asia + badge swipe into NYC server room minutes later = **impossible travel** → investigate.
- **Agent-based**: software agent on each host → real-time, more detail, but install/maintenance overhead.
- **Agentless**: SIEM pulls via **SNMP or WMI** → no agents, cheaper maintenance, less detail, not near-real-time.
- 7 deployment considerations: log relevant events (filter noise), document scope, develop **use cases** (define what a threat is), plan **incident response actions** per threat, establish **ticketing** process, schedule regular **threat hunting**, provide **evidence trail** for auditors.
- Products: **Splunk** (market leader; proprietary **SPL** search language), **ELK/Elastic Stack** = **Elasticsearch** (query/analytics) + **Logstash** (collection/normalization) + **Kibana** (visualization) + **Beats** (endpoint agents), **ArcSight** (compliance reporting HIPAA/SOX/PCI DSS), **QRadar** (IBM).

## Data from Security Tools (all feed the SIEM)
- **Antivirus**: malware detection logs — repeated infections on one host may signal broader attack.
- **DLP**: flags data leaks/policy violations (e.g. emailing client list outside org).
- **NIDS**: passively detects, generates alerts. **NIPS**: proactively blocks threats.
- **Firewalls**: allowed/blocked traffic, rule changes; a sweep of ports 0–1023 = **port scan reconnaissance**.
- **Vulnerability scanners**: identified vulns, severity, remediation steps → prioritize patching, track remediation progress.

## SCAP (Security Content Automation Protocol)
- **NIST**-developed suite of open standards for automating vulnerability management, measurement, and policy compliance. All SCAP-compliant tools "speak the same language" → easy data transfer.
- **Three languages**:
  - **OVAL** (Open Vulnerability and Assessment Language) — XML schema describing system security state and querying vulnerability reports.
  - **XCCDF** (Extensible Configuration Checklist Description Format) — machine-readable security checklists/benchmarks (replaces 30–50 page manual guides).
  - **ARF** (Asset Reporting Format) — expresses asset info and asset-to-report relationships; vendor/technology-neutral.
- **Three enumerations**:
  - **CCE** (Common Configuration Enumeration) — unique identifiers for configuration issues/best-practice statements.
  - **CPE** (Common Platform Enumeration) — identifies hardware/OS/apps; format `cpe:/part:vendor:product:version:update:edition:language`; part = **O** (OS), **A** (application), **H** (hardware).
  - **CVE** (Common Vulnerabilities and Exposures) — `CVE-year-number`. **CVE-2017-0144 = SMBv1 flaw exploited by EternalBlue/WannaCry**; mitigations = patch or disable SMBv1.
- **CVSS 3.0 scoring**: 0 = None · 0.1–3.9 = Low · 4.0–6.9 = Medium · 7.0–8.9 = High · 9.0–10.0 = Critical. **Does NOT account for existing mitigations** (EternalBlue scores 8.1 High, but if SMBv1 already disabled it's low priority for you).
- **Benchmarks** = configuration rule sets for specific products (Red Hat Enterprise Linux Benchmark, CIS Windows 10 Enterprise Benchmark), expressed in **XCCDF**.

## NetFlow & Flow Analysis
- **Full packet capture (FPC)**: entire packet header + payload — complete evidence but enormous storage.
- **Flow analysis**: **flow collector** records metadata/statistics about traffic (who, when, how much, what protocol) — NOT content. Analogy: phone bill shows calls but not conversations.
- **NetFlow** = Cisco-developed; became the standard **IPFIX** (IP Flow Information Export). Flow = packets sharing identifiers (src/dst IP, ports, protocol).
- **Zeek** = hybrid: samples like NetFlow but logs **full PCAPs** when filters/signatures flag interesting traffic; outputs tab-delimited/JSON for import into tools like Splunk.
- **MRTG** (Multi Router Traffic Grapher): graphs traffic through router/switch interfaces using **SNMP**. A 2–4 a.m. spike might be offsite backups — or database exfiltration; investigate.

## Single Pane of Glass (SPOG)
- One unified display consolidating data from many sources; security team sees logs, alerts, reports in one place.
- Benefits: simplifies SOC management, efficiency via automation of repetitive tasks, better collaboration/communication, easier compliance documentation.
- Usually software-based (more flexible integration than hardware).
- **5 implementation steps**: 1) define requirements · 2) identify & integrate data sources (APIs, webhooks, plugins, connectors) · 3) customize the interface · 4) develop SOPs/documentation · 5) continuously monitor & maintain (and secure it — it holds all your critical data).

## High-yield exam triggers
- "Unsolicited message from agent to manager" → **SNMP trap**.
- "public/private plaintext" → **SNMP v1/v2 community strings** — use **v3**.
- "Impossible travel / two logs correlated" → **SIEM correlation**.
- "Machine-readable security checklist" → **XCCDF**.
- "cpe:/a:microsoft:..." → **CPE**, part `a` = application.
- "9.0+ score" → **CVSS Critical**.
- "Logs full packets only for interesting traffic" → **Zeek**.
- "Graphs router interfaces via SNMP" → **MRTG**.
- "Isolate infected workstation" → **quarantining**.
- "Adjusting alert thresholds to cut noise" → **alert tuning**.
