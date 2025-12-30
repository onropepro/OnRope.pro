export const JOB_TYPES = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "temporary", label: "Temporary" },
  { value: "seasonal", label: "Seasonal" },
];

export const EMPLOYMENT_TYPES = [
  { value: "permanent", label: "Permanent" },
  { value: "fixed_term", label: "Fixed Term" },
  { value: "casual", label: "Casual" },
];

export const SALARY_PERIODS = [
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "annually", label: "Annually" },
];

export const CERT_LEVELS = [
  { value: "", label: "Not Required" },
  { value: "Level 1", label: "Level 1" },
  { value: "Level 2", label: "Level 2" },
  { value: "Level 3", label: "Level 3" },
];

export const WORK_DAYS_OPTIONS = [
  { value: "monday_friday", label: "Monday to Friday" },
  { value: "monday_saturday", label: "Monday to Saturday" },
  { value: "flexible", label: "Flexible Schedule" },
  { value: "rotating", label: "Rotating Shifts" },
  { value: "weekends", label: "Weekends Only" },
  { value: "on_call", label: "On Call" },
];

export const EXPERIENCE_OPTIONS = [
  { value: "", label: "Not Specified" },
  { value: "entry", label: "Entry Level (0-1 years)" },
  { value: "junior", label: "1-2 years" },
  { value: "mid", label: "3-5 years" },
  { value: "senior", label: "5+ years" },
  { value: "expert", label: "10+ years" },
];

export const POSITION_TYPES = [
  { value: "rope_access", label: "Rope Access Technician" },
  { value: "ground_crew", label: "Ground Crew" },
];

export type JobPostingFormData = {
  title: string;
  description: string;
  requirements: string;
  location: string;
  jobCountry: string;
  jobProvinceState: string;
  jobCity: string;
  isRemote: boolean;
  jobType: string;
  employmentType: string;
  salaryMin: string;
  salaryMax: string;
  salaryPeriod: string;
  requiredIrataLevel: string;
  requiredSpratLevel: string;
  startDate: string;
  benefits: string;
  workDays: string;
  experienceRequired: string;
  expiresAt: string;
  positionType: string;
};

export const DEFAULT_JOB_POSTING_FORM: JobPostingFormData = {
  title: "",
  description: "",
  requirements: "",
  location: "",
  jobCountry: "",
  jobProvinceState: "",
  jobCity: "",
  isRemote: false,
  jobType: "full_time",
  employmentType: "permanent",
  salaryMin: "",
  salaryMax: "",
  salaryPeriod: "hourly",
  requiredIrataLevel: "",
  requiredSpratLevel: "",
  startDate: "",
  benefits: "",
  workDays: "",
  experienceRequired: "",
  expiresAt: "",
  positionType: "rope_access",
};
