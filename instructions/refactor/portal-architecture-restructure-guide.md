# Portal Architecture Restructure Guide

**Version**: 1.0  
**Created**: December 28, 2024  
**Status**: CRITICAL - Required before individual tab refactoring  
**Purpose**: Eliminate dual-tree architecture by restructuring Form/TabsContent layout

---

## 1. THE CRITICAL MISSING STEP

### 1.1 Why Previous Refactoring Attempts Failed

When applying EditableField components to individual tabs **without first restructuring the overall layout**, you will recreate the dual-tree architecture:

**What Happens:**
1. You place a "unified" TabsContent with EditableField inside the `{isEditing ? (<Form>...</Form>)` block
2. This block only renders when `isEditing=true`
3. In view mode (`isEditing=false`), the entire Form block doesn't render
4. The tab appears empty in view mode
5. You're forced to add a separate view-mode TabsContent → **dual tree recreated**

### 1.2 The Root Cause

The current TechnicianPortal structure wraps ALL TabsContent blocks inside a ternary:

```jsx
// CURRENT STRUCTURE (PROBLEMATIC)
{isEditing ? (
  <Form {...form}>
    <TabsContent value="personal">...</TabsContent>
    <TabsContent value="payroll">...</TabsContent>
    <TabsContent value="driver">...</TabsContent>
  </Form>
) : (
  <>
    <TabsContent value="personal">...</TabsContent>
    <TabsContent value="payroll">...</TabsContent>
    <TabsContent value="driver">...</TabsContent>
  </>
)}
```

**This ternary structure is the source of all dual-tree problems.** No amount of EditableField refactoring can fix this if the layout remains unchanged.

---

## 2. THE CORRECT ARCHITECTURE PATTERN

### 2.1 Target Structure

The TabsContent blocks must exist **once** and be wrapped conditionally by Form:

```jsx
// TARGET STRUCTURE (CORRECT)
const tabsContent = (
  <Tabs value={profileInnerTab} onValueChange={setProfileInnerTab}>
    <TabsList>...</TabsList>
    
    <TabsContent value="personal">
      <EditableField
        isEditing={isEditing}
        control={isEditing ? form.control : undefined}
        value={isEditing ? form.watch("email") : user.email}
        name="email"
        label={t.email}
      />
    </TabsContent>
    
    <TabsContent value="payroll">
      <EditableField
        isEditing={isEditing}
        control={isEditing ? form.control : undefined}
        value={isEditing ? form.watch("socialInsuranceNumber") : user.socialInsuranceNumber}
        name="socialInsuranceNumber"
        label="SIN"
        formatValue={(val) => maskSensitiveData(val)}
      />
    </TabsContent>
    
    {/* All other tabs... */}
  </Tabs>
);

// CONDITIONAL FORM WRAPPER
return (
  <Card>
    <CardHeader>...</CardHeader>
    <CardContent>
      {isEditing ? (
        <Form {...form}>{tabsContent}</Form>
      ) : (
        tabsContent
      )}
    </CardContent>
  </Card>
);
```

### 2.2 Why This Works

| Aspect | How It's Handled |
|--------|------------------|
| Single TabsContent per tab | TabsContent declared once in `tabsContent` variable |
| Form context when editing | `<Form {...form}>` wraps tabsContent when `isEditing=true` |
| No Form context when viewing | tabsContent rendered directly without Form wrapper |
| Field data in edit mode | `form.watch("fieldName")` provides current form value |
| Field data in view mode | `user.fieldName` provides database value |
| Form control for inputs | `control={isEditing ? form.control : undefined}` |
| No useFormContext errors | EditableField receives control as prop, not from context |

### 2.3 The Key Props Pattern

Every EditableField must receive these conditional props:

```tsx
<EditableField
  isEditing={isEditing}
  name="fieldName"
  label={t.fieldLabel}
  // Control: Only pass when editing (provides react-hook-form binding)
  control={isEditing ? form.control : undefined}
  // Value: Form value when editing, user data when viewing
  value={isEditing ? form.watch("fieldName") : user.fieldName}
  // Optional formatting for view mode
  formatValue={(val) => formatPhoneNumber(val)}
  // Optional empty state text
  emptyText={t.notProvided}
/>
```

---

## 3. STEP-BY-STEP REFACTORING SEQUENCE

### Phase 0: Layout Restructure (MUST DO FIRST)

**This phase must be completed before any individual tab refactoring.**

#### Step 0.1: Identify Current Ternary Boundaries

Find the lines where the dual-tree ternary starts and ends:

```bash
# Find where {isEditing ? ( starts
grep -n "isEditing ?" client/src/pages/TechnicianPortal.tsx

# Find where Form closes in edit branch
grep -n "</Form>" client/src/pages/TechnicianPortal.tsx
```

**Current Structure (TechnicianPortal.tsx as of Dec 2024):**
- Line ~3965: `{isEditing ? (`
- Line ~3966: `<Form {...form}>`
- Lines 3969-4447: Edit mode TabsContent blocks
- Line ~4448: `</Form>`
- Line ~4449: `) : (`
- Lines 4450-5700+: View mode TabsContent blocks
- Line ~5740+: `</>` closing fragment
- Line ~5741+: `)}` closing ternary

#### Step 0.2: Extract TabsList (Already Shared)

The TabsList (tab headers) is already outside the ternary - no changes needed:

```jsx
<Tabs value={profileInnerTab} onValueChange={setProfileInnerTab}>
  <TabsList>
    <TabsTrigger value="personal">...</TabsTrigger>
    <TabsTrigger value="certifications">...</TabsTrigger>
    {/* etc */}
  </TabsList>
  
  {/* The ternary with dual trees is INSIDE here */}
  {isEditing ? (...) : (...)}
</Tabs>
```

#### Step 0.3: Create Unified TabsContent Variable

Before the return statement, create a variable containing all TabsContent blocks:

```tsx
// BEFORE the component's return statement
const profileTabsContent = (
  <>
    {/* Hidden file input - always available */}
    <input
      type="file"
      ref={documentInputRef}
      accept="image/*,.pdf"
      onChange={handleDocumentUpload}
      className="hidden"
    />

    {/* PERSONAL INFORMATION TAB - UNIFIED */}
    <TabsContent value="personal" className="mt-0 space-y-6">
      {/* Migrate fields using EditableField components */}
    </TabsContent>

    {/* CERTIFICATIONS TAB - UNIFIED */}
    <TabsContent value="certifications" className="mt-0 space-y-6">
      {/* Migrate fields using EditableField components */}
    </TabsContent>

    {/* DRIVER TAB - UNIFIED */}
    <TabsContent value="driver" className="mt-0 space-y-6">
      {/* Migrate fields using EditableField components */}
    </TabsContent>

    {/* PAYROLL TAB - UNIFIED */}
    <TabsContent value="payroll" className="mt-0 space-y-6">
      {/* Migrate fields using EditableField components */}
    </TabsContent>

    {/* DOCUMENTS TAB - UNIFIED */}
    <TabsContent value="documents" className="mt-0 space-y-6">
      {/* Migrate content */}
    </TabsContent>
  </>
);
```

#### Step 0.4: Replace Ternary with Conditional Form Wrapper

Replace the entire `{isEditing ? (<Form>...</Form>) : (<>...</>)}` block with:

```tsx
<Tabs value={profileInnerTab} onValueChange={setProfileInnerTab}>
  <TabsList>
    {/* Tab headers remain unchanged */}
  </TabsList>

  {/* CONDITIONAL FORM WRAPPER */}
  {isEditing ? (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {profileTabsContent}
      </form>
    </Form>
  ) : (
    profileTabsContent
  )}
</Tabs>
```

#### Step 0.5: Verify Structure

After restructuring, verify:
1. Each tab value has exactly ONE TabsContent (not two)
2. TabsContent blocks are in the `profileTabsContent` variable
3. Form wrapper is conditional (only when editing)
4. No TabsContent blocks remain inside the old ternary branches

```bash
# Should show exactly 5 TabsContent (one per tab)
grep -c "TabsContent value=" client/src/pages/TechnicianPortal.tsx
```

---

## 4. MIGRATING INDIVIDUAL TABS

### 4.1 Order of Migration

Migrate tabs in order of complexity (simplest first):

1. **Driver Tab** (3 fields) - Validate the pattern
2. **Payroll Tab** (4 fields + documents) - Test masking
3. **Personal Information Tab** (13 fields) - Most fields, address autocomplete
4. **Certifications Tab** (complex) - IRATA/SPRAT verification
5. **Documents Tab** (file uploads) - Special handling

### 4.2 Migration Template

For each tab, follow this template:

```tsx
<TabsContent value="tabName" className="mt-0 space-y-6">
  <div className="space-y-6">
    {/* Section Header */}
    <div className="space-y-3">
      <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
        <IconComponent className="w-4 h-4" />
        {t.sectionTitle}
      </h3>
      
      {/* Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EditableField
          isEditing={isEditing}
          name="fieldName"
          label={t.fieldLabel}
          control={isEditing ? form.control : undefined}
          value={isEditing ? form.watch("fieldName") : user.fieldName}
          icon={<FieldIcon className="w-4 h-4" />}
          emptyText={t.notProvided}
          testId="field-name"
        />
        {/* More fields... */}
      </div>
    </div>

    {/* Conditional View-Only Content */}
    {!isEditing && someCondition && (
      <div>
        {/* Upload buttons, document displays, etc. */}
      </div>
    )}
  </div>
</TabsContent>
```

### 4.3 Handling View-Only Content

Some content only appears in view mode (upload buttons, document displays). Use inline conditionals:

```tsx
{/* Upload button - view mode only */}
{!isEditing && (
  <Button
    variant="outline"
    onClick={() => triggerUpload('docType')}
  >
    Upload Document
  </Button>
)}

{/* Document display - view mode only */}
{!isEditing && user.documents?.length > 0 && (
  <DocumentList documents={user.documents} />
)}
```

### 4.4 Handling Edit-Only Content

Some content only appears in edit mode (save/cancel buttons are handled elsewhere, but form-specific UI might exist):

```tsx
{/* Edit-only helper text */}
{isEditing && (
  <p className="text-sm text-muted-foreground">
    {t.editModeHelperText}
  </p>
)}
```

---

## 5. COMMON PITFALLS

### 5.1 Using useFormContext

**DON'T** use `useFormContext()` in EditableField components. It will crash when Form wrapper is absent (view mode).

```tsx
// BAD - crashes in view mode
const { control } = useFormContext();

// GOOD - receives control as prop
function EditableField({ control, isEditing, ... }) {
  if (isEditing && control) {
    // Use control
  }
}
```

### 5.2 Forgetting Conditional Control

**DON'T** pass form.control unconditionally:

```tsx
// BAD - errors when not editing
control={form.control}

// GOOD - undefined when not editing
control={isEditing ? form.control : undefined}
```

### 5.3 Wrong Value Source

**DON'T** use the same value source for both modes:

```tsx
// BAD - form.watch doesn't work without Form context
value={form.watch("field")}

// BAD - user.field doesn't update during editing
value={user.field}

// GOOD - conditional based on mode
value={isEditing ? form.watch("field") : user.field}
```

### 5.4 Nested Form Tags

**DON'T** add `<form>` tags inside TabsContent - the outer Form already provides it:

```tsx
// BAD - nested form
<TabsContent>
  <form onSubmit={...}>
    <EditableField ... />
  </form>
</TabsContent>

// GOOD - no nested form
<TabsContent>
  <EditableField ... />
</TabsContent>
```

---

## 6. VERIFICATION CHECKLIST

After completing the restructure:

- [ ] `grep -c "TabsContent value=" TechnicianPortal.tsx` returns exactly 5
- [ ] No `TabsContent` inside `{isEditing ? (` blocks
- [ ] `</Form>` appears exactly once (the conditional wrapper)
- [ ] All tabs render in view mode (test by clicking each tab)
- [ ] All tabs render in edit mode (click Edit, then each tab)
- [ ] Form submission still works (edit, save, verify API call)
- [ ] LSP errors: No new errors introduced
- [ ] All fields display data in view mode
- [ ] All fields are editable in edit mode

---

## 7. ROLLBACK PROCEDURE

If the restructure fails:

1. Revert to the last checkpoint: `git checkout HEAD~1 -- client/src/pages/TechnicianPortal.tsx`
2. The dual-tree structure will be restored
3. Identify what went wrong before retry
4. Consider doing the restructure in smaller increments

---

## 8. NEXT STEPS

After completing Phase 0 (Layout Restructure):

1. Migrate Driver tab (Phase 2 in production guide)
2. Migrate Payroll tab (Phase 4 in production guide)
3. Migrate Personal Information tab (Phase 3 in production guide)
4. Migrate Certifications tab (Phase 5 in production guide)
5. Migrate Documents tab (Phase 6 in production guide)
6. Apply same pattern to GroundCrewPortal (Phase 7 in production guide)
