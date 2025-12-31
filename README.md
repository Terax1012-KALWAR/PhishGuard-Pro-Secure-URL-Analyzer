
# 🛡️ SECURE_SCAN.IO — AI URL Risk Intelligence

A professional-grade, futuristic cybersecurity tool designed to identify phishing attempts, scam links, and malicious URL patterns using a dual-layer analysis engine (Heuristic + Generative AI).

## 🚀 Key Features

- **Dual-Layer Analysis**: Combines local heuristic pattern matching with Google Gemini AI for deep threat assessment.
- **Security Lab**: Built-in testing suite to simulate various attack vectors (Punycode, Obfuscation, High-Risk TLDs).
- **Real-time Kernel Logs**: Watch the "Security Sweep" in action with a terminal-style analysis log.
- **Zero-Trust Intelligence**: Analyzes social engineering cues, homograph attacks (Punycode), and redirection tactics.
- **Local History**: Securely stores your recent scans in local storage for quick reference.

## 🛠️ Tech Stack

- **Frontend**: React (ES Modules via esm.sh)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Intelligence**: Google Gemini API (Gemini 3 Flash)
- **Deployment**: Single-page application structure

## 🔒 Security Measures

1. **Protocol Validation**: Detects unencrypted HTTP connections.
2. **Homograph Detection**: Identifies Punycode characters used to spoof legitimate domains.
3. **Entropy Check**: Flags suspicious subdomain layering and "keyboard mash" domains.
4. **Obfuscation Detection**: Checks for `@` symbols and encoded characters used for redirection.
5. **TLD Risk Scoring**: Flags domains registered on Top-Level Domains with high fraud rates.

## 🚦 Getting Started

1. Paste any suspicious URL into the main scan field.
2. Click **RUN SCAN** to initiate the multi-vector sweep.
3. Review the **Confidence Score** and the **AI Intelligent Assessment**.
4. Use the **Security Lab** at the bottom to test known malicious patterns for educational purposes.

---
*Disclaimer: This tool is for educational and advisory purposes. No automated tool can catch 100% of phishing threats. Always practice caution.*
