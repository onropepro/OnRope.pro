import { Control, FieldValues, UseFormSetValue, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MapPin, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface AddressData {
  employeeStreetAddress?: string | null;
  employeeCity?: string | null;
  employeeProvinceState?: string | null;
  employeeCountry?: string | null;
  employeePostalCode?: string | null;
}

interface AddressFieldNames {
  streetAddress: string;
  city: string;
  provinceState: string;
  country: string;
  postalCode: string;
}

interface AddressLabels {
  address: string;
  streetAddress: string;
  city: string;
  provinceState: string;
  country: string;
  postalCode: string;
  helpText?: string;
  emptyText?: string;
}

interface EditableAddressFieldProps<T extends FieldValues> {
  isEditing: boolean;
  control?: Control<T>;
  setValue?: UseFormSetValue<T>;
  addressData: AddressData;
  labels: AddressLabels;
  fieldNames?: AddressFieldNames;
  testIdPrefix?: string;
  className?: string;
  onAddressSelect?: (address: {
    formatted: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  }) => void;
}

export function EditableAddressField<T extends FieldValues>({
  isEditing,
  control,
  setValue,
  addressData,
  labels,
  fieldNames = {
    streetAddress: "employeeStreetAddress",
    city: "employeeCity",
    provinceState: "employeeProvinceState",
    country: "employeeCountry",
    postalCode: "employeePostalCode",
  },
  testIdPrefix = "address",
  className = "",
  onAddressSelect,
}: EditableAddressFieldProps<T>) {
  if (isEditing && control) {
    return (
      <div className={cn("space-y-4", className)}>
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
            name={fieldNames.streetAddress as Path<T>}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>{labels.streetAddress}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder={labels.streetAddress}
                    data-testid={`input-${testIdPrefix}-street`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={fieldNames.city as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.city}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    data-testid={`input-${testIdPrefix}-city`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={fieldNames.provinceState as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.provinceState}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    data-testid={`input-${testIdPrefix}-province`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={fieldNames.country as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.country}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    data-testid={`input-${testIdPrefix}-country`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={fieldNames.postalCode as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.postalCode}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    data-testid={`input-${testIdPrefix}-postal`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  }

  const hasAddress =
    addressData.employeeStreetAddress ||
    addressData.employeeCity ||
    addressData.employeeProvinceState;

  return (
    <div className={cn("space-y-3", className)} data-testid={`view-${testIdPrefix}`}>
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
              {addressData.employeeStreetAddress}
              <br />
            </>
          )}
          {addressData.employeeCity && `${addressData.employeeCity}, `}
          {addressData.employeeProvinceState && `${addressData.employeeProvinceState} `}
          {addressData.employeePostalCode && addressData.employeePostalCode}
          {addressData.employeeCountry && (
            <>
              <br />
              {addressData.employeeCountry}
            </>
          )}
        </p>
      ) : (
        <p className="text-muted-foreground">{labels.emptyText || "No address provided"}</p>
      )}
    </div>
  );
}
