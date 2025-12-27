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

// Export the ai instance for use in RAG service
export { ai };

/**
 * Generate embeddings for text content using Gemini's text-embedding-004 model
 * Used for RAG (Retrieval Augmented Generation) in the Knowledge Base
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await ai.models.embedContent({
      model: "text-embedding-004",
      contents: [{ role: "user", parts: [{ text }] }],
    });
    
    return response.embeddings?.[0]?.values || [];
  } catch (error: any) {
    console.error("[Gemini Embedding] Error:", error);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
}

/**
 * Generate embeddings for multiple texts in batch
 * More efficient than calling generateEmbedding multiple times
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const results: number[][] = [];
    
    // Process in batches of 10 to avoid rate limits
    for (let i = 0; i < texts.length; i += 10) {
      const batch = texts.slice(i, i + 10);
      const embeddings = await Promise.all(
        batch.map(text => generateEmbedding(text))
      );
      results.push(...embeddings);
    }
    
    return results;
  } catch (error: any) {
    console.error("[Gemini Batch Embedding] Error:", error);
    throw new Error(`Failed to generate batch embeddings: ${error.message}`);
  }
}

/**
 * Generate a conversational response using Gemini with context from RAG
 */
export async function generateChatResponse(
  userMessage: string,
  context: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<string> {
  try {
    const systemPrompt = `You are a helpful assistant for OnRopePro, a rope access management platform. 
You help users understand features, find information, and troubleshoot issues.

Use the following context from our documentation to answer the user's question. 
If the context doesn't contain relevant information, say so honestly but try to be helpful.
Keep responses concise but complete. Use bullet points for lists.
Do not make up features that aren't mentioned in the context.

CONTEXT FROM DOCUMENTATION:
${context}

---
Answer the user's question based on this context. Be friendly and professional.`;

    // Build messages with system prompt as first user message (Replit Gemini proxy doesn't support systemInstruction)
    const messages = [
      {
        role: "user" as const,
        parts: [{ text: systemPrompt }]
      },
      {
        role: "model" as const,
        parts: [{ text: "Understood. I'll help users with OnRopePro questions using the provided documentation context. How can I help you?" }]
      },
      ...conversationHistory.map(msg => ({
        role: (msg.role === 'assistant' ? 'model' : 'user') as "user" | "model",
        parts: [{ text: msg.content }]
      })),
      {
        role: "user" as const,
        parts: [{ text: userMessage }]
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: messages,
    });

    return response.text || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error: any) {
    console.error("[Gemini Chat] Error:", error);
    throw new Error(`Failed to generate chat response: ${error.message}`);
  }
}

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

// Logbook Entry extracted from a scanned logbook page
export interface LogbookEntry {
  startDate: string | null;
  endDate: string | null;
  hoursWorked: number | null;
  buildingName: string | null;
  buildingAddress: string | null;
  buildingHeight: string | null;
  tasksPerformed: string[];
  previousEmployer: string | null;
  notes: string | null;
  confidence: "high" | "medium" | "low";
}

export interface LogbookAnalysisResult {
  success: boolean;
  entries: LogbookEntry[];
  pageWarnings: string[];
  error: string | null;
}

/**
 * Analyze a logbook page image and extract work entries
 */
export async function analyzeLogbookPage(
  imageBase64: string,
  mimeType: string = "image/jpeg"
): Promise<LogbookAnalysisResult> {
  try {
    // Use gemini-2.5-flash for better compatibility and speed
    // Note: We don't use responseSchema because it can cause strict validation errors
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an expert at analyzing IRATA and SPRAT rope access logbook pages. Your task is to CAREFULLY extract EVERY work entry visible on this logbook page.

CRITICAL INSTRUCTIONS FOR DATE RANGES:
- IRATA logbooks often show DATE RANGES like "Aug 04-07" or "19-20" meaning work spanning multiple days
- When you see "04-07" or "19-20" in a date column, this is a DATE RANGE (start day to end day)
- Example: "Aug 19-20" means startDate=Aug 19, endDate=Aug 20 (NOT both on Aug 19!)
- Example: "Aug 04-07" means startDate=Aug 4, endDate=Aug 7
- Example: "Aug 24-28" means startDate=Aug 24, endDate=Aug 28
- If dates span different months (rare), interpret accordingly
- Single dates like "Aug 20" mean both startDate and endDate are Aug 20

CRITICAL INSTRUCTIONS FOR HOURS:
- The "Hours Worked" field is MANDATORY for each entry
- Look for columns labeled: "Hours", "Hrs", "Time", "Duration", "Total", or similar
- Hours may be written as: "8", "8.5", "8h", "8 hours", "8:00", etc.
- If you see a time range (e.g., "08:00-16:00"), calculate the duration (8 hours)
- IRATA logbooks ALWAYS record hours - look carefully at every column
- If hours column is unclear/illegible, estimate based on a typical 8-hour workday and set confidence to "low"
- NEVER return null for hoursWorked unless the entry is clearly incomplete

For EACH entry on the page, extract:
1. DATE RANGE: Start and end date in YYYY-MM-DD format. Pay attention to date ranges (e.g., "04-07" means 4th to 7th). If only day/month visible, use current year (2024 or 2025).
2. HOURS WORKED: This is CRITICAL - always extract or estimate this value
3. BUILDING/SITE: Name and address of the work location
4. BUILDING HEIGHT: If visible (floors, meters, feet)
5. TASKS: Rope access work performed (use task IDs below)
6. EMPLOYER: Company name if visible
7. NOTES: Any additional information

Task IDs to use:
rope_transfer, re_anchor, ascending, descending, rigging, deviation,
aid_climbing, edge_transition, knot_passing, rope_to_rope_transfer,
mid_rope_changeover, rescue_technique, hauling, lowering,
tensioned_rope, horizontal_traverse, window_cleaning,
building_inspection, maintenance_work, other

RULES:
- Extract EVERY entry visible, even if partially readable
- ALWAYS provide hoursWorked (estimate 8 if truly unclear)
- For unclear entries, set confidence to "low"
- Use "other" for unrecognizable tasks
- If handwriting is unclear, make your best interpretation

Respond ONLY with valid JSON matching this structure:
{
  "success": true,
  "entries": [
    {
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "hoursWorked": 8,
      "buildingName": "string or null",
      "buildingAddress": "string or null",
      "buildingHeight": "string or null",
      "tasksPerformed": ["task_id"],
      "previousEmployer": "string or null",
      "notes": "string or null",
      "confidence": "high"
    }
  ],
  "pageWarnings": [],
  "error": null
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
        responseMimeType: "application/json"
        // Note: Not using responseSchema to avoid strict validation errors
      }
    });

    // Parse JSON response, handling potential issues
    let result: any;
    try {
      const responseText = response.text || "{}";
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
      return {
        success: false,
        entries: [],
        pageWarnings: [],
        error: "Failed to parse AI response. Please try again with a clearer image."
      };
    }
    
    // Normalize dates in the entries
    const normalizedEntries: LogbookEntry[] = (result.entries || []).map((entry: any) => ({
      startDate: normalizeExpiryDate(entry.startDate),
      endDate: normalizeExpiryDate(entry.endDate) || normalizeExpiryDate(entry.startDate),
      hoursWorked: typeof entry.hoursWorked === 'number' ? entry.hoursWorked : null,
      buildingName: entry.buildingName || null,
      buildingAddress: entry.buildingAddress || null,
      buildingHeight: entry.buildingHeight || null,
      tasksPerformed: Array.isArray(entry.tasksPerformed) ? entry.tasksPerformed : [],
      previousEmployer: entry.previousEmployer || null,
      notes: entry.notes || null,
      confidence: entry.confidence || "medium"
    }));

    return {
      success: result.success ?? false,
      entries: normalizedEntries,
      pageWarnings: result.pageWarnings || [],
      error: result.error || null
    };
  } catch (error: any) {
    console.error("Gemini logbook analysis error:", error);
    return {
      success: false,
      entries: [],
      pageWarnings: [],
      error: `Analysis failed: ${error.message || "Unknown error"}`
    };
  }
}

// Extract insurance expiry date from Certificate of Insurance PDF
export interface InsuranceExpiryResult {
  expiryDate: string | null;
  confidence: "high" | "medium" | "low";
  error: string | null;
}

export async function extractInsuranceExpiryDate(
  pdfBase64: string
): Promise<InsuranceExpiryResult> {
  try {
    console.log("[COI AI] Calling Gemini for insurance expiry extraction...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Analyze this Certificate of Insurance PDF and extract the policy expiry date.
Look for fields like "Policy Expiry", "Expiration Date", "Policy Period To", "Coverage Ends", "Effective To", or similar.
Extract the date when the insurance policy expires.

Respond ONLY with valid JSON matching this exact structure:
{
  "expiryDate": string or null (YYYY-MM-DD format),
  "confidence": "high" | "medium" | "low",
  "error": string or null
}`
            },
            {
              inlineData: {
                mimeType: "application/pdf",
                data: pdfBase64
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
            expiryDate: { type: Type.STRING, nullable: true },
            confidence: { type: Type.STRING },
            error: { type: Type.STRING, nullable: true }
          },
          required: ["confidence"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}") as InsuranceExpiryResult;
    console.log("[COI AI] Gemini response:", JSON.stringify(result));
    
    // Normalize the expiry date if found
    if (result.expiryDate) {
      result.expiryDate = normalizeExpiryDate(result.expiryDate);
    }
    
    return result;
  } catch (error: any) {
    console.error("[COI AI] Gemini extraction error:", error);
    return {
      expiryDate: null,
      confidence: "low",
      error: `Extraction failed: ${error.message || "Unknown error"}`
    };
  }
}

// Quiz Question generated from document
export interface QuizQuestion {
  questionNumber: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correctAnswer: "A" | "B" | "C" | "D";
}

export interface QuizGenerationResult {
  success: boolean;
  questions: QuizQuestion[];
  error: string | null;
}

/**
 * Generate quiz questions from a PDF document using AI
 * @param pdfBase64 - Base64 encoded PDF document
 * @param documentType - Type of document (health_safety_manual, company_policy, etc.)
 * @returns Array of 20 quiz questions with 4 multiple choice options each
 */
export async function generateQuizFromDocument(
  pdfBase64: string,
  documentType: string
): Promise<QuizGenerationResult> {
  try {
    console.log(`[Quiz AI] Generating quiz for document type: ${documentType}`);
    
    const documentDescription = documentType === 'health_safety_manual' 
      ? 'Health & Safety Manual' 
      : documentType === 'company_policy'
      ? 'Company Policy Document'
      : documentType;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an expert at creating educational quizzes based on professional documents. Analyze this ${documentDescription} and generate exactly 20 multiple choice questions that test understanding of the key policies, procedures, and safety requirements.

REQUIREMENTS:
1. Generate exactly 20 questions
2. Each question must have exactly 4 options (A, B, C, D)
3. Questions should test comprehension, not just memorization
4. Cover the most important topics in the document
5. Include questions about safety procedures, compliance requirements, and key policies
6. Make questions clear and unambiguous
7. Ensure only one answer is clearly correct
8. Difficulty should be appropriate for employees who have read the document

Respond ONLY with valid JSON matching this exact structure:
{
  "success": true,
  "questions": [
    {
      "questionNumber": 1,
      "question": "What is the primary purpose of...",
      "options": {
        "A": "First option",
        "B": "Second option",
        "C": "Third option",
        "D": "Fourth option"
      },
      "correctAnswer": "B"
    }
  ],
  "error": null
}

If the document is too short or unclear, generate as many quality questions as possible (minimum 10) and set success to true. If you cannot generate at least 10 questions, set success to false and explain in error.`
            },
            {
              inlineData: {
                mimeType: "application/pdf",
                data: pdfBase64
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || "{}");
    console.log(`[Quiz AI] Generated ${result.questions?.length || 0} questions`);
    
    // Validate and normalize questions
    const questions: QuizQuestion[] = (result.questions || []).map((q: any, idx: number) => ({
      questionNumber: q.questionNumber || idx + 1,
      question: q.question || "",
      options: {
        A: q.options?.A || "",
        B: q.options?.B || "",
        C: q.options?.C || "",
        D: q.options?.D || ""
      },
      correctAnswer: ["A", "B", "C", "D"].includes(q.correctAnswer) ? q.correctAnswer : "A"
    }));

    return {
      success: result.success ?? (questions.length >= 10),
      questions,
      error: result.error || null
    };
  } catch (error: any) {
    console.error("[Quiz AI] Generation error:", error);
    return {
      success: false,
      questions: [],
      error: `Quiz generation failed: ${error.message || "Unknown error"}`
    };
  }
}

// Business Card Analysis Result
export interface BusinessCardAnalysisResult {
  success: boolean;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  jobTitle: string | null;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  fax: string | null;
  website: string | null;
  address: string | null;
  notes: string | null;
  confidence: "high" | "medium" | "low";
  error: string | null;
}

/**
 * Analyze business card images (front and optionally back) to extract contact information
 * @param frontImageBase64 - Base64 encoded front side of business card
 * @param backImageBase64 - Optional base64 encoded back side of business card
 * @param frontMimeType - MIME type of front image
 * @param backMimeType - Optional MIME type of back image
 */
export async function analyzeBusinessCard(
  frontImageBase64: string,
  backImageBase64?: string,
  frontMimeType: string = "image/jpeg",
  backMimeType: string = "image/jpeg"
): Promise<BusinessCardAnalysisResult> {
  try {
    console.log("[Business Card AI] Analyzing business card...");
    
    const imageParts: any[] = [
      {
        text: `You are an expert at extracting contact information from business cards. Analyze the business card image(s) provided and extract all relevant contact details.

IMPORTANT INSTRUCTIONS:
1. Extract the person's FIRST NAME and LAST NAME separately
2. Extract company/organization name
3. Extract job title/position
4. Extract ALL phone numbers (main phone, mobile, fax) - label them appropriately
5. Extract email address(es)
6. Extract website URL if present
7. Extract full mailing address if present
8. Any additional notes or relevant information

If two images are provided, they represent the FRONT and BACK of the same business card. Combine information from both sides.

For phone numbers:
- If there are multiple numbers, put the main office/landline in "phone" 
- Put mobile/cell numbers in "mobile"
- Put fax numbers in "fax"

Respond ONLY with valid JSON matching this exact structure:
{
  "success": true,
  "firstName": string or null,
  "lastName": string or null,
  "company": string or null,
  "jobTitle": string or null,
  "email": string or null,
  "phone": string or null,
  "mobile": string or null,
  "fax": string or null,
  "website": string or null,
  "address": string or null,
  "notes": string or null (any additional info like social media handles, certifications, etc.),
  "confidence": "high" | "medium" | "low",
  "error": null
}

If the image is not a business card or is unreadable, set success to false and explain in error.`
      },
      {
        inlineData: {
          mimeType: frontMimeType,
          data: frontImageBase64
        }
      }
    ];
    
    // Add back image if provided
    if (backImageBase64) {
      imageParts.push({
        text: "Back side of the business card:"
      });
      imageParts.push({
        inlineData: {
          mimeType: backMimeType,
          data: backImageBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: imageParts
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            firstName: { type: Type.STRING, nullable: true },
            lastName: { type: Type.STRING, nullable: true },
            company: { type: Type.STRING, nullable: true },
            jobTitle: { type: Type.STRING, nullable: true },
            email: { type: Type.STRING, nullable: true },
            phone: { type: Type.STRING, nullable: true },
            mobile: { type: Type.STRING, nullable: true },
            fax: { type: Type.STRING, nullable: true },
            website: { type: Type.STRING, nullable: true },
            address: { type: Type.STRING, nullable: true },
            notes: { type: Type.STRING, nullable: true },
            confidence: { type: Type.STRING },
            error: { type: Type.STRING, nullable: true }
          },
          required: ["success", "confidence"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}") as BusinessCardAnalysisResult;
    console.log("[Business Card AI] Analysis result:", JSON.stringify(result));
    
    return result;
  } catch (error: any) {
    console.error("[Business Card AI] Analysis error:", error);
    return {
      success: false,
      firstName: null,
      lastName: null,
      company: null,
      jobTitle: null,
      email: null,
      phone: null,
      mobile: null,
      fax: null,
      website: null,
      address: null,
      notes: null,
      confidence: "low",
      error: `Analysis failed: ${error.message || "Unknown error"}`
    };
  }
}

export interface DriversLicenseOCRResult {
  success: boolean;
  licenseNumber: string | null;
  expiryDate: string | null;
  issuedDate: string | null;
  name: string | null;
  confidence: "high" | "medium" | "low";
  error: string | null;
}

export async function analyzeDriversLicense(
  imageBase64: string,
  mimeType: string = "image/jpeg"
): Promise<DriversLicenseOCRResult> {
  try {
    console.log("[Drivers License OCR] Starting analysis...");
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are analyzing an image of a driver's license. Extract the following information:

1. License number - The driver's license number/ID
2. Expiry date - When the license expires (format as YYYY-MM-DD)
3. Issued date - When the license was issued (format as YYYY-MM-DD)
4. Name - The license holder's name

This could be a driver's license from any country (Canada, USA, etc.). Look for fields like:
- "DL", "License No", "Licence", "Driver Licence Number", etc.
- "EXP", "Expiry", "Expires", "Valid Until", etc.
- "ISS", "Issued", "Issue Date", etc.

Respond ONLY with valid JSON matching this exact structure:
{
  "success": boolean,
  "licenseNumber": string or null,
  "expiryDate": string or null (YYYY-MM-DD format),
  "issuedDate": string or null (YYYY-MM-DD format),
  "name": string or null,
  "confidence": "high" | "medium" | "low",
  "error": string or null
}

If this is not a driver's license or is unreadable, set success to false and explain in error.`
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
            success: { type: Type.BOOLEAN },
            licenseNumber: { type: Type.STRING, nullable: true },
            expiryDate: { type: Type.STRING, nullable: true },
            issuedDate: { type: Type.STRING, nullable: true },
            name: { type: Type.STRING, nullable: true },
            confidence: { type: Type.STRING },
            error: { type: Type.STRING, nullable: true }
          },
          required: ["success", "confidence"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}") as DriversLicenseOCRResult;
    
    // Normalize dates
    if (result.expiryDate) {
      result.expiryDate = normalizeExpiryDate(result.expiryDate);
    }
    if (result.issuedDate) {
      result.issuedDate = normalizeExpiryDate(result.issuedDate);
    }
    
    console.log("[Drivers License OCR] Analysis result:", JSON.stringify(result));
    return result;
  } catch (error: any) {
    console.error("[Drivers License OCR] Analysis error:", error);
    return {
      success: false,
      licenseNumber: null,
      expiryDate: null,
      issuedDate: null,
      name: null,
      confidence: "low",
      error: `Analysis failed: ${error.message || "Unknown error"}`
    };
  }
}

export interface VoidChequeOCRResult {
  success: boolean;
  transitNumber: string | null;
  institutionNumber: string | null;
  accountNumber: string | null;
  confidence: "high" | "medium" | "low";
  error: string | null;
}

export async function analyzeVoidCheque(
  imageBase64: string,
  mimeType: string = "image/jpeg"
): Promise<VoidChequeOCRResult> {
  try {
    console.log("[Void Cheque OCR] Starting analysis...");
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are analyzing an image of a void cheque or bank document. Extract the banking information:

1. Transit Number (Branch Number) - Usually 5 digits, identifies the branch
2. Institution Number - Usually 3 digits, identifies the bank (e.g., 001=BMO, 002=Scotiabank, 003=RBC, 004=TD, 006=National Bank, 010=CIBC)
3. Account Number - Usually 7-12 digits, identifies the account

In Canada, the numbers at the bottom of a cheque are typically in this order:
[Transit/Branch (5 digits)] [Institution (3 digits)] [Account Number (7-12 digits)]

Sometimes shown as: TTTTT-III-AAAAAAA or with symbols between them.

The numbers may also be labeled as:
- "Branch/Transit", "Succursale"
- "Institution", "Banque"
- "Account", "Compte"

Respond ONLY with valid JSON matching this exact structure:
{
  "success": boolean,
  "transitNumber": string or null (5 digits, branch/transit number),
  "institutionNumber": string or null (3 digits, bank institution number),
  "accountNumber": string or null (7-12 digits, account number),
  "confidence": "high" | "medium" | "low",
  "error": string or null
}

If this is not a cheque or banking document, or is unreadable, set success to false and explain in error.`
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
            success: { type: Type.BOOLEAN },
            transitNumber: { type: Type.STRING, nullable: true },
            institutionNumber: { type: Type.STRING, nullable: true },
            accountNumber: { type: Type.STRING, nullable: true },
            confidence: { type: Type.STRING },
            error: { type: Type.STRING, nullable: true }
          },
          required: ["success", "confidence"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}") as VoidChequeOCRResult;
    console.log("[Void Cheque OCR] Analysis result:", JSON.stringify(result));
    return result;
  } catch (error: any) {
    console.error("[Void Cheque OCR] Analysis error:", error);
    return {
      success: false,
      transitNumber: null,
      institutionNumber: null,
      accountNumber: null,
      confidence: "low",
      error: `Analysis failed: ${error.message || "Unknown error"}`
    };
  }
}
