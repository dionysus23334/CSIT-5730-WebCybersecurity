# Chapter 3 · Public Key Cryptography · Review Notes

> **Matching slides**: `w3/public-key-cryptography.pdf`
>
> **Suggested time**: first pass 80 minutes + worked examples 40 minutes + self-test 30 minutes
>
> **Companion**: Outline §2.4
>
> **Weight of this chapter**: RSA computation, DH key exchange, signatures/certificates, and the hash birthday bound are high-frequency sources of computation and short-answer questions; Shor's algorithm is often examined in comparison with Grover from Chapter 2.

---

## 0. Chapter thread (memorize these three sentences first)

1. Public key cryptography uses a **trapdoor one-way function** to solve "how do we distribute keys securely": encrypt with the public key, decrypt with the private key; for signatures it is the other way round.
2. **RSA's security = integer factorization; DH's security = discrete log**; both fear Shor's algorithm, while symmetric ciphers are only affected by Grover.
3. Public key algorithms are **slow and have a message length limit**, so real systems are a **hybrid** of "public key to establish a key + symmetric to encrypt the data"; binding a public key to an identity relies on **PKI/certificates**, and signing a large message relies on **hashing first**.

**Common question types in this chapter**

| Question type | Typical phrasing | What to prepare |
|---|---|---|
| RSA computation | Given small p, q, e, find d, encrypt, decrypt, sign | Be able to do extended Euclid/trial and error; be able to do repeated squaring |
| Protocol analysis | Why does DH fear man-in-the-middle? How do you prevent it? | Draw the three-party key table |
| Concept discrimination | Signature vs MAC; encryption vs signature | Grab "is the key shared?" |
| Hash computation | Cost of the birthday attack, the value at the d-th step of a hash chain | Remember \(2^{N/2}\) and the index |
| PKI | What is in a certificate? Why is a CA trusted? | Memorize the X.509 fields + the chain of trust |

---

## 1. Core idea

### 1.1 Trapdoor one-way function

- **One-way**: easy in the forward direction, extremely hard in the reverse direction.
- **Trapdoor**: once you hold a certain secret (the private key), the reverse direction becomes easy.
- Typical: \(N = p\cdot q\) is easy; factoring p and q out of N is extremely hard. The trapdoor is p and q.

### 1.2 Two uses (must be distinguished)

| Purpose | What the sender uses | What the receiver uses | Provides |
|---|---|---|---|
| **Encryption** (secrecy) | Bob's **public key** | Bob's **private key** | Confidentiality |
| **Signature** (authentication) | Alice's **private key** | Alice's **public key** | Integrity + authentication + **non-repudiation** |

> Mnemonic: **encryption is "locking with the other party's public key", a signature is "stamping with your own private key"**.

---

## 2. RSA

### 2.1 Key generation ★★

1. Choose two large primes p and q.
2. \(N = p\cdot q\) (the modulus).
3. Compute \(\varphi (N) = (p-1)(q-1)\).
4. Choose `e` such that \(\gcd(e, \varphi (N)) = 1\) (usually e=65537).
5. Find `d` such that \(e\cdot d \equiv 1 \pmod{\varphi (N})\) (extended Euclid).
6. **Public key `(N, e)`; private key `d`** (p and q must be kept secret/destroyed).

### 2.2 Encryption and decryption ★★

Encryption: \(C = M^e \bmod N\); decryption: \(M = C^d \bmod N\).

**Correctness intuition**: \(C^d = M^{ed} = M^{1+k\varphi (N)} \equiv M \pmod{N}\); when `gcd(M,N)=1` this follows directly from Euler's theorem, and when they are not coprime it can also be proved with CRT (since N is the product of two primes). In practice the probability that M is not coprime to N is negligible.

### 2.3 Security = factoring N ★★

- If an attacker can factor \(N = p\cdot q\), they can compute \(\varphi (N)\) and then derive `d` from `e`.
- Therefore: **factoring the modulus breaks RSA**.
- But "RSA hard ≠ factoring hard" is an unproven equivalence; currently there is no general attack faster than factoring.

### 2.4 Efficiency: repeated squaring ★

Computing \(M^e\) directly produces astronomically large numbers; you must **take the modulus at each step**.

**Example**: compute \(5^{20} \bmod 35\).

```
5¹  = 5
5²  = 25
5⁴  = 25² = 625 ≡ 30 (mod 35)
5⁵  = 5⁴·5 = 30·5 = 150 ≡ 10
5¹⁰ = 10² = 100 ≡ 30
5²⁰ = 30² = 900 ≡ 25
```

- First write the exponent in binary, then go bit by bit: "square, and multiply by the base when the bit is 1".
- Intermediate values always stay < N², so nothing blows up.
- You can precompute a table of the commonly used powers.

### 2.5 Message length and hybrid encryption ★★

- RSA can only encrypt numbers **smaller than N**; a 2048-bit modulus = 256 bytes.
- Real padding (e.g., PKCS#1 v1.5) takes another 11 bytes → **at most about 245 bytes of plaintext**.
- Do not "cut the message into chunks and RSA each one": ciphertext expansion, slow, plus padding/mode problems.
- **Hybrid cryptosystem**:
  1. Use RSA to encrypt a random symmetric key (or establish a key);
  2. Use a symmetric cipher such as AES to encrypt the actual data.
- SSL/TLS and OpenPGP both do this.
- But "how does Bob confirm that the public key really belongs to Alice?" → certificates are needed (§5).

### 2.6 RSA numbers (for awareness)

- RSA Labs published semiprimes (exactly two prime factors) with 100–617 decimal digits.
- As of 2018-08, 20 of the 54 have been factored.
- RSA-100 (330 bit) is the easiest; **no one can break RSA-2048 so far**.
- **Key collisions**: the probability that two independently generated RSA key pairs happen to be identical is extremely low (the slides only give an informal explanation; no need to dig deeper).
- Conclusion: real deployments use at least 2048-bit and are gradually migrating to 3072/4096.

### 2.7 Pitfalls of textbook RSA (supplementary, but "why is padding needed" is often examined)

- **Deterministic**: the same M always gives the same C → dictionary/replay attacks work; randomized padding is needed (OAEP).
- **Malleable**: \(C_{1}\cdot C_{2} = (M_{1}\cdot M_{2})^e\) → an attacker can construct related plaintexts.
- **Signatures are forgeable**: \(S(M_{1})\cdot S(M_{2}) = S(M_{1}\cdot M_{2})\) → an attacker can obtain a signature on \(M_{1}\cdot M_{2}\) without asking for it; **hash + padding** is needed.
- **Small e / common modulus / low-entropy plaintext**: all have classic attacks (not covered in this course).

---

## 3. Diffie-Hellman key exchange ★★

### 3.1 Protocol

Public parameters: a large prime p, a generator g.

1. Alice picks a secret a, computes \(A = g^a \bmod p\), and sends it to Bob.
2. Bob picks a secret b, computes \(B = g^b \bmod p\), and sends it to Alice.
3. Alice computes \(K = B^a = g^{ab} \bmod p\).
4. Bob computes \(K = A^b = g^{ab} \bmod p\).
5. Both sides obtain the same symmetric key K.

**DH is not used for encrypting/signing**, only for **establishing a key**.

### 3.2 Security = discrete log

- The attacker can see \(g, p, A=g^a, B=g^b\).
- If they can find a from \(g^a\) (the discrete log problem), they can compute \(K = B^a\).
- Note: \(A\cdot B = g^{a+b} \neq g^{ab}\) — you cannot get the key by multiplying directly.

### 3.3 Man-in-the-middle (MiM) attack ★

1. Trudy intercepts Alice's \(g^a\), picks her own t, and sends \(g^t\) to Bob.
2. Trudy intercepts Bob's \(g^b\) and sends \(g^t\) to Alice.
3. Alice computes \(K_AT = g^{at}\); Bob computes \(K_BT = g^{bt}\); Trudy can compute both.
4. After that Trudy talks to Alice with `K_AT` and to Bob with `K_BT`, and neither side has any idea.

**Root cause**: DH itself has **no authentication** — Alice cannot confirm that \(g^t\) came from Bob.
**Defense**: authenticate DH's public values with certificates/signatures/pre-shared keys (e.g., TLS's signed key exchange, Signal's X3DH, etc.).

### 3.4 Small example (p=23, g=5, a=6, b=15)

```
A = 5⁶ mod 23 = 8
B = 5¹⁵ mod 23 = 19
Alice: K = 19⁶ mod 23 = 2
Bob:   K = 8¹⁵ mod 23 = 2
```

---

## 4. Digital signatures ★★

### 4.1 Mechanism

- Sign: \(S = [M]_{\\text{Alice}} = M^d \bmod N\) ("encrypt" with the private key).
- Verify: \(M = S^e \bmod N\) ("decrypt" with the public key).
- Only Alice knows d, so only she can produce S; anyone can verify.

### 4.2 Why it gives non-repudiation ★

| | MAC | Digital signature |
|---|---|---|
| Key | Both sides share K | The signer alone holds the private key |
| Can Bob forge it | **Yes** (he also knows K) | No (he does not have d) |
| Can it be proved to a third party | **No** | Yes |
| Non-repudiation | None | Yes |

**Scenario**: Alice orders 100 shares from Bob.
- With a MAC: after the stock drops Alice denies it; Bob cannot prove that he did not forge it himself (he also has K).
- With a signature: only Alice has the private key; Bob can verify the signature to a judge → Alice cannot repudiate.
- Precondition: **the private key has not been stolen/leaked**.

### 4.3 Hash-then-sign ★★

- Signing a large message directly: RSA is slow, and the signature length = the message length (impractical).
- Instead sign `h(M)`: `S = [h(M)]Alice`, and send `(M, S)`.
- Verify: compute `h(M)` and compare it with \(S^e\).
- Precondition: the hash must be **collision resistant**; otherwise an attacker finds `M'` with `h(M')=h(M)` and can replace `(M,S)` with `(M',S)`.
- This explains why broken collisions in MD5/SHA-1 directly threaten signature security.

### 4.4 The "direction" of signature vs encryption (easy to get wrong)

- Encryption: **public key** encrypts → **private key** decrypts.
- Signature: **private key** "encrypts" → **public key** "decrypts".
- Do not treat "encrypting a message with the private key" as "keeping the message secret" — anyone can open it with the public key, it **provides no confidentiality**.

---

## 5. PKI and certificates ★★

### 5.1 The problem

- You receive `(M, S)` — how do you know that this "Alice's public key" really belongs to Alice?
- An attacker can forge "Alice's public key" and then sign with their own private key.
- Solution: a **trusted third party, the CA**, vouches for "identity + public key".

### 5.2 Digital certificate

- Contents: user name, public key, validity period, issuer, etc.
- Signed by the CA with the **CA's private key**.
- Verify: use the **CA's public key** to verify the certificate signature → trust the public key in the certificate.
- Common format: **X.509**.

**Main X.509 fields** (being able to list 5 is enough):

```
Version
Serial Number
Signature Algorithm
Issuer Name
Validity Period
Subject Name
Subject Public Key
Issuer Unique ID
Subject Unique ID
Extensions
Digital Signature
```

### 5.3 Certificate life cycle

```
Key pair generated → Certificate issued → Key pair in use → Certificate expires / private key compromised → Certificate revoked (CRL) → Re-certify / new key pair
```

- **CRL (Certificate Revocation List)**: the CA publishes a list of "revoked certificates".
- Revocation checking is the practical difficulty of PKI (CRLs too large; OCSP privacy/availability problems).

### 5.4 Why trust a CA?

- **Root CA certificates are preinstalled** in the OS/browser/application since installation time, and updated with normal system updates.
- The CA verifies identity by **real-world measures** (business license, domain control, phone callback), not by cryptography.
- Trust is **transitive**: root CA → intermediate CA → site certificate.
- Risk: a CA is compromised/acts maliciously → it can issue arbitrary certificates (this has happened historically).

### 5.5 Three trust models

| Model | Structure | Example |
|---|---|---|
| **Monopoly** | A single/very few root CAs | Early browser vendor roots |
| **Oligarchy** | A few trusted CAs (most common) | The modern TLS ecosystem |
| **Anarchy** | Anyone can be a CA, relying on self-certification/reputation | PGP web of trust |

---

## 6. Hash functions ★★

### 6.1 The five properties (must memorize)

| Property | Meaning | Attack it resists |
|---|---|---|
| **Compression** | any length → fixed n-bit | — |
| **Efficiency** | easy to compute | — |
| **One-way (preimage)** | given y, cannot find x with H(x)=y | reversing plaintext/passwords |
| **Weak collision (second preimage)** | given x, cannot find y≠x with H(y)=H(x) | tampering with a single message |
| **Strong collision** | cannot find any pair y≠x with H(y)=H(x) | forging an arbitrary message |

### 6.2 Birthday problems ★★

- **Pre-birthday problem** (weak collision): finding someone with the same birthday as me takes **253** people.
- **Birthday problem** (strong collision): any two people sharing a birthday needs only **23** people.
- Generalization: for an N-bit hash, about \(2^{N/2}\) tries are enough to find a collision.
- Corollaries:
  - **An N-bit hash has only N/2 bits of security strength**;
  - 128-bit (MD5) → 2⁶⁴; 160-bit (SHA-1) → 2⁸⁰;
  - whereas an N-bit symmetric key has about N bits of strength.

### 6.3 Common algorithms

| Algorithm | Output | Status |
|---|---|---|
| MD5 | 128 bit | collisions easy to construct, **broken** |
| SHA-1 | 160 bit | crackable since 2005, **no longer recommended** |
| SHA-256/384/512 | 256/384/512 | currently secure |
| SHA-3 | 224/256/384/512 | different structure (sponge), secure |

- Structure: **Merkle–Damgård**: a fixed compression function + block-by-block iteration, where the previous block's output takes part in the next block; no key involved, similar to a block cipher.
- Avalanche effect: `MD5("...dog")` and `MD5("...dog.")` give completely different outputs.

### 6.4 Clever uses of hashing

**(1) Password storage (detailed in Chapter 7)**

- Store `h(password)`; an attacker precomputes a dictionary → cracked in seconds.
- Add a **salt**: store `(s, h(password, s))`; the attacker must recompute for every user.

**(2) Hash chains / one-time passwords**

- 24 classes, secret t:
  - class 1 gets `H²³(t)`;
  - class d gets \(H^{24-d}(t)\);
  - class 24 gets `t`.
- Verify: hash the received value once more; it should equal the previous value.
- Security: from the current value you **cannot derive the next value** (that requires inverting); also each value corresponds to exactly one class, so a replay is rejected by the index check.

**(3) Anti-spam PoW**

- Require the first N bits of `h(M, R, T)` to be zero.
- The sender tries **\(2^N\)** times on average; the receiver needs only **1** verification.
- N is adjustable: acceptable for normal email, while the cost for spam rises exponentially.
- Blockchain PoW has the same origin.

### 6.5 Quantum computing: Shor ★★

- **Shor's algorithm** (1994) can factor large integers and solve discrete logs in polynomial time.
- For a 2048-bit modulus:
  - the number field sieve (best classic) ≈ 125-bit symmetric key strength;
  - Shor ≈ **30-bit** symmetric key strength.
- Conclusion: **RSA, DH, and DSA/ECDSA all fail**; symmetric ciphers with long keys survive.
- Countermeasure: **post-quantum cryptography** (e.g., NTRU, lattice-based cryptography) — the slides only name NTRU.

---

## 7. Worked examples

### Example 1: RSA full flow (12 points)

**Question**: p=11, q=3, e=3, M=8. Find N, φ(N), d, the ciphertext C, and verify the decryption.

**Solution**:
- \(N = 11\times 3 = 33\)
- \(\varphi (N) = 10\times 2 = 20\)
- `e=3`, \(3d \equiv 1 \pmod{20}\) → `d=7` (3×7=21≡1)
- \(C = 8^{3} \bmod 33 = 512 \bmod 33 = 17\)
- Verify: \(17^{7} \bmod 33\)
  - \(17^{2} = 289 \equiv 25\)
  - \(17^{4} = 25^{2} = 625 \equiv 31\)
  - \(17^{7} = 17^{4}\cdot 17^{2}\cdot 17 = 31\cdot 25\cdot 17 \equiv 16\cdot 17 = 272 \equiv 8\) ✓

**Marking points**: φ computed correctly; d satisfies \(ed\equiv 1\); decryption uses repeated squaring rather than brute force.

### Example 2: DH key exchange (10 points)

**Question**: p=23, g=5, Alice's a=6, Bob's b=15. Find A, B, and the shared key K.

**Solution**:
- \(A = 5^{6} \bmod 23 = 8\)
- \(B = 5^{15} \bmod 23 = 19\)
- Alice: \(K = B^a = 19^{6} \bmod 23 = 2\)
- Bob: \(K = A^b = 8^{15} \bmod 23 = 2\)

**Marking points**: both sides compute the same K; state that security depends on the discrete log.

### Example 3: DH man-in-the-middle (10 points)

**Question**: describe how Trudy, without breaking the discrete log, makes Alice and Bob each believe they are communicating with the other.

**Solution**:
1. Trudy picks t, intercepts \(g^a\), and sends \(g^t\) to Bob;
2. intercepts \(g^b\) and sends \(g^t\) to Alice;
3. Alice gets \(g^{at}\), Bob gets \(g^{bt}\), and Trudy can compute both;
4. Trudy decrypts/forwards with the two keys respectively, and neither side notices.

**Defense**: **authenticate** DH's exchanged values (certificates/signatures/pre-shared keys).

### Example 4: Birthday attack (8 points)

**Question**: a system uses a 128-bit hash for integrity checking. How many tries does an attacker need to forge a second preimage? How many to find an arbitrary collision?

**Solution**:
- Second preimage (given x, find y): about **2¹²⁸**;
- Arbitrary collision (birthday): about **2⁶⁴**;
- So a 128-bit hash has only 64 bits of "collision resistance", which is no longer enough; at least 256-bit should be used.

### Example 5: Hash chain (8 points)

**Question**: 24 classes, secret t, class 1 sends `H²³(t)`. What should class 5 send? How does the verifier verify it?

**Solution**:
- Class d sends \(H^{24-d}(t)\); d=5 → **`H¹⁹(t)`**.
- Verify: hash the previous value once more; it should equal the value received in class 4 (`H(H¹⁹)=H²⁰`).
- An attacker holding `H¹⁹(t)` cannot derive `H¹⁸(t)` (that requires inverting the hash), so they cannot forge the next value in advance.

### Example 6: Why RSA needs padding (6 points)

**Question**: what is the problem with using \(C=M^e\) directly in textbook RSA?

**Solution**:
- Deterministic: the same M produces the same C, so dictionary/replay attacks work;
- Malleable: \(C_{1}\cdot C_{2} = (M_{1}M2)^e\);
- Signatures are forgeable: \(S(M_{1})\cdot S(M_{2}) = S(M_{1}M2)\).
- Fix: use randomized padding such as OAEP for encryption; use hash + PSS/PKCS#1 v1.5 for signatures.

---

## 8. Common mistakes (where marks are most easily lost)

| Mistake | Correct |
|---|---|
| The RSA private key is (N,d) and the public key is (N,e) | Correct; but p, q, and φ(N) must be kept secret/destroyed |
| A signature = encrypting with the private key, so it also keeps things secret | Wrong; anyone can open it with the public key, it **provides no confidentiality** |
| Sign the message directly, no hash needed | Not feasible for large messages; textbook RSA signatures are also malleable; you must hash-then-sign |
| A MAC gives non-repudiation | It does not; both sides share the key |
| DH can encrypt data | DH only establishes a key, it does not encrypt/sign |
| \(g^a\cdot g^b\) in DH is the shared key | Wrong; it is \(g^{a+b}\), the shared key is \(g^{ab}\) |
| A certificate contains only the public key | It also has the identity, validity period, issuer, signature, etc. |
| A root CA is trusted because of cryptography | It is because of **preinstallation + real-world identity verification**; cryptography only guarantees signature integrity |
| An N-bit hash = N-bit security | Collision resistance is only **N/2** bit |
| Shor breaks AES | Shor breaks RSA/DH; AES only fears Grover (strength halved) |
| Multiplying two large primes is hard to factor, so RSA must be secure | There is currently no general attack faster than factoring, but "RSA hard ⇔ factoring hard" is unproven |

---

## 9. Self-test (do it first, then check the answers)

1. What do "one-way" and "trapdoor" each refer to in a trapdoor one-way function? Give an example.
2. Write out RSA key generation, encryption, and decryption; why does factoring N break RSA?
3. Why does RSA need "mod at each step + repeated squaring"? How many bytes can a 2048-bit RSA encrypt at most?
4. What is hybrid encryption? Why do real systems not encrypt data directly with RSA?
5. Write out the DH protocol flow; why can an attacker who sees \(g^a\) and \(g^b\) not obtain \(g^{ab}\) directly?
6. How does the DH man-in-the-middle attack happen? How do you defend against it?
7. Why do digital signatures give non-repudiation while a MAC does not?
8. Why must you hash before signing? What happens if the hash is collidable?
9. Which fields does a certificate contain? How is the CA's signature verified? Why is a root CA trusted?
10. What are the five properties of a hash? Why is the birthday attack \(2^{N/2}\)?
11. How does a hash chain implement one-time passwords? Why can an attacker not compute the next value in advance?
12. What does Shor's algorithm mean for RSA/DH? Why are symmetric ciphers not affected the same way?

### Answers

1. Easy to compute forward, hard to compute in reverse; once you have the trapdoor (private key), the reverse becomes easy. Example: N=pq is easy to compute, factoring N is hard, and p and q are the trapdoor.
2. Choose \(p,q\); \(N=pq\); \(\varphi=(p-1)(q-1)\); choose \(e\) coprime to \(\varphi\); find \(d\) with \(ed\equiv 1 \pmod{\varphi}\); public key \((N,e)\), private key \(d\). Encrypt \(C=M^e\), decrypt \(M=C^d\). Factor \(N\) to get \(p,q\) → compute \(\varphi\) → use \(e\) to find \(d\).
3. Computing \(M^e\) directly produces huge integers; taking the modulus at each step keeps values \(<N^2\), and repeated squaring cuts the number of multiplications to \(O(\log e)\). 2048-bit → 256 bytes, about 245 bytes after padding.
4. The public key only encrypts/wraps one symmetric key, and the data is encrypted with AES. RSA is slow, limited in message length, and expands the ciphertext; it is unsuitable for transmitting large amounts of data.
5. Alice sends \(g^a\), Bob sends \(g^b\); both sides compute \(g^{ab}\). The attacker only has \(g^a\) and \(g^b\), whose product is \(g^{a+b}\); obtaining \(g^{ab}\) requires solving CDH/discrete log.
6. Trudy establishes a key with each side using \(g^t\), holds both keys, and forwards traffic. Defense: authenticated DH (certificates/signatures/pre-shared keys).
7. Only Alice has the signing private key, Bob cannot forge it, and it can be verified to a third party; for a MAC both sides have K, so Bob can generate it too.
8. Signing a large message directly is slow and the signature is too long; hashing compresses the message into a fixed-length fingerprint. If the hash is collidable, an attacker can replace (M,S) with (M',S) and verification still passes.
9. Version, serial number, signature algorithm, issuer, validity period, subject, subject public key, extensions, signature, etc. Verify the signature with the CA's public key. Root CAs are preinstalled in the system/browser, and their identity rests on real-world verification.
10. Compression, efficiency, one-way, weak collision, strong collision. Birthday paradox: comparing all pairs, about \(\sqrt{2^N}=2^{N/2}\) tries give an expected collision.
11. Class d gets \(H^{24-d}(t)\); the verifier hashes the current value once more and compares it with the previous one. Going from \(H^k(t)\) to \(H^{k-1}(t)\) requires inverting the hash.
12. Shor can factor/solve discrete logs in polynomial time → RSA, DH, and ECDSA fail; symmetric ciphers only get a square-root speedup from Grover, so doubling the key is enough.

---

## 10. Pre-exam quick-reference card

| Item | Content |
|---|---|
| Trapdoor one-way | easy forward, hard reverse, easy with the trapdoor |
| RSA key | N=pq; φ=(p−1)(q−1); ed≡1 mod φ; public key (N,e), private key d |
| RSA encryption/decryption | \(C=M^e \bmod N\); \(M=C^d \bmod N\) |
| RSA security | factoring N |
| RSA length | 2048-bit ≈ 245 bytes of plaintext |
| Repeated squaring | square + multiply on a 1; mod at each step |
| Hybrid encryption | RSA wraps the symmetric key + AES encrypts the data |
| DH | public \(g,p\); private \(a,b\); exchange \(g^a,g^b\); \(K=g^{ab}\) |
| DH security | discrete log; fears MiM; needs authentication |
| Signature | private key signs, public key verifies; non-repudiation; hash first |
| Signature vs MAC | a signature is asymmetric and gives non-repudiation; a MAC is symmetric and does not |
| Certificate | identity+public key+validity period+CA signature; X.509 |
| Chain of trust | root CA preinstalled → intermediate CA → site |
| Five hash properties | compression, efficiency, one-way, weak collision, strong collision |
| Birthday bound | N-bit → \(2^{N/2}\); 23 people / 253 people |
| Hash chain | class d gets \(H^{24-d}(t)\); verify by hashing once more |
| PoW | first N bits are zero; sender \(2^N\), receiver 1 |
| Shor | RSA/DH fail; symmetric only fears Grover |
