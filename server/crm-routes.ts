import { Request, Response, Express } from "express";
import { z } from "zod";
import { db } from "./db";
import {
  crmCompanies,
  crmContacts,
  crmActivities,
  crmEmailTemplates,
  crmSequences,
  crmSequenceSteps,
  crmSequenceEnrollments,
  crmTasks,
  crmBrightdataImports,
  insertCrmCompanySchema,
  insertCrmContactSchema,
  insertCrmActivitySchema,
  insertCrmEmailTemplateSchema,
  insertCrmSequenceSchema,
  insertCrmTaskSchema,
} from "../shared/schema";
import { eq, desc, and, sql, ilike, or, count, inArray } from "drizzle-orm";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

function isSuperuser(req: Request): boolean {
  return req.session?.userId === 'superuser';
}

export function registerCrmRoutes(app: Express, requireAuth: any) {
  // CRM Dashboard Stats
  app.get("/api/crm/dashboard/stats", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!isSuperuser(req)) {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const [companiesResult] = await db.select({ count: count() }).from(crmCompanies);
      const [contactsResult] = await db.select({ count: count() }).from(crmContacts);
      
      const stageStats = await db
        .select({ stage: crmContacts.stage, count: count() })
        .from(crmContacts)
        .groupBy(crmContacts.stage);
      
      const recentActivities = await db
        .select()
        .from(crmActivities)
        .orderBy(desc(crmActivities.createdAt))
        .limit(10);

      const pendingTasks = await db
        .select({ count: count() })
        .from(crmTasks)
        .where(eq(crmTasks.status, "pending"));

      const pipeline: Record<string, number> = {};
      for (const stat of stageStats) {
        pipeline[stat.stage] = Number(stat.count);
      }

      res.json({
        totalCompanies: Number(companiesResult.count),
        totalContacts: Number(contactsResult.count),
        pipeline,
        pendingTasks: Number(pendingTasks[0]?.count || 0),
        recentActivities,
      });
    } catch (error) {
      console.error("CRM dashboard stats error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ============================================
  // CRM Companies CRUD
  // ============================================
  
  app.get("/api/crm/companies", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!isSuperuser(req)) {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const { search, country, source, page = "1", limit = "50" } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

      let query = db.select().from(crmCompanies);
      const conditions = [];

      if (search) {
        conditions.push(
          or(
            ilike(crmCompanies.name, `%${search}%`),
            ilike(crmCompanies.email, `%${search}%`),
            ilike(crmCompanies.city, `%${search}%`)
          )
        );
      }
      if (country) {
        conditions.push(eq(crmCompanies.country, country as string));
      }
      if (source) {
        conditions.push(eq(crmCompanies.source, source as any));
      }

      const companies = await db
        .select()
        .from(crmCompanies)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(crmCompanies.createdAt))
        .limit(parseInt(limit as string))
        .offset(offset);

      const [totalResult] = await db
        .select({ count: count() })
        .from(crmCompanies)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      res.json({
        companies,
        total: Number(totalResult.count),
        page: parseInt(page as string),
        totalPages: Math.ceil(Number(totalResult.count) / parseInt(limit as string)),
      });
    } catch (error) {
      console.error("Get CRM companies error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/crm/companies/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!isSuperuser(req)) {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const { id } = req.params;
      const [company] = await db
        .select()
        .from(crmCompanies)
        .where(eq(crmCompanies.id, parseInt(id)));

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      const contacts = await db
        .select()
        .from(crmContacts)
        .where(eq(crmContacts.companyId, parseInt(id)));

      res.json({ company, contacts });
    } catch (error) {
      console.error("Get CRM company error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/crm/companies", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!isSuperuser(req)) {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const parseResult = insertCrmCompanySchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid data", errors: parseResult.error.errors });
      }

      const [company] = await db.insert(crmCompanies).values(parseResult.data).returning();
      res.status(201).json({ company });
    } catch (error) {
      console.error("Create CRM company error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/crm/companies/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!isSuperuser(req)) {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const { id } = req.params;
      const [existing] = await db.select().from(crmCompanies).where(eq(crmCompanies.id, parseInt(id)));
      if (!existing) {
        return res.status(404).json({ message: "Company not found" });
      }

      const [company] = await db
        .update(crmCompanies)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(crmCompanies.id, parseInt(id)))
        .returning();

      res.json({ company });
    } catch (error) {
      console.error("Update CRM company error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/crm/companies/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!isSuperuser(req)) {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const { id } = req.params;
      await db.delete(crmCompanies).where(eq(crmCompanies.id, parseInt(id)));
      res.json({ success: true });
    } catch (error) {
      console.error("Delete CRM company error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ============================================
  // CRM Contacts CRUD
  // ============================================
  
  app.get("/api/crm/contacts", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!isSuperuser(req)) {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const { search, stage, source, companyId, page = "1", limit = "50" } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      const conditions = [];

      if (search) {
        conditions.push(
          or(
            ilike(crmContacts.firstName, `%${search}%`),
            ilike(crmContacts.lastName, `%${search}%`),
            ilike(crmContacts.email, `%${search}%`)
          )
        );
      }
      if (stage) {
        conditions.push(eq(crmContacts.stage, stage as any));
      }
      if (source) {
        conditions.push(eq(crmContacts.source, source as any));
      }
      if (companyId) {
        conditions.push(eq(crmContacts.companyId, parseInt(companyId as string)));
      }

      const contacts = await db
        .select()
        .from(crmContacts)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(crmContacts.createdAt))
        .limit(parseInt(limit as string))
        .offset(offset);

      const [totalResult] = await db
        .select({ count: count() })
        .from(crmContacts)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      res.json({
        contacts,
        total: Number(totalResult.count),
        page: parseInt(page as string),
        totalPages: Math.ceil(Number(totalResult.count) / parseInt(limit as string)),
      });
    } catch (error) {
      console.error("Get CRM contacts error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/crm/contacts/pipeline", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!isSuperuser(req)) {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const stages = ['lead_captured', 'contacted', 'demo_scheduled', 'trial', 'paid_subscriber', 'churned', 'lost'];
      const pipeline: Record<string, any[]> = {};

      for (const stage of stages) {
        const contacts = await db
          .select({
            contact: crmContacts,
            companyName: crmCompanies.name,
          })
          .from(crmContacts)
          .leftJoin(crmCompanies, eq(crmContacts.companyId, crmCompanies.id))
          .where(eq(crmContacts.stage, stage as any))
          .orderBy(desc(crmContacts.updatedAt))
          .limit(100);
        
        pipeline[stage] = contacts.map(c => ({
          ...c.contact,
          companyName: c.companyName,
        }));
      }

      res.json({ pipeline });
    } catch (error) {
      console.error("Get CRM pipeline error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/crm/contacts/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!isSuperuser(req)) {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const { id } = req.params;
      const [result] = await db
        .select({
          contact: crmContacts,
          company: crmCompanies,
        })
        .from(crmContacts)
        .leftJoin(crmCompanies, eq(crmContacts.companyId, crmCompanies.id))
        .where(eq(crmContacts.id, parseInt(id)));

      if (!result) {
        return res.status(404).json({ message: "Contact not found" });
      }

      const activities = await db
        .select()
        .from(crmActivities)
        .where(eq(crmActivities.contactId, parseInt(id)))
        .orderBy(desc(crmActivities.createdAt))
        .limit(50);

      const tasks = await db
        .select()
        .from(crmTasks)
        .where(eq(crmTasks.contactId, parseInt(id)))
        .orderBy(desc(crmTasks.createdAt));

      res.json({
        contact: result.contact,
        company: result.company,
        activities,
        tasks,
      });
    } catch (error) {
      console.error("Get CRM contact error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/crm/contacts", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!isSuperuser(req)) {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const parseResult = insertCrmContactSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid data", errors: parseResult.error.errors });
      }

      const [contact] = await db.insert(crmContacts).values(parseResult.data).returning();
      res.status(201).json({ contact });
    } catch (error) {
      console.error("Create CRM contact error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/crm/contacts/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!isSuperuser(req)) {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const { id } = req.params;
      const [existing] = await db.select().from(crmContacts).where(eq(crmContacts.id, parseInt(id)));
      if (!existing) {
        return res.status(404).json({ message: "Contact not found" });
      }

      const previousStage = existing.stage;
      const [contact] = await db
        .update(crmContacts)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(crmContacts.id, parseInt(id)))
        .returning();

      if (req.body.stage && req.body.stage !== previousStage) {
        await db.insert(crmActivities).values({
          contactId: parseInt(id),
          companyId: existing.companyId,
          type: "stage_change",
          subject: `Stage changed from ${previousStage} to ${req.body.stage}`,
          previousStage: previousStage,
          newStage: req.body.stage,
        });
      }

      res.json({ contact });
    } catch (error) {
      console.error("Update CRM contact error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/crm/contacts/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!isSuperuser(req)) {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const { id } = req.params;
      await db.delete(crmContacts).where(eq(crmContacts.id, parseInt(id)));
      res.json({ success: true });
    } catch (error) {
      console.error("Delete CRM contact error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ============================================
  // CRM Activities
  // ============================================
  
  app.post("/api/crm/activities", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!isSuperuser(req)) {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const parseResult = insertCrmActivitySchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid data", errors: parseResult.error.errors });
      }

      const [activity] = await db.insert(crmActivities).values(parseResult.data).returning();
      res.status(201).json({ activity });
    } catch (error) {
      console.error("Create CRM activity error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/crm/activities", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!isSuperuser(req)) {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const { contactId, companyId, type, limit = "100" } = req.query;
      const conditions = [];

      if (contactId) {
        conditions.push(eq(crmActivities.contactId, parseInt(contactId as string)));
      }
      if (companyId) {
        conditions.push(eq(crmActivities.companyId, parseInt(companyId as string)));
      }
      if (type) {
        conditions.push(eq(crmActivities.type, type as any));
      }

      const activities = await db
        .select()
        .from(crmActivities)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(crmActivities.createdAt))
        .limit(parseInt(limit as string));

      res.json({ activities });
    } catch (error) {
      console.error("Get CRM activities error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ============================================
  // CRM Tasks
  // ============================================
  
  app.get("/api/crm/tasks", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!isSuperuser(req)) {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const { status, contactId, companyId, priority } = req.query;
      const conditions = [];

      if (status) {
        conditions.push(eq(crmTasks.status, status as string));
      }
      if (contactId) {
        conditions.push(eq(crmTasks.contactId, parseInt(contactId as string)));
      }
      if (companyId) {
        conditions.push(eq(crmTasks.companyId, parseInt(companyId as string)));
      }
      if (priority) {
        conditions.push(eq(crmTasks.priority, priority as string));
      }

      const tasks = await db
        .select({
          task: crmTasks,
          contactName: sql`${crmContacts.firstName} || ' ' || COALESCE(${crmContacts.lastName}, '')`,
          companyName: crmCompanies.name,
        })
        .from(crmTasks)
        .leftJoin(crmContacts, eq(crmTasks.contactId, crmContacts.id))
        .leftJoin(crmCompanies, eq(crmTasks.companyId, crmCompanies.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(crmTasks.dueDate));

      res.json({
        tasks: tasks.map(t => ({
          ...t.task,
          contactName: t.contactName,
          companyName: t.companyName,
        })),
      });
    } catch (error) {
      console.error("Get CRM tasks error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/crm/tasks", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!isSuperuser(req)) {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const parseResult = insertCrmTaskSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid data", errors: parseResult.error.errors });
      }

      const [task] = await db.insert(crmTasks).values(parseResult.data).returning();
      res.status(201).json({ task });
    } catch (error) {
      console.error("Create CRM task error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/crm/tasks/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!isSuperuser(req)) {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const { id } = req.params;
      const updateData: any = { ...req.body };
      
      if (req.body.status === "completed" && !req.body.completedAt) {
        updateData.completedAt = new Date();
      }

      const [task] = await db
        .update(crmTasks)
        .set(updateData)
        .where(eq(crmTasks.id, parseInt(id)))
        .returning();

      if (task && req.body.status === "completed" && task.contactId) {
        await db.insert(crmActivities).values({
          contactId: task.contactId,
          companyId: task.companyId,
          type: "task_completed",
          subject: `Task completed: ${task.title}`,
        });
      }

      res.json({ task });
    } catch (error) {
      console.error("Update CRM task error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/crm/tasks/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!isSuperuser(req)) {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const { id } = req.params;
      await db.delete(crmTasks).where(eq(crmTasks.id, parseInt(id)));
      res.json({ success: true });
    } catch (error) {
      console.error("Delete CRM task error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ============================================
  // CSV Import for Companies
  // ============================================
  
  app.post("/api/crm/import/csv", requireAuth, upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!isSuperuser(req)) {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const csvContent = req.file.buffer.toString("utf-8");
      const lines = csvContent.split("\n").filter(line => line.trim());
      
      if (lines.length < 3) {
        return res.status(400).json({ message: "CSV file is empty or invalid" });
      }

      const companies: any[] = [];
      const contacts: any[] = [];
      let imported = 0;
      let skipped = 0;

      for (let i = 2; i < lines.length; i++) {
        const line = lines[i];
        const values = parseCSVLine(line);
        
        if (values.length < 7 || !values[0]?.trim()) {
          skipped++;
          continue;
        }

        const companyName = values[0]?.trim();
        const location = values[1]?.trim() || "";
        const serviceRegion = values[2]?.trim() || "";
        const serviceType = values[3]?.trim() || "";
        const website = values[4]?.trim() || null;
        const phone = values[5]?.trim() || null;
        const email = values[6]?.trim() || null;
        const instagram = values[7]?.trim() || null;
        const facebook = values[8]?.trim() || null;
        
        const contactName = values[10]?.trim() || "";
        const contactPosition = values[11]?.trim() || null;
        const contactEmail = values[12]?.trim() || null;
        const contactPhone = values[13]?.trim() || null;
        const contactInstagram = values[14]?.trim() || null;
        const contactFacebook = values[15]?.trim() || null;
        const contactLinkedin = values[16]?.trim() || null;

        const city = location.split(",")[0]?.trim() || location;

        try {
          const [company] = await db
            .insert(crmCompanies)
            .values({
              name: companyName,
              city: city,
              stateProvince: location.includes(",") ? location.split(",")[1]?.trim() : "BC",
              country: "CA",
              serviceRegion: serviceRegion,
              serviceType: serviceType,
              website: website,
              phone: phone,
              email: email,
              instagramUrl: instagram,
              facebookUrl: facebook,
              source: "manual",
            })
            .returning();

          if (company && contactName) {
            const nameParts = contactName.split(/[\/\s]+/).filter(Boolean);
            const firstName = nameParts[0] || "Unknown";
            const lastName = nameParts.slice(1).join(" ") || null;

            await db.insert(crmContacts).values({
              companyId: company.id,
              firstName: firstName,
              lastName: lastName,
              jobTitle: contactPosition,
              email: contactEmail,
              phone: contactPhone,
              instagramUrl: contactInstagram,
              facebookUrl: contactFacebook,
              linkedinUrl: contactLinkedin,
              source: "manual",
              stage: "lead_captured",
              consentType: email ? "implied_published" : "none",
            });
          }

          imported++;
        } catch (insertError) {
          console.error(`Error importing row ${i}:`, insertError);
          skipped++;
        }
      }

      res.json({
        success: true,
        imported,
        skipped,
        message: `Successfully imported ${imported} companies. Skipped ${skipped} rows.`,
      });
    } catch (error) {
      console.error("CSV import error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ============================================
  // Email Templates CRUD
  // ============================================
  
  app.get("/api/crm/email-templates", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!isSuperuser(req)) {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const templates = await db
        .select()
        .from(crmEmailTemplates)
        .orderBy(desc(crmEmailTemplates.createdAt));

      res.json({ templates });
    } catch (error) {
      console.error("Get email templates error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/crm/email-templates", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!isSuperuser(req)) {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const parseResult = insertCrmEmailTemplateSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid data", errors: parseResult.error.errors });
      }

      const [template] = await db.insert(crmEmailTemplates).values(parseResult.data).returning();
      res.status(201).json({ template });
    } catch (error) {
      console.error("Create email template error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/crm/email-templates/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!isSuperuser(req)) {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const { id } = req.params;
      const [template] = await db
        .update(crmEmailTemplates)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(crmEmailTemplates.id, parseInt(id)))
        .returning();

      res.json({ template });
    } catch (error) {
      console.error("Update email template error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/crm/email-templates/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      if (!isSuperuser(req)) {
        return res.status(403).json({ message: "Access denied. SuperUser only." });
      }

      const { id } = req.params;
      await db.delete(crmEmailTemplates).where(eq(crmEmailTemplates.id, parseInt(id)));
      res.json({ success: true });
    } catch (error) {
      console.error("Delete email template error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result;
}
