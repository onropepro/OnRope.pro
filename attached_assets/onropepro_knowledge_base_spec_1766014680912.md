# OnRopePro Knowledge Base & AI Assistant Specification

## Project Overview

Build a customer-facing knowledge base at `/help` with RAG-powered AI chat. The knowledge base serves as a pre-sales, sales, and support tool for OnRopePro, a SaaS platform for rope access building maintenance companies.

**Core Requirements:**
1. RAG system using existing `/changelog/` documentation as the knowledge source
2. AI chat interface for natural language queries
3. Stakeholder-based navigation (5 user types with different needs)
4. Auto-sync when `/changelog/` content updates
5. Mobile-first, matches existing OnRopePro design system

---

## Technical Architecture

### Stack (Use Existing)
- Frontend: React 18 + TypeScript + Tailwind CSS
- Backend: Node.js + Express
- Database: PostgreSQL with Drizzle ORM
- UI Components: shadcn/ui (already installed)
- Hosting: Replit

### New Dependencies Required
```bash
npm install openai langchain @langchain/openai @langchain/community
npm install cheerio # For parsing changelog HTML content
```

### Environment Variables (Add to Secrets)
```
OPENAI_API_KEY=sk-...
```

---

## File Structure

```
client/src/
├── pages/
│   └── help/
│       ├── HelpCenter.tsx           # Main /help landing page
│       ├── HelpSearch.tsx           # Search results page
│       ├── HelpArticle.tsx          # Individual article view
│       ├── HelpChat.tsx             # AI chat interface (can be modal or page)
│       ├── stakeholders/
│       │   ├── ForCompanyOwners.tsx
│       │   ├── ForTechnicians.tsx
│       │   ├── ForBuildingManagers.tsx
│       │   ├── ForPropertyManagers.tsx
│       │   └── GettingStarted.tsx
│       └── tools/
│           ├── ROICalculator.tsx
│           └── FeatureFinder.tsx
├── components/
│   └── help/
│       ├── HelpNav.tsx              # Help center navigation
│       ├── HelpSearchBar.tsx        # Search input with suggestions
│       ├── HelpArticleCard.tsx      # Article preview card
│       ├── HelpChatWidget.tsx       # Floating chat button + modal
│       ├── HelpChatMessage.tsx      # Individual chat message
│       └── HelpBreadcrumb.tsx       # Navigation breadcrumb
└── lib/
    └── helpUtils.ts                 # Client-side help utilities

server/
├── routes/
│   └── help.ts                      # Help API routes
├── services/
│   └── ragService.ts                # RAG indexing and query service
└── scripts/
    └── indexChangelog.ts            # Script to rebuild RAG index
    
shared/
└── helpSchema.ts                    # Help-related types and schemas
```

---

## Database Schema

Add to `shared/schema.ts`:

```typescript
// Knowledge Base Articles (cached from changelog for fast retrieval)
export const helpArticles = pgTable('help_articles', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),           // e.g., "project-management"
  title: text('title').notNull(),
  category: text('category').notNull(),            // module, getting-started, troubleshooting
  stakeholders: text('stakeholders').array(),      // ["owner", "technician", "building-manager"]
  content: text('content').notNull(),              // Full text content for search
  contentHtml: text('content_html'),               // Rendered HTML for display
  sourceFile: text('source_file').notNull(),       // Original changelog file path
  lastSynced: timestamp('last_synced').defaultNow(),
  searchVector: text('search_vector'),             // For full-text search (optional optimization)
});

// RAG Embeddings
export const helpEmbeddings = pgTable('help_embeddings', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id').references(() => helpArticles.id),
  chunkIndex: integer('chunk_index').notNull(),    // Which chunk of the article
  chunkText: text('chunk_text').notNull(),         // The actual text chunk
  embedding: vector('embedding', { dimensions: 1536 }), // OpenAI ada-002 embeddings
  metadata: jsonb('metadata'),                     // Additional context (section, headers)
});

// Chat Conversations (for analytics and improvement)
export const helpConversations = pgTable('help_conversations', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').notNull(),         // Anonymous session tracking
  userId: integer('user_id'),                      // If logged in
  userType: text('user_type'),                     // owner, technician, visitor, etc.
  createdAt: timestamp('created_at').defaultNow(),
});

export const helpMessages = pgTable('help_messages', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id').references(() => helpConversations.id),
  role: text('role').notNull(),                    // user, assistant
  content: text('content').notNull(),
  sourcesUsed: jsonb('sources_used'),              // Which articles were cited
  feedbackRating: integer('feedback_rating'),      // 1-5 rating if provided
  createdAt: timestamp('created_at').defaultNow(),
});

// Search Analytics (track what people search for)
export const helpSearches = pgTable('help_searches', {
  id: serial('id').primaryKey(),
  query: text('query').notNull(),
  resultsCount: integer('results_count'),
  clickedArticleId: integer('clicked_article_id'),
  sessionId: text('session_id'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

**Note:** For the vector column, you'll need pgvector extension:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

---

## RAG Service Implementation

Create `server/services/ragService.ts`:

```typescript
import OpenAI from 'openai';
import { db } from '../db';
import { helpArticles, helpEmbeddings } from '../../shared/schema';
import { eq, sql } from 'drizzle-orm';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Configuration
const CHUNK_SIZE = 500;        // tokens per chunk
const CHUNK_OVERLAP = 50;      // overlap between chunks
const TOP_K_RESULTS = 5;       // number of relevant chunks to retrieve

interface ContentSource {
  slug: string;
  title: string;
  category: string;
  stakeholders: string[];
  content: string;
  sourceFile: string;
}

/**
 * Index all changelog content into the RAG system
 * Call this on startup and when changelog updates
 */
export async function indexChangelogContent(): Promise<void> {
  console.log('[RAG] Starting changelog indexing...');
  
  // 1. Get all Guide pages from the changelog routes
  const changelogSources = await extractChangelogContent();
  
  for (const source of changelogSources) {
    // 2. Upsert article record
    const [article] = await db
      .insert(helpArticles)
      .values({
        slug: source.slug,
        title: source.title,
        category: source.category,
        stakeholders: source.stakeholders,
        content: source.content,
        sourceFile: source.sourceFile,
        lastSynced: new Date(),
      })
      .onConflictDoUpdate({
        target: helpArticles.slug,
        set: {
          title: source.title,
          content: source.content,
          lastSynced: new Date(),
        },
      })
      .returning();
    
    // 3. Delete old embeddings for this article
    await db
      .delete(helpEmbeddings)
      .where(eq(helpEmbeddings.articleId, article.id));
    
    // 4. Chunk the content
    const chunks = chunkContent(source.content, CHUNK_SIZE, CHUNK_OVERLAP);
    
    // 5. Generate embeddings for each chunk
    for (let i = 0; i < chunks.length; i++) {
      const embedding = await generateEmbedding(chunks[i]);
      
      await db.insert(helpEmbeddings).values({
        articleId: article.id,
        chunkIndex: i,
        chunkText: chunks[i],
        embedding: embedding,
        metadata: {
          title: source.title,
          category: source.category,
          stakeholders: source.stakeholders,
        },
      });
    }
    
    console.log(`[RAG] Indexed: ${source.title} (${chunks.length} chunks)`);
  }
  
  console.log('[RAG] Indexing complete');
}

/**
 * Extract content from changelog Guide pages
 * This reads the actual TSX files and extracts text content
 */
async function extractChangelogContent(): Promise<ContentSource[]> {
  const sources: ContentSource[] = [];
  
  // Map of changelog routes to their metadata
  // This should be maintained as new guides are added
  const guideRegistry = [
    {
      slug: 'project-management',
      title: 'Project Management',
      sourceFile: 'client/src/pages/ProjectsGuide.tsx',
      category: 'module',
      stakeholders: ['owner', 'operations-manager', 'technician'],
    },
    {
      slug: 'work-sessions-time-tracking',
      title: 'Work Sessions & Time Tracking',
      sourceFile: 'client/src/pages/TimeTrackingGuide.tsx',
      category: 'module',
      stakeholders: ['owner', 'operations-manager', 'technician'],
    },
    {
      slug: 'safety-compliance',
      title: 'Safety & Compliance',
      sourceFile: 'client/src/pages/SafetyGuide.tsx',
      category: 'module',
      stakeholders: ['owner', 'technician', 'building-manager'],
    },
    {
      slug: 'irata-sprat-logging',
      title: 'IRATA/SPRAT Task Logging',
      sourceFile: 'client/src/pages/IRATALoggingGuide.tsx',
      category: 'module',
      stakeholders: ['technician', 'owner'],
    },
    {
      slug: 'employee-management',
      title: 'Employee Management',
      sourceFile: 'client/src/pages/EmployeeManagementGuide.tsx',
      category: 'module',
      stakeholders: ['owner', 'operations-manager'],
    },
    {
      slug: 'document-management',
      title: 'Document Management',
      sourceFile: 'client/src/pages/DocumentManagementGuide.tsx',
      category: 'module',
      stakeholders: ['owner', 'building-manager', 'property-manager'],
    },
    {
      slug: 'gear-inventory',
      title: 'Gear & Equipment Inventory',
      sourceFile: 'client/src/pages/InventoryGuide.tsx',
      category: 'module',
      stakeholders: ['owner', 'technician'],
    },
    {
      slug: 'scheduling-calendar',
      title: 'Scheduling & Calendar',
      sourceFile: 'client/src/pages/SchedulingGuide.tsx',
      category: 'module',
      stakeholders: ['owner', 'operations-manager', 'technician'],
    },
    {
      slug: 'payroll-financial',
      title: 'Payroll & Financial',
      sourceFile: 'client/src/pages/PayrollGuide.tsx',
      category: 'module',
      stakeholders: ['owner'],
    },
    {
      slug: 'company-safety-rating',
      title: 'Company Safety Rating (CSR)',
      sourceFile: 'client/src/pages/CSRGuide.tsx',
      category: 'module',
      stakeholders: ['owner', 'building-manager', 'property-manager'],
    },
    {
      slug: 'job-board',
      title: 'Job Board Ecosystem',
      sourceFile: 'client/src/pages/JobBoardGuide.tsx',
      category: 'module',
      stakeholders: ['owner', 'technician'],
    },
    {
      slug: 'quoting-sales',
      title: 'Quoting & Sales Pipeline',
      sourceFile: 'client/src/pages/QuotingGuide.tsx',
      category: 'module',
      stakeholders: ['owner', 'operations-manager'],
    },
    {
      slug: 'resident-portal',
      title: 'Resident Portal',
      sourceFile: 'client/src/pages/ResidentPortalGuide.tsx',
      category: 'module',
      stakeholders: ['resident', 'building-manager'],
    },
    {
      slug: 'property-manager-interface',
      title: 'Property Manager Interface',
      sourceFile: 'client/src/pages/PropertyManagerGuide.tsx',
      category: 'module',
      stakeholders: ['property-manager'],
    },
    {
      slug: 'white-label-branding',
      title: 'White-Label Branding',
      sourceFile: 'client/src/pages/BrandingGuide.tsx',
      category: 'module',
      stakeholders: ['owner'],
    },
    {
      slug: 'analytics-reporting',
      title: 'Analytics & Reporting',
      sourceFile: 'client/src/pages/AnalyticsGuide.tsx',
      category: 'module',
      stakeholders: ['owner', 'operations-manager'],
    },
    // Add more as guides are created
  ];
  
  for (const guide of guideRegistry) {
    try {
      const fs = await import('fs/promises');
      const fileContent = await fs.readFile(guide.sourceFile, 'utf-8');
      
      // Extract text content from TSX
      const textContent = extractTextFromTSX(fileContent);
      
      sources.push({
        slug: guide.slug,
        title: guide.title,
        category: guide.category,
        stakeholders: guide.stakeholders,
        content: textContent,
        sourceFile: guide.sourceFile,
      });
    } catch (error) {
      console.warn(`[RAG] Could not read ${guide.sourceFile}:`, error);
    }
  }
  
  return sources;
}

/**
 * Extract readable text from TSX file content
 * Removes JSX tags, imports, code blocks while preserving documentation text
 */
function extractTextFromTSX(tsxContent: string): string {
  let text = tsxContent;
  
  // Remove import statements
  text = text.replace(/^import.*$/gm, '');
  
  // Remove export statements
  text = text.replace(/^export.*$/gm, '');
  
  // Extract text from JSX string literals
  const stringLiterals: string[] = [];
  
  // Match content between > and < (JSX text content)
  const jsxTextMatches = text.match(/>([^<>]+)</g);
  if (jsxTextMatches) {
    jsxTextMatches.forEach(match => {
      const content = match.slice(1, -1).trim();
      if (content && content.length > 2 && !content.startsWith('{')) {
        stringLiterals.push(content);
      }
    });
  }
  
  // Match string literals in props like title="..." or subtitle="..."
  const propMatches = text.match(/(?:title|subtitle|label|placeholder|description)=["']([^"']+)["']/g);
  if (propMatches) {
    propMatches.forEach(match => {
      const content = match.match(/=["']([^"']+)["']/)?.[1];
      if (content) stringLiterals.push(content);
    });
  }
  
  // Match template literals
  const templateMatches = text.match(/`([^`]+)`/g);
  if (templateMatches) {
    templateMatches.forEach(match => {
      const content = match.slice(1, -1).trim();
      if (content && !content.includes('${')) {
        stringLiterals.push(content);
      }
    });
  }
  
  return stringLiterals.join('\n\n');
}

/**
 * Split content into overlapping chunks
 */
function chunkContent(text: string, chunkSize: number, overlap: number): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim()) {
      chunks.push(chunk);
    }
  }
  
  return chunks;
}

/**
 * Generate embedding for a text chunk using OpenAI
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  
  return response.data[0].embedding;
}

/**
 * Query the RAG system with a user question
 */
export async function queryRAG(
  question: string,
  userType?: string
): Promise<{ answer: string; sources: Array<{ title: string; slug: string }> }> {
  
  // 1. Generate embedding for the question
  const questionEmbedding = await generateEmbedding(question);
  
  // 2. Find most similar chunks using cosine similarity
  const similarChunks = await db.execute(sql`
    SELECT 
      he.chunk_text,
      he.metadata,
      ha.title,
      ha.slug,
      ha.category,
      1 - (he.embedding <=> ${JSON.stringify(questionEmbedding)}::vector) as similarity
    FROM help_embeddings he
    JOIN help_articles ha ON he.article_id = ha.id
    ${userType ? sql`WHERE ${userType} = ANY(ha.stakeholders)` : sql``}
    ORDER BY he.embedding <=> ${JSON.stringify(questionEmbedding)}::vector
    LIMIT ${TOP_K_RESULTS}
  `);
  
  // 3. Build context from retrieved chunks
  const context = similarChunks.rows
    .map((chunk: any) => `[From: ${chunk.title}]\n${chunk.chunk_text}`)
    .join('\n\n---\n\n');
  
  // 4. Generate answer using GPT-4
  const systemPrompt = buildSystemPrompt(userType);
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { 
        role: 'user', 
        content: `Context from OnRopePro documentation:\n\n${context}\n\n---\n\nUser question: ${question}` 
      },
    ],
    temperature: 0.3,
    max_tokens: 1000,
  });
  
  const answer = completion.choices[0].message.content || 'I could not generate an answer.';
  
  // 5. Extract unique sources
  const sources = [...new Map(
    similarChunks.rows.map((chunk: any) => [chunk.slug, { title: chunk.title, slug: chunk.slug }])
  ).values()];
  
  return { answer, sources };
}

/**
 * Build system prompt based on user type
 */
function buildSystemPrompt(userType?: string): string {
  const basePrompt = `You are the OnRopePro Help Assistant, an expert on OnRopePro - a SaaS platform for rope access building maintenance companies.

Your role:
- Answer questions about OnRopePro features, modules, and capabilities
- Help users understand how to accomplish tasks in the platform
- Provide accurate information based ONLY on the provided documentation context
- If you don't have enough information to answer, say so clearly
- Suggest relevant features or modules when appropriate

Guidelines:
- Be concise but thorough
- Use bullet points for multi-step processes
- Reference specific modules when relevant
- If a question is about pricing, direct them to the pricing page or sales team
- If a question requires human support, offer to connect them with the team

OnRopePro serves:
- Company Owners (primary buyers) - manage entire operations
- Operations Managers - handle day-to-day coordination
- Rope Access Technicians - track work, certifications, safety
- Building Managers - verify vendor compliance, view reports
- Property Managers - portfolio-level vendor oversight
- Residents - schedule access, view work status`;

  const userTypeContext: Record<string, string> = {
    owner: '\n\nThis user is a Company Owner. Focus on business value, ROI, and management features.',
    technician: '\n\nThis user is a Technician. Focus on mobile app features, time tracking, certifications, and daily workflows.',
    'building-manager': '\n\nThis user is a Building Manager. Focus on vendor compliance, safety documentation, and reporting features.',
    'property-manager': '\n\nThis user is a Property Manager. Focus on portfolio management, compliance tracking, and enterprise features.',
    visitor: '\n\nThis user is evaluating OnRopePro. Highlight key benefits and differentiators.',
  };
  
  return basePrompt + (userTypeContext[userType || 'visitor'] || '');
}

/**
 * Full-text search fallback when RAG is unavailable
 */
export async function searchArticles(query: string, limit: number = 10) {
  return db
    .select()
    .from(helpArticles)
    .where(sql`
      to_tsvector('english', ${helpArticles.title} || ' ' || ${helpArticles.content}) 
      @@ plainto_tsquery('english', ${query})
    `)
    .limit(limit);
}
```

---

## API Routes

Create `server/routes/help.ts`:

```typescript
import { Router } from 'express';
import { queryRAG, searchArticles, indexChangelogContent } from '../services/ragService';
import { db } from '../db';
import { helpArticles, helpConversations, helpMessages, helpSearches } from '../../shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();

/**
 * POST /api/help/chat
 * Send a message to the AI assistant
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationId, userType } = req.body;
    const userId = req.session?.userId;
    
    // Get or create conversation
    let convId = conversationId;
    if (!convId) {
      const [conv] = await db
        .insert(helpConversations)
        .values({
          sessionId: req.sessionID || crypto.randomUUID(),
          userId,
          userType: userType || 'visitor',
        })
        .returning();
      convId = conv.id;
    }
    
    // Save user message
    await db.insert(helpMessages).values({
      conversationId: convId,
      role: 'user',
      content: message,
    });
    
    // Query RAG system
    const { answer, sources } = await queryRAG(message, userType);
    
    // Save assistant response
    await db.insert(helpMessages).values({
      conversationId: convId,
      role: 'assistant',
      content: answer,
      sourcesUsed: sources,
    });
    
    res.json({
      conversationId: convId,
      message: answer,
      sources,
    });
  } catch (error) {
    console.error('[Help Chat Error]', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

/**
 * GET /api/help/search
 * Search help articles
 */
router.get('/search', async (req, res) => {
  try {
    const { q, category, stakeholder } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Query required' });
    }
    
    // Log search for analytics
    await db.insert(helpSearches).values({
      query: q,
      sessionId: req.sessionID,
    });
    
    const results = await searchArticles(q, 20);
    
    // Filter by category/stakeholder if provided
    let filtered = results;
    if (category) {
      filtered = filtered.filter(r => r.category === category);
    }
    if (stakeholder) {
      filtered = filtered.filter(r => r.stakeholders?.includes(stakeholder as string));
    }
    
    res.json({ results: filtered });
  } catch (error) {
    console.error('[Help Search Error]', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

/**
 * GET /api/help/articles
 * Get all articles or filter by category/stakeholder
 */
router.get('/articles', async (req, res) => {
  try {
    const { category, stakeholder } = req.query;
    
    let query = db.select().from(helpArticles);
    
    if (category) {
      query = query.where(eq(helpArticles.category, category as string));
    }
    
    const articles = await query;
    
    // Filter by stakeholder if provided (array contains check)
    let filtered = articles;
    if (stakeholder) {
      filtered = articles.filter(a => a.stakeholders?.includes(stakeholder as string));
    }
    
    res.json({ articles: filtered });
  } catch (error) {
    console.error('[Help Articles Error]', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

/**
 * GET /api/help/articles/:slug
 * Get single article by slug
 */
router.get('/articles/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const [article] = await db
      .select()
      .from(helpArticles)
      .where(eq(helpArticles.slug, slug));
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json({ article });
  } catch (error) {
    console.error('[Help Article Error]', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

/**
 * POST /api/help/feedback
 * Submit feedback on chat response
 */
router.post('/feedback', async (req, res) => {
  try {
    const { messageId, rating, comment } = req.body;
    
    await db
      .update(helpMessages)
      .set({ feedbackRating: rating })
      .where(eq(helpMessages.id, messageId));
    
    res.json({ success: true });
  } catch (error) {
    console.error('[Help Feedback Error]', error);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

/**
 * POST /api/help/reindex
 * Manually trigger reindexing (admin only)
 */
router.post('/reindex', async (req, res) => {
  try {
    // Check for SuperUser role
    if (req.session?.role !== 'super_user') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    await indexChangelogContent();
    res.json({ success: true, message: 'Reindexing complete' });
  } catch (error) {
    console.error('[Help Reindex Error]', error);
    res.status(500).json({ error: 'Reindexing failed' });
  }
});

export default router;
```

Add to `server/routes.ts`:
```typescript
import helpRoutes from './routes/help';
// ...
app.use('/api/help', helpRoutes);
```

---

## Frontend Components

### Main Help Center Page

Create `client/src/pages/help/HelpCenter.tsx`:

```tsx
import { useState } from 'react';
import { Link } from 'wouter';
import { Search, MessageCircle, BookOpen, Users, HardHat, Building2, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import HelpChatWidget from '@/components/help/HelpChatWidget';

const stakeholderCards = [
  {
    title: 'For Company Owners',
    description: 'Manage your entire operation, payroll, projects, and team from one platform.',
    icon: Briefcase,
    href: '/help/for-company-owners',
    color: 'bg-blue-500',
  },
  {
    title: 'For Technicians',
    description: 'Track your hours, certifications, safety compliance, and build your professional portfolio.',
    icon: HardHat,
    href: '/help/for-technicians',
    color: 'bg-amber-500',
  },
  {
    title: 'For Building Managers',
    description: 'Verify vendor compliance, access safety documentation, and manage service coordination.',
    icon: Building2,
    href: '/help/for-building-managers',
    color: 'bg-violet-500',
  },
  {
    title: 'For Property Managers',
    description: 'Portfolio-wide vendor oversight, compliance tracking, and enterprise reporting.',
    icon: Users,
    href: '/help/for-property-managers',
    color: 'bg-emerald-500',
  },
];

const moduleCategories = [
  { name: 'Project Management', slug: 'project-management' },
  { name: 'Time Tracking', slug: 'work-sessions-time-tracking' },
  { name: 'Safety & Compliance', slug: 'safety-compliance' },
  { name: 'IRATA/SPRAT Logging', slug: 'irata-sprat-logging' },
  { name: 'Employee Management', slug: 'employee-management' },
  { name: 'Document Management', slug: 'document-management' },
  { name: 'Gear Inventory', slug: 'gear-inventory' },
  { name: 'Scheduling', slug: 'scheduling-calendar' },
  { name: 'Payroll', slug: 'payroll-financial' },
  { name: 'Company Safety Rating', slug: 'company-safety-rating' },
  { name: 'Job Board', slug: 'job-board' },
  { name: 'Quoting & Sales', slug: 'quoting-sales' },
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/help/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B64A3] to-[#084d7a]">
      {/* Hero Section */}
      <div className="pt-16 pb-24 px-4 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          How can we help?
        </h1>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Find answers, learn about features, or chat with our AI assistant.
        </p>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search for help articles, features, or ask a question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-6 text-lg bg-white text-gray-900 border-0 rounded-xl shadow-lg"
            data-testid="help-search-input"
          />
          <Button 
            type="submit" 
            className="absolute right-2 top-1/2 -translate-y-1/2"
            data-testid="help-search-button"
          >
            Search
          </Button>
        </form>
        
        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
          <Link href="/help/getting-started" className="text-blue-200 hover:text-white underline">
            Getting Started Guide
          </Link>
          <span className="text-blue-300">|</span>
          <Link href="/help/tools/roi-calculator" className="text-blue-200 hover:text-white underline">
            ROI Calculator
          </Link>
          <span className="text-blue-300">|</span>
          <Link href="/pricing" className="text-blue-200 hover:text-white underline">
            Pricing
          </Link>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="bg-gray-50 dark:bg-gray-900 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Stakeholder Cards */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              I am a...
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stakeholderCards.map((card) => (
                <Link key={card.href} href={card.href}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <card.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{card.title}</CardTitle>
                      <CardDescription>{card.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
          
          {/* Module Documentation */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              Browse by Module
            </h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {moduleCategories.map((module) => (
                <Link 
                  key={module.slug} 
                  href={`/help/modules/${module.slug}`}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg border hover:border-blue-500 hover:shadow transition-all flex items-center gap-3"
                >
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">{module.name}</span>
                </Link>
              ))}
            </div>
          </section>
          
          {/* Popular Topics */}
          <section>
            <h2 className="text-2xl font-bold text-center mb-8">
              Popular Topics
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <TopicCard 
                title="How do I track payroll automatically?"
                description="Learn how Work Sessions automatically calculate hours for payroll."
                href="/help/modules/payroll-financial"
              />
              <TopicCard 
                title="What safety documentation does OnRopePro generate?"
                description="Harness inspections, toolbox meetings, and compliance exports."
                href="/help/modules/safety-compliance"
              />
              <TopicCard 
                title="How do technicians log IRATA/SPRAT hours?"
                description="Automatic hour tracking for certification progression."
                href="/help/modules/irata-sprat-logging"
              />
              <TopicCard 
                title="Can building managers see our safety records?"
                description="Company Safety Rating visibility and compliance verification."
                href="/help/modules/company-safety-rating"
              />
            </div>
          </section>
        </div>
      </div>
      
      {/* Floating Chat Widget */}
      <HelpChatWidget />
    </div>
  );
}

function TopicCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link href={href}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
```

### AI Chat Widget

Create `client/src/components/help/HelpChatWidget.tsx`:

```tsx
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ title: string; slug: string }>;
}

export default function HelpChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [userType, setUserType] = useState<string>('visitor');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'greeting',
        role: 'assistant',
        content: `Hi! I'm the OnRopePro assistant. I can help you learn about our platform, find specific features, or troubleshoot issues.\n\nWhat can I help you with today?`,
      }]);
    }
  }, [isOpen]);
  
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/help/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          conversationId,
          userType,
        }),
      });
      
      const data = await response.json();
      
      if (!conversationId) {
        setConversationId(data.conversationId);
      }
      
      const assistantMessage: Message = {
        id: Date.now().toString() + '-response',
        role: 'assistant',
        content: data.message,
        sources: data.sources,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '-error',
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or contact support.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all z-50',
          isOpen && 'hidden'
        )}
        data-testid="help-chat-button"
        aria-label="Open help chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
      
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] max-h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col z-50 border">
          {/* Header */}
          <div className="p-4 border-b bg-blue-600 text-white rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">OnRopePro Assistant</h3>
                <p className="text-xs text-blue-100">Ask me anything</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* User Type Selector (first interaction) */}
          {messages.length <= 1 && (
            <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">I am a:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'owner', label: 'Company Owner' },
                  { value: 'technician', label: 'Technician' },
                  { value: 'building-manager', label: 'Building Manager' },
                  { value: 'visitor', label: 'Just Exploring' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setUserType(option.value)}
                    className={cn(
                      'px-3 py-1 rounded-full text-sm border transition-colors',
                      userType === option.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-gray-700 hover:border-blue-300'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-3',
                    message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-gray-100 dark:bg-gray-800 rounded-bl-md'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Source Links */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 mb-2">Related articles:</p>
                      <div className="space-y-1">
                        {message.sources.map(source => (
                          <a
                            key={source.slug}
                            href={`/help/modules/${source.slug}`}
                            className="text-xs text-blue-600 hover:underline block"
                          >
                            {source.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className="flex-1"
                disabled={isLoading}
                data-testid="help-chat-input"
              />
              <Button 
                onClick={sendMessage} 
                disabled={isLoading || !input.trim()}
                data-testid="help-chat-send"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              AI-powered by OnRopePro documentation
            </p>
          </div>
        </div>
      )}
    </>
  );
}
```

---

## Routes Configuration

Add to `client/src/App.tsx` (or routes file):

```tsx
import HelpCenter from '@/pages/help/HelpCenter';
import HelpSearch from '@/pages/help/HelpSearch';
import HelpArticle from '@/pages/help/HelpArticle';
import ForCompanyOwners from '@/pages/help/stakeholders/ForCompanyOwners';
import ForTechnicians from '@/pages/help/stakeholders/ForTechnicians';
import ForBuildingManagers from '@/pages/help/stakeholders/ForBuildingManagers';
import ForPropertyManagers from '@/pages/help/stakeholders/ForPropertyManagers';
import GettingStarted from '@/pages/help/stakeholders/GettingStarted';
import ROICalculator from '@/pages/help/tools/ROICalculator';

// Add these routes
<Route path="/help" component={HelpCenter} />
<Route path="/help/search" component={HelpSearch} />
<Route path="/help/modules/:slug" component={HelpArticle} />
<Route path="/help/for-company-owners" component={ForCompanyOwners} />
<Route path="/help/for-technicians" component={ForTechnicians} />
<Route path="/help/for-building-managers" component={ForBuildingManagers} />
<Route path="/help/for-property-managers" component={ForPropertyManagers} />
<Route path="/help/getting-started" component={GettingStarted} />
<Route path="/help/tools/roi-calculator" component={ROICalculator} />
```

---

## Auto-Sync Strategy

### Option 1: File Watcher (Development)

Add to `server/index.ts`:

```typescript
import chokidar from 'chokidar';
import { indexChangelogContent } from './services/ragService';

// Watch for changelog file changes in development
if (process.env.NODE_ENV === 'development') {
  const watcher = chokidar.watch('client/src/pages/*Guide.tsx', {
    persistent: true,
    ignoreInitial: true,
  });
  
  watcher.on('change', async (path) => {
    console.log(`[RAG] Detected change in ${path}, reindexing...`);
    await indexChangelogContent();
  });
}
```

### Option 2: Startup Indexing + Manual Reindex

```typescript
// In server startup
import { indexChangelogContent } from './services/ragService';

// Index on startup
indexChangelogContent().catch(console.error);

// Expose reindex endpoint for manual triggers (already in routes)
// POST /api/help/reindex
```

### Option 3: Scheduled Reindex (Production)

```typescript
import cron from 'node-cron';
import { indexChangelogContent } from './services/ragService';

// Reindex every night at 2am
cron.schedule('0 2 * * *', async () => {
  console.log('[RAG] Running scheduled reindex...');
  await indexChangelogContent();
});
```

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Add database schema (help tables)
- [ ] Run migrations with pgvector extension
- [ ] Create RAG service with basic indexing
- [ ] Create `/api/help/*` routes
- [ ] Build HelpCenter.tsx main page
- [ ] Build HelpChatWidget.tsx

### Phase 2: Content
- [ ] Index all existing Guide pages
- [ ] Create stakeholder landing pages (ForCompanyOwners, etc.)
- [ ] Create GettingStarted guide
- [ ] Build HelpSearch results page
- [ ] Build HelpArticle detail page

### Phase 3: Enhancement
- [ ] Add ROI Calculator tool
- [ ] Implement feedback system
- [ ] Add search analytics tracking
- [ ] Build admin dashboard for search analytics
- [ ] Implement auto-reindex on file changes

### Phase 4: Polish
- [ ] Mobile responsive testing
- [ ] Dark mode verification
- [ ] Loading states and error handling
- [ ] SEO meta tags for help pages
- [ ] Add to main navigation

---

## Design Requirements

### Colors (Match Existing)
- Primary Blue: `#0B64A3`
- Stakeholder Colors:
  - Company Owners: `bg-blue-500`
  - Technicians: `bg-amber-500`
  - Building Managers: `bg-violet-500`
  - Property Managers: `bg-emerald-500`

### Typography
- Use existing font stack
- Minimum body text: 16px (text-base)
- No emojis in UI

### Components
- Use existing shadcn/ui components
- Follow existing Card, Button, Input patterns
- Add `data-testid` attributes to all interactive elements

---

## Testing Requirements

1. **RAG Quality**: Test that relevant chunks are retrieved for common questions
2. **Chat Responsiveness**: Ensure sub-2-second response times
3. **Search Accuracy**: Verify search returns relevant results
4. **Mobile UX**: Test chat widget on mobile devices
5. **Accessibility**: Keyboard navigation, screen reader support

---

## Notes for Replit Agent

1. **Start with schema**: Create the database tables first, ensure pgvector is enabled
2. **Stub the RAG service**: Get basic indexing working before optimizing extraction
3. **Build UI incrementally**: Start with HelpCenter, then add chat, then search
4. **Test with real content**: Use actual Guide pages to verify RAG quality
5. **Follow existing patterns**: Look at how other pages in the codebase are structured

The `/changelog/` content is the Single Source of Truth. The help system reads from it, never writes to it. As new Guide pages are added, they should be registered in the `guideRegistry` array in ragService.ts.

---

**Document Version:** 1.0  
**Created:** December 17, 2025  
**Purpose:** Replit Agent implementation specification
