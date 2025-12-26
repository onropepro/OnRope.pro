# Help Module Content System Documentation

This document explains how `/help/modules/` pages are created, where content comes from, and how to properly build out the help section.

---

## Overview

The help module pages (like `/help/modules/time-tracking`) are driven by a **content pipeline** that has two possible sources:

1. **Dedicated Markdown Files** (preferred for quality content)
2. **Auto-extracted from TSX Guide files** (fallback/legacy method)

The system prioritizes markdown files when they exist, falling back to TSX extraction.

---

## Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     CONTENT SOURCES                             │
├──────────────────────────┬──────────────────────────────────────┤
│  Option 1 (Preferred)    │  Option 2 (Fallback)                 │
│  Markdown Files          │  TSX Guide Files                     │
│  server/help-content/    │  client/src/pages/*Guide.tsx         │
│  *.md                    │                                      │
└──────────────────────────┴──────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RAG SERVICE                                  │
│  server/services/ragService.ts                                  │
│  - Checks for markdown first                                    │
│  - Falls back to TSX extraction                                 │
│  - Stores content in database                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE                                     │
│  Table: help_articles                                           │
│  - slug, title, description, content                            │
│  - category, stakeholders, sourceFile                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND                                     │
│  API: GET /api/help/articles/:slug                              │
│  Page: client/src/pages/help/HelpArticle.tsx                    │
│  Route: /help/modules/:slug                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Files

| File | Purpose |
|------|---------|
| `server/services/ragService.ts` | Central indexing service. Contains the `guideRegistry` and content extraction logic. |
| `server/help-content/*.md` | Dedicated markdown content files (preferred source) |
| `client/src/pages/*Guide.tsx` | TSX Guide component files (fallback source) |
| `server/routes/help.ts` | API endpoints for articles, search, and chat |
| `client/src/pages/help/HelpArticle.tsx` | Frontend page that renders article content |

---

## The Guide Registry

All modules must be registered in `server/services/ragService.ts` in the `guideRegistry` array:

```typescript
export const guideRegistry = [
  {
    slug: 'time-tracking',           // URL path: /help/modules/time-tracking
    title: 'Time Tracking & GPS',    // Fallback title if not in content
    category: 'operations',          // Category for filtering
    sourceFile: 'client/src/pages/TimeTrackingGuide.tsx',  // TSX fallback
    stakeholders: ['owner', 'operations_manager', 'technician'],  // Who it's for
  },
  // ... more modules
];
```

### Categories

| Category ID | Display Name | Description |
|-------------|--------------|-------------|
| `operations` | Operations | Project management, scheduling, analytics, document management |
| `safety` | Safety & Compliance | Compliance, CSR, gear inventory |
| `hr` | HR & Team | Employees, IRATA/SPRAT, job board |
| `financial` | Financial | Payroll, quoting |
| `communication` | Communication | Portals, notifications |
| `customization` | Customization | Branding, settings |

### Stakeholders

| Stakeholder ID | Display Name |
|----------------|--------------|
| `owner` | Company Owners |
| `operations_manager` | Operations Managers |
| `supervisor` | Supervisors |
| `technician` | Technicians |
| `building-manager` | Building Managers |
| `property-manager` | Property Managers |

### IMPORTANT: One Entry Per Module

**Each module should have exactly ONE entry in guideRegistry.** Do not create duplicate entries for the same conceptual feature (e.g., do NOT have both `resident-portal` and `resident-portal-user-guide`).

The two-tier content system works as follows:
- **Backend SSOT (`/changelog/*`):** TSX Guide files contain comprehensive information for internal use, landing pages, copy writing, and support
- **Frontend Help (`/help/modules/*`):** Markdown files in `server/help-content/modules/*.md` contain polished, customer-facing content

The guideRegistry entry should point to the TSX file, but if a markdown file with the same slug exists, the markdown takes priority for the `/help/modules/*` route. This prevents duplicates in the help section.

---

## Content Sources (In Priority Order)

### 1. Dedicated Markdown Files (PREFERRED)

**Location:** `server/help-content/{slug}.md`

The system first checks for a markdown file matching the slug. If found, it uses this content directly.

**Example:** For `/help/modules/project-management`, the system looks for:
```
server/help-content/project-management.md
```

**Why Preferred:**
- Full control over formatting
- Consistent, well-structured content
- No messy extraction from React components
- Easy to maintain and update

**How It Works (from ragService.ts):**
```typescript
function getMarkdownContent(slug: string) {
  const mdPath = path.resolve(process.cwd(), `server/help-content/${slug}.md`);
  
  if (!fs.existsSync(mdPath)) {
    return null;  // Falls back to TSX extraction
  }
  
  const content = fs.readFileSync(mdPath, 'utf-8');
  // Extract title from first h1, description from first paragraph
  return { title, description, content };
}
```

### 2. TSX Extraction (FALLBACK)

If no markdown file exists, the system attempts to extract content from the TSX Guide file listed in `sourceFile`. This process is imperfect because:

- It uses regex patterns to find text in React components
- JSX/developer code gets mixed in
- Formatting is inconsistent
- Content structure is lost

**The extraction attempts to find:**
- Page title from `<ChangelogGuideLayout title="..."`
- Section headings from `<h2>` and `<h3>` tags
- Introduction paragraphs
- Card content with feature summaries
- Accordion Q&A content
- List items and general paragraphs

**Common Issues:**
- Empty sections like "For Company Owners" with no content
- Mixed JSX artifacts
- Missing context between sections
- Developer-specific content leaking through

---

## Current Modules (December 2025)

| Slug | Title | Category | Has Markdown? | Status |
|------|-------|----------|---------------|--------|
| `project-management` | Project Management | operations | YES | Complete |
| `time-tracking` | Time Tracking & GPS | operations | YES | Complete |
| `safety-compliance` | Safety & Compliance | safety | YES | Complete |
| `irata-sprat-logging` | IRATA/SPRAT Logging | hr | YES | Complete |
| `employee-management` | Employee Management | hr | YES | Complete |
| `document-management` | Document Management | operations | YES | Complete |
| `gear-inventory` | Gear Inventory | safety | YES | Complete |
| `scheduling` | Scheduling & Calendar | operations | YES | Complete |
| `payroll` | Payroll Management | financial | YES | Complete |
| `company-safety-rating` | Company Safety Rating | safety | YES | Complete |
| `job-board` | Job Board | hr | YES | Complete |
| `quoting-sales` | Quoting & Sales | financial | YES | Complete |
| `resident-portal` | Resident Portal | communication | YES | Complete |
| `property-manager-interface` | Property Manager Interface | communication | YES | Complete |
| `white-label-branding` | White-Label Branding | customization | YES | Complete |
| `analytics-reporting` | Analytics & Reporting | operations | YES | Complete |
| `personal-safety-rating` | Personal Safety Rating (PSR) | safety | YES | Complete |

**Summary:** 17 of 17 modules have dedicated markdown content in `server/help-content/modules/`.

---

## Popular Topics (December 2025)

Popular Topics are help articles that appear in the "Popular Topics" section of the Help Center rather than the modules grid. They ARE in `guideRegistry` for RAG indexing, but have `hideFromModulesGrid: true` flag.

| Slug | Title | Location | Has Markdown? | hideFromModulesGrid |
|------|-------|----------|---------------|---------------------|
| `dashboard-customization` | Dashboard Customization | Popular Topics | YES | true |

**Implementation:**
- Popular Topics entries in `guideRegistry` have `hideFromModulesGrid: true`
- The `/api/help/modules` endpoint filters these out so they don't appear in the modules grid
- RAG still indexes them because they're in `guideRegistry`
- Static `TopicCard` components in HelpCenter.tsx link to them in the Popular Topics section
- The URL pattern `/help/modules/dashboard-customization` still works

**Note:** There should be exactly ONE entry per module in guideRegistry. The previous duplicate `resident-portal-user-guide` entry was removed in December 2025.

---

## Markdown Content Format

When creating markdown files in `server/help-content/`, follow this structure:

### Required Structure

```markdown
# Title

Opening paragraph describing what this module does. This becomes the article description (first 200 chars).

## What You Can Do

Core capabilities list:

- **Feature Name** - Brief description of feature
- **Another Feature** - Another description

## Section Heading

Detailed explanation paragraphs.

### Subsection

For deeper topics within a section.

## Tips for Company Owners

Role-specific guidance using stakeholder terminology.

## Tips for Technicians

Different guidance for different roles.

## Frequently Asked Questions

### Question here?
Answer paragraph here.

### Another question?
Another answer.
```

### Supported Markdown Elements

The frontend renderer (`HelpArticle.tsx`) currently supports:

| Element | Syntax | Rendered As |
|---------|--------|-------------|
| H2 heading | `## Heading` | Large section heading with border |
| H3 heading | `### Heading` | Medium subsection heading |
| Bold text | `**text**` | Strong/bold text |
| Bullet list | `- Item` | Unordered list |
| Horizontal rule | `---` | Visual separator |
| Paragraphs | Blank line separated | Normal paragraphs |

### NOT Currently Supported

The following are NOT rendered correctly and should be avoided:

- Numbered lists (`1. Item`) - rendered as paragraphs
- Code blocks (triple backticks) - rendered as plain text
- Links `[text](url)` - rendered as plain text
- Images `![alt](url)` - not rendered
- Tables - rendered as plain text
- Inline code (backticks) - rendered as plain text

---

## Writing Guidelines

### Voice & Tone

- Write for non-technical users
- Use "you" and "your" to address the reader
- Be direct and action-oriented
- Avoid jargon; explain technical terms when needed

### Structure Best Practices

1. **Start with what the feature does** - not how it works internally
2. **Lead with the most common use cases** - what will users do 80% of the time?
3. **Use bullet lists for features and options** - easy to scan
4. **Use action verbs** - "Create a project" not "Projects can be created"
5. **End with FAQs** - catch edge cases and common questions

### Content to Include

- What problem does this solve?
- Who uses this feature? (by role)
- How do you access it? (menu location)
- What are the key settings/options?
- Step-by-step for common workflows
- Role-specific tips
- Common questions and answers

### Content to Avoid

- Technical implementation details
- Database schema references
- API endpoint documentation
- Developer-specific terms (useState, props, components)
- Internal system mechanics
- References to code or configuration files

### Formatting Tips

- Keep paragraphs short (2-4 sentences)
- Use `**bold**` for UI element names: "Click **New Project**"
- Use headings to create scannable content
- Group related information under clear section headings
- Use FAQs for one-off questions that don't fit elsewhere

---

## Indexing & Updating Content

### When Content Is Indexed

Content is indexed:
1. When the server starts (automatic)
2. When an admin triggers reindex via API

### Manual Reindex

Superusers can reindex all content:
```
POST /api/help/reindex
```

Response:
```json
{
  "success": true,
  "indexed": 16,
  "failed": 0
}
```

### After Adding New Content

1. Create markdown file: `server/help-content/{slug}.md`
2. Ensure slug matches one in `guideRegistry`
3. Restart server OR trigger reindex
4. Visit `/help/modules/{slug}` to verify

### Adding a New Module

If the module doesn't exist in the registry yet:

1. Add entry to `guideRegistry` in `server/services/ragService.ts`:
```typescript
{
  slug: 'new-module',
  title: 'New Module Title',
  category: 'operations',
  sourceFile: 'client/src/pages/NewModuleGuide.tsx',  // Can be placeholder
  stakeholders: ['owner', 'technician'],
}
```

2. Create `server/help-content/new-module.md`

3. Restart server or reindex

4. Verify at `/help/modules/new-module`

---

## Priority Recommendations for Content Creation

Based on user impact and daily usage patterns:

### Tier 1: Core Daily Operations (High Priority)
1. `time-tracking` - Used by every employee every day
2. `safety-compliance` - Critical for CSR and compliance
3. `scheduling` - Daily planning for operations

### Tier 2: Management Features (Medium Priority)
4. `employee-management` - Onboarding and team management
5. `payroll` - Weekly/bi-weekly payroll processing
6. `gear-inventory` - Equipment tracking and safety

### Tier 3: Specialized Features (Standard Priority)
7. `irata-sprat-logging` - Technician certification tracking
8. `document-management` - File and document organization
9. `quoting-sales` - Sales and pricing workflows
10. `analytics-reporting` - Business intelligence

### Tier 4: External Portals (Lower Priority - External Users)
11. `resident-portal` - Building resident interface
12. `property-manager-interface` - Property manager dashboard
13. `company-safety-rating` - CSR explanation for external parties

### Tier 5: Configuration (Lowest Priority - One-Time Setup)
14. `job-board` - Recruitment features
15. `white-label-branding` - Branding customization

---

## Template for New Articles

Use this template when creating new markdown files in `server/help-content/`:

```markdown
# [Module Title]

[One paragraph overview: What is this feature? What problem does it solve? Who uses it?]

## What You Can Do

[Core capabilities with this module]:

- **[Capability 1]** - [Brief description]
- **[Capability 2]** - [Brief description]
- **[Capability 3]** - [Brief description]
- **[Capability 4]** - [Brief description]

## How It Works

[Explain the main workflow or concept in 2-3 paragraphs]

### [Key Concept or Feature]

[Detailed explanation of a specific aspect]

### [Another Key Concept]

[Another detailed explanation]

## Getting Started

1. Go to **[Menu Location]** in the main menu
2. Click **[Button Name]**
3. [Complete the form/action]
4. [Expected result]

## For Company Owners

[Specific guidance, tips, and best practices for this role]

- [Tip 1]
- [Tip 2]
- [Tip 3]

## For Operations Managers

[Specific guidance for this role]

- [Tip 1]
- [Tip 2]

## For Technicians

[Specific guidance for this role, if applicable]

- [Tip 1]
- [Tip 2]

## Frequently Asked Questions

### [Common question about basic usage]?
[Clear, direct answer]

### [Question about a specific scenario]?
[Answer with context]

### [Question about limitations or edge cases]?
[Honest answer about what is/isn't supported]

### [Question about integration with other features]?
[Explain how this connects to other modules]
```

---

## Troubleshooting

### Content Not Updating After Changes

1. **Check file location:** `server/help-content/{slug}.md`
2. **Verify slug matches:** Must match entry in `guideRegistry` exactly
3. **Trigger reindex:** Restart server or POST to `/api/help/reindex`
4. **Check server logs:** Look for `[RAG] Using dedicated markdown: {slug}.md`

### Article Returns 404

1. Verify slug exists in `guideRegistry` in `ragService.ts`
2. Check database: `SELECT * FROM help_articles WHERE slug = '{slug}'`
3. Ensure `isPublished` is `true` in database
4. Run reindex to populate missing article

### Formatting Looks Wrong

1. Check for unsupported markdown (numbered lists, code blocks, links)
2. Ensure proper blank lines between sections
3. Verify heading syntax has space after `##` or `###`
4. Check for unclosed bold markers `**`

### Content Shows JSX/Code Artifacts

This happens when falling back to TSX extraction. Solution: Create a dedicated markdown file for that slug.

### Reindex Shows Failures

Check server logs for specific errors:
```
[RAG] Error indexing {slug}: {error message}
```

Common causes:
- Missing TSX file referenced in `sourceFile`
- File read permissions
- Invalid markdown syntax

---

## Database Schema Reference

The `help_articles` table stores indexed content:

```sql
help_articles (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  source_file TEXT NOT NULL,
  content TEXT,
  stakeholders TEXT[],
  is_published BOOLEAN DEFAULT true,
  indexed_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

---

## API Endpoints Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/help/articles` | GET | List all published articles |
| `/api/help/articles/:slug` | GET | Get single article by slug |
| `/api/help/modules` | GET | Get guide registry list |
| `/api/help/categories` | GET | Get categories with counts |
| `/api/help/search?q={query}` | GET | Search articles |
| `/api/help/reindex` | POST | Reindex all content (admin) |

---

## Next Steps

To build out the help section:

1. **Start with Tier 1 modules** - Create markdown for time-tracking, safety-compliance, scheduling
2. **Use the template** - Follow the structure for consistency
3. **Test each article** - Visit the URL after creating
4. **Consider renderer improvements** - Add support for numbered lists and links if needed
5. **Review with stakeholders** - Ensure content matches actual workflows
