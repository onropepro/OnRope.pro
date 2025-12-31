import { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface EditableDateFieldProps<T extends FieldValues> {
  isEditing: boolean;
  name: Path<T>;
  label: string | React.ReactNode;
  value: string | Date | null | undefined;
  control?: Control<T>;
  icon?: React.ReactNode;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  emptyText?: string;
  testId?: string;
  className?: string;
  formatDate?: (date: string | Date) => string;
}

function defaultFormatDate(date: string | Date): string {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return String(date);
  }
}

export function EditableDateField<T extends FieldValues>({
  isEditing,
  name,
  label,
  value,
  control,
  icon,
  helpText,
  required,
  disabled,
  emptyText,
  testId,
  className = "",
  formatDate = defaultFormatDate,
}: EditableDateFieldProps<T>) {
  const { t } = useTranslation();
  const defaultEmptyText = emptyText ?? t('profile.notSet', 'Not set');
  const baseTestId = testId || `field-${String(name)}`;
  const defaultIcon = icon ?? <Calendar className="w-4 h-4" />;

  if (isEditing && control) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            <FormLabel className="flex items-center gap-2">
              {defaultIcon}
              <span>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="date"
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
    try {
      displayValue = formatDate(value);
    } catch {
      displayValue = String(value);
    }
  }

  return (
    <div className={cn("space-y-1", className)} data-testid={`view-${baseTestId}`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {defaultIcon}
        <span>{label}</span>
      </div>
      <p className="text-base">
        {displayValue || <span className="text-muted-foreground">{defaultEmptyText}</span>}
      </p>
    </div>
  );
}
