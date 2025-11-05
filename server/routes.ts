import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProjectSchema, insertDropLogSchema, insertComplaintSchema, insertComplaintNoteSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { ObjectStorageService } from "./objectStorage";

// Authentication middleware
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized - Please log in" });
  }
  next();
}

// Role-based access middleware
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId || !req.session.role) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (!roles.includes(req.session.role)) {
      return res.status(403).json({ message: "Forbidden - Insufficient permissions" });
    }
    
    next();
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // ==================== AUTH ROUTES ====================
  
  // Registration endpoint
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      const { confirmPassword, ...userData } = req.body;
      
      // Validate input
      const validatedData = insertUserSchema.parse(userData);
      
      // Check if user already exists
      if (validatedData.email) {
        const existingUser = await storage.getUserByEmail(validatedData.email);
        if (existingUser) {
          return res.status(400).json({ message: "Email already registered" });
        }
      }
      
      if (validatedData.companyName) {
        const existingCompany = await storage.getUserByCompanyName(validatedData.companyName);
        if (existingCompany) {
          return res.status(400).json({ message: "Company name already taken" });
        }
      }
      
      // Create user
      const user = await storage.createUser(validatedData);
      
      // Create session
      req.session.userId = user.id;
      req.session.role = user.role;
      
      // Return user without password
      const { passwordHash, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Login endpoint
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { identifier, password } = req.body;
      
      if (!identifier || !password) {
        return res.status(400).json({ message: "Identifier and password are required" });
      }
      
      // Try to find user by email or company name
      let user = await storage.getUserByEmail(identifier);
      
      if (!user) {
        user = await storage.getUserByCompanyName(identifier);
      }
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Verify password
      const isValidPassword = await storage.verifyPassword(password, user.passwordHash);
      
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Create session
      req.session.userId = user.id;
      req.session.role = user.role;
      
      // Return user without password
      const { passwordHash, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Logout endpoint
  app.post("/api/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  
  // Get current user
  app.get("/api/user", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUserById(req.session.userId!);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { passwordHash, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get company information by ID
  app.get("/api/companies/:companyId", requireAuth, async (req: Request, res: Response) => {
    try {
      const company = await storage.getUserById(req.params.companyId);
      
      if (!company || company.role !== "company") {
        return res.status(404).json({ message: "Company not found" });
      }

      // Return only public company information
      res.json({ 
        company: {
          id: company.id,
          companyName: company.companyName,
        }
      });
    } catch (error) {
      console.error("Get company error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ==================== EMPLOYEE ROUTES ====================
  
  // Create employee (Company/Operations Manager only)
  app.post("/api/employees", requireAuth, requireRole("company", "operations_manager"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get company ID (company themselves or the employee's company)
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const { name, email, password, role, techLevel } = req.body;
      
      if (!password || password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      
      // Create employee account linked to company
      // Storage will hash the password
      const employee = await storage.createUser({
        name,
        email,
        role,
        techLevel: role === "rope_access_tech" ? techLevel : null,
        companyId, // Link employee to this company
        passwordHash: password, // Storage will hash this
      });
      
      const { passwordHash: _, ...employeeWithoutPassword } = employee;
      res.json({ employee: employeeWithoutPassword });
    } catch (error) {
      console.error("Create employee error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Delete employee
  app.delete("/api/employees/:id", requireAuth, requireRole("company", "operations_manager"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Get the employee to verify they belong to this company
      const employee = await storage.getUserById(req.params.id);
      
      if (!employee || employee.companyId !== companyId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.deleteUser(req.params.id);
      res.json({ message: "Employee deleted successfully" });
    } catch (error) {
      console.error("Delete employee error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get all employees
  app.get("/api/employees", requireAuth, requireRole("company", "operations_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get company ID (company themselves or the employee's company)
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Get employees for this company only
      const employees = await storage.getAllEmployees(companyId);
      
      // Remove passwords from response
      const employeesWithoutPasswords = employees.map(emp => {
        const { passwordHash, ...empWithoutPassword } = emp;
        return empWithoutPassword;
      });
      
      res.json({ employees: employeesWithoutPasswords });
    } catch (error) {
      console.error("Get employees error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ==================== PROJECT ROUTES ====================
  
  // Upload rope access plan PDF
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed'));
      }
    }
  });
  
  app.post("/api/upload-rope-access-plan", requireAuth, requireRole("company", "operations_manager"), upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const filename = `rope-access-plan-${timestamp}.pdf`;
      
      // Upload to object storage
      const objectStorageService = new ObjectStorageService();
      const url = await objectStorageService.uploadPublicFile(
        filename,
        req.file.buffer,
        'application/pdf'
      );
      
      res.json({ url });
    } catch (error) {
      console.error("File upload error:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });
  
  // Serve public files from object storage
  app.get("/public-objects/:filePath(*)", async (req: Request, res: Response) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Create project
  app.post("/api/projects", requireAuth, requireRole("company", "operations_manager"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get company ID (company themselves or the employee's company)
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const projectData = insertProjectSchema.parse({
        ...req.body,
        companyId,
      });
      
      const project = await storage.createProject(projectData);
      res.json({ project });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create project error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get all projects (filtered by role)
  app.get("/api/projects", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      let projects;
      
      if (currentUser.role === "company") {
        // Return only THIS company's projects
        projects = await storage.getProjectsByCompany(currentUser.id);
      } else if (currentUser.role === "operations_manager" || currentUser.role === "supervisor" || currentUser.role === "rope_access_tech") {
        // Return projects for their company
        const companyId = currentUser.companyId;
        if (companyId) {
          projects = await storage.getProjectsByCompany(companyId);
        } else {
          projects = [];
        }
      } else if (currentUser.role === "resident") {
        // Return ALL projects (active and completed) matching resident's strata plan
        projects = await storage.getAllProjectsByStrataPlan(currentUser.strataPlanNumber || "");
      } else {
        projects = [];
      }
      
      // Add completedDrops to each project
      const projectsWithProgress = await Promise.all(
        projects.map(async (project) => {
          const { totalCompleted } = await storage.getProjectProgress(project.id);
          return {
            ...project,
            completedDrops: totalCompleted,
          };
        })
      );
      
      res.json({ projects: projectsWithProgress });
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get single project
  app.get("/api/projects/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify access before returning project
      const hasAccess = await storage.verifyProjectAccess(
        req.params.id,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const project = await storage.getProjectById(req.params.id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json({ project });
    } catch (error) {
      console.error("Get project error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Update project status
  app.patch("/api/projects/:id/status", requireAuth, requireRole("company", "operations_manager"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify access before updating
      const hasAccess = await storage.verifyProjectAccess(
        req.params.id,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const { status } = req.body;
      
      if (!["active", "completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const project = await storage.updateProjectStatus(req.params.id, status);
      res.json({ project });
    } catch (error) {
      console.error("Update project status error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Delete project
  app.delete("/api/projects/:id", requireAuth, requireRole("company", "operations_manager"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify access before deleting
      const hasAccess = await storage.verifyProjectAccess(
        req.params.id,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.deleteProject(req.params.id);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Delete project error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get project progress
  app.get("/api/projects/:id/progress", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify access before returning progress
      const hasAccess = await storage.verifyProjectAccess(
        req.params.id,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const project = await storage.getProjectById(req.params.id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const { totalCompleted } = await storage.getProjectProgress(req.params.id);
      const progressPercentage = project.totalDrops > 0 ? (totalCompleted / project.totalDrops) * 100 : 0;
      
      res.json({
        completedDrops: totalCompleted,
        totalDrops: project.totalDrops,
        progressPercentage: Math.round(progressPercentage),
      });
    } catch (error) {
      console.error("Get project progress error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ==================== DROP LOG ROUTES ====================
  
  // Create or update drop log - allow all employee roles to log drops
  app.post("/api/drops", requireAuth, requireRole("rope_access_tech", "operations_manager", "supervisor", "company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const dropData = insertDropLogSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });
      
      // Verify tech has access to this project before logging drops
      const hasAccess = await storage.verifyProjectAccess(
        dropData.projectId,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied - you cannot log drops for this project" });
      }
      
      // Check if drop log already exists for this project/user/date
      const existingLog = await storage.getDropLogByProjectAndDate(
        dropData.projectId,
        dropData.userId,
        dropData.date
      );
      
      let dropLog;
      if (existingLog) {
        // Update existing log
        dropLog = await storage.updateDropLog(existingLog.id, dropData.dropsCompleted);
      } else {
        // Create new log
        dropLog = await storage.createDropLog(dropData);
      }
      
      res.json({ dropLog });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create drop log error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get drop logs for a project
  app.get("/api/projects/:projectId/drops", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify access before returning drops
      const hasAccess = await storage.verifyProjectAccess(
        req.params.projectId,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const drops = await storage.getDropLogsByProject(req.params.projectId);
      res.json({ drops });
    } catch (error) {
      console.error("Get drop logs error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get current user's drops for today (for daily target tracking)
  app.get("/api/my-drops-today", requireAuth, async (req: Request, res: Response) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const dropLogs = await storage.getDropLogsByUserAndDate(req.session.userId!, today);
      
      const totalDropsToday = dropLogs.reduce((sum, log) => sum + log.dropsCompleted, 0);
      
      res.json({ 
        totalDropsToday,
        dropLogs 
      });
    } catch (error) {
      console.error("Get today's drops error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ==================== WORK SESSION ROUTES ====================
  
  // Start a work session
  app.post("/api/projects/:projectId/work-sessions/start", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { projectId } = req.params;
      
      // Verify employee has access to this project
      const hasAccess = await storage.verifyProjectAccess(
        projectId,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied - you cannot work on this project" });
      }
      
      // Check if there's already an active session for this employee on this project
      const activeSession = await storage.getActiveWorkSession(currentUser.id, projectId);
      
      if (activeSession) {
        return res.status(400).json({ message: "You already have an active work session for this project" });
      }
      
      // Get project to access company ID
      const project = await storage.getProjectById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Create new work session
      const now = new Date();
      const session = await storage.startWorkSession({
        projectId,
        employeeId: currentUser.id,
        companyId: project.companyId,
        workDate: now,
        startTime: now,
      });
      
      res.json({ session });
    } catch (error) {
      console.error("Start work session error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // End a work session
  app.patch("/api/projects/:projectId/work-sessions/:sessionId/end", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { sessionId } = req.params;
      const { dropsCompleted, shortfallReason } = req.body;
      
      // Get the session to verify ownership
      const activeSession = await storage.getActiveWorkSession(currentUser.id, req.params.projectId);
      
      if (!activeSession || activeSession.id !== sessionId) {
        return res.status(403).json({ message: "Access denied - not your active session" });
      }
      
      // Get project to check daily target
      const project = await storage.getProjectById(req.params.projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Validate drops completed
      if (typeof dropsCompleted !== 'number' || dropsCompleted < 0) {
        return res.status(400).json({ message: "Invalid drops completed value" });
      }
      
      // If drops < target, require shortfall reason
      if (dropsCompleted < project.dailyDropTarget && (!shortfallReason || shortfallReason.trim() === '')) {
        return res.status(400).json({ message: "Shortfall reason is required when drops completed is less than the daily target" });
      }
      
      // End the session
      const session = await storage.endWorkSession(
        sessionId,
        dropsCompleted,
        dropsCompleted < project.dailyDropTarget ? shortfallReason : undefined
      );
      
      res.json({ session });
    } catch (error) {
      console.error("End work session error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get work sessions for a project (management view)
  app.get("/api/projects/:projectId/work-sessions", requireAuth, requireRole("company", "operations_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get company ID
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Verify access to project
      const hasAccess = await storage.verifyProjectAccess(
        req.params.projectId,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const sessions = await storage.getWorkSessionsByProject(req.params.projectId, companyId);
      res.json({ sessions });
    } catch (error) {
      console.error("Get work sessions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get employee's own work sessions for a project
  app.get("/api/projects/:projectId/my-work-sessions", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify access to project
      const hasAccess = await storage.verifyProjectAccess(
        req.params.projectId,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const sessions = await storage.getWorkSessionsByEmployee(currentUser.id, req.params.projectId);
      res.json({ sessions });
    } catch (error) {
      console.error("Get my work sessions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ==================== COMPLAINT ROUTES ====================
  
  // Create complaint
  app.post("/api/complaints", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      const complaintData = insertComplaintSchema.parse({
        ...req.body,
        residentId: currentUser?.role === "resident" ? currentUser.id : null,
      });
      
      const complaint = await storage.createComplaint(complaintData);
      res.json({ complaint });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create complaint error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get all complaints (filtered by role)
  app.get("/api/complaints", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      let complaints;
      
      if (currentUser.role === "resident") {
        // Residents only see complaints they submitted
        complaints = await storage.getComplaintsForResident(currentUser.id);
      } else if (currentUser.role === "company") {
        // Company sees all complaints for their projects
        complaints = await storage.getComplaintsForCompany(currentUser.id);
      } else if (currentUser.role === "operations_manager" || currentUser.role === "supervisor" || currentUser.role === "rope_access_tech") {
        // Staff sees complaints for their company's projects
        const companyId = currentUser.companyId;
        if (companyId) {
          complaints = await storage.getComplaintsForCompany(companyId);
        } else {
          complaints = [];
        }
      } else {
        complaints = [];
      }
      
      res.json({ complaints });
    } catch (error) {
      console.error("Get complaints error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get single complaint
  app.get("/api/complaints/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify access before returning complaint
      const hasAccess = await storage.verifyComplaintAccess(
        req.params.id,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const complaint = await storage.getComplaintById(req.params.id);
      
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      
      // Mark as viewed when staff access it (not residents)
      if (currentUser.role !== "resident") {
        await storage.markComplaintAsViewed(req.params.id);
      }
      
      res.json({ complaint });
    } catch (error) {
      console.error("Get complaint error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get complaint notes (staff only, residents cannot see notes)
  app.get("/api/complaints/:id/notes", requireAuth, requireRole("rope_access_tech", "supervisor", "operations_manager", "company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify access before returning notes
      const hasAccess = await storage.verifyComplaintAccess(
        req.params.id,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const notes = await storage.getNotesByComplaint(req.params.id);
      res.json({ notes });
    } catch (error) {
      console.error("Get complaint notes error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Update complaint status (staff can close, residents can reopen)
  app.patch("/api/complaints/:id/status", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify access before updating
      const hasAccess = await storage.verifyComplaintAccess(
        req.params.id,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const { status } = req.body;
      
      if (!["open", "closed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      // Residents can only reopen (change from closed to open)
      // Staff can change to any status
      if (currentUser.role === "resident" && status === "closed") {
        return res.status(403).json({ message: "Residents cannot close complaints" });
      }
      
      const complaint = await storage.updateComplaintStatus(req.params.id, status);
      res.json({ complaint });
    } catch (error) {
      console.error("Update complaint status error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Add complaint note
  app.post("/api/complaints/:complaintId/notes", requireAuth, requireRole("rope_access_tech", "supervisor", "operations_manager", "company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify access before adding note
      const hasAccess = await storage.verifyComplaintAccess(
        req.params.complaintId,
        currentUser.id,
        currentUser.role,
        currentUser.companyId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const noteData = insertComplaintNoteSchema.parse({
        complaintId: req.params.complaintId,
        userId: req.session.userId,
        note: req.body.note,
      });
      
      const note = await storage.createComplaintNote(noteData);
      res.json({ note });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create complaint note error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
