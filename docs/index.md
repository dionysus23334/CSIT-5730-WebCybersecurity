# CSIT5730 · 复习笔记

> HKUST **CSIT5730 Principles of Cybersecurity**（2026 Fall）个人复习整理。
>
> 非官方资料；课程内容与课件版权归授课教师所有。

## 从这里开始

- [**知识大纲**](outline.md) —— 全课知识地图、分讲大纲、横向对比、数字速记、58 道自测
- [**分章复习资料**](review/index.md) —— 7 章完整材料：主线、精讲、例题、易错、自测、速记卡

## 七章内容

| 章 | 主题 | 重点 |
|---|---|---|
| 1 | [导论与古典密码](review/ch1-intro.md) | CIA、威胁模型、Kerckhoffs、OTP |
| 2 | [对称密码](review/ch2-symmetric.md) | Feistel、DES/AES、ECB/CBC/CTR、MAC |
| 3 | [公钥密码](review/ch3-public-key.md) | RSA、DH、签名、PKI、哈希生日界 |
| 4 | [恶意软件与逆向工程](review/ch4-malware-re.md) | 蠕虫/病毒/木马、检测、反汇编、破解 |
| 5 | [缓冲区溢出与混淆](review/ch5-buffer-obfuscation.md) | 栈帧、ret 覆盖、NX/canary/ASLR、混淆 |
| 6 | [软件利用 II 与侧信道](review/ch6-exploit-sidechannel.md) | UAF、格式化字符串、SQLi、时间/缓存/功耗 |
| 7 | [认证与网络安全](review/ch7-auth-network.md) | 口令与 salt、生物特征、TCP/DNS/ARP |

## 作业解析

- [**作业一复盘**](hw/hw1.md) —— 古典密码、OTP、穷举、CTR、MAC、CBC、RSA、签名、哈希
- [**作业二复盘**](hw/hw2.md) —— 反汇编、恶意软件检测、格式化字符串、Trusting Trust、缓冲区溢出

## 怎么用

1. 先读知识大纲的 **§1 全局地图**，建立框架；
2. 按章读“主线 → 精讲 → 例题”，公式自己推一遍；
3. 遮住答案做每章“自测”，错题回到精讲；
4. 考前只看每章“速记卡”和“易错点”。

!!! note "说明"
    资料为个人总结，可能存在遗漏或错误；以课件、课堂与教师通知为准。
    第 4/5/6/7 章各含两份课件，已在同一章内分节。
