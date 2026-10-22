# Security Infrastructure — Study Notes (Section 16 · OBJ 3.2 & 4.5)

This section is a SY0-701 goldmine: ports/protocols, firewall types, IDS/IPS, VPN/IPSec, 802.1x/EAP, and fail-open/fail-closed are all perennial exam topics. Memorize the port table cold.

## 1. Ports & Protocols (OBJ 4.5)

Port ranges: **well-known 0–1023** (IANA-assigned common services), **registered 1024–49,151** (vendors register with IANA, e.g. MS SQL 1433, RDP 3389), **dynamic/private 49,152–65,535** (clients pick random high ports for outbound connections — also gaming/IM).

| Port | Protocol | Transport | Purpose |
|---|---|---|---|
| 21 | FTP | TCP | File transfer (control) |
| 22 | SSH / SCP / SFTP | TCP | Secure remote terminal + secure file copy |
| 23 | Telnet | TCP | Remote access — **unencrypted/insecure**; replace with SSH |
| 25 | SMTP | TCP | Send email |
| 53 | DNS | **TCP + UDP** | Domain name → IP |
| 69 | TFTP | **UDP** | Trivial file transfer |
| 80 | HTTP | TCP | Web, unencrypted |
| 88 | Kerberos | UDP | Network authentication |
| 110 | POP3 | TCP | Retrieve email |
| 119 | NNTP | TCP | Newsgroups |
| 135 | RPC | TCP+UDP | Inter-process communication (Windows file sharing) |
| 137–139 | NetBIOS | UDP+TCP | Windows name services, file/printer sharing |
| 143 | IMAP | TCP | Access email on server |
| 161 | SNMP | UDP | Manage network devices |
| 162 | SNMP Traps | UDP | Device → manager alerts |
| 389 | LDAP | TCP | Directory services |
| 443 | HTTPS | TCP | Secure web |
| 445 | SMB | TCP | File/printer sharing |
| 465/587 | SMTPS | TCP (SSL/TLS) | Secure email sending |
| 514 | Syslog | **UDP** | Log messages |
| 636 | LDAPS | TCP | LDAP over SSL/TLS |
| 993 | IMAPS | TCP | Secure IMAP |
| 995 | POP3S | TCP | Secure POP3 |
| 1433 | MS SQL | TCP | Microsoft SQL Server |
| 1645/1646 | RADIUS | TCP | Remote auth (TCP variant) |
| 1812/1813 | RADIUS | **UDP** | Remote auth (standard UDP variant) |
| 3389 | RDP | TCP | Remote desktop |
| 6514 | Syslog-TLS | TCP | Encrypted syslog |

Exam framing: you won't be asked "which port is SSH?" — you'll get a scenario ("secure web connection blocked by firewall") where you must know it's 443.

## 2. Firewalls (OBJ 3.2)

- **Screened subnet** (= DMZ, dual-homed host config): buffer between untrusted external and trusted internal networks; hosts public services (web, email, DNS). **For the exam use "screened subnet"** even though devices still say DMZ.
- Types (more inspection = more security but less throughput):
  - **Packet-filtering** — inspects header only (IP + port); fastest; **Layer 4 firewall**; cannot stop IP spoofing, fragmentation attacks, TCP handshake attacks.
  - **Stateful** — tracks state of connections; remembers your outbound request and allows the return traffic.
  - **Proxy** — makes connections on behalf of endpoints. **Circuit-level (SOCKS, Layer 5/session)** vs **application-level (Layer 7 firewall)**: deep inspection per application type (HTTP filtered differently than FTP); slow, so place close to the server it protects.
  - **Kernel proxy** — "fifth-generation firewall": full inspection at every layer with minimal performance impact; place close to protected system.
- Evolutions:
  - **NGFW (next-generation)** — application-aware; single deep inspection; signature-based IPS when inline; fast; full-stack visibility; complex; **vendor-lock-in risk** (integrates with one vendor's product line); single efficient engine.
  - **UTM** — many security functions in one appliance (firewall + IPS + AV/antispam + VPN concentrator + content filtering + load balancing + DLP). Benefits: lower cost/power, easier management. **Biggest drawback: single point of failure** (lose the device = lose the whole security stack); separate engine per function = less efficient than NGFW. Place inline between LAN and Internet. Choose NGFW if speed/efficiency is the priority.
  - **WAF (web application firewall)** — inspects HTTP/HTTPS with rule sets against **XSS and SQL injection**. **Inline** = can block live attacks but slows traffic; **out-of-band** (SPAN/mirror port copy) = non-intrusive but can only alert (like an IDS), cannot block.
- ACL rules: **top-down order** (first match wins; specific rules on top, generic at bottom); end with **explicit deny all** (implied deny isn't universal — best practice is to write it); **log all actions including denies**. Rule = traffic type + source + destination + action.

## 3. IDS / IPS (OBJ 3.2)

- **IDS = detect, log, alert** (never stops the attack). **IPS = detect AND act** (block traffic, stop application, kick device off).
- Types by placement: **NIDS** (network appliance on a **SPAN/mirror port** off the backbone switch; watches for port scans, suspicious payloads, bad IPs/ports), **HIDS** (software on a host; watches that host's traffic, processes, files), **WIDS** (wireless: deauth attacks, disassociation, auth flooding, wireless DoS).
- Detection methods:
  - **Signature-based** — matches known-attack signatures in a database; needs frequent updates; **weak against zero-days**. Subtypes: **pattern-matching** (sequence of attack steps; common in NIDS/WIDS) vs **stateful-matching** (known system baseline, report changes; common in HIDS).
  - **Anomaly-based** (behavioral) — compares to a normal-traffic baseline; catches unknown attacks; **higher false-positive rate**. Five types: statistical, protocol, traffic, rule/heuristic, application-based.
- Placement: **NIPS inline right behind the firewall** (so it can block everything funneled through); **NIDS passive on mirrored port**.

## 4. Network Appliances

- **Load balancer** — distributes traffic across servers; health checks; redirects when a server fails; prevents bottlenecks. **ADC (application delivery controller)** = advanced LB adding SSL termination, HTTP compression, content caching.
- **Proxy server** — intermediary client↔server: **content caching** (speed + bandwidth), request filtering, login management; masks internal endpoints (DDoS protection layer); can route traffic to satisfy data-sovereignty laws.
- **Sensor** — monitors/analyzes traffic for anomalies, performance issues, security events; feeds IDS/IPS; first-line detection (e.g. traffic spike from unknown IP = possible DDoS).
- **Jump server / jump box** — hardened gateway admins use to reach devices in other security zones; single controlled, logged entry point; reduces attack surface; speeds incident forensics.

## 5. Port Security, 802.1x & EAP (OBJ 3.2)

- Switches operate at Layer 2, forward by MAC (CAM table = content addressable memory). Hubs rebroadcast everything; switches send only to the intended port.
- **MAC flooding** — attacker floods randomized MACs, overflows the CAM table, switch **fails open and acts like a hub** (rebroadcasts everything). Defense: port security / MAC filtering.
- **Port security** — bind a MAC address to a switch interface; unknown devices rejected. **Sticky MAC** (persistent MAC learning) — dynamically learns the first MAC on a port and treats it as authorized.
- Bypass: **MAC spoofing** (attacker sets their NIC's MAC to an approved one) → need deeper defense: **802.1x + EAP**.
- **802.1x** — port-based authentication framework (wired and wireless, Layer 2). Three roles: **supplicant** (device requesting access), **authenticator** (switch/WAP/VPN concentrator), **authentication server** (RADIUS or TACACS+).
- **EAP** — not one protocol but a framework of authentication methods: **EAP-MD5** (passwords, one-way only), **EAP-TLS** (certs on client AND server, mutual, immune to password attacks), **EAP-TTLS** (server cert + client password), **EAP-FAST** (protected access credential), **PEAP** (server cert + AD-backed password), **LEAP** (Cisco proprietary).
- **RADIUS vs TACACS+**: RADIUS = cross-platform, UDP (1812/1813 or TCP 1645/1646); TACACS+ = Cisco-only, TCP (slower but more secure), separates authn/authz/accounting. All-Cisco → TACACS+; mixed network → RADIUS.

## 6. Securing Network Communications (OBJ 3.2)

- **VPN types**: site-to-site (network-to-network over Internet, cheap leased-line alternative; all branch traffic funnels through HQ), client-to-site (single device to HQ), **clientless** (browser + HTTPS/TLS, no client software).
- **Full tunnel** — ALL traffic routed/encrypted via HQ: more secure, but can't reach local resources and slower. **Split tunnel** — only HQ-bound traffic goes via VPN, rest direct to Internet: better performance, less secure (attacker on the open path can pivot through the laptop into the VPN). On untrusted networks (hotel/café Wi-Fi) → always full tunnel.
- **TLS** — encrypts at Layers 5–7, over TCP. **DTLS** = UDP version of TLS: same security, faster (less overhead) — great for video streaming.
- **IPSec** — most popular VPN protocol suite: **confidentiality (encryption), integrity (hash digest check), authentication, anti-replay (sequence numbers)**.
- Five IPSec steps: (1) key-exchange request, (2) **IKE Phase 1** — authenticate parties, establish secure negotiation channel (ISAKMP tunnel), (3) **IKE Phase 2** — negotiate security associations, establish the tunnel (tunnel-in-tunnel), (4) data transfer, (5) tunnel termination (mutual deletion or timeout).
- **Transport mode** — uses original IP header; **for client-to-site**; no added size (MTU-friendly). **Tunneling mode** — encapsulates entire packet with a NEW header; **for site-to-site**; adds size — watch the 1,500-byte MTU (use jumbo frames up to 9,000 on your own LAN or lower inner MTU to ~1,400).
- **AH (Authentication Header)** — integrity + origin authentication + anti-replay, **NO confidentiality**. **ESP (Encapsulating Security Payload)** — authentication, integrity, anti-replay **AND confidentiality** (encrypts payload, not headers in transport mode; tunnel mode encrypts everything incl. original header behind the new outer header).

## 7. SD-WAN & SASE

- **SD-WAN** — virtualized WAN: control extracted from hardware, layered over any transport (MPLS, broadband, cellular, microwave); centralized control intelligently routes per-application traffic across links; fixes the traditional star-topology bottleneck where all branch traffic hairpins through HQ.
- **SASE (Secure Access Service Edge)** — cloud-native framework combining network + security in one service: firewall, secure web gateway, VPN, **ZTNA**, **CASB**, plus SD-WAN; identity/policy-based access regardless of user location. Cloud flavors: AWS VPC, Azure Virtual WAN/ExpressRoute, Google Cloud Interconnect/Cloud VPN.

## 8. Infrastructure Considerations (OBJ 3.2)

- **Device placement** — routers at the edge filter traffic; APs positioned for coverage and to keep RF inside the building; switches as central connection points.
- **Security zones** — segments of like-trust devices with their own policies. **Screened subnet** (modern term for DMZ) hosts public-facing services; breach there ≠ access to the core internal network.
- **Attack surface** — every point where data can enter/leave or be extracted; grows with every device/app/open port; minimize by eliminating or controlling vulnerabilities.
- **Connectivity** — wired = stable/fast but immobile; wireless = flexible but interference + security risk; fiber = high speed/long distance; hybrid combos for redundancy.
- **Device attributes**: **active** (IPS — influences traffic) vs **passive** (IDS — observes only); **inline** (in the traffic path; can block; disruption risk) vs **tap/monitor** (out of path, copies traffic, zero disruption but can't block).
- **Failure modes**: **fail-open** = keep passing traffic uninspected on failure (continuity, no security — good for guest Wi-Fi); **fail-closed** = block all traffic on failure (security, outage — right for sensitive financial data). Choose per security policy and data criticality.

## 9. Selecting Infrastructure Controls (OBJ 4.5)

- Principles: **least privilege**, **defense in depth** (layers), **risk-based prioritization** (limited budget — rank by risk), **lifecycle management** (controls age — review/update/retire), **open design** (transparency, rigorous scrutiny of controls).
- Methodology: assess current state → **gap analysis** → clear objectives → **benchmarking** vs industry → **cost-benefit analysis** → stakeholder involvement → monitoring & feedback loops.
- Best practices: risk assessment is **recurring** (not one-time; rerun on significant change), align to frameworks (**NIST CSF, NIST RMF, ISO**), customize the framework to your org, stakeholder engagement + training.

## Quick-fire traps

- IDS alerts; IPS acts. NIDS on mirror port; NIPS inline behind firewall.
- Packet filter = Layer 4, header-only. App proxy = Layer 7, deep inspection.
- UTM = one box, one point of failure. NGFW = single engine, faster.
- Out-of-band WAF can only alert, not block.
- Telnet 23 → replace with SSH 22. Syslog 514 UDP; secure syslog 6514 TCP.
- RADIUS UDP 1812/1813 (or TCP 1645/1646); TACACS+ TCP, Cisco-only.
- EAP-TLS = certs both sides = mutual. EAP-MD5 = one-way passwords. LEAP = Cisco proprietary.
- MAC flood → CAM overflow → switch fails open into hub mode.
- AH ≠ encryption. ESP = encryption. Transport = host-to-site; tunnel = site-to-site.
- Full tunnel = security; split tunnel = performance. Untrusted network → full.
- Screened subnet is the exam term; DMZ is the legacy term.
