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

// US states with their own OSHA-approved state plans
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

const DEFAULT_AUTHORITY: SafetyAuthority = {
  code: "DEFAULT",
  name: "Your auditor",
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
