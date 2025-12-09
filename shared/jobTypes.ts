export type JobCategory = 'building_maintenance' | 'ndt' | 'rock_scaling';

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
  { value: 'rock_scaling', labelKey: 'dashboard.jobCategories.rock_scaling', label: 'Rock Scaling', icon: 'terrain' },
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
  
  // Rock Scaling (all hours-based, elevation always required for rope access work)
  { value: 'rock_loose_removal', category: 'rock_scaling', labelKey: 'dashboard.jobTypes.rock_loose_removal', label: 'Loose Rock Removal', icon: 'landslide', elevationRequirement: 'always', progressType: 'hours' },
  { value: 'rock_bolting', category: 'rock_scaling', labelKey: 'dashboard.jobTypes.rock_bolting', label: 'Rock Bolting / Anchoring', icon: 'hardware', elevationRequirement: 'always', progressType: 'hours' },
  { value: 'rock_mesh_installation', category: 'rock_scaling', labelKey: 'dashboard.jobTypes.rock_mesh_installation', label: 'Mesh / Net Installation', icon: 'grid_on', elevationRequirement: 'always', progressType: 'hours' },
  { value: 'rock_shotcrete', category: 'rock_scaling', labelKey: 'dashboard.jobTypes.rock_shotcrete', label: 'Shotcrete Application', icon: 'format_paint', elevationRequirement: 'always', progressType: 'hours' },
  { value: 'rock_face_inspection', category: 'rock_scaling', labelKey: 'dashboard.jobTypes.rock_face_inspection', label: 'Rock Face Inspection', icon: 'search', elevationRequirement: 'always', progressType: 'hours' },
  { value: 'rock_crack_sealing', category: 'rock_scaling', labelKey: 'dashboard.jobTypes.rock_crack_sealing', label: 'Crack Sealing / Grouting', icon: 'plumbing', elevationRequirement: 'always', progressType: 'hours' },
  { value: 'rock_slope_stabilization', category: 'rock_scaling', labelKey: 'dashboard.jobTypes.rock_slope_stabilization', label: 'Slope Stabilization', icon: 'landscape', elevationRequirement: 'always', progressType: 'hours' },
  { value: 'rock_hazard_assessment', category: 'rock_scaling', labelKey: 'dashboard.jobTypes.rock_hazard_assessment', label: 'Rockfall Hazard Assessment', icon: 'warning', elevationRequirement: 'configurable', progressType: 'hours' },
  { value: 'rock_catch_fence', category: 'rock_scaling', labelKey: 'dashboard.jobTypes.rock_catch_fence', label: 'Catch Fence Installation', icon: 'fence', elevationRequirement: 'always', progressType: 'hours' },
  { value: 'rock_drilling', category: 'rock_scaling', labelKey: 'dashboard.jobTypes.rock_drilling', label: 'Rock Drilling', icon: 'precision_manufacturing', elevationRequirement: 'always', progressType: 'hours' },
  { value: 'rock_other', category: 'rock_scaling', labelKey: 'dashboard.jobTypes.rock_other', label: 'Other Rock Scaling', icon: 'more_horiz', elevationRequirement: 'configurable', progressType: 'hours' },
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
