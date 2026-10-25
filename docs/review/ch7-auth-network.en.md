# Chapter 7 · Authentication & Network Security · Review Notes

> **Matching slides**: `w7/authentication.pdf`, `w7/network-security.pdf`
>
> **Suggested time**: first pass 90 minutes + worked examples 30 minutes + self-test 30 minutes
>
> **Companion**: Outline §2.11, §2.12
>
> **Weight of this chapter**: authentication factors, password entropy/salting, and biometric error rates are short-answer/computation questions; the network part is almost entirely the mapping "layering + protocol + attack", which suits comprehensive questions.

---

## 0. Chapter thread (memorize these three sentences first)

1. **Access control = authentication (who you are) + authorization (what you can do)**; authentication relies on "something you know / something you have / something you are".
2. **The weakness of passwords is user choice** (not length itself); **hashing + salt** turns an offline dictionary attack from "one-time precomputation" into "recomputation for every user". Biometrics are hard to forge, but **cannot be revoked**.
3. **A network is a layered, packet-switched protocol stack**; each layer has its own address and protocols, and its own attack surface: application-layer spoofing, transport-layer DoS, network-layer IP (Internet Protocol)/NAT, link-layer ARP spoofing.

**Common question types in this chapter**

| Question type | Typical phrasing | What to prepare |
|---|---|---|
| Concept discrimination | Authentication vs authorization; the three factors | Give 3 examples for each factor |
| Computation | Password entropy, attack volume after salt, EER | Be able to compute log2; be able to compare |
| Protocols | TCP three-way handshake, DNS resolution, NAT | Draw the sequence/table |
| Attacks | SYN flood, DNS poisoning, ARP poisoning | Memorize by "layer + root cause + defense" |
| Design | How to design a secure login / prevent replay | Combine password + salt + 2FA + rate limiting |

---

## 1. Authentication

### 1.1 The two parts of access control ★

| Concept | Question | Example |
|---|---|---|
| **Authentication** | Are you who you say you are? | Login, fingerprint unlock, certificate verification |
| **Authorization** | Are you allowed to do that? | A normal user cannot drop the database; RBAC/ACL |

- Authentication can be human-to-machine, and also machine-to-machine (e.g., TLS certificates).
- Authenticate first, authorize second; if authentication fails, you should not reach the authorization check.

### 1.2 The three authentication factors ★★

| Factor | Meaning | Example | Advantage | Disadvantage |
|---|---|---|---|---|
| **Something you know** | Something you know | Password, PIN, date of birth, mother's maiden name, pet's name | Free, easy to reset | Weak, guessable, can leak, can be shared |
| **Something you have** | Something you have | Smartcard, ATM card, token, cell phone, MAC address | Requires physical possession, hard to copy remotely | Can be lost, needs issuance/management |
| **Something you are** | Something you are | Fingerprint, face, voiceprint, signature, gait | Hard to forge, nothing to remember | Cannot be revoked, has an error rate, collection needs cooperation |

**2FA (2-factor authentication)**: any two of the three categories.
- Example: credit card + signature; ATM card + PIN; password + SMS code.

### 1.3 Passwords ★★

#### Why passwords are popular

- **Cost**: passwords are free;
- **Convenience**: it is easier to reset a password than to issue a new thumb;
- But the slides quote: "Passwords are one of the biggest practical problems facing security engineers today."

#### Keys vs passwords (key computation)

| | Key | Password |
|---|---|---|
| How it is generated | Random | Chosen by a person |
| 64-bit key | 2⁶⁴ keys, the attacker tries about 2⁶³ | — |
| 8 characters, 256 options per character | Theoretically 256⁸ = 2⁶⁴ | But users do not choose at random → in practice far less than 2⁶³ |
| Attack method | Brute force | **Dictionary attack** |

- **Dictionary attack**: tries only the most likely candidates (dictionary words, mutations, common combinations).
- Example: 8 lowercase letters → 26⁸ ≈ 2³⁷·⁶; 8 printable characters (95 options) → 95⁸ ≈ 2⁵²·⁶.

#### Good and bad passwords, and passphrases

**Bad passwords**: `frank`, `Fido`, `Password`, `incorrect`, `Pikachu`, `88195277`, `AustinStamp`.
**Good passwords**: `jfIej,43j-EmmL+y`, `09864376537263`, `0nceuP0nAt1m8`, `P0kem0n`.

**Passphrase**:

- 10–30 letters long, which makes brute force attacks difficult;
- if well chosen, it will not be found in any phrase or quote dictionary;
- structured to be more memorable than a random string.

**Slide experiment (three groups of users)**

| Group | Requirement | Share cracked | Memorability |
|---|---|---|---|
| A | At least 6 chars, 1 non-letter | About **30%** | Average |
| B | Based on a passphrase | About **10%** | Easy |
| C | 8 random characters | About **10%** | Hard |

> Conclusion: **a passphrase is the better trade-off between security and memorability**; complexity requirements of the "add one special character" kind have limited effect.

#### Password attack surface

- Target one particular account / any account on the system / any account on any system;
- **DoS**: repeated wrong entries lock the account (think of the ATM swallowing your card);
- **Offline**: dictionary/brute-force attack after obtaining the password hash file;
- **Online**: guessing, credential stuffing, phishing, social engineering, keystroke logging;
- Error logs may contain "almost" passwords; default passwords are not changed.

#### Password storage: hashing + salt ★★

**The problem with hashing only (no salt)**

1. The attacker precomputes `h(x)` (for every password in the dictionary) → one-time precomputation, after which comparing hashes breaks passwords in seconds;
2. The same password → the same hash → accounts can be identified in bulk.

**Salting (salt)**

```
Choose a random s; store (s, y = h(password, s))
```

- **s is not secret**; it can be stored together with y;
- Verification: recompute `h(input, s)` with the stored s and compare it with y;
- The attacker must **recompute for every user and every salt**, so the precomputed table is useless;
- Cost: the offline attack goes from `|D|` to `|D| × number of users` (plus the per-call cost of a slow hash).

> Modern practice also uses a **slow hash** (bcrypt/scrypt/Argon2) to increase the cost of a single computation; the slides do not elaborate, but you may mention it in an answer.

#### Other password issues

- Too many passwords → **reuse** → one leak compromises everything;
- Default passwords are not changed;
- Social engineering;
- Login password vs ATM PIN are mixed up;
- Keystroke logging/spyware;
- Cracking tools: L0phtCrack/LC4 (Windows), John the Ripper (Unix); administrators should proactively audit weak passwords.

### 1.4 Biometrics ★

#### Ideal properties

| Property | Meaning | Reality |
|---|---|---|
| **Universal** | Applies to (almost) everyone | No biometric applies to everyone |
| **Distinguishing** | Distinguishes with certainty | Cannot hope for 100% certainty |
| **Permanent** | Never changes over a lifetime | It is OK if it remains valid for a long time |
| **Collectable** | Easy to collect the required data | Depends on whether subjects are cooperative |
| Safe, user-friendly | — | Must be traded off |

#### Enrollment vs Recognition

| Phase | Requirement | Risk |
|---|---|---|
| **Enrollment** | Biometric info is put into the database; may be slow and require repeated measurement; must be **very precise** | The enrollment step may be a weak point (root trust) |
| **Recognition** | Must be **quick and simple**, yet reasonably accurate | False rejection/false acceptance |

#### Error rates: fraud vs insult ★★

- **Fraud**: the attacker is mis-authenticated as Alice (**the impostor is accepted**).
- **Insult**: Alice is not authenticated as Alice (**the genuine user is rejected**).
- The two trade off against each other:
  - High threshold (99% match) → low fraud, high insult;
  - Low threshold (30% match) → high fraud, low insult.
- **EER (Equal Error Rate)**: the threshold point where fraud = insult; used to compare different biometrics, the smaller the better.

> ⚠ The slides label fraud as "false negative" and insult as "false positive", which is the opposite of the usual terminology; **memorize by the definition**: impostor accepted = fraud, genuine user rejected = insult.

#### Biometrics are not foolproof

- An attacker can steal a thumb, photocopy a fingerprint/iris, 3D-print a mask;
- An attacker can subvert the software/database/trusted base (TCB);
- There is **no way to revoke** a "leaked" fingerprint — this is the biggest difference from passwords (a password can be changed, a fingerprint cannot).

### 1.5 2FA and the "have" factor

- 2FA: any combination of two categories of factors.
- Examples of "have": car key, laptop (MAC address), password generator, ATM card, smartcard.
- Note: an SMS code counts as "have the phone", but there is a SIM swap/interception risk (the slides do not elaborate).

---

## 2. Network basics and security

### 2.1 Basic concepts ★

- A network = hosts (computer/laptop/server/phone) + an interconnected **mesh of routers**; the purpose is to transmit data.
- **Packet switched vs circuit switched**:
  - The telephone network is **circuit switched**: for each call a dedicated circuit is established, which wastes bandwidth;
  - Data networks are **packet switched**: data is chopped up into packets that are transmitted independently, with no dedicated circuit; more efficient bandwidth usage, but more complex.
- **Protocols**: precisely specify the "communication rules"; the details are given in **RFCs** (essentially Internet standards).
- **Stateless vs stateful**: stateless protocols do not "remember", stateful ones do; many security problems are related to state (e.g., DoS is a problem with stateful protocols).

### 2.2 The five-layer protocol stack ★★

| Layer | Example protocols | Role | Address |
|---|---|---|---|
| **Application** | HTTP, FTP, SMTP, DNS | Application semantics | Domain name/URL |
| **Transport** | TCP, UDP | End-to-end delivery | Port (16 bit) |
| **Network** | IP, RIP/OSPF/BGP | Routing/addressing | IP (32 bit) |
| **Link** | Ethernet, PPP, 802.11 | Transfer between adjacent nodes | MAC (48 bit) |
| **Physical** | — | Bit stream | — |

**Layering in action**

- At the source, data goes "down" the protocol stack, and each layer adds a header;
- A router processes a packet only "up" to the **network layer** (that is where the routing info lives), then passes it down the stack again;
- The destination processes it "up" to the application layer.

**Encapsulation**

```
Application layer: (H, X)
Transport layer: (H, (H, X))
Network layer: (H, (H, (H, X)))
Link layer: (H, (H, (H, (H, X))))
```

- The application data is on the "inside"; each layer's header is understood only by the peer layer.

### 2.3 Application layer ★

**HTTP**

- Request/response; **HTTP is stateless**.
- The client "speaks first" and the server responds (client-server); in P2P, hosts act as both client and server.

**Cookie**

- Initially, the cookie is sent from the server to the browser; the browser stores it and sends it back on later requests;
- The server uses a cookie database to "remember" you (shopping carts, recommendations, sessions);
- A **very (very) weak form of authentication**;
- Privacy concerns: one web site can learn a lot about you, and multiple web sites could learn even more (tracking).

**SMTP**

- SMTP is used to deliver email from the sender to the recipient's mail server; then POP3/IMAP/HTTP is used to get the messages.
- The commands are **human readable**:

```bash
telnet server 25
HELO ca.gov
MAIL FROM: <arnold@ca.gov>
RCPT TO: <stamp@cs.sjsu.edu>
DATA
...
.
QUIT
```

- ⚔ **Spoofed sender**: `MAIL FROM` can be written at will → email spoofing.
- Defense: SPF/DKIM/DMARC, authentication (not covered in the slides; supplementary).

**DNS**

- Domain name → IP (`cse.ust.hk` → `143.89.41.177`); a distributed database.
- Resolution: root → TLD (.hk/.org/.edu) → sub-domain, performed recursively.
- There are only **13 "root" DNS server clusters** worldwide → essentially a single point of failure for the Internet; attacks on root servers have occurred, but did not last long enough.
- ⚔ **DNS cache poisoning**: for performance, a server caches translations; if it receives and caches a **false record**, it returns the wrong IP to clients → traffic is diverted to the attacker's machine.
- Defense: DNSSEC, randomizing the query ID/port, 0x20 encoding (not covered in the slides).

### 2.4 Transport layer ★

- The network layer offers unreliable, "best effort" delivery; any improved service must be provided by the hosts (transport layer).
- **TCP**: reliable, in-order, flow control, connection-oriented (it contacts the server before sending data; a logical connection, not a physical one).
  - Header: source/destination port, sequence number, acknowledgment number, flags (ACK/SYN/RST...), window, checksum, urgent pointer; **20 bytes** when there are no options.
- **Three-way handshake**:

```
Client → Server: SYN
Server → Client: SYN-ACK
Client → Server: ACK (and data)
```

- ⚔ **SYN flooding**:
  - Whenever a SYN packet is received, the server remembers this "half-open" connection → this consumes resources (backlog);
  - Too many half-open connections → memory/table exhaustion → the server cannot respond to legitimate requests;
  - Root cause: **TCP is stateful**.
  - Defense: SYN cookies, rate limiting, firewall, shorter timeouts (not covered in the slides).
- **UDP**: connectionless, low overhead, no guarantee of reliability/ordering.

### 2.5 Network layer ★

- IP: best effort; IP runs in every host and every router; routers also run routing protocols (RIP/OSPF/BGP).
- An IPv4 address is **32 bits**, in dotted decimal notation (`195.72.180.27`, each number between 0 and 255); not enough IP addresses → lots of tricks to extend the address space; a host's IP address can change.
- **Socket = IP + port**, uniquely identifies a process Internet-wide.
  - The port number is 16 bits; below 1024 are "well-known" ports (HTTP is port 80, POP3 is port 110); above 1024 are dynamic.
- **NAT**: use one (or a few) public IP addresses + different port numbers to map multiple internal hosts.
  - Advantage: extends the IP address space; (implicitly) hides the internal source addresses.
  - Disadvantage: a **DoS attack is still feasible**; it breaks end-to-end transparency.
  - Example: internal `192.168.0.12:1025` ↔ public `11.0.0.1:4000`, with the NAT table maintaining the mapping.
- ⚔ **Ping flood / Ping of Death**: abuse the ping command (ICMP echo request/reply); a large volume of ICMP packets overwhelms the victim; before you PoD a host, you may saturate your own bandwidth first.

### 2.6 Link layer ★

- Implemented in the adapter, the Network Interface Card (NIC); the NIC is "semi-autonomous" and (mostly) out of the host's control; it implements both the link and physical layers.
- **MAC address**: 48 bits, globally unique; used to forward packets over one link.
  - Analogy: an IP address is like your home address, a MAC address is like a social security number.
- **ARP**: given an IP address, find the corresponding MAC address; each host has an ARP table, or ARP cache, which is generated automatically and whose entries expire after about **20 min**; ARP is **stateless**.
- ⚔ **ARP cache poisoning**:
  - The attacker actively sends a forged ARP reply ("the MAC address of 111.111.111.002 is CC-CC-...");
  - Both caches are poisoned → traffic goes through the attacker → **man-in-the-middle**.
  - Defense: static ARP, DAI (Dynamic ARP Inspection), encryption (not covered in the slides).

### 2.7 Attack surface summarized by layer ★

| Layer | Attack | Root cause | Defense direction |
|---|---|---|---|
| Application | SMTP spoofing | No sender authentication | SPF/DKIM/DMARC |
| Application | DNS poisoning | Caching + no signatures | DNSSEC, randomization |
| Application | Cookie privacy | Cross-site tracking | Privacy policy, isolation |
| Transport | SYN flood | TCP is stateful | SYN cookies, rate limiting |
| Network | IP spoofing, Ping flood | No source authentication, ICMP abuse | Ingress filtering, rate limiting |
| Link | ARP poisoning | ARP is stateless and unauthenticated | Static ARP, DAI |

---

## 3. Worked examples

### Example 1: Password entropy (8 points)

**Question**: For an 8-character password chosen at random from 26 lowercase letters, from 95 printable characters, and from 256 bytes respectively, what is the entropy in bits in each case? Why is the actual strength far below this?

**Solution**:
- 26⁸: `8×log2(26) ≈ 8×4.70 = 37.6 bit`
- 95⁸: `8×log2(95) ≈ 8×6.57 = 52.6 bit`
- 256⁸: `8×8 = 64 bit`
- In practice users do not choose at random and use dictionary words/mutations → the attacker uses a dictionary attack, and the actual search space is far smaller than the theoretical value.

### Example 2: Salting (8 points)

**Question**: The dictionary size is 10⁸ and the system has 10⁴ users. With no salt and with salt (an independent salt per user), what order of magnitude does the attacker need to crack all passwords offline in each case?

**Solution**:
- No salt: precompute 10⁸ hashes, shared by all users → **10⁸**.
- With salt: every user and every salt must be recomputed → **10⁸ × 10⁴ = 10¹²**.
- If a slow hash is added on top (0.1 second each), the cost is multiplied by the time factor.

### Example 3: EER (8 points)

**Question**: After a fingerprint system raises its threshold, fraud drops to 1% and insult rises to 10%. Explain why, and explain the meaning of EER.

**Solution**:
- A higher threshold = harder to pass → an impostor is less likely to be accepted (fraud↓), but a legitimate user is also more likely to be rejected (insult↑).
- The two trade off as the threshold changes; EER is the point where fraud=insult, used to compare different biometrics/systems (the smaller the better).

### Example 4: SYN flood (10 points)

**Question**: Describe the process of a SYN flood. Why is the root cause "TCP is stateful"?

**Solution**:
1. The attacker sends a large number of SYN packets (the source IP can be spoofed);
2. The server allocates a half-open connection (a backlog table entry) for each SYN and replies with SYN-ACK;
3. The attacker does not reply with ACK → the table entries are used up;
4. New legitimate SYN packets cannot enter the queue → denial of service.
- Root cause: the server must **remember** the state of every half-open connection; state resources are limited.
- Defense: SYN cookies (store no state, encode the information into the sequence number), rate limiting, shorter timeouts.

### Example 5: DNS poisoning (10 points)

**Question**: How can an attacker make a user who visits `www.bank.com` be directed to the attacker's own server?

**Solution**:
1. The attacker sends a forged response (matching the query ID/port) to the recursive DNS server, claiming that the A record of `www.bank.com` is the attacker's IP;
2. The recursive server **caches** the false record (within the TTL);
3. After that, every user who queries that domain name receives the false IP;
4. The user connects to the attacker's server (which can phish/act as a man-in-the-middle).
- Defense: DNSSEC (signatures), randomizing the query ID/port, limiting caching.

### Example 6: ARP poisoning (10 points)

**Question**: How can an attacker become a man-in-the-middle between Alice and the gateway on the same LAN?

**Solution**:
1. The attacker sends Alice a forged ARP reply: "the MAC address of the gateway IP is my MAC";
2. It sends the gateway a forged ARP reply: "the MAC address of Alice's IP is my MAC";
3. Both ARP caches are poisoned, and all traffic is sent to the attacker;
4. The attacker forwards (or tampers with) the traffic → man-in-the-middle.
- Root cause: ARP is stateless and unauthenticated; the cache is updated as soon as a reply arrives.
- Defense: static ARP, DAI, port security.

### Example 7: NAT table (8 points)

**Question**: The internal host `192.168.0.12:1025` accesses `12.0.0.1:80`; the NAT public address is `11.0.0.1` and the mapped port is 4000. Write down the source/destination addresses before and after NAT.

**Solution**:
- Outbound: `src=192.168.0.12:1025, dst=12.0.0.1:80` → `src=11.0.0.1:4000, dst=12.0.0.1:80`;
- NAT table: `4000 ↔ 192.168.0.12:1025`;
- Return direction: `src=12.0.0.1:80, dst=11.0.0.1:4000` → `src=12.0.0.1:80, dst=192.168.0.12:1025`.

---

## 4. Common pitfalls (where marks are easiest to lose)

| Mistake | Correct |
|---|---|
| Authentication = authorization | Authentication confirms identity; authorization decides permissions |
| 2FA = two passwords | It must be **two different categories of factors** (know/have/are) |
| A longer password is always stronger | Predictable user choice destroys entropy; `P@ssw0rd!` is still in the dictionary |
| Hashing a password makes it safe | Without salt you can precompute/compare in bulk; you need salt + a slow hash |
| The salt must be kept secret | The salt does not need to be secret, it only needs to be unique/random |
| A biometric can "change the password" | Biometrics **cannot be revoked**; once leaked they cannot be replaced |
| fraud = the genuine user is rejected | fraud = the impostor is accepted; insult = the genuine user is rejected (the slides label them the other way round; memorize by definition) |
| TCP is a "true connection" | It is only a logical connection; the underlying layer is still packets |
| UDP is unreliable, so it is useless | DNS, video, games, etc. use UDP to gain low latency |
| NAT prevents DoS | NAT does not prevent DoS; it only extends addresses/hides the source |
| ARP is a layer-3 protocol | ARP sits between the link layer and the network layer and maps IP→MAC |
| DNS has only 13 physical servers | There are 13 **root server clusters** (multiple anycast instances) |
| Cookie is an authentication mechanism | It is only state management; its authentication power is very weak |

---

## 5. Self-test (do it first, then check the answers)

1. What is the difference between authentication and authorization? Give three examples for each of the three authentication factors.
2. Why is a 64-bit random key stronger than an 8-character password? What affects the entropy of a password?
3. What is a dictionary attack? Why is it more effective than brute force?
4. What advantage does a passphrase have over a "complex password"? What did the slide experiment show?
5. What is wrong with hashed passwords without salt? How does salt fix it? Does the salt need to be kept secret?
6. What are the four ideal properties of a biometric? What is the difference between enrollment and recognition?
7. What are fraud and insult respectively? What is the meaning of EER?
8. Why is "biometrics cannot be revoked" a fundamental problem?
9. Draw the five-layer protocol stack and give two protocols for each layer.
10. What is encapsulation? Up to which layer does a router process a packet?
11. Why does HTTP need cookies? What is the privacy risk of cookies?
12. How is SMTP spoofed? What are the steps of DNS cache poisoning?
13. What is the TCP three-way handshake? What is the root cause of a SYN flood and how do you defend against it?
14. What makes up a socket? What are the advantages and disadvantages of NAT?
15. How does ARP poisoning create a man-in-the-middle? How do you mitigate it?

### Answers

1. Authentication confirms "who you are"; authorization decides "what you can do". Know: password/PIN/date of birth; have: smartcard/token/cell phone; are: fingerprint/face/voiceprint.
2. A key is generated at random, so it has full entropy; a password is chosen by a person and is affected by dictionaries/patterns/reuse, so its actual entropy is far below the theoretical value for its length.
3. Try only the most likely candidates (dictionary words, mutations); because user choices follow patterns, the hit rate is high, far better than brute-forcing 2⁶⁴.
4. Longer, easy to remember, and unlikely to be hit by a dictionary; in the experiment, the passphrase group had a 10% crack rate and was easy to remember, while the complex-rule group had 30%.
5. Precomputation, the same hash for the same password, and bulk cracking; the salt makes each user's hash unique, so the attacker must recompute user by user; the salt does not need to be secret.
6. Universal, Distinguishing, Permanent, Collectable (+ safe/friendly). Enrollment is putting the info into the database (may be slow, must be precise); Recognition is the actual detection (must be quick and accurate).
7. fraud: the impostor is accepted; insult: the genuine user is rejected. EER is the point where the two are equal, used to compare systems, the smaller the better.
8. A leaked password can be changed, but a fingerprint/iris cannot be replaced; once leaked it is unusable for life.
9. Application (HTTP/SMTP), transport (TCP/UDP), network (IP/BGP), link (Ethernet/ARP), physical.
10. Each layer adds a header, with the application data on the inside; a router processes up to the network layer.
11. HTTP is stateless, so cookies are used for sessions/shopping carts/recommendations; cross-site tracking and privacy leaks; weak authentication power.
12. SMTP's MAIL FROM can be written arbitrarily; DNS poisoning: forged response → the recursive server caches the false record → the wrong IP is returned.
13. SYN → SYN-ACK → ACK; the server keeps state for half-open connections, and when the table is full it denies service; defense: SYN cookies, rate limiting, shorter timeouts.
14. IP + port; NAT extends addresses and hides the internal network, but it breaks end-to-end and DoS is still feasible.
15. Forged ARP replies poison both caches so traffic goes through the attacker; defense: static ARP, DAI, port security.

---

## 6. Pre-exam quick-reference card

| Item | Content |
|---|---|
| Access control | Authentication (who you are) + authorization (what you can do) |
| Three factors | know / have / are |
| 2FA | Any two categories of factors |
| Key vs password | 2⁶⁴ vs user choice → dictionary attack |
| Password experiment | Complex rules 30%; passphrase 10% and easy to remember; random 10% and hard to remember |
| salt | Random, not secret, unique per user; attack volume × number of users |
| Biometrics | Universal/Distinguishing/Permanent/Collectable |
| fraud/insult | Impostor accepted / genuine user rejected; EER is the equal point |
| Five layers | application/transport/network/link/physical |
| Encapsulation | Each layer adds a header, data is on the inside |
| HTTP | Stateless; cookies add state; weak authentication; privacy |
| SMTP | Plaintext commands; MAIL FROM can be spoofed |
| DNS | 13 root clusters; cache poisoning |
| TCP | Reliable/in-order/flow control/connection-oriented; 20B header; three-way handshake |
| SYN flood | Half-open connections exhaust the backlog; the root cause is statefulness |
| IP/socket | 32-bit IP; IP + 16-bit port |
| NAT | Address reuse; hides the internal network; does not prevent DoS |
| MAC/ARP | 48-bit MAC; ARP cache ~20 min; can be poisoned |
