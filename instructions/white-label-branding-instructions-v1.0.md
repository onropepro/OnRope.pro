# White Label Branding System Instructions v1.0
**System**: Rope Access Management System (OnRopePro)  
**Domain**: Subscription Management / Branding  
**Version**: 1.0  
**Last Updated**: December 20, 2025  
**Status**: PRODUCTION-READY ✅  
**Safety Critical**: No - Branding does not affect worker safety operations

---

## Purpose and Goal

### Primary Objective
Enable rope access companies to customize the OnRopePro platform with their company logo and brand colors, transforming "third-party software" into what appears to be proprietary internal systems. This increases perceived sophistication and justifies premium contractor pricing.

### Key Goals
- **Professionalism**: Present polished, branded interface to employees and clients
- **Client Perception**: Branded documents (quotes, safety reports) build trust
- **Contract Competitiveness**: Companies with branded systems report 15-25% higher contract win rates
- **Vendor Lock-in**: Custom branding creates switching costs for property managers familiar with the interface
- **Revenue Generation**: $49/month add-on creates recurring revenue stream

### Business Context
White label branding is a subscription-gated add-on available to all paying customers. The feature:
- Costs $49/month (USD/CAD same pricing)
- Activates immediately upon subscription
- Reverts automatically when subscription expires
- Preserves branding configuration in database even when inactive (ready for reactivation)

---

## System Architecture

### Component Overview

```
┌─────────────────────────── WHITE LABEL BRANDING FLOW ─────────────────────────┐
│                                                                                │
│  Stripe Subscription → Webhook → DB Flag → CSS Variables → Global Theming     │
│         ↓                  ↓         ↓            ↓              ↓             │
│  $49/mo Add-on → whitelabelBrandingActive → BrandingProvider → UI Components  │
│         ↓                  ↓         ↓            ↓              ↓             │
│  Trial Pending → Post-Trial Billing → Logo Upload → PDF Branding → PWA Icons  │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow
1. **Input Stage**: Company owner clicks "Add White Label Branding" in Subscription tab
2. **Payment Stage**: Stripe processes $49/mo add-on (or free during trial with pending billing)
3. **Webhook Stage**: Stripe webhook updates `whitelabelBrandingActive = true` in database
4. **Configuration Stage**: Owner uploads logo and selects 2 brand colors in Profile → Branding tab
5. **Propagation Stage**: `BrandingProvider` in App.tsx fetches branding and injects CSS variables
6. **Output Stage**: All authenticated pages, PDF exports, and PWA manifests display company branding

### Integration Points
- **Upstream Systems**: Stripe subscription management, Object Storage (logo files)
- **Downstream Systems**: All authenticated UI components, PDF generation, PWA manifest
- **Parallel Systems**: Subscription tier management, seat management

---

## Dependency Impact & Invariants

### Non-Negotiable Invariants

1. **Subscription Gating**: Branding MUST only display when `whitelabelBrandingActive === true`
   - Impact if violated: Companies get premium features without paying
   - Enforcement mechanism: All branding fetch endpoints check subscription status before returning data

2. **Company Isolation**: Each company's branding MUST be scoped to their companyId
   - Impact if violated: Cross-company branding leakage, privacy breach
   - Enforcement mechanism: API endpoints filter by authenticated user's companyId

3. **Automatic Reversion**: When subscription expires, branding MUST automatically stop displaying
   - Impact if violated: Companies retain premium features after cancellation
   - Enforcement mechanism: Stripe webhook sets `whitelabelBrandingActive = false` on cancellation

4. **Two-Color Limit**: System MUST only accept exactly 2 brand colors
   - Impact if violated: UI becomes unpredictable, difficult to maintain visual consistency
   - Enforcement mechanism: Frontend UI limits color selection; backend validates array length

### System Dependencies

| Dependency | Relationship | Impact |
|------------|--------------|--------|
| Stripe Subscription | Controls activation flag | Webhook must update DB atomically |
| Object Storage | Stores logo files | Logo URLs reference storage bucket |
| PDF Generation | Consumes branding config | `pdfBranding.ts` reads colors/logo |
| BrandingProvider | Injects CSS variables | All UI components inherit theming |
| PWA Manifest | Dynamic icon generation | `/manifest.json` reads branding |
| Resident Portal | Displays company branding | Residents see linked company's brand |

---

## Technical Implementation

### Database Schema

Located in `shared/schema.ts`:

```typescript
// Users table (company role) - Branding fields (lines 181-213 in schema.ts)
export const users = pgTable("users", {
  // ... other fields ...
  
  // White Label Branding - Subscription flag
  whitelabelBrandingActive: boolean("whitelabel_branding_active").default(false),
  
  // Whether white-label was activated during trial and needs to be billed when trial ends
  whitelabelPendingBilling: boolean("whitelabel_pending_billing").default(false),
  
  // White Label Branding - Configuration
  brandingLogoUrl: text("branding_logo_url"),           // Logo URL from Object Storage
  brandingColors: text("branding_colors").array().default(sql`ARRAY[]::text[]`), // Array of hex codes
  pwaAppIconUrl: text("pwa_app_icon_url"),              // Custom PWA app icon URL (512x512 for installed app)
});
```

**Field Descriptions:**
- `whitelabelBrandingActive`: Master switch - when `false`, all branding reverts to OnRopePro defaults
- `brandingLogoUrl`: Full URL to logo image in Object Storage (PNG/JPG)
- `brandingColors`: Array of exactly 2 hex color strings (e.g., `["#3B82F6", "#10B981"]`)
- `whitelabelPendingBilling`: Flag for trial users who activated branding - billing starts after trial ends
- `pwaAppIconUrl`: Separate URL for PWA/mobile app icon (optional, for device home screen icons)

### API Endpoints

Located in `server/routes.ts`:

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/stripe/add-branding` | POST | requireAuth | Add white label add-on to subscription |
| `/api/company/branding/logo` | POST | requireAuth, requireRole("company") | Upload company logo (multipart form) |
| `/api/company/branding` | PATCH | requireAuth, requireRole("company") | Update brand colors |
| `/api/company/:companyId/branding` | GET | None (public) | Fetch branding for display (subscription-gated) |
| `/api/company/branding/pwa-icon` | POST | requireAuth, requireRole("company") | Upload PWA app icon |

**Note:** There is no dedicated cancel-branding endpoint. Branding cancellation is handled through the standard Stripe customer portal subscription management flow.

### Add Branding Endpoint

```typescript
// POST /api/stripe/add-branding
app.post("/api/stripe/add-branding", requireAuth, async (req: Request, res: Response) => {
  const user = req.user as any;
  
  // Verify company role
  if (user.role !== 'company') {
    return res.status(403).json({ message: "Only company accounts can add branding" });
  }
  
  // Check if trialing - branding is free during trial, billed after
  const isTrialing = user.subscriptionStatus === 'trialing';
  
  if (isTrialing) {
    // Set pending billing flag - Stripe webhook adds add-on when trial ends
    await storage.updateUser(user.id, {
      whitelabelBrandingActive: true,
      whitelabelPendingBilling: true,
    });
    return res.json({
      message: "White label branding unlocked! Free during your trial period.",
      brandingActive: true,
    });
  }
  
  // Add to active subscription via Stripe
  const priceId = user.stripeCurrency === 'cad' 
    ? ADDON_CONFIG.white_label.priceIdCAD 
    : ADDON_CONFIG.white_label.priceIdUSD;
    
  await stripe.subscriptionItems.create({
    subscription: user.stripeSubscriptionId,
    price: priceId,
  });
  
  // Webhook will set whitelabelBrandingActive = true
  res.json({ message: "White label branding added successfully" });
});
```

### Public Branding Fetch Endpoint

```typescript
// GET /api/company/:companyId/branding (Public - used by residents, employees)
app.get("/api/company/:companyId/branding", async (req: Request, res: Response) => {
  const { companyId } = req.params;
  
  const [company] = await db.select().from(users).where(eq(users.id, companyId));
  
  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }
  
  // CRITICAL: Only return branding if subscription is active
  res.json({
    logoUrl: company.whitelabelBrandingActive ? company.brandingLogoUrl : null,
    colors: company.whitelabelBrandingActive ? (company.brandingColors || []) : [],
    subscriptionActive: company.whitelabelBrandingActive || false,
  });
});
```

### Stripe Configuration

Located in `shared/stripe-config.ts`:

```typescript
export const ADDON_CONFIG = {
  white_label: {
    name: 'White Label Branding',
    priceUSD: 49,
    priceCAD: 49,  // Same price, Stripe handles currency
    priceIdUSD: 'price_1SWCTnBzDsOltscrD2qcZ47m',
    priceIdCAD: 'price_1SZG7KBzDsOltscrs9vnr0v2',
    type: 'recurring' as const,
  },
} as const;
```

### Stripe Webhook Handling

Located in `server/stripe-service.ts`:

```typescript
// In customer.subscription.updated webhook handler
let whitelabelBrandingActive = false;

for (const item of subscription.items.data) {
  const priceId = item.price.id;
  
  // Check if this is white label branding add-on
  if (priceId === ADDON_CONFIG.white_label.priceIdUSD || 
      priceId === ADDON_CONFIG.white_label.priceIdCAD) {
    whitelabelBrandingActive = true;
  }
}

// Handle trial → active transition with pending white label
if (subscription.status === 'active' && previousStatus === 'trialing') {
  if (user?.whitelabelPendingBilling && !whitelabelBrandingActive) {
    // Add white label to Stripe subscription now that billing is active
    const priceId = user.stripeCurrency === 'cad'
      ? ADDON_CONFIG.white_label.priceIdCAD 
      : ADDON_CONFIG.white_label.priceIdUSD;
      
    await stripe.subscriptionItems.create({
      subscription: subscription.id,
      price: priceId,
    });
    
    await db.update(users).set({
      whitelabelPendingBilling: false,
    }).where(eq(users.id, userId));
    
    whitelabelBrandingActive = true;
  }
}

// Update database with branding status
await db.update(users).set({
  whitelabelBrandingActive,
}).where(eq(users.id, userId));
```

---

## Frontend Architecture

### BrandingProvider Component

Located in `client/src/App.tsx` (lines 437-697):

> **Note**: This is a simplified/annotated version showing key patterns. For the complete implementation including all CSS variable injections (primary-foreground, sidebar-foreground, sidebar-ring, tertiary/quaternary colors, etc.), refer to the actual source file at `client/src/App.tsx`.

```typescript
// Branding Context - share brand colors with all components
interface BrandingContextType {
  brandColors: string[];  // Array of hex color codes (up to 5, UI limits to 2)
  brandingActive: boolean; // True when authenticated AND has colors configured
}

export const BrandingContext = createContext<BrandingContextType>({
  brandColors: [],
  brandingActive: false,
});

function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();  // Wouter hook returns [location, setLocation]
  const { data: userData } = useQuery<{ user: any }>({ queryKey: ['/api/user'] });
  
  // NEVER apply branding on public pages (login, register, landing, etc.)
  const isPublicPage = location === '/' || location === '/login' || location === '/register' || 
    location === '/link' || location === '/get-license' || location.startsWith('/complete-registration');
  const isAuthenticated = !!userData?.user && !isPublicPage;
  
  // Determine company ID to fetch branding for
  const companyIdForBranding = userData?.user?.role === 'company' 
    ? userData.user.id 
    : userData?.user?.companyId;
    
  // Fetch company branding for white label support
  const { data: brandingData } = useQuery({
    queryKey: ["/api/company", companyIdForBranding, "branding"],
    queryFn: async () => {
      if (!companyIdForBranding) return null;
      const response = await fetch(`/api/company/${companyIdForBranding}/branding`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`Failed to fetch branding: ${response.status}`);
      return response.json();
    },
    enabled: isAuthenticated && !!companyIdForBranding 
      && userData?.user?.role !== 'superuser' 
      && userData?.user?.role !== 'property_manager',
  });
  
  const branding = brandingData || {};
  const brandColors = (branding.subscriptionActive && branding.colors) ? branding.colors : [];
  
  // CSS variables to clean up (matches variables set below - see full list in App.tsx)
  const brandCssVars = [
    '--brand-primary', '--brand-primary-tint', '--brand-primary-text',
    '--brand-secondary', '--brand-secondary-hsl',
    '--primary', '--ring', '--sidebar-primary',
    '--chart-1', '--chart-2',
    '--card', '--sidebar', '--muted'
    // Note: Full implementation also includes --primary-foreground, --sidebar-foreground,
    // --sidebar-ring, tertiary/quaternary colors - see App.tsx for complete list
  ];
  
  // CSS Variable Injection Effect with cleanup
  useEffect(() => {
    if (isAuthenticated && brandColors.length > 0) {
      const root = document.documentElement;
      const primaryBrandColor = brandColors[0];
      
      // Convert hex to HSL for Tailwind compatibility
      const hslColor = hexToHSL(primaryBrandColor);
      
      // Inject CSS variables
      root.style.setProperty('--brand-primary', primaryBrandColor);
      root.style.setProperty('--brand-primary-tint', createLightTint(primaryBrandColor, 97));
      root.style.setProperty('--brand-primary-text', getReadableForeground(primaryBrandColor));
      root.style.setProperty('--primary', hslColor);
      root.style.setProperty('--ring', hslColor);
      root.style.setProperty('--sidebar-primary', hslColor);
      root.style.setProperty('--chart-1', hslColor);
      
      // Card/sidebar/muted backgrounds (light tints of primary)
      root.style.setProperty('--card', createLightTint(primaryBrandColor, 99));
      root.style.setProperty('--sidebar', createLightTint(primaryBrandColor, 98));
      root.style.setProperty('--muted', createLightTint(primaryBrandColor, 96));
      
      // Secondary color (if provided)
      if (brandColors.length > 1) {
        const secondaryBrandColor = brandColors[1];
        const hslSecondary = hexToHSL(secondaryBrandColor);
        root.style.setProperty('--brand-secondary', secondaryBrandColor);
        root.style.setProperty('--brand-secondary-hsl', hslSecondary);
        root.style.setProperty('--chart-2', hslSecondary);
      }
    } else {
      // Remove all brand CSS variables when branding inactive
      brandCssVars.forEach(v => document.documentElement.style.removeProperty(v));
    }
    
    // Cleanup on unmount or when dependencies change
    return () => {
      brandCssVars.forEach(v => document.documentElement.style.removeProperty(v));
    };
  }, [isAuthenticated, brandColors]);
  
  return (
    <BrandingContext.Provider value={{ brandColors: brandColors, brandingActive: isAuthenticated && brandColors.length > 0 }}>
      {children}
    </BrandingContext.Provider>
  );
}
```

**Helper Functions (defined in App.tsx):**
- `hexToHSL(hex)`: Converts #RRGGBB to "H S% L%" format for Tailwind CSS variables
- `createLightTint(hex, lightness)`: Creates a light tint of the color for backgrounds (preserves hue, reduces saturation)
- `getReadableForeground(hex)`: Creates a dark version of the hue for readable text on light tint backgrounds

### CSS Variables Injected

The system injects these CSS custom properties when branding is active:

**Primary Color Variables (always set when branding active):**
| Variable | Purpose | Source |
|----------|---------|--------|
| `--brand-primary` | Primary color (hex) | Direct from brandColors[0] |
| `--brand-primary-tint` | Light background tint | `createLightTint(primary, 97)` |
| `--brand-primary-text` | Readable text on primary | `getReadableForeground(primary)` |
| `--primary` | Tailwind primary (HSL) | `hexToHSL(primary)` |
| `--primary-foreground` | Contrasting text | Auto: white if L<50%, dark otherwise |
| `--ring` | Focus ring color | Same as `--primary` |
| `--sidebar-primary` | Sidebar accent | Same as `--primary` |
| `--sidebar-primary-foreground` | Sidebar accent text | Same as `--primary-foreground` |
| `--sidebar-ring` | Sidebar focus ring | Same as `--primary` |
| `--chart-1` | First chart color | Same as `--primary` |
| `--card` | Card background | `createLightTint(primary, 99)` |
| `--sidebar` | Sidebar background | `createLightTint(primary, 98)` |
| `--muted` | Muted background | `createLightTint(primary, 96)` |

**Secondary Color Variables (if brandColors[1] exists):**
| Variable | Purpose | Source |
|----------|---------|--------|
| `--brand-secondary` | Secondary color (hex) | Direct from brandColors[1] |
| `--brand-secondary-hsl` | Secondary (HSL) | `hexToHSL(secondary)` |
| `--brand-secondary-tint` | Light background tint | `createLightTint(secondary, 96)` |
| `--brand-secondary-text` | Readable text on secondary | `getReadableForeground(secondary)` |
| `--chart-2` | Second chart color | Same as `--brand-secondary-hsl` |

**Note**: The code supports `--brand-tertiary-*`, `--brand-quaternary-*`, and `--chart-3/4/5` for up to 5 colors, but the Profile UI intentionally limits selection to 2 colors to maintain visual consistency and prevent garish combinations.

### Profile Branding Tab

Located in `client/src/pages/Profile.tsx`:

The Branding tab provides:
1. **Subscription status check** - Shows "Subscribe for $49/mo" if not active
2. **Logo upload** - File input for PNG/JPG, preview of current logo
3. **Color picker** - Two color inputs with hex code support
4. **Live preview** - Shows how branding appears to residents
5. **PWA icon upload** - Separate upload for mobile app icon

### Components That Consume BrandingContext

The following components import and use `BrandingContext` from App.tsx:

| Component | File | Usage |
|-----------|------|-------|
| Dashboard | `Dashboard.tsx` | Chart colors, UI accents |
| Schedule | `Schedule.tsx` | Calendar event colors |
| TechnicianSchedule | `TechnicianSchedule.tsx` | Technician calendar view |
| HoursAnalytics | `HoursAnalytics.tsx` | Chart theming |

**Usage Pattern:**
```typescript
import { BrandingContext } from "@/App";

function MyComponent() {
  const { brandColors, brandingActive } = useContext(BrandingContext);
  
  // brandColors[0] = primary color (hex)
  // brandColors[1] = secondary color (hex)
  // brandingActive = true if subscription active AND colors configured
  
  return (
    <div style={{ borderColor: brandColors[0] || '#3B82F6' }}>
      {/* Branded content */}
    </div>
  );
}
```

---

## PDF Branding System

### pdfBranding.ts Utility

Located in `client/src/lib/pdfBranding.ts`:

```typescript
export interface BrandingConfig {
  companyName?: string | null;
  whitelabelBrandingActive?: boolean | null;
  brandingLogoUrl?: string | null;
  brandingColors?: string[] | null;
}

export function getBrandColors(brandingColors?: string[] | null): {
  primaryColor: { r: number; g: number; b: number };
  secondaryColor: { r: number; g: number; b: number };
  accentColor: { r: number; g: number; b: number };
} {
  // Default OnRopePro colors if no branding
  const DEFAULT_PRIMARY = { r: 23, g: 37, b: 84 };    // Dark blue
  const DEFAULT_SECONDARY = { r: 59, g: 130, b: 246 }; // Blue
  const DEFAULT_ACCENT = { r: 147, g: 197, b: 253 };   // Light blue
  
  if (!brandingColors || brandingColors.length === 0) {
    return { primaryColor: DEFAULT_PRIMARY, secondaryColor: DEFAULT_SECONDARY, accentColor: DEFAULT_ACCENT };
  }
  
  const primaryColor = hexToRgb(brandingColors[0]);
  const secondaryColor = brandingColors.length > 1 
    ? hexToRgb(brandingColors[1]) 
    : lightenColor(primaryColor, 0.5);
  const accentColor = darkenColor(primaryColor, 0.3);
  
  return { primaryColor, secondaryColor, accentColor };
}

export async function addProfessionalHeader(
  doc: jsPDF,
  title: string,
  subtitle: string,
  branding: BrandingConfig
): Promise<BrandingResult> {
  const { primaryColor, secondaryColor, accentColor } = getBrandColors(branding.brandingColors);
  const showBranding = branding.whitelabelBrandingActive && branding.companyName;
  
  // Load logo if branding active
  let logoData: LogoData | null = null;
  if (showBranding && branding.brandingLogoUrl) {
    logoData = await loadLogoAsBase64(branding.brandingLogoUrl);
  }
  
  // Draw header with brand colors
  doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
  doc.rect(0, 0, pageWidth, headerHeight, 'F');
  
  // Add logo if available
  if (logoData) {
    doc.addImage(logoData.base64, 'PNG', margin, logoY, logoWidth, logoHeight);
  }
  
  // Add company name
  if (showBranding) {
    doc.text(branding.companyName!.toUpperCase(), margin + logoWidth + 8, 18);
  }
  
  return { headerHeight, contentStartY, primaryColor, secondaryColor, accentColor };
}
```

### Documents That Use Branding

| Document Type | File Location | Branding Elements |
|---------------|---------------|-------------------|
| Harness Inspections | `Dashboard.tsx` | Header, accent colors, footer |
| FLHA Forms | `FLHAForm.tsx` | Header, section colors |
| Toolbox Meetings | `ToolboxMeetingForm.tsx` | Header, logo, footer |
| Incident Reports | `IncidentReportForm.tsx` | Header, accent colors |
| Quotes | `Quotes.tsx` | Full branding, logo prominent |
| Method Statements | `MethodStatementForm.tsx` | Header, professional layout |
| Work Notices | `WorkNoticeForm.tsx` | Company logo in notice |
| Inventory Reports | `Inventory.tsx` | Header branding |
| IRATA Logged Hours | `TechnicianLoggedHours.tsx` | Export branding |

---

## Multi-Tenant Considerations

### Data Isolation

- **Company Level**: Each company has their own `brandingLogoUrl` and `brandingColors` in the users table
- **Employee Level**: Employees inherit their company's branding via `companyId` lookup
- **Resident Level**: Residents see branding of the company linked via their `linkedResidentCode`
- **Property Manager Level**: PMs do NOT see any company branding (they connect to multiple vendors)

### Query Patterns

```typescript
// Fetching branding - always scoped to company
const companyId = user.role === 'company' ? user.id : user.companyId;

const { data: branding } = useQuery({
  queryKey: ["/api/company", companyId, "branding"],
  // ...
});

// Backend validation - verify company ownership
app.patch("/api/company/branding", requireAuth, requireRole("company"), async (req, res) => {
  const user = req.user as any;
  // User IS the company - no cross-company access possible
  await db.update(users).set({
    brandingColors: req.body.colors
  }).where(eq(users.id, user.id));
});
```

### Role-Based Branding Access

| Role | Branding Behavior |
|------|-------------------|
| Company | Full control - upload logo, set colors |
| Operations Manager | Sees company branding, no editing |
| Technician | Sees company branding, no editing |
| Resident | Sees linked company's branding |
| Property Manager | Global: NO branding. Per-vendor view: Sees vendor's branding when viewing details |
| SuperUser | NO branding (system administrator) |

---

## Error Handling & Recovery

### Common Errors

| Error | Cause | User Message | Recovery Action |
|-------|-------|--------------|-----------------|
| Logo upload fails | File too large or wrong format | "Please upload a PNG or JPG file under 5MB" | Retry with valid file |
| Colors not saving | Network error | "Failed to save colors. Please try again." | Retry PATCH request |
| Branding not showing | Subscription inactive | "Subscribe to White Label Branding to customize" | Direct to subscription management |
| PDF logo missing | Object Storage unreachable | PDF generates without logo | Graceful degradation to text-only header |

### Graceful Degradation

- **No Logo**: PDF headers show company name text instead of logo
- **No Colors**: System uses default OnRopePro blue color scheme
- **Subscription Expired**: Immediate reversion to defaults, branding config preserved for reactivation
- **Object Storage Down**: Logo upload fails with retry prompt; existing logos cached in browser

---

## Testing Requirements

### Unit Tests

```typescript
describe('White Label Branding', () => {
  describe('getBrandColors', () => {
    test('returns defaults when no branding colors provided', () => {
      const result = getBrandColors(null);
      expect(result.primaryColor).toEqual({ r: 23, g: 37, b: 84 });
    });
    
    test('converts hex to RGB correctly', () => {
      const result = getBrandColors(['#FF0000']);
      expect(result.primaryColor).toEqual({ r: 255, g: 0, b: 0 });
    });
    
    test('derives secondary color from primary when only one provided', () => {
      const result = getBrandColors(['#3B82F6']);
      expect(result.secondaryColor).not.toEqual(result.primaryColor);
    });
  });
  
  describe('Subscription Gating', () => {
    test('returns null branding when subscription inactive', async () => {
      const response = await fetch('/api/company/123/branding');
      const data = await response.json();
      expect(data.logoUrl).toBeNull();
      expect(data.colors).toEqual([]);
    });
  });
});
```

### Integration Tests

- **Multi-tenant isolation**: Verify Company A cannot fetch Company B's branding
- **Subscription state transitions**: Test trial → active → cancelled flow
- **Webhook processing**: Verify Stripe webhook correctly updates `whitelabelBrandingActive`
- **PDF generation**: Confirm branded PDFs include logo and colors when active

### Manual Testing Checklist

- [ ] Add branding subscription during trial period
- [ ] Verify branding activates immediately
- [ ] Upload logo and verify display in header
- [ ] Set two brand colors and verify CSS propagation
- [ ] Generate PDF document and verify branding
- [ ] Cancel subscription and verify reversion to defaults
- [ ] Reactivate subscription and verify branding restores
- [ ] Test as employee - verify inherited company branding
- [ ] Test as resident - verify linked company branding
- [ ] Test as property manager - verify NO branding appears

---

## Monitoring & Maintenance

### Key Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Branding fetch latency | < 200ms | > 500ms |
| Logo upload success rate | > 99% | < 95% |
| Webhook processing time | < 2s | > 5s |
| CSS injection success | 100% | Any failure |

### Regular Maintenance

- **Daily**: Monitor Object Storage health for logo availability
- **Weekly**: Verify Stripe webhook processing for branding add-on events
- **Monthly**: Audit `whitelabelBrandingActive` flags match Stripe subscription states

---

## Troubleshooting Guide

### Issue: Branding Not Showing After Payment

**Symptoms**: User paid for branding but UI shows default colors
**Diagnosis Steps**:
1. Check `whitelabelBrandingActive` in database for user
2. Verify Stripe subscription has white_label price ID attached
3. Check browser console for branding fetch errors
4. Verify BrandingProvider is not on excluded path

**Solution**:
```sql
-- Manually activate if webhook failed
UPDATE users SET whitelabel_branding_active = true WHERE id = 'user-id';
```

**Prevention**: Monitor Stripe webhook failures in logs

### Issue: Logo Not Appearing in PDFs

**Symptoms**: PDFs generate but show only company name, no logo
**Diagnosis Steps**:
1. Verify `brandingLogoUrl` is set in database
2. Check if logo URL is accessible (CORS, expired URL)
3. Review `loadLogoAsBase64` error handling

**Solution**: Re-upload logo or update URL if Object Storage moved

### Issue: Colors Look Wrong

**Symptoms**: Brand colors appear different than expected
**Diagnosis Steps**:
1. Verify hex codes in database are correct format (#RRGGBB)
2. Check hex-to-HSL conversion in App.tsx
3. Inspect CSS variables in browser DevTools

**Solution**: Ensure colors are valid 6-digit hex codes with # prefix

---

## Safety & Compliance

White-label branding is a **UI theming feature** with minimal safety/compliance impact:

- **No Field Worker Safety Impact**: Branding changes colors and logos only; it does not affect safety documentation content, FLHA forms, harness inspection flows, or any compliance-critical data.
- **PDF Branding**: All safety documents (harness inspections, FLHA forms) still include all required safety content regardless of branding configuration.
- **Subscription-Gated for Revenue**: Feature is add-on only to ensure proper revenue attribution.
- **Data Isolation**: Each company's branding configuration is isolated; employees/residents only see their company's branding.

---

## Field Worker Experience

For technicians using the mobile-first interface:

- **Automatic Branding**: Technicians see their employer's branding automatically when logged in (no configuration needed)
- **Clock-In/Out Unaffected**: Time tracking functionality works identically regardless of branding
- **PWA Integration**: If company has uploaded PWA icon, technicians installing the app to their home screen will see the company icon
- **Consistent Colors**: Dashboard, schedule, and hours analytics use company brand colors via CSS variables

---

## Known Limitations

### Current Limitations

1. **Two-Color Maximum**: System intentionally limits to 2 colors for UI predictability
2. **No Dark Mode Integration**: CSS variables don't auto-adapt to dark mode (dark mode not implemented)
3. **Static PWA Icons**: PWA icon upload is separate from main logo
4. **Resident Portal Only**: Branding primarily targets resident-facing and internal pages
5. **No Real-time Preview**: Color changes require page refresh to see full effect

### Design Decisions

1. **Two colors only**: More colors create unpredictable UI states and increase support burden
2. **Subscription-gated**: Ensures premium feature generates revenue
3. **Automatic reversion**: Prevents companies from keeping features after cancellation
4. **Preserved config**: Allows easy reactivation without re-uploading assets

---

## Related Files & Documentation

### Codebase Files
| File | Purpose |
|------|---------|
| `shared/schema.ts` (lines 181-213) | Database schema for branding fields |
| `shared/stripe-config.ts` | Pricing ($49/mo) and Stripe product IDs |
| `server/routes.ts` (branding endpoints) | API endpoints for logo/color management |
| `server/stripe-service.ts` | Webhook processing for subscription activation |
| `client/src/App.tsx` (BrandingProvider) | CSS variable injection and context |
| `client/src/lib/pdfBranding.ts` | PDF generation branding utility |
| `client/src/pages/Profile.tsx` (Branding tab) | Company branding configuration UI |
| `client/src/pages/BrandingGuide.tsx` | Customer-facing help documentation |
| `client/src/pages/WhiteLabelBrandingLanding.tsx` | Public marketing landing page |
| `client/src/components/SubscriptionManagement.tsx` | Add-on purchase dialog |
| `server/help-content/modules/white-label-branding.md` | RAG knowledge base content |

### Related Instruction Documents
- `3. DEPENDENCY-AWARENESS-INSTRUCTIONS.md` - Subscription Flow dependency chain
- `BRANDING_SUBSCRIPTION_INSTRUCTIONS.md` - (ARCHIVED) External marketplace integration spec

---

## Version History

- **v1.0** (December 20, 2025): Initial comprehensive documentation
  - Documented full system architecture across 6 layers
  - Added database schema, API endpoints, frontend architecture
  - Included PDF branding system documentation
  - Added testing requirements and troubleshooting guide
  - Documented known limitations and design decisions
