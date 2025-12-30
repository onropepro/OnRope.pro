# Multi-Language System Instructions v1.0
**System**: Rope Access Management System
**Domain**: Internationalization (i18n) & Localization
**Version**: 1.0
**Last Updated**: December 23, 2024
**Status**: PRODUCTION-READY
**Safety Critical**: No - Language display does not affect worker safety operations

## Purpose and Goal

### Primary Objective
Provide a unified, comprehensive multi-language system that enables all users—regardless of their native language—to use the platform in English, French, or Spanish with consistent translations across every page, component, and module.

### Key Goals
- **Accessibility**: Remove language barriers for international teams (Canada, US, Latin America)
- **Consistency**: Unified translation system that works automatically for all pages
- **User Experience**: Seamless language switching with persistent preferences
- **Maintainability**: Single source of truth for all translations with easy addition of new languages
- **Field Worker Support**: Mobile-first language switching for technicians in the field

## System Architecture

### Component Overview
```
┌─────────────────────────────────────────────────────────────────┐
│                    Multi-Language System                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │   en.json    │    │   fr.json    │    │   es.json    │     │
│  │  (English)   │    │   (French)   │    │  (Spanish)   │     │
│  │  ~13,400 ln  │    │  ~14,300 ln  │    │  ~13,600 ln  │     │
│  └──────────────┘    └──────────────┘    └──────────────┘     │
│          │                  │                   │               │
│          └──────────────────┼───────────────────┘               │
│                             │                                   │
│                    ┌────────▼────────┐                         │
│                    │  i18n/index.ts  │                         │
│                    │   (i18next)     │                         │
│                    └────────┬────────┘                         │
│                             │                                   │
│         ┌───────────────────┼───────────────────┐              │
│         │                   │                   │               │
│  ┌──────▼──────┐    ┌──────▼──────┐    ┌──────▼──────┐       │
│  │   config.ts  │    │use-language │    │   Header    │       │
│  │  (Settings)  │    │   (Hook)    │    │  Selector   │       │
│  └─────────────┘    └──────┬──────┘    └─────────────┘       │
│                             │                                   │
│                    ┌────────▼────────┐                         │
│                    │   Database      │                         │
│                    │  (user pref)    │                         │
│                    └─────────────────┘                         │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow
1. **Detection Stage**: i18next detects language from localStorage → browser settings → default (en)
2. **User Preference Stage**: If user is logged in, their saved preference overrides detection
3. **Translation Stage**: `t('key')` function retrieves translation from current language file
4. **Fallback Stage**: If key missing in current language, falls back to English
5. **Persistence Stage**: Language preference saved to localStorage + database (if authenticated)

### Integration Points
- **Upstream Systems**: User authentication (preferredLanguage field in users table)
- **Downstream Systems**: All UI components, landing pages, help content, forms
- **Parallel Systems**: Date/time formatting (date-fns-tz), timezone handling

## Dependency Impact & Invariants

### Non-negotiable Invariants
1. **English Fallback**: If any translation key is missing, English MUST display
   - Impact if violated: Blank text or broken UI
   - Enforcement: `fallbackLng: 'en'` in i18next config

2. **Translation Key Consistency**: All three language files must have identical key structures
   - Impact if violated: Mixed language display, untranslated content
   - Enforcement: Manual verification during translation updates

3. **User Preference Persistence**: Language choice must persist across sessions
   - Impact if violated: Poor user experience, frustration
   - Enforcement: localStorage + database sync via useLanguage hook

### System Dependencies
- **User Authentication**: Stores preferredLanguage in users table
- **Date Formatting**: Uses locale-aware formatting with selected language
- **Help Content**: RAG knowledge base currently English-only (planned for translation)

## Technical Implementation

### Core Files Structure
```
client/src/i18n/
├── config.ts           # Language configuration and utilities
├── index.ts            # i18next initialization
└── locales/
    ├── en.json         # English translations (~13,433 lines)
    ├── fr.json         # French translations (~14,301 lines)
    └── es.json         # Spanish translations (~13,639 lines)
```

### Translation Configuration (config.ts)
```typescript
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
];

export const DEFAULT_LANGUAGE = 'en';
export const FALLBACK_LANGUAGE = 'en';

export function normalizeLanguageCode(code: string): string {
  if (!code) return DEFAULT_LANGUAGE;
  const normalizedCode = code.split('-')[0].toLowerCase();
  return isLanguageSupported(normalizedCode) ? normalizedCode : DEFAULT_LANGUAGE;
}
```

### i18next Initialization (index.ts)
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es }
    },
    fallbackLng: FALLBACK_LANGUAGE,
    supportedLngs: getSupportedLanguageCodes(),
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage']
    },
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed'
    }
  });
```

### Language Hook (use-language.ts)
```typescript
export function useLanguage() {
  const { i18n, t } = useTranslation();
  
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
    retry: false,
    staleTime: Infinity,
  });

  // Sync user preference with i18n
  useEffect(() => {
    if (user?.preferredLanguage && user.preferredLanguage !== i18n.language) {
      i18n.changeLanguage(user.preferredLanguage);
    }
  }, [user?.preferredLanguage, i18n]);

  const changeLanguage = useCallback(async (language: string) => {
    const normalizedLang = normalizeLanguageCode(language);
    i18n.changeLanguage(normalizedLang);
    localStorage.setItem('i18nextLng', normalizedLang);
    
    // Persist to database if authenticated
    if (user?.id) {
      await updateLanguageMutation.mutateAsync(normalizedLang);
    }
  }, [i18n, user?.id, updateLanguageMutation]);

  return {
    t,
    i18n,
    currentLanguage: normalizeLanguageCode(i18n.language),
    changeLanguage,
    isUpdating: updateLanguageMutation.isPending,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}
```

### API Endpoint
- `PATCH /api/user/language` - Updates user's preferred language in database

### Database Schema
```typescript
// In shared/schema.ts - users table
preferredLanguage: text("preferred_language").default("en"),
```

## Translation File Structure

### Root-Level Organization
```json
{
  "nav": { /* Navigation labels */ },
  "common": { /* Buttons, labels, general UI */ },
  "auth": { /* Login, registration */ },
  "dashboard": { /* Dashboard-specific */ },
  "modules": {
    "quoting": { /* Quoting & Sales module landing */ },
    "scheduling": { /* Scheduling module landing */ },
    "safety": { /* Safety module landing */ },
    // ... 17 module landing pages
  },
  "help": { /* Help center content */ },
  "forms": { /* Form labels and validation */ },
  "errors": { /* Error messages */ }
}
```

### Module Landing Page Pattern
Each module has comprehensive translations:
```json
{
  "modules": {
    "quoting": {
      "hero": {
        "badge": "Quoting & Sales Pipeline Module",
        "title": "Stop Losing Money on",
        "titleHighlight": "Quoting Errors",
        "subtitle": "OnRopePro's quoting system uses...",
        "cta": "Start Your 60-Day Trial",
        "ctaSecondary": "Sign In"
      },
      "stats": { /* Statistics section */ },
      "problem": { /* Problem description */ },
      "features": { /* Feature descriptions */ },
      "comparison": { /* Before/After comparisons */ },
      "testimonials": { /* User testimonials */ }
    }
  }
}
```

## Adding New Translations

### For New UI Text
1. Add key to `en.json` first (source of truth)
2. Add same key structure to `fr.json` with French translation
3. Add same key structure to `es.json` with Spanish translation
4. Use in component: `{t('path.to.key', 'Fallback text')}`

### For New Pages
1. Create translation namespace under appropriate section
2. Use consistent key naming: `page.section.element`
3. Include all text: headings, paragraphs, buttons, labels
4. Test with all three languages

### For New Languages
1. Add language definition to `config.ts` SUPPORTED_LANGUAGES array
2. Create new locale file: `client/src/i18n/locales/[code].json`
3. Import and add to resources in `index.ts`
4. Translate all ~13,000+ keys

## Common Usage Patterns

### Basic Translation
```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('page.title', 'Default Title')}</h1>;
}
```

### With Language Hook
```tsx
import { useLanguage } from '@/hooks/use-language';

function LanguageSelector() {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  
  return (
    <select value={currentLanguage} onChange={e => changeLanguage(e.target.value)}>
      {supportedLanguages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.nativeName}
        </option>
      ))}
    </select>
  );
}
```

### Interpolation
```tsx
// Translation: "Welcome, {{name}}!"
{t('greeting', { name: user.firstName })}
```

### Pluralization
```tsx
// Translation: "{{count}} item" / "{{count}} items"
{t('items', { count: itemCount })}
```

## Multi-Tenant Considerations

### Data Isolation
- Language preference stored per-user, not per-company
- Each user can have different language preference within same company
- No company-level language enforcement

### Query Patterns
Language preference is a user-level setting:
```typescript
// Retrieve user's language preference
const user = await db.query.users.findFirst({
  where: eq(users.id, userId)
});
const lang = user?.preferredLanguage || 'en';
```

## Field Worker Experience

### Mobile Considerations
- Language selector accessible in header/menu on all screen sizes
- Native language names displayed (Français, Español)
- Instant switching without page reload
- Offline: Language cached in localStorage

### Common Workflows
1. **First Visit**: Browser language detected → appropriate translations loaded
2. **Language Change**: Click language selector → instant UI update → preference saved
3. **Login**: User preference loaded from database → overrides localStorage

## Error Handling & Recovery

### Common Errors
| Error | Cause | User Message | Recovery Action |
|-------|-------|--------------|-----------------|
| Missing translation | Key not in locale file | Shows English fallback | Add translation to locale file |
| Invalid language code | Corrupted localStorage | Defaults to English | Auto-normalized by config |
| API save failure | Network issue | Silent failure | Retry on next change |

### Graceful Degradation
- **Missing Translation**: English fallback displayed automatically
- **No Internet**: localStorage preference persists
- **New Language Keys**: Fallback text in t() function displays

## Testing Requirements

### Unit Tests
```typescript
describe('Language System', () => {
  test('should normalize language codes', () => {
    expect(normalizeLanguageCode('en-US')).toBe('en');
    expect(normalizeLanguageCode('fr-CA')).toBe('fr');
    expect(normalizeLanguageCode('invalid')).toBe('en');
  });
  
  test('should identify supported languages', () => {
    expect(isLanguageSupported('en')).toBe(true);
    expect(isLanguageSupported('fr')).toBe(true);
    expect(isLanguageSupported('es')).toBe(true);
    expect(isLanguageSupported('de')).toBe(false);
  });
});
```

### Integration Tests
- **Language Switching**: Verify all visible text updates on language change
- **Persistence**: Verify language persists after page reload
- **User Sync**: Verify logged-in user preference saves to database
- **Fallback**: Verify missing keys show English fallback

### Manual Testing Checklist
- [ ] Language selector visible in header on all pages
- [ ] All 17 module landing pages display in French
- [ ] All 17 module landing pages display in Spanish
- [ ] Language persists after browser refresh
- [ ] Language syncs when user logs in
- [ ] Dates format according to locale

## Monitoring & Maintenance

### Key Metrics
- **Translation Coverage**: All keys present in all 3 locale files
- **File Size Parity**: Locale files should have similar line counts
- **Missing Keys**: Console warnings for untranslated keys

### Regular Maintenance
- **Weekly**: Review console for missing translation warnings
- **Monthly**: Verify new features have translations in all languages
- **Quarterly**: Audit translation quality with native speakers

### Known Issues
1. **Duplicate JSON Keys**: Translation files historically have duplicate key sections that need consolidation
2. **RAG Content**: Help center RAG content is English-only
3. **User-Generated Content**: Comments, notes, project names remain in original language

## Troubleshooting Guide

### Issue: Page Shows Mixed Languages
**Symptoms**: Some text in English, some in French/Spanish
**Diagnosis Steps**:
1. Check browser console for missing translation warnings
2. Verify translation key exists in target locale file
3. Check for duplicate keys that may override correct translations

**Solution**: Add missing translations or remove duplicate JSON keys

**Prevention**: Use JSON validators to catch duplicate keys

### Issue: Language Doesn't Persist
**Symptoms**: Language resets after page reload
**Diagnosis Steps**:
1. Check localStorage for 'i18nextLng' key
2. Verify user is logged in (preference saved to DB)
3. Check network tab for failed PATCH /api/user/language

**Solution**: Clear localStorage and re-select language, verify API is responding

### Issue: Language Selector Not Visible
**Symptoms**: No way to change language on page
**Diagnosis Steps**:
1. Check if PublicHeader or authenticated header is rendering
2. Verify language selector component is included in header

**Solution**: Ensure page uses correct header component with language selector

## Related Documentation
- `1. GUIDING_PRINCIPLES.md` - Core philosophy
- `LanguageGuide.tsx` - User-facing help documentation
- `help-content-system.md` - RAG knowledge base (English-only)

## Module Landing Pages Translation Status

All 17 module landing pages have translations:

| Module | Path | EN | FR | ES |
|--------|------|----|----|---- |
| Quoting & Sales | /modules/quoting-sales-pipeline | ✅ | ✅ | ✅ |
| Scheduling | /modules/scheduling-calendar | ✅ | ✅ | ✅ |
| Work Sessions | /modules/work-session-tracking | ✅ | ✅ | ✅ |
| IRATA Logging | /modules/irata-task-logging | ✅ | ✅ | ✅ |
| Safety Compliance | /modules/safety-compliance | ✅ | ✅ | ✅ |
| Gear Inventory | /modules/gear-inventory | ✅ | ✅ | ✅ |
| Document Management | /modules/document-management | ✅ | ✅ | ✅ |
| Employee Management | /modules/employee-management | ✅ | ✅ | ✅ |
| User Access Control | /modules/user-access-control | ✅ | ✅ | ✅ |
| White Label Branding | /modules/white-label-branding | ✅ | ✅ | ✅ |
| Payroll & Financial | /modules/payroll-financial | ✅ | ✅ | ✅ |
| CRM | /modules/crm | ✅ | ✅ | ✅ |
| CSR Portal | /modules/csr | ✅ | ✅ | ✅ |
| Resident Portal | /modules/resident-portal | ✅ | ✅ | ✅ |
| Property Manager | /modules/property-manager-interface | ✅ | ✅ | ✅ |
| Technician Passport | /modules/technician-passport | ✅ | ✅ | ✅ |
| Job Board | /modules/employer-job-board | ✅ | ✅ | ✅ |

## Dashboard and Sidebar Translation Updates (December 30, 2024)

**Recently Added Translation Keys:**
- `dashboard.sidebar.*` - Menu item translations (dashboard, work dashboard, weather, off-site, certifications, inspections, gear management, training, performance, my passport, settings, help center, customize)
- `dashboard.categories.*` - Category header translations (OPERATIONS, TEAM, EQUIPMENT, SAFETY, FINANCES/CLIENTS, ANALYTICS, COMMUNICATION)
- `dashboard.cards.*` - Card label/description translations for Job Board, Pay Period, Today's Hours, New Feedback, Active Projects, Today's Schedule, Safety Ratings

**Translation Coverage**: All keys implemented in English (en.json), French (fr.json), and Spanish (es.json) with consistent key structure across all three language files.

**Adherence to Guidelines**: 
- ✅ Keys added to en.json first (source of truth)
- ✅ Identical key structure replicated to fr.json and es.json
- ✅ Follows `path.to.key` naming convention
- ✅ Used by DashboardSidebar.tsx and related components via `t('key', 'fallback')`

## Version History
- **v1.1** (December 30, 2024): Dashboard and Sidebar Translation Updates
  - Added dashboard.sidebar menu translations (12 items)
  - Added dashboard.categories section headers (7 items)
  - Added dashboard.cards descriptions for key cards
  - Verified consistency across all three language files (EN, FR, ES)
  - Ensured compliance with translation key naming conventions

- **v1.0** (December 23, 2024): Initial comprehensive documentation
  - Documented i18next configuration and setup
  - Added translation file structure details
  - Included all module landing page translation status
  - Created troubleshooting guide for common issues
