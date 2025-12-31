import { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface SelectOption {
  value: string;
  label: string;
}

interface EditableSelectProps<T extends FieldValues> {
  isEditing: boolean;
  name: Path<T>;
  label: string | React.ReactNode;
  value: string | null | undefined;
  options: SelectOption[];
  control?: Control<T>;
  placeholder?: string;
  icon?: React.ReactNode;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  emptyText?: string;
  testId?: string;
  className?: string;
}

export function EditableSelect<T extends FieldValues>({
  isEditing,
  name,
  label,
  value,
  options,
  control,
  placeholder,
  icon,
  helpText,
  required,
  disabled,
  emptyText,
  testId,
  className = "",
}: EditableSelectProps<T>) {
  const { t } = useTranslation();
  const defaultPlaceholder = placeholder ?? t('profile.selectOption', 'Select an option');
  const defaultEmptyText = emptyText ?? t('profile.notSelected', 'Not selected');
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
            <Select
              onValueChange={field.onChange}
              value={field.value || undefined}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger data-testid={`select-${baseTestId}`}>
                  <SelectValue placeholder={defaultPlaceholder} />
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

  const displayValue = options.find((opt) => opt.value === value)?.label;

  return (
    <div className={cn("space-y-1", className)} data-testid={`view-${baseTestId}`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-base">
        {displayValue || <span className="text-muted-foreground">{defaultEmptyText}</span>}
      </p>
    </div>
  );
}
