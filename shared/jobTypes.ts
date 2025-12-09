export type JobCategory = 'building_maintenance' | 'ndt';

export type ElevationRequirement = 'always' | 'never' | 'configurable';

export interface JobTypeConfig {
  value: string;
  category: JobCategory;
  labelKey: string;
  label: string;
  icon: string;
  elevationRequirement: ElevationRequirement;
  progressType: 'drops' | 'hours' | 'suites' | 'stalls' | 'floors';
}

export const JOB_CATEGORIES: { value: JobCategory; labelKey: string; label: string; icon: string }[] = [
  { value: 'building_maintenance', labelKey: 'dashboard.jobCategories.building_maintenance', label: 'Building Maintenance', icon: 'apartment' },
  { value: 'ndt', labelKey: 'dashboard.jobCategories.ndt', label: 'NDT - Non-Destructive Testing', icon: 'science' },
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
  { value: 'general_pressure_washing', category: 'building_maintenance', labelKey: 'dashboard.jobTypes.general_pressure_washing', label: 'General Pressure Washing', icon: 'cleaning_services', elevationRequirement: 'configurable', progressType: 'hours' },
  { value: 'ground_window_cleaning', category: 'building_maintenance', labelKey: 'dashboard.jobTypes.ground_window_cleaning', label: 'Ground Window Cleaning', icon: 'storefront', elevationRequirement: 'never', progressType: 'hours' },
  
  // Building Maintenance - Suite/unit-based
  { value: 'in_suite_dryer_vent_cleaning', category: 'building_maintenance', labelKey: 'dashboard.jobTypes.in_suite_dryer_vent_cleaning', label: 'In-Suite Dryer Vent', icon: 'meeting_room', elevationRequirement: 'never', progressType: 'suites' },
  
  // Building Maintenance - Stall-based
  { value: 'parkade_pressure_cleaning', category: 'building_maintenance', labelKey: 'dashboard.jobTypes.parkade_pressure_cleaning', label: 'Parkade Pressure Cleaning', icon: 'local_parking', elevationRequirement: 'never', progressType: 'stalls' },
  
  // Building Maintenance - Other
  { value: 'other', category: 'building_maintenance', labelKey: 'dashboard.jobTypes.other', label: 'Other', icon: 'more_horiz', elevationRequirement: 'configurable', progressType: 'hours' },
  
  // NDT - Non-Destructive Testing (all hours-based, configurable elevation)
  { value: 'ndt_visual_inspection', category: 'ndt', labelKey: 'dashboard.jobTypes.ndt_visual_inspection', label: 'Visual Inspection (VT)', icon: 'visibility', elevationRequirement: 'configurable', progressType: 'hours' },
  { value: 'ndt_ultrasonic_testing', category: 'ndt', labelKey: 'dashboard.jobTypes.ndt_ultrasonic_testing', label: 'Ultrasonic Testing (UT)', icon: 'graphic_eq', elevationRequirement: 'configurable', progressType: 'hours' },
  { value: 'ndt_magnetic_particle', category: 'ndt', labelKey: 'dashboard.jobTypes.ndt_magnetic_particle', label: 'Magnetic Particle Testing (MT)', icon: 'attractions', elevationRequirement: 'configurable', progressType: 'hours' },
  { value: 'ndt_dye_penetrant', category: 'ndt', labelKey: 'dashboard.jobTypes.ndt_dye_penetrant', label: 'Dye Penetrant Testing (PT)', icon: 'colorize', elevationRequirement: 'configurable', progressType: 'hours' },
  { value: 'ndt_radiographic', category: 'ndt', labelKey: 'dashboard.jobTypes.ndt_radiographic', label: 'Radiographic Testing (RT)', icon: 'radiology', elevationRequirement: 'configurable', progressType: 'hours' },
  { value: 'ndt_eddy_current', category: 'ndt', labelKey: 'dashboard.jobTypes.ndt_eddy_current', label: 'Eddy Current Testing (ET)', icon: 'electric_bolt', elevationRequirement: 'configurable', progressType: 'hours' },
  { value: 'ndt_thermographic', category: 'ndt', labelKey: 'dashboard.jobTypes.ndt_thermographic', label: 'Thermographic Inspection', icon: 'thermostat', elevationRequirement: 'configurable', progressType: 'hours' },
  { value: 'ndt_acoustic_emission', category: 'ndt', labelKey: 'dashboard.jobTypes.ndt_acoustic_emission', label: 'Acoustic Emission Testing (AE)', icon: 'hearing', elevationRequirement: 'configurable', progressType: 'hours' },
  { value: 'ndt_phased_array', category: 'ndt', labelKey: 'dashboard.jobTypes.ndt_phased_array', label: 'Phased Array Ultrasonic (PAUT)', icon: 'waves', elevationRequirement: 'configurable', progressType: 'hours' },
  { value: 'ndt_time_of_flight', category: 'ndt', labelKey: 'dashboard.jobTypes.ndt_time_of_flight', label: 'Time of Flight Diffraction (TOFD)', icon: 'timeline', elevationRequirement: 'configurable', progressType: 'hours' },
  { value: 'ndt_other', category: 'ndt', labelKey: 'dashboard.jobTypes.ndt_other', label: 'Other NDT', icon: 'more_horiz', elevationRequirement: 'configurable', progressType: 'hours' },
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

export function getProgressType(jobType: string): 'drops' | 'hours' | 'suites' | 'stalls' | 'floors' {
  const config = getJobTypeConfig(jobType);
  return config?.progressType || 'hours';
}
