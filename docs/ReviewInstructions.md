# Review Instructions

This document defines the comprehensive review process for features and implementations. When this document is referenced, it means a full functionality review with zero possible errors.

---

## Required Output Format

When completing a review, the output MUST follow this exact structure:

```
## REVIEW REPORT: [Feature Name]

### 1. Backend Code
- Status: [PASS/FAIL]
- Server-side logic: [Verified/Issue Found]
- Error handling: [Implemented/Missing]
- Auth checks: [In Place/Missing]
- Notes: [Any findings]

### 2. Frontend Code
- Status: [PASS/FAIL]
- UI renders correctly: [Yes/No]
- User interactions: [Working/Broken]
- Loading states: [Handled/Missing]
- Error states: [Handled/Missing]
- Notes: [Any findings]

### 3. Database Schema
- Status: [PASS/FAIL]
- Tables exist: [Yes/No]
- Relationships correct: [Yes/No]
- Migrations applied: [Yes/No]
- Notes: [Any findings]

### 4. API Routes
- Status: [PASS/FAIL]
- Routes tested: [List endpoints tested]
- HTTP methods: [Correct/Issues]
- Request validation: [Implemented/Missing]
- Response codes: [Appropriate/Issues]
- Notes: [Any findings]

### 5. Code Quality
- Status: [PASS/FAIL]
- LSP errors: [None/Count]
- TypeScript errors: [None/Count]
- Console errors: [None/Count]
- Follows conventions: [Yes/No]
- Notes: [Any findings]

### 6. API Communication
- Status: [PASS/FAIL]
- API wording: [Correct/Issues]
- Data returned: [Correct/Issues]
- Payloads accurate: [Yes/No]
- Error messages: [Clear/Unclear]
- Notes: [Any findings]

### 7. Endpoint Testing
- Status: [PASS/FAIL]
- Endpoints tested: [List all tested]
- CRUD verified: [Create/Read/Update/Delete - each marked]
- Edge cases: [Handled/Not tested]
- Auth flows: [Validated/Issues]
- Notes: [Any findings]

### OVERALL STATUS: [PASS/FAIL]

### Issues Found:
1. [Issue description and location]
2. [Issue description and location]

### Fixes Applied:
1. [Fix description]
2. [Fix description]

### Remaining Items:
1. [Any items still pending]
```

---

## Review Process

**Testing continues until NO errors remain and ALL sections show PASS.**

Using this document means full functionality verification with no possible errors.

**Use Architect tool EVERY SINGLE TIME during review.**

---

## Scope Rules

### DO NOT:
- Wander away doing things that were not asked
- Freelance or add extra features
- Assume - ask if unclear
- Touch code that does not need to be touched
- Add functions that were not asked to be added
- Alter any other function or feature of the app unless approved by the user

### DO:
- Complete only what was explicitly requested
- Ask clarifying questions when requirements are unclear
- Focus on the specific feature/fix being reviewed
- Document any out-of-scope issues for later discussion
