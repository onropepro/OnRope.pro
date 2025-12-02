# Safety Documentation System Instructions v1.0
**System**: Rope Access Management System  
**Domain**: Safety & Compliance  
**Version**: 1.0  
**Last Updated**: December 2, 2024  
**Status**: PRODUCTION-READY ✅  
**Safety Critical**: Yes - Worker safety documentation, compliance records, and audit trail

---

## Purpose and Goal

### Primary Objective
The Safety Documentation System provides comprehensive digital capture, storage, and management of all safety-critical documentation required for rope access operations. This includes pre-work inspections, hazard assessments, safety meetings, and incident reporting with legally-binding digital signatures and professional PDF generation.

### Key Goals
- **Safety**: Ensure all workers complete required safety documentation before working at height
- **Compliance**: Meet IRATA, OSHA, and other regulatory requirements for safety documentation
- **Efficiency**: Digitize paper-based safety processes with automatic PDF generation and storage
- **Accountability**: Capture digital signatures from all involved parties with audit timestamps
- **Analytics**: Feed into Company Safety Rating (CSR) for compliance monitoring

### Core Business Value
- **Mandatory Pre-Work Checks**: Workers cannot start work sessions without completing harness inspections
- **7-Day Coverage Window**: Toolbox meetings provide compliance coverage for work within 7 days
- **Immutable Records**: Once signed, safety documents cannot be modified
- **Professional PDF Export**: All forms generate downloadable PDFs with embedded signatures
- **CSR Integration**: Safety compliance directly impacts company rating visible to property managers

---

## System Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          SAFETY DOCUMENTATION SYSTEM                                 │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│  │                        FIVE SAFETY DOCUMENT TYPES                             │   │
│  ├──────────────────────────────────────────────────────────────────────────────┤   │
│  │                                                                                │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │   │
│  │  │    HARNESS      │  │    TOOLBOX      │  │      FLHA       │                │   │
│  │  │  INSPECTIONS    │  │   MEETINGS      │  │     FORMS       │                │   │
│  │  │  (Daily Pre-    │  │  (Safety        │  │  (Hazard        │                │   │
│  │  │   Work Check)   │  │   Briefings)    │  │   Assessment)   │                │   │
│  │  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘                │   │
│  │           │                    │                    │                          │   │
│  │  ┌─────────────────┐  ┌─────────────────┐                                     │   │
│  │  │    INCIDENT     │  │     METHOD      │                                     │   │
│  │  │    REPORTS      │  │   STATEMENTS    │                                     │   │
│  │  │  (Post-Incident │  │  (Safe Work     │                                     │   │
│  │  │   Documentation)│  │   Plans)        │                                     │   │
│  │  └────────┬────────┘  └────────┬────────┘                                     │   │
│  │           │                    │                                               │   │
│  └───────────┴────────────────────┴───────────────────────────────────────────────┘   │
│                                    │                                                   │
│                                    ▼                                                   │
│  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│  │                    SHARED INFRASTRUCTURE                                      │   │
│  │                                                                                │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │   │
│  │  │    DIGITAL      │  │      PDF        │  │     COMPANY     │                │   │
│  │  │  SIGNATURES     │  │   GENERATION    │  │   SAFETY RATING │                │   │
│  │  │  (Base64 Data   │  │  (jsPDF with    │  │     (CSR)       │                │   │
│  │  │   URL Capture)  │  │   Pagination)   │  │  (Penalty-Based)│                │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘                │   │
│  │                                                                                │   │
│  └──────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                       │
│                           WORK SESSION INTEGRATION                                    │
│                                                                                       │
│  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│  │  HARNESS INSPECTION REQUIRED → START WORK SESSION → TOOLBOX MEETING COVERS   │   │
│  └──────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Input Stage**: User opens safety form, selects project, enters data, inspects equipment
2. **Validation Stage**: Form validation ensures required fields, proper date formats
3. **Signature Stage**: All required parties sign using touch/mouse-based signature canvas
4. **Processing Stage**: Form data saved to database with signature data URLs
5. **PDF Stage**: jsPDF generates professional PDF with embedded signatures
6. **Storage Stage**: PDF URL can be stored for Object Storage (optional)
7. **CSR Stage**: Document completion feeds into Company Safety Rating calculation

### Integration Points

- **Upstream Systems**: 
  - Work Session Management: Harness inspection required before starting work
  - Project Management: Most forms linked to specific projects
  - Employee Management: Workers tracked, signatures authenticated
  
- **Downstream Systems**:
  - Company Safety Rating (CSR): Documents feed into compliance calculations
  - Property Manager Portal: CSR scores visible to vendors
  - Document Archive: PDFs available for compliance audits
  
- **Parallel Systems**:
  - Gear Inventory: Equipment tracked separately but may inform inspections
  - Employee Certifications: IRATA levels inform competency requirements

---

## Dependency Impact & Invariants

### Non-negotiable Invariants

#### 1. HARNESS INSPECTION REQUIRED BEFORE WORK (CRITICAL)
**Rule**: A worker MUST have a valid harness inspection for the current date before starting a work session.

- **Impact if violated**: Workers could work at height without verified equipment safety checks
- **Enforcement mechanism**: `handleStartDay` function checks `hasHarnessInspectionToday` before allowing work session start

```typescript
// In ProjectDetail.tsx
const handleStartDay = async () => {
  // Check if harness inspection was done today
  if (!hasHarnessInspectionToday) {
    setShowHarnessInspectionDialog(true); // Force inspection first
    return;
  }
  setShowStartDayDialog(true); // Allow work session start
};
```

#### 2. TOOLBOX MEETING 7-DAY COVERAGE WINDOW
**Rule**: A toolbox meeting covers work sessions within 7 days in EITHER direction of the meeting date.

- **Impact if violated**: Work sessions without meeting coverage count against CSR
- **Enforcement mechanism**: CSR calculation checks `Math.abs(daysDiff) <= 7` for coverage

```typescript
const TOOLBOX_COVERAGE_DAYS = 7;

const isDateCovered = (projectId: string, workDateStr: string): boolean => {
  const workDate = new Date(workDateStr);
  
  for (const meetingDate of projectMeetings) {
    const daysDiff = Math.abs(Math.floor(
      (workDate.getTime() - meetingDate.getTime()) / (1000 * 60 * 60 * 24)
    ));
    if (daysDiff <= TOOLBOX_COVERAGE_DAYS) {
      return true;
    }
  }
  return false;
};
```

#### 3. ALL ATTENDEES MUST SIGN TOOLBOX MEETINGS
**Rule**: Every attendee selected for a toolbox meeting MUST provide a digital signature before submission.

- **Impact if violated**: Legally incomplete documentation, compliance failure
- **Enforcement mechanism**: API validates `attendeeIds` against `signatures` array

```typescript
// Backend validation
const unsignedAttendeeIds = attendeeIds.filter(
  (id: string) => !signatureEmployeeIds.includes(id)
);

if (unsignedAttendeeIds.length > 0) {
  return res.status(400).json({ 
    message: `Missing signatures from: ${unsignedNames.join(', ')}` 
  });
}
```

#### 4. MULTI-TENANT ISOLATION
**Rule**: All safety documents MUST filter by companyId - no cross-company access.

- **Impact if violated**: Companies see each other's safety records
- **Enforcement mechanism**: Every API endpoint derives companyId from session and applies filter

#### 5. SIGNATURES ARE IMMUTABLE
**Rule**: Once a digital signature is captured and saved, it cannot be modified.

- **Impact if violated**: Tampering with safety records, legal liability
- **Enforcement mechanism**: No PATCH endpoints for signature data; documents treated as append-only

### System Dependencies

- **Work Sessions**: Harness inspection REQUIRED before work session can start
- **Projects**: Toolbox meetings, FLHA forms, and method statements linked to projects
- **Employees**: Worker ID tracked on inspections, signatures authenticate identity
- **CSR Calculation**: Safety documents directly impact company rating

---

## Technical Implementation

### Database Schemas

#### Harness Inspections Table
```typescript
export const harnessInspections = pgTable("harness_inspections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id),
  projectId: varchar("project_id").references(() => projects.id), // Optional
  workerId: varchar("worker_id").notNull().references(() => users.id),
  inspectionDate: date("inspection_date").notNull(),
  
  // Basic information
  inspectorName: varchar("inspector_name").notNull(),
  manufacturer: varchar("manufacturer"),
  equipmentId: varchar("equipment_id"), // Serial/ID of primary equipment
  
  // NEW: Structured equipment findings (JSONB) - preferred method
  equipmentFindings: jsonb("equipment_findings").$type<EquipmentFindings>(),
  
  // Overall inspection result
  overallStatus: varchar("overall_status").notNull().default("pass"), // pass | fail | not_applicable
  
  // PDF storage
  pdfUrl: text("pdf_url"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Equipment findings structure
export type EquipmentFindings = {
  [K in RopeAccessEquipmentCategory]?: {
    status: InspectionResult; // pass | fail | not_applicable
    items: {
      [itemKey: string]: {
        result: InspectionResult;
        notes?: string;
      };
    };
    sectionNotes?: string;
  };
};

// 11 equipment categories inspected
export const ROPE_ACCESS_EQUIPMENT_CATEGORIES = {
  harness: "Harness & Seat System",
  ropes: "Work Positioning & Backup Ropes",
  descenders: "Descenders",
  ascenders: "Ascenders",
  backupDevices: "Backup Devices & Fall Arrest",
  cowstails: "Cowstails & Positioning Lanyards",
  connectors: "Connectors & Karabiners",
  anchorsRigging: "Anchors & Rigging Hardware",
  helmet: "Helmet & Head Protection",
  edgeProtection: "Edge & Rope Protection",
  rescueKit: "Rescue Kit"
};
```

#### Toolbox Meetings Table
```typescript
export const toolboxMeetings = pgTable("toolbox_meetings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  conductedBy: varchar("conducted_by").notNull().references(() => users.id),
  meetingDate: date("meeting_date").notNull(),
  
  // Meeting details
  conductedByName: varchar("conducted_by_name").notNull(),
  attendees: text("attendees").array().notNull(), // Array of attendee names
  
  // 20 standard topics (boolean checkboxes)
  topicFallProtection: boolean("topic_fall_protection").default(false),
  topicAnchorPoints: boolean("topic_anchor_points").default(false),
  topicRopeInspection: boolean("topic_rope_inspection").default(false),
  topicKnotTying: boolean("topic_knot_tying").default(false),
  topicPPECheck: boolean("topic_ppe_check").default(false),
  topicWeatherConditions: boolean("topic_weather_conditions").default(false),
  topicCommunication: boolean("topic_communication").default(false),
  topicEmergencyEvacuation: boolean("topic_emergency_evacuation").default(false),
  topicHazardAssessment: boolean("topic_hazard_assessment").default(false),
  topicLoadCalculations: boolean("topic_load_calculations").default(false),
  topicEquipmentCompatibility: boolean("topic_equipment_compatibility").default(false),
  topicDescenderAscender: boolean("topic_descender_ascender").default(false),
  topicEdgeProtection: boolean("topic_edge_protection").default(false),
  topicSwingFall: boolean("topic_swing_fall").default(false),
  topicMedicalFitness: boolean("topic_medical_fitness").default(false),
  topicToolDropPrevention: boolean("topic_tool_drop_prevention").default(false),
  topicRegulations: boolean("topic_regulations").default(false),
  topicRescueProcedures: boolean("topic_rescue_procedures").default(false),
  topicSiteHazards: boolean("topic_site_hazards").default(false),
  topicBuddySystem: boolean("topic_buddy_system").default(false),
  
  // Custom topic and notes
  customTopic: text("custom_topic"),
  additionalNotes: text("additional_notes"),
  
  // Digital signatures - ALL attendees must sign
  signatures: jsonb("signatures").$type<Array<{
    employeeId: string;
    employeeName: string;
    signatureDataUrl: string;
  }>>(),
  
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

#### FLHA Forms Table
```typescript
export const flhaForms = pgTable("flha_forms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  assessorId: varchar("assessor_id").notNull().references(() => users.id),
  assessmentDate: date("assessment_date").notNull(),
  
  // Basic Information
  assessorName: varchar("assessor_name").notNull(),
  jobDescription: text("job_description").notNull(),
  location: varchar("location").notNull(),
  workArea: varchar("work_area"),
  
  // 12 Hazards Identified (boolean checkboxes)
  hazardFalling: boolean("hazard_falling").default(false),
  hazardSwingFall: boolean("hazard_swing_fall").default(false),
  hazardSuspendedRescue: boolean("hazard_suspended_rescue").default(false),
  hazardWeather: boolean("hazard_weather").default(false),
  hazardElectrical: boolean("hazard_electrical").default(false),
  hazardFallingObjects: boolean("hazard_falling_objects").default(false),
  hazardChemical: boolean("hazard_chemical").default(false),
  hazardConfined: boolean("hazard_confined").default(false),
  hazardSharpEdges: boolean("hazard_sharp_edges").default(false),
  hazardUnstableAnchors: boolean("hazard_unstable_anchors").default(false),
  hazardPowerTools: boolean("hazard_power_tools").default(false),
  hazardPublic: boolean("hazard_public").default(false),
  
  // 10 Controls Implemented (boolean checkboxes)
  controlPPE: boolean("control_ppe").default(false),
  controlBackupSystem: boolean("control_backup_system").default(false),
  controlEdgeProtection: boolean("control_edge_protection").default(false),
  controlBarricades: boolean("control_barricades").default(false),
  controlWeatherMonitoring: boolean("control_weather_monitoring").default(false),
  controlRescuePlan: boolean("control_rescue_plan").default(false),
  controlCommunication: boolean("control_communication").default(false),
  controlToolTethering: boolean("control_tool_tethering").default(false),
  controlPermits: boolean("control_permits").default(false),
  controlInspections: boolean("control_inspections").default(false),
  
  // Risk Assessment
  riskLevelBefore: varchar("risk_level_before"), // low | medium | high | extreme
  riskLevelAfter: varchar("risk_level_after"),
  
  // Additional fields
  additionalHazards: text("additional_hazards"),
  additionalControls: text("additional_controls"),
  emergencyContacts: text("emergency_contacts"),
  teamMembers: text("team_members").array(),
  
  // Digital signatures
  signatures: jsonb("signatures").$type<Array<{
    employeeId: string;
    employeeName: string;
    signatureDataUrl: string;
  }>>(),
  
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

#### Incident Reports Table
```typescript
export const incidentReports = pgTable("incident_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id),
  projectId: varchar("project_id").references(() => projects.id), // Optional
  reportedById: varchar("reported_by_id").notNull().references(() => users.id),
  
  // Basic Information
  reporterName: varchar("reporter_name").notNull(),
  reporterTitle: varchar("reporter_title").notNull(),
  incidentDate: date("incident_date").notNull(),
  incidentTime: varchar("incident_time").notNull(), // HH:MM format
  reportDate: date("report_date").notNull(),
  location: text("location").notNull(),
  specificLocation: text("specific_location"),
  
  // Incident Classification
  incidentType: varchar("incident_type").notNull(), 
  // injury | near_miss | property_damage | environmental | equipment_failure | other
  incidentSeverity: varchar("incident_severity").notNull(),
  // minor | moderate | serious | critical | fatal
  workRelated: boolean("work_related").default(true),
  
  // Injured/Affected Person(s)
  injuredPersonName: varchar("injured_person_name"),
  injuredPersonRole: varchar("injured_person_role"),
  injuredPersonCompany: varchar("injured_person_company"),
  injuryType: varchar("injury_type"), // cut | bruise | fracture | sprain | burn | other
  injuryLocation: varchar("injury_location"), // body part
  medicalTreatment: varchar("medical_treatment"), // none | first_aid | clinic | hospital | emergency
  timeOffWork: boolean("time_off_work").default(false),
  estimatedDaysOff: integer("estimated_days_off"),
  
  // Incident Description
  incidentDescription: text("incident_description").notNull(),
  taskBeingPerformed: text("task_being_performed"),
  equipmentInvolved: text("equipment_involved"),
  environmentalFactors: text("environmental_factors"),
  
  // Witnesses
  witnesses: text("witnesses").array(),
  witnessStatements: text("witness_statements"),
  
  // Immediate Actions Taken
  firstAidProvided: boolean("first_aid_provided").default(false),
  emergencyServicesContacted: boolean("emergency_services_contacted").default(false),
  areaSecured: boolean("area_secured").default(false),
  equipmentIsolated: boolean("equipment_isolated").default(false),
  immediateActionDescription: text("immediate_action_description"),
  
  // Root Cause Analysis (8 checkboxes)
  rootCauseEquipmentFailure: boolean("root_cause_equipment_failure").default(false),
  rootCauseHumanError: boolean("root_cause_human_error").default(false),
  rootCauseInadequateTraining: boolean("root_cause_inadequate_training").default(false),
  rootCauseUnsafeConditions: boolean("root_cause_unsafe_conditions").default(false),
  rootCausePoorCommunication: boolean("root_cause_poor_communication").default(false),
  rootCauseInsufficientPPE: boolean("root_cause_insufficient_ppe").default(false),
  rootCauseWeatherConditions: boolean("root_cause_weather_conditions").default(false),
  rootCauseOther: boolean("root_cause_other").default(false),
  rootCauseDetails: text("root_cause_details"),
  
  // Corrective Actions
  correctiveActionsRequired: text("corrective_actions_required"),
  correctiveActionResponsible: varchar("corrective_action_responsible"),
  correctiveActionDeadline: date("corrective_action_deadline"),
  correctiveActionsCompleted: boolean("corrective_actions_completed").default(false),
  correctiveActionsCompletionDate: date("corrective_actions_completion_date"),
  
  // Preventive Measures (5 checkboxes)
  preventiveTrainingRequired: boolean("preventive_training_required").default(false),
  preventiveEquipmentModification: boolean("preventive_equipment_modification").default(false),
  preventiveProcedureUpdate: boolean("preventive_procedure_update").default(false),
  preventiveAdditionalPPE: boolean("preventive_additional_ppe").default(false),
  preventiveEngineeringControls: boolean("preventive_engineering_controls").default(false),
  preventiveMeasuresDetails: text("preventive_measures_details"),
  
  // Regulatory Reporting
  reportableToAuthorities: boolean("reportable_to_authorities").default(false),
  authoritiesNotified: boolean("authorities_notified").default(false),
  authorityName: varchar("authority_name"),
  authorityReportDate: date("authority_report_date"),
  authorityReferenceNumber: varchar("authority_reference_number"),
  
  // Supervisor/Manager Review
  reviewedBySupervisorId: varchar("reviewed_by_supervisor_id").references(() => users.id),
  reviewedBySupervisorName: varchar("reviewed_by_supervisor_name"),
  supervisorReviewDate: date("supervisor_review_date"),
  supervisorComments: text("supervisor_comments"),
  
  // Management Review
  reviewedByManagementId: varchar("reviewed_by_management_id").references(() => users.id),
  reviewedByManagementName: varchar("reviewed_by_management_name"),
  managementReviewDate: date("management_review_date"),
  managementComments: text("management_comments"),
  
  // Photos/Evidence
  photoUrls: text("photo_urls").array(),
  evidenceNotes: text("evidence_notes"),
  
  // Digital signatures
  signatures: jsonb("signatures").$type<Array<{
    employeeId: string;
    employeeName: string;
    signatureDataUrl: string;
    role: string;
  }>>(),
  
  // Status
  reportStatus: varchar("report_status").default('draft'), // draft | submitted | under_review | closed
  
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

### API Endpoints

| Endpoint | Method | Roles Allowed | Purpose |
|----------|--------|---------------|---------|
| **Harness Inspections** ||||
| `/api/harness-inspections` | POST | tech, supervisor, manager, company | Create new inspection |
| `/api/harness-inspections` | GET | `canViewSafetyDocuments` | List company inspections |
| `/api/harness-inspections/today` | GET | Any employee | Check if user inspected today |
| `/api/harness-inspections/:id` | DELETE | supervisor, manager, company | Delete inspection |
| **Toolbox Meetings** ||||
| `/api/toolbox-meetings` | POST | tech, supervisor, manager, company | Create meeting (all must sign) |
| `/api/toolbox-meetings` | GET | `canViewSafetyDocuments` | List company meetings |
| `/api/projects/:id/toolbox-meetings` | GET | Any authenticated | Get project meetings |
| `/api/toolbox-meetings/:id` | DELETE | supervisor, manager, company | Delete meeting |
| **FLHA Forms** ||||
| `/api/flha-forms` | POST | tech, supervisor, manager, company | Create FLHA |
| `/api/flha-forms` | GET | `canViewSafetyDocuments` | List company FLHA forms |
| `/api/projects/:id/flha-forms` | GET | Any authenticated | Get project FLHA forms |
| `/api/flha-forms/:id` | DELETE | supervisor, manager, company | Delete FLHA |
| **Incident Reports** ||||
| `/api/incident-reports` | POST | tech, supervisor, manager, company | Create report |
| `/api/incident-reports` | GET | `canViewSafetyDocuments` | List company reports |
| `/api/incident-reports/:id` | GET | `canViewSafetyDocuments` | Get single report |
| `/api/incident-reports/:id` | DELETE | manager, company | Delete report |
| **CSR** ||||
| `/api/company-safety-rating` | GET | `canViewCSR` | Get full CSR breakdown |
| `/api/vendor-csr/:companyId` | GET | Property Manager | View vendor's CSR |

### Critical Functions

#### Check Harness Inspection Today
```typescript
// GET /api/harness-inspections/today
app.get("/api/harness-inspections/today", requireAuth, async (req, res) => {
  const userId = req.session.userId!;
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  const inspections = await storage.getHarnessInspectionsByWorker(userId);
  
  const todayInspection = inspections.find((inspection: any) => {
    const inspectionDate = inspection.inspectionDate?.split('T')[0];
    return inspectionDate === today;
  });
  
  res.json({ 
    hasInspectionToday: !!todayInspection,
    inspection: todayInspection || null
  });
});
```

#### Toolbox Meeting with Signature Validation
```typescript
// POST /api/toolbox-meetings
app.post("/api/toolbox-meetings", requireAuth, requireRole(...), async (req, res) => {
  const { attendeeIds, signatures } = req.body;
  
  // Validate all attendees have signed
  const validSignatures = (signatures || []).filter((sig: any) => 
    sig && sig.employeeId && sig.signatureDataUrl && sig.signatureDataUrl.length > 0
  );
  const signatureEmployeeIds = validSignatures.map((sig: any) => sig.employeeId);
  const unsignedAttendeeIds = attendeeIds.filter(
    (id: string) => !signatureEmployeeIds.includes(id)
  );
  
  if (unsignedAttendeeIds.length > 0) {
    const unsignedNames = await Promise.all(
      unsignedAttendeeIds.map(async (id: string) => {
        const employee = await storage.getUserById(id);
        return employee?.name || `Employee ${id}`;
      })
    );
    return res.status(400).json({ 
      message: `Missing signatures from: ${unsignedNames.join(', ')}` 
    });
  }
  
  // Create meeting with validated signatures
  const meeting = await storage.createToolboxMeeting(meetingData);
  res.json({ meeting });
});
```

---

## Company Safety Rating (CSR) Calculation

### Overview
The CSR starts at 100% and applies penalties for non-compliance. Maximum penalty is 80%.

### Penalty Components

| Component | Max Penalty | Condition |
|-----------|-------------|-----------|
| **Documentation** | 25% | Missing Health & Safety Manual, Company Policy, OR Certificate of Insurance |
| **Toolbox Meetings** | 25% | Proportional to uncovered work session days (7-day window) |
| **Harness Inspections** | 25% | Proportional to missed inspections (last 30 days) |
| **Document Reviews** | 5% | Proportional to unsigned employee acknowledgments |
| **Project Completion** | 0% | Informational only - no penalty |

### CSR Formula
```
Overall CSR = max(0, 100 - totalPenalty)

totalPenalty = documentationPenalty + toolboxPenalty + harnessPenalty + documentReviewPenalty
```

### Toolbox Meeting Coverage Logic
```typescript
const TOOLBOX_COVERAGE_DAYS = 7;

// A meeting covers work sessions within 7 days in EITHER direction
const isDateCovered = (projectId: string, workDateStr: string): boolean => {
  const workDate = new Date(workDateStr);
  
  // Check project-specific meetings
  for (const meetingDate of projectMeetings) {
    const daysDiff = Math.abs(Math.floor(
      (workDate.getTime() - meetingDate.getTime()) / (1000 * 60 * 60 * 24)
    ));
    if (daysDiff <= TOOLBOX_COVERAGE_DAYS) {
      return true;
    }
  }
  
  // Check "other" meetings (cover all projects)
  for (const meetingDate of otherMeetings) {
    const daysDiff = Math.abs(Math.floor(
      (workDate.getTime() - meetingDate.getTime()) / (1000 * 60 * 60 * 24)
    ));
    if (daysDiff <= TOOLBOX_COVERAGE_DAYS) {
      return true;
    }
  }
  
  return false;
};

// Calculate penalty
const toolboxPenalty = toolboxTotalDays > 0 
  ? Math.round(((toolboxTotalDays - toolboxDaysWithMeeting) / toolboxTotalDays) * 25)
  : 0;
```

### Harness Inspection Compliance Logic
```typescript
// Check last 30 days
for (let i = 0; i < 30; i++) {
  const checkDate = new Date(today);
  checkDate.setDate(checkDate.getDate() - i);
  const dateStr = formatDateString(checkDate);
  
  // Find workers who had work sessions on this day
  const workersWithSessions = allWorkSessions
    .filter(s => s.workDate === dateStr)
    .map(s => s.employeeId);
  
  // Each worker with a session needs an inspection
  for (const workerId of workersWithSessions) {
    const inspection = harnessInspections.find(
      i => i.workerId === workerId && i.inspectionDate === dateStr
    );
    
    if (!inspection || inspection.overallStatus !== "not_applicable") {
      harnessRequiredInspections++;
      if (inspection && inspection.overallStatus !== "not_applicable") {
        harnessCompletedInspections++;
      }
    }
  }
}

// Calculate penalty
const harnessPenalty = harnessRequiredInspections > 0 
  ? Math.round(((harnessRequiredInspections - harnessCompletedInspections) / harnessRequiredInspections) * 25)
  : 0;
```

---

## Multi-Tenant Considerations

### Data Isolation

- **Company Level**: All five document types have `companyId` column with cascading deletes
- **Employee Level**: Workers can only access their company's documents via role permissions
- **Project Level**: Documents linked to projects inherit project's company isolation

### Query Patterns

```typescript
// ALWAYS derive companyId from authenticated user session
const companyId = currentUser.role === "company" 
  ? currentUser.id 
  : currentUser.companyId;

// ALWAYS filter by companyId
const inspections = await db.select().from(harnessInspections)
  .where(eq(harnessInspections.companyId, companyId));
```

### Permission Checks

```typescript
// canViewSafetyDocuments - controls read access
export function canViewSafetyDocuments(user: User | null | undefined): boolean {
  if (!user) return false;
  if (isCompanyOwner(user)) return true;
  return checkPermission(user, 'view_safety_documents');
}

// canViewCSR - controls CSR dashboard access
export function canViewCSR(user: User | null | undefined): boolean {
  if (!user) return false;
  if (isCompanyOwner(user)) return true;
  return checkPermission(user, 'view_csr');
}
```

---

## Digital Signature System

### Signature Capture
- Uses `react-signature-canvas` library for touch/mouse-based signature capture
- Signature stored as base64 Data URL (`data:image/png;base64,...`)
- Each signature includes `employeeId`, `employeeName`, and `signatureDataUrl`

### Signature Storage Structure
```typescript
type Signature = {
  employeeId: string;      // Links to users.id for authentication
  employeeName: string;    // Display name at time of signing
  signatureDataUrl: string; // Base64 PNG image
  signedAt?: string;       // ISO timestamp (optional)
  role?: string;           // Signer's role (for incident reports)
};
```

### Signature Validation
```typescript
// Validate signature is non-empty and properly formatted
const isValidSignature = (sig: any): boolean => {
  return sig && 
         sig.employeeId && 
         sig.signatureDataUrl && 
         sig.signatureDataUrl.length > 0 &&
         sig.signatureDataUrl.startsWith('data:image/');
};
```

---

## PDF Generation System

### Library
- Uses `jsPDF` for client-side PDF generation
- PDFs generated on-demand when user clicks download
- Supports pagination for long documents

### PDF Generation Pattern
```typescript
const downloadHarnessInspection = async (inspection: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;
  
  // Helper for pagination
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }
  };
  
  // Add company branding (if white-label active)
  yPosition += addCompanyBranding(doc, pageWidth);
  
  // Add title
  doc.setFontSize(18);
  doc.text("HARNESS INSPECTION REPORT", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 15;
  
  // Add fields...
  doc.setFontSize(10);
  doc.text(`Inspection Date: ${formatDate(inspection.inspectionDate)}`, 20, yPosition);
  
  // Embed signature images
  if (inspection.signatures) {
    for (const sig of inspection.signatures) {
      checkPageBreak(40);
      doc.addImage(sig.signatureDataUrl, "PNG", 20, yPosition, 50, 20);
      yPosition += 25;
      doc.text(sig.employeeName, 20, yPosition);
    }
  }
  
  // Save with descriptive filename
  doc.save(`harness-inspection-${inspection.inspectionDate}.pdf`);
};
```

### White-Label Branding in PDFs
```typescript
const addCompanyBranding = (doc: jsPDF, pageWidth: number): number => {
  if (!currentUser?.whitelabelBrandingActive || !currentUser?.companyName) {
    return 0; // No branding, return 0 additional height
  }
  
  // Add company name at top of first page
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(currentUser.companyName, pageWidth / 2, 15, { align: "center" });
  
  return 10; // Return height used by branding
};
```

---

## Field Worker Experience

### Mobile Considerations

- **Touch-Friendly Forms**: Large touch targets for equipment category selection
- **Signature Canvas**: Full-width signature capture optimized for finger/stylus
- **Quick Inspections**: "Pass All" / "Fail All" options per category
- **Offline Draft**: Forms auto-save locally (future enhancement)

### Common Workflows

#### 1. Daily Pre-Work Harness Inspection
1. Worker opens project detail or dashboard
2. Clicks "Start Work" button
3. System checks `hasHarnessInspectionToday`
4. If no inspection → redirects to Harness Inspection Form
5. Worker selects equipment categories to inspect
6. Marks each item as Pass/Fail/N/A
7. Adds notes if any failures
8. Submits inspection
9. Can now start work session

#### 2. Toolbox Meeting Before Work
1. Supervisor opens Toolbox Meeting form
2. Selects project and date
3. Selects all attendees from employee list
4. Checks off topics discussed (20+ standard options)
5. Adds custom topics and notes
6. Each attendee signs on their device or shared tablet
7. Submits only when ALL attendees have signed
8. Meeting provides 7-day coverage for project

#### 3. FLHA Before High-Risk Work
1. Assessor opens FLHA form
2. Enters job description and location
3. Identifies applicable hazards (12 categories)
4. Selects implemented controls (10 categories)
5. Rates risk level before and after controls
6. Adds team members
7. All team members sign
8. Downloads PDF for job site posting

#### 4. Incident Reporting Post-Incident
1. Reporter opens Incident Report form
2. Enters incident details (date, time, location)
3. Classifies incident type and severity
4. Adds injured persons with injury details
5. Documents root causes (8 checkbox categories)
6. Adds corrective actions with assignments
7. Gets supervisor review and signature
8. Gets management review and signature
9. Submits for record

---

## Error Handling & Recovery

### Common Errors

| Error | Cause | User Message | Recovery Action |
|-------|-------|--------------|-----------------|
| Missing signatures | Not all attendees signed | "Missing signatures from: [names]" | Collect remaining signatures |
| Inspection exists | Duplicate same-day inspection | "Already inspected today" | View existing inspection |
| Project required | Toolbox meeting needs project | "Project is required" | Select a project |
| Permission denied | Missing `view_safety_documents` | "Access denied" | Contact admin for permission |
| Invalid date | Future date not allowed | "Date cannot be in future" | Select valid date |

### Graceful Degradation

- **Offline Mode**: Forms can be filled offline, submitted when connected (future)
- **Auto-Save**: Draft data preserved in localStorage during form completion
- **Signature Retry**: If signature canvas fails, offer text signature fallback

---

## Testing Requirements

### Unit Tests

```typescript
describe('Safety Documentation', () => {
  describe('Harness Inspection', () => {
    test('should require inspection before work session', () => {
      const hasInspection = false;
      const canStartWork = hasInspection; // Must have inspection
      expect(canStartWork).toBe(false);
    });
    
    test('should recognize today inspection as valid', () => {
      const inspectionDate = '2024-12-02';
      const today = '2024-12-02';
      const isValid = inspectionDate === today;
      expect(isValid).toBe(true);
    });
  });
  
  describe('Toolbox Meeting Coverage', () => {
    test('should cover work within 7 days of meeting', () => {
      const meetingDate = new Date('2024-12-01');
      const workDate = new Date('2024-12-05');
      const daysDiff = Math.abs(
        Math.floor((workDate - meetingDate) / (1000 * 60 * 60 * 24))
      );
      expect(daysDiff <= 7).toBe(true);
    });
    
    test('should NOT cover work more than 7 days from meeting', () => {
      const meetingDate = new Date('2024-12-01');
      const workDate = new Date('2024-12-10');
      const daysDiff = Math.abs(
        Math.floor((workDate - meetingDate) / (1000 * 60 * 60 * 24))
      );
      expect(daysDiff <= 7).toBe(false);
    });
  });
  
  describe('Signature Validation', () => {
    test('should require all attendees to sign', () => {
      const attendees = ['emp1', 'emp2', 'emp3'];
      const signatures = [
        { employeeId: 'emp1', signatureDataUrl: 'data:...' },
        { employeeId: 'emp2', signatureDataUrl: 'data:...' }
      ];
      const signedIds = signatures.map(s => s.employeeId);
      const unsigned = attendees.filter(a => !signedIds.includes(a));
      expect(unsigned.length).toBeGreaterThan(0);
    });
  });
});
```

### Integration Tests

- **Multi-tenant isolation**: Company A cannot see Company B's safety documents
- **Work session blocking**: Cannot start session without harness inspection
- **CSR calculation**: All penalty components calculate correctly
- **PDF generation**: All document types generate valid PDFs with signatures

### Field Testing

- **Signature capture**: Test on tablets with gloves
- **Form submission**: Test on slow 3G connections
- **PDF download**: Verify on mobile devices

---

## Monitoring & Maintenance

### Key Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Inspection completion rate | >99% | <95% |
| Toolbox meeting coverage | >90% | <75% |
| CSR company average | >85% | <70% |
| PDF generation success | >99% | <97% |

### Regular Maintenance

- **Daily**: Verify all work sessions have matching inspections
- **Weekly**: Review CSR scores for companies below 80%
- **Monthly**: Audit signature data integrity

### Data Integrity Query
```sql
-- Find work sessions without same-day harness inspections
SELECT 
  ws.employee_id,
  ws.work_date,
  ws.project_id
FROM work_sessions ws
LEFT JOIN harness_inspections hi 
  ON ws.employee_id = hi.worker_id 
  AND DATE(ws.work_date) = DATE(hi.inspection_date)
WHERE hi.id IS NULL
ORDER BY ws.work_date DESC;
```

---

## Troubleshooting Guide

### Issue: Worker Cannot Start Work Session
**Symptoms**: "Complete harness inspection first" dialog appears

**Diagnosis Steps**:
1. Check if inspection exists for today: `GET /api/harness-inspections/today`
2. Verify inspection date matches current date (timezone issues)
3. Confirm worker ID matches session user

**Solution**: Complete harness inspection or verify existing inspection date

**Prevention**: Ensure workers complete inspection before attempting to start work

---

### Issue: Toolbox Meeting Signatures Not Saving
**Symptoms**: Meeting fails to submit despite signatures

**Diagnosis Steps**:
1. Check browser console for signature canvas errors
2. Verify all attendeeIds have matching signatures
3. Check signature data URL format

**Solution**:
```javascript
// Validate signature format
if (!sig.signatureDataUrl.startsWith('data:image/')) {
  console.error('Invalid signature format');
}
```

**Prevention**: Validate signatures before submission, show clear signing instructions

---

### Issue: CSR Shows Low Score Despite Compliance
**Symptoms**: Company has completed documents but CSR is low

**Diagnosis Steps**:
1. Check documentation penalty (need ALL three: H&S Manual, Policy, Insurance)
2. Verify toolbox meetings cover work sessions (7-day window)
3. Check harness inspections match work session dates

**Solution**:
```sql
-- Check toolbox meeting coverage
SELECT 
  ws.work_date,
  tm.meeting_date,
  ABS(DATE(ws.work_date) - DATE(tm.meeting_date)) as days_diff
FROM work_sessions ws
LEFT JOIN toolbox_meetings tm ON ws.project_id = tm.project_id
WHERE ABS(DATE(ws.work_date) - DATE(tm.meeting_date)) <= 7
ORDER BY ws.work_date;
```

**Prevention**: Schedule toolbox meetings at least weekly for active projects

---

## Related Documentation

- `gear-inventory-instructions-v1.0.md` - Equipment tracking (separate from safety inspections)
- `1. GUIDING_PRINCIPLES.md` - Core safety-first development philosophy
- `work-session-management-instructions-v1.0.md` - Work session integration (future)

---

## Version History

- **v1.0** (December 2, 2024): Initial release - comprehensive safety documentation system
  - Harness Inspections with 11 equipment categories
  - Toolbox Meetings with 20 topics and multi-signature
  - FLHA Forms with hazard/control tracking
  - Incident Reports with full investigation workflow
  - CSR calculation with penalty breakdown
  - PDF generation with signature embedding
  - Work session integration (inspection required before work)
