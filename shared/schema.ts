import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { isDropBasedJobType, isSuiteBasedJobType, isStallBasedJobType, getAllJobTypeValues, getCategoryForJobType } from './jobTypes';
import {
  pgTable,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  date,
  index,
  jsonb,
  numeric,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Utility function to normalize strata plan numbers
export function normalizeStrataPlan(strataPlan: string): string {
  return strataPlan
    .toUpperCase()
    .trim()
    .replace(/\s+/g, ''); // Remove all whitespace
}

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// License keys table - tracks generated license keys from Stripe checkouts
export const licenseKeys = pgTable("license_keys", {
  licenseKey: varchar("license_key").primaryKey(), // The generated license key (COMPANY-XXXXX-XXXXX-XXXXX-[1-4])
  stripeSessionId: varchar("stripe_session_id").notNull().unique(), // Stripe checkout session ID
  stripeCustomerId: varchar("stripe_customer_id").notNull(), // Stripe customer ID
  stripeSubscriptionId: varchar("stripe_subscription_id").notNull(), // Stripe subscription ID
  tier: varchar("tier").notNull(), // basic | starter | premium | enterprise
  currency: varchar("currency").notNull(), // usd | cad
  used: boolean("used").default(false).notNull(), // Whether this key has been used for registration
  usedByUserId: varchar("used_by_user_id").references(() => users.id, { onDelete: "set null" }), // User who used this key
  usedAt: timestamp("used_at"), // When the key was used
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  // Database constraint: Once a license is used (usedAt is set), it cannot be unmarked
  // This prevents any code bug or manual DB manipulation from resetting the used flag
  usedAtEnforcesUsed: sql`CHECK (("used_at" IS NULL AND "used" = false) OR ("used_at" IS NOT NULL AND "used" = true))`,
}));

// Users table - supports multiple roles
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(), // null for company accounts
  passwordHash: text("password_hash").notNull(),
  role: varchar("role").notNull(), // company | resident | property_manager | operations_manager | supervisor | rope_access_tech | manager | ground_crew | ground_crew_supervisor
  
  // Company-specific fields
  companyName: varchar("company_name"), // for company role
  companyId: varchar("company_id").references(() => users.id, { onDelete: "cascade" }), // for employees - links to their company
  streetAddress: text("street_address"), // for company role - street address
  province: varchar("province"), // for company role - province/state
  country: varchar("country"), // for company role - country
  zipCode: varchar("zip_code"), // for company role - postal/zip code
  timezone: varchar("timezone").default("America/Vancouver"), // IANA timezone for company (e.g., "America/Vancouver", "America/Toronto")
  
  // Shared fields
  name: varchar("name"), // for resident and employee roles
  
  // Property Manager-specific fields
  firstName: varchar("first_name"), // for property_manager role
  lastName: varchar("last_name"), // for property_manager role
  propertyManagementCompany: varchar("property_management_company"), // for property_manager role
  propertyManagerPhoneNumber: varchar("property_manager_phone_number"), // for property_manager role - SMS notifications
  propertyManagerSmsOptIn: boolean("property_manager_sms_opt_in").default(true), // for property_manager role - opt-in to receive SMS notifications for new quotes (defaults to true for better UX)
  pmCode: varchar("pm_code", { length: 10 }).unique(), // Unique 10-character code for property managers (similar to company's propertyManagerCode)
  
  // Resident-specific fields
  strataPlanNumber: varchar("strata_plan_number"), // for resident role
  unitNumber: varchar("unit_number"), // for resident role
  phoneNumber: varchar("phone_number"), // for resident role
  parkingStallNumber: varchar("parking_stall_number"), // for resident role - optional parking stall
  linkedResidentCode: varchar("linked_resident_code", { length: 10 }), // for resident role - stores the code they used to link (for validation)
  
  // Employee-specific fields
  techLevel: varchar("tech_level"), // for rope_access_tech role (e.g., "Level 1", "Level 2", "Level 3")
  hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }), // Hourly rate for employees (e.g., 25.50)
  isSalary: boolean("is_salary").default(false), // Whether employee is paid salary instead of hourly
  salary: numeric("salary", { precision: 12, scale: 2 }), // Annual salary for salaried employees
  permissions: text("permissions").array().default(sql`ARRAY[]::text[]`), // Array of permission strings for employees
  isTempPassword: boolean("is_temp_password").default(false),
  
  // Additional employee details
  startDate: date("start_date"), // Employee start date
  birthday: date("birthday"), // Employee date of birth (optional)
  socialInsuranceNumber: varchar("social_insurance_number"), // Social Insurance Number (optional)
  driversLicenseNumber: varchar("drivers_license_number"), // Driver's license number (optional)
  driversLicenseProvince: varchar("drivers_license_province"), // Province where driver's license was issued (optional)
  driversLicenseIssuedDate: date("drivers_license_issued_date"), // Driver's license issue date (optional)
  driversLicenseExpiry: date("drivers_license_expiry"), // Driver's license expiry date (optional)
  driversLicenseDocuments: text("drivers_license_documents").array().default(sql`ARRAY[]::text[]`), // Array of document URLs (driver's license photos, abstracts, etc.)
  resumeDocuments: text("resume_documents").array().default(sql`ARRAY[]::text[]`), // Array of resume/CV document URLs
  
  // Employee address fields (separate fields for self-registration)
  employeeStreetAddress: text("employee_street_address"), // Employee street address
  employeeCity: varchar("employee_city"), // Employee city
  employeeProvinceState: varchar("employee_province_state"), // Employee province/state
  employeeCountry: varchar("employee_country"), // Employee country
  employeePostalCode: varchar("employee_postal_code"), // Employee postal code
  homeAddress: text("home_address"), // Home address (optional - legacy field)
  
  // Bank information for payroll
  bankTransitNumber: varchar("bank_transit_number"), // Bank transit number (optional)
  bankInstitutionNumber: varchar("bank_institution_number"), // Bank institution number (optional)
  bankAccountNumber: varchar("bank_account_number"), // Bank account number (optional)
  bankDocuments: text("bank_documents").array().default(sql`ARRAY[]::text[]`), // Array of void cheque document URLs
  employeePhoneNumber: varchar("employee_phone_number"), // Employee phone number (optional, separate from resident phoneNumber)
  smsNotificationsEnabled: boolean("sms_notifications_enabled").default(true), // Whether employee wants to receive SMS notifications
  emergencyContactName: varchar("emergency_contact_name"), // Emergency contact name (optional)
  emergencyContactPhone: varchar("emergency_contact_phone"), // Emergency contact phone (optional)
  emergencyContactRelationship: varchar("emergency_contact_relationship"), // Emergency contact relationship (e.g., spouse, parent, sibling)
  specialMedicalConditions: text("special_medical_conditions"), // Special medical conditions (optional)
  
  // IRATA certification fields (optional)
  irataLevel: varchar("irata_level"), // IRATA level (e.g., "Level 1", "Level 2", "Level 3")
  irataLicenseNumber: varchar("irata_license_number"), // IRATA license number
  irataIssuedDate: date("irata_issued_date"), // IRATA certification issue date
  irataExpirationDate: date("irata_expiration_date"), // IRATA certification expiration date
  irataDocuments: text("irata_documents").array().default(sql`ARRAY[]::text[]`), // Array of IRATA certification document URLs
  irataBaselineHours: numeric("irata_baseline_hours", { precision: 10, scale: 2 }).default("0"), // Baseline logbook hours before using this system
  irataHoursAtLastUpgrade: numeric("irata_hours_at_last_upgrade", { precision: 10, scale: 2 }), // Total hours logged when technician achieved current IRATA level
  irataLastUpgradeDate: date("irata_last_upgrade_date"), // Date technician achieved current IRATA level (for 1-year requirement)
  ropeAccessStartDate: date("rope_access_start_date"), // Date technician started rope access career (for experience calculation)
  irataVerifiedAt: timestamp("irata_verified_at"), // Timestamp of last successful IRATA verification via screenshot
  irataVerificationStatus: varchar("irata_verification_status"), // Status from IRATA verification (e.g., "Valid", "Active")
  
  // SPRAT certification fields (optional)
  spratLevel: varchar("sprat_level"), // SPRAT level (e.g., "Level 1", "Level 2", "Level 3")
  spratLicenseNumber: varchar("sprat_license_number"), // SPRAT license number
  spratIssuedDate: date("sprat_issued_date"), // SPRAT certification issue date
  spratExpirationDate: date("sprat_expiration_date"), // SPRAT certification expiration date
  spratDocuments: text("sprat_documents").array().default(sql`ARRAY[]::text[]`), // Array of SPRAT certification document URLs
  spratBaselineHours: numeric("sprat_baseline_hours", { precision: 10, scale: 2 }).default("0"), // Baseline logbook hours before using this system (SPRAT)
  spratHoursAtLastUpgrade: numeric("sprat_hours_at_last_upgrade", { precision: 10, scale: 2 }), // Total hours logged when technician achieved current SPRAT level
  spratLastUpgradeDate: date("sprat_last_upgrade_date"), // Date technician achieved current SPRAT level (for 6-month requirement)
  spratVerifiedAt: timestamp("sprat_verified_at"), // Timestamp of last successful SPRAT verification via screenshot
  spratVerificationStatus: varchar("sprat_verification_status"), // Status from SPRAT verification (e.g., "Valid", "Active")
  
  // First Aid certification fields (optional)
  hasFirstAid: boolean("has_first_aid").default(false), // Whether employee has first aid certification
  firstAidType: varchar("first_aid_type"), // Type of first aid certification (e.g., "Standard First Aid", "Emergency First Aid", "CPR/AED", etc.)
  firstAidExpiry: date("first_aid_expiry"), // First aid certification expiry date
  firstAidDocuments: text("first_aid_documents").array().default(sql`ARRAY[]::text[]`), // Array of first aid certification document URLs
  
  // Employee photo
  photoUrl: text("photo_url"), // Employee profile photo URL
  
  // Employment termination
  terminatedDate: date("terminated_date"), // Date employment was terminated (optional)
  terminationReason: text("termination_reason"), // Reason for termination (optional)
  terminationNotes: text("termination_notes"), // Additional notes about termination (optional)
  
  // Seat suspension (for removing paid seats during slow season)
  suspendedAt: timestamp("suspended_at"), // When the employee was suspended (seat removed)
  suspendedBy: varchar("suspended_by").references(() => users.id, { onDelete: "set null" }), // Company owner who suspended them
  
  // Stripe subscription management (company role only)
  stripeCustomerId: varchar("stripe_customer_id"), // Stripe customer ID for billing
  subscriptionTier: varchar("subscription_tier").default('none'), // none | basic | starter | premium | enterprise
  subscriptionStatus: varchar("subscription_status").default('inactive'), // inactive | active | past_due | canceled | trialing
  subscriptionEndDate: date("subscription_end_date"), // Date subscription ends or ended
  stripeSubscriptionId: varchar("stripe_subscription_id"), // Current Stripe subscription ID
  licenseKey: varchar("license_key"), // Current license key (COMPANY-XXXXX-XXXXX-XXXXX-[1-4])
  
  // Add-ons tracking (company role only)
  additionalSeatsCount: integer("additional_seats_count").default(0), // Number of extra seats purchased (paid via Stripe)
  giftedSeatsCount: integer("gifted_seats_count").default(0), // Number of seats gifted by SuperUser (free forever)
  additionalProjectsCount: integer("additional_projects_count").default(0), // Number of extra projects purchased
  whitelabelBrandingActive: boolean("whitelabel_branding_active").default(false), // Whether white-label branding is active
  whitelabelPendingBilling: boolean("whitelabel_pending_billing").default(false), // Whether white-label was activated during trial and needs to be billed when trial ends
  
  // Platform-verified company (SuperUser granted free access)
  isPlatformVerified: boolean("is_platform_verified").default(false), // When true, company has full access without paying
  
  // Resident linking code (company role only)
  residentCode: varchar("resident_code", { length: 10 }).unique(), // 10-character code for residents to link to company - UNIQUE (~50 bits entropy)
  
  // Property Manager linking code (company role only)
  propertyManagerCode: varchar("property_manager_code", { length: 10 }).unique(), // 10-character code for property managers to link to company - UNIQUE
  
  // Technician referral system (rope_access_tech role)
  referralCode: varchar("referral_code", { length: 20 }).unique(), // Unique 10-char referral code for this technician (generated on registration)
  referredByUserId: varchar("referred_by_user_id").references(() => users.id, { onDelete: "set null" }), // User ID of the technician who referred them
  referredByCode: varchar("referred_by_code", { length: 20 }), // The referral code they used to register (for tracking purposes)
  
  // Technician PLUS access (premium tier)
  hasPlusAccess: boolean("has_plus_access").default(false), // Whether technician has PLUS benefits (from referrals or subscription)
  
  // Technician job board visibility (allows employers to see their profile)
  isVisibleToEmployers: boolean("is_visible_to_employers").default(false), // Whether technician's profile is visible on job board
  
  // Technician rope access specialties (job types they specialize in)
  ropeAccessSpecialties: text("rope_access_specialties").array().default(sql`ARRAY[]::text[]`), // Array of job type values from JOB_TYPES
  
  // Technician expected salary (visible to employers)
  expectedSalaryMin: numeric("expected_salary_min", { precision: 12, scale: 2 }), // Minimum expected salary
  expectedSalaryMax: numeric("expected_salary_max", { precision: 12, scale: 2 }), // Maximum expected salary
  expectedSalaryPeriod: varchar("expected_salary_period"), // hourly | daily | weekly | monthly | annually
  visibilityEnabledAt: timestamp("visibility_enabled_at"), // When visibility was last enabled
  
  // White label branding (company role only)
  brandingLogoUrl: text("branding_logo_url"), // Custom logo URL for resident portal
  brandingColors: text("branding_colors").array().default(sql`ARRAY[]::text[]`), // Array of brand colors (hex codes)
  pwaAppIconUrl: text("pwa_app_icon_url"), // Custom PWA app icon URL (512x512 for installed app)
  
  // Language preference (all roles)
  preferredLanguage: varchar("preferred_language").default('en'), // en | fr - user's preferred language
  
  // Activity tracking
  lastActivityAt: timestamp("last_activity_at"), // Last time user made any API request (for activity monitoring)
  
  // Onboarding tracking (company role only)
  onboardingCompleted: boolean("onboarding_completed").default(false), // Whether company has completed onboarding wizard
  onboardingCompletedAt: timestamp("onboarding_completed_at"), // When onboarding was completed
  onboardingSkippedAt: timestamp("onboarding_skipped_at"), // When onboarding was skipped (user chose to explore)
  
  // Account suspension (SuperUser can disable accounts for fraud/misuse)
  isDisabled: boolean("is_disabled").default(false), // Whether account is suspended
  disabledAt: timestamp("disabled_at"), // When account was disabled
  disabledReason: text("disabled_reason"), // Reason for suspension (fraud, misuse, etc.)
  disabledBy: varchar("disabled_by"), // SuperUser who disabled the account
  
  // Password reset
  passwordResetToken: varchar("password_reset_token"), // Token for password reset
  passwordResetExpires: timestamp("password_reset_expires"), // When the reset token expires
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Global Buildings table - SuperUser level database of all buildings across all companies
// Buildings are auto-created when projects are created with new strata numbers
export const buildings = pgTable("buildings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Login credentials - strata number is the username
  strataPlanNumber: varchar("strata_plan_number").notNull().unique(), // Unique identifier and login username
  passwordHash: text("password_hash").notNull(), // Hashed password (defaults to strata number initially)
  passwordChangedAt: timestamp("password_changed_at"), // When password was changed from default (null = still using default)
  
  // Building details
  buildingName: varchar("building_name"),
  buildingAddress: text("building_address"),
  city: varchar("city"),
  province: varchar("province"),
  country: varchar("country"),
  postalCode: varchar("postal_code"),
  
  // Geolocation for map display
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  
  // Building specifications
  floorCount: integer("floor_count"),
  parkingStalls: integer("parking_stalls"),
  totalUnits: integer("total_units"), // Total residential/commercial units
  
  // Drops per elevation (for rope access)
  dropsNorth: integer("drops_north").default(0),
  dropsEast: integer("drops_east").default(0),
  dropsSouth: integer("drops_south").default(0),
  dropsWest: integer("drops_west").default(0),
  
  // Additional building info
  yearBuilt: integer("year_built"),
  buildingType: varchar("building_type"), // residential | commercial | mixed
  notes: text("notes"),
  
  // Tracking
  lastServiceDate: date("last_service_date"), // Last time any company serviced this building
  totalProjectsCompleted: integer("total_projects_completed").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_buildings_strata").on(table.strataPlanNumber),
]);

export const insertBuildingSchema = createInsertSchema(buildings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Building = typeof buildings.$inferSelect;
export type InsertBuilding = z.infer<typeof insertBuildingSchema>;

// Building Instructions - Access info, keys/fob, roof access, contact info, special requests
export const buildingInstructions = pgTable("building_instructions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buildingId: varchar("building_id").notNull().references(() => buildings.id, { onDelete: "cascade" }),
  
  // Instruction categories
  buildingAccess: text("building_access"), // How to access the building
  keysAndFob: text("keys_and_fob"), // Where to get keys or fob
  keysReturnPolicy: varchar("keys_return_policy"), // When to return keys: end_of_day, end_of_week, end_of_project
  roofAccess: text("roof_access"), // How to access the roof
  specialRequests: text("special_requests"), // Special requests or instructions
  
  // Contact information
  buildingManagerName: varchar("building_manager_name"),
  buildingManagerPhone: varchar("building_manager_phone"),
  conciergeNames: text("concierge_names"), // Could be multiple, stored as text (comma-separated or JSON)
  conciergePhone: varchar("concierge_phone"),
  conciergeHours: text("concierge_hours"), // Hours of operation for concierge
  maintenanceName: varchar("maintenance_name"),
  maintenancePhone: varchar("maintenance_phone"),
  councilMemberUnits: text("council_member_units"), // Floor/unit numbers of council members
  
  // Parking
  tradeParkingInstructions: text("trade_parking_instructions"), // Where trades can park
  tradeParkingSpots: integer("trade_parking_spots"), // Number of trade parking spots available
  
  // Washroom
  tradeWashroomLocation: text("trade_washroom_location"), // Where trades can use washroom
  
  // Tracking
  createdByUserId: varchar("created_by_user_id").references(() => users.id),
  createdByRole: varchar("created_by_role"), // building_manager | company | superuser
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_building_instructions_building").on(table.buildingId),
]);

export const insertBuildingInstructionsSchema = createInsertSchema(buildingInstructions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type BuildingInstructions = typeof buildingInstructions.$inferSelect;
export type InsertBuildingInstructions = z.infer<typeof insertBuildingInstructionsSchema>;

// Property Manager Company Links - junction table for property managers to access multiple companies via property manager codes
export const propertyManagerCompanyLinks = pgTable("property_manager_company_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyManagerId: varchar("property_manager_id").notNull().references(() => users.id, { onDelete: "cascade" }), // Foreign key to property manager user
  companyCode: varchar("company_code", { length: 10 }).notNull(), // The property manager code (propertyManagerCode) they're linking to
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }), // Foreign key to the company this code belongs to
  strataNumber: varchar("strata_number", { length: 100 }), // Strata/building number for filtering projects
  addedAt: timestamp("added_at").defaultNow(),
}, (table) => ({
  // Unique constraint: a property manager can only link to each company code once
  uniquePropertyManagerCompany: sql`UNIQUE ("property_manager_id", "company_code")`,
}));

// Clients table - for managing property managers and building owners
export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }), // Foreign key to company
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  company: varchar("company"),
  email: varchar("email"), // Client's email address
  address: text("address"), // Street address (legacy field, now used for street only)
  city: varchar("city"),
  provinceState: varchar("province_state"),
  country: varchar("country"),
  postalCode: varchar("postal_code"),
  phoneNumber: varchar("phone_number"),
  lmsNumbers: jsonb("lms_numbers").$type<Array<{ number: string; buildingName?: string; address: string; stories?: number; units?: number; parkingStalls?: number; dailyDropTarget?: number; totalDropsNorth?: number; totalDropsEast?: number; totalDropsSouth?: number; totalDropsWest?: number }>>().default(sql`'[]'::jsonb`), // Array of objects with strata number, building name, address, building details, daily drop target, and elevation drops
  billingAddress: text("billing_address"), // Billing street address
  billingCity: varchar("billing_city"),
  billingProvinceState: varchar("billing_province_state"),
  billingCountry: varchar("billing_country"),
  billingPostalCode: varchar("billing_postal_code"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects table
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }), // Foreign key to company
  buildingName: varchar("building_name"), // Building name for display
  strataPlanNumber: varchar("strata_plan_number"),
  buildingAddress: text("building_address"), // Building address visible to all employees
  jobType: varchar("job_type").notNull(), // window_cleaning | dryer_vent_cleaning | building_wash | in_suite_dryer_vent_cleaning | parkade_pressure_cleaning | ground_window_cleaning | ndt_* | other
  customJobType: varchar("custom_job_type"), // Custom job type when jobType is "other"
  jobCategory: varchar("job_category").notNull().default('building_maintenance'), // building_maintenance | ndt | rock_scaling | wind_turbine | welding
  requiresElevation: boolean("requires_elevation").notNull().default(true), // Whether job involves rope access at height
  
  // Elevation-specific drop totals
  totalDropsNorth: integer("total_drops_north").default(0),
  totalDropsEast: integer("total_drops_east").default(0),
  totalDropsSouth: integer("total_drops_south").default(0),
  totalDropsWest: integer("total_drops_west").default(0),
  
  // Completed drops adjustments (added to calculated totals from work sessions/drop logs)
  // Use these to correct mistakes in employee entries - can be positive or negative
  dropsAdjustmentNorth: integer("drops_adjustment_north").default(0),
  dropsAdjustmentEast: integer("drops_adjustment_east").default(0),
  dropsAdjustmentSouth: integer("drops_adjustment_south").default(0),
  dropsAdjustmentWest: integer("drops_adjustment_west").default(0),
  
  dailyDropTarget: integer("daily_drop_target"),
  floorCount: integer("floor_count"),
  buildingHeight: varchar("building_height"), // e.g., "25 floors", "100m", "300ft" - for IRATA logbook hours
  targetCompletionDate: date("target_completion_date"), // Optional target completion date
  estimatedHours: integer("estimated_hours"), // Estimated total hours for the entire building
  startDate: date("start_date"), // Schedule start date
  endDate: date("end_date"), // Schedule end date
  ropeAccessPlanUrl: text("rope_access_plan_url"), // URL to current PDF in object storage
  anchorInspectionCertificateUrl: text("anchor_inspection_certificate_url"), // URL to anchor inspection certificate PDF in object storage
  documentUrls: text("document_urls").array().default(sql`ARRAY[]::text[]`), // Array of all uploaded document URLs (PDFs)
  imageUrls: text("image_urls").array().default(sql`ARRAY[]::text[]`), // Array of image URLs from object storage
  status: varchar("status").notNull().default('active'), // active | completed
  deleted: boolean("deleted").notNull().default(false), // Soft delete flag
  calendarColor: varchar("calendar_color").default('#3b82f6'), // Color for calendar display
  
  // Geolocation for map display (captured from address autocomplete)
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  
  // Service-specific expectation fields
  suitesPerDay: integer("suites_per_day"), // For in_suite_dryer_vent_cleaning
  totalFloors: integer("total_floors"), // For in_suite_dryer_vent_cleaning - total floors to clean
  floorsPerDay: integer("floors_per_day"), // Alternative for in_suite_dryer_vent_cleaning
  totalStalls: integer("total_stalls"), // For parkade_pressure_cleaning - total parking stalls
  stallsPerDay: integer("stalls_per_day"), // For parkade_pressure_cleaning
  buildingFloors: integer("building_floors"), // For in_suite_dryer_vent_cleaning - total floors in building (separate from unit count)
  
  // Anchor inspection fields
  totalAnchors: integer("total_anchors"), // For anchor_inspection - total anchors to inspect
  anchorsPerDay: integer("anchors_per_day"), // For anchor_inspection - target anchors per day
  assignedEmployees: text("assigned_employees").array().default(sql`ARRAY[]::text[]`), // Array of employee IDs assigned to this project
  peaceWork: boolean("peace_work").notNull().default(false), // Peace work toggle for project billing/tracking
  pricePerDrop: integer("price_per_drop"), // Price per drop when peace work is enabled
  
  // Client reference (optional) - links to clients table for tracking which client this project belongs to
  clientId: varchar("client_id").references(() => clients.id, { onDelete: "set null" }),
  
  // Overall completion percentage for percentage-based jobs (non-elevation or hours-based)
  // Updated by the "last one out" technician at end of day
  overallCompletionPercentage: integer("overall_completion_percentage"), // 0-100
  lastProgressUpdateBy: varchar("last_progress_update_by"), // User ID of last tech to update progress
  lastProgressUpdateAt: timestamp("last_progress_update_at"), // When progress was last updated
  timezone: varchar("timezone"), // IANA timezone override for project (e.g., "America/Toronto") - falls back to company timezone if null
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Work notices table - resident communication notices for projects
export const workNotices = pgTable("work_notices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Auto-filled from project (stored for historical reference)
  buildingName: varchar("building_name"),
  buildingAddress: text("building_address"),
  strataPlanNumber: varchar("strata_plan_number"),
  propertyManagerName: varchar("property_manager_name"),
  contractorName: varchar("contractor_name"), // Company name doing the work
  jobType: varchar("job_type").notNull(),
  customJobType: varchar("custom_job_type"),
  
  // User-entered fields
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  noticeTitle: varchar("notice_title").notNull(), // Brief title for the notice
  noticeDetails: text("notice_details").notNull(), // Full notice text (can include selected template)
  additionalInstructions: text("additional_instructions"), // Extra instructions from user
  
  // Unit/stall scheduling for in-suite and parkade jobs
  // Format: [{ date: "2024-12-12", slots: [{ startTime: "09:00", endTime: "12:00", units: ["4509", "3509"] }] }]
  unitSchedule: jsonb("unit_schedule"),
  
  // White label branding
  companyLogoUrl: text("company_logo_url"), // Logo URL if white label is enabled
  
  // Status
  isPublished: boolean("is_published").notNull().default(true), // Whether visible to residents
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_work_notices_project").on(table.projectId),
  index("IDX_work_notices_company").on(table.companyId),
]);

// Custom job types table - tracks company-specific custom job types for reuse
export const customJobTypes = pgTable("custom_job_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }), // Foreign key to company
  jobTypeName: varchar("job_type_name").notNull(), // Custom job type name
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_custom_job_types_company").on(table.companyId),
]);

// Custom notice templates table - user-saved work notice templates
export const customNoticeTemplates = pgTable("custom_notice_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  jobType: varchar("job_type").notNull(), // Which job type this template is for
  title: varchar("title").notNull(),
  details: text("details").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_custom_notice_templates_company").on(table.companyId),
  index("IDX_custom_notice_templates_job_type").on(table.jobType),
]);

// Drop logs table - tracks daily drops per project per tech per elevation
export const dropLogs = pgTable("drop_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  
  // Elevation-specific drops completed
  dropsCompletedNorth: integer("drops_completed_north").notNull().default(0),
  dropsCompletedEast: integer("drops_completed_east").notNull().default(0),
  dropsCompletedSouth: integer("drops_completed_south").notNull().default(0),
  dropsCompletedWest: integer("drops_completed_west").notNull().default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Valid shortfall reasons that don't impact technician performance scores
// When a tech selects one of these, it's recorded but doesn't penalize their metrics
export const VALID_SHORTFALL_REASONS = [
  { code: 'weather_high_wind', label: 'Weather - High Wind', category: 'weather' },
  { code: 'weather_snow_storm', label: 'Weather - Snow Storm', category: 'weather' },
  { code: 'weather_heavy_rain', label: 'Weather - Heavy Rain', category: 'weather' },
  { code: 'weather_thunderstorm', label: 'Weather - Thunderstorm', category: 'weather' },
  { code: 'weather_extreme_temperature', label: 'Weather - Extreme Temperature', category: 'weather' },
  { code: 'weather_lightning', label: 'Weather - Lightning', category: 'weather' },
  { code: 'exclusion_zone_occupied', label: 'Exclusion Zone Occupied by Others', category: 'site_access' },
  { code: 'roof_occupied', label: 'Other Trade on Roof - Unable to Rig', category: 'site_access' },
  { code: 'required_to_leave', label: 'Required to Leave Work Site', category: 'site_access' },
  { code: 'sick_or_ill', label: 'Sick or Ill - Had to Leave Work Site', category: 'health' },
  { code: 'building_malfunction_elevator', label: 'Building Malfunction - Elevator Down', category: 'building' },
  { code: 'building_malfunction_roof_access', label: 'Building Malfunction - Roof Access Blocked', category: 'building' },
  { code: 'building_malfunction_power', label: 'Building Malfunction - Power Outage', category: 'building' },
  { code: 'equipment_failure', label: 'Equipment Failure - Safety Concern', category: 'equipment' },
  { code: 'emergency_evacuation', label: 'Emergency Evacuation', category: 'emergency' },
  { code: 'client_requested_stop', label: 'Client Requested Work to Stop', category: 'client' },
  { code: 'safety_concern', label: 'Safety Concern Identified On-Site', category: 'safety' },
  { code: 'anchor_issue', label: 'Anchor Point Issue - Requires Inspection', category: 'safety' },
  { code: 'other', label: 'Other Valid Reason (Explain Below)', category: 'other' },
] as const;

export type ValidShortfallReasonCode = typeof VALID_SHORTFALL_REASONS[number]['code'];

// Work sessions table - tracks daily work sessions with start/end times per elevation
export const workSessions = pgTable("work_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  employeeId: varchar("employee_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }), // For multi-tenant isolation
  workDate: date("work_date").notNull(), // Date of the work session
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"), // Null if session is still active
  
  // Location tracking for session start/end
  startLatitude: numeric("start_latitude", { precision: 10, scale: 7 }), // GPS latitude at session start
  startLongitude: numeric("start_longitude", { precision: 10, scale: 7 }), // GPS longitude at session start
  endLatitude: numeric("end_latitude", { precision: 10, scale: 7 }), // GPS latitude at session end
  endLongitude: numeric("end_longitude", { precision: 10, scale: 7 }), // GPS longitude at session end
  
  // Elevation-specific drops completed
  dropsCompletedNorth: integer("drops_completed_north").default(0),
  dropsCompletedEast: integer("drops_completed_east").default(0),
  dropsCompletedSouth: integer("drops_completed_south").default(0),
  dropsCompletedWest: integer("drops_completed_west").default(0),
  
  // Hours breakdown for payroll
  regularHours: numeric("regular_hours", { precision: 5, scale: 2 }).default('0'),
  overtimeHours: numeric("overtime_hours", { precision: 5, scale: 2 }).default('0'),
  doubleTimeHours: numeric("double_time_hours", { precision: 5, scale: 2 }).default('0'),
  
  shortfallReason: text("shortfall_reason"), // Required if total drops < dailyDropTarget
  validShortfallReasonCode: varchar("valid_shortfall_reason_code", { length: 50 }), // Pre-defined valid reason code that doesn't impact performance
  
  // Manual completion percentage for hours-based job types (General Pressure Washing, Ground Window)
  manualCompletionPercentage: integer("manual_completion_percentage"), // 0-100, null if not applicable
  
  // Anchors inspected for anchor_inspection job type
  anchorsInspected: integer("anchors_inspected").default(0), // Number of anchors inspected this session
  
  // Peace work payment - when project has peaceWork enabled, pay = drops × pricePerDrop
  peaceWorkPay: numeric("peace_work_pay", { precision: 10, scale: 2 }), // Total pay for this session based on drops (null if not peace work)
  
  // Labor cost tracking for analytics (hours × employee hourly rate)
  laborCost: numeric("labor_cost", { precision: 10, scale: 2 }), // Cost of labor for this session
  employeeHourlyRate: numeric("employee_hourly_rate", { precision: 10, scale: 2 }), // Snapshot of employee rate at time of session
  
  // IRATA/SPRAT compliance: Actual rope access task hours (excludes lunch, breaks, downtime)
  // Important distinction: 8-hour work day ≠ 8 hours performing rope access tasks
  ropeAccessTaskHours: numeric("rope_access_task_hours", { precision: 5, scale: 2 }), // Actual hours doing rope access work
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_work_sessions_company_project_date").on(table.companyId, table.projectId, table.workDate),
  index("IDX_work_sessions_employee_project").on(table.employeeId, table.projectId),
]);

// Non-billable work sessions table - tracks non-project work (errands, training, etc.)
export const nonBillableWorkSessions = pgTable("non_billable_work_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }), // For multi-tenant isolation
  workDate: date("work_date").notNull(), // Date of the work session
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"), // Null if session is still active
  description: text("description").notNull(), // What they were doing (errands, training, etc.)
  
  // Location tracking for session start/end
  startLatitude: numeric("start_latitude", { precision: 10, scale: 7 }), // GPS latitude at session start
  startLongitude: numeric("start_longitude", { precision: 10, scale: 7 }), // GPS longitude at session start
  endLatitude: numeric("end_latitude", { precision: 10, scale: 7 }), // GPS latitude at session end
  endLongitude: numeric("end_longitude", { precision: 10, scale: 7 }), // GPS longitude at session end
  
  // Hours breakdown for payroll
  regularHours: numeric("regular_hours", { precision: 5, scale: 2 }).default('0'),
  overtimeHours: numeric("overtime_hours", { precision: 5, scale: 2 }).default('0'),
  doubleTimeHours: numeric("double_time_hours", { precision: 5, scale: 2 }).default('0'),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_non_billable_sessions_company_date").on(table.companyId, table.workDate),
  index("IDX_non_billable_sessions_employee").on(table.employeeId),
]);

// Gear inventory items table - tracks employee equipment (quantity with optional serial numbers)
export const gearItems = pgTable("gear_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }), // For multi-tenant isolation
  equipmentType: varchar("equipment_type"), // harness, rope, descender, ascender, helmet, carabiner, lanyard, other - Optional
  brand: varchar("brand"), // Optional
  model: varchar("model"), // Optional
  itemPrice: numeric("item_price", { precision: 10, scale: 2 }), // Optional - only visible to users with financial permissions
  ropeLength: numeric("rope_length", { precision: 10, scale: 2 }), // Optional - for Rope items only (in feet)
  pricePerFeet: numeric("price_per_feet", { precision: 10, scale: 2 }), // Optional - for Rope items only ($ per foot)
  assignedTo: varchar("assigned_to").default("Not in use"), // DEPRECATED - kept for backward compatibility
  notes: text("notes"), // Optional - additional notes about the item
  quantity: integer("quantity").default(1).notNull(), // Total quantity of this item (0 = out of stock)
  serialNumbers: text("serial_numbers").array(), // Optional array of serial numbers for individual items
  dateOfManufacture: date("date_of_manufacture"), // Optional - date of manufacture
  dateInService: date("date_in_service"), // Optional
  dateOutOfService: date("date_out_of_service"), // Optional
  inService: boolean("in_service").notNull().default(true), // Checkbox for in service status
  isConsumable: boolean("is_consumable").notNull().default(false), // True for consumable items (squeegee rubber, soap, gloves, applicators) - no serial numbers, permanently consumed when taken
  itemSuffix: varchar("item_suffix"), // Optional suffix to append to item type (e.g., "18"" for "Squeegee Rubber 18"")
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_gear_items_employee").on(table.employeeId),
  index("IDX_gear_items_company").on(table.companyId),
  index("IDX_gear_items_type").on(table.equipmentType),
]);

// Equipment catalog table - shared database of gear models that builds over time
// Pre-populated with industry-standard equipment, grows when users add custom items
export const equipmentCatalog = pgTable("equipment_catalog", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  equipmentType: varchar("equipment_type").notNull(), // descender, ascender, harness, etc.
  brand: varchar("brand").notNull(),
  model: varchar("model").notNull(),
  isPrePopulated: boolean("is_pre_populated").notNull().default(false), // True for industry-standard items
  addedByCompanyId: varchar("added_by_company_id").references(() => users.id, { onDelete: "set null" }), // Company that added this (null for pre-populated)
  usageCount: integer("usage_count").notNull().default(0), // How many times this has been selected
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_equipment_catalog_type").on(table.equipmentType),
  index("IDX_equipment_catalog_brand").on(table.brand),
  sql`UNIQUE ("equipment_type", "brand", "model")`,
]);

// Gear assignments table - tracks which employees have which gear and how many
export const gearAssignments = pgTable("gear_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gearItemId: varchar("gear_item_id").notNull().references(() => gearItems.id, { onDelete: "cascade" }),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }), // For multi-tenant isolation
  employeeId: varchar("employee_id").notNull().references(() => users.id, { onDelete: "cascade" }), // Employee who has this gear
  quantity: integer("quantity").notNull(), // How many of this item they have
  serialNumber: text("serial_number"), // Serial number of the assigned gear
  dateOfManufacture: date("date_of_manufacture"), // Date of manufacture for this specific assigned item
  dateInService: date("date_in_service"), // Date the assigned item was put in service
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_gear_assignments_item").on(table.gearItemId),
  index("IDX_gear_assignments_employee").on(table.employeeId),
  index("IDX_gear_assignments_company").on(table.companyId),
]);

// Gear serial numbers table - individual serial number entries with per-item dates
export const gearSerialNumbers = pgTable("gear_serial_numbers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gearItemId: varchar("gear_item_id").notNull().references(() => gearItems.id, { onDelete: "cascade" }),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  serialNumber: text("serial_number").notNull(),
  dateOfManufacture: date("date_of_manufacture"), // Per-item manufacture date
  dateInService: date("date_in_service"), // Per-item in-service date
  isRetired: boolean("is_retired").notNull().default(false), // Whether this specific unit is retired
  retiredAt: timestamp("retired_at"), // When this unit was retired
  retiredById: varchar("retired_by_id").references(() => users.id, { onDelete: "set null" }), // Who retired the item
  retiredReason: text("retired_reason"), // Reason for retirement (e.g., "End of life", "Damaged", etc.)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_gear_serial_numbers_item").on(table.gearItemId),
  index("IDX_gear_serial_numbers_company").on(table.companyId),
  index("IDX_gear_serial_numbers_serial").on(table.serialNumber),
  index("IDX_gear_serial_numbers_retired").on(table.isRetired),
  sql`UNIQUE ("gear_item_id", "serial_number")`,
]);

// Equipment damage reports table - tracks reported damage to equipment
export const equipmentDamageReports = pgTable("equipment_damage_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  gearItemId: varchar("gear_item_id").notNull().references(() => gearItems.id, { onDelete: "cascade" }),
  gearSerialNumberId: varchar("gear_serial_number_id").references(() => gearSerialNumbers.id, { onDelete: "set null" }), // Optional link to specific serial number
  reportedBy: varchar("reported_by").notNull().references(() => users.id, { onDelete: "cascade" }),
  reporterName: varchar("reporter_name").notNull(),
  equipmentCategory: varchar("equipment_category").notNull(),
  equipmentType: varchar("equipment_type").notNull(),
  equipmentBrand: varchar("equipment_brand"),
  equipmentModel: varchar("equipment_model"),
  serialNumber: varchar("serial_number"),
  damageDescription: text("damage_description").notNull(),
  damageLocation: text("damage_location"),
  damageSeverity: varchar("damage_severity").notNull(),
  discoveredDate: date("discovered_date").notNull(),
  equipmentRetired: boolean("equipment_retired").notNull().default(false),
  retirementReason: text("retirement_reason"),
  correctiveAction: text("corrective_action"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_equipment_damage_reports_company").on(table.companyId),
  index("IDX_equipment_damage_reports_gear").on(table.gearItemId),
  index("IDX_equipment_damage_reports_serial").on(table.gearSerialNumberId),
  index("IDX_equipment_damage_reports_reporter").on(table.reportedBy),
  index("IDX_equipment_damage_reports_date").on(table.discoveredDate),
]);

// Complaints table
export const complaints = pgTable("complaints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }), // Company this belongs to
  projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }), // Optional - null for general messages
  residentId: varchar("resident_id").references(() => users.id, { onDelete: "set null" }), // Optional link to resident user
  residentName: varchar("resident_name").notNull(),
  phoneNumber: varchar("phone_number").notNull(),
  unitNumber: varchar("unit_number").notNull(),
  message: text("message").notNull(),
  photoUrl: text("photo_url"), // Optional photo uploaded by resident
  status: varchar("status").notNull().default('open'), // open | closed
  viewedAt: timestamp("viewed_at"), // When staff first viewed this complaint
  closedAt: timestamp("closed_at"), // When complaint was closed - used for resolution time calculation
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Complaint notes table - techs can add notes to complaints (internal or visible to residents)
export const complaintNotes = pgTable("complaint_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  complaintId: varchar("complaint_id").notNull().references(() => complaints.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  userName: varchar("user_name").notNull(), // Denormalized for display
  note: text("note").notNull(),
  visibleToResident: boolean("visible_to_resident").notNull().default(false), // If true, resident can see this note
  createdAt: timestamp("created_at").defaultNow(),
});

// Project photos table - photos with optional unit number and comment tagging
export const projectPhotos = pgTable("project_photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  uploadedBy: varchar("uploaded_by").notNull().references(() => users.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  unitNumber: varchar("unit_number"), // Optional - for tagging photos to specific units
  comment: text("comment"), // Optional comment about the photo
  isMissedUnit: boolean("is_missed_unit").notNull().default(false), // For in-suite dryer vent projects - marks units that were missed
  missedUnitNumber: varchar("missed_unit_number"), // Unit number for missed units (only when isMissedUnit is true)
  isMissedStall: boolean("is_missed_stall").notNull().default(false), // For parkade projects - marks stalls that were missed
  missedStallNumber: varchar("missed_stall_number"), // Stall number for missed stalls (only when isMissedStall is true)
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_project_photos_project").on(table.projectId),
  index("IDX_project_photos_unit").on(table.unitNumber, table.projectId),
  index("IDX_project_photos_missed").on(table.isMissedUnit, table.projectId),
  index("IDX_project_photos_missed_stall").on(table.isMissedStall, table.projectId),
]);

// Job comments table - techs can add comments about project work
export const jobComments = pgTable("job_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  userName: varchar("user_name").notNull(), // Denormalized for display
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_job_comments_project").on(table.projectId, table.createdAt),
  index("IDX_job_comments_company").on(table.companyId),
]);

// Rope Access Equipment Categories and Inspection Items
export const ROPE_ACCESS_EQUIPMENT_CATEGORIES = {
  harness: "Harness & Seat System",
  ropes: "Work Positioning & Backup Ropes",
  descenders: "Descenders",
  ascenders: "Ascenders",
  backupDevices: "Backup Devices & Fall Arrest",
  cowstails: "Cowstails & Positioning Lanyards",
  connectors: "Connectors & Karabiners",
  anchorsRigging: "Anchors & Rigging Hardware",
  helmet: "Helmet & Head Protection",
  edgeProtection: "Edge & Rope Protection",
  rescueKit: "Rescue Kit"
} as const;

export type RopeAccessEquipmentCategory = keyof typeof ROPE_ACCESS_EQUIPMENT_CATEGORIES;

// Inspection result for each item
export type InspectionResult = "pass" | "fail" | "not_applicable";

// Equipment findings structure
export type EquipmentFindings = {
  [K in RopeAccessEquipmentCategory]?: {
    status: InspectionResult;
    items: {
      [itemKey: string]: {
        result: InspectionResult;
        notes?: string;
      };
    };
    sectionNotes?: string;
  };
};

// Pre-defined inspection items for each category
export const ROPE_ACCESS_INSPECTION_ITEMS: Record<RopeAccessEquipmentCategory, Array<{ key: string; label: string }>> = {
  harness: [
    { key: "webbing_cuts_abrasion", label: "Webbing - Cuts, fraying, or abrasion" },
    { key: "stitching_intact", label: "Stitching - Intact and secure" },
    { key: "attachment_points_damage", label: "Attachment points - No damage or deformation" },
    { key: "buckles_function", label: "Buckles - Function correctly and lock" },
    { key: "labels_legible", label: "Labels and markings - Legible" },
    { key: "chemical_contamination", label: "Free from chemical contamination" },
  ],
  ropes: [
    { key: "sheath_condition", label: "Sheath - No glazing, cuts, or excessive wear" },
    { key: "core_exposure", label: "Core - Not exposed or damaged" },
    { key: "end_terminations", label: "End terminations - Secure and undamaged" },
    { key: "rope_tags_legible", label: "Rope tags and markings - Legible" },
    { key: "contamination", label: "Free from contamination or chemical damage" },
    { key: "diameter_consistency", label: "Diameter - Consistent along length" },
  ],
  descenders: [
    { key: "friction_surfaces", label: "Friction surfaces - No excessive wear or damage" },
    { key: "cam_function", label: "Cam - Functions smoothly" },
    { key: "anti_panic_function", label: "Anti-panic function - Operates correctly" },
    { key: "locking_screws", label: "Locking screws - Secure and undamaged" },
    { key: "body_cracks", label: "Body - No cracks or deformation" },
    { key: "markings_legible", label: "Markings - Legible" },
  ],
  ascenders: [
    { key: "cam_teeth", label: "Cam teeth - No excessive wear" },
    { key: "cam_spring", label: "Cam spring - Functions correctly" },
    { key: "safety_catch", label: "Safety catch - Operates properly" },
    { key: "body_cracks", label: "Body - No cracks or deformation" },
    { key: "attachment_hole", label: "Attachment hole - No wear or deformation" },
    { key: "markings_legible", label: "Markings - Legible" },
  ],
  backupDevices: [
    { key: "locking_action", label: "Locking action - Functions correctly on rope" },
    { key: "rope_compatibility", label: "Compatible with rope diameter" },
    { key: "energy_absorber", label: "Energy absorber - Not deployed or damaged" },
    { key: "lanyard_terminations", label: "Lanyard terminations - Secure" },
    { key: "body_damage", label: "Body - No cracks or damage" },
    { key: "markings_legible", label: "Markings - Legible" },
  ],
  cowstails: [
    { key: "rope_condition", label: "Rope - No cuts, abrasion, or glazing" },
    { key: "knots_swages", label: "Knots/swages - Properly formed and secure" },
    { key: "connector_function", label: "Connectors - Gate and locking function correctly" },
    { key: "abrasion_protection", label: "Abrasion protection - Intact if present" },
    { key: "length_appropriate", label: "Length - Appropriate for use" },
  ],
  connectors: [
    { key: "gate_closes", label: "Gate - Auto-closes fully" },
    { key: "locking_sleeve", label: "Locking sleeve - Functions and locks correctly" },
    { key: "hinge_wear", label: "Hinge - No excessive wear" },
    { key: "markings_legible", label: "Markings and rating - Legible" },
    { key: "corrosion", label: "Free from corrosion" },
    { key: "deformation", label: "No bending or deformation" },
  ],
  anchorsRigging: [
    { key: "anchor_points_secure", label: "Anchor points - Secure and load-rated" },
    { key: "anchor_slings_condition", label: "Anchor slings - No cuts, abrasion, or UV damage" },
    { key: "rigging_plates_damage", label: "Rigging plates - No cracks or deformation" },
    { key: "shackles_pins", label: "Shackles - Pins secure and undamaged" },
    { key: "anchor_markings", label: "Anchor equipment markings - Legible" },
    { key: "anchor_compatibility", label: "Anchor setup - Compatible with planned loads" },
  ],
  helmet: [
    { key: "shell_cracks", label: "Shell - No cracks, dents, or damage" },
    { key: "suspension_system", label: "Suspension system - Intact and adjustable" },
    { key: "chin_strap_secure", label: "Chin strap - Secure and undamaged" },
    { key: "helmet_markings", label: "Certification markings - Legible" },
    { key: "visor_condition", label: "Visor/face shield - No cracks or scratches (if present)" },
    { key: "helmet_fit", label: "Helmet - Fits correctly and sits level" },
  ],
  edgeProtection: [
    { key: "roller_condition", label: "Rollers - Rotate freely, no damage" },
    { key: "rope_protectors", label: "Rope protectors - No tears or excessive wear" },
    { key: "edge_padding", label: "Edge padding - Intact and properly positioned" },
    { key: "protection_secure", label: "Protection devices - Securely positioned" },
  ],
  rescueKit: [
    { key: "rescue_descender", label: "Rescue descender - Functions correctly" },
    { key: "hauling_device", label: "Hauling device - Operates smoothly" },
    { key: "casualty_attachment", label: "Casualty attachment - Secure and undamaged" },
    { key: "knife_sharp", label: "Knife - Sharp and accessible" },
    { key: "kit_complete", label: "Kit - All components present" },
    { key: "rescue_plan", label: "Rescue plan - Reviewed and understood" },
  ],
};

// Rope access inspections table - daily pre-work equipment inspections
export const harnessInspections = pgTable("harness_inspections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }), // Optional
  workerId: varchar("worker_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  inspectionDate: date("inspection_date").notNull(),
  
  // Basic information
  inspectorName: varchar("inspector_name").notNull(),
  manufacturer: varchar("manufacturer"), // Primary equipment manufacturer
  personalHarnessId: varchar("personal_harness_id"), // Legacy field - kept for backward compatibility
  equipmentId: varchar("equipment_id"), // Serial/ID number of primary equipment (new field)
  lanyardType: varchar("lanyard_type"), // Legacy field - kept for backward compatibility
  
  // NEW: Structured equipment findings (JSONB) - preferred method
  equipmentFindings: jsonb("equipment_findings").$type<EquipmentFindings>().default(sql`'{}'::jsonb`),
  
  // NEW: Overall inspection result
  overallStatus: varchar("overall_status").notNull().default("pass"), // pass | fail
  
  // LEGACY: Harness & Lanyard Components (kept for backward compatibility - deprecated)
  frayedEdges: boolean("frayed_edges"),
  brokenFibers: boolean("broken_fibers"),
  pulledStitching: boolean("pulled_stitching"),
  cutsWear: boolean("cuts_wear"),
  dRingsChemicalDamage: boolean("d_rings_chemical_damage"),
  dRingsPadsExcessiveWear: boolean("d_rings_pads_excessive_wear"),
  dRingsBentDistorted: boolean("d_rings_bent_distorted"),
  dRingsCracksBreaks: boolean("d_rings_cracks_breaks"),
  buckleMechanism: boolean("buckle_mechanism"),
  tongueBucklesBentDistorted: boolean("tongue_buckles_bent_distorted"),
  tongueBucklesSharpEdges: boolean("tongue_buckles_sharp_edges"),
  tongueBucklesMoveFreely: boolean("tongue_buckles_move_freely"),
  connectorsExcessiveWear: boolean("connectors_excessive_wear"),
  connectorsLoose: boolean("connectors_loose"),
  connectorsBrokenDistorted: boolean("connectors_broken_distorted"),
  connectorsCracksHoles: boolean("connectors_cracks_holes"),
  sharpRoughEdges: boolean("sharp_rough_edges"),
  
  // LEGACY: Lanyard Inspection (kept for backward compatibility - deprecated)
  burnsTearsCracks: boolean("burns_tears_cracks"),
  chemicalDamage: boolean("chemical_damage"),
  excessiveSoiling: boolean("excessive_soiling"),
  connectorsHooksWork: boolean("connectors_hooks_work"),
  lockingMechanismsWork: boolean("locking_mechanisms_work"),
  shockAbsorberIntact: boolean("shock_absorber_intact"),
  excessiveWearSigns: boolean("excessive_wear_signs"),
  
  // Service date and general comments
  dateInService: date("date_in_service"),
  comments: text("comments"),
  
  // PDF storage
  pdfUrl: text("pdf_url"),
  
  // Kit inspection batch ID - links multiple inspections done together as a kit
  kitInspectionId: varchar("kit_inspection_id"),
  
  // Reference to the specific gear item from inventory
  gearItemId: varchar("gear_item_id").references(() => gearItems.id, { onDelete: "set null" }),
  
  // Personal inspection flag - when true, this is a technician's personal inspection
  // not tied to any company CSR rating (technician created for their own records)
  isPersonal: boolean("is_personal").notNull().default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_harness_inspections_company_date").on(table.companyId, table.inspectionDate),
  index("IDX_harness_inspections_worker").on(table.workerId, table.inspectionDate),
  index("IDX_harness_inspections_project").on(table.projectId),
  index("IDX_harness_inspections_kit").on(table.kitInspectionId),
  index("IDX_harness_inspections_personal").on(table.isPersonal, table.workerId),
]);

// Toolbox meetings table
export const toolboxMeetings = pgTable("toolbox_meetings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  conductedBy: varchar("conducted_by").notNull().references(() => users.id, { onDelete: "cascade" }),
  meetingDate: date("meeting_date").notNull(),
  
  // Meeting details
  conductedByName: varchar("conducted_by_name").notNull(),
  attendees: text("attendees").array().notNull().default(sql`ARRAY[]::text[]`), // Array of attendee names
  
  // Topics discussed (checkboxes for standard topics)
  topicFallProtection: boolean("topic_fall_protection").notNull().default(false),
  topicAnchorPoints: boolean("topic_anchor_points").notNull().default(false),
  topicRopeInspection: boolean("topic_rope_inspection").notNull().default(false),
  topicKnotTying: boolean("topic_knot_tying").notNull().default(false),
  topicPPECheck: boolean("topic_ppe_check").notNull().default(false),
  topicWeatherConditions: boolean("topic_weather_conditions").notNull().default(false),
  topicCommunication: boolean("topic_communication").notNull().default(false),
  topicEmergencyEvacuation: boolean("topic_emergency_evacuation").notNull().default(false),
  topicHazardAssessment: boolean("topic_hazard_assessment").notNull().default(false),
  topicLoadCalculations: boolean("topic_load_calculations").notNull().default(false),
  topicEquipmentCompatibility: boolean("topic_equipment_compatibility").notNull().default(false),
  topicDescenderAscender: boolean("topic_descender_ascender").notNull().default(false),
  topicEdgeProtection: boolean("topic_edge_protection").notNull().default(false),
  topicSwingFall: boolean("topic_swing_fall").notNull().default(false),
  topicMedicalFitness: boolean("topic_medical_fitness").notNull().default(false),
  topicToolDropPrevention: boolean("topic_tool_drop_prevention").notNull().default(false),
  topicRegulations: boolean("topic_regulations").notNull().default(false),
  topicRescueProcedures: boolean("topic_rescue_procedures").notNull().default(false),
  topicSiteHazards: boolean("topic_site_hazards").notNull().default(false),
  topicBuddySystem: boolean("topic_buddy_system").notNull().default(false),
  
  // Custom topic field
  customTopic: text("custom_topic"),
  
  // Additional notes
  additionalNotes: text("additional_notes"),
  
  // PDF storage
  pdfUrl: text("pdf_url"),
  
  // Digital signatures - array of signature objects with employeeId, name, and data URL
  signatures: jsonb("signatures").$type<Array<{ employeeId: string; employeeName: string; signatureDataUrl: string }>>().default(sql`'[]'::jsonb`),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_toolbox_meetings_company_date").on(table.companyId, table.meetingDate),
  index("IDX_toolbox_meetings_project").on(table.projectId, table.meetingDate),
  index("IDX_toolbox_meetings_conductor").on(table.conductedBy, table.meetingDate),
]);

// CSR Rating History - tracks changes to Company Safety Rating over time
export const csrRatingHistory = pgTable("csr_rating_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  previousScore: real("previous_score").notNull(),
  newScore: real("new_score").notNull(),
  delta: real("delta").notNull(), // Positive = improvement, negative = decline
  category: varchar("category").notNull(), // Which factor caused the change (documentation, toolbox, harness, etc.)
  reason: text("reason").notNull(), // Human-readable reason for the change
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("IDX_csr_rating_history_company").on(table.companyId, table.createdAt),
]);

export const insertCsrRatingHistorySchema = createInsertSchema(csrRatingHistory).omit({ id: true, createdAt: true });
export type InsertCsrRatingHistory = z.infer<typeof insertCsrRatingHistorySchema>;
export type CsrRatingHistory = typeof csrRatingHistory.$inferSelect;

// Field Level Hazard Assessment (FLHA) table - Rope Access specific
export const flhaForms = pgTable("flha_forms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  assessorId: varchar("assessor_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  assessmentDate: date("assessment_date").notNull(),
  
  // Basic Information
  assessorName: varchar("assessor_name").notNull(),
  jobDescription: text("job_description").notNull(),
  location: varchar("location").notNull(),
  workArea: varchar("work_area"), // Specific work area/zone
  
  // Hazards Identified - Rope Access Specific
  hazardFalling: boolean("hazard_falling").notNull().default(false),
  hazardSwingFall: boolean("hazard_swing_fall").notNull().default(false),
  hazardSuspendedRescue: boolean("hazard_suspended_rescue").notNull().default(false),
  hazardWeather: boolean("hazard_weather").notNull().default(false),
  hazardElectrical: boolean("hazard_electrical").notNull().default(false),
  hazardFallingObjects: boolean("hazard_falling_objects").notNull().default(false),
  hazardChemical: boolean("hazard_chemical").notNull().default(false),
  hazardConfined: boolean("hazard_confined").notNull().default(false),
  hazardSharpEdges: boolean("hazard_sharp_edges").notNull().default(false),
  hazardUnstableAnchors: boolean("hazard_unstable_anchors").notNull().default(false),
  hazardPowerTools: boolean("hazard_power_tools").notNull().default(false),
  hazardPublic: boolean("hazard_public").notNull().default(false),
  
  // Controls Implemented
  controlPPE: boolean("control_ppe").notNull().default(false),
  controlBackupSystem: boolean("control_backup_system").notNull().default(false),
  controlEdgeProtection: boolean("control_edge_protection").notNull().default(false),
  controlBarricades: boolean("control_barricades").notNull().default(false),
  controlWeatherMonitoring: boolean("control_weather_monitoring").notNull().default(false),
  controlRescuePlan: boolean("control_rescue_plan").notNull().default(false),
  controlCommunication: boolean("control_communication").notNull().default(false),
  controlToolTethering: boolean("control_tool_tethering").notNull().default(false),
  controlPermits: boolean("control_permits").notNull().default(false),
  controlInspections: boolean("control_inspections").notNull().default(false),
  
  // Risk Assessment
  riskLevelBefore: varchar("risk_level_before"), // low | medium | high | extreme
  riskLevelAfter: varchar("risk_level_after"), // low | medium | high | extreme
  
  // Additional Information
  additionalHazards: text("additional_hazards"),
  additionalControls: text("additional_controls"),
  emergencyContacts: text("emergency_contacts"),
  
  // Team members
  teamMembers: text("team_members").array().notNull().default(sql`ARRAY[]::text[]`),
  
  // Digital signatures
  signatures: jsonb("signatures").$type<Array<{ employeeId: string; employeeName: string; signatureDataUrl: string }>>().default(sql`'[]'::jsonb`),
  
  // PDF storage
  pdfUrl: text("pdf_url"),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_flha_company_date").on(table.companyId, table.assessmentDate),
  index("IDX_flha_project").on(table.projectId, table.assessmentDate),
  index("IDX_flha_assessor").on(table.assessorId, table.assessmentDate),
]);

// Incident Reports table - for workplace incident documentation
export const incidentReports = pgTable("incident_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }), // Optional - may not be project-specific
  reportedById: varchar("reported_by_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Basic Information
  reporterName: varchar("reporter_name").notNull(),
  reporterTitle: varchar("reporter_title").notNull(), // Job title of person filing report
  incidentDate: date("incident_date").notNull(),
  incidentTime: varchar("incident_time").notNull(), // Time of incident (HH:MM format)
  reportDate: date("report_date").notNull(), // Date report was filed
  location: text("location").notNull(), // Where incident occurred
  specificLocation: text("specific_location"), // More detailed location (e.g., "3rd floor, east side")
  
  // Incident Classification
  incidentType: varchar("incident_type").notNull(), // injury | near_miss | property_damage | environmental | equipment_failure | other
  incidentSeverity: varchar("incident_severity").notNull(), // minor | moderate | serious | critical | fatal
  workRelated: boolean("work_related").notNull().default(true), // Was this work-related?
  
  // Injured/Affected Person(s)
  injuredPersonName: varchar("injured_person_name"), // Name of injured person (if applicable)
  injuredPersonRole: varchar("injured_person_role"), // Role/title of injured person
  injuredPersonCompany: varchar("injured_person_company"), // Company (in case of contractor/visitor)
  injuryType: varchar("injury_type"), // Type of injury: cut | bruise | fracture | sprain | burn | other
  injuryLocation: varchar("injury_location"), // Body part: head | neck | back | arm | leg | hand | foot | other
  medicalTreatment: varchar("medical_treatment"), // none | first_aid | clinic | hospital | emergency
  timeOffWork: boolean("time_off_work").default(false), // Did person miss work?
  estimatedDaysOff: integer("estimated_days_off"), // Estimated days off work
  
  // Incident Description
  incidentDescription: text("incident_description").notNull(), // Detailed description of what happened
  taskBeingPerformed: text("task_being_performed"), // What task was being performed
  equipmentInvolved: text("equipment_involved"), // Equipment/tools involved
  environmentalFactors: text("environmental_factors"), // Weather, lighting, noise, etc.
  
  // Witnesses
  witnesses: text("witnesses").array().default(sql`ARRAY[]::text[]`), // Array of witness names
  witnessStatements: text("witness_statements"), // Statements from witnesses
  
  // Immediate Actions Taken
  firstAidProvided: boolean("first_aid_provided").default(false),
  emergencyServicesContacted: boolean("emergency_services_contacted").default(false),
  areaSecured: boolean("area_secured").default(false),
  equipmentIsolated: boolean("equipment_isolated").default(false),
  immediateActionDescription: text("immediate_action_description"), // Description of immediate actions
  
  // Root Cause Analysis
  rootCauseEquipmentFailure: boolean("root_cause_equipment_failure").default(false),
  rootCauseHumanError: boolean("root_cause_human_error").default(false),
  rootCauseInadequateTraining: boolean("root_cause_inadequate_training").default(false),
  rootCauseUnsafeConditions: boolean("root_cause_unsafe_conditions").default(false),
  rootCausePoorCommunication: boolean("root_cause_poor_communication").default(false),
  rootCauseInsufficientPPE: boolean("root_cause_insufficient_ppe").default(false),
  rootCauseWeatherConditions: boolean("root_cause_weather_conditions").default(false),
  rootCauseOther: boolean("root_cause_other").default(false),
  rootCauseDetails: text("root_cause_details"), // Detailed root cause analysis
  
  // Corrective Actions
  correctiveActionsRequired: text("corrective_actions_required"), // Actions to prevent recurrence
  correctiveActionResponsible: varchar("corrective_action_responsible"), // Person responsible for actions
  correctiveActionDeadline: date("corrective_action_deadline"), // Deadline for completion
  correctiveActionsCompleted: boolean("corrective_actions_completed").default(false),
  correctiveActionsCompletionDate: date("corrective_actions_completion_date"),
  
  // Preventive Measures
  preventiveTrainingRequired: boolean("preventive_training_required").default(false),
  preventiveEquipmentModification: boolean("preventive_equipment_modification").default(false),
  preventiveProcedureUpdate: boolean("preventive_procedure_update").default(false),
  preventiveAdditionalPPE: boolean("preventive_additional_ppe").default(false),
  preventiveEngineeringControls: boolean("preventive_engineering_controls").default(false),
  preventiveMeasuresDetails: text("preventive_measures_details"),
  
  // Regulatory Reporting
  reportableToAuthorities: boolean("reportable_to_authorities").default(false),
  authoritiesNotified: boolean("authorities_notified").default(false),
  authorityName: varchar("authority_name"), // Name of regulatory authority
  authorityReportDate: date("authority_report_date"),
  authorityReferenceNumber: varchar("authority_reference_number"),
  
  // Supervisor/Manager Review
  reviewedBySupervisorId: varchar("reviewed_by_supervisor_id").references(() => users.id),
  reviewedBySupervisorName: varchar("reviewed_by_supervisor_name"),
  supervisorReviewDate: date("supervisor_review_date"),
  supervisorComments: text("supervisor_comments"),
  
  // Management Review
  reviewedByManagementId: varchar("reviewed_by_management_id").references(() => users.id),
  reviewedByManagementName: varchar("reviewed_by_management_name"),
  managementReviewDate: date("management_review_date"),
  managementComments: text("management_comments"),
  
  // Photos/Evidence
  photoUrls: text("photo_urls").array().default(sql`ARRAY[]::text[]`), // Photos of incident scene
  evidenceNotes: text("evidence_notes"), // Notes about evidence collected
  
  // Digital signatures
  signatures: jsonb("signatures").$type<Array<{ employeeId: string; employeeName: string; signatureDataUrl: string; role: string }>>().default(sql`'[]'::jsonb`),
  
  // Status
  reportStatus: varchar("report_status").notNull().default('draft'), // draft | submitted | under_review | closed
  
  // PDF storage
  pdfUrl: text("pdf_url"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_incident_company_date").on(table.companyId, table.incidentDate),
  index("IDX_incident_project").on(table.projectId),
  index("IDX_incident_reporter").on(table.reportedById),
  index("IDX_incident_severity").on(table.companyId, table.incidentSeverity),
  index("IDX_incident_type").on(table.companyId, table.incidentType),
]);

// Method Statements / Work Plans table - IRATA-compliant safe work method statements
export const methodStatements = pgTable("method_statements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  preparedById: varchar("prepared_by_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Basic Information
  preparedByName: varchar("prepared_by_name").notNull(),
  dateCreated: date("date_created").notNull(),
  jobTitle: varchar("job_title"), // Deprecated: use jobType instead
  jobType: varchar("job_type").notNull().default('other'), // window_cleaning | dryer_vent_cleaning | building_wash | etc.
  location: varchar("location").notNull(),
  workDescription: text("work_description").notNull(),
  
  // Scope of Work
  scopeDetails: text("scope_details").notNull(),
  workDuration: varchar("work_duration"), // e.g., "3 days", "1 week"
  numberOfWorkers: integer("number_of_workers"),
  
  // Hazards Identified
  hazardsIdentified: text("hazards_identified").array().notNull().default(sql`ARRAY[]::text[]`),
  
  // Control Measures / Safe Work Procedures
  controlMeasures: text("control_measures").array().notNull().default(sql`ARRAY[]::text[]`),
  
  // Required Equipment & PPE
  requiredEquipment: text("required_equipment").array().notNull().default(sql`ARRAY[]::text[]`),
  requiredPPE: text("required_ppe").array().notNull().default(sql`ARRAY[]::text[]`),
  
  // Emergency Procedures
  emergencyProcedures: text("emergency_procedures").notNull(),
  rescuePlan: text("rescue_plan"),
  emergencyContacts: text("emergency_contacts"),
  
  // Permits & Approvals Required
  permitsRequired: text("permits_required").array().default(sql`ARRAY[]::text[]`),
  
  // Environmental Conditions
  weatherRestrictions: text("weather_restrictions"),
  workingHeightRange: varchar("working_height_range"), // e.g., "20-50m"
  accessMethod: varchar("access_method"), // e.g., "rope access", "suspended platform"
  
  // Competency Requirements
  competencyRequirements: text("competency_requirements").array().default(sql`ARRAY[]::text[]`),
  irataLevelRequired: varchar("irata_level_required"), // L1, L2, L3
  
  // Communication Plan
  communicationMethod: text("communication_method"),
  signalProtocol: text("signal_protocol"),
  
  // Team Members Assigned
  teamMembers: text("team_members").array().notNull().default(sql`ARRAY[]::text[]`),
  
  // Review & Approval
  reviewedById: varchar("reviewed_by_id").references(() => users.id),
  reviewedByName: varchar("reviewed_by_name"),
  reviewDate: date("review_date"),
  approvedById: varchar("approved_by_id").references(() => users.id),
  approvedByName: varchar("approved_by_name"),
  approvalDate: date("approval_date"),
  
  // Digital Signatures
  signatures: jsonb("signatures").$type<Array<{ 
    role: string; // "preparer" | "reviewer" | "approver" | "worker"
    employeeId: string; 
    employeeName: string; 
    signatureDataUrl: string;
    signedAt: string;
  }>>().default(sql`'[]'::jsonb`),
  
  // PDF storage
  pdfUrl: text("pdf_url"),
  
  // Status
  status: varchar("status").notNull().default('draft'), // draft | active | archived
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_method_statements_company_date").on(table.companyId, table.dateCreated),
  index("IDX_method_statements_project").on(table.projectId, table.dateCreated),
  index("IDX_method_statements_preparer").on(table.preparedById, table.dateCreated),
  index("IDX_method_statements_status").on(table.companyId, table.status),
]);

// Company documents table - for policy and safety manuals
export const companyDocuments = pgTable("company_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  documentType: varchar("document_type").notNull(), // 'health_safety_manual' | 'company_policy' | 'equipment_inspection' | 'method_statement' | 'safe_work_procedure'
  fileName: varchar("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  uploadedById: varchar("uploaded_by_id").notNull().references(() => users.id),
  uploadedByName: varchar("uploaded_by_name").notNull(),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: "set null" }), // Optional: link to specific project (for equipment inspections)
  jobType: varchar("job_type"), // For method_statement documents: window_cleaning | dryer_vent_cleaning | building_wash | etc.
  customJobType: varchar("custom_job_type"), // Custom job type name when jobType is "other"
  isTemplate: boolean("is_template").default(false), // True for system-provided template procedures
  templateId: varchar("template_id"), // Unique identifier for template (e.g., 'swp_window_cleaning')
  description: text("description"), // Description for safe work procedures
  targetRoles: text("target_roles").array().default(sql`ARRAY['rope_access_tech', 'ground_crew']::text[]`), // Which roles must sign this document (default: both)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(), // Track when document was last updated/replaced
  graceEndsAt: timestamp("grace_ends_at"), // 14-day grace period end date for SCR calculations - employees have until this date to sign new/updated documents
  insuranceExpiryDate: timestamp("insurance_expiry_date"), // Extracted expiry date from Certificate of Insurance PDF via AI
}, (table) => [
  index("IDX_company_docs_company").on(table.companyId),
  index("IDX_company_docs_type").on(table.companyId, table.documentType),
  index("IDX_company_docs_project").on(table.projectId),
  index("IDX_company_docs_job_type").on(table.companyId, table.documentType, table.jobType),
  index("IDX_company_docs_template").on(table.companyId, table.templateId),
]);

// User certifications table - for technician additional certifications
export const userCertifications = pgTable("user_certifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  fileName: varchar("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  description: text("description"),
  expiryDate: date("expiry_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_user_certs_user").on(table.userId),
  index("IDX_user_certs_expiry").on(table.userId, table.expiryDate),
]);

export const insertUserCertificationSchema = createInsertSchema(userCertifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUserCertification = z.infer<typeof insertUserCertificationSchema>;
export type UserCertification = typeof userCertifications.$inferSelect;

// Pay period configuration table - one per company
export const payPeriodConfig = pgTable("pay_period_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  periodType: varchar("period_type").notNull(), // semi-monthly | weekly | bi-weekly | monthly | custom
  
  // For semi-monthly: first day of period (1-28, default 1 and 15)
  firstPayDay: integer("first_pay_day"), // First pay day of month (e.g., 1)
  secondPayDay: integer("second_pay_day"), // Second pay day of month (e.g., 15)
  
  // For monthly: start and end day of month
  monthlyStartDay: integer("monthly_start_day"), // Day of month when period starts (1-28)
  monthlyEndDay: integer("monthly_end_day"), // Day of month when period ends (1-31)
  
  // For weekly/bi-weekly: day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
  startDayOfWeek: integer("start_day_of_week"), // Day when week starts
  
  // For bi-weekly: anchor date to calculate from
  biWeeklyAnchorDate: date("bi_weekly_anchor_date"), // Starting point for bi-weekly periods
  
  // For custom range: specific start and end dates
  customStartDate: date("custom_start_date"), // Custom range start date
  customEndDate: date("custom_end_date"), // Custom range end date
  
  // Overtime and double time pay multipliers
  overtimeMultiplier: numeric("overtime_multiplier", { precision: 4, scale: 2 }).default('1.5'), // e.g., 1.5 for time-and-a-half
  doubleTimeMultiplier: numeric("double_time_multiplier", { precision: 4, scale: 2 }).default('2.0'), // e.g., 2.0 for double time
  
  // Overtime and double time trigger thresholds
  overtimeTriggerType: varchar("overtime_trigger_type").default('daily'), // 'daily' | 'weekly'
  overtimeHoursThreshold: numeric("overtime_hours_threshold", { precision: 5, scale: 2 }).default('8'), // e.g., 8 hours/day or 40 hours/week
  doubleTimeTriggerType: varchar("double_time_trigger_type").default('daily'), // 'daily' | 'weekly'
  doubleTimeHoursThreshold: numeric("double_time_hours_threshold", { precision: 5, scale: 2 }).default('12'), // e.g., 12 hours/day or 60 hours/week
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_pay_period_config_company").on(table.companyId),
]);

// Pay periods table - generated periods based on config
export const payPeriods = pgTable("pay_periods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  status: varchar("status").notNull().default('upcoming'), // upcoming | current | past
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_pay_periods_company_dates").on(table.companyId, table.startDate, table.endDate),
  index("IDX_pay_periods_status").on(table.companyId, table.status),
]);

// Quotes table - for building maintenance service quotes (main quote container)
export const quotes = pgTable("quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Unique quote number for display (e.g., "Q-0001")
  quoteNumber: varchar("quote_number"),
  
  // Building information
  buildingName: varchar("building_name").notNull(),
  strataPlanNumber: varchar("strata_plan_number").notNull(),
  buildingAddress: text("building_address").notNull(),
  floorCount: integer("floor_count").notNull(),
  
  // Strata Property Manager information (optional)
  strataManagerName: varchar("strata_manager_name"),
  strataManagerAddress: text("strata_manager_address"),
  
  // Client reference (optional) - links to clients table for project conversion
  clientId: varchar("client_id").references(() => clients.id, { onDelete: "set null" }),
  
  // Photo attachments - support multiple photos
  photoUrls: text("photo_urls").array().default(sql`ARRAY[]::text[]`), // Array of photo URLs in object storage
  
  // Tracking
  createdBy: varchar("created_by").notNull().references(() => users.id), // User who created the quote
  
  // Status
  status: varchar("status").notNull().default('draft'), // draft | open | closed
  
  // Pipeline CRM - stage tracking for quote workflow
  pipelineStage: varchar("pipeline_stage").notNull().default('draft'), // draft | submitted | review | negotiation | approved | won | lost
  stageUpdatedAt: timestamp("stage_updated_at").defaultNow(),
  
  // Calculated total amount for analytics (sum of all service costs)
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).default('0'),
  
  // Tax information based on building location
  taxRegion: varchar("tax_region"), // Province/State code (e.g., 'BC', 'ON', 'CA', 'TX')
  taxCountry: varchar("tax_country"), // 'CA' | 'US'
  taxType: varchar("tax_type"), // 'GST' | 'GST+PST' | 'GST+QST' | 'HST' | 'STATE' | 'NONE'
  gstRate: numeric("gst_rate", { precision: 5, scale: 3 }).default('0'), // GST rate percentage
  pstRate: numeric("pst_rate", { precision: 5, scale: 3 }).default('0'), // PST/QST/State rate percentage
  hstRate: numeric("hst_rate", { precision: 5, scale: 3 }).default('0'), // HST rate percentage
  gstAmount: numeric("gst_amount", { precision: 12, scale: 2 }).default('0'), // Calculated GST amount
  pstAmount: numeric("pst_amount", { precision: 12, scale: 2 }).default('0'), // Calculated PST/QST/State amount
  hstAmount: numeric("hst_amount", { precision: 12, scale: 2 }).default('0'), // Calculated HST amount
  totalTax: numeric("total_tax", { precision: 12, scale: 2 }).default('0'), // Total tax amount
  grandTotal: numeric("grand_total", { precision: 12, scale: 2 }).default('0'), // Subtotal + Tax
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  
  // Property Manager Collaboration Fields
  recipientPropertyManagerId: varchar("recipient_property_manager_id").references(() => users.id, { onDelete: "set null" }),
  collaborationStatus: varchar("collaboration_status").default('draft'), // draft | sent | viewed | negotiation | accepted | declined | revoked
  sentAt: timestamp("sent_at"),
  viewedAt: timestamp("viewed_at"),
  respondedAt: timestamp("responded_at"),
  currentRevisionId: integer("current_revision_id"), // FK to quote_revisions added after that table is created
  createdProjectId: varchar("created_project_id").references(() => projects.id, { onDelete: "set null" }), // Idempotency guard for auto-created project
}, (table) => [
  index("IDX_quotes_company").on(table.companyId),
  index("IDX_quotes_strata").on(table.strataPlanNumber),
  index("IDX_quotes_status").on(table.companyId, table.status),
  index("IDX_quotes_pipeline_stage").on(table.companyId, table.pipelineStage),
  index("IDX_quotes_recipient_pm").on(table.recipientPropertyManagerId),
  index("IDX_quotes_collaboration_status").on(table.companyId, table.collaborationStatus),
]);

// Quote services table - each quote can have multiple services
export const quoteServices = pgTable("quote_services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quoteId: varchar("quote_id").notNull().references(() => quotes.id, { onDelete: "cascade" }),
  serviceType: varchar("service_type").notNull(), // window_cleaning | dryer_vent_cleaning | building_wash | parkade | ground_windows | in_suite | custom
  customServiceName: varchar("custom_service_name"), // For custom services
  description: text("description"), // Service-specific notes/description
  
  // Elevation-based services (window_cleaning, dryer_vent_cleaning, building_wash)
  dropsNorth: integer("drops_north"),
  dropsEast: integer("drops_east"),
  dropsSouth: integer("drops_south"),
  dropsWest: integer("drops_west"),
  dropsPerDay: integer("drops_per_day"),
  
  // Parkade service
  parkadeStalls: integer("parkade_stalls"),
  pricePerStall: numeric("price_per_stall", { precision: 10, scale: 2 }),
  
  // Ground windows service
  groundWindowHours: numeric("ground_window_hours", { precision: 10, scale: 2 }),
  
  // In-suite service
  suitesPerDay: integer("suites_per_day"),
  floorsPerDay: integer("floors_per_day"),
  
  // Dryer vent pricing options
  dryerVentPricingType: varchar("dryer_vent_pricing_type"), // per_hour | per_unit
  dryerVentUnits: integer("dryer_vent_units"),
  dryerVentPricePerUnit: numeric("dryer_vent_price_per_unit", { precision: 10, scale: 2 }),
  
  // Pricing (common to all services)
  pricePerHour: numeric("price_per_hour", { precision: 10, scale: 2 }),
  totalHours: numeric("total_hours", { precision: 10, scale: 2 }),
  totalCost: numeric("total_cost", { precision: 10, scale: 2 }),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_quote_services_quote").on(table.quoteId),
  index("IDX_quote_services_type").on(table.quoteId, table.serviceType),
]);

// Quote history table - audit trail for quote creation and pipeline stage changes
export const quoteHistory = pgTable("quote_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quoteId: varchar("quote_id").notNull().references(() => quotes.id, { onDelete: "cascade" }),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Event type
  eventType: varchar("event_type").notNull(), // created | pipeline_stage_changed
  
  // Stage change details (null for 'created' events)
  previousStage: varchar("previous_stage"), // draft | submitted | review | negotiation | approved | won | lost
  newStage: varchar("new_stage"), // draft | submitted | review | negotiation | approved | won | lost
  
  // Actor who made the change
  actorUserId: varchar("actor_user_id").references(() => users.id, { onDelete: "set null" }),
  actorName: varchar("actor_name"), // Denormalized for audit trail persistence
  
  // Optional notes
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("IDX_quote_history_quote").on(table.quoteId),
  index("IDX_quote_history_company").on(table.companyId),
  index("IDX_quote_history_created").on(table.quoteId, table.createdAt),
]);

// Quote messages table - 2-way collaboration between property managers and companies
export const quoteMessages = pgTable("quote_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quoteId: varchar("quote_id").notNull().references(() => quotes.id, { onDelete: "cascade" }),
  
  // Sender information
  senderUserId: varchar("sender_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  senderType: varchar("sender_type").notNull(), // company | property_manager
  senderName: varchar("sender_name").notNull(), // Denormalized for display
  
  // Message content
  messageType: varchar("message_type").notNull(), // message | counter_offer | accept | decline | revoke
  content: text("content"), // Text message content
  
  // Counter-offer details (when messageType is 'counter_offer')
  counterOfferAmount: numeric("counter_offer_amount", { precision: 12, scale: 2 }),
  counterOfferNotes: text("counter_offer_notes"),
  
  // Response to counter-offer (when company responds)
  responseStatus: varchar("response_status"), // pending | accepted | declined
  respondedAt: timestamp("responded_at"),
  respondedBy: varchar("responded_by").references(() => users.id, { onDelete: "set null" }),
  
  // Read status
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("IDX_quote_messages_quote").on(table.quoteId),
  index("IDX_quote_messages_sender").on(table.senderUserId),
  index("IDX_quote_messages_created").on(table.quoteId, table.createdAt),
]);

export const insertQuoteMessageSchema = createInsertSchema(quoteMessages).omit({
  id: true,
  createdAt: true,
  isRead: true,
  readAt: true,
  responseStatus: true,
  respondedAt: true,
  respondedBy: true,
});

export type InsertQuoteMessage = z.infer<typeof insertQuoteMessageSchema>;
export type QuoteMessage = typeof quoteMessages.$inferSelect;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects), // For company role
  dropLogs: many(dropLogs),
  workSessions: many(workSessions), // For employee roles
  complaints: many(complaints), // For resident role
  complaintNotes: many(complaintNotes),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  company: one(users, {
    fields: [projects.companyId],
    references: [users.id],
  }),
  dropLogs: many(dropLogs),
  workSessions: many(workSessions),
  complaints: many(complaints),
  photos: many(projectPhotos),
}));

export const dropLogsRelations = relations(dropLogs, ({ one }) => ({
  project: one(projects, {
    fields: [dropLogs.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [dropLogs.userId],
    references: [users.id],
  }),
}));

export const workSessionsRelations = relations(workSessions, ({ one }) => ({
  project: one(projects, {
    fields: [workSessions.projectId],
    references: [projects.id],
  }),
  employee: one(users, {
    fields: [workSessions.employeeId],
    references: [users.id],
  }),
  company: one(users, {
    fields: [workSessions.companyId],
    references: [users.id],
  }),
}));

export const complaintsRelations = relations(complaints, ({ one, many }) => ({
  project: one(projects, {
    fields: [complaints.projectId],
    references: [projects.id],
  }),
  resident: one(users, {
    fields: [complaints.residentId],
    references: [users.id],
  }),
  notes: many(complaintNotes),
}));

export const complaintNotesRelations = relations(complaintNotes, ({ one }) => ({
  complaint: one(complaints, {
    fields: [complaintNotes.complaintId],
    references: [complaints.id],
  }),
  user: one(users, {
    fields: [complaintNotes.userId],
    references: [users.id],
  }),
}));

export const projectPhotosRelations = relations(projectPhotos, ({ one }) => ({
  project: one(projects, {
    fields: [projectPhotos.projectId],
    references: [projects.id],
  }),
  uploadedByUser: one(users, {
    fields: [projectPhotos.uploadedBy],
    references: [users.id],
  }),
}));

export const jobCommentsRelations = relations(jobComments, ({ one }) => ({
  project: one(projects, {
    fields: [jobComments.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [jobComments.userId],
    references: [users.id],
  }),
  company: one(users, {
    fields: [jobComments.companyId],
    references: [users.id],
  }),
}));

export const harnessInspectionsRelations = relations(harnessInspections, ({ one }) => ({
  company: one(users, {
    fields: [harnessInspections.companyId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [harnessInspections.projectId],
    references: [projects.id],
  }),
  worker: one(users, {
    fields: [harnessInspections.workerId],
    references: [users.id],
  }),
}));

export const payPeriodConfigRelations = relations(payPeriodConfig, ({ one }) => ({
  company: one(users, {
    fields: [payPeriodConfig.companyId],
    references: [users.id],
  }),
}));

export const payPeriodsRelations = relations(payPeriods, ({ one }) => ({
  company: one(users, {
    fields: [payPeriods.companyId],
    references: [users.id],
  }),
}));

export const quotesRelations = relations(quotes, ({ one, many }) => ({
  company: one(users, {
    fields: [quotes.companyId],
    references: [users.id],
  }),
  services: many(quoteServices),
}));

export const quoteServicesRelations = relations(quoteServices, ({ one }) => ({
  quote: one(quotes, {
    fields: [quoteServices.quoteId],
    references: [quotes.id],
  }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPropertyManagerCompanyLinkSchema = createInsertSchema(propertyManagerCompanyLinks).omit({
  id: true,
  addedAt: true,
});

export type InsertPropertyManagerCompanyLink = z.infer<typeof insertPropertyManagerCompanyLinkSchema>;
export type PropertyManagerCompanyLink = typeof propertyManagerCompanyLinks.$inferSelect;

// Schema for property manager account updates
export const updatePropertyManagerAccountSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  propertyManagerPhoneNumber: z.string().optional(),
  propertyManagerSmsOptIn: z.boolean().optional(),
  propertyManagementCompany: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
}).refine((data) => {
  // If newPassword is provided, it must be at least 6 characters
  if (data.newPassword && data.newPassword.length > 0 && data.newPassword.length < 6) {
    return false;
  }
  return true;
}, {
  message: "Password must be at least 6 characters",
  path: ["newPassword"],
}).refine((data) => {
  // If newPassword is provided, currentPassword must also be provided
  if (data.newPassword && data.newPassword.length > 0 && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "Current password is required to change password",
  path: ["currentPassword"],
});

export type UpdatePropertyManagerAccount = z.infer<typeof updatePropertyManagerAccountSchema>;

// Helper to handle null values for optional numbers (forms often send null instead of undefined)
const optionalNumber = z.union([z.number(), z.null()]).transform(v => v === null ? undefined : v).optional();

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  companyId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  lmsNumbers: z.array(z.object({
    number: z.string(),
    address: z.string(),
    stories: optionalNumber,
    units: optionalNumber,
    parkingStalls: optionalNumber,
    dailyDropTarget: optionalNumber,
    totalDropsNorth: optionalNumber,
    totalDropsEast: optionalNumber,
    totalDropsSouth: optionalNumber,
    totalDropsWest: optionalNumber,
  })).optional(),
});

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

// Valid job type values for schema validation
const validJobTypeValues = getAllJobTypeValues() as [string, ...string[]];

export const insertProjectSchema = createInsertSchema(projects)
  .omit({
    id: true,
    companyId: true,
    createdAt: true,
    updatedAt: true,
    status: true,
  })
  .extend({
    dailyDropTarget: z.number().optional(),
    jobType: z.enum(validJobTypeValues, {
      errorMap: () => ({ message: "Invalid job type selected" })
    }),
    jobCategory: z.enum(['building_maintenance', 'ndt', 'rock_scaling', 'wind_turbine', 'oil_field']).optional().default('building_maintenance'),
    requiresElevation: z.boolean().optional().default(true),
  })
  .superRefine((data, ctx) => {
    // Validate jobType belongs to the selected category (only if category is explicitly provided)
    // Skip validation if jobCategory is undefined/null (will use default value)
    if (data.jobCategory) {
      const expectedCategory = getCategoryForJobType(data.jobType);
      if (expectedCategory && data.jobCategory !== expectedCategory) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Job type "${data.jobType}" does not belong to category "${data.jobCategory}"`,
          path: ["jobType"],
        });
      }
    }
    
    // Only require dailyDropTarget for drop-based jobs that require elevation
    if (isDropBasedJobType(data.jobType) && data.requiresElevation !== false) {
      if (!data.dailyDropTarget || data.dailyDropTarget <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Daily drop target is required for drop-based jobs",
          path: ["dailyDropTarget"],
        });
      }
    }
    
    // Suite-based job validation
    if (isSuiteBasedJobType(data.jobType)) {
      if (!data.suitesPerDay && !data.floorsPerDay) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Either suites per day or floors per day is required",
          path: ["suitesPerDay"],
        });
      }
    }
    
    // Stall-based job validation
    if (isStallBasedJobType(data.jobType)) {
      if (!data.stallsPerDay) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Stalls per day is required",
          path: ["stallsPerDay"],
        });
      }
    }
  });

export const insertWorkNoticeSchema = createInsertSchema(workNotices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCustomJobTypeSchema = createInsertSchema(customJobTypes).omit({
  id: true,
  createdAt: true,
});

export const insertCustomNoticeTemplateSchema = createInsertSchema(customNoticeTemplates).omit({
  id: true,
  createdAt: true,
});

export const insertDropLogSchema = createInsertSchema(dropLogs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWorkSessionSchema = createInsertSchema(workSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNonBillableWorkSessionSchema = createInsertSchema(nonBillableWorkSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGearItemSchema = createInsertSchema(gearItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEquipmentCatalogSchema = createInsertSchema(equipmentCatalog).omit({
  id: true,
  createdAt: true,
});

export const insertGearAssignmentSchema = createInsertSchema(gearAssignments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGearSerialNumberSchema = createInsertSchema(gearSerialNumbers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEquipmentDamageReportSchema = createInsertSchema(equipmentDamageReports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertComplaintSchema = createInsertSchema(complaints).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  viewedAt: true, // Set server-side when staff views
  closedAt: true, // Set server-side when complaint is closed
});

export const insertComplaintNoteSchema = createInsertSchema(complaintNotes).omit({
  id: true,
  createdAt: true,
  userName: true, // Set server-side
});

export const insertProjectPhotoSchema = createInsertSchema(projectPhotos).omit({
  id: true,
  createdAt: true,
});

export const insertJobCommentSchema = createInsertSchema(jobComments).omit({
  id: true,
  createdAt: true,
});

export const insertHarnessInspectionSchema = createInsertSchema(harnessInspections).omit({
  id: true,
  createdAt: true,
  pdfUrl: true, // Generated server-side
});

export const insertToolboxMeetingSchema = createInsertSchema(toolboxMeetings).omit({
  id: true,
  createdAt: true,
  pdfUrl: true, // Generated server-side
});

export const insertFlhaFormSchema = createInsertSchema(flhaForms).omit({
  id: true,
  createdAt: true,
  pdfUrl: true, // Generated server-side
});

export const insertIncidentReportSchema = createInsertSchema(incidentReports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  pdfUrl: true, // Generated server-side
});

export const insertMethodStatementSchema = createInsertSchema(methodStatements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  pdfUrl: true, // Generated server-side
});

export const insertPayPeriodConfigSchema = createInsertSchema(payPeriodConfig).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPayPeriodSchema = createInsertSchema(payPeriods).omit({
  id: true,
  createdAt: true,
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuoteServiceSchema = createInsertSchema(quoteServices).omit({
  id: true,
  createdAt: true,
});

export const insertQuoteHistorySchema = createInsertSchema(quoteHistory).omit({
  id: true,
  createdAt: true,
});

// Scheduled Jobs table - Calendar-based job scheduling
export const scheduledJobs = pgTable("scheduled_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: "set null" }), // Optional link to existing project
  
  title: varchar("title").notNull(),
  description: text("description"),
  jobType: varchar("job_type").notNull(), // window_cleaning | dryer_vent_cleaning | building_wash | in_suite | parkade | ground_window | custom
  customJobType: varchar("custom_job_type"), // Used when jobType is "custom"
  
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  
  status: varchar("status").notNull().default('upcoming'), // upcoming | in_progress | completed | cancelled
  location: text("location"), // Job site address
  color: varchar("color").default('#3b82f6'), // Custom color for calendar display
  
  estimatedHours: integer("estimated_hours"),
  actualHours: integer("actual_hours"),
  
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: varchar("created_by").references(() => users.id),
});

export const insertScheduledJobSchema = createInsertSchema(scheduledJobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

// Job Employee Assignments - Many-to-many relationship
export const jobAssignments = pgTable("job_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull().references(() => scheduledJobs.id, { onDelete: "cascade" }),
  employeeId: varchar("employee_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  startDate: timestamp("start_date"), // Optional: when this employee starts on this job
  endDate: timestamp("end_date"), // Optional: when this employee ends on this job
  
  assignedAt: timestamp("assigned_at").defaultNow(),
  assignedBy: varchar("assigned_by").references(() => users.id),
});

export const insertJobAssignmentSchema = createInsertSchema(jobAssignments).omit({
  id: true,
  assignedAt: true,
}).extend({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

// Time off types for employee scheduling
export const TIME_OFF_TYPES = [
  { id: "day_off", label: "Day Off", color: "#6b7280", paid: false },
  { id: "paid_day_off", label: "Paid Day Off", color: "#3b82f6", paid: true },
  { id: "stat_holiday", label: "Stat Holiday", color: "#8b5cf6", paid: true },
  { id: "sick_day", label: "Sick Day", color: "#f59e0b", paid: false },
  { id: "sick_paid_day", label: "Paid Sick Day", color: "#10b981", paid: true },
  { id: "vacation", label: "Vacation", color: "#06b6d4", paid: true },
  { id: "personal_day", label: "Personal Day", color: "#ec4899", paid: false },
  { id: "bereavement", label: "Bereavement", color: "#374151", paid: true },
  { id: "jury_duty", label: "Jury Duty", color: "#64748b", paid: true },
  { id: "training", label: "Training", color: "#14b8a6", paid: true },
] as const;

export type TimeOffTypeId = typeof TIME_OFF_TYPES[number]["id"];

// Employee time off table for scheduling leave
export const employeeTimeOff = pgTable("employee_time_off", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  employeeId: varchar("employee_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  date: date("date").notNull(), // The date of the time off
  timeOffType: varchar("time_off_type").notNull(), // day_off | paid_day_off | stat_holiday | sick_day | sick_paid_day | vacation | personal_day | bereavement | jury_duty | training
  
  notes: text("notes"), // Optional notes
  
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: varchar("created_by").references(() => users.id),
});

export const insertEmployeeTimeOffSchema = createInsertSchema(employeeTimeOff).omit({
  id: true,
  createdAt: true,
});

export type EmployeeTimeOff = typeof employeeTimeOff.$inferSelect;
export type InsertEmployeeTimeOff = z.infer<typeof insertEmployeeTimeOffSchema>;

// Notifications table for in-app notifications
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  actorId: varchar("actor_id").references(() => users.id, { onDelete: "set null" }),
  type: varchar("type").notNull(),
  payload: jsonb("payload"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_notifications_company").on(table.companyId),
  index("IDX_notifications_read").on(table.isRead),
]);

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Public user type that excludes sensitive fields (never send these to client)
export type UserPublic = Omit<User, "passwordHash" | "licenseKey">;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type WorkNotice = typeof workNotices.$inferSelect;
export type InsertWorkNotice = z.infer<typeof insertWorkNoticeSchema>;

export type CustomJobType = typeof customJobTypes.$inferSelect;
export type InsertCustomJobType = z.infer<typeof insertCustomJobTypeSchema>;

export type CustomNoticeTemplate = typeof customNoticeTemplates.$inferSelect;
export type InsertCustomNoticeTemplate = z.infer<typeof insertCustomNoticeTemplateSchema>;

export type DropLog = typeof dropLogs.$inferSelect;
export type InsertDropLog = z.infer<typeof insertDropLogSchema>;

export type WorkSession = typeof workSessions.$inferSelect;
export type InsertWorkSession = z.infer<typeof insertWorkSessionSchema>;

export type NonBillableWorkSession = typeof nonBillableWorkSessions.$inferSelect;
export type InsertNonBillableWorkSession = z.infer<typeof insertNonBillableWorkSessionSchema>;

export type GearItem = typeof gearItems.$inferSelect;
export type InsertGearItem = z.infer<typeof insertGearItemSchema>;

export type EquipmentCatalog = typeof equipmentCatalog.$inferSelect;
export type InsertEquipmentCatalog = z.infer<typeof insertEquipmentCatalogSchema>;

export type GearAssignment = typeof gearAssignments.$inferSelect;
export type InsertGearAssignment = z.infer<typeof insertGearAssignmentSchema>;

export type GearSerialNumber = typeof gearSerialNumbers.$inferSelect;
export type InsertGearSerialNumber = z.infer<typeof insertGearSerialNumberSchema>;

export type EquipmentDamageReport = typeof equipmentDamageReports.$inferSelect;
export type InsertEquipmentDamageReport = z.infer<typeof insertEquipmentDamageReportSchema>;

export type Complaint = typeof complaints.$inferSelect;
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;

export type ComplaintNote = typeof complaintNotes.$inferSelect;
export type InsertComplaintNote = z.infer<typeof insertComplaintNoteSchema>;

export type ProjectPhoto = typeof projectPhotos.$inferSelect;
export type InsertProjectPhoto = z.infer<typeof insertProjectPhotoSchema>;

export type JobComment = typeof jobComments.$inferSelect;
export type InsertJobComment = z.infer<typeof insertJobCommentSchema>;

export type HarnessInspection = typeof harnessInspections.$inferSelect;
export type InsertHarnessInspection = z.infer<typeof insertHarnessInspectionSchema>;

export type ToolboxMeeting = typeof toolboxMeetings.$inferSelect;
export type InsertToolboxMeeting = z.infer<typeof insertToolboxMeetingSchema>;

export type FlhaForm = typeof flhaForms.$inferSelect;
export type InsertFlhaForm = z.infer<typeof insertFlhaFormSchema>;

export type IncidentReport = typeof incidentReports.$inferSelect;
export type InsertIncidentReport = z.infer<typeof insertIncidentReportSchema>;

export type MethodStatement = typeof methodStatements.$inferSelect;
export type InsertMethodStatement = z.infer<typeof insertMethodStatementSchema>;

export type PayPeriodConfig = typeof payPeriodConfig.$inferSelect;
export type InsertPayPeriodConfig = z.infer<typeof insertPayPeriodConfigSchema>;

export type PayPeriod = typeof payPeriods.$inferSelect;
export type InsertPayPeriod = z.infer<typeof insertPayPeriodSchema>;

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;

export type QuoteService = typeof quoteServices.$inferSelect;
export type InsertQuoteService = z.infer<typeof insertQuoteServiceSchema>;

export type QuoteHistory = typeof quoteHistory.$inferSelect;
export type InsertQuoteHistory = z.infer<typeof insertQuoteHistorySchema>;

export type ScheduledJob = typeof scheduledJobs.$inferSelect;
export type InsertScheduledJob = z.infer<typeof insertScheduledJobSchema>;

export type JobAssignment = typeof jobAssignments.$inferSelect;
export type InsertJobAssignment = z.infer<typeof insertJobAssignmentSchema>;

// IRATA Task Logs - tracks rope access tasks performed during work sessions for logbook
export const irataTaskLogs = pgTable("irata_task_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workSessionId: varchar("work_session_id").notNull().references(() => workSessions.id, { onDelete: "cascade" }),
  employeeId: varchar("employee_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Building/Project info captured at log time
  projectId: varchar("project_id").references(() => projects.id, { onDelete: "set null" }),
  buildingName: varchar("building_name"),
  buildingAddress: text("building_address"),
  buildingHeight: varchar("building_height"), // e.g., "25 floors", "100m", etc.
  
  // Tasks performed (stored as array of task type strings)
  tasksPerformed: text("tasks_performed").array().default(sql`ARRAY[]::text[]`).notNull(),
  
  // Hours and date info
  workDate: date("work_date").notNull(),
  hoursWorked: numeric("hours_worked", { precision: 5, scale: 2 }).notNull(),
  
  // Optional notes
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  employeeIdx: index("IDX_irata_task_logs_employee").on(table.employeeId),
  companyIdx: index("IDX_irata_task_logs_company").on(table.companyId),
  workSessionIdx: index("IDX_irata_task_logs_work_session").on(table.workSessionId),
  uniqueWorkSession: sql`UNIQUE("work_session_id")`,
}));

export const insertIrataTaskLogSchema = createInsertSchema(irataTaskLogs).omit({
  id: true,
  createdAt: true,
});

export type IrataTaskLog = typeof irataTaskLogs.$inferSelect;
export type InsertIrataTaskLog = z.infer<typeof insertIrataTaskLogSchema>;

// IRATA task types for logbook
export const IRATA_TASK_TYPES = [
  { id: "rope_transfer", label: "Rope Transfer", description: "Transferring between rope systems" },
  { id: "re_anchor", label: "Re-Anchor", description: "Re-anchoring operations" },
  { id: "ascending", label: "Ascending", description: "Ascending on rope" },
  { id: "descending", label: "Descending", description: "Descending on rope" },
  { id: "rigging", label: "Rigging", description: "Setting up rigging systems" },
  { id: "deviation", label: "Deviation", description: "Using deviation anchors" },
  { id: "aid_climbing", label: "Aid Climbing", description: "Aid climbing techniques" },
  { id: "edge_transition", label: "Edge Transition", description: "Transitioning over edges" },
  { id: "knot_passing", label: "Knot Passing", description: "Passing knots while on rope" },
  { id: "rope_to_rope_transfer", label: "Rope to Rope Transfer", description: "Transferring between different rope systems" },
  { id: "mid_rope_changeover", label: "Mid-Rope Changeover", description: "Changing over mid-rope" },
  { id: "rescue_technique", label: "Rescue Technique", description: "Performing rescue operations" },
  { id: "hauling", label: "Hauling", description: "Hauling equipment or personnel" },
  { id: "lowering", label: "Lowering", description: "Lowering equipment or personnel" },
  { id: "tensioned_rope", label: "Tensioned Rope Work", description: "Working on tensioned rope systems" },
  { id: "horizontal_traverse", label: "Horizontal Traverse", description: "Moving horizontally on rope" },
  { id: "window_cleaning", label: "Window Cleaning", description: "Performing window cleaning tasks" },
  { id: "building_inspection", label: "Building Inspection", description: "Conducting building inspections" },
  { id: "maintenance_work", label: "Maintenance Work", description: "Performing maintenance tasks" },
  { id: "other", label: "Other", description: "Other rope access tasks" },
] as const;

export type IrataTaskType = typeof IRATA_TASK_TYPES[number]['id'];

// Historical/Previous Hours - for technicians to log work from before joining platform
// countsTowardTotal: false = Previous hours (reference only, NOT counted)
// countsTowardTotal: true = Manual hours (when employer doesn't use OnRopePro, counted in total)
export const historicalHours = pgTable("historical_hours", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Date range of work
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  
  // Hours worked (total for the date range)
  hoursWorked: numeric("hours_worked", { precision: 6, scale: 2 }).notNull(),
  
  // Building/Location info
  buildingName: varchar("building_name"),
  buildingAddress: text("building_address"),
  buildingHeight: varchar("building_height"), // e.g., "25 floors", "100m", etc.
  
  // Tasks performed (stored as array of task type strings - same as IRATA_TASK_TYPES)
  tasksPerformed: text("tasks_performed").array().default(sql`ARRAY[]::text[]`).notNull(),
  
  // Optional notes
  notes: text("notes"),
  
  // Company name at time of work (for reference, not linked)
  previousEmployer: varchar("previous_employer"),
  
  // Whether these hours count toward total (true = manual hours, false = previous/reference only)
  countsTowardTotal: boolean("counts_toward_total").default(false).notNull(),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  employeeIdx: index("IDX_historical_hours_employee").on(table.employeeId),
}));

export const insertHistoricalHoursSchema = createInsertSchema(historicalHours).omit({
  id: true,
  createdAt: true,
});

export type HistoricalHours = typeof historicalHours.$inferSelect;
export type InsertHistoricalHours = z.infer<typeof insertHistoricalHoursSchema>;

// Document Review Signatures table - tracks employee acknowledgment of company documents
export const documentReviewSignatures = pgTable("document_review_signatures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  employeeId: varchar("employee_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Project reference - for project-specific documents like rope access plans
  projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }),
  
  // Document identification
  documentType: varchar("document_type").notNull(), // health_safety_manual | company_policy | method_statement | rope_access_plan
  documentId: varchar("document_id"), // For method statements, the ID of the specific method statement
  documentName: varchar("document_name").notNull(), // Human-readable name for display
  
  // Document reference - for accessing the actual file
  fileUrl: text("file_url"), // URL to the document file for viewing
  
  // Review tracking
  viewedAt: timestamp("viewed_at"), // When the employee first opened the document
  signedAt: timestamp("signed_at"), // When the employee signed the document
  signatureDataUrl: text("signature_data_url"), // Digital signature image data URL
  
  // Versioning - to track if document has been updated since last review
  documentVersion: varchar("document_version"), // Optional version identifier
  
  // Role targeting - which roles this document review applies to (inherited from companyDocuments)
  targetRoles: text("target_roles").array().default(sql`ARRAY['rope_access_tech', 'ground_crew']::text[]`),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_doc_review_company").on(table.companyId),
  index("IDX_doc_review_employee").on(table.employeeId),
  index("IDX_doc_review_document").on(table.documentType, table.documentId),
  index("IDX_doc_review_project").on(table.projectId),
]);

export const insertDocumentReviewSignatureSchema = createInsertSchema(documentReviewSignatures).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type DocumentReviewSignature = typeof documentReviewSignatures.$inferSelect;
export type InsertDocumentReviewSignature = z.infer<typeof insertDocumentReviewSignatureSchema>;

// User preferences table
export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  dashboardCardOrder: text("dashboard_card_order").array(), // Array of card IDs for dashboard
  hoursAnalyticsCardOrder: text("hours_analytics_card_order").array(), // Array of card IDs for hours analytics page
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;

// Feature Requests - allows company owners to submit feature requests
export const featureRequests = pgTable("feature_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Request details
  title: varchar("title").notNull(), // Short title for the request
  category: varchar("category").notNull(), // feature | job_type | improvement | bug | other
  description: text("description").notNull(), // Detailed description
  priority: varchar("priority").default('normal'), // low | normal | high | urgent
  
  // Status tracking
  status: varchar("status").default('pending').notNull(), // pending | reviewing | in_progress | completed | declined
  
  // Screenshot attachment (optional)
  screenshotUrl: varchar("screenshot_url"), // URL to uploaded screenshot in object storage
  
  // Contact info (auto-filled from company)
  contactName: varchar("contact_name").notNull(),
  contactEmail: varchar("contact_email").notNull(),
  companyName: varchar("company_name").notNull(),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
}, (table) => [
  index("IDX_feature_request_company").on(table.companyId),
  index("IDX_feature_request_status").on(table.status),
]);

export const insertFeatureRequestSchema = createInsertSchema(featureRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  resolvedAt: true,
});

export type FeatureRequest = typeof featureRequests.$inferSelect;
export type InsertFeatureRequest = z.infer<typeof insertFeatureRequestSchema>;

// Feature Request Messages - back-and-forth messaging between company and developer
export const featureRequestMessages = pgTable("feature_request_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: varchar("request_id").notNull().references(() => featureRequests.id, { onDelete: "cascade" }),
  
  // Sender info
  senderId: varchar("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  senderRole: varchar("sender_role").notNull(), // company | superuser
  senderName: varchar("sender_name").notNull(),
  
  // Message content
  message: text("message").notNull(),
  
  // Read status
  isRead: boolean("is_read").default(false),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("IDX_feature_msg_request").on(table.requestId),
  index("IDX_feature_msg_sender").on(table.senderId),
]);

export const insertFeatureRequestMessageSchema = createInsertSchema(featureRequestMessages).omit({
  id: true,
  createdAt: true,
});

export type FeatureRequestMessage = typeof featureRequestMessages.$inferSelect;
export type InsertFeatureRequestMessage = z.infer<typeof insertFeatureRequestMessageSchema>;

// Extended type for feature request with messages
export type FeatureRequestWithMessages = FeatureRequest & {
  messages: FeatureRequestMessage[];
  unreadCount?: number;
};

// ==========================================
// SUPERUSER METRICS DASHBOARD TABLES
// ==========================================

// MRR Snapshots - daily snapshots of revenue metrics for historical tracking
export const mrrSnapshots = pgTable("mrr_snapshots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  snapshotDate: date("snapshot_date").notNull(),
  
  // Total MRR
  totalMrr: numeric("total_mrr", { precision: 12, scale: 2 }).notNull(),
  
  // MRR by subscription tier
  basicMrr: numeric("basic_mrr", { precision: 12, scale: 2 }).default("0"),
  starterMrr: numeric("starter_mrr", { precision: 12, scale: 2 }).default("0"),
  premiumMrr: numeric("premium_mrr", { precision: 12, scale: 2 }).default("0"),
  enterpriseMrr: numeric("enterprise_mrr", { precision: 12, scale: 2 }).default("0"),
  
  // MRR by add-on type
  extraSeatsMrr: numeric("extra_seats_mrr", { precision: 12, scale: 2 }).default("0"),
  extraProjectsMrr: numeric("extra_projects_mrr", { precision: 12, scale: 2 }).default("0"),
  whiteLabelMrr: numeric("white_label_mrr", { precision: 12, scale: 2 }).default("0"),
  
  // MRR movement (from previous snapshot)
  newMrr: numeric("new_mrr", { precision: 12, scale: 2 }).default("0"),         // From new customers
  expansionMrr: numeric("expansion_mrr", { precision: 12, scale: 2 }).default("0"),   // Upgrades + add-ons
  contractionMrr: numeric("contraction_mrr", { precision: 12, scale: 2 }).default("0"), // Downgrades (negative)
  churnedMrr: numeric("churned_mrr", { precision: 12, scale: 2 }).default("0"),     // Cancellations (negative)
  
  // Customer counts
  totalCustomers: integer("total_customers").default(0),
  basicCustomers: integer("basic_customers").default(0),
  starterCustomers: integer("starter_customers").default(0),
  premiumCustomers: integer("premium_customers").default(0),
  enterpriseCustomers: integer("enterprise_customers").default(0),
  
  // New signups this period
  newCustomers: integer("new_customers").default(0),
  churnedCustomers: integer("churned_customers").default(0),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("IDX_mrr_snapshot_date").on(table.snapshotDate),
]);

export const insertMrrSnapshotSchema = createInsertSchema(mrrSnapshots).omit({
  id: true,
  createdAt: true,
});

export type MrrSnapshot = typeof mrrSnapshots.$inferSelect;
export type InsertMrrSnapshot = z.infer<typeof insertMrrSnapshotSchema>;

// Customer Health Scores - calculated scores for churn risk assessment
export const customerHealthScores = pgTable("customer_health_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  calculatedAt: timestamp("calculated_at").defaultNow().notNull(),
  
  // Overall score (0-100)
  overallScore: integer("overall_score").notNull(),
  
  // Component scores (0-100 each)
  loginScore: integer("login_score").default(0),        // Based on last login date
  usageScore: integer("usage_score").default(0),        // Based on features used
  paymentScore: integer("payment_score").default(0),    // Based on payment status
  engagementScore: integer("engagement_score").default(0), // Based on activity
  
  // Health status
  status: varchar("status").notNull(), // healthy | at_risk | critical
  
  // Last login date for reference
  lastLoginDate: timestamp("last_login_date"),
  
  // Usage metrics for reference
  projectsCount: integer("projects_count").default(0),
  employeesCount: integer("employees_count").default(0),
  workSessionsCount: integer("work_sessions_count").default(0),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("IDX_health_company").on(table.companyId),
  index("IDX_health_calculated").on(table.calculatedAt),
  index("IDX_health_status").on(table.status),
]);

export const insertCustomerHealthScoreSchema = createInsertSchema(customerHealthScores).omit({
  id: true,
  createdAt: true,
});

export type CustomerHealthScore = typeof customerHealthScores.$inferSelect;
export type InsertCustomerHealthScore = z.infer<typeof insertCustomerHealthScoreSchema>;

// Churn Events - records when and why customers churned
export const churnEvents = pgTable("churn_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  churnDate: date("churn_date").notNull(),
  
  // Financial impact
  finalMrr: numeric("final_mrr", { precision: 12, scale: 2 }),
  tier: varchar("tier"), // basic | starter | premium | enterprise
  
  // Churn reason
  reason: varchar("reason"), // business_closed | too_expensive | missing_features | competitor | no_engagement | payment_failure | unknown
  notes: text("notes"),
  
  // Win-back tracking
  winBackDate: date("win_back_date"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("IDX_churn_company").on(table.companyId),
  index("IDX_churn_date").on(table.churnDate),
]);

export const insertChurnEventSchema = createInsertSchema(churnEvents).omit({
  id: true,
  createdAt: true,
});

export type ChurnEvent = typeof churnEvents.$inferSelect;
export type InsertChurnEvent = z.infer<typeof insertChurnEventSchema>;

// SuperUser Task Management - Internal project management system for launch coordination
export const superuserTasks = pgTable("superuser_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  section: varchar("section").notNull(), // Module/category grouping (e.g., "User Access", "Safety Forms", "Documentation")
  status: varchar("status").notNull().default("todo"), // todo | in_progress | completed
  assignee: varchar("assignee").notNull(), // Tommy | Glenn | Kara
  dueDate: date("due_date"),
  priority: varchar("priority").default("medium"), // low | medium | high
  createdBy: varchar("created_by").notNull(), // SuperUser who created the task
  completedAt: timestamp("completed_at"),
  completedBy: varchar("completed_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("IDX_superuser_tasks_section").on(table.section),
  index("IDX_superuser_tasks_status").on(table.status),
  index("IDX_superuser_tasks_assignee").on(table.assignee),
]);

export const insertSuperuserTaskSchema = createInsertSchema(superuserTasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
  completedBy: true,
});

export type SuperuserTask = typeof superuserTasks.$inferSelect;
export type InsertSuperuserTask = z.infer<typeof insertSuperuserTaskSchema>;

// SuperUser Task Comments - Slack-style threaded comments on tasks
export const superuserTaskComments = pgTable("superuser_task_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskId: varchar("task_id").notNull().references(() => superuserTasks.id, { onDelete: "cascade" }),
  authorName: varchar("author_name").notNull(), // Tommy | Glenn | Kara
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("IDX_superuser_task_comments_task").on(table.taskId),
]);

export const insertSuperuserTaskCommentSchema = createInsertSchema(superuserTaskComments).omit({
  id: true,
  createdAt: true,
});

export type SuperuserTaskComment = typeof superuserTaskComments.$inferSelect;
export type InsertSuperuserTaskComment = z.infer<typeof insertSuperuserTaskCommentSchema>;

// SuperUser Task Attachments - File attachments for tasks
export const superuserTaskAttachments = pgTable("superuser_task_attachments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskId: varchar("task_id").notNull().references(() => superuserTasks.id, { onDelete: "cascade" }),
  fileName: varchar("file_name").notNull(), // Stored filename in object storage
  originalName: varchar("original_name").notNull(), // Original filename uploaded by user
  fileSize: integer("file_size").notNull(), // Size in bytes
  contentType: varchar("content_type").notNull(), // MIME type
  storagePath: varchar("storage_path").notNull(), // Full path in object storage
  uploadedBy: varchar("uploaded_by").notNull(), // Tommy | Glenn | Kara
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("IDX_superuser_task_attachments_task").on(table.taskId),
]);

export const insertSuperuserTaskAttachmentSchema = createInsertSchema(superuserTaskAttachments).omit({
  id: true,
  createdAt: true,
});

export type SuperuserTaskAttachment = typeof superuserTaskAttachments.$inferSelect;
export type InsertSuperuserTaskAttachment = z.infer<typeof insertSuperuserTaskAttachmentSchema>;

// Extended types for frontend use with relations
export type QuoteWithServices = Quote & {
  services: QuoteService[];
};

export type ProjectWithProgress = Project & {
  completedDrops: number;
  progressPercentage: number;
};

export type ComplaintWithNotes = Complaint & {
  notes: (ComplaintNote & { user: User })[];
};

export type EmployeeHoursSummary = {
  employeeId: string;
  employeeName: string;
  hourlyRate: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  doubleTimeHours: number;
  totalPay: number;
  sessions: (WorkSession & { projectName: string; isPeaceWork?: boolean })[];
};

export type EmployeeAssignment = {
  assignmentId: string;
  employee: User;
  startDate?: Date | null;
  endDate?: Date | null;
};

export type ScheduledJobWithAssignments = ScheduledJob & {
  assignedEmployees: User[]; // Kept for backward compatibility
  employeeAssignments?: EmployeeAssignment[]; // New: includes date ranges
  project?: Project | null;
};

// Team Invitations - Pending invitations for technicians to join companies
export const teamInvitations = pgTable("team_invitations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  technicianId: varchar("technician_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  invitedBy: varchar("invited_by").notNull().references(() => users.id, { onDelete: "cascade" }), // The user who sent the invitation
  status: varchar("status").notNull().default("pending"), // pending | accepted | declined | expired
  message: text("message"), // Optional message from the company
  createdAt: timestamp("created_at").defaultNow().notNull(),
  respondedAt: timestamp("responded_at"), // When the technician responded
  expiresAt: timestamp("expires_at"), // Optional expiration date
  ownerAcknowledgedAt: timestamp("owner_acknowledged_at"), // When the owner clicked "Next" on the acceptance notification
}, (table) => [
  index("IDX_team_invitations_technician").on(table.technicianId),
  index("IDX_team_invitations_company").on(table.companyId),
  index("IDX_team_invitations_status").on(table.status),
]);

export const insertTeamInvitationSchema = createInsertSchema(teamInvitations).omit({
  id: true,
  createdAt: true,
});

export type TeamInvitation = typeof teamInvitations.$inferSelect;
export type InsertTeamInvitation = z.infer<typeof insertTeamInvitationSchema>;

// Technician Employer Connections - For PLUS members to connect with multiple employers
export const technicianEmployerConnections = pgTable("technician_employer_connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  technicianId: varchar("technician_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  isPrimary: boolean("is_primary").default(false).notNull(), // Is this the primary/default employer
  status: varchar("status").notNull().default("active"), // active | terminated
  connectedAt: timestamp("connected_at").defaultNow().notNull(),
  terminatedAt: timestamp("terminated_at"),
  invitationId: varchar("invitation_id").references(() => teamInvitations.id, { onDelete: "set null" }), // Link to original invitation
}, (table) => [
  index("IDX_tech_employer_conn_technician").on(table.technicianId),
  index("IDX_tech_employer_conn_company").on(table.companyId),
  index("IDX_tech_employer_conn_status").on(table.status),
]);

export const insertTechnicianEmployerConnectionSchema = createInsertSchema(technicianEmployerConnections).omit({
  id: true,
  connectedAt: true,
});

export type TechnicianEmployerConnection = typeof technicianEmployerConnections.$inferSelect;
export type InsertTechnicianEmployerConnection = z.infer<typeof insertTechnicianEmployerConnectionSchema>;

// Job Postings - Employment opportunities posted by companies and SuperUsers
export const jobPostings = pgTable("job_postings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Poster information
  companyId: varchar("company_id").references(() => users.id, { onDelete: "cascade" }), // null for platform-wide posts
  isPlatformPost: boolean("is_platform_post").default(false).notNull(), // true if posted by SuperUser
  
  // Job details
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"), // Job requirements/qualifications
  
  // Location
  location: varchar("location"), // City, Province/State (legacy field)
  jobCity: varchar("job_city"), // City for filtering
  jobProvinceState: varchar("job_province_state"), // Province/State for filtering
  jobCountry: varchar("job_country"), // Country for filtering
  isRemote: boolean("is_remote").default(false),
  
  // Job type
  jobType: varchar("job_type").notNull(), // full_time | part_time | contract | temporary | seasonal
  employmentType: varchar("employment_type"), // permanent | fixed_term | casual
  
  // Compensation (optional)
  salaryMin: numeric("salary_min", { precision: 12, scale: 2 }),
  salaryMax: numeric("salary_max", { precision: 12, scale: 2 }),
  salaryPeriod: varchar("salary_period"), // hourly | daily | weekly | monthly | annually
  
  // Required certifications
  requiredIrataLevel: varchar("required_irata_level"), // Level 1 | Level 2 | Level 3
  requiredSpratLevel: varchar("required_sprat_level"), // Level 1 | Level 2 | Level 3
  
  // Additional job details
  startDate: timestamp("start_date"), // Expected job start date
  benefits: text("benefits"), // Benefits offered (health insurance, vacation, etc.)
  workDays: varchar("work_days"), // e.g., "Monday to Friday", "Rotating shifts"
  experienceRequired: varchar("experience_required"), // e.g., "1-2 years", "3-5 years", "5+ years"
  
  // Position type - which staff this job is for
  positionType: varchar("position_type").notNull().default("rope_access"), // rope_access | ground_crew
  
  // Status and visibility
  status: varchar("status").notNull().default("active"), // draft | active | paused | closed | expired
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"), // Optional expiration date
}, (table) => [
  index("IDX_job_postings_company").on(table.companyId),
  index("IDX_job_postings_status").on(table.status),
  index("IDX_job_postings_job_type").on(table.jobType),
  index("IDX_job_postings_platform").on(table.isPlatformPost),
]);

export const insertJobPostingSchema = createInsertSchema(jobPostings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type JobPosting = typeof jobPostings.$inferSelect;
export type InsertJobPosting = z.infer<typeof insertJobPostingSchema>;

// Job Applications - Technicians applying to job postings
export const jobApplications = pgTable("job_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // References
  jobPostingId: varchar("job_posting_id").notNull().references(() => jobPostings.id, { onDelete: "cascade" }),
  technicianId: varchar("technician_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Application details
  coverMessage: text("cover_message"), // Optional message from technician
  
  // Status tracking
  status: varchar("status").notNull().default("applied"), // applied | reviewing | interviewed | offered | hired | rejected | withdrawn | refused
  
  // Employer notes (only visible to employer)
  employerNotes: text("employer_notes"),
  
  // Timestamps
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
  statusUpdatedAt: timestamp("status_updated_at"),
  viewedByEmployerAt: timestamp("viewed_by_employer_at"), // When employer first saw this application in the dashboard
}, (table) => [
  index("IDX_job_applications_job").on(table.jobPostingId),
  index("IDX_job_applications_technician").on(table.technicianId),
  index("IDX_job_applications_status").on(table.status),
]);

export const insertJobApplicationSchema = createInsertSchema(jobApplications).omit({
  id: true,
  appliedAt: true,
  reviewedAt: true,
  statusUpdatedAt: true,
  viewedByEmployerAt: true,
});

export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;

// Future Ideas - Internal ideas tracker for platform development
export const futureIdeas = pgTable("future_ideas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  category: varchar("category"), // e.g., "feature", "improvement", "integration", "design"
  priority: varchar("priority").default("medium"), // low, medium, high
  status: varchar("status").default("idea"), // idea, planned, in_progress, completed, archived
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFutureIdeaSchema = createInsertSchema(futureIdeas).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertFutureIdea = z.infer<typeof insertFutureIdeaSchema>;
export type FutureIdea = typeof futureIdeas.$inferSelect;

// Document Quizzes - AI-generated or pre-built quizzes for employee training
export const documentQuizzes = pgTable("document_quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  documentId: varchar("document_id"), // Reference to companyDocuments.id for AI-generated quizzes, null for pre-built
  documentType: varchar("document_type").notNull(), // health_safety_manual | company_policy | irata_level_1 | irata_level_2 | irata_level_3 | sprat_level_1 | sprat_level_2 | sprat_level_3
  questions: jsonb("questions").$type<Array<{
    questionNumber: number;
    question: string;
    options: { A: string; B: string; C: string; D: string };
    correctAnswer: "A" | "B" | "C" | "D";
  }>>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("IDX_document_quizzes_company").on(table.companyId),
  index("IDX_document_quizzes_document").on(table.documentId),
  index("IDX_document_quizzes_type").on(table.documentType),
]);

export const insertDocumentQuizSchema = createInsertSchema(documentQuizzes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type DocumentQuiz = typeof documentQuizzes.$inferSelect;
export type InsertDocumentQuiz = z.infer<typeof insertDocumentQuizSchema>;

// Quiz Attempts - Tracks employee attempts at completing quizzes
// Note: quizId can be either a documentQuizzes.id, a certification quiz ID (cert_*), or a safety quiz ID (safety_*)
// Note: companyId can be null for unaffiliated technicians (self-resigned or not yet linked to any company)
export const quizAttempts = pgTable("quiz_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quizId: varchar("quiz_id").notNull(), // Removed FK constraint to allow cert/safety quiz IDs
  employeeId: varchar("employee_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  companyId: varchar("company_id").references(() => users.id, { onDelete: "cascade" }), // Nullable for unaffiliated technicians
  score: real("score").notNull(), // Percentage score (0-100)
  passed: boolean("passed").notNull(), // 80% or higher
  answers: jsonb("answers").$type<Array<{
    questionNumber: number;
    selectedAnswer: "A" | "B" | "C" | "D";
    isCorrect: boolean;
  }>>().notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
}, (table) => [
  index("IDX_quiz_attempts_quiz").on(table.quizId),
  index("IDX_quiz_attempts_employee").on(table.employeeId),
  index("IDX_quiz_attempts_company").on(table.companyId),
])

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({
  id: true,
  completedAt: true,
});

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;

// Technician Document Requests - Employers request documents from technicians
export const technicianDocumentRequests = pgTable("technician_document_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  technicianId: varchar("technician_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  connectionId: varchar("connection_id").notNull().references(() => technicianEmployerConnections.id, { onDelete: "cascade" }),
  requestedById: varchar("requested_by_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  details: text("details"),
  status: varchar("status").notNull().default("pending"), // pending | fulfilled | cancelled
  responseNote: text("response_note"),
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  respondedAt: timestamp("responded_at"),
}, (table) => [
  index("IDX_tech_doc_requests_company_tech_status").on(table.companyId, table.technicianId, table.status),
  index("IDX_tech_doc_requests_technician").on(table.technicianId),
  index("IDX_tech_doc_requests_company").on(table.companyId),
  index("IDX_tech_doc_requests_connection").on(table.connectionId),
]);

export const insertTechnicianDocumentRequestSchema = createInsertSchema(technicianDocumentRequests).omit({
  id: true,
  requestedAt: true,
  respondedAt: true,
});

export type TechnicianDocumentRequest = typeof technicianDocumentRequests.$inferSelect;
export type InsertTechnicianDocumentRequest = z.infer<typeof insertTechnicianDocumentRequestSchema>;

// Technician Document Request Files - Files uploaded in response to document requests
export const technicianDocumentRequestFiles = pgTable("technician_document_request_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: varchar("request_id").notNull().references(() => technicianDocumentRequests.id, { onDelete: "cascade" }),
  storageKey: varchar("storage_key").notNull(),
  fileName: varchar("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  fileType: varchar("file_type").notNull(),
  uploadedById: varchar("uploaded_by_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
}, (table) => [
  index("IDX_tech_doc_request_files_request").on(table.requestId),
]);

export const insertTechnicianDocumentRequestFileSchema = createInsertSchema(technicianDocumentRequestFiles).omit({
  id: true,
  uploadedAt: true,
});

export type TechnicianDocumentRequestFile = typeof technicianDocumentRequestFiles.$inferSelect;
export type InsertTechnicianDocumentRequestFile = z.infer<typeof insertTechnicianDocumentRequestFileSchema>;

// ============================================
// HELP CENTER / KNOWLEDGE BASE TABLES
// ============================================

// Help Articles - Indexed content from Guide pages
export const helpArticles = pgTable("help_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug").notNull().unique(), // URL-friendly identifier (e.g., "project-management")
  title: varchar("title").notNull(), // Article title
  description: text("description"), // Brief description for search results
  category: varchar("category").notNull(), // Module category (e.g., "operations", "safety", "hr")
  sourceFile: varchar("source_file").notNull(), // Original Guide TSX file path
  content: text("content").notNull(), // Plain text content extracted from Guide
  stakeholders: text("stakeholders").array().default(sql`ARRAY[]::text[]`), // Array of stakeholder types this applies to
  isPublished: boolean("is_published").default(true).notNull(),
  indexedAt: timestamp("indexed_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("IDX_help_articles_slug").on(table.slug),
  index("IDX_help_articles_category").on(table.category),
]);

export const insertHelpArticleSchema = createInsertSchema(helpArticles).omit({
  id: true,
  indexedAt: true,
  updatedAt: true,
});

export type HelpArticle = typeof helpArticles.$inferSelect;
export type InsertHelpArticle = z.infer<typeof insertHelpArticleSchema>;

// Help Embeddings - Vector embeddings for semantic search (using pgvector)
// Note: Storing embeddings as JSONB array since pgvector requires extension setup
export const helpEmbeddings = pgTable("help_embeddings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  articleId: varchar("article_id").notNull().references(() => helpArticles.id, { onDelete: "cascade" }),
  chunkIndex: integer("chunk_index").notNull(), // Position of this chunk in the article
  chunkText: text("chunk_text").notNull(), // The actual text chunk
  embedding: jsonb("embedding").$type<number[]>().notNull(), // Vector embedding as JSON array
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("IDX_help_embeddings_article").on(table.articleId),
]);

export const insertHelpEmbeddingSchema = createInsertSchema(helpEmbeddings).omit({
  id: true,
  createdAt: true,
});

export type HelpEmbedding = typeof helpEmbeddings.$inferSelect;
export type InsertHelpEmbedding = z.infer<typeof insertHelpEmbeddingSchema>;

// Help Conversations - Chat sessions with the AI assistant
export const helpConversations = pgTable("help_conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id"), // Browser session identifier (anonymous)
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }), // Optional logged-in user
  userType: varchar("user_type").default("visitor"), // visitor | owner | technician | building-manager | property-manager
  startedAt: timestamp("started_at").defaultNow().notNull(),
  lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
}, (table) => [
  index("IDX_help_conversations_user").on(table.userId),
  index("IDX_help_conversations_session").on(table.sessionId),
]);

export const insertHelpConversationSchema = createInsertSchema(helpConversations).omit({
  id: true,
  startedAt: true,
  lastMessageAt: true,
});

export type HelpConversation = typeof helpConversations.$inferSelect;
export type InsertHelpConversation = z.infer<typeof insertHelpConversationSchema>;

// Help Messages - Individual messages in a conversation
export const helpMessages = pgTable("help_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => helpConversations.id, { onDelete: "cascade" }),
  role: varchar("role").notNull(), // "user" | "assistant"
  content: text("content").notNull(),
  sources: jsonb("sources").$type<Array<{ title: string; slug: string }>>(), // Referenced articles
  feedback: varchar("feedback"), // "positive" | "negative" | null
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("IDX_help_messages_conversation").on(table.conversationId),
]);

export const insertHelpMessageSchema = createInsertSchema(helpMessages).omit({
  id: true,
  createdAt: true,
});

export type HelpMessage = typeof helpMessages.$inferSelect;
export type InsertHelpMessage = z.infer<typeof insertHelpMessageSchema>;

// Help Searches - Track search queries for analytics
export const helpSearches = pgTable("help_searches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  query: text("query").notNull(),
  resultsCount: integer("results_count").notNull(),
  clickedArticleId: varchar("clicked_article_id").references(() => helpArticles.id, { onDelete: "set null" }),
  userType: varchar("user_type").default("visitor"),
  sessionId: varchar("session_id"),
  searchedAt: timestamp("searched_at").defaultNow().notNull(),
}, (table) => [
  index("IDX_help_searches_query").on(table.query),
  index("IDX_help_searches_date").on(table.searchedAt),
]);

export const insertHelpSearchSchema = createInsertSchema(helpSearches).omit({
  id: true,
  searchedAt: true,
});

export type HelpSearch = typeof helpSearches.$inferSelect;
export type InsertHelpSearch = z.infer<typeof insertHelpSearchSchema>;

// ============================================
// RESIDENT PHOTO UPLOAD QUEUE
// ============================================

// Photo upload statuses
export const PHOTO_UPLOAD_STATUS = {
  pending: "pending",
  uploading: "uploading",
  uploaded: "uploaded",
  failed: "failed",
} as const;

export type PhotoUploadStatus = keyof typeof PHOTO_UPLOAD_STATUS;

// Resident Feedback Photo Queue - Stores photos for async upload with retry
export const residentFeedbackPhotoQueue = pgTable("resident_feedback_photo_queue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  complaintId: varchar("complaint_id").notNull().references(() => complaints.id, { onDelete: "cascade" }),
  status: varchar("status").notNull().default("pending"), // pending | uploading | uploaded | failed
  retryCount: integer("retry_count").notNull().default(0),
  maxRetries: integer("max_retries").notNull().default(5),
  nextRetryAt: timestamp("next_retry_at"), // When to attempt next retry
  lastAttemptAt: timestamp("last_attempt_at"), // When last upload was attempted
  lastError: text("last_error"), // Error message from last failed attempt
  objectKey: varchar("object_key").notNull(), // Target storage path (unique per photo)
  contentType: varchar("content_type").notNull(), // MIME type (image/jpeg, image/png, etc.)
  fileSize: integer("file_size").notNull(), // File size in bytes
  payload: text("payload").notNull(), // Base64 encoded image data (temporary storage)
  uploadedUrl: text("uploaded_url"), // Final URL after successful upload
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("IDX_photo_queue_status").on(table.status),
  index("IDX_photo_queue_complaint").on(table.complaintId),
  index("IDX_photo_queue_next_retry").on(table.nextRetryAt),
]);

export const insertResidentFeedbackPhotoQueueSchema = createInsertSchema(residentFeedbackPhotoQueue).omit({
  id: true,
  createdAt: true,
  uploadedUrl: true,
});

export type ResidentFeedbackPhotoQueue = typeof residentFeedbackPhotoQueue.$inferSelect;
export type InsertResidentFeedbackPhotoQueue = z.infer<typeof insertResidentFeedbackPhotoQueueSchema>;

// ============================================
// DASHBOARD PREFERENCES
// ============================================

// Dashboard Preferences - Stores user's customized dashboard card layout
export const dashboardPreferences = pgTable("dashboard_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  cardId: varchar("card_id", { length: 50 }).notNull(), // Card identifier (e.g., "proj-active", "safe-csr")
  position: integer("position").notNull(), // Order position (0-indexed)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("IDX_dashboard_prefs_user").on(table.userId),
]);

export const insertDashboardPreferencesSchema = createInsertSchema(dashboardPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type DashboardPreferences = typeof dashboardPreferences.$inferSelect;
export type InsertDashboardPreferences = z.infer<typeof insertDashboardPreferencesSchema>;

// ============================================
// SIDEBAR PREFERENCES
// ============================================

// Sidebar Preferences - Stores user's customized sidebar menu item ordering
export const sidebarPreferences = pgTable("sidebar_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  dashboardVariant: varchar("dashboard_variant", { length: 30 }).notNull(), // employer, technician, etc.
  groupId: varchar("group_id", { length: 50 }).notNull(), // Group identifier (e.g., "operations", "team")
  itemId: varchar("item_id", { length: 50 }).notNull(), // Item identifier (e.g., "projects", "schedule")
  position: integer("position").notNull(), // Order position within the group (0-indexed)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("IDX_sidebar_prefs_user").on(table.userId),
  index("IDX_sidebar_prefs_user_variant").on(table.userId, table.dashboardVariant),
]);

export const insertSidebarPreferencesSchema = createInsertSchema(sidebarPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type SidebarPreferences = typeof sidebarPreferences.$inferSelect;
export type InsertSidebarPreferences = z.infer<typeof insertSidebarPreferencesSchema>;

// ============================================
// STAFF ACCOUNTS (Internal App Management)
// ============================================

// Available permissions for staff accounts (maps to sidebar items)
export const STAFF_PERMISSIONS = [
  'view_dashboard',           // Dashboard
  'view_companies',           // View All Companies
  'view_technicians',         // Technician Database
  'view_buildings',           // Global Buildings
  'view_job_board',           // Job Board
  'view_tasks',               // Task List
  'view_feature_requests',    // Feature Requests
  'view_future_ideas',        // Future Ideas
  'view_metrics',             // Platform Metrics
  'view_goals',               // Goals & KPIs
  'view_changelog',           // Changelog
  'view_founder_resources',   // Founder Resources
  'manage_staff_accounts',    // Staff Accounts (create, edit, delete)
] as const;

export type StaffPermission = typeof STAFF_PERMISSIONS[number];

// Staff Accounts - Internal accounts for platform management (not visible anywhere on site)
export const staffAccounts = pgTable("staff_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { length: 100 }),
  permissions: text("permissions").array().notNull().default([]), // Array of StaffPermission values
  isActive: boolean("is_active").default(true).notNull(),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: varchar("created_by"), // Staff account who created this account
}, (table) => [
  index("IDX_staff_email").on(table.email),
]);

export const insertStaffAccountSchema = createInsertSchema(staffAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
});

export type StaffAccount = typeof staffAccounts.$inferSelect;
export type InsertStaffAccount = z.infer<typeof insertStaffAccountSchema>;

// ============================================
// FOUNDER RESOURCES (Private founder links)
// ============================================

export const founderResources = pgTable("founder_resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  url: varchar("url", { length: 1000 }).notNull(),
  description: varchar("description", { length: 500 }),
  icon: varchar("icon", { length: 50 }).default("Link"), // Lucide icon name
  category: varchar("category", { length: 50 }).default("tools"), // tools, notes, other
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: varchar("created_by"), // Staff/superuser who added it
});

export const insertFounderResourceSchema = createInsertSchema(founderResources).omit({
  id: true,
  createdAt: true,
});

export type FounderResource = typeof founderResources.$inferSelect;
export type InsertFounderResource = z.infer<typeof insertFounderResourceSchema>;

// Database Cost Tracking for SuperUser - tracks monthly database expenses
export const databaseCosts = pgTable("database_costs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(), // The date/period this cost applies to
  amount: real("amount").notNull(), // Cost in USD
  notes: varchar("notes", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: varchar("created_by"), // superuser who added it
});

export const insertDatabaseCostSchema = createInsertSchema(databaseCosts).omit({
  id: true,
  createdAt: true,
  createdBy: true,
});

// ============================================
// API RESPONSE TYPES
// Used for typing React Query hooks and API responses
// ============================================

// User API responses
export type UserResponse = {
  user: UserPublic;
};

export type UserWithMessageResponse = {
  user: UserPublic;
  message?: string;
};

// Company data (company is a User with role='company')
export type CompanyResponse = {
  company: UserPublic;
};

// Team invitations response (TeamInvitation already defined above)
export type InvitationsResponse = {
  invitations: TeamInvitation[];
};

// Project response (Project already defined above)
export type ProjectsResponse = {
  projects: Project[];
};

// Client response (Client already defined above)
export type ClientsResponse = {
  clients: Client[];
};
