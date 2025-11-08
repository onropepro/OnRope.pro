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

// Users table - supports multiple roles
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(), // null for company accounts
  passwordHash: text("password_hash").notNull(),
  role: varchar("role").notNull(), // company | resident | operations_manager | supervisor | rope_access_tech | manager | ground_crew | ground_crew_supervisor
  
  // Company-specific fields
  companyName: varchar("company_name"), // for company role
  companyId: varchar("company_id").references(() => users.id, { onDelete: "cascade" }), // for employees - links to their company
  
  // Shared fields
  name: varchar("name"), // for resident and employee roles
  
  // Resident-specific fields
  strataPlanNumber: varchar("strata_plan_number"), // for resident role
  unitNumber: varchar("unit_number"), // for resident role
  phoneNumber: varchar("phone_number"), // for resident role
  
  // Employee-specific fields
  techLevel: varchar("tech_level"), // for rope_access_tech role (e.g., "Level 1", "Level 2", "Level 3")
  permissions: text("permissions").array().default(sql`ARRAY[]::text[]`), // Array of permission strings for employees
  isTempPassword: boolean("is_temp_password").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects table
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }), // Foreign key to company
  buildingName: varchar("building_name").notNull(), // Building name for display
  strataPlanNumber: varchar("strata_plan_number").notNull(),
  buildingAddress: text("building_address"), // Building address visible to all employees
  jobType: varchar("job_type").notNull(), // window_cleaning | dryer_vent_cleaning | pressure_washing | in_suite_dryer_vent_cleaning | parkade_pressure_cleaning | ground_window_cleaning
  
  // Elevation-specific drop totals
  totalDropsNorth: integer("total_drops_north").notNull().default(0),
  totalDropsEast: integer("total_drops_east").notNull().default(0),
  totalDropsSouth: integer("total_drops_south").notNull().default(0),
  totalDropsWest: integer("total_drops_west").notNull().default(0),
  
  dailyDropTarget: integer("daily_drop_target").notNull(),
  floorCount: integer("floor_count").notNull(),
  targetCompletionDate: date("target_completion_date"), // Optional target completion date
  ropeAccessPlanUrl: text("rope_access_plan_url"), // URL to PDF in object storage
  imageUrls: text("image_urls").array().default(sql`ARRAY[]::text[]`), // Array of image URLs from object storage
  status: varchar("status").notNull().default('active'), // active | completed
  
  // Service-specific expectation fields
  suitesPerDay: integer("suites_per_day"), // For in_suite_dryer_vent_cleaning
  floorsPerDay: integer("floors_per_day"), // Alternative for in_suite_dryer_vent_cleaning
  stallsPerDay: integer("stalls_per_day"), // For parkade_pressure_cleaning
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

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
  
  // Elevation-specific drops completed
  dropsCompletedNorth: integer("drops_completed_north").default(0),
  dropsCompletedEast: integer("drops_completed_east").default(0),
  dropsCompletedSouth: integer("drops_completed_south").default(0),
  dropsCompletedWest: integer("drops_completed_west").default(0),
  
  shortfallReason: text("shortfall_reason"), // Required if total drops < dailyDropTarget
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_work_sessions_company_project_date").on(table.companyId, table.projectId, table.workDate),
  index("IDX_work_sessions_employee_project").on(table.employeeId, table.projectId),
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
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_project_photos_project").on(table.projectId),
  index("IDX_project_photos_unit").on(table.unitNumber, table.projectId),
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

// Harness inspections table - daily safety inspections before work
export const harnessInspections = pgTable("harness_inspections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }), // Optional
  workerId: varchar("worker_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  inspectionDate: date("inspection_date").notNull(),
  
  // Basic information
  inspectorName: varchar("inspector_name").notNull(),
  manufacturer: varchar("manufacturer"),
  personalHarnessId: varchar("personal_harness_id"),
  lanyardType: varchar("lanyard_type"), // not_specified | shock_absorber | etc
  
  // Harness & Lanyard Components (NO = pass, YES = fail for most)
  frayedEdges: boolean("frayed_edges").notNull(),
  brokenFibers: boolean("broken_fibers").notNull(),
  pulledStitching: boolean("pulled_stitching").notNull(),
  cutsWear: boolean("cuts_wear").notNull(),
  dRingsChemicalDamage: boolean("d_rings_chemical_damage").notNull(),
  dRingsPadsExcessiveWear: boolean("d_rings_pads_excessive_wear").notNull(),
  dRingsBentDistorted: boolean("d_rings_bent_distorted").notNull(),
  dRingsCracksBreaks: boolean("d_rings_cracks_breaks").notNull(),
  buckleMechanism: boolean("buckle_mechanism").notNull(),
  tongueBucklesBentDistorted: boolean("tongue_buckles_bent_distorted").notNull(),
  tongueBucklesSharpEdges: boolean("tongue_buckles_sharp_edges").notNull(),
  tongueBucklesMoveFreely: boolean("tongue_buckles_move_freely").notNull(),
  connectorsExcessiveWear: boolean("connectors_excessive_wear").notNull(),
  connectorsLoose: boolean("connectors_loose").notNull(),
  connectorsBrokenDistorted: boolean("connectors_broken_distorted").notNull(),
  connectorsCracksHoles: boolean("connectors_cracks_holes").notNull(),
  sharpRoughEdges: boolean("sharp_rough_edges").notNull(),
  
  // Lanyard Inspection (YES = pass for these)
  burnsTearsCracks: boolean("burns_tears_cracks").notNull(),
  chemicalDamage: boolean("chemical_damage").notNull(),
  excessiveSoiling: boolean("excessive_soiling").notNull(),
  connectorsHooksWork: boolean("connectors_hooks_work").notNull(),
  lockingMechanismsWork: boolean("locking_mechanisms_work").notNull(),
  shockAbsorberIntact: boolean("shock_absorber_intact").notNull(),
  excessiveWearSigns: boolean("excessive_wear_signs").notNull(),
  
  // Service date and comments
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
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_toolbox_meetings_company_date").on(table.companyId, table.meetingDate),
  index("IDX_toolbox_meetings_project").on(table.projectId, table.meetingDate),
  index("IDX_toolbox_meetings_conductor").on(table.conductedBy, table.meetingDate),
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

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

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
    const dropBasedJobTypes = ['window_cleaning', 'dryer_vent_cleaning', 'pressure_washing'];
    
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

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type DropLog = typeof dropLogs.$inferSelect;
export type InsertDropLog = z.infer<typeof insertDropLogSchema>;

export type WorkSession = typeof workSessions.$inferSelect;
export type InsertWorkSession = z.infer<typeof insertWorkSessionSchema>;

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

// Extended types for frontend use with relations
export type ProjectWithProgress = Project & {
  completedDrops: number;
  progressPercentage: number;
};

export type ComplaintWithNotes = Complaint & {
  notes: (ComplaintNote & { user: User })[];
};
