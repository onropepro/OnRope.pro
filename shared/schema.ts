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
  status: varchar("status").notNull().default('open'), // open | closed
  viewedAt: timestamp("viewed_at"), // When staff first viewed this complaint
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Complaint notes table - techs can add notes to complaints
export const complaintNotes = pgTable("complaint_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  complaintId: varchar("complaint_id").notNull().references(() => complaints.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  note: text("note").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

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

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
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

// Extended types for frontend use with relations
export type ProjectWithProgress = Project & {
  completedDrops: number;
  progressPercentage: number;
};

export type ComplaintWithNotes = Complaint & {
  notes: (ComplaintNote & { user: User })[];
};
