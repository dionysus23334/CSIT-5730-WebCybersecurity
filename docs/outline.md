# CSIT5730 Principles of Cybersecurity · 知识大纲

> **范围**：`slides/w1–w7` 共 12 份课件（导论、古典密码、对称密码、公钥密码、恶意软件、逆向工程、缓冲区溢出、混淆、软件利用 II、侧信道、认证、网络基础与安全）。
>
> **用法**：先看 §1 建立全局地图 → 按讲看 §2 的细节树 → 考前看 §3 的数字速记与横向对比 → 用 §4 自测。
>
> **标记**：★ 核心机制/高频考点；⚔ 攻击；🔧 防御；⚠ 易混/易错。

---

## 0. 课程信息

| 项目 | 内容 |
|---|---|
| 课程 | CSIT5730: Principles of Cybersecurity（PG 导论课） |
| 教师 | Shuai Wang（HKUST CSE） |
| 评分 | 作业 ×3：30%（第 2 次含编程）／期中：20%（10/26，课上）／期末：25%／小组项目：25% |
| 教材 | 可选：*Introduction to Computer Security*；*Information Security: Principles and Practice* |
| 主线 | 以真实世界问题驱动，训练 **attacker / defender 双向思维**，而非单纯堆砌技术 |

**全课五块内容**（w1 课件给出的地图）：

1. 安全基础与定义：CIA、攻击模型
2. 密码学：古典、对称、公钥、签名、认证、哈希
3. 软件安全：内存错误、缓冲区溢出、混淆、恶意软件、安全测试
4. 系统与 Web 安全：认证、访问控制、协议、浏览器安全、侧信道
5. 新兴平台：区块链/智能合约、AI 安全

> 注：区块链与 AI 安全只在 w1 导论中作为“领域概览”出现，后续课件未展开；复习时按“了解概念 + 能举例”掌握即可。

---

## 1. 全局知识地图

<div class="kmap">
<div class="kmap-top">安全目标 · CIA</div>
<div class="kmap-three">
<div class="kmap-card"><span class="kmap-k">C</span><b>Confidentiality</b><p>密码学：古典 → 对称 → 公钥；加密</p></div>
<div class="kmap-card"><span class="kmap-k">I</span><b>Integrity</b><p>MAC、哈希、数字签名、证书</p></div>
<div class="kmap-card"><span class="kmap-k">A</span><b>Availability</b><p>DoS / DDoS、蠕虫、资源泄漏</p></div>
</div>
<div class="kmap-split">
<div class="kmap-panel">
<div class="kmap-h">攻击者视角</div>
<div class="kmap-item"><b>漏洞来源</b><span>设计缺陷 vs 实现缺陷</span></div>
<div class="kmap-item"><b>攻击面</b><span>协议栈、内存、密码实现、人</span></div>
<div class="kmap-item"><b>攻击链</b><span>侦察 → 入口 → 提权 → 持久化 → 窃密</span></div>
</div>
<div class="kmap-panel">
<div class="kmap-h">防御者视角</div>
<div class="kmap-item"><b>security policy</b><span>要保护什么性质</span></div>
<div class="kmap-item"><b>risk assessment</b><span>资产、关键性、优先级</span></div>
<div class="kmap-item"><b>threat model</b><span>谁、能力、想偷什么</span></div>
<div class="kmap-item"><b>cost / benefit</b><span>成本收益 + 设计原则</span></div>
</div>
</div>
<div class="kmap-h kmap-h-tech">技术专题</div>
<div class="kmap-four">
<div class="kmap-tech"><b>密码学</b><span>classic → symmetric → public-key → hash</span></div>
<div class="kmap-tech"><b>软件安全</b><span>malware / RE / memory corruption / obfuscation</span></div>
<div class="kmap-tech"><b>系统与网络</b><span>authentication / protocols / side channel</span></div>
<div class="kmap-tech"><b>新兴</b><span>blockchain / AI</span></div>
</div>
</div>

**各讲与 CIA 的对应关系**

| 讲 | 主题 | 主要对应 |
|---|---|---|
| w1 | 导论、安全思维、古典密码 | 三者 + 威胁建模 |
| w2 | 对称密码、分组模式、MAC | C + I |
| w3 | 公钥、DH、签名、PKI、哈希 | C + I + 认证 |
| w4 | 恶意软件、逆向工程 | A + C/I（窃密） |
| w5 | 缓冲区溢出、混淆 | C/I + 控制流劫持 |
| w6 | UAF/双重释放/格式化字符串/SQLi、侧信道 | C/I + 信息泄露 |
| w7 | 认证（密码/生物特征）、网络协议安全 | 认证 + A |

---

## 2. 分讲大纲

### W1-A 导论：安全思维（introduction）

**一句话**：安全是攻击者与防御者之间无休止的军备竞赛；先学会像攻击者一样找漏洞，再像防御者一样定义策略、评估风险、建立威胁模型。

#### 2.1.1 安全三要素 CIA ★

| 要素 | 定义 | 典型破坏 |
|---|---|---|
| **Confidentiality** 机密性 | 未经授权者不能读取数据 | 窃听、侧信道、数据泄露 |
| **Integrity** 完整性 | 数据是准确、未被篡改的原始表示 | 篡改、MAC 缺失、注入 |
| **Availability** 可用性 | 授权用户随时可访问 | DoS、蠕虫、资源耗尽 |

> 记忆：**CIA** 不是“中央情报局”，任何攻击都可以归到这三类中的一类或多类。后面每一讲都应主动问：**这一攻击破坏的是 C/I/A 中的哪一个？**

#### 2.1.2 漏洞从哪里来 ★

**设计层面（design）**
- 理论上的局限（如 OTP 的密钥分发）
- 缺少安全特性（如没有认证）
- 侧信道（实现无关，物理信息泄露）
- 错误的威胁模型（threat model 假设错）
- 错误的用户模型（假设用户会怎么做）

**实现层面（implementation）**
- 编码错误（buffer overflow、UAF…）
- 硬件错误
- 被注入的错误（供应链、编译器后门）
- 未满足规范（failure to meet specifications）

**攻击者获取漏洞的途径**
1. 挖掘未知漏洞（0-day）——难
2. 购买 0-day——可以，但贵
3. 复用已知漏洞——相对容易（补丁未打、老系统）

#### 2.1.3 像攻击者思考 ⚔

- 白帽为什么也要学攻击：先发现才能修复；理解未知威胁；帮厂商造更安全的系统；拿漏洞奖金。
- 关键心态：**“这个系统的假设在什么情况下会失效？”**

#### 2.1.4 像防御者思考 🔧 ★

| 概念 | 要回答的问题 | 例子 |
|---|---|---|
| **Security policy** | 我要强制什么性质？ | 密码只能存在我的手机里；C 代码的数据指针只能访问特定内存区 |
| **Risk assessment** | 有哪些资产？多关键？先保护谁？ | 网络、服务器、应用、数据中心、数据；按 criticality 排优先级 |
| **Threat model** | 谁攻击？有什么能力？想偷什么？ | 云平台：服务商可控制一切；同租户共享硬件 → 侧信道 |
| **Cost vs. benefit** | 防御代价是否值得？ | 在线监控（简单但拖慢性能）vs 离线形式化验证（极难但无运行时开销） |

> 威胁模型三问是后面所有攻击场景的“前置声明”：**attacker / capability / asset**。考试里凡出现“这个攻击是否可行”，先回到威胁模型。

#### 2.1.5 Saltzer & Schroeder 安全设计原则 ★

课件重点讲了 3 条：

1. **Open design**（开放设计）vs. security by obscurity：算法公开、只保密密钥。理由：秘密算法一旦暴露就脆弱；秘密从来保不住；开放才能提前发现弱点。
2. **Economy of mechanism**（机制最小化）：接口清晰、避免全局状态，便于调试、代码审计、静态/动态分析、形式化验证。
3. **Least privilege**（最小权限）：精确授予程序运行所需的最小能力；实践方法：先什么都不给，再按报错逐步加。

> 经典完整列表还有：fail-safe defaults、complete mediation、separation of privilege、least common mechanism、psychological acceptability（课件注明“部分原则今天未必适用”，作为课后阅读）。

#### 2.1.6 课程主题预览（能举例即可）

- **逆向工程**：如何破解 Windows 软件的密码保护？
- **侧信道**：不能利用软件漏洞时，用执行时间、功耗、电磁、声音、热量、缓存推断秘密。
- **区块链**：Bitcoin（交易上链、匿名地址像银行账户）；Ethereum（智能合约 = 链上程序，地址可以是用户或合约）。
- **AI 安全**：对抗样本导致分类/目标检测失败。

---

### W1-B 古典密码（classic crypto）

**一句话**：古典密码用“手工可算”的方式建立密码学基本语汇；OTP 给出“可证明安全”的极限，但也暴露了密钥分发的根本难题。

#### 2.2.1 基本语汇与假设 ★

- 明文 plaintext → 加密 encryption → 密文 ciphertext → 解密 decryption → 明文。
- 密钥 key 配置密码系统。
- **对称**：加密解密同一密钥；**公钥**：公钥加密、私钥解密。
- 计算安全性的直觉：**无密钥从密文恢复明文很难；有密钥则很容易。**
- **Kerckhoffs 原则** ★：密码系统的安全只应依赖密钥的保密，而不是算法的保密。
  - 理由：秘密算法一旦曝光就弱；秘密算法从来保不住；开放才能提前发现弱点。

#### 2.2.2 简单替换与凯撒密码

- 凯撒：字母表整体移位 n（例：shift 3）。明文 `fourscoreandsevenyearsago` → 密文 `IRXUVFRUHDQGVHYHQBHDUVDJR`。
- 密钥空间：shift 只有 25 个非零密钥 → 穷举即可（exhaustive key search）。
- 一般单表替换：任意字母置换，密钥空间 **26! ≈ 4.03×10²⁶ > 2⁸⁸** → 不能穷举。

#### 2.2.3 频率分析 ⚔ ★

- 英文各字母出现频率差异明显（e/t/a 最高）。
- 步骤：统计密文字母频率 → 与英文分布对齐（如 {h,l,r} → {t,a,e}）→ 用高频三字词 `the` 等验证 → 逐步扩展。
- 结论：**“密钥空间大”不等于安全**；存在 shortcut attack 就是不安全。

#### 2.2.4 安全性的操作性定义 ★

- 若**已知最好的攻击就是穷举**，则称该密码系统是安全的。
- 若存在任何捷径攻击（shortcut），则不安全。
- 但“穷举不可行”才是真正的安全门槛——DES 的 56-bit 就是反例（见 W2）。

#### 2.2.5 一次性密码本 OTP ★★

- 加密：\(C = P \oplus K\)；解密：\(P = C \oplus K\)（XOR 自反）。
- 例：`Salute!` 用 `heilhitler` 作密钥 → 密文 `srlhssthsr`。
- **可证明安全**：密钥每比特等概率随机 ⇒ 所有密文等概率 ⇒ 密文不泄露明文任何信息。
- **三个必须条件**（缺一即破）：
  1. 密钥真随机；
  2. 密钥只使用一次；
  3. 密钥与消息等长。
- 根本问题：密钥与消息一样长，**“那为什么不直接传密钥？”** → 密钥分发难题。
- 真实案例 **VENONA**：苏联间谍用 OTP，但 pad 出现重复使用 → 被密码分析破译。

#### 2.2.6 代码本密码（codebook）

- 码本把词/短语映射为码字（如 Zimmerman Telegram）。
- **additive**：再叠加一本“随机数本”，发送密文 + additive 位置（位置不保密），接收方先减 additive 再查码本；作用是**同一个词每次编码不同**。
- 现代分组密码本质上就是“电子码本”（见 ECB）。

> ⚠ 易混：**OTP 的“一次”** 指同一密钥流不能加密第二条消息；**codebook + additive** 是历史上缓解“同词同码”的办法，不等于 OTP。

---

### W2 对称密码（symmetric key crypto）

**一句话**：流密码把短密钥“拉长”成 OTP 式的密钥流；分组密码用轮函数迭代处理固定块，靠 S-box 提供非线性；分组模式与 MAC 决定“多块数据”能否既保密又完整。

#### 2.3.1 两大分支

| | Stream cipher | Block cipher |
|---|---|---|
| 处理单位 | 1 bit / 1 byte | 固定大小块（如 64/128 bit） |
| 密钥 | 短密钥 → 伪随机密钥流 | 密钥 + 轮函数 |
| 类比 | 推广的 OTP | 电子码本 |
| 典型 | A5/1、RC4 | DES、3DES、AES、TEA |
| 现状 | 硬件高效，软件慢；逐渐边缘化 | 更主流，软件友好 |

#### 2.3.2 A5/1（GSM）★

- 3 个 LFSR：X 19 位、Y 22 位、Z 23 位；密钥作为寄存器初值。
- 每步：\(m = \mathrm{maj}(x_8, y_{10}, z_{10})\)；**只有钟控位等于 m 的寄存器才步进**。
- 步进抽头：
  - X：\(t = x_{13} \oplus x_{16} \oplus x_{17} \oplus x_{18}\)
  - Y：\(t = y_{20} \oplus y_{21}\)
  - Z：\(t = z_{7} \oplus z_{20} \oplus z_{21} \oplus z_{22}\)
- 输出密钥流位：\(x_{18} \oplus y_{21} \oplus z_{22}\)。
- 特点：硬件极高效、软件慢；用于 GSM 语音加密；资源受限设备仍有用武之地。

#### 2.3.3 RC4 ★

- 核心：256 字节的置换表 `S`，随密钥自修改。
- **KSA（初始化）**：
  ```
  S[i] = i; K[i] = key[i mod N]
  j = 0
  for i = 0..255: j = (j + S[i] + K[i]) mod 256; swap(S[i], S[j])
  i = j = 0
  ```
- **PRGA（产流）**：
  ```
  i = (i+1) mod 256
  j = (j + S[i]) mod 256
  swap(S[i], S[j])
  t = (S[i] + S[j]) mod 256
  keystreamByte = S[t]
  ```
- 每步产 1 字节（A5/1 每步 1 bit）。
- ⚠ **必须丢弃前 256 字节**，否则存在攻击（RC4 已知偏差）。
- 命名坑：**RC5 是分组密码**，不是 RC4 的升级版。

#### 2.3.4 Feistel 结构 ★★

- 不是某个具体密码，而是一个**框架**：DES、Blowfish、RC5、TEA、Twofish 都是其变体/相关。
- 加密：

\[
\begin{aligned}
L_{i+1} &= R_i \\
R_{i+1} &= L_i \oplus F(R_i, K_i) \\
C &= (R_{n+1}, L_{n+1})
\end{aligned}
\]

（最后左右交换）

- 解密：从 \((R_{n+1}, L_{n+1})\) 出发，用**同一 F、逆序子密钥**：

\[
\begin{aligned}
R_{i-1} &= L_i \\
L_{i-1} &= R_i \oplus F(L_i, K_{i-1})
\end{aligned}
\]

- 关键性质：**解密对任意 F 都成立**（因为每轮可逆），但**安全性只对特定 F 成立**。
- 反例：\(F = 0\) 时每轮只是交换，毫无安全性。

#### 2.3.5 DES ★★

| 参数 | 值 |
|---|---|
| 分组 | 64 bit |
| 密钥 | 56 bit（64 bit 含校验位） |
| 轮数 | 16 |
| 每轮子密钥 | 48 bit |
| 结构 | Feistel |
| 安全核心 | 8 个 S-box（6 bit → 4 bit） |

**一轮流程**：右半 32 bit → 扩展置换 E 成 48 bit → 与子密钥 XOR → 8 个 S-box 变 32 bit → P-box 置换 → 与左半 XOR → 左右交换。

- **S-box**：唯一的非线性部件；输入首尾 2 bit 选行、中间 4 bit 选列；DES 的 S-box 经过精心设计以抵抗密码分析 → **安全性主要来自这里**。
- **P-box**：对 S-box 输出再做 32-bit 置换（扩散）。
- **子密钥生成**：56 bit 密钥分两半各 28 bit，循环左移后压缩选 48 bit。
- **初始置换 IP / 末置换 FP**：不提供任何安全性，只是历史设计。
- **破解历史**：1998 EFF DES Cracker < $250,000、< 3 天；1999 distributed.net 22 小时 15 分（多机空闲算力）。结论：56-bit 已不可用。

#### 2.3.6 3DES（Triple DES）★

- <span class="mchip">\(C = E(D(E(P,K_1),K_2),K_1)\)</span>，即 **EDE，两把密钥，112 bit**。
- 为什么 EDE 而不是 EEE：**向后兼容**——<span class="mchip">\(E(D(E(P,K),K),K) = E(P,K)\)</span>，单密钥时退化为 DES。
- 为什么不用 `E(E(P,K1),K2)`：**中间相遇攻击（meet-in-the-middle）** 把 2¹¹² 降到约 2⁵⁷。
- ⚠ 3DES 的 112 bit 是“两把 56-bit 密钥”，不是 168；三密钥版本才是 168（课件只讲两密钥）。

#### 2.3.7 AES ★★

- 取代 DES 的事实标准；**不是 Feistel 结构**。
- 分组 128 bit；密钥 128/192/256 bit；轮数 **10/12/14**。
- 每轮 4 个操作：
  1. **ByteSub**：S-box 逐字节替换（非线性；无不动点 \(S(a)\neq a\)，且需逆表）。
  2. **ShiftRow**：行循环移位，避免各列被独立加密（扩散）。
  3. **MixColumn**：每列做可逆矩阵乘法（GF(2⁸)），实现上是大查找表。
  4. **AddRoundKey**：与子密钥 XOR。
- 优点：8/32-bit CPU 上都高效、代码/内存 footprint 小、有 **AES-NI** 硬件指令（AESENC/AESDEC）。
- **雪崩效应**：明文 1 bit 变化 → 密文大幅变化。

> 课件明确：**不要求背 AES 实现细节**，但要能说清四个操作的作用与顺序、以及“为什么不是 Feistel”。

#### 2.3.8 TEA（Tiny Encryption Algorithm）

- 64-bit 分组、128-bit 密钥、32 轮（轮数可变）、假设 32-bit 算术。
- `delta = 0x9e3779b9`（黄金比例常数，“magic number”）。
- 每轮同时更新 L、R，用 `+/-` 而不是 XOR → “almost Feistel”。
- 优点：极简易、快、内存小。
- 弱点：**等价密钥**（4 把不同密钥给出相同密文），有效密钥 2¹²⁸ → 2¹²⁶；以及 X-box 类攻击。
- 课件：**不要求背实现**，但要理解“弱轮函数 + 多轮”的设计取舍。

#### 2.3.9 线性密码分析（linear cryptanalysis）★

- 分组密码唯一非线性部件是 S-box；攻击思路：**用线性方程近似非线性 S-box**。
- 对给定 S-box，统计输入/输出比特的线性关系成立概率，例如：
  - <span class="mchip">\(y_1 = x_1\)</span> 以 3/4 概率成立；
  - \(y_{0} = x_{0} \oplus x_{2} \oplus 1\) 以概率 1 成立；
  - \(y_{0} \oplus y_{1} = x_{1} \oplus x_{2}\) 以 3/4 概率成立。
- 偏差（bias）越大，越可利用；沿轮传播后恢复子密钥。
- DES 的 S-box 设计使**单个输出比特没有好的线性逼近**，但输出比特的线性组合仍可被输入线性组合逼近；实践上需要海量明文，不太实用。

#### 2.3.10 分组模式 ★★

**为什么需要模式**：分组只有 64/128 bit，消息远大于一块；每块换新密钥 = OTP 的不现实。

| 模式 | 加密 | 特点 | 问题 |
|---|---|---|---|
| **ECB** | <span class="mchip">\(C_i = E(P_i,K)\)</span> | 最简单；相同明文块 → 相同密文块 | ⚔ **cut-and-paste**；模式泄露（加密图片仍看出轮廓） |
| **CBC** | \(C_0=E(IV\oplus P_0,K)\)，\(C_i=E(C_{i-1}\oplus P_i,K)\) | 相同明文块 → 不同密文；IV 随机但不保密 | 传输错误只影响有限块；**仍可 cut-and-paste / 可延展** |
| **CTR** | \(C_i = P_i \oplus E(IV+i,K)\) | 把分组密码当流密码；支持随机访问 | **IV/nonce 绝不能重用**（否则两次密文 XOR = 两明文 XOR） |

- ECB cut-and-paste 例：明文 `Eva. pings Bob. Ted. pings Tom.` → 攻击者交换密文块 → 解密成 `Eva. pings Tom. Ted. pings Bob.`。
- ECB 图片实验：加密后的图像仍保留大块轮廓 → 因为相同明文块产生相同密文。
- CBC 的 IV 不需要保密，但需要不可预测/唯一（课件强调 random）。
- 部分块（partial block）不在本课范围。

#### 2.3.11 完整性：MAC ★★

- **加密只提供机密性，不提供完整性**：OTP 可被任意翻转、ECB 可 cut-and-paste。
- **MAC = CBC residue**：做 CBC 加密，只保留最后一个密文块作为 MAC（密码学校验和）。
  ```
  C_0 = E(IV⊕P_0,K), ..., C_{N-1} = E(C_{N-2}⊕P_{N-1},K) = MAC
  ```
- 发送 \((IV, P_0\\dots P_{N-1}, MAC)\)；接收方重算并比对。
- 为什么能检测篡改：改动任一 `P_i` 会通过链式结构传播到最终 MAC；没有 K 无法伪造新 MAC。
- **加密与 MAC 用不同密钥**：同一把密钥 + 把最后密文块当 MAC 发送两次，不增加安全性；不同密钥（即使相关）可行。
- 代价：约 2 倍加密工作量；优化可到约 1.5 倍；**AE（authenticated encryption）** 是研究方向。
- 概念区分：**MAC ≠ 签名**（MAC 双方共享密钥，无法抗抵赖；签名用私钥，可抗抵赖，见 W3）。

#### 2.3.12 量子计算与对称密码

- 量子比特可处于叠加态；但造机、编程都极难，结果概率性。
- **Grover 算法**：穷举搜索平方根加速 → n-bit 密钥的工作因子从 \(2^n\) 降到约 \(2^{n/2}\)。
- 对策：**密钥长度翻倍**（AES-128 → AES-256），代价只是“稍慢”。
- 结论：量子计算对对称密码**不是致命威胁**（对比 RSA/DH，见 W3）。

---

### W3 公钥密码（public key crypto）

**一句话**：用“陷门单向函数”解决密钥分发与不可抵赖；但公钥算法慢、有消息长度限制，实际系统是“公钥建钥 + 对称加密数据”的混合体制，并用 PKI 绑定身份与公钥。

#### 2.4.1 核心思想 ★

- 基于 **trapdoor one-way function**：正向易算、反向难算；知道陷门（私钥）则反向易算。
- 典型单向函数：\(N = p\cdot q\) 易算，由 N 分解出 p、q 难。
- 两种用法：
  - **加密**：用 Bob 的公钥加密 → 只有 Bob 的私钥能解。
  - **签名**：用私钥“加密” → 任何人用公钥“解密”验证；只有私钥持有者能签。

#### 2.4.2 RSA ★★

**密钥生成**
1. 选大素数 p、q；\(N = p\cdot q\)。
2. 选 e 与 `(p−1)(q−1)` 互素。
3. 求 d 使 \(e\cdot d \equiv 1 \bmod (p-1)(q-1)\)。
4. 公钥 `(N, e)`；私钥 `d`（p、q 必须销毁/保密）。

**加解密**
- \(C = M^e \bmod N\)
- \(M = C^d \bmod N\)

**安全性**：若攻击者能分解 N = p·q，就能由 e 求出 d → **分解模数即破 RSA**。

**小例子**：p=11, q=3 → N=33, φ=20；e=3 → d=7。
- M=8：\(C = 8^{3} \bmod 33 = 512 \bmod 33 = 17\)；\(M = 17^{7} \bmod 33 = 8\)。

**RSA 数字**：RSA Labs 发布 100–617 位十进制的半素数；截至 2018-08，54 个中 20 个被分解；RSA-100（330 bit）最容易，RSA-2048 目前无人能破。

**效率**
- 直接算 \(M^e\) 再取模会产生天文数字 → **每步取模 + 反复平方（repeated squaring）**。
- 例：5²⁰ mod 35：5¹→5，5²→25，5⁵→10，5¹⁰→30，5²⁰→25；不产生巨大中间值。
- 可预计算常用幂的表。
- **消息长度受限**：2048-bit RSA 最多约 **245 字节**明文；不要“切块加密”（膨胀 + 慢）。

**混合加密（hybrid）** ★
- 公钥只用来建立/封装一个对称密钥；数据用对称密码（AES）加密。
- SSL/TLS、OpenPGP 都这么做。
- 但仍需证书解决“公钥属于谁”。

#### 2.4.3 Diffie-Hellman 密钥交换 ★★

- 目的：在不安全信道上协商共享对称密钥；**不用于加密/签名**。
- 公开参数 g、p；Alice 私密 a，Bob 私密 b。
  - 交换 \(g^a \bmod p\)、\(g^b \bmod p\)。
  - Alice 算 \((g^b)^a = g^{ab}\)；Bob 算 \((g^a)^b = g^{ab}\)；共享密钥 \(K = g^{ab} \bmod p\)。
- 安全性基于**离散对数问题**：给定 \(g, p, g^k \bmod p\)，求 k 很难。
- ⚠ 攻击者看到 \(g^a\)、\(g^b\)，但 \(g^a\cdot g^b = g^{a+b} \neq g^{ab}\)。
- ⚔ **中间人攻击（MiM）**：Trudy 分别与 Alice、Bob 协商 \(g^{at}\)、\(g^{bt}\)，双方毫不知情。
  - 根源：DH 本身**没有认证**。
  - 解决：认证（证书/签名/预共享密钥），见 PKI。

#### 2.4.4 数字签名与不可抵赖 ★

- 用私钥签：<span class="mchip">\(S = [M]_{\text{Alice}}\)</span>；任何人用 Alice 公钥验证。
- 提供 **integrity + authentication + non-repudiation**。
- **为什么对称 MAC 不能抗抵赖**：Alice 与 Bob 共享 K，Bob 也能伪造 MAC，无法向第三方证明是 Alice 下的单。
- 签名前提：私钥未泄露/未被偷。

#### 2.4.5 PKI 与证书 ★

- 问题：收方如何确信“这把公钥确实属于某人”？
- 方案：**CA（Certificate Authority）** 作为可信第三方，签发**数字证书**（名字 + 公钥 + 其他信息，用 CA 私钥签名）。
- 验证：用 CA 公钥验签 → 确认证书完整性 → 信任证书中的公钥。
- **X.509** 常见字段：Version、Serial Number、Signature Algorithm、Issuer Name、Validity Period、Subject Name、Subject Public Key、Issuer/Subject Unique ID、Extensions、Digital Signature。
- **生命周期**：生成密钥对 → 签发 → 使用 → 到期/私钥泄露 → 吊销（CRL）→ 重新认证/换钥。
- **为什么信任 CA**：根 CA 预装在 OS/浏览器/应用中，随系统更新；身份核验靠现实世界手段，不是密码学。
- **PKI = 使用公钥所需的一切**：密钥生成与管理、CA、CRL 等；没有统一标准；三种信任模型：垄断型（单一/极少数 CA）、寡头型（少数 CA，最常见）、全员 CA（web of trust 思路）。

#### 2.4.6 哈希函数 ★★

**用途**：签名大消息时先签指纹 `h(M)`（效率）；完整性；口令存储；哈希链；PoW。

**安全性质**（必背）
1. **Compression**：任意长度 → 固定 n-bit。
2. **Efficiency**：易计算。
3. **One-way（preimage resistance）**：给定 y，找不到 x 使 <span class="mchip">\(H(x)=y\)</span>。
4. **Weak collision resistance（second preimage）**：给定 x，找不到 y≠x 使 <span class="mchip">\(H(y)=H(x)\)</span>。
5. **Strong collision resistance**：找不到任意一对 y≠x 使 <span class="mchip">\(H(y)=H(x)\)</span>。

**生日问题** ★
- 全班有人和“我”同生日：需 **253** 人（pre-birthday，对应 weak collision）。
- 任意两人同生日：只需 **23** 人（birthday，对应 strong collision）。
- 一般化：N-bit 哈希，约 \(2^{N/2}\) 次尝试即可找到碰撞。
- 推论：**N-bit 哈希的安全强度只有 N/2 bit**；而 N-bit 对称密钥强度约 N bit。
  - 128-bit 哈希 → 2⁶⁴ 工作量即可破碰撞。

**常见算法**
- **MD5**：128-bit 输出，碰撞已易构造 → 已破。
- **SHA-1**：160-bit，结构与 MD5 类似，2005 年起可破。
- SHA-224/256/384/512 等。
- 内部结构：**Merkle–Damgård**：固定压缩函数 + 逐块迭代，上一块输出参与下一块；无密钥，类似分组密码。
- **雪崩效应**：`MD5("...dog")` 与 `MD5("...dog.")` 输出完全不同。

**哈希的巧用**
- **口令哈希 + salt**（见 W7）：<span class="mchip">\(y = h(\text{password}, s)\)</span>，存 `(s,y)`；salt 不保密，但迫使攻击者对每个用户重算。
- **哈希链**：24 次课，第 1 次给 `Hash²³(t)`，第 d 次给 \(Hash^{24-d}(t)\)，最后一次给 t；单向性保证不能由当前值推出未来值 → 一次性口令/令牌。
- **反垃圾邮件 PoW**：要求 `h(M,R,T)` 前 N 位为 0；发送方平均 \(2^N\) 次哈希，接收方 1 次验证；N 可调。
- 区块链 PoW 同源（w1 提及）。

**量子计算**
- **Shor 算法**（1994）可高效分解大整数、解离散对数 → **RSA/DH 将失效**。
- 2048-bit 模数：数域筛法 ≈ 125-bit 对称密钥强度；Shor ≈ 30-bit。
- 结论：对称密码 + 加长密钥可存活；公钥需 **post-quantum crypto**（如 NTRU）。

---

### W4-A 恶意软件（malware）

**一句话**：恶意代码的目标是“让攻击者的代码在你的机器上运行”；传播方式（worm/virus/trojan/backdoor）与检测方式（签名/行为/聚类）构成另一场军备竞赛。

#### 2.5.1 类型（无严格统一定义）★

| 类型 | 核心特征 | 传播 |
|---|---|---|
| **Worm** | 自我复制、主动传播 | 利用漏洞自动扩散 |
| **Virus** | 修改宿主程序/引导区，被动传播 | 依附文件，随程序运行 |
| **Trojan horse** | 伪装成正常软件，含意外功能 | 用户主动安装；不自我复制；常可远程控制 |
| **Trapdoor / backdoor** | 绕过正常认证的隐蔽入口 | 植入后门 |
| **Ransomware** | 加密受害者数据索要赎金 | 常配合钓鱼/漏洞 |

#### 2.5.2 蠕虫案例 ★

**Morris Worm（1988-11-03）**
- Robert Morris，Cornell 23 岁博士生；约 **99 行**程序；几乎瘫痪当时的 Internet。
- 入侵途径：
  1. `fingerd`、`sendmail` 的 **buffer overflow**；
  2. 猜测弱口令（常见口令表）。
- 漏洞早已公开但补丁未普及。
- 危害机制：**指数级传播** + 重复感染导致机器失去响应 → 破坏 **Availability**。
- 影响：极大提升安全意识。

**SQL Slammer（2003）**
- 单一 **376 字节 UDP 包**即可传播；10 分钟感染 **75,000** 台。
- 利用数据库软件漏洞；补丁 **6 个月前**已发布。
- 峰值每 **8.5 秒**翻倍；因传播过快耗尽带宽而“自燃”。

#### 2.5.3 病毒与 PE 文件 ★

- Windows 可执行格式 **PE（Portable Executable）**。
- 感染步骤：
  1. 修改 PE 头；
  2. 附加一个恶意代码节（section）；
  3. 把入口点重定向到恶意节。
- 病毒可寄生：引导扇区（boot sector，最早取得控制）、应用程序、库函数、编译器/调试器/杀毒软件（最恶毒）。

#### 2.5.4 木马与供应链 ★

- **Mac 木马**：`freeMusic.mp3` 实际是 application（不是数据）；双击后 iTunes 打开（符合预期）+ 狂笑/弹窗（意外）；能做用户能做的一切（删文件、下载、启动应用）。
- **Android 重打包**：下载热门 App → 反编译 → 插入恶意代码 → 重新打包分发。
- **Backdoor**：监听某端口，绕过本地口令认证，提供远程访问。
- **Reflections on Trusting Trust**（Ken Thompson, 1984 Turing Award）：
  - 恶意编译器可在编译时植入后门，源码看起来完全干净。
  - 现实案例：**XcodeGhost（2015）**——开发者下载了非官方渠道的 Xcode。
  - 结论：**root of trust** 问题；仅审计源码不足以完全信任二进制。

#### 2.5.5 勒索软件

- 用轻量对称密码（TEA/Twofish/Blowfish…）加密受害者数据。
- 检测思路：**pattern matching delta**（加密过程对文件内容的规律性改变）。

#### 2.5.6 检测方法 ★★

| 方法 | 做法 | 优点 | 缺点 |
|---|---|---|---|
| **静态签名** | 在文件中搜索特征串/通配符/哈希；如 W32/Beast 的 `83EB 0274...` | 对普通恶意软件有效；用户负担小；最流行 | 签名库巨大、扫描慢；需持续更新；无签名则检测不到；高级恶意软件可绕过 |
| **动态行为** | 监控“异常”行为：异常文件访问、系统异常、异常网络活动 | 可发现无签名的新恶意软件 | 需定义“正常”，且正常会变；准确率；攻击者可“慢速攻击”伪装正常；常与签名结合 |
| **恶意软件聚类** | 与已知家族/样本比对（VirusTotal 等），用相似度、聚类、嵌入 | 加速海量未知样本分析；发现同作者/同工具包 | 不是检测本身；依赖样本库质量 |

- 行为分析实例：Android 记录 **system call 序列**（`fread("passwordFile")` → `sendmsg(...)`）；难点是 `sendmsg` 的内容不可见 → 静态分析。
- 浏览器挖矿：WebAssembly 中大量哈希计算 → 运行时识别“挖矿”操作。
- 实际执行环境：VM、sandbox、硬件支持；恶意软件可 **sandbox evasion**（检测自己是否在虚拟环境，如 “Red Pill”）。

#### 2.5.7 军备竞赛：加密 / 变形 ★

- **加密恶意软件**：不同密钥 → 不同“随机”字节 → 无共同签名。
  - 检测：扫描 **decryptor 代码**（仍是签名）；运行时 dump 解密后的代码。
- **Metamorphic（变形）**：感染新系统前自我变异。
  - 过程：反汇编自己 → 插入随机变化（指令置换、死代码）→ 重新汇编。
  - 功能相同、签名不同 → 签名检测失效。
- 趋势：加密、多态、变形、混淆/多样化；恶意软件已成“生态系统”，开发走向“软件工程化”。

---

### W4-B 逆向工程（reverse engineering）

**一句话**：没有源码时，从可执行文件恢复“程序在做什么”；它是几乎所有软件安全任务的基础，而编译是“多对一”的不可逆映射。

#### 2.6.1 正反向工程

- **Forward engineering**：需求 → 设计 → 实现 → 测试 → 交付（瀑布模型）。
- **Reverse engineering**：把东西拆开、分析其工作原理，逐步恢复更高层抽象与意图。
- 在安全中的位置：
  - 软件逆向：几乎所有软件安全任务的基础（攻击者/防御者都没有源码）。
  - 协议逆向：网络安全的成熟领域（抓包 → 恢复报文结构：Header/Length/Checksum/Command/Data）。
  - 算法/模型逆向：新兴（魔数、统计查询对、DNN 逆向）。
  - 硬件逆向。

#### 2.6.2 工具链与概念 ★

```
Source code --compiler--> Assembly --assembler--> Executable
Executable --disassembler--> Assembly
Executable --decompiler--> Source code（decompiler 内含 disassembler）
```
- **Disassembler**：可执行文件 → CPU 汇编指令。
- **Decompiler**：可执行文件 → 源码级表示。
- 商业工具：IDA Pro、JEB3、Hopper；开源：**Ghidra**（NSA 开源）。

#### 2.6.3 编译是“单向函数” ★

- 多份不同源码可编译成同一段机器码：
  ```c
  if (x != 0) x = 0;
  x = 0;
  if (x==1) ... else if ... else x=0;
  ```
  都可能生成同一机器码 → **无法唯一还原“原始源码”**。
- 但对理解/复用而言，任一语义等价的写法都可接受。

#### 2.6.4 反汇编：线性 vs 递归 ★★

- **线性扫描（linear）**：从代码段第一个字节开始逐条解码直到结尾。
  - 问题：编译器会在代码段中**嵌入数据**（如跳转表、常量）；线性扫描会把数据误当指令。
- **递归扫描（recursive）**：沿控制转移（jmp/call/ret）遍历，只反汇编可达代码。
  - 能正确处理“代码中嵌数据”的情况（如 `inst1; jmp data; inst3...`）。
  - CPU 也是按控制流执行，所以递归更贴近真实语义。

#### 2.6.5 现代 C/C++ 反编译流水线 ★★

```
Executable
 → Disassembly（反汇编）
 → Variable/Type Recovery（变量与类型恢复）
 → Control-Flow Recovery（控制流恢复）
 → Optimization（优化）
 → Code Generation（代码生成）
 → Decompiler Output
```

- **变量恢复**：从“整块内存”中划分出变量区域（哪些字节总是一起被访问 → 一个变量）。
- **类型恢复 = 类型推断**：
  - `b = *a` → a 是指针；
  - `printf("%d", a)` → a 是整数；
  - `fopen(a, "r")` → a 是字符串（文件名）。
  - 本质是“演绎证明”过程，逐步约束类型。
- **控制流恢复**：汇编 → **CFG（控制流图）**，这是恢复 `if/while/for` 的前提。
- **代码生成**：模式匹配 + 代码模板具体化（识别出“这应该是一个 for 循环”）。

#### 2.6.6 反编译的实际缺陷 ⚠

商业反编译器仍会在变量/类型恢复上出错，典型 bug：
- **不可达循环**：`for (i=6; i<-12; i-=6)` 原程序不可达，反编译却变成可达/多次迭代。
- **移位/截断**：`(uint8_t)a >> (uint8_t)6` 被错误还原，导致 a 的值不同。
- **整型宽度**：`int32_t a = 0xaaaaffff` 被还原成 `int16_t`，`a+4` 结果不同。

#### 2.6.7 案例：序列号破解（software crack）★

1. 程序要求输入 serial，错误则退出。
2. 反汇编 → 找到比较处：`cmp` 输入与硬编码字符串 → 直接看到 `S123N456`，输入即通过。
3. 更进一步：不找序列号，直接 **patch** 跳转指令（把条件跳转改成无条件/ NOP），或用十六进制编辑器改字节 → 任意序列号都通过。
4. 所需工具：仅一个反汇编器；远程攻击时可能需 trial-and-error 猜地址。
5. 结论：**开放系统上无法阻止 SRE**，只能提高成本。

#### 2.6.8 反逆向手段

- **Anti-disassembly**：在代码中嵌入数据，干扰线性扫描。
- **Code obfuscation**：让代码难以理解（见 W5）。
- **Encryption / packer**：加壳，运行时解壳。

---

### W5-A 缓冲区溢出（buffer overflow）

**一句话**：C/C++ 不做边界检查，超长输入可覆盖栈上的返回地址，从而劫持控制流、执行任意代码；防御从“不可执行栈、金丝雀、ASLR、安全语言”多管齐下。

#### 2.7.1 漏洞谱系

- 可能被利用的 bug：空指针解引用、UAF、double free、数组越界、栈/堆溢出、返回局部变量指针、未初始化变量、负数误用、大参数按值传递、分配不足、内存/文件句柄/网络资源泄漏、未处理返回码、失效迭代器……
- ⚠ **并非所有 bug 都可利用**；不可利用的逻辑 bug 不构成 vulnerability。
- 常见高危：**buffer overflow、format string、integer overflow、UAF、type confusion、race condition**。

#### 2.7.2 内存布局与栈帧 ★★

- 进程内存（Linux，Mac/Windows 类似）：text（代码）、data、bss、heap（向高地址增长）、stack（向低地址增长）。
- 栈帧从高地址到低地址：
  ```
  高地址
  ┌─────────────┐
  │ 参数 a, b    │
  ├─────────────┤
  │ 返回地址 ret │  ← 溢出目标
  ├─────────────┤
  │ saved FP     │
  ├─────────────┤
  │ 局部变量     │
  │ char buf[10] │  ← 写入起点
  └─────────────┘
  低地址        SP
  ```
- 函数调用时压入返回地址、帧指针、局部变量；**栈向低地址增长，缓冲区向高地址写** → 溢出会先覆盖 saved FP，再覆盖 **ret**。

#### 2.7.3 两种“越界” ★

- **Buffer overread**：读超出缓冲区 → 泄露相邻内存（如 **Heartbleed** 读 OpenSSL 内存）。
- **Buffer overwrite**：写超出缓冲区 → 篡改相邻数据/返回地址。

#### 2.7.4 溢出攻击原理 ★★

- 简单场景：`char buffer[N]` 旁边有 `boolean flag`（口令正确标志）；超长输入覆盖 flag → 任意口令通过。
- 栈溢出：
  - 覆盖 ret → 程序“返回”到错误地址 → 崩溃（DoS）；
  - 更坏：让 ret 指向**注入的恶意代码**（shellcode）→ 任意代码执行。
- 别名：stack smashing、buffer overrun、code injection、control-flow hijacking。
- 前提：代码中确实存在溢出；**并非所有溢出都可利用**；常需 trial-and-error 猜地址，但“成功一次就够”。
- ⚠ 让缓冲区“向高地址增长”并不能解决问题（课件注明见笔记）。

#### 2.7.5 不安全 C 库函数 ★

`strcpy`、`gets`、`strcat`、`scanf`、`sprintf` …… 共同点：**不检查目标缓冲区长度**。

#### 2.7.6 利用步骤（serial 案例）★

1. 输入超长 `A`（0x41）观察崩溃 → 判断 ret 被覆盖的偏移。
2. 反汇编找到想跳转的地址（如绕过检查的 `0x401034`）。
3. 地址按 **little-endian** 逆序写入：`0x401034` → 字节 `34 10 40 00` → ASCII `"4^P@"`（0x40='@'，0x10=^P，0x34='4'）。
4. 构造 payload：填充 + 目标地址（+ 可选 NOP sled + shellcode）。
5. 成功绕过序列号检查。

#### 2.7.7 防御 ★★

| 防御 | 机制 | 局限 |
|---|---|---|
| **W^X / DEP** | 栈/堆不可执行（write XOR execute）；Windows 支持，Linux 有补丁 | 自修改代码、JIT 需要可写/可执行内存 |
| **Canary（栈金丝雀）** | 在 ret 前放一个值，函数返回前检查是否被改；常量 `0x000aff0d` 或运行时随机 | 非万无一失；某些攻击可绕过/不触碰 canary；Web 服务器约 8% 性能损失 |
| **ASLR** | 随机化栈、可执行文件基址等 | 可暴力猜（32-bit 熵低）；可 **spraying** 注入代码；需配合其他防御 |
| **安全语言** | Java/C# 等自动边界检查 | 需重写/迁移；性能与兼容性 |
| **安全函数** | 用带长度参数的版本；额外长度检查 | 依赖开发者正确使用 |

> 现代组合：ASLR + canary + NX + PIE + CFI；攻击者则用 info leak、ROP/JOP 绕过（课件点到“and even more later”）。

---

### W5-B 软件混淆（obfuscation）

**一句话**：在“恶意宿主”假设下，混淆通过改变代码形态（布局、数据、控制流）提高逆向成本；它无法做到绝对安全，只能让攻击代价高于收益。

#### 2.8.1 动机与前提 ★

- 软件含大量信息：.NET 的 MSIL、Java/JS/Python 字节码、C/C++ 二进制。
- 代码会被利用：非恶意 RE（测试、集成、扩展）；恶意 RE（攻击、盗版）；恶意软件作者也想逃避聚类/相似性分析。
- **移动代码 + 恶意主机**：代码在别人机器上运行，宿主不可信。

#### 2.8.2 为什么现有保护不够 ⚠

| 方案 | 问题 |
|---|---|
| 硬件隔离 | 需改造硬件，不现实 |
| 服务器端执行 | 需要始终在线高带宽；还要解决认证等网络安全问题 |
| 加密 | 鸡生蛋：解密例程本身可见 |

#### 2.8.3 目标与边界 ★

- 让被保护软件“看起来”与原版不同；**判断两段代码的相似性**是许多软件安全分析的基础。
- **不能完全阻止**恶意 RE：给定足够时间/资源，任何混淆都可被还原（穷举）。
- 正确目标：**让还原成本对攻击者而言过高**。

#### 2.8.4 三类混淆 ★★

**1) Layout obfuscation（布局）**
- 删除注释、重命名标识符（类/方法/变量 → 无意义名）。
- 商业工具：DashO（Java）、Dotfuscator（MSIL）。
- 很轻量；现实中大量流行 App 甚至没做布局混淆。

**2) Data obfuscation（数据）**
- 变量拆分/合并/编码。
- 数组拆分、数组合并、数组折叠（增维）、数组展平（降维）。
- 数据加密（如字符串加密，移动 App 常用）。

**3) Control-flow obfuscation（控制流）** ★
- 前提：布局/数据混淆不改变控制结构 → 控制结构仍可作“代码签名”。
- 手段：
  - **指令插入（垃圾代码）**：`nop`、`add/sub`、`xor/xor` 等语义抵消序列；简单、破坏已知模式。
  - **指令替换**：等价指令序列替换；极端案例 **M/o/Vfuscator** 把 C/C++ 编译成“只有 mov”的程序。
  - **控制流平坦化（flattening）**：把所有基本块放进 `switch(x)` 分发器，用状态变量 x 驱动；原 CFG 被“压平”。
  - **不透明谓词（opaque predicate）**：条件表达式的值在运行时已知，但静态分析难以推断。
    - 例：`if (x*x + y*y >= 2*x*y)` 恒真（但不易看出）；汇编中更隐蔽。
    - 类型：invariant（不变量）、context（上下文相关）、多线程（一个线程只放 >n 的数，另一个线程取值 → `x<n` 恒假）。
    - 不透明性决定控制流变换的韧性。

**进阶**
- **VM-based obfuscation**：自定义指令集 + 秘密编码 + 虚拟 CPU/分发器；已商业化；不是万无一失，但显著增加分析难度。
- **Multilingual obfuscation**：混合不同计算模型（命令式 = 图灵机；函数式 = lambda 演算；逻辑式 = Horn 逻辑），编译后机器码更难理解。

#### 2.8.5 混淆效果评估 ★

| 维度 | 含义 | 度量 |
|---|---|---|
| **Potency** | 引入多少复杂度 | 调用图边数、基本块数、CFG 边数等软件复杂度指标 |
| **Stealth** | 混淆代码能否“融入”其余代码 | 指令分布异常检测 |
| **Resilience** | 还原有多难 | diff 技术比较混淆前后二进制相似度 |
| **Cost** | 性能代价 | 体积、执行减速 |

#### 2.8.6 为什么“好”的混淆很难设计 ⚠

- 想出“有趣”的变异不难，需要创造力；想出“安全”的变异极难。
- 尤其当方法公开、攻击者已知你的方案时。
- 开放设计 + 无真正秘密 + 搜索空间有限 → 原理上就不强（呼应 Kerckhoffs）。

---

### W6-A 软件利用 II（software exploitation）

**一句话**：除栈溢出外，堆上的 UAF/双重释放、栈上的格式化字符串、数据库层的 SQL 注入，都是“输入验证/生命周期管理失败”的不同表现。

#### 2.9.1 内存漏洞地图

| 漏洞 | 位置 | 根因 |
|---|---|---|
| Buffer overflow | 栈/堆 | 越界写 |
| **Use-after-free** | 堆 | 释放后继续使用 |
| **Double free** | 堆 | 同一块释放两次 |
| **Type confusion** | 堆 | 把对象当成另一种类型 |
| **Format string** | 栈 | 用户控制格式串 |
| **SQL injection** | 数据库 | 输入拼接进查询 |

#### 2.9.2 堆基础 ★

- 堆：动态分配内存；C `malloc/free`，C++ `new/delete`。
- 分配的内存在程序终止或显式 `free/delete` 前一直有效。
- **内存泄漏**：只分配不释放 → 资源滥用，可导致崩溃/无响应 → 破坏 **Availability**。
- 程序员需自行管理生命周期 → 错误温床。

#### 2.9.3 Use-After-Free ★★

- 缺陷：`free(p)` 后仍通过 `p` 读写，把已释放内存当有效。
- 利用：释放后立刻分配**同样大小**的新对象 → 新对象占据同一块内存 → 通过悬垂指针写入，篡改新对象的字段（如函数指针/vtable）→ 控制流劫持/任意代码执行。
- 案例（Protostar heap2，PoC）：
  - 正常流程：create user → login → 指定 service → cleanup。
  - 攻击流程：create user → cleanup（释放）→ 指定 service（复用同一 chunk，写入 “you have logged in already!”）→ login 时读取旧指针 → 未认证即“已登录”。
  - `strdup` 在堆上分配 chunk，是复用的关键。
- 为什么 fuzz 难检测：**复杂度 + 显著性（saliency）**——需要特定分配/释放序列。
- 防御：释放后把指针置 **NULL**；使用智能指针。

#### 2.9.4 Double Free ★

- 同一块内存释放两次 → 堆元数据被破坏。
- 攻击：精心构造分配/释放链，让第二次 free 把“用户数据”当元数据解析 → 任意地址写/控制流劫持。
- 防御：释放后置 NULL（最直接）。

#### 2.9.5 格式化字符串 ★★

- `printf(format, ...)`：格式串决定如何解释后续参数（`%d` 值、`%s` 指针）。
- 编译器通常**不检查**格式串与参数是否匹配。
- 若用户能控制格式串：
  - `%s%s%s...` → 把栈上的值当字符串地址 → **泄露内存**（可绕过 ASLR）。
  - `%n` → 把“已输出字节数”**写入**参数指定的地址 → **任意内存写**。
- 防御：
  - 尽量用硬编码字符串、无参数；
  - 至少硬编码格式串，禁止 `printf(user_input)`；
  - 禁用 `%n`。

#### 2.9.6 SQL 注入 ★★

- 成因：不可信输入被拼进 SQL：
  ```php
  "SELECT * FROM Users WHERE name='$name';"
  ```
- 输入 `x' OR 'a'='a` →
  ```sql
  SELECT * FROM Users WHERE name='x' OR 'a'='a';
  ```
  → 恒真，绕过认证。
- 更狠：`'; DROP TABLE Students; --` → 删表。
- **最佳防御：预处理语句 + 绑定变量（prepared statements / bound parameters）**。
  - 原理：SQL 语句先被数据库**解析/编译**，参数随后与“已编译语句”结合，而不是拼成 SQL 字符串 → 输入永远被当作数据，不会被解析为语法。
- 辅助防御：
  - 输入语法校验（邮箱、日期、零件号等有固定语言）；
  - 长度限制（很多注入依赖长字符串）；
  - 扫描 `INSERT/DROP` 等关键词；
  - **最小数据库权限**（只读用户只给读权限）。

---

### W6-B 侧信道（side channel）

**一句话**：不利用软件 bug，而是利用“秘密相关的程序行为 → 物理环境 → 可观测”这条链，从执行时间、缓存、功耗、电磁、声音、热量中反推密钥。

#### 2.10.1 三个构成条件 ★★

1. **秘密相关的信息流**：程序行为随秘密不同而不同。
2. **信息流影响物理环境**：时间、功耗、缓存状态、声音……
3. **物理环境可被攻击者观测/利用**。

> 缺一不可。防御也可从这三环入手：消除秘密相关分支/访存（常数时间）、屏蔽物理信号、限制观测能力。

#### 2.10.2 类型

- Timing（执行时间）、Cache（缓存）、Power（功耗）、EM（电磁辐射）、Sound（声音）、Heat（热量）。
- 例：声音侧信道可从 CPU 发出的嗡嗡声区分 RSA 密钥位 0/1（Tromer 等）。

#### 2.10.3 RSA 时间侧信道 ★★

- 场景：Alice 公钥 (N,e)、私钥 d；攻击者可发送任意 M，Alice 返回 \(M^d \bmod N\)（签名）；攻击者可精确计时。
- 实现：**平方-乘（square-and-multiply）**
  ```
  for bit in d:
      x = x² mod N
      if bit == 1: x = x*M mod N
  ```
- 时间差异：
  - bit = 0：只平方（快）；
  - bit = 1：平方 + 乘法（慢）。
- 一条时间轨迹即可读出密钥位序列（实际需多次试验，但**不需要分解大数**）。
- 经典文献：Kocher, “Timing Attacks on Implementations of DH, RSA, DSS, and Other Systems”, 1996。

#### 2.10.4 缓存侧信道 ★★

- 基本原理：**访问 cache 中的数据明显快于访问主存**。
- Cache line = 最小存储单元，通常 **64 字节**；地址低位是 line offset，其余位是 line index。
- **Flush + Reload**：攻击者先把目标 cache line 从缓存中逐出，等受害者运行后测量重新加载时间 → 快 = 受害者访问过该行。
- 威胁模型：
  - 强：能观测**具体访问了哪条 cache line**；
  - 弱：只能观测 **hit/miss 序列**，仍可推断秘密输入。
- 与 RSA 的关系：
  - 平方-乘：秘密相关**控制流** → 时间/分支泄漏；
  - 滑动窗口（sliding window）：`table[idx]` 秘密相关**内存访问** → 缓存泄漏。
- 云计算时代尤其危险：不同 VM 共享 L1/L2（同核）或 L3（跨核）。
- 关联大事件：**2018 Spectre & Meltdown**。

#### 2.10.5 功耗侧信道 ★

- **SPA（Simple Power Analysis）**：直接解读功耗轨迹，识别设备正在执行的操作与密钥位。
  - 假设：攻击者能获得一条覆盖整个密码运算的功耗轨迹。
  - 一条轨迹即可泄露秘密（如 1/0 对应不同功耗波形）。
  - 已有针对手机/嵌入式设备的 PoC。

> 课件对功耗/缓存只给高层思路；DPA、掩码、隐藏等进阶内容未展开（可作为延伸）。

---

### W7-A 认证（authentication）

**一句话**：访问控制 = 认证（你是谁）+ 授权（你能做什么）；认证依赖“你知道/你拥有/你是什么”，而密码的现实弱点是用户选择，生物特征的弱点是不可撤销。

#### 2.11.1 访问控制两部分 ★

- **Authentication**：你是不是你说的那个人？（人→机，或机→机）
- **Authorization**：你被允许做这件事吗？（访问后能做什么，限制动作）

#### 2.11.2 三种认证因子 ★★

| 因子 | 例子 | 特点 |
|---|---|---|
| **Something you know** | 口令、PIN、生日、母亲婚前姓、宠物名 | 免费、易重置；但弱、可猜、可泄露 |
| **Something you have** | 智能卡、ATM 卡、令牌、手机、MAC 地址 | 需携带/发放；可丢失 |
| **Something you are** | 指纹、签名、人脸、声纹、步态 | 难伪造；但不可撤销、有错误率 |

**2FA**：三者中任取两类（信用卡 + 签名；ATM 卡 + PIN）。

#### 2.11.3 密码为什么流行

- 成本：免费；便利：重置口令比重新发一个拇指容易。
- 但“密码是当今安全工程师面临的最大实践问题之一”。

#### 2.11.4 密钥 vs 口令 ★

- 64-bit 随机密钥 → 2⁶⁴ 个可能，攻击者约需试 2⁶³。
- 8 字符口令、每字符 256 种 → 理论 256⁸ = 2⁶⁴；**但用户不随机选** → 实际可选空间远小于 2⁶³ → **字典攻击**。
- 字典攻击：只尝试最可能成功的候选（字典词、变形）。

#### 2.11.5 好坏口令与口令短语 ★

- 坏口令：`frank`、`Fido`、`Password`、`incorrect`、`Pikachu`、`88195277`、`AustinStamp`。
- 好口令：`jfIej,43j-EmmL+y`、`09864376537263`、`0nceuP0nAt1m8`、`P0kem0n`。
- **Passphrase**：10–30 字母、更难暴力破解、不在短语/名言字典中、比随机串好记。
- 实验（三组）：
  - A：≥6 字符 + 1 个非字母 → 约 **30%** 易破解；
  - B：基于 passphrase → 约 **10%** 被破，且好记；
  - C：8 个随机字符 → 约 **10%** 被破，但难记。
  - 结论：**passphrase 在安全性与可记忆性之间更优**。

#### 2.11.6 口令攻击面 ★

- 针对某个账户 / 系统内任意账户 / 任意系统账户；
- **DoS**（如反复输错锁定账户 → 思考 ATM）；
- 离线：拿到口令文件后字典攻击；
- 在线：猜测、撞库、社会工程、键盘记录、日志泄露。

#### 2.11.7 口令存储：哈希 + 盐 ★★

- 不能明文存口令；但又要验证 → 存 **hash**。
- 攻击：预计算字典中所有 `h(x)`；拿到哈希文件后直接比对 → 一次预计算，之后秒破。
- **Salt**：随机值 s，存 <span class="mchip">\((s,\ y=h(\text{password},s))\)</span>。
  - s 不保密；
  - 验证仍容易；
  - 但攻击者必须**为每个用户、每个 salt 重算**，预计算表失效，成本大幅上升。
- 现代还应使用慢哈希（bcrypt/scrypt/Argon2）——课件未展开，属延伸。

#### 2.11.8 其他口令问题

- 口令太多 → 重用 → 一处泄露、处处沦陷；
- 默认口令不修改；
- 社会工程；
- 错误日志可能含“近似口令”；
- bug、键盘记录、间谍软件；
- 破解工具：L0phtCrack/LC4（Windows）、John the Ripper（Unix）；管理员应主动用它们做弱口令审计。

#### 2.11.9 生物特征 ★

- “你就是钥匙”：指纹、签名、人脸、声纹、步态。
- **理想特性**：Universal（普适）、Distinguishing（可区分）、Permanent（长期不变）、Collectable（易采集）、安全、用户友好。
  - 现实中：没有一种生物特征对所有人适用；无法 100% 确定；只要长期有效即可；采集依赖配合。
- **Enrollment vs Recognition**：
  - 注册：录入数据库，可慢、可重复测量，但必须非常精确 → 现实中可能是薄弱点（root trust）。
  - 识别：必须快速、简单，同时足够准确。
- **错误率** ★：
  - **Fraud**：攻击者被误认成 Alice（冒充者被接受）；
  - **Insult**：Alice 未被认成 Alice（本人被拒绝）；
  - 两者此消彼长：99% 匹配阈值 → 低 fraud、高 insult；30% → 高 fraud、低 insult。
  - **Equal Error Rate (EER)**：fraud = insult 的点，用于比较不同生物特征。
  - ⚠ 课件把 fraud 标为 “false negative”、insult 标为 “false positive”，与常规术语相反；**按定义描述记**：冒充者被接受 = fraud，本人被拒 = insult。
- 生物特征并非万无一失：可偷拇指、复印指纹/虹膜、攻破软件/数据库/可信基；且**无法撤销**“被泄露的指纹”。

---

### W7-B 网络基础与安全（network security）

**一句话**：网络是分层、分组交换的协议栈；每一层都有自己的地址与协议，也都有自己的攻击面（应用层欺骗、传输层 DoS、网络层 IP/NAT、链路层 ARP 欺骗）。

#### 2.12.1 基础概念 ★

- 组成：主机（computer/laptop/server/phone）+ 互联的路由器 mesh；目的是传数据。
- **分组交换 vs 电路交换**：
  - 电话网是电路交换：每次通话建立专用电路，带宽浪费。
  - 数据网是分组交换：数据切成分组、独立传输、无专用电路；带宽效率高，但更复杂。
- **协议**：精确规定通信规则；细节在 **RFC**（事实上的 Internet 标准）。
- **Stateless vs Stateful**：无状态不“记住”，有状态“记住”；许多安全问题与状态有关（如 DoS 针对有状态协议）。

#### 2.12.2 五层协议栈 ★★

| 层 | 协议例 | 作用 |
|---|---|---|
| Application | HTTP, FTP, SMTP, DNS | 应用语义 |
| Transport | TCP, UDP | 端到端传输 |
| Network | IP, routing (RIP/OSPF/BGP) | 路由/寻址 |
| Link | Ethernet, PPP, 802.11 | 相邻节点传输 |
| Physical | — | 比特流 |

- **分层运行**：源端数据沿栈“下行”，每层加头；路由器只处理到网络层（路由信息在此）；目的端“上行”到应用层。
- **封装**：`(H, (H, (H, (H, X))))`，应用数据在最内层。

#### 2.12.3 应用层 ★

- **Client-Server**：客户端先说，服务器响应；**P2P**：主机同时是 client 和 server。
- **HTTP**：请求/响应；**HTTP 是无状态的**。
- **Cookie**：服务器首次下发，浏览器保存并在后续请求中带回；服务器用 cookie 数据库“记住”你。
  - 用途：购物车、推荐；
  - 是很弱很弱的认证；
  - 隐私问题：单个站点可了解你，多个站点联合可了解更多（追踪）。
- **SMTP**：发送方 → 收件人邮件服务器；再用 POP3/IMAP/HTTP 取信。
  - 命令**人类可读**：`telnet server 25` → `HELO`、`MAIL FROM`、`RCPT TO`、`DATA`、`.`、`QUIT`。
  - ⚔ **伪造发件人**：`MAIL FROM: <arnold@ca.gov>` 可随意写 → 邮件欺骗（PoC；真实实现还有更多检查）。
- **DNS**：
  - 域名 → IP（如 `cse.ust.hk` → `143.89.41.177`）；分布式数据库。
  - 解析：root → TLD（.hk/.org/.edu）→ 子域，递归进行。
  - 全球只有 **13 个 root server 集群** → 事实上的单点故障；针对根服务器的攻击发生过，但未持续足够久。
  - ⚔ **DNS 缓存投毒**：服务器为性能缓存解析结果；若收到并缓存了**假记录**，就把错误 IP 返回给客户端 → 流量被引到攻击者机器。

#### 2.12.4 传输层 ★

- 网络层只提供“尽力而为”的不可靠交付；改进服务由主机（传输层）提供。
- **TCP**：可靠、按序、流控、面向连接（先联系再发数据；逻辑连接，非物理连接）。
  - 头部：源/目的端口、序号、确认号、标志位（ACK/SYN/RST…）、窗口、校验和、紧急指针；无选项时 **20 字节**。
- **三次握手**：`SYN` → `SYN-ACK` → `ACK`（可带数据）。
- ⚔ **SYN flooding**：
  - 服务器收到 SYN 就记住“半开连接” → 消耗资源；
  - 大量半开连接 → 内存耗尽/崩溃 → 无法服务正常请求；
  - 根因：**TCP 是有状态的**。
- **UDP**：无连接、开销小、不保证可靠/有序。

#### 2.12.5 网络层 ★

- IP：尽力而为；每台主机、每个路由器都运行 IP；路由器还跑路由协议（RIP/OSPF/BGP）。
- IPv4 地址 **32 bit**，点分十进制（`195.72.180.27`，每段 0–255）；地址不够用 → 各种扩展技巧；主机 IP 可能变化。
- **Socket = IP + 端口**，全球唯一标识一个进程。
  - 端口 16 bit；<1024 为 well-known（HTTP 80、POP3 110）；>1024 动态。
- **NAT**：用一个（或少数）公网 IP + 不同端口映射多个内网主机；扩展地址空间，并**隐式隐藏内网源地址**。
  - 代价/缺点：**DoS 仍可行**；破坏端到端透明性（课件只强调 DoS）。
  - 例：内网 `192.168.0.12:1025` ↔ 公网 `11.0.0.1:4000`，NAT 表维护映射。
- ⚔ **Ping flood / Ping of Death**：滥用 ICMP echo request/reply；大量 ICMP 淹没受害者；但攻击前可能先塞满自己的带宽。

#### 2.12.6 链路层 ★

- 在网卡（NIC）中实现，NIC 半自治、基本不受主机控制；同时实现链路层与物理层。
- **MAC 地址**：48 bit，全球唯一；用于在同一链路上转发。
  - 类比：IP 像家庭住址，MAC 像身份证号。
- **ARP**：已知 IP，求对应 MAC；每台主机有 ARP 表/缓存，自动生成，条目约 20 分钟后过期；ARP **无状态**。
- ⚔ **ARP 缓存投毒**：
  - 攻击者主动发送伪造 ARP reply（如“111.111.111.002 的 MAC 是 CC-CC-...”）；
  - 双方缓存被污染 → 流量经过攻击者 → **中间人**。

#### 2.12.7 按层归纳攻击面 ★

| 层 | 攻击 | 防御方向 |
|---|---|---|
| 应用 | SMTP 伪造、DNS 投毒、Cookie 隐私 | 认证（SPF/DKIM）、DNSSEC、隐私策略 |
| 传输 | SYN flood | SYN cookies、限流、防火墙 |
| 网络 | IP 欺骗、Ping flood、NAT 规避 | 入口过滤、限速 |
| 链路 | ARP 投毒 | 静态 ARP、DAI、加密 |

---

## 3. 横向串联

### 3.1 攻击 ↔ 防御 ↔ CIA 对照表

| 攻击 | 讲 | 破坏 | 关键防御 |
|---|---|---|---|
| 频率分析破古典密码 | w1 | C | OTP/强密码 |
| DES 穷举 | w2 | C | AES/长密钥 |
| ECB cut-and-paste | w2 | I | CBC/CTR + MAC/AE |
| CBC 比特翻转 | w2 | I | MAC/AE |
| RSA 分解 / 侧信道 | w3/w6 | C | 长密钥、常数时间、盲化 |
| DH MiM | w3 | C/Auth | 证书、签名、认证 DH |
| 哈希碰撞 | w3 | I | SHA-256/512、加长输出 |
| 蠕虫/病毒/木马 | w4 | A/C/I | 补丁、签名+行为检测、沙箱 |
| 逆向/破解 | w4 | IP/认证 | 混淆、加壳、反调试 |
| 栈溢出 | w5 | C/I/A | NX、canary、ASLR、安全语言 |
| UAF/double free | w6 | C/I/A | 置 NULL、智能指针、GC |
| 格式化字符串 | w6 | C/I | 硬编码格式串、禁用 %n |
| SQL 注入 | w6 | C/I | 预处理语句、最小权限 |
| 时间/缓存/功耗侧信道 | w6 | C | 常数时间、盲化、隔离 |
| 口令字典/撞库 | w7 | C | 长 passphrase、salt、慢哈希、2FA |
| 生物特征伪造 | w7 | C | 多因子、活体检测、可撤销凭证 |
| SMTP 伪造/DNS 投毒/ARP 投毒/SYN flood | w7 | C/I/A | 认证、DNSSEC、DAI、SYN cookies |

### 3.2 数字速记表 ★

| 数字 | 含义 |
|---|---|
| 26! ≈ 4.03×10²⁶ > 2⁸⁸ | 一般单表替换的密钥空间 |
| 2⁵⁶ | DES 密钥空间（实际 56 bit） |
| 2⁵⁷ | 双重加密（2DES `E(E(P,K1),K2)`）经中间相遇攻击后的代价；3DES 改用 EDE 正是为避免这一点 |
| 2¹¹² | 3DES 两密钥有效强度 |
| 2¹²⁶ | TEA 等价密钥后的有效强度 |
| 10/12/14 | AES-128/192/256 的轮数 |
| 245 字节 | 2048-bit RSA 可加密的最大明文（PKCS#1 v1.5） |
| \(2^{N/2}\) | N-bit 哈希找碰撞的代价 |
| 23 / 253 | 生日问题 / 预生日问题的人数 |
| 64 字节 | 典型 cache line 大小 |
| 99 行 | Morris Worm 代码量（1988-11-03） |
| 376 字节 / 75,000 / 8.5 秒 | SQL Slammer 的包大小 / 10 分钟感染数 / 翻倍时间 |
| 0x000aff0d | 经典 canary 常量 |
| 8% | canary 对 Web 服务器的性能影响 |
| 1.5× | 加密 + MAC 的优化开销 |
| 13 | DNS 根服务器集群数 |
| 32 / 16 / 48 bit | IPv4 地址 / 端口 / MAC 地址 |
| 20 字节 | 无选项 TCP 首部 |
| ~20 分钟 | ARP 缓存过期时间 |
| 0x9e3779b9 | TEA 的 delta 常数 |

### 3.3 易混概念对照 ⚠

| A | B | 区别 |
|---|---|---|
| 加密 | MAC/签名 | 加密保机密性；MAC/签名保完整性；只有签名抗抵赖 |
| MAC | 数字签名 | MAC 对称、双方可伪造；签名非对称、只有私钥持有者能签 |
| 哈希 | 加密 | 哈希无密钥、单向、定长；加密可逆、有密钥 |
| weak collision | strong collision | 给定 x 找 y；任意找一对 |
| stream cipher | block cipher | 按 bit/byte vs 按块；OTP 推广 vs 码本 |
| ECB | CBC | 独立加密 vs 链式；相同明文块是否产生相同密文 |
| 3DES EDE | EEE | EDE 可向后兼容单密钥 DES |
| worm | virus | 主动自我传播 vs 依附宿主被动传播 |
| trojan | backdoor | 伪装正常软件 vs 绕过认证的隐蔽入口 |
| 线性反汇编 | 递归反汇编 | 顺序解码 vs 沿控制流遍历 |
| disassembler | decompiler | 到汇编 vs 到源码 |
| UAF | double free | 释放后使用 vs 释放两次 |
| fraud | insult | 冒充者被接受 vs 本人被拒绝（此消彼长，EER 相等点） |
| 认证 | 授权 | 你是谁 vs 你能做什么 |
| stateful | stateless | 记住状态（易 DoS）vs 不记状态 |

### 3.4 术语中英对照

| 中文 | English |
|---|---|
| 机密性/完整性/可用性 | Confidentiality / Integrity / Availability |
| 威胁模型 | threat model |
| 攻击面 | attack surface |
| 最小权限 | least privilege |
| 开放设计 | open design |
| 机制最小化 | economy of mechanism |
| 明文/密文/密钥 | plaintext / ciphertext / key |
| 穷举密钥搜索 | exhaustive key search |
| 频率分析 | frequency analysis |
| 一次性密码本 | one-time pad (OTP) |
| 流密码/分组密码 | stream cipher / block cipher |
| 密钥流 | keystream |
| 轮函数/子密钥 | round function / subkey |
| 分组模式 | mode of operation |
| 初始化向量 | initialization vector (IV) |
| 消息认证码 | message authentication code (MAC) |
| 认证加密 | authenticated encryption (AE) |
| 陷门单向函数 | trapdoor one-way function |
| 中间相遇攻击 | meet-in-the-middle attack |
| 中间人攻击 | man-in-the-middle (MiM) |
| 公钥基础设施 | public key infrastructure (PKI) |
| 证书吊销列表 | certificate revocation list (CRL) |
| 抗抵赖 | non-repudiation |
| 原像/碰撞 | preimage / collision |
| 雪崩效应 | avalanche effect |
| 恶意软件 | malware |
| 蠕虫/病毒/木马/后门 | worm / virus / trojan / backdoor |
| 勒索软件 | ransomware |
| 变形/多态恶意软件 | metamorphic / polymorphic malware |
| 逆向工程 | reverse engineering |
| 反汇编器/反编译器 | disassembler / decompiler |
| 控制流图 | control flow graph (CFG) |
| 缓冲区溢出 | buffer overflow |
| 栈金丝雀 | stack canary |
| 地址空间布局随机化 | ASLR |
| 写异或执行 | W^X / DEP |
| 释放后使用 | use-after-free (UAF) |
| 双重释放 | double free |
| 格式化字符串 | format string |
| SQL 注入 | SQL injection |
| 侧信道 | side channel |
| 缓存行 | cache line |
| 简单功耗分析 | simple power analysis (SPA) |
| 认证/授权 | authentication / authorization |
| 口令短语 | passphrase |
| 盐 | salt |
| 生物特征 | biometrics |
| 错误接受率/错误拒绝率 | fraud rate / insult rate |
| 等错误率 | equal error rate (EER) |
| 双因子认证 | two-factor authentication (2FA) |
| 分组交换 | packet switching |
| 封装 | encapsulation |
| 套接字 | socket |
| 网络地址转换 | NAT |
| 地址解析协议 | ARP |
| 拒绝服务 | denial of service (DoS) |

---

## 4. 自测清单（能不看笔记答出即过关）

### w1
1. CIA 各是什么？各举一个攻击例子。
2. 漏洞的“设计原因”和“实现原因”各举三例。
3. 威胁模型要回答哪三个问题？以云平台为例说明。
4. Saltzer & Schroeder 的三条原则是什么？各解决什么问题？
5. 为什么 OTP 可证明安全？它的三个使用条件是什么？为什么现实中不用？

### w2
6. 流密码和分组密码的本质区别？各举两个算法。
7. A5/1 的 majority clocking 怎么工作？输出位怎么算？
8. RC4 的 KSA 和 PRGA 各做什么？为什么要丢弃前 256 字节？
9. Feistel 加解密公式？为什么“任意 F 都能解密，但不是任意 F 都安全”？
10. DES 的分组/密钥/轮数/S-box 规格？安全性来自哪里？
11. 3DES 为什么用 EDE？为什么不能用 `E(E(P,K1),K2)`（中间相遇攻击把 2¹¹² 降到了多少）？
12. AES 的四个轮操作及作用？为什么不是 Feistel？
13. ECB 的两个致命问题？CBC 如何解决？CBC 还剩下什么问题？
14. CTR 的 nonce 为什么绝不能重用？
15. MAC 为什么能检测篡改？为什么加密和 MAC 要用不同密钥？
16. Grover 算法对 AES 的影响？对策是什么？

### w3
17. RSA 密钥生成、加解密、安全性假设？
18. 为什么 RSA 要“每步取模 + 反复平方”？2048-bit 能加密多长明文？
19. 混合加密的流程？为什么需要它？
20. DH 的共享密钥怎么推导？MiM 怎么发生、怎么防？
21. 数字签名为什么能抗抵赖，而 MAC 不能？
22. 证书里有什么？CA 的作用？根 CA 为什么可信？
23. 哈希五个性质？生日攻击为什么是 \(2^{N/2}\)？
24. 哈希链如何实现一次性口令？为什么安全？
25. Shor 算法对 RSA/DH 意味着什么？对称密码为什么没事？

### w4
26. worm/virus/trojan/backdoor 的区别？
27. Morris Worm 和 SQL Slammer 的传播机制与教训？
28. PE 病毒如何感染可执行文件？
29. “Reflections on Trusting Trust” 说明了什么？XcodeGhost 是什么？
30. 静态签名检测与动态行为检测的优缺点？如何绕过？
31. metamorphic malware 如何变异？如何检测？
32. 线性反汇编为什么会失败？递归反汇编如何解决？
33. 反编译器的流水线？变量/类型恢复的难点？
34. 如何用反汇编 + patch 绕过序列号检查？little-endian 在其中的作用？

### w5
35. 栈帧布局？溢出为什么能覆盖返回地址？
36. overread 和 overwrite 的区别？Heartbleed 属于哪种？
37. 溢出利用的完整步骤？NOP sled 的作用？
38. W^X、canary、ASLR 各自防什么、有什么局限？
39. 混淆的三类？控制流平坦化和不透明谓词的原理？
40. 混淆效果从哪四个维度评估？为什么“安全混淆”很难？

### w6
41. UAF 的成因与利用思路？如何修复？
42. double free 如何破坏堆？如何防？
43. `%s` 和 `%n` 在格式化字符串攻击中分别做什么？如何防？
44. SQL 注入的原理？为什么 prepared statement 能防住？
45. 侧信道攻击的三个构成条件？
46. RSA 平方-乘为什么泄露密钥位？如何防御（思路）？
47. Flush+Reload 的原理？强/弱威胁模型的差别？
48. 为什么云环境放大缓存侧信道风险？

### w7
49. 认证与授权的区别？三种认证因子？
50. 为什么口令熵远低于同等长度随机密钥？salt 解决什么问题？
51. passphrase 的实验结论？EER 是什么？
52. 生物特征的理想属性？fraud/insult 如何权衡？为什么生物特征难撤销？
53. 五层协议栈及各层协议？封装过程？
54. Cookie 与 HTTP 状态的关系？隐私风险？
55. DNS 解析流程与缓存投毒？
56. TCP 三次握手与 SYN flood 的关系？为什么根因是“有状态”？
57. NAT 的优点与缺点？socket 由什么组成？
58. ARP 投毒如何形成中间人？如何缓解？

---

## 5. 复习优先级建议

1. **先背框架**：§1 地图 + §3.1 对照表 + §3.3 易混表。
2. **再抠机制**：Feistel/DES/AES、CBC/MAC、RSA/DH、栈帧溢出、UAF、格式化字符串、侧信道三条件、TCP/ARP。
3. **最后记数字**：§3.2；数字题最容易“知道但记错”。
4. **答题模板**：定义 → 机制/步骤 → 攻击 → 防御 → 局限。任何“请分析某攻击”的题都可套这五段。

> 说明：课件未明确标注考试范围；若按“前半学期”理解，w1–w4 是主干，w5 的缓冲区溢出常与前半段合并考。以教师/Canvas 通知为准。
