# App Storage System Instructions v1.0
**System**: Rope Access Management System (OnRopePro)  
**Domain**: File Storage / Object Storage  
**Version**: 1.0  
**Last Updated**: December 20, 2025  
**Status**: PRODUCTION-READY  
**Safety Critical**: No - File storage does not directly affect worker safety, but loss of safety documentation could impact compliance

---

## Purpose and Goal

### Primary Objective
Provide centralized, secure, and reliable file storage for all documents, images, and assets across the OnRopePro platform. The system handles everything from profile photos and branding logos to safety documentation PDFs and resident complaint photos.

### Key Goals
- **Reliability**: Files must be stored durably with automatic retry mechanisms for transient failures
- **Security**: Private documents require authentication; public files are accessible without auth
- **Performance**: Files stream efficiently to clients with appropriate caching headers
- **iPhone Compatibility**: HEIC photos from iPhones automatically convert to JPEG for browser display
- **Resilience**: Async upload queue ensures submissions never fail due to temporary storage outages
- **Backup**: Database exports stored in object storage with automatic 28-day retention

### Business Context
Object storage is a core infrastructure component that underpins:
- Employee profile photos and resume uploads
- Company branding logos and PWA icons
- Project documentation (rope access plans, anchor certificates)
- Safety documentation exports (harness inspections, FLHA forms, incident reports)
- Resident Portal photo submissions (complaint evidence)
- Quote photos and project images
- Database backups for disaster recovery

---

## System Architecture

### Component Overview

```
┌─────────────────────────────── APP STORAGE ARCHITECTURE ───────────────────────────────┐
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                         MAIN BUCKET                                              │   │
│  │            replit-objstore-6e6b229a-26f3-44e3-8851-0347a883531e                  │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────────────────────┐   │   │
│  │  │    /public      │  │    /private     │  │  /private/backups/database/    │   │   │
│  │  │                 │  │                 │  │                                │   │   │
│  │  │ • Profile photos│  │ • Task attach-  │  │ • JSON database exports        │   │   │
│  │  │ • Branding logos│  │   ments         │  │ • 28 backup retention max      │   │   │
│  │  │ • Project docs  │  │ • Sensitive     │  │ • Automatic rotation           │   │   │
│  │  │ • Quote photos  │  │   documents     │  │                                │   │   │
│  │  │ • Company docs  │  │                 │  │                                │   │   │
│  │  └─────────────────┘  └─────────────────┘  └────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                       RESIDENT PHOTOS BUCKET (Dedicated)                         │   │
│  │            replit-objstore-7384c998-585d-4bde-b18e-d8c9ecb92482                  │   │
│  │  ┌─────────────────────────────────────────────────────────────────────────┐    │   │
│  │  │                    /resident-photos                                      │    │   │
│  │  │                                                                          │    │   │
│  │  │  • Resident complaint photos                                             │    │   │
│  │  │  • Organized by complaint ID folders: /{complaintId}/{filename}          │    │   │
│  │  │  • Async upload queue with exponential backoff retry                     │    │   │
│  │  │  • HEIC to JPEG conversion on-the-fly for iPhone photos                  │    │   │
│  │  │                                                                          │    │   │
│  │  └─────────────────────────────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

#### Standard Upload Flow (Public/Private Files)
```
1. User selects file → 2. Multer processes upload → 3. ObjectStorageService.uploadPublicFile()
                                                          or uploadPrivateFile()
                                                     ↓
4. File saved to GCS bucket → 5. URL path returned → 6. URL stored in database field
                                                     ↓
7. File served via /public-objects/:path or /api/private-documents/:path
```

#### Resident Photo Upload Flow (Async Queue)
```
1. Resident submits complaint with photo
     ↓
2. Photo encoded to base64, saved to resident_feedback_photo_queue table
     ↓
3. Complaint saved immediately (photoUrl = null initially)
     ↓
4. Background worker (residentPhotoWorker.ts) picks up queued photo
     ↓
5. Worker uploads to RESIDENT_PHOTOS_BUCKET
     ↓
6. On success: Update complaint.photoUrl, mark queue entry "uploaded"
   On failure: Increment retry count, schedule next retry with exponential backoff
     ↓
7. Max 5 retries (30s → 2m → 10m → 30m → 1h), then mark "failed"
```

### Integration Points
- **Upstream Systems**: Multer file processing, Base64 encoding for queue
- **Downstream Systems**: PDF generation, UI image display, PWA manifest
- **Parallel Systems**: Database backup scheduler, Stripe webhooks (branding logos)

---

## Dependency Impact & Invariants

### Non-Negotiable Invariants

1. **Environment Variables Must Be Set**: All 3 storage env vars MUST be configured before app starts
   - Impact if violated: App crashes on any storage operation with clear error message
   - Enforcement mechanism: ObjectStorageService methods throw descriptive errors if env vars missing

2. **Private Files Require Authentication**: `/api/private-documents/*` MUST check `requireAuth`
   - Impact if violated: Sensitive task attachments exposed publicly
   - Enforcement mechanism: Express middleware chain enforces auth before route handler

3. **Resident Photos Use Async Queue**: Photo uploads MUST NOT block complaint submission
   - Impact if violated: Complaints fail during storage outages, losing resident feedback
   - Enforcement mechanism: Photos queued in database, processed by background worker

4. **HEIC Conversion for iPhone Photos**: HEIC/HEIF files MUST convert to JPEG for browser display
   - Impact if violated: iPhone photos show as broken images in all browsers except Safari
   - Enforcement mechanism: On-the-fly conversion in resident photo serving route

5. **Database Backup Retention**: Maximum 28 backups retained, oldest deleted automatically
   - Impact if violated: Storage bloat, unnecessary costs
   - Enforcement mechanism: backup-database.ts deletes old backups before creating new ones

### System Dependencies

| Dependency | Relationship | Impact |
|------------|--------------|--------|
| Replit Object Storage | Core storage provider | All file operations depend on this |
| PostgreSQL Database | Stores file URLs, queue entries | URLs in 15+ database columns |
| Multer | File upload parsing | All upload endpoints use multer middleware |
| heic-convert | iPhone photo conversion | Resident photos displayable in browsers |
| @google-cloud/storage | GCS client library | All bucket operations use this SDK |

### Files That Reference ObjectStorageService

| File | Purpose |
|------|---------|
| `server/objectStorage.ts` | Core service definition (326 lines) |
| `server/routes.ts` | 40+ references for upload/download operations |
| `server/residentPhotoWorker.ts` | Background photo upload worker |
| `server/backup-database.ts` | Database export to storage |

---

## Technical Implementation

### Environment Variables (3 Required)

Located in Replit Secrets/Environment Variables:

| Variable | Current Value | Purpose |
|----------|---------------|---------|
| `PUBLIC_OBJECT_SEARCH_PATHS` | `/replit-objstore-6e6b229a-.../public` | Comma-separated paths for public file search |
| `PRIVATE_OBJECT_DIR` | `/replit-objstore-6e6b229a-.../private` | Directory for private/authenticated files |
| `RESIDENT_PHOTOS_BUCKET` | `/replit-objstore-7384c998-.../resident-photos` | Dedicated bucket for resident complaint photos |

### Database Schema

Located in `shared/schema.ts`:

```typescript
// Resident Feedback Photo Queue (lines 3059-3088)
export const residentFeedbackPhotoQueue = pgTable("resident_feedback_photo_queue", {
  id: uuid("id").primaryKey().defaultRandom(),
  complaintId: uuid("complaint_id").notNull().references(() => complaints.id),
  objectKey: text("object_key").notNull(),        // Storage path: {complaintId}/{filename}
  payload: text("payload").notNull(),              // Base64 encoded file data
  contentType: text("content_type").notNull(),     // MIME type (image/jpeg, image/heic, etc.)
  status: text("status").notNull().default("pending"), // pending|uploading|uploaded|failed
  retryCount: integer("retry_count").notNull().default(0),
  lastError: text("last_error"),
  nextRetryAt: timestamp("next_retry_at"),
  uploadedUrl: text("uploaded_url"),               // Final URL after successful upload
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("IDX_photo_queue_status").on(table.status),
  index("IDX_photo_queue_complaint").on(table.complaintId),
  index("IDX_photo_queue_next_retry").on(table.nextRetryAt),
]);

// Photo Upload Status Constants
export const PHOTO_UPLOAD_STATUS = {
  pending: "pending",
  uploading: "uploading",
  uploaded: "uploaded",
  failed: "failed",
} as const;
```

**Database Fields That Store File URLs:**

| Table | Field | Storage Type | Content |
|-------|-------|--------------|---------|
| `users` | `photoUrl` | Public | Employee profile photos |
| `users` | `brandingLogoUrl` | Public | Company branding logos |
| `users` | `pwaAppIconUrl` | Public | PWA app icons |
| `projects` | `ropeAccessPlanUrl` | Public | Rope access plan PDFs |
| `projects` | `anchorInspectionCertificateUrl` | Public | Anchor inspection PDFs |
| `projects` | `documentUrls` | Public | Array of project document URLs |
| `projects` | `imageUrls` | Public | Array of project image URLs |
| `project_photos` | `imageUrl` | Public | Individual project photos |
| `complaints` | `photoUrl` | Resident Bucket | Resident complaint photos |
| `incident_reports` | `photoUrls` | Public | Array of incident scene photos |
| `quotes` | `photoUrls` | Public | Array of quote-related photos |
| `company_documents` | `fileUrl` | Public | Company document PDFs |
| `document_review_signatures` | `fileUrl` | Public | Signed document URLs |
| `superuser_task_attachments` | `storagePath` | Private | SuperUser task attachments |

### ObjectStorageService API

Located in `server/objectStorage.ts`:

```typescript
import { Storage, File } from "@google-cloud/storage";

// Replit sidecar endpoint for authentication
const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

export const objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: { type: "json", subject_token_field_name: "access_token" },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

export class ObjectStorageService {
  // ═══════════════════════════════════════════════════════════════════════════
  // PUBLIC FILES
  // ═══════════════════════════════════════════════════════════════════════════
  
  getPublicObjectSearchPaths(): string[] {
    const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || "";
    const paths = pathsStr.split(",").map(p => p.trim()).filter(p => p.length > 0);
    if (paths.length === 0) {
      throw new Error("PUBLIC_OBJECT_SEARCH_PATHS not set");
    }
    return paths;
  }
  
  async uploadPublicFile(fileName: string, fileBuffer: Buffer, contentType: string): Promise<string> {
    const publicPath = this.getPublicObjectSearchPaths()[0];
    const fullPath = `${publicPath}/${fileName}`;
    const { bucketName, objectName } = parseObjectPath(fullPath);
    const bucket = objectStorageClient.bucket(bucketName);
    const file = bucket.file(objectName);
    
    await file.save(fileBuffer, {
      metadata: { contentType },
      resumable: false,  // Better performance for small files
    });
    
    return `/public-objects/${fileName}`;  // URL path for client access
  }
  
  async searchPublicObject(filePath: string): Promise<File | null> {
    for (const searchPath of this.getPublicObjectSearchPaths()) {
      const fullPath = `${searchPath}/${filePath}`;
      const { bucketName, objectName } = parseObjectPath(fullPath);
      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectName);
      
      const [exists] = await file.exists();
      if (exists) return file;
    }
    return null;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PRIVATE FILES
  // ═══════════════════════════════════════════════════════════════════════════
  
  getPrivateObjectDir(): string {
    const dir = process.env.PRIVATE_OBJECT_DIR || "";
    if (!dir) throw new Error("PRIVATE_OBJECT_DIR not set");
    return dir;
  }
  
  async uploadPrivateFile(fileName: string, fileBuffer: Buffer, contentType: string): Promise<string> {
    const privateDir = this.getPrivateObjectDir();
    const fullPath = `${privateDir}/${fileName}`;
    const { bucketName, objectName } = parseObjectPath(fullPath);
    const bucket = objectStorageClient.bucket(bucketName);
    const file = bucket.file(objectName);
    
    await file.save(fileBuffer, {
      metadata: { contentType },
      resumable: false,
    });
    
    return `/api/private-documents/${fileName}`;
  }
  
  async getPrivateFile(fileName: string): Promise<File | null> {
    const privateDir = this.getPrivateObjectDir();
    const fullPath = `${privateDir}/${fileName}`;
    const { bucketName, objectName } = parseObjectPath(fullPath);
    const bucket = objectStorageClient.bucket(bucketName);
    const file = bucket.file(objectName);
    
    const [exists] = await file.exists();
    return exists ? file : null;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // RESIDENT PHOTOS (Dedicated Bucket)
  // ═══════════════════════════════════════════════════════════════════════════
  
  getResidentPhotosBucket(): string {
    const bucket = process.env.RESIDENT_PHOTOS_BUCKET || "";
    if (!bucket) throw new Error("RESIDENT_PHOTOS_BUCKET not set");
    return bucket;
  }
  
  async checkResidentPhotosBucketHealth(): Promise<{ ok: boolean; error?: string }> {
    try {
      const bucketPath = this.getResidentPhotosBucket();
      const { bucketName } = parseObjectPath(bucketPath);
      const bucket = objectStorageClient.bucket(bucketName);
      await bucket.getFiles({ maxResults: 1 });  // Verify access
      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }
  
  async uploadResidentPhoto(fileName: string, fileBuffer: Buffer, contentType: string): Promise<string> {
    const bucketPath = this.getResidentPhotosBucket();
    const fullPath = `${bucketPath}/${fileName}`;
    const { bucketName, objectName } = parseObjectPath(fullPath);
    const bucket = objectStorageClient.bucket(bucketName);
    const file = bucket.file(objectName);
    
    await file.save(fileBuffer, {
      metadata: { contentType },
      resumable: false,
    });
    
    return `/api/resident-photos/${fileName}`;
  }
  
  async getResidentPhoto(fileName: string): Promise<File | null> {
    const bucketPath = this.getResidentPhotosBucket();
    const fullPath = `${bucketPath}/${fileName}`;
    const { bucketName, objectName } = parseObjectPath(fullPath);
    const bucket = objectStorageClient.bucket(bucketName);
    const file = bucket.file(objectName);
    
    const [exists] = await file.exists();
    return exists ? file : null;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // FILE STREAMING
  // ═══════════════════════════════════════════════════════════════════════════
  
  async downloadObject(file: File, res: Response, cacheTtlSec: number = 3600) {
    const [metadata] = await file.getMetadata();
    
    res.set({
      "Content-Type": metadata.contentType || "application/octet-stream",
      "Content-Length": metadata.size,
      "Cache-Control": `public, max-age=${cacheTtlSec}`,
    });
    
    const stream = file.createReadStream();
    stream.pipe(res);
  }
  
  async downloadPublicFileAsBuffer(fileUrl: string): Promise<Buffer | null> {
    // Handles both relative (/public-objects/...) and absolute URLs
    const prefix = "/public-objects/";
    let filePath: string;
    
    if (fileUrl.startsWith("http")) {
      const url = new URL(fileUrl);
      const prefixIndex = url.pathname.indexOf(prefix);
      if (prefixIndex === -1) return null;
      filePath = url.pathname.substring(prefixIndex + prefix.length);
    } else if (fileUrl.startsWith(prefix)) {
      filePath = fileUrl.substring(prefix.length);
    } else {
      return null;
    }
    
    const file = await this.searchPublicObject(filePath);
    if (!file) return null;
    
    const [buffer] = await file.download();
    return buffer;
  }
}

// Helper: Parse bucket name and object name from full path
function parseObjectPath(path: string): { bucketName: string; objectName: string } {
  if (!path.startsWith("/")) path = `/${path}`;
  const parts = path.split("/");
  if (parts.length < 3) throw new Error("Invalid path: must contain bucket name");
  
  return {
    bucketName: parts[1],
    objectName: parts.slice(2).join("/"),
  };
}
```

### File Upload Configuration

#### Multer Configurations (File Size Limits)

| Configuration | Max Size | Allowed Types | Used By |
|---------------|----------|---------------|---------|
| `technicianUpload` | 10 MB | Images, PDFs | Registration, profile photos |
| `technicianDocumentUpload` | 10 MB | Images, PDFs | Resume, certifications, void cheque |
| `imageUpload` | 10 MB | Images only (incl. HEIC/HEIF) | Project photos, branding, logbook scans |
| `documentUpload` | 10 MB | Images, PDFs | Company documents, COI uploads |
| `verificationUpload` | 10 MB | Images only | IRATA/SPRAT certificate verification |
| `upload` (general) | 10 MB | PDFs only | Rope access plans, anchor certificates |
| `taskAttachmentUpload` | 25 MB | Images, PDFs, Office docs | SuperUser task attachments |
| `documentRequestUpload` | 25 MB | Any file type | Document request fulfillment |

#### File Type Validation

```typescript
// Standard image filter (most uploads)
fileFilter: (req, file, cb) => {
  const fileName = file.originalname.toLowerCase();
  const isHeicOrHeif = fileName.endsWith('.heic') || fileName.endsWith('.heif');
  const isImage = file.mimetype.startsWith('image/') || isHeicOrHeif;
  
  if (isImage) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

// Document filter (PDFs and images)
fileFilter: (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDFs are allowed'));
  }
};

// Task attachment filter (extended types)
const allowedTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png', 'image/jpeg', 'image/gif', 'image/webp',
];
```

### API Endpoints

#### File Serving Routes

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/public-objects/:filePath(*)` | GET | None | Serve public files (1hr cache) |
| `/api/private-documents/:fileName(*)` | GET | requireAuth | Serve private files (auth required) |
| `/api/resident-photos/:folderId/:fileName` | GET | None | Serve resident photos with HEIC conversion |

#### Upload Endpoints (Complete List)

**Profile & Branding:**
- `POST /api/technician-registration/:step` - Profile photo upload (step 1)
- `POST /api/company/branding/logo` - Company logo upload
- `POST /api/company/branding/pwa-icon` - PWA app icon upload

**Technician Documents:**
- `POST /api/technician/upload-document` - Upload technician documents
  - Types: `voidCheque`, `driversLicense`, `driversAbstract`, `firstAidCertificate`, `certificationCard`, `irataCertificationCard`, `spratCertificationCard`, `resume`
- `DELETE /api/technician/document` - Delete technician documents
  - Types: `bankDocuments`, `driversLicenseDocuments`, `firstAidDocuments`, `irataDocuments`, `spratDocuments`, `resumeDocuments`

**Project Documentation:**
- `POST /api/upload-rope-access-plan` - Rope access plan PDF
- `PATCH /api/projects/:id/rope-access-plan` - Update rope access plan
- `POST /api/upload-anchor-certificate` - Anchor inspection certificate
- `PATCH /api/projects/:id/anchor-certificate` - Update anchor certificate
- `POST /api/projects/:id/images` - Project photos

**Document Requests (Company to Technician):**
- `POST /api/technicians/document-requests/:id/files` - Upload files for document request (up to 10 files)

**Employee Documents:**
- `POST /api/upload-employee-document` - Upload document for any employee

**Certification Verification:**
- `POST /api/verify-irata-screenshot` - IRATA certificate screenshot for AI verification
- `POST /api/verify-sprat-screenshot` - SPRAT certificate screenshot for AI verification

**Property Manager Uploads:**
- `POST /api/property-managers/vendors/:linkId/projects/:projectId/anchor-inspection` - PM uploads anchor doc

**Safety & Operations:**
- `POST /api/complaints` - Resident complaint with photo (async queue)
- `POST /api/my-historical-hours/scan-logbook` - Logbook scan for IRATA hours
- `POST /api/company-documents` - Company document upload (incl. COI with AI expiry extraction)
- `POST /api/quotes/:id/photo` - Quote photos (up to 10)

**SuperUser Tasks:**
- `POST /api/superuser/tasks/:id/attachments` - Task attachment (private, 25MB limit)

---

## Async Photo Upload Queue System

### Background Worker

Located in `server/residentPhotoWorker.ts`:

```typescript
import { storage } from "./storage";
import { ObjectStorageService } from "./objectStorage";

const WORKER_INTERVAL_MS = 30000;  // Check every 30 seconds
const BATCH_SIZE = 5;              // Process up to 5 photos per cycle

let isRunning = false;
let workerInterval: NodeJS.Timeout | null = null;

async function processPhotoQueue() {
  if (isRunning) return;  // Prevent overlapping cycles
  isRunning = true;
  
  try {
    const pendingPhotos = await storage.getPendingPhotoUploads(BATCH_SIZE);
    if (pendingPhotos.length === 0) return;
    
    console.log(`[PhotoWorker] Processing ${pendingPhotos.length} queued photo(s)`);
    const objectStorageService = new ObjectStorageService();
    
    for (const photo of pendingPhotos) {
      try {
        await storage.markPhotoUploading(photo.id);
        
        const fileBuffer = Buffer.from(photo.payload, "base64");
        const uploadedUrl = await objectStorageService.uploadResidentPhoto(
          photo.objectKey,
          fileBuffer,
          photo.contentType
        );
        
        await storage.markPhotoUploaded(photo.id, uploadedUrl);
        await storage.updateComplaintPhotoUrl(photo.complaintId, uploadedUrl);
        
        console.log(`[PhotoWorker] Successfully uploaded photo for complaint ${photo.complaintId}`);
      } catch (error: any) {
        console.error(`[PhotoWorker] Upload failed for ${photo.id}: ${error.message}`);
        await storage.incrementPhotoRetry(photo.id, error.message);
      }
    }
  } finally {
    isRunning = false;
  }
}

export function startPhotoUploadWorker(): void {
  if (workerInterval) return;
  
  console.log(`[PhotoWorker] Starting (interval: ${WORKER_INTERVAL_MS / 1000}s)`);
  setTimeout(() => processPhotoQueue(), 5000);  // Initial run after 5s
  workerInterval = setInterval(processPhotoQueue, WORKER_INTERVAL_MS);
}

export async function runBucketHealthCheck(): Promise<boolean> {
  try {
    const objectStorageService = new ObjectStorageService();
    const health = await objectStorageService.checkResidentPhotosBucketHealth();
    
    if (!health.ok) {
      console.error("[PhotoWorker] HEALTH CHECK FAILED:", health.error);
      return false;
    }
    
    console.log("[PhotoWorker] Health check passed");
    return true;
  } catch (error: any) {
    console.error("[PhotoWorker] HEALTH CHECK FAILED:", error.message);
    return false;
  }
}
```

### Retry Logic with Exponential Backoff

Located in `server/storage.ts`:

```typescript
async incrementPhotoRetry(id: string, error: string): Promise<void> {
  const [entry] = await db.select().from(residentFeedbackPhotoQueue)
    .where(eq(residentFeedbackPhotoQueue.id, id));
  
  if (!entry) return;
  
  const newRetryCount = entry.retryCount + 1;
  
  // Exponential backoff: 30s, 2m, 10m, 30m, 1h
  const backoffMs = [
    30 * 1000,        // 30 seconds
    2 * 60 * 1000,    // 2 minutes
    10 * 60 * 1000,   // 10 minutes
    30 * 60 * 1000,   // 30 minutes
    60 * 60 * 1000,   // 1 hour
  ];
  
  const MAX_RETRIES = 5;
  
  if (newRetryCount >= MAX_RETRIES) {
    await this.markPhotoFailed(id, error);
    return;
  }
  
  const delayMs = backoffMs[Math.min(newRetryCount - 1, backoffMs.length - 1)];
  const nextRetryAt = new Date(Date.now() + delayMs);
  
  await db.update(residentFeedbackPhotoQueue).set({
    retryCount: newRetryCount,
    lastError: error,
    nextRetryAt,
    status: "pending",
    updatedAt: new Date(),
  }).where(eq(residentFeedbackPhotoQueue.id, id));
}
```

### Worker Startup

Located in `server/routes.ts` (end of file):

```typescript
// Start resident photo upload worker if bucket is healthy
runBucketHealthCheck().then(healthy => {
  if (healthy) {
    startPhotoUploadWorker();
  }
});
```

---

## HEIC to JPEG Conversion

### On-the-Fly Conversion for Resident Photos

Located in `server/routes.ts`:

```typescript
import convert from "heic-convert";

// Serve resident photos with HEIC conversion
app.get("/api/resident-photos/:folderId/:fileName", async (req: Request, res: Response) => {
  try {
    const objectStorageService = new ObjectStorageService();
    const fullPath = `${req.params.folderId}/${req.params.fileName}`;
    const file = await objectStorageService.getResidentPhoto(fullPath);
    
    if (!file) {
      return res.status(404).json({ message: "Photo not found" });
    }
    
    const [metadata] = await file.getMetadata();
    const contentType = metadata.contentType || "image/jpeg";
    const fileName = req.params.fileName.toLowerCase();
    const isHeic = fileName.endsWith(".heic") || fileName.endsWith(".heif");
    
    if (isHeic) {
      // Convert HEIC to JPEG for browser compatibility
      const chunks: Buffer[] = [];
      const stream = file.createReadStream();
      
      stream.on("data", (chunk: Buffer) => chunks.push(chunk));
      stream.on("end", async () => {
        try {
          const heicBuffer = Buffer.concat(chunks);
          const jpegBuffer = await convert({
            buffer: heicBuffer,
            format: "JPEG",
            quality: 0.9,
          });
          
          res.setHeader("Content-Type", "image/jpeg");
          res.setHeader("Cache-Control", "public, max-age=31536000");  // 1 year cache
          res.send(jpegBuffer);
        } catch (conversionError) {
          console.error("HEIC conversion error:", conversionError);
          // Fallback: send original (won't display in most browsers)
          res.setHeader("Content-Type", contentType);
          res.send(Buffer.concat(chunks));
        }
      });
    } else {
      // Non-HEIC: stream directly
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=31536000");
      file.createReadStream().pipe(res);
    }
  } catch (error) {
    console.error("Get resident photo error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
```

---

## AI-Powered File Processing

### Certificate of Insurance (COI) Expiry Extraction

When a Certificate of Insurance PDF is uploaded, Gemini AI automatically extracts the policy expiry date.

Located in `server/routes.ts` and `server/gemini.ts`:

```typescript
// In /api/company-documents POST handler
if (documentType === 'certificate_of_insurance') {
  console.log("[COI AI] Starting insurance expiry extraction");
  
  try {
    const pdfBase64 = req.file.buffer.toString("base64");
    const { extractInsuranceExpiryDate } = await import("./gemini");
    const result = await extractInsuranceExpiryDate(pdfBase64);
    
    if (result.expiryDate) {
      const extractedExpiryDate = new Date(result.expiryDate);
      if (!isNaN(extractedExpiryDate.getTime())) {
        await storage.updateCompanyDocument(document.id, { 
          insuranceExpiryDate: extractedExpiryDate 
        });
        console.log(`[COI AI] Extracted expiry: ${extractedExpiryDate.toISOString()}`);
      }
    }
  } catch (aiError) {
    console.error("[COI AI] Extraction error:", aiError);
    // Non-fatal: document still uploads, just without auto-extracted date
  }
}
```

**Manual Re-extraction Endpoint:**
- `POST /api/company-documents/:id/extract-expiry` - Re-run AI extraction for COI

### Logbook Page Scanning

Technicians can scan IRATA logbook pages to extract historical hours entries.

- `POST /api/my-historical-hours/scan-logbook` - Upload logbook image for AI analysis
- Valid MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/heic`, `image/heif`
- Returns parsed entries for technician to review and confirm

### Business Card Scanning

- `POST /api/clients/scan-business-card` - Upload business card for AI contact extraction
- Returns extracted: name, company, email, phone, address

---

## Database Backup System

### Backup Configuration

Located in `server/backup-database.ts`:

```typescript
const BACKUP_BUCKET = "replit-objstore-6e6b229a-26f3-44e3-8851-0347a883531e";
const BACKUP_PREFIX = "private/backups/database/";
const MAX_BACKUPS = 28;  // Keep 28 days of backups

// Tables included in backup (68 total)
const tables: TableConfig[] = [
  { name: "sessions", table: schema.sessions },
  { name: "license_keys", table: schema.licenseKeys },
  { name: "users", table: schema.users },
  { name: "buildings", table: schema.buildings },
  // ... 64 more tables
];
```

### Backup Process

```typescript
async function createBackup(): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFolder = `${BACKUP_PREFIX}${timestamp}`;
  
  // Delete old backups first (keep MAX_BACKUPS)
  const existingBackups = await listExistingBackups();
  await deleteOldBackups(existingBackups);
  
  // Export each table as JSON
  for (const { name, table } of tables) {
    const data = await db.select().from(table);
    const jsonContent = JSON.stringify(data, null, 2);
    
    const bucket = objectStorageClient.bucket(BACKUP_BUCKET);
    const file = bucket.file(`${backupFolder}/${name}.json`);
    await file.save(jsonContent, {
      metadata: { contentType: "application/json" },
    });
  }
  
  console.log(`Backup created: ${backupFolder}`);
}
```

---

## Multi-Tenant Considerations

### Data Isolation

- **Company Level**: Files organized by company in path (e.g., `company-{id}/document.pdf`)
- **Employee Level**: Profile photos stored with user ID in filename
- **Resident Level**: Complaint photos organized by complaint ID (company-agnostic)

### Access Control Patterns

```typescript
// Private files require authentication
app.get("/api/private-documents/:fileName(*)", requireAuth, async (req, res) => {
  // Only authenticated users can access private documents
  const file = await objectStorageService.getPrivateFile(fileName);
  // ...
});

// Public files accessible without auth (but URLs are unguessable)
app.get("/public-objects/:filePath(*)", async (req, res) => {
  // No auth required, but path contains unique IDs
  const file = await objectStorageService.searchPublicObject(filePath);
  // ...
});
```

---

## Safety & Compliance

### Safety-Critical Elements

- **Safety Documentation Storage**: Harness inspections, FLHA forms, incident reports stored for compliance audits
- **Failure Mode**: Storage unavailability prevents PDF generation/export
- **Mitigation**: Async queue for resident photos ensures submission success; PDF generation gracefully fails with user notification

### Regulatory Requirements

- **Document Retention**: Safety documents remain accessible for audit purposes
- **Audit Trail**: File URLs stored in database with creation timestamps
- **Data Integrity**: Files immutable once uploaded; new versions get new URLs

---

## Field Worker Experience

### Mobile Considerations

- **Touch Targets**: Upload buttons sized for gloved hands (minimum 44x44px)
- **Offline Mode**: File uploads require connectivity; queue system handles intermittent connections
- **Data Sync**: Resident photos queue locally in database until storage is available

### Common Workflows

1. **Profile Photo Upload**: Technician registration step 1 captures photo
2. **Project Documentation**: Supervisor uploads rope access plan PDF
3. **Incident Documentation**: Photos captured and uploaded with incident report
4. **Resident Complaint**: Photo submission queued asynchronously

---

## Error Handling & Recovery

### Common Errors

| Error | Cause | User Message | Recovery Action |
|-------|-------|--------------|-----------------|
| `PUBLIC_OBJECT_SEARCH_PATHS not set` | Missing env var | (App crash) | Configure env var in Replit |
| `RESIDENT_PHOTOS_BUCKET not set` | Missing env var | (Worker disabled) | Configure env var in Replit |
| Upload timeout | Large file or slow connection | "Upload failed, please try again" | Retry upload |
| HEIC conversion failed | Corrupted file | (Fallback to original) | User sees broken image |
| Photo queue max retries | Persistent storage outage | Status shows "failed" | Admin intervention needed |

### Graceful Degradation

- **Storage Outage**: Resident photos queue in database; worker retries automatically
- **HEIC Conversion Failure**: Original file served (displays only in Safari)
- **Backup Failure**: Logged to console; previous backups remain intact

---

## Testing Requirements

### Unit Tests

```typescript
describe("ObjectStorageService", () => {
  test("should throw error if PUBLIC_OBJECT_SEARCH_PATHS not set", () => {
    delete process.env.PUBLIC_OBJECT_SEARCH_PATHS;
    const service = new ObjectStorageService();
    expect(() => service.getPublicObjectSearchPaths()).toThrow();
  });
  
  test("should parse object path correctly", () => {
    const result = parseObjectPath("/bucket-name/folder/file.jpg");
    expect(result.bucketName).toBe("bucket-name");
    expect(result.objectName).toBe("folder/file.jpg");
  });
});
```

### Integration Tests

- **Multi-tenant isolation**: Verify files cannot be accessed cross-company
- **Upload/download cycle**: Upload file, verify downloadable with correct content-type
- **HEIC conversion**: Upload .heic, verify .jpeg response
- **Queue retry**: Simulate failure, verify exponential backoff timing

### Health Check Testing

```bash
# Verify worker health check on startup
grep -i "health check" /tmp/logs/*.log

# Expected output:
# [PhotoWorker] Health check passed - Resident photos bucket is accessible
# [PhotoWorker] Starting resident photo upload worker (interval: 30s)
```

---

## Monitoring & Maintenance

### Key Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Photo queue pending count | < 10 | > 50 pending photos |
| Photo queue failed count | 0 | > 5 failed uploads |
| Worker cycle time | < 5s | > 30s per cycle |
| Backup age | < 24 hours | > 48 hours since last backup |

### Regular Maintenance

- **Daily**: Check photo queue for failed entries
- **Weekly**: Verify backup files exist and are recent
- **Monthly**: Review storage usage and costs

---

## Troubleshooting Guide

### Issue: "PUBLIC_OBJECT_SEARCH_PATHS not set" Error

**Symptoms**: App crashes on any file operation
**Diagnosis Steps**:
1. Check Replit Secrets for `PUBLIC_OBJECT_SEARCH_PATHS`
2. Verify format: `/bucket-name/public` (starts with `/`)

**Solution**:
1. Go to Replit Secrets (lock icon in sidebar)
2. Add key `PUBLIC_OBJECT_SEARCH_PATHS`
3. Value: `/replit-objstore-XXXX/public` (get bucket name from App Storage tool)

**Prevention**: Document all required env vars in setup guide

---

### Issue: Resident Photos Not Displaying

**Symptoms**: Complaint photos show as broken images
**Diagnosis Steps**:
1. Check browser console for 404 errors
2. Verify photo URL format: `/api/resident-photos/{complaintId}/{filename}`
3. Check photo queue status: `SELECT * FROM resident_feedback_photo_queue WHERE status != 'uploaded'`

**Solution**:
- If queue shows "pending": Worker may be stopped, check logs
- If queue shows "failed": Check `lastError` column for details
- If no queue entry: Photo wasn't queued during submission

---

### Issue: iPhone Photos Not Converting

**Symptoms**: HEIC files download instead of displaying
**Diagnosis Steps**:
1. Check server logs for "HEIC conversion error"
2. Verify `heic-convert` package is installed

**Solution**:
```bash
npm install heic-convert
```

**Prevention**: Include `heic-convert` in package.json dependencies

---

### Issue: Worker Not Starting

**Symptoms**: Console shows "HEALTH CHECK FAILED"
**Diagnosis Steps**:
1. Verify `RESIDENT_PHOTOS_BUCKET` env var is set
2. Check bucket exists in App Storage tool
3. Verify bucket path format: `/bucket-name/resident-photos`

**Solution**:
1. Create bucket in Replit App Storage if missing
2. Set `RESIDENT_PHOTOS_BUCKET` to correct path
3. Restart application

---

## Related Documentation

- `white-label-branding-instructions-v1.0.md` - Logo upload uses App Storage
- `resident-dashboard-instructions-v1.0.md` - Photo submission uses async queue
- `1. GUIDING_PRINCIPLES.md` - Core philosophy for system design

---

## Version History

- **v1.0** (December 20, 2025): Initial comprehensive documentation
  - Documented both storage buckets (main + resident photos)
  - Detailed ObjectStorageService API with all methods
  - Documented async photo upload queue with retry logic
  - Added HEIC to JPEG conversion documentation
  - Included database backup system documentation
  - Added 16+ upload endpoint inventory
  - Created troubleshooting guide with common issues
