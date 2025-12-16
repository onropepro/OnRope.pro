export type JobCategory = 'building_maintenance';

export type ElevationRequirement = 'always' | 'never' | 'configurable';

export interface JobTypeConfig {
  value: string;
  category: JobCategory;
  labelKey: string;
  label: string;
  icon: string;
  elevationRequirement: ElevationRequirement;
  progressType: 'drops' | 'hours' | 'suites' | 'stalls' | 'floors' | 'anchors';
}

export const JOB_CATEGORIES: { value: JobCategory; labelKey: string; label: string; icon: string }[] = [
  { value: 'building_maintenance', labelKey: 'dashboard.jobCategories.building_maintenance', label: 'Building Maintenance', icon: 'apartment' },
];

export const JOB_TYPES: JobTypeConfig[] = [
  // Building Maintenance - Drops-based (elevation always required)
  { value: 'window_cleaning', category: 'building_maintenance', labelKey: 'dashboard.jobTypes.window_cleaning', label: 'Window Cleaning', icon: 'window', elevationRequirement: 'configurable', progressType: 'drops' },
  { value: 'dryer_vent_cleaning', category: 'building_maintenance', labelKey: 'dashboard.jobTypes.dryer_vent_cleaning', label: 'Exterior Dryer Vent', icon: 'air', elevationRequirement: 'configurable', progressType: 'drops' },
  { value: 'building_wash', category: 'building_maintenance', labelKey: 'dashboard.jobTypes.building_wash', label: 'Building Wash', icon: 'water_drop', elevationRequirement: 'configurable', progressType: 'drops' },
  { value: 'gutter_cleaning', category: 'building_maintenance', labelKey: 'dashboard.jobTypes.gutter_cleaning', label: 'Gutter Cleaning', icon: 'home_repair_service', elevationRequirement: 'configurable', progressType: 'drops' },
  { value: 'painting', category: 'building_maintenance', labelKey: 'dashboard.jobTypes.painting', label: 'Painting', icon: 'format_paint', elevationRequirement: 'configurable', progressType: 'drops' },
  { value: 'caulking', category: 'building_maintenance', labelKey: 'dashboard.jobTypes.caulking', label: 'Caulking', icon: 'plumbing', elevationRequirement: 'configurable', progressType: 'drops' },
  { value: 'inspection', category: 'building_maintenance', labelKey: 'dashboard.jobTypes.inspection', label: 'Inspection', icon: 'fact_check', elevationRequirement: 'configurable', progressType: 'hours' },
  
  // Building Maintenance - Hours-based
  { value: 'balcony_pressure_washing', category: 'building_maintenance', labelKey: 'dashboard.jobTypes.balcony_pressure_washing', label: 'Balcony Pressure Washing', icon: 'cleaning_services', elevationRequirement: 'configurable', progressType: 'drops' },
  { value: 'general_pressure_washing', category: 'building_maintenance', labelKey: 'dashboard.jobTypes.general_pressure_washing', label: 'General Pressure Washing', icon: 'cleaning_services', elevationRequirement: 'configurable', progressType: 'hours' },
  { value: 'ground_window_cleaning', category: 'building_maintenance', labelKey: 'dashboard.jobTypes.ground_window_cleaning', label: 'Ground Window Cleaning', icon: 'storefront', elevationRequirement: 'never', progressType: 'hours' },
  { value: 'rescue_standby', category: 'building_maintenance', labelKey: 'dashboard.jobTypes.rescue_standby', label: 'Rescue Stand by', icon: 'health_and_safety', elevationRequirement: 'never', progressType: 'hours' },
  
  // Building Maintenance - Suite/unit-based
  { value: 'in_suite_dryer_vent_cleaning', category: 'building_maintenance', labelKey: 'dashboard.jobTypes.in_suite_dryer_vent_cleaning', label: 'In-Suite Dryer Vent', icon: 'meeting_room', elevationRequirement: 'never', progressType: 'suites' },
  
  // Building Maintenance - Stall-based
  { value: 'parkade_pressure_cleaning', category: 'building_maintenance', labelKey: 'dashboard.jobTypes.parkade_pressure_cleaning', label: 'Parkade Pressure Cleaning', icon: 'local_parking', elevationRequirement: 'never', progressType: 'stalls' },
  
  // Building Maintenance - Anchor-based
  { value: 'anchor_inspection', category: 'building_maintenance', labelKey: 'dashboard.jobTypes.anchor_inspection', label: 'Anchor Inspection', icon: 'anchor', elevationRequirement: 'configurable', progressType: 'anchors' },
  
  // Building Maintenance - Other
  { value: 'other', category: 'building_maintenance', labelKey: 'dashboard.jobTypes.other', label: 'Other', icon: 'more_horiz', elevationRequirement: 'configurable', progressType: 'hours' },
];

export function getJobTypesByCategory(category: JobCategory): JobTypeConfig[] {
  return JOB_TYPES.filter(jt => jt.category === category);
}

export function getJobTypeConfig(jobType: string): JobTypeConfig | undefined {
  return JOB_TYPES.find(jt => jt.value === jobType);
}

export function getDefaultElevation(jobType: string): boolean {
  const config = getJobTypeConfig(jobType);
  if (!config) return true;
  if (config.elevationRequirement === 'always') return true;
  if (config.elevationRequirement === 'never') return false;
  return true;
}

export function isElevationConfigurable(jobType: string): boolean {
  const config = getJobTypeConfig(jobType);
  return config?.elevationRequirement === 'configurable';
}

export function getCategoryForJobType(jobType: string): JobCategory {
  const config = getJobTypeConfig(jobType);
  return config?.category || 'building_maintenance';
}

export function getProgressType(jobType: string): 'drops' | 'hours' | 'suites' | 'stalls' | 'floors' | 'anchors' {
  const config = getJobTypeConfig(jobType);
  return config?.progressType || 'hours';
}

// Check if a job type uses anchor-based progress tracking
export function isAnchorBasedJobType(jobType: string): boolean {
  const config = getJobTypeConfig(jobType);
  return config?.progressType === 'anchors';
}

// Get all valid job type values for validation
export function getAllJobTypeValues(): string[] {
  return JOB_TYPES.map(jt => jt.value);
}

// Check if a job type is valid (exists in the configuration)
export function isValidJobType(jobType: string): boolean {
  return JOB_TYPES.some(jt => jt.value === jobType);
}

// Check if a job type uses drop-based progress tracking
export function isDropBasedJobType(jobType: string): boolean {
  const config = getJobTypeConfig(jobType);
  return config?.progressType === 'drops';
}

// Check if a job type requires suites per day
export function isSuiteBasedJobType(jobType: string): boolean {
  const config = getJobTypeConfig(jobType);
  return config?.progressType === 'suites';
}

// Check if a job type requires stalls per day
export function isStallBasedJobType(jobType: string): boolean {
  const config = getJobTypeConfig(jobType);
  return config?.progressType === 'stalls';
}

// Check if a job type uses hours/percentage-based progress tracking
export function isHoursBasedJobType(jobType: string): boolean {
  const config = getJobTypeConfig(jobType);
  return config?.progressType === 'hours';
}

/**
 * Check if a project should use "last one out" progress tracking
 * This applies when:
 * - requiresElevation is false (non-elevation job - e.g., boom lift work)
 * - OR job type is inherently hours-based (General Pressure Washing, Ground Window, etc.)
 * 
 * This does NOT apply to suite-based or stall-based jobs (they have their own unit tracking)
 */
export function usesPercentageProgress(jobType: string, requiresElevation: boolean): boolean {
  const config = getJobTypeConfig(jobType);
  if (!config) return false;
  
  // Suite-based and stall-based always use their own unit tracking
  if (config.progressType === 'suites' || config.progressType === 'stalls') {
    return false;
  }
  
  // Hours-based jobs always use percentage progress
  if (config.progressType === 'hours') {
    return true;
  }
  
  // Drop-based jobs use percentage when elevation is toggled OFF
  if (config.progressType === 'drops' && !requiresElevation) {
    return true;
  }
  
  // Anchor-based without elevation uses percentage
  if (config.progressType === 'anchors' && !requiresElevation) {
    return true;
  }
  
  return false;
}
