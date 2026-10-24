# CSIT5730 · Web Cybersecurity 复习笔记

> 个人整理的 HKUST CSIT5730（Principles of Cybersecurity, 2026 Fall）复习资料。
>
> **非官方资料**；课程内容与课件版权归授课教师所有，本仓库不包含原始课件 PDF。

**在线阅读**：<https://dionysus23334.github.io/CSIT-5730-WebCybersecurity/>

## 内容

- [知识大纲](docs/outline.md)：全课知识地图、分讲大纲、横向对比、数字速记、58 道自测
- [复习资料总目录](docs/review/index.md)：7 章复习材料、三遍复习法、4 天冲刺计划、高频计算题索引
- [术语表](docs/glossary.md)：缩写全称、中文含义与首次出现位置

### 七章复习资料

| 章 | 主题 | 文件 |
|---|---|---|
| 1 | 导论与古典密码 | [第1章](docs/review/ch1-intro.md) |
| 2 | 对称密码 | [第2章](docs/review/ch2-symmetric.md) |
| 3 | 公钥密码 | [第3章](docs/review/ch3-public-key.md) |
| 4 | 恶意软件与逆向工程 | [第4章](docs/review/ch4-malware-re.md) |
| 5 | 缓冲区溢出与混淆 | [第5章](docs/review/ch5-buffer-obfuscation.md) |
| 6 | 软件利用 II 与侧信道 | [第6章](docs/review/ch6-exploit-sidechannel.md) |
| 7 | 认证与网络安全 | [第7章](docs/review/ch7-auth-network.md) |

### 作业解析

- [作业一复盘](docs/hw/hw1.md)：古典密码、OTP、穷举、CTR、MAC、CBC、RSA、签名、哈希
- [作业二复盘](docs/hw/hw2.md)：反汇编、恶意软件检测、格式化字符串、Trusting Trust、缓冲区溢出

## 使用建议

1. 先读知识大纲 §1 建立全局地图；
2. 按章读复习资料的“主线 → 精讲 → 例题”；
3. 遮住答案做每章“自测”，错题回到精讲；
4. 考前只看每章“速记卡”和易错点。

## 本地预览

```bash
python3 -m venv .venv-docs
.venv-docs/bin/pip install -r requirements.txt
.venv-docs/bin/mkdocs serve
```

打开 <http://127.0.0.1:8000>。推送到 `main` 后，GitHub Actions 会自动构建并部署到 Pages。

## 说明

- 资料为个人总结，可能存在遗漏或错误；以课件、课堂与教师通知为准。
- 若本仓库为公开状态，请勿用于商业用途，也不要二次分发课件原文。
- 第 4/5/6/7 章各含两份课件，已在同一章内分节。
