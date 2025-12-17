// Sales tax rates for Canada and US (2025)
// Tax rates are percentages (e.g., 5 means 5%)

export type TaxType = 'GST' | 'GST+PST' | 'GST+QST' | 'HST' | 'STATE' | 'NONE';

export type TaxInfo = {
  region: string;
  regionName: string;
  country: 'CA' | 'US';
  taxType: TaxType;
  gstRate: number;    // Federal GST rate (Canada) or 0
  pstRate: number;    // Provincial PST/QST rate (Canada) or state rate (US)
  hstRate: number;    // HST rate (Canada combined provinces) or 0
  totalRate: number;  // Combined total tax rate
};

// Canadian provinces and territories
export const canadianTaxRates: Record<string, TaxInfo> = {
  'AB': { region: 'AB', regionName: 'Alberta', country: 'CA', taxType: 'GST', gstRate: 5, pstRate: 0, hstRate: 0, totalRate: 5 },
  'BC': { region: 'BC', regionName: 'British Columbia', country: 'CA', taxType: 'GST+PST', gstRate: 5, pstRate: 7, hstRate: 0, totalRate: 12 },
  'MB': { region: 'MB', regionName: 'Manitoba', country: 'CA', taxType: 'GST+PST', gstRate: 5, pstRate: 7, hstRate: 0, totalRate: 12 },
  'NB': { region: 'NB', regionName: 'New Brunswick', country: 'CA', taxType: 'HST', gstRate: 0, pstRate: 0, hstRate: 15, totalRate: 15 },
  'NL': { region: 'NL', regionName: 'Newfoundland and Labrador', country: 'CA', taxType: 'HST', gstRate: 0, pstRate: 0, hstRate: 15, totalRate: 15 },
  'NS': { region: 'NS', regionName: 'Nova Scotia', country: 'CA', taxType: 'HST', gstRate: 0, pstRate: 0, hstRate: 14, totalRate: 14 },
  'NT': { region: 'NT', regionName: 'Northwest Territories', country: 'CA', taxType: 'GST', gstRate: 5, pstRate: 0, hstRate: 0, totalRate: 5 },
  'NU': { region: 'NU', regionName: 'Nunavut', country: 'CA', taxType: 'GST', gstRate: 5, pstRate: 0, hstRate: 0, totalRate: 5 },
  'ON': { region: 'ON', regionName: 'Ontario', country: 'CA', taxType: 'HST', gstRate: 0, pstRate: 0, hstRate: 13, totalRate: 13 },
  'PE': { region: 'PE', regionName: 'Prince Edward Island', country: 'CA', taxType: 'HST', gstRate: 0, pstRate: 0, hstRate: 15, totalRate: 15 },
  'QC': { region: 'QC', regionName: 'Quebec', country: 'CA', taxType: 'GST+QST', gstRate: 5, pstRate: 9.975, hstRate: 0, totalRate: 14.975 },
  'SK': { region: 'SK', regionName: 'Saskatchewan', country: 'CA', taxType: 'GST+PST', gstRate: 5, pstRate: 6, hstRate: 0, totalRate: 11 },
  'YT': { region: 'YT', regionName: 'Yukon', country: 'CA', taxType: 'GST', gstRate: 5, pstRate: 0, hstRate: 0, totalRate: 5 },
  // Full names for matching
  'Alberta': { region: 'AB', regionName: 'Alberta', country: 'CA', taxType: 'GST', gstRate: 5, pstRate: 0, hstRate: 0, totalRate: 5 },
  'British Columbia': { region: 'BC', regionName: 'British Columbia', country: 'CA', taxType: 'GST+PST', gstRate: 5, pstRate: 7, hstRate: 0, totalRate: 12 },
  'Manitoba': { region: 'MB', regionName: 'Manitoba', country: 'CA', taxType: 'GST+PST', gstRate: 5, pstRate: 7, hstRate: 0, totalRate: 12 },
  'New Brunswick': { region: 'NB', regionName: 'New Brunswick', country: 'CA', taxType: 'HST', gstRate: 0, pstRate: 0, hstRate: 15, totalRate: 15 },
  'Newfoundland and Labrador': { region: 'NL', regionName: 'Newfoundland and Labrador', country: 'CA', taxType: 'HST', gstRate: 0, pstRate: 0, hstRate: 15, totalRate: 15 },
  'Nova Scotia': { region: 'NS', regionName: 'Nova Scotia', country: 'CA', taxType: 'HST', gstRate: 0, pstRate: 0, hstRate: 14, totalRate: 14 },
  'Northwest Territories': { region: 'NT', regionName: 'Northwest Territories', country: 'CA', taxType: 'GST', gstRate: 5, pstRate: 0, hstRate: 0, totalRate: 5 },
  'Nunavut': { region: 'NU', regionName: 'Nunavut', country: 'CA', taxType: 'GST', gstRate: 5, pstRate: 0, hstRate: 0, totalRate: 5 },
  'Ontario': { region: 'ON', regionName: 'Ontario', country: 'CA', taxType: 'HST', gstRate: 0, pstRate: 0, hstRate: 13, totalRate: 13 },
  'Prince Edward Island': { region: 'PE', regionName: 'Prince Edward Island', country: 'CA', taxType: 'HST', gstRate: 0, pstRate: 0, hstRate: 15, totalRate: 15 },
  'Quebec': { region: 'QC', regionName: 'Quebec', country: 'CA', taxType: 'GST+QST', gstRate: 5, pstRate: 9.975, hstRate: 0, totalRate: 14.975 },
  'Saskatchewan': { region: 'SK', regionName: 'Saskatchewan', country: 'CA', taxType: 'GST+PST', gstRate: 5, pstRate: 6, hstRate: 0, totalRate: 11 },
  'Yukon': { region: 'YT', regionName: 'Yukon', country: 'CA', taxType: 'GST', gstRate: 5, pstRate: 0, hstRate: 0, totalRate: 5 },
};

// US states - using state sales tax rates (not including local taxes)
export const usTaxRates: Record<string, TaxInfo> = {
  'AL': { region: 'AL', regionName: 'Alabama', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 4, hstRate: 0, totalRate: 4 },
  'AK': { region: 'AK', regionName: 'Alaska', country: 'US', taxType: 'NONE', gstRate: 0, pstRate: 0, hstRate: 0, totalRate: 0 },
  'AZ': { region: 'AZ', regionName: 'Arizona', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 5.6, hstRate: 0, totalRate: 5.6 },
  'AR': { region: 'AR', regionName: 'Arkansas', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6.5, hstRate: 0, totalRate: 6.5 },
  'CA': { region: 'CA', regionName: 'California', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 7.25, hstRate: 0, totalRate: 7.25 },
  'CO': { region: 'CO', regionName: 'Colorado', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 2.9, hstRate: 0, totalRate: 2.9 },
  'CT': { region: 'CT', regionName: 'Connecticut', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6.35, hstRate: 0, totalRate: 6.35 },
  'DE': { region: 'DE', regionName: 'Delaware', country: 'US', taxType: 'NONE', gstRate: 0, pstRate: 0, hstRate: 0, totalRate: 0 },
  'FL': { region: 'FL', regionName: 'Florida', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6, hstRate: 0, totalRate: 6 },
  'GA': { region: 'GA', regionName: 'Georgia', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 4, hstRate: 0, totalRate: 4 },
  'HI': { region: 'HI', regionName: 'Hawaii', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 4, hstRate: 0, totalRate: 4 },
  'ID': { region: 'ID', regionName: 'Idaho', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6, hstRate: 0, totalRate: 6 },
  'IL': { region: 'IL', regionName: 'Illinois', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6.25, hstRate: 0, totalRate: 6.25 },
  'IN': { region: 'IN', regionName: 'Indiana', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 7, hstRate: 0, totalRate: 7 },
  'IA': { region: 'IA', regionName: 'Iowa', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6, hstRate: 0, totalRate: 6 },
  'KS': { region: 'KS', regionName: 'Kansas', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6.5, hstRate: 0, totalRate: 6.5 },
  'KY': { region: 'KY', regionName: 'Kentucky', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6, hstRate: 0, totalRate: 6 },
  'LA': { region: 'LA', regionName: 'Louisiana', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 5, hstRate: 0, totalRate: 5 },
  'ME': { region: 'ME', regionName: 'Maine', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 5.5, hstRate: 0, totalRate: 5.5 },
  'MD': { region: 'MD', regionName: 'Maryland', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6, hstRate: 0, totalRate: 6 },
  'MA': { region: 'MA', regionName: 'Massachusetts', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6.25, hstRate: 0, totalRate: 6.25 },
  'MI': { region: 'MI', regionName: 'Michigan', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6, hstRate: 0, totalRate: 6 },
  'MN': { region: 'MN', regionName: 'Minnesota', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6.88, hstRate: 0, totalRate: 6.88 },
  'MS': { region: 'MS', regionName: 'Mississippi', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 7, hstRate: 0, totalRate: 7 },
  'MO': { region: 'MO', regionName: 'Missouri', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 4.23, hstRate: 0, totalRate: 4.23 },
  'MT': { region: 'MT', regionName: 'Montana', country: 'US', taxType: 'NONE', gstRate: 0, pstRate: 0, hstRate: 0, totalRate: 0 },
  'NE': { region: 'NE', regionName: 'Nebraska', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 5.5, hstRate: 0, totalRate: 5.5 },
  'NV': { region: 'NV', regionName: 'Nevada', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6.85, hstRate: 0, totalRate: 6.85 },
  'NH': { region: 'NH', regionName: 'New Hampshire', country: 'US', taxType: 'NONE', gstRate: 0, pstRate: 0, hstRate: 0, totalRate: 0 },
  'NJ': { region: 'NJ', regionName: 'New Jersey', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6.63, hstRate: 0, totalRate: 6.63 },
  'NM': { region: 'NM', regionName: 'New Mexico', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 5.13, hstRate: 0, totalRate: 5.13 },
  'NY': { region: 'NY', regionName: 'New York', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 4, hstRate: 0, totalRate: 4 },
  'NC': { region: 'NC', regionName: 'North Carolina', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 4.75, hstRate: 0, totalRate: 4.75 },
  'ND': { region: 'ND', regionName: 'North Dakota', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 5, hstRate: 0, totalRate: 5 },
  'OH': { region: 'OH', regionName: 'Ohio', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 5.75, hstRate: 0, totalRate: 5.75 },
  'OK': { region: 'OK', regionName: 'Oklahoma', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 4.5, hstRate: 0, totalRate: 4.5 },
  'OR': { region: 'OR', regionName: 'Oregon', country: 'US', taxType: 'NONE', gstRate: 0, pstRate: 0, hstRate: 0, totalRate: 0 },
  'PA': { region: 'PA', regionName: 'Pennsylvania', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6, hstRate: 0, totalRate: 6 },
  'RI': { region: 'RI', regionName: 'Rhode Island', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 7, hstRate: 0, totalRate: 7 },
  'SC': { region: 'SC', regionName: 'South Carolina', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6, hstRate: 0, totalRate: 6 },
  'SD': { region: 'SD', regionName: 'South Dakota', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 4.2, hstRate: 0, totalRate: 4.2 },
  'TN': { region: 'TN', regionName: 'Tennessee', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 7, hstRate: 0, totalRate: 7 },
  'TX': { region: 'TX', regionName: 'Texas', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6.25, hstRate: 0, totalRate: 6.25 },
  'UT': { region: 'UT', regionName: 'Utah', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6.1, hstRate: 0, totalRate: 6.1 },
  'VT': { region: 'VT', regionName: 'Vermont', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6, hstRate: 0, totalRate: 6 },
  'VA': { region: 'VA', regionName: 'Virginia', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 5.3, hstRate: 0, totalRate: 5.3 },
  'WA': { region: 'WA', regionName: 'Washington', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6.5, hstRate: 0, totalRate: 6.5 },
  'WV': { region: 'WV', regionName: 'West Virginia', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6, hstRate: 0, totalRate: 6 },
  'WI': { region: 'WI', regionName: 'Wisconsin', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 5, hstRate: 0, totalRate: 5 },
  'WY': { region: 'WY', regionName: 'Wyoming', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 4, hstRate: 0, totalRate: 4 },
  // Full state names for matching
  'Alabama': { region: 'AL', regionName: 'Alabama', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 4, hstRate: 0, totalRate: 4 },
  'Alaska': { region: 'AK', regionName: 'Alaska', country: 'US', taxType: 'NONE', gstRate: 0, pstRate: 0, hstRate: 0, totalRate: 0 },
  'Arizona': { region: 'AZ', regionName: 'Arizona', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 5.6, hstRate: 0, totalRate: 5.6 },
  'Arkansas': { region: 'AR', regionName: 'Arkansas', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6.5, hstRate: 0, totalRate: 6.5 },
  'California': { region: 'CA', regionName: 'California', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 7.25, hstRate: 0, totalRate: 7.25 },
  'Colorado': { region: 'CO', regionName: 'Colorado', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 2.9, hstRate: 0, totalRate: 2.9 },
  'Connecticut': { region: 'CT', regionName: 'Connecticut', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6.35, hstRate: 0, totalRate: 6.35 },
  'Delaware': { region: 'DE', regionName: 'Delaware', country: 'US', taxType: 'NONE', gstRate: 0, pstRate: 0, hstRate: 0, totalRate: 0 },
  'Florida': { region: 'FL', regionName: 'Florida', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6, hstRate: 0, totalRate: 6 },
  'Georgia': { region: 'GA', regionName: 'Georgia', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 4, hstRate: 0, totalRate: 4 },
  'Hawaii': { region: 'HI', regionName: 'Hawaii', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 4, hstRate: 0, totalRate: 4 },
  'Idaho': { region: 'ID', regionName: 'Idaho', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6, hstRate: 0, totalRate: 6 },
  'Illinois': { region: 'IL', regionName: 'Illinois', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6.25, hstRate: 0, totalRate: 6.25 },
  'Indiana': { region: 'IN', regionName: 'Indiana', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 7, hstRate: 0, totalRate: 7 },
  'Iowa': { region: 'IA', regionName: 'Iowa', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6, hstRate: 0, totalRate: 6 },
  'Kansas': { region: 'KS', regionName: 'Kansas', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6.5, hstRate: 0, totalRate: 6.5 },
  'Kentucky': { region: 'KY', regionName: 'Kentucky', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6, hstRate: 0, totalRate: 6 },
  'Louisiana': { region: 'LA', regionName: 'Louisiana', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 5, hstRate: 0, totalRate: 5 },
  'Maine': { region: 'ME', regionName: 'Maine', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 5.5, hstRate: 0, totalRate: 5.5 },
  'Maryland': { region: 'MD', regionName: 'Maryland', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6, hstRate: 0, totalRate: 6 },
  'Massachusetts': { region: 'MA', regionName: 'Massachusetts', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6.25, hstRate: 0, totalRate: 6.25 },
  'Michigan': { region: 'MI', regionName: 'Michigan', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6, hstRate: 0, totalRate: 6 },
  'Minnesota': { region: 'MN', regionName: 'Minnesota', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6.88, hstRate: 0, totalRate: 6.88 },
  'Mississippi': { region: 'MS', regionName: 'Mississippi', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 7, hstRate: 0, totalRate: 7 },
  'Missouri': { region: 'MO', regionName: 'Missouri', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 4.23, hstRate: 0, totalRate: 4.23 },
  'Montana': { region: 'MT', regionName: 'Montana', country: 'US', taxType: 'NONE', gstRate: 0, pstRate: 0, hstRate: 0, totalRate: 0 },
  'Nebraska': { region: 'NE', regionName: 'Nebraska', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 5.5, hstRate: 0, totalRate: 5.5 },
  'Nevada': { region: 'NV', regionName: 'Nevada', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6.85, hstRate: 0, totalRate: 6.85 },
  'New Hampshire': { region: 'NH', regionName: 'New Hampshire', country: 'US', taxType: 'NONE', gstRate: 0, pstRate: 0, hstRate: 0, totalRate: 0 },
  'New Jersey': { region: 'NJ', regionName: 'New Jersey', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6.63, hstRate: 0, totalRate: 6.63 },
  'New Mexico': { region: 'NM', regionName: 'New Mexico', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 5.13, hstRate: 0, totalRate: 5.13 },
  'New York': { region: 'NY', regionName: 'New York', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 4, hstRate: 0, totalRate: 4 },
  'North Carolina': { region: 'NC', regionName: 'North Carolina', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 4.75, hstRate: 0, totalRate: 4.75 },
  'North Dakota': { region: 'ND', regionName: 'North Dakota', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 5, hstRate: 0, totalRate: 5 },
  'Ohio': { region: 'OH', regionName: 'Ohio', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 5.75, hstRate: 0, totalRate: 5.75 },
  'Oklahoma': { region: 'OK', regionName: 'Oklahoma', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 4.5, hstRate: 0, totalRate: 4.5 },
  'Oregon': { region: 'OR', regionName: 'Oregon', country: 'US', taxType: 'NONE', gstRate: 0, pstRate: 0, hstRate: 0, totalRate: 0 },
  'Pennsylvania': { region: 'PA', regionName: 'Pennsylvania', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6, hstRate: 0, totalRate: 6 },
  'Rhode Island': { region: 'RI', regionName: 'Rhode Island', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 7, hstRate: 0, totalRate: 7 },
  'South Carolina': { region: 'SC', regionName: 'South Carolina', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6, hstRate: 0, totalRate: 6 },
  'South Dakota': { region: 'SD', regionName: 'South Dakota', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 4.2, hstRate: 0, totalRate: 4.2 },
  'Tennessee': { region: 'TN', regionName: 'Tennessee', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 7, hstRate: 0, totalRate: 7 },
  'Texas': { region: 'TX', regionName: 'Texas', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6.25, hstRate: 0, totalRate: 6.25 },
  'Utah': { region: 'UT', regionName: 'Utah', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6.1, hstRate: 0, totalRate: 6.1 },
  'Vermont': { region: 'VT', regionName: 'Vermont', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6, hstRate: 0, totalRate: 6 },
  'Virginia': { region: 'VA', regionName: 'Virginia', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 5.3, hstRate: 0, totalRate: 5.3 },
  'Washington': { region: 'WA', regionName: 'Washington', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6.5, hstRate: 0, totalRate: 6.5 },
  'West Virginia': { region: 'WV', regionName: 'West Virginia', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 6, hstRate: 0, totalRate: 6 },
  'Wisconsin': { region: 'WI', regionName: 'Wisconsin', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 5, hstRate: 0, totalRate: 5 },
  'Wyoming': { region: 'WY', regionName: 'Wyoming', country: 'US', taxType: 'STATE', gstRate: 0, pstRate: 4, hstRate: 0, totalRate: 4 },
};

// Get tax info from state/province and country
export function getTaxInfo(state: string, country: string): TaxInfo | null {
  // Normalize country name
  const normalizedCountry = country?.toLowerCase().trim();
  const isCanada = normalizedCountry === 'canada' || normalizedCountry === 'ca';
  const isUS = normalizedCountry === 'united states' || normalizedCountry === 'usa' || normalizedCountry === 'us' || normalizedCountry === 'united states of america';
  
  if (isCanada) {
    return canadianTaxRates[state] || null;
  }
  
  if (isUS) {
    return usTaxRates[state] || null;
  }
  
  return null;
}

// Calculate tax amounts
export function calculateTax(subtotal: number, taxInfo: TaxInfo): {
  gstAmount: number;
  pstAmount: number;
  hstAmount: number;
  totalTax: number;
  grandTotal: number;
} {
  let gstAmount = 0;
  let pstAmount = 0;
  let hstAmount = 0;
  
  if (taxInfo.taxType === 'HST') {
    hstAmount = subtotal * (taxInfo.hstRate / 100);
  } else if (taxInfo.taxType === 'GST' || taxInfo.taxType === 'GST+PST' || taxInfo.taxType === 'GST+QST') {
    gstAmount = subtotal * (taxInfo.gstRate / 100);
    pstAmount = subtotal * (taxInfo.pstRate / 100);
  } else if (taxInfo.taxType === 'STATE') {
    // For US states, we use pstRate to store the state tax
    pstAmount = subtotal * (taxInfo.pstRate / 100);
  }
  
  const totalTax = gstAmount + pstAmount + hstAmount;
  const grandTotal = subtotal + totalTax;
  
  return {
    gstAmount: Math.round(gstAmount * 100) / 100,
    pstAmount: Math.round(pstAmount * 100) / 100,
    hstAmount: Math.round(hstAmount * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
  };
}

// Get display label for tax type
export function getTaxLabel(taxInfo: TaxInfo): string {
  switch (taxInfo.taxType) {
    case 'HST':
      return `HST (${taxInfo.hstRate}%)`;
    case 'GST':
      return `GST (${taxInfo.gstRate}%)`;
    case 'GST+PST':
      return `GST (${taxInfo.gstRate}%) + PST (${taxInfo.pstRate}%)`;
    case 'GST+QST':
      return `GST (${taxInfo.gstRate}%) + QST (${taxInfo.pstRate}%)`;
    case 'STATE':
      return `State Tax (${taxInfo.pstRate}%)`;
    case 'NONE':
      return 'No Sales Tax';
    default:
      return '';
  }
}
