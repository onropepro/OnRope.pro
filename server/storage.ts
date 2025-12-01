import { db } from "./db";
import { users, clients, projects, customJobTypes, dropLogs, workSessions, nonBillableWorkSessions, complaints, complaintNotes, projectPhotos, jobComments, harnessInspections, toolboxMeetings, flhaForms, incidentReports, methodStatements, companyDocuments, payPeriodConfig, payPeriods, quotes, quoteServices, gearItems, gearAssignments, gearSerialNumbers, scheduledJobs, jobAssignments, userPreferences, propertyManagerCompanyLinks, irataTaskLogs, employeeTimeOff, documentReviewSignatures, equipmentDamageReports, featureRequests, featureRequestMessages, churnEvents } from "@shared/schema";
import type { User, InsertUser, Client, InsertClient, Project, InsertProject, CustomJobType, InsertCustomJobType, DropLog, InsertDropLog, WorkSession, InsertWorkSession, Complaint, InsertComplaint, ComplaintNote, InsertComplaintNote, ProjectPhoto, InsertProjectPhoto, JobComment, InsertJobComment, HarnessInspection, InsertHarnessInspection, ToolboxMeeting, InsertToolboxMeeting, FlhaForm, InsertFlhaForm, IncidentReport, InsertIncidentReport, MethodStatement, InsertMethodStatement, PayPeriodConfig, InsertPayPeriodConfig, PayPeriod, InsertPayPeriod, EmployeeHoursSummary, Quote, InsertQuote, QuoteService, InsertQuoteService, QuoteWithServices, GearItem, InsertGearItem, GearAssignment, InsertGearAssignment, GearSerialNumber, InsertGearSerialNumber, ScheduledJob, InsertScheduledJob, JobAssignment, InsertJobAssignment, ScheduledJobWithAssignments, UserPreferences, InsertUserPreferences, PropertyManagerCompanyLink, InsertPropertyManagerCompanyLink, IrataTaskLog, InsertIrataTaskLog, EmployeeTimeOff, InsertEmployeeTimeOff, DocumentReviewSignature, InsertDocumentReviewSignature, EquipmentDamageReport, InsertEquipmentDamageReport, FeatureRequest, InsertFeatureRequest, FeatureRequestMessage, InsertFeatureRequestMessage, FeatureRequestWithMessages, ChurnEvent, InsertChurnEvent } from "@shared/schema";
import { eq, and, or, desc, sql, isNull, isNotNull, not, gte, lte, between, inArray } from "drizzle-orm";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export class Storage {
  // User operations
  async getUserById(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async getUserByResidentCode(residentCode: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.residentCode, residentCode)).limit(1);
    return result[0];
  }

  async getUserByPropertyManagerCode(propertyManagerCode: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.propertyManagerCode, propertyManagerCode)).limit(1);
    return result[0];
  }

  async getUserByLicenseKey(licenseKey: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.licenseKey, licenseKey)).limit(1);
    return result[0];
  }

  async getUserByCompanyName(companyName: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.companyName, companyName)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(user.passwordHash, SALT_ROUNDS);
    
    const result = await db.insert(users).values({
      ...user,
      passwordHash: hashedPassword,
    }).returning();
    
    return result[0];
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async getAllEmployees(companyId: string): Promise<User[]> {
    // Get all employees created by this company (exclude residents and company owner)
    return db.select().from(users)
      .where(
        and(
          eq(users.companyId, companyId),
          not(eq(users.role, "resident")),
          not(eq(users.role, "company"))
        )
      )
      .orderBy(desc(users.createdAt));
  }

  async getAllCompanies(): Promise<User[]> {
    // Get all users with company role
    return db.select().from(users)
      .where(eq(users.role, "company"))
      .orderBy(desc(users.createdAt));
  }

  async deleteUser(userId: string): Promise<void> {
    await db.delete(users).where(eq(users.id, userId));
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const result = await db.update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    await db.update(users)
      .set({ passwordHash: hashedPassword })
      .where(eq(users.id, userId));
  }

  async updateUserEmail(userId: string, email: string): Promise<void> {
    await db.update(users)
      .set({ email })
      .where(eq(users.id, userId));
  }

  async updateUserName(userId: string, name: string): Promise<void> {
    await db.update(users)
      .set({ name })
      .where(eq(users.id, userId));
  }

  async getResidentsByStrataPlan(strataPlanNumber: string): Promise<User[]> {
    return db.select().from(users)
      .where(
        and(
          eq(users.role, "resident"),
          eq(users.strataPlanNumber, strataPlanNumber)
        )
      )
      .orderBy(users.email);
  }

  async getResidentsByCompany(companyId: string): Promise<User[]> {
    // Get only residents who have explicitly linked their account to this company
    return db.select().from(users)
      .where(
        and(
          eq(users.role, "resident"),
          eq(users.companyId, companyId)
        )
      )
      .orderBy(users.name);
  }

  // Client operations
  async createClient(client: InsertClient): Promise<Client> {
    const result = await db.insert(clients).values(client).returning();
    return result[0];
  }

  async getClientById(id: string): Promise<Client | undefined> {
    const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
    return result[0];
  }

  async getClientsByCompany(companyId: string): Promise<Client[]> {
    return db.select().from(clients)
      .where(eq(clients.companyId, companyId))
      .orderBy(desc(clients.createdAt));
  }

  async updateClient(id: string, updates: Partial<InsertClient>): Promise<Client> {
    const result = await db.update(clients)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(clients.id, id))
      .returning();
    return result[0];
  }

  async deleteClient(id: string): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  }

  // Project operations
  async createProject(project: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(project).returning();
    return result[0];
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result[0];
  }

  async getProjectsByCompany(companyId: string, status?: string): Promise<Project[]> {
    if (status) {
      return db.select().from(projects)
        .where(and(
          eq(projects.companyId, companyId), 
          eq(projects.status, status),
          eq(projects.deleted, false)
        ))
        .orderBy(desc(projects.createdAt));
    }
    return db.select().from(projects)
      .where(and(
        eq(projects.companyId, companyId),
        eq(projects.deleted, false)
      ))
      .orderBy(desc(projects.createdAt));
  }

  async getDeletedProjects(companyId: string): Promise<Project[]> {
    return db.select().from(projects)
      .where(and(
        eq(projects.companyId, companyId),
        eq(projects.deleted, true)
      ))
      .orderBy(desc(projects.updatedAt));
  }

  async getProjectByStrataPlan(strataPlanNumber: string): Promise<Project | undefined> {
    const result = await db.select().from(projects)
      .where(eq(projects.strataPlanNumber, strataPlanNumber))
      .limit(1);
    return result[0];
  }

  async getAllProjectsByStrataPlan(strataPlanNumber: string, status?: string): Promise<Project[]> {
    if (status) {
      return db.select().from(projects)
        .where(and(eq(projects.strataPlanNumber, strataPlanNumber), eq(projects.status, status)))
        .orderBy(desc(projects.createdAt));
    }
    return db.select().from(projects)
      .where(eq(projects.strataPlanNumber, strataPlanNumber))
      .orderBy(desc(projects.createdAt));
  }

  async getProjectsForPropertyManager(propertyManagerId: string, status?: string): Promise<Project[]> {
    // Get all company links for this property manager
    const links = await db.select()
      .from(propertyManagerCompanyLinks)
      .where(eq(propertyManagerCompanyLinks.propertyManagerId, propertyManagerId));
    
    if (links.length === 0) {
      return [];
    }
    
    // Get company IDs
    const companyIds = links.map(link => link.companyId);
    
    // Get all projects from all linked companies
    const allProjects: Project[] = [];
    for (const companyId of companyIds) {
      const companyProjects = await this.getProjectsByCompany(companyId, status);
      allProjects.push(...companyProjects);
    }
    
    // Sort by created date descending
    allProjects.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    
    return allProjects;
  }

  async getAllProjects(): Promise<Project[]> {
    return db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project> {
    const result = await db.update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return result[0];
  }

  async updateProjectStatus(id: string, status: string): Promise<Project> {
    const result = await db.update(projects)
      .set({ status, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return result[0];
  }

  async deleteProject(id: string): Promise<void> {
    // Soft delete - set deleted flag to true
    await db.update(projects)
      .set({ deleted: true, updatedAt: new Date() })
      .where(eq(projects.id, id));
  }

  async restoreProject(id: string): Promise<Project> {
    const result = await db.update(projects)
      .set({ deleted: false, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return result[0];
  }

  async permanentlyDeleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Custom job type operations
  async getCustomJobTypesByCompany(companyId: string): Promise<CustomJobType[]> {
    return db.select().from(customJobTypes)
      .where(eq(customJobTypes.companyId, companyId))
      .orderBy(customJobTypes.jobTypeName);
  }

  async createCustomJobType(jobType: InsertCustomJobType): Promise<CustomJobType> {
    const result = await db.insert(customJobTypes).values(jobType).returning();
    return result[0];
  }

  async getCustomJobTypeByName(companyId: string, jobTypeName: string): Promise<CustomJobType | undefined> {
    const result = await db.select().from(customJobTypes)
      .where(and(
        eq(customJobTypes.companyId, companyId),
        eq(customJobTypes.jobTypeName, jobTypeName)
      ))
      .limit(1);
    return result[0];
  }

  async deleteCustomJobType(id: string): Promise<void> {
    await db.delete(customJobTypes).where(eq(customJobTypes.id, id));
  }

  // Drop log operations
  async createDropLog(dropLog: InsertDropLog): Promise<DropLog> {
    const result = await db.insert(dropLogs).values(dropLog).returning();
    return result[0];
  }

  async getDropLogsByProject(projectId: string): Promise<DropLog[]> {
    return db.select().from(dropLogs)
      .where(eq(dropLogs.projectId, projectId))
      .orderBy(desc(dropLogs.date));
  }

  async getDropLogByProjectAndDate(projectId: string, userId: string, date: string): Promise<DropLog | undefined> {
    const result = await db.select().from(dropLogs)
      .where(and(
        eq(dropLogs.projectId, projectId),
        eq(dropLogs.userId, userId),
        eq(dropLogs.date, date)
      ))
      .limit(1);
    return result[0];
  }

  async getDropLogsByUserAndDate(userId: string, date: string): Promise<DropLog[]> {
    return db.select().from(dropLogs)
      .where(and(
        eq(dropLogs.userId, userId),
        eq(dropLogs.date, date)
      ))
      .orderBy(desc(dropLogs.createdAt));
  }

  async updateDropLog(
    id: string, 
    dropsCompletedNorth: number,
    dropsCompletedEast: number,
    dropsCompletedSouth: number,
    dropsCompletedWest: number
  ): Promise<DropLog> {
    const result = await db.update(dropLogs)
      .set({ 
        dropsCompletedNorth,
        dropsCompletedEast,
        dropsCompletedSouth,
        dropsCompletedWest,
        updatedAt: new Date() 
      })
      .where(eq(dropLogs.id, id))
      .returning();
    return result[0];
  }

  async getProjectProgress(projectId: string): Promise<{ 
    north: number;
    east: number;
    south: number;
    west: number;
    total: number;
  }> {
    // Get drops from drop_logs table - sum each elevation separately
    const dropLogsResult = await db.select({
      north: sql<number>`COALESCE(SUM(${dropLogs.dropsCompletedNorth}), 0)`,
      east: sql<number>`COALESCE(SUM(${dropLogs.dropsCompletedEast}), 0)`,
      south: sql<number>`COALESCE(SUM(${dropLogs.dropsCompletedSouth}), 0)`,
      west: sql<number>`COALESCE(SUM(${dropLogs.dropsCompletedWest}), 0)`,
    })
    .from(dropLogs)
    .where(eq(dropLogs.projectId, projectId));
    
    // Get drops from work_sessions table (ONLY completed sessions with endTime set)
    const workSessionsResult = await db.select({
      north: sql<number>`COALESCE(SUM(${workSessions.dropsCompletedNorth}), 0)`,
      east: sql<number>`COALESCE(SUM(${workSessions.dropsCompletedEast}), 0)`,
      south: sql<number>`COALESCE(SUM(${workSessions.dropsCompletedSouth}), 0)`,
      west: sql<number>`COALESCE(SUM(${workSessions.dropsCompletedWest}), 0)`,
    })
    .from(workSessions)
    .where(
      and(
        eq(workSessions.projectId, projectId),
        sql`${workSessions.endTime} IS NOT NULL`
      )
    );
    
    const dropLogsData = dropLogsResult[0] || { north: 0, east: 0, south: 0, west: 0 };
    const workSessionsData = workSessionsResult[0] || { north: 0, east: 0, south: 0, west: 0 };
    
    const north = Number(dropLogsData.north) + Number(workSessionsData.north);
    const east = Number(dropLogsData.east) + Number(workSessionsData.east);
    const south = Number(dropLogsData.south) + Number(workSessionsData.south);
    const west = Number(dropLogsData.west) + Number(workSessionsData.west);
    
    return {
      north,
      east,
      south,
      west,
      total: north + east + south + west
    };
  }

  // Complaint operations
  async createComplaint(complaint: InsertComplaint): Promise<Complaint> {
    const result = await db.insert(complaints).values(complaint).returning();
    return result[0];
  }

  async getComplaintById(id: string): Promise<Complaint | undefined> {
    const result = await db.select().from(complaints).where(eq(complaints.id, id)).limit(1);
    return result[0];
  }

  async getComplaintsByProject(projectId: string): Promise<Complaint[]> {
    return db.select().from(complaints)
      .where(eq(complaints.projectId, projectId))
      .orderBy(desc(complaints.createdAt));
  }

  async getAllComplaints(): Promise<Complaint[]> {
    return db.select().from(complaints).orderBy(desc(complaints.createdAt));
  }

  async getComplaintsForResident(residentId: string): Promise<any[]> {
    // Get complaints submitted by this resident
    const residentComplaints = await db.select().from(complaints)
      .where(eq(complaints.residentId, residentId))
      .orderBy(desc(complaints.createdAt));
    
    // Fetch notes for each complaint (only visible-to-resident notes)
    const complaintsWithNotes = await Promise.all(
      residentComplaints.map(async (complaint) => {
        const notes = await db.select().from(complaintNotes)
          .where(and(
            eq(complaintNotes.complaintId, complaint.id),
            eq(complaintNotes.visibleToResident, true)
          ))
          .orderBy(desc(complaintNotes.createdAt));
        
        return {
          ...complaint,
          notes
        };
      })
    );
    
    return complaintsWithNotes;
  }

  async getComplaintsForCompany(companyId: string): Promise<any[]> {
    // Get complaints for all projects belonging to this company, with project details
    const companyProjects = await db.select().from(projects)
      .where(eq(projects.companyId, companyId));
    
    const projectIds = companyProjects.map(p => p.id);
    
    if (projectIds.length === 0) {
      return [];
    }
    
    const complaintsList = await db.select({
      complaint: complaints,
      project: projects
    })
    .from(complaints)
    .leftJoin(projects, eq(complaints.projectId, projects.id))
    .where(sql`${complaints.projectId} IN (${sql.join(projectIds.map(id => sql`${id}`), sql`, `)})`)
    .orderBy(desc(complaints.createdAt));
    
    return complaintsList.map(row => ({
      ...row.complaint,
      strataPlanNumber: row.project?.strataPlanNumber,
      buildingName: row.project?.buildingName
    }));
  }

  async updateComplaintStatus(id: string, status: string): Promise<Complaint> {
    const result = await db.update(complaints)
      .set({ status, updatedAt: new Date() })
      .where(eq(complaints.id, id))
      .returning();
    return result[0];
  }

  async markComplaintAsViewed(id: string): Promise<Complaint> {
    const result = await db.update(complaints)
      .set({ viewedAt: new Date() })
      .where(and(
        eq(complaints.id, id),
        sql`${complaints.viewedAt} IS NULL` // Only set if not already viewed
      ))
      .returning();
    return result[0] || await this.getComplaintById(id) as Complaint;
  }

  async verifyComplaintAccess(complaintId: string, userId: string, userRole: string, userCompanyId?: string | null): Promise<boolean> {
    const complaint = await this.getComplaintById(complaintId);
    
    if (!complaint) {
      return false;
    }
    
    // Resident can only access their own complaints
    if (userRole === "resident") {
      return complaint.residentId === userId;
    }
    
    // Staff can only access complaints for their company's projects
    if (userRole === "company" || userRole === "operations_manager" || userRole === "supervisor" || userRole === "rope_access_tech") {
      const project = await this.getProjectById(complaint.projectId);
      if (!project) {
        return false;
      }
      
      const companyId = userRole === "company" ? userId : userCompanyId;
      return project.companyId === companyId;
    }
    
    return false;
  }

  async verifyProjectAccess(projectId: string, userId: string, userRole: string, userCompanyId?: string | null): Promise<boolean> {
    const project = await this.getProjectById(projectId);
    
    if (!project) {
      return false;
    }
    
    // Resident can access project if it matches their strata plan AND company (if linked)
    if (userRole === "resident") {
      const user = await this.getUserById(userId);
      const strataPlanMatches = user?.strataPlanNumber === project.strataPlanNumber;
      
      // If resident has linked their account to a company, also verify company matches
      if (user?.companyId) {
        return strataPlanMatches && project.companyId === user.companyId;
      }
      
      // If not linked to company, only check strata plan (legacy behavior)
      return strataPlanMatches;
    }
    
    // Property manager can access projects from any linked company
    if (userRole === "property_manager") {
      const links = await db.select()
        .from(propertyManagerCompanyLinks)
        .where(eq(propertyManagerCompanyLinks.propertyManagerId, userId));
      
      const linkedCompanyIds = links.map(link => link.companyId);
      return linkedCompanyIds.includes(project.companyId);
    }
    
    // Company/staff can only access their own projects
    if (userRole === "company") {
      return project.companyId === userId;
    }
    
    if (userRole === "operations_manager" || userRole === "supervisor" || userRole === "rope_access_tech") {
      return project.companyId === userCompanyId;
    }
    
    return false;
  }

  // Complaint note operations
  async createComplaintNote(note: InsertComplaintNote): Promise<ComplaintNote> {
    const result = await db.insert(complaintNotes).values(note).returning();
    return result[0];
  }

  async getNotesByComplaint(complaintId: string): Promise<ComplaintNote[]> {
    return db.select().from(complaintNotes)
      .where(eq(complaintNotes.complaintId, complaintId))
      .orderBy(complaintNotes.createdAt);
  }

  // Work session operations
  async startWorkSession(session: InsertWorkSession): Promise<WorkSession> {
    const result = await db.insert(workSessions).values(session).returning();
    return result[0];
  }

  async getActiveWorkSession(employeeId: string, projectId: string): Promise<WorkSession | undefined> {
    const result = await db.select().from(workSessions)
      .where(
        and(
          eq(workSessions.employeeId, employeeId),
          eq(workSessions.projectId, projectId),
          isNull(workSessions.endTime)
        )
      )
      .limit(1);
    return result[0];
  }

  async getWorkSessionById(sessionId: string): Promise<WorkSession | undefined> {
    const result = await db.select().from(workSessions)
      .where(eq(workSessions.id, sessionId))
      .limit(1);
    return result[0];
  }

  async getWorkSessionForCompany(sessionId: string, companyId: string): Promise<WorkSession | undefined> {
    // SECURITY: Company-scoped query that JOINs with projects to ensure session belongs to company
    const result = await db.select({
      id: workSessions.id,
      projectId: workSessions.projectId,
      employeeId: workSessions.employeeId,
      companyId: workSessions.companyId,
      workDate: workSessions.workDate,
      startTime: workSessions.startTime,
      endTime: workSessions.endTime,
      startLatitude: workSessions.startLatitude,
      startLongitude: workSessions.startLongitude,
      endLatitude: workSessions.endLatitude,
      endLongitude: workSessions.endLongitude,
      dropsCompletedNorth: workSessions.dropsCompletedNorth,
      dropsCompletedEast: workSessions.dropsCompletedEast,
      dropsCompletedSouth: workSessions.dropsCompletedSouth,
      dropsCompletedWest: workSessions.dropsCompletedWest,
      regularHours: workSessions.regularHours,
      overtimeHours: workSessions.overtimeHours,
      doubleTimeHours: workSessions.doubleTimeHours,
      shortfallReason: workSessions.shortfallReason,
      manualCompletionPercentage: workSessions.manualCompletionPercentage,
      isBillable: workSessions.isBillable,
      description: workSessions.description,
      createdAt: workSessions.createdAt,
      updatedAt: workSessions.updatedAt,
    })
    .from(workSessions)
    .innerJoin(projects, eq(workSessions.projectId, projects.id))
    .where(
      and(
        eq(workSessions.id, sessionId),
        eq(projects.companyId, companyId)
      )
    )
    .limit(1);
    
    return result[0];
  }

  async endWorkSession(
    sessionId: string, 
    dropsCompletedNorth: number,
    dropsCompletedEast: number,
    dropsCompletedSouth: number,
    dropsCompletedWest: number,
    shortfallReason?: string,
    endLatitude?: number | null,
    endLongitude?: number | null,
    regularHours?: number,
    overtimeHours?: number,
    doubleTimeHours?: number,
    manualCompletionPercentage?: number,
    peaceWorkPay?: number | null
  ): Promise<WorkSession> {
    const result = await db.update(workSessions)
      .set({
        endTime: sql`NOW()`,
        dropsCompletedNorth,
        dropsCompletedEast,
        dropsCompletedSouth,
        dropsCompletedWest,
        shortfallReason,
        endLatitude: endLatitude !== null && endLatitude !== undefined ? endLatitude.toString() : null,
        endLongitude: endLongitude !== null && endLongitude !== undefined ? endLongitude.toString() : null,
        regularHours: regularHours !== undefined ? regularHours.toString() : '0',
        overtimeHours: overtimeHours !== undefined ? overtimeHours.toString() : '0',
        doubleTimeHours: doubleTimeHours !== undefined ? doubleTimeHours.toString() : '0',
        manualCompletionPercentage: manualCompletionPercentage !== undefined ? manualCompletionPercentage : null,
        peaceWorkPay: peaceWorkPay !== null && peaceWorkPay !== undefined ? peaceWorkPay.toString() : null,
        updatedAt: sql`NOW()`,
      })
      .where(eq(workSessions.id, sessionId))
      .returning();
    return result[0];
  }

  async getWorkSessionsByProject(projectId: string, companyId: string): Promise<any[]> {
    const result = await db.select({
      id: workSessions.id,
      projectId: workSessions.projectId,
      employeeId: workSessions.employeeId,
      companyId: workSessions.companyId,
      workDate: workSessions.workDate,
      startTime: workSessions.startTime,
      endTime: workSessions.endTime,
      dropsCompletedNorth: workSessions.dropsCompletedNorth,
      dropsCompletedEast: workSessions.dropsCompletedEast,
      dropsCompletedSouth: workSessions.dropsCompletedSouth,
      dropsCompletedWest: workSessions.dropsCompletedWest,
      shortfallReason: workSessions.shortfallReason,
      startLatitude: workSessions.startLatitude,
      startLongitude: workSessions.startLongitude,
      endLatitude: workSessions.endLatitude,
      endLongitude: workSessions.endLongitude,
      manualCompletionPercentage: workSessions.manualCompletionPercentage,
      createdAt: workSessions.createdAt,
      updatedAt: workSessions.updatedAt,
      techName: users.name,
      techRole: users.role,
      techHourlyRate: users.hourlyRate,
    })
      .from(workSessions)
      .leftJoin(users, eq(workSessions.employeeId, users.id))
      .where(
        and(
          eq(workSessions.projectId, projectId),
          eq(workSessions.companyId, companyId)
        )
      )
      .orderBy(desc(workSessions.workDate), desc(workSessions.startTime));
    return result;
  }

  async getWorkSessionsByEmployee(employeeId: string, projectId: string): Promise<WorkSession[]> {
    return db.select().from(workSessions)
      .where(
        and(
          eq(workSessions.employeeId, employeeId),
          eq(workSessions.projectId, projectId)
        )
      )
      .orderBy(desc(workSessions.workDate));
  }

  async getWorkSessionsByCompany(companyId: string): Promise<WorkSession[]> {
    return db.select().from(workSessions)
      .where(eq(workSessions.companyId, companyId))
      .orderBy(desc(workSessions.workDate), desc(workSessions.startTime));
  }

  // Non-billable work session operations
  async createNonBillableWorkSession(session: any): Promise<any> {
    const result = await db.insert(nonBillableWorkSessions).values(session).returning();
    return result[0];
  }

  async getActiveNonBillableSession(employeeId: string): Promise<any | undefined> {
    const result = await db.select().from(nonBillableWorkSessions)
      .where(
        and(
          eq(nonBillableWorkSessions.employeeId, employeeId),
          isNull(nonBillableWorkSessions.endTime)
        )
      )
      .limit(1);
    return result[0];
  }

  async updateWorkSession(sessionId: string, updates: Partial<InsertWorkSession>): Promise<WorkSession> {
    const result = await db.update(workSessions)
      .set({
        ...updates,
        updatedAt: sql`NOW()`,
      })
      .where(eq(workSessions.id, sessionId))
      .returning();
    return result[0];
  }

  async deleteWorkSession(sessionId: string): Promise<void> {
    await db.delete(workSessions).where(eq(workSessions.id, sessionId));
  }

  async endNonBillableWorkSession(
    sessionId: string,
    regularHours?: number,
    overtimeHours?: number,
    doubleTimeHours?: number
  ): Promise<any> {
    const result = await db.update(nonBillableWorkSessions)
      .set({
        endTime: sql`NOW()`,
        regularHours: regularHours !== undefined ? regularHours.toString() : '0',
        overtimeHours: overtimeHours !== undefined ? overtimeHours.toString() : '0',
        doubleTimeHours: doubleTimeHours !== undefined ? doubleTimeHours.toString() : '0',
        updatedAt: sql`NOW()`,
      })
      .where(eq(nonBillableWorkSessions.id, sessionId))
      .returning();
    return result[0];
  }

  async updateNonBillableWorkSession(sessionId: string, updates: any): Promise<any> {
    const result = await db.update(nonBillableWorkSessions)
      .set({
        ...updates,
        updatedAt: sql`NOW()`,
      })
      .where(eq(nonBillableWorkSessions.id, sessionId))
      .returning();
    return result[0];
  }

  async deleteNonBillableWorkSession(sessionId: string): Promise<void> {
    await db.delete(nonBillableWorkSessions).where(eq(nonBillableWorkSessions.id, sessionId));
  }

  async getAllNonBillableSessions(companyId: string): Promise<any[]> {
    const result = await db.select({
      id: nonBillableWorkSessions.id,
      employeeId: nonBillableWorkSessions.employeeId,
      companyId: nonBillableWorkSessions.companyId,
      workDate: nonBillableWorkSessions.workDate,
      startTime: nonBillableWorkSessions.startTime,
      endTime: nonBillableWorkSessions.endTime,
      description: nonBillableWorkSessions.description,
      createdAt: nonBillableWorkSessions.createdAt,
      updatedAt: nonBillableWorkSessions.updatedAt,
      employeeName: users.name,
      employeeHourlyRate: users.hourlyRate,
    })
      .from(nonBillableWorkSessions)
      .leftJoin(users, eq(nonBillableWorkSessions.employeeId, users.id))
      .where(eq(nonBillableWorkSessions.companyId, companyId))
      .orderBy(desc(nonBillableWorkSessions.workDate), desc(nonBillableWorkSessions.startTime));
    return result;
  }

  async getNonBillableSessionsByEmployee(employeeId: string): Promise<any[]> {
    const result = await db.select({
      id: nonBillableWorkSessions.id,
      employeeId: nonBillableWorkSessions.employeeId,
      companyId: nonBillableWorkSessions.companyId,
      workDate: nonBillableWorkSessions.workDate,
      startTime: nonBillableWorkSessions.startTime,
      endTime: nonBillableWorkSessions.endTime,
      description: nonBillableWorkSessions.description,
      createdAt: nonBillableWorkSessions.createdAt,
      updatedAt: nonBillableWorkSessions.updatedAt,
      employeeName: users.name,
      employeeHourlyRate: users.hourlyRate,
    })
      .from(nonBillableWorkSessions)
      .leftJoin(users, eq(nonBillableWorkSessions.employeeId, users.id))
      .where(eq(nonBillableWorkSessions.employeeId, employeeId))
      .orderBy(desc(nonBillableWorkSessions.workDate), desc(nonBillableWorkSessions.startTime));
    return result;
  }

  async getNonBillableSessionById(sessionId: string): Promise<any | undefined> {
    const result = await db.select().from(nonBillableWorkSessions)
      .where(eq(nonBillableWorkSessions.id, sessionId))
      .limit(1);
    return result[0];
  }

  async createProjectPhoto(photo: InsertProjectPhoto): Promise<ProjectPhoto> {
    const result = await db.insert(projectPhotos).values(photo).returning();
    return result[0];
  }

  async getProjectPhotos(projectId: string): Promise<ProjectPhoto[]> {
    return db.select().from(projectPhotos)
      .where(eq(projectPhotos.projectId, projectId))
      .orderBy(desc(projectPhotos.createdAt));
  }

  async getPhotosByUnitNumber(unitNumber: string, companyId: string): Promise<any[]> {
    const result = await db.select({
      id: projectPhotos.id,
      projectId: projectPhotos.projectId,
      imageUrl: projectPhotos.imageUrl,
      unitNumber: projectPhotos.unitNumber,
      comment: projectPhotos.comment,
      createdAt: projectPhotos.createdAt,
      buildingName: projects.buildingName,
      buildingAddress: projects.buildingAddress,
    })
      .from(projectPhotos)
      .leftJoin(projects, eq(projectPhotos.projectId, projects.id))
      .where(
        and(
          eq(projectPhotos.unitNumber, unitNumber),
          eq(projectPhotos.companyId, companyId)
        )
      )
      .orderBy(desc(projectPhotos.createdAt));
    return result;
  }

  async getPhotosByUnitAndStrataPlan(unitNumber: string, strataPlanNumber: string, parkingStallNumber?: string): Promise<any[]> {
    const conditions = [
      eq(projectPhotos.unitNumber, unitNumber),
      eq(projectPhotos.missedUnitNumber, unitNumber),
      eq(projectPhotos.missedStallNumber, unitNumber)
    ];
    
    if (parkingStallNumber) {
      conditions.push(eq(projectPhotos.unitNumber, parkingStallNumber));
      conditions.push(eq(projectPhotos.missedStallNumber, parkingStallNumber));
    }
    
    const result = await db.select({
      id: projectPhotos.id,
      projectId: projectPhotos.projectId,
      imageUrl: projectPhotos.imageUrl,
      unitNumber: projectPhotos.unitNumber,
      comment: projectPhotos.comment,
      isMissedUnit: projectPhotos.isMissedUnit,
      missedUnitNumber: projectPhotos.missedUnitNumber,
      isMissedStall: projectPhotos.isMissedStall,
      missedStallNumber: projectPhotos.missedStallNumber,
      createdAt: projectPhotos.createdAt,
      buildingName: projects.buildingName,
      buildingAddress: projects.buildingAddress,
    })
      .from(projectPhotos)
      .leftJoin(projects, eq(projectPhotos.projectId, projects.id))
      .where(
        and(
          or(...conditions),
          eq(projects.strataPlanNumber, strataPlanNumber)
        )
      )
      .orderBy(desc(projectPhotos.createdAt));
    return result;
  }

  async deleteProjectPhoto(photoId: string): Promise<void> {
    await db.delete(projectPhotos).where(eq(projectPhotos.id, photoId));
  }

  // Job comment operations
  async createJobComment(comment: InsertJobComment): Promise<JobComment> {
    const result = await db.insert(jobComments).values(comment).returning();
    return result[0];
  }

  async getJobCommentsByProject(projectId: string): Promise<JobComment[]> {
    return db.select().from(jobComments)
      .where(eq(jobComments.projectId, projectId))
      .orderBy(desc(jobComments.createdAt));
  }

  // Harness inspection operations
  async createHarnessInspection(inspection: InsertHarnessInspection): Promise<HarnessInspection> {
    const result = await db.insert(harnessInspections).values(inspection).returning();
    return result[0];
  }

  async getHarnessInspectionsByCompany(companyId: string): Promise<HarnessInspection[]> {
    return db.select().from(harnessInspections)
      .where(eq(harnessInspections.companyId, companyId))
      .orderBy(desc(harnessInspections.inspectionDate), desc(harnessInspections.createdAt));
  }

  async getHarnessInspectionsByWorker(workerId: string): Promise<HarnessInspection[]> {
    return db.select().from(harnessInspections)
      .where(eq(harnessInspections.workerId, workerId))
      .orderBy(desc(harnessInspections.inspectionDate));
  }

  async getHarnessInspectionsByProject(projectId: string): Promise<HarnessInspection[]> {
    return db.select().from(harnessInspections)
      .where(eq(harnessInspections.projectId, projectId))
      .orderBy(desc(harnessInspections.inspectionDate));
  }

  // Gear items operations
  async createGearItem(item: InsertGearItem, serialEntries?: Array<{serialNumber: string, dateOfManufacture?: string, dateInService?: string}>): Promise<GearItem & { serialEntries: GearSerialNumber[] }> {
    const result = await db.insert(gearItems).values(item).returning();
    const gearItem = result[0];
    
    // Save serial entries to gearSerialNumbers table
    const savedSerialEntries: GearSerialNumber[] = [];
    if (serialEntries && serialEntries.length > 0) {
      for (const entry of serialEntries) {
        if (entry.serialNumber) {
          const serialData = {
            gearItemId: gearItem.id,
            companyId: item.companyId,
            serialNumber: entry.serialNumber,
            dateOfManufacture: entry.dateOfManufacture || undefined,
            dateInService: entry.dateInService || undefined,
          };
          const [savedEntry] = await db.insert(gearSerialNumbers)
            .values(serialData)
            .returning();
          savedSerialEntries.push(savedEntry);
        }
      }
    }
    
    return { ...gearItem, serialEntries: savedSerialEntries };
  }

  async getGearItemsByCompany(companyId: string): Promise<(GearItem & { serialEntries: GearSerialNumber[] })[]> {
    const items = await db.select().from(gearItems)
      .where(eq(gearItems.companyId, companyId))
      .orderBy(desc(gearItems.createdAt));
    
    // Fetch serial entries for all items
    if (items.length === 0) return [];
    
    const itemIds = items.map(item => item.id);
    const allSerialEntries = await db.select()
      .from(gearSerialNumbers)
      .where(inArray(gearSerialNumbers.gearItemId, itemIds));
    
    // Group serial entries by gearItemId
    const serialEntriesByItem: Record<string, GearSerialNumber[]> = {};
    for (const entry of allSerialEntries) {
      if (!serialEntriesByItem[entry.gearItemId]) {
        serialEntriesByItem[entry.gearItemId] = [];
      }
      serialEntriesByItem[entry.gearItemId].push(entry);
    }
    
    // Attach serial entries to each item
    return items.map(item => ({
      ...item,
      serialEntries: serialEntriesByItem[item.id] || [],
    }));
  }

  async getGearItemsByEmployee(employeeId: string): Promise<GearItem[]> {
    return db.select().from(gearItems)
      .where(eq(gearItems.employeeId, employeeId))
      .orderBy(desc(gearItems.createdAt));
  }

  async getGearItemById(id: string): Promise<GearItem | undefined> {
    const results = await db.select().from(gearItems).where(eq(gearItems.id, id));
    return results[0];
  }

  async updateGearItem(id: string, updates: Partial<InsertGearItem>): Promise<GearItem> {
    const result = await db.update(gearItems)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(gearItems.id, id))
      .returning();
    return result[0];
  }

  async deleteGearItem(id: string): Promise<void> {
    await db.delete(gearItems).where(eq(gearItems.id, id));
  }

  // Gear assignment operations
  async createGearAssignment(assignment: { 
    gearItemId: string; 
    companyId: string; 
    employeeId: string; 
    quantity: number; 
    serialNumber?: string;
    dateOfManufacture?: string;
    dateInService?: string;
  }): Promise<any> {
    const result = await db.insert(gearAssignments).values(assignment).returning();
    return result[0];
  }
  
  async updateGearAssignment(id: string, updates: { 
    quantity?: number; 
    serialNumber?: string;
    dateOfManufacture?: string;
    dateInService?: string;
  }): Promise<any> {
    const result = await db.update(gearAssignments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(gearAssignments.id, id))
      .returning();
    return result[0];
  }

  async deleteGearAssignment(id: string): Promise<void> {
    await db.delete(gearAssignments).where(eq(gearAssignments.id, id));
  }

  async updateHarnessInspection(id: string, pdfUrl: string): Promise<HarnessInspection> {
    const result = await db.update(harnessInspections)
      .set({ pdfUrl })
      .where(eq(harnessInspections.id, id))
      .returning();
    return result[0];
  }

  async deleteHarnessInspection(id: string): Promise<void> {
    await db.delete(harnessInspections).where(eq(harnessInspections.id, id));
  }

  // Toolbox meeting operations
  async createToolboxMeeting(meeting: InsertToolboxMeeting): Promise<ToolboxMeeting> {
    const result = await db.insert(toolboxMeetings).values(meeting).returning();
    return result[0];
  }

  async getToolboxMeetingsByCompany(companyId: string): Promise<ToolboxMeeting[]> {
    return db.select().from(toolboxMeetings)
      .where(eq(toolboxMeetings.companyId, companyId))
      .orderBy(desc(toolboxMeetings.meetingDate), desc(toolboxMeetings.createdAt));
  }

  async getToolboxMeetingsByProject(projectId: string): Promise<ToolboxMeeting[]> {
    return db.select().from(toolboxMeetings)
      .where(eq(toolboxMeetings.projectId, projectId))
      .orderBy(desc(toolboxMeetings.meetingDate));
  }

  async updateToolboxMeeting(id: string, pdfUrl: string): Promise<ToolboxMeeting> {
    const result = await db.update(toolboxMeetings)
      .set({ pdfUrl })
      .where(eq(toolboxMeetings.id, id))
      .returning();
    return result[0];
  }

  async deleteToolboxMeeting(id: string): Promise<void> {
    await db.delete(toolboxMeetings).where(eq(toolboxMeetings.id, id));
  }

  // FLHA form operations
  async createFlhaForm(flha: InsertFlhaForm): Promise<FlhaForm> {
    const result = await db.insert(flhaForms).values(flha).returning();
    return result[0];
  }

  async getFlhaFormsByCompany(companyId: string): Promise<FlhaForm[]> {
    return db.select().from(flhaForms)
      .where(eq(flhaForms.companyId, companyId))
      .orderBy(desc(flhaForms.assessmentDate), desc(flhaForms.createdAt));
  }

  async getFlhaFormsByProject(projectId: string): Promise<FlhaForm[]> {
    return db.select().from(flhaForms)
      .where(eq(flhaForms.projectId, projectId))
      .orderBy(desc(flhaForms.assessmentDate));
  }

  async updateFlhaForm(id: string, pdfUrl: string): Promise<FlhaForm> {
    const result = await db.update(flhaForms)
      .set({ pdfUrl })
      .where(eq(flhaForms.id, id))
      .returning();
    return result[0];
  }

  async deleteFlhaForm(id: string): Promise<void> {
    await db.delete(flhaForms).where(eq(flhaForms.id, id));
  }

  // Incident report operations
  async createIncidentReport(report: InsertIncidentReport): Promise<IncidentReport> {
    const result = await db.insert(incidentReports).values(report).returning();
    return result[0];
  }

  async getIncidentReportsByCompany(companyId: string): Promise<IncidentReport[]> {
    return db.select().from(incidentReports)
      .where(eq(incidentReports.companyId, companyId))
      .orderBy(desc(incidentReports.incidentDate), desc(incidentReports.createdAt));
  }

  async getIncidentReportById(id: string): Promise<IncidentReport | undefined> {
    const result = await db.select().from(incidentReports).where(eq(incidentReports.id, id));
    return result[0];
  }

  async updateIncidentReport(id: string, updates: Partial<InsertIncidentReport>): Promise<IncidentReport> {
    const result = await db.update(incidentReports)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(incidentReports.id, id))
      .returning();
    return result[0];
  }

  async deleteIncidentReport(id: string): Promise<void> {
    await db.delete(incidentReports).where(eq(incidentReports.id, id));
  }

  // Method statement operations
  async createMethodStatement(statement: InsertMethodStatement): Promise<MethodStatement> {
    const result = await db.insert(methodStatements).values(statement).returning();
    return result[0];
  }

  async getMethodStatementsByCompany(companyId: string): Promise<any[]> {
    const results = await db.select({
      statement: methodStatements,
      preparer: users,
    })
      .from(methodStatements)
      .leftJoin(users, eq(methodStatements.preparedById, users.id))
      .where(eq(methodStatements.companyId, companyId))
      .orderBy(desc(methodStatements.dateCreated), desc(methodStatements.createdAt));
    
    return results.map(({ statement, preparer }) => {
      // Parse JSON array fields if they're strings
      const parseArrayField = (field: any): string[] => {
        if (!field) return [];
        if (Array.isArray(field)) return field;
        if (typeof field === 'string') {
          // Handle Postgres array literal: {item1,item2} → ["item1","item2"]
          if (field.startsWith('{') && field.endsWith('}')) {
            const items = field.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean);
            return items;
          }
          // Handle JSON array: ["item1","item2"] → JavaScript array
          try {
            const parsed = JSON.parse(field);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        }
        return [];
      };

      // Parse JSONB fields (signatures, complex objects)
      const parseJsonField = (field: any) => {
        if (!field) return null;
        if (typeof field === 'object') return field; // Already parsed by Drizzle
        if (typeof field === 'string') {
          try {
            return JSON.parse(field);
          } catch {
            return null;
          }
        }
        return null;
      };

      // Return clean DTO with only UI-needed fields (exclude raw DB bookkeeping like preparedById, createdAt, updatedAt)
      return {
        id: statement.id,
        projectId: statement.projectId,
        dateCreated: statement.dateCreated,
        preparedByName: preparer?.name || 'Unknown',
        jobTitle: statement.jobTitle || preparer?.jobTitle || '',
        location: statement.location,
        workDescription: statement.workDescription,
        scopeDetails: statement.scopeDetails,
        workDuration: statement.workDuration,
        numberOfWorkers: statement.numberOfWorkers,
        hazardsIdentified: parseArrayField(statement.hazardsIdentified),
        controlMeasures: parseArrayField(statement.controlMeasures),
        requiredEquipment: parseArrayField(statement.requiredEquipment),
        requiredPpe: parseArrayField(statement.requiredPpe),
        emergencyProcedures: statement.emergencyProcedures,
        rescuePlan: statement.rescuePlan,
        emergencyContacts: statement.emergencyContacts,
        permitsRequired: parseArrayField(statement.permitsRequired),
        weatherRestrictions: statement.weatherRestrictions,
        workingHeightRange: statement.workingHeightRange,
        accessMethod: statement.accessMethod,
        competencyRequirements: parseArrayField(statement.competencyRequirements),
        irataLevelRequired: statement.irataLevelRequired,
        communicationMethod: statement.communicationMethod,
        signalProtocol: statement.signalProtocol,
        teamMembers: parseArrayField(statement.teamMembers),
        reviewedByName: statement.reviewedByName,
        reviewDate: statement.reviewDate,
        approvedByName: statement.approvedByName,
        approvalDate: statement.approvalDate,
        signatures: parseJsonField(statement.signatures) || [],
        status: statement.status,
      };
    });
  }

  async getMethodStatementsByProject(projectId: string): Promise<MethodStatement[]> {
    return db.select().from(methodStatements)
      .where(eq(methodStatements.projectId, projectId))
      .orderBy(desc(methodStatements.dateCreated));
  }

  async getMethodStatementById(id: string): Promise<MethodStatement | undefined> {
    const result = await db.select().from(methodStatements).where(eq(methodStatements.id, id));
    return result[0];
  }

  async updateMethodStatement(id: string, updates: Partial<InsertMethodStatement>): Promise<MethodStatement> {
    const result = await db.update(methodStatements)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(methodStatements.id, id))
      .returning();
    return result[0];
  }

  async deleteMethodStatement(id: string): Promise<void> {
    await db.delete(methodStatements).where(eq(methodStatements.id, id));
  }

  // Document Review Signature operations
  async createDocumentReviewSignature(signature: InsertDocumentReviewSignature): Promise<DocumentReviewSignature> {
    const result = await db.insert(documentReviewSignatures).values(signature).returning();
    return result[0];
  }

  async getDocumentReviewSignaturesByEmployee(employeeId: string): Promise<DocumentReviewSignature[]> {
    return db.select().from(documentReviewSignatures)
      .where(eq(documentReviewSignatures.employeeId, employeeId))
      .orderBy(desc(documentReviewSignatures.createdAt));
  }

  async getDocumentReviewSignaturesByCompany(companyId: string): Promise<(DocumentReviewSignature & { employeeName: string })[]> {
    const results = await db.select({
      id: documentReviewSignatures.id,
      companyId: documentReviewSignatures.companyId,
      employeeId: documentReviewSignatures.employeeId,
      documentType: documentReviewSignatures.documentType,
      documentId: documentReviewSignatures.documentId,
      documentName: documentReviewSignatures.documentName,
      fileUrl: documentReviewSignatures.fileUrl,
      viewedAt: documentReviewSignatures.viewedAt,
      signedAt: documentReviewSignatures.signedAt,
      signatureDataUrl: documentReviewSignatures.signatureDataUrl,
      documentVersion: documentReviewSignatures.documentVersion,
      createdAt: documentReviewSignatures.createdAt,
      updatedAt: documentReviewSignatures.updatedAt,
      employeeName: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.email})`.as('employee_name'),
    })
      .from(documentReviewSignatures)
      .leftJoin(users, eq(documentReviewSignatures.employeeId, users.id))
      .where(eq(documentReviewSignatures.companyId, companyId))
      .orderBy(desc(documentReviewSignatures.createdAt));
    
    return results;
  }

  async getDocumentReviewSignature(employeeId: string, documentType: string, documentId?: string): Promise<DocumentReviewSignature | undefined> {
    const conditions = [
      eq(documentReviewSignatures.employeeId, employeeId),
      eq(documentReviewSignatures.documentType, documentType),
    ];
    if (documentId) {
      conditions.push(eq(documentReviewSignatures.documentId, documentId));
    } else {
      conditions.push(isNull(documentReviewSignatures.documentId));
    }
    const result = await db.select().from(documentReviewSignatures)
      .where(and(...conditions))
      .limit(1);
    return result[0];
  }

  async getDocumentReviewSignatureById(id: string): Promise<DocumentReviewSignature | undefined> {
    const result = await db.select().from(documentReviewSignatures)
      .where(eq(documentReviewSignatures.id, id))
      .limit(1);
    return result[0];
  }

  async updateDocumentReviewSignature(id: string, updates: Partial<InsertDocumentReviewSignature>): Promise<DocumentReviewSignature> {
    const result = await db.update(documentReviewSignatures)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(documentReviewSignatures.id, id))
      .returning();
    return result[0];
  }

  async markDocumentViewed(employeeId: string, documentType: string, documentId?: string): Promise<DocumentReviewSignature> {
    const existing = await this.getDocumentReviewSignature(employeeId, documentType, documentId);
    if (existing) {
      if (!existing.viewedAt) {
        return this.updateDocumentReviewSignature(existing.id, { viewedAt: new Date() });
      }
      return existing;
    }
    throw new Error("Document review signature not found");
  }

  async signDocument(id: string, signatureDataUrl: string): Promise<DocumentReviewSignature> {
    return this.updateDocumentReviewSignature(id, {
      signedAt: new Date(),
      signatureDataUrl,
    });
  }

  async getUnsignedDocumentsForEmployee(employeeId: string): Promise<DocumentReviewSignature[]> {
    return db.select().from(documentReviewSignatures)
      .where(and(
        eq(documentReviewSignatures.employeeId, employeeId),
        isNull(documentReviewSignatures.signedAt)
      ))
      .orderBy(desc(documentReviewSignatures.createdAt));
  }

  async getSignedDocumentsForEmployee(employeeId: string): Promise<DocumentReviewSignature[]> {
    return db.select().from(documentReviewSignatures)
      .where(and(
        eq(documentReviewSignatures.employeeId, employeeId),
        isNotNull(documentReviewSignatures.signedAt)
      ))
      .orderBy(desc(documentReviewSignatures.signedAt));
  }

  async enrollEmployeeInDocumentReviews(companyId: string, employeeId: string, documents: { type: string; id?: string; name: string; version?: string; fileUrl?: string }[]): Promise<DocumentReviewSignature[]> {
    const results: DocumentReviewSignature[] = [];
    for (const doc of documents) {
      const existing = await this.getDocumentReviewSignature(employeeId, doc.type, doc.id);
      if (!existing) {
        const signature = await this.createDocumentReviewSignature({
          companyId,
          employeeId,
          documentType: doc.type,
          documentId: doc.id || null,
          documentName: doc.name,
          documentVersion: doc.version || null,
          fileUrl: doc.fileUrl || null,
        });
        results.push(signature);
      } else {
        results.push(existing);
      }
    }
    return results;
  }

  async deleteDocumentReviewSignature(id: string): Promise<void> {
    await db.delete(documentReviewSignatures).where(eq(documentReviewSignatures.id, id));
  }

  // Company documents operations
  async createCompanyDocument(document: any): Promise<any> {
    const result = await db.insert(companyDocuments).values(document).returning();
    return result[0];
  }

  async getCompanyDocuments(companyId: string): Promise<any[]> {
    return db.select().from(companyDocuments)
      .where(eq(companyDocuments.companyId, companyId))
      .orderBy(desc(companyDocuments.createdAt));
  }

  async getCompanyDocumentsByType(companyId: string, documentType: string): Promise<any[]> {
    return db.select().from(companyDocuments)
      .where(and(
        eq(companyDocuments.companyId, companyId),
        eq(companyDocuments.documentType, documentType)
      ))
      .orderBy(desc(companyDocuments.createdAt));
  }

  async deleteCompanyDocument(id: string): Promise<void> {
    await db.delete(companyDocuments).where(eq(companyDocuments.id, id));
  }

  async getCompanyDocumentByTemplateId(companyId: string, templateId: string): Promise<any | undefined> {
    const result = await db.select().from(companyDocuments)
      .where(and(
        eq(companyDocuments.companyId, companyId),
        eq(companyDocuments.templateId, templateId)
      ));
    return result[0];
  }

  async deleteDocumentReviewsByDocumentId(documentId: string): Promise<void> {
    await db.delete(documentReviewSignatures)
      .where(eq(documentReviewSignatures.documentId, documentId));
  }

  // Pay period configuration operations
  async getPayPeriodConfig(companyId: string): Promise<PayPeriodConfig | undefined> {
    const result = await db.select().from(payPeriodConfig)
      .where(eq(payPeriodConfig.companyId, companyId))
      .limit(1);
    return result[0];
  }

  async createPayPeriodConfig(config: InsertPayPeriodConfig): Promise<PayPeriodConfig> {
    const result = await db.insert(payPeriodConfig).values(config).returning();
    return result[0];
  }

  async updatePayPeriodConfig(companyId: string, updates: Partial<InsertPayPeriodConfig>): Promise<PayPeriodConfig> {
    const result = await db.update(payPeriodConfig)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(payPeriodConfig.companyId, companyId))
      .returning();
    return result[0];
  }

  async upsertPayPeriodConfig(config: InsertPayPeriodConfig): Promise<PayPeriodConfig> {
    // Check if config exists
    const existing = await this.getPayPeriodConfig(config.companyId);
    if (existing) {
      return this.updatePayPeriodConfig(config.companyId, config);
    } else {
      return this.createPayPeriodConfig(config);
    }
  }

  // Pay periods operations
  async createPayPeriod(period: InsertPayPeriod): Promise<PayPeriod> {
    const result = await db.insert(payPeriods).values(period).returning();
    return result[0];
  }

  async getPayPeriodsByCompany(companyId: string): Promise<PayPeriod[]> {
    return db.select().from(payPeriods)
      .where(eq(payPeriods.companyId, companyId))
      .orderBy(desc(payPeriods.startDate));
  }

  async getPayPeriodById(id: string): Promise<PayPeriod | undefined> {
    const result = await db.select().from(payPeriods)
      .where(eq(payPeriods.id, id))
      .limit(1);
    return result[0];
  }

  async updatePayPeriodStatus(id: string, status: string): Promise<PayPeriod> {
    const result = await db.update(payPeriods)
      .set({ status })
      .where(eq(payPeriods.id, id))
      .returning();
    return result[0];
  }

  async getCurrentPayPeriod(companyId: string): Promise<PayPeriod | undefined> {
    const today = new Date().toISOString().split('T')[0];
    const result = await db.select().from(payPeriods)
      .where(
        and(
          eq(payPeriods.companyId, companyId),
          lte(payPeriods.startDate, today),
          gte(payPeriods.endDate, today)
        )
      )
      .limit(1);
    return result[0];
  }

  async deleteAllPayPeriodsForCompany(companyId: string): Promise<void> {
    await db.delete(payPeriods)
      .where(eq(payPeriods.companyId, companyId));
  }

  // Get employee hours summary for a pay period
  async getEmployeeHoursForPayPeriod(companyId: string, startDate: string, endDate: string): Promise<EmployeeHoursSummary[]> {
    // Get all work sessions within the pay period
    const sessions = await db
      .select({
        sessionId: workSessions.id,
        employeeId: workSessions.employeeId,
        projectId: workSessions.projectId,
        startTime: workSessions.startTime,
        endTime: workSessions.endTime,
        workDate: workSessions.workDate,
        regularHours: workSessions.regularHours,
        overtimeHours: workSessions.overtimeHours,
        doubleTimeHours: workSessions.doubleTimeHours,
        employeeName: users.name,
        hourlyRate: users.hourlyRate,
        projectName: projects.buildingName,
        peaceWorkPay: workSessions.peaceWorkPay,
        projectPeaceWork: projects.peaceWork,
      })
      .from(workSessions)
      .leftJoin(users, eq(workSessions.employeeId, users.id))
      .leftJoin(projects, eq(workSessions.projectId, projects.id))
      .where(
        and(
          eq(workSessions.companyId, companyId),
          gte(workSessions.workDate, startDate),
          lte(workSessions.workDate, endDate),
          not(isNull(workSessions.endTime))
        )
      )
      .orderBy(workSessions.employeeId, workSessions.workDate);

    // Get all non-billable work sessions within the pay period
    const nonBillableSessions = await db
      .select({
        sessionId: nonBillableWorkSessions.id,
        employeeId: nonBillableWorkSessions.employeeId,
        startTime: nonBillableWorkSessions.startTime,
        endTime: nonBillableWorkSessions.endTime,
        workDate: nonBillableWorkSessions.workDate,
        regularHours: nonBillableWorkSessions.regularHours,
        overtimeHours: nonBillableWorkSessions.overtimeHours,
        doubleTimeHours: nonBillableWorkSessions.doubleTimeHours,
        description: nonBillableWorkSessions.description,
        employeeName: users.name,
        hourlyRate: users.hourlyRate,
      })
      .from(nonBillableWorkSessions)
      .leftJoin(users, eq(nonBillableWorkSessions.employeeId, users.id))
      .where(
        and(
          eq(nonBillableWorkSessions.companyId, companyId),
          gte(nonBillableWorkSessions.workDate, startDate),
          lte(nonBillableWorkSessions.workDate, endDate),
          not(isNull(nonBillableWorkSessions.endTime))
        )
      )
      .orderBy(nonBillableWorkSessions.employeeId, nonBillableWorkSessions.workDate);

    // Group by employee and calculate totals
    const employeeMap = new Map<string, EmployeeHoursSummary>();

    // Process billable sessions
    for (const session of sessions) {
      if (!session.employeeId || !session.employeeName || !session.startTime || !session.endTime) continue;

      const hours = (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60 * 60);
      const rate = parseFloat(session.hourlyRate || '0');
      
      // For peace work sessions, use peaceWorkPay instead of hours * rate
      const isPeaceWork = session.projectPeaceWork && session.peaceWorkPay;
      const sessionPay = isPeaceWork ? parseFloat(session.peaceWorkPay || '0') : hours * rate;

      if (!employeeMap.has(session.employeeId)) {
        employeeMap.set(session.employeeId, {
          employeeId: session.employeeId,
          employeeName: session.employeeName,
          hourlyRate: session.hourlyRate || '0',
          totalHours: 0,
          regularHours: 0,
          overtimeHours: 0,
          doubleTimeHours: 0,
          totalPay: 0,
          sessions: [],
        });
      }

      const summary = employeeMap.get(session.employeeId)!;
      const regularHrs = parseFloat(session.regularHours || '0');
      const overtimeHrs = parseFloat(session.overtimeHours || '0');
      const doubleTimeHrs = parseFloat(session.doubleTimeHours || '0');
      
      summary.totalHours += hours;
      summary.regularHours += regularHrs;
      summary.overtimeHours += overtimeHrs;
      summary.doubleTimeHours += doubleTimeHrs;
      summary.totalPay += sessionPay;
      summary.sessions.push({
        id: session.sessionId,
        projectId: session.projectId,
        employeeId: session.employeeId,
        companyId: companyId,
        workDate: session.workDate,
        startTime: session.startTime,
        endTime: session.endTime,
        dropsCompletedNorth: 0,
        dropsCompletedEast: 0,
        dropsCompletedSouth: 0,
        dropsCompletedWest: 0,
        shortfallReason: null,
        regularHours: session.regularHours,
        overtimeHours: session.overtimeHours,
        doubleTimeHours: session.doubleTimeHours,
        createdAt: new Date(),
        updatedAt: new Date(),
        projectName: session.projectName || 'Unknown Project',
      } as any);
    }

    // Process non-billable sessions
    for (const session of nonBillableSessions) {
      if (!session.employeeId || !session.employeeName || !session.startTime || !session.endTime) continue;

      const hours = (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60 * 60);
      const rate = parseFloat(session.hourlyRate || '0');

      if (!employeeMap.has(session.employeeId)) {
        employeeMap.set(session.employeeId, {
          employeeId: session.employeeId,
          employeeName: session.employeeName,
          hourlyRate: session.hourlyRate || '0',
          totalHours: 0,
          regularHours: 0,
          overtimeHours: 0,
          doubleTimeHours: 0,
          totalPay: 0,
          sessions: [],
        });
      }

      const summary = employeeMap.get(session.employeeId)!;
      const regularHrs = parseFloat(session.regularHours || '0');
      const overtimeHrs = parseFloat(session.overtimeHours || '0');
      const doubleTimeHrs = parseFloat(session.doubleTimeHours || '0');
      
      summary.totalHours += hours;
      summary.regularHours += regularHrs;
      summary.overtimeHours += overtimeHrs;
      summary.doubleTimeHours += doubleTimeHrs;
      summary.totalPay += hours * rate;
      summary.sessions.push({
        id: session.sessionId,
        projectId: null,
        employeeId: session.employeeId,
        companyId: companyId,
        workDate: session.workDate,
        startTime: session.startTime,
        endTime: session.endTime,
        dropsCompletedNorth: 0,
        dropsCompletedEast: 0,
        dropsCompletedSouth: 0,
        dropsCompletedWest: 0,
        shortfallReason: null,
        regularHours: session.regularHours,
        overtimeHours: session.overtimeHours,
        doubleTimeHours: session.doubleTimeHours,
        createdAt: new Date(),
        updatedAt: new Date(),
        projectName: `Non-Billable: ${session.description || 'Other'}`,
      } as any);
    }

    return Array.from(employeeMap.values());
  }

  // Generate pay periods for a company based on their configuration
  async generatePayPeriods(companyId: string, numberOfPeriods: number = 6): Promise<PayPeriod[]> {
    const config = await this.getPayPeriodConfig(companyId);
    if (!config) {
      throw new Error('Pay period configuration not found for company');
    }

    const periods: InsertPayPeriod[] = [];
    const today = new Date();

    if (config.periodType === 'semi-monthly') {
      const firstDay = config.firstPayDay || 1;
      const secondDay = config.secondPayDay || 15;
      
      for (let i = 0; i < numberOfPeriods; i++) {
        const monthOffset = Math.floor(i / 2);
        const isFirstPeriod = i % 2 === 0;
        
        const year = today.getFullYear();
        const month = today.getMonth() + monthOffset;
        
        const startDate = new Date(year, month, isFirstPeriod ? firstDay : secondDay);
        const endDate = new Date(year, month, isFirstPeriod ? secondDay - 1 : 0); // 0 = last day of previous month
        if (!isFirstPeriod) {
          endDate.setMonth(month + 1);
          endDate.setDate(firstDay - 1);
        }
        
        periods.push({
          companyId,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          status: startDate > today ? 'upcoming' : (endDate < today ? 'past' : 'current'),
        });
      }
    } else if (config.periodType === 'weekly') {
      const dayOfWeek = config.startDayOfWeek || 0; // Default to Sunday
      
      // Find the most recent occurrence of the start day
      let startDate = new Date(today);
      while (startDate.getDay() !== dayOfWeek) {
        startDate.setDate(startDate.getDate() - 1);
      }
      
      for (let i = 0; i < numberOfPeriods; i++) {
        const periodStart = new Date(startDate);
        periodStart.setDate(startDate.getDate() + (i * 7));
        
        const periodEnd = new Date(periodStart);
        periodEnd.setDate(periodStart.getDate() + 6);
        
        periods.push({
          companyId,
          startDate: periodStart.toISOString().split('T')[0],
          endDate: periodEnd.toISOString().split('T')[0],
          status: periodStart > today ? 'upcoming' : (periodEnd < today ? 'past' : 'current'),
        });
      }
    } else if (config.periodType === 'bi-weekly') {
      const anchorDate = config.biWeeklyAnchorDate ? new Date(config.biWeeklyAnchorDate) : new Date();
      
      // Calculate weeks since anchor date
      const weeksSinceAnchor = Math.floor((today.getTime() - anchorDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
      const periodsFromAnchor = Math.floor(weeksSinceAnchor / 2);
      
      for (let i = 0; i < numberOfPeriods; i++) {
        const periodStart = new Date(anchorDate);
        periodStart.setDate(anchorDate.getDate() + ((periodsFromAnchor + i) * 14));
        
        const periodEnd = new Date(periodStart);
        periodEnd.setDate(periodStart.getDate() + 13);
        
        periods.push({
          companyId,
          startDate: periodStart.toISOString().split('T')[0],
          endDate: periodEnd.toISOString().split('T')[0],
          status: periodStart > today ? 'upcoming' : (periodEnd < today ? 'past' : 'current'),
        });
      }
    } else if (config.periodType === 'monthly') {
      const startDay = config.monthlyStartDay || 1;
      const endDay = config.monthlyEndDay || 31;
      
      for (let i = 0; i < numberOfPeriods; i++) {
        const year = today.getFullYear();
        const month = today.getMonth() + i;
        
        const startDate = new Date(year, month, startDay);
        
        // For end date, handle month transitions
        let endDate: Date;
        if (endDay < startDay) {
          // Period spans into next month
          endDate = new Date(year, month + 1, endDay);
        } else {
          // Period is within the same month
          endDate = new Date(year, month, endDay);
        }
        
        periods.push({
          companyId,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          status: startDate > today ? 'upcoming' : (endDate < today ? 'past' : 'current'),
        });
      }
    } else if (config.periodType === 'custom') {
      if (!config.customStartDate || !config.customEndDate) {
        throw new Error('Custom range requires start and end dates');
      }
      
      // For custom range, only create one period with the specified dates
      const startDate = new Date(config.customStartDate);
      const endDate = new Date(config.customEndDate);
      
      periods.push({
        companyId,
        startDate: config.customStartDate,
        endDate: config.customEndDate,
        status: startDate > today ? 'upcoming' : (endDate < today ? 'past' : 'current'),
      });
    }

    // Insert all periods
    const created: PayPeriod[] = [];
    for (const period of periods) {
      const result = await this.createPayPeriod(period);
      created.push(result);
    }

    return created;
  }

  // Quote operations
  async createQuote(quote: InsertQuote): Promise<Quote> {
    const result = await db.insert(quotes).values(quote).returning();
    return result[0];
  }

  async getQuoteById(id: string): Promise<QuoteWithServices | undefined> {
    const quote = await db.select().from(quotes)
      .where(eq(quotes.id, id))
      .limit(1);
    
    if (!quote[0]) return undefined;
    
    const services = await db.select().from(quoteServices)
      .where(eq(quoteServices.quoteId, id));
    
    return {
      ...quote[0],
      services,
    };
  }

  async getQuotesByCompany(companyId: string, status?: string): Promise<QuoteWithServices[]> {
    const quotesResult = status
      ? await db.select().from(quotes)
          .where(and(eq(quotes.companyId, companyId), eq(quotes.status, status)))
          .orderBy(desc(quotes.createdAt))
      : await db.select().from(quotes)
          .where(eq(quotes.companyId, companyId))
          .orderBy(desc(quotes.createdAt));
    
    // Get services for each quote
    const quotesWithServices: QuoteWithServices[] = [];
    for (const quote of quotesResult) {
      const services = await db.select().from(quoteServices)
        .where(eq(quoteServices.quoteId, quote.id));
      quotesWithServices.push({
        ...quote,
        services,
      });
    }
    
    return quotesWithServices;
  }

  async updateQuote(id: string, updates: Partial<InsertQuote>): Promise<Quote> {
    const result = await db.update(quotes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(quotes.id, id))
      .returning();
    return result[0];
  }

  async updateQuoteWithServices(
    id: string, 
    quoteUpdates: Partial<InsertQuote>, 
    services: InsertQuoteService[]
  ): Promise<QuoteWithServices> {
    // Update quote metadata
    await this.updateQuote(id, quoteUpdates);
    
    // Delete existing services
    await this.deleteQuoteServicesByQuoteId(id);
    
    // Create new services
    for (const service of services) {
      await this.createQuoteService({ ...service, quoteId: id });
    }
    
    // Return updated quote with services
    return this.getQuoteById(id);
  }

  async deleteQuote(id: string): Promise<void> {
    await db.delete(quotes).where(eq(quotes.id, id));
  }

  // Quote service operations
  async createQuoteService(service: InsertQuoteService): Promise<QuoteService> {
    const result = await db.insert(quoteServices).values(service).returning();
    return result[0];
  }

  async getQuoteServices(quoteId: string): Promise<QuoteService[]> {
    return db.select().from(quoteServices)
      .where(eq(quoteServices.quoteId, quoteId));
  }

  async updateQuoteService(id: string, updates: Partial<InsertQuoteService>): Promise<QuoteService> {
    const result = await db.update(quoteServices)
      .set(updates)
      .where(eq(quoteServices.id, id))
      .returning();
    return result[0];
  }

  async deleteQuoteService(id: string): Promise<void> {
    await db.delete(quoteServices).where(eq(quoteServices.id, id));
  }

  async deleteQuoteServicesByQuoteId(quoteId: string): Promise<void> {
    await db.delete(quoteServices).where(eq(quoteServices.quoteId, quoteId));
  }

  // Scheduled Jobs operations
  async createScheduledJob(job: InsertScheduledJob): Promise<ScheduledJob> {
    const result = await db.insert(scheduledJobs).values(job).returning();
    return result[0];
  }

  async getScheduledJobsByCompany(companyId: string): Promise<ScheduledJobWithAssignments[]> {
    const jobs = await db.select().from(scheduledJobs)
      .where(eq(scheduledJobs.companyId, companyId))
      .orderBy(desc(scheduledJobs.startDate));
    
    // Fetch assignments for each job
    const jobsWithAssignments = await Promise.all(
      jobs.map(async (job) => {
        const assignments = await this.getJobAssignments(job.id);
        const employeeIds = assignments.map(a => a.employeeId);
        const assignedEmployees = employeeIds.length > 0
          ? await db.select().from(users).where(
              and(
                or(
                  eq(users.companyId, companyId),
                  eq(users.id, companyId)
                ),
                inArray(users.id, employeeIds)
              )
            )
          : [];
        
        // Map assignments with their metadata
        const employeeAssignments = assignments.map(assignment => {
          const employee = assignedEmployees.find(e => e.id === assignment.employeeId);
          if (!employee) return null;
          
          return {
            assignmentId: assignment.id,
            employee,
            startDate: assignment.startDate,
            endDate: assignment.endDate,
          };
        }).filter(Boolean);
        
        // Fetch project if exists
        const project = job.projectId 
          ? await this.getProjectById(job.projectId)
          : null;
        
        return {
          ...job,
          assignedEmployees,
          employeeAssignments: employeeAssignments as any,
          project,
        };
      })
    );
    
    return jobsWithAssignments;
  }

  async getScheduledJobsByEmployee(employeeId: string): Promise<ScheduledJobWithAssignments[]> {
    const assignments = await db.select().from(jobAssignments)
      .where(eq(jobAssignments.employeeId, employeeId));
    
    const jobIds = assignments.map(a => a.jobId);
    
    if (jobIds.length === 0) {
      return [];
    }
    
    const jobs = await db.select().from(scheduledJobs)
      .where(inArray(scheduledJobs.id, jobIds))
      .orderBy(desc(scheduledJobs.startDate));
    
    // Fetch all assignments for these jobs
    const jobsWithAssignments = await Promise.all(
      jobs.map(async (job) => {
        const jobAssignmentList = await this.getJobAssignments(job.id);
        const employeeIds = jobAssignmentList.map(a => a.employeeId);
        const assignedEmployees = employeeIds.length > 0
          ? await db.select().from(users).where(
              inArray(users.id, employeeIds)
            )
          : [];
        
        // Map assignments with their metadata
        const employeeAssignments = jobAssignmentList.map(assignment => {
          const employee = assignedEmployees.find(e => e.id === assignment.employeeId);
          if (!employee) return null;
          
          return {
            assignmentId: assignment.id,
            employee,
            startDate: assignment.startDate,
            endDate: assignment.endDate,
          };
        }).filter(Boolean);
        
        return {
          ...job,
          assignedEmployees,
          employeeAssignments: employeeAssignments as any,
        };
      })
    );
    
    return jobsWithAssignments;
  }

  async getScheduledJobById(id: string): Promise<ScheduledJob | undefined> {
    const result = await db.select().from(scheduledJobs).where(eq(scheduledJobs.id, id)).limit(1);
    return result[0];
  }

  async getScheduledJobWithAssignments(id: string): Promise<ScheduledJobWithAssignments | undefined> {
    const job = await this.getScheduledJobById(id);
    
    if (!job) {
      return undefined;
    }
    
    const assignments = await this.getJobAssignments(id);
    const employeeIds = assignments.map(a => a.employeeId);
    const assignedEmployees = employeeIds.length > 0
      ? await db.select().from(users).where(
          inArray(users.id, employeeIds)
        )
      : [];
    
    // Map assignments with their metadata
    const employeeAssignments = assignments.map(assignment => {
      const employee = assignedEmployees.find(e => e.id === assignment.employeeId);
      if (!employee) return null;
      
      return {
        assignmentId: assignment.id,
        employee,
        startDate: assignment.startDate,
        endDate: assignment.endDate,
      };
    }).filter(Boolean);
    
    // Fetch project if exists
    const project = job.projectId 
      ? await this.getProjectById(job.projectId)
      : null;
    
    return {
      ...job,
      assignedEmployees, // Keep for backward compatibility
      employeeAssignments: employeeAssignments as any,
      project,
    };
  }

  async updateScheduledJob(id: string, updates: Partial<InsertScheduledJob>): Promise<ScheduledJob> {
    const result = await db.update(scheduledJobs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(scheduledJobs.id, id))
      .returning();
    return result[0];
  }

  async deleteScheduledJob(id: string): Promise<void> {
    await db.delete(scheduledJobs).where(eq(scheduledJobs.id, id));
  }

  // Job Assignment operations
  async createJobAssignment(assignment: InsertJobAssignment): Promise<JobAssignment> {
    const result = await db.insert(jobAssignments).values(assignment).returning();
    return result[0];
  }

  async getJobAssignments(jobId: string): Promise<JobAssignment[]> {
    return db.select().from(jobAssignments)
      .where(eq(jobAssignments.jobId, jobId));
  }

  async deleteJobAssignment(id: string): Promise<void> {
    await db.delete(jobAssignments).where(eq(jobAssignments.id, id));
  }

  async deleteJobAssignmentsByJobId(jobId: string): Promise<void> {
    await db.delete(jobAssignments).where(eq(jobAssignments.jobId, jobId));
  }

  async replaceJobAssignments(jobId: string, employeeIds: string[], assignedBy: string): Promise<void> {
    // Delete existing assignments
    await this.deleteJobAssignmentsByJobId(jobId);
    
    // Create new assignments
    for (const employeeId of employeeIds) {
      await this.createJobAssignment({
        jobId,
        employeeId,
        assignedBy,
      });
    }
  }

  async checkEmployeeConflicts(
    employeeIds: string[], 
    startDate: Date, 
    endDate: Date,
    excludeJobId?: string
  ): Promise<Array<{ employeeId: string; employeeName: string; conflictingJobTitle: string }>> {
    const conflicts: Array<{ employeeId: string; employeeName: string; conflictingJobTitle: string }> = [];
    
    for (const employeeId of employeeIds) {
      // Get all assignments for this employee
      const assignments = await db.select().from(jobAssignments)
        .where(eq(jobAssignments.employeeId, employeeId));
      
      const jobIds = assignments.map(a => a.jobId);
      
      if (jobIds.length === 0) {
        continue;
      }
      
      // Check if any of their assigned jobs overlap with the new time range
      let query = db.select().from(scheduledJobs)
        .where(
          and(
            sql`${scheduledJobs.id} = ANY(${jobIds})`,
            or(
              // New job starts during existing job
              and(
                lte(scheduledJobs.startDate, startDate),
                gte(scheduledJobs.endDate, startDate)
              ),
              // New job ends during existing job
              and(
                lte(scheduledJobs.startDate, endDate),
                gte(scheduledJobs.endDate, endDate)
              ),
              // New job completely contains existing job
              and(
                gte(scheduledJobs.startDate, startDate),
                lte(scheduledJobs.endDate, endDate)
              )
            )
          )
        );
      
      // Exclude the job being edited (if any)
      if (excludeJobId) {
        query = query.where(not(eq(scheduledJobs.id, excludeJobId)));
      }
      
      const conflictingJobs = await query;
      
      if (conflictingJobs.length > 0) {
        const employee = await this.getUserById(employeeId);
        conflicts.push({
          employeeId,
          employeeName: employee?.name || 'Unknown',
          conflictingJobTitle: conflictingJobs[0].title,
        });
      }
    }
    
    return conflicts;
  }

  // Employee Time Off operations
  async createEmployeeTimeOff(timeOff: InsertEmployeeTimeOff): Promise<EmployeeTimeOff> {
    const result = await db.insert(employeeTimeOff).values(timeOff).returning();
    return result[0];
  }

  async getEmployeeTimeOffByCompany(companyId: string, startDate?: string, endDate?: string): Promise<EmployeeTimeOff[]> {
    let query = db.select().from(employeeTimeOff)
      .where(eq(employeeTimeOff.companyId, companyId));
    
    if (startDate && endDate) {
      query = query.where(
        and(
          eq(employeeTimeOff.companyId, companyId),
          gte(employeeTimeOff.date, startDate),
          lte(employeeTimeOff.date, endDate)
        )
      );
    }
    
    return query.orderBy(employeeTimeOff.date);
  }

  async getEmployeeTimeOffByEmployee(employeeId: string, startDate?: string, endDate?: string): Promise<EmployeeTimeOff[]> {
    let query = db.select().from(employeeTimeOff)
      .where(eq(employeeTimeOff.employeeId, employeeId));
    
    if (startDate && endDate) {
      query = query.where(
        and(
          eq(employeeTimeOff.employeeId, employeeId),
          gte(employeeTimeOff.date, startDate),
          lte(employeeTimeOff.date, endDate)
        )
      );
    }
    
    return query.orderBy(employeeTimeOff.date);
  }

  async getEmployeeTimeOffById(id: string): Promise<EmployeeTimeOff | undefined> {
    const result = await db.select().from(employeeTimeOff)
      .where(eq(employeeTimeOff.id, id))
      .limit(1);
    return result[0];
  }

  async deleteEmployeeTimeOff(id: string): Promise<void> {
    await db.delete(employeeTimeOff).where(eq(employeeTimeOff.id, id));
  }

  // User Preferences operations
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const result = await db.select().from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);
    return result[0];
  }

  async updateUserPreferences(
    userId: string, 
    updates: Partial<InsertUserPreferences>
  ): Promise<UserPreferences> {
    // Check if preferences exist
    const existing = await this.getUserPreferences(userId);
    
    if (existing) {
      // Update existing preferences
      const result = await db.update(userPreferences)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(userPreferences.userId, userId))
        .returning();
      return result[0];
    } else {
      // Create new preferences
      const result = await db.insert(userPreferences)
        .values({ userId, ...updates })
        .returning();
      return result[0];
    }
  }

  // Property Manager Company Links operations
  async addPropertyManagerCompanyLink(
    link: InsertPropertyManagerCompanyLink
  ): Promise<PropertyManagerCompanyLink> {
    // Validate that the company exists and is actually a company role
    const company = await this.getUserById(link.companyId);
    if (!company || company.role !== 'company') {
      throw new Error('Invalid company ID - company does not exist or is not a company role');
    }
    
    // Validate that the property manager exists and has property_manager role
    const propertyManager = await this.getUserById(link.propertyManagerId);
    if (!propertyManager || propertyManager.role !== 'property_manager') {
      throw new Error('Invalid property manager ID - user does not exist or is not a property manager');
    }
    
    // Check for duplicate link (database has unique constraint but we provide better error message)
    const existingLinks = await this.getPropertyManagerCompanyLinks(link.propertyManagerId);
    if (existingLinks.some(existingLink => existingLink.companyCode === link.companyCode)) {
      throw new Error('Property manager is already linked to this company');
    }
    
    const result = await db.insert(propertyManagerCompanyLinks)
      .values(link)
      .returning();
    return result[0];
  }

  async getPropertyManagerCompanyLinks(
    propertyManagerId: string
  ): Promise<PropertyManagerCompanyLink[]> {
    return await db.select()
      .from(propertyManagerCompanyLinks)
      .where(eq(propertyManagerCompanyLinks.propertyManagerId, propertyManagerId));
  }

  async removePropertyManagerCompanyLink(
    linkId: string,
    propertyManagerId: string
  ): Promise<void> {
    await db.delete(propertyManagerCompanyLinks)
      .where(
        and(
          eq(propertyManagerCompanyLinks.id, linkId),
          eq(propertyManagerCompanyLinks.propertyManagerId, propertyManagerId)
        )
      );
  }

  async getPropertyManagerLinkedCompanies(
    propertyManagerId: string
  ): Promise<User[]> {
    const links = await this.getPropertyManagerCompanyLinks(propertyManagerId);
    const companyIds = links.map(link => link.companyId);
    
    if (companyIds.length === 0) {
      return [];
    }
    
    return await db.select()
      .from(users)
      .where(
        and(
          eq(users.role, 'company'),
          sql`${users.id} IN (${sql.join(companyIds.map(id => sql`${id}`), sql`, `)})`
        )
      );
  }

  async getPropertyManagerVendorSummaries(propertyManagerId: string): Promise<Array<{
    linkId: string;
    id: string;
    companyName: string;
    email: string;
    phone: string | null;
    logo: string | null;
    activeProjectsCount: number;
    residentCode: string | null;
    propertyManagerCode: string | null;
    strataNumber: string | null;
    whitelabelBrandingActive: boolean;
    brandingColors: string | null;
  }>> {
    const links = await this.getPropertyManagerCompanyLinks(propertyManagerId);
    const companies = await this.getPropertyManagerLinkedCompanies(propertyManagerId);
    
    const vendorSummaries = await Promise.all(
      companies.map(async (company) => {
        // Find the corresponding link for this company
        const link = links.find(l => l.companyId === company.id);
        
        const activeProjects = await db.select()
          .from(projects)
          .where(
            and(
              eq(projects.companyId, company.id),
              eq(projects.status, 'active')
            )
          );
        
        // Convert brandingColors array to JSON format for frontend
        let brandingColorsJson: string | null = null;
        if (company.brandingColors && Array.isArray(company.brandingColors) && company.brandingColors.length > 0) {
          // Convert array [primary, secondary, ...] to {primary: color1, secondary: color2, ...}
          brandingColorsJson = JSON.stringify({
            primary: company.brandingColors[0] || null,
            secondary: company.brandingColors[1] || null,
          });
        }

        return {
          linkId: link?.id || '',
          id: company.id,
          companyName: company.companyName || company.email || "Unknown Company",
          email: company.email,
          phone: company.phone,
          logo: company.whitelabelBrandingActive && company.brandingLogoUrl 
            ? company.brandingLogoUrl 
            : company.logo,
          activeProjectsCount: activeProjects.length,
          residentCode: company.residentCode,
          propertyManagerCode: company.propertyManagerCode,
          strataNumber: link?.strataNumber || null,
          whitelabelBrandingActive: company.whitelabelBrandingActive || false,
          brandingColors: brandingColorsJson,
        };
      })
    );
    
    return vendorSummaries;
  }

  async addPropertyManagerVendor(propertyManagerId: string, companyCode: string): Promise<PropertyManagerCompanyLink> {
    const company = await this.getUserByPropertyManagerCode(companyCode);
    
    if (!company) {
      throw new Error('Invalid company code - no company found with this property manager code');
    }
    
    if (company.role !== 'company') {
      throw new Error('Invalid code - this code does not belong to a company');
    }
    
    const link: InsertPropertyManagerCompanyLink = {
      propertyManagerId,
      companyId: company.id,
      companyCode,
    };
    
    return await this.addPropertyManagerCompanyLink(link);
  }

  async updatePropertyManagerStrataNumber(linkId: string, strataNumber: string | null): Promise<PropertyManagerCompanyLink> {
    const [updated] = await db.update(propertyManagerCompanyLinks)
      .set({ strataNumber })
      .where(eq(propertyManagerCompanyLinks.id, linkId))
      .returning();
    
    if (!updated) {
      throw new Error('Property manager company link not found');
    }
    
    return updated;
  }

  async getPropertyManagerFilteredProjects(companyId: string, normalizedStrata: string | null): Promise<any[]> {
    // Strata number is required for filtering - reject null/empty values
    if (!normalizedStrata || normalizedStrata.trim() === '') {
      throw new Error('Strata number is required to filter projects');
    }
    
    // Normalize strata number helper function
    const normalizeStrata = (strata: string | null | undefined): string | null => {
      if (!strata || strata.trim() === '') return null;
      return strata.toUpperCase().replace(/\s+/g, '');
    };
    
    // Get all projects for this company
    const allProjects = await db.select()
      .from(projects)
      .where(eq(projects.companyId, companyId));
    
    // Filter projects by normalized strata number
    // Only include projects that have a strataPlanNumber AND it matches the filter
    return allProjects.filter(project => {
      const projectStrata = normalizeStrata(project.strataPlanNumber);
      return projectStrata !== null && projectStrata === normalizedStrata;
    });
  }

  async getPropertyManagerProjectDetails(projectId: string, companyId: string, normalizedStrata: string): Promise<{ project: any; complaints: any[] }> {
    // Strata number is required for security
    if (!normalizedStrata || normalizedStrata.trim() === '') {
      throw new Error('Strata number is required');
    }
    
    // Normalize strata number helper function
    const normalizeStrata = (strata: string | null | undefined): string | null => {
      if (!strata || strata.trim() === '') return null;
      return strata.toUpperCase().replace(/\s+/g, '');
    };
    
    // Verify project belongs to the company AND matches the strata number
    const [project] = await db.select()
      .from(projects)
      .where(and(
        eq(projects.id, projectId),
        eq(projects.companyId, companyId)
      ));
    
    if (!project) {
      throw new Error('Project not found or access denied');
    }
    
    // CRITICAL: Enforce strata filtering - prevent access to projects from other buildings
    const projectStrata = normalizeStrata(project.strataPlanNumber);
    if (projectStrata !== normalizedStrata) {
      throw new Error('Project not found or access denied');
    }
    
    // Get complaints for this project
    const projectComplaints = await db.select()
      .from(complaints)
      .where(eq(complaints.projectId, projectId))
      .orderBy(desc(complaints.createdAt));
    
    // Get work sessions for building progress calculation
    // Only get completed sessions (sessions with an endTime)
    const projectWorkSessions = await db.select()
      .from(workSessions)
      .where(and(
        eq(workSessions.projectId, projectId),
        isNotNull(workSessions.endTime)
      ));
    
    return {
      project: {
        ...project,
        workSessions: projectWorkSessions,
      },
      complaints: projectComplaints,
    };
  }

  // IRATA Task Log operations
  async createIrataTaskLog(log: InsertIrataTaskLog): Promise<IrataTaskLog> {
    const [result] = await db.insert(irataTaskLogs).values(log).returning();
    return result;
  }

  async getIrataTaskLogsByEmployee(employeeId: string): Promise<IrataTaskLog[]> {
    return db.select()
      .from(irataTaskLogs)
      .where(eq(irataTaskLogs.employeeId, employeeId))
      .orderBy(desc(irataTaskLogs.workDate));
  }

  async getIrataTaskLogsByCompany(companyId: string): Promise<IrataTaskLog[]> {
    return db.select()
      .from(irataTaskLogs)
      .where(eq(irataTaskLogs.companyId, companyId))
      .orderBy(desc(irataTaskLogs.workDate));
  }

  async getIrataTaskLogByWorkSession(workSessionId: string): Promise<IrataTaskLog | undefined> {
    const [result] = await db.select()
      .from(irataTaskLogs)
      .where(eq(irataTaskLogs.workSessionId, workSessionId))
      .limit(1);
    return result;
  }

  async getIrataTaskLogById(logId: string): Promise<IrataTaskLog | undefined> {
    const [result] = await db.select()
      .from(irataTaskLogs)
      .where(eq(irataTaskLogs.id, logId))
      .limit(1);
    return result;
  }

  async updateIrataTaskLog(logId: string, updates: Partial<InsertIrataTaskLog>): Promise<IrataTaskLog> {
    const [result] = await db.update(irataTaskLogs)
      .set(updates)
      .where(eq(irataTaskLogs.id, logId))
      .returning();
    return result;
  }

  async deleteIrataTaskLog(logId: string): Promise<void> {
    await db.delete(irataTaskLogs).where(eq(irataTaskLogs.id, logId));
  }

  async getIrataTaskLogsByDateRange(employeeId: string, startDate: string, endDate: string): Promise<IrataTaskLog[]> {
    return db.select()
      .from(irataTaskLogs)
      .where(and(
        eq(irataTaskLogs.employeeId, employeeId),
        gte(irataTaskLogs.workDate, startDate),
        lte(irataTaskLogs.workDate, endDate)
      ))
      .orderBy(desc(irataTaskLogs.workDate));
  }

  // Equipment Damage Report operations
  async createEquipmentDamageReport(report: InsertEquipmentDamageReport): Promise<EquipmentDamageReport> {
    const [result] = await db.insert(equipmentDamageReports).values(report).returning();
    return result;
  }

  async getEquipmentDamageReportsByCompany(companyId: string): Promise<EquipmentDamageReport[]> {
    return db.select()
      .from(equipmentDamageReports)
      .where(eq(equipmentDamageReports.companyId, companyId))
      .orderBy(desc(equipmentDamageReports.createdAt));
  }

  async getEquipmentDamageReportById(reportId: string): Promise<EquipmentDamageReport | undefined> {
    const [result] = await db.select()
      .from(equipmentDamageReports)
      .where(eq(equipmentDamageReports.id, reportId))
      .limit(1);
    return result;
  }

  async getEquipmentDamageReportsByGearItem(gearItemId: string): Promise<EquipmentDamageReport[]> {
    return db.select()
      .from(equipmentDamageReports)
      .where(eq(equipmentDamageReports.gearItemId, gearItemId))
      .orderBy(desc(equipmentDamageReports.createdAt));
  }

  // Feature Request operations
  async createFeatureRequest(request: InsertFeatureRequest): Promise<FeatureRequest> {
    const [result] = await db.insert(featureRequests).values(request).returning();
    return result;
  }

  async getFeatureRequestById(requestId: string): Promise<FeatureRequest | undefined> {
    const [result] = await db.select()
      .from(featureRequests)
      .where(eq(featureRequests.id, requestId))
      .limit(1);
    return result;
  }

  async getFeatureRequestsByCompany(companyId: string): Promise<FeatureRequest[]> {
    return db.select()
      .from(featureRequests)
      .where(eq(featureRequests.companyId, companyId))
      .orderBy(desc(featureRequests.createdAt));
  }

  async getAllFeatureRequests(): Promise<FeatureRequest[]> {
    return db.select()
      .from(featureRequests)
      .orderBy(desc(featureRequests.createdAt));
  }

  async updateFeatureRequest(requestId: string, updates: Partial<InsertFeatureRequest> & { resolvedAt?: Date }): Promise<FeatureRequest> {
    const [result] = await db.update(featureRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(featureRequests.id, requestId))
      .returning();
    return result;
  }

  async getFeatureRequestWithMessages(requestId: string): Promise<FeatureRequestWithMessages | undefined> {
    const request = await this.getFeatureRequestById(requestId);
    if (!request) return undefined;

    const messages = await this.getFeatureRequestMessages(requestId);
    const unreadCount = messages.filter(m => !m.isRead).length;

    return {
      ...request,
      messages,
      unreadCount,
    };
  }

  async getFeatureRequestsWithMessages(companyId?: string): Promise<FeatureRequestWithMessages[]> {
    const requests = companyId 
      ? await this.getFeatureRequestsByCompany(companyId)
      : await this.getAllFeatureRequests();

    const results: FeatureRequestWithMessages[] = [];
    for (const request of requests) {
      const messages = await this.getFeatureRequestMessages(request.id);
      const unreadCount = messages.filter(m => !m.isRead).length;
      results.push({
        ...request,
        messages,
        unreadCount,
      });
    }

    return results;
  }

  // Feature Request Message operations
  async createFeatureRequestMessage(message: InsertFeatureRequestMessage): Promise<FeatureRequestMessage> {
    const [result] = await db.insert(featureRequestMessages).values(message).returning();
    return result;
  }

  async getFeatureRequestMessages(requestId: string): Promise<FeatureRequestMessage[]> {
    return db.select()
      .from(featureRequestMessages)
      .where(eq(featureRequestMessages.requestId, requestId))
      .orderBy(featureRequestMessages.createdAt);
  }

  async markFeatureRequestMessagesAsRead(requestId: string, readerId: string): Promise<void> {
    // Mark all messages as read where the reader is NOT the sender
    await db.update(featureRequestMessages)
      .set({ isRead: true })
      .where(and(
        eq(featureRequestMessages.requestId, requestId),
        not(eq(featureRequestMessages.senderId, readerId))
      ));
  }

  async getUnreadFeatureRequestMessageCount(companyId?: string): Promise<number> {
    if (companyId) {
      // For company owners - count unread messages from superusers
      const requests = await this.getFeatureRequestsByCompany(companyId);
      let count = 0;
      for (const request of requests) {
        const messages = await db.select()
          .from(featureRequestMessages)
          .where(and(
            eq(featureRequestMessages.requestId, request.id),
            eq(featureRequestMessages.senderRole, 'superuser'),
            eq(featureRequestMessages.isRead, false)
          ));
        count += messages.length;
      }
      return count;
    } else {
      // For superusers - count unread messages from companies
      const messages = await db.select()
        .from(featureRequestMessages)
        .where(and(
          eq(featureRequestMessages.senderRole, 'company'),
          eq(featureRequestMessages.isRead, false)
        ));
      return messages.length;
    }
  }

  // ==================== SuperUser Platform Metrics ====================

  /**
   * Calculate live MRR metrics from current subscription data
   * Uses existing user subscription fields without new tables for real-time calculation
   * License key format: COMPANY-XXXXX-XXXXX-XXXXX-N or GIFT-XXXXX-XXXXX-XXXXX-N
   * Where N is tier: 1=Basic, 2=Starter, 3=Premium, 4=Enterprise
   */
  async calculateLiveMrrMetrics(): Promise<{
    totalMrr: number;
    byTier: { basic: number; starter: number; premium: number; enterprise: number };
    byAddon: { extraSeats: number; extraProjects: number; whiteLabel: number };
    customerCounts: { total: number; basic: number; starter: number; premium: number; enterprise: number };
  }> {
    // Get all company users with active subscriptions (have license key)
    const companies = await db.select().from(users).where(
      and(
        eq(users.role, "company"),
        isNotNull(users.licenseKey)
      )
    );

    // Tier pricing (monthly) - map tier number to tier name and price
    const tierMap: Record<string, { name: string; price: number }> = {
      '1': { name: 'basic', price: 79 },
      '2': { name: 'starter', price: 299 },
      '3': { name: 'premium', price: 499 },
      '4': { name: 'enterprise', price: 899 },
    };

    // Add-on pricing (monthly)
    const addonPricing = {
      extraSeats: 19,  // Per 2 seats package (additionalSeatsCount is number of packs)
      extraProjects: 49,  // Per project (additionalProjectsCount is number of projects)
      whiteLabel: 49,  // Flat rate
    };

    const byTier = { basic: 0, starter: 0, premium: 0, enterprise: 0 };
    const byAddon = { extraSeats: 0, extraProjects: 0, whiteLabel: 0 };
    const customerCounts = { total: 0, basic: 0, starter: 0, premium: 0, enterprise: 0 };

    for (const company of companies) {
      // Extract tier from license key - format: COMPANY-XXXXX-XXXXX-XXXXX-N or GIFT-XXXXX-XXXXX-XXXXX-N
      // Split on '-' and get the last segment which is the tier number (1-4)
      if (company.licenseKey) {
        const segments = company.licenseKey.split('-');
        const lastSegment = segments[segments.length - 1];
        // Normalize: take only the first character in case there are extra digits
        const tierNumber = lastSegment?.charAt(0) || '1';
        const tierInfo = tierMap[tierNumber];
        
        if (tierInfo) {
          const tier = tierInfo.name as keyof typeof byTier;
          byTier[tier] += tierInfo.price;
          customerCounts[tier]++;
          customerCounts.total++;
        } else {
          // Default to basic if tier not recognized
          byTier.basic += tierMap['1'].price;
          customerCounts.basic++;
          customerCounts.total++;
        }
      }

      // Calculate add-on MRR using actual stored add-on counts
      // additionalSeatsCount = number of seat packs purchased (each pack = 2 seats, $19/mo)
      if (company.additionalSeatsCount && company.additionalSeatsCount > 0) {
        byAddon.extraSeats += company.additionalSeatsCount * addonPricing.extraSeats;
      }

      // additionalProjectsCount = number of extra projects purchased ($49/mo each)
      if (company.additionalProjectsCount && company.additionalProjectsCount > 0) {
        byAddon.extraProjects += company.additionalProjectsCount * addonPricing.extraProjects;
      }

      // whitelabelBrandingActive = white label branding subscription ($49/mo)
      if (company.whitelabelBrandingActive) {
        byAddon.whiteLabel += addonPricing.whiteLabel;
      }
    }

    const totalMrr = Object.values(byTier).reduce((a, b) => a + b, 0) +
                     Object.values(byAddon).reduce((a, b) => a + b, 0);

    return { totalMrr, byTier, byAddon, customerCounts };
  }

  /**
   * Get customer summary metrics including geographic distribution
   */
  async getCustomerSummaryMetrics(): Promise<{
    totalCustomers: number;
    activeCustomers: number;
    trialCustomers: number;
    churned: number;
    byRegion: Record<string, number>;
    recentSignups: { count: number; period: string };
  }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get all companies
    const companies = await db.select().from(users).where(eq(users.role, "company"));

    // Count by status
    const activeCustomers = companies.filter(c => c.stripeCustomerId && c.licenseKey).length;
    const trialCustomers = companies.filter(c => !c.stripeCustomerId || !c.licenseKey).length;

    // Geographic distribution - using country field if available, or parsing address
    const byRegion: Record<string, number> = {};
    for (const company of companies) {
      // Try to extract region from company data
      let region = 'Unknown';
      
      // If we have country data, use it
      if (company.country) {
        region = company.country;
      } else if (company.companyAddress) {
        // Try to parse country from address (common patterns)
        const addr = company.companyAddress.toLowerCase();
        if (addr.includes('canada') || addr.includes(', ca')) region = 'Canada';
        else if (addr.includes('usa') || addr.includes('united states') || addr.match(/, [a-z]{2} \d{5}/)) region = 'United States';
        else region = 'Other';
      }
      
      byRegion[region] = (byRegion[region] || 0) + 1;
    }

    // Recent signups
    const recentSignups = companies.filter(c => c.createdAt && new Date(c.createdAt) > thirtyDaysAgo).length;

    // Get actual churned customer count from churn_events table
    const churnedCount = await this.getChurnedCustomerCount();

    return {
      totalCustomers: companies.length,
      activeCustomers,
      trialCustomers,
      churned: churnedCount,
      byRegion,
      recentSignups: { count: recentSignups, period: 'last 30 days' },
    };
  }

  /**
   * Get product usage metrics across the platform
   */
  async getProductUsageMetrics(): Promise<{
    totalProjects: number;
    activeProjects: number;
    totalWorkSessions: number;
    totalEmployees: number;
    safetyFormsCount: { harness: number; toolbox: number; flha: number; incident: number };
    quotesCount: { total: number; sent: number; accepted: number };
    avgProjectsPerCompany: number;
    avgEmployeesPerCompany: number;
  }> {
    // Count projects
    const allProjects = await db.select({ count: sql<number>`count(*)::int` }).from(projects);
    const totalProjects = allProjects[0]?.count || 0;

    // Active projects (status = in_progress or open)
    const activeProjectsResult = await db.select({ count: sql<number>`count(*)::int` })
      .from(projects)
      .where(or(
        eq(projects.status, 'in_progress'),
        eq(projects.status, 'open')
      ));
    const activeProjects = activeProjectsResult[0]?.count || 0;

    // Work sessions count
    const workSessionsResult = await db.select({ count: sql<number>`count(*)::int` }).from(workSessions);
    const totalWorkSessions = workSessionsResult[0]?.count || 0;

    // Employees count (non-company, non-resident users)
    const employeesResult = await db.select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(and(
        not(eq(users.role, 'company')),
        not(eq(users.role, 'resident')),
        not(eq(users.role, 'property_manager')),
        not(eq(users.role, 'superuser'))
      ));
    const totalEmployees = employeesResult[0]?.count || 0;

    // Safety forms counts
    const harnessResult = await db.select({ count: sql<number>`count(*)::int` }).from(harnessInspections);
    const toolboxResult = await db.select({ count: sql<number>`count(*)::int` }).from(toolboxMeetings);
    const flhaResult = await db.select({ count: sql<number>`count(*)::int` }).from(flhaForms);
    const incidentResult = await db.select({ count: sql<number>`count(*)::int` }).from(incidentReports);

    // Quotes counts
    const totalQuotesResult = await db.select({ count: sql<number>`count(*)::int` }).from(quotes);
    const sentQuotesResult = await db.select({ count: sql<number>`count(*)::int` })
      .from(quotes)
      .where(eq(quotes.pipelineStage, 'sent'));
    const acceptedQuotesResult = await db.select({ count: sql<number>`count(*)::int` })
      .from(quotes)
      .where(eq(quotes.pipelineStage, 'accepted'));

    // Company counts for averages
    const companiesResult = await db.select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(eq(users.role, 'company'));
    const totalCompanies = companiesResult[0]?.count || 1;

    return {
      totalProjects,
      activeProjects,
      totalWorkSessions,
      totalEmployees,
      safetyFormsCount: {
        harness: harnessResult[0]?.count || 0,
        toolbox: toolboxResult[0]?.count || 0,
        flha: flhaResult[0]?.count || 0,
        incident: incidentResult[0]?.count || 0,
      },
      quotesCount: {
        total: totalQuotesResult[0]?.count || 0,
        sent: sentQuotesResult[0]?.count || 0,
        accepted: acceptedQuotesResult[0]?.count || 0,
      },
      avgProjectsPerCompany: Math.round(totalProjects / totalCompanies * 10) / 10,
      avgEmployeesPerCompany: Math.round(totalEmployees / totalCompanies * 10) / 10,
    };
  }

  /**
   * Get detailed subscription tier breakdown for all companies
   * License key format: COMPANY-XXXXX-XXXXX-XXXXX-N or GIFT-XXXXX-XXXXX-XXXXX-N
   * Where N is tier: 1=Basic, 2=Starter, 3=Premium, 4=Enterprise
   */
  async getSubscriptionBreakdown(): Promise<Array<{
    companyId: string;
    companyName: string;
    tier: string;
    mrr: number;
    addons: { extraSeats: boolean; extraProjects: boolean; whiteLabel: boolean };
    createdAt: Date | null;
    lastLoginAt: Date | null;
  }>> {
    const companies = await db.select().from(users).where(
      and(
        eq(users.role, "company"),
        isNotNull(users.licenseKey)
      )
    );

    // Map tier number to tier name and price
    const tierMap: Record<string, { name: string; price: number }> = {
      '1': { name: 'Basic', price: 79 },
      '2': { name: 'Starter', price: 299 },
      '3': { name: 'Premium', price: 499 },
      '4': { name: 'Enterprise', price: 899 },
    };

    return companies.map(company => {
      // Extract tier from license key - format: COMPANY-XXXXX-XXXXX-XXXXX-N or GIFT-XXXXX-XXXXX-XXXXX-N
      // Split on '-' and get the last segment which is the tier number (1-4)
      const segments = company.licenseKey?.split('-') || [];
      const lastSegment = segments[segments.length - 1];
      // Normalize: take only the first character in case there are extra digits
      const tierNumber = lastSegment?.charAt(0) || '1';
      const tierInfo = tierMap[tierNumber] || tierMap['1'];

      // Calculate MRR from tier + add-ons
      let mrr = tierInfo.price;
      
      // Add-ons: additionalSeatsCount = number of seat packs ($19/mo each)
      const hasExtraSeats = (company.additionalSeatsCount || 0) > 0;
      if (hasExtraSeats) {
        mrr += (company.additionalSeatsCount || 0) * 19;
      }

      // Add-ons: additionalProjectsCount = number of extra projects ($49/mo each)
      const hasExtraProjects = (company.additionalProjectsCount || 0) > 0;
      if (hasExtraProjects) {
        mrr += (company.additionalProjectsCount || 0) * 49;
      }

      // Add-ons: whitelabelBrandingActive = white label branding ($49/mo)
      const hasWhiteLabel = !!company.whitelabelBrandingActive;
      if (hasWhiteLabel) {
        mrr += 49;
      }

      return {
        companyId: company.id,
        companyName: company.companyName || 'Unknown',
        tier: tierInfo.name,
        mrr,
        addons: {
          extraSeats: hasExtraSeats,
          extraProjects: hasExtraProjects,
          whiteLabel: hasWhiteLabel,
        },
        createdAt: company.createdAt,
        lastLoginAt: company.lastLoginAt,
      };
    });
  }

  /**
   * Record a churn event when a customer cancels their subscription
   */
  async recordChurnEvent(data: {
    companyId: string;
    finalMrr?: number;
    tier?: string;
    reason?: string;
    notes?: string;
  }): Promise<ChurnEvent> {
    const today = new Date().toISOString().split('T')[0];
    
    const result = await db.insert(churnEvents).values({
      companyId: data.companyId,
      churnDate: today,
      finalMrr: data.finalMrr?.toString() || null,
      tier: data.tier || null,
      reason: data.reason || 'unknown',
      notes: data.notes || null,
    }).returning();

    console.log(`[Churn] Recorded churn event for company ${data.companyId}`);
    return result[0];
  }

  /**
   * Get count of churned customers (customers who have churn events without win-back)
   */
  async getChurnedCustomerCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)::int` })
      .from(churnEvents)
      .where(isNull(churnEvents.winBackDate));
    
    return result[0]?.count || 0;
  }

  /**
   * Get all churn events for analytics
   */
  async getChurnEvents(options?: { limit?: number; offset?: number }): Promise<ChurnEvent[]> {
    let query = db.select().from(churnEvents).orderBy(desc(churnEvents.churnDate));
    
    if (options?.limit) {
      query = query.limit(options.limit) as typeof query;
    }
    if (options?.offset) {
      query = query.offset(options.offset) as typeof query;
    }
    
    return query;
  }

  /**
   * Record a win-back event (customer resubscribed after churning)
   */
  async recordWinBack(companyId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    await db.update(churnEvents)
      .set({ winBackDate: today })
      .where(
        and(
          eq(churnEvents.companyId, companyId),
          isNull(churnEvents.winBackDate)
        )
      );
    
    console.log(`[Churn] Recorded win-back for company ${companyId}`);
  }

  /**
   * Check if a company has an active churn event (not won back)
   */
  async hasActiveChurnEvent(companyId: string): Promise<boolean> {
    const result = await db.select({ count: sql<number>`count(*)::int` })
      .from(churnEvents)
      .where(
        and(
          eq(churnEvents.companyId, companyId),
          isNull(churnEvents.winBackDate)
        )
      );
    
    return (result[0]?.count || 0) > 0;
  }
}

export const storage = new Storage();
