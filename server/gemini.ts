import { GoogleGenAI, Type } from "@google/genai";

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
