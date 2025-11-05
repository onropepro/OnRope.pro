import { db } from "./db";
import { users, projects, dropLogs, workSessions, complaints, complaintNotes } from "@shared/schema";
import type { User, InsertUser, Project, InsertProject, DropLog, InsertDropLog, WorkSession, InsertWorkSession, Complaint, InsertComplaint, ComplaintNote, InsertComplaintNote } from "@shared/schema";
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

  async getAllProjects(): Promise<Project[]> {
    return db.select().from(projects).orderBy(desc(projects.createdAt));
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

  async updateDropLog(id: string, dropsCompleted: number): Promise<DropLog> {
    const result = await db.update(dropLogs)
      .set({ dropsCompleted, updatedAt: new Date() })
      .where(eq(dropLogs.id, id))
      .returning();
    return result[0];
  }

  async getProjectProgress(projectId: string): Promise<{ totalCompleted: number }> {
    const result = await db.select({
      totalCompleted: sql<number>`COALESCE(SUM(${dropLogs.dropsCompleted}), 0)`,
    })
    .from(dropLogs)
    .where(eq(dropLogs.projectId, projectId));
    
    return { totalCompleted: Number(result[0]?.totalCompleted || 0) };
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

  async endWorkSession(sessionId: string, dropsCompleted: number, shortfallReason?: string): Promise<WorkSession> {
    const result = await db.update(workSessions)
      .set({
        endTime: sql`NOW()`,
        dropsCompleted,
        shortfallReason,
        updatedAt: sql`NOW()`,
      })
      .where(eq(workSessions.id, sessionId))
      .returning();
    return result[0];
  }

  async getWorkSessionsByProject(projectId: string, companyId: string): Promise<WorkSession[]> {
    return db.select().from(workSessions)
      .where(
        and(
          eq(workSessions.projectId, projectId),
          eq(workSessions.companyId, companyId)
        )
      )
      .orderBy(desc(workSessions.workDate), desc(workSessions.startTime));
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
}

export const storage = new Storage();
