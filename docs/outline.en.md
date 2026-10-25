# CSIT5730 Principles of Cybersecurity · Knowledge Outline

> **Scope**: `slides/w1–w7`, 12 decks in total (introduction, classical crypto, symmetric crypto, public key crypto, malware, reverse engineering, buffer overflow, obfuscation, software exploitation II, side channel, authentication, network basics and security).
>
> **How to use**: first read §1 to build the global map → go through the detail tree in §2 lecture by lecture → before the exam read the numbers and side-by-side comparisons in §3 → self-test with §4.
>
> **Markers**: ★ core mechanism / high-frequency exam point; ⚔ attack; 🔧 defense; ⚠ easily confused / error-prone.

---

## 0. Course information

| Item | Content |
|---|---|
| Course | CSIT5730: Principles of Cybersecurity (a PG introduction course) |
| Instructor | Shuai Wang (HKUST CSE) |
| Grading | Assignment ×3: 30% (the 2nd one includes programming) / Midterm: 20% (10/26, during the lecture) / Final: 25% / Group project: 25% |
| Textbook | Optional: *Introduction to Computer Security*; *Information Security: Principles and Practice* |
| Main thread | Driven by real-world problems, training **attacker / defender two-way thinking** rather than piling up technology |

**The five blocks of the course** (the map given in the w1 deck):

1. Security basics and definitions: CIA, attack models
2. Cryptography: classical, symmetric, public key, signatures, authentication, hashing
3. Software security: memory errors, buffer overflow, obfuscation, malware, security testing
4. System & web security: authentication, access control, protocols, browser security, side channels
5. Emerging platforms: blockchain / smart contracts, AI security

> Note: blockchain and AI security only appear as a "field overview" in the w1 introduction, and later decks do not expand on them; for review, "know the concept + be able to give an example" is enough.

---

## 1. Global knowledge map

<div class="kmap">
<div class="kmap-top">Security goals · CIA</div>
<div class="kmap-three">
<div class="kmap-card"><span class="kmap-k">C</span><b>Confidentiality</b><p>Cryptography: classical → symmetric → public key; encryption</p></div>
<div class="kmap-card"><span class="kmap-k">I</span><b>Integrity</b><p>MAC, hashing, digital signature, certificate</p></div>
<div class="kmap-card"><span class="kmap-k">A</span><b>Availability</b><p>DoS / DDoS, worms, resource leakage</p></div>
</div>
<div class="kmap-split">
<div class="kmap-panel">
<div class="kmap-h">Attacker's view</div>
<div class="kmap-item"><b>Where vulnerabilities come from</b><span>design flaws vs. implementation flaws</span></div>
<div class="kmap-item"><b>Attack surface</b><span>protocol stack, memory, crypto implementation, people</span></div>
<div class="kmap-item"><b>Attack chain</b><span>reconnaissance → entry → privilege escalation → persistence → data theft</span></div>
</div>
<div class="kmap-panel">
<div class="kmap-h">Defender's view</div>
<div class="kmap-item"><b>security policy</b><span>which property to protect</span></div>
<div class="kmap-item"><b>risk assessment</b><span>asset, criticality, priority</span></div>
<div class="kmap-item"><b>threat model</b><span>who, capability, what they want to steal</span></div>
<div class="kmap-item"><b>cost / benefit</b><span>cost/benefit + design principles</span></div>
</div>
</div>
<div class="kmap-h kmap-h-tech">Technical topics</div>
<div class="kmap-four">
<div class="kmap-tech"><b>Cryptography</b><span>classic → symmetric → public-key → hash</span></div>
<div class="kmap-tech"><b>Software security</b><span>malware / RE / memory corruption / obfuscation</span></div>
<div class="kmap-tech"><b>System and network</b><span>authentication / protocols / side channel</span></div>
<div class="kmap-tech"><b>Emerging</b><span>blockchain / AI</span></div>
</div>
</div>

**Mapping between each lecture and CIA**

| Lecture | Topic | Main correspondence |
|---|---|---|
| w1 | Introduction, security mindset, classical crypto | all three + threat modeling |
| w2 | Symmetric crypto, block cipher modes, MAC | C + I |
| w3 | Public key, DH, signatures, PKI, hashing | C + I + authentication |
| w4 | Malware, reverse engineering | A + C/I (data theft) |
| w5 | Buffer overflow, obfuscation | C/I + control-flow hijacking |
| w6 | UAF / double free / format string / SQLi, side channel | C/I + information leakage |
| w7 | Authentication (password / biometrics), network protocol security | authentication + A |

---

## 2. Outline by lecture

### W1-A Introduction: security mindset (introduction)

**In one sentence**: security is an endless arms race between attackers and defenders; first learn to find vulnerabilities like an attacker, then learn to define policy, assess risk, and build a threat model like a defender.

#### 2.1.1 The three CIA elements ★

| Element | Definition | Typical violation |
|---|---|---|
| **Confidentiality** | Unauthorized parties cannot read the data | eavesdropping, side channel, data breach |
| **Integrity** | The data is an accurate, unmodified representation of the original | tampering, missing MAC, injection |
| **Availability** | Authorized users can access it at any time | DoS, worms, resource exhaustion |

> Memory hook: **CIA** is not the "Central Intelligence Agency"; any attack can be classified into one or more of these three categories. For every later lecture you should proactively ask: **which one of C/I/A does this attack break?**

#### 2.1.2 Where do vulnerabilities come from ★

**Design level (design)**
- Theoretical limitations (e.g., OTP key distribution)
- Lack of security features (e.g., no authentication)
- Side channels (independent of the implementation, physical information leakage)
- Wrong threat model (the threat model assumptions are wrong)
- Wrong user model (assumptions about what users will do)

**Implementation level (implementation)**
- Coding errors (buffer overflow, UAF…)
- Hardware errors
- Injected errors (supply chain, compiler backdoor)
- Failure to meet specifications

**How attackers get vulnerabilities**
1. Find unknown vulnerabilities (0-day) — hard
2. Buy 0-day — you can, but it is expensive
3. Reuse known vulnerabilities — relatively easy (unpatched, old systems)

#### 2.1.3 Think like an attacker ⚔

- Why white hats also need to learn attacks: identify vulnerabilities so they can be fixed first; learn about unknown threats; help vendors build more secure systems; get lots of bonus from vendors.
- Key mindset: **"Under what conditions do the assumptions of this system fail?"**

#### 2.1.4 Think like a defender 🔧 ★

| Concept | Question it answers | Example |
|---|---|---|
| **Security policy** | Which property do I want to enforce? | A password can only be stored on my phone; a data pointer in C code can only access a certain memory region |
| **Risk assessment** | What assets are there? How critical? Who to protect first? | network, servers, applications, data centers, data; prioritize by criticality |
| **Threat model** | Who attacks? With what capability? What do they want to steal? | cloud platform: the service provider can control everything; co-tenants share hardware → side channel |
| **Cost vs. benefit** | Is the cost of the defense worth it? | online monitoring (simple but slows down the performance) vs. offline formal verification (extremely hard but no runtime overhead) |

> The three questions of the threat model are the "pre-declaration" of every attack scenario that follows: **attacker / capability / asset**. Whenever the exam asks "is this attack feasible", go back to the threat model first.

#### 2.1.5 Saltzer & Schroeder's security design principles ★

The slides focus on 3 of them:

1. **Open design** vs. security by obscurity: the algorithm is public, only the key is secret. Rationale: a secret algorithm is weak once exposed; secrets never stay secret; only openness lets weaknesses be found beforehand.
2. **Economy of mechanism**: clean interfaces, avoid global state; helpful for debugging, code audit, static/dynamic analysis, formal verification.
3. **Least privilege**: grant exactly the minimum capability a program requires in order to run; in practice: grant nothing first, then add step by step as errors occur.

> The complete classic list also has: fail-safe defaults, complete mediation, separation of privilege, least common mechanism, psychological acceptability (the slides note that "some of the rules may not be applicable nowadays" and give them as reading after the class).

#### 2.1.6 Preview of course topics (being able to give an example is enough)

- **Reverse engineering**: how to break the password protection of a Windows software?
- **Side channel**: when a software vulnerability cannot be exploited, infer secrets from execution time, power, EM emissions, sound, heat, cache.
- **Blockchain**: Bitcoin (transactions are stored on the blockchain, anonymous addresses act as bank accounts); Ethereum (smart contracts = programs executed on the blockchain, an address can be a user or a contract).
- **AI security**: adversarial examples cause classification / object detection failure.

---

### W1-B Classical cryptography (classic crypto)

**In one sentence**: classical cryptography builds the basic vocabulary of cryptography in a "can be done by hand" way; OTP gives the limit of "provably secure", but also exposes the fundamental difficulty of key distribution.

#### 2.2.1 Basic vocabulary and assumptions ★

- plaintext → encryption → ciphertext → decryption → plaintext.
- A key configures a cryptosystem.
- **Symmetric**: the same key encrypts and decrypts; **public key**: the public key encrypts, the private key decrypts.
- The intuition for computational security: **recovering the plaintext from the ciphertext without the key is hard; with the key it is easy.**
- **Kerckhoffs's principle** ★: the security of a cryptosystem should depend only on the secrecy of the key, not on the secrecy of the algorithm.
  - Rationale: a secret algorithm is weak once exposed; secret algorithms never remain secret; only openness lets weaknesses be found beforehand.

#### 2.2.2 Simple substitution and the Caesar cipher

- Caesar: shift the whole alphabet by n (e.g., shift 3). Plaintext `fourscoreandsevenyearsago` → ciphertext `IRXUVFRUHDQGVHYHQBHDUVDJR`.
- Key space: a shift has only 25 nonzero keys → exhaustive key search is enough.
- General simple substitution: an arbitrary permutation of letters, key space **26! ≈ 4.03×10²⁶ > 2⁸⁸** → cannot be exhausted.

#### 2.2.3 Frequency analysis ⚔ ★

- The letter frequencies in English differ clearly (e/t/a are the highest).
- Steps: count the ciphertext letter frequencies → align them with the English distribution (e.g., {h,l,r} → {t,a,e}) → verify with high-frequency three-letter words such as `the` → expand step by step.
- Conclusion: **"a large key space" is not the same as security**; if a shortcut attack exists, it is insecure.

#### 2.2.4 An operational definition of security ★

- If **the best known attack is exhaustive search**, the cryptosystem is called secure.
- If any shortcut attack exists, it is insecure.
- But "exhaustive search is infeasible" is the real bar for security — DES's 56-bit is the counterexample (see W2).

#### 2.2.5 One-time pad (OTP) ★★

- Encryption: \(C = P \oplus K\); decryption: \(P = C \oplus K\) (XOR is self-inverse).
- Example: `Salute!` with `heilhitler` as the key → ciphertext `srlhssthsr`.
- **Provably secure**: every bit of the key is equally likely at random ⇒ all ciphertexts are equally likely ⇒ the ciphertext leaks no information about the plaintext.
- **Three required conditions** (violating any one breaks it):
  1. the key is truly random;
  2. the key is used only once;
  3. the key is as long as the message.
- Fundamental problem: the key is as long as the message — **"so why not just transmit the key?"** → the key distribution problem.
- Real-world case **VENONA**: Soviet spies used OTP, but the pads were reused → broken by cryptanalysis.

#### 2.2.6 Codebook cipher

- A codebook maps words/phrases to codewords (e.g., the Zimmerman Telegram).
- **additive**: stack another book of "random" numbers on top; send the ciphertext + the additive position (the position is not secret); the receiver subtracts the additives first, then looks up the codebook; the effect is that **the same word is encoded differently each time**.
- A modern block cipher is essentially an "electronic codebook" (see ECB).

> ⚠ Easily confused: **the "one-time" of OTP** means the same keystream cannot encrypt a second message; **codebook + additive** is the historical way of mitigating "the same word, the same codeword", and is not the same as OTP.

---

### W2 Symmetric key cryptography (symmetric key crypto)

**In one sentence**: a stream cipher "stretches" a short key into an OTP-style keystream; a block cipher iterates a round function over fixed blocks and relies on the S-box for non-linearity; block cipher modes and the MAC decide whether "multi-block data" can be both confidential and integrity-protected.

#### 2.3.1 The two branches

| | Stream cipher | Block cipher |
|---|---|---|
| Processing unit | 1 bit / 1 byte | fixed-sized block (e.g., 64/128 bit) |
| Key | short key → pseudorandom keystream | key + round function |
| Analogy | generalized OTP | electronic codebook |
| Typical | A5/1, RC4 | DES, 3DES, AES, TEA |
| Status | efficient in hardware, slow in software; increasingly marginalized | more mainstream, software-friendly |

#### 2.3.2 A5/1 (GSM) ★

- 3 LFSRs: X 19 bits, Y 22 bits, Z 23 bits; the key is used as the initial fill of the registers.
- Each step: \(m = \mathrm{maj}(x_8, y_{10}, z_{10})\); **only registers whose clocking bit equals m step**.
- Stepping taps:
  - X: \(t = x_{13} \oplus x_{16} \oplus x_{17} \oplus x_{18}\)
  - Y: \(t = y_{20} \oplus y_{21}\)
  - Z: \(t = z_{7} \oplus z_{20} \oplus z_{21} \oplus z_{22}\)
- Output keystream bit: \(x_{18} \oplus y_{21} \oplus z_{22}\).
- Characteristics: extremely efficient in hardware, slow in software; used for GSM voice encryption; still has a role in resource-constrained devices.

#### 2.3.3 RC4 ★

- Core: a 256-byte permutation table `S` that is self-modifying with the key.
- **KSA (initialization)**:
  ```
  S[i] = i; K[i] = key[i mod N]
  j = 0
  for i = 0..255: j = (j + S[i] + K[i]) mod 256; swap(S[i], S[j])
  i = j = 0
  ```
- **PRGA (keystream generation)**:
  ```
  i = (i+1) mod 256
  j = (j + S[i]) mod 256
  swap(S[i], S[j])
  t = (S[i] + S[j]) mod 256
  keystreamByte = S[t]
  ```
- Each step produces 1 byte (A5/1 produces 1 bit per step).
- ⚠ **The first 256 bytes must be discarded**, otherwise an attack exists (the known bias of RC4).
- Naming trap: **RC5 is a block cipher**, not an upgrade of RC4.

#### 2.3.4 Feistel structure ★★

- Not a specific cipher but a **framework**: DES, Blowfish, RC5, TEA, Twofish are all variants of it or related.
- Encryption:

\[
\begin{aligned}
L_{i+1} &= R_i \\
R_{i+1} &= L_i \oplus F(R_i, K_i) \\
C &= (R_{n+1}, L_{n+1})
\end{aligned}
\]

(the halves are swapped at the end)

- Decryption: start from \((R_{n+1}, L_{n+1})\), with **the same F and the subkeys in reverse order**:

\[
\begin{aligned}
R_{i-1} &= L_i \\
L_{i-1} &= R_i \oplus F(L_i, K_{i-1})
\end{aligned}
\]

- Key property: **decryption works for any F** (because every round is invertible), but **security only holds for certain F**.
- Counterexample: with \(F = 0\) each round is just a swap, with no security at all.

#### 2.3.5 DES ★★

| Parameter | Value |
|---|---|
| Block | 64 bit |
| Key | 56 bit (64 bit including parity bits) |
| Rounds | 16 |
| Subkey used each round | 48 bit |
| Structure | Feistel |
| Source of security | 8 S-boxes (6 bit → 4 bit) |

**One round**: the right half 32 bit → expansion permutation E to 48 bit → XOR with the subkey → 8 S-boxes to 32 bit → P-box permutation → XOR with the left half → swap left and right.

- **S-box**: the only non-linear component; the outer 2 bits of the input select the row, the middle 4 bits select the column; the DES S-boxes are carefully designed to resist cryptanalysis → **this is mainly where the security comes from**.
- **P-box**: further 32-bit permutation of the S-box output (diffusion).
- **Subkey generation**: the 56-bit key is split into two 28-bit halves, cyclically left-shifted, then compressed to select 48 bit.
- **Initial permutation IP / final permutation FP**: provide no security at all, they are just a historical design.
- **Cracking history**: 1998 EFF DES Cracker < $250,000, < 3 days; 1999 distributed.net 22 hours 15 minutes (idle computing power of many machines). Conclusion: 56-bit is no longer usable.

#### 2.3.6 3DES (Triple DES) ★

- `C = E(D(E(P, K1), K2), K1)`, i.e., **EDE, two keys, 112 bit**.
- Why EDE and not EEE: **backward compatible** — `E(D(E(P,K),K),K) = E(P,K)`, with a single key it degrades to DES.
- Why not `E(E(P,K1),K2)`: the **meet-in-the-middle attack** reduces 2¹¹² to about 2⁵⁷.
- ⚠ The 112 bit of 3DES is "two 56-bit keys", not 168; only the three-key version is 168 (the slides only cover two keys).

#### 2.3.7 AES ★★

- The de-facto standard that replaces DES; **not a Feistel structure**.
- Block 128 bit; key 128/192/256 bit; rounds **10/12/14**.
- 4 operations each round:
  1. **ByteSub**: byte-by-byte S-box substitution (non-linear; no fixed point \(S(a)\neq a\), and an inverse table is needed).
  2. **ShiftRow**: cyclic shift of the rows, avoiding the columns being encrypted independently (diffusion).
  3. **MixColumn**: each column is multiplied by an invertible matrix (GF(2⁸)), implemented as a big lookup table.
  4. **AddRoundKey**: XOR with the subkey.
- Advantages: efficient on both 8/32-bit CPUs, small code/memory footprint, **AES-NI** hardware instructions (AESENC/AESDEC).
- **Avalanche effect**: one bit difference in the plaintext → a big change in the ciphertext.

> The slides state explicitly: **you are NOT required to remember AES implementation details**, but you must be able to explain clearly what the four operations do and their order, and "why it is not a Feistel".

#### 2.3.8 TEA (Tiny Encryption Algorithm)

- 64-bit block, 128-bit key, 32 rounds (the number of rounds is variable), assumes 32-bit arithmetic.
- `delta = 0x9e3779b9` (the golden ratio constant, the "magic number").
- Each round updates L and R at the same time, using `+/-` instead of XOR → "almost Feistel".
- Advantages: extremely simple, fast, low memory requirement.
- Weakness: **equivalent keys** (4 different keys that all give the same ciphertext), effective key 2¹²⁸ → 2¹²⁶; and X-box type attacks.
- The slides: **you are not required to remember the implementation**, but you must understand the design trade-off of "weak round function + many rounds".

#### 2.3.9 Linear cryptanalysis ★

- The only non-linear component of a block cipher is the S-box; the attack idea is to **approximate the non-linear S-box with linear equations**.
- For a given S-box, measure the probability that a linear relation between input and output bits holds, for example:
  - `y1 = x1` holds with probability 3/4;
  - \(y_{0} = x_{0} \oplus x_{2} \oplus 1\) holds with probability 1;
  - \(y_{0} \oplus y_{1} = x_{1} \oplus x_{2}\) holds with probability 3/4.
- The larger the bias, the more usable it is; after propagating along the rounds the subkey can be recovered.
- The DES S-box design means **there is no good linear approximation to any single output bit**, but a linear combination of output bits can still be approximated by a linear combination of input bits; in practice it requires a huge amount of plaintext and is not very practical.

#### 2.3.10 Block cipher modes ★★

**Why modes are needed**: a block is only 64/128 bit while the message is far larger than one block; a new key for each block = as impractical as OTP.

| Mode | Encryption | Characteristics | Problem |
|---|---|---|---|
| **ECB** | `C_i = E(P_i,K)` | simplest; the same plaintext block → the same ciphertext block | ⚔ **cut-and-paste**; pattern leakage (the outline of an encrypted image is still visible) |
| **CBC** | \(C_0=E(IV\oplus P_0,K)\), \(C_i=E(C_{i-1}\oplus P_i,K)\) | the same plaintext block → different ciphertext; the IV is random but not secret | transmission errors only affect limited blocks; **cut-and-paste / malleable still possible** |
| **CTR** | \(C_i = P_i \oplus E(IV+i,K)\) | uses the block cipher like a stream cipher; supports random access | **the IV/nonce must never be reused** (otherwise the XOR of two ciphertexts = the XOR of two plaintexts) |

- ECB cut-and-paste example: plaintext `Eva. pings Bob. Ted. pings Tom.` → the attacker swaps the ciphertext blocks → it decrypts to `Eva. pings Tom. Ted. pings Bob.`.
- ECB image experiment: the encrypted image still keeps the large-scale outline → because the same plaintext block produces the same ciphertext.
- The CBC IV need not be secret, but it must be unpredictable/unique (the slides emphasize random).
- Partial blocks are not covered in this course.

#### 2.3.11 Integrity: MAC ★★

- **Encryption only provides confidentiality, not integrity**: OTP can be flipped at will, ECB can cut-and-paste.
- **MAC = CBC residue**: do CBC encryption, keeping only the final ciphertext block as the MAC (a cryptographic checksum).
  ```
  C_0 = E(IV⊕P_0,K), ..., C_{N-1} = E(C_{N-2}⊕P_{N-1},K) = MAC
  ```
- Send \((IV, P_0\\dots P_{N-1}, MAC)\); the receiver recomputes and compares.
- Why it can detect tampering: changing any `P_i` propagates along the chain to the final MAC; without K a new MAC cannot be forged.
- **Encryption and MAC use different keys**: the same key + sending the final ciphertext block as the MAC a second time adds no security; different keys (even related ones) work.
- Cost: about 2× the encryption work; optimization can bring it down to about 1.5×; **AE (authenticated encryption)** is the research direction.
- Conceptual distinction: **MAC ≠ signature** (in a MAC both parties share the key, so there is no non-repudiation; a signature uses the private key and provides non-repudiation, see W3).

#### 2.3.12 Quantum computing and symmetric ciphers

- A qubit can be in a superposition state; but building the machine and programming it are both extremely hard, and the results are probabilistic.
- **Grover's algorithm**: a square-root speedup for exhaustive search → the work factor of an n-bit key drops from \(2^n\) to about \(2^{n/2}\).
- Countermeasure: **double the key length** (AES-128 → AES-256), the cost being only "a little slower".
- Conclusion: quantum computing is **not a fatal threat** to symmetric ciphers (contrast RSA/DH, see W3).

---


### W3 Public key cryptography (public key crypto)

**In one sentence**: use a "trapdoor one-way function" to solve key distribution and non-repudiation; but public key algorithms are slow and limited in message length, so real systems are a hybrid of "public key to establish a key + symmetric key crypto to encrypt data", with PKI binding identity to public keys.

#### 2.4.1 Core idea ★

- Based on a **trapdoor one-way function**: easy to compute in one direction, hard to compute in the other; if you know the trapdoor (the private key), the reverse direction becomes easy.
- A classic one-way function: \(N = p\cdot q\) is easy to compute, but factoring N into p and q is hard.
- Two uses:
  - **Encryption**: encrypt with Bob's public key → only Bob's private key can decrypt.
  - **Signature**: "encrypt" with the private key → anyone can verify by "decrypting" with the public key; only the holder of the private key could have signed.

#### 2.4.2 RSA ★★

**Key generation**
1. Choose two large primes p and q; \(N = p\cdot q\).
2. Choose e relatively prime to `(p−1)(q−1)`.
3. Find d such that \(e\cdot d \equiv 1 \bmod (p-1)(q-1)\).
4. Public key `(N, e)`; private key `d` (p and q must be destroyed/kept secret).

**Encryption and decryption**
- \(C = M^e \bmod N\)
- \(M = C^d \bmod N\)

**Security**: if the attacker can factor N = p·q, he can use e to find d → **factoring the modulus breaks RSA**.

**Simple example**: p=11, q=3 → N=33, φ=20; e=3 → d=7.
- M=8: \(C = 8^{3} \bmod 33 = 512 \bmod 33 = 17\); \(M = 17^{7} \bmod 33 = 8\).

**RSA numbers**: RSA Labs published semiprimes with 100 to 617 decimal digits; as of 2018-08, 20 of the 54 have been factored; RSA-100 (330 bit) is the easiest challenge, and no one can break RSA-2048 yet.

**Efficiency**
- Computing \(M^e\) directly and then taking the modulus produces astronomically large numbers → **mod after each step + repeated squaring**.
- Example: 5²⁰ mod 35: 5¹→5, 5²→25, 5⁵→10, 5¹⁰→30, 5²⁰→25; no huge intermediate values are produced.
- You can precompute a table of the commonly used powers.
- **Message length is limited**: a 2048-bit RSA key can encrypt at most about **245 bytes** of plaintext; do not "cut messages into chunks" (size increase + slow).

**Hybrid encryption (hybrid)** ★
- Public key crypto is only used to establish/wrap a symmetric key; the data is encrypted with symmetric key crypto (AES).
- SSL/TLS and OpenPGP both do this.
- But certificates are still needed to settle "whose public key is it".

#### 2.4.3 Diffie–Hellman key exchange ★★

- Purpose: establish a shared symmetric key over an insecure channel; **not for encrypting or signing**.
- Public parameters g and p; Alice's private exponent a, Bob's private exponent b.
  - Exchange \(g^a \bmod p\) and \(g^b \bmod p\).
  - Alice computes \((g^b)^a = g^{ab}\); Bob computes \((g^a)^b = g^{ab}\); the shared key is \(K = g^{ab} \bmod p\).
- Security is based on the **discrete log problem**: given \(g, p, g^k \bmod p\), finding k is very hard.
- ⚠ The attacker sees \(g^a\) and \(g^b\), but \(g^a\cdot g^b = g^{a+b} \neq g^{ab}\).
- ⚔ **Man-in-the-middle (MiM) attack**: Trudy shares \(g^{at}\) with Alice and \(g^{bt}\) with Bob separately, and neither side knows.
  - Root cause: DH itself has **no authentication**.
  - Fix: authentication (certificates/signatures/pre-shared keys), see PKI.

#### 2.4.4 Digital signature and non-repudiation ★

- Sign with the private key: `S = [M]Alice`; anyone verifies with Alice's public key.
- Provides **integrity + authentication + non-repudiation**.
- **Why a symmetric MAC cannot provide non-repudiation**: Alice and Bob share K, so Bob could also forge the MAC, and it cannot be proven to a third party that Alice placed the order.
- Precondition for signatures: the private key has not been leaked/stolen.

#### 2.4.5 PKI and certificates ★

- Problem: how can the recipient know with certainty that "this public key really belongs to someone"?
- Solution: a **CA (Certificate Authority)** acts as a trusted third party and issues a **digital certificate** (name + public key + other info, signed with the CA's private key).
- Verification: verify the signature with the CA's public key → confirm the certificate's integrity → trust the public key in the certificate.
- **X.509** common fields: Version, Serial Number, Signature Algorithm, Issuer Name, Validity Period, Subject Name, Subject Public Key, Issuer/Subject Unique ID, Extensions, Digital Signature.
- **Life cycle**: key pair generated → certificate issued → key pair in use → expires/private key compromised → revoked (CRL) → re-certify/new key pair generated.
- **Why trust a CA**: root CAs are pre-installed in your OS/browser/application and updated with normal system updates; identity verification relies on real-world measures, not cryptography.
- **PKI = everything needed to use public keys**: key generation and management, CAs, CRLs, etc.; there is no general standard; three trust models: monopoly model (a single/very few CAs), oligarchy model (a few CAs, the most common approach), everyone-is-a-CA (the web of trust idea).

#### 2.4.6 Hash functions ★★

**Uses**: when signing a big message, sign the fingerprint `h(M)` first (efficiency); integrity; password storage; hash chains; PoW.

**Security properties** (must memorize)
1. **Compression**: any length → fixed n-bit.
2. **Efficiency**: easy to compute.
3. **One-way (preimage resistance)**: given y, it is infeasible to find an x such that `H(x)=y`.
4. **Weak collision resistance (second preimage)**: given x, it is infeasible to find y≠x such that `H(y)=H(x)`.
5. **Strong collision resistance**: infeasible to find any pair y≠x such that `H(y)=H(x)`.

**Birthday problem** ★
- Someone in the class has the same birthday as "me": **253** people are needed (pre-birthday, corresponds to weak collision).
- Any two people have the same birthday: only **23** people are needed (birthday, corresponds to strong collision).
- Generalization: for an N-bit hash, about \(2^{N/2}\) tries are enough to find a collision.
- Corollary: **an N-bit hash has only N/2 bits of security**; an N-bit symmetric key has about N bits.
  - 128-bit hash → 2⁶⁴ work is enough to break collision resistance.

**Common algorithms**
- **MD5**: 128-bit output, collisions are easy to find → broken.
- **SHA-1**: 160-bit, inner workings similar to MD5, crack-able since 2005.
- SHA-224/256/384/512, etc.
- Internal structure: **Merkle–Damgård**: a fixed compression function + block-by-block iteration, where the previous block's output feeds into the next block; no key involved, similar to a block cipher.
- **Avalanche effect**: the outputs of `MD5("...dog")` and `MD5("...dog.")` are completely different.

**Clever uses of hashing**
- **Password hashing + salt** (see W7): `y = h(password, s)`, store `(s,y)`; the salt is not secret, but it forces the attacker to recompute for each user.
- **Hash chains**: 24 classes, class 1 gets `Hash²³(t)`, class d gets \(Hash^{24-d}(t)\), the last class gets t; one-wayness guarantees that future values cannot be inferred from the current value → one-time password/token.
- **Anti-spam PoW**: require the first N bits of `h(M,R,T)` to be zero; the sender needs \(2^N\) hashes on average, the recipient needs 1 verification; N is tunable.
- Blockchain PoW comes from the same idea (mentioned in w1).

**Quantum computing**
- **Shor's algorithm** (1994) can efficiently factor large integers and solve discrete logs → **RSA/DH will fail**.
- 2048-bit modulus: the number field sieve ≈ 125-bit symmetric key strength; Shor ≈ 30-bit.
- Bottom line: symmetric ciphers + longer keys survive; public key needs **post-quantum crypto** (e.g., NTRU).

---

### W4-A Malware (malware)

**In one sentence**: the goal of malicious code is "get the attacker's code running on your machine"; propagation (worm/virus/trojan/backdoor) and detection (signature/behavior/clustering) form another arms race.

#### 2.5.1 Types (no standard definition) ★

| Type | Key feature | Propagation |
|---|---|---|
| **Worm** | self-replicating, active propagation | spreads automatically by exploiting vulnerabilities |
| **Virus** | modifies host programs/boot sector, passive propagation | attaches to files, runs with the program |
| **Trojan horse** | disguised as legitimate software, contains unexpected functionality | user installs it voluntarily; does not duplicate itself; usually remotely controllable |
| **Trapdoor / backdoor** | a hidden entry point that bypasses normal authentication | plants a backdoor |
| **Ransomware** | encrypts the victim's data and demands a ransom | often combined with phishing/exploits |

#### 2.5.2 Worm case studies ★

**Morris Worm (1988-11-03)**
- Robert Morris, a 23-year-old doctoral student from Cornell; a program of about **99 lines**; it almost disabled the Internet of the time.
- Entry points:
  1. **buffer overflow** in `fingerd` and `sendmail`;
  2. guessing weak passwords (a list of common passwords).
- The flaws were well-known but not widely patched.
- Damage mechanism: **exponential propagation** + repeated infection causes machines to lose response → violates **Availability**.
- Impact: greatly raised security awareness.

**SQL Slammer (2003)**
- A single **376-byte UDP package** is enough to propagate; it infected **75,000** systems in 10 minutes.
- Exploits a bug in database software; the patch had been released **6 months** earlier.
- At its peak, infections doubled every **8.5 seconds**; it "burned out" because it spread too fast and exhausted available bandwidth.

#### 2.5.3 Viruses and PE files ★

- The Windows executable file format is **PE (Portable Executable)**.
- Infection steps:
  1. modify the PE header;
  2. attach a "malicious" code section to the PE file;
  3. redirect execution to the malicious section.
- Viruses can live in: the boot sector (takes control before anything else), applications, library routines, and compilers/debuggers/virus checkers (particularly nasty).

#### 2.5.4 Trojans and the supply chain ★

- **Mac Trojan**: `freeMusic.mp3` is actually an application, not data; after double-clicking, iTunes opens (expected) + wild laugh/message box (not expected); it could do anything the user could do (delete files, download files, launch apps).
- **Android repackaging**: download a popular app → decompile → insert malicious code → repackage and distribute.
- **Backdoor**: listens on a port, bypasses local password authentication, and provides remote access.
- **Reflections on Trusting Trust** (Ken Thompson, 1984 Turing Award):
  - a malicious compiler can plant a backdoor at compile time while the source code looks completely clean.
  - Real-world case: **XcodeGhost (2015)** — developers downloaded Xcode from unofficial channels.
  - Conclusion: a **root of trust** problem; auditing the source code alone is not enough to fully trust a binary.

#### 2.5.5 Ransomware

- Uses lightweight symmetric key crypto (TEA/Twofish/Blowfish…) to encrypt the victim's data.
- Detection idea: **pattern matching delta** (the regular change that the encryption process makes to file contents).

#### 2.5.6 Detection methods ★★

| Method | Approach | Advantages | Disadvantages |
|---|---|---|---|
| **Static signature** | search files for signature strings/wildcards/hashes; e.g. `83EB 0274...` for W32/Beast | effective on "ordinary" malware; minimal burden for users; the most popular | signature file can be large, making scanning slow; must be kept up to date; cannot detect without a signature on hand; some advanced types of malware evade it |
| **Dynamic behavior** | monitor for anything "unusual": unexpected file access, system misbehavior, unexpected network activity | can detect unknown malware with no signature on hand | must first define "normal", and normal can change; accuracy?; the attacker can make "abnormal" behavior look normal (being slow to attack); usually combined with signature detection |
| **Malware clustering** | compare with known families/samples (VirusTotal, etc.) using similarity, clustering, embedding | speeds up analyzing millions of unknown samples; reveals the same author/the same toolkit | not a detection method itself; depends on the quality of the sample database |

- Behavior analysis example: Android logs **system call sequences** (`fread("passwordFile")` → `sendmsg(...)`); the hard part is that the content being sent out with `sendmsg` is not visible → static analysis.
- In-browser mining: a large amount of hashing computation in WebAssembly → pinpoint "mining" operations during runtime.
- Practical execution environments: VM, sandbox, hardware support; malware can do **sandbox evasion** (check whether it is in a virtual environment, e.g. "Red Pill").

#### 2.5.7 Arms race: encryption / metamorphism ★

- **Encrypted malware**: different key → different "random" bytes → no common signature.
  - Detection: scan for the **decryptor code** (still a signature); dump the decrypted code during runtime.
- **Metamorphic**: mutates before infecting a new system.
  - Process: disassemble itself → insert random variations (permute the code, insert dead code) → assemble the resulting code.
  - Same functionality, different signature → signature-based detection fails.
- Trends: encrypted, polymorphic, metamorphic, obfuscation/diversification; malware has become an "ecosystem", and malware development is moving toward "software engineering practice".

---

### W4-B Reverse engineering (reverse engineering)

**In one sentence**: without source code, recover "what the program is doing" from executable files; it is the basis of almost all software security missions, and compilation is a "many-to-one", irreversible mapping.

#### 2.6.1 Forward vs. reverse engineering

- **Forward engineering**: requirement analysis → design → implementation → testing → delivery (waterfall model).
- **Reverse engineering**: take something apart and analyze its workings in detail, gradually recovering its more "abstract" and high-level representation and intention.
- Where it fits in security:
  - Software reverse engineering: the basis of almost ALL software security missions (attacker/defender don't have source code).
  - Protocol reverse engineering: mostly well-established in network security (intercept the traffic → reverse the package structure: Header/Length/Checksum/Command/Data).
  - Algorithm/model reverse engineering: emerging field (magic number, statistically analyze a large number of pairs of queries, DNN reverse engineering).
  - Hardware reverse engineering.

#### 2.6.2 Toolchain and concepts ★

```
Source code --compiler--> Assembly --assembler--> Executable
Executable --disassembler--> Assembly
Executable --decompiler--> Source code (the decompiler contains a disassembler)
```
- **Disassembler**: executable files → CPU assembly instructions.
- **Decompiler**: executable files → source-code-level representation.
- Commercial tools: IDA Pro, JEB3, Hopper; open source: **Ghidra** (open-sourced by the NSA).

#### 2.6.3 Compilation is a "one-way function" ★

- Several different source codes can compile into the same piece of machine code:
  ```c
  if (x != 0) x = 0;
  x = 0;
  if (x==1) ... else if ... else x=0;
  ```
  all of them may generate the same machine code → **the "original source code" cannot be uniquely recovered**.
- But for comprehension or reuse, any semantically equivalent version is acceptable.

#### 2.6.4 Disassembly: linear vs. recursive ★★

- **Linear disassembling**: starts from the first byte in the code section and decodes each byte until the end.
  - Problem: the compiler can **embed data** into the code section (e.g., jump tables, constants); linear disassembling mistakes data for instructions.
- **Recursive disassembling**: follows control transfers (jmp/call/ret) and only disassembles reachable code.
  - Handles the "embedding" case correctly (e.g., `inst1; jmp data; inst3...`).
  - The CPU also executes along the control flow, so recursive disassembly is closer to the real semantics.

#### 2.6.5 The modern C/C++ decompilation pipeline ★★

```
Executable
 → Disassembly
 → Variable/Type Recovery
 → Control-Flow Recovery
 → Optimization
 → Code Generation
 → Decompiler Output
```

- **Variable recovery**: divide the whole memory space into variable regions (which bytes are always accessed together → one variable).
- **Type recovery = type inference**:
  - `b = *a` → a is a pointer;
  - `printf("%d", a)` → a is an integer;
  - `fopen(a, "r")` → a is a string (file name).
  - In essence, it is a "deductive proof" procedure that gradually constrains the type.
- **Control-flow recovery**: assembly → **CFG (control-flow graph)**, which is the pre-requisite to recover `if/while/for`.
- **Code generation**: pattern matching + concretize code templates (recognize "this should be a for loop").

#### 2.6.6 Practical bugs of decompilation ⚠

Commercial decompilers still make mistakes in variable/type recovery; typical bugs:
- **Unreachable loop**: `for (i=6; i<-12; i-=6)` is unreachable in the original program, yet the decompiled output makes it reachable/iterated many times.
- **Shift/truncation**: `(uint8_t)a >> (uint8_t)6` is recovered incorrectly, so the value of a differs.
- **Integer width**: `int32_t a = 0xaaaaffff` is recovered as `int16_t`, so the result of `a+4` differs.

#### 2.6.7 Case study: serial number cracking (software crack) ★

1. The program requires a serial number and exits if it is wrong.
2. Disassemble → find the comparison: `cmp` on the user input and a hardcoded string → `S123N456` is visible directly, and entering it passes.
3. Go further: instead of finding the serial number, directly **patch** the jump instruction (change the conditional jump to an unconditional one/NOP), or edit the bytes with a hex editor → any serial number now passes.
4. Tools needed: only a disassembler; for a remote attack, trial-and-error guessing of addresses may be needed.
5. Conclusion: **impossible to prevent SRE on an open system**; you can only raise the cost.

#### 2.6.8 Anti-reverse-engineering measures

- **Anti-disassembly**: embed data with code to trap linear disassembling.
- **Code obfuscation**: make code more difficult to understand (see W5).
- **Encryption / packer**: pack the binary and de-pack at runtime.

---


### W5-A Buffer Overflow

**In one sentence**: C/C++ does no bounds checking, so an over-long input can overwrite the return address on the stack, thereby hijacking control flow and executing arbitrary code; defense works on several fronts at once — "non-executable stack, canary, ASLR, safe languages".

#### 2.7.1 The vulnerability spectrum

- Bugs that can be potentially exploited: null pointer dereference, UAF, double free, array indexing errors, stack/heap overflow, return pointers to local variables, uninitialized variables, invalid use of negative values, passing large parameters by value, underallocations, memory/file handle/network resource leaks, unhandled return codes, use of invalid iterators…
- ⚠ **Not all bugs are exploitable**; a logic bug that is not exploitable does not constitute a vulnerability.
- Common high-risk ones: **buffer overflow, format string, integer overflow, UAF, type confusion, race condition**.

#### 2.7.2 Memory layout and stack frames ★★

- Process memory (Linux; Mac/Windows are very similar): text (code), data, bss, heap (grows toward high addresses), stack (grows toward low addresses).
- A stack frame, from high addresses to low addresses:
  ```
  High address
  ┌────────────────────┐
  │ parameters a, b    │
  ├────────────────────┤
  │ return address     │  ← overflow target
  ├────────────────────┤
  │ saved FP           │
  ├────────────────────┤
  │ local variables    │
  │ char buf[10]       │  ← start of the write
  └────────────────────┘
  Low address         SP
  ```
- When a function is called, the return address, the frame pointer, and the local variables are pushed on the stack; **the stack grows toward low addresses while the buffer is written toward high addresses** → an overflow overwrites saved FP first, then **ret**.

#### 2.7.3 The two kinds of "out-of-bounds" ★

- **Buffer overread**: reading beyond the buffer → leaking adjacent memory (e.g., **Heartbleed** reading OpenSSL memory).
- **Buffer overwrite**: writing beyond the buffer → tampering with adjacent data/return address.

#### 2.7.4 How the overflow attack works ★★

- Simple scenario: next to `char buffer[N]` there is a `boolean flag` (the password-correct flag); an over-long input overwrites the flag → any password is accepted.
- Stack overflow:
  - Overwrite ret → the program "returns" to the wrong location → a crash (DoS);
  - Worse: make ret point to **injected malicious code** (shellcode) → arbitrary code execution.
- Also known as: stack smashing, buffer overrun, code injection, control-flow hijacking.
- Preconditions: a buffer overflow must actually exist in the code; **not all buffer overflows are exploitable**; trial and error is usually needed to guess the address, but "one success is enough".
- ⚠ Making the buffer "grow toward high addresses" does not solve the problem (the slides say "see my notes").

#### 2.7.5 Unsafe C library functions ★

`strcpy`, `gets`, `strcat`, `scanf`, `sprintf` … The common point: **the length of the destination buffer is not checked**.

#### 2.7.6 Exploitation steps (the serial case) ★

1. Feed an over-long `A` (0x41) and observe the crash → determine the offset at which ret is overwritten.
2. Disassemble the code to find the address you want to jump to (e.g., `0x401034`, which bypasses the check).
3. Write the address in reverse byte order according to **little-endian**: `0x401034` → bytes `34 10 40 00` → ASCII `"4^P@"` (0x40='@', 0x10=^P, 0x34='4').
4. Construct the payload: padding + target address (+ optional NOP sled + shellcode).
5. Successfully bypass the serial number check.

#### 2.7.7 Defense ★★

| Defense | Mechanism | Limitation |
|---|---|---|
| **W^X / DEP** | Stack/heap non-executable (write XOR execute); supported in Windows, code patches exist for Linux | Self-modifying code and JIT need writable/executable memory |
| **Canary (stack canary)** | A value placed in front of ret, checked before the function returns; the constant `0x000aff0d` or a runtime random value | Not fool-proof; some attacks can bypass it or leave the canary untouched; about 8% performance penalty for Web servers |
| **ASLR** | Randomizes the stack, the base of the executable, etc. | Can be guessed by brute force (32-bit entropy is low); code can be injected by **spraying**; must be combined with other defenses |
| **Safe languages** | Automatic bounds checking in Java/C#, etc. | Requires rewriting/migration; performance and compatibility |
| **Safe functions** | Use the versions with a length parameter; additional length checks | Depends on the developer using them correctly |

> The modern combination: ASLR + canary + NX + PIE + CFI; attackers bypass it with info leaks, ROP/JOP (the slides only hint at "and even more later").

---

### W5-B Software Obfuscation

**In one sentence**: under the "malicious host" assumption, obfuscation raises the cost of reverse engineering by changing the form of the code (layout, data, control flow); it cannot achieve absolute security, it can only make the cost of attack higher than the payoff.

#### 2.8.1 Motivation and premises ★

- Software contains highly informative code: MSIL for .NET, bytecode for Java/JS/Python, binary code for C/C++.
- Code can be exploited: non-malicious RE (testing, integration, extending); malicious RE (security attacking, piracy); malware authors also want to evade clustering/similarity analysis.
- **Mobile code + malicious hosts**: the code runs on someone else's machine, and the host is not trustworthy.

#### 2.8.2 Why existing protection is not enough ⚠

| Approach | Problem |
|---|---|
| Hardware isolation | Retrofit hardware is needed; not viable |
| Server-side execution | Requires always-on high bandwidth; authentication and other network security problems also need to be taken care of |
| Encryption | Chicken-egg problem: the decryption routine itself is visible |

#### 2.8.3 Goal and limits ★

- Making protected software "look" dissimilar to its original version; **determining the similarity of two pieces of code** is the building block of many software security analyses.
- It **can never completely** protect an application from malicious RE: given sufficient time/resources, any obfuscated code can be reversed (exhaustive search).
- The right goal: **make the cost of undoing it too expensive for attackers**.

#### 2.8.4 The three kinds of obfuscation ★★

**1) Layout obfuscation**
- Comment stripping and identifier renaming (classes/methods/variables → meaningless names).
- Commercial tools: DashO (Java), Dotfuscator (MSIL).
- Very lightweight; in the real world plenty of popular apps are not even layout obfuscated.

**2) Data obfuscation**
- Variable splitting/merging/encoding.
- Array splitting, array merging, array folding (to increase the number of dimensions), array flattening (to decrease the number of dimensions).
- Data encryption (e.g., string encryption, very common in mobile apps).

**3) Control-flow obfuscation** ★
- Premise: layout/data obfuscation does not change the control structure of the program → the control structure can still serve as a "code signature".
- Techniques:
  - **Instruction insertion (garbage code)**: semantically canceling sequences such as `nop`, `add/sub`, `xor/xor`; simple, and breaks known patterns.
  - **Instruction replacement**: replace with an equivalent sequence of instructions; an extreme case is **M/o/Vfuscator**, which compiles C/C++ programs into "mov"-only programs.
  - **Control flow flattening**: put all basic blocks into a `switch(x)` dispatcher driven by the state variable x; the original CFG is "flattened".
  - **Opaque predicates**: the value of the conditional expression is known at runtime, but difficult for static analysis to deduce.
    - Example: `if (x*x + y*y >= 2*x*y)` is always true (but not so obvious); in assembly it is even less obvious.
    - Types: invariant, context, multi-threading (one thread only puts in numbers >n, another thread takes one of them → `x<n` is always false).
    - The opacity property determines the resilience of control-flow transformations.

**Advanced**
- **VM-based obfuscation**: a custom instruction set + secret encodings + a virtual CPU/dispatcher; it has been commercialized; not a fool-proof technique, but it makes analysis significantly more difficult.
- **Multilingual obfuscation**: mixing different computation models (imperative = Turing machine; functional = lambda calculus; logic = Horn logic); after compilation the machine code is harder to understand.

#### 2.8.5 Evaluating obfuscation effectiveness ★

| Dimension | Meaning | Measurement |
|---|---|---|
| **Potency** | How much complexity the obfuscation introduces | Software complexity metrics such as the number of call graph edges, basic blocks, and CFG edges |
| **Stealth** | How well obfuscated code blends in with the rest of the code | Instruction distribution anomaly detection |
| **Resilience** | How difficult it is to undo the obfuscation | Diffing techniques to compare the similarity between the obfuscated and original binaries |
| **Cost** | Performance penalty | Size, execution slowdown |

#### 2.8.6 Why "good" obfuscation is hard to design ⚠

- Coming up with "interesting" obfuscation mutations is not too difficult, it requires some creativity; coming up with "secure" obfuscation mutations is very difficult.
- Especially when the method is public and the attacker already knows your scheme.
- Open design + no real secret + limited search space → not strong in principle (an echo of Kerckhoffs).

---

### W6-A Software Exploitation II

**In one sentence**: besides stack overflow, UAF/double free on the heap, format strings on the stack, and SQL injection at the database layer are all different manifestations of "input validation/lifecycle management failure".

#### 2.9.1 Memory vulnerability map

| Vulnerability | Location | Root cause |
|---|---|---|
| Buffer overflow | Stack/heap | Out-of-bounds write |
| **Use-after-free** | Heap | Continued use after freeing |
| **Double free** | Heap | The same block freed twice |
| **Type confusion** | Heap | Treating an object as another type |
| **Format string** | Stack | The user controls the format string |
| **SQL injection** | Database | Input pasted into the query |

#### 2.9.2 Heap basics ★

- Heap: where dynamically allocated memory resides; C `malloc/free`, C++ `new/delete`.
- Memory allocated from the heap remains allocated until the program terminates or an explicit `free/delete`.
- **Memory leak**: allocate without freeing → resource abuse, which can lead to a crash/lost response → breaks **Availability**.
- Programmers need to take care of the lifecycle themselves → a breeding ground for bugs.

#### 2.9.3 Use-After-Free ★★

- Flaw: after `free(p)` the program still reads and writes through `p`, treating the freed memory as valid.
- Exploit: right after the free, allocate a new object of **the same size** → the new object occupies the same block of memory → write through the dangling pointer and tamper with the new object's fields (e.g., function pointer/vtable) → control-flow hijacking/arbitrary code execution.
- Case (Protostar heap2, PoC):
  - Normal flow: create user → login → specify service → cleanup.
  - Attack flow: create user → cleanup (free) → specify service (reuses the same chunk and writes "you have logged in already!") → login reads the old pointer → "already logged in" without authentication.
  - `strdup` allocates a chunk on the heap, which is the key to the reuse.
- Why it is difficult for fuzz testing to detect: **complexity + saliency** — it needs a specific allocation/free sequence.
- Prevention: set the pointer to **NULL** after freeing; use smart pointers.

#### 2.9.4 Double Free ★

- The same block of memory is freed twice → the heap metadata is corrupted.
- Attack: deliberately construct the allocation/deallocation chain so that the second free parses "user data" as metadata → arbitrary address write/control-flow hijacking.
- Prevention: set the pointer to NULL after freeing (the most direct).

#### 2.9.5 Format string ★★

- `printf(format, ...)`: the format string determines how the subsequent arguments are interpreted (`%d` a value, `%s` a pointer).
- Traditionally, compilers do **not check** whether the arguments match the format string.
- If the user can control the format string:
  - `%s%s%s...` → takes the values on the stack as string addresses → **leaks memory** (can bypass ASLR).
  - `%n` → **writes** the "number of bytes written so far" to the address specified by the argument → **arbitrary memory write**.
- Prevention:
  - Use hard-coded strings with no arguments whenever possible;
  - At least hard-code the format string; no `printf(user_input)`;
  - Do not use `%n`.

#### 2.9.6 SQL injection ★★

- Cause: untrusted input is pasted into SQL:
  ```php
  "SELECT * FROM Users WHERE name='$name';"
  ```
- Input `x' OR 'a'='a` →
  ```sql
  SELECT * FROM Users WHERE name='x' OR 'a'='a';
  ```
  → always true, bypasses authentication.
- Worse: `'; DROP TABLE Students; --` → drops the table.
- **Best defense: prepared statements + bound variables (bound parameters)**.
  - Principle: the SQL statement is first **parsed/compiled** by the database, and the parameters are then combined with the "compiled statement" instead of being concatenated into a SQL string → the input is always treated as data and is never parsed as syntax.
- Auxiliary defenses:
  - Check the syntax of input for validity (email addresses, dates, part numbers, etc. have fixed languages);
  - Length limits (many injections depend on entering long strings);
  - Scan for keywords such as `INSERT/DROP`;
  - **Least database privileges** (a read-only user is granted read permissions only).

---

### W6-B Side Channel

**In one sentence**: instead of exploiting software bugs, it exploits the chain "secret-dependent program behavior → physical environment → observable", inferring the key from execution time, cache, power consumption, EM emissions, sound, and heat.

#### 2.10.1 The three conditions ★★

1. **Secret-dependent program information flow**: the program's behavior differs with the secret.
2. **The information flow affects the physical environment**: time, power consumption, cache status, sound…
3. **The physical environment is observable/exploitable by the attacker**.

> All three are required. Defense can also start from these three links: eliminate secret-dependent branches/memory accesses (constant time), shield the physical signal, limit the ability to observe.

#### 2.10.2 Types

- Timing (execution time), Cache (cache), Power (power consumption), EM (electromagnetic emissions), Sound (sound), Heat (heat).
- Example: a sound side channel can distinguish RSA key bits 0/1 from the humming sound emitted by the CPU (Tromer et al.).

#### 2.10.3 RSA timing side channel ★★

- Scenario: Alice's public key (N,e), private key d; the attacker can send any M and Alice responds with \(M^d \bmod N\) (a signature); the attacker can precisely time the computation.
- Implementation: **square-and-multiply**
  ```
  for bit in d:
      x = x² mod N
      if bit == 1: x = x*M mod N
  ```
- Timing difference:
  - bit = 0: square only (fast);
  - bit = 1: square + multiply (slow).
- One timing trace is enough to read out the sequence of key bits (in practice a considerable number of trials is needed, but there is **no need to factor large numbers**).
- Classic reference: Kocher, "Timing Attacks on Implementations of DH, RSA, DSS, and Other Systems", 1996.

#### 2.10.4 Cache side channel ★★

- Basic principle: **accessing data stored in the cache is measurably faster than accessing the data from main memory**.
- A cache line is the minimal storage unit of a cache, usually **64 bytes**; the low bits of the address are the line offset and the remaining bits are the line index.
- **Flush + Reload**: the attacker first evicts the target cache line from the cache, waits for the victim to run, and then measures the reload time → fast = the victim accessed that line.
- Threat model:
  - Strong: can observe **which particular cache line is accessed**;
  - Weak: can only observe the **hit/miss sequence**, yet can still infer the secret input.
- Relation to RSA:
  - Square-and-multiply: secret-dependent **control flow** → timing/branch leakage;
  - Sliding window: `table[idx]`, a secret-dependent **memory access** → cache leakage.
- Especially dangerous in the era of cloud computing: different VMs share L1/L2 (same core) or L3 (across cores).
- Related big event: **2018 Spectre & Meltdown**.

#### 2.10.5 Power side channel ★

- **SPA (Simple Power Analysis)**: directly interprets the power trace, identifying the operations taking place on the device and the key bits.
  - Assumption: the attacker can get a power trace representing a set of power consumptions across a cryptographic process.
  - One trace is enough to reveal the secret (e.g., 1/0 correspond to different power waveforms).
  - PoC attacks on mobile phones/embedded devices already exist.

> The slides only give high-level ideas for power/cache; advanced content such as DPA, masking, and hiding is not covered (it can serve as an extension).

---

### W7-A Authentication

**In one sentence**: access control = authentication (who you are) + authorization (what you are allowed to do); authentication relies on "something you know / have / are", while the practical weakness of passwords is user choice, and the weakness of biometrics is that they cannot be revoked.

#### 2.11.1 The two parts of access control ★

- **Authentication**: are you who you say you are? (human→machine, or machine→machine)
- **Authorization**: are you allowed to do that? (once you have access, what can you do; enforces limits on actions)

#### 2.11.2 The three authentication factors ★★

| Factor | Example | Characteristics |
|---|---|---|
| **Something you know** | Password, PIN, date of birth, mother's maiden name, pet's name | Free, easy to reset; but weak, guessable, leakable |
| **Something you have** | Smartcard, ATM card, token, cell phone, MAC address | Must be carried/issued; can be lost |
| **Something you are** | Fingerprint, signature, face, voiceprint, gait | Hard to forge; but cannot be revoked, and has an error rate |

**2FA**: any two out of the three (credit card + signature; ATM card + PIN).

#### 2.11.3 Why passwords are popular

- Cost: passwords are free; convenience: it is easier for the sysadmin to reset a password than to issue a new thumb.
- But "passwords are one of the biggest practical problems facing security engineers today".

#### 2.11.4 Keys vs passwords ★

- A 64-bit random key → 2⁶⁴ possibilities, and the attacker needs to try about 2⁶³.
- An 8-character password with 256 options per character → in theory 256⁸ = 2⁶⁴; **but users do not select passwords at random** → the actual space is far smaller than 2⁶³ → **dictionary attack**.
- Dictionary attack: tries only those possibilities which are deemed most likely to succeed (dictionary words, mutations).

#### 2.11.5 Good and bad passwords, and passphrases ★

- Bad passwords: `frank`, `Fido`, `Password`, `incorrect`, `Pikachu`, `88195277`, `AustinStamp`.
- Good passwords: `jfIej,43j-EmmL+y`, `09864376537263`, `0nceuP0nAt1m8`, `P0kem0n`.
- **Passphrase**: 10–30 letters, harder to brute-force, not found in any phrase/quote dictionary, more easily memorable than a random string.
- Experiment (three groups):
  - A: at least 6 characters + 1 non-letter → about **30%** easy to crack;
  - B: based on a passphrase → about **10%** cracked, and easy to remember;
  - C: 8 random characters → about **10%** cracked, but hard to remember.
  - Conclusion: **a passphrase is the better trade-off between security and memorability**.

#### 2.11.6 The password attack surface ★

- Target one particular account / any account on the system / any account on any system;
- **DoS** (e.g., repeatedly entering a wrong password to lock the account → think about the ATM);
- Offline: a dictionary attack after getting the password file;
- Online: guessing, credential stuffing, social engineering, keystroke logging, log leakage.

#### 2.11.7 Password storage: hash + salt ★★

- Passwords cannot be stored in plaintext; but they still need to be verified → store the **hash**.
- Attack: precompute `h(x)` for all x in the dictionary; after getting the hashed password file, just compare → one-time precomputation, after which the attack is trivial.
- **Salt**: a random value s, store `(s, y=h(password,s))`.
  - s is not secret;
  - verification is still easy;
  - but the attacker must **recompute for every user and every salt**, so the precomputed tables fail and the cost rises sharply.
- In practice slow hashes (bcrypt/scrypt/Argon2) should also be used — not covered by the slides, an extension.

#### 2.11.8 Other password issues

- Too many passwords → reuse → one leak compromises everything;
- Failure to change default passwords;
- Social engineering;
- Error logs may contain "almost" passwords;
- Bugs, keystroke logging, spyware;
- Cracking tools: L0phtCrack/LC4 (Windows), John the Ripper (Unix); admins should use them proactively to test for weak passwords.

#### 2.11.9 Biometrics ★

- "You are your key": fingerprint, signature, face, voiceprint, gait.
- **Ideal properties**: Universal (applies to (almost) everyone), Distinguishing (distinguish with certainty), Permanent (the physical characteristic being measured never changes), Collectable (easy to collect the required data); also safe, user-friendly.
  - In reality: no biometric applies to everyone; 100% certainty cannot be hoped for; it is enough if it remains valid for a long time; collection depends on whether subjects are cooperative.
- **Enrollment vs Recognition**:
  - Enrollment: the biometric info is put into the database; it may be slow and require repeated measurement, but must be very precise → it may be a weak point in real-world use (root trust).
  - Recognition: must be quick and simple, while remaining reasonably accurate.
- **Error rates** ★:
  - **Fraud**: the attacker is mis-authenticated as Alice (an impostor is accepted);
  - **Insult**: Alice is not authenticated as Alice (the genuine user is rejected);
  - The two trade off: a 99% match threshold → low fraud, high insult; 30% → high fraud, low insult.
  - **Equal Error Rate (EER)**: the point where fraud = insult, used to compare different biometrics.
  - ⚠ The slides label fraud as "false negative" and insult as "false positive", which is the opposite of the usual terminology; **memorize by the definition**: impostor accepted = fraud, genuine user rejected = insult.
- Biometrics are not foolproof: a thumb can be stolen, a fingerprint/iris can be photocopied, and the software/database/trusted base can be subverted; and a "leaked" fingerprint **cannot be revoked**.

---

### W7-B Network Basics and Security

**In one sentence**: a network is a layered, packet-switched protocol stack; every layer has its own addresses and protocols, and its own attack surface (application-layer spoofing, transport-layer DoS, network-layer IP/NAT, link-layer ARP spoofing).

#### 2.12.1 Basic concepts ★

- Composition: hosts (computer/laptop/server/phone) + an interconnected mesh of routers; the purpose is to transmit data.
- **Packet switching vs circuit switching**:
  - The telephone network is circuit switched: for each call a dedicated circuit is established, which wastes bandwidth.
  - Data networks are packet switched: data is chopped up into packets that are transmitted independently, with no dedicated circuit; more efficient bandwidth usage, but more complex.
- **Protocols**: precisely specify the "communication rules"; the details are given in **RFCs** (essentially Internet standards).
- **Stateless vs stateful**: stateless protocols do not "remember", stateful ones do; many security problems are related to state (e.g., DoS is a problem with stateful protocols).

#### 2.12.2 The five-layer protocol stack ★★

| Layer | Example protocols | Role |
|---|---|---|
| Application | HTTP, FTP, SMTP, DNS | Application semantics |
| Transport | TCP, UDP | End-to-end delivery |
| Network | IP, routing (RIP/OSPF/BGP) | Routing/addressing |
| Link | Ethernet, PPP, 802.11 | Transfer between adjacent nodes |
| Physical | — | Bit stream |

- **Layering in action**: at the source, data goes "down" the protocol stack and each layer adds a header; a router processes a packet only up to the network layer (that is where the routing info lives); the destination processes it "up" to the application layer.
- **Encapsulation**: `(H, (H, (H, (H, X))))`, with the application data on the "inside".

#### 2.12.3 Application layer ★

- **Client-Server**: the client "speaks first" and the server responds; **P2P**: hosts act as both client and server.
- **HTTP**: request/response; **HTTP is stateless**.
- **Cookie**: initially sent from the server, the browser stores it and sends it back on later requests; the server uses a cookie database to "remember" you.
  - Used for: shopping carts, recommendations;
  - A very (very) weak form of authentication;
  - Privacy concerns: a web site can learn a lot about you, and multiple web sites could learn even more (tracking).
- **SMTP**: from the sender to the recipient's mail server; then POP3/IMAP/HTTP is used to get the messages.
  - The commands are **human readable**: `telnet server 25` → `HELO`, `MAIL FROM`, `RCPT TO`, `DATA`, `.`, `QUIT`.
  - ⚔ **Spoofed sender**: `MAIL FROM: <arnold@ca.gov>` can be written at will → email spoofing (a PoC; a real implementation has more checks).
- **DNS**:
  - Domain name → IP (e.g., `cse.ust.hk` → `143.89.41.177`); a distributed database.
  - Resolution: root → TLD (.hk/.org/.edu) → sub-domain, performed recursively.
  - There are only **13 "root" server clusters** worldwide → essentially a single point of failure; attacks on root servers have occurred, but did not last long enough.
  - ⚔ **DNS cache poisoning**: for performance, a server caches translations; if it receives and caches a **false record**, it returns the wrong IP to clients → traffic is diverted to the attacker's machine.

#### 2.12.4 Transport layer ★

- The network layer offers unreliable, "best effort" delivery; any improved service must be provided by the hosts (transport layer).
- **TCP**: reliable, in-order, flow control, connection-oriented (it contacts the server before sending data; a logical connection, not a physical one).
  - Header: source/destination port, sequence number, acknowledgment number, flags (ACK/SYN/RST…), window, checksum, urgent pointer; **20 bytes** when there are no options.
- **Three-way handshake**: `SYN` → `SYN-ACK` → `ACK` (can carry data).
- ⚔ **SYN flooding**:
  - Whenever a SYN packet is received, the server remembers this "half-open" connection → this consumes resources;
  - Too many half-open connections → running out of memory/a crash → it cannot respond to legitimate requests;
  - Root cause: **TCP is stateful**.
- **UDP**: connectionless, low overhead, no guarantee of reliability/ordering.

#### 2.12.5 Network layer ★

- IP: best effort; IP runs in every host and every router; routers also run routing protocols (RIP/OSPF/BGP).
- An IPv4 address is **32 bits**, in dotted decimal notation (`195.72.180.27`, each number between 0 and 255); not enough IP addresses → lots of tricks to extend the address space; a host's IP address can change.
- **Socket = IP + port**, uniquely identifies a process Internet-wide.
  - The port number is 16 bits; below 1024 are "well-known" ports (HTTP is port 80, POP3 is port 110); above 1024 are dynamic.
- **NAT**: use one (or a few) public IP addresses + different port numbers to map multiple internal hosts; it extends the address space and **(implicitly) hides the internal source addresses**.
  - Cost/disadvantage: a **DoS attack is still feasible**; it breaks end-to-end transparency (the slides only emphasize DoS).
  - Example: internal `192.168.0.12:1025` ↔ public `11.0.0.1:4000`, with the NAT table maintaining the mapping.
- ⚔ **Ping flood / Ping of Death**: abuse ICMP echo request/reply; a large volume of ICMP packets overwhelms the victim; but before the attack you may saturate your own bandwidth first.

#### 2.12.6 Link layer ★

- Implemented in the adapter, the Network Interface Card (NIC); the NIC is "semi-autonomous" and (mostly) out of the host's control; it implements both the link and physical layers.
- **MAC address**: 48 bits, globally unique; used to forward packets over one link.
  - Analogy: an IP address is like your home address, a MAC address is like a social security number.
- **ARP**: given an IP address, find the corresponding MAC address; each host has an ARP table, or ARP cache, which is generated automatically and whose entries expire after about 20 min; ARP is **stateless**.
- ⚔ **ARP cache poisoning**:
  - The attacker actively sends a forged ARP reply (e.g., "the MAC address of 111.111.111.002 is CC-CC-...");
  - Both caches are poisoned → traffic goes through the attacker → **man-in-the-middle**.

#### 2.12.7 Attack surface summarized by layer ★

| Layer | Attack | Defense direction |
|---|---|---|
| Application | SMTP spoofing, DNS poisoning, Cookie privacy | Authentication (SPF/DKIM), DNSSEC, privacy policy |
| Transport | SYN flood | SYN cookies, rate limiting, firewall |
| Network | IP spoofing, Ping flood, NAT evasion | Ingress filtering, rate limiting |
| Link | ARP poisoning | Static ARP, DAI, encryption |

---

## 3. Cross-cutting threads

### 3.1 Attack ↔ defense ↔ CIA table

| Attack | Week | Breaks | Key defense |
|---|---|---|---|
| Frequency analysis on classical ciphers | w1 | C | OTP/strong cipher |
| DES exhaustive key search | w2 | C | AES/long key |
| ECB cut-and-paste | w2 | I | CBC/CTR + MAC/AE |
| CBC bit flipping | w2 | I | MAC/AE |
| RSA factoring / side channel | w3/w6 | C | long key, constant time, blinding |
| DH MiM | w3 | C/Auth | certificates, signatures, authenticated DH |
| Hash collision | w3 | I | SHA-256/512, longer output |
| Worm/virus/Trojan | w4 | A/C/I | patches, signature + behavior detection, sandbox |
| Reverse engineering/cracking | w4 | IP/auth | obfuscation, packing, anti-debugging |
| Stack overflow | w5 | C/I/A | NX, canary, ASLR, safe languages |
| UAF/double free | w6 | C/I/A | set to NULL, smart pointers, GC |
| Format string | w6 | C/I | hard-coded format string, disable %n |
| SQL injection | w6 | C/I | prepared statements, least privilege |
| Timing/cache/power side channel | w6 | C | constant time, blinding, isolation |
| Password dictionary/credential stuffing | w7 | C | long passphrase, salt, slow hash, 2FA |
| Biometric forgery | w7 | C | multi-factor, liveness detection, revocable credentials |
| SMTP spoofing/DNS poisoning/ARP poisoning/SYN flood | w7 | C/I/A | authentication, DNSSEC, DAI, SYN cookies |

### 3.2 Number quick-reference table ★

| Number | Meaning |
|---|---|
| 26! ≈ 4.03×10²⁶ > 2⁸⁸ | Key space of a general monoalphabetic substitution |
| 2⁵⁶ | DES key space (56 bit effective) |
| 2⁵⁷ | Cost of double encryption (2DES `E(E(P,K1),K2)`) after the meet-in-the-middle attack; 3DES switched to EDE precisely to avoid this |
| 2¹¹² | Effective strength of two-key 3DES |
| 2¹²⁶ | Effective strength of TEA after equivalent keys |
| 10/12/14 | Number of rounds of AES-128/192/256 |
| 245 bytes | Largest plaintext 2048-bit RSA can encrypt (PKCS#1 v1.5) |
| \(2^{N/2}\) | Cost of finding a collision for an N-bit hash |
| 23 / 253 | Number of people for the birthday problem / the pre-birthday problem |
| 64 bytes | Typical cache line size |
| 99 lines | Size of the Morris Worm code (1988-11-03) |
| 376 bytes / 75,000 / 8.5 seconds | SQL Slammer packet size / number infected in 10 minutes / doubling time |
| 0x000aff0d | Classic canary constant |
| 8% | Performance penalty of the canary for Web servers |
| 1.5× | Optimized overhead of encryption + MAC |
| 13 | Number of DNS root server clusters |
| 32 / 16 / 48 bit | IPv4 address / port / MAC address |
| 20 bytes | TCP header without options |
| ~20 minutes | ARP cache expiry time |
| 0x9e3779b9 | TEA delta constant |

### 3.3 Easily confused concepts ⚠

| A | B | Difference |
|---|---|---|
| Encryption | MAC/signature | Encryption provides confidentiality; MAC/signature provides integrity; only a signature provides non-repudiation |
| MAC | Digital signature | MAC is symmetric and either party can forge it; a signature is asymmetric and only the private-key holder can sign |
| Hash | Encryption | A hash is keyless, one-way, fixed-length; encryption is reversible and keyed |
| weak collision | strong collision | Given x, find y; find any pair |
| stream cipher | block cipher | bit/byte vs block; a generalization of OTP vs a codebook |
| ECB | CBC | Independent encryption vs chaining; whether identical plaintext blocks produce identical ciphertext |
| 3DES EDE | EEE | EDE can be backward compatible with single-key DES |
| worm | virus | Actively self-propagating vs passively propagating by attaching to a host |
| trojan | backdoor | Disguised as normal software vs a hidden entry point that bypasses authentication |
| linear disassembly | recursive disassembly | Sequential decoding vs walking along the control flow |
| disassembler | decompiler | To assembly vs to source code |
| UAF | double free | Use after free vs free twice |
| fraud | insult | Impostor accepted vs genuine user rejected (they trade off; the equal point is the EER) |
| authentication | authorization | Who you are vs what you can do |
| stateful | stateless | Remembers state (prone to DoS) vs does not remember state |

### 3.4 Chinese–English terminology

| Term | English |
|---|---|
| Confidentiality/Integrity/Availability | Confidentiality / Integrity / Availability |
| Threat model | threat model |
| Attack surface | attack surface |
| Least privilege | least privilege |
| Open design | open design |
| Minimizing mechanisms | economy of mechanism |
| Plaintext/ciphertext/key | plaintext / ciphertext / key |
| Exhaustive key search | exhaustive key search |
| Frequency analysis | frequency analysis |
| One-time pad | one-time pad (OTP) |
| Stream cipher/block cipher | stream cipher / block cipher |
| Keystream | keystream |
| Round function/subkey | round function / subkey |
| Mode of operation | mode of operation |
| Initialization vector | initialization vector (IV) |
| Message authentication code | message authentication code (MAC) |
| Authenticated encryption | authenticated encryption (AE) |
| Trapdoor one-way function | trapdoor one-way function |
| Meet-in-the-middle attack | meet-in-the-middle attack |
| Man-in-the-middle attack | man-in-the-middle (MiM) |
| Public key infrastructure | public key infrastructure (PKI) |
| Certificate revocation list | certificate revocation list (CRL) |
| Non-repudiation | non-repudiation |
| Preimage/collision | preimage / collision |
| Avalanche effect | avalanche effect |
| Malware | malware |
| Worm/virus/Trojan/backdoor | worm / virus / trojan / backdoor |
| Ransomware | ransomware |
| Metamorphic/polymorphic malware | metamorphic / polymorphic malware |
| Reverse engineering | reverse engineering |
| Disassembler/decompiler | disassembler / decompiler |
| Control flow graph | control flow graph (CFG) |
| Buffer overflow | buffer overflow |
| Stack canary | stack canary |
| Address space layout randomization | ASLR |
| Write XOR execute | W^X / DEP |
| Use after free | use-after-free (UAF) |
| Double free | double free |
| Format string | format string |
| SQL injection | SQL injection |
| Side channel | side channel |
| Cache line | cache line |
| Simple power analysis | simple power analysis (SPA) |
| Authentication/authorization | authentication / authorization |
| Passphrase | passphrase |
| Salt | salt |
| Biometrics | biometrics |
| False accept rate/false reject rate | fraud rate / insult rate |
| Equal error rate | equal error rate (EER) |
| Two-factor authentication | two-factor authentication (2FA) |
| Packet switching | packet switching |
| Encapsulation | encapsulation |
| Socket | socket |
| Network address translation | NAT |
| Address Resolution Protocol | ARP |
| Denial of service | denial of service (DoS) |

---

## 4. Self-test checklist (pass if you can answer without the notes)

### w1
1. What are the three parts of CIA? Give one attack example for each.
2. Give three examples each of "design causes" and "implementation causes" of vulnerabilities.
3. Which three questions must a threat model answer? Illustrate with a cloud platform.
4. What are the three principles of Saltzer & Schroeder? What problem does each solve?
5. Why is OTP provably secure? What are its three conditions of use? Why is it not used in practice?

### w2
6. What is the essential difference between a stream cipher and a block cipher? Give two algorithms for each.
7. How does the majority clocking of A5/1 work? How is the output bit computed?
8. What do the KSA and the PRGA of RC4 each do? Why discard the first 256 bytes?
9. What are the Feistel encryption/decryption formulas? Why is it that "any F can be decrypted, but not any F is secure"?
10. What are the block/key/round/S-box specifications of DES? Where does its security come from?
11. Why does 3DES use EDE? Why can't `E(E(P,K1),K2)` be used (to what does the meet-in-the-middle attack reduce 2¹¹²)?
12. What are the four round operations of AES and what does each do? Why is it not a Feistel network?
13. What are the two fatal problems of ECB? How does CBC solve them? What problems remain in CBC?
14. Why must the CTR nonce never be reused?
15. Why can a MAC detect tampering? Why must encryption and MAC use different keys?
16. What is the impact of Grover's algorithm on AES? What is the countermeasure?

### w3
17. RSA key generation, encryption/decryption, and security assumption?
18. Why does RSA need "mod at every step + repeated squaring"? How long a plaintext can 2048-bit RSA encrypt?
19. What is the flow of hybrid encryption? Why is it needed?
20. How is the DH shared key derived? How does a MiM happen, and how is it prevented?
21. Why does a digital signature provide non-repudiation while a MAC does not?
22. What is in a certificate? What is the role of the CA? Why is the root CA trusted?
23. What are the five properties of a hash? Why does the birthday attack cost \(2^{N/2}\)?
24. How does a hash chain implement one-time passwords? Why is it secure?
25. What does Shor's algorithm mean for RSA/DH? Why are symmetric ciphers unaffected?

### w4
26. What is the difference between worm/virus/Trojan/backdoor?
27. What are the propagation mechanisms and lessons of the Morris Worm and SQL Slammer?
28. How does a PE virus infect an executable?
29. What does "Reflections on Trusting Trust" show? What is XcodeGhost?
30. What are the pros and cons of static signature-based detection and dynamic behavior-based detection? How are they bypassed?
31. How does metamorphic malware mutate? How is it detected?
32. Why does linear disassembly fail? How does recursive disassembly solve it?
33. What is the pipeline of a decompiler? What are the difficulties of variable/type recovery?
34. How do you use disassembly + patching to bypass a serial number check? What is the role of little-endian?

### w5
35. What is the stack frame layout? Why can an overflow overwrite the return address?
36. What is the difference between overread and overwrite? Which one is Heartbleed?
37. What are the complete steps of an overflow exploit? What is the role of the NOP sled?
38. What does each of W^X, canary, and ASLR prevent, and what are their limitations?
39. What are the three kinds of obfuscation? What is the principle of control flow flattening and of opaque predicates?
40. On which four dimensions is obfuscation effectiveness evaluated? Why is "secure obfuscation" hard?

### w6
41. What causes a UAF, and how is it exploited? How is it fixed?
42. How does a double free corrupt the heap? How is it prevented?
43. What do `%s` and `%n` each do in a format string attack? How is it prevented?
44. What is the principle of SQL injection? Why can a prepared statement prevent it?
45. What are the three conditions that constitute a side channel attack?
46. Why does RSA square-and-multiply leak key bits? How is it defended (the idea)?
47. What is the principle of Flush+Reload? What is the difference between the strong and weak threat models?
48. Why does the cloud environment amplify the risk of cache side channels?

### w7
49. What is the difference between authentication and authorization? What are the three authentication factors?
50. Why is password entropy far lower than that of a random key of the same length? What problem does salt solve?
51. What was the experimental conclusion about passphrases? What is EER?
52. What are the ideal properties of a biometric? How do fraud/insult trade off? Why is a biometric hard to revoke?
53. What is the five-layer protocol stack and the protocols of each layer? What is the encapsulation process?
54. How do cookies relate to HTTP state? What is the privacy risk?
55. What is the DNS resolution process, and what is cache poisoning?
56. How does the TCP three-way handshake relate to SYN flooding? Why is the root cause "stateful"?
57. What are the advantages and disadvantages of NAT? What does a socket consist of?
58. How does ARP poisoning form a man-in-the-middle? How is it mitigated?

---

## 5. Suggested revision priorities

1. **Memorize the framework first**: the §1 map + the §3.1 table + the §3.3 easily-confused table.
2. **Then dig into the mechanisms**: Feistel/DES/AES, CBC/MAC, RSA/DH, stack frame overflow, UAF, format string, the three side channel conditions, TCP/ARP.
3. **Finally memorize the numbers**: §3.2; number questions are where you most easily "know it but remember it wrong".
4. **Answer template**: definition → mechanism/steps → attack → defense → limitation. Any "analyze this attack" question can use these five paragraphs.

> Note: the slides do not explicitly mark the exam scope; if you read it as "the first half of the semester", w1–w4 are the core, and the buffer overflow in w5 is often examined together with the first half. Refer to the instructor/Canvas announcements.
