# Resident Portal

Two-way feedback system connecting building residents with service providers.

## Overview

The Resident Portal creates a direct communication channel between building residents and rope access service providers. Residents can submit issues with photo evidence, track status, and receive updates. Vendors manage feedback centrally, improving response times and resident satisfaction.

## Portal Navigation

The Resident Portal has five main tabs:

1. **Progress** - View real-time project completion status
2. **My Photos** - Access photos related to your building's work
3. **Submit** - Submit new feedback or concerns
4. **Feedback** - View your feedback history and status
5. **Notices** - Read official work notices from your building

## The Company Code (10-Character Code)

The **Company Code** is a 10-character alphanumeric code that connects residents to their service provider. This is sometimes called the "vendor code" or "company number".

### What is the Company Code?
- A unique 10-character code assigned to each rope access company
- Residents enter this code after creating their account
- It binds the resident's account to the correct service company
- Without it, the resident's control panel will be empty

### How to Get the Company Code
Residents can obtain the company code from:
1. Their building manager or strata council
2. The rope access service company directly
3. Notices posted in common areas during work

### Where to Enter the Company Code
After logging into the Resident Portal for the first time:
1. Go to onrope.pro/resident
2. Look for the "Enter Company Code" field on your dashboard
3. Enter the 10-character code provided
4. Click submit to link your account

**Important**: Active work and building information won't appear until you've entered the company code.

## The Access Formula

```
Company Code + Strata/LMS Number = Full Portal Access
```

Residents need both pieces of information:
- **Company Code**: The 10-character code from the service company (one code per company, not per building)
- **Strata/LMS Number**: Your building's strata plan identifier

This creates a portable account system. As vendors add more buildings, the network grows.

## Key Features

### Progress Tab

View real-time project completion with visual progress indicators:

- **Total Drops Summary** - Shows overall completion (e.g., "22 of 50 Total Drops Complete")
- **Elevation Breakdown** - Progress for each building face (North, East, South, West)
- **Visual Fill Bars** - Intuitive fill-level indicators showing completion percentage
- **Detailed Stats** - Shows drops completed vs total (e.g., "4/12" for North elevation at 33%)

The progress display updates automatically as technicians complete their work, giving you real-time visibility into project status.

### Submit Feedback Tab

Submit concerns or questions directly to the service team:

**Required Fields:**
- **Your Name** - Pre-filled from your account
- **Phone Number** - Contact number for follow-up
- **Unit Number** - Your apartment or suite number
- **Which Project?** - Select from active projects at your building
- **Message** - Describe your concern or question

**Optional:**
- **Photo Attachment** - Upload images showing the issue

After submission, your feedback appears in the Feedback tab where you can track its status.

### Feedback History Tab

View the status of all your submitted feedback:

- **Feedback List** - All your submissions in one place
- **Status Badges** - Color-coded status indicators
  - **Open** (Green) - Awaiting review by the service team
  - **In Progress** - Currently being addressed
  - **Closed** - Issue has been resolved
- **Submission Details** - Unit number and date for each item
- **Response Thread** - View replies from the service team

### Work Notices Tab

Access official notices about work at your building:

- **Official Notices** - Important announcements with header badges
- **Work Period** - Scheduled dates (e.g., "Thu, Dec 11 - Thu, Jan 8, 2026")
- **Service Type** - Badge showing the type of work (e.g., "Window Cleaning")
- **Notice Content** - Full details including:
  - Privacy notices and recommendations
  - Safety requirements
  - What to expect during work
- **View/PDF Options** - Read online or download as PDF

Notices include important information like:
- Closing blinds/curtains during work hours
- Keeping windows and balcony doors closed
- Securing loose items on balconies

### For Vendors (Rope Access Companies)

#### Feedback Dashboard
- View all resident submissions
- Filter by building
- Sort by status
- Search by content

#### Response Management
- Mark issues as viewed (timestamp recorded)
- Add internal notes (not visible to resident)
- Reply to resident (visible reply)
- Close resolved issues

#### Building Association
- Link buildings to your company
- Residents at linked buildings can submit feedback
- One vendor code serves all your buildings

### For Property Managers

#### Read-Only Oversight
- View feedback for managed buildings
- Monitor vendor responsiveness
- See resolution status
- Cannot create or modify submissions

## How It Works

### Resident Access
1. Resident visits onrope.pro/resident
2. Enters vendor code (provided by building management)
3. Enters their Strata/LMS number
4. Creates account or logs in
5. Accesses all five portal tabs

### Vendor Workflow
1. Navigate to Resident Feedback
2. View new submissions
3. Click to view details
4. Add internal note or reply to resident
5. Mark as closed when resolved

### Property Manager View
1. Access My Vendors dashboard
2. Navigate to resident feedback section
3. View all feedback for managed buildings (read-only)

## Photo Upload System

The resident portal uses a resilient photo upload system:

### Supported Formats
- **JPEG, PNG, WebP** - Standard image formats
- **HEIC, HEIF** - iPhone photo formats fully supported
- **Maximum file size**: 10MB

### How It Works
1. When you submit feedback with a photo, your message is saved immediately
2. The photo is queued for upload in the background
3. A background worker processes the upload automatically
4. If storage is temporarily unavailable, the system retries with increasing delays (30 seconds, 2 minutes, 10 minutes, 30 minutes, 1 hour)
5. After 5 failed attempts, the photo is marked as failed but your feedback remains intact

### Photo Status Messages
- **"Photo is being uploaded in the background"** - Upload is queued and processing
- **"Photo could not be saved but your feedback was received"** - Queue failed but feedback was saved

### Why This Matters
Your feedback is never lost due to temporary storage issues. The system prioritizes saving your message first, then handles photos separately.

## What Does NOT Exist

- Residents cannot view photo galleries (no gallery feature)
- Residents cannot reopen closed issues (only vendor can)
- No /link?code= URL for building linking
- No building codes for access (only vendor code + Strata/LMS)

## Benefits

### For Residents
- Real-time project progress visibility
- Easy feedback submission
- Track resolution status
- Direct communication with service provider
- Photo evidence capability
- Official work notices access

### For Vendors
- Centralized feedback management
- Documented response history
- Improved resident relations
- Reduced phone calls

### For Property Managers
- Visibility into vendor responsiveness
- Oversight without administrative burden
- Documentation for building records

## Portable Accounts Network Effect

As more buildings connect through the same vendor code:
- Residents who move can reconnect easily
- Vendors build reputation across properties
- Network value increases for everyone

## Common Questions

**Q: How do residents get the vendor code?**
A: Building management provides the vendor code (from the rope access company).

**Q: Can residents see other residents' submissions?**
A: No, residents only see their own submissions.

**Q: What if a resident submits to the wrong building?**
A: The Strata/LMS number ensures submissions are routed correctly.

**Q: Can issues be reopened?**
A: Only the vendor can reopen a closed issue.

**Q: What happens if my photo fails to upload?**
A: Your feedback is saved immediately regardless of photo status. The system automatically retries photo uploads up to 5 times. If all retries fail, your feedback remains without the photo.

**Q: How long does photo upload take?**
A: Photos typically upload within 30 seconds. You can check status in your feedback history.

**Q: How do I know when technicians are working?**
A: Check the Notices tab for official work schedules with specific dates and requirements.

**Q: Can I track progress on my building's project?**
A: Yes, the Progress tab shows real-time completion percentages for each building elevation.

## Related Modules

- [Property Manager Interface](/help/modules/property-manager-interface)
- [Project Management](/help/modules/project-management)
