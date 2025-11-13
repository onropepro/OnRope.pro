import { db } from "./db";
import { users, clients, projects, dropLogs, workSessions, nonBillableWorkSessions, complaints, complaintNotes, projectPhotos, jobComments, harnessInspections, toolboxMeetings, payPeriodConfig, payPeriods, quotes, quoteServices, gearItems, scheduledJobs, jobAssignments, userPreferences } from "@shared/schema";
import type { User, InsertUser, Client, InsertClient, Project, InsertProject, DropLog, InsertDropLog, WorkSession, InsertWorkSession, Complaint, InsertComplaint, ComplaintNote, InsertComplaintNote, ProjectPhoto, InsertProjectPhoto, JobComment, InsertJobComment, HarnessInspection, InsertHarnessInspection, ToolboxMeeting, InsertToolboxMeeting, PayPeriodConfig, InsertPayPeriodConfig, PayPeriod, InsertPayPeriod, EmployeeHoursSummary, Quote, InsertQuote, QuoteService, InsertQuoteService, QuoteWithServices, GearItem, InsertGearItem, ScheduledJob, InsertScheduledJob, JobAssignment, InsertJobAssignment, ScheduledJobWithAssignments, UserPreferences, InsertUserPreferences } from "@shared/schema";
import { eq, and, or, desc, sql, isNull, not, gte, lte, between, inArray } from "drizzle-orm";
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
    // Get all employees created by this company
    return db.select().from(users)
      .where(eq(users.companyId, companyId))
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
        .where(and(eq(projects.companyId, companyId), eq(projects.status, status)))
        .orderBy(desc(projects.createdAt));
    }
    return db.select().from(projects)
      .where(eq(projects.companyId, companyId))
      .orderBy(desc(projects.createdAt));
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
    await db.delete(projects).where(eq(projects.id, id));
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
    
    // Resident can access project if it matches their strata plan
    if (userRole === "resident") {
      const user = await this.getUserById(userId);
      return user?.strataPlanNumber === project.strataPlanNumber;
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

  async createWorkSession(session: InsertWorkSession): Promise<WorkSession> {
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

  async endWorkSession(
    sessionId: string, 
    dropsCompletedNorth: number,
    dropsCompletedEast: number,
    dropsCompletedSouth: number,
    dropsCompletedWest: number,
    shortfallReason?: string,
    endLatitude?: number | null,
    endLongitude?: number | null
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

  async endNonBillableWorkSession(sessionId: string): Promise<any> {
    const result = await db.update(nonBillableWorkSessions)
      .set({
        endTime: sql`NOW()`,
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
  async createGearItem(item: InsertGearItem): Promise<GearItem> {
    const result = await db.insert(gearItems).values(item).returning();
    return result[0];
  }

  async getGearItemsByCompany(companyId: string): Promise<GearItem[]> {
    return db.select().from(gearItems)
      .where(eq(gearItems.companyId, companyId))
      .orderBy(desc(gearItems.createdAt));
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
        employeeName: users.name,
        hourlyRate: users.hourlyRate,
        projectName: projects.buildingName,
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

      if (!employeeMap.has(session.employeeId)) {
        employeeMap.set(session.employeeId, {
          employeeId: session.employeeId,
          employeeName: session.employeeName,
          hourlyRate: session.hourlyRate || '0',
          totalHours: 0,
          totalPay: 0,
          sessions: [],
        });
      }

      const summary = employeeMap.get(session.employeeId)!;
      summary.totalHours += hours;
      summary.totalPay += hours * rate;
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
          totalPay: 0,
          sessions: [],
        });
      }

      const summary = employeeMap.get(session.employeeId)!;
      summary.totalHours += hours;
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
                eq(users.companyId, companyId),
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
    
    return {
      ...job,
      assignedEmployees, // Keep for backward compatibility
      employeeAssignments: employeeAssignments as any,
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
}

export const storage = new Storage();
