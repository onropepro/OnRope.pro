CREATE TABLE "clients" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" varchar NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"company" varchar,
	"address" text,
	"phone_number" varchar,
	"lms_numbers" jsonb DEFAULT '[]'::jsonb,
	"billing_address" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "complaint_notes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"complaint_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"user_name" varchar NOT NULL,
	"note" text NOT NULL,
	"visible_to_resident" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "complaints" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" varchar NOT NULL,
	"project_id" varchar,
	"resident_id" varchar,
	"resident_name" varchar NOT NULL,
	"phone_number" varchar NOT NULL,
	"unit_number" varchar NOT NULL,
	"message" text NOT NULL,
	"photo_url" text,
	"status" varchar DEFAULT 'open' NOT NULL,
	"viewed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "drop_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" varchar,
	"user_id" varchar,
	"project_name" varchar,
	"employee_name" varchar,
	"date" date NOT NULL,
	"drops_completed_north" integer DEFAULT 0 NOT NULL,
	"drops_completed_east" integer DEFAULT 0 NOT NULL,
	"drops_completed_south" integer DEFAULT 0 NOT NULL,
	"drops_completed_west" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "gear_items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" varchar NOT NULL,
	"company_id" varchar NOT NULL,
	"equipment_type" varchar,
	"brand" varchar,
	"model" varchar,
	"item_price" numeric(10, 2),
	"assigned_to" varchar DEFAULT 'Not in use',
	"notes" text,
	"quantity" integer DEFAULT 1 NOT NULL,
	"serial_numbers" text[],
	"date_in_service" date,
	"date_out_of_service" date,
	"in_service" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "harness_inspections" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" varchar NOT NULL,
	"project_id" varchar,
	"worker_id" varchar NOT NULL,
	"inspection_date" date NOT NULL,
	"inspector_name" varchar NOT NULL,
	"manufacturer" varchar,
	"personal_harness_id" varchar,
	"lanyard_type" varchar,
	"frayed_edges" boolean NOT NULL,
	"broken_fibers" boolean NOT NULL,
	"pulled_stitching" boolean NOT NULL,
	"cuts_wear" boolean NOT NULL,
	"d_rings_chemical_damage" boolean NOT NULL,
	"d_rings_pads_excessive_wear" boolean NOT NULL,
	"d_rings_bent_distorted" boolean NOT NULL,
	"d_rings_cracks_breaks" boolean NOT NULL,
	"buckle_mechanism" boolean NOT NULL,
	"tongue_buckles_bent_distorted" boolean NOT NULL,
	"tongue_buckles_sharp_edges" boolean NOT NULL,
	"tongue_buckles_move_freely" boolean NOT NULL,
	"connectors_excessive_wear" boolean NOT NULL,
	"connectors_loose" boolean NOT NULL,
	"connectors_broken_distorted" boolean NOT NULL,
	"connectors_cracks_holes" boolean NOT NULL,
	"sharp_rough_edges" boolean NOT NULL,
	"burns_tears_cracks" boolean NOT NULL,
	"chemical_damage" boolean NOT NULL,
	"excessive_soiling" boolean NOT NULL,
	"connectors_hooks_work" boolean NOT NULL,
	"locking_mechanisms_work" boolean NOT NULL,
	"shock_absorber_intact" boolean NOT NULL,
	"excessive_wear_signs" boolean NOT NULL,
	"date_in_service" date,
	"comments" text,
	"pdf_url" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "job_assignments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" varchar NOT NULL,
	"employee_id" varchar NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"assigned_at" timestamp DEFAULT now(),
	"assigned_by" varchar
);
--> statement-breakpoint
CREATE TABLE "job_comments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" varchar NOT NULL,
	"company_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"user_name" varchar NOT NULL,
	"comment" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "non_billable_work_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" varchar,
	"company_id" varchar NOT NULL,
	"employee_name" varchar,
	"employee_role" varchar,
	"employee_hourly_rate" numeric(10, 2),
	"work_date" date NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp,
	"description" text NOT NULL,
	"start_latitude" numeric(10, 7),
	"start_longitude" numeric(10, 7),
	"end_latitude" numeric(10, 7),
	"end_longitude" numeric(10, 7),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pay_period_config" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" varchar NOT NULL,
	"period_type" varchar NOT NULL,
	"first_pay_day" integer,
	"second_pay_day" integer,
	"monthly_start_day" integer,
	"monthly_end_day" integer,
	"start_day_of_week" integer,
	"bi_weekly_anchor_date" date,
	"custom_start_date" date,
	"custom_end_date" date,
	"overtime_multiplier" numeric(4, 2) DEFAULT '1.5',
	"double_time_multiplier" numeric(4, 2) DEFAULT '2.0',
	"overtime_trigger_type" varchar DEFAULT 'daily',
	"overtime_hours_threshold" numeric(5, 2) DEFAULT '8',
	"double_time_trigger_type" varchar DEFAULT 'daily',
	"double_time_hours_threshold" numeric(5, 2) DEFAULT '12',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "pay_period_config_company_id_unique" UNIQUE("company_id")
);
--> statement-breakpoint
CREATE TABLE "pay_periods" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" varchar NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" varchar DEFAULT 'upcoming' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_photos" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" varchar NOT NULL,
	"company_id" varchar NOT NULL,
	"uploaded_by" varchar NOT NULL,
	"image_url" text NOT NULL,
	"unit_number" varchar,
	"comment" text,
	"is_missed_unit" boolean DEFAULT false NOT NULL,
	"missed_unit_number" varchar,
	"is_missed_stall" boolean DEFAULT false NOT NULL,
	"missed_stall_number" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" varchar NOT NULL,
	"building_name" varchar,
	"strata_plan_number" varchar,
	"building_address" text,
	"job_type" varchar NOT NULL,
	"custom_job_type" varchar,
	"total_drops_north" integer DEFAULT 0,
	"total_drops_east" integer DEFAULT 0,
	"total_drops_south" integer DEFAULT 0,
	"total_drops_west" integer DEFAULT 0,
	"daily_drop_target" integer,
	"floor_count" integer,
	"target_completion_date" date,
	"estimated_hours" integer,
	"start_date" date,
	"end_date" date,
	"rope_access_plan_url" text,
	"image_urls" text[] DEFAULT ARRAY[]::text[],
	"status" varchar DEFAULT 'active' NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"calendar_color" varchar DEFAULT '#3b82f6',
	"suites_per_day" integer,
	"total_floors" integer,
	"floors_per_day" integer,
	"total_stalls" integer,
	"stalls_per_day" integer,
	"building_floors" integer,
	"assigned_employees" text[] DEFAULT ARRAY[]::text[],
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quote_services" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quote_id" varchar NOT NULL,
	"service_type" varchar NOT NULL,
	"drops_north" integer,
	"drops_east" integer,
	"drops_south" integer,
	"drops_west" integer,
	"drops_per_day" integer,
	"parkade_stalls" integer,
	"price_per_stall" numeric(10, 2),
	"ground_window_hours" numeric(10, 2),
	"suites_per_day" integer,
	"floors_per_day" integer,
	"dryer_vent_pricing_type" varchar,
	"dryer_vent_units" integer,
	"dryer_vent_price_per_unit" numeric(10, 2),
	"price_per_hour" numeric(10, 2),
	"total_hours" numeric(10, 2),
	"total_cost" numeric(10, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quotes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" varchar NOT NULL,
	"building_name" varchar NOT NULL,
	"strata_plan_number" varchar NOT NULL,
	"building_address" text NOT NULL,
	"floor_count" integer NOT NULL,
	"photo_url" text,
	"created_by" varchar NOT NULL,
	"status" varchar DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "scheduled_jobs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" varchar NOT NULL,
	"project_id" varchar,
	"title" varchar NOT NULL,
	"description" text,
	"job_type" varchar NOT NULL,
	"custom_job_type" varchar,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" varchar DEFAULT 'upcoming' NOT NULL,
	"location" text,
	"color" varchar DEFAULT '#3b82f6',
	"estimated_hours" integer,
	"actual_hours" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" varchar
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "toolbox_meetings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" varchar NOT NULL,
	"project_id" varchar NOT NULL,
	"conducted_by" varchar NOT NULL,
	"meeting_date" date NOT NULL,
	"conducted_by_name" varchar NOT NULL,
	"attendees" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"topic_fall_protection" boolean DEFAULT false NOT NULL,
	"topic_anchor_points" boolean DEFAULT false NOT NULL,
	"topic_rope_inspection" boolean DEFAULT false NOT NULL,
	"topic_knot_tying" boolean DEFAULT false NOT NULL,
	"topic_ppe_check" boolean DEFAULT false NOT NULL,
	"topic_weather_conditions" boolean DEFAULT false NOT NULL,
	"topic_communication" boolean DEFAULT false NOT NULL,
	"topic_emergency_evacuation" boolean DEFAULT false NOT NULL,
	"topic_hazard_assessment" boolean DEFAULT false NOT NULL,
	"topic_load_calculations" boolean DEFAULT false NOT NULL,
	"topic_equipment_compatibility" boolean DEFAULT false NOT NULL,
	"topic_descender_ascender" boolean DEFAULT false NOT NULL,
	"topic_edge_protection" boolean DEFAULT false NOT NULL,
	"topic_swing_fall" boolean DEFAULT false NOT NULL,
	"topic_medical_fitness" boolean DEFAULT false NOT NULL,
	"topic_tool_drop_prevention" boolean DEFAULT false NOT NULL,
	"topic_regulations" boolean DEFAULT false NOT NULL,
	"topic_rescue_procedures" boolean DEFAULT false NOT NULL,
	"topic_site_hazards" boolean DEFAULT false NOT NULL,
	"topic_buddy_system" boolean DEFAULT false NOT NULL,
	"custom_topic" text,
	"additional_notes" text,
	"pdf_url" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"dashboard_card_order" text[],
	"hours_analytics_card_order" text[],
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"password_hash" text NOT NULL,
	"role" varchar NOT NULL,
	"company_name" varchar,
	"company_id" varchar,
	"street_address" text,
	"province" varchar,
	"country" varchar,
	"zip_code" varchar,
	"name" varchar,
	"strata_plan_number" varchar,
	"unit_number" varchar,
	"phone_number" varchar,
	"parking_stall_number" varchar,
	"tech_level" varchar,
	"hourly_rate" numeric(10, 2),
	"permissions" text[] DEFAULT ARRAY[]::text[],
	"is_temp_password" boolean DEFAULT false,
	"start_date" date,
	"birthday" date,
	"drivers_license_number" varchar,
	"drivers_license_province" varchar,
	"drivers_license_documents" text[] DEFAULT ARRAY[]::text[],
	"home_address" text,
	"employee_phone_number" varchar,
	"emergency_contact_name" varchar,
	"emergency_contact_phone" varchar,
	"special_medical_conditions" text,
	"irata_level" varchar,
	"irata_license_number" varchar,
	"irata_issued_date" date,
	"irata_expiration_date" date,
	"terminated_date" date,
	"termination_reason" text,
	"termination_notes" text,
	"license_key" text,
	"license_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "work_sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" varchar,
	"employee_id" varchar,
	"company_id" varchar NOT NULL,
	"project_name" varchar,
	"project_building_address" text,
	"project_strata_plan_number" varchar,
	"employee_name" varchar,
	"employee_role" varchar,
	"employee_hourly_rate" numeric(10, 2),
	"work_date" date NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp,
	"start_latitude" numeric(10, 7),
	"start_longitude" numeric(10, 7),
	"end_latitude" numeric(10, 7),
	"end_longitude" numeric(10, 7),
	"drops_completed_north" integer DEFAULT 0,
	"drops_completed_east" integer DEFAULT 0,
	"drops_completed_south" integer DEFAULT 0,
	"drops_completed_west" integer DEFAULT 0,
	"shortfall_reason" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_company_id_users_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaint_notes" ADD CONSTRAINT "complaint_notes_complaint_id_complaints_id_fk" FOREIGN KEY ("complaint_id") REFERENCES "public"."complaints"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaint_notes" ADD CONSTRAINT "complaint_notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_company_id_users_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_resident_id_users_id_fk" FOREIGN KEY ("resident_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drop_logs" ADD CONSTRAINT "drop_logs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drop_logs" ADD CONSTRAINT "drop_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gear_items" ADD CONSTRAINT "gear_items_employee_id_users_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gear_items" ADD CONSTRAINT "gear_items_company_id_users_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "harness_inspections" ADD CONSTRAINT "harness_inspections_company_id_users_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "harness_inspections" ADD CONSTRAINT "harness_inspections_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "harness_inspections" ADD CONSTRAINT "harness_inspections_worker_id_users_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_assignments" ADD CONSTRAINT "job_assignments_job_id_scheduled_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."scheduled_jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_assignments" ADD CONSTRAINT "job_assignments_employee_id_users_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_assignments" ADD CONSTRAINT "job_assignments_assigned_by_users_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_comments" ADD CONSTRAINT "job_comments_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_comments" ADD CONSTRAINT "job_comments_company_id_users_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_comments" ADD CONSTRAINT "job_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "non_billable_work_sessions" ADD CONSTRAINT "non_billable_work_sessions_employee_id_users_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "non_billable_work_sessions" ADD CONSTRAINT "non_billable_work_sessions_company_id_users_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pay_period_config" ADD CONSTRAINT "pay_period_config_company_id_users_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pay_periods" ADD CONSTRAINT "pay_periods_company_id_users_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_photos" ADD CONSTRAINT "project_photos_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_photos" ADD CONSTRAINT "project_photos_company_id_users_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_photos" ADD CONSTRAINT "project_photos_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_company_id_users_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_services" ADD CONSTRAINT "quote_services_quote_id_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_company_id_users_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_jobs" ADD CONSTRAINT "scheduled_jobs_company_id_users_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_jobs" ADD CONSTRAINT "scheduled_jobs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_jobs" ADD CONSTRAINT "scheduled_jobs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "toolbox_meetings" ADD CONSTRAINT "toolbox_meetings_company_id_users_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "toolbox_meetings" ADD CONSTRAINT "toolbox_meetings_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "toolbox_meetings" ADD CONSTRAINT "toolbox_meetings_conducted_by_users_id_fk" FOREIGN KEY ("conducted_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_users_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_sessions" ADD CONSTRAINT "work_sessions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_sessions" ADD CONSTRAINT "work_sessions_employee_id_users_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_sessions" ADD CONSTRAINT "work_sessions_company_id_users_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_gear_items_employee" ON "gear_items" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "IDX_gear_items_company" ON "gear_items" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "IDX_gear_items_type" ON "gear_items" USING btree ("equipment_type");--> statement-breakpoint
CREATE INDEX "IDX_harness_inspections_company_date" ON "harness_inspections" USING btree ("company_id","inspection_date");--> statement-breakpoint
CREATE INDEX "IDX_harness_inspections_worker" ON "harness_inspections" USING btree ("worker_id","inspection_date");--> statement-breakpoint
CREATE INDEX "IDX_harness_inspections_project" ON "harness_inspections" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "IDX_job_comments_project" ON "job_comments" USING btree ("project_id","created_at");--> statement-breakpoint
CREATE INDEX "IDX_job_comments_company" ON "job_comments" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "IDX_pay_period_config_company" ON "pay_period_config" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "IDX_pay_periods_company_dates" ON "pay_periods" USING btree ("company_id","start_date","end_date");--> statement-breakpoint
CREATE INDEX "IDX_pay_periods_status" ON "pay_periods" USING btree ("company_id","status");--> statement-breakpoint
CREATE INDEX "IDX_project_photos_project" ON "project_photos" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "IDX_project_photos_unit" ON "project_photos" USING btree ("unit_number","project_id");--> statement-breakpoint
CREATE INDEX "IDX_project_photos_missed" ON "project_photos" USING btree ("is_missed_unit","project_id");--> statement-breakpoint
CREATE INDEX "IDX_project_photos_missed_stall" ON "project_photos" USING btree ("is_missed_stall","project_id");--> statement-breakpoint
CREATE INDEX "IDX_quote_services_quote" ON "quote_services" USING btree ("quote_id");--> statement-breakpoint
CREATE INDEX "IDX_quote_services_type" ON "quote_services" USING btree ("quote_id","service_type");--> statement-breakpoint
CREATE INDEX "IDX_quotes_company" ON "quotes" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "IDX_quotes_strata" ON "quotes" USING btree ("strata_plan_number");--> statement-breakpoint
CREATE INDEX "IDX_quotes_status" ON "quotes" USING btree ("company_id","status");--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");--> statement-breakpoint
CREATE INDEX "IDX_toolbox_meetings_company_date" ON "toolbox_meetings" USING btree ("company_id","meeting_date");--> statement-breakpoint
CREATE INDEX "IDX_toolbox_meetings_project" ON "toolbox_meetings" USING btree ("project_id","meeting_date");--> statement-breakpoint
CREATE INDEX "IDX_toolbox_meetings_conductor" ON "toolbox_meetings" USING btree ("conducted_by","meeting_date");