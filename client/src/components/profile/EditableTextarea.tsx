import { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface EditableTextareaProps<T extends FieldValues> {
  isEditing: boolean;
  name: Path<T>;
  label: string | React.ReactNode;
  value: string | null | undefined;
  control?: Control<T>;
  placeholder?: string;
  icon?: React.ReactNode;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  emptyText?: string;
  testId?: string;
  className?: string;
}

export function EditableTextarea<T extends FieldValues>({
  isEditing,
  name,
  label,
  value,
  control,
  placeholder,
  icon,
  helpText,
  required,
  disabled,
  rows = 3,
  emptyText = "Not provided",
  testId,
  className = "",
}: EditableTextareaProps<T>) {
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
              <Textarea
                {...field}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
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

  return (
    <div className={cn("space-y-1", className)} data-testid={`view-${baseTestId}`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      {value ? (
        <p className="text-base whitespace-pre-wrap">{value}</p>
      ) : (
        <p className="text-muted-foreground">{emptyText}</p>
      )}
    </div>
  );
}
