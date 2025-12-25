# Unified Login & Authentication System Instructions v1.0
**System**: Rope Access Management System  
**Domain**: Authentication, Session Management, User Registration  
**Version**: 1.0  
**Last Updated**: December 25, 2024  
**Status**: PRODUCTION-READY ✅  
**Safety Critical**: Yes - Authentication failures can expose sensitive company and safety data

---

## Purpose and Goal

### Primary Objective
Provide a secure, unified authentication system that enables 8 distinct stakeholder types to register, sign in, and access role-appropriate functionality while maintaining strict multi-tenant data isolation across rope access companies, their employees, clients, and service providers.

### Key Goals
- **Security**: Prevent unauthorized access through session-based authentication, rate limiting, and password strength enforcement
- **Efficiency**: Single login endpoint supporting multiple identifier types (email, company name, license number)
- **Compliance**: Audit trail of authentication events, secure password storage (bcrypt), and session expiry policies
- **Accuracy**: Precise role assignment ensuring users access only their designated features
- **Usability**: Mobile-first login experience with clear error messaging and password reset flow

---

## System Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  Login.tsx       Register.tsx      TechnicianPortal.tsx   GroundCrewPortal  │
│  (Unified)       (Company/PM/Res)  (Self-Registration)    (Self-Reg)        │
│      │                │                    │                    │           │
│      └────────────────┴────────────────────┴────────────────────┘           │
│                                    │                                         │
│                            API Requests                                      │
└────────────────────────────────────┼─────────────────────────────────────────┘
                                     │
┌────────────────────────────────────┼─────────────────────────────────────────┐
│                            SERVER LAYER                                      │
├────────────────────────────────────┼─────────────────────────────────────────┤
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────┐        │
│  │                     RATE LIMITERS                                │        │
│  │  loginRateLimiter: 10 attempts / 15 min window                  │        │
│  │  registrationRateLimiter: 5 attempts / hour window              │        │
│  └─────────────────────────────────────────────────────────────────┘        │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────┐        │
│  │                   AUTHENTICATION ENDPOINTS                       │        │
│  │                                                                  │        │
│  │  POST /api/login ─────────────────┐                             │        │
│  │  POST /api/register ──────────────┤                             │        │
│  │  POST /api/register-with-license ─┤                             │        │
│  │  POST /api/technician-register ───┤                             │        │
│  │  POST /api/ground-crew-register ──┤                             │        │
│  │  POST /api/forgot-password ───────┤                             │        │
│  │  POST /api/reset-password ────────┤                             │        │
│  │  POST /api/logout ────────────────┘                             │        │
│  └─────────────────────────────────────────────────────────────────┘        │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────┐        │
│  │                   SESSION MANAGEMENT                             │        │
│  │  express-session + connect-pg-simple                            │        │
│  │  Cookie: connect.sid (httpOnly, secure, sameSite=none)          │        │
│  │  TTL: 30 days                                                    │        │
│  └─────────────────────────────────────────────────────────────────┘        │
│                                    │                                         │
└────────────────────────────────────┼─────────────────────────────────────────┘
                                     │
┌────────────────────────────────────┼─────────────────────────────────────────┐
│                          DATABASE LAYER                                      │
├────────────────────────────────────┼─────────────────────────────────────────┤
│                                    ▼                                         │
│  ┌─────────────────────┐   ┌─────────────────────────────────────────┐      │
│  │    sessions         │   │              users                       │      │
│  │   (PostgreSQL)      │   │  - id, email, passwordHash              │      │
│  │  - sid              │   │  - role, companyId, companyName         │      │
│  │  - sess (JSON)      │   │  - passwordResetToken, resetExpires     │      │
│  │  - expire           │   │  - terminatedDate, suspendedAt          │      │
│  └─────────────────────┘   │  - isDisabled, isTempPassword           │      │
│                            └─────────────────────────────────────────┘      │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐        │
│  │                    staffAccounts                                 │        │
│  │  - id, email, firstName, lastName, passwordHash                 │        │
│  │  - permissions (array)                                          │        │
│  └─────────────────────────────────────────────────────────────────┘        │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Input Stage**: User submits credentials via login form or registration form
2. **Rate Limiting Stage**: Request passes through rate limiter (blocks after threshold)
3. **Validation Stage**: Input validation, password strength check, duplicate detection
4. **Authentication Stage**: Credential verification (bcrypt compare) or user creation
5. **Session Stage**: Session created in PostgreSQL, cookie set on response
6. **Output Stage**: User object returned (sans passwordHash), redirect to dashboard

### Integration Points
- **Upstream Systems**: Stripe checkout (license-based registration), SendGrid (password reset emails)
- **Downstream Systems**: All protected API endpoints via `requireAuth` and `requireRole` middleware
- **Parallel Systems**: WebSocket authentication (validates session cookie for real-time connections)

---

## Stakeholder Types & User Roles

### Complete Role Hierarchy

| Role | Description | Registration Path | Login Identifier |
|------|-------------|-------------------|------------------|
| `superuser` | Platform super administrator | Environment variables only | Username (env) |
| `staff` | Internal platform staff | Created by SuperUser | Email |
| `company` | Rope access company owner | /pricing → /register | Email, Company Name |
| `rope_access_tech` | IRATA/SPRAT certified technician | /technician portal self-registration | Email, License # |
| `ground_crew` | Ground support worker | /ground-crew portal self-registration | Email |
| `property_manager` | Building property manager | /register with company code | Email |
| `resident` | Building resident | /register with strata + unit | Email |
| `building_manager` | Strata building manager | /building-portal | Building ID + PIN |

### Role Groups (Used for Access Control)

```typescript
const EMPLOYEE_ROLES = ['rope_access_tech', 'ground_crew'];
const ADMIN_ROLES = ['superuser', 'staff'];
const LINKABLE_ROLES = ['rope_access_tech', 'ground_crew']; // Can receive team invitations
```

---

## Sign-Up Journeys by Stakeholder

### 1. Company Registration

**User Journey**: `/pricing` → Select Plan → Stripe Checkout → `/register`

**Endpoint**: `POST /api/register-with-license` (preferred) or `POST /api/register`

**Required Fields**:
- `companyName` - Unique company identifier
- `email` - Account email (unique)
- `password` - Meets strength requirements
- `role: 'company'`

**Auto-Generated on First Login**:
- `residentCode` - 10-character unique code for resident linking
- `propertyManagerCode` - 10-character unique code for PM linking

**Validation Rules**:
- Password: 8+ chars, 1 uppercase, 1 lowercase, 1 number
- Email: Valid format, case-insensitive uniqueness check
- Company name: Must be unique

```typescript
// Registration creates session automatically
req.session.userId = user.id;
req.session.role = user.role;
await req.session.save();
```

---

### 2. Technician Self-Registration

**User Journey**: `/technician` (landing) → Click "Sign Up" → Multi-step form with OCR

**Endpoint**: `POST /api/technician-register`

**Required Fields**:
- `firstName`, `lastName` - Legal name
- `email` - Account email (unique)
- `password` - Meets strength requirements
- `phone` - Contact number
- `certification` - 'irata', 'sprat', or 'both'
- `irataLevel`/`spratLevel` - Certification level (1, 2, or 3)
- `irataLicenseNumber`/`spratLicenseNumber` - License number (unique per type)
- `emergencyContactName`, `emergencyContactPhone` - Required for safety

**Optional Fields**:
- `companyCode` - Pre-link to a specific company
- `referralCodeInput` - Referral from another technician
- Address fields, banking info (for payroll), void cheque/ID uploads

**OCR Feature**: Driver's license and void cheque images processed via Gemini OCR for auto-fill

**Validation**:
- License numbers must be globally unique (prevents duplicate accounts)
- Email must be unique
- Password must meet strength requirements

**Post-Registration**:
- Auto-login (session created immediately)
- Referral code generated for the new technician
- Can link to companies via job board or invitations

---

### 3. Ground Crew Self-Registration

**User Journey**: `/ground-crew` (landing) → Click "Sign Up" → Registration form

**Endpoint**: `POST /api/ground-crew-register`

**Required Fields**:
- `firstName`, `lastName` - Legal name
- `email` - Account email (unique)
- `password` - Meets strength requirements
- `phone` - Contact number
- `emergencyContactName`, `emergencyContactPhone` - Required for safety

**Optional Fields**:
- `employerCode` - Pre-link to a company via property manager code
- Address fields

**Post-Registration**:
- Auto-login (session created)
- If `employerCode` provided, linked to that company immediately

---

### 4. Property Manager Registration

**User Journey**: Receives company code from employer → `/register` → Enters code

**Endpoint**: `POST /api/register`

**Required Fields**:
- `name` - Full name
- `email` - Account email (unique)
- `password` - Meets strength requirements
- `role: 'property_manager'`
- `companyCode` - 10-character code from rope access company

**Validation**:
- Company code validated against `users.propertyManagerCode` for role='company'
- If invalid, registration fails with clear error message

**Atomic Transaction**:
```typescript
await db.transaction(async (tx) => {
  // Create user
  const [newUser] = await tx.insert(users).values({...}).returning();
  // Create company link
  await tx.insert(propertyManagerCompanyLinks).values({
    propertyManagerId: newUser.id,
    companyCode: req.body.companyCode,
    companyId: company.id,
  });
  return newUser;
});
```

---

### 5. Resident Registration

**User Journey**: Receives resident code from company → `/resident` or `/register`

**Endpoint**: `POST /api/register`

**Required Fields**:
- `name` - Full name
- `email` - Account email (unique)
- `password` - Meets strength requirements
- `role: 'resident'`
- `strataPlanNumber` - Building strata plan identifier
- `unitNumber` - Unit within the building

**Unit Conflict Resolution**:
If unit already linked to another resident:
```json
{
  "message": "This unit is already linked to another resident account",
  "unitConflict": true,
  "requiresConfirmation": true,
  "field": "unitNumber"
}
```
- Frontend prompts user to confirm takeover
- Re-submit with `confirmUnitTakeover: true`
- Old resident is unlinked (strata/unit cleared), new resident linked

---

### 6. Building Manager Access

**User Journey**: `/building-portal` → Enter building ID + access PIN

**Authentication Method**: Building-specific PIN (not session-based for standard users)

**Session Data**:
```typescript
req.session.buildingId = building.id;
req.session.strataPlanNumber = building.strataPlanNumber;
// Note: No userId for anonymous building access
```

---

## Sign-In Flow (Unified)

### Endpoint: `POST /api/login`

**Rate Limiting**: 10 attempts per 15-minute window

### Authentication Priority Order

```
1. SuperUser Check (environment variables)
   ├─ Match: SUPERUSER_USERNAME env var
   └─ Verify: SUPERUSER_PASSWORD_HASH (bcrypt compare)
   
2. Staff Account Check (staffAccounts table)
   ├─ Match: Email in staffAccounts
   └─ Verify: Password via storage.verifyStaffAccountPassword()
   
3. Regular User Check (users table)
   ├─ Try: Email lookup
   ├─ Try: Company name lookup (for company role)
   ├─ Try: IRATA/SPRAT license number lookup (for technicians)
   └─ Verify: Password via bcrypt.compare()
```

### Login Request Body

```typescript
interface LoginRequest {
  identifier: string;  // Email, company name, or license number
  password: string;
}
```

### Access Control Checks (Post-Authentication)

```typescript
// 1. Termination check (non-linkable roles only)
if (user.terminatedDate && !isLinkableEmployee && !isSelfResigned) {
  return res.status(403).json({ 
    message: "Your employment has been terminated..." 
  });
}

// 2. Suspension check (non-linkable roles only)
if (user.suspendedAt && !isLinkableEmployee) {
  return res.status(403).json({ 
    message: "Your account access has been suspended..." 
  });
}

// 3. Disabled check (all roles)
if (user.isDisabled) {
  return res.status(403).json({ 
    message: "Your account has been suspended..." 
  });
}
```

**Important**: Technicians and ground crew (`LINKABLE_ROLES`) can always log in even if terminated or suspended from a specific company - they retain access to their personal portal.

### Session Creation

```typescript
req.session.userId = user.id;
req.session.role = user.role;

// For staff accounts:
req.session.staffPermissions = staffAccount.permissions;

await new Promise<void>((resolve, reject) => {
  req.session.save((err) => {
    if (err) reject(err);
    else resolve();
  });
});
```

### Response Format

```typescript
// Success (200)
{
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    companyName?: string;
    companyId?: string;
    permissions?: string[];  // Staff only
    // ... other non-sensitive fields
  }
}

// Failure (401/403)
{
  message: "Invalid credentials" | "Your employment has been terminated..." | ...
}
```

---

## Password Reset Flow

### Step 1: Request Reset

**Endpoint**: `POST /api/forgot-password`

**Rate Limiting**: Same as login (10 attempts / 15 min)

```typescript
// Generate secure token
const resetToken = crypto.randomBytes(32).toString('hex');
const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

// Hash before storing (security)
const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

await storage.updateUser(user.id, {
  passwordResetToken: hashedToken,
  passwordResetExpires: resetExpires,
});
```

**Security**: Always returns success message even if email not found (prevents account enumeration)

**Email Sent Via**: SendGrid integration with reset link

### Step 2: Reset Password

**Endpoint**: `POST /api/reset-password`

```typescript
interface ResetPasswordRequest {
  token: string;
  email: string;
  newPassword: string;
}
```

**Validation**:
1. Token hash matches stored hash
2. Token not expired (1-hour window)
3. New password meets strength requirements

**Post-Reset**:
- Password updated with bcrypt hash
- Reset token cleared
- `isTempPassword` set to `false`

---

## Technical Implementation

### Session Configuration (server/index.ts)

```typescript
const PgSession = connectPg(session);

app.use(session({
  store: new PgSession({
    pool,
    tableName: "sessions",
    createTableIfMissing: true,
  }),
  name: SESSION_COOKIE_NAME,  // 'connect.sid'
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,           // Always HTTPS (Replit proxies)
    httpOnly: true,         // No JS access
    sameSite: "none",       // Cross-origin support
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
}));
```

### Session Data Interface

```typescript
declare module 'express-session' {
  interface SessionData {
    userId: string;
    role: string;
    buildingId?: string;           // Building portal access
    strataPlanNumber?: string;     // Building portal access
    staffPermissions?: string[];   // Staff account permissions
  }
}
```

### Authentication Middleware (server/routes.ts)

```typescript
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized - Please log in" });
  }
  // Update last activity timestamp (skipped for superuser)
  if (req.session.userId !== 'superuser') {
    // Activity tracking logic
  }
  next();
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId || !req.session.role) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!roles.includes(req.session.role)) {
      return res.status(403).json({ message: "Forbidden - Insufficient permissions" });
    }
    next();
  };
}
```

### Password Strength Validation

```typescript
function validatePasswordStrength(password: string): { valid: boolean; message: string } {
  if (!password || password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one number" };
  }
  return { valid: true, message: "" };
}
```

### WebSocket Authentication (server/websocket-hub.ts)

```typescript
// Parse session cookie from WebSocket upgrade request
const cookies = cookie.parse(req.headers.cookie || '');
const sessionCookie = cookies[SESSION_COOKIE_NAME];

// Verify signature
const decodedCookie = decodeURIComponent(sessionCookie);
if (!decodedCookie.startsWith('s:')) {
  ws.close(1008, 'Invalid session');
  return;
}
const signedValue = decodedCookie.slice(2);
const sessionId = cookieSignature.unsign(signedValue, SESSION_SECRET);

// Lookup session in database
const result = await pool.query(
  'SELECT sess, expire FROM sessions WHERE sid = $1',
  [sessionId]
);
```

---

## Multi-Tenant Considerations

### Data Isolation by Role

| Role | Company Scope | Data Access |
|------|---------------|-------------|
| `company` | Own company | All company data |
| `rope_access_tech` | Linked companies | Personal data + assigned projects |
| `ground_crew` | Linked company | Personal data + assigned projects |
| `property_manager` | Linked companies | Buildings + projects (read-only) |
| `resident` | Strata building | Own complaints + project updates |
| `building_manager` | Single building | Building data + residents |
| `staff` | Platform-wide | Per permission grants |
| `superuser` | Platform-wide | All data |

### Query Patterns

```typescript
// Always filter by companyId for company-scoped queries
const employees = await db.select()
  .from(users)
  .where(eq(users.companyId, currentUser.companyId));

// For technicians, check connections
const connections = await db.select()
  .from(technicianEmployerConnections)
  .where(eq(technicianEmployerConnections.technicianId, currentUser.id));
```

---

## Safety & Compliance

### Safety-Critical Elements

| Element | Why It's Critical | Failure Mode | Mitigation |
|---------|-------------------|--------------|------------|
| Session integrity | Protects safety data access | Unauthorized access | Signed cookies, DB validation |
| Password strength | Prevents brute force | Account compromise | Validation rules, rate limiting |
| Role enforcement | Protects multi-tenant data | Data leakage | requireRole middleware |
| Token expiry | Limits password reset window | Stale tokens | 1-hour expiry, hashed storage |

### Audit Trail

All authentication events are logged:
- Login attempts (success/failure)
- Registration events
- Password reset requests
- Session creation/destruction

---

## Error Handling & Recovery

### Common Errors

| Error | HTTP Code | User Message | Recovery Action |
|-------|-----------|--------------|-----------------|
| Invalid credentials | 401 | "Invalid credentials" | Re-enter credentials |
| Rate limited | 429 | "Too many login attempts. Please try again after 15 minutes." | Wait 15 minutes |
| Account terminated | 403 | "Your employment has been terminated..." | Contact administrator |
| Account suspended | 403 | "Your account access has been suspended..." | Contact employer |
| Account disabled | 403 | "Your account has been suspended..." | Contact support |
| Duplicate email | 400 | "Unable to create account with these details..." | Use login instead |
| Duplicate license | 400 | "An account with this IRATA license number already exists..." | Use login or contact support |
| Invalid company code | 400 | "Invalid property manager code..." | Verify code with company |
| Unit conflict | 409 | "This unit is already linked..." | Confirm takeover |

### Graceful Degradation

- **Session expiry**: Redirect to login with "session expired" message
- **Database unavailable**: Return 503 with retry guidance
- **Rate limit exceeded**: Clear message with wait time

---

## Testing Requirements

### Unit Tests

```typescript
describe('Password Validation', () => {
  test('rejects passwords under 8 characters', () => {
    const result = validatePasswordStrength('Short1');
    expect(result.valid).toBe(false);
  });
  
  test('requires uppercase letter', () => {
    const result = validatePasswordStrength('lowercase1');
    expect(result.valid).toBe(false);
  });
  
  test('accepts valid password', () => {
    const result = validatePasswordStrength('ValidPass123');
    expect(result.valid).toBe(true);
  });
});
```

### Integration Tests

- **Multi-tenant isolation**: Login as company A cannot access company B data
- **Role permissions**: Technician cannot access company admin features
- **Session persistence**: Session survives server restart
- **Rate limiting**: 11th login attempt blocked

---

## Monitoring & Maintenance

### Key Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Login success rate | >95% | <90% |
| Registration completion | >80% | <70% |
| Password reset completion | >70% | <50% |
| Session creation latency | <200ms | >500ms |

### Regular Maintenance

- **Daily**: Monitor failed login spikes (potential attacks)
- **Weekly**: Review rate limit triggers
- **Monthly**: Audit session table size, clean expired sessions

---

## Troubleshooting Guide

### Issue: User Cannot Log In

**Symptoms**: Valid credentials rejected

**Diagnosis Steps**:
1. Check if email exists in users table
2. Verify password hash matches
3. Check `terminatedDate`, `suspendedAt`, `isDisabled` flags
4. Review rate limit status

**Solution**: Clear flags or reset password if needed

---

### Issue: Session Not Persisting

**Symptoms**: User logged in but redirected to login on next request

**Diagnosis Steps**:
1. Check browser cookies for `connect.sid`
2. Verify sessions table has entry with matching sid
3. Check session expiry timestamp
4. Confirm secure/sameSite settings match deployment

**Solution**: Ensure HTTPS and proper cookie configuration

---

### Issue: Password Reset Email Not Received

**Symptoms**: User requests reset but no email arrives

**Diagnosis Steps**:
1. Check SendGrid logs for delivery status
2. Verify `passwordResetToken` stored in users table
3. Check spam folders
4. Verify email address is correct

**Solution**: Resend or manually generate reset link

---

## Related Documentation

- `1. GUIDING_PRINCIPLES.md` - Core philosophy, security requirements
- `2. INSTRUCTION_DOCUMENT_CREATION_GUIDE.md` - Documentation standards
- `dashboards/` - Role-specific dashboard documentation
- `work-session-management-instructions-v1.0.md` - Time tracking requiring authentication

---

## Version History

- **v1.0** (December 25, 2024): Initial comprehensive documentation covering all 8 stakeholder types, sign-up journeys, unified login flow, password reset, session management, and security architecture
