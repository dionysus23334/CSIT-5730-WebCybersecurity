# Chapter 1 · Introduction & Classical Cryptography · Review Notes

> **Matching slides**: `w1/introduction-CSIT5730-26F.pdf`, `w1/classic-crypto.pdf`
>
> **Suggested time**: first pass 60 minutes + self-test 30 minutes
>
> **Companion**: Outline §2.1, §2.2
>
> **Weight of this chapter**: a high-frequency source for concept questions + threat modeling questions; classical crypto is usually only examined as multiple choice / fill-in / small computations, but the idea of OTP runs through all the cryptography that follows.

---

## 0. Chapter thread (memorize these three sentences first)

1. **Security is not a pile of tools, it is a way of thinking**: first ask "which property do we want to protect (CIA)", then ask "who will attack how (threat model)", and only then work out "is it worth defending (cost/benefit)".
2. **Vulnerabilities come either from design or from implementation**; design flaws cannot be solved by patching, implementation flaws can be patched but will be reused over and over.
3. **The value of classical crypto lies in establishing the vocabulary**: Kerckhoffs's principle, a key space is not security, frequency analysis, and the fundamental contradiction between OTP's provable security and its "unusability".

**Common question types in this chapter**

| Question type | Typical phrasing | What to prepare |
|---|---|---|
| Concept discrimination | What are the three elements of CIA? Given a scenario, decide which one is broken | Memorize the definitions + prepare 2 examples per category |
| Threat modeling | Given a system (cloud / phone / enterprise intranet), write out attacker/capability/asset | Apply the three-question template |
| Principle application | A certain design violates which Saltzer & Schroeder principle | Remember 3 principles + be able to give examples |
| Classical crypto computation | Caesar decryption, key space, frequency analysis, OTP | Be able to compute the bit count of 26!, be able to do XOR |

---

## 1. Security mindset

### 1.1 The three CIA elements (must be able to say them without hesitation)

| Element | One-sentence definition | Example of violation | Where it reappears in this course |
|---|---|---|---|
| **Confidentiality** | Unauthorized parties cannot read the data | eavesdropping, side channel, data breach, storing passwords in plaintext | cryptography, side channel |
| **Integrity** | The data is accurate and has not been modified without authorization | tampering with a transfer amount, ECB cut-and-paste, SQL injection modifying the database | MAC (Message Authentication Code), signatures, hashing |
| **Availability** | Authorized users can access it whenever they need it | SYN flood, worms, memory leaks, ransomware | DoS, malware |

**Key understanding**

- CIA is not mutually exclusive: a single attack often breaks several at once. Ransomware = confidentiality (encryption) + availability (data unavailable); ARP spoofing = confidentiality (eavesdropping) + integrity (tamperable).
- When analyzing any attack, the first sentence should be: "which one/ones of CIA does this break."
- **Authentication itself is not one of the CIA elements**, but it is a prerequisite for achieving C/I/A; an authentication failure leads to unauthorized access.

### 1.2 Where do vulnerabilities come from (design vs. implementation)

| Layer | Concrete source | Example |
|---|---|---|
| **Design** | Theoretical limitations | the OTP key must be as long as the message → cannot be distributed at scale |
| | Lack of security features | the protocol has no authentication → DH man-in-the-middle |
| | Side channels | however correct the implementation, time/power/cache still leak the key |
| | Wrong threat model | assuming "users will not modify the client" / "the cloud service provider is trusted" |
| | Wrong user model | assuming users choose strong passwords and read certificate warnings |
| **Implementation** | Coding errors | buffer overflow, UAF, format string |
| | Hardware errors | Rowhammer, Spectre/Meltdown class |
| | Injected errors | supply chain backdoor, malicious compiler (XcodeGhost) |
| | Failure to meet specifications | the implementation is inconsistent with the protocol RFC, creating an opening |

**Where do attackers go to find vulnerabilities**

1. Find unknown vulnerabilities (0-day) — the hardest, but the most valuable;
2. Buy 0-day — feasible, and it forms a black market;
3. Reuse known vulnerabilities — the easiest: no patch applied, old systems, default configuration.

> Exam point: **"design flaws and implementation flaws are fixed in different ways"**. Design flaws require changing the protocol/architecture (possibly incompatible), an implementation flaw just needs a patch, but as long as unpatched machines remain it is still exploitable (the lesson of the Morris Worm).

### 1.3 The defender's three things

| Concept | Question it answers | Output |
|---|---|---|
| **Security policy** | Which property do I want to enforce? | a verifiable rule, e.g. "the password can only be stored on this machine", "a data pointer can only access the specified memory region" |
| **Risk assessment** | What assets do I have? Which is most critical? Who do I defend against first? | asset inventory + risk ranking |
| **Threat model** | Who attacks? With what capability? What do they want to steal? | the three elements attacker / capability / asset |

**Threat model template (use it directly in the exam)**

> - System: ____
> - Attacker: ____ (e.g., co-tenant, service provider, network man-in-the-middle, malicious employee, the person who has the phone)
> - Capability: ____ (e.g., can share the CPU cache, can control the hypervisor, can send arbitrary packets, can physically touch the device)
> - Asset: ____ (e.g., private key, photos, password, transaction records)
> - Therefore what needs to be defended is: ____ (which one of CIA it corresponds to)

**Cloud platform example (the slide example)**

- Attacker: the service provider, other cloud tenants.
- Capability: the service provider can control everything (hypervisor, snapshots, scheduling); a co-tenant VM can share the same physical hardware with you (L1/L2 shared within a core, L3 shared across cores).
- Asset: anything valuable (keys, data, models).
- Conclusion: this is inherently a **side channel** threat model; beyond cryptography you must also consider physical/microarchitectural leakage.

**Cost vs. benefit (defense is not "the stronger the better")**

| Option | Advantage | Cost |
|---|---|---|
| Online kernel monitoring | easy to deploy | slows down the performance |
| Offline formal verification | no runtime overhead | almost infeasible for a commercial OS |

> Exam point: if a scenario asks "why not use the strongest defense", the answer is usually **cost, compatibility, performance, availability**, not "it cannot be done".

### 1.4 Saltzer & Schroeder security design principles

The slides focus on 3 principles; you must be able to give "principle + explanation + example":

1. **Open design**
    - Security depends only on the key, not on keeping the algorithm secret.
    - Rationale: once a secret algorithm leaks it is completely broken; in reality secrets do not stay secret; only openness lets peers find the weaknesses beforehand.
    - Counterexample: a home-grown "ancestral encryption algorithm", treating Base64 as encryption.
2. **Economy of mechanism**
    - Simple interfaces, clean module boundaries, avoid global state.
    - Benefits: easier debugging, code audit, static/dynamic analysis, formal verification.
    - Counterexample: one function handles authentication, authorization, logging, and encryption at the same time — a huge attack surface that is hard to verify.
3. **Least privilege**
    - Grant exactly "the minimum capability required to run".
    - Practice: grant nothing first, and add permissions one by one as errors appear; rather than granting root first and then taking it back.
    - Counterexample: using root for the database connection; an app demanding contacts + location + storage the moment it starts.

**The complete classic list (supplementary; you can answer this if the exam asks "what else")**: fail-safe defaults (deny by default), complete mediation (check every access), separation of privilege, least common mechanism, psychological acceptability (usability).

> Note: the slides say "some of the rules may not be applicable nowadays"; when answering, do not be absolute — principles are a starting point for trade-offs, not dogma.

### 1.5 White hat ethics (for awareness)

- Test only on systems for which you have **authorization**; report found vulnerabilities through **responsible disclosure**; do not steal, do not damage, do not publish the details of unfixed issues.
- The course has an ethics statement; "be a happy and ethic hacker".

---

## 2. Classical cryptography

### 2.1 Basic vocabulary and Kerckhoffs's principle

```
plaintext P --encrypt E(K)--> ciphertext C --decrypt D(K)--> plaintext P
```

- **Symmetric**: the same key encrypts and decrypts; **public key**: the public key encrypts, the private key decrypts (Chapter 3).
- The intuition for security: **computing P from C without the key is hard; with the key it is easy.**
- **Kerckhoffs's principle**: the security of a cryptosystem should depend only on the secrecy of the **key**, not on the secrecy of the algorithm.
  - This is "open design" embodied in cryptography.
  - Modern example: the AES algorithm is completely public, and security relies on the key.

### 2.2 Caesar cipher and frequency analysis

**Caesar cipher**: shift the whole alphabet by k. Encryption \(C = (P + k) \bmod 26\), decryption \(P = (C - k) \bmod 26\).

**Example (the slide example)**: ciphertext `CSYEVIXIVQMREXIH`, known to be a Caesar cipher; find the plaintext.
- Try k=4 (shift every letter back by 4):
  `C→Y, S→O, Y→U, E→A, V→R, I→E, X→T, ...`
- Result: **`YOU ARE TERMINATED`**.
- Why so fast? Because Caesar has only 25 nonzero keys, so **exhaustive key search** is enough.

**General simple substitution**: an arbitrary permutation of letters, key space `26!`.
- <span class="mchip">\(26! = 403{,}291{,}461{,}126{,}605{,}635{,}584{,}000{,}000 \approx 4.03\times10^{26}\)</span>
- <span class="mchip">\(\log_2(26!) \approx 88.4\)</span>, i.e. **> 2⁸⁸**, exhaustive search is infeasible.
- But **frequency analysis** breaks it:
  1. Count the ciphertext letter frequencies;
  2. Align them with the English distribution (e/t/a are the most common; slide example: {h,l,r} → {t,a,e});
  3. Verify with high-frequency words / pattern words (e.g. `gur` → `the`);
  4. Iterate the substitution and expand step by step.

> **Core conclusion**: **a large key space ≠ security**. As long as a "shortcut" attack exists, it is insecure.

### 2.3 An operational definition of "secure"

- If **the best known attack is exhaustive search**, the system is called secure;
- If any shortcut smarter than exhaustive search exists, it is insecure;
- But "exhaustive search" itself must also be **infeasible** — DES's 56-bit is the counterexample (Chapter 2).

### 2.4 One-time pad (OTP)

**Mechanism**: \(C = P \oplus K\), \(P = C \oplus K\) (XOR is self-inverse: XOR the same value twice and you get the original back).

**Slide example** (3-bit encoding e=000, h=001, i=010, k=011, l=100, r=101, s=110, t=111):

| | Plaintext | Key | Ciphertext |
|---|---|---|---|
| Characters | h e i l h i t l e r | — (keystream) | s r l h s s t h s r |
| Bits | 001 000 010 100 001 010 111 100 000 101 | 111 101 110 101 111 100 000 101 110 000 | 110 101 100 001 110 110 111 001 110 101 |

**Why it is provably secure**

- Every bit of the key is equally likely at random ⇒ for any plaintext, the ciphertext is uniformly distributed over the ciphertext space ⇒ **the ciphertext carries no information about the plaintext**.
- Formal statement: <span class="mchip">\(P(C=c \mid P=p_1) = P(C=c \mid P=p_2)\)</span> holds for any p1, p2.

**The three required conditions (violating any one breaks it)**

1. The key is **truly random**;
2. The key is **used only once**;
3. The key is **as long as the message**.

**Fatal problem**: the key is as long as the message and must be distributed securely — **"so why not just transmit the key?"** This is the key distribution problem, and it is exactly the problem public key cryptography has to solve.

**Real-world case VENONA**: Soviet spies used OTP, but the "one-time" pads were **reused**, so a large number of ciphertexts could be broken by correlation analysis.

**Two-time pad attack (must know)**

If \(C_{1} = P_{1} \oplus K\), \(C_{2} = P_{2} \oplus K\), then:

\[
C_1 \oplus C_2 = P_1 \oplus P_2
\]

- If P1 is known, then \(P_{2} = C_{1} \oplus C_{2} \oplus P_{1}\);
- If both P1 and P2 are English, then \(P_{1} \oplus P_{2}\) can be guessed word by word with "crib-dragging".

**4-bit mini example**: P1=1010, K=0110 → C1=1100; P2=0011 → C2=0101.
\(C_{1}\oplus C_{2} = 1001 = P_{1}\oplus P_{2}\); given P1=1010 ⇒ \(P_{2} = 1001\oplus 1010 = 0011\).

### 2.5 Codebook cipher

- A codebook maps words/phrases to codewords (the Zimmerman Telegram).
- **Additive**: stack another "book of random numbers" on top; send the ciphertext + the additive position (the position is not secret); the receiver subtracts the additives first, then looks up the codebook.
- Purpose: **the same word is encoded differently each time**, resisting frequency analysis.
- Modern connection: **a block cipher is an electronic codebook** (ECB mode), see Chapter 2.

### 2.6 The three legacies of classical cryptography

1. **Kerckhoffs's principle**: the algorithm is public, the key is secret.
2. **Security = resistance to the strongest known attack**, not "it looks random".
3. **OTP is the theoretical upper bound**: provably secure, but key distribution is infeasible → all the cryptography that follows is "approximating the effect of OTP with a short key".

---

## 3. Worked examples

### Example 1: Caesar decryption (5 points)

**Question**: the ciphertext `CSYEVIXIVQMREXIH` was produced by a Caesar cipher; find the plaintext and the key.

**Solution**:
- Try all 25 keys, or observe the high frequencies: `I` and `V` appear several times, so guess `I→E` (shift by 4).
- Solve with <span class="mchip">\(P = C-4\)</span>: `YOU ARE TERMINATED`.
- Key k=4 (+4 when encrypting).

**Scoring points**: write the formula \(P=(C-k) \bmod 26\); state that "Caesar has only 25 keys, so it can be exhaustively searched".

### Example 2: Key space and security (5 points)

**Question**: a general simple substitution has 26! keys, why is it still insecure?

**Solution**:
- 26! ≈ 2⁸⁸·⁴, exhaustive search really is infeasible;
- but a simple substitution **preserves the letter frequency distribution**, so frequency analysis + pattern words can recover the mapping step by step;
- therefore the "best attack" is not exhaustive search but frequency analysis → by definition it is **insecure**.

**Scoring points**: distinguish "a large key space" from "a strong ability to resist attack".

### Example 3: OTP reuse (10 points)

**Question**: two messages are encrypted with the same OTP key, giving C1 and C2. The attacker knows P1; how is P2 recovered? State what condition is required.

**Solution**:
- \(C_{1}\oplus C_{2} = (P_{1}\oplus K)\oplus (P_{2}\oplus K) = P_{1}\oplus P_{2}\);
- \(P_{2} = C_{1}\oplus C_{2}\oplus P_{1}\);
- Condition: **the same key was used twice** (violating OTP condition 2); if P1 is unknown but is natural language, crib-dragging can be used to guess it.

### Example 4: Threat modeling (10 points)

**Question**: a "cloud photo backup app" encrypts the user's photos in the app before uploading. Build a threat model and point out the two attacks that most need defending against.

**Reference answer**:
- Attacker: ① the cloud service provider (can control the VM, take snapshots, read memory); ② a co-tenant (shared CPU cache); ③ the person who has the user's phone; ④ a network man-in-the-middle.
- Capability: the service provider can read VM memory/disk; a co-tenant can measure cache timing; the phone holder can unlock / install a malicious app; the man-in-the-middle can tamper with the traffic.
- Asset: the photo contents, the encryption key, the account credentials.
- Most in need of defense: ① the service provider/co-tenant obtaining the key through a **side channel** (corresponding to confidentiality); ② the client key being stolen by a malicious app / the phone holder (corresponding to confidentiality + authentication).
- Defense direction: end-to-end encryption, the key never leaves the secure area, constant-time implementation, device authentication.

**Scoring points**: all three elements present; attacks correspond to assets; defenses correspond to attacks.

---

## 4. Common mistakes (where marks are most easily lost in the exam)

| Wrong statement | Correct understanding |
|---|---|
| "CIA is three parallel security goals, and every system must satisfy all of them 100%" | the three need trade-offs; different systems have different priorities (an ATM weights integrity more, a video site weights availability more) |
| "A large key space means secure" | you also have to check whether a shortcut attack exists; the 26! simple substitution is broken by frequency analysis |
| "OTP is secure as long as the key is random" | it must also be **used only once** and **as long as the message** |
| "Kerckhoffs's principle requires the algorithm to be public" | it says "security should not depend on keeping the algorithm secret"; open design is a recommended practice, not a mathematical requirement |
| "A threat model = risk analysis" | a threat model answers "who, with what capability, steals what"; risk analysis answers "how important the assets are, who to defend against first" |
| "Design flaws and implementation flaws can both be patched" | design flaws usually require changing the protocol/architecture and may be incompatible; implementation flaws can be patched but the machines already in the field are still at risk |
| "A white hat can test whatever they like" | authorization is required; unauthorized testing is an attack |

---

## 5. Self-test (do it first, then look at the answers)

1. Define CIA in one sentence each, and give one attack from later in this course for each.
2. Give three examples each of the "design causes" and the "implementation causes" of vulnerabilities.
3. What are the three elements of a threat model? Write one out for a "campus course registration system".
4. What problem does each of Saltzer & Schroeder's open design, economy of mechanism, and least privilege solve?
5. Why is "open design" actually more secure? Give a counterexample.
6. How large is the Caesar cipher's key space? Why is it insecure?
7. Roughly how many bits is 26!? What does this number show, and what does it not show?
8. What are the three conditions for OTP? What happens if any one of them is violated?
9. Two ciphertexts C1 and C2 are encrypted with the same OTP key; write the quantity the attacker can compute directly.
10. Why is OTP said to be "provably secure but unusable"? What is its relation to modern stream ciphers?

### Answers

1. Confidentiality (side channel stealing the key), integrity (ECB cut-and-paste), availability (SYN flood).
2. Design: OTP key distribution, protocol without authentication, wrong threat model; implementation: buffer overflow, UAF, format string.
3. Attacker (student / outside hacker / internal administrator), Capability (has a student ID and can log in / can access the intranet / can touch the database), Asset (grades, personal information, course registration records).
4. Open design: avoids "the whole system collapsing the moment a secret algorithm leaks"; Economy: lowers the cost of audit and verification; Least privilege: limits the impact scope after a vulnerability is exploited.
5. Openness lets more people review and find weaknesses beforehand; counterexample: a home-grown private encryption algorithm — once it is reversed there is no security left, and nobody helps you find vulnerabilities.
6. 25 nonzero keys (or 26 including 0); it can be exhaustively searched, and the frequency distribution is preserved.
7. ≈ 2⁸⁸·⁴; it shows that exhaustive search is infeasible; it does not show resistance to shortcut attacks such as frequency analysis.
8. Truly random, used only once, as long as the message; violating them leads respectively to predictability, a two-time pad, and infeasible key distribution.
9. \(C_{1}\oplus C_{2} = P_{1}\oplus P_{2}\).
10. Because information-theoretically the ciphertext leaks nothing about the plaintext, but the key must be as long as the message and be distributed securely; a stream cipher uses a short key to generate a pseudorandom keystream to "simulate" OTP.

---

## 6. Pre-exam quick-reference card

| Point | Content |
|---|---|
| CIA | Confidentiality / Integrity / Availability |
| Source of vulnerabilities | design (theoretical limitations, missing features, side channels, wrong threat/user model) / implementation (coding, hardware, injected, non-compliant) |
| The defender's three things | policy → risk assessment → threat model |
| The threat model's three questions | who / capability / what asset |
| The three principles | open design, economy of mechanism, least privilege |
| Kerckhoffs | security depends only on the key, not on keeping the algorithm secret |
| Caesar | 25 keys, exhaustively searchable; \(P=(C-k) \bmod 26\) |
| Simple substitution | 26! ≈ 2⁸⁸·⁴, but frequency analysis breaks it |
| OTP | \(C=P\oplus K\); random, once, same length; two-time pad → \(C_{1}\oplus C_{2}=P_{1}\oplus P_{2}\) |
| Definition of security | best attack = exhaustive search → secure; a shortcut exists → insecure |
| Classical legacy | Kerckhoffs, resistance to the strongest attack, OTP as the theoretical upper bound |
