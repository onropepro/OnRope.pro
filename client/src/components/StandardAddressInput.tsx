import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export type AddressData = {
  streetAddress: string;
  city: string;
  provinceState: string;
  country: string;
  postalCode: string;
  formatted?: string;
  latitude?: number | null;
  longitude?: number | null;
};

type GeoapifyResult = {
  formatted: string;
  street: string;
  houseNumber: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  latitude: number | null;
  longitude: number | null;
};

type StandardAddressInputProps = {
  value: Partial<AddressData>;
  onChange: (address: AddressData) => void;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  showLabels?: boolean;
  className?: string;
  testIdPrefix?: string;
  labels?: {
    search?: string;
    streetAddress?: string;
    city?: string;
    provinceState?: string;
    country?: string;
    postalCode?: string;
  };
};

export function StandardAddressInput({
  value,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  showLabels = true,
  className = "",
  testIdPrefix = "address",
  labels,
}: StandardAddressInputProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoapifyResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const defaultLabels = {
    search: t('address.searchPlaceholder', 'Search for an address...'),
    streetAddress: t('address.streetAddress', 'Street Address'),
    city: t('address.city', 'City'),
    provinceState: t('address.provinceState', 'Province/State'),
    country: t('address.country', 'Country'),
    postalCode: t('address.postalCode', 'Postal/ZIP Code'),
  };

  const mergedLabels = { ...defaultLabels, ...labels };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const searchAddresses = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/address-autocomplete?query=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.results || []);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      }
    } catch (error) {
      console.error("Address search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (inputValue: string) => {
    setSearchQuery(inputValue);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchAddresses(inputValue);
    }, 300);
  };

  const handleSelect = (result: GeoapifyResult) => {
    const streetAddress = result.houseNumber 
      ? `${result.houseNumber} ${result.street || ''}`.trim()
      : result.street || '';
    
    const newAddress: AddressData = {
      streetAddress,
      city: result.city || '',
      provinceState: result.state || '',
      country: result.country || '',
      postalCode: result.postcode || '',
      formatted: result.formatted,
      latitude: result.latitude,
      longitude: result.longitude,
    };
    
    onChange(newAddress);
    setSearchQuery('');
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

  const handleFieldChange = (field: keyof AddressData, fieldValue: string) => {
    onChange({
      streetAddress: value.streetAddress || '',
      city: value.city || '',
      provinceState: value.provinceState || '',
      country: value.country || '',
      postalCode: value.postalCode || '',
      latitude: value.latitude,
      longitude: value.longitude,
      [field]: fieldValue,
    });
  };

  return (
    <div ref={containerRef} className={cn("space-y-4", className)}>
      <div className="relative">
        {showLabels && (
          <Label className="flex items-center gap-2 mb-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            {t('address.searchLabel', 'Search Address')}
          </Label>
        )}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={mergedLabels.search}
            className="pl-10 pr-10"
            disabled={disabled}
            data-testid={`input-${testIdPrefix}-search`}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
          )}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-[9999] w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                data-testid={`${testIdPrefix}-suggestion-${index}`}
                className={`w-full px-3 py-2 text-left text-sm flex items-start gap-2 hover-elevate ${
                  index === selectedIndex ? "bg-accent" : ""
                }`}
                onClick={() => handleSelect(suggestion)}
              >
                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                <span className="line-clamp-2">{suggestion.formatted}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          {showLabels && <Label className="mb-2 block">{mergedLabels.streetAddress}{required && ' *'}</Label>}
          <Input
            type="text"
            value={value.streetAddress || ''}
            onChange={(e) => handleFieldChange('streetAddress', e.target.value)}
            onBlur={onBlur}
            placeholder={mergedLabels.streetAddress}
            disabled={disabled}
            data-testid={`input-${testIdPrefix}-street`}
          />
        </div>

        <div>
          {showLabels && <Label className="mb-2 block">{mergedLabels.city}{required && ' *'}</Label>}
          <Input
            type="text"
            value={value.city || ''}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            onBlur={onBlur}
            placeholder={mergedLabels.city}
            disabled={disabled}
            data-testid={`input-${testIdPrefix}-city`}
          />
        </div>

        <div>
          {showLabels && <Label className="mb-2 block">{mergedLabels.provinceState}{required && ' *'}</Label>}
          <Input
            type="text"
            value={value.provinceState || ''}
            onChange={(e) => handleFieldChange('provinceState', e.target.value)}
            onBlur={onBlur}
            placeholder={mergedLabels.provinceState}
            disabled={disabled}
            data-testid={`input-${testIdPrefix}-province`}
          />
        </div>

        <div>
          {showLabels && <Label className="mb-2 block">{mergedLabels.country}</Label>}
          <Input
            type="text"
            value={value.country || ''}
            onChange={(e) => handleFieldChange('country', e.target.value)}
            onBlur={onBlur}
            placeholder={mergedLabels.country}
            disabled={disabled}
            data-testid={`input-${testIdPrefix}-country`}
          />
        </div>

        <div>
          {showLabels && <Label className="mb-2 block">{mergedLabels.postalCode}</Label>}
          <Input
            type="text"
            value={value.postalCode || ''}
            onChange={(e) => handleFieldChange('postalCode', e.target.value)}
            onBlur={onBlur}
            placeholder={mergedLabels.postalCode}
            disabled={disabled}
            data-testid={`input-${testIdPrefix}-postal`}
          />
        </div>
      </div>
    </div>
  );
}

export function formatAddress(address: Partial<AddressData>): string {
  const parts: string[] = [];
  
  if (address.streetAddress) {
    parts.push(address.streetAddress);
  }
  
  const cityStatePostal = [
    address.city,
    address.provinceState,
    address.postalCode
  ].filter(Boolean).join(' ');
  
  if (cityStatePostal) {
    parts.push(cityStatePostal);
  }
  
  if (address.country) {
    parts.push(address.country);
  }
  
  return parts.join(', ');
}

export function AddressDisplay({ 
  address, 
  className = "",
  showIcon = true,
  emptyText,
}: { 
  address: Partial<AddressData>; 
  className?: string;
  showIcon?: boolean;
  emptyText?: string;
}) {
  const { t } = useTranslation();
  const hasAddress = address.streetAddress || address.city || address.provinceState;
  
  if (!hasAddress) {
    return (
      <p className={cn("text-muted-foreground", className)}>
        {emptyText || t('address.noAddressProvided', 'No address provided')}
      </p>
    );
  }

  return (
    <div className={cn("flex items-start gap-2", className)}>
      {showIcon && <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />}
      <div>
        {address.streetAddress && (
          <p className="text-foreground">{address.streetAddress}</p>
        )}
        <p className="text-foreground">
          {[address.city, address.provinceState, address.postalCode].filter(Boolean).join(' ')}
        </p>
        {address.country && (
          <p className="text-muted-foreground">{address.country}</p>
        )}
      </div>
    </div>
  );
}
