# EditableField Component Specification

**Version**: 1.0  
**Created**: December 28, 2024  
**Status**: SPECIFICATION - Pre-Implementation  

---

## 1. PURPOSE

The EditableField component is the cornerstone of the unified inline conditional rendering pattern. It replaces the dual-tree architecture by encapsulating both view and edit mode rendering in a single component, eliminating sync failures.

---

## 2. COMPONENT HIERARCHY

```
EditableField (base)
├── EditableTextField (text, email, tel, password)
├── EditableTextarea (multiline text)
├── EditableSelect (dropdown selection)
├── EditableSwitch (boolean toggle)
├── EditableDateField (date picker)
└── EditableAddressField (with autocomplete)
```

---

## 3. BASE EDITABLEFIELD API

```typescript
interface EditableFieldProps {
  // Mode Control
  isEditing: boolean;
  
  // Field Identity
  name: string;                    // Form field name (matches schema)
  label: string | ReactNode;       // Display label
  
  // Data
  value: string | number | boolean | null | undefined;
  control?: Control<any>;          // react-hook-form control (edit mode)
  
  // Display Options
  icon?: ReactNode;                // Icon to show beside label
  type?: 'text' | 'email' | 'tel' | 'date' | 'password';
  placeholder?: string;
  helpText?: string;
  
  // Validation
  required?: boolean;
  
  // Formatting (view mode only)
  formatter?: (value: any) => string | null;
  emptyText?: string;              // Text when value is null/undefined
  
  // Masking (view mode only)
  mask?: boolean;                  // Mask all but last 4 chars
  
  // Test ID
  testId?: string;                 // data-testid prefix
  
  // Layout
  className?: string;
  colSpan?: 1 | 2;                 // Grid column span
}
```

---

## 4. IMPLEMENTATION

### 4.1 Base Component

```tsx
// client/src/components/profile/EditableField.tsx

import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface EditableFieldProps {
  isEditing: boolean;
  name: string;
  label: string | React.ReactNode;
  value: string | number | null | undefined;
  control?: Control<any>;
  icon?: React.ReactNode;
  type?: 'text' | 'email' | 'tel' | 'date' | 'password';
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  formatter?: (value: any) => string | null;
  emptyText?: string;
  mask?: boolean;
  testId?: string;
  className?: string;
  colSpan?: 1 | 2;
}

function maskValue(value: string | null | undefined): string {
  if (!value) return '';
  if (value.length <= 4) return value;
  const visiblePart = value.slice(-4);
  const maskedLength = value.length - 4;
  return 'x'.repeat(maskedLength) + visiblePart;
}

export function EditableField({
  isEditing,
  name,
  label,
  value,
  control,
  icon,
  type = 'text',
  placeholder,
  helpText,
  required,
  formatter,
  emptyText = 'Not provided',
  mask = false,
  testId,
  className = '',
  colSpan = 1,
}: EditableFieldProps) {
  const colClass = colSpan === 2 ? 'md:col-span-2' : '';
  const baseTestId = testId || `field-${name}`;
  
  // EDIT MODE
  if (isEditing && control) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={`${colClass} ${className}`}>
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type={type}
                placeholder={placeholder}
                data-testid={`input-${baseTestId}`}
              />
            </FormControl>
            {helpText && (
              <p className="text-xs text-muted-foreground">{helpText}</p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
  
  // VIEW MODE
  let displayValue: string | null = null;
  
  if (value !== null && value !== undefined && value !== '') {
    if (formatter) {
      displayValue = formatter(value);
    } else if (mask) {
      displayValue = maskValue(String(value));
    } else {
      displayValue = String(value);
    }
  }
  
  return (
    <div className={`${colClass} ${className}`} data-testid={`view-${baseTestId}`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-base">
        {displayValue || <span className="text-muted-foreground">{emptyText}</span>}
      </p>
    </div>
  );
}
```

### 4.2 EditableTextarea

```tsx
// client/src/components/profile/EditableTextarea.tsx

import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface EditableTextareaProps {
  isEditing: boolean;
  name: string;
  label: string | React.ReactNode;
  value: string | null | undefined;
  control?: Control<any>;
  icon?: React.ReactNode;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  emptyText?: string;
  testId?: string;
  className?: string;
  rows?: number;
}

export function EditableTextarea({
  isEditing,
  name,
  label,
  value,
  control,
  icon,
  placeholder,
  helpText,
  required,
  emptyText = 'Not provided',
  testId,
  className = '',
  rows = 3,
}: EditableTextareaProps) {
  const baseTestId = testId || `field-${name}`;
  
  // EDIT MODE
  if (isEditing && control) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder={placeholder}
                className={`min-h-[${rows * 24}px]`}
                data-testid={`input-${baseTestId}`}
              />
            </FormControl>
            {helpText && (
              <p className="text-xs text-muted-foreground">{helpText}</p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
  
  // VIEW MODE
  return (
    <div className={className} data-testid={`view-${baseTestId}`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-base whitespace-pre-wrap">
        {value || <span className="text-muted-foreground">{emptyText}</span>}
      </p>
    </div>
  );
}
```

### 4.3 EditableSelect

```tsx
// client/src/components/profile/EditableSelect.tsx

import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectOption {
  value: string;
  label: string;
}

interface EditableSelectProps {
  isEditing: boolean;
  name: string;
  label: string | React.ReactNode;
  value: string | null | undefined;
  control?: Control<any>;
  options: SelectOption[];
  icon?: React.ReactNode;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  emptyText?: string;
  testId?: string;
  className?: string;
}

export function EditableSelect({
  isEditing,
  name,
  label,
  value,
  control,
  options,
  icon,
  placeholder,
  helpText,
  required,
  emptyText = 'Not provided',
  testId,
  className = '',
}: EditableSelectProps) {
  const baseTestId = testId || `field-${name}`;
  
  // Find display label for current value
  const displayLabel = options.find(opt => opt.value === value)?.label || value;
  
  // EDIT MODE
  if (isEditing && control) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger data-testid={`select-${baseTestId}`}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {helpText && (
              <p className="text-xs text-muted-foreground">{helpText}</p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
  
  // VIEW MODE
  return (
    <div className={className} data-testid={`view-${baseTestId}`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-base">
        {displayLabel || <span className="text-muted-foreground">{emptyText}</span>}
      </p>
    </div>
  );
}
```

### 4.4 EditableSwitch

```tsx
// client/src/components/profile/EditableSwitch.tsx

import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface EditableSwitchProps {
  isEditing: boolean;
  name: string;
  label: string;
  description?: string;
  value: boolean | null | undefined;
  control?: Control<any>;
  icon?: React.ReactNode;
  testId?: string;
  className?: string;
  enabledText?: string;
  disabledText?: string;
}

export function EditableSwitch({
  isEditing,
  name,
  label,
  description,
  value,
  control,
  icon,
  testId,
  className = '',
  enabledText = 'Enabled',
  disabledText = 'Disabled',
}: EditableSwitchProps) {
  const baseTestId = testId || `field-${name}`;
  
  // EDIT MODE
  if (isEditing && control) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={`flex flex-row items-center justify-between gap-2 rounded-lg border p-3 ${className}`}>
            <div className="space-y-0.5">
              <FormLabel className="text-sm font-medium flex items-center gap-2">
                {icon}
                {label}
              </FormLabel>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            <FormControl>
              <Switch
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
                data-testid={`switch-${baseTestId}`}
              />
            </FormControl>
          </FormItem>
        )}
      />
    );
  }
  
  // VIEW MODE
  return (
    <div className={`flex flex-row items-center justify-between gap-2 rounded-lg border p-3 ${className}`} data-testid={`view-${baseTestId}`}>
      <div className="space-y-0.5">
        <div className="text-sm font-medium flex items-center gap-2">
          {icon}
          {label}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Badge variant={value ? "default" : "secondary"}>
        {value ? enabledText : disabledText}
      </Badge>
    </div>
  );
}
```

### 4.5 EditableDateField

```tsx
// client/src/components/profile/EditableDateField.tsx

import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatLocalDate } from "@/lib/dateUtils";
import { Calendar } from "lucide-react";

interface EditableDateFieldProps {
  isEditing: boolean;
  name: string;
  label: string | React.ReactNode;
  value: string | null | undefined;
  control?: Control<any>;
  icon?: React.ReactNode;
  helpText?: string;
  required?: boolean;
  emptyText?: string;
  testId?: string;
  className?: string;
}

export function EditableDateField({
  isEditing,
  name,
  label,
  value,
  control,
  icon = <Calendar className="w-4 h-4" />,
  helpText,
  required,
  emptyText = 'Not set',
  testId,
  className = '',
}: EditableDateFieldProps) {
  const baseTestId = testId || `field-${name}`;
  
  // EDIT MODE
  if (isEditing && control) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="date"
                data-testid={`input-${baseTestId}`}
              />
            </FormControl>
            {helpText && (
              <p className="text-xs text-muted-foreground">{helpText}</p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
  
  // VIEW MODE
  let displayValue: string | null = null;
  
  if (value) {
    try {
      displayValue = formatLocalDate(value);
    } catch {
      displayValue = value;
    }
  }
  
  return (
    <div className={className} data-testid={`view-${baseTestId}`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-base">
        {displayValue || <span className="text-muted-foreground">{emptyText}</span>}
      </p>
    </div>
  );
}
```

### 4.6 EditableAddressField

```tsx
// client/src/components/profile/EditableAddressField.tsx

import { Control, UseFormSetValue } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { MapPin, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AddressData {
  employeeStreetAddress: string | null;
  employeeCity: string | null;
  employeeProvinceState: string | null;
  employeeCountry: string | null;
  employeePostalCode: string | null;
}

interface EditableAddressFieldProps {
  isEditing: boolean;
  control?: Control<any>;
  setValue?: UseFormSetValue<any>;
  addressData: AddressData;
  labels: {
    address: string;
    streetAddress: string;
    city: string;
    provinceState: string;
    country: string;
    postalCode: string;
    helpText?: string;
  };
  testIdPrefix?: string;
  className?: string;
}

export function EditableAddressField({
  isEditing,
  control,
  setValue,
  addressData,
  labels,
  testIdPrefix = 'address',
  className = '',
}: EditableAddressFieldProps) {
  // EDIT MODE
  if (isEditing && control && setValue) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="font-medium flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {labels.address}
          {labels.helpText && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{labels.helpText}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="employeeStreetAddress"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>{labels.streetAddress}</FormLabel>
                <FormControl>
                  <AddressAutocomplete
                    data-testid={`input-${testIdPrefix}-street`}
                    placeholder={labels.streetAddress}
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    onSelect={(address) => {
                      field.onChange(address.formatted);
                      setValue('employeeCity', address.city || '');
                      setValue('employeeProvinceState', address.state || '');
                      setValue('employeeCountry', address.country || '');
                      setValue('employeePostalCode', address.postcode || '');
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="employeeCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.city}</FormLabel>
                <FormControl>
                  <Input {...field} data-testid={`input-${testIdPrefix}-city`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="employeeProvinceState"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.provinceState}</FormLabel>
                <FormControl>
                  <Input {...field} data-testid={`input-${testIdPrefix}-province`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="employeeCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.country}</FormLabel>
                <FormControl>
                  <Input {...field} data-testid={`input-${testIdPrefix}-country`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="employeePostalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.postalCode}</FormLabel>
                <FormControl>
                  <Input {...field} data-testid={`input-${testIdPrefix}-postal`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  }
  
  // VIEW MODE
  const hasAddress = addressData.employeeStreetAddress || 
                     addressData.employeeCity || 
                     addressData.employeeProvinceState;
  
  return (
    <div className={`space-y-3 ${className}`} data-testid={`view-${testIdPrefix}`}>
      <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
        <MapPin className="w-4 h-4" />
        {labels.address}
        {labels.helpText && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{labels.helpText}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </h3>
      {hasAddress ? (
        <p className="text-base">
          {addressData.employeeStreetAddress && (
            <>
              {addressData.employeeStreetAddress}<br />
            </>
          )}
          {addressData.employeeCity && `${addressData.employeeCity}, `}
          {addressData.employeeProvinceState && `${addressData.employeeProvinceState} `}
          {addressData.employeePostalCode && addressData.employeePostalCode}
          {addressData.employeeCountry && (
            <>
              <br />{addressData.employeeCountry}
            </>
          )}
        </p>
      ) : (
        <p className="text-muted-foreground">No address provided</p>
      )}
    </div>
  );
}
```

### 4.7 Barrel Export

```tsx
// client/src/components/profile/index.ts

export { EditableField } from './EditableField';
export { EditableTextarea } from './EditableTextarea';
export { EditableSelect } from './EditableSelect';
export { EditableSwitch } from './EditableSwitch';
export { EditableDateField } from './EditableDateField';
export { EditableAddressField } from './EditableAddressField';
```

---

## 5. USAGE EXAMPLES

### 5.1 Simple Text Field

```tsx
// Before (dual-tree)
{isEditing ? (
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>{t.email}</FormLabel>
        <FormControl>
          <Input {...field} type="email" data-testid="input-email" />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
) : (
  <InfoItem label={t.email} value={user.email} icon={<Mail />} />
)}

// After (unified)
<EditableField
  isEditing={isEditing}
  name="email"
  label={t.email}
  value={user.email}
  control={form.control}
  type="email"
  icon={<Mail className="w-4 h-4" />}
  testId="email"
/>
```

### 5.2 Masked Field (SIN, Bank Account)

```tsx
<EditableField
  isEditing={isEditing}
  name="socialInsuranceNumber"
  label={t.sin}
  value={user.socialInsuranceNumber}
  control={form.control}
  mask={true}
  placeholder="Optional"
  testId="sin"
/>
```

### 5.3 Date Field with Formatter

```tsx
<EditableField
  isEditing={isEditing}
  name="birthday"
  label={<>{t.birthday} <span className="text-muted-foreground font-normal text-sm">(mm/dd/yyyy)</span></>}
  value={user.birthday}
  control={form.control}
  type="date"
  formatter={(val) => formatLocalDate(val)}
  icon={<Calendar className="w-4 h-4" />}
  testId="birthday"
/>
```

### 5.4 Select Field

```tsx
<EditableSelect
  isEditing={isEditing}
  name="emergencyContactRelationship"
  label={t.relationship}
  value={user.emergencyContactRelationship}
  control={form.control}
  placeholder={t.relationshipPlaceholder}
  options={[
    { value: "mother", label: t.relationshipOptions.mother },
    { value: "father", label: t.relationshipOptions.father },
    { value: "spouse", label: t.relationshipOptions.spouse },
    // ... other options
  ]}
  testId="emergency-relationship"
/>
```

### 5.5 Toggle Switch

```tsx
<EditableSwitch
  isEditing={isEditing}
  name="smsNotificationsEnabled"
  label={t.smsNotifications}
  description={t.smsNotificationsDescription}
  value={user.smsNotificationsEnabled}
  control={form.control}
  testId="sms-notifications"
  enabledText={t.enabled}
  disabledText={t.disabled}
/>
```

---

## 6. TESTING REQUIREMENTS

### 6.1 Unit Tests

Each component must have tests for:
- Edit mode rendering
- View mode rendering
- Empty value handling
- Masked value display
- Formatter function
- Required field indicator
- Test ID generation

### 6.2 Integration Tests

- Form submission with EditableField
- Validation error display
- Value persistence after save

---

## 7. ACCESSIBILITY

All components must:
- Use proper label associations
- Support keyboard navigation
- Have appropriate ARIA attributes
- Work with screen readers

### 7.1 Masked Field Accessibility

For fields that display masked values (SIN, bank accounts), special accessibility considerations apply:

```tsx
// Accessible masked field implementation
function AccessibleMaskedField({ label, maskedValue, fullValue }) {
  return (
    <div 
      role="group" 
      aria-labelledby="field-label"
    >
      <span id="field-label" className="sr-only">
        {label}: {fullValue ? 'Value set, partially hidden for security' : 'Not provided'}
      </span>
      <div aria-hidden="true">
        {maskedValue || 'Not provided'}
      </div>
    </div>
  );
}
```

**Requirements**:
| Requirement | Implementation |
|-------------|----------------|
| Screen reader announcement | `aria-label` or `sr-only` text for masked values |
| Security context | Announce "partially hidden" or "masked" |
| Empty state | Clear announcement when no value set |
| Focus order | Logical tab order maintained |

### 7.2 Form Field Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Label association | `<FormLabel>` linked via `htmlFor` |
| Error announcement | `aria-describedby` for validation errors |
| Required fields | `aria-required="true"` attribute |
| Disabled state | `aria-disabled="true"` when appropriate |

### 7.3 Date Field Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Format hint | Include format in label (mm/dd/yyyy) |
| Date picker | Native HTML5 date input (keyboard accessible) |
| Clear instructions | Help text for expected format |

### 7.4 Select Field Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Combobox role | Shadcn Select provides correct roles |
| Option announcement | Each option has accessible name |
| Selection feedback | Selected value announced on change |

---

## 8. MIGRATION CHECKLIST

For each field migrated:
- [ ] Create EditableField usage
- [ ] Remove edit mode FormField
- [ ] Remove view mode InfoItem/display
- [ ] Verify form submission works
- [ ] Verify view mode displays correctly
- [ ] Test all 3 languages
- [ ] Run LSP diagnostics
