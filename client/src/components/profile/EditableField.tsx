import { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface EditableFieldProps<T extends FieldValues> {
  isEditing: boolean;
  name: Path<T>;
  label: string | React.ReactNode;
  value: string | null | undefined;
  control?: Control<T>;
  type?: "text" | "email" | "tel" | "password" | "number";
  placeholder?: string;
  icon?: React.ReactNode;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  masked?: boolean;
  maskChar?: string;
  showLastN?: number;
  formatValue?: (value: string) => string | null;
  emptyText?: string;
  testId?: string;
  className?: string;
}

function maskValue(value: string, showLastN: number = 4, maskChar: string = "x"): string {
  if (!value || value.length <= showLastN) return value;
  const visible = value.slice(-showLastN);
  const masked = maskChar.repeat(Math.max(0, value.length - showLastN));
  return masked + visible;
}

export function EditableField<T extends FieldValues>({
  isEditing,
  name,
  label,
  value,
  control,
  type = "text",
  placeholder,
  icon,
  helpText,
  required,
  disabled,
  masked = false,
  maskChar = "x",
  showLastN = 4,
  formatValue,
  emptyText = "Not provided",
  testId,
  className = "",
}: EditableFieldProps<T>) {
  const baseTestId = testId || `field-${String(name)}`;

  if (isEditing && control) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            <FormLabel className="flex items-center gap-2">
              {icon}
              <span>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                value={field.value ?? ""}
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

  let displayValue: string | null = null;

  if (value) {
    if (formatValue) {
      displayValue = formatValue(value);
    } else if (masked) {
      displayValue = maskValue(value, showLastN, maskChar);
    } else {
      displayValue = value;
    }
  }

  return (
    <div className={cn("space-y-1", className)} data-testid={`view-${baseTestId}`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-base" aria-label={masked && value ? `${label}: Value set, partially hidden for security` : undefined}>
        {displayValue || <span className="text-muted-foreground">{emptyText}</span>}
      </p>
    </div>
  );
}
