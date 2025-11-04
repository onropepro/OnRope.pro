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

// Users table - supports multiple roles: company, resident, operations_manager, supervisor, rope_access_tech
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(), // null for company accounts
  passwordHash: text("password_hash").notNull(),
  role: varchar("role").notNull(), // company | resident | operations_manager | supervisor | rope_access_tech
  
  // Company-specific fields
  companyName: varchar("company_name"), // for company role
  
  // Resident-specific fields
  name: varchar("name"), // for resident role
  strataPlanNumber: varchar("strata_plan_number"), // for resident role
  
  // Employee-specific fields
  techLevel: varchar("tech_level"), // for rope_access_tech role (e.g., "Level 1", "Level 2", "Level 3")
  isTempPassword: boolean("is_temp_password").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects table
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id, { onDelete: "cascade" }), // Foreign key to company
  strataPlanNumber: varchar("strata_plan_number").notNull(),
  jobType: varchar("job_type").notNull(), // window_cleaning | dryer_vent_cleaning | pressure_washing
  totalDrops: integer("total_drops").notNull(),
  dailyDropTarget: integer("daily_drop_target").notNull(),
  floorCount: integer("floor_count").notNull(),
  ropeAccessPlanUrl: text("rope_access_plan_url"), // URL to PDF in object storage
  status: varchar("status").notNull().default('active'), // active | completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Drop logs table - tracks daily drops per project per tech
export const dropLogs = pgTable("drop_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  dropsCompleted: integer("drops_completed").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Complaints table
export const complaints = pgTable("complaints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  residentId: varchar("resident_id").references(() => users.id, { onDelete: "set null" }), // Optional link to resident user
  residentName: varchar("resident_name").notNull(),
  phoneNumber: varchar("phone_number").notNull(),
  unitNumber: varchar("unit_number").notNull(),
  message: text("message").notNull(),
  status: varchar("status").notNull().default('open'), // open | closed
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
  complaints: many(complaints), // For resident role
  complaintNotes: many(complaintNotes),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  company: one(users, {
    fields: [projects.companyId],
    references: [users.id],
  }),
  dropLogs: many(dropLogs),
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
