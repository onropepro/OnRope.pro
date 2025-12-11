# Dynamic Safety Authority Headline Implementation

## Overview

Dynamically display the appropriate workplace safety regulatory authority name in the Safety & Compliance module landing page headline based on visitor IP geolocation.

**Goal:** Make the headline feel locally relevant and immediately credible to rope access operators across North America.

**Example Output:**
- BC visitor sees: "WorkSafeBC just pulled into the parking lot."
- Maryland visitor sees: "MOSH just pulled into the parking lot."
- Ontario visitor sees: "MOL just pulled into the parking lot."
- Unknown location sees: "The safety inspector just pulled into the parking lot."

---

## Technical Approach

### 1. IP Geolocation Service

Use a client-side or server-side geolocation API. Recommended options:

**Client-side (simpler, free tier available):**
- ipapi.co (free: 1,000 requests/day)
- ipinfo.io (free: 50,000 requests/month)
- ip-api.com (free for non-commercial, 45 requests/minute)

**Server-side (more reliable, avoids ad blockers):**
- MaxMind GeoIP2 (free GeoLite2 database)
- Cloudflare headers (if using Cloudflare)

**Recommended:** ipinfo.io or ipapi.co for simplicity. Both return region/state codes reliably.

### 2. Response Data Structure

Typical geolocation API response:

```json
{
  "ip": "24.84.xxx.xxx",
  "country": "CA",
  "region": "British Columbia",
  "region_code": "BC",
  "city": "Vancouver"
}
```

US responses will have `country: "US"` and `region_code` as two-letter state abbreviation (e.g., "CA", "MD", "TX").

### 3. Authority Lookup Map

```typescript
// safety-authorities.ts

interface SafetyAuthority {
  code: string;
  name: string;
  fullName: string;
}

// Canadian provinces and territories
const CANADA_AUTHORITIES: Record<string, SafetyAuthority> = {
  BC: { code: "BC", name: "WorkSafeBC", fullName: "Workers' Compensation Board of British Columbia" },
  AB: { code: "AB", name: "Alberta OHS", fullName: "Alberta Occupational Health and Safety" },
  SK: { code: "SK", name: "Sask OHS", fullName: "Saskatchewan Occupational Health and Safety" },
  MB: { code: "MB", name: "WSH", fullName: "Workplace Safety and Health Manitoba" },
  ON: { code: "ON", name: "MOL", fullName: "Ministry of Labour, Immigration, Training and Skills Development" },
  QC: { code: "QC", name: "CNESST", fullName: "Commission des normes, de l'équité, de la santé et de la sécurité du travail" },
  NB: { code: "NB", name: "WorkSafeNB", fullName: "Workplace Health, Safety and Compensation Commission of New Brunswick" },
  NS: { code: "NS", name: "Nova Scotia OHS", fullName: "Nova Scotia Occupational Health and Safety Division" },
  PE: { code: "PE", name: "WCB PEI", fullName: "Workers Compensation Board of Prince Edward Island" },
  NL: { code: "NL", name: "ServiceNL OHS", fullName: "Service NL Occupational Health and Safety Division" },
  YT: { code: "YT", name: "YWCHSB", fullName: "Yukon Workers' Compensation Health and Safety Board" },
  NT: { code: "NT", name: "WSCC", fullName: "Workers' Safety and Compensation Commission" },
  NU: { code: "NU", name: "WSCC", fullName: "Workers' Safety and Compensation Commission" },
};

// US states with their own OSHA-approved state plans (complete coverage)
const US_STATE_PLAN_AUTHORITIES: Record<string, SafetyAuthority> = {
  AK: { code: "AK", name: "AKOSH", fullName: "Alaska Occupational Safety and Health" },
  AZ: { code: "AZ", name: "ADOSH", fullName: "Arizona Division of Occupational Safety and Health" },
  CA: { code: "CA", name: "Cal/OSHA", fullName: "California Division of Occupational Safety and Health" },
  HI: { code: "HI", name: "HIOSH", fullName: "Hawaii Occupational Safety and Health Division" },
  IN: { code: "IN", name: "IOSHA", fullName: "Indiana Occupational Safety and Health Administration" },
  IA: { code: "IA", name: "Iowa OSHA", fullName: "Iowa Occupational Safety and Health Administration" },
  KY: { code: "KY", name: "Kentucky OSH", fullName: "Kentucky Occupational Safety and Health Program" },
  MD: { code: "MD", name: "MOSH", fullName: "Maryland Occupational Safety and Health" },
  MI: { code: "MI", name: "MIOSHA", fullName: "Michigan Occupational Safety and Health Administration" },
  MN: { code: "MN", name: "MNOSHA", fullName: "Minnesota Occupational Safety and Health Administration" },
  NV: { code: "NV", name: "Nevada OSHA", fullName: "Nevada Occupational Safety and Health Administration" },
  NM: { code: "NM", name: "NM OHSB", fullName: "New Mexico Occupational Health and Safety Bureau" },
  NC: { code: "NC", name: "NC OSH", fullName: "North Carolina Occupational Safety and Health Division" },
  OR: { code: "OR", name: "Oregon OSHA", fullName: "Oregon Occupational Safety and Health Division" },
  SC: { code: "SC", name: "SC OSHA", fullName: "South Carolina Occupational Safety and Health Administration" },
  TN: { code: "TN", name: "TOSHA", fullName: "Tennessee Occupational Safety and Health Administration" },
  UT: { code: "UT", name: "UOSH", fullName: "Utah Occupational Safety and Health Division" },
  VT: { code: "VT", name: "VOSHA", fullName: "Vermont Occupational Safety and Health Administration" },
  VA: { code: "VA", name: "VOSH", fullName: "Virginia Occupational Safety and Health Program" },
  WA: { code: "WA", name: "DOSH", fullName: "Washington Division of Occupational Safety and Health" },
  WY: { code: "WY", name: "Wyoming OSHA", fullName: "Wyoming Occupational Safety and Health Administration" },
};

// US states covered by Federal OSHA (no state plan for private sector)
const US_FEDERAL_OSHA_STATES = [
  "AL", "AR", "CO", "CT", "DE", "FL", "GA", "ID", "IL", "KS", 
  "LA", "ME", "MA", "MS", "MO", "MT", "NE", "NH", "NJ", "NY", 
  "ND", "OH", "OK", "PA", "RI", "SD", "TX", "WV", "WI", "DC"
];

// Default fallback
const DEFAULT_AUTHORITY: SafetyAuthority = {
  code: "DEFAULT",
  name: "The safety inspector",
  fullName: "Workplace Safety Inspector"
};

const FEDERAL_OSHA: SafetyAuthority = {
  code: "US_FEDERAL",
  name: "OSHA",
  fullName: "Occupational Safety and Health Administration"
};

export function getAuthorityByLocation(country: string, regionCode: string): SafetyAuthority {
  if (country === "CA") {
    return CANADA_AUTHORITIES[regionCode] || DEFAULT_AUTHORITY;
  }
  
  if (country === "US") {
    // Check if state has its own plan
    if (US_STATE_PLAN_AUTHORITIES[regionCode]) {
      return US_STATE_PLAN_AUTHORITIES[regionCode];
    }
    // Federal OSHA states
    if (US_FEDERAL_OSHA_STATES.includes(regionCode)) {
      return FEDERAL_OSHA;
    }
  }
  
  // Non-North American or unknown
  return DEFAULT_AUTHORITY;
}

export function buildHeadline(authority: SafetyAuthority): string {
  return `${authority.name} just pulled into the parking lot.`;
}
```

### 4. React Component Implementation

```tsx
// DynamicSafetyHeadline.tsx

import { useState, useEffect } from 'react';
import { getAuthorityByLocation, buildHeadline } from './safety-authorities';

interface GeoData {
  country: string;
  region_code: string;
}

export function DynamicSafetyHeadline() {
  const [headline, setHeadline] = useState("The safety inspector just pulled into the parking lot.");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLocation() {
      try {
        // Using ipapi.co as example (replace with preferred service)
        const response = await fetch('https://ipapi.co/json/');
        const data: GeoData = await response.json();
        
        const authority = getAuthorityByLocation(data.country, data.region_code);
        setHeadline(buildHeadline(authority));
      } catch (error) {
        // Silently fail to default headline
        console.error('Geolocation fetch failed:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLocation();
  }, []);

  return (
    <h1 className={`headline ${isLoading ? 'loading' : ''}`}>
      {headline}
    </h1>
  );
}
```

### 5. Server-Side Alternative (Recommended for Production)

To avoid client-side API calls and ad blocker issues, resolve geolocation server-side:

```typescript
// pages/api/geo.ts (Next.js example) or Express route

import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // If using Cloudflare, headers are already present
  const country = req.headers['cf-ipcountry'] as string || '';
  const region = req.headers['cf-region'] as string || '';
  
  // Or use MaxMind GeoLite2 database lookup with visitor IP
  // const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  // const geo = geoip.lookup(ip);
  
  res.json({ country, region_code: region });
}
```

### 6. Cloudflare Workers Alternative

If using Cloudflare, geolocation is available in the request object at no additional cost:

```javascript
// Cloudflare Worker
export default {
  async fetch(request) {
    const country = request.cf?.country || '';
    const region = request.cf?.region || '';
    
    // Pass to origin or modify response
  }
}
```

---

## Fallback Strategy

| Scenario | Display |
|----------|---------|
| Canada, known province | Province-specific authority (WorkSafeBC, MOL, CNESST, etc.) |
| US, state-plan state | State authority (Cal/OSHA, MOSH, MIOSHA, etc.) |
| US, federal OSHA state | "OSHA" |
| US, unknown state | "OSHA" |
| Canada, unknown province | "The safety inspector" |
| Non-North American | "The safety inspector" |
| API failure | "The safety inspector" |
| VPN/proxy detected | "The safety inspector" |

---

## UX Considerations

1. **No visible loading state**: Start with the generic fallback headline, then update if geolocation succeeds. The change should be instant enough that users won't notice a flash.

2. **Cache the result**: Store in sessionStorage to avoid repeated API calls on page navigation.

3. **Don't over-personalize**: Only use for the headline. The body copy should remain universal.

4. **Tooltip option**: Consider adding a subtle tooltip or hover state showing the full agency name for lesser-known abbreviations.

---

## Testing

Test with VPN connections to verify each region displays correctly:

**Canada test cases:**
- BC: "WorkSafeBC just pulled into the parking lot."
- ON: "MOL just pulled into the parking lot."
- QC: "CNESST just pulled into the parking lot."
- AB: "Alberta OHS just pulled into the parking lot."

**US test cases:**
- CA: "Cal/OSHA just pulled into the parking lot."
- MD: "MOSH just pulled into the parking lot."
- TX: "OSHA just pulled into the parking lot." (federal state)
- NY: "OSHA just pulled into the parking lot." (federal state)

**Edge cases:**
- UK IP: "The safety inspector just pulled into the parking lot."
- API timeout: "The safety inspector just pulled into the parking lot."

---

## Implementation Checklist

- [ ] Choose geolocation API provider
- [ ] Implement authority lookup map
- [ ] Create React component with useEffect fetch
- [ ] Add sessionStorage caching
- [ ] Test all Canadian provinces
- [ ] Test US state-plan states
- [ ] Test US federal OSHA states
- [ ] Test international/fallback scenarios
- [ ] Verify no layout shift on headline update
