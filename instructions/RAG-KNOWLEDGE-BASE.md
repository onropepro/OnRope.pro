# RAG Knowledge Base System Documentation

## Overview

The RAG (Retrieval Augmented Generation) Knowledge Base powers the AI Help Chat system at `/help`. It extracts content from guide pages, stores articles in the database, and provides text-based search with AI-generated responses using Gemini.

**Important:** Replit's Gemini integration does not support embeddings, so this system uses text-based keyword search rather than semantic vector search.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CONTENT SOURCES                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────────────────┐         ┌──────────────────────┐              │
│   │  Markdown Files     │         │   TSX Guide Files    │              │
│   │  (PRIORITY SOURCE)  │         │   (FALLBACK SOURCE)  │              │
│   │                     │         │                      │              │
│   │  server/help-content│         │  client/src/pages/   │              │
│   │  /modules/*.md      │         │  *Guide.tsx          │              │
│   └──────────┬──────────┘         └──────────┬───────────┘              │
│              │                               │                           │
│              │    ┌──────────────────┐       │                           │
│              └───►│  guideRegistry   │◄──────┘                           │
│                   │  (ragService.ts) │                                   │
│                   └────────┬─────────┘                                   │
│                            │                                             │
└────────────────────────────┼─────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         INDEXING PIPELINE                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   1. Check for markdown file: server/help-content/modules/{slug}.md     │
│      └─► If exists: Parse markdown (title, description, content)        │
│      └─► If not: Extract content from TSX file                          │
│                                                                          │
│   2. Store in database: help_articles table                             │
│      - slug (unique identifier)                                         │
│      - title, description, content                                      │
│      - category, stakeholders[]                                         │
│      - sourceFile, isPublished, timestamps                              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         QUERY PIPELINE                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   User Question                                                         │
│        │                                                                │
│        ▼                                                                │
│   searchArticles() - Keyword-based scoring                              │
│        │  - Title matches: 10 points per word                           │
│        │  - Content matches: 1 point per occurrence (max 5)             │
│        ▼                                                                │
│   Top 5 Results → Build Context String                                  │
│        │  - First 2000 chars of each article                            │
│        ▼                                                                │
│   generateChatResponse() via Gemini                                     │
│        │  - Context + conversation history                              │
│        ▼                                                                │
│   Response + Source Attribution                                         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Key Files

| File | Purpose |
|------|---------|
| `server/services/ragService.ts` | Core RAG logic: guide registry, content extraction, indexing, querying |
| `server/help-content/modules/*.md` | **Primary content source** - Markdown files for each guide |
| `client/src/pages/*Guide.tsx` | TSX guide pages (fallback if no markdown exists) |
| `server/index.ts` | File watcher setup for automatic reindexing |
| `server/gemini.ts` | Gemini AI integration for chat responses |
| `shared/schema.ts` | Database schema for help_articles table |

---

## The Guide Registry

The `guideRegistry` array in `ragService.ts` is the **single source of truth** for what content gets indexed. Each entry contains:

```typescript
{
  slug: 'project-management',       // Unique URL-friendly identifier
  title: 'Project Management',      // Display title
  category: 'operations',           // Category grouping
  sourceFile: 'client/src/pages/ProjectsGuide.tsx',  // TSX fallback path
  stakeholders: ['owner', 'operations_manager', 'supervisor'],  // Who this applies to
}
```

### Current Categories
- `operations` - Project management, scheduling, time tracking, analytics
- `safety` - Safety compliance, gear inventory, company safety rating
- `hr` - Employee management, IRATA logging, job board
- `financial` - Payroll, quoting/sales
- `communication` - Resident portal, property manager interface
- `customization` - White-label branding

### Stakeholder Types
- `owner` - Company owners
- `operations_manager` - Operations managers
- `supervisor` - Site supervisors
- `technician` - Rope access technicians
- `building-manager` - Building managers
- `property-manager` - Property managers
- `resident` - Building residents

---

## Content Priority System

When indexing a guide, the system follows this priority:

### 1. Markdown Files (Priority)
Location: `server/help-content/modules/{slug}.md`

If a markdown file exists matching the guide's slug, it is used as the content source. This is the **preferred method** because:
- Direct control over indexed content
- No JSX parsing required
- Easy to edit and maintain
- No risk of extracting developer code/comments

### 2. TSX Extraction (Fallback)
If no markdown file exists, content is extracted from the TSX file specified in `sourceFile`.

The extraction process:
1. Reads the raw TSX file
2. Extracts title from `ChangelogGuideLayout title="..."`
3. Parses h2/h3 headings
4. Extracts Card feature descriptions
5. Parses AccordionContent for Q&A pairs
6. Filters out developer-specific content (imports, className, etc.)

**Limitation:** TSX extraction is imperfect and may miss or mangle content. Always prefer markdown.

---

## Database Schema

### help_articles Table

```sql
CREATE TABLE help_articles (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR NOT NULL UNIQUE,          -- URL identifier
  title VARCHAR NOT NULL,                 -- Display title
  description TEXT,                       -- Brief search result description
  category VARCHAR NOT NULL,              -- Module category
  source_file VARCHAR NOT NULL,           -- Original TSX file path
  content TEXT NOT NULL,                  -- Full extracted/markdown content
  stakeholders TEXT[] DEFAULT '{}',       -- Array of stakeholder types
  is_published BOOLEAN DEFAULT true,      -- Visibility flag
  indexed_at TIMESTAMP DEFAULT NOW(),     -- First index time
  updated_at TIMESTAMP DEFAULT NOW()      -- Last update time
);
```

### Related Tables
- `help_embeddings` - Reserved for future vector search (not currently used)
- `help_conversations` - Chat session tracking
- `help_messages` - Individual chat messages with sources
- `help_searches` - Search analytics

---

## Automatic Reindexing

A file watcher (chokidar) monitors content files and triggers reindexing on changes.

### Watched Paths
```javascript
[
  'client/src/pages/*Guide.tsx',       // TSX guide files
  'client/src/pages/help/**/*.tsx',    // Help subdirectory TSX files
  'server/help-content/**/*.md'        // All markdown content files
]
```

### Behavior
- **On file change/add:** Full reindex of all guides is triggered
- **Development only:** File watching is disabled in production
- **Logs:** Watch `[RAG] Detected change in...` and `[RAG] Reindex complete` messages

---

## How to Add New Content

### Adding a New Guide

1. **Add to guideRegistry** (`server/services/ragService.ts`):
```typescript
{
  slug: 'new-feature',
  title: 'New Feature Guide',
  category: 'operations',  // or appropriate category
  sourceFile: 'client/src/pages/NewFeatureGuide.tsx',
  stakeholders: ['owner', 'technician'],
}
```

2. **Create markdown content** (`server/help-content/modules/new-feature.md`):
```markdown
# New Feature Guide

Brief introduction paragraph that becomes the description.

## Getting Started

Detailed content here...

## Key Features

- **Feature A**: Description of feature A
- **Feature B**: Description of feature B

## Common Questions

### How do I use this feature?

Step-by-step instructions...
```

3. **Restart the server** or save any watched file to trigger reindexing

4. **Verify in logs:**
```
[RAG] Indexing: New Feature Guide
[RAG] Using dedicated markdown: new-feature.md
[RAG] Created: new-feature
```

### Updating Existing Content

1. Edit the markdown file at `server/help-content/modules/{slug}.md`
2. Save the file - automatic reindex will occur
3. Verify in logs: `[RAG] Updated: {slug}`

---

## Markdown File Format

### Required Structure
```markdown
# Title Here

First paragraph becomes the description (first 200 chars).

## Section Heading

Content...

### Subsection

More content...
```

### Best Practices
- Use clear, user-friendly language
- Avoid technical jargon and code references
- Structure with logical headings (##, ###)
- Include step-by-step instructions where applicable
- Add FAQ sections for common questions
- Keep paragraphs concise for better search matching

---

## Search Algorithm

The `searchArticles()` function uses keyword-based scoring:

```typescript
for (const word of queryWords) {
  if (titleLower.includes(word)) score += 10;  // Title match
  const contentMatches = countOccurrences(contentLower, word);
  score += Math.min(contentMatches, 5);  // Content matches (capped)
}
```

### Optimization Tips
- Include important keywords in article titles
- Repeat key terms naturally in content
- Use synonyms for important concepts
- Structure content so important info appears early

---

## API Endpoints

### POST /api/help/chat
Send a message to the AI assistant.

```typescript
Request: {
  message: string;
  conversationId?: string;
  stakeholder?: string;
}

Response: {
  message: string;
  sources: Array<{ title: string; slug: string }>;
  conversationId: string;
}
```

### GET /api/help/articles
List all published articles.

### GET /api/help/articles/:slug
Get a specific article by slug.

### GET /api/help/articles/category/:category
Get articles by category.

### GET /api/help/articles/stakeholder/:stakeholder
Get articles relevant to a stakeholder type.

### POST /api/help/reindex (SuperUser only)
Manually trigger full reindex.

---

## Troubleshooting

### Content Not Appearing in Chat

1. **Check if guide is in registry:**
   - Verify entry exists in `guideRegistry` array
   - Confirm slug matches markdown filename

2. **Check if markdown exists:**
   - File must be at `server/help-content/modules/{slug}.md`
   - Filename must match the slug exactly

3. **Check logs for indexing:**
   ```
   [RAG] Indexing: {title}
   [RAG] Using dedicated markdown: {slug}.md
   [RAG] Updated: {slug}
   ```

4. **Verify content in database:**
   ```sql
   SELECT slug, title, LENGTH(content), updated_at 
   FROM help_articles 
   WHERE slug = 'your-slug';
   ```

### AI Not Finding Content

1. **Check keyword matching:**
   - Ensure the question contains words from the article
   - Important terms should appear in the title

2. **Test search directly:**
   - API: `POST /api/help/search` with `{ query: "your keywords" }`

3. **Verify content is indexed:**
   - Check `content` column has actual text
   - Ensure `is_published = true`

### File Watcher Not Triggering

1. **Development mode only:**
   - Watcher only runs when `app.get("env") === "development"`

2. **Check file path matches:**
   - TSX files: `client/src/pages/*Guide.tsx`
   - Help pages: `client/src/pages/help/**/*.tsx`
   - Markdown: `server/help-content/**/*.md`

3. **Manual trigger:**
   - Restart the server, or
   - Call `POST /api/help/reindex` as SuperUser

---

## Current Guide Inventory

| Slug | Title | Category | Has Markdown |
|------|-------|----------|--------------|
| project-management | Project Management | operations | Yes |
| time-tracking | Time Tracking & GPS | operations | Yes |
| safety-compliance | Safety & Compliance | safety | Yes |
| irata-sprat-logging | IRATA/SPRAT Logging | hr | Yes |
| employee-management | Employee Management | hr | Yes |
| document-management | Document Management | operations | Yes |
| gear-inventory | Gear Inventory | safety | Yes |
| scheduling | Scheduling & Calendar | operations | Yes |
| payroll | Payroll Management | financial | Yes |
| company-safety-rating | Company Safety Rating | safety | Yes |
| job-board | Job Board | hr | Yes |
| quoting-sales | Quoting & Sales | financial | Yes |
| resident-portal | Resident Portal | communication | Yes |
| property-manager-interface | Property Manager Interface | communication | Yes |
| white-label-branding | White-Label Branding | customization | Yes |
| analytics-reporting | Analytics & Reporting | operations | Yes |
| personal-safety-rating | Personal Safety Rating (PSR) | safety | Yes |

### Popular Topics (Not in Modules Grid)

These help articles appear in "Popular Topics" section, not the modules grid. They ARE in `guideRegistry` for RAG indexing, but have `hideFromModulesGrid: true` flag.

| Slug | Title | Has Markdown | hideFromModulesGrid |
|------|-------|--------------|---------------------|
| dashboard-customization | Dashboard Customization | Yes | true |

---

## Future Improvements

### Potential Enhancements
1. **Vector embeddings** - When Replit supports Gemini embeddings, implement semantic search
2. **Content versioning** - Track changes over time
3. **Search analytics** - Use help_searches table to identify gaps
4. **Multi-language support** - i18n for content
5. **Changelog integration** - Index changelog entries for release notes

### Known Limitations
- No semantic search (keyword-only)
- TSX extraction is brittle
- Full reindex on any file change (could be optimized)
- No content caching (queries DB each time)

---

## Quick Reference

### Add new guide:
1. Add entry to `guideRegistry` in `ragService.ts`
2. Create `server/help-content/modules/{slug}.md`
3. Save any watched file to trigger reindex

### Update content:
1. Edit `server/help-content/modules/{slug}.md`
2. Save - auto reindex occurs

### Manual reindex:
- Restart server, or
- `POST /api/help/reindex` (SuperUser)

### Check indexing:
- Look for `[RAG]` prefixed log messages
- Query: `SELECT * FROM help_articles WHERE slug = '...'`
