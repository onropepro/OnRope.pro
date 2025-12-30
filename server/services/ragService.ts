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
    slug: 'personal-safety-rating',
    title: 'Personal Safety Rating (PSR)',
    category: 'safety',
    sourceFile: 'client/src/pages/PSRGuide.tsx',
    stakeholders: ['technician', 'owner', 'operations_manager'],
  },
  {
    slug: 'job-board',
    title: 'Job Board',
    category: 'hr',
    sourceFile: 'client/src/pages/JobBoardGuide.tsx',
    stakeholders: ['owner', 'technician'],
  },
  {
    slug: 'technician-portal',
    title: 'Technician Portal',
    category: 'hr',
    sourceFile: 'client/src/pages/TechnicianPortal.tsx',
    stakeholders: ['technician'],
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
    stakeholders: ['building-manager', 'property-manager', 'resident'],
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
  {
    slug: 'client-relationship-management',
    title: 'Client Relationship Management (CRM)',
    category: 'operations',
    sourceFile: 'client/src/pages/CRMGuide.tsx',
    stakeholders: ['owner', 'operations_manager'],
  },
  {
    slug: 'dashboard-customization',
    title: 'Dashboard Customization',
    category: 'customization',
    sourceFile: 'client/src/pages/DashboardCustomizationGuide.tsx',
    stakeholders: ['owner', 'operations_manager', 'supervisor'],
    hideFromModulesGrid: true, // This is a "Popular Topic", shown in Popular Topics section not modules grid
  },
  {
    slug: 'install-app',
    title: 'How To Install the App',
    category: 'customization',
    sourceFile: '', // No TSX source, markdown only
    stakeholders: ['owner', 'operations_manager', 'supervisor', 'technician'],
    hideFromModulesGrid: true, // This is a "Popular Topic", shown in Popular Topics section not modules grid
  },
];

/**
 * Developer-specific terms to filter out from help content
 * These are not relevant to end users
 */
const DEVELOPER_FILTER_PATTERNS = [
  /technical\s*notes?/gi,
  /implementation\s*details?/gi,
  /schema\./gi,
  /database\s*table/gi,
  /drizzle/gi,
  /api\s*endpoint/gi,
  /backend/gi,
  /frontend/gi,
  /componentn/gi,
  /props?\s*:/gi,
  /useState/gi,
  /useEffect/gi,
  /import\s+\{/gi,
  /export\s+default/gi,
  /className=/gi,
  /data-testid/gi,
  /===|!==|\?\?/g,
];

/**
 * Check if a text block should be filtered out (developer-specific)
 * Note: Short text is allowed for headings - use isHeadingContext=true for headings
 */
function shouldFilterContent(text: string, isHeadingContext: boolean = false): boolean {
  const lowerText = text.toLowerCase();
  
  // Allow short text for headings (e.g., "FAQ", "Overview")
  // Only filter very short non-heading text (< 5 chars)
  if (!isHeadingContext && text.length < 5) return true;
  
  // Skip JSX/code patterns
  if (text.includes('{') && text.includes('}')) return true;
  if (text.includes('className')) return true;
  if (text.includes('onClick')) return true;
  if (text.includes('useState')) return true;
  if (text.includes('import ')) return true;
  if (text.includes('export ')) return true;
  
  // Skip developer-specific content
  if (lowerText.includes('technical note')) return true;
  if (lowerText.includes('implementation detail')) return true;
  if (lowerText.includes('schema.')) return true;
  if (lowerText.includes('database table')) return true;
  if (lowerText.includes('api endpoint')) return true;
  
  return false;
}

/**
 * Clean text by removing JSX artifacts and normalizing whitespace
 */
function cleanText(text: string): string {
  return text
    .replace(/\{[^}]*\}/g, '') // Remove JSX expressions
    .replace(/className="[^"]*"/g, '') // Remove className
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/^\s+|\s+$/g, '') // Trim
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

/**
 * Check for dedicated markdown content file
 * Returns content if file exists, null otherwise
 */
function getMarkdownContent(slug: string): { title: string; description: string; content: string } | null {
  try {
    // Check both locations: root and modules subfolder
    let mdPath = path.resolve(process.cwd(), `server/help-content/modules/${slug}.md`);
    if (!fs.existsSync(mdPath)) {
      mdPath = path.resolve(process.cwd(), `server/help-content/${slug}.md`);
    }
    
    if (!fs.existsSync(mdPath)) {
      return null;
    }
    
    const content = fs.readFileSync(mdPath, 'utf-8');
    
    // Extract title from first h1 heading
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : '';
    
    // Extract description from first paragraph after title
    const lines = content.split('\n');
    let description = '';
    let foundTitle = false;
    for (const line of lines) {
      if (line.startsWith('# ')) {
        foundTitle = true;
        continue;
      }
      if (foundTitle && line.trim() && !line.startsWith('#')) {
        description = line.trim().substring(0, 200);
        break;
      }
    }
    
    console.log(`[RAG] Using dedicated markdown: ${slug}.md`);
    return { title, description, content };
  } catch (error: any) {
    console.error(`[RAG] Error reading markdown for ${slug}:`, error.message);
    return null;
  }
}

/**
 * Extract structured Markdown content from a TSX Guide file
 * Preserves sections, headings, lists, and filters developer content
 */
export function extractContentFromTSX(filePath: string): { title: string; description: string; content: string } {
  try {
    const absolutePath = path.resolve(process.cwd(), filePath);
    
    if (!fs.existsSync(absolutePath)) {
      console.log(`[RAG] File not found: ${absolutePath}`);
      return { title: '', description: '', content: '' };
    }
    
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    const markdownParts: string[] = [];
    
    // Extract page title from ChangelogGuideLayout
    const layoutTitleMatch = fileContent.match(/title=["']([^"']+)["']/);
    const pageTitle = layoutTitleMatch ? layoutTitleMatch[1].trim() : '';
    
    // Extract section headings (h2 with text)
    const h2Pattern = /<h2[^>]*>([^<]+)<\/h2>/gi;
    const sectionHeadings: Array<{index: number; title: string}> = [];
    let h2Match;
    while ((h2Match = h2Pattern.exec(fileContent)) !== null) {
      const title = cleanText(h2Match[1]);
      if (title && !shouldFilterContent(title, true)) {
        sectionHeadings.push({ index: h2Match.index, title });
      }
    }
    
    // Extract h3 headings
    const h3Pattern = /<h3[^>]*>([^<]+)<\/h3>/gi;
    let h3Match;
    while ((h3Match = h3Pattern.exec(fileContent)) !== null) {
      const title = cleanText(h3Match[1]);
      if (title && !shouldFilterContent(title, true)) {
        // Find which section this belongs to
        let sectionTitle = '';
        for (const section of sectionHeadings) {
          if (section.index < h3Match.index) {
            sectionTitle = section.title;
          }
        }
        if (sectionTitle && !markdownParts.includes(`## ${sectionTitle}`)) {
          markdownParts.push(`## ${sectionTitle}`);
        }
        markdownParts.push(`### ${title}`);
      }
    }
    
    // Extract introduction paragraph (first <p> in the file, typically the overview)
    const introMatch = fileContent.match(/<p[^>]*className="[^"]*text-muted-foreground[^"]*leading-relaxed[^"]*"[^>]*>([^<]+)<\/p>/i);
    if (introMatch) {
      const introText = cleanText(introMatch[1]);
      if (introText && introText.length > 50 && !shouldFilterContent(introText)) {
        markdownParts.unshift(introText);
      }
    }
    
    // Extract key points from Cards with feature summaries
    const cardPattern = /<Card[^>]*>[\s\S]*?<p[^>]*className="[^"]*font-medium[^"]*"[^>]*>([^<]+)<\/p>[\s\S]*?<p[^>]*className="[^"]*text-muted-foreground[^"]*"[^>]*>([^<]+)<\/p>[\s\S]*?<\/Card>/gi;
    let cardMatch;
    const features: string[] = [];
    while ((cardMatch = cardPattern.exec(fileContent)) !== null) {
      const featureTitle = cleanText(cardMatch[1]);
      const featureDesc = cleanText(cardMatch[2]);
      if (featureTitle && featureDesc && !shouldFilterContent(featureTitle, true) && !shouldFilterContent(featureDesc)) {
        features.push(`- **${featureTitle}**: ${featureDesc}`);
      }
    }
    if (features.length > 0) {
      // Emit heading and list as separate entries so renderer handles them correctly
      markdownParts.push('## Key Features');
      markdownParts.push(features.join('\n'));
    }
    
    // Extract Accordion content (problem/solution pairs)
    const accordionPattern = /<AccordionTrigger[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>[\s\S]*?<\/AccordionTrigger>[\s\S]*?<AccordionContent[^>]*>([\s\S]*?)<\/AccordionContent>/gi;
    let accordionMatch;
    const problemsSolutions: string[] = [];
    while ((accordionMatch = accordionPattern.exec(fileContent)) !== null) {
      const questionText = cleanText(accordionMatch[1]);
      const answerContent = accordionMatch[2];
      
      if (questionText && !shouldFilterContent(questionText)) {
        // Extract paragraphs from accordion content
        const paragraphs: string[] = [];
        const pPattern = /<p[^>]*>([^<]+(?:<[^/][^>]*>[^<]*<\/[^>]+>[^<]*)*)<\/p>/gi;
        let pMatch;
        while ((pMatch = pPattern.exec(answerContent)) !== null) {
          let text = pMatch[1];
          // Extract text from nested spans
          text = text.replace(/<span[^>]*>([^<]+)<\/span>/gi, '$1');
          text = cleanText(text);
          if (text && text.length > 30 && !shouldFilterContent(text)) {
            paragraphs.push(text);
          }
        }
        
        if (paragraphs.length > 0) {
          problemsSolutions.push(`**${questionText}**\n\n${paragraphs.join('\n\n')}`);
        }
      }
    }
    if (problemsSolutions.length > 0) {
      // Emit heading and content as separate entries
      markdownParts.push('## Common Questions');
      markdownParts.push(problemsSolutions.join('\n\n---\n\n'));
    }
    
    // Extract list items
    const listPattern = /<li[^>]*>([^<]+)<\/li>/gi;
    let listMatch;
    const listItems: string[] = [];
    while ((listMatch = listPattern.exec(fileContent)) !== null) {
      const item = cleanText(listMatch[1]);
      if (item && item.length > 10 && !shouldFilterContent(item)) {
        listItems.push(`- ${item}`);
      }
    }
    
    // Extract general paragraphs that aren't already captured
    const pPattern = /<p[^>]*>([^<]{50,})<\/p>/gi;
    let pMatch;
    const paragraphs: string[] = [];
    while ((pMatch = pPattern.exec(fileContent)) !== null) {
      const text = cleanText(pMatch[1]);
      if (text && text.length > 50 && !shouldFilterContent(text)) {
        // Check if not already included
        const alreadyIncluded = markdownParts.some(part => part.includes(text.substring(0, 50)));
        if (!alreadyIncluded) {
          paragraphs.push(text);
        }
      }
    }
    if (paragraphs.length > 0) {
      markdownParts.push(paragraphs.join('\n\n'));
    }
    
    // Combine all markdown parts
    const content = markdownParts.join('\n\n');
    
    // Get description from intro or first 200 chars
    const description = introMatch 
      ? cleanText(introMatch[1]).substring(0, 200) 
      : content.substring(0, 200);
    
    return { 
      title: pageTitle, 
      description, 
      content: content || 'No content extracted.' 
    };
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
    
    // Check for dedicated markdown content first
    const markdownContent = getMarkdownContent(guide.slug);
    
    // Use markdown content if available, otherwise extract from TSX
    const { title, description, content } = markdownContent || extractContentFromTSX(guide.sourceFile);
    
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
