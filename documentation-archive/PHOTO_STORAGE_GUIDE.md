# Photo Storage System Documentation

## Overview
This Rope Access Management Platform uses Replit's App Storage (backed by Google Cloud Storage) for all photo and document uploads. The system is configured to handle both **public** and **private** files with proper access controls.

---

## Storage Architecture

### 1. Storage Bucket
- **Bucket Name**: `rope-access-files`
- **Provider**: Google Cloud Storage (via Replit App Storage)
- **Location**: Managed automatically by Replit

### 2. Directory Structure
```
rope-access-files/
├── public/              # Publicly accessible files
│   ├── complaints/      # Complaint photos
│   ├── quotes/          # Quote photos
│   └── projects/        # Project-related photos
└── private/             # Private, access-controlled files
    ├── employee-docs/   # Employee documents (licenses, certifications)
    └── company-docs/    # Company documents
```

---

## File Categories

### Public Files (No Authentication Required)
These files are uploaded to `/rope-access-files/public/` and are accessible via public URLs:

1. **Complaint Photos**
   - Path: `complaints/{companyId}/{timestamp}-{filename}`
   - Upload Endpoint: `POST /api/complaints` (with photo)
   - Access URL: `/public-objects/complaints/{companyId}/{timestamp}-{filename}`
   - Use Case: Resident-submitted complaint photos
   - Access: Anyone with the URL

2. **Quote Photos**
   - Path: `quotes/{companyId}/{timestamp}-{filename}`
   - Upload Endpoint: `POST /api/quotes/:id/photo`
   - Access URL: `/public-objects/quotes/{companyId}/{timestamp}-{filename}`
   - Use Case: Work quote photos
   - Access: Anyone with the URL

3. **Project Photos**
   - Path: `project-photos/{companyId}/{timestamp}-{filename}`
   - Upload Endpoint: `POST /api/projects/:id/photos`
   - Access URL: `/public-objects/project-photos/{companyId}/{timestamp}-{filename}`
   - Use Case: Project documentation photos
   - Access: Anyone with the URL

### Private Files (Authentication Required)
These files are uploaded to `/rope-access-files/private/` and require authentication:

1. **Employee Documents**
   - Path: `employee-docs/{employeeId}/{documentType}-{timestamp}-{filename}`
   - Upload Endpoint: `POST /api/upload-employee-document`
   - Access URL: `/api/private-documents/employee-docs/{employeeId}/{documentType}-{timestamp}-{filename}`
   - Use Case: Driver's licenses, certifications, training records
   - Access: Authenticated users from the same company only

2. **Company Documents**
   - Path: `company-documents/{documentType}-{timestamp}-{filename}`
   - Upload Endpoint: `POST /api/upload-company-document`
   - Access URL: `/api/private-documents/company-documents/{documentType}-{timestamp}-{filename}`
   - Use Case: Company-wide documents
   - Access: Authenticated company users only

---

## Upload Process

### Backend Flow
1. **File Reception**
   - Uses `multer.memoryStorage()` to receive file in memory
   - Validates file type and size (5MB max for images, 10MB max for PDFs)

2. **Storage Upload**
   - Calls `ObjectStorageService.uploadPublicFile()` or `uploadPrivateFile()`
   - Generates unique filename with timestamp
   - Uploads to Google Cloud Storage bucket
   - Returns access URL

3. **Database Storage**
   - Stores the returned URL in PostgreSQL database
   - Associates file with related entity (employee, complaint, quote, etc.)

### Frontend Display
Files are accessed by making requests to the stored URLs:
- **Public files**: Direct browser request to `/public-objects/...`
- **Private files**: Authenticated request to `/api/private-documents/...`

---

## Environment Variables

The following environment variables control storage behavior:

```env
# Public file storage paths (comma-separated)
PUBLIC_OBJECT_SEARCH_PATHS=/rope-access-files/public

# Private file storage directory
PRIVATE_OBJECT_DIR=/rope-access-files/private
```

---

## Security

### Public Files
- No authentication required
- URL-based access
- Suitable for non-sensitive data like complaint photos
- Cache-Control: `public, max-age=3600`

### Private Files
1. **Authentication Required**
   - User must be logged in via Express session
   - Session verified on every request

2. **Authorization Checks**
   - Employee documents: User must be from same company as employee
   - Company documents: User must belong to the company
   - Admin/CEO roles have full access to company documents

3. **Access Control**
   - Files served through API endpoints with middleware checks
   - Direct bucket access is blocked
   - Cache-Control: `private, max-age=3600`

---

## File Size Limits

| File Type | Max Size | Validation |
|-----------|----------|------------|
| Images (JPG, PNG, GIF, WebP) | 5 MB | `multer` file filter |
| PDFs | 10 MB | `multer` file filter |
| Other documents | Not allowed | Rejected by upload |

---

## Setup Instructions

### Initial Setup (One-Time)
1. **Create Storage Bucket**
   - Open Replit workspace
   - Click **"Tools"** in left sidebar
   - Select **"App Storage"** or **"Object Storage"**
   - Click **"Create Bucket"**
   - Enter name: `rope-access-files`
   - Click **"Create"**

2. **Environment Variables** (Already Configured)
   - `PUBLIC_OBJECT_SEARCH_PATHS=/rope-access-files/public`
   - `PRIVATE_OBJECT_DIR=/rope-access-files/private`

3. **Restart Application**
   - Bucket creation automatically authorizes the app
   - Uploads will work immediately

---

## Testing Uploads

### Test Public Upload (Complaint Photo)
1. Navigate to Dashboard → Complaints
2. Create a new complaint with a photo
3. Upload should succeed
4. Photo should be visible immediately

### Test Private Upload (Employee Document)
1. Navigate to Dashboard → Employees
2. Edit an employee
3. Upload a driver's license photo
4. Upload should succeed
5. Document should be accessible in employee profile

---

## Troubleshooting

### Error: "no allowed resources" (401)
**Cause**: Bucket doesn't exist or app isn't authorized
**Solution**: Create the `rope-access-files` bucket in App Storage tool

### Error: "PUBLIC_OBJECT_SEARCH_PATHS not set"
**Cause**: Environment variable missing
**Solution**: Set `PUBLIC_OBJECT_SEARCH_PATHS=/rope-access-files/public`

### Error: "PRIVATE_OBJECT_DIR not set"
**Cause**: Environment variable missing
**Solution**: Set `PRIVATE_OBJECT_DIR=/rope-access-files/private`

### Upload succeeds but file not accessible
**Cause**: Incorrect URL or missing authentication
**Solution**: 
- Public files: Use `/public-objects/...` prefix
- Private files: Use `/api/private-documents/...` prefix with valid session

---

## Code References

### Server-Side
- **ObjectStorageService**: `server/objectStorage.ts`
- **Upload Routes**: `server/routes.ts`
  - Line ~2360: Employee document upload
  - Line ~2400: Project photo upload
  - Line ~4280: Complaint photo upload
  - Line ~6168: Quote photo upload

### File Serving
- **Public Files**: `GET /public-objects/:filePath(*)` (Line ~2440)
- **Private Files**: `GET /api/private-documents/:filePath(*)` (Line ~2450)

---

## Maintenance

### Monitoring Storage Usage
- Check Replit Dashboard → Usage page
- Monitor file counts and sizes
- Set up alerts for storage limits

### Cleanup Old Files
Files are never automatically deleted. To clean up:
1. Access App Storage tool
2. Browse `rope-access-files` bucket
3. Manually delete old/unused files
4. Update database to remove file references

---

## Best Practices

1. **Always include timestamp in filenames** to prevent collisions
2. **Validate file types** before upload to prevent malicious files
3. **Use descriptive paths** to organize files logically
4. **Store URLs in database** for easy retrieval
5. **Check authentication** for all private file access
6. **Set appropriate cache headers** for performance
7. **Log upload errors** for debugging
8. **Test uploads** after any storage configuration changes

---

## Future Enhancements

- [ ] Automatic image compression/optimization
- [ ] Thumbnail generation for photos
- [ ] Bulk file upload support
- [ ] File expiration/cleanup automation
- [ ] Direct upload from mobile camera
- [ ] Image annotation/markup tools
