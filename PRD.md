
# Product Requirements Document (PRD): SECURE_SCAN.IO

**Version**: 1.1  
**Status**: Implementation Ready  
**Owner**: Senior Frontend Engineer  

---

## 1. Executive Summary
SECURE_SCAN.IO is a web-based utility designed to provide immediate, actionable intelligence on suspicious web links. It addresses the growing sophistication of phishing attacks by providing a "Second Opinion" powered by Large Language Models (LLMs) alongside traditional security heuristics.

## 2. Target Audience
- **General Web Users**: Protecting themselves from SMS/Email phishing.
- **Cybersecurity Students**: Understanding the anatomy of a malicious URL.
- **IT Support Teams**: Quickly triaging reported suspicious links.

## 3. User Stories
- **US.1**: As a user, I want to paste a link and see a numerical safety score so I can decide if it's safe to click.
- **US.2**: As a user, I want an AI to explain *why* a link is dangerous in plain English.
- **US.3**: As a developer, I want to test common attack vectors (like Punycode) to see if the engine detects them correctly.
- **US.4**: As a frequent user, I want to see my previous scans so I don't have to re-analyze the same link twice.

## 4. Technical Architecture
### 4.1 Heuristic Engine (Local)
- **Input**: Raw String URL.
- **Logic**: Regular expressions and string parsing against known bad patterns (Shorteners, Suspicious Chars, High-risk TLDs).
- **Output**: Array of `AnalysisCheck` objects and a base score.

### 4.2 AI Intelligence Layer (Cloud)
- **Model**: `gemini-3-flash-preview` via `@google/genai`.
- **System Instruction**: Acts as a "Cybersecurity Expert" providing Zero-Trust assessments.
- **Integration**: Merges AI text output with local heuristic data for a holistic view.

## 5. Security Protocols (The "Tests")
The application implements specific checks to mitigate common web threats:
- **Homograph Defense**: Validates hostname for `xn--` prefixes.
- **Subdomain Depth**: Flags URLs with more than 3 levels of subdomains to prevent brand impersonation.
- **Protocol Enforcement**: Heavily penalizes non-HTTPS traffic.
- **Entropy Analysis**: Identifies non-human-readable domain segments.

## 6. UI/UX Design Principles
- **Futuristic/High-Contrast**: Using a "Cyber" aesthetic (Slate/Violet palette) to reinforce the security theme.
- **Feedback Loops**: Terminal logs during processing to reduce perceived latency.
- **Accessibility**: ARIA-compliant inputs and high-contrast text for critical warnings.

## 7. Future Roadmap
- **V2.0**: Integration with Google Safe Browsing API.
- **V2.1**: Screenshot preview of the target site in a sandboxed environment.
- **V2.2**: Browser extension for real-time protection.
