import { db } from "./db";
import { users, projects, dropLogs, workSessions, complaints, complaintNotes, projectPhotos, jobComments, harnessInspections, toolboxMeetings } from "@shared/schema";
import type { User, InsertUser, Project, InsertProject, DropLog, InsertDropLog, WorkSession, InsertWorkSession, Complaint, InsertComplaint, ComplaintNote, InsertComplaintNote, ProjectPhoto, InsertProjectPhoto, JobComment, InsertJobComment, HarnessInspection, InsertHarnessInspection, ToolboxMeeting, InsertToolboxMeeting } from "@shared/schema";
import { eq, and, desc, sql, isNull } from "drizzle-orm";
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

  // Project operations
  async createProject(project: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(project).returning();
    return result[0];
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result[0];
  }

  async getProjectsByCompany(companyId: string): Promise<Project[]> {
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

  async getAllProjectsByStrataPlan(strataPlanNumber: string): Promise<Project[]> {
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

  async getComplaintsForResident(residentId: string): Promise<Complaint[]> {
    // Get complaints submitted by this resident
    return db.select().from(complaints)
      .where(eq(complaints.residentId, residentId))
      .orderBy(desc(complaints.createdAt));
  }

  async getComplaintsForCompany(companyId: string): Promise<Complaint[]> {
    // Get complaints for all projects belonging to this company
    const companyProjects = await db.select().from(projects)
      .where(eq(projects.companyId, companyId));
    
    const projectIds = companyProjects.map(p => p.id);
    
    if (projectIds.length === 0) {
      return [];
    }
    
    return db.select().from(complaints)
      .where(sql`${complaints.projectId} IN (${sql.join(projectIds.map(id => sql`${id}`), sql`, `)})`)
      .orderBy(desc(complaints.createdAt));
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
    shortfallReason?: string
  ): Promise<WorkSession> {
    const result = await db.update(workSessions)
      .set({
        endTime: sql`NOW()`,
        dropsCompletedNorth,
        dropsCompletedEast,
        dropsCompletedSouth,
        dropsCompletedWest,
        shortfallReason,
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
      createdAt: workSessions.createdAt,
      updatedAt: workSessions.updatedAt,
      techName: users.name,
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

  async getPhotosByUnitAndStrataPlan(unitNumber: string, strataPlanNumber: string): Promise<any[]> {
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
}

export const storage = new Storage();
