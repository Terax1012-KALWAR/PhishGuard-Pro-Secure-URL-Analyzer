
export const SHORTENERS = [
  'bit.ly', 't.co', 'tinyurl.com', 'is.gd', 'buff.ly', 
  'adf.ly', 'bit.do', 'mcaf.ee', 'su.pr', 'rebrand.ly', 'goo.gl'
];

export const SUSPICIOUS_CHARS = ['@', '%', '$', '^', '&', '*', '!', '(', ')', '+', '='];

export const HIGH_RISK_TLDS = [
  '.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.pw', '.bid', '.date', '.loan', '.download', '.review'
];

export const STORAGE_KEY = 'scam_checker_history_v1';

export const MAX_HISTORY_ITEMS = 5;

export const TEST_CASES = [
  { name: "Safe Link", url: "https://www.google.com" },
  { name: "Insecure Protocol", url: "http://my-bank-login.com" },
  { name: "Suspicious TLD", url: "https://secure-update.tk" },
  { name: "Obfuscated URL", url: "https://paypal.com@verify-identity-823.top/login" },
  { name: "Punycode Phish", url: "https://xn--80ak6aa92e.com" }
];
