import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProjectSchema, insertDropLogSchema, insertComplaintSchema, insertComplaintNoteSchema, insertJobCommentSchema, insertHarnessInspectionSchema, insertToolboxMeetingSchema, insertPayPeriodConfigSchema, insertQuoteSchema, insertQuoteServiceSchema, insertGearItemSchema, normalizeStrataPlan, type InsertGearItem } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
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

// License verification helper - re-verifies license keys with Overhaul Labs API
// Returns: { success: boolean, valid: boolean | null }
// - success=false means API failure (keep existing licenseVerified state)
// - success=true, valid=true/false means definitive response (update licenseVerified)
async function reverifyLicenseKey(licenseKey: string): Promise<{ success: boolean; valid: boolean | null }> {
  try {
    const externalApiUrl = 'https://OverhaulLabs.replit.app/api/verify-license';
    
    console.log('[License Re-verification] Calling external API:', externalApiUrl);
    console.log('[License Re-verification] Request payload:', { licenseKey: licenseKey.substring(0, 5) + '...' });
    
    const verificationResponse = await fetch(externalApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseKey })
    });
    
    const responseText = await verificationResponse.text();
    console.log('[License Re-verification] Response status:', verificationResponse.status);
    console.log('[License Re-verification] Response body (raw):', responseText);
    
    // Try to parse as JSON
    let verificationResult;
    try {
      verificationResult = JSON.parse(responseText);
    } catch (parseError) {
      console.error('[License Re-verification] Failed to parse response as JSON - API may be down');
      console.warn('[License Re-verification] Keeping existing license status due to parse error');
      return { success: false, valid: null }; // API failure - don't revoke access
    }
    
    // Check if we got a definitive response
    if (verificationResponse.ok && typeof verificationResult.valid === 'boolean') {
      const isValid = verificationResult.valid;
      console.log(`[License Re-verification] License is ${isValid ? 'valid' : 'invalid'}`);
      return { success: true, valid: isValid };
    } else {
      // API returned error or unexpected format
      console.warn('[License Re-verification] API returned non-OK status or unexpected format');
      console.warn('[License Re-verification] Keeping existing license status due to API error');
      return { success: false, valid: null }; // API failure - don't revoke access
    }
  } catch (error: any) {
    console.error('[License Re-verification] Network error:', error.message);
    console.warn('[License Re-verification] Keeping existing license status due to network error');
    return { success: false, valid: null }; // Network failure - don't revoke access
  }
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
      
      // If this is a company user, create default payroll config and generate periods
      if (user.role === 'company') {
        try {
          // Create default semi-monthly payroll config (1st and 15th)
          await storage.savePayPeriodConfig({
            companyId: user.id,
            periodType: 'semi-monthly',
            firstPayDay: 1,
            secondPayDay: 15,
          });
          
          // Generate initial 6 pay periods
          await storage.generatePayPeriods(user.id, 6);
        } catch (error) {
          console.error('Error creating default payroll config:', error);
          // Don't fail registration if payroll setup fails
        }
      }
      
      // Create session
      req.session.userId = user.id;
      req.session.role = user.role;
      
      // Save session before responding (critical for production)
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
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
      
      // Check if user has been terminated
      if (user.terminationDate) {
        return res.status(403).json({ message: "Your employment has been terminated. Please contact your administrator for more information." });
      }
      
      // RE-VERIFY LICENSE ON EVERY LOGIN (company role only)
      if (user.role === 'company' && user.licenseKey) {
        // Skip re-verification for bypass mode (development)
        if (user.licenseKey === 'BYPASSED') {
          console.log('[Login] Bypass mode detected - skipping re-verification');
        } else {
          console.log('[Login] Re-verifying stored license key for company user...');
          const verificationResult = await reverifyLicenseKey(user.licenseKey);
          
          let finalLicenseStatus = user.licenseVerified; // Default to existing status
          
          if (verificationResult.success && verificationResult.valid !== null) {
            // API responded definitively - update status
            finalLicenseStatus = verificationResult.valid;
            await storage.updateUser(user.id, { licenseVerified: finalLicenseStatus });
            console.log(`[Login] License status updated to: ${finalLicenseStatus}`);
            // Update user object with new status
            user.licenseVerified = finalLicenseStatus;
          } else {
            // API failed - keep existing status (don't lock out paying customers)
            console.warn('[Login] API failure - preserving existing license status:', finalLicenseStatus);
            console.warn('[Login] User will continue with existing access level (licenseVerified:', finalLicenseStatus, ')');
          }
        }
      }
      
      // Create session
      req.session.userId = user.id;
      req.session.role = user.role;
      
      // Save session before responding (critical for production)
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      // Return user without sensitive fields (passwordHash and licenseKey)
      const { passwordHash, licenseKey, ...userWithoutSensitiveData } = user;
      res.json({ user: userWithoutSensitiveData });
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
  
  // Manual license verification endpoint
  app.post("/api/verify-license", requireAuth, async (req: Request, res: Response) => {
    try {
      const { licenseKey, bypass } = req.body;
      
      // BYPASS MODE (for development/testing)
      if (bypass === true) {
        console.log('[License Verification] BYPASS activated - setting license as verified without API call');
        await storage.updateUser(req.session.userId!, { 
          licenseKey: 'BYPASSED',
          licenseVerified: true 
        });
        return res.json({
          success: true,
          message: "License verification bypassed (development mode)"
        });
      }
      
      if (!licenseKey) {
        return res.status(400).json({ 
          success: false, 
          message: "License key is required" 
        });
      }
      
      // Overhaul Labs marketplace API URL
      const externalApiUrl = 'https://OverhaulLabs.replit.app/api/verify-license';
      
      console.log('[License Verification] Calling external API:', externalApiUrl);
      console.log('[License Verification] Request payload:', { licenseKey: licenseKey.substring(0, 5) + '...' });
      
      // Call Overhaul Labs marketplace API to verify license
      const verificationResponse = await fetch(externalApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ licenseKey })
      });
      
      const responseText = await verificationResponse.text();
      console.log('[License Verification] Response status:', verificationResponse.status);
      console.log('[License Verification] Response body (raw):', responseText);
      
      let verificationResult;
      try {
        verificationResult = JSON.parse(responseText);
      } catch (parseError) {
        console.error('[License Verification] Failed to parse response as JSON:', parseError);
        return res.status(502).json({
          success: false,
          message: "License verification service is temporarily unavailable"
        });
      }
      
      console.log('[License Verification] Parsed result:', verificationResult);
      
      if (verificationResponse.ok && verificationResult.valid === true) {
        // License is valid - save to database
        await storage.updateUser(req.session.userId!, { 
          licenseKey,
          licenseVerified: true 
        });
        
        return res.json({
          success: true,
          message: verificationResult.message || "License verified successfully"
        });
      } else {
        // License is invalid
        return res.status(400).json({
          success: false,
          message: verificationResult.message || "Invalid license key"
        });
      }
    } catch (error: any) {
      console.error('[License Verification] Error:', error);
      return res.status(500).json({
        success: false,
        message: "An error occurred during verification"
      });
    }
  });
  
  // Get current user
  app.get("/api/user", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUserById(req.session.userId!);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user has been terminated - destroy session if so
      if (user.terminationDate) {
        req.session.destroy(() => {});
        return res.status(403).json({ message: "Your employment has been terminated. Please contact your administrator for more information." });
      }
      
      // Strip sensitive fields (passwordHash and licenseKey)
      const { passwordHash, licenseKey, ...userWithoutSensitiveData } = user;
      res.json({ user: userWithoutSensitiveData });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update user profile
  app.patch("/api/user/profile", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUserById(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updates: any = {};
      
      // Allow updating name for all users
      if (req.body.name !== undefined) {
        updates.name = req.body.name;
      }
      
      // Allow updating email for non-company users
      if (req.body.email !== undefined && user.role !== "company") {
        // Check if email is already in use by another user
        const existingUser = await storage.getUserByEmail(req.body.email);
        if (existingUser && existingUser.id !== user.id) {
          return res.status(400).json({ message: "Email address is already in use" });
        }
        updates.email = req.body.email;
      }
      
      // Role-specific updates
      if (user.role === "resident") {
        if (req.body.unitNumber !== undefined) {
          updates.unitNumber = req.body.unitNumber;
        }
      }
      
      if (user.role === "company") {
        if (req.body.companyName !== undefined) {
          updates.companyName = req.body.companyName;
        }
      }
      
      await storage.updateUser(user.id, updates);
      const updatedUser = await storage.getUserById(user.id);
      
      const { passwordHash, ...userWithoutPassword } = updatedUser!;
      res.json({ user: userWithoutPassword, message: "Profile updated successfully" });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Change password
  app.patch("/api/user/password", requireAuth, async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new passwords are required" });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters" });
      }
      
      const user = await storage.getUserById(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      
      // Hash and update new password
      const passwordHash = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(user.id, { passwordHash, isTempPassword: false });
      
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete company account (company role only)
  app.delete("/api/user/account", requireAuth, requireRole("company"), async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ message: "Password is required to delete account" });
      }
      
      const user = await storage.getUserById(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify password
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(400).json({ message: "Incorrect password" });
      }
      
      // Delete user (cascades to all employees, projects, work sessions, drop logs, complaints)
      await storage.deleteUser(user.id);
      
      // Destroy session
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destroy error:", err);
        }
      });
      
      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      console.error("Delete account error:", error);
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
      
      const { 
        name, email, password, role, techLevel, hourlyRate, permissions,
        startDate, birthday, driversLicenseNumber, driversLicenseProvince,
        homeAddress, employeePhoneNumber, emergencyContactName, emergencyContactPhone,
        specialMedicalConditions, irataLevel, irataLicenseNumber, irataIssuedDate, irataExpirationDate
      } = req.body;
      
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
        hourlyRate: hourlyRate ? hourlyRate : null,
        permissions: permissions || [],
        companyId, // Link employee to this company
        passwordHash: password, // Storage will hash this
        startDate: startDate || null,
        birthday: birthday || null,
        driversLicenseNumber: driversLicenseNumber || null,
        driversLicenseProvince: driversLicenseProvince || null,
        homeAddress: homeAddress || null,
        employeePhoneNumber: employeePhoneNumber || null,
        emergencyContactName: emergencyContactName || null,
        emergencyContactPhone: emergencyContactPhone || null,
        specialMedicalConditions: specialMedicalConditions || null,
        irataLevel: irataLevel || null,
        irataLicenseNumber: irataLicenseNumber || null,
        irataIssuedDate: irataIssuedDate || null,
        irataExpirationDate: irataExpirationDate || null,
      });
      
      const { passwordHash: _, ...employeeWithoutPassword } = employee;
      res.json({ employee: employeeWithoutPassword });
    } catch (error: any) {
      console.error("Create employee error:", error);
      
      // Check for duplicate email (Postgres unique constraint violation)
      if (error && typeof error === 'object' && error.code === '23505' && error.constraint?.includes('email')) {
        return res.status(409).json({ message: "Email address is already in use" });
      }
      
      res.status(500).json({ message: "Failed to create employee" });
    }
  });
  
  // Update employee
  app.patch("/api/employees/:id", requireAuth, requireRole("company", "operations_manager"), async (req: Request, res: Response) => {
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
      
      const { 
        name, email, role, techLevel, hourlyRate, permissions,
        startDate, birthday, driversLicenseNumber, driversLicenseProvince,
        homeAddress, employeePhoneNumber, emergencyContactName, emergencyContactPhone,
        specialMedicalConditions, irataLevel, irataLicenseNumber, irataIssuedDate, 
        irataExpirationDate, terminatedDate, terminationReason, terminationNotes
      } = req.body;
      
      // Update employee
      const updatedEmployee = await storage.updateUser(req.params.id, {
        name,
        email,
        role,
        techLevel: role === "rope_access_tech" ? techLevel : null,
        hourlyRate: hourlyRate ? hourlyRate : null,
        permissions: permissions || [],
        startDate: startDate !== undefined ? (startDate || null) : undefined,
        birthday: birthday !== undefined ? (birthday || null) : undefined,
        driversLicenseNumber: driversLicenseNumber !== undefined ? (driversLicenseNumber || null) : undefined,
        driversLicenseProvince: driversLicenseProvince !== undefined ? (driversLicenseProvince || null) : undefined,
        homeAddress: homeAddress !== undefined ? (homeAddress || null) : undefined,
        employeePhoneNumber: employeePhoneNumber !== undefined ? (employeePhoneNumber || null) : undefined,
        emergencyContactName: emergencyContactName !== undefined ? (emergencyContactName || null) : undefined,
        emergencyContactPhone: emergencyContactPhone !== undefined ? (emergencyContactPhone || null) : undefined,
        specialMedicalConditions: specialMedicalConditions !== undefined ? (specialMedicalConditions || null) : undefined,
        irataLevel: irataLevel !== undefined ? (irataLevel || null) : undefined,
        irataLicenseNumber: irataLicenseNumber !== undefined ? (irataLicenseNumber || null) : undefined,
        irataIssuedDate: irataIssuedDate !== undefined ? (irataIssuedDate || null) : undefined,
        irataExpirationDate: irataExpirationDate !== undefined ? (irataExpirationDate || null) : undefined,
        terminatedDate: terminatedDate !== undefined ? (terminatedDate || null) : undefined,
        terminationReason: terminationReason !== undefined ? (terminationReason || null) : undefined,
        terminationNotes: terminationNotes !== undefined ? (terminationNotes || null) : undefined,
      });
      
      const { passwordHash: _, ...employeeWithoutPassword } = updatedEmployee;
      res.json({ employee: employeeWithoutPassword });
    } catch (error: any) {
      console.error("Update employee error:", error);
      
      // Check for duplicate email (Postgres unique constraint violation)
      if (error && typeof error === 'object' && error.code === '23505' && error.constraint?.includes('email')) {
        return res.status(409).json({ message: "Email address is already in use" });
      }
      
      res.status(500).json({ message: "Failed to update employee" });
    }
  });
  
  // Reactivate employee
  app.post("/api/employees/:id/reactivate", requireAuth, requireRole("company"), async (req: Request, res: Response) => {
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
      
      // Reactivate employee by clearing termination fields
      const updatedEmployee = await storage.updateUser(req.params.id, {
        terminatedDate: null,
        terminationReason: null,
        terminationNotes: null,
      });
      
      const { passwordHash: _, ...employeeWithoutPassword } = updatedEmployee;
      res.json({ employee: employeeWithoutPassword });
    } catch (error) {
      console.error("Reactivate employee error:", error);
      res.status(500).json({ message: "Failed to reactivate employee" });
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
  app.get("/api/employees", requireAuth, requireRole("company", "operations_manager", "supervisor", "rope_access_tech"), async (req: Request, res: Response) => {
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
  
  // Upload images (photos)
  const imageUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });
  
  app.post("/api/upload-rope-access-plan", requireAuth, requireRole("company", "operations_manager", "rope_access_tech"), upload.single('file'), async (req: Request, res: Response) => {
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
      console.error("File upload error details:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload file";
      res.status(500).json({ message: `Upload failed: ${errorMessage}` });
    }
  });
  
  // Update project's rope access plan
  app.patch("/api/projects/:id/rope-access-plan", requireAuth, requireRole("company", "operations_manager", "rope_access_tech"), upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const projectId = req.params.id;
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get the project to verify access
      const project = await storage.getProjectById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Verify user has access to this project (same company)
      const userCompanyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (project.companyId !== userCompanyId) {
        return res.status(403).json({ message: "Access denied" });
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
      
      // Update project with new PDF URL
      const updatedProject = await storage.updateProject(projectId, { ropeAccessPlanUrl: url });
      
      res.json({ project: updatedProject, url });
    } catch (error) {
      console.error("File upload error details:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload file";
      res.status(500).json({ message: `Upload failed: ${errorMessage}` });
    }
  });
  
  // Upload image to project with optional unit number and comment
  app.post("/api/projects/:id/images", requireAuth, requireRole("company", "operations_manager", "supervisor", "rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"), imageUpload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const projectId = req.params.id;
      const { unitNumber, comment, isMissedUnit, missedUnitNumber } = req.body;
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get the project to verify access
      const project = await storage.getProjectById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Verify user has access to this project (same company) and determine companyId
      const userCompanyId = currentUser.role === "company" ? currentUser.id : (currentUser.companyId ?? project.companyId);
      if (project.companyId !== userCompanyId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Validate missed unit fields
      const isMissed = isMissedUnit === 'true' || isMissedUnit === true;
      if (isMissed) {
        // Only allow missed unit marking for in-suite dryer vent projects
        if (project.jobType !== 'in_suite_dryer_vent_cleaning') {
          return res.status(400).json({ message: "Missed units can only be marked for in-suite dryer vent cleaning projects" });
        }
        
        // Require unit number when marking as missed
        if (!missedUnitNumber || missedUnitNumber.trim() === '') {
          return res.status(400).json({ message: "Unit number is required when marking a photo as a missed unit" });
        }
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const ext = req.file.mimetype.split('/')[1];
      const filename = `project-image-${projectId}-${timestamp}.${ext}`;
      
      // Upload to object storage
      const objectStorageService = new ObjectStorageService();
      const url = await objectStorageService.uploadPublicFile(
        filename,
        req.file.buffer,
        req.file.mimetype
      );
      
      // Create photo record in database with optional unit number and comment
      const photo = await storage.createProjectPhoto({
        projectId,
        companyId: userCompanyId,
        uploadedBy: currentUser.id,
        imageUrl: url,
        unitNumber: unitNumber || null,
        comment: comment || null,
        isMissedUnit: isMissed,
        missedUnitNumber: isMissed ? missedUnitNumber : null,
      });
      
      res.json({ photo, url });
    } catch (error) {
      console.error("Image upload error details:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload image";
      res.status(500).json({ message: `Upload failed: ${errorMessage}` });
    }
  });

  // Get photos for a project
  app.get("/api/projects/:id/photos", requireAuth, async (req: Request, res: Response) => {
    try {
      const projectId = req.params.id;
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get the project to verify access
      const project = await storage.getProjectById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Verify user has access to this project
      const userCompanyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      const userStrataPlan = currentUser.role === "resident" ? currentUser.strataPlanNumber : null;
      
      if (currentUser.role === "resident") {
        // Residents can only see photos for projects matching their strata plan
        if (project.strataPlanNumber !== userStrataPlan) {
          return res.status(403).json({ message: "Access denied" });
        }
      } else {
        // Staff must be from same company
        if (project.companyId !== userCompanyId) {
          return res.status(403).json({ message: "Access denied" });
        }
      }
      
      let photos = await storage.getProjectPhotos(projectId);
      console.log(`[PHOTOS DEBUG] Fetched ${photos.length} photos for project ${projectId}`);
      console.log(`[PHOTOS DEBUG] First photo:`, photos[0]);
      
      // Filter photos for residents to only show their unit
      if (currentUser.role === "resident" && currentUser.unitNumber) {
        photos = photos.filter(photo => photo.unitNumber === currentUser.unitNumber);
      }
      
      res.json({ photos });
    } catch (error) {
      console.error("Get photos error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to get photos";
      res.status(500).json({ message: errorMessage });
    }
  });

  // Get photos for resident's unit
  app.get("/api/my-unit-photos", requireAuth, requireRole("resident"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser || !currentUser.unitNumber || !currentUser.strataPlanNumber) {
        return res.status(400).json({ message: "Unit number or strata plan number not found" });
      }
      
      // Get photos by unit number and strata plan number (works across all companies)
      const photos = await storage.getPhotosByUnitAndStrataPlan(
        currentUser.unitNumber, 
        currentUser.strataPlanNumber
      );
      
      res.json({ photos });
    } catch (error) {
      console.error("Get unit photos error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to get unit photos";
      res.status(500).json({ message: errorMessage });
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
      
      // Job types that don't use drop-based tracking
      const nonDropJobTypes = ['in_suite_dryer_vent_cleaning', 'parkade_pressure_cleaning', 'ground_window_cleaning'];
      const isNonDropJob = nonDropJobTypes.includes(req.body.jobType);
      
      const projectData = insertProjectSchema.parse({
        ...req.body,
        strataPlanNumber: normalizeStrataPlan(req.body.strataPlanNumber),
        companyId,
        targetCompletionDate: req.body.targetCompletionDate || null,
        // Default dailyDropTarget to 0 for non-drop job types
        dailyDropTarget: isNonDropJob ? 0 : req.body.dailyDropTarget,
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
  
  // Update project
  app.patch("/api/projects/:id", requireAuth, requireRole("company", "operations_manager"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { id } = req.params;
      
      // Get existing project to verify ownership
      const existingProject = await storage.getProjectById(id);
      if (!existingProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Verify access
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (existingProject.companyId !== companyId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Build update object with all allowed fields
      const allowedUpdates: any = {
        buildingName: req.body.buildingName,
        buildingAddress: req.body.buildingAddress,
        strataPlanNumber: req.body.strataPlanNumber,
        jobType: req.body.jobType,
        targetCompletionDate: req.body.targetCompletionDate || null,
        estimatedHours: req.body.estimatedHours,
      };
      
      // Add job-type specific fields
      if (req.body.totalDropsNorth !== undefined) allowedUpdates.totalDropsNorth = req.body.totalDropsNorth;
      if (req.body.totalDropsEast !== undefined) allowedUpdates.totalDropsEast = req.body.totalDropsEast;
      if (req.body.totalDropsSouth !== undefined) allowedUpdates.totalDropsSouth = req.body.totalDropsSouth;
      if (req.body.totalDropsWest !== undefined) allowedUpdates.totalDropsWest = req.body.totalDropsWest;
      if (req.body.dailyDropTarget !== undefined) allowedUpdates.dailyDropTarget = req.body.dailyDropTarget;
      if (req.body.totalFloors !== undefined) allowedUpdates.totalFloors = req.body.totalFloors;
      if (req.body.floorsPerDay !== undefined) allowedUpdates.floorsPerDay = req.body.floorsPerDay;
      if (req.body.totalStalls !== undefined) allowedUpdates.totalStalls = req.body.totalStalls;
      if (req.body.stallsPerDay !== undefined) allowedUpdates.stallsPerDay = req.body.stallsPerDay;
      
      const updatedProject = await storage.updateProject(id, allowedUpdates);
      res.json({ project: updatedProject });
    } catch (error) {
      console.error("Update project error:", error);
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
      
      // Get status filter from query params (return all projects if not specified)
      const statusFilter = req.query.status as string | undefined;
      
      let projects: Project[];
      
      if (currentUser.role === "company") {
        // Return only THIS company's projects, filtered by status (all if not specified)
        projects = await storage.getProjectsByCompany(currentUser.id, statusFilter);
      } else if (currentUser.role === "operations_manager" || currentUser.role === "supervisor" || currentUser.role === "rope_access_tech") {
        // Return projects for their company, filtered by status (all if not specified)
        const companyId = currentUser.companyId;
        if (companyId) {
          projects = await storage.getProjectsByCompany(companyId, statusFilter);
        } else {
          projects = [];
        }
      } else if (currentUser.role === "resident") {
        // Return projects matching resident's strata plan (all statuses if not specified)
        projects = await storage.getAllProjectsByStrataPlan(currentUser.strataPlanNumber || "", statusFilter);
      } else {
        projects = [];
      }
      
      // Add completedDrops and totalDrops to each project
      const projectsWithProgress = await Promise.all(
        projects.map(async (project) => {
          const { total } = await storage.getProjectProgress(project.id);
          const totalDrops = (project.totalDropsNorth ?? 0) + 
                            (project.totalDropsEast ?? 0) + 
                            (project.totalDropsSouth ?? 0) + 
                            (project.totalDropsWest ?? 0);
          return {
            ...project,
            completedDrops: total,
            totalDrops,
          };
        })
      );
      
      // Disable caching to ensure fresh data
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
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
      
      // Check if user has financial permissions
      const canViewFinancialData = currentUser.role === "company" || 
                                    currentUser.role === "operations_manager" || 
                                    currentUser.role === "supervisor" || 
                                    currentUser.permissions?.includes("view_financial_data");
      
      // Add completed drops (total and per-elevation) to the project
      const { north, east, south, west, total } = await storage.getProjectProgress(project.id);
      const projectWithProgress = {
        ...project,
        completedDrops: total,
        completedDropsNorth: north,
        completedDropsEast: east,
        completedDropsSouth: south,
        completedDropsWest: west,
      };
      
      // Filter financial data if user doesn't have financial permissions
      const filteredProject = canViewFinancialData ? projectWithProgress : {
        ...projectWithProgress,
        estimatedHours: null,
      };
      
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.json({ project: filteredProject });
    } catch (error) {
      console.error("Get project error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get residents for a project
  app.get("/api/projects/:id/residents", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Only company and management roles can view residents
      if (!["company", "operations_manager", "supervisor"].includes(currentUser.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Verify access to this project
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
      
      // Get all residents with matching strata plan number
      const residents = await storage.getResidentsByStrataPlan(project.strataPlanNumber);
      
      // Return residents without sensitive data
      const residentsData = residents.map(resident => ({
        id: resident.id,
        email: resident.email,
        name: resident.name,
        unitNumber: resident.unitNumber,
        phoneNumber: resident.phoneNumber,
        strataPlanNumber: resident.strataPlanNumber,
      }));
      
      res.json({ residents: residentsData });
    } catch (error) {
      console.error("Get project residents error:", error);
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
      
      const { north, east, south, west, total } = await storage.getProjectProgress(req.params.id);
      const totalDrops = (project.totalDropsNorth ?? 0) + 
                        (project.totalDropsEast ?? 0) + 
                        (project.totalDropsSouth ?? 0) + 
                        (project.totalDropsWest ?? 0);
      const progressPercentage = totalDrops > 0 ? (total / totalDrops) * 100 : 0;
      
      res.json({
        completedDrops: total,
        completedDropsNorth: north,
        completedDropsEast: east,
        completedDropsSouth: south,
        completedDropsWest: west,
        totalDrops,
        totalDropsNorth: project.totalDropsNorth ?? 0,
        totalDropsEast: project.totalDropsEast ?? 0,
        totalDropsSouth: project.totalDropsSouth ?? 0,
        totalDropsWest: project.totalDropsWest ?? 0,
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
      const { dropsCompletedNorth, dropsCompletedEast, dropsCompletedSouth, dropsCompletedWest, shortfallReason } = req.body;
      
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
      
      // Validate elevation drops (ensure they are numbers and non-negative)
      const north = typeof dropsCompletedNorth === 'number' ? dropsCompletedNorth : 0;
      const east = typeof dropsCompletedEast === 'number' ? dropsCompletedEast : 0;
      const south = typeof dropsCompletedSouth === 'number' ? dropsCompletedSouth : 0;
      const west = typeof dropsCompletedWest === 'number' ? dropsCompletedWest : 0;
      
      if (north < 0 || east < 0 || south < 0 || west < 0) {
        return res.status(400).json({ message: "Invalid drops completed value" });
      }
      
      const totalDropsCompleted = north + east + south + west;
      
      // If drops < target, require shortfall reason
      if (totalDropsCompleted < project.dailyDropTarget && (!shortfallReason || shortfallReason.trim() === '')) {
        return res.status(400).json({ message: "Shortfall reason is required when drops completed is less than the daily target" });
      }
      
      // End the session with elevation-specific drops
      const session = await storage.endWorkSession(
        sessionId,
        north,
        east,
        south,
        west,
        totalDropsCompleted < project.dailyDropTarget ? shortfallReason : undefined
      );
      
      res.json({ session });
    } catch (error) {
      console.error("End work session error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get work sessions for a project (management and tech view)
  app.get("/api/projects/:projectId/work-sessions", requireAuth, requireRole("company", "operations_manager", "supervisor", "rope_access_tech"), async (req: Request, res: Response) => {
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
      
      // Check if user has financial permissions
      const canViewFinancialData = currentUser.role === "company" || 
                                    currentUser.role === "operations_manager" || 
                                    currentUser.role === "supervisor" || 
                                    currentUser.permissions?.includes("view_financial_data");
      
      const sessions = await storage.getWorkSessionsByProject(req.params.projectId, companyId);
      
      // Filter financial data if user doesn't have financial permissions
      const filteredSessions = canViewFinancialData ? sessions : sessions.map(session => ({
        ...session,
        techHourlyRate: null,
      }));
      
      res.json({ sessions: filteredSessions });
    } catch (error) {
      console.error("Get work sessions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get all work sessions across all company projects
  app.get("/api/all-work-sessions", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Determine company ID
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Check if user has financial permissions
      const canViewFinancialData = currentUser.role === "company" || 
                                    currentUser.role === "operations_manager" || 
                                    currentUser.role === "supervisor" || 
                                    currentUser.permissions?.includes("view_financial_data");
      
      // Get all projects for the company
      const projects = await storage.getProjectsByCompany(companyId);
      
      // Collect all work sessions across all projects with their project's daily target
      const allSessions = [];
      for (const project of projects) {
        const projectSessions = await storage.getWorkSessionsByProject(project.id, companyId);
        // Add dailyDropTarget and calculate total dropsCompleted from elevation fields
        const sessionsWithTarget = projectSessions.map(session => ({
          ...session,
          dailyDropTarget: project.dailyDropTarget,
          dropsCompleted: (session.dropsCompletedNorth || 0) + 
                         (session.dropsCompletedEast || 0) + 
                         (session.dropsCompletedSouth || 0) + 
                         (session.dropsCompletedWest || 0),
        }));
        allSessions.push(...sessionsWithTarget);
      }
      
      // Filter financial data if user doesn't have financial permissions
      const filteredSessions = canViewFinancialData ? allSessions : allSessions.map(session => ({
        ...session,
        techHourlyRate: null,
      }));
      
      res.json({ sessions: filteredSessions });
    } catch (error) {
      console.error("Failed to fetch all work sessions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get active workers (sessions without end time) - Management only
  app.get("/api/active-workers", requireAuth, requireRole("company", "operations_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Determine company ID
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Check if user has financial permissions
      const canViewFinancialData = currentUser.role === "company" || 
                                    currentUser.role === "operations_manager" || 
                                    currentUser.role === "supervisor" || 
                                    currentUser.permissions?.includes("view_financial_data");
      
      // Get all projects for the company
      const projects = await storage.getProjectsByCompany(companyId);
      
      // Collect all active work sessions (no end time)
      const activeSessions = [];
      for (const project of projects) {
        const projectSessions = await storage.getWorkSessionsByProject(project.id, companyId);
        // Filter for active sessions and add project info
        const activeProjectSessions = projectSessions
          .filter(session => !session.endTime)
          .map(session => ({
            ...session,
            projectName: project.buildingName,
            strataPlanNumber: project.strataPlanNumber,
            jobType: project.jobType,
          }));
        activeSessions.push(...activeProjectSessions);
      }
      
      // Sort by start time (oldest first)
      activeSessions.sort((a, b) => {
        const aTime = a.startTime ? new Date(a.startTime).getTime() : 0;
        const bTime = b.startTime ? new Date(b.startTime).getTime() : 0;
        return aTime - bTime;
      });
      
      // Filter financial data if user doesn't have financial permissions
      const filteredSessions = canViewFinancialData ? activeSessions : activeSessions.map(session => ({
        ...session,
        techHourlyRate: null,
      }));
      
      res.json({ sessions: filteredSessions });
    } catch (error) {
      console.error("Failed to fetch active workers:", error);
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
  
  // ==================== NON-BILLABLE WORK SESSION ROUTES ====================
  
  // Start a non-billable work session
  app.post("/api/non-billable-sessions", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if employee already has an active non-billable session
      const activeSession = await storage.getActiveNonBillableSession(currentUser.id);
      if (activeSession) {
        return res.status(400).json({ message: "You already have an active non-billable session" });
      }
      
      console.log("Creating non-billable session with data:", {
        employeeId: currentUser.id,
        companyId: currentUser.companyId || currentUser.id,
        workDate: new Date(),
        startTime: new Date(),
        endTime: null,
        description: req.body.description,
      });
      
      const session = await storage.createNonBillableWorkSession({
        employeeId: currentUser.id,
        companyId: currentUser.companyId || currentUser.id,
        workDate: new Date(),
        startTime: new Date(),
        endTime: null,
        description: req.body.description,
      });
      
      console.log("Session created successfully:", session);
      res.json({ session });
    } catch (error) {
      console.error("Start non-billable session error:", error);
      console.error("Error stack:", (error as Error).stack);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // End a non-billable work session
  app.patch("/api/non-billable-sessions/:sessionId/end", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const session = await storage.getNonBillableSessionById(req.params.sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      // Verify ownership
      if (session.employeeId !== currentUser.id) {
        return res.status(403).json({ message: "You can only end your own sessions" });
      }
      
      if (session.endTime) {
        return res.status(400).json({ message: "Session already ended" });
      }
      
      const updatedSession = await storage.endNonBillableWorkSession(req.params.sessionId);
      res.json({ session: updatedSession });
    } catch (error) {
      console.error("End non-billable session error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get active non-billable session for current user
  app.get("/api/non-billable-sessions/active", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const session = await storage.getActiveNonBillableSession(currentUser.id);
      res.json({ session: session || null });
    } catch (error) {
      console.error("Get active non-billable session error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get all non-billable sessions for company (management only)
  app.get("/api/non-billable-sessions", requireAuth, requireRole("company", "operations_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      const sessions = await storage.getAllNonBillableSessions(companyId!);
      res.json({ sessions });
    } catch (error) {
      console.error("Get non-billable sessions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get non-billable sessions by employee (management only)
  app.get("/api/non-billable-sessions/employee/:employeeId", requireAuth, requireRole("company", "operations_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const sessions = await storage.getNonBillableSessionsByEmployee(req.params.employeeId);
      res.json({ sessions });
    } catch (error) {
      console.error("Get non-billable sessions by employee error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ==================== COMPLAINT ROUTES ====================
  
  // Create complaint (with optional photo upload)
  app.post("/api/complaints", requireAuth, imageUpload.single('photo'), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      let companyId = req.body.companyId;
      
      // Resolve companyId before validation
      if (!companyId) {
        // If projectId is provided, get company from project
        if (req.body.projectId) {
          const project = await storage.getProjectById(req.body.projectId);
          if (project) {
            companyId = project.companyId;
          }
        }
        // For residents without projectId, find company from their strataPlanNumber
        else if (currentUser?.role === "resident" && currentUser.strataPlanNumber) {
          const projects = await storage.getProjectsByStrataPlan(currentUser.strataPlanNumber);
          if (projects.length > 0) {
            companyId = projects[0].companyId;
          } else {
            return res.status(400).json({ 
              message: "No company found for your building. Please contact support." 
            });
          }
        }
      }
      
      // Handle photo upload if provided
      let photoUrl = null;
      if (req.file) {
        const objectStorageService = new ObjectStorageService();
        const timestamp = Date.now();
        const filename = `complaints/${companyId}/${timestamp}-${req.file.originalname}`;
        photoUrl = await objectStorageService.uploadPublicFile(
          filename,
          req.file.buffer,
          req.file.mimetype
        );
      }
      
      // Now validate with companyId resolved
      const complaintData = insertComplaintSchema.parse({
        ...req.body,
        companyId,
        photoUrl,
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
  
  // Get all complaints (filtered by role) - for management dashboard
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
  
  // Get complaints for a specific project
  app.get("/api/projects/:id/complaints", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const projectId = req.params.id;
      
      // Verify user has access to this project
      const project = await storage.getProjectById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Check access based on role
      if (currentUser.role === "company") {
        if (project.companyId !== currentUser.id) {
          return res.status(403).json({ message: "Access denied" });
        }
      } else if (currentUser.role === "operations_manager" || currentUser.role === "supervisor" || currentUser.role === "rope_access_tech") {
        if (project.companyId !== currentUser.companyId) {
          return res.status(403).json({ message: "Access denied" });
        }
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Get complaints for this project
      const complaints = await storage.getComplaintsByProject(projectId);
      
      res.json({ complaints });
    } catch (error) {
      console.error("Get project complaints error:", error);
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
  app.get("/api/complaints/:id/notes", requireAuth, async (req: Request, res: Response) => {
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
      
      const allNotes = await storage.getNotesByComplaint(req.params.id);
      
      // Residents can only see notes marked as visible to residents
      // Staff can see all notes
      const notes = currentUser.role === "resident" 
        ? allNotes.filter(note => note.visibleToResident) 
        : allNotes;
      
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
        visibleToResident: req.body.visibleToResident || false,
      });
      
      const noteWithUserName = {
        ...noteData,
        userName: currentUser.name || currentUser.email || "Staff",
      };
      
      const note = await storage.createComplaintNote(noteWithUserName);
      res.json({ note });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create complaint note error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Gear items routes
  app.get("/api/gear-items", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const items = await storage.getGearItemsByCompany(companyId);
      
      // Filter out financial data if user doesn't have permission
      const hasFinancialPermission = currentUser.role === "company" || 
        (currentUser.permissions && currentUser.permissions.includes("view_financial_data"));
      
      const filteredItems = items.map(item => {
        if (!hasFinancialPermission) {
          const { itemPrice, ...rest } = item;
          return rest;
        }
        return item;
      });
      
      res.json({ items: filteredItems });
    } catch (error) {
      console.error("Get gear items error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/gear-items", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Clean empty strings to undefined/null for optional fields
      const cleanedBody = {
        equipmentType: req.body.equipmentType || null,
        brand: req.body.brand || null,
        model: req.body.model || null,
        itemPrice: req.body.itemPrice || null,
        assignedTo: req.body.assignedTo?.trim() || "Not in use",
        notes: req.body.notes || null,
        quantity: req.body.quantity || 1,
        serialNumbers: req.body.serialNumbers || null,
        dateInService: req.body.dateInService || null,
        dateOutOfService: req.body.dateOutOfService || null,
        inService: req.body.inService !== undefined ? req.body.inService : true,
      };
      
      const itemData = insertGearItemSchema.parse({
        ...cleanedBody,
        companyId,
        employeeId: req.session.userId,
      });
      
      const item = await storage.createGearItem(itemData);
      res.json({ item });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create gear item error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/gear-items/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Clean empty strings to null for optional fields
      const cleanedBody: Partial<InsertGearItem> = {};
      if (req.body.equipmentType !== undefined) cleanedBody.equipmentType = req.body.equipmentType || null;
      if (req.body.brand !== undefined) cleanedBody.brand = req.body.brand || null;
      if (req.body.model !== undefined) cleanedBody.model = req.body.model || null;
      if (req.body.itemPrice !== undefined) cleanedBody.itemPrice = req.body.itemPrice || null;
      if (req.body.assignedTo !== undefined) cleanedBody.assignedTo = req.body.assignedTo?.trim() || "Not in use";
      if (req.body.notes !== undefined) cleanedBody.notes = req.body.notes || null;
      if (req.body.quantity !== undefined) cleanedBody.quantity = req.body.quantity;
      if (req.body.serialNumbers !== undefined) cleanedBody.serialNumbers = req.body.serialNumbers || null;
      if (req.body.dateInService !== undefined) cleanedBody.dateInService = req.body.dateInService || null;
      if (req.body.dateOutOfService !== undefined) cleanedBody.dateOutOfService = req.body.dateOutOfService || null;
      if (req.body.inService !== undefined) cleanedBody.inService = req.body.inService;
      
      const item = await storage.updateGearItem(req.params.id, cleanedBody);
      res.json({ item });
    } catch (error) {
      console.error("Update gear item error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/gear-items/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      await storage.deleteGearItem(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete gear item error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Harness inspection routes
  app.post("/api/harness-inspections", requireAuth, requireRole("rope_access_tech", "supervisor", "operations_manager", "company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Convert empty strings to undefined for optional fields
      const cleanedBody = {
        ...req.body,
        dateInService: req.body.dateInService || undefined,
        projectId: (req.body.projectId === "none" || !req.body.projectId) ? undefined : req.body.projectId,
      };
      
      const inspectionData = insertHarnessInspectionSchema.parse({
        ...cleanedBody,
        companyId,
        workerId: req.session.userId,
      });
      
      const inspection = await storage.createHarnessInspection(inspectionData);
      res.json({ inspection });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create harness inspection error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/harness-inspections", requireAuth, requireRole("operations_manager", "supervisor", "company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const inspections = await storage.getHarnessInspectionsByCompany(companyId);
      res.json({ inspections });
    } catch (error) {
      console.error("Get harness inspections error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/my-harness-inspections", requireAuth, requireRole("rope_access_tech"), async (req: Request, res: Response) => {
    try {
      const inspections = await storage.getHarnessInspectionsByWorker(req.session.userId!);
      res.json({ inspections });
    } catch (error) {
      console.error("Get my harness inspections error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/harness-inspections/:id", requireAuth, requireRole("operations_manager", "supervisor", "company"), async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await storage.deleteHarnessInspection(id);
      res.json({ message: "Harness inspection deleted successfully" });
    } catch (error) {
      console.error("Delete harness inspection error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Toolbox meeting routes
  app.post("/api/toolbox-meetings", requireAuth, requireRole("rope_access_tech", "supervisor", "operations_manager", "company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const meetingData = insertToolboxMeetingSchema.parse({
        ...req.body,
        companyId,
        conductedBy: req.session.userId,
      });
      
      const meeting = await storage.createToolboxMeeting(meetingData);
      res.json({ meeting });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create toolbox meeting error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/toolbox-meetings", requireAuth, requireRole("operations_manager", "supervisor", "company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const meetings = await storage.getToolboxMeetingsByCompany(companyId);
      res.json({ meetings });
    } catch (error) {
      console.error("Get toolbox meetings error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/projects/:projectId/toolbox-meetings", requireAuth, async (req: Request, res: Response) => {
    try {
      const meetings = await storage.getToolboxMeetingsByProject(req.params.projectId);
      res.json({ meetings });
    } catch (error) {
      console.error("Get project toolbox meetings error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/toolbox-meetings/:id", requireAuth, requireRole("operations_manager", "supervisor", "company"), async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await storage.deleteToolboxMeeting(id);
      res.json({ message: "Toolbox meeting deleted successfully" });
    } catch (error) {
      console.error("Delete toolbox meeting error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ==================== JOB COMMENTS ROUTES ====================
  
  // Create job comment
  app.post("/api/projects/:projectId/comments", requireAuth, requireRole("rope_access_tech", "supervisor", "operations_manager", "company"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const commentData = insertJobCommentSchema.parse({
        projectId: req.params.projectId,
        companyId,
        userId: currentUser.id,
        userName: currentUser.name || currentUser.email || "Unknown User",
        comment: req.body.comment,
      });
      
      const comment = await storage.createJobComment(commentData);
      res.json({ comment });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create job comment error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get job comments for a project
  app.get("/api/projects/:projectId/comments", requireAuth, async (req: Request, res: Response) => {
    try {
      const comments = await storage.getJobCommentsByProject(req.params.projectId);
      res.json({ comments });
    } catch (error) {
      console.error("Get job comments error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ==================== PAYROLL / PAY PERIOD ROUTES ====================
  
  // Get or create pay period configuration
  app.get("/api/payroll/config", requireAuth, requireRole("company", "operations_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const config = await storage.getPayPeriodConfig(companyId);
      res.json({ config });
    } catch (error) {
      console.error("Get pay period config error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create or update pay period configuration
  app.post("/api/payroll/config", requireAuth, requireRole("company", "operations_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const configData = insertPayPeriodConfigSchema.parse({
        ...req.body,
        companyId,
      });
      
      const config = await storage.upsertPayPeriodConfig(configData);
      res.json({ config });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create/update pay period config error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Generate pay periods
  app.post("/api/payroll/generate-periods", requireAuth, requireRole("company", "operations_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const numberOfPeriods = req.body.numberOfPeriods || 6;
      const clearExisting = req.body.clearExisting || false;
      
      // Clear existing pay periods if requested (typically when changing configuration)
      if (clearExisting) {
        await storage.deleteAllPayPeriodsForCompany(companyId);
      }
      
      const periods = await storage.generatePayPeriods(companyId, numberOfPeriods);
      res.json({ periods });
    } catch (error) {
      console.error("Generate pay periods error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all pay periods for company
  app.get("/api/payroll/periods", requireAuth, requireRole("company", "operations_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const periods = await storage.getPayPeriodsByCompany(companyId);
      res.json({ periods });
    } catch (error) {
      console.error("Get pay periods error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get current pay period
  app.get("/api/payroll/current-period", requireAuth, requireRole("company", "operations_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const period = await storage.getCurrentPayPeriod(companyId);
      res.json({ period });
    } catch (error) {
      console.error("Get current pay period error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get employee hours for a specific pay period
  app.get("/api/payroll/periods/:periodId/hours", requireAuth, requireRole("company", "operations_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const period = await storage.getPayPeriodById(req.params.periodId);
      
      if (!period) {
        return res.status(404).json({ message: "Pay period not found" });
      }
      
      if (period.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const hoursSummary = await storage.getEmployeeHoursForPayPeriod(companyId, period.startDate, period.endDate);
      res.json({ hoursSummary, period });
    } catch (error) {
      console.error("Get employee hours error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get employee hours for date range
  app.get("/api/payroll/hours", requireAuth, requireRole("company", "operations_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "startDate and endDate are required" });
      }
      
      const hoursSummary = await storage.getEmployeeHoursForPayPeriod(companyId, startDate as string, endDate as string);
      res.json({ hoursSummary });
    } catch (error) {
      console.error("Get employee hours error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ==================== QUOTE ROUTES ====================
  
  // Create new quote with services (atomic transaction) - All employees can create quotes
  app.post("/api/quotes", requireAuth, requireRole("company", "operations_manager", "supervisor", "rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"), async (req: Request, res: Response) => {
    let createdQuoteId: string | null = null;
    
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const { services, ...quoteFields } = req.body;
      
      // Validate that at least one service is provided
      if (!services || !Array.isArray(services) || services.length === 0) {
        return res.status(400).json({ message: "At least one service is required for a quote" });
      }
      
      // Check if user has financial permissions
      const canViewFinancialData = currentUser.role === "company" || 
                                    currentUser.permissions?.includes("view_financial_data");
      
      // Determine initial status based on user role
      // Workers create drafts, management creates open quotes
      const isWorker = ["rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"].includes(currentUser.role);
      const initialStatus = isWorker ? "draft" : "open";
      
      const quoteData = insertQuoteSchema.parse({
        ...quoteFields,
        companyId,
        createdBy: currentUser.id,
        status: initialStatus,
      });
      
      // Create the quote
      const quote = await storage.createQuote(quoteData);
      createdQuoteId = quote.id;
      
      // Create all services - if any fail, rollback the quote
      try {
        for (const serviceData of services) {
          // Strip pricing fields if user doesn't have financial permissions
          const processedServiceData = canViewFinancialData 
            ? serviceData 
            : {
                ...serviceData,
                pricePerHour: undefined,
                pricePerStall: undefined,
                dryerVentPricePerUnit: undefined,
                totalHours: undefined,
                totalCost: undefined,
              };
          
          const service = insertQuoteServiceSchema.parse({
            ...processedServiceData,
            quoteId: quote.id,
          });
          await storage.createQuoteService(service);
        }
      } catch (serviceError) {
        // Rollback: delete the quote if service creation failed
        await storage.deleteQuote(quote.id);
        throw new Error(`Failed to create services: ${serviceError instanceof Error ? serviceError.message : 'Unknown error'}`);
      }
      
      // Get the complete quote with services
      const quoteWithServices = await storage.getQuoteById(quote.id);
      res.json({ quote: quoteWithServices });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create quote error:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Internal server error" });
    }
  });

  // Get all quotes for company - All employees can view
  app.get("/api/quotes", requireAuth, requireRole("company", "operations_manager", "supervisor", "rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Check if user has financial permissions
      const canViewFinancialData = currentUser.role === "company" || 
                                    currentUser.permissions?.includes("view_financial_data");
      
      const status = req.query.status as string | undefined;
      let quotes = await storage.getQuotesByCompany(companyId, status);
      
      // Workers can only see quotes they created
      const isWorker = ["rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"].includes(currentUser.role);
      if (isWorker) {
        quotes = quotes.filter(quote => quote.createdBy === currentUser.id);
      }
      
      // Filter pricing data if user doesn't have financial permissions
      const filteredQuotes = canViewFinancialData ? quotes : quotes.map(quote => ({
        ...quote,
        services: quote.services.map(service => ({
          ...service,
          pricePerHour: null,
          pricePerStall: null,
          dryerVentPricePerUnit: null,
          totalHours: null,
          totalCost: null,
        })),
      }));
      
      res.json({ quotes: filteredQuotes });
    } catch (error) {
      console.error("Get quotes error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get quote by ID - All employees can view
  app.get("/api/quotes/:id", requireAuth, requireRole("company", "operations_manager", "supervisor", "rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      // Check if user has financial permissions
      const canViewFinancialData = currentUser.role === "company" || 
                                    currentUser.permissions?.includes("view_financial_data");
      
      const quote = await storage.getQuoteById(req.params.id);
      
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      if (quote.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Workers can only view quotes they created
      const isWorker = ["rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"].includes(currentUser.role);
      if (isWorker && quote.createdBy !== currentUser.id) {
        return res.status(403).json({ message: "You can only view quotes you created" });
      }
      
      // Filter pricing data if user doesn't have financial permissions
      const filteredQuote = canViewFinancialData ? quote : {
        ...quote,
        services: quote.services.map(service => ({
          ...service,
          pricePerHour: null,
          pricePerStall: null,
          dryerVentPricePerUnit: null,
          totalHours: null,
          totalCost: null,
        })),
      };
      
      res.json({ quote: filteredQuote });
    } catch (error) {
      console.error("Get quote error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update quote - Management and workers with edit_quotes permission
  app.patch("/api/quotes/:id", requireAuth, requireRole("company", "operations_manager", "supervisor", "rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user has edit permissions
      // Management can edit any quote, workers can edit their own quotes
      const isManagement = ["company", "operations_manager", "supervisor"].includes(currentUser.role);
      const hasEditPermission = currentUser.permissions?.includes("edit_quotes");
      const isWorker = ["rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"].includes(currentUser.role);
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const quote = await storage.getQuoteById(req.params.id);
      
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      if (quote.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Workers can only edit quotes they created
      if (isWorker && quote.createdBy !== currentUser.id) {
        return res.status(403).json({ message: "You can only edit quotes you created" });
      }
      
      // Non-management without edit permission cannot edit
      if (!isManagement && !hasEditPermission && !isWorker) {
        return res.status(403).json({ message: "Forbidden - You don't have permission to edit quotes" });
      }
      
      const { services, ...quoteFields } = req.body;
      
      // Check if user has financial permissions
      const canViewFinancialData = currentUser.role === "company" || 
                                    currentUser.permissions?.includes("view_financial_data");
      
      // If services are provided, update the whole quote with services
      if (services && Array.isArray(services)) {
        // Process services to strip pricing fields if user doesn't have financial permissions
        const processedServices = services.map(serviceData => {
          const processedServiceData = canViewFinancialData 
            ? serviceData 
            : {
                ...serviceData,
                pricePerHour: undefined,
                pricePerStall: undefined,
                dryerVentPricePerUnit: undefined,
                totalHours: undefined,
                totalCost: undefined,
              };
          
          return insertQuoteServiceSchema.parse({
            ...processedServiceData,
            quoteId: quote.id,
          });
        });
        
        const updatedQuote = await storage.updateQuoteWithServices(
          req.params.id, 
          quoteFields,
          processedServices
        );
        
        // Filter pricing data from response if user doesn't have financial permissions
        const filteredQuote = canViewFinancialData ? updatedQuote : {
          ...updatedQuote,
          services: updatedQuote.services.map(service => ({
            ...service,
            pricePerHour: null,
            pricePerStall: null,
            dryerVentPricePerUnit: null,
            totalHours: null,
            totalCost: null,
          })),
        };
        
        res.json({ quote: filteredQuote });
      } else {
        // If no services, just update quote metadata
        const updatedQuote = await storage.updateQuote(req.params.id, quoteFields);
        res.json({ quote: updatedQuote });
      }
    } catch (error) {
      console.error("Update quote error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete quote
  app.delete("/api/quotes/:id", requireAuth, requireRole("company", "operations_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const quote = await storage.getQuoteById(req.params.id);
      
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      if (quote.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteQuote(req.params.id);
      res.json({ message: "Quote deleted successfully" });
    } catch (error) {
      console.error("Delete quote error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update quote status - Flexible endpoint for status transitions
  app.patch("/api/quotes/:id/status", requireAuth, requireRole("company", "operations_manager", "supervisor", "rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"), async (req: Request, res: Response) => {
    try {
      const statusSchema = z.object({
        status: z.enum(["draft", "submitted", "open", "approved", "rejected"]),
      });
      
      const { status } = statusSchema.parse(req.body);
      
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const quote = await storage.getQuoteById(req.params.id);
      
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      if (quote.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const isManagement = ["company", "operations_manager", "supervisor"].includes(currentUser.role);
      const isWorker = ["rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"].includes(currentUser.role);
      
      // Permission checks based on role and transition
      if (status === "submitted") {
        // Workers can only submit their own drafts
        if (isWorker && quote.createdBy !== currentUser.id) {
          return res.status(403).json({ message: "You can only submit quotes you created" });
        }
        // Only draft quotes can be submitted
        if (quote.status !== "draft") {
          return res.status(400).json({ message: "Only draft quotes can be submitted" });
        }
      } else if (status === "open" || status === "approved" || status === "rejected") {
        // Only management can change to these statuses
        if (!isManagement) {
          return res.status(403).json({ message: "Only management can approve, reject, or open quotes" });
        }
      }
      
      const updatedQuote = await storage.updateQuote(req.params.id, { status });
      
      res.json({ quote: updatedQuote, message: `Quote status updated to ${status}` });
    } catch (error) {
      console.error("Update quote status error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Upload quote photo - All employees can upload photos
  app.post("/api/quotes/:id/photo", requireAuth, requireRole("company", "operations_manager", "supervisor", "rope_access_tech", "manager", "ground_crew", "ground_crew_supervisor"), imageUpload.single("photo"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const quote = await storage.getQuoteById(req.params.id);
      
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      if (quote.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: "No photo file uploaded" });
      }
      
      const objectStorageService = new ObjectStorageService();
      const timestamp = Date.now();
      const filename = `quotes/${companyId}/${timestamp}-${req.file.originalname}`;
      const photoUrl = await objectStorageService.uploadPublicFile(
        filename,
        req.file.buffer,
        req.file.mimetype
      );
      const updatedQuote = await storage.updateQuote(req.params.id, { photoUrl });
      
      res.json({ quote: updatedQuote, photoUrl });
    } catch (error) {
      console.error("Upload quote photo error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ==================== QUOTE SERVICE ROUTES ====================

  // Add service to existing quote
  app.post("/api/quotes/:id/services", requireAuth, requireRole("company", "operations_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const quote = await storage.getQuoteById(req.params.id);
      
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      if (quote.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const serviceData = insertQuoteServiceSchema.parse({
        ...req.body,
        quoteId: req.params.id,
      });
      
      const service = await storage.createQuoteService(serviceData);
      res.json({ service });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Create quote service error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete quote service
  app.delete("/api/quotes/:id/services/:serviceId", requireAuth, requireRole("company", "operations_manager", "supervisor"), async (req: Request, res: Response) => {
    try {
      const currentUser = await storage.getUserById(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const companyId = currentUser.role === "company" ? currentUser.id : currentUser.companyId;
      if (!companyId) {
        return res.status(400).json({ message: "Unable to determine company" });
      }
      
      const quote = await storage.getQuoteById(req.params.id);
      
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      if (quote.companyId !== companyId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteQuoteService(req.params.serviceId);
      res.json({ message: "Service deleted successfully" });
    } catch (error) {
      console.error("Delete quote service error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
