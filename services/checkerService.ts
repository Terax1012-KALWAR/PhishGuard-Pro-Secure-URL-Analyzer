
import { AnalysisCheck, AnalysisResult } from '../types';
import { SHORTENERS, SUSPICIOUS_CHARS, HIGH_RISK_TLDS } from '../constants';

export const runHeuristicAnalysis = (urlInput: string): AnalysisResult => {
  let url: URL;
  try {
    const sanitized = urlInput.trim();
    url = new URL(sanitized.startsWith('http') ? sanitized : `https://${sanitized}`);
  } catch (e) {
    throw new Error('Malformed URL detected. Security sweep aborted.');
  }

  const checks: AnalysisCheck[] = [];
  let score = 100;

  // 1. Check Protocol (Critical)
  if (url.protocol !== 'https:') {
    const impact = 30;
    checks.push({
      id: 'protocol',
      name: 'Transport Layer Security',
      status: 'danger',
      message: 'Connection is unencrypted (HTTP). Sensitive data can be intercepted.',
      impact
    });
    score -= impact;
  } else {
    checks.push({
      id: 'protocol',
      name: 'Transport Layer Security',
      status: 'passed',
      message: 'Verified HTTPS encryption is active.',
      impact: 0
    });
  }

  // 2. High-Risk TLDs
  const hostname = url.hostname.toLowerCase();
  const foundTld = HIGH_RISK_TLDS.find(tld => hostname.endsWith(tld));
  if (foundTld) {
    const impact = 25;
    checks.push({
      id: 'tld',
      name: 'Domain Reputation',
      status: 'warning',
      message: `Uses '${foundTld}', a TLD with high historical correlation to phishing campaigns.`,
      impact
    });
    score -= impact;
  }

  // 3. Punycode / Homograph Attacks
  if (hostname.startsWith('xn--')) {
    const impact = 40;
    checks.push({
      id: 'punycode',
      name: 'Homograph Attack',
      status: 'danger',
      message: 'Punycode detected. This domain uses international characters to look like a different site.',
      impact
    });
    score -= impact;
  }

  // 4. Suspicious Characters / Redirection
  const foundChars = SUSPICIOUS_CHARS.filter(char => url.href.includes(char));
  if (foundChars.length > 0) {
    const impact = Math.min(30, foundChars.length * 10);
    checks.push({
      id: 'chars',
      name: 'Obfuscation Check',
      status: foundChars.length > 2 ? 'danger' : 'warning',
      message: `Found characters (${foundChars.join(',')}) often used to hide the actual destination.`,
      impact
    });
    score -= impact;
  }

  // 5. Shorteners
  const isShortener = SHORTENERS.some(s => hostname.includes(s));
  if (isShortener) {
    const impact = 15;
    checks.push({
      id: 'shortener',
      name: 'Destination Obfuscation',
      status: 'warning',
      message: 'URL shortener used. The true target server is intentionally hidden.',
      impact
    });
    score -= impact;
  }

  // 6. Subdomain Spoofing
  const subdomains = hostname.split('.');
  if (subdomains.length > 3) {
    const impact = 20;
    checks.push({
      id: 'subdomains',
      name: 'Impersonation Vector',
      status: 'warning',
      message: 'Deep subdomain layering (e.g., brand.com.secure-login.net) detected.',
      impact
    });
    score -= impact;
  }

  return {
    id: crypto.randomUUID(),
    url: url.href,
    score: Math.max(0, score),
    checks,
    timestamp: Date.now()
  };
};
