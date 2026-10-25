# Homework 1 · Cryptography Foundations

> The question stems are **desensitized restatements**, not the original assignment wording; the answers explain the reasoning in plain language as far as possible.
>
> For review only — do not submit directly; the copyright of the course assignment and its answers belongs to the instructor.

---

## Problem 1 · A Caesar cipher that "moves"

**Problem**: an ordinary Caesar cipher shifts every letter by the same number of positions. Now change the rule: the 1st letter shifts by 13, the 2nd by 14, the 3rd by 15, and so on — each following letter shifts 1 more. Use the alphabet A–Z, wrapping around from Z to A. Encrypt `SECURITY`.

**Think it through first**

- Number the letters: `A=0, B=1, ..., Z=25`;
- the i-th letter (i starting from 0) shifts by `13+i` positions;
- if the result exceeds 25, subtract 26 (equivalent to `mod 26`).

**Step-by-step calculation**

| Position | Plaintext | Value | Shift | Result | Ciphertext |
|---|---|---|---|---|---|
| 1 | S | 18 | 13 | 31 → 5 | **F** |
| 2 | E | 4 | 14 | 18 | **S** |
| 3 | C | 2 | 15 | 17 | **R** |
| 4 | U | 20 | 16 | 36 → 10 | **K** |
| 5 | R | 17 | 17 | 34 → 8 | **I** |
| 6 | I | 8 | 18 | 26 → 0 | **A** |
| 7 | T | 19 | 19 | 38 → 12 | **M** |
| 8 | Y | 24 | 20 | 44 → 18 | **S** |

The ciphertext is **`FSRKIAMS`**.

**Why this is not an ordinary Caesar cipher**: an ordinary Caesar cipher's "key" is a single number; here the shift is different at every position, which amounts to the key being a sequence of numbers `13,14,15,...`.

**Common mistake**: the 8th letter shifts by 20, not 13; `Y(24)+20=44`, `44-26=18`, which is S.

---

## Problem 2 · Running OTP backwards

**Problem**: the same 3-bit encoding: `e=000, f=001, h=010, i=011, k=100, l=101, r=110, t=111`. The OTP rule is `C = P ⊕ K`.

1. Given the plaintext `hike` and the ciphertext `left`, find the key.
2. Given the key `keel` and the ciphertext `rile`, find the plaintext.

**Think it through first**: XOR has a nice property — XOR the same thing twice and you get it back. So:

- to find the key: `K = P ⊕ C`;
- to find the plaintext: `P = C ⊕ K`.

### (1) Finding the key

| | Characters | Bits |
|---|---|---|
| Plaintext | h i k e | 010 011 100 000 |
| Ciphertext | l e f t | 101 000 001 111 |
| XOR | **t i l t** | **111 011 101 111** |

The key is **`tilt`**.

### (2) Finding the plaintext

| | Characters | Bits |
|---|---|---|
| Ciphertext | r i l e | 110 011 101 000 |
| Key | k e e l | 100 000 000 101 |
| XOR | **h i l l** | **010 011 101 101** |

The plaintext is **`hill`**.

**In plain terms**: OTP just "mixes" the plaintext and the key together; if you know two of them, you can "mix" the third one back out with XOR.

**Common mistake**: in the table `i=011` and `l=101`, so do not read them off by row; the XOR result has to be mapped back in groups of 3 bits.

---

## Problem 3 · How long brute-force key search takes

**Problem**: suppose one machine can try `2^15` keys per second.

1. An 80-bit key, worst case: how long does it take?
2. A 50-bit key, average case: how long does it take?

**Think it through first**

- an n-bit key has `2^n` possible values;
- the worst case requires trying all of them;
- on average only half are needed, that is `2^(n-1)`;
- the machine tries `2^15` per second, so the number of seconds = number of attempts ÷ `2^15`.

### (1) 80-bit, worst case

```
2^80 / 2^15 = 2^65 seconds
```

One year is about `3.1536×10^7` seconds, so:

```
2^65 / 3.1536×10^7 ≈ 1.17×10^12 years
```

About **1.17 trillion years**.

### (2) 50-bit, average case

```
2^49 / 2^15 = 2^34 seconds
2^34 / 3.1536×10^7 ≈ 544 years
```

About **544 years**.

**In plain terms**: each extra key bit doubles the work factor; 80-bit has 30 bits more than 50-bit, which is a factor of `2^30` more (about 1 billion times).

**Common mistake**: the average case uses `2^49`, not `2^50`; do not treat "seconds" as "years" directly.

---

## Problem 4 · Is this CTR formula sound?

**Problem**: normal CTR is `C_i = P_i ⊕ E(IV+i, K)`. Someone writes it as:

```
C_i = P_i ⊕ E(K, IV+i)
```

Note that this is `E(plaintext, key)`: `K` is put in the "plaintext" position, and `IV+i` becomes the "key" instead. Is this secure?

**First look at the argument positions**

- Normal form: take `IV+i` as the plaintext and `K` as the key, encrypt to get a keystream, then XOR it with `P_i`;
- This form: take `K` as the plaintext and `IV+i` as the key, encrypt something, then XOR.

The problem is that **`IV` is public**. So the "key" used for encryption is public, while the real key `K` is encrypted as the plaintext.

**Attack: one known plaintext/ciphertext pair recovers K**

1. From `C_i = P_i ⊕ E(K, IV+i)`, XOR both sides with `P_i`:
   ```
   P_i ⊕ C_i = E(K, IV+i)
   ```
2. The right-hand side is "encrypting `K` with the public `IV+i` as the key";
3. The attacker knows the key `IV+i`, so she just decrypts:
   ```
   K = D(P_i ⊕ C_i, IV+i)
   ```
4. Once she has K, every block can be decrypted:
   ```
   P_j = C_j ⊕ E(K, IV+j)
   ```

**Conclusion**: not secure. "K appears in the code" does not make it secure; what matters is whether K sits in the "plaintext" or the "key" position.

**In plain terms**: this is like treating the safe's key as the thing to be locked up, while the key to the lock is hanging on the door.

---

## Problem 5 · With a MAC and the key, can you build a new message?

**Problem**: CBC-MAC works like this:

```
C_0 = E(IV ⊕ P_0, K)
C_i = E(C_{i-1} ⊕ P_i, K)
MAC = C_{n-1}
```

Now you know the MAC value `X` and you also know the key `K`, but not the original message. Can you assemble a new message whose MAC is still `X`? How many blocks are you free to choose?

**Think it through first**: the MAC is the final ciphertext block. The final block is determined by "the previous chaining value" and "the final plaintext block". Since you know K, you can work backwards: to make the final result X, what should the final plaintext block be?

**Construction**

1. Choose the first `n-1` blocks `P_0,...,P_{n-2}` freely;
2. Compute `C_{n-2}` along the CBC chain;
3. Set the final block to:
   ```
   P_{n-1} = D(X, K) ⊕ C_{n-2}
   ```
4. Verify:
   ```
   MAC = E(P_{n-1} ⊕ C_{n-2}, K)
       = E(D(X,K), K)
       = X
   ```

**Answer**: yes. Apart from the final block, all earlier blocks can be chosen freely; the final block is uniquely determined by the prefix, the IV, K, and the target MAC.

**In plain terms**: a MAC is like "the final seal". If you know how the seal is made (K), you can arrange the earlier content however you like and then work backwards to the final block, so that the seal looks the same.

**One more thing**: this also shows that a MAC cannot resist forgery by someone who knows the key; it is not a digital signature.

---

## Problem 6 · Can CBC do random access?

**Problem**: CBC chains one block onto another. If you want to read only block i, what do you need? Compared with CTR, is it more trouble to change one block at random?

**Reading one block**

```
P_i = D(C_i, K) ⊕ C_{i-1}
```

- You need `C_i` and the preceding block `C_{i-1}`;
- Block 0 has no "preceding block", so the IV takes its place.

So random reads are possible in CBC, you just have to fetch one extra ciphertext block.

**Changing one block?**

- CBC: changing `P_i` changes `C_i`; `C_i` is also the input to the next block, so all later chaining values change. To keep the later plaintext intact, all ciphertext from i onward must be recomputed.
- CTR: `C_i = P_i ⊕ E(IV+i, K)`, each block is independent; changing one block does not affect the others.

**Conclusion**: CBC suits sequential reads and writes; random reads are fine, but random writes/updates are expensive. CTR is better suited to random access.

**In plain terms**: CBC is like dominoes — knock one over and the rest fall with it; CTR is like a row of independent lamps — switching one off does not affect the others.

---

## Problem 7 · Replacing P1 with X in CBC

**Problem**: Alice sends 4 ciphertext blocks and the IV using CBC. Trudy can change the ciphertext in transit. If she knows `P1`, can she make the `P1` that Bob decrypts become `X`?

**First look at the decryption formula**

```
P1 = D(C1, K) ⊕ C0
```

To make `P1` become `X`, you need `D(C1,K) ⊕ C0'` to equal `X`. `D(C1,K)` cannot be changed (C1 is untouched), but `C0` can.

**Method**: set

```
C0' = C0 ⊕ P1 ⊕ X
```

**Verification**

```
P1' = D(C1, K) ⊕ C0'
    = D(C1, K) ⊕ C0 ⊕ P1 ⊕ X
    = P1 ⊕ P1 ⊕ X
    = X
```

**Side effect**: since `C0` changed, `P0` also becomes garbled (`P0 = D(C0',K) ⊕ IV`). If you only care about P1, that is acceptable.

**Conclusion**: CBC encryption does not provide integrity; if you know a plaintext block, you can change it in a targeted way.

**In plain terms**: CBC's first ciphertext block is like "seasoning" — the next block's plaintext is affected by it; change the seasoning a little and the next block tastes different.

---

## Problem 8 · The RSA homomorphism trick

**Problem**: Trudy obtains two ciphertexts encrypted with Alice's public key:

```
C0 = M0^e mod N
C1 = M1^e mod N
```

She does not know the private key or the plaintexts.

1. Can she compute `(M0·M1)^e mod N`?
2. What about `(M0+M1)^e mod N`?
3. What are the practical uses of fully homomorphic encryption (FHE)?

### (1) Multiplication

Simply multiply the two ciphertexts:

```
C0·C1 ≡ M0^e · M1^e ≡ (M0·M1)^e (mod N)
```

So the result is `C0·C1 mod N`.

**In plain terms**: RSA is like "doing multiplication while wearing gloves" — multiply the ciphertexts and, after decryption, you get exactly the product of the plaintexts.

### (2) Addition

In general she cannot. RSA has only **multiplicative homomorphism**, not additive homomorphism; `M0^e + M1^e` is usually not equal to `(M0+M1)^e`. Special cases and exhaustive search aside, there is no comparable simple algebraic operation.

### (3) Uses of FHE

- Hand encrypted data to an untrusted server to compute on (statistics, machine learning, search);
- The server never sees the plaintext and returns only the encrypted result;
- Suits privacy-sensitive settings such as healthcare, finance, and genomics.

In one sentence: **outsource the computation, but the data is never exposed.**

---

## Problem 9 · Can a signature be "used backwards"?

**Problem**: in the protocol, Alice signs `M` with her own private key and sends `(M,S)`; Bob verifies with Alice's public key. Can Trudy make Bob accept a message that Alice never signed at all?

### (1) Is this forgery serious?

Trudy can:

1. pick an `R` at will;
2. compute `N = {R}Alice` ("encrypting" R with Alice's public key);
3. send `(N, R)` to Bob;
4. Bob verifies `{R}Alice = N`, and so believes that `N` is a message signed by Alice.

**What is this called**: existential forgery. Trudy cannot freely choose a meaningful `N`, she only gets "the public-key encryption of R"; but Bob really does accept a message that Alice never signed.

**Is it serious?**: it is a security problem, not just a prank. If the system interprets `N` as a command, an amount, or a file name, real damage is possible; the "random message" is the only thing limiting its direct exploitation.

### (2) After switching to signing `F(M)`, what must F satisfy?

The protocol becomes:

```
S = [F(M)]Alice
Bob verifies: {S}Alice = F(M)
```

Trudy picks R, computes `Y = {R}Alice`, and now she has to find an `M` with `F(M) = Y` before she can send `(M,R)`.

So `F` must be **one-way (preimage-resistant)**:

> Given Y, finding an M with `F(M)=Y` is computationally infeasible.

This way Trudy cannot turn an arbitrary Y into a valid message. In practice a collision-resistant hash (such as SHA-256) is used; one-wayness blocks this forgery, and collision resistance prevents "swapping the message".

**In plain terms**: originally what is signed is "the message itself", so an attacker can disguise the signature value as a message; once what is signed becomes "the message's fingerprint", the attacker cannot work backwards from a fingerprint to a message.

---

## Problem 10 · The "guaranteed" number for hash collisions

**Problem**: a hash outputs n bit, so there are at most `2^n` possible results. Now you want to **guarantee** finding 10 distinct colliding pairs of inputs (different pairs may share an input). What is the largest number of distinct inputs you need to try?

**Think it through first**: think of the `2^n` outputs as `2^n` buckets. Each input is thrown into one bucket; two inputs in the same bucket form one colliding pair.

**Answer**: `2^n + 10`.

**Why**

- If each bucket holds at most 1, you can place at most `2^n` inputs and there is not a single colliding pair;
- Adding the `2^n+1`-th input must collide with an input in some bucket, giving the 1st pair;
- after that, every extra "surplus" input adds at least one more pair;
- so `2^n + 10` inputs give at least 10 pairs.

**Why it cannot be fewer**: with `2^n + 9`, you can put 2 in each of 9 buckets and 1 in every other bucket; that gives only 9 pairs in total, not 10.

**Common mistake**: what is asked here is "guarantee" (worst case), not the "expected" `2^{n/2}` of a birthday attack.

**In plain terms**: it is not "try many times and probably collide", but "fill the drawers to a certain count and a duplicate is unavoidable".

---

## Problem 11 · How encryption and hashing differ

**Problem**: state the differences between encryption and hashing, at least three.

| Dimension | Encryption | Hashing |
|---|---|---|
| **Key** | usually keyed | an ordinary cryptographic hash is unkeyed |
| **Reversible** | can decrypt back to the plaintext | one-way, cannot go back |
| **Output** | the ciphertext is usually about as long as the plaintext | arbitrary length → fixed length |
| **Mapping** | should be reversible under a fixed key | many-to-one, collisions are unavoidable |
| **Purpose** | confidentiality | integrity / fingerprint / password storage |

**In plain terms**

- Encryption is like "a locked box": with the key you can open it, without the key you cannot;
- a hash is like "a fingerprint": it can identify a person, but you cannot reconstruct the whole person from the fingerprint;
- encryption must be reversible (otherwise the recipient cannot read it), and a hash must be irreversible (otherwise the fingerprint is meaningless).

In one sentence: encryption is "hiding something reversibly", and hashing is "an irreversible fingerprint".

---

## Review checklist

| Problem | Key point |
|---|---|
| 1 | shift `13+i`; `FSRKIAMS` |
| 2 | `K=P⊕C`, `P=C⊕K`; `tilt`, `hill` |
| 3 | `2^65 s ≈ 1.17×10^12 years`; `2^34 s ≈ 544 years` |
| 4 | `E(K, IV+i)` uses the public IV as the key → K can be recovered |
| 5 | final block `D(X,K)⊕C_{n-2}`; the rest is free |
| 6 | CBC reads need the preceding block; changing a block requires recomputing the rest; CTR is independent |
| 7 | `C0'=C0⊕P1⊕X` → `P1'=X` |
| 8 | RSA is multiplicatively homomorphic; not additively; FHE for privacy-preserving computation |
| 9 | existential forgery; `F` must be one-way / collision resistant |
| 10 | `2^n+10`; pigeonhole; `2^n+9` is not enough |
| 11 | key / reversible / fixed length / many-to-one |
