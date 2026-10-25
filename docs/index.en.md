# CSIT5730 · Review Notes

> Personal review notes for HKUST **CSIT5730 Principles of Cybersecurity** (2026 Fall).
>
> Unofficial material; the course content and slides are copyrighted by the instructor.

[← Back to personal homepage / Study archive](https://dionysus23334.github.io/study-blogs/)

## Start here

- [**Knowledge outline**](outline.md) — whole-course knowledge map, per-lecture outline, cross-comparison, numbers quick reference, 58 self-test questions
- [**Chapter-by-chapter review notes**](review/index.md) — complete material for 7 chapters: chapter thread, key concepts, worked examples, common mistakes, self-test, quick-reference card
- [**Glossary**](glossary.md) — abbreviations and full names, meanings, and first appearance

## The seven chapters

| Chapter | Topic | Focus |
|---|---|---|
| 1 | [Introduction & Classical Cryptography](review/ch1-intro.md) | CIA, threat model, Kerckhoffs, OTP |
| 2 | [Symmetric Key Cryptography](review/ch2-symmetric.md) | Feistel, DES/AES, ECB/CBC/CTR, MAC |
| 3 | [Public Key Cryptography](review/ch3-public-key.md) | RSA, DH, signatures, PKI, hash birthday bound |
| 4 | [Malware & Reverse Engineering](review/ch4-malware-re.md) | worms/viruses/Trojans, detection, disassembly, cracking |
| 5 | [Buffer Overflow & Obfuscation](review/ch5-buffer-obfuscation.md) | stack frame, ret overwrite, NX/canary/ASLR, obfuscation |
| 6 | [Software Exploitation II & Side Channels](review/ch6-exploit-sidechannel.md) | UAF, format string, SQLi, timing/cache/power |
| 7 | [Authentication & Network Security](review/ch7-auth-network.md) | passwords and salt, biometrics, TCP/DNS/ARP |

## Homework walkthroughs

- [**Homework 1 review**](hw/hw1.md) — classical crypto, OTP, brute force, CTR, MAC, CBC, RSA, signatures, hashing
- [**Homework 2 review**](hw/hw2.md) — disassembly, malware detection, format string, Trusting Trust, buffer overflow

## How to use

1. First read **§1 Global knowledge map** in the knowledge outline to build the framework;
2. Work through each chapter in the order "chapter thread → key concepts → worked examples", and derive each formula yourself;
3. Cover the answers and do each chapter's "Self-test"; for wrong answers, go back to the key concepts;
4. Before the exam, review only each chapter's "quick-reference card" and "Common mistakes".

!!! note "Note"
    These notes are a personal summary and may contain omissions or errors; the slides, lectures, and instructor announcements take precedence.
    Chapters 4/5/6/7 each cover two decks, and are divided into sections within the same chapter.
