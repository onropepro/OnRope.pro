# SEO & Prerendering Instructions v1.0
**System**: Rope Access Management System  
**Domain**: Public Page Indexability & Search Engine Optimization  
**Version**: 1.0  
**Last Updated**: December 20, 2024  
**Status**: DRAFT - AWAITING IMPLEMENTATION  
**Safety Critical**: No - Does not affect worker safety directly

---

## Purpose and Goal

### Primary Objective
Enable search engines (Google, Bing) and AI services (NotebookLM, ChatGPT, Perplexity) to discover, crawl, and index the platform's public-facing pages, driving organic traffic and improving discoverability for all stakeholder types.

### Key Goals
- **Discoverability**: Public landing pages appear in search results for relevant queries
- **Rich Snippets**: Structured data enables enhanced search result displays
- **AI Accessibility**: Content readable by AI services for research and recommendations
- **Performance**: Prerendered pages load faster for first-time visitors
- **Stakeholder Reach**: Each audience (technicians, residents, property managers, building managers, employers) can find relevant content

### Business Impact
| Stakeholder | SEO Benefit |
|-------------|-------------|
| **Technicians** | Find portable work passport, IRATA logging features via search |
| **Residents** | Discover building feedback portal when searching for building maintenance |
| **Property Managers** | Find vendor oversight tools when searching for property management software |
| **Building Managers** | Discover compliance tracking when searching for building safety software |
| **Employers** | Find rope access management software when searching for industry solutions |

---

## System Architecture

### Current State (Pre-Implementation)
```
┌─────────────────────────────────────────────────────────────────┐
│                     CURRENT FLOW (SPA)                          │
│                                                                  │
│  Crawler Request → Express → index.html → Empty <div id="root"> │
│                                    ↓                             │
│                            JavaScript loads                      │
│                                    ↓                             │
│                         Content renders (invisible to bots)      │
└─────────────────────────────────────────────────────────────────┘
```

### Target State (Post-Implementation)
```
┌─────────────────────────────────────────────────────────────────┐
│                     BUILD-TIME PRERENDERING                      │
│                                                                  │
│  Vite Build → Puppeteer Prerender → Static HTML per route       │
│       ↓              ↓                      ↓                    │
│   dist/assets   prerendered/*.html    sitemap.xml + robots.txt  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     RUNTIME BOT DETECTION                        │
│                                                                  │
│  Request → Bot UA Check → Bot? → Serve prerendered/*.html       │
│                 ↓                                                │
│            Human? → Serve normal SPA (index.html)               │
└─────────────────────────────────────────────────────────────────┘
```

### Component Overview
| Component | Location | Purpose |
|-----------|----------|---------|
| Prerender Script | `scripts/prerender.ts` | Puppeteer-based HTML generation |
| Bot Middleware | `server/middleware/botDetection.ts` | User-Agent detection for crawlers |
| Sitemap Generator | `scripts/generateSitemap.ts` | XML sitemap generation |
| Meta Tag Config | `shared/seoConfig.ts` | Centralized per-page SEO metadata |

---

## Target Pages Catalogue

### Tier 1: Core Landing Pages (MUST Prerender)
| Route | Title | Description | JSON-LD Schema |
|-------|-------|-------------|----------------|
| `/` | OnRopePro - Rope Access Management Software | The rope access industry's only purpose-built software for projects, payroll, safety, and scheduling | Organization, SoftwareApplication |
| `/resident` | Building Resident Portal - OnRopePro | Submit feedback, track maintenance progress, and communicate with your building's service vendors | WebApplication |
| `/employer` | Rope Access Company Software - OnRopePro | Manage projects, employees, safety compliance, and payroll for your rope access business | SoftwareApplication |
| `/property-manager` | Property Manager Portal - OnRopePro | Oversee vendor relationships, safety ratings, and building maintenance across your portfolio | WebApplication |
| `/technician` | Technician Portal - OnRopePro | Track certifications, log IRATA hours, and build your portable work passport | WebApplication |
| `/building-portal` | Building Manager Portal - OnRopePro | Monitor work progress, access anchor certificates, and view vendor compliance | WebApplication |
| `/pricing` | Pricing - OnRopePro | Subscription plans for rope access companies of all sizes | Product (with pricing) |

### Tier 2: Help Center (SHOULD Prerender)
| Route | Title Pattern | JSON-LD Schema |
|-------|---------------|----------------|
| `/help` | Help Center - OnRopePro | FAQPage |
| `/help/for-company-owners` | For Company Owners - Help - OnRopePro | FAQPage |
| `/help/for-technicians` | For Technicians - Help - OnRopePro | FAQPage |
| `/help/for-building-managers` | For Building Managers - Help - OnRopePro | FAQPage |
| `/help/for-property-managers` | For Property Managers - Help - OnRopePro | FAQPage |
| `/help/for-residents` | For Residents - Help - OnRopePro | FAQPage |
| `/help/modules/*` | {Module Title} - Help - OnRopePro | Article, HowTo |

### Tier 3: Module Landing Pages (COULD Prerender)
| Route Pattern | Count | Priority |
|---------------|-------|----------|
| `/modules/*` | 16 pages | Medium |
| `/changelog/*` | 10+ pages | Low |

### Excluded from Prerendering
- `/dashboard/*` - Authenticated, dynamic content
- `/superuser/*` - Admin-only, sensitive data
- `/technician-portal` - Authenticated
- `/resident-dashboard` - Authenticated
- `/pm-dashboard` - Authenticated
- All form pages (harness-inspection, toolbox-meeting, etc.)

---

## Dependency Integration

### 1. Internationalization (i18n)
**Current State**: 3 languages (English, French, Spanish)  
**Strategy**: Prerender English only initially; add language variants in v2.0

```
Phase 1 (v1.0): /resident → prerendered/resident.html (English)
Phase 2 (v2.0): /resident → prerendered/en/resident.html
                           prerendered/fr/resident.html
                           prerendered/es/resident.html
```

**Considerations**:
- Language detection happens client-side via `i18next-browser-languagedetector`
- Prerendered HTML should include `<link rel="alternate" hreflang="x">` tags
- Google will index English version; users get localized content after hydration

### 2. PWA Service Worker
**Risk**: Service Worker may cache prerendered HTML and serve stale content  
**Mitigation**:
```typescript
// vite.config.ts - PWA workbox config
workbox: {
  navigateFallbackDenylist: [
    /^\/prerendered\//,  // Exclude prerendered directory
  ],
  // Or use versioned filenames: resident.v1234.html
}
```

### 3. RAG/Help Content System
**Dependency**: Help article content comes from `server/help-content/*.md` files  
**Build Order**:
1. Vite builds frontend assets
2. RAG service indexes help content to database
3. Prerender script runs (fetches content via API)
4. Static HTML generated with current content

```bash
# Build script order
npm run build          # Vite build
npm run db:index       # RAG content indexing (if needed)
npm run prerender      # Generate static HTML
npm run sitemap        # Generate sitemap.xml
```

### 4. Google Tag Manager
**Requirement**: GTM must be present in prerendered HTML  
**Implementation**: GTM snippet already in `client/index.html` <head>; will be included in prerendered output

### 5. Authentication Boundaries
**Rule**: NEVER prerender authenticated pages  
**Detection**: Check route against public routes whitelist before prerendering

---

## Dependency Impact & Invariants

### Non-Negotiable Invariants

| Invariant | Rule | Impact if Violated |
|-----------|------|-------------------|
| **Public Routes Only** | NEVER prerender authenticated pages | Exposes user data in cached HTML, security breach |
| **Fresh Content** | Prerender MUST run after RAG index builds | Stale help content indexed by search engines |
| **Correct Namespace** | Sitemap MUST use `http://www.sitemaps.org/schemas/sitemap/0.9` | Google rejects invalid sitemap |
| **Bot Detection First** | Middleware MUST run before SPA fallback | Bots receive empty SPA shell, no indexing |
| **GTM Preserved** | Prerendered HTML MUST include GTM snippet | Analytics tracking breaks for bot visits |

### Upstream Dependencies
| System | Impact on SEO/Prerendering |
|--------|---------------------------|
| **RAG Service** | Help article content must be indexed before prerendering |
| **Vite Build** | Frontend assets must be built before prerender script runs |
| **Express Server** | Server must be running for Puppeteer to capture pages |
| **Object Storage** | OG images must be accessible for social media previews |

### Downstream Effects
| SEO Action | Affects |
|------------|---------|
| **Adding new public page** | Must update: PUBLIC_ROUTES, sitemap ROUTES, PRERENDERED_ROUTES, robots.txt |
| **Changing page title** | Must update: SEO_CONFIG, regenerate prerendered HTML |
| **Adding new language** | Must update: hreflang tags, potentially prerender per-language |
| **Changing domain** | Must update: canonical URLs, sitemap BASE_URL, robots.txt Sitemap line |

### Integration Points with Other Systems

```
┌─────────────────────────────────────────────────────────────────┐
│                     SEO SYSTEM DEPENDENCIES                      │
│                                                                  │
│  RAG Service ──────────► Prerender Script                        │
│  (help content)                ↓                                 │
│                         Bot Middleware ◄───── Express Routes     │
│                                ↓                                 │
│  PWA Service Worker ◄── Prerendered HTML ──► Search Engines      │
│  (must bypass)                 ↓                                 │
│                         sitemap.xml ────────► Search Console     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Change Impact Checklist
Before making ANY change to SEO/prerendering, verify:
- [ ] Change doesn't expose authenticated content
- [ ] RAG content is current (if help pages affected)
- [ ] All route lists are synchronized (4 locations)
- [ ] PWA service worker won't cache bot responses
- [ ] Canonical URLs remain consistent
- [ ] JSON-LD schemas validate correctly

---

## Technical Implementation

### 1. Prerender Script (`scripts/prerender.ts`)

```typescript
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

const PUBLIC_ROUTES = [
  '/',
  '/resident',
  '/employer',
  '/property-manager',
  '/technician',
  '/building-portal',
  '/pricing',
  '/get-license',
  '/help',
  '/help/for-company-owners',
  '/help/for-technicians',
  '/help/for-building-managers',
  '/help/for-property-managers',
  '/help/for-residents',
  // Add /help/modules/* dynamically from guideRegistry
];

// Use environment variable or default to local dev server
// IMPORTANT: The app must be running before prerendering
// Start with: npm run dev (in a separate terminal)
const BASE_URL = process.env.PRERENDER_URL || 'http://localhost:5000';
const OUTPUT_DIR = 'dist/prerendered';

async function prerender() {
  console.log(`Prerendering from: ${BASE_URL}`);
  console.log('Ensure the app is running before starting prerender!');
  
  const browser = await puppeteer.launch({ headless: 'new' });
  
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  
  for (const route of PUBLIC_ROUTES) {
    const page = await browser.newPage();
    
    // Wait for React to hydrate and content to render
    await page.goto(`${BASE_URL}${route}`, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for dynamic content (help articles, etc.)
    await page.waitForSelector('[data-prerender-ready]', { timeout: 10000 })
      .catch(() => console.log(`No prerender-ready marker on ${route}`));
    
    // Get rendered HTML
    const html = await page.content();
    
    // Save to file
    const filename = route === '/' ? 'index.html' : `${route.slice(1).replace(/\//g, '-')}.html`;
    await fs.writeFile(path.join(OUTPUT_DIR, filename), html);
    
    console.log(`Prerendered: ${route} → ${filename}`);
    await page.close();
  }
  
  await browser.close();
}

prerender();
```

### 2. Bot Detection Middleware (`server/middleware/botDetection.ts`)

```typescript
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

const BOT_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'slurp',           // Yahoo
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
  'applebot',
  'petalbot',
  'semrushbot',
  'ahrefsbot',
  'mj12bot',
  'dotbot',
  'rogerbot',
  'notebooklm',      // Google NotebookLM
  'chatgpt',         // OpenAI
  'claude',          // Anthropic
  'perplexity',
  'gptbot',
];

const PRERENDERED_ROUTES: Record<string, string> = {
  '/': 'index.html',
  '/resident': 'resident.html',
  '/employer': 'employer.html',
  '/property-manager': 'property-manager.html',
  '/technician': 'technician.html',
  '/building-portal': 'building-portal.html',
  '/pricing': 'pricing.html',
  '/help': 'help.html',
  // Add more as needed
};

export function botDetectionMiddleware(req: Request, res: Response, next: NextFunction) {
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  const isBot = BOT_USER_AGENTS.some(bot => userAgent.includes(bot));
  
  if (isBot && PRERENDERED_ROUTES[req.path]) {
    const prerenderedPath = path.join(
      process.cwd(), 
      'dist', 
      'prerendered', 
      PRERENDERED_ROUTES[req.path]
    );
    
    if (fs.existsSync(prerenderedPath)) {
      res.setHeader('X-Prerendered', 'true');
      res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour cache
      return res.sendFile(prerenderedPath);
    }
  }
  
  next();
}
```

### 3. SEO Configuration (`shared/seoConfig.ts`)

```typescript
export interface PageSEO {
  title: string;
  description: string;
  canonical: string;
  ogType: 'website' | 'article' | 'product';
  ogImage?: string;
  jsonLd: object;
}

export const SEO_CONFIG: Record<string, PageSEO> = {
  '/': {
    title: 'OnRopePro - Rope Access Management Software',
    description: 'The rope access industry\'s only purpose-built software. Manage projects, employees, safety compliance, payroll, and scheduling in one platform.',
    canonical: 'https://app.onrope.pro/',
    ogType: 'website',
    ogImage: '/og-image-home.png',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'OnRopePro',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
  },
  '/resident': {
    title: 'Building Resident Portal - OnRopePro',
    description: 'Submit feedback with photos, track maintenance progress in real-time, and communicate directly with your building\'s service vendors.',
    canonical: 'https://app.onrope.pro/resident',
    ogType: 'website',
    ogImage: '/og-image-resident.png',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'OnRopePro Resident Portal',
      applicationCategory: 'CommunicationApplication',
      browserRequirements: 'Requires JavaScript',
    },
  },
  // ... additional pages
};
```

### 4. Sitemap Generator (`scripts/generateSitemap.ts`)

```typescript
import fs from 'fs/promises';

const BASE_URL = 'https://app.onrope.pro';

const ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/resident', priority: 0.9, changefreq: 'monthly' },
  { path: '/employer', priority: 0.9, changefreq: 'monthly' },
  { path: '/property-manager', priority: 0.9, changefreq: 'monthly' },
  { path: '/technician', priority: 0.9, changefreq: 'monthly' },
  { path: '/building-portal', priority: 0.9, changefreq: 'monthly' },
  { path: '/pricing', priority: 0.8, changefreq: 'weekly' },
  { path: '/help', priority: 0.7, changefreq: 'weekly' },
  // Add help modules dynamically
];

async function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  
  const urls = ROUTES.map(route => `
  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  await fs.writeFile('dist/sitemap.xml', sitemap);
  console.log('Generated sitemap.xml');
}

generateSitemap();
```

### 5. robots.txt (`public/robots.txt`)

```
User-agent: *
Allow: /
Allow: /resident
Allow: /employer
Allow: /property-manager
Allow: /technician
Allow: /building-portal
Allow: /pricing
Allow: /help
Allow: /modules

Disallow: /dashboard
Disallow: /superuser
Disallow: /technician-portal
Disallow: /resident-dashboard
Disallow: /pm-dashboard
Disallow: /api/

Sitemap: https://app.onrope.pro/sitemap.xml
```

---

## Build Pipeline Integration

### Manual Build Commands
**Note**: Per project policy, `package.json` should not be edited without explicit approval. Run these commands manually or request approval to add them as scripts.

```bash
# Step 1: Build the frontend
npm run build

# Step 2: Start the built app for prerendering (in background or separate terminal)
# The prerender script needs a running server to capture rendered HTML
NODE_ENV=production npm run dev &
sleep 5  # Wait for server to start

# Step 3: Run prerender script
npx tsx scripts/prerender.ts

# Step 4: Generate sitemap
npx tsx scripts/generateSitemap.ts

# Step 5: Copy robots.txt to dist
cp public/robots.txt dist/

# Combined one-liner (after approval to add as npm script):
# npm run build && (npm run dev & sleep 5 && npx tsx scripts/prerender.ts && npx tsx scripts/generateSitemap.ts)
```

### If Adding Scripts Is Approved
Request user approval before adding these to `package.json`:
```json
{
  "scripts": {
    "prerender": "tsx scripts/prerender.ts",
    "sitemap": "tsx scripts/generateSitemap.ts",
    "build:seo": "npm run build && npm run prerender && npm run sitemap"
  }
}
```

### Deployment Checklist
1. [ ] Run `npm run build:seo` instead of `npm run build`
2. [ ] Verify `dist/prerendered/` contains HTML files
3. [ ] Verify `dist/sitemap.xml` exists
4. [ ] Verify `dist/robots.txt` exists
5. [ ] Test bot middleware with curl: `curl -A "Googlebot" https://app.onrope.pro/resident`

---

## Testing & Verification

### Manual Testing
```bash
# Test as Googlebot
curl -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
  https://app.onrope.pro/resident

# Should return prerendered HTML with full content
# Check for X-Prerendered: true header
```

### Lighthouse SEO Audit
1. Open Chrome DevTools → Lighthouse
2. Select "SEO" category
3. Run audit on each public page
4. Target: 90+ SEO score

### Google Search Console
1. Submit sitemap: `https://app.onrope.pro/sitemap.xml`
2. Use URL Inspection tool on each public page
3. Verify "Page is indexable" status
4. Check Mobile Usability report

### Rich Results Testing
1. Go to: https://search.google.com/test/rich-results
2. Enter each public URL
3. Verify JSON-LD schema is detected
4. Fix any validation errors

---

## Monitoring & Maintenance

### Key Metrics
| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Pages indexed (Search Console) | All public pages | < 80% indexed |
| Lighthouse SEO score | 90+ | < 80 |
| Prerender build time | < 5 minutes | > 10 minutes |
| Bot response time | < 500ms | > 2 seconds |

### When to Regenerate Prerendered Content
| Trigger | Action |
|---------|--------|
| New landing page added | Add to PUBLIC_ROUTES, re-run prerender |
| Help article content updated | Re-run prerender after RAG index |
| SEO metadata changed | Update seoConfig.ts, re-run prerender |
| Major UI redesign | Full prerender regeneration |
| New deployment | Automatic via build:seo script |

### Regular Maintenance
- **Weekly**: Check Search Console for crawl errors
- **Monthly**: Review Lighthouse scores, check for new pages to add
- **Quarterly**: Audit JSON-LD schemas, update structured data

---

## Troubleshooting Guide

### Issue: Pages Not Being Indexed
**Symptoms**: Search Console shows "Discovered - currently not indexed"  
**Diagnosis**:
1. Check robots.txt doesn't block the page
2. Verify prerendered HTML exists for the route
3. Test with URL Inspection tool
4. Check for noindex meta tags

**Solution**: Ensure route is in PUBLIC_ROUTES and prerender runs successfully

### Issue: Stale Content in Search Results
**Symptoms**: Google shows old page content  
**Diagnosis**:
1. Check prerendered file timestamp
2. Verify bot middleware is active
3. Check Cache-Control headers

**Solution**: Re-run prerender, request reindexing in Search Console

### Issue: Prerender Script Timeout
**Symptoms**: Puppeteer timeout errors during build  
**Diagnosis**:
1. Check if dev server is running during prerender
2. Verify network requests complete
3. Check for infinite loading states

**Solution**: Add `data-prerender-ready` markers to pages, increase timeout

### Issue: Service Worker Serving Stale HTML
**Symptoms**: Bots receive cached SPA shell instead of prerendered content  
**Diagnosis**:
1. Check workbox navigateFallbackDenylist
2. Verify bot detection runs before SW intercept

**Solution**: Update PWA config to exclude prerendered routes

---

## Related Documentation
- `1. GUIDING_PRINCIPLES.md` - Core development philosophy
- `2. INSTRUCTION_DOCUMENT_CREATION_GUIDE.md` - Documentation standards
- `3. DEPENDENCY-AWARENESS-INSTRUCTIONS.md` - System integration patterns
- `help-content-system.md` - RAG content pipeline

---

## Version History
- **v1.0** (December 20, 2024): Initial documentation covering architecture, target pages, technical implementation, and maintenance workflows

---

## Implementation Checklist

### Phase 1: Foundation (Week 1)
- [ ] Create `robots.txt` in public folder
- [ ] Add per-page meta tags to landing pages
- [ ] Create `shared/seoConfig.ts` with centralized metadata
- [ ] Add `data-prerender-ready` markers to public pages

### Phase 2: Prerendering (Week 2)
- [ ] Install Puppeteer: `npm install puppeteer`
- [ ] Create `scripts/prerender.ts`
- [ ] Create `scripts/generateSitemap.ts`
- [ ] Add build:seo script to package.json
- [ ] Test prerender locally

### Phase 3: Bot Detection (Week 3)
- [ ] Create `server/middleware/botDetection.ts`
- [ ] Integrate middleware into Express app
- [ ] Test with curl and various bot User-Agents
- [ ] Verify human users still get SPA

### Phase 4: Launch & Monitor (Week 4)
- [ ] Deploy with prerendered content
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Monitor indexing progress
- [ ] Run Lighthouse audits

---

## Notes for Future Versions

### v2.0 Planned Features
- Multi-language prerendering (en, fr, es)
- Dynamic help module prerendering from guideRegistry
- Automated prerender on content changes via webhook
- A/B testing of meta descriptions

### Considerations for Scale
- If page count exceeds 100, consider incremental prerendering
- If build time exceeds 10 minutes, parallelize Puppeteer instances
- If traffic increases, add CDN layer for prerendered content
