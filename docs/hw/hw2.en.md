# Homework 2 · Reverse Engineering & Memory Safety

> The question stems are **desensitized restatements**, not the original assignment text; the answers use plain language as much as possible and do not provide payloads that can be copied directly.
>
> For review only; do not submit directly; the copyright of the course assignment and answers belongs to the instructor.

---

## Problem 1 · Two ways to "scan code"

**Problem**: there are two common approaches to disassembly: one scans byte by byte from beginning to end (linear), and one follows jumps/calls all the way (recursive). Answer three sub-questions:

1. What are the pitfalls of scanning by following jumps?
2. How do you fix that pitfall?
3. What can a developer do to make reverse engineering more painful?

**First, tell the two scanning methods apart**

- **Linear disassembly**: start from the first byte of the code section and decode one instruction after another downward, like reading a book from the first line to the last page.
- **Recursive disassembly**: start from the entry point; whenever you hit `jmp`/`call`, follow the jump there and only decode the places that "really execute".

### (1) Pitfalls of scanning by following jumps

It can only follow **direct** jumps. Hitting an **indirect jump** is trouble, for example:

```asm
jmp eax
call [ebx+4]
```

What address is actually in `eax`? Static code analysis often cannot compute it (it may be a table filled in only at runtime, a virtual function, a callback). If you cannot compute it, you do not know where to go next, so you **miss part of the code**.

**In one sentence**: direct jumps can be followed, indirect jumps are easy to lose track of; code you lose track of is never disassembled.

### (2) How to fix it

- **Combine them**: run the recursive scan first; for regions that "fall in an executable section but are not covered by recursion", fill them in with a linear scan;
- **Compute it**: constant propagation and emulated execution, to derive values such as `eax` as far as possible;
- **Find entries**: use signatures/heuristics to recognize function starts and jump tables;
- **Run it**: dynamic execution/instrumentation, to see which addresses are actually executed.

### (3) How to make reverse engineering more painful

- **Code obfuscation**: control flow flattening, opaque predicates, instruction replacement, so that the code "does not look like its original structure";
- **Packing/encryption**: unpack only at runtime;
- **Anti-disassembly interference**: embed data in the code section so that a linear scan treats data as instructions.

---

## Problem 2 · Are there really more malicious samples than normal software

**Problem**: some people say that the number of malicious samples now exceeds normal software, and signature databases can hardly hold them anymore.

1. Is this claim reliable?
2. If it really is like that, how should signature detection change?

### (1) Is it reliable

**It depends on "how you count"**.

- By **sample/variant** count: one malicious program can automatically generate a large number of polymorphic/metamorphic variants, and the count easily explodes; under this definition, "there are more malicious samples" is entirely possible.
- By **independent program/family** count: the conclusion may be completely different, there are not that many "families".
- Normal software also has many versions, but automated variants of malicious samples cost less.

So the sentence is reasonable under the definition of "counting by sample"; do not treat it as some specific global statistic conclusion.

### (2) How signature detection should change

A traditional signature is "a list of the bad characteristics". When bad samples outnumber good samples, the signature database explodes, and there will always be new variants that slip through.

**Change direction: center on good software (allowlist)**

1. **Trusted hash allowlist**: only let reviewed executable files run;
2. **Isolate unknown files**: not on the allowlist → sandbox/quarantine, instead of "let it through if there is no bad signature";
3. **The allowlist must resist tampering**: sign it and authenticate updates, do not let the attacker modify the allowlist;
4. **Review process**: review new versions first, then add them;
5. **Do not treat "approved" as "vulnerability-free"**: the allowlist only says "this is a program you approved", it does not mean it has no vulnerabilities; behavior monitoring and patch management are still needed.

**In plain terms**: rather than remembering "all the bad guys' faces", only let the "good guys on the list" in the door; people you do not recognize are first shown into a small room instead of being let straight into the office.

---

## Problem 3 · The pitfall of `printf(name)`

**Problem**: the following style of code:

```c
char name[64];
scanf("%63s", name);
printf(name);
```

User input is directly treated as a format string. Answer:

1. What can the user do?
2. Besides reading memory, can it also write?
3. How do you fix it?

### (1) What the user can do

The first argument of `printf` is the "format string"; placeholders such as `%s`, `%d`, `%x` take the arguments after it. But here only one argument, `name`, is passed — where do the later arguments come from? — they are "grabbed" from the stack.

If the user inputs:

```
%s%s%s
```

`printf` then treats three values on the stack as "string addresses" and prints out the memory there. The result may be:

- **leaking memory** (data and addresses on the stack);
- if some value is not a valid address, **the program crashes**.

`%x` also prints stack data in hexadecimal.

### (2) Can it be escalated from read to write

Yes, through **`%n`**.

`%n` prints nothing; instead it **writes** "the number of bytes output so far" to the address pointed to by the corresponding argument:

```c
int val;
printf("blah %n blah\n", &val);
// "blah " is 5 bytes, so val = 5
```

The attacker controls the format string, and therefore also controls the "arguments" that `printf` takes from the stack: they can specify the target address (return address, flag, GOT, etc.), and then use the output width to control the written value. So it escalates from "reading memory" to "arbitrary memory write", further hijacking control flow.

**In plain terms**: `%s` is "read out what is at the address", `%n` is "write a number to the address"; one peeks, one rewrites the books.

### (3) How to fix it

1. **Hard-code the format string**: `printf("%s", name);` — `name` is data, not a format;
2. When formatting is not needed, use `puts(name)`/`fputs`;
3. **Never** `printf(user_input)`;
4. Disable `%n`;
5. Turn on compiler format-string warnings (`-Wformat-security`) and do code auditing.

**Core**: take the format string out of the user's hands.

---

## Problem 4 · The compiler itself is tampered with

**Problem**: a team audited the compiler source code and the account checker source code, and found no malicious code. But the compiler executable `C0` they are using now has been contaminated and hides two rules:

- when compiling "account checker" source code, insert a backdoor into the product;
- when compiling "compiler" source code, insert these two rules into the new compiler.

They use `C0` to compile `C1`, then use `C1` to compile the account checker `A1`.

1. Are `C1` and `A1` clean?
2. Delete `C0`, use `C1` to compile another `C2` — does that solve it?
3. If there is an independent trusted compiler `T`, how do you rebuild?

### (1) C1 and A1

- **C1 contains the hidden rules**: `C0` recognizes "this is compiler source code" and inserts the two rules into C1;
- **A1 contains the backdoor**: C1 recognizes "this is account checker source code" and inserts the backdoor into A1;
- Both source files are clean, but the malicious behavior is "inherited" through the compiler.

**In plain terms**: it is not that something bad was written in the source code; the "translator" secretly adds a sentence while translating, so of course you cannot see it by checking the original text.

### (2) Delete C0, compile C2

**It does not solve it**. C1 already carries the rules; when it compiles compiler source code it inserts the same rules into C2; deleting C0 only deletes the "first generation" binary, later generations are still poisoned.

**Key point**: clean source code ≠ clean compiled binary; source code auditing cannot prove that the compiler is faithful.

### (3) Rebuild with a trusted T

1. In a trusted environment, use `T` to compile "compiler source code" → a clean `C_clean`;
2. Use `C_clean` (or `T` directly) to compile "account checker source code" → a clean A;
3. **Replace all affected binaries**, not just delete C0 or change the source code;
4. Preferably use reproducible builds/diverse double-compiling to prevent contamination again.

**Key point**: swap out "the contaminated build products" and rebuild the toolchain from a trusted root.

---

## Problem 5 · Three login programs (overflow thinking)

**Problem**: there are three login programs; all take username/password from the command line and compare them with the secret in a file. The goal is to use an overflow to bypass the check and see a successful login. The three versions add different protections:

- login1: no canary;
- login2: fixed canary;
- login3: canary computed from the username.

Below we only discuss the **stack layout and the idea**, and do not write out any payload that can be copied directly; the actual offsets must be confirmed with a debugger/disassembly.

> The course also requires the username to start with your own student ID, and the contents of `password.txt` must not be used; not covered here.

### login1: consecutive fields

**Layout**: several fields are lined up next to each other on the stack:

```
entered_name | entered_secret | stored_name | stored_secret
```

**Idea**:

- fill only `entered_name` with the username, at a length that just does not go out of bounds;
- the password starts writing from `entered_secret` and **goes past** its own buffer, overwriting the later `stored_name` and `stored_secret`;
- the program writes a terminator at the end of each field; use filler to "push out" the extra characters;
- at comparison time `entered_name == stored_name`, `entered_secret == stored_secret`, so the check passes.

**In plain terms**: you are not cracking the password, you are changing the "standard answer" to the copy you just wrote in.

### login2: fixed canary

**Layout**: fields interleaved with two tags:

```
entered_name | stored_name | tag1 | stored_secret | tag2 | entered_secret
```

- `tag1` and `tag2` are initially equal;
- the username must overwrite `stored_name`, `tag1`, `stored_secret`, `tag2`, while keeping the two tags equal;
- the password only has to fill `entered_secret`.

**Idea**:

- use filler + the username/password you choose to overwrite the stored fields;
- put the **same value** at both tag positions (the original fixed value, or the same non-zero byte);
- this way the canary check passes and the comparison also passes.

**In plain terms**: the canary is a "fixed passphrase"; you just have to write the passphrase back in the right places and it will not notice.

### login3: dynamic canary

**Layout**: tags are both before and after the password buffer:

```
expected_tag | entered_secret | boundary_tag | stored_secret | stored_name | entered_name
```

- `expected_tag` is **before** the password buffer, so the password overflow cannot touch it;
- `boundary_tag` is after `entered_secret` and will be overwritten by the password;
- the program compares `boundary_tag` with `expected_tag`;
- `expected_tag` is **computed** from the first few student-ID digits of the username, so it cannot be hard-coded.

**Idea**:

1. fill `entered_name` with the username;
2. the password starts at `entered_secret` and overwrites `boundary_tag`, `stored_secret`, `stored_name` in order;
3. use the student-ID digits to compute the 6-byte tag `G` with the formula in the program;
4. put `G` at the offset corresponding to `boundary_tag`, so that `boundary_tag == expected_tag`;
5. put your username in `stored_name` and your password in `stored_secret`;
6. the terminator lands at the end of `stored_name`; do not touch `entered_name`.

**In plain terms**: a dynamic canary is not "impossible to bypass", it is "the passphrase is different every time"; you have to understand how it is computed, then compute one yourself and put it back.

### Common pitfalls in the programming question

| Pitfall | Explanation |
|---|---|
| Copying the payload directly | The offsets change with the compiler/stack layout, and are useless in another environment |
| Username without student ID | Course requirement; no points at all |
| Using the contents of `password.txt` | Forbidden by the problem; treated as the secret |
| Ignoring the terminator | The `\0` at the end of each field changes the comparison |
| Wrong canary position | login2 needs the two tags to be equal; login3 needs the computed G |
| Wrong file format | Two lines: first line username, second line password |

---

## Review checklist

| Problem | Key points |
|---|---|
| 1 | Recursion fears indirect jumps; linear + recursive are complementary; obfuscation/packing |
| 2 | Counting by variant → malware outnumbers; switch to allowlist + isolate unknown + signed updates |
| 3 | `%s` leaks, `%n` arbitrary write; `printf("%s", name)`, ban `%n` |
| 4 | C1 carries the rules, A1 carries the backdoor; deleting C0 is useless; rebuild with trusted T and replace binaries |
| 5 | login1 consecutive fields; login2 fixed tag; login3 dynamic tag must be computed yourself |
