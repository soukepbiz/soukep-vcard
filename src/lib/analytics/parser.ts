export interface ParsedUA {
  deviceType: 'mobile' | 'tablet' | 'desktop'
  browser: string
  os: string
}

export function parseUserAgent(userAgent: string): ParsedUA {
  const ua = userAgent.toLowerCase()

  // Device Type Detection
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'
  if (/(ipad|tablet|android(?!.*mobi)|playbook|silk)/.test(ua)) {
    deviceType = 'tablet'
  } else if (/(mobi|android|webos|iphone|ipod|blackberry|opera mini)/.test(ua)) {
    deviceType = 'mobile'
  }

  // Browser Detection (order matters - check specific before generic)
  let browser = 'Other'
  if (/edg/.test(ua)) {
    browser = 'Edge'
  } else if (/chrome|crios/.test(ua) && !/edg/.test(ua)) {
    browser = 'Chrome'
  } else if (/safari/.test(ua) && !/chrome/.test(ua)) {
    browser = 'Safari'
  } else if (/firefox|fxios/.test(ua)) {
    browser = 'Firefox'
  } else if (/opr|opera/.test(ua)) {
    browser = 'Opera'
  } else if (/trident/.test(ua)) {
    browser = 'Internet Explorer'
  }

  // OS Detection
  let os = 'Other'
  if (/windows nt/.test(ua)) {
    os = 'Windows'
  } else if (/macintosh|mac os x/.test(ua)) {
    os = 'macOS'
  } else if (/iphone|ipod|ipad/.test(ua)) {
    os = 'iOS'
  } else if (/android/.test(ua)) {
    os = 'Android'
  } else if (/x11|linux/.test(ua)) {
    os = 'Linux'
  }

  return { deviceType, browser, os }
}

export function getCountryName(code: string | null): string {
  if (!code) return 'Unknown'
  const names: Record<string, string> = {
    'FR': '🇫🇷 France',
    'US': '🇺🇸 USA',
    'GB': '🇬🇧 UK',
    'DE': '🇩🇪 Germany',
    'ES': '🇪🇸 Spain',
    'IT': '🇮🇹 Italy',
    'CA': '🇨🇦 Canada',
    'AU': '🇦🇺 Australia',
    'JP': '🇯🇵 Japan',
    'CN': '🇨🇳 China',
    'IN': '🇮🇳 India',
    'BR': '🇧🇷 Brazil',
    'MX': '🇲🇽 Mexico',
    'NL': '🇳🇱 Netherlands',
    'SE': '🇸🇪 Sweden',
    'CH': '🇨🇭 Switzerland',
    'BE': '🇧🇪 Belgium',
    'AT': '🇦🇹 Austria',
    'DK': '🇩🇰 Denmark',
    'NO': '🇳🇴 Norway',
    'PL': '🇵🇱 Poland',
    'CZ': '🇨🇿 Czech Republic',
    'SG': '🇸🇬 Singapore',
    'HK': '🇭🇰 Hong Kong',
    'KR': '🇰🇷 South Korea',
  }
  return names[code.toUpperCase()] || `${code}`
}
