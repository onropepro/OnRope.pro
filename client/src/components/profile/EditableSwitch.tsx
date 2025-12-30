import { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EditableSwitchProps<T extends FieldValues> {
  isEditing: boolean;
  name: Path<T>;
  label: string | React.ReactNode;
  value: boolean | null | undefined;
  control?: Control<T>;
  icon?: React.ReactNode;
  helpText?: string;
  disabled?: boolean;
  enabledText?: string;
  disabledText?: string;
  testId?: string;
  className?: string;
}

export function EditableSwitch<T extends FieldValues>({
  isEditing,
  name,
  label,
  value,
  control,
  icon,
  helpText,
  disabled,
  enabledText = "Enabled",
  disabledText = "Disabled",
  testId,
  className = "",
}: EditableSwitchProps<T>) {
  const baseTestId = testId || `field-${String(name)}`;

  if (isEditing && control) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={cn("flex flex-row items-center justify-between rounded-lg border p-3", className)}>
            <div className="space-y-0.5">
              <FormLabel className="flex items-center gap-2 text-base">
                {icon}
                <span>{label}</span>
              </FormLabel>
              {helpText && (
                <p className="text-xs text-muted-foreground">{helpText}</p>
              )}
            </div>
            <FormControl>
              <Switch
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
                disabled={disabled}
                data-testid={`switch-${baseTestId}`}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  const isEnabled = value === true;

  return (
    <div className={cn("flex flex-row items-center justify-between rounded-lg border p-3", className)} data-testid={`view-${baseTestId}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <Badge variant={isEnabled ? "default" : "secondary"}>
        {isEnabled ? enabledText : disabledText}
      </Badge>
    </div>
  );
}
