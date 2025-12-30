# Subscription & Stripe System - Single Source of Truth (SSOT)
**Version**: 1.1  
**Last Updated**: December 30, 2024  
**Status**: ACTIVE - FOUNDATIONAL DOCUMENT

> **v1.1 Changes**: Updated registration flow documentation to reflect processing screen with progress indicators, parallel backend operations, and correct API endpoints.

## Overview

This document defines the complete subscription and payment system architecture for OnRopePro. It follows the Guiding Principles from `1. GUIDING_PRINCIPLES.md` with a focus on "It Just Works" reliability, zero friction user experience, and bomb-proof implementation.

---

## 1. Subscription Model

### 1.1 Pricing Structure (Simplified - No Tiers)

#### Monthly Billing
| Component | Price | Billing |
|-----------|-------|---------|
| **Base Platform** | $99/month | Recurring |
| **Employee Seat** | $34.95/month/seat | Recurring, prorated |
| **Volume Seat (30+ employees)** | $29.95/month/seat | Recurring, prorated |
| **White Label Branding** | $49/month | Recurring, optional |

#### Annual Billing (17% Discount)
| Component | Price | Savings |
|-----------|-------|---------|
| **Base Platform** | $990/year | Save $198/year |
| **Employee Seat** | $349/year/seat | Save ~$70/year per seat |
| **Volume Seat (30+ employees)** | $299/year/seat | Save ~$60/year per seat |
| **White Label Branding** | $490/year | Save $98/year |

**Key Points:**
- Single plan for all customers ("OnRopePro")
- No tier differentiation (basic/starter/premium/enterprise are legacy aliases)
- Unlimited projects included in base price
- Employee seats are purchased individually
- **Volume discount**: $29.95/month (or $299/year) per seat for 30+ employees
- **Annual discount**: 17% off when paying yearly
- All prices apply equally to USD and CAD (Stripe handles currency display)
- Applicable taxes (Provincial/State) calculated automatically by Stripe Tax

**Important - Sandbox vs Live Mode:**
- Current price IDs are in Stripe **Sandbox/Test** mode only
- Before production launch, recreate all 16 price IDs in Stripe **Live** mode
- See `shared/stripe-config.ts` for all price IDs

### 1.2 Free Trial

| Parameter | Value |
|-----------|-------|
| **Duration** | 30 days (AUTHORITATIVE) |
| **Access Level** | Full platform access |
| **White Label** | Included during trial |
| **Credit Card Required** | Yes (for Stripe setup) |
| **Charged During Trial** | No |

**Trial Duration Configuration:**
- Current: 30 days (set via `trial_period_days: 30` in Stripe checkout)
- To change: Update both the Stripe API call AND this document
- Never change trial length without updating both code and documentation

**Trial Behavior:**
- User gets full access to all features including white label during trial
- Card is stored in Stripe but NOT charged until trial ends
- If user adds employees during trial, proration begins after trial ends
- White label access continues seamlessly into paid period if user keeps it

### 1.3 Account States (AUTHORITATIVE)

| State | Description | User Experience | Access Level |
|-------|-------------|-----------------|--------------|
| `trialing` | Active trial period | Full access, all features | FULL |
| `active` | Paid subscription | Full access, all features | FULL |
| `past_due` | Payment failed, retry pending | Full access, warning banner | FULL |
| `unpaid` | Multiple payment failures | Read-only, update payment prompt | READ-ONLY |
| `canceled` | Subscription ended | Read-only, resubscribe prompt | READ-ONLY |
| `incomplete` | Checkout not completed | No access, redirect to checkout | NO ACCESS |

**Access Level Definitions:**
- **FULL**: All features available, no restrictions
- **READ-ONLY**: View all data, cannot create/modify records, clear CTA to fix payment
- **NO ACCESS**: Redirect to complete registration/payment, cannot use app

**State-Specific Behavior:**

| State | Middleware Response | Frontend Behavior |
|-------|---------------------|-------------------|
| `trialing`, `active`, `past_due` | `next()` - allow request | Normal UI |
| `unpaid`, `canceled` | `403 SUBSCRIPTION_INACTIVE` | Disable mutations, show payment CTA |
| `incomplete` | `401 REGISTRATION_INCOMPLETE` | Redirect to /complete-registration |

**Critical Rules:**
- NEVER delete user data due to payment issues
- `past_due` maintains full access to avoid disrupting active work
- `incomplete` is a registration flow state, not a subscription state
- Always show clear path to resolution (update payment / resubscribe)

---

## 2. Stripe Integration Architecture

### 2.1 Stripe Components Used

| Component | Purpose |
|-----------|---------|
| **Stripe Checkout (Embedded)** | Registration payment collection |
| **Stripe Customer** | Store customer + payment method |
| **Stripe Subscription** | Recurring billing management |
| **Stripe Tax** | Automatic tax calculation |
| **Stripe Webhooks** | Real-time subscription updates |
| **Stripe Payment Element** | Card collection in embedded form |
| **Stripe Address Element** | Billing address for tax calculation |

### 2.2 Required Customer Data

For Stripe Tax to calculate taxes correctly, we need:

| Field | Required | Purpose |
|-------|----------|---------|
| **Email** | Yes | Customer identification, receipts |
| **Name** | Yes | Invoice/receipt display |
| **Card Number** | Yes | Payment method |
| **Card Expiry** | Yes | Payment method |
| **Card CVC** | Yes | Payment verification |
| **Billing Country** | Yes | Tax jurisdiction |
| **Billing Postal/ZIP** | Yes (US/Canada) | State/Province tax rate |
| **Billing State/Province** | Recommended | Accurate local tax |
| **Street Address** | Optional | Enhanced tax accuracy |

**Minimum for Tax Calculation:**
- US: Country + ZIP code (5-digit)
- Canada: Country + Province OR Postal code
- Other countries: Country (minimum)

### 2.3 Stripe Tax Configuration

```typescript
// Checkout Session creation with automatic tax
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  automatic_tax: { enabled: true },
  customer_update: {
    address: 'auto',  // Save billing address to customer
  },
  tax_id_collection: { enabled: true },  // Allow B2B tax ID entry
  // ... other config
});
```

**Tax Behavior:**
- `exclusive`: Tax added on top of price (US/Canada default)
- Product tax code: `txcd_10103001` (SaaS - Business Use - Essential)

---

## 3. Registration Flow (Embedded Checkout)

### 3.1 User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    EMPLOYER REGISTRATION MODAL                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Step 1: Welcome                                                 │
│  ├── Brief value proposition                                     │
│  └── "Get Started" button                                        │
│                                                                   │
│  Step 2: Account Details                                         │
│  ├── Company Name                                                │
│  ├── Owner Name                                                  │
│  ├── Email                                                       │
│  ├── Password / Confirm Password                                 │
│  └── Continue button                                             │
│                                                                   │
│  Step 3: Payment (Stripe Embedded)                               │
│  ├── [Stripe Payment Element - Card]                             │
│  ├── [Stripe Address Element - Billing]                          │
│  ├── Tax amount displayed (auto-calculated)                      │
│  ├── Total displayed ($99 + tax)                                 │
│  ├── Trial notice: "30-day free trial, cancel anytime"           │
│  └── "Start Free Trial" button                                   │
│                                                                   │
│  Step 4: Processing (Account Setup)                              │
│  ├── "Setting up your account" with animated progress bar        │
│  ├── Step-by-step status messages:                               │
│  │   - "Verifying payment..."                                    │
│  │   - "Creating your account..."                                │
│  │   - "Setting up your dashboard..."                            │
│  │   - "Configuring permissions..."                              │
│  │   - "Finalizing your workspace..."                            │
│  └── Helpful tips displayed during wait                          │
│                                                                   │
│  Step 5: Success                                                 │
│  ├── "Account Created!"                                          │
│  ├── Auto-login initiated                                        │
│  └── Redirect to dashboard                                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Technical Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │     │   Backend    │     │    Stripe    │     │   Database   │
│   (Modal)    │     │   (API)      │     │              │     │              │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │                    │
       │ 1. User fills      │                    │                    │
       │    account info    │                    │                    │
       │                    │                    │                    │
       │ 2. POST /api/stripe/create-registration-checkout             │
       │    (password hash  │                    │                    │
       │     in metadata)   │                    │                    │
       │───────────────────>│                    │                    │
       │                    │                    │                    │
       │                    │ 3. Create Checkout│                    │
       │                    │    Session w/     │                    │
       │                    │    user metadata  │                    │
       │                    │───────────────────>│                    │
       │                    │                    │                    │
       │                    │ 4. Return client  │                    │
       │                    │    secret + ID    │                    │
       │                    │<───────────────────│                    │
       │                    │                    │                    │
       │ 5. Render Stripe  │                    │                    │
       │    Embedded        │                    │                    │
       │    Checkout        │                    │                    │
       │<───────────────────│                    │                    │
       │                    │                    │                    │
       │ 6. User completes │                    │                    │
       │    payment form   │                    │                    │
       │                    │                    │                    │
       │ 7. Stripe confirms│                    │                    │
       │    payment        │                    │                    │
       │<───────────────────────────────────────│                    │
       │                    │                    │                    │
       │ 8. Show Processing│                    │                    │
       │    Screen w/      │                    │                    │
       │    progress bar   │                    │                    │
       │                    │                    │                    │
       │ 9. GET /api/stripe/complete-registration/:sessionId          │
       │───────────────────>│                    │                    │
       │                    │                    │                    │
       │                    │ 10. Verify session│                    │
       │                    │    & get metadata │                    │
       │                    │───────────────────>│                    │
       │                    │                    │                    │
       │                    │ 11. Create User   │                    │
       │                    │─────────────────────────────────────────>│
       │                    │                    │                    │
       │                    │ 12. PARALLEL:     │                    │
       │                    │   - License key   │                    │
       │                    │   - Payroll setup │                    │
       │                    │   - Session login │                    │
       │                    │─────────────────────────────────────────>│
       │                    │                    │                    │
       │ 13. Return success│                    │                    │
       │    + session      │                    │                    │
       │<───────────────────│                    │                    │
       │                    │                    │                    │
       │ 14. Show Success  │                    │                    │
       │     Screen        │                    │                    │
       │                    │                    │                    │
       │ 15. Redirect to   │                    │                    │
       │     Dashboard     │                    │                    │
       │                    │                    │                    │
```

### 3.3 Key Implementation Points

**Processing Screen (UX Optimization):**
- Shown immediately when Stripe payment completes (eliminates blank screen)
- Animated progress bar with step-by-step status messages
- Steps displayed: Verifying payment, Creating account, Setting up dashboard, 
  Configuring permissions, Finalizing workspace
- Helpful tips shown during wait (payment confirmed, trial activated, etc.)
- Progress interval managed via useRef with cleanup in finally block

**Backend Performance (Parallel Operations):**
- After company creation, these operations run in parallel via Promise.all:
  1. License key record insertion
  2. Payroll config + pay period generation  
  3. Session save for auto-login
- Reduces overall API response time significantly

**License Key Handling:**
- License keys are generated internally and stored in the database
- License key is NEVER shown to the user
- License key is used internally to link Stripe subscription to user account
- If license key lookup is needed (e.g., for support), it's done by admin only

**Error Handling:**
- Card validation errors shown inline (Stripe handles this)
- Network errors: "Unable to process payment. Please try again."
- Duplicate email: "An account with this email already exists."
- All errors recoverable - user can retry without losing entered data
- If API fails, user returns to payment step with error toast
- Progress interval properly cleaned up on error to prevent memory leaks

**Security:**
- All sensitive card data handled by Stripe (PCI compliance)
- Password hashed with bcrypt before storing in Stripe session metadata
- HTTPS only
- CSRF protection on all API endpoints
- Rate limiting on registration endpoints

---

## 4. Seat (Employee) Management & Proration

### 4.1 Seat Model

```
Base Subscription: $99/month (no seats included)
Each Employee: +$34.95/month (prorated)
```

When employer adds/removes employees, the subscription quantity changes.

### 4.2 Adding Employees (Seats)

```typescript
// When employer adds an employee
async function addEmployeeSeat(companyId: string, employeeId: string) {
  const company = await storage.getUserById(companyId);
  
  // 1. Add employee to database
  await storage.linkEmployeeToCompany(employeeId, companyId);
  
  // 2. Update Stripe subscription quantity
  const subscription = await stripe.subscriptions.retrieve(company.stripeSubscriptionId);
  const seatItem = subscription.items.data.find(
    item => item.price.id === ADDON_CONFIG.extra_seats.priceIdUSD ||
            item.price.id === ADDON_CONFIG.extra_seats.priceIdCAD
  );
  
  if (seatItem) {
    // Increment existing seat count
    await stripe.subscriptionItems.update(seatItem.id, {
      quantity: seatItem.quantity + 1,
      proration_behavior: 'create_prorations',  // Charge prorated amount
    });
  } else {
    // Add first seat to subscription
    await stripe.subscriptionItems.create({
      subscription: subscription.id,
      price: company.currency === 'cad' 
        ? ADDON_CONFIG.extra_seats.priceIdCAD 
        : ADDON_CONFIG.extra_seats.priceIdUSD,
      quantity: 1,
      proration_behavior: 'create_prorations',
    });
  }
  
  // 3. Update local seat count
  await storage.updateUser(companyId, {
    additionalSeatsCount: (company.additionalSeatsCount || 0) + 1,
  });
}
```

### 4.3 Removing Employees (Seats)

```typescript
// When employer removes an employee
async function removeEmployeeSeat(companyId: string, employeeId: string) {
  const company = await storage.getUserById(companyId);
  
  // 1. Remove employee from company
  await storage.unlinkEmployeeFromCompany(employeeId);
  
  // 2. Update Stripe subscription quantity
  const subscription = await stripe.subscriptions.retrieve(company.stripeSubscriptionId);
  const seatItem = subscription.items.data.find(
    item => item.price.id === ADDON_CONFIG.extra_seats.priceIdUSD ||
            item.price.id === ADDON_CONFIG.extra_seats.priceIdCAD
  );
  
  if (seatItem && seatItem.quantity > 1) {
    // Decrement seat count
    await stripe.subscriptionItems.update(seatItem.id, {
      quantity: seatItem.quantity - 1,
      proration_behavior: 'create_prorations',  // Credit prorated amount
    });
  } else if (seatItem && seatItem.quantity === 1) {
    // Remove seat line item entirely
    await stripe.subscriptionItems.del(seatItem.id, {
      proration_behavior: 'create_prorations',
    });
  }
  
  // 3. Update local seat count
  await storage.updateUser(companyId, {
    additionalSeatsCount: Math.max(0, (company.additionalSeatsCount || 0) - 1),
  });
}
```

### 4.4 Proration Behavior

**Adding Seat Mid-Cycle:**
```
Example: 15 days remaining in billing period
Seat cost: $34.95/month
Prorated charge: $34.95 × (15/30) = $17.48

→ $17.48 added to next invoice OR charged immediately
  (based on proration_behavior setting)
```

**Removing Seat Mid-Cycle:**
```
Example: 15 days remaining in billing period
Seat cost: $34.95/month
Prorated credit: $34.95 × (15/30) = $17.48

→ $17.48 credited to next invoice
  (Stripe does NOT auto-refund, applies to future charges)
```

**Proration Behavior Options:**
| Behavior | When to Use |
|----------|-------------|
| `create_prorations` | Default - adds to next invoice |
| `always_invoice` | Charge/credit immediately |
| `none` | No proration - full price next cycle |

**Our Default:** `create_prorations` - smooth billing experience, charges accumulate and apply to next invoice.

### 4.5 Preview Proration Before Confirming

```typescript
// Show user what they'll be charged before adding seat
async function previewSeatChange(companyId: string, newSeatCount: number) {
  const company = await storage.getUserById(companyId);
  
  const invoice = await stripe.invoices.retrieveUpcoming({
    customer: company.stripeCustomerId,
    subscription: company.stripeSubscriptionId,
    subscription_items: [{
      id: seatItemId,
      quantity: newSeatCount,
    }],
  });
  
  return {
    prorationAmount: invoice.total / 100,  // In dollars
    nextInvoiceTotal: invoice.amount_due / 100,
    currency: invoice.currency,
  };
}
```

---

## 5. Webhook Handling

### 5.1 Critical Webhooks

| Event | Action |
|-------|--------|
| `customer.subscription.created` | Set user to `trialing` or `active` |
| `customer.subscription.updated` | Update status, handle tier changes |
| `customer.subscription.deleted` | Set status to `canceled`, record churn |
| `invoice.payment_succeeded` | Confirm payment, clear any warnings |
| `invoice.payment_failed` | Set `past_due`, notify user |
| `customer.subscription.trial_will_end` | Send reminder email (3 days before) |

### 5.2 Webhook Security

```typescript
// Verify webhook signature
const event = stripe.webhooks.constructEvent(
  req.body,
  req.headers['stripe-signature'],
  process.env.STRIPE_WEBHOOK_SECRET
);
```

### 5.3 Idempotency

- Check if event already processed before taking action
- Use event.id as idempotency key
- Log all webhook processing for debugging

---

## 6. Subscription Access Enforcement

### 6.1 Access Levels (Reference from Section 1.3)

| Access Level | States | Backend Response | Frontend Behavior |
|--------------|--------|------------------|-------------------|
| FULL | `trialing`, `active`, `past_due` | `next()` | Normal UI |
| READ-ONLY | `unpaid`, `canceled` | `403 SUBSCRIPTION_INACTIVE` | Disable mutations |
| NO ACCESS | `incomplete` | `401 REGISTRATION_INCOMPLETE` | Redirect to checkout |

### 6.2 Backend Middleware

```typescript
// subscription-middleware.ts
export async function requireActiveSubscription(
  req: Request, 
  res: Response, 
  next: NextFunction
) {
  const user = await storage.getUserById(req.session.userId);
  
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  // Platform-verified companies bypass all checks
  if (user.isPlatformVerified) {
    return next();
  }
  
  // NO ACCESS states - redirect to complete registration
  if (user.subscriptionStatus === 'incomplete') {
    return res.status(401).json({
      message: "Please complete your registration to continue.",
      code: "REGISTRATION_INCOMPLETE",
      subscriptionStatus: user.subscriptionStatus,
    });
  }
  
  // READ-ONLY states - allow reads, block mutations
  const readOnlyStatuses = ['unpaid', 'canceled'];
  
  if (readOnlyStatuses.includes(user.subscriptionStatus)) {
    return res.status(403).json({
      message: "Your subscription is inactive. Please update your payment method to continue.",
      code: "SUBSCRIPTION_INACTIVE",
      subscriptionStatus: user.subscriptionStatus,
    });
  }
  
  // FULL ACCESS states: trialing, active, past_due
  next();
}
```

### 6.3 Frontend Enforcement

```typescript
// useSubscriptionStatus hook
export function useSubscriptionStatus() {
  const { user } = useAuth();
  
  const accessLevel = useMemo(() => {
    if (!user) return 'none';
    if (user.isPlatformVerified) return 'full';
    
    if (user.subscriptionStatus === 'incomplete') return 'no_access';
    if (['unpaid', 'canceled'].includes(user.subscriptionStatus)) return 'read_only';
    
    // trialing, active, past_due
    return 'full';
  }, [user]);
  
  return { 
    accessLevel,
    isReadOnly: accessLevel === 'read_only',
    hasNoAccess: accessLevel === 'no_access',
    hasFullAccess: accessLevel === 'full',
  };
}

// Usage in components
function CreateProjectButton() {
  const { isReadOnly, hasNoAccess } = useSubscriptionStatus();
  
  if (hasNoAccess) {
    // This shouldn't render - user should be redirected
    return null;
  }
  
  if (isReadOnly) {
    return (
      <Button disabled>
        <Lock className="mr-2 h-4 w-4" />
        Update payment to create projects
      </Button>
    );
  }
  
  return <Button>Create Project</Button>;
}
```

### 6.4 Route Protection

```typescript
// For incomplete status, redirect in App.tsx route guard
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const { hasNoAccess } = useSubscriptionStatus();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    if (!isLoading && user && hasNoAccess) {
      setLocation('/complete-registration');
    }
  }, [user, hasNoAccess, isLoading, setLocation]);
  
  if (hasNoAccess) return null;
  
  return children;
}
```

---

## 7. Database Schema Updates

### 7.1 Users Table Fields

```typescript
// Subscription-related fields on users table
stripeCustomerId: varchar("stripe_customer_id"),
stripeSubscriptionId: varchar("stripe_subscription_id"),
subscriptionTier: varchar("subscription_tier"),  // Legacy: always "onropepro" or null
subscriptionStatus: varchar("subscription_status"),  // trialing|active|past_due|unpaid|canceled
subscriptionCurrentPeriodEnd: timestamp("subscription_current_period_end"),
additionalSeatsCount: integer("additional_seats_count").default(0),
whitelabelBrandingActive: boolean("whitelabel_branding_active").default(false),
whitelabelPendingBilling: boolean("whitelabel_pending_billing").default(false),
isPlatformVerified: boolean("is_platform_verified").default(false),  // Bypass all subscription checks
licenseKey: varchar("license_key"),  // Internal tracking only, never shown to user
```

### 7.2 License Keys Table (Internal Use Only)

```typescript
// license_keys table - used internally to link Stripe sessions to registrations
export const licenseKeys = pgTable("license_keys", {
  licenseKey: varchar("license_key").primaryKey(),
  stripeSessionId: varchar("stripe_session_id").notNull().unique(),
  stripeCustomerId: varchar("stripe_customer_id").notNull(),
  stripeSubscriptionId: varchar("stripe_subscription_id").notNull(),
  tier: varchar("tier").notNull(),  // Always "onropepro" for new registrations
  currency: varchar("currency").notNull(),
  used: boolean("used").default(false).notNull(),
  usedByUserId: varchar("used_by_user_id"),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

---

## 8. API Endpoints

### 8.1 Registration Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/stripe/create-registration-session` | POST | Initialize embedded checkout |
| `/api/register-with-payment` | POST | Complete registration after payment |

### 8.2 Subscription Management Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/stripe/subscription` | GET | Get current subscription status |
| `/api/stripe/preview-seat-change` | POST | Preview proration for seat change |
| `/api/stripe/add-seat` | POST | Add employee seat |
| `/api/stripe/remove-seat` | POST | Remove employee seat |
| `/api/stripe/add-white-label` | POST | Add white label branding |
| `/api/stripe/remove-white-label` | POST | Remove white label branding |
| `/api/stripe/customer-portal` | GET | Get Stripe customer portal URL |
| `/api/stripe/webhook` | POST | Handle Stripe webhooks |

---

## 9. Testing Checklist

### 9.1 Registration Flow
- [ ] Modal opens correctly from login page
- [ ] Account details validated before payment step
- [ ] Stripe Payment Element renders correctly
- [ ] Stripe Address Element collects billing address
- [ ] Tax amount calculated and displayed
- [ ] Trial notice clearly visible
- [ ] Successful payment creates account
- [ ] User auto-logged in after registration
- [ ] Redirect to dashboard works
- [ ] Duplicate email shows appropriate error
- [ ] Network errors handled gracefully

### 9.2 Subscription States
- [ ] `trialing` - full access, no charges
- [ ] `active` - full access, billing active
- [ ] `past_due` - full access, warning shown
- [ ] `unpaid` - read-only mode enforced
- [ ] `canceled` - read-only mode enforced

### 9.3 Seat Proration
- [ ] Adding employee updates Stripe quantity
- [ ] Removing employee updates Stripe quantity
- [ ] Proration calculated correctly
- [ ] Preview shows accurate amounts
- [ ] Credits applied to future invoices

### 9.4 Webhook Handling
- [ ] Subscription created webhook updates DB
- [ ] Payment failed webhook updates status
- [ ] Subscription deleted webhook sets canceled
- [ ] Webhook signature verified
- [ ] Idempotency prevents duplicate processing

---

## 10. Error Handling & Recovery

### 10.1 Payment Failures

```typescript
// On payment failure webhook
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const user = await storage.getUserByStripeCustomerId(customerId);
  
  if (!user) return;
  
  // Update status
  await storage.updateUser(user.id, {
    subscriptionStatus: 'past_due',
  });
  
  // Send notification email
  await sendPaymentFailedEmail(user.email, {
    invoiceAmount: invoice.amount_due / 100,
    currency: invoice.currency,
    retryDate: new Date(invoice.next_payment_attempt * 1000),
  });
}
```

### 10.2 Recovery Paths

| Scenario | User Action | System Response |
|----------|-------------|-----------------|
| Card expired | Update in customer portal | Retry payment automatically |
| Insufficient funds | Add funds, retry | Auto-retry or manual retry |
| Card stolen | Add new card | Retry with new card |
| Dispute filed | Contact support | Manual review |

---

## 11. Guiding Principles Alignment

This system adheres to the core principles from `1. GUIDING_PRINCIPLES.md`:

1. **"It Just Works" Principle**
   - Zero-friction registration with embedded checkout
   - Automatic tax calculation
   - Seamless proration for seat changes
   - Graceful degradation to read-only (never data loss)

2. **Zero Data Loss**
   - Never delete user data due to payment issues
   - Read-only mode preserves all data
   - Webhook idempotency prevents duplicate actions

3. **Security Requirements**
   - PCI compliance via Stripe (no card data on our servers)
   - Webhook signature verification
   - Rate limiting on registration endpoints
   - HTTPS only

4. **Error Prevention**
   - Preview proration before confirming changes
   - Clear error messages with recovery paths
   - Payment retry mechanisms

---

## 12. Future Considerations

- **Annual billing option**: 10-20% discount for yearly payment
- **Volume discounts**: Reduced seat pricing for 20+ employees
- **Custom enterprise plans**: For very large customers
- **Multi-currency display**: Show prices in local currency
- **Invoice customization**: Add company branding to invoices

---

**Remember: The goal is minimal friction. Users should be able to sign up, pay, and start working in under 2 minutes. No license keys to enter, no complex tier decisions, just simple transparent pricing.**
