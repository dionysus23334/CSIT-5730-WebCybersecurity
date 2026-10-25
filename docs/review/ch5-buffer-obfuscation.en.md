# Chapter 5 · Buffer Overflow & Obfuscation · Review Notes

> **Matching slides**: `w5/buffer-overflow.pdf`, `w5/obfuscation.pdf`
>
> **Suggested time**: first pass 80 minutes + worked examples 40 minutes + self-test 30 minutes
>
> **Companion**: Outline §2.7, §2.8
>
> **Weight of this chapter**: the stack frame diagram + the overflow exploitation steps + the limitations of the three defenses are guaranteed exam focuses; obfuscation is more conceptual, and the "three kinds + four evaluation dimensions" is the usual question.

---

## 0. Chapter thread (memorize these three sentences first)

1. **C/C++ does no bounds checking + the stack grows toward low addresses** → an over-long input overwrites the return address → a crash or **control-flow hijacking** (executing arbitrary code).
2. Defense is "layered": **W^X makes the stack non-executable, the canary detects the overrun, ASLR makes the address unguessable**; every layer has a bypass, there is no silver bullet.
3. **Obfuscation is not encryption**: it only changes the form of the code (layout/data/control flow), and the goal is to make the resources required for reversing it more expensive than the payoff; evaluation looks at **potency / stealth / resilience / cost**.

**Common question types in this chapter**

| Question type | Typical phrasing | What to prepare |
|---|---|---|
| Diagram | Draw the stack frame and label buf/EBP/ret | Memorize the "high address → low address" order |
| Computation | The offset for buf[64] to overwrite ret, the payload bytes | Be able to compute 64+4 and to write an address in little-endian |
| Defense analysis | What NX/canary/ASLR each prevents, and how to bypass each | Memorize the table |
| Concepts | The three kinds of obfuscation, the four evaluation dimensions | Give 2 examples for each kind |
| Design | Why obfuscation cannot completely prevent RE | Answer "cost + Kerckhoffs + limited search space" |

---

## 1. Buffer overflow

### 1.1 The vulnerability spectrum and "exploitability"★

Bugs that can be potentially exploited (as listed in the slides):

- Null pointer dereference, UAF, double free, array indexing errors, stack/heap overflow;
- Return pointers to local variables, uninitialized variables, invalid use of negative values;
- Passing large parameters by value, underallocations of dynamic data;
- Memory/file handle/network resource leaks, unhandled return codes, use of invalid iterators.

> ⚠ **Not all bugs are exploitable**; logic bugs that are not exploitable do not constitute a vulnerability. Common high-risk ones: **buffer overflow, format string, integer overflow, UAF, type confusion, race condition**.

### 1.2 Process memory layout ★★

```
High address
┌──────────────┐
│ stack        │ ← grows toward low addresses
├──────────────┤
│              │
├──────────────┤
│ heap         │ ← grows toward high addresses
├──────────────┤
│ bss          │ uninitialized globals/statics
├──────────────┤
│ data         │ initialized globals/statics
├──────────────┤
│ text         │ code
└──────────────┘
Low address
```

- Mac/Windows are very similar; the concrete addresses are randomized (ASLR), which changes the base addresses.
- A stack frame (32-bit, simplified, alignment padding ignored):

```
High address
┌─────────────────┐
│ parameters a, b │
├─────────────────┤
│ return address  │ ← overflow target (4 bytes)
├─────────────────┤
│ saved EBP       │ ← 4 bytes
├─────────────────┤
│ local variables │
│ char buf[64]    │ ← write start, written toward high addresses
└─────────────────┘
Low address         ESP
```

- When a function is called, the return address, the stack frame pointer, and the variables are pushed on the stack; **the stack grows toward low addresses while the buffer is written toward high addresses** → the overflow overwrites saved EBP first, then **ret**.

### 1.3 Two kinds of "out-of-bounds" ★

| Type | Behavior | Consequence | Example |
|---|---|---|---|
| **Buffer overread** | Read beyond the buffer | Leaks adjacent memory (can bypass ASLR) | **Heartbleed** (OpenSSL overread) |
| **Buffer overwrite** | Write beyond the buffer | Tampering with adjacent data/return address | Stack overflow, heap overflow |

### 1.4 How the overflow attack works ★★

**The simplest scenario**: next to `char buffer[N]` there is a `boolean flag` (the password-correct flag); an over-long input overwrites the flag → any password is accepted.

**Stack overflow**:

1. Overwrite ret → the program "returns" to the wrong location → a crash (DoS);
2. Worse: make ret point to **injected malicious code** (shellcode) → arbitrary code execution;
3. Also known as: stack smashing, buffer overrun, **code injection**, **control-flow hijacking**.

**Preconditions**:
- A buffer overflow must actually exist in the code;
- **Not all buffer overflows are exploitable**;
- Trial and error is usually needed to guess the address, but "one success is enough".

> ⚠ "What if buffer grows forwardly?" does not solve the problem (the slides say "see my notes") — because ret is still "above" the buffer; only the direction of the overwrite has changed, and the attacker can still construct a layout.

### 1.5 Unsafe C library functions ★

| Function | Problem |
|---|---|
| `strcpy(dest, src)` | Does not check the length of dest |
| `gets(s)` | Has no idea of the buffer size |
| `strcat(dest, src)` | May overrun when appending |
| `scanf("%s", ...)` | Does not limit the width |
| `sprintf(buf, ...)` | The formatted output may be over-long |

> The common problem: **the length of the destination buffer is not checked**; use the length-taking versions such as `strncpy`/`snprintf`/`fgets`, and check the return values.

### 1.6 Exploitation steps (the serial case) ★★

**Scenario**: the program asks for a serial number that you do not know, and you only have the executable (exe); it quits on an incorrect serial number.

1. **Discover the offset**: by trial and error, feed `A` (0x41) with increasing length and observe whether ret is overwritten with `0x41414141` when it crashes → pin down the offset.
2. **Find the target address**: disassemble the code and find the address that "skips the check" (e.g., `0x401034`).
3. **Write the address in little-endian**: `0x401034` → bytes `34 10 40 00` → ASCII `4^P@`.
4. **Construct the payload**: `padding + target address` (plus a NOP sled + shellcode if necessary).
5. **Trigger**: when the program returns it jumps to the target address and bypasses the check.

**Offset computation (32-bit, simplified)**:

```c
char buf[64];
offset(ret) = 64 (buf) + 4 (saved EBP) = 68
payload = b"A"*68 + p32(target)
```

> If the target address contains `0x00`, `strcpy` truncates it → a practical exploit must choose an address free of null bytes (e.g., `0x0804a080` → `\x80\xa0\x04\x08`), or use another way of writing.

**NOP sled**: put a large number of `0x90` bytes in front of the shellcode; as long as ret lands anywhere in the sled it slides into the shellcode, which lowers the difficulty of "guessing the address exactly".

### 1.7 Defenses ★★

| Defense | Mechanism | What it prevents | Limitation/bypass |
|---|---|---|---|
| **W^X / DEP** | Stack/heap marked as non-executable (write XOR execute) | Direct execution of shellcode on the stack | **ROP/return-to-libc** reuses existing code; JIT/self-modifying code needs writable and executable memory |
| **Canary** | A random value placed between the local variables and saved EBP; checked before the function returns | Contiguous stack overflows (the canary must be destroyed to reach ret) | The canary can be **leaked** (format string/info leak); an arbitrary write may leave the canary untouched; not fool-proof; about 8% performance penalty |
| **ASLR** | Randomizes the base addresses of the stack, heap, libraries, and executable | Makes the attacker's address guess miss | 32-bit entropy is low, so it can be brute-forced; **spraying** works; needs an info leak; does not prevent attacks that do not rely on a fixed address |
| **Safe languages** | Automatic bounds checking in Java/C#/Rust, etc. | Removes out-of-bounds access at the root | Requires rewriting/migration; performance, compatibility, FFI |
| **Safe functions** | Library functions with a length parameter + checks | Reduces common mistakes | Depends on the developer using them correctly; logic errors remain |

**Canary details**

- The classic constant `0x000aff0d` (contains `\x00`, `\x0a`, `\xff`, `\x0d`, which prevents string functions from copying it by accident); a random value decided during runtime also works.
- Pushed in the function prologue and compared in the epilogue; a mismatch → `__stack_chk_fail` → termination.
- Bypass: leak the canary first and write it back unchanged; or use a write primitive that does not go through the stack.

**ASLR details**

- The attacker can **repetitively guess the randomized address** (especially since the 32-bit address space is small); they can **spray** a large amount of attack code to raise the hit rate.
- Combined with NX, attackers turn to ROP: stitching attack logic out of existing code fragments (gadgets).

> The modern combination: **ASLR + canary + NX + PIE + CFI**; no single defense is enough.

### 1.8 Why "the buffer growing forwardly" is not the solution

- If the buffer grows toward high addresses, ret is on the low-address side and seems safe from being overwritten;
- but the attacker can overwrite other critical data (function pointers, saved EBP, parameters), or use the heap/other structures;
- the root problem is the **lack of bounds checking**, not the direction of growth.

---

## 2. Software obfuscation

### 2.1 Motivation and threat model ★

- Software contains code that is highly informative: MSIL for .NET, bytecode for Java/JS/Python, binary code for C/C++.
- Code can be exploited:
  - Non-malicious RE: for testing, integration, extending;
  - Malicious RE: for security attacking, piracy, plagiarism;
  - malware authors also want to evade **malware clustering/similarity analysis**.
- **Mobile code + "malicious" hosts**: the code runs on someone else's machine and the host is not trustworthy → "software protection" is needed.

### 2.2 Why existing protection is not enough ⚠

| Approach | Problem |
|---|---|
| Hardware isolation | Retrofit hardware is needed; not viable |
| Server-side execution | Requires always-on high bandwidth; authentication and other network security problems also need to be taken care of |
| Encryption | **Chicken-egg problem**: the decryption routine itself is visible, so the attacker always ends up with the decrypted code |

### 2.3 Goal and limits ★

- Obfuscation: making protected software "look" dissimilar to its original version; **determining the "similarity" of two pieces of code** is the building block of many software security analyses.
- It **can never completely** protect an application from malicious RE: given sufficient time and resources, any obfuscated code can be reversed (exhaustive search).
- The right goal: **make the resources required for undoing the transforms too expensive for attackers** (raise the cost instead of pursuing absolute security).

### 2.4 The three kinds of obfuscation ★★

#### (1) Layout obfuscation

- Comment stripping and identifier renaming (classes/methods/variables → meaningless names).
- Tools: DashO (Java), Dotfuscator (MSIL).
- Characteristics: **very lightweight**, does not change semantics; in the real world plenty of popular apps are not even layout obfuscated.

#### (2) Data obfuscation

- Variable splitting, merging, and encoding.
- Arrays split into several sub-arrays, two or more arrays merged into one bigger array, arrays folded so as to increase the number of dimensions, arrays flattened to decrease the number of dimensions.
- Data encryption (e.g., string encryption, very common in mobile apps).
- Goal: make it harder to infer "what the data is and how it is used".

#### (3) Control-flow obfuscation ★

**Premise**: layout/data obfuscation does not change the control structure of the program → the control structure can still be leveraged as a code signature.

**Method 1: instruction insertion (garbage code insertion)**

- Insert meaningless instructions or sequences of instructions: `nop`; or a semantically canceling sequence: `add → sub`, `xor → xor`.
- Advantages: easy to implement, and can easily break known patterns/signatures.

**Method 2: instruction replacement/substitution**

- Replace the original instructions with an equivalent sequence of instructions.
- Extreme case: **M/o/Vfuscator** compiles C/C++ programs into `mov` instructions, and only "mov" instructions.

**Method 3: control flow flattening**

- Put all the basic blocks of the function into a single `switch(x)` dispatcher, driven by the state variable x.
- The original CFG is "flattened" and loses its obvious branch/loop structure.

Example: function `f(i,j)`: `a=1; if(i<j) a=j; do { a*=i--; } while(i>0); return a;`

| Original basic block | State after flattening |
|---|---|
| A: `a=1` | `x=0` → case 0: A; `x = (i<j) ? 1 : 2` |
| B: `a=j` | case 1: B; `x=3` |
| C: `a=a*i; i=i-1` | case 2: C; `x = (i>0) ? 2 : 3` |
| D: `return a` | case 3: D |

The outer layer keeps only a single `while(true) switch(x)`.

**Method 4: opaque predicates**

- The value of the conditional expression is **known** at runtime, but difficult for the adversary to deduce by statically analyzing the code.
- Example: `if (x*x + y*y >= 2*x*y)` is always true, because \((x-y)^{2} \ge 0\); in assembly it is even less obvious.
- Types:
  - **Invariant**: always true/always false, independent of the input;
  - **Context**: holds only in a specific context;
  - **Multi-threading**: one thread puts random numbers `>n` into a global data structure, another thread takes one of these numbers and assigns it to x → `if (x<n)` is always false.
- The opacity property of predicates determines the **resilience** of control-flow transformations.

**Advanced**

- **VM-based obfuscation**: invent new instruction sets with secret encodings + a virtual CPU/dispatcher; it has been commercialized; not a fool-proof technique, but it makes analysis significantly more difficult.
- **Multilingual obfuscation**: "mixing" different computation models (imperative = Turing machine, functional = lambda calculus, logic = Horn logic); after translation and compilation the machine code is harder to understand.

### 2.5 Evaluating obfuscation effectiveness ★★

| Dimension | Meaning | Measurement |
|---|---|---|
| **Potency** | How much complexity the obfuscation introduces | Number of call graph edges, basic blocks, CFG edges, etc. |
| **Stealth** | How well obfuscated code blends in with the rest of the program | Instruction distribution anomaly test |
| **Resilience** | How difficult it is to undo the obfuscation | Diffing techniques to test similarity between obfuscated and original binaries |
| **Cost** | Performance penalty caused by obfuscation | Size, execution slowdown |

> The four need to be traded off: high potency may mean high cost; good stealth may mean low resilience.

### 2.6 Why "good" obfuscation is hard to design ⚠

- Coming up with "interesting" obfuscation mutations is not too difficult, it requires some creativity; coming up with "secure" obfuscation mutations is very difficult.
- Especially when people are aware of your obfuscation method (**an extension of Kerckhoffs**).
- Open design with no real secret and a limited search space is not good in principle.

---

## 3. Worked examples

### Example 1: ret offset (8 points)

**Question**: In a 32-bit program, a function contains `char buf[64]`, with no alignment padding; saved EBP is 4 bytes, ret is 4 bytes. How many bytes of padding are needed to overwrite ret?

**Answer**:
- buf is 64 bytes;
- saved EBP is 4 bytes;
- therefore ret begins at byte **68** from the start of buf;
- payload = `b"A"*68 + p32(target)`.

**Scoring points**: state that "saved EBP is overwritten first, then ret"; mention that a real compiler may add alignment padding, which must be confirmed dynamically.

### Example 2: little-endian payload (8 points)

**Question**: The target address is `0x0804a080`; write out the address bytes in the payload.

**Answer**:
- little-endian: the low byte comes first → `80 a0 04 08`;
- Python: `p32(0x0804a080)` = `b"\x80\xa0\x04\x08"`.
- If the address contains `\x00` (e.g., `0x08048400`), `strcpy` truncates it; change the address or change the way of writing.

### Example 3: canary principle (8 points)

**Question**: How does the canary detect a stack overflow? How does the attacker bypass it?

**Answer**:
- The compiler places a random value between the local variables and saved EBP; before the function returns it compares whether that value has been changed; a mismatch calls `__stack_chk_fail` and terminates.
- A contiguous overflow must pass through the canary to reach ret, so it is detected.
- Bypass: ① leak the canary and write it back unchanged (format string/info leak); ② use an arbitrary write that does not go through that stack frame; ③ overwrite a path that does not trigger the check.

### Example 4: the limits of ASLR (8 points)

**Question**: ASLR randomizes addresses, so why can a 32-bit program still be bypassed?

**Answer**:
- The entropy of the 32-bit address space is limited, so the attacker can **brute-force the guess** (retry repeatedly, restarting after a crash);
- **heap/stack spraying** can lay out a large amount of attack code/ROP gadgets to raise the hit rate;
- an info leak is needed to disclose the base address; or the attacker turns to an attack that does not need a fixed address (e.g., partial overwrite).
- Therefore ASLR must be combined with NX, canary, CFI, etc.

### Example 5: control flow flattening (10 points)

**Question**: Flatten `a=1; if(i<j) a=j; do{a*=i--;}while(i>0); return a;` with a switch dispatcher.

**Answer**:

```c
x = 0;
while (1) {
  switch (x) {
    case 0: a = 1; x = (i < j) ? 1 : 2; break;
    case 1: a = j; x = 3; break;
    case 2: a = a * i; i = i - 1; x = (i > 0) ? 2 : 3; break;
    case 3: return a;
  }
}
```

- The branches/loops of the original CFG are "hidden" in the assignments to the state variable x; static analysis must first recover the values of x before it can rebuild the CFG.

### Example 6: opaque predicates (6 points)

**Question**: Why is `if (x*x + y*y >= 2*x*y)` always true? What is the precondition?

**Answer**:
- \(x^{2} + y^{2} - 2xy = (x-y)^{2} \ge 0\);
- therefore it is always true for any real numbers x and y; in assembly it is not easy to see.
- Precondition: the integer arithmetic does not overflow; if it overflows the predicate may be false (this must be considered at design time).

### Example 7: evaluating obfuscation (8 points)

**Question**: An obfuscator makes a program 3× larger and 40% slower to run, but its instruction distribution differs clearly from normal code. Evaluate it with the four dimensions.

**Answer**:
- **Cost**: poor (3× size, 40% slower);
- **Stealth**: poor (the instruction distribution is anomalous and easily caught by statistical detection);
- **Potency**: need to see whether the CFG/basic block complexity really increases;
- **Resilience**: need diffing/similarity analysis to see how hard it is to undo.
- Conclusion: this obfuscation is "visually complex", but stealth and cost are unsatisfactory, so the overall effect is limited.

---

## 4. Common mistakes (where points are lost most easily)

| Mistake | Correct |
|---|---|
| The stack grows toward high addresses | The stack grows toward **low addresses**; the buffer is written toward high addresses |
| An overflow always overwrites ret | It may only overwrite local variables/EBP; it depends on the layout and the length |
| All overflows are exploitable | Many only cause a crash; exploitability depends on the layout, the address, and the protections |
| NX prevents all code execution | It prevents "execution on the stack"; ROP/return-to-libc bypasses it |
| The canary is fool-proof | It can be leaked/bypassed; it does not protect non-contiguous writes |
| ASLR makes attacks impossible | 32-bit can be brute-forced; spraying works; an info leak is needed |
| Using safe functions makes you safe | Logic errors and length-computation errors remain |
| Obfuscation = encryption | Obfuscation does not keep secrets, it only raises the cost of understanding; encryption has a key |
| Obfuscation can completely prevent RE | It cannot; it can only raise the cost |
| The higher the potency the better | The trade-off with stealth/resilience/cost also matters |
| Control flow flattening changes the program semantics | It does not; it only hides the CFG in the state variable |

---

## 5. Self-test (do it first, then look at the answers)

1. Draw a 32-bit stack frame and label the order of the parameters, ret, saved EBP, and buf.
2. Why can an overflow overwrite the return address? In which direction does the stack grow?
3. What is the difference between overread and overwrite? Which one is Heartbleed?
4. List 5 unsafe C library functions and explain their common problem.
5. Describe the complete exploitation steps of a stack overflow; what is the role of the NOP sled?
6. What does each of W^X, canary, and ASLR prevent? What is each one's limitation?
7. Why does "letting the buffer grow toward high addresses" not solve the problem?
8. What are the three kinds of obfuscation? Give two concrete methods for each.
9. What is the principle of control flow flattening? What is the essence of an opaque predicate?
10. On which four dimensions is obfuscation effectiveness evaluated? Why is "secure obfuscation" hard?
11. What are VM-based obfuscation and multilingual obfuscation?

### Answers

1. High → low: parameters, ret, saved EBP, local variables (buf is at the low-address end, closest to ESP).
2. The stack grows toward low addresses and buf is written toward high addresses; ret is above buf, so an over-long write passes saved EBP first and then reaches ret.
3. overread reads out of bounds (leak), overwrite writes out of bounds (tampering); Heartbleed is an overread.
4. `strcpy`, `gets`, `strcat`, `scanf("%s")`, `sprintf`; none of them checks the length of the destination buffer.
5. Discover the offset → find the target address → write the address in little-endian → construct the payload (padding + address, optionally with a NOP sled/shellcode) → trigger the return. The NOP sled lowers the precision required of the address guess.
6. W^X: the stack is non-executable, preventing shellcode; it can be bypassed by ROP. canary: detects contiguous overflows; it can be leaked/bypassed. ASLR: randomizes addresses; 32-bit can be brute-forced and sprayed.
7. The root problem is the lack of bounds checking; ret can still be overwritten through another layout/structure, or function pointers/parameters can be changed.
8. Layout (renaming, comment stripping); data (array splitting/merging, string encryption); control flow (garbage instructions, instruction substitution, flattening, opaque predicates).
9. Put all basic blocks into a switch dispatcher driven by a state variable; an opaque predicate is a conditional whose "value is known at runtime but difficult to deduce statically".
10. Potency, Stealth, Resilience, Cost; because the method is open (Kerckhoffs), there is no real secret and the search space is limited, so an attacker can reverse it in a targeted way.
11. VM-based: a custom instruction set + a virtual CPU interpreting it; multilingual: mixing different computation models such as imperative/functional/logic.

---

## 6. Pre-exam quick-reference card

| Item | Content |
|---|---|
| Stack direction | The stack grows toward low addresses; buf is written toward high addresses |
| 32-bit stack frame | parameters / ret / saved EBP / buf (low address) |
| Offset | `buf[64]` → ret offset 68 (64+4) |
| Little-endian | The low byte comes first; `0x0804a080` → `80 a0 04 08` |
| Dangerous functions | strcpy, gets, strcat, scanf, sprintf |
| Aliases | stack smashing, code injection, control-flow hijacking |
| W^X | The stack is non-executable; bypass: ROP/return-to-libc |
| Canary | `0x000aff0d` or random; about 8% overhead; can be leaked |
| ASLR | Randomizes base addresses; low 32-bit entropy; can be sprayed/brute-forced |
| Three kinds of obfuscation | layout / data / control-flow |
| Control-flow methods | garbage instructions, instruction substitution (mov-only), flattening, opaque predicates |
| Opaque predicates | \((x-y)^{2}\ge 0\); invariant/context/multi-threading |
| Evaluation | potency / stealth / resilience / cost |
| Limits | Obfuscation only raises the cost; it cannot completely prevent RE |
