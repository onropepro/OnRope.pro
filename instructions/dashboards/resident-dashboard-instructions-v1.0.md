# Resident Dashboard System Instructions v1.0
**System**: Rope Access Management System  
**Domain**: Resident Communication & Feedback  
**Version**: 1.0  
**Last Updated**: December 19, 2024  
**Status**: PRODUCTION-READY  
**Safety Critical**: No - Communication system, not direct worker safety

---

## Purpose and Goal

### Primary Objective
The Resident Dashboard System provides a two-way communication channel between building residents and rope access service providers. Residents can submit feedback with photo evidence, track issue status, view work notices, and monitor project progress. The system uses a resilient architecture that ensures submissions never fail due to temporary storage outages.

### Key Goals
- **Communication**: Enable direct resident-to-vendor feedback without phone calls
- **Transparency**: Show real-time project progress and work schedules
- **Accountability**: Track issue status from submission to resolution
- **Reliability**: Ensure feedback submissions succeed even during storage outages
- **Portability**: Create network effect through portable resident accounts

### Core Business Value
- **Reduced Support Burden**: Centralized feedback reduces phone calls
- **Improved Response Time**: Vendors see issues immediately with photo evidence
- **Documentation**: Full audit trail of resident communications
- **Network Growth**: Portable accounts increase platform value as more buildings connect

---

## System Architecture

### Component Overview

```
+-------------------------------------------------------------------------+
|                     RESIDENT DASHBOARD SYSTEM                            |
+-------------------------------------------------------------------------+
|                                                                          |
|  +-------------+    +-------------------+    +------------------------+  |
|  | complaints  |<---| complaint_notes   |    | residentFeedbackPhoto  |  |
|  | (feedback)  |    | (replies/notes)   |    | Queue (async uploads)  |  |
|  +-------------+    +-------------------+    +------------------------+  |
|         |                   |                          |                 |
|         |         AUTHENTICATION FLOW                  |                 |
|         |    Vendor Code + Strata/LMS = Access         |                 |
|         |                   |                          |                 |
|         v                   v                          v                 |
|  +-------------------------------------------------------------------+  |
|  |                    STORAGE LAYER                                   |  |
|  |  PostgreSQL (complaints, notes) | Object Storage (photos)         |  |
|  +-------------------------------------------------------------------+  |
|                                                                          |
+-------------------------------------------------------------------------+
```

### Data Flow

1. **Authentication Stage**: Resident registers/logs in using Vendor Code + Strata/LMS number
2. **Submission Stage**: Resident submits feedback with optional photo attachment
3. **Queue Stage**: Photo is queued for async upload; complaint is saved immediately
4. **Processing Stage**: Background worker uploads photo with exponential backoff retry
5. **Notification Stage**: Vendor sees new feedback; resident tracks status
6. **Resolution Stage**: Vendor marks viewed, replies, and closes issue

### Integration Points

- **Upstream Systems**: 
  - User Authentication: Session-based auth provides resident context
  - Projects: Links feedback to specific building projects via strataPlanNumber
  
- **Downstream Systems**:
  - Vendor Dashboard: Companies see aggregated resident feedback
  - Property Manager Interface: Read-only oversight of feedback
  
- **Parallel Systems**:
  - Work Notices: Residents view scheduled work for their building
  - Project Progress: Real-time completion tracking visible to residents

---

## Dependency Impact & Invariants

### Non-negotiable Invariants

#### 1. THE GOLDEN RULE (CRITICAL)
**Rule**: `Vendor Code + Strata/LMS Number = Access`

Residents access the portal using:
- **Vendor Code**: ONE unique 10-character code per company (not per building)
- **Strata/LMS Number**: Identifies their specific building

```typescript
// CORRECT: Vendor code is company-level
users.residentCode // 10-character code for the company

// WRONG: Building-level codes do not exist
buildings.residentCode // This field does not exist
```

- **Impact if violated**: Residents cannot access portal or link to wrong company
- **Enforcement mechanism**: Registration validates vendor code against company records

#### 2. FEEDBACK RESILIENCE (CRITICAL)
**Rule**: `Complaint is saved BEFORE any photo operations`

Photo uploads never block feedback submission. The system:
1. Saves complaint record immediately (line 13033 in routes.ts)
2. Queues photo for background upload (lines 13035-13058)
3. Returns success with photoStatus indicator

**Supported Photo Formats**: JPEG, PNG, WebP, HEIC, HEIF (max 10MB)
- HEIC/HEIF from iPhones validated by file extension (browsers often report incorrect MIME type)
- Frontend: `handlePhotoChange()` in ResidentDashboard.tsx checks both MIME type and extension
- Backend: `imageUpload` multer filter in routes.ts (lines 8888-8904) validates similarly

```typescript
// CORRECT: Save complaint first
const complaint = await storage.createComplaint(complaintData);

// THEN queue photo (never fails the request)
if (req.file) {
  await storage.enqueueResidentPhoto({ ... });
  photoStatus = "queued";
}
```

- **Impact if violated**: Storage outages would cause feedback loss
- **Enforcement mechanism**: Complaint creation precedes all photo operations

#### 3. PHOTO QUEUE EXPONENTIAL BACKOFF
**Rule**: Retries use explicit schedule `[30s, 2m, 10m, 30m, 1h]` with max 5 retries

```typescript
const backoffSchedule = [30000, 120000, 600000, 1800000, 3600000];
```

- **Impact if violated**: Temporary outages could permanently fail uploads
- **Enforcement mechanism**: Storage method `incrementPhotoRetry` enforces schedule

#### 4. MULTI-TENANT ISOLATION
**Rule**: Residents only see feedback for buildings they are linked to

- **Impact if violated**: Data leakage between buildings/companies
- **Enforcement mechanism**: All queries filter by user's strataPlanNumber and linkedResidentCode

### System Dependencies

- **Work Sessions**: No direct dependency; feedback exists independently of work tracking
- **Projects**: Feedback links to projects via strataPlanNumber for routing
- **Safety Systems**: No direct dependency
- **Payroll**: No direct dependency
- **Multi-tenant**: Strict isolation via companyId derived from vendor code

---

## Technical Implementation

### Database Schema

#### complaints Table
```typescript
export const complaints = pgTable("complaints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => users.id),
  projectId: varchar("project_id").references(() => projects.id),
  residentId: varchar("resident_id").references(() => users.id),
  residentName: varchar("resident_name").notNull(),
  phoneNumber: varchar("phone_number").notNull(),
  unitNumber: varchar("unit_number").notNull(),
  message: text("message").notNull(),
  photoUrl: text("photo_url"), // Populated after async upload completes
  status: varchar("status").notNull().default('open'), // open | closed
  viewedAt: timestamp("viewed_at"), // When staff first viewed
  closedAt: timestamp("closed_at"), // When issue was closed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

#### complaint_notes Table
```typescript
export const complaintNotes = pgTable("complaint_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  complaintId: varchar("complaint_id").notNull().references(() => complaints.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  userName: varchar("user_name").notNull(),
  note: text("note").notNull(),
  visibleToResident: boolean("visible_to_resident").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
```

#### residentFeedbackPhotoQueue Table
```typescript
export const residentFeedbackPhotoQueue = pgTable("resident_feedback_photo_queue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  complaintId: varchar("complaint_id").notNull().references(() => complaints.id),
  status: varchar("status").notNull().default("pending"), // pending | uploading | uploaded | failed
  retryCount: integer("retry_count").notNull().default(0),
  maxRetries: integer("max_retries").notNull().default(5),
  nextRetryAt: timestamp("next_retry_at"),
  lastAttemptAt: timestamp("last_attempt_at"),
  lastError: text("last_error"),
  objectKey: varchar("object_key").notNull(),
  contentType: varchar("content_type").notNull(),
  fileSize: integer("file_size").notNull(),
  payload: text("payload").notNull(), // Base64 encoded (cleared after upload)
  uploadedUrl: text("uploaded_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### API Endpoints

#### Resident Feedback
- `POST /api/complaints` - Submit new feedback (photo queued async)
- `GET /api/complaints` - Get complaints for authenticated user/company
- `GET /api/complaints/:id/photo-status` - Check photo upload status
- `GET /api/resident-photos/:fileName` - Serve resident photos from dedicated bucket

#### Status Management (Vendor Only)
- `PUT /api/complaints/:id/viewed` - Mark complaint as viewed
- `PUT /api/complaints/:id/status` - Update complaint status (open/closed)
- `POST /api/complaints/:id/notes` - Add note (internal or resident-visible)
- `GET /api/complaints/:id/notes` - Get notes for a complaint

#### Resident Dashboard Data
- `GET /api/resident/work-notices` - Get work notices for resident's building
- `GET /api/projects` - Get projects for resident's building (filtered by strata)
- `GET /api/projects/:id/progress` - Get real-time progress data

### Critical Functions

#### Photo Queue Storage Methods (server/storage.ts)
```typescript
// Enqueue a photo for async upload
async enqueueResidentPhoto(data: {
  complaintId: string;
  objectKey: string;
  contentType: string;
  fileSize: number;
  payload: string; // Base64
}): Promise<ResidentFeedbackPhotoQueue>

// Get photos ready for upload (respects nextRetryAt)
async getPendingPhotoUploads(limit: number): Promise<ResidentFeedbackPhotoQueue[]>

// Mark as uploading (in progress)
async markPhotoUploading(id: string): Promise<void>

// Mark as successfully uploaded
async markPhotoUploaded(id: string, uploadedUrl: string): Promise<void>

// Mark as permanently failed
async markPhotoFailed(id: string, error: string): Promise<void>

// Increment retry with exponential backoff
async incrementPhotoRetry(id: string, error: string): Promise<void>

// Update complaint with final photo URL
async updateComplaintPhotoUrl(complaintId: string, photoUrl: string): Promise<void>
```

#### Object Storage Methods (server/objectStorage.ts)
```typescript
// Upload to dedicated resident photos bucket
async uploadResidentPhoto(objectKey: string, buffer: Buffer, contentType: string): Promise<string>

// Get photo from dedicated bucket
async getResidentPhoto(fileName: string): Promise<File | null>

// Health check for bucket connectivity
async checkResidentPhotosBucketHealth(): Promise<boolean>
```

#### Background Worker (server/residentPhotoWorker.ts)
```typescript
// Worker runs every 30 seconds via setInterval
// Health check function (runBucketHealthCheck) called from routes.ts at startup
// 
// Processing flow:
// 1. Get pending photos from queue (respects nextRetryAt timing)
// 2. Mark as uploading
// 3. Decode base64 payload and upload to RESIDENT_PHOTOS_BUCKET
// 4. On success: markPhotoUploaded, updateComplaintPhotoUrl
// 5. On failure: incrementPhotoRetry (schedules next retry with backoff)
```

---

## Multi-Tenant Considerations

### Data Isolation

- **Company Level**: Complaints are filtered by companyId derived from vendor code
- **Resident Level**: Residents only see their own submissions
- **Property Manager Level**: Read-only access to feedback for managed buildings

### Query Patterns

```typescript
// Resident viewing their complaints
const complaints = await db.select()
  .from(complaints)
  .where(eq(complaints.residentId, currentUser.id));

// Company viewing all feedback
const complaints = await db.select()
  .from(complaints)
  .where(eq(complaints.companyId, company.id));

// Property manager with read-only access
// Filtered by their linked buildings (strataPlanNumber)
```

### Vendor Code Resolution

```typescript
// During resident registration
const company = await db.select()
  .from(users)
  .where(eq(users.residentCode, vendorCode))
  .limit(1);

if (!company) {
  throw new Error("Invalid vendor code");
}

// Store link in user record
await db.update(users)
  .set({ linkedResidentCode: vendorCode })
  .where(eq(users.id, newResident.id));
```

---

## Safety & Compliance

### Data Privacy

- **Resident PII**: Name, phone, unit stored for communication purposes
- **Photo Evidence**: Stored in dedicated bucket with company-scoped paths
- **Access Control**: Residents cannot see other residents' submissions

### Audit Trail

- **Submission Timestamps**: createdAt on all records
- **View Tracking**: viewedAt records when staff first saw issue
- **Resolution Tracking**: closedAt records resolution time
- **Note History**: Full history of internal notes and resident replies

### Photo Handling

- **Secure Storage**: Dedicated RESIDENT_PHOTOS_BUCKET
- **Scoped Paths**: Photos stored as `{companyId}/{timestamp}-{filename}`
- **Base64 Cleanup**: Payload cleared after successful upload to save space

---

## Field Worker Experience

### Mobile Considerations

- **Responsive Design**: Dashboard optimized for mobile screens
- **Photo Upload**: Native camera/gallery integration
- **PWA Support**: InstallPWAButton for home screen installation
- **Offline Status**: Clear messaging when connectivity issues occur

### Common Workflows

#### Resident Submitting Feedback
1. Navigate to "Submit Feedback" tab
2. Fill in name, phone, unit (pre-filled if logged in)
3. Select active project from dropdown
4. Write message describing issue
5. Optionally attach photo from camera/gallery
6. Submit - see confirmation with photo status

#### Resident Tracking Issues
1. Navigate to "History" tab
2. View list of submitted issues
3. See status badges (New, Viewed, Closed)
4. Expand to see vendor replies
5. See photos once upload completes

---

## Error Handling & Recovery

### Common Errors

| Error | Cause | User Message | Recovery Action |
|-------|-------|--------------|-----------------|
| Invalid vendor code | Code doesn't match any company | "Invalid vendor code" | User should verify code with building management |
| No active project | Building has no current project | "No active projects for your building" | User cannot submit feedback |
| Photo queue failed | Database error during queue | "Photo could not be saved but your feedback was received" | Feedback saved; photo lost |
| Photo upload failed | Storage temporarily unavailable | N/A (background) | Worker retries with backoff |

### Graceful Degradation

- **Photo Upload Failure**: Complaint still saved; photo queued for retry
- **Storage Outage**: Queue persists in database; worker retries when storage recovers
- **Max Retries Exceeded**: Photo marked as failed; complaint remains without photo

### Photo Status Flow

```
pending -> uploading -> uploaded (success)
                    -> pending (retry scheduled)
                    -> failed (max retries exceeded)
```

---

## Testing Requirements

### Unit Tests

```typescript
describe('Resident Photo Queue', () => {
  test('should enqueue photo with base64 payload', async () => {
    const result = await storage.enqueueResidentPhoto({
      complaintId: 'test-id',
      objectKey: 'test/photo.jpg',
      contentType: 'image/jpeg',
      fileSize: 1024,
      payload: 'base64data...',
    });
    expect(result.status).toBe('pending');
  });

  test('should calculate correct backoff schedule', async () => {
    // First retry: 30s
    // Second retry: 2m
    // Third retry: 10m
    // Fourth retry: 30m
    // Fifth retry: 1h, then fail
  });
});
```

### Integration Tests

- **Multi-tenant isolation**: Verify residents cannot see other companies' feedback
- **Photo queue processing**: Test full upload flow with mock storage
- **Exponential backoff**: Verify retry timing is correct

### Manual Testing Checklist

- [ ] Register resident with valid vendor code
- [ ] Submit feedback without photo
- [ ] Submit feedback with photo
- [ ] Verify photo appears after worker processes
- [ ] Check status transitions (New -> Viewed -> Closed)
- [ ] Verify resident can see vendor replies
- [ ] Confirm resident cannot see internal notes

---

## Monitoring & Maintenance

### Key Metrics

- **Photo Queue Depth**: Number of pending uploads
- **Photo Failure Rate**: Percentage failing after max retries
- **Average Resolution Time**: closedAt - createdAt
- **Response Time**: viewedAt - createdAt

### Regular Maintenance

- **Daily**: Monitor photo queue for stuck items
- **Weekly**: Review failed photos and storage health
- **Monthly**: Audit resident access patterns

### Health Check

The photo worker runs a startup health check:

```typescript
const isHealthy = await objectStorageService.checkResidentPhotosBucketHealth();
if (!isHealthy) {
  console.error('[PhotoWorker] CRITICAL: Resident photos bucket not accessible');
  // Worker will not start; photos remain in queue
}
```

---

## Troubleshooting Guide

### Issue: Photos Not Appearing on Complaints

**Symptoms**: Resident submits with photo but photoUrl remains null

**Diagnosis Steps**:
1. Check photo queue status: `GET /api/complaints/:id/photo-status`
2. Review worker logs for errors
3. Verify RESIDENT_PHOTOS_BUCKET environment variable is set

**Solution**:
```sql
-- Check queue status
SELECT * FROM resident_feedback_photo_queue 
WHERE complaint_id = 'xxx' 
ORDER BY created_at DESC;

-- Check for stuck uploads
SELECT * FROM resident_feedback_photo_queue 
WHERE status = 'pending' 
AND next_retry_at < NOW();
```

**Prevention**: Monitor photo queue depth and failure rates

### Issue: Resident Cannot Access Portal

**Symptoms**: "Invalid vendor code" error on registration

**Diagnosis Steps**:
1. Verify vendor code exists: Check company's residentCode field
2. Confirm strata number matches a project
3. Check if unit is already linked to another account

**Solution**:
```sql
-- Find company by vendor code
SELECT id, company_name, resident_code 
FROM users 
WHERE role = 'company' 
AND resident_code = 'XXXXXXXXXX';
```

---

## Related Documentation

- `help-content/modules/resident-portal.md` - User-facing documentation (SSOT)
- `property-manager-interface` - PM read-only oversight
- `project-management` - Project progress tracking
- `1. GUIDING_PRINCIPLES.md` - Core philosophy

---

## Version History

- **v1.0** (December 19, 2024): Initial release with resilient photo upload queue system, exponential backoff retry logic, and dedicated RESIDENT_PHOTOS_BUCKET storage
