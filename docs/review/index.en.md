# Review Notes · All Chapters

> **7 chapters** in total, corresponding to 7 lectures. Chapters 4/5/6/7 each cover two decks, already split into sections within the chapter; the remaining chapters correspond to one deck each.
>
> Every chapter follows the same structure: **Chapter thread → Key concepts → Worked examples → Common mistakes → Self-test (with answers) → Pre-exam quick-reference card**.
>
> Companion overview: [CSIT5730 knowledge outline](../outline.md)

---

## Chapter contents

| Chapter | Topic | Matching decks | Suggested time | File |
|---|---|---|---|---|
| 1 | Introduction & Classical Cryptography | introduction, classic-crypto | 90 min | [Chapter 1](ch1-intro.md) |
| 2 | Symmetric Key Cryptography | Symmetric-Key-Crypto | 160 min | [Chapter 2](ch2-symmetric.md) |
| 3 | Public Key Cryptography | public-key-cryptography | 150 min | [Chapter 3](ch3-public-key.md) |
| 4 | Malware & Reverse Engineering | malware, reverse-engineering | 150 min | [Chapter 4](ch4-malware-re.md) |
| 5 | Buffer Overflow & Obfuscation | buffer-overflow, obfuscation | 150 min | [Chapter 5](ch5-buffer-obfuscation.md) |
| 6 | Software Exploitation II & Side Channels | attack2, side-channel | 150 min | [Chapter 6](ch6-exploit-sidechannel.md) |
| 7 | Authentication & Network Security | authentication, network-security | 150 min | [Chapter 7](ch7-auth-network.md) |

---

## How to use (the three-pass method)

**Pass 1: build the framework (10–15 minutes per chapter)**
1. Read the three sentences of the "Chapter thread";
2. Go straight to the "Pre-exam quick-reference card" at the end;
3. Close the file and draw the chapter's knowledge structure on a blank sheet of paper (as much as you can).

**Pass 2: nail down the mechanisms (60–90 minutes per chapter)**
1. Read the "Key concepts" closely, and derive each formula yourself when you meet one;
2. Cover the worked-example solutions, do them yourself first, then compare;
3. Write the points you got wrong next to "Common mistakes" (or in your own error notebook).

**Pass 3: self-test (30 minutes per chapter)**
1. Cover the answers and do the "Self-test";
2. For wrong answers, go back to the corresponding subsection of the key concepts;
3. The next day, review only the quick-reference card + the questions you got wrong.

**30 minutes before the exam**: review only each chapter's "quick-reference card" + "Common mistakes", plus the numbers table in §3.2 of the knowledge outline.

---

## If the midterm is in 4 days (10/26): an actionable plan

> Note: the decks do not state the exam scope explicitly; the "first half of the semester" usually covers Chapters 1–4, and Chapter 5's buffer overflow is often included as well. The plan below prioritizes Chapters 1–4 and treats Chapter 5 as optional.

| Time | Task | Output |
|---|---|---|
| Day 1 morning | Chapter 1 + first half of Chapter 2 (stream ciphers, Feistel, DES) | Able to write the Feistel formulas and DES parameters from memory |
| Day 1 afternoon | Second half of Chapter 2 (AES, modes, MAC, Grover) | Able to write the ECB/CBC/CTR formulas from memory and compare them |
| Day 2 morning | Chapter 3 (RSA, DH, signatures, PKI) | Work out worked examples 1 and 2 independently |
| Day 2 afternoon | Chapter 3 hashing + first half of Chapter 4 (malware) | Able to draw the comparison table of detection methods |
| Day 3 morning | Second half of Chapter 4 (reverse engineering) | Able to recount the RE pipeline and the crack steps |
| Day 3 afternoon | Chapter 5 (overflow + obfuscation) | Able to compute the ret offset and write a payload |
| Day 4 morning | Chapter 6 (exploitation II + side channels) | Able to explain UAF/%n/SQLi/timing attacks |
| Day 4 afternoon | Chapter 7 + all wrong questions | Go through the quick-reference cards once |

> If time is short: **prioritize the calculation questions in Chapters 2 and 3 + the stack frame/defenses in Chapter 5 + the hash birthday bound in Chapter 3**; these are the easiest places both to gain and to lose marks.

---

## High-frequency calculation questions (indexed by chapter)

| Type | Chapter | Key formula/number |
|---|---|---|
| Caesar decryption, bit count of 26! | 1 | \(P=(C-k) \bmod 26\); <span class="mchip">\(\log_2(26!)\approx 88.4\)</span> |
| OTP two-time pad | 1 | \(C_{1}\oplus C_{2}=P_{1}\oplus P_{2}\) |
| One Feistel round | 2 | \(L'=R, R'=L\oplus F(R,K)\) |
| 2DES meet-in-the-middle | 2 | \(2^{112} \to 2^{57}\) |
| CBC/CTR encryption formulas | 2 | \(C_i=E(C_{i-1}\oplus P_i)\); \(C_i=P_i\oplus E(IV+i)\) |
| Grover | 2 | \(2^{n/2}\) |
| RSA: finding d / encryption and decryption | 3 | \(ed\equiv 1 \bmod \varphi \); \(C=M^e\), \(M=C^d\) |
| DH shared key | 3 | \(K=g^{ab} \bmod p\) |
| Birthday attack | 3 | \(2^{N/2}\) |
| d-th step of a hash chain | 3 | \(H^{24-d}(t)\) |
| Worm doubling | 4 | <span class="mchip">\(600/8.5\approx 70\)</span> times |
| Stack overflow offset / little-endian | 5 | `buf[64]` → ret offset 68; `80 a0 04 08` |
| RSA timing trace | 6 | slow = 1, fast = 0 |
| Cache line | 6 | 64B line; `address/64` |
| Password entropy | 7 | <span class="mchip">\(\text{len} \times \log_2(\text{charset})\)</span> |
| salt attack volume | 7 | dictionary size × number of users |
| NAT table | 7 | internal `IP:port` ↔ public `IP:port` |

---

## One-sentence review per chapter

1. **Chapter 1**: security is CIA + threat model + cost trade-off; classical cryptography proves that "a large key space ≠ secure", and OTP is the theoretical upper bound but unusable.
2. **Chapter 2**: stream ciphers emulate OTP, block ciphers rely on S-boxes; the mode determines multi-block security, MAC supplies integrity, and Grover only halves it.
3. **Chapter 3**: RSA rests on the hardness of factoring, DH on the hardness of discrete log; signatures provide non-repudiation, PKI binds identity, and hashing comes before signing.
4. **Chapter 4**: malware relies on propagation/disguise/backdoors; detection is an arms race of signatures vs behavior vs clustering; RE is "reading a program without source code".
5. **Chapter 5**: a stack overflow overwrites ret to hijack control flow; NX/canary/ASLR each have limits; obfuscation only raises the cost of reverse engineering.
6. **Chapter 6**: heap vulnerabilities are lifetime errors, format string/SQLi are "input treated as code/syntax"; side channels exploit physical leakage.
7. **Chapter 7**: three authentication factors; passwords are weak because of user choice, salt raises the offline cost; the network is layered, and each layer has its corresponding attacks.

---

## Notes

- Content marked in the decks as "implementation not required" (AES round-function details, TEA code, RSA repeated-squaring details) is kept in these notes as "role/flow"; you are not required to memorize the code line by line.
- In Chapter 7, the fraud/insult labels for biometrics are opposite to the usual false positive/negative; these notes record them as the "definition description" and mark them with ⚠.
- In Chapter 2, <span class="mchip">\(2^{57}\)</span> for 2DES and `112-bit` for 3DES are two different things; these notes already distinguish them clearly, so do not mix them up in the exam.
- If you want to expand a chapter into "30 practice questions + detailed solutions", or merge the 7 chapters into one printable PDF, you can keep building on top of the chapter contents.
