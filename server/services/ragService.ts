/**
 * RAG (Retrieval Augmented Generation) Service for Knowledge Base
 * 
 * Extracts content from Guide TSX files, stores articles in database,
 * and provides text-based search + AI chat functionality.
 * 
 * Note: Embeddings are not used because Replit's Gemini integration doesn't support them.
 * Text-based search provides good results for the knowledge base use case.
 */

import * as fs from 'fs';
import * as path from 'path';
import { db } from '../db';
import { helpArticles, type HelpArticle } from '@shared/schema';
import { generateChatResponse } from '../gemini';
import { eq } from 'drizzle-orm';

// Guide Registry - All modules to index
export const guideRegistry = [
  {
    slug: 'project-management',
    title: 'Project Management',
    category: 'operations',
    sourceFile: 'client/src/pages/ProjectsGuide.tsx',
    stakeholders: ['owner', 'operations_manager', 'supervisor'],
  },
  {
    slug: 'time-tracking',
    title: 'Time Tracking & GPS',
    category: 'operations',
    sourceFile: 'client/src/pages/TimeTrackingGuide.tsx',
    stakeholders: ['owner', 'operations_manager', 'technician'],
  },
  {
    slug: 'safety-compliance',
    title: 'Safety & Compliance',
    category: 'safety',
    sourceFile: 'client/src/pages/SafetyGuide.tsx',
    stakeholders: ['owner', 'operations_manager', 'technician', 'building-manager'],
  },
  {
    slug: 'irata-sprat-logging',
    title: 'IRATA/SPRAT Logging',
    category: 'hr',
    sourceFile: 'client/src/pages/IRATALoggingGuide.tsx',
    stakeholders: ['technician'],
  },
  {
    slug: 'employee-management',
    title: 'Employee Management',
    category: 'hr',
    sourceFile: 'client/src/pages/EmployeeManagementGuide.tsx',
    stakeholders: ['owner', 'operations_manager'],
  },
  {
    slug: 'document-management',
    title: 'Document Management',
    category: 'operations',
    sourceFile: 'client/src/pages/DocumentManagementGuide.tsx',
    stakeholders: ['owner', 'operations_manager'],
  },
  {
    slug: 'gear-inventory',
    title: 'Gear Inventory',
    category: 'safety',
    sourceFile: 'client/src/pages/InventoryGuide.tsx',
    stakeholders: ['owner', 'operations_manager', 'technician'],
  },
  {
    slug: 'scheduling',
    title: 'Scheduling & Calendar',
    category: 'operations',
    sourceFile: 'client/src/pages/SchedulingGuide.tsx',
    stakeholders: ['owner', 'operations_manager', 'supervisor'],
  },
  {
    slug: 'payroll',
    title: 'Payroll Management',
    category: 'financial',
    sourceFile: 'client/src/pages/PayrollGuide.tsx',
    stakeholders: ['owner', 'operations_manager'],
  },
  {
    slug: 'company-safety-rating',
    title: 'Company Safety Rating',
    category: 'safety',
    sourceFile: 'client/src/pages/CSRGuide.tsx',
    stakeholders: ['owner', 'building-manager', 'property-manager'],
  },
  {
    slug: 'job-board',
    title: 'Job Board',
    category: 'hr',
    sourceFile: 'client/src/pages/JobBoardGuide.tsx',
    stakeholders: ['owner', 'technician'],
  },
  {
    slug: 'quoting-sales',
    title: 'Quoting & Sales',
    category: 'financial',
    sourceFile: 'client/src/pages/QuotingGuide.tsx',
    stakeholders: ['owner', 'operations_manager'],
  },
  {
    slug: 'resident-portal',
    title: 'Resident Portal',
    category: 'communication',
    sourceFile: 'client/src/pages/ResidentPortalGuide.tsx',
    stakeholders: ['building-manager', 'property-manager'],
  },
  {
    slug: 'property-manager-interface',
    title: 'Property Manager Interface',
    category: 'communication',
    sourceFile: 'client/src/pages/PropertyManagerGuide.tsx',
    stakeholders: ['property-manager'],
  },
  {
    slug: 'white-label-branding',
    title: 'White-Label Branding',
    category: 'customization',
    sourceFile: 'client/src/pages/BrandingGuide.tsx',
    stakeholders: ['owner'],
  },
  {
    slug: 'analytics-reporting',
    title: 'Analytics & Reporting',
    category: 'operations',
    sourceFile: 'client/src/pages/AnalyticsGuide.tsx',
    stakeholders: ['owner', 'operations_manager'],
  },
];

/**
 * Extract plain text content from a TSX Guide file
 * Parses JSX and extracts readable text, headings, and list items
 */
export function extractContentFromTSX(filePath: string): { title: string; description: string; content: string } {
  try {
    const absolutePath = path.resolve(process.cwd(), filePath);
    
    if (!fs.existsSync(absolutePath)) {
      console.log(`[RAG] File not found: ${absolutePath}`);
      return { title: '', description: '', content: '' };
    }
    
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    
    // Extract text between JSX tags using regex patterns
    const textContent: string[] = [];
    
    // Extract content from common text patterns
    const patterns = [
      // Heading patterns like <h1>, <h2>, <CardTitle>
      /<(?:h[1-6]|CardTitle)[^>]*>([^<]+)<\/(?:h[1-6]|CardTitle)>/gi,
      // Paragraph and text patterns
      /<(?:p|span|div|CardDescription)[^>]*>([^<]+)<\/(?:p|span|div|CardDescription)>/gi,
      // List items
      /<li[^>]*>([^<]+)<\/li>/gi,
      // Direct string literals in JSX
      />\s*([A-Z][^<]{20,}[.!?])\s*</g,
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(fileContent)) !== null) {
        const text = match[1].trim();
        if (text && text.length > 10 && !text.includes('{') && !text.includes('className')) {
          textContent.push(text);
        }
      }
    }
    
    // Also extract text from template literals and string content
    const stringLiteralPattern = /["`']([^`"']{30,})["`']/g;
    let match;
    while ((match = stringLiteralPattern.exec(fileContent)) !== null) {
      const text = match[1].trim();
      if (text && !text.includes('import') && !text.includes('className') && !text.includes('===')) {
        textContent.push(text);
      }
    }
    
    // Deduplicate and join
    const uniqueContent = Array.from(new Set(textContent));
    const content = uniqueContent.join('\n\n');
    
    // Try to extract title from the file
    const titleMatch = fileContent.match(/<h1[^>]*>([^<]+)<\/h1>/i) || 
                       fileContent.match(/title[=:]?\s*["']([^"']+)["']/i);
    const title = titleMatch ? titleMatch[1].trim() : '';
    
    // Try to extract description
    const descMatch = fileContent.match(/<(?:p|CardDescription)[^>]*>([^<]{50,200})<\//i);
    const description = descMatch ? descMatch[1].trim() : content.substring(0, 200);
    
    return { title, description, content };
  } catch (error: any) {
    console.error(`[RAG] Error extracting content from ${filePath}:`, error.message);
    return { title: '', description: '', content: '' };
  }
}

/**
 * Split content into chunks for embedding
 * Target: ~500 tokens per chunk with 50 token overlap
 */
export function chunkContent(content: string, maxChunkSize: number = 1500, overlap: number = 200): string[] {
  if (!content || content.length < maxChunkSize) {
    return content ? [content] : [];
  }
  
  const chunks: string[] = [];
  const paragraphs = content.split(/\n\n+/);
  let currentChunk = '';
  
  for (const paragraph of paragraphs) {
    if ((currentChunk + '\n\n' + paragraph).length <= maxChunkSize) {
      currentChunk = currentChunk ? currentChunk + '\n\n' + paragraph : paragraph;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
        // Start new chunk with overlap from end of previous
        const overlapText = currentChunk.slice(-overlap);
        currentChunk = overlapText + '\n\n' + paragraph;
      } else {
        // Paragraph itself is too long, split by sentences
        const sentences = paragraph.split(/(?<=[.!?])\s+/);
        for (const sentence of sentences) {
          if ((currentChunk + ' ' + sentence).length <= maxChunkSize) {
            currentChunk = currentChunk ? currentChunk + ' ' + sentence : sentence;
          } else {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = sentence;
          }
        }
      }
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

/**
 * Index a single Guide file - extract content and store in DB
 * Note: Embeddings are skipped because Replit's Gemini integration doesn't support them.
 * Text-based search is used instead.
 */
export async function indexGuideFile(guide: typeof guideRegistry[0]): Promise<boolean> {
  try {
    console.log(`[RAG] Indexing: ${guide.title}`);
    
    const { title, description, content } = extractContentFromTSX(guide.sourceFile);
    
    if (!content || content.length < 50) {
      console.log(`[RAG] Skipping ${guide.slug} - insufficient content`);
      return false;
    }
    
    // Check if article already exists
    const existingArticle = await db.select().from(helpArticles).where(eq(helpArticles.slug, guide.slug)).limit(1);
    
    if (existingArticle.length > 0) {
      // Update existing article
      await db.update(helpArticles)
        .set({
          title: title || guide.title,
          description: description || guide.title,
          content,
          category: guide.category,
          stakeholders: guide.stakeholders,
          updatedAt: new Date(),
        })
        .where(eq(helpArticles.slug, guide.slug));
      
      console.log(`[RAG] Updated: ${guide.slug}`);
    } else {
      // Create new article
      await db.insert(helpArticles)
        .values({
          slug: guide.slug,
          title: title || guide.title,
          description: description || guide.title,
          category: guide.category,
          sourceFile: guide.sourceFile,
          content,
          stakeholders: guide.stakeholders,
        });
      
      console.log(`[RAG] Created: ${guide.slug}`);
    }
    
    return true;
  } catch (error: any) {
    console.error(`[RAG] Error indexing ${guide.slug}:`, error.message);
    return false;
  }
}

/**
 * Index all Guide files in the registry
 */
export async function indexAllGuides(): Promise<{ success: number; failed: number }> {
  console.log('[RAG] Starting full reindex...');
  let success = 0;
  let failed = 0;
  
  for (const guide of guideRegistry) {
    const result = await indexGuideFile(guide);
    if (result) success++;
    else failed++;
  }
  
  console.log(`[RAG] Reindex complete: ${success} succeeded, ${failed} failed`);
  return { success, failed };
}

/**
 * Query the RAG system - search for context and generate response
 * Uses text-based search since Replit's Gemini integration doesn't support embeddings
 */
export async function queryRAG(
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<{
  message: string;
  sources: Array<{ title: string; slug: string }>;
}> {
  try {
    // Search for relevant articles using text-based search
    const searchResults = await searchArticles(userMessage, 5);
    
    if (searchResults.length === 0) {
      return {
        message: "I couldn't find specific information about that in our documentation. Could you try rephrasing your question, or ask about a specific feature like project management, time tracking, or safety compliance?",
        sources: [],
      };
    }
    
    // Build context from search results - use first 2000 chars of each article
    const context = searchResults
      .map(article => `[${article.title}]\n${article.content?.substring(0, 2000) || article.description}`)
      .join('\n\n---\n\n');
    
    // Generate response using Gemini chat
    const message = await generateChatResponse(userMessage, context, conversationHistory);
    
    // Return sources
    const sources = searchResults.slice(0, 3).map(article => ({
      title: article.title,
      slug: article.slug,
    }));
    
    return {
      message,
      sources,
    };
  } catch (error: any) {
    console.error('[RAG] Query error:', error.message);
    return {
      message: "I'm having trouble processing your question right now. Please try again in a moment.",
      sources: [],
    };
  }
}

/**
 * Get all articles for browsing
 */
export async function getAllArticles(): Promise<HelpArticle[]> {
  return db.select().from(helpArticles).where(eq(helpArticles.isPublished, true));
}

/**
 * Get article by slug
 */
export async function getArticleBySlug(slug: string): Promise<HelpArticle | null> {
  const articles = await db.select().from(helpArticles).where(eq(helpArticles.slug, slug)).limit(1);
  return articles[0] || null;
}

/**
 * Get articles by category
 */
export async function getArticlesByCategory(category: string): Promise<HelpArticle[]> {
  const articles = await db.select().from(helpArticles).where(eq(helpArticles.isPublished, true));
  return articles.filter(a => a.category === category);
}

/**
 * Get articles relevant to a stakeholder type
 */
export async function getArticlesForStakeholder(stakeholder: string): Promise<HelpArticle[]> {
  const allArticles = await db.select().from(helpArticles).where(eq(helpArticles.isPublished, true));
  return allArticles.filter(article => 
    article.stakeholders?.includes(stakeholder)
  );
}

/**
 * Full-text search fallback when RAG/embeddings are unavailable
 * Uses simple case-insensitive matching on title and content
 */
export async function searchArticles(query: string, limit: number = 10): Promise<HelpArticle[]> {
  try {
    const allArticles = await db.select().from(helpArticles).where(eq(helpArticles.isPublished, true));
    
    const lowerQuery = query.toLowerCase();
    const words = lowerQuery.split(/\s+/).filter(w => w.length > 2);
    
    // Score articles by keyword matches
    const scored = allArticles.map(article => {
      let score = 0;
      const titleLower = article.title.toLowerCase();
      const contentLower = article.content?.toLowerCase() || '';
      
      for (const word of words) {
        // Title matches are worth more
        if (titleLower.includes(word)) score += 10;
        // Content matches
        const contentMatches = (contentLower.match(new RegExp(word, 'g')) || []).length;
        score += Math.min(contentMatches, 5); // Cap at 5 matches per word
      }
      
      return { article, score };
    });
    
    // Filter and sort by score
    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.article);
  } catch (error: any) {
    console.error('[RAG] Search articles fallback error:', error.message);
    return [];
  }
}
