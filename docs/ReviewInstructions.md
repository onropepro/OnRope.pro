# Review Instructions

This document defines the comprehensive review process for features and implementations. When this document is referenced, it means a full functionality review with zero possible errors.

## Review Checklist

Every review must verify ALL of the following before completion:

### 1. Backend Code
- [ ] Backend code reviewed and working
- [ ] All server-side logic correct
- [ ] Error handling implemented
- [ ] Authentication/authorization checks in place

### 2. Frontend Code
- [ ] Frontend code reviewed and working
- [ ] UI components render correctly
- [ ] User interactions function as expected
- [ ] Loading and error states handled

### 3. Database Schema
- [ ] Database schema correct
- [ ] All tables created and available
- [ ] Relationships properly defined
- [ ] Migrations applied successfully

### 4. API Routes
- [ ] Routes tested and functional
- [ ] Correct HTTP methods used
- [ ] Proper request validation
- [ ] Appropriate response codes returned

### 5. Code Quality
- [ ] No LSP errors
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Code follows project conventions

### 6. API Communication
- [ ] API wording correct
- [ ] API calls returning correct data
- [ ] Request/response payloads accurate
- [ ] Error messages clear and helpful

### 7. Endpoint Testing
- [ ] Every endpoint tested
- [ ] All CRUD operations verified
- [ ] Edge cases handled
- [ ] Authentication flows validated

## Review Process

**Testing continues until NO errors remain and ALL items above are cleared.**

Using this document means full functionality verification with no possible errors.

## Architect Requirement

**Use Architect tool EVERY SINGLE TIME during review.**

---

## Rule 2: Stay Within Scope

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
