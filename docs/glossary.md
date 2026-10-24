# 术语表 · 缩写与专有名词

> 正文中每个缩写在**该页第一次出现**时会自动展开全称和中文含义；本页是可搜索的完整索引。
>
> “首次出现”按第 1–7 章与作业复盘的阅读顺序计算；点击章节可跳到对应页面。

## 缩写

| 缩写 | 全称 | 含义 | 首次出现 |
|---|---|---|---|
| **3DES** | Triple Data Encryption Standard | 三重 DES | [第 2 章 · 0. 本章主线（先记住这三句）](review/ch2-symmetric.md) |
| **AE** | Authenticated Encryption | 认证加密 | [第 2 章 · 3.6 完整性：MAC](review/ch2-symmetric.md) |
| **AES** | Advanced Encryption Standard | 高级加密标准 | [第 1 章 · 2.1 基本语汇与 Kerckhoffs 原则](review/ch1-intro.md) |
| **AES-NI** | AES New Instructions | AES 硬件指令集 | [第 2 章 · 1.1 定位](review/ch2-symmetric.md) |
| **ARP** | Address Resolution Protocol | 地址解析协议 | [第 1 章 · 1.1 CIA 三要素（必须能脱口而出）](review/ch1-intro.md) |
| **ASLR** | Address Space Layout Randomization | 地址空间布局随机化 | [第 5 章 · 0. 本章主线（先记住这三句）](review/ch5-buffer-obfuscation.md) |
| **CA** | Certificate Authority | 证书颁发机构 | [第 3 章 · 5.1 问题](review/ch3-public-key.md) |
| **CBC** | Cipher Block Chaining | 密码分组链接模式 | [第 2 章 · 0. 本章主线（先记住这三句）](review/ch2-symmetric.md) |
| **CFG** | Control Flow Graph | 控制流图 | [第 4 章 · 2.5 现代 C/C++ 反编译流水线](review/ch4-malware-re.md) |
| **CFI** | Control Flow Integrity | 控制流完整性 | [第 5 章 · 1.7 防御](review/ch5-buffer-obfuscation.md) |
| **CIA** | Confidentiality, Integrity, Availability | 机密性、完整性、可用性 | [第 1 章 · 0. 本章主线（先记住这三句）](review/ch1-intro.md) |
| **CPU** | Central Processing Unit | 中央处理器 | [第 1 章 · 1.3 防御者的三件事](review/ch1-intro.md) |
| **CRL** | Certificate Revocation List | 证书吊销列表 | [第 3 章 · 5.3 证书生命周期](review/ch3-public-key.md) |
| **CTR** | Counter Mode | 计数器模式 | [第 2 章 · 0. 本章主线（先记住这三句）](review/ch2-symmetric.md) |
| **DEP** | Data Execution Prevention | 数据执行保护 | [第 5 章 · 1.7 防御](review/ch5-buffer-obfuscation.md) |
| **DES** | Data Encryption Standard | 数据加密标准 | [第 1 章 · 2.3 “安全”的操作性定义](review/ch1-intro.md) |
| **DH** | Diffie–Hellman | 迪菲–赫尔曼密钥交换 | [第 1 章 · 1.2 漏洞从哪里来（设计 vs 实现）](review/ch1-intro.md) |
| **DNS** | Domain Name System | 域名系统 | [第 7 章 · 0. 本章主线（先记住这三句）](review/ch7-auth-network.md) |
| **DoS** | Denial of Service | 拒绝服务 | [第 1 章 · 1.1 CIA 三要素（必须能脱口而出）](review/ch1-intro.md) |
| **DPA** | Differential Power Analysis | 差分功耗分析 | [第 6 章 · 4.5 功耗侧信道](review/ch6-exploit-sidechannel.md) |
| **EBP** | Extended Base Pointer | 扩展基址指针 | [第 5 章 · 0. 本章主线（先记住这三句）](review/ch5-buffer-obfuscation.md) |
| **ECB** | Electronic Codebook | 电子密码本模式 | [第 1 章 · 1.1 CIA 三要素（必须能脱口而出）](review/ch1-intro.md) |
| **EDE** | Encrypt-Decrypt-Encrypt | 加密-解密-加密（3DES 的两密钥结构） | [第 2 章 · 0. 本章主线（先记住这三句）](review/ch2-symmetric.md) |
| **EER** | Equal Error Rate | 等错误率 | [第 7 章 · 0. 本章主线（先记住这三句）](review/ch7-auth-network.md) |
| **ESP** | Extended Stack Pointer | 扩展栈指针 | [第 5 章 · 答案](review/ch5-buffer-obfuscation.md) |
| **GOT** | Global Offset Table | 全局偏移表 | [第 6 章 · 例 2：格式化字符串（10 分）](review/ch6-exploit-sidechannel.md) |
| **GSM** | Global System for Mobile Communications | 全球移动通信系统 | [第 2 章 · 1.1 定位](review/ch2-symmetric.md) |
| **HTTP** | HyperText Transfer Protocol | 超文本传输协议 | [第 7 章 · 2.2 五层协议栈](review/ch7-auth-network.md) |
| **ICMP** | Internet Control Message Protocol | 互联网控制消息协议 | [第 7 章 · 2.5 网络层](review/ch7-auth-network.md) |
| **IMAP** | Internet Message Access Protocol | 互联网消息访问协议 | [第 7 章 · 2.3 应用层](review/ch7-auth-network.md) |
| **IP** | Internet Protocol | 网际协议 | [第 7 章 · 0. 本章主线](review/ch7-auth-network.md) |
| **IV** | Initialization Vector | 初始化向量 | [第 2 章 · 3.3 CBC（Cipher Block Chaining）](review/ch2-symmetric.md) |
| **KSA** | Key Scheduling Algorithm | 密钥调度算法（RC4 初始化） | [第 2 章 · 1.3 RC4（软件流密码）](review/ch2-symmetric.md) |
| **MAC** | Message Authentication Code | 消息认证码（网卡语境下也指 Media Access Control） | [第 1 章 · 1.1 CIA 三要素](review/ch1-intro.md) |
| **MD5** | Message Digest 5 | 消息摘要算法第 5 版 | [第 3 章 · 4.3 先哈希再签名（hash-then-sign）](review/ch3-public-key.md) |
| **MITM** | Man-in-the-Middle | 中间人攻击 | [第 2 章 · 0. 本章主线（先记住这三句）](review/ch2-symmetric.md) |
| **NAT** | Network Address Translation | 网络地址转换 | [第 7 章 · 0. 本章主线（先记住这三句）](review/ch7-auth-network.md) |
| **NOP** | No Operation | 空操作指令 | [第 5 章 · 1.6 利用步骤（serial 案例）](review/ch5-buffer-obfuscation.md) |
| **NX** | No-eXecute | 不可执行位 | [第 5 章 · 0. 本章主线（先记住这三句）](review/ch5-buffer-obfuscation.md) |
| **OTP** | One-Time Pad | 一次性密码本 | [第 1 章 · 导论与古典密码 · 复习资料](review/ch1-intro.md) |
| **PE** | Portable Executable | Windows 可移植可执行文件格式 | [第 4 章 · 1.3 病毒与 PE 文件](review/ch4-malware-re.md) |
| **PIE** | Position-Independent Executable | 位置无关可执行文件 | [第 5 章 · 1.7 防御](review/ch5-buffer-obfuscation.md) |
| **PIN** | Personal Identification Number | 个人识别码 | [第 7 章 · 1.2 三种认证因子](review/ch7-auth-network.md) |
| **PKI** | Public Key Infrastructure | 公钥基础设施 | [第 3 章 · 0. 本章主线（先记住这三句）](review/ch3-public-key.md) |
| **POP3** | Post Office Protocol version 3 | 邮局协议第 3 版 | [第 7 章 · 2.3 应用层](review/ch7-auth-network.md) |
| **PRGA** | Pseudo-Random Generation Algorithm | 伪随机生成算法（RC4 产流） | [第 2 章 · 1.3 RC4（软件流密码）](review/ch2-symmetric.md) |
| **RC4** | Rivest Cipher 4 | 由 Ron Rivest 设计的流密码 | [第 2 章 · 1.1 定位](review/ch2-symmetric.md) |
| **RE** | Reverse Engineering | 逆向工程 | [第 4 章 · 恶意软件与逆向工程 · 复习资料](review/ch4-malware-re.md) |
| **ROP** | Return-Oriented Programming | 返回导向编程 | [第 5 章 · 1.7 防御](review/ch5-buffer-obfuscation.md) |
| **RSA** | Rivest–Shamir–Adleman | 由三位作者姓氏命名的公钥算法 | [第 2 章 · 4. 量子计算与对称密码](review/ch2-symmetric.md) |
| **SHA** | Secure Hash Algorithm | 安全哈希算法 | [第 3 章 · 4.3 先哈希再签名（hash-then-sign）](review/ch3-public-key.md) |
| **SMTP** | Simple Mail Transfer Protocol | 简单邮件传输协议 | [第 7 章 · 2.2 五层协议栈](review/ch7-auth-network.md) |
| **SPA** | Simple Power Analysis | 简单功耗分析 | [第 6 章 · 4.2 类型](review/ch6-exploit-sidechannel.md) |
| **SQLi** | SQL Injection | SQL 注入 | [第 6 章 · 软件利用 II 与侧信道 · 复习资料](review/ch6-exploit-sidechannel.md) |
| **TCP** | Transmission Control Protocol | 传输控制协议 | [第 7 章 · 0. 本章主线（先记住这三句）](review/ch7-auth-network.md) |
| **TEA** | Tiny Encryption Algorithm | 微型加密算法 | [第 2 章 · 0. 本章主线（先记住这三句）](review/ch2-symmetric.md) |
| **TLS** | Transport Layer Security | 传输层安全协议 | [第 3 章 · 2.5 消息长度与混合加密](review/ch3-public-key.md) |
| **TTL** | Time To Live | 生存时间 | [第 7 章 · 例 5：DNS 投毒（10 分）](review/ch7-auth-network.md) |
| **UAF** | Use-After-Free | 释放后使用 | [第 1 章 · 1.2 漏洞从哪里来（设计 vs 实现）](review/ch1-intro.md) |
| **UDP** | User Datagram Protocol | 用户数据报协议 | [第 4 章 · 1.2 蠕虫案例](review/ch4-malware-re.md) |
| **VM** | Virtual Machine | 虚拟机 | [第 1 章 · 1.3 防御者的三件事](review/ch1-intro.md) |
| **X.509** | X.509 Public Key Certificate Standard | X.509 公钥证书标准 | [第 3 章 · 0. 本章主线（先记住这三句）](review/ch3-public-key.md) |
| **XOR** | Exclusive OR | 异或运算 | [第 1 章 · 0. 本章主线（先记住这三句）](review/ch1-intro.md) |

## 专有名词

| 名称 | 说明 | 首次出现 |
|---|---|---|
| **Feistel** | Feistel 结构：一种分组密码框架，DES/3DES 等采用 | [第 2 章 · 2.1 Feistel 结构](review/ch2-symmetric.md) |
| **Kerckhoffs** | Kerckhoffs 原则：安全只依赖密钥，不依赖算法保密 | [第 1 章 · 2.1 基本语汇](review/ch1-intro.md) |
| **Saltzer & Schroeder** | 安全设计原则：开放设计、机制最小化、最小权限等 | [第 1 章 · 1.4](review/ch1-intro.md) |
| **Merkle–Damgård** | 哈希函数的迭代压缩结构 | [第 3 章 · 6.3](review/ch3-public-key.md) |
| **Diffie–Hellman** | 基于离散对数的密钥交换协议 | [第 3 章 · 3.1](review/ch3-public-key.md) |
| **Ghidra** | NSA 开源的逆向工程/反编译框架 | [第 4 章 · 2.2](review/ch4-malware-re.md) |

> 说明：同一个缩写在不同的课程/语境下可能有不同全称（例如 MAC 在密码学是消息认证码，在网卡是介质访问控制）；表中按本课程语境给出。
