import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
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
  
  // Shared fields
  name: varchar("name"), // for resident and employee roles
  
  // Property Manager-specific fields
  firstName: varchar("first_name"), // for property_manager role
  lastName: varchar("last_name"), // for property_manager role
  propertyManagementCompany: varchar("property_management_company"), // for property_manager role
  
  // Resident-specific fields
  strataPlanNumber: varchar("strata_plan_number"), // for resident role
  unitNumber: varchar("unit_number"), // for resident role
  phoneNumber: varchar("phone_number"), // for resident role
  parkingStallNumber: varchar("parking_stall_number"), // for resident role - optional parking stall
  linkedResidentCode: varchar("linked_resident_code", { length: 10 }), // for resident role - stores the code they used to link (for validation)
  
  // Employee-specific fields
  techLevel: varchar("tech_level"), // for rope_access_tech role (e.g., "Level 1", "Level 2", "Level 3")
  hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }), // Hourly rate for employees (e.g., 25.50)
  permissions: text("permissions").array().default(sql`ARRAY[]::text[]`), // Array of permission strings for employees
  isTempPassword: boolean("is_temp_password").default(false),
  
  // Additional employee details
  startDate: date("start_date"), // Employee start date
  birthday: date("birthday"), // Employee date of birth (optional)
  socialInsuranceNumber: varchar("social_insurance_number"), // Social Insurance Number (optional)
  driversLicenseNumber: varchar("drivers_license_number"), // Driver's license number (optional)
  driversLicenseProvince: varchar("drivers_license_province"), // Province where driver's license was issued (optional)
  driversLicenseDocuments: text("drivers_license_documents").array().default(sql`ARRAY[]::text[]`), // Array of document URLs (driver's license photos, abstracts, etc.)
  homeAddress: text("home_address"), // Home address (optional)
  employeePhoneNumber: varchar("employee_phone_number"), // Employee phone number (optional, separate from resident phoneNumber)
  emergencyContactName: varchar("emergency_contact_name"), // Emergency contact name (optional)
  emergencyContactPhone: varchar("emergency_contact_phone"), // Emergency contact phone (optional)
  specialMedicalConditions: text("special_medical_conditions"), // Special medical conditions (optional)
  
  // IRATA certification fields (optional)
  irataLevel: varchar("irata_level"), // IRATA level (e.g., "Level 1", "Level 2", "Level 3")
  irataLicenseNumber: varchar("irata_license_number"), // IRATA license number
  irataIssuedDate: date("irata_issued_date"), // IRATA certification issue date
  irataExpirationDate: date("irata_expiration_date"), // IRATA certification expiration date
  irataDocuments: text("irata_documents").array().default(sql`ARRAY[]::text[]`), // Array of IRATA certification document URLs
  irataBaselineHours: numeric("irata_baseline_hours", { precision: 10, scale: 2 }).default("0"), // Baseline logbook hours before using this system
  
  // Employee photo
  photoUrl: text("photo_url"), // Employee profile photo URL
  
  // Employment termination
  terminatedDate: date("terminated_date"), // Date employment was terminated (optional)
  terminationReason: text("termination_reason"), // Reason for termination (optional)
  terminationNotes: text("termination_notes"), // Additional notes about termination (optional)
  
  // Stripe subscription management (company role only)
  stripeCustomerId: varchar("stripe_customer_id"), // Stripe customer ID for billing
  subscriptionTier: varchar("subscription_tier").default('none'), // none | basic | starter | premium | enterprise
  subscriptionStatus: varchar("subscription_status").default('inactive'), // inactive | active | past_due | canceled | trialing
  subscriptionEndDate: date("subscription_end_date"), // Date subscription ends or ended
  stripeSubscriptionId: varchar("stripe_subscription_id"), // Current Stripe subscription ID
  licenseKey: varchar("license_key"), // Current license key (COMPANY-XXXXX-XXXXX-XXXXX-[1-4])
  
  // Add-ons tracking (company role only)
  additionalSeatsCount: integer("additional_seats_count").default(0), // Number of extra seats purchased
  additionalProjectsCount: integer("additional_projects_count").default(0), // Number of extra projects purchased
  whitelabelBrandingActive: boolean("whitelabel_branding_active").default(false), // Whether white-label branding is active
  
  // Resident linking code (company role only)
  residentCode: varchar("resident_code", { length: 10 }).unique(), // 10-character code for residents to link to company - UNIQUE (~50 bits entropy)
  
  // Property Manager linking code (company role only)
  propertyManagerCode: varchar("property_manager_code", { length: 10 }).unique(), // 10-character code for property managers to link to company - UNIQUE
  
  // White label branding (company role only)
  brandingLogoUrl: text("branding_logo_url"), // Custom logo URL for resident portal
  brandingColors: text("branding_colors").array().default(sql`ARRAY[]::text[]`), // Array of brand colors (hex codes)
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

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
  address: text("address"),
  phoneNumber: varchar("phone_number"),
  lmsNumbers: jsonb("lms_numbers").$type<Array<{ number: string; buildingName?: string; address: string; stories?: number; units?: number; parkingStalls?: number; dailyDropTarget?: number; totalDropsNorth?: number; totalDropsEast?: number; totalDropsSouth?: number; totalDropsWest?: number }>>().default(sql`'[]'::jsonb`), // Array of objects with strata number, building name, address, building details, daily drop target, and elevation drops
  billingAddress: text("billing_address"),
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
  jobType: varchar("job_type").notNull(), // window_cleaning | dryer_vent_cleaning | building_wash | in_suite_dryer_vent_cleaning | parkade_pressure_cleaning | ground_window_cleaning | other
  customJobType: varchar("custom_job_type"), // Custom job type when jobType is "other"
  
  // Elevation-specific drop totals
  totalDropsNorth: integer("total_drops_north").default(0),
  totalDropsEast: integer("total_drops_east").default(0),
  totalDropsSouth: integer("total_drops_south").default(0),
  totalDropsWest: integer("total_drops_west").default(0),
  
  dailyDropTarget: integer("daily_drop_target"),
  floorCount: integer("floor_count"),
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
  
  // Service-specific expectation fields
  suitesPerDay: integer("suites_per_day"), // For in_suite_dryer_vent_cleaning
  totalFloors: integer("total_floors"), // For in_suite_dryer_vent_cleaning - total floors to clean
  floorsPerDay: integer("floors_per_day"), // Alternative for in_suite_dryer_vent_cleaning
  totalStalls: integer("total_stalls"), // For parkade_pressure_cleaning - total parking stalls
  stallsPerDay: integer("stalls_per_day"), // For parkade_pressure_cleaning
  buildingFloors: integer("building_floors"), // For in_suite_dryer_vent_cleaning - total floors in building (separate from unit count)
  assignedEmployees: text("assigned_employees").array().default(sql`ARRAY[]::text[]`), // Array of employee IDs assigned to this project
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Custom job types table - tracks company-specific custom job types for reuse
export const customJobTypes = pgTable("custom_job_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }), // Foreign key to company
  jobTypeName: varchar("job_type_name").notNull(), // Custom job type name
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_custom_job_types_company").on(table.companyId),
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
  
  // Manual completion percentage for hours-based job types (General Pressure Washing, Ground Window)
  manualCompletionPercentage: integer("manual_completion_percentage"), // 0-100, null if not applicable
  
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
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_gear_items_employee").on(table.employeeId),
  index("IDX_gear_items_company").on(table.companyId),
  index("IDX_gear_items_type").on(table.equipmentType),
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
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_gear_serial_numbers_item").on(table.gearItemId),
  index("IDX_gear_serial_numbers_company").on(table.companyId),
  index("IDX_gear_serial_numbers_serial").on(table.serialNumber),
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
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_harness_inspections_company_date").on(table.companyId, table.inspectionDate),
  index("IDX_harness_inspections_worker").on(table.workerId, table.inspectionDate),
  index("IDX_harness_inspections_project").on(table.projectId),
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
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_company_docs_company").on(table.companyId),
  index("IDX_company_docs_type").on(table.companyId, table.documentType),
  index("IDX_company_docs_project").on(table.projectId),
  index("IDX_company_docs_job_type").on(table.companyId, table.documentType, table.jobType),
  index("IDX_company_docs_template").on(table.companyId, table.templateId),
]);

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
  
  // Building information
  buildingName: varchar("building_name").notNull(),
  strataPlanNumber: varchar("strata_plan_number").notNull(),
  buildingAddress: text("building_address").notNull(),
  floorCount: integer("floor_count").notNull(),
  
  // Strata Property Manager information (optional)
  strataManagerName: varchar("strata_manager_name"),
  strataManagerAddress: text("strata_manager_address"),
  
  // Photo attachments - support multiple photos
  photoUrls: text("photo_urls").array().default(sql`ARRAY[]::text[]`), // Array of photo URLs in object storage
  
  // Tracking
  createdBy: varchar("created_by").notNull().references(() => users.id), // User who created the quote
  
  // Status
  status: varchar("status").notNull().default('draft'), // draft | open | closed
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_quotes_company").on(table.companyId),
  index("IDX_quotes_strata").on(table.strataPlanNumber),
  index("IDX_quotes_status").on(table.companyId, table.status),
]);

// Quote services table - each quote can have multiple services
export const quoteServices = pgTable("quote_services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quoteId: varchar("quote_id").notNull().references(() => quotes.id, { onDelete: "cascade" }),
  serviceType: varchar("service_type").notNull(), // window_cleaning | dryer_vent_cleaning | building_wash | parkade | ground_windows | in_suite | custom
  customServiceName: varchar("custom_service_name"), // For custom services
  
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
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
}).refine((data) => {
  // If newPassword is provided, currentPassword must also be provided
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "Current password is required to change password",
  path: ["currentPassword"],
});

export type UpdatePropertyManagerAccount = z.infer<typeof updatePropertyManagerAccountSchema>;

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  lmsNumbers: z.array(z.object({
    number: z.string(),
    address: z.string(),
    stories: z.number().optional(),
    units: z.number().optional(),
    parkingStalls: z.number().optional(),
    dailyDropTarget: z.number().optional(),
    totalDropsNorth: z.number().optional(),
    totalDropsEast: z.number().optional(),
    totalDropsSouth: z.number().optional(),
    totalDropsWest: z.number().optional(),
  })).optional(),
});

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

export const insertProjectSchema = createInsertSchema(projects)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    status: true,
  })
  .extend({
    dailyDropTarget: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    // Job types that use drop-based tracking
    const dropBasedJobTypes = ['window_cleaning', 'dryer_vent_cleaning', 'building_wash'];
    
    if (dropBasedJobTypes.includes(data.jobType)) {
      // For drop-based jobs, dailyDropTarget is required
      if (!data.dailyDropTarget || data.dailyDropTarget <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Daily drop target is required",
          path: ["dailyDropTarget"],
        });
      }
    }
    
    // Job-specific validations for non-drop jobs
    if (data.jobType === 'in_suite_dryer_vent_cleaning') {
      if (!data.suitesPerDay && !data.floorsPerDay) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Either suites per day or floors per day is required",
          path: ["suitesPerDay"],
        });
      }
    }
    
    if (data.jobType === 'parkade_pressure_cleaning') {
      if (!data.stallsPerDay) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Stalls per day is required",
          path: ["stallsPerDay"],
        });
      }
    }
  });

export const insertCustomJobTypeSchema = createInsertSchema(customJobTypes).omit({
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

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Public user type that excludes sensitive fields (never send these to client)
export type UserPublic = Omit<User, "passwordHash" | "licenseKey">;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type CustomJobType = typeof customJobTypes.$inferSelect;
export type InsertCustomJobType = z.infer<typeof insertCustomJobTypeSchema>;

export type DropLog = typeof dropLogs.$inferSelect;
export type InsertDropLog = z.infer<typeof insertDropLogSchema>;

export type WorkSession = typeof workSessions.$inferSelect;
export type InsertWorkSession = z.infer<typeof insertWorkSessionSchema>;

export type NonBillableWorkSession = typeof nonBillableWorkSessions.$inferSelect;
export type InsertNonBillableWorkSession = z.infer<typeof insertNonBillableWorkSessionSchema>;

export type GearItem = typeof gearItems.$inferSelect;
export type InsertGearItem = z.infer<typeof insertGearItemSchema>;

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

// Document Review Signatures table - tracks employee acknowledgment of company documents
export const documentReviewSignatures = pgTable("document_review_signatures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  employeeId: varchar("employee_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Document identification
  documentType: varchar("document_type").notNull(), // health_safety_manual | company_policy | method_statement
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
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_doc_review_company").on(table.companyId),
  index("IDX_doc_review_employee").on(table.employeeId),
  index("IDX_doc_review_document").on(table.documentType, table.documentId),
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
  sessions: (WorkSession & { projectName: string })[];
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
