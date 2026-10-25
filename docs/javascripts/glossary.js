const GLOSSARY = {
  "CIA": [
    "Confidentiality, Integrity, Availability",
    "机密性、完整性、可用性"
  ],
  "OTP": [
    "One-Time Pad",
    "一次性密码本"
  ],
  "XOR": [
    "Exclusive OR",
    "异或运算"
  ],
  "DES": [
    "Data Encryption Standard",
    "数据加密标准"
  ],
  "3DES": [
    "Triple Data Encryption Standard",
    "三重 DES"
  ],
  "AES": [
    "Advanced Encryption Standard",
    "高级加密标准"
  ],
  "AES-NI": [
    "AES New Instructions",
    "AES 硬件指令集"
  ],
  "ECB": [
    "Electronic Codebook",
    "电子密码本模式"
  ],
  "CBC": [
    "Cipher Block Chaining",
    "密码分组链接模式"
  ],
  "CTR": [
    "Counter Mode",
    "计数器模式"
  ],
  "IV": [
    "Initialization Vector",
    "初始化向量"
  ],
  "AE": [
    "Authenticated Encryption",
    "认证加密"
  ],
  "KSA": [
    "Key Scheduling Algorithm",
    "密钥调度算法（RC4 初始化）"
  ],
  "PRGA": [
    "Pseudo-Random Generation Algorithm",
    "伪随机生成算法（RC4 产流）"
  ],
  "RC4": [
    "Rivest Cipher 4",
    "由 Ron Rivest 设计的流密码"
  ],
  "TEA": [
    "Tiny Encryption Algorithm",
    "微型加密算法"
  ],
  "RSA": [
    "Rivest–Shamir–Adleman",
    "由三位作者姓氏命名的公钥算法"
  ],
  "DH": [
    "Diffie–Hellman",
    "迪菲–赫尔曼密钥交换"
  ],
  "PKI": [
    "Public Key Infrastructure",
    "公钥基础设施"
  ],
  "CA": [
    "Certificate Authority",
    "证书颁发机构"
  ],
  "CRL": [
    "Certificate Revocation List",
    "证书吊销列表"
  ],
  "X.509": [
    "X.509 Public Key Certificate Standard",
    "X.509 公钥证书标准"
  ],
  "SHA": [
    "Secure Hash Algorithm",
    "安全哈希算法"
  ],
  "MD5": [
    "Message Digest 5",
    "消息摘要算法第 5 版"
  ],
  "TLS": [
    "Transport Layer Security",
    "传输层安全协议"
  ],
  "UAF": [
    "Use-After-Free",
    "释放后使用"
  ],
  "SQLi": [
    "SQL Injection",
    "SQL 注入"
  ],
  "ASLR": [
    "Address Space Layout Randomization",
    "地址空间布局随机化"
  ],
  "NX": [
    "No-eXecute",
    "不可执行位"
  ],
  "DEP": [
    "Data Execution Prevention",
    "数据执行保护"
  ],
  "ROP": [
    "Return-Oriented Programming",
    "返回导向编程"
  ],
  "PIE": [
    "Position-Independent Executable",
    "位置无关可执行文件"
  ],
  "CFI": [
    "Control Flow Integrity",
    "控制流完整性"
  ],
  "PE": [
    "Portable Executable",
    "Windows 可移植可执行文件格式"
  ],
  "RE": [
    "Reverse Engineering",
    "逆向工程"
  ],
  "CFG": [
    "Control Flow Graph",
    "控制流图"
  ],
  "NOP": [
    "No Operation",
    "空操作指令"
  ],
  "EBP": [
    "Extended Base Pointer",
    "扩展基址指针"
  ],
  "ESP": [
    "Extended Stack Pointer",
    "扩展栈指针"
  ],
  "SPA": [
    "Simple Power Analysis",
    "简单功耗分析"
  ],
  "DPA": [
    "Differential Power Analysis",
    "差分功耗分析"
  ],
  "EER": [
    "Equal Error Rate",
    "等错误率"
  ],
  "PIN": [
    "Personal Identification Number",
    "个人识别码"
  ],
  "DoS": [
    "Denial of Service",
    "拒绝服务"
  ],
  "MITM": [
    "Man-in-the-Middle",
    "中间人攻击"
  ],
  "TCP": [
    "Transmission Control Protocol",
    "传输控制协议"
  ],
  "UDP": [
    "User Datagram Protocol",
    "用户数据报协议"
  ],
  "DNS": [
    "Domain Name System",
    "域名系统"
  ],
  "ARP": [
    "Address Resolution Protocol",
    "地址解析协议"
  ],
  "NAT": [
    "Network Address Translation",
    "网络地址转换"
  ],
  "SMTP": [
    "Simple Mail Transfer Protocol",
    "简单邮件传输协议"
  ],
  "IMAP": [
    "Internet Message Access Protocol",
    "互联网消息访问协议"
  ],
  "POP3": [
    "Post Office Protocol version 3",
    "邮局协议第 3 版"
  ],
  "HTTP": [
    "HyperText Transfer Protocol",
    "超文本传输协议"
  ],
  "ICMP": [
    "Internet Control Message Protocol",
    "互联网控制消息协议"
  ],
  "TTL": [
    "Time To Live",
    "生存时间"
  ],
  "GSM": [
    "Global System for Mobile Communications",
    "全球移动通信系统"
  ],
  "EDE": [
    "Encrypt-Decrypt-Encrypt",
    "加密-解密-加密（3DES 的两密钥结构）"
  ],
  "VM": [
    "Virtual Machine",
    "虚拟机"
  ],
  "GOT": [
    "Global Offset Table",
    "全局偏移表"
  ],
  "CPU": [
    "Central Processing Unit",
    "中央处理器"
  ]
};
(function () {
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function expand() {
    if (!(document.documentElement.lang || '').toLowerCase().startsWith('zh')) return;
    if (location.pathname.indexOf('/glossary/') !== -1) return;
    if (location.pathname.indexOf('/review/') === -1 && location.pathname.indexOf('/hw/') === -1) return;
    var root = document.querySelector('.md-typeset');
    if (!root || root.dataset.glossaryDone) return;
    root.dataset.glossaryDone = '1';

    var skip = {CODE:1, PRE:1, H1:1, H2:1, H3:1, H4:1, H5:1, H6:1, A:1, TD:1, TH:1, SCRIPT:1, STYLE:1};
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var p = node.parentElement;
        while (p && p !== root) {
          if (skip[p.tagName]) return NodeFilter.FILTER_REJECT;
          p = p.parentElement;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    var terms = Object.keys(GLOSSARY).sort(function (a, b) { return b.length - a.length; });
    var rx = new RegExp('(?<![A-Za-z0-9])(' + terms.map(esc).join('|') + ')(?![A-Za-z0-9])', 'g');
    var done = Object.create(null);

    nodes.forEach(function (node) {
      var text = node.nodeValue;
      if (!text || text.length < 2) return;
      var out = '', last = 0, m;
      rx.lastIndex = 0;
      while ((m = rx.exec(text)) !== null) {
        var term = m[1];
        if (done[term]) continue;
        var start = m.index, end = start + term.length;
        var before = text.slice(0, start);
        var after = text.slice(end);
        if (/^[（(]/.test(after)) continue;
        if (/[（(]$/.test(before)) continue;
        if (after.charAt(0) === '-') continue;
        var info = GLOSSARY[term];
        out += text.slice(last, start) + term + '（' + info[0] + '，' + info[1] + '）';
        last = end;
        done[term] = true;
      }
      if (last) {
        out += text.slice(last);
        node.nodeValue = out;
      }
    });
  }
  if (typeof document$ !== 'undefined') document$.subscribe(expand);
  else document.addEventListener('DOMContentLoaded', expand);
})();
