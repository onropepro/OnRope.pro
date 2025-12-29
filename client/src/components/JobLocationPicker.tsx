import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type JobLocationData = {
  jobCountry: string;
  jobProvinceState: string;
  jobCity: string;
};

type JobLocationPickerProps = {
  value: JobLocationData;
  onChange: (value: JobLocationData) => void;
  disabled?: boolean;
};

const COUNTRIES = [
  { value: "Canada", label: "Canada" },
  { value: "United States", label: "United States" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Australia", label: "Australia" },
  { value: "New Zealand", label: "New Zealand" },
  { value: "United Arab Emirates", label: "United Arab Emirates" },
  { value: "Singapore", label: "Singapore" },
  { value: "Norway", label: "Norway" },
  { value: "Other", label: "Other" },
];

const PROVINCES_BY_COUNTRY: Record<string, { value: string; label: string }[]> = {
  Canada: [
    { value: "Alberta", label: "Alberta" },
    { value: "British Columbia", label: "British Columbia" },
    { value: "Manitoba", label: "Manitoba" },
    { value: "New Brunswick", label: "New Brunswick" },
    { value: "Newfoundland and Labrador", label: "Newfoundland and Labrador" },
    { value: "Northwest Territories", label: "Northwest Territories" },
    { value: "Nova Scotia", label: "Nova Scotia" },
    { value: "Nunavut", label: "Nunavut" },
    { value: "Ontario", label: "Ontario" },
    { value: "Prince Edward Island", label: "Prince Edward Island" },
    { value: "Quebec", label: "Quebec" },
    { value: "Saskatchewan", label: "Saskatchewan" },
    { value: "Yukon", label: "Yukon" },
  ],
  "United States": [
    { value: "Alabama", label: "Alabama" },
    { value: "Alaska", label: "Alaska" },
    { value: "Arizona", label: "Arizona" },
    { value: "Arkansas", label: "Arkansas" },
    { value: "California", label: "California" },
    { value: "Colorado", label: "Colorado" },
    { value: "Connecticut", label: "Connecticut" },
    { value: "Delaware", label: "Delaware" },
    { value: "Florida", label: "Florida" },
    { value: "Georgia", label: "Georgia" },
    { value: "Hawaii", label: "Hawaii" },
    { value: "Idaho", label: "Idaho" },
    { value: "Illinois", label: "Illinois" },
    { value: "Indiana", label: "Indiana" },
    { value: "Iowa", label: "Iowa" },
    { value: "Kansas", label: "Kansas" },
    { value: "Kentucky", label: "Kentucky" },
    { value: "Louisiana", label: "Louisiana" },
    { value: "Maine", label: "Maine" },
    { value: "Maryland", label: "Maryland" },
    { value: "Massachusetts", label: "Massachusetts" },
    { value: "Michigan", label: "Michigan" },
    { value: "Minnesota", label: "Minnesota" },
    { value: "Mississippi", label: "Mississippi" },
    { value: "Missouri", label: "Missouri" },
    { value: "Montana", label: "Montana" },
    { value: "Nebraska", label: "Nebraska" },
    { value: "Nevada", label: "Nevada" },
    { value: "New Hampshire", label: "New Hampshire" },
    { value: "New Jersey", label: "New Jersey" },
    { value: "New Mexico", label: "New Mexico" },
    { value: "New York", label: "New York" },
    { value: "North Carolina", label: "North Carolina" },
    { value: "North Dakota", label: "North Dakota" },
    { value: "Ohio", label: "Ohio" },
    { value: "Oklahoma", label: "Oklahoma" },
    { value: "Oregon", label: "Oregon" },
    { value: "Pennsylvania", label: "Pennsylvania" },
    { value: "Rhode Island", label: "Rhode Island" },
    { value: "South Carolina", label: "South Carolina" },
    { value: "South Dakota", label: "South Dakota" },
    { value: "Tennessee", label: "Tennessee" },
    { value: "Texas", label: "Texas" },
    { value: "Utah", label: "Utah" },
    { value: "Vermont", label: "Vermont" },
    { value: "Virginia", label: "Virginia" },
    { value: "Washington", label: "Washington" },
    { value: "West Virginia", label: "West Virginia" },
    { value: "Wisconsin", label: "Wisconsin" },
    { value: "Wyoming", label: "Wyoming" },
  ],
  "United Kingdom": [
    { value: "England", label: "England" },
    { value: "Scotland", label: "Scotland" },
    { value: "Wales", label: "Wales" },
    { value: "Northern Ireland", label: "Northern Ireland" },
  ],
  Australia: [
    { value: "New South Wales", label: "New South Wales" },
    { value: "Victoria", label: "Victoria" },
    { value: "Queensland", label: "Queensland" },
    { value: "Western Australia", label: "Western Australia" },
    { value: "South Australia", label: "South Australia" },
    { value: "Tasmania", label: "Tasmania" },
    { value: "Australian Capital Territory", label: "Australian Capital Territory" },
    { value: "Northern Territory", label: "Northern Territory" },
  ],
  "New Zealand": [
    { value: "Auckland", label: "Auckland" },
    { value: "Wellington", label: "Wellington" },
    { value: "Canterbury", label: "Canterbury" },
    { value: "Waikato", label: "Waikato" },
    { value: "Bay of Plenty", label: "Bay of Plenty" },
    { value: "Otago", label: "Otago" },
    { value: "Other", label: "Other Region" },
  ],
  "United Arab Emirates": [
    { value: "Abu Dhabi", label: "Abu Dhabi" },
    { value: "Dubai", label: "Dubai" },
    { value: "Sharjah", label: "Sharjah" },
    { value: "Ajman", label: "Ajman" },
    { value: "Umm Al Quwain", label: "Umm Al Quwain" },
    { value: "Ras Al Khaimah", label: "Ras Al Khaimah" },
    { value: "Fujairah", label: "Fujairah" },
  ],
  Singapore: [
    { value: "Singapore", label: "Singapore" },
  ],
  Norway: [
    { value: "Oslo", label: "Oslo" },
    { value: "Bergen", label: "Bergen" },
    { value: "Stavanger", label: "Stavanger" },
    { value: "Trondheim", label: "Trondheim" },
    { value: "Other", label: "Other Region" },
  ],
};

export function JobLocationPicker({ value, onChange, disabled }: JobLocationPickerProps) {
  const { t } = useTranslation();
  
  const provinces = value.jobCountry ? PROVINCES_BY_COUNTRY[value.jobCountry] || [] : [];
  const showProvinceInput = value.jobCountry === "Other" || provinces.length === 0;

  const handleCountryChange = (country: string) => {
    onChange({
      jobCountry: country,
      jobProvinceState: "",
      jobCity: "",
    });
  };

  const handleProvinceChange = (province: string) => {
    onChange({
      ...value,
      jobProvinceState: province,
    });
  };

  const handleCityChange = (city: string) => {
    onChange({
      ...value,
      jobCity: city,
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>{t("jobBoard.form.country", "Country")}</Label>
        <Select 
          value={value.jobCountry} 
          onValueChange={handleCountryChange}
          disabled={disabled}
        >
          <SelectTrigger data-testid="select-job-country">
            <SelectValue placeholder={t("jobBoard.form.selectCountry", "Select country")} />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                {country.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{t("jobBoard.form.provinceState", "Province/State")}</Label>
        {showProvinceInput ? (
          <Input
            value={value.jobProvinceState}
            onChange={(e) => handleProvinceChange(e.target.value)}
            placeholder={t("jobBoard.form.enterProvince", "Enter province/state")}
            disabled={disabled || !value.jobCountry}
            data-testid="input-job-province"
          />
        ) : (
          <Select 
            value={value.jobProvinceState} 
            onValueChange={handleProvinceChange}
            disabled={disabled || !value.jobCountry}
          >
            <SelectTrigger data-testid="select-job-province">
              <SelectValue placeholder={t("jobBoard.form.selectProvince", "Select province/state")} />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((province) => (
                <SelectItem key={province.value} value={province.value}>
                  {province.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <Label>{t("jobBoard.form.city", "City")}</Label>
        <Input
          value={value.jobCity}
          onChange={(e) => handleCityChange(e.target.value)}
          placeholder={t("jobBoard.form.enterCity", "Enter city")}
          disabled={disabled || !value.jobCountry}
          data-testid="input-job-city"
        />
      </div>
    </div>
  );
}

export function formatJobLocation(country: string | null, province: string | null, city: string | null): string {
  const parts = [city, province, country].filter(Boolean);
  return parts.join(", ");
}
