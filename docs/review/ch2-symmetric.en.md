# Chapter 2 · Symmetric Key Cryptography · Review Notes

> **Matching slides**: `w2/Symmetric-Key-Crypto.pdf`
>
> **Suggested time**: first pass 90 minutes + worked examples 40 minutes + self-test 30 minutes
>
> **Companion**: Outline §2.3
>
> **Weight of this chapter**: the main battleground for crypto computation and mechanism questions. DES/AES parameters, the Feistel formulas, the three modes, MAC, and Grover — at least one of them is almost certain to be examined.

---

## 0. Chapter thread (memorize these three sentences first)

1. **Stream ciphers** use a short key "stretched" into a pseudorandom keystream — in essence a **simulated OTP**; **block ciphers** iterate a round function over fixed-sized blocks — in essence an **electronic codebook**.
2. The security of a block cipher comes from its **non-linear S-boxes**; DES relies on 8 S-boxes, AES on ByteSub + MixColumn.
3. **Encryption only provides confidentiality, not integrity**; multi-block data must rely on **modes**, and integrity must rely on a **MAC**; quantum computing only "halves" the strength of a symmetric key (Grover).

**Common question types in this chapter**

| Question type | Typical phrasing | What to prepare |
|---|---|---|
| Parameter fill-in | Block, key, and round counts for DES/AES/3DES/TEA | Memorize the §7 quick-reference table |
| Mechanism derivation | Write one Feistel round, one A5/1 step, the CBC/CTR encryption equations | Be able to derive the formulas, not just memorize the conclusions |
| Mode comparison | Pros and cons of ECB/CBC/CTR, and when to use them | Tie it together with "does the same plaintext block give the same ciphertext?" |
| Computation | 2DES meet-in-the-middle, Grover, MAC overhead | Remember \(2^{57}\), \(2^{n/2}\), 1.5× |
| Design question | Why does 3DES use EDE? Why does MAC use a different key? | Answer "backward compatible / avoid MITM / avoid key reuse" |

---

## 1. Stream ciphers

### 1.1 Role

- The key is relatively short (e.g., 128 bit), but the algorithm **stretches** it into a **keystream** as long as the message.
- Encryption: \(C_i = P_i \oplus KS_i\); decryption likewise. Used exactly like a one-time pad (OTP).
- Advantages: extremely efficient in hardware, small memory footprint, suitable for voice/embedded.
- Disadvantages: slow in software; on modern CPUs block ciphers (especially AES-NI) are faster.
- Representatives: **A5/1** (GSM), **RC4**.

### 1.2 A5/1 (hardware stream cipher) ★

**Structure**

| Register | Length | Stepping taps | Notes |
|---|---|---|---|
| X | 19 bit | \(t = x_{13} \oplus x_{16} \oplus x_{17} \oplus x_{18}\) | Shift right, the new bit enters x0 |
| Y | 22 bit | \(t = y_{20} \oplus y_{21}\) | Shift right, the new bit enters y0 |
| Z | 23 bit | \(t = z_{7} \oplus z_{20} \oplus z_{21} \oplus z_{22}\) | Shift right, the new bit enters z0 |

**Each step**

1. Take the clocking bits: \(m = \mathrm{maj}(x_8, y_{10}, z_{10})\) (majority of three).
2. If \(x_8 = m\), X steps; if \(y_{10} = m\), Y steps; if \(z_{10} = m\), Z steps (**two or three registers may step at the same time**).
3. Output the keystream bit: \(x_{18} \oplus y_{21} \oplus z_{22}\).

**Majority example**: \(\mathrm{maj}(0,0,1)=0\), \(\mathrm{maj}(1,1,0)=1\), \(\mathrm{maj}(1,0,1)=1\).

**Slide example**: if \(m = \mathrm{maj}(1,0,1) = 1\), then X steps, Y does not step, and Z steps; the output bit = XOR of the rightmost bits of the three registers (1 in this example).

**Design trade-off**: shift registers are extremely cheap in hardware; but bit-by-bit software implementations are very slow. GSM used it because of the hardware constraints of the time.

> Note: A5/1 itself has known attacks (not covered in the slides), so do not treat it as a synonym for "secure"; if the exam asks "why is it rarely used now", answer "software efficiency + known weaknesses".

### 1.3 RC4 (software stream cipher) ★

**Core**: a 256-byte permutation table `S` that is "self-modifying" with the key; each step outputs 1 byte.

**KSA (key scheduling algorithm, initialization)**

```python
for i = 0..255:
    S[i] = i
    K[i] = key[i mod N]      # N = number of key bytes, any length
j = 0
for i = 0..255:
    j = (j + S[i] + K[i]) mod 256
    swap(S[i], S[j])
i = j = 0
```

**PRGA (pseudo-random generation algorithm)**

```python
i = (i + 1) mod 256
j = (j + S[i]) mod 256
swap(S[i], S[j])
t = (S[i] + S[j]) mod 256
keystreamByte = S[t]
```

- Each step produces 1 byte (A5/1 produces 1 bit per step).
- **The first 256 bytes must be discarded**: otherwise the initial output is biased and an attack exists (stated in the slides).
- Naming trap: **RC5 is a block cipher**, not an upgrade of RC4.

---

## 2. Block ciphers

### 2.1 Feistel cipher ★★

A Feistel cipher is not a specific algorithm but a **framework**: DES, Blowfish, RC5, TEA, and Twofish are all instances or related structures.

**Encryption** (P = (L0, R0))

\[
\begin{aligned}
L_{i+1} &= R_i \\
R_{i+1} &= L_i \oplus F(R_i, K_i),\quad i = 0,\dots,n \\
C &= (R_{n+1}, L_{n+1})
\end{aligned}
\]

(the halves are swapped at the end)

**Decryption** (start from \(C = (R_{n+1}, L_{n+1})\), subkeys in reverse order)

\[
\begin{aligned}
R_{i-1} &= L_i \\
L_{i-1} &= R_i \oplus F(L_i, K_{i-1}) \\
P &= (L_0, R_0)
\end{aligned}
\]

**Two points you must understand**

1. **Decryption works for any F**: every round is a reversible linear/XOR operation, so F need not be invertible.
2. **Security holds only for certain F**: if \(F = 0\), each round is just a swap of the halves, two rounds undo it, and it is completely insecure.

**One-round example**: \(L_0=0110\), \(R_0=1001\), \(K=1111\), \(F(R,K)=R\oplus K\).

- \(L_1 = R_0 = 1001\)
- \(R_{1} = L_{0} \oplus F(R_{0},K) = 0110 \oplus (1001\oplus 1111) = 0110 \oplus 0110 = 0000\)
- \(C = (R_1, L_1) = (0000, 1001)\)

Decryption check: \(R_0 = L_1 = 1001\); \(L_{0} = R_{1} \oplus F(L_{1},K) = 0000 \oplus (1001\oplus 1111) = 0110\). The plaintext is recovered.

### 2.2 DES ★★

| Parameter | Value |
|---|---|
| Block length | 64 bit |
| Key length | 56 bit (64 bit, of which 8 are parity bits) |
| Rounds | 16 |
| Subkey used each round | 48 bit |
| Structure | Feistel |
| Source of security | 8 S-boxes (6 bit → 4 bit) |

**One round (memorize the order)**

```
R (32 bit)
  → expansion permutation E → 48 bits
  → XOR with subkey Ki (48 bits)
  → 8 S-boxes (each 6→4) → 32 bits
  → P-box permutation → 32 bits
  → XOR with L
  → swap left and right
```

- **Expansion permutation E**: 32 → 48 bit; by repeating edge bits it splits the data into 8 groups of 6 bit each.
- **S-box**: the only **non-linear** component. Input 6 bit: the outer 2 bit select the row (0–3), the middle 4 bit select the column (0–15); output 4 bit. The DES S-boxes are carefully designed to resist differential/linear cryptanalysis → **this is mainly where the security of DES comes from**.
- **P-box**: further permutes the 32-bit output, providing diffusion.
- **Subkey generation**: the 56-bit key is split into two 28-bit halves, each cyclically left-shifted every round, then compressed to select 48 bit.
- **Initial permutation IP / final permutation FP**: provide no security at all, they are just a historical design; software implementations often omit them.

**Cracking history (memorize the numbers)**

- 1998, the EFF DES Cracker: cost **< $250,000**, cracked in **< 3 days**.
- 1999, distributed.net: using the idle time of many machines, **22 hours and 15 minutes**.
- Conclusion: **a 56-bit key is too small**, exhaustive search is feasible; DES is no longer secure.

### 2.3 3DES (Triple DES) ★

**Structure**: `C = E(D(E(P, K1), K2), K1)`, i.e., **EDE, two keys, effective strength 112 bit**.

**Why EDE instead of EEE?**

- **Backward compatible**: when `K1 = K2 = K`, `E(D(E(P,K),K),K) = E(P,K)`, which degrades to ordinary DES.
- This way old systems being upgraded can interoperate in single-key mode.

**Why not double encryption `E(E(P,K1),K2)`?**

- Double encryption nominally has 112-bit strength, but there is a **meet-in-the-middle (MITM) attack**:
  - For each K1 compute \(E_{K_{1}}(P)\) and store it (about 2⁵⁶);
  - For each K2 compute \(D_{K_{2}}(C)\) and look for a match (about 2⁵⁶);
  - Total time/space about 2⁵⁶ each, together about **2⁵⁷**, not 2¹¹².
- The EDE structure of 3DES (outer E with K1, inner D with K2) **cannot** be attacked by this simple meet-in-the-middle directly, so it keeps about 112-bit strength.

> ⚠ Common mistake: the "2¹¹² → 2⁵⁷" in the slides refers to **double encryption, 2DES**; do not take 2⁵⁷ as the effective strength of 3DES. The two-key version of 3DES is about **112 bit**.

**Three-key 3DES**: `E(D(E(P,K1),K2),K3)`, strength about 168 bit (the slides only cover the two-key version).

### 2.4 AES ★★

| Parameter | Value |
|---|---|
| Block length | 128 bit (16 bytes, 4×4 byte array) |
| Key length | 128 / 192 / 256 bit |
| Rounds | 10 / 12 / 14 (matching the keys above) |
| Structure | **Not a Feistel cipher** (SPN type) |

**The 4 operations in each round (the order must not be wrong)**

1. **ByteSub (SubBytes)**: byte-by-byte S-box lookup, the only non-linear layer; no fixed point (\(S(a) \neq a\)), and an inverse table is needed for decryption.
2. **ShiftRow (ShiftRows)**: row 0 is not shifted, row 1 is shifted by 1 byte, row 2 by 2, row 3 by 3; the purpose is to mix the columns, **avoiding the columns being encrypted independently**.
3. **MixColumn (MixColumns)**: each column is multiplied on the left by an invertible matrix (over GF(2⁸)), implemented as a lookup table; it provides diffusion within a column.
4. **AddRoundKey**: XOR the subkey with the block (the only "key injection" step).

**Why AES is popular**

- Efficient on both 8-bit / 32-bit CPUs; small code and memory footprint.
- Hardware instructions **AES-NI** (AESENC / AESDEC) exist, and software is fast too.
- **Avalanche effect**: one bit difference in the plaintext → a big change in the ciphertext.

> The slides state explicitly: **you are NOT required to remember AES implementation details**, but you must be able to explain clearly what the four operations do, and "why it is not a Feistel cipher" (AES applies substitution-permutation to the whole block each round, instead of only handling half of it).

### 2.5 TEA (Tiny Encryption Algorithm)

| Parameter | Value |
|---|---|
| Block | 64 bit |
| Key | 128 bit |
| Rounds | Variable, 32 rounds is considered secure |
| Constant | `delta = 0x9e3779b9` (golden ratio) |
| Characteristics | "Weak" round function + many rounds; "almost Feistel" (uses `+/-` instead of pure XOR) |

**Weakness**: **equivalent keys** exist (4 different keys that all give the same ciphertext), lowering the effective strength from 2¹²⁸ to about **2¹²⁶**; there are also X-box type attacks. The slides do not require you to remember the implementation.

### 2.6 Linear cryptanalysis ★

- The only non-linear component of a block cipher is the S-box; the attack idea is to **approximate the S-box with linear equations**.
- For a given S-box, measure the probability that a linear relation between input and output bits holds:
  - `y1 = x1` holds with probability 3/4;
  - \(y_{0} = x_{0} \oplus x_{2} \oplus 1\) holds with probability 1;
  - \(y_{0} \oplus y_{1} = x_{1} \oplus x_{2}\) holds with probability 3/4.
- The larger the **bias**, the better the approximation; after propagating along multiple rounds the subkey can be recovered.
- The DES S-box design means there are **no good linear approximations to any one output bit**, but linear combinations of output bits can still be approximated by linear combinations of input bits; in practice it requires a huge amount of plaintext and is not very practical.

---

## 3. Modes of operation

### 3.1 Why modes are needed

- A block is only 64/128 bit, while the message is far larger than one block.
- A new key for each block = as impractical as a one-time pad (key distribution).
- So a **fixed key + chaining/counter** is used to handle multiple blocks; partial blocks are not considered in this course.

### 3.2 ECB (Electronic Codebook) ★

\[
\begin{aligned}
C_i &= E(P_i, K) \\
P_i &= D(C_i, K)
\end{aligned}
\]

- Same plaintext block → **same ciphertext block**.
- Equivalent to "a different codebook for each key".

**Problem 1: cut-and-paste**

Plaintext: `Eva. pings Bob. Ted. pings Tom.` (64-bit blocks, 8-bit ASCII)
- P0=`Eva. pin`, P1=`gs Bob. `, P2=`Ted. pin`, P3=`gs Tom. `
- Ciphertext C0 C1 C2 C3; the attacker rearranges it to **C0 C3 C2 C1**;
- Decrypts to: `Eva. pin` + `gs Tom. ` + `Ted. pin` + `gs Bob. ` = `Eva. pings Tom. Ted. pings Bob.`

**Problem 2: pattern leakage**

- Encrypt an uncompressed image and the large-scale outline is still visible — because the same plaintext block produces the same ciphertext block.
- Even without knowing the plaintext, the attacker knows "which blocks are identical".

### 3.3 CBC (Cipher Block Chaining) ★

\[
\begin{aligned}
C_0 &= E(IV \oplus P_0, K) \\
C_i &= E(C_{i-1} \oplus P_i, K) \\
P_0 &= IV \oplus D(C_0, K) \\
P_i &= C_{i-1} \oplus D(C_i, K)
\end{aligned}
\]

- **The IV is random, but need not be secret**; its role is to turn the same P0 into a different C0.
- Same plaintext block → different ciphertext blocks (because the chaining value differs).
- **Error propagation is limited**: if C1 is garbled, P1 becomes garbled and the corresponding bits of P2 are affected, but P3 onward is normal.
- **Cut-and-paste is still possible** (rearranging whole blocks).
- **Malleable**: flipping some bit of \(C_{i-1}\) → the same bit of \(P_i\) flips, and \(P_{i-1}\) becomes garbled. If the attacker knows the structure of \(P_i\) (e.g., an amount), a targeted modification is possible → **this again shows that encryption does not provide integrity**.

> Exam point: does the CBC IV need to be secret? — No; does it need to be random/unpredictable? — Yes.

### 3.4 CTR (Counter) ★

\[
\begin{aligned}
C_i &= P_i \oplus E(IV + i, K) \\
P_i &= C_i \oplus E(IV + i, K)
\end{aligned}
\]

- Uses the block cipher like a **stream cipher**; supports **random access** (you can jump directly to block i).
- Can be parallelized and precomputed.
- ⚠ **The IV/nonce must never be reused**: if the same `E(IV)` encrypts two messages, then \(C_{1}\oplus C_{2} = P_{1}\oplus P_{2}\), equivalent to a two-time pad.

### 3.5 Comparing the three modes (memorize this table)

| Dimension | ECB | CBC | CTR |
|---|---|---|---|
| Same plaintext block | Same ciphertext | Different ciphertext | Different ciphertext |
| Parallel encryption | Yes | No (chained) | Yes |
| Random access | Yes | No | Yes |
| Error propagation | This block only | This block + part of the next | This block only |
| Needs an IV | No | Yes (random) | Yes (unique, must not be reused) |
| Main problem | Pattern leakage, cut-and-paste | Malleable, cut-and-paste | nonce reuse disaster |
| Typical use | Not recommended | File/message encryption | Disk/network/random access |

### 3.6 Integrity: MAC ★★

**Why a MAC is needed**

- Encryption only prevents "reading", not "modification": a one-time pad can be flipped, ECB can be rearranged, CBC can be bit-flipped.
- **Integrity = detect unauthorized writing**.

**MAC = CBC residue**

\[
\begin{aligned}
C_0 &= E(IV \oplus P_0, K) \\
C_1 &= E(C_0 \oplus P_1, K) \\
&\vdots \\
C_{N-1} &= E(C_{N-2} \oplus P_{N-1}, K) = \mathrm{MAC}
\end{aligned}
\]

- Send \((IV, P_0\\dots P_{N-1}, MAC)\); the receiver recomputes with the same K and compares the MAC.
- Why it detects tampering: changing any `P_i` propagates along the chain to the final MAC; without K a new MAC cannot be forged.

**Why encryption and MAC must use different keys**

- If the same key is used, sending the last ciphertext block (the MAC) again cannot add any security;
- Different keys (even related ones) work, but the cost is about **2×** encryption; optimization can bring it down to about **1.5×**;
- **AE (authenticated encryption)** is the research direction for "providing C + I in one operation".

**MAC vs digital signature**: in a MAC both parties share the key, so Bob can forge it too → **no non-repudiation**; a signature uses the private key, and only the signer can produce it → non-repudiation (Chapter 3).

---

## 4. Quantum computers and symmetric ciphers

- A qubit can be in a superposition of 0/1; N qubits have \(2^N\) amplitudes.
- **Grover's algorithm**: gives a square-root speedup for exhaustive search.
  - Classical: n-bit key, work factor about 2ⁿ;
  - Grover: about **\(2^{n/2}\)**.
- For AES-128: about 2⁶⁴ after Grover → no longer enough; the countermeasure is **AES-256** (about 2¹²⁸ after Grover).
- Conclusion: quantum is **not a serious threat** to symmetric ciphers, **doubling the key length** is enough; the real danger is RSA/DH (Shor, Chapter 3).

---

## 5. Worked examples

### Example 1: one Feistel round (8 points)

**Question**: L0=0110, R0=1001, K=1111, F(R,K)=R⊕K. Find (L1,R1) after one round and the ciphertext C.

**Solution**:
- `L1 = R0 = 1001`
- \(R_{1} = L_{0} \oplus F(R_{0},K) = 0110 \oplus (1001\oplus 1111) = 0110 \oplus 0110 = 0000\)
- \(C = (R_1, L_1) = (0000, 1001)\)

**Scoring points**: the formulas are written correctly; the final **swap of left and right** (the easiest thing to miss).

### Example 2: 2DES meet-in-the-middle (10 points)

**Question**: double encryption `C = E(E(P,K1),K2)`, with 56-bit keys. Explain how MITM reduces 2¹¹² to about 2⁵⁷.

**Solution**:
1. For all 2⁵⁶ values of K1, compute `X = E(P,K1)` and store it in a table (sorted/hashed by X).
2. For all 2⁵⁶ values of K2, compute `Y = D(C,K2)`.
3. Find the match where `X = Y` → candidate (K1,K2), then verify with a second plaintext/ciphertext pair.
4. Time ≈ 2⁵⁶ + 2⁵⁶ = 2⁵⁷, space ≈ 2⁵⁶.

**Conclusion**: double encryption does not have 112-bit strength; 3DES uses EDE to avoid this direct decomposition.

### Example 3: ECB cut-and-paste (8 points)

**Question**: the plaintext consists of 4 64-bit blocks: `Eva. pin | gs Bob. | Ted. pin | gs Tom. `, and the ciphertext is C0 C1 C2 C3. How do you make the decrypted result become `Eva. pings Tom. Ted. pings Bob.`?

**Solution**: send **C0 C3 C2 C1**.
- Decryption: P0=`Eva. pin`, P3=`gs Tom. `, P2=`Ted. pin`, P1=`gs Bob. `
- Concatenated: `Eva. pings Tom. Ted. pings Bob.`

**Scoring point**: state that each ECB block is independent, so the blocks can be rearranged arbitrarily.

### Example 4: CBC bit flipping (10 points)

**Question**: in CBC encryption, the attacker flips the 3rd bit of C1. Which plaintext blocks are affected after decryption? Can the attacker modify P2 in a targeted way?

**Solution**:
- P1 is computed from `D(C1)` → if C1 changes, the whole of P1 becomes garbled (unpredictable);
- P2 = C1 ⊕ D(C2) → flipping the 3rd bit of C1 makes **the 3rd bit of P2 flip exactly**;
- So the attacker cannot control P1, but **can flip any bit of P2 in a targeted way** (as long as the structure of P2 is known).
- Conclusion: CBC encryption does not provide integrity; a MAC/AE must be added.

### Example 5: Grover (6 points)

**Question**: how much security strength does AES-128 have left under quantum computing? What should be done?

**Solution**:
- Grover reduces exhaustive search from 2¹²⁸ to about 2⁶⁴;
- 2⁶⁴ is no longer enough for modern computing power → switch to **AES-256**, about 2¹²⁸ after Grover;
- The only cost is being "a little slower", which is acceptable.

---

## 6. Common mistakes (where marks are most easily lost)

| Mistake | Correct |
|---|---|
| Two-key 3DES strength = 168 bit | Two keys give about **112 bit**; only three keys give about 168 |
| "2⁵⁷ is the strength of 3DES" | 2⁵⁷ is the MITM cost for **double encryption, 2DES**; 3DES EDE is about 112 bit |
| Feistel decryption requires F to be invertible | It does not; Feistel is invertible for any F, but security depends on F |
| AES is a Feistel cipher | It is not; AES is an SPN (substitution-permutation network) |
| 3DES uses EDE to be "harder to crack" | The primary purpose is **backward compatibility with single-key DES**; it also avoids the 2DES MITM |
| The CBC IV must be secret | The IV **need not be secret**, but it must be random/unpredictable |
| The CTR nonce may be repeated | **Absolutely not**; reuse is equivalent to a two-time pad |
| Encryption also guarantees integrity | It does not; a MAC/signature/AE is required |
| A MAC provides non-repudiation | It does not; both parties share the key, so Bob can forge it too |
| Grover breaks AES | It only halves the strength; AES-256 restores 128-bit security |
| RC5 is an upgrade of RC4 | RC5 is a **block cipher**, unrelated to RC4 |

---

## 7. Self-test (do it first, then check the answers)

1. What is the essential difference between stream ciphers and block ciphers? Give two algorithms for each.
2. How does A5/1's majority clocking work? How is the output bit computed?
3. What do RC4's KSA and PRGA each do? Why must the first 256 bytes be discarded?
4. Write the Feistel encryption and decryption formulas; why is it that "any F can decrypt, but not any F is secure"?
5. What are DES's block, key, rounds, subkey length, and S-box specification? Where does the security come from?
6. Why does 3DES use EDE? Why not `E(E(P,K1),K2)`?
7. What are the four AES round operations and what does each do? Why is it said not to be a Feistel cipher?
8. What are ECB's two fatal problems? How does CBC solve them? What problems remain in CBC?
9. Why must the CTR nonce never be reused? Give the quantity the attacker can compute directly.
10. Why can a MAC detect tampering? Why must encryption and MAC use different keys?
11. What does Grover mean for AES-128/256 respectively?

### Answers

1. Stream ciphers generate a keystream bit/byte at a time (A5/1, RC4); block ciphers iterate a round function over fixed-sized blocks (DES, AES).
2. \(m = \mathrm{maj}(x_8,y_{10},z_{10})\); only registers whose clocking bit equals m step; output \(x_{18}\oplus y_{21}\oplus z_{22}\).
3. The KSA uses the key to scramble the 256-byte permutation table; the PRGA swaps and outputs 1 byte per step; the first 256 bytes have a statistical bias, and keeping them can be exploited.
4. \(L_{i+1}=R_i\), \(R_{i+1}=L_i\oplus F(R_i,K_i)\), \(C=(R_{n+1},L_{n+1})\); decryption runs in reverse with the subkeys in reverse order. Every round is invertible, so F need not be invertible; but with \(F=0\) only a swap remains, with no confusion at all.
5. 64/56/16/48/8 S-boxes (6→4). The security comes mainly from the non-linearity of the S-boxes.
6. EDE degrades to DES when K1=K2 (backward compatible); `E(E(P,K1),K2)` is reduced by MITM from 2¹¹² to about 2⁵⁷.
7. ByteSub (non-linearity), ShiftRow (row diffusion), MixColumn (column diffusion), AddRoundKey (key injection). AES processes the whole 128-bit state each round, not just half of it.
8. The same plaintext block produces the same ciphertext → pattern leakage; blocks can be rearranged → cut-and-paste. CBC uses chaining and a random IV to solve "same block"; but whole-block rearrangement and bit flipping are still possible.
9. \(C_{1}\oplus C_{2} = P_{1}\oplus P_{2}\); the same `E(IV)` is used twice, so the XOR of the two ciphertexts is the XOR of the two plaintexts.
10. Changing any plaintext block propagates along the CBC chain to the final MAC; without K it cannot be forged. Under the same key the MAC and the ciphertext can "borrow" from each other, and sending it twice adds no security; different keys separate the purposes.
11. AES-128 → about 2⁶⁴ (not enough); AES-256 → about 2¹²⁸ (enough); the cost is being a little slower.

---

## 8. Pre-exam quick-reference card

| Item | Value / key point |
|---|---|
| A5/1 | 19/22/23 bit; majority clocking; output \(x_{18}\oplus y_{21}\oplus z_{22}\) |
| RC4 | 256-byte permutation; discard the first 256 bytes; RC5 is a block cipher |
| Feistel | \(L'=R, R'=L\oplus F(R,K)\); \(C=(R,L)\); F need not be invertible |
| DES | 64/56/16/48; 8 S-boxes (6→4); security relies on the S-boxes |
| DES cracking | 1998 EFF < $250k, < 3 days; 1999 22h15m |
| 3DES | EDE, two keys 112 bit; three keys 168 bit |
| 2DES MITM | 2¹¹² → about 2⁵⁷ |
| AES | 128-bit block; 128/192/256-bit key; 10/12/14 rounds; ByteSub/ShiftRow/MixColumn/AddRoundKey |
| TEA | 64/128; 32 rounds; delta=0x9e3779b9; equivalent keys 2¹²⁸→2¹²⁶ |
| ECB | same plaintext block, same ciphertext; cut-paste; pattern leakage |
| CBC | \(C_i=E(C_{i-1}\oplus P_i)\); IV random and not secret; bit flipping possible |
| CTR | \(C_i=P_i\oplus E(IV+i)\); nonce must not be reused; random access |
| MAC | CBC residue; different keys for encryption/MAC; about 1.5–2× overhead |
| Grover | \(2^{n/2}\); AES-256 restores 128-bit security |
