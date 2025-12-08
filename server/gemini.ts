import { GoogleGenAI, Type } from "@google/genai";

/**
 * Normalize a date string from Gemini to ISO format (YYYY-MM-DD)
 * Gemini may return dates in various formats like "November 2025", "Nov 15, 2025", "2025-11-15", etc.
 */
export function normalizeExpiryDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  
  const trimmed = dateStr.trim();
  
  // Already ISO format
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  
  // Try parsing with Date constructor
  try {
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      // Format as YYYY-MM-DD
      const year = parsed.getFullYear();
      const month = String(parsed.getMonth() + 1).padStart(2, '0');
      const day = String(parsed.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch (e) {
    // Continue to other patterns
  }
  
  // Try "Month Year" format (e.g., "November 2025" -> last day of month)
  const monthYearMatch = trimmed.match(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})$/i);
  if (monthYearMatch) {
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const monthIndex = monthNames.indexOf(monthYearMatch[1].toLowerCase());
    const year = parseInt(monthYearMatch[2]);
    // Use last day of the month for expiry
    const lastDay = new Date(year, monthIndex + 1, 0).getDate();
    const month = String(monthIndex + 1).padStart(2, '0');
    return `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
  }
  
  // Try "MMM DD, YYYY" format (e.g., "Nov 15, 2025")
  const mmmDDYYYYMatch = trimmed.match(/^(\w+)\s+(\d{1,2}),?\s+(\d{4})$/i);
  if (mmmDDYYYYMatch) {
    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const monthAbbr = mmmDDYYYYMatch[1].toLowerCase().substring(0, 3);
    const monthIndex = monthNames.indexOf(monthAbbr);
    if (monthIndex !== -1) {
      const year = parseInt(mmmDDYYYYMatch[3]);
      const day = parseInt(mmmDDYYYYMatch[2]);
      const month = String(monthIndex + 1).padStart(2, '0');
      return `${year}-${month}-${String(day).padStart(2, '0')}`;
    }
  }
  
  // Try "DD/MM/YYYY" or "MM/DD/YYYY" format - assume DD/MM/YYYY for international
  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const day = parseInt(slashMatch[1]);
    const month = parseInt(slashMatch[2]);
    const year = parseInt(slashMatch[3]);
    // If day > 12, it's definitely DD/MM/YYYY
    if (day > 12) {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    // Default to MM/DD/YYYY for US format
    return `${year}-${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}`;
  }
  
  console.log(`[Date Normalization] Could not parse date: "${dateStr}"`);
  return null;
}

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

export interface IrataVerificationResult {
  isValid: boolean;
  technicianName: string | null;
  irataNumber: string | null;
  irataLevel: number | null;
  expiryDate: string | null;
  status: string | null;
  confidence: "high" | "medium" | "low";
  rawText: string | null;
  error: string | null;
}

export async function analyzeIrataScreenshot(
  imageBase64: string,
  mimeType: string = "image/png"
): Promise<IrataVerificationResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are analyzing a screenshot from the IRATA TechConnect verification portal. 
Extract the following information from this certificate/verification screenshot:

1. Is this a valid IRATA verification result showing an active technician? (true/false)
2. The technician's full name
3. The IRATA license/certificate number
4. The IRATA level (1, 2, or 3)
5. The expiry/valid until date (in YYYY-MM-DD format if possible)
6. The status shown (e.g., "Valid", "Active", "Expired", etc.)

If this is NOT an IRATA verification screenshot (e.g., it's a login page, error page, or unrelated content), set isValid to false and explain in the error field.

Respond ONLY with valid JSON matching this exact structure:
{
  "isValid": boolean,
  "technicianName": string or null,
  "irataNumber": string or null,
  "irataLevel": number or null (1, 2, or 3),
  "expiryDate": string or null (YYYY-MM-DD format),
  "status": string or null,
  "confidence": "high" | "medium" | "low",
  "rawText": string (any additional relevant text from the screenshot),
  "error": string or null (explain any issues)
}`
            },
            {
              inlineData: {
                mimeType,
                data: imageBase64
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN },
            technicianName: { type: Type.STRING, nullable: true },
            irataNumber: { type: Type.STRING, nullable: true },
            irataLevel: { type: Type.INTEGER, nullable: true },
            expiryDate: { type: Type.STRING, nullable: true },
            status: { type: Type.STRING, nullable: true },
            confidence: { type: Type.STRING },
            rawText: { type: Type.STRING, nullable: true },
            error: { type: Type.STRING, nullable: true }
          },
          required: ["isValid", "confidence"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}") as IrataVerificationResult;
    return result;
  } catch (error: any) {
    console.error("Gemini analysis error:", error);
    return {
      isValid: false,
      technicianName: null,
      irataNumber: null,
      irataLevel: null,
      expiryDate: null,
      status: null,
      confidence: "low",
      rawText: null,
      error: `Analysis failed: ${error.message || "Unknown error"}`
    };
  }
}

export interface SpratVerificationResult {
  isValid: boolean;
  technicianName: string | null;
  spratNumber: string | null;
  spratLevel: number | null;
  expiryDate: string | null;
  status: string | null;
  confidence: "high" | "medium" | "low";
  rawText: string | null;
  error: string | null;
}

export async function analyzeSpratScreenshot(
  imageBase64: string,
  mimeType: string = "image/png"
): Promise<SpratVerificationResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are analyzing a screenshot from the SPRAT (Society of Professional Rope Access Technicians) certification verification portal at sprat.org. 
Extract the following information from this certificate/verification screenshot:

1. Is this a valid SPRAT verification result showing an active technician? (true/false)
2. The technician's full name
3. The SPRAT certification/ID number
4. The SPRAT level (1, 2, or 3)
5. The expiry/valid until date (in YYYY-MM-DD format if possible)
6. The status shown (e.g., "Current", "Active", "Expired", etc.)

If this is NOT a SPRAT verification screenshot (e.g., it's a login page, error page, or unrelated content), set isValid to false and explain in the error field.

Respond ONLY with valid JSON matching this exact structure:
{
  "isValid": boolean,
  "technicianName": string or null,
  "spratNumber": string or null,
  "spratLevel": number or null (1, 2, or 3),
  "expiryDate": string or null (YYYY-MM-DD format),
  "status": string or null,
  "confidence": "high" | "medium" | "low",
  "rawText": string (any additional relevant text from the screenshot),
  "error": string or null (explain any issues)
}`
            },
            {
              inlineData: {
                mimeType,
                data: imageBase64
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN },
            technicianName: { type: Type.STRING, nullable: true },
            spratNumber: { type: Type.STRING, nullable: true },
            spratLevel: { type: Type.INTEGER, nullable: true },
            expiryDate: { type: Type.STRING, nullable: true },
            status: { type: Type.STRING, nullable: true },
            confidence: { type: Type.STRING },
            rawText: { type: Type.STRING, nullable: true },
            error: { type: Type.STRING, nullable: true }
          },
          required: ["isValid", "confidence"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}") as SpratVerificationResult;
    return result;
  } catch (error: any) {
    console.error("Gemini SPRAT analysis error:", error);
    return {
      isValid: false,
      technicianName: null,
      spratNumber: null,
      spratLevel: null,
      expiryDate: null,
      status: null,
      confidence: "low",
      rawText: null,
      error: `Analysis failed: ${error.message || "Unknown error"}`
    };
  }
}
