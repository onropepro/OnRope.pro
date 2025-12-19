# Resident Portal

Two-way feedback system connecting building residents with service providers.

## Overview

The Resident Portal creates a direct communication channel between building residents and rope access service providers. Residents can submit issues with photo evidence, track status, and receive updates. Vendors manage feedback centrally, improving response times and resident satisfaction.

## The Golden Rule

```
Vendor Code + Strata/LMS Number = Access
```

Residents access the portal using:
- **Vendor Code**: ONE unique code per company (not per building)
- **Strata/LMS Number**: Identifies their specific building

This creates a portable account system. As vendors add more buildings, the network grows.

## Key Features

### For Residents

#### Issue Submission
- Report maintenance issues
- Upload photo evidence
- Describe the problem
- Select issue category

#### Status Tracking
Issues move through statuses:
- **New**: Just submitted
- **Viewed**: Vendor has seen it
- **Closed**: Issue resolved

#### Communication
- Receive updates on submitted issues
- View vendor replies
- Track resolution progress

#### Resilient Photo Uploads
Photos are uploaded reliably even during temporary storage issues:
- Your feedback is saved immediately (photos never block submission)
- Photos upload in the background automatically
- If upload fails, the system retries up to 5 times with increasing delays
- You receive confirmation that your photo is being processed

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
1. Resident visits the portal
2. Enters vendor code (provided by building management)
3. Enters their Strata/LMS number
4. Creates account or logs in
5. Submits and tracks issues

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
- Easy way to report issues
- Track resolution status
- Direct communication with service provider
- Photo evidence capability

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

## Related Modules

- [Property Manager Interface](/help/modules/property-manager-interface)
- [Project Management](/help/modules/project-management)
